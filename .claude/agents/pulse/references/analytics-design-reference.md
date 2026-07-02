# pulse — アナリティクス設計 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## NORTH STAR METRIC FRAMEWORK

### Definition Template

```markdown
## North Star Metric

**Metric:** [Name of the metric]
**Definition:** [Precise calculation formula]
**Why this metric:** [Connection to business value and user value]
**Frequency:** [How often to measure: daily, weekly, monthly]
**Owner:** [Team or person responsible]

### Supporting Metrics (Input Metrics)

| Metric | Definition | Relationship to NSM |
|--------|------------|---------------------|
| [Metric 1] | [Calculation] | [How it influences NSM] |
| [Metric 2] | [Calculation] | [How it influences NSM] |
| [Metric 3] | [Calculation] | [How it influences NSM] |

### Counter Metrics (Health Metrics)

| Metric | Definition | Threshold |
|--------|------------|-----------|
| [Quality metric] | [Calculation] | [Acceptable range] |
| [Risk metric] | [Calculation] | [Alert threshold] |
```

### Common North Star Metrics by Product Type

| Product Type | North Star Metric | Example |
|--------------|-------------------|---------|
| **SaaS B2B** | Weekly Active Teams | Slack, Notion |
| **SaaS B2C** | Weekly Active Users | Spotify, Netflix |
| **E-commerce** | Weekly Purchases | Amazon, Rakuten |
| **Marketplace** | Weekly Transactions | Mercari, Airbnb |
| **Media/Content** | Weekly Engaged Time | YouTube, Medium |
| **Fintech** | Weekly Transaction Volume | PayPay, Revolut |

---

## EVENT SCHEMA DESIGN

### Naming Conventions

```
[object]_[action]

Examples:
- user_signed_up
- item_added_to_cart
- checkout_completed
- article_viewed
- subscription_started
```

### Event Structure Template

```typescript
interface AnalyticsEvent {
  // Required
  event_name: string;           // e.g., "checkout_completed"
  timestamp: string;            // ISO 8601 format
  user_id?: string;             // Authenticated user ID
  anonymous_id: string;         // Device/session identifier

  // Context (auto-captured)
  context: {
    page_url: string;
    page_title: string;
    referrer: string;
    user_agent: string;
    locale: string;
    timezone: string;
  };

  // Event-specific properties
  properties: Record<string, unknown>;
}
```

### Common Event Examples

```typescript
// User Signup
{
  event_name: "user_signed_up",
  properties: {
    signup_method: "email" | "google" | "apple",
    referral_source: string,
    plan_type: "free" | "pro" | "enterprise"
  }
}

// Purchase Completed
{
  event_name: "purchase_completed",
  properties: {
    order_id: string,
    total_amount: number,
    currency: "JPY" | "USD",
    item_count: number,
    payment_method: string,
    coupon_code?: string
  }
}

// Feature Used
{
  event_name: "feature_used",
  properties: {
    feature_name: string,
    feature_version: string,
    duration_seconds?: number,
    success: boolean
  }
}

// Content Viewed
{
  event_name: "content_viewed",
  properties: {
    content_id: string,
    content_type: "article" | "video" | "product",
    content_title: string,
    view_duration_seconds: number,
    scroll_depth_percent: number
  }
}
```

---

## FUNNEL ANALYSIS DESIGN

### Funnel Definition Template

```markdown
## Funnel: [Funnel Name]

**Goal:** [What conversion does this funnel measure?]
**Timeframe:** [How long should conversion window be?]

### Steps

| Step | Event | Criteria |
|------|-------|----------|
| 1 | `landing_page_viewed` | page_type = "landing" |
| 2 | `signup_form_started` | - |
| 3 | `signup_form_submitted` | - |
| 4 | `email_verified` | - |
| 5 | `onboarding_completed` | - |

### Expected Conversion Rates

| Step | Target Rate | Action if Below |
|------|-------------|-----------------|
| 1→2 | 30% | Improve CTA visibility |
| 2→3 | 70% | Reduce form friction |
| 3→4 | 80% | Improve email deliverability |
| 4→5 | 50% | Simplify onboarding |

### Segments to Analyze

- By acquisition source (organic, paid, referral)
- By device type (mobile, desktop)
- By user plan (free, paid)
```

