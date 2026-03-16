# E2E Environment Management

Setup, configuration, and management of environments for E2E testing.

---

## Agent Boundary

| Responsibility | Voyager | Gear | Scaffold |
|----------------|---------|------|----------|
| **E2E-specific Docker Compose** | ✅ Primary | | |
| **Test DB seeding** | ✅ Primary | | |
| **Dynamic preview environments** | ✅ E2E config | | |
| **CI/CD pipeline (general)** | | ✅ Primary | |
| **Docker infrastructure (general)** | | ✅ Primary | |
| **IaC / cloud provisioning** | | | ✅ Primary |
| **Dev environment setup** | | | ✅ Primary |

**Rule of thumb**: Voyager owns E2E-specific environment configuration. Gear owns general CI/Docker. Scaffold owns infrastructure provisioning.

---

## Docker Compose for E2E

### Template

```yaml
# docker-compose.e2e.yml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://test:test@db:5432/testdb
      - REDIS_URL=redis://redis:6379
      - SMTP_HOST=mailhog
      - SMTP_PORT=1025
      - NODE_ENV=test
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 15s

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
      POSTGRES_DB: testdb
    ports:
      - "5433:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U test -d testdb"]
      interval: 3s
      timeout: 3s
      retries: 5
    tmpfs:
      - /var/lib/postgresql/data  # RAM disk for speed

  redis:
    image: redis:7-alpine
    ports:
      - "6380:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 3s
      timeout: 3s
      retries: 5

  mailhog:
    image: mailhog/mailhog
    ports:
      - "8025:8025"  # Web UI
      - "1025:1025"  # SMTP
```

### Startup Wait Script

```bash
#!/bin/bash
# scripts/wait-for-e2e.sh
set -e

echo "Starting E2E environment..."
docker compose -f docker-compose.e2e.yml up -d

echo "Waiting for services..."
MAX_RETRIES=30
RETRY_COUNT=0

until curl -sf http://localhost:3000/api/health > /dev/null 2>&1; do
  RETRY_COUNT=$((RETRY_COUNT + 1))
  if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
    echo "ERROR: App failed to start after $MAX_RETRIES attempts"
    docker compose -f docker-compose.e2e.yml logs app
    exit 1
  fi
  echo "  Waiting for app... ($RETRY_COUNT/$MAX_RETRIES)"
  sleep 2
done

echo "E2E environment ready!"
```

---

## Test Database Seeding

### Global Setup with Prisma

```typescript
// e2e/global-setup.ts
import { chromium, FullConfig } from '@playwright/test';
import { execSync } from 'child_process';

async function globalSetup(config: FullConfig) {
  // Reset and seed database
  execSync('npx prisma migrate reset --force --skip-seed', {
    env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
    stdio: 'pipe',
  });

  // Run seed script
  execSync('npx prisma db seed', {
    env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
    stdio: 'pipe',
  });

  // Authenticate and save storage state
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(config.projects[0].use.baseURL + '/login');
  await page.getByTestId('email-input').fill('admin@test.com');
  await page.getByTestId('password-input').fill('Test1234!');
  await page.getByTestId('login-submit').click();
  await page.waitForURL('**/dashboard');

  await page.context().storageState({ path: '.auth/admin.json' });
  await browser.close();
}

export default globalSetup;
```

### Drizzle Seed

```typescript
// e2e/seed/seed.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { users, products, orders } from '../../src/db/schema';

export async function seedTestData(connectionString: string) {
  const db = drizzle(connectionString);

  // Clean tables in dependency order
  await db.delete(orders);
  await db.delete(products);
  await db.delete(users);

  // Seed users
  const [admin] = await db.insert(users).values([
    { email: 'admin@test.com', name: 'Admin', role: 'admin', passwordHash: '...' },
    { email: 'user@test.com', name: 'User', role: 'user', passwordHash: '...' },
  ]).returning();

  // Seed products
  await db.insert(products).values([
    { name: 'Test Product A', price: 1000, stock: 50 },
    { name: 'Test Product B', price: 2500, stock: 10 },
  ]);

  return { admin };
}
```

### Transaction Rollback Strategy

```typescript
// e2e/fixtures/db.fixture.ts
import { test as base } from '@playwright/test';
import { Pool } from 'pg';

export const test = base.extend<{ dbCleanup: void }>({
  dbCleanup: [async ({}, use) => {
    const pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });

    // Save point before test
    const client = await pool.connect();
    await client.query('BEGIN');
    await client.query('SAVEPOINT test_start');

    await use();

    // Rollback after test
    await client.query('ROLLBACK TO SAVEPOINT test_start');
    await client.query('COMMIT');
    client.release();
    await pool.end();
  }, { auto: true }],
});
```

### Data Isolation Strategy

| Strategy | Speed | Isolation | Use When |
|----------|-------|-----------|----------|
| **Transaction rollback** | Fast | High | DB-heavy tests |
| **Unique prefixes** | Fast | Medium | Parallel-friendly |
| **Per-test DB** | Slow | Perfect | Critical financial tests |
| **Truncate + reseed** | Medium | High | Suite-level reset |

```typescript
// ✅ GOOD: Unique data per test (parallel-safe)
test('user signup', async ({ page }) => {
  const uniqueEmail = `test-${Date.now()}@example.com`;
  await page.goto('/signup');
  await page.getByLabel('Email').fill(uniqueEmail);
  // ...
});
```

