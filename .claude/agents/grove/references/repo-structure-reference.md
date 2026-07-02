# grove — リポジトリ構造 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## REPOSITORY STRUCTURE QUICK REFERENCE

> Full language-specific templates, conventions → `references/directory-templates.md`

### Universal Base

```
{project}/
├── src/            # Source code (language-specific internal structure)
├── tests/          # Test files (unit/integration/e2e/fixtures)
├── docs/           # Documentation (Scribe-aligned structure)
├── scripts/        # Helper scripts
├── tools/          # Internal CLI/TUI tools
├── config/         # Configuration files
├── infra/          # Infrastructure as Code
├── .github/        # CI/CD workflows
└── .agents/        # Agent journals
```

### Language Detection Rules

| Indicator | Language | Structure Variant |
|-----------|----------|-------------------|
| `tsconfig.json` / `package.json` | TypeScript/JS | `src/features/` + barrel exports |
| `pyproject.toml` / `setup.py` | Python | `src/{package}/` + `__init__.py` |
| `go.mod` | Go | `cmd/` + `internal/` + `pkg/` (no `src/`) |
| `Cargo.toml` | Rust | `src/` + `crates/` for workspaces |
| `turbo.json` / `pnpm-workspace.yaml` | JS/TS Monorepo | `apps/` + `packages/` |
| `nx.json` | Nx Monorepo | `apps/` + `libs/` |
| `lerna.json` | Lerna (Legacy) | `packages/` (recommend migrate to Turborepo) |
| `go.work` | Go Monorepo | `services/` + `pkg/` (Go 1.18+) |
| `pyproject.toml` + `[tool.uv.workspace]` | Python Monorepo | `packages/` per uv workspace |
| `pants.toml` / `WORKSPACE` | Multi-lang Monorepo | `src/` per Pants/Bazel conventions |
| `settings.gradle.kts` with `include` | JVM Monorepo | Gradle multi-module |
| Parent `pom.xml` with `<modules>` | JVM Monorepo | Maven multi-module |

---

## DOCS STRUCTURE ESSENTIALS

> Full docs/ layout, naming conventions, document lifecycle → `references/docs-structure.md`

### docs/ Directory (Scribe-Aligned)

```
docs/
├── prd/            # PRD: Product Requirements Documents
├── specs/          # SRS: Software Requirements Specifications
├── design/         # HLD/LLD: High-Level / Low-Level Design
├── checklists/     # IMPL/REVIEW: Implementation & Review Checklists
├── test-specs/     # TEST: Test Specifications
├── adr/            # ADR: Architecture Decision Records
├── guides/         # Developer guides (getting-started, contributing)
├── api/            # API documentation (OpenAPI specs)
└── diagrams/       # Visual diagrams (Mermaid, draw.io)
```

### Agent-Directory Mapping

| Directory | Owner Agent | Naming Pattern |
|-----------|------------|----------------|
| `docs/prd/` | Scribe | `PRD-{feature}.md` |
| `docs/specs/` | Scribe | `SRS-{feature}.md` |
| `docs/design/` | Scribe | `HLD-{feature}.md` / `LLD-{feature}.md` |
| `docs/checklists/` | Scribe | `IMPL-{feature}.md` / `REVIEW-{category}.md` |
| `docs/test-specs/` | Scribe | `TEST-{feature}.md` |
| `docs/adr/` | Atlas | `ADR-{NNN}-{title}.md` |
| `docs/guides/` | Quill | Free-form |
| `docs/api/` | Gateway | `openapi.yaml` |
| `docs/diagrams/` | Canvas | `{type}.mermaid` |

---

## ANTI-PATTERN DETECTION

> Full catalog with detection rules, severity, remediation → `references/anti-patterns.md`

### Quick Reference

| ID | Pattern | Severity | Detection |
|----|---------|----------|-----------|
| AP-001 | God Directory | High | 50+ files in single directory |
| AP-002 | Scattered Tests | High | Tests outside `tests/` without convention |
| AP-003 | Config Soup | Medium | 10+ config files at root |
| AP-004 | Script Chaos | Medium | Scripts scattered at root |
| AP-005 | Doc Desert | High | No `docs/` or empty `docs/` |
| AP-006 | Orphaned Docs | Medium | Flat unstructured docs/ |
| AP-007 | Missing Specs | High | Empty prd/ or design/ |
| AP-008 | Flat Hell | Medium | No subdirectories in `src/` |
| AP-009 | Nested Abyss | Medium | 6+ levels of nesting |
| AP-010 | Duplicate Structures | Low | Multiple dirs for same purpose |

