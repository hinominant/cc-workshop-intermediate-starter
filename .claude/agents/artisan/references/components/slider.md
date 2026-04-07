# Slider

## Overview

| 項目 | 値 |
|------|-----|
| Name | Slider |
| Description | 範囲内の値を選択するレンジ入力 |
| Figma Source | Luna DS v3 / Slider |
| Layer | Atom |
| Category | Form |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Status | Enable, Disable, Hover, Active |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| min | `number` | `0` | 最小値 |
| max | `number` | `100` | 最大値 |
| step | `number` | `1` | ステップ値 |
| value | `number[]` | — | 現在値（制御コンポーネント） |
| defaultValue | `number[]` | `[0]` | 初期値 |
| onValueChange | `(value: number[]) => void` | — | 値変更コールバック |
| disabled | `boolean` | `false` | 無効状態 |

---

## Token Mapping

### Track (背景トラック)

| State | Property | Token | Value |
|-------|----------|-------|-------|
| Default | background | `bg-interactive` | `#EFEEF0` (Black/100) |
| Default | height | — | 4px |
| Default | border-radius | `radius-full` | 9999px |
| Disabled | background | `bg-interactive` | `#EFEEF0` (Black/100) |

### Range (選択済みトラック)

| State | Property | Token | Value |
|-------|----------|-------|-------|
| Default | background | `bg-emphasis` | `#5538EE` (Brand/600) |
| Hover | background | `bg-emphasis-interactive` | `#4D2FD3` (Brand/700) |
| Disabled | background | `bg-disabled` | `#DADADD` (Black/200) |

### Thumb

| State | Property | Token | Value |
|-------|----------|-------|-------|
| Default | background | `bg-default` | `#FFFFFF` (Black/0) |
| Default | border | `border-emphasis` | `#5538EE` (Brand/600), 2px |
| Default | size | — | 20px (circle) |
| Default | border-radius | `radius-full` | 9999px |
| Default | box-shadow | — | `0 1px 3px rgba(0,0,0,0.1)` |
| Hover | border-color | `border-emphasis` | `#5538EE` (Brand/600) |
| Hover | box-shadow | — | `0 0 0 4px rgba(85,56,238,0.15)` |
| Active | border-color | `bg-emphasis-interactive` | `#4D2FD3` (Brand/700) |
| Active | transform | — | scale(1.1) |
| Disabled | background | `bg-default` | `#FFFFFF` (Black/0) |
| Disabled | border-color | `border-default` | `#DADADD` (Black/200) |
| Disabled | box-shadow | — | none |

---

## Size Specifications

| Part | Dimension | Value |
|------|-----------|-------|
| Track | height | 4px |
| Track | border-radius | `radius-full` (9999px) |
| Thumb | width x height | 20px x 20px |
| Thumb | border-width | `border-width-md` (2px) |
| Thumb hit area | — | 40px x 40px (transparent) |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Enable | Track: `bg-interactive`, Range: `bg-emphasis`, Thumb: white + border | — |
| Hover | Range: `bg-emphasis-interactive`, Thumb: ring shadow | — |
| Active | Thumb: scale(1.1), border darkened | — |
| Disabled | Range: `bg-disabled`, Thumb: border `border-default` | `aria-disabled="true"` |
| Focus | Thumb: focus-ring (`:focus-visible`) | — |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `slider` | Thumb 要素 |
| `aria-valuenow` | 現在値 | 常時 |
| `aria-valuemin` | min 値 | 常時 |
| `aria-valuemax` | max 値 | 常時 |
| `aria-disabled` | `true` | disabled 時 |
| `aria-label` | スライダーの説明 | ラベルがない場合 |

### Keyboard

| Key | Action |
|-----|--------|
| `ArrowRight` / `ArrowUp` | 値を step 分増加 |
| `ArrowLeft` / `ArrowDown` | 値を step 分減少 |
| `PageUp` | 値を step x 10 増加 |
| `PageDown` | 値を step x 10 減少 |
| `Home` | min に設定 |
| `End` | max に設定 |

---

## Do / Don't

### Do
- ラベルと現在値を表示する
- step を適切に設定して精度を制御する
- Thumb に十分なヒットエリアを確保する（40px 以上）

### Don't
- 精密な数値入力に Slider だけを使わない（Input と併用）
- min/max の範囲を極端に広くしない
- step を小数点以下 3 桁以上にしない

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Slider | 範囲内の値をおおまかに選択 | 精密な数値入力 |
| Input (number) | 正確な数値入力 | おおまかな範囲選択 |
