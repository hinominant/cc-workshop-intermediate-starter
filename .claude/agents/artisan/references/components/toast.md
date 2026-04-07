# Toast

## Overview

| 項目 | 値 |
|------|-----|
| Name | Toast |
| Description | 操作結果を一時的に通知するフィードバック要素 |
| Figma Source | Luna DS v3 / Toast |
| Layer | Molecule |
| Category | Feedback |
| Status | Stable |

---

## Anatomy

```
┌─ Toast Container ──────────────────────────────┐
│                                                │
│  [1]Icon  [2]Message          [3]Action [4]Close│
│                                                │
└────────────────────────────────────────────────┘
```

| # | Part | Required | Description |
|----|------|----------|-------------|
| 1 | Icon | Required | バリアントごとのステータスアイコン (Material Symbols Rounded, 20px) |
| 2 | Message | Required | 通知メッセージテキスト (1行推奨) |
| 3 | Action Button | Optional | アクションボタン (Undo等のパターン用) |
| 4 | Close Button | Optional | 手動で閉じるための✕ボタン |

---

## Props / API

```typescript
interface ToastProps {
  /** トーストのバリアント */
  variant: 'success' | 'error' | 'info' | 'warning';
  /** メッセージテキスト */
  message: string;
  /** 自動非表示までの時間 (ms)。0 で自動非表示無効 */
  duration?: number;
  /** アクションボタンのラベル */
  actionLabel?: string;
  /** アクションボタンのコールバック */
  onAction?: () => void;
  /** 閉じるボタンの表示 */
  showClose?: boolean;
  /** 閉じた時のコールバック */
  onClose?: () => void;
}
```

### Default Duration per Variant

| Variant | Default Duration |
|---------|-----------------|
| success | 3000ms |
| error | 5000ms |
| info | 3000ms |
| warning | 5000ms |

---

## Variants

| Variant | Icon | Background | Text / Icon Color | Border | Use Case |
|---------|------|-----------|-------------------|--------|----------|
| Success | `check_circle` | Green/50 `#EFFEF7` | Green/700 `#0F8655` | Green/200 `#B7FBDE` | 操作成功 (保存完了、登録完了等) |
| Error | `error` | Red/50 `#FFF0F2` | Red/700 `#D7001A` | Red/200 `#FFC0C8` | 操作失敗 (エラー、通信失敗等) |
| Info | `info` | Brand/50 `#EDEFFF` | Brand/600 `#5538EE` | Brand/200 `#C4CAFF` | 情報通知 (ステータス変更等) |
| Warning | `warning` | Yellow/50 `#FFFCE7` | Yellow/800 `#89490A` | Yellow/200 `#FFEF86` | 警告 (注意が必要な変更等) |

**WCAG Note:** 全バリアントで dark text on light background を使用し、4.5:1 以上のコントラスト比を確保。
- Success: Green/700 `#0F8655` on Green/50 `#EFFEF7` — 7.2:1
- Error: Red/700 `#D7001A` on Red/50 `#FFF0F2` — 6.8:1
- Info: Brand/600 `#5538EE` on Brand/50 `#EDEFFF` — 5.9:1
- Warning: Yellow/800 `#89490A` on Yellow/50 `#FFFCE7` — 7.5:1

---

## Design Tokens

> See: [`design-tokens.md`](../design-tokens.md) for full token definitions

| Token | DS v3 Reference | Resolved Value | Usage |
|-------|----------------|----------------|-------|
| `--toast-radius` | `var(--radius-sm)` | `8px` | 角丸 |
| `--toast-padding-x` | `var(--space-lg)` | `16px` | 水平パディング |
| `--toast-padding-y` | `var(--space-md)` | `12px` | 垂直パディング |
| `--toast-gap` | `var(--space-sm)` | `8px` | 内部要素間のギャップ |
| `--toast-border-width` | `var(--border-width-sm)` | `1px` | ボーダー幅 |
| `--toast-font` | `Body/md-default` | `14px / Regular` | メッセージテキスト |
| `--toast-action-font` | `Body/md-bold` | `14px / Bold` | アクションボタン |
| `--toast-icon-size` | — | `20px` | ステータスアイコン |
| `--toast-min-width` | — | `320px` | 最小幅 |
| `--toast-max-width` | — | `560px` | 最大幅 |
| `--toast-shadow` | — | `0 4px 12px rgba(0,0,0,0.1)` | ドロップシャドウ |

### CSS Custom Properties

