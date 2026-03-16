# Quality Assurance Guide

> Document conversion quality verification and metrics

This guide defines quality standards, verification processes, and automated checks for document conversion.

---

## Quality Metrics Definition

### Core Metrics

| Metric | Weight | Description | Measurement |
|--------|--------|-------------|-------------|
| **Structure Fidelity** | 30% | Preservation of document structure | Heading levels, lists, tables retained |
| **Visual Fidelity** | 25% | Styling consistency | Fonts, colors, layout matching |
| **Content Integrity** | 30% | No data loss | Text, images, links complete |
| **Metadata Preservation** | 15% | Document info retained | Title, author, date maintained |

### Structure Fidelity (30%)

**Checklist:**
- [ ] All heading levels preserved (H1-H6)
- [ ] Nested lists maintain hierarchy
- [ ] Tables retain rows, columns, and spans
- [ ] Code blocks preserve syntax and formatting
- [ ] Block quotes maintain structure
- [ ] Horizontal rules rendered
- [ ] Footnotes linked correctly

**Scoring:**
```
Score = (Preserved Elements / Total Elements) × 100
```

### Visual Fidelity (25%)

**Checklist:**
- [ ] Primary font matches specification
- [ ] Font sizes consistent across headings
- [ ] Text colors render correctly
- [ ] Background colors applied
- [ ] Line height appropriate
- [ ] Margins and padding consistent
- [ ] Page breaks at logical locations

**Scoring:**
```
Score = (Correct Renderings / Total Style Elements) × 100
```

### Content Integrity (30%)

**Checklist:**
- [ ] All text content transferred
- [ ] Images embedded and visible
- [ ] Internal links functional
- [ ] External links preserved
- [ ] Mathematical formulas rendered
- [ ] Special characters display correctly
- [ ] No truncation or overflow

**Scoring:**
```
Score = (Complete Elements / Total Content Elements) × 100
```

### Metadata Preservation (15%)

**Checklist:**
- [ ] Title field populated
- [ ] Author information retained
- [ ] Creation date preserved
- [ ] Modification date updated
- [ ] Keywords/tags transferred
- [ ] Custom properties maintained

**Scoring:**
```
Score = (Present Fields / Expected Fields) × 100
```

---

## Quality Grades

| Score | Grade | Meaning | Action |
|-------|-------|---------|--------|
| 90-100 | A | Production ready | Deliver immediately |
| 80-89 | B | Minor issues | Review before delivery |
| 70-79 | C | Notable issues | Fix before delivery |
| 60-69 | D | Significant issues | Reconvert with fixes |
| <60 | F | Unacceptable | Investigate root cause |

### Grade Criteria

**Grade A (90-100):**
- All structure preserved
- Visual appearance matches intent
- No content loss
- All metadata present
- Ready for distribution

**Grade B (80-89):**
- Minor styling differences
- All content present
- Small visual inconsistencies
- Acceptable for internal use

**Grade C (70-79):**
- Some structure issues
- Noticeable styling problems
- Content complete but formatting off
- Requires review

**Grade D (60-69):**
- Structural problems
- Missing or broken styles
- Some content issues
- Needs reconversion

**Grade F (<60):**
- Major structure loss
- Critical content missing
- Broken rendering
- Complete redo required

---

## Verification Process

### Pre-Conversion Verification

**Step 1: Source Analysis**
```bash
# Check file size and type
file input.md
stat input.md

# Count structural elements
grep -c "^#" input.md        # Headings
grep -c "^\*" input.md       # List items
grep -c "!\[" input.md       # Images
grep -c "\[.*\](" input.md   # Links
```

**Step 2: Dependency Check**
```bash
# List embedded images
grep -oE '!\[.*\]\(([^)]+)\)' input.md | grep -oE '\([^)]+\)'

# Verify image files exist
for img in $(grep -oE '!\[.*\]\(([^)]+)\)' input.md | grep -oE '\([^)]+\)' | tr -d '()'); do
  [ -f "$img" ] && echo "OK: $img" || echo "MISSING: $img"
done
```

