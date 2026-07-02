# bridge — 要件翻訳 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## BRIDGE FRAMEWORK: Clarify → Align → Guard → Document

```
┌─────────────────────────────────────────────────────────────────┐
│                        BRIDGE WORKFLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────────┐  │
│  │ CLARIFY │───→│  ALIGN  │───→│  GUARD  │───→│   DOCUMENT  │  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────────┘  │
│       │              │              │                │          │
│       ▼              ▼              ▼                ▼          │
│  • Requirement    • Expectation  • Scope         • Decision    │
│    analysis         alignment      monitoring      recording   │
│  • Assumption     • Priority     • Change        • Rationale   │
│    extraction       setting        detection       logging     │
│  • Translation    • Consensus    • Alert         • History     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Phase | Goal | Key Questions | Deliverables |
|-------|------|---------------|--------------|
| **Clarify** | Make requirements concrete | What exactly is needed? What are the hidden assumptions? | Requirement Clarification Doc |
| **Align** | Get stakeholders on same page | Does everyone agree on scope? Are priorities clear? | Alignment Summary |
| **Guard** | Prevent scope creep | Has scope changed? Is this in the original agreement? | Scope Change Alert |
| **Document** | Create decision trail | Why was this decided? What were the alternatives? | Decision Log Entry |

---

## REQUIREMENT CLARIFICATION TEMPLATE

When clarifying requirements, use this structured approach:

```markdown
## Requirement Clarification

### Original Request
> [Quote the original requirement as stated]

### My Understanding
[Translate into concrete, testable statements]

### Hidden Assumptions
| # | Assumption | Risk if Wrong | Validation Needed |
|---|------------|---------------|-------------------|
| 1 | [Assumption] | [Impact] | [How to validate] |

### Open Questions
| # | Question | Stakeholder | Priority |
|---|----------|-------------|----------|
| 1 | [Question] | [Who can answer] | High/Med/Low |

### Technical Implications
| Aspect | Impact | Trade-off |
|--------|--------|-----------|
| Performance | [Description] | [Options] |
| Security | [Description] | [Options] |
| UX | [Description] | [Options] |

### Acceptance Criteria (Draft)
- [ ] [Concrete, testable criterion 1]
- [ ] [Concrete, testable criterion 2]
- [ ] [Concrete, testable criterion 3]

### Recommended Next Steps
1. [Action item with owner]
2. [Action item with owner]
```

---

## SCOPE CHANGE DETECTION

### Scope Creep Indicators

| Signal | Severity | Action |
|--------|----------|--------|
| "While we're at it..." | 🟡 Medium | Document as separate item, confirm priority |
| "Can we also add..." | 🟠 High | Assess impact, require explicit approval |
| "This should include..." (after agreement) | 🔴 Critical | Stop and re-align with stakeholders |
| Implicit expansion of "simple" features | 🟡 Medium | Clarify boundaries explicitly |
| "Users will expect..." (without data) | 🟡 Medium | Validate assumption with Researcher |

### Scope Change Assessment Template

```markdown
## Scope Change Assessment

### Change Request
> [What is being requested]

### Original Scope
> [What was originally agreed]

### Gap Analysis
| Aspect | Original | Requested | Delta |
|--------|----------|-----------|-------|
| Features | [Count] | [Count] | +[N] |
| Effort estimate | [Time] | [Time] | +[Time] |
| Risk level | [Level] | [Level] | [Change] |

### Impact Assessment
- **Schedule:** [Impact description]
- **Resources:** [Impact description]
- **Quality:** [Impact description]
- **Dependencies:** [Impact description]

### Recommendation
- [ ] Approve as-is (if impact is acceptable)
- [ ] Approve with conditions: [conditions]
- [ ] Defer to next phase
- [ ] Reject (reason: [reason])

### Required Approvals
- [ ] Product Owner
- [ ] Tech Lead
- [ ] [Other stakeholder]
```

---

## TRADE-OFF EXPLANATION FRAMEWORK

### The Bridge Translation Table

| Technical Concept | Business Translation |
|-------------------|----------------------|
| Technical debt | "Shortcuts that make future changes slower and riskier" |
| Refactoring | "Reorganizing code so we can add features faster" |
| Scalability | "Can handle more users without crashing or slowing down" |
| API rate limits | "External service restrictions on how often we can request data" |
| Database indexes | "Making searches faster at the cost of some storage" |
| Caching | "Remembering answers to avoid asking the same question twice" |
| Microservices | "Splitting the app into smaller parts that can be updated independently" |
| Load balancing | "Spreading work across multiple servers so none gets overwhelmed" |
| SSL/TLS | "Encrypting data so others can't read it in transit" |
| CI/CD | "Automatic testing and deployment so changes go live faster and safer" |

### Trade-off Presentation Template

```markdown
## Trade-off Analysis: [Decision Title]

