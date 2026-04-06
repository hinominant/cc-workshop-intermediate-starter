# Routing Decision Tree

Nexus uses this decision tree for every incoming task. Follow top-down; the first matching branch determines the route.

---

## Phase 0: Emergency Routing

These conditions override all other logic. Check first.

```
IF security_alert OR vulnerability_report
  → Sentinel (immediate)
  → THEN Builder → Radar
  → Priority: P0

IF production_incident OR service_down
  → Triage (immediate)
  → THEN Scout → Builder → Radar → Guardian
  → Priority: P0

IF data_breach OR PII_exposure
  → Sentinel + Privacy + Datashield (immediate, parallel)
  → CEO notification required
  → Priority: P0
```

---

## Phase 1: Task Type Classification

Classify the incoming task into exactly one type.

| Type | Signal Keywords / Patterns |
|------|---------------------------|
| BUG | "doesn't work", error logs, regression, stack trace, "broken" |
| FEATURE | "add", "new", "implement", user story, acceptance criteria |
| SECURITY | CVE, auth, permissions, encryption, secrets, OWASP |
| REFACTOR | "clean up", tech debt, "simplify", performance (no behavior change) |
| DEPLOY | release, deploy, rollback, migration, environment |
| PARALLEL | 2+ independent implementation streams, multi-module change |
| BUSINESS | pricing, plan, CRM, notification cost, user trust, product direction |
| ANALYTICS | KPI, metrics, funnel, data analysis, reporting |
| DESIGN | architecture, system design, new module structure |
| INVESTIGATION | "why does", root cause, "figure out", unknown behavior |

When classification is ambiguous, default to INVESTIGATION (Scout) to gather data before committing to a chain.

---

## Phase 2: CEO Gate Evaluation

**Route through CEO FIRST when ANY of these are true:**

```
CEO_REQUIRED when:
  - Revenue/cost impact (pricing, billing, plan changes, notification costs)
  - User trust/safety risk (data handling, account actions, legal exposure)
  - CS/ops load increase (new manual workflows, support burden)
  - Product direction decision (priority, roadmap, "what to build")
  - Scope is ambiguous AND business context is needed to clarify
  - External partner/vendor commitment involved

CEO_NOT_REQUIRED when:
  - Spec is confirmed, no business ambiguity
  - Pure technical implementation (bug fix, refactor, test improvement)
  - Documentation update
  - CI/CD configuration change
  - Internal tooling with no user-facing impact
```

**CEO Gate output:** CEO provides constraints/direction, Nexus continues with those constraints applied to chain design.

---

## Phase 3: Complexity Assessment

```
SIMPLE when ALL true:
  - Single file or tightly scoped change (< 3 files)
  - No cross-module dependencies
  - Clear acceptance criteria
  - Estimated < 30 minutes
  - No parallel streams needed

COMPLEX when ANY true:
  - 4+ files across multiple modules
  - Cross-cutting concerns (auth + UI + API)
  - Unclear scope requiring decomposition
  - Estimated > 30 minutes
  - Multiple agents needed in sequence or parallel
```

---

## Phase 4: Chain Selection

### Single-Agent Routes (SIMPLE tasks)

| Task Type | Agent | Condition |
|-----------|-------|-----------|
| BUG (trivial) | Builder | Root cause known, < 10 lines |
| BUG (unknown) | Scout | Root cause unknown |
| FEATURE (small) | Builder | Spec confirmed, single module |
| FEATURE (frontend) | Artisan | UI-only change, design spec exists |
| REFACTOR (small) | Zen | < 50 lines, behavior-preserving |
| DEPLOY | Guardian | Standard deployment pipeline |
| INVESTIGATION | Scout | Information gathering only |

### Multi-Agent Routes (COMPLEX tasks)

