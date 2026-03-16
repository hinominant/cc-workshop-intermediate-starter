# Bridge Handoff Templates

## BRIDGE → SCRIBE Handoff

Use when: Requirements are clarified and formal specification is needed

```markdown
## SCRIBE_HANDOFF (from Bridge)

### Request Summary
- **Feature:** [Feature name]
- **Requester:** [Requester name]
- **Priority:** [High/Medium/Low]
- **Target Release:** [Release timeframe]

### Clarified Requirements

#### Original Request
> [Quote original requirement as stated]

#### Bridge Translation
[Requirements translated to technically implementable form]

#### Scope Definition
**In Scope:**
- [In-scope item 1]
- [In-scope item 2]

**Out of Scope:**
- [Out-of-scope item 1]
- [Out-of-scope item 2]

### Resolved Ambiguities
| # | Question | Resolution | Decided By | Date |
|---|----------|------------|------------|------|
| 1 | [Question] | [Answer] | [Who decided] | [Date] |
| 2 | [Question] | [Answer] | [Who decided] | [Date] |

### Validated Assumptions
| # | Assumption | Validation Source |
|---|------------|-------------------|
| 1 | [Assumption] | [Source] |
| 2 | [Assumption] | [Source] |

### Acceptance Criteria
- [ ] [Concrete, testable criterion 1]
- [ ] [Concrete, testable criterion 2]
- [ ] [Concrete, testable criterion 3]

### Technical Context
- **Related Systems:** [Related systems]
- **Data Sources:** [Data sources]
- **Dependencies:** [Dependencies]
- **Constraints:** [Constraints]

### Stakeholder Sign-off
- [x] PM: [Name] - Approved scope on [Date]
- [x] Tech Lead: [Name] - Validated feasibility on [Date]
- [ ] Other: [Name] - Pending

### Scribe Instructions
Please create a **[PRD/SRS/HLD/LLD]** with:
1. All clarified requirements above
2. User stories with acceptance criteria
3. Technical requirements section
4. Out-of-scope section explicitly stated

Suggested command: `/Scribe create [document type] for [feature]`
```

---

## BRIDGE → SHERPA Handoff

Use when: Requirements are clarified and task breakdown is needed

```markdown
## SHERPA_HANDOFF (from Bridge)

### Epic Summary
- **Name:** [Epic name]
- **Owner:** [Owner]
- **Target Completion:** [Completion target date]

### Clarified Scope

#### Must Have (MVP)
1. [Must-have item 1]
2. [Must-have item 2]
3. [Must-have item 3]

#### Should Have
1. [Should-have item 1]
2. [Should-have item 2]

#### Out of Scope
1. [Out-of-scope 1]
2. [Out-of-scope 2]

### Priority Order (Stack Ranked)
| Rank | Item | Reason |
|------|------|--------|
| 1 | [Highest priority item] | [Reason] |
| 2 | [Second priority] | [Reason] |
| 3 | [Third priority] | [Reason] |

### Known Dependencies
| Item | Depends On | Status |
|------|------------|--------|
| [Item] | [Dependency] | [Ready/Blocked] |

### Constraints
- **Timeline:** [Timeline constraint]
- **Resources:** [Resource constraint]
- **Technical:** [Technical constraint]

### Risk Flags
| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk 1] | [Impact] | [Mitigation] |

### Change Control
- Scope changes require approval from: [Approver]
- Contact for questions: [Contact]

### Sherpa Instructions
Please break down this Epic into:
1. Atomic steps (< 15 min each)
2. Identify Git commit points
3. Flag any investigation needs (Scout)
4. Maintain strict scope boundaries

Suggested command: `/Sherpa break down [epic name]`
```

---

## BRIDGE → ATLAS Handoff

Use when: Technical feasibility validation is needed

```markdown
## ATLAS_HANDOFF (from Bridge)

### Feasibility Question
> [Technical question that needs validation]

### Business Context
- **Why this is needed:** [Business necessity]
- **Stakeholder expectation:** [Stakeholder expectation]
- **Timeline pressure:** [Time constraint]

### Current Understanding
[Current technical understanding]

### Specific Questions
1. [Specific question 1]
2. [Specific question 2]
3. [Specific question 3]

### Expected Response Format
Please provide:
1. Feasibility assessment (Feasible / Partially / Not Feasible)
2. Effort estimate (T-shirt sizing: S/M/L/XL)
3. Key risks or blockers
4. Alternative approaches if not feasible

### Decision Timeline
- Need answer by: [Date]
- Blocking: [What is blocked]

Suggested command: `/Atlas assess feasibility of [topic]`
```

