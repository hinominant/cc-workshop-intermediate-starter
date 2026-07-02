# experiment — A/Bテスト リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## HYPOTHESIS DOCUMENT TEMPLATE

```markdown
## Experiment: [Experiment Name]

### Hypothesis
**If** [we make this change]
**Then** [this metric will improve]
**Because** [this is the underlying mechanism]

### Background
- **Problem Statement:** [What problem are we solving?]
- **Current State:** [Current metric value and user behavior]
- **Evidence:** [What data/research supports this hypothesis?]

### Variants
| Variant | Description | Traffic Allocation |
|---------|-------------|--------------------|
| Control | Current experience | 50% |
| Treatment | [Describe change] | 50% |

### Metrics
**Primary Metric (決定指標):**
- Metric: [Name]
- Definition: [Exact calculation]
- Current Baseline: [X%]
- MDE (Minimum Detectable Effect): [Y%]
- Expected Lift: [Z%]

**Secondary Metrics (参考指標):**
1. [Metric name] - [Definition]
2. [Metric name] - [Definition]

**Guardrail Metrics (ガードレール指標):**
1. [Metric name] - [Threshold that should not be crossed]
2. [Metric name] - [Threshold]

### Sample Size & Duration
- Required Sample Size: [N per variant]
- Current Daily Traffic: [N users]
- Expected Duration: [X days/weeks]
- Statistical Power: 80%
- Significance Level: 5%

### Success Criteria
- [ ] Primary metric shows statistically significant improvement
- [ ] No guardrail metrics violated
- [ ] Lift >= MDE

### Rollout Plan
- **If wins:** Roll out to 100% on [date]
- **If loses:** Revert and [next action]
- **If inconclusive:** [Extend / iterate / abandon]
```

---

## SAMPLE SIZE CALCULATION

### Formula for Binary Metrics

```typescript
interface SampleSizeParams {
  baselineConversion: number;  // Current conversion rate (e.g., 0.05 for 5%)
  mde: number;                 // Minimum detectable effect (e.g., 0.1 for 10% relative lift)
  power: number;               // Statistical power (typically 0.8)
  significance: number;        // Significance level (typically 0.05)
}

function calculateSampleSize(params: SampleSizeParams): number {
  const { baselineConversion, mde, power, significance } = params;

  // Z-scores
  const zAlpha = 1.96;  // for 5% two-tailed
  const zBeta = 0.84;   // for 80% power

  const p1 = baselineConversion;
  const p2 = baselineConversion * (1 + mde);
  const pPooled = (p1 + p2) / 2;

  const numerator = Math.pow(
    zAlpha * Math.sqrt(2 * pPooled * (1 - pPooled)) +
    zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)),
    2
  );
  const denominator = Math.pow(p2 - p1, 2);

  return Math.ceil(numerator / denominator);
}

// Example: 5% baseline, 10% relative lift
const sampleSize = calculateSampleSize({
  baselineConversion: 0.05,
  mde: 0.10,
  power: 0.80,
  significance: 0.05
});
// Result: ~31,000 per variant
```

### Quick Reference Table

| Baseline | 5% Lift | 10% Lift | 20% Lift |
|----------|---------|----------|----------|
| 1% | 1.6M | 400K | 100K |
| 5% | 310K | 78K | 20K |
| 10% | 150K | 38K | 9.5K |
| 20% | 68K | 17K | 4.3K |
| 50% | 16K | 4K | 1K |

*Sample size per variant, 80% power, 5% significance, two-tailed*

### Duration Calculation

```typescript
function calculateDuration(
  sampleSizePerVariant: number,
  dailyTraffic: number,
  variants: number = 2
): number {
  const totalSampleNeeded = sampleSizePerVariant * variants;
  return Math.ceil(totalSampleNeeded / dailyTraffic);
}

// Example: 31K per variant, 10K daily traffic
const duration = calculateDuration(31000, 10000, 2);
// Result: 7 days minimum
```

---

## FEATURE FLAG IMPLEMENTATION

### Basic Feature Flag Setup

