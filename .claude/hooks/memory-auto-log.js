#!/usr/bin/env node
'use strict';

/**
 * Memory Auto Logger — ARIS-814 (GAP-001 S11)
 *
 * 失敗/成功パターンを自動検出して /log-failure /log-success を呼び出す指示を生成。
 *
 * Stop hook として動作:
 *   - セッション中にphase completeが記録されていれば成功パターン記録を促す
 *   - block多発/test FAIL連続が記録されていれば失敗パターン記録を促す
 */

const fs = require('fs');
const path = require('path');

let input;
try {
  input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
} catch {
  console.log(JSON.stringify({ continue: true }));
  process.exit(0);
}

const CWD = process.cwd();
const CONTEXT_DIR = path.join(CWD, '.context');
const SIGNALS = [];

// --- Phase完了検知 ---
try {
  const state = JSON.parse(fs.readFileSync(path.join(CONTEXT_DIR, 'phase-state.json'), 'utf8'));
  const history = state.phase_history || [];
  if (history.includes('done')) {
    SIGNALS.push({
      type: 'success',
      pattern: 'phase_complete',
      detail: `${state.ticket}: 全7フェーズ完走`,
    });
  }
} catch {}

// --- Design Evolution成功 ---
try {
  const de = JSON.parse(fs.readFileSync(path.join(CONTEXT_DIR, 'design-evolution.json'), 'utf8'));
  if (de.reason) {
    SIGNALS.push({
      type: 'success',
      pattern: 'design_evolution',
      detail: de.reason,
    });
  }
} catch {}

// --- hook ブロックの多発（失敗シグナル） ---
try {
  const logFile = path.join(CONTEXT_DIR, 'tool-log.jsonl');
  if (fs.existsSync(logFile)) {
    const lines = fs.readFileSync(logFile, 'utf8').trim().split('\n').slice(-50);
    const blocks = lines.filter(l => /"decision":\s*"block"/.test(l)).length;
    if (blocks >= 5) {
      SIGNALS.push({
        type: 'failure',
        pattern: 'frequent_blocks',
        detail: `直近50ツール呼び出しでblockが${blocks}回`,
      });
    }
  }
} catch {}

// --- Signal あり → 指示注入 ---
if (SIGNALS.length === 0) {
  console.log(JSON.stringify({ continue: true }));
  process.exit(0);
}

const successSignals = SIGNALS.filter(s => s.type === 'success');
const failureSignals = SIGNALS.filter(s => s.type === 'failure');

const parts = [];
if (successSignals.length > 0) {
  parts.push(`✅ 成功パターン検知 (${successSignals.length}件):`);
  for (const s of successSignals) {
    parts.push(`  - ${s.pattern}: ${s.detail}`);
  }
  parts.push(`  → /log-success で docs/success_pattern_dictionary.md に記録してください`);
}

if (failureSignals.length > 0) {
  parts.push(`⚠️ 失敗パターン検知 (${failureSignals.length}件):`);
  for (const s of failureSignals) {
    parts.push(`  - ${s.pattern}: ${s.detail}`);
  }
  parts.push(`  → /log-failure で docs/failure_pattern_dictionary.md に記録してください`);
}

console.log(JSON.stringify({
  continue: true,
  systemMessage: parts.join('\n'),
}));
