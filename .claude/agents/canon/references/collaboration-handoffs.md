# canon — 連携ハンドオフ 詳細 (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## AGENT COLLABORATION

### Collaboration Architecture

```
                    ┌─────────────┐
                    │   Canon     │
                    │ (Standards) │
                    └──────┬──────┘
                           │
      ┌────────────────────┼────────────────────┐
      │                    │                    │
      ▼                    ▼                    ▼
┌──────────┐        ┌──────────┐        ┌──────────┐
│ Sentinel │        │ Palette  │        │ Builder  │
│(Security)│        │ (A11y)   │        │ (Code)   │
└──────────┘        └──────────┘        └──────────┘
      │                    │                    │
      └────────────────────┴────────────────────┘
                           │
                           ▼
                    ┌──────────┐
                    │  Radar   │
                    │ (Tests)  │
                    └──────────┘
```

### Input Partners (Who Calls Canon)

| Partner | Input | Trigger |
|---------|-------|---------|
| **User** | Direct standards compliance request | `/canon` invocation |
| **Sentinel** | Security issue needs standards context | OWASP verification |
| **Gateway** | API design needs standards review | OpenAPI/RFC compliance |
| **Atlas** | Architecture needs standards assessment | 12-App, ISO evaluation |
| **Judge** | Code review needs standards verification | Quality standards check |

### Output Partners (Canon Delegates To)

| Partner | Output | When |
|---------|--------|------|
| **Builder** | Implementation fixes | Code changes needed for compliance |
| **Sentinel** | Security remediation | OWASP/security standard violations |
| **Palette** | Accessibility fixes | WCAG violations |
| **Scribe** | Compliance documentation | Audit preparation, compliance proof |
| **Quill** | Standards reference docs | README/documentation updates |

### Collaboration Patterns

#### Pattern A: Security Standard Audit
```
Sentinel → Canon → Builder → Radar
         (detect) (assess) (fix) (verify)
```

#### Pattern B: API Standard Compliance
```
Gateway → Canon → Gateway
        (design) (verify) (revise)
```

#### Pattern C: Accessibility Audit
```
Echo → Canon → Palette → Voyager
     (UX)   (assess) (fix)   (E2E test)
```

#### Pattern D: Architecture Assessment
```
Atlas → Canon → Atlas
      (analyze) (standards) (ADR)
```

#### Pattern E: Code Quality Gate
```
Judge → Canon → Zen
      (review) (standards) (refactor)
```

### Handoff Templates

**Canon → Builder (Implementation Fix):**
```markdown
## Canon → Builder Handoff

### Compliance Finding
- **Finding ID:** CANON-XXX
- **Standard:** [Standard Name and Version]
- **Citation:** [Specific section/requirement]
- **Severity:** [Critical/High/Medium/Low]

### Current State
- **Location:** [File:line]
- **Issue:** [Description of non-compliance]
- **Evidence:** [Code snippet or configuration]

### Required Change
- **Requirement:** [What the standard requires]
- **Recommendation:** [How to achieve compliance]
- **Example:** [Compliant code example if applicable]

### Acceptance Criteria
- [ ] [Specific testable criterion 1]
- [ ] [Specific testable criterion 2]
- [ ] Standard requirement met: [citation]

### Verification
After implementation, verify with:
- [ ] Automated test: [test name/command]
- [ ] Manual check: [verification steps]
```

**Canon → Sentinel (Security Standard):**
```markdown
## Canon → Sentinel Handoff

### Security Standard Violation
- **Standard:** OWASP ASVS [section]
- **Requirement:** [Requirement text]
- **Severity:** [Critical/High]

### Finding Details
- **CWE:** [CWE-XXX if applicable]
- **Location:** [File:line]
- **Vulnerability:** [Description]

### Remediation Guidance
- **Required Fix:** [What needs to change]
- **Reference Implementation:** [Link or example]
- **Testing:** [How to verify fix]

### Security Considerations
- [Additional security context]
- [Related vulnerabilities to check]
```

**Canon → Palette (Accessibility Standard):**
```markdown
## Canon → Palette Handoff

### Accessibility Violation
- **Standard:** WCAG [version] [level]
- **Success Criterion:** [SC number and name]
- **Severity:** [Based on impact]

### Finding Details
- **Component:** [Component name/location]
- **Issue:** [Description of violation]
- **Impact:** [Who is affected and how]

### Remediation Guidance
- **Requirement:** [What WCAG requires]
- **Technique:** [WCAG technique reference]
- **Example:** [Accessible implementation]

### Testing
- [ ] Screen reader test: [steps]
- [ ] Keyboard navigation: [steps]
- [ ] Automated scan: [tool/command]
```

**Canon → Scribe (Documentation):**
```markdown
## Canon → Scribe Handoff

### Compliance Documentation Request
- **Purpose:** [Audit preparation / Compliance proof / Policy document]
- **Standards:** [Standards to document compliance for]

### Required Documentation
- [ ] Compliance summary report
- [ ] Evidence collection
- [ ] Remediation tracking
- [ ] Sign-off records

### Format Requirements
- **Output Format:** [Markdown / Word / PDF]
- **Audience:** [Internal / External auditor / Customer]
- **Detail Level:** [Executive summary / Detailed evidence]
```

---

