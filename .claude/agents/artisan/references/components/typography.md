# Typography

## Overview

| 項目 | 値 |
|------|-----|
| Name | Typography |
| Description | テキスト表示コンポーネント |
| Figma Source | Luna DS v3 / Typography |
| Layer | Atom |
| Category | Content |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Variant | h1, h2, h3, h4, p, small, muted, lead |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| variant | `h1` \| `h2` \| `h3` \| `h4` \| `p` \| `small` \| `muted` \| `lead` | `p` | テキストバリアント |
| as | `ElementType` | variant に対応するタグ | レンダリングする HTML 要素 |
| className | `string` | — | 追加クラス |
| children | `ReactNode` | — | テキストコンテンツ |

---

## Token Mapping

### Font Family

全バリアント共通: `Noto Sans JP` (`--font-family`)

### Variant Specifications

| Variant | HTML Tag | Font Size | Font Weight | Line Height | Color Token | Color Value |
|---------|----------|-----------|-------------|-------------|-------------|-------------|
| h1 | `h1` | `font-size-2xl` (32px) | `font-weight-bold` (700) | 1.25 (40px) | `text-default` | `#27272A` |
| h2 | `h2` | `font-size-xl` (24px) | `font-weight-bold` (700) | 1.33 (32px) | `text-default` | `#27272A` |
| h3 | `h3` | `font-size-lg` (16px) | `font-weight-bold` (700) | 1.5 (24px) | `text-default` | `#27272A` |
| h4 | `h4` | `font-size-md` (14px) | `font-weight-bold` (700) | 1.43 (20px) | `text-default` | `#27272A` |
| p | `p` | `font-size-md` (14px) | `font-weight-regular` (400) | 1.71 (24px) | `text-default` | `#27272A` |
| small | `small` | `font-size-sm` (12px) | `font-weight-regular` (400) | 1.5 (18px) | `text-default` | `#27272A` |
| muted | `p` | `font-size-sm` (12px) | `font-weight-regular` (400) | 1.5 (18px) | `text-secondary` | `#777681` |
| lead | `p` | `font-size-lg` (16px) | `font-weight-regular` (400) | 1.75 (28px) | `text-secondary` | `#777681` |

### Figma Text Style Mapping

| Variant | Figma Style |
|---------|------------|
| h1 | `Heading/lg` |
| h2 | `Heading/md` |
| h3 | `Heading/sm` |
| h4 | `Body/md-bold` |
| p | `Body/md-default` |
| small | `Body/sm-default` |
| muted | `Body/sm-default` + `text-secondary` |
| lead | `Body/lg-default` + `text-secondary` |

---

## Spacing

### Margin (default)

| Variant | margin-bottom |
|---------|--------------|
| h1 | `space-2xl` (32px) |
| h2 | `space-xl` (24px) |
| h3 | `space-lg` (16px) |
| h4 | `space-md` (12px) |
| p | `space-lg` (16px) |
| small | `space-sm` (8px) |
| muted | `space-sm` (8px) |
| lead | `space-lg` (16px) |

**Note:** 最後の要素（`:last-child`）では margin-bottom: 0。

---

## States

Typography は静的コンポーネント。インタラクティブ状態は持たない。

| State | Visual Change |
|-------|--------------|
| Default | variant に応じたスタイル |

---

## Accessibility

### Semantic HTML

| Variant | Default Tag | Purpose |
|---------|-------------|---------|
| h1 | `<h1>` | ページタイトル（1ページ1つ） |
| h2 | `<h2>` | セクション見出し |
| h3 | `<h3>` | サブセクション見出し |
| h4 | `<h4>` | 小見出し |
| p | `<p>` | 本文 |
| small | `<small>` | 注釈・補足テキスト |
| muted | `<p>` | 二次的な情報 |
| lead | `<p>` | リード文 |

### Guidelines

- 見出しレベルはスキップしない（h1 → h3 は NG、h1 → h2 → h3）
- `as` prop で視覚とセマンティクスを分離可能（例: h2 の見た目で h3 タグ）
- カラーコントラスト: `text-default` on `bg-default` → 12.6:1、`text-secondary` on `bg-default` → 4.6:1（AA 準拠）

---

## Usage Examples

### ページヘッダー

```tsx
<Typography variant="h1">ダッシュボード</Typography>
<Typography variant="lead">本日の概要を確認できます</Typography>
```

### セクション

```tsx
<Typography variant="h2">最近のアクティビティ</Typography>
<Typography variant="p">直近7日間のデータを表示しています。</Typography>
<Typography variant="muted">最終更新: 2026-04-06 10:00</Typography>
```

---

## Do / Don't

### Do
- 見出し階層を正しく使用する（h1 → h2 → h3）
- `as` prop でセマンティクスと視覚を適切に分離する
- 長文テキストには `p` variant を使用する

### Don't
- h1 を 1 ページに複数配置しない
- 見出しレベルをスキップしない
- 装飾目的で見出しタグを使わない（`as` prop で調整）
- `text-secondary` を本文テキストに使わない（補足情報のみ）

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Typography | テキストの構造化表示 | インタラクティブテキスト |
| Button | テキスト + アクション | 静的テキスト表示 |
