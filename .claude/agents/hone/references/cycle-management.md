# Cycle Management Reference

Detailed specifications for PDCA cycle control, termination logic, and history recording.

---

## Cycle Configuration

### Default Settings

```yaml
default_config:
  max_cycles: 3
  target_uqs: 80
  diminishing_threshold: 5  # percentage points
  diminishing_count: 2      # consecutive cycles
  mode: STANDARD
```

### Mode Configurations

| Mode | Max Cycles | Target UQS | Diminishing Threshold | Use Case |
|------|-----------|-----------|----------------------|----------|
| QUICK | 2 | 70 | 5% (1 cycle) | Fast turnaround |
| STANDARD | 3 | 80 | 5% (2 cycles) | Balanced |
| INTENSIVE | 5 | 90 | 3% (2 cycles) | High quality |

### Configuration Override

Users can specify custom configuration:

```yaml
custom_config:
  max_cycles: 4
  target_uqs: 85
  domains: [code, tests]
  skip_agents: [warden]
```

---

## Cycle State Machine

```
┌─────────┐
│  INIT   │
└────┬────┘
     │ start_session()
     ▼
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  PLAN   │────▶│   DO    │────▶│  CHECK  │────▶│   ACT   │
└────┬────┘     └─────────┘     └─────────┘     └────┬────┘
     │                                               │
     │◀──────────── continue_cycle() ───────────────┘
     │
     │ terminate()
     ▼
┌─────────┐
│  DONE   │
└─────────┘
```

### State Transitions

| From | To | Trigger | Action |
|------|-----|---------|--------|
| INIT | PLAN | start_session() | Measure baseline |
| PLAN | DO | plan_complete() | Select agents |
| DO | CHECK | do_complete() | All agents done |
| CHECK | ACT | check_complete() | Calculate delta |
| ACT | PLAN | continue_cycle() | Increment cycle |
| ACT | DONE | terminate() | Generate report |

---

## Termination Logic

### Decision Tree

```python
def should_terminate(state):
    # Priority 1: Goal achieved
    if state.uqs >= state.target_uqs:
        return (True, "GOAL_ACHIEVED")

    # Priority 2: Diminishing returns
    if is_diminishing(state.deltas, state.threshold, state.count):
        return (True, "DIMINISHING_RETURNS")

    # Priority 3: Max cycles
    if state.cycle >= state.max_cycles:
        return (True, "MAX_CYCLES")

    # Priority 4: User stop
    if state.user_requested_stop:
        return (True, "USER_STOP")

    # Continue
    return (False, None)
```

### Termination Reasons

| Reason | Code | When | UX Message |
|--------|------|------|------------|
| Goal achieved | GOAL_ACHIEVED | UQS >= target | "Target quality reached!" |
| Diminishing returns | DIMINISHING_RETURNS | Low delta consecutive | "Further improvement would be inefficient" |
| Max cycles | MAX_CYCLES | cycle >= max | "Maximum iterations reached" |
| User stop | USER_STOP | Manual request | "Session ended by user" |
| Blocked | BLOCKED | Unrecoverable error | "Cannot continue due to blockers" |

### Termination Overrides

**ON_EXCEED_CYCLES:**
When max cycles reached but UQS is still below target.

```python
def handle_max_cycles(state):
    if state.uqs < state.target_uqs:
        # Ask user
        response = ask_user(
            question="Max cycles reached. Continue?",
            options=[
                "Stop here",
                "One more cycle",
                "Switch to INTENSIVE mode"
            ]
        )

        if response == "One more cycle":
            state.max_cycles += 1
            return continue_cycle(state)
        elif response == "Switch to INTENSIVE":
            state.mode = INTENSIVE
            state.max_cycles = 5
            return continue_cycle(state)

    return terminate(state, "MAX_CYCLES")
```

**ON_DIMINISHING_OVERRIDE:**
When user wants to continue despite diminishing returns.

```python
def handle_diminishing_override(state):
    response = ask_user(
        question="Diminishing returns detected. Continue anyway?",
        options=[
            "Stop (recommended)",
            "Continue one more cycle",
            "Continue until max cycles"
        ]
    )

    if response == "Stop":
        return terminate(state, "DIMINISHING_RETURNS")
    elif response == "Continue one":
        state.diminishing_count = 0  # Reset
        return continue_cycle(state)
    else:
        state.ignore_diminishing = True
        return continue_cycle(state)
```

---

## Diminishing Returns Detection

### Algorithm

```python
class DiminishingDetector:
    def __init__(self, threshold=5, consecutive_required=2):
        self.threshold = threshold
        self.consecutive_required = consecutive_required
        self.consecutive_count = 0

    def check(self, delta):
        if delta < self.threshold:
            self.consecutive_count += 1
        else:
            self.consecutive_count = 0

        return self.consecutive_count >= self.consecutive_required

    def reset(self):
        self.consecutive_count = 0
```

