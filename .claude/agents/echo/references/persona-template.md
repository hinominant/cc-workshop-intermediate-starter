# Echo Persona Template

Use this template to define service-specific personas.

---

## Template

```markdown
---
name: [Persona Name]
service: [service-identifier]
type: custom  # custom | base | internal
category: user  # user | developer | designer | business | operations
created: [YYYY-MM-DD]
source: [analyzed files/documents]
---

# [Persona Name]

## Profile

| Attribute | Value |
|-----------|-------|
| Role | [User's role/position] |
| Tech Level | [Low/Medium/High] |
| Device | [Device (percentage%)] |
| Usage Context | [Typical usage situation] |
| Usage Frequency | [Daily/Weekly/Monthly/First-time only] |

## Internal Profile [Internal Persona]

> Attributes specific to development organization personas. Used when `type: internal`.

| Attribute | Value |
|-----------|-------|
| Job Type | [Frontend/Backend/Infra/QA/UI Designer/UX Designer/PdM/PO/CS/Sales/Ops] |
| Team | [Team name/Department] |
| Experience | [<1 year/1-3 years/3-5 years/5+ years] |
| Responsibility | [Specific area of responsibility] |

### Development Environment

| Attribute | Value |
|-----------|-------|
| Primary Tools | [IDE/Editor, main tools] |
| OS | [macOS/Windows/Linux] |
| Work Style | [Office/Remote/Hybrid] |

## Demographics [Optional]

> Applicable to both B2B/B2C. Used for font size, price sensitivity, localization, and privacy design validation.

| Attribute | Value |
|-----------|-------|
| Age Group | [Teens/20s/30s/40s/50s/60+] |
| Occupation Category | [Student/Employee/Manager/Executive/Self-employed/Professional] |
| Industry | [IT/Finance/Manufacturing/Retail/Healthcare/Education/Other] |
| Income Level | [Entry/Middle/Senior/Executive] |
| Location | [Urban/Suburban/Rural] |
| Household | [Single/Couple/Family with children/Multi-generational] |

## Quote

> "[Typical statement or inner voice of this persona]"

## Psychographics [Optional]

> Used for copy adjustment, CTA placement, and social proof positioning validation.

### Values Profile

| Axis | This Persona's Tendency |
|------|------------------------|
| Time vs Cost | [Time-saver/Cost-conscious] |
| New vs Stable | [Early adopter/Proven track record] |
| Independent vs Collaborative | [Self-solver/Support-dependent] |
| Detail vs Summary | [Detail-oriented/Big-picture] |

### Decision-Making Style

| Attribute | Value |
|-----------|-------|
| Information Gathering | [Thorough researcher/Intuitive/Expert-dependent/Word-of-mouth] |
| Risk Tolerance | [High/Medium/Low] |
| Purchase Decision Maker | [Self/Manager approval/Team decision/Family consultation] |

## Digital Behavior [Optional]

> Used for auto-save, progress display, and cross-device sync design validation.

### Usage Time

| Time Period | Usage Probability | Context |
|-------------|------------------|---------|
| Morning (6-9am) | [High/Medium/Low] | [Commuting/Breakfast] |
| Daytime (9am-6pm) | [High/Medium/Low] | [Working/Lunch break] |
| Evening (6pm-12am) | [High/Medium/Low] | [After work/Before bed] |

### Session Characteristics

| Attribute | Value |
|-----------|-------|
| Average Session Duration | [1-2 min/5-10 min/15-30 min/30+ min] |
| Interruption Frequency | [High/Medium/Low] |
| Return Pattern | [Immediate/Hours later/Next day+] |

### Multi-Device Behavior

- [Single device/Device switching/Parallel use/Sync expected]

## Literacy & Experience [Optional]

> Used for terminology selection, onboarding design, and help format validation.

### Domain Knowledge

| Area | Level |
|------|-------|
| Service Domain | [Beginner/Intermediate/Expert] |
| Competitor Experience | [None/1-2 services/Multiple] |
| This Service History | [New/Under 3 months/Under 1 year/Veteran] |

### Digital Literacy

| Aspect | Level |
|--------|-------|
| General Web Literacy | [Low/Medium/High] |
| Mobile App Literacy | [Low/Medium/High] |
| Keyboard Shortcuts | [Never/Basic only/Active use] |

### Learning Style

| Format | Preference |
|--------|-----------|
| Reading (Documentation) | [Prefer/Accept/Avoid] |
| Watching (Video) | [Prefer/Accept/Avoid] |
| Hands-on (Trial) | [Prefer/Accept/Avoid] |

### Mental Model Reference

- Expected UI Pattern: [iOS standard/Android standard/Desktop standard/Specific competitor]

## Social Context [Optional]

> Used for approval flow, sharing features, and permission design validation.

### Organizational Position [B2B]

| Attribute | Value |
|-----------|-------|
| Organization Size | [Individual/Small/Medium/Large] |
| Role Level | [Member/Lead/Manager/Executive] |
| Decision Authority | [Self-decision/Manager approval/Formal approval] |
| Purchase Influence | [Decision maker/Influencer/User only] |

### Stakeholder Relationships

| Stakeholder | Influence |
|-------------|----------|
| Boss/Manager | [Strong/Medium/Weak/None] |
| Colleagues/Team | [Strong/Medium/Weak/None] |
| Customers/Clients | [Strong/Medium/Weak/None] |
| Family/Friends [B2C] | [Strong/Medium/Weak/None] |

### Social Pressure

| Attribute | Value |
|-----------|-------|
| Desired Image | [Efficient/Innovative/Cautious/Expert] |
| Avoided Image | [Incompetent/Outdated/Risky] |

## Life Stage [Optional]

> Used for onboarding length, upsell design, and pricing display validation.

### Current Phase

| Attribute | Value |
|-----------|-------|
| Career Stage | [Student/New grad/Mid-career/Veteran/Senior] |
| Life Event | [None/Job change/Promotion/Marriage/Childbirth/Caregiving] |
| Economic State | [Growth/Stable/Saving] |

### Service Relationship Phase

- [Awareness/Consideration/Adoption/Active use/Renewal decision]

### Current Priorities Top 3

1. [Work-related]
2. [Personal life]
3. [This service-related]

### Resource Constraints

| Resource | State |
|----------|-------|
| Disposable Time | [Abundant/Normal/Limited] |
| Learning Time Available | [1+ hour/~30 min/Under 15 min] |
| Budget Authority | [Free/Within limits/Approval required] |

## Workflow Context [Internal Persona]

> Workflow context specific to development organization personas. Used when `type: internal`.

### Daily Tasks

| Task | Frequency | Related Systems |
|------|-----------|----------------|
| [Task 1] | [Daily/Weekly/Monthly] | [Systems used] |
| [Task 2] | [Frequency] | [System] |

### Collaboration

| Collaborator | Frequency | Content |
|--------------|-----------|---------|
| [Team/Role] | [Frequency] | [What is coordinated] |

### Pain Points (Work-related)

1. [Development/work challenge 1]
2. [Development/work challenge 2]
3. [Development/work challenge 3]

## Goals

1. [Functional Goal]
2. [Emotional Goal]
3. [Social Goal]

## Frustrations

1. [Primary frustration 1]
2. [Primary frustration 2]
3. [Primary frustration 3]

## Key Behaviors

- [Typical behavior 1]
- [Typical behavior 2]
- [Typical behavior 3]

## Emotion Triggers

| State | Trigger |
|-------|---------|
| Delighted (+3) | [Moment of joy] |
| Satisfied (+2) | [Moment of satisfaction] |
| Confused (-1) | [Moment of confusion] |
| Frustrated (-2) | [Moment of frustration] |
| Abandoned (-3) | [Moment of abandonment] |

## Echo Testing Focus

Key flows to test with this persona:

- [ ] [Priority flow 1]
- [ ] [Priority flow 2]
- [ ] [Priority flow 3]

## Context Scenarios

Typical situations this persona encounters:

### Scenario 1: [Scenario Name]

```
Physical: [Physical situation]
Temporal: [Time constraints]
Social: [Social situation]
Cognitive: [Cognitive state]
Technical: [Technical environment]
```

## JTBD (Jobs-to-be-Done)

### Functional Job
[Specific task to accomplish]

### Emotional Job
[Desired emotional state]

### Social Job
[How they want to be perceived]

## Source Analysis

Sources that informed this persona:

| Source | Extracted Information |
|--------|----------------------|
| [file1] | [Extracted content] |
| [file2] | [Extracted content] |

---

## Notes

[Additional notes/observations]
```

