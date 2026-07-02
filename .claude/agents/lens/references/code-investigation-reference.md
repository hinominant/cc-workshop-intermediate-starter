# lens — コード調査 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## QUICK START

### Core Flow (5 Steps)

```
1. SCOPE    → Decompose the question, define investigation boundaries
2. SURVEY   → Identify entry points, get structural overview
3. TRACE    → Follow execution flow, data flow, dependencies
4. CONNECT  → Relate findings, build the big picture
5. REPORT   → Generate structured understanding report
```

### Typical Use Cases

| Scenario | Example Request |
|----------|----------------|
| Feature discovery | "Where is authentication implemented?" |
| Flow understanding | "Trace the user registration flow" |
| Structure mapping | "What's the module structure of the API layer?" |
| Data tracking | "Where is order data created and stored?" |
| Onboarding | "Help me understand this repository's overall structure" |
| Tech stack survey | "What ORM does this project use?" |

---

## LENS FRAMEWORK

```
SCOPE → SURVEY → TRACE → CONNECT → REPORT
  │        │        │        │         │
  │        │        │        │         └─ Structured report output
  │        │        │        └─ Relate findings, build big picture
  │        │        └─ Follow flows (execution, data, dependency)
  │        └─ Identify entry points, structural overview
  └─ Decompose question, define scope
```

### 1. SCOPE Phase (Understand the Question)

Decompose the question and identify the investigation type.

```yaml
INVESTIGATION_SCOPE:
  original_question: "[User's exact question]"
  investigation_type:
    - EXISTENCE: "Does X exist in this codebase?"
    - FLOW: "How does X work from A to B?"
    - STRUCTURE: "What is the architecture of X?"
    - DATA: "Where does data X originate and go?"
    - CONVENTION: "What patterns/tools does this project use?"
  search_targets:
    keywords: ["[domain terms]", "[technical terms]"]
    file_patterns: ["[likely file patterns]"]
    entry_points: ["[routes, handlers, main files]"]
  scope_boundary:
    include: ["[directories/modules to search]"]
    exclude: ["[node_modules, build, etc.]"]
  expected_output:
    format: "[existence_check | flow_diagram | structure_map | data_trace]"
    depth: "[surface | moderate | deep]"
```

### 2. SURVEY Phase (Get the Lay of the Land)

Get a bird's-eye view of the codebase and find investigation starting points.

**Step 2.1: Project Structure Scan**
```bash
# Directory structure overview
ls -la
cat package.json  # or equivalent manifest
cat README.md     # if exists

# Identify framework/patterns
# Look for: src/, app/, lib/, routes/, controllers/, services/
```

**Step 2.2: Entry Point Identification**

| Entry Point Type | How to Find |
|-----------------|-------------|
| HTTP Routes | `grep -r "router\|app.get\|app.post\|@Get\|@Post"` |
| CLI Commands | `grep -r "command\|program\|yargs\|commander"` |
| Event Handlers | `grep -r "on(\|addEventListener\|subscribe\|@EventHandler"` |
| Cron/Batch | `grep -r "cron\|schedule\|@Scheduled"` |
| Exports (Library) | Entry in `package.json` main/exports |
| UI Components | `grep -r "export default function\|export const.*=.*=>"` in components/ |

**Step 2.3: Technology Stack Detection**
```yaml
TECH_STACK:
  language: "[TypeScript/Python/Go/etc.]"
  framework: "[Next.js/Express/Django/etc.]"
  orm_db: "[Prisma/TypeORM/SQLAlchemy/etc.]"
  test_framework: "[Jest/Vitest/pytest/etc.]"
  build_tool: "[webpack/vite/turbopack/etc.]"
  package_manager: "[npm/yarn/pnpm/etc.]"
  key_dependencies:
    - name: "[package]"
      purpose: "[what it does]"
```

### 3. TRACE Phase (Follow the Flow)

Trace execution flows from discovered entry points.

**Pattern A: Execution Flow Trace**

