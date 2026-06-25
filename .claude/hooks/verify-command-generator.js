#!/usr/bin/env node
'use strict';

/**
 * Verify Command Generator — ARIS-816 (GAP-001 S13)
 *
 * goal-clarity-gate.js が要求する .context/verify-command.json を自動生成。
 * spec-gate通過後（Spec作成完了）に発火し、AC項目からテストコマンドを推定。
 *
 * PostToolUse として動作:
 *   - spec.md の新規作成/大幅更新時にACを抽出
 *   - チケットIDと推定pytestコマンドをverify-command.jsonに書く
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
if (tool !== 'Write' && tool !== 'Edit') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const filePath = (input.tool_input || {}).file_path || '';
if (!filePath.includes('docs/specs/') || !filePath.endsWith('.md')) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const CWD = process.cwd();
const verifyPath = path.join(CWD, '.context', 'verify-command.json');

// 既存ファイルがあれば上書きしない（手動記入を優先）
if (fs.existsSync(verifyPath)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// チケット取得
let ticket = null;
try {
  ticket = JSON.parse(fs.readFileSync(path.join(CWD, '.context', 'current_ticket.json'), 'utf8'));
} catch {}

if (!ticket || !ticket.ticket) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// Spec内容取得
let specContent;
try {
  specContent = fs.readFileSync(filePath, 'utf8');
} catch {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// ACが3件以上あるか確認
const acCount = (specContent.match(/^-\s*\[[ x]\]\s*AC-/gm) || []).length;
if (acCount < 3) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// チケットIDからテストパス推定
const ticketId = ticket.ticket.toLowerCase().replace(/^aris-/, '');
const inferredTestPath = `tests/test_${ticketId}*.py`;

// verify-command.json生成
const verifyCommand = {
  ticket: ticket.ticket,
  generated_at: new Date().toISOString(),
  generated_from: path.relative(CWD, filePath),
  acceptance_criteria_count: acCount,
  command: `python3 -m pytest ${inferredTestPath} -v`,
  alt_command: `python3 -m pytest tests/ -k "${ticketId}" -v`,
  expected: `全AC対応テスト PASS, exit code 0`,
  notes: [
    'このファイルは spec-gate 通過後に自動生成されました（ARIS-816）',
    'OGSMがない場合の「検証可能性」を担保する',
    '必要に応じて手動で上書きしてください',
  ],
};

try {
  fs.mkdirSync(path.dirname(verifyPath), { recursive: true });
  fs.writeFileSync(verifyPath, JSON.stringify(verifyCommand, null, 2));
} catch {}

console.log(JSON.stringify({
  decision: 'approve',
  additionalContext: `📝 Verify Command Generator: .context/verify-command.json を自動生成しました\n`
    + `  ticket: ${ticket.ticket}\n`
    + `  command: ${verifyCommand.command}\n`
    + `  AC数: ${acCount}\n`
    + `  必要に応じて手動編集してください`,
}));
