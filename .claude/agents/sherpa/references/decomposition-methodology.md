# Decomposition Methodology

How Sherpa breaks complex tasks into atomic, verifiable, assignable steps.

---

## Atomic Task Definition

An atomic task meets ALL of these criteria:

| Criterion | Definition | Test |
|-----------|-----------|------|
| Independently verifiable | Completion can be confirmed without running any subsequent step | "Can I check this step passed without looking at step N+1?" |
| Single-agent assignable | Exactly one agent can own and complete the entire step | "Does this step require only one competency?" |
| Bounded scope | Changes fewer than 50 lines across fewer than 3 files | "Can an agent finish this in under 15 minutes?" |
| Clear completion condition | A binary pass/fail check exists | "Is the done-condition measurable, not subjective?" |
| Explicit file scope | Every file to be created, modified, or read is listed | "Does the agent know exactly which files to touch?" |

**If any criterion fails, the task is not atomic. Split further.**

---

## Dependency Mapping with DAG

Every decomposition produces a Directed Acyclic Graph (DAG). Steps are nodes. Dependencies are directed edges.

### Building the DAG

For each step, answer two questions:
1. **What must exist before this step can start?** (incoming edges)
2. **What does this step produce that others consume?** (outgoing edges)

### DAG Construction Process

```
1. List all steps without ordering
2. For each pair (A, B), ask: "Does B require A's output?"
   - Yes → draw edge A → B
   - No → no edge
3. Check for cycles (A → B → C → A)
   - If cycle found → restructure (see Cycle Breaking below)
4. Identify steps with no incoming edges → these can start immediately
5. Identify parallel groups → steps with no edges between them
```

### DAG Notation

```
Step 1: Create user type definition
Step 2: Create users table migration [depends: 1]
Step 3: Implement user service [depends: 1, 2]
Step 4: Implement user API routes [depends: 3]
Step 5: Write unit tests for user service [depends: 3]
Step 6: Write API integration tests [depends: 4]
Step 7: Write frontend user profile component [depends: 1]

Parallel groups:
  Group A: [4, 5, 7] (can run simultaneously after their deps complete)
```

### Cycle Breaking

When a cycle is detected (A needs B, B needs A):
1. Identify the shared dependency causing the cycle
2. Extract it into a new step that both A and B depend on
3. Example: A (API handler) needs B (validation), B needs A (error types)
   - Solution: Step 0 (define shared types/interfaces) -> A and B in parallel

---

## Task Granularity Guidelines

### Too Coarse (Split Required)

| Example | Problem | How to Split |
|---------|---------|-------------|
| "Implement authentication" | Multiple agents, unclear completion | Split into: type defs, DB migration, auth service, middleware, routes, tests |
| "Build the dashboard" | Full-stack, multi-component | Split by component: header, sidebar, data table, chart, each with its own step |
| "Fix all bugs in the backlog" | Unbounded scope | One step per bug, each independently verifiable |
| "Set up CI/CD pipeline" | Multiple systems (lint, test, build, deploy) | One step per pipeline stage |

### Right Size (Atomic)

| Example | Why It Works |
|---------|-------------|
| "Create users table migration" | Single file, verifiable (migration runs), one agent (Schema) |
| "Add JWT validation middleware" | Single module, verifiable (test with valid/invalid token), one agent (Builder) |
| "Write unit tests for UserService.create" | Single test file, verifiable (tests pass), one agent (Radar) |
| "Add error handling to GET /users/:id" | Single function scope, verifiable (returns correct error codes), one agent (Builder) |

### Too Fine (Merge Required)

| Example | Problem | How to Merge |
|---------|---------|-------------|
| "Add email column to users" | Not meaningful standalone (migration needs all columns) | Merge into "Create users table migration" |
| "Import bcrypt in auth service" | Implementation detail, not a step | Part of "Implement password hashing in auth service" |
| "Add semicolon to line 42" | Lint fix, not a task | Part of the parent implementation step |

### Granularity Decision Rule

```
Is the step meaningful to verify on its own?
  ├─ NO → Too fine, merge into parent step
  └─ YES → Can one agent complete it in 15 minutes?
              ├─ NO → Too coarse, split further
              └─ YES → Does it change < 50 lines?
                         ├─ NO → Too coarse, split further
                         └─ YES → Correct granularity
```

---

## Parallel Group Identification

### Algorithm

```
Input: List of steps with dependency edges (DAG)
Output: Parallel groups labeled for Rally

1. Compute topological order of the DAG
2. For each topological level (steps with same depth):
   a. Check pairwise file scope overlap
   b. If no overlap → same parallel group
   c. If overlap → different parallel groups or serialize
3. Label groups: parallel_group: A, parallel_group: B, etc.
4. Verify: for each group, confirm that removing any step
   does not affect the other steps' ability to complete
```

