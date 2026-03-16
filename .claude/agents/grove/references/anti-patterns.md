# Repository Structure Anti-Patterns

Detection rules, severity levels, and remediation strategies.

---

## Anti-Pattern Catalog

### AP-001: God Directory

**Severity:** High
**Detection:** A single directory contains 50+ files at one level.

```
# BAD: Everything dumped in src/
src/
├── auth.ts
├── authController.ts
├── authService.ts
├── user.ts
├── userController.ts
├── userService.ts
├── payment.ts
├── ... (50+ more files)
```

**Impact:**
- Difficult to navigate and find files
- No logical grouping of related code
- Merge conflicts increase with team size

**Fix:**
```
# GOOD: Feature-based modules
src/
├── features/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── index.ts
│   ├── user/
│   └── payment/
└── shared/
```

**Audit command:**
```bash
# Count files per directory (flag directories with 50+ files)
find src -maxdepth 1 -type f | wc -l
```

---

### AP-002: Scattered Tests

**Severity:** High
**Detection:** Test files located outside `tests/` directory without co-location convention.

```
# BAD: Tests scattered across project
src/auth/auth.test.ts
src/user/__tests__/user.test.ts
tests/payment.test.ts
test/integration.test.ts
spec/e2e.test.ts
```

**Impact:**
- Inconsistent test discovery
- CI configuration complexity
- Hard to measure coverage by module

**Fix (Option A: Centralized):**
```
tests/
├── unit/
│   ├── auth/
│   └── user/
├── integration/
└── e2e/
```

**Fix (Option B: Co-located — Go/Rust convention):**
```
src/auth/
├── auth.service.ts
├── auth.service.test.ts    # Co-located
```

**Rule:** Choose ONE pattern and apply consistently. Do not mix.

---

### AP-003: Config Soup

**Severity:** Medium
**Detection:** 10+ configuration files at project root.

```
# BAD: Root cluttered with configs
/
├── .eslintrc.js
├── .eslintrc.json           # Duplicate!
├── .prettierrc
├── .prettierrc.js           # Duplicate!
├── tsconfig.json
├── tsconfig.build.json
├── tsconfig.test.json
├── jest.config.ts
├── vitest.config.ts         # Conflict with jest!
├── .babelrc
├── webpack.config.js
├── postcss.config.js
├── tailwind.config.js
├── next.config.js
├── ... (15+ more)
```

**Impact:**
- Visual noise in project root
- Duplicate/conflicting configurations
- Hard to understand which configs are active

**Fix:**
```
# GOOD: Consolidate where possible
/
├── config/                  # Non-standard configs
│   ├── webpack.config.js
│   └── postcss.config.js
├── eslint.config.js         # Flat config (one file)
├── tsconfig.json            # Must be at root
├── vitest.config.ts         # Choose ONE test framework
└── tailwind.config.js       # Framework requires root
```

**Strategies:**
1. Use flat configs (ESLint flat config, single tsconfig with `extends`)
2. Move non-root-required configs to `config/`
3. Eliminate duplicates (pick one format per tool)
4. Remove unused configs from abandoned tools

---

### AP-004: Script Chaos

**Severity:** Medium
**Detection:** Shell/helper scripts scattered at project root or in random locations.

```
# BAD: Scripts everywhere
/
├── setup.sh
├── deploy.sh
├── seed-db.sh
├── run-tests.sh
├── fix-permissions.sh
├── migrate.sh
├── utils/
│   └── backup.sh
├── helpers/
│   └── generate-cert.sh
```

**Impact:**
- No discoverability for available scripts
- Unclear which scripts are safe to run
- No categorization by purpose

**Fix:**
```
scripts/
├── setup.sh            # Environment setup
├── seed.sh             # Database seeding
├── deploy.sh           # Deployment
├── migrate.sh          # Database migration
└── README.md           # Script documentation
```

---

### AP-005: Doc Desert

**Severity:** High
**Detection:** No `docs/` directory, or `docs/` exists but is empty/contains only README.

