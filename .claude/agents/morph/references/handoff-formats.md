# Handoff Formats

Morphエージェントと他エージェント間の連携フォーマット。

---

## INPUT Handoffs (Morph への入力)

### SCRIBE_TO_MORPH_HANDOFF

Scribeが作成した仕様書・設計書をMorphに変換依頼する。

```markdown
## Morph Handoff (from Scribe)

### Document Summary
- **Type:** [PRD/SRS/HLD/LLD/Checklist/TestSpec]
- **Source:** [docs/path/to/document.md]
- **Title:** [Document Title]
- **Version:** [v1.0.0]

### Conversion Requirements
- **Target Format:** [PDF/Word/HTML]
- **Template:** [corporate/technical/default/none]
- **Include TOC:** [yes/no]
- **Include Diagrams:** [yes/no]
- **Number Sections:** [yes/no]

### Styling Preferences
- **Page Size:** [A4/Letter]
- **Language:** [ja/en]
- **Font:** [default/specified font]
- **Header/Footer:** [yes/no - description]

### Delivery
- **Audience:** [internal/external/stakeholders]
- **Output Path:** [path/to/output.pdf]
- **Deadline:** [YYYY-MM-DD or ASAP]

### Notes
- [Special requirements or considerations]

---
Suggested command: `/Morph convert [source] to [format]`
```

---

### HARVEST_TO_MORPH_HANDOFF

Harvestのレポートをフォーマット変換する。

```markdown
## Morph Handoff (from Harvest)

### Report Summary
- **Report Type:** [Weekly/Monthly/Release/Custom]
- **Source:** [reports/path/to/report.md]
- **Period:** [YYYY-MM-DD to YYYY-MM-DD]

### Conversion Requirements
- **Target Format:** [PDF/Word]
- **Template:** [management/executive/technical]
- **Include Charts:** [yes/no]
- **Include PR List:** [yes/no]

### Distribution
- **Recipients:** [management/team/stakeholders]
- **Output Path:** [path/to/report.pdf]
- **Email Ready:** [yes/no]

### Notes
- [Special formatting for charts]
- [Confidentiality level]

---
Suggested command: `/Morph convert [source] to PDF --template=management`
```

---

### CANVAS_TO_MORPH_HANDOFF

Canvas作成の図をエクスポートする。

```markdown
## Morph Handoff (from Canvas)

### Diagram Summary
- **Diagram Type:** [Flowchart/Sequence/ER/Class/etc.]
- **Source:** [.agents/diagrams/project/diagram.md or .drawio]
- **Format:** [Mermaid/draw.io/ASCII]

### Export Requirements
- **Target Format:** [PDF/PNG/SVG]
- **Resolution:** [standard/high/print]
- **Background:** [transparent/white]
- **Scale:** [1x/2x/3x]

### Usage
- **Purpose:** [documentation/presentation/print]
- **Output Path:** [path/to/diagram.pdf]

### Notes
- [Color mode requirements]
- [Embedding instructions]

---
Suggested command: `/Morph export diagram to [format]`
```

---

### QUILL_TO_MORPH_HANDOFF

Quill作成のドキュメントを変換する。

```markdown
## Morph Handoff (from Quill)

### Documentation Summary
- **Doc Type:** [README/API Docs/Guide]
- **Source:** [path/to/documentation.md]
- **Target Audience:** [developers/users/all]

### Conversion Requirements
- **Target Format:** [PDF/HTML]
- **Include Code Examples:** [yes/no]
- **Syntax Highlighting:** [yes/no - style]
- **Include API Reference:** [yes/no]

### Output
- **Purpose:** [distribution/archive/print]
- **Output Path:** [path/to/docs.pdf]

### Notes
- [Code block formatting preferences]
- [Link handling]

---
Suggested command: `/Morph convert docs to [format]`
```

---

### SHERPA_TO_MORPH_HANDOFF

Sherpaの進捗レポートをPDF化する。

```markdown
## Morph Handoff (from Sherpa)

### Progress Report Summary
- **Epic:** [Epic Name]
- **Source:** [.sherpa/epics/epic-name/progress.md]
- **Status:** [In Progress/Complete]
- **Completion:** [X%]

### Conversion Requirements
- **Target Format:** [PDF]
- **Include:**
  - [ ] Task breakdown
  - [ ] Progress chart
  - [ ] Timeline
  - [ ] Blockers summary

### Distribution
- **Recipients:** [project manager/team/stakeholders]
- **Output Path:** [reports/progress/epic-progress.pdf]

### Notes
- [Gantt chart inclusion]
- [Risk highlights]

---
Suggested command: `/Morph generate progress report`
```

---

## OUTPUT Handoffs (Morph からの出力)

### MORPH_TO_GUARDIAN_HANDOFF

変換済みドキュメントをPR添付用に渡す。

```markdown
## Guardian Handoff (from Morph)

### Converted Document
- **Original:** [docs/spec/feature.md]
- **Converted:** [docs/spec/feature.pdf]
- **Format:** [PDF]
- **Size:** [X KB]

### Quality Verification
- **Structure:** [PASS/FAIL]
- **Styling:** [PASS/FAIL]
- **Completeness:** [PASS/FAIL]
- **Score:** [X/10]

### Attachment Info
- **Suggested Filename:** [feature-spec-v1.0.pdf]
- **PR Context:** [Feature implementation PR]
- **Visibility:** [internal/external]

### Notes
- [Any conversion notes]
- [Review recommendations]

---
Ready for PR attachment.
```

---

### MORPH_TO_NEXUS_HANDOFF

