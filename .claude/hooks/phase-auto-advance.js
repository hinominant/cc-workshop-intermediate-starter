#!/usr/bin/env node
'use strict';

/**
 * Phase Auto-Advance — PostToolUse Hook
 *
 * ツール実行後にphase-state.jsonのcheckpointsを確認し、
 * 次のPhaseへの遷移条件が全て満たされていれば自動的にadvanceする。
 *
 * これにより「Phase遷移は手動」→「条件充足で自動遷移」に変わる。
 *
 * セーフガード:
 * - done フェーズでは遷移しない
 * - 直近5秒以内に遷移した場合はスキップ（rapid-fire防止）
 * - 遷移ログを .context/auto-advance-log.jsonl に記録
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// === 入力パース ===
let input;
try {
  input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
} catch {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const CWD = process.cwd();
const STATE_PATH = path.join(CWD, '.context', 'phase-state.json');
const LOG_PATH = path.join(CWD, '.context', 'auto-advance-log.jsonl');
const TRANSITION_SCRIPT = path.join(CWD, 'scripts', 'phase-transition.js');

// phase-state.json が存在しなければスキップ
if (!fs.existsSync(STATE_PATH)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// phase-transition.js が存在しなければスキップ
if (!fs.existsSync(TRANSITION_SCRIPT)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

let state;
try {
  state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
} catch {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// done フェーズでは遷移しない
if (state.phase === 'done' || !state.phase) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// rapid-fire防止: 直近5秒以内の遷移があればスキップ
try {
  if (fs.existsSync(LOG_PATH)) {
    const lines = fs.readFileSync(LOG_PATH, 'utf8').trim().split('\n').filter(Boolean);
    if (lines.length > 0) {
      const lastEntry = JSON.parse(lines[lines.length - 1]);
      const elapsed = Date.now() - new Date(lastEntry.ts).getTime();
      if (elapsed < 5000) {
        console.log(JSON.stringify({ decision: 'approve' }));
        process.exit(0);
      }
    }
  }
} catch {}

// phase-transition.js check を実行して遷移可能か確認
try {
  const checkResult = execSync(`node "${TRANSITION_SCRIPT}" check`, {
    encoding: 'utf8',
    timeout: 3000,
    cwd: CWD,
  });

  // 「条件を全て満たしています」が含まれていれば advance
  if (checkResult.includes('✅') || checkResult.includes('全て満たし')) {
    const currentPhase = state.phase;

    execSync(`node "${TRANSITION_SCRIPT}" advance`, {
      encoding: 'utf8',
      timeout: 5000,
      cwd: CWD,
    });

    // 遷移後の状態を読む
    const newState = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));

    // ログ記録
    try {
      fs.appendFileSync(LOG_PATH,
        JSON.stringify({
          ts: new Date().toISOString(),
          from: currentPhase,
          to: newState.phase,
          ticket: state.ticket,
        }) + '\n'
      );
    } catch {}
  }
} catch {
  // advance失敗 → 何もしない（fail-open）
}

console.log(JSON.stringify({ decision: 'approve' }));
