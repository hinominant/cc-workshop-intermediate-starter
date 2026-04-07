# Sidebar

## Overview

| 項目 | 値 |
|------|-----|
| Name | Sidebar |
| Description | アプリケーションのサイドバーナビゲーション |
| Figma Source | Luna DS v3 / Sidebar |
| Layer | Organism |
| Category | Navigation |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| State | Expanded, Collapsed |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| collapsible | `boolean` | `true` | 折りたたみ可能かどうか |
| defaultOpen | `boolean` | `true` | 初期状態で展開するか |
| width | `number` | `240` | 展開時の幅 (px) |
| collapsedWidth | `number` | `60` | 折りたたみ時の幅 (px) |

---

## Structure

```
SidebarRoot
├── SidebarHeader
│   ├── Logo / App Name
│   └── SidebarTrigger (collapse toggle)
├── SidebarContent
│   ├── SidebarGroup
│   │   ├── SidebarGroupLabel
│   │   └── SidebarGroupContent
│   │       ├── SidebarItem (icon + label)
│   │       ├── SidebarItem (active)
│   │       └── ...
│   └── SidebarGroup
│       └── ...
├── SidebarSeparator
└── SidebarFooter
```

---

## Token Mapping

### Root

| Property | Token | Value |
|----------|-------|-------|
| background | `bg-default` | `#FFFFFF` (Black/0) |
| border-right | `border-divider` | `#EFEEF0` (Black/100), 1px |
| width (expanded) | — | 240px |
| width (collapsed) | — | 60px |
| transition | — | width 200ms ease |

### SidebarItem

| State | Property | Token | Value |
|-------|----------|-------|-------|
| Default | background | — | transparent |
| Default | text color | `text-default` | `#27272A` (Black/950) |
| Default | icon color | `icon-secondary` | `#94939D` (Black/400) |
| Hover | background | `bg-tertiary` | `#F7F7F8` (Black/50) |
| Active | background | `bg-secondary` | `#EDEFFF` (Brand/50) |
| Active | text color | `text-emphasis` | `#5538EE` (Brand/600) |
| Active | icon color | `icon-emphasis` | `#5538EE` (Brand/600) |
| Disabled | text color | `text-disabled` | `#94939D` (Black/400) |
| Disabled | icon color | `icon-disabled` | `#DADADD` (Black/300) |

### SidebarItem Size

| Property | Token | Value |
|----------|-------|-------|
| height | — | 40px |
| padding (expanded) | `space-sm` / `space-md` | 8px 12px |
| padding (collapsed) | — | centered, 8px |
| border-radius | `radius-sm` | 8px |
| icon size | — | 20px |
| gap (icon-label) | `space-sm` | 8px |
| font | `Body/md-default` | 14px / Regular |
| font (active) | `Body/md-bold` | 14px / Bold |

### SidebarGroupLabel

| Property | Token | Value |
|----------|-------|-------|
| font | `Body/xs-bold` | 11px / Bold |
| color | `text-secondary` | `#777681` (Black/500) |
| padding | `space-sm` / `space-md` | 8px 12px |
| text-transform | — | uppercase |
| letter-spacing | — | 0.05em |

### SidebarHeader / Footer

| Property | Token | Value |
|----------|-------|-------|
| padding | `space-lg` | 16px |
| border (footer) | `border-divider` | `#EFEEF0` (Black/100), top 1px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Expanded | 全幅表示、icon + label | — |
| Collapsed | アイコンのみ、tooltip で label 表示 | — |
| Item: Default | transparent 背景 | — |
| Item: Hover | `bg-tertiary` 背景 | — |
| Item: Active | `bg-secondary` 背景、`text-emphasis` テキスト | `aria-current="page"` |
| Item: Disabled | `text-disabled` テキスト | `aria-disabled="true"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `navigation` | SidebarRoot |
| `aria-label` | サイドバーの説明 | 常時 |
| `aria-current` | `page` | アクティブアイテム |
| `aria-expanded` | `true` \| `false` | SidebarTrigger |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | アイテム間フォーカス移動 |
| `Enter` / `Space` | アイテム選択 / トグル実行 |
| `[` | Sidebar 折りたたみ（ショートカット） |

---

## Do / Don't

### Do
- アクティブページを `bg-secondary` + `text-emphasis` で明示する
- collapsed 時は tooltip でラベルを表示する
- グループラベルでナビゲーションを整理する

### Don't
- Sidebar に 7 グループ以上を詰め込まない
- collapsed 状態でテキストラベルを表示しない
- ネストを 2 階層以上にしない

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Sidebar | アプリのグローバルナビゲーション | 一時的なパネル |
| Sheet | 一時的なサイドパネル | 常時表示ナビ |
| Resizable | ユーザーがサイドバー幅を調整 | 固定幅ナビ |
