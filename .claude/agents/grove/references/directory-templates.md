# Directory Templates

Language-specific directory structure templates and conventions.

---

## Universal Base Structure

Every project, regardless of language, should have this base:

```
{project}/
├── src/                    # Source code
├── tests/                  # Test files
├── docs/                   # Documentation (see docs-structure.md)
├── scripts/                # Helper scripts (setup, seed, deploy)
├── tools/                  # Internal CLI/TUI tools
├── config/                 # Configuration files
├── infra/                  # Infrastructure as Code
├── .github/                # CI/CD workflows
├── .agents/                # Agent journals
│   └── PROJECT.md
├── README.md
├── CHANGELOG.md
└── LICENSE
```

---

## TypeScript / JavaScript

### Standard Project

```
src/
├── features/               # Feature modules
│   ├── auth/
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.types.ts
│   │   └── index.ts        # Barrel export
│   └── user/
│       ├── user.service.ts
│       ├── user.repository.ts
│       ├── user.types.ts
│       └── index.ts
├── shared/                 # Shared utilities
│   ├── utils/
│   ├── types/
│   └── constants/
├── config/                 # App configuration
│   ├── database.ts
│   └── env.ts
└── index.ts                # Entry point

tests/
├── unit/
│   └── features/
│       ├── auth/
│       └── user/
├── integration/
│   └── api/
├── e2e/
│   └── flows/
└── fixtures/
    ├── users.json
    └── helpers.ts
```

### Key Conventions

- Barrel exports (`index.ts`) per feature module
- Path aliases in `tsconfig.json`: `@/features/*`, `@/shared/*`
- Co-located types within feature modules
- Test directory mirrors `src/` structure

### React / Next.js Frontend

```
src/
├── app/                    # Next.js App Router (or pages/)
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   └── layout.tsx
├── components/             # UI Components
│   ├── ui/                 # Primitive components (Button, Input)
│   ├── features/           # Feature-specific components
│   └── layouts/            # Layout components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── services/               # API client / external services
├── stores/                 # State management (Zustand, Jotai)
├── styles/                 # Global styles, design tokens
│   ├── tokens.css
│   └── globals.css
└── types/                  # Shared type definitions
```

---

## Python

### Standard Project

```
src/
└── {package_name}/         # Top-level package
    ├── __init__.py
    ├── main.py             # Entry point
    ├── features/
    │   ├── __init__.py
    │   ├── auth/
    │   │   ├── __init__.py
    │   │   ├── service.py
    │   │   ├── models.py
    │   │   └── schemas.py
    │   └── user/
    │       ├── __init__.py
    │       ├── service.py
    │       ├── models.py
    │       └── schemas.py
    ├── shared/
    │   ├── __init__.py
    │   ├── utils.py
    │   ├── exceptions.py
    │   └── constants.py
    └── config/
        ├── __init__.py
        └── settings.py

tests/
├── conftest.py
├── unit/
│   └── features/
│       ├── test_auth.py
│       └── test_user.py
├── integration/
│   └── test_api.py
└── fixtures/
    └── data.py
```

### Key Conventions

- Package name matches `pyproject.toml` `[project.name]`
- `__init__.py` with explicit `__all__` for public API
- `conftest.py` at test root for shared fixtures
- Type hints throughout, validated by mypy/pyright

### FastAPI / Django Variant

```
# FastAPI
src/{package}/
├── api/
│   ├── v1/
│   │   ├── endpoints/
│   │   └── router.py
│   └── deps.py
├── core/
│   ├── config.py
│   └── security.py
├── models/
├── schemas/
└── services/

# Django
src/{project}/
├── {project}/              # Project settings
│   ├── settings/
│   │   ├── base.py
│   │   ├── dev.py
│   │   └── prod.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── auth/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── tests/
│   └── user/
└── manage.py
```

---

## Go

### Standard Project

```
cmd/                        # Entry points
├── server/
│   └── main.go
└── cli/
    └── main.go

internal/                   # Private packages (not importable)
├── auth/
│   ├── handler.go
│   ├── service.go
│   ├── repository.go
│   └── auth_test.go        # Co-located tests
├── user/
│   ├── handler.go
│   ├── service.go
│   └── user_test.go
└── shared/
    ├── middleware/
    ├── config/
    └── errors/

pkg/                        # Public packages (importable)
├── httputil/
└── validation/

tests/                      # Integration / E2E tests
├── integration/
└── e2e/

api/                        # API definitions (OpenAPI, protobuf)
└── openapi.yaml
```

### Key Conventions

- `cmd/` for binaries, `internal/` for private, `pkg/` for public
- Unit tests co-located with source (`*_test.go`)
- Integration tests in separate `tests/` directory
- No `src/` directory (Go convention)
- Flat package structure preferred over deep nesting

