# Input OTP

## Overview

| 項目 | 値 |
|------|-----|
| Name | Input OTP |
| Description | ワンタイムパスワード入力（セグメントボックス） |
| Figma Source | Luna DS v3 / OTP Input |
| Layer | Molecule |
| Category | Form |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Length | 4, 6 |
| Separator | on, off |
| State | Default, Focus, Error, Disabled |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| length | `4` \| `6` | `6` | 入力桁数 |
| separator | boolean | `false` | 中央にセパレーター表示（6桁: 3-3分割） |
| value | string | — | 現在の入力値 |
| disabled | boolean | `false` | 無効状態 |
| error | boolean | `false` | エラー状態 |
| onComplete | (value: string) => void | — | 全桁入力完了時コールバック |
| onChange | (value: string) => void | — | 値変更コールバック |
| autoFocus | boolean | `true` | 初回フォーカス |

---

## Token Mapping

### Container

| Property | Token | Value |
|----------|-------|-------|
| Layout | — | flexbox row, center-aligned |
| Gap | `space-sm` | 8px |

### Single Box

| Property | Token | Value |
|----------|-------|-------|
| Width | — | 40px |
| Height | — | 48px |
| Background | `bg-default` | `#FFFFFF` |
| Border Width | `border-width-sm` | 1px |
| Border Radius | `radius-sm` | 8px |
| Font | `Heading/sm` | 16px / Bold |
| Text Color | `text-default` | `#27272A` |
| Text Align | — | center |

### Box — State

| State | Border Color | Background |
|-------|-------------|------------|
| Default (empty) | `border-default` (`#DADADD`) | `bg-default` (`#FFFFFF`) |
| Default (filled) | `border-default` (`#DADADD`) | `bg-default` (`#FFFFFF`) |
| Focus | `border-emphasis` (`#5538EE`) | `bg-default` (`#FFFFFF`) |
| Error | `border-critical` (`#FF001F`) | `bg-default` (`#FFFFFF`) |
| Disabled | `border-default` (`#DADADD`) | `bg-tertiary` (`#F7F7F8`) |

### Focus Ring

| Property | Value |
|----------|-------|
| Width | 2px |
| Color | Brand/200 (`#C4CAFF`) |
| Offset | 2px |

### Separator

| Property | Token | Value |
|----------|-------|-------|
| Content | — | `–` (en dash) |
| Color | `text-secondary` | `#777681` |
| Font | `Body/lg-default` | 16px / Regular |
| Width | `space-lg` | 16px |

### Caret

| Property | Value |
|----------|-------|
| Width | 2px |
| Height | 24px |
| Color | `border-emphasis` (`#5538EE`) |
| Animation | blink 1s step-end infinite |

---

## Layout

### 4桁（separator off）
```
┌───┐ ┌───┐ ┌───┐ ┌───┐
│ 1 │ │ 2 │ │ 3 │ │ 4 │
└───┘ └───┘ └───┘ └───┘
  8px   8px   8px
```

### 6桁（separator on）
```
┌───┐ ┌───┐ ┌───┐  –  ┌───┐ ┌───┐ ┌───┐
│ 1 │ │ 2 │ │ 3 │     │ 4 │ │ 5 │ │ 6 │
└───┘ └───┘ └───┘     └───┘ └───┘ └───┘
  8px   8px   16px  16px  8px   8px
```

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Default | 空のボックス群 | — |
| Focus | アクティブボックスに emphasis ボーダー + キャレット | — |
| Filled | 数字表示、次のボックスへ自動フォーカス | — |
| Complete | 全ボックス入力済み、onComplete 発火 | — |
| Error | 全ボックスに critical ボーダー | `aria-invalid="true"` |
| Disabled | 背景 tertiary、入力不可 | `aria-disabled="true"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `group` | コンテナ |
| `aria-label` | `ワンタイムパスワード入力` | コンテナ |
| `aria-invalid` | `true` | error 時 |
| `inputmode` | `numeric` | 各ボックス |
| `autocomplete` | `one-time-code` | 最初のボックス |

### Keyboard

| Key | Action |
|-----|--------|
| `0-9` | 数字入力、次のボックスへ自動移動 |
| `Backspace` | 現在の値削除、前のボックスへ移動 |
| `ArrowLeft` | 前のボックスへ移動 |
| `ArrowRight` | 次のボックスへ移動 |
| `Ctrl+V` / `⌘V` | ペーストで全桁一括入力 |
| `Tab` | グループ外へフォーカス移動 |

---

## Do / Don't

### Do
- ペースト入力に対応する（SMS自動入力を含む）
- 全桁入力で自動送信するか、明示的な送信ボタンを用意する
- エラー時はメッセージと合わせて表示する（Field と組み合わせ）

### Don't
- 数字以外の入力を受け付けない
- ボックス間のTabキー移動を実装しない（数字入力で自動移動）
- パスワードマスク（`•`）をデフォルトにしない

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Input OTP | ワンタイムパスワード、認証コード | 通常のテキスト入力 |
| Input | 一般的なテキスト入力 | コード入力 |
| Field | ラベル・エラー付きラッパー | Input OTP を Field の children として使用可 |
