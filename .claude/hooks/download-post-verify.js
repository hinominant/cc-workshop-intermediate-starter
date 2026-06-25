#!/usr/bin/env node
'use strict';

/**
 * Download Post-Verify — ARIS-835 (MAGIKA-003)
 *
 * curl/wget等のダウンロード実行後、ダウンロードしたファイルの実体を検証。
 * 拡張子から期待するタイプと実体が大きく違う場合は警告。
 *
 * PostToolUse として動作:
 *   - Bash で curl/wget を検知
 *   - -o/--output オプションで保存先を特定
 *   - magika で実体判定
 *   - 期待と乖離していれば additionalContext で警告
 */

const fs = require('fs');
const path = require('path');

let input;
try {
  input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
} catch {
  console.log(JSON.stringify({ continue: true }));
  process.exit(0);
}

const tool = input.tool_name;
if (tool !== 'Bash') {
  console.log(JSON.stringify({ continue: true }));
  process.exit(0);
}

const command = (input.tool_input || {}).command || '';

// curl/wget を使ったダウンロードのみ対象
if (!/\b(curl|wget)\b/.test(command)) {
  console.log(JSON.stringify({ continue: true }));
  process.exit(0);
}

// 出力先ファイルパス抽出
let outputPath = null;
const curlOutMatch = command.match(/curl[^&|;]*(?:-o|--output)\s+(\S+)/);
const curlOMatch = command.match(/curl[^&|;]*-O\s*$/); // -O は URL のファイル名で保存
const wgetOutMatch = command.match(/wget[^&|;]*(?:-O|--output-document)[=\s]+(\S+)/);

if (curlOutMatch) {
  outputPath = curlOutMatch[1].replace(/["']/g, '');
} else if (wgetOutMatch) {
  outputPath = wgetOutMatch[1].replace(/["']/g, '');
} else if (curlOMatch) {
  // -O の場合URLからファイル名推定（略）
}

if (!outputPath) {
  console.log(JSON.stringify({ continue: true }));
  process.exit(0);
}

// 絶対パス化
const fullPath = path.isAbsolute(outputPath)
  ? outputPath
  : path.join(process.cwd(), outputPath);

if (!fs.existsSync(fullPath)) {
  console.log(JSON.stringify({ continue: true }));
  process.exit(0);
}

// magika helper 呼び出し
let helper;
try {
  helper = require('./_magika-helper');
} catch {
  console.log(JSON.stringify({ continue: true }));
  process.exit(0);
}

const { detectFileType, expectedLabelFromExtension, isExecutable } = helper;

const detected = detectFileType(fullPath);
const expected = expectedLabelFromExtension(fullPath);

// 実行ファイル検知（ユーザーが明示的に .sh/.exe/.bin を指定していない限り警告）
if (isExecutable(detected.label) && !isExecutable(expected)) {
  console.log(JSON.stringify({
    continue: true,
    systemMessage: `⚠️ Download Post-Verify (MAGIKA-003): 実行可能ファイルのダウンロードを検知\n\n`
      + `  ファイル: ${fullPath}\n`
      + `  拡張子から期待: ${expected}\n`
      + `  実体: ${detected.label} (source: ${detected.source})\n\n`
      + `⚠️ 実行前に内容を確認することを強く推奨します（curl | bash パターン回避）。`,
  }));
  process.exit(0);
}

// 拡張子と実体の大きな乖離
const SAFE_MISMATCH = [
  ['zip', 'binary'], ['tar', 'binary'], ['gzip', 'binary'],
  ['pdf', 'binary'], ['image', 'binary'],
];
const isSafeMismatch = SAFE_MISMATCH.some(([x, y]) =>
  (expected === x && detected.label === y) || (expected === y && detected.label === x)
);

if (!isSafeMismatch && detected.label !== expected && detected.source !== 'extension') {
  console.log(JSON.stringify({
    continue: true,
    systemMessage: `📥 Download Post-Verify (MAGIKA-003): 拡張子と実体の不一致\n\n`
      + `  ファイル: ${fullPath}\n`
      + `  拡張子: ${expected}\n`
      + `  実体: ${detected.label}\n\n`
      + `ダウンロード元が期待通りのファイルを提供しているか確認してください。`,
  }));
  process.exit(0);
}

console.log(JSON.stringify({ continue: true }));
