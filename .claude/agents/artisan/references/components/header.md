# Header

## Overview

| 項目 | 値 |
|------|-----|
| Name | Header |
| Description | 画面上部のナビゲーションバー |
| Figma Source | Luna DS v3 / Header |
| Layer | Organism |
| Category | Navigation |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Title | Boolean (タイトル表示/非表示) |
| Button Type (Left) | Icon Button, Text Button, User Button |
| Button Type (Right) | Icon Button, Text Button, User Button |
| Right Button count | 0, 1, 2 |

---

## Props

| Property | Type | Description |
|----------|------|-------------|
| Title | Boolean | タイトルの表示/非表示 |
| Label | Text | タイトルテキスト |
| Left Button | Instance | 左側ボタン（戻る等、optional） |
| Right Button 1 | Instance | 右側1番目ボタン（optional） |
| Right Button 2 | Instance | 右側2番目ボタン（optional） |
| Button Type | Enum | Icon Button / Text Button / User Button |

---

## Token Mapping

### Container

| Property | Value | Description |
|----------|-------|-------------|
| Background | bg-default (`#FFFFFF`) | ヘッダー背景 |
| Padding | 0/8 (top-bottom/left-right) | 内側余白 |
| Gap | 12px | 要素間の間隔 |

### User Button (Avatar)

| Property | Value | Description |
|----------|-------|-------------|
| Radius | 20px | アバター円形（radius で円形表現） |

---

## Size Specifications

| Property | Value |
|----------|-------|
| Background | White |
| Padding | 0/8 |
| Gap | 12px |
| User Button Radius | 20px |
| Left | Back button (optional) |
| Right | Up to 2 buttons |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| default | 白背景、タイトル中央配置 | --- |
| with back button | 左に戻るボタン表示 | `aria-label="戻る"` |
| with right actions | 右にアクションボタン表示 | --- |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `banner` | ヘッダーコンテナ |
| `aria-label` | ボタンの操作内容 | 閉じる / 戻るボタン |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | 要素間のフォーカス移動 |
| `Enter` / `Space` | ボタンアクション実行 |
| `Escape` | 閉じる（close ボタン時） |

---

## Do / Don't

### Do
- タイトルは中央配置
- 戻るボタンは左側に配置
- 右側ボタンは最大2つまで

### Don't
- 3つ以上の右側ボタンを配置しない
- ヘッダー内に複雑なUIを配置しない

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Header | 画面上部のナビゲーション表示 | 下部固定ナビゲーション |
| Global Navigation | アプリ全体の下部ナビゲーション | 画面上部のナビゲーション |
