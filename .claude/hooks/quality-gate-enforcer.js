#!/usr/bin/env node
'use strict';

/**
 * Quality Gate Enforcer - PreToolUse Hook
 *
 * git commit を検知したとき:
 * 1. .quality-gate-passed フラグファイルが存在し、ノンス検証OK、10分以内 → approve（フラグ削除）
 * 2. フラグがない or 古い or ノンス不正 → block（/quality-gate を実行させる）
 *
 * /quality-gate スキルが Phase C 通過後にフラグを作成し、
 * Step 3 で git commit を実行する。この commit はフラグがあるので通過する。
 *
 * フラグファイルには HMAC ノンスを書き込み、touch だけではバイパスできない。
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const FLAG_FILE = path.join(process.cwd(), '.quality-gate-passed');
const MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes

// HMAC key derived from repo path (deterministic per-repo, not a secret — prevents casual touch bypass)
const HMAC_KEY = crypto.createHash('sha256').update('qg:' + process.cwd()).digest('hex').slice(0, 16);

function generateNonce() {
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac('sha256', HMAC_KEY).update(timestamp).digest('hex').slice(0, 16);
  return `${timestamp}:${hmac}`;
}

function verifyFlag() {
  try {
    const content = fs.readFileSync(FLAG_FILE, 'utf8').trim();
    const [timestamp, hmac] = content.split(':');
    if (!timestamp || !hmac) return false;

    // Check age
    const age = Date.now() - parseInt(timestamp, 10);
    if (age > MAX_AGE_MS || age < 0) return false;

    // Verify HMAC
    const expected = crypto.createHmac('sha256', HMAC_KEY).update(timestamp).digest('hex').slice(0, 16);
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expected));
  } catch {
    return false;
  }
}

function removeFlag() {
  try {
    fs.unlinkSync(FLAG_FILE);
  } catch {
    // ignore
  }
}

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const toolName = data.tool_name || '';
    const toolInput = data.tool_input || {};

    // Only intercept Bash commands containing git commit
    if (toolName !== 'Bash' || !toolInput.command) {
      process.stdout.write(JSON.stringify({ decision: 'approve' }));
      return;
    }

    const cmd = toolInput.command;
    const isGitCommit = /\bgit\b.*\bcommit\b/.test(cmd);

    if (!isGitCommit) {
      process.stdout.write(JSON.stringify({ decision: 'approve' }));
      return;
    }

    // git commit detected — check for quality gate flag with nonce verification
    if (verifyFlag()) {
      // Quality gate passed recently, nonce valid — allow commit, consume flag
      removeFlag();
      process.stdout.write(JSON.stringify({
        decision: 'approve',
        additionalContext: '✅ Quality Gate passed. Commit approved.',
      }));
    } else {
      // No valid flag — block and redirect to /quality-gate
      process.stdout.write(JSON.stringify({
        decision: 'block',
        reason: [
          '🚫 Direct git commit is blocked.',
          '/quality-gate スキルを実行してください。',
          'このスキルがテスト・監査・コミットを一括で実行します。',
          'Direct commit is not allowed — /quality-gate includes the commit step.',
        ].join(' '),
      }));
    }
  } catch {
    process.stdout.write(JSON.stringify({ decision: 'approve' }));
  }
});

// Flag creation is handled by quality-gate-flag.js (separate script to avoid stdin conflicts)
// Usage: node .claude/hooks/quality-gate-flag.js
