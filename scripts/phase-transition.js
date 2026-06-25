#!/usr/bin/env node
'use strict';

/**
 * phase-transition.js — Phase遷移管理CLI
 *
 * 7フェーズ統合開発フロー（QA台帳駆動・ハーネス駆動）のPhase状態を管理する。
 * リスクレベル（strict/standard/light）に応じてフェーズスキップ対応。
 *
 * フェーズ:
 *   1. spec         — 要求定義書作成
 *   2. design       — 設計レビュー（NOVA設計レビュー）
 *   3. qa-planning  — QA計画（チーム組成+テスト項目列挙+カタログ照合）
 *   4. red-tests    — テストコード作成(Codex)+全FAIL確認
 *   5. impl         — 実装→全Green化
 *   6. qa-rounds    — 3ラウンド検証（R1:機能, R2:エッジ+セキュリティ, R3:カオス+ミューテーション）
 *   7. done         — commit+push
 *
 * Design Evolution:
 *   implまたはqa-roundsからqa-planningに戻ることが可能（.context/design-evolution.json必須）
 *
 * Usage:
 *   node scripts/phase-transition.js init TICKET-ID [risk_level]
 *   node scripts/phase-transition.js advance
 *   node scripts/phase-transition.js check
 *   node scripts/phase-transition.js status
 *   node scripts/phase-transition.js evolve [reason]
 *   node scripts/phase-transition.js reset
 */

const fs = require('fs');
const path = require('path');

const CWD = process.cwd();
const CONTEXT_DIR = path.join(CWD, '.context');
const STATE_PATH = path.join(CONTEXT_DIR, 'phase-state.json');

// === Phase定義（7フェーズ統合モデル） ===
const PHASES = ['spec', 'design', 'qa-planning', 'red-tests', 'impl', 'qa-rounds', 'done'];

const PHASE_PREREQUISITES = {
  'spec': {},
  'design': {
    spec_exists: true,
    spec_sections_valid: true,
  },
  'qa-planning': {
    spec_exists: true,
    design_reviewed: true,
  },
  'red-tests': {
    qa_team_composed: true,
    qa_items_listed: true,
    qa_catalog_checked: true,
  },
  'impl': {
    red_tests_confirmed: true,
  },
  'qa-rounds': {
    all_tests_green: true,
  },
  'done': {
    r3_all_pass: true,
    mutation_score_ok: true,
    regression_ok: true,
    final_verdict_approved: true,
  },
};

// リスクレベル別スキップ対象フェーズ
// QA（qa-planning, qa-rounds）はどのレベルでもスキップ不可
const SKIP_PHASES = {
  'light': ['design'],
  'standard': [],
  'strict': [],
};

const PHASE_LABELS = {
  'spec': 'Phase 1: Spec作成（要求定義書）',
  'design': 'Phase 2: Design（設計レビュー）',
  'qa-planning': 'Phase 3: QA Planning（チーム組成+テスト項目+カタログ照合）',
  'red-tests': 'Phase 4: Red Tests（テストコード作成+全FAIL確認）',
  'impl': 'Phase 5: Implementation（実装→全Green化）',
  'qa-rounds': 'Phase 6: QA Rounds（R1:機能 → R2:エッジ+セキュリティ → R3:カオス+ミューテーション）',
  'done': 'Phase 7: Done（commit+push）',
};

// === ヘルパー ===
function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  } catch {
    return null;
  }
}

