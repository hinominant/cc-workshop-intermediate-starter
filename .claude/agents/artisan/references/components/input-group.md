# Input Group

## Overview

| 項目 | 値 |
|------|-----|
| Name | Input Group |
| Description | プレフィックス/サフィックスアドオン付き入力フィールド |
| Figma Source | Luna DS v3 / Input Group |
| Layer | Molecule |
| Category | Form |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Size | L, M, S |
| Prefix | on, off |
| Suffix | on, off |
| State | Default, Focus, Error, Disabled |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| prefix | ReactNode | — | 入力の前に表示するアドオン（テキスト/アイコン） |
| suffix | ReactNode | — | 入力の後に表示するアドオン（テキスト/アイコン） |
| size | `L` \| `M` \| `S` | `M` | サイズバリアント |
| value | string | — | 入力値 |
| placeholder | string | — | プレースホルダーテキスト |
| disabled | boolean | `false` | 無効状態 |
| error | boolean | `false` | エラー状態 |
| onChange | (value: string) => void | — | 値変更コールバック |

---

## Token Mapping

### Container

| Property | Token | Value |
|----------|-------|-------|
| Layout | — | flexbox row, align-center |
| Background | `bg-default` | `#FFFFFF` |
| Border | `border-default` | `#DADADD` |
| Border Width | `border-width-sm` | 1px |
| Overflow | — | hidden |

### Container — Size

| Size | Height | Border Radius | Input Font |
|------|--------|---------------|------------|
| L | 48px | `radius-lg` (16px) | `Body/lg-default` (16px / Regular) |
| M | 40px | `radius-md` (12px) | `Body/md-default` (14px / Regular) |
| S | 32px | `radius-sm` (8px) | `Body/sm-default` (12px / Regular) |

### Addon (Prefix / Suffix)

| Property | Token | Value |
|----------|-------|-------|
| Background | `bg-tertiary` | `#F7F7F8` |
| Text Color | `text-secondary` | `#777681` |
| Icon Color | `icon-secondary` | `#94939D` |
| Font | サイズに準拠 | Input と同じ |
| Border (inner) | `border-default` | `#DADADD` (prefix: right / suffix: left) |

### Addon Padding — Size

| Size | Padding H |
|------|-----------|
| L | `space-lg` (16px) |
| M | `space-md` (12px) |
| S | `space-sm` (8px) |

### Input Area

| Property | Token | Value |
|----------|-------|-------|
| Background | `bg-default` | `#FFFFFF` |
| Text Color | `text-default` | `#27272A` |
| Placeholder Color | `text-disabled` | `#94939D` |
| Padding H | サイズに準拠 | L: 16px / M: 12px / S: 8px |

---

## State Mapping

### Border Color

| State | Token | Value |
|-------|-------|-------|
| Default | `border-default` | `#DADADD` |
| Focus | `border-emphasis` | `#5538EE` |
| Error | `border-critical` | `#FF001F` |
| Disabled | `border-default` | `#DADADD` |

### Container Background

| State | Token | Value |
|-------|-------|-------|
| Default | `bg-default` | `#FFFFFF` |
| Disabled | `bg-tertiary` | `#F7F7F8` |

### Focus

| Property | Value |
|----------|-------|
| Border | `border-emphasis` (`#5538EE`) |
| Ring | 2px `Brand/200` (`#C4CAFF`) |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Default | 通常表示 | — |
| Focus | ボーダー emphasis + フォーカスリング | — |
| Error | ボーダー critical | `aria-invalid="true"` |
| Disabled | 背景 tertiary、テキスト disabled | `aria-disabled="true"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `aria-invalid` | `true` | error 時 |
| `aria-disabled` | `true` | disabled 時 |
| `aria-describedby` | addon の ID | prefix/suffix がテキストの場合 |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | 入力エリアにフォーカス移動 |
| `Enter` | フォーム送信（form 内の場合） |

---

## Do / Don't

### Do
- prefix/suffix はラベル的な情報に使用する（`https://`, `円`, `@`）
- アイコンサフィックスはクリッカブルにする場合 button として実装する
- Input と同じサイズトークンを使用する

### Don't
- prefix と suffix の両方にアイコンを入れない（視覚的に煩雑）
- 長いテキストを addon に入れない
- addon 内にインタラクティブ要素を入れない（ボタンは別コンポーネント）

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Input Group | URL、通貨、ドメイン等の定型入力 | 単純なテキスト入力 |
| Input | プレーンなテキスト入力 | アドオンが必要な場合 |
| Field | ラベル + エラー付きラッパー | Input Group を Field の children として使用可 |
