# Segmented Controls

## Overview

| 項目 | 値 |
|------|-----|
| Name | Segmented Controls |
| Description | 相互排他的なビューやモードを切り替えるタブ型コントロール |
| Figma Source | Luna DS v3 / Segmented Controls |
| Layer | Molecule |
| Category | Navigation |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Active | off, on |
| Notification | Boolean (バッジ表示) |
| Item count | 3-5 items |

---

## Props

| Property | Type | Description |
|----------|------|-------------|
| Label | Text | セグメントのラベルテキスト |
| Active | Enum (off/on) | アクティブ状態 |
| Notification | Boolean | 通知バッジの表示/非表示 |

---

## Token Mapping

### Container

| Property | Value | Description |
|----------|-------|-------------|
| Background | bg-default (`#FFFFFF`) | コンテナ背景 |
| Radius | 10px | コンテナ角丸 |
| Padding | 2px | コンテナ内側余白 |
| Gap | 8px | セグメント間の間隔 |

### Button (Active)

| Property | Value | Description |
|----------|-------|-------------|
| Background | bg-default (`#FFFFFF`) | アクティブセグメント背景 |
| Radius | 8px | セグメント角丸 |
| Padding | 0/12 (top-bottom/left-right) | 内側余白 |
| Stroke | 2px (border-emphasis `#5538EE`) | アクティブ時ボーダー |

### Button (Inactive)

| Property | Value | Description |
|----------|-------|-------------|
| Padding | 0/12 (top-bottom/left-right) | 内側余白 |
| Stroke | 1px | 非アクティブ時ボーダー |

---

## Size Specifications

| Property | Value |
|----------|-------|
| Container Radius | 10px |
| Container Padding | 2px |
| Container Gap | 8px |
| Segment Radius | 8px |
| Segment Padding | 0/12 |
| Active Stroke | 2px (Brand) |
| Inactive Stroke | 1px |
| Min segments | 3 |
| Max segments | 5 |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Active (on) | Brand ボーダー 2px、Bold テキスト | `aria-selected="true"` |
| Inactive (off) | 1px ボーダー、Regular テキスト | `aria-selected="false"` |
| hover | 背景色を微調整 | --- |
| focus | focus-ring 表示（`:focus-visible` のみ） | --- |
| disabled | opacity: 0.4, 操作不可 | `aria-disabled="true"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `tablist` | コンテナ要素 |
| `role` | `tab` | 各セグメント |
| `aria-selected` | `true/false` | アクティブ状態 |
| `aria-disabled` | `true` | 無効時 |
| `aria-controls` | パネル id | 制御先のコンテンツパネル |

### Keyboard

| Key | Action |
|-----|--------|
| `ArrowLeft` / `ArrowRight` | 前後のセグメントにフォーカス移動 |
| `Home` / `End` | 最初/最後のセグメントにフォーカス移動 |
| `Enter` / `Space` | フォーカス中のセグメントを選択 |
| `Tab` | コンポーネント外へフォーカス移動 |

### Color Contrast

- ラベル（Brand/600 `#5538EE`）on 白背景 → 4.5:1 以上
- バッジ白テキスト on Brand/600 背景 → 4.5:1 以上

---

## Do / Don't

### Do
- セグメント数は3〜5に制限する
- ラベルは短く簡潔に（2〜4文字推奨）
- 初期状態で必ず1つ選択済みにする

### Don't
- フォーム入力のラジオ代替として使わない
- 6個以上のセグメントを作らない（Tab コンポーネントを検討）
- アクション実行のトリガーに使わない

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Segmented Controls | 3〜5のビュー切り替え | 6個以上の切り替え |
| Tab | 6個以上のコンテンツ切り替え | 2〜3個の単純な切り替え |
| RadioGroup | フォーム内の排他選択 | ビュー/モード切り替え |
| Toggle | 2値の ON/OFF | 3つ以上の選択肢 |
