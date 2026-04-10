#!/usr/bin/env node
'use strict';

/**
 * OGSM Gate — PreToolUse Hook (ARIS-328 Phase 1A)
 *
 * 対象タスク（売上計算/セキュリティ/エピック/売上直結施策）で
 * .context/ogsm.md が存在し、4セクション（O/G/S/M）が揃っていなければ
 * コード変更をブロックする。
 *
 * 設計方針:
 * - fail-open: JSONパースエラー/チケット未設定 → approve
 * - 読み取り系は止めない（Read/Grep/Glob/WebSearch/WebFetch/Agent/TaskList/TaskGet）
 * - .context/ 操作は常に許可（デッドロック防止）
 * - .claude/ 操作は許可（ask_userはdebug-guardの責務）
 * - .md/.txt ファイルは許可（ドキュメント）
 * - git commit/push はブロックしない（commit-gateの責務）
 *
 * Install: .claude/hooks/ogsm-gate.js
 * Settings: .claude/settings.json の hooks.PreToolUse に登録
 */

const fs = require('fs');
const path = require('path');

// === 除外ツール（無条件approve） ===
const EXCLUDED_TOOLS = new Set([
  'Read', 'Grep', 'Glob', 'WebSearch', 'WebFetch',
  'Agent', 'TaskList', 'TaskGet',
]);

// === キーワードリスト ===
const CATEGORY_KEYWORDS = {
  revenue: [
    '売上', 'revenue', '収益', 'MRR', 'ARR', 'LTV', 'ARPU',
    'GMV', 'gross_amount', 'net_amount', '課金', 'billing',
    '請求', 'invoice', '金額計算', 'price', 'pricing',
    '集計', 'aggregat', '合計', 'total', 'sum',
    '数字', 'おかしい', 'ズレ', '違う', '間違',
  ],
  security: [
    'セキュリティ', 'security', '認証', 'auth', 'token',
    '暗号', 'encrypt', 'decrypt', '脆弱性', 'vulnerability',
    'CVE', 'OWASP', 'injection', 'XSS', 'CSRF',
    'アクセス制御', 'access control', 'permission',
    'secret', 'credential', 'API key',
  ],
  epic: [
    'epic', 'エピック', 'フェーズ', 'phase',
    'マイルストーン', 'milestone', 'リリース', 'release',
    'ローンチ', 'launch', 'MVP', 'v1', 'v2',
    '新機能', 'new feature', '大規模', '全面改修',
  ],
  salesImpact: [
    'コンバージョン', 'conversion', 'CVR', 'CTR',
    'ファネル', 'funnel', 'チャーン', 'churn',
    'リテンション', 'retention', 'アップセル', 'upsell',
    'プラン変更', 'plan change', '決済', 'payment',
    'Stripe', 'サブスク', 'subscription',
    'オンボーディング', 'onboarding',
    'KPI', 'OKR',
  ],
  // LROS/NOVA/ARISリポジトリ関連は全て対象
  coreRepo: [
    'lros', 'nova', 'aris',
    'paidy', 'credix',
    'prediction', 'forecast', 'metrics',
  ],
};

// === OGSMセクション検証パターン ===
const OGSM_SECTIONS = {
  objective:    /^##?\s*Objective/im,
  causalChain:  /^##?\s*Causal\s*Chain/im,
  goals:        /^##?\s*Goals?/im,
  strategies:   /^##?\s*Strateg(?:y|ies)/im,
  measures:     /^##?\s*Measures?/im,
};

// === 読み取り系Bashコマンド ===
const READ_ONLY_BASH_RE = /^\s*(ls|cat|head|tail|grep|rg|find|wc|diff|file|stat|pwd|whoami|which|env|echo|printf)\b/;
const PROCESS_BASH_RE = /^\s*(ps|lsof|pgrep|top|du|df|netstat)\b/;
const GIT_READ_RE = /^\s*git\s+(status|log|diff|show|branch|remote|stash\s+list)\b/;
const GH_READ_RE = /^\s*gh\s+(issue|pr)\s+(view|list|search)\b/;
const TEST_RE = /^\s*(uv\s+run\s+pytest|npm\s+test|go\s+test)\b/;
const NON_DESTRUCTIVE_RE = /^\s*(mkdir|touch|sleep|wait)\b/;
const SCRIPTS_RE = /^\s*python3?\s+scripts\/(check-impact\.py|workstate\.py)\b/;

// === 状態変更系Bashコマンド ===
const STATE_CHANGING_PATTERNS = [
  /\bsed\s.*-i/,
  /\btee\b/,
  />\s*\S/,
  /\bnpm\s+install\b/,
  /\bpip\s+install\b/,
  /\bbrew\s+install\b/,
  /\bkill\b/,
  /\bpkill\b/,
  /\bkillall\b/,
  /\bchmod\b/,
  /\bchown\b/,
  /\bsudo\b/,
  /\blaunchctl\s+(unload|load|remove|bootout|bootstrap|kickstart|disable|enable)\b/,
  /\bsystemctl\s+(start|stop|restart|enable|disable)\b/,
  /\brm\s/,
  /\bmv\s/,
  /\bcp\s/,
];

