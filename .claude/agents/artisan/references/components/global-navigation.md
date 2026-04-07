# Global Navigation

## Overview

| 項目 | 値 |
|------|-----|
| Name | Global Navigation |
| Description | アプリ下部のメインナビゲーションバー |
| Figma Source | Luna DS v3 / Global Navigation |
| Layer | Organism |
| Category | Navigation |
| Status | Stable |

---

## Figma Variants

Button variants: icon + label items

---

## Props

| Property | Type | Description |
|----------|------|-------------|
| Active Tab | Enum | アクティブなタブ |
| Tab Items | Instance | アイコン + ラベルの各タブ項目 |

---

## Token Mapping

### Container

| Property | Value | Description |
|----------|-------|-------------|
| Background | bg-default (`#FFFFFF`) | ナビゲーション背景 |
| Radius | 12px | コンテナ角丸 |

### Button

| Property | Value | Description |
|----------|-------|-------------|
| Radius | 12px | ボタン角丸 |
| Padding | 6/0 (top-bottom/left-right) | ボタン内余白 |

### Active Tab

| Property | Value | Description |
|----------|-------|-------------|
| Color | text-emphasis (`#5538EE`) | アクティブタブの色 |

### Inactive Tab

| Property | Value | Description |
|----------|-------|-------------|
| Color | Secondary text color | 非アクティブタブの色 |

---

## Size Specifications

| Property | Value |
|----------|-------|
| Container Radius | 12px |
| Button Radius | 12px |
| Button Padding | 6/0 |
| Active Color | text-emphasis (`#5538EE`) |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| default (inactive) | アウトラインアイコン + secondary テキスト | --- |
| active | 塗りアイコン + Brand/600 テキスト | `aria-current="page"` |
| badge | 赤ドットバッジ表示 | `aria-label` に通知を含める |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `navigation` | コンテナ要素 |
| `aria-label` | `メインナビゲーション` | コンテナ要素 |
| `aria-current` | `page` | アクティブタブ |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | タブ間のフォーカス移動 |
| `Enter` / `Space` | タブの選択 |

### Color Contrast

- アクティブ: Brand/600 テキスト on 白背景 → 4.5:1 以上
- 非アクティブ: Secondary テキスト on 白背景 → 4.5:1 以上

---

## Do / Don't

### Do
- アプリ全体のメインナビゲーションとして使用
- 常に画面下部に固定配置
- アクティブタブを Brand カラーで視覚的に示す

### Don't
- セクション内のサブナビゲーションに使わない
- 6個以上のタブを配置しない

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Global Navigation | アプリ全体のメインナビゲーション | セクション内のサブナビゲーション |
| Tab | セクション内のコンテンツ切り替え | アプリ全体のナビゲーション |
| Header | 画面上部のナビゲーション | 下部固定ナビゲーション |
