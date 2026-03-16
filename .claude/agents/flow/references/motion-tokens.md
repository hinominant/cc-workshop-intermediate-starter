# Motion Tokens

Standardized animation tokens for consistent motion across the application.

---

## Duration Tokens

```css
:root {
  /* Interaction feedback */
  --duration-instant: 50ms;    /* Micro-feedback, button press */
  --duration-fast: 100ms;      /* Hover states, small transitions */
  --duration-normal: 200ms;    /* Default UI transitions */
  --duration-slow: 300ms;      /* Modal enter, larger elements */
  --duration-slower: 400ms;    /* Complex sequences, page transitions */

  /* Loading states */
  --duration-skeleton: 1500ms; /* Skeleton shimmer cycle */
  --duration-spinner: 1000ms;  /* Loading spinner rotation */
}
```

---

## Easing Tokens

```css
:root {
  /* Standard easings */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);      /* General purpose */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);             /* Exit animations */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);            /* Entry animations */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);       /* State changes */

  /* Expressive easings */
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);  /* Playful overshoot */
  --ease-snap: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Elastic snap */

  /* Subtle easings */
  --ease-soft: cubic-bezier(0.25, 0.1, 0.25, 1);     /* Gentle transitions */
}
```

---

## Motion Scale

| Token Name | Duration | Easing | Use Case |
|------------|----------|--------|----------|
| `--motion-micro` | instant | ease-out | Button press, toggles |
| `--motion-fast` | fast | ease-out | Hover effects |
| `--motion-normal` | normal | ease-out | Default transitions |
| `--motion-enter` | slow | ease-out | Elements appearing |
| `--motion-exit` | normal | ease-in | Elements leaving |
| `--motion-state` | normal | ease-in-out | State changes |

---

## Composite Motion Tokens

```css
:root {
  /* Ready-to-use transition values */
  --transition-colors: color var(--duration-fast) var(--ease-out),
                       background-color var(--duration-fast) var(--ease-out),
                       border-color var(--duration-fast) var(--ease-out);

  --transition-transform: transform var(--duration-normal) var(--ease-out);

  --transition-opacity: opacity var(--duration-normal) var(--ease-out);

  --transition-all: var(--transition-colors),
                    var(--transition-transform),
                    var(--transition-opacity);
}
```

---

## Usage Examples

```css
/* Using motion tokens */
.button {
  transition: var(--transition-colors), var(--transition-transform);
}
.button:hover {
  transform: translateY(-1px);
}
.button:active {
  transform: scale(0.98);
  transition-duration: var(--duration-instant);
}

/* Modal with motion tokens */
.modal {
  animation: fadeIn var(--duration-slow) var(--ease-out);
}
.modal[data-state="closing"] {
  animation: fadeOut var(--duration-normal) var(--ease-in);
}
```

---

## Reduced Motion Override

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-instant: 0ms;
    --duration-fast: 0ms;
    --duration-normal: 0ms;
    --duration-slow: 0ms;
    --duration-slower: 0ms;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Muse Coordination

Motion tokens should align with Muse's design token system:

```css
/* Muse defines spacing, Flow uses for motion */
:root {
  /* From Muse */
  --space-4: 1rem;

  /* Flow uses for animation distance */
  --motion-distance-sm: var(--space-2);  /* 8px */
  --motion-distance-md: var(--space-4);  /* 16px */
  --motion-distance-lg: var(--space-6);  /* 24px */
}

/* Slide animation using spacing tokens */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(var(--motion-distance-md));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Tailwind CSS Token Mapping

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      transitionDuration: {
        'instant': '50ms',
        'fast': '100ms',
        'normal': '200ms',
        'slow': '300ms',
        'slower': '400ms',
      },
      transitionTimingFunction: {
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
        'in': 'cubic-bezier(0.4, 0, 1, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 200ms cubic-bezier(0, 0, 0.2, 1)',
        'slide-up': 'slideUp 300ms cubic-bezier(0, 0, 0.2, 1)',
      },
    },
  },
};
```
