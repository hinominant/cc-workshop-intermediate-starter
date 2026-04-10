#!/usr/bin/env node
'use strict';

/**
 * Review Gate — PreToolUse Hook
 *
 * 7フェーズフローのPhase 6ゲート。
 * reviewフェーズでgit commit/push時にJudge+Auditorのレビュー結果をチェック。
 *
 * .context/review-result.json に以下が必要:
 * - reviews[]: judge + auditor の verdict が両方 PASS
 * - overall: PASS
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
const command = (input.tool_input || {}).command || '';
const filePath = (input.tool_input || {}).file_path || '';

// git commit/push 以外は通過
if (tool !== 'Bash') { console.log(JSON.stringify({ decision: 'approve' })); process.exit(0); }
if (!/git\s+(commit|push)/.test(command)) { console.log(JSON.stringify({ decision: 'approve' })); process.exit(0); }

// phase-state.json 読み込み
let phase, riskLevel;
try {
  const state = JSON.parse(fs.readFileSync(path.join(process.cwd(), '.context', 'phase-state.json'), 'utf8'));
  phase = state.phase;
  riskLevel = state.risk_level || 'standard';
} catch {
  console.log(JSON.stringify({ decision: 'approve' })); process.exit(0);
}

// reviewフェーズ以外はスキップ
if (phase !== 'review') { console.log(JSON.stringify({ decision: 'approve' })); process.exit(0); }

// lightはスキップ
if (riskLevel === 'light') { console.log(JSON.stringify({ decision: 'approve' })); process.exit(0); }

// review-result.json チェック
const reviewPath = path.join(process.cwd(), '.context', 'review-result.json');
try {
  const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));

  if (review.overall === 'PASS') {
    console.log(JSON.stringify({ decision: 'approve' }));
    process.exit(0);
  }

  // FAIL の場合
  const failures = (review.reviews || [])
    .filter(r => r.verdict !== 'PASS')
    .map(r => `${r.reviewer}: ${r.verdict}`)
    .join(', ');

  try { const { autonomousApprove } = require('./_autonomous'); autonomousApprove('review-gate', `Review FAIL: ${failures}`); } catch {}

  console.log(JSON.stringify({
    decision: 'ask_user',
    message: `🔍 Review Gate: レビューがPASSしていません。\n\n${failures}\n\n`
      + 'Judge + Auditor のレビューを完了してからコミットしてください。',
  }));
  process.exit(0);
} catch {
  // review-result.json なし
  try { const { autonomousApprove } = require('./_autonomous'); autonomousApprove('review-gate', 'Review Gate: レビュー未実施'); } catch {}

  console.log(JSON.stringify({
    decision: 'ask_user',
    message: '🔍 Review Gate: Judge + Auditor のレビューが完了していません。\n\n'
      + '.context/review-result.json が見つかりません。\n'
      + '/pr-review を実行してレビューを完了してください。',
  }));
  process.exit(0);
}
