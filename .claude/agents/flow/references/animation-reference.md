# flow — アニメーション リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## ANIMATION CATALOG (Quick Reference)

### Entry/Exit Summary

| Pattern | Duration | Easing |
|---------|----------|--------|
| Fade In | 200ms | ease-out |
| Slide Up | 200-300ms | ease-out |
| Scale In | 150-200ms | ease-out |
| Fade Out | 150ms | ease-in |
| Slide Down | 150-200ms | ease-in |

### Micro-interactions Summary

| Pattern | Duration | Easing |
|---------|----------|--------|
| Button Press | 100ms | ease-out |
| Toggle Switch | 200ms | ease-in-out |
| Shake (error) | 400ms | ease-in-out |
| Pulse | 1000ms | ease-in-out |

### Gesture Animations Summary

| Pattern | Duration | Easing |
|---------|----------|--------|
| Drag feedback | continuous | spring |
| Swipe to dismiss | 200ms | ease-out |
| Snap scroll | 300ms | ease-out |
| Long press | 400ms hold | ease-in |

### Page Transitions Summary

| Pattern | Duration | Easing |
|---------|----------|--------|
| Fade crossfade | 200ms | ease-out |
| Slide lateral | 250ms | ease-out |
| Shared element | 300ms | ease-in-out |

See `references/animation-catalog.md` for full catalog with code examples, gesture patterns, and page transitions.

---

## EASING QUICK REFERENCE

| Context | Easing | CSS Value |
|---------|--------|-----------|
| Entry / User response | ease-out | `cubic-bezier(0, 0, 0.2, 1)` |
| Exit / Departure | ease-in | `cubic-bezier(0.4, 0, 1, 1)` |
| State change / Toggle | ease-in-out | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Progress / Loading | linear | `linear` |
| Playful / Overshoot | ease-out-back | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Interactive / Drag | spring | JS only (tension/friction) |

See `references/easing-guide.md` for full reference, spring presets, and CSS `linear()` approximation.

---

## MODERN CSS FEATURES

Prefer native CSS solutions before reaching for JS libraries.

| Feature | Use Case | Support |
|---------|----------|---------|
| **View Transitions API** | Page/SPA navigation, shared elements | Chrome 111+, Safari 18+ |
| **@starting-style** | Animate from `display: none` (modals, popovers) | Chrome 117+, Safari 17.5+ |
| **Scroll-driven animations** | Parallax, scroll progress, reveal on scroll | Chrome 115+ |
| **@property** | Animate custom properties (gradients, colors) | Chrome 85+, Safari 15.4+ |

### Progressive Enhancement Pattern

```css
/* Always works */
.element { opacity: 1; }

/* Enhanced with modern CSS */
@supports (animation-timeline: view()) {
  .element {
    animation: fadeIn linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 100%;
  }
}
```

See `references/modern-css-animations.md` for full API reference and implementation patterns.

---

## FRAMEWORK SUPPORT

Auto-detect framework from project config and apply matching patterns.

| Framework | Animation Approach | Reference |
|-----------|-------------------|-----------|
| **CSS only** | @keyframes, transitions, modern APIs | `references/animation-catalog.md` |
| **Tailwind CSS** | `animate-*`, `transition-*`, custom keyframes | `references/framework-patterns.md` |
| **React** | Framer Motion, React Spring, GSAP | `references/framework-patterns.md` |
| **Vue** | `<Transition>`, `<TransitionGroup>` | `references/framework-patterns.md` |
| **Svelte** | `transition:`, `animate:`, `in:/out:` | `references/framework-patterns.md` |
| **Vanilla JS** | Web Animations API (`element.animate()`) | `references/framework-patterns.md` |
| **Next.js** | App Router template + View Transitions | `references/framework-patterns.md` |
| **Astro** | `<ViewTransitions />` | `references/framework-patterns.md` |

---

## MOTION TOKENS

Standardized tokens for consistent motion. Coordinate with Muse's design token system.

### Core Tokens

```css
:root {
  --duration-instant: 50ms;
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 400ms;
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-instant: 0ms;
    --duration-fast: 0ms;
    --duration-normal: 0ms;
    --duration-slow: 0ms;
    --duration-slower: 0ms;
  }
}
```

See `references/motion-tokens.md` for full token system, composites, Tailwind mapping, and Muse coordination.

---

## PERFORMANCE MEASUREMENT

### Safe vs Unsafe Properties

```
GPU Accelerated (safe): transform, opacity, filter, clip-path
Triggers Layout (avoid): width, height, margin, padding, top, left
```

### Core Web Vitals Impact

| Metric | Risk | Mitigation |
|--------|------|------------|
| **CLS** | High | Never animate width/height/margin/padding |
| **LCP** | Medium | Don't delay critical content with animations |
| **INP** | High | Keep interaction response < 200ms |

### Performance Checklist

```
Before shipping animation:
[ ] Uses only transform/opacity (or filter/clip-path)
[ ] Duration <= 300ms for interactions
[ ] No layout thrashing in DevTools
[ ] Works smoothly at 60fps
[ ] Tested on low-end device or CPU throttling
[ ] prefers-reduced-motion respected
```

### Performance Report Format

```markdown
### Animation Performance Report

**Animation**: [Description]
**Trigger**: [Event type]

| Property | Value |
|----------|-------|
| Duration | Xms |
| Properties | transform, opacity |
| Composited | Yes/No |
| Frame Budget | X/16ms |

**CLS Impact**: None / X.XX
```

---

