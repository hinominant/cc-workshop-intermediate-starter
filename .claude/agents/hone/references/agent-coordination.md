# Agent Coordination Reference

Detailed specifications for multi-agent coordination, selection logic, and handoff protocols.

---

## Agent Inventory

### Quality Agents (Primary)

| Agent | Domain | Output Type | Modifies Code |
|-------|--------|-------------|---------------|
| Judge | Code correctness | Findings report | No |
| Zen | Code complexity | Refactored code | Yes |
| Radar | Test coverage | Test files | Yes |
| Warden | UX quality | Scorecard | No |
| Quill | Documentation | Doc updates | Yes |

### Fix Agents (Secondary)

| Agent | Domain | Triggered By | Output |
|-------|--------|--------------|--------|
| Builder | Bug fixes | Judge findings | Fixed code |
| Sentinel | Security | Judge/Probe | Secure code |
| Palette | UX fixes | Warden findings | Improved UX |
| Artisan | Frontend | Warden/Palette | Production UI |

### Analysis Agents (Support)

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| Scout | Root cause analysis | Persistent issues |
| Atlas | Architecture analysis | Structural problems |
| Canvas | Visualization | Complex explanations |

---

## Agent Selection Algorithm

### Step 1: Domain Analysis

```python
def analyze_request(request, context):
    domains = []

    # Keywords → domains
    if mentions(request, ["bug", "fix", "error", "issue"]):
        domains.append("code_correctness")
    if mentions(request, ["test", "coverage", "coverage"]):
        domains.append("test_quality")
    if mentions(request, ["complex", "readability", "refactor"]):
        domains.append("complexity")
    if mentions(request, ["doc", "comment", "readme"]):
        domains.append("documentation")
    if mentions(request, ["UX", "user", "interface", "UI"]):
        domains.append("ux_quality")
    if mentions(request, ["security", "vulnerability"]):
        domains.append("security")

    # File analysis → domains
    if has_ui_files(context.files):
        domains.append("ux_quality")
    if has_test_files(context.files):
        domains.append("test_quality")

    return domains or ["all"]  # Default to all
```

### Step 2: Agent Mapping

```python
DOMAIN_TO_AGENTS = {
    "code_correctness": ["judge", "builder"],
    "complexity": ["zen"],
    "test_quality": ["radar"],
    "consistency": ["judge", "zen"],
    "test_reliability": ["judge", "radar"],
    "documentation": ["quill"],
    "ux_quality": ["warden", "palette"],
    "security": ["sentinel", "probe"],
    "all": ["judge", "zen", "radar", "quill", "warden"]
}

def select_agents(domains):
    agents = []
    for domain in domains:
        agents.extend(DOMAIN_TO_AGENTS.get(domain, []))
    return deduplicate(agents)
```

### Step 3: Priority Ordering

```python
AGENT_PRIORITY = {
    "sentinel": 1,  # Security first
    "judge": 2,     # Find issues
    "builder": 3,   # Fix issues
    "zen": 4,       # Simplify
    "radar": 5,     # Add tests
    "quill": 6,     # Document
    "warden": 7,    # UX check
    "palette": 8,   # UX fix
}

def order_agents(agents):
    return sorted(agents, key=lambda a: AGENT_PRIORITY.get(a, 99))
```

---

## Coordination Patterns

### Pattern: Judge → Builder → Verify

When Judge finds issues that need fixing.

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Judge   │────▶│ Builder  │────▶│  Radar   │
│ (analyze)│     │  (fix)   │     │ (verify) │
└──────────┘     └──────────┘     └──────────┘
     │                │                │
     ▼                ▼                ▼
  Findings         Fixed code      Tests pass?
     │                                 │
     └─────────────────────────────────┘
                    Compare
```

**Handoff data:**

```yaml
judge_to_builder:
  findings:
    - severity: HIGH
      file: src/auth.ts
      line: 42
      issue: "Null check missing"
      suggestion: "Add null guard"

builder_to_radar:
  changes:
    - file: src/auth.ts
      lines_changed: [42, 43]
      type: "null_guard_added"
