# atlas — アーキテクチャ テンプレート集 (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## ADR/RFC TEMPLATES

### ADR Template (Architecture Decision Record)

```markdown
# ADR-XXXX: [Decision Title]

## Status

[Proposed | Accepted | Deprecated | Superseded by ADR-YYYY]

## Context

What is the issue that we're seeing that is motivating this decision or change?

- Current situation: [describe the problem]
- Pain points: [list specific issues]
- Constraints: [technical/business constraints]

## Decision

What is the change that we're proposing and/or doing?

- We will [specific decision]
- This means [implications]

## Alternatives Considered

### Option 1: [Name]
- **Pros**: [advantages]
- **Cons**: [disadvantages]
- **Why rejected**: [reason]

### Option 2: [Name]
- **Pros**: [advantages]
- **Cons**: [disadvantages]
- **Why rejected**: [reason]

## Consequences

What becomes easier or more difficult to do because of this change?

### Positive
- [benefit 1]
- [benefit 2]

### Negative
- [drawback 1]
- [drawback 2]

### Neutral
- [side effect 1]

## Implementation Plan

1. [Step 1]
2. [Step 2]
3. [Step 3]

## References

- [Link to related documentation]
- [Link to discussion]
```

### RFC Template (Request for Comments)

```markdown
# RFC: [Proposal Title]

## Summary

One paragraph explanation of the proposal.

## Motivation

Why are we doing this? What problem does it solve?

- **Pain Point**: [specific problem]
- **Impact**: [who is affected and how]
- **Urgency**: [why now]

## Detailed Design

### Current State

```
[diagram or description of current architecture]
```

### Proposed State

```
[diagram or description of proposed architecture]
```

### Key Changes

1. **[Change 1]**: [description]
2. **[Change 2]**: [description]

## Migration Strategy

### Phase 1: Preparation
- [ ] [task 1]
- [ ] [task 2]

### Phase 2: Implementation
- [ ] [task 1]
- [ ] [task 2]

### Phase 3: Cleanup
- [ ] [task 1]
- [ ] [task 2]

### Rollback Plan

If issues arise, we can rollback by:
1. [step 1]
2. [step 2]

## Trade-offs

| Aspect | Before | After |
|--------|--------|-------|
| Complexity | [level] | [level] |
| Performance | [level] | [level] |
| Maintainability | [level] | [level] |

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [risk 1] | Low/Med/High | Low/Med/High | [mitigation] |

## Open Questions

- [ ] [question 1]
- [ ] [question 2]

## Timeline

- Week 1: [milestone]
- Week 2: [milestone]
- Week 3: [milestone]
```

### Lightweight Decision Record

```markdown
# Decision: [Title]

**Date**: YYYY-MM-DD
**Status**: Accepted
**Deciders**: [names]

## Context
[1-2 sentences about the situation]

## Decision
[1-2 sentences about what we decided]

## Rationale
[1-2 sentences about why]

## Consequences
- [consequence 1]
- [consequence 2]
```

### ADR Status Management

```
docs/
└── architecture/
    └── decisions/
        ├── README.md           # Index of all ADRs
        ├── 0001-use-typescript.md
        ├── 0002-state-management.md
        ├── 0003-api-structure.md
        └── template.md
```

```markdown
<!-- docs/architecture/decisions/README.md -->
# Architecture Decision Records

| ID | Title | Status | Date |
|----|-------|--------|------|
| [ADR-0001](0001-use-typescript.md) | Use TypeScript | Accepted | 2024-01-15 |
| [ADR-0002](0002-state-management.md) | Use Zustand for state | Accepted | 2024-02-01 |
| [ADR-0003](0003-api-structure.md) | REST API structure | Superseded by ADR-0005 | 2024-02-15 |

## Status Definitions

- **Proposed**: Under discussion, not yet decided
- **Accepted**: Decision made and in effect
- **Deprecated**: No longer relevant but kept for history
- **Superseded**: Replaced by a newer ADR
```

---

## DEPENDENCY ANALYSIS COMMANDS

### God Class Detection

```bash
# Find files with more than 500 lines
find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | sort -n | tail -20

# Using cloc for detailed analysis
cloc src --by-file --include-lang=TypeScript,JavaScript | sort -k5 -n | tail -20

# ESLint rule for max lines (add to .eslintrc)
# "max-lines": ["warn", { "max": 500, "skipBlankLines": true, "skipComments": true }]
```

