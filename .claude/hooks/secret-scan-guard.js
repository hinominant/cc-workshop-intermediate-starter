#!/usr/bin/env node
'use strict';

/**
 * Secret Scan Guard — PreToolUse Hook (ARIS-191)
 *
 * Bash/Edit/Writeの入力に機密データ（APIキー、パスワード、トークン等）が
 * 含まれていないかスキャンし、外部送信を防止する。
 *
 * 検知対象:
 * - APIキー（sk-ant-, xoxb-, ghp_, lin_api_ 等のプレフィックス）
 * - パスワード文字列（password=, PASS= 等の代入）
 * - 秘密鍵（-----BEGIN PRIVATE KEY----）
 * - .envファイルの丸ごとcat/echo
 *
 * 設計方針:
 * - 値のパターンマッチ（プレフィックス検知）
 * - .envのsource/catは許可（ローカル操作）。echo/curlへのパイプは検知
 * - fail-open: パース失敗時は通過
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
const toolInput = input.tool_input || {};

// 対象ツールのみ
if (tool !== 'Bash' && tool !== 'Edit' && tool !== 'Write') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 検査対象テキストを取得
let textToScan = '';
if (tool === 'Bash') {
  textToScan = toolInput.command || '';
} else if (tool === 'Edit') {
  textToScan = toolInput.new_string || '';
} else if (tool === 'Write') {
  textToScan = toolInput.content || '';
}

if (!textToScan) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// .envファイル操作は許可（ローカル操作）
const filePath = toolInput.file_path || '';
if (filePath.endsWith('.env') || filePath.endsWith('.env.example')) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// ARIS-834 (MAGIKA-002): 拡張子偽装検知
// Edit/Writeで操作対象のファイルが、拡張子は無害だが実体が機密ファイルの場合をblock
if ((tool === 'Edit' || tool === 'Write') && filePath) {
  try {
    const { detectFileType, isSecretLike, expectedLabelFromExtension } = require('./_magika-helper');
    if (fs.existsSync(filePath)) {
      const detected = detectFileType(filePath);
      const expected = expectedLabelFromExtension(filePath);
      if (isSecretLike(detected.label) && !isSecretLike(expected) && detected.score > 0.7) {
        console.log(JSON.stringify({
          decision: 'block',
          reason: `🔐 Secret Scan Guard: 拡張子偽装の疑い（MAGIKA-002）\n`
            + `ファイル: ${filePath}\n`
            + `拡張子から期待: ${expected}\n`
            + `実体判定: ${detected.label} (score: ${detected.score}, source: ${detected.source})\n\n`
            + `機密ファイルが無害な拡張子で偽装されている可能性があります。`,
        }));
        process.exit(0);
      }
    }
  } catch {}
}

// source .env や grep .env はローカル操作なので許可
if (tool === 'Bash' && /^(source|set -a|export|grep|cat .*\.env)/.test(textToScan.trim())) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 機密データパターン
const SECRET_PATTERNS = [
  { name: 'Anthropic API Key', pattern: /sk-ant-api\d{2}-[A-Za-z0-9_-]{20,}/ },
  { name: 'Slack Bot Token', pattern: /xoxb-\d{10,}-[A-Za-z0-9-]{20,}/ },
  { name: 'Slack App Token', pattern: /xapp-\d+-[A-Za-z0-9-]{20,}/ },
  { name: 'GitHub Token', pattern: /ghp_[A-Za-z0-9]{36,}/ },
  { name: 'Linear API Key', pattern: /lin_api_[A-Za-z0-9]{20,}/ },
  { name: 'Supabase Key', pattern: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]{50,}/ },
  { name: 'AWS Secret Key', pattern: /(?:AKIA|ASIA)[A-Z0-9]{16}/ },
  { name: 'Private Key', pattern: /-----BEGIN (RSA |EC |DSA )?PRIVATE KEY-----/ },
  { name: 'Telegram Bot Token', pattern: /\d{8,}:[A-Za-z0-9_-]{35}/ },
  { name: 'Google OAuth Token', pattern: /ya29\.[A-Za-z0-9_-]{50,}/ },
  { name: 'Google Refresh Token', pattern: /1\/\/[A-Za-z0-9_-]{40,}/ },
];

// パスワード代入パターン（値が実際に含まれている場合のみ）
const PASSWORD_PATTERNS = [
  { name: 'Password assignment', pattern: /(?:password|passwd|pass|secret)[\s]*[=:]\s*['"][^'"]{8,}['"]/i },
];

const allPatterns = [...SECRET_PATTERNS, ...PASSWORD_PATTERNS];
const detections = [];

for (const { name, pattern } of allPatterns) {
  if (pattern.test(textToScan)) {
    detections.push(name);
  }
}

if (detections.length > 0) {
  console.log(JSON.stringify({
    decision: 'block',
    message: `🔒 Secret Scan Guard: 機密データを検知しました。\n\n`
      + `検知: ${detections.join(', ')}\n\n`
      + `機密データを外部に送信したり、コードにハードコードしないでください。\n`
      + `環境変数（.env）経由で参照してください。`,
  }));
  process.exit(0);
}

console.log(JSON.stringify({ decision: 'approve' }));
