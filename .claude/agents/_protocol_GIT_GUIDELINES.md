# Git Commit & PR Guidelines

全エージェント共通のコミット・PRルール。

---

## Commit Format

[Conventional Commits](https://www.conventionalcommits.org/) 形式:

```
<type>(<scope>): <description>
```

### Types

| Type | Description |
|------|-------------|
| `feat` | 新機能 |
| `fix` | バグ修正 |
| `docs` | ドキュメント |
| `refactor` | リファクタリング |
| `perf` | パフォーマンス改善 |
| `test` | テスト追加・更新 |
| `chore` | メンテナンス |
| `security` | セキュリティ修正 |

### Rules

1. **エージェント名をコミットに含めない**
   - NG: `feat: Builder implements validation`
   - OK: `feat(user): add input validation`

2. **50文字以内**
3. **命令形** (fix, add, update...)
4. **Body は "why" を説明** (code が "what" を示す)

---

## PR Format

### Title
```
<type>(<scope>): <brief description>
```

### Description
```markdown
## Summary
変更の概要（1-3文）

## Changes
- 変更1
- 変更2

## Testing
- [ ] ユニットテスト追加/更新
- [ ] 手動テスト完了
```

### Rules
- エージェント名をPRタイトル・本文に含めない
- プロセスではなく変更内容に焦点
- Issue参照: `Fixes #123`

---

## Branch Naming

```
<type>/<short-description>
```

Examples: `feat/user-profile`, `fix/login-timeout`