---

## Rust

### Standard Project (Binary)

```
src/
├── main.rs                 # Entry point
├── lib.rs                  # Library root (optional)
├── features/
│   ├── mod.rs
│   ├── auth/
│   │   ├── mod.rs
│   │   ├── service.rs
│   │   └── models.rs
│   └── user/
│       ├── mod.rs
│       └── service.rs
├── shared/
│   ├── mod.rs
│   ├── config.rs
│   └── errors.rs
└── tests/                  # Integration tests (cargo convention)
    ├── auth_test.rs
    └── common/
        └── mod.rs

benches/                    # Benchmarks
└── bench_main.rs
```

### Workspace (Multi-crate)

```
Cargo.toml                  # Workspace definition
crates/
├── core/
│   ├── Cargo.toml
│   └── src/
├── api/
│   ├── Cargo.toml
│   └── src/
├── cli/
│   ├── Cargo.toml
│   └── src/
└── shared/
    ├── Cargo.toml
    └── src/
```

### Key Conventions

- Unit tests inline with `#[cfg(test)] mod tests`
- Integration tests in `tests/` directory
- Workspace for multi-crate projects
- `benches/` for criterion benchmarks

---

## Monorepo

### Turborepo / pnpm Workspace

```
apps/                       # Deployable applications
├── web/                    # Frontend app
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── api/                    # Backend app
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
└── admin/                  # Admin panel
    └── ...

packages/                   # Shared packages
├── ui/                     # Shared UI components
│   ├── src/
│   └── package.json
├── config/                 # Shared configurations
│   ├── eslint/
│   ├── typescript/
│   └── package.json
├── types/                  # Shared type definitions
│   └── package.json
└── utils/                  # Shared utilities
    └── package.json

docs/                       # Monorepo-level docs
scripts/                    # Monorepo-level scripts
infra/                      # Shared infrastructure

turbo.json                  # Pipeline configuration
pnpm-workspace.yaml         # Workspace definition
```

### Nx Workspace

```
apps/
├── web/
└── api/

libs/                       # Shared libraries (Nx convention)
├── shared/
│   ├── ui/
│   ├── utils/
│   └── types/
├── feature/
│   ├── auth/
│   └── user/
└── data-access/
    ├── api-client/
    └── database/

nx.json
```

### Lerna (Legacy)

```
packages/                   # All packages (Lerna convention)
├── app/
│   ├── src/
│   └── package.json
├── shared-ui/
│   ├── src/
│   └── package.json
└── utils/
    ├── src/
    └── package.json

lerna.json                  # Lerna configuration
```

> **Note:** Lerna はメンテナンスモードです。新規プロジェクトでは Turborepo または Nx への移行を推奨します。既存 Lerna プロジェクトの移行ガイドは `references/monorepo-health.md` を参照。

### Key Conventions (JS/TS Monorepo)

- `apps/` for deployables, `packages/` (or `libs/`) for shared
- Each package has its own `package.json` and `tsconfig.json`
- Shared configs in `packages/config/`
- Root `docs/` for project-wide documentation
- Per-app docs in `apps/{app}/docs/` if needed

---

## Python Monorepo

### uv Workspace

```
packages/                   # Python packages
├── core/
│   ├── src/
│   │   └── core/
│   │       ├── __init__.py
│   │       └── models.py
│   ├── tests/
│   └── pyproject.toml
├── api/
│   ├── src/
│   │   └── api/
│   │       ├── __init__.py
│   │       └── app.py
│   ├── tests/
│   └── pyproject.toml
└── cli/
    ├── src/
    │   └── cli/
    │       └── __init__.py
    ├── tests/
    └── pyproject.toml

docs/                       # Monorepo-level docs
scripts/                    # Shared scripts
infra/

pyproject.toml              # Workspace root (uv workspace)
uv.lock                    # Unified lock file
```

### Pants / Bazel Build System

```
src/
├── python/
│   ├── core/
│   │   ├── BUILD               # Pants/Bazel build target
│   │   ├── models.py
│   │   └── tests/
│   │       ├── BUILD
│   │       └── test_models.py
│   ├── api/
│   │   ├── BUILD
│   │   ├── app.py
│   │   └── tests/
│   └── cli/
│       ├── BUILD
│       └── main.py
└── resources/
    └── config/

pants.toml                  # Pants configuration
# OR
WORKSPACE                   # Bazel workspace
BUILD.bazel                 # Root build
```

### Key Conventions (Python Monorepo)

- uv workspace: `pyproject.toml` の `[tool.uv.workspace]` でメンバー定義
- Pants/Bazel: `BUILD` ファイルで依存関係を明示的に宣言
- 各パッケージが独立した `pyproject.toml` を持つ
- 共有 lock ファイル（`uv.lock`）でバージョン一貫性を保証
- パッケージ間参照は `workspace:` プロトコルまたは path dependency

