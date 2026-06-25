#!/usr/bin/env node
'use strict';

/**
 * QA Result Writer — テストランナー出力→QA台帳パーサー
 *
 * PASS/FAILの唯一の書き込み権限を持つ。
 * pytest --json-report / jest --json の出力をパースし、
 * QA台帳のResult列・Evidence列を自動更新する。
 *
 * Usage:
 *   node qa-result-writer.js --qa-file docs/qa/ARIS-XXX_qa.md --report .context/test-report.json --round 1
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// --- 引数パース ---
const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : null;
}

const qaFile = getArg('qa-file');
const reportFile = getArg('report');
const round = parseInt(getArg('round') || '0', 10);

if (!qaFile || !reportFile || !round) {
  console.error('Usage: node qa-result-writer.js --qa-file <path> --report <path> --round <1|2|3>');
  process.exit(1);
}

if (round < 1 || round > 3) {
  console.error('Error: --round must be 1, 2, or 3');
  process.exit(1);
}

// --- ファイル読み込み ---
let qaContent, reportContent, reportJson;
try {
  qaContent = fs.readFileSync(qaFile, 'utf8');
} catch (e) {
  console.error(`Error: QA台帳が読めません: ${qaFile}`);
  process.exit(1);
}

try {
  reportContent = fs.readFileSync(reportFile, 'utf8');
  reportJson = JSON.parse(reportContent);
} catch (e) {
  console.error(`Error: テストレポートが読めません: ${reportFile}`);
  process.exit(1);
}

// --- レポートのタイムスタンプ検証（5分以内） ---
const reportTimestamp = reportJson.created || reportJson.timestamp || reportJson.startTimestamp;
if (reportTimestamp) {
  const reportTime = new Date(typeof reportTimestamp === 'number' ? reportTimestamp * 1000 : reportTimestamp).getTime();
  const age = Date.now() - reportTime;
  if (age > 5 * 60 * 1000) {
    console.error(`Error: テストレポートが古すぎます（${Math.round(age / 60000)}分前）。再実行してください。`);
    process.exit(1);
  }
}

// --- レポートハッシュ ---
const reportHash = crypto.createHash('sha256').update(reportContent).digest('hex').slice(0, 12);

// --- テスト結果マップ構築 ---
// pytest-json-report形式: { tests: [{ nodeid: "tests/test_foo.py::test_bar", outcome: "passed"|"failed", ... }] }
// jest形式: { testResults: [{ testFilePath: "...", testResults: [{ fullName: "...", status: "passed"|"failed" }] }] }

const resultMap = new Map(); // test_file → { result: 'PASS'|'FAIL', detail: string, duration: string }

if (reportJson.tests) {
  // pytest-json-report format
  for (const test of reportJson.tests) {
    const nodeid = test.nodeid || '';
    const outcome = (test.outcome || '').toLowerCase();
    const result = outcome === 'passed' ? 'PASS' : 'FAIL';
    const duration = test.call ? `${test.call.duration.toFixed(3)}s` : '-';
    const detail = test.call && test.call.longrepr
      ? test.call.longrepr.split('\n').slice(-2).join(' ').slice(0, 100)
      : outcome;
    resultMap.set(nodeid, { result, detail, duration });
  }
} else if (reportJson.testResults) {
  // jest format
  for (const suite of reportJson.testResults) {
    for (const test of (suite.testResults || [])) {
      const fullName = test.fullName || test.title || '';
      const status = (test.status || '').toLowerCase();
      const result = status === 'passed' ? 'PASS' : 'FAIL';
      const duration = test.duration ? `${(test.duration / 1000).toFixed(3)}s` : '-';
      const detail = test.failureMessages ? test.failureMessages[0]?.slice(0, 100) || status : status;
      resultMap.set(`${suite.testFilePath}::${fullName}`, { result, detail, duration });
    }
  }
}

if (resultMap.size === 0) {
  console.error('Error: テスト結果が0件です。レポートの形式を確認してください。');
  process.exit(1);
}

// --- QA台帳の更新 ---
const roundTag = `R${round}`;
let updatedCount = 0;
let passCount = 0;
let failCount = 0;

// GAP-001 S1修正: TI項目単位で置換する（全TIに同じ結果が上書きされる問題の修正）
// 方法: 各TIブロックを個別に取り出して、そのブロック内のR{n}行だけ置換し、戻す
function splitByHeadings(source, pattern) {
  const matches = [...source.matchAll(pattern)];
  const segments = [];
  if (matches.length === 0) return [{ header: '', body: source }];
  if (matches[0].index > 0) segments.push({ header: '', body: source.slice(0, matches[0].index) });
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : source.length;
    segments.push({ header: matches[i][0], body: source.slice(start, end) });
  }
  return segments;
}

// Test Items内のTI-NNNブロックをパースして、各TIごとに結果を埋める
const tiSplitPattern = /^### TI-\d+[^\n]*/gm;
const segments = splitByHeadings(qaContent, tiSplitPattern);