---

## Template Structure Overview

```
# [Persona Name]

## Profile (Required)                          # Basic information
## Internal Profile [Internal Persona]         # For development org (when type: internal)
## Demographics [Optional]                     # Demographics
## Quote (Required)                            # Symbolic statement
## Psychographics [Optional]                   # Psychographics
## Digital Behavior [Optional]                 # Digital behavior
## Literacy & Experience [Optional]            # Literacy details
## Social Context [Optional]                   # Social context
## Life Stage [Optional]                       # Life stage
## Workflow Context [Internal Persona]         # For development org (when type: internal)
## Goals / Frustrations / Behaviors (Required) # Core attributes
## Emotion Triggers (Required)                 # Emotion triggers
## Context Scenarios (Required)                # Context scenarios
## JTBD (Required)                             # Jobs to be done
## Echo Testing Focus (Required)               # Testing focus
## Source Analysis (Required)                  # Source analysis
```

---

## Field Descriptions

### Required Fields

| Field | Description | Example |
|-------|-------------|---------|
| `name` | Persona name (English recommended) | `First-Time Buyer` |
| `service` | Service identifier | `ec-platform` |
| `type` | Persona type | `custom` |
| `category` | Persona category | `user` |
| `created` | Creation date | `2026-01-31` |
| `source` | Analyzed files/documents | `[README.md, src/checkout/*]` |

