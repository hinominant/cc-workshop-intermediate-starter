#!/usr/bin/env node
'use strict';

/**
 * QA Result Lock — PreToolUse Hook
 *
 * QA台帳のResult列・Evidence列の手書き編集をブロックする。
 * PASS/FAILはqa-result-writer.jsのみが書き込み可能。
 *
 * 原則: 採点は機械が行う。AIが自分で「PASS」と書くことは許さない。
 * Comment列のみ検証エージェントに編集を許可する。
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
if (!filePath.includes('docs/qa/') || !filePath.endsWith('_qa.md')) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const newString = (input.tool_input || {}).new_string || '';
const content = (input.tool_input || {}).content || '';
const text = newString || content;

// Result/Evidence列の変更を検出
// テーブル行: | R1 | 視点名 | agent | PASS/FAIL | evidence | comment |
const resultEditPattern = /\|\s*R[1-3]\s*\|[^|]*\|[^|]*\|\s*(PASS|FAIL)\s*\|/;
const evidenceEditPattern = /\|\s*R[1-3]\s*\|[^|]*\|[^|]*\|[^|]*\|\s*sha256:/;

const hasResultEdit = resultEditPattern.test(text);
const hasEvidenceEdit = evidenceEditPattern.test(text);

if (!hasResultEdit && !hasEvidenceEdit) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// qa-result-writer-token の検証
const tokenPath = path.join(process.cwd(), '.context', 'qa-result-writer-token');
try {
  const tokenContent = fs.readFileSync(tokenPath, 'utf8').trim();
  const tokenData = JSON.parse(tokenContent);

  // トークン有効期限: 5分
  const age = Date.now() - (tokenData.created_at || 0);
  if (age <= 5 * 60 * 1000 && tokenData.valid) {
    // 有効なトークンあり → 書き込み許可
    // トークンを消費（ワンタイム）
    tokenData.valid = false;
    fs.writeFileSync(tokenPath, JSON.stringify(tokenData, null, 2));
    console.log(JSON.stringify({ decision: 'approve' }));
    process.exit(0);
  }
} catch {
  // トークンなし or 読み取り失敗
}

console.log(JSON.stringify({
  decision: 'block',
  reason: 'QA Result Lock: Result/Evidence列の手書き編集は禁止です。\n\n'
    + 'PASS/FAILはテストランナー出力から機械的に記入されます。\n'
    + 'qa-result-writer.js を使用してテスト結果を記録してください。\n\n'
    + '使い方:\n'
    + '  1. pytest --json-report でテスト実行\n'
    + '  2. node .claude/hooks/qa-result-writer.js --qa-file {file} --report {json} --round {N}\n\n'
    + '原則: 出題者も回答者も採点はできない。採点は機械が行う。',
}));
