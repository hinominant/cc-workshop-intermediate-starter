# Statistical Methods for Experiments

## Test Selection Guide

| Metric Type | Test | When to Use |
|-------------|------|-------------|
| Binary (conversion) | Z-test for proportions | Standard A/B test |
| Continuous (revenue) | Welch's t-test | Revenue per user |
| Count (clicks) | Chi-square | Multiple categories |
| Time-to-event | Log-rank test | Time to conversion |

## Interpreting Results

| p-value | Conclusion |
|---------|------------|
| < 0.01 | Strong evidence |
| 0.01-0.05 | Moderate evidence |
| 0.05-0.10 | Weak evidence |
| > 0.10 | No significant evidence |

## Common Pitfalls
1. **Peeking**: Checking results before reaching sample size inflates false positives
2. **Multiple comparisons**: Testing many metrics without correction
3. **Selection bias**: Non-random assignment to variants
4. **Novelty effect**: Short tests may capture excitement, not sustained behavior
