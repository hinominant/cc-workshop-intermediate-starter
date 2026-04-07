# Switch

## Overview

| 項目 | 値 |
|------|-----|
| Name | Switch |
| Description | オン/オフを切り替えるスライド型トグルスイッチ。設定変更等で即時反映される操作に使用する |
| Figma Source | Luna DS v3 / Toggle (Figma上の名称は「Toggle」だが、shadcn/ui の Switch API にマッピング) |
| Layer | Atom |
| Category | Form |
| Status | Stable |

> **Toggle Button との違い:** Toggle Button (`toggle.md`) はツールバー等の押下状態ボタン (Bold/Italic等)。Switch は設定の ON/OFF を切り替えるスライド型スイッチ。Figma の「Toggle」コンポーネントはこの Switch に対応する。

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Status | Enable, Disable |
| State | On, Off |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| checked | `boolean` | — | オン/オフ状態 (制御コンポーネント) |
| defaultChecked | `boolean` | `false` | 初期状態 |
| onCheckedChange | `(checked: boolean) => void` | — | 状態変更コールバック |
| disabled | `boolean` | `false` | 無効状態 |
| name | `string` | — | フォームフィールド名 |

---

## Token Mapping

### Track

| State | Property | Token/Value | HEX |
|-------|----------|-------------|-----|
| Off + Enable | background | bg-disabled (Black/200) | `#DADADD` |
| On + Enable | background | bg-emphasis (Brand/600) | `#5538EE` |
| Off + Hover | background | Black/300 | `#BAB9C0` |
| On + Hover | background | bg-emphasis-interactive (Brand/700) | `#4D2FD3` |
| Off + Disable | background | bg-interactive (Black/100) | `#EFEEF0` |
| On + Disable | background | Brand/200 | `#C4CAFF` |

### Thumb

| State | Property | Token | Value |
|-------|----------|-------|-------|
| All Enable | background | `bg-default` | `#FFFFFF` (Black/0) |
| All Disable | background | `bg-default` | `#FFFFFF` (Black/0) |
| All | box-shadow | — | `0 1px 2px rgba(0,0,0,0.1)` |

---

## Size Specifications

| Part | Property | Value |
|------|----------|-------|
| Track | width | 44px |
| Track | height | 24px |
| Track | border-radius | `radius-full` (9999px) |
| Track | padding | 2px |
| Thumb | width x height | 20px x 20px |
| Thumb | border-radius | `radius-full` (9999px) |

### Thumb Position

| State | Transform |
|-------|-----------|
| Off | translateX(0) |
| On | translateX(20px) |

---

## Animation

| Property | Value |
|----------|-------|
| Thumb transition | transform 150ms ease |
| Track transition | background-color 150ms ease |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Off + Enable | Track: bg-disabled (`#DADADD`), Thumb: left | `aria-checked="false"` |
| On + Enable | Track: bg-emphasis (`#5538EE`), Thumb: right | `aria-checked="true"` |
| Off + Hover | Track: `#BAB9C0` | — |
| On + Hover | Track: bg-emphasis-interactive (`#4D2FD3`) | — |
| Off + Disable | Track: bg-interactive (`#EFEEF0`), 操作不可 | `aria-disabled="true"` |
| On + Disable | Track: `#C4CAFF`, 操作不可 | `aria-disabled="true"` |
| Focus | focus-ring (`:focus-visible`) | — |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `switch` | 常時 |
| `aria-checked` | `true` \| `false` | 状態に応じて |
| `aria-disabled` | `true` | disabled 時 |
| `aria-label` | スイッチの説明 | ラベルが隣接しない場合 |

### Keyboard

| Key | Action |
|-----|--------|
| `Space` | オン/オフ切り替え |
| `Enter` | オン/オフ切り替え |
| `Tab` | 次の要素へフォーカス移動 |

### Color Contrast

- On Track: Brand/600 (`#5538EE`) + White Thumb — 十分なコントラスト
- Off Track: Black/200 (`#DADADD`) + White Thumb — 視認可能
- Disabled 状態でも視覚的に On/Off が判別可能

---

## Do / Don't

### Do
- 即座に反映される設定変更に使用する (保存不要の操作)
- ラベルを左側に配置し、Switch を右側に配置する
- On/Off の状態が明確に伝わるラベルにする

### Don't
- フォーム送信が必要な場合は Checkbox を使う
- Switch を複数選択グループに使わない
- ラベルなしで Switch を使用しない
- ツールバーの押下状態ボタンとして使わない (Toggle Button を使う)

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Switch | 即時反映のオン/オフ切り替え | フォーム送信が必要 |
| Checkbox | フォーム内の選択 | 即時反映トグル |
| Toggle Button | ツールバーの押下状態ボタン | 設定の ON/OFF |
| Toggle Group | 複数選択肢の切り替え | 二値のオン/オフ |
