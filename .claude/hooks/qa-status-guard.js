#!/usr/bin/env node
'use strict';

/**
 * QA Status Guard — PreToolUse Hook
 *
 * QA台帳のstatusフィールド変更を監視し、不正な遷移をブロックする。
 * 順方向1ステップずつのみ許可。逆方向・スキップは完全ブロック。
 *
 * 各遷移に必要な条件:
 *   team-composition → planning:    Team Compositionセクション完了
 *   planning → red-tests:           Test Items列挙済み + カタログ照合済み
 *   red-tests → implementation:     .context/red-confirmed 存在
 *   implementation → round-1:       全テストGreen
 *   round-1 → round-2:             R1全セル記入済み
 *   round-2 → round-3:             R2全セル記入済み + sentinel参加確認
 *   round-3 → done:                R3全PASS + ミューテーション70%+ + リグレッション全PASS
 */

const fs = require('fs');
const path = require('path');

const VALID_STATUSES = [
  'team-composition', 'planning', 'red-tests', 'implementation',
  'round-1', 'round-2', 'round-3', 'done',
];

let input;
try {
  input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
} catch {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const tool = input.tool_name;
if (tool !== 'Edit' && tool !== 'Write') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const filePath = (input.tool_input || {}).file_path || '';
if (!filePath.includes('docs/qa/') || !filePath.endsWith('_qa.md')) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// status行の変更を検出
const newString = (input.tool_input || {}).new_string || '';
const content = (input.tool_input || {}).content || '';
const text = newString || content;

const statusMatch = text.match(/^- status:\s*(\S+)/m);
if (!statusMatch) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const newStatus = statusMatch[1];
if (!VALID_STATUSES.includes(newStatus)) {
  console.log(JSON.stringify({
    decision: 'block',
    reason: `QA Status Guard: 無効なstatus "${newStatus}"。有効値: ${VALID_STATUSES.join(', ')}`,
  }));
  process.exit(0);
}

// 現在のstatusを読む
let currentStatus = 'team-composition';
try {
  const qaContent = fs.readFileSync(filePath, 'utf8');
  const currentMatch = qaContent.match(/^- status:\s*(\S+)/m);
  if (currentMatch) currentStatus = currentMatch[1];
} catch {
  // ファイルがまだない場合は初期状態
}

const currentIdx = VALID_STATUSES.indexOf(currentStatus);
const newIdx = VALID_STATUSES.indexOf(newStatus);

// 同じstatusへの変更は許可（他のフィールド変更時）
if (currentIdx === newIdx) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 逆方向ブロック
if (newIdx < currentIdx) {
  console.log(JSON.stringify({
    decision: 'block',
    reason: `QA Status Guard: 逆方向の遷移は禁止です。\n`
      + `現在: ${currentStatus} → 試行: ${newStatus}\n`
      + `statusは順方向にのみ進められます。`,
  }));
  process.exit(0);
}

// 2ステップ以上のスキップブロック
if (newIdx > currentIdx + 1) {
  const expected = VALID_STATUSES[currentIdx + 1];
  console.log(JSON.stringify({
    decision: 'block',
    reason: `QA Status Guard: フェーズスキップは禁止です。\n`
      + `現在: ${currentStatus} → 試行: ${newStatus}\n`
      + `次のステップは "${expected}" です。各フェーズを順番に完了してください。`,
  }));
  process.exit(0);
}

// 順方向1ステップ → 遷移条件をチェック
const transition = `${currentStatus}->${newStatus}`;
let qaContent = '';
try {
  qaContent = fs.readFileSync(filePath, 'utf8');
} catch {
  // pass
}

const contextDir = path.join(process.cwd(), '.context');

function checkTransition() {
  switch (transition) {
    case 'team-composition->planning': {
      if (!/^## Team Composition/m.test(qaContent)) return 'Team Compositionセクションが未記入です';
      if (!/composed_by:\s*\S+/.test(qaContent)) return 'composed_byが未記入です';
      const assignedRows = (qaContent.match(/\| 視点[A-Z]/g) || []).length;
      if (assignedRows < 3) return `チーム構成が不足です（${assignedRows}/3エージェント）`;
      return null;
    }
    case 'planning->red-tests': {
      const tiCount = (qaContent.match(/^### TI-\d+/gm) || []).length;
      if (tiCount === 0) return 'テスト項目(TI-NNN)が1つも列挙されていません';
      if (!/^## Catalog Coverage/m.test(qaContent)) return 'Catalog Coverageセクションがありません';
      if (!/^## Coverage Matrix/m.test(qaContent)) return 'Coverage Matrixがありません';
      return null;
    }
    case 'red-tests->implementation': {
      const flagPath = path.join(contextDir, 'red-confirmed');
      if (!fs.existsSync(flagPath)) return '.context/red-confirmed が存在しません。全テストFAILを確認してください';
      return null;
    }
    case 'implementation->round-1':
      return null; // 全テストGreenは実行時に確認
    case 'round-1->round-2': {
      const r1Empty = (qaContent.match(/\| R1 \|[^|]*\|[^|]*\| - \|/g) || []).length;
      if (r1Empty > 0) return `Round 1に未記入セルが${r1Empty}件残っています`;
      if (!/^### Round 1/m.test(qaContent)) return 'Round 1 Summaryが未記入です';
      return null;
    }
    case 'round-2->round-3': {
      const r2Empty = (qaContent.match(/\| R2 \|[^|]*\|[^|]*\| - \|/g) || []).length;
      if (r2Empty > 0) return `Round 2に未記入セルが${r2Empty}件残っています`;
      if (!/sentinel_participated:\s*true/i.test(qaContent)) return 'Round 2でsentinelが参加していません';
      if (!/^### Round 2/m.test(qaContent)) return 'Round 2 Summaryが未記入です';
      return null;
    }
    case 'round-3->done': {
      const r3Fails = (qaContent.match(/\| R3 \|[^|]*\|[^|]*\| FAIL \|/g) || []).length;
      if (r3Fails > 0) return `Round 3にFAILが${r3Fails}件残っています`;
      if (!/mutation_score:\s*(\d+)/.test(qaContent)) return 'ミューテーションスコアが記録されていません';
      const scoreMatch = qaContent.match(/mutation_score:\s*(\d+)/);
      if (scoreMatch && parseInt(scoreMatch[1], 10) < 70) return `ミューテーションスコアが70%未満（${scoreMatch[1]}%）です`;
      if (!/regression_all_pass:\s*true/i.test(qaContent)) return 'リグレッションテストが全PASSではありません';
      if (!/final_verdict:\s*APPROVED/i.test(qaContent)) return 'final_verdictがAPPROVEDではありません';
      if (!/auditor_participated:\s*true/i.test(qaContent)) return 'Round 3でauditorが参加していません';
      return null;
    }
    default:
      return null;
  }
}

const error = checkTransition();
if (error) {
  console.log(JSON.stringify({
    decision: 'block',
    reason: `QA Status Guard: 遷移条件未達（${currentStatus} → ${newStatus}）\n${error}`,
  }));
  process.exit(0);
}

console.log(JSON.stringify({ decision: 'approve' }));
