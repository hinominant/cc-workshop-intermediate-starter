# DESIGN.md — Luna Design System

> Luna / ねお のブランド世界観に基づくデザイン仕様。AIエージェントがUI生成時に参照する単一の真実源（SSoT）。
>
> **原則**: このファイルは唯一のデザイン仕様。他のブランド（Stripe/Apple/Airbnb等）のミラーは作らない。

---

## 1. Overview

Luna は「マッチングサービス」の概念を超える、出会いと関係性の場。温かみと品位、そして現代的な洗練を両立させる。
UIは「静かに寄り添う」デザイン。華美ではなく、機能的でもなく、**使う人の感情に寄り添う質感**を持つ。

---

## 2. Color

### Primitive

| Token | Hex | 使用 |
|-------|-----|------|
| `luna-white` | `#FFFFFF` | 基調背景 |
| `luna-off-white` | `#F8F6F2` | セカンダリ背景 |
| `luna-ink` | `#1A1A1A` | 本文 |
| `luna-ink-soft` | `#4A4A4A` | 補助文 |
| `luna-ink-mute` | `#8A8A8A` | 説明文 |
| `luna-border` | `#E8E4DC` | 罫線 |

### Accent

| Token | Hex | 役割 |
|-------|-----|------|
| `luna-gold` | `#B8935E` | ブランド中核。リンク/強調 |
| `luna-gold-soft` | `#D4B88E` | hover/active |
| `luna-rose` | `#C78D8D` | 感情の訴求（告知/イベント） |
| `luna-moss` | `#6B7E5C` | 成功・継続のニュアンス |

### Semantic

| Token | 値 | 意味 |
|-------|---|------|
| `success` | `luna-moss` | 完了・前進 |
| `warning` | `#C9A05F` | 注意（警告は強く出さない） |
| `danger` | `#A85A5A` | 削除・停止（赤を和らげる） |
| `info` | `luna-ink-soft` | 情報 |

**アクセシビリティ**: 本文 vs 背景は WCAG AA 以上（4.5:1）を維持。

---

## 3. Typography

### Font Family

```css
--font-sans-ja: "Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif;
--font-serif-ja: "Noto Serif JP", "Yu Mincho", serif;
--font-sans-en: "Inter", "Helvetica Neue", sans-serif;
--font-mono: "JetBrains Mono", "SF Mono", "Menlo", monospace;
```

日本語優先。本文は和文サンセリフ、見出しの格上げで明朝を使う場合あり。

### Scale

| Level | Size | Line | Weight | 用途 |
|-------|------|------|--------|------|
| `display` | 56px | 1.2 | 300 | LP主題 |
| `h1` | 36px | 1.3 | 400 | ページ見出し |
| `h2` | 28px | 1.4 | 500 | セクション |
| `h3` | 20px | 1.5 | 500 | サブセクション |
| `body` | 16px | 1.7 | 400 | 本文 |
| `body-sm` | 14px | 1.6 | 400 | 補助文 |
| `caption` | 12px | 1.5 | 400 | キャプション |

和文は `line-height: 1.7` 基準（欧文より広め）。

---

## 4. Spacing

8px基準グリッド。

| Token | px |
|-------|-----|
| `space-1` | 4 |
| `space-2` | 8 |
| `space-3` | 12 |
| `space-4` | 16 |
| `space-6` | 24 |
| `space-8` | 32 |
| `space-12` | 48 |
| `space-16` | 64 |
| `space-24` | 96 |

---

## 5. Layout

### Breakpoints

| Name | Min Width |
|------|-----------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |

### Container

| Level | Max Width |
|-------|-----------|
| `prose` | 680px（読み物） |
| `app` | 1200px（アプリ本体） |
| `wide` | 1440px（LP広域） |

### Grid

12カラム、gutter `space-6` (24px)。

---

## 6. Border Radius

| Token | 値 | 用途 |
|-------|-----|------|
| `radius-sm` | 4px | Input, Tag |
| `radius-md` | 8px | Card, Button |
| `radius-lg` | 16px | Modal, Sheet |
| `radius-full` | 9999px | Avatar, Pill |

