#!/usr/bin/env node
'use strict';

/**
 * Feature Gate — PreToolUse Hook (ARIS-153)
 *
 * Featureラベルのチケットで実装コードを変更する場合、
 * 対応する要求定義書（docs/specs/）が存在することを確認する。
 *
 * 目的: 「要求定義→設計→実装」のフローを仕組みで強制する。
 * 要求定義書なしの機能実装は対処療法と同じ。
 *
 * 設計方針:
 * - current_ticket.json のlabelsに"Feature"が含まれる場合のみ発火
 * - docs/specs/ に対応する要求定義書が存在するかチェック
 * - 読み取り系・.context/・テスト・ドキュメントは通過
 * - API呼び出し不要（ローカルファイルのみ確認）
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

// 対象ファイル確認
const filePath = (input.tool_input || {}).file_path || '';
const command = (input.tool_input || {}).command || '';

// ドキュメント・テスト・設定は通過
if (
  filePath.includes('.context/') ||
  filePath.includes('/tests/') ||
  filePath.includes('test_') ||
  filePath.includes('/docs/') ||
  filePath.endsWith('.md') ||
  filePath.endsWith('.json') ||
  filePath.endsWith('.jsonl') ||
  filePath.includes('.claude/')
) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// Bashのgit/コマンドは通過
if (tool === 'Bash') {
  if (/^(git |ls |cd |pwd|cat |source |set |echo |grep |find )/.test(command)) {
    console.log(JSON.stringify({ decision: 'approve' }));
    process.exit(0);
  }
}

// current_ticket.json確認
const ticketFile = path.join(process.cwd(), '.context', 'current_ticket.json');
let ticket;
try {
  ticket = JSON.parse(fs.readFileSync(ticketFile, 'utf8'));
} catch {
  // チケットファイルなし → ogsm-gateの責務
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// ラベルホワイトリスト（許可されたラベルのみ）
const ALLOWED_LABELS = ['epic', 'feature', 'bug', 'bugfix', 'fix', 'improvement', 'owner:aris', 'owner:keiji',
  'sys:infra', 'sys:sns', 'sys:macro', 'sys:crew', 'sys:secretary', 'sys:nova', 'sys:lros', 'sys:aris', 'biz'];
const labels = ticket.labels || [];

// ラベルなしチェック
if (labels.length === 0 && filePath.includes('/src/') && tool !== 'Read') {
  console.log(JSON.stringify({
    decision: 'ask_user',
    message: `⚠️ Feature Gate: チケットにラベルが設定されていません。\n\n`
      + `Epic/Feature/Bug のいずれかのラベルを設定してください。\n`
      + `ラベルなしでの作業は禁止です。`,
  }));
  process.exit(0);
}

// Feature/Epicラベルチェック（両方とも要求定義書が必須）
const requiresSpec = labels.some(l =>
  typeof l === 'string' && ['feature', 'epic'].includes(l.toLowerCase())
);

// Bugfixラベルで新規ファイル作成 → ラベルすり替え検知
if (!requiresSpec && tool === 'Write') {
  // Writeツール = 新規ファイル作成の可能性
  const isBugfix = labels.some(l =>
    typeof l === 'string' && ['bug', 'bugfix', 'fix'].includes(l.toLowerCase())
  );
  if (isBugfix && filePath.includes('/src/')) {
    console.log(JSON.stringify({
      decision: 'ask_user',
      message: `⚠️ Feature Gate: Bugfixラベルですが新規ファイルを作成しています。\n\n`
        + `ファイル: ${filePath}\n\n`
        + `Bugfix = 既存機能の修正のみ。新しいファイル作成はFeatureです。\n`
        + `ラベルが正しいか確認してください。`,
    }));
    process.exit(0);
  }
}

if (!requiresSpec) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// src/ 内のコード変更のみ対象
if (!filePath.includes('/src/') && tool !== 'Bash') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 要求定義書の存在確認
const ticketId = (ticket.ticket || ticket.identifier || '').toLowerCase();
const specsDir = path.join(process.cwd(), 'docs', 'specs');

let hasSpec = false;
try {
  const specFiles = fs.readdirSync(specsDir);
  hasSpec = specFiles.some(f =>
    f.toLowerCase().includes(ticketId.replace('aris-', ''))
  );
} catch {
  // docs/specs/ ディレクトリなし
}

if (!hasSpec) {
  console.log(JSON.stringify({
    decision: 'ask_user',
    message: `📋 Feature Gate: ${ticket.ticket} はFeatureラベルですが、要求定義書が見つかりません。\n\n`
      + `docs/specs/ に要求定義書を作成してから実装に入ってください。\n`
      + `要求定義 → 設計 → 実装の順序を守ることで、対処療法を防ぎます。`,
  }));
  process.exit(0);
}

console.log(JSON.stringify({ decision: 'approve' }));
