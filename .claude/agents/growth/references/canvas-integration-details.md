# growth — Canvas連携 詳細 (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## CANVAS INTEGRATION

### Conversion Funnel Diagram Request

```
/Canvas create conversion funnel diagram:
- Stages: [Awareness, Interest, Decision, Action]
- Drop-off rates at each stage
- Key metrics per stage
- Optimization opportunities
```

### User Flow Diagram Request

```
/Canvas create user flow diagram for [feature]:
- Entry points
- Decision points
- Conversion paths
- Exit points
- Friction points to optimize
```

### A/B Test Design Diagram Request

```
/Canvas create A/B test diagram:
- Control vs Variant
- Hypothesis
- Primary/secondary metrics
- Sample size requirements
- Test duration
```

### Canvas Output Examples

**Conversion Funnel (Mermaid):**
```mermaid
flowchart TD
    subgraph Awareness
        A[Landing Page Visit]
        A1[100% - 10,000 users]
    end

    subgraph Interest
        B[Scroll to Features]
        B1[60% - 6,000 users]
    end

    subgraph Decision
        C[View Pricing]
        C1[30% - 3,000 users]
    end

    subgraph Action
        D[Click Signup]
        D1[10% - 1,000 users]
        E[Complete Signup]
        E1[5% - 500 users]
    end

    A --> B
    B --> C
    C --> D
    D --> E

    style A fill:#e8f5e9
    style B fill:#fff3e0
    style C fill:#fff3e0
    style D fill:#ffebee
    style E fill:#ffebee
```

**A/B Test Design (Mermaid):**
```mermaid
flowchart LR
    subgraph Traffic
        A[Visitors]
    end

    subgraph Split
        B{Random 50/50}
    end

    subgraph Control
        C[Original CTA]
        C1["'Sign Up'"]
        C2[Conversion: 3.2%]
    end

    subgraph Variant
        D[New CTA]
        D1["'Start Free Trial'"]
        D2[Conversion: ?%]
    end

    subgraph Analysis
        E[Statistical Significance]
        F[Winner Declaration]
    end

    A --> B
    B --> C
    B --> D
    C --> E
    D --> E
    E --> F
```

**User Journey (Mermaid):**
```mermaid
journey
    title User Signup Journey
    section Discovery
      Google Search: 5: User
      Click Result: 4: User
      Land on Page: 5: User
    section Evaluation
      Read Hero: 4: User
      Scroll Features: 3: User
      Check Pricing: 3: User
    section Conversion
      Click CTA: 2: User
      Fill Form: 2: User
      Submit: 3: User
    section Activation
      Confirm Email: 4: User
      First Action: 5: User
```

---

