#!/usr/bin/env node
'use strict';

/**
 * ogsm-review.js — OGSM品質ダブルチェック PreToolUse Hook
 *
 * ogsm-gate.js が「OGSMの存在」を強制するのに対し、
 * ogsm-review.js は「OGSMの質」を強制する。
 *
 * - Audit Keiji: 7項目チェック（A1-A7）をプロトコルベースで判定
 * - Founder Keiji: 5項目チェック（F1-F5）
 * - INoTパターン: 1回のAPI呼び出しで2人格の議論をシミュレート
 * - いずれかNG → ask_user
 * - fail-open: APIエラー、タイムアウト、パース失敗 → approve
 *
 * フラグファイル:
 * - .context/ogsm-reviewed — レビュー済みフラグ（JSON）
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

// === パス定数 ===
const CWD = process.cwd();
const OGSM_PATH = path.join(CWD, '.context', 'ogsm.md');
const REVIEWED_FLAG_PATH = path.join(CWD, '.context', 'ogsm-reviewed');
const CURRENT_TICKET_PATH = path.join(CWD, '.context', 'current_ticket.json');
const LUNA_CONTEXT_PATH = path.join(CWD, '.agents', 'LUNA_CONTEXT.md');
const KPI_TREE_PATH = path.join(CWD, 'docs', 'kpi_tree.md');
const OGSM_DESIGN_PATH = path.join(CWD, 'docs', 'ogsm_enforcement_design.md');
const HISTORY_PATH = path.join(CWD, 'data', 'ogsm_history.jsonl');
const API_HELPER_PATH = path.join(__dirname, '_ogsm-review-api.js');

// === 出力関数 ===
function approve(additionalContext) {
  const result = { decision: 'approve' };
  if (additionalContext) result.additionalContext = additionalContext;
  process.stdout.write(JSON.stringify(result));
}

function askUser(message) {
  process.stdout.write(JSON.stringify({
    decision: 'ask_user',
    message,
  }));
}

// === 入力取得 ===
function getInput() {
  try {
    return JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
  } catch {
    return null;
  }
}

// === スキップ判定 ===
function isContextOperation(toolName, toolInput) {
  if ((toolName === 'Edit' || toolName === 'Write') && toolInput?.file_path) {
    return toolInput.file_path.includes('.context/');
  }
  if (toolName === 'Bash' && toolInput?.command) {
    return /\.context\//.test(toolInput.command);
  }
  return false;
}

function isReadOnlyCommand(command) {
  if (!command) return false;
  return /^\s*(ls|cat|head|tail|grep|rg|find|wc|diff|file|stat|pwd|echo|printf|git\s+(status|log|diff|show|branch|remote))\b/.test(command);
}

// H1: 読み取り系ツールを除外
const EXCLUDED_TOOLS = new Set([
  'Read', 'Grep', 'Glob', 'WebSearch', 'WebFetch',
  'Agent', 'TaskList', 'TaskGet', 'TaskCreate', 'TaskUpdate',
]);

// H2: 除外パス判定
function isExcludedPath(filePath) {
  if (!filePath) return false;
  if (filePath.includes('.context/')) return true;
  if (filePath.includes('.claude/')) return true;
  if (/\.md$/i.test(filePath)) return true;
  if (/\.txt$/i.test(filePath)) return true;
  return false;
}

function shouldSkip(toolName, toolInput) {
  // H1: 読み取り系ツールは常にスキップ
  if (EXCLUDED_TOOLS.has(toolName)) return true;

  // .context/ 操作は常に許可
  if (isContextOperation(toolName, toolInput)) return true;

  // H2: 除外パス（.md, .claude/, .context/）
  if ((toolName === 'Edit' || toolName === 'Write') && isExcludedPath(toolInput?.file_path)) return true;

  // 読み取り系コマンドは常に許可
  if (toolName === 'Bash' && isReadOnlyCommand(toolInput?.command)) return true;

  // ogsm.md が存在しない → ogsm-gate.js の管轄
  if (!fs.existsSync(OGSM_PATH)) return true;

  return false;
}

// === ハッシュ計算 ===
function computeOgsmHash() {
  const content = fs.readFileSync(OGSM_PATH, 'utf8').trim();
  return 'sha256:' + crypto.createHash('sha256').update(content).digest('hex');
}

// === 現在のチケット取得 ===
function getCurrentTicket() {
  try {
    const data = JSON.parse(fs.readFileSync(CURRENT_TICKET_PATH, 'utf8'));
    return data.ticket || '';
  } catch {
    return '';
  }
}

// === レビュー済み判定 ===
function isAlreadyReviewed() {
  if (!fs.existsSync(REVIEWED_FLAG_PATH)) return false;

  try {
    const flag = JSON.parse(fs.readFileSync(REVIEWED_FLAG_PATH, 'utf8'));
    const currentHash = computeOgsmHash();

    // ハッシュ不一致 → 再チェック
    if (flag.ogsm_hash !== currentHash) return false;

    // チケット不一致 → 再チェック
    const currentTicket = getCurrentTicket();
    if (currentTicket && flag.ticket && flag.ticket !== currentTicket) return false;

    return true;
  } catch {
    return false; // パース失敗 → 再チェック
  }
}

// === ファイル読み込みヘルパー ===
function readFileOrEmpty(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

// === 学習データ読み込み ===
function readRecentHistory(count) {
  try {
    const content = fs.readFileSync(HISTORY_PATH, 'utf8').trim();
    if (!content) return [];
    const lines = content.split('\n').filter(Boolean);
    return lines.slice(-count).map(line => {
      try { return JSON.parse(line); } catch { return null; }
    }).filter(Boolean);
  } catch {
    return [];
  }
}

// === INoTプロンプト構築 ===
function buildInoTPrompt({ ogsmContent, lunaOgsm, kpiTree, lunaContext, history }) {
  const historySection = history.length > 0
    ? '\n## 過去のOGSM判定から学んだこと（直近' + history.length + '件）\n' +
      history.map(h => '- ' + (h.ticket || '不明') + ': ' + (h.summary || h.reason || '記録なし') + (h.quality_score ? ' (quality_score: ' + h.quality_score + ')' : '')).join('\n')
    : '';

  const system = `あなたは2つの役割を順番に演じ、OGSMの品質を検証する。

## Role 1: Audit Keiji（監査役）
以下の8項目を順番にチェックする。全項目PASSで合格。1つでもREJECTがあればNG。

A1: 上位目標紐づけ — ObjectiveがLuna OGSMの4 Goals（月商/解約率/転換率/マッチ課金率）のいずれかに明示的に紐づいているか。紐づけなし、または「このファイルを修正する」レベルの記述はREJECT。
A2: Measures定量性 — 全Measuresに数値・状態・ファイルパス等の客観的検証条件があるか。「修正した」「改善した」「対応した」等の主観的記述はREJECT。
A3: Measures検証可能性 — 各Measureが第三者（別セッション）によって機械的に確認可能か。確認に主観判断が必要（「品質が向上した」等）はREJECT。
A4: 適当記述 + 抽象度テスト — Objectiveが具体的（なぜ・誰のために・何が変わるか）か。テンプレコピペ、1行で終わる、抽象的すぎる、20字未満はREJECT。追加チェック: Objectiveの主動詞が「実装する」「配布する」「追加する」「作成する」「修正する」「設定する」「導入する」等のOutput動詞（＝作業・手段）の場合、それは手段であり目的ではない → REJECT。Outcome動詞（＝結果・状態変化）の例: 「防ぐ」「向上する」「担保する」「実現する」「削減する」「確保する」「強化する」。
A5: バックログ逆算 + 3 Whysテスト — Objectiveがタスクの前に存在していたか（上位目標から演繹的に導出可能か）。既存タスクへの後付けObjective（「このタスクをやるため」のような循環論法）はREJECT。Objective内にチケットID・ファイル名が含まれていないかチェック。追加チェック: Objectiveに対して「なぜそれをやるのか？」を内部で3回問う。1回目の答えが現在のObjectiveと同レベル（同じ抽象度の言い換え）であれば、それは手段レベルの記述 → REJECT。3回目の答えの方がObjectiveとして適切な場合、現Objectiveは手段を書いている。
A6: アウトプット=ゴール検出 — Goalsが「状態の変化」や「数値の改善」を記述しているか。「機能Xをリリース」「ファイルYを修正」等のアウトプット記述はREJECT。Goals内の動詞パターン（「リリースする」「作成する」→NG）。
A7: Goal Stacking検出 — Objectiveが1つの明確な目的に収束しているか。1つのOGSMに3つ以上の独立した目的が混在はREJECT。Objective内のAND接続数、Goals間の独立性をチェック。
A8: Causal Chain論理検証 — Causal Chainセクションの因果連鎖が以下を全て満たすかチェック: (a) 各「→」の接続に論理的飛躍がないか（前段から後段が自然に導出可能か）。飛躍例: 「hookを追加する → 売上が上がる」は中間ステップが欠落。(b) 最終段がLuna Purpose（安心して自分を表現できる場所）またはLuna 4 Goals（月商/解約率/転換率/マッチ課金率）に到達するか。(c) Objectiveの記述とCausal Chainの起点が一致するか。論理飛躍・Luna未到達・起点不一致はREJECT。
A9: 目的達成判定 — これが最も重要なチェック（全体の7-8割）。以下の2点だけを判断する: (1) やっていることは目的（Objective）に沿っているか？ (2) アウトプット（成果物）は目的を達成しているか？ この2つのいずれかがNoならREJECT。細かいルールより、この2つが全て。

## Role 2: Founder Keiji（創業者）
以下の5項目をチェックする。1つでもREJECTがあればNG。明確なVIOLATIONのみREJECT、グレーゾーンはPASS。

F1: 信念整合性 — 施策がLunaの存在意義（安心して自分を表現できる場所）と矛盾しないか。欲望の免罪、治安の犠牲、無秩序な拡大を促す施策はREJECT。
F2: ユーザー信頼 — ユーザーの信頼を損なわないか。決済・課金・プラン変更が含まれる場合のみ発火。金銭面の信頼毀損リスクがあるのに言及なしはREJECT。
F3: 社長時間効率 — 施策がKeijiの時間を過度に消費しないか。Keijiの手動介入が常時必要な設計はREJECT。Strategy内に「手動」「毎回確認」等のキーワードがあればチェック。
F4: 治安・継続性 — 短期KPIより治安・継続性を優先しているか。治安リスクを無視した成長施策はREJECT。
F5: 目的不明確 — 「何のためにやるのか」が明確か。Objectiveが「やるため」「対応するため」等の自己参照的記述はREJECT。

## 検証手順
1. まず Audit Keiji として A1-A8 を順番にチェックする
2. 次に Founder Keiji として F1-F5 をチェックする
3. 2人の結果が矛盾する場合、Founder が優先（最上位思想）
4. 最終判定を出す

## 上位事業目標（参照用）
${lunaOgsm || '（参照データなし）'}

## KPIツリー（参照用）
${kpiTree || '（参照データなし）'}

## Lunaの信念（参照用）
${lunaContext || '（参照データなし）'}
${historySection}`;

  const user = `以下のOGSMを検証してください。

---
${ogsmContent}
---

以下のYAMLフォーマットで出力してください。YAMLブロック以外のテキストは出力しないでください。

\`\`\`yaml
audit:
  verdict: "PASS | REJECT"
  checks:
    - id: "A1"
      status: "PASS | REJECT"
      finding: "所見"
    - id: "A2"
      status: "PASS | REJECT"
      finding: "所見"
    - id: "A3"
      status: "PASS | REJECT"
      finding: "所見"
    - id: "A4"
      status: "PASS | REJECT"
      finding: "所見"
    - id: "A5"
      status: "PASS | REJECT"
      finding: "所見"
    - id: "A6"
      status: "PASS | REJECT"
      finding: "所見"
    - id: "A7"
      status: "PASS | REJECT"
      finding: "所見"
    - id: "A8"
      status: "PASS | REJECT"
      finding: "所見"
    - id: "A9"
      status: "PASS | REJECT"
      finding: "所見"

founder:
  verdict: "PASS | REJECT"
  checks:
    - id: "F1"
      status: "PASS | REJECT"
      finding: "所見"
    - id: "F2"
      status: "PASS | REJECT"
      finding: "所見"
    - id: "F3"
      status: "PASS | REJECT"
      finding: "所見"
    - id: "F4"
      status: "PASS | REJECT"
      finding: "所見"
    - id: "F5"
      status: "PASS | REJECT"
      finding: "所見"

final_verdict: "PASS | REJECT"
reason: "最終判定理由（1-2文）"
suggestion: "REJECTの場合の修正提案（PASSの場合は空文字列）"
\`\`\``;

  return { system, user };
}

// === YAMLレスポンスパース ===
function parseYamlResponse(responseText) {
  // ```yaml ... ``` ブロックを抽出
  const yamlMatch = responseText.match(/```yaml\s*([\s\S]*?)```/);
  const yamlContent = yamlMatch ? yamlMatch[1].trim() : responseText.trim();

  // 簡易YAMLパーサー（外部依存なし）
  const result = {
    audit: { verdict: 'PASS', checks: [] },
    founder: { verdict: 'PASS', checks: [] },
    final_verdict: 'PASS',
    reason: '',
    suggestion: '',
  };

  // audit verdict
  const auditVerdictMatch = yamlContent.match(/^audit:\s*\n\s*verdict:\s*"?(PASS|REJECT)"?/m);
  if (auditVerdictMatch) result.audit.verdict = auditVerdictMatch[1];

  // founder verdict
  const founderVerdictMatch = yamlContent.match(/^founder:\s*\n\s*verdict:\s*"?(PASS|REJECT)"?/m);
  if (founderVerdictMatch) result.founder.verdict = founderVerdictMatch[1];

  // final_verdict
  const finalMatch = yamlContent.match(/^final_verdict:\s*"?(PASS|REJECT)"?/m);
  if (finalMatch) result.final_verdict = finalMatch[1];

  // reason
  const reasonMatch = yamlContent.match(/^reason:\s*"?([^"\n]+)"?/m);
  if (reasonMatch) result.reason = reasonMatch[1].trim();

  // suggestion
  const suggestionMatch = yamlContent.match(/^suggestion:\s*"?([^"\n]*)"?/m);
  if (suggestionMatch) result.suggestion = suggestionMatch[1].trim();

  // Parse checks (A1-A7, F1-F5)
  const checkPattern = /- id:\s*"?(A\d|F\d)"?\s*\n\s*status:\s*"?(PASS|REJECT)"?\s*\n\s*finding:\s*"?([^"\n]+)"?/g;
  let match;
  while ((match = checkPattern.exec(yamlContent)) !== null) {
    const check = { id: match[1], status: match[2], finding: match[3].trim() };
    if (check.id.startsWith('A')) {
      result.audit.checks.push(check);
    } else {
      result.founder.checks.push(check);
    }
  }

  return result;
}

// === API呼び出し ===
function callOgsmReview() {
  const ogsmContent = fs.readFileSync(OGSM_PATH, 'utf8');
  const lunaOgsm = readFileOrEmpty(OGSM_DESIGN_PATH);
  const kpiTree = readFileOrEmpty(KPI_TREE_PATH);
  const lunaContext = readFileOrEmpty(LUNA_CONTEXT_PATH);
  const history = readRecentHistory(5);

  const prompt = buildInoTPrompt({
    ogsmContent,
    lunaOgsm,
    kpiTree,
    lunaContext,
    history,
  });

  const params = {
    model: 'claude-haiku-3-5-20250929',
    max_tokens: 1024,
    temperature: 0.0,
    system: prompt.system,
    messages: [{ role: 'user', content: prompt.user }],
  };

  const result = execSync(
    'node ' + JSON.stringify(API_HELPER_PATH),
    {
      input: JSON.stringify(params),
      timeout: 14000, // 15秒制限 - 1秒マージン
      env: { ...process.env },
      encoding: 'utf8',
    }
  );

  const apiResponse = JSON.parse(result);
  return parseYamlResponse(apiResponse.text);
}

// === フラグ書き込み ===
function writeReviewedFlag(result) {
  const flag = {
    ticket: getCurrentTicket(),
    ogsm_hash: computeOgsmHash(),
    reviewed_at: new Date().toISOString(),
    audit_verdict: result.audit.verdict,
    founder_verdict: result.founder.verdict,
    model: 'claude-haiku-3-5-20250929',
    cost_usd: 0.002,
  };
  fs.mkdirSync(path.dirname(REVIEWED_FLAG_PATH), { recursive: true });
  fs.writeFileSync(REVIEWED_FLAG_PATH, JSON.stringify(flag, null, 2));
}

// === NGメッセージ生成 ===
function formatNgMessage(result) {
  const lines = ['OGSM品質チェック: NG\n'];

  if (result.audit.verdict === 'REJECT') {
    lines.push('【Audit Keiji】');
    const ngChecks = result.audit.checks.filter(c => c.status === 'REJECT');
    ngChecks.forEach(c => lines.push('  - ' + c.id + ': ' + c.finding));
    lines.push('');
  }

  if (result.founder.verdict === 'REJECT') {
    lines.push('【Founder Keiji】');
    const ngChecks = result.founder.checks.filter(c => c.status === 'REJECT');
    ngChecks.forEach(c => lines.push('  - ' + c.id + ': ' + c.finding));
    lines.push('');
  }

  if (result.suggestion) {
    lines.push('修正提案: ' + result.suggestion);
    lines.push('');
  }

  lines.push('--- 選択肢 ---');
  lines.push('1. OGSMを修正して再チェック → .context/ogsm.md を編集してください');
  lines.push('2. このまま続行（Keiji承認） → 「続行」と回答してください');

  return lines.join('\n');
}

// === メインエントリポイント ===
function main() {
  const input = getInput();
  if (!input) return approve(); // パース失敗 → fail-open

  const { tool_name, tool_input } = input;

  // Phase 1: スキップ判定
  if (shouldSkip(tool_name, tool_input || {})) return approve();

  // Phase 2: レビュー済み判定
  if (isAlreadyReviewed()) return approve('[OGSM Review] Already reviewed');

  // Phase 3: API呼び出し + 判定
  try {
    const result = callOgsmReview();
    if (result.final_verdict === 'PASS') {
      writeReviewedFlag(result);
      return approve('[OGSM Review PASS] Audit: OK, Founder: OK. チケット: ' + getCurrentTicket());
    } else {
      return askUser(formatNgMessage(result));
    }
  } catch (err) {
    // fail-open: API障害でも作業は止めない
    return approve('[OGSM Review] Error: ' + err.message);
  }
}

// === エクスポート（テスト用） ===
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    shouldSkip,
    isAlreadyReviewed,
    computeOgsmHash,
    getCurrentTicket,
    readFileOrEmpty,
    readRecentHistory,
    buildInoTPrompt,
    parseYamlResponse,
    callOgsmReview,
    writeReviewedFlag,
    formatNgMessage,
    isContextOperation,
    isReadOnlyCommand,
    // Constants for testing
    OGSM_PATH,
    REVIEWED_FLAG_PATH,
    CURRENT_TICKET_PATH,
    HISTORY_PATH,
    API_HELPER_PATH,
  };
}

// 直接実行時のみmain()を呼ぶ
if (require.main === module) {
  main();
}
