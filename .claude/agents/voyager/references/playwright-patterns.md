# Playwright Patterns

Configuration, Page Object Model, authentication, wait strategies, parallel execution, and modern API features.

---

## Project Setup

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    process.env.CI ? ['github'] : ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    // Setup project for authentication
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },

    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Directory Structure

```
e2e/
├── fixtures/
│   ├── test-data.ts        # Test data factory
│   └── index.ts            # Custom fixtures
├── pages/
│   ├── base.page.ts        # Base page class
│   ├── login.page.ts       # Login page
│   ├── home.page.ts        # Home page
│   └── checkout.page.ts    # Checkout page
├── tests/
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── signup.spec.ts
│   ├── checkout/
│   │   └── purchase.spec.ts
│   └── smoke.spec.ts       # Smoke tests
├── utils/
│   ├── api-helpers.ts      # API helpers
│   └── test-helpers.ts     # Test helpers
├── auth.setup.ts           # Auth setup
└── global-setup.ts         # Global setup
```

---

## Page Object Model

### Base Page Class

```typescript
// e2e/pages/base.page.ts
import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = '') {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async expectToBeVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `.evidence/${name}.png`, fullPage: true });
  }

  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }
}
```

### Page Implementation

```typescript
// e2e/pages/login.page.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = this.getByTestId('email-input');
    this.passwordInput = this.getByTestId('password-input');
    this.submitButton = this.getByTestId('login-submit');
    this.errorMessage = this.getByTestId('login-error');
  }

  async goto() {
    await super.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async loginAndWaitForRedirect(email: string, password: string) {
    await this.login(email, password);
    await this.page.waitForURL('**/dashboard');
  }

  async expectErrorMessage(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }
}
```

### Component Page Object

```typescript
// e2e/pages/components/header.component.ts
import { Page, Locator } from '@playwright/test';

export class HeaderComponent {
  readonly page: Page;
  readonly userMenu: Locator;
  readonly logoutButton: Locator;
  readonly notificationBell: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userMenu = page.getByTestId('user-menu');
    this.logoutButton = page.getByTestId('logout-button');
    this.notificationBell = page.getByTestId('notification-bell');
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutButton.click();
    await this.page.waitForURL('**/login');
  }
}
```

---

## Authentication Handling

### Storage State Setup

```typescript
// e2e/auth.setup.ts
import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '.auth/user.json');

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('email-input').fill(process.env.TEST_USER_EMAIL!);
  await page.getByTestId('password-input').fill(process.env.TEST_USER_PASSWORD!);
  await page.getByTestId('login-submit').click();
  await page.waitForURL('**/dashboard');
  await expect(page.getByTestId('user-menu')).toBeVisible();
  await page.context().storageState({ path: authFile });
});
```

### Multiple Users

```typescript
// e2e/fixtures/index.ts
import { test as base, Page } from '@playwright/test';

type TestFixtures = {
  adminPage: Page;
  userPage: Page;
};

export const test = base.extend<TestFixtures>({
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: '.auth/admin.json',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  userPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: '.auth/user.json',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});
```

---

## Wait Strategies

### Recommended Waits

```typescript
// ✅ GOOD: Wait for specific conditions
await expect(page.getByTestId('result')).toBeVisible();
await expect(page.getByTestId('status')).toContainText('Complete');
await page.waitForURL('**/confirmation');
await page.waitForLoadState('networkidle');
await page.waitForResponse(resp =>
  resp.url().includes('/api/orders') && resp.status() === 200
);
await expect(page.getByTestId('submit')).toBeEnabled();
```

### Custom Wait Helpers

```typescript
// e2e/utils/wait-helpers.ts
import { Page, expect } from '@playwright/test';

export async function waitForToast(page: Page, message: string) {
  const toast = page.getByRole('alert');
  await expect(toast).toContainText(message);
  await expect(toast).toBeHidden({ timeout: 5000 });
}

export async function waitForModalClose(page: Page) {
  await expect(page.getByRole('dialog')).toBeHidden();
}
```

### Avoid These

```typescript
// ❌ BAD: Arbitrary timeout
await page.waitForTimeout(2000);

// ❌ BAD: Fixed delay before action
await new Promise(r => setTimeout(r, 1000));
await page.click('button');
```

---

## Test Data Management

### API-Based Setup

```typescript
// e2e/utils/api-helpers.ts
import { APIRequestContext } from '@playwright/test';

export class ApiHelpers {
  constructor(private request: APIRequestContext) {}

  async createUser(data: { email: string; name: string }) {
    const response = await this.request.post('/api/users', { data });
    return response.json();
  }

  async createProduct(data: { name: string; price: number }) {
    const response = await this.request.post('/api/products', { data });
    return response.json();
  }

  async resetDatabase() {
    await this.request.post('/api/test/reset');
  }
}
```

