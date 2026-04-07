# Spinner

## Overview

| 項目 | 値 |
|------|-----|
| Name | Spinner |
| Description | ローディングインジケーター |
| Figma Source | Luna DS v3 / Spinner |
| Layer | Atom |
| Category | Feedback |
| Status | Stable |

---

## Figma Variants

| Variant Axis | Values |
|--------------|--------|
| Size | sm, md, lg |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| size | `sm` \| `md` \| `lg` | `md` | スピナーのサイズ |
| label | `string` | `読み込み中` | スクリーンリーダー用ラベル |
| className | `string` | — | 追加クラス |

---

## Token Mapping

### Color

| Property | Token | Primitive | Value |
|----------|-------|-----------|-------|
| Spinner color | `icon-emphasis` | Brand/600 | `#5538EE` |
| Track color | — | Brand/100 | `#DEE3FF` (20% opacity) |

### Sizing

| Size | Dimension | Border Width |
|------|-----------|-------------|
| sm | 16px x 16px | `border-width-md` (2px) |
| md | 24px x 24px | `border-width-md` (2px) |
| lg | 32px x 32px | `border-width-lg` (3px) |

---

## Animation

| Property | Value |
|----------|-------|
| Type | rotate |
| Keyframes | 0deg → 360deg |
| Duration | 750ms |
| Timing | linear |
| Iteration | infinite |

```css
@keyframes spinner-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Visual Structure

- 円形の border で構成
- 3/4 アーク: `icon-emphasis` (`#5538EE`)
- 1/4 ギャップ: transparent
- Track (背景円): Brand/100 `#DEE3FF` at 20% opacity

---

## States

| State | Visual Change |
|-------|--------------|
| Loading | 回転アニメーション |
| Complete | 非表示（children に置き換え） |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `status` | 常時 |
| `aria-live` | `polite` | 常時 |
| `aria-label` | label prop の値 | 常時 |

### Motion

- `prefers-reduced-motion: reduce` の場合:
  - 回転速度を 3s に減速
  - または静的な点滅アニメーションに切り替え

---

## Usage Patterns

### インラインローディング

```tsx
<Button disabled>
  <Spinner size="sm" />
  保存中...
</Button>
```

### ページローディング

```tsx
<div className="flex items-center justify-center h-full">
  <Spinner size="lg" />
</div>
```

### コンテンツ切り替え

```tsx
{isLoading ? (
  <Spinner size="md" label="データを読み込み中" />
) : (
  <DataTable data={data} />
)}
```

---

## Size Reference

| Size | Use Case |
|------|----------|
| sm (16px) | ボタン内、インラインテキスト横 |
| md (24px) | カード内、セクションローディング |
| lg (32px) | ページ全体、初期ロード |

---

## Do / Don't

### Do
- ローディング状態には必ず label を設定する
- 適切なサイズを文脈に応じて選択する
- `prefers-reduced-motion` を尊重する
- 3 秒以上表示される場合はテキストメッセージを併記する

### Don't
- 複数の Spinner を同時に表示しない
- Spinner だけでフィードバックとしない（テキスト併記推奨）
- コンテンツ構造が予測できる場合は Skeleton を使う

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Spinner | 不定形のロード中、短時間の処理 | コンテンツ構造が予測可能 |
| Skeleton | コンテンツ構造が予測可能なロード中 | 不定形のロード |
