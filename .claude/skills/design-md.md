---
name: design-md
description: Figma/既存サイトからDESIGN.mdを生成するスキル。デザインシステムをエージェント向け自然言語マークダウンに変換する
model: sonnet
effort: medium
---

# Design MD Skill

## Purpose

Figma デザインまたは既存 URL からデザインシステムを抽出し、エージェントが参照可能な `DESIGN.md` ファイルを生成する。
Google Stitch の DESIGN.md フォーマットに準拠。

## トリガー条件

- 新プロジェクトのフロントエンド実装開始時
- `/frontend-design` コマンド実行時
- Figma デザインが更新された時
- DESIGN.md が存在しないプロジェクトで UI 実装が必要な時

## 入力ソース（優先順）

1. **Figma MCP** — `get_variable_defs` でデザイントークンを抽出（推奨）
2. **既存 URL** — サイトの CSS/HTML を解析してトークンを逆算
3. **手動指定** — ユーザーが色・フォント等を直接指定

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
