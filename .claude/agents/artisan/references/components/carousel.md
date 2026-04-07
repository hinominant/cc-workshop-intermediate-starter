# Carousel

## Overview

| 項目 | 値 |
|------|-----|
| Name | Carousel |
| Description | スライド式コンテンツコンテナ |
| Figma Source | — (shadcn/ui ベース、Luna DS v3 トークン適用) |
| Layer | Molecule |
| Category | Navigation |
| Status | Draft |

---

## Variants

| Variant Axis | Values |
|--------------|--------|
| Orientation | horizontal, vertical |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| items | `ReactNode[]` | — | スライドコンテンツ配列（必須） |
| orientation | `"horizontal" \| "vertical"` | `"horizontal"` | スライド方向 |
| autoPlay | `boolean` | `false` | 自動再生 |
| interval | `number` | `5000` | 自動再生間隔 (ms) |
| showDots | `boolean` | `true` | ドットインジケーター表示 |
| showArrows | `boolean` | `true` | 前後矢印表示 |
| loop | `boolean` | `false` | ループ再生 |
| slidesToShow | `number` | `1` | 同時表示スライド数 |
| gap | `number` | `16` | スライド間の間隔 (px) |
| onSlideChange | `(index: number) => void` | — | スライド変更コールバック |

---

## Token Mapping

### Colors

| Element | Token | Value |
|---------|-------|-------|
| Container 背景 | `bg-default` | `#FFFFFF` (Black/0) |
| Arrow ボタン背景 | `bg-default` | `#FFFFFF` (Black/0) |
| Arrow ボタンボーダー | `border-default` | `#DADADD` (Black/200) |
| Arrow アイコン | `icon-default` | `#27272A` (Black/950) |
| Arrow ホバー背景 | `bg-interactive` | `#EFEEF0` (Black/100) |
| Arrow disabled アイコン | `icon-disabled` | `#DADADD` (Black/300) |
| Dot (inactive) | — | Black/200 `#DADADD` |
| Dot (active) | — | Brand/600 `#5538EE` |
| Dot ホバー | — | Black/400 `#94939D` |

### Spacing

| Element | Token | Value |
|---------|-------|-------|
| スライド間 gap | `space-lg` | 16px |
| Arrow ボタンとコンテンツの間隔 | `space-sm` | 8px |
| Dots とコンテンツの間隔 | `space-lg` | 16px |
| Dot 間隔 | `space-sm` | 8px |

### Size / Radius

| Element | Token | Value |
|---------|-------|-------|
| Arrow ボタンサイズ | — | 40px x 40px |
| Arrow ボタン radius | `radius-full` | 9999px |
| Dot サイズ (inactive) | — | 8px x 8px |
| Dot サイズ (active) | — | 24px x 8px |
| Dot radius | `radius-full` | 9999px |
| Arrow ボタンボーダー | `border-width-sm` | 1px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Default | 最初のスライド表示 | `aria-roledescription="carousel"` |
| Playing | 自動スライド中 | `aria-live="off"` |
| Paused | 自動再生停止（ホバー時） | `aria-live="polite"` |
| First Slide | 前矢印 disabled (loop=false 時) | — |
| Last Slide | 次矢印 disabled (loop=false 時) | — |
| Dragging | スワイプ操作中 | — |

---

## Accessibility

### ARIA

| Attribute | Element | Value |
|-----------|---------|-------|
| `role` | Container | `region` |
| `aria-roledescription` | Container | `"carousel"` |
| `aria-label` | Container | `"スライドショー"` |
| `role` | 各スライド | `group` |
| `aria-roledescription` | 各スライド | `"slide"` |
| `aria-label` | 各スライド | `"N / 合計"` |
| `aria-label` | 前矢印 | `"前のスライド"` |
| `aria-label` | 次矢印 | `"次のスライド"` |
| `aria-disabled` | 端の矢印 | `true` |

### Keyboard

| Key | Action |
|-----|--------|
| `ArrowLeft` / `ArrowUp` | 前のスライドへ |
| `ArrowRight` / `ArrowDown` | 次のスライドへ |
| `Tab` | スライド内コンテンツへフォーカス |

### Auto-play

- ホバー時に自動再生を一時停止
- `prefers-reduced-motion: reduce` 時は自動再生無効

---

## CSS Custom Properties

```css
.carousel {
  position: relative;
  overflow: hidden;
  font-family: var(--font-family);
}

.carousel-viewport {
  overflow: hidden;
}

.carousel-container {
  display: flex;
  gap: var(--space-lg);
  transition: transform 300ms ease;
}

.carousel-container[data-orientation="vertical"] {
  flex-direction: column;
}

.carousel-slide {
  flex: 0 0 100%;
  min-width: 0;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: var(--color-bg-default);
  border: var(--border-width-sm) solid var(--color-border-default);
  color: var(--color-icon-default);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.carousel-arrow:hover {
  background: var(--color-bg-interactive);
}

.carousel-arrow:disabled {
  color: var(--color-icon-disabled);
  cursor: not-allowed;
}

.carousel-arrow--prev { left: var(--space-sm); }
.carousel-arrow--next { right: var(--space-sm); }

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: var(--space-sm);
  margin-top: var(--space-lg);
}

.carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--black-200);
  cursor: pointer;
  transition: all 200ms ease;
}

.carousel-dot:hover {
  background: var(--black-400);
}

.carousel-dot[data-active] {
  width: 24px;
  background: var(--brand-600);
}
```

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Carousel | 複数コンテンツのスライド表示 | 全コンテンツ同時表示 |
| Tabs | コンテンツの切り替え（固定位置） | 視覚的スライド効果 |
