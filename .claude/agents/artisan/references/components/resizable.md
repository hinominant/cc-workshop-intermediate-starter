# Resizable

## Overview

| 項目 | 値 |
|------|-----|
| Name | Resizable |
| Description | サイズ変更可能なパネルレイアウト |
| Figma Source | Luna DS v3 / Resizable |
| Layer | Molecule |
| Category | Layout |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Direction | Horizontal, Vertical |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| direction | `horizontal` \| `vertical` | `horizontal` | パネル分割方向 |
| defaultSize | `number` (%) | `50` | 初期サイズ（パーセント） |
| minSize | `number` (%) | `10` | 最小サイズ（パーセント） |
| maxSize | `number` (%) | `90` | 最大サイズ（パーセント） |
| onResize | `(size: number) => void` | — | サイズ変更時コールバック |

---

## Structure

```
ResizablePanelGroup
├── ResizablePanel (first)
├── ResizableHandle
└── ResizablePanel (second)
```

---

## Token Mapping

### Handle (Divider)

| State | Property | Token | Value |
|-------|----------|-------|-------|
| Default | background | `border-divider` | `#EFEEF0` (Black/100) |
| Default | width (horizontal) / height (vertical) | — | 4px |
| Hover | background | `bg-interactive` | `#EFEEF0` (Black/100) |
| Active | background | `bg-emphasis` | `#5538EE` (Brand/600) |

### Panel

| Property | Token | Value |
|----------|-------|-------|
| background | `bg-default` | `#FFFFFF` (Black/0) |
| overflow | — | `auto` |

---

## Size Specifications

| Part | Dimension | Value |
|------|-----------|-------|
| Handle (horizontal) | width | 4px |
| Handle (vertical) | height | 4px |
| Handle hit area | — | 12px (transparent padding) |

---

## States

| State | Visual Change | Cursor |
|-------|--------------|--------|
| Default | Handle: `border-divider` | `col-resize` / `row-resize` |
| Hover | Handle: `bg-interactive` + opacity change | `col-resize` / `row-resize` |
| Active (dragging) | Handle: `bg-emphasis` (Brand/600) | `col-resize` / `row-resize` |
| Disabled | Handle 非表示、リサイズ不可 | `default` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `separator` | Handle 要素 |
| `aria-orientation` | `horizontal` \| `vertical` | direction に対応（perpendicular） |
| `aria-valuenow` | 現在サイズ (%) | 常時 |
| `aria-valuemin` | minSize | 常時 |
| `aria-valuemax` | maxSize | 常時 |

### Keyboard

| Key | Action |
|-----|--------|
| `ArrowLeft` / `ArrowUp` | パネルサイズを1%縮小 |
| `ArrowRight` / `ArrowDown` | パネルサイズを1%拡大 |
| `Home` | minSize に設定 |
| `End` | maxSize に設定 |
| `Enter` | デフォルトサイズにリセット |

---

## Do / Don't

### Do
- minSize / maxSize を設定してコンテンツが潰れないようにする
- Handle に十分なヒットエリア（12px 以上）を確保する
- direction に応じた適切なカーソルを表示する

### Don't
- 3 つ以上のパネルをネストしすぎない（最大 3 分割推奨）
- Handle を非表示にしてリサイズ可能であることを隠さない
- minSize と maxSize を同じ値にしない（リサイズ不可になる）

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Resizable | ユーザーがレイアウト比率を調整 | 固定レイアウト |
| Sidebar | ナビゲーション用サイドパネル | コンテンツ分割 |
