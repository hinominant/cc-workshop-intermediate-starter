#!/usr/bin/env node
'use strict';

/**
 * Engine Router — ARIS-818 (GAP-001 S15)
 *
 * タスクキーワードから最適エンジン（Claude/Codex/Gemini）を推奨。
 * ENGINE_ROUTING.md の方針を仕組み化。additionalContextで提案。
 *
 * PreToolUse として動作、src/変更系で発火。
 */

const fs = require('fs');
const path = require('path');

let input;
try {
  input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
} catch {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const tool = input.tool_name;
if (tool !== 'Edit' && tool !== 'Write') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const filePath = (input.tool_input || {}).file_path || '';

// テストコード作成は Codex 推奨
const isTestCode = (filePath.includes('/tests/') || /\/test_\w+\.(py|js|ts)$/.test(filePath))
  && !fs.existsSync(filePath); // 新規作成

// ドキュメント生成は Gemini 推奨
const isDocument = /\/(docs|README)\//.test(filePath) && filePath.endsWith('.md') && !fs.existsSync(filePath);

// セキュリティ・認証コードは Claude PRIMARY
const isSecurity = /\/(auth|security|payment|crypto)\//.test(filePath);

const recommendations = [];
if (isTestCode) {
  recommendations.push({
    engine: 'Codex',
    reason: 'テストコード生成は仕様確定済みタスク → Codex PRIMARY',
    command: 'codex exec --full-auto -m o4-mini "...テスト仕様..."',
  });
}
if (isDocument) {
  recommendations.push({
    engine: 'Gemini',
    reason: 'ドキュメント生成は広コンテキスト + 文章生成 → Gemini PRIMARY',
    command: 'gemini -p "..."',
  });
}
if (isSecurity) {
  recommendations.push({
    engine: 'Claude Code',
    reason: 'セキュリティ系はミスの影響大 → Claude PRIMARY（エスカレーション不要）',
  });
}

if (recommendations.length === 0) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const msg = recommendations.map(r =>
  `  - ${r.engine}: ${r.reason}${r.command ? '\n    ' + r.command : ''}`
).join('\n');

console.log(JSON.stringify({
  decision: 'approve',
  additionalContext: `🔀 Engine Router (ARIS-818): 最適エンジン推奨\n\n${msg}\n\n参考: _common/ENGINE_ROUTING.md`,
}));
