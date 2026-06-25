#!/usr/bin/env node
'use strict';

/**
 * Codex Invoker — ARIS-809 (GAP-001 S6)
 *
 * Phase 4 red-tests進入時にCodex CLIを自動起動してテストコードを生成する。
 * ENGINE_ROUTING.md で「テストコードはCodex」と定めたルールを仕組み化。
 *
 * 動作:
 *   1. phase-state が qa-planning→red-tests 遷移直後を検知
 *   2. QA台帳から test_file 一覧を抽出
 *   3. Codex CLI が利用可能なら `codex exec --full-auto -m o4-mini` を起動
 *   4. 未インストール時は ask_user で「Claudeが代替実装するか」確認
 *
 * Note: このhookは PostToolUse として動作する（phase-transition advance 後に発火）。
 */

const fs = require('fs');
const path = require('path');
const { spawnSync, execSync } = require('child_process');

let input;
try {
  input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
} catch {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const CWD = process.cwd();
const STATE_PATH = path.join(CWD, '.context', 'phase-state.json');
const INVOKE_LOG = path.join(CWD, '.context', 'codex-invoke-log');

if (!fs.existsSync(STATE_PATH)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

let state;
try {
  state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
} catch {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// red-tests フェーズ進入直後のみ対象
if (state.phase !== 'red-tests') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 既にRed確認済みならスキップ（テストコード生成済み）
if (fs.existsSync(path.join(CWD, '.context', 'red-confirmed'))) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// rapid-fire防止（1時間以内に起動していればスキップ）
try {
  if (fs.existsSync(INVOKE_LOG)) {
    const last = parseInt(fs.readFileSync(INVOKE_LOG, 'utf8').trim(), 10);
    if (Date.now() - last < 60 * 60 * 1000) {
      console.log(JSON.stringify({ decision: 'approve' }));
      process.exit(0);
    }
  }
} catch {}

// QA台帳の test_file 一覧を取得
const ticketId = (state.ticket || '').toLowerCase().replace(/^aris-/, '');
const qaDir = path.join(CWD, 'docs', 'qa');
let qaFilePath = null;
try {
  const files = fs.readdirSync(qaDir);
  const match = files.find(f => f.toLowerCase().includes(ticketId));
  if (match) qaFilePath = path.join(qaDir, match);
} catch {}

if (!qaFilePath) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const qaContent = fs.readFileSync(qaFilePath, 'utf8');
const testFiles = [...new Set((qaContent.match(/^- test_file:\s*(.+)$/gm) || [])
  .map(l => l.replace(/^- test_file:\s*/, '').trim())
  .filter(Boolean))];

if (testFiles.length === 0) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// Codex CLI 利用可能チェック
function hasCodex() {
  try { execSync('which codex', { stdio: 'pipe' }); return true; }
  catch { return false; }
}

const codexAvailable = hasCodex();

// ログ記録
try {
  fs.mkdirSync(path.dirname(INVOKE_LOG), { recursive: true });
  fs.writeFileSync(INVOKE_LOG, String(Date.now()));
} catch {}

const promptText = `QA台帳 ${path.relative(CWD, qaFilePath)} のテスト項目 ${testFiles.length}件に対応するテストコードを生成してください。

テスト項目:
${testFiles.map(f => `  - ${f}`).join('\n')}

原則:
  - src/ の実装コードは参照しない（Red Tests原則）
  - Specとテスト項目のみから期待動作を記述
  - 各テストは具体的な入力値・期待出力を検証（assert True禁止）
  - Failing Tests として全テストが実装なしでFAILすること`;

if (codexAvailable) {
  console.log(JSON.stringify({
    decision: 'approve',
    additionalContext: `🤖 Codex Invoker (ARIS-809): Phase 4 red-tests 進入を検知。\n\n`
      + `Codex CLI が利用可能です。以下を実行してテストコードを生成してください:\n\n`
      + `\`\`\`bash\n`
      + `codex exec --full-auto -m o4-mini "${promptText.replace(/\n/g, '\\n').replace(/"/g, '\\"')}"\n`
      + `\`\`\`\n\n`
      + `生成後、全テスト実行 → 全FAIL確認 → .context/red-confirmed 生成してください。`,
  }));
} else {
  console.log(JSON.stringify({
    decision: 'approve',
    additionalContext: `🤖 Codex Invoker (ARIS-809): Phase 4 red-tests 進入を検知。\n\n`
      + `⚠️ Codex CLI が未インストールです。Claudeがテストコードを代替生成します。\n\n`
      + `生成対象（QA台帳より）:\n`
      + testFiles.map(f => `  - ${f}`).join('\n')
      + `\n\n原則:\n`
      + `  - src/ は参照しない（Red Tests）\n`
      + `  - 具体的な値で検証（空assertion禁止）\n`
      + `  - 全テスト実装なしでFAILすること`,
  }));
}
