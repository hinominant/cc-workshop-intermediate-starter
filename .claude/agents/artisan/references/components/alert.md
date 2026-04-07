# Alert

## Overview

| 項目 | 値 |
|------|-----|
| Name | Alert |
| Description | ユーザーに状態やフィードバックを伝えるステータスメッセージ |
| Figma Source | — (shadcn/ui ベース、Luna DS v3 トークン適用) |
| Layer | Molecule |
| Category | Feedback |
| Status | Draft |

---

## Variants

| Variant Axis | Values | Background | Border | Icon Color |
|--------------|--------|------------|--------|------------|
| info | Brand 系 | `bg-secondary` (`#EDEFFF`) | `border-emphasis` (`#5538EE`) | `icon-emphasis` (`#5538EE`) |
| success | Green 系 | Green/50 `#EFFEF7` | Green/600 `#0DA566` | Green/700 `#0F8655` |
| warning | Yellow 系 | `bg-warning` (`#FFFCE7`) | Yellow/600 `#D18500` | Yellow/700 `#A65D02` |
| error | Red 系 | Red/50 `#FFF0F2` | `border-critical` (`#FF001F`) | `icon-critical` (`#D7001A`) |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| variant | `"info" \| "success" \| "warning" \| "error"` | `"info"` | ステータスバリアント |
| title | `string` | — | アラートタイトル |
| description | `string \| ReactNode` | — | 詳細メッセージ |
| icon | `ReactNode` | バリアント既定 | カスタムアイコン |
| closable | `boolean` | `false` | 閉じるボタン表示 |
| onClose | `() => void` | — | 閉じるコールバック |

---

## Token Mapping

### Colors per Variant

| Element | info | success | warning | error |
|---------|------|---------|---------|-------|
| Background | `bg-secondary` (`#EDEFFF`) | Green/50 (`#EFFEF7`) | `bg-warning` (`#FFFCE7`) | Red/50 (`#FFF0F2`) |
| Border (left) | `border-emphasis` (`#5538EE`) | Green/600 (`#0DA566`) | Yellow/600 (`#D18500`) | `border-critical` (`#FF001F`) |
| Icon | `icon-emphasis` (`#5538EE`) | Green/700 (`#0F8655`) | Yellow/700 (`#A65D02`) | `icon-critical` (`#D7001A`) |
| Title | `text-default` (`#27272A`) | `text-default` (`#27272A`) | `text-default` (`#27272A`) | `text-default` (`#27272A`) |
| Description | `text-secondary` (`#777681`) | `text-secondary` (`#777681`) | `text-secondary` (`#777681`) | `text-secondary` (`#777681`) |
| Close icon | `icon-secondary` (`#94939D`) | `icon-secondary` (`#94939D`) | `icon-secondary` (`#94939D`) | `icon-secondary` (`#94939D`) |

### Spacing

| Element | Token | Value |
|---------|-------|-------|
| Container padding | `space-lg` | 16px |
| Icon と Title の間隔 | `space-md` | 12px |
| Title と Description の間隔 | `space-2xs` | 4px |
| Close ボタン padding | `space-sm` | 8px |

### Border

| Element | Token | Value |
|---------|-------|-------|
| Left border width | `border-width-lg` | 3px |
| Container border | `border-width-sm` | 1px |
| Container radius | `radius-sm` | 8px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Default | バリアントに応じた背景・ボーダー・アイコン | `role="alert"` |
| Closable | 右上に閉じるボタン表示 | — |
| Dismissed | アニメーションで非表示 | `aria-hidden="true"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `alert` | error, warning の場合 |
| `role` | `status` | info, success の場合 |
| `aria-live` | `assertive` | error, warning |
| `aria-live` | `polite` | info, success |
| `aria-label` | バリアント説明 | アイコンのみ表示時 |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | 閉じるボタンへフォーカス |
| `Enter` / `Space` | 閉じるボタン実行 |
| `Escape` | closable 時にアラートを閉じる |

### Color Contrast

- Title (Black/950) on Brand/50 → 4.5:1 以上
- Title (Black/950) on Green/50 → 4.5:1 以上
- Title (Black/950) on Yellow/50 → 4.5:1 以上
- Title (Black/950) on Red/50 → 4.5:1 以上

---

## CSS Custom Properties

```css
.alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-lg);
  border: var(--border-width-sm) solid;
  border-left-width: var(--border-width-lg);
  border-radius: var(--radius-sm);
  font-family: var(--font-family);
}

.alert--info {
  background: var(--color-bg-secondary);
  border-color: var(--color-border-emphasis);
}

.alert--success {
  background: var(--green-50);
  border-color: var(--green-600);
}

.alert--warning {
  background: var(--color-bg-warning);
  border-color: var(--yellow-600);
}

.alert--error {
  background: var(--red-50);
  border-color: var(--color-border-critical);
}

.alert__icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.alert__title {
  color: var(--color-text-default);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
}

.alert__description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
  margin-top: var(--space-2xs);
}

.alert__close {
  margin-left: auto;
  padding: var(--space-sm);
  color: var(--color-icon-secondary);
  cursor: pointer;
}
```

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Alert | インライン通知・永続的ステータス | 一時的なトースト通知 |
| Toast | 一時的なフィードバック | 永続的な情報表示 |
| AlertDialog | ユーザーの確認アクションが必要 | 確認不要の情報表示 |
