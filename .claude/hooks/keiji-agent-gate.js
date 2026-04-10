#!/usr/bin/env node
'use strict';

/**
 * Keiji Agent Gate — PreToolUse Hook (ARIS-448)
 *
 * .context/keiji-pending.json が存在する場合、
 * ask_user でKeiji Agentの問いを投げる。
 * 回答後にフラグを削除して次に進む。
 *
 * 設計方針:
 * - 読み取り系(Read/Grep/Glob/WebSearch/WebFetch/Agent)は通過
 * - .context/操作は常に通過（デッドロック防止）
 * - フラグがなければ即通過（高速）
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

// 読み取り系は通過
const PASS_THROUGH = new Set([
  'Read', 'Grep', 'Glob', 'WebSearch', 'WebFetch',
  'Agent', 'TaskList', 'TaskGet', 'TaskCreate', 'TaskUpdate',
]);
if (PASS_THROUGH.has(tool)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// .context/操作は通過
const filePath = (input.tool_input || {}).file_path || '';
if (filePath.includes('.context/')) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// フラグチェック
const pendingFile = path.join(process.cwd(), '.context', 'keiji-pending.json');
if (!fs.existsSync(pendingFile)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// フラグ読み込み
let pending;
try {
  pending = JSON.parse(fs.readFileSync(pendingFile, 'utf8'));
} catch {
  // 読み込み失敗→フラグ削除して通過
  try { fs.unlinkSync(pendingFile); } catch {}
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// フラグ削除（1回だけ発火）
try { fs.unlinkSync(pendingFile); } catch {}

// ask_user でKeiji Agentの問いを投げる
const fileName = pending.file ? pending.file.split('/').pop() : '不明';
const message = `🤔 Keiji Agent (自動起動): ${fileName} が変更されました。

メタパターン: ${pending.patterns || ''}

→ 変更されたファイル（${pending.file || ''}）を読んで、上記パターンの視点で具体的な問いを考えてください。
→ 固定テンプレートではなく、変更内容に即した問いを投げてください。
→ 問いに回答してから次に進んでください。`;

console.log(JSON.stringify({
  decision: 'ask_user',
  message: message,
}));
