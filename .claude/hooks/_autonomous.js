#!/usr/bin/env node
'use strict';

/**
 * _autonomous.js — autonomous-mode 共通ヘルパー
 *
 * .context/autonomous-mode ファイルが存在する場合、
 * ask_user の代わりに approve + ログ記録する。
 *
 * Usage:
 *   const { isAutonomous, autonomousApprove } = require('./_autonomous');
 *
 *   if (shouldAskUser) {
 *     autonomousApprove('hook-name', message);  // autonomous時はここでexit
 *     // autonomous でなければここに来る
 *     console.log(JSON.stringify({ decision: 'ask_user', message }));
 *   }
 */

const fs = require('fs');
const path = require('path');

const AUTONOMOUS_FLAG = path.join(process.cwd(), '.context', 'autonomous-mode');
const DEFERRED_LOG = path.join(process.cwd(), '.context', 'deferred-reviews.jsonl');

const isAutonomous = fs.existsSync(AUTONOMOUS_FLAG);

/**
 * autonomous-mode時にask_userをapproveに変換してログ記録。
 * autonomousでない場合は何もしない（falseを返す）。
 * autonomousの場合はprocess.exit(0)するので呼び出し元に戻らない。
 *
 * @param {string} hookName - hook名（ログ用）
 * @param {string} message - ask_userに表示するはずだったメッセージ
 * @returns {boolean} false（autonomousでない場合のみ到達）
 */
function autonomousApprove(hookName, message) {
  if (!isAutonomous) return false;
  try {
    fs.appendFileSync(DEFERRED_LOG,
      JSON.stringify({ ts: new Date().toISOString(), hook: hookName, message }) + '\n'
    );
  } catch {}
  process.stdout.write(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

module.exports = { isAutonomous, autonomousApprove };
