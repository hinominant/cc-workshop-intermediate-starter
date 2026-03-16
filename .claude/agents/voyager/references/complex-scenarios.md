# Complex E2E Scenarios

Advanced Playwright patterns for multi-tab, iframe, file handling, WebSocket, offline mode, and other complex scenarios.

---

## Multi-Tab / Multi-Window

### New Tab via Link

```typescript
test('opens product in new tab', async ({ context, page }) => {
  await page.goto('/products');

  // Wait for popup (new tab)
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByTestId('open-in-new-tab').click(),
  ]);

  await newPage.waitForLoadState();
  await expect(newPage.getByTestId('product-detail')).toBeVisible();

  // Interact with both tabs
  await page.bringToFront();
  await expect(page.getByTestId('products-list')).toBeVisible();
});
```

### Multi-Window Interaction

```typescript
test('admin and user see real-time updates', async ({ browser }) => {
  // Create two independent contexts (different sessions)
  const adminContext = await browser.newContext({
    storageState: '.auth/admin.json',
  });
  const userContext = await browser.newContext({
    storageState: '.auth/user.json',
  });

  const adminPage = await adminContext.newPage();
  const userPage = await userContext.newPage();

  // Admin publishes content
  await adminPage.goto('/admin/posts');
  await adminPage.getByTestId('publish-btn').click();

  // User sees the update
  await userPage.goto('/feed');
  await expect(userPage.getByTestId('new-post')).toBeVisible();

  await adminContext.close();
  await userContext.close();
});
```

### OAuth Callback Flow

```typescript
test('OAuth login redirects and returns', async ({ page, context }) => {
  await page.goto('/login');

  // Click OAuth login → opens popup
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByTestId('oauth-google-btn').click(),
  ]);

  // Handle OAuth in popup
  await popup.waitForLoadState();
  await popup.getByLabel('Email').fill('test@example.com');
  await popup.getByLabel('Password').fill('password123');
  await popup.getByRole('button', { name: 'Sign in' }).click();

  // Popup closes, main page redirects
  await popup.waitForEvent('close');
  await page.waitForURL('**/dashboard');
  await expect(page.getByTestId('user-menu')).toBeVisible();
});
```

---

## Iframe Interaction

### Basic Iframe

```typescript
test('interacts with embedded form in iframe', async ({ page }) => {
  await page.goto('/embedded-form');

  // Access iframe content
  const frame = page.frameLocator('#form-iframe');

  await frame.getByLabel('Name').fill('Test User');
  await frame.getByLabel('Email').fill('test@example.com');
  await frame.getByRole('button', { name: 'Submit' }).click();

  // Verify result in iframe
  await expect(frame.getByTestId('success-message')).toBeVisible();
});
```

### Nested Iframes

```typescript
test('accesses nested iframe content', async ({ page }) => {
  await page.goto('/nested-content');

  // First level iframe
  const outerFrame = page.frameLocator('#outer-iframe');
  // Second level iframe within first
  const innerFrame = outerFrame.frameLocator('#inner-iframe');

  await expect(innerFrame.getByTestId('deep-content')).toBeVisible();
});
```

### Payment Iframe (Stripe Elements)

```typescript
test('completes payment with Stripe', async ({ page }) => {
  await page.goto('/checkout');

  // Stripe card element is in an iframe
  const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]');

  await stripeFrame.getByPlaceholder('Card number').fill('4242424242424242');
  await stripeFrame.getByPlaceholder('MM / YY').fill('12/30');
  await stripeFrame.getByPlaceholder('CVC').fill('123');
  await stripeFrame.getByPlaceholder('ZIP').fill('10001');

  // Submit payment in main page
  await page.getByTestId('pay-button').click();
  await page.waitForURL('**/confirmation');
  await expect(page.getByTestId('payment-success')).toBeVisible();
});
```

---

## File Download & Upload

### File Download

