#!/usr/bin/env node
'use strict';

/**
 * QA Workflow Driver — PostToolUse Hook
 *
 * チケット起動→テスト完了→クローズまでを1本のワークフローとして自走させる。
 * 個々のgate hookは門番。このhookは推進力。
 *
 * 動作:
 *   1. phase-state.json の現在Phaseを読む
 *   2. QA台帳の状態を読む
 *   3. 現Phaseの完了条件を自動検出
 *   4. 条件充足 → 次Phaseに自動advance + 次Phaseの作業を指示
 *   5. 条件未充足 → additionalContextで「何が足りないか」を注入
 *
 * これにより:
 *   - 手動で「次は何をすればいい？」と聞く必要がない
 *   - 各Phaseの作業が完了した瞬間に次Phaseに進む
 *   - 全体が1本のワークフローとして連続的に走る
 *
 * Phase別の自動アクション:
 *   spec完了       → 「design-gateを通過するための設計レビューを開始してください」
 *   design完了     → 「別セッションでmagi合議を起動し、QA計画を開始してください」
 *   qa-planning完了 → 「Codexでテストコードを生成してください: codex exec ...」
 *   red-tests完了  → 「全テストFAIL確認済み。実装を開始してください」
 *   impl完了       → 「QA Round 1を開始します。pytest --json-report を実行してください」
 *   qa-rounds完了  → 「/quality-gate を実行してcommit+pushしてください」
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// === 入力パース ===
let input;
try {
  input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
} catch {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

const CWD = process.cwd();
const CONTEXT_DIR = path.join(CWD, '.context');
const STATE_PATH = path.join(CONTEXT_DIR, 'phase-state.json');
const TRANSITION_SCRIPT = path.join(CWD, 'scripts', 'phase-transition.js');

// phase-state.json が存在しなければスキップ
if (!fs.existsSync(STATE_PATH) || !fs.existsSync(TRANSITION_SCRIPT)) {
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

if (state.phase === 'done' || !state.phase) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// === rapid-fire防止 ===
const LOG_PATH = path.join(CONTEXT_DIR, 'qa-workflow-log.jsonl');
try {
  if (fs.existsSync(LOG_PATH)) {
    const lines = fs.readFileSync(LOG_PATH, 'utf8').trim().split('\n').filter(Boolean);
    if (lines.length > 0) {
      const last = JSON.parse(lines[lines.length - 1]);
      if (Date.now() - new Date(last.ts).getTime() < 5000) {
        console.log(JSON.stringify({ decision: 'approve' }));
        process.exit(0);
      }
    }
  }
} catch {}

// === QA台帳検出 + チェックポイント自動更新 ===
try {
  execSync(`node "${TRANSITION_SCRIPT}" check`, {
    encoding: 'utf8',
    timeout: 5000,
    cwd: CWD,
  });
  // checkコマンドがdetectQaCheckpointsを呼ぶのでstate再読み込み
  state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
} catch {}

// === advance可能か確認 ===
let checkResult = '';
try {
  checkResult = execSync(`node "${TRANSITION_SCRIPT}" check`, {
    encoding: 'utf8',
    timeout: 3000,
    cwd: CWD,
  });
} catch {}

const canAdvance = checkResult.includes('✅');

if (canAdvance) {
  // === 自動advance ===
  const prevPhase = state.phase;
  try {
    execSync(`node "${TRANSITION_SCRIPT}" advance`, {
      encoding: 'utf8',
      timeout: 5000,
      cwd: CWD,
    });
  } catch (e) {
    console.log(JSON.stringify({ decision: 'approve' }));
    process.exit(0);
  }

  // 遷移後のstateを読む
  let newState;
  try {
    newState = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  } catch {
    console.log(JSON.stringify({ decision: 'approve' }));
    process.exit(0);
  }

  const newPhase = newState.phase;

  // ログ記録
  try {
    fs.appendFileSync(LOG_PATH,
      JSON.stringify({ ts: new Date().toISOString(), from: prevPhase, to: newPhase, ticket: state.ticket }) + '\n'
    );
  } catch {}

  // === 次Phaseの作業指示を注入 ===
  const instructions = getPhaseInstructions(newPhase, newState);

  console.log(JSON.stringify({
    decision: 'approve',
    additionalContext: `🔄 Phase自動遷移: ${prevPhase} → ${newPhase}\n\n${instructions}`,
  }));
  process.exit(0);
}

// === advance不可 → 現Phaseの進捗ヒントを注入 ===
const hint = getProgressHint(state);
if (hint) {
  console.log(JSON.stringify({
    decision: 'approve',
    additionalContext: hint,
  }));
} else {
  console.log(JSON.stringify({ decision: 'approve' }));
}

// === Phase別指示生成 ===
function getPhaseInstructions(phase, st) {
  const ticket = st.ticket || 'UNKNOWN';
  const qaFile = `docs/qa/${ticket.toLowerCase()}_qa.md`;

  switch (phase) {
    case 'spec':
      return `📋 Phase 1: Spec作成\n`
        + `docs/specs/ に要求定義書を作成してください。\n`
        + `必須: Purpose / Acceptance Criteria(3個+) / Out of Scope`;

    case 'design':
      return `🎨 Phase 2: Design（設計レビュー）\n`
        + `Specに基づいて設計を行ってください。`;

    case 'qa-planning':
      return `🧪 Phase 3: QA Planning\n`
        + `【重要: 以下は別セッション（Arena/magi）で実行してください】\n\n`
        + `1. QA台帳を作成: ${qaFile}\n`
        + `   テンプレート: _templates/QA_TEMPLATE.md\n\n`
        + `2. magi合議でテストチーム組成（3エージェント選定）\n`
        + `   入力: Specの受入条件のみ（src/は見せない）\n\n`
        + `3. テスト項目列挙（カタログ照合含む）\n`
        + `   参照: _templates/test-catalogs/*.md\n\n`
        + `4. Coverage Matrix作成\n\n`
        + `ENGINE_ROUTING: Claude Code別セッション → magi合議`;

    case 'red-tests':
      return `🔴 Phase 4: Red Tests\n`
        + `【Codexでテストコード生成】\n\n`
        + `codex exec --full-auto -m o4-mini \\\n`
        + `  "以下のQA台帳のテスト項目に対応するテストコードを生成せよ。\n`
        + `   QA台帳: ${qaFile}\n`
        + `   フレームワーク: pytest\n`
        + `   src/は参照するな。テスト項目とSpecのみから生成せよ。"\n\n`
        + `生成後:\n`
        + `  1. qa-assertion-check.js が空assertionを検出しないこと\n`
        + `  2. 全テスト実行 → 全FAIL確認\n`
        + `  3. .context/red-confirmed 自動生成`;

    case 'impl':
      return `💻 Phase 5: Implementation\n`
        + `テストをGreenにする実装を書いてください。\n`
        + `全テストPASS → 自動的にPhase 6（QA Rounds）に遷移します。`;

    case 'qa-rounds':
      return `🔍 Phase 6: QA Rounds（3ラウンド検証）\n\n`
        + `【Round 1: 機能検証】\n`
        + `  pytest --json-report --json-report-file=.context/test-report.json tests/\n`
        + `  node .claude/hooks/qa-result-writer.js --qa-file ${qaFile} --report .context/test-report.json --round 1\n`
        + `  → 3エージェントがComment記入 → FAIL修正\n\n`
        + `【Round 2: エッジ+セキュリティ】\n`
        + `  pytest -p randomly --json-report ... tests/\n`
        + `  → sentinel必須参加 → プロパティベーステスト実行\n\n`
        + `【Round 3: カオス+ミューテーション+リグレッション】\n`
        + `  mutmut run → スコア70%以上\n`
        + `  全既存テスト実行 → リグレッション確認\n`
        + `  → auditor必須参加 → final_verdict: APPROVED\n\n`
        + `全Round完了 → /quality-gate で commit+push`;

    case 'done':
      return `✅ Phase 7: Done\n`
        + `/quality-gate を実行してcommit+pushしてください。`;

    default:
      return '';
  }
}

function getProgressHint(st) {
  const phase = st.phase;
  const cp = st.checkpoints || {};

  switch (phase) {
    case 'spec':
      if (!cp.spec_exists) return '📋 現在: Spec作成中。docs/specs/ に要求定義書を完成させてください。';
      if (!cp.spec_sections_valid) return '📋 Specの構造が不完全です。Purpose / AC(3個+) / Out of Scopeを確認。';
      return null;

    case 'design':
      if (!cp.design_reviewed) return '🎨 現在: Design中。設計レビューを完了させてください。';
      return null;

    case 'qa-planning':
      if (!cp.qa_team_composed) return '🧪 QA Planning: チーム組成が未完了。別セッションでmagi合議を実行してください。';
      if (!cp.qa_items_listed) return '🧪 QA Planning: テスト項目が未列挙。カタログ照合も忘れずに。';
      if (!cp.qa_catalog_checked) return '🧪 QA Planning: カタログ照合が未完了。Catalog Coverageセクションを記入してください。';
      return null;

    case 'red-tests':
      if (!cp.red_tests_confirmed) return '🔴 Red Tests: Codexでテストコード生成後、全テストFAILを確認してください。';
      return null;

    case 'impl':
      if (!cp.all_tests_green) return '💻 Implementation: 全テストをGreenにしてください。';
      return null;

    case 'qa-rounds':
      if (!cp.r3_all_pass) return '🔍 QA Rounds: 3ラウンド検証を進めてください。Round Summaryを確認。';
      if (!cp.mutation_score_ok) return '🔍 QA Rounds: ミューテーションテストのスコアが70%未満です。テストを強化してください。';
      if (!cp.regression_ok) return '🔍 QA Rounds: リグレッションテストが未完了です。';
      if (!cp.final_verdict_approved) return '🔍 QA Rounds: final_verdictをAPPROVEDに設定してください。';
      return null;

    default:
      return null;
  }
}
