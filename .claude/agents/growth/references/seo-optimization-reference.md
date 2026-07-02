# growth — SEO最適化 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## SEO CHECKLIST

### Page-Level SEO

**Meta Tags:**
- [ ] `<title>` - Unique, 50-60 characters, includes primary keyword
- [ ] `<meta name="description">` - Compelling, 150-160 characters, includes CTA
- [ ] `<meta name="robots">` - Appropriate index/follow directives
- [ ] `<link rel="canonical">` - Self-referencing or pointing to primary URL
- [ ] `<html lang="xx">` - Correct language attribute

**Heading Structure:**
- [ ] Single `<h1>` per page with primary keyword
- [ ] Logical hierarchy: h1 → h2 → h3 (no skipping levels)
- [ ] Keywords in headings (natural, not stuffed)
- [ ] Headings describe content below them

**Content:**
- [ ] Primary keyword in first 100 words
- [ ] Internal links to related pages
- [ ] External links to authoritative sources (where relevant)
- [ ] Content answers user intent (informational, transactional, navigational)

**Images:**
- [ ] Descriptive `alt` text on all images
- [ ] Compressed and properly sized
- [ ] Lazy loading for below-fold images
- [ ] WebP format with fallbacks

**URLs:**
- [ ] Clean, readable URLs (no query strings for content pages)
- [ ] Keywords in URL path
- [ ] Lowercase, hyphens for spaces

### Site-Level SEO

**Technical:**
- [ ] `robots.txt` - Properly configured, not blocking important resources
- [ ] `sitemap.xml` - Up to date, submitted to Search Console
- [ ] HTTPS everywhere (no mixed content)
- [ ] Mobile-friendly (responsive design)
- [ ] Core Web Vitals passing (LCP, FID, CLS)

**Structure:**
- [ ] Breadcrumb navigation
- [ ] Clear internal linking structure
- [ ] 404 page with navigation options
- [ ] No orphan pages (all pages linked from somewhere)

**International (if applicable):**
- [ ] `hreflang` tags for language/region variants
- [ ] Country/language-specific sitemaps

---

## JSON-LD TEMPLATES

### Product

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "image": [
    "https://example.com/photos/1x1/photo.jpg",
    "https://example.com/photos/4x3/photo.jpg"
  ],
  "description": "Product description here",
  "sku": "SKU-12345",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/product",
    "priceCurrency": "JPY",
    "price": "9800",
    "priceValidUntil": "2025-12-31",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Seller Name"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "123"
  }
}
</script>
```

### Article / Blog Post

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title (max 110 characters)",
  "image": [
    "https://example.com/photos/1x1/photo.jpg"
  ],
  "datePublished": "2024-01-15T08:00:00+09:00",
  "dateModified": "2024-01-20T10:00:00+09:00",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://example.com/author"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Publisher Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "description": "Article description for search results"
}
</script>
```

### FAQ

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is your return policy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can return any item within 30 days of purchase."
      }
    },
    {
      "@type": "Question",
      "name": "How long does shipping take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Standard shipping takes 3-5 business days."
      }
    }
  ]
}
</script>
```

### Breadcrumb

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Category",
      "item": "https://example.com/category"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Current Page",
      "item": "https://example.com/category/page"
    }
  ]
}
</script>
```

### Organization

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": [
    "https://twitter.com/company",
    "https://www.linkedin.com/company/company",
    "https://github.com/company"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+81-3-1234-5678",
    "contactType": "customer service",
    "availableLanguage": ["Japanese", "English"]
  }
}
</script>
```

### LocalBusiness

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Business Name",
  "image": "https://example.com/photo.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1-2-3 Shibuya",
    "addressLocality": "Shibuya-ku",
    "addressRegion": "Tokyo",
    "postalCode": "150-0001",
    "addressCountry": "JP"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 35.6595,
    "longitude": 139.7004
  },
  "telephone": "+81-3-1234-5678",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ]
}
</script>
```

