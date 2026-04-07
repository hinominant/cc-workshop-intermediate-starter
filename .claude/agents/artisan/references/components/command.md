# Command

## Overview

| 項目 | 値 |
|------|-----|
| Name | Command |
| Description | コマンドパレット（Cmd+K）— 検索入力 + グループ化リスト |
| Figma Source | — (shadcn/ui ベース、Luna DS v3 トークン適用) |
| Layer | Organism |
| Category | Navigation |
| Status | Draft |

---

## Variants

| Variant Axis | Values |
|--------------|--------|
| Mode | dialog (モーダル表示), inline (インライン埋め込み) |

---

## Props

### Command

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| placeholder | `string` | `"コマンドを入力..."` | 検索プレースホルダ |
| filter | `(value: string, search: string) => number` | — | カスタムフィルター（0-1スコア） |
| shouldFilter | `boolean` | `true` | 組み込みフィルターの有効/無効 |
| onValueChange | `(value: string) => void` | — | 選択変更コールバック |
| loop | `boolean` | `false` | キーボードナビのループ |

### CommandDialog

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| open | `boolean` | — | 開閉制御 |
| onOpenChange | `(open: boolean) => void` | — | 開閉コールバック |

### CommandGroup

| Property | Type | Description |
|----------|------|-------------|
| heading | `string` | グループ見出し |
| children | `ReactNode` | グループ内アイテム |

### CommandItem

| Property | Type | Description |
|----------|------|-------------|
| value | `string` | 検索/選択用の値 |
| onSelect | `(value: string) => void` | 選択コールバック |
| disabled | `boolean` | 無効化 |
| keywords | `string[]` | 追加の検索キーワード |

---

## Token Mapping

### Colors

| Element | Token | Value |
|---------|-------|-------|
| Dialog overlay | — | `rgba(0, 0, 0, 0.5)` |
| Container 背景 | `bg-default` | `#FFFFFF` (Black/0) |
| Container ボーダー | `border-default` | `#DADADD` (Black/200) |
| Search input テキスト | `text-default` | `#27272A` (Black/950) |
| Search input プレースホルダ | `text-secondary` | `#777681` (Black/500) |
| Search アイコン | `icon-secondary` | `#94939D` (Black/400) |
| Group heading | `text-secondary` | `#777681` (Black/500) |
| Item テキスト | `text-default` | `#27272A` (Black/950) |
| Item description | `text-secondary` | `#777681` (Black/500) |
| Item アイコン | `icon-secondary` | `#94939D` (Black/400) |
| Item ハイライト背景 | `bg-interactive` | `#EFEEF0` (Black/100) |
| Item disabled テキスト | `text-disabled` | `#94939D` (Black/400) |
| Shortcut テキスト | `text-secondary` | `#777681` (Black/500) |
| Separator | `border-divider` | `#EFEEF0` (Black/100) |
| Empty テキスト | `text-secondary` | `#777681` (Black/500) |

### Spacing

| Element | Token | Value |
|---------|-------|-------|
| Container padding | `space-2xs` | 4px |
| Search input padding | `space-md` | 12px |
| Search アイコンと入力の間隔 | `space-sm` | 8px |
| Group heading padding | `space-sm` / `space-md` | 8px 12px |
| Item padding | `space-sm` / `space-md` | 8px 12px |
| Item アイコンとテキストの間隔 | `space-sm` | 8px |
| Separator margin | `space-2xs` | 4px |

### Size / Radius

| Element | Token | Value |
|---------|-------|-------|
| Dialog width | — | 640px |
| Dialog max-height | — | 400px |
| Container radius | `radius-md` | 12px |
| Item radius | `radius-xs` | 4px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Closed (dialog) | 非表示 | — |
| Open (dialog) | Overlay + Command 表示 | `role="dialog"` |
| Empty input | 全アイテム表示 | — |
| Filtering | マッチするアイテムのみ表示 | — |
| No results | `"結果がありません"` メッセージ | — |
| Item highlighted | 背景 `bg-interactive` | `aria-selected="true"` |
| Item disabled | テキスト disabled色 | `aria-disabled="true"` |

---

## Accessibility

### ARIA

| Attribute | Element | Value |
|-----------|---------|-------|
| `role` | Container | `listbox` (cmdk) |
| `role` | Dialog wrapper | `dialog` |
| `aria-label` | Search input | `"コマンド検索"` |
| `aria-expanded` | Search input | `true` |
| `aria-controls` | Search input | リストの id |
| `aria-activedescendant` | Search input | ハイライト中 Item の id |
| `role` | Group | `group` |
| `aria-labelledby` | Group | heading の id |
| `role` | Item | `option` |
| `aria-selected` | Item | `true` (ハイライト中) |
| `aria-disabled` | Item | `true` (disabled) |

### Keyboard

| Key | Action |
|-----|--------|
| `Cmd+K` / `Ctrl+K` | Dialog を開く |
| `Escape` | Dialog を閉じる / 検索クリア |
| `ArrowDown` | 次の Item へ |
| `ArrowUp` | 前の Item へ |
| `Enter` | ハイライト中の Item を選択 |
| `Home` | 最初の Item へ |
| `End` | 最後の Item へ |
| 文字入力 | フィルタリング |

---

## CSS Custom Properties

```css
.command {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 400px;
  background: var(--color-bg-default);
  border: var(--border-width-sm) solid var(--color-border-default);
  border-radius: var(--radius-md);
  overflow: hidden;
  font-family: var(--font-family);
}

.command-dialog {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 640px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.16);
}

.command-input-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-bottom: var(--border-width-sm) solid var(--color-border-divider);
}

.command-input-icon {
  color: var(--color-icon-secondary);
  flex-shrink: 0;
}

.command-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-text-default);
  font-size: var(--font-size-md);
}

.command-input::placeholder {
  color: var(--color-text-secondary);
}

.command-list {
  overflow-y: auto;
  padding: var(--space-2xs);
}

.command-group-heading {
  padding: var(--space-sm) var(--space-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

.command-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-xs);
  cursor: pointer;
  font-size: var(--font-size-md);
}

.command-item[data-highlighted] {
  background: var(--color-bg-interactive);
}

.command-item[data-disabled] {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.command-item .icon {
  color: var(--color-icon-secondary);
}

.command-item .shortcut {
  margin-left: auto;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.command-separator {
  height: var(--border-width-sm);
  background: var(--color-border-divider);
  margin: var(--space-2xs) 0;
}

.command-empty {
  padding: var(--space-xl);
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
}
```

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Command | グローバルコマンド検索・ナビゲーション | フォーム内の選択 |
| Combobox | フォームフィールドでの検索選択 | アプリ全体のコマンド |
| ContextMenu | 右クリックアクション | キーボード駆動の検索 |
