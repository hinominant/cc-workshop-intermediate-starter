# TextArea

## Overview

| 項目 | 値 |
|------|-----|
| Name | TextArea |
| Description | 複数行テキスト入力フィールド |
| Figma Source | Luna DS v3 / TextArea |
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

**Note:** TextField と同一のバリアント構造。Figma には disabled が無いが、実装では追加必須。

---

## Props / API

```typescript
interface TextAreaProps {
  /** 入力値 (制御コンポーネント) */
  value?: string;
  /** 初期値 */
  defaultValue?: string;
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
  /** 必須フィールド */
  required?: boolean;
  /** 最大文字数 */
  maxLength?: number;
  /** 行数 (初期表示行) */
  rows?: number;
  /** 値変更コールバック */
  onChange?: (value: string) => void;
  /** フォームフィールド名 */
  name?: string;
}
```

---

## Size Specifications

| Property | Value |
|----------|-------|
| Min Height | 120px |
| Border Radius | radius-sm (8px) |
| Padding | 12px all (上下左右) |
| Border Width | border-width-sm (1px) |
| Resize | vertical only |
| Label Font | Body/sm-bold (12px / Bold) |
| Input Font | Body/md-default (14px / Regular) |
| Placeholder Font | Body/md-default (14px / Regular) |
| Error Text Font | Body/sm-default (12px / Regular) |
| Description Font | Body/sm-default (12px / Regular) |
| Gap (label - textarea) | space-xs (6px) |
| Gap (textarea - error/description) | space-xs (6px) |
| Line Height | 1.5 (21px at 14px font) |

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
| Edit | border-default (`#DADADD`) | bg-default (`#FFFFFF`) | text-default (`#27272A`) | グレーボーダー、入力済みテキスト表示 |
| Focus | border-emphasis (`#5538EE`) | bg-default (`#FFFFFF`) | text-default (`#27272A`) | ブランドカラーボーダー + フォーカスリング |
| Error | border-critical (`#FF001F`) | Red/50 (`#FFF0F2`) | text-critical (`#D7001A`) | 赤ボーダー、ピンク背景、赤エラーテキスト |
| Error Edit | border-critical (`#FF001F`) | Red/50 (`#FFF0F2`) | text-default (`#27272A`) | 赤ボーダー、ピンク背景、入力済みテキスト + 赤エラーテキスト |
| Disabled | none | bg-tertiary (`#F7F7F8`) | text-disabled (`#94939D`) | グレー背景、グレーテキスト、操作不可、リサイズ不可 |

---

## Design Tokens

> See: [`design-tokens.md`](../design-tokens.md) for full token definitions

| Token | DS v3 Reference | Resolved Value | Usage |
|-------|----------------|----------------|-------|
| `--textarea-min-height` | — | `120px` | 最小高さ |
| `--textarea-radius` | `var(--radius-sm)` | `8px` | 角丸 |
| `--textarea-padding` | `var(--space-md)` | `12px` | パディング (全方向) |
| `--textarea-border` | `var(--color-border-default)` | `#DADADD` | デフォルトボーダー |
| `--textarea-border-focus` | `var(--color-border-emphasis)` | `#5538EE` | フォーカスボーダー |
| `--textarea-border-error` | `var(--color-border-critical)` | `#FF001F` | エラーボーダー |
| `--textarea-bg` | `var(--color-bg-default)` | `#FFFFFF` | デフォルト背景 |
| `--textarea-bg-error` | `var(--red-50)` | `#FFF0F2` | エラー背景 |
| `--textarea-bg-disabled` | `var(--color-bg-tertiary)` | `#F7F7F8` | 無効背景 |
| `--textarea-text` | `var(--color-text-default)` | `#27272A` | 入力テキスト色 |
| `--textarea-placeholder` | `var(--color-text-disabled)` | `#94939D` | プレースホルダー色 |
| `--textarea-focus-ring` | `var(--brand-200)` | `#C4CAFF` | フォーカスリング |
| `--textarea-border-width` | `var(--border-width-sm)` | `1px` | ボーダー幅 |

### CSS Custom Properties

```css
.textarea {
  min-height: var(--textarea-min-height);
  padding: var(--textarea-padding);
  background: var(--textarea-bg);
  border: var(--textarea-border-width) solid var(--textarea-border);
  border-radius: var(--textarea-radius);
  color: var(--textarea-text);
  font: var(--font-weight-regular) var(--font-size-md) / 1.5 var(--font-family);
  resize: vertical;
}

.textarea::placeholder {
  color: var(--textarea-placeholder);
}

.textarea:focus-visible {
  border-color: var(--textarea-border-focus);
  outline: 2px solid var(--textarea-focus-ring);
  outline-offset: 2px;
}

.textarea[aria-invalid="true"] {
  border-color: var(--textarea-border-error);
  background: var(--textarea-bg-error);
}

.textarea:disabled {
  background: var(--textarea-bg-disabled);
  color: var(--color-text-disabled);
  border: none;
  resize: none;
  pointer-events: none;
}
```

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Default | グレーボーダー border-default (`#DADADD`)、プレースホルダーテキスト | — |
| Edit | グレーボーダー、入力済みテキスト | — |
| Focus | border-emphasis (`#5538EE`) ボーダー + 2px Brand/200 フォーカスリング | — |
| Error | border-critical (`#FF001F`) ボーダー、ピンク背景 `#FFF0F2`、赤エラーテキスト | `aria-invalid="true"` |
| Error Edit | border-critical ボーダー、ピンク背景、入力済みテキスト + 赤エラーテキスト | `aria-invalid="true"` |
| Disabled | bg-tertiary (`#F7F7F8`) 背景、グレーテキスト、リサイズ不可、操作不可 | `aria-disabled="true"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `aria-invalid` | `true` | Error / Error Edit 時 |
| `aria-disabled` | `true` | disabled 時 |
| `aria-describedby` | エラー/説明テキストID | Error Text または Description 表示時 |
| `aria-required` | `true` | 必須フィールド時 |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | フォーカス移動 (テキストエリア内ではインデント入力しない) |
| `Enter` | 改行入力 |

### Color Contrast

- 入力テキスト Black/950 on 白背景 — 4.5:1 以上
- エラーテキスト Red/700 on Red/50 — 4.5:1 以上
- disabled テキスト Black/400 on Black/50 — 3:1 以上
- プレースホルダー Black/400 on 白背景 — 3.3:1 (WCAG AA non-text)

---

## Do / Don't

### Do
- 複数行の入力が必要な場面で使用
- min-height 120px で十分な入力領域を確保
- maxLength を設定し、残り文字数を表示する
- resize: vertical のみ許可 (水平リサイズはレイアウト崩れの原因)

### Don't
- 1行のテキスト入力には使わない (TextField を使う)
- プレースホルダーをラベル代わりにしない
- resize: both や resize: horizontal を使わない
- disabled 状態で重要な情報を隠さない

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| TextArea | 複数行のテキスト入力が必要 | 1行の短いテキスト入力 |
| TextField | 1行のテキスト入力 | 長文入力が必要な場面 |
| Input Group | プレフィックス/サフィックス付き入力 | 複数行テキスト |