### Test Data Factory

```typescript
// e2e/fixtures/test-data.ts
import { faker } from '@faker-js/faker/locale/ja';

export const TestData = {
  user: {
    valid: () => ({
      email: faker.internet.email(),
      password: 'Test1234!',
      name: faker.person.fullName(),
    }),
    invalid: {
      email: 'invalid-email',
      password: '123',
    },
  },
  product: {
    create: () => ({
      name: faker.commerce.productName(),
      price: faker.number.int({ min: 100, max: 10000 }),
      description: faker.commerce.productDescription(),
    }),
  },
};
```

---

## Parallel Execution

### Sharding Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,
  // Run with: npx playwright test --shard=1/4
});
```

### Test Isolation

```typescript
// ✅ GOOD: Tests are independent
test.describe('User Management', () => {
  test('can create user', async ({ page, request }) => {
    const user = TestData.user.valid();
    // ... test with unique data
  });

  test('can delete user', async ({ page, request }) => {
    // Create own test data, don't depend on previous test
    const api = new ApiHelpers(request);
    const user = await api.createUser(TestData.user.valid());
    // ... test deletion
  });
});
```

---

## Playwright 1.49+ Modern Features

### Clock API (Fake Timers)

```typescript
// Control time for animations, timers, and date-dependent UI
test('shows countdown timer', async ({ page }) => {
  // Install fake timers
  await page.clock.install({ time: new Date('2024-12-31T23:59:00') });

  await page.goto('/countdown');
  await expect(page.getByTestId('timer')).toContainText('1:00');

  // Advance time by 30 seconds
  await page.clock.fastForward(30000);
  await expect(page.getByTestId('timer')).toContainText('0:30');

  // Jump to midnight
  await page.clock.setFixedTime(new Date('2025-01-01T00:00:00'));
  await expect(page.getByTestId('celebration')).toBeVisible();
});

// Pause and resume time for animation testing
test('animation pauses correctly', async ({ page }) => {
  await page.clock.install();
  await page.goto('/animated-dashboard');

  await page.clock.pauseAt(new Date('2024-06-15T12:00:00'));
  // Verify animation frame at this exact time

  await page.clock.resume();
  // Animation continues
});
```

### expect.configure (Soft Assertions)

```typescript
// Collect all failures instead of stopping at first
test('dashboard shows all widgets', async ({ page }) => {
  const softExpect = expect.configure({ soft: true });

  await page.goto('/dashboard');

  // All assertions run even if some fail
  await softExpect(page.getByTestId('revenue-widget')).toBeVisible();
  await softExpect(page.getByTestId('users-widget')).toBeVisible();
  await softExpect(page.getByTestId('orders-widget')).toBeVisible();
  await softExpect(page.getByTestId('chart-widget')).toBeVisible();

  // Custom timeout per assertion group
  const slowExpect = expect.configure({ timeout: 10000 });
  await slowExpect(page.getByTestId('analytics-loaded')).toBeVisible();
});
```

### Viewport Assertions (toBeInViewport)

```typescript
test('lazy-loaded images appear on scroll', async ({ page }) => {
  await page.goto('/gallery');

  const thirdImage = page.getByTestId('image-3');

  // Not in viewport initially
  await expect(thirdImage).not.toBeInViewport();

  // Scroll down
  await thirdImage.scrollIntoViewIfNeeded();

  // Now visible in viewport
  await expect(thirdImage).toBeInViewport();
  await expect(thirdImage).toBeInViewport({ ratio: 0.5 }); // At least 50% visible
});
```

### API Testing Integration

```typescript
import { test, expect } from '@playwright/test';

// Mix UI and API tests in the same suite
test('API: create user then verify in UI', async ({ page, request }) => {
  // API step: create user
  const response = await request.post('/api/users', {
    data: { name: 'E2E User', email: 'e2e@example.com' },
  });
  expect(response.ok()).toBeTruthy();
  const user = await response.json();

  // UI step: verify user appears in admin panel
  await page.goto('/admin/users');
  await expect(page.getByText('E2E User')).toBeVisible();

  // Cleanup via API
  await request.delete(`/api/users/${user.id}`);
});

// Pure API tests (no browser needed)
test.describe('API Tests', () => {
  test('GET /api/health returns 200', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ status: 'ok' });
  });
});
```

### Component Testing (Experimental)

```typescript
// playwright-ct.config.ts
import { defineConfig } from '@playwright/experimental-ct-react';

export default defineConfig({
  testDir: './src',
  testMatch: '**/*.pw.tsx',
  use: {
    ctPort: 3100,
  },
});

