#!/usr/bin/env node
'use strict';

/**
 * Debug Hypothesis Gate — ARIS-811 (GAP-001 S8)
 *
 * バグ修正系のコード変更前に、仮説3つ+証拠棄却の記述を強制する。
 * systematic-debuggingスキルの「仮説なしのコード変更禁止」を仕組み化。
 *
 * トリガー条件:
 *   - Bugfix ラベルのチケット
 *   - OR チケットタイトルに「バグ」「fix」「修正」「error」等を含む
 *   - src/ 配下のコード変更
 *
 * 要求:
 *   .context/debug-session.md が存在
 *   最低3つの仮説（H1/H2/H3）記述
 *   各仮説に検証結果（KILLED/SURVIVED）
 *   真因特定の結論
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
const PASS_THROUGH = new Set(['Read', 'Grep', 'Glob', 'WebSearch', 'WebFetch', 'Agent', 'TaskList', 'TaskGet', 'TaskCreate', 'TaskUpdate']);
if (PASS_THROUGH.has(tool)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const filePath = (input.tool_input || {}).file_path || '';
if (!filePath.includes('/src/')) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// テスト・ドキュメントは対象外
if (filePath.includes('/tests/') || filePath.includes('/docs/') || filePath.includes('.context/') || filePath.includes('.claude/')) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// チケット取得
const ticketFile = path.join(process.cwd(), '.context', 'current_ticket.json');
let ticket;
try {
  ticket = JSON.parse(fs.readFileSync(ticketFile, 'utf8'));
} catch {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const labels = (ticket.labels || []).map(l => (typeof l === 'string' ? l : '').toLowerCase());
const title = (ticket.title || '').toLowerCase();

// Bugfix判定
const isBugfix = labels.some(l => ['bug', 'bugfix', 'fix'].includes(l))
  || /バグ|修正|fix|error|直す|直して|不具合/.test(title);

if (!isBugfix) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// debug-session.md 存在チェック
const sessionPath = path.join(process.cwd(), '.context', 'debug-session.md');
let sessionContent = '';
try {
  sessionContent = fs.readFileSync(sessionPath, 'utf8');
} catch {
  console.log(JSON.stringify({
    decision: 'block',
    reason: `🔬 Debug Hypothesis Gate: Bugfixチケットで .context/debug-session.md がありません。\n\n`
      + `systematic-debugging 原則: NO CODE CHANGES WITHOUT A HYPOTHESIS BACKED BY EVIDENCE\n\n`
      + `以下を作成してください:\n\n`
      + `  cat > .context/debug-session.md <<EOF\n`
      + `  # Debug Session: ${ticket.ticket || 'UNKNOWN'}\n\n`
      + `  ## Symptoms\n`
      + `  - What happens: （実際の挙動）\n`
      + `  - What should happen: （期待する挙動）\n`
      + `  - How to reproduce: （再現手順）\n\n`
      + `  ## Hypotheses\n\n`
      + `  ### H1: （最有力）\n`
      + `  - 証拠: ...\n`
      + `  - 検証: KILLED / SURVIVED\n\n`
      + `  ### H2: （次点）\n`
      + `  - 証拠: ...\n`
      + `  - 検証: KILLED / SURVIVED\n\n`
      + `  ### H3: （低確率だが無視不可）\n`
      + `  - 証拠: ...\n`
      + `  - 検証: KILLED / SURVIVED\n\n`
      + `  ## Root Cause\n`
      + `  H{N} が真因。理由: ...\n`
      + `  EOF\n\n`
      + `参考: .claude/skills/systematic-debugging.md`,
  }));
  process.exit(0);
}

// 仮説数チェック
const hypCount = (sessionContent.match(/^###\s+H\d+/gm) || []).length;
if (hypCount < 3) {
  console.log(JSON.stringify({
    decision: 'block',
    reason: `🔬 Debug Hypothesis Gate: 仮説が${hypCount}個のみ（最低3つ必要）。\n\n`
      + `### H1 / H2 / H3 を .context/debug-session.md に追記してください。\n`
      + `1つ目の仮説に飛びついて修正するのは禁止。複数仮説を立てて証拠で棄却する。`,
  }));
  process.exit(0);
}

// Root Cause記述チェック
if (!/^##\s+Root\s+Cause/im.test(sessionContent)) {
  console.log(JSON.stringify({
    decision: 'block',
    reason: `🔬 Debug Hypothesis Gate: Root Cause セクションが未記述。\n\n`
      + `仮説検証後、真因を .context/debug-session.md の ## Root Cause に記述してください。`,
  }));
  process.exit(0);
}

// 検証結果（KILLED/SURVIVED）チェック
const verificationCount = (sessionContent.match(/(KILLED|SURVIVED)/g) || []).length;
if (verificationCount < 3) {
  console.log(JSON.stringify({
    decision: 'block',
    reason: `🔬 Debug Hypothesis Gate: 仮説の検証結果（KILLED/SURVIVED）が${verificationCount}箇所のみ。\n\n`
      + `各仮説に証拠による検証結果を記述してください（最低3箇所）。`,
  }));
  process.exit(0);
}

// 通過
console.log(JSON.stringify({
  decision: 'approve',
  additionalContext: `✅ Debug Hypothesis Gate: 仮説${hypCount}件検証済み（systematic-debugging準拠）`,
}));
