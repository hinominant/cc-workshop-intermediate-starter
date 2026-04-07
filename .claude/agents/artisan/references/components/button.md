# Button

## Overview

| 項目 | 値 |
|------|-----|
| Name | Button |
| Description | ユーザーアクションをトリガーするインタラクティブ要素 |
| Figma Source | Luna DS v3 / Button |
| Layer | Atom |
| Category | Form |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Type | Primary, Secondary, Destructive Primary, Destructive Secondary |
| Size | L, M, S |
| Status | Enable, Disable, Hover&Active |
| Show Icon | on, off |

---

## Props

| Property | Type | Description |
|----------|------|-------------|
| Icon | Instance Swap | アイコンインスタンス（Show Icon: on 時に表示） |
| Label | Text | ボタンラベルテキスト |

---

## Token Mapping per Type/State

### Background Color

| State | Primary | Secondary | Destructive Primary | Destructive Secondary |
|-------|---------|-----------|--------------------|-----------------------|
| Enable | bg-emphasis (`#5538EE`) | bg-default (`#FFFFFF`) | bg-critical (`#FF001F`) | bg-default (`#FFFFFF`) |
| Hover&Active | bg-emphasis-interactive (`#4D2FD3`) | bg-interactive (`#EFEEF0`) | bg-critical-interactive (`#D7001A`) | bg-interactive (`#EFEEF0`) |
| Disable | bg-disabled (`#DADADD`) | bg-disabled (`#DADADD`) | bg-disabled (`#DADADD`) | bg-disabled (`#DADADD`) |

### Text Color

| State | Primary | Secondary | Destructive Primary | Destructive Secondary |
|-------|---------|-----------|--------------------|-----------------------|
| Enable | text-inverse (`#FFFFFF`) | text-emphasis (`#5538EE`) | text-inverse (`#FFFFFF`) | text-emphasis (`#5538EE`) |
| Hover&Active | text-inverse (`#FFFFFF`) | text-emphasis (`#5538EE`) | text-inverse (`#FFFFFF`) | text-critical (`#D7001A`) |
| Disable | text-inverse (`#FFFFFF`) | text-disabled (`#94939D`) | text-inverse (`#FFFFFF`) | text-disabled (`#94939D`) |

**Note:** Secondary の Enable/Hover テキストは Brand/600、Destructive Secondary の Enable テキストは Brand/600、Hover テキストは Red/700。

### Border

| Type | Border Width | Enable | Hover&Active | Disable |
|------|-------------|--------|--------------|---------|
| Primary | 1px all | emphasis (Brand/600) | emphasis | default (Black/200) |
| Secondary | 1px all | default (Black/200) | default | default |
| Destructive Primary | 1px all | critical (Red/600) | critical | default (Black/200) |
| Destructive Secondary | 1px all | default (Black/200) | default | default |

---

## Size Specifications

| Size | Radius | Padding (no icon) | Padding (with icon) | Icon Gap |
|------|--------|-------------------|---------------------|----------|
| L | 16px | 0/24/0/24 (top/right/bottom/left) | 0/24/0/20 | 4px |
| M | 12px | 0/20/0/20 | 0/20/0/16 | 4px |
| S | 12px | 0/12/0/12 | 0/12/0/8 | 2px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Enable | Type に応じた背景・テキスト・ボーダー | --- |
| Hover&Active | 背景色がホバー色に変化 | --- |
| Disable | 全 Type 共通で背景 `#DADADD`、操作不可 | `aria-disabled="true"` |
| Focus | focus-ring 表示（`:focus-visible` のみ） | --- |
| Loading | Spinner アイコンがラベルの前に表示（または置換）。操作不可。ボタン幅を維持しレイアウトシフトを防止 | `aria-busy="true"`, `aria-disabled="true"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `aria-label` | 操作説明 | アイコンのみ表示時 |
| `aria-disabled` | `true` | Disable 時 |

### Keyboard

| Key | Action |
|-----|--------|
| `Enter` | アクション実行 |
| `Space` | アクション実行 |
| `Tab` | 次の要素へフォーカス移動 |

### Color Contrast

- Primary: 白テキスト on Brand/600 → 4.5:1 以上
- Secondary: Brand/600 テキスト on 白背景 → 4.5:1 以上
- Destructive Primary: 白テキスト on Red/600 → 4.5:1 以上
- Destructive Secondary: Brand/600 テキスト on 白背景 → 4.5:1 以上

---

## Do / Don't

### Do
- 1画面に Primary ボタンは1つまで
- ラベルは動詞で始める（「保存する」「削除する」）
- disabled 時は tooltip で理由を表示
- 破壊的操作には Destructive バリアントを使用

### Don't
- `<a>` タグにボタンスタイルを適用しない
- icon-only で `aria-label` を省略しない
- 複数の Primary を並べない
- disabled ボタンを完全に非表示にしない

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Button | ユーザーアクションを実行 | ページ遷移のみ |
| Link | ページ遷移 | 状態変更を伴う操作 |
