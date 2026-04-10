#!/usr/bin/env node
'use strict';

/**
 * Skill Trigger — PreToolUse Hook (51E-C)
 *
 * パターンにマッチしたらスキル実行をadditionalContextで提案する。
 * ブロックはしない（approveのまま提案を追加）。
 *
 * トリガールール: skill-triggers.json（同ディレクトリ or プロジェクトルート）
 *
 * 設計方針:
 * - approveで通過し、additionalContextにスキル提案を含める
 * - .context/, tests/, .claude/ のファイルでは発火しない（デッドロック防止）
 * - 読み取り系ツールでは発火しない
 * - SKILL_TRIGGER_DISABLED=true で完全無効化
 * - .context/skill-trigger-disabled で無効化
 * - fail-open: 設定ファイルなし/パースエラー → approve（提案なし）
 */

const fs = require('fs');
const path = require('path');

// === 入力パース ===
let input;
try {
  input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
} catch {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const tool = input.tool_name;
const toolInput = input.tool_input || {};
const filePath = toolInput.file_path || '';
const command = toolInput.command || '';

// === 無効化チェック ===

// 環境変数で無効化
if (process.env.SKILL_TRIGGER_DISABLED === 'true') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// フラグファイルで無効化
if (fs.existsSync(path.join(process.cwd(), '.context', 'skill-trigger-disabled'))) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// === 除外パターン ===

// 読み取り系ツールは除外
const READ_ONLY_TOOLS = new Set([
  'Read', 'Grep', 'Glob', 'WebSearch', 'WebFetch',
  'Agent', 'TaskList', 'TaskGet', 'TaskCreate', 'TaskUpdate',
]);
if (READ_ONLY_TOOLS.has(tool)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// .context/, .claude/, tests/ のファイルは除外（デッドロック防止）
if (filePath) {
  if (filePath.includes('.context/') ||
      filePath.includes('.claude/') ||
      filePath.includes('/tests/') ||
      filePath.includes('/test_')) {
    console.log(JSON.stringify({ decision: 'approve' }));
    process.exit(0);
  }
}

// === トリガールール読み込み ===
let triggers = [];
const triggerPaths = [
  path.join(process.cwd(), '.claude', 'skill-triggers.json'),
  path.join(process.cwd(), 'skill-triggers.json'),
  path.join(__dirname, 'skill-triggers.json'),  // テンプレートディレクトリ
  path.join(__dirname, '..', 'skill-triggers.json'),  // _templates/
];

for (const p of triggerPaths) {
  try {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (Array.isArray(data.triggers)) {
      triggers = data.triggers;
      break;
    }
  } catch { continue; }
}

if (triggers.length === 0) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// === パターンマッチ ===
function matchTrigger(trigger) {
  const cond = trigger.condition;
  if (!cond) return false;

  // ツール種別チェック
  if (cond.tool) {
    const toolPattern = new RegExp('^(' + cond.tool + ')$');
    if (!toolPattern.test(tool)) return false;
  }

  // コマンドパターン（Bash用）
  if (cond.command_pattern && tool === 'Bash') {
    try {
      const re = new RegExp(cond.command_pattern);
      // match_on=output の場合はここではマッチしない（出力はPreToolUseでは不明）
      if (cond.match_on === 'output') return false;
      if (!re.test(command)) return false;
    } catch { return false; }
  }

  // ファイルパターン（Edit/Write用）
  if (cond.file_pattern && filePath) {
    try {
      const re = new RegExp(cond.file_pattern);
      if (!re.test(filePath)) return false;
    } catch { return false; }
  }

  // ラベルチェック
  if (cond.requires_label) {
    try {
      const ticketPath = path.join(process.cwd(), '.context', 'current_ticket.json');
      const ticket = JSON.parse(fs.readFileSync(ticketPath, 'utf8'));
      const labels = (ticket.labels || []).map(l => typeof l === 'string' ? l.toLowerCase() : '');
      if (!labels.includes(cond.requires_label.toLowerCase())) return false;
    } catch { return false; }
  }

  // Phase除外チェック
  if (cond.phase_not) {
    try {
      const phasePath = path.join(process.cwd(), '.context', 'phase-state.json');
      const state = JSON.parse(fs.readFileSync(phasePath, 'utf8'));
      if (state.phase && cond.phase_not.includes(state.phase)) return false;
    } catch {} // phase-state.jsonなし → チェックスキップ
  }

  return true;
}

// === マッチ実行 ===
const matched = triggers.filter(matchTrigger);

if (matched.length === 0) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 最初のマッチしたトリガーの指示を返す
const suggestion = matched[0];
const isDirective = suggestion.directive === true;
const prefix = isDirective ? '🔧 スキル自動実行指示' : '💡 スキル自動提案';
const instruction = isDirective
  ? `${prefix}: /${suggestion.skill} を実行してください。これは自動トリガーによる強制指示です。\n${suggestion.message}\n\n**重要: この指示に従い /${suggestion.skill} を実行してください。**`
  : `${prefix}: /${suggestion.skill}\n${suggestion.message}`;

console.log(JSON.stringify({
  decision: 'approve',
  additionalContext: instruction,
}));
