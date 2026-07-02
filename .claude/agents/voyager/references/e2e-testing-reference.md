# voyager — E2Eテスト リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## FRAMEWORK SELECTION GUIDE

| Criteria | Playwright | Cypress | WebdriverIO | TestCafe |
|----------|------------|---------|-------------|----------|
| **Best for** | Cross-browser, complex flows | DX, component testing | Selenium compat, mobile | Zero-dependency |
| **Browser support** | All + mobile emulation | Chrome, Firefox, Edge | All + real mobile (Appium) | All |
| **Parallel** | Free, built-in | Paid (Cypress Cloud) | Free, built-in | Free, built-in |
| **Multi-tab/iframe** | Full support | Limited | Full support | Limited |
| **Network stubbing** | `page.route` | `cy.intercept` (excellent) | `mock` | `RequestMock` |
| **Architecture** | Out-of-process | In-browser, same-origin | WebDriver protocol | Proxy-based |
| **Learning curve** | Moderate | Low | Moderate | Low |
| **Component testing** | Experimental | Mature | Experimental | None |

### Decision Guide

```
Need cross-browser + mobile emulation? → Playwright
Need real mobile device testing (Appium)? → WebdriverIO
Team already uses Cypress? → Cypress
Need zero-dependency simplicity? → TestCafe
Starting fresh? → Playwright (recommended default)
```

See `references/playwright-patterns.md` for Playwright details.
See `references/cypress-guide.md` for Cypress details.

---

## PLAYWRIGHT 1.49+ MODERN FEATURES

| Feature | API | Use Case |
|---------|-----|----------|
| **Clock API** | `page.clock.install()` / `.fastForward()` / `.setFixedTime()` | Fake timers, animation control, date-dependent UI |
| **Soft Assertions** | `expect.configure({ soft: true })` | Collect all failures in one test run |
| **Viewport Assertions** | `expect(el).toBeInViewport()` | Lazy loading, infinite scroll verification |
| **API Testing** | `request.get()` / `request.post()` in test | Mix UI + API tests, setup via API |
| **Component Testing** | `@playwright/experimental-ct-react` | React/Vue/Svelte component tests in real browser |

See `references/playwright-patterns.md` → "Playwright 1.49+ Modern Features" for code examples.

---

## QUICK REFERENCE

### Playwright Config Essentials

```typescript
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
});
```

### Wait Strategy Quick Reference

| Need | Method |
|------|--------|
| Element visible | `await expect(locator).toBeVisible()` |
| Text content | `await expect(locator).toContainText('...')` |
| URL change | `await page.waitForURL('**/path')` |
| Network idle | `await page.waitForLoadState('networkidle')` |
| API response | `await page.waitForResponse(resp => ...)` |
| Element enabled | `await expect(locator).toBeEnabled()` |
| In viewport | `await expect(locator).toBeInViewport()` |
| ❌ Avoid | `await page.waitForTimeout(N)` |

### Performance Quick Reference

| Metric | Target | Measurement |
|--------|--------|-------------|
| **LCP** | ≤ 2.5s | web-vitals + `page.evaluate()` |
| **CLS** | ≤ 0.1 | web-vitals + `page.evaluate()` |
| **INP** | ≤ 200ms | web-vitals + `page.evaluate()` |
| **TTFB** | ≤ 800ms | Navigation Timing API |
| **Bundle Size** | Per budget | `page.on('response')` |

### Page Object Template

```typescript
export class ExamplePage extends BasePage {
  readonly element: Locator;

  constructor(page: Page) {
    super(page);
    this.element = this.getByTestId('element-id');
  }

  async goto() { await super.goto('/path'); }
  async doAction() { await this.element.click(); }
  async expectResult() { await expect(this.element).toBeVisible(); }
}
```

See `references/playwright-patterns.md` for full Page Object patterns.
See `references/visual-a11y-testing.md` for visual regression and accessibility.
See `references/ci-reporting.md` for CI/CD and reporting setup.
See `references/performance-testing.md` for CWV and Lighthouse CI.
See `references/complex-scenarios.md` for multi-tab, iframe, WebSocket patterns.
See `references/environment-management.md` for Docker and DB seeding.
See `references/debug-monitoring.md` for HAR, console, and trace debugging.
See `references/edge-cases-i18n.md` for timezone, i18n, and network simulation.

---

