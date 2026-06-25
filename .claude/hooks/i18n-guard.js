#!/usr/bin/env node
'use strict';

/**
 * i18n Guard — ARIS-844 (GAP-U02 S5)
 *
 * フロントエンドファイル内のハードコード文字列を検出、i18n対応へ誘導。
 * Luna（日英両対応想定）で必須。
 *
 * 検出:
 *   - JSX内のリテラル日本語（t()やuseTranslation ラップなし）
 *   - 長い英語リテラル（UI文言と推定）
 *   - 日付フォーマット固定（"2026/04/16"等）
 *   - 通貨フォーマット固定（"¥1,000" / "$10.00"）
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
if (tool !== 'Edit' && tool !== 'Write') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const filePath = (input.tool_input || {}).file_path || '';
if (!/\.(tsx|jsx|vue|svelte)$/.test(filePath)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// テスト・ストーリー・フィクスチャは対象外
if (/\/(tests?|__tests__|stories|\.stories|fixtures?)\//.test(filePath) || filePath.endsWith('.test.tsx') || filePath.endsWith('.stories.tsx')) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const content = (input.tool_input || {}).content || (input.tool_input || {}).new_string || '';
if (!content) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// i18n ライブラリ使用有無
const usesI18n = /\b(useTranslation|i18next|useIntl|FormattedMessage|t\(|useT\(|trans\()/.test(content);

const findings = [];

// 1. JSX内の日本語リテラル抽出
// <...>日本語テキスト</...> or ={"日本語"} or placeholder="日本語"
const jsxJapanese = content.match(/>(?:[^<>{}\n]*[ぁ-んァ-ヴー一-龯][^<>{}\n]*)</g) || [];
const attrJapanese = content.match(/(?:placeholder|title|alt|aria-label)\s*=\s*["'][^"']*[ぁ-んァ-ヴー一-龯][^"']*["']/g) || [];

const japaneseLiterals = [...jsxJapanese, ...attrJapanese].filter(s => {
  // コメント内は除外
  return !/^<!--/.test(s);
});

if (japaneseLiterals.length > 0 && !usesI18n) {
  findings.push({
    rule: 'hardcoded-japanese',
    count: japaneseLiterals.length,
    example: japaneseLiterals[0].slice(0, 50),
    severity: 'HIGH',
  });
}

// 2. 長い英語UI文言（10文字以上、JSX内）
const longEnglish = content.match(/>([A-Z][a-z]+(?:\s+[a-z]+){2,})</g) || [];
if (longEnglish.length >= 3 && !usesI18n) {
  findings.push({
    rule: 'hardcoded-english',
    count: longEnglish.length,
    example: longEnglish[0].slice(0, 50),
    severity: 'MEDIUM',
  });
}

// 3. 日付フォーマット固定
const hardcodedDateFormats = content.match(/["']\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}["']/g) || [];
const hasIntlDate = /Intl\.DateTimeFormat|date-fns\/format|dayjs\(/.test(content);
if (hardcodedDateFormats.length >= 2 && !hasIntlDate) {
  findings.push({
    rule: 'hardcoded-date-format',
    count: hardcodedDateFormats.length,
    example: hardcodedDateFormats[0],
    severity: 'MEDIUM',
  });
}

// 4. 通貨フォーマット固定
const hardcodedCurrency = content.match(/["'][￥¥\$][\d,]+(?:\.\d+)?["']/g) || [];
const hasIntlNumber = /Intl\.NumberFormat/.test(content);
if (hardcodedCurrency.length >= 2 && !hasIntlNumber) {
  findings.push({
    rule: 'hardcoded-currency',
    count: hardcodedCurrency.length,
    example: hardcodedCurrency[0],
    severity: 'MEDIUM',
  });
}

if (findings.length === 0) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const highSeverity = findings.filter(f => f.severity === 'HIGH').length;

if (highSeverity > 0) {
  console.log(JSON.stringify({
    decision: 'block',
    reason: `🌐 i18n Guard (ARIS-844): ハードコード文字列 ${findings.length}種類\n\n`
      + findings.map(f => `  - [${f.severity}] ${f.rule}: ${f.count}件 (例: ${f.example})`).join('\n')
      + `\n\n対応:\n`
      + `  - 日本語/英語リテラル → t('キー')やi18next/useTranslation でラップ\n`
      + `  - 日付 → Intl.DateTimeFormat or date-fns\n`
      + `  - 通貨 → Intl.NumberFormat\n\n`
      + `i18n未導入プロジェクトの場合、まず導入を検討してください。\n`
      + `意図的なハードコード（単発、多言語化対象外）なら /* eslint-disable i18n */ でマーク。`,
  }));
  process.exit(0);
}

console.log(JSON.stringify({
  decision: 'approve',
  additionalContext: `🌐 i18n Guard: 改善推奨 ${findings.length}種類`,
}));
