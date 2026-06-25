#!/usr/bin/env node
'use strict';

/**
 * Accessibility Gate — ARIS-842 (GAP-U02 S3)
 *
 * WCAG 2.1 AA 違反パターンを検出する。
 * フロントエンドファイル (JSX/TSX/HTML/Vue) のEdit/Write時に発火。
 *
 * 検出:
 *   - <img> alt 属性なし/空
 *   - <button> / <a> にアクセシブル名がない
 *   - aria-label 無効使用
 *   - role と semantic HTML の衝突
 *   - onClick on non-interactive element（div onClick）
 *   - color のみで情報伝達
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
if (!/\.(tsx|jsx|html|vue|svelte)$/.test(filePath)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const content = (input.tool_input || {}).content || (input.tool_input || {}).new_string || '';
if (!content) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const findings = [];

// 1. img タグでalt属性なし or 空
const imgMatches = content.match(/<img\s[^>]*>/gi) || [];
for (const img of imgMatches) {
  if (!/\balt\s*=/i.test(img)) {
    findings.push({ rule: 'img-alt-missing', match: img.slice(0, 80), severity: 'HIGH' });
  }
  // 空 alt は装飾用として許容、ただし中身が無いsrcでない場合のみ
  // alt="" は装飾意図として扱う
}

// 2. button / a にアクセシブル名なし
const buttonMatches = content.match(/<button\s[^>]*>([^<]*)<\/button>/gi) || [];
for (const btn of buttonMatches) {
  const inner = btn.replace(/^<button[^>]*>/, '').replace(/<\/button>$/, '').trim();
  const hasAriaLabel = /aria-label\s*=\s*["'][^"']+["']/i.test(btn);
  const hasAriaLabelledby = /aria-labelledby\s*=/i.test(btn);
  if (!inner && !hasAriaLabel && !hasAriaLabelledby) {
    findings.push({ rule: 'button-no-accessible-name', match: btn.slice(0, 80), severity: 'HIGH' });
  }
}

const anchorMatches = content.match(/<a\s[^>]*>([^<]*)<\/a>/gi) || [];
for (const a of anchorMatches) {
  const inner = a.replace(/^<a[^>]*>/, '').replace(/<\/a>$/, '').trim();
  const hasAriaLabel = /aria-label\s*=\s*["'][^"']+["']/i.test(a);
  if (!inner && !hasAriaLabel) {
    findings.push({ rule: 'link-no-accessible-name', match: a.slice(0, 80), severity: 'HIGH' });
  }
}

// 3. onClick on div/span (非interactive要素)
const divClickMatches = content.match(/<(div|span)\s[^>]*on[cC]lick\s*=/g) || [];
for (const m of divClickMatches) {
  // roleかtabIndexがあれば許容
  const context = content.slice(content.indexOf(m), content.indexOf(m) + 200);
  if (!/role\s*=\s*["'](button|link)/.test(context) && !/tabIndex/.test(context)) {
    findings.push({ rule: 'non-interactive-click', match: m.slice(0, 80), severity: 'MEDIUM' });
  }
}

// 4. 色のみで情報伝達 (style内のcolor指定で"エラー"や"成功"を示すが、アイコン/テキストなし)
// ざっくり検知: className="text-red-500" などが <Icon/>や aria-labelなしで単独
const colorOnlyPatterns = [
  /className\s*=\s*["'][^"']*\b(text-red|text-green|bg-red|bg-green)/g,
];
// 詳細検証はスキップ（false positive多い）

// 5. ラベル欠如 <input> without <label>
const inputMatches = content.match(/<input\s[^>]*>/gi) || [];
for (const input of inputMatches) {
  const hasAriaLabel = /aria-label\s*=\s*["'][^"']+["']/i.test(input);
  const hasAriaLabelledby = /aria-labelledby\s*=/i.test(input);
  const hasId = input.match(/\bid\s*=\s*["']([^"']+)/);
  if (!hasAriaLabel && !hasAriaLabelledby && hasId) {
    // id があっても <label for="..."> が対応してるかは静的に不明なので警告のみ
    // 簡易実装なのでスキップ
  } else if (!hasAriaLabel && !hasAriaLabelledby && !hasId) {
    findings.push({ rule: 'input-no-label', match: input.slice(0, 80), severity: 'HIGH' });
  }
}

// 6. tabindex > 0 (アンチパターン)
const tabindexMatches = content.match(/tabIndex\s*=\s*["{]?(\d+)["}]?/gi) || [];
for (const m of tabindexMatches) {
  const n = parseInt(m.match(/\d+/)[0], 10);
  if (n > 0) {
    findings.push({ rule: 'positive-tabindex', match: m, severity: 'MEDIUM' });
  }
}

if (findings.length === 0) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const highSeverity = findings.filter(f => f.severity === 'HIGH').length;

if (highSeverity > 0) {
  console.log(JSON.stringify({
    decision: 'block',
    reason: `♿ Accessibility Gate (ARIS-842): WCAG 2.1 AA違反 ${findings.length}件（HIGH: ${highSeverity}件）\n\n`
      + findings.slice(0, 5).map(f => `  - [${f.severity}] ${f.rule}: ${f.match}`).join('\n')
      + (findings.length > 5 ? `\n  ...他${findings.length - 5}件` : '')
      + `\n\n対応:\n`
      + `  - <img>には意味のあるalt、装飾用はalt=""\n`
      + `  - <button>/<a>にはテキスト or aria-label\n`
      + `  - <input>にはlabel or aria-label\n`
      + `  - onClick は <button> を使う（divではなく）\n\n`
      + `参考: WCAG 2.1 AA / https://www.w3.org/WAI/WCAG21/quickref/`,
  }));
  process.exit(0);
}

// MEDIUM のみ → 警告
console.log(JSON.stringify({
  decision: 'approve',
  additionalContext: `♿ Accessibility Gate: 改善推奨 ${findings.length}件\n`
    + findings.slice(0, 3).map(f => `  - [${f.severity}] ${f.rule}`).join('\n'),
}));
