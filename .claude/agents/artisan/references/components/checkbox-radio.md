# Checkbox

## Overview

| 項目 | 値 |
|------|-----|
| Name | Checkbox |
| Description | 選択肢の選択・切替を行うフォーム要素。複数選択 (0個以上) に使用する |
| Figma Source | Luna DS v3 / Checkbox |
| Layer | Atom |
| Category | Form |
| Status | Stable |

> **Note:** Radio ボタンは排他選択用の別コンポーネント。このファイルは Checkbox のみを定義する。

---

## Anatomy

```
┌─ Checkbox ─────────────────────────────────────┐
│                                                │
│  ┌──────┐                                      │
│  │ [1]  │  [2] Label Text                      │
│  │ Box  │  [3] Description (optional)          │
│  └──────┘                                      │
│                                                │
└────────────────────────────────────────────────┘
```

| # | Part | Required | Description |
|----|------|----------|-------------|
| 1 | Checkbox Box | Required | チェックボックス本体 (正方形) |
| 2 | Label | Required | 選択肢の説明テキスト |
| 3 | Description | Optional | ラベルの補足説明 |

---

## Props / API

```typescript
interface CheckboxProps {
  /** チェック状態 (制御コンポーネント) */
  checked?: boolean;
  /** 初期チェック状態 */
  defaultChecked?: boolean;
  /** 不確定状態 (親チェックボックス用) */
  indeterminate?: boolean;
  /** 無効状態 */
  disabled?: boolean;
  /** エラー状態 */
  error?: boolean;
  /** ラベルテキスト */
  label: string;
  /** 補足説明 */
  description?: string;
  /** 状態変更コールバック */
  onCheckedChange?: (checked: boolean) => void;
  /** フォームフィールド名 */
  name?: string;
  /** フォーム値 */
  value?: string;
}
```

---

## Variants

| Variant Axis | Values |
|--------------|--------|
| Status | Enable, Error, Disabled |
| Active | off (unchecked), on (checked), indeterminate |

---

## Size Specifications

| Property | Value |
|----------|-------|
| Box Size | 20px x 20px |
| Touch Target | 44px x 44px (minimum) |
| Border Radius | radius-xs (4px) |
| Border Width | border-width-sm (1px) — unchecked / border-width-md (2px) — focus ring |
| Icon Size (check/minus) | 14px |
| Gap (box - label) | space-sm (8px) |
| Label Font | Body/md-default (14px / Regular) |
| Description Font | Body/sm-default (12px / Regular) |

---

## Token Mapping per State

### Unchecked States

| State | Border | Fill | Label Color |
|-------|--------|------|-------------|
| Default | border-default `#DADADD` | transparent | text-default `#27272A` |
| Hover | Black/400 `#94939D` | bg-interactive `#EFEEF0` | text-default `#27272A` |
| Focus | border-emphasis `#5538EE` + focus ring | transparent | text-default `#27272A` |
| Error | border-critical `#FF001F` | transparent | text-default `#27272A` |
| Disabled | bg-disabled `#DADADD` | bg-disabled `#DADADD` | text-disabled `#94939D` |

### Checked States

| State | Border | Fill | Icon | Label Color |
|-------|--------|------|------|-------------|
| Default | Brand/600 `#5538EE` | Brand/600 `#5538EE` | White check | text-default `#27272A` |
| Hover | Brand/700 `#4D2FD3` | Brand/700 `#4D2FD3` | White check | text-default `#27272A` |
| Focus | Brand/600 `#5538EE` + focus ring | Brand/600 `#5538EE` | White check | text-default `#27272A` |
| Error | Red/600 `#FF001F` | Red/600 `#FF001F` | White check | text-default `#27272A` |
| Disabled | bg-disabled `#DADADD` | bg-disabled `#DADADD` | icon-disabled `#DADADD` | text-disabled `#94939D` |

### Indeterminate State

| State | Border | Fill | Icon | Label Color |
|-------|--------|------|------|-------------|
| Default | Brand/600 `#5538EE` | Brand/600 `#5538EE` | White minus `−` | text-default `#27272A` |
| Hover | Brand/700 `#4D2FD3` | Brand/700 `#4D2FD3` | White minus `−` | text-default `#27272A` |
| Disabled | bg-disabled `#DADADD` | bg-disabled `#DADADD` | icon-disabled `#DADADD` | text-disabled `#94939D` |

### Focus Ring

| Property | Value |
|----------|-------|
| Width | 2px |
| Color | Brand/200 `#C4CAFF` |
| Offset | 2px |
| Trigger | `:focus-visible` のみ (マウスクリックでは非表示) |

---

## Design Tokens

> See: [`design-tokens.md`](../design-tokens.md) for full token definitions

