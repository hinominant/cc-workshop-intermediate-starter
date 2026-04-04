---
name: debug
description: 構造化デバッグプロトコル。対処療法を物理ブロックし、仮説ベースで根本原因を特定する
model: opus
effort: high
---

# Debug Skill

## Purpose
対処療法ではなく根本原因を仮説ベースで特定する。debug-guard.js hookが外部検索・レビューなしの修正を物理ブロックする。

## 起動
```bash
mkdir -p .context && touch .context/debug-mode && rm -f .context/debug-reviewed .context/debug-rejected.md
```

## Process（Step 0〜2は並行OK。修正前に全完了が必須）

### Step 0: 行動ログ収集
- git log、セッションログ(jsonl)、tool-log.jsonl、git管理外の変更(.env, OS設定, launchd等)

### Step 1: 依存マップ展開
- 壊れている機能の全依存関係を2階層先まで展開。各依存をコマンドで実際に確認（正常/異常/未確認）

### Step 2: 外部知識検索（強制。hookがブロック）
- 最低3クエリ: 症状+ツール名、エラーメッセージ、GitHub Issues
- 公式ドキュメント確認が最重要。仕様を推測しない
- Issueのコメントまで全部読む

### Step 3: 仮説ツリー + レビュー（マルチ視点Agent並列）
- Agent A(インフラ) / Agent B(アプリ+副作用チェック) / Agent C(外部知識) を並列実行
- 棄却済み仮説(`.context/debug-rejected.md`)を必ず渡す
- 統合時にレビュー5観点: 本当にそう？/ 他にない？/ 副作用は？/ 問い自体合ってる？/ 過去の行動が原因？
- 統合後 `touch .context/debug-reviewed` → hookが修正を許可

### Step 4: 仮説検証（沼りループ）
- 1つずつ検証。修正後は必ずユーザーに動作確認依頼
- 棄却時: `.context/debug-rejected.md`に自動記録
- 3つ連続棄却 → マルチ視点Agentを棄却済み仮説付きで再実行
- 全滅 → Step 4b(ワークアラウンド検索) → Step 4c(問題の再定義)

### Step 5: 調査ログ記録
- `ops/investigations/YYYY-MM-DD_{topic}.md`に記録。git commitで永続化
- `rm -f .context/debug-mode .context/debug-reviewed .context/debug-rejected.md`

## Boundaries
- 「根本原因はこれ」と断言しない。仮説を証拠で棄却/有力と判定
- 「できません」で終わらない。ワークアラウンド→再定義→ユーザーと一緒に考える
- 「直った」= ユーザーが実際に操作して確認済み

## hook連携
| hook | 条件 | 動作 |
|------|------|------|
| debug-guard.js | debug-mode中 + 検索なし | block |
| debug-guard.js | debug-mode中 + レビューなし | block |
| debug-guard.js | 30分3回修正 + 検索0 | ask_user |
| debug-guard.js | .context/操作 | 常に許可 |
| debug-guard.js | .claude/hooks,skills修正 | ask_user |
