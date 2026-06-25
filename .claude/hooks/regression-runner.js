#!/usr/bin/env node
'use strict';

/**
 * Regression Test Runner — ARIS-806 (GAP-001 S3)
 *
 * qa-round-gate.js が regression_all_pass: true を要求するが手書きできてしまう問題を解決。
 *
 * Round 3 進入時に自動実行:
 *   1. 全既存テスト実行（tests/ 配下すべて）
 *   2. 前回のテスト数と比較、テスト削除を検知
 *   3. 全PASS確認 → QA台帳に regression_all_pass: true を機械記入
 *   4. 1件でもFAILなら block
 *
 * Usage:
 *   node regression-runner.js --qa-file docs/qa/X_qa.md [--test-dir tests/]
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const args = process.argv.slice(2);
function getArg(name) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : null;
}

const qaFile = getArg('qa-file');
const testDir = getArg('test-dir') || 'tests/';

if (!qaFile) {
  console.error('Usage: regression-runner.js --qa-file <path> [--test-dir tests/]');
  process.exit(1);
}

console.log(`Regression Runner (ARIS-806)`);
console.log(`  テストディレクトリ: ${testDir}`);

// --- テスト実行 ---
console.log(`\npytest 全件実行中...`);
const testStart = Date.now();
const result = spawnSync('python3', ['-m', 'pytest', testDir, '-v', '--tb=short'], {
  encoding: 'utf8', timeout: 600000,
});
const duration = ((Date.now() - testStart) / 1000).toFixed(1);

if (result.status === null) {
  console.error(`テスト実行失敗: タイムアウト or 起動失敗`);
  process.exit(1);
}

// --- 結果パース ---
const output = result.stdout + result.stderr;
const summaryMatch = output.match(/(\d+)\s+passed/);
const failedMatch = output.match(/(\d+)\s+failed/);
const errorMatch = output.match(/(\d+)\s+error/);
const skippedMatch = output.match(/(\d+)\s+skipped/);

const passed = summaryMatch ? parseInt(summaryMatch[1], 10) : 0;
const failed = failedMatch ? parseInt(failedMatch[1], 10) : 0;
const errors = errorMatch ? parseInt(errorMatch[1], 10) : 0;
const skipped = skippedMatch ? parseInt(skippedMatch[1], 10) : 0;
const total = passed + failed + errors + skipped;

console.log(`\n結果:`);
console.log(`  Total: ${total}`);
console.log(`  ✅ Passed: ${passed}`);
console.log(`  ❌ Failed: ${failed}`);
console.log(`  💥 Errors: ${errors}`);
console.log(`  ⏭️  Skipped: ${skipped}`);
console.log(`  Duration: ${duration}s`);

// --- 前回テスト数と比較（テスト削除検知）---
const contextDir = path.join(path.dirname(qaFile), '..', '..', '.context');
const prevPath = path.join(contextDir, 'regression-prev-count');
let prevTotal = 0;
try {
  prevTotal = parseInt(fs.readFileSync(prevPath, 'utf8').trim(), 10);
} catch {}

const testDecrease = prevTotal > 0 && total < prevTotal;
if (testDecrease) {
  console.error(`\n⚠️  テスト数減少検知: ${prevTotal} → ${total}（${prevTotal - total}件減少）`);
  console.error(`テスト削除によるリグレッション回避の可能性`);
}

// 今回の数を保存
try {
  fs.mkdirSync(contextDir, { recursive: true });
  fs.writeFileSync(prevPath, String(total));
} catch {}

// --- QA台帳更新 ---
const allPass = failed === 0 && errors === 0;
const skipIsFail = skipped > 0; // SKIP = FAIL原則（TEST_POLICY.md）

try {
  let qaContent = fs.readFileSync(qaFile, 'utf8');

  // regression_all_pass 更新
  const passValue = (allPass && !skipIsFail && !testDecrease);
  if (/regression_all_pass:\s*(true|false)/.test(qaContent)) {
    qaContent = qaContent.replace(/regression_all_pass:\s*(true|false)/, `regression_all_pass: ${passValue}`);
  } else {
    qaContent += `\n- regression_all_pass: ${passValue}\n`;
  }

  // regression_total_tests 記録
  const regressionStats = `- regression_total_tests: ${total} (前回: ${prevTotal || 'N/A'})`;
  if (/regression_total_tests:.*/.test(qaContent)) {
    qaContent = qaContent.replace(/regression_total_tests:.*/, regressionStats.replace('- ', ''));
  }

  fs.writeFileSync(qaFile, qaContent);
  console.log(`\nQA台帳更新: regression_all_pass: ${passValue}`);
} catch (e) {
  console.error(`QA台帳更新失敗: ${e.message}`);
  process.exit(1);
}

// --- 結果判定 ---
if (!allPass) {
  console.error(`\n❌ リグレッション検出: FAIL=${failed}, ERROR=${errors}`);
  process.exit(2);
}
if (skipIsFail) {
  console.error(`\n❌ SKIP=${skipped}件（SKIP=FAIL原則違反）`);
  process.exit(3);
}
if (testDecrease) {
  console.error(`\n❌ テスト数減少（${prevTotal}→${total}）`);
  process.exit(4);
}

console.log(`\n✅ リグレッションテスト全PASS (${passed}/${total})`);
process.exit(0);
