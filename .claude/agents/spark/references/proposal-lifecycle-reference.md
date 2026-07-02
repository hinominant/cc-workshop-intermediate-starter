# spark — 提案ライフサイクル リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## PROPOSAL LIFECYCLE

Proposal Lifecycle（提案ライフサイクル）の全体図。

### Lifecycle Flowchart

```mermaid
flowchart TD
    subgraph IGNITE["1. IGNITE (Input Gathering)"]
        I1[Echo: Latent Needs]
        I2[Pulse: Metrics Data]
        I3[Compete: Gap Analysis]
        I4[Voice: User Feedback]
        I5[Researcher: Insights]
    end

    subgraph SYNTHESIZE["2. SYNTHESIZE (Proposal Creation)"]
        S1[Draft Proposal]
        S2[JTBD Analysis]
        S3[Prioritization RICE/IE]
    end

    subgraph VALIDATE["3. VALIDATE (Validation Loop)"]
        V1[Echo Persona Validation]
        V2[Sentinel Security Review]
        V3[Growth SEO/CRO Review]
        V4[Scout Technical Feasibility]
    end

    subgraph EXPERIMENT["4. EXPERIMENT (Optional)"]
        E1[Experiment A/B Design]
        E2[Test Execution]
        E3{Verdict}
    end

    subgraph IMPLEMENT["5. IMPLEMENT (Handoff)"]
        H1{Complex?}
        H2[Sherpa Breakdown]
        H3[Builder Direct]
        H4[Implementation]
    end

    I1 & I2 & I3 & I4 & I5 --> S1
    S1 --> S2 --> S3

    S3 --> V1
    S3 -.->|Security concern| V2
    S3 -.->|Growth impact| V3
    S3 -.->|Feasibility unclear| V4

    V1 -->|Approved| EXPERIMENT
    V1 -->|Issues| S1
    V2 -->|Requirements| S1
    V3 -->|Requirements| S1
    V4 -->|Feasible| S3
    V4 -->|Concerns| S1

    E1 --> E2 --> E3
    E3 -->|VALIDATED| H1
    E3 -->|INCONCLUSIVE| E1
    E3 -->|INVALIDATED| S1

    V1 -->|Skip test| H1
    H1 -->|Yes| H2
    H1 -->|No| H3
    H2 --> H4
    H3 --> H4
    H2 -.->|Feedback| S1
```

### Stage Exit Criteria

| Stage | Exit Criteria | Proceed To |
|-------|---------------|------------|
| **IGNITE** | Input data collected from ≥1 source | SYNTHESIZE |
| **SYNTHESIZE** | Proposal doc complete with RICE score | VALIDATE |
| **VALIDATE (Echo)** | Persona validation positive | EXPERIMENT or IMPLEMENT |
| **VALIDATE (Sentinel)** | Security requirements incorporated | Continue validation |
| **VALIDATE (Growth)** | SEO/CRO requirements incorporated | Continue validation |
| **VALIDATE (Scout)** | Technical feasibility confirmed | Continue validation |
| **EXPERIMENT** | Verdict: VALIDATED or Skip authorized | IMPLEMENT |
| **IMPLEMENT** | Sherpa breakdown or Builder handoff | Development |

### Parallel Execution Matrix

| Stage Pair | Parallelizable? | Notes |
|------------|-----------------|-------|
| Sentinel + Growth review | ✅ Yes | Independent validation |
| Sentinel + Echo validation | ✅ Yes | Different concerns |
| Scout + Proposal draft | ✅ Yes | Technical check while drafting |
| Experiment + Implementation | ❌ No | Sequential dependency |
| Sherpa + Builder | ❌ No | Sequential dependency |

### Feedback Loop Definitions

```
Loop 1: Validation Rejection
  Echo finds issues → Iterate proposal → Re-validate

Loop 2: Experiment Iteration
  Inconclusive → Adjust hypothesis → Retest
  Invalidated → Pivot or Kill → New proposal

Loop 3: Feasibility Feedback
  Sherpa concerns → Scope adjustment → Re-breakdown

Loop 4: Security/Growth Requirements
  Requirements added → Update proposal → Continue
```

---

## EXTENDED REFERENCES

### Core References

| Reference | Purpose | Link |
|-----------|---------|------|
| Prioritization Frameworks | RICE/Impact-Effort scoring | `references/prioritization-frameworks.md` |
| Persona & JTBD | User analysis templates | `references/persona-jtbd.md` |
| Collaboration Patterns | Agent handoff formats (A-I) | `references/collaboration-patterns.md` |
| Proposal Templates | Feature proposal formats | `references/proposal-templates.md` |

### Extended References (New)

| Reference | Purpose | Link |
|-----------|---------|------|
| Experiment Lifecycle | A/B test result handling | `references/experiment-lifecycle.md` |
| Compete Conversion | Gap-to-spec conversion | `references/compete-conversion.md` |
| Technical Integration | Builder/Sherpa patterns | `references/technical-integration.md` |

---