// src/components/Button.pw.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from './Button';

test('renders with label', async ({ mount }) => {
  const component = await mount(<Button label="Click me" />);
  await expect(component).toContainText('Click me');
});

test('fires onClick', async ({ mount }) => {
  let clicked = false;
  const component = await mount(
    <Button label="Click" onClick={() => { clicked = true; }} />
  );
  await component.click();
  expect(clicked).toBe(true);
});
```

---

## Cross-Browser Testing

### Browser Matrix

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    // CI: All browsers
    ...(process.env.CI ? [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
      { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    ] : [
      // Local: Chrome only for speed
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ]),
  ],
});
```

### Mobile Testing

```typescript
test.describe('Mobile', () => {
  test.use({ ...devices['iPhone 12'] });

  test('mobile navigation works', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('mobile-menu')).toBeVisible();
    await expect(page.getByTestId('desktop-nav')).toBeHidden();
  });
});
```

---

## API Mocking & Interception

### Mock API Responses

```typescript
test('handles API error gracefully', async ({ page }) => {
  await page.route('**/api/products', route =>
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Server error' }),
    })
  );

  await page.goto('/products');
  await expect(page.getByTestId('error-message')).toBeVisible();
});
```

### Intercept and Modify

```typescript
test('modifies API response', async ({ page }) => {
  await page.route('**/api/user', async route => {
    const response = await route.fetch();
    const json = await response.json();
    json.isPremium = true;
    await route.fulfill({ response, json });
  });

  await page.goto('/dashboard');
  await expect(page.getByTestId('premium-badge')).toBeVisible();
});
```

---

## Flaky Test Prevention

### Common Causes & Solutions

| Cause | Symptom | Solution |
|-------|---------|----------|
| **Timing issues** | Random failures | Use proper waits, not timeouts |
| **Shared state** | Fails when parallel | Isolate test data |
| **Animation** | Screenshot diffs | Disable animations |
| **Network** | Timeout errors | Mock/intercept APIs |
| **Order dependency** | Fails in isolation | Make tests independent |
| **Race conditions** | Intermittent failures | Wait for specific conditions |

### Retry Configuration

```typescript
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'on-first-retry',
  },
});
```

### Flaky Test Investigation

```typescript
// Run test multiple times: npx playwright test --repeat-each=10 tests/checkout.spec.ts
test.describe('Flaky Investigation', () => {
  test.use({ trace: 'on', video: 'on' });

  test('potentially flaky test', async ({ page }, testInfo) => {
    console.log(`Attempt: ${testInfo.retry + 1}`);
    page.on('console', msg => console.log(msg.text()));

    // Add visual markers in video for debugging
    await page.evaluate((attempt) => {
      const marker = document.createElement('div');
      marker.style.cssText = 'position:fixed;top:0;left:0;background:red;color:white;padding:10px;z-index:99999';
      marker.textContent = `Attempt ${attempt}`;
      document.body.appendChild(marker);
    }, testInfo.retry + 1);

    // ... test code
  });
});
```

---

## Test Execution Optimization

### Tag-Based Prioritization

```typescript
// Tag tests by priority
test('@critical: user can complete checkout', async ({ page }) => {
  // Business-critical path
});

test('@smoke: homepage loads', async ({ page }) => {
  // Smoke test - quick verification
});

test('@regression: restored cart survives page reload', async ({ page }) => {
  // Regression test for specific bug
});
```

```bash
# Run by tag
npx playwright test --grep @critical        # Critical only
npx playwright test --grep @smoke           # Smoke tests
npx playwright test --grep-invert @regression  # Exclude regression
```

### Parallel vs Sequential Decision

| Scenario | Strategy | Config |
|----------|----------|--------|
| Independent CRUD tests | **Parallel** | `fullyParallel: true` |
| Shared resource (single DB user) | **Sequential** | `test.describe.configure({ mode: 'serial' })` |
| State machine flow | **Sequential** | Steps depend on prior state |
| Cross-browser same test | **Parallel** | Different projects, same tests |

---

## Cross-Reference Links

| Topic | Reference File |
|-------|---------------|
| Performance testing (CWV, Lighthouse) | `performance-testing.md` |
| Complex scenarios (multi-tab, WebSocket) | `complex-scenarios.md` |
| Environment management (Docker, seeding) | `environment-management.md` |
| Debug & monitoring (HAR, console, trace) | `debug-monitoring.md` |
| Edge cases & i18n (timezone, locale) | `edge-cases-i18n.md` |
| Visual regression & accessibility | `visual-a11y-testing.md` |
| CI/CD integration & reporting | `ci-reporting.md` |
| Cypress patterns | `cypress-guide.md` |
