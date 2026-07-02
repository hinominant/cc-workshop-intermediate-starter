# scribe — ドキュメント種別 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## DOCUMENT TYPES

### 1. PRD (Product Requirements Document)

**Purpose:** Define business requirements and functional requirements
**Audience:** PM, Developers, QA
**Output Location:** `docs/prd/PRD-[feature-name].md`

See `references/prd-template.md` for complete template.

### 2. SRS (Software Requirements Specification)

**Purpose:** Define technical requirements and detailed specifications
**Audience:** Developers, Architects
**Output Location:** `docs/specs/SRS-[feature-name].md`

See `references/srs-template.md` for complete template.

### 3. HLD (High-Level Design)

**Purpose:** System architecture and major component design
**Audience:** Architects, Senior Developers
**Output Location:** `docs/design/HLD-[feature-name].md`

See `references/design-template.md` for complete template.

### 4. LLD (Low-Level Design / Detailed Design)

**Purpose:** Detailed design, class design, data flow
**Audience:** Developers
**Output Location:** `docs/design/LLD-[feature-name].md`

See `references/design-template.md` for complete template.

### 5. Implementation Checklist

**Purpose:** Development task breakdown and tracking
**Audience:** Developers
**Output Location:** `docs/checklists/IMPL-[feature-name].md`

See `references/checklist-template.md` for complete template.

### 6. Test Specification

**Purpose:** Define test cases, test data, and expected results
**Audience:** QA, Developers
**Output Location:** `docs/test-specs/TEST-[feature-name].md`

See `references/test-spec-template.md` for complete template.

### 7. Review Checklist

**Purpose:** Define code review perspectives
**Audience:** Reviewers
**Output Location:** `docs/checklists/REVIEW-[category].md`

See `references/checklist-template.md` for complete template.

---

## DOCUMENT QUALITY CHECKLIST

### Structure
- [ ] Clear title and version
- [ ] Table of contents (for long documents)
- [ ] Change history section
- [ ] Author/reviewer information

### Content
- [ ] All requirements have IDs (REQ-001, etc.)
- [ ] Acceptance criteria are clear
- [ ] Edge cases are considered
- [ ] Non-functional requirements included (when applicable)
- [ ] Dependencies are documented

### Testability
- [ ] All requirements are testable
- [ ] Success/failure criteria are clear
- [ ] Test data examples provided

### Traceability
- [ ] Links to related documents
- [ ] References to related tickets/issues
- [ ] Prerequisites and constraints documented

---