```typescript
// lib/featureFlags.ts
interface FeatureFlag {
  name: string;
  variants: string[];
  allocation: number[];  // Percentage for each variant
  enabled: boolean;
}

const flags: Record<string, FeatureFlag> = {
  'new_checkout_flow': {
    name: 'new_checkout_flow',
    variants: ['control', 'treatment'],
    allocation: [50, 50],
    enabled: true
  }
};

export function getVariant(
  flagName: string,
  userId: string
): string {
  const flag = flags[flagName];
  if (!flag || !flag.enabled) {
    return 'control';
  }

  // Deterministic assignment based on user ID
  const hash = hashUserId(userId, flagName);
  const bucket = hash % 100;

  let cumulative = 0;
  for (let i = 0; i < flag.variants.length; i++) {
    cumulative += flag.allocation[i];
    if (bucket < cumulative) {
      return flag.variants[i];
    }
  }

  return 'control';
}

function hashUserId(userId: string, salt: string): number {
  const str = `${userId}:${salt}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}
```

### React Integration

```tsx
// components/ExperimentProvider.tsx
import { createContext, useContext, ReactNode } from 'react';
import { getVariant } from '@/lib/featureFlags';
import { useUser } from '@/hooks/useUser';
import { trackEvent } from '@/lib/analytics';

interface ExperimentContextValue {
  getExperimentVariant: (experimentName: string) => string;
  trackExposure: (experimentName: string) => void;
}

const ExperimentContext = createContext<ExperimentContextValue | null>(null);

export function ExperimentProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();

  const getExperimentVariant = (experimentName: string): string => {
    return getVariant(experimentName, user?.id || 'anonymous');
  };

  const trackExposure = (experimentName: string): void => {
    const variant = getExperimentVariant(experimentName);
    trackEvent('experiment_exposure', {
      experiment_name: experimentName,
      variant: variant,
      user_id: user?.id
    });
  };

  return (
    <ExperimentContext.Provider value={{ getExperimentVariant, trackExposure }}>
      {children}
    </ExperimentContext.Provider>
  );
}

export function useExperiment(experimentName: string) {
  const context = useContext(ExperimentContext);
  if (!context) {
    throw new Error('useExperiment must be used within ExperimentProvider');
  }

  const variant = context.getExperimentVariant(experimentName);

  // Track exposure on first render
  useEffect(() => {
    context.trackExposure(experimentName);
  }, [experimentName]);

  return {
    variant,
    isControl: variant === 'control',
    isTreatment: variant === 'treatment'
  };
}
```

### Usage Example

```tsx
function CheckoutPage() {
  const { variant, isTreatment } = useExperiment('new_checkout_flow');

  return (
    <div>
      {isTreatment ? (
        <NewCheckoutFlow />
      ) : (
        <CurrentCheckoutFlow />
      )}
    </div>
  );
}
```

---

## STATISTICAL ANALYSIS

### Z-Test for Proportions (Binary Metrics)

```typescript
interface ExperimentResult {
  control: { conversions: number; total: number };
  treatment: { conversions: number; total: number };
}

interface AnalysisResult {
  controlRate: number;
  treatmentRate: number;
  relativeLift: number;
  absoluteLift: number;
  zScore: number;
  pValue: number;
  isSignificant: boolean;
  confidenceInterval: [number, number];
}

function analyzeExperiment(
  result: ExperimentResult,
  significance: number = 0.05
): AnalysisResult {
  const { control, treatment } = result;

  // Conversion rates
  const p1 = control.conversions / control.total;
  const p2 = treatment.conversions / treatment.total;

  // Pooled proportion
  const pPooled = (control.conversions + treatment.conversions) /
                  (control.total + treatment.total);

  // Standard error
  const se = Math.sqrt(
    pPooled * (1 - pPooled) * (1/control.total + 1/treatment.total)
  );

  // Z-score
  const zScore = (p2 - p1) / se;

  // P-value (two-tailed)
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));

  // 95% Confidence interval for the difference
  const zAlpha = 1.96;
  const seDiff = Math.sqrt(
    p1 * (1 - p1) / control.total +
    p2 * (1 - p2) / treatment.total
  );
  const ci: [number, number] = [
    (p2 - p1) - zAlpha * seDiff,
    (p2 - p1) + zAlpha * seDiff
  ];

  return {
    controlRate: p1,
    treatmentRate: p2,
    relativeLift: (p2 - p1) / p1,
    absoluteLift: p2 - p1,
    zScore,
    pValue,
    isSignificant: pValue < significance,
    confidenceInterval: ci
  };
}

// Normal CDF approximation
function normalCDF(x: number): number {
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
}
```

### Example Analysis

```typescript
const result = analyzeExperiment({
  control: { conversions: 500, total: 10000 },      // 5.0%
  treatment: { conversions: 550, total: 10000 }     // 5.5%
});

