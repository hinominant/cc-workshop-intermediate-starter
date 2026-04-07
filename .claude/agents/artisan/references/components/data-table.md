# DataTable

## Overview

| 項目 | 値 |
|------|-----|
| Name | DataTable |
| Description | ソート・フィルター・ページネーション付きの拡張テーブル |
| Figma Source | — (shadcn/ui + TanStack Table ベース、Luna DS v3 トークン適用) |
| Layer | Organism |
| Category | Data Display |
| Status | Draft |

---

## Variants

| Variant Axis | Values |
|--------------|--------|
| Density | default, compact |
| Striped | true, false |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| columns | `ColumnDef[]` | — | 列定義（必須） |
| data | `T[]` | — | データ配列（必須） |
| density | `"default" \| "compact"` | `"default"` | 行の高さ密度 |
| striped | `boolean` | `false` | 交互行の背景色 |
| sortable | `boolean` | `true` | ソート機能 |
| filterable | `boolean` | `false` | フィルター機能 |
| searchable | `boolean` | `false` | グローバル検索 |
| paginated | `boolean` | `true` | ページネーション |
| pageSize | `number` | `10` | 1ページの行数 |
| pageSizeOptions | `number[]` | `[10, 20, 50]` | ページサイズ選択肢 |
| selectable | `boolean` | `false` | 行選択 |
| onSelectionChange | `(rows: T[]) => void` | — | 選択変更コールバック |
| loading | `boolean` | `false` | ローディング状態 |
| emptyMessage | `string` | `"データがありません"` | 空テーブルメッセージ |

### ColumnDef (追加プロパティ)

| Property | Type | Description |
|----------|------|-------------|
| accessorKey | `string` | データキー |
| header | `string \| ReactNode` | ヘッダーラベル |
| cell | `(info) => ReactNode` | セル描画関数 |
| enableSorting | `boolean` | 列ソート可否 |
| enableFiltering | `boolean` | 列フィルター可否 |
| size | `number` | 列幅 (px) |
| align | `"left" \| "center" \| "right"` | テキスト揃え |

---

## Token Mapping

### Colors

| Element | Token | Value |
|---------|-------|-------|
| Table 背景 | `bg-default` | `#FFFFFF` (Black/0) |
| Header 背景 | `bg-tertiary` | `#F7F7F8` (Black/50) |
| Header テキスト | `text-default` | `#27272A` (Black/950) |
| Cell テキスト | `text-default` | `#27272A` (Black/950) |
| Cell secondary テキスト | `text-secondary` | `#777681` (Black/500) |
| Row ホバー背景 | `bg-interactive` | `#EFEEF0` (Black/100) |
| Row 選択背景 | `bg-secondary` | `#EDEFFF` (Brand/50) |
| Striped row 背景 | `bg-tertiary` | `#F7F7F8` (Black/50) |
| Border (行区切り) | `border-divider` | `#EFEEF0` (Black/100) |
| Border (外枠) | `border-default` | `#DADADD` (Black/200) |
| Sort アイコン (active) | `icon-default` | `#27272A` (Black/950) |
| Sort アイコン (inactive) | `icon-disabled` | `#DADADD` (Black/300) |
| Checkbox (checked) | `bg-emphasis` | `#5538EE` (Brand/600) |
| Pagination テキスト | `text-secondary` | `#777681` (Black/500) |
| Pagination active | `bg-emphasis` | `#5538EE` (Brand/600) |
| Loading overlay | — | `rgba(255, 255, 255, 0.7)` |
| Empty テキスト | `text-secondary` | `#777681` (Black/500) |

### Spacing

| Element | Token (default) | Token (compact) |
|---------|-----------------|-----------------|
| Header cell padding | `space-md` / `space-lg` | `space-sm` / `space-md` |
| Body cell padding | `space-md` / `space-lg` | `space-sm` / `space-md` |
| Toolbar padding | `space-lg` | `space-md` |
| Toolbar 要素間隔 | `space-sm` | `space-sm` |
| Pagination padding | `space-lg` | `space-md` |

### Size / Radius

| Element | Token | Value |
|---------|-------|-------|
| Container radius | `radius-sm` | 8px |
| Container border | `border-width-sm` | 1px |
| Row height (default) | — | 48px |
| Row height (compact) | — | 36px |
| Checkbox size | — | 16px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Default | テーブル表示 | `role="table"` |
| Sorted (asc) | ヘッダーに上向き矢印 | `aria-sort="ascending"` |
| Sorted (desc) | ヘッダーに下向き矢印 | `aria-sort="descending"` |
| Row Hover | 背景 `bg-interactive` | — |
| Row Selected | 背景 Brand/50、チェックボックスON | `aria-selected="true"` |
| Loading | オーバーレイ + スピナー | `aria-busy="true"` |
| Empty | 中央に空メッセージ | — |
| Filter Active | ツールバーにフィルター表示 | — |

---

## Accessibility

### ARIA

| Attribute | Element | Value |
|-----------|---------|-------|
| `role` | Table | `table` |
| `role` | Header row | `row` |
| `role` | Header cell | `columnheader` |
| `role` | Body row | `row` |
| `role` | Body cell | `cell` |
| `aria-sort` | Sortable header | `ascending` / `descending` / `none` |
| `aria-selected` | Selectable row | `true` / `false` |
| `aria-busy` | Table (loading) | `true` |
| `aria-label` | Sort button | `"列名でソート"` |
| `aria-label` | Pagination | `"ページネーション"` |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | テーブル内のインタラクティブ要素間移動 |
| `Enter` / `Space` | ソートトグル / 行選択 |
| `ArrowLeft` / `ArrowRight` | ページネーションナビゲーション |

---

## CSS Custom Properties

```css
.data-table-container {
  border: var(--border-width-sm) solid var(--color-border-default);
  border-radius: var(--radius-sm);
  overflow: hidden;
  font-family: var(--font-family);
}

.data-table-toolbar {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg);
  border-bottom: var(--border-width-sm) solid var(--color-border-divider);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: var(--color-bg-tertiary);
}

.data-table th {
  padding: var(--space-md) var(--space-lg);
  text-align: left;
  color: var(--color-text-default);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  border-bottom: var(--border-width-sm) solid var(--color-border-divider);
  white-space: nowrap;
}

.data-table th[data-sortable] {
  cursor: pointer;
  user-select: none;
}

.data-table th .sort-icon {
  color: var(--color-icon-disabled);
}

.data-table th[aria-sort] .sort-icon {
  color: var(--color-icon-default);
}

.data-table td {
  padding: var(--space-md) var(--space-lg);
  color: var(--color-text-default);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
  border-bottom: var(--border-width-sm) solid var(--color-border-divider);
}

/* Compact density */
.data-table--compact th,
.data-table--compact td {
  padding: var(--space-sm) var(--space-md);
}

.data-table tbody tr:hover {
  background: var(--color-bg-interactive);
}

.data-table tbody tr[data-selected] {
  background: var(--color-bg-secondary);
}

.data-table tbody tr[data-striped]:nth-child(even) {
  background: var(--color-bg-tertiary);
}

.data-table-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg);
  border-top: var(--border-width-sm) solid var(--color-border-divider);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.data-table-empty {
  padding: var(--space-3xl);
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
}

.data-table-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
}
```

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| DataTable | インタラクティブなデータ一覧 | シンプルな情報表示 |
| Table | 静的なデータ表示 | ソート/フィルターが必要 |
| Chart | データの可視化 | 詳細な行データの確認 |
