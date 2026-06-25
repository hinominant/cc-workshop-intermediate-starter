#!/usr/bin/env node
'use strict';

/**
 * Assumption Surface Guard — PreToolUse Hook
 *
 * Karpathy原則: "Don't assume. Don't hide confusion. Surface tradeoffs."
 *
 * Feature/Epicチケットの新規src/ファイル作成時、
 * .context/assumptions.md に前提が明示されているかチェック。
 * 大きな新規実装（新規ファイル作成）の前に前提・不明点・複数解釈を明示することを要求。
 *
 * 参考: github.com/forrestchang/andrej-karpathy-skills (Think Before Coding)
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

// Write（新規ファイル作成）のみ対象
if (tool !== 'Write') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const filePath = (input.tool_input || {}).file_path || '';

// src/配下の新規コードファイルのみ対象
if (!filePath.includes('/src/')) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}
if (!filePath.match(/\.(py|js|ts|tsx|jsx|go|rs|java|rb)$/)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 既存ファイル更新は対象外
if (fs.existsSync(filePath)) {
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

const labels = (ticket.labels || []).map(l => (typeof l === 'string' ? l : '').toLowerCase());

// Feature/Epicのみ対象
if (!labels.some(l => ['feature', 'epic'].includes(l))) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// .context/assumptions.md の存在確認
const assumptionsPath = path.join(process.cwd(), '.context', 'assumptions.md');
let hasAssumptions = false;
try {
  const content = fs.readFileSync(assumptionsPath, 'utf8');
  // 最低限の構造チェック
  if (content.length > 50 && /##\s+(前提|Assumptions|仮定)/.test(content)) {
    hasAssumptions = true;
  }
} catch {}

// Specに Out of Scope セクションがあれば前提明示とみなす（代替経路）
const specsDir = path.join(process.cwd(), 'docs', 'specs');
const ticketId = (ticket.ticket || ticket.identifier || '').toLowerCase().replace(/^aris-/, '');
let hasSpecOutOfScope = false;
try {
  const specFiles = fs.readdirSync(specsDir);
  const match = specFiles.find(f => f.toLowerCase().includes(ticketId));
  if (match) {
    const content = fs.readFileSync(path.join(specsDir, match), 'utf8');
    if (/^##\s+(Out of Scope|対象外|スコープ外)/m.test(content)) {
      hasSpecOutOfScope = true;
    }
  }
} catch {}

if (hasAssumptions || hasSpecOutOfScope) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 前提未明示 → ask_user
console.log(JSON.stringify({
  decision: 'ask_user',
  message: '🤔 Assumption Surface Guard: 前提が明示されていません。\n\n'
    + `チケット: ${ticket.ticket || ticket.identifier}\n`
    + `新規ファイル: ${filePath}\n\n`
    + 'Karpathy原則（Think Before Coding）:\n'
    + '  "Don\'t assume. Don\'t hide confusion. Surface tradeoffs."\n\n'
    + '新規ファイルを作る前に以下を明示してください:\n'
    + '  - どんな前提を置いているか\n'
    + '  - 不明点は何か\n'
    + '  - 複数解釈できる場合、どう解釈したか\n'
    + '  - トレードオフは何か\n\n'
    + '以下のいずれかで明示:\n'
    + '  1. docs/specs/{ticket}_spec.md に "## Out of Scope" を記入\n'
    + '  2. .context/assumptions.md を作成:\n'
    + '     # Assumptions for ' + (ticket.ticket || 'ticket') + '\n'
    + '     ## 前提\n'
    + '     - ...\n'
    + '     ## 不明点・複数解釈\n'
    + '     - ...\n'
    + '     ## トレードオフ\n'
    + '     - ...',
}));