### SoftwareApplication

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "App Name",
  "operatingSystem": "Web, iOS, Android",
  "applicationCategory": "ProductivityApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1000"
  }
}
</script>
```

---

## OGP / TWITTER CARD TEMPLATES

### Basic Meta Tags (HTML)

```html
<head>
  <!-- Primary Meta Tags -->
  <title>Page Title - Site Name</title>
  <meta name="title" content="Page Title - Site Name">
  <meta name="description" content="Compelling description under 160 characters">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com/page">
  <meta property="og:title" content="Page Title">
  <meta property="og:description" content="Compelling description for social sharing">
  <meta property="og:image" content="https://example.com/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Site Name">
  <meta property="og:locale" content="ja_JP">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://example.com/page">
  <meta property="twitter:title" content="Page Title">
  <meta property="twitter:description" content="Compelling description for Twitter">
  <meta property="twitter:image" content="https://example.com/twitter-image.png">
  <meta property="twitter:site" content="@username">
  <meta property="twitter:creator" content="@author">
</head>
```

### Next.js Metadata API (App Router)

```typescript
// app/page.tsx or app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description for search engines',
  openGraph: {
    title: 'OG Title',
    description: 'OG Description',
    url: 'https://example.com/page',
    siteName: 'Site Name',
    images: [
      {
        url: 'https://example.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OG Image Alt',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Twitter Title',
    description: 'Twitter Description',
    site: '@username',
    creator: '@author',
    images: ['https://example.com/twitter-image.png'],
  },
};
```

### Dynamic OG Image (Next.js)

```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? 'Default Title';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a2e',
          fontSize: 48,
          fontWeight: 'bold',
          color: 'white',
        }}
      >
        <div style={{ marginBottom: 24 }}>🚀</div>
        <div style={{ textAlign: 'center', padding: '0 48px' }}>{title}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

