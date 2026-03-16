# Echo Persona Generation Workflow

Workflow for automatically generating service-specific personas from code/documentation.

---

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ANALYZE                                   │
│  Collect user information from code/documentation            │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                    EXTRACT                                   │
│  Extract persona elements (roles, goals, pain points)        │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                    GENERATE                                  │
│  Generate personas following template                        │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                    SAVE                                      │
│  Save to .agents/personas/{service}/                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Trigger Methods

### 1. Explicit Command

```
/Echo generate personas
/Echo generate personas for [service-name]
/Echo generate personas from [file-path]
/Echo generate internal personas          # Generate development organization personas
/Echo generate internal personas for [service-name]
```

### 2. Auto-Suggestion

Auto-suggested when starting review without defined personas:

```yaml
questions:
  - question: "No service-specific personas found. Would you like to generate them?"
    header: "Persona"
    options:
      - label: "Yes, generate personas (Recommended)"
        description: "Auto-generate from code/documentation"
      - label: "Use Echo base personas"
        description: "Continue review with standard personas"
      - label: "I'll provide personas"
        description: "Define personas manually"
    multiSelect: false
```

---

## Phase 1: ANALYZE

### Analysis Targets

| File Type | Extraction Target | Priority |
|-----------|------------------|----------|
| `README.md` | Target users, usage scenarios | High |
| `docs/**/*.md` | User guides, tutorials | High |
| `src/**/auth*` | Auth flow, user types | Medium |
| `src/**/user*` | User models, role definitions | Medium |
| `src/**/checkout*` | Purchase flow, customer types | Medium |
| `tests/**/*` | Test scenarios, use cases | Medium |
| `*.config.*` | Config options, feature flags | Low |
| `package.json` | Project description | Low |

### Analysis Targets (Internal Persona)

Analysis targets when generating development organization personas.

| File Type | Extraction Target | Priority |
|-----------|------------------|----------|
| `CODEOWNERS` | Team structure, responsibility areas | High |
| `.github/CODEOWNERS` | Code owners, team structure | High |
| `docs/CONTRIBUTING.md` | Development flow, contribution guidelines | High |
| `.editorconfig` | Development environment settings | Medium |
| `.vscode/**` | IDE settings, recommended extensions | Medium |
| `.idea/**` | IDE settings (JetBrains) | Medium |
| `docker-compose*.yml` | Local development environment | Medium |
| `.github/workflows/*` | CI/CD workflows | Medium |
| `Makefile` | Development commands, task definitions | Medium |
| `scripts/**` | Development/operations scripts | Medium |
| `docs/runbook*` | Operations runbooks | Medium |
| `docs/onboarding*` | Onboarding materials | Medium |
| `ARCHITECTURE.md` | Architecture documentation | Low |
| `ADR/**` | Architecture Decision Records | Low |

### Analysis Patterns

#### Pattern A: README/Documentation Analysis

```markdown
## Extraction Keywords

### User Types
- "for developers", "for teams", "for enterprises"
- "beginner", "advanced", "admin"
- "customer", "admin", "guest", "member"

### Usage Scenarios
- "when you need to...", "use case:"
- "for example...", "in cases like..."

### Tech Level
- "no coding required" → Low
- "API integration" → Medium-High
- "advanced configuration" → High
```

#### Pattern B: Code Structure Analysis

```markdown
## Code Analysis

### User Models
- `user.role`, `user.type`, `user.tier`
- Enum values for user types
- Permission levels

### Flow Analysis
- Route definitions → user journeys
- Form components → required inputs
- Error handlers → friction points

### Feature Flags
- Feature toggles → user segments
- A/B test configs → user variations
```

#### Pattern C: Test Scenario Analysis

```markdown
## Test Analysis

### E2E Tests
- Test descriptions → user stories
- Test steps → expected flows
- Assertions → success criteria

### User Stories in Tests
- "as a [role], I want to [action]"
- describe blocks with user context
```

