# Tooltip

## Overview

| 項目 | 値 |
|------|-----|
| Name | Tooltip |
| Description | ホバー・フォーカス時に補足情報を表示する非インタラクティブなポップオーバー |
| Figma Source | Luna DS v3 / Tooltip |
| Layer | Atom |
| Category | Overlay |
| Status | Stable |

---

## Variants

### Placement

| Placement | 使用場面 |
|-----------|---------|
| top（デフォルト） | 一般的な補足説明 |
| bottom | 画面上部のアイコンボタン |
| left / right | サイドバーアイコン |
| top-start / top-end | リスト項目のアクションアイコン |

### Anatomy

| # | Part | Required | Description |
|----|------|----------|-------------|
| 1 | Content | Required | 補足テキスト（12px Regular、最大200px幅、改行あり） |
| 2 | Arrow | Optional | トリガーへの方向矢印（8px x 4px） |
| 3 | Trigger | Required | ホバー/フォーカスを受け取る任意の要素 |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| content | `string` | — | ツールチップに表示するテキスト（必須） |
| placement | `'top' \| 'bottom' \| 'left' \| 'right' \| 'top-start' \| 'top-end' \| 'bottom-start' \| 'bottom-end'` | `'top'` | 表示位置 |
| delayShow | `number` | `300` | 表示遅延（ms） |
| delayHide | `number` | `100` | 非表示遅延（ms） |
| hasArrow | `boolean` | `true` | 矢印の表示 |
| isOpen | `boolean` | — | 強制表示/非表示（制御用） |
| children | `React.ReactElement` | — | トリガー要素（必須） |

---

## Token Mapping

| Element | Token | Value |
|---------|-------|-------|
| 背景色 | — | `#27272A` (Black/950) |
| テキスト色 | — | `#FFFFFF` (Black/0) |
| フォントサイズ | — | 12px |
| フォントウェイト | — | 400（Regular） |
| 最大幅 | — | 200px |
| パディング | — | 6px 8px |
| 角丸 | `radius-sm` | 4px |
| 矢印サイズ | — | 8px x 4px |
| z-index | — | 1500 |
| 表示遅延 | — | 300ms |
| 非表示遅延 | — | 100ms |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| hidden | `opacity: 0`, `pointer-events: none` | — |
| visible | `opacity: 1`、300ms遅延後表示 | `role="tooltip"` |
| exiting | `opacity: 0`、100ms遅延後非表示 | — |

**アニメーション:** `opacity 150ms ease-out` + placement方向への `translateY(+/-4px)` 解除

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `tooltip` | Tooltipコンテンツ要素 |
| `aria-describedby` | tooltip要素のID | Trigger要素 |
| `id` | ユニークID | Tooltipコンテンツ要素 |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` / `Shift+Tab` | Trigger要素にフォーカス → Tooltip表示 |
| `Escape` | 表示中のTooltipを閉じる |

### Screen Reader
- `aria-describedby` でTooltipテキストをトリガー要素の説明として紐付ける
- Tooltipは補足情報のみ。必須情報はTooltipに入れない（スクリーンリーダーで見逃す可能性）

---

## Do / Don't

### Do
- アイコンボタンのラベル補足に使う → `aria-label` の視覚的補足
- 短い補足説明に限定する → 1〜2文、最大40文字程度
- キーボードフォーカスでも表示する → ホバーのみ非対応

### Don't
- Tooltip内にリンク・ボタンを入れない → インタラクティブ要素はPopoverを使う
- 必須情報・エラーメッセージをTooltipに入れない → 常時表示の要素を使う
- タッチデバイスのみで使用するUIにTooltipを主要UIとして使わない → ホバーなし

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Tooltip | 補足説明（読み取り専用） | インタラクティブなコンテンツ |
| Popover | クリック展開の詳細情報 | 単純な補足テキスト |
| Menu | クリック展開のアクションリスト | 情報表示のみ |
| Dialog | 重要な確認・入力が必要 | 軽い補足説明 |