### Circular Dependency Detection

```bash
# Using madge
npx madge --circular src/

# With visual output
npx madge --circular --image circular.svg src/

# Using dependency-cruiser
npx depcruise --validate .dependency-cruiser.js src
```

```javascript
// .dependency-cruiser.js
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Circular dependencies are not allowed',
      from: {},
      to: {
        circular: true
      }
    },
    {
      name: 'no-orphans',
      severity: 'warn',
      comment: 'Modules should be imported somewhere',
      from: {
        orphan: true,
        pathNot: [
          '(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|json)$',
          '\\.d\\.ts$',
          '(^|/)tsconfig\\.json$',
          '(^|/)index\\.(js|ts)$'
        ]
      },
      to: {}
    }
  ],
  options: {
    doNotFollow: {
      path: 'node_modules'
    },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default']
    }
  }
};
```

### Coupling Metrics

```bash
# Generate dependency graph
npx madge --image dependency-graph.svg src/

# Count imports per file
grep -r "^import" src --include="*.ts" --include="*.tsx" | \
  cut -d: -f1 | sort | uniq -c | sort -rn | head -20

# Find most imported modules (high afferent coupling)
grep -rh "from ['\"]" src --include="*.ts" --include="*.tsx" | \
  sed "s/.*from ['\"]\\([^'\"]*\\)['\"].*/\\1/" | \
  sort | uniq -c | sort -rn | head -20
```

### Unused Export Detection

```bash
# Using ts-prune
npx ts-prune

# Using knip (more comprehensive)
npx knip

# knip.json configuration
{
  "entry": ["src/index.ts", "src/pages/**/*.tsx"],
  "project": ["src/**/*.ts", "src/**/*.tsx"],
  "ignore": ["**/*.d.ts", "**/*.test.ts"]
}
```

### Import Graph Analysis

```bash
# Visualize imports for a specific file
npx madge --image file-deps.svg src/components/UserProfile.tsx

# Find all files importing a module
grep -rl "from.*UserService" src --include="*.ts" --include="*.tsx"

# Dependency depth analysis
npx madge --max-depth 3 src/
```

### Layer Violation Detection

```javascript
// .dependency-cruiser.js - Layer rules
module.exports = {
  forbidden: [
    // UI should not import from infrastructure
    {
      name: 'no-ui-to-infra',
      severity: 'error',
      from: { path: '^src/components' },
      to: { path: '^src/infrastructure' }
    },
    // Domain should not import from UI
    {
      name: 'no-domain-to-ui',
      severity: 'error',
      from: { path: '^src/domain' },
      to: { path: '^src/(components|pages|views)' }
    },
    // Domain should not import from infrastructure
    {
      name: 'no-domain-to-infra',
      severity: 'error',
      from: { path: '^src/domain' },
      to: { path: '^src/infrastructure' }
    }
  ]
};
```

---

## ARCHITECTURE PATTERNS

### Clean Architecture

```
src/
├── domain/                 # Enterprise Business Rules (innermost)
│   ├── entities/          # Business objects
│   │   └── User.ts
│   ├── value-objects/     # Immutable value types
│   │   └── Email.ts
│   └── repositories/      # Repository interfaces (ports)
│       └── IUserRepository.ts
│
├── application/           # Application Business Rules
│   ├── use-cases/        # Application-specific business rules
│   │   ├── CreateUser.ts
│   │   └── GetUserById.ts
│   ├── services/         # Application services
│   │   └── AuthService.ts
│   └── dto/              # Data transfer objects
│       └── UserDTO.ts
│
├── infrastructure/        # Interface Adapters (outermost)
│   ├── repositories/     # Repository implementations
│   │   └── PrismaUserRepository.ts
│   ├── api/              # External API clients
│   │   └── StripeClient.ts
│   └── persistence/      # Database configuration
│       └── prisma.ts
│
└── presentation/          # Frameworks & Drivers
    ├── components/       # UI components
    ├── pages/            # Page components
    └── hooks/            # React hooks (adapters)
```

**Dependency Rule**: Dependencies point inward. Domain knows nothing about outer layers.

