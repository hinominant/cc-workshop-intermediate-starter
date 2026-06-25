#!/usr/bin/env node
'use strict';

/**
 * Design MD Sanity Check — PreToolUse Hook (ARIS-771)
 *
 * DESIGN.md / DESIGN_*.md ファイル作成・編集時に、
 * プロンプトインジェクションパターンを検知する。
 *
 * 背景:
 *   - DESIGN.md は AI エージェントが必ず読むファイル
 *   - 外部から取り込んだDESIGN.mdに悪意ある指示が混入する可能性
 *   - awesome-design-md 等の外部カタログからの取り込み時に特に注意
 *
 * 検出パターン:
 *   1. プロンプトインジェクション語彙（"ignore previous", "無視して"等）
 *   2. システムプロンプト偽装（"You are", "あなたは〜として"）
 *   3. 実行コマンド埋込（bash/curl/rm/eval）
 *   4. 外部リンク（画像URL含む、トラッカー埋込リスク）
 *   5. Base64/エスケープ文字列
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

// DESIGN.md / DESIGN_*.md のみ対象
const basename = path.basename(filePath);
if (!/^DESIGN(_\w+)?\.md$/i.test(basename)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// ARIS-812 (GAP-001 S9): 他ブランド流入検知
// DESIGN_*.md は LUNA 以外禁止
const designNameMatch = basename.match(/^DESIGN_(\w+)\.md$/i);
if (designNameMatch) {
  const brand = designNameMatch[1].toUpperCase();
  if (brand !== 'LUNA') {
    console.log(JSON.stringify({
      decision: 'block',
      reason: `🎨 Design MD Sanity Check: 他ブランドDESIGN.mdの作成は禁止です。\n\n`
        + `ファイル: ${basename}\n`
        + `検出ブランド: ${brand}\n\n`
        + `Luna のDESIGN.mdは DESIGN_LUNA.md のみ許可されています。\n`
        + `他ブランド（STRIPE/APPLE/AIRBNB等）のミラーは商標リスクおよびプロジェクト一貫性の毀損のため禁止。\n\n`
        + `参考: _templates/DESIGN_LUNA.md (Luna独自デザインシステム)`,
    }));
    process.exit(0);
  }
}

const content = (input.tool_input || {}).content || (input.tool_input || {}).new_string || '';
if (!content || content.length < 10) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const findings = [];

// === Pattern 1: プロンプトインジェクション語彙 ===
const INJECTION_PHRASES = [
  { pattern: /ignore\s+(previous|above|all)\s+(instructions?|prompts?)/i, desc: 'prompt injection (ignore previous)' },
  { pattern: /disregard\s+(the|all|previous)/i, desc: 'prompt injection (disregard)' },
  { pattern: /forget\s+(everything|all|previous)/i, desc: 'prompt injection (forget all)' },
  { pattern: /(以前|これまで|上記|前述)の(指示|命令|プロンプト).*無視/i, desc: 'prompt injection (JP ignore)' },
  { pattern: /新しい指示[：:]/i, desc: 'prompt injection (JP new instruction)' },
  { pattern: /system\s*prompt\s*[:=]/i, desc: 'system prompt override' },
  { pattern: /\[INST\]|\[\/INST\]/, desc: 'LLM instruction tokens' },
  { pattern: /<\|(im_start|system|assistant|user)\|>/, desc: 'chat template tokens' },
];

// === Pattern 2: システムプロンプト偽装 ===
const IDENTITY_OVERRIDE = [
  { pattern: /you\s+are\s+(now\s+)?(a|an|the)\s+\w+/i, desc: 'identity override (You are...)' },
  { pattern: /あなたは(今から|これから)?.{1,30}(として|です)/i, desc: 'identity override (JP)' },
  { pattern: /your\s+new\s+(role|identity|task|instruction)/i, desc: 'role override' },
];

// === Pattern 3: 実行コマンド埋込 ===
const EXEC_COMMANDS = [
  { pattern: /```(bash|sh|shell|zsh)[\s\S]*?(curl|wget|rm\s+-rf|eval|exec|sudo)/i, desc: 'suspicious shell command' },
  { pattern: /```(python|py)[\s\S]*?(os\.system|subprocess|eval|exec|__import__)/i, desc: 'suspicious python exec' },
  { pattern: /```(javascript|js|node)[\s\S]*?(child_process|eval|Function\()/i, desc: 'suspicious js exec' },
  { pattern: /curl\s+[^\s]+\s*\|\s*(bash|sh|zsh)/i, desc: 'curl pipe to shell' },
];

// === Pattern 4: 外部リンク・画像 ===
const EXTERNAL_LINKS = [];
const httpMatches = content.match(/https?:\/\/[^\s)"'<>]+/gi) || [];
// 許可リスト（Luna内部/公式ドキュメント）
const ALLOWED_HOSTS = [
  'github.com', 'raw.githubusercontent.com',
  'luna-matching.com', 'luna-hino.com',
  'notion.so', 'linear.app',
  'getdesign.md',  // awesome-design-md公式
  'stitch.withgoogle.com',
  'w3.org', 'mozilla.org', 'developer.mozilla.org',
  'caniuse.com',
];
for (const url of httpMatches) {
  try {
    const u = new URL(url);
    const isAllowed = ALLOWED_HOSTS.some(h => u.hostname === h || u.hostname.endsWith('.' + h));
    if (!isAllowed) {
      EXTERNAL_LINKS.push(u.hostname);
    }
  } catch {}
}
const uniqueExternal = [...new Set(EXTERNAL_LINKS)];

// === Pattern 5: Base64/エスケープ ===
const ENCODING_TRICKS = [
  { pattern: /[A-Za-z0-9+/]{200,}={0,2}/, desc: '大規模Base64文字列（200文字超）' },
  { pattern: /\\x[0-9a-f]{2}\\x[0-9a-f]{2}\\x[0-9a-f]{2}/i, desc: 'hex escape sequence' },
  { pattern: /\\u00[0-9a-f]{2}\\u00[0-9a-f]{2}\\u00[0-9a-f]{2}/i, desc: 'unicode escape sequence' },
];

// 検出実行
for (const { pattern, desc } of INJECTION_PHRASES.concat(IDENTITY_OVERRIDE, EXEC_COMMANDS, ENCODING_TRICKS)) {
  if (pattern.test(content)) {
    findings.push(desc);
  }
}

// ARIS-812: 他ブランド含意キーワード検出（DESIGN_LUNA.md内部でも）
const BRAND_MIRRORING = [
  /stripe[- ]?(inspired|like|style|clone)/i,
  /apple[- ]?(inspired|like|style|clone)/i,
  /airbnb[- ]?(inspired|like|style|clone)/i,
  /linear[- ]?(inspired|like|style|clone)/i,
  /vercel[- ]?(inspired|like|style|clone)/i,
  /figma[- ]?(inspired|like|style|clone)/i,
  /copy\s+of\s+\w+\s+design/i,
];
for (const pattern of BRAND_MIRRORING) {
  if (pattern.test(content)) {
    findings.push(`他ブランドミラー含意: ${content.match(pattern)[0]}`);
  }
}

if (uniqueExternal.length > 0) {
  findings.push(`許可外の外部リンク ${uniqueExternal.length}件: ${uniqueExternal.slice(0, 3).join(', ')}${uniqueExternal.length > 3 ? ' 他' : ''}`);
}

// 検出なし → 通過
if (findings.length === 0) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 検出あり → block
console.log(JSON.stringify({
  decision: 'block',
  reason: `🛡️ Design MD Sanity Check: DESIGN.md に疑わしいパターンが検出されました（${findings.length}件）。\n\n`
    + findings.map((f, i) => `  ${i + 1}. ${f}`).join('\n')
    + `\n\n対応:\n`
    + `  - 外部サイトからDESIGN.mdをコピーした場合、該当箇所を削除してください\n`
    + `  - 意図的な記述であれば、プロンプトインジェクションに見えないよう書き換えてください\n`
    + `  - 外部リンクは許可ホスト（github.com/notion.so/linear.app等）に限定してください\n\n`
    + `原則: DESIGN.md は AI が必ず読む。安全でない記述は他のAIセッションを汚染する可能性があります。`,
}));