```

### Pattern: Zen → Radar → Verify

When simplifying code that has tests.

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│   Zen    │────▶│  Radar   │────▶│  Radar   │
│(simplify)│     │(run test)│     │(add test)│
└──────────┘     └──────────┘     └──────────┘
     │                │                │
     ▼                ▼                ▼
 Refactored      Tests pass?     Coverage up?
   code               │                │
                      │                │
              ┌───────┴───────┐        │
              │               │        │
           PASS            FAIL       Yes
              │               │        │
              ▼               ▼        ▼
           Done           Rollback   Done
```

**Critical:** Always run tests after Zen changes.

### Pattern: Warden → Palette → Artisan

UX improvement chain.

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Warden  │────▶│ Palette  │────▶│ Artisan  │
│ (audit)  │     │(UX design)│    │(implement)│
└──────────┘     └──────────┘     └──────────┘
     │                │                │
     ▼                ▼                ▼
 V.A.I.R.E.      UX specs        Production
  scores         & fixes            code
```

### Pattern: Security-First

When security issues are detected.

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Sentinel │────▶│ Builder  │────▶│  Probe   │────▶│  Judge   │
│  (scan)  │     │  (fix)   │     │ (DAST)   │     │(re-review)│
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                │                │                │
     ▼                ▼                ▼                ▼
 Vulns found     Patches        Verification     Final check
```

**Rule:** Do not proceed to regular quality until security is green.

---

## Handoff Protocol

### Standard Handoff Format

```yaml
## HONE_AGENT_HANDOFF
from_agent: judge
to_agent: builder
timestamp: 2024-01-15T10:30:00Z
cycle: 1
context:
  target_files:
    - src/auth/login.ts
    - src/auth/validate.ts
  constraints:
    - "No breaking changes"
    - "Preserve function signatures"
findings:
  - id: J-001
    severity: HIGH
    location:
      file: src/auth/login.ts
      line: 42
      column: 12
    issue: "Potential null pointer dereference"
    suggestion: "Add null check before accessing user.email"
    code_snippet: |
      const email = user.email.toLowerCase();
expected_output:
  - Fixed code for J-001
  - Explanation of fix
  - Any new risks introduced
```

### Handoff Response Format

```yaml
## HONE_AGENT_RESPONSE
from_agent: builder
to_agent: hone
timestamp: 2024-01-15T10:35:00Z
status: SUCCESS | PARTIAL | BLOCKED
actions_taken:
  - id: J-001
    status: FIXED
    changes:
      - file: src/auth/login.ts
        before: "const email = user.email.toLowerCase();"
        after: "const email = user?.email?.toLowerCase() ?? '';"
    risks: []
blockers: []
recommendations:
  - "Add unit test for null user case"
metrics:
  time_taken: "4m 32s"
  files_modified: 1
  lines_changed: 3
```

---

## Conflict Resolution

### Conflict: Zen vs Builder

Both want to modify the same file.

**Resolution:** Sequential execution
```
Builder (fix bugs) → Zen (simplify fixed code)
```

**Rationale:** Fix correctness first, then improve structure.

### Conflict: Radar vs Zen

Zen changes might break tests.

**Resolution:** Pre-verify
```
Radar (run tests) → Zen (with test baseline) → Radar (verify again)
```

**Rollback rule:** If tests fail after Zen, revert Zen changes.

### Conflict: Multiple Critical Findings

Judge and Sentinel both report critical issues.

**Resolution:** Priority order
```
1. Security (Sentinel) - could be exploited
2. Data integrity (Judge CRITICAL) - could corrupt data
3. Functionality (Judge HIGH) - feature broken
```

### Conflict: Parallel Agent Outputs

Two agents modified the same file in parallel.

**Resolution:** Manual merge
```
1. Stop parallel execution
2. Present both changes to Hone
3. Hone decides merge strategy or sequential re-run
```

---

## Error Handling

### Agent Timeout

```python
AGENT_TIMEOUTS = {
    "judge": 300,    # 5 minutes
    "zen": 180,      # 3 minutes
    "radar": 300,    # 5 minutes (tests can be slow)
    "builder": 180,  # 3 minutes
    "warden": 120,   # 2 minutes
    "quill": 120,    # 2 minutes
}

def handle_timeout(agent):
    log_warning(f"{agent} timed out")
    return {
        "status": "TIMEOUT",
        "agent": agent,
        "action": "SKIP",
        "note": f"{agent} skipped due to timeout"
    }
```

