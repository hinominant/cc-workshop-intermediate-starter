# Sweep Language-Specific Patterns Reference

Detection strategies and tools by programming language.

---

## TypeScript / JavaScript

### Recommended Tools

| Tool | Purpose | Usage |
|------|---------|-------|
| `ts-prune` | Unused exports | `npx ts-prune` |
| `depcheck` | Unused dependencies | `npx depcheck` |
| `knip` | Comprehensive analysis | `npx knip` |
| `unimported` | Unimported files | `npx unimported` |

### Common False Positives
- Dynamic imports with template literals
- Re-exports in barrel files (`index.ts`)
- Type-only exports (use `--skip-type-only` in ts-prune)
- Framework convention files (pages, routes)

### Detection Commands
```bash
# Find unused exports
npx ts-prune --error

# Find unused dependencies (with common ignores)
npx depcheck --ignores="@types/*,eslint-*"

# Comprehensive check
npx knip --reporter compact
```

---

## Python

### Recommended Tools

| Tool | Purpose | Usage |
|------|---------|-------|
| `vulture` | Dead code | `vulture src/` |
| `autoflake` | Unused imports | `autoflake --check .` |
| `pip-autoremove` | Unused packages | `pip-autoremove --list` |

### Common False Positives
- `__init__.py` files (module markers)
- Dunder methods (`__str__`, `__repr__`)
- Flask/Django routes with decorators
- Celery tasks

### Detection Commands
```bash
# Find dead code with whitelist
vulture src/ whitelist.py --min-confidence 80

# Check unused imports
autoflake --check --remove-all-unused-imports -r .
```

---

## Go

### Recommended Tools

| Tool | Purpose | Usage |
|------|---------|-------|
| `staticcheck` | Comprehensive linter | `staticcheck ./...` |
| `deadcode` | Dead code detection | `deadcode ./...` |
| `go mod tidy` | Unused deps | `go mod tidy -v` |

### Common False Positives
- Interface implementations
- Exported but unused (public API)
- `init()` functions
- CGO-related code

### Detection Commands
```bash
# Find unused code
staticcheck -checks U1000 ./...

# Find dead code
deadcode -test ./...

# Clean up dependencies
go mod tidy -v 2>&1 | grep -E "(unused|removed)"
```

---

## Language-Agnostic Patterns

**Files commonly misdetected across languages:**
- Entry points (`main.*`, `index.*`, `app.*`)
- Config files (`*.config.*`, `.*rc`)
- Test fixtures and mocks
- Generated code (`*.generated.*`, `*.g.*`)
- Documentation (`*.md`, `docs/*`)
