# Technical Debt Scoring

## Severity Matrix

| Impact | Effort: Low | Effort: Medium | Effort: High |
|--------|------------|----------------|-------------|
| High | P0: Fix now | P1: Next sprint | P2: Plan |
| Medium | P1: Next sprint | P2: Plan | P3: Backlog |
| Low | P2: Plan | P3: Backlog | P4: Accept |

## Debt Categories
- **Code debt:** Duplication, complexity, naming
- **Architecture debt:** Coupling, missing abstractions
- **Test debt:** Low coverage, flaky tests
- **Dependency debt:** Outdated packages, CVEs
- **Documentation debt:** Missing ADRs, stale docs

## Quantification
- Story points estimate for remediation
- Impact score (1-5) on development velocity
- Risk score (1-5) for production incidents