console.log(`
Control Rate: ${(result.controlRate * 100).toFixed(2)}%
Treatment Rate: ${(result.treatmentRate * 100).toFixed(2)}%
Relative Lift: ${(result.relativeLift * 100).toFixed(1)}%
P-Value: ${result.pValue.toFixed(4)}
Significant: ${result.isSignificant ? 'Yes' : 'No'}
95% CI: [${(result.confidenceInterval[0] * 100).toFixed(2)}%, ${(result.confidenceInterval[1] * 100).toFixed(2)}%]
`);
```

---

## EXPERIMENT REPORT TEMPLATE

```markdown
## Experiment Report: [Experiment Name]

### Summary
| Metric | Control | Treatment | Lift | P-Value | Significant |
|--------|---------|-----------|------|---------|-------------|
| Primary: [Name] | X% | Y% | +Z% | 0.0XX | Yes/No |
| Secondary: [Name] | X | Y | +Z% | 0.0XX | Yes/No |
| Guardrail: [Name] | X | Y | -Z% | 0.0XX | No violation |

### Recommendation
**[SHIP / ITERATE / ABANDON]**

[1-2 sentences explaining the recommendation]

### Key Findings
1. [Finding 1 with data support]
2. [Finding 2 with data support]
3. [Finding 3 with data support]

### Detailed Results

#### Primary Metric: [Name]
- Control: [X%] (n=[N])
- Treatment: [Y%] (n=[N])
- Relative Lift: [+Z%]
- 95% CI: [[L%, U%]]
- P-Value: [0.0XX]
- Statistical Power Achieved: [X%]

#### Segment Analysis
| Segment | Control | Treatment | Lift | Significant |
|---------|---------|-----------|------|-------------|
| Mobile | X% | Y% | +Z% | Yes/No |
| Desktop | X% | Y% | +Z% | Yes/No |
| New Users | X% | Y% | +Z% | Yes/No |
| Returning Users | X% | Y% | +Z% | Yes/No |

### Timeline
- Started: [Date]
- Ended: [Date]
- Duration: [X days]
- Total Participants: [N]

### Learnings & Next Steps
1. [Learning 1] → [Next step]
2. [Learning 2] → [Next step]

### Appendix
- [Link to hypothesis document]
- [Link to raw data]
- [Link to dashboard]
```

---

## COMMON PITFALLS & SOLUTIONS

### Peeking Problem
**Problem:** Checking results repeatedly increases false positive rate.

**Solution:**
```typescript
// Use sequential testing with alpha spending
function shouldContinue(
  currentPValue: number,
  currentN: number,
  targetN: number,
  alphaSpent: number = 0
): { continue: boolean; decision: 'significant' | 'not_significant' | 'continue' } {
  const progress = currentN / targetN;
  const alphaAvailable = 0.05 * progress - alphaSpent;

  if (currentPValue < alphaAvailable) {
    return { continue: false, decision: 'significant' };
  }

  if (progress >= 1) {
    return { continue: false, decision: currentPValue < 0.05 ? 'significant' : 'not_significant' };
  }

  return { continue: true, decision: 'continue' };
}
```

### Multiple Comparisons
**Problem:** Testing many metrics inflates false positive rate.

**Solution:** Bonferroni correction or pre-register ONE primary metric.

```typescript
function adjustedSignificance(
  numComparisons: number,
  baseAlpha: number = 0.05
): number {
  return baseAlpha / numComparisons;
}

// 5 metrics → significance level = 0.01 per test
```

### Selection Bias
**Problem:** Non-random assignment leads to confounded results.

**Solution:** Use deterministic hashing for assignment.

```typescript
// Good: Deterministic based on user ID
const variant = getVariant('experiment', userId);

// Bad: Random each time
const variant = Math.random() > 0.5 ? 'treatment' : 'control';
```

---

## PULSE INTEGRATION

### Receiving Metrics from Pulse

When Pulse defines metrics for experimentation:

```markdown
## Received from Pulse

**Primary Metric:** checkout_completed_rate
**Definition:** users_who_completed_checkout / users_who_started_checkout
**Current Baseline:** 3.2% (95% CI: 3.0-3.4%)
**Tracking Events:**
- Exposure: experiment_exposure (experiment_name='new_checkout')
- Conversion: checkout_completed

**Experiment Design:**
- MDE: 10% relative lift (3.52% treatment rate)
- Sample Size: 78,000 per variant
- Duration: 8 days at 20,000 daily traffic
```

---

