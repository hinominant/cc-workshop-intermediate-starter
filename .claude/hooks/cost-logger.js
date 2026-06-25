#!/usr/bin/env node
'use strict';

/**
 * Cost Logger — ARIS-838 Step 7 paired (PostToolUse)
 *
 * cost-budget-guard.js が参照する .agents/cost-log.jsonl に記録する。
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

const tool = input.tool_name;
const COST_TOOLS = new Set(['Agent', 'Skill', 'Bash']);
if (!COST_TOOLS.has(tool)) {
  console.log(JSON.stringify({ continue: true }));
  process.exit(0);
}

const CWD = process.cwd();
const LOG_PATH = path.join(CWD, '.agents', 'cost-log.jsonl');

const entry = {
  ts: new Date().toISOString(),
  tool,
  duration_s: input.tool_response?.duration_s || null,
};

try {
  fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
  fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + '\n');

  // サイズ制限: 10000行超えたら古いものから削除
  const content = fs.readFileSync(LOG_PATH, 'utf8');
  const lines = content.split('\n').filter(Boolean);
  if (lines.length > 10000) {
    fs.writeFileSync(LOG_PATH, lines.slice(-5000).join('\n') + '\n');
  }
} catch {}

console.log(JSON.stringify({ continue: true }));
