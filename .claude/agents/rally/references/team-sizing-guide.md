# Team Sizing Guide

How Rally determines optimal team size for parallel execution.

---

## Optimal Team Size by Task Type

| Task Type | Recommended Size | Rationale |
|-----------|-----------------|-----------|
| Full-stack feature (API + UI) | 2 | Clean frontend/backend split |
| Multi-feature sprint | 2-3 | One teammate per feature |
| Large refactor (multi-module) | 2-3 | Module-based ownership |
| New service + tests | 2 | Implementation + test in parallel |
| Database + API + UI (vertical) | 3 | Layer-based split with schema barrier |
| Monorepo cross-package | 3-4 | Package-based ownership |
| Large migration (10+ files) | 3-4 | File group ownership |

**Default:** Start with 2 teammates. Add only when there is a clear third independent work stream.

**Maximum:** 5 teammates. Beyond 5, coordination overhead exceeds parallelization benefit.

---

## Over-Parallelization Anti-Patterns

### Anti-Pattern 1: One File Per Teammate

**Wrong:** 6 teammates each editing 1 file.
**Why it fails:** Coordination overhead (6 spawns, 6 monitors, 6 merges) far exceeds the time to edit 6 files sequentially.
**Rule:** Each teammate should own at least 2-3 files to justify the spawn cost.

### Anti-Pattern 2: Hidden Dependencies

**Wrong:** 3 teammates working on "independent" tasks that actually share a database table.
**Why it fails:** Runtime state conflicts even though file ownership is clean.
**Rule:** Check data dependencies, not just file dependencies.

### Anti-Pattern 3: Micro-Teams for Macro-Tasks

**Wrong:** 5 teammates for a task that takes 20 minutes sequentially.
**Why it fails:** Spawn + context injection + monitoring + synthesis takes ~10 minutes of overhead.
**Rule:** Do not parallelize tasks that total less than 30 minutes of sequential work.

### Anti-Pattern 4: Parallel Everything

**Wrong:** Parallelizing investigation (Scout) with implementation (Builder).
**Why it fails:** Investigation output determines what to implement.
**Rule:** Only parallelize tasks that are genuinely independent. Sequential dependencies must remain sequential.

### Anti-Pattern 5: Context Duplication Explosion

**Wrong:** Giving each of 4 teammates the full project context (100k tokens each).
**Why it fails:** 400k tokens consumed on context alone.
**Rule:** Each teammate gets only the context relevant to their work stream.

---

## Resource Budget Awareness

### Token Cost Model

| Component | Token Cost |
|-----------|-----------|
| Teammate spawn (context injection) | ~5,000 tokens |
| Teammate execution (average) | ~30,000 tokens |
| Rally monitoring (per teammate) | ~2,000 tokens |
| Synthesis phase | ~5,000 tokens |

**Total cost formula:** `rally_overhead + (N * (spawn + execution + monitoring)) + synthesis`

| Team Size | Estimated Total Tokens |
|-----------|----------------------|
| 2 teammates | ~80,000 |
| 3 teammates | ~115,000 |
| 4 teammates | ~150,000 |
| 5 teammates | ~185,000 |

### When Budget Is Tight

If remaining token budget is below 100k:
- Maximum 2 teammates
- Compress context to essentials only
- Skip synthesis narrative, provide file list only

---

## When to Serialize Instead of Parallelize

| Condition | Action | Reason |
|-----------|--------|--------|
| Total sequential time < 30 min | Serialize | Overhead exceeds savings |
| File ownership overlap unavoidable | Serialize | Merge conflicts guaranteed |
| Data dependency between streams | Serialize | Output of A is input of B |
| Only 1 work stream identified | Serialize | Nothing to parallelize |
| Remaining token budget < 80k | Serialize | Cannot afford parallel overhead |
| Task requires iterative feedback | Serialize | Parallel agents cannot review each other |
| Shared mutable state (DB, cache) | Serialize | Runtime conflicts |

**Decision rule:** Parallelize only when the expected time savings exceed the coordination overhead (spawn + monitor + merge). When in doubt, serialize.

---

## Monitoring Parallel Execution

### Progress Tracking

Rally maintains a real-time status board:

```yaml
team_status:
  team: "feature-auth"
  started: "2026-04-06T10:00:00Z"
  teammates:
    backend:
      status: COMPLETED
      duration: "8 min"
      files_modified: 4
    frontend:
      status: IN_PROGRESS
      elapsed: "6 min"
      last_activity: "2 min ago"
    tests:
      status: NOT_STARTED
      depends_on: [backend, frontend]
```

### Stuck Detection

A teammate is considered stuck when:
- No file modifications for 5+ minutes
- No status update for 5+ minutes
- Token usage exceeds 80% of budget with no artifacts produced

**Stuck recovery:**
1. Send DM with additional context or hints
2. If still stuck after 1 DM: terminate and reassign to new teammate with more context
3. If reassignment also fails: mark as BLOCKED, report to Nexus

### Health Checks

Every 60 seconds, Rally verifies:
- All teammates are still running (not silently crashed)
- File ownership has not been violated (no writes outside declared paths)
- Token usage is within budget
- No teammate has entered an infinite loop (same file modified 5+ times)

---

## Rollback Strategy for Partial Completion

When some teammates succeed and others fail:

### Option 1: Merge Partial (Default for Independent Streams)

If completed streams are independently valuable:
1. Merge successful branches
2. Report failed branches to Nexus for re-execution
3. Mark task as PARTIAL

### Option 2: Rollback All (For Interdependent Streams)

If streams must all succeed together:
1. Discard all branches
2. Return to pre-Rally state (rollback_point)
3. Report to Nexus with failure details for re-planning

### Option 3: Retry Failed Branch

If the failure is recoverable (test failure, minor bug):
1. Keep successful branches
2. Spawn new teammate for failed branch with error context
3. Merge when retry succeeds

### Decision Matrix

| Streams Independent? | Failure Recoverable? | Strategy |
|---------------------|---------------------|----------|
| Yes | Yes | Retry failed branch |
| Yes | No | Merge partial |
| No | Yes | Retry failed branch |
| No | No | Rollback all |
