# Handoff Formats

Input and output handoff templates for Magi's inter-agent collaboration.

---

## Input Handoffs (Receiving)

### ATLAS_TO_MAGI_HANDOFF

Architecture decision requests from Atlas.

```yaml
ATLAS_TO_MAGI_HANDOFF:
  Decision_Type: architecture
  Context:
    system: "[System/project name]"
    current_state: "[Current architecture description]"
    constraints:
      - "[Technical constraint 1]"
      - "[Technical constraint 2]"
  Options:
    - option_id: A
      name: "[Option A name]"
      description: "[Option A description]"
      pros: ["Pro 1", "Pro 2"]
      cons: ["Con 1", "Con 2"]
      estimated_effort: "[S/M/L/XL]"
    - option_id: B
      name: "[Option B name]"
      description: "[Option B description]"
      pros: ["Pro 1", "Pro 2"]
      cons: ["Con 1", "Con 2"]
      estimated_effort: "[S/M/L/XL]"
  Stakeholders:
    - "[Team/person affected]"
  Timeline: "[Decision deadline if any]"
  Irreversibility: "[Low/Medium/High]"
```

---

### ARENA_TO_MAGI_HANDOFF

Variant comparison results from Arena for final selection.

```yaml
ARENA_TO_MAGI_HANDOFF:
  Decision_Type: trade-off
  Context:
    task: "[Implementation task]"
    run_id: "[aiw run ID]"
    engines_used: ["claude-code", "codex-cli"]
  Variants:
    - variant_id: "[ID]"
      engine: "[Engine name]"
      approach: "[Approach summary]"
      scores:
        correctness: [1-5]
        code_quality: [1-5]
        performance: [1-5]
        safety: [1-5]
        simplicity: [1-5]
      strengths: ["Strength 1", "Strength 2"]
      weaknesses: ["Weakness 1", "Weakness 2"]
    - variant_id: "[ID]"
      engine: "[Engine name]"
      approach: "[Approach summary]"
      scores:
        correctness: [1-5]
        code_quality: [1-5]
        performance: [1-5]
        safety: [1-5]
        simplicity: [1-5]
      strengths: ["Strength 1", "Strength 2"]
      weaknesses: ["Weakness 1", "Weakness 2"]
  Arena_Recommendation: "[Variant ID if any]"
  Suggested_Deliberation_Mode: "simple | engine | auto"
  Cost_Report:
    total: "[Cost]"
    per_variant: "[Breakdown]"
```

---

### BRIDGE_TO_MAGI_HANDOFF

Stakeholder alignment requests from Bridge.

```yaml
BRIDGE_TO_MAGI_HANDOFF:
  Decision_Type: strategy | priority
  Context:
    stakeholder_input: "[Summary of stakeholder requirements]"
    business_context: "[Market/business context]"
    technical_context: "[Technical constraints summary]"
  Conflicting_Requirements:
    - requirement: "[Requirement 1]"
      stakeholder: "[Who wants this]"
      priority: "[Their stated priority]"
    - requirement: "[Requirement 2]"
      stakeholder: "[Who wants this]"
      priority: "[Their stated priority]"
  Constraints:
    budget: "[Budget constraints]"
    timeline: "[Timeline constraints]"
    team_capacity: "[Team constraints]"
  Requested_Output: "[What Bridge needs: priority order, strategic direction, etc.]"
```

---

### WARDEN_TO_MAGI_HANDOFF

Quality gate assessments from Warden.

```yaml
WARDEN_TO_MAGI_HANDOFF:
  Decision_Type: go-no-go
  Context:
    release_version: "[Version]"
    release_type: "[Major/Minor/Patch/Hotfix]"
    target_date: "[Date]"
  Quality_Assessment:
    test_pass_rate: "[Percentage]"
    code_coverage: "[Percentage]"
    critical_bugs: [count]
    high_bugs: [count]
    medium_bugs: [count]
    performance_status: "[Within SLA / Degraded / Failed]"
    security_status: "[Clear / Advisory / Blocking]"
  Blockers:
    - "[Blocker 1 description]"
    - "[Blocker 2 description]"
  Warden_Recommendation: "[GO / GO_WITH_CONDITIONS / HOLD / NO_GO]"
  Conditions: ["Condition 1 if any", "Condition 2 if any"]
```

---

### NEXUS_TO_MAGI_HANDOFF

Complex decision routing from Nexus.

```yaml
NEXUS_TO_MAGI_HANDOFF:
  Decision_Type: "[architecture | trade-off | go-no-go | strategy | priority]"
  Context:
    original_task: "[User's original request]"
    chain_so_far: ["Agent1 → Agent2 → Magi"]
    accumulated_context:
      - agent: "[Agent name]"
        findings: "[Key findings]"
      - agent: "[Agent name]"
        findings: "[Key findings]"
  Decision_Required: "[Specific decision to make]"
  Options_Identified: ["Option 1", "Option 2", "Option 3"]
  Urgency: "[Low/Medium/High/Critical]"
  Reversibility: "[Low/Medium/High]"
```

---

## Output Handoffs (Sending)

### MAGI_TO_BUILDER_HANDOFF

Implementation decisions for Builder.