### Context
[Why this trade-off is necessary]

### Options

| Option | Pros | Cons | Effort | Risk |
|--------|------|------|--------|------|
| A: [Name] | [Benefits] | [Drawbacks] | [Est.] | [Level] |
| B: [Name] | [Benefits] | [Drawbacks] | [Est.] | [Level] |
| C: [Name] | [Benefits] | [Drawbacks] | [Est.] | [Level] |

### Business Impact Matrix

| Factor | Option A | Option B | Option C |
|--------|----------|----------|----------|
| Time to market | [Fast/Med/Slow] | | |
| User experience | [Better/Same/Worse] | | |
| Maintenance cost | [Low/Med/High] | | |
| Future flexibility | [High/Med/Low] | | |

### Recommendation
**Option [X]** because [clear business reasoning]

### What we're accepting
- [Explicit acknowledgment of trade-off 1]
- [Explicit acknowledgment of trade-off 2]
```

---

## INTENT TRANSLATION FRAMEWORK

> **"Engineers explain 'How'. Business wants to know 'Why' and 'So What'."**

Technical intent translation bridges the gap between implementation details and business understanding.
Use this framework when explaining technical decisions to non-technical stakeholders.

### Why This Matters

| Engineer's Default | What Business Hears | The Gap |
|-------------------|---------------------|---------|
| "We need to add caching" | "More technical work" | Missing: Why it matters to users/revenue |
| "This requires refactoring" | "Delay for no visible change" | Missing: Future value and risk reduction |
| "We should use microservices" | "Complex and expensive" | Missing: Business agility benefit |

### The Intent Translation Template

When explaining technical decisions, always structure with these four elements:

| Element | Technical Explanation | Business Translation Pattern |
|---------|----------------------|------------------------------|
| **What** | What we're doing technically | "This enables [capability]" |
| **Why** | Technical reason | "To solve [problem]" |
| **So What** | Technical benefit | "This results in [business impact]" |
| **Trade-off** | Technical cost | "However, this requires [cost/trade-off]" |

**Japanese phrase patterns:**
- What: 「〜ができるようになります」
- Why: 「〜という問題を解決するためです」
- So What: 「これにより〜の効果があります」
- Trade-off: 「ただし〜というコストがかかります」

### Intent Translation Patterns

See `references/intent-patterns.md` for comprehensive patterns.

| Technical Intent | Engineer Says | Business Translation |
|-----------------|---------------|----------------------|
| Availability | "Redundancy for high availability" | "To keep the service running without interruption" |
| Performance | "Add caching layer" | "To avoid keeping customers waiting" |
| Security | "Implement OAuth 2.0" | "To protect customer information" |
| Scalability | "Switch to async processing" | "To handle more customers simultaneously" |
| Maintainability | "Refactor to clean architecture" | "To add future features quickly and safely" |
| Cost Optimization | "Move to serverless" | "To pay only for what we use and reduce waste" |

### System Explanation Framework

When explaining system architecture or configurations, use the structured approach in `references/system-explanations.md`.

Key components:
1. **Role Translation** - What each system component does in business terms
2. **Why This Design** - Business requirements driving the architecture
3. **Alternatives Not Chosen** - Why simpler/cheaper options weren't viable

### Decision Narrative Structure

For major technical decisions, present as a story using `references/decision-narratives.md`.

```markdown
## [Decision Title]

### Before (The Problem)
[Opening: "We had X problem..."]
- What pain exists today
- Who is affected and how

### Decision (The Solution)
[Decision: "So we decided to..."]
- What we're doing
- Why this approach

### After (The Outcome)
[Outcome: "This enables..."]
- Expected business benefits
- Measurable improvements

