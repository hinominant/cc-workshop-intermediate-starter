#!/usr/bin/env node
'use strict';

/**
 * Parallel Review Dispatcher — ARIS-817 (GAP-001 S14)
 *
 * qa-rounds (R1/R2/R3) 進入時に3視点レビューの並列dispatch を指示する。
 *
 * dispatching-parallel-agents skill を実動作に組み込む。
 * PostToolUse として動作、qa-rounds フェーズ進入直後に発火。
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
const DISPATCH_LOG = path.join(CWD, '.context', 'parallel-dispatch-log');

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

if (state.phase !== 'qa-rounds') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// rapid-fire防止（1時間以内に指示済みならスキップ）
try {
  if (fs.existsSync(DISPATCH_LOG)) {
    const last = parseInt(fs.readFileSync(DISPATCH_LOG, 'utf8').trim(), 10);
    if (Date.now() - last < 60 * 60 * 1000) {
      console.log(JSON.stringify({ decision: 'approve' }));
      process.exit(0);
    }
  }
} catch {}

// QA台帳のチーム取得
const ticketId = (state.ticket || '').toLowerCase().replace(/^aris-/, '');
const qaDir = path.join(CWD, 'docs', 'qa');
let teamAgents = ['analyst', 'sentinel', 'echo'];  // デフォルト

try {
  const qaFiles = fs.readdirSync(qaDir);
  const match = qaFiles.find(f => f.toLowerCase().includes(ticketId));
  if (match) {
    const qaContent = fs.readFileSync(path.join(qaDir, match), 'utf8');
    const assignedMatch = qaContent.match(/^\| 視点[A-Z][^|]*\|\s*(\S+)\s*\|/gm) || [];
    const agents = assignedMatch
      .map(m => m.match(/\|\s*(\S+)\s*\|$/)?.[1])
      .filter(Boolean);
    if (agents.length >= 3) teamAgents = agents.slice(0, 3);
  }
} catch {}

// dispatch log
try {
  fs.mkdirSync(path.dirname(DISPATCH_LOG), { recursive: true });
  fs.writeFileSync(DISPATCH_LOG, String(Date.now()));
} catch {}

console.log(JSON.stringify({
  decision: 'approve',
  additionalContext: `🔀 Parallel Review Dispatcher (ARIS-817): qa-rounds 進入検知\n\n`
    + `3視点検証を並列でdispatchすることを推奨（逐次より3倍速）:\n\n`
    + `Agent tool で3つを同一メッセージ内で並列呼び出し:\n\n`
    + teamAgents.map((a, i) => `  ${i + 1}. subagent_type: "${a}"\n     prompt: "ARIS-${state.ticket} のRound 1で${a}視点でTI-XXX〜TI-XXXをComment記入"`).join('\n\n')
    + `\n\n参考: .claude/skills/dispatching-parallel-agents.md`,
}));