### Visualization

```
Delta over cycles:

Delta
  │
20├──●
  │   ╲
15├────●
  │     ╲
10├──────●
  │       ╲
 5├────────●────●   ← Threshold
  │         ╲  /
 0├──────────●●     ← Diminishing (2 consecutive < 5%)
  └──┴──┴──┴──┴──
     1  2  3  4  5   Cycle
```

### Threshold Tuning

| Scenario | Recommended Threshold |
|----------|----------------------|
| Large codebase | 3% (harder to improve) |
| Small codebase | 7% (easier to improve) |
| Security-focused | 1% (every bit matters) |
| Documentation | 10% (diminishing faster) |

---

## Cycle History

### Data Structure

```python
@dataclass
class CycleRecord:
    cycle_number: int
    start_time: datetime
    end_time: datetime
    start_uqs: float
    end_uqs: float
    delta: float
    agents_used: List[str]
    actions_taken: List[Action]
    blockers: List[Blocker]
    learnings: List[str]
```

```python
@dataclass
class SessionRecord:
    session_id: str
    start_time: datetime
    end_time: datetime
    mode: str
    target_uqs: float
    initial_uqs: float
    final_uqs: float
    total_delta: float
    cycles: List[CycleRecord]
    termination_reason: str
    summary_learnings: List[str]
```

### History File Format

File: `.agents/hone.md`

```markdown
# Hone Session History

## Session: 2024-01-15T10:30:00Z

### Configuration
| Setting | Value |
|---------|-------|
| Mode | STANDARD |
| Target UQS | 80 |
| Max Cycles | 3 |
| Domains | code, tests, docs |

### Quality Journey
```
Start: 65.0 (Fair)
  │
Cycle 1: +11.5 → 76.5
  │
Cycle 2: +4.7 → 81.2
  │
End: 81.2 (Good) ✓
```

### Cycle Details

#### Cycle 1 (10:30 - 10:38)
| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| UQS | 65.0 | 76.5 | +11.5 |
| Judge | 70 | 85 | +15 |
| Radar | 55 | 70 | +15 |
| Zen | 60 | 72 | +12 |

**Actions:**
- Judge: Found 2 HIGH, 3 MEDIUM issues
- Builder: Fixed 2 HIGH issues
- Radar: Added 8 tests, coverage +15%
- Zen: Reduced avgCC from 15 to 12

**Learnings:**
- High complexity correlated with low coverage in auth module
- Builder fix for null check enabled cleaner Zen refactoring

#### Cycle 2 (10:38 - 10:45)
| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| UQS | 76.5 | 81.2 | +4.7 |
| Judge | 85 | 92 | +7 |
| Radar | 70 | 78 | +8 |
| Zen | 72 | 80 | +8 |

**Actions:**
- Judge: Found 1 MEDIUM issue
- Builder: Fixed MEDIUM issue
- Radar: Added 4 edge case tests
- Zen: Extracted utility functions

**Learnings:**
- Edge case tests caught potential regression
- Function extraction improved testability

### Termination
| Field | Value |
|-------|-------|
| Reason | GOAL_ACHIEVED |
| Final UQS | 81.2 |
| Target UQS | 80 |
| Total Cycles | 2 |
| Total Delta | +16.2 |

### Session Learnings
1. Pattern: Judge → Builder → Zen → Radar most effective
2. Insight: Address complexity before adding tests
3. Recommendation: Start with QUICK mode for small modules

---

## Session: 2024-01-14T14:00:00Z
[Previous session...]
```

---

## Progress Tracking

### Real-time Progress Display

```markdown
## Hone Progress

**Session:** 2024-01-15T10:30:00Z
**Mode:** STANDARD
**Target:** 80

### Current Status
| Cycle | Phase | Progress |
|-------|-------|----------|
| 1 | DO | ████████░░ 80% |

### Agent Progress (Cycle 1)
| Agent | Status | Time |
|-------|--------|------|
| Judge | ✓ Done | 2:15 |
| Builder | ● Running | 1:30... |
| Zen | ○ Pending | - |
| Radar | ○ Pending | - |

### Quality Trend
```
UQS: 65 ──(+?)──▶ ?
         │
         ├── Judge: 70 → 85 (+15)
         ├── Radar: 55 → ? (+?)
         └── Zen: 60 → ? (+?)
```
```

### Completion Estimates

```python
def estimate_completion(state):
    avg_cycle_time = mean(state.cycle_times) if state.cycle_times else 300
    remaining_cycles = estimate_remaining_cycles(state)
    estimated_time = avg_cycle_time * remaining_cycles

    return {
        "estimated_remaining_cycles": remaining_cycles,
        "estimated_time_seconds": estimated_time,
        "confidence": calculate_confidence(state)
    }

def estimate_remaining_cycles(state):
    if state.uqs >= state.target_uqs:
        return 0

    avg_delta = mean(state.deltas) if state.deltas else 10
    gap = state.target_uqs - state.uqs
    estimated = ceil(gap / avg_delta)

    return min(estimated, state.max_cycles - state.cycle)
```

