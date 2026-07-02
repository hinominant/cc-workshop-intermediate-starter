# ripple — 影響分析 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## VERTICAL IMPACT ANALYSIS

Vertical analysis traces the dependency chain to identify all affected areas.

### Dependency Tracking Commands

```bash
# Find all files importing a module
grep -rl "from.*ModuleName" src --include="*.ts" --include="*.tsx"

# Using madge for dependency tree
npx madge --depends-on src/path/to/file.ts src/

# Find reverse dependencies (what depends on this)
npx madge --why src/target/file.ts src/

# Generate dependency graph for specific file
npx madge --image impact.svg src/path/to/file.ts
```

### Impact Categories

| Category | Description | Detection Method |
|----------|-------------|------------------|
| **Direct Dependents** | Files that directly import the changed module | `grep -rl "from.*changed-module"` |
| **Transitive Dependents** | Files that depend on direct dependents | `npx madge --depends-on` recursive |
| **Interface Consumers** | Code using exported types/interfaces | TypeScript compiler, grep for type names |
| **Test Files** | Tests that cover the changed code | `*.test.ts`, `*.spec.ts` matching patterns |
| **Configuration** | Config files that reference the module | Package.json, tsconfig paths, etc. |

### Breaking Change Detection

| Change Type | Risk Level | Detection |
|-------------|------------|-----------|
| **Rename export** | HIGH | All importers break |
| **Remove export** | CRITICAL | All importers break, no fallback |
| **Change function signature** | HIGH | All callers need update |
| **Change return type** | MEDIUM-HIGH | Type-dependent code breaks |
| **Add required parameter** | HIGH | All callers need update |
| **Change default value** | LOW-MEDIUM | Behavior change, may be silent |
| **Internal refactoring** | LOW | No external impact if API unchanged |

### Impact Depth Levels

```
Level 0: Changed file itself
    ↓
Level 1: Direct importers (high confidence)
    ↓
Level 2: Importers of importers (medium confidence)
    ↓
Level 3+: Transitive dependencies (lower confidence)
```

---

## HORIZONTAL CONSISTENCY ANALYSIS

Horizontal analysis ensures the change follows established patterns and conventions.

### Pattern Categories to Check

| Category | Examples | Detection |
|----------|----------|-----------|
| **Naming Conventions** | Variable names, function names, file names | Regex patterns, ESLint rules |
| **File Structure** | Component organization, folder hierarchy | Directory comparison |
| **Code Patterns** | Error handling, data fetching, state management | AST analysis, grep patterns |
| **API Patterns** | Request/response format, error codes | Schema comparison |
| **Type Patterns** | Interface naming, type organization | TypeScript analysis |

### Naming Convention Checks

```bash
# Check function naming (camelCase)
grep -E "function [A-Z]" src/ -r --include="*.ts"

# Check component naming (PascalCase)
grep -E "const [a-z].*= \(" src/components -r --include="*.tsx"

# Check interface naming (I-prefix or no prefix)
grep -E "interface [^I]" src/ -r --include="*.ts"

# Check file naming patterns
find src -name "*.ts" | grep -v -E "^[a-z-]+\.ts$"
```

### Pattern Compliance Matrix

| Pattern | Status | Evidence |
|---------|--------|----------|
| Error handling | ✅ / ⚠️ / ❌ | Uses project's ErrorBoundary pattern |
| State management | ✅ / ⚠️ / ❌ | Follows Zustand conventions |
| API calls | ✅ / ⚠️ / ❌ | Uses established fetcher pattern |
| Type definitions | ✅ / ⚠️ / ❌ | Interfaces in types/ directory |
| Test structure | ✅ / ⚠️ / ❌ | Follows describe/it pattern |

### Existing Pattern Discovery

```bash
# Find similar implementations for reference
grep -rl "similar pattern" src --include="*.ts" | head -5

# Count pattern usage across codebase
grep -c "pattern" src/**/*.ts | sort -t: -k2 -rn | head -10

# Find established conventions in similar files
ls src/components/*.tsx | head -5
```

---

## RISK SCORING MATRIX

### Risk Dimensions

| Dimension | Weight | Description |
|-----------|--------|-------------|
| **Impact Scope** | 30% | Number of affected files/modules |
| **Breaking Potential** | 25% | Likelihood of breaking existing code |
| **Pattern Deviation** | 20% | Degree of deviation from conventions |
| **Test Coverage** | 15% | Existing test coverage of affected areas |
| **Reversibility** | 10% | Ease of rollback if issues arise |

### Severity Levels

| Level | Score | Criteria |
|-------|-------|----------|
| **CRITICAL** | 9-10 | Breaking change to public API, data loss risk, security impact |
| **HIGH** | 7-8 | Many files affected, significant pattern deviation, low test coverage |
| **MEDIUM** | 4-6 | Moderate scope, some pattern concerns, adequate coverage |
| **LOW** | 1-3 | Small scope, follows patterns, well-tested area |

### Risk Calculation Formula

```
Risk Score = (Scope × 0.30) + (Breaking × 0.25) + (Pattern × 0.20) + (Coverage × 0.15) + (Reversibility × 0.10)

Where each factor is rated 1-10:
- Scope: 1 (single file) to 10 (system-wide)
- Breaking: 1 (internal only) to 10 (public API change)
- Pattern: 1 (follows all patterns) to 10 (introduces new pattern)
- Coverage: 1 (100% covered) to 10 (0% covered)
- Reversibility: 1 (easy rollback) to 10 (irreversible)
```

---

