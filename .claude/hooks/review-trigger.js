#!/usr/bin/env node
'use strict';

/**
 * Review Trigger — PostToolUse Hook
 *
 * impl完了（all_tests_green）を検知したら、2段階レビューを自動起動するよう指示。
 * two-stage-review.js は「レビュー結果記録」を要求するが、起動のトリガーがなかった。
 * このhookが additionalContext で自動起動を促す。
 *
 * 放置防止: ルールではなく仕組みとして、impl→qa-rounds遷移前に確実にレビューを走らせる。
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
const STATE_PATH = path.join(CWD, '.context', 'phase-state.json');
const REVIEW_PATH = path.join(CWD, '.context', 'two-stage-review.json');
const TRIGGER_LOG = path.join(CWD, '.context', 'review-trigger-log');

// phase-state.json なしはスキップ
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

// impl フェーズで all_tests_green のみ対象
if (state.phase !== 'impl' || !state.checkpoints?.all_tests_green) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 既にレビュー完了していればスキップ
try {
  const review = JSON.parse(fs.readFileSync(REVIEW_PATH, 'utf8'));
  if (review.ticket === state.ticket
    && review.spec_review?.verdict === 'APPROVED'
    && review.quality_review?.verdict === 'APPROVED') {
    console.log(JSON.stringify({ decision: 'approve' }));
    process.exit(0);
  }
} catch {}

// 直近5分以内に同じトリガーを発動していればスキップ（rapid-fire防止）
try {
  if (fs.existsSync(TRIGGER_LOG)) {
    const last = parseInt(fs.readFileSync(TRIGGER_LOG, 'utf8').trim(), 10);
    if (Date.now() - last < 5 * 60 * 1000) {
      console.log(JSON.stringify({ decision: 'approve' }));
      process.exit(0);
    }
  }
} catch {}

// トリガー記録
try {
  fs.mkdirSync(path.dirname(TRIGGER_LOG), { recursive: true });
  fs.writeFileSync(TRIGGER_LOG, String(Date.now()));
} catch {}

// 2段階レビューを自動起動するよう additionalContext で指示
console.log(JSON.stringify({
  decision: 'approve',
  additionalContext: `🔍 Review Trigger: 実装完了（all_tests_green）を検知しました。\n\n`
    + `qa-roundsへ進む前に2段階レビューが必要です。以下を順に実行してください:\n\n`
    + `Stage 1 (spec準拠):\n`
    + `  Agent ツールで spec-reviewer を起動:\n`
    + `  subagent_type: "spec-reviewer"\n`
    + `  prompt: "ARIS-${state.ticket} のSpec準拠をレビューし、.context/two-stage-review.json に記録してください"\n\n`
    + `Stage 2 (品質):\n`
    + `  Agent ツールで code-quality-reviewer を起動:\n`
    + `  subagent_type: "code-quality-reviewer"\n`
    + `  prompt: "ARIS-${state.ticket} のコード品質4軸（Simplicity/Surgical/Maintainability/Style）をレビュー"\n\n`
    + `両APPROVED後、qa-roundsに進めます。`,
}));