### Monorepo-Specific Anti-Patterns

> Full catalog → `references/anti-patterns.md` (Monorepo section)

| ID | Pattern | Severity | Detection |
|----|---------|----------|-----------|
| AP-011 | Circular Package Deps | Critical | Package A ↔ B cycle in dependency graph |
| AP-012 | Boundary Violation | High | Direct import of another package's internal files |
| AP-013 | Shared Config Drift | Medium | Inconsistent configs across packages |
| AP-014 | Root Pollution | Medium | Business logic/source code at monorepo root |
| AP-015 | Orphan Package | Low | Package with no dependents and not deployable |
| AP-016 | Implicit Dependency | High | Used but undeclared in package manifest |

### Health Score

| Category | Weight | Criteria |
|----------|--------|----------|
| Directory Structure | 25% | Matches language conventions, proper modularization |
| Doc Completeness | 25% | prd/, design/, checklists/ populated |
| Test Organization | 20% | Consistent structure, proper separation |
| Config Hygiene | 15% | Minimal root configs, no duplicates |
| Anti-pattern Score | 15% | Absence of detected anti-patterns |

---

## MONOREPO HEALTH CHECK

> Full health check procedures, commands, proposals → `references/monorepo-health.md`

### When to Run

```
"Audit this monorepo"              → Grove (monorepo health check)
"Check package dependencies"       → Grove (dependency health)
"Are our configs consistent?"      → Grove (config drift check)
"Find unused packages"             → Grove (orphan detection)
"Optimize monorepo build"          → Grove (build efficiency) → Gear (CI/CD)
"Migrate from Lerna to Turborepo"  → Grove (migration proposal)
```

### Health Check Process

```
DETECT monorepo type → INVENTORY packages → SCAN anti-patterns (AP-011~016)
  → CALCULATE score → GENERATE proposals → REPORT
```

### Monorepo Health Score

| Category | Weight | Criteria |
|----------|--------|----------|
| Package Boundaries | 25% | No boundary violations, clear public API |
| Dependency Health | 25% | No cycles, no implicit deps, version consistency |
| Config Consistency | 20% | Shared base config, no drift |
| Build Efficiency | 15% | Cache utilization, affected-only builds |
| Package Hygiene | 15% | No orphan packages, no root pollution |

### Auto-Generated Proposals

Based on detected issues, Grove generates phased improvement proposals:

| Trigger | Proposal | Phase |
|---------|----------|-------|
| AP-013 detected | Shared Config Package | Quick Win |
| AP-012 detected | Dependency Boundary Enforcement | Quick Win |
| AP-011 detected | Circular Dependency Resolution | Structural |
| AP-015 detected | Orphan Package Cleanup | Structural |
| Low build score | Build Optimization (cache, affected-only) | Optimization |
| Tool migration | Lerna → Turborepo, polyrepo → monorepo | Migration |

---

## MIGRATION STRATEGIES

> Full migration levels, decision tree, language-specific notes → `references/migration-strategies.md`

### Migration Levels

| Level | Name | Risk | Effort | When |
|-------|------|------|--------|------|
| 1 | Docs Scaffold | None | 1h | No docs/ structure |
| 2 | Test Reorganization | Medium | 2-4h | Tests scattered |
| 3 | Source Restructure | High | 1-3d | God Directory / Flat Hell |
| 4 | Config Cleanup | Medium | 1-2h | Config Soup |
| 5 | Full Restructure | Very High | 1-2w | Major overhaul |

### Migration Order (Safest First)

```
Level 1 (Docs) → Level 4 (Config) → Level 2 (Tests) → Level 3/5 (Source)
```

### Key Rules

1. **Never break the build** — every intermediate step must work
2. **Use `git mv`** — preserve file history
3. **One module per PR** — small, reviewable changes
4. **Test after every move** — run full test suite
5. **Update imports** — verify all references updated

---