function writeState(state) {
  fs.mkdirSync(CONTEXT_DIR, { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

function getNextPhase(current, riskLevel) {
  const skipPhases = SKIP_PHASES[riskLevel] || [];
  let idx = PHASES.indexOf(current);
  if (idx < 0 || idx >= PHASES.length - 1) return null;

  let next = PHASES[idx + 1];
  while (next && skipPhases.includes(next)) {
    idx++;
    next = idx + 1 < PHASES.length ? PHASES[idx + 1] : null;
  }
  return next;
}

function checkPrerequisites(nextPhase, checkpoints) {
  const prereqs = PHASE_PREREQUISITES[nextPhase] || {};
  const missing = [];
  for (const [key, expected] of Object.entries(prereqs)) {
    if (checkpoints[key] !== expected) {
      missing.push(`${key} = ${expected} が必要（現在: ${checkpoints[key] === undefined ? '未設定' : checkpoints[key]}）`);
    }
  }
  return missing;
}

function generatePhaseSummary(state, phaseNumber) {
  const phase = state.phase;
  const label = PHASE_LABELS[phase] || phase;
  const lines = [
    `# Phase ${phaseNumber} Summary: ${label}`,
    '',
    `## チケット: ${state.ticket}`,
    `## リスクレベル: ${state.risk_level}`,
    `## Phase: ${phase}`,
    `## 完了時刻: ${new Date().toISOString()}`,
    '',
    '## チェックポイント',
  ];

  for (const [key, value] of Object.entries(state.checkpoints || {})) {
    lines.push(`- ${key}: ${value}`);
  }

  if (state.design_evolutions && state.design_evolutions.length > 0) {
    lines.push('', '## Design Evolutions');
    for (const de of state.design_evolutions) {
      lines.push(`- DE-${de.id}: ${de.reason} (${de.triggered_at})`);
    }
  }

  return lines.join('\n');
}

// === QA台帳パス解決 ===
function resolveQaFilePath(ticketId) {
  const qaDir = path.join(CWD, 'docs', 'qa');
  const normalized = (ticketId || '').toLowerCase();
  try {
    const qaFiles = fs.readdirSync(qaDir);
    const match = qaFiles.find(f => f.toLowerCase().includes(normalized.replace(/^aris-/, '')));
    if (match) return path.join(qaDir, match);
  } catch {}
  return null;
}

// === QA台帳自動生成（qa-planningフェーズ遷移時） ===
function ensureQaFile(state) {
  const ticketId = (state.ticket || '').toLowerCase();
  const qaDir = path.join(CWD, 'docs', 'qa');
  const qaFilePath = path.join(qaDir, `${ticketId}_qa.md`);

  if (fs.existsSync(qaFilePath)) return qaFilePath;

  const templatePaths = [
    path.join(CWD, '_templates', 'QA_TEMPLATE.md'),
    path.join(CWD, '.claude', 'QA_TEMPLATE.md'),
  ];

  let template = '';
  for (const tp of templatePaths) {
    try { template = fs.readFileSync(tp, 'utf8'); break; } catch {}
  }

  if (!template) {
    template = `# QA: {TICKET-ID}\n\n## Meta\n- spec: docs/specs/\n- created: YYYY-MM-DD\n- status: team-composition\n`;
  }

  const ticketUpper = (state.ticket || '').toUpperCase();
  const content = template
    .replace(/\{TICKET-ID\}/g, ticketUpper)
    .replace(/\{タイトル\}/g, '')
    .replace(/YYYY-MM-DD/g, new Date().toISOString().split('T')[0]);

  fs.mkdirSync(qaDir, { recursive: true });
  fs.writeFileSync(qaFilePath, content, 'utf8');
  console.log(`QA台帳を自動生成: ${path.relative(CWD, qaFilePath)}`);
  return qaFilePath;
}

// === QA台帳のstatus同期（phase-state.json → QA台帳） ===
const PHASE_TO_QA_STATUS = {
  'spec': 'team-composition',
  'design': 'team-composition',
  'qa-planning': 'planning',
  'red-tests': 'red-tests',
  'impl': 'implementation',
  'qa-rounds': 'round-1',
  'done': 'done',
};

function syncQaStatus(state) {
  const qaFilePath = resolveQaFilePath(state.ticket);
  if (!qaFilePath) return;

  try {
    let content = fs.readFileSync(qaFilePath, 'utf8');
    const expectedStatus = PHASE_TO_QA_STATUS[state.phase] || state.phase;
    const currentMatch = content.match(/^- status:\s*(\S+)/m);

    if (currentMatch && currentMatch[1] !== expectedStatus) {
      content = content.replace(/^- status:\s*\S+/m, `- status: ${expectedStatus}`);
      fs.writeFileSync(qaFilePath, content, 'utf8');
    }
  } catch {}
}

// === QA台帳チェックポイント自動検出 ===
function detectQaCheckpoints(state) {
  const qaFilePath = resolveQaFilePath(state.ticket);
  if (!qaFilePath) {
    state._qaFilePath = null;
    return;
  }

  state._qaFilePath = qaFilePath;

  let qaContent;
  try {
    qaContent = fs.readFileSync(qaFilePath, 'utf8');
  } catch {
    return;
  }

  // Team Composition チェック
  if (/composed_by:\s*\S+/.test(qaContent)) {
    const assignedRows = (qaContent.match(/\| 視点[A-Z]/g) || []).length;
    if (assignedRows >= 3) {
      state.checkpoints.qa_team_composed = true;
    }
  }

  // Test Items チェック
  const tiCount = (qaContent.match(/^### TI-\d+/gm) || []).length;
  if (tiCount > 0) {
    state.checkpoints.qa_items_listed = true;
  }

  // Catalog Coverage チェック
  if (/^## Catalog Coverage/m.test(qaContent)) {
    state.checkpoints.qa_catalog_checked = true;
  }

  // Red confirmed チェック
  if (fs.existsSync(path.join(CONTEXT_DIR, 'red-confirmed'))) {
    state.checkpoints.red_tests_confirmed = true;
  }

  // All tests green チェック（impl完了後）
  // これはテスト実行結果から判定。phase-auto-advanceと連携。

  // QA Rounds チェック
  if (/final_verdict:\s*APPROVED/i.test(qaContent)) {
    state.checkpoints.final_verdict_approved = true;
  }
  if (/mutation_score:\s*(\d+)/.test(qaContent)) {
    const score = parseInt(qaContent.match(/mutation_score:\s*(\d+)/)[1], 10);
    if (score >= 70) state.checkpoints.mutation_score_ok = true;
  }
  if (/regression_all_pass:\s*true/i.test(qaContent)) {
    state.checkpoints.regression_ok = true;
  }
  const r3Fails = (qaContent.match(/\| R3 \|[^|]*\|[^|]*\| FAIL \|/g) || []).length;
  const r3Empty = (qaContent.match(/\| R3 \|[^|]*\|[^|]*\| - \|/g) || []).length;
  if (r3Fails === 0 && r3Empty === 0 && tiCount > 0) {
    state.checkpoints.r3_all_pass = true;
  }
}

// === コマンド ===
const [,, command, ...args] = process.argv;

switch (command) {
  case 'init': {
    const ticketId = args[0];
    const riskLevel = args[1] || 'standard';

    if (!ticketId) {
      console.error('Usage: phase-transition.js init TICKET-ID [risk_level]');
      process.exit(1);
    }

    if (!['strict', 'standard', 'light'].includes(riskLevel)) {
      console.error(`無効なリスクレベル: ${riskLevel}（strict/standard/light）`);
      process.exit(1);
    }

    const state = {
      _schema_version: 2,
      ticket: ticketId,
      phase: 'spec',
      risk_level: riskLevel,
      started_at: new Date().toISOString(),
      checkpoints: {
        // Phase 1-2: Spec + Design
        spec_exists: false,
        spec_sections_valid: false,
        design_reviewed: false,
        // Phase 3: QA Planning
        qa_team_composed: false,
        qa_items_listed: false,
        qa_catalog_checked: false,
        // Phase 4: Red Tests
        red_tests_confirmed: false,
        test_count_at_red: 0,
        // Phase 5: Implementation
        all_tests_green: false,
        // Phase 6: QA Rounds
        r3_all_pass: false,
        mutation_score_ok: false,
        regression_ok: false,
        final_verdict_approved: false,
        // Phase 7: Done
        committed: false,
      },
      phase_history: ['spec'],
      design_evolutions: [],
    };

    writeState(state);
    console.log(`Phase initialized: ${ticketId} (${riskLevel}) → spec`);
    console.log(`Phases: ${PHASES.join(' → ')}`);

    // lightの場合、designスキップを通知
    if (riskLevel === 'light') {
      console.log('Note: light risk — design フェーズはスキップされます');
    }
    break;
  }

  case 'advance': {
    const state = readState();
    if (!state) {
      console.error('phase-state.json が見つかりません。init を実行してください。');
      process.exit(1);
    }

    // QA台帳からチェックポイント自動検出
    detectQaCheckpoints(state);

    const riskLevel = state.risk_level || 'standard';
    const nextPhase = getNextPhase(state.phase, riskLevel);
    if (!nextPhase) {
      console.log('既に最終Phaseです。');
      process.exit(0);
    }

    // スキップされたフェーズのcheckpointsを自動充足
    const skipPhases = SKIP_PHASES[riskLevel] || [];
    let checkIdx = PHASES.indexOf(state.phase) + 1;
    while (PHASES[checkIdx] && PHASES[checkIdx] !== nextPhase) {
      const skipped = PHASES[checkIdx];
      if (skipped === 'design') state.checkpoints.design_reviewed = true;
      checkIdx++;
    }

    const missing = checkPrerequisites(nextPhase, state.checkpoints || {});
    if (missing.length > 0) {
      console.error(`条件未達のため advance できません:\n${missing.map(m => '  - ' + m).join('\n')}`);
      process.exit(1);
    }

    // Phase Summary 生成
    const phaseNumber = PHASES.indexOf(state.phase) + 1;
    const summary = generatePhaseSummary(state, phaseNumber);
    const summaryPath = path.join(CONTEXT_DIR, `phase-summary-${phaseNumber}.md`);
    fs.writeFileSync(summaryPath, summary);

    const prevPhase = state.phase;
    state.phase = nextPhase;
    state.phase_history.push(nextPhase);
    writeState(state);

    // QA台帳自動生成（qa-planningに遷移した時）
    if (nextPhase === 'qa-planning') {
      ensureQaFile(state);
    }

    // QA台帳のstatus同期
    syncQaStatus(state);

    console.log(`Phase advanced: ${prevPhase} → ${nextPhase}`);
    console.log(`  ${PHASE_LABELS[nextPhase]}`);
    console.log(`Summary: ${path.relative(CWD, summaryPath)}`);
    break;
  }

  case 'check': {
    const state = readState();
    if (!state) {
      console.log('未初期化: init を実行してください。');
      process.exit(0);
    }

    // QA台帳からチェックポイント自動検出
    detectQaCheckpoints(state);
    writeState(state); // 検出結果を保存

    const nextPhase = getNextPhase(state.phase, state.risk_level);
    if (!nextPhase) {
      console.log('最終Phase。advance不要。');
      process.exit(0);
    }

    const missing = checkPrerequisites(nextPhase, state.checkpoints || {});
    if (missing.length === 0) {
      console.log(`✅ 次のPhase (${nextPhase}) への遷移条件を全て満たしています。`);
    } else {
      console.log(`❌ 次のPhase (${nextPhase}) への遷移条件が未達:`);
      missing.forEach(m => console.log(`  - ${m}`));
    }
    break;
  }

  case 'status': {
    const state = readState();
    if (!state) {
      console.log('未初期化: node scripts/phase-transition.js init TICKET-ID で初期化してください。');
      process.exit(0);
    }

    console.log(`チケット: ${state.ticket}`);
    console.log(`Phase: ${state.phase} — ${PHASE_LABELS[state.phase] || ''}`);
    console.log(`リスクレベル: ${state.risk_level}`);
    console.log(`開始: ${state.started_at}`);
    console.log(`履歴: ${(state.phase_history || []).join(' → ')}`);

    if (state.design_evolutions && state.design_evolutions.length > 0) {
      console.log(`Design Evolutions: ${state.design_evolutions.length}回`);
    }

    // チェックポイント表示
    console.log('\nチェックポイント:');
    for (const [key, value] of Object.entries(state.checkpoints || {})) {
      const icon = value === true ? '✅' : value === false ? '❌' : '  ';
      console.log(`  ${icon} ${key}: ${value}`);
    }
    break;
  }

  case 'evolve': {
    // Design Evolution: impl or qa-rounds → qa-planning に戻る
    const state = readState();
    if (!state) {
      console.error('phase-state.json が見つかりません。');
      process.exit(1);
    }

    if (!['impl', 'qa-rounds'].includes(state.phase)) {
      console.error(`Design Evolutionは impl または qa-rounds フェーズでのみ可能です（現在: ${state.phase}）`);
      process.exit(1);
    }

    // --worktree オプション検出（前から検索）
    let useWorktree = false;
    const cleanArgs = [];
    for (const a of args) {
      if (a === '--worktree' || a === '-w') {
        useWorktree = true;
      } else {
        cleanArgs.push(a);
      }
    }

    const reason = cleanArgs.join(' ') || '';
    if (!reason) {
      console.error('Usage: phase-transition.js evolve [--worktree] "設計変更の理由"');
      console.error('理由なしのDesign Evolutionは許可されません。');
      process.exit(1);
    }

    // worktree作成（旧設計を保持しつつ新設計を別ディレクトリで）
    if (useWorktree) {
      const { execSync } = require('child_process');
      const branchName = `${(state.ticket || 'evolve').toLowerCase()}-evolve-${Date.now().toString(36)}`;
      const worktreePath = path.join(CWD, '..', `${path.basename(CWD)}-${branchName}`);
      try {
        execSync(`git worktree add "${worktreePath}" -b "${branchName}"`, {
          cwd: CWD, stdio: 'pipe',
        });
        console.log(`git worktree作成: ${worktreePath} (ブランチ: ${branchName})`);
        console.log(`cd ${worktreePath} で新設計の作業を開始してください。`);
      } catch (e) {
        console.error(`worktree作成失敗（git管理外 or 競合）: ${e.message}`);
        console.error('worktreeなしで継続します。');
      }
    }

    const evolutionId = (state.design_evolutions || []).length + 1;
    const evolution = {
      id: evolutionId,
      triggered_from: state.phase,
      triggered_at: new Date().toISOString(),
      reason: reason,
    };

    // Design Evolution記録
    if (!state.design_evolutions) state.design_evolutions = [];
    state.design_evolutions.push(evolution);

    // .context/design-evolution.json 作成
    fs.writeFileSync(
      path.join(CONTEXT_DIR, 'design-evolution.json'),
      JSON.stringify(evolution, null, 2)
    );

    // QA関連チェックポイントをリセット（再列挙が必要）
    state.checkpoints.qa_team_composed = false;
    state.checkpoints.qa_items_listed = false;
    state.checkpoints.qa_catalog_checked = false;
    state.checkpoints.red_tests_confirmed = false;
    state.checkpoints.all_tests_green = false;
    state.checkpoints.r3_all_pass = false;
    state.checkpoints.mutation_score_ok = false;
    state.checkpoints.regression_ok = false;
    state.checkpoints.final_verdict_approved = false;

    // red-confirmed フラグ削除
    try { fs.unlinkSync(path.join(CONTEXT_DIR, 'red-confirmed')); } catch {}

    const prevPhase = state.phase;
    state.phase = 'qa-planning';
    state.phase_history.push(`evolve:${prevPhase}→qa-planning`);

    writeState(state);

    // QA台帳のstatus同期
    syncQaStatus(state);

    console.log(`Design Evolution #${evolutionId}: ${prevPhase} → qa-planning`);
    console.log(`  理由: ${reason}`);
    console.log(`  QAチェックポイントをリセットしました。`);
    console.log(`  Spec更新 → テスト項目再列挙 → テストコード更新 → 実装続行`);
    break;
  }

  case 'reset': {
    try {
      fs.unlinkSync(STATE_PATH);
      // 関連フラグもクリーンアップ
      const flags = ['red-confirmed', 'design-evolution.json', 'qa-item-author', 'qa-result-writer-token'];
      for (const f of flags) {
        try { fs.unlinkSync(path.join(CONTEXT_DIR, f)); } catch {}
      }
      console.log('Phase状態をリセットしました。');
    } catch {
      console.log('リセット対象なし。');
    }
    break;
  }

  default:
    console.log('Usage: phase-transition.js <init|advance|check|status|evolve|reset>');
    console.log('');
    console.log('Commands:');
    console.log('  init TICKET-ID [risk]  Phase初期化（risk: strict/standard/light）');
    console.log('  advance                次のPhaseに遷移');
    console.log('  check                  遷移条件の確認');
    console.log('  status                 現在の状態表示');
    console.log('  evolve "reason"        Design Evolution（qa-planningに戻る）');
    console.log('  reset                  状態リセット');
    process.exit(1);
}
