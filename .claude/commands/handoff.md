# Handoff — セッション引き継ぎ

長時間タスクをセッション境界を越えて継続する。
コンテキスト80%到達時に自動的に呼ばれるが、手動でも実行可能。

## タスク

$ARGUMENTS

## 実行手順

### 1. 現在の状態を保存
```bash
node scripts/session-handoff.js save
```

これで以下が `.context/session-handoff.md` に保存される:
- チケット情報
- Phase状態 + checkpoints
- Git状態（status + 直近コミット）
- Phase Summaries
- 新セッションでの再開手順

### 2. 進捗をコミット
途中経過でもOK。失われない状態にする。
```bash
# キリの良いところまでテスト通過確認
# git add → /quality-gate
```

### 3. ユーザーに通知
「セッション引き継ぎ準備完了。新しいセッションを起動してください」と伝える。
新セッションで session-start-handoff hook が自動発火し、handoff内容を読み込む。

### 4. 完了確認
新セッションで作業が再開されたら:
```bash
node scripts/session-handoff.js clear
```
でhandoffファイルをクリア。

## 自動実行

context-monitor.js が以下のタイミングで自動実行:
- 80%到達: `session-handoff.js save` 自動呼び出し
- 90%到達: 強制保存 + 終了推奨

## 関連ファイル
- `_common/SESSION_HANDOFF.md`: プロトコル
- `scripts/session-handoff.js`: CLI
- `_templates/hooks/context-monitor.js`: 閾値検知hook
- `_templates/hooks/session-start-handoff.js`: 新セッション側自動読込