**Step 3: Feature Inventory**
```markdown
## Pre-Conversion Checklist

**Source:** [filename]
**Format:** [Markdown/Word/HTML]

### Content Inventory
- Headings: [H1: X, H2: Y, H3: Z]
- Paragraphs: [count]
- Lists: [ordered: X, unordered: Y]
- Tables: [count, max columns]
- Images: [count, formats]
- Code blocks: [count, languages]
- Links: [internal: X, external: Y]

### Dependencies
- Images: [all present / missing: list]
- Fonts: [standard / custom: list]
- Stylesheets: [none / list]

### Risk Assessment
- Complex tables: [yes/no]
- Embedded media: [yes/no]
- Custom styling: [yes/no]
- Cross-references: [yes/no]
```

### During-Conversion Monitoring

**Capture Warnings:**
```bash
# Pandoc with verbose output
pandoc input.md -o output.pdf --pdf-engine=xelatex -v 2>&1 | tee conversion.log

# Filter warnings
grep -i "warning" conversion.log
grep -i "error" conversion.log
```

**Common Warnings:**
| Warning | Impact | Solution |
|---------|--------|----------|
| Missing image | High | Locate or remove reference |
| Font not found | Medium | Specify alternative font |
| Table overflow | Medium | Adjust column widths |
| Unknown extension | Low | May be safely ignored |

### Post-Conversion Verification

**Step 1: Basic Checks**
```bash
# PDF verification
pdfinfo output.pdf              # Page count, metadata
pdffonts output.pdf             # Font embedding
pdfimages -list output.pdf      # Image list

# Word verification
unzip -l output.docx            # File structure
```

**Step 2: Content Comparison**
```bash
# Extract text for comparison
pdftotext output.pdf output.txt
wc -w input.md output.txt       # Word count comparison

# Diff check (approximate)
diff <(cat input.md | tr -d '#*[]()' | tr -s ' ') \
     <(cat output.txt | tr -s ' ')
```

**Step 3: Visual Inspection Points**
- [ ] First page renders correctly
- [ ] Table of contents (if present)
- [ ] All images visible
- [ ] Code blocks formatted
- [ ] Last page complete
- [ ] No orphan headers/footers

---

## Automated Quality Checks

### PDF Quality Script

```bash
#!/bin/bash
# pdf-quality-check.sh - Automated PDF quality verification

PDF_FILE="$1"
SCORE=100

echo "=== PDF Quality Check: $PDF_FILE ==="

# 1. File existence and validity
if ! pdfinfo "$PDF_FILE" > /dev/null 2>&1; then
    echo "FAIL: Invalid or corrupt PDF"
    exit 1
fi

# 2. Page count
PAGES=$(pdfinfo "$PDF_FILE" | grep Pages | awk '{print $2}')
echo "Pages: $PAGES"
[ "$PAGES" -eq 0 ] && { echo "FAIL: No pages"; SCORE=$((SCORE - 50)); }

# 3. Font embedding
MISSING_FONTS=$(pdffonts "$PDF_FILE" 2>/dev/null | grep -c "no")
if [ "$MISSING_FONTS" -gt 0 ]; then
    echo "WARNING: $MISSING_FONTS fonts not embedded"
    SCORE=$((SCORE - MISSING_FONTS * 5))
fi

# 4. Image count
IMAGES=$(pdfimages -list "$PDF_FILE" 2>/dev/null | wc -l)
echo "Images: $((IMAGES - 2))"  # Subtract header lines

# 5. Metadata presence
TITLE=$(pdfinfo "$PDF_FILE" | grep Title)
AUTHOR=$(pdfinfo "$PDF_FILE" | grep Author)
[ -z "$TITLE" ] && { echo "WARNING: No title"; SCORE=$((SCORE - 5)); }
[ -z "$AUTHOR" ] && { echo "WARNING: No author"; SCORE=$((SCORE - 5)); }

# 6. File size check (reasonable bounds)
SIZE=$(stat -f%z "$PDF_FILE" 2>/dev/null || stat -c%s "$PDF_FILE" 2>/dev/null)
SIZE_MB=$((SIZE / 1024 / 1024))
[ "$SIZE_MB" -gt 50 ] && { echo "WARNING: Large file (${SIZE_MB}MB)"; }

echo "=== Quality Score: $SCORE/100 ==="

# Determine grade
if [ "$SCORE" -ge 90 ]; then
    echo "Grade: A - Production ready"
elif [ "$SCORE" -ge 80 ]; then
    echo "Grade: B - Minor issues"
elif [ "$SCORE" -ge 70 ]; then
    echo "Grade: C - Review needed"
elif [ "$SCORE" -ge 60 ]; then
    echo "Grade: D - Reconvert"
else
    echo "Grade: F - Unacceptable"
fi
```

