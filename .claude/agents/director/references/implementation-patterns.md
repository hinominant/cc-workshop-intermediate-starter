# Implementation Patterns

Playwright implementation patterns for demo video recording.

---

## Basic Test Structure

### Standard Demo Test

```typescript
// demos/specs/demo-login.spec.ts
import { test, expect } from '@playwright/test';
import { showOverlay, waitForTransition } from '../helpers/overlay';
import { prepareAuthState } from '../helpers/auth';
import { DemoData } from '../helpers/data';

test.describe('Demo: Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from clean state
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('shows complete login experience', async ({ page }) => {
    // === Scene 1: Opening ===
    await showOverlay(page, 'Let\'s log in', 2000);

    // === Scene 2: Form Input ===
    await page.getByRole('link', { name: 'Login' }).click();
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await page.waitForTimeout(500);

    // Email input
    await page.getByLabel('Email').fill(DemoData.user.email);
    await page.waitForTimeout(300);

    // Password input
    await page.getByLabel('Password').fill(DemoData.user.password);
    await page.waitForTimeout(300);

    // === Scene 3: Submit ===
    await showOverlay(page, 'Click login button', 1500);
    await page.getByRole('button', { name: 'Login' }).click();

    // === Scene 4: Result Display ===
    await expect(page.getByTestId('dashboard')).toBeVisible();
    await showOverlay(page, 'Login complete!', 2000);
  });
});
```

---

## Authentication Patterns

### Pattern 1: API-based Pre-authentication

```typescript
// demos/helpers/auth.ts
import { Page, BrowserContext } from '@playwright/test';

export async function loginViaApi(context: BrowserContext): Promise<void> {
  const response = await context.request.post('/api/auth/login', {
    data: {
      email: 'demo@example.com',
      password: 'DemoPass123',
    },
  });

  if (!response.ok()) {
    throw new Error('Demo login failed');
  }
}

// Usage
test.beforeEach(async ({ context, page }) => {
  await loginViaApi(context);
  await page.goto('/dashboard');
});
```

### Pattern 2: LocalStorage-based

```typescript
// demos/helpers/auth.ts
export async function setAuthState(page: Page, token: string): Promise<void> {
  await page.evaluate((t) => {
    localStorage.setItem('auth_token', t);
  }, token);
}

// Usage
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await setAuthState(page, 'demo-jwt-token');
  await page.reload();
});
```

### Pattern 3: Storage State File

```typescript
// demos/auth.setup.ts
import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '.auth/demo-user.json');

setup('authenticate demo user', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('demo@example.com');
  await page.getByLabel('Password').fill('DemoPass123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/dashboard');
  await page.context().storageState({ path: authFile });
});

// Use in playwright.config.demo.ts
projects: [
  { name: 'setup', testMatch: /.*\.setup\.ts/ },
  {
    name: 'demo-authenticated',
    use: { storageState: '.auth/demo-user.json' },
    dependencies: ['setup'],
  },
]
```

---

## File Upload Pattern

### Image Upload Demo

```typescript
// demos/specs/demo-upload.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test('shows profile image upload', async ({ page }) => {
  await page.goto('/profile/edit');

  // Focus on upload button
  await showOverlay(page, 'Changing profile image', 2000);

  // File selection
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(path.join(__dirname, '../fixtures/avatar.png'));

  // Wait for preview display
  await expect(page.getByAltText('Preview')).toBeVisible();
  await page.waitForTimeout(1000);

  // Save
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Saved')).toBeVisible();

  await showOverlay(page, 'Image updated!', 2000);
});
```

---

## Smooth Scroll Pattern

### Natural Scroll Behavior

```typescript
// demos/helpers/scroll.ts
import { Page } from '@playwright/test';

export async function smoothScrollTo(
  page: Page,
  selector: string,
  options: { duration?: number; position?: 'center' | 'start' | 'end' } = {}
): Promise<void> {
  const { duration = 500, position = 'center' } = options;

  await page.evaluate(
    ({ sel, dur, pos }) => {
      const element = document.querySelector(sel);
      if (!element) return;

      const block = pos === 'center' ? 'center' : pos === 'start' ? 'start' : 'end';

      element.scrollIntoView({
        behavior: 'smooth',
        block,
      });

      return new Promise((resolve) => setTimeout(resolve, dur));
    },
    { sel: selector, dur: duration, pos: position }
  );

  await page.waitForTimeout(duration);
}

// Usage
test('shows long page scroll', async ({ page }) => {
  await page.goto('/features');
  await page.waitForTimeout(1000);

  await showOverlay(page, 'Let\'s look at the main features', 1500);

  // Smooth scroll to feature sections
  await smoothScrollTo(page, '#feature-1', { duration: 800 });
  await page.waitForTimeout(1000);

  await smoothScrollTo(page, '#feature-2', { duration: 800 });
  await page.waitForTimeout(1000);

  await smoothScrollTo(page, '#feature-3', { duration: 800 });
  await page.waitForTimeout(1000);
});
```

---

## Overlay Helper Functions

### Complete Overlay System

```typescript
// demos/helpers/overlay.ts
import { Page } from '@playwright/test';

interface OverlayOptions {
  position?: 'top' | 'center' | 'bottom';
  style?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

const styleColors = {
  info: 'rgba(0, 0, 0, 0.85)',
  success: 'rgba(16, 185, 129, 0.9)',
  warning: 'rgba(245, 158, 11, 0.9)',
  error: 'rgba(239, 68, 68, 0.9)',
};

const positionStyles = {
  top: 'top: 20px; left: 50%; transform: translateX(-50%);',
  center: 'top: 50%; left: 50%; transform: translate(-50%, -50%);',
  bottom: 'bottom: 20px; left: 50%; transform: translateX(-50%);',
};

export async function showOverlay(
  page: Page,
  message: string,
  options: OverlayOptions | number = {}
): Promise<void> {
  // If number is passed, treat as duration
  const opts: OverlayOptions =
    typeof options === 'number' ? { duration: options } : options;

  const { position = 'bottom', style = 'info', duration = 2000 } = opts;

  await page.evaluate(
    ({ msg, pos, styleColor, dur }) => {
      // Remove existing overlay
      const existing = document.getElementById('demo-overlay');
      if (existing) existing.remove();

      const overlay = document.createElement('div');
      overlay.id = 'demo-overlay';
      overlay.style.cssText = `
        position: fixed;
        ${pos}
        background: ${styleColor};
        color: white;
        padding: 16px 32px;
        border-radius: 8px;
        font-size: 18px;
        font-weight: 500;
        z-index: 99999;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        animation: demoFadeIn 0.3s ease-out;
      `;

      // Animation definition
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        @keyframes demoFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes demoFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `;
      document.head.appendChild(styleSheet);

      overlay.textContent = msg;
      document.body.appendChild(overlay);

      // Fade out and remove
      setTimeout(() => {
        overlay.style.animation = 'demoFadeOut 0.3s ease-out forwards';
        setTimeout(() => {
          overlay.remove();
          styleSheet.remove();
        }, 300);
      }, dur - 300);
    },
    { msg: message, pos: positionStyles[position], styleColor: styleColors[style], dur: duration }
  );

  await page.waitForTimeout(duration);
}

// Convenient shortcuts
export async function showSuccess(page: Page, message: string, duration = 2000): Promise<void> {
  await showOverlay(page, message, { style: 'success', duration });
}

export async function showError(page: Page, message: string, duration = 2000): Promise<void> {
  await showOverlay(page, message, { style: 'error', duration });
}

export async function showStep(page: Page, step: number, total: number, message: string): Promise<void> {
  await showOverlay(page, `Step ${step}/${total}: ${message}`, {
    position: 'top',
    duration: 2500,
  });
}
```

---

## Element Highlight Pattern

### Emphasize Specific Element

```typescript
// demos/helpers/highlight.ts
import { Page } from '@playwright/test';