#### Pattern D: Extended Attribute Analysis

Patterns for extracting extended attributes (Demographics, Psychographics, etc.).

```markdown
## Extended Attribute Analysis

### Demographics Signals
- "for students", "enterprise-grade" → age/occupation
- Pricing tiers → income level
- i18n/l10n configs → location
- "mobile-first", "PWA" → device/region characteristics

### Psychographics Signals
- "quick setup", "instant results" → time-saver
- "detailed docs", "comprehensive guide" → detail-oriented
- "proven", "trusted by", "case studies" → track record focused
- "innovative", "cutting-edge" → early adopter

### Digital Behavior Signals
- Session timeout settings → session duration
- Auto-save intervals → interruption frequency
- Sync/offline features → multi-device behavior
- Analytics events → usage time

### Literacy & Experience Signals
- Onboarding flow complexity → domain knowledge
- Help/tooltip density → digital literacy
- Keyboard shortcut docs → operation style
- Video tutorials vs text docs → learning style

### Social Context Signals (B2B)
- Team/organization features → organization size
- Admin/member roles → role level
- Approval workflows → decision authority
- Sharing/collaboration features → stakeholder relationships

### Life Stage Signals
- Pricing page messaging → economic state
- Trial/freemium model → service relationship phase
- Time-to-value messaging → resource constraints
```

#### Pattern E: Internal Persona Analysis

Extraction patterns for development organization personas.

```markdown
## Internal Persona Analysis

### Team Structure Signals
- CODEOWNERS entries → team/responsibility areas
- Team mentions in docs → organization structure
- GitHub team references → team names
- Directory ownership patterns → responsibility scope

### Development Environment Signals
- .editorconfig → editor settings
- .vscode/settings.json → VSCode recommended settings
- .vscode/extensions.json → recommended extensions
- docker-compose.yml → local development environment
- Makefile targets → development commands

### Workflow Signals
- CI/CD configurations → deployment flow
- PR templates → review process
- Issue templates → reporting flow
- CONTRIBUTING.md → development flow

### Operations Signals
- Runbook documents → operations procedures
- Alert configurations → monitoring targets
- Dashboard configs → metrics
- On-call schedules → operations structure

### Onboarding Signals
- Onboarding docs → new member information
- Getting started guides → initial setup
- Architecture docs → system understanding
- ADR/RFC documents → design background

### Job Type Detection Patterns
- Frontend: React/Vue/components → Frontend Developer
- Backend: API/DB/services → Backend Developer
- Infra: Docker/K8s/Terraform → Infra Engineer
- Test: E2E/unit/coverage → QA Engineer
- Design: Figma/Storybook → UI Designer
- Analytics: GA/Mixpanel/metrics → UX Researcher
- CMS/Admin: admin panels → Ops Manager/Content Editor
```

---

## Phase 2: EXTRACT

### Extraction Matrix (Core Attributes)

| Element | Source | Extraction Method |
|---------|--------|-------------------|
| **User Types** | README, user models | Role/type enumeration |
| **Goals** | Documentation, test descriptions | "want to", "need to" patterns |
| **Context** | Usage examples, tutorials | Scenario descriptions |
| **Pain Points** | Error handling, FAQ | Error messages, common questions |
| **Tech Level** | Setup complexity, API docs | Required prerequisites |
| **Devices** | Responsive code, mobile tests | Device support status |

### Extraction Matrix (Extended Attributes)

| Element | Source | Extraction Method |
|---------|--------|-------------------|
| **Demographics** | Pricing, i18n, marketing copy | Explicit/implicit target audience |
| **Psychographics** | Value propositions, CTAs | Value proposition analysis |
| **Digital Behavior** | Analytics, session configs | Behavior data/settings |
| **Literacy & Experience** | Onboarding, help system | Detail level/format of explanations |
| **Social Context** | Permissions, workflows | Presence/complexity of org features |
| **Life Stage** | Pricing, trials, messaging | Purchase stage assumptions |

