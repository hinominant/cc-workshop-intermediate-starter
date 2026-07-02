# director — デモ録画 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## RECORDING CONFIGURATION

### Basic Playwright Config for Demo

```typescript
// playwright.config.demo.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './demos',
  timeout: 120000, // 2 minutes per demo
  retries: 0, // Demos should be deterministic
  workers: 1, // Sequential for consistent timing

  use: {
    // CRITICAL: slowMo for human-viewable pace
    launchOptions: {
      slowMo: 500, // 500ms between actions
    },

    // Video recording
    video: {
      mode: 'on',
      size: { width: 1280, height: 720 },
    },

    // Viewport
    viewport: { width: 1280, height: 720 },

    // No traces needed for demos
    trace: 'off',
    screenshot: 'off',
  },

  projects: [
    {
      name: 'demo-720p',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'demo-1080p',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        video: { mode: 'on', size: { width: 1920, height: 1080 } },
      },
    },
    {
      name: 'demo-1440p',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 2560, height: 1440 },
        video: { mode: 'on', size: { width: 2560, height: 1440 } },
      },
    },
    {
      name: 'demo-4k',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 3840, height: 2160 },
        video: { mode: 'on', size: { width: 3840, height: 2160 } },
      },
    },
    {
      name: 'demo-mobile',
      use: {
        ...devices['iPhone 14 Pro'],
        launchOptions: { slowMo: 600 },
      },
    },
  ],
});
```

### slowMo Guidelines

| Content Type | slowMo (ms) | Rationale |
|--------------|-------------|-----------|
| Simple clicks | 300-500 | User can follow action |
| Form filling | 500-700 | Show each character being typed |
| Page transitions | 700-1000 | Allow page to fully render |
| Important moments | 1000-1500 | Pause for emphasis |

### Resolution Guidelines

| Resolution | Project Name | Use Case | File Size (30s) |
|------------|--------------|----------|-----------------|
| 1280x720 (720p) | `demo-720p` | Web embedding, standard demos | ~5MB |
| 1920x1080 (1080p) | `demo-1080p` | Presentations, high quality | ~10MB |
| 2560x1440 (2K) | `demo-1440p` | Large screens, Retina displays | ~18MB |
| 3840x2160 (4K) | `demo-4k` | Production, maximum quality | ~35MB |

**Running with specific resolution:**
```bash
# 720p (default)
npx playwright test --project=demo-720p

# Full HD
npx playwright test --project=demo-1080p

# 2K / QHD
npx playwright test --project=demo-1440p

# 4K (requires sufficient system resources)
npx playwright test --project=demo-4k
```

**Notes:**
- 4K recording requires significant system resources
- Always match viewport and video.size dimensions
- Consider longer slowMo values for higher resolutions

### Mobile High-Resolution Recording

Mobile devices have specific viewport constraints. Do NOT set video.size larger than the device viewport.

**Correct approach:**
```typescript
// Mobile demo - video size matches device viewport
{
  name: 'demo-mobile-hd',
  use: {
    ...devices['iPhone 14 Pro'],
    // iPhone 14 Pro: 390x844 logical pixels, 3x scale = 1170x2532 physical
    // Keep video.size at logical viewport size
    video: { mode: 'on', size: { width: 390, height: 844 } },
  },
}
```

**Common mistakes to avoid:**
```typescript
// ❌ WRONG: video.size larger than mobile viewport
{
  use: {
    ...devices['iPhone 14 Pro'],  // viewport: 390x844
    video: { mode: 'on', size: { width: 1920, height: 1080 } },  // Mismatch!
  },
}

// ❌ WRONG: Overriding mobile viewport to desktop size
{
  use: {
    ...devices['iPhone 14 Pro'],
    viewport: { width: 1920, height: 1080 },  // No longer mobile!
  },
}
```

**Mobile resolution reference:**

| Device | Viewport (logical) | Scale | Physical Pixels |
|--------|-------------------|-------|-----------------|
| iPhone SE | 375x667 | 2x | 750x1334 |
| iPhone 14 Pro | 390x844 | 3x | 1170x2532 |
| iPad | 768x1024 | 2x | 1536x2048 |
| iPad Pro 12.9" | 1024x1366 | 2x | 2048x2732 |