export async function highlightElement(
  page: Page,
  selector: string,
  options: { duration?: number; color?: string; label?: string } = {}
): Promise<void> {
  const { duration = 2000, color = '#3b82f6', label } = options;

  await page.evaluate(
    ({ sel, dur, col, lbl }) => {
      const element = document.querySelector(sel);
      if (!element) return;

      const rect = element.getBoundingClientRect();

      // Highlight box
      const highlight = document.createElement('div');
      highlight.id = 'demo-highlight';
      highlight.style.cssText = `
        position: fixed;
        top: ${rect.top - 4}px;
        left: ${rect.left - 4}px;
        width: ${rect.width + 8}px;
        height: ${rect.height + 8}px;
        border: 3px solid ${col};
        border-radius: 8px;
        z-index: 99998;
        pointer-events: none;
        animation: demoPulse 1s ease-in-out infinite;
      `;

      // Label (optional)
      if (lbl) {
        const labelEl = document.createElement('div');
        labelEl.style.cssText = `
          position: fixed;
          top: ${rect.top - 30}px;
          left: ${rect.left}px;
          background: ${col};
          color: white;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 14px;
          z-index: 99999;
        `;
        labelEl.textContent = lbl;
        document.body.appendChild(labelEl);

        setTimeout(() => labelEl.remove(), dur);
      }

      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        @keyframes demoPulse {
          0%, 100% { box-shadow: 0 0 0 0 ${col}40; }
          50% { box-shadow: 0 0 0 10px ${col}00; }
        }
      `;
      document.head.appendChild(styleSheet);

      document.body.appendChild(highlight);

      setTimeout(() => {
        highlight.remove();
        styleSheet.remove();
      }, dur);
    },
    { sel: selector, dur: duration, col: color, lbl: label }
  );

  await page.waitForTimeout(duration);
}

// Usage
test('highlight button with explanation', async ({ page }) => {
  await page.goto('/dashboard');

  await highlightElement(page, '[data-testid="create-button"]', {
    label: 'Click here!',
    duration: 2500,
  });
});
```

---

## Mouse Cursor Simulation

### Visual Mouse Movement

```typescript
// demos/helpers/cursor.ts
import { Page } from '@playwright/test';

export async function showCursor(page: Page): Promise<void> {
  await page.evaluate(() => {
    const cursor = document.createElement('div');
    cursor.id = 'demo-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: rgba(59, 130, 246, 0.5);
      border: 2px solid #3b82f6;
      border-radius: 50%;
      z-index: 99999;
      pointer-events: none;
      transform: translate(-50%, -50%);
      transition: all 0.1s ease-out;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
      cursor.style.background = 'rgba(59, 130, 246, 0.8)';
    });

    document.addEventListener('mouseup', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.background = 'rgba(59, 130, 246, 0.5)';
    });
  });
}

export async function hideCursor(page: Page): Promise<void> {
  await page.evaluate(() => {
    const cursor = document.getElementById('demo-cursor');
    if (cursor) cursor.remove();
  });
}

// Usage
test('demo with cursor display', async ({ page }) => {
  await page.goto('/');
  await showCursor(page);

  // Cursor displayed for subsequent operations
  await page.click('#login-button');
  // ...
});
```

---

## Visual Interaction Feedback System

Visual feedback for user interactions during demo recording. These helpers enhance the viewer's understanding of what's happening on screen by providing clear visual cues for clicks, taps, swipes, and keyboard input.

### Overview

| Effect | Use Case | Default Duration |
|--------|----------|------------------|
| Click Ripple | Desktop click visualization | 600ms |
| Tap Indicator | Mobile/tablet touch feedback | 500ms |
| Swipe Trail | Swipe gesture visualization | 800ms |
| Keystroke Overlay | Keyboard shortcut display | 1500ms |

### Click Ripple Effect

Material Design-inspired ripple effect for mouse clicks.

```typescript
// demos/helpers/interaction-feedback.ts
import { Page } from '@playwright/test';

interface ClickRippleOptions {
  duration?: number;
  color?: string;
  maxRadius?: number;
}

export async function showClickRipple(
  page: Page,
  x: number,
  y: number,
  options: ClickRippleOptions = {}
): Promise<void> {
  const { duration = 600, color = 'rgba(59, 130, 246, 0.6)', maxRadius = 50 } = options;

  await page.evaluate(
    ({ x, y, dur, col, radius }) => {
      const ripple = document.createElement('div');
      ripple.id = 'demo-click-ripple';
      ripple.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: radial-gradient(circle, ${col} 0%, transparent 70%);
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 99998;
      `;

      const styleSheet = document.createElement('style');
      styleSheet.id = 'demo-ripple-style';
      styleSheet.textContent = `
        @keyframes demoRippleExpand {
          0% {
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            width: ${radius * 2}px;
            height: ${radius * 2}px;
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(styleSheet);

      ripple.style.animation = `demoRippleExpand ${dur}ms ease-out forwards`;
      document.body.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
        styleSheet.remove();
      }, dur);
    },
    { x, y, dur: duration, col: color, radius: maxRadius }
  );

  await page.waitForTimeout(duration);
}

// Usage
test('demo with click ripple', async ({ page }) => {
  await page.goto('/dashboard');

  const button = page.getByRole('button', { name: 'Submit' });
  const box = await button.boundingBox();
  if (box) {
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    await showClickRipple(page, centerX, centerY);
    await button.click();
  }
});
```

### Touch Tap Indicator

Pulsing circular indicator for mobile touch interactions.

```typescript
// demos/helpers/interaction-feedback.ts

interface TapIndicatorOptions {
  duration?: number;
  radius?: number;
  color?: string;
}

export async function showTapIndicator(
  page: Page,
  x: number,
  y: number,
  options: TapIndicatorOptions = {}
): Promise<void> {
  const { duration = 500, radius = 30, color = 'rgba(59, 130, 246, 0.8)' } = options;

  await page.evaluate(
    ({ x, y, dur, rad, col }) => {
      const tap = document.createElement('div');
      tap.id = 'demo-tap-indicator';
      tap.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${rad * 2}px;
        height: ${rad * 2}px;
        border: 3px solid ${col};
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        pointer-events: none;
        z-index: 99998;
        box-sizing: border-box;
      `;

      const styleSheet = document.createElement('style');
      styleSheet.id = 'demo-tap-style';
      styleSheet.textContent = `
        @keyframes demoTapPulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.0);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(styleSheet);

      tap.style.animation = `demoTapPulse ${dur}ms ease-out forwards`;
      document.body.appendChild(tap);

      setTimeout(() => {
        tap.remove();
        styleSheet.remove();
      }, dur);
    },
    { x, y, dur: duration, rad: radius, col: color }
  );

  await page.waitForTimeout(duration);
}

// Usage for mobile demos
test('mobile tap demo', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); // iPhone 14 Pro

  const menuButton = page.getByTestId('mobile-menu');
  const box = await menuButton.boundingBox();
  if (box) {
    await showTapIndicator(page, box.x + box.width / 2, box.y + box.height / 2);
    await menuButton.tap();
  }
});
```

### Swipe Trail Visualization

SVG-based arrow line showing swipe direction.

```typescript
// demos/helpers/interaction-feedback.ts

interface SwipeTrailOptions {
  duration?: number;
  color?: string;
  strokeWidth?: number;
  showArrow?: boolean;
}

export async function showSwipeTrail(
  page: Page,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  options: SwipeTrailOptions = {}
): Promise<void> {
  const {
    duration = 800,
    color = 'rgba(59, 130, 246, 0.8)',
    strokeWidth = 4,
    showArrow = true,
  } = options;

  await page.evaluate(
    ({ sx, sy, ex, ey, dur, col, sw, arrow }) => {
      // Calculate dimensions
      const padding = 20;
      const minX = Math.min(sx, ex) - padding;
      const minY = Math.min(sy, ey) - padding;
      const width = Math.abs(ex - sx) + padding * 2;
      const height = Math.abs(ey - sy) + padding * 2;

      // Adjust coordinates relative to SVG
      const x1 = sx - minX;
      const y1 = sy - minY;
      const x2 = ex - minX;
      const y2 = ey - minY;

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.id = 'demo-swipe-trail';
      svg.setAttribute('width', String(width));
      svg.setAttribute('height', String(height));
      svg.style.cssText = `
        position: fixed;
        left: ${minX}px;
        top: ${minY}px;
        pointer-events: none;
        z-index: 99998;
        overflow: visible;
      `;

      // Arrow marker definition
      if (arrow) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', 'demo-arrow');
        marker.setAttribute('markerWidth', '10');
        marker.setAttribute('markerHeight', '10');
        marker.setAttribute('refX', '9');
        marker.setAttribute('refY', '3');
        marker.setAttribute('orient', 'auto');
        marker.setAttribute('markerUnits', 'strokeWidth');

        const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrowPath.setAttribute('d', 'M0,0 L0,6 L9,3 z');
        arrowPath.setAttribute('fill', col);

        marker.appendChild(arrowPath);
        defs.appendChild(marker);
        svg.appendChild(defs);
      }

      // Line element
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(x1));
      line.setAttribute('y1', String(y1));
      line.setAttribute('x2', String(x2));
      line.setAttribute('y2', String(y2));
      line.setAttribute('stroke', col);
      line.setAttribute('stroke-width', String(sw));
      line.setAttribute('stroke-linecap', 'round');
      if (arrow) {
        line.setAttribute('marker-end', 'url(#demo-arrow)');
      }

      svg.appendChild(line);

      const styleSheet = document.createElement('style');
      styleSheet.id = 'demo-swipe-style';
      styleSheet.textContent = `
        @keyframes demoSwipeFade {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
        #demo-swipe-trail {
          animation: demoSwipeFade ${dur}ms ease-out forwards;
        }
      `;
      document.head.appendChild(styleSheet);

      document.body.appendChild(svg);

      setTimeout(() => {
        svg.remove();
        styleSheet.remove();
      }, dur);
    },
    { sx: startX, sy: startY, ex: endX, ey: endY, dur: duration, col: color, sw: strokeWidth, arrow: showArrow }
  );

  await page.waitForTimeout(duration);
}

// Usage
test('swipe gesture demo', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/gallery');

  // Show swipe trail then perform swipe
  const startX = 300;
  const startY = 400;
  const endX = 90;
  const endY = 400;

  await showSwipeTrail(page, startX, startY, endX, endY);

  // Perform actual swipe gesture
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(endX, endY, { steps: 10 });
  await page.mouse.up();
});
```

### Keystroke Overlay

Badge-style display for keyboard shortcuts and key presses.

```typescript
// demos/helpers/interaction-feedback.ts

interface KeystrokeOverlayOptions {
  duration?: number;
  position?: 'top' | 'bottom';
  size?: 'small' | 'medium' | 'large';
  theme?: 'dark' | 'light';
}

const keySizes = {
  small: { fontSize: '12px', padding: '4px 8px', gap: '4px' },
  medium: { fontSize: '16px', padding: '8px 12px', gap: '8px' },
  large: { fontSize: '20px', padding: '12px 16px', gap: '10px' },
};

export async function showKeystrokeOverlay(
  page: Page,
  keys: string[],
  options: KeystrokeOverlayOptions = {}
): Promise<void> {
  const { duration = 1500, position = 'bottom', size = 'medium', theme = 'dark' } = options;
  const sizeStyle = keySizes[size];

  const bgColor = theme === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.95)';
  const textColor = theme === 'dark' ? '#ffffff' : '#1f2937';
  const borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)';

  await page.evaluate(
    ({ keys, dur, pos, sizeStyle, bgColor, textColor, borderColor }) => {
      const container = document.createElement('div');
      container.id = 'demo-keystroke-overlay';
      container.style.cssText = `
        position: fixed;
        ${pos === 'top' ? 'top: 20px' : 'bottom: 20px'};
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: ${sizeStyle.gap};
        z-index: 99998;
        pointer-events: none;
      `;

      keys.forEach((key) => {
        const badge = document.createElement('div');
        badge.style.cssText = `
          background: ${bgColor};
          color: ${textColor};
          border: 1px solid ${borderColor};
          border-radius: 6px;
          padding: ${sizeStyle.padding};
          font-size: ${sizeStyle.fontSize};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 2em;
        `;
        badge.textContent = key;
        container.appendChild(badge);
      });

      const styleSheet = document.createElement('style');
      styleSheet.id = 'demo-keystroke-style';
      styleSheet.textContent = `
        @keyframes demoKeystrokeFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes demoKeystrokeFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        #demo-keystroke-overlay {
          animation: demoKeystrokeFadeIn 0.2s ease-out;
        }
      `;
      document.head.appendChild(styleSheet);

      document.body.appendChild(container);

      setTimeout(() => {
        container.style.animation = 'demoKeystrokeFadeOut 0.3s ease-out forwards';
        setTimeout(() => {
          container.remove();
          styleSheet.remove();
        }, 300);
      }, dur - 300);
    },
    { keys, dur: duration, pos: position, sizeStyle, bgColor, textColor, borderColor }
  );

  await page.waitForTimeout(duration);
}

// Usage
test('keyboard shortcut demo', async ({ page }) => {
  await page.goto('/editor');

  // Show the shortcut being pressed
  await showKeystrokeOverlay(page, ['⌘', 'Shift', 'S']);
  await page.keyboard.press('Meta+Shift+s');

  await page.waitForTimeout(500);

  // Show Escape key
  await showKeystrokeOverlay(page, ['Esc'], { size: 'small', position: 'top' });
  await page.keyboard.press('Escape');
});
```

### Unified Configuration System

Enable automatic interaction feedback with a single configuration call.

```typescript
// demos/helpers/interaction-feedback.ts

interface InteractionFeedbackConfig {
  showCursor?: boolean;
  showClickRipple?: boolean;
  showTapIndicator?: boolean;
  showSwipeTrail?: boolean;
  showKeystrokeOverlay?: boolean;
  colors?: {
    cursor?: string;
    ripple?: string;
    tap?: string;
    swipe?: string;
  };
  keystrokePosition?: 'top' | 'bottom';
}

export async function enableInteractionFeedback(
  page: Page,
  config: InteractionFeedbackConfig = {}
): Promise<void> {
  const {
    showCursor = true,
    showClickRipple = true,
    showTapIndicator = false,
    showSwipeTrail = false,
    showKeystrokeOverlay = true,
    colors = {},
    keystrokePosition = 'bottom',
  } = config;

  const cursorColor = colors.cursor || 'rgba(59, 130, 246, 0.5)';
  const rippleColor = colors.ripple || 'rgba(59, 130, 246, 0.6)';
  const tapColor = colors.tap || 'rgba(59, 130, 246, 0.8)';
  const swipeColor = colors.swipe || 'rgba(59, 130, 246, 0.8)';

  await page.evaluate(
    ({
      showCursor,
      showClickRipple,
      showTapIndicator,
      cursorColor,
      rippleColor,
      tapColor,
      keystrokePosition,
      showKeystrokeOverlay,
    }) => {
      // Inject styles
      const styleSheet = document.createElement('style');
      styleSheet.id = 'demo-interaction-styles';
      styleSheet.textContent = `
        @keyframes demoRippleExpand {
          0% { width: 0; height: 0; opacity: 1; }
          100% { width: 100px; height: 100px; opacity: 0; }
        }
        @keyframes demoTapPulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(1.0); opacity: 0; }
        }
      `;
      document.head.appendChild(styleSheet);

      // Cursor
      if (showCursor) {
        const cursor = document.createElement('div');
        cursor.id = 'demo-auto-cursor';
        cursor.style.cssText = `
          position: fixed;
          width: 20px;
          height: 20px;
          background: ${cursorColor};
          border: 2px solid ${cursorColor.replace('0.5', '1')};
          border-radius: 50%;
          z-index: 99999;
          pointer-events: none;
          transform: translate(-50%, -50%);
          transition: transform 0.1s ease-out, background 0.1s ease-out;
        `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
          cursor.style.left = e.clientX + 'px';
          cursor.style.top = e.clientY + 'px';
        });
      }

      // Click/tap handlers
      const handleClick = (e: MouseEvent) => {
        if (showClickRipple) {
          const ripple = document.createElement('div');
          ripple.className = 'demo-auto-ripple';
          ripple.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: radial-gradient(circle, ${rippleColor} 0%, transparent 70%);
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 99998;
            animation: demoRippleExpand 600ms ease-out forwards;
          `;
          document.body.appendChild(ripple);
          setTimeout(() => ripple.remove(), 600);
        }
      };

      const handleTouch = (e: TouchEvent) => {
        if (showTapIndicator && e.touches.length > 0) {
          const touch = e.touches[0];
          const tap = document.createElement('div');
          tap.className = 'demo-auto-tap';
          tap.style.cssText = `
            position: fixed;
            left: ${touch.clientX}px;
            top: ${touch.clientY}px;
            width: 60px;
            height: 60px;
            border: 3px solid ${tapColor};
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0.8);
            pointer-events: none;
            z-index: 99998;
            box-sizing: border-box;
            animation: demoTapPulse 500ms ease-out forwards;
          `;
          document.body.appendChild(tap);
          setTimeout(() => tap.remove(), 500);
        }
      };

      document.addEventListener('click', handleClick);
      document.addEventListener('touchstart', handleTouch);

      // Keyboard handler
      if (showKeystrokeOverlay) {
        const activeKeys = new Set<string>();
        let keystrokeTimeout: ReturnType<typeof setTimeout> | null = null;

        const formatKey = (key: string): string => {
          const keyMap: Record<string, string> = {
            Meta: '⌘',
            Control: 'Ctrl',
            Alt: '⌥',
            Shift: '⇧',
            Enter: '↵',
            Escape: 'Esc',
            ArrowUp: '↑',
            ArrowDown: '↓',
            ArrowLeft: '←',
            ArrowRight: '→',
            Backspace: '⌫',
            Tab: '⇥',
            ' ': 'Space',
          };
          return keyMap[key] || key.toUpperCase();
        };

        const showKeys = () => {
          // Remove existing
          const existing = document.getElementById('demo-auto-keystroke');
          if (existing) existing.remove();

          if (activeKeys.size === 0) return;

          const container = document.createElement('div');
          container.id = 'demo-auto-keystroke';
          container.style.cssText = `
            position: fixed;
            ${keystrokePosition === 'top' ? 'top: 20px' : 'bottom: 20px'};
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
            z-index: 99998;
            pointer-events: none;
          `;

          activeKeys.forEach((key) => {
            const badge = document.createElement('div');
            badge.style.cssText = `
              background: rgba(0, 0, 0, 0.85);
              color: white;
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 6px;
              padding: 8px 12px;
              font-size: 16px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;
              font-weight: 600;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            `;
            badge.textContent = formatKey(key);
            container.appendChild(badge);
          });

          document.body.appendChild(container);
        };

        document.addEventListener('keydown', (e) => {
          activeKeys.add(e.key);
          showKeys();

          if (keystrokeTimeout) clearTimeout(keystrokeTimeout);
          keystrokeTimeout = setTimeout(() => {
            activeKeys.clear();
            const existing = document.getElementById('demo-auto-keystroke');
            if (existing) existing.remove();
          }, 1500);
        });

        document.addEventListener('keyup', (e) => {
          // Keep showing for modifier combos
          if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
            if (keystrokeTimeout) clearTimeout(keystrokeTimeout);
            keystrokeTimeout = setTimeout(() => {
              activeKeys.clear();
              const existing = document.getElementById('demo-auto-keystroke');
              if (existing) existing.remove();
            }, 1500);
          }
        });
      }
    },
    {
      showCursor,
      showClickRipple,
      showTapIndicator,
      cursorColor,
      rippleColor,
      tapColor,
      keystrokePosition,
      showKeystrokeOverlay,
    }
  );
}

export async function disableInteractionFeedback(page: Page): Promise<void> {
  await page.evaluate(() => {
    // Remove all feedback elements
    const elements = [
      'demo-auto-cursor',
      'demo-auto-keystroke',
      'demo-interaction-styles',
    ];
    elements.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });

    // Remove ripples and taps
    document.querySelectorAll('.demo-auto-ripple, .demo-auto-tap').forEach((el) => el.remove());
  });
}
```

---

## Scenario Recording System

Automatic documentation of demo actions for reproducibility.

### Scenario Recorder Helper

```typescript
// demos/helpers/scenario-recorder.ts
import { Page } from '@playwright/test';

interface RecordedAction {
  timestamp: number;
  elapsed: number;
  type: 'navigate' | 'click' | 'fill' | 'select' | 'check' | 'wait' | 'overlay' | 'scroll';
  selector?: string;
  value?: string;
  description?: string;
}

interface ScenarioRecording {
  startTime: number;
  actions: RecordedAction[];
  stop: () => Promise<RecordedAction[]>;
}

interface ScenarioDocOptions {
  title: string;
  author?: string;
  audience?: string;
  includeTimestamps?: boolean;
}

export async function enableScenarioRecording(page: Page): Promise<ScenarioRecording> {
  const startTime = Date.now();
  const actions: RecordedAction[] = [];

  // Intercept page actions
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) {
      actions.push({
        timestamp: Date.now(),
        elapsed: Date.now() - startTime,
        type: 'navigate',
        value: frame.url(),
        description: `Navigate to ${new URL(frame.url()).pathname}`,
      });
    }
  });

  // Create action logger
  const logAction = (action: Omit<RecordedAction, 'timestamp' | 'elapsed'>) => {
    actions.push({
      ...action,
      timestamp: Date.now(),
      elapsed: Date.now() - startTime,
    });
  };

  // Expose logger for manual annotations
  await page.exposeFunction('__recordAction', (type: string, description: string) => {
    logAction({ type: type as RecordedAction['type'], description });
  });

  return {
    startTime,
    actions,
    stop: async () => {
      return [...actions];
    },
  };
}

