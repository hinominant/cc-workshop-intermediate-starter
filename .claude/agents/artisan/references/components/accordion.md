# Accordion

## Overview

| 項目 | 値 |
|------|-----|
| Name | Accordion |
| Description | 展開/折りたたみ可能なコンテンツセクション |
| Figma Source | — (shadcn/ui ベース、Luna DS v3 トークン適用) |
| Layer | Molecule |
| Category | Disclosure |
| Status | Draft |

---

## Variants

| Variant Axis | Values |
|--------------|--------|
| Type | Single (1つだけ開く), Multiple (複数同時に開く) |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| type | `"single" \| "multiple"` | `"single"` | 開閉モード |
| value | `string \| string[]` | — | 開いているアイテムの値 |
| defaultValue | `string \| string[]` | — | 初期値 |
| onValueChange | `(value) => void` | — | 値変更コールバック |
| collapsible | `boolean` | `false` | single 時、全て閉じることを許可 |
| disabled | `boolean` | `false` | 全アイテム無効化 |

### AccordionItem Props

| Property | Type | Description |
|----------|------|-------------|
| value | `string` | 一意の識別子（必須） |
| disabled | `boolean` | 個別無効化 |

### AccordionTrigger Props

| Property | Type | Description |
|----------|------|-------------|
| children | `ReactNode` | トリガーラベル |

### AccordionContent Props

| Property | Type | Description |
|----------|------|-------------|
| children | `ReactNode` | 展開時に表示されるコンテンツ |

---

## Token Mapping

### Colors

| Element | Token | Value |
|---------|-------|-------|
| Trigger 背景 | `bg-default` | `#FFFFFF` (Black/0) |
| Trigger テキスト | `text-default` | `#27272A` (Black/950) |
| Trigger ホバー背景 | `bg-tertiary` | `#F7F7F8` (Black/50) |
| アイコン (chevron) | `icon-secondary` | `#94939D` (Black/400) |
| Content テキスト | `text-secondary` | `#777681` (Black/500) |
| Divider | `border-divider` | `#EFEEF0` (Black/100) |
| Disabled テキスト | `text-disabled` | `#94939D` (Black/400) |

### Spacing

| Element | Token | Value |
|---------|-------|-------|
| Trigger padding | `space-lg` | 16px |
| Content padding (top) | `space-none` | 0px |
| Content padding (right/bottom/left) | `space-lg` | 16px |
| Item 間ボーダー | `border-width-sm` | 1px |

### Radius

| Element | Token | Value |
|---------|-------|-------|
| Container | `radius-none` | 0px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Collapsed | Chevron 下向き、Content 非表示 | `aria-expanded="false"` |
| Expanded | Chevron 上向き (180deg回転)、Content 表示 | `aria-expanded="true"` |
| Hover | Trigger 背景が `bg-tertiary` に変化 | — |
| Focus | focus-ring 表示（`:focus-visible`） | — |
| Disabled | テキスト `text-disabled`、操作不可 | `aria-disabled="true"` |

---

## Accessibility

### ARIA

| Attribute | Element | Value |
|-----------|---------|-------|
| `role` | Trigger | `button` |
| `aria-expanded` | Trigger | `true` / `false` |
| `aria-controls` | Trigger | Content の id |
| `role` | Content | `region` |
| `aria-labelledby` | Content | Trigger の id |

### Keyboard

| Key | Action |
|-----|--------|
| `Enter` / `Space` | トリガーの展開/折りたたみ切替 |
| `Tab` | 次のフォーカス可能要素へ移動 |
| `ArrowDown` | 次の AccordionTrigger へフォーカス |
| `ArrowUp` | 前の AccordionTrigger へフォーカス |
| `Home` | 最初の AccordionTrigger へフォーカス |
| `End` | 最後の AccordionTrigger へフォーカス |

---

## CSS Custom Properties

```css
.accordion-item {
  border-bottom: var(--border-width-sm) solid var(--color-border-divider);
}

.accordion-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-lg);
  background: var(--color-bg-default);
  color: var(--color-text-default);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: background-color 150ms ease;
}

.accordion-trigger:hover {
  background: var(--color-bg-tertiary);
}

.accordion-trigger[data-disabled] {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.accordion-trigger .chevron {
  color: var(--color-icon-secondary);
  transition: transform 200ms ease;
}

.accordion-trigger[data-state="open"] .chevron {
  transform: rotate(180deg);
}

.accordion-content {
  padding: var(--space-none) var(--space-lg) var(--space-lg) var(--space-lg);
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
}
```

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Accordion | 複数セクションの開閉表示 | 単一コンテンツの開閉 |
| Collapsible | 単一コンテンツの開閉 | 複数セクションの管理 |
| Tabs | 並列コンテンツの切替 | 縦に並ぶ開閉コンテンツ |