**For high-quality mobile demos**, use the device's logical viewport for video.size. Playwright captures at the correct resolution automatically based on deviceScaleFactor.

---

## AUTO-GENERATED SCENARIO DOCUMENTATION

### Overview

Director can automatically generate scenario documentation during demo recording,
capturing every action with timestamps for reproducibility and version tracking.

### Enabling Auto-Documentation

```typescript
import { enableScenarioRecording, generateScenarioDoc } from '../helpers/scenario-recorder';

test('demo with auto-documentation', async ({ page }, testInfo) => {
  const recorder = await enableScenarioRecording(page);

  // ... demo actions ...

  const scenario = await recorder.stop();
  const markdown = generateScenarioDoc(scenario, {
    title: 'Checkout Flow',
    author: 'Director',
  });

  // Save scenario document
  await fs.writeFile(`demos/scenarios/${testInfo.title}.md`, markdown);
});
```

### Output Format

Generated scenario documents include:
- Metadata (title, date, duration)
- Step-by-step actions with timestamps
- Screenshots at key moments (optional)
- Performance markers (if enabled)

### Integration with Git

Recommend committing generated scenarios alongside videos:
```bash
demos/
├── output/
│   └── checkout_20250203.webm
└── scenarios/
    └── checkout_20250203.md  # Auto-generated
```

---

## PERFORMANCE VISUALIZATION

### Overview

Director can overlay real-time performance metrics during demo recording,
creating compelling "this feature is fast" demonstrations with measurable proof.

### Available Metrics

| Category | Metrics | Use Case |
|----------|---------|----------|
| **Core Web Vitals** | LCP, CLS, INP | Performance improvement demos |
| **Network** | Request count, Transfer size, Duration | API optimization demos |
| **Resources** | DOM nodes, JS Heap size | Bundle size reduction demos |
| **Custom** | Performance marks/measures | Specific operation timing |

### Basic Usage

```typescript
import { enablePerformanceOverlay } from '../helpers/performance-overlay';

test('demo with performance metrics', async ({ page }) => {
  await enablePerformanceOverlay(page, {
    metrics: ['lcp', 'cls', 'inp'],
    position: 'top-right',
    theme: 'dark',
  });

  await page.goto('/dashboard');
  // Metrics update in real-time as page loads
});
```

### Display Modes

**Compact Mode** - Small badge showing key metrics:
```
┌──────┐
│LCP 1.2s ✓│
└──────┘
```

**Detailed Mode** - Full panel with all metrics:
```
┌─────────────────┐
│ Performance     │
│ LCP    1.2s  ✓  │
│ CLS    0.02  ✓  │
│ INP    45ms  ✓  │
│ Requests  12    │
│ Transfer  340KB │
└─────────────────┘
```

### Thresholds (Good/Needs Improvement/Poor)

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | ≤2.5s | ≤4.0s | >4.0s |
| CLS | ≤0.1 | ≤0.25 | >0.25 |
| INP | ≤200ms | ≤500ms | >500ms |

### Collaboration with Bolt

When demonstrating performance improvements optimized by Bolt:

```markdown
## BOLT_TO_DIRECTOR_HANDOFF
**Optimization**: Image lazy loading implementation
**Before**: LCP 4.2s, Transfer 2.1MB
**After**: LCP 1.8s, Transfer 890KB
**Demo Request**: Record before/after comparison with metrics overlay
```

---

## BEFORE/AFTER COMPARISON MODE

### Overview

Record side-by-side comparison demos showing improvements, redesigns, or A/B variants.
Two browser contexts run in parallel, capturing synchronized actions for compelling visual comparison.

### Display Layouts

**Split Screen** - Side-by-side comparison:
```
┌─────────────────┬─────────────────┐
│     BEFORE      │      AFTER      │
│                 │                 │
│   (Legacy UI)   │  (New Design)   │
│                 │                 │
│    LCP: 3.2s    │    LCP: 1.1s    │
└─────────────────┴─────────────────┘
```

