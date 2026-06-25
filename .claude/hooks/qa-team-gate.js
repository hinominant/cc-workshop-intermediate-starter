#!/usr/bin/env node
'use strict';

/**
 * QA Team Gate — PreToolUse Hook
 *
 * Feature/Epicチケットでテスト項目(Test Items)の作成時、
 * チーム組成(Team Composition)が完了していることを確認する。
 *
 * チェック内容:
 *   1. docs/qa/{ticket}_qa.md が存在するか
 *   2. Team Compositionセクションが存在するか
 *   3. Assignedテーブルに3行以上（3エージェント以上）あるか
 *   4. composed_by が記入されているか
 *   5. session_id がメインセッションと異なるか
 *   6. Why列が全行埋まっているか
 *   7. rationale が空でないか
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

// QA台帳のTest Itemsセクション編集のみ対象
const isQaEdit = filePath.includes('docs/qa/') && filePath.endsWith('_qa.md');
const editContent = (input.tool_input || {}).new_string || (input.tool_input || {}).content || '';
const isTestItemEdit = isQaEdit && /## Test Items|### TI-\d+/.test(editContent);

if (!isTestItemEdit) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
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

// QA台帳の内容を読む
let qaContent = '';
try {
  qaContent = fs.readFileSync(filePath, 'utf8');
} catch {
  console.log(JSON.stringify({
    decision: 'ask_user',
    message: `QA Team Gate: QA台帳が存在しません。\n\nファイル: ${filePath}\n\n先にQA台帳を作成し、Team Compositionを完了してください。`,
  }));
  process.exit(0);
}

// チェック実行
const issues = [];

if (!/^## Team Composition/m.test(qaContent)) {
  issues.push('Team Compositionセクションが存在しません');
}

if (!/composed_by:\s*\S+/.test(qaContent)) {
  issues.push('composed_by が未記入です');
}

if (!/session_id:\s*\S+/.test(qaContent)) {
  issues.push('session_id が未記入です（テスト項目列挙セッションのIDが必要）');
}

const assignedRows = (qaContent.match(/\| 視点[A-Z]/g) || []).length;
if (assignedRows < 3) {
  issues.push(`Assignedエージェントが不足です（${assignedRows}/3以上必要）`);
}

// Why列が空でないかチェック
const whyEmpty = (qaContent.match(/\| 視点[A-Z][^|]*\|[^|]*\|\s*\|/g) || []).length;
if (whyEmpty > 0) {
  issues.push(`Why列が空のエージェントが${whyEmpty}名います`);
}

if (!/rationale:\s*\|?\s*\S+/.test(qaContent)) {
  issues.push('rationale（選定理由）が空です');
}

if (issues.length > 0) {
  console.log(JSON.stringify({
    decision: 'ask_user',
    message: `QA Team Gate: チーム組成が不完全です。\n\n`
      + issues.map(i => `  - ${i}`).join('\n')
      + `\n\nTeam Compositionを完了してからTest Itemsを作成してください。`,
  }));
  process.exit(0);
}

console.log(JSON.stringify({ decision: 'approve' }));
