# Popover

## Overview

| 項目 | 値 |
|------|-----|
| Name | Popover |
| Description | クリックトリガーのフローティングコンテンツ |
| Figma Source | Luna DS v3 / Popover |
| Layer | Molecule |
| Category | Overlay |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Side | Top, Bottom, Left, Right |
| Align | Start, Center, End |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| trigger | ReactNode | — | クリック対象のトリガー要素 |
| content | ReactNode | — | ポップオーバー内のコンテンツ |
| side | `top` \| `bottom` \| `left` \| `right` | `bottom` | 表示方向 |
| align | `start` \| `center` \| `end` | `center` | 配置位置 |
| open | boolean | — | 制御モード時の開閉状態 |
| onOpenChange | (open: boolean) => void | — | 開閉状態変更コールバック |
| modal | boolean | `false` | モーダルモード（背景操作不可） |

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
| Min Width | — | 200px |
| Max Width | — | 400px |

### Arrow

| Property | Token | Value |
|----------|-------|-------|
| Size | — | 8px |
| Fill | `bg-default` | `#FFFFFF` |
| Border | `border-default` | `#DADADD` |

### Animation

| Property | Value |
|----------|-------|
| Open | `opacity 0→1`, `translateY(4px)→0`, `duration 150ms`, `ease-out` |
| Close | `opacity 1→0`, `translateY(0)→4px`, `duration 100ms`, `ease-in` |

### Collision Detection

| Property | Value |
|----------|-------|
| Behavior | ビューポート端で自動的に side/align を反転 |
| Padding | 8px (ビューポート端からの最小距離) |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Closed | ポップオーバー非表示 | `aria-expanded="false"` |
| Open | ポップオーバー表示 + アニメーション | `aria-expanded="true"` |
| Modal Open | 背景に overlay、ポップオーバー表示 | `aria-expanded="true"`, `aria-modal="true"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `aria-expanded` | `true` / `false` | トリガー要素 |
| `aria-haspopup` | `dialog` | トリガー要素 |
| `aria-controls` | ポップオーバーの ID | トリガー要素 |
| `role` | `dialog` | ポップオーバーコンテナ |
| `aria-modal` | `true` | modal モード時 |
| `aria-label` | コンテンツの説明 | ポップオーバーコンテナ |

### Keyboard

| Key | Action |
|-----|--------|
| `Enter` / `Space` | ポップオーバー開閉 |
| `Tab` | ポップオーバー内のフォーカス移動 |
| `Escape` | ポップオーバーを閉じてトリガーにフォーカス |

### Focus Management

| Scenario | Behavior |
|----------|----------|
| Open | ポップオーバー内の最初のフォーカス可能要素にフォーカス |
| Close | トリガー要素にフォーカスを戻す |
| Modal | フォーカストラップ（ポップオーバー内のみ） |

---

## Content Guidelines

ポップオーバー内のコンテンツは自由に配置可能:

| Property | Token | Value |
|----------|-------|-------|
| Content Gap | `space-md` | 12px |
| Title Font | `Body/md-bold` | 14px / Bold |
| Title Color | `text-default` | `#27272A` |
| Body Font | `Body/sm-default` | 12px / Regular |
| Body Color | `text-secondary` | `#777681` |

---

## Do / Don't

### Do
- フォーム、設定パネル、詳細情報の表示に使用する
- modal モードはフォーム送信など重要な操作に使用する
- ポップオーバーを閉じても入力データが失われないようにする
- フォーカス管理を適切に実装する

### Don't
- 単純なテキストヒントには使用しない（Tooltip を使用）
- メニュー項目リストには使用しない（Dropdown Menu を使用）
- ホバーで開くようにしない（Hover Card を使用）
- ネストしたポップオーバーを作らない

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Popover | クリックでインタラクティブコンテンツ表示 | ホバー表示 |
| Hover Card | ホバーで補足情報表示 | クリック操作が必要 |
| Dropdown Menu | メニュー項目リスト | カスタムコンテンツ |
| Dialog | 全画面的なモーダル | 小さなフローティングUI |
| Tooltip | 短いテキストヒント | リッチコンテンツ |
