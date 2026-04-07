# DatePicker

## Overview

| 項目 | 値 |
|------|-----|
| Name | DatePicker |
| Description | 日付入力フィールド。カレンダーアイコン付き |
| Figma Source | Luna DS v3 / DatePicker |
| Layer | Atom |
| Category | Form |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Status | Default, Edit, Focus, Error, Error Edit |
| Error Text | show, hide (boolean) |
| Description | show, hide (boolean) |

**Note:** TextField と同一のバリアント構造だが、disabled は Figma に無い (実装では追加推奨)。

---

## Props / API

```typescript
interface DatePickerProps {
  /** 日付値 (制御コンポーネント) */
  value?: Date | null;
  /** 初期値 */
  defaultValue?: Date;
  /** ラベルテキスト */
  label: string;
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** 無効状態 */
  disabled?: boolean;
  /** エラー状態 */
  error?: boolean;
  /** エラーメッセージ */
  errorMessage?: string;
  /** 補足説明 */
  description?: string;
  /** 日付フォーマット */
  format?: string;
  /** 最小日付 */
  minDate?: Date;
  /** 最大日付 */
  maxDate?: Date;
  /** 値変更コールバック */
  onDateChange?: (date: Date | null) => void;
  /** フォームフィールド名 */
  name?: string;
}
```

---

## Size Specifications

| Property | Value |
|----------|-------|
| Height | 48px |
| Border Radius | radius-sm (8px) |
| Padding Left | 12px |
| Padding Right | 40px (テキスト12px + calendarアイコンエリア28px) |
| Border Width | border-width-sm (1px) |
| Calendar Icon | `calendar_today` (Material Symbols Rounded, 20px) |
| Calendar Icon Position | right 12px, vertically centered |
| Label Font | Body/sm-bold (12px / Bold) |
| Input Font | Body/md-default (14px / Regular) |
| Error Text Font | Body/sm-default (12px / Regular) |
| Gap (label - input) | space-xs (6px) |
| Gap (input - error/description) | space-xs (6px) |

### Focus Ring

| Property | Value |
|----------|-------|
| Width | 2px |
| Color | Brand/200 `#C4CAFF` |
| Offset | 2px |
| Trigger | `:focus-visible` のみ |

---

## Token Mapping per Status

| Status | Border Color | Background | Text Color | Description |
|--------|-------------|------------|------------|-------------|
| Default | border-default (`#DADADD`) | bg-default (`#FFFFFF`) | Placeholder: text-disabled (`#94939D`) | グレーボーダー、プレースホルダー表示 |
| Edit | border-default (`#DADADD`) | bg-default (`#FFFFFF`) | text-default (`#27272A`) | グレーボーダー、日付値表示 |
| Focus | border-emphasis (`#5538EE`) | bg-default (`#FFFFFF`) | text-default (`#27272A`) | ブランドカラーボーダー + フォーカスリング |
| Error | border-critical (`#FF001F`) | Red/50 (`#FFF0F2`) | text-critical (`#D7001A`) | 赤ボーダー、ピンク背景、赤エラーテキスト |
| Error Edit | border-critical (`#FF001F`) | Red/50 (`#FFF0F2`) | text-default (`#27272A`) | 赤ボーダー、ピンク背景、日付値 + 赤エラーテキスト |
| Disabled | none | bg-tertiary (`#F7F7F8`) | text-disabled (`#94939D`) | グレー背景、操作不可 |

### Calendar Icon Color per Status

| Status | Icon Color |
|--------|-----------|
| Default / Edit | icon-secondary `#94939D` |
| Focus | icon-emphasis `#5538EE` |
| Error / Error Edit | icon-critical `#D7001A` |
| Disabled | icon-disabled `#DADADD` |

---

## Design Tokens

> See: [`design-tokens.md`](../design-tokens.md) for full token definitions