### Type Values

| Value | Description |
|-------|-------------|
| `custom` | Service-specific persona (for users) |
| `base` | Echo standard persona |
| `internal` | Development organization persona |

### Category Values

| Value | Description | Target |
|-------|-------------|--------|
| `user` | Service users | End users, customers |
| `developer` | Developers | Frontend/Backend/Infra/QA engineers |
| `designer` | Designers | UI/UX designers, researchers |
| `business` | Business roles | PdM/PO/CS/Sales |
| `operations` | Operations roles | Ops/Content Editor |

### Profile Section

- **Role**: User's position (customer, admin, guest, etc.)
- **Tech Level**: Low (beginner) / Medium (general) / High (technical)
- **Device**: Primary device and percentage
- **Usage Context**: When and where they use it
- **Usage Frequency**: Frequency of service interaction

### Extended Attributes [Optional]

Six extended categories are optional. Use only the sections needed based on service characteristics.

| Category | B2B | B2C | Primary Use |
|----------|-----|-----|-------------|
| Demographics | ○ | ◎ | Font size, price sensitivity, localization |
| Psychographics | ◎ | ◎ | Copy, CTA, social proof |
| Digital Behavior | ◎ | ○ | Auto-save, progress display, sync design |
| Literacy & Experience | ◎ | ◎ | Terminology, onboarding, help format |
| Social Context | ◎ | ○ | Approval flow, sharing, permissions |
| Life Stage | ○ | ◎ | Onboarding length, upsell, pricing |

◎ = Recommended, ○ = Situational

### Emotion Triggers

Linked to Echo's Emotion Score:

| Score | State | Use Case |
|-------|-------|----------|
| +3 | Delighted | Experience exceeds expectations |
| +2 | Satisfied | Smooth progress |
| +1 | Relieved | Concerns resolved |
| 0 | Neutral | No particular emotion |
| -1 | Confused | Slight hesitation |
| -2 | Frustrated | Clear problem |
| -3 | Abandoned | Abandonment |

### Echo Testing Focus

Persona-specific validation priority flows. Progress can be tracked with checkboxes.

---

## Mapping to Echo Base Personas

Service-specific personas can be mapped to Echo's base personas:

| Base Persona | Example Specialized Personas |
|--------------|------------------------------|
| Newbie | First-Time Buyer, New Employee |
| Power User | Heavy Buyer, Admin User |
| Skeptic | Price-Conscious Shopper |
| Mobile User | Commuter Shopper |
| Senior | Accessibility-Focused User |
| Accessibility User | Screen Reader User |
| Privacy Paranoid | Data-Conscious User |

