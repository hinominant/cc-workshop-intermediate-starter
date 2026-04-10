#!/usr/bin/env node
'use strict';

/**
 * Spec Gate — PreToolUse Hook
 *
 * feature-gate.js の拡張版。要求定義書の「存在」だけでなく「構造」もチェックする。
 * 6フェーズ自律開発フローのGate 1。
 *
 * チェック内容:
 * 1. docs/specs/ に対応するspecファイルが存在するか
 * 2. 必須セクション（Purpose / Acceptance Criteria / Out of Scope）が揃っているか
 * 3. Acceptance Criteriaにチェックボックスが3個以上あるか
 *
 * 設計方針:
 * - Feature/Epicラベルのチケットでsrc/変更時のみ発火
 * - 読み取り系・.context/・テスト・ドキュメントは通過
 * - fail-open: パースエラー時はapprove
 * - feature-gate.jsを置き換える（上位互換）
 */

const fs = require('fs');
const path = require('path');

// --- Input ---
let input;
try {
  input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
} catch {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const tool = input.tool_name;

// --- Pass-through: 読み取り系ツール ---
const PASS_THROUGH = new Set([
  'Read', 'Grep', 'Glob', 'WebSearch', 'WebFetch',
  'Agent', 'TaskList', 'TaskGet', 'TaskCreate', 'TaskUpdate',
]);
if (PASS_THROUGH.has(tool)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// --- Pass-through: ファイルパス除外 ---
const filePath = (input.tool_input || {}).file_path || '';
const command = (input.tool_input || {}).command || '';

if (
  filePath.includes('.context/') ||
  filePath.includes('/tests/') ||
  filePath.includes('/docs/') ||
  filePath.endsWith('.md') ||
  filePath.endsWith('.json') ||
  filePath.endsWith('.jsonl') ||
  filePath.includes('.claude/')
) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// --- Pass-through: Bashの読み取り系コマンド ---
if (tool === 'Bash') {
  if (/^(git |ls |cd |pwd|cat |source |set |echo |grep |find |uv run pytest|pytest|npm test)/.test(command)) {
    console.log(JSON.stringify({ decision: 'approve' }));
    process.exit(0);
  }
}

// --- チケット確認 ---
const ticketFile = path.join(process.cwd(), '.context', 'current_ticket.json');
let ticket;
try {
  ticket = JSON.parse(fs.readFileSync(ticketFile, 'utf8'));
} catch {
  // チケットなし → ogsm-gateの責務
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const labels = ticket.labels || [];

// --- ラベルなしチェック ---
if (labels.length === 0 && filePath.includes('/src/') && tool !== 'Read') {
  console.log(JSON.stringify({
    decision: 'ask_user',
    message: '⚠️ Spec Gate: チケットにラベルが設定されていません。\n\n'
      + 'Epic/Feature/Bug のいずれかのラベルを設定してください。',
  }));
  process.exit(0);
}

// --- Feature/Epicのみ対象 ---
const requiresSpec = labels.some(l =>
  typeof l === 'string' && ['feature', 'epic'].includes(l.toLowerCase())
);

// Bugfixで新規ファイル作成 → ラベルすり替え検知
if (!requiresSpec && tool === 'Write') {
  const isBugfix = labels.some(l =>
    typeof l === 'string' && ['bug', 'bugfix', 'fix'].includes(l.toLowerCase())
  );
  if (isBugfix && filePath.includes('/src/')) {
    console.log(JSON.stringify({
      decision: 'ask_user',
      message: '⚠️ Spec Gate: Bugfixラベルですが新規ファイルを作成しています。\n\n'
        + `ファイル: ${filePath}\n\n`
        + 'Bugfix = 既存機能の修正のみ。新しいファイル作成はFeatureです。',
    }));
    process.exit(0);
  }
}

if (!requiresSpec) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// --- src/ 内のコード変更のみ対象 ---
if (!filePath.includes('/src/') && tool !== 'Bash') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// --- Spec存在チェック ---
const ticketId = (ticket.ticket || ticket.identifier || '').toLowerCase();
const specsDir = path.join(process.cwd(), 'docs', 'specs');

let specFilePath = null;
try {
  const specFiles = fs.readdirSync(specsDir);
  const match = specFiles.find(f =>
    f.toLowerCase().includes(ticketId.replace(/^aris-/, ''))
  );
  if (match) {
    specFilePath = path.join(specsDir, match);
  }
} catch {
  // docs/specs/ なし
}

if (!specFilePath) {
  console.log(JSON.stringify({
    decision: 'ask_user',
    message: `📋 Spec Gate: ${ticket.ticket} はFeatureラベルですが、要求定義書が見つかりません。\n\n`
      + 'docs/specs/ に要求定義書を作成してから実装に入ってください。\n\n'
      + '必須セクション:\n'
      + '- ## Purpose（目的）\n'
      + '- ## Acceptance Criteria（受入条件、チェックボックス3個以上）\n'
      + '- ## Out of Scope（対象外）',
  }));
  process.exit(0);
}

// --- Spec構造チェック ---
let specContent;
try {
  specContent = fs.readFileSync(specFilePath, 'utf8');
} catch {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const missing = [];

// Purpose セクション
if (!/^##\s+(Purpose|目的)/m.test(specContent)) {
  missing.push('## Purpose（目的）');
}

// Acceptance Criteria セクション + チェックボックス3個以上
if (!/^##\s+(Acceptance Criteria|受入条件|受入基準)/m.test(specContent)) {
  missing.push('## Acceptance Criteria（受入条件）');
} else {
  const checkboxes = (specContent.match(/^-\s*\[[ x]\]/gm) || []).length;
  if (checkboxes < 3) {
    missing.push(`Acceptance Criteriaのチェックボックス（現在${checkboxes}個、最低3個必要）`);
  }
}

// Out of Scope セクション
if (!/^##\s+(Out of Scope|対象外|スコープ外)/m.test(specContent)) {
  missing.push('## Out of Scope（対象外）');
}

if (missing.length > 0) {
  console.log(JSON.stringify({
    decision: 'ask_user',
    message: `📋 Spec Gate: ${ticket.ticket} の要求定義書に不足があります。\n\n`
      + `ファイル: ${path.relative(process.cwd(), specFilePath)}\n\n`
      + '不足セクション:\n'
      + missing.map(m => `  - ${m}`).join('\n')
      + '\n\n要求定義書を修正してから実装に入ってください。',
  }));
  process.exit(0);
}

// --- Phase状態更新 ---
const phaseFile = path.join(process.cwd(), '.context', 'phase-state.json');
try {
  const state = JSON.parse(fs.readFileSync(phaseFile, 'utf8'));
  if (state.ticket === ticketId || state.ticket === ticket.ticket) {
    state.checkpoints.spec_exists = true;
    state.checkpoints.spec_sections_valid = true;
    fs.writeFileSync(phaseFile, JSON.stringify(state, null, 2));
  }
} catch {
  // phase-state.json がなくても通過
}

console.log(JSON.stringify({ decision: 'approve' }));