---

## Dynamic Environment Provisioning

### Vercel Preview + Playwright

```yaml
# .github/workflows/e2e-preview.yml
name: E2E on Preview

on:
  deployment_status:

jobs:
  e2e:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci
      - run: npx playwright install --with-deps

      - name: Run E2E tests against preview
        run: npx playwright test
        env:
          BASE_URL: ${{ github.event.deployment_status.target_url }}

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: e2e-preview-report
          path: playwright-report/
```

### Dynamic BASE_URL

```typescript
// playwright.config.ts
const getBaseURL = (): string => {
  // PR preview
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // Staging
  if (process.env.STAGING_URL) return process.env.STAGING_URL;
  // Local
  return process.env.BASE_URL || 'http://localhost:3000';
};

export default defineConfig({
  use: {
    baseURL: getBaseURL(),
  },
});
```

---

## Environment Variable Management

### .env.test Template

```bash
# .env.test
# Database
TEST_DATABASE_URL=postgresql://test:test@localhost:5433/testdb

# App
BASE_URL=http://localhost:3000
NODE_ENV=test

# Auth (test credentials)
TEST_USER_EMAIL=user@test.com
TEST_USER_PASSWORD=Test1234!
TEST_ADMIN_EMAIL=admin@test.com
TEST_ADMIN_PASSWORD=Admin1234!

# External services (test mode)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Mail
SMTP_HOST=localhost
SMTP_PORT=1025
```

### CI Secrets Mapping

```yaml
# .github/workflows/e2e.yml
env:
  BASE_URL: http://localhost:3000
  TEST_DATABASE_URL: postgresql://test:test@localhost:5433/testdb
  TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
  TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
  STRIPE_SECRET_KEY: ${{ secrets.STRIPE_TEST_SECRET_KEY }}
```

### dotenv-flow for Environment Switching

```typescript
// e2e/global-setup.ts
import { config } from 'dotenv-flow';

// Loads .env.test → .env.test.local (ignored in git)
config({ path: '.', node_env: 'test' });
```

---

## Test Mail Server

### Mailhog Integration

```typescript
// e2e/utils/mail-helpers.ts
import { APIRequestContext } from '@playwright/test';

export class MailHelper {
  constructor(
    private mailhogUrl: string = 'http://localhost:8025',
    private request: APIRequestContext,
  ) {}

  async getLatestEmail(to: string) {
    const response = await this.request.get(
      `${this.mailhogUrl}/api/v2/search?kind=to&query=${to}`
    );
    const data = await response.json();
    return data.items[0];
  }

  async extractOTP(to: string): Promise<string> {
    const email = await this.getLatestEmail(to);
    const body = email.Content.Body;
    const otpMatch = body.match(/\b(\d{6})\b/);
    return otpMatch?.[1] ?? '';
  }

  async extractLink(to: string, pattern: RegExp): Promise<string> {
    const email = await this.getLatestEmail(to);
    const body = email.Content.Body;
    const match = body.match(pattern);
    return match?.[1] ?? '';
  }

  async clearMailbox() {
    await this.request.delete(`${this.mailhogUrl}/api/v1/messages`);
  }
}
```

### OTP / Magic Link E2E Test

```typescript
test('completes OTP verification', async ({ page, request }) => {
  const mail = new MailHelper('http://localhost:8025', request);
  await mail.clearMailbox();

  const email = `test-${Date.now()}@example.com`;

  // Request OTP
  await page.goto('/signup');
  await page.getByLabel('Email').fill(email);
  await page.getByTestId('send-otp').click();

  // Wait for email delivery
  await page.waitForTimeout(1000); // Acceptable: waiting for external service

  // Extract OTP from email
  const otp = await mail.extractOTP(email);
  expect(otp).toHaveLength(6);

  // Enter OTP
  await page.getByTestId('otp-input').fill(otp);
  await page.getByTestId('verify-otp').click();

  await page.waitForURL('**/welcome');
});
```

---

## External Service Mocking

### MSW in E2E Context

```typescript
// e2e/utils/msw-setup.ts
import { createServer } from '@mswjs/http-middleware';
import { http, HttpResponse } from 'msw';

// Start mock server for external APIs
export function startMockServer(port = 9090) {
  const handlers = [
    http.post('https://api.stripe.com/v1/charges', () => {
      return HttpResponse.json({
        id: 'ch_test_123',
        status: 'succeeded',
        amount: 2500,
      });
    }),
    http.get('https://maps.googleapis.com/maps/api/*', () => {
      return HttpResponse.json({
        results: [{ formatted_address: 'Tokyo, Japan' }],
      });
    }),
  ];

  return createServer(...handlers).listen(port);
}
```

### Stripe Test Mode

```typescript
test('processes payment with Stripe test card', async ({ page }) => {
  await page.goto('/checkout');

  // Use Stripe test card numbers
  const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]');
  await stripeFrame.getByPlaceholder('Card number').fill('4242424242424242');
  await stripeFrame.getByPlaceholder('MM / YY').fill('12/30');
  await stripeFrame.getByPlaceholder('CVC').fill('123');

  await page.getByTestId('pay-button').click();

  // Stripe test mode processes immediately
  await expect(page.getByTestId('payment-success')).toBeVisible({ timeout: 10000 });
});
```
