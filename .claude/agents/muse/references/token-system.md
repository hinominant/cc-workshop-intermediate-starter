# Design Token System

Token categories, naming conventions, scales, audit patterns, and code standards.

---

## Token Categories

```
PRIMITIVE TOKENS (raw values):
├── Colors
│   ├── Palette: blue-50, blue-100, ..., blue-900
│   ├── Neutral: gray-50, gray-100, ..., gray-900
│   └── Brand: brand-primary, brand-secondary
├── Spacing: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24
├── Typography
│   ├── Font Families: sans, serif, mono
│   ├── Font Sizes: xs, sm, base, lg, xl, 2xl, ...
│   ├── Font Weights: light, normal, medium, semibold, bold
│   └── Line Heights: none, tight, snug, normal, relaxed, loose
├── Border Radius: none, sm, md, lg, xl, full
├── Shadows: none, sm, md, lg, xl
└── Breakpoints: sm, md, lg, xl, 2xl

SEMANTIC TOKENS (context-aware aliases):
├── Colors
│   ├── Background: bg-primary, bg-secondary, bg-accent, bg-error
│   ├── Text: text-primary, text-secondary, text-muted, text-inverse
│   ├── Border: border-default, border-strong, border-focus
│   └── Interactive: interactive-default, interactive-hover, interactive-active
├── Spacing (contextual)
│   ├── Component: padding-button, padding-card, padding-input
│   └── Layout: gap-stack, gap-inline, margin-section
└── Component-specific: button-radius, card-shadow, input-border
```

---

## Token Naming Convention

```
Pattern: --{category}-{property}-{variant}-{state}

Examples:
  --color-bg-primary           # Primary background color
  --color-text-secondary       # Secondary text color
  --color-border-focus         # Border color for focus state
  --space-padding-card         # Card padding
  --font-size-heading-lg       # Large heading size
  --radius-button              # Button border radius
  --shadow-card-hover          # Card shadow on hover
```

### Token Definition Template

```css
/*
 * Token: --color-bg-primary
 * Category: Semantic / Background
 * Purpose: Primary background for main content areas
 * Light mode: white or near-white
 * Dark mode: dark gray
 * Usage: Page backgrounds, card backgrounds, modal backgrounds
 */
:root {
  --color-bg-primary: var(--gray-50);
}

[data-theme="dark"] {
  --color-bg-primary: var(--gray-900);
}
```

### Token Definition Process

1. **Identify the need**: What value needs to be reused? Is it primitive or semantic?
2. **Name with intent**: Use semantic names that describe purpose, not appearance
3. **Define the scale**: Ensure the value fits within an existing or new scale
4. **Document usage**: When and where should this token be used?
5. **Implement in code**: Create CSS custom properties, Tailwind config, or equivalent

---

## Token File Structure

```
tokens/
├── primitives/
│   ├── colors.css       # Raw color palette
│   ├── spacing.css      # Spacing scale
│   ├── typography.css   # Font definitions
│   └── effects.css      # Shadows, borders
├── semantic/
│   ├── colors.css       # Contextual color tokens
│   ├── components.css   # Component-specific tokens
│   └── dark-mode.css    # Dark theme overrides
└── index.css            # Token aggregation
```

---

## Typography Scale (Major Third - 1.25 ratio)

```css
:root {
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px - captions, labels, fine print */
  --text-sm: 0.875rem;   /* 14px - secondary text, metadata */
  --text-base: 1rem;     /* 16px - body text, default */
  --text-lg: 1.125rem;   /* 18px - lead paragraphs */
  --text-xl: 1.25rem;    /* 20px - h5, card titles */
  --text-2xl: 1.5rem;    /* 24px - h4, section headers */
  --text-3xl: 1.875rem;  /* 30px - h3 */
  --text-4xl: 2.25rem;   /* 36px - h2 */
  --text-5xl: 3rem;      /* 48px - h1, hero text */
  --text-6xl: 3.75rem;   /* 60px - display, marketing */

  /* Line Heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;

  /* Font Weights */
  --font-thin: 100;
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;

  /* Letter Spacing */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
}
```

### Typography Usage Guide