```typescript
// domain/repositories/IUserRepository.ts (Interface - Port)
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

// infrastructure/repositories/PrismaUserRepository.ts (Implementation - Adapter)
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ where: { id } });
    return data ? User.fromPersistence(data) : null;
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      create: user.toPersistence(),
      update: user.toPersistence(),
    });
  }
}

// application/use-cases/CreateUser.ts
export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    const user = User.create(input);
    await this.userRepository.save(user);
    return user;
  }
}
```

### Hexagonal Architecture (Ports & Adapters)

```
src/
├── core/                  # Hexagon (business logic)
│   ├── domain/
│   │   └── Order.ts
│   ├── ports/
│   │   ├── in/           # Driving ports (use cases)
│   │   │   └── CreateOrderPort.ts
│   │   └── out/          # Driven ports (repositories, external services)
│   │       ├── OrderRepositoryPort.ts
│   │       └── PaymentGatewayPort.ts
│   └── services/
│       └── OrderService.ts
│
├── adapters/
│   ├── in/               # Driving adapters
│   │   ├── web/         # REST controllers
│   │   │   └── OrderController.ts
│   │   └── cli/         # CLI commands
│   │       └── CreateOrderCommand.ts
│   └── out/              # Driven adapters
│       ├── persistence/
│       │   └── PrismaOrderRepository.ts
│       └── payment/
│           └── StripePaymentGateway.ts
│
└── config/               # Dependency injection, configuration
    └── container.ts
```

### Feature-Based Structure

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── api/
│   │   │   └── authApi.ts
│   │   ├── store/
│   │   │   └── authSlice.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   └── index.ts      # Public API
│   │
│   ├── orders/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── store/
│   │   └── index.ts
│   │
│   └── products/
│       └── ...
│
├── shared/               # Shared across features
│   ├── components/      # Generic UI components
│   ├── hooks/           # Generic hooks
│   ├── utils/           # Utility functions
│   └── types/           # Shared types
│
└── app/                  # Application shell
    ├── routes/
    ├── layout/
    └── providers/
```

### Modular Monolith

```
src/
├── modules/
│   ├── users/
│   │   ├── internal/        # Private implementation
│   │   │   ├── domain/
│   │   │   ├── infrastructure/
│   │   │   └── application/
│   │   ├── api/             # Public API (what other modules can use)
│   │   │   ├── UserService.ts
│   │   │   └── types.ts
│   │   └── index.ts         # Re-exports public API only
│   │
│   ├── orders/
│   │   ├── internal/
│   │   ├── api/
│   │   └── index.ts
│   │
│   └── payments/
│       └── ...
│
├── shared/                  # Cross-cutting concerns
│   ├── kernel/             # Shared domain concepts
│   ├── infrastructure/     # Shared infrastructure
│   └── utils/
│
└── main.ts                 # Composition root
```

**Module Communication Rules**:
```typescript
// ✅ Allowed: Import from module's public API
import { UserService } from '@/modules/users';

// ❌ Forbidden: Import from module's internal
import { UserRepository } from '@/modules/users/internal/infrastructure';
```

### Gradual Migration Strategy

```markdown
## Migration: MVC → Feature-Based

### Phase 1: Create feature folders (Week 1-2)
- [ ] Create `features/` directory
- [ ] Move auth-related code to `features/auth/`
- [ ] Keep old imports working via re-exports

### Phase 2: Migrate one feature at a time (Week 3-6)
- [ ] Migrate `orders` feature
- [ ] Migrate `products` feature
- [ ] Migrate `users` feature

### Phase 3: Clean up shared code (Week 7-8)
- [ ] Move truly shared code to `shared/`
- [ ] Remove empty old directories
- [ ] Update import aliases

### Compatibility Layer
// src/components/LoginForm.tsx (old location)
export { LoginForm } from '@/features/auth/components/LoginForm';
// Deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  console.warn('Import from @/features/auth instead of @/components');
}
```

---

## TECHNICAL DEBT EVALUATION FRAMEWORK

### Debt Categories

| Category | Examples | Typical Impact |
|----------|----------|----------------|
| **Design Debt** | God classes, tight coupling, missing abstractions | High - affects changeability |
| **Code Debt** | Duplicated code, complex functions, poor naming | Medium - affects readability |
| **Test Debt** | Missing tests, flaky tests, low coverage | High - affects reliability |
| **Documentation Debt** | Missing docs, outdated docs, unclear APIs | Medium - affects onboarding |
| **Infrastructure Debt** | Outdated dependencies, manual deployments | Medium - affects operations |

### Priority Scoring Matrix

```markdown
## Technical Debt Item: [Name]