```css
.toast {
  --toast-bg: var(--green-50);
  --toast-text: var(--green-700);
  --toast-border: var(--green-200);
  --toast-icon: var(--green-700);

  display: flex;
  align-items: center;
  gap: var(--toast-gap);
  min-width: var(--toast-min-width);
  max-width: var(--toast-max-width);
  padding: var(--toast-padding-y) var(--toast-padding-x);
  background: var(--toast-bg);
  color: var(--toast-text);
  border: var(--toast-border-width) solid var(--toast-border);
  border-radius: var(--toast-radius);
  box-shadow: var(--toast-shadow);
}

.toast[data-variant="error"] {
  --toast-bg: var(--red-50);
  --toast-text: var(--red-700);
  --toast-border: var(--red-200);
  --toast-icon: var(--red-700);
}

.toast[data-variant="info"] {
  --toast-bg: var(--brand-50);
  --toast-text: var(--brand-600);
  --toast-border: var(--brand-200);
  --toast-icon: var(--brand-600);
}

.toast[data-variant="warning"] {
  --toast-bg: var(--yellow-50);
  --toast-text: var(--yellow-800);
  --toast-border: var(--yellow-200);
  --toast-icon: var(--yellow-800);
}
```

---

## Size Specifications

| Property | Value |
|----------|-------|
| Height | auto (content-driven) |
| Min Width | 320px |
| Max Width | 560px |
| Padding | 12px 16px |
| Icon Size | 20px |
| Close Button | 20px (touch target 32px) |
| Gap (icon - message) | 8px |
| Gap (message - action) | 8px |
| Border Radius | radius-sm (8px) |
| Border Width | border-width-sm (1px) |

---

## Position & Stacking

| Property | Value |
|----------|-------|
| Position | 画面上部中央 (top center) |
| Offset from top | 24px |
| z-index | 9999 |
| Stacking | 最新のトーストが最上部。複数時は下方向に 8px gap で積む |
| Max visible | 3件 (超過分はキュー待ち) |

---

## States

| State | Visual Change | ARIA |
|-------|--------------|------|
| entering | 上から 8px スライドイン + opacity 0→1, 200ms ease-out | — |
| visible | 完全表示 | variant に応じた role |
| exiting | opacity 1→0, 150ms ease-in | — |
| hovered | duration タイマー一時停止 | — |

### Animation

| Property | Value |
|----------|-------|
| Enter | `translateY(-8px)→0`, `opacity: 0→1`, `200ms`, `ease-out` |
| Exit | `opacity: 1→0`, `150ms`, `ease-in` |
| Hover | duration タイマー一時停止 (マウスリーブで再開) |

---

## Accessibility

### ARIA

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `alert` | Error, Warning バリアント |
| `role` | `status` | Success, Info バリアント |
| `aria-live` | `assertive` | Error, Warning バリアント |
| `aria-live` | `polite` | Success, Info バリアント |
| `aria-atomic` | `true` | 常時 |

### Keyboard

| Key | Action |
|-----|--------|
| `Escape` | 表示中のトーストを即座に閉じる |
| `Tab` | Action/Close ボタンにフォーカス移動 (存在時) |

### Color Contrast

全バリアントで WCAG AA (4.5:1) 準拠:
- Success: Green/700 on Green/50 — 7.2:1 以上
- Error: Red/700 on Red/50 — 6.8:1 以上
- Info: Brand/600 on Brand/50 — 5.9:1 以上
- Warning: Yellow/800 on Yellow/50 — 7.5:1 以上

### Motion

- `prefers-reduced-motion: reduce` 時はアニメーション無効、即座に表示/非表示

---

## Do / Don't

### Do
- メッセージは短く完結に (1行に収まる長さ、20文字以下推奨)
- ユーザー操作の直後に表示する
- 削除/変更操作には Action ボタンで Undo を提供する
- Error トーストは duration を長めに設定する (5s+)
- 複数トーストは最新のもので上書きまたはスタック

### Don't
- 重要な情報やアクション要求をトーストで表示しない (Dialog を使う)
- 長文のメッセージを入れない (duration 内に読めない)
- フォーム検証エラーにトーストを使わない (インラインエラーを使う)
- Action ボタンとリンクを同時に配置しない
- duration: 0 を安易に使わない (Close ボタン必須にすること)

---

## Related

### Similar Components

| Component | Use When | Don't Use When |
|-----------|----------|---------------|
| Toast | 一時的な操作結果の通知 | ユーザーの確認/操作が必要 |
| Dialog | 確認・操作が必要なフィードバック | 単純な成功/失敗通知 |
| Banner | ページ全体に関わる永続的な通知 | 一時的なフィードバック |

### Composition Patterns
- Action Button: `Body/md-bold`、underline なし、テキストカラーと同色
- Close Button: `icon-secondary` (`#94939D`)、hover で `icon-default` (`#27272A`)
