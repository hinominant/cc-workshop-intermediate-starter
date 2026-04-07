# ContextMenu

## Overview

| 項目 | 値 |
|------|-----|
| Name | ContextMenu |
| Description | 右クリックメニュー（Menu コンポーネントと同一スタイリング） |
| Figma Source | — (shadcn/ui ベース、Luna DS v3 トークン適用) |
| Layer | Molecule |
| Category | Navigation |
| Status | Draft |

---

## Variants

| Variant Axis | Values |
|--------------|--------|
| — | 単一バリアント |

### Item Types

| Type | Description |
|------|-------------|
| normal | 通常のメニューアイテム |
| destructive | 破壊的操作（赤テキスト） |
| separator | 区切り線 |
| sub-menu | サブメニュー（ネスト） |
| checkbox | チェックボックスアイテム |
| radio | ラジオアイテム |
| label | 非インタラクティブなラベル |

---

## Props

### ContextMenu

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| children | `ReactNode` | — | トリガー領域 |
| onOpenChange | `(open: boolean) => void` | — | 開閉コールバック |

### ContextMenuItem

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| children | `ReactNode` | — | アイテムコンテンツ |
| onSelect | `(event) => void` | — | 選択コールバック |
| disabled | `boolean` | `false` | 無効化 |
| destructive | `boolean` | `false` | 破壊的スタイル |
| shortcut | `string` | — | ショートカット表示 |
| icon | `ReactNode` | — | 左アイコン |

### ContextMenuSub

| Property | Type | Description |
|----------|------|-------------|
| children | `ReactNode` | SubTrigger + SubContent |

### ContextMenuCheckboxItem

| Property | Type | Description |
|----------|------|-------------|
| checked | `boolean` | チェック状態 |
| onCheckedChange | `(checked: boolean) => void` | 状態変更コールバック |

---

## Token Mapping

### Colors

| Element | Token | Value |
|---------|-------|-------|
| Menu 背景 | `bg-default` | `#FFFFFF` (Black/0) |
| Menu ボーダー | `border-default` | `#DADADD` (Black/200) |
| Item テキスト | `text-default` | `#27272A` (Black/950) |
| Item アイコン | `icon-secondary` | `#94939D` (Black/400) |
| Item ホバー背景 | `bg-interactive` | `#EFEEF0` (Black/100) |
| Item ホバーテキスト | `text-default` | `#27272A` (Black/950) |
| Destructive テキスト | `text-critical` | `#D7001A` (Red/700) |
| Destructive ホバー背景 | — | Red/50 `#FFF0F2` |
| Destructive アイコン | `icon-critical` | `#D7001A` (Red/700) |
| Shortcut テキスト | `text-secondary` | `#777681` (Black/500) |
| Label テキスト | `text-secondary` | `#777681` (Black/500) |
| Disabled テキスト | `text-disabled` | `#94939D` (Black/400) |
| Separator | `border-divider` | `#EFEEF0` (Black/100) |
| Checkbox/Radio チェック | `icon-emphasis` | `#5538EE` (Brand/600) |
| Sub arrow | `icon-secondary` | `#94939D` (Black/400) |

### Spacing

| Element | Token | Value |
|---------|-------|-------|
| Menu padding | `space-sm` | 8px |
| Item padding | `space-sm` / `space-sm` | 8px 8px |
| Item アイコンとテキストの間隔 | `space-sm` | 8px |
| Separator margin (vertical) | `space-2xs` | 4px |
| Sub-menu offset | `space-2xs` | 4px |

### Size / Radius

| Element | Token | Value |
|---------|-------|-------|
| Menu radius | `radius-sm` | 8px |
| Menu min-width | — | 200px |
| Item radius | `radius-xs` | 4px |
| Separator height | `border-width-sm` | 1px |
| Icon size | — | 16px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Closed | 非表示 | — |
| Open | マウス位置にメニュー表示 | `role="menu"` |
| Item Hover | 背景 `bg-interactive` | — |
| Item Focus | 背景 `bg-interactive` | `aria-selected="true"` |
| Destructive Hover | 背景 Red/50 | — |
| Sub-menu Open | サブメニュー展開 | `aria-expanded="true"` |
| Disabled | テキスト disabled色、操作不可 | `aria-disabled="true"` |
| Checked | チェックマーク表示 | `aria-checked="true"` |

---

## Accessibility

### ARIA

| Attribute | Element | Value |
|-----------|---------|-------|
| `role` | Menu container | `menu` |
| `role` | Item | `menuitem` |
| `role` | CheckboxItem | `menuitemcheckbox` |
| `role` | RadioItem | `menuitemradio` |
| `aria-checked` | Checkbox/Radio | `true` / `false` |
| `aria-disabled` | Disabled item | `true` |
| `aria-haspopup` | Sub trigger | `menu` |
| `aria-expanded` | Sub trigger | `true` / `false` |

### Keyboard

| Key | Action |
|-----|--------|
| 右クリック | メニューを開く |
| `Escape` | メニューを閉じる |
| `ArrowDown` | 次のアイテムへ |
| `ArrowUp` | 前のアイテムへ |
| `ArrowRight` | サブメニューを開く |
| `ArrowLeft` | サブメニューを閉じる |
| `Enter` / `Space` | アイテムを選択 |
| `Home` | 最初のアイテムへ |
| `End` | 最後のアイテムへ |

---

## CSS Custom Properties

```css
.context-menu {
  min-width: 200px;
  padding: var(--space-sm);
  background: var(--color-bg-default);
  border: var(--border-width-sm) solid var(--color-border-default);
  border-radius: var(--radius-sm);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  font-family: var(--font-family);
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  border-radius: var(--radius-xs);
  font-size: var(--font-size-md);
  color: var(--color-text-default);
  cursor: pointer;
}

.context-menu-item:hover,
.context-menu-item[data-highlighted] {
  background: var(--color-bg-interactive);
}

.context-menu-item[data-disabled] {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.context-menu-item--destructive {
  color: var(--color-text-critical);
}

.context-menu-item--destructive .icon {
  color: var(--color-icon-critical);
}

.context-menu-item--destructive:hover,
.context-menu-item--destructive[data-highlighted] {
  background: var(--red-50);
}

.context-menu-item .icon {
  color: var(--color-icon-secondary);
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.context-menu-item .shortcut {
  margin-left: auto;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.context-menu-label {
  padding: var(--space-sm);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

.context-menu-separator {
  height: var(--border-width-sm);
  background: var(--color-border-divider);
  margin: var(--space-2xs) 0;
}

.context-menu-checkbox .check,
.context-menu-radio .indicator {
  color: var(--color-icon-emphasis);
}

.context-menu-sub-trigger .arrow {
  margin-left: auto;
  color: var(--color-icon-secondary);
}
```

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| ContextMenu | 右クリックコンテキストアクション | メインナビゲーション |
| DropdownMenu | ボタントリガーのメニュー | 右クリック操作 |
| Command | 検索駆動のコマンド実行 | コンテキスト依存のアクション |