```typescript
test('downloads PDF report', async ({ page }) => {
  await page.goto('/reports');

  // Wait for download event
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByTestId('download-report').click(),
  ]);

  // Verify download
  expect(download.suggestedFilename()).toMatch(/report-.*\.pdf/);

  // Save and verify content
  const path = await download.path();
  expect(path).toBeTruthy();

  // Verify file size (basic check)
  const fs = await import('fs');
  const stats = fs.statSync(path!);
  expect(stats.size).toBeGreaterThan(1024); // At least 1KB
});
```

### PDF Generation Verification

```typescript
test('generated PDF has correct content', async ({ page }) => {
  await page.goto('/invoice/123');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByTestId('export-pdf').click(),
  ]);

  const path = await download.path();
  // Use pdf-parse or similar library for content verification
  const { default: pdfParse } = await import('pdf-parse');
  const fs = await import('fs');
  const buffer = fs.readFileSync(path!);
  const data = await pdfParse(buffer);

  expect(data.text).toContain('Invoice #123');
  expect(data.numpages).toBeGreaterThanOrEqual(1);
});
```

### File Upload

```typescript
test('uploads profile image', async ({ page }) => {
  await page.goto('/settings/profile');

  // Upload via file input
  const fileInput = page.getByTestId('avatar-upload');
  await fileInput.setInputFiles('e2e/fixtures/test-avatar.png');

  // Wait for upload and preview
  await expect(page.getByTestId('avatar-preview')).toBeVisible();
  await page.getByTestId('save-profile').click();
  await expect(page.getByTestId('upload-success')).toBeVisible();
});

test('rejects oversized file', async ({ page }) => {
  await page.goto('/settings/profile');

  // Upload large file
  const fileInput = page.getByTestId('avatar-upload');
  await fileInput.setInputFiles('e2e/fixtures/large-image-10mb.png');

  await expect(page.getByTestId('file-size-error')).toBeVisible();
});
```

### Drag and Drop Upload

```typescript
test('uploads file via drag and drop', async ({ page }) => {
  await page.goto('/documents');

  // Create a file buffer
  const buffer = Buffer.from('Test document content');

  // Dispatch drop event
  const dropZone = page.getByTestId('drop-zone');
  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());

  await page.dispatchEvent('[data-testid="drop-zone"]', 'drop', {
    dataTransfer,
  });

  // Alternative: use setInputFiles on hidden input
  const input = page.locator('input[type="file"]');
  await input.setInputFiles({
    name: 'test.txt',
    mimeType: 'text/plain',
    buffer,
  });
});
```

---

## WebSocket Testing

### WebSocket Message Monitoring

```typescript
test('receives real-time chat messages', async ({ page }) => {
  const wsMessages: string[] = [];

  // Monitor WebSocket frames
  page.on('websocket', (ws) => {
    ws.on('framereceived', (frame) => {
      if (typeof frame.payload === 'string') {
        wsMessages.push(frame.payload);
      }
    });
  });

  await page.goto('/chat');

  // Send a message
  await page.getByTestId('message-input').fill('Hello!');
  await page.getByTestId('send-btn').click();

  // Verify WebSocket received the echo
  await expect.poll(() => wsMessages.length).toBeGreaterThan(0);
  expect(wsMessages.some(m => m.includes('Hello!'))).toBe(true);
});
```

### WebSocket Connection / Disconnection

```typescript
test('handles WebSocket disconnection gracefully', async ({ page, context }) => {
  await page.goto('/live-dashboard');
  await expect(page.getByTestId('connection-status')).toHaveText('Connected');

  // Simulate offline → WebSocket drops
  await context.setOffline(true);
  await expect(page.getByTestId('connection-status')).toHaveText('Disconnected');
  await expect(page.getByTestId('reconnect-banner')).toBeVisible();

  // Reconnect
  await context.setOffline(false);
  await expect(page.getByTestId('connection-status')).toHaveText('Connected');
});
```

---

## Offline Mode / ServiceWorker

### Offline Testing

```typescript
test('shows offline page when network is down', async ({ page, context }) => {
  // Load page and cache ServiceWorker assets
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Go offline
  await context.setOffline(true);

  // Navigate to cached page
  await page.goto('/cached-page');
  await expect(page.getByTestId('offline-indicator')).toBeVisible();
  await expect(page.getByTestId('cached-content')).toBeVisible();

  // Non-cached page shows offline message
  await page.goto('/uncached-page');
  await expect(page.getByTestId('offline-message')).toBeVisible();

  // Restore network
  await context.setOffline(false);
});
```

