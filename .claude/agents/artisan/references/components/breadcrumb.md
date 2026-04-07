# Breadcrumb

## Overview

| 項目 | 値 |
|------|-----|
| Name | Breadcrumb |
| Description | 現在地と階層構造を示すナビゲーション補助コンポーネント |
| Figma Source | Luna DS v3 / Breadcrumb |
| Layer | Molecule |
| Category | Navigation |
| Status | Stable |

---

## Variants

### Anatomy

```
ホーム  >  カテゴリ  >  サブカテゴリ  >  現在のページ
 [1]  [2]    [3]   [2]     [3]      [2]      [4]
```

| # | Part | Required | Description |
|----|------|----------|-------------|
| 1 | Root Item | Required | トップレベルリンク（通常「ホーム」） |
| 2 | Separator | Required | 区切り記号（`/` または `>`、14px、`text-secondary`） |
| 3 | Link Item | Optional | クリック可能な中間階層リンク |
| 4 | Current Item | Required | 現在のページ（リンクなし、`text-default`） |

### 省略パターン（maxItems指定時）

```
ホーム  >  ...  >  サブカテゴリ  >  現在のページ
```

- 中間アイテムを `...` ボタンで省略
- `...` クリックで全階層を展開

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| items | `BreadcrumbItem[]` | — | パンくずアイテムの配列（必須） |
| separator | `'/' \| '>' \| ReactNode` | `'/'` | 区切り文字 |
| maxItems | `number` | — | 最大表示件数（超過時に省略） |
| expandLabel | `string` | `'...'` | 省略時の展開ボタンラベル |

### BreadcrumbItem

| Property | Type | Description |
|----------|------|-------------|
| label | `string` | 表示ラベル |
| href | `string` | リンク先（末尾アイテムは省略） |
| onClick | `() => void` | クリックハンドラ（href代替） |

---

## Token Mapping

| Element | Token | Value |
|---------|-------|-------|
| フォントサイズ | — | 14px |
| リンク色 | `text-secondary` | `#777681` (Black/500) |
| ホバー時リンク色 | `text-default` | `#27272A` (Black/950) |
| 現在ページ色 | `text-default` | `#27272A` (Black/950) |
| セパレーター色 | `text-secondary` | `#777681` (Black/500) |
| Gap | — | 4px |
| 行の高さ | — | 20px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| default | 通常表示 | — |
| link-hover | テキスト色 `text-default` に変化 | — |
| link-focus | フォーカスリング表示 | — |
| current | 非リンク表示、`cursor: default` | `aria-current="page"` |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `aria-label` | `"パンくずリスト"` | `<nav>` 要素 |
| `aria-current` | `"page"` | 現在のページアイテム |
| `aria-hidden` | `"true"` | セパレーター要素 |

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` | リンクアイテムを順にフォーカス |
| `Enter` / `Space` | リンクを実行 |

### HTML Structure

```html
<nav aria-label="パンくずリスト">
  <ol>
    <li><a href="/">ホーム</a></li>
    <li aria-hidden="true">/</li>
    <li><a href="/category">カテゴリ</a></li>
    <li aria-hidden="true">/</li>
    <li aria-current="page">現在のページ</li>
  </ol>
</nav>
```

---

## Do / Don't

### Do
- `<nav>` + `<ol>` のセマンティック構造を使う → スクリーンリーダーが「リスト N件」と案内
- 現在ページには `aria-current="page"` を付ける
- 4階層以上になったら省略（maxItems）を検討

### Don't
- 1〜2階層のページにパンくずを使わない → ノイズになる
- セパレーターに `aria-hidden="true"` を忘れない → 読み上げノイズになる
- モバイルで全階層を常に表示しない → 省略 or 最後の親1件のみ表示を検討

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Breadcrumb | 階層構造の現在地表示 | 1〜2階層のフラットなページ |
| Global Navigation | グローバルナビとの組み合わせ | — |
| Header | ヘッダー内パンくず配置 | — |