### Independence Verification

For steps X and Y in the same parallel group, ALL must be true:
- X and Y share no exclusive_write files
- X's output is not Y's input (and vice versa)
- X and Y do not mutate shared state (DB rows, config values)
- X failing does not invalidate Y's output

---

## Estimation Calibration

### Baseline Estimates

| Task Type | Baseline | Context Multiplier |
|-----------|----------|--------------------|
| Simple file edit (config, constant, env) | 5 min | x1.0 |
| New function in existing module | 10 min | x1.5 if unfamiliar module |
| New module with exports and types | 15 min | x1.5 if integrates with 3+ modules |
| Refactoring existing code | 10 min | x2.0 if no existing tests |
| Test file for existing module | 10 min | x1.5 if complex edge cases |
| Database migration | 10 min | x2.0 if rollback strategy needed |
| UI component (spec exists) | 15 min | x1.5 if accessibility requirements |
| UI component (no spec) | BLOCKED | Cannot estimate -- flag for spec first |

### Estimation Rules

1. **Never estimate 0 minutes.** Even trivial changes require context loading.
2. **Add 5 minutes for unfamiliar codebase.** First-time agent in a module needs orientation.
3. **Double estimate for code without tests.** Must write tests first (SPEC_FIRST).
4. **Total plan > 2 hours = scope review.** Flag to Nexus to reduce scope or split into sessions.
5. **Sum of estimates is the lower bound.** Actual time includes handoffs, failures, retries.

### Calibration Feedback

After plan execution, compare estimated vs actual time. Adjust multipliers:
- Consistently under-estimating a task type → increase multiplier by 0.5
- Consistently over-estimating → decrease multiplier by 0.25 (conservative reduction)

---

## SPEC_FIRST Workflow Integration

When a task involves new functionality, Sherpa enforces the SPEC_FIRST order:

```
1. Spec step     → Scribe/Forge writes specification
2. Test step     → Radar writes tests against the spec (tests will fail)
3. Implement step → Builder writes code until tests pass
4. Review step   → Judge reviews implementation against spec
```

### When to Enforce SPEC_FIRST

| Condition | Enforce? |
|-----------|----------|
| New API endpoint | Yes -- spec defines contract |
| New UI component | Yes -- spec defines behavior |
| Bug fix with known root cause | No -- fix then test |
| Refactor (behavior-preserving) | No -- existing tests suffice |
| Config change | No -- no behavior to spec |
| Security patch | Yes -- spec defines threat model and mitigations |

### SPEC_FIRST Step Template

```markdown
Step 1: Write specification for [feature]
  Agent: Scribe
  File scope: docs/specs/[feature].md (create)
  Completion: Spec document exists with acceptance criteria

Step 2: Write failing tests for [feature]
  Agent: Radar
  File scope: tests/[feature].test.ts (create)
  Depends: Step 1
  Completion: Tests exist, all FAIL (no implementation yet)

Step 3: Implement [feature]
  Agent: Builder
  File scope: src/[feature]/** (create/modify)
  Depends: Step 2
  Completion: All tests from Step 2 pass
```

---

## Revalidation Protocol

When a step is reported as BLOCKED or FAILED, the entire remaining plan must be revalidated.

### Revalidation Steps

1. **Impact analysis:** Which downstream steps depend on the failed step's output?
   - Direct dependencies: steps with an edge from the failed step
   - Transitive dependencies: steps reachable from the failed step in the DAG

2. **Alternative assessment:** Can the failed step be restructured?
   - Different approach (e.g., different library, different algorithm)
   - Different agent (e.g., Builder failed, try Forge for prototype first)
   - Scope reduction (e.g., implement subset of the feature)

3. **DAG resequencing:** If the failed step is removed or replaced:
   - Remove all edges to/from the failed step
   - Add edges for the replacement step (if any)
   - Recompute parallel groups
   - Verify no orphaned steps (steps that now have no path to completion)

4. **Notification:** Send revised plan to Nexus/Rally with:
   - What changed and why
   - Updated step numbers and dependencies
   - Revised time estimate
   - Risk assessment for the revised plan

5. **Never assume safety:** A BLOCKED step may invalidate steps that appear unrelated. Always check file scope overlap between the failed step and every remaining step.

### Revalidation Triggers

| Event | Action |
|-------|--------|
| Step BLOCKED (dependency unavailable) | Revalidate all downstream steps |
| Step FAILED (execution error) | Revalidate all downstream + check if root cause affects siblings |
| Step PARTIAL (incomplete output) | Assess whether partial output is sufficient for downstream steps |
| Scope change from CEO/Nexus | Full revalidation of entire remaining plan |
