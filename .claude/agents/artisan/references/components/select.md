# Select

## Overview

| 項目 | 値 |
|------|-----|
| Name | Select |
| Description | 定義済みの選択肢リストから値を選択するフォーム要素 |
| Figma Source | Luna DS v3 / Select |
| Layer | Molecule |
| Category | Form |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Status | Default, Edit, Focus, Error, Error Edit, disabled |
| Error Text | show, hide (boolean) |
| Description | show, hide (boolean) |

**Note:** TextField と同一のバリアント構造。右端に Chevron アイコンを配置。

---

## Props / API

```typescript
interface SelectProps {
  /** 選択値 (制御コンポーネント) */
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
  /** 値変更コールバック */
  onValueChange?: (value: string) => void;
  /** フォームフィールド名 */
  name?: string;
  /** 選択肢 */
  children: ReactNode;
}
```

---

## Size Specifications

| Property | Value |
|----------|-------|
| Height | 48px |
| Border Radius | radius-sm (8px) |
| Padding Left | 12px |
| Padding Right | 40px (テキスト12px + chevronエリア28px) |
| Border Width | border-width-sm (1px) |
| Chevron Icon | `expand_more` (Material Symbols Rounded, 20px) |
| Chevron Position | right 12px, vertically centered |
| Label Font | Body/sm-bold (12px / Bold) |
| Trigger Font | Body/md-default (14px / Regular) |
| Error Text Font | Body/sm-default (12px / Regular) |
| Gap (label - trigger) | space-xs (6px) |
| Gap (trigger - error/description) | space-xs (6px) |

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
| Edit | border-default (`#DADADD`) | bg-default (`#FFFFFF`) | text-default (`#27272A`) | グレーボーダー、選択済みテキスト表示 |
| Focus | border-emphasis (`#5538EE`) | bg-default (`#FFFFFF`) | text-default (`#27272A`) | ブランドカラーボーダー + フォーカスリング |
| Error | border-critical (`#FF001F`) | Red/50 (`#FFF0F2`) | text-critical (`#D7001A`) | 赤ボーダー、ピンク背景、赤エラーテキスト |
| Error Edit | border-critical (`#FF001F`) | Red/50 (`#FFF0F2`) | text-default (`#27272A`) | 赤ボーダー、ピンク背景、選択済みテキスト + 赤エラーテキスト |
| Disabled | none | bg-tertiary (`#F7F7F8`) | text-disabled (`#94939D`) | グレー背景、グレーテキスト、操作不可 |

### Chevron Color per Status

| Status | Chevron Color |
|--------|--------------|
| Default / Edit | icon-secondary `#94939D` |
| Focus | icon-emphasis `#5538EE` |
| Error / Error Edit | icon-critical `#D7001A` |
| Disabled | icon-disabled `#DADADD` |

---

## Design Tokens

> See: [`design-tokens.md`](../design-tokens.md) for full token definitions

| Token | DS v3 Reference | Resolved Value | Usage |
|-------|----------------|----------------|-------|
| `--select-height` | — | `48px` | トリガー高さ |
| `--select-radius` | `var(--radius-sm)` | `8px` | 角丸 |
| `--select-padding-left` | `var(--space-md)` | `12px` | 左パディング |
| `--select-padding-right` | — | `40px` | 右パディング (chevron含む) |
| `--select-border` | `var(--color-border-default)` | `#DADADD` | デフォルトボーダー |
| `--select-border-focus` | `var(--color-border-emphasis)` | `#5538EE` | フォーカスボーダー |
| `--select-border-error` | `var(--color-border-critical)` | `#FF001F` | エラーボーダー |
| `--select-bg` | `var(--color-bg-default)` | `#FFFFFF` | デフォルト背景 |
| `--select-bg-error` | `var(--red-50)` | `#FFF0F2` | エラー背景 |
| `--select-bg-disabled` | `var(--color-bg-tertiary)` | `#F7F7F8` | 無効背景 |
| `--select-focus-ring` | `var(--brand-200)` | `#C4CAFF` | フォーカスリング |
| `--select-chevron` | `var(--color-icon-secondary)` | `#94939D` | Chevron アイコン色 |
| `--select-border-width` | `var(--border-width-sm)` | `1px` | ボーダー幅 |

### CSS Custom Properties

```css
.select-trigger {
  position: relative;
  height: var(--select-height);
  padding: 0 var(--select-padding-right) 0 var(--select-padding-left);
  background: var(--select-bg);
  border: var(--select-border-width) solid var(--select-border);
  border-radius: var(--select-radius);
  color: var(--color-text-default);
  font: var(--font-weight-regular) var(--font-size-md) / 1.5 var(--font-family);
  cursor: pointer;
}

.select-trigger:focus-visible {
  border-color: var(--select-border-focus);
  outline: 2px solid var(--select-focus-ring);
  outline-offset: 2px;
}

.select-trigger[aria-invalid="true"] {
  border-color: var(--select-border-error);
  background: var(--select-bg-error);
}

.select-trigger:disabled {
  background: var(--select-bg-disabled);
  color: var(--color-text-disabled);
  border: none;
  pointer-events: none;
}

.select-chevron {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--select-chevron);
  pointer-events: none;
}
```

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Default | グレーボーダー border-default (`#DADADD`)、プレースホルダーテキスト、Chevron | `aria-expanded="false"` |
| Edit | グレーボーダー、選択済みテキスト | — |
| Focus | border-emphasis (`#5538EE`) ボーダー + 2px Brand/200 フォーカスリング | `aria-expanded="true"` |
| Error | border-critical (`#FF001F`) ボーダー、ピンク背景 `#FFF0F2`、赤エラーテキスト | `aria-invalid="true"` |
| Error Edit | border-critical ボーダー、ピンク背景、選択済みテキスト + 赤エラーテキスト | `aria-invalid="true"` |
| Disabled | bg-tertiary (`#F7F7F8`) 背景、グレーテキスト、操作不可 | `aria-disabled="true"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `aria-expanded` | `true/false` | ドロップダウン開閉 |
| `aria-haspopup` | `listbox` | 常時 |
| `aria-invalid` | `true` | Error / Error Edit 時 |
| `aria-disabled` | `true` | disabled 時 |
| `aria-describedby` | エラー/説明テキストID | Error Text または Description 表示時 |

### Keyboard

| Key | Action |
|-----|--------|
| `Enter` / `Space` | ドロップダウン開閉 / 選択肢決定 |
| `ArrowUp` / `ArrowDown` | 選択肢間の移動 |
| `Escape` | ドロップダウンを閉じる |
| `Tab` | 次の要素へフォーカス移動 |

### Color Contrast

- 入力テキスト Black/950 on 白背景 — 4.5:1 以上
- エラーテキスト Red/700 on Red/50 — 4.5:1 以上
- Chevron icon-secondary on 白背景 — 3:1 以上 (非テキスト要素)

---

## Do / Don't

### Do
- 選択肢が5個以下なら RadioButton を検討
- 選択肢が10個以上なら検索機能を有効化
- プレースホルダーに「選択してください」を使う

### Don't
- 2択に Select を使わない (Switch を使う)
- 長いラベルでトリガー幅を圧迫しない

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Select | 6個以上の排他選択 | 自由入力が必要 |
| RadioGroup | 2-5個の排他選択 | 選択肢が多い |
| Select Oneline | シンプルな選択 (ブラウザネイティブ) | 検索・フィルタが必要 |
| TextField | 自由テキスト入力 | 定義済み選択肢 |
