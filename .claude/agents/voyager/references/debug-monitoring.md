# E2E Debug & Monitoring

HAR analysis, console error detection, trace viewer, profiling, and test execution analytics.

---

## HAR Analysis

### Recording HAR Files

```typescript
// e2e/fixtures/har.fixture.ts
import { test as base, BrowserContext } from '@playwright/test';
import path from 'path';

export const test = base.extend<{ harContext: BrowserContext }>({
  harContext: async ({ browser }, use, testInfo) => {
    const harPath = path.join(testInfo.outputDir, 'network.har');

    const context = await browser.newContext({
      recordHar: {
        path: harPath,
        mode: 'full',
        urlFilter: /\/(api|graphql)\//,
      },
    });

    await use(context);

    await context.close(); // HAR saved on close
  },
});
```

### Replaying from HAR

```typescript
test('replays API responses from HAR', async ({ page }) => {
  // Use recorded HAR for deterministic responses
  await page.routeFromHAR('e2e/fixtures/recorded.har', {
    url: '**/api/**',
    update: false, // Set true to update HAR
    notFound: 'fallback', // Fall back to network if not in HAR
  });

  await page.goto('/dashboard');
  await expect(page.getByTestId('data-loaded')).toBeVisible();
});
```

### Failure Network Analysis

```typescript
// e2e/fixtures/network-logger.fixture.ts
import { test as base, Page } from '@playwright/test';

type NetworkLog = {
  url: string;
  method: string;
  status: number;
  duration: number;
  size: number;
};

export const test = base.extend<{ networkLogs: NetworkLog[] }>({
  networkLogs: async ({ page }, use, testInfo) => {
    const logs: NetworkLog[] = [];

    page.on('request', (request) => {
      (request as any).__startTime = Date.now();
    });

    page.on('response', async (response) => {
      const request = response.request();
      logs.push({
        url: request.url(),
        method: request.method(),
        status: response.status(),
        duration: Date.now() - ((request as any).__startTime || Date.now()),
        size: parseInt(response.headers()['content-length'] || '0', 10),
      });
    });

    await use(logs);

    // Attach network log on failure
    if (testInfo.status !== 'passed') {
      const failedRequests = logs.filter(l => l.status >= 400);
      await testInfo.attach('failed-requests', {
        body: JSON.stringify(failedRequests, null, 2),
        contentType: 'application/json',
      });
      await testInfo.attach('all-requests', {
        body: JSON.stringify(logs, null, 2),
        contentType: 'application/json',
      });
    }
  },
});
```

---

## Browser Console Error Detection

### Auto-Collection Fixture

```typescript
// e2e/fixtures/console.fixture.ts
import { test as base, ConsoleMessage } from '@playwright/test';

type ConsoleFixture = {
  consoleErrors: ConsoleMessage[];
  consoleWarnings: ConsoleMessage[];
};

export const test = base.extend<ConsoleFixture>({
  consoleErrors: async ({ page }, use, testInfo) => {
    const errors: ConsoleMessage[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg);
      }
    });

    page.on('pageerror', (error) => {
      errors.push({
        type: () => 'error',
        text: () => error.message,
      } as any);
    });

    await use(errors);

    // Attach errors on failure
    if (errors.length > 0) {
      await testInfo.attach('console-errors', {
        body: errors.map(e => `[${e.type()}] ${e.text()}`).join('\n'),
        contentType: 'text/plain',
      });
    }
  },

  consoleWarnings: async ({ page }, use) => {
    const warnings: ConsoleMessage[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'warning') warnings.push(msg);
    });
    await use(warnings);
  },
});
```

### Auto-Fail on Console Errors

```typescript
// e2e/fixtures/strict-console.fixture.ts
import { test as base, expect } from '@playwright/test';

export const test = base.extend<{ strictConsole: void }>({
  strictConsole: [async ({ page }, use) => {
    const errors: string[] = [];

    // Allowlist known non-critical errors
    const allowlist = [
      'ResizeObserver loop',
      'favicon.ico',
      'chrome-extension://',
    ];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        const isAllowed = allowlist.some(pattern => text.includes(pattern));
        if (!isAllowed) errors.push(text);
      }
    });

    page.on('pageerror', (error) => {
      errors.push(`Page Error: ${error.message}`);
    });

    await use();

    // Fail test if unexpected console errors
    expect(
      errors,
      `Unexpected console errors:\n${errors.join('\n')}`
    ).toHaveLength(0);
  }, { auto: true }],
});
```

---

## Trace Viewer Integration

### Advanced Trace Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: {
      mode: 'on-first-retry',
      screenshots: true,
      snapshots: true,
      sources: true,
    },
  },
});
```

### Custom Annotations

```typescript
test('checkout flow with annotations', async ({ page }, testInfo) => {
  // Add custom annotations to trace
  await testInfo.attach('test-context', {
    body: JSON.stringify({
      testUser: 'user@test.com',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    }),
    contentType: 'application/json',
  });

  await test.step('Navigate to cart', async () => {
    await page.goto('/cart');
    await expect(page.getByTestId('cart-items')).toBeVisible();
  });

  await test.step('Enter shipping info', async () => {
    await page.getByLabel('Address').fill('123 Test St');
    await page.getByTestId('continue-shipping').click();
  });

  await test.step('Complete payment', async () => {
    await page.getByTestId('pay-button').click();
    await page.waitForURL('**/confirmation');
  });
});
```

### Trace on Every Failure

```typescript
// e2e/fixtures/trace.fixture.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page, context }, use, testInfo) => {
    // Start tracing for every test
    if (process.env.TRACE_ALL) {
      await context.tracing.start({ screenshots: true, snapshots: true });
    }

    await use(page);

    // Save trace on failure
    if (testInfo.status !== 'passed' && process.env.TRACE_ALL) {
      const tracePath = testInfo.outputPath('trace.zip');
      await context.tracing.stop({ path: tracePath });
      await testInfo.attach('trace', {
        path: tracePath,
        contentType: 'application/zip',
      });
    }
  },
});
```

---

## CPU / Memory Profiling

### CDP Integration

```typescript
// e2e/tests/performance/memory.spec.ts
import { test, expect } from '@playwright/test';

