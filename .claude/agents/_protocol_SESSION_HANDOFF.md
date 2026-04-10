# Session Handoff Protocol

長時間タスクをセッション境界を越えて継続するための仕組み。

---

## 目的

Claude Codeのコンテキスト使用率が80%を超えた時点で、作業状態を完全保存し、
新しいセッションが同じ状態から自動的に再開できるようにする。

---

## トリガー条件

### 80%閾値（推奨）
- ツール呼び出し回数: 200回以上
- context-monitor.js が PostToolUse hookで検知
- additionalContext で `/handoff` の実行を推奨

### 90%閾値（緊急）
- ツール呼び出し回数: 225回以上
- 即座に handoff 実行が必須
- 残り作業余力なし

---

## handoff手順

### 1. 保存
```bash
node scripts/session-handoff.js save
```

以下を `.context/session-handoff.md` に保存:
- チケット情報（ID/タイトル/ラベル）
- Phase状態（現在のPhase/履歴/checkpoints）
- Git状態（status/直近コミット）
- Phase Summaries（各Phaseの完了内容）
- 新セッションでの再開手順

### 2. コミット
途中経過でもコミット推奨。失われない状態にする。

### 3. セッション終了
このセッションを終わらせる（/exit またはウィンドウ閉じる）。

### 4. 新セッション起動
同じディレクトリで新しいClaude Codeセッションを起動。

### 5. 自動復元
- session-start-handoff.js hook が SessionStart で発火
- session-handoff.md を検知 → additionalContext で内容提示
- 新セッションのAIが内容を読んで作業継続

### 6. クリア
作業完了後:
```bash
node scripts/session-handoff.js clear
```

---

## hook 構成

| Hook | タイミング | 役割 |
|------|----------|------|
| context-monitor.js | PostToolUse | ツール呼び出し回数カウント、閾値超過時にhandoff推奨 |
| session-start-handoff.js | SessionStart | session-handoff.md検知→自動復元 |

---

## 状態ファイル

| ファイル | 役割 |
|---------|------|
| `.context/session-handoff.md` | handoff内容（マークダウン） |
| `.context/tool-call-counter.json` | 現在のツール呼び出し回数 |
| `.context/handoff-recommended` | handoff推奨フラグ |

---

## /autodev との連携

`/autodev` フローで実行中に context-monitor が閾値超過を検知:
1. 現在のPhaseのキリの良い場所まで完了
2. `node scripts/session-handoff.js save` 自動実行
3. session-handoff.md に Phase状態 + 残タスクが保存される
4. AIがユーザーに「セッション切り替えてください」と通知
5. 新セッションで session-start-handoff hook が発火 → 自動継続

---

## 制限事項

- Claude Code内部APIから直接コンテキスト使用率を取得できないため、
  ツール呼び出し回数を代理指標としている
- 新セッションの自動起動はできない（手動起動が必要）
- 4時間以上経過したセッションはカウンターを自動リセット