### Agent Error

```python
def handle_agent_error(agent, error):
    if error.is_retryable:
        retry_count = get_retry_count(agent)
        if retry_count < MAX_RETRIES:
            increment_retry(agent)
            return {"action": "RETRY"}

    return {
        "status": "ERROR",
        "agent": agent,
        "action": "SKIP",
        "error": str(error),
        "note": f"{agent} skipped due to error"
    }
```

### Build Failure After Fix

```python
def handle_build_failure(agent, changes):
    # 1. Revert changes
    revert_changes(changes)

    # 2. Log failure
    log_error(f"Build failed after {agent} changes")

    # 3. Report blocker
    return {
        "status": "BLOCKED",
        "agent": agent,
        "action": "REPORT",
        "note": "Changes reverted due to build failure",
        "recommendation": "Manual investigation needed"
    }
```

---

## Context Preservation

### Context Object

```python
class HoneContext:
    session_id: str
    cycle: int
    target_files: List[str]
    constraints: List[str]
    baseline_uqs: float
    current_uqs: float
    history: List[CycleResult]
    agent_outputs: Dict[str, AgentOutput]
    learnings: List[str]
```

### Context Handoff Rules

1. **Always pass target_files** - Agents need to know scope
2. **Pass constraints** - "No breaking changes" etc.
3. **Pass relevant findings** - Judge findings to Builder
4. **Pass metrics baseline** - For delta calculation
5. **Don't pass full history** - Only relevant learnings

### Context Size Management

```python
MAX_CONTEXT_SIZE = 32000  # tokens

def trim_context(context):
    # Priority: keep most recent, most relevant
    if estimate_tokens(context) > MAX_CONTEXT_SIZE:
        # Remove old cycle details
        context.history = context.history[-2:]
        # Summarize agent outputs
        context.agent_outputs = summarize_outputs(context.agent_outputs)
```

---

## Parallel Execution Guidelines

### Safe for Parallel

| Agent 1 | Agent 2 | Safe? | Reason |
|---------|---------|-------|--------|
| Judge | Radar | Yes | Both read-only analysis |
| Judge | Warden | Yes | Different domains |
| Quill | Warden | Yes | Different domains |

### Not Safe for Parallel

| Agent 1 | Agent 2 | Safe? | Reason |
|---------|---------|-------|--------|
| Builder | Zen | No | Both modify code |
| Builder | Radar | No | Radar tests, Builder changes |
| Zen | Radar | No | Zen changes, Radar tests |

### Parallel Pattern

```
Phase 1 (Parallel Analysis):
  ┌─ Judge ─┐
  │         │
  └─ Radar ─┘ ──▶ Merge findings
  │         │
  └─ Warden ┘

Phase 2 (Sequential Fix):
  Builder → Zen → Radar (verify)

Phase 3 (Parallel Docs):
  ┌─ Quill ─┐
  │         │ ──▶ Done
  └─ Canvas ┘
```

---

## Rollback Protocol

### Checkpoint Creation

```python
def create_checkpoint(cycle):
    checkpoint = {
        "cycle": cycle,
        "timestamp": now(),
        "git_ref": get_current_git_ref(),
        "uqs": calculate_uqs(),
        "files": list_modified_files()
    }
    save_checkpoint(checkpoint)
    return checkpoint
```

### Rollback Trigger

```python
ROLLBACK_TRIGGERS = [
    "build_failure",
    "test_regression",
    "uqs_decrease",
    "agent_conflict"
]

def should_rollback(event, context):
    if event.type in ROLLBACK_TRIGGERS:
        if event.severity >= THRESHOLD:
            return True
    return False
```

### Rollback Execution

```python
def execute_rollback(checkpoint):
    # 1. Git rollback
    git_checkout(checkpoint.git_ref)

    # 2. Restore state
    restore_context(checkpoint)

    # 3. Log rollback
    log_info(f"Rolled back to cycle {checkpoint.cycle}")

    # 4. Report
    return {
        "status": "ROLLED_BACK",
        "to_cycle": checkpoint.cycle,
        "reason": rollback_reason
    }
```
