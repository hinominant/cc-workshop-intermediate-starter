#!/usr/bin/env node
'use strict';

/**
 * Session Start Handoff — SessionStart Hook
 *
 * 新しいセッション開始時に .context/session-handoff.md を検知し、
 * 内容を additionalContext として返す。
 * これにより新セッションが前のセッションの状態を自動的に把握する。
 *
 * 同時にツール呼び出しカウンターをリセット（context-monitor用）。
 */

const fs = require('fs');
const path = require('path');

const HANDOFF_PATH = path.join(process.cwd(), '.context', 'session-handoff.md');
const COUNTER_PATH = path.join(process.cwd(), '.context', 'tool-call-counter.json');
const HANDOFF_FLAG = path.join(process.cwd(), '.context', 'handoff-recommended');

// カウンターリセット
try {
  fs.mkdirSync(path.dirname(COUNTER_PATH), { recursive: true });
  fs.writeFileSync(COUNTER_PATH, JSON.stringify({
    count: 0,
    session_start: new Date().toISOString(),
  }, null, 2));
} catch {}

// handoffフラグクリア
try { fs.unlinkSync(HANDOFF_FLAG); } catch {}

// handoff内容を読み込み
let result = { decision: 'approve' };

if (fs.existsSync(HANDOFF_PATH)) {
  try {
    const content = fs.readFileSync(HANDOFF_PATH, 'utf8');
    result.additionalContext = '📂 前セッションからの引き継ぎを検出しました:\n\n'
      + '```markdown\n' + content + '\n```\n\n'
      + '**このhandoffを読んで作業を継続してください。**\n'
      + '完了後は `node scripts/session-handoff.js clear` でhandoffをクリアしてください。';
  } catch {}
}

console.log(JSON.stringify(result));
