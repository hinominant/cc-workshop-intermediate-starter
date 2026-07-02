# bolt — Web Vitals最適化 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## CORE WEB VITALS OPTIMIZATION

### Key Metrics

| Metric | Full Name | Good | Needs Work | Poor |
|--------|-----------|------|------------|------|
| **LCP** | Largest Contentful Paint | ≤2.5s | ≤4.0s | >4.0s |
| **INP** | Interaction to Next Paint | ≤200ms | ≤500ms | >500ms |
| **CLS** | Cumulative Layout Shift | ≤0.1 | ≤0.25 | >0.25 |

### LCP Optimization

```markdown
## Common LCP Issues & Fixes

### Issue: Large hero image
Fix:
- Add `loading="eager"` and `fetchpriority="high"`
- Use next/image with priority prop
- Preload critical images
\`\`\`html
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">
\`\`\`

### Issue: Render-blocking CSS/JS
Fix:
- Inline critical CSS
- Defer non-critical JavaScript
- Use `<link rel="preload">` for critical resources

### Issue: Slow server response (TTFB)
Fix:
- Enable caching (CDN, HTTP cache)
- Optimize backend queries
- Use edge computing (Vercel Edge, Cloudflare Workers)

### Issue: Client-side rendering delay
Fix:
- Use SSR/SSG for above-the-fold content
- Stream HTML with React Suspense
- Avoid hydration waterfalls
```

### INP Optimization

```markdown
## Common INP Issues & Fixes

### Issue: Long JavaScript tasks
Fix:
- Break long tasks with `yield` or `scheduler.yield()`
- Use Web Workers for heavy computation
- Debounce/throttle event handlers

### Issue: Slow event handlers
Fix:
- Use `useTransition` for non-urgent updates
- Virtualize long lists
- Memoize expensive components

### Issue: Layout thrashing
Fix:
- Batch DOM reads/writes
- Use `requestAnimationFrame` for animations
- Avoid forced synchronous layouts

### Measurement
\`\`\`javascript
// INP measurement with web-vitals
import { onINP } from 'web-vitals';

onINP((metric) => {
  console.log('INP:', metric.value);
  // Report to analytics
});
\`\`\`
```

### CLS Optimization

```markdown
## Common CLS Issues & Fixes

### Issue: Images without dimensions
Fix:
\`\`\`jsx
// Always specify dimensions
<img src="..." width={800} height={600} alt="..." />

// Or use aspect-ratio CSS
<div style={{ aspectRatio: '16/9' }}>
  <img src="..." style={{ width: '100%', height: '100%' }} />
</div>
\`\`\`

### Issue: Ads/embeds causing shifts
Fix:
- Reserve space with min-height
- Use contain-intrinsic-size CSS
- Lazy load below the fold only

### Issue: Web fonts causing FOUT
Fix:
\`\`\`css
/* Fallback font with similar metrics */
font-family: 'Custom Font', system-ui, sans-serif;
font-display: swap;
\`\`\`

### Issue: Dynamic content insertion
Fix:
- Reserve space for dynamic content
- Use skeleton loaders with fixed dimensions
- Avoid inserting content above existing content
```

### Web Vitals Monitoring

```typescript
// web-vitals integration
import { onLCP, onINP, onCLS } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  // Send to your analytics provider
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
  });

  // Use sendBeacon for reliability
  navigator.sendBeacon('/api/vitals', body);
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
```

---

## PROFILING TOOLS

### Frontend Profiling

| Tool | Use Case | Command/Setup |
|------|----------|---------------|
| **React DevTools Profiler** | Component render timing | Browser extension |
| **Chrome DevTools Performance** | JS execution, layout, paint | F12 → Performance |
| **Lighthouse** | Core Web Vitals audit | F12 → Lighthouse |
| **web-vitals** | Real user metrics | `npm i web-vitals` |
| **why-did-you-render** | Unnecessary re-renders | `npm i @welldone-software/why-did-you-render` |

### React Profiling

```typescript
// Enable React Profiler in development
import { Profiler } from 'react';

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) {
  console.log(`${id} ${phase}: ${actualDuration.toFixed(2)}ms`);
}

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>
```

### Backend Profiling

| Tool | Use Case | Command/Setup |
|------|----------|---------------|
| **Node.js --inspect** | CPU profiling, heap | `node --inspect app.js` |
| **clinic.js** | Node.js performance suite | `npx clinic doctor -- node app.js` |
| **0x** | Flame graphs | `npx 0x app.js` |
| **autocannon** | HTTP load testing | `npx autocannon http://localhost:3000` |

### Node.js Profiling Commands

```bash
# CPU profiling with Chrome DevTools
node --inspect-brk app.js
# Open chrome://inspect

# Generate flame graph with 0x
npx 0x app.js
# Creates interactive flame graph

# Load testing with autocannon
npx autocannon -c 100 -d 30 http://localhost:3000/api/users
# -c: connections, -d: duration in seconds

# Memory profiling
node --expose-gc --inspect app.js
# In DevTools: Memory tab → Take heap snapshot
```

### Bundle Analysis

```bash
# Next.js bundle analyzer
ANALYZE=true npm run build

# Webpack bundle analyzer
npx webpack-bundle-analyzer stats.json

# Source map explorer
npx source-map-explorer 'dist/**/*.js'

# Bundlephobia (check before installing)
# https://bundlephobia.com/package/lodash
```

---

