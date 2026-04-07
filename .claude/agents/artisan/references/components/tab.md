# Tab

## Overview

| 項目 | 値 |
|------|-----|
| Name | Tab |
| Description | コンテンツ領域を切り替えるナビゲーション要素 |
| Figma Source | Luna DS v3 / Tab |
| Layer | Molecule |
| Category | Navigation |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Active | on, off |
| Notification | Boolean (バッジ表示) |
| Tab 3-6 visibility | Boolean (3番目〜6番目タブの表示/非表示) |

---

## Props

| Property | Type | Description |
|----------|------|-------------|
| Label | Text | タブのラベルテキスト |
| Notification | Boolean | 通知バッジの表示/非表示 |
| Active | Enum (on/off) | アクティブ状態 |
| Tab 03 - 06 | Boolean | 3〜6番目タブの表示/非表示 |

---

## Token Mapping per State

### Tab Button

| State | Text Color | Bottom Border | Description |
|-------|-----------|---------------|-------------|
| Active (on) | Brand/600 `#5538EE` | Brand/600 `#5538EE` bottom border | アクティブタブ |
| Inactive (off) | Secondary text | none | 非アクティブタブ |

### Layout

| Property | Value | Description |
|----------|-------|-------------|
| Tab Button Padding | 12px all | タブボタン内パディング |
| Gap (between tabs) | 6px | タブボタン間のギャップ |
| Badge Gap | 4px | ラベルとバッジの間隔 |

---

## Size Specifications

| Property | Value |
|----------|-------|
| Tab Button Padding | 12px all |
| Gap between tabs | 6px |
| Max tabs | 6 |
| Min tabs | 2 (implied) |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Active (on) | Brand/600 テキスト + bottom border | `aria-selected="true"` |
| Inactive (off) | Secondary テキスト、インジケータなし | `aria-selected="false"` |
| hover | テキスト色が若干濃く | --- |
| focus | focus-ring 表示（`:focus-visible` のみ） | --- |
| disabled | opacity: 0.4, 操作不可 | `aria-disabled="true"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `tablist` | タブバーコンテナ |
| `role` | `tab` | 各タブボタン |
| `role` | `tabpanel` | タブに紐付くコンテンツ領域 |
| `aria-selected` | `true/false` | アクティブ/非アクティブ |
| `aria-controls` | tabpanel の id | 各タブボタン |
| `aria-disabled` | `true` | 無効タブ |

### Keyboard

| Key | Action |
|-----|--------|
| `ArrowLeft` / `ArrowRight` | 前後のタブにフォーカス移動 |
| `Home` | 最初のタブにフォーカス |
| `End` | 最後のタブにフォーカス |
| `Enter` / `Space` | フォーカス中のタブをアクティブ化 |
| `Tab` | タブリストからタブパネルへフォーカス移動 |

### Color Contrast

- アクティブ: Brand/600 テキスト on 白背景 → 4.5:1 以上
- バッジ: 白テキスト on Brand/600 背景 → 4.5:1 以上

---

## Do / Don't

### Do
- タブラベルは短く簡潔に（2〜4文字が理想）
- 2〜6個の範囲で使用する
- バッジは未読/新着数など意味のある数値に限定

### Don't
- タブをページ遷移に使わない（ナビゲーションバーを使う）
- タブの順序を動的に変更しない
- 7個以上のタブを横並びにしない

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Tab | 同一画面内のコンテンツ切り替え | ページ遷移 |
| Segmented Controls | 2〜5個の排他的なビュー切り替え | 多数のセクション |
| Global Navigation | アプリ全体の下部ナビゲーション | セクション内の切り替え |
