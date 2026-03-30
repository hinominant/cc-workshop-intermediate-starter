---
name: secret-scan
description: コードベースからシークレット（APIキー・トークン・パスワード等）の漏洩を検出・防止するスキル
model: haiku
effort: low
---

# Secret Scan Skill

## Purpose
コードベース・コミット履歴にシークレット情報が含まれていないか検査し、漏洩を未然に防止する。

## Scan Targets

| 対象 | チェック内容 |
|------|------------|
| ソースコード | ハードコードされた API キー、トークン、パスワード |
| 設定ファイル | `.env` が `.gitignore` に含まれているか |
| Git 履歴 | 直近コミットにシークレットが混入していないか |
| CI/CD 設定 | GitHub Actions secrets が適切に使われているか |

## Detection Patterns

```regex
# API Keys / Tokens
(?i)(api[_-]?key|api[_-]?secret|access[_-]?token|auth[_-]?token)\s*[=:]\s*['"]?[A-Za-z0-9_\-]{16,}

# AWS
AKIA[0-9A-Z]{16}

# Generic Secrets
(?i)(password|passwd|secret|private[_-]?key)\s*[=:]\s*['"]?[^\s'"]{8,}

# Database URLs
(?i)(postgres|mysql|mongodb)://[^\s'"]+:[^\s'"]+@

# Bearer Tokens
Bearer\s+[A-Za-z0-9_\-\.]{20,}
```

## Steps

### 1. ファイルスキャン
```bash
grep -q '\.env' .gitignore 2>/dev/null || echo "WARNING: .env not in .gitignore"
```

### 2. Git 履歴チェック
```bash
git diff HEAD~5..HEAD | grep -iE '(api_key|secret|token|password)\s*[=:]'
```

### 3. レポート出力
```markdown
## Secret Scan Report
| 重大度 | ファイル | 行 | 検出内容 | 対応 |
|--------|---------|-----|---------|------|
```

### 4. 自動修正提案
- ハードコード → `os.environ['XXX']` / `process.env.XXX` に置換
- `.env` 未 gitignore → `.gitignore` に追加

## Dry-Run Mode

`--dry-run` 指定時はスキャン対象ファイル一覧と検出パターン数のみ出力。

```
[DRY-RUN] secret-scan: targets=42 files, patterns=5
```
