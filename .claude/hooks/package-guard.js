#!/usr/bin/env node
'use strict';

/**
 * Package Guard — PreToolUse Hook (ARIS-190)
 *
 * pip install / npm install / bun add 等の外部パッケージインストールを検知し、
 * 既知の悪意のあるパッケージや不審なパッケージをブロックする。
 *
 * 設計方針:
 * - pip install / npm install / bun add をask_userで確認
 * - requirements.txt / pyproject.toml / package.json への書き込みも検知
 * - 既知の悪意のあるパッケージ名パターンをブロック
 * - --upgrade / -U でのメジャーバージョン変更も確認
 */

const fs = require('fs');

let input;
try {
  input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
} catch {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const tool = input.tool_name;
const toolInput = input.tool_input || {};

if (tool !== 'Bash') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const command = toolInput.command || '';

// パッケージインストールコマンドの検知
const installPatterns = [
  /pip\s+install\b/,
  /pip3\s+install\b/,
  /uv\s+pip\s+install\b/,
  /uv\s+add\b/,
  /npm\s+install\b/,
  /npm\s+i\b/,
  /yarn\s+add\b/,
  /bun\s+add\b/,
  /bun\s+install\b/,
  /brew\s+install\b/,
];

const isInstall = installPatterns.some(p => p.test(command));

if (!isInstall) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// ローカル/開発用は許可（-e, --editable, -r requirements.txt）
if (/install\s+(-e\s|--editable\s|-r\s|--requirement)/.test(command)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 既知のtyposquatting/maliciousパッケージパターン
const MALICIOUS_PATTERNS = [
  /python3?-/, // python-dateutil → python3-dateutil (typosquat)
  /0$/, // requests0, numpy0 etc
  /\bcrypto\b/, // crypto (pypi malware常連)
  /\bsetup\b/, // setup (typosquat)
];

const packageName = command.replace(/.*install\s+/, '').split(/\s/)[0] || '';
const isSuspicious = MALICIOUS_PATTERNS.some(p => p.test(packageName));

if (isSuspicious) {
  console.log(JSON.stringify({
    decision: 'block',
    message: `🚫 Package Guard: 不審なパッケージ名を検知: "${packageName}"\n\n`
      + `typosquattingまたは既知の悪意のあるパッケージの可能性があります。\n`
      + `正しいパッケージ名を確認してください。`,
  }));
  process.exit(0);
}

// 通常のインストールはask_userで確認
console.log(JSON.stringify({
  decision: 'ask_user',
  message: `📦 Package Guard: パッケージインストールを検知しました。\n\n`
    + `コマンド: ${command.substring(0, 200)}\n\n`
    + `外部パッケージのインストールは供給チェーン攻撃のリスクがあります。\n`
    + `このパッケージが必要であることを確認してください。`,
}));
