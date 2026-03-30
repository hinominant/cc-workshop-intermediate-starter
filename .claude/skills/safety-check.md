---
name: safety-check
description: 破壊的操作の事前検知・警告・安全な代替案の提示を行うスキル
model: haiku
effort: low
---

# Safety Check Skill

## Purpose
破壊的なコマンドや操作を実行前に検知し、明確な警告と安全な代替案を提示する。

## Risk Classification

### BLOCK（即座にブロック）

| パターン | 理由 |
|---------|------|
| `rm -rf /` or `rm -rf ~` | システム/ホーム破壊 |
| `DROP DATABASE` / `DROP TABLE` (本番) | データ不可逆消失 |
| シークレットを含む curl/wget | 認証情報の外部送信 |
| `chmod 777` | セキュリティ脆弱性 |
| `git push --force` to main/master | 共有履歴の破壊 |
| Luna DB への INSERT/UPDATE/DELETE | READ ONLY 違反 |

### HIGH（警告 + 確認要求）

| パターン | 警告内容 |
|---------|---------|
| `rm -rf <dir>` | 「このディレクトリ配下の全ファイルが削除されます」 |
| `git reset --hard` | 「未コミットの変更が全て失われます」 |
| `git push --force` | 「リモートの履歴が上書きされます」 |
| `DROP TABLE` | 「テーブルとデータが不可逆に削除されます」 |
| `TRUNCATE` | 「テーブルの全データが削除されます」 |

### LOW（サイレント通過）

| パターン |
|---------|
| `git status`, `git log`, `git diff` |
| `Read`, `Grep`, `Glob` |
| `ls`, `cat`, `echo` |

## Safe Alternatives

| 危険な操作 | 安全な代替 |
|-----------|-----------|
| `git push --force` | `git push --force-with-lease` |
| `rm -rf dir` | `mv dir dir.bak` → 確認後削除 |
| `git reset --hard` | `git stash` → reset → 必要なら `git stash pop` |
| `DROP TABLE` | `ALTER TABLE old RENAME TO old_backup` |
| `git checkout -- .` | `git stash` で退避してから検討 |

## Integration

このスキルは `_common/TOOL_RISK.md` プロトコルおよび `hooks/tool-risk.js` フックと連携して動作する。

## Dry-Run Mode

`--dry-run` 指定時はリスク判定結果のみ出力し、操作は実行しない。

```
[DRY-RUN] safety-check: operation=git push, risk=MEDIUM, alternative=git push --force-with-lease
```
