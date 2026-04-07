# Card

## Overview

| 項目 | 値 |
|------|-----|
| Name | Card |
| Description | 関連する情報をグループ化して表示するコンテナ要素 |
| Figma Source | Luna DS v3 / Card |
| Layer | Molecule |
| Category | Data Display |
| Status | Stable |

---

## Variants

### Anatomy

| # | Part | Required | Description |
|----|------|----------|-------------|
| 1 | Media | Optional | 画像・動画などのビジュアル |
| 2 | Header | Required | タイトル領域 |
| 3 | Badge/Tag | Optional | ステータス・カテゴリ表示 |
| 4 | Overflow Menu | Optional | その他のアクション |
| 5 | Title | Required | カードの主題 |
| 6 | Subtitle | Optional | 補足情報（日時・カテゴリ等） |
| 7 | Body | Optional | 本文コンテンツ |
| 8 | Footer | Optional | メタ情報・アクション領域 |
| 9 | Meta Info | Optional | 日付・作成者・閲覧数等 |
| 10 | Actions | Optional | ボタン・リンク |

### Type

| Variant | 特徴 | Use Case |
|---------|------|----------|
| basic | 静的表示、ボーダー区切り | 情報の表示（プロフィール、詳細） |
| interactive | ホバーエフェクト、クリック可能 | 一覧からの選択、ナビゲーション |
| media | メディア領域が大きい | ブログ記事、商品カード |
| stat | 数値を大きく表示 | KPIカード、ダッシュボード |

### Size

| Size | Width | Padding | Title Size | Use Case |
|------|-------|---------|-----------|----------|
| sm | 280px | 12px | 16px | サイドバー、コンパクト一覧 |
| md | 360px | 16px | 18px | 標準グリッド |
| lg | 480px | 24px | 20px | フィーチャーカード |

### Orientation

| Orientation | Layout | Use Case |
|-------------|--------|----------|
| vertical | メディア上、コンテンツ下 | グリッド表示 |
| horizontal | メディア左、コンテンツ右 | リスト表示（min-width: 480px） |

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| variant | `'basic' \| 'interactive' \| 'media' \| 'stat'` | `'basic'` | カードタイプ |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | サイズ |
| orientation | `'vertical' \| 'horizontal'` | `'vertical'` | 方向 |
| padding | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | パディング |
| isClickable | `boolean` | — | クリック可能（interactive用） |
| isSelected | `boolean` | — | 選択状態 |
| href | `string` | — | リンクカード |
| onClick | `() => void` | — | クリックハンドラ |
| children | `ReactNode` | — | コンテンツ |

### 合成コンポーネント

- `Card.Media` — メディア領域（src, alt, aspectRatio）
- `Card.Header` — ヘッダー
- `Card.Title` — タイトル
- `Card.Subtitle` — サブタイトル
- `Card.Body` — 本文
- `Card.Footer` — フッター

---

## Token Mapping

| Element | Token | Value |
|---------|-------|-------|
| 背景 | `bg-default` | `#FFFFFF` (Black/0) |
| ボーダー | `border-default` | `#DADADD` (Black/200) |
| 選択時ボーダー | `border-emphasis` | `#5538EE` (Brand/600) |
| 選択時背景 | `bg-secondary` | `#EDEFFF` (Brand/50) |
| 角丸 | `radius-lg` | 16px |
| メディア角丸 | `radius-lg` top only | 16px 16px 0 0 |
| 内部パディング | `space-lg` | 16px |
| セクション間余白 | `space-md` | 12px |
| テキスト | `text-default` | `#27272A` (Black/950) |
| 補助テキスト | `text-secondary` | `#777681` (Black/500) |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| default | shadow-sm, border | — |
| hover | shadow-md, translateY(-2px)（interactive） | — |
| active | shadow-sm, scale(0.99)（interactive） | — |
| focus | focus-ring 表示 | — |
| selected | border: primary, bg: primary-50 | `aria-selected="true"` |
| loading | Skeleton表示 | — |
| disabled | opacity: 0.5, pointer-events: none | — |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `article` | コンテンツカード |
| `role` | `link` | href有のクリッカブルカード |
| `tabindex` | `0` | interactive / isClickable |
| `aria-selected` | `true` | isSelected |
| `aria-label` | カードの説明 | クリッカブルで title が不十分な場合 |

### Keyboard

| Key | Action |
|-----|--------|
| `Enter` / `Space` | カードのクリックアクション（interactive） |
| `Tab` | カード間 / カード内アクション間の移動 |

### Focus Management
- クリッカブルカード: カード全体が1つのフォーカスターゲット
- カード内にボタン/リンクがある場合: カード自体はフォーカス不可、内部要素のみフォーカス
- カード全体がクリッカブル + カード内にボタンが存在する場合: `<a>` の疑似要素で実現し、内部ボタンは `position: relative; z-index: 1` で上に配置

---

## Do / Don't

### Do
- カード内の情報は優先度順に配置 → タイトル → 本文 → メタ → アクション
- グリッド表示時はカードの高さを揃える → 視覚的整合性
- statカードは数値を最も目立たせる → ダッシュボードの一覧性
- Skeleton ローディングでカードのレイアウトを維持 → CLS防止

### Don't
- 1つのカードに3つ以上のアクションを置かない → Overflow Menuにまとめる
- カード内に長文テキストを詰め込まない → 2-3行でtruncate
- クリッカブルカード内にネストしたクリッカブル要素を安易に置かない → a11y問題
- メディアのアスペクト比を歪めない → `object-fit: cover` で対応

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Card | 関連情報のグループ化 | 単一の値や文 |
| Table Row | 構造化データの1行 | ビジュアル重視の表示 |
| ListItem | 単純なリスト項目 | 複数セクションの情報 |
| Tile | 均等なグリッド表示 | 不均等なコンテンツ |

### Composition Patterns
- → `artisan/references/components/data-table.md` — カードビューとの切替