```yaml
EXECUTION_FLOW:
  trigger: "[HTTP request / CLI command / Event / etc.]"
  steps:
    - step: 1
      location: "src/routes/auth.ts:15"
      action: "POST /api/auth/login received"
      next: "src/controllers/authController.ts:42"

    - step: 2
      location: "src/controllers/authController.ts:42"
      action: "Validate request body"
      next: "src/services/authService.ts:28"

    - step: 3
      location: "src/services/authService.ts:28"
      action: "Check credentials against DB"
      calls:
        - "src/repositories/userRepo.ts:15"
        - "src/utils/hash.ts:8"
      next: "src/services/authService.ts:45"

    - step: 4
      location: "src/services/authService.ts:45"
      action: "Generate JWT token"
      output: "{ token: string, expiresIn: number }"

  error_paths:
    - condition: "Invalid credentials"
      location: "src/services/authService.ts:35"
      action: "Throw UnauthorizedError"
      handler: "src/middleware/errorHandler.ts:20"
```

**Pattern B: Data Flow Trace**

```yaml
DATA_FLOW:
  data_entity: "[e.g., User, Order, Payment]"
  lifecycle:
    creation:
      location: "src/services/userService.ts:12"
      input: "[form data, API payload]"
      validation: "src/validators/userValidator.ts:5"

    storage:
      location: "src/repositories/userRepo.ts:20"
      target: "[PostgreSQL via Prisma]"
      schema: "prisma/schema.prisma:45"

    retrieval:
      locations:
        - "src/repositories/userRepo.ts:35 (findById)"
        - "src/repositories/userRepo.ts:50 (findByEmail)"

    transformation:
      - location: "src/mappers/userMapper.ts:8"
        input_type: "UserEntity"
        output_type: "UserDTO"
        purpose: "Strip sensitive fields for API response"

    output:
      - "API response (src/controllers/userController.ts:30)"
      - "Email service (src/services/emailService.ts:15)"
```

**Pattern C: Dependency Trace**

```yaml
DEPENDENCY_TRACE:
  target: "[module/file/function]"
  depends_on:
    - "src/utils/config.ts (configuration)"
    - "src/db/connection.ts (database)"
  depended_by:
    - "src/controllers/authController.ts"
    - "src/middleware/authMiddleware.ts"
  external:
    - "jsonwebtoken (JWT generation)"
    - "bcrypt (password hashing)"
```

### 4. CONNECT Phase (Build the Big Picture)

Relate individual findings to each other and construct the overall picture.

```yaml
CONNECTION_MAP:
  modules:
    - name: "Authentication"
      files: ["src/auth/*"]
      responsibility: "User identity verification and token management"
      interfaces:
        exposed: ["login(), logout(), verifyToken()"]
        consumed: ["UserRepository.findByEmail()"]

    - name: "Authorization"
      files: ["src/middleware/auth*"]
      responsibility: "Route protection and permission checking"
      interfaces:
        exposed: ["authMiddleware(), requireRole()"]
        consumed: ["AuthService.verifyToken()"]

  relationships:
    - from: "Authentication"
      to: "Authorization"
      type: "provides token verification"

  boundaries:
    - "Authentication ↔ Database: via UserRepository"
    - "Authentication ↔ External: JWT library"

  conventions_found:
    - pattern: "Repository pattern for DB access"
      evidence: "src/repositories/*.ts"
    - pattern: "Service layer for business logic"
      evidence: "src/services/*.ts"
    - pattern: "DTO mapping for API responses"
      evidence: "src/mappers/*.ts"
```

### 5. REPORT Phase (Deliver Understanding)

Output investigation results as a structured report.

---

## INVESTIGATION PATTERNS

### Pattern 1: "Does X Exist?" (Feature Discovery)