| Element | Size | Weight | Line Height | Tracking |
|---------|------|--------|-------------|----------|
| Display | 6xl | bold | tight | tighter |
| H1 | 5xl | bold | tight | tight |
| H2 | 4xl | semibold | tight | tight |
| H3 | 3xl | semibold | snug | normal |
| H4 | 2xl | semibold | snug | normal |
| H5 | xl | medium | normal | normal |
| H6 | lg | medium | normal | normal |
| Body | base | normal | relaxed | normal |
| Body Small | sm | normal | normal | normal |
| Caption | xs | normal | normal | wide |
| Label | sm | medium | none | wide |

### Responsive Typography

```
Mobile (< 640px):
  - Display: 4xl
  - H1: 3xl
  - H2: 2xl
  - Body: base (min 16px for readability)

Desktop (>= 1024px):
  - Display: 6xl
  - H1: 5xl
  - H2: 4xl
  - Body: base or lg
```

---

## Spacing System (8px Grid)

```css
:root {
  --space-0: 0;
  --space-px: 1px;
  --space-0.5: 0.125rem;  /* 2px */
  --space-1: 0.25rem;     /* 4px */
  --space-2: 0.5rem;      /* 8px */
  --space-3: 0.75rem;     /* 12px */
  --space-4: 1rem;        /* 16px */
  --space-5: 1.25rem;     /* 20px */
  --space-6: 1.5rem;      /* 24px */
  --space-8: 2rem;        /* 32px */
  --space-10: 2.5rem;     /* 40px */
  --space-12: 3rem;       /* 48px */
  --space-16: 4rem;       /* 64px */
  --space-20: 5rem;       /* 80px */
  --space-24: 6rem;       /* 96px */
}
```

### Spacing Usage Guide

| Context | Recommended | Tokens |
|---------|-------------|--------|
| Icon to text | 4-8px | space-1, space-2 |
| Button padding | 8-16px | space-2, space-4 |
| Card padding | 16-24px | space-4, space-6 |
| Component gap | 8-16px | space-2, space-4 |
| Section gap | 24-48px | space-6, space-12 |
| Page margins | 16-64px | space-4, space-16 |

### 8px Grid Verification

```
Valid spacing values (on grid):
  4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px...

Invalid spacing values (off grid):
  5px, 7px, 9px, 10px, 11px, 13px, 14px, 15px, 17px, 18px, 19px...

Exception: 1px for borders/dividers, 2px for fine adjustments
```

### Responsive Spacing

```
Mobile:  Page margins space-4 (16px), Section gap space-6 (24px)
Tablet:  Page margins space-6 (24px), Section gap space-8 (32px)
Desktop: Page margins space-8 to space-16, Section gap space-12 (48px)
```

---

## Design Token Audit

### Detection Patterns

```
HARDCODED_COLORS:
  - HEX: #xxx, #xxxxxx, #xxxxxxxx
  - RGB: rgb(x,x,x), rgba(x,x,x,x)
  - HSL: hsl(x,x%,x%), hsla(x,x%,x%,x)
  - Named: red, blue (except currentColor, inherit, transparent)

HARDCODED_SPACING:
  - Values not on 4px/8px grid: 5px, 7px, 9px, 11px, 13px, etc.
  - Inconsistent margins/paddings

HARDCODED_TYPOGRAPHY:
  - Font sizes not in scale: 13px, 15px, 17px, 19px, etc.
  - Line heights as arbitrary decimals: 1.37, 1.62
  - Font weights as raw numbers without semantic meaning
```

### Audit Report Format

```markdown
### Design Token Audit Report: [Component/File]

| Category | Hardcoded | Tokenized | Coverage |
|----------|-----------|-----------|----------|
| Colors | X | Y | Z% |
| Spacing | X | Y | Z% |
| Typography | X | Y | Z% |
| Shadows | X | Y | Z% |
| Border Radius | X | Y | Z% |

**Critical Issues** (should fix immediately):
- `file.tsx:42` - `#ff5733` → `var(--color-error)`
- `component.tsx:18` - `padding: 13px` → `var(--space-3)`

**Warnings** (should fix when touching file):
- `card.tsx:25` - `font-size: 15px` → `var(--text-sm)` or `var(--text-base)`

