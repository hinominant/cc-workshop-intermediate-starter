#!/usr/bin/env node
'use strict';

/**
 * Design Harness Gate — PreToolUse Hook (汎用版)
 *
 * Edit/Write 系 tool 呼出時に、Slide ファイル / Visual primitives 編集の
 * DESIGN_HARNESS.md ルール違反を検出して stderr に warn する。
 *
 * 設計方針:
 *   - block ではなく warn (常に { decision: "approve" })
 *   - false positive < 5% を目標
 *   - プロジェクト固有の対象 path は環境変数 DESIGN_HARNESS_PATHS で上書き可
 *
 * 検出ルール (5):
 *   Rule 1: 禁止文字列 (CLAUDE.md ルール 2 / Luna|NOVA|ARIS|Utata|hinominant)
 *   Rule 2: points kind に単独数字 (「2倍」「N%」等)
 *   Rule 3: 5-7 枚制約 (Write 時のみ)
 *   Rule 4: 同 kind 4 連続禁止
 *   Rule 5: DESIGN_HARNESS.md or DESIGN.md 不在 (sentinel で 1 度だけ警告)
 *
 * 設定:
 *   - 環境変数 DESIGN_HARNESS_PATHS = カンマ区切り正規表現リスト
 *     (例: "lib/courses/content/[^/]+/slides\.ts$,components/slides/.+\.tsx$")
 *   - 未指定なら DEFAULT_PATTERNS を使う
 *
 * 配布元: hino-orchestrator/_templates/hooks/design-harness-gate.js
 * Spec: _templates/DESIGN_HARNESS.md §10.1, _common/DESIGN_HARNESS_METHODOLOGY.md §2.3.1
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
const filePath = (input.tool_input || {}).file_path || '';
const content = (input.tool_input || {}).content || '';
const newString = (input.tool_input || {}).new_string || '';
const edits = (input.tool_input || {}).edits || [];

// 対象 tool 以外は通過
if (!['Edit', 'Write', 'MultiEdit'].includes(tool)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 対象ファイルパターン (プロジェクト固有上書き可)
const DEFAULT_PATTERNS = [
  /lib\/courses\/content\/[^/]+\/slides\.ts$/,
  /components\/slides\/.+\.tsx$/,
  /components\/slides\/types\.ts$/,
];
const TARGET_PATTERNS = process.env.DESIGN_HARNESS_PATHS
  ? process.env.DESIGN_HARNESS_PATHS.split(',').map((s) => new RegExp(s.trim()))
  : DEFAULT_PATTERNS;
const isTarget = TARGET_PATTERNS.some((re) => re.test(filePath));
if (!isTarget) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 編集後の content (best effort)
let body = '';
if (tool === 'Write') {
  body = content;
} else if (tool === 'Edit') {
  body = newString;
} else if (tool === 'MultiEdit') {
  body = edits.map((e) => e.new_string || '').join('\n');
}

const warnings = [];

// Rule 1: 禁止文字列 (動的構築でフック自身が hit しない)
const FORBIDDEN_PARTS = ['L' + 'una', 'N' + 'OVA', 'A' + 'RIS', 'U' + 'tata', 'h' + 'inominant'];
const forbiddenPattern = new RegExp(`\\b(${FORBIDDEN_PARTS.join('|')})\\b`);
const forbiddenMatch = body.match(forbiddenPattern);
if (forbiddenMatch) {
  warnings.push(
    `Rule 1 (禁止文字列): "${forbiddenMatch[0]}" を検出。CLAUDE.md ルール 2 に違反。`,
  );
}

// Rule 2: points kind の items に単独数字 (N倍 / N% / N→M)
function isNumberOnlyPoint(text) {
  const cleaned = text.replace(/[0-9]+\s*(倍|%|→|年)|\d+/g, '').trim();
  return cleaned.length <= 3;
}
const pointsBlockMatch = body.match(/kind:\s*["']points["'][^}]*items:\s*\[([^\]]+)\]/g) || [];
for (const block of pointsBlockMatch) {
  const itemsMatch = block.match(/items:\s*\[([^\]]+)\]/);
  if (!itemsMatch) continue;
  const items = itemsMatch[1].match(/"[^"]+"|'[^']+'/g) || [];
  for (const item of items) {
    const text = item.slice(1, -1);
    if (/[0-9]+\s*(倍|%|→|年)/.test(text) && isNumberOnlyPoint(text)) {
      warnings.push(
        `Rule 2 (points + 単独数字): "${text}" は points kind で単独表示すべきでない。stat kind に移すことを推奨 (DESIGN_HARNESS.md §6.1)。`,
      );
    }
  }
}

// Rule 3: 5-7 枚制約 (Write 時のみ、slides 配列の brace カウント)
if (tool === 'Write' && /export const \w+_SLIDES/.test(body)) {
  const arrayMatch = body.match(/=\s*\[([\s\S]+)\]\s*;?\s*$/);
  if (arrayMatch) {
    const arrayBody = arrayMatch[1];
    let depth = 0;
    let topLevelObjects = 0;
    for (const ch of arrayBody) {
      if (ch === '{') {
        if (depth === 0) topLevelObjects++;
        depth++;
      } else if (ch === '}') {
        depth--;
      }
    }
    if (topLevelObjects > 0 && (topLevelObjects < 5 || topLevelObjects > 7)) {
      warnings.push(
        `Rule 3 (5-7 枚制約): スライド数 ${topLevelObjects} 枚は推奨範囲外 (DESIGN_HARNESS.md §5.1)。`,
      );
    }
  }
}

// Rule 4: 同 kind 4 連続禁止
const kindMatches = body.match(/kind:\s*["'](\w+)["']/g) || [];
const kinds = kindMatches.map((m) => m.match(/["'](\w+)["']/)[1]);
let runLength = 1;
for (let i = 1; i < kinds.length; i++) {
  if (kinds[i] === kinds[i - 1]) {
    runLength++;
    if (runLength >= 4) {
      warnings.push(
        `Rule 4 (連続同 kind): "${kinds[i]}" が 4 連続。kind 多様性を保つこと (DESIGN_HARNESS.md §5.1 / §6.4)。`,
      );
      break;
    }
  } else {
    runLength = 1;
  }
}

// Rule 5: DESIGN_HARNESS.md or DESIGN.md 不在 (1 度だけ警告 / sentinel)
const projectRoot = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const harnessPath = path.join(projectRoot, 'DESIGN_HARNESS.md');
const designPath = path.join(projectRoot, 'DESIGN.md');
const sentinelPath = path.join(projectRoot, '.context', 'design-harness-warned');
if (!fs.existsSync(harnessPath) && !fs.existsSync(designPath) && !fs.existsSync(sentinelPath)) {
  warnings.push(
    `Rule 5 (DESIGN_HARNESS.md 不在): プロジェクトルートに DESIGN_HARNESS.md がありません。/design-md mode:harness で生成を推奨。`,
  );
  try {
    fs.mkdirSync(path.dirname(sentinelPath), { recursive: true });
    fs.writeFileSync(sentinelPath, new Date().toISOString());
  } catch {
    // sentinel 書込失敗は無視
  }
}

// Output: warn を stderr に、必ず approve を返す
if (warnings.length > 0) {
  console.error('');
  console.error('⚠️ Design Harness Gate — 警告 ' + warnings.length + ' 件:');
  warnings.forEach((w, i) => console.error(`   ${i + 1}. ${w}`));
  console.error('');
}

console.log(JSON.stringify({ decision: 'approve' }));
process.exit(0);
