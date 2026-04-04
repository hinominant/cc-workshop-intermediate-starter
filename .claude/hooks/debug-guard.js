#!/usr/bin/env node
'use strict';

/**
 * Debug Guard — PreToolUse Hook v2
 *
 * デバッグ時の品質を物理ブロックで強制する。
 *
 * 設計方針:
 * - 「調査」は常に許可（読み取り系コマンド、プロセス確認等）
 * - 「修正」は検索+レビュー後のみ許可（状態を変えるコマンド）
 * - 判断つかない場合はfail-open（調査を止めないことを優先）
 * - .context/ 配下と .claude/ 配下の操作は常に許可（デッドロック防止）
 *
 * フラグファイル:
 * - .context/debug-mode    → デバッグモード有効
 * - .context/debug-reviewed → レビュー実行済み
 */

const fs = require('fs');
const path = require('path');

const DEBUG_FLAG = path.join(process.cwd(), '.context', 'debug-mode');
const REVIEW_FLAG = path.join(process.cwd(), '.context', 'debug-reviewed');
const TOOL_LOG = path.join(process.cwd(), '.context', 'tool-log.jsonl');

// === 修正系ツール ===
const MODIFICATION_TOOLS = ['Edit', 'Write'];

// === 常に許可（デッドロック防止 + 調査系） ===
// .context/ → 無条件スルー（フラグ操作、デッドロック防止）
// .claude/hooks/, .claude/skills/ → isNeedsUserApproval()で処理（ask_user）
function isAlwaysAllowed(toolName, toolInput) {
  // Edit/Write: .context/ 配下のみ無条件許可
  if ((toolName === 'Edit' || toolName === 'Write') && toolInput?.file_path) {
    const fp = toolInput.file_path;
    if (fp.includes('.context/')) return true;
    // .claude/ はここでは許可しない（ask_userで処理）
  }

  if (toolName === 'Bash') {
    const cmd = (toolInput?.command || '');
    // .context/ 配下の操作は常に許可
    if (/\.context\//.test(cmd)) return true;
    // 読み取り系コマンドは常に許可
    if (/^\s*(ls|cat|head|tail|grep|rg|find|wc|diff|file|stat|pwd|hostname|uname|whoami|which|env|printenv|echo|printf)\b/.test(cmd)) return true;
    // プロセス・ネットワーク調査
    if (/^\s*(ps|lsof|pgrep|top|du|df|netstat|ifconfig)\b/.test(cmd)) return true;
    // OS設定確認（読み取りのみ）
    if (/^\s*(defaults\s+read|profiles|launchctl\s+(list|print)|tailscale\s+status)\b/.test(cmd)) return true;
    // ネットワーク調査
    if (/^\s*(curl|ssh|ping|dig|nslookup)\b/.test(cmd)) return true;
    // git読み取り
    if (/^\s*git\s+(status|log|diff|show|branch|remote|stash\s+list|check-ignore|describe)\b/.test(cmd)) return true;
    // GitHub CLI読み取り
    if (/^\s*gh\s+(issue|pr)\s+(view|list|search)\b/.test(cmd)) return true;
    // Claude/ツール情報
    if (/^\s*claude\s+--(version|help)\b/.test(cmd)) return true;
    // Docker読み取り
    if (/^\s*docker\s+(ps|images|logs|inspect)\b/.test(cmd)) return true;
    // mkdir -p（ディレクトリ作成は破壊的ではない）
    if (/^\s*mkdir\b/.test(cmd)) return true;
    // touch（空ファイル作成は破壊的ではない）
    if (/^\s*touch\b/.test(cmd)) return true;
    // sleep, wait
    if (/^\s*(sleep|wait)\b/.test(cmd)) return true;
  }

  return false;
}

// === 明確に状態を変えるBashコマンド ===
function isStateChangingBash(cmd) {
  const patterns = [
    /\bkill\s+\d/,
    /\bkill\s+-[^0]/,
    /\bpkill\b/,
    /\bkillall\b/,
    /\blaunchctl\s+(unload|load|remove|bootout|bootstrap|kickstart|disable|enable)\b/,
    /\bchmod\s/,
    /\bchown\s/,
    /\bsed\s.*-i/,
    /\bsudo\b/,
    /\bgit\s+(commit|push|reset|checkout|rebase|merge|stash\s+drop)\b/,
    /\bnpm\s+(install|uninstall|update)\b/,
    /\bpip\s+(install|uninstall)\b/,
    /\bbrew\s+(install|uninstall|update|upgrade)\b/,
    /\bsystemctl\s+(start|stop|restart|enable|disable)\b/,
  ];
  return patterns.some(p => p.test(cmd));
}

// === .claude/ 配下の修正はユーザー承認が必要 ===
function needsUserApproval(toolName, toolInput) {
  if ((toolName === 'Edit' || toolName === 'Write') && toolInput?.file_path) {
    const fp = toolInput.file_path;
    if (fp.includes('.claude/hooks/') || fp.includes('.claude/skills/') || fp.includes('.claude/settings')) return true;
  }
  if (toolName === 'Bash') {
    const cmd = (toolInput?.command || '');
    // .claude/hooks/ や .claude/skills/ への書き込み系操作
    if (/\.claude\/(hooks|skills|settings)/.test(cmd) && /(mv|rm|cp|sed|tee|>)/.test(cmd)) return true;
  }
  return false;
}

function isModificationTool(toolName, toolInput) {
  // 常に許可リストに該当 → スルー
  if (isAlwaysAllowed(toolName, toolInput)) return false;

  if (MODIFICATION_TOOLS.includes(toolName)) return true;

  if (toolName === 'Bash') {
    const cmd = (toolInput?.command || '');
    if (isStateChangingBash(cmd)) return true;
    // 判断つかない → fail-open
    return false;
  }
  return false;
}

// === ログ・フラグ読み取り ===
const RESEARCH_TOOLS = ['WebSearch', 'WebFetch'];
const REVIEW_TOOLS = ['Agent'];

function getInput() {
  return JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
}

function isDebugMode() {
  return fs.existsSync(DEBUG_FLAG);
}

function isReviewed() {
  return fs.existsSync(REVIEW_FLAG);
}

function readRecentToolLog(minutes = 30) {
  if (!fs.existsSync(TOOL_LOG)) return [];
  const cutoff = new Date(Date.now() - minutes * 60 * 1000).toISOString();
  const lines = fs.readFileSync(TOOL_LOG, 'utf8').trim().split('\n').filter(Boolean);
  return lines
    .map(line => { try { return JSON.parse(line); } catch { return null; } })
    .filter(entry => entry && entry.timestamp >= cutoff);
}

function hasRecentResearch(entries) {
  return entries.some(e => RESEARCH_TOOLS.includes(e.tool));
}

function hasRecentReview(entries) {
  return entries.some(e => REVIEW_TOOLS.includes(e.tool));
}

function countRecentModifications(entries) {
  return entries.filter(e => {
    if (MODIFICATION_TOOLS.includes(e.tool)) return true;
    if (e.tool === 'Bash') return isStateChangingBash(e.input_summary || '');
    return false;
  }).length;
}

// === メイン ===
function main() {
  const input = getInput();
  const { tool_name, tool_input } = input;

  // .claude/ 配下への修正はユーザー承認（デバッグモード関係なく常に）
  if (needsUserApproval(tool_name, tool_input)) {
    const target = tool_input?.file_path || tool_input?.command || '';
    console.log(JSON.stringify({
      decision: 'ask_user',
      reason: '🔒 HOOK GUARD: .claude/ 配下の修正にはユーザー承認が必要です。\n' +
        '対象: ' + (typeof target === 'string' ? target.substring(0, 100) : '') + '\n' +
        '承認する場合はYes、拒否する場合はNoを選択してください。'
    }));
    return;
  }

  if (!isModificationTool(tool_name, tool_input)) {
    console.log(JSON.stringify({ decision: 'approve' }));
    return;
  }

  const recentEntries = readRecentToolLog(30);

  // デバッグモード: 検索+レビューなしの修正をブロック
  if (isDebugMode()) {
    if (!hasRecentResearch(recentEntries)) {
      console.log(JSON.stringify({
        decision: 'block',
        reason: '🔍 DEBUG GUARD [検索未実行]: デバッグモード中。修正の前にWebSearch/WebFetchで外部情報を調べてください。'
      }));
      return;
    }
    if (!isReviewed() && !hasRecentReview(recentEntries)) {
      console.log(JSON.stringify({
        decision: 'block',
        reason: '👥 DEBUG GUARD [レビュー未実行]: デバッグモード中。修正の前にマルチ視点Agent/レビューAgentを実行してください。'
      }));
      return;
    }
  }

  // 対処療法検知
  const modCount = countRecentModifications(recentEntries);
  if (modCount >= 3 && !hasRecentResearch(recentEntries) && !hasRecentReview(recentEntries)) {
    console.log(JSON.stringify({
      decision: 'ask_user',
      reason: '⚠️ DEBUG GUARD [対処療法検知]: 直近30分で' + modCount + '回修正、外部検索/レビュー0回。対処療法の積み重ねになっていませんか？'
    }));
    return;
  }

  console.log(JSON.stringify({ decision: 'approve' }));
}

main();
