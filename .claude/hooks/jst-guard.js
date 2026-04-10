#!/usr/bin/env node
'use strict';

/**
 * JST Guard — PreToolUse Hook (ARIS-36)
 *
 * Pythonコードで datetime.now() / date.today() がタイムゾーン指定なしで
 * 使われているのを検知してブロックする。
 *
 * UTCサーバーにデプロイするとJST→UTC差異でサイレント全機能停止する
 * （OPS-027）。仕組みで防止する。
 *
 * 許可: datetime.now(timezone.utc), datetime.now(JST), date.today() with tz conversion
 * ブロック: datetime.now(), date.today() (bare)
 */

const fs = require('fs');

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

// Pythonファイルのみ対象
if (!filePath.endsWith('.py')) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// テストファイルは除外
if (filePath.includes('/tests/') || filePath.includes('test_')) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 書き込み内容を確認
const content = input.tool_input.content || input.tool_input.new_string || '';

// 危険パターン: datetime.now() / date.today() のbare使用
const bareNow = /datetime\.now\(\s*\)/g;
const bareToday = /date\.today\(\s*\)/g;

// 安全パターン（これらは許可）
// datetime.now(timezone.utc), datetime.now(JST), datetime.now(tz=...)
const safeNow = /datetime\.now\(\s*(timezone\.|tz=|JST|ZoneInfo)/;

const nowMatches = content.match(bareNow) || [];
const todayMatches = content.match(bareToday) || [];

// 安全パターンを除外
const unsafeNow = nowMatches.filter(() => !safeNow.test(content));

if (unsafeNow.length > 0 || todayMatches.length > 0) {
  const issues = [];
  if (unsafeNow.length > 0) {
    issues.push(`datetime.now() が${unsafeNow.length}箇所でタイムゾーン未指定`);
  }
  if (todayMatches.length > 0) {
    issues.push(`date.today() が${todayMatches.length}箇所でタイムゾーン未指定`);
  }

  console.log(JSON.stringify({
    decision: 'ask_user',
    message: `⚠️ JST Guard: ${issues.join(', ')}。\n\n`
      + `UTCサーバーでサイレント障害を引き起こします（OPS-027）。\n`
      + `修正: datetime.now(timezone.utc) または datetime.now(ZoneInfo("Asia/Tokyo")) を使用してください。\n`
      + `date.today() → datetime.now(ZoneInfo("Asia/Tokyo")).date() に変更してください。`,
  }));
  process.exit(0);
}

console.log(JSON.stringify({ decision: 'approve' }));
