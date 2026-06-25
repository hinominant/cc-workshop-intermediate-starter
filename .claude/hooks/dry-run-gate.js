#!/usr/bin/env node
'use strict';

/**
 * Dry Run Gate — ARIS-838 Step 8 (Ubie: BigQueryドライラン、スキャン上限チェック)
 *
 * 本番DB書き込み・外部API変更系のコマンド実行前に、ドライランまたは試行実行を強制する。
 *
 * 対象:
 *   - DB migration (alembic upgrade, db:migrate, prisma migrate deploy)
 *   - API 変更系 POST/PUT/PATCH/DELETE（本番URLへ）
 *   - 破壊的操作 (rm -rf, drop table)
 *
 * 判定:
 *   - 同種のドライラン（--dry-run / --plan / --check）が直近10分以内に実行済み → 通過
 *   - 未実施 → block
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
if (tool !== 'Bash') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const command = (input.tool_input || {}).command || '';

// 変更系コマンドパターン
const MUTATION_PATTERNS = [
  { pattern: /alembic\s+upgrade(?!\s+--sql)/, type: 'alembic migration', dryrunHint: 'alembic upgrade head --sql で差分確認' },
  { pattern: /\b(yarn|npm|pnpm)\s+run\s+db:migrate(?!.*--plan)/, type: 'DB migration', dryrunHint: '--plan or --dry-run オプション' },
  { pattern: /prisma\s+migrate\s+deploy(?!.*--check)/, type: 'Prisma migration', dryrunHint: 'prisma migrate diff で差分確認' },
  { pattern: /\bdrop\s+(table|database|schema)/i, type: 'DROP文', dryrunHint: 'EXPLAIN or バックアップ確認' },
  { pattern: /\brm\s+-rf\s+(?!\/tmp|node_modules|__pycache__|dist|build)/, type: '大規模削除', dryrunHint: 'ls で確認してから' },
  { pattern: /curl[^|]*-X\s+(POST|PUT|PATCH|DELETE)\s+https?:\/\/(?!localhost|127\.0\.0\.1)[^"'\s]*(prod|production|api\.luna-matching|lros\.luna-matching)/, type: '本番API変更系呼び出し', dryrunHint: 'ステージング環境で先に確認' },
];

let matched = null;
for (const p of MUTATION_PATTERNS) {
  if (p.pattern.test(command)) {
    matched = p;
    break;
  }
}

if (!matched) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const CWD = process.cwd();
const DRYRUN_LOG = path.join(CWD, '.context', 'dry-run-log.jsonl');

// 直近10分のドライラン実行履歴
let recentDryruns = [];
try {
  const content = fs.readFileSync(DRYRUN_LOG, 'utf8');
  const lines = content.trim().split('\n').filter(Boolean);
  const now = Date.now();
  recentDryruns = lines
    .map(l => { try { return JSON.parse(l); } catch { return null; } })
    .filter(e => e && (now - new Date(e.ts).getTime()) < 10 * 60 * 1000);
} catch {}

// 同種類のドライランが実行済みか
const sameTypeDryrun = recentDryruns.some(e => e.type === matched.type);
if (sameTypeDryrun) {
  console.log(JSON.stringify({
    decision: 'approve',
    additionalContext: `✅ Dry Run Gate: 直近10分以内に ${matched.type} のドライラン記録あり`,
  }));
  process.exit(0);
}

// ドライラン未実施 → block
console.log(JSON.stringify({
  decision: 'block',
  reason: `🧪 Dry Run Gate: 変更系コマンドを検知（ARIS-838 S8）\n\n`
    + `コマンド: ${command.slice(0, 200)}\n`
    + `種別: ${matched.type}\n\n`
    + `Ubie記事原則: 本番反映前にドライランを実行する。\n`
    + `推奨: ${matched.dryrunHint}\n\n`
    + `ドライラン実行後、以下で記録してから本番コマンドを再実行してください:\n`
    + `  mkdir -p .context && echo '{"ts":"$(date -u +%Y-%m-%dT%H:%M:%SZ)","type":"${matched.type}"}' >> .context/dry-run-log.jsonl\n\n`
    + `--dry-run / --plan / --check 相当のオプションを付けた実行もこのhookは変更系として扱います。`,
}));
