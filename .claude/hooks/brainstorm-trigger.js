#!/usr/bin/env node
'use strict';

/**
 * Brainstorm Trigger — PreToolUse Hook
 *
 * Feature/Epicチケットで docs/specs/{ticket}_spec.md を新規作成する際、
 * Specが薄すぎる（AC 3件未満、Purposeが1行）等の兆候があれば、
 * brainstorming スキルを使って前提を引き出すよう指示する。
 *
 * 放置防止: brainstormingスキルが呼ばれないまま薄いSpecが作られるのを防ぐ。
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
if (tool !== 'Write') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const filePath = (input.tool_input || {}).file_path || '';
// Spec 新規作成のみ対象
if (!filePath.includes('docs/specs/') || !filePath.endsWith('.md')) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 既に存在していればスキップ（新規作成のみ）
if (fs.existsSync(filePath)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const content = (input.tool_input || {}).content || '';
if (!content) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// ticket取得（ARIS-810 S7修正: 後続のテンプレート文字列で参照するため先に取得）
const ticketFile = path.join(process.cwd(), '.context', 'current_ticket.json');
let ticket = null;
try {
  ticket = JSON.parse(fs.readFileSync(ticketFile, 'utf8'));
} catch {}

// 薄さチェック
const warnings = [];

// AC数が3未満
const acCount = (content.match(/^-\s*\[[ x]\]\s*AC-/gm) || []).length;
if (acCount < 3) {
  warnings.push(`Acceptance Criteria が ${acCount} 件のみ（3件以上推奨）`);
}

// Purpose が1行のみ
const purposeMatch = content.match(/^## Purpose\s*\n+([\s\S]+?)(?=\n##|\n$)/m);
if (purposeMatch) {
  const purposeText = purposeMatch[1].trim();
  if (purposeText.length < 50) {
    warnings.push(`Purpose が ${purposeText.length} 文字のみ（目的の背景が浅い可能性）`);
  }
}

// Out of Scope なし
if (!/^##\s+Out of Scope/m.test(content)) {
  warnings.push('Out of Scope セクションなし（スコープ境界が曖昧）');
}

if (warnings.length === 0) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// ARIS-810 (GAP-001 S7): 「提案」から「強制」に昇格
// .context/brainstorm-completed フラグがあれば通過、なければ block
const brainstormFlag = path.join(process.cwd(), '.context', 'brainstorm-completed');
let brainstormCompleted = false;
try {
  const flag = JSON.parse(fs.readFileSync(brainstormFlag, 'utf8'));
  const ticketMatch = flag.ticket === (ticket && (ticket.ticket || ticket.identifier || ''));
  // 24時間以内のフラグのみ有効
  const age = Date.now() - new Date(flag.completed_at || 0).getTime();
  brainstormCompleted = ticketMatch && age < 24 * 60 * 60 * 1000;
} catch {}

if (brainstormCompleted) {
  // brainstormingが完了していれば通過（additionalContextで確認だけ）
  console.log(JSON.stringify({
    decision: 'approve',
    additionalContext: `✅ Brainstorm Trigger: ブレインストーミング完了済み（${warnings.length}件の兆候はあるが許可）`,
  }));
  process.exit(0);
}

// 未完了 → block
console.log(JSON.stringify({
  decision: 'block',
  reason: `💡 Brainstorm Trigger: Specに不足の兆候（${warnings.length}件）。先にブレインストーミング必須。\n\n`
    + warnings.map(w => `  - ${w}`).join('\n')
    + `\n\n以下を実行してフラグを生成してください:\n\n`
    + `  1. Keijiと対話: What(具体的挙動) / Why(根本目的) / How verify(完了基準)\n`
    + `  2. 決定事項を記録後、フラグ生成:\n`
    + `     mkdir -p .context && cat > .context/brainstorm-completed <<EOF\n`
    + `     {\n`
    + `       "ticket": "${ticket && (ticket.ticket || ticket.identifier) || 'UNKNOWN'}",\n`
    + `       "completed_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",\n`
    + `       "what": "...",\n`
    + `       "why": "...",\n`
    + `       "how_verify": "..."\n`
    + `     }\n`
    + `     EOF\n\n`
    + `参考: .claude/skills/brainstorming.md`,
}));
