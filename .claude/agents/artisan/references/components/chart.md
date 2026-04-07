# Chart

## Overview

| 項目 | 値 |
|------|-----|
| Name | Chart |
| Description | データ可視化ラッパーコンポーネント（Recharts ベース） |
| Figma Source | — (shadcn/ui ベース、Luna DS v3 トークン適用) |
| Layer | Molecule |
| Category | Data Display |
| Status | Draft |

---

## Variants

| Variant Axis | Values |
|--------------|--------|
| Type | bar, line, pie, area |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| type | `"bar" \| "line" \| "pie" \| "area"` | `"bar"` | チャートタイプ |
| data | `Record<string, any>[]` | — | データ配列（必須） |
| config | `ChartConfig` | — | データキーごとの表示設定（必須） |
| width | `number \| string` | `"100%"` | チャート幅 |
| height | `number \| string` | `350` | チャート高さ |
| showGrid | `boolean` | `true` | グリッド線表示 |
| showLegend | `boolean` | `true` | 凡例表示 |
| showTooltip | `boolean` | `true` | ツールチップ表示 |
| xAxisKey | `string` | — | X軸データキー |

### ChartConfig

| Property | Type | Description |
|----------|------|-------------|
| [key].label | `string` | 凡例ラベル |
| [key].color | `string` | CSS custom property 参照 |
| [key].icon | `ReactNode` | 凡例アイコン |

---

## Token Mapping

### Data Series Colors (Brand Palette)

| Series | Token | Value |
|--------|-------|-------|
| Series 1 | — | Brand/600 `#5538EE` |
| Series 2 | — | Brand/400 `#7C7AFF` |
| Series 3 | — | Brand/200 `#C4CAFF` |
| Series 4 | — | Pink/500 `#FF2BA3` |
| Series 5 | — | Green/500 `#18CF83` |
| Series 6 | — | Yellow/500 `#E6A600` |
| Series 7 | — | Blue/500 `#008CE3` |
| Series 8 | — | Red/500 `#FF233E` |

### UI Colors

| Element | Token | Value |
|---------|-------|-------|
| 背景 | `bg-default` | `#FFFFFF` (Black/0) |
| グリッド線 | `border-divider` | `#EFEEF0` (Black/100) |
| 軸ラベル | `text-secondary` | `#777681` (Black/500) |
| 軸線 | `border-default` | `#DADADD` (Black/200) |
| ツールチップ背景 | `bg-default` | `#FFFFFF` (Black/0) |
| ツールチップボーダー | `border-default` | `#DADADD` (Black/200) |
| ツールチップタイトル | `text-default` | `#27272A` (Black/950) |
| ツールチップ値 | `text-secondary` | `#777681` (Black/500) |
| 凡例テキスト | `text-secondary` | `#777681` (Black/500) |

### Spacing

| Element | Token | Value |
|---------|-------|-------|
| ツールチップ padding | `space-md` | 12px |
| ツールチップ項目間隔 | `space-2xs` | 4px |
| 凡例項目間隔 | `space-lg` | 16px |
| 凡例ドットサイズ | — | 8px x 8px |
| Container padding | `space-lg` | 16px |

### Radius

| Element | Token | Value |
|---------|-------|-------|
| ツールチップ | `radius-sm` | 8px |
| Bar radius (top) | `radius-xs` | 4px |
| Pie セグメント gap | — | 2px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Default | チャート表示 | `role="img"` |
| Hover (データポイント) | ツールチップ表示、要素ハイライト | — |
| Hover (凡例) | 対応シリーズ以外を半透明 | — |
| Loading | スケルトン表示 | `aria-busy="true"` |
| Empty | 空状態メッセージ | — |

---

## Accessibility

### ARIA

| Attribute | Element | Value |
|-----------|---------|-------|
| `role` | Container | `img` |
| `aria-label` | Container | チャートの説明 |
| `aria-roledescription` | Container | `"chart"` |

### Data Table Fallback

- `<table>` を `sr-only` で配置し、スクリーンリーダーでデータにアクセス可能にする
- 各データポイントのラベルと値を含む

### Color

- データシリーズは色だけでなくパターン/形状でも区別可能にする
- 凡例アイコンで形状を提供

---

## CSS Custom Properties

```css
.chart-container {
  padding: var(--space-lg);
  background: var(--color-bg-default);
  font-family: var(--font-family);
}

/* Data series colors as CSS custom properties */
:root {
  --chart-1: var(--brand-600);
  --chart-2: var(--brand-400);
  --chart-3: var(--brand-200);
  --chart-4: var(--pink-500);
  --chart-5: var(--green-500);
  --chart-6: var(--yellow-500);
  --chart-7: var(--blue-500);
  --chart-8: var(--red-500);
}

.chart-tooltip {
  background: var(--color-bg-default);
  border: var(--border-width-sm) solid var(--color-border-default);
  border-radius: var(--radius-sm);
  padding: var(--space-md);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.chart-tooltip-title {
  color: var(--color-text-default);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

.chart-tooltip-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-top: var(--space-2xs);
}

.chart-legend {
  display: flex;
  gap: var(--space-lg);
  justify-content: center;
  margin-top: var(--space-lg);
}

.chart-legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.chart-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
}
```

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Chart | データの可視化 | 単純なテキスト表示 |
| DataTable | データの詳細一覧 | 視覚的なトレンド把握 |
