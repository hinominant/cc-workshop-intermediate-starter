#!/usr/bin/env node
'use strict';

/**
 * Download Guard — PreToolUse Hook (ARIS-189)
 *
 * curl/wget/git clone等の外部ダウンロードを検知し、
 * 不審なURL/ドメインからのダウンロードをブロックする。
 *
 * 許可: GitHub, PyPI, npm, 公式CDN等の信頼済みドメイン
 * 確認: その他のドメインからのダウンロード
 * ブロック: 明らかに不審なURL（IP直接アクセス、短縮URL等）
 */

const fs = require('fs');

let input;
try {
  input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
} catch {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

if (input.tool_name !== 'Bash') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const command = (input.tool_input || {}).command || '';

// ダウンロードコマンドの検知
const dlPatterns = [
  /curl\s.*-[oOL]/, // curl -o / -O / -L（リダイレクトフォロー）
  /wget\s/,
  /git\s+clone\s/,
];

const isDownload = dlPatterns.some(p => p.test(command));
if (!isDownload) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// curl -s（APIコール）はダウンロードではない。-o/-Oがなければ許可
if (/^curl\s/.test(command) && !/-[oOL]\b/.test(command)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 信頼済みドメイン
const TRUSTED_DOMAINS = [
  'github.com', 'raw.githubusercontent.com',
  'pypi.org', 'files.pythonhosted.org',
  'registry.npmjs.org', 'npmjs.com',
  'api.anthropic.com', 'api.openai.com',
  'api.linear.app', 'api.slack.com', 'api.notion.com',
  'api.telegram.org',
  'googleapis.com', 'google.com',
  'homebrew.sh', 'brew.sh',
  'releases.hashicorp.com',
];

// URLを抽出
const urlMatch = command.match(/https?:\/\/[^\s'"]+/);
if (urlMatch) {
  const url = urlMatch[0];
  const isTrusted = TRUSTED_DOMAINS.some(d => url.includes(d));

  if (isTrusted) {
    console.log(JSON.stringify({ decision: 'approve' }));
    process.exit(0);
  }

  // IP直接アクセスはブロック
  if (/https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)) {
    console.log(JSON.stringify({
      decision: 'block',
      message: `🚫 Download Guard: IP直接アクセスのダウンロードをブロック: ${url.substring(0, 100)}`,
    }));
    process.exit(0);
  }

  // 短縮URLはブロック
  const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'ow.ly'];
  if (shorteners.some(s => url.includes(s))) {
    console.log(JSON.stringify({
      decision: 'block',
      message: `🚫 Download Guard: 短縮URLからのダウンロードをブロック: ${url.substring(0, 100)}`,
    }));
    process.exit(0);
  }

  // その他は確認
  console.log(JSON.stringify({
    decision: 'ask_user',
    message: `📥 Download Guard: 外部ダウンロードを検知。\n\nURL: ${url.substring(0, 200)}\n\nこのダウンロードが安全であることを確認してください。`,
  }));
  process.exit(0);
}

// URL無しのダウンロードコマンドは確認
console.log(JSON.stringify({
  decision: 'ask_user',
  message: `📥 Download Guard: 外部ダウンロードコマンドを検知。\n\nコマンド: ${command.substring(0, 200)}\n\n安全なソースからのダウンロードであることを確認してください。`,
}));
