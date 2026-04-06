# Chain Design Patterns

Patterns for composing agent chains. The guiding principle: **use the fewest agents that produce correct output.**

---

## Minimum Viable Chain Principle

Every chain starts with one agent. Add agents only when there is evidence that one agent cannot produce the required output alone.

**Test:** For each agent in a proposed chain, ask: "If I remove this agent, does the output quality drop below acceptance criteria?" If no, remove it.

Examples:
- Typo fix in docs: Builder alone (no Radar needed, no runtime change)
- New API endpoint with tests: Builder -> Radar (two distinct competencies)
- Security-sensitive auth change: Sentinel -> Builder -> Radar (three distinct competencies)
- Full-stack feature: Sherpa -> Rally[Artisan, Builder] -> Radar -> Judge (four steps, justified by scope)

---

## Pattern 1: Linear Chain

```
Agent A → Agent B → Agent C → Agent D
```

Each agent completes fully before the next begins. Output of step N becomes input to step N+1.

**When to use:** Tasks with strict sequential dependencies where each step's output is required by the next.

**Common linear chains:**

| Chain | Use Case |
|-------|----------|
| Scout -> Builder -> Radar | Bug fix (investigate, fix, verify) |
| Forge -> Builder -> Radar | Feature (prototype, implement, test) |
| Sentinel -> Builder -> Radar | Security fix (audit, fix, verify) |
| Zen -> Radar | Refactor (restructure, verify no regression) |
| Architect -> Scribe -> Builder | New module (design, spec, implement) |

**Context passing:** Each agent receives the full NEXUS_ROUTING context plus the previous agent's NEXUS_HANDOFF output.

---

## Pattern 2: Parallel (Fan-out / Fan-in)

```
         ┌→ Agent B-1 ─┐
Agent A ─┤              ├→ Agent C
         └→ Agent B-2 ─┘
```

Rally spawns multiple agents working simultaneously on independent streams. Results are merged at the synchronization point.

**When to use:** Two or more work streams with no shared file writes and no data dependencies between them.

**Common parallel patterns:**

| Pattern | Agents | Split Criteria |
|---------|--------|----------------|
| Frontend + Backend | Artisan + Builder | File ownership: src/components vs src/api |
| Feature A + Feature B | Builder-1 + Builder-2 | Independent modules, no shared state |
| Impl + Docs | Builder + Scribe | Different output types entirely |
| Multi-module refactor | Zen-1 + Zen-2 | Module boundaries as ownership lines |

**Requirements for parallelization:**
1. File ownership is declared before spawning (no overlap in write paths)
2. Each branch can be verified independently
3. Merge conflicts are structurally impossible (disjoint file sets)

**Synchronization:** Rally waits for ALL branches to complete before proceeding. Partial results are not merged.

---

## Pattern 3: Gated Chain

```
Agent A → Agent B → [Gate: Agent C] → Agent D → Agent E
                         │
                    FAIL: rollback
```

A gate agent evaluates the output of previous steps. The chain continues only if the gate passes. On failure, the chain rolls back or re-routes.

**When to use:** High-risk changes where proceeding without verification could cause damage.

**Common gates:**

| Gate Agent | Trigger | Pass Condition | Fail Action |
|------------|---------|----------------|-------------|
| Sentinel | Security-adjacent code | No critical/high vulnerabilities | Block, report to CEO |
| Judge | Complex logic change | Code quality score >= threshold | Return to Builder with feedback |
| Radar | Any implementation | All tests pass | Return to Builder with failures |
| Compliance | Regulatory-impacting change | All compliance checks pass | Block, escalate to Counsel |
| Privacy + Datashield | PII-handling code | Dual-check passes | Block, escalate to CEO |

**Gate behavior:**
- Gates are binary: PASS or FAIL
- PASS: chain continues to next agent
- FAIL: chain enters recovery (see Error Recovery below)
- Gates never modify code; they only evaluate

---

## Pattern 4: Iterative (Review Loop)

```
Agent A ↔ Agent B (max N iterations)
    │
    └→ converged → Agent C
```

Two agents iterate until convergence or a maximum iteration count is reached.