export function generateScenarioDoc(
  actions: RecordedAction[],
  options: ScenarioDocOptions
): string {
  const { title, author = 'Director', audience, includeTimestamps = true } = options;
  const duration = actions.length > 0
    ? Math.round(actions[actions.length - 1].elapsed / 1000)
    : 0;

  let doc = `# Scenario: ${title}\n\n`;
  doc += `> Auto-generated by ${author}\n\n`;
  doc += `| Property | Value |\n`;
  doc += `|----------|-------|\n`;
  doc += `| Generated | ${new Date().toISOString()} |\n`;
  doc += `| Duration | ${duration}s |\n`;
  doc += `| Total Steps | ${actions.length} |\n`;
  if (audience) {
    doc += `| Audience | ${audience} |\n`;
  }
  doc += `\n---\n\n`;
  doc += `## Steps\n\n`;

  actions.forEach((action, index) => {
    const time = includeTimestamps
      ? `**${formatTime(action.elapsed)}** `
      : '';
    const desc = action.description || formatActionDescription(action);
    doc += `${index + 1}. ${time}${desc}\n`;
  });

  return doc;
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatActionDescription(action: RecordedAction): string {
  switch (action.type) {
    case 'navigate':
      return `Navigate to \`${action.value}\``;
    case 'click':
      return `Click on \`${action.selector}\``;
    case 'fill':
      return `Fill \`${action.selector}\` with "${action.value}"`;
    case 'select':
      return `Select "${action.value}" in \`${action.selector}\``;
    case 'check':
      return `Check \`${action.selector}\``;
    case 'wait':
      return `Wait ${action.value}ms`;
    case 'overlay':
      return `Show overlay: "${action.value}"`;
    case 'scroll':
      return `Scroll to \`${action.selector}\``;
    default:
      return action.description || 'Unknown action';
  }
}
```

### Enhanced Demo Test with Recording

```typescript
// demos/specs/demo-checkout-recorded.spec.ts
import { test, expect } from '@playwright/test';
import { enableScenarioRecording, generateScenarioDoc } from '../helpers/scenario-recorder';
import { showOverlay } from '../helpers/overlay';
import fs from 'fs/promises';
import path from 'path';

test.describe('Demo: Checkout Flow (Recorded)', () => {
  test('complete checkout with auto-documentation', async ({ page }, testInfo) => {
    const recorder = await enableScenarioRecording(page);

    // === Scene 1: Product Page ===
    await page.goto('/products/sample-a');
    await page.waitForLoadState('networkidle');

    await showOverlay(page, 'Adding product to cart', 2000);
    // Manual annotation
    await page.evaluate(() => {
      (window as any).__recordAction('overlay', 'Show: Adding product to cart');
    });

    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await page.evaluate(() => {
      (window as any).__recordAction('click', 'Click "Add to Cart" button');
    });

    // ... more actions ...

    // === Generate Documentation ===
    const actions = await recorder.stop();
    const markdown = generateScenarioDoc(actions, {
      title: 'Checkout Flow Demo',
      audience: 'New users',
    });

    // Save alongside video
    const scenarioDir = path.join(__dirname, '../scenarios');
    await fs.mkdir(scenarioDir, { recursive: true });
    await fs.writeFile(
      path.join(scenarioDir, `${testInfo.title.replace(/\s+/g, '_')}.md`),
      markdown
    );
  });
});
```

### Wrapper Functions for Auto-Logging

```typescript
// demos/helpers/recorded-actions.ts
import { Page, Locator } from '@playwright/test';

export function createRecordedActions(page: Page) {
  return {
    async click(locator: Locator, description?: string) {
      const selector = await locator.evaluate(el => {
        // Get a readable selector
        return el.getAttribute('data-testid')
          || el.getAttribute('aria-label')
          || el.tagName.toLowerCase();
      });
      await page.evaluate(
        ({ sel, desc }) => (window as any).__recordAction?.('click', desc || `Click ${sel}`),
        { sel: selector, desc: description }
      );
      await locator.click();
    },

    async fill(locator: Locator, value: string, description?: string) {
      const label = await locator.evaluate(el => {
        const id = el.getAttribute('id');
        if (id) {
          const label = document.querySelector(`label[for="${id}"]`);
          return label?.textContent || id;
        }
        return el.getAttribute('name') || 'field';
      });
      await page.evaluate(
        ({ lbl, val, desc }) =>
          (window as any).__recordAction?.('fill', desc || `Fill "${lbl}" with "${val}"`),
        { lbl: label, val: value, desc: description }
      );
      await locator.fill(value);
    },

    async navigate(url: string, description?: string) {
      await page.evaluate(
        ({ url, desc }) => (window as any).__recordAction?.('navigate', desc || `Navigate to ${url}`),
        { url, desc: description }
      );
      await page.goto(url);
    },
  };
}

// Usage
test('demo with recorded actions', async ({ page }) => {
  const recorder = await enableScenarioRecording(page);
  const actions = createRecordedActions(page);

  await actions.navigate('/dashboard', 'Open dashboard');
  await actions.click(page.getByRole('button', { name: 'Create' }), 'Click create button');
  await actions.fill(page.getByLabel('Title'), 'My Document', 'Enter document title');

  const recorded = await recorder.stop();
  // All actions are automatically documented
});
```

---

## Performance Visualization System

Real-time performance metrics overlay for demo recordings.

### Performance Overlay Helper

```typescript
// demos/helpers/performance-overlay.ts
import { Page } from '@playwright/test';

type MetricType = 'lcp' | 'cls' | 'inp' | 'fcp' | 'ttfb' | 'requests' | 'transfer' | 'dom' | 'heap';
type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type Theme = 'dark' | 'light' | 'transparent';
type DisplayMode = 'compact' | 'detailed';

interface PerformanceOverlayOptions {
  metrics?: MetricType[];
  position?: Position;
  theme?: Theme;
  mode?: DisplayMode;
  updateInterval?: number;
  showThresholds?: boolean;
}

interface MetricThresholds {
  good: number;
  needsImprovement: number;
}

const THRESHOLDS: Record<string, MetricThresholds> = {
  lcp: { good: 2500, needsImprovement: 4000 },
  cls: { good: 0.1, needsImprovement: 0.25 },
  inp: { good: 200, needsImprovement: 500 },
  fcp: { good: 1800, needsImprovement: 3000 },
  ttfb: { good: 800, needsImprovement: 1800 },
};

export async function enablePerformanceOverlay(
  page: Page,
  options: PerformanceOverlayOptions = {}
): Promise<void> {
  const {
    metrics = ['lcp', 'cls', 'inp'],
    position = 'top-right',
    theme = 'dark',
    mode = 'detailed',
    updateInterval = 500,
    showThresholds = true,
  } = options;

  await page.evaluate(
    ({ metrics, position, theme, mode, updateInterval, showThresholds, thresholds }) => {
      // Theme colors
      const themes = {
        dark: {
          bg: 'rgba(0, 0, 0, 0.85)',
          text: '#ffffff',
          border: 'rgba(255, 255, 255, 0.1)',
          good: '#22c55e',
          warning: '#f59e0b',
          poor: '#ef4444',
        },
        light: {
          bg: 'rgba(255, 255, 255, 0.95)',
          text: '#1f2937',
          border: 'rgba(0, 0, 0, 0.1)',
          good: '#16a34a',
          warning: '#d97706',
          poor: '#dc2626',
        },
        transparent: {
          bg: 'rgba(0, 0, 0, 0.5)',
          text: '#ffffff',
          border: 'transparent',
          good: '#4ade80',
          warning: '#fbbf24',
          poor: '#f87171',
        },
      };

      const colors = themes[theme];

      // Position styles
      const positions = {
        'top-left': 'top: 16px; left: 16px;',
        'top-right': 'top: 16px; right: 16px;',
        'bottom-left': 'bottom: 16px; left: 16px;',
        'bottom-right': 'bottom: 16px; right: 16px;',
      };

      // Create container
      const container = document.createElement('div');
      container.id = 'demo-performance-overlay';
      container.style.cssText = `
        position: fixed;
        ${positions[position]}
        background: ${colors.bg};
        color: ${colors.text};
        border: 1px solid ${colors.border};
        border-radius: 8px;
        padding: ${mode === 'compact' ? '8px 12px' : '12px 16px'};
        font-family: -apple-system, BlinkMacSystemFont, 'SF Mono', Consolas, monospace;
        font-size: 12px;
        z-index: 99997;
        min-width: ${mode === 'compact' ? '80px' : '160px'};
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(8px);
      `;

      // Header (detailed mode only)
      if (mode === 'detailed') {
        const header = document.createElement('div');
        header.style.cssText = `
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          opacity: 0.7;
        `;
        header.textContent = 'Performance';
        container.appendChild(header);
      }

      // Metric rows container
      const metricsContainer = document.createElement('div');
      metricsContainer.id = 'demo-perf-metrics';
      metricsContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: ${mode === 'compact' ? '4px' : '6px'};
      `;
      container.appendChild(metricsContainer);

      document.body.appendChild(container);

      // Metric state
      const metricValues: Record<string, number | null> = {};
      metrics.forEach((m: string) => (metricValues[m] = null));

      // Format metric value
      const formatValue = (metric: string, value: number | null): string => {
        if (value === null) return '...';
        switch (metric) {
          case 'lcp':
          case 'fcp':
          case 'ttfb':
          case 'inp':
            return value < 1000 ? `${Math.round(value)}ms` : `${(value / 1000).toFixed(1)}s`;
          case 'cls':
            return value.toFixed(3);
          case 'requests':
            return String(Math.round(value));
          case 'transfer':
            return value < 1024
              ? `${Math.round(value)}B`
              : value < 1024 * 1024
              ? `${(value / 1024).toFixed(1)}KB`
              : `${(value / 1024 / 1024).toFixed(1)}MB`;
          case 'dom':
            return String(Math.round(value));
          case 'heap':
            return `${(value / 1024 / 1024).toFixed(1)}MB`;
          default:
            return String(value);
        }
      };

      // Get status color
      const getStatusColor = (metric: string, value: number | null): string => {
        if (value === null || !showThresholds) return colors.text;
        const threshold = thresholds[metric];
        if (!threshold) return colors.text;
        if (value <= threshold.good) return colors.good;
        if (value <= threshold.needsImprovement) return colors.warning;
        return colors.poor;
      };

      // Get status icon
      const getStatusIcon = (metric: string, value: number | null): string => {
        if (value === null || !showThresholds) return '';
        const threshold = thresholds[metric];
        if (!threshold) return '';
        if (value <= threshold.good) return ' ✓';
        if (value <= threshold.needsImprovement) return ' ⚠';
        return ' ✗';
      };

      // Metric labels
      const labels: Record<string, string> = {
        lcp: 'LCP',
        cls: 'CLS',
        inp: 'INP',
        fcp: 'FCP',
        ttfb: 'TTFB',
        requests: 'Requests',
        transfer: 'Transfer',
        dom: 'DOM Nodes',
        heap: 'JS Heap',
      };

      // Update display
      const updateDisplay = () => {
        const container = document.getElementById('demo-perf-metrics');
        if (!container) return;

        container.innerHTML = '';

        metrics.forEach((metric: string) => {
          const row = document.createElement('div');
          row.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
          `;

          const label = document.createElement('span');
          label.style.cssText = 'opacity: 0.8;';
          label.textContent = labels[metric] || metric.toUpperCase();

          const value = document.createElement('span');
          value.style.cssText = `
            font-weight: 600;
            color: ${getStatusColor(metric, metricValues[metric])};
          `;
          value.textContent = formatValue(metric, metricValues[metric]) + getStatusIcon(metric, metricValues[metric]);

          row.appendChild(label);
          row.appendChild(value);
          container.appendChild(row);
        });
      };

      // Collect Web Vitals
      const collectWebVitals = () => {
        // LCP
        if (metrics.includes('lcp')) {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
            if (lastEntry) {
              metricValues['lcp'] = lastEntry.startTime;
              updateDisplay();
            }
          }).observe({ type: 'largest-contentful-paint', buffered: true });
        }

        // CLS
        if (metrics.includes('cls')) {
          let clsValue = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as (PerformanceEntry & { hadRecentInput: boolean; value: number })[]) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
            metricValues['cls'] = clsValue;
            updateDisplay();
          }).observe({ type: 'layout-shift', buffered: true });
        }

        // INP (approximation using event timing)
        if (metrics.includes('inp')) {
          let maxINP = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as (PerformanceEntry & { duration: number })[]) {
              if (entry.duration > maxINP) {
                maxINP = entry.duration;
                metricValues['inp'] = maxINP;
                updateDisplay();
              }
            }
          }).observe({ type: 'event', buffered: true });
        }

        // FCP
        if (metrics.includes('fcp')) {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const fcpEntry = entries.find((e) => e.name === 'first-contentful-paint');
            if (fcpEntry) {
              metricValues['fcp'] = fcpEntry.startTime;
              updateDisplay();
            }
          }).observe({ type: 'paint', buffered: true });
        }

        // TTFB
        if (metrics.includes('ttfb')) {
          const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navEntry) {
            metricValues['ttfb'] = navEntry.responseStart - navEntry.requestStart;
            updateDisplay();
          }
        }
      };

      // Collect resource metrics
      const collectResourceMetrics = () => {
        if (metrics.includes('requests') || metrics.includes('transfer')) {
          const updateResources = () => {
            const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
            if (metrics.includes('requests')) {
              metricValues['requests'] = resources.length;
            }
            if (metrics.includes('transfer')) {
              metricValues['transfer'] = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
            }
            updateDisplay();
          };
          updateResources();
          setInterval(updateResources, updateInterval);
        }

        // DOM nodes
        if (metrics.includes('dom')) {
          const updateDOM = () => {
            metricValues['dom'] = document.querySelectorAll('*').length;
            updateDisplay();
          };
          updateDOM();
          setInterval(updateDOM, updateInterval);
        }

        // JS Heap (Chrome only)
        if (metrics.includes('heap') && (performance as any).memory) {
          const updateHeap = () => {
            metricValues['heap'] = (performance as any).memory.usedJSHeapSize;
            updateDisplay();
          };
          updateHeap();
          setInterval(updateHeap, updateInterval);
        }
      };

      // Initialize
      updateDisplay();
      collectWebVitals();
      collectResourceMetrics();
    },
    { metrics, position, theme, mode, updateInterval, showThresholds, thresholds: THRESHOLDS }
  );
}