**Coverage Target**: 95%+ tokenization
```

---

## W3C Design Tokens Community Group (DTCG) Format

The emerging standard for token interchange between design and code tools.

### DTCG Token Format

```json
{
  "color": {
    "primary": {
      "$value": "#3b82f6",
      "$type": "color",
      "$description": "Primary brand color"
    },
    "bg": {
      "primary": {
        "$value": "{color.neutral.50}",
        "$type": "color",
        "$description": "Primary background"
      }
    }
  },
  "spacing": {
    "4": {
      "$value": "1rem",
      "$type": "dimension",
      "$description": "Standard component padding"
    }
  }
}
```

### Key Differences from Legacy Format

| Aspect | Legacy | DTCG Standard |
|--------|--------|---------------|
| Value key | `"value"` | `"$value"` |
| Type key | `"type"` | `"$type"` |
| Reference | `"{colors.blue.500}"` | `"{color.blue.500}"` |
| File extension | `.json` | `.tokens.json` |
| Group nesting | Flat or nested | Always nested with `$` properties |

---

## Modern Token Integration

### Tailwind v4 CSS-first Configuration

```css
/* app.css - Tailwind v4 uses CSS for config */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-bg-primary: var(--color-neutral-50);
  --color-bg-secondary: var(--color-neutral-100);

  --spacing-4: 1rem;
  --spacing-6: 1.5rem;

  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
}
```

### Panda CSS Token Integration

```ts
// panda.config.ts
import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: { value: '#3b82f6' },
        neutral: {
          50: { value: '#fafafa' },
          900: { value: '#171717' },
        },
      },
      spacing: {
        4: { value: '1rem' },
        6: { value: '1.5rem' },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          primary: {
            value: { base: '{colors.neutral.50}', _dark: '{colors.neutral.900}' },
          },
        },
        text: {
          primary: {
            value: { base: '{colors.neutral.900}', _dark: '{colors.neutral.50}' },
          },
        },
      },
    },
  },
});
```

### Open Props (CSS Custom Properties Library)

```css
/* Use Open Props as a baseline, extend with project tokens */
@import "open-props/style";
@import "open-props/normalize";

:root {
  /* Override Open Props defaults with project tokens */
  --surface-1: var(--color-bg-primary);
  --text-1: var(--color-text-primary);
  --brand: var(--color-primary);
}
```

### CSS-in-JS (styled-components / emotion)

```ts
const theme = {
  colors: {
    primary: 'var(--color-primary)',
    bg: { primary: 'var(--color-bg-primary)' },
    text: { primary: 'var(--color-text-primary)' },
  },
  space: {
    4: 'var(--space-4)',
    6: 'var(--space-6)',
  },
};
```

---

### Token Lifecycle Status

Every token definition should include a lifecycle status comment:

```css
/* Primitive tokens */
--blue-500: #3b82f6;          /* @status: stable */
--blue-600: #2563eb;          /* @status: stable */

/* Semantic tokens */
--color-bg-primary: var(--blue-500);     /* @status: stable */
--color-brand: var(--blue-600);          /* @status: adopt — replaces --color-primary in v2.0 */
--color-primary: var(--blue-600);        /* @status: deprecated — use --color-brand instead */
```

**Status values:**

| Status | Meaning | Action Required |
|--------|---------|-----------------|
| `@status: propose` | Under review, not yet approved | Do not use in production |
| `@status: adopt` | Approved, gaining adoption | Prefer over alternatives |
| `@status: stable` | Standard token, fully integrated | Use freely |
| `@status: deprecated` | Scheduled for removal | Migrate to replacement |
| `@status: frozen` | On hold due to external blocker | Use with caution |

> **Detail:** See `references/token-lifecycle.md` for full lifecycle process, migration templates, and deprecation playbook.

---

## Code Standards

### Good Muse Code

```tsx
// Using design tokens/utility classes
<div className="p-4 bg-surface-primary rounded-md shadow-sm">
  <h2 className="text-lg font-bold text-text-primary">Title</h2>
  <p className="text-sm text-text-secondary mt-2">Description</p>
</div>

// Consistent spacing using tokens
.card {
  padding: var(--space-4);
  margin-bottom: var(--space-6);
  border-radius: var(--radius-md);
}

// Dark mode support
.card {
  background: var(--color-surface);
  color: var(--color-text);
}
```

### Bad Muse Code

```tsx
// Magic numbers and raw colors
<div style={{ padding: '13px', backgroundColor: '#f0f2f5' }}>
  <h2 style={{ fontSize: '19px', color: '#333' }}>Title</h2>
</div>

// Off-grid spacing, hardcoded colors
.card {
  padding: 15px;
  margin-bottom: 25px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
}
```
