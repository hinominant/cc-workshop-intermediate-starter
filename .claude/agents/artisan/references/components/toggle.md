# Toggle Button

## Overview

| 項目 | 値 |
|------|-----|
| Name | Toggle Button |
| Description | 押下/非押下の2状態を持つアイコンボタン。ツールバーの書式設定 (Bold/Italic) やフィルター切替等に使用する |
| Figma Source | — (shadcn/ui Toggle 準拠) |
| Layer | Atom |
| Category | Action |
| Status | Stable |

> **Switch との違い:** Switch は ON/OFF のスライド型トグルスイッチ (設定変更用)。Toggle Button はツールバー等で押下状態を持つアイコンボタン。Figma の「Toggle」コンポーネントは Switch (`switch.md`) にマッピングされる。

---

## Anatomy

```
┌─ Toggle Button ─────┐
│                     │
│       [1]Icon       │
│                     │
└─────────────────────┘
```

| # | Part | Required | Description |
|----|------|----------|-------------|
| 1 | Icon | Required | Material Symbols Rounded アイコン (20px or 24px) |

---

## Props / API

```typescript
interface ToggleProps {
  /** 押下状態 (制御コンポーネント) */
  pressed?: boolean;
  /** 初期押下状態 */
  defaultPressed?: boolean;
  /** 状態変更コールバック */
  onPressedChange?: (pressed: boolean) => void;
  /** 無効状態 */
  disabled?: boolean;
  /** サイズ */
  size?: 'sm' | 'md' | 'lg';
  /** アクセシビリティラベル */
  'aria-label': string;
  /** アイコン */
  icon: ReactNode;
}
```

---

## Variants

### Size

| Size | Button Size | Icon Size | Use Case |
|------|-------------|-----------|----------|
| sm | 32px | 20px | コンパクトツールバー |
| md | 40px | 20px | 標準ツールバー |
| lg | 48px | 24px | タッチ向け |

---

## Size Specifications

| Property | Value |
|----------|-------|
| Height / Width | sm: 32px / md: 40px / lg: 48px |
| Icon Size | sm/md: 20px / lg: 24px |
| Border Radius | radius-sm (8px) |
| Border Width | none |
| Touch Target | 44px minimum (sm は padding で確保) |

---

## Token Mapping per State

| State | Background | Icon Color | Description |
|-------|-----------|------------|-------------|
| Default (unpressed) | transparent | icon-secondary `#94939D` | 非押下通常状態 |
| Hover (unpressed) | bg-interactive `#EFEEF0` | icon-default `#27272A` | ホバー |
| Pressed | bg-secondary `#EDEFFF` | icon-emphasis `#5538EE` | 押下状態 |
| Hover (pressed) | Brand/100 `#DEE3FF` | icon-emphasis `#5538EE` | 押下中ホバー |
| Focus | + focus ring | — (状態による) | フォーカス |
| Disabled | transparent | icon-disabled `#DADADD` | 無効状態 |

### Focus Ring

| Property | Value |
|----------|-------|
| Width | 2px |
| Color | Brand/200 `#C4CAFF` |
| Offset | 2px |
| Trigger | `:focus-visible` のみ |

---

## Design Tokens

> See: [`design-tokens.md`](../design-tokens.md) for full token definitions

| Token | DS v3 Reference | Resolved Value | Usage |
|-------|----------------|----------------|-------|
| `--toggle-bg` | `transparent` | — | デフォルト背景 |
| `--toggle-bg-hover` | `var(--color-bg-interactive)` | `#EFEEF0` | ホバー背景 |
| `--toggle-bg-pressed` | `var(--color-bg-secondary)` | `#EDEFFF` | 押下背景 |
| `--toggle-icon` | `var(--color-icon-secondary)` | `#94939D` | デフォルトアイコン色 |
| `--toggle-icon-pressed` | `var(--color-icon-emphasis)` | `#5538EE` | 押下アイコン色 |
| `--toggle-icon-disabled` | `var(--color-icon-disabled)` | `#DADADD` | 無効アイコン色 |
| `--toggle-radius` | `var(--radius-sm)` | `8px` | 角丸 |
| `--toggle-focus-ring` | `var(--brand-200)` | `#C4CAFF` | フォーカスリング |

### CSS Custom Properties

```css
.toggle-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--toggle-bg);
  border: none;
  border-radius: var(--toggle-radius);
  color: var(--toggle-icon);
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease;
}

.toggle-button:hover {
  background: var(--toggle-bg-hover);
  color: var(--color-icon-default);
}

.toggle-button[data-state="on"] {
  background: var(--toggle-bg-pressed);
  color: var(--toggle-icon-pressed);
}

.toggle-button[data-state="on"]:hover {
  background: var(--brand-100);
}

.toggle-button:focus-visible {
  outline: 2px solid var(--toggle-focus-ring);
  outline-offset: 2px;
}

.toggle-button[data-disabled] {
  color: var(--toggle-icon-disabled);
  pointer-events: none;
}
```

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Unpressed | transparent 背景、icon-secondary | `aria-pressed="false"` |
| Pressed | bg-secondary 背景、icon-emphasis | `aria-pressed="true"` |
| Hover (unpressed) | bg-interactive 背景 | — |
| Hover (pressed) | Brand/100 背景 | — |
| Focus | 2px Brand/200 フォーカスリング | — |
| Disabled | icon-disabled, pointer-events: none | `aria-disabled="true"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `button` | 常時 (ネイティブ button 使用推奨) |
| `aria-pressed` | `true` / `false` | 押下状態 |
| `aria-disabled` | `true` | disabled 時 |
| `aria-label` | ボタンの説明 | 常時 (テキストラベルがないため必須) |

### Keyboard

| Key | Action |
|-----|--------|
| `Space` | 押下/非押下切り替え |
| `Enter` | 押下/非押下切り替え |
| `Tab` | 次の要素へフォーカス移動 |

### Color Contrast

- Unpressed: icon-secondary `#94939D` on white `#FFFFFF` — 3.5:1 (アイコンは 3:1 で WCAG AA 準拠)
- Pressed: icon-emphasis `#5538EE` on bg-secondary `#EDEFFF` — 5.4:1

---

## Do / Don't

### Do
- ツールバーでの書式設定ボタン (Bold, Italic, Underline) に使う
- フィルターやビュー切替のトグルに使う
- `aria-label` を必ず設定する (アイコンのみのため)
- ToggleGroup でグループ化し、排他選択/複数選択を制御する

### Don't
- ON/OFF 設定の切替には使わない (Switch を使う)
- テキストラベル付きの切替には使わない (Switch を使う)
- フォーム送信が必要な場合は Checkbox を使う

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Toggle Button | ツールバーの押下状態ボタン | 設定の ON/OFF |
| Switch | 設定の ON/OFF 即時反映 | ツールバーボタン |
| Checkbox | フォーム内の true/false 選択 | ツールバーアクション |
| Button | 単発アクション (トグル状態なし) | 押下状態の保持が必要 |

### Composition Patterns
- ToggleGroup: 複数の Toggle Button をグループ化。`type="single"` (排他) / `type="multiple"` (複数選択)