**Picture-in-Picture** - Main view with comparison inset:
```
┌─────────────────────────────────┐
│                         ┌─────┐│
│      AFTER (Main)       │ BEF ││
│                         │ORE  ││
│                         └─────┘│
└─────────────────────────────────┘
```

**Sequential with Transition** - Before → wipe → After:
```
┌─────────────────┐     ┌─────────────────┐
│     BEFORE      │ ──► │      AFTER      │
└─────────────────┘     └─────────────────┘
```

### Basic Usage

```typescript
import { createComparisonDemo } from '../helpers/comparison-mode';

test('before/after redesign demo', async ({ browser }) => {
  const comparison = await createComparisonDemo(browser, {
    layout: 'split',
    beforeUrl: '/dashboard?version=v1',
    afterUrl: '/dashboard?version=v2',
    labels: { before: 'Current', after: 'Redesign' },
  });

  // Actions are mirrored to both contexts
  await comparison.both(async (page) => {
    await page.click('[data-testid="menu"]');
    await page.waitForTimeout(1000);
  });

  await comparison.showSummary(); // Display comparison metrics
  await comparison.close();
});
```

### Use Cases

| Scenario | Description | Labels Example |
|----------|-------------|----------------|
| **Performance** | Speed optimization demo | "Before Optimization" / "After Optimization" |
| **Redesign** | UI/UX improvements | "Current Design" / "New Design" |
| **A/B Test** | Variant comparison | "Control" / "Variant B" |
| **Migration** | Framework migration | "Legacy Stack" / "Modern Stack" |
| **Accessibility** | a11y improvements | "Before" / "WCAG Compliant" |

### Collaboration Patterns

**Launch → Director (Release Demo)**:
```markdown
## LAUNCH_TO_DIRECTOR_HANDOFF
**Release**: v2.0.0
**Key Changes**: Dashboard redesign, 40% faster load
**Demo Request**: Before/after split-screen comparison
**Before Branch**: release/v1.9.0
**After Branch**: release/v2.0.0
```

---

## AI NARRATION

### Overview

Director can automatically generate voice narration for demo videos using TTS (Text-to-Speech) APIs.
Narration scripts are derived from scenario documents or custom scripts, then synthesized and merged with video.

### Web Speech API (Browser Built-in TTS)

Live narration during demo recording using browser's built-in TTS.
**Free, no API key, works offline, real-time narration.**

```typescript
import { speakAndWait, createNarratedDemo } from '../helpers/web-speech-tts';

test('quick narrated demo', async ({ page }) => {
  const narrator = await createNarratedDemo(page, 'en-US');

  await page.goto('/dashboard');
  await narrator.speak('Welcome to the dashboard.');

  await page.getByRole('button', { name: 'Create' }).click();
  await narrator.speak('Click create to add a new item.');
});
```

### Available Voices

Voice availability depends on OS/browser:

| Platform | Example Voices |
|----------|---------------|
| macOS | Samantha, Alex, Daniel, Karen |
| Windows | Microsoft David, Zira, Mark |
| Chrome | Google US English, Google UK English |
| Linux | espeak voices (varies by distro) |

### Voice Selection Helper

```typescript
import { selectVoice, getAvailableVoices } from '../helpers/web-speech-tts';

// List available voices
const voices = await getAvailableVoices(page);
console.log(voices); // ['Samantha', 'Alex', 'Daniel', ...]

// Select specific voice
const narrator = await createNarratedDemo(page, 'en-US', 'Samantha');
```

### Script Formats

**Manual Script with Timestamps**:
```typescript
const script: NarrationScript = [
  { time: 0, text: "Welcome to our dashboard demo." },
  { time: 3000, text: "First, let's navigate to the settings page." },
  { time: 8000, text: "Here you can customize your preferences." },
  { time: 15000, text: "Notice how quickly the changes are applied." },
];
```

### Notes

- Quality varies by OS/browser
- No audio file export (narration is live during recording)
- Best for quick demos and prototyping

