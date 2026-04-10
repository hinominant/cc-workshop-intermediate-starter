#!/usr/bin/env node
'use strict';

/**
 * Keiji Agent Auto-Trigger — PostToolUse Hook (ARIS-448)
 *
 * 特定ファイルの変更を検知し、.context/keiji-pending.json にフラグを書く。
 * 次のPreToolUse（ogsm-gate.js等）でフラグを検知してask_userで問いを強制する。
 *
 * 2段階方式:
 * Step 1 (このhook): PostToolUse → フラグ書き込み
 * Step 2 (keiji-agent-gate.js): PreToolUse → フラグ検知 → ask_user
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
const toolInput = input.tool_input || {};

if (tool !== 'Edit' && tool !== 'Write') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const filePath = toolInput.file_path || '';

// 除外パス（.context/ogsm.mdはOGSMチェックのため除外しない）
if (
  (filePath.includes('.context/') && !filePath.includes('ogsm.md')) ||
  filePath.includes('keiji-agent') ||
  filePath.includes('/tests/') ||
  filePath.includes('test_') ||
  filePath.includes('.jsonl') ||
  filePath.endsWith('.json') ||
  filePath.includes('time_log') ||
  filePath.includes('MEMORY.md')
) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// トリガー判定
let triggerType = null;
let patterns = '';

if (filePath.includes('ogsm.md') && filePath.includes('.context/')) {
  triggerType = 'ogsm';
  patterns = '#1 目的から考えてるか？ — このObjectiveは「やること」ではなく「達成すること」になっているか？作業者ベースじゃないか？手段が目的化していないか？';
} else if (filePath.includes('failure_pattern_dictionary.md')) {
  triggerType = 'failure';
  patterns = '#4 根本か？対処療法じゃないか？ + #3 仕組みで防げるか？';
} else if (filePath.includes('.claude/hooks/') && filePath.endsWith('.js')) {
  triggerType = 'hook';
  patterns = '#3 仕組みで防げるか？無視できないか？ + #8 配線されてるか？';
} else if (filePath.includes('.claude/skills/') && filePath.endsWith('.md')) {
  triggerType = 'skill';
  patterns = '#3 仕組みで防げるか？ + #7 前提を疑ってるか？';
} else if (filePath.includes('/src/') && tool === 'Write') {
  triggerType = 'new_module';
  patterns = '#8 作っただけで終わってないか？ + #6 目的から考えてるか？';
}

if (!triggerType) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 失敗パターン辞書の場合: 同一カテゴリ3回以上チェック
if (triggerType === 'failure') {
  try {
    const dictContent = fs.readFileSync(
      path.join(process.cwd(), 'docs', 'failure_pattern_dictionary.md'), 'utf8'
    );
    // カテゴリごとのパターン数をカウント（### CAT-NNN: 形式）
    const catCounts = {};
    const patternRegex = /^### ([A-Z]+)-\d+:/gm;
    let match;
    while ((match = patternRegex.exec(dictContent)) !== null) {
      const cat = match[1];
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    }
    // 3回以上のカテゴリがあれば/debug提案を追記
    const repeatCats = Object.entries(catCounts)
      .filter(([, count]) => count >= 3)
      .sort((a, b) => b[1] - a[1]);
    if (repeatCats.length > 0) {
      const repeatInfo = repeatCats.map(([cat, count]) => `${cat}(${count}件)`).join(', ');
      patterns += `\n\n⚠ 同一カテゴリ失敗3回以上: ${repeatInfo}\n→ /debug プロトコルの起動を検討してください`;
    }
  } catch {}
}

// フラグ書き込み
const contextDir = path.join(process.cwd(), '.context');
const pendingFile = path.join(contextDir, 'keiji-pending.json');

try {
  fs.mkdirSync(contextDir, { recursive: true });
  fs.writeFileSync(pendingFile, JSON.stringify({
    trigger: triggerType,
    file: filePath,
    patterns: patterns,
    timestamp: new Date().toISOString(),
  }));
} catch (e) {
  // フラグ書き込み失敗しても通過（fail-open）
}

console.log(JSON.stringify({ decision: 'approve' }));
