# Dark Mode

Checklists, verification processes, color scheme strategies, and implementation patterns.

---

## Dark Mode Checklist

### Colors

```
[ ] Semantic colors properly inverted
    - Background: light → dark
    - Text: dark → light
    - Borders: adjusted for visibility
[ ] Contrast ratios meet WCAG AA (4.5:1 for text, 3:1 for large text)
[ ] No pure white (#fff) on dark backgrounds (use off-white)
[ ] No pure black (#000) on light backgrounds (use off-black)
[ ] Brand colors adjusted for dark backgrounds if needed
[ ] Interactive state colors (hover, focus, active) work in both modes
```

### Images & Icons

```
[ ] Icons use currentColor or have dark mode variants
[ ] Logos have dark mode alternatives
[ ] Shadows adjusted (lighter/more subtle in dark mode)
[ ] No "glowing" effect from images with light backgrounds
[ ] Consider backdrop-filter for glassmorphism effects
```

### Components

```
[ ] Form inputs have proper dark styling
    - Input backgrounds
    - Placeholder text contrast
    - Border visibility
[ ] Focus states visible in dark mode
[ ] Hover states have appropriate contrast
[ ] Disabled states distinguishable in both modes
[ ] Selection/highlight colors work in dark mode
```

### Edge Cases

```
[ ] Embedded content (iframes, videos)
[ ] User-generated content (may have inline styles)
[ ] Third-party widgets and embeds
[ ] Print styles (usually should be light)
[ ] Code blocks and syntax highlighting
[ ] Charts and data visualizations
```

---

## Dark Mode Implementation Strategies

### Strategy 1: CSS Custom Properties (Recommended)

```css
:root {
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;
}

[data-theme="dark"] {
  --color-bg-primary: #111827;
  --color-bg-secondary: #1f2937;
  --color-text-primary: #f9fafb;
  --color-text-secondary: #9ca3af;
  --color-border: #374151;
}
```

### Strategy 2: prefers-color-scheme Media Query

```css
:root {
  --color-bg-primary: #ffffff;
  --color-text-primary: #111827;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #111827;
    --color-text-primary: #f9fafb;
  }
}
```

### Strategy 3: Tailwind Dark Mode

```html
<!-- Class-based (requires manual toggle) -->
<div class="bg-white dark:bg-gray-900">
  <p class="text-gray-900 dark:text-gray-100">Content</p>
</div>
```

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media' for system preference
};
```

### Strategy 4: CSS color-scheme Property

```css
:root {
  color-scheme: light dark;
}

/* Browser auto-adjusts form elements, scrollbars, etc. */
```

---

## Color Adaptation Rules

### Lightness Inversion Table

| Light Mode | Dark Mode | Reason |
|-----------|-----------|--------|
| White (#fff) | Gray-900 (#111827) | Never use pure black |
| Gray-50 | Gray-800 | Subtle backgrounds |
| Gray-100 | Gray-700 | Card backgrounds |
| Gray-900 | Gray-50 | Primary text |
| Gray-600 | Gray-400 | Secondary text |
| Blue-600 | Blue-400 | Links/actions (increase lightness) |
| Red-600 | Red-400 | Errors (increase lightness) |
| Green-600 | Green-400 | Success (increase lightness) |

### Shadow Adaptation

```css
/* Light mode: visible shadows */
.card { box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }

/* Dark mode: reduce or replace with borders */
[data-theme="dark"] .card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  /* or use border instead */
  border: 1px solid var(--color-border);
}
```

### Elevation in Dark Mode

```
Light mode: Elevation via shadows (subtle gray shadows)
Dark mode: Elevation via lightness (higher = lighter background)

Surface-0: gray-900 (lowest)
Surface-1: gray-800
Surface-2: gray-700
Surface-3: gray-600 (highest)
```

---

## Theme Toggle Implementation

### React

```tsx
function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem('theme') as 'light' | 'dark'
      ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  return { theme, toggle };
}
```

### System Preference Listener

```ts
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
```

---

## Dark Mode Verification Report Format

```markdown
### Dark Mode Verification: [Component]

**Status**: ✅ Pass / ⚠️ Issues Found / ❌ Fail

**Checklist Results**:
- Colors: [X/Y passed]
- Images/Icons: [X/Y passed]
- Components: [X/Y passed]
- Edge Cases: [X/Y passed]

**Issues Found**:
1. [Issue description] - [file:line]
   - Current: [problematic value]
   - Fix: [recommended change]

**Recommendation**: [Pass as-is / Fix before merge / Major rework needed]
```
