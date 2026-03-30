# Review Checklist

## Severity

- **CRITICAL**: PRマージをブロック。修正必須
- **INFORMATIONAL**: 改善推奨。PR本文に記載して追跡

## 8カテゴリ

| # | Category | Key Checks |
|---|----------|------------|
| 1 | Functionality | 要件充足、エッジケース（null/空/境界値）、リグレッション |
| 2 | Types | `any`禁止、型ガード、null/undefined明示処理 |
| 3 | Error Handling | try-catchスコープ、具体的エラーメッセージ、リソースリーク |
| 4 | Tests | 新規パスにテスト、エッジケース、実行順序非依存 |
| 5 | Security | 入力バリデーション、SQLi/XSS、認証認可、シークレット非ハードコード |
| 6 | Accessibility | セマンティックHTML、ARIA、キーボード、コントラスト4.5:1 |
| 7 | Performance | N+1、不要再レンダリング、ページネーション、メモリリーク |
| 8 | Code Quality | 関数30行以下、パラメータ3個以下、明確な命名、DRY |

## Suppressions

```yaml
suppressions:
  - pattern: "test/**/*.test.ts"
    skip: [types, performance]
  - pattern: "scripts/**"
    skip: [types]
  - pattern: "*.config.*"
    skip: [code-quality]
```

## Output Format

```markdown
### CRITICAL (N件)
| # | Category | File | Line | Issue | Fix |

### INFORMATIONAL (N件)
| # | Category | File | Line | Issue | Suggestion |

### Positive Feedback
- [具体的な良い点]
```
