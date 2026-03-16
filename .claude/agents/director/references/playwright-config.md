# Playwright Configuration for Demo Recording

Configuration guide for demo video recording with Playwright.

---

## Basic Configuration

### Demo-Dedicated Configuration File

```typescript
// playwright.config.demo.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // === Test Settings ===
  testDir: './demos/specs',
  timeout: 120000,         // 2 minutes (demos can be long)
  retries: 0,              // Demos should be deterministic
  workers: 1,              // Sequential execution for consistent timing

  // === Reporters ===
  reporter: [
    ['list'],
    ['html', { outputFolder: 'demos/report' }],
  ],

  // === Common Settings ===
  use: {
    // Browser launch options
    launchOptions: {
      slowMo: 500,         // 500ms: Human-followable pace
    },

    // Video recording
    video: {
      mode: 'on',          // Always record
      size: { width: 1280, height: 720 },
    },

    // Viewport
    viewport: { width: 1280, height: 720 },

    // Trace not needed for demos
    trace: 'off',
    screenshot: 'off',

    // Base URL
    baseURL: process.env.DEMO_BASE_URL || 'http://localhost:3000',
  },

  // === Projects ===
  projects: [
    {
      name: 'demo-desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'demo-desktop-hd',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        video: { mode: 'on', size: { width: 1920, height: 1080 } },
      },
    },
    {
      name: 'demo-mobile',
      use: {
        ...devices['iPhone 12'],
        launchOptions: { slowMo: 600 },  // Slightly slower for mobile
      },
    },
    {
      name: 'demo-tablet',
      use: {
        ...devices['iPad Pro 11'],
        launchOptions: { slowMo: 550 },
      },
    },
  ],

  // === Output Directory ===
  outputDir: 'demos/output',
});
```

---

## Device-Specific Project Settings

### Desktop Settings

```typescript
{
  name: 'demo-desktop',
  use: {
    ...devices['Desktop Chrome'],
    viewport: { width: 1280, height: 720 },
    launchOptions: {
      slowMo: 500,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-infobars',
      ],
    },
    video: {
      mode: 'on',
      size: { width: 1280, height: 720 },
    },
  },
}
```

### Mobile Settings

```typescript
{
  name: 'demo-mobile-ios',
  use: {
    ...devices['iPhone 12'],
    launchOptions: { slowMo: 600 },
    video: {
      mode: 'on',
      size: { width: 390, height: 844 },
    },
    // Touch operation visualization
    hasTouch: true,
  },
}

{
  name: 'demo-mobile-android',
  use: {
    ...devices['Pixel 5'],
    launchOptions: { slowMo: 600 },
    video: {
      mode: 'on',
      size: { width: 393, height: 851 },
    },
  },
}
```

### Tablet Settings

```typescript
{
  name: 'demo-tablet',
  use: {
    ...devices['iPad Pro 11'],
    launchOptions: { slowMo: 550 },
    video: {
      mode: 'on',
      size: { width: 834, height: 1194 },
    },
  },
}
```

---

## Video Recording Settings

### Video Modes

| Mode | Use Case | File Generation |
|------|----------|-----------------|
| `'on'` | Always record | Video for all tests |
| `'retain-on-failure'` | Only on failure | For debugging |
| `'on-first-retry'` | On retry | For CI (not used in demos) |
| `'off'` | No recording | Development/debugging |

### Resolution Settings

| Resolution | Use Case | Approx. File Size |
|------------|----------|-------------------|
| 1280x720 (720p) | Standard demo, web embedding | ~5MB for 30s |
| 1920x1080 (1080p) | High quality, presentations | ~10MB for 30s |
| 375x667 | iPhone SE mobile demo | ~3MB for 30s |
| 390x844 | iPhone 12/13 | ~4MB for 30s |

### Codec Settings

Playwright's default codec is VP8 (WebM).
To change, specify via environment variable:

```bash
# VP9 (higher compression)
PLAYWRIGHT_VIDEO_CODEC=vp9 npx playwright test --config=playwright.config.demo.ts
```

---

## slowMo Configuration Guide

### slowMo Values by Use Case

| Use Case | slowMo (ms) | Description |
|----------|-------------|-------------|
| Quick demo | 300 | For experienced users |
| Standard demo | 500 | General demo |
| Beginner-focused | 700 | Show slowly and carefully |
| Form-heavy | 600-700 | Show input content |
| Presentation | 800-1000 | Explain while showing |

### Dynamic slowMo Adjustment

