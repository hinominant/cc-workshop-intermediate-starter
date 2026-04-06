# Test Strategy Selection

Framework selection, test pyramid ratios, naming conventions, and coverage targets for every project type.

---

## Test Pyramid Ratios

```
Target allocation for a healthy test suite:

        /   E2E   \          10% — Critical user journeys only
       /  (10%)    \
      /-----------  \
     / Integration   \       20% — Service boundaries, DB, API
    /    (20%)        \
   /-------------------\
  /       Unit          \    60% — Pure functions, logic, utils
 /       (60%)           \
/-------------------------\
        Other              10% — Visual regression, accessibility, performance
```

| Level | Share | Speed | Confidence | Maintenance Cost |
|-------|-------|-------|------------|-----------------|
| Unit | 60% | <50ms each | Single function | Low |
| Integration | 20% | <2s each | Service boundary | Medium |
| E2E | 10% | <30s each | Full user journey | High |
| Other | 10% | Varies | Specialized concerns | Medium |

---

## Decision Matrix: When to Use Each Test Type

| Situation | Test Type | Reason |
|-----------|-----------|--------|
| Pure function (math, string, validation) | Unit | Deterministic, fast, high value |
| React component with user interaction | Component (Unit) | Testing Library + user-event |
| React hook with state logic | Unit (renderHook) | Isolated behavior verification |
| API endpoint handler | Integration | Real HTTP + DB round-trip |
| Database query / repository | Integration | Needs real DB to verify SQL |
| Middleware chain | Integration | Order-dependent behavior |
| Login -> Dashboard -> Action flow | E2E | Cross-service user journey |
| Checkout / payment flow | E2E | Business-critical, multi-step |
| Color contrast, focus order | Accessibility (Other) | axe-core integration |
| Layout shift, visual breakage | Visual regression (Other) | Screenshot comparison |
| Response time under load | Performance (Other) | Benchmark assertions |

### Quick Decision Flowchart

```
Is it a pure function with no side effects?
  YES -> Unit test
  NO  -> Does it cross a service/DB boundary?
           YES -> Integration test
           NO  -> Is it a critical multi-step user journey?
                    YES -> E2E test
                    NO  -> Component test (Unit level)
```

---

## Framework Selection Guide

### Vitest (DEFAULT)

Use for: Unit tests, integration tests in Node.js / React / Vue projects.

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // For React components
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: { lines: 80, branches: 80 },
    },
  },
});
```

**When to choose Vitest:**
- New projects (always)
- Existing projects with Vite build
- Projects migrating from Jest (API-compatible)
- Any Node.js or frontend project without legacy constraints

### Playwright (E2E)

Use for: End-to-end testing of web applications.

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  retries: 2,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
});
```

**When to choose Playwright:**
- Cross-browser E2E testing
- Visual regression testing
- Accessibility auditing (with axe-core)
- User journey verification spanning multiple pages

### Jest (LEGACY)

Use for: Existing projects already on Jest where migration cost is not justified.

**When to choose Jest:**
- Project already has 100+ Jest tests
- Team has no bandwidth for migration
- CRA (Create React App) projects not yet ejected

**Migration path:** Jest -> Vitest is low-friction (compatible API). Prioritize migration when touching test infrastructure.

### Supertest (API ENDPOINTS)

Use for: HTTP endpoint testing without starting a full server.

```ts
import request from 'supertest';
import { app } from '../src/app';

describe('POST /api/users', () => {
  it('should create a user and return 201', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Test User', email: 'test@example.com' })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test User');
  });
});
```

**When to choose Supertest:**
- Express / Koa / Fastify API testing
- Combine with Vitest/Jest as the test runner
- Testing middleware behavior end-to-end within the server

---

## Test Naming Conventions

### Structure: `describe` / `it` with Business Language

```ts
// Pattern: describe("[Unit]") > describe("[Method/Scenario]") > it("should [behavior] when [condition]")

describe('PriceCalculator', () => {
  describe('calculateTotal', () => {
    it('should return 0 when cart is empty', () => { /* ... */ });
    it('should apply 10% discount when total exceeds 10000 yen', () => { /* ... */ });
    it('should throw InvalidCurrencyError when currency is unsupported', () => { /* ... */ });
  });
});
```

### Naming Rules

| Rule | Example |
|------|---------|
| Use `should` + verb | `should return empty array when no match` |
| Describe behavior, not implementation | `should reject expired tokens` (not `should call jwt.verify`) |
| Include the condition | `when user is not authenticated` |
| No test IDs in names | `should calculate tax` (not `TC-001: tax calculation`) |

### File Naming

| Convention | Pattern | Example |
|------------|---------|---------|
| Co-located | `[filename].test.ts` | `price-calculator.test.ts` |
| Test directory | `__tests__/[filename].test.ts` | `__tests__/price-calculator.test.ts` |
| E2E | `e2e/[flow-name].spec.ts` | `e2e/checkout-flow.spec.ts` |

**Default choice:** Co-located (`*.test.ts` next to source). Use `__tests__/` only when the project already uses it.

---

## Test File Organization

### Co-located (PREFERRED)

```
src/
  services/
    price-calculator.ts
    price-calculator.test.ts      <- Right next to source
  components/
    UserCard.tsx
    UserCard.test.tsx
```

### __tests__ Directory (LEGACY)

```
src/
  services/
    price-calculator.ts
  __tests__/
    services/
      price-calculator.test.ts    <- Mirrors src/ structure
```

### E2E (ALWAYS SEPARATE)

```
e2e/
  flows/
    checkout.spec.ts
    user-registration.spec.ts
  fixtures/
    test-user.json
  playwright.config.ts
```

---

## Coverage Targets by Project Type

| Project Type | Line Coverage | Branch Coverage | Rationale |
|-------------|--------------|-----------------|-----------|
| **SaaS Application** | 80% | 75% | Business-critical, frequent changes |
| **Library / SDK** | 90% | 85% | Public API contract, many consumers |
| **CLI Tool** | 70% | 65% | Interactive paths hard to test |
| **Internal Dashboard** | 75% | 70% | Medium risk, medium change frequency |
| **API Service** | 85% | 80% | Data integrity critical |
| **Prototype (Forge output)** | 0% | 0% | Tests come in Builder phase |

### Coverage Thresholds in CI

```ts
// vitest.config.ts — enforce in CI
coverage: {
  thresholds: {
    lines: 80,
    branches: 75,
    functions: 80,
    statements: 80,
  },
},
```

### What Coverage Does NOT Tell You

- 100% coverage does not mean the code is correct
- Coverage measures which lines ran, not which behaviors were verified
- Missing assertions = high coverage but low value
- Always pair coverage metrics with assertion density