### Extraction Matrix (Internal Persona)

| Element | Source | Extraction Method |
|---------|--------|-------------------|
| **Job Type** | CODEOWNERS, tech stack | Infer from directory structure and tech |
| **Team** | CODEOWNERS, docs | Extract team/department names |
| **Experience** | Onboarding complexity | Infer from documentation detail level |
| **Responsibility** | Directory ownership | Identify from code ownership scope |
| **Primary Tools** | .vscode, .editorconfig | Extract from IDE config files |
| **Work Style** | Docker, dev scripts | Infer from dev environment setup |
| **Daily Tasks** | CI/CD, scripts | Extract from workflow definitions |
| **Collaboration** | PR templates, CONTRIBUTING | Extract from review/coordination flows |
| **Pain Points** | Issue templates, docs/troubleshooting | Extract from common issues |

### Extraction Output Format

```yaml
extracted:
  # Core Attributes
  user_types:
    - name: "First-Time Buyer"
      evidence: "README.md line 42: 'perfect for first-time shoppers'"
    - name: "Enterprise Admin"
      evidence: "src/models/user.ts: role enum includes 'admin'"

  goals:
    - goal: "Purchase products quickly"
      type: functional
      evidence: "docs/quick-start.md: 'complete purchase in 3 steps'"

  pain_points:
    - pain: "Complex registration process"
      evidence: "src/auth/register.tsx: 15 required fields"

  context:
    - scenario: "Mobile shopping during commute"
      evidence: "tests/e2e/mobile-checkout.spec.ts"

  # Extended Attributes
  demographics:
    - attribute: "age_group"
      value: "30s-40s"
      evidence: "marketing/landing.md: 'working professionals'"
    - attribute: "occupation"
      value: "Employee/Manager"
      evidence: "pricing: team/enterprise tiers available"

  psychographics:
    - attribute: "time_vs_cost"
      value: "Time-saver"
      evidence: "README: 'save hours of manual work'"
    - attribute: "decision_style"
      value: "Thorough researcher"
      evidence: "extensive comparison docs, feature matrix"

  digital_behavior:
    - attribute: "session_duration"
      value: "5-10 min"
      evidence: "session timeout: 15min in auth config"
    - attribute: "interruption"
      value: "High"
      evidence: "auto-save every 30 seconds"

  literacy:
    - attribute: "domain_knowledge"
      value: "Intermediate"
      evidence: "assumes basic terminology without explanation"
    - attribute: "learning_style"
      value: "Hands-on"
      evidence: "interactive tutorials, sandbox environment"

  social_context:
    - attribute: "org_size"
      value: "Medium"
      evidence: "team features, but no SSO/SCIM"
    - attribute: "decision_authority"
      value: "Manager approval required"
      evidence: "approval workflow feature exists"

  life_stage:
    - attribute: "service_phase"
      value: "Consideration"
      evidence: "prominent trial CTA, comparison pages"
    - attribute: "resource_constraint"
      value: "Limited time"
      evidence: "'5-minute setup' messaging"

  # Internal Persona Attributes
  internal_profile:
    - attribute: "job_type"
      value: "Frontend Developer"
      evidence: "CODEOWNERS: @frontend-team owns src/components/"
    - attribute: "team"
      value: "Frontend Team"
      evidence: "CODEOWNERS: @frontend-team"
    - attribute: "experience"
      value: "1-3 years"
      evidence: "detailed onboarding docs suggest junior-mid level expected"
    - attribute: "responsibility"
      value: "UI component development"
      evidence: "src/components/ ownership"

  dev_environment:
    - attribute: "primary_tools"
      value: "VSCode, ESLint, Prettier"
      evidence: ".vscode/extensions.json recommendations"
    - attribute: "os"
      value: "macOS/Linux"
      evidence: "shell scripts use bash, no .bat files"
    - attribute: "work_style"
      value: "Remote"
      evidence: "docker-compose for full local env"

  workflow_context:
    - attribute: "daily_tasks"
      value: "Code review, PR creation"
      evidence: "PR template with detailed checklist"
    - attribute: "collaboration"
      value: "API coordination with Backend Team"
      evidence: "CONTRIBUTING.md mentions cross-team reviews"
    - attribute: "pain_points"
      value: "Complex environment setup"
      evidence: "docs/troubleshooting.md has 10+ setup issues"
```

