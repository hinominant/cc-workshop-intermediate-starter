#!/usr/bin/env node
'use strict';

/**
 * QA Item Lock — PreToolUse Hook
 *
 * テスト項目(Test Items)の改ざんを防止する。
 * テスト項目列挙セッション以外からのTest Itemsセクション編集をブロック。
 *
 * 原則: テスト項目の「出題者」と「回答者（実装者）」を分離する。
 * 実装者がテスト項目を甘い方向に書き換えることを物理的に防ぐ。
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
if (!filePath.includes('docs/qa/') || !filePath.endsWith('_qa.md')) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 変更内容にTest Itemsセクションの変更が含まれるか
const newString = (input.tool_input || {}).new_string || '';
const content = (input.tool_input || {}).content || '';
const text = newString || content;

// TI-NNN行の変更を検出（Test Items本体の変更）
const isTiChange = /### TI-\d+/.test(text)
  || /- test_file:/.test(text)
  || /- category:/.test(text)
  || /- derived_from:/.test(text)
  || /- catalog_ref:/.test(text);

if (!isTiChange) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// QA台帳のstatus確認
let qaContent = '';
try {
  qaContent = fs.readFileSync(filePath, 'utf8');
} catch {
  // ファイルがまだない場合は通過（初回作成）
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const statusMatch = qaContent.match(/^- status:\s*(\S+)/m);
const status = statusMatch ? statusMatch[1] : 'team-composition';

// team-composition中は自由に編集可能
if (status === 'team-composition') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// planning以降は qa-item-author セッションのみ編集可能
const authorFile = path.join(process.cwd(), '.context', 'qa-item-author');
let authorSessionId = '';
try {
  authorSessionId = fs.readFileSync(authorFile, 'utf8').trim();
} catch {
  // authorファイルがない = 誰もauthorizeされていない
}

// セッションID取得: 環境変数 → .context/session-id ファイル → プロセスPID
const currentSessionId = process.env.CLAUDE_SESSION_ID
  || process.env.ARIS_SESSION_ID
  || (() => {
    try {
      return fs.readFileSync(path.join(process.cwd(), '.context', 'session-id'), 'utf8').trim();
    } catch { return ''; }
  })();

if (!authorSessionId) {
  console.log(JSON.stringify({
    decision: 'block',
    reason: 'QA Item Lock: テスト項目の編集権限がありません。\n\n'
      + '.context/qa-item-author が存在しません。\n'
      + 'テスト項目は別セッション（magi合議）で列挙してください。\n\n'
      + '手順:\n'
      + '1. 別ターミナル/Arenaで magi を起動\n'
      + '2. テスト項目列挙を実行\n'
      + '3. .context/qa-item-author にセッションIDが記録される',
  }));
  process.exit(0);
}

// セッションID検証:
// A) 両方のIDがある → 一致チェック
// B) 現在のIDが空 → authorファイルのハッシュで代替検証
if (currentSessionId && currentSessionId === authorSessionId) {
  // 同一セッション = テスト項目作成者 → 通過
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

if (currentSessionId && currentSessionId !== authorSessionId) {
  // 異なるセッション = 実装者 → ブロック
  console.log(JSON.stringify({
    decision: 'block',
    reason: 'QA Item Lock: テスト項目の編集権限がありません。\n\n'
      + `現在のセッション: ${currentSessionId}\n`
      + `テスト項目作成セッション: ${authorSessionId}\n\n`
      + '実装者はテスト項目を変更できません。\n'
      + '原則: 出題者と回答者の分離。',
  }));
  process.exit(0);
}

// 両方のIDが空の場合（セッション識別が設定されていない環境）
// → .context/qa-item-author のタイムスタンプで代替検証
// authorファイルが1分以内に作成されていれば同一セッションとみなす
try {
  const authorStat = fs.statSync(path.join(process.cwd(), '.context', 'qa-item-author'));
  const ageMs = Date.now() - authorStat.mtimeMs;
  if (ageMs > 60000) {
    // authorファイルが古い = 別セッションが作成した可能性が高い → ブロック
    console.log(JSON.stringify({
      decision: 'block',
      reason: 'QA Item Lock: テスト項目の編集権限がありません。\n\n'
        + 'セッションIDが設定されていないため、タイムスタンプで検証しています。\n'
        + '.context/qa-item-author が古いため、別セッションで作成されたテスト項目と判定しました。\n\n'
        + '対策: 環境変数 CLAUDE_SESSION_ID を設定するか、\n'
        + 'テスト項目列挙セッションから直接編集してください。',
    }));
    process.exit(0);
  }
} catch {
  // statに失敗 → ブロック（安全側に倒す）
  console.log(JSON.stringify({
    decision: 'block',
    reason: 'QA Item Lock: テスト項目の編集権限を検証できません。',
  }));
  process.exit(0);
}

console.log(JSON.stringify({ decision: 'approve' }));
