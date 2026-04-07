# Badge

## Overview

| 項目 | 値 |
|------|-----|
| Name | Badge |
| Description | ステータス・カテゴリ・数値を小さなラベルで表示するインジケーター |
| Figma Source | Luna DS v3 / Badge |
| Layer | Atom |
| Category | Feedback / Label |
| Status | Stable |

---

## Variants

### Variant

| Variant | Background | Text | Use Case |
|---------|-----------|------|----------|
| default | `bg-secondary` Brand/50 `#EDEFFF` | `text-emphasis` Brand/600 `#5538EE` | 汎用ラベル |
| emphasis | `bg-emphasis` Brand/600 `#5538EE` | `text-inverse` `#FFFFFF` | 強調・プライマリ |
| success | Green/50 `#EFFEF7` | Green/700 `#0F8655` | 承認済み・完了・正常 |
| warning | Yellow/50 `#FFFCE7` | Yellow/700 `#A65D02` | 注意・保留 |
| critical | Red/50 `#FFF0F2` | `text-critical` Red/700 `#D7001A` | エラー・拒否・危険 |
| neutral | `bg-tertiary` Black/50 `#F7F7F8` | `text-secondary` Black/500 `#777681` | 非アクティブ・アーカイブ |

### Size

| Size | Height | Font Size | Padding (H) | Padding (V) |
|------|--------|-----------|-------------|-------------|
| sm | 20px | 10px | 6px | 2px |
| md | 24px | 12px | 8px | 4px |

### Anatomy

| # | Part | Required | Description |
|----|------|----------|-------------|
| 1 | Dot | Optional | ステータスカラーのインジケーター点（status バリアントのみ） |
| 2 | Label | Required | テキストラベル（12px Medium） |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| variant | `'default' \| 'emphasis' \| 'success' \| 'warning' \| 'critical' \| 'neutral'` | `'default'` | バッジのバリアント |
| label | `string` | — | 表示テキスト（必須） |
| size | `'sm' \| 'md'` | `'md'` | サイズ |
| hasDot | `boolean` | — | ドット表示（status用） |
| count | `number` | — | 数値バッジ（通知カウント用） |
| maxCount | `number` | `99` | 最大カウント（超過時「N+」表示） |

---

## Token Mapping

| Element | Token | Value |
|---------|-------|-------|
| Border Radius | `radius-sm` | 4px |
| Font Weight | — | 500（Medium） |
| Gap（dot + label） | — | 4px |
| Dot Size | — | 6px |
| md Height | — | 24px |
| sm Height | — | 20px |
| md Font Size | — | 12px |
| sm Font Size | — | 10px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| default | 通常表示 | — |
| — | バッジ自体にhover/focus/disabled状態なし（親要素の状態に従う） | — |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `aria-label` | テキスト説明 | countバッジで「{N}件の通知」等 |
| `aria-hidden` | `true` | 装飾目的のバッジ |

### Keyboard

- バッジ自体はインタラクティブ要素ではないため、キーボード操作なし

### Screen Reader
- ラベルテキストはそのまま読み上げ
- countバッジは `aria-label="12件の通知"` のように数値の文脈を付ける

---

## Do / Don't

### Do
- 短いテキスト（2〜6文字）で使う → 「承認済み」「新着」「保留中」
- ステータスの意味に対応したvariantを使う → 成功=success, エラー=critical
- テーブル行・リストアイテムとの組み合わせで状態表示

### Don't
- 長い文章をBadgeに入れない → Tagコンポーネントまたはテキストを使う
- クリッカブルにしない → インタラクティブ要素にはButtonを使う
- 意味のないカラーを装飾目的で使わない → variantの意味に従う

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Badge | ステータス・分類・カウント表示 | クリック可能なフィルタ操作 |
| Toggle | ON/OFFの切り替え操作 | 表示のみのステータス |
| Toast | 操作後の一時的フィードバック | 固定表示のステータス |

### Composition Patterns
- → `artisan/references/components/empty.md` — 件数ゼロ状態でのBadge表示
- → `artisan/references/components/table.md` — テーブル行のステータス列
