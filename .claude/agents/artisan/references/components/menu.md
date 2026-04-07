# Menu

## Overview

| 項目 | 値 |
|------|-----|
| Name | Menu |
| Description | コンテキストメニュー |
| Figma Source | Luna DS v3 / Menu |
| Layer | Molecule |
| Category | Overlay |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Button Type | Normal, Destructive |
| 01 - 05 | Boolean (各メニュー項目の表示/非表示、最大5項目) |

---

## Props

| Property | Type | Description |
|----------|------|-------------|
| 01 | Boolean | 1番目のメニュー項目の表示/非表示 |
| 02 | Boolean | 2番目のメニュー項目の表示/非表示 |
| 03 | Boolean | 3番目のメニュー項目の表示/非表示 |
| 04 | Boolean | 4番目のメニュー項目の表示/非表示 |
| 05 | Boolean | 5番目のメニュー項目の表示/非表示 |
| Button Type | Enum | Normal / Destructive |

---

## Token Mapping

### Menu Container

| Property | Value | Description |
|----------|-------|-------------|
| Background | bg-default (`#FFFFFF`) | メニュー背景 |
| Radius | 8px | 角丸 |
| Padding | 8px all | 内側余白 |
| Gap | 2px | メニュー項目間の間隔 |

### Menu Item

| Property | Value | Description |
|----------|-------|-------------|
| Background | bg-default (`#FFFFFF`) | アイテム背景 |
| Radius | 8px | 角丸 |
| Padding | 8/12 (top-bottom/left-right) | 内側余白 |

### Button Type: Destructive

| Property | Value | Description |
|----------|-------|-------------|
| Text Color | text-critical (`#D7001A`) | 破壊的操作テキスト色 |

### Button Type: Normal

| Property | Value | Description |
|----------|-------|-------------|
| Text Color | text-default (`#27272A`) | 通常テキスト色 |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| default | 白背景 | --- |
| hover | 背景色変更 | --- |
| disabled | テキスト薄く、操作不可 | `aria-disabled="true"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `menu` | メニューコンテナ |
| `role` | `menuitem` | 各メニュー項目 |
| `aria-disabled` | `true` | 無効な項目 |

### Keyboard

| Key | Action |
|-----|--------|
| `ArrowDown` | 次の項目にフォーカス |
| `ArrowUp` | 前の項目にフォーカス |
| `Enter` / `Space` | 項目の選択 |
| `Escape` | メニューを閉じる |

---

## Do / Don't

### Do
- メニュー項目は最大5つまで
- 破壊的操作（削除等）は Destructive タイプを使用
- 項目の表示/非表示はブール値で制御

### Don't
- 6個以上のメニュー項目を配置しない
- 常時表示のナビゲーションに使わない

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Menu | コンテキストに応じた操作一覧の表示 | 常時表示のナビゲーション |
| Select | フォーム内での選択肢選択 | アクション実行 |
| Dialog | 確認ダイアログが必要な操作 | 単純なアクション選択 |
