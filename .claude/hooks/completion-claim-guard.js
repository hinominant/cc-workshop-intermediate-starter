#!/usr/bin/env node
'use strict';

/**
 * Completion Claim Guard — PostToolUse Hook
 *
 * Iron Law: NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
 *
 * 「完了」「動いた」「直った」「PASS」等の主張を検知し、
 * 直近5分以内に検証コマンド（pytest/jest/build等）の実行履歴がない場合、
 * additionalContextで警告を注入する。
 *
 * 目的: エビデンスなしの完了主張を防ぐ（obra/superpowers由来）
 *
 * 参考: github.com/obra/superpowers/skills/verification-before-completion
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
const CONTEXT_DIR = path.join(CWD, '.context');
const VERIFICATION_LOG = path.join(CONTEXT_DIR, 'verification-log.jsonl');
const VERIFICATION_WINDOW_MS = 5 * 60 * 1000; // 5分

// === 検証コマンドの実行を記録（Bash時のみ）===
const tool = input.tool_name;
const command = (input.tool_input || {}).command || '';

// 検証コマンドパターン
const VERIFY_PATTERNS = [
  /\bpytest\b/,
  /\bnpm\s+test\b/,
  /\bjest\b/,
  /\bvitest\b/,
  /\bmocha\b/,
  /\bcargo\s+test\b/,
  /\bgo\s+test\b/,
  /\buv\s+run\s+pytest\b/,
  /\bnpm\s+run\s+build\b/,
  /\btsc\b/,
  /\bruff\s+check\b/,
  /\beslint\b/,
  /\bmypy\b/,
  /\bphase-transition\.js\s+check\b/,
];

const isVerifyCommand = tool === 'Bash' && VERIFY_PATTERNS.some(re => re.test(command));

if (isVerifyCommand) {
  try {
    fs.mkdirSync(CONTEXT_DIR, { recursive: true });
    fs.appendFileSync(VERIFICATION_LOG,
      JSON.stringify({
        ts: new Date().toISOString(),
        command: command.slice(0, 200),
      }) + '\n'
    );
  } catch {}
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// === 完了主張の検知（全ツール対象の出力テキスト）===
// PostToolUseなのでtool_responseを見る
const response = input.tool_response || {};
const responseText = typeof response === 'string'
  ? response
  : JSON.stringify(response).slice(0, 2000);

// 完了主張パターン（日本語+英語）
const CLAIM_PATTERNS = [
  /完了しました/,
  /動きました/,
  /直りました/,
  /修正しました/,
  /実装完了/,
  /テスト通りました/,
  /全て通過/,
  /全PASS/,
  /successfully\s+(completed|implemented|fixed|passed)/i,
  /all\s+tests?\s+pass/i,
  /works?\s+correctly/i,
  /✅\s*完了/,
  /✅\s*PASS/,
];

// 完了主張なし → 通過
if (!CLAIM_PATTERNS.some(re => re.test(responseText))) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// === 直近5分以内に検証コマンド実行があるか ===
let hasFreshVerification = false;
try {
  if (fs.existsSync(VERIFICATION_LOG)) {
    const lines = fs.readFileSync(VERIFICATION_LOG, 'utf8').trim().split('\n').filter(Boolean);
    if (lines.length > 0) {
      const last = JSON.parse(lines[lines.length - 1]);
      const age = Date.now() - new Date(last.ts).getTime();
      if (age < VERIFICATION_WINDOW_MS && age >= 0) {
        hasFreshVerification = true;
      }
    }
  }
} catch {}

if (hasFreshVerification) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// === 検証なしの完了主張 → additionalContextで警告 ===
console.log(JSON.stringify({
  decision: 'approve',
  additionalContext: '⚠️ Completion Claim Guard: 完了主張を検知しましたが、'
    + '直近5分以内に検証コマンド（pytest/jest/build等）の実行履歴がありません。\n\n'
    + 'Iron Law: NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE\n\n'
    + '「完了」と述べる前に以下を実行してください:\n'
    + '  1. IDENTIFY: その主張を証明するコマンドは何か\n'
    + '  2. RUN: 完全なコマンドを実行\n'
    + '  3. READ: 出力全体・exit code・失敗数を確認\n'
    + '  4. VERIFY: 出力が主張を裏付けているか\n'
    + '  5. ONLY THEN: 主張する\n\n'
    + 'エビデンスなしの「完了」は dishonesty であり efficiency ではありません。',
}));
