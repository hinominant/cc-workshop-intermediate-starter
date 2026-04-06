# Agent Assignment Guide

How Sherpa assigns the right agent to each decomposed step.

---

## Task Type to Primary Agent Mapping

| Task Type | Primary Agent | Model | Description |
|-----------|---------------|-------|-------------|
| Backend logic, API endpoint, service layer | Builder | sonnet | Production-grade implementation |
| Frontend component, UI implementation | Artisan | sonnet | Component-level UI work |
| UI/UX direction, design system decisions | Vision | sonnet | Design before implementation |
| Rapid prototyping, proof of concept | Forge | sonnet | Throwaway-quality, speed-first |
| Database schema, migration | Schema | sonnet | DDL, migration files |
| Database optimization, query tuning | Tuner | sonnet | Index, query plan analysis |
| Unit/integration test writing | Radar | sonnet | Test implementation |
| E2E test writing | Voyager | sonnet | Browser-level test flows |
| Security audit (SAST) | Sentinel | sonnet | Static analysis, vulnerability scan |
| Security audit (DAST) | Probe | sonnet | Dynamic/runtime security testing |
| Code review, quality assessment | Judge | sonnet | Review against standards |
| Refactoring, simplification | Zen | sonnet | Behavior-preserving restructure |
| Bug investigation, root cause analysis | Scout | sonnet | Diagnosis without fixing |
| Performance profiling, optimization | Bolt | sonnet | Runtime performance |
| Documentation, specification writing | Scribe | haiku | Prose, specs, READMEs |
| API documentation (JSDoc, OpenAPI) | Quill | haiku | Code-adjacent docs |
| CI/CD pipeline, DevOps configuration | Gear | sonnet | Workflow YAML, build config |
| Infrastructure as Code, Docker | Scaffold | sonnet | Terraform, Dockerfile, compose |
| Architecture analysis, system design | Architect | opus | High-level structural decisions |
| Architecture review, dependency analysis | Atlas | sonnet | Existing architecture assessment |
| CLI/TUI tool building | Anvil | sonnet | Terminal interface |
| Data pipeline, ETL | Stream | sonnet | Data flow implementation |
| Internationalization, localization | Polyglot | haiku | Translation, i18n setup |
| Accessibility, usability improvement | Palette | sonnet | a11y compliance |
| Animation, motion design | Flow | sonnet | CSS/JS animations |
| Impact analysis, blast radius | Ripple | haiku | Change impact assessment |
| Git archaeology, history investigation | Rewind | haiku | Blame, log, bisect |
| Cleanup, dead code removal | Sweep | haiku | Deletion-focused |
| Privacy review | Privacy | sonnet | PII, consent, data handling |
| Privacy cross-check | Datashield | sonnet | Secondary privacy review |
| Legal compliance review | Counsel | sonnet | Legal/regulatory assessment |
| Legal cross-check | Advocate | sonnet | Secondary legal review |
| Compliance (J-SOX, audit) | Compliance | sonnet | Regulatory compliance |
| Data analysis, KPI computation | Analyst | sonnet | Quantitative analysis |
| Release management, deployment | Launch | sonnet | Release orchestration |
| Git operations, PR preparation | Guardian | sonnet | Branch, commit, PR |

---

## Secondary Agent Selection

When the primary agent is insufficient, add a secondary agent as a separate step.

| Situation | Primary | Secondary | Reason |
|-----------|---------|-----------|--------|
| New API endpoint needs security review | Builder | Sentinel | Auth/authz code needs audit |
| Frontend component needs design spec | Artisan | Vision | Design direction unclear |
| Bug fix needs regression tests | Builder (fix) | Radar (tests) | Verify fix does not regress |
| Refactor needs performance check | Zen | Bolt | Ensure no perf regression |
| Schema change needs migration rollback plan | Schema | Scribe | Document rollback procedure |
| New module needs architecture approval | Builder | Architect | Structural decisions |

**Rule:** Secondary agents always go in a separate step. Never assign two agents to one step.

---

## Agent Capability Matrix

