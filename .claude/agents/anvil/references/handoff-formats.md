# Anvil Handoff Formats

Standardized handoff templates for agent collaboration.

---

## Input Handoffs (→ Anvil)

### FORGE_TO_ANVIL_HANDOFF

```markdown
## FORGE_TO_ANVIL_HANDOFF

**Prototype CLI**: [Description]
**Prototype Location**: [File path]
**Core Functionality**: [Working / Partial]

**Production Requirements**:
- Error handling: [exit codes, CTRL+C]
- Output formatting: [--json, --quiet flags]
- Help text: [comprehensive --help with examples]
- Shell completion: [bash/zsh/fish support]

**Request**: Polish prototype CLI to production quality
```

### BUILDER_TO_ANVIL_HANDOFF

```markdown
## BUILDER_TO_ANVIL_HANDOFF

**Business Logic Ready**: [Description]
**Module Location**: [File path]
**API Surface**:
| Function | Input | Output |
|----------|-------|--------|
| [name] | [type] | [type] |

**CLI Requirements**:
- Command interface: [command structure]
- User interaction: [interactive prompts needed?]
- Output format: [human + JSON]

**Request**: Build CLI interface for existing business logic
```

### GEAR_TO_ANVIL_HANDOFF

```markdown
## GEAR_TO_ANVIL_HANDOFF

**Tool Config Issue**: [Description]
**Current Config**: [File path]
**Problem**: [What's wrong with current setup]

**Requirements**:
- Tool: [Biome/Ruff/golangci-lint/etc.]
- Language: [TypeScript/Python/Go/Rust]
- Integration: [IDE, pre-commit, CI]

**Request**: Set up or fix development tool configuration
```

### NEXUS_TO_ANVIL_HANDOFF

```markdown
## NEXUS_TO_ANVIL_HANDOFF

**CLI Task**: [Description]
**Language**: [TypeScript/Python/Go/Rust]
**Type**: [CLI command / TUI component / Tool setup]

**Context**:
- Project: [project description]
- Existing tools: [current toolchain]
- Target users: [developers / CI / end users]

**Request**: [Specific CLI/TUI/tool deliverable]
```

---

## Output Handoffs (Anvil →)

### ANVIL_TO_GEAR_HANDOFF

```markdown
## ANVIL_TO_GEAR_HANDOFF

**CLI Created**: [Command name and description]
**Files**:
| File | Purpose |
|------|---------|
| [path] | [description] |

**CI Integration Needed**:
- Non-TTY behavior: [verified]
- JSON output: [--json flag available]
- Exit codes: [0=success, 1=error, 2=usage, 130=interrupted]
- Environment vars: [list of env vars used]

**Request**: Add CLI to CI/CD workflow
```

### ANVIL_TO_BUILDER_HANDOFF

```markdown
## ANVIL_TO_BUILDER_HANDOFF

**CLI Interface Ready**: [Command name]
**CLI Contract**:
| Input | Type | Description |
|-------|------|-------------|
| [arg/flag] | [type] | [purpose] |

**Output Contract**:
| Field | Type | Description |
|-------|------|-------------|
| [field] | [type] | [purpose] |

**Error Types**: [List of expected error types]

**Request**: Implement business logic behind CLI interface
```

### ANVIL_TO_RADAR_HANDOFF

```markdown
## ANVIL_TO_RADAR_HANDOFF

**CLI Created**: [Command name]
**File**: [path/to/cli.ts]

**Test Scenarios**:
| Scenario | Expected Exit Code | Expected Output |
|----------|-------------------|-----------------|
| Happy path | 0 | Contains "Success" |
| Invalid args | 2 | Contains "Usage:" |
| --help flag | 0 | Contains help text |
| --json flag | 0 | Valid JSON |
| Non-TTY | 0 | No ANSI codes |
| CTRL+C | 130 | Cleanup executed |

**Request**: Add CLI command tests
```

### ANVIL_TO_QUILL_HANDOFF

```markdown
## ANVIL_TO_QUILL_HANDOFF

**CLI Created**: [Command name]
**Commands**:
| Command | Description | Example |
|---------|-------------|---------|
| [cmd] | [what it does] | [usage example] |

**Documentation Needed**:
- README CLI section: [usage, examples, flags]
- Man page: [if applicable]
- Shell completion instructions: [bash/zsh/fish]

**Request**: Write CLI documentation
```

### ANVIL_TO_JUDGE_HANDOFF

```markdown
## ANVIL_TO_JUDGE_HANDOFF

**CLI Code Written**: [Description]
**Files Changed**:
| File | Lines | Change |
|------|-------|--------|
| [path] | [N] | [what changed] |

**Review Focus Areas**:
- Error handling: [exit codes correct?]
- Cross-platform: [Windows/macOS/Linux compat?]
- Security: [no secrets in output?]
- UX: [help text clear? error messages actionable?]

**Request**: Review CLI code quality
```

---

## Collaboration Patterns

### Pattern A: Prototype to Production
```
Forge (prototype) → FORGE_TO_ANVIL → Anvil (production CLI) → ANVIL_TO_RADAR → Radar (tests)
```

### Pattern B: Business Logic CLI
```
Builder (logic) → BUILDER_TO_ANVIL → Anvil (CLI interface) → ANVIL_TO_JUDGE → Judge (review)
```

### Pattern C: Tool Setup
```
Gear (CI need) → GEAR_TO_ANVIL → Anvil (tool config) → ANVIL_TO_GEAR → Gear (CI integration)
```

### Pattern D: Full CLI Pipeline
```
Forge → Anvil (CLI) → ANVIL_TO_RADAR → Radar (tests) → ANVIL_TO_GEAR → Gear (CI) → ANVIL_TO_QUILL → Quill (docs)
```

### Pattern E: CLI Documentation
```
Anvil (CLI created) → ANVIL_TO_QUILL → Quill (README/man page) → Judge (review)
```

### Pattern F: Cross-Agent Tool Setup
```
Nexus → NEXUS_TO_ANVIL → Anvil (linter/formatter) → ANVIL_TO_GEAR → Gear (CI hooks)
```

### Pattern G: CLI Testing
```
Anvil (CLI) → ANVIL_TO_RADAR → Radar (unit tests) → ANVIL_TO_JUDGE → Judge (review)
```

### Pattern H: CLI Code Review
```
Anvil (CLI) → ANVIL_TO_JUDGE → Judge (review) → Anvil (fixes) → ANVIL_TO_GEAR → Gear (deploy)
```
