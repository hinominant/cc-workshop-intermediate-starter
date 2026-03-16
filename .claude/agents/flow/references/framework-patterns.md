# Framework-Specific Animation Patterns

Animation implementations across popular frontend frameworks.

---

## Tailwind CSS

### Built-in Animation Utilities

```html
<!-- Spin (loading) -->
<svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">...</svg>

<!-- Ping (notification badge) -->
<span class="animate-ping absolute h-3 w-3 rounded-full bg-red-400"></span>

<!-- Pulse (skeleton) -->
<div class="animate-pulse bg-gray-200 h-4 rounded"></div>

<!-- Bounce -->
<div class="animate-bounce">↓</div>
```

### Transition Utilities

```html
<!-- Hover with transition -->
<button class="transition-colors duration-200 ease-out hover:bg-blue-600">
  Click me
</button>

<!-- Transform on hover -->
<div class="transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg">
  Card
</div>

<!-- Active press feedback -->
<button class="transition-transform duration-100 active:scale-95">
  Press
</button>

<!-- Group hover -->
<div class="group">
  <div class="transition-opacity duration-200 opacity-0 group-hover:opacity-100">
    Tooltip
  </div>
</div>
```

### Custom Keyframes in Tailwind

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%, 80%': { transform: 'translateX(4px)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'shake': 'shake 0.4s ease-in-out',
      },
    },
  },
};
```

```html
<div class="animate-slide-up">Content</div>
```

### Reduced Motion in Tailwind

```html
<!-- Tailwind v3.1+ motion-safe/motion-reduce -->
<div class="motion-safe:animate-slide-up motion-reduce:animate-none">
  Accessible animation
</div>
```

---

## Vue

### `<Transition>` Component

```vue
<template>
  <Transition name="fade">
    <div v-if="show">Content</div>
  </Transition>
</template>

<style>
.fade-enter-active { transition: opacity 200ms ease-out; }
.fade-leave-active { transition: opacity 150ms ease-in; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
```

### `<TransitionGroup>` for Lists

```vue
<template>
  <TransitionGroup name="list" tag="ul">
    <li v-for="item in items" :key="item.id">{{ item.text }}</li>
  </TransitionGroup>
</template>

<style>
.list-enter-active { transition: all 300ms ease-out; }
.list-leave-active { transition: all 200ms ease-in; position: absolute; }
.list-enter-from { opacity: 0; transform: translateY(16px); }
.list-leave-to { opacity: 0; transform: translateX(30px); }
.list-move { transition: transform 300ms ease-in-out; }
</style>
```

### JavaScript Hooks

```vue
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @leave="onLeave"
  :css="false"
>
  <div v-if="show">Content</div>
</Transition>

<script setup>
function onEnter(el, done) {
  el.animate(
    [
      { opacity: 0, transform: 'scale(0.95)' },
      { opacity: 1, transform: 'scale(1)' }
    ],
    { duration: 200, easing: 'cubic-bezier(0, 0, 0.2, 1)' }
  ).onfinish = done;
}
</script>
```

### Nuxt Page Transitions

```vue
<!-- app.vue or layouts/default.vue -->
<template>
  <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
</template>

<style>
.page-enter-active { transition: opacity 200ms ease-out; }
.page-leave-active { transition: opacity 150ms ease-in; }
.page-enter-from, .page-leave-to { opacity: 0; }
</style>
```

---

## Svelte

### Built-in Transitions

```svelte
<script>
  import { fade, fly, slide, scale, blur } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  let visible = true;
</script>

<!-- Fade -->
{#if visible}
  <div transition:fade={{ duration: 200 }}>Fades in/out</div>
{/if}

<!-- Fly (slide + fade) -->
{#if visible}
  <div transition:fly={{ y: 16, duration: 300, easing: quintOut }}>
    Slides up
  </div>
{/if}

<!-- Scale -->
{#if visible}
  <div transition:scale={{ start: 0.95, duration: 200 }}>
    Scales in
  </div>
{/if}

<!-- Separate in/out -->
{#if visible}
  <div in:fly={{ y: 20 }} out:fade={{ duration: 150 }}>
    Different enter/exit
  </div>
{/if}
```

### Animate Directive (List Reorder)

```svelte
<script>
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';
</script>

{#each items as item (item.id)}
  <div animate:flip={{ duration: 300 }} transition:fade>
    {item.text}
  </div>
{/each}
```

### Custom Transition

```svelte
<script>
  function typewriter(node, { speed = 1 }) {
    const text = node.textContent;
    const duration = text.length / (speed * 0.01);
    return {
      duration,
      tick: (t) => {
        const i = Math.trunc(text.length * t);
        node.textContent = text.slice(0, i);
      },
    };
  }
</script>

{#if visible}
  <p transition:typewriter={{ speed: 2 }}>Hello world</p>
{/if}
```

### SvelteKit Page Transitions

```svelte
<!-- +layout.svelte -->
<script>
  import { fly } from 'svelte/transition';
  export let data;
</script>

{#key data.pathname}
  <div in:fly={{ y: 10, duration: 200 }} out:fade={{ duration: 150 }}>
    <slot />
  </div>
{/key}
```

---

## Vanilla JS (Web Animations API)

### element.animate()

```js
// Fade in
element.animate(
  [
    { opacity: 0, transform: 'translateY(16px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ],
  {
    duration: 300,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    fill: 'forwards'
  }
);
```

### Controllable Animation

```js
const animation = element.animate(
  [{ transform: 'scale(0.95)' }, { transform: 'scale(1)' }],
  { duration: 200, easing: 'ease-out' }
);

// Control
animation.pause();
animation.play();
animation.reverse();
animation.cancel();

// Promise-based
await animation.finished;
console.log('Animation complete');
```

### Staggered Animation

```js
const items = document.querySelectorAll('.list-item');
items.forEach((item, index) => {
  item.animate(
    [
      { opacity: 0, transform: 'translateY(20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ],
    {
      duration: 300,
      delay: index * 50,
      easing: 'cubic-bezier(0, 0, 0.2, 1)',
      fill: 'forwards'
    }
  );
});
```

### Reduced Motion Check

```js
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateElement(el, keyframes, options) {
  if (prefersReducedMotion) {
    // Apply final state instantly
    const lastFrame = keyframes[keyframes.length - 1];
    Object.assign(el.style, lastFrame);
    return;
  }
  return el.animate(keyframes, options);
}
```

---

## Next.js App Router

### Page Transitions with View Transitions

```tsx
// app/template.tsx (wraps each page)
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="animate-fade-in">
      {children}
    </div>
  );
}
```

### With Framer Motion

```tsx
// app/template.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

---

## Astro View Transitions

```astro
---
// Layout.astro
import { ViewTransitions } from 'astro:transitions';
---
<html>
  <head>
    <ViewTransitions />
  </head>
  <body>
    <slot />
  </body>
</html>
```

```astro
<!-- Component with named transition -->
<img
  transition:name="hero"
  transition:animate="slide"
  src="/hero.jpg"
/>
```
