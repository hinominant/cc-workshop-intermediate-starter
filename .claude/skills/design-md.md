---
name: design-md
description: Figma/既存サイトから DESIGN.md または DESIGN_HARNESS.md を生成するスキル。classic モード (Google Stitch 準拠) と harness モード (4 層 Design Harness) の 2 系統に対応
model: sonnet
effort: medium
---

# Design MD Skill

## Purpose

Figma デザインまたは既存 URL からデザインシステムを抽出し、エージェントが参照可能な以下のいずれかを生成する:
- **classic モード** (デフォルト): `.agents/DESIGN.md` (Google Stitch フォーマット準拠)
- **harness モード**: プロジェクトルート/`DESIGN_HARNESS.md` (4 層 Design Harness 構造、`_templates/DESIGN_HARNESS.md` 雛形ベース)

mode は引数 `mode: "classic" | "harness"` で切替。未指定時は classic。

## トリガー条件

- 新プロジェクトのフロントエンド実装開始時
- `/frontend-design` コマンド実行時
- Figma デザインが更新された時
- DESIGN.md が存在しないプロジェクトで UI 実装が必要な時

## 入力ソース（優先順）

1. **Figma MCP** — `get_variable_defs` でデザイントークンを抽出（推奨）
2. **既存 URL** — サイトの CSS/HTML を解析してトークンを逆算
3. **手動指定** — ユーザーが色・フォント等を直接指定
4. **Lunaベーステンプレート** — `_templates/DESIGN_LUNA.md` を起点にプロジェクト固有化

## セキュリティ原則（ARIS-768）

### 禁止事項
- **他ブランドのDESIGN.mdをそのままコピー** — Stripe/Apple/Airbnb等のインスパイア集（awesome-design-md等）は「構造参考」としてのみ使用
- **npx/curl経由のインストール** — `npx getdesign@latest add {brand}` はサプライチェーン攻撃の侵入口
- **外部リンクを許可リスト外に含める** — DESIGN.md はAIが必ず読むファイル。トラッカー埋込リスク

### 推奨
- Luna独自のDESIGN.mdをゼロから作成（`_templates/DESIGN_LUNA.md` を起点）
- 外部ブランドは構造のみ参考（GitHub閲覧、実行しない）
- `design-md-sanity-check.js` hookで自動検証（プロンプトインジェクション検出）

