# Context Recovery Protocol

> コンテキスト圧縮・セッション再開時の復帰手順。
> 作業開始前に必ず実行する。

---

## Recovery Steps（順序厳守）

1. **RESUME_CONTEXT.md 読み込み** - `.claude/RESUME_CONTEXT.md` が存在する場合、最初に読む（stop-hook が自動生成）
2. **メモリ読み込み** - プロジェクトのメモリファイル（MEMORY.md）を読む
3. **学習レビュー** - `.agents/lessons.md` を読み、過去の失敗・成功パターンを確認する
4. **CLAUDE.md 確認** - 現在のプロジェクトの CLAUDE.md を読む
5. **作業状態の把握** - `git log --oneline -10` + `git status` で直近の変更を確認
6. **圧縮サマリー確認** - コンテキスト圧縮のサマリーがあればそれも読む
7. **共有知識確認** - `.agents/PROJECT.md` の Activity Log で直近の作業履歴を把握

## Rules

- **Step 1-6 が完了するまで実装作業に入らない**
- 復帰後、前セッションの作業を引き継ぐ場合は未完了タスクを特定してから着手
- 自分の役割・担当が不明な場合は、まず確認する（誤った前提で動かない）