### Default Values & Inference Rules

Default values and inference rules for attributes that couldn't be extracted:

```yaml
defaults:
  demographics:
    age_group:
      b2b: "30s-40s"
      b2c: "20s-30s"
    occupation:
      b2b: "Employee"
      b2c: null  # Omit if cannot be inferred
    income_level:
      b2b: "Middle"
      b2c: null

  psychographics:
    time_vs_cost:
      saas: "Time-saver"
      consumer: "Cost-conscious"
    decision_style:
      b2b_enterprise: "Thorough researcher"
      b2c: "Intuitive"

  digital_behavior:
    session_duration:
      task_app: "5-10 min"
      content_app: "15-30 min"
    interruption:
      mobile_first: "High"
      desktop_first: "Low"

  literacy:
    domain_knowledge:
      technical_product: "Intermediate"
      consumer_product: "Beginner"
    web_literacy:
      modern_stack: "Medium-High"
      legacy_target: "Low-Medium"

  social_context:
    org_size:
      enterprise_pricing: "Large"
      team_pricing: "Medium"
      individual_pricing: "Individual/Small"
    decision_authority:
      b2b: "Manager approval required"
      b2c: "Self"

  life_stage:
    service_phase:
      new_product: "Awareness"
      established: "Consideration/Active use"
    disposable_time:
      professional_tool: "Limited"
      hobby_app: "Normal"

inference_rules:
  - if: "pricing has enterprise tier"
    then: "org_size: Large, decision_authority: Formal approval required"
  - if: "mobile-first or PWA"
    then: "interruption: High, session_duration: 1-2 min"
  - if: "extensive API docs"
    then: "tech_level: High, domain_knowledge: Expert"
  - if: "video tutorials prominent"
    then: "learning_style: Watching"
  - if: "sandbox/playground exists"
    then: "learning_style: Hands-on"
  - if: "SSO/SCIM support"
    then: "org_size: Large, role_level: Manager+"

# Internal Persona Defaults
internal_defaults:
  job_type:
    frontend_heavy: "Frontend Developer"
    backend_heavy: "Backend Developer"
    infra_heavy: "Infra Engineer"
    mixed: "Full Stack Developer"

  experience:
    simple_onboarding: "3-5 years"       # Concise docs for experienced
    detailed_onboarding: "1-3 years"     # Detailed procedures
    minimal_onboarding: "5+ years"       # Self-sufficient assumed

  work_style:
    docker_compose_exists: "Remote/Hybrid"
    cloud_dev_env: "Remote"
    local_only: "Office"

  tools:
    vscode_config_exists: "VSCode"
    idea_config_exists: "IntelliJ IDEA"
    no_ide_config: "Editor agnostic"

internal_inference_rules:
  - if: "CODEOWNERS has @frontend-team"
    then: "generate Frontend Developer persona"
  - if: "CODEOWNERS has @backend-team or @api-team"
    then: "generate Backend Developer persona"
  - if: "CODEOWNERS has @infra-team or @platform-team"
    then: "generate Infra Engineer persona"
  - if: "CODEOWNERS has @qa-team or @test-team"
    then: "generate QA Engineer persona"
  - if: "docs/runbook* exists"
    then: "generate Ops Manager persona"
  - if: "admin/ or cms/ directory exists"
    then: "generate Content Editor or CS Representative persona"
  - if: "docs/onboarding* exists"
    then: "generate New Engineer persona"
  - if: "Storybook or Figma references exist"
    then: "generate UI Designer persona"
```

