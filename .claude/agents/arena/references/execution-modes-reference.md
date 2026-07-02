# arena — 実行モード リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## Execution Modes

Execution modes (Solo, Team, Quick) apply to **both** paradigms. The mode determines *how* engines are invoked; the paradigm determines *what* they do.

| Mode | COMPETE | COLLABORATE |
|------|---------|-------------|
| **Solo** | Sequential variant comparison | Sequential subtask execution |
| **Team** | Parallel variant generation | Parallel subtask execution |
| **Quick** | Lightweight 2-variant comparison | Lightweight 2-subtask execution (Quick Collaborate) |

### Solo Mode

Arena directly invokes CLIs sequentially via Bash. Best for 2-variant comparisons (COMPETE) or 2-subtask features (COLLABORATE).

```
Arena
├── Bash: codex exec ... (on arena/variant-codex branch)
├── Bash: gemini -p ... (on arena/variant-gemini branch)
├── Evaluate: git diff + Read + codex review
└── Adopt: git merge winning branch
```

### Team Mode

Arena spawns subagents via Agent Teams API for true parallel execution. Each subagent gets an **isolated working directory** via `git worktree` to prevent conflicts. Best for 3+ variants or when speed matters.

```
Arena (Team Leader)
├── git worktree add (create isolated directories)
├── Task(spawn): variant-codex → cd worktree → Bash: codex exec ...
├── Task(spawn): variant-gemini → cd worktree → Bash: gemini -p ...
├── Evaluate: git diff + Read + codex review
├── Adopt: git merge winning branch
└── git worktree remove (cleanup)
```

### Mode Selection

| Condition | Solo Mode | Team Mode |
|-----------|-----------|-----------|
| Variant count | 2 | 3+ |
| Parallelism | Sequential | True parallel |
| Cost | Low (single session) | Higher (N sessions) |
| Complexity | Low-Medium | High |
| Best for | codex vs gemini 2-way | Multi-approach, engine mixing |

See `references/team-mode-guide.md` for Team Mode details (COMPETE) and `references/collaborate-mode-guide.md` for COLLABORATE paradigm details.

**Quick Mode** is available as a lightweight option when eligibility criteria are met (≤ 3 files, ≤ 2 acceptance criteria, ≤ 50 lines). Quick Mode is COMPETE-only. See "Quick Mode" section below.

### Multi-Variant Matrix

For systematic variant generation, define a matrix of engine × approach combinations. This enables both cross-engine and same-engine competition in a single session.

**Matrix design example:**
```yaml
variant_matrix:
  # 1 engine × 2 approaches = 2 variants (Self-Competition)
  - engine: codex
    approach: "iterative, imperative style"
    branch: arena/variant-codex-imperative
  - engine: codex
    approach: "functional, declarative style"
    branch: arena/variant-codex-declarative

  # 2 engines × 2 approaches = 4 variants (Team Mode recommended)
  - engine: codex
    model: o4-mini
    branch: arena/variant-codex-o4-mini
  - engine: codex
    model: o3
    branch: arena/variant-codex-o3
  - engine: gemini
    approach: "standard"
    branch: arena/variant-gemini-standard
  - engine: gemini
    sandbox: true
    branch: arena/variant-gemini-sandbox
```

**Guidelines:**
- 2 variants → Solo Mode sufficient
- 3-4 variants → Team Mode recommended
- 5+ variants → Require explicit cost confirmation (ON_COST_THRESHOLD)

See `references/engine-cli-guide.md` → "Prompt Construction Protocol" for approach hint injection and `references/team-mode-guide.md` for multi-variant spawn patterns.

### Quick Mode

A lightweight comparison mode for small-scope tasks. Skips the full 7-phase workflow in favor of a streamlined 4-phase process.

**Eligibility criteria (ALL must be true):**
- Target files ≤ 3
- Acceptance criteria ≤ 2
- Estimated change ≤ 50 lines

**Quick Mode workflow:**
```
SPEC → EXECUTE → QUICK_EVAL → ADOPT
```

- **SPEC:** Same as standard — validate specification
- **EXECUTE:** Generate 2 variants (Solo Mode only)
- **QUICK_EVAL:** Scope Check + Test Run only (skip `codex review`). Score Correctness and Simplicity only (equal weight)
- **ADOPT:** Merge winner; verify tests pass

**Quick Mode does NOT include:**
- Full 5-criteria weighted scoring
- `codex review` automated review
- Detailed comparison report
- Cost estimation display

If Quick Mode evaluation is inconclusive (variants score equally), escalate to standard workflow with full REVIEW + EVALUATE.

### Quick Collaborate Mode

A lightweight COLLABORATE variant for small-scope cooperative tasks. Skips detailed decomposition analysis and uses a streamlined integration workflow.

**Eligibility criteria (ALL must be true):**
- COLLABORATE paradigm selected
- Total subtask count = 2
- Total target files ≤ 4 (across both subtasks)
- No complex dependencies between subtasks
- Estimated change ≤ 80 lines total

**Quick Collaborate workflow:**
```
SPEC → QUICK_DECOMPOSE → EXECUTE → QUICK_VERIFY → INTEGRATE
```

**Differences from standard COLLABORATE:**

| Aspect | Standard COLLABORATE | Quick Collaborate |
|--------|---------------------|-------------------|
| Decomposition | Full analysis with rationale | Minimal split (2 subtasks, obvious boundaries) |
| Review | Full 5-step per subtask | Scope check + test only |
| Verification | Full build + test + codex review + interface check | Build + test only |
| Report | Full integration report | One-line summary |

If Quick Collaborate integration fails (merge conflicts or test failures), escalate to standard COLLABORATE workflow.

See `references/collaborate-mode-guide.md` → "Quick Collaborate Mode" for detailed eligibility and workflow.

---

