# Handoff Formats

Input and output handoff templates for Arena's inter-agent collaboration.

---

## Input Handoffs (Receiving)

### SHERPA_TO_ARENA_HANDOFF

Task decomposed into atomic steps, ready for multi-variant implementation.

```yaml
SHERPA_TO_ARENA_HANDOFF:
  Task: "[Task name]"
  Atomic_Steps:
    - step_id: 1
      description: "[Step description]"
      estimated_complexity: "[S/M/L]"
  Recommended_Variants: "[N]"
  Recommended_Engine: "[codex / gemini / both]"
  Recommended_Mode: "[Solo / Team]"
  Quality_Requirements:
    - "[Requirement 1]"
    - "[Requirement 2]"
```

### SCOUT_TO_ARENA_HANDOFF

Bug investigation complete, multiple fix approaches identified for comparison.

```yaml
SCOUT_TO_ARENA_HANDOFF:
  Bug_Analysis:
    root_cause: "[Root cause description]"
    impact: "[Impact assessment]"
    affected_files:
      - "[File path 1]"
      - "[File path 2]"
  Fix_Approaches:
    - approach_id: A
      description: "[Approach A description]"
      risk: "[Low/Medium/High]"
    - approach_id: B
      description: "[Approach B description]"
      risk: "[Low/Medium/High]"
  Recommended_Variants: "[N]"
  Recommended_Engine: "[codex / gemini / both]"
  Recommended_Mode: "[Solo / Team]"
```

### SPARK_TO_ARENA_HANDOFF

Feature proposal with multiple implementation options for parallel exploration.

```yaml
SPARK_TO_ARENA_HANDOFF:
  Feature_Proposal:
    name: "[Feature name]"
    description: "[Feature description]"
    value_proposition: "[Why this feature]"
  Implementation_Options:
    - option_id: 1
      approach: "[Approach description]"
      complexity: "[S/M/L]"
    - option_id: 2
      approach: "[Approach description]"
      complexity: "[S/M/L]"
  Recommended_Variants: "[N]"
  Recommended_Engine: "[codex / gemini / both]"
  Recommended_Mode: "[Solo / Team]"
```

### NEXUS_TO_ARENA_HANDOFF

Task routed from Nexus orchestrator with execution preferences.

```yaml
NEXUS_TO_ARENA_HANDOFF:
  Task: "[Task name]"
  Specification:
    description: "[What to implement]"
    acceptance_criteria:
      - "[Criterion 1]"
      - "[Criterion 2]"
    error_handling: "[Error handling requirements, if any]"
    performance_constraints: "[Performance requirements, if any]"
    security_constraints: "[Security requirements, if any]"
  Execution_Preferences:
    Mode: "[Solo / Team / Auto]"  # Auto = Arena selects based on task characteristics
    Engine: "[codex / gemini / both / any]"  # any = Arena selects based on availability
    Variants: "[N or auto]"  # auto = Arena decides count
    Max_Cost: "[small / medium / large / unlimited]"
    Self_Competition_Allowed: true  # Whether same-engine variants are acceptable
  Quality_Requirements:
    min_score: "[Minimum acceptable weighted score, e.g., 3.0]"
    weight_overrides:  # Optional — override default evaluation weights
      safety: 30  # e.g., for security-critical tasks
      performance: 30  # e.g., for performance-critical tasks
    must_pass_review: true  # Require REVIEW gate before adoption
  Chain_Context:
    Previous_Agent: "[Agent name or null]"
    Previous_Output_Summary: "[What the previous agent produced]"
    Position: "[Step X of Y]"
    Next_Expected: "[Next agent or DONE]"
  Scope_Hints:  # Optional — pre-identified files from upstream agents
    likely_files:
      - "[File path 1]"
      - "[File path 2]"
    forbidden_files:
      - "[File path]"
```

**Auto Paradigm behavior:** When `Mode` is `"Auto"`, Arena selects the paradigm:
- **COMPETE** if: task is comparison-oriented, single cohesive spec, quality uncertainty
- **COLLABORATE** if: task naturally decomposes into independent subtasks with different engine strengths

**Auto Mode behavior:** When `Mode` is `"Auto"`, Arena selects the execution mode:
- **Quick Mode** if: ≤ 3 likely_files, ≤ 2 acceptance_criteria, task appears small-scope (COMPETE only)
- **Solo Mode** if: 2 variants/subtasks sufficient, moderate complexity
- **Team Mode** if: 3+ variants/subtasks needed, high complexity, or parallelism benefits outweigh cost

**Engine selection with `"any"`:** When `Engine` is `"any"`, Arena checks availability (`which codex`, `which gemini`) and selects based on Engine Selection Heuristics. If only 1 engine is available, Self-Competition is used automatically (COMPETE) or same-engine decomposition (COLLABORATE).

---

## Output Handoffs (Sending)

### ARENA_TO_GUARDIAN_HANDOFF

Implementation selected (COMPETE) or integrated (COLLABORATE) and ready for PR preparation.

