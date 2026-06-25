#!/usr/bin/env node
'use strict';

/**
 * QA Round Gate — PreToolUse Hook
 *
 * git commit検知時に3ラウンド検証の完了を確認する。
 * quality-gate-enforcer.jsの前段で発火し、QA検証が未完了のcommitをブロック。
 *
 * チェック内容:
 *   1. QA台帳のstatusが "round-3" または "done" であるか
 *   2. 全テスト項目の全9セル（3視点×3ラウンド）のResult列が埋まっているか
 *   3. R3にFAILが残っていないか
 *   4. Evidence列にsha256ハッシュが含まれているか（機械生成の証明）
 *   5. Round Summaryが3ラウンド分記入されているか
 *   6. 各Round Summaryにtest_report_hashが記録されているか
 *   7. Round 2にsentinel_participated: trueが記録されているか
 *   8. Round 3にauditor_participated: trueが記録されているか
 *   9. Round 3のmutation_scoreが70%以上であるか
 *   10. Round 3のregression_all_passがtrueであるか
 *   11. final_verdictが "APPROVED" であるか
 */

const fs = require('fs');
const path = require('path');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const toolName = data.tool_name || '';
    const toolInput = data.tool_input || {};

    // git commitのみ対象
    if (toolName !== 'Bash' || !toolInput.command) {
      process.stdout.write(JSON.stringify({ decision: 'approve' }));
      return;
    }

    const cmd = toolInput.command;
    if (!/\bgit\b.*\bcommit\b/.test(cmd)) {
      process.stdout.write(JSON.stringify({ decision: 'approve' }));
      return;
    }

    // チケット確認
    const ticketFile = path.join(process.cwd(), '.context', 'current_ticket.json');
    let ticket;
    try {
      ticket = JSON.parse(fs.readFileSync(ticketFile, 'utf8'));
    } catch {
      // チケットなし → 他のhookの責務
      process.stdout.write(JSON.stringify({ decision: 'approve' }));
      return;
    }

    const labels = (ticket.labels || []).map(l => (typeof l === 'string' ? l : '').toLowerCase());
    if (!labels.some(l => ['feature', 'epic'].includes(l))) {
      process.stdout.write(JSON.stringify({ decision: 'approve' }));
      return;
    }

    // QA台帳を探す
    const ticketId = (ticket.ticket || ticket.identifier || '').toLowerCase();
    const qaDir = path.join(process.cwd(), 'docs', 'qa');
    let qaFilePath = null;
    try {
      const qaFiles = fs.readdirSync(qaDir);
      const match = qaFiles.find(f => f.toLowerCase().includes(ticketId.replace(/^aris-/, '')));
      if (match) qaFilePath = path.join(qaDir, match);
    } catch {}

    if (!qaFilePath) {
      process.stdout.write(JSON.stringify({
        decision: 'block',
        reason: 'QA Round Gate: QA台帳が見つかりません。Feature/Epicチケットにはq台帳が必須です。',
      }));
      return;
    }

    let qaContent;
    try {
      qaContent = fs.readFileSync(qaFilePath, 'utf8');
    } catch {
      process.stdout.write(JSON.stringify({ decision: 'approve' }));
      return;
    }

    const issues = [];

    // 1. status確認
    const statusMatch = qaContent.match(/^- status:\s*(\S+)/m);
    const status = statusMatch ? statusMatch[1] : '';
    if (!['round-3', 'done'].includes(status)) {
      issues.push(`statusが "${status}" です（"round-3" または "done" が必要）`);
    }

    // 2. 全セル記入チェック
    const emptyResults = (qaContent.match(/\| R[1-3] \|[^|]*\|[^|]*\| - \|/g) || []).length;
    if (emptyResults > 0) {
      issues.push(`未記入のResult列が${emptyResults}セルあります`);
    }

    // 3. R3のFAILチェック
    const r3Fails = (qaContent.match(/\| R3 \|[^|]*\|[^|]*\| FAIL \|/g) || []).length;
    if (r3Fails > 0) {
      issues.push(`Round 3にFAILが${r3Fails}件残っています`);
    }

    // 4. Evidence列のsha256チェック
    const evidenceCells = qaContent.match(/\| R[1-3] \|[^|]*\|[^|]*\|[^|]*\|([^|]*)\|/g) || [];
    const noHashEvidence = evidenceCells.filter(e => !/sha256:/.test(e)).length;
    if (noHashEvidence > 0 && emptyResults === 0) {
      issues.push(`sha256ハッシュのないEvidence列が${noHashEvidence}件あります（機械生成でないEvidence）`);
    }

    // 5. Round Summary 3ラウンド分
    for (let r = 1; r <= 3; r++) {
      if (!new RegExp(`^### Round ${r}`, 'm').test(qaContent)) {
        issues.push(`Round ${r} Summaryが未記入です`);
      }
    }

    // 6. test_report_hash
    for (let r = 1; r <= 3; r++) {
      if (!new RegExp(`Round ${r}[\\s\\S]*?test_report_hash:\\s*sha256:`, 'm').test(qaContent)) {
        issues.push(`Round ${r}のtest_report_hashが未記録です`);
      }
    }

    // 7. sentinel参加 (Round 2)
    if (!/sentinel_participated:\s*true/i.test(qaContent)) {
      issues.push('Round 2でsentinelが参加していません（セキュリティ検証必須）');
    }

    // 8. auditor参加 (Round 3)
    if (!/auditor_participated:\s*true/i.test(qaContent)) {
      issues.push('Round 3でauditorが参加していません（品質監査必須）');
    }

    // 9. ミューテーションスコア
    const mutationMatch = qaContent.match(/mutation_score:\s*(\d+)/);
    if (!mutationMatch) {
      issues.push('ミューテーションスコアが記録されていません');
    } else if (parseInt(mutationMatch[1], 10) < 70) {
      issues.push(`ミューテーションスコアが70%未満（${mutationMatch[1]}%）。テストがバグを十分に捕まえていません`);
    }

    // 10. リグレッション
    if (!/regression_all_pass:\s*true/i.test(qaContent)) {
      issues.push('リグレッションテストが全PASSではありません');
    }

    // 11. final_verdict
    if (!/final_verdict:\s*APPROVED/i.test(qaContent)) {
      issues.push('final_verdictがAPPROVEDではありません');
    }

    if (issues.length > 0) {
      process.stdout.write(JSON.stringify({
        decision: 'block',
        reason: `QA Round Gate: QA検証が未完了です（${issues.length}件）。\n\n`
          + issues.map((i, idx) => `  ${idx + 1}. ${i}`).join('\n')
          + `\n\nQA台帳: ${path.relative(process.cwd(), qaFilePath)}\n`
          + `全ての検証を完了してからcommitしてください。`,
      }));
    } else {
      process.stdout.write(JSON.stringify({
        decision: 'approve',
        additionalContext: '✅ QA Round Gate passed. 3ラウンド検証完了。',
      }));
    }
  } catch {
    process.stdout.write(JSON.stringify({ decision: 'approve' }));
  }
});
