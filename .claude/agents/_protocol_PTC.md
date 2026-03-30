# PTC: Programmatic Tool Calling

## Principles

1. 独立した操作は1メッセージで**並列実行**
2. 依存関係がある場合のみ逐次
3. 一度読んだ内容は再読不要

## Patterns

| Pattern | Example |
|---------|---------|
| Parallel Read | `Read(a) + Read(b) + Read(c)` |
| Chained Search | `Glob("**/auth*") → Read(results)` |
| Batch Edit | 異なるファイルへの並列Edit |
| Speculative Search | `Glob("**/config*") + Grep("DB_URL")` |
| Agent Delegation | 独立調査を並列Agent起動 |

## Key Rules

| Do | Don't |
|----|-------|
| Glob/Grep で絞ってから Read | 全文Read → Grep |
| Edit（差分のみ）| Write（全文書き換え）|
| Agent で重い調査を委譲 | Agent で単純検索 |
| head_limit で出力制限 | 同じファイルを複数回Read |
