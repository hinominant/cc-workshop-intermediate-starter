# Guardrail & Tool Risk Protocol

AUTORUN_FULL モードでの安全な自律実行。

---

## Guardrail Levels

| Level | Name | Action | Use Case |
|-------|------|--------|----------|
| L1 | MONITORING | ログのみ | lint警告、軽微な非推奨 |
| L2 | CHECKPOINT | 自動検証 | テスト失敗<20%、セキュリティ警告 |
| L3 | PAUSE | 自動回復 or 待機 | テスト失敗>50%、破壊的変更 |
| L4 | ABORT | 即時停止 | クリティカルセキュリティ、データ整合性 |

## Auto-Recovery

| Level | Trigger | Recovery | Max |
|-------|---------|----------|-----|
| L2 | test_failure_minor | Builder修正→再テスト | 3 |
| L2 | type_error | Builder型強化 | 2 |
| L2 | lint_error | auto-fix | 1 |
| L3 | test_failure_major | ロールバック + Sherpa再分解 | 2 |
| L3 | breaking_change | Architect影響分析 | 1 |

## Task Type Defaults

| Type | Default Level | Post Checks |
|------|---------------|-------------|
| FEATURE | L2 | tests_pass, build_success |
| SECURITY | L2 | sentinel_scan |
| REFACTOR | L2 | tests_unchanged, no_behavior_change |
| INCIDENT | L3 | service_restored, no_regression |

## Escalation

```
L1 → persists → L2 → recovery_success → CONTINUE
                    → recovery_failed → L3 → resolved → CONTINUE
                                            → critical → L4 → ROLLBACK + STOP
```

---

## Tool Risk (3-Hook Architecture)

| Hook | Phase | Purpose |
|------|-------|---------|
| `tool-risk.js` | PreToolUse | リスク評価・ブロック |
| `post-tool-use.js` | PostToolUse | ログ記録 |
| `stop-hook.js` | Stop | セッションサマリ |

### Risk Levels

| Level | Action |
|-------|--------|
| BLOCK | ARIS NO Gate → 自動ブロック |
| HIGH | 確認ダイアログ（破壊的操作） |
| MEDIUM | 説明表示（外部影響） |
| LOW | サイレント通過 |

### Bash Risk Classification

| Risk | Commands |
|------|----------|
| HIGH | `rm -rf`, `git push --force`, `git reset --hard`, `DROP TABLE`, `kill -9` |
| MEDIUM | `git push`, `git commit`, `npm publish`, `docker build`, `curl -X POST` |
| LOW | `ls`, `git status`, `git log`, `npm test`, `pwd` |

### Tool Risk Classification

| Risk | Tools |
|------|-------|
| MEDIUM | Write, Edit, NotebookEdit |
| LOW | Read, Glob, Grep, WebFetch, WebSearch |

### Install

```bash
install.sh --with-hooks
```
