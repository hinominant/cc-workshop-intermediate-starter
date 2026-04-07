# Field

## Overview

| 項目 | 値 |
|------|-----|
| Name | Field |
| Description | フォームフィールドラッパー（Label + Input + Error/Description） |
| Figma Source | Luna DS v3 / TextField |
| Layer | Molecule |
| Category | Form |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| State | Default, Error |
| Show Description | on, off |
| Show Error | on, off |
| Required | on, off |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| label | string | — | フィールドラベル |
| htmlFor | string | — | 関連する入力要素のID |
| required | boolean | `false` | 必須フィールド |
| description | string | — | 補足説明テキスト（省略可） |
| error | string | — | エラーメッセージ（省略可） |
| children | ReactNode | — | 入力コンポーネント（Input, Select, Textarea 等） |

---

## Token Mapping

### Container

| Property | Token | Value |
|----------|-------|-------|
| Layout | — | flexbox column |
| Gap | `space-xs` | 6px |

### Label

| Property | Token | Value |
|----------|-------|-------|
| Font | `Body/sm-bold` | 12px / Bold |
| Color | `text-default` | `#27272A` |
| Required Indicator | — | `*` (Red/700 `#D7001A`) |
| Gap (label-asterisk) | `space-3xs` | 2px |

### Description

| Property | Token | Value |
|----------|-------|-------|
| Font | `Body/xs-default` | 11px / Regular |
| Color | `text-secondary` | `#777681` |
| Margin Top | — | 0 (gap で制御) |

### Error Message

| Property | Token | Value |
|----------|-------|-------|
| Font | `Body/xs-default` | 11px / Regular |
| Color | `text-critical` | `#D7001A` |
| Icon | — | Material Symbols `error` 16px |
| Icon Color | `icon-critical` | `#D7001A` |
| Gap (icon-text) | `space-2xs` | 4px |

---

## Layout Structure

```
┌─ Field Container (gap: 6px) ─────────────┐
│  Label (sm-bold) *                        │
│  ┌─ Input / Select / Textarea ──────────┐ │
│  │  (children)                           │ │
│  └──────────────────────────────────────┘ │
│  Description or Error (xs-default)        │
└───────────────────────────────────────────┘
```

### Spacing Detail

| Gap | Token | Value | Between |
|-----|-------|-------|---------|
| Label → Input | `space-xs` | 6px | ラベルと入力要素 |
| Input → Description | `space-xs` | 6px | 入力要素と説明/エラー |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Default | ラベル + 入力 + 説明 | — |
| Required | ラベルに赤アスタリスク | `aria-required="true"` (入力要素) |
| Error | エラーメッセージ表示、入力要素にエラーボーダー | `aria-invalid="true"` (入力要素) |
| Disabled | ラベル色 `text-disabled`、入力要素 disabled | `aria-disabled="true"` (入力要素) |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `aria-required` | `true` | required 時（入力要素に付与） |
| `aria-invalid` | `true` | error 時（入力要素に付与） |
| `aria-describedby` | description/error の ID | description または error 表示時 |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | 入力要素へフォーカス移動 |

### Color Contrast

- Label: `text-default` on `bg-default` → 4.5:1 以上
- Description: `text-secondary` on `bg-default` → 4.5:1 以上
- Error: `text-critical` on `bg-default` → 4.5:1 以上

---

## Do / Don't

### Do
- ラベルは常に表示する（プレースホルダーで代用しない）
- エラーメッセージは具体的な修正方法を示す
- 必須フィールドにはアスタリスクを表示する
- description と error が同時に必要な場合は error を優先表示

### Don't
- ラベルなしで入力要素を使用しない
- エラーメッセージを赤色以外で表示しない
- 複数のエラーメッセージを同時に表示しない

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Field | フォーム内の入力フィールドラッパー | ラベル不要のインライン入力 |
| Label | 単独でラベルが必要な場合 | Field で十分な場合 |
| Input | 入力要素単体 | ラベル・エラー付きで使う場合 |
