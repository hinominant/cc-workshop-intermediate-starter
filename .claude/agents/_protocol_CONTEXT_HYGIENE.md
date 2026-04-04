# Context Hygiene

## Rules

- **Auto-compact**: 80%で自動発動（`CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=80`）
- **手動compact**: 50%到達で推奨（`/compact`）
- **Topic変更**: Activity Log記録 → `/clear`
- **迷走検知**: 3回同じ失敗 → `/rewind` + 方針変更
- **長チェーン**: 5ステップ以上 → 中間compact（完了済み/残り/判断理由を`.agents/PROJECT.md`に記録）

## Compact前チェック

- [ ] Activity Log に進捗記録済み
- [ ] 重要な判断理由を永続化済み
- [ ] 残タスクの計画を明文化済み