### 参考リソース（構造のみ、コピー禁止）
- [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) — 66ブランドの構造カタログ
- [Google Stitch DESIGN.md](https://stitch.withgoogle.com/docs/design-md/overview/) — 公式仕様

## 生成手順

### Step 1: デザイントークン収集

**Figma MCP 経由の場合:**
```
1. Figma MCP の get_variable_defs でプロジェクトの Variables を取得
2. Color / Typography / Spacing / Border Radius / Shadow を分類
3. コンポーネントパターン（Button, Card, Input 等）のスタイルを記録
```

**URL 解析の場合:**
```
1. Browser Use CLI でサイトにアクセス
2. browser-use eval でコンピューテッドスタイルを抽出:
   - document.querySelectorAll('*') から使用色・フォント・スペーシングを集計
3. 頻出値をデザイントークンとして整理
```

### Step 2: セマンティック変換

技術値を自然言語に翻訳する:

| 技術値 | セマンティック記述 |
|--------|-------------------|
| `#1a1a2e` | Deep Midnight — メインテキスト色。落ち着いた知的な印象 |
| `font-size: 48px; font-weight: 700` | Hero見出し。力強く、ページの主張を一言で伝える |
| `border-radius: 9999px` | Pill-shaped（完全丸角）。フレンドリーで柔らかい印象 |
| `gap: 24px` | Comfortable spacing。要素間に十分な呼吸感を持たせる |

### Step 3: DESIGN.md 出力

以下のフォーマットで `.agents/DESIGN.md` に出力する:

```markdown
# DESIGN.md

## Visual Theme
[プロジェクト全体の雰囲気を2-3行で記述]
例: "Airy and modern. 広い余白と控えめな色使いで、プロフェッショナルだが親しみやすい印象。"

## Color Palette

### Primary Colors
- **Brand Blue** (#2563eb) — 信頼と行動を促すCTA色。ボタン・リンク・アクティブ要素に使用
- **Brand Dark** (#1e293b) — メインテキスト。視認性と知的さを両立

### Neutral Scale
- **Surface** (#ffffff) — メイン背景
- **Muted** (#f8fafc) — カード背景・セクション区切り
- **Border** (#e2e8f0) — 区切り線・入力フィールド枠
- **Subtle Text** (#94a3b8) — プレースホルダー・補助テキスト

### Semantic Colors
- **Success** (#16a34a) — 完了・成功状態
- **Warning** (#d97706) — 注意喚起
- **Error** (#dc2626) — エラー・破壊的操作
- **Info** (#2563eb) — 情報提供（Brand Blue と共用可）

## Typography

### Font Family
- **Headings**: Inter / Noto Sans JP — クリーンで幾何学的
- **Body**: Inter / Noto Sans JP — 同一ファミリーで統一感

### Scale
- **Display** (48px/3rem, weight: 700, tracking: -0.02em) — ヒーローセクション
- **H1** (36px/2.25rem, weight: 700, tracking: -0.01em) — ページタイトル
- **H2** (24px/1.5rem, weight: 600) — セクション見出し
- **H3** (20px/1.25rem, weight: 600) — サブセクション
- **Body** (16px/1rem, weight: 400, line-height: 1.6) — 本文
- **Caption** (14px/0.875rem, weight: 400, color: Subtle Text) — 補助テキスト
- **Small** (12px/0.75rem, weight: 500) — バッジ・ラベル

## Spacing

### Base Unit: 4px
- **xs**: 4px — アイコンとテキストの間隔
- **sm**: 8px — 関連要素間の最小間隔
- **md**: 16px — コンポーネント内パディング
- **lg**: 24px — コンポーネント間の間隔
- **xl**: 32px — セクション内の大きな区切り
- **2xl**: 48px — セクション間の間隔
- **3xl**: 64px — ページセクション間

## Geometry

### Border Radius
- **None** (0px) — テーブル・フルブリード画像
- **Small** (4px) — Input・Badge
- **Medium** (8px) — Card・Dialog
- **Large** (12px) — 大きなパネル
- **Full** (9999px) — Pill Button・Avatar

### Shadows
- **Subtle** (0 1px 2px rgba(0,0,0,0.05)) — カードのデフォルト
- **Medium** (0 4px 6px rgba(0,0,0,0.07)) — ホバー時・ドロップダウン
- **Large** (0 10px 15px rgba(0,0,0,0.1)) — モーダル・ポップオーバー

## Component Patterns

### Buttons
- **Primary**: Brand Blue 背景、白テキスト、Medium radius、hover で少し暗く
- **Secondary**: 白背景、Brand Blue テキスト、Border あり
- **Destructive**: Error 色背景、慎重な操作用
- **Ghost**: 背景なし、hover で Muted 背景

### Cards
- Surface 背景、Border 枠線、Medium radius、Subtle shadow
- hover 時に Medium shadow へトランジション (200ms ease-out)

### Inputs
- 高さ 40px、md パディング、Small radius、Border 枠線
- focus 時に Brand Blue ring (2px)
- placeholder は Subtle Text 色
```

## Dry-Run Mode

`--dry-run` 指定時はファイル書き込みを行わず、以下のみ出力する:
- 入力ソース（Figma / URL / 手動）
- 抽出予定のトークン数
- DESIGN.md のプレビュー（最初の20行）

```
[DRY-RUN] design-md: source=figma, tokens=42 (colors:12, typography:7, spacing:8, radius:5, shadow:3, components:7)
```

## 配置先

- `.agents/DESIGN.md` — プロジェクトのデザインシステム定義
- DESIGN.md は `.agents/PROJECT.md` と同列に配置し、全フロントエンドエージェントが参照

---

# Harness Mode (新規)

`mode: "harness"` 指定時の生成手順。Design Harness Initiative (Spec: `docs/designs/DESIGN_HARNESS_INITIATIVE_SPEC.md`) の 4 層構造で `DESIGN_HARNESS.md` を生成する。

## When to use

- 新規プロジェクトで Design Harness を導入
- 既存プロジェクトで「数字インパクト消失」「結論刺さらない」「スマホ崩れ」が頻発
- スライド学習 / プレゼン / マーケ LP のように「視覚密度」が重要なプロジェクト
- 4 層 (制約 / コンテキスト / 検証 / フィードバック) の自動化を有効化したい

## Inputs

| 項目 | 必須 | 既定値 |
|---|---|---|
| `mode` | yes | `"harness"` |
| 既存 DESIGN.md (あれば) パス | no | `.agents/DESIGN.md` |
| プロジェクトのスライド学習有無 | yes | `slides: true | false` |
| Figma MCP / 既存 URL | no | classic と同じソース |
| プロジェクトの README / package.json パス | no | `<root>/README.md`, `<root>/package.json` |
| 必須ロール (該当時) | no | プロジェクトで定義 |

## Generation Steps (Harness mode)

### Step H1: 雛形読み込み
- `_templates/DESIGN_HARNESS.md` を雛形として読み込む
- 13 セクション + 68 `<TBD>` プレースホルダの構造を把握

### Step H2: `<TBD>` を埋める

| 領域 | ソース | 手順 |
|---|---|---|
| 色 / フォント / スペース | Figma MCP or URL 解析 | classic Step 1 と同じ |
| Voice & Tone | README + package.json description 推定 + user 確認 | プロジェクトの target audience を要約 |
| ペルソナ | user 入力 | 3-5 名、各 200 字程度 |
| Slide kind 選択 | `_common/SLIDE_KIND_CATALOG.md` から user に提案 | プロジェクトの slides 有無 / 用途で 8-12 種から選択 |
| 検証ルール | DESIGN_HARNESS.md §10.1 デフォルト 10 ルール | プロジェクト固有閾値 (枚数 / 多様性 / 字数) を user 確認 |
| 競合差別化軸 | user 入力 | 5 軸 |
| 学術出典 | user 入力 (該当時) | 学習系プロジェクトのみ |

### Step H3: 既存 DESIGN.md がある場合の統合
- 既存 DESIGN.md の Color / Typography / Component を `_templates/DESIGN_HARNESS.md` の §2 / §3 / §4 に流用
- 重複定義は新規 `DESIGN_HARNESS.md` に統合し、旧 `.agents/DESIGN.md` は legacy 扱いで残す (互換性維持)
- 段階移行: Phase 1 で classic + harness 共存、Phase 2 で classic を archive

### Step H4: 関連 skill の案内
生成完了後、user に「次のステップ」を案内:

```
DESIGN_HARNESS.md 生成完了。次のステップ:

1. Layer 3 段階 1 (Vitest 検証) を立ち上げる:
   /design-harness-vitest を実行 → tests/unit/design-harness/slide-rules.test.ts 生成

2. Layer 3 段階 2 (Playwright snapshot) を立ち上げる:
   /design-harness-playwright を実行 → e2e/design-harness/slide-snapshots.spec.ts 生成

3. メソドロジー全体像を把握:
   _common/DESIGN_HARNESS_METHODOLOGY.md を読む

4. Layer 4 (フィードバック) を有効化:
   log-failure / log-success skill を Slide 関連 PR で呼ぶ運用を開始
```

## Outputs (Harness mode)

- `<root>/DESIGN_HARNESS.md` (新規 or 更新)
- 既存 `.agents/DESIGN.md` がある場合: 共存 (用途別、両方読める形)
- `_common/DESIGN_HARNESS_METHODOLOGY.md` への参照リンク

## Dry-Run Mode (Harness)

```
[DRY-RUN] design-md (harness): tokens=42, persona=3, kinds=8 (title/chat/compare/stat/vs/timeline/bigConclusion/exercise-cta)
  -> DESIGN_HARNESS.md (約 450 行 / 13 セクション / 68 -> 0 TBD)
  -> 関連 skill 提案: /design-harness-vitest, /design-harness-playwright
```

## Mode 切替判断

| プロジェクト特性 | 推奨 mode |
|---|---|
| 通常の Web プロダクト (LP / SaaS UI) | `classic` |
| スライド学習 / プレゼン / 教育コンテンツ | `harness` |
| 既存 DESIGN.md があり Voice / Components 中心 | `classic` |
| 既存 DESIGN.md がなく 4 層構造で立ち上げたい | `harness` |
| Anthropic / OpenAI Harness Engineering 流の運用に乗せたい | `harness` |

## 関連 skill

- `design-harness-vitest` — DESIGN_HARNESS.md §10.1 を読んで Vitest 検証ファイル生成
- `design-harness-playwright` — DESIGN_HARNESS.md §10.2 を読んで Playwright snapshot 検証生成

## 配置先 (Harness mode)

- スキル本体: 本ファイル (`.claude/skills/design-md.md` / orchestrator)
- 生成: 各プロジェクトの `<root>/DESIGN_HARNESS.md`
- 参考: `_templates/DESIGN_HARNESS.md` (雛形)
- 参考: `_common/DESIGN_HARNESS_METHODOLOGY.md` (4 層メソドロジー)
- 参考: `_common/SLIDE_KIND_CATALOG.md` (12 種 + 4 primitives)