---

## Phase 3: GENERATE

### Generation Rules

1. **Minimum 3 personas**: Primary, Secondary, Edge Case
2. **Map to Echo base personas**: Always establish mapping
3. **Emotion Triggers**: Define service-specific triggers
4. **Testing Focus**: Explicitly state flows to validate

### Generation Rules (Internal Persona)

1. **Team structure based**: Identify key teams from CODEOWNERS, generate personas for each team
2. **Minimum 2 personas**: At least 1 developer + 1 operations/business
3. **Map to Internal Base Personas**: Reference Internal Base Personas in persona-template.md
4. **Workflow Context required**: Define daily tasks, collaboration, pain points
5. **Testing Focus**: Explicitly state validation flows from DX perspective

### Extended Attribute Generation Rules

1. **B2B/B2C determination**: Auto-determine from service characteristics, select appropriate sections
2. **Required vs Optional**: Core attributes required, extended attributes based on information availability
3. **Inferred marker**: Add `[inferred]` marker to inferred attributes
4. **Unknown marker**: Use `[unknown]` for attributes that cannot be filled due to insufficient information

### Persona Priority

| Priority | Type | Description |
|----------|------|-------------|
| P0 | Primary | Main target user (required) |
| P1 | Secondary | Important secondary user |
| P2 | Edge | Special cases, accessibility |

### Generation Prompt Structure

```markdown
## Generate Persona

Based on extracted data:
- User type: [extracted user type]
- Goals: [extracted goals]
- Context: [extracted context]
- Pain points: [extracted pain points]

Extended attributes (if available):
- Demographics: [extracted or inferred]
- Psychographics: [extracted or inferred]
- Digital Behavior: [extracted or inferred]
- Literacy & Experience: [extracted or inferred]
- Social Context: [extracted or inferred]
- Life Stage: [extracted or inferred]

Generate a persona following `persona-template.md`:
1. Fill all required fields
2. Map to Echo base persona
3. Define 5 emotion triggers
4. List 3 testing focus areas
5. Include source analysis
6. Add extended attributes with appropriate detail level
7. Mark inferred values with [inferred]
```

### Generation Prompt Structure (Internal Persona)

```markdown
## Generate Internal Persona

Based on extracted data:
- Job type: [extracted job type]
- Team: [extracted team name]
- Responsibilities: [extracted responsibilities]
- Tools: [extracted development tools]

Workflow context (from CI/CD, docs):
- Daily tasks: [extracted or inferred]
- Collaboration: [extracted or inferred]
- Pain points: [extracted or inferred]

Generate an internal persona following `persona-template.md`:
1. Set `type: internal` and appropriate `category`
2. Fill Internal Profile section
3. Fill Workflow Context section
4. Map to Internal Base Persona
5. Define 5 emotion triggers (DX focused)
6. List 3 testing focus areas (internal tools, docs, workflows)
7. Include source analysis
8. Mark inferred values with [inferred]
```

### Attribute Detail Level Selection

Detail level selection during generation:

```yaml
questions:
  - question: "Select the detail level for extended attributes"
    header: "Detail"
    options:
      - label: "Minimal (Recommended)"
        description: "Required attributes only. Fast generation"
      - label: "Standard"
        description: "Include main extended attributes"
      - label: "Full"
        description: "Include all extended attributes (for B2B)"
      - label: "Auto"
        description: "Auto-select based on extracted information"
    multiSelect: false
```

---

## Phase 4: SAVE

### File Naming Convention

```
.agents/personas/{service}/{persona-name}.md

Examples:
.agents/personas/ec-platform/first-time-buyer.md
.agents/personas/ec-platform/power-shopper.md
.agents/personas/admin-dashboard/it-admin.md
```

