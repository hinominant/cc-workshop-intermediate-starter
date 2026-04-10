#!/usr/bin/env node
'use strict';

/**
 * Context Monitor — PostToolUse Hook
 *
 * statusLineが書き出した .context/context-usage.json から
 * 実際のコンテキスト使用率を読み取り、80%/90%閾値で警告を出す。
 *
 * 仕組み:
 *   statusLine (~/.claude/statusline.py) → .context/context-usage.json 書き出し
 *   このhook → .context/context-usage.json 読み取り → 閾値判定
 *
 * フォールバック: context-usage.json なし → ツール呼び出し回数で代用
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
const USAGE_PATH = path.join(CWD, '.context', 'context-usage.json');
const COUNTER_PATH = path.join(CWD, '.context', 'tool-call-counter.json');
const HANDOFF_FLAG = path.join(CWD, '.context', 'handoff-recommended');

const THRESHOLD_WARN = 80;     // %
const THRESHOLD_CRITICAL = 90; // %

// === 1. 実測値取得（statusLine経由） ===
let usagePercent = null;
try {
  const usage = JSON.parse(fs.readFileSync(USAGE_PATH, 'utf8'));
  usagePercent = usage.used_percentage;
} catch {}

// === 2. フォールバック: ツール呼び出し回数 ===
if (usagePercent === null) {
  let counter;
  try {
    counter = JSON.parse(fs.readFileSync(COUNTER_PATH, 'utf8'));
  } catch {
    counter = { count: 0, session_start: new Date().toISOString() };
  }
  counter.count = (counter.count || 0) + 1;
  try {
    fs.mkdirSync(path.dirname(COUNTER_PATH), { recursive: true });
    fs.writeFileSync(COUNTER_PATH, JSON.stringify(counter, null, 2));
  } catch {}
  // 250ツール呼び出し = 100% と仮定
  usagePercent = Math.min(100, Math.round(counter.count / 2.5));
}

// === 3. 閾値判定 + 自動実行 ===
const { execSync } = require('child_process');
const result = { decision: 'approve' };

function autoSaveHandoff() {
  try {
    const handoffScript = path.join(CWD, 'scripts', 'session-handoff.js');
    if (fs.existsSync(handoffScript)) {
      execSync(`node "${handoffScript}" save`, { cwd: CWD, timeout: 5000, encoding: 'utf8' });
      return true;
    }
  } catch {}
  return false;
}

if (usagePercent >= THRESHOLD_CRITICAL) {
  // 90%超過: 自動handoff保存 + 強制ブロック
  const flagExists = fs.existsSync(HANDOFF_FLAG);
  let saved = false;
  if (!flagExists) {
    saved = autoSaveHandoff();
    try { fs.writeFileSync(HANDOFF_FLAG, JSON.stringify({ ts: new Date().toISOString(), level: 'critical', percent: usagePercent, auto_saved: saved })); } catch {}
  }

  result.additionalContext = `🚨 CRITICAL: コンテキスト使用率 ${usagePercent}% （90%超過）\n\n`
    + (saved ? '✅ session-handoff.md を自動保存しました（.context/session-handoff.md）\n\n' : '')
    + '**今すぐセッションを終了して新しいセッションを起動してください。**\n'
    + '新セッションは自動的に session-handoff.md を読み込んで継続します。\n\n'
    + '残り作業余力: ' + (100 - usagePercent) + '% — これ以上の作業は危険です。';

} else if (usagePercent >= THRESHOLD_WARN) {
  // 80%超過: 自動handoff保存（初回のみ）+ 警告
  if (!fs.existsSync(HANDOFF_FLAG)) {
    const saved = autoSaveHandoff();
    try { fs.writeFileSync(HANDOFF_FLAG, JSON.stringify({ ts: new Date().toISOString(), level: 'warn', percent: usagePercent, auto_saved: saved })); } catch {}

    result.additionalContext = `⚠️ WARN: コンテキスト使用率 ${usagePercent}% （80%到達）\n\n`
      + (saved ? '✅ session-handoff.md を自動保存しました\n\n' : '')
      + '**残り20%でセッションが終了します。** キリの良いところで切り上げて、\n'
      + 'コミット → 新セッション起動 してください。\n\n'
      + '新セッションは session-handoff.md から自動継続します。';
  }
}

console.log(JSON.stringify(result));
