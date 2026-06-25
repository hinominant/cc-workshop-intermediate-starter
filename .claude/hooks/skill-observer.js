#!/usr/bin/env node
'use strict';

/**
 * Skill Observer — ARIS-838 Step 1 (SKILL_EVOLUTION OBSERVE)
 *
 * スキル/エージェント呼び出しの結果を .agents/skill-log.jsonl に記録する。
 * PostToolUse として動作。
 *
 * 記録対象:
 *   - Agent tool 呼び出し（subagent_type含む）
 *   - Skill tool 呼び出し
 *
 * 判定:
 *   - stderr/error あり → fail
 *   - 部分的（warning/一部失敗） → partial
 *   - それ以外 → success
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
// Agent / Skill の呼び出しのみ対象
if (tool !== 'Agent' && tool !== 'Skill') {
  console.log(JSON.stringify({ continue: true }));
  process.exit(0);
}

const CWD = process.cwd();
const LOG_DIR = path.join(CWD, '.agents');
const LOG_PATH = path.join(LOG_DIR, 'skill-log.jsonl');

// 記録内容決定
const toolInput = input.tool_input || {};
const toolResponse = input.tool_response;
const name = tool === 'Agent'
  ? (toolInput.subagent_type || 'unknown-agent')
  : (toolInput.skill || 'unknown-skill');

// 結果判定
function classifyResult() {
  if (!toolResponse) return 'unknown';
  const text = typeof toolResponse === 'string'
    ? toolResponse
    : JSON.stringify(toolResponse).slice(0, 2000);
  if (/\b(error|fail|failed|exception|traceback)\b/i.test(text)) return 'fail';
  if (/\b(warn|warning|partial|skipped)\b/i.test(text)) return 'partial';
  return 'success';
}

const result = classifyResult();

// context抽出（直前のuser_promptから推定）
let context = '';
if (toolInput.prompt) {
  context = String(toolInput.prompt).slice(0, 150);
} else if (toolInput.description) {
  context = String(toolInput.description).slice(0, 150);
}

// duration（toolResponseに含まれる場合）
const duration_s = toolResponse?.duration_s || null;

const entry = {
  date: new Date().toISOString(),
  tool,
  name,
  result,
  context,
  duration_s,
};

try {
  fs.mkdirSync(LOG_DIR, { recursive: true });
  fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + '\n');
} catch {}

console.log(JSON.stringify({ continue: true }));