### Impact Score (1-5)
- Code touchpoints: [how many files/functions affected]
- Developer friction: [how often developers encounter this]
- Bug correlation: [how many bugs related to this area]
- **Impact Score**: [1-5]

### Fix Cost Score (1-5)
- Estimated effort: [hours/days]
- Risk of regression: [low/medium/high]
- Dependencies: [what else needs to change]
- **Cost Score**: [1-5]

### Priority = Impact × (6 - Cost)

| Debt Item | Impact | Cost | Priority |
|-----------|--------|------|----------|
| God class UserService | 5 | 3 | 15 |
| Missing API validation | 4 | 2 | 16 |
| Duplicated auth logic | 3 | 2 | 12 |
| Outdated React version | 4 | 4 | 8 |
```

### Debt Inventory Template

```markdown
# Technical Debt Inventory

## Summary
- Total items: [count]
- High priority: [count]
- Estimated total effort: [days/weeks]

## High Priority (Address this quarter)

### TD-001: UserService God Class
- **Category**: Design Debt
- **Location**: `src/services/UserService.ts` (2,500 lines)
- **Impact**: 5 - Core service, touched by 80% of features
- **Cost**: 3 - Moderate effort, well-tested
- **Priority**: 15
- **Proposed Fix**: Split into UserAuthService, UserProfileService, UserPreferencesService
- **Dependencies**: None
- **Owner**: [assignee]

### TD-002: Missing Input Validation
- **Category**: Code Debt
- ...

## Medium Priority (Address this half)

### TD-003: ...

## Low Priority (Backlog)

### TD-004: ...
```

### Repayment Plan Template

```markdown
# Technical Debt Repayment Plan: Q1 2025

## Budget
- Allocated time: 20% of sprint capacity
- Estimated capacity: 40 story points

## Goals
1. Reduce high-priority debt items by 50%
2. Improve test coverage from 60% to 75%
3. Eliminate all circular dependencies

## Sprint Allocation

### Sprint 1
- [ ] TD-001: UserService split (Phase 1) - 8 points
- [ ] TD-005: Add missing API tests - 5 points

### Sprint 2
- [ ] TD-001: UserService split (Phase 2) - 8 points
- [ ] TD-002: Input validation - 5 points

### Sprint 3
- [ ] TD-001: UserService split (Phase 3) - 5 points
- [ ] TD-003: Fix circular deps - 8 points

## Success Metrics
- [ ] No God classes > 500 lines
- [ ] Zero circular dependencies
- [ ] All API endpoints validated
- [ ] Test coverage > 75%
```

### ROI Calculation Guide

```markdown
## ROI Analysis: [Debt Item]

### Current Cost (per month)
- Bug fixes in this area: [hours] × [hourly rate] = $[amount]
- Extra development time: [hours] × [hourly rate] = $[amount]
- Onboarding overhead: [hours] × [hourly rate] = $[amount]
- **Total monthly cost**: $[amount]

### Fix Cost (one-time)
- Development effort: [hours] × [hourly rate] = $[amount]
- Testing effort: [hours] × [hourly rate] = $[amount]
- Review/deployment: [hours] × [hourly rate] = $[amount]
- **Total fix cost**: $[amount]

### ROI Calculation
- Break-even point: [fix cost] / [monthly savings] = [months]
- 12-month ROI: ([monthly savings × 12] - [fix cost]) / [fix cost] × 100 = [%]

