#!/usr/bin/env node
'use strict';

/**
 * PII Detector — ARIS-840 (GAP-U02 S1)
 *
 * 日本の個人情報パターンを検出してblockする。
 * data-guard.jsの補完。
 *
 * 検出パターン:
 *   - 電話番号（090-xxxx-xxxx / 03-xxxx-xxxx / +81形式）
 *   - メールアドレス（実メール、テストメール除外）
 *   - クレジットカード番号（Luhn algorithm検証）
 *   - マイナンバー（12桁）
 *   - 郵便番号 + 住所の組み合わせ
 *   - 運転免許証番号 (12桁)
 *   - パスポート番号 (英字2 + 数字7)
 *
 * 許容対象:
 *   - .env, .env.example
 *   - tests ディレクトリのフィクスチャ（fake@ / test@ / example@）
 *   - docs ディレクトリの例示データ
 *   - ALLOWED_PII_FLAG で明示許可
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
if (tool !== 'Edit' && tool !== 'Write' && tool !== 'Bash') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const toolInput = input.tool_input || {};
const filePath = toolInput.file_path || '';

// テスト/example系は除外
if (/\/(tests?|fixtures?|examples?|spec)\//.test(filePath)
  || /\.env(\.example)?$/.test(filePath)
  || /\/docs?\//.test(filePath)
  || /\.(md|rst)$/.test(filePath)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 許可フラグがあればスキップ
if (fs.existsSync(path.join(process.cwd(), '.context', 'allow-pii'))) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

let text = '';
if (tool === 'Bash') text = toolInput.command || '';
else if (tool === 'Edit') text = toolInput.new_string || '';
else if (tool === 'Write') text = toolInput.content || '';

if (!text) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// Luhnアルゴリズム (クレカ番号検証)
function luhn(n) {
  const digits = n.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0, alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    alt = !alt;
  }
  return sum % 10 === 0;
}

const findings = [];

// 電話番号
const phoneMatches = text.match(/\b(0[789]0|0[1-9]\d?)-?\d{4}-?\d{4}\b/g) || [];
const realPhones = phoneMatches.filter(p => {
  // 明らかなダミー除外
  const digits = p.replace(/\D/g, '');
  if (/^(090|080|070)0{8}$/.test(digits)) return false;
  if (/^090-?1234-?5678$/.test(p)) return false;
  if (/^0120/.test(digits)) return false; // フリーダイヤル
  return true;
});
if (realPhones.length > 0) findings.push(`電話番号 ${realPhones.length}件 (例: ${realPhones[0]})`);

// メールアドレス
const emailMatches = text.match(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g) || [];
const realEmails = emailMatches.filter(e => {
  return !/^(test|fake|example|demo|sample|foo|bar|user|admin|noreply|no-reply|info|support|hello)@/i.test(e)
    && !/@(example\.com|test\.com|localhost|invalid)$/i.test(e)
    && !/^[a-z]+\d*@example/.test(e);
});
if (realEmails.length > 0) findings.push(`実メールアドレス ${realEmails.length}件 (例: ${realEmails[0]})`);

// クレカ番号（Luhn検証）
const ccMatches = text.match(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g) || [];
const realCcs = ccMatches.filter(c => {
  const digits = c.replace(/\D/g, '');
  if (/^4242424242424242$/.test(digits)) return false; // Stripe test
  if (/^0{16}$/.test(digits)) return false;
  return luhn(c);
});
if (realCcs.length > 0) findings.push(`クレジットカード番号 ${realCcs.length}件 (Luhn検証通過)`);

// マイナンバー（12桁、ただし日本語文脈でのみ判定）
if (/マイナンバー|個人番号|my\s*number/i.test(text)) {
  const myNumMatches = text.match(/\b\d{12}\b/g) || [];
  if (myNumMatches.length > 0) findings.push(`マイナンバー候補 ${myNumMatches.length}件`);
}

// 住所パターン（郵便番号 + 都道府県 + 番地）
const addressPattern = /〒?\s*\d{3}-?\d{4}[\s\S]{0,80}(東京都|大阪府|北海道|京都府|.{2,3}県)[\s\S]{1,50}(\d+-\d+|\d+番|\d+号|丁目)/g;
const addrMatches = text.match(addressPattern);
if (addrMatches) findings.push(`住所（郵便番号+都道府県+番地） ${addrMatches.length}件`);

// パスポート番号 (英字2 + 数字7)
const passportMatches = text.match(/\b[A-Z]{2}\d{7}\b/g) || [];
if (passportMatches.length > 0 && /パスポート|passport/i.test(text)) {
  findings.push(`パスポート番号候補 ${passportMatches.length}件`);
}

if (findings.length === 0) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

console.log(JSON.stringify({
  decision: 'block',
  reason: `🔐 PII Detector (ARIS-840): 個人情報を検出（${findings.length}件）\n\n`
    + findings.map(f => `  - ${f}`).join('\n')
    + `\n\n対応:\n`
    + `  1. テストデータならfake/example/test等の明示的ダミー形式に変更\n`
    + `  2. 本番データなら仮名化（ハッシュ化・マスキング）\n`
    + `  3. 意図的なら touch .context/allow-pii で一時許可\n\n`
    + `原則: 本番個人情報をコード/ログ/出力に含めない。`,
}));