---

## Go Monorepo

### Go Multi-Module Workspace

```
services/                   # Individual Go modules
├── api/
│   ├── cmd/
│   │   └── server/
│   │       └── main.go
│   ├── internal/
│   │   ├── handler/
│   │   └── service/
│   ├── go.mod              # Module: example.com/services/api
│   └── go.sum
├── worker/
│   ├── cmd/
│   │   └── worker/
│   │       └── main.go
│   ├── internal/
│   ├── go.mod              # Module: example.com/services/worker
│   └── go.sum
└── gateway/
    ├── cmd/
    ├── internal/
    ├── go.mod
    └── go.sum

pkg/                        # Shared packages (importable)
├── auth/
│   ├── auth.go
│   └── auth_test.go
├── database/
│   └── client.go
├── go.mod                  # Module: example.com/pkg
└── go.sum

tools/                      # Internal tools
scripts/
docs/

go.work                    # Go workspace file (Go 1.18+)
go.work.sum
```

### Key Conventions (Go Monorepo)

- `go.work` でワークスペースメンバーを定義（Go 1.18+）
- 各サービスが独立した `go.mod` を持つ
- `pkg/` は共有ライブラリ（公開インポート可能）
- `internal/` はモジュール外から参照不可（Go コンパイラが強制）
- `services/*/cmd/` が各サービスのエントリポイント
- CI では `go.work` を使わず各モジュール単位でビルド可能にする

---

## Java / Kotlin Monorepo

### Gradle Multi-Module

```
app/                        # Application module
├── src/
│   ├── main/
│   │   ├── java/           # or kotlin/
│   │   │   └── com/example/app/
│   │   └── resources/
│   └── test/
│       └── java/
│           └── com/example/app/
└── build.gradle.kts

core/                       # Core business logic
├── src/
│   ├── main/
│   │   └── java/
│   │       └── com/example/core/
│   └── test/
└── build.gradle.kts

infra/                      # Infrastructure module
├── src/
└── build.gradle.kts

shared/                     # Shared utilities
├── src/
└── build.gradle.kts

buildSrc/                   # Shared build logic
├── src/
│   └── main/
│       └── kotlin/
│           └── conventions.gradle.kts
└── build.gradle.kts

docs/
scripts/

build.gradle.kts            # Root build (plugins, allprojects)
settings.gradle.kts         # Module includes
gradle.properties
```

### Maven Multi-Module

```
app/
├── src/
│   ├── main/java/
│   └── test/java/
└── pom.xml                 # Child POM

core/
├── src/
└── pom.xml

shared/
├── src/
└── pom.xml

docs/
scripts/

pom.xml                     # Parent POM (modules, dependencyManagement)
```

### Key Conventions (Java/Kotlin Monorepo)

- Gradle: `settings.gradle.kts` の `include()` でモジュール定義
- Maven: 親 `pom.xml` の `<modules>` でモジュール定義
- `buildSrc/` (Gradle) でビルドロジックを共有
- Convention plugins でビルド設定の一貫性を保証
- モジュール間依存は `implementation(project(":core"))` で宣言
- BOM (Bill of Materials) で依存バージョンを一元管理

---

## Monorepo Detection Rules

| Indicator | Type | Tool |
|-----------|------|------|
| `turbo.json` + `pnpm-workspace.yaml` | JS/TS | Turborepo |
| `nx.json` | JS/TS | Nx |
| `lerna.json` | JS/TS | Lerna (Legacy) |
| `go.work` | Go | Go Workspace |
| `pyproject.toml` with `[tool.uv.workspace]` | Python | uv |
| `pants.toml` | Python/Multi | Pants |
| `WORKSPACE` or `WORKSPACE.bazel` | Multi | Bazel |
| `settings.gradle.kts` with `include` | JVM | Gradle |
| Parent `pom.xml` with `<modules>` | JVM | Maven |
| `Cargo.toml` with `[workspace]` | Rust | Cargo |

---

## Directory Responsibility Matrix

| Directory | Owner Agent | Purpose | Required |
|-----------|------------|---------|----------|
| `src/` | Builder, Artisan | Source code | Yes |
| `tests/` | Radar, Voyager | Test files | Yes |
| `docs/` | Scribe, Quill, Atlas, Gateway, Canvas | Documentation | Yes |
| `scripts/` | Anvil, Builder | Helper scripts | Recommended |
| `tools/` | Anvil | Internal CLI/TUI | Optional |
| `config/` | Gear | Environment config | Recommended |
| `infra/` | Scaffold | IaC | Optional |
| `.github/` | Gear, Guardian | CI/CD | Recommended |
| `.agents/` | All agents | Journals | Yes |