---

## Learning Accumulation

### Per-Cycle Learnings

After each cycle, extract:

1. **What improved most?** → Prioritize that agent
2. **What didn't improve?** → Consider skipping or escalating
3. **Any surprises?** → Adjust expectations
4. **Blockers encountered?** → Plan for next time

### Cross-Session Patterns

Track patterns across sessions:

```python
PATTERN_DB = {
    "judge_before_zen": {
        "description": "Running Judge before Zen finds more issues",
        "confidence": 0.85,
        "observations": 12
    },
    "complexity_coverage_correlation": {
        "description": "High complexity modules have low coverage",
        "confidence": 0.72,
        "observations": 8
    }
}

def apply_learnings(state):
    for pattern, data in PATTERN_DB.items():
        if data.confidence > 0.7:
            apply_pattern(state, pattern)
```

### Learning Output Format

```yaml
learnings:
  cycle_specific:
    - "Radar found more gaps after Zen simplified code"
    - "Builder fix for issue J-001 was straightforward"
  cross_cycle:
    - "Pattern confirmed: complexity reduction enables better testing"
  recommendations:
    - agent_order: ["judge", "builder", "zen", "radar"]
    - skip_if_green: ["quill"]
    - escalate_if_stuck: ["atlas"]
```

---

## Checkpoint Management

### Checkpoint Creation Points

| Event | Create Checkpoint? | Reason |
|-------|-------------------|--------|
| Session start | Yes | Baseline |
| Cycle start | Yes | Rollback point |
| Before risky agent | Yes | Safety |
| After successful agent | Optional | Granular recovery |
| Cycle end | Yes | Delta calculation |

### Checkpoint Storage

```python
class Checkpoint:
    id: str
    cycle: int
    timestamp: datetime
    git_ref: str
    uqs: float
    agent_states: Dict[str, Any]
    metadata: Dict[str, Any]

def save_checkpoint(checkpoint):
    path = f".agents/hone_checkpoints/{checkpoint.id}.json"
    write_json(path, checkpoint.to_dict())

def load_checkpoint(checkpoint_id):
    path = f".agents/hone_checkpoints/{checkpoint_id}.json"
    data = read_json(path)
    return Checkpoint.from_dict(data)
```

### Checkpoint Cleanup

```python
def cleanup_checkpoints(session_id, keep_final=True):
    """Remove intermediate checkpoints after successful session."""
    checkpoints = list_checkpoints(session_id)

    for cp in checkpoints:
        if keep_final and cp.is_final:
            continue
        delete_checkpoint(cp.id)
```

---

## Error Recovery

### Recoverable Errors

| Error | Recovery Strategy |
|-------|-------------------|
| Agent timeout | Skip agent, note in report |
| Agent error | Retry once, then skip |
| Partial failure | Continue with remaining agents |
| Low delta | Continue unless diminishing |

### Non-Recoverable Errors

| Error | Action |
|-------|--------|
| Build failure | Rollback, report BLOCKED |
| Test regression | Rollback, report BLOCKED |
| All agents failed | Report BLOCKED |
| Context overflow | Summarize and retry |

### Recovery Protocol

```python
def handle_error(error, state):
    if error.is_recoverable:
        if error.retry_count < MAX_RETRIES:
            return retry_action(error.action)
        else:
            return skip_action(error.action)

    else:
        # Non-recoverable
        checkpoint = get_last_checkpoint(state)
        rollback_to(checkpoint)
        return terminate(state, "BLOCKED", error.message)
```

---

## Metrics Export

### Session Summary Export

```json
{
  "session_id": "hone_2024-01-15T10:30:00Z",
  "result": "SUCCESS",
  "metrics": {
    "initial_uqs": 65.0,
    "final_uqs": 81.2,
    "total_delta": 16.2,
    "cycles_completed": 2,
    "total_time_seconds": 912,
    "agents_invoked": ["judge", "builder", "zen", "radar"],
    "issues_found": 5,
    "issues_fixed": 5
  },
  "per_domain": {
    "code_correctness": {"before": 70, "after": 92, "delta": 22},
    "complexity": {"before": 60, "after": 80, "delta": 20},
    "test_coverage": {"before": 55, "after": 78, "delta": 23}
  },
  "termination": {
    "reason": "GOAL_ACHIEVED",
    "at_cycle": 2
  }
}
```

### CI Integration Format

```yaml
# For CI/CD pipeline integration
hone_result:
  status: PASS  # PASS if final_uqs >= target_uqs, else FAIL
  score: 81.2
  target: 80
  improvement: 16.2
  cycles: 2
  duration: 15m 12s
```
