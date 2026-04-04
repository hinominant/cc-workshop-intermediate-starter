---
name: diff-analysis
description: Diff-aware分析手順スキル
model: haiku
effort: low
---

# Diff Analysis Skill

## Purpose
git diffから変更影響範囲を特定し、必要なテスト・レビュー範囲を決定する。

## Steps

### 1. 変更ファイル特定
```bash
git diff main...HEAD --name-only
```

### 2. 影響マッピング
変更ファイルから影響範囲を逆算:

| File Pattern | Impact Area | Required Check |
|-------------|-------------|----------------|
| `src/api/**` | API endpoints | Integration tests |
| `src/components/**` | UI | Visual regression, a11y |
| `src/services/**` | Business logic | Unit tests |
| `src/types/**` | Type definitions | All consumers |
| `*.test.*` | Tests only | Run modified tests |
| `*.config.*` | Configuration | Full test suite |

### 3. テスト範囲決定
- 変更ファイルの直接テスト
- インポートグラフから依存ファイルのテスト
- 設定ファイル変更時はフルスイート

### 4. レポート
```markdown
## Diff Analysis
- Changed files: N
- Impact scope: [narrow/medium/wide]
- Required tests: [list]
- Risk areas: [list]
```

## Dry-Run Mode

`--dry-run` 指定時はテスト範囲決定のみ行い、テスト実行は行わない:
- 変更ファイル一覧
- 影響マッピング結果
- 推奨テスト範囲（実行はしない）

```
[DRY-RUN] diff-analysis: changed=5 files, impact=medium, tests=[unit:3, integration:1]
```
