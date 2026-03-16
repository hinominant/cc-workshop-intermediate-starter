# Sweep Safe Deletion Protocol Reference

Complete protocol for safe cleanup execution.

---

## Pre-Deletion Checklist

Before recommending any deletion:

- [ ] **No active imports** - Verify file is not imported anywhere
- [ ] **No dynamic references** - Check for string-based requires/imports
- [ ] **No config references** - Check build configs, aliases
- [ ] **No test dependencies** - Verify no tests rely on this file
- [ ] **Git history checked** - Confirm not recently added/modified
- [ ] **Not entry point** - Verify not in package.json main/exports
- [ ] **No external documentation** - Check README references

---

## Deletion Categories

| Category | Action | User Confirmation |
|----------|--------|-------------------|
| Safe to Delete | Remove immediately | Batch confirmation |
| Verify Before Delete | Double-check references | Individual confirmation |
| Potentially Needed | Flag for review | Detailed explanation required |
| Do Not Delete | Keep with reason | Inform user why |

---

## Rollback Preparation

Always prepare for rollback:

```bash
# Create restoration branch before cleanup
git checkout -b backup/pre-cleanup-YYYY-MM-DD

# After confirmation, perform cleanup on original branch
git checkout original-branch
```

---

## Cleanup Report Template

### Executive Summary

```markdown
## Repository Cleanup Report

**Scan Date:** YYYY-MM-DD
**Repository:** [repo-name]
**Total Files Scanned:** X
**Cleanup Candidates Found:** Y
**Estimated Space Savings:** Z KB/MB

### Summary by Category

| Category | Count | Size | Risk |
|----------|-------|------|------|
| Dead Code | X | XX KB | High |
| Orphan Assets | X | XX KB | Medium |
| Unused Dependencies | X | - | Low |
| Build Artifacts | X | XX KB | Low |
| Duplicates | X | XX KB | Medium |
| Config Remnants | X | XX KB | Medium |
| **Total** | **X** | **XX KB** | - |
```

### Detailed Findings Format

```markdown
### [CATEGORY-NNN] File/Item Name

- **Path:** `src/path/to/file.ts`
- **Category:** Dead Code / Orphan Asset / etc.
- **Size:** XX KB
- **Risk Level:** Critical / High / Medium / Low
- **Last Modified:** YYYY-MM-DD (X months ago)
- **Last Author:** [git author]

**Evidence:**
- No imports found in codebase
- No references in: [files checked]
- Similar file exists: [if duplicate]

**Recommendation:** Delete / Review / Keep
**Reason:** [Explanation]
**Confidence Score:** XX/100
```

---

## Cleanup Confidence Scoring

Calculate a confidence score for each deletion candidate to prioritize cleanup actions.

### Score Calculation

| Factor | Weight | Criteria |
|--------|--------|----------|
| Reference Count | 30% | 0 refs = 30, 1 ref = 15, 2+ refs = 0 |
| File Age | 20% | >1yr = 20, 6mo-1yr = 15, 1-6mo = 5, <1mo = 0 |
| Git Activity | 15% | No recent commits = 15, Some activity = 5 |
| Tool Agreement | 20% | Multiple tools detect = 20, Single tool = 10 |
| File Location | 15% | test/docs = 15, utils = 10, core/lib = 0 |

### Score Interpretation

| Score | Confidence | Action |
|-------|------------|--------|
| 90-100 | Very High | Safe to delete with batch confirmation |
| 70-89 | High | Delete with individual confirmation |
| 50-69 | Medium | Review before deletion |
| 30-49 | Low | Keep unless manually verified |
| 0-29 | Very Low | Do not delete |

### Example Calculation

```
File: src/utils/oldHelper.ts
- Reference Count: 0 refs → 30 points
- File Age: 8 months → 15 points
- Git Activity: Last commit 6 months ago → 15 points
- Tool Agreement: ts-prune + knip both detect → 20 points
- File Location: utils/ → 10 points
Total: 90/100 (Very High confidence)
```

---

## Dependency Report Format

```markdown
### Unused Dependencies

| Package | Type | Size | Last Used | Recommendation |
|---------|------|------|-----------|----------------|
| lodash | prod | 1.2MB | Never imported | Remove |
| @types/node | dev | 50KB | Type-only, keep | Keep |
```
