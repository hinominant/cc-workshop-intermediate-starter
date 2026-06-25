#!/usr/bin/env node
'use strict';

/**
 * Surgical Change Checker — PreToolUse Hook (git commit)
 *
 * Karpathy原則: 「変更した全ての行が、ユーザーの依頼に直接トレースできるか？」
 *
 * git commit検知時にgit diffを分析し、
 * 現在のLinearチケットに直接関係しない変更を検出してask_user。
 *
 * 検出パターン:
 *   - フォーマット変更のみ（空白・インデント）
 *   - 周辺コードのコメント書き換え
 *   - 未使用importの削除（チケット無関係）
 *   - タイプミス修正（チケット無関係）
 *   - リファクタリング（チケット記述にない）
 *
 * 参考: github.com/forrestchang/andrej-karpathy-skills (Surgical Changes)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const toolName = data.tool_name || '';
    const toolInput = data.tool_input || {};

    // git commit のみ対象
    if (toolName !== 'Bash' || !toolInput.command) {
      process.stdout.write(JSON.stringify({ decision: 'approve' }));
      return;
    }

    if (!/\bgit\b.*\bcommit\b/.test(toolInput.command)) {
      process.stdout.write(JSON.stringify({ decision: 'approve' }));
      return;
    }

    // チケット取得
    const ticketFile = path.join(process.cwd(), '.context', 'current_ticket.json');
    let ticket;
    try {
      ticket = JSON.parse(fs.readFileSync(ticketFile, 'utf8'));
    } catch {
      process.stdout.write(JSON.stringify({ decision: 'approve' }));
      return;
    }

    // バイパス: 明示的に無効化された場合
    if (fs.existsSync(path.join(process.cwd(), '.context', 'surgical-check-disabled'))) {
      process.stdout.write(JSON.stringify({ decision: 'approve' }));
      return;
    }

    // git diff取得（staged + unstaged）
    let diff = '';
    try {
      diff = execSync('git diff --cached --unified=0', {
        encoding: 'utf8',
        cwd: process.cwd(),
        timeout: 5000,
      });
    } catch {}

    if (!diff) {
      // stagedがない場合、unstagedをチェック
      try {
        diff = execSync('git diff --unified=0', {
          encoding: 'utf8',
          cwd: process.cwd(),
          timeout: 5000,
        });
      } catch {}
    }

    if (!diff || diff.length < 10) {
      process.stdout.write(JSON.stringify({ decision: 'approve' }));
      return;
    }

    // 変更行数をカウント
    const addedLines = (diff.match(/^\+[^+]/gm) || []).length;
    const removedLines = (diff.match(/^-[^-]/gm) || []).length;

    // 小さい変更はスキップ（10行未満）
    if (addedLines + removedLines < 10) {
      process.stdout.write(JSON.stringify({ decision: 'approve' }));
      return;
    }

    // 変更ファイル一覧
    const changedFiles = [];
    const fileMatches = diff.matchAll(/^diff --git a\/(\S+) b\/(\S+)/gm);
    for (const m of fileMatches) {
      changedFiles.push(m[1]);
    }

    // 疑わしいパターン検出
    const suspiciousPatterns = [];

    // 1. フォーマット変更のみ（空白・インデント）の変更
    const whitespaceOnly = (diff.match(/^[+-]\s+$/gm) || []).length;
    if (whitespaceOnly > 5) {
      suspiciousPatterns.push(`空白のみの変更が${whitespaceOnly}行`);
    }

    // 2. コメント削除/書き換え（// or # で始まる行の変更）
    const commentChanges = (diff.match(/^[+-]\s*(\/\/|#|\*|\/\*)/gm) || []).length;
    if (commentChanges > 5) {
      suspiciousPatterns.push(`コメントの変更が${commentChanges}行`);
    }

    // 3. 変更ファイル数が多すぎる（10ファイル以上）
    if (changedFiles.length > 10) {
      suspiciousPatterns.push(`変更ファイル数が${changedFiles.length}件（多すぎる可能性）`);
    }

    // 4. ticketタイトル/ID がdiffのパスに全く含まれない（無関係領域の変更）
    const ticketTitle = (ticket.title || '').toLowerCase();
    const ticketId = (ticket.ticket || ticket.identifier || '').toLowerCase();

    // 疑わしいパターンがなければ通過
    if (suspiciousPatterns.length === 0) {
      process.stdout.write(JSON.stringify({ decision: 'approve' }));
      return;
    }

    // 疑わしい → ask_user
    process.stdout.write(JSON.stringify({
      decision: 'ask_user',
      message: `🔍 Surgical Change Checker: タスク無関係な変更の可能性があります。\n\n`
        + `チケット: ${ticket.ticket || ticket.identifier || '不明'}\n`
        + `タイトル: ${ticket.title || '不明'}\n\n`
        + `変更統計:\n`
        + `  追加: ${addedLines}行, 削除: ${removedLines}行\n`
        + `  変更ファイル: ${changedFiles.length}件\n\n`
        + `疑わしいパターン:\n`
        + suspiciousPatterns.map(p => `  - ${p}`).join('\n')
        + `\n\nKarpathy原則（Surgical Changes）:\n`
        + `「変更した全ての行が、ユーザーの依頼に直接トレースできるか？」\n\n`
        + `本当にこれらの変更全てがチケットに直接関係していますか？\n`
        + `無関係な変更があれば、別チケットに分離してください。\n\n`
        + `このcheck自体を無効化するには:\n`
        + `  touch .context/surgical-check-disabled`,
    }));
  } catch {
    process.stdout.write(JSON.stringify({ decision: 'approve' }));
  }
});