| Task Type | Primary Chain | Notes |
|-----------|---------------|-------|
| BUG | Scout -> Builder -> Radar | Add Sentinel if security-adjacent |
| FEATURE | Forge -> Builder -> Radar | Add Sherpa first if scope unclear |
| FEATURE (full-stack) | Sherpa -> Rally[Artisan, Builder] -> Radar | Parallel frontend + backend |
| SECURITY | Sentinel -> Builder -> Radar | Non-negotiable chain |
| REFACTOR | Zen -> Radar | Add Architect if structural |
| DEPLOY | Guardian -> Launch | Add Sentinel for production deploys |
| PARALLEL | Sherpa -> Rally -> Radar | Decompose then parallelize |
| BUSINESS | CEO -> Sherpa -> Forge/Builder -> Radar | CEO direction first |
| ANALYTICS | Analyst -> CEO -> Nexus | Data then decision then action |
| DESIGN | Architect -> Scribe -> CEO | Design doc then approval |

---

## Phase 5: Dynamic Adjustment Rules

### Add agents when:

| Condition | Add Agent | Reason |
|-----------|-----------|--------|
| 3+ test failures during execution | Sherpa | Re-decompose the failing area |
| Security-adjacent code touched | Sentinel | SAST review required |
| UI files modified | Artisan | Frontend expertise needed |
| 2+ independent implementation streams | Rally | Parallelize for efficiency |
| Business impact unclear mid-chain | CEO | Get direction before continuing |
| Data-driven decision needed | Analyst | Quantitative analysis first |
| Privacy-sensitive data involved | Privacy + Datashield | Dual-check required |
| Legal/compliance implications | Counsel + Advocate | Dual-check required |

### Skip agents when:

| Condition | Skip | Reason |
|-----------|------|--------|
| < 10 lines changed AND tests exist | Radar | Existing tests cover it |
| Pure documentation change | Radar, Sentinel | No runtime impact |
| Each parallel branch < 50 lines | Rally | Nexus internal parallel suffices |
| Spec confirmed, no ambiguity | CEO | No business judgment needed |
| Config/env change only | Builder | Direct edit, no logic |

---

## Handoff Template

Every agent handoff uses this format:

```markdown
## NEXUS_ROUTING
- Chain: [full chain with step numbers]
- Current step: [N/total]
- Target agent: [AgentName]
- Task: [specific task description]
- Acceptance criteria: [measurable completion condition]
- File scope: [files this agent may read/write]
- Upstream context: [relevant output from previous agents]
- Constraints: [CEO direction, time budget, dependencies]
- On completion: [next agent OR VERIFY OR DONE]
- On failure: [rollback action OR escalation path]
```

---

## Anti-Patterns in Routing

| Anti-Pattern | Description | Correct Approach |
|--------------|-------------|------------------|
| Chain inflation | Adding agents "just in case" | Start minimal, add only on evidence |
| CEO bypass | Skipping CEO for business-impacting changes | Always evaluate CEO gate criteria |
| Premature parallelization | Using Rally for 2 small tasks | Sequential is fine for < 50 lines each |
| Review loop avoidance | Skipping Judge to save time | Judge catches issues that cost more later |
| Single-agent overload | Giving Builder both impl + test | Split: Builder -> Radar |
| Scope creep acceptance | Adding "while we're at it" tasks | New task = new chain |
| Investigation skip | Jumping to Builder without Scout | Unknown root cause = wasted Builder effort |
| Context starvation | Passing minimal context to save tokens | Insufficient context = wrong output = more tokens |

---

## Priority Routing Summary

```
P0 (Immediate):  Security alert    → Sentinel
                  Production down   → Triage
                  Data breach       → Sentinel + Privacy + Datashield

P1 (Same-day):   User-facing bug   → Scout → Builder → Radar
                  Revenue impact    → CEO → fastest viable chain

P2 (This-week):  Feature work      → Standard chain per type
                  Tech debt         → Zen → Radar

P3 (Backlog):    Nice-to-have      → Queue for next sprint
                  Documentation     → Scribe
```