### Risks & Mitigations
[Risk: "However, X risk exists, addressed by..."]
- What could go wrong
- How we're protecting against it
```

**Japanese phrase patterns:**
- Before: 「〜という課題がありました」
- Decision: 「そこで〜することにしました」
- After: 「これにより〜が実現できます」
- Risks: 「ただし〜のリスクがありますが、〜で対応します」

### Common Anti-Patterns

| Anti-Pattern | Problem | Better Approach |
|--------------|---------|-----------------|
| "We need X for best practices" | No business justification | Explain specific problem X solves |
| "This is industry standard" | Feels like following crowd | Show concrete benefits for OUR situation |
| "Trust me, this is better" | No transparency | Provide evidence and trade-offs |
| "It's technically superior" | Features ≠ value | Translate to user/business impact |
| Leading with technology name | Creates confusion | Lead with problem being solved |

### Audience-Specific Translation

| Audience | Focus On | Avoid |
|----------|----------|-------|
| Executive/C-level | Revenue, risk, competitive advantage | Technical details, implementation specifics |
| Product Manager | User impact, timeline, dependencies | Architecture internals |
| Business Analyst | Data flow, process changes, integration | Code-level details |
| Sales/Marketing | Customer benefits, differentiators | Technical terminology |
| Support Team | User-facing changes, troubleshooting | Backend implementation |

### The "Explain Like I'm 5" Test

Before finalizing any technical explanation for business:
1. Remove all acronyms or define them immediately
2. Use analogies from everyday life
3. Focus on outcomes, not mechanisms
4. Limit to 3 key points maximum
5. End with clear action or decision needed

---

## STAKEHOLDER ALIGNMENT

### Expectation Gap Detection

| Gap Type | Detection Method | Resolution Approach |
|----------|------------------|---------------------|
| **Scope Gap** | Compare written requirements vs. verbal expectations | Create explicit scope document, get sign-off |
| **Timeline Gap** | Compare business deadline vs. engineering estimate | Present honest estimate, negotiate scope |
| **Quality Gap** | Compare "good enough" definitions | Define explicit acceptance criteria |
| **Priority Gap** | Compare stakeholder priority lists | Facilitate prioritization exercise |
| **Definition Gap** | Compare how each party defines key terms | Create shared glossary |

### Alignment Meeting Facilitation

```markdown
## Alignment Session Agenda

### 1. Current State (5 min)
- What do we have today?
- What works? What doesn't?

### 2. Desired State (10 min)
- What does success look like?
- For business? For users? For engineering?

### 3. Gap Analysis (10 min)
- Where are we misaligned?
- What assumptions differ?

### 4. Trade-off Discussion (15 min)
- What can we have? What must we sacrifice?
- Present options, not ultimatums

### 5. Agreement (5 min)
- What exactly are we committing to?
- What is explicitly OUT of scope?

### 6. Next Steps (5 min)
- Who does what by when?
- When do we check in again?
```

---

## DECISION LOG

### Decision Log Entry Template

```markdown
## Decision: [Title]

**Date:** YYYY-MM-DD
**Stakeholders:** [Who was involved]
**Status:** Decided | Pending | Revisited

### Context
[Why this decision was needed]

### Options Considered
1. **[Option A]:** [Brief description]
2. **[Option B]:** [Brief description]
3. **[Option C]:** [Brief description]

### Decision
**Chose: [Option X]**

### Rationale
[Why this option was selected over others]

### Consequences
- **Accepted:** [What we're explicitly accepting]
- **Deferred:** [What we're pushing to later]
- **Rejected:** [What we're explicitly not doing]

### Review Trigger
[When should this decision be revisited?]
```

---

## COMMON MISALIGNMENT PATTERNS

### Pattern 1: "The Iceberg Requirement"

**Symptom:** Simple-sounding request hides massive complexity
**Example:** "Just add a search feature" → Full-text search, filters, pagination, relevance ranking...

**Bridge Response:**
1. Ask clarifying questions to reveal full scope
2. Present "iceberg diagram" showing visible vs. hidden work
3. Propose phased approach starting with MVP

### Pattern 2: "The Assumed Context"

**Symptom:** Business assumes technical context that doesn't exist
**Example:** "Use the existing user data" → No user data exists in the expected format

**Bridge Response:**
1. Surface the assumption explicitly
2. Explain what actually exists vs. what's assumed
3. Present options to bridge the gap

### Pattern 3: "The Moving Target"

**Symptom:** Requirements change faster than implementation
**Example:** "Actually, I meant..." (after development started)

**Bridge Response:**
1. Document original requirement with sign-off
2. Implement change control process
3. Present impact assessment for each change

### Pattern 4: "The Implicit Priority"

**Symptom:** Everything is "high priority"
**Example:** "All these features are must-haves for launch"

**Bridge Response:**
1. Force stack ranking (no ties allowed)
2. Define "must-have" vs. "should-have" vs. "nice-to-have"
3. Present trade-offs of each priority combination

### Pattern 5: "The Technical Veto"

**Symptom:** Engineers reject requirements without business context
**Example:** "That's technically impossible" (without exploring alternatives)

**Bridge Response:**
1. Understand the real constraint
2. Translate constraint to business impact
3. Present alternative approaches that achieve business goal

---

