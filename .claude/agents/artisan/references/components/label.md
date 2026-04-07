# Label

## Overview

| 項目 | 値 |
|------|-----|
| Name | Label |
| Description | フォームラベル |
| Figma Source | Luna DS v3 / Label |
| Layer | Atom |
| Category | Form |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Required | on, off |
| Disabled | on, off |
| Size | M, S |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| htmlFor | string | — | 関連する入力要素のID |
| required | boolean | `false` | 必須インジケーター表示 |
| disabled | boolean | `false` | 無効状態 |
| size | `M` \| `S` | `M` | サイズバリアント |
| children | ReactNode | — | ラベルテキスト |

---

## Token Mapping

### Text

| Size | Font Style | Font Size | Font Weight |
|------|-----------|-----------|-------------|
| M | `Body/sm-bold` | 12px | Bold (700) |
| S | `Body/xs-bold` | 11px | Bold (700) |

### Text Color — State

| State | Token | Value |
|-------|-------|-------|
| Default | `text-default` | `#27272A` |
| Disabled | `text-disabled` | `#94939D` |

### Required Indicator

| Property | Value |
|----------|-------|
| Content | `*` |
| Color | Red/700 (`#D7001A`) |
| Font Weight | Bold (700) |
| Gap (label-asterisk) | `space-3xs` (2px) |
| Position | ラベルテキストの直後 |

---

## Layout

### Default
```
Label Text
```

### Required
```
Label Text *
           ↑ Red/700
```

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Default | 通常テキスト表示 | — |
| Required | 赤アスタリスク表示 | — |
| Disabled | テキスト色 disabled | — |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `for` | 入力要素のID | 常に |
| `aria-required` | — | required は入力要素側で管理 |

### Semantic HTML

- `<label>` 要素を使用する
- `htmlFor` で対応する `<input>` と関連付ける
- クリック時に関連入力要素にフォーカスが移動することを保証

### Color Contrast

- Default: `text-default` on `bg-default` → 4.5:1 以上
- Disabled: `text-disabled` on `bg-default` → 装飾的（AA準拠不要だが推奨）
- Required indicator: Red/700 on `bg-default` → 4.5:1 以上

---

## Do / Don't

### Do
- 全ての入力要素にラベルを付ける
- ラベルは簡潔で明確にする（「メールアドレス」「電話番号」）
- required の場合はアスタリスクを表示する
- htmlFor で入力要素と明示的に関連付ける

### Don't
- ラベルをプレースホルダーで代用しない
- ラベルテキストを全て大文字にしない
- 2行以上のラベルテキストを使用しない
- disabled ラベルのアスタリスクを非表示にしない

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Label | 単体でラベルが必要な場合 | Field でラッパーごと使う場合 |
| Field | ラベル + 入力 + エラーの完全なフィールド | ラベル単体 |
| Input | ラベルなしのインライン入力 | ラベルが必要な場合は Field を使用 |
