# Parallel Execution Patterns

Comprehensive guide for Rally's multi-session parallel orchestration.

---

## File Ownership Rules

File ownership is the foundational law of parallel execution. Violations cause merge conflicts and data corruption.

### Ownership Types

| Type | Meaning | Who Can |
|------|---------|---------|
| `exclusive_write` | Only this teammate may modify these files | Single teammate |
| `shared_read` | Any teammate may read these files | All teammates |
| `created_by` | New files created by this teammate | Single teammate (auto-exclusive_write) |

### Ownership Declaration Format

```yaml
ownership_map:
  teammate_alpha:
    exclusive_write: [src/api/auth/**, src/services/auth/**]
    shared_read: [src/types/**, src/config/**]
  teammate_beta:
    exclusive_write: [src/components/auth/**, src/pages/login/**]
    shared_read: [src/types/**, src/config/**]
```

### Strict Rules

1. **No overlap in exclusive_write.** If two teammates write to the same path, the ownership declaration is invalid. Do not spawn.
2. **Type definitions are always shared_read.** Types in `src/types/`, `*.d.ts`, and shared interfaces are never exclusive_write.
3. **Config files are shared_read.** `tsconfig.json`, `package.json`, `.env` -- never exclusive_write.
4. **New files inherit ownership.** If teammate_alpha creates `src/api/auth/middleware.ts`, it falls under their `src/api/auth/**` exclusive_write.
5. **Index files require explicit assignment.** Barrel files (`index.ts`) that import from multiple modules must be assigned to one teammate, with others providing their exports as documented output.

### Ownership Conflict Resolution

When two work streams both need to modify the same file:
1. Split the file into two files along the ownership boundary
2. Create an interface/type file as shared_read, with implementations in separate exclusive_write paths
3. If splitting is impossible, serialize those steps (do not parallelize)

---

## Parallelizability Assessment

Before parallelizing, evaluate each task pair against these criteria:

### Independence Checklist

| # | Check | Must Be True |
|---|-------|-------------|
| 1 | File independence | No shared exclusive_write paths |
| 2 | Data independence | Task A's output is not Task B's input |
| 3 | State independence | No shared mutable state (DB records, cache, env) |
| 4 | Order independence | A-then-B and B-then-A produce identical results |
| 5 | Test independence | Each task's tests can pass without the other's code |

**If ANY check fails, do not parallelize those two tasks.** Serialize them instead.

### Assessment Decision Flow

```
Can tasks run in any order?
  ├─ NO → Serialize
  └─ YES → Do they write to any shared files?
              ├─ YES → Can the file be split?
              │         ├─ YES → Split, then parallelize
              │         └─ NO → Serialize
              └─ NO → Parallelize
```

---

## Team Assembly Patterns

### Pattern 1: Frontend + Backend Split

**When:** Full-stack feature with API and UI work.

```yaml
team: "feature-user-profile"
teammates:
  backend:
    type: general-purpose
    model: sonnet
    exclusive_write: [src/api/**, src/services/**, src/db/migrations/**]
    shared_read: [src/types/**]
    task: "Implement API endpoints and service layer"
  frontend:
    type: general-purpose
    model: sonnet
    exclusive_write: [src/components/**, src/pages/**, src/hooks/**]
    shared_read: [src/types/**]
    task: "Implement UI components and pages"
```

**Synchronization:** Types file (`src/types/user.ts`) is created by Sherpa first as shared_read. Both teammates code against the type contract.

### Pattern 2: Feature-Based Split

**When:** Multiple independent features in one sprint/task.

```yaml
team: "multi-feature"
teammates:
  feature_auth:
    type: general-purpose
    model: sonnet
    exclusive_write: [src/**/auth/**, tests/**/auth/**]
    task: "Implement authentication feature"
  feature_search:
    type: general-purpose
    model: sonnet
    exclusive_write: [src/**/search/**, tests/**/search/**]
    task: "Implement search feature"
  feature_notification:
    type: general-purpose
    model: haiku
    exclusive_write: [src/**/notification/**, tests/**/notification/**]
    task: "Implement notification feature"
```