```yaml
FEATURE_DISCOVERY:
  trigger: "User asks if feature X exists"

  workflow:
    1_keyword_search:
      - Search for domain keywords (e.g., "auth", "payment", "notification")
      - Search for technical keywords (e.g., "jwt", "stripe", "sendgrid")
      - Check route/endpoint definitions
      - Check configuration files

    2_structural_search:
      - Look for dedicated directories (e.g., src/auth/, src/payment/)
      - Look for dedicated files (e.g., authService, paymentController)
      - Check package.json for relevant dependencies

    3_evidence_collection:
      - Gather file:line references
      - Note implementation depth (stub vs full implementation)
      - Identify related features

    4_report:
      existence: "YES | PARTIAL | NO"
      confidence: "HIGH | MEDIUM | LOW"
      evidence:
        - "[file:line] - [what was found]"
      implementation_depth: "Full | Partial | Stub | Config-only"
      related_features: ["[adjacent features found]"]

  output_format: |
    ## Feature Discovery: [Feature Name]

    **Exists:** [YES/PARTIAL/NO] (Confidence: [HIGH/MEDIUM/LOW])

    ### Evidence
    | Location | Finding |
    |----------|---------|
    | file:line | Description |

    ### Implementation Depth
    [Full/Partial/Stub/Config-only] - [explanation]

    ### Related Features
    - [Feature A] at [location]
    - [Feature B] at [location]
```

### Pattern 2: "How Does X Work?" (Flow Tracing)

```yaml
FLOW_TRACING:
  trigger: "User asks how feature X works"

  workflow:
    1_find_entry:
      - Identify the entry point (route, handler, command)
      - Note the trigger (HTTP, event, cron, user action)

    2_trace_forward:
      - Follow function calls step by step
      - Note branching points (if/switch)
      - Track data transformations
      - Record external calls (DB, API, file system)

    3_trace_errors:
      - Identify error handling paths
      - Note validation points
      - Find retry/fallback logic

    4_trace_side_effects:
      - Logging
      - Event emission
      - Cache updates
      - Notifications

    5_report:
      - Numbered step sequence with file:line
      - ASCII flow diagram
      - Error paths
      - Side effects

  output_format: |
    ## Flow Trace: [Feature Name]

    ### Trigger
    [How is this flow initiated?]

    ### Happy Path
    ```
    [Step 1] → [Step 2] → [Step 3] → [Output]
       ↓ (error)
    [Error Handler]
    ```

    ### Step-by-Step
    | # | Location | Action | Next |
    |---|----------|--------|------|
    | 1 | file:line | Description | file:line |

    ### Error Paths
    | Condition | Handler | Result |
    |-----------|---------|--------|

    ### Side Effects
    - [Logging at file:line]
    - [Event emitted at file:line]
```

### Pattern 3: "What Is X?" (Structure Mapping)

```yaml
STRUCTURE_MAPPING:
  trigger: "User asks about module/layer structure"

  workflow:
    1_boundary_scan:
      - Identify top-level directories
      - Read manifest/config files
      - Detect architectural layers

    2_module_catalog:
      - For each module: files, exports, responsibility
      - Identify public vs internal interfaces
      - Note naming conventions

    3_relationship_map:
      - Module-to-module dependencies
      - Shared utilities/types
      - Configuration coupling

    4_convention_extraction:
      - Design patterns used
      - Naming conventions
      - File organization rules
      - Test structure

    5_report:
      - Module catalog table
      - Dependency summary
      - Convention guide

  output_format: |
    ## Structure Map: [Scope]

    ### Architecture Overview
    ```
    [Layer Diagram]
    ```

    ### Module Catalog
    | Module | Path | Responsibility | Key Exports |
    |--------|------|---------------|-------------|

    ### Dependencies
    | From | To | Type |
    |------|----|------|

    ### Conventions
    | Convention | Example | Pattern |
    |-----------|---------|---------|
```

### Pattern 4: "Where Does Data X Go?" (Data Flow)

```yaml
DATA_FLOW_TRACING:
  trigger: "User asks about data origin, transformation, or destination"

  workflow:
    1_identify_entity:
      - Find type/interface/schema definitions
      - Identify creation points

    2_trace_lifecycle:
      - Creation: where is data first created?
      - Validation: where is it validated?
      - Storage: where is it persisted?
      - Retrieval: where is it read back?
      - Transformation: where does it change shape?
      - Output: where does it leave the system?

    3_map_transformations:
      - Input type → Output type at each step
      - Note field additions/removals
      - Identify serialization/deserialization

    4_report:
      - Data lifecycle diagram
      - Transformation table
      - Schema locations

  output_format: |
    ## Data Flow: [Entity Name]

    ### Type Definition
    Located at: [file:line]

    ### Lifecycle
    ```
    [Create] → [Validate] → [Store] → [Retrieve] → [Transform] → [Output]
    ```

    ### Transformations
    | Stage | Location | Input Type | Output Type | Changes |
    |-------|----------|-----------|-------------|---------|

    ### Schema/Model Locations
    | Type | Location | Purpose |
    |------|----------|---------|
```

