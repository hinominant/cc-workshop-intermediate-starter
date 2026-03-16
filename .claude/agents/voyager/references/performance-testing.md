# Performance Testing in E2E Context

Measurement, assertion, and regression detection for web performance metrics within E2E tests.

---

## Agent Boundary

| Responsibility | Voyager | Bolt | Growth |
|----------------|---------|------|--------|
| **E2E performance measurement** | ✅ Primary | | |
| **Core Web Vitals assertion** | ✅ Primary | | |
| **Lighthouse CI integration** | ✅ Primary | | |
| **Code-level optimization** | | ✅ Primary | |
| **Bundle size reduction** | | ✅ Primary | |
| **Field data analysis (RUM)** | | | ✅ Primary |
| **Performance regression detection** | ✅ E2E context | ✅ Build context | ✅ Field context |

**Rule of thumb**: Voyager **measures and asserts** performance in the browser. Bolt **fixes** the code. Growth **analyzes** real-user data.

---

## Performance Budget Configuration

### Budget JSON File

```json
// performance-budget.json
{
  "metrics": {
    "LCP": { "target": 2500, "warning": 2000, "unit": "ms" },
    "CLS": { "target": 0.1, "warning": 0.05, "unit": "score" },
    "INP": { "target": 200, "warning": 100, "unit": "ms" },
    "TTFB": { "target": 800, "warning": 500, "unit": "ms" },
    "FCP": { "target": 1800, "warning": 1200, "unit": "ms" }
  },
  "resources": {
    "totalPageWeight": { "target": 1500, "unit": "KB" },
    "jsBundle": { "target": 300, "unit": "KB" },
    "cssBundle": { "target": 100, "unit": "KB" },
    "imageTotal": { "target": 500, "unit": "KB" }
  },
  "pages": {
    "/": { "LCP": 2000, "CLS": 0.05 },
    "/dashboard": { "LCP": 3000, "CLS": 0.1 },
    "/checkout": { "LCP": 2500, "CLS": 0.05 }
  }
}
```

### Playwright Config Extension

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    // Enable performance tracing
    trace: 'on-first-retry',
  },
  // Custom metadata for performance budgets
  metadata: {
    performanceBudget: './performance-budget.json',
  },
});
```

---

## Core Web Vitals Measurement

### Custom Performance Fixture

```typescript
// e2e/fixtures/performance.fixture.ts
import { test as base, Page } from '@playwright/test';

type PerformanceMetrics = {
  LCP: number;
  CLS: number;
  INP: number;
  TTFB: number;
  FCP: number;
};

type PerformanceFixtures = {
  measureCWV: (page: Page) => Promise<PerformanceMetrics>;
};

export const test = base.extend<PerformanceFixtures>({
  measureCWV: async ({}, use) => {
    await use(async (page: Page) => {
      // Inject web-vitals library
      await page.addScriptTag({
        url: 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js',
      });

      // Collect metrics
      const metrics = await page.evaluate(() => {
        return new Promise<PerformanceMetrics>((resolve) => {
          const result: Partial<PerformanceMetrics> = {};
          const { onLCP, onCLS, onINP, onTTFB, onFCP } = (window as any).webVitals;

          onLCP((m: any) => { result.LCP = m.value; });
          onCLS((m: any) => { result.CLS = m.value; });
          onINP((m: any) => { result.INP = m.value; });
          onTTFB((m: any) => { result.TTFB = m.value; });
          onFCP((m: any) => { result.FCP = m.value; });

          // Wait for metrics to stabilize
          setTimeout(() => resolve(result as PerformanceMetrics), 3000);
        });
      });

      return metrics;
    });
  },
});
```

### Using the Performance Fixture

```typescript
// e2e/tests/performance/homepage-cwv.spec.ts
import { test } from '../../fixtures/performance.fixture';
import { expect } from '@playwright/test';
import budget from '../../performance-budget.json';

