#!/usr/bin/env node
'use strict';

/**
 * Cost Budget Guard — ARIS-838 Step 7 (Ubie記事: 実行コストを明示的に最適化)
 *
 * LLM呼び出し/エージェント呼び出しの消費量を記録し、
 * 上限超過時にblockする。
 *
 * 予算設定ファイル: .context/budget.json
 *   {
 *     "agent_calls_per_hour": 30,
 *     "agent_calls_per_day": 200,
 *     "bash_calls_per_hour": 500
 *   }
 *
 * 消費記録: .agents/cost-log.jsonl (PostToolUseで記録、本hookで読み取り)
 *
 * PreToolUse として動作、Agent/Skill/Bash時のみチェック。
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
// コスト高い系のみ対象
const COST_TOOLS = new Set(['Agent', 'Skill', 'Bash']);
if (!COST_TOOLS.has(tool)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const CWD = process.cwd();
const BUDGET_PATH = path.join(CWD, '.context', 'budget.json');
const COST_LOG = path.join(CWD, '.agents', 'cost-log.jsonl');

// 予算ファイル読込（なければデフォルト）
let budget = {
  agent_calls_per_hour: 50,
  agent_calls_per_day: 300,
  bash_calls_per_hour: 1000,
};
try {
  const loaded = JSON.parse(fs.readFileSync(BUDGET_PATH, 'utf8'));
  budget = { ...budget, ...loaded };
} catch {}

// コストログ読込
let entries = [];
try {
  const content = fs.readFileSync(COST_LOG, 'utf8');
  entries = content.trim().split('\n').filter(Boolean).map(l => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean);
} catch {}

const now = Date.now();
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

// 直近1時間のAgent/Skill呼び出し
const agentCallsHour = entries.filter(e =>
  ['Agent', 'Skill'].includes(e.tool) && now - new Date(e.ts).getTime() < HOUR
).length;

// 直近24時間のAgent/Skill呼び出し
const agentCallsDay = entries.filter(e =>
  ['Agent', 'Skill'].includes(e.tool) && now - new Date(e.ts).getTime() < DAY
).length;

// 直近1時間のBash呼び出し
const bashCallsHour = entries.filter(e =>
  e.tool === 'Bash' && now - new Date(e.ts).getTime() < HOUR
).length;

// 警告閾値（80%）
const warnings = [];
if (agentCallsHour >= budget.agent_calls_per_hour * 0.8) {
  warnings.push(`Agent/Skill 1時間 ${agentCallsHour}/${budget.agent_calls_per_hour}`);
}
if (agentCallsDay >= budget.agent_calls_per_day * 0.8) {
  warnings.push(`Agent/Skill 24時間 ${agentCallsDay}/${budget.agent_calls_per_day}`);
}
if (bashCallsHour >= budget.bash_calls_per_hour * 0.8) {
  warnings.push(`Bash 1時間 ${bashCallsHour}/${budget.bash_calls_per_hour}`);
}

// 超過判定
let over = false;
let overReason = '';
if (['Agent', 'Skill'].includes(tool)) {
  if (agentCallsHour >= budget.agent_calls_per_hour) {
    over = true;
    overReason = `Agent/Skill 1時間の上限超過 (${agentCallsHour}/${budget.agent_calls_per_hour})`;
  } else if (agentCallsDay >= budget.agent_calls_per_day) {
    over = true;
    overReason = `Agent/Skill 24時間の上限超過 (${agentCallsDay}/${budget.agent_calls_per_day})`;
  }
}
if (tool === 'Bash' && bashCallsHour >= budget.bash_calls_per_hour) {
  over = true;
  overReason = `Bash 1時間の上限超過 (${bashCallsHour}/${budget.bash_calls_per_hour})`;
}

if (over) {
  console.log(JSON.stringify({
    decision: 'block',
    reason: `💰 Cost Budget Guard: ${overReason}\n\n`
      + `予算ファイル: ${path.relative(CWD, BUDGET_PATH)}\n`
      + `上限を引き上げるか、しばらく待ってから再試行してください。\n\n`
      + `⚠️ Ubie記事「実行コストを明示的に最適化」の原則:\n`
      + `  際限ない深掘りを防止するためにバジェット制約を設ける。`,
  }));
  process.exit(0);
}

// 警告あり → additionalContextで注入
if (warnings.length > 0) {
  console.log(JSON.stringify({
    decision: 'approve',
    additionalContext: `💰 Cost Budget Guard: 予算80%到達\n`
      + warnings.map(w => `  - ${w}`).join('\n'),
  }));
  process.exit(0);
}

console.log(JSON.stringify({ decision: 'approve' }));
