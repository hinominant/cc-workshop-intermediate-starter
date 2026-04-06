# Context Management

How Nexus manages, preserves, and minimizes context across agent chains.

---

## Context Snapshot Format

Every agent in a chain receives a context snapshot. This is the canonical structure:

```yaml
context_snapshot:
  # Chain metadata
  chain_id: "NEXUS-20260406-001"
  step: 2/5
  chain: [Sherpa, Builder, Radar, Judge, Guardian]

  # Task definition
  task:
    type: FEATURE
    description: "Add user profile API endpoint"
    acceptance_criteria:
      - "GET /api/users/:id returns user profile"
      - "Returns 404 for non-existent user"
      - "Auth middleware applied"
    ceo_constraints: []  # Empty if CEO gate was not triggered

  # File scope
  files:
    read: [src/types/user.ts, src/config/db.ts]
    write: [src/api/users.ts, src/services/user-service.ts]
    created_by_previous: [src/api/users.ts]  # Files created earlier in chain

  # Upstream output (from previous step)
  upstream:
    agent: Sherpa
    summary: "Decomposed into 3 steps: schema, service, route"
    artifacts: [decomposition-plan.md]
    key_decisions:
      - "Service layer pattern over direct DB in route handler"

  # Constraints
  constraints:
    time_budget: "15 min"
    token_budget: "50k tokens remaining"
    guardrail_level: L2
```

---

## Information Minimization

Context is the most expensive resource in multi-agent chains. Every token passed to an agent that it does not need is waste.

**Rules:**

1. **Pass task, not history.** An agent needs to know what to do, not the full story of how we got here. Upstream summary (2-3 sentences) is sufficient.

2. **Pass file paths, not file contents.** Agents read files from disk. Never embed full file contents in the handoff.

3. **Pass decisions, not deliberation.** If a previous agent chose approach A over B, pass "Using approach A because X" -- not the full comparison.

4. **Pass failures concisely.** If the chain is retrying, pass "test_auth_middleware_expired_token FAILED: expected 401, got 200" -- not the full test output.

5. **Prune irrelevant upstream.** If step 1 produced output only relevant to step 2, do not carry it to step 3.

**Size targets by chain length:**

| Chain Length | Max Context per Handoff |
|-------------|------------------------|
| 2 agents | ~2,000 tokens |
| 3-4 agents | ~1,500 tokens |
| 5+ agents | ~1,000 tokens |

---

## Project Context Loading

At chain start, Nexus loads project-level context from standardized locations:

| File | Content | When to Load |
|------|---------|-------------|
| `.agents/PROJECT.md` | Project overview, tech stack, conventions, activity log | Always (every chain) |
| `.agents/LUNA_CONTEXT.md` | Business context, KPIs, stakeholders | When CEO gate is triggered or BUSINESS/ANALYTICS type |
| `.claude/settings.json` | Hooks, permissions, agent config | At Nexus initialization only |

**Loading rules:**
- Load `.agents/PROJECT.md` once at chain start, extract only the sections relevant to the current task
- Do NOT reload project context at every step -- it is injected in the initial context snapshot
- If `.agents/PROJECT.md` does not exist, create from `_templates/PROJECT.md` before proceeding

---

## Session State Tracking

Nexus maintains a lightweight state object throughout chain execution:

```yaml
session_state:
  chain_id: "NEXUS-20260406-001"
  started_at: "2026-04-06T10:00:00Z"
  current_step: 3
  total_steps: 5
  
  step_results:
    1:
      agent: Sherpa
      status: SUCCESS
      duration: "2 min"
      artifacts: [plan.md]
    2:
      agent: Builder
      status: SUCCESS
      duration: "12 min"
      artifacts: [src/api/users.ts, src/services/user-service.ts]
    3:
      agent: Radar
      status: IN_PROGRESS
      
  rollback_point: "git:abc1234"  # Commit hash before chain started
  
  guardrail_events: []  # Any L1-L4 events triggered
  
  token_usage:
    total: 45000
    remaining_budget: 55000
```

**State is ephemeral.** It exists only for the duration of the chain. Persistent records go to `.agents/PROJECT.md` Activity Log after chain completion.

---

## Handoff Artifact Format

The structured contract between chain steps. Every agent outputs this on completion:

```markdown
## NEXUS_HANDOFF
- Step: [current/total]
- Agent: [AgentName]
- Summary: [1-3 sentences of what was done]
- Key findings: [Decisions made, issues discovered]
- Artifacts: [Files created/modified/deleted]
- Risks: [Known risks, incomplete items]
- Suggested next agent: [AgentName] | VERIFY | DONE
- Next action: CONTINUE | VERIFY | DONE
```

**Input contract (what the agent receives):**

```markdown
## NEXUS_ROUTING
- Chain: [full chain]
- Current step: [N/total]
- Target agent: [AgentName]
- Task: [specific task]
- Acceptance criteria: [measurable conditions]
- File scope: [read/write paths]
- Upstream context: [previous agent's summary + artifacts]
- Constraints: [budget, CEO direction, dependencies]
- On completion: [next step]
- On failure: [recovery action]
```

**Contract rules:**
- NEXUS_ROUTING is written by Nexus (input to agent)
- NEXUS_HANDOFF is written by the agent (output to Nexus)
- Both are required. Missing either is a chain protocol violation.
- Nexus transforms HANDOFF from step N into ROUTING for step N+1

---

## Token Budget Awareness

Multi-agent chains consume tokens multiplicatively. Nexus tracks and manages this.

**Budget allocation by chain length:**

| Chain Length | Budget per Agent | Total Budget |
|-------------|-----------------|-------------|
| 1 agent | 100k tokens | 100k |
| 2 agents | 60k each | 120k |
| 3 agents | 45k each | 135k |
| 4 agents | 35k each | 140k |
| 5+ agents | 30k each | 150k cap |

**Budget enforcement:**
- At each step, Nexus checks remaining budget before proceeding
- If remaining budget < 30k tokens, compress context (strip examples, collapse history)
- If remaining budget < 15k tokens, skip optional agents (Judge, Scribe) and go to VERIFY
- Never start a step that cannot reasonably complete within the remaining budget

**Context compression techniques (ordered by aggression):**
1. Remove upstream deliberation, keep only decisions
2. Collapse step_results to one-line summaries
3. Remove file contents from artifacts, keep paths only
4. Reduce acceptance criteria to keywords
5. Emergency: pass only task description + file scope + "fix the failing test"
