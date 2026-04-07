# Empty

## Overview

| 項目 | 値 |
|------|-----|
| Name | Empty |
| Description | コンテンツが存在しない状態を示すプレースホルダー |
| Figma Source | Luna DS v3 / Empty State |
| Layer | Molecule |
| Category | Feedback |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Show Icon | on, off |
| Show Action | on, off |
| Size | L, M, S |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| icon | ReactNode | — | 状態を表すアイコン（省略可） |
| title | string | — | 空状態のタイトル |
| description | string | — | 補足説明テキスト（省略可） |
| action | ReactNode | — | CTAボタン（省略可） |
| size | `L` \| `M` \| `S` | `M` | サイズバリアント |

---

## Token Mapping

### Container

| Property | Token | Value |
|----------|-------|-------|
| Layout | — | flexbox column, center-aligned |
| Padding | `space-3xl` | 40px |
| Gap (elements) | `space-lg` | 16px |
| Text Align | — | center |

### Icon

| Size | Icon Size | Color |
|------|-----------|-------|
| L | 48px | `icon-secondary` (`#94939D`) |
| M | 48px | `icon-secondary` (`#94939D`) |
| S | 24px | `icon-secondary` (`#94939D`) |

### Title

| Size | Style | Color |
|------|-------|-------|
| L | `Heading/sm` (16px / Bold) | `text-default` (`#27272A`) |
| M | `Body/md-bold` (14px / Bold) | `text-default` (`#27272A`) |
| S | `Body/sm-bold` (12px / Bold) | `text-default` (`#27272A`) |

### Description

| Size | Style | Color |
|------|-------|-------|
| L | `Body/md-default` (14px / Regular) | `text-secondary` (`#777681`) |
| M | `Body/sm-default` (12px / Regular) | `text-secondary` (`#777681`) |
| S | `Body/xs-default` (11px / Regular) | `text-secondary` (`#777681`) |

### Action

| Property | Value |
|----------|-------|
| Component | Button (Secondary, Size M) |
| Margin Top | `space-sm` (8px) |

---

## Size Specifications

| Size | Container Padding | Icon-Title Gap | Title-Desc Gap | Desc-Action Gap |
|------|-------------------|---------------|----------------|-----------------|
| L | 40px | 16px | 8px | 16px |
| M | 32px | 12px | 6px | 12px |
| S | 24px | 8px | 4px | 8px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Default | アイコン + タイトル + 説明 + アクション表示 | — |
| Icon Hidden | タイトル + 説明 + アクション表示 | — |
| Action Hidden | アイコン + タイトル + 説明のみ | — |
| Minimal | タイトルのみ | — |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `status` | 動的に空状態になった場合 |
| `aria-live` | `polite` | 動的に空状態になった場合 |
| `aria-label` | タイトルテキスト | アイコンのみ表示時 |

### Color Contrast

- Title: `text-default` on `bg-default` → 4.5:1 以上
- Description: `text-secondary` on `bg-default` → 4.5:1 以上

---

## Do / Don't

### Do
- タイトルは具体的に状態を説明する（「データがありません」ではなく「まだイベントが作成されていません」）
- 可能な限りアクションボタンを提供して次のステップを示す
- アイコンは状態に関連したものを使用する

### Don't
- エラー状態と混同しない（エラーは別コンポーネントで表示）
- 説明文を3行以上にしない
- 複数のアクションボタンを配置しない

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Empty | コンテンツが存在しない状態 | エラー発生時 |
| Alert | エラーや警告の表示 | 空状態の表示 |
| Skeleton | ローディング中の表示 | データが存在しない状態 |
