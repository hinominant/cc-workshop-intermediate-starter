# Skeleton

## Overview

| 項目 | 値 |
|------|-----|
| Name | Skeleton |
| Description | コンテンツ読み込み中のプレースホルダー表示 |
| Figma Source | Luna DS v3 / Skeleton |
| Layer | Atom |
| Category | Feedback |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Variant | Text, Circular, Rectangular |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| variant | `text` \| `circular` \| `rectangular` | `text` | プレースホルダーの形状 |
| width | `string \| number` | `100%` | 幅 |
| height | `string \| number` | variant による | 高さ |
| className | `string` | — | 追加クラス |

---

## Token Mapping

| Property | Token | Primitive | Value |
|----------|-------|-----------|-------|
| background | `bg-interactive` | Black/100 | `#EFEEF0` |
| animation highlight | — | Black/50 | `#F7F7F8` |
| border-radius (text) | `radius-sm` | — | 8px |
| border-radius (circular) | `radius-full` | — | 9999px |
| border-radius (rectangular) | `radius-sm` | — | 8px |

---

## Variant Specifications

### Text

| Property | Value |
|----------|-------|
| width | 100% (default) |
| height | 16px (1 行分) |
| border-radius | `radius-sm` (8px) |
| margin-bottom | `space-sm` (8px) — 複数行の場合 |

### Circular

| Property | Value |
|----------|-------|
| width | 40px (default) |
| height | width と同値 |
| border-radius | `radius-full` (9999px) |

### Rectangular

| Property | Value |
|----------|-------|
| width | 100% (default) |
| height | 120px (default) |
| border-radius | `radius-sm` (8px) |

---

## Animation

| Property | Value |
|----------|-------|
| Type | pulse (opacity animation) |
| Keyframes | opacity 1 → 0.5 → 1 |
| Duration | 1.5s |
| Timing | ease-in-out |
| Iteration | infinite |

```css
@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## States

| State | Visual Change |
|-------|--------------|
| Loading | `bg-interactive` + pulse animation |
| Loaded | children に置き換え（Skeleton 非表示） |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `status` | 常時 |
| `aria-busy` | `true` | ロード中 |
| `aria-label` | `読み込み中` | 常時 |

### Motion

- `prefers-reduced-motion: reduce` の場合、pulse animation を無効化し静的表示にする

---

## Usage Patterns

### テキストブロック

```tsx
<div>
  <Skeleton variant="text" width="60%" />
  <Skeleton variant="text" width="100%" />
  <Skeleton variant="text" width="80%" />
</div>
```

### カードプレースホルダー

```tsx
<div className="flex gap-md">
  <Skeleton variant="circular" width={48} height={48} />
  <div className="flex-1">
    <Skeleton variant="text" width="40%" />
    <Skeleton variant="text" width="100%" />
  </div>
</div>
```

---

## Do / Don't

### Do
- 実際のコンテンツと同じレイアウト・サイズにする
- コンテンツの構造を反映した複数の Skeleton を組み合わせる
- `prefers-reduced-motion` を尊重する

### Don't
- Skeleton をスピナーの代わりに使わない（構造が予測できる場合に Skeleton）
- 実際のサイズと大きく異なる Skeleton を使わない（レイアウトシフトの原因）
- 3 秒以上表示される場合は追加のフィードバック（テキスト等）を検討する

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Skeleton | コンテンツ構造が予測可能なロード中 | 構造不明のロード中 |
| Spinner | 不定形のロード中 | レイアウトが予測できる |
