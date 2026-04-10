#!/usr/bin/env node
'use strict';

/**
 * Design Gate — PreToolUse Hook
 *
 * 7フェーズフローのPhase 2ゲート。
 * src/変更時にNOVA設計文書（docs/designs/TICKET-design.md）の存在をチェック。
 *
 * strict: 必須（設計文書＋必須セクション）
 * standard: 任意（存在チェックのみ、なくてもask_userで続行可能）
 * light: スキップ
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
const filePath = (input.tool_input || {}).file_path || '';
const command = (input.tool_input || {}).command || '';

// 読み取り系は通過
const PASS = new Set(['Read', 'Grep', 'Glob', 'WebSearch', 'WebFetch', 'Agent', 'TaskList', 'TaskGet', 'TaskCreate', 'TaskUpdate']);
if (PASS.has(tool)) { console.log(JSON.stringify({ decision: 'approve' })); process.exit(0); }

// .context/, .claude/, tests/, docs/ は通過
if (filePath.includes('.context/') || filePath.includes('.claude/') || filePath.includes('/tests/') || filePath.includes('/docs/')) {
  console.log(JSON.stringify({ decision: 'approve' })); process.exit(0);
}

// Bash読み取り系は通過
if (tool === 'Bash' && /^\s*(git |ls |cd |pwd|cat |head |tail |grep |find |pytest|npm test)/.test(command)) {
  console.log(JSON.stringify({ decision: 'approve' })); process.exit(0);
}

// phase-state.json 読み込み
let phase, riskLevel;
try {
  const state = JSON.parse(fs.readFileSync(path.join(process.cwd(), '.context', 'phase-state.json'), 'utf8'));
  phase = state.phase;
  riskLevel = state.risk_level || 'standard';
} catch {
  console.log(JSON.stringify({ decision: 'approve' })); process.exit(0);
}

// lightはスキップ
if (riskLevel === 'light') { console.log(JSON.stringify({ decision: 'approve' })); process.exit(0); }

// designフェーズ以降でなければスキップ（specフェーズではまだ不要）
const ACTIVE_PHASES = ['red-tests', 'impl', 'hardening', 'review', 'done'];
if (!ACTIVE_PHASES.includes(phase)) { console.log(JSON.stringify({ decision: 'approve' })); process.exit(0); }

// src/ 変更のみ対象
if (!filePath.includes('/src/') && tool !== 'Bash') {
  console.log(JSON.stringify({ decision: 'approve' })); process.exit(0);
}

// チケットID取得
let ticketId = '';
try {
  const ticket = JSON.parse(fs.readFileSync(path.join(process.cwd(), '.context', 'current_ticket.json'), 'utf8'));
  ticketId = (ticket.ticket || ticket.identifier || '').toUpperCase();
} catch { console.log(JSON.stringify({ decision: 'approve' })); process.exit(0); }

// 設計文書検索
const designsDir = path.join(process.cwd(), 'docs', 'designs');
let designPath = null;
try {
  const files = fs.readdirSync(designsDir);
  const match = files.find(f => f.toUpperCase().includes(ticketId) && f.endsWith('-design.md'));
  if (match) designPath = path.join(designsDir, match);
} catch {}

if (!designPath) {
  // autonomous-mode対応
  try {
    const { autonomousApprove } = require('./_autonomous');
    autonomousApprove('design-gate', `Design Gate: ${ticketId} の設計文書が見つかりません`);
  } catch {}

  const msg = `📐 Design Gate: ${ticketId} の設計文書が見つかりません。\n\n`
    + `docs/designs/${ticketId}-design.md を作成してください。\n\n`
    + `必須セクション:\n- ## Architecture\n- ## Impact Analysis\n- ## Dependencies`;
  console.log(JSON.stringify({ decision: 'ask_user', message: msg }));
  process.exit(0);
}

console.log(JSON.stringify({ decision: 'approve' }));
