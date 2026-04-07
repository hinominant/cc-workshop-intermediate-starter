# Pagination

## Overview

| 項目 | 値 |
|------|-----|
| Name | Pagination |
| Description | 大量データを複数ページに分割して表示・ナビゲートするコンポーネント |
| Figma Source | Luna DS v3 / Pagination |
| Layer | Molecule |
| Category | Navigation |
| Status | Stable |

---

## Variants

### Anatomy

| # | Part | Required | Description |
|----|------|----------|-------------|
| 1 | Prev Button | Required | 前ページへ（無効化: 1ページ目） |
| 2 | Page Button | Required | ページ番号ボタン |
| 3 | Current Page | Required | 現在のページ（強調表示） |
| 4 | Ellipsis | Optional | 省略表示（ページ数が多い場合） |
| 5 | Last Page Group | Optional | 最後のページグループ |
| 6 | Next Button | Required | 次ページへ（無効化: 最終ページ） |

### 表示パターン（総ページ数別）

**7ページ以下:** 全ページを表示
```
[<] [1] [2] [3] [4] [5] [6] [7] [>]
```

**8ページ以上（中間）:**
```
[<] [1] [2] [...] [5] [6] [7] [...] [14] [15] [>]
```

**8ページ以上（先頭付近）:**
```
[<] [1] [2] [3] [4] [5] [...] [15] [>]
```

**8ページ以上（末尾付近）:**
```
[<] [1] [...] [11] [12] [13] [14] [15] [>]
```

### Size

| Size | Button Size | Font Size | Gap |
|------|------------|-----------|-----|
| sm | 28px x 28px | 12px | 2px |
| md | 36px x 36px | 14px | 4px |

### ページボタンスタイル

| State | Background | Text | Border |
|-------|-----------|------|--------|
| default | transparent | `text-default` | `border-default` |
| hover | `bg-tertiary` | `text-default` | `border-default` |
| current | `bg-emphasis` Brand/600 | `text-inverse` | none |
| disabled（prev/next） | transparent | `text-disabled` | `border-default` |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| totalPages | `number` | — | 総ページ数（必須） |
| currentPage | `number` | — | 現在のページ（1始まり、必須） |
| onPageChange | `(page: number) => void` | — | ページ変更コールバック（必須） |
| siblingCount | `number` | `1` | 省略なしで表示するページ数の境界 |
| boundaryCount | `number` | `1` | 両端に常に表示するページ数 |
| size | `'sm' \| 'md'` | `'md'` | サイズ |
| prevLabel | `string` | `'前のページ'` | 前ボタンのラベル（アクセシビリティ用） |
| nextLabel | `string` | `'次のページ'` | 次ボタンのラベル（アクセシビリティ用） |

---

## Token Mapping

| Element | Token | Value |
|---------|-------|-------|
| md ボタンサイズ | — | 36px |
| sm ボタンサイズ | — | 28px |
| 角丸 | `radius-sm` | 4px |
| 現在ページ背景 | `bg-emphasis` | `#5538EE` (Brand/600) |
| 現在ページテキスト | `text-inverse` | `#FFFFFF` (Black/0) |
| ボタン間隔 (md) | — | 4px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| page-hover | 背景色 `bg-tertiary` に変化 | — |
| page-focus | フォーカスリング表示 | — |
| page-current | `bg-emphasis` 背景、`text-inverse` テキスト | `aria-current="page"` |
| prev/next-disabled | opacity: 0.4, cursor: not-allowed | `aria-disabled="true"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `aria-label` | `"ページネーション"` | `<nav>` 要素 |
| `aria-current` | `"page"` | 現在のページボタン |
| `aria-label` | `"前のページ"` | Prevボタン |
| `aria-label` | `"次のページ"` | Nextボタン |
| `aria-label` | `"ページ {N}"` | 各ページボタン |
| `aria-disabled` | `"true"` | 無効化されたPrev/Nextボタン |
| `aria-hidden` | `"true"` | Ellipsis（`...`）要素 |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | ページボタンを順にフォーカス |
| `Enter` / `Space` | ページへ移動 |

---

## Do / Don't

### Do
- 総件数・表示範囲も合わせて表示する → 「1〜20件 / 全234件」
- URL に `?page=N` を反映する → ブックマーク・共有可能に
- ページ変更時はリスト先頭にスクロールする

### Don't
- 20件以下のデータにPaginationを使わない → 全件表示かInfinite Scrollを検討
- ページ数が多い場合に全ページボタンを表示しない → 省略（Ellipsis）を使う
- 現在ページの `<button>` を `disabled` にしない → `aria-current="page"` でマーク

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Pagination | 大量データのページ分割 | 20件以下のデータ |
| Table | テーブルとのセット使用 | — |
