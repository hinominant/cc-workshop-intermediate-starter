# Visual Regression & Accessibility Testing

Screenshot comparison, axe-core integration, keyboard navigation, and WCAG compliance verification.

---

## Visual Regression Testing

### Snapshot Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,           // Allow small differences
      threshold: 0.2,               // Pixel comparison threshold
      animations: 'disabled',       // Disable animations for consistency
    },
  },
  updateSnapshots: process.env.UPDATE_SNAPSHOTS ? 'all' : 'missing',
});
```

### Visual Test Examples

```typescript
// e2e/tests/visual/homepage.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('homepage matches snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Full page screenshot
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
    });
  });

  test('login form matches snapshot', async ({ page }) => {
    await page.goto('/login');

    // Element screenshot
    const form = page.getByTestId('login-form');
    await expect(form).toHaveScreenshot('login-form.png');
  });

  test('responsive: mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage-mobile.png');
  });
});
```

### Snapshot Update Commands

```bash
# Update all snapshots
npx playwright test --update-snapshots

# Update specific test snapshots
npx playwright test visual/homepage.spec.ts --update-snapshots
```

### Visual Regression Best Practices

| Practice | Description |
|----------|-------------|
| **Disable animations** | Set `animations: 'disabled'` in config |
| **Wait for networkidle** | Ensure all resources loaded before screenshot |
| **Use element screenshots** | More stable than full-page for component changes |
| **Set explicit viewport** | Avoid viewport-dependent diffs |
| **Mock dynamic content** | Dates, random data, ads cause false positives |
| **Use `maxDiffPixels`** | Allow tolerance for anti-aliasing differences |

---

## Accessibility Testing (axe-core + Playwright)

### Setup

```typescript
// e2e/utils/a11y-helpers.ts
import { Page, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export async function checkA11y(page: Page, options?: {
  includedImpacts?: ('critical' | 'serious' | 'moderate' | 'minor')[];
  disableRules?: string[];
}) {
  const axeBuilder = new AxeBuilder({ page });

  if (options?.disableRules) {
    axeBuilder.disableRules(options.disableRules);
  }

  const results = await axeBuilder.analyze();

  const violations = options?.includedImpacts
    ? results.violations.filter(v => options.includedImpacts!.includes(v.impact as any))
    : results.violations;

  expect(violations, `Accessibility violations found:\n${formatViolations(violations)}`).toHaveLength(0);
}

function formatViolations(violations: any[]): string {
  return violations
    .map(v => `- ${v.id} (${v.impact}): ${v.description}\n  ${v.nodes.length} elements affected`)
    .join('\n');
}
```

### A11y Test Examples

```typescript
// e2e/tests/a11y/pages.spec.ts
import { test, expect } from '@playwright/test';
import { checkA11y } from '../../utils/a11y-helpers';

test.describe('Accessibility', () => {
  test('homepage has no critical a11y violations', async ({ page }) => {
    await page.goto('/');
    await checkA11y(page, { includedImpacts: ['critical', 'serious'] });
  });

  test('login form is accessible', async ({ page }) => {
    await page.goto('/login');

    // Check form elements have labels
    await expect(page.getByLabel('メールアドレス')).toBeVisible();
    await expect(page.getByLabel('パスワード')).toBeVisible();

    // Run axe check
    await checkA11y(page);
  });
});
```

### Keyboard Navigation Testing

```typescript
test('navigation is keyboard accessible', async ({ page }) => {
  await page.goto('/');

  // Tab through navigation
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'ホーム' })).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: '製品' })).toBeFocused();

  // Enter key activates link
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/.*products/);
});

test('modal traps focus correctly', async ({ page }) => {
  await page.goto('/products');
  await page.getByTestId('open-modal').click();

  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible();

  // Focus should be inside modal
  const focusedElement = page.locator(':focus');
  await expect(focusedElement).toBeAttached();

  // Escape closes modal
  await page.keyboard.press('Escape');
  await expect(modal).toBeHidden();
});
```

### A11y Rules Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  metadata: {
    a11y: {
      // Skip rules for known issues (document why)
      disableRules: [
        // 'color-contrast', // Tracked in JIRA-123
      ],
      includedImpacts: ['critical', 'serious'],
    },
  },
});
```

### WCAG Compliance Checklist

| Level | Rule | Test Approach |
|-------|------|---------------|
| **A** | Non-text content has alt text | `axe-core` auto-check |
| **A** | Keyboard accessible | Manual tab testing |
| **A** | Focus order is logical | Tab sequence test |
| **A** | Color is not sole indicator | Visual + axe check |
| **AA** | Color contrast ≥ 4.5:1 | `axe-core` auto-check |
| **AA** | Text resizable to 200% | Viewport zoom test |
| **AA** | Focus visible | CSS `:focus-visible` check |
| **AA** | Error identification | Form validation test |
