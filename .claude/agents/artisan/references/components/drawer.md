# Drawer

## Overview

| 項目 | 値 |
|------|-----|
| Name | Drawer |
| Description | 画面端からスライドするパネルオーバーレイ |
| Figma Source | — (shadcn/ui + Vaul ベース、Luna DS v3 トークン適用) |
| Layer | Molecule |
| Category | Overlay |
| Status | Draft |

---

## Variants

| Variant Axis | Values |
|--------------|--------|
| Side | bottom, left, right |

---

## Props

### Drawer

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| open | `boolean` | — | 開閉制御 |
| onOpenChange | `(open: boolean) => void` | — | 開閉コールバック |
| side | `"bottom" \| "left" \| "right"` | `"bottom"` | 表示位置 |
| shouldScaleBackground | `boolean` | `true` | 背景のスケール効果 |
| dismissible | `boolean` | `true` | スワイプ/外側クリックで閉じる |
| modal | `boolean` | `true` | モーダル動作 |

### DrawerContent

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| children | `ReactNode` | — | コンテンツ |
| className | `string` | — | 追加クラス |

### DrawerHeader / DrawerFooter

| Property | Type | Description |
|----------|------|-------------|
| children | `ReactNode` | ヘッダー/フッターコンテンツ |

### DrawerTitle / DrawerDescription

| Property | Type | Description |
|----------|------|-------------|
| children | `ReactNode` | タイトル/説明テキスト |

---

## Token Mapping

### Colors

| Element | Token | Value |
|---------|-------|-------|
| Overlay 背景 | — | `rgba(0, 0, 0, 0.5)` |
| Content 背景 | `bg-default` | `#FFFFFF` (Black/0) |
| Content ボーダー | `border-divider` | `#EFEEF0` (Black/100) |
| Handle (グラブバー) | — | Black/300 `#BAB9C0` |
| Title テキスト | `text-default` | `#27272A` (Black/950) |
| Description テキスト | `text-secondary` | `#777681` (Black/500) |

### Spacing

| Element | Token | Value |
|---------|-------|-------|
| Content padding (horizontal) | `space-xl` | 24px |
| Content padding (vertical) | `space-lg` | 16px |
| Header padding-bottom | `space-lg` | 16px |
| Footer padding-top | `space-lg` | 16px |
| Title と Description の間隔 | `space-2xs` | 4px |
| Handle margin-top | `space-sm` | 8px |
| Handle margin-bottom | `space-lg` | 16px |

### Size / Radius

| Element | Token | Value |
|---------|-------|-------|
| Content radius (bottom) | `radius-lg` | 16px (top corners) |
| Content radius (left/right) | `radius-lg` | 16px (exposed corners) |
| Content max-height (bottom) | — | `85vh` |
| Content width (left/right) | — | `380px` |
| Handle size | — | 48px x 4px |
| Handle radius | `radius-full` | 9999px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Closed | 非表示 | — |
| Open | Overlay + パネルスライドイン | `role="dialog"` |
| Dragging (bottom) | スワイプ操作中、パネル追従 | — |
| Dismissing | 閾値超えスワイプでスライドアウト | — |

### Animation

| Direction | Open | Close |
|-----------|------|-------|
| Bottom | 下から上へスライド (300ms ease-out) | 上から下へスライド (200ms ease-in) |
| Left | 左からスライド (300ms ease-out) | 左へスライドアウト (200ms ease-in) |
| Right | 右からスライド (300ms ease-out) | 右へスライドアウト (200ms ease-in) |

---

## Accessibility

### ARIA

| Attribute | Element | Value |
|-----------|---------|-------|
| `role` | Content | `dialog` |
| `aria-modal` | Content | `true` |
| `aria-labelledby` | Content | Title の id |
| `aria-describedby` | Content | Description の id |
| `aria-label` | Handle | `"ドラッグハンドル"` |

### Keyboard

| Key | Action |
|-----|--------|
| `Escape` | Drawer を閉じる |
| `Tab` | Drawer 内のフォーカストラップ |
| `Shift+Tab` | 逆方向フォーカス移動 |

### Focus Management

- 開いた時: Drawer 内の最初のフォーカス可能要素にフォーカス
- 閉じた時: トリガー要素にフォーカスを戻す
- モーダル時: フォーカストラップ有効

### Touch

- Bottom: 下方向スワイプで閉じる
- Left: 左方向スワイプで閉じる
- Right: 右方向スワイプで閉じる
- 閾値: 30% 以上のスワイプで dismiss

---

## CSS Custom Properties

```css
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 50;
}

.drawer-content {
  position: fixed;
  z-index: 50;
  background: var(--color-bg-default);
  display: flex;
  flex-direction: column;
}

.drawer-content--bottom {
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 85vh;
  border-top: var(--border-width-sm) solid var(--color-border-divider);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.drawer-content--left {
  top: 0;
  left: 0;
  bottom: 0;
  width: 380px;
  border-right: var(--border-width-sm) solid var(--color-border-divider);
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}

.drawer-content--right {
  top: 0;
  right: 0;
  bottom: 0;
  width: 380px;
  border-left: var(--border-width-sm) solid var(--color-border-divider);
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
}

.drawer-handle {
  width: 48px;
  height: 4px;
  margin: var(--space-sm) auto var(--space-lg);
  background: var(--black-300);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.drawer-header {
  padding: 0 var(--space-xl) var(--space-lg);
}

.drawer-title {
  color: var(--color-text-default);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.drawer-description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
  margin-top: var(--space-2xs);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 var(--space-xl);
}

.drawer-footer {
  padding: var(--space-lg) var(--space-xl);
  border-top: var(--border-width-sm) solid var(--color-border-divider);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
}
```

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Drawer | モバイルのボトムシート、サイドパネル | 小さな確認ダイアログ |
| Dialog | 中央モーダル | スライドインパネル |
| Sheet | デスクトップのサイドパネル | モバイルのボトムシート |
