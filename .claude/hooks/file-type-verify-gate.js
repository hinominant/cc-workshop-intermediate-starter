#!/usr/bin/env node
'use strict';

/**
 * File Type Verify Gate — ARIS-836 (MAGIKA-004)
 *
 * 既存ファイルの拡張子と実体の不一致を検知してblock。
 *
 * Edit時の対象ファイルに対して:
 *   - magika/file/extensionで実体判定
 *   - 拡張子から期待するlabelと比較
 *   - 大きく乖離している場合はblock（false positive回避のため許容マップ使用）
 *
 * 例:
 *   foo.txt だが実体は PNG → block
 *   foo.md だが実体は ELF実行ファイル → block
 *   foo.json だが実体は テキスト with noJSON → block
 *
 * magika/file が未インストール時は拡張子判定のみ（fallback）のためスキップ。
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
if (tool !== 'Edit') {
  // 新規Writeは中身がinputに含まれるから、このhookの対象外
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const filePath = (input.tool_input || {}).file_path || '';
if (!filePath || !fs.existsSync(filePath)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// ディレクトリ/シンボリックリンクは対象外
try {
  const stat = fs.statSync(filePath);
  if (!stat.isFile()) {
    console.log(JSON.stringify({ decision: 'approve' }));
    process.exit(0);
  }
  // 空ファイルは判定不能なので通過
  if (stat.size === 0) {
    console.log(JSON.stringify({ decision: 'approve' }));
    process.exit(0);
  }
} catch {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

let helper;
try {
  helper = require('./_magika-helper');
} catch {
  // helper未配布 → 通過
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const { detectFileType, expectedLabelFromExtension } = helper;

const detected = detectFileType(filePath);
const expected = expectedLabelFromExtension(filePath);

// source == extension の場合、拡張子判定のみ → このhookは機能しないのでスキップ
if (detected.source === 'extension') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 許容マップ: 互換性のあるlabelペア
const COMPATIBLE_PAIRS = [
  ['text', 'markdown'], ['markdown', 'text'],
  ['text', 'json'], ['json', 'text'],
  ['text', 'yaml'], ['yaml', 'text'],
  ['text', 'javascript'], ['javascript', 'text'],
  ['text', 'typescript'], ['typescript', 'text'],
  ['text', 'python'], ['python', 'text'],
  ['text', 'shell'], ['shell', 'text'],
  ['text', 'html'], ['html', 'text'],
  ['text', 'css'], ['css', 'text'],
  ['text', 'xml'], ['xml', 'text'],
  ['text', 'unknown'], ['unknown', 'text'],
  ['markdown', 'unknown'], ['unknown', 'markdown'],
  ['javascript', 'typescript'], ['typescript', 'javascript'],
];

function isCompatible(a, b) {
  if (a === b) return true;
  return COMPATIBLE_PAIRS.some(([x, y]) => x === a && y === b);
}

if (isCompatible(detected.label, expected)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// CRITICAL な乖離パターン
const CRITICAL_MISMATCH = (
  // テキスト系拡張子だが実体がバイナリ
  (['text', 'markdown', 'json', 'yaml', 'javascript', 'typescript', 'python', 'shell', 'html', 'css', 'xml'].includes(expected)
    && ['executable', 'binary', 'image', 'video', 'audio', 'pdf', 'zip'].includes(detected.label))
  // 逆方向（バイナリ拡張子だがテキスト系 = 軽微なのでblockしない）
);

if (CRITICAL_MISMATCH) {
  console.log(JSON.stringify({
    decision: 'block',
    reason: `📁 File Type Verify Gate: 拡張子と実体の不一致（MAGIKA-004）\n`
      + `ファイル: ${filePath}\n`
      + `拡張子から期待: ${expected}\n`
      + `実体判定: ${detected.label} (score: ${detected.score}, source: ${detected.source})\n\n`
      + `CRITICAL: テキスト系拡張子にバイナリが格納されています。\n`
      + `悪意ある埋め込みの可能性があります。ファイル実体を確認してください。`,
  }));
  process.exit(0);
}

// 軽微な不一致 → 警告のみ
console.log(JSON.stringify({
  decision: 'approve',
  additionalContext: `📁 File Type Verify Gate: 軽微な不一致を検出\n`
    + `  ${filePath}: 期待${expected}/実体${detected.label} (score: ${detected.score})`,
}));
