#!/usr/bin/env node
'use strict';

/**
 * Mutation Test Runner — ARIS-805 (GAP-001 S2)
 *
 * qa-round-gate.js が mutation_score 70% 以上を要求するが、
 * mutmut/Stryker の実行が手動だった問題を解決。
 *
 * Round 3 進入時に自動実行:
 *   1. mutmut/Stryker 利用可能なら使用
 *   2. 未インストール時は簡易ミューテーション（主要演算子変異）で代替
 *   3. スコアを QA台帳 `mutation_score:` に機械記入
 *   4. 閾値70%未満はblock
 *
 * Usage:
 *   node mutation-test-runner.js --qa-file docs/qa/X_qa.md --src-dir src/ --test-cmd "pytest tests/"
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const args = process.argv.slice(2);
function getArg(name) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : null;
}

const qaFile = getArg('qa-file');
const srcDir = getArg('src-dir') || 'src';
const testCmd = getArg('test-cmd') || 'python3 -m pytest';

if (!qaFile) {
  console.error('Usage: mutation-test-runner.js --qa-file <path> [--src-dir src] [--test-cmd "pytest"]');
  process.exit(1);
}

// --- mutmut 利用可能チェック ---
function hasCommand(cmd) {
  const r = spawnSync('which', [cmd], { encoding: 'utf8' });
  return r.status === 0;
}

const hasMutmut = (() => {
  try { execSync('python3 -c "import mutmut"', { stdio: 'pipe' }); return true; }
  catch { return false; }
})();
const hasStryker = hasCommand('stryker') || hasCommand('npx');

console.log(`Mutation Test Runner (ARIS-805)`);
console.log(`  mutmut: ${hasMutmut ? 'installed' : 'not found'}`);
console.log(`  stryker: ${hasStryker ? 'available' : 'not found'}`);

// --- Python: 簡易ミューテーション（mutmut未インストール時の代替）---
function simpleMutatePython(sourceFiles) {
  const mutations = [
    // 比較演算子
    { pattern: />=/g, replacement: '>' },
    { pattern: /<=/g, replacement: '<' },
    { pattern: /==/g, replacement: '!=' },
    { pattern: /!=/g, replacement: '==' },
    // 論理演算子
    { pattern: / and /g, replacement: ' or ' },
    // 定数
    { pattern: /\breturn True\b/g, replacement: 'return False' },
    { pattern: /\breturn False\b/g, replacement: 'return True' },
    // デフォルト値
    { pattern: /=\s*None\b/g, replacement: '= ""' },
  ];

  let killed = 0, survived = 0, total = 0;
  const results = [];

  for (const file of sourceFiles) {
    const original = fs.readFileSync(file, 'utf8');
    for (const mut of mutations) {
      // ファイル内に該当パターンがあるか
      if (!mut.pattern.test(original)) continue;
      mut.pattern.lastIndex = 0;

      // 最初の1箇所だけ変異
      const modified = original.replace(mut.pattern, mut.replacement.length > 1 ? (m) => mut.replacement : mut.replacement);
      if (modified === original) continue;

      // バックアップ→変異→テスト実行→復元
      fs.writeFileSync(file, modified);
      const testResult = spawnSync('sh', ['-c', testCmd], { encoding: 'utf8', timeout: 60000 });
      fs.writeFileSync(file, original);

      total++;
      // テスト失敗（exit code != 0）= mutant killed
      if (testResult.status !== 0) {
        killed++;
        results.push({ file: path.basename(file), mutation: `${mut.pattern.source} → ${mut.replacement}`, status: 'KILLED' });
      } else {
        survived++;
        results.push({ file: path.basename(file), mutation: `${mut.pattern.source} → ${mut.replacement}`, status: 'SURVIVED' });
      }
    }
  }

  return { killed, survived, total, results };
}

// --- 対象ファイル収集 ---
function collectPythonFiles(dir) {
  const files = [];
  function walk(d) {
    try {
      for (const entry of fs.readdirSync(d)) {
        const full = path.join(d, entry);
        const stat = fs.statSync(full);
        if (stat.isDirectory() && !entry.startsWith('.') && entry !== '__pycache__' && entry !== 'node_modules') {
          walk(full);
        } else if (entry.endsWith('.py') && !entry.startsWith('test_') && !entry.startsWith('_')) {
          files.push(full);
        }
      }
    } catch {}
  }
  walk(dir);
  return files;
}

// --- 実行 ---
let score = 0, killed = 0, total = 0, tool = 'none';

if (hasMutmut) {
  // mutmut を使う
  tool = 'mutmut';
  try {
    const output = execSync(`python3 -m mutmut run --paths-to-mutate ${srcDir} --tests-dir tests/`, {
      encoding: 'utf8', timeout: 600000,
    });
    // mutmut results をパース
    const results = execSync('python3 -m mutmut results', { encoding: 'utf8' });
    const killedMatch = results.match(/killed:\s*(\d+)/i);
    const totalMatch = results.match(/total:\s*(\d+)/i);
    killed = killedMatch ? parseInt(killedMatch[1], 10) : 0;
    total = totalMatch ? parseInt(totalMatch[1], 10) : 0;
    score = total > 0 ? Math.round((killed * 100) / total) : 0;
  } catch (e) {
    console.error(`mutmut実行失敗: ${e.message}、簡易代替に切替`);
    tool = 'simple';
  }
}

if (tool === 'none' || tool === 'simple') {
  tool = 'simple';
  // 簡易ミューテーション
  const files = collectPythonFiles(srcDir);
  if (files.length === 0) {
    console.error(`対象ファイルなし: ${srcDir}`);
    process.exit(1);
  }
  console.log(`  対象ファイル: ${files.length}個`);
  const result = simpleMutatePython(files);
  killed = result.killed;
  total = result.total;
  score = total > 0 ? Math.round((killed * 100) / total) : 0;

  for (const r of result.results.slice(0, 10)) {
    console.log(`    ${r.status}: ${r.file} (${r.mutation})`);
  }
}

console.log(`\nミューテーションスコア: ${killed}/${total} = ${score}%`);

// --- QA台帳に書き込み ---
try {
  let qaContent = fs.readFileSync(qaFile, 'utf8');
  if (/mutation_score:\s*-/.test(qaContent)) {
    qaContent = qaContent.replace(/mutation_score:\s*-/, `mutation_score: ${score}`);
  } else if (/mutation_score:\s*\d+/.test(qaContent)) {
    qaContent = qaContent.replace(/mutation_score:\s*\d+/, `mutation_score: ${score}`);
  } else {
    // セクション末尾に追加
    qaContent += `\n- mutation_score: ${score}\n- mutation_tool: ${tool}\n`;
  }
  fs.writeFileSync(qaFile, qaContent);
  console.log(`QA台帳に記入: ${qaFile}`);
} catch (e) {
  console.error(`QA台帳更新失敗: ${e.message}`);
  process.exit(1);
}

// --- 閾値チェック ---
if (score < 70) {
  console.error(`\n❌ ミューテーションスコア ${score}% は閾値70%未満です。テスト強化が必要。`);
  process.exit(2);
}

console.log(`\n✅ ミューテーションスコア ${score}% (閾値70%クリア)`);
process.exit(0);