### Funnel Implementation (GA4)

```typescript
// Track funnel steps
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics();

// Step 1: Landing page view
logEvent(analytics, 'landing_page_viewed', {
  page_type: 'landing',
  campaign: 'summer_sale'
});

// Step 2: Signup started
logEvent(analytics, 'signup_form_started', {
  form_location: 'hero_section'
});

// Step 3: Signup submitted
logEvent(analytics, 'signup_form_submitted', {
  signup_method: 'email'
});

// Step 4: Email verified
logEvent(analytics, 'email_verified', {
  verification_time_minutes: 5
});

// Step 5: Onboarding completed
logEvent(analytics, 'onboarding_completed', {
  steps_completed: 5,
  total_steps: 5
});
```

---

## COHORT ANALYSIS DESIGN

### Cohort Definition Template

```markdown
## Cohort: [Cohort Name]

**Cohort Type:** [Acquisition | Behavioral | Time-based]
**Cohort Event:** [Event that defines cohort membership]
**Retention Event:** [Event that defines "active" for this cohort]
**Time Period:** [Weekly | Monthly]

### Cohort Table Structure

| Cohort | Week 0 | Week 1 | Week 2 | Week 3 | Week 4 |
|--------|--------|--------|--------|--------|--------|
| Jan W1 | 100% | 40% | 30% | 25% | 22% |
| Jan W2 | 100% | 42% | 32% | 27% | - |
| Jan W3 | 100% | 38% | 28% | - | - |
| Jan W4 | 100% | 45% | - | - | - |

### Benchmark Targets

| Period | Target Retention | Industry Average |
|--------|------------------|------------------|
| Week 1 | 40% | 35% |
| Month 1 | 25% | 20% |
| Month 3 | 15% | 10% |
```

### Cohort Analysis Implementation

```typescript
interface CohortConfig {
  cohortEvent: string;       // Event that creates cohort membership
  retentionEvent: string;    // Event that counts as "retained"
  cohortProperty?: string;   // Optional: property to segment cohorts
  periodType: 'day' | 'week' | 'month';
  periodsToAnalyze: number;
}

const signupCohortConfig: CohortConfig = {
  cohortEvent: 'user_signed_up',
  retentionEvent: 'session_started',
  periodType: 'week',
  periodsToAnalyze: 12
};

// SQL query for cohort analysis (BigQuery/Snowflake)
const cohortQuery = `
WITH cohorts AS (
  SELECT
    user_id,
    DATE_TRUNC(MIN(event_timestamp), WEEK) as cohort_week
  FROM events
  WHERE event_name = 'user_signed_up'
  GROUP BY user_id
),
activity AS (
  SELECT
    user_id,
    DATE_TRUNC(event_timestamp, WEEK) as activity_week
  FROM events
  WHERE event_name = 'session_started'
  GROUP BY user_id, activity_week
)
SELECT
  c.cohort_week,
  DATE_DIFF(a.activity_week, c.cohort_week, WEEK) as weeks_since_signup,
  COUNT(DISTINCT c.user_id) as users
FROM cohorts c
LEFT JOIN activity a ON c.user_id = a.user_id
GROUP BY cohort_week, weeks_since_signup
ORDER BY cohort_week, weeks_since_signup
`;
```

---

## DASHBOARD SPECIFICATION

### Dashboard Template

```markdown
## Dashboard: [Dashboard Name]

**Purpose:** [What questions does this dashboard answer?]
**Audience:** [Who will use this dashboard?]
**Refresh Rate:** [Real-time | Hourly | Daily]

### Sections

#### 1. Executive Summary
- North Star Metric (current + trend)
- Key conversion rates
- Revenue metrics (if applicable)

#### 2. Acquisition
- New users by source
- Signup funnel conversion
- CAC by channel

#### 3. Engagement
- DAU/WAU/MAU
- Feature adoption rates
- Session frequency & duration

#### 4. Retention
- Cohort retention curves
- Churn rate
- Reactivation rate

#### 5. Revenue (if applicable)
- MRR/ARR
- ARPU
- LTV/CAC ratio

### Filters
- Date range
- User segment
- Platform (web/mobile)
- Geography
```

