# Hover Card

## Overview

| 項目 | 値 |
|------|-----|
| Name | Hover Card |
| Description | ホバートリガーのポップオーバーカード |
| Figma Source | Luna DS v3 / Hover Card |
| Layer | Molecule |
| Category | Overlay |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Side | Top, Bottom, Left, Right |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| trigger | ReactNode | — | ホバー対象のトリガー要素 |
| content | ReactNode | — | カード内のコンテンツ |
| side | `top` \| `bottom` \| `left` \| `right` | `bottom` | 表示方向 |
| align | `start` \| `center` \| `end` | `center` | 配置位置 |
| openDelay | number | `200` | 表示遅延（ms） |
| closeDelay | number | `100` | 非表示遅延（ms） |

---

## Token Mapping

### Card Container

| Property | Token | Value |
|----------|-------|-------|
| Background | `bg-default` | `#FFFFFF` |
| Border | `border-default` | `#DADADD` |
| Border Width | `border-width-sm` | 1px |
| Border Radius | `radius-md` | 12px |
| Padding | `space-lg` | 16px |
| Shadow | — | `0 4px 16px rgba(0,0,0,0.12)` |
| Min Width | — | 240px |
| Max Width | — | 360px |

### Arrow

| Property | Token | Value |
|----------|-------|-------|
| Size | — | 8px |
| Fill | `bg-default` | `#FFFFFF` |
| Border | `border-default` | `#DADADD` |

### Animation

| Property | Value |
|----------|-------|
| Open | `opacity 0→1`, `scale 0.96→1`, `duration 150ms`, `ease-out` |
| Close | `opacity 1→0`, `scale 1→0.96`, `duration 100ms`, `ease-in` |

---

## Delay Behavior

| Scenario | Open Delay | Close Delay |
|----------|-----------|-------------|
| Hover enter trigger | 200ms | — |
| Hover leave trigger → enter card | — | 100ms (キャンセル) |
| Hover leave trigger → leave card | — | 100ms |
| Hover leave card | — | 100ms |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Closed | カード非表示 | — |
| Opening | openDelay 待機中 | — |
| Open | カード表示、アニメーション | — |
| Closing | closeDelay 待機中 | — |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `tooltip` | 情報表示のみの場合 |
| `aria-describedby` | カードコンテンツの ID | トリガー要素に付与 |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | トリガー要素にフォーカスで表示 |
| `Escape` | カードを閉じる |

### Color Contrast

- カード内テキスト: `text-default` on `bg-default` → 4.5:1 以上

---

## Content Guidelines

### カード内レイアウト

| Property | Token | Value |
|----------|-------|-------|
| Content Gap | `space-sm` | 8px |
| Title Font | `Body/md-bold` | 14px / Bold |
| Title Color | `text-default` | `#27272A` |
| Body Font | `Body/sm-default` | 12px / Regular |
| Body Color | `text-secondary` | `#777681` |

---

## Do / Don't

### Do
- リンクやユーザー名など追加情報が欲しい要素に使用する
- コンテンツは簡潔に保つ（プレビュー情報のみ）
- openDelay でフリッカーを防止する

### Don't
- インタラクティブなフォーム要素をカード内に配置しない（Popover を使用）
- 重要な操作をホバーカード内に隠さない
- タッチデバイスでの主要UIとして使用しない
- closeDelay を0にしない（カードへの移動が困難になる）

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Hover Card | ホバーで補足情報を表示 | クリックで操作メニューを表示 |
| Popover | クリックでインタラクティブコンテンツを表示 | ホバーで表示したい場合 |
| Tooltip | 短いテキストヒント | リッチコンテンツを表示 |