### Word Document Quality Script

```bash
#!/bin/bash
# docx-quality-check.sh - Automated Word quality verification

DOCX_FILE="$1"
SCORE=100

echo "=== DOCX Quality Check: $DOCX_FILE ==="

# 1. File validity
if ! unzip -t "$DOCX_FILE" > /dev/null 2>&1; then
    echo "FAIL: Invalid or corrupt DOCX"
    exit 1
fi

# 2. Content presence
CONTENT=$(unzip -p "$DOCX_FILE" word/document.xml 2>/dev/null | wc -c)
[ "$CONTENT" -eq 0 ] && { echo "FAIL: No content"; SCORE=$((SCORE - 50)); }

# 3. Image check
IMAGES=$(unzip -l "$DOCX_FILE" 2>/dev/null | grep -c "word/media/")
echo "Images: $IMAGES"

# 4. Style presence
STYLES=$(unzip -l "$DOCX_FILE" 2>/dev/null | grep -c "word/styles.xml")
[ "$STYLES" -eq 0 ] && { echo "WARNING: No styles"; SCORE=$((SCORE - 10)); }

# 5. Metadata
CORE=$(unzip -p "$DOCX_FILE" docProps/core.xml 2>/dev/null)
echo "$CORE" | grep -q "<dc:title>" || { echo "WARNING: No title"; SCORE=$((SCORE - 5)); }
echo "$CORE" | grep -q "<dc:creator>" || { echo "WARNING: No author"; SCORE=$((SCORE - 5)); }

echo "=== Quality Score: $SCORE/100 ==="
```

### HTML Quality Script

```bash
#!/bin/bash
# html-quality-check.sh - Automated HTML quality verification

HTML_FILE="$1"
SCORE=100

echo "=== HTML Quality Check: $HTML_FILE ==="

# 1. Valid HTML structure
if ! grep -q "<html" "$HTML_FILE"; then
    echo "FAIL: No HTML tag"
    SCORE=$((SCORE - 30))
fi

# 2. Head section
grep -q "<title>" "$HTML_FILE" || { echo "WARNING: No title"; SCORE=$((SCORE - 10)); }
grep -q "<meta charset" "$HTML_FILE" || { echo "WARNING: No charset"; SCORE=$((SCORE - 5)); }

# 3. Broken images
BROKEN_IMAGES=0
for src in $(grep -oE 'src="[^"]+"' "$HTML_FILE" | sed 's/src="//;s/"//'); do
    if [[ "$src" != http* ]] && [ ! -f "$src" ]; then
        echo "WARNING: Missing image: $src"
        BROKEN_IMAGES=$((BROKEN_IMAGES + 1))
    fi
done
SCORE=$((SCORE - BROKEN_IMAGES * 10))

# 4. Broken links
BROKEN_LINKS=0
for href in $(grep -oE 'href="[^"]+"' "$HTML_FILE" | sed 's/href="//;s/"//'); do
    if [[ "$href" == "#"* ]]; then
        ID="${href#\#}"
        grep -q "id=\"$ID\"" "$HTML_FILE" || BROKEN_LINKS=$((BROKEN_LINKS + 1))
    fi
done
SCORE=$((SCORE - BROKEN_LINKS * 5))
[ "$BROKEN_LINKS" -gt 0 ] && echo "WARNING: $BROKEN_LINKS broken internal links"

echo "=== Quality Score: $SCORE/100 ==="
```