```typescript
// Change speed only for specific operations
test('demo emphasizing form input', async ({ page }) => {
  // Normal speed for navigation
  await page.goto('/signup');

  // Slow for form input (adjust with manual wait)
  await page.getByLabel('Name').fill('Demo User');
  await page.waitForTimeout(500); // Additional wait

  await page.getByLabel('Email').fill('demo@example.com');
  await page.waitForTimeout(500);

  // Normal speed for button click
  await page.getByRole('button', { name: 'Register' }).click();
});
```

---

## Output File Naming Conventions

### Automatic Naming (Playwright Default)

```
demos/output/
├── demo-login-Demo-Login-Flow-shows-complete-login-experience/
│   └── video.webm
└── demo-checkout-Demo-Purchase-Flow-add-product-to-cart/
    └── video.webm
```

### Custom Naming

```typescript
// demos/specs/demo-login.spec.ts
test.afterEach(async ({ page }, testInfo) => {
  const video = page.video();
  if (video) {
    const originalPath = await video.path();
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const newName = `login_flow_${date}.webm`;
    const newPath = `demos/output/${newName}`;

    // Rename video
    await video.saveAs(newPath);

    // Attach to test results
    await testInfo.attach('demo-video', {
      path: newPath,
      contentType: 'video/webm',
    });
  }
});
```

### Naming Convention

| Pattern | Example | Use Case |
|---------|---------|----------|
| `[feature]_[action]_[date].webm` | `login_success_20250203.webm` | Feature demo |
| `[feature]_mobile_[date].webm` | `checkout_mobile_20250203.webm` | Mobile demo |
| `onboarding_step[N]_[date].webm` | `onboarding_step1_20250203.webm` | Onboarding |
| `release_v[version]_[feature].webm` | `release_v2.0_newui.webm` | Release introduction |

---

## Environment Variables

### Required Environment Variables

```bash
# .env.demo
DEMO_BASE_URL=http://localhost:3000
DEMO_USER_EMAIL=demo@example.com
DEMO_USER_PASSWORD=DemoPass123
```

### Usage in Configuration File

```typescript
// playwright.config.demo.ts
import dotenv from 'dotenv';
dotenv.config({ path: '.env.demo' });

export default defineConfig({
  use: {
    baseURL: process.env.DEMO_BASE_URL,
  },
});
```

---

## CI/CD Configuration

### Demo Recording with GitHub Actions

```yaml
# .github/workflows/demo-recording.yml
name: Record Demo Videos

on:
  workflow_dispatch:
    inputs:
      feature:
        description: 'Feature to demo'
        required: true
        default: 'all'

jobs:
  record:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Start application
        run: npm run dev &
        env:
          NODE_ENV: demo

      - name: Wait for app
        run: npx wait-on http://localhost:3000

      - name: Record demos
        run: npx playwright test --config=playwright.config.demo.ts
        env:
          DEMO_BASE_URL: http://localhost:3000

      - name: Upload demo videos
        uses: actions/upload-artifact@v4
        with:
          name: demo-videos
          path: demos/output/**/*.webm
          retention-days: 30
```

---

## Troubleshooting

### Video Not Generated

```typescript
// Ensure context.close() is called
test.afterEach(async ({ page }) => {
  // Video is finalized after context.close()
  await page.close();
});
```

### Video Cut Off Midway

```typescript
// Add sufficient wait before test ends
test('record until the end', async ({ page }) => {
  // ... operations ...

  // Add wait at end to ensure complete recording
  await page.waitForTimeout(1000);
});
```

### Video is Choppy

```bash
# Disable GPU in headless mode
npx playwright test --headed=false --config=playwright.config.demo.ts
```

### File Size Too Large

```typescript
// Lower resolution
video: {
  mode: 'on',
  size: { width: 854, height: 480 }, // 480p
}
```

---

## Best Practices

### 1. Use Dedicated Configuration File

```bash
# Normal tests
npx playwright test

# Demo recording
npx playwright test --config=playwright.config.demo.ts
```

### 2. Demo-Dedicated Directory

```
demos/
├── specs/           # Demo test files
├── helpers/         # Helper functions
├── fixtures/        # Test data, images
├── output/          # Generated videos
└── report/          # HTML reports
```

### 3. Separate from Normal E2E Tests

```typescript
// playwright.config.ts (for normal tests)
testDir: './e2e',
video: 'retain-on-failure',

// playwright.config.demo.ts (for demos)
testDir: './demos/specs',
video: 'on',
```

### 4. Separate Environments

```bash
# Local development
DEMO_BASE_URL=http://localhost:3000

# Staging
DEMO_BASE_URL=https://staging.example.com
```