// Usage in page metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const title = await getPageTitle(params.slug);
  return {
    openGraph: {
      images: [`/api/og?title=${encodeURIComponent(title)}`],
    },
  };
}
```

### React Helmet Component

```tsx
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export function SEO({ title, description, image, url, type = 'website' }: SEOProps) {
  const siteUrl = 'https://example.com';
  const defaultImage = `${siteUrl}/default-og.png`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={url || siteUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
}
```

### OG Image Specifications

| Platform | Card Type | Dimensions | Aspect Ratio |
|----------|-----------|------------|--------------|
| Facebook/LinkedIn | Standard | 1200 x 630 | 1.91:1 |
| Twitter | summary_large_image | 1200 x 628 | 1.91:1 |
| Twitter | summary | 144 x 144 (min) | 1:1 |
| Slack/Discord | Standard | 1200 x 630 | 1.91:1 |

---

## CORE WEB VITALS OPTIMIZATION

### LCP (Largest Contentful Paint) - Target: < 2.5s

**Optimize Hero Images:**
```html
<!-- Preload critical hero image -->
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">

<!-- Responsive images with srcset -->
<img
  src="/hero-800.webp"
  srcset="/hero-400.webp 400w, /hero-800.webp 800w, /hero-1200.webp 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  alt="Hero description"
  fetchpriority="high"
  decoding="async"
/>
```

**Optimize Fonts:**
```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>

<!-- Font display swap to prevent FOIT -->
<style>
@font-face {
  font-family: 'Main Font';
  src: url('/fonts/main.woff2') format('woff2');
  font-display: swap;
}
</style>
```

**Server-Side Rendering / Static Generation:**
```typescript
// Next.js - Prefer SSG/SSR for LCP-critical pages
export async function getStaticProps() {
  const data = await fetchCriticalData();
  return { props: { data }, revalidate: 3600 };
}
```

### INP (Interaction to Next Paint) - Target: < 200ms

**Debounce/Throttle Event Handlers:**
```typescript
import { useDebouncedCallback } from 'use-debounce';

function SearchInput() {
  const handleSearch = useDebouncedCallback((value: string) => {
    // Expensive search operation
    performSearch(value);
  }, 300);

  return <input onChange={(e) => handleSearch(e.target.value)} />;
}
```

**Use Web Workers for Heavy Computation:**
```typescript
// worker.ts
self.onmessage = (e) => {
  const result = heavyComputation(e.data);
  self.postMessage(result);
};

// component.tsx
const worker = new Worker(new URL('./worker.ts', import.meta.url));
worker.postMessage(data);
worker.onmessage = (e) => setResult(e.data);
```

**Avoid Long Tasks:**
```typescript
// Break up long tasks with scheduler.yield() or setTimeout
async function processItems(items: Item[]) {
  for (const item of items) {
    processItem(item);
    // Yield to main thread periodically
    if (shouldYield()) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
}
```

### CLS (Cumulative Layout Shift) - Target: < 0.1

**Reserve Space for Dynamic Content:**
```css
/* Reserve space for images */
.image-container {
  aspect-ratio: 16 / 9;
  background-color: #f0f0f0;
}

/* Reserve space for ads */
.ad-slot {
  min-height: 250px;
}
```

**Prevent Font-Induced Layout Shift:**
```css
/* Use size-adjust for fallback fonts */
@font-face {
  font-family: 'Fallback';
  src: local('Arial');
  size-adjust: 105%;
  ascent-override: 95%;
  descent-override: 22%;
  line-gap-override: 0%;
}

body {
  font-family: 'Main Font', 'Fallback', sans-serif;
}
```

**Avoid Inserting Content Above Existing Content:**
```tsx
// BAD: Toast appears and pushes content down
<div>
  {showToast && <Toast />}
  <MainContent />
</div>

// GOOD: Toast overlays without shifting
<div>
  <MainContent />
  {showToast && <Toast className="fixed bottom-4 right-4" />}
</div>
```

**Set Dimensions on Media Elements:**
```html
<!-- Always include width and height -->
<img src="photo.jpg" width="800" height="600" alt="Photo" />
<video width="1280" height="720" poster="poster.jpg"></video>
<iframe width="560" height="315" src="..."></iframe>
```

### Performance Monitoring

```typescript
// Report Core Web Vitals
import { onCLS, onFID, onLCP, onINP } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
  });
  navigator.sendBeacon('/analytics', body);
}

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onLCP(sendToAnalytics);
onINP(sendToAnalytics);
```

---

## BOLT INTEGRATION

### Performance Optimization Flow

When Growth identifies performance issues affecting SEO:

1. **Growth identifies** - Core Web Vitals failing or slow page speed
2. **Create proposal** - Document performance bottlenecks
3. **Hand off to Bolt** - `/Bolt optimize performance`
4. **Bolt implements** - Applies performance optimizations

### Handoff Template

```markdown
## Growth → Bolt Performance Request

**Issue:** [Core Web Vitals failing | Slow page load | Poor mobile performance]

**Current Metrics:**
- LCP: [X.Xs] (target: < 2.5s)
- INP: [Xms] (target: < 200ms)
- CLS: [X.XX] (target: < 0.1)
- PageSpeed Score: [X/100]

**Identified Bottlenecks:**
1. [Large unoptimized images]
2. [Render-blocking JavaScript]
3. [No caching headers]

**Affected Pages:**
- [/page-url] - [specific issue]

**Impact on Growth:**
- SEO ranking affected by Core Web Vitals
- High bounce rate due to slow load

**Requested Optimizations:**
- [ ] Image optimization (WebP, srcset)
- [ ] Code splitting and lazy loading
- [ ] Font optimization
- [ ] Caching strategy

Suggested command: `/Bolt optimize performance`
```

### LCP Improvement Request

```markdown
## Growth → Bolt LCP Optimization

**Current LCP:** [X.Xs]
**Target LCP:** < 2.5s
**LCP Element:** [Hero image | Heading | Video]

**Proposed Fixes:**
1. Preload LCP element
2. Optimize image format/size
3. Implement SSR/SSG for critical content

Suggested command: `/Bolt fix LCP`
```

---