export async function disablePerformanceOverlay(page: Page): Promise<void> {
  await page.evaluate(() => {
    const overlay = document.getElementById('demo-performance-overlay');
    if (overlay) overlay.remove();
  });
}

export async function capturePerformanceSnapshot(page: Page): Promise<Record<string, number | null>> {
  return await page.evaluate(() => {
    const snapshot: Record<string, number | null> = {};

    // Navigation timing
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navEntry) {
      snapshot['ttfb'] = navEntry.responseStart - navEntry.requestStart;
      snapshot['domContentLoaded'] = navEntry.domContentLoadedEventEnd - navEntry.startTime;
      snapshot['load'] = navEntry.loadEventEnd - navEntry.startTime;
    }

    // Resources
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    snapshot['requests'] = resources.length;
    snapshot['transfer'] = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);

    // DOM
    snapshot['dom'] = document.querySelectorAll('*').length;

    // Heap (Chrome only)
    if ((performance as any).memory) {
      snapshot['heap'] = (performance as any).memory.usedJSHeapSize;
    }

    return snapshot;
  });
}
```

### Performance Comparison Demo

Record before/after performance comparison for optimization demos.

```typescript
// demos/helpers/performance-comparison.ts
import { Page } from '@playwright/test';
import { capturePerformanceSnapshot } from './performance-overlay';

interface ComparisonResult {
  before: Record<string, number | null>;
  after: Record<string, number | null>;
  improvements: Record<string, { value: number; percentage: number }>;
}