const updatedSegments = segments.map(seg => {
  // TIブロックでないセグメントはそのまま
  if (!/^### TI-\d+/.test(seg.body)) return seg;

  const testFileMatch = seg.body.match(/^- test_file:\s*(.+)/m);
  if (!testFileMatch) return seg;
  const testFile = testFileMatch[1].trim();

  // resultMapから結果を検索
  let testResult = resultMap.get(testFile);
  if (!testResult) {
    for (const [key, val] of resultMap) {
      if (key === testFile || key.includes(testFile) || testFile.includes(key)) {
        testResult = val;
        break;
      }
    }
  }

  if (!testResult) return seg;

  // このTIブロック内の R{n} 行のみ置換（Round Summaryには影響しない = TIブロック内だから安全）
  const evidence = `sha256:${reportHash} | ${testFile}: ${testResult.detail} [${testResult.duration}]`;
  const roundRowPattern = new RegExp(
    `(\\| ${roundTag} \\|[^|]*\\|[^|]*\\|)\\s*-\\s*\\|\\s*-\\s*\\|`,
    'g'
  );
  seg.body = seg.body.replace(roundRowPattern, (m, prefix) => {
    return `${prefix} ${testResult.result} | ${evidence} |`;
  });

  updatedCount++;
  if (testResult.result === 'PASS') passCount++;
  else failCount++;

  return seg;
});

let updatedQa = updatedSegments.map(s => s.body).join('');

// --- Round Summary更新 ---
// GAP-001 S1修正: Round Depth Requirements の ### Round N Requirements を誤って置換しないよう、
// 正確に "## Round Summary" セクション内のみを対象にする
const summarySection = `### Round ${round}
- date: ${new Date().toISOString().split('T')[0]}
- test_report_hash: sha256:${reportHash}
- total: ${updatedCount} items
- pass: ${passCount}
- fail: ${failCount}`;

// Round Summary セクションの範囲を特定
const summaryHeaderIdx = updatedQa.search(/^## Round Summary\b/m);
if (summaryHeaderIdx >= 0) {
  // Round Summary セクションの終端を次の "## " で特定
  const afterHeader = updatedQa.slice(summaryHeaderIdx);
  const nextH2Match = afterHeader.slice(1).search(/^## \S/m);
  const endIdx = nextH2Match >= 0 ? summaryHeaderIdx + 1 + nextH2Match : updatedQa.length;
  const summaryBody = updatedQa.slice(summaryHeaderIdx, endIdx);

  let newSummaryBody;
  // このSummary内に ### Round {round} があれば置換、なければ追加
  if (new RegExp(`^### Round ${round}\\b`, 'm').test(summaryBody)) {
    // 既存のRound N を（次の ### Round または セクション末尾まで）置換
    const beforeRoundIdx = summaryBody.search(new RegExp(`^### Round ${round}\\b`, 'm'));
    const fromRound = summaryBody.slice(beforeRoundIdx);
    const nextRoundMatch = fromRound.slice(1).search(/^### Round \d/m);
    const roundEndInSummary = nextRoundMatch >= 0 ? beforeRoundIdx + 1 + nextRoundMatch : summaryBody.length;
    newSummaryBody = summaryBody.slice(0, beforeRoundIdx) + summarySection + '\n\n' + summaryBody.slice(roundEndInSummary);
  } else {
    // Round {round} セクションがなければ末尾に追加
    newSummaryBody = summaryBody.replace(/\s*$/, '') + '\n\n' + summarySection + '\n\n';
  }
  updatedQa = updatedQa.slice(0, summaryHeaderIdx) + newSummaryBody + updatedQa.slice(endIdx);
}

// --- ワンタイムトークン生成 ---
const contextDir = path.join(process.cwd(), '.context');
try { fs.mkdirSync(contextDir, { recursive: true }); } catch {}

const token = {
  created_at: Date.now(),
  valid: true,
  round,
  report_hash: reportHash,
};
fs.writeFileSync(
  path.join(contextDir, 'qa-result-writer-token'),
  JSON.stringify(token, null, 2)
);

// --- QA台帳書き込み ---
fs.writeFileSync(qaFile, updatedQa, 'utf8');

console.log(`QA Result Writer: Round ${round} 完了`);
console.log(`  更新: ${updatedCount}項目 (PASS: ${passCount}, FAIL: ${failCount})`);
console.log(`  レポートハッシュ: sha256:${reportHash}`);
console.log(`  トークン生成: .context/qa-result-writer-token (5分有効)`);