This mapping enables use of Echo's existing analysis frameworks (Mental Model Gap, Cognitive Load Index, etc.).

---

## Minimal vs Full Persona

### Minimal Persona (Required fields only)

For quick generation or simple services:

```markdown
# [Name]
## Profile
## Quote
## Goals / Frustrations / Behaviors
## Emotion Triggers
## Echo Testing Focus
## JTBD
## Source Analysis
```

### Full Persona (All fields)

For detailed analysis or complex B2B/B2C services:

```markdown
# [Name]
## Profile
## Demographics
## Quote
## Psychographics
## Digital Behavior
## Literacy & Experience
## Social Context
## Life Stage
## Goals / Frustrations / Behaviors
## Emotion Triggers
## Context Scenarios
## JTBD
## Echo Testing Focus
## Source Analysis
```

### Internal Persona (Development organization)

For reviewing from development team member perspectives:

```markdown
# [Name]
## Profile
## Internal Profile [Internal Persona]
## Quote
## Workflow Context [Internal Persona]
## Goals / Frustrations / Behaviors
## Emotion Triggers
## Context Scenarios
## JTBD
## Echo Testing Focus
## Source Analysis
```

---

## Internal Base Personas

Base persona library for development organizations. Used with `type: internal`.

### Engineering

| Persona | Description | Primary Review Target |
|---------|-------------|----------------------|
| Frontend Developer | Frontend developer | Components, design system, dev tools |
| Backend Developer | Backend developer | API design, documentation, logs |
| Infra Engineer | Infrastructure engineer | Deploy, monitoring, ops tools |
| QA Engineer | QA engineer | Test environment, bug reports, quality metrics |
| New Engineer | Newly onboarded engineer | Onboarding, documentation |

### Design

| Persona | Description | Primary Review Target |
|---------|-------------|----------------------|
| UI Designer | UI designer | Design tool integration, components |
| UX Researcher | UX researcher | User data, analytics tools |

### Business

| Persona | Description | Primary Review Target |
|---------|-------------|----------------------|
| Product Manager | Product manager | Specs, roadmap, metrics |
| CS Representative | Customer support | Admin panel, FAQ, inquiry handling |
| Sales | Sales representative | Demo environment, materials, customer management |

### Operations

| Persona | Description | Primary Review Target |
|---------|-------------|----------------------|
| Ops Manager | Operations manager | Admin panel, monitoring, alerts |
| Content Editor | Content editor | CMS, publishing flow |

---

## User Persona vs Internal Persona

Selection guide for persona types.

### Selection Criteria

| Target | Recommended Persona Type | Primary Purpose |
|--------|-------------------------|-----------------|
| Customer-facing screens | User Persona | End user experience validation |
| Admin panel | Internal Persona | Operations usability validation |
| Dev tools/CI/CD | Internal Persona | Developer experience (DX) validation |
| Documentation/Specs | Internal Persona | Comprehensibility, new member perspective |
| Error messages/Logs | Internal Persona | Ops/debugging usefulness |
| API/SDK | Internal Persona | Developer interface validation |
| Marketing site | User Persona | Prospect experience validation |

### Combination Patterns

| Scenario | Recommended Composition |
|----------|------------------------|
| E-commerce site | User: Buyer + Internal: CS Rep |
| SaaS product | User: End user + Internal: Admin, Ops |
| Developer tool | User: External dev + Internal: Internal dev |
| B2B platform | User: Client company rep + Internal: Sales, CS |

### Internal Persona-Specific Review Perspectives

| Perspective | Description | Validation Examples |
|-------------|-------------|---------------------|
| Efficiency | Daily task operation efficiency | Bulk operations, shortcuts |
| Observability | Ease of state awareness | Dashboard, logs, alerts |
| Troubleshooting | Ease of problem resolution | Error details, search function |
| Onboarding | New member learning ease | Documentation, tooltips |
| Collaboration | Cross-team coordination ease | Sharing, handoff, comments |