---

## VISUAL EFFECTS

### Progress Bar

Display demo progress at the top or bottom of the screen.

```typescript
import { showProgressBar, updateProgress, hideProgressBar } from '../helpers/progress-bar';

test('demo with progress', async ({ page }) => {
  await showProgressBar(page, { position: 'top', steps: 5 });

  await page.goto('/step1');
  await updateProgress(page, 1, 'Product Selection');

  await page.goto('/step2');
  await updateProgress(page, 2, 'Cart Review');

  // ... more steps ...

  await hideProgressBar(page);
});
```

**Display Modes:**
- `steps`: Step-based progress (1/5, 2/5, ...)
- `percentage`: Percentage-based (0-100%)
- `timed`: Auto-progress based on duration

### Spotlight Effect

Highlight specific UI elements by darkening the surrounding area.

```typescript
import { spotlight, clearSpotlight } from '../helpers/spotlight';

test('demo with spotlight', async ({ page }) => {
  await page.goto('/dashboard');

  // Spotlight the create button
  await spotlight(page, '[data-testid="create-btn"]', {
    label: 'Click here to create',
    labelPosition: 'bottom',
  });

  await page.click('[data-testid="create-btn"]');
  await clearSpotlight(page);
});
```

**Options:**
- `padding`: Space around element (default: 8px)
- `opacity`: Background darkness (default: 0.7)
- `label`: Optional tooltip text
- `labelPosition`: top | bottom | left | right

---

## SCENARIO DESIGN TEMPLATE

See `references/prompt-template.md` for the full template.

### Core Structure

```markdown
## Demo Scenario: [Feature Name]

### Audience
- Who is watching this demo?

### Goal
- What should the viewer understand after watching?

### Story Flow
1. **Opening** (5-10s): Set the context
2. **Action** (20-40s): Show the feature in use
3. **Result** (5-10s): Highlight the outcome

### Key Moments
- Point A: [Timestamp] - What to emphasize
- Point B: [Timestamp] - What to emphasize

### Test Data Required
- User: demo@example.com
- Items: [specific data needed]
```

---

## IMPLEMENTATION PATTERNS

See `references/implementation-patterns.md` for complete code examples.

### Basic Demo Structure

```typescript
// demos/feature-login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Demo: User Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Prepare clean state
    await page.goto('/');
  });

  test('shows complete login experience', async ({ page }) => {
    // --- Opening: Show the login page ---
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await page.waitForTimeout(1000); // Pause for viewer

    // --- Action: Enter credentials ---
    await page.getByLabel('Email').fill('demo@example.com');
    await page.getByLabel('Password').fill('DemoPassword123');

    // --- Action: Submit ---
    await page.getByRole('button', { name: 'Login' }).click();

    // --- Result: Show dashboard ---
    await expect(page.getByTestId('dashboard')).toBeVisible();
    await page.waitForTimeout(1500); // Final pause
  });
});
```

### Overlay Helper (for annotations)

```typescript
// demos/helpers/overlay.ts
export async function showOverlay(page: Page, message: string, duration: number = 2000) {
  await page.evaluate(({ msg, dur }) => {
    const overlay = document.createElement('div');
    overlay.id = 'demo-overlay';
    overlay.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 16px 32px;
      border-radius: 8px;
      font-size: 18px;
      z-index: 99999;
      animation: fadeIn 0.3s ease-out;
    `;
    overlay.textContent = msg;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), dur);
  }, { msg: message, dur: duration });

  await page.waitForTimeout(duration);
}
```

---

## CHECKLIST

See `references/checklist.md` for the complete checklist.

### Pre-Recording Checklist
- [ ] Scenario document reviewed and approved
- [ ] Test data prepared and verified
- [ ] slowMo value set appropriately
- [ ] Viewport matches target audience device
- [ ] Auth state prepared (if needed)

### Post-Recording Checklist
- [ ] Video plays without errors
- [ ] All actions are visible and clear
- [ ] Pacing allows viewer to follow
- [ ] No sensitive data exposed
- [ ] File named descriptively

---