export async function showComparisonOverlay(
  page: Page,
  before: Record<string, number | null>,
  after: Record<string, number | null>
): Promise<void> {
  await page.evaluate(
    ({ before, after }) => {
      const container = document.createElement('div');
      container.id = 'demo-comparison-overlay';
      container.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        border-radius: 12px;
        padding: 24px 32px;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Mono', Consolas, monospace;
        z-index: 99999;
        min-width: 300px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      `;

      const title = document.createElement('div');
      title.style.cssText = `
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 16px;
        text-align: center;
      `;
      title.textContent = '⚡ Performance Improvement';
      container.appendChild(title);

      const table = document.createElement('div');
      table.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';

      // Header row
      const header = document.createElement('div');
      header.style.cssText = `
        display: grid;
        grid-template-columns: 80px 70px 70px 70px;
        gap: 8px;
        font-size: 11px;
        text-transform: uppercase;
        opacity: 0.6;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255,255,255,0.2);
      `;
      header.innerHTML = '<span>Metric</span><span>Before</span><span>After</span><span>Change</span>';
      table.appendChild(header);

      const formatValue = (key: string, val: number | null): string => {
        if (val === null) return '-';
        if (key === 'transfer') {
          return val < 1024 * 1024 ? `${(val / 1024).toFixed(0)}KB` : `${(val / 1024 / 1024).toFixed(1)}MB`;
        }
        if (key === 'heap') return `${(val / 1024 / 1024).toFixed(1)}MB`;
        if (key.includes('time') || key === 'ttfb' || key === 'lcp' || key === 'fcp') {
          return val < 1000 ? `${Math.round(val)}ms` : `${(val / 1000).toFixed(1)}s`;
        }
        return String(Math.round(val));
      };

      const labels: Record<string, string> = {
        lcp: 'LCP',
        ttfb: 'TTFB',
        transfer: 'Transfer',
        requests: 'Requests',
        dom: 'DOM',
        heap: 'JS Heap',
      };

      Object.keys(before).forEach((key) => {
        if (before[key] === null && after[key] === null) return;

        const row = document.createElement('div');
        row.style.cssText = `
          display: grid;
          grid-template-columns: 80px 70px 70px 70px;
          gap: 8px;
          font-size: 13px;
          align-items: center;
        `;

        const beforeVal = before[key];
        const afterVal = after[key];
        let changeText = '-';
        let changeColor = '#ffffff';

        if (beforeVal !== null && afterVal !== null && beforeVal > 0) {
          const diff = ((beforeVal - afterVal) / beforeVal) * 100;
          if (diff > 0) {
            changeText = `↓${diff.toFixed(0)}%`;
            changeColor = '#22c55e';
          } else if (diff < 0) {
            changeText = `↑${Math.abs(diff).toFixed(0)}%`;
            changeColor = '#ef4444';
          } else {
            changeText = '→0%';
          }
        }

        row.innerHTML = `
          <span style="opacity: 0.8;">${labels[key] || key}</span>
          <span style="opacity: 0.6;">${formatValue(key, beforeVal)}</span>
          <span>${formatValue(key, afterVal)}</span>
          <span style="color: ${changeColor}; font-weight: 600;">${changeText}</span>
        `;
        table.appendChild(row);
      });

      container.appendChild(table);
      document.body.appendChild(container);
    },
    { before, after }
  );
}

export async function hideComparisonOverlay(page: Page): Promise<void> {
  await page.evaluate(() => {
    const overlay = document.getElementById('demo-comparison-overlay');
    if (overlay) overlay.remove();
  });
}
```

### Usage Examples

#### Basic Performance Demo

```typescript
// demos/specs/demo-performance.spec.ts
import { test, expect } from '@playwright/test';
import { enablePerformanceOverlay, disablePerformanceOverlay } from '../helpers/performance-overlay';
import { showOverlay } from '../helpers/overlay';

test.describe('Demo: Dashboard Performance', () => {
  test('show page load performance metrics', async ({ page }) => {
    // Enable overlay before navigation
    await page.goto('about:blank');
    await enablePerformanceOverlay(page, {
      metrics: ['lcp', 'cls', 'inp', 'requests', 'transfer'],
      position: 'top-right',
      theme: 'dark',
      mode: 'detailed',
    });

    await showOverlay(page, 'Loading dashboard...', 1500);

    // Navigate and let metrics populate
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await showOverlay(page, 'Page loaded with excellent performance!', 2500);

    // Keep overlay visible for a moment
    await page.waitForTimeout(3000);

    await disablePerformanceOverlay(page);
  });
});
```

#### Before/After Comparison Demo

```typescript
// demos/specs/demo-optimization-comparison.spec.ts
import { test } from '@playwright/test';
import {
  enablePerformanceOverlay,
  capturePerformanceSnapshot,
  disablePerformanceOverlay,
} from '../helpers/performance-overlay';
import { showComparisonOverlay, hideComparisonOverlay } from '../helpers/performance-comparison';
import { showOverlay } from '../helpers/overlay';

test.describe('Demo: Performance Optimization Results', () => {
  test('compare before and after optimization', async ({ page }) => {
    // === Part 1: Before (simulate slow version) ===
    await showOverlay(page, 'Before: Original Implementation', 2000);

    await enablePerformanceOverlay(page, {
      metrics: ['lcp', 'ttfb', 'transfer', 'requests'],
      position: 'top-right',
    });

    await page.goto('/dashboard?version=legacy');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const beforeSnapshot = await capturePerformanceSnapshot(page);
    await disablePerformanceOverlay(page);

    // === Part 2: After (optimized version) ===
    await showOverlay(page, 'After: Optimized Implementation', 2000);

    await enablePerformanceOverlay(page, {
      metrics: ['lcp', 'ttfb', 'transfer', 'requests'],
      position: 'top-right',
    });

    await page.goto('/dashboard?version=optimized');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const afterSnapshot = await capturePerformanceSnapshot(page);
    await disablePerformanceOverlay(page);

    // === Part 3: Show comparison ===
    await showComparisonOverlay(page, beforeSnapshot, afterSnapshot);
    await page.waitForTimeout(5000);

    await hideComparisonOverlay(page);
  });
});
```

#### Network-Focused Demo

```typescript
// demos/specs/demo-api-optimization.spec.ts
import { test } from '@playwright/test';
import { enablePerformanceOverlay } from '../helpers/performance-overlay';
import { showOverlay } from '../helpers/overlay';

test.describe('Demo: API Optimization', () => {
  test('show reduced network requests', async ({ page }) => {
    await page.goto('about:blank');

    // Focus on network metrics
    await enablePerformanceOverlay(page, {
      metrics: ['requests', 'transfer', 'ttfb'],
      position: 'bottom-right',
      theme: 'transparent',
      mode: 'compact',
    });

    await showOverlay(page, 'Watch the network metrics', 2000);

    await page.goto('/data-heavy-page');
    await page.waitForLoadState('networkidle');

    await showOverlay(page, 'Only 5 requests thanks to batching!', 3000);
  });
});
```

---

## Before/After Comparison Mode

Side-by-side comparison recording for improvements, redesigns, and A/B demos.

### Comparison Mode Helper

```typescript
// demos/helpers/comparison-mode.ts
import { Browser, BrowserContext, Page } from '@playwright/test';
import { capturePerformanceSnapshot } from './performance-overlay';

type ComparisonLayout = 'split' | 'pip' | 'sequential';
type PipPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface ComparisonOptions {
  layout: ComparisonLayout;
  beforeUrl: string;
  afterUrl: string;
  labels?: {
    before?: string;
    after?: string;
  };
  viewport?: { width: number; height: number };
  showMetrics?: boolean;
  pipPosition?: PipPosition;
  pipScale?: number;
}

interface ComparisonContext {
  before: {
    context: BrowserContext;
    page: Page;
  };
  after: {
    context: BrowserContext;
    page: Page;
  };
  both: (fn: (page: Page, label: 'before' | 'after') => Promise<void>) => Promise<void>;
  beforeOnly: (fn: (page: Page) => Promise<void>) => Promise<void>;
  afterOnly: (fn: (page: Page) => Promise<void>) => Promise<void>;
  showSummary: () => Promise<void>;
  captureComparison: () => Promise<{ before: Record<string, number | null>; after: Record<string, number | null> }>;
  close: () => Promise<void>;
}

export async function createComparisonDemo(
  browser: Browser,
  options: ComparisonOptions
): Promise<ComparisonContext> {
  const {
    layout,
    beforeUrl,
    afterUrl,
    labels = { before: 'BEFORE', after: 'AFTER' },
    viewport = { width: 1280, height: 720 },
    showMetrics = true,
    pipPosition = 'bottom-right',
    pipScale = 0.3,
  } = options;

  // Calculate viewports based on layout
  let beforeViewport = { ...viewport };
  let afterViewport = { ...viewport };

  if (layout === 'split') {
    beforeViewport = { width: Math.floor(viewport.width / 2), height: viewport.height };
    afterViewport = { width: Math.floor(viewport.width / 2), height: viewport.height };
  }

  // Create contexts
  const beforeContext = await browser.newContext({
    viewport: beforeViewport,
    recordVideo: layout !== 'pip' ? {
      dir: 'demos/output/comparison/',
      size: beforeViewport,
    } : undefined,
  });

  const afterContext = await browser.newContext({
    viewport: afterViewport,
    recordVideo: {
      dir: 'demos/output/comparison/',
      size: afterViewport,
    },
  });

  const beforePage = await beforeContext.newPage();
  const afterPage = await afterContext.newPage();

  // Add labels overlay
  const addLabel = async (page: Page, label: string, position: 'left' | 'right' | 'center') => {
    await page.evaluate(
      ({ label, position }) => {
        const existing = document.getElementById('demo-comparison-label');
        if (existing) existing.remove();

        const labelEl = document.createElement('div');
        labelEl.id = 'demo-comparison-label';
        labelEl.style.cssText = `
          position: fixed;
          top: 12px;
          ${position === 'left' ? 'left: 12px;' : position === 'right' ? 'right: 12px;' : 'left: 50%; transform: translateX(-50%);'}
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Mono', monospace;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          z-index: 99999;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        `;
        labelEl.textContent = label;
        document.body.appendChild(labelEl);
      },
      { label, position }
    );
  };

  // Navigate to initial URLs
  await Promise.all([
    beforePage.goto(beforeUrl),
    afterPage.goto(afterUrl),
  ]);

  await Promise.all([
    beforePage.waitForLoadState('networkidle'),
    afterPage.waitForLoadState('networkidle'),
  ]);

  // Add labels
  await addLabel(beforePage, labels.before || 'BEFORE', layout === 'split' ? 'center' : 'left');
  await addLabel(afterPage, labels.after || 'AFTER', layout === 'split' ? 'center' : 'right');

  // Add metrics overlay if enabled
  if (showMetrics) {
    const addMetricsOverlay = async (page: Page, position: 'left' | 'right') => {
      await page.evaluate(
        ({ position }) => {
          const overlay = document.createElement('div');
          overlay.id = 'demo-comparison-metrics';
          overlay.style.cssText = `
            position: fixed;
            bottom: 12px;
            ${position === 'left' ? 'left: 12px;' : 'right: 12px;'}
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Mono', monospace;
            font-size: 11px;
            z-index: 99999;
          `;
          overlay.innerHTML = '<div id="demo-metrics-content">Loading...</div>';
          document.body.appendChild(overlay);

          // Update metrics periodically
          const updateMetrics = () => {
            const content = document.getElementById('demo-metrics-content');
            if (!content) return;

            const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

            const ttfb = navEntry ? Math.round(navEntry.responseStart - navEntry.requestStart) : 0;
            const load = navEntry ? Math.round(navEntry.loadEventEnd - navEntry.startTime) : 0;
            const requests = resources.length;
            const transfer = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
            const transferStr = transfer < 1024 * 1024
              ? `${(transfer / 1024).toFixed(0)}KB`
              : `${(transfer / 1024 / 1024).toFixed(1)}MB`;

            content.innerHTML = `
              <div style="margin-bottom: 4px;">TTFB: ${ttfb}ms</div>
              <div style="margin-bottom: 4px;">Load: ${load}ms</div>
              <div style="margin-bottom: 4px;">Requests: ${requests}</div>
              <div>Transfer: ${transferStr}</div>
            `;
          };

          updateMetrics();
          setInterval(updateMetrics, 1000);
        },
        { position }
      );
    };

    await addMetricsOverlay(beforePage, 'left');
    await addMetricsOverlay(afterPage, 'right');
  }

  return {
    before: { context: beforeContext, page: beforePage },
    after: { context: afterContext, page: afterPage },

    async both(fn) {
      await Promise.all([
        fn(beforePage, 'before'),
        fn(afterPage, 'after'),
      ]);
    },

    async beforeOnly(fn) {
      await fn(beforePage);
    },

    async afterOnly(fn) {
      await fn(afterPage);
    },

    async showSummary() {
      const beforeSnapshot = await capturePerformanceSnapshot(beforePage);
      const afterSnapshot = await capturePerformanceSnapshot(afterPage);

      // Show summary on the after page (main view)
      await afterPage.evaluate(
        ({ before, after, beforeLabel, afterLabel }) => {
          const existing = document.getElementById('demo-summary-overlay');
          if (existing) existing.remove();

          const container = document.createElement('div');
          container.id = 'demo-summary-overlay';
          container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            color: white;
            border-radius: 12px;
            padding: 24px 32px;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Mono', monospace;
            z-index: 99999;
            min-width: 320px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          `;

          const title = document.createElement('div');
          title.style.cssText = `
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            text-align: center;
          `;
          title.textContent = '📊 Comparison Summary';
          container.appendChild(title);

          const table = document.createElement('div');
          table.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';

          // Header
          const header = document.createElement('div');
          header.style.cssText = `
            display: grid;
            grid-template-columns: 90px 80px 80px 70px;
            gap: 8px;
            font-size: 11px;
            text-transform: uppercase;
            opacity: 0.6;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(255,255,255,0.2);
          `;
          header.innerHTML = `<span>Metric</span><span>${beforeLabel}</span><span>${afterLabel}</span><span>Change</span>`;
          table.appendChild(header);

          const formatValue = (key: string, val: number | null): string => {
            if (val === null) return '-';
            if (key === 'transfer') {
              return val < 1024 * 1024 ? `${(val / 1024).toFixed(0)}KB` : `${(val / 1024 / 1024).toFixed(1)}MB`;
            }
            if (['ttfb', 'load', 'domContentLoaded'].includes(key)) {
              return val < 1000 ? `${Math.round(val)}ms` : `${(val / 1000).toFixed(1)}s`;
            }
            return String(Math.round(val));
          };

          const metrics = ['ttfb', 'load', 'requests', 'transfer'];
          const labels: Record<string, string> = {
            ttfb: 'TTFB',
            load: 'Load Time',
            requests: 'Requests',
            transfer: 'Transfer',
          };

          metrics.forEach((key) => {
            const beforeVal = before[key];
            const afterVal = after[key];
            if (beforeVal === null && afterVal === null) return;

            const row = document.createElement('div');
            row.style.cssText = `
              display: grid;
              grid-template-columns: 90px 80px 80px 70px;
              gap: 8px;
              font-size: 13px;
              align-items: center;
            `;

            let changeText = '-';
            let changeColor = '#ffffff';

            if (beforeVal !== null && afterVal !== null && beforeVal > 0) {
              const diff = ((beforeVal - afterVal) / beforeVal) * 100;
              if (diff > 0) {
                changeText = `↓${diff.toFixed(0)}%`;
                changeColor = '#22c55e';
              } else if (diff < 0) {
                changeText = `↑${Math.abs(diff).toFixed(0)}%`;
                changeColor = '#ef4444';
              } else {
                changeText = '→0%';
              }
            }

            row.innerHTML = `
              <span style="opacity: 0.8;">${labels[key] || key}</span>
              <span style="opacity: 0.6;">${formatValue(key, beforeVal)}</span>
              <span>${formatValue(key, afterVal)}</span>
              <span style="color: ${changeColor}; font-weight: 600;">${changeText}</span>
            `;
            table.appendChild(row);
          });

          container.appendChild(table);
          document.body.appendChild(container);
        },
        {
          before: beforeSnapshot,
          after: afterSnapshot,
          beforeLabel: labels.before || 'BEFORE',
          afterLabel: labels.after || 'AFTER',
        }
      );
    },

    async captureComparison() {
      const [before, after] = await Promise.all([
        capturePerformanceSnapshot(beforePage),
        capturePerformanceSnapshot(afterPage),
      ]);
      return { before, after };
    },

    async close() {
      await beforeContext.close();
      await afterContext.close();
    },
  };
}
```

### Split Screen Divider Overlay

```typescript
// demos/helpers/split-divider.ts
import { Page } from '@playwright/test';

interface DividerOptions {
  color?: string;
  width?: number;
  showDragHandle?: boolean;
}

export async function addSplitDivider(
  page: Page,
  options: DividerOptions = {}
): Promise<void> {
  const { color = 'rgba(255, 255, 255, 0.3)', width = 2, showDragHandle = false } = options;

  await page.evaluate(
    ({ color, width, showHandle }) => {
      const divider = document.createElement('div');
      divider.id = 'demo-split-divider';
      divider.style.cssText = `
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: ${width}px;
        height: 100%;
        background: ${color};
        z-index: 99996;
        pointer-events: none;
      `;

      if (showHandle) {
        const handle = document.createElement('div');
        handle.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 48px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        handle.innerHTML = `
          <svg width="8" height="24" viewBox="0 0 8 24" fill="none">
            <circle cx="2" cy="6" r="1.5" fill="#666"/>
            <circle cx="6" cy="6" r="1.5" fill="#666"/>
            <circle cx="2" cy="12" r="1.5" fill="#666"/>
            <circle cx="6" cy="12" r="1.5" fill="#666"/>
            <circle cx="2" cy="18" r="1.5" fill="#666"/>
            <circle cx="6" cy="18" r="1.5" fill="#666"/>
          </svg>
        `;
        divider.appendChild(handle);
      }

      document.body.appendChild(divider);
    },
    { color, width, showHandle: showDragHandle }
  );
}
```

### Sequential Transition Helper

```typescript
// demos/helpers/transition-effects.ts
import { Page } from '@playwright/test';

type TransitionType = 'wipe' | 'fade' | 'slide' | 'zoom';
type Direction = 'left' | 'right' | 'up' | 'down';

interface TransitionOptions {
  type?: TransitionType;
  direction?: Direction;
  duration?: number;
  showLabel?: boolean;
  label?: string;
}

export async function showTransitionOverlay(
  page: Page,
  options: TransitionOptions = {}
): Promise<void> {
  const {
    type = 'wipe',
    direction = 'right',
    duration = 1000,
    showLabel = true,
    label = 'AFTER',
  } = options;

  await page.evaluate(
    ({ type, direction, duration, showLabel, label }) => {
      const overlay = document.createElement('div');
      overlay.id = 'demo-transition-overlay';

      const baseStyle = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 99998;
        pointer-events: none;
      `;

      if (type === 'wipe') {
        overlay.style.cssText = `
          ${baseStyle}
          background: linear-gradient(
            ${direction === 'right' ? '90deg' : direction === 'left' ? '270deg' : direction === 'down' ? '180deg' : '0deg'},
            transparent 0%,
            rgba(0, 0, 0, 0.8) 45%,
            rgba(0, 0, 0, 0.8) 55%,
            transparent 100%
          );
          animation: demoWipe ${duration}ms ease-in-out forwards;
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'demo-transition-style';
        const startPos = direction === 'right' ? '-100%' : direction === 'left' ? '100%' : '0';
        const endPos = direction === 'right' ? '100%' : direction === 'left' ? '-100%' : '0';
        const startPosY = direction === 'down' ? '-100%' : direction === 'up' ? '100%' : '0';
        const endPosY = direction === 'down' ? '100%' : direction === 'up' ? '-100%' : '0';

        styleSheet.textContent = `
          @keyframes demoWipe {
            0% { transform: translate(${startPos}, ${startPosY}); }
            100% { transform: translate(${endPos}, ${endPosY}); }
          }
        `;
        document.head.appendChild(styleSheet);
      } else if (type === 'fade') {
        overlay.style.cssText = `
          ${baseStyle}
          background: black;
          animation: demoFadeInOut ${duration}ms ease-in-out forwards;
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'demo-transition-style';
        styleSheet.textContent = `
          @keyframes demoFadeInOut {
            0% { opacity: 0; }
            40% { opacity: 1; }
            60% { opacity: 1; }
            100% { opacity: 0; }
          }
        `;
        document.head.appendChild(styleSheet);
      }

      if (showLabel) {
        const labelEl = document.createElement('div');
        labelEl.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 24px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 4px;
        `;
        labelEl.textContent = label;
        overlay.appendChild(labelEl);
      }

      document.body.appendChild(overlay);

      setTimeout(() => {
        overlay.remove();
        const style = document.getElementById('demo-transition-style');
        if (style) style.remove();
      }, duration);
    },
    { type, direction, duration, showLabel, label }
  );

  await page.waitForTimeout(duration);
}
```

### Usage Examples

#### Split Screen Comparison Demo

```typescript
// demos/specs/demo-split-comparison.spec.ts
import { test } from '@playwright/test';
import { createComparisonDemo } from '../helpers/comparison-mode';
import { showOverlay } from '../helpers/overlay';

test.describe('Demo: UI Redesign Comparison', () => {
  test('split screen before/after', async ({ browser }) => {
    const comparison = await createComparisonDemo(browser, {
      layout: 'split',
      beforeUrl: '/dashboard?theme=legacy',
      afterUrl: '/dashboard?theme=modern',
      labels: { before: 'Current Design', after: 'New Design' },
      showMetrics: true,
    });

    // Wait for both pages to stabilize
    await comparison.both(async (page) => {
      await page.waitForTimeout(2000);
    });

    // Perform synchronized actions
    await comparison.both(async (page) => {
      await page.getByRole('button', { name: 'Menu' }).click();
      await page.waitForTimeout(1500);
    });

    await comparison.both(async (page) => {
      await page.getByRole('link', { name: 'Settings' }).click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    });

    // Show summary comparison
    await comparison.showSummary();
    await comparison.after.page.waitForTimeout(5000);

    await comparison.close();
  });
});
```

#### Sequential Transition Demo

```typescript
// demos/specs/demo-sequential-comparison.spec.ts
import { test } from '@playwright/test';
import { showTransitionOverlay } from '../helpers/transition-effects';
import { showOverlay } from '../helpers/overlay';
import { enablePerformanceOverlay, disablePerformanceOverlay } from '../helpers/performance-overlay';

test.describe('Demo: Performance Improvement', () => {
  test('before then after with transition', async ({ page }) => {
    // === Before ===
    await showOverlay(page, 'Before: Original Implementation', 2000);

    await enablePerformanceOverlay(page, {
      metrics: ['lcp', 'requests', 'transfer'],
      position: 'top-right',
    });

    await page.goto('/dashboard?version=v1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await disablePerformanceOverlay(page);

    // === Transition ===
    await showTransitionOverlay(page, {
      type: 'wipe',
      direction: 'right',
      duration: 1200,
      label: 'OPTIMIZED',
    });

    // === After ===
    await showOverlay(page, 'After: Optimized Implementation', 2000);

    await enablePerformanceOverlay(page, {
      metrics: ['lcp', 'requests', 'transfer'],
      position: 'top-right',
    });

    await page.goto('/dashboard?version=v2');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await disablePerformanceOverlay(page);

    await showOverlay(page, '60% faster load time!', 3000);
  });
});
```

#### A/B Test Variant Demo

```typescript
// demos/specs/demo-ab-test.spec.ts
import { test } from '@playwright/test';
import { createComparisonDemo } from '../helpers/comparison-mode';

test.describe('Demo: A/B Test Variants', () => {
  test('compare checkout flow variants', async ({ browser }) => {
    const comparison = await createComparisonDemo(browser, {
      layout: 'split',
      beforeUrl: '/checkout?variant=control',
      afterUrl: '/checkout?variant=streamlined',
      labels: { before: 'Control', after: 'Variant B' },
      showMetrics: false,
    });

    // Synchronized checkout flow
    await comparison.both(async (page) => {
      // Fill shipping
      await page.getByLabel('Address').fill('123 Demo Street');
      await page.waitForTimeout(500);

      await page.getByLabel('City').fill('San Francisco');
      await page.waitForTimeout(500);

      await page.getByRole('button', { name: 'Continue' }).click();
      await page.waitForTimeout(1500);
    });

    // Note: Variant B has fewer steps
    await comparison.afterOnly(async (page) => {
      // Already at payment in streamlined version
      await page.waitForTimeout(500);
    });

    await comparison.beforeOnly(async (page) => {
      // Control has extra review step
      await page.getByRole('button', { name: 'Review Order' }).click();
      await page.waitForTimeout(1000);
      await page.getByRole('button', { name: 'Continue to Payment' }).click();
      await page.waitForTimeout(500);
    });

    await comparison.showSummary();
    await comparison.after.page.waitForTimeout(4000);

    await comparison.close();
  });
});
```

---

## AI Narration System

Automatic voice narration generation for demo videos using TTS APIs.

### Narration Script Generator

```typescript
// demos/helpers/narration-script.ts
import { RecordedAction } from './scenario-recorder';

interface NarrationSegment {
  time: number;       // Start time in ms
  duration?: number;  // Optional duration
  text: string;       // Narration text
  pause?: number;     // Pause after segment in ms
}

type NarrationStyle = 'tutorial' | 'marketing' | 'technical' | 'conversational';
type NarrationPace = 'slow' | 'moderate' | 'fast';
type NarrationPersonality = 'friendly' | 'professional' | 'enthusiastic' | 'neutral';

interface ScriptGeneratorOptions {
  style?: NarrationStyle;
  pace?: NarrationPace;
  personality?: NarrationPersonality;
  includeIntro?: boolean;
  includeOutro?: boolean;
  productName?: string;
}

// Action type to narration templates
const actionTemplates: Record<string, Record<NarrationStyle, string[]>> = {
  navigate: {
    tutorial: [
      "Let's navigate to {value}.",
      "Now we'll go to {value}.",
      "Opening {value}.",
    ],
    marketing: [
      "Here's our {value} page.",
      "Welcome to {value}.",
      "Check out {value}.",
    ],
    technical: [
      "Navigating to {value}.",
      "Loading {value}.",
      "Accessing {value} endpoint.",
    ],
    conversational: [
      "Let me show you {value}.",
      "Here we are at {value}.",
      "Now let's look at {value}.",
    ],
  },
  click: {
    tutorial: [
      "Click on {selector}.",
      "Now click the {selector} button.",
      "Select {selector}.",
    ],
    marketing: [
      "Simply click {selector}.",
      "One click on {selector} and...",
      "Just hit {selector}.",
    ],
    technical: [
      "Clicking {selector}.",
      "Triggering {selector} action.",
      "Activating {selector}.",
    ],
    conversational: [
      "Let's click {selector}.",
      "I'll click on {selector} here.",
      "Now I'm clicking {selector}.",
    ],
  },
  fill: {
    tutorial: [
      "Enter {value} in the {selector} field.",
      "Type {value} here.",
      "Fill in {selector} with {value}.",
    ],
    marketing: [
      "Just enter your {selector}.",
      "Quick and easy - add your {selector}.",
      "Simply fill in {selector}.",
    ],
    technical: [
      "Inputting {value} into {selector}.",
      "Populating {selector} field.",
      "Setting {selector} to {value}.",
    ],
    conversational: [
      "I'll type {value} here.",
      "Let me enter {value} in this field.",
      "Adding {value} to {selector}.",
    ],
  },
  overlay: {
    tutorial: [
      "{value}",
      "{value}",
      "{value}",
    ],
    marketing: [
      "{value}",
      "{value}",
      "{value}",
    ],
    technical: [
      "{value}",
      "{value}",
      "{value}",
    ],
    conversational: [
      "{value}",
      "{value}",
      "{value}",
    ],
  },
};

const paceMultipliers: Record<NarrationPace, number> = {
  slow: 1.5,
  moderate: 1.0,
  fast: 0.7,
};

export function generateNarrationScript(
  actions: RecordedAction[],
  options: ScriptGeneratorOptions = {}
): NarrationSegment[] {
  const {
    style = 'tutorial',
    pace = 'moderate',
    personality = 'friendly',
    includeIntro = true,
    includeOutro = true,
    productName = 'the application',
  } = options;

  const segments: NarrationSegment[] = [];
  const paceMultiplier = paceMultipliers[pace];

  // Intro
  if (includeIntro) {
    const intros: Record<NarrationStyle, string> = {
      tutorial: `Welcome to this tutorial. Today we'll walk through ${productName} step by step.`,
      marketing: `Discover how ${productName} can transform your workflow.`,
      technical: `This demonstration covers the key features of ${productName}.`,
      conversational: `Hey there! Let me show you around ${productName}.`,
    };
    segments.push({
      time: 0,
      text: intros[style],
      pause: Math.round(1000 * paceMultiplier),
    });
  }

  // Process actions
  actions.forEach((action, index) => {
    const templates = actionTemplates[action.type]?.[style];
    if (!templates) return;

    // Use description if available, otherwise generate from template
    let text: string;
    if (action.description && action.type === 'overlay') {
      text = action.description.replace('Show: ', '');
    } else if (action.description) {
      text = action.description;
    } else {
      const template = templates[index % templates.length];
      text = template
        .replace('{value}', action.value || '')
        .replace('{selector}', formatSelector(action.selector || ''));
    }

    segments.push({
      time: action.elapsed,
      text,
      pause: Math.round(500 * paceMultiplier),
    });
  });

  // Outro
  if (includeOutro) {
    const lastAction = actions[actions.length - 1];
    const outroTime = lastAction ? lastAction.elapsed + 2000 : 5000;

    const outros: Record<NarrationStyle, string> = {
      tutorial: "That's all for this tutorial. Thanks for watching!",
      marketing: `Start using ${productName} today and see the difference.`,
      technical: "This concludes the demonstration.",
      conversational: "And that's it! Pretty simple, right?",
    };
    segments.push({
      time: outroTime,
      text: outros[style],
    });
  }

  return segments;
}

function formatSelector(selector: string): string {
  // Convert technical selectors to readable text
  if (selector.startsWith('[data-testid="')) {
    return selector.replace('[data-testid="', '').replace('"]', '').replace(/-/g, ' ');
  }
  if (selector.startsWith('#')) {
    return selector.slice(1).replace(/-/g, ' ');
  }
  if (selector.startsWith('.')) {
    return selector.slice(1).replace(/-/g, ' ');
  }
  return selector;
}

// Manual script builder
export function createNarrationScript(
  segments: Array<{ time: number; text: string; pause?: number }>
): NarrationSegment[] {
  return segments.map((s) => ({
    time: s.time,
    text: s.text,
    pause: s.pause || 500,
  }));
}
```

### Web Speech API (Browser Built-in TTS)

Free, no API key required. Uses browser's built-in speech synthesis.

```typescript
// demos/helpers/web-speech-tts.ts
import { Page } from '@playwright/test';
import { NarrationSegment } from './narration-script';
import fs from 'fs/promises';
import path from 'path';

interface WebSpeechOptions {
  voice?: string;        // Voice name (e.g., 'Google US English', 'Samantha')
  lang?: string;         // Language code (e.g., 'en-US', 'ja-JP')
  rate?: number;         // Speech rate 0.1-10 (default: 1)
  pitch?: number;        // Pitch 0-2 (default: 1)
  volume?: number;       // Volume 0-1 (default: 1)
}

interface WebSpeechNarrationOptions extends WebSpeechOptions {
  script: NarrationSegment[];
  outputPath: string;
}

// Get available voices in the browser
export async function getAvailableVoices(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    return new Promise<string[]>((resolve) => {
      const getVoices = () => {
        const voices = speechSynthesis.getVoices();
        resolve(voices.map((v) => `${v.name} (${v.lang})`));
      };

      if (speechSynthesis.getVoices().length > 0) {
        getVoices();
      } else {
        speechSynthesis.onvoiceschanged = getVoices;
      }
    });
  });
}

