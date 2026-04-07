# Select Button

## Overview

| 項目 | 値 |
|------|-----|
| Name | Select Button |
| Description | カード型の選択肢ボタン。タップで選択/解除を切り替える |
| Figma Source | Luna DS v3 / Select Button |
| Layer | Atom |
| Category | Form |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Size | S, M |
| Status | Off, On, disabled |

---

## Props

| Property | Type | Description |
|----------|------|-------------|
| Label | Text | 選択肢のテキスト |
| Size | Enum (S/M) | ボタンサイズ |
| Status | Enum (Off/On/disabled) | 選択状態 |

---

## Token Mapping per Size/Status

### Size S

| Property | Value |
|----------|-------|
| Radius | 8px |
| Padding | 12px all |
| Stroke (Off) | 1px |
| Stroke (On) | 2px |

### Size M

| Property | Value |
|----------|-------|
| Radius | 8px |
| Padding | 16/12 (top-bottom/left-right) |
| Stroke (Off) | 1px |
| Stroke (On) | 2px |

### Status Colors

| Status | Background | Text Color | Border | Font Weight |
|--------|-----------|------------|--------|-------------|
| Off | bg-default (`#FFFFFF`) | text-default (`#27272A`) | border-default (`#DADADD`) 1px | 400 (Regular) |
| On | bg-default (`#FFFFFF`) | text-emphasis (`#5538EE`) | border-emphasis (`#5538EE`) 2px | 700 (Bold) |
| disabled | bg-tertiary (`#F7F7F8`) | text-disabled (`#94939D`) | none | 400 (Regular) |

---

## Size Specifications

| Size | Radius | Padding | Off Stroke | On Stroke |
|------|--------|---------|-----------|----------|
| S | 8px | 12px all | 1px | 2px |
| M | 8px | 16/12 (Y/X) | 1px | 2px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Off | 白背景、グレーボーダー 1px、通常テキスト | `aria-pressed="false"` |
| On | 白背景、Brand ボーダー 2px、Brand テキスト、Bold | `aria-pressed="true"` |
| disabled | bg-tertiary (`#F7F7F8`) 背景、グレーテキスト、ボーダーなし | `aria-disabled="true"` |
| hover | 背景色を微調整 | --- |
| focus | focus-ring 表示（`:focus-visible` のみ） | --- |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `aria-pressed` | `true/false` | トグルボタンとして使用時 |
| `aria-disabled` | `true` | disabled 時 |

### Keyboard

| Key | Action |
|-----|--------|
| `Enter` / `Space` | 選択/解除をトグル |
| `Tab` | 次の SelectButton へフォーカス移動 |

### Color Contrast

- Off: Black/950 テキスト on 白背景 → 4.5:1 以上
- On: Brand/600 テキスト on 白背景 → 4.5:1 以上
- Disabled: Black/400 テキスト on Black/50 背景 → 3:1 以上

---

## Do / Don't

### Do
- 短いラベル（1〜6文字）を使う
- プロフィール設定やアンケートの選択肢に使用
- グリッドレイアウトで複数並べる

### Don't
- 長文ラベルを入れない
- ナビゲーション用途に使わない
- 1個だけで使わない（最低2個以上）

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Select Button | 視覚的に目立つカード型選択 | 選択肢が多い（7個以上） |
| RadioGroup | フォーム内の排他選択 | 視覚的強調が必要 |
| Segmented Controls | ビュー/モード切り替え | フォーム入力の選択 |