### ServiceWorker Verification

```typescript
test('ServiceWorker caches critical resources', async ({ page, context }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Check ServiceWorker registration
  const swRegistered = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    return !!registration?.active;
  });
  expect(swRegistered).toBe(true);

  // Verify critical resources are cached
  const cachedUrls = await page.evaluate(async () => {
    const cache = await caches.open('app-cache-v1');
    const keys = await cache.keys();
    return keys.map(r => new URL(r.url).pathname);
  });

  expect(cachedUrls).toContain('/');
  expect(cachedUrls).toContain('/offline.html');
});
```

---

## Geolocation / Permissions

```typescript
test('shows nearby stores based on location', async ({ context }) => {
  // Grant geolocation permission
  await context.grantPermissions(['geolocation']);

  const page = await context.newPage();

  // Set geolocation to Tokyo
  await context.setGeolocation({ latitude: 35.6762, longitude: 139.6503 });

  await page.goto('/store-locator');
  await expect(page.getByTestId('nearby-stores')).toBeVisible();
  await expect(page.getByText('Tokyo')).toBeVisible();

  // Change to Osaka
  await context.setGeolocation({ latitude: 34.6937, longitude: 135.5023 });
  await page.getByTestId('refresh-location').click();
  await expect(page.getByText('Osaka')).toBeVisible();
});
```

---

## Drag and Drop / Clipboard

### Drag and Drop (Kanban)

```typescript
test('moves card between columns in Kanban board', async ({ page }) => {
  await page.goto('/board');

  const card = page.getByTestId('card-1');
  const targetColumn = page.getByTestId('column-done');

  // Drag card to Done column
  await card.dragTo(targetColumn);

  // Verify card moved
  await expect(targetColumn.getByTestId('card-1')).toBeVisible();
});
```

### Clipboard Operations

```typescript
test('copies invite link to clipboard', async ({ page, context }) => {
  // Grant clipboard permission
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  await page.goto('/settings/team');
  await page.getByTestId('copy-invite-link').click();

  // Read clipboard
  const clipboardText = await page.evaluate(() =>
    navigator.clipboard.readText()
  );

  expect(clipboardText).toMatch(/https:\/\/.*\/invite\/.+/);
});
```

---

## Shadow DOM

### Web Components Testing

```typescript
test('interacts with Shadow DOM elements', async ({ page }) => {
  await page.goto('/web-components');

  // Playwright pierces open Shadow DOM by default
  const shadowButton = page.locator('my-component').getByRole('button');
  await shadowButton.click();

  // For closed Shadow DOM, use evaluate
  const value = await page.evaluate(() => {
    const el = document.querySelector('my-closed-component');
    const shadow = (el as any).__shadow;
    return shadow.querySelector('input').value;
  });

  expect(value).toBe('expected-value');
});
```

---

## Cloud Testing Services

### BrowserStack Integration

```typescript
// playwright.config.ts (BrowserStack)
export default defineConfig({
  projects: [
    {
      name: 'browserstack-chrome',
      use: {
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
            JSON.stringify({
              browser: 'chrome',
              browser_version: 'latest',
              os: 'Windows',
              os_version: '11',
              'browserstack.username': process.env.BROWSERSTACK_USERNAME,
              'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
            })
          )}`,
        },
      },
    },
  ],
});
```

### Sauce Labs Integration

```typescript
// playwright.config.ts (Sauce Labs)
export default defineConfig({
  projects: [
    {
      name: 'saucelabs',
      use: {
        connectOptions: {
          wsEndpoint: `wss://ondemand.saucelabs.com/playwright?caps=${encodeURIComponent(
            JSON.stringify({
              browserName: 'chromium',
              'sauce:options': {
                username: process.env.SAUCE_USERNAME,
                accessKey: process.env.SAUCE_ACCESS_KEY,
              },
            })
          )}`,
        },
      },
    },
  ],
});
```