**When to use:** Quality improvement where the first attempt is unlikely to meet acceptance criteria.

**Common loops:**

| Loop | Agents | Max Iterations | Convergence Condition |
|------|--------|---------------|----------------------|
| Impl-Review | Builder <-> Judge | 3 | No critical/major findings |
| Impl-Test | Builder <-> Radar | 3 | All tests pass |
| Design-Review | Architect <-> CEO | 2 | CEO approves design |
| Spec-Validate | Scribe <-> Auditor | 2 | Spec passes compliance |

**Iteration rules:**
- Maximum 3 iterations (hard limit). If not converged after 3, escalate to Nexus for re-evaluation
- Each iteration must show measurable progress (fewer findings, more tests passing)
- If iteration N has the same findings as iteration N-1, the loop is stuck -- break and escalate
- Context from all iterations is preserved (Agent B sees full history of Agent A's attempts)

---

## Chain Selection by Task Type

| Task Type | Complexity | Recommended Pattern | Chain |
|-----------|-----------|---------------------|-------|
| BUG | SIMPLE | Linear | Scout -> Builder |
| BUG | COMPLEX | Linear + Gate | Scout -> Builder -> Radar -> Judge |
| FEATURE | SIMPLE | Linear | Builder -> Radar |
| FEATURE | COMPLEX | Parallel + Gate | Sherpa -> Rally[...] -> Radar -> Judge |
| SECURITY | Any | Gated | Sentinel -> Builder -> Radar (Sentinel gate) |
| REFACTOR | SIMPLE | Linear | Zen -> Radar |
| REFACTOR | COMPLEX | Iterative | Zen <-> Judge (max 3) -> Radar |
| DEPLOY | SIMPLE | Linear | Guardian -> Launch |
| DEPLOY | COMPLEX | Gated | Guardian -> Sentinel (gate) -> Launch |
| PARALLEL | Any | Parallel | Sherpa -> Rally[agents] -> Radar |
| BUSINESS | Any | Linear (CEO-first) | CEO -> Sherpa -> chain per type |
| ANALYTICS | Any | Linear | Analyst -> CEO |

---

## Context Preservation Between Steps

Each handoff carries a structured context snapshot:

```yaml
nexus_handoff:
  step: 2/5
  agent: Builder
  status: SUCCESS
  summary: "Implemented auth middleware in src/middleware/auth.ts"
  artifacts:
    created: [src/middleware/auth.ts]
    modified: [src/app.ts, src/routes/index.ts]
    deleted: []
  key_decisions:
    - "Used JWT over session tokens per Forge prototype"
  risks:
    - "Token refresh not yet implemented"
  test_status: "N/A (Radar is step 3)"
  next_agent: Radar
  context_for_next:
    - "Test auth middleware: valid token, expired token, missing token, malformed token"
    - "Integration test: protected route returns 401 without token"
```

**Rules:**
- Pass only what the next agent needs (information minimization)
- Always include: artifacts list, key decisions, risks
- Never pass: full file contents (agent reads from disk), unrelated context

---

## Error Recovery in Chains

When step N fails, Nexus classifies severity and acts:

| Severity | Condition | Recovery Action |
|----------|-----------|-----------------|
| L1 (Minor) | Lint warnings, style issues | Log, continue chain |
| L2 (Moderate) | < 20% test failures | Auto-fix: return to Builder with specific failures |
| L3 (Major) | > 50% test failures | Rollback to pre-step-N state, re-decompose with Sherpa |
| L4 (Critical) | Security vulnerability, data loss risk | Abort entire chain, rollback all changes, alert CEO |

**Recovery flow:**

```
Step N fails
    │
    ├─ L1 → Log → Continue to step N+1
    │
    ├─ L2 → Builder retry (max 2 attempts)
    │         ├─ Success → Continue
    │         └─ Fail again → Escalate to L3
    │
    ├─ L3 → git stash → Sherpa re-decompose → New chain
    │
    └─ L4 → git reset → CEO alert → Full stop
```

**Critical rule:** Never retry more than twice at the same step. If two retries fail, the problem is likely in the decomposition, not the execution.