// Speak text and record audio using Web Speech API + MediaRecorder
export async function speakAndRecord(
  page: Page,
  text: string,
  options: WebSpeechOptions = {}
): Promise<Buffer> {
  const { voice, lang = 'en-US', rate = 1, pitch = 1, volume = 1 } = options;

  const audioBase64 = await page.evaluate(
    async ({ text, voice, lang, rate, pitch, volume }) => {
      return new Promise<string>((resolve, reject) => {
        // Create audio context for recording
        const audioContext = new AudioContext();
        const destination = audioContext.createMediaStreamDestination();
        const mediaRecorder = new MediaRecorder(destination.stream, {
          mimeType: 'audio/webm;codecs=opus',
        });

        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          const arrayBuffer = await blob.arrayBuffer();
          const base64 = btoa(
            new Uint8Array(arrayBuffer).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          );
          resolve(base64);
        };

        // Setup speech synthesis
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        // Find specified voice
        if (voice) {
          const voices = speechSynthesis.getVoices();
          const selectedVoice = voices.find((v) => v.name.includes(voice));
          if (selectedVoice) utterance.voice = selectedVoice;
        }

        // Connect system audio to recorder (requires user gesture in some browsers)
        // For Playwright, we use a workaround with oscillator
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0; // Silent
        oscillator.connect(gainNode);
        gainNode.connect(destination);
        oscillator.start();

        utterance.onstart = () => {
          mediaRecorder.start();
        };

        utterance.onend = () => {
          oscillator.stop();
          mediaRecorder.stop();
        };

        utterance.onerror = (e) => {
          reject(new Error(`Speech synthesis error: ${e.error}`));
        };

        speechSynthesis.speak(utterance);
      });
    },
    { text, voice, lang, rate, pitch, volume }
  );

  return Buffer.from(audioBase64, 'base64');
}

// Alternative: Use page audio capture with speech synthesis
export async function generateWebSpeechNarration(
  page: Page,
  options: WebSpeechNarrationOptions
): Promise<string> {
  const { script, outputPath, voice, lang = 'en-US', rate = 1, pitch = 1 } = options;

  // Ensure output directory exists
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  // Generate narration in browser and capture
  const audioData = await page.evaluate(
    async ({ script, voice, lang, rate, pitch }) => {
      // Wait for voices to load
      await new Promise<void>((resolve) => {
        if (speechSynthesis.getVoices().length > 0) {
          resolve();
        } else {
          speechSynthesis.onvoiceschanged = () => resolve();
        }
      });

      const voices = speechSynthesis.getVoices();
      const selectedVoice = voice
        ? voices.find((v) => v.name.includes(voice))
        : voices.find((v) => v.lang.startsWith(lang.split('-')[0]));

      // Generate all speech segments
      const audioSegments: { time: number; duration: number; text: string }[] = [];

      for (const segment of script) {
        const utterance = new SpeechSynthesisUtterance(segment.text);
        utterance.lang = lang;
        utterance.rate = rate;
        utterance.pitch = pitch;
        if (selectedVoice) utterance.voice = selectedVoice;

        // Estimate duration (rough calculation)
        const wordCount = segment.text.split(/\s+/).length;
        const baseDuration = (wordCount / 150) * 60 * 1000; // 150 WPM average
        const adjustedDuration = baseDuration / rate;

        audioSegments.push({
          time: segment.time,
          duration: adjustedDuration,
          text: segment.text,
        });
      }

      return audioSegments;
    },
    { script, voice, lang, rate, pitch }
  );

  // Return script timing info (actual audio needs different approach)
  const timingPath = outputPath.replace(/\.[^.]+$/, '_timing.json');
  await fs.writeFile(timingPath, JSON.stringify(audioData, null, 2));

  return timingPath;
}

// Real-time narration during demo recording
export async function speakDuringDemo(
  page: Page,
  text: string,
  options: WebSpeechOptions = {}
): Promise<void> {
  const { voice, lang = 'en-US', rate = 1, pitch = 1, volume = 1 } = options;

  await page.evaluate(
    ({ text, voice, lang, rate, pitch, volume }) => {
      return new Promise<void>((resolve, reject) => {
        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        // Find voice
        const voices = speechSynthesis.getVoices();
        if (voice) {
          const selected = voices.find((v) => v.name.includes(voice));
          if (selected) utterance.voice = selected;
        } else {
          // Default to a good quality voice
          const preferred = voices.find(
            (v) => v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Neural')
          );
          if (preferred) utterance.voice = preferred;
        }

        utterance.onend = () => resolve();
        utterance.onerror = (e) => reject(new Error(e.error));

        speechSynthesis.speak(utterance);
      });
    },
    { text, voice, lang, rate, pitch, volume }
  );
}

// Speak and wait for completion
export async function speakAndWait(
  page: Page,
  text: string,
  options: WebSpeechOptions = {}
): Promise<number> {
  const startTime = Date.now();
  await speakDuringDemo(page, text, options);
  return Date.now() - startTime;
}
```

### Real-Time Narration Demo Example

```typescript
// demos/specs/demo-with-live-narration.spec.ts
import { test } from '@playwright/test';
import { speakAndWait, getAvailableVoices } from '../helpers/web-speech-tts';
import { showOverlay } from '../helpers/overlay';

test.describe('Demo: Live Narration with Web Speech API', () => {
  test.beforeAll(async ({ browser }) => {
    // List available voices (for debugging)
    const page = await browser.newPage();
    const voices = await getAvailableVoices(page);
    console.log('Available voices:', voices.slice(0, 10));
    await page.close();
  });

  test('dashboard demo with live narration', async ({ page }) => {
    // Navigate to app
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Narrate and show overlay simultaneously
    await Promise.all([
      speakAndWait(page, 'Welcome to our dashboard. Let me show you around.', {
        rate: 0.9,
        voice: 'Google', // Will match 'Google US English' etc.
      }),
      showOverlay(page, 'Welcome to the Dashboard', 3000),
    ]);

    // Navigate to projects
    await speakAndWait(page, "First, let's create a new project.", { rate: 0.9 });
    await page.getByRole('button', { name: 'Create Project' }).click();
    await page.waitForTimeout(500);

    // Fill form with narration
    await speakAndWait(page, 'Enter your project name here.', { rate: 0.9 });
    await page.getByLabel('Project Name').fill('My Demo Project');
    await page.waitForTimeout(300);

    // Save
    await speakAndWait(page, 'Click save to create the project.', { rate: 0.9 });
    await page.getByRole('button', { name: 'Save' }).click();

    // Success
    await Promise.all([
      speakAndWait(page, 'And there you have it! Your project is ready.', { rate: 0.9 }),
      showOverlay(page, 'Project Created!', 2500),
    ]);
  });
});
```

### Playwright Config for Audio Capture

```typescript
// playwright.config.narration.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './demos/specs',
  timeout: 180000,
  retries: 0,
  workers: 1,

  use: {
    // Enable audio for Web Speech API
    launchOptions: {
      args: [
        '--autoplay-policy=no-user-gesture-required',
        '--enable-speech-dispatcher',
      ],
    },
    // Video recording captures browser audio
    video: {
      mode: 'on',
      size: { width: 1280, height: 720 },
    },
    viewport: { width: 1280, height: 720 },
    // Permissions for audio
    permissions: ['microphone'],
    contextOptions: {
      // Record audio with video (Chromium only)
      recordVideo: {
        dir: 'demos/output/',
        size: { width: 1280, height: 720 },
      },
    },
  },

  projects: [
    {
      name: 'demo-narrated',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome', // Use installed Chrome for better TTS
      },
    },
  ],
});
```

### Voice Selection Helper

```typescript
// demos/helpers/voice-selector.ts
import { Page } from '@playwright/test';

interface VoiceInfo {
  name: string;
  lang: string;
  localService: boolean;
  default: boolean;
}

// Recommended voices by platform and language
export const recommendedVoices = {
  'en-US': {
    mac: ['Samantha', 'Alex', 'Karen'],
    windows: ['Microsoft David', 'Microsoft Zira'],
    linux: ['english-us'],
    chrome: ['Google US English'],
  },
  'en-GB': {
    mac: ['Daniel', 'Kate'],
    windows: ['Microsoft George', 'Microsoft Hazel'],
    chrome: ['Google UK English Female', 'Google UK English Male'],
  },
  'ja-JP': {
    mac: ['Kyoko', 'Otoya'],
    windows: ['Microsoft Haruka', 'Microsoft Ichiro'],
    chrome: ['Google 日本語'],
  },
  'zh-CN': {
    mac: ['Tingting'],
    windows: ['Microsoft Huihui'],
    chrome: ['Google 普通话（中国大陆）'],
  },
};

export async function findBestVoice(
  page: Page,
  lang: string = 'en-US'
): Promise<string | undefined> {
  const voices = await page.evaluate(() => {
    return speechSynthesis.getVoices().map((v) => ({
      name: v.name,
      lang: v.lang,
      localService: v.localService,
      default: v.default,
    }));
  });

  // Find voices matching the language
  const langVoices = voices.filter((v) => v.lang.startsWith(lang.split('-')[0]));

  // Prefer high-quality voices
  const qualityIndicators = ['Premium', 'Neural', 'Enhanced', 'Google', 'Microsoft'];
  const highQuality = langVoices.find((v) =>
    qualityIndicators.some((q) => v.name.includes(q))
  );

  if (highQuality) return highQuality.name;

  // Fallback to any matching voice
  return langVoices[0]?.name;
}

// Demo with auto voice selection
export async function createNarratedDemo(page: Page, lang: string = 'en-US') {
  const voice = await findBestVoice(page, lang);
  console.log(`Using voice: ${voice || 'default'}`);

  return {
    speak: async (text: string, options: { rate?: number; pitch?: number } = {}) => {
      const { rate = 0.9, pitch = 1 } = options;
      await page.evaluate(
        ({ text, voice, lang, rate, pitch }) => {
          return new Promise<void>((resolve) => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = rate;
            utterance.pitch = pitch;

            if (voice) {
              const voices = speechSynthesis.getVoices();
              const selected = voices.find((v) => v.name === voice);
              if (selected) utterance.voice = selected;
            }

            utterance.onend = () => resolve();
            speechSynthesis.speak(utterance);
          });
        },
        { text, voice, lang, rate, pitch }
      );
    },
  };
}
```

### Usage: Simple Narrated Demo

```typescript
// demos/specs/demo-simple-narration.spec.ts
import { test } from '@playwright/test';
import { createNarratedDemo } from '../helpers/voice-selector';

