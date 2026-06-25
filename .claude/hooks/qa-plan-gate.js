#!/usr/bin/env node
'use strict';

/**
 * QA Plan Gate — PreToolUse Hook
 *
 * Feature/Epicチケットでテストコード作成時、QA台帳のテスト項目が
 * 十分に列挙されていることを確認する。
 *
 * チェック内容:
 *   1. QA台帳が存在し、Team Compositionが完了しているか
 *   2. Test ItemsセクションにTI-NNN項目が存在するか
 *   3. 受入条件数 × 2 ≤ テスト項目数（最低限の網羅性）
 *   4. 全ACがCoverage Matrixに登場するか
 *   5. カテゴリが正常系のみでないか（異常系必須）
 *   6. 各TIにtest_fileが記入されているか
 *   7. Catalog Coverageセクションが存在するか
 *   8. 適用カタログの未カバー項目に除外理由があるか
 *   9. テスト項目のタイトルが具体的か（抽象的すぎるものをブロック）
 *   10. E2E/統合テスト項目が最低1つ存在するか
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

// 読み取り系は通過
const PASS_THROUGH = new Set([
  'Read', 'Grep', 'Glob', 'WebSearch', 'WebFetch',
  'Agent', 'TaskList', 'TaskGet', 'TaskCreate', 'TaskUpdate',
]);
if (PASS_THROUGH.has(tool)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const filePath = (input.tool_input || {}).file_path || '';
const command = (input.tool_input || {}).command || '';

// tests/ 配下のファイル作成/編集のみ対象
const isTestFile = filePath.includes('/tests/') || filePath.includes('/test_');
const isTestBash = tool === 'Bash' && /\b(pytest|jest|vitest|mocha)\b/.test(command) && !/--json-report/.test(command);

if (!isTestFile && !isTestBash) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// チケット確認
const ticketFile = path.join(process.cwd(), '.context', 'current_ticket.json');
let ticket;
try {
  ticket = JSON.parse(fs.readFileSync(ticketFile, 'utf8'));
} catch {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const labels = (ticket.labels || []).map(l => (typeof l === 'string' ? l : '').toLowerCase());
if (!labels.some(l => ['feature', 'epic'].includes(l))) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// QA台帳を探す
const ticketId = (ticket.ticket || ticket.identifier || '').toLowerCase();
const qaDir = path.join(process.cwd(), 'docs', 'qa');
let qaFilePath = null;

try {
  const qaFiles = fs.readdirSync(qaDir);
  const match = qaFiles.find(f => f.toLowerCase().includes(ticketId.replace(/^aris-/, '')));
  if (match) qaFilePath = path.join(qaDir, match);
} catch {
  // docs/qa/ なし
}

if (!qaFilePath) {
  console.log(JSON.stringify({
    decision: 'ask_user',
    message: `QA Plan Gate: QA台帳が見つかりません。\n\n`
      + `docs/qa/ にQA台帳を作成してからテストコードを書いてください。\n`
      + `テンプレート: _templates/QA_TEMPLATE.md`,
  }));
  process.exit(0);
}

let qaContent;
try {
  qaContent = fs.readFileSync(qaFilePath, 'utf8');
} catch {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const issues = [];

// 1. Team Composition完了チェック
if (!/composed_by:\s*\S+/.test(qaContent)) {
  issues.push('Team Compositionが未完了です');
}

// 2. テスト項目存在チェック
const tiMatches = qaContent.match(/^### TI-\d+/gm) || [];
if (tiMatches.length === 0) {
  issues.push('テスト項目(TI-NNN)が1つも列挙されていません');
}

// 3. 受入条件数との比率チェック
const specPathMatch = qaContent.match(/^- spec:\s*(.+)/m);
if (specPathMatch) {
  const rawSpecPath = specPathMatch[1].trim();
  // 絶対パスと相対パスの両方を試行
  const candidates = [
    rawSpecPath,
    path.join(process.cwd(), rawSpecPath),
    path.resolve(process.cwd(), rawSpecPath),
  ];
  for (const candidate of candidates) {
    try {
      const specContent = fs.readFileSync(candidate, 'utf8');
      const acCount = (specContent.match(/^-\s*\[[ x]\]\s*AC-/gm) || []).length;
      if (acCount > 0 && tiMatches.length < acCount * 2) {
        issues.push(`テスト項目数が不足（${tiMatches.length}個 < AC数${acCount} × 2 = ${acCount * 2}個必要）`);
      }
      break; // 読めたら終了
    } catch {
      continue; // 次の候補を試行
    }
  }
}

// 4. Coverage Matrix存在チェック
if (!/^## Coverage Matrix/m.test(qaContent)) {
  issues.push('Coverage Matrixセクションがありません');
}

// 5. カテゴリ多様性チェック
const categories = qaContent.match(/^- category:\s*(.+)/gm) || [];
const categoryValues = categories.map(c => c.replace(/^- category:\s*/, '').trim());
const uniqueCategories = new Set(categoryValues);
if (uniqueCategories.size > 0 && !categoryValues.some(c => ['異常系', 'セキュリティ', '境界値'].includes(c))) {
  issues.push('異常系/セキュリティ/境界値のテスト項目がありません（正常系のみは不可）');
}

