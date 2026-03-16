# Easing Guide

Choosing the right easing curve is crucial for natural-feeling animations.

---

## Easing Reference

| Easing | CSS Value | Feel | Use For |
|--------|-----------|------|---------|
| **ease-out** | `cubic-bezier(0, 0, 0.2, 1)` | Quick start, gentle stop | Entry animations, responses to user action |
| **ease-in** | `cubic-bezier(0.4, 0, 1, 1)` | Slow start, quick end | Exit animations, elements leaving view |
| **ease-in-out** | `cubic-bezier(0.4, 0, 0.2, 1)` | Smooth both ends | State changes, toggles, morphing |
| **linear** | `linear` | Constant speed | Progress bars, continuous rotation |
| **ease-out-back** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Overshoot | Playful entrances, emphasis |
| **ease-in-back** | `cubic-bezier(0.36, 0, 0.66, -0.56)` | Pull back | Playful exits |
| **spring** | JS only | Bouncy, natural | Interactive elements, drag release |

---

## Easing Visual Guide

```
ease-out (Entry):     ████████░░  Fast start → Slow end
ease-in (Exit):       ░░████████  Slow start → Fast end
ease-in-out (State):  ░░██████░░  Slow → Fast → Slow
linear (Progress):    █████████░  Constant speed
```

---

## Custom Easing Definitions

```css
:root {
  /* Standard easings */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* Expressive easings */
  --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-in-back: cubic-bezier(0.36, 0, 0.66, -0.56);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

  /* Subtle easings */
  --ease-out-soft: cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

---

## Easing Selection Guide

```
User Action Response → ease-out (feel responsive)
Element Appearing → ease-out (natural arrival)
Element Disappearing → ease-in (natural departure)
Toggle/Switch → ease-in-out (smooth state change)
Hover Effect → ease-out (immediate feedback)
Loading Spinner → linear (continuous motion)
Playful/Fun UI → ease-out-back (slight overshoot)
Drag Release → spring (physics-based)
Page Transition → ease-in-out (smooth navigation)
Scroll-driven → linear or ease-out (follows scroll position)
```

---

## Spring Animation (JS)

### React Spring

```tsx
const styles = useSpring({
  transform: isOpen ? 'scale(1)' : 'scale(0.95)',
  config: { tension: 300, friction: 20 } // Snappy
  // config: { tension: 170, friction: 26 } // Gentle
  // config: { tension: 120, friction: 14 } // Bouncy
});
```

### Framer Motion

```tsx
<motion.div
  animate={{ scale: 1 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
/>
```

### Spring Presets

| Preset | Tension | Friction | Feel | Use For |
|--------|---------|----------|------|---------|
| Snappy | 300 | 20 | Quick, minimal bounce | Buttons, toggles |
| Gentle | 170 | 26 | Smooth, no bounce | Modals, panels |
| Bouncy | 120 | 14 | Playful overshoot | Notifications, badges |
| Stiff | 400 | 30 | Immediate, crisp | Drag release |
| Wobbly | 180 | 12 | Loose, fun | Playful UI elements |

### CSS Spring Approximation

```css
/* Approximate spring with cubic-bezier */
/* Snappy spring ≈ */
--spring-snappy: cubic-bezier(0.25, 1.5, 0.5, 1);
/* Gentle spring ≈ */
--spring-gentle: cubic-bezier(0.33, 1, 0.68, 1);
/* Use CSS linear() for more accurate approximation (Chrome 113+) */
--spring-bounce: linear(
  0, 0.006, 0.025, 0.058, 0.104, 0.163, 0.235, 0.318,
  0.412, 0.515, 0.625, 0.738, 0.851, 0.959, 1.057,
  1.14, 1.203, 1.245, 1.264, 1.262, 1.24, 1.202,
  1.151, 1.092, 1.031, 0.972, 0.92, 0.878, 0.849,
  0.834, 0.834, 0.849, 0.877, 0.916, 0.963, 1.012,
  1.056, 1.089, 1.108, 1.11, 1.098, 1.074, 1.042,
  1.007, 0.974, 0.946, 0.926, 0.916, 0.916, 0.926,
  0.946, 0.972, 1
);
```