test('simple narrated demo', async ({ page }) => {
  const narrator = await createNarratedDemo(page, 'en-US');

  await page.goto('/');
  await narrator.speak('Welcome to our application.');

  await page.getByRole('link', { name: 'Features' }).click();
  await narrator.speak('Here are our key features.');

  await page.waitForTimeout(2000);
  await narrator.speak('Thank you for watching!');
});
```

---

## Progress Bar Helper

Display demo progress at the top or bottom of the screen with step-based or percentage-based modes.

```typescript
// demos/helpers/progress-bar.ts
import { Page } from '@playwright/test';

interface ProgressBarOptions {
  position?: 'top' | 'bottom';
  mode?: 'steps' | 'percentage' | 'timed';
  steps?: number;
  duration?: number;  // for timed mode (ms)
  color?: string;
  backgroundColor?: string;
  height?: number;
  showLabel?: boolean;
}

export async function showProgressBar(
  page: Page,
  options: ProgressBarOptions = {}
): Promise<void> {
  const {
    position = 'top',
    mode = 'steps',
    steps = 5,
    color = '#3b82f6',
    backgroundColor = 'rgba(255, 255, 255, 0.2)',
    height = 4,
    showLabel = true,
  } = options;

  await page.evaluate(
    ({ position, mode, steps, color, backgroundColor, height, showLabel }) => {
      // Remove existing
      document.getElementById('demo-progress-container')?.remove();

      const container = document.createElement('div');
      container.id = 'demo-progress-container';
      container.style.cssText = `
        position: fixed;
        ${position}: 0;
        left: 0;
        right: 0;
        z-index: 99999;
        padding: 0;
      `;

      const bar = document.createElement('div');
      bar.id = 'demo-progress-bar';
      bar.style.cssText = `
        width: 0%;
        height: ${height}px;
        background: ${color};
        transition: width 0.3s ease;
      `;

      const track = document.createElement('div');
      track.style.cssText = `
        width: 100%;
        height: ${height}px;
        background: ${backgroundColor};
      `;
      track.appendChild(bar);
      container.appendChild(track);

      if (showLabel) {
        const label = document.createElement('div');
        label.id = 'demo-progress-label';
        label.style.cssText = `
          position: absolute;
          ${position === 'top' ? 'top' : 'bottom'}: ${height + 8}px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-family: system-ui, sans-serif;
          white-space: nowrap;
        `;
        label.textContent = mode === 'steps' ? `Step 0/${steps}` : '0%';
        container.appendChild(label);
      }

      // Store config
      (window as any).__progressConfig = { mode, steps };

      document.body.appendChild(container);
    },
    { position, mode, steps, color, backgroundColor, height, showLabel }
  );
}

export async function updateProgress(
  page: Page,
  current: number,
  message?: string
): Promise<void> {
  await page.evaluate(
    ({ current, message }) => {
      const bar = document.getElementById('demo-progress-bar');
      const label = document.getElementById('demo-progress-label');
      const config = (window as any).__progressConfig || { mode: 'steps', steps: 5 };

      if (!bar) return;

      let percentage: number;
      let labelText: string;

      if (config.mode === 'steps') {
        percentage = (current / config.steps) * 100;
        labelText = message ? `Step ${current}/${config.steps}: ${message}` : `Step ${current}/${config.steps}`;
      } else {
        percentage = current;
        labelText = message ? `${current}%: ${message}` : `${current}%`;
      }

      bar.style.width = `${percentage}%`;
      if (label) {
        label.textContent = labelText;
      }
    },
    { current, message }
  );

  // Brief pause for visual feedback
  await page.waitForTimeout(100);
}

export async function hideProgressBar(page: Page): Promise<void> {
  await page.evaluate(() => {
    const container = document.getElementById('demo-progress-container');
    if (container) {
      container.style.transition = 'opacity 0.3s ease';
      container.style.opacity = '0';
      setTimeout(() => container.remove(), 300);
    }
    delete (window as any).__progressConfig;
  });
}
```

---

## Spotlight Effect Helper

Highlight specific UI elements by darkening the surrounding area with SVG mask technique.

```typescript
// demos/helpers/spotlight.ts
import { Page } from '@playwright/test';

interface SpotlightOptions {
  padding?: number;
  opacity?: number;
  color?: string;
  label?: string;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  borderRadius?: number;
  animated?: boolean;
}

export async function spotlight(
  page: Page,
  selector: string,
  options: SpotlightOptions = {}
): Promise<void> {
  const {
    padding = 8,
    opacity = 0.7,
    color = 'rgba(0, 0, 0)',
    label,
    labelPosition = 'bottom',
    borderRadius = 8,
    animated = true,
  } = options;

  await page.evaluate(
    ({ selector, padding, opacity, color, label, labelPosition, borderRadius, animated }) => {
      // Remove existing spotlight
      document.getElementById('demo-spotlight-overlay')?.remove();

      const element = document.querySelector(selector);
      if (!element) {
        console.warn(`Spotlight: Element not found: ${selector}`);
        return;
      }

      const rect = element.getBoundingClientRect();

      // Create overlay with hole
      const overlay = document.createElement('div');
      overlay.id = 'demo-spotlight-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 99998;
        pointer-events: none;
        ${animated ? 'animation: demoSpotlightFadeIn 0.3s ease;' : ''}
      `;

      // SVG mask for the hole
      const holeX = rect.left - padding;
      const holeY = rect.top - padding;
      const holeW = rect.width + padding * 2;
      const holeH = rect.height + padding * 2;

      overlay.innerHTML = `
        <svg width="100%" height="100%" style="position: absolute; top: 0; left: 0;">
          <defs>
            <mask id="spotlight-mask">
              <rect width="100%" height="100%" fill="white"/>
              <rect x="${holeX}" y="${holeY}" width="${holeW}" height="${holeH}"
                    rx="${borderRadius}" fill="black"/>
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="${color}" fill-opacity="${opacity}"
                mask="url(#spotlight-mask)"/>
        </svg>
      `;

      // Add pulse border around element
      const highlight = document.createElement('div');
      highlight.id = 'demo-spotlight-highlight';
      highlight.style.cssText = `
        position: fixed;
        left: ${holeX}px;
        top: ${holeY}px;
        width: ${holeW}px;
        height: ${holeH}px;
        border: 2px solid rgba(59, 130, 246, 0.8);
        border-radius: ${borderRadius}px;
        z-index: 99999;
        pointer-events: none;
        animation: demoSpotlightPulse 2s ease-in-out infinite;
      `;
      overlay.appendChild(highlight);

      // Add label if provided
      if (label) {
        const labelEl = document.createElement('div');
        labelEl.id = 'demo-spotlight-label';

        let labelX: number, labelY: number, transform: string;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        switch (labelPosition) {
          case 'top':
            labelX = centerX;
            labelY = rect.top - padding - 12;
            transform = 'translate(-50%, -100%)';
            break;
          case 'bottom':
            labelX = centerX;
            labelY = rect.bottom + padding + 12;
            transform = 'translate(-50%, 0)';
            break;
          case 'left':
            labelX = rect.left - padding - 12;
            labelY = centerY;
            transform = 'translate(-100%, -50%)';
            break;
          case 'right':
            labelX = rect.right + padding + 12;
            labelY = centerY;
            transform = 'translate(0, -50%)';
            break;
        }

        labelEl.style.cssText = `
          position: fixed;
          left: ${labelX}px;
          top: ${labelY}px;
          transform: ${transform};
          background: rgba(59, 130, 246, 0.95);
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-family: system-ui, sans-serif;
          font-weight: 500;
          z-index: 99999;
          pointer-events: none;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        labelEl.textContent = label;
        overlay.appendChild(labelEl);
      }

      // Add keyframes
      const style = document.createElement('style');
      style.id = 'demo-spotlight-styles';
      style.textContent = `
        @keyframes demoSpotlightFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes demoSpotlightPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
        }
      `;
      document.head.appendChild(style);

      document.body.appendChild(overlay);
    },
    { selector, padding, opacity, color, label, labelPosition, borderRadius, animated }
  );
}

export async function clearSpotlight(page: Page): Promise<void> {
  await page.evaluate(() => {
    const overlay = document.getElementById('demo-spotlight-overlay');
    if (overlay) {
      overlay.style.transition = 'opacity 0.2s ease';
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
        document.getElementById('demo-spotlight-styles')?.remove();
      }, 200);
    }
  });
}

// Move spotlight to new element
export async function moveSpotlight(
  page: Page,
  selector: string,
  options: SpotlightOptions = {}
): Promise<void> {
  await clearSpotlight(page);
  await page.waitForTimeout(100);
  await spotlight(page, selector, { ...options, animated: true });
}
```

---

## Combined Usage: Progress Bar + Spotlight

Example demonstrating both visual effects working together for a guided tour demo.

```typescript
// demos/specs/demo-onboarding.spec.ts
import { test } from '@playwright/test';
import { showProgressBar, updateProgress, hideProgressBar } from '../helpers/progress-bar';
import { spotlight, clearSpotlight, moveSpotlight } from '../helpers/spotlight';

test.describe('Demo: Onboarding Flow', () => {
  test('guided tour with progress and spotlight', async ({ page }) => {
    // Initialize progress bar
    await showProgressBar(page, { position: 'top', steps: 4 });

    await page.goto('/dashboard');
    await updateProgress(page, 1, 'Welcome');

    // Spotlight: Navigation menu
    await spotlight(page, '[data-testid="nav-menu"]', {
      label: 'Main navigation',
      labelPosition: 'right',
    });
    await page.waitForTimeout(2000);

    await updateProgress(page, 2, 'Navigation');
    await moveSpotlight(page, '[data-testid="create-btn"]', {
      label: 'Create new project',
      labelPosition: 'bottom',
    });
    await page.waitForTimeout(2000);

    await updateProgress(page, 3, 'Create Project');
    await clearSpotlight(page);
    await page.click('[data-testid="create-btn"]');

    await updateProgress(page, 4, 'Complete!');
    await page.waitForTimeout(1500);
    await hideProgressBar(page);
  });
});
```

---

### Device-Specific Presets

Pre-configured settings for common demo scenarios.

```typescript
// demos/helpers/interaction-presets.ts
import { Page } from '@playwright/test';
import { enableInteractionFeedback, InteractionFeedbackConfig } from './interaction-feedback';

export const InteractionPresets: Record<string, InteractionFeedbackConfig> = {
  desktop: {
    showCursor: true,
    showClickRipple: true,
    showTapIndicator: false,
    showSwipeTrail: false,
    showKeystrokeOverlay: true,
    keystrokePosition: 'bottom',
  },
  mobile: {
    showCursor: false,
    showClickRipple: false,
    showTapIndicator: true,
    showSwipeTrail: true,
    showKeystrokeOverlay: false,
  },
  tablet: {
    showCursor: false,
    showClickRipple: false,
    showTapIndicator: true,
    showSwipeTrail: true,
    showKeystrokeOverlay: true,
    keystrokePosition: 'top',
  },
};

export async function enableDesktopFeedback(page: Page): Promise<void> {
  await enableInteractionFeedback(page, InteractionPresets.desktop);
}

export async function enableMobileFeedback(page: Page): Promise<void> {
  await enableInteractionFeedback(page, InteractionPresets.mobile);
}

export async function enableTabletFeedback(page: Page): Promise<void> {
  await enableInteractionFeedback(page, InteractionPresets.tablet);
}
```

### Usage Examples

#### Desktop Demo Example

```typescript
// demos/specs/demo-desktop-workflow.spec.ts
import { test, expect } from '@playwright/test';
import { enableDesktopFeedback, disableInteractionFeedback } from '../helpers/interaction-presets';
import { showOverlay } from '../helpers/overlay';

test.describe('Demo: Desktop Workflow with Visual Feedback', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await enableDesktopFeedback(page);
  });

  test.afterEach(async ({ page }) => {
    await disableInteractionFeedback(page);
  });

  test('file management with keyboard shortcuts', async ({ page }) => {
    await showOverlay(page, 'Let\'s create a new document', 2000);

    // Keyboard shortcut - auto-displayed by feedback system
    await page.keyboard.press('Meta+n');
    await expect(page.getByRole('dialog', { name: 'New Document' })).toBeVisible();

    // Click interaction - auto-ripple displayed
    await page.getByRole('textbox', { name: 'Title' }).fill('My Document');
    await page.getByRole('button', { name: 'Create' }).click();

    await showOverlay(page, 'Document created!', 2000);

    // Save with shortcut
    await page.keyboard.press('Meta+s');
    await expect(page.getByText('Saved')).toBeVisible();
  });
});
```

#### Mobile Demo Example

```typescript
// demos/specs/demo-mobile-gestures.spec.ts
import { test, expect, devices } from '@playwright/test';
import { enableMobileFeedback, disableInteractionFeedback } from '../helpers/interaction-presets';
import { showSwipeTrail, showTapIndicator } from '../helpers/interaction-feedback';
import { showOverlay } from '../helpers/overlay';

test.describe('Demo: Mobile App with Touch Feedback', () => {
  test.use({ ...devices['iPhone 14 Pro'] });

  test.beforeEach(async ({ page }) => {
    await page.goto('/mobile/gallery');
    await enableMobileFeedback(page);
  });

  test.afterEach(async ({ page }) => {
    await disableInteractionFeedback(page);
  });

  test('swipe through image gallery', async ({ page }) => {
    await showOverlay(page, 'Swipe to browse images', 2000);

    // Get viewport dimensions
    const viewport = page.viewportSize();
    if (!viewport) return;

    const centerY = viewport.height / 2;
    const startX = viewport.width * 0.8;
    const endX = viewport.width * 0.2;

    // Show swipe trail then perform gesture
    await showSwipeTrail(page, startX, centerY, endX, centerY);

    // Perform swipe
    await page.mouse.move(startX, centerY);
    await page.mouse.down();
    await page.mouse.move(endX, centerY, { steps: 20 });
    await page.mouse.up();

    await page.waitForTimeout(500);

    // Tap on image to view full screen
    const image = page.getByTestId('gallery-image-2');
    const box = await image.boundingBox();
    if (box) {
      await showTapIndicator(page, box.x + box.width / 2, box.y + box.height / 2);
      await image.tap();
    }

    await expect(page.getByTestId('fullscreen-viewer')).toBeVisible();
    await showOverlay(page, 'Full screen view', 1500);
  });
});
```

---

## Page Transition Wait Pattern

### Stable Transition Wait

```typescript
// demos/helpers/navigation.ts
import { Page, expect } from '@playwright/test';