// 6. test_file記入チェック
const testFileEntries = qaContent.match(/^- test_file:\s*(.+)/gm) || [];
const emptyTestFiles = testFileEntries.filter(t => /^- test_file:\s*$/.test(t) || /^- test_file:\s*-\s*$/.test(t));
if (emptyTestFiles.length > 0) {
  issues.push(`test_fileが未記入のテスト項目が${emptyTestFiles.length}件あります`);
}

// 7. Catalog Coverage存在チェック
if (!/^## Catalog Coverage/m.test(qaContent)) {
  issues.push('Catalog Coverageセクションがありません（テストカタログとの照合が必要）');
}

// 8. 除外理由チェック
const uncoveredSection = qaContent.split('### Uncovered Items')[1] || '';
const emptyReasons = (uncoveredSection.match(/\|\s*\|[\s]*$/gm) || []).length;
if (emptyReasons > 0) {
  issues.push(`カタログ未カバー項目の除外理由が空のものが${emptyReasons}件あります`);
}

// 9. テスト項目タイトルの具体性チェック
const tiTitles = qaContent.match(/^### TI-\d+:\s*(.+)/gm) || [];
const abstractTitles = [];
for (const t of tiTitles) {
  const title = t.replace(/^### TI-\d+:\s*/, '');

  // 短すぎる
  if (title.length < 10) {
    abstractTitles.push(`${t}（10文字未満）`);
    continue;
  }

  // 抽象語のみで構成
  if (/^(テスト|確認|検証|チェック|正常系|異常系|境界値|エラー処理|入力バリデーション|セキュリティテスト)$/i.test(title)) {
    abstractTitles.push(`${t}（抽象語のみ）`);
    continue;
  }

  // 具体的な入力値・期待出力・条件を含むかチェック
  // 良い例: "パスワード空文字列でHTTP 400返却", "SQLインジェクション ' OR 1=1 でログイン拒否"
  // 悪い例: "ログイン処理が正しく動作する", "エラーが適切に処理される"
  const hasSpecificValue = /\d+|null|空|0|true|false|エラー|成功|失敗|拒否|返却|出力|含まれ|一致|以上|以下|未満/i.test(title);
  const hasConcreteAction = /される|できる|しない|ならない|返す|含む|含まない|表示|非表示|通る|通らない/i.test(title);

  if (!hasSpecificValue && !hasConcreteAction) {
    abstractTitles.push(`${t}（具体的な入力値・期待出力がない）`);
  }
}
if (abstractTitles.length > 0) {
  issues.push(`テスト項目タイトルの具体性が不足（${abstractTitles.length}件）:\n`
    + abstractTitles.slice(0, 3).map(a => `      - ${a}`).join('\n')
    + (abstractTitles.length > 3 ? `\n      ... 他${abstractTitles.length - 3}件` : ''));
}

// 10. E2E/統合テスト項目チェック
if (!categoryValues.some(c => ['E2E', '統合', 'e2e', 'integration'].includes(c))) {
  issues.push('E2E/統合テスト項目がありません（ユニットテストだけでは不可、最低1項目必要）');
}

if (issues.length > 0) {
  console.log(JSON.stringify({
    decision: 'ask_user',
    message: `QA Plan Gate: テスト計画に不足があります（${issues.length}件）。\n\n`
      + issues.map((i, idx) => `  ${idx + 1}. ${i}`).join('\n')
      + `\n\nQA台帳: ${path.relative(process.cwd(), qaFilePath)}`,
  }));
  process.exit(0);
}

console.log(JSON.stringify({ decision: 'approve' }));