角張りすぎず柔らかすぎずの中庸。

---

## 7. Shadow

| Token | 値 | 用途 |
|-------|-----|------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.04)` | 区切り強調 |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.06)` | Card浮き |
| `shadow-lg` | `0 12px 32px rgba(0,0,0,0.08)` | Modal |

**控えめなシャドウ**。強いドロップシャドウは使わない。

---

## 8. Motion

### Duration

| Token | 値 | 用途 |
|-------|-----|------|
| `dur-fast` | 150ms | hover, focus |
| `dur-base` | 240ms | 標準遷移 |
| `dur-slow` | 400ms | ページ遷移 |
| `dur-pace` | 800ms | 強調表示 |

### Easing

```css
--ease-out: cubic-bezier(0.2, 0.8, 0.4, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

**原則**: アニメは控えめ。注意を引くためではなく、状態の連続性を担保するため。

---

## 9. Components

### Button

| Variant | 背景 | 文字 | Border |
|---------|------|------|--------|
| `primary` | `luna-gold` | `white` | なし |
| `secondary` | `white` | `luna-ink` | `luna-border` |
| `ghost` | transparent | `luna-ink` | なし |
| `danger` | `danger` | `white` | なし |

- padding: `12px 24px`（md）、 `8px 16px`（sm）
- radius: `radius-md`
- font-weight: 500

### Input

- padding: `12px 16px`
- border: `1px solid luna-border`
- focus: `border-color: luna-gold; box-shadow: 0 0 0 3px luna-gold-soft / 20%`
- invalid: `border-color: danger`

### Card

- bg: `white`
- border: `1px solid luna-border`
- radius: `radius-md`
- padding: `space-6` (24px)
- shadow: `shadow-sm`（通常）/ `shadow-md`（hover）

### Modal / Sheet

- backdrop: `rgba(26, 26, 26, 0.4)`
- radius: `radius-lg`
- 最大幅: 480px（sheet）/ 720px（modal）
- motion: `dur-base` で下からスライドイン（sheet）、フェードイン（modal）

### Avatar

- shape: `radius-full`
- サイズ: 32/40/56/80px
- fallback: イニシャルを `luna-off-white` 背景 + `luna-gold` 文字で表示

---

## 10. Voice & Tone

### UIコピー原則

- **敬語ベース**だが、堅苦しくしない（「です・ます」は維持）
- **命令形を避ける**（「送信する」ではなく「送信」）
- **感情語を避ける**（「素晴らしい」「簡単に」等の過剰表現NG）
- **情報量は最小限**（エラーメッセージは何が起きたか + 次に何をするかの2文）

### 良い例 / 悪い例

```
❌ 悪い: 「おめでとうございます！プロフィールを作成できました 🎉」
✅ 良い: 「プロフィールを作成しました」

❌ 悪い: 「申し訳ありませんが、エラーが発生いたしました」
✅ 良い: 「保存できませんでした。もう一度お試しください」
```

---

## 11. Accessibility

- 色コントラスト: WCAG AA 以上（本文4.5:1, 大文字3:1）
- フォーカスリング: 全インタラクション要素に必須（`luna-gold-soft` 3px）
- キーボード操作: Tab順序が視覚順序と一致
- 画像alt: 装飾は `alt=""`, 意味がある画像は具体的に記述
- ARIA: 過剰な付与を避け、セマンティックHTMLを優先

---

## 12. 禁止事項

- **他ブランドのミラー**（Stripe風、Apple風、Airbnb風等のコピー）
- **流行のスタイル追従**（ニューモーフィズム、極端なブラー背景等）
- **強い感情表現**（過剰なアニメ、派手なグラデーション、絵文字多用）
- **ダークパターン**（誤クリック誘導、強調色で注意を奪う等）

---

## References

- このファイルは Luna の単一の真実源。ブランド変更時は本ファイルのみを更新する。
- 構造の参考: [Google Stitch DESIGN.md](https://stitch.withgoogle.com/docs/design-md/overview/)
- コード生成時は `.claude/skills/design-md.md` スキルを参照。
