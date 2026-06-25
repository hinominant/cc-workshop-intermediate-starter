#!/usr/bin/env node
'use strict';

/**
 * QA Assertion Check — PreToolUse Hook
 *
 * テストコードの品質をチェックする。
 * 空assertion（assert True, assert is not None等）を検出してブロック。
 *
 * テストが「実際にバグを捕まえるか」の最低限の品質保証。
 * ミューテーションテスト（Round 3）と合わせて二重防御。
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

// テストファイルのみ対象
const isTestFile = (filePath.includes('/tests/') || filePath.includes('/test_'))
  && (filePath.endsWith('.py') || filePath.endsWith('.js') || filePath.endsWith('.ts'));

if (!isTestFile) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const newString = (input.tool_input || {}).new_string || '';
const content = (input.tool_input || {}).content || '';
const text = newString || content;

if (!text) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const issues = [];

// Python: 空assertion検出
const PYTHON_EMPTY_ASSERTIONS = [
  { pattern: /\bassert\s+True\b/g, desc: 'assert True（常にPASS）' },
  { pattern: /\bassert\s+not\s+False\b/g, desc: 'assert not False（常にPASS）' },
  { pattern: /\bassert\s+\w+\s+is\s+not\s+None\b/g, desc: 'assert X is not None（ほぼ常にPASS）' },
  { pattern: /\bassert\s+len\(\w+\)\s*>=\s*0\b/g, desc: 'assert len(X) >= 0（常にPASS）' },
  { pattern: /\bassert\s+isinstance\(\w+,\s*object\)/g, desc: 'assert isinstance(X, object)（常にPASS）' },
];

// JavaScript/TypeScript: 空assertion検出
const JS_EMPTY_ASSERTIONS = [
  { pattern: /expect\(true\)\.toBe\(true\)/g, desc: 'expect(true).toBe(true)（常にPASS）' },
  { pattern: /expect\(\w+\)\.toBeDefined\(\)/g, desc: 'expect(X).toBeDefined()（ほぼ常にPASS）' },
  { pattern: /expect\(\w+\)\.not\.toBeNull\(\)/g, desc: 'expect(X).not.toBeNull()（ほぼ常にPASS）' },
  { pattern: /expect\(\w+\)\.toBeTruthy\(\)/g, desc: 'expect(X).toBeTruthy()（弱いassertion）' },
];

const patterns = filePath.endsWith('.py') ? PYTHON_EMPTY_ASSERTIONS : JS_EMPTY_ASSERTIONS;

for (const { pattern, desc } of patterns) {
  const matches = text.match(pattern);
  if (matches) {
    issues.push(`${desc} — ${matches.length}箇所`);
  }
}

// テスト関数内にassertが0個のチェック（Python）
if (filePath.endsWith('.py')) {
  const funcBlocks = text.split(/\ndef\s+test_/);
  for (let i = 1; i < funcBlocks.length; i++) {
    const block = funcBlocks[i];
    const funcName = 'test_' + (block.split(/[\s(]/)[0] || 'unknown');
    // 次の関数定義またはファイル末尾まで
    const funcBody = block.split(/\ndef\s+/)[0] || block;
    if (!/\bassert\b/.test(funcBody) && !/\.assert/.test(funcBody) && !/pytest\.raises/.test(funcBody)) {
      issues.push(`${funcName}: assert文がありません（テストとして機能していません）`);
    }
  }
}

// JavaScript/TypeScript: expect()がないテスト関数
if (filePath.endsWith('.js') || filePath.endsWith('.ts')) {
  const itBlocks = text.split(/\bit\s*\(/);
  for (let i = 1; i < itBlocks.length; i++) {
    const block = itBlocks[i];
    const testName = (block.match(/^['"`]([^'"`]+)/) || [])[1] || 'unknown';
    const body = block.split(/\bit\s*\(/)[0] || block;
    if (!/\bexpect\b/.test(body) && !/\bassert\b/.test(body)) {
      issues.push(`"${testName}": expect/assert文がありません`);
    }
  }
}

if (issues.length > 0) {
  console.log(JSON.stringify({
    decision: 'block',
    reason: `QA Assertion Check: テストコードに品質問題があります（${issues.length}件）。\n\n`
      + issues.map((i, idx) => `  ${idx + 1}. ${i}`).join('\n')
      + `\n\nテストは具体的な値・状態を検証してください。\n`
      + `空assertionはバグを1つも捕まえません。`,
  }));
  process.exit(0);
}

console.log(JSON.stringify({ decision: 'approve' }));