**Key:** Each feature lives in its own directory subtree. No cross-feature imports during parallel phase.

### Pattern 3: Layer-Based Split

**When:** Vertical slice through the stack (DB, API, UI) where each layer is substantial.

```yaml
team: "layer-split"
teammates:
  db_layer:
    type: general-purpose
    model: sonnet
    exclusive_write: [src/db/**, prisma/migrations/**]
    task: "Create schema and migrations"
  api_layer:
    type: general-purpose
    model: sonnet
    exclusive_write: [src/api/**, src/services/**]
    shared_read: [src/db/schema.ts]  # Schema is designed first
    task: "Implement API routes and services"
  ui_layer:
    type: general-purpose
    model: sonnet
    exclusive_write: [src/components/**, src/pages/**]
    shared_read: [src/types/**]
    task: "Implement UI components"
```

**Dependency:** DB layer must complete first (provides schema). API and UI can parallelize after schema exists.

---

## Synchronization Points

### When to Wait (Barriers)

| Barrier Type | Condition | All Must Complete Before |
|-------------|-----------|------------------------|
| Schema barrier | DB schema changes | API implementation begins |
| Type barrier | Shared type definitions | Any consumer begins |
| Config barrier | Environment/config changes | Any dependent code |
| Test barrier | All implementations | Integration test phase |

### When to Proceed (No Wait)

- Teammates working on disjoint file sets with no shared types
- Investigation (Explore) teammates that only read
- Documentation teammates that write to `docs/**` only

### Barrier Implementation

```
Phase 1: [DB teammate] → produces schema.ts
   ↓ BARRIER: schema ready
Phase 2: [API teammate, UI teammate] → parallel work
   ↓ BARRIER: all implementations done
Phase 3: [Test teammate] → integration tests
```

---

## Merge Conflict Prevention

### Strategy 1: Structural Prevention

Design file ownership so conflicts are impossible. This is the primary strategy.

- Separate directories per teammate
- Shared code goes in shared_read files that no teammate modifies
- New shared types are created before parallel phase begins

### Strategy 2: Interface Contracts

When teammates produce code that must eventually integrate:

1. Define the interface/type contract first (Sherpa phase)
2. Each teammate implements against the contract
3. Integration happens in synthesis phase after all complete

### Strategy 3: Explicit Merge Owner

For unavoidable shared files (e.g., route registration, barrel exports):

1. Designate one teammate as the merge owner for that file
2. Other teammates document their additions as comments in their handoff
3. Merge owner integrates all additions in a final step

---

## Worktree Isolation

Git worktrees provide physical isolation for parallel branches.

### Setup

```bash
# Main working tree: feature branch
git worktree add ../project-teammate-alpha -b teammate/alpha
git worktree add ../project-teammate-beta -b teammate/beta
```

### Rules

- Each teammate works in its own worktree
- Teammates never access each other's worktree
- Rally merges branches after all teammates complete
- On conflict (should not happen with proper ownership): Rally resolves or escalates

### Cleanup

```bash
git worktree remove ../project-teammate-alpha
git worktree remove ../project-teammate-beta
git branch -d teammate/alpha teammate/beta
```

---

## Communication Protocol

### Between Rally and Teammates

| Direction | Method | Use Case |
|-----------|--------|----------|
| Rally -> Teammate | TaskCreate prompt | Initial task assignment |
| Rally -> Teammate | SendMessage (DM) | Additional context, unblocking |
| Teammate -> Rally | TaskUpdate | Completion, status change |
| Rally -> All | Broadcast (emergency) | Abort, critical context change |

### Between Teammates

**Direct communication is prohibited.** All coordination goes through Rally.

If teammate A needs information from teammate B:
1. A reports need via TaskUpdate to Rally
2. Rally queries B via SendMessage
3. Rally relays relevant information to A via SendMessage

### Status Polling

Rally polls TeamList every 30 seconds during execution. Status classifications:

| Status | Action |
|--------|--------|
| IN_PROGRESS | No action, continue polling |
| COMPLETED | Mark step done, check if all branches finished |
| BLOCKED | Send DM with additional context (1 retry) |
| FAILED | Classify severity, escalate if major |