| Token | DS v3 Reference | Resolved Value | Usage |
|-------|----------------|----------------|-------|
| `--checkbox-size` | — | `20px` | ボックスサイズ |
| `--checkbox-radius` | `var(--radius-xs)` | `4px` | 角丸 |
| `--checkbox-border` | `var(--color-border-default)` | `#DADADD` | 未チェック時ボーダー |
| `--checkbox-checked-bg` | `var(--color-bg-emphasis)` | `#5538EE` | チェック済み背景 |
| `--checkbox-checked-hover` | `var(--color-bg-emphasis-interactive)` | `#4D2FD3` | チェック済みホバー |
| `--checkbox-error-border` | `var(--color-border-critical)` | `#FF001F` | エラー時ボーダー |
| `--checkbox-disabled-bg` | `var(--color-bg-disabled)` | `#DADADD` | 無効時背景 |
| `--checkbox-focus-ring` | `var(--brand-200)` | `#C4CAFF` | フォーカスリング |
| `--checkbox-icon-color` | `var(--color-icon-inverse)` | `#FFFFFF` | チェックマーク色 |
| `--checkbox-label-gap` | `var(--space-sm)` | `8px` | ボックス-ラベル間 |

### CSS Custom Properties

```css
.checkbox {
  display: inline-flex;
  align-items: flex-start;
  gap: var(--checkbox-label-gap);
  cursor: pointer;
}

.checkbox__box {
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  min-width: var(--checkbox-size);
  border: var(--border-width-sm) solid var(--checkbox-border);
  border-radius: var(--checkbox-radius);
  transition: background-color 150ms ease, border-color 150ms ease;
}

.checkbox__box:focus-visible {
  outline: 2px solid var(--checkbox-focus-ring);
  outline-offset: 2px;
}

.checkbox[data-state="checked"] .checkbox__box,
.checkbox[data-state="indeterminate"] .checkbox__box {
  background: var(--checkbox-checked-bg);
  border-color: var(--checkbox-checked-bg);
}

.checkbox[data-disabled] {
  pointer-events: none;
}

.checkbox[data-disabled] .checkbox__box {
  background: var(--checkbox-disabled-bg);
  border-color: var(--checkbox-disabled-bg);
}
```

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Unchecked | グレーボーダーの空チェックボックス | `aria-checked="false"` |
| Checked | Brand/600 背景に白チェックマーク | `aria-checked="true"` |
| Indeterminate | Brand/600 背景に白マイナスアイコン | `aria-checked="mixed"` |
| Hover (unchecked) | bg-interactive 背景、ボーダー Black/400 | — |
| Hover (checked) | Brand/700 背景 | — |
| Focus | 2px Brand/200 フォーカスリング, 2px offset | — |
| Error Unchecked | 赤ボーダーの空チェックボックス | `aria-invalid="true"`, `aria-checked="false"` |
| Error Checked | 赤背景に白チェックマーク | `aria-invalid="true"`, `aria-checked="true"` |
| Disabled Unchecked | bg-disabled 背景/ボーダー、操作不可 | `aria-disabled="true"`, `aria-checked="false"` |
| Disabled Checked | bg-disabled 背景、icon-disabled チェック、操作不可 | `aria-disabled="true"`, `aria-checked="true"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `checkbox` | ネイティブ `<input type="checkbox">` 以外の場合 |
| `aria-checked` | `true` / `false` / `mixed` | チェック状態 |
| `aria-invalid` | `true` | Error Status 時 |
| `aria-disabled` | `true` | Disabled 時 |
| `aria-describedby` | description 要素の id | Description 表示時 |

### Keyboard

| Key | Action |
|-----|--------|
| `Space` | チェック/アンチェック切替 |
| `Tab` | 次の要素へフォーカス移動 |
| `Shift+Tab` | 前の要素へフォーカス移動 |

### Color Contrast

- Checked: 白チェックマーク on Brand/600 `#5538EE` — 5.8:1 以上
- Error Checked: 白チェックマーク on Red/600 `#FF001F` — 4.5:1 以上
- Disabled: コントラスト要件なし (WCAG では disabled 要素は除外)

---

## Do / Don't

### Do
- Checkbox は独立した選択に使う (0個以上選択可能)
- ラベルのクリックでも状態変更できるようにする
- エラー時は border-critical で視覚的に示し、エラーメッセージも表示する
- グループ内の一部選択時は親チェックボックスに indeterminate を使う
- touch target は最低 44px を確保する

### Don't
- ON/OFF の即時反映切替に Checkbox を使わない (Switch を使う)
- ラベルなしで使わない
- 排他的選択に Checkbox を使わない (Radio を使う)
- disabled 状態で重要な情報を隠さない

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Checkbox | 複数選択 (0個以上) | 排他的選択 |
| Radio | 排他的選択 (1つだけ) | 複数選択 |
| Switch | ON/OFF 即時反映 | フォーム送信時に反映 |
| Select Button | カード型の視覚的選択 | 標準フォーム内 |

### Composition Patterns
- Field でラップすることでラベル + エラーメッセージ付きフォーム要素として使用可
- CheckboxGroup でグループ化し、indeterminate 親チェックボックスと組み合わせ可能
