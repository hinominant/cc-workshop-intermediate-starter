# Handoff Formats

Input and output handoff templates for Researcher's inter-agent collaboration.

---

## Output Handoffs (Sending)

### RESEARCHER_TO_ECHO_HANDOFF

Personas ready for UI validation.

```yaml
RESEARCHER_TO_ECHO_HANDOFF:
  Research_Complete:
    project: "[Project Name]"
    participants: "[N] people"
    methods: "[Methods used]"
  Personas_Created:
    - name: "[Persona name]"
      type_for_echo: "[Newbie / Power User / Skeptic / etc.]"
      key_characteristics:
        - "[Characteristic 1]"
        - "[Characteristic 2]"
      test_focus:
        - "[Flow to verify with this persona]"
      emotion_triggers:
        delighted_by: "[What makes them happy]"
        frustrated_by: "[What frustrates them]"
  Suggested_Echo_Tasks:
    - "Validate [flow 1] with [persona 1]"
    - "Validate [flow 2] with [persona 2]"
  Journey_Map_Data:
    format: "Mermaid (for Canvas)"
    content: "[Journey map reference]"
```

### RESEARCHER_TO_VOICE_HANDOFF

Qualitative insights ready for quantitative validation.

```yaml
RESEARCHER_TO_VOICE_HANDOFF:
  Qualitative_Insights:
    - "[Hypothesis from research]"
  Quantitative_Validation_Needed:
    - measure: "[Hypothesis 1] occurrence rate"
    - measure: "[Hypothesis 2] priority quantification"
  Suggested_Survey_Questions:
    - question: "[Question text]"
      type: "[Scale / Multiple choice / Open]"
    - question: "[Question text]"
      type: "[Scale / Multiple choice / Open]"
  Target_Sample:
    segment: "[Target user segment]"
    size: "[Recommended sample size]"
```

### RESEARCHER_TO_SPARK_HANDOFF

User needs identified, feature ideation needed.

```yaml
RESEARCHER_TO_SPARK_HANDOFF:
  User_Needs_Identified:
    - need: "[Need 1]"
      description: "[Description]"
      evidence: "Mentioned by [M] of [N] participants"
    - need: "[Need 2]"
      description: "[Description]"
      evidence: "Mentioned by [M] of [N] participants"
  Unmet_Needs:
    - need: "[Unmet need 1]"
      current_pain: "[Current problem]"
    - need: "[Unmet need 2]"
      current_pain: "[Current problem]"
  Feature_Opportunity_Areas:
    - area: "[Area 1]"
      user_voice: "[User quote/feedback]"
    - area: "[Area 2]"
      user_voice: "[User quote/feedback]"
  Constraints_From_Research:
    - "[Constraint 1]"
    - "[Constraint 2]"
```

### RESEARCHER_TO_CANVAS_HANDOFF

Research outputs ready for visualization.

```yaml
RESEARCHER_TO_CANVAS_HANDOFF:
  Visualization_Request:
    type: "[journey_map / persona_map / affinity_diagram]"
    data_source: "[Research report / Journey map data]"
  Content:
    personas: "[List of personas]"
    journey_phases: "[List of phases]"
    key_moments: "[Critical touchpoints]"
  Output_Format: "mermaid"
```

---

## Input Handoffs (Receiving)

### VOICE_TO_RESEARCHER_HANDOFF

Feedback data collected, deep analysis needed.

```yaml
VOICE_TO_RESEARCHER_HANDOFF:
  Feedback_Data:
    source: "[NPS / Survey / Reviews]"
    volume: "[N] responses"
    time_period: "[Date range]"
  Initial_Analysis:
    sentiment_distribution: "[Positive/Neutral/Negative %]"
    top_themes: "[Theme list]"
  Deep_Analysis_Needed:
    - "Theme exploration and sub-theme identification"
    - "Persona-level segmentation of feedback"
    - "Actionable insight extraction"
```

### TRACE_TO_RESEARCHER_HANDOFF

Behavioral patterns extracted, persona validation needed.

```yaml
TRACE_TO_RESEARCHER_HANDOFF:
  Behavioral_Patterns:
    - pattern: "[Pattern name]"
      frequency: "[Occurrence rate]"
      user_segment: "[Segment]"
  Validation_Needed:
    - "Confirm pattern aligns with existing personas"
    - "Identify new user segments if any"
    - "Provide qualitative context for behavioral data"
```

---

## Output Report Format

Standard format for Researcher completion reports.

```markdown
## Research: [Project Name]

### Overview
**Methods:** [Interview / Usability test / Survey]
**Participants:** [N] people
**Period:** [Date range]

### Deliverables
| Deliverable | Description |
|-------------|-------------|
| Personas | [N] personas created |
| Journey maps | [N] maps created |
| Insight cards | [N] insights extracted |
| Research report | Complete report with recommendations |

### Key Insights
1. [Insight 1] (Confidence: High/Medium/Low)
2. [Insight 2] (Confidence: High/Medium/Low)

### Recommended Next Steps
- [ ] Echo: Validate [flow] with [persona]
- [ ] Spark: Ideate features for [unmet need]
- [ ] Voice: Quantify [hypothesis] with survey
```