test('no memory leaks on repeated navigation', async ({ page }) => {
  const client = await page.context().newCDPSession(page);

  // Take initial heap snapshot
  await client.send('HeapProfiler.enable');
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  const initialMetrics = await page.evaluate(() => ({
    jsHeapSize: (performance as any).memory?.usedJSHeapSize,
  }));

  // Navigate back and forth multiple times
  for (let i = 0; i < 10; i++) {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  }

  const finalMetrics = await page.evaluate(() => ({
    jsHeapSize: (performance as any).memory?.usedJSHeapSize,
  }));

  // Heap should not grow more than 50%
  if (initialMetrics.jsHeapSize && finalMetrics.jsHeapSize) {
    const growth = finalMetrics.jsHeapSize / initialMetrics.jsHeapSize;
    expect(growth).toBeLessThan(1.5);
  }
});
```

### JS Coverage Analysis

```typescript
test('JavaScript coverage meets minimum', async ({ page }) => {
  await page.coverage.startJSCoverage();
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Interact with key features
  await page.getByTestId('nav-products').click();
  await page.waitForURL('**/products');

  const coverage = await page.coverage.stopJSCoverage();

  // Calculate usage ratio
  let totalBytes = 0;
  let usedBytes = 0;

  for (const entry of coverage) {
    totalBytes += entry.text.length;
    for (const range of entry.ranges) {
      usedBytes += range.end - range.start;
    }
  }

  const usagePercent = (usedBytes / totalBytes) * 100;
  console.log(`JS code usage: ${usagePercent.toFixed(1)}%`);

  // At least 30% of loaded JS should be used
  expect(usagePercent).toBeGreaterThan(30);
});
```

---

## Test Execution Analytics

### Slowest Test Identification

```typescript
// e2e/reporters/slow-test-reporter.ts
import type { FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';

class SlowTestReporter implements Reporter {
  private results: { title: string; duration: number; file: string }[] = [];

  onTestEnd(test: TestCase, result: TestResult) {
    this.results.push({
      title: test.title,
      duration: result.duration,
      file: test.location.file,
    });
  }

  onEnd(result: FullResult) {
    const sorted = this.results.sort((a, b) => b.duration - a.duration);
    const slow = sorted.slice(0, 10);

    console.log('\n=== Top 10 Slowest Tests ===');
    for (const t of slow) {
      console.log(`  ${(t.duration / 1000).toFixed(1)}s - ${t.title}`);
    }

    // Warn on very slow tests (> 30s)
    const verySlow = sorted.filter(t => t.duration > 30000);
    if (verySlow.length > 0) {
      console.warn(`\n⚠ ${verySlow.length} tests exceed 30s threshold`);
    }
  }
}

export default SlowTestReporter;
```

### Flaky Rate Tracking

```typescript
// e2e/reporters/flaky-tracker.ts
import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import fs from 'fs';

class FlakyTracker implements Reporter {
  private flakyTests: { title: string; file: string; retries: number }[] = [];

  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'passed' && result.retry > 0) {
      this.flakyTests.push({
        title: test.title,
        file: test.location.file,
        retries: result.retry,
      });
    }
  }

  onEnd() {
    if (this.flakyTests.length > 0) {
      console.warn(`\n⚠ ${this.flakyTests.length} flaky tests detected:`);
      for (const t of this.flakyTests) {
        console.warn(`  [${t.retries} retries] ${t.title}`);
      }

      // Save for trend analysis
      const logPath = '.flaky-log.jsonl';
      const entry = {
        timestamp: new Date().toISOString(),
        tests: this.flakyTests,
      };
      fs.appendFileSync(logPath, JSON.stringify(entry) + '\n');
    }
  }
}

export default FlakyTracker;
```

---

## Smart Retry Strategies

### Conditional Retry

```typescript
// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
});
```

### Custom Retry Logic

```typescript
// e2e/utils/retry-helpers.ts
import { test, expect } from '@playwright/test';

/**
 * Retry with exponential backoff for external service checks.
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; baseDelay?: number } = {},
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000 } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(r => setTimeout(r, delay));
    }
  }

  throw new Error('Unreachable');
}
```

### Per-Test Retry Override

```typescript
test.describe('Stable tests', () => {
  test.describe.configure({ retries: 0 });

  test('deterministic test', async ({ page }) => {
    // No retries - must pass first time
  });
});

test.describe('External service tests', () => {
  test.describe.configure({ retries: 3 });

  test('third-party API test', async ({ page }) => {
    // Extra retries for external dependencies
  });
});
```