### Chart Specifications

```typescript
interface ChartSpec {
  title: string;
  type: 'line' | 'bar' | 'funnel' | 'table' | 'number';
  metric: string;
  dimensions?: string[];
  timeGranularity?: 'hour' | 'day' | 'week' | 'month';
  comparison?: 'previous_period' | 'year_over_year';
  goal?: number;
}

const dashboardCharts: ChartSpec[] = [
  {
    title: 'Daily Active Users',
    type: 'line',
    metric: 'unique_users',
    timeGranularity: 'day',
    comparison: 'previous_period',
    goal: 10000
  },
  {
    title: 'Signup Funnel',
    type: 'funnel',
    metric: 'conversion_rate',
    dimensions: ['step_name']
  },
  {
    title: 'Revenue by Plan',
    type: 'bar',
    metric: 'mrr',
    dimensions: ['plan_type'],
    timeGranularity: 'month'
  }
];
```

---

## ANALYTICS PLATFORM INTEGRATION

### GA4 Implementation

```typescript
// lib/analytics.ts
import { getAnalytics, logEvent, setUserProperties } from 'firebase/analytics';

const analytics = getAnalytics();

// Track event
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  logEvent(analytics, eventName, properties);
}

// Set user properties
export function setUserTraits(traits: Record<string, unknown>) {
  setUserProperties(analytics, traits);
}

// Track page view
export function trackPageView(pagePath: string, pageTitle: string) {
  logEvent(analytics, 'page_view', {
    page_path: pagePath,
    page_title: pageTitle
  });
}
```

### Amplitude Implementation

```typescript
// lib/analytics.ts
import * as amplitude from '@amplitude/analytics-browser';

amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!);

export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  amplitude.track(eventName, properties);
}

export function identifyUser(
  userId: string,
  traits?: Record<string, unknown>
) {
  amplitude.setUserId(userId);
  if (traits) {
    const identify = new amplitude.Identify();
    Object.entries(traits).forEach(([key, value]) => {
      identify.set(key, value as string);
    });
    amplitude.identify(identify);
  }
}

export function trackRevenue(
  productId: string,
  price: number,
  quantity: number
) {
  const revenue = new amplitude.Revenue()
    .setProductId(productId)
    .setPrice(price)
    .setQuantity(quantity);
  amplitude.revenue(revenue);
}
```

### Mixpanel Implementation

```typescript
// lib/analytics.ts
import mixpanel from 'mixpanel-browser';

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!);

export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  mixpanel.track(eventName, properties);
}

export function identifyUser(
  userId: string,
  traits?: Record<string, unknown>
) {
  mixpanel.identify(userId);
  if (traits) {
    mixpanel.people.set(traits);
  }
}

export function trackPageView() {
  mixpanel.track_pageview();
}
```

### React Hook for Analytics

```typescript
// hooks/useAnalytics.ts
import { useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent, trackPageView } from '@/lib/analytics';

export function useAnalytics() {
  const pathname = usePathname();

  // Auto-track page views
  useEffect(() => {
    trackPageView(pathname, document.title);
  }, [pathname]);

  // Track custom events
  const track = useCallback((
    eventName: string,
    properties?: Record<string, unknown>
  ) => {
    trackEvent(eventName, {
      ...properties,
      page_path: pathname
    });
  }, [pathname]);

  return { track };
}

// Usage
function CheckoutButton() {
  const { track } = useAnalytics();

  const handleClick = () => {
    track('checkout_started', { cart_value: 9800 });
    // ... proceed to checkout
  };

  return <button onClick={handleClick}>Checkout</button>;
}
```

---

## PRIVACY & CONSENT

### Consent Management

```typescript
// lib/consent.ts
type ConsentCategory = 'analytics' | 'marketing' | 'functional';

interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export function getConsentState(): ConsentState {
  const stored = localStorage.getItem('user_consent');
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    analytics: false,
    marketing: false,
    functional: true
  };
}

export function setConsentState(consent: ConsentState) {
  localStorage.setItem('user_consent', JSON.stringify(consent));

  // Update analytics based on consent
  if (consent.analytics) {
    enableAnalytics();
  } else {
    disableAnalytics();
  }
}

export function hasConsent(category: ConsentCategory): boolean {
  return getConsentState()[category];
}
```

