# Avatar

## Overview

| 項目 | 値 |
|------|-----|
| Name | Avatar |
| Description | ユーザーのプロフィール画像またはイニシャルを表示するコンポーネント |
| Figma Source | Luna DS v3 / Avatar |
| Layer | Atom |
| Category | Display |
| Status | Stable |

---

## Variants

### Content Priority

**優先順位:** Image → Initials → Fallback Icon

| # | Part | Required | Description |
|----|------|----------|-------------|
| 1 | Image | Optional | プロフィール写真（img要素） |
| 2 | Initials | Optional | 画像未設定時のイニシャルテキスト（1〜2文字） |
| 3 | Fallback Icon | Optional | イニシャルも未設定時のデフォルトアイコン |
| 4 | Badge（Status Dot） | Optional | オンライン状態等を示す小点 |

### Size

| Size | Diameter | Font Size（Initials） | Icon Size |
|------|----------|----------------------|-----------|
| xs | 24px | 10px | 12px |
| sm | 32px | 12px | 16px |
| md | 40px | 14px | 20px |
| lg | 48px | 16px | 24px |
| xl | 64px | 20px | 32px |

### Shape

| Shape | Radius |
|-------|--------|
| circle | 50% |
| square | `radius-sm` (4px) |

### Initials カラーパレット（name ハッシュで自動割り当て）

| 背景色 | テキスト色 | 用途 |
|--------|-----------|------|
| Brand/100 `#DEE3FF` | Brand/700 `#4D2FD3` | パターン1 |
| Pink/100 `#FEE5F5` | Pink/700 `#D10569` | パターン2 |
| Green/100 `#DAFEEE` | Green/700 `#0F8655` | パターン3 |
| Yellow/100 `#FFF9C1` | Yellow/700 `#A65D02` | パターン4 |
| Blue/100 `#DEF0FF` | Blue/700 `#0060AB` | パターン5 |

### Status Dot

| Status | Color | Description |
|--------|-------|-------------|
| online | Green/500 `#18CF83` | オンライン |
| offline | Black/300 `#BAB9C0` | オフライン |
| away | Yellow/400 `#FFC90D` | 離席中 |
| busy | Red/500 `#FF233E` | 取り込み中 |

**ドットサイズ:** xs/sm=8px, md=10px, lg/xl=12px（右下に配置）

### AvatarGroup

- 重なり幅: アバターサイズの `-25%`
- オーバーフロー: `+N` を最後に表示（同スタイル、`bg-tertiary`背景）
- デフォルト `max=3`

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| src | `string` | — | 画像URL |
| alt | `string` | — | 代替テキスト（スクリーンリーダー用） |
| name | `string` | — | ユーザー名（イニシャル生成に使用） |
| size | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | サイズ |
| status | `'online' \| 'offline' \| 'away' \| 'busy'` | — | ステータスドット |
| color | `string` | — | カスタム背景色（イニシャル表示時） |
| shape | `'circle' \| 'square'` | `'circle'` | 形状 |

### AvatarGroup Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| avatars | `AvatarProps[]` | — | 表示するアバターのリスト |
| max | `number` | `3` | 最大表示数 |
| size | `AvatarProps['size']` | — | アバターサイズ |

---

## Token Mapping

| Element | Token | Value |
|---------|-------|-------|
| デフォルト背景 | `bg-tertiary` | `#F7F7F8` (Black/50) |
| 円形 radius | — | `50%` |
| 四角形 radius | `radius-sm` | 4px |
| イニシャル font-weight | — | 600 |
| md サイズ | — | 40px |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| default | 通常表示 | — |
| image-error | 画像読み込み失敗 → Initials / Fallback Iconにフォールバック | — |
| loading | Skeleton（`bg-interactive` でパルスアニメーション） | — |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `img` | 画像なしの場合 |
| `aria-label` | `"{name}のアバター"` | Avatarコンテナ |
| `alt` | `"{name}"` | img要素 |

- 装飾目的のアバター: `aria-hidden="true"` + `alt=""`
- ユーザー識別に使うアバター: `aria-label` または `alt` でユーザー名を伝える

### Keyboard

- アバター単体はフォーカス不可（親要素 Button/Link でラップする）

---

## Do / Don't

### Do
- `name` propを常に渡す → イニシャル生成・スクリーンリーダー対応の両方に必要
- 画像ロードエラー時のフォールバックを必ず実装する
- AvatarGroupはリスト形式で実装（`aria-label` で「Nユーザー」を伝える）

### Don't
- アバター単体にクリックイベントを持たせない → 親要素（Button, Link）でラップ
- xl以上の大きいサイズをリスト内に使わない → プロフィールページ等の単体表示用
- ステータスドットの色だけで状態を伝えない → `aria-label` に状態テキストも含める

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Avatar | ユーザー識別の画像/イニシャル表示 | 装飾的な画像表示 |
| Menu | アバタークリックでメニュー展開 | — |
| Header | ヘッダー右端のユーザーアバター | — |
| Table | ユーザー列でのアバター表示 | — |