---

## BRIDGE → BUILDER Handoff

Use when: Communicating implementation context to developers

```markdown
## BUILDER_HANDOFF (from Bridge)

### Implementation Context

#### What We're Building
[Feature overview]

#### Why We're Building It
[Business reason and value]

#### Who It's For
[Target users]

### Requirements Summary
(Full spec available at: [Link to Scribe spec])

#### Core Requirements
1. [Core requirement 1]
2. [Core requirement 2]

#### Acceptance Criteria
- [ ] [Acceptance criterion 1]
- [ ] [Acceptance criterion 2]

### Stakeholder Expectations

| Stakeholder | Primary Expectation | Flexibility |
|-------------|---------------------|-------------|
| PM | [Expectation] | [What's negotiable] |
| User | [Expectation] | [What's negotiable] |

### Known Trade-offs Accepted
| Trade-off | Decision | Reason |
|-----------|----------|--------|
| [Trade-off 1] | [Decision] | [Reason] |

### Questions to Escalate
If you encounter:
- Scope uncertainty → Ask Bridge
- Technical blocker → Consult Atlas
- UX concern → Consult Palette

### Communication Preferences
- Progress updates: [Frequency]
- Blocker escalation: [Contact]
- Scope change requests: [Process]
```

---

## BRIDGE → CANVAS Handoff

Use when: Trade-off or option visualization is needed

```markdown
## CANVAS_HANDOFF (from Bridge)

### Visualization Request
- **Purpose:** [Visualization purpose]
- **Audience:** [Viewers]
- **Decision to support:** [Decision being supported]

### Data to Visualize

#### Option Comparison
| Option | Effort | Risk | Value | Timeline |
|--------|--------|------|-------|----------|
| A | [Value] | [Value] | [Value] | [Value] |
| B | [Value] | [Value] | [Value] | [Value] |
| C | [Value] | [Value] | [Value] | [Value] |

#### Recommended Visualization
- [ ] Trade-off matrix
- [ ] Decision tree
- [ ] Timeline comparison
- [ ] Impact diagram

### Key Points to Highlight
1. [Highlight point 1]
2. [Highlight point 2]

### Output Format
- [ ] Mermaid diagram
- [ ] ASCII art
- [ ] draw.io export

Suggested command: `/Canvas create [diagram type] for [topic]`
```

---

## BRIDGE → VOICE Handoff

Use when: Customer feedback collection/analysis is needed

```markdown
## VOICE_HANDOFF (from Bridge)

### Feedback Need
- **Topic:** [Topic]
- **Question:** [What we want to know]
- **Urgency:** [Urgency level]

### Context
[Why this feedback is needed]

### Specific Questions to Answer
1. [Question 1]
2. [Question 2]

### Existing Data
- [Data/insights already available]

### Expected Output
- Sentiment summary
- Key themes
- Actionable recommendations

Suggested command: `/Voice analyze feedback on [topic]`
```

---

## Inbound Handoffs (From other agents to Bridge)

### From Sherpa → BRIDGE

```markdown
## BRIDGE_REQUEST (from Sherpa)

### Scope Clarification Needed
- **Task:** [Task name]
- **Ambiguity:** [Unclear point]

### Question
[Specific question]

### Context
- Current step: [Current step]
- Blocked by: [Blocking factor]

### Options Identified
1. [Option 1]
2. [Option 2]

### Urgency
- [ ] Blocking current work
- [ ] Can proceed with assumption
```

### From Builder → BRIDGE

```markdown
## BRIDGE_REQUEST (from Builder)

### Trade-off Decision Needed
- **Feature:** [Feature name]
- **Decision point:** [Point requiring decision]

### Options
| Option | Pros | Cons |
|--------|------|------|
| A | [Benefits] | [Drawbacks] |
| B | [Benefits] | [Drawbacks] |

### Technical Recommendation
[Technical recommendation]

### Business Input Needed
[Point requiring business judgment]
```
