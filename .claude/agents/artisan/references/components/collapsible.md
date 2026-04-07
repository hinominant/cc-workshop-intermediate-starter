# Collapsible

## Overview

| 項目 | 値 |
|------|-----|
| Name | Collapsible |
| Description | シンプルな開閉コンテナ |
| Figma Source | — (shadcn/ui ベース、Luna DS v3 トークン適用) |
| Layer | Atom |
| Category | Disclosure |
| Status | Draft |

---

## Variants

| Variant Axis | Values |
|--------------|--------|
| — | 単一バリアント（開/閉のみ） |

---

## Props

### Collapsible

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| open | `boolean` | — | 開閉状態（制御モード） |
| defaultOpen | `boolean` | `false` | 初期状態 |
| onOpenChange | `(open: boolean) => void` | — | 開閉コールバック |
| disabled | `boolean` | `false` | 無効化 |

### CollapsibleTrigger

| Property | Type | Description |
|----------|------|-------------|
| asChild | `boolean` | 子要素をトリガーとして使用 |
| children | `ReactNode` | トリガーコンテンツ |

### CollapsibleContent

| Property | Type | Description |
|----------|------|-------------|
| children | `ReactNode` | 展開時に表示されるコンテンツ |
| forceMount | `boolean` | 常にDOMにマウント（アニメーション用） |

---

## Token Mapping

### Colors

| Element | Token | Value |
|---------|-------|-------|
| Trigger テキスト | `text-default` | `#27272A` (Black/950) |
| Trigger ホバー背景 | `bg-interactive` | `#EFEEF0` (Black/100) |
| Trigger アイコン | `icon-secondary` | `#94939D` (Black/400) |
| Content テキスト | `text-default` | `#27272A` (Black/950) |
| Disabled テキスト | `text-disabled` | `#94939D` (Black/400) |
| Disabled アイコン | `icon-disabled` | `#DADADD` (Black/300) |

### Spacing

| Element | Token | Value |
|---------|-------|-------|
| Trigger padding | `space-sm` | 8px |
| Content padding (top) | `space-sm` | 8px |
| Trigger アイコンとテキストの間隔 | `space-sm` | 8px |

### Radius

| Element | Token | Value |
|---------|-------|-------|
| Trigger radius | `radius-xs` | 4px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Closed | Content 非表示、アイコン右向き | `aria-expanded="false"` |
| Open | Content 表示、アイコン下向き | `aria-expanded="true"` |
| Hover | Trigger 背景 `bg-interactive` | — |
| Focus | focus-ring 表示 | — |
| Disabled | テキスト/アイコン disabled色、操作不可 | `aria-disabled="true"` |

### Animation

| Property | Open | Close |
|----------|------|-------|
| Height | 0 → auto | auto → 0 |
| Opacity | 0 → 1 | 1 → 0 |
| Duration | 200ms | 200ms |
| Easing | ease-out | ease-in |

---

## Accessibility

### ARIA

| Attribute | Element | Value |
|-----------|---------|-------|
| `aria-expanded` | Trigger | `true` / `false` |
| `aria-controls` | Trigger | Content の id |
| `aria-disabled` | Trigger | `true` (disabled 時) |
| `id` | Content | Trigger の `aria-controls` と一致 |

### Keyboard

| Key | Action |
|-----|--------|
| `Enter` / `Space` | 開閉切替 |
| `Tab` | 次のフォーカス可能要素へ移動 |

---

## CSS Custom Properties

```css
.collapsible-trigger {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  border-radius: var(--radius-xs);
  color: var(--color-text-default);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: background-color 150ms ease;
}

.collapsible-trigger:hover {
  background: var(--color-bg-interactive);
}

.collapsible-trigger[data-disabled] {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.collapsible-trigger .icon {
  color: var(--color-icon-secondary);
  transition: transform 200ms ease;
}

.collapsible-trigger[data-state="open"] .icon {
  transform: rotate(90deg);
}

.collapsible-trigger[data-disabled] .icon {
  color: var(--color-icon-disabled);
}

.collapsible-content {
  overflow: hidden;
  padding-top: var(--space-sm);
  color: var(--color-text-default);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
}

.collapsible-content[data-state="open"] {
  animation: collapsible-open 200ms ease-out;
}

.collapsible-content[data-state="closed"] {
  animation: collapsible-close 200ms ease-in;
}

@keyframes collapsible-open {
  from { height: 0; opacity: 0; }
  to { height: var(--radix-collapsible-content-height); opacity: 1; }
}

@keyframes collapsible-close {
  from { height: var(--radix-collapsible-content-height); opacity: 1; }
  to { height: 0; opacity: 0; }
}
```

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Collapsible | 単一コンテンツの開閉 | 複数セクションの管理 |
| Accordion | 複数セクションの開閉 | 単一の開閉のみ |
| Disclosure | アクセシビリティ要件が厳密 | 一般的な開閉UI |