### Recommendation
[Fix / Defer / Accept]
- Rationale: [explanation]
```

---

## ARCHITECTURE HEALTH METRICS

Quantitative indicators for measuring architectural quality.

### Coupling Metrics

| Metric | Formula | Target | Tool |
|--------|---------|--------|------|
| **Afferent Coupling (Ca)** | Incoming dependencies | < 20 per module | madge |
| **Efferent Coupling (Ce)** | Outgoing dependencies | < 10 per module | madge |
| **Instability (I)** | Ce / (Ca + Ce) | 0.0-0.3 (stable) or 0.7-1.0 (flexible) | calculated |
| **Abstractness (A)** | Abstract types / Total types | Varies by layer | manual |
| **Distance from Main (D)** | \|A + I - 1\| | < 0.3 | calculated |

### Complexity Metrics

| Metric | Target | Detection |
|--------|--------|-----------|
| **Lines per File** | < 500 | `find src -name "*.ts" \| xargs wc -l \| sort -n` |
| **Functions per File** | < 20 | ESLint max-lines-per-function |
| **Cyclomatic Complexity** | < 10 per function | ESLint complexity rule |
| **Dependency Depth** | < 5 levels | `npx madge --max-depth 5` |
| **Circular Dependencies** | 0 | `npx madge --circular` |

### Health Score Card

```markdown
### Architecture Health Report: [Project Name]

**Report Date**: YYYY-MM-DD
**Scope**: [modules analyzed]

#### Coupling Health
| Module | Ca | Ce | I | Status |
|--------|----|----|---|--------|
| auth | 15 | 5 | 0.25 | ✅ Stable |
| orders | 8 | 12 | 0.60 | ⚠️ Zone of Pain |
| shared | 45 | 2 | 0.04 | ✅ Stable (but high Ca) |

#### Complexity Health
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Files > 500 lines | 3 | 0 | ❌ |
| Circular dependencies | 2 | 0 | ❌ |
| Avg complexity | 8.2 | < 10 | ✅ |
| Max dependency depth | 4 | < 5 | ✅ |

#### Layer Violations
| Violation | Count | Examples |
|-----------|-------|----------|
| UI → Infrastructure | 2 | OrderPage → PrismaClient |
| Domain → UI | 0 | - |

#### Technical Debt Score
- **Design Debt**: 3 items (High: 1, Medium: 2)
- **Code Debt**: 5 items (High: 0, Medium: 3, Low: 2)
- **Test Debt**: 2 items (Coverage: 72%)

**Overall Health**: ⚠️ Needs Attention
**Priority Actions**:
1. Split UserService.ts (2,500 lines)
2. Fix circular dependency: orders ↔ inventory
3. Add integration tests for payment flow
```

### Automated Health Check

```bash
#!/bin/bash
# architecture-health.sh

echo "=== Architecture Health Check ==="

echo "\n📊 File Size Analysis:"
find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | sort -n | tail -10

echo "\n🔄 Circular Dependencies:"
npx madge --circular src/

echo "\n📈 Most Imported Modules (High Ca):"
grep -rh "from ['\"]@/" src --include="*.ts" | \
  sed "s/.*from ['\"]\\([^'\"]*\\)['\"].*/\\1/" | \
  sort | uniq -c | sort -rn | head -10

echo "\n📉 Most Importing Files (High Ce):"
grep -r "^import" src --include="*.ts" | \
  cut -d: -f1 | sort | uniq -c | sort -rn | head -10

echo "\n🚫 Layer Violations:"
npx depcruise --validate .dependency-cruiser.js src 2>/dev/null || echo "Configure .dependency-cruiser.js"
```

### CI Integration

```yaml
# .github/workflows/architecture.yml
name: Architecture Health
on: [pull_request]

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4

      - name: Check circular dependencies
        run: |
          npx madge --circular src/
          if [ $? -ne 0 ]; then
            echo "::error::Circular dependencies detected"
            exit 1
          fi

      - name: Check file sizes
        run: |
          LARGE_FILES=$(find src -name "*.ts" -exec wc -l {} + | awk '$1 > 500 {print}' | grep -v total)
          if [ -n "$LARGE_FILES" ]; then
            echo "::warning::Files exceeding 500 lines:"
            echo "$LARGE_FILES"
          fi

      - name: Layer validation
        run: npx depcruise --validate .dependency-cruiser.js src
```

---

## CANVAS INTEGRATION

Request visualizations from Canvas agent for architecture documentation.

### System Context Diagram

```markdown
## CANVAS_REQUEST

### Diagram Type: System Context (C4 Level 1)
### Purpose: Show system boundaries and external actors

### System
- Name: [System Name]
- Description: [What it does]

### External Actors
- Users: [Web App Users, Mobile App Users]
- External Systems: [Payment Gateway, Email Service, Analytics]

### Relationships
- User → System: Uses via web browser
- System → Payment Gateway: Processes payments
- System → Email Service: Sends notifications
```

### Component Diagram

```markdown
