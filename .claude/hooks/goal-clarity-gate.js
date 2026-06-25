#!/usr/bin/env node
'use strict';

/**
 * Goal Clarity Gate — PreToolUse Hook
 *
 * Karpathy原則: タスクを検証可能な形に変換する。
 * 曖昧なタスク（「動くようにして」「修正して」）を検出し、
 * 検証コマンド（verify command）の記入を要求する。
 *
 * 既存 ogsm-completion-gate.js（4カテゴリ限定）の「全タスク版」として動作。
 * OGSMがないタスクでも、最低限「検証コマンド + 期待結果」の定義を強制。
 *
 * 変換例:
 *   「Add validation」→「tests/test_validation.py::test_invalid_inputs が PASS」
 *   「Fix the bug」→「tests/test_bug.py::test_reproduce が PASS」
 *   「Refactor X」→「全テストが変更前後で PASS」
 *
 * 参考: github.com/forrestchang/andrej-karpathy-skills (Goal-Driven Execution)
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

// src/変更のみ対象（ドキュメント・設定は対象外）
const filePath = (input.tool_input || {}).file_path || '';
if (!filePath.includes('/src/') && !filePath.match(/\.(py|js|ts|tsx|jsx|go|rs|java)$/)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

if (
  filePath.includes('/tests/') ||
  filePath.includes('/docs/') ||
  filePath.includes('.context/') ||
  filePath.includes('.claude/')
) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// チケット取得
const ticketFile = path.join(process.cwd(), '.context', 'current_ticket.json');
let ticket;
try {
  ticket = JSON.parse(fs.readFileSync(ticketFile, 'utf8'));
} catch {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 既に verify-command が定義されていればOK
const verifyCmdPath = path.join(process.cwd(), '.context', 'verify-command.json');
if (fs.existsSync(verifyCmdPath)) {
  try {
    const vc = JSON.parse(fs.readFileSync(verifyCmdPath, 'utf8'));
    if (vc.command && vc.ticket === ticket.ticket) {
      console.log(JSON.stringify({ decision: 'approve' }));
      process.exit(0);
    }
  } catch {}
}

// OGSMがあれば OGSM が検証を担うので通過
if (fs.existsSync(path.join(process.cwd(), '.context', 'ogsm.md'))) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// Spec の Acceptance Criteria があれば検証可能とみなす
const specsDir = path.join(process.cwd(), 'docs', 'specs');
const ticketId = (ticket.ticket || ticket.identifier || '').toLowerCase().replace(/^aris-/, '');
try {
  const specFiles = fs.readdirSync(specsDir);
  const match = specFiles.find(f => f.toLowerCase().includes(ticketId));
  if (match) {
    const content = fs.readFileSync(path.join(specsDir, match), 'utf8');
    if (/^##\s+(Acceptance Criteria|受入条件)/m.test(content)) {
      // Specにacceptance criteriaあり → 検証可能
      console.log(JSON.stringify({ decision: 'approve' }));
      process.exit(0);
    }
  }
} catch {}

// 曖昧タスク検出: ticket titleに「直す」「修正」「動く」等があり、かつspec/OGSMがない
const title = (ticket.title || '').toLowerCase();
const VAGUE_PATTERNS = [
  /動くようにして/,
  /直して/,
  /修正して/,
  /なおして/,
  /治して/,
  /make\s+it\s+work/i,
  /fix\s+it\b/i,
  /make\s+.+\s+work/i,
];

const isVague = VAGUE_PATTERNS.some(re => re.test(title));

// Bugfixラベルの場合は既存テストが検証を担うので通過
const labels = (ticket.labels || []).map(l => (typeof l === 'string' ? l : '').toLowerCase());
if (labels.some(l => ['bug', 'bugfix', 'fix'].includes(l))) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// Feature/Epic + 検証定義なし → ブロック
if (labels.some(l => ['feature', 'epic'].includes(l))) {
  console.log(JSON.stringify({
    decision: 'ask_user',
    message: '🎯 Goal Clarity Gate: タスクの検証方法が定義されていません。\n\n'
      + `チケット: ${ticket.ticket || ticket.identifier}\n`
      + `タイトル: ${ticket.title || '不明'}\n\n`
      + (isVague ? '⚠️ 曖昧なタスク表現を検出しました。\n\n' : '')
      + 'Karpathy原則（Goal-Driven Execution）:\n'
      + '  タスクを「検証可能な成功基準」に変換してください。\n\n'
      + '変換例:\n'
      + '  「Add validation」→「tests/test_validation.py::test_invalid_inputs が PASS」\n'
      + '  「Fix the bug」→「tests/test_bug.py::test_reproduce が PASS」\n'
      + '  「Refactor X」→「全テストが変更前後で PASS」\n\n'
      + '以下のいずれかで検証可能性を定義してください:\n'
      + '  1. docs/specs/{ticket}_spec.md に Acceptance Criteria を記入\n'
      + '  2. .context/ogsm.md に Measures を記入\n'
      + '  3. .context/verify-command.json を作成:\n'
      + '     {\n'
      + `       "ticket": "${ticket.ticket || ticket.identifier}",\n`
      + '       "command": "pytest tests/test_xxx.py",\n'
      + '       "expected": "全PASS, exit code 0"\n'
      + '     }',
  }));
  process.exit(0);
}

console.log(JSON.stringify({ decision: 'approve' }));
