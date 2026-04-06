# Test Patterns

Concrete patterns with code examples for unit, integration, and E2E tests. Each pattern shows the correct approach and common mistakes.

---

## Unit Test Patterns

### 1. Pure Function Testing (Input -> Output)

The simplest and highest-value test type. No mocks, no setup, no side effects.

```ts
// src/utils/tax.ts
export function calculateTax(price: number, rate: number): number {
  if (price < 0) throw new Error('Price must be non-negative');
  return Math.floor(price * rate);
}
```

```ts
// src/utils/tax.test.ts

// CORRECT: Test behavior with meaningful inputs
describe('calculateTax', () => {
  it('should calculate 10% tax on 1000 yen', () => {
    expect(calculateTax(1000, 0.1)).toBe(100);
  });

  it('should floor fractional yen', () => {
    expect(calculateTax(999, 0.1)).toBe(99); // 99.9 -> 99
  });

  it('should return 0 when price is 0', () => {
    expect(calculateTax(0, 0.1)).toBe(0);
  });

  it('should throw when price is negative', () => {
    expect(() => calculateTax(-1, 0.1)).toThrow('Price must be non-negative');
  });
});
```

```ts
// WRONG: Testing implementation details
describe('calculateTax', () => {
  it('should call Math.floor', () => {
    const spy = vi.spyOn(Math, 'floor');
    calculateTax(1000, 0.1);
    expect(spy).toHaveBeenCalled(); // Tests HOW, not WHAT
  });
});
```

---

### 2. React Component Testing (Render, Interact, Assert)

Use Testing Library. Test what the user sees and does, not internal state.

```tsx
// src/components/Counter.tsx
export function Counter({ initial = 0 }: { initial?: number }) {
  const [count, setCount] = useState(initial);
  return (
    <div>
      <span data-testid="count">{count}</span>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

```tsx
// CORRECT: Test from the user's perspective
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Counter', () => {
  it('should display the initial count', () => {
    render(<Counter initial={5} />);
    expect(screen.getByTestId('count')).toHaveTextContent('5');
  });

  it('should increment when button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await user.click(screen.getByRole('button', { name: 'Increment' }));

    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('should reset to 0 when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter initial={10} />);

    await user.click(screen.getByRole('button', { name: 'Reset' }));

    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });
});
```

```tsx
// WRONG: Testing implementation details
it('should update state', () => {
  const { result } = renderHook(() => useState(0));
  act(() => result.current[1](5));
  expect(result.current[0]).toBe(5); // Tests React, not your component
});
```

---

### 3. Hook Testing (renderHook Pattern)

For custom hooks with complex logic that deserves isolated testing.

```ts
// src/hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

```ts
// CORRECT: renderHook + act for timing
import { renderHook, act } from '@testing-library/react';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 500));
    expect(result.current).toBe('hello');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 500 } }
    );

    rerender({ value: 'world', delay: 500 });
    expect(result.current).toBe('hello'); // Not yet updated

    act(() => { vi.advanceTimersByTime(500); });
    expect(result.current).toBe('world'); // Now updated
  });
});
```

---

### 4. Mock Strategy

Priority order (most preferred first):

| Priority | Strategy | When to Use |
|----------|----------|-------------|
| 1 | **Dependency Injection** | Pass dependencies as arguments or props |
| 2 | **vi.mock / jest.mock** | Module-level replacement for external deps |
| 3 | **Manual Mock** | Complex behavior that needs a dedicated fake |
| 4 | **MSW (Mock Service Worker)** | HTTP request interception |

```ts
// CORRECT: Dependency injection (most testable)
export function createUserService(db: Database, mailer: Mailer) {
  return {
    async register(email: string) {
      const user = await db.users.create({ email });
      await mailer.sendWelcome(user.email);
      return user;
    },
  };
}

// Test: inject fakes directly
it('should send welcome email after registration', async () => {
  const fakeDb = { users: { create: vi.fn().mockResolvedValue({ id: 1, email: 'a@b.com' }) } };
  const fakeMailer = { sendWelcome: vi.fn().mockResolvedValue(undefined) };
  const service = createUserService(fakeDb as any, fakeMailer as any);

  await service.register('a@b.com');

  expect(fakeMailer.sendWelcome).toHaveBeenCalledWith('a@b.com');
});
```

```ts
// WRONG: Mocking everything (tests nothing)
vi.mock('../db');
vi.mock('../mailer');
vi.mock('../logger');
vi.mock('../cache');
vi.mock('../config');
// At this point you are testing a shell with no real behavior
```

---

## Integration Test Patterns

### 1. API Endpoint Testing (Request -> Response -> DB State)

```ts
import request from 'supertest';
import { app } from '../src/app';
import { db } from '../src/db';

describe('POST /api/users', () => {
  beforeEach(async () => {
    await db.users.deleteMany(); // Clean slate
  });

  // CORRECT: Verify response AND side effects
  it('should create user and return 201 with user data', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Tanaka', email: 'tanaka@example.com' })
      .expect(201);

    // Verify response shape
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      name: 'Tanaka',
      email: 'tanaka@example.com',
    });

    // Verify DB state (not just the response)
    const dbUser = await db.users.findUnique({ where: { id: res.body.id } });
    expect(dbUser).not.toBeNull();
    expect(dbUser!.email).toBe('tanaka@example.com');
  });

  it('should return 409 when email already exists', async () => {
    await db.users.create({ data: { name: 'Existing', email: 'dup@example.com' } });

    await request(app)
      .post('/api/users')
      .send({ name: 'New', email: 'dup@example.com' })
      .expect(409);
  });

  it('should return 400 when email is missing', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'No Email' })
      .expect(400);

    expect(res.body.error).toContain('email');
  });
});
```

