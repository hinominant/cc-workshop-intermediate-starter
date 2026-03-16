# Animation Catalog

A systematic collection of animation patterns with recommended timing and easing.

---

## Entry Animations

| Pattern | Duration | Easing | Use When |
|---------|----------|--------|----------|
| Fade In | 200ms | ease-out | Default for appearing content |
| Slide Up | 200-300ms | ease-out | Cards, modals, toasts |
| Scale In | 150-200ms | ease-out | Popovers, dropdowns |
| Reveal (clip) | 300ms | ease-in-out | Hero sections, images |

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scale In */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Reveal */
@keyframes reveal {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
}
```

---

## Exit Animations

| Pattern | Duration | Easing | Use When |
|---------|----------|--------|----------|
| Fade Out | 150ms | ease-in | Default for disappearing content |
| Slide Down | 150-200ms | ease-in | Dismissing modals, toasts |
| Scale Out | 100-150ms | ease-in | Closing popovers |
| Collapse | 200ms | ease-in-out | Accordion, expandable sections |

```css
/* Fade Out */
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Slide Down */
@keyframes slideDown {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(8px); }
}

/* Scale Out */
@keyframes scaleOut {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.95); }
}
```

---

## Micro-interactions

| Pattern | Duration | Easing | Use When |
|---------|----------|--------|----------|
| Button Press | 100ms | ease-out | Click/tap feedback |
| Toggle Switch | 200ms | ease-in-out | State toggle |
| Ripple | 400ms | ease-out | Material-style touch feedback |
| Pulse | 1000ms | ease-in-out | Attention indicator |
| Shake | 400ms | ease-in-out | Error feedback |

```css
/* Button Press */
.btn:active {
  transform: scale(0.97);
  transition: transform 100ms ease-out;
}

/* Toggle Switch */
.toggle-thumb {
  transition: transform 200ms ease-in-out;
}
.toggle[data-state="checked"] .toggle-thumb {
  transform: translateX(20px);
}

/* Shake */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}
.error { animation: shake 400ms ease-in-out; }

/* Pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## Scroll Animations

| Pattern | Duration | Easing | Use When |
|---------|----------|--------|----------|
| Scroll Reveal | 400-600ms | ease-out | Content appearing on scroll |
| Parallax | continuous | linear | Background depth effect |
| Progress Bar | continuous | linear | Reading progress indicator |
| Sticky Header | 200ms | ease-out | Header show/hide on scroll |

```tsx
// Scroll Reveal with Intersection Observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
);
```

---

## State Transitions

| Pattern | Duration | Easing | Use When |
|---------|----------|--------|----------|
| Success | 300ms | ease-out | Action completed |
| Error | 200ms + shake | ease-out | Action failed |
| Loading | 1000ms loop | linear | Waiting for response |
| Skeleton | 1500ms loop | ease-in-out | Content loading |

```css
/* Success checkmark */
@keyframes checkmark {
  0% { stroke-dashoffset: 24; }
  100% { stroke-dashoffset: 0; }
}

/* Skeleton loading */
@keyframes skeleton {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton 1.5s ease-in-out infinite;
}
```

---

## Stagger Patterns

```css
/* Staggered list items */
.list-item {
  opacity: 0;
  animation: slideUp 300ms ease-out forwards;
}
.list-item:nth-child(1) { animation-delay: 0ms; }
.list-item:nth-child(2) { animation-delay: 50ms; }
.list-item:nth-child(3) { animation-delay: 100ms; }
/* ... */
```

```tsx
// Framer Motion stagger
<motion.ul variants={{ show: { transition: { staggerChildren: 0.05 } } }}>
  {items.map((item) => (
    <motion.li
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
    />
  ))}
</motion.ul>
```

---

## Gesture & Drag Animations

| Pattern | Duration | Easing | Use When |
|---------|----------|--------|----------|
| Drag feedback | continuous | spring | Card reordering, file upload |
| Swipe to dismiss | 200ms | ease-out | Mobile notifications, list items |
| Pull to refresh | 300ms | ease-out | Mobile list refresh |
| Long press | 400ms hold | ease-in | Context menu trigger |
| Snap scroll | 300ms | ease-out | Carousel, horizontal scroll |

### Drag & Drop with Spring Release

```tsx
// Framer Motion drag
<motion.div
  drag
  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
  dragElastic={0.1}
  whileDrag={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
  transition={{ type: "spring", stiffness: 300, damping: 25 }}
/>
```

### Swipe to Dismiss

```tsx
// Framer Motion swipe
<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  onDragEnd={(_, info) => {
    if (Math.abs(info.offset.x) > 100) {
      onDismiss();
    }
  }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: info.offset.x > 0 ? 300 : -300, opacity: 0 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
/>
```

### CSS Snap Scroll

```css
/* Snap scroll carousel */
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
.carousel-item {
  scroll-snap-align: start;
  flex-shrink: 0;
}
```

### Long Press

```tsx
// Long press with visual feedback
function useLongPress(callback: () => void, ms = 400) {
  const timerRef = useRef<number>();
  const onPointerDown = () => {
    timerRef.current = window.setTimeout(callback, ms);
  };
  const onPointerUp = () => {
    clearTimeout(timerRef.current);
  };
  return { onPointerDown, onPointerUp, onPointerLeave: onPointerUp };
}

// Visual: scale ring animation during hold
<motion.div
  animate={isHolding ? { scale: [1, 1.1] } : { scale: 1 }}
  transition={{ duration: 0.4, ease: "easeIn" }}
/>
```

### Pull to Refresh

```css
/* Pull indicator */
.pull-indicator {
  transform: translateY(-100%);
  transition: transform 300ms ease-out;
}
.pull-indicator.active {
  transform: translateY(0);
}
.pull-indicator .spinner {
  animation: spin 800ms linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## Page & Route Transitions

Patterns for SPA/MPA page-level navigation animations.

### Fade Crossfade (Default)

```css
/* Simple page crossfade */
.page-enter {
  animation: fadeIn 200ms ease-out;
}
.page-exit {
  animation: fadeOut 150ms ease-in;
}
```

### Slide Lateral (Forward/Back Navigation)

```css
/* Forward navigation */
.page-enter-forward {
  animation: slideInRight 250ms ease-out;
}
.page-exit-forward {
  animation: slideOutLeft 200ms ease-in;
}

/* Back navigation */
.page-enter-back {
  animation: slideInLeft 250ms ease-out;
}
.page-exit-back {
  animation: slideOutRight 200ms ease-in;
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes slideOutLeft {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(-30px); }
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes slideOutRight {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(30px); }
}
```

### Shared Element Transition (List → Detail)

```tsx
// Framer Motion layoutId
// List page
<motion.img layoutId={`image-${item.id}`} src={item.image} />

// Detail page
<motion.img layoutId={`image-${item.id}`} src={item.image} />

// Wrapping layout with AnimatePresence
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

### Skeleton → Content Transition

```css
/* Skeleton to content morph */
.content-placeholder {
  animation: skeleton 1.5s ease-in-out infinite;
}
.content-loaded {
  animation: fadeIn 300ms ease-out;
}

/* Coordinated: skeleton out, content in */
.content-wrapper[data-loaded="true"] .content-placeholder {
  animation: fadeOut 150ms ease-in forwards;
}
.content-wrapper[data-loaded="true"] .content-real {
  animation: fadeIn 200ms ease-out 100ms forwards;
}
```

### Framework-Specific Route Transitions

See `references/framework-patterns.md` for Next.js, Nuxt, SvelteKit, and Astro page transition implementations.
