# Separator

## Overview

| 項目 | 値 |
|------|-----|
| Name | Separator |
| Description | コンテンツ間の視覚的な区切り線 |
| Figma Source | Luna DS v3 / Separator |
| Layer | Atom |
| Category | Layout |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Orientation | Horizontal, Vertical |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| orientation | `horizontal` \| `vertical` | `horizontal` | 区切り線の方向 |
| decorative | `boolean` | `true` | 装飾目的かどうか（false の場合 ARIA で分離を示す） |
| className | `string` | — | 追加クラス |

---

## Token Mapping

| Property | Token | Primitive | Value |
|----------|-------|-----------|-------|
| background / border-color | `border-divider` | Black/100 | `#EFEEF0` |
| border-width | `border-width-sm` | — | 1px |
| margin (horizontal) | `space-lg` | — | 16px (上下) |
| margin (vertical) | `space-lg` | — | 16px (左右) |

---

## Size Specifications

### Horizontal

| Property | Value |
|----------|-------|
| width | 100% |
| height | 1px |
| margin | `space-lg` (16px) top/bottom |

### Vertical

| Property | Value |
|----------|-------|
| width | 1px |
| height | 100% (親要素の高さ) |
| margin | `space-lg` (16px) left/right |

---

## States

| State | Visual Change |
|-------|--------------|
| Default | `border-divider` (`#EFEEF0`) 1px ライン |

Separator は単一状態のみ。インタラクティブ状態は持たない。

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `separator` | `decorative={false}` の場合 |
| `role` | `none` | `decorative={true}` の場合 |
| `aria-orientation` | `horizontal` \| `vertical` | `decorative={false}` の場合 |

### Keyboard

Separator はフォーカス不可。キーボード操作なし。

---

## Usage Examples

### セクション間の区切り

```tsx
<div>
  <SectionA />
  <Separator />
  <SectionB />
</div>
```

### ツールバー内の垂直区切り

```tsx
<div className="flex items-center gap-sm">
  <Button>保存</Button>
  <Separator orientation="vertical" />
  <Button>キャンセル</Button>
</div>
```

---

## Do / Don't

### Do
- セクション間の論理的な区切りに使用する
- decorative を適切に設定し、スクリーンリーダーに正しく伝える
- ツールバー内のグループ分けに vertical を使用する

### Don't
- 余白だけで十分な場所に Separator を追加しない
- Separator にテキストやアイコンを入れない
- border-divider 以外の色を使わない（視覚的一貫性を保つ）

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Separator | コンテンツの論理的な区切り | スペースだけで十分 |
| Resizable | ドラッグで分割位置を変更 | 固定の区切り線 |
