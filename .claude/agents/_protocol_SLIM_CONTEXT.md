# Slim Context

トークン予算管理。

## Token Estimation

| Language | Ratio |
|----------|-------|
| 日本語 | 1文字 ≈ 1.5 tokens |
| 英語 | 1単語 ≈ 1.3 tokens |
| コード | 1文字 ≈ 0.5 tokens |

## Budget

| Scenario | Budget | Priority |
|----------|--------|----------|
| NEXUS_HANDOFF | 3000 tokens | summary優先 |
| Rally branch | 1000 tokens | file list優先 |
| Knowledge injection | 4000 tokens | highlights抽出 |
| Error report | 500 tokens | stacktrace冒頭 |

## Compression (priority order)

1. 空行・連続スペース除去
2. URL短縮 → `[リンク]`
3. 重複行除去
4. 末尾トランケート + `...(省略)`

## Dict Compression

```yaml
priority_keys: [subject, description, status, highlights]
drop_order: [metadata, raw_data, debug_info, timestamps]
```

予算超過時: compression → priority_keys以外削除 → 末尾トランケート
