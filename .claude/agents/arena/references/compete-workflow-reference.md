# arena — 競争開発ワークフロー リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## Core Workflow

### COMPETE Workflow (default)

Arena follows a phased process: **SPEC → SCOPE LOCK → EXECUTE → REVIEW → EVALUATE → [REFINE] → ADOPT → VERIFY**

See `references/engine-cli-guide.md` for detailed CLI reference, prompt construction protocol, and Git branch management.

### Phase 1: SPEC — Validate Specification

Before any engine invocation, Arena MUST have a clear specification that includes:
- What to implement (functional requirements)
- Acceptance criteria (how to verify success)
- Error handling expectations
- Performance / security constraints (if applicable)

### Phase 2: SCOPE LOCK — Determine Allowed Files (CRITICAL)

Arena MUST lock file scope BEFORE invoking any engine. This prevents engines from making uncontrolled changes across the codebase.

```bash
# 1. Identify affected modules from the spec
# 2. Use Glob/Grep to find existing files in those modules
# 3. Define allowed_files (ONLY these may be created/modified)
# 4. Define forbidden_files (these MUST NOT be touched)
# 5. Build the engine prompt using references/engine-cli-guide.md templates
```

**Allowed files** = implementation files + corresponding test files.
**Forbidden files** = dependencies, config, CI/CD, infrastructure, unrelated modules.

See `references/engine-cli-guide.md` → "Prompt Construction Protocol" for the full scope lock procedure and prompt templates.

### Solo Mode Quick Reference

```bash
# Phase 1-2: SPEC & SCOPE LOCK
# Validate spec, determine allowed_files, build engine prompts

# Phase 3: EXECUTE - Run engines sequentially on branches
git stash push -m "arena: pre-session stash"
BASE_COMMIT=$(git rev-parse HEAD)

# Codex variant
git checkout -b arena/variant-codex $BASE_COMMIT
codex exec --full-auto "{scoped_engine_prompt}"
git diff --name-only                      # Validate scope
git checkout -- {any_forbidden_files}     # Revert unauthorized changes
git add -A && git commit -m "arena: variant-codex implementation"

# Gemini variant
git checkout -b arena/variant-gemini $BASE_COMMIT
gemini -p "{scoped_engine_prompt}" --yolo
git diff --name-only                      # Validate scope
git checkout -- {any_forbidden_files}     # Revert unauthorized changes
git add -A && git commit -m "arena: variant-gemini implementation"

# Phase 4: REVIEW - Mandatory quality gate per variant
# For each variant branch:
#   1. Scope check: git diff --name-only (verify allowed files only)
#   2. Test execution: run project test command
#   3. Build verification: run project build command
#   4. codex review: codex review --uncommitted
#   5. Acceptance criteria: verify spec requirements are met
# Record results in review_results for EVALUATE phase

# Phase 5: EVALUATE - Compare variants
git diff arena/variant-codex..arena/variant-gemini
# Use review_results + Read files to score each variant

# Phase 5b: REFINE (optional) - If best score 2.5–4.0, re-execute with targeted improvements (max 2 iterations)

# Phase 6: ADOPT - Merge winner
git checkout $BASE_BRANCH
git merge arena/variant-codex -m "arena: adopt variant-codex"

# Phase 7: VERIFY & CLEANUP
# Run tests, build, security scan
git branch -D arena/variant-codex arena/variant-gemini
git stash pop
```

### Team Mode Quick Reference

```python
# Phase 1-2: SPEC & SCOPE LOCK
# Validate spec, determine allowed_files, build engine prompts
# IMPORTANT: Build complete engine prompts BEFORE spawning subagents

# Phase 3: PREPARE WORKTREES (Arena leader via Bash — BEFORE spawning)
# git stash push -m "arena: pre-session stash"
# BASE_COMMIT=$(git rev-parse HEAD)
# SESSION_ID="arena-$(date +%s)"
# mkdir -p /tmp/$SESSION_ID
# git branch arena/variant-codex $BASE_COMMIT
# git branch arena/variant-gemini $BASE_COMMIT
# git worktree add /tmp/$SESSION_ID/variant-codex arena/variant-codex
# git worktree add /tmp/$SESSION_ID/variant-gemini arena/variant-gemini

# Phase 4: SPAWN - Create team and subagents
TeamCreate(team_name="arena-{task_id}")
# Spawn variant-codex and variant-gemini with:
#   - Worktree path (e.g., /tmp/$SESSION_ID/variant-codex)
#   - Exact engine prompt (pre-built)
#   - Allowed files list
#   - Forbidden files list
#   - Scope validation instructions
# (see references/team-mode-guide.md for teammate prompt templates)

# Phase 5: COMPETE - Subagents run engines in parallel (fully isolated via worktrees)
# Monitor via TaskList()
# Each subagent works in its own directory — no conflicts possible

# Phase 6: REVIEW - Mandatory quality gate (Arena leader runs on each variant)
# For each variant branch:
#   1. Scope check: git diff --name-only vs allowed_files
#   2. Test execution: run project test command
#   3. Build verification: run project build command
#   4. codex review: codex review --uncommitted
#   5. Acceptance criteria: verify spec requirements met
# Variants failing critical checks are flagged/disqualified

# Phase 7: EVALUATE - Score variants (informed by review results)

# Phase 7b: REFINE (optional) - If best score 2.5–4.0, re-execute with improvement directives (max 2 iterations)

# Phase 8: ADOPT - Merge winner

# Phase 9: CLEANUP
# Shutdown subagents → TeamDelete
# git worktree remove (BEFORE branch deletion)
# git branch -D → git stash pop
```

