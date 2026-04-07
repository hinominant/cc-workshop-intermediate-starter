# Table

## Overview

| 項目 | 値 |
|------|-----|
| Name | Table |
| Description | 構造化データを行と列で表示するデータ表示要素 |
| Figma Source | Luna DS v3 / Table |
| Layer | Organism |
| Category | Data Display |
| Status | Stable |

---

## Variants

### Anatomy

| # | Part | Required | Description |
|----|------|----------|-------------|
| 1 | Toolbar | Optional | 一括操作・設定エリア |
| 2 | Bulk Actions | Conditional | 行選択時に表示される一括操作 |
| 3 | Column Settings | Optional | 列の表示/非表示、並び替え |
| 4 | Density | Optional | 行の高さ切替（compact/normal/comfortable） |
| 5 | Header Row | Required | 列見出し。ソート可能列にはインジケータ |
| 6 | Column Header | Required | ソートアイコン + ラベル |
| 7 | Data Row | Required | データ行 |
| 8 | Row Actions | Optional | 行ごとの操作メニュー |
| 9 | Expandable Row | Optional | 展開詳細行 |
| 10 | Footer | Optional | ページネーション + 選択件数 |

### Density

| Density | Row Height | Font Size | Padding | Use Case |
|---------|-----------|-----------|---------|----------|
| compact | 36px | 13px | 4px 12px | データ量が多い、一覧性重視 |
| normal | 48px | 14px | 8px 12px | 標準（デフォルト） |
| comfortable | 64px | 16px | 12px 16px | アバター付き、操作が多い |

### Features

| Feature | Description | 推奨条件 |
|---------|-------------|---------|
| Sortable | 列ヘッダークリックでソート | データが10行以上 |
| Selectable | チェックボックスで行選択 | 一括操作が必要 |
| Expandable | 行クリックで詳細展開 | 補足情報が多い |
| Sticky Header | スクロール時にヘッダー固定 | データが1画面に収まらない |
| Sticky Column | 横スクロール時に左列固定 | カラムが多い |
| Resizable | 列幅のドラッグ調整 | カラムの重要度がユーザーにより異なる |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| columns | `ColumnDef<T>[]` | — | カラム定義（必須） |
| data | `T[]` | — | データ（必須） |
| isSortable | `boolean` | — | ソート可能 |
| isSelectable | `boolean` | — | 行選択可能 |
| isExpandable | `boolean` | — | 行展開可能 |
| density | `'compact' \| 'normal' \| 'comfortable'` | `'normal'` | 表示密度 |
| sortState | `{ column: string; direction: 'asc' \| 'desc' }` | — | ソート状態 |
| selectedRows | `T[]` | — | 選択行 |
| pagination | `{ page: number; pageSize: number; total: number }` | — | ページネーション |
| isLoading | `boolean` | — | ローディング |
| emptyMessage | `string` | — | 空状態メッセージ |
| onSortChange | `(column: string, direction: 'asc' \| 'desc') => void` | — | ソート変更ハンドラ |
| onSelectionChange | `(rows: T[]) => void` | — | 選択変更ハンドラ |
| onPageChange | `(page: number) => void` | — | ページ変更ハンドラ |
| onRowExpand | `(row: T) => void` | — | 行展開ハンドラ |

### ColumnDef

| Property | Type | Description |
|----------|------|-------------|
| id | `string` | カラムID |
| header | `string` | ヘッダーラベル |
| cell | `(row: T) => ReactNode` | セルレンダリング |
| isSortable | `boolean` | ソート可能 |
| width | `string \| number` | 幅 |
| minWidth | `number` | 最小幅 |
| align | `'left' \| 'center' \| 'right'` | テキスト配置 |
| isSticky | `boolean` | 固定列（横スクロール時） |

---

## Token Mapping

| Element | Token | Value |
|---------|-------|-------|
| テーブル背景 | `bg-default` | `#FFFFFF` (Black/0) |
| ヘッダー背景 | `bg-tertiary` | `#F7F7F8` (Black/50) |
| ヘッダーテキスト | `text-secondary` | `#777681` (Black/500) |
| 行ボーダー | `border-divider` | `#EFEEF0` (Black/100) |
| 行ホバー | `bg-interactive` | `#EFEEF0` (Black/100) |
| 選択行背景 | `bg-secondary` | `#EDEFFF` (Brand/50) |
| ゼブラストライプ | `bg-tertiary` | `#F7F7F8` (Black/50) |
| セルテキスト | `text-default` | `#27272A` (Black/950) |
| ソートアイコン | `icon-default` | `#27272A` (Black/950) |
| 非アクティブソート | `icon-disabled` | `#DADADD` (Black/200) |
| テーブル角丸 | `radius-lg` | 16px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| default | 通常表示 | — |
| loading | Skeleton行表示 or オーバーレイスピナー | `aria-busy="true"` |
| empty | emptyMessage + イラスト表示 | — |
| error | エラーメッセージ + リトライボタン | `aria-live="polite"` |
| row-hover | 行背景色変化 | — |
| row-selected | 行背景色: selected | `aria-selected="true"` |
| row-expanded | 詳細行展開 | `aria-expanded="true"` |
| sorting | ソートインジケータ表示（上/下） | `aria-sort="ascending/descending"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `table` | ネイティブ要素推奨 |
| `aria-sort` | `ascending` / `descending` / `none` | ソート可能ヘッダー |
| `aria-selected` | `true` | 選択行 |
| `aria-expanded` | `true` | 展開行 |
| `aria-busy` | `true` | ローディング中 |
| `aria-rowcount` | 総行数 | ページネーション時 |
| `aria-label` | テーブルの説明 | 常時 |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | テーブル内のインタラクティブ要素間を移動 |
| `ArrowUp` / `ArrowDown` | 行間の移動（selectable時） |
| `Space` | 行の選択/選択解除 |
| `Enter` | 行の展開/折りたたみ、または行アクション |

### Screen Reader
- ソート変更時: `aria-live="polite"` で「{列名}を{昇順/降順}でソートしました」を通知
- ページ変更時: 同様に現在のページ範囲を通知

---

## Do / Don't

### Do
- ネイティブ `<table>` 要素を使用 → スクリーンリーダーのテーブルナビゲーション対応
- 空状態で次のアクションを提示 → 「データがありません。新規作成してください」
- ローディング中はSkeleton行を表示 → レイアウトシフト防止
- 数値列は右揃え → 桁数の比較がしやすい
- ソート可能列はヘッダーにインジケータ → 操作可能であることを示す

### Don't
- `<div>` でテーブルを組まない → a11yが破壊される
- 10列以上を横一列に並べない → 横スクロール or 列選択機能を追加
- 行全体をクリッカブルにしつつ行内にリンク/ボタンを置かない → クリック対象が曖昧
- ページネーションなしで100行以上表示しない → パフォーマンス低下

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Table | 構造化データの一覧表示 | 非構造化コンテンツ |
| Card List | ビジュアル重視のデータ表示 | 数値比較が必要 |
| DataGrid | セル編集が必要 | 閲覧のみ |
| List | 単カラムの項目一覧 | 複数属性の比較 |

### Composition Patterns
- → `artisan/references/components/data-table.md` — ソート+フィルタ+ページネーション統合パターン
