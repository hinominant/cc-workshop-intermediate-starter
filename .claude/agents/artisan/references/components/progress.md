# Progress

## Overview

| 項目 | 値 |
|------|-----|
| Name | Progress |
| Description | プログレスバー |
| Figma Source | Luna DS v3 / Progress |
| Layer | Atom |
| Category | Feedback |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Variant | Default, Success, Error |
| Size | M, S |
| Indeterminate | on, off |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| value | number | `0` | 進捗値（0-100） |
| variant | `default` \| `success` \| `error` | `default` | カラーバリアント |
| size | `M` \| `S` | `M` | サイズバリアント |
| indeterminate | boolean | `false` | 不確定状態（アニメーション） |
| label | string | — | アクセシビリティラベル |

---

## Token Mapping

### Track (背景)

| Property | Token | Value |
|----------|-------|-------|
| Background | `bg-tertiary` | `#F7F7F8` |
| Border Radius | `radius-full` | 9999px |
| Overflow | — | hidden |

### Track — Size

| Size | Height |
|------|--------|
| M | 8px |
| S | 4px |

### Fill (進捗バー)

| Variant | Token | Value |
|---------|-------|-------|
| Default | `bg-emphasis` | `#5538EE` (Brand/600) |
| Success | `bg-success` | `#18CF83` (Green/500) |
| Error | `bg-critical` | `#FF001F` (Red/600) |

### Fill Style

| Property | Value |
|----------|-------|
| Border Radius | `radius-full` (9999px) |
| Width | `{value}%` |
| Transition | `width 300ms ease` |
| Min Width (value > 0) | 4px |

### Indeterminate Animation

| Property | Value |
|----------|-------|
| Width | 40% |
| Animation | `translateX(-100%) → translateX(350%)`, `1.5s`, `ease-in-out`, `infinite` |
| Fill Color | variant に準拠 |

---

## Layout

### Default (value: 60)
```
┌──────────────────────────────────────┐
│████████████████████████               │  Track: bg-tertiary
│  Fill (60%)            Remaining     │  Fill: bg-emphasis
└──────────────────────────────────────┘
  Height: 8px (M) / 4px (S)
```

### Indeterminate
```
┌──────────────────────────────────────┐
│          ████████████                 │  Fill がスライド
└──────────────────────────────────────┘
```

---

## Value Boundaries

| Value | Behavior |
|-------|----------|
| `0` | Fill 非表示（Track のみ） |
| `1-99` | Fill 幅 = value% |
| `100` | Fill 幅 = 100%（Track 全体） |
| `< 0` | `0` として扱う |
| `> 100` | `100` として扱う |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| Default | Track + Fill 表示 | `aria-valuenow={value}` |
| Indeterminate | Fill がスライドアニメーション | `aria-valuenow` 未設定 |
| Complete (100) | Fill が Track 全体を覆う | `aria-valuenow="100"` |
| Empty (0) | Track のみ表示 | `aria-valuenow="0"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `progressbar` | 常に |
| `aria-valuenow` | `{value}` | indeterminate でない場合 |
| `aria-valuemin` | `0` | 常に |
| `aria-valuemax` | `100` | 常に |
| `aria-label` | label prop | 常に |

### Color Contrast

- Default fill: `bg-emphasis` on `bg-tertiary` → 3:1 以上（非テキスト）
- Success fill: `bg-success` on `bg-tertiary` → 3:1 以上
- Error fill: `bg-critical` on `bg-tertiary` → 3:1 以上

---

## Do / Don't

### Do
- ファイルアップロード、フォーム完了度等の進捗表示に使用する
- 不確定な処理には indeterminate を使用する
- 進捗状況の文脈をラベルやテキストで補足する
- 完了時は success バリアントに切り替える

### Don't
- 値のないスキルゲージとして使用しない
- テキストラベルなしで単体で配置しない（何の進捗か不明）
- 100% 到達後にリセットを繰り返さない
- アニメーションを過度に使用しない

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Progress | 線形の進捗表示 | ローディングスピナー |
| Skeleton | コンテンツ読み込み中のプレースホルダー | 進捗率が明確な場合 |
| Badge | 完了/未完了のステータス表示 | 連続的な進捗表示 |