```
# BAD: No documentation structure
/
├── src/
├── README.md           # Only documentation
└── (no docs/)
```

**Impact:**
- No requirements traceability
- No design decisions recorded
- Onboarding difficulty
- Knowledge locked in individuals

**Fix:**
```
docs/
├── prd/                # Requirements
├── specs/              # Specifications
├── design/             # Design documents
├── checklists/         # Implementation/review checklists
├── test-specs/         # Test specifications
├── adr/                # Architecture decisions
├── guides/             # Developer guides
└── api/                # API documentation
```

---

### AP-006: Orphaned Docs

**Severity:** Medium
**Detection:** `docs/` contains unstructured, flat files without subdirectories.

```
# BAD: Flat docs dump
docs/
├── api-design.md
├── auth-requirements.md
├── database-schema.md
├── deployment-notes.md
├── meeting-notes-2024-01.md    # Not technical documentation
├── old-design.md               # Stale document
├── README.md
├── setup-guide.md
├── todo.md                     # Not documentation
└── v2-migration-plan.md
```

**Impact:**
- No categorization, hard to find documents
- Stale documents mixed with current
- Non-documentation files pollute the directory

**Fix:**
1. Categorize into subdirectories (prd/, design/, guides/, etc.)
2. Remove non-documentation files (meeting notes, todos)
3. Archive stale documents or delete
4. Apply naming conventions (PRD-, HLD-, etc.)

---

### AP-007: Missing Specs

**Severity:** High
**Detection:** `docs/prd/` or `docs/design/` is empty or absent in a project with active development.

```
# BAD: Code without specifications
docs/
├── guides/
│   └── getting-started.md
└── api/
    └── openapi.yaml
# No prd/, no design/, no checklists/
```

**Impact:**
- No formal requirements → scope creep
- No design documents → inconsistent architecture
- No checklists → quality gaps

**Fix:**
- Create PRD for each feature before implementation
- Create HLD for system-level changes
- Create LLD for complex features
- Use implementation checklists for tracking

---

### AP-008: Flat Hell

**Severity:** Medium
**Detection:** All source files at single level, no subdirectories in `src/`.

```
# BAD: Everything flat
src/
├── app.ts
├── authController.ts
├── authMiddleware.ts
├── authService.ts
├── database.ts
├── logger.ts
├── paymentController.ts
├── paymentService.ts
├── userController.ts
├── userModel.ts
├── userService.ts
└── utils.ts
```

**Impact:**
- No module boundaries
- Circular dependency risk
- Cannot scale beyond ~20 files

**Fix:** Group by feature or layer (feature-based grouping preferred for most projects).

---

### AP-009: Nested Abyss

**Severity:** Medium
**Detection:** Directory nesting deeper than 6 levels from project root.

```
# BAD: Too deep
src/modules/core/services/auth/providers/oauth/google/handlers/callback/
└── handler.ts   # 10 levels deep
```

**Impact:**
- Long import paths
- Cognitive overhead navigating
- Often indicates over-engineering

**Fix:**
- Maximum 4-5 levels from project root
- Flatten unnecessarily deep structures
- Use path aliases to simplify imports

---

### AP-010: Duplicate Structures

**Severity:** Low
**Detection:** Multiple directories serving the same purpose.

```
# BAD: Duplicated purpose
/
├── lib/            # Shared code?
├── shared/         # Shared code?
├── utils/          # Shared code?
├── helpers/        # Shared code?
├── common/         # Shared code?
├── tests/          # Tests?
├── test/           # Tests?
├── __tests__/      # Tests?
└── spec/           # Tests?
```

**Fix:** Pick ONE name per purpose and consolidate.

---

## Monorepo-Specific Anti-Patterns

### AP-011: Circular Package Dependencies

**Severity:** Critical
**Detection:** Package A depends on Package B, and Package B depends on Package A (directly or transitively).

```
# BAD: Circular dependency between packages
packages/
├── auth/
│   └── package.json        # depends on "user"
└── user/
    └── package.json        # depends on "auth"
```

