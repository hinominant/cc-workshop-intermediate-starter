# Grove Handoff Formats

Standardized handoff templates for agent collaboration.

---

## Input Handoffs (→ Grove)

### NEXUS_TO_GROVE_HANDOFF

```markdown
## NEXUS_TO_GROVE_HANDOFF

**Task**: [Repository audit / Structure design / Migration plan / Docs scaffold]
**Repository**: [Path or description]
**Language**: [TypeScript / Python / Go / Rust / Mixed / auto-detect]
**Framework**: [Next.js / FastAPI / Gin / etc.]
**Type**: [New project / Existing project restructure]

**Context**:
- Team size: [Solo / Small (2-5) / Medium (6-15) / Large (15+)]
- Monorepo: [Yes / No]
- Current issues: [Description of structural problems]

**Request**: [Specific deliverable]
```

### ATLAS_TO_GROVE_HANDOFF

```markdown
## ATLAS_TO_GROVE_HANDOFF

**Architecture Decision**: [ADR reference]
**Impact on Structure**: [New modules / split packages / merge directories]
**Modules Affected**: [List of directories]

**Request**: Restructure repository to align with architecture decision
```

### SCRIBE_TO_GROVE_HANDOFF

```markdown
## SCRIBE_TO_GROVE_HANDOFF

**Documents Created**: [List of new documents]
**Directory Needed**: [Subdirectory that should exist]
**Naming Convention**: [Expected file naming pattern]

**Request**: Ensure docs/ structure supports created documents
```

---

## Output Handoffs (Grove →)

### GROVE_TO_SCRIBE_HANDOFF

```markdown
## GROVE_TO_SCRIBE_HANDOFF

**Docs Structure Created**:
| Directory | Purpose | Status |
|-----------|---------|--------|
| docs/prd/ | Product Requirements | Created |
| docs/specs/ | Technical Specifications | Created |
| docs/design/ | Design Documents | Created |
| docs/checklists/ | Checklists | Created |
| docs/test-specs/ | Test Specifications | Created |
| docs/adr/ | Architecture Decisions | Created |

**Naming Conventions**:
- PRD: `PRD-{feature}.md`
- SRS: `SRS-{feature}.md`
- HLD/LLD: `HLD-{feature}.md` / `LLD-{feature}.md`
- Checklist: `IMPL-{feature}.md` / `REVIEW-{category}.md`
- Test Spec: `TEST-{feature}.md`
- ADR: `ADR-{NNN}-{title}.md`

**Request**: Populate initial documents for the project
```

### GROVE_TO_GEAR_HANDOFF

```markdown
## GROVE_TO_GEAR_HANDOFF

**Structure Changes**: [Description of directory changes]
**CI Impact**:
- Test paths: [old → new]
- Build paths: [old → new]
- Config locations: [old → new]

**Files Moved**:
| From | To |
|------|-----|
| [old path] | [new path] |

**Request**: Update CI/CD configuration to match new structure
```

### GROVE_TO_GUARDIAN_HANDOFF

```markdown
## GROVE_TO_GUARDIAN_HANDOFF

**Migration Commits**: [List of commits]
**PR Strategy**: [Single PR / Multiple PRs]
**Files Changed**: [Count]

**Review Focus**:
- Import paths correctly updated
- No broken references
- Test paths match configuration
- Build artifacts path correct

**Request**: Review and prepare migration PR
```

### GROVE_TO_SCAFFOLD_HANDOFF

```markdown
## GROVE_TO_SCAFFOLD_HANDOFF

**Infrastructure Directory**: infra/
**Structure Created**:
```
infra/
├── terraform/
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
└── k8s/
```

**Request**: Populate infrastructure configuration files
```

### GROVE_TO_ANVIL_HANDOFF

```markdown
## GROVE_TO_ANVIL_HANDOFF

**Tools Directory**: tools/
**Scripts Directory**: scripts/
**Structure Created**:
```
tools/
└── {tool-name}/
scripts/
├── setup.sh
├── seed.sh
└── deploy.sh
```

**Request**: Implement internal tools and helper scripts
```

### GROVE_TO_SWEEP_HANDOFF

```markdown
## GROVE_TO_SWEEP_HANDOFF

**Audit Findings**:
- Orphaned files: [List]
- Duplicate directories: [List]
- Stale documents: [List]

**Request**: Clean up identified orphaned/stale files
```

---

## Collaboration Patterns

### Pattern A: New Project Setup
```
Nexus → Grove (structure) → Scribe (docs) → Gear (CI) → Scaffold (infra)
```

### Pattern B: Repository Audit & Fix
```
Nexus → Grove (audit) → Grove (migration plan) → Guardian (PR) → Gear (CI update)
```

### Pattern C: Docs Scaffold
```
Nexus → Grove (docs structure) → Scribe (populate docs)
```

### Pattern D: Architecture-Driven Restructure
```
Atlas (ADR) → Grove (restructure) → Gear (CI update) → Guardian (PR)
```

### Pattern E: Post-Migration Cleanup
```
Grove (restructure) → Sweep (cleanup orphans) → Guardian (PR)
```

### Pattern F: Full Project Bootstrap
```
Nexus → Grove (structure) → Scribe (PRD/HLD) → Scaffold (infra) → Gear (CI) → Anvil (scripts)
```
