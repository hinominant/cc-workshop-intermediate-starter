#!/usr/bin/env node
'use strict';

/**
 * Autodev Router — UserPromptSubmit Hook
 *
 * 自然言語のタスク依頼を検出し、/autodev フローへ強制ルーティングする。
 *
 * 検出パターン:
 *   1. チケットID + 動詞 → /autodev TICKET-ID 即実行を指示
 *   2. 動詞のみ（チケットID無し）→ /create-ticket → /autodev を指示
 *   3. 「このチケットやって」+ current_ticket.json存在 → /autodev を現在チケットで実行
 *
 * 動作:
 *   - additionalContextに指示文を注入（ブロックはしない）
 *   - スラッシュコマンド・短いプロンプト・継続プロンプトは無視（fail-open）
 *   - 既にautonomous-modeで /autodev が走っている場合はskip
 *
 * 無効化:
 *   - 環境変数 AUTODEV_ROUTER_DISABLED=true
 *   - .context/autodev-router-disabled ファイル
 */

const fs = require('fs');
const path = require('path');

// === 入力パース ===
let input;
try {
  input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
} catch {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// Claude Code UserPromptSubmit hookの入力フィールドは user_prompt
// fallback で prompt も拾う（互換性）
const prompt = (input.user_prompt || input.prompt || '').trim();
const cwd = process.cwd();

// === 早期return: 無効化 ===
if (process.env.AUTODEV_ROUTER_DISABLED === 'true') {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}
if (fs.existsSync(path.join(cwd, '.context', 'autodev-router-disabled'))) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// === 早期return: 空 / 短すぎ ===
if (!prompt || prompt.length < 4) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// === 早期return: 既にスラッシュコマンド ===
if (prompt.startsWith('/')) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// === 早期return: ! 始まり（シェルコマンド） ===
if (prompt.startsWith('!')) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// === 早期return: 継続的なやり取り（短い肯定/質問応答） ===
const SHORT_REPLIES = /^(はい|いいえ|うん|ok|OK|そう|違う|次|続けて|どうぞ|了解|ありがと|ありがとう|了解|もちろん|どう|なんで|何|どこ|誰|いつ|なぜ|\?|？)/;
if (prompt.length < 12 && SHORT_REPLIES.test(prompt)) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// === 早期return: 既にautodevフェーズ進行中 ===
try {
  const phaseStatePath = path.join(cwd, '.context', 'phase-state.json');
  if (fs.existsSync(phaseStatePath)) {
    const state = JSON.parse(fs.readFileSync(phaseStatePath, 'utf8'));
    // 進行中のチケットがある + autonomous-modeなら新規ルーティングしない
    const autonomousFlag = path.join(cwd, '.context', 'autonomous-mode');
    if (state.ticket && state.phase && state.phase !== 'done' && fs.existsSync(autonomousFlag)) {
      console.log(JSON.stringify({ decision: 'approve' }));
      process.exit(0);
    }
  }
} catch {}

// === パターン検出 ===

// チケットIDパターン: ARIS-123, LUNA-456, NOVA-789, LROS-12, #123
const TICKET_ID_RE = /\b((?:ARIS|LUNA|NOVA|LROS|UTATA|HINO|HANDOFF|WIRING|AUTO)[-\s]?(\d+))\b/i;
const HASH_TICKET_RE = /(?:^|\s)#(\d+)\b/;

// 動詞パターン（依頼の意図）
const VERB_RE = /(やって|やってくれ|やってください|お願い|開発して|作って|実装して|直して|修正して|してくれ|してください|追加して|削除して|消して|除去して|クリーンアップ|リファクタ|片付けて|整理して|始めて|進めて|やろう|着手)/;

const ticketMatch = prompt.match(TICKET_ID_RE);
const hashMatch = prompt.match(HASH_TICKET_RE);
const hasVerb = VERB_RE.test(prompt);

// パターン1: チケットID + 動詞
if ((ticketMatch || hashMatch) && hasVerb) {
  const ticketId = ticketMatch
    ? `${ticketMatch[1].toUpperCase().replace(/\s/, '-')}`
    : `#${hashMatch[1]}`;

  const msg = `🚀 AUTODEV ROUTER: チケット指定の開発依頼を検出しました（${ticketId}）。

**強制指示**: 以下の手順を即実行してください。聞き返さない。

1. \`.context/current_ticket.json\` を ${ticketId} に更新（Linear APIでラベル取得、失敗時 labels=['feature']）
2. \`mkdir -p .context && touch .context/autonomous-mode\` で自律モード有効化
3. risk_level判定: feature→standard, bug/fix→light, security/revenue→strict, epic→/epicへルート
4. \`node scripts/phase-transition.js init ${ticketId} <risk>\` でPhase初期化
5. \`/autodev ${ticketId}\` で7フェーズ自動実行を開始`;

  console.log(JSON.stringify({
    decision: 'approve',
    additionalContext: msg,
  }));
  process.exit(0);
}

// パターン2: 動詞のみ（チケットID無し）→ チケット自動作成
if (hasVerb && prompt.length >= 8) {
  // タイトル抽出: 末尾の依頼動詞句のみ削除（語頭・語中の名詞は保持）
  const TRAILING_VERB_RE = /(を?(やって|やってくれ|やってください|お願いします?|開発して|作って|実装して|直して|修正して|してくれ|してください|追加して|削除して|消して|除去して|片付けて|整理して|始めて|進めて|やろう|着手して?))[。、！\.\!\s]*$/;
  let titleCandidate = prompt
    .replace(TRAILING_VERB_RE, '')
    .replace(/^[「『\[\(]\s*/, '')
    .replace(/[、。\s]+$/, '')
    .trim();
  if (titleCandidate.length < 4) titleCandidate = prompt.slice(0, 80);
  titleCandidate = titleCandidate.slice(0, 80);

  // ラベル推定
  let label = 'feature';
  if (/(バグ|エラー|壊れ|直して|修正|fix|bug|動かない|失敗)/.test(prompt)) label = 'bug';
  else if (/(セキュリティ|脆弱性|漏洩|security)/.test(prompt)) label = 'security';
  else if (/(リファクタ|大規模|刷新|全面|エピック|epic)/.test(prompt)) label = 'epic';
  else if (/(クリーンアップ|削除|除去|片付|cleanup)/.test(prompt)) label = 'feature';

  const msg = `🚀 AUTODEV ROUTER: 自然言語のタスク依頼を検出しました（チケット未指定）。

**強制指示**: 既存の \`/create-ticket\` スラッシュコマンド（~/.claude/commands/create-ticket.md）を即実行してください。聞き返さない。

【入力】
- title候補: 「${titleCandidate}」
- description: **ユーザー発言の原文を必ず含める**（ARIS-518: 空description禁止）
- 推定ラベル: \`${label}\`
- priority: 3 (Medium) デフォルト

【その後の手順】
1. \`/create-ticket\` 実行 → 新チケットID取得
2. \`.context/current_ticket.json\` を新ID + labels=['${label}'] で更新
3. \`mkdir -p .context && touch .context/autonomous-mode\` で自律モード有効化
4. \`node scripts/phase-transition.js init <NEW-TICKET-ID> standard\` でPhase初期化
5. \`/autodev <NEW-TICKET-ID>\` で7フェーズ自動開発を開始

**Linear APIが失敗した場合**: \`LOCAL-$(date +%s)\` で仮IDを採番して続行。
**チケット作成は省略しない**。同じ失敗を繰り返さない。`;

  console.log(JSON.stringify({
    decision: 'approve',
    additionalContext: msg,
  }));
  process.exit(0);
}

// マッチなし → 通過
console.log(JSON.stringify({ decision: 'approve' }));