---

### 2. Database Integration (Test DB Setup / Teardown)

```ts
// test/setup.ts — Global test database configuration
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.TEST_DATABASE_URL } },
});

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// Per-test cleanup: truncate all tables
beforeEach(async () => {
  const tables = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  `;
  for (const { tablename } of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" CASCADE`);
  }
});

export { prisma };
```

```ts
// CORRECT: Use real DB, verify actual queries
describe('UserRepository', () => {
  it('should find users by partial name match', async () => {
    await prisma.user.createMany({
      data: [
        { name: 'Tanaka Taro', email: 'tanaka@test.com' },
        { name: 'Suzuki Hanako', email: 'suzuki@test.com' },
        { name: 'Tanaka Jiro', email: 'jiro@test.com' },
      ],
    });

    const results = await userRepo.searchByName('Tanaka');

    expect(results).toHaveLength(2);
    expect(results.map(u => u.email)).toContain('tanaka@test.com');
    expect(results.map(u => u.email)).toContain('jiro@test.com');
  });
});
```

```ts
// WRONG: Mocking the database (tests nothing about actual queries)
vi.mock('@prisma/client');
// This tells you nothing about whether your SQL works
```

---

### 3. Service Layer Testing (Real Dependencies, Test DB)

```ts
// CORRECT: Real service, real DB, test data
describe('OrderService', () => {
  it('should calculate order total with tax', async () => {
    const product = await prisma.product.create({
      data: { name: 'Widget', price: 1000 },
    });

    const order = await orderService.createOrder({
      items: [{ productId: product.id, quantity: 3 }],
      taxRate: 0.1,
    });

    expect(order.subtotal).toBe(3000);
    expect(order.tax).toBe(300);
    expect(order.total).toBe(3300);

    // Verify DB persistence
    const dbOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: { items: true },
    });
    expect(dbOrder!.items).toHaveLength(1);
  });
});
```

---

## E2E Test Patterns

### 1. User Flow Testing (Login -> Action -> Verify)

```ts
// e2e/checkout-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('should complete purchase as authenticated user', async ({ page }) => {
    // Arrange: Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');

    // Act: Add to cart and checkout
    await page.goto('/products');
    await page.click('[data-testid="product-1"] >> text=Add to Cart');
    await page.click('[data-testid="cart-icon"]');
    await page.click('text=Proceed to Checkout');
    await page.fill('[name="card-number"]', '4242424242424242');
    await page.fill('[name="expiry"]', '12/28');
    await page.fill('[name="cvc"]', '123');
    await page.click('text=Place Order');

    // Assert: Order confirmation
    await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();
    await expect(page.locator('[data-testid="order-id"]')).toHaveText(/^ORD-/);
  });
});
```

---

### 2. Visual Regression (Screenshot Comparison)

```ts
// e2e/visual/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard Visual Regression', () => {
  test('should match dashboard layout', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Full page screenshot comparison
    await expect(page).toHaveScreenshot('dashboard-full.png', {
      maxDiffPixelRatio: 0.01, // Allow 1% pixel difference
    });
  });

  test('should match data table in dark mode', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('[data-testid="theme-toggle"]');

    await expect(page.locator('[data-testid="data-table"]')).toHaveScreenshot(
      'data-table-dark.png'
    );
  });
});
```

---

### 3. Accessibility Testing (axe-core Integration)

```ts
// e2e/accessibility/main-pages.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  const pages = ['/', '/dashboard', '/settings', '/profile'];

  for (const path of pages) {
    test(`${path} should have no accessibility violations`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  }

  test('login form should be keyboard-navigable', async ({ page }) => {
    await page.goto('/login');

    await page.keyboard.press('Tab'); // Focus email
    await expect(page.locator('[name="email"]')).toBeFocused();

    await page.keyboard.press('Tab'); // Focus password
    await expect(page.locator('[name="password"]')).toBeFocused();

    await page.keyboard.press('Tab'); // Focus submit
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });
});
```

---

## Anti-Patterns Summary

| Pattern | Problem | Fix |
|---------|---------|-----|
| Snapshot-only testing | Does not verify behavior, just catches any change | Replace with explicit assertions |
| Testing implementation | Breaks when refactoring even if behavior is unchanged | Test inputs/outputs only |
| Shared mutable state | Tests pass individually, fail together | `beforeEach` cleanup |
| No error path tests | Production bugs hide in error paths | Test every `throw` / `catch` |
| `any` in test types | Hides type errors in test setup | Type test data strictly |
| `sleep()` in tests | Flaky, slow | `waitFor` / `findBy` / polling |
| Copy-paste test data | Hard to maintain when schema changes | Factory functions |

### Factory Function Pattern (Recommended for Test Data)

```ts
// test/factories/user.ts
import { faker } from '@faker-js/faker';

export function buildUser(overrides: Partial<User> = {}): User {
  return {
    id: faker.number.int(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'member',
    createdAt: new Date(),
    ...overrides,
  };
}

// Usage in tests
const admin = buildUser({ role: 'admin' });
const recentUser = buildUser({ createdAt: new Date('2026-04-01') });
```
