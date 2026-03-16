# Modern CSS Animations

Modern CSS features for animations without JavaScript libraries.

---

## View Transitions API

Smooth transitions between DOM states or page navigations.

### Same-Document Transitions

```js
// Trigger a view transition
document.startViewTransition(() => {
  updateDOM(); // Your DOM update logic
});
```

```css
/* Default crossfade (automatic) */
::view-transition-old(root) {
  animation: fade-out 200ms ease-in;
}
::view-transition-new(root) {
  animation: fade-in 200ms ease-out;
}

/* Custom: slide transition */
::view-transition-old(root) {
  animation: slide-out-left 250ms ease-in;
}
::view-transition-new(root) {
  animation: slide-in-right 250ms ease-out;
}

@keyframes slide-out-left {
  to { transform: translateX(-30px); opacity: 0; }
}
@keyframes slide-in-right {
  from { transform: translateX(30px); opacity: 0; }
}
```

### Named View Transitions (Shared Elements)

```css
/* Tag elements for shared transition */
.card-image {
  view-transition-name: hero-image;
}

/* Customize the shared element animation */
::view-transition-group(hero-image) {
  animation-duration: 300ms;
  animation-timing-function: ease-in-out;
}
```

### Cross-Document View Transitions (MPA)

```css
/* Enable on both pages */
@view-transition {
  navigation: auto;
}

/* Opt specific elements into shared transitions */
.page-title {
  view-transition-name: title;
}
```

### Browser Support

| Feature | Chrome | Safari | Firefox |
|---------|--------|--------|---------|
| Same-document | 111+ | 18+ | 🚧 |
| Cross-document | 126+ | 18+ | 🚧 |
| Named transitions | 111+ | 18+ | 🚧 |

---

## @starting-style

Animate elements from `display: none` — previously impossible with CSS alone.

### Dialog / Modal Entry

```css
dialog[open] {
  opacity: 1;
  transform: scale(1);
  transition: opacity 200ms ease-out, transform 200ms ease-out;

  @starting-style {
    opacity: 0;
    transform: scale(0.95);
  }
}

/* Exit requires allow-discrete for display */
dialog {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 150ms ease-in,
              transform 150ms ease-in,
              display 150ms allow-discrete;
}
```

### Popover Entry

```css
[popover]:popover-open {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 200ms ease-out,
              transform 200ms ease-out;

  @starting-style {
    opacity: 0;
    transform: translateY(-8px);
  }
}

[popover] {
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 150ms ease-in,
              transform 150ms ease-in,
              overlay 150ms allow-discrete,
              display 150ms allow-discrete;
}
```

### Toast / Notification

```css
.toast {
  transition: opacity 200ms, transform 200ms;

  &.visible {
    opacity: 1;
    transform: translateY(0);

    @starting-style {
      opacity: 0;
      transform: translateY(16px);
    }
  }
}
```

### Browser Support

| Feature | Chrome | Safari | Firefox |
|---------|--------|--------|---------|
| @starting-style | 117+ | 17.5+ | 129+ |
| allow-discrete | 117+ | 17.5+ | 129+ |

---

## Scroll-Driven Animations

Animations driven by scroll position instead of time.

### Scroll Progress (animation-timeline)

```css
/* Reading progress bar */
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: var(--color-primary);
  transform-origin: left;
  animation: grow-width linear;
  animation-timeline: scroll();
}

@keyframes grow-width {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

### Scroll-Triggered Reveal

```css
/* Fade in as element enters viewport */
.reveal-on-scroll {
  animation: fadeIn linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Parallax Effect

```css
.parallax-bg {
  animation: parallax linear;
  animation-timeline: scroll();
}

@keyframes parallax {
  from { transform: translateY(0); }
  to { transform: translateY(-100px); }
}
```

### Horizontal Scroll Progress

```css
.horizontal-scroll {
  animation: scroll-indicator linear;
  animation-timeline: scroll(self inline);
}

@keyframes scroll-indicator {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

### Browser Support

| Feature | Chrome | Safari | Firefox |
|---------|--------|--------|---------|
| animation-timeline: scroll() | 115+ | 🚧 | 🚧 |
| animation-timeline: view() | 115+ | 🚧 | 🚧 |
| animation-range | 115+ | 🚧 | 🚧 |

### Fallback Strategy

```css
/* Progressive enhancement pattern */
.reveal {
  /* Fallback: always visible */
  opacity: 1;
  transform: none;
}

@supports (animation-timeline: view()) {
  .reveal {
    animation: fadeIn linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 100%;
  }
}
```

---

## @property (Custom Property Animation)

Animate CSS custom properties that normally can't be interpolated.

### Gradient Animation

```css
@property --gradient-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.gradient-border {
  background: conic-gradient(from var(--gradient-angle), #e66465, #9198e5, #e66465);
  animation: rotate-gradient 3s linear infinite;
}

@keyframes rotate-gradient {
  to { --gradient-angle: 360deg; }
}
```

### Color Transition with Custom Properties

```css
@property --color-progress {
  syntax: "<number>";
  initial-value: 0;
  inherits: false;
}

.status-bar {
  --color-progress: 0;
  background: color-mix(in srgb, red calc(var(--color-progress) * 100%), green);
  transition: --color-progress 500ms ease-out;
}
.status-bar.complete {
  --color-progress: 1;
}
```

### Browser Support

| Feature | Chrome | Safari | Firefox |
|---------|--------|--------|---------|
| @property | 85+ | 15.4+ | 128+ |

---

## Discrete Property Transitions

Transition `display`, `content-visibility`, and other discrete properties.

```css
/* Transition display with allow-discrete */
.panel {
  display: none;
  opacity: 0;
  transition: display 200ms allow-discrete,
              opacity 200ms ease-out;
}
.panel.open {
  display: block;
  opacity: 1;

  @starting-style {
    opacity: 0;
  }
}
```

---

## Feature Detection Pattern

```css
/* Layer modern animations behind @supports */
@supports (animation-timeline: scroll()) {
  /* Scroll-driven animations */
}

@supports selector(:popover-open) {
  /* Popover transitions */
}

@supports (view-transition-name: none) {
  /* View transition customizations */
}
```

```js
// JS feature detection
if (document.startViewTransition) {
  document.startViewTransition(() => updateDOM());
} else {
  updateDOM(); // Fallback: instant update
}
```