```yaml
MAGI_TO_BUILDER_HANDOFF:
  Verdict:
    decision: "[Selected approach]"
    consensus: "[3-0 | 2-1 | user-decided]"
    confidence: [weighted score]
    deliberation_mode: "[simple | engine]"
    deliberators: "[Logos/Pathos/Sophia | Claude/Codex/Gemini]"
  Implementation_Guidance:
    approach: "[Detailed approach description]"
    key_requirements:
      - "[Requirement 1]"
      - "[Requirement 2]"
    constraints:
      - "[Constraint 1]"
      - "[Constraint 2]"
    warnings:
      - "[Dissent concern to monitor]"
  Quality_Criteria:
    - "[Acceptance criterion 1]"
    - "[Acceptance criterion 2]"
  Risk_Mitigations:
    - risk: "[Identified risk]"
      mitigation: "[Required mitigation]"
```

---

### MAGI_TO_LAUNCH_HANDOFF

Release decisions for Launch/deployment.

```yaml
MAGI_TO_LAUNCH_HANDOFF:
  Verdict:
    decision: "[GO | GO_WITH_CONDITIONS | HOLD | NO_GO]"
    consensus: "[3-0 | 2-1 | user-decided]"
    confidence: [weighted score]
    deliberation_mode: "[simple | engine]"
    deliberators: "[Logos/Pathos/Sophia | Claude/Codex/Gemini]"
  Conditions:
    - condition: "[Condition 1]"
      owner: "[Who must fulfill]"
      deadline: "[When]"
    - condition: "[Condition 2]"
      owner: "[Who must fulfill]"
      deadline: "[When]"
  Risk_Register:
    - risk: "[Risk 1]"
      severity: "[Low/Medium/High]"
      mitigation: "[Mitigation plan]"
      monitor: "[What to watch]"
  Rollback_Plan:
    trigger: "[When to rollback]"
    procedure: "[How to rollback]"
    owner: "[Who executes rollback]"
  Dissent_Record:
    perspective: "[If any dissented]"
    concern: "[Their concern]"
    mitigation: "[How it's addressed]"
```

---

### MAGI_TO_ATLAS_HANDOFF

Architecture decision results for Atlas.

```yaml
MAGI_TO_ATLAS_HANDOFF:
  Verdict:
    decision: "[Selected architecture option]"
    consensus: "[3-0 | 2-1 | user-decided]"
    confidence: [weighted score]
    deliberation_mode: "[simple | engine]"
    deliberators: "[Logos/Pathos/Sophia | Claude/Codex/Gemini]"
  ADR_Summary:
    title: "[Decision title]"
    status: "[Accepted | Conditional | Rejected]"
    context: "[Decision context summary]"
    decision: "[The decision made]"
    consequences:
      positive: ["Consequence 1", "Consequence 2"]
      negative: ["Consequence 1", "Consequence 2"]
      neutral: ["Consequence 1"]
  Implementation_Notes:
    - "[Key implementation guidance]"
  Review_Triggers:
    - "[When to revisit this decision]"
```

---

### MAGI_TO_SHERPA_HANDOFF

Prioritized task lists for Sherpa.

```yaml
MAGI_TO_SHERPA_HANDOFF:
  Verdict:
    decision: "Priority order established"
    consensus: "[3-0 | 2-1 | user-decided]"
    confidence: [weighted score]
    deliberation_mode: "[simple | engine]"
    deliberators: "[Logos/Pathos/Sophia | Claude/Codex/Gemini]"
  Priority_List:
    - rank: 1
      item: "[Highest priority item]"
      rationale: "[Why first]"
      composite_score: [score]
    - rank: 2
      item: "[Second priority item]"
      rationale: "[Why second]"
      composite_score: [score]
    - rank: 3
      item: "[Third priority item]"
      rationale: "[Why third]"
      composite_score: [score]
  Deferred_Items:
    - item: "[Deferred item]"
      reason: "[Why deferred]"
      revisit_trigger: "[When to reconsider]"
  Dependencies:
    - "[Item X must complete before Item Y]"
```

---

### MAGI_TO_NEXUS_HANDOFF

Decision results returned to Nexus hub.

```yaml
MAGI_TO_NEXUS_HANDOFF:
  Verdict:
    decision_type: "[architecture | trade-off | go-no-go | strategy | priority]"
    decision: "[The decision made]"
    consensus: "[3-0 | 2-1 | 1-1-1 | 0-3]"
    confidence: [weighted score]
    deliberation_mode: "[simple | engine]"
    deliberators: "[Logos/Pathos/Sophia | Claude/Codex/Gemini]"
  Deliberation_Summary:  # Simple Mode
    logos: "[Position + key rationale]"
    pathos: "[Position + key rationale]"
    sophia: "[Position + key rationale]"
  Engine_Summary:  # Engine Mode (when deliberation_mode: engine)
    claude: "[Position + key rationale]"
    codex: "[Position + key rationale]"
    gemini: "[Position + key rationale]"
  Action_Items:
    - action: "[Required action]"
      assigned_to: "[Agent or person]"
      deadline: "[When]"
  Risk_Register:
    - "[Key risk with mitigation]"
  Suggested_Next_Agent: "[AgentName]"
  Reason: "[Why this agent next]"
```
