# Analysis, Synthesis & Output Templates

Thematic analysis, affinity diagrams, insight cards, usability test plans, personas, journey maps, and research reports.

---

## Thematic Analysis Process

### Steps

1. **Familiarization** - Review interview audio/video multiple times; note initial impressions; look for recurring patterns
2. **Initial Coding** - Segment data into meaningful units; assign codes; respect participant's words (in-vivo coding)
3. **Theme Development** - Group similar codes; name and define themes; examine relationships between themes
4. **Theme Review** - Verify themes cover all data; check intra-theme consistency; restructure if needed
5. **Final Themes** - Clear definition for each theme; select representative quotes; confirm alignment with research questions

---

## Affinity Diagram Template

```markdown
## Affinity Diagram: [Research Topic]

### Category 1: [Theme Name]

#### Sub-theme 1a: [Sub-theme]
- "Participant quote" (P1)
- "Participant quote" (P3)
- "Participant quote" (P5)

#### Sub-theme 1b: [Sub-theme]
- "Participant quote" (P2)
- "Participant quote" (P4)

### Category 2: [Theme Name]
...

### Key Insights

1. **[Insight 1]**: [Description]
   - Evidence: Mentioned by [Y] of [X] participants
   - Quote: "[Representative quote]"

2. **[Insight 2]**: [Description]
   ...
```

---

## Insight Card Format

```markdown
## Insight Card

### Insight
[One-sentence insight statement]

### Evidence
- Participants: Y of X mentioned this
- Observation: [Specific behavior pattern]
- Quote: "[Representative quote]"

### Implication
[Impact on design/product]

### Opportunity
[Improvement opportunity]

### Priority
- Impact: High / Medium / Low
- Confidence: High / Medium / Low
- Actionability: High / Medium / Low
```

---

## Usability Test Plan Template

```markdown
## Usability Test Plan: [Feature/Product]

### Research Objectives
1. [Objective 1]: [Specific question]
2. [Objective 2]: [Specific question]

### Methodology
- **Method**: Moderated remote usability testing
- **Duration**: 45 minutes per session
- **Participants**: 5-8 users
- **Tools**: [Screen sharing tool], [Recording tool]

### Participant Criteria
| Criteria | Include | Exclude |
|----------|---------|---------|
| Experience | [condition] | [condition] |
| Demographics | [condition] | [condition] |
| Technology | [condition] | [condition] |

### Task Scenarios

#### Task 1: [Task Name]
**Scenario**: You are [situation]. Please [goal].

**Success Criteria**:
- [ ] Task completed
- [ ] Completion time: [target time]
- [ ] Error count: [tolerance]

**Observation Points**:
- Where did they hesitate?
- What did they click?
- What did they say aloud?

### Metrics
| Metric | Definition | Target |
|--------|------------|--------|
| Completion rate | % of participants completing task | >80% |
| Task time | Time to complete each task | <[X] min |
| Error rate | Wrong clicks/actions count | <3 |
| SUS score | System Usability Scale | >68 |

### Session Script
1. **Introduction** (5 min): Explain purpose, obtain consent
2. **Warm-up** (5 min): Background questions
3. **Tasks** (25 min): Execute scenarios
4. **Debrief** (10 min): Follow-up questions, SUS

### Analysis Plan
1. Tally success/failure per task
2. Classify problems by severity
3. Organize observations with affinity diagram
4. Prioritize improvement recommendations
```

---

## Persona Template

```markdown
## Persona: [Name]

### Profile

| Attribute | Value |
|-----------|-------|
| Name | [Fictional name] |
| Age | [Age range] |
| Occupation | [Job title] |
| Location | [Region] |
| Technology | [Devices/OS/Services used] |

### Quote
> "[Quote that embodies this persona]"

### Bio
[2-3 sentences describing this persona's background]

### Goals
1. [Primary goal]
2. [Secondary goal]
3. [Latent goal]

### Frustrations
1. [Primary frustration]
2. [Secondary frustration]

### Behaviors
- **[Domain 1]**: [Specific behavior pattern]
- **[Domain 2]**: [Specific behavior pattern]
- **[Domain 3]**: [Specific behavior pattern]

### Scenario
[Typical scenario where this persona uses the product]

### Research Basis
- Interview participants: [X] people
- Representative participants: P[N], P[M]
- Key trait frequency: [X]%

---

### For Echo (Persona Testing)

**Persona Type**: [Newbie / Power User / Skeptic / etc.]
**Key Testing Focus**:
- [Flow to verify with this persona 1]
- [Flow to verify with this persona 2]

**Emotion Triggers**:
- Delighted by: [What makes them happy]
- Frustrated by: [What frustrates them]
```

---

## Journey Map Template

```markdown
## Journey Map: [Journey Name]

### Persona
[Persona name to use]

### Scenario
[Situation setup for this journey]

### Phases

| Phase | Awareness | Consideration | Usage | Support |
|-------|-----------|---------------|-------|---------|
| **Actions** | [action] | [action] | [action] | [action] |
| **Touchpoints** | [touchpoint] | [touchpoint] | [touchpoint] | [touchpoint] |
| **Thoughts** | [thought] | [thought] | [thought] | [thought] |
| **Emotions** | [+/-/neutral] | [+/-/neutral] | [+/-/neutral] | [+/-/neutral] |
| **Pain Points** | [pain] | [pain] | [pain] | [pain] |
| **Opportunities** | [opportunity] | [opportunity] | [opportunity] | [opportunity] |

### Key Moments

| Moment | Phase | Impact | Opportunity |
|--------|-------|--------|-------------|
| [Moment 1] | [Phase] | High | [Improvement] |
| [Moment 2] | [Phase] | Medium | [Improvement] |

### Canvas Integration (Mermaid)

` ``mermaid
journey
    title [Journey Name] - [Persona]
    section [Phase 1]
      [Action 1]: [score]: User
      [Action 2]: [score]: User
    section [Phase 2]
      [Action 3]: [score]: User
` ``
```

---

## Research Report Template

```markdown
## User Research Report: [Project Name]

### Executive Summary

| Item | Detail |
|------|--------|
| Research Period | YYYY-MM-DD to YYYY-MM-DD |
| Methods | [Methods used] |
| Participants | [N] people |
| Key Findings | [3-5 key findings] |

### Research Questions
1. [RQ1]: [Question]
2. [RQ2]: [Question]

### Methodology

#### Participants
| ID | Segment | Criteria Met |
|----|---------|--------------|
| P1 | [Segment] | Yes |
| P2 | [Segment] | Yes |

#### Methods Used
1. **[Method 1]**: [Overview]
2. **[Method 2]**: [Overview]

### Key Findings

#### Finding 1: [Title]
**Evidence**:
- Mentioned by Y of X participants
- "[Representative quote]"

**Implication**:
[What this finding means]

### Personas (Summary)
| Persona | Description | Primary Goal |
|---------|-------------|--------------|
| [Name 1] | [Overview] | [Goal] |
| [Name 2] | [Overview] | [Goal] |

### Recommendations
| Priority | Recommendation | Rationale |
|----------|----------------|-----------|
| High | [Recommendation] | [Reason] |
| Medium | [Recommendation] | [Reason] |
| Low | [Recommendation] | [Reason] |

### Next Steps
1. [Next action 1]
2. [Next action 2]

### Appendix
- Interview transcripts (anonymized)
- Affinity diagram
- Full persona documents
- Journey maps
```
