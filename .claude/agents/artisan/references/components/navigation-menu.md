# Navigation Menu

## Overview

| 項目 | 値 |
|------|-----|
| Name | Navigation Menu |
| Description | トップレベルナビゲーション（ドロップダウン対応） |
| Figma Source | Luna DS v3 / Navigation Menu |
| Layer | Molecule |
| Category | Navigation |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Orientation | Horizontal, Vertical |
| Item State | Default, Hover, Active |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| items | NavItem[] | — | ナビゲーション項目の配列 |
| orientation | `horizontal` \| `vertical` | `horizontal` | 表示方向 |
| activeItem | string | — | アクティブ項目の識別子 |

### NavItem

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| id | string | — | 項目識別子 |
| label | string | — | 表示ラベル |
| href | string | — | リンク先URL（省略時はドロップダウントリガー） |
| icon | ReactNode | — | アイコン（省略可） |
| children | NavDropdownContent | — | ドロップダウンコンテンツ（省略可） |
| disabled | boolean | `false` | 無効状態 |

---

## Token Mapping

### Container — Horizontal

| Property | Token | Value |
|----------|-------|-------|
| Layout | — | flexbox row, align-center |
| Gap | `space-2xs` | 4px |
| Height | — | 48px |

### Container — Vertical

| Property | Token | Value |
|----------|-------|-------|
| Layout | — | flexbox column |
| Gap | `space-2xs` | 4px |
| Width | — | 240px |

### Nav Item — Horizontal

| Property | Token | Value |
|----------|-------|-------|
| Font | `Body/md-default` | 14px / Regular |
| Padding H | `space-md` | 12px |
| Padding V | `space-sm` | 8px |
| Border Radius | `radius-xs` | 4px |

### Nav Item — Vertical

| Property | Token | Value |
|----------|-------|-------|
| Font | `Body/md-default` | 14px / Regular |
| Padding H | `space-md` | 12px |
| Padding V | `space-sm` | 8px |
| Border Radius | `radius-xs` | 4px |
| Width | — | 100% |

### Item — State

| State | Background | Text Color | Border |
|-------|-----------|------------|--------|
| Default | transparent | `text-default` (`#27272A`) | none |
| Hover | `bg-interactive` (`#EFEEF0`) | `text-default` (`#27272A`) | none |
| Active | transparent | `text-emphasis` (`#5538EE`) | — |
| Disabled | transparent | `text-disabled` (`#94939D`) | none |

### Active Indicator — Horizontal

| Property | Token | Value |
|----------|-------|-------|
| Position | — | bottom, full width |
| Height | `border-width-md` | 2px |
| Color | `border-emphasis` | `#5538EE` |
| Border Radius | `radius-full` | 9999px (top corners) |

### Active Indicator — Vertical

| Property | Token | Value |
|----------|-------|-------|
| Position | — | left, full height |
| Width | `border-width-md` | 2px |
| Color | `border-emphasis` | `#5538EE` |
| Border Radius | `radius-full` | 9999px |

### Dropdown Panel

| Property | Token | Value |
|----------|-------|-------|
| Background | `bg-default` | `#FFFFFF` |
| Border | `border-default` | `#DADADD` |
| Border Width | `border-width-sm` | 1px |
| Border Radius | `radius-md` | 12px |
| Padding | `space-lg` | 16px |
| Shadow | — | `0 4px 16px rgba(0,0,0,0.12)` |
| Offset (top) | `space-2xs` | 4px |
| Min Width | — | 400px |

### Dropdown Link Item

| Property | Token | Value |
|----------|-------|-------|
| Title Font | `Body/md-bold` | 14px / Bold |
| Title Color | `text-default` | `#27272A` |
| Desc Font | `Body/sm-default` | 12px / Regular |
| Desc Color | `text-secondary` | `#777681` |
| Padding | `space-sm` | 8px |
| Border Radius | `radius-xs` | 4px |
| Hover Background | `bg-interactive` | `#EFEEF0` |
| Gap (title-desc) | `space-2xs` | 4px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Default | 通常表示 | — |
| Hover | 背景色変化 | — |
| Active | テキスト emphasis + アンダーライン/サイドライン | `aria-current="page"` |
| Open | ドロップダウンパネル表示 | `aria-expanded="true"` |
| Disabled | テキスト色 disabled | `aria-disabled="true"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `navigation` | コンテナ |
| `aria-label` | ナビゲーション名 | コンテナ |
| `aria-current` | `page` | アクティブ項目 |
| `aria-expanded` | `true` / `false` | ドロップダウン付き項目 |
| `aria-haspopup` | `true` | ドロップダウン付き項目 |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | 次のナビ項目へ移動 |
| `Enter` / `Space` | リンク遷移 / ドロップダウン開閉 |
| `ArrowDown` | ドロップダウン内の最初の項目へ |
| `Escape` | ドロップダウンを閉じる |

### Color Contrast

- Default text: `text-default` on `bg-default` → 4.5:1 以上
- Active text: `text-emphasis` on `bg-default` → 4.5:1 以上

---

## Do / Don't

### Do
- サイトレベルの主要ナビゲーションに使用する
- アクティブ状態を明確に表示する
- ドロップダウンにはリンク + 説明のリッチコンテンツを配置する

### Don't
- ナビ項目を10個以上配置しない
- 2階層以上のネストを作らない
- アプリケーション操作メニューとして使用しない（Menubar を使用）

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Navigation Menu | サイトレベルのナビゲーション | アプリケーション操作メニュー |
| Menubar | アプリケーション水平メニュー | サイトナビゲーション |
| Dropdown Menu | コンテキストメニュー | ナビゲーション |