test.describe('Homepage Performance', () => {
  test('meets Core Web Vitals targets', async ({ page, measureCWV }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const metrics = await measureCWV(page);

    // Assert against budget
    expect(metrics.LCP).toBeLessThanOrEqual(budget.metrics.LCP.target);
    expect(metrics.CLS).toBeLessThanOrEqual(budget.metrics.CLS.target);
    expect(metrics.TTFB).toBeLessThanOrEqual(budget.metrics.TTFB.target);
    expect(metrics.FCP).toBeLessThanOrEqual(budget.metrics.FCP.target);
  });

  test('LCP element loads quickly', async ({ page }) => {
    await page.goto('/');

    const lcpTiming = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      });
    });

    expect(lcpTiming).toBeLessThan(2500);
  });
});
```

### Navigation Timing API

```typescript
// e2e/utils/perf-helpers.ts
import { Page } from '@playwright/test';

export async function getNavigationTiming(page: Page) {
  return page.evaluate(() => {
    const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      TTFB: timing.responseStart - timing.requestStart,
      FCP: performance.getEntriesByType('paint')
        .find(e => e.name === 'first-contentful-paint')?.startTime ?? 0,
      DOMContentLoaded: timing.domContentLoadedEventEnd - timing.startTime,
      Load: timing.loadEventEnd - timing.startTime,
      DNS: timing.domainLookupEnd - timing.domainLookupStart,
      TLS: timing.connectEnd - timing.secureConnectionStart,
      TransferSize: timing.transferSize,
    };
  });
}

export async function getResourceSummary(page: Page) {
  return page.evaluate(() => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const summary: Record<string, { count: number; totalSize: number }> = {};

    for (const r of resources) {
      const type = r.initiatorType;
      if (!summary[type]) summary[type] = { count: 0, totalSize: 0 };
      summary[type].count++;
      summary[type].totalSize += r.transferSize;
    }

    return summary;
  });
}
```

---

## Lighthouse CI Integration

### Installation & Configuration

```bash
npm install -D @lhci/cli
```

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/login",
        "http://localhost:3000/dashboard"
      ],
      "numberOfRuns": 3,
      "startServerCommand": "npm run start",
      "startServerReadyPattern": "ready on"
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["warn", { "minScore": 0.95 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1800 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["warn", { "maxNumericValue": 300 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### GitHub Actions Integration

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build

      - name: Run Lighthouse CI
        run: npx lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

      - name: Upload Lighthouse Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: lighthouse-report
          path: .lighthouseci/
          retention-days: 14
```

### Playwright + Lighthouse Combined

```typescript
// e2e/tests/performance/lighthouse.spec.ts
import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';

test('Lighthouse score meets threshold', async ({ page }) => {
  // Navigate first to warm up
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Run Lighthouse via CLI
  const url = page.url();
  execSync(`npx lhci collect --url="${url}" --numberOfRuns=1`, {
    stdio: 'pipe',
  });

  // Parse results
  const results = JSON.parse(
    fs.readFileSync('.lighthouseci/lhr-*.json', 'utf-8')
  );

  expect(results.categories.performance.score).toBeGreaterThanOrEqual(0.9);
  expect(results.categories.accessibility.score).toBeGreaterThanOrEqual(0.95);
});
```

---

## Performance Regression Detection

### Baseline Comparison

```typescript
// e2e/utils/perf-baseline.ts
import fs from 'fs';
import path from 'path';

const BASELINE_PATH = path.join(__dirname, '../.perf-baseline.json');
const THRESHOLD_PERCENT = 10; // Allow 10% degradation

interface PerfBaseline {
  [page: string]: {
    LCP: number;
    CLS: number;
    TTFB: number;
    FCP: number;
    timestamp: string;
  };
}

export function loadBaseline(): PerfBaseline {
  if (!fs.existsSync(BASELINE_PATH)) return {};
  return JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf-8'));
}

export function saveBaseline(data: PerfBaseline) {
  fs.writeFileSync(BASELINE_PATH, JSON.stringify(data, null, 2));
}

export function checkRegression(
  page: string,
  metric: string,
  current: number,
  baseline: PerfBaseline,
): { passed: boolean; message: string } {
  const base = baseline[page]?.[metric as keyof PerfBaseline[string]];
  if (!base || typeof base !== 'number') {
    return { passed: true, message: `No baseline for ${page}.${metric}` };
  }

  const threshold = base * (1 + THRESHOLD_PERCENT / 100);
  const passed = metric === 'CLS'
    ? current <= threshold
    : current <= threshold;

  return {
    passed,
    message: passed
      ? `${metric}: ${current}ms (baseline: ${base}ms, threshold: ${threshold}ms)`
      : `REGRESSION: ${metric}: ${current}ms exceeds threshold ${threshold}ms (baseline: ${base}ms)`,
  };
}
```

