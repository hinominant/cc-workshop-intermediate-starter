# Sheet

## Overview

| 項目 | 値 |
|------|-----|
| Name | Sheet |
| Description | 画面端からスライドするサイドパネルオーバーレイ |
| Figma Source | Luna DS v3 / Sheet |
| Layer | Molecule |
| Category | Overlay |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Side | Top, Right, Bottom, Left |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| open | `boolean` | `false` | パネルの表示状態 |
| onOpenChange | `(open: boolean) => void` | — | 表示状態変更コールバック |
| side | `top` \| `right` \| `bottom` \| `left` | `right` | パネルの出現方向 |

---

## Structure

```
SheetRoot
├── SheetTrigger
├── SheetPortal
│   ├── SheetOverlay
│   └── SheetContent
│       ├── SheetHeader
│       │   ├── SheetTitle
│       │   └── SheetDescription
│       ├── children
│       └── SheetFooter
└── SheetClose
```

---

## Token Mapping

### Overlay

| Property | Token | Value |
|----------|-------|-------|
| background | — | `rgba(0, 0, 0, 0.5)` (black/50% opacity) |
| z-index | — | 50 |

### Panel (SheetContent)

| Property | Token | Value |
|----------|-------|-------|
| background | `bg-default` | `#FFFFFF` (Black/0) |
| padding | `space-xl` | 24px |
| border-color | `border-divider` | `#EFEEF0` (Black/100) |
| border-width | `border-width-sm` | 1px (開口部と反対側) |
| z-index | — | 51 |

### Side-specific Dimensions

| Side | Width / Height | Max |
|------|---------------|-----|
| Right | width: 400px | max-width: 80vw |
| Left | width: 400px | max-width: 80vw |
| Top | height: auto | max-height: 80vh |
| Bottom | height: auto | max-height: 80vh |

### Header

| Property | Token | Value |
|----------|-------|-------|
| Title font | `Heading/sm` | 16px / Bold |
| Title color | `text-default` | `#27272A` (Black/950) |
| Description color | `text-secondary` | `#777681` (Black/500) |
| Description font | `Body/sm-default` | 12px / Regular |
| gap | `space-2xs` | 4px |
| margin-bottom | `space-xl` | 24px |

### Close Button

| Property | Token | Value |
|----------|-------|-------|
| position | — | absolute top-right |
| offset | `space-lg` | 16px |
| icon | Material Symbols | `close` (20px) |
| color | `icon-secondary` | `#94939D` (Black/400) |
| hover color | `icon-default` | `#27272A` (Black/950) |

---

## Animation

| Property | Value |
|----------|-------|
| Duration | 300ms |
| Easing | `ease-in-out` |
| Enter (right) | translateX(100%) → translateX(0) |
| Enter (left) | translateX(-100%) → translateX(0) |
| Enter (top) | translateY(-100%) → translateY(0) |
| Enter (bottom) | translateY(100%) → translateY(0) |
| Overlay enter | opacity 0 → 0.5 |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Closed | 非表示、DOM からアンマウント | — |
| Open | スライドインアニメーション + オーバーレイ | `aria-modal="true"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `dialog` | SheetContent |
| `aria-modal` | `true` | open 時 |
| `aria-labelledby` | SheetTitle の id | 常時 |
| `aria-describedby` | SheetDescription の id | 説明がある場合 |

### Keyboard

| Key | Action |
|-----|--------|
| `Escape` | Sheet を閉じる |
| `Tab` | Sheet 内でフォーカストラップ |

### Focus Management

- 開く: SheetContent 内の最初のフォーカス可能要素にフォーカス
- 閉じる: SheetTrigger にフォーカスを戻す

---

## Do / Don't

### Do
- フォームやフィルターなど補助的なコンテンツに使用する
- 必ず SheetTitle を設定する（スクリーンリーダー対応）
- オーバーレイクリックで閉じられるようにする

### Don't
- メインコンテンツを Sheet に入れない（モーダル的に使わない）
- Sheet を複数同時に開かない
- 全画面を覆うサイズにしない（Dialog を使う）

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Sheet | サイド補助パネル | 中央ダイアログ |
| Dialog | 確認・入力モーダル | サイドパネル |
| Sidebar | 常時表示ナビゲーション | 一時的なオーバーレイ |
