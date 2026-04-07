# Select Oneline

## Overview

| 項目 | 値 |
|------|-----|
| Name | Select Oneline |
| Description | ブラウザネイティブの `<select>` を使用した1行セレクト |
| Figma Source | Luna DS v3 / Select Oneline |
| Layer | Atom |
| Category | Form |
| Status | Stable |

---

## Figma Variants

単一バリアントのみ（サイズ・ステータスの区分なし）。

---

## Props

| Property | Type | Description |
|----------|------|-------------|
| Label | Text | 選択値またはプレースホルダーテキスト |

---

## Token Mapping

| Property | Value | Description |
|----------|-------|-------------|
| Background | bg-default (`#FFFFFF`) | 背景色 |
| Radius | 12px | 角丸 |
| Padding | 4/8/4/12 (top/right/bottom/left) | 内側余白 |
| Gap | 8px | テキストとアイコンの間隔 |
| Stroke | 1px | ボーダー幅 |
| Border Color | border-default (`#DADADD`) | ボーダー色 |

---

## Size Specifications

| Property | Value |
|----------|-------|
| Radius | 12px |
| Padding | 4/8/4/12 |
| Gap | 8px |
| Stroke | 1px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| default | 白背景、グレーボーダー 1px | --- |
| hover | ボーダー色を濃く | --- |
| focus | Brand ボーダー + focus-ring | --- |
| filled | 選択値テキスト表示 | --- |
| disabled | opacity: 0.4, 操作不可 | `aria-disabled="true"` |
| error | Red ボーダー | `aria-invalid="true"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `aria-label` | ラベルテキスト | ラベルが視覚的に非表示の場合 |
| `aria-required` | `true` | 必須時 |
| `aria-invalid` | `true` | エラー時 |
| `aria-disabled` | `true` | disabled 時 |

### Keyboard

| Key | Action |
|-----|--------|
| `Enter` / `Space` | ブラウザネイティブのドロップダウンを開く |
| `ArrowUp` / `ArrowDown` | 選択肢を変更（ブラウザネイティブ動作） |
| `Tab` | 次の要素へフォーカス移動 |
| `Escape` | ドロップダウンを閉じる |

### Color Contrast

- テキスト（Black/950）on 白背景 → 4.5:1 以上

---

## Do / Don't

### Do
- 選択肢が少なくシンプルな場合に使用する
- モバイルではネイティブピッカーを活用
- インラインフィルタや並び替え等の軽量な選択に使用

### Don't
- 検索・フィルタ付きの選択には使わない（Select を使用）
- 複数選択には使わない
- ドロップダウンの見た目をカスタマイズしない

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Select Oneline | シンプルな選択（ブラウザネイティブ） | 検索・フィルタが必要 |
| Select | カスタムドロップダウン、検索、複数選択 | 軽量な選択で十分 |
| Select Button | カード型の視覚的選択 | インライン配置 |