**Impact:**
- Build order becomes indeterminate (build errors, non-deterministic behavior)
- Package boundaries collapse, defeating the purpose of a monorepo
- Test independence is compromised

**Fix:**
```
# GOOD: Break cycle with shared package
packages/
├── auth/                   # depends on "shared"
├── user/                   # depends on "shared"
└── shared/                 # common types/interfaces
    └── src/
        └── types.ts        # AuthUser, UserAuth interfaces
```

**Audit command:**
```bash
# Turborepo
npx turbo run build --dry-run --graph  # Output dependency graph in DOT format
# Nx
npx nx graph                            # Visualize dependencies in browser
# Go
go mod graph | grep -E 'cycle'
# Gradle
./gradlew dependencies --configuration compileClasspath
```

---

### AP-012: Package Boundary Violation

**Severity:** High
**Detection:** A package directly references another package's internal files (bypasses public API).

```
# BAD: Direct import of internal file
// apps/web/src/page.tsx
import { validateEmail } from '../../packages/auth/src/internal/validators';
//                                                    ^^^^^^^^ internal path

// BAD: Bypassing internal/ in Go
// services/api/handler.go
import "example.com/services/worker/internal/queue"  // Compiler will reject this
```

**Impact:**
- Internal refactoring of a package affects external consumers
- Implicit coupling increases, making independent deployment difficult
- Versioning becomes meaningless

**Fix:**
```
# GOOD: Access through public API
// packages/auth/index.ts (barrel export)
export { validateEmail } from './src/validators';  // Explicitly public API

// apps/web/src/page.tsx
import { validateEmail } from '@monorepo/auth';     // Reference by package name
```

**Enforcement:**
```json
// Nx: module boundary rules
// .eslintrc.json
{
  "rules": {
    "@nx/enforce-module-boundaries": ["error", {
      "depConstraints": [
        { "sourceTag": "scope:app", "onlyDependOnLibsWithTags": ["scope:shared"] }
      ]
    }]
  }
}
```

---

### AP-013: Shared Config Drift

**Severity:** Medium
**Detection:** Config files are inconsistent across packages within the same monorepo.

```
# BAD: Inconsistent config per package
packages/
├── auth/
│   ├── tsconfig.json       # target: ES2020, strict: true
│   └── .eslintrc.js        # extends: recommended
├── user/
│   ├── tsconfig.json       # target: ES2022, strict: false  ← Mismatch!
│   └── .eslintrc.json      # extends: standard             ← Mismatch!
└── shared/
    ├── tsconfig.json       # target: ESNext                 ← Yet another!
    └── (no eslint config)                                   ← Missing!
```

**Impact:**
- Different compile targets across packages lead to compatibility issues
- Inconsistent lint rules result in uneven code quality
- Unclear which config is "correct" when creating new packages

**Fix:**
```
# GOOD: Shared base config + package-specific overrides
packages/
├── config/                 # Shared config package
│   ├── tsconfig.base.json
│   ├── eslint.base.js
│   └── package.json
├── auth/
│   └── tsconfig.json       # { "extends": "@monorepo/config/tsconfig.base.json" }
└── user/
    └── tsconfig.json       # { "extends": "@monorepo/config/tsconfig.base.json" }
```

**Audit command:**
```bash
# Compare tsconfig targets across packages
find . -name "tsconfig.json" -not -path "*/node_modules/*" \
  -exec grep -l "target" {} \; | xargs grep "target"
```

---

### AP-014: Root Pollution

**Severity:** Medium
**Detection:** Excessive logic, source code, or scripts placed at the monorepo root.

```
# BAD: Business logic at root
/
├── apps/
├── packages/
├── src/                    # ← src/ at root is unnecessary
│   └── shared-utils.ts
├── scripts/
│   ├── deploy-auth.sh
│   ├── deploy-user.sh
│   ├── seed-all.sh
│   ├── migrate-auth.sh
│   ├── migrate-user.sh    # ← Package-specific scripts at root
│   └── ... (20+ scripts)
├── utils.ts                # ← Utility at root
└── helpers.js              # ← Helper at root
```

