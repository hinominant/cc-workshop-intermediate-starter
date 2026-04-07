# TextField

## Overview

| 項目 | 値 |
|------|-----|
| Name | TextField |
| Description | テキストデータの入力を受け付けるフォーム要素 |
| Figma Source | Luna DS v3 / TextField |
| Layer | Atom |
| Category | Form |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Status | Default, Edit, Focus, Error, Error Edit, disabled |
| Error Text | show, hide (boolean) |
| Description | show, hide (boolean) |

---

## Props / API

```typescript
interface TextFieldProps {
  /** 入力値 (制御コンポーネント) */
  value?: string;
  /** 初期値 */
  defaultValue?: string;
  /** ラベルテキスト */
  label: string;
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** 入力タイプ */
  type?: 'text' | 'email' | 'tel' | 'password' | 'url' | 'number';
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
| Height | 48px |
| Border Radius | radius-sm (8px) |
| Padding Horizontal | 12px |
| Padding Vertical | 12px |
| Border Width | border-width-sm (1px) |
| Label Font | Body/sm-bold (12px / Bold) |
| Input Font | Body/md-default (14px / Regular) |
| Placeholder Font | Body/md-default (14px / Regular) |
| Error Text Font | Body/sm-default (12px / Regular) |
| Description Font | Body/sm-default (12px / Regular) |
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
| Edit | border-default (`#DADADD`) | bg-default (`#FFFFFF`) | text-default (`#27272A`) | グレーボーダー、入力済みテキスト表示 |
| Focus | border-emphasis (`#5538EE`) | bg-default (`#FFFFFF`) | text-default (`#27272A`) | ブランドカラーボーダー + フォーカスリング |
| Error | border-critical (`#FF001F`) | Red/50 (`#FFF0F2`) | text-critical (`#D7001A`) | 赤ボーダー、ピンク背景、赤エラーテキスト |
| Error Edit | border-critical (`#FF001F`) | Red/50 (`#FFF0F2`) | text-default (`#27272A`) | 赤ボーダー、ピンク背景、入力済みテキスト + 赤エラーテキスト |
| Disabled | none | bg-tertiary (`#F7F7F8`) | text-disabled (`#94939D`) | グレー背景、グレーテキスト、操作不可 |

---

## Design Tokens

> See: [`design-tokens.md`](../design-tokens.md) for full token definitions

| Token | DS v3 Reference | Resolved Value | Usage |
|-------|----------------|----------------|-------|
| `--input-height` | — | `48px` | 入力フィールド高さ |
| `--input-radius` | `var(--radius-sm)` | `8px` | 角丸 |
| `--input-padding-x` | `var(--space-md)` | `12px` | 水平パディング |
| `--input-padding-y` | `var(--space-md)` | `12px` | 垂直パディング |
| `--input-border` | `var(--color-border-default)` | `#DADADD` | デフォルトボーダー |
| `--input-border-focus` | `var(--color-border-emphasis)` | `#5538EE` | フォーカスボーダー |
| `--input-border-error` | `var(--color-border-critical)` | `#FF001F` | エラーボーダー |
| `--input-bg` | `var(--color-bg-default)` | `#FFFFFF` | デフォルト背景 |
| `--input-bg-error` | `var(--red-50)` | `#FFF0F2` | エラー背景 |
| `--input-bg-disabled` | `var(--color-bg-tertiary)` | `#F7F7F8` | 無効背景 |
| `--input-text` | `var(--color-text-default)` | `#27272A` | 入力テキスト色 |
| `--input-placeholder` | `var(--color-text-disabled)` | `#94939D` | プレースホルダー色 |
| `--input-focus-ring` | `var(--brand-200)` | `#C4CAFF` | フォーカスリング |
| `--input-border-width` | `var(--border-width-sm)` | `1px` | ボーダー幅 |

### CSS Custom Properties

```css
.input {
  height: var(--input-height);
  padding: var(--input-padding-y) var(--input-padding-x);
  background: var(--input-bg);
  border: var(--input-border-width) solid var(--input-border);
  border-radius: var(--input-radius);
  color: var(--input-text);
  font: var(--font-weight-regular) var(--font-size-md) / 1.5 var(--font-family);
}

.input::placeholder {
  color: var(--input-placeholder);
}

.input:focus-visible {
  border-color: var(--input-border-focus);
  outline: 2px solid var(--input-focus-ring);
  outline-offset: 2px;
}

.input[aria-invalid="true"] {
  border-color: var(--input-border-error);
  background: var(--input-bg-error);
}

.input:disabled {
  background: var(--input-bg-disabled);
  color: var(--color-text-disabled);
  border: none;
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
| Disabled | bg-tertiary (`#F7F7F8`) 背景、グレーテキスト、操作不可 | `aria-disabled="true"` |

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
| `Tab` | フォーカス移動 |
| `Enter` | フォーム送信 (フォーム内時) |

### Color Contrast

- 入力テキスト Black/950 on 白背景 — 4.5:1 以上
- エラーテキスト Red/700 on Red/50 — 4.5:1 以上
- disabled テキスト Black/400 on Black/50 — 3:1 以上
- プレースホルダー Black/400 on 白背景 — 3.3:1 (WCAG AA non-text)

---

## Do / Don't

### Do
- ラベルは常に表示する (プレースホルダーはラベルの代替にならない)
- エラーメッセージは「何が + なぜ + どうすれば」の3要素
- 適切な `type` を使う (email, tel 等)

### Don't
- プレースホルダーをラベル代わりにしない
- エラーメッセージを赤色のみで示さない
- disabled 状態で重要な情報を隠さない

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| TextField | 1行のテキスト入力 | 複数行のテキスト |
| TextArea | 複数行のテキスト入力 | 1行で収まる入力 |
| Select | 定義済み選択肢から選ぶ | 自由入力が必要 |
| Input Group | プレフィックス/サフィックス付き入力 | シンプルなテキスト入力 |