export async function waitForPageReady(page: Page): Promise<void> {
  // DOM load complete
  await page.waitForLoadState('domcontentloaded');
  // Network idle
  await page.waitForLoadState('networkidle');
  // Additional stabilization wait
  await page.waitForTimeout(300);
}

export async function navigateAndWait(
  page: Page,
  action: () => Promise<void>,
  expectedUrl: string | RegExp
): Promise<void> {
  await action();
  await page.waitForURL(expectedUrl);
  await waitForPageReady(page);
}

// Usage
test('flow with page transitions', async ({ page }) => {
  await page.goto('/');

  await navigateAndWait(
    page,
    () => page.click('[data-testid="login-link"]'),
    '**/login'
  );

  // Login form is fully displayed
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
});
```

---

## Test Data Factory

### Preparing Demo Data

```typescript
// demos/helpers/data.ts
export const DemoData = {
  user: {
    email: 'demo@example.com',
    password: 'DemoPass123',
    name: 'Demo User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
  },

  address: {
    postalCode: '150-0001',
    country: 'Japan',
    city: 'Tokyo',
    street: '1-2-3 Shibuya',
    building: 'Demo Building 101',
  },

  product: {
    name: 'Sample Product A',
    price: 39.80,
    description: 'High quality sample product.',
    image: '/fixtures/product-a.jpg',
  },

  creditCard: {
    number: '4242 4242 4242 4242',
    expiry: '12/25',
    cvc: '123',
    name: 'DEMO USER',
  },

  // Generate random but consistent data
  generateOrder(): { id: string; date: string; total: number } {
    return {
      id: 'ORD-2024-0001',
      date: 'January 15, 2024',
      total: 43.78, // Product price + tax
    };
  },
};

// Seed data setup
export async function seedDemoData(page: Page): Promise<void> {
  await page.evaluate((data) => {
    // Set demo data to LocalStorage
    localStorage.setItem('demo_user', JSON.stringify(data.user));
  }, DemoData);
}
```

---

## Persona-Aware Demo Recording

### Echo Integration Patterns

When Echo provides persona behavior profiles, use these patterns to create believable persona-specific demos.

#### Persona Configuration Helper

```typescript
// demos/helpers/persona.ts
import { Page } from '@playwright/test';

export interface PersonaBehavior {
  name: string;
  slowMo: number;
  readingMultiplier: number;
  hesitationPoints: string[];
  hesitationDuration: number;
  overlayDuration: number;
  typingSpeed: 'fast' | 'normal' | 'slow' | 'hunt-and-peck';
}

export const PersonaBehaviors: Record<string, PersonaBehavior> = {
  senior: {
    name: 'Senior',
    slowMo: 800,
    readingMultiplier: 1.5,
    hesitationPoints: ['form-submit', 'payment', 'terms', 'navigation'],
    hesitationDuration: 500,
    overlayDuration: 3000,
    typingSpeed: 'slow',
  },
  newbie: {
    name: 'Newbie',
    slowMo: 650,
    readingMultiplier: 1.3,
    hesitationPoints: ['navigation', 'form-fields', 'confirmation', 'unknown-icons'],
    hesitationDuration: 400,
    overlayDuration: 2500,
    typingSpeed: 'normal',
  },
  powerUser: {
    name: 'Power User',
    slowMo: 350,
    readingMultiplier: 0.8,
    hesitationPoints: [],
    hesitationDuration: 0,
    overlayDuration: 1500,
    typingSpeed: 'fast',
  },
  mobileUser: {
    name: 'Mobile User',
    slowMo: 500,
    readingMultiplier: 1.0,
    hesitationPoints: ['small-buttons', 'forms', 'dropdown'],
    hesitationDuration: 200,
    overlayDuration: 2000,
    typingSpeed: 'normal',
  },
  skeptic: {
    name: 'Skeptic',
    slowMo: 550,
    readingMultiplier: 1.4,
    hesitationPoints: ['payment', 'personal-info', 'permissions', 'terms'],
    hesitationDuration: 600,
    overlayDuration: 2500,
    typingSpeed: 'normal',
  },
  distracted: {
    name: 'Distracted User',
    slowMo: 600,
    readingMultiplier: 0.9,
    hesitationPoints: ['long-forms', 'multi-step'],
    hesitationDuration: 400,
    overlayDuration: 2000,
    typingSpeed: 'normal',
  },
};

// Get persona from environment or default
export function getPersona(name?: string): PersonaBehavior {
  const personaName = name || process.env.DEMO_PERSONA || 'newbie';
  return PersonaBehaviors[personaName.toLowerCase()] || PersonaBehaviors.newbie;
}
```

#### Persona-Aware Wait Helper

```typescript
// demos/helpers/persona-wait.ts
import { Page } from '@playwright/test';
import { PersonaBehavior, getPersona } from './persona';

export async function personaWait(
  page: Page,
  baseTime: number,
  persona?: PersonaBehavior
): Promise<void> {
  const p = persona || getPersona();
  const adjustedTime = Math.round(baseTime * p.readingMultiplier);
  await page.waitForTimeout(adjustedTime);
}

export async function hesitate(
  page: Page,
  action: string,
  persona?: PersonaBehavior
): Promise<void> {
  const p = persona || getPersona();

  // Check if this action triggers hesitation for this persona
  const shouldHesitate = p.hesitationPoints.some(
    (point) => action.toLowerCase().includes(point.toLowerCase())
  );

  if (shouldHesitate && p.hesitationDuration > 0) {
    await page.waitForTimeout(p.hesitationDuration);
  }
}

export async function showPersonaOverlay(
  page: Page,
  message: string,
  persona?: PersonaBehavior
): Promise<void> {
  const p = persona || getPersona();

  await page.evaluate(
    ({ msg, dur }) => {
      const overlay = document.createElement('div');
      overlay.id = 'demo-overlay';
      overlay.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.85);
        color: white;
        padding: 16px 32px;
        border-radius: 8px;
        font-size: 18px;
        z-index: 99999;
      `;
      overlay.textContent = msg;
      document.body.appendChild(overlay);
      setTimeout(() => overlay.remove(), dur);
    },
    { msg: message, dur: p.overlayDuration }
  );

  await page.waitForTimeout(p.overlayDuration);
}
```

#### Persona-Aware Typing Helper

```typescript
// demos/helpers/persona-typing.ts
import { Page } from '@playwright/test';
import { PersonaBehavior, getPersona } from './persona';

const typingSpeeds = {
  fast: 30,
  normal: 60,
  slow: 120,
  'hunt-and-peck': 250,
};

export async function personaFill(
  page: Page,
  selector: string,
  value: string,
  persona?: PersonaBehavior
): Promise<void> {
  const p = persona || getPersona();
  const charDelay = typingSpeeds[p.typingSpeed];

  // Clear first
  await page.locator(selector).clear();

  // Type character by character for realistic effect
  for (const char of value) {
    await page.locator(selector).pressSequentially(char, { delay: charDelay });
  }

  // Post-input pause (persona reads what they typed)
  await page.waitForTimeout(Math.round(200 * p.readingMultiplier));
}

// Label-based version
export async function personaFillByLabel(
  page: Page,
  label: string,
  value: string,
  persona?: PersonaBehavior
): Promise<void> {
  const p = persona || getPersona();
  const charDelay = typingSpeeds[p.typingSpeed];

  const input = page.getByLabel(label);
  await input.clear();

  for (const char of value) {
    await input.pressSequentially(char, { delay: charDelay });
  }

  await page.waitForTimeout(Math.round(200 * p.readingMultiplier));
}
```

### Persona Demo Test Example

```typescript
// demos/specs/demo-checkout-persona.spec.ts
import { test, expect } from '@playwright/test';
import { getPersona, PersonaBehavior } from '../helpers/persona';
import { hesitate, personaWait, showPersonaOverlay } from '../helpers/persona-wait';
import { personaFillByLabel } from '../helpers/persona-typing';
import { DemoData } from '../helpers/data';

test.describe('Demo: Checkout Flow (Persona-Aware)', () => {
  let persona: PersonaBehavior;

  test.beforeAll(() => {
    // Get persona from environment: DEMO_PERSONA=senior npx playwright test
    persona = getPersona(process.env.DEMO_PERSONA);
    console.log(`Recording demo for persona: ${persona.name}`);
  });

  test.beforeEach(async ({ page, context }) => {
    // Pre-authenticate
    await context.request.post('/api/auth/login', {
      data: { email: DemoData.user.email, password: DemoData.user.password },
    });
  });

  test('complete checkout with persona behavior', async ({ page }) => {
    // === Scene 1: Product Page ===
    await page.goto('/products/sample-a');
    await page.waitForLoadState('networkidle');

    await showPersonaOverlay(page, 'Let\'s complete a purchase', persona);
    await personaWait(page, 1000, persona);

    // === Scene 2: Add to Cart ===
    await hesitate(page, 'navigation', persona);
    await page.getByRole('button', { name: 'Add to Cart' }).click();

    await expect(page.getByText('Added to cart')).toBeVisible();
    await personaWait(page, 800, persona);

    // === Scene 3: Cart Review ===
    await page.getByTestId('cart-icon').click();
    await page.waitForURL('**/cart');

    await showPersonaOverlay(page, 'Checking cart items', persona);
    await personaWait(page, 1200, persona);

    // === Scene 4: Checkout ===
    await hesitate(page, 'form-submit', persona);
    await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
    await page.waitForURL('**/checkout');

    // Shipping address - hesitation for form fields
    await hesitate(page, 'form-fields', persona);
    await personaFillByLabel(page, 'Address', DemoData.address.street, persona);
    await personaFillByLabel(page, 'City', DemoData.address.city, persona);

    // === Scene 5: Payment ===
    await showPersonaOverlay(page, 'Entering payment details', persona);

    // Significant hesitation at payment for seniors/skeptics
    await hesitate(page, 'payment', persona);
    await personaFillByLabel(page, 'Card Number', DemoData.creditCard.number, persona);
    await personaFillByLabel(page, 'Expiry', DemoData.creditCard.expiry, persona);
    await personaFillByLabel(page, 'CVV', DemoData.creditCard.cvc, persona);

    // === Scene 6: Terms & Submit ===
    await hesitate(page, 'terms', persona);
    await page.getByLabel('I agree to the terms').check();
    await personaWait(page, 500, persona);

    // Final submit hesitation
    await hesitate(page, 'form-submit', persona);
    await page.getByRole('button', { name: 'Confirm Order' }).click();

    // === Scene 7: Success ===
    await page.waitForURL('**/order/complete');
    await expect(page.getByText('Thank you for your order')).toBeVisible();

    await showPersonaOverlay(page, 'Purchase complete! 🎉', persona);
  });
});
```

### Playwright Config for Persona Demos

```typescript
// playwright.config.persona.ts
import { defineConfig, devices } from '@playwright/test';
import { PersonaBehaviors } from './demos/helpers/persona';

// Get persona from environment
const personaName = process.env.DEMO_PERSONA || 'newbie';
const persona = PersonaBehaviors[personaName.toLowerCase()];

export default defineConfig({
  testDir: './demos/specs',
  timeout: 180000, // 3 minutes for slow personas
  retries: 0,
  workers: 1,

  use: {
    launchOptions: {
      slowMo: persona?.slowMo || 500,
    },
    video: {
      mode: 'on',
      size: { width: 1280, height: 720 },
    },
    viewport: { width: 1280, height: 720 },
    trace: 'off',
  },

  projects: [
    {
      name: `demo-${personaName}`,
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  outputDir: `demos/output/${personaName}`,
});
```

### Running Persona Demos

```bash
# Record demo for different personas
DEMO_PERSONA=senior npx playwright test --config=playwright.config.persona.ts
DEMO_PERSONA=newbie npx playwright test --config=playwright.config.persona.ts
DEMO_PERSONA=powerUser npx playwright test --config=playwright.config.persona.ts

# Output files will be in:
# demos/output/senior/
# demos/output/newbie/
# demos/output/poweruser/
```

---

## Complete Demo Example

### E-Commerce Checkout Demo

```typescript
// demos/specs/demo-checkout.spec.ts
import { test, expect } from '@playwright/test';
import { showOverlay, showStep, showSuccess } from '../helpers/overlay';
import { smoothScrollTo } from '../helpers/scroll';
import { DemoData, seedDemoData } from '../helpers/data';

test.describe('Demo: Product Purchase Flow', () => {
  test.beforeEach(async ({ page, context }) => {
    // Login via API
    await context.request.post('/api/auth/login', {
      data: { email: DemoData.user.email, password: DemoData.user.password },
    });
    await seedDemoData(page);
  });

  test('add product to cart and complete purchase', async ({ page }) => {
    // === Scene 1: Product Page ===
    await page.goto('/products/sample-a');
    await page.waitForLoadState('networkidle');

    await showStep(page, 1, 5, 'Select product');
    await page.waitForTimeout(1500);

    // === Scene 2: Add to Cart ===
    await showOverlay(page, 'Adding to cart', 1500);
    await page.getByRole('button', { name: 'Add to Cart' }).click();

    await expect(page.getByText('Added to cart')).toBeVisible();
    await page.waitForTimeout(1000);

    // === Scene 3: Cart Confirmation ===
    await showStep(page, 2, 5, 'Check cart');
    await page.getByTestId('cart-icon').click();
    await page.waitForURL('**/cart');

    await expect(page.getByText(DemoData.product.name)).toBeVisible();
    await page.waitForTimeout(1500);

    // === Scene 4: Checkout ===
    await showStep(page, 3, 5, 'Proceed to checkout');
    await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
    await page.waitForURL('**/checkout');

    // Shipping address confirmation
    await showStep(page, 4, 5, 'Confirm shipping address');
    await expect(page.getByText(DemoData.address.city)).toBeVisible();
    await page.waitForTimeout(1000);

    // Payment method
    await smoothScrollTo(page, '#payment-section');
    await page.getByLabel('Credit Card').check();
    await page.waitForTimeout(500);

    // === Scene 5: Order Confirmation ===
    await showStep(page, 5, 5, 'Confirm order');
    await page.getByRole('button', { name: 'Confirm Order' }).click();

    // Complete screen
    await page.waitForURL('**/order/complete');
    await expect(page.getByText('Thank you for your order')).toBeVisible();

    await showSuccess(page, 'Purchase complete! 🎉', 3000);
  });
});
```