See `references/team-mode-guide.md` for full Team Mode lifecycle and teammate prompt templates.

### Evaluation Criteria (Default Weights)

| Criterion | Weight | Focus |
|-----------|--------|-------|
| Correctness | 40% | Meets specification requirements |
| Code Quality | 25% | Readability, maintainability, patterns |
| Performance | 15% | Efficiency, resource usage |
| Safety | 15% | Error handling, security |
| Simplicity | 5% | Avoids over-engineering |

See `references/evaluation-framework.md` for full scoring methodology, weight adjustments, tie-breaking rules, and the REFINE phase framework.

---

### COLLABORATE Workflow

COLLABORATE follows: **SPEC → DECOMPOSE → SCOPE LOCK → EXECUTE → REVIEW → INTEGRATE → VERIFY**

Unlike COMPETE (same spec to all, pick best), COLLABORATE splits the task and merges all results.

```
SPEC ─→ DECOMPOSE ─→ SCOPE LOCK ─→ EXECUTE ─→ REVIEW ─→ INTEGRATE ─→ VERIFY
                       (per task)   (parallel)  (per task)  (merge all)
```

#### Phase 1: SPEC — Validate Full Specification

Same as COMPETE — ensure the complete feature specification is clear.

#### Phase 2: DECOMPOSE — Split into Subtasks

Arena analyzes the spec and splits it into independent subtasks with non-overlapping file scopes.

```yaml
decomposition:
  subtasks:
    - id: "core-logic"
      description: "Implement the core algorithm"
      engine: codex           # Best for algorithmic tasks
      allowed_files:
        - "src/core/algorithm.ts"
        - "src/core/algorithm.test.ts"
      rationale: "codex excels at focused algorithmic work"
    - id: "api-integration"
      description: "Implement API endpoint and middleware"
      engine: gemini          # Best for architectural/integration tasks
      allowed_files:
        - "src/api/endpoint.ts"
        - "src/api/endpoint.test.ts"
        - "src/middleware/auth.ts"
      rationale: "gemini handles broader context and integration patterns well"
  shared_read:                # Files all engines can read but NOT modify
    - "src/types/**"
    - "src/config/**"
  integration_order:          # Merge sequence (dependency-aware)
    - "core-logic"            # Merge first (no dependencies)
    - "api-integration"       # Merge second (may depend on core)
```

**Decomposition rules:**
- Each file belongs to exactly ONE subtask (no overlap)
- Shared types/interfaces go in `shared_read` (read-only for all)
- Order subtasks by dependency (independent first)
- Assign engines based on task characteristics (see Engine Selection Heuristics in `references/engine-cli-guide.md`)

#### Phase 3: SCOPE LOCK — Per-Subtask Scope

Build a separate engine prompt for each subtask using the standard Prompt Construction Protocol. Each subtask gets its own `allowed_files` and `forbidden_files`.

#### Phase 4: EXECUTE — Run Engines (Solo: sequential, Team: parallel)

Branch naming: `arena/task-{subtask_id}` (not `arena/variant-{engine}`)

**Solo Mode:**
```bash
BASE_COMMIT=$(git rev-parse HEAD)

# Subtask 1: core-logic (codex)
git checkout -b arena/task-core-logic $BASE_COMMIT
codex exec --full-auto "{subtask_1_prompt}"
git add -A && git commit -m "arena: task-core-logic implementation"

# Subtask 2: api-integration (gemini)
git checkout -b arena/task-api-integration $BASE_COMMIT
gemini -p "{subtask_2_prompt}" --yolo
git add -A && git commit -m "arena: task-api-integration implementation"
```

**Team Mode:** Same as COMPETE Team Mode — use worktrees and subagent proxies. See `references/collaborate-mode-guide.md` for COLLABORATE-specific teammate prompt templates.

#### Phase 5: REVIEW — Per-Subtask Quality Gate

Same 5-step review as COMPETE (Scope → Build → Test → codex review → Acceptance), run on each subtask branch independently. Disqualification rules apply per subtask.

#### Phase 6: INTEGRATE — Merge All Results

Unlike COMPETE's ADOPT (pick one winner), INTEGRATE merges ALL passing subtask results in dependency order.

```bash
git checkout $BASE_BRANCH

# Merge in dependency order
git merge arena/task-core-logic -m "arena: integrate task-core-logic"
git merge arena/task-api-integration -m "arena: integrate task-api-integration"
```

**Conflict resolution:** If merge conflicts occur:
1. Identify conflicting files (should not happen with non-overlapping scopes)
2. If conflict is in shared types: Arena leader resolves manually
3. If conflict indicates scope overlap: decomposition was incorrect — fix and re-run affected subtask

#### Phase 7: VERIFY — Integration Verification

After all subtasks are merged, run comprehensive verification:
1. **Build** — Full project build passes
2. **Tests** — All tests pass (including cross-subtask integration tests)
3. **codex review** — Review the integrated result
4. **Interface check** — Verify imports/exports between subtask boundaries are correct

See `references/collaborate-mode-guide.md` for full COLLABORATE workflow details, teammate templates, and examples.

---

