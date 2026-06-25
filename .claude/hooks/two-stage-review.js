#!/usr/bin/env node
'use strict';

/**
 * Two-Stage Review Gate — PreToolUse Hook
 *
 * implフェーズ完了後、qa-rounds進入前に2段階レビューの完了を確認。
 *
 * Stage 1: spec-reviewer — 実装がSpecのAcceptance Criteriaを全て満たすか
 * Stage 2: code-quality-reviewer — コードがプロジェクト品質基準を満たすか
 *
 * どちらかがFAILなら implementer に戻す（qa-roundsへ進めない）。
 *
 * 原則: 実装者と別agentがレビュー（確認バイアス排除）。
 *       spec準拠と品質は別レビュー（関心事の分離）。
 *
 * 参考: github.com/obra/superpowers/skills/subagent-driven-development
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

const CWD = process.cwd();
const CONTEXT_DIR = path.join(CWD, '.context');
const STATE_PATH = path.join(CONTEXT_DIR, 'phase-state.json');
const REVIEW_PATH = path.join(CONTEXT_DIR, 'two-stage-review.json');

// === 発火条件: QA台帳 or phase-state.json への qa-rounds 遷移書き込み ===
const tool = input.tool_name;
if (tool !== 'Edit' && tool !== 'Write' && tool !== 'Bash') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// phase-state.json が存在しなければスキップ
if (!fs.existsSync(STATE_PATH)) {
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

// impl完了時（all_tests_green=true）の遷移で発火
// 遷移はphase-transition.js advanceで行うので、そのコマンドを検出
const command = (input.tool_input || {}).command || '';
const isAdvanceToQaRounds = tool === 'Bash'
  && /phase-transition\.js\s+advance/.test(command)
  && state.phase === 'impl'
  && state.checkpoints && state.checkpoints.all_tests_green === true;

// QA台帳のstatusがimplementation→round-1に変わる時も検出
const filePath = (input.tool_input || {}).file_path || '';
const newString = (input.tool_input || {}).new_string || (input.tool_input || {}).content || '';
const isQaStatusAdvance = (tool === 'Edit' || tool === 'Write')
  && filePath.includes('docs/qa/')
  && /- status:\s*round-1/.test(newString);

if (!isAdvanceToQaRounds && !isQaStatusAdvance) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// === 2段階レビューの完了確認 ===
let review;
try {
  review = JSON.parse(fs.readFileSync(REVIEW_PATH, 'utf8'));
} catch {
  // レビュー記録なし → ブロック
  console.log(JSON.stringify({
    decision: 'block',
    reason: '🔍 Two-Stage Review Gate: 2段階レビューが未完了です。\n\n'
      + 'implフェーズ完了後、qa-roundsに進む前に以下の2段階レビューが必須です:\n\n'
      + 'Stage 1 - spec-reviewer:\n'
      + '  実装がSpecのAcceptance Criteriaを全て満たすかをレビュー\n'
      + '  → /spec-reviewer\n\n'
      + 'Stage 2 - code-quality-reviewer:\n'
      + '  コードがプロジェクト品質基準を満たすかをレビュー\n'
      + '  → /code-quality-reviewer\n\n'
      + '両方合格後、.context/two-stage-review.json を生成してください:\n'
      + '{\n'
      + '  "ticket": "' + (state.ticket || '') + '",\n'
      + '  "spec_review": {\n'
      + '    "reviewer": "spec-reviewer",\n'
      + '    "verdict": "APPROVED|REJECTED",\n'
      + '    "findings": [],\n'
      + '    "timestamp": "ISO8601"\n'
      + '  },\n'
      + '  "quality_review": {\n'
      + '    "reviewer": "code-quality-reviewer",\n'
      + '    "verdict": "APPROVED|REJECTED",\n'
      + '    "findings": [],\n'
      + '    "timestamp": "ISO8601"\n'
      + '  }\n'
      + '}',
  }));
  process.exit(0);
}

// チケット一致チェック
if (review.ticket !== state.ticket) {
  console.log(JSON.stringify({
    decision: 'block',
    reason: '🔍 Two-Stage Review Gate: レビュー記録のチケットが現在のチケットと一致しません。\n\n'
      + `記録: ${review.ticket}\n`
      + `現在: ${state.ticket}\n\n`
      + '現在のチケットで2段階レビューをやり直してください。',
  }));
  process.exit(0);
}

// 両ステージ合格チェック
const specOk = review.spec_review && review.spec_review.verdict === 'APPROVED';
const qualityOk = review.quality_review && review.quality_review.verdict === 'APPROVED';

if (!specOk || !qualityOk) {
  const failures = [];
  if (!specOk) {
    failures.push('Stage 1 (spec-reviewer): ' + (review.spec_review?.verdict || '未実施'));
    if (review.spec_review?.findings?.length) {
      failures.push('  Findings: ' + review.spec_review.findings.map(f => f.issue || f).slice(0, 3).join('; '));
    }
  }
  if (!qualityOk) {
    failures.push('Stage 2 (code-quality-reviewer): ' + (review.quality_review?.verdict || '未実施'));
    if (review.quality_review?.findings?.length) {
      failures.push('  Findings: ' + review.quality_review.findings.map(f => f.issue || f).slice(0, 3).join('; '));
    }
  }

  console.log(JSON.stringify({
    decision: 'block',
    reason: '🔍 Two-Stage Review Gate: レビューが合格していません。\n\n'
      + failures.map(f => `  ${f}`).join('\n')
      + '\n\nfindingsを修正してから、再度2段階レビューを実施してください。',
  }));
  process.exit(0);
}

// タイムスタンプ新鮮度チェック（24時間以内）
try {
  const specTime = new Date(review.spec_review.timestamp).getTime();
  const qualityTime = new Date(review.quality_review.timestamp).getTime();
  const oldest = Math.min(specTime, qualityTime);
  if (Date.now() - oldest > 24 * 60 * 60 * 1000) {
    console.log(JSON.stringify({
      decision: 'block',
      reason: '🔍 Two-Stage Review Gate: レビューが古すぎます（24時間以上経過）。\n'
        + '実装に変更があった可能性があります。レビューをやり直してください。',
    }));
    process.exit(0);
  }
} catch {}

// === 両合格 → 通過 ===
console.log(JSON.stringify({
  decision: 'approve',
  additionalContext: '✅ Two-Stage Review passed:\n'
    + `  Stage 1 spec-reviewer: APPROVED\n`
    + `  Stage 2 code-quality-reviewer: APPROVED`,
}));
