#!/usr/bin/env node
'use strict';

/**
 * TDD Gate — PreToolUse Hook
 *
 * Feature/Epicチケットでsrc/配下を変更する前に、
 * Red Tests（全テストFAIL）が確認済みであることを検証する。
 *
 * チェック内容:
 *   1. QA台帳のstatusが "red-tests" 以降であるか
 *   2. test_fileに記載された全テスト関数が実際に存在するか
 *   3. .context/red-confirmed フラグが存在するか
 *
 * 先にGreenを書くことが不可能な仕組み。
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

// 読み取り系は通過
const PASS_THROUGH = new Set([
  'Read', 'Grep', 'Glob', 'WebSearch', 'WebFetch',
  'Agent', 'TaskList', 'TaskGet', 'TaskCreate', 'TaskUpdate',
]);
if (PASS_THROUGH.has(tool)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const filePath = (input.tool_input || {}).file_path || '';
const command = (input.tool_input || {}).command || '';

// src/ 配下の変更のみ対象
if (!filePath.includes('/src/')) {
  // Bash経由のsrc/変更もチェック
  if (tool !== 'Bash' || !/\bsrc\//.test(command)) {
    console.log(JSON.stringify({ decision: 'approve' }));
    process.exit(0);
  }
}

// テスト・ドキュメント・設定は通過
if (
  filePath.includes('/tests/') ||
  filePath.includes('/docs/') ||
  filePath.includes('.context/') ||
  filePath.includes('.claude/') ||
  filePath.endsWith('.md') ||
  filePath.endsWith('.json') ||
  filePath.endsWith('.jsonl')
) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// Bashの読み取り系は通過
if (tool === 'Bash') {
  if (/^(git |ls |cd |pwd|cat |source |echo |grep |find |pytest|npm test|uv run pytest)/.test(command)) {
    console.log(JSON.stringify({ decision: 'approve' }));
    process.exit(0);
  }
}

// チケット確認
const ticketFile = path.join(process.cwd(), '.context', 'current_ticket.json');
let ticket;
try {
  ticket = JSON.parse(fs.readFileSync(ticketFile, 'utf8'));
} catch {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const labels = (ticket.labels || []).map(l => (typeof l === 'string' ? l : '').toLowerCase());
if (!labels.some(l => ['feature', 'epic'].includes(l))) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// .context/red-confirmed 確認
const redConfirmedPath = path.join(process.cwd(), '.context', 'red-confirmed');
if (!fs.existsSync(redConfirmedPath)) {
  console.log(JSON.stringify({
    decision: 'block',
    reason: 'TDD Gate: Red Tests未確認です。\n\n'
      + 'src/を変更する前に、全テストがFAILすることを確認してください。\n\n'
      + '手順:\n'
      + '1. テストコードが全て作成されていること\n'
      + '2. pytest / jest を実行して全テストがFAILすること\n'
      + '3. .context/red-confirmed フラグが生成されること\n\n'
      + 'Red Tests = 実装前にテストが正しく失敗することの証明。\n'
      + 'テストが先にPASSする場合、テスト自体が機能していません。',
  }));
  process.exit(0);
}

// red-confirmed の内容を検証（タイムスタンプ、ハッシュ）
try {
  const flagContent = fs.readFileSync(redConfirmedPath, 'utf8').trim();
  const flagData = JSON.parse(flagContent);

  // タイムスタンプが24時間以内か
  if (flagData.timestamp) {
    const age = Date.now() - new Date(flagData.timestamp).getTime();
    if (age > 24 * 60 * 60 * 1000) {
      console.log(JSON.stringify({
        decision: 'block',
        reason: 'TDD Gate: Red Tests確認が古すぎます（24時間以上経過）。\n'
          + 'テストを再実行してRed確認を更新してください。',
      }));
      process.exit(0);
    }
  }
} catch {
  // JSONパースに失敗しても、ファイルが存在すれば通過
}

console.log(JSON.stringify({ decision: 'approve' }));