### Directory Structure

```
.agents/
└── personas/
    ├── README.md              # Usage guide
    └── {service-name}/        # Per-service folder
        ├── primary-user.md
        ├── secondary-user.md
        └── edge-case-user.md
```

### Save Confirmation

```yaml
questions:
  - question: "Would you like to save the generated personas?"
    header: "Save"
    options:
      - label: "Yes, save all (Recommended)"
        description: "Save to .agents/personas/{service}/"
      - label: "Review and edit first"
        description: "Review content before saving"
      - label: "Save selected only"
        description: "Save only some personas"
    multiSelect: false
```

---

## Service-Specific Review

How to run UX reviews using saved personas.

### Load Personas

```
/Echo review with saved personas
/Echo review [flow] as [persona-name]
```

### Review Process

```
1. LOAD - Load personas from .agents/personas/{service}/
2. SELECT - Select review target flow and persona
3. WALK - Apply persona-specific Emotion Triggers
4. SCORE - Score in service-specific context
5. REPORT - Report based on persona-specific Testing Focus
```

### Extended Attribute Usage in Review

How extended attributes are used in reviews:

| Extended Attribute | Review Usage |
|-------------------|--------------|
| Demographics | Font size, price display format, privacy expression validation |
| Psychographics | CTA copy, social proof placement, risk mitigation expression validation |
| Digital Behavior | Auto-save timing, progress display, sync UI validation |
| Literacy & Experience | Terminology difficulty, help format, shortcut exposure |
| Social Context | Approval flow, sharing features, permission display validation |
| Life Stage | Onboarding length, pricing presentation, time value proposition |

### Cross-Persona Analysis

Compare flows across multiple saved personas:

```markdown
### Cross-Persona Matrix: Checkout Flow

| Step | First-Time Buyer | Power Shopper | Enterprise Admin |
|------|-----------------|---------------|------------------|
| 1    | +1              | +2            | +1               |
| 2    | -2              | +1            | -1               |
| 3    | -3              | +2            | -2               |

**Universal Issues**: Step 3 (all personas struggle)
**Segment Issues**: Step 2 (affects First-Time Buyer)
```

### Extended Attribute Insights

Segment-specific insights from extended attributes:

```markdown
### Attribute-Based Insights

| Attribute | First-Time Buyer | Power Shopper | Enterprise Admin |
|-----------|-----------------|---------------|------------------|
| Time Constraint | Limited | Normal | Limited |
| Decision Making | Self | Self | Formal approval |
| Interruption Frequency | High | Low | High |

**Design Implications**:
- Auto-save: Essential for First-Time Buyer, Enterprise Admin
- Approval flow: Needs optimization for Enterprise Admin
- Session recovery: Design for interruptions across all personas
```

---

## Integration with Echo Workflow

### SKILL.md Reference

This feature integrates with the following sections in `SKILL.md`:

- **PERSONA LIBRARY**: Mapping to base personas
- **EMOTION SCORING**: Custom Emotion Triggers
- **ECHO'S DAILY PROCESS**: Extended persona selection

### Journal Integration

Important discoveries during persona generation are recorded in `.agents/echo.md`:

```markdown
## YYYY-MM-DD - Persona Discovery: [Service Name]

**Generated Personas:**
- [Persona 1]: [Key insight]
- [Persona 2]: [Key insight]

**Extended Attributes Discovered:**
- Demographics: [B2B/B2C characteristics]
- Key Psychographic: [Decision-making pattern]
- Digital Behavior: [Distinctive usage pattern]

**Unexpected Finding:**
[Unexpected user types discovered from code analysis, etc.]
```

---

## Question Templates

### ON_PERSONA_GENERATION

