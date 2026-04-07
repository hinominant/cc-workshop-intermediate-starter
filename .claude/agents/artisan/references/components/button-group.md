# Button Group

## Overview

| 項目 | 値 |
|------|-----|
| Name | Button Group |
| Description | ボーダーを共有するグループ化されたボタン群 |
| Figma Source | Luna DS v3 / Button Group |
| Layer | Molecule |
| Category | Form |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Orientation | Horizontal, Vertical |
| Variant | Outline, Solid |

---

## Props

### ButtonGroup

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| orientation | `horizontal` \| `vertical` | `horizontal` | ボタンの配置方向 |
| variant | `outline` \| `solid` | `outline` | グループのスタイルバリアント |
| disabled | `boolean` | `false` | グループ全体の無効化 |

### ButtonGroupItem

Button コンポーネントと同じ Props を継承。グループ内では以下が自動適用:
- border-radius の調整（内側は 0）
- divider の挿入

---

## Structure

```
ButtonGroup
├── ButtonGroupItem (first)
├── (divider — CSS border)
├── ButtonGroupItem (middle)
├── (divider — CSS border)
└── ButtonGroupItem (last)
```

---

## Token Mapping

### Outline Variant

| State | Property | Token | Value |
|-------|----------|-------|-------|
| Default | background | `bg-default` | `#FFFFFF` (Black/0) |
| Default | text color | `text-default` | `#27272A` (Black/950) |
| Default | outer border | `border-default` | `#DADADD` (Black/200), 1px |
| Default | inner divider | `border-divider` | `#EFEEF0` (Black/100), 1px |
| Hover | background | `bg-tertiary` | `#F7F7F8` (Black/50) |
| Active | background | `bg-interactive` | `#EFEEF0` (Black/100) |
| Disabled | text color | `text-disabled` | `#94939D` (Black/400) |
| Disabled | background | `bg-default` | `#FFFFFF` (Black/0) |

### Solid Variant

| State | Property | Token | Value |
|-------|----------|-------|-------|
| Default | background | `bg-emphasis` | `#5538EE` (Brand/600) |
| Default | text color | `text-inverse` | `#FFFFFF` (Black/0) |
| Default | outer border | `border-emphasis` | `#5538EE` (Brand/600), 1px |
| Default | inner divider | — | `rgba(255,255,255,0.2)`, 1px |
| Hover | background | `bg-emphasis-interactive` | `#4D2FD3` (Brand/700) |
| Active | background | — | `#4228B5` (Brand/800 area) |
| Disabled | background | `bg-disabled` | `#DADADD` (Black/200) |
| Disabled | text color | `text-inverse` | `#FFFFFF` (Black/0) |

---

## Size Specifications

### Border Radius

| Position (horizontal) | border-radius |
|-----------------------|---------------|
| First item | `radius-md` 0 0 `radius-md` (12px 0 0 12px) |
| Middle items | 0 |
| Last item | 0 `radius-md` `radius-md` 0 (0 12px 12px 0) |

| Position (vertical) | border-radius |
|---------------------|---------------|
| First item | `radius-md` `radius-md` 0 0 (12px 12px 0 0) |
| Middle items | 0 |
| Last item | 0 0 `radius-md` `radius-md` (0 0 12px 12px) |

### Item Dimensions

| Property | Value |
|----------|-------|
| height | Button Size に準拠（L: 48px, M: 40px, S: 32px） |
| padding | Button Size に準拠 |
| font | `Body/md-default` (14px / Regular) |
| icon size | 20px |
| icon + label gap | `space-2xs` (4px) |

### Divider

| Orientation | Property | Token | Value |
|-------------|----------|-------|-------|
| Horizontal | border-right | `border-divider` | `#EFEEF0` (Black/100), 1px |
| Vertical | border-bottom | `border-divider` | `#EFEEF0` (Black/100), 1px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Default | variant に応じたスタイル | `role="group"` |
| Item Hover | 個別の背景色変更 | — |
| Item Active | 個別の背景色変更 | — |
| Item Disabled | `text-disabled`, 操作不可 | `aria-disabled="true"` |
| Focus | focus-ring on individual item (`:focus-visible`) | — |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `group` | ButtonGroup |
| `aria-label` | グループの説明 | 常時 |
| `aria-disabled` | `true` | disabled item |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | グループ内の各ボタンにフォーカス移動 |
| `Enter` / `Space` | ボタンのアクション実行 |

**Note:** Toggle Group とは異なり、Arrow キーによるローバーフォーカスは不要（各ボタンは独立したアクション）。

---

## Do / Don't

### Do
- 関連するアクションをグループ化する（例: 表示切り替え、ページネーション）
- 2-4 個のボタンに使用する
- 全ボタンの幅を揃える（視覚的一貫性）

### Don't
- 5 個以上のボタンを並べない
- グループ内で異なるバリアント（Outline + Solid）を混在させない
- Primary アクションを Button Group に入れない（単独 Button を使う）
- Toggle Group の代替として使わない（選択状態が必要なら Toggle Group）

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Button Group | 関連アクションのグループ化 | 選択状態の管理 |
| Toggle Group | 排他的/複数選択 | 独立したアクション |
| Button | 単独のアクション | 関連アクションのグループ |
