# AlertDialog

## Overview

| 項目 | 値 |
|------|-----|
| Name | AlertDialog |
| Description | ユーザーの確認アクションを要求するモーダルダイアログ |
| Figma Source | — (shadcn/ui ベース、Luna DS v3 トークン適用) |
| Layer | Molecule |
| Category | Overlay |
| Status | Draft |

---

## Variants

| Variant Axis | Values | Confirm Button Style |
|--------------|--------|---------------------|
| default | 通常の確認ダイアログ | Primary (Brand/600) |
| destructive | 破壊的操作の確認 | Destructive Primary (Red/600) |

---

## Props

### AlertDialog

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| open | `boolean` | — | 開閉制御 |
| onOpenChange | `(open: boolean) => void` | — | 開閉コールバック |
| defaultOpen | `boolean` | `false` | 初期状態 |

### AlertDialogContent

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| title | `string` | — | ダイアログタイトル（必須） |
| description | `string \| ReactNode` | — | 説明テキスト |
| confirmLabel | `string` | `"確認"` | 確認ボタンラベル |
| cancelLabel | `string` | `"キャンセル"` | キャンセルボタンラベル |
| onConfirm | `() => void` | — | 確認コールバック |
| onCancel | `() => void` | — | キャンセルコールバック |
| variant | `"default" \| "destructive"` | `"default"` | バリアント |

---

## Token Mapping

### Colors

| Element | Token | Value |
|---------|-------|-------|
| Overlay 背景 | — | `rgba(0, 0, 0, 0.5)` |
| Dialog 背景 | `bg-default` | `#FFFFFF` (Black/0) |
| Title テキスト | `text-default` | `#27272A` (Black/950) |
| Description テキスト | `text-secondary` | `#777681` (Black/500) |
| Cancel ボタン背景 | `bg-default` | `#FFFFFF` (Black/0) |
| Cancel ボタンボーダー | `border-default` | `#DADADD` (Black/200) |
| Cancel ボタンテキスト | `text-default` | `#27272A` (Black/950) |
| Confirm ボタン背景 (default) | `bg-emphasis` | `#5538EE` (Brand/600) |
| Confirm ボタンテキスト (default) | `text-inverse` | `#FFFFFF` (Black/0) |
| Confirm ボタン背景 (destructive) | `bg-critical` | `#FF001F` (Red/600) |
| Confirm ボタンテキスト (destructive) | `text-inverse` | `#FFFFFF` (Black/0) |

### Spacing

| Element | Token | Value |
|---------|-------|-------|
| Dialog padding | `space-xl` | 24px |
| Title と Description の間隔 | `space-sm` | 8px |
| Description と Footer の間隔 | `space-xl` | 24px |
| Footer ボタン間隔 | `space-sm` | 8px |

### Radius / Size

| Element | Token | Value |
|---------|-------|-------|
| Dialog radius | `radius-md` | 12px |
| Dialog max-width | — | 512px |
| Dialog min-width | — | 320px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Closed | 非表示 | — |
| Open | Overlay + Dialog 表示、背景スクロール禁止 | `aria-modal="true"` |
| Confirm Hover (default) | 背景 Brand/700 `#4D2FD3` | — |
| Confirm Hover (destructive) | 背景 Red/700 `#D7001A` | — |
| Cancel Hover | 背景 `bg-interactive` `#EFEEF0` | — |

---

## Accessibility

### ARIA

| Attribute | Element | Value |
|-----------|---------|-------|
| `role` | Dialog | `alertdialog` |
| `aria-modal` | Dialog | `true` |
| `aria-labelledby` | Dialog | Title の id |
| `aria-describedby` | Dialog | Description の id |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | ダイアログ内のフォーカストラップ |
| `Shift+Tab` | 逆方向フォーカス移動 |
| `Escape` | キャンセル（ダイアログを閉じる） |
| `Enter` | フォーカス中のボタンを実行 |

### Focus Management

- 開いた時: 最初のフォーカス可能要素（Cancel ボタン）にフォーカス
- 閉じた時: トリガー要素にフォーカスを戻す
- フォーカストラップ: ダイアログ外にフォーカスが出ない

---

## CSS Custom Properties

```css
.alert-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  animation: overlay-show 150ms ease;
}

.alert-dialog-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 512px;
  min-width: 320px;
  padding: var(--space-xl);
  background: var(--color-bg-default);
  border-radius: var(--radius-md);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
  animation: content-show 150ms ease;
}

.alert-dialog-title {
  color: var(--color-text-default);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.alert-dialog-description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
  margin-top: var(--space-sm);
}

.alert-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  margin-top: var(--space-xl);
}
```

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| AlertDialog | 破壊的操作の確認、ユーザー承認が必要 | 情報表示のみ |
| Dialog | フォーム入力や詳細情報の表示 | 確認アクションが必須の場面 |
| Alert | インライン通知 | モーダル確認が必要 |