**Impact:**
- Root becomes a dumping ground between packages
- Package independence is compromised
- Build scope optimization becomes difficult

**Fix:**
```
# GOOD: Root handles orchestration only
/
├── apps/
├── packages/
├── scripts/                # Monorepo-wide scripts only
│   ├── setup.sh
│   └── ci-check-all.sh
├── turbo.json
└── package.json            # Workspace definition only
```

---

### AP-015: Orphan Package

**Severity:** Low
**Detection:** A package that is not depended on by any other package and is not a deployment target.

```
# BAD: Packages nobody uses
packages/
├── auth/                   # used by: apps/web, apps/api
├── user/                   # used by: apps/web, apps/api
├── legacy-utils/           # used by: (nobody) ← Orphan!
└── experiment-v2/          # used by: (nobody) ← Orphan!
```

**Impact:**
- Increased CI/CD build time
- Dependency update cost (unmaintained vulnerabilities)
- Confusion for new team members

**Fix:**
1. Check dependency graph and identify unused packages
2. Delete or archive if truly unnecessary
3. If experimental, make status explicit (`[EXPERIMENTAL]` tag in `README.md`)

**Audit command:**
```bash
# Turborepo: Check for isolated nodes in dependency graph
npx turbo run build --dry-run --graph 2>&1 | grep -v " -> "
# Nx
npx nx graph --affected  # Check packages outside affected scope
```

---

### AP-016: Implicit Dependency

**Severity:** High
**Detection:** Dependencies used but not declared in package manifest (package.json, go.mod, etc.).

```
# BAD: Used without declaration in package.json
// packages/auth/src/service.ts
import { hash } from 'bcrypt';  // bcrypt not declared in auth/package.json
                                 // Accidentally resolved from root node_modules

// BAD: Excessive use of replace directives in Go
// go.mod
replace example.com/pkg => ../pkg  // Should be managed via workspace
```

**Impact:**
- Build/test fails when package is built in isolation
- Fragile dependency resolution relying on hoisting
- Independent publishing of package is impossible

**Fix:**
```bash
# Explicitly declare dependencies in each package
cd packages/auth && pnpm add bcrypt

# Detect via strict mode
# .npmrc
strict-peer-dependencies=true
# pnpm: .npmrc
shamefully-hoist=false           # Disable hoisting to detect issues
```

**Enforcement:**
```bash
# syncpack: Check dependency version consistency across packages
npx syncpack list-mismatches
# depcheck: Detect undeclared dependencies
npx depcheck packages/auth
```

---

## Severity Guide

| Severity | Description | Action |
|----------|-------------|--------|
| **High** | Actively impedes development | Fix immediately |
| **Medium** | Causes friction, scales poorly | Fix in next refactor |
| **Low** | Cosmetic / minor inconsistency | Fix when convenient |

---

## Audit Report Format

```markdown
## Repository Structure Audit

**Repository:** {name}
**Date:** YYYY-MM-DD
**Overall Health:** {score}/100

### Anti-Patterns Detected

| ID | Pattern | Severity | Location | Status |
|----|---------|----------|----------|--------|
| AP-001 | God Directory | High | src/ (67 files) | 🔴 |
| AP-005 | Doc Desert | High | docs/ missing | 🔴 |
| AP-003 | Config Soup | Medium | root (14 configs) | 🟡 |

### Structure Score Breakdown

| Category | Score | Max | Notes |
|----------|-------|-----|-------|
| Directory Structure | 15 | 25 | God Directory detected |
| Doc Completeness | 0 | 25 | No docs/ directory |
| Test Organization | 18 | 20 | Consistent structure |
| Config Hygiene | 8 | 15 | Too many root configs |
| Anti-pattern Score | 5 | 15 | 2 high severity issues |
| **Total** | **46** | **100** | |

### Recommendations (Priority Order)

1. **[High]** Create docs/ directory with standard structure
2. **[High]** Split src/ into feature modules
3. **[Medium]** Consolidate config files
```
