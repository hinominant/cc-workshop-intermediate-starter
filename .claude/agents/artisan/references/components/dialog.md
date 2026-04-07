# Dialog

## Overview

| 項目 | 値 |
|------|-----|
| Name | Dialog |
| Description | ユーザーの注意を集中させ、操作・情報入力・確認を促すオーバーレイ要素 |
| Figma Source | Luna DS v3 / Dialog |
| Layer | Organism |
| Category | Overlay |
| Status | Stable |

---

## Variants

### Anatomy

| # | Part | Required | Description |
|----|------|----------|-------------|
| 1 | Header | Required | タイトル領域 |
| 2 | Title | Required | ダイアログの目的を示す |
| 3 | Close Button | Required* | ✕ボタン。*alert では省略可 |
| 4 | Description | Optional | タイトルの補足説明 |
| 5 | Body | Required | メインコンテンツ |
| 6 | Footer | Required* | アクションボタン領域。*情報表示のみなら省略可 |
| 7 | Secondary Action | Optional | キャンセル等の補助アクション |
| 8 | Primary Action | Required (Footer有時) | 主要アクション |

### Size

| Size | Width | Use Case |
|------|-------|----------|
| sm | 400px | 確認ダイアログ、シンプルなアラート |
| md | 560px | 標準フォーム、情報表示 |
| lg | 720px | 複雑なフォーム、プレビュー |
| xl | 960px | データテーブル、比較画面 |
| fullscreen | 100vw x 100vh | 集中操作、モバイル |

**max-height:** `calc(100vh - 128px)` — 画面端から64pxのマージン

### Type

| Type | Close Button | Backdrop Dismiss | Footer | Use Case |
|------|-------------|-----------------|--------|----------|
| default | yes | yes | Optional | 情報表示 |
| alert | no | no | Required（OKのみ） | 重要通知、エラー |
| confirm | yes | no | Required（2ボタン） | 操作確認 |
| form | yes | no | Required（送信+キャンセル） | データ入力 |
| fullscreen | yes | no | Optional | 集中操作 |

**confirm/form でBackdrop Dismissを無効にする理由:** 入力途中のデータ損失を防ぐ。

---

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| type | `'default' \| 'alert' \| 'confirm' \| 'form' \| 'fullscreen'` | `'default'` | ダイアログタイプ |
| size | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'fullscreen'` | `'md'` | サイズ |
| isOpen | `boolean` | — | 開閉状態（必須） |
| title | `string` | — | タイトル（必須） |
| description | `string` | — | 説明文 |
| isDismissable | `boolean` | — | Backdrop クリックで閉じるか |
| onClose | `() => void` | — | 閉じるハンドラ（必須） |
| children | `ReactNode` | — | コンテンツ |
| footer | `ReactNode` | — | フッターアクション |

---

## Token Mapping

| Element | Token | Value |
|---------|-------|-------|
| ダイアログ背景 | `bg-default` | `#FFFFFF` (Black/0) |
| ボーダー | `border-default` | `#DADADD` (Black/200) |
| 角丸 | `radius-lg` | 16px |
| Backdrop | — | `rgba(0, 0, 0, 0.5)` |
| Header下線 | `border-divider` | `#EFEEF0` (Black/100) |
| Footer上線 | `border-divider` | `#EFEEF0` (Black/100) |
| 内部パディング | `space-xl` | 24px |
| タイトルテキスト | `text-default` | `#27272A` (Black/950) |
| 本文テキスト | `text-secondary` | `#777681` (Black/500) |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| closed | 非表示 | `aria-hidden="true"` |
| opening | フェードイン + スケールアニメーション | — |
| open | 表示 | — |
| closing | フェードアウト | — |
| loading | Body内にローディング表示、アクション無効 | `aria-busy="true"` |

### Animation

- 開: `opacity: 0→1`, `scale: 0.95→1`, `duration: 200ms`, `ease-out`
- 閉: `opacity: 1→0`, `duration: 150ms`, `ease-in`
- Backdrop: `opacity: 0→0.5`, `duration: 200ms`

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `dialog` | default/form |
| `role` | `alertdialog` | alert/confirm |
| `aria-modal` | `true` | 常時 |
| `aria-labelledby` | title要素のid | 常時 |
| `aria-describedby` | description要素のid | description有時 |

### Keyboard

| Key | Action |
|-----|--------|
| `Escape` | ダイアログを閉じる（alert以外） |
| `Tab` | ダイアログ内でフォーカス循環（トラップ） |
| `Shift+Tab` | 逆方向のフォーカス循環 |
| `Enter` | Primary Actionの実行（formタイプ） |

### Focus Management
1. **開時**: ダイアログ内の最初のフォーカス可能要素にフォーカス（form: 最初の入力、confirm: Primaryボタン）
2. **フォーカストラップ**: Tab/Shift+Tab でダイアログ外に出さない
3. **閉時**: ダイアログを開いたトリガー要素にフォーカスを戻す
4. **スクロールロック**: body の `overflow: hidden` で背景スクロールを防ぐ

---

## Do / Don't

### Do
- タイトルは動詞ベース（「項目を削除」「プロフィールを編集」） → 目的が明確
- 破壊的操作には影響範囲を説明文に明記
- フォームダイアログでは未保存変更の確認を実装 → データ損失防止
- ボタンラベルは具体的な動詞（「削除する」「保存する」） → 「OK」「はい」より明確

### Don't
- ダイアログの中でダイアログを開かない → ユーザーの文脈喪失
- 長いコンテンツにダイアログを使わない → 専用ページを使う
- 成功通知にダイアログを使わない → Toast/Snackbar を使う
- 「はい/いいえ」ボタンを使わない → 具体的な動詞ラベルを使う

---

## Related

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Dialog | 確認・入力が必要な割り込み | 簡易通知 |
| Toast | 成功/情報の一時通知 | ユーザー操作が必要 |
| Drawer | サイドパネルでの追加情報 | 注意の集中が必要 |
| Popover | 要素近くの補足情報 | 複雑な操作 |

### Composition Patterns
- → `button.md` — フッターのボタン配置（Secondary左、Primary右）