---

## Quality Report Template

```markdown
# Conversion Quality Report

## Summary

| Field | Value |
|-------|-------|
| Source | [source file] |
| Target | [output file] |
| Format | [target format] |
| Date | [conversion date] |
| Tool | [tool used] |
| Grade | [A/B/C/D/F] |
| Score | [XX/100] |

## Metric Scores

| Metric | Score | Weight | Weighted |
|--------|-------|--------|----------|
| Structure Fidelity | XX% | 30% | XX |
| Visual Fidelity | XX% | 25% | XX |
| Content Integrity | XX% | 30% | XX |
| Metadata | XX% | 15% | XX |
| **Total** | | | **XX** |

## Issues Found

### Critical (Blocking)
- [Issue description and impact]

### Major (Should fix)
- [Issue description and impact]

### Minor (Nice to fix)
- [Issue description and impact]

## Verification Steps

- [x] Pre-conversion analysis complete
- [x] Dependencies verified
- [x] Conversion executed
- [x] Post-conversion checks run
- [x] Visual inspection done
- [ ] Stakeholder approval (if required)

## Recommendations

1. [Recommendation for improvement]
2. [Alternative approach if needed]

## Command Log

```bash
[Actual commands used]
```
```

---

## Regression Testing

### Creating Test Suite

```bash
# Create test document with all features
cat > test-features.md << 'EOF'
# Test Document

## Heading Level 2

### Heading Level 3

Normal paragraph text.

**Bold text** and *italic text*.

- List item 1
- List item 2
  - Nested item
  - Another nested

1. Ordered item
2. Second ordered

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

```python
def example():
    return "Hello"
```

![Test Image](test.png)

[Internal link](#heading-level-2)

> Block quote text

---

Horizontal rule above.

Footnote reference[^1].

[^1]: Footnote content.
EOF
```

### Running Regression Tests

```bash
#!/bin/bash
# run-regression.sh

echo "Running conversion regression tests..."

# Test 1: Markdown to PDF
pandoc test-features.md -o test-output.pdf --pdf-engine=xelatex
./pdf-quality-check.sh test-output.pdf

# Test 2: Markdown to DOCX
pandoc test-features.md -o test-output.docx
./docx-quality-check.sh test-output.docx

# Test 3: Markdown to HTML
pandoc test-features.md -o test-output.html -s
./html-quality-check.sh test-output.html

echo "Regression tests complete."
```

---

## Continuous Quality Monitoring

### CI/CD Integration

```yaml
# .github/workflows/doc-quality.yml
name: Document Quality Check

on:
  push:
    paths:
      - 'docs/**/*.md'

jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install tools
        run: |
          sudo apt-get update
          sudo apt-get install -y pandoc texlive-xetex poppler-utils

      - name: Convert documents
        run: |
          for f in docs/*.md; do
            pandoc "$f" -o "${f%.md}.pdf" --pdf-engine=xelatex
          done

      - name: Quality check
        run: |
          for f in docs/*.pdf; do
            ./scripts/pdf-quality-check.sh "$f"
          done
```

---

## Best Practices

### Before Conversion
1. Always analyze source document
2. Verify all dependencies exist
3. Choose appropriate tool
4. Set correct encoding (UTF-8)
5. Prepare template if needed

### During Conversion
1. Capture all output/errors
2. Monitor for warnings
3. Check intermediate files
4. Note any substitutions

### After Conversion
1. Run automated checks
2. Visual spot-check
3. Compare page/word counts
4. Verify critical sections
5. Document any issues

### Quality Improvement
1. Maintain test document
2. Run regression tests
3. Track quality trends
4. Update checklists
5. Share learnings
