#!/usr/bin/env node
'use strict';

/**
 * Frontend Design Gate — ARIS-815 (GAP-001 S12)
 *
 * フロントエンド/UI系ファイル変更時にDESIGN_LUNA.md参照を強制。
 *
 * 対象パス:
 *   - src/frontend/, src/components/, src/pages/, src/app/
 *   - *.tsx, *.jsx, *.vue
 *   - *.css, *.scss, *.module.css
 *
 * 要件:
 *   DESIGN_LUNA.md が存在する
 *   .context/design-referenced フラグ（過去1時間以内）
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

// フロントエンド系パス/拡張子
const isFrontendFile = (
  /\/(frontend|components|pages|app|ui|views)\//.test(filePath)
  || /\.(tsx|jsx|vue|svelte)$/.test(filePath)
  || /\.(css|scss|sass|less|module\.css)$/.test(filePath)
);

if (!isFrontendFile) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// テスト・ドキュメント除外
if (filePath.includes('/tests/') || filePath.includes('/docs/') || filePath.includes('.claude/')) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// DESIGN_LUNA.md の存在チェック
const designPaths = [
  path.join(process.cwd(), '_templates', 'DESIGN_LUNA.md'),
  path.join(process.cwd(), '.claude', 'DESIGN_LUNA.md'),
  path.join(process.cwd(), 'DESIGN_LUNA.md'),
  path.join(process.cwd(), 'DESIGN.md'),
];
const designExists = designPaths.some(p => fs.existsSync(p));

if (!designExists) {
  console.log(JSON.stringify({
    decision: 'ask_user',
    message: `🎨 Frontend Design Gate: DESIGN_LUNA.md が見つかりません。\n\n`
      + `UI実装前にLunaデザインシステムを配置してください:\n`
      + `  - _templates/DESIGN_LUNA.md (配布元)\n`
      + `  - .claude/DESIGN_LUNA.md (プロジェクト配置)\n\n`
      + `install.sh を再実行するとテンプレートから配布されます。`,
  }));
  process.exit(0);
}

// 参照フラグチェック（1時間以内）
const refFlag = path.join(process.cwd(), '.context', 'design-referenced');
let referenced = false;
try {
  const stat = fs.statSync(refFlag);
  const ageMs = Date.now() - stat.mtimeMs;
  if (ageMs < 60 * 60 * 1000) referenced = true;
} catch {}

if (referenced) {
  console.log(JSON.stringify({ decision: 'approve' }));
  process.exit(0);
}

// 未参照 → additionalContextで促し（blockはしない、過剰制約回避）
console.log(JSON.stringify({
  decision: 'approve',
  additionalContext: `🎨 Frontend Design Gate: UI/CSSファイルの変更を検知しました。\n\n`
    + `DESIGN_LUNA.md の参照を推奨:\n`
    + `  Read ツールで DESIGN_LUNA.md を確認してからUI実装を進めてください。\n`
    + `  確認後: touch .context/design-referenced でフラグ立て。\n\n`
    + `Luna デザインシステム原則:\n`
    + `  - 他ブランドミラー禁止\n`
    + `  - 和文優先タイポグラフィ\n`
    + `  - 控えめなシャドウとモーション\n`
    + `  - WCAG AA 以上のコントラスト`,
}));
