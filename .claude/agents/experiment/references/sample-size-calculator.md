# Sample Size Calculator

## Power Analysis Formula

```
n = (Z_α/2 + Z_β)² × (p₁(1-p₁) + p₂(1-p₂)) / (p₁ - p₂)²
```

Where:
- Z_α/2 = Z-score for significance level (1.96 for 95%)
- Z_β = Z-score for power (0.84 for 80%)
- p₁ = baseline conversion rate
- p₂ = expected conversion rate (baseline + MDE)

## Quick Reference Table

| Baseline | MDE | Power 80% | Power 90% |
|----------|-----|-----------|-----------|
| 5% | 10% rel | 31,234 | 41,792 |
| 5% | 20% rel | 7,854 | 10,508 |
| 10% | 10% rel | 14,313 | 19,147 |
| 10% | 20% rel | 3,622 | 4,846 |
| 20% | 10% rel | 6,344 | 8,486 |
| 20% | 20% rel | 1,621 | 2,169 |

## Duration Estimation

```
Duration (days) = Sample Size per Variant × Number of Variants / Daily Traffic
```

Minimum recommended: 7 days (to capture weekly patterns)
Maximum recommended: 30 days (to avoid novelty effects)
