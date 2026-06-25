#!/usr/bin/env node
'use strict';

/**
 * Responsive Check — ARIS-843 (GAP-U02 S4)
 *
 * CSS/Tailwindファイル編集時にレスポンシブ設計の欠落を検知。
 *
 * 検出:
 *   - Tailwind: sm:/md:/lg:/xl: プレフィックスなしの固定width/height
 *   - 生CSS: @media クエリ欠如 + 大きな固定px
 *   - overflowハンドリング不足（長文コンテナ）
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
if (!/\.(css|scss|sass|less|tsx|jsx|vue)$/.test(filePath)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const content = (input.tool_input || {}).content || (input.tool_input || {}).new_string || '';
if (!content) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const findings = [];

// 1. Tailwindで大きな固定width（w-[500px] 等）にレスポンシブprefixがない
const tailwindWidth = content.match(/\bw-\[(\d+)(px|rem|em)\]/g) || [];
for (const m of tailwindWidth) {
  const val = parseInt(m.match(/\d+/)[0], 10);
  const unit = m.match(/(px|rem|em)/)[0];
  // >= 400px or >= 24rem = ほぼデスクトップ想定
  const isLarge = (unit === 'px' && val >= 400) || (unit === 'rem' && val >= 24);
  if (isLarge) {
    // 同行内に sm:/md:/lg: プレフィックスなし
    const idx = content.indexOf(m);
    const lineStartRaw = content.lastIndexOf('\n', idx);
    const lineEndRaw = content.indexOf('\n', idx);
    const lineStart = lineStartRaw === -1 ? 0 : lineStartRaw + 1;
    const lineEnd = lineEndRaw === -1 ? content.length : lineEndRaw;
    const line = content.slice(lineStart, lineEnd);
    if (!/\b(sm|md|lg|xl|2xl):/.test(line)) {
      findings.push({ rule: 'fixed-width-no-responsive', match: m, severity: 'HIGH' });
    }
  }
}

// 2. CSSで固定px width + @media なし
if (/\.(css|scss|sass|less)$/.test(filePath)) {
  const hasMediaQuery = /@media\s*\(/i.test(content);
  const largeFixedWidth = content.match(/\bwidth:\s*\d{3,}px/gi) || [];
  if (!hasMediaQuery && largeFixedWidth.length >= 2) {
    findings.push({
      rule: 'css-no-media-query',
      match: `${largeFixedWidth.length}件の固定width、@media なし`,
      severity: 'HIGH',
    });
  }
}

// 3. overflow-x: scroll / overflow: hidden の多用（レスポンシブ対応の応急処置）
const overflowHidden = (content.match(/overflow[-a-z]*:\s*hidden/gi) || []).length;
if (overflowHidden >= 5) {
  findings.push({
    rule: 'overflow-hidden-overuse',
    match: `overflow:hidden が${overflowHidden}箇所（レスポンシブ応急処置の疑い）`,
    severity: 'MEDIUM',
  });
}

// 4. min-width: XXXpx の大きな指定
const minWidth = content.match(/\bmin-width:\s*(\d+)px/gi) || [];
for (const m of minWidth) {
  const val = parseInt(m.match(/\d+/)[0], 10);
  if (val >= 768) {
    findings.push({
      rule: 'min-width-too-large',
      match: m,
      severity: 'MEDIUM',
    });
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
    reason: `📱 Responsive Check (ARIS-843): レスポンシブ設計の問題 ${findings.length}件（HIGH: ${highSeverity}件）\n\n`
      + findings.slice(0, 5).map(f => `  - [${f.severity}] ${f.rule}: ${f.match}`).join('\n')
      + `\n\n対応:\n`
      + `  - Tailwind: w-full md:w-[500px] のようにプレフィックス付与\n`
      + `  - 生CSS: @media (max-width: 768px) { ... } を追加\n`
      + `  - overflow: hiddenではなく、flex/grid で解決\n\n`
      + `参考: DESIGN_LUNA.md § Layout § Breakpoints`,
  }));
  process.exit(0);
}

console.log(JSON.stringify({
  decision: 'approve',
  additionalContext: `📱 Responsive Check: 改善推奨 ${findings.length}件`,
}));