### Privacy-Safe Tracking

```typescript
// Track only with consent
export function trackEventWithConsent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  if (!hasConsent('analytics')) {
    return;
  }

  // Remove PII from properties
  const safeProperties = removePII(properties);
  trackEvent(eventName, safeProperties);
}

function removePII(
  properties?: Record<string, unknown>
): Record<string, unknown> | undefined {
  if (!properties) return undefined;

  const piiFields = ['email', 'phone', 'name', 'address', 'ip'];
  const safe = { ...properties };

  piiFields.forEach(field => {
    if (field in safe) {
      delete safe[field];
    }
  });

  return safe;
}
```

---

## REAL-TIME ALERTS & ANOMALY DETECTION

Metrics monitoring and anomaly detection for proactive issue identification.

| Alert Type | Description | Use Case | Channels |
|------------|-------------|----------|----------|
| **Threshold** | Static upper/lower bounds | Revenue, error rate | PagerDuty, Slack |
| **Anomaly** | Statistical deviation from baseline | DAU, conversion | Slack #metrics |
| **Trend** | Significant directional change | NPS, duration | Slack #growth |
| **Missing Data** | Expected events not received | Tracking gaps | PagerDuty |
| **SLA** | Service level violations | Latency, uptime | PagerDuty |

**Key Components:**
- Z-score anomaly detection with configurable sensitivity (low/medium/high)
- Moving average trend detection with window-based comparison
- Alert rule engine with cooldown management
- Multi-channel notifications (Slack, PagerDuty, Email, Webhook)

See `references/alerts-anomaly-detection.md` for implementation details.

---

## DATA QUALITY MONITORING

Ensure tracking data reliability and completeness.

| Dimension | Target | Alert | Monitor |
|-----------|--------|-------|---------|
| **Completeness** | 99% | < 95% | Expected vs actual events |
| **Timeliness** | < 5 min | > 15 min | Event to availability delay |
| **Validity** | 99.5% | < 98% | Schema validation rate |
| **Uniqueness** | 99.9% | < 99% | Duplicate detection |
| **Consistency** | 95% | < 90% | Cross-platform agreement |

**Key Components:**
- Zod-based schema validation for all event types
- Data freshness monitoring with staleness detection
- Event volume tracking with hourly/weekly pattern baselines
- BigQuery dashboard queries for quality metrics

See `references/data-quality.md` for implementation details.

---

## REVENUE ANALYTICS

Comprehensive revenue tracking and analysis for SaaS metrics.

| Metric | Definition | Formula |
|--------|------------|---------|
| **MRR** | Monthly Recurring Revenue | Sum of active subscriptions |
| **ARR** | Annual Recurring Revenue | MRR x 12 |
| **ARPU** | Average Revenue Per User | MRR / Active users |
| **LTV** | Customer Lifetime Value | ARPU x Avg lifespan |
| **CAC** | Customer Acquisition Cost | Spend / New customers |
| **LTV:CAC** | Return on acquisition | Target: > 3:1 |

**MRR Movement Types:** New, Expansion, Contraction, Churned, Reactivation

**Key Components:**
- MRR movement tracking (new, expansion, contraction, churn)
- Cohort-based and predictive LTV calculation
- Churn analysis by reason, plan, and tenure
- At-risk revenue identification

See `references/revenue-analytics.md` for implementation details.

---

## EXPERIMENT INTEGRATION

### Metric Definition for A/B Tests

When handing off to Experiment agent, provide:

```markdown
## Pulse → Experiment Handoff

**Primary Metric:** [Metric name]
**Definition:** [Exact calculation]
**Current Baseline:** [Current value with confidence interval]
**MDE (Minimum Detectable Effect):** [What % change matters?]
**Sample Size Required:** [Calculated based on baseline and MDE]

**Secondary Metrics:**
1. [Metric 2] - [Definition]
2. [Metric 3] - [Definition]

**Guardrail Metrics:**
1. [Metric that should NOT decrease] - [Threshold]

**Tracking Events:**
- Exposure event: [event_name]
- Conversion event: [event_name]
- Additional events: [list]

Suggested command: `/Experiment design test for [feature]`
```

---

