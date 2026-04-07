# Toggle Group

## Overview

| 項目 | 値 |
|------|-----|
| Name | Toggle Group |
| Description | グループ化されたトグルボタン群 |
| Figma Source | Luna DS v3 / Toggle Group |
| Layer | Molecule |
| Category | Form |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Type | Single, Multiple |

---

## Props

### ToggleGroup

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| type | `single` \| `multiple` | `single` | 選択モード |
| value | `string` \| `string[]` | — | 選択値（制御コンポーネント） |
| defaultValue | `string` \| `string[]` | — | 初期選択値 |
| onValueChange | `(value) => void` | — | 値変更コールバック |
| disabled | `boolean` | `false` | グループ全体の無効化 |

### ToggleGroupItem

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| value | `string` | — | アイテムの値（必須） |
| disabled | `boolean` | `false` | 個別の無効化 |
| children | `ReactNode` | — | ラベル / アイコン |

---

## Structure

```
ToggleGroup
├── ToggleGroupItem (value="a")
├── ToggleGroupItem (value="b")
└── ToggleGroupItem (value="c")
```

---

## Token Mapping

### Group Container

| Property | Token | Value |
|----------|-------|-------|
| border | `border-default` | `#DADADD` (Black/200), 1px |
| border-radius (outer) | `radius-md` | 12px |
| background | `bg-default` | `#FFFFFF` (Black/0) |
| gap (between items) | — | 0 (connected) |

### Item

| State | Property | Token | Value |
|-------|----------|-------|-------|
| Default | background | `bg-default` | `#FFFFFF` (Black/0) |
| Default | text color | `text-default` | `#27272A` (Black/950) |
| Default | border-right | `border-divider` | `#EFEEF0` (Black/100), 1px |
| Hover | background | `bg-tertiary` | `#F7F7F8` (Black/50) |
| Active (selected) | background | `bg-secondary` | `#EDEFFF` (Brand/50) |
| Active (selected) | text color | `text-emphasis` | `#5538EE` (Brand/600) |
| Active (selected) | border | `border-emphasis` | `#5538EE` (Brand/600), 1px |
| Disabled | background | `bg-default` | `#FFFFFF` (Black/0) |
| Disabled | text color | `text-disabled` | `#94939D` (Black/400) |

### Item Divider (between items)

| Property | Token | Value |
|----------|-------|-------|
| border-right | `border-divider` | `#EFEEF0` (Black/100), 1px |

**Note:** Active アイテムの隣接 divider は非表示にする（border-emphasis が優先）。

---

## Size Specifications

| Property | Value |
|----------|-------|
| Item height | 36px |
| Item padding | `space-sm` (8px) / `space-md` (12px) (vertical/horizontal) |
| Font | `Body/md-default` (14px / Regular) |
| Font (active) | `Body/md-bold` (14px / Bold) |
| Icon size | 20px |
| Icon + label gap | `space-2xs` (4px) |
| Border-radius (first item) | `radius-md` 0 0 `radius-md` |
| Border-radius (last item) | 0 `radius-md` `radius-md` 0 |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Default | `bg-default`, `text-default` | `aria-pressed="false"` |
| Hover | `bg-tertiary` | — |
| Active (selected) | `bg-secondary`, `text-emphasis`, `border-emphasis` | `aria-pressed="true"` |
| Disabled | `text-disabled`, 操作不可 | `aria-disabled="true"` |
| Focus | focus-ring (`:focus-visible`) | — |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `group` | ToggleGroup |
| `aria-label` | グループの説明 | 常時 |
| `aria-pressed` | `true` \| `false` | 各 ToggleGroupItem |
| `aria-disabled` | `true` | disabled 時 |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | グループにフォーカス（最初の item または selected item） |
| `ArrowRight` / `ArrowDown` | 次のアイテムへフォーカス移動 |
| `ArrowLeft` / `ArrowUp` | 前のアイテムへフォーカス移動 |
| `Space` / `Enter` | アイテムの選択/解除 |
| `Home` | 最初のアイテムへ |
| `End` | 最後のアイテムへ |

---

## Do / Don't

### Do
- 2-5 個の選択肢に使用する（それ以上は Select を検討）
- アイコン + テキストまたはテキストのみで統一する
- single type ではデフォルト値を設定する

### Don't
- 6 個以上のアイテムを並べない
- single type で選択なし状態を許容しない（常に 1 つ選択）
- アイテムの幅を極端に変えない（視覚的バランスを保つ）

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Toggle Group | 2-5 個の排他的/複数選択 | 6 個以上の選択肢 |
| Button Group | アクションボタンのグループ化 | 選択状態の管理 |
| Radio Group | フォーム内の排他的選択 | コンパクトなトグル UI |
