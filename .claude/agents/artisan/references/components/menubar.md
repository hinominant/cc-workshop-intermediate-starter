# Menubar

## Overview

| 項目 | 値 |
|------|-----|
| Name | Menubar |
| Description | 水平メニューバー（ドロップダウンメニューのコンテナ） |
| Figma Source | Luna DS v3 / Menubar |
| Layer | Molecule |
| Category | Navigation |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| — | 単一バリアント |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| items | MenubarItem[] | — | メニューバー項目の配列 |

### MenubarItem

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| label | string | — | メニューバー項目ラベル |
| menu | MenuItem[] | — | ドロップダウンメニュー項目（Dropdown Menu 準拠） |
| disabled | boolean | `false` | 無効状態 |

---

## Token Mapping

### Bar Container

| Property | Token | Value |
|----------|-------|-------|
| Background | `bg-default` | `#FFFFFF` |
| Border Bottom | `border-divider` | `#EFEEF0` |
| Border Width | `border-width-sm` | 1px |
| Height | — | 40px |
| Padding H | `space-sm` | 8px |
| Layout | — | flexbox row, align-center |

### Menubar Trigger

| Property | Token | Value |
|----------|-------|-------|
| Font | `Body/md-default` | 14px / Regular |
| Padding H | `space-md` | 12px |
| Padding V | `space-xs` | 6px |
| Border Radius | `radius-xs` | 4px |
| Gap (triggers) | `space-2xs` | 4px |

### Trigger — State

| State | Background | Text Color |
|-------|-----------|------------|
| Default | transparent | `text-default` (`#27272A`) |
| Hover | `bg-interactive` (`#EFEEF0`) | `text-default` (`#27272A`) |
| Active (open) | `bg-interactive` (`#EFEEF0`) | `text-emphasis` (`#5538EE`) |
| Disabled | transparent | `text-disabled` (`#94939D`) |

### Dropdown

メニュードロップダウンは Dropdown Menu コンポーネントと同一仕様:

| Property | Token | Value |
|----------|-------|-------|
| Background | `bg-default` | `#FFFFFF` |
| Border | `border-default` | `#DADADD` |
| Border Radius | `radius-sm` | 8px |
| Padding | `space-sm` | 8px |
| Shadow | — | `0 4px 16px rgba(0,0,0,0.12)` |
| Offset (top) | `space-2xs` | 4px |

---

## Behavior

### Hover Navigation

| Scenario | Behavior |
|----------|----------|
| Click trigger | ドロップダウンを開く |
| Hover another trigger (menu open) | 即座にそのドロップダウンに切り替え |
| Click outside | 全メニューを閉じる |
| Escape | 現在のメニューを閉じる |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Closed | バー表示、全メニュー非表示 | — |
| Open | アクティブトリガーハイライト、ドロップダウン表示 | `aria-expanded="true"` |
| Hover Navigation | 別トリガーにホバーで即時切り替え | — |
| Disabled | テキスト色 disabled、クリック不可 | `aria-disabled="true"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `menubar` | コンテナ |
| `role` | `menuitem` | 各トリガー |
| `aria-haspopup` | `true` | 各トリガー |
| `aria-expanded` | `true` / `false` | メニュー開閉状態 |

### Keyboard

| Key | Action |
|-----|--------|
| `Enter` / `Space` | メニュー開閉 |
| `ArrowRight` | 次のメニュートリガーへ |
| `ArrowLeft` | 前のメニュートリガーへ |
| `ArrowDown` | メニュー内の最初の項目へ |
| `ArrowUp` | メニュー内の最後の項目へ |
| `Escape` | メニューを閉じてトリガーにフォーカス |

---

## Do / Don't

### Do
- アプリケーションレベルのメニューとして使用する
- 論理的なグループでメニュー項目を整理する
- ショートカットキーを表示する

### Don't
- ナビゲーションリンクの代わりに使用しない（Navigation Menu を使用）
- メニューバー項目を7つ以上配置しない
- モバイルUIでメニューバーを使用しない

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Menubar | アプリケーション水平メニュー | サイトナビゲーション |
| Dropdown Menu | 単体のドロップダウン | 水平メニューバー内 |
| Navigation Menu | サイトレベルのナビゲーション | アプリケーション操作メニュー |