// === チケット存在チェック ===
function hasTicket() {
  const ticketPath = path.join(process.cwd(), '.context', 'current_ticket.json');
  return fs.existsSync(ticketPath);
}

// === 対象タスク判定 ===
function isTargetTask() {
  try {
    const ticketPath = path.join(process.cwd(), '.context', 'current_ticket.json');
    if (!fs.existsSync(ticketPath)) return { noTicket: true, matched: false };

    const raw = fs.readFileSync(ticketPath, 'utf8');
    const ticket = JSON.parse(raw);

    const title = ticket.title || '';
    const description = ticket.description || '';
    const labels = Array.isArray(ticket.labels) ? ticket.labels.join(' ') : '';
    const searchText = (title + ' ' + description + ' ' + labels).toLowerCase();

    for (const category of Object.keys(CATEGORY_KEYWORDS)) {
      for (const keyword of CATEGORY_KEYWORDS[category]) {
        if (searchText.includes(keyword.toLowerCase())) {
          return { noTicket: false, matched: true, category, keyword, title };
        }
      }
    }

    return { noTicket: false, matched: false };
  } catch (_e) {
    return { noTicket: true, matched: false };
  }
}

// === セクション本文抽出 ===
function extractSectionBody(content, headingIndex) {
  const lineEnd = content.indexOf('\n', headingIndex);
  if (lineEnd === -1) return '';

  const rest = content.substring(lineEnd + 1);
  const nextHeading = rest.match(/^##?\s/m);
  const body = nextHeading ? rest.substring(0, nextHeading.index) : rest;

  return body.replace(/^\s*$/gm, '').trim();
}

// === OGSM バリデーション ===
function validateOgsm() {
  try {
    const ogsmPath = path.join(process.cwd(), '.context', 'ogsm.md');
    if (!fs.existsSync(ogsmPath)) {
      return { valid: false, reason: 'ogsm.md が存在しません' };
    }

    const content = fs.readFileSync(ogsmPath, 'utf8');
    if (content.trim().length === 0) {
      return { valid: false, reason: 'ogsm.md が空です' };
    }

    const missing = [];
    for (const [name, pattern] of Object.entries(OGSM_SECTIONS)) {
      if (!pattern.test(content)) {
        missing.push(name);
      }
    }

    if (missing.length > 0) {
      return { valid: false, reason: '不足セクション: ' + missing.join(', ') };
    }

    const emptyBodies = [];
    for (const [name, pattern] of Object.entries(OGSM_SECTIONS)) {
      const match = content.match(pattern);
      if (match) {
        const body = extractSectionBody(content, match.index);
        if (body.length === 0) {
          emptyBodies.push(name + '(空)');
        }
      }
    }

    if (emptyBodies.length > 0) {
      return { valid: false, reason: 'セクション本文なし: ' + emptyBodies.join(', ') };
    }

    // Causal Chain: 「→」が3つ以上あるか（因果連鎖3段以上）
    const ccPattern = /^##?\s*Causal\s*Chain/im;
    const ccMatch = content.match(ccPattern);
    if (ccMatch) {
      const ccBody = extractSectionBody(content, ccMatch.index);
      const arrowCount = (ccBody.match(/→/g) || []).length;
      if (arrowCount < 3) {
        return { valid: false, reason: 'Causal Chain: 因果連鎖が3段以上必要です（現在: ' + arrowCount + '段）' };
      }
    }

    // Measures: 各チェックボックスに「検証:」が含まれているか (TST-011対策)
    const measuresPattern = /^##?\s*Measures?/im;
    const measuresMatch = content.match(measuresPattern);
    if (measuresMatch) {
      const measuresBody = extractSectionBody(content, measuresMatch.index);
      const lines = measuresBody.split('\n');
      // チェックボックス行を取得
      const checkboxLines = [];
      for (let i = 0; i < lines.length; i++) {
        if (/^\s*[-*]\s+\[[ xX]\]/.test(lines[i])) {
          // 次の行に「検証:」があるかも確認
          const nextLine = (i + 1 < lines.length) ? lines[i + 1] : '';
          const combined = lines[i] + ' ' + nextLine;
          if (!/検証[:：]/.test(combined)) {
            checkboxLines.push(lines[i].trim());
          }
        }
      }
      if (checkboxLines.length > 0) {
        const examples = checkboxLines.slice(0, 2).map(l => '  ' + l).join('\n');
        return {
          valid: false,
          reason: `Measures に検証方法が未記載（${checkboxLines.length}件）。\n各Measureの直後の行に「検証: 〇〇で確認」を追加してください。\n${examples}`
        };
      }
    }

    return { valid: true };
  } catch (_e) {
    return { valid: true };
  }
}

// === ファイルパス除外判定 ===
function isExcludedPath(filePath) {
  if (!filePath) return false;
  if (filePath.includes('.context/')) return true;
  if (filePath.includes('.claude/hooks/')) return true;
  if (filePath.includes('.claude/skills/')) return true;
  if (filePath.includes('.claude/settings')) return true;
  if (filePath.includes('.claude/RESUME_CONTEXT')) return true;
  if (/CLAUDE\.md$/i.test(filePath)) return true;
  if (/\.md$/i.test(filePath)) return true;
  if (/\.txt$/i.test(filePath)) return true;
  return false;
}

// === Bashコマンド除外判定 ===
function isExcludedBash(cmd) {
  if (!cmd) return true;
  // 修正3: パストラバーサル防止。.context/../ を含む場合は除外しない
  if (/\.context\//.test(cmd) && !/\.context\/\.\./.test(cmd)) return true;
  // パイプ等で状態変更パターンを含む場合は除外しない（例: cat x | tee y）
  if (isStateChangingBash(cmd)) return false;
  if (READ_ONLY_BASH_RE.test(cmd)) return true;
  if (PROCESS_BASH_RE.test(cmd)) return true;
  if (GIT_READ_RE.test(cmd)) return true;
  if (GH_READ_RE.test(cmd)) return true;
  if (TEST_RE.test(cmd)) return true;
  if (NON_DESTRUCTIVE_RE.test(cmd)) return true;
  if (SCRIPTS_RE.test(cmd)) return true;
  if (/^\s*git\s+(commit|push)\b/.test(cmd)) return true;
  return false;
}

// === Bash状態変更判定 ===
function isStateChangingBash(cmd) {
  return STATE_CHANGING_PATTERNS.some(function(p) { return p.test(cmd); });
}

// === ブロックメッセージ生成 ===
function buildBlockMessage(taskResult, validation) {
  return [
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '📋 OGSM GATE: コード変更をブロック',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '対象タスク: ' + (taskResult.title || '(unknown)'),
    'カテゴリ:   ' + taskResult.category + ' (キーワード: ' + taskResult.keyword + ')',
    '理由:       ' + validation.reason,
    '',
    '対応:',
    '  .context/ogsm.md を作成し、以下の5セクションを記入してください:',
    '',
    '  ## Objective',
    '  このタスクで達成したいこと（Outcome＝結果を書く。Output＝作業を書かない）',
    '',
    '  ## Causal Chain',
    '  Objective達成から事業価値への因果連鎖（「→」で3段以上繋げる）',
    '  例: 〇〇が改善される → △△が可能になる → □□が向上する → Luna目標に貢献',
    '',
    '  ## Goals',
    '  具体的な目標（箇条書き）',
    '',
    '  ## Strategies',
    '  目標を達成するためのアプローチ（箇条書き）',
    '',
    '  ## Measures',
    '  成功の判定基準（定量的）',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  ].join('\n');
}

// === チケットなしブロックメッセージ ===
function buildNoTicketMessage() {
  return [
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '🎫 チケット必須: 作業をブロック',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'current_ticket.json が設定されていません。',
    '',
    '全ての作業にはLinearチケットが必要です。',
    '',
    '対応:',
    '  1. Linearでチケットを作成する',
    '  2. .context/current_ticket.json にチケット情報を設定する',
    '     {"title": "...", "identifier": "ARIS-XXX", "labels": [...]}',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  ].join('\n');
}

// === ゲート判定 ===
function checkGate() {
  const taskResult = isTargetTask();

  // チケットなし → ブロック（全作業にチケット必須）
  if (taskResult.noTicket) {
    return {
      decision: 'block',
      reason: buildNoTicketMessage(),
    };
  }

  // 対象外タスク → 通過
  if (!taskResult.matched) {
    return { decision: 'approve' };
  }

  // 対象タスク → OGSMチェック
  const validation = validateOgsm();
  if (validation.valid) {
    return { decision: 'approve' };
  }

  return {
    decision: 'block',
    reason: buildBlockMessage(taskResult, validation),
  };
}

// === メイン処理 ===
function main() {
  let input = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function(chunk) { input += chunk; });
  process.stdin.on('end', function() {
    try {
      const data = JSON.parse(input);
      const toolName = data.tool_name || '';
      const toolInput = data.tool_input || {};

      if (EXCLUDED_TOOLS.has(toolName)) {
        process.stdout.write(JSON.stringify({ decision: 'approve' }));
        return;
      }

      if (toolName === 'Edit' || toolName === 'Write') {
        const filePath = toolInput.file_path || '';
        if (isExcludedPath(filePath)) {
          process.stdout.write(JSON.stringify({ decision: 'approve' }));
          return;
        }
        var result = checkGate();
        process.stdout.write(JSON.stringify(result));
        return;
      }

      if (toolName === 'Bash') {
        const cmd = toolInput.command || '';
        if (isExcludedBash(cmd)) {
          process.stdout.write(JSON.stringify({ decision: 'approve' }));
          return;
        }
        // 修正1: ホワイトリスト方式。除外されないBashコマンドは全てゲート判定
        var result2 = checkGate();
        process.stdout.write(JSON.stringify(result2));
        return;
      }

      // 修正2: 未登録ツール（NotebookEdit等）もゲート判定
      var result3 = checkGate();
      process.stdout.write(JSON.stringify(result3));
    } catch (_e) {
      process.stdout.write(JSON.stringify({ decision: 'approve' }));
    }
  });
}

main();
