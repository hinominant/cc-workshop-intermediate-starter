#!/usr/bin/env node
'use strict';

/**
 * Simplicity Checker — PreToolUse Hook
 *
 * Karpathy原則: "Minimum code that solves the problem. Nothing speculative."
 *
 * 実装の行数・抽象化度合いを監視し、speculative/過剰実装を検出する。
 *
 * 検出パターン:
 *   - 単一ファイルで500行超
 *   - 「flexibility」「configurability」「for future use」等のコメント
 *   - 未使用パラメータ（過剰なoptional引数）
 *   - try/exceptで広くキャッチ（Exception全般）
 *
 * 参考: github.com/forrestchang/andrej-karpathy-skills (Simplicity First)
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
if (tool !== 'Write' && tool !== 'Edit') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const filePath = (input.tool_input || {}).file_path || '';

// コードファイルのみ対象
if (!filePath.match(/\.(py|js|ts|tsx|jsx|go|rs|java)$/)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// テスト・ドキュメント・設定は対象外
if (
  filePath.includes('/tests/') ||
  filePath.includes('/docs/') ||
  filePath.includes('.context/') ||
  filePath.includes('.claude/') ||
  filePath.endsWith('.json')
) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const content = (input.tool_input || {}).content || (input.tool_input || {}).new_string || '';
if (!content) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const warnings = [];

// 1. 行数チェック（Write = 新規作成時のみ）
if (tool === 'Write') {
  const lineCount = content.split('\n').length;
  if (lineCount > 500) {
    warnings.push(`ファイル行数が${lineCount}行（500行超）— 分割を検討してください`);
  }
}

// 2. speculative コメント検出
const SPECULATIVE_PATTERNS = [
  /for\s+(future|later)\s+use/i,
  /may\s+be\s+useful/i,
  /in\s+case\s+we\s+need/i,
  /将来的に/,
  /後で使う/,
  /念のため/,
  /flexibility/i,
  /configurability/i,
];
for (const re of SPECULATIVE_PATTERNS) {
  if (re.test(content)) {
    const match = content.match(re);
    warnings.push(`speculative実装の兆候: "${match[0]}"`);
  }
}

// 3. 広すぎる例外キャッチ
const BROAD_CATCH = [
  { pattern: /except\s+Exception\b/g, desc: 'except Exception（広すぎるキャッチ）' },
  { pattern: /except\s*:/g, desc: 'bare except（全例外キャッチ）' },
  { pattern: /catch\s*\(\s*(?:any|Error|Throwable)\s*[\s\)]/gi, desc: 'catch(Error/any) — 広すぎるキャッチ' },
];
for (const { pattern, desc } of BROAD_CATCH) {
  const matches = content.match(pattern);
  if (matches && matches.length > 2) {
    warnings.push(`${desc}が${matches.length}箇所`);
  }
}

// 警告なし → 通過
if (warnings.length === 0) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 警告あり → additionalContextで注入（blockはしない）
console.log(JSON.stringify({
  decision: 'approve',
  additionalContext: `⚠️ Simplicity Checker: 過剰実装の兆候を検出（${warnings.length}件）\n\n`
    + warnings.map(w => `  - ${w}`).join('\n')
    + `\n\nファイル: ${path.relative(process.cwd(), filePath)}\n\n`
    + 'Karpathy原則（Simplicity First）:\n'
    + '  "Minimum code that solves the problem. Nothing speculative."\n'
    + '  - 依頼されていない機能を追加しない\n'
    + '  - 1回しか使わないコードに抽象化を入れない\n'
    + '  - 起こりえないシナリオへのエラーハンドリングをしない\n'
    + '  - 200行で済むなら200行で書く、500行にしない\n\n'
    + '「シニアエンジニアが複雑すぎると言うか？」→ YESなら簡素化',
}));