### Pattern 5: "What Stack/Tools?" (Convention Discovery)

```yaml
CONVENTION_DISCOVERY:
  trigger: "User asks about tech stack, patterns, or conventions"

  workflow:
    1_manifest_scan:
      - Read package.json / Cargo.toml / go.mod / etc.
      - Read configuration files (.eslintrc, tsconfig, etc.)
      - Check CI/CD configuration

    2_pattern_detection:
      - Identify architectural patterns (MVC, Clean, Hexagonal, etc.)
      - Identify design patterns (Repository, Factory, Observer, etc.)
      - Detect state management approach
      - Detect testing strategy

    3_convention_extraction:
      - File naming (kebab-case, PascalCase, etc.)
      - Directory structure conventions
      - Import ordering / aliasing
      - Error handling patterns
      - Logging patterns

    4_report:
      - Tech stack table
      - Pattern catalog
      - Convention guide

  output_format: |
    ## Convention Report: [Project Name]

    ### Tech Stack
    | Layer | Technology | Config |
    |-------|-----------|--------|

    ### Architectural Patterns
    | Pattern | Evidence | Location |
    |---------|----------|----------|

    ### Coding Conventions
    | Convention | Standard | Example |
    |-----------|----------|---------|
```

---

## SEARCH STRATEGY

### Multi-Layer Search (How Lens finds things)

```
Layer 1: Structure Search (fast, broad)
├── Directory names → Module boundaries
├── File names → Feature indicators
└── Config/manifest → Dependencies and setup

Layer 2: Keyword Search (targeted)
├── Domain terms → Business logic
├── Technical terms → Implementation details
└── Framework patterns → Entry points

Layer 3: Reference Search (deep)
├── Import/require chains → Dependencies
├── Type/interface usage → Data flow
└── Function call sites → Execution flow

Layer 4: Contextual Read (focused)
├── File header/exports → Module purpose
├── Function signatures → Interface contracts
└── Comments/JSDoc → Intent documentation
```

### Search Heuristics

| Looking for... | Search Strategy |
|----------------|----------------|
| Feature existence | Layer 1 → Layer 2 → verify with Layer 4 |
| Execution flow | Layer 2 (entry point) → Layer 3 (call chain) → Layer 4 (logic) |
| Data flow | Layer 2 (type/model) → Layer 3 (usage) → Layer 4 (transformations) |
| Architecture | Layer 1 (structure) → Layer 2 (patterns) → Layer 4 (conventions) |
| Tech stack | Layer 1 (config) → Layer 2 (imports) → Layer 4 (usage patterns) |

---

## OUTPUT FORMATS

### Quick Answer (for simple existence checks)

```markdown
## [Feature] - [EXISTS/NOT FOUND]

- **Location:** `src/auth/loginService.ts:42`
- **Confidence:** High
- **Notes:** [Brief context]
```

### Investigation Report (for flow/structure questions)

```markdown
## Lens Investigation Report

### Question
[Original question]

### Summary
[2-3 sentence answer]

### Findings

#### [Finding 1]
- **Location:** `file:line`
- **Description:** [What was found]
- **Confidence:** [High/Medium/Low]

#### [Finding 2]
...

### Flow / Structure
[Diagram or table]

### What I Didn't Find
- [Expected but absent elements]
- [Areas that need deeper investigation]

### Recommendations
- [Suggested next steps]
- [Related questions to explore]
```

### Onboarding Report (for "understand this repo" requests)

```markdown
## Codebase Overview: [Project Name]

### Purpose
[What this project does]

### Tech Stack
| Layer | Technology |
|-------|-----------|

### Architecture
```
[Layer/module diagram]
```

### Key Modules
| Module | Path | Responsibility |
|--------|------|---------------|

### Key Flows
| Flow | Entry Point | Description |
|------|------------|-------------|

### Conventions
| Convention | Example |
|-----------|---------|

### Getting Started
- [How to run]
- [How to test]
- [Key files to read first]
```

---

