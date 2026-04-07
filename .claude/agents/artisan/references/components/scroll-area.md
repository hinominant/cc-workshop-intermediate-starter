# Scroll Area

## Overview

| 項目 | 値 |
|------|-----|
| Name | Scroll Area |
| Description | カスタムスクロールバー付きコンテナ |
| Figma Source | Luna DS v3 / Scroll Area |
| Layer | Atom |
| Category | Layout |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Orientation | Vertical, Horizontal, Both |
| Scrollbar Visibility | Auto, Always, Hover |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| orientation | `vertical` \| `horizontal` \| `both` | `vertical` | スクロール方向 |
| scrollbarVisibility | `auto` \| `always` \| `hover` | `auto` | スクロールバー表示タイミング |
| className | `string` | — | ルート要素の追加クラス |

---

## Structure

```
ScrollArea (viewport wrapper)
├── ScrollAreaViewport (overflow container)
│   └── children
├── ScrollAreaScrollbar (vertical)
│   └── ScrollAreaThumb
└── ScrollAreaScrollbar (horizontal)
    └── ScrollAreaThumb
```

---

## Token Mapping

### Scrollbar Track

| Property | Token | Value |
|----------|-------|-------|
| background | `bg-interactive` | `#EFEEF0` (Black/100) |
| border-radius | `radius-full` | 9999px |
| width (vertical) | — | 6px |
| height (horizontal) | — | 6px |

### Scrollbar Thumb

| State | Property | Token | Value |
|-------|----------|-------|-------|
| Default | background | `bg-disabled` | `#DADADD` (Black/200) |
| Hover | background | `text-secondary` | `#777681` (Black/500) |
| Active | background | `text-secondary` | `#777681` (Black/500) |

### Viewport

| Property | Token | Value |
|----------|-------|-------|
| background | `bg-default` | `#FFFFFF` (Black/0) |
| overflow | — | direction に応じた `auto` |

---

## Size Specifications

| Part | Dimension | Value |
|------|-----------|-------|
| Scrollbar track (vertical) | width | 6px |
| Scrollbar track (horizontal) | height | 6px |
| Scrollbar thumb | min-height / min-width | 40px |
| Track padding | all | `space-3xs` (2px) |
| Corner (both orientation) | size | 6px x 6px |

---

## States

| State | Visual Change |
|-------|--------------|
| No overflow | スクロールバー非表示 |
| Overflow (auto) | スクロール時にスクロールバー表示、アイドル後フェードアウト |
| Overflow (always) | スクロールバー常時表示 |
| Hover (scrollbar) | Thumb: `bg-disabled` → `text-secondary` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | — | ネイティブスクロール動作を維持 |
| `tabindex` | `0` | キーボードスクロール対応 |
| `aria-label` | スクロール領域の説明 | コンテンツが明示的でない場合 |

### Keyboard

| Key | Action |
|-----|--------|
| `ArrowUp` / `ArrowDown` | 垂直スクロール |
| `ArrowLeft` / `ArrowRight` | 水平スクロール |
| `PageUp` / `PageDown` | ページ単位スクロール |
| `Home` / `End` | 先頭 / 末尾へ移動 |

---

## Do / Don't

### Do
- コンテンツの高さ/幅が予測できない場合に使用する
- 十分な min-height / min-width を thumb に確保する
- スクロール方向をコンテンツに合わせて設定する

### Don't
- ページ全体のスクロールに使用しない（ブラウザネイティブを使う）
- ネストされた Scroll Area を作らない
- スクロールバーを完全に非表示にしない（操作性が下がる）

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Scroll Area | オーバーフローするコンテンツ領域 | 固定サイズのコンテンツ |
| Resizable | ユーザーがサイズを調整 | スクロールのみ必要 |
