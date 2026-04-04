---
name: shadcn-ui
description: shadcn/uiコンポーネントの実装・カスタマイズガイダンススキル。DESIGN.mdのトークンをshadcnテーマに適用する
model: haiku
effort: low
---

# shadcn/ui Skill

## Purpose

shadcn/ui コンポーネントの選択・インストール・カスタマイズを支援する。
DESIGN.md のデザイントークンを shadcn/ui のテーマシステムに正確に反映する。

## shadcn/ui の原則

- コンポーネントライブラリではなく、**コードベースにコピーする再利用可能なコンポーネント集**
- Radix UI + Tailwind CSS ベース
- `components/ui/` にコンポーネントが配置され、自由にカスタマイズ可能

## セットアップ

### 新規プロジェクト
```bash
npx shadcn@latest create
```

### 既存プロジェクト
```bash
npx shadcn@latest init
```

### コンポーネント追加
```bash
npx shadcn@latest add button card input dialog table
```

## DESIGN.md → shadcn テーマ変換

DESIGN.md の値を `globals.css` の CSS 変数に反映する:

```css
/* DESIGN.md の Color Palette セクションから変換 */
:root {
  --background: 0 0% 100%;         /* Surface (#ffffff) */
  --foreground: 215 28% 17%;       /* Brand Dark (#1e293b) */
  --primary: 217 91% 60%;          /* Brand Blue (#2563eb) */
  --primary-foreground: 0 0% 100%; /* 白テキスト */
  --muted: 210 40% 98%;            /* Muted (#f8fafc) */
  --border: 214 32% 91%;           /* Border (#e2e8f0) */
  --destructive: 0 84% 60%;        /* Error (#dc2626) */
  --radius: 0.5rem;                /* Medium (8px) */
}
```

### 変換ルール

| DESIGN.md | shadcn CSS Variable | 変換方法 |
|-----------|--------------------| ---------|
| Color hex | HSL値 | hex → HSL に変換（スペース区切り） |
| Spacing px | Tailwind class | 4px=1, 8px=2, 16px=4, 24px=6 |
| Border Radius | --radius | Small=0.25rem, Medium=0.5rem, Large=0.75rem |
| Shadow | Tailwind shadow class | Subtle=shadow-sm, Medium=shadow-md, Large=shadow-lg |

## コンポーネント選択ガイド

| UI要件 | shadcn コンポーネント |
|--------|---------------------|
| フォーム | Input, Select, Checkbox, RadioGroup, Switch, Textarea |
| アクション | Button, DropdownMenu, ContextMenu |
| レイアウト | Card, Separator, Tabs, Accordion |
| フィードバック | Alert, Toast, Dialog, AlertDialog |
| データ表示 | Table, Badge, Avatar, Tooltip |
| ナビゲーション | NavigationMenu, Breadcrumb, Pagination |

## Dry-Run Mode

`--dry-run` 指定時は実行せず、以下のみ出力する:
- DESIGN.md からの変換対象トークン数
- 生成予定の CSS 変数一覧
- 推奨コンポーネント一覧

```
[DRY-RUN] shadcn-ui: design_tokens=42, css_vars=18, recommended_components=[button,card,input,dialog,table]
```
