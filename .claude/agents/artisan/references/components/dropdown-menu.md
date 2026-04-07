# Dropdown Menu

## Overview

| 項目 | 値 |
|------|-----|
| Name | Dropdown Menu |
| Description | クリックトリガーのメニュードロップダウン |
| Figma Source | Luna DS v3 / Dropdown Menu |
| Layer | Molecule |
| Category | Navigation |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Item Type | Normal, Destructive, Checkbox, Radio, Separator, Sub-menu |
| State | Default, Hover, Disabled |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| trigger | ReactNode | — | メニューを開くトリガー要素 |
| items | MenuItem[] | — | メニュー項目の配列 |
| side | `top` \| `bottom` \| `left` \| `right` | `bottom` | 表示方向 |
| align | `start` \| `center` \| `end` | `start` | 配置位置 |

### MenuItem

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| label | string | — | 項目ラベル |
| icon | ReactNode | — | アイコン（省略可） |
| shortcut | string | — | ショートカットラベル（例: `⌘C`） |
| type | `normal` \| `destructive` \| `checkbox` \| `radio` \| `separator` \| `sub-menu` | `normal` | 項目タイプ |
| checked | boolean | — | checkbox/radio の選択状態 |
| disabled | boolean | `false` | 無効状態 |
| children | MenuItem[] | — | sub-menu の子項目 |
| onSelect | () => void | — | 選択時コールバック |

---

## Token Mapping

### Menu Container

| Property | Token | Value |
|----------|-------|-------|
| Background | `bg-default` | `#FFFFFF` |
| Border | `border-default` | `#DADADD` |
| Border Width | `border-width-sm` | 1px |
| Border Radius | `radius-sm` | 8px |
| Padding | `space-sm` | 8px |
| Gap (items) | `space-3xs` | 2px |
| Shadow | — | `0 4px 16px rgba(0,0,0,0.12)` |
| Min Width | — | 180px |

### Menu Item — Normal

| State | Background | Text Color |
|-------|-----------|------------|
| Default | transparent | `text-default` (`#27272A`) |
| Hover | `bg-interactive` (`#EFEEF0`) | `text-default` (`#27272A`) |
| Disabled | transparent | `text-disabled` (`#94939D`) |

### Menu Item — Destructive

| State | Background | Text Color |
|-------|-----------|------------|
| Default | transparent | `text-critical` (`#D7001A`) |
| Hover | Red/50 (`#FFF0F2`) | `text-critical` (`#D7001A`) |
| Disabled | transparent | `text-disabled` (`#94939D`) |

### Menu Item Layout

| Property | Token | Value |
|----------|-------|-------|
| Padding H | `space-sm` | 8px |
| Padding V | `space-xs` | 6px |
| Border Radius | `radius-xs` | 4px |
| Gap (icon-label) | `space-sm` | 8px |
| Font | `Body/md-default` | 14px / Regular |
| Shortcut Font | `Body/sm-default` | 12px / Regular |
| Shortcut Color | `text-secondary` | `#777681` |
| Icon Size | — | 20px |

### Separator

| Property | Token | Value |
|----------|-------|-------|
| Height | `border-width-sm` | 1px |
| Color | `border-divider` | `#EFEEF0` |
| Margin V | `space-2xs` | 4px |

### Checkbox / Radio Indicator

| Property | Token | Value |
|----------|-------|-------|
| Size | — | 16px |
| Checked Color | `icon-emphasis` | `#5538EE` |
| Unchecked Color | `icon-secondary` | `#94939D` |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Closed | メニュー非表示 | `aria-expanded="false"` |
| Open | メニュー表示、トリガーにフォーカスリング | `aria-expanded="true"` |
| Item Hover | 背景色変化 | — |
| Item Disabled | テキスト色 disabled、操作不可 | `aria-disabled="true"` |
| Item Checked | チェック/ラジオインジケーター表示 | `aria-checked="true"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `menu` | メニューコンテナ |
| `role` | `menuitem` / `menuitemcheckbox` / `menuitemradio` | 項目タイプに応じて |
| `aria-expanded` | `true` / `false` | トリガー要素 |
| `aria-haspopup` | `true` | トリガー要素 |

### Keyboard

| Key | Action |
|-----|--------|
| `Enter` / `Space` | メニュー開閉 / 項目選択 |
| `ArrowDown` | 次の項目へ |
| `ArrowUp` | 前の項目へ |
| `ArrowRight` | サブメニューを開く |
| `ArrowLeft` | サブメニューを閉じる |
| `Escape` | メニューを閉じる |

---

## Do / Don't

### Do
- 項目数が多い場合はセパレーターでグループ化する
- 破壊的操作は Destructive タイプを使用する
- ショートカットがある場合は shortcut ラベルを表示する

### Don't
- メニュー内にフォーム要素を配置しない
- 3階層以上のサブメニューを作らない
- 項目数が15を超える場合は別UIを検討する

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Dropdown Menu | アクション一覧をクリックで表示 | ホバーで表示したい場合 |
| Menubar | 水平メニューバー内のドロップダウン | 単体メニュー |
| Popover | カスタムコンテンツを表示 | メニュー項目のリスト |