Nexusオーケストレーション用のハンドオフ。

```markdown
## NEXUS_HANDOFF

- Step: [X/Y]
- Agent: Morph
- Summary: Converted [source] to [format] for [purpose]

- Key findings / decisions:
  - Source format: [Markdown/Word/HTML]
  - Target format: [PDF/Word/HTML]
  - Tool used: [pandoc/LibreOffice/wkhtmltopdf]
  - Template: [template name or none]
  - Quality score: [X/10]

- Artifacts (files created):
  - [output file path]

- Risks / trade-offs:
  - [Feature losses if any]
  - [Styling limitations]
  - [Quality notes]

- Open questions (blocking/non-blocking):
  - [Unresolved conversion issues]

- Pending Confirmations:
  - Trigger: [ON_FORMAT_CHOICE/etc. if any]
  - Question: [Question for user]
  - Options: [Available options]
  - Recommended: [Recommended option]

- User Confirmations:
  - Q: [Previous question] → A: [User's answer]

- Suggested next agent: Guardian | Archive | DONE (reason)
- Next action: CONTINUE | VERIFY | DONE
```

---

## AUTORUN Context Format

### _AGENT_CONTEXT (Nexus → Morph)

```yaml
_AGENT_CONTEXT:
  Role: Morph
  Task: Convert document to specified format
  Mode: AUTORUN
  Chain: [Scribe, Canvas]  # Previous agents in chain
  Input:
    source: "docs/prd/PRD-feature.md"
    target_format: "PDF"
    template: "corporate"
    options:
      toc: true
      toc_depth: 3
      number_sections: true
      page_size: "A4"
      language: "ja"
  Constraints:
    - "Must use company template"
    - "Include all diagrams"
    - "Deadline: EOD"
  Expected_Output: "docs/prd/PRD-feature.pdf"
```

### _STEP_COMPLETE (Morph → Nexus)

```yaml
_STEP_COMPLETE:
  Agent: Morph
  Status: SUCCESS  # SUCCESS | PARTIAL | BLOCKED | FAILED
  Output:
    conversion:
      source: "docs/prd/PRD-feature.md"
      output: "docs/prd/PRD-feature.pdf"
      format: "PDF"
      tool: "pandoc + xelatex"
      template: "corporate"
      pages: 15
      size_kb: 256
    quality_check:
      structure: PASS
      styling: PASS
      completeness: PASS
      score: 9/10
  Handoff:
    Format: MORPH_TO_GUARDIAN_HANDOFF
    Content: |
      PDF ready for distribution.
      Template: corporate
      Quality verified.
  Artifacts:
    - "docs/prd/PRD-feature.pdf"
  Warnings:
    - "Complex table on page 5 may render differently in print"
  Risks:
    - "None identified"
  Next: Guardian  # Or VERIFY | DONE
  Reason: "PDF ready for PR attachment"
```

---

## Batch Conversion Handoff

### BATCH_CONVERSION_REQUEST

```markdown
## Batch Conversion Request

### Files to Convert
| # | Source | Target Format | Template | Priority |
|---|--------|---------------|----------|----------|
| 1 | docs/prd/PRD-auth.md | PDF | corporate | High |
| 2 | docs/prd/PRD-payment.md | PDF | corporate | High |
| 3 | docs/design/HLD-system.md | PDF | technical | Medium |
| 4 | reports/weekly/week-02.md | PDF | management | Low |

### Common Options
- Include TOC: yes
- Number sections: yes
- Page size: A4
- Language: ja

### Output Directory
- Path: `output/converted/`
- Naming: `{original-name}.pdf`

### Deadline
- [YYYY-MM-DD HH:MM or ASAP]

---
Suggested command: `/Morph batch convert --config=batch.yaml`
```

### BATCH_CONVERSION_RESULT

```markdown
## Batch Conversion Complete

### Results
| # | Source | Output | Status | Size | Notes |
|---|--------|--------|--------|------|-------|
| 1 | PRD-auth.md | PRD-auth.pdf | ✅ SUCCESS | 128KB | - |
| 2 | PRD-payment.md | PRD-payment.pdf | ✅ SUCCESS | 156KB | - |
| 3 | HLD-system.md | HLD-system.pdf | ⚠️ PARTIAL | 245KB | 1 image missing |
| 4 | week-02.md | week-02.pdf | ✅ SUCCESS | 89KB | - |

### Summary
- **Total:** 4 files
- **Success:** 3 files
- **Partial:** 1 file
- **Failed:** 0 files
- **Total Size:** 618KB

### Issues
1. HLD-system.md: Image `diagram-v2.png` not found, placeholder used

### Output Location
- `output/converted/`

---
Batch conversion completed.
```

---

## Template Selection Guide

### Template-to-Audience Mapping

| Template | Best For | Features |
|----------|----------|----------|
| **corporate** | External stakeholders, Management | Logo, formal header/footer, professional fonts |
| **technical** | Developers, Engineers | Code highlighting, monospace sections, dark mode option |
| **management** | Executives, Project managers | Summary-focused, charts, KPI highlights |
| **default** | Internal team, Quick drafts | Clean, minimal, fast to generate |
| **print** | Physical printing | High-res, CMYK colors, crop marks |

### Handoff with Template Recommendation

```markdown
## Template Recommendation

Based on the document type and audience:

| Document | Audience | Recommended Template |
|----------|----------|---------------------|
| PRD | Stakeholders | corporate |
| SRS | Developers | technical |
| HLD | Architects | technical |
| Progress Report | Management | management |
| README | Developers | default |

---
Confirm template selection or specify custom.
```
