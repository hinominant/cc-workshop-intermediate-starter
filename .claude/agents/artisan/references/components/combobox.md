# Combobox

## Overview

| 項目 | 値 |
|------|-----|
| Name | Combobox |
| Description | 検索可能なセレクト（Input + Dropdown の複合コンポーネント） |
| Figma Source | — (shadcn/ui ベース、Luna DS v3 トークン適用) |
| Layer | Molecule |
| Category | Form |
| Status | Draft |

---

## Variants

| Variant Axis | Values |
|--------------|--------|
| Size | M, S |
| Mode | single (単一選択), multiple (複数選択) |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| options | `Option[]` | — | 選択肢リスト（必須） |
| value | `string \| string[]` | — | 選択値 |
| onValueChange | `(value) => void` | — | 値変更コールバック |
| placeholder | `string` | `"選択してください"` | プレースホルダ |
| searchPlaceholder | `string` | `"検索..."` | 検索欄プレースホルダ |
| emptyMessage | `string` | `"結果がありません"` | 空結果メッセージ |
| disabled | `boolean` | `false` | 無効化 |
| size | `"M" \| "S"` | `"M"` | サイズ |
| mode | `"single" \| "multiple"` | `"single"` | 選択モード |
| filter | `(value: string, search: string) => boolean` | — | カスタムフィルター関数 |

### Option

| Property | Type | Description |
|----------|------|-------------|
| value | `string` | 値（必須） |
| label | `string` | 表示ラベル（必須） |
| disabled | `boolean` | 個別無効化 |
| icon | `ReactNode` | オプションアイコン |
| group | `string` | グループ名 |

---

## Token Mapping

### Colors

| Element | Token | Value |
|---------|-------|-------|
| Trigger 背景 | `bg-default` | `#FFFFFF` (Black/0) |
| Trigger ボーダー | `border-default` | `#DADADD` (Black/200) |
| Trigger テキスト | `text-default` | `#27272A` (Black/950) |
| Trigger プレースホルダ | `text-secondary` | `#777681` (Black/500) |
| Trigger フォーカスボーダー | `border-emphasis` | `#5538EE` (Brand/600) |
| Chevron アイコン | `icon-secondary` | `#94939D` (Black/400) |
| Popover 背景 | `bg-default` | `#FFFFFF` (Black/0) |
| Popover ボーダー | `border-default` | `#DADADD` (Black/200) |
| Search input テキスト | `text-default` | `#27272A` (Black/950) |
| Search アイコン | `icon-secondary` | `#94939D` (Black/400) |
| Option テキスト | `text-default` | `#27272A` (Black/950) |
| Option ホバー背景 | `bg-interactive` | `#EFEEF0` (Black/100) |
| Option 選択済みチェック | `icon-emphasis` | `#5538EE` (Brand/600) |
| Group ラベル | `text-secondary` | `#777681` (Black/500) |
| Empty テキスト | `text-secondary` | `#777681` (Black/500) |
| Disabled 背景 | `bg-disabled` | `#DADADD` (Black/200) |
| Disabled テキスト | `text-disabled` | `#94939D` (Black/400) |
| Separator | `border-divider` | `#EFEEF0` (Black/100) |

### Spacing

| Element | Token | Value |
|---------|-------|-------|
| Trigger padding (M) | `space-md` / `space-lg` | 12px 16px |
| Trigger padding (S) | `space-sm` / `space-md` | 8px 12px |
| Popover padding | `space-2xs` | 4px |
| Search input padding | `space-sm` | 8px |
| Option padding | `space-sm` / `space-md` | 8px 12px |
| Option とチェックの間隔 | `space-sm` | 8px |
| Group ラベル padding | `space-sm` / `space-md` | 8px 12px |

### Size / Radius

| Element | Token | Value |
|---------|-------|-------|
| Trigger height (M) | — | 40px |
| Trigger height (S) | — | 32px |
| Trigger radius | `radius-sm` | 8px |
| Popover radius | `radius-sm` | 8px |
| Trigger border | `border-width-sm` | 1px |
| Popover max-height | — | 300px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Closed | Trigger のみ表示 | `aria-expanded="false"` |
| Open | Popover 展開、検索入力にフォーカス | `aria-expanded="true"` |
| Searching | 入力に基づいてオプションフィルタリング | — |
| Empty Results | `emptyMessage` 表示 | — |
| Selected | Trigger に選択ラベル表示 | `aria-selected="true"` |
| Hover (option) | 背景 `bg-interactive` | — |
| Focus (trigger) | ボーダー Brand/600 | — |
| Disabled | 背景/テキスト disabled色、操作不可 | `aria-disabled="true"` |

---

## Accessibility

### ARIA

| Attribute | Element | Value |
|-----------|---------|-------|
| `role` | Trigger | `combobox` |
| `aria-expanded` | Trigger | `true` / `false` |
| `aria-haspopup` | Trigger | `listbox` |
| `aria-controls` | Trigger | Listbox の id |
| `aria-activedescendant` | Trigger | ハイライト中 Option の id |
| `role` | Listbox | `listbox` |
| `role` | Option | `option` |
| `aria-selected` | Option | `true` (選択済み) |
| `aria-disabled` | Option | `true` (無効) |
| `role` | Group | `group` |
| `aria-labelledby` | Group | Group ラベルの id |

### Keyboard

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Popover を開く / Option を選択 |
| `ArrowDown` | 次の Option へ |
| `ArrowUp` | 前の Option へ |
| `Escape` | Popover を閉じる |
| `Home` | 最初の Option へ |
| `End` | 最後の Option へ |
| 文字入力 | 検索フィルター |

---

## CSS Custom Properties

```css
.combobox-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  padding: var(--space-md) var(--space-lg);
  background: var(--color-bg-default);
  border: var(--border-width-sm) solid var(--color-border-default);
  border-radius: var(--radius-sm);
  color: var(--color-text-default);
  font-size: var(--font-size-md);
  cursor: pointer;
}

.combobox-trigger--s {
  height: 32px;
  padding: var(--space-sm) var(--space-md);
}

.combobox-trigger:focus-visible {
  border-color: var(--color-border-emphasis);
  outline: none;
}

.combobox-trigger[data-disabled] {
  background: var(--color-bg-disabled);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.combobox-trigger .placeholder {
  color: var(--color-text-secondary);
}

.combobox-trigger .chevron {
  color: var(--color-icon-secondary);
}

.combobox-popover {
  background: var(--color-bg-default);
  border: var(--border-width-sm) solid var(--color-border-default);
  border-radius: var(--radius-sm);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  max-height: 300px;
  overflow-y: auto;
  padding: var(--space-2xs);
}

.combobox-search {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  border-bottom: var(--border-width-sm) solid var(--color-border-divider);
}

.combobox-search-icon {
  color: var(--color-icon-secondary);
}

.combobox-option {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-xs);
  cursor: pointer;
  font-size: var(--font-size-md);
}

.combobox-option:hover,
.combobox-option[data-highlighted] {
  background: var(--color-bg-interactive);
}

.combobox-option .check {
  color: var(--color-icon-emphasis);
}

.combobox-group-label {
  padding: var(--space-sm) var(--space-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

.combobox-empty {
  padding: var(--space-lg);
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
}
```

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Combobox | 多数の選択肢から検索して選択 | 選択肢が5個以下 |
| Select | 少数の選択肢から選択 | 検索が必要 |
| Command | グローバルコマンド実行 | フォーム内の選択 |
