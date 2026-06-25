#!/usr/bin/env node
'use strict';

/**
 * Dependency Guard — ARIS-841 (GAP-U02 S2)
 *
 * package.json / pyproject.toml / Gemfile / requirements.txt 変更時に
 * 既知脆弱性をチェックする。
 *
 * 動作:
 *   1. ファイル変更検知
 *   2. npm audit / pip-audit / safety が利用可能なら実行
 *   3. High/Critical 検出時は warn（PostToolUse なのでblockはしない）
 *   4. 結果を .context/dependency-audit.jsonl に記録
 *
 * 未インストール時は skip（fail-open）。
 * CI/CD では別途 Dependabot 等で補完する前提。
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

let input;
try {
  input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
} catch {
  console.log(JSON.stringify({ continue: true }));
  process.exit(0);
}

const tool = input.tool_name;
if (tool !== 'Edit' && tool !== 'Write') {
  console.log(JSON.stringify({ continue: true }));
  process.exit(0);
}

const filePath = (input.tool_input || {}).file_path || '';
const basename = path.basename(filePath);

// 依存関係ファイルのみ対象
const DEP_FILES = new Set(['package.json', 'pyproject.toml', 'requirements.txt', 'Gemfile', 'Cargo.toml', 'go.mod']);
if (!DEP_FILES.has(basename)) {
  console.log(JSON.stringify({ continue: true }));
  process.exit(0);
}

const CWD = process.cwd();
const AUDIT_LOG = path.join(CWD, '.context', 'dependency-audit.jsonl');

// rapid-fire防止（1時間以内の重複実行回避）
try {
  if (fs.existsSync(AUDIT_LOG)) {
    const lines = fs.readFileSync(AUDIT_LOG, 'utf8').trim().split('\n').filter(Boolean);
    if (lines.length > 0) {
      const last = JSON.parse(lines[lines.length - 1]);
      if (last.file === basename && Date.now() - new Date(last.ts).getTime() < 60 * 60 * 1000) {
        console.log(JSON.stringify({ continue: true }));
        process.exit(0);
      }
    }
  }
} catch {}

function hasCommand(cmd) {
  const r = spawnSync('which', [cmd], { encoding: 'utf8' });
  return r.status === 0;
}

let result = null;
let highCritical = 0;

try {
  if (basename === 'package.json' && hasCommand('npm')) {
    const projectDir = path.dirname(filePath);
    const r = spawnSync('npm', ['audit', '--json', '--audit-level=high'], {
      cwd: projectDir, encoding: 'utf8', timeout: 30000,
    });
    try {
      const json = JSON.parse(r.stdout);
      const metadata = json.metadata?.vulnerabilities || {};
      highCritical = (metadata.high || 0) + (metadata.critical || 0);
      result = { tool: 'npm', high: metadata.high || 0, critical: metadata.critical || 0 };
    } catch {}
  } else if (basename === 'pyproject.toml' || basename === 'requirements.txt') {
    if (hasCommand('pip-audit')) {
      const r = spawnSync('pip-audit', ['--format', 'json'], {
        encoding: 'utf8', timeout: 30000,
      });
      try {
        const json = JSON.parse(r.stdout);
        const dependencies = json.dependencies || [];
        const vulns = dependencies.flatMap(d => d.vulns || []);
        highCritical = vulns.filter(v => /high|critical/i.test(v.severity || '')).length;
        result = { tool: 'pip-audit', total: vulns.length, high_critical: highCritical };
      } catch {}
    } else if (hasCommand('safety')) {
      const r = spawnSync('safety', ['check', '--json'], {
        encoding: 'utf8', timeout: 30000,
      });
      try {
        const json = JSON.parse(r.stdout);
        highCritical = Array.isArray(json) ? json.length : 0;
        result = { tool: 'safety', vulnerabilities: highCritical };
      } catch {}
    }
  }
} catch {}

// 結果記録
try {
  fs.mkdirSync(path.dirname(AUDIT_LOG), { recursive: true });
  fs.appendFileSync(AUDIT_LOG, JSON.stringify({
    ts: new Date().toISOString(),
    file: basename,
    result: result || { tool: 'none', note: 'no scanner available' },
  }) + '\n');
} catch {}

if (highCritical > 0) {
  console.log(JSON.stringify({
    continue: true,
    systemMessage: `🛡️ Dependency Guard (ARIS-841): High/Critical脆弱性 ${highCritical}件検出\n`
      + `ファイル: ${basename}\n`
      + `対応: ${result?.tool} audit の結果を確認し、脆弱性を修正してください。`,
  }));
} else if (result === null) {
  console.log(JSON.stringify({
    continue: true,
    systemMessage: `🛡️ Dependency Guard: スキャナー未インストール（npm/pip-audit/safety）\n`
      + `推奨: npm install -g npm-audit または pip install pip-audit`,
  }));
} else {
  console.log(JSON.stringify({ continue: true }));
}
