#!/usr/bin/env node
'use strict';

/**
 * Trace Store — ARIS-838 Step 6 (Meta-Harness + Ubie)
 *
 * 全ツール呼び出しの詳細トレースを .agents/traces/{session-id}/{timestamp}.jsonl に保存。
 * 選択的retrievalの基盤となる。
 *
 * PostToolUse として動作。
 *
 * 記録内容:
 *   - tool_name, tool_input (サマリ)
 *   - tool_response (先頭2000文字)
 *   - duration_s
 *   - decision (hookの結果)
 *
 * 保存先:
 *   .agents/traces/YYYYMMDD/{session-id}.jsonl （日別ローテーション）
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
const sessionId = process.env.CLAUDE_SESSION_ID || process.env.ARIS_SESSION_ID || 'default';
const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const TRACE_DIR = path.join(CWD, '.agents', 'traces', today);
const TRACE_PATH = path.join(TRACE_DIR, `${sessionId}.jsonl`);

// サイズ制限: 1日1セッションあたり最大10MB（ストレージ肥大化防止）
try {
  const stat = fs.statSync(TRACE_PATH);
  if (stat.size > 10 * 1024 * 1024) {
    console.log(JSON.stringify({ continue: true }));
    process.exit(0);
  }
} catch {}

const toolInput = input.tool_input || {};
const toolResponse = input.tool_response;

// 大きすぎるフィールドはトリム
function trim(obj, maxLen = 2000) {
  if (typeof obj === 'string') return obj.slice(0, maxLen);
  if (obj === null || obj === undefined) return obj;
  try {
    const str = JSON.stringify(obj);
    if (str.length <= maxLen) return obj;
    return { _truncated: true, preview: str.slice(0, maxLen) };
  } catch { return '[unserializable]'; }
}

const entry = {
  ts: new Date().toISOString(),
  session: sessionId,
  tool: input.tool_name,
  input_summary: {
    file_path: toolInput.file_path,
    command: typeof toolInput.command === 'string' ? toolInput.command.slice(0, 500) : undefined,
    subagent_type: toolInput.subagent_type,
    skill: toolInput.skill,
    prompt: typeof toolInput.prompt === 'string' ? toolInput.prompt.slice(0, 500) : undefined,
  },
  response: trim(toolResponse),
  duration_s: toolResponse?.duration_s || null,
};

// 空フィールドを除去
for (const key of Object.keys(entry.input_summary)) {
  if (entry.input_summary[key] === undefined) delete entry.input_summary[key];
}

try {
  fs.mkdirSync(TRACE_DIR, { recursive: true });
  fs.appendFileSync(TRACE_PATH, JSON.stringify(entry) + '\n');
} catch {}

console.log(JSON.stringify({ continue: true }));
