---
name: react-components
description: デザインからReactコンポーネントシステムへの変換スキル。DESIGN.mdに準拠したモジュール化・型安全なコンポーネントを生成する
model: sonnet
effort: medium
---

# React Components Skill

## Purpose

DESIGN.md + Figma デザインから、本番品質の React コンポーネントシステムを生成する。
型安全・アクセシブル・DESIGN.md 準拠のコンポーネントを構造化して出力する。

## 前提条件

- `.agents/DESIGN.md` が存在すること（なければ `design-md` スキルで先に生成）
- React 18+ / TypeScript / Tailwind CSS 環境

## 変換手順

### Step 1: DESIGN.md 読み込み

DESIGN.md から以下を抽出:
- Color Palette → Tailwind theme extend に変換
- Typography Scale → テキストユーティリティクラスに変換
- Spacing → Tailwind spacing に変換
- Component Patterns → コンポーネント実装の基盤

### Step 2: Tailwind 設定生成

```typescript
// tailwind.config.ts — DESIGN.md から自動生成
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563eb',    // DESIGN.md: Brand Blue
          dark: '#1e293b',    // DESIGN.md: Brand Dark
        },
        surface: '#ffffff',
        muted: '#f8fafc',
      },
      fontSize: {
        display: ['3rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }],
        h1: ['2.25rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.01em' }],
        h2: ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        body: ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        caption: ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        pill: '9999px',
      },
    },
  },
};
```

### Step 3: コンポーネント生成

各コンポーネントは以下のアーキテクチャに従う:

```
src/components/
├── ui/                    # 基本UIコンポーネント
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── index.ts
├── patterns/              # 複合パターン（複数UIコンポーネントの組み合わせ）
│   ├── SearchFilter.tsx
│   ├── DataTable.tsx
│   └── FormWizard.tsx
└── layouts/               # レイアウトコンポーネント
    ├── PageLayout.tsx
    └── SidebarLayout.tsx
```

### Step 4: コンポーネントテンプレート

```typescript
// 全コンポーネント共通の構造
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  readonly variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  readonly size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // DESIGN.md: Buttons セクションの値を使用
          'inline-flex items-center justify-center font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variant styles from DESIGN.md
          variant === 'primary' && 'bg-brand-blue text-white hover:bg-brand-blue/90',
          variant === 'secondary' && 'border border-border bg-white text-brand-blue hover:bg-muted',
          variant === 'destructive' && 'bg-red-600 text-white hover:bg-red-600/90',
          variant === 'ghost' && 'hover:bg-muted',
          // Size from DESIGN.md Spacing
          size === 'sm' && 'h-8 px-3 text-caption rounded-sm',
          size === 'md' && 'h-10 px-4 text-body rounded-md',
          size === 'lg' && 'h-12 px-6 text-body rounded-md',
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
```

### Step 5: 検証

- TypeScript 型チェック通過
- DESIGN.md のトークンからの逸脱がないか確認
- アクセシビリティ（キーボード操作・スクリーンリーダー対応）
- ライト/ダークモード対応（DESIGN.md にダーク定義がある場合）

## 出力ルール

| ルール | 詳細 |
|--------|------|
| **Readonly interface** | 全コンポーネントに `Readonly<Props>` を使用 |
| **forwardRef** | DOM要素を返すコンポーネントは必ず forwardRef |
| **cn() 使用** | クラス結合は必ず `cn()` ユーティリティ経由 |
| **DESIGN.md 値のみ** | ハードコード色・サイズ禁止。Tailwind テーマ値を使用 |
| **データ分離** | 静的テキスト・URLは `src/data/` に分離 |
| **Hooks 分離** | イベントハンドラは `src/hooks/` にカスタムフックとして分離 |

## Dry-Run Mode

`--dry-run` 指定時はファイル生成を行わず、以下のみ出力する:
- DESIGN.md から抽出したトークン数
- 生成予定のコンポーネント一覧
- Tailwind 設定のプレビュー

```
[DRY-RUN] react-components: tokens=42, components=[Button,Card,Input,Dialog,Table], tailwind_config=preview
```
