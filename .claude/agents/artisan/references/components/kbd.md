# Kbd

## Overview

| 項目 | 値 |
|------|-----|
| Name | Kbd |
| Description | キーボードショートカット表示 |
| Figma Source | Luna DS v3 / Kbd |
| Layer | Atom |
| Category | Data Display |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Size | M, S |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| keys | string[] | — | キーの配列（例: `['⌘', 'C']`） |
| size | `M` \| `S` | `M` | サイズバリアント |

---

## Token Mapping

### Single Key

| Property | Token | Value |
|----------|-------|-------|
| Background | `bg-tertiary` | `#F7F7F8` |
| Border | `border-default` | `#DADADD` |
| Border Width | `border-width-sm` | 1px |
| Border Radius | `radius-xs` | 4px |
| Font Family | — | `monospace` (system) |
| Text Color | `text-default` | `#27272A` |
| Shadow | — | `0 1px 0 rgba(0,0,0,0.06)` (押し込み風) |

### Size Specifications

| Size | Font | Height | Min Width | Padding H | Padding V |
|------|------|--------|-----------|-----------|-----------|
| M | `font-size-xs` (11px) | 22px | 22px | `space-xs` (6px) | `space-3xs` (2px) |
| S | `font-size-2xs` (10px) | 18px | 18px | `space-2xs` (4px) | `space-3xs` (2px) |

### Key Separator

| Property | Token | Value |
|----------|-------|-------|
| Gap | `space-3xs` | 2px |
| Display | — | 各キーを個別のボックスで表示 |

---

## Layout

### Single Key
```
┌──────┐
│  ⌘   │
└──────┘
```

### Multiple Keys
```
┌───┐ ┌───┐ ┌───┐
│ ⌘ │ │ ⇧ │ │ P │
└───┘ └───┘ └───┘
  2px   2px
```

---

## Common Key Labels

| Key | Display |
|-----|---------|
| Command | `⌘` |
| Shift | `⇧` |
| Option/Alt | `⌥` |
| Control | `⌃` |
| Enter | `↵` |
| Backspace | `⌫` |
| Delete | `⌦` |
| Escape | `Esc` |
| Tab | `⇥` |
| ArrowUp | `↑` |
| ArrowDown | `↓` |
| ArrowLeft | `←` |
| ArrowRight | `→` |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Default | 通常表示 | — |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `presentation` | 装飾的な場合 |
| `aria-label` | キーの説明（例: `Command + C`） | スクリーンリーダー向け |

### Semantic HTML

- `<kbd>` 要素を使用する
- 複合キーは `<kbd>` のネストで表現: `<kbd><kbd>⌘</kbd><kbd>C</kbd></kbd>`

---

## Do / Don't

### Do
- メニュー項目のショートカット表示に使用する
- macOS では記号（`⌘`）、Windows では文字（`Ctrl`）を使用する
- 一貫したキー表記を保つ

### Don't
- 3キー以上の複合ショートカットを推奨しない
- クリッカブルなボタンとして使用しない
- 文中のインライン要素として長文に埋め込まない

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Kbd | キーボードショートカットの表示 | ボタンラベル |
| Dropdown Menu | ショートカットラベル付きメニュー | ショートカット単体表示 |
| Badge | ステータスラベル | キーボード表示 |