```yaml
questions:
  - question: "Which sources should be used to generate personas?"
    header: "Source"
    options:
      - label: "Auto-detect (Recommended)"
        description: "Auto-analyze README, docs, src"
      - label: "Documentation only"
        description: "Analyze documentation files only"
      - label: "Code only"
        description: "Analyze source code only"
      - label: "Specify files"
        description: "Specify files to analyze"
    multiSelect: false
```

### ON_PERSONA_COUNT

```yaml
questions:
  - question: "How many personas should be generated?"
    header: "Count"
    options:
      - label: "3 (Recommended)"
        description: "Primary, Secondary, Edge Case"
      - label: "5"
        description: "More detailed segmentation"
      - label: "Auto"
        description: "Based on discovered user types"
    multiSelect: false
```

### ON_PERSONA_REVIEW

```yaml
questions:
  - question: "Would you like to review with saved personas?"
    header: "Persona"
    options:
      - label: "Use saved personas (Recommended)"
        description: "Load from .agents/personas/"
      - label: "Use Echo base personas"
        description: "Use standard personas"
      - label: "Generate new personas"
        description: "Generate new personas"
    multiSelect: false
```

### ON_EXTENDED_ATTRIBUTES

```yaml
questions:
  - question: "How much extended attribute detail should be included?"
    header: "Extended"
    options:
      - label: "Auto (Recommended)"
        description: "Auto-select based on extracted information"
      - label: "Minimal"
        description: "Required attributes only (fast generation)"
      - label: "Standard"
        description: "Include main extended attributes"
      - label: "Full"
        description: "Include all extended attributes"
    multiSelect: false
```

### ON_B2B_B2C_SELECTION

```yaml
questions:
  - question: "What is the primary target of the service?"
    header: "Target"
    options:
      - label: "B2B"
        description: "Enterprise/team-focused (Social Context emphasis)"
      - label: "B2C"
        description: "Individual consumer-focused (Life Stage emphasis)"
      - label: "Both"
        description: "Both B2B/B2C (consider all attributes)"
      - label: "Auto-detect"
        description: "Auto-determine from code/documentation"
    multiSelect: false
```

### ON_INTERNAL_PERSONA_GENERATION

```yaml
questions:
  - question: "What type of Internal Persona should be generated?"
    header: "Internal"
    options:
      - label: "Auto-detect (Recommended)"
        description: "Auto-detect from CODEOWNERS, documentation"
      - label: "Developer focused"
        description: "Prioritize engineering personas"
      - label: "Operations focused"
        description: "Prioritize operations/business personas"
      - label: "Select specific roles"
        description: "Select job types to generate"
    multiSelect: false
```

### ON_INTERNAL_PERSONA_ROLES

```yaml
questions:
  - question: "Which job types of Internal Persona should be generated?"
    header: "Roles"
    options:
      - label: "Frontend Developer"
        description: "Frontend developer"
      - label: "Backend Developer"
        description: "Backend developer"
      - label: "Infra Engineer"
        description: "Infrastructure engineer"
      - label: "QA Engineer"
        description: "QA engineer"
    multiSelect: true
```

### ON_PERSONA_TYPE_SELECTION

```yaml
questions:
  - question: "What type of personas should be generated?"
    header: "Type"
    options:
      - label: "User Personas (Recommended)"
        description: "Personas for service users"
      - label: "Internal Personas"
        description: "Personas for development organization"
      - label: "Both"
        description: "Generate both types"
    multiSelect: false
```

### ON_INTERNAL_REVIEW_TARGET

```yaml
questions:
  - question: "What should be reviewed with Internal Persona?"
    header: "Review"
    options:
      - label: "Admin Panel"
        description: "Admin panel UX validation"
      - label: "Developer Tools"
        description: "Dev tools/CI/CD validation"
      - label: "Documentation"
        description: "Documentation/specs validation"
      - label: "Error Messages / Logs"
        description: "Error messages/logs validation"
      - label: "API / SDK"
        description: "API/SDK design validation"
    multiSelect: true
```
