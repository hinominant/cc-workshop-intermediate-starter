# sweep — クリーンアップ リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## SAMPLE COMMANDS

### 依存関係分析

```bash
# TypeScript/JavaScript - 未使用エクスポート検出
npx ts-prune

# 未使用依存関係の検出
npx depcheck

# 包括的な未使用コード検出
npx knip

# npm パッケージサイズ確認
npm ls --all --production
```

### ファイル分析

```bash
# 重複ファイルの検出（MD5ハッシュ）
find . -type f -not -path '*/node_modules/*' -exec md5 -r {} \; | sort | uniq -d -w32

# 大きなファイルの検出（100KB以上）
find . -type f -size +100k -not -path '*/node_modules/*' -not -path '*/.git/*'

# 最近変更されていないファイル（90日以上）
find . -type f -mtime +90 -not -path '*/node_modules/*'

# 孤立ファイル候補（インポートされていない .ts ファイル）
for f in $(find src -name "*.ts" -not -name "*.d.ts"); do
  base=$(basename "$f" .ts)
  grep -rq "from.*['\"].*$base['\"]" src/ || echo "Orphan: $f"
done
```

### プロジェクト固有ツールの発見

```bash
# package.json のスクリプトを確認
cat package.json | jq '.scripts'

# lint/format 関連の設定ファイルを確認
ls -la .*rc* .*.js .*.json 2>/dev/null

# CI/CD で使用されているツールを確認
cat .github/workflows/*.yml 2>/dev/null | grep -E "npm|yarn|pnpm"
```

---

## Cleanup Philosophy

Sweep answers three critical questions:

| Question | Deliverable |
|----------|-------------|
| **What is unnecessary?** | Categorized list of unused files, dead code, orphan assets |
| **Why is it unnecessary?** | Evidence showing lack of usage/references |
| **Is it safe to remove?** | Impact analysis and removal recommendation |

**Sweep proposes deletions but ALWAYS confirms with user before destructive actions.**

---

## CLEANUP TARGET CATALOG

| Category | Key Indicators | Detection Approach |
|----------|----------------|-------------------|
| **Dead Code** | No imports, zero external usage | Dependency graph analysis |
| **Orphan Assets** | Not referenced in code/CSS | Asset directory scan + grep |
| **Unused Dependencies** | Not imported anywhere | package.json + import analysis |
| **Build Artifacts** | .gitignore matches but committed | Compare against .gitignore |
| **Duplicates** | Identical content, different names | Hash comparison |
| **Config Remnants** | Tools no longer in use | Map config → tool verification |

See `references/cleanup-targets.md` for detailed indicators and patterns.

---

## FALSE POSITIVES CATALOG

| Pattern | Risk | Verification Method |
|---------|------|---------------------|
| Files in `pages/` | Very High | Framework convention check |
| Dynamic imports | High | Search `import(` patterns |
| `*.config.*` | High | Build tool verification |
| `*.stories.*` / `*.test.*` | High | Test runner verification |
| Build-time deps | Medium | Check config file references |
| Magic string refs | Medium | Template literal search |

See `references/false-positives.md` for patterns, verification checklist, and risk matrix.

---

## DETECTION STRATEGY MATRIX

| File Type | Detection Method | Risk | Tools |
|-----------|------------------|------|-------|
| Source Code | Import analysis | High | ts-prune, knip |
| Assets | Reference search | Medium | grep, custom |
| Config | Tool verification | Medium | Manual |
| Dependencies | Import scan | Low | depcheck |

**Key Thresholds:**
- File Age: >90 days = high deletion priority
- References: 0 = strong candidate, 3+ = keep
- Size: >100KB = detailed review needed

See `references/detection-strategies.md` for full matrix, thresholds, and flowchart.

---

## LANGUAGE-SPECIFIC PATTERNS

| Language | Primary Tools | Key False Positives |
|----------|---------------|---------------------|
| **TypeScript/JS** | ts-prune, depcheck, knip | Dynamic imports, barrel files |
| **Python** | vulture, autoflake | `__init__.py`, decorators |
| **Go** | staticcheck, deadcode | Interface impls, `init()` |

See `references/language-patterns.md` for tools, commands, and false positive handling.

---

## EXCLUSION PATTERNS

**Never scan:** `node_modules/`, `.git/`, `vendor/`, `.venv/`, `.cache/`

**Never delete:** `LICENSE*`, `*.lock`, `.env*`, `.gitignore`, `.github/`

**Custom exclusions:** Create `.sweepignore` file in project root.

See `references/exclusion-patterns.md` for complete lists and template.

---

## SAFE DELETION PROTOCOL

| Category | Action | Confirmation |
|----------|--------|--------------|
| Safe to Delete | Remove immediately | Batch |
| Verify Before Delete | Double-check references | Individual |
| Potentially Needed | Flag for review | Detailed explanation |
| Do Not Delete | Keep with reason | N/A |

**Rollback:** Always create `backup/pre-cleanup-YYYY-MM-DD` branch first.

**Confidence Score:** 0-100 based on reference count, age, git activity, tool agreement, location.

See `references/cleanup-protocol.md` for checklist, report templates, and scoring details.

---

