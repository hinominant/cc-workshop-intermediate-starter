#!/usr/bin/env node
'use strict';

/**
 * Epic Gate — PreToolUse Hook
 *
 * Epicラベルのタスクでsrc/変更時に:
 * 1. epic-state.json が存在するか
 * 2. CEO判断が完了しているか
 */

const fs = require('fs');
const path = require('path');

let input;
try { input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8')); } catch {
  console.log(JSON.stringify({ decision: 'approve' })); process.exit(0);
}

const tool = input.tool_name;
const filePath = (input.tool_input || {}).file_path || '';

// 読み取り系/除外パスは通過
const PASS = new Set(['Read', 'Grep', 'Glob', 'WebSearch', 'WebFetch', 'Agent', 'TaskList', 'TaskGet', 'TaskCreate', 'TaskUpdate']);
if (PASS.has(tool)) { console.log(JSON.stringify({ decision: 'approve' })); process.exit(0); }
if (filePath.includes('.context/') || filePath.includes('.claude/') || filePath.includes('/tests/') || filePath.includes('/docs/')) {
  console.log(JSON.stringify({ decision: 'approve' })); process.exit(0);
}

// Epicラベルチェック
let isEpic = false;
try {
  const ticket = JSON.parse(fs.readFileSync(path.join(process.cwd(), '.context', 'current_ticket.json'), 'utf8'));
  isEpic = (ticket.labels || []).some(l => typeof l === 'string' && l.toLowerCase() === 'epic');
} catch {}
if (!isEpic) { console.log(JSON.stringify({ decision: 'approve' })); process.exit(0); }

// epic-state.json チェック
const epicPath = path.join(process.cwd(), '.context', 'epic-state.json');
if (!fs.existsSync(epicPath)) {
  try { const { autonomousApprove } = require('./_autonomous'); autonomousApprove('epic-gate', 'Epic未初期化'); } catch {}
  console.log(JSON.stringify({
    decision: 'ask_user',
    message: '📋 Epic Gate: epic-state.json が見つかりません。\n\n'
      + 'node scripts/epic-manager.js init EPIC-ID でEpicを初期化してください。',
  }));
  process.exit(0);
}

// CEO判断チェック
try {
  const epic = JSON.parse(fs.readFileSync(epicPath, 'utf8'));
  if (!epic.checkpoints || !epic.checkpoints.ceo_approved) {
    try { const { autonomousApprove } = require('./_autonomous'); autonomousApprove('epic-gate', 'CEO未承認'); } catch {}
    console.log(JSON.stringify({
      decision: 'ask_user',
      message: '📋 Epic Gate: CEO判断が完了していません。\n\n'
        + '/epic コマンドでCEO判断を取得してください。',
    }));
    process.exit(0);
  }
} catch {}

console.log(JSON.stringify({ decision: 'approve' }));