```yaml
ARENA_TO_GUARDIAN_HANDOFF:
  Implementation:
    session_id: "[Arena session ID]"
    paradigm: "[COMPETE / COLLABORATE]"
    mode: "[Solo / Team / Quick]"
    # --- COMPETE fields ---
    selected_variant: "[variant_id]"              # COMPETE only
    selected_engine: "[codex / gemini]"            # COMPETE only
    variant_branch: "arena/variant-[engine]"       # COMPETE only
    selection_rationale: "[Why this variant was chosen]"  # COMPETE only
    # --- COLLABORATE fields ---
    subtasks_completed: "[N/M]"                    # COLLABORATE only
    integration_status: "[CLEAN / CONFLICTS_RESOLVED]"  # COLLABORATE only
    subtask_summary:                               # COLLABORATE only
      - id: "[subtask_id]"
        engine: "[codex / gemini]"
        branch: "arena/task-[subtask_id]"
        status: "[PASS / FAIL]"
    integration_rationale: "[How subtasks were merged]"  # COLLABORATE only
  Files_Changed:
    - path: "[File path]"
      change_type: "[Added/Modified/Deleted]"
      summary: "[Change summary]"
  Comparison_Summary:           # COMPETE only
    total_variants: "[N]"
    engines_used:
      - "[codex]"
      - "[gemini]"
    evaluation_criteria: "[Criteria used]"
  Team_Info:  # Only present in Team Mode
    team_name: "[arena-{task_id}]"
    teammate_count: "[N]"
  Test_Status: "[PASS/FAIL/PENDING]"
  Ready_For_Review: "[true/false]"
```

### ARENA_TO_RADAR_HANDOFF

Implementation adopted (COMPETE) or integrated (COLLABORATE), test coverage needed.

```yaml
ARENA_TO_RADAR_HANDOFF:
  Implementation:
    session_id: "[Arena session ID]"
    paradigm: "[COMPETE / COLLABORATE]"
    mode: "[Solo / Team / Quick]"
    # COMPETE
    selected_variant: "[variant_id]"           # COMPETE only
    selected_engine: "[codex / gemini]"        # COMPETE only
    variant_branch: "arena/variant-[engine]"   # COMPETE only
    # COLLABORATE
    subtasks_completed: "[N/M]"                # COLLABORATE only
    subtask_engines:                           # COLLABORATE only
      - id: "[subtask_id]"
        engine: "[codex / gemini]"
        files: ["[file paths]"]
    files_changed:
      - "[File path 1]"
      - "[File path 2]"
  Test_Requirements:
    - requirement: "[What to test]"
      priority: "[High/Medium/Low]"
  Edge_Cases_Identified:
    - "[Edge case 1]"
    - "[Edge case 2]"
  Integration_Test_Needs:                      # COLLABORATE only
    - "[Cross-subtask interaction to verify]"
  Variant_Comparison:                          # COMPETE only
    - variant_id: "[ID]"
      engine: "[codex / gemini]"
      approach_summary: "[Summary]"
      testability_notes: "[Notes for testing]"
```

### ARENA_TO_JUDGE_HANDOFF

Request code review of selected variant.

```yaml
ARENA_TO_JUDGE_HANDOFF:
  Implementation:
    session_id: "[Arena session ID]"
    mode: "[Solo / Team]"
    selected_variant: "[variant_id]"
    selected_engine: "[codex / gemini]"
    variant_branch: "arena/variant-[engine]"
    selection_rationale: "[Brief rationale]"
  Review_Focus:
    - "[Area needing particular attention]"
  Files_To_Review:
    - "[File path 1]"
    - "[File path 2]"
  Context:
    total_variants: "[N]"
    rejected_approaches: "[Why alternatives were rejected]"
```

### ARENA_TO_SENTINEL_HANDOFF

Request security review of selected variant.

```yaml
ARENA_TO_SENTINEL_HANDOFF:
  Implementation:
    session_id: "[Arena session ID]"
    mode: "[Solo / Team]"
    selected_variant: "[variant_id]"
    selected_engine: "[codex / gemini]"
    variant_branch: "arena/variant-[engine]"
  Security_Concerns:
    - "[Identified concern 1]"
    - "[Identified concern 2]"
  Files_Changed:
    - "[File path 1]"
  Context:
    spec_security_requirements: "[From original spec]"
    variant_safety_score: "[Score from evaluation]"
```

### ARENA_TO_BUILDER_HANDOFF

Arena cannot complete the task (all variants disqualified, engines unavailable, or repeated failures). Escalate to Builder for manual implementation.

```yaml
ARENA_TO_BUILDER_HANDOFF:
  Escalation:
    session_id: "[Arena session ID]"
    paradigm: "[COMPETE / COLLABORATE]"
    mode: "[Solo / Team / Quick]"
    reason: "[ALL_DISQUALIFIED / ENGINE_UNAVAILABLE / REPEATED_FAILURE]"
    attempts_made: "[N]"
    best_score_achieved: "[Score or N/A]"
  Original_Task:
    description: "[Original task description]"
    acceptance_criteria:
      - "[Criterion 1]"
      - "[Criterion 2]"
    scope_files:
      - "[File path 1]"
      - "[File path 2]"
  Attempted_Approaches:
    - variant_id: "[ID]"
      engine: "[codex / gemini]"
      approach_summary: "[What was tried]"
      failure_reason: "[Why it failed evaluation]"
      score: "[Weighted score or DISQUALIFIED]"
  Partial_Work:
    usable_branches: "[List of branches with partial progress, or none]"
    salvageable_elements: "[Specific code/logic that can be reused]"
  Recommendations:
    suggested_approach: "[Arena's recommendation based on what it learned]"
    pitfalls_to_avoid: "[What didn't work and why]"
  Chain_Context:
    Previous_Agent: "[Agent name or null]"
    Next_Expected: "[Next agent after Builder, or DONE]"
```