### CI Regression Workflow

```typescript
// e2e/tests/performance/regression.spec.ts
import { test, expect } from '@playwright/test';
import { getNavigationTiming } from '../../utils/perf-helpers';
import { loadBaseline, checkRegression } from '../../utils/perf-baseline';

const baseline = loadBaseline();
const PAGES = ['/', '/dashboard', '/checkout'];

for (const pagePath of PAGES) {
  test(`no performance regression on ${pagePath}`, async ({ page }) => {
    await page.goto(pagePath);
    await page.waitForLoadState('networkidle');

    const timing = await getNavigationTiming(page);

    const checks = [
      checkRegression(pagePath, 'TTFB', timing.TTFB, baseline),
      checkRegression(pagePath, 'FCP', timing.FCP, baseline),
      checkRegression(pagePath, 'Load', timing.Load, baseline),
    ];

    for (const check of checks) {
      if (!check.passed) {
        console.warn(check.message);
      }
      expect(check.passed, check.message).toBe(true);
    }
  });
}
```

---

## Resource Loading Analysis

### Bundle Size Monitoring

```typescript
// e2e/tests/performance/resources.spec.ts
import { test, expect } from '@playwright/test';
import budget from '../../performance-budget.json';

test('page resources within budget', async ({ page }) => {
  const responses: { url: string; size: number; type: string }[] = [];

  page.on('response', async (response) => {
    const url = response.url();
    const headers = response.headers();
    const size = parseInt(headers['content-length'] || '0', 10);
    const type = headers['content-type'] || '';

    responses.push({ url, size, type });
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Categorize resources
  const jsSize = responses
    .filter(r => r.type.includes('javascript'))
    .reduce((sum, r) => sum + r.size, 0);
  const cssSize = responses
    .filter(r => r.type.includes('css'))
    .reduce((sum, r) => sum + r.size, 0);
  const imageSize = responses
    .filter(r => r.type.includes('image'))
    .reduce((sum, r) => sum + r.size, 0);
  const totalSize = responses.reduce((sum, r) => sum + r.size, 0);

  // Assert against budget (KB)
  expect(jsSize / 1024).toBeLessThanOrEqual(budget.resources.jsBundle.target);
  expect(cssSize / 1024).toBeLessThanOrEqual(budget.resources.cssBundle.target);
  expect(imageSize / 1024).toBeLessThanOrEqual(budget.resources.imageTotal.target);
  expect(totalSize / 1024).toBeLessThanOrEqual(budget.resources.totalPageWeight.target);
});
```

### Request Count Monitoring

```typescript
test('no excessive API calls on page load', async ({ page }) => {
  const apiCalls: string[] = [];

  page.on('request', (request) => {
    if (request.url().includes('/api/')) {
      apiCalls.push(request.url());
    }
  });

  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');

  // Detect N+1 API call patterns
  const urlCounts = apiCalls.reduce<Record<string, number>>((acc, url) => {
    const path = new URL(url).pathname;
    acc[path] = (acc[path] || 0) + 1;
    return acc;
  }, {});

  for (const [path, count] of Object.entries(urlCounts)) {
    expect(count, `Excessive calls to ${path}: ${count}`).toBeLessThanOrEqual(3);
  }
});
```

---

## Performance Quick Reference

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| **LCP** | ≤ 2.5s | web-vitals + `page.evaluate()` |
| **CLS** | ≤ 0.1 | web-vitals + `page.evaluate()` |
| **INP** | ≤ 200ms | web-vitals + `page.evaluate()` |
| **TTFB** | ≤ 800ms | Navigation Timing API |
| **FCP** | ≤ 1.8s | Navigation Timing API |
| **Bundle (JS)** | Per budget | `page.on('response')` |
| **Total Weight** | Per budget | `page.on('response')` |

---

## Handoff to Bolt

When Voyager detects performance issues, hand off to Bolt for code-level optimization:
- See `handoff-formats.md` → `VOYAGER_TO_BOLT_HANDOFF`
- Include: metric name, measured value, target, affected page, evidence (traces/screenshots)
