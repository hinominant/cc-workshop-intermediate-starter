# Quality Profiles

Domain-specific UQS weight configurations for different project types.

---

## Overview

Not all projects weight quality dimensions equally. An API-heavy backend cares more about correctness than UX; a UI-heavy app prioritizes visual quality over documentation. Quality Profiles adjust UQS weights to match the project's primary concerns.

**Usage:** Select a profile at session start (or let Hone auto-detect from file types).

---

## Profile Catalog

### API-Heavy

**When:** Backend services, REST/GraphQL APIs, microservices.
**Key concern:** Correctness, error handling, test coverage.

```yaml
profile: api_heavy
weights:
  judge:         0.30   # Code correctness is critical
  consistency:   0.15   # API patterns must be uniform
  test_quality:  0.15   # Reliable tests for regression prevention
  zen:           0.15   # Maintainable service code
  radar:         0.20   # High coverage for API contracts
  warden:        0.00   # No UI to evaluate
  quill:         0.05   # API documentation baseline
```

**Focus agents:** Judge, Radar, Zen (consistency audit)
**Skip agents:** Warden, Palette

### UI-Heavy

**When:** Frontend applications, component libraries, design systems.
**Key concern:** Visual quality, UX consistency, component structure.

```yaml
profile: ui_heavy
weights:
  judge:         0.15   # Component logic correctness
  consistency:   0.10   # Component pattern consistency
  test_quality:  0.05   # Visual regression tests matter more
  zen:           0.10   # Component structure clarity
  radar:         0.15   # Component test coverage
  warden:        0.30   # V.A.I.R.E. quality is primary
  quill:         0.15   # Component documentation (Storybook, etc.)
```

**Focus agents:** Warden, Palette, Showcase
**Skip agents:** (none fully skipped)

### Data-Pipeline

**When:** ETL/ELT pipelines, data processing, batch jobs.
**Key concern:** Data correctness, test reliability, error recovery.

```yaml
profile: data_pipeline
weights:
  judge:         0.30   # Data transformation correctness
  consistency:   0.10   # Pipeline pattern consistency
  test_quality:  0.20   # Test reliability is critical (flaky = missed data bugs)
  zen:           0.10   # Pipeline code readability
  radar:         0.25   # Edge case coverage for data anomalies
  warden:        0.00   # No UI
  quill:         0.05   # Pipeline documentation
```

**Focus agents:** Judge, Radar, Test Quality assessment
**Skip agents:** Warden, Palette

### Library/SDK

**When:** Published libraries, SDKs, shared packages, open-source projects.
**Key concern:** API consistency, documentation, backwards compatibility.

```yaml
profile: library_sdk
weights:
  judge:         0.15   # Correctness baseline
  consistency:   0.20   # Public API consistency is paramount
  test_quality:  0.10   # Test reliability for CI
  zen:           0.15   # Clean, idiomatic API design
  radar:         0.15   # Comprehensive coverage for public API
  warden:        0.00   # No UI (unless UI library)
  quill:         0.25   # Documentation is critical for adoption
```

**Focus agents:** Quill, Zen (consistency), Judge
**Skip agents:** Warden

### Full-Stack (Default)

**When:** Full-stack applications, general-purpose projects.
**Key concern:** Balanced quality across all dimensions.

```yaml
profile: full_stack
weights:
  judge:         0.25   # Code correctness
  consistency:   0.10   # Cross-file consistency
  test_quality:  0.10   # Test reliability
  zen:           0.15   # Code maintainability
  radar:         0.20   # Test coverage
  warden:        0.12   # UX quality (when UI exists)
  quill:         0.08   # Documentation baseline
```

**Focus agents:** All (balanced)
**Skip agents:** None

### Security-Critical

**When:** Auth services, payment systems, healthcare, fintech, compliance-heavy.
**Key concern:** Security, correctness, audit trail.

```yaml
profile: security_critical
weights:
  judge:         0.25   # Code correctness (esp. auth logic)
  consistency:   0.10   # Security pattern consistency
  test_quality:  0.10   # Reliable security tests
  zen:           0.05   # Readability (secondary)
  radar:         0.15   # Security test coverage
  warden:        0.00   # Unless auth UI
  quill:         0.05   # Security documentation
  sentinel:      0.20   # Static security analysis
  probe:         0.10   # Dynamic security testing
```

**Focus agents:** Sentinel, Judge, Probe, Radar
**Note:** This profile adds Sentinel and Probe to the standard UQS dimensions.

