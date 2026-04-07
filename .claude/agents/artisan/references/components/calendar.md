# Calendar

## Overview

| 項目 | 値 |
|------|-----|
| Name | Calendar |
| Description | 日付選択グリッドコンポーネント |
| Figma Source | — (shadcn/ui ベース、Luna DS v3 トークン適用) |
| Layer | Molecule |
| Category | Form |
| Status | Draft |

---

## Variants

| Variant Axis | Values |
|--------------|--------|
| Mode | single (1日選択), range (範囲選択), multiple (複数選択) |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| mode | `"single" \| "range" \| "multiple"` | `"single"` | 選択モード |
| selected | `Date \| DateRange \| Date[]` | — | 選択中の日付 |
| onSelect | `(date) => void` | — | 選択コールバック |
| defaultMonth | `Date` | 現在月 | 初期表示月 |
| month | `Date` | — | 表示月（制御モード） |
| onMonthChange | `(month: Date) => void` | — | 月変更コールバック |
| disabled | `Date[] \| ((date: Date) => boolean)` | — | 無効日指定 |
| fromDate | `Date` | — | 選択可能な最小日 |
| toDate | `Date` | — | 選択可能な最大日 |
| locale | `Locale` | `ja` | ロケール |

---

## Token Mapping

### Colors

| Element | Token | Value |
|---------|-------|-------|
| 背景 | `bg-default` | `#FFFFFF` (Black/0) |
| ヘッダー (月名) テキスト | `text-default` | `#27272A` (Black/950) |
| 曜日ヘッダー テキスト | `text-secondary` | `#777681` (Black/500) |
| 通常日テキスト | `text-default` | `#27272A` (Black/950) |
| 選択日 背景 | `bg-emphasis` | `#5538EE` (Brand/600) |
| 選択日 テキスト | `text-inverse` | `#FFFFFF` (Black/0) |
| 今日マーカー 背景 | `bg-secondary` | `#EDEFFF` (Brand/50) |
| 今日マーカー テキスト | `text-emphasis` | `#5538EE` (Brand/600) |
| ホバー 背景 | `bg-interactive` | `#EFEEF0` (Black/100) |
| 範囲選択 中間日背景 | — | Brand/50 `#EDEFFF` |
| 他月の日テキスト | `text-disabled` | `#94939D` (Black/400) |
| 無効日テキスト | `text-disabled` | `#94939D` (Black/400) |
| ナビゲーション矢印 | `icon-default` | `#27272A` (Black/950) |
| ナビゲーション矢印ホバー | `bg-interactive` | `#EFEEF0` (Black/100) |
| グリッド線 | `border-default` | `#DADADD` (Black/200) |

### Spacing

| Element | Token | Value |
|---------|-------|-------|
| Container padding | `space-md` | 12px |
| ヘッダーとグリッドの間隔 | `space-lg` | 16px |
| セル padding | `space-sm` | 8px |
| ナビ矢印とヘッダーの間隔 | `space-sm` | 8px |

### Size / Radius

| Element | Token | Value |
|---------|-------|-------|
| セルサイズ | — | 36px x 36px |
| 選択日 radius | `radius-sm` | 8px |
| 今日マーカー radius | `radius-sm` | 8px |
| ナビ矢印ボタン radius | `radius-sm` | 8px |
| Container radius | `radius-md` | 12px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Default | 通常表示 | `role="grid"` |
| Hover | セル背景 `bg-interactive` | — |
| Selected | セル背景 Brand/600、テキスト白 | `aria-selected="true"` |
| Today | セル背景 Brand/50、テキスト Brand/600 | `aria-current="date"` |
| Range (中間) | 背景 Brand/50 | — |
| Disabled | テキスト `text-disabled`、操作不可 | `aria-disabled="true"` |
| Outside Month | テキスト `text-disabled`、薄く表示 | — |

---

## Accessibility

### ARIA

| Attribute | Element | Value |
|-----------|---------|-------|
| `role` | Container | `grid` |
| `role` | 曜日行 | `row` |
| `role` | 各セル | `gridcell` |
| `aria-label` | Container | `"カレンダー"` |
| `aria-label` | ナビ (前月) | `"前の月"` |
| `aria-label` | ナビ (次月) | `"次の月"` |
| `aria-selected` | 選択日セル | `true` |
| `aria-current` | 今日のセル | `"date"` |
| `aria-disabled` | 無効セル | `true` |

### Keyboard

| Key | Action |
|-----|--------|
| `ArrowLeft` | 前日へ移動 |
| `ArrowRight` | 翌日へ移動 |
| `ArrowUp` | 前週へ移動 |
| `ArrowDown` | 翌週へ移動 |
| `Home` | 週の最初の日へ移動 |
| `End` | 週の最後の日へ移動 |
| `PageUp` | 前月へ移動 |
| `PageDown` | 翌月へ移動 |
| `Enter` / `Space` | 日付を選択 |

---

## CSS Custom Properties

```css
.calendar {
  padding: var(--space-md);
  background: var(--color-bg-default);
  border-radius: var(--radius-md);
  font-family: var(--font-family);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
}

.calendar-title {
  color: var(--color-text-default);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
}

.calendar-nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  color: var(--color-icon-default);
  cursor: pointer;
}

.calendar-nav-button:hover {
  background: var(--color-bg-interactive);
}

.calendar-day-header {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  text-align: center;
}

.calendar-cell {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-md);
  cursor: pointer;
}

.calendar-cell:hover {
  background: var(--color-bg-interactive);
}

.calendar-cell[data-selected] {
  background: var(--color-bg-emphasis);
  color: var(--color-text-inverse);
}

.calendar-cell[data-today] {
  background: var(--color-bg-secondary);
  color: var(--color-text-emphasis);
}

.calendar-cell[data-disabled] {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.calendar-cell[data-outside] {
  color: var(--color-text-disabled);
  opacity: 0.5;
}

.calendar-cell[data-range-middle] {
  background: var(--brand-50);
  border-radius: var(--radius-none);
}
```

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Calendar | 日付のインライン選択 | テキスト入力による日付指定 |
| DatePicker | Input + Calendar のコンビネーション | カレンダー常時表示 |
