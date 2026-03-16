# Documentation Patterns Reference

## JSDoc/TSDoc Annotation Decision Tree

```
Function/Class/Interface
├── Is it exported (public)?
│   ├── YES → Must have JSDoc/TSDoc
│   │   ├── Has parameters? → Add @param for each
│   │   ├── Has return value? → Add @returns
│   │   ├── Can throw? → Add @throws
│   │   ├── Is it complex? → Add @example
│   │   └── Is it deprecated? → Add @deprecated with migration
│   └── NO (internal)
│       ├── Is it complex/non-obvious? → Add brief comment
│       └── Is it straightforward? → No comment needed
```

## Comment Quality Spectrum

| Level | Type | Example | Verdict |
|-------|------|---------|---------|
| 1 | Noise | `i++ // increment i` | Never do |
| 2 | What | `// get user` | Avoid |
| 3 | How | `// use binary search for O(log n)` | Sometimes |
| 4 | Why | `// fallback to default rate per 2024 tax law` | Always |
| 5 | Context | `// Auth0 returns nested object; flatten for our API` | Always |

## Documentation Rot Prevention

### Common Rot Patterns

| Pattern | Symptom | Prevention |
|---------|---------|------------|
| Stale README | Wrong install commands | CI link-check |
| Orphan TODO | `TODO` without ticket | Lint rule requiring ticket |
| Lying comment | Comment contradicts code | Review checklist item |
| Version drift | Docs reference old API | Automated doc generation |
| Dead link | 404 in markdown | `markdown-link-check` in CI |

### Prevention Automation

```json
{
  "scripts": {
    "docs:lint": "markdownlint docs/**/*.md",
    "docs:links": "markdown-link-check README.md docs/**/*.md",
    "docs:coverage": "typedoc --emit none && node scripts/doc-audit.js",
    "docs:stale": "git log --diff-filter=M --since='6 months ago' -- '*.md' | wc -l"
  }
}
```

## Type Documentation Priority Matrix

| Urgency | Type | Action |
|---------|------|--------|
| P0 | `any` in public API | Replace immediately |
| P1 | `any` in API response | Define interface |
| P2 | `any` in internal utility | Replace with `unknown` + guard |
| P3 | `any` in test files | Low priority |
| P4 | `any` in deprecated code | Skip (will be removed) |

## README Section Ordering

### Library/Package
1. Title + Badge + Description
2. Installation
3. Quick Start
4. API Reference
5. Configuration
6. Examples
7. Contributing
8. License

### Application
1. Title + Description
2. Prerequisites
3. Getting Started (clone, install, env, db, run)
4. Project Structure
5. Available Scripts
6. Deployment
7. Contributing
8. License

### CLI Tool
1. Title + Description
2. Installation (global + npx)
3. Usage (basic syntax)
4. Commands (each with options)
5. Configuration
6. Examples
7. License