---

## Auto-Detection Logic

Hone can auto-detect the appropriate profile based on file analysis:

```python
def detect_profile(files, config):
    """Detect quality profile from project files."""

    indicators = {
        'ui_heavy': [
            '*.tsx', '*.jsx', '*.vue', '*.svelte',
            'components/', 'pages/', 'storybook',
        ],
        'api_heavy': [
            'routes/', 'controllers/', 'handlers/',
            'openapi.yaml', 'swagger.json',
            '**/api/**', 'graphql/',
        ],
        'data_pipeline': [
            'pipeline/', 'etl/', 'dags/',
            'airflow/', 'dbt/', 'spark/',
        ],
        'library_sdk': [
            'package.json:main', 'package.json:exports',
            'setup.py', 'Cargo.toml:lib',
            'index.d.ts',
        ],
        'security_critical': [
            'auth/', 'security/', 'crypto/',
            'payment/', 'compliance/',
        ],
    }

    scores = {}
    for profile, patterns in indicators.items():
        scores[profile] = count_matches(files, patterns)

    best = max(scores, key=scores.get)
    if scores[best] >= CONFIDENCE_THRESHOLD:
        return best
    return 'full_stack'  # Default fallback
```

---

## Profile Selection in INTERACTION_TRIGGERS

When profile auto-detection confidence is low, ask the user:

```yaml
questions:
  - question: "Which quality profile matches this project best?"
    header: "Profile"
    options:
      - label: "Full-Stack (Recommended)"
        description: "Balanced quality across all dimensions"
      - label: "API-Heavy"
        description: "Focus on correctness, API consistency, test coverage"
      - label: "UI-Heavy"
        description: "Focus on UX quality, visual consistency, component docs"
      - label: "Library/SDK"
        description: "Focus on API consistency, documentation, public API coverage"
    multiSelect: false
```

---

## Custom Profile

Projects can define a custom profile in `.agents/hone-config.yaml`:

```yaml
# .agents/hone-config.yaml
quality_profile:
  name: custom
  weights:
    judge:         0.25
    consistency:   0.15
    test_quality:  0.10
    zen:           0.15
    radar:         0.20
    warden:        0.10
    quill:         0.05
  # Sum must equal 1.00
```

**Validation:** Hone must verify `Σ weights = 1.00` at session start.

---

## Profile Comparison

| Dimension | Full-Stack | API-Heavy | UI-Heavy | Data-Pipeline | Library/SDK | Security |
|-----------|-----------|-----------|----------|---------------|-------------|----------|
| judge | 0.25 | 0.30 | 0.15 | 0.30 | 0.15 | 0.25 |
| consistency | 0.10 | 0.15 | 0.10 | 0.10 | 0.20 | 0.10 |
| test_quality | 0.10 | 0.15 | 0.05 | 0.20 | 0.10 | 0.10 |
| zen | 0.15 | 0.15 | 0.10 | 0.10 | 0.15 | 0.05 |
| radar | 0.20 | 0.20 | 0.15 | 0.25 | 0.15 | 0.15 |
| warden | 0.12 | 0.00 | 0.30 | 0.00 | 0.00 | 0.00 |
| quill | 0.08 | 0.05 | 0.15 | 0.05 | 0.25 | 0.05 |
| sentinel | — | — | — | — | — | 0.20 |
| probe | — | — | — | — | — | 0.10 |

---

## Migration from 5-Dimension UQS

When transitioning from legacy 5-dimension UQS (judge/zen/radar/warden/quill) to 7-dimension:

### Legacy Weights (5-dimension)

```yaml
legacy_standard:
  judge:  0.30
  zen:    0.20
  radar:  0.25
  warden: 0.15
  quill:  0.10
```

### New Weights (7-dimension)

```yaml
standard:
  judge:         0.25   # was 0.30 (-0.05)
  consistency:   0.10   # NEW
  test_quality:  0.10   # NEW
  zen:           0.15   # was 0.20 (-0.05)
  radar:         0.20   # was 0.25 (-0.05)
  warden:        0.12   # was 0.15 (-0.03)
  quill:         0.08   # was 0.10 (-0.02)
```

### Score Impact

Adding new dimensions will shift UQS scores. To compare across versions:
- Note which UQS version was used in session reports
- Legacy scores are not directly comparable to 7-dimension scores
- The `legacy_standard` profile can be used for backward-compatible scoring
