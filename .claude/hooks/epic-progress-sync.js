#!/usr/bin/env node
'use strict';

/**
 * Epic Progress Sync — PostToolUse Hook
 *
 * phase-state.json の変更を検知し、親Epic の epic-state.json を自動更新。
 * 子Featureの進捗を親Epicに反映する。
 */

const fs = require('fs');
const path = require('path');

let input;
try { input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8')); } catch {
  console.log(JSON.stringify({ decision: 'approve' })); process.exit(0);
}

const tool = input.tool_name;
const filePath = (input.tool_input || {}).file_path || '';

// phase-state.json への変更のみ対象
if (!filePath.includes('phase-state.json')) {
  console.log(JSON.stringify({ decision: 'approve' })); process.exit(0);
}

// epic-state.json が存在しなければスキップ（Epic外のFeature）
const epicPath = path.join(process.cwd(), '.context', 'epic-state.json');
if (!fs.existsSync(epicPath)) {
  console.log(JSON.stringify({ decision: 'approve' })); process.exit(0);
}

try {
  const epic = JSON.parse(fs.readFileSync(epicPath, 'utf8'));
  const phaseState = JSON.parse(fs.readFileSync(
    path.join(process.cwd(), '.context', 'phase-state.json'), 'utf8'
  ));

  const ticketId = phaseState.ticket;
  if (!ticketId) { console.log(JSON.stringify({ decision: 'approve' })); process.exit(0); }

  // 子Featureを更新
  const feature = epic.features.find(f => f.ticket_id === ticketId);
  if (feature) {
    feature.phase = phaseState.phase || feature.phase;
    feature.status = phaseState.phase === 'done' ? 'done' : 'in-progress';
  }

  // 全Feature完了チェック
  const allDone = epic.features.length > 0 && epic.features.every(f => f.phase === 'done');
  if (allDone) {
    epic.checkpoints.all_features_done = true;
  }

  fs.writeFileSync(epicPath, JSON.stringify(epic, null, 2));
} catch {
  // fail-open
}

console.log(JSON.stringify({ decision: 'approve' }));