| Agent | Can Write Code | Can Write Tests | Can Review | Can Design | Can Investigate | Read-Only |
|-------|---------------|----------------|-----------|-----------|----------------|-----------|
| Builder | Yes | Limited | No | No | No | No |
| Artisan | Yes (frontend) | Limited | No | Limited | No | No |
| Forge | Yes (prototype) | No | No | Yes | No | No |
| Radar | Yes (tests only) | Yes | No | No | No | No |
| Judge | No | No | Yes | No | No | Yes |
| Sentinel | No | No | Yes (security) | No | Yes | Yes |
| Scout | No | No | No | No | Yes | Yes |
| Zen | Yes (refactor) | No | No | No | No | No |
| Architect | No | No | Yes | Yes | No | Yes |
| Sherpa | No | No | No | No | No | Yes |
| Scribe | No | No | No | No | No | Yes |
| Analyst | No | No | No | No | Yes | Yes |

**Key constraints:**
- Read-only agents (Sherpa, Judge, Scout, Sentinel, Analyst) never modify files
- Builder does not write comprehensive tests -- use Radar for that
- Forge produces throwaway code -- never use Forge output in production without Builder rewrite
- Architect designs but does not implement -- always follow with Builder/Artisan

---

## Multi-Agent Task Patterns

When one logical task requires multiple agents sequentially:

### Pattern 1: Investigate-then-Fix

```
Step N:   Scout investigates root cause
Step N+1: Builder implements fix based on Scout's findings
Step N+2: Radar writes regression test
```

### Pattern 2: Design-then-Implement

```
Step N:   Architect designs module structure
Step N+1: Scribe writes specification
Step N+2: Builder implements (or Rally parallelizes multiple builders)
```

### Pattern 3: Spec-Test-Implement (SPEC_FIRST)

```
Step N:   Scribe writes acceptance criteria
Step N+1: Radar writes failing tests
Step N+2: Builder writes code until tests pass
```

### Pattern 4: Implement-then-Audit

```
Step N:   Builder implements feature
Step N+1: Sentinel audits security
Step N+2: Judge reviews code quality
Step N+3: Builder addresses findings (if any)
```

### Pattern 5: Dual Review (Compliance)

```
Step N:   Privacy reviews data handling
Step N+1: Datashield cross-checks Privacy's findings
Step N+2: Builder addresses all findings
```

---

## Escalation Path for Unassignable Tasks

When no agent fits a step:

```
1. Can the step be split into assignable sub-steps?
   ├─ YES → Split and reassign
   └─ NO → Continue to 2

2. Does the task require a competency not in the agent roster?
   ├─ YES → Flag to Nexus with ON_AGENT_UNAVAILABLE
   │         Nexus decides: use closest agent with constraints, or escalate to CEO
   └─ NO → Continue to 3

3. Is the task actually a business decision, not a technical task?
   ├─ YES → Route to CEO (this is not an agent task)
   └─ NO → Continue to 4

4. Is the task blocked by external dependency (API not available, spec missing)?
   ├─ YES → Mark as BLOCKED with blocker description
   │         Nexus handles the blocker
   └─ NO → Escalate to Nexus as undecomposable
```

---

## Cross-Reference with PROJECT_AFFINITY

When assigning agents, verify the agent has affinity for the project type:

| Affinity | Meaning | Assignment Rule |
|----------|---------|-----------------|
| H (High) | Agent is well-suited for this project type | Preferred assignment |
| M (Medium) | Agent can handle it with some overhead | Acceptable assignment |
| L (Low) | Agent is poorly suited | Avoid; find alternative |
| N/A | Agent has no relevance to this project type | Never assign |

**Check process:**
1. Read `.agents/PROJECT.md` for project type (SaaS, E-commerce, Dashboard, CLI, Library, API)
2. Check agent's PROJECT_AFFINITY in their SKILL.md frontmatter
3. If affinity is L or N/A, find alternative agent with H or M affinity

**Example:** For a CLI project, prefer Anvil (CLI specialist, H affinity) over Artisan (frontend specialist, L affinity for CLI).
