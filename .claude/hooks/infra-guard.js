#!/usr/bin/env node
'use strict';

/**
 * Infra Guard — PreToolUse Hook (ARIS-181)
 *
 * インフラ変更（DNS, セキュリティグループ, IP制限等）を検知してブロック。
 * 意図しないインフラ変更による障害を防止する。
 *
 * ブロック対象:
 * - AWS CLI（ec2/rds/route53/iam等の変更系）
 * - Supabase CLI（migration push等）
 * - Vercel CLI（設定変更）
 * - iptables/ufw
 * - launchctl load/unload（Mac Mini設定変更）
 */

const fs = require('fs');

let input;
try {
  input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
} catch {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

if (input.tool_name !== 'Bash') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const command = (input.tool_input || {}).command || '';

// 読み取り専用コマンドは許可
const readOnlyPatterns = [
  /aws\s+.*\s+(describe|list|get)\b/,
  /aws\s+sts\s+get-caller-identity/,
  /supabase\s+(status|db\s+diff)/,
  /vercel\s+(ls|list|inspect)/,
  /launchctl\s+list/,
  /launchctl\s+print/,
];
if (readOnlyPatterns.some(p => p.test(command))) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// インフラ変更コマンドの検知
const infraChangePatterns = [
  { pattern: /aws\s+(ec2|rds|route53|iam|s3|lambda|ecs)\s/, name: 'AWS変更' },
  { pattern: /supabase\s+(db\s+push|migration|functions\s+deploy)/, name: 'Supabase変更' },
  { pattern: /vercel\s+(deploy|env|domains)/, name: 'Vercel変更' },
  { pattern: /\b(iptables|ufw|firewall-cmd)\b/, name: 'ファイアウォール変更' },
  { pattern: /launchctl\s+(load|unload|bootstrap|bootout)/, name: 'launchd変更' },
  { pattern: /\bterraform\s+(apply|destroy)/, name: 'Terraform変更' },
  { pattern: /\bkubectl\s+(apply|delete|patch)/, name: 'Kubernetes変更' },
];

for (const { pattern, name } of infraChangePatterns) {
  if (pattern.test(command)) {
    console.log(JSON.stringify({
      decision: 'ask_user',
      message: `🏗️ Infra Guard: ${name}を検知しました。\n\n`
        + `コマンド: ${command.substring(0, 200)}\n\n`
        + `インフラ変更は影響範囲が大きいため確認が必要です。\n`
        + `この変更が意図的であることを確認してください。`,
    }));
    process.exit(0);
  }
}

console.log(JSON.stringify({ decision: 'approve' }));