| Token | DS v3 Reference | Resolved Value | Usage |
|-------|----------------|----------------|-------|
| `--datepicker-height` | — | `48px` | 入力フィールド高さ |
| `--datepicker-radius` | `var(--radius-sm)` | `8px` | 角丸 |
| `--datepicker-padding-left` | `var(--space-md)` | `12px` | 左パディング |
| `--datepicker-padding-right` | — | `40px` | 右パディング (icon含む) |
| `--datepicker-border` | `var(--color-border-default)` | `#DADADD` | デフォルトボーダー |
| `--datepicker-border-focus` | `var(--color-border-emphasis)` | `#5538EE` | フォーカスボーダー |
| `--datepicker-border-error` | `var(--color-border-critical)` | `#FF001F` | エラーボーダー |
| `--datepicker-bg` | `var(--color-bg-default)` | `#FFFFFF` | デフォルト背景 |
| `--datepicker-bg-error` | `var(--red-50)` | `#FFF0F2` | エラー背景 |
| `--datepicker-bg-disabled` | `var(--color-bg-tertiary)` | `#F7F7F8` | 無効背景 |
| `--datepicker-focus-ring` | `var(--brand-200)` | `#C4CAFF` | フォーカスリング |
| `--datepicker-icon` | `var(--color-icon-secondary)` | `#94939D` | カレンダーアイコン色 |
| `--datepicker-border-width` | `var(--border-width-sm)` | `1px` | ボーダー幅 |

### CSS Custom Properties

```css
.datepicker {
  position: relative;
  height: var(--datepicker-height);
  padding: 0 var(--datepicker-padding-right) 0 var(--datepicker-padding-left);
  background: var(--datepicker-bg);
  border: var(--datepicker-border-width) solid var(--datepicker-border);
  border-radius: var(--datepicker-radius);
  color: var(--color-text-default);
  font: var(--font-weight-regular) var(--font-size-md) / 1.5 var(--font-family);
}

.datepicker:focus-visible {
  border-color: var(--datepicker-border-focus);
  outline: 2px solid var(--datepicker-focus-ring);
  outline-offset: 2px;
}

.datepicker[aria-invalid="true"] {
  border-color: var(--datepicker-border-error);
  background: var(--datepicker-bg-error);
}

.datepicker:disabled {
  background: var(--datepicker-bg-disabled);
  color: var(--color-text-disabled);
  border: none;
  pointer-events: none;
}

.datepicker__icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--datepicker-icon);
  pointer-events: none;
}
```

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Default | グレーボーダー border-default (`#DADADD`)、プレースホルダー「年月日」、カレンダーアイコン | — |
| Edit | グレーボーダー、日付値表示 (YYYY/MM/DD) | — |
| Focus | border-emphasis (`#5538EE`) ボーダー + 2px Brand/200 フォーカスリング | — |
| Error | border-critical (`#FF001F`) ボーダー、ピンク背景 `#FFF0F2`、赤エラーテキスト | `aria-invalid="true"` |
| Error Edit | border-critical ボーダー、ピンク背景、日付値 + 赤エラーテキスト | `aria-invalid="true"` |
| Disabled | bg-tertiary (`#F7F7F8`) 背景、グレーテキスト、操作不可 | `aria-disabled="true"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `aria-invalid` | `true` | Error / Error Edit 時 |
| `aria-disabled` | `true` | disabled 時 |
| `aria-describedby` | エラー/説明テキストID | Error Text または Description 表示時 |
| `aria-haspopup` | `dialog` | カレンダーポップアップがある場合 |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | フォーカス移動 |
| `Enter` / `Space` | カレンダーポップアップの開閉 |
| `Escape` | カレンダーポップアップを閉じる |
| `ArrowUp/Down/Left/Right` | カレンダー内の日付移動 |

### Color Contrast

- 入力テキスト Black/950 on 白背景 — 4.5:1 以上
- エラーテキスト Red/700 on Red/50 — 4.5:1 以上
- カレンダーアイコン icon-secondary on 白背景 — 3:1 以上 (非テキスト要素)

---

## Do / Don't

### Do
- 表示フォーマットは `YYYY/MM/DD` を使用
- エラー時は Error Text を show にしてエラー内容を表示
- minDate / maxDate で入力範囲を制限する

### Don't
- 日時 (時刻含む) の入力には使わない
- プレースホルダーをラベル代わりにしない
- カレンダーアイコンを非表示にしない

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| DatePicker | 日付の入力が必要 | 日時 (時刻含む) の入力 |
| TextField | 自由テキスト入力 | 日付入力 |
| Select | 選択肢からの選択 | 日付入力 |
