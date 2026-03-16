# Accessibility Guide

> Creating accessible document conversions for PDF/UA, WCAG compliance

This guide covers accessibility requirements and implementation for document conversion.

---

## Accessibility Standards Overview

### PDF/UA (ISO 14289)

PDF/UA (Universal Accessibility) is the international standard for accessible PDFs.

**Key Requirements:**
1. **Tagged PDF structure** - Logical document structure with tags
2. **Reading order** - Content flows in logical sequence
3. **Alternative text** - Images have descriptive alt text
4. **Language specification** - Document language declared
5. **Unicode text** - Actual text, not images of text
6. **Metadata** - Title and other properties set

### WCAG 2.1 Compliance

Web Content Accessibility Guidelines apply to HTML and exported documents.

**Levels:**
- **Level A** - Minimum accessibility
- **Level AA** - Standard compliance (recommended)
- **Level AAA** - Enhanced accessibility

**Key Criteria:**
| Criterion | Level | Description |
|-----------|-------|-------------|
| 1.1.1 Non-text Content | A | Alt text for images |
| 1.3.1 Info and Relationships | A | Structure conveyed programmatically |
| 1.3.2 Meaningful Sequence | A | Logical reading order |
| 1.4.3 Contrast | AA | 4.5:1 minimum ratio |
| 1.4.4 Resize Text | AA | Text resizable to 200% |
| 2.4.2 Page Titled | A | Pages have titles |
| 3.1.1 Language of Page | A | Language identified |

---

## PDF/UA Implementation

### Tagged PDF Creation with Pandoc

**Basic Tagged PDF:**
```bash
pandoc input.md -o output.pdf \
  --pdf-engine=xelatex \
  -V classoption=tagged \
  --metadata lang=ja \
  --metadata title="Document Title"
```

**Full Accessibility Options:**
```bash
pandoc input.md -o output.pdf \
  --pdf-engine=lualatex \
  -V documentclass=article \
  -V classoption=tagged \
  --metadata lang=ja \
  --metadata title="Document Title" \
  --metadata author="Author Name" \
  -V fontsize=12pt \
  -V geometry="margin=25mm" \
  --toc \
  --toc-depth=3
```

### LaTeX Accessibility Template

```latex
\documentclass[12pt,a4paper]{article}

% Accessibility package
\usepackage[tagged, highstructure]{accessibility}

% Language
\usepackage[english,main=japanese]{babel}

% Font size (minimum 12pt for accessibility)
\usepackage{fontspec}
\setmainfont{Noto Serif CJK JP}

% Hyperref for links and metadata
\usepackage{hyperref}
\hypersetup{
  pdftitle={$title$},
  pdfauthor={$author$},
  pdflang={ja},
  pdfsubject={$subject$},
  pdfkeywords={$keywords$},
  bookmarksnumbered=true,
  bookmarksopen=true,
  pdfstartview=FitH,
  colorlinks=true,
  linkcolor=blue,
  citecolor=blue,
  urlcolor=blue
}

% Accessibility improvements
\usepackage{accsupp}

\begin{document}

% Title with proper structure
\title{$title$}
\author{$author$}
\date{$date$}
\maketitle

% Table of contents
\tableofcontents

$body$

\end{document}
```

### Tag Structure

**Required PDF Tags:**
| Tag | Purpose | Usage |
|-----|---------|-------|
| `<Document>` | Root element | Container for all content |
| `<Part>` | Major section | Optional grouping |
| `<H1>-<H6>` | Headings | Logical heading hierarchy |
| `<P>` | Paragraph | Body text |
| `<L>` | List | Ordered/unordered lists |
| `<LI>` | List item | Individual list entries |
| `<Table>` | Table | Data tables |
| `<TR>` | Table row | Table rows |
| `<TH>` | Table header | Header cells |
| `<TD>` | Table data | Data cells |
| `<Figure>` | Image | Graphics with alt text |
| `<Link>` | Hyperlink | Interactive links |
| `<Note>` | Footnote | Supplementary content |

---

## Alternative Text Guidelines

### Writing Effective Alt Text

**Principles:**
1. **Be concise** - Typically 125 characters or less
2. **Be descriptive** - Convey the image's purpose
3. **Be contextual** - Consider surrounding content
4. **Avoid redundancy** - Don't repeat caption text

**Examples:**

| Image Type | Bad Alt Text | Good Alt Text |
|------------|--------------|---------------|
| Chart | "Graph" | "Bar chart showing sales growth from $1M to $3M over 2020-2024" |
| Logo | "Logo" | "Company ABC logo" |
| Diagram | "Diagram" | "Architecture diagram showing three-tier system with web, app, and database layers" |
| Photo | "Photo" | "Team meeting in conference room with 5 participants" |
| Icon | "Icon" | "Download button" or decorative (empty alt) |

### Alt Text in Markdown

```markdown
<!-- Good: Descriptive alt text -->
![Bar chart showing quarterly revenue increasing from Q1 to Q4](chart.png)

<!-- Good: Decorative image (empty alt) -->
![](decorative-border.png)

<!-- Bad: Non-descriptive -->
![Image](chart.png)
![Chart](chart.png)
```

### Pandoc Alt Text Preservation

```bash
# Alt text is preserved by default
pandoc input.md -o output.pdf

# Verify alt text in output
pdftotext -layout output.pdf - | grep -A2 "Figure"
```

---

## Reading Order

### Ensuring Logical Flow

**Checklist:**
- [ ] Content reads top-to-bottom, left-to-right (for LTR languages)
- [ ] Multi-column layouts have correct flow
- [ ] Sidebars don't interrupt main content
- [ ] Captions follow their figures
- [ ] Footnotes are properly linked

### Testing Reading Order

**PDF Reader Test:**
1. Open PDF in Adobe Acrobat
2. View > Read Out Loud > Read This Page
3. Verify content is read in logical order

**Alternative: Extract Text**
```bash
# Extract text in reading order
pdftotext -layout output.pdf -

# Check for structural issues
pdftotext output.pdf - | head -50
```

---

## Color Contrast

### Minimum Requirements

| Content Type | Minimum Ratio | WCAG Level |
|--------------|---------------|------------|
| Normal text | 4.5:1 | AA |
| Large text (18pt+) | 3:1 | AA |
| Graphical objects | 3:1 | AA |
| Normal text | 7:1 | AAA |
| Large text | 4.5:1 | AAA |

### Color Contrast Checker

```bash
# Calculate contrast ratio (requires Python)
python3 << 'EOF'
def luminance(r, g, b):
    def adjust(c):
        c = c / 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * adjust(r) + 0.7152 * adjust(g) + 0.0722 * adjust(b)

def contrast_ratio(fg, bg):
    l1 = luminance(*fg)
    l2 = luminance(*bg)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)

# Example: Black text on white background
fg = (0, 0, 0)      # Black
bg = (255, 255, 255) # White
ratio = contrast_ratio(fg, bg)
print(f"Contrast ratio: {ratio:.2f}:1")
print(f"WCAG AA: {'Pass' if ratio >= 4.5 else 'Fail'}")
print(f"WCAG AAA: {'Pass' if ratio >= 7 else 'Fail'}")
EOF
```

### Recommended Color Combinations

| Foreground | Background | Ratio | WCAG |
|------------|------------|-------|------|
| #000000 (Black) | #FFFFFF (White) | 21:1 | AAA |
| #333333 (Dark gray) | #FFFFFF (White) | 12.6:1 | AAA |
| #1A1A1A (Near black) | #F5F5F5 (Light gray) | 14.5:1 | AAA |
| #0000AA (Dark blue) | #FFFFFF (White) | 8.6:1 | AAA |

---

## Font Accessibility

### Minimum Font Sizes

| Element | Minimum Size | Recommended |
|---------|--------------|-------------|
| Body text | 11pt | 12pt |
| Captions | 9pt | 10pt |
| Footnotes | 8pt | 9pt |
| Headings | Relative to body | 1.2× - 2× body |

### Font Selection for Accessibility

**Preferred Characteristics:**
- Clear distinction between similar characters (l, 1, I)
- Adequate x-height
- Open letterforms
- Consistent stroke width

**Recommended Fonts:**
| Purpose | English | Japanese |
|---------|---------|----------|
| Body text | Arial, Verdana | Noto Serif CJK JP |
| Headings | Helvetica, Open Sans | Noto Sans CJK JP |
| Code | Consolas, Source Code Pro | Source Han Code JP |

### Pandoc Font Configuration

```bash
pandoc input.md -o output.pdf \
  --pdf-engine=xelatex \
  -V fontsize=12pt \
  -V mainfont="Noto Serif CJK JP" \
  -V sansfont="Noto Sans CJK JP"
```

---

## Table Accessibility

### Accessible Table Structure

**Requirements:**
1. Header row identified
2. Column headers use `<TH>` tags
3. Complex tables have scope attributes
4. Avoid merged cells when possible
5. Caption describes table purpose

### Markdown Table Best Practices

```markdown
<!-- Good: Clear headers, simple structure -->
| Month | Revenue | Expenses |
|-------|---------|----------|
| Jan   | $10,000 | $8,000   |
| Feb   | $12,000 | $9,000   |

Table 1: Monthly financial summary
```

### Complex Tables

For complex tables with merged cells, consider:
1. Split into multiple simple tables
2. Use list format instead
3. Provide text summary

---

## Link Accessibility

### Meaningful Link Text

**Bad:**
- "Click here"
- "Read more"
- "Link"

**Good:**
- "Download the accessibility report (PDF, 2MB)"
- "View the complete product specifications"
- "Contact support team"

### Markdown Links

```markdown
<!-- Good: Descriptive link text -->
For more information, see the [accessibility guidelines document](guide.pdf).

<!-- Bad: Non-descriptive -->
For more information, [click here](guide.pdf).
```

---

## Accessibility Testing

### Automated Testing Tools

**PDF Accessibility:**
| Tool | Platform | Cost |
|------|----------|------|
| Adobe Acrobat Pro | All | Commercial |
| PAC 3 (PDF Accessibility Checker) | Windows | Free |
| axesCheck | Online | Freemium |
| pdfaPilot | All | Commercial |

**HTML Accessibility:**
| Tool | Platform | Cost |
|------|----------|------|
| axe DevTools | Browser extension | Free |
| WAVE | Online/Extension | Free |
| Lighthouse | Chrome DevTools | Free |
| Pa11y | CLI | Free |

### PAC 3 Usage

```
1. Download from pdfua.foundation/en/pdf-accessibility-checker-pac
2. Open output.pdf
3. Run full check
4. Review WCAG and PDF/UA results
5. Fix reported issues
```

### Verification Script

```bash
#!/bin/bash
# accessibility-check.sh - Basic accessibility verification

PDF_FILE="$1"
echo "=== Accessibility Check: $PDF_FILE ==="

# 1. Check for tagged PDF
TAGGED=$(pdfinfo "$PDF_FILE" 2>/dev/null | grep "Tagged:" | awk '{print $2}')
if [ "$TAGGED" = "yes" ]; then
    echo "✓ Tagged PDF"
else
    echo "✗ Not a tagged PDF"
fi

# 2. Check language
LANG=$(pdfinfo "$PDF_FILE" 2>/dev/null | grep "Lang:" | awk '{print $2}')
if [ -n "$LANG" ]; then
    echo "✓ Language set: $LANG"
else
    echo "✗ Language not set"
fi

# 3. Check title
TITLE=$(pdfinfo "$PDF_FILE" 2>/dev/null | grep "Title:" | cut -d: -f2-)
if [ -n "$TITLE" ]; then
    echo "✓ Title set: $TITLE"
else
    echo "✗ Title not set"
fi

# 4. Check for embedded fonts
FONTS=$(pdffonts "$PDF_FILE" 2>/dev/null | wc -l)
if [ "$FONTS" -gt 2 ]; then
    echo "✓ Fonts embedded"
else
    echo "? Check font embedding manually"
fi

echo "=== Manual checks required ==="
echo "- Alt text for images"
echo "- Reading order"
echo "- Color contrast"
echo "- Table structure"
```

---

## Remediation Workflow

### Step 1: Source Improvement

Before conversion, improve source document:
```markdown
<!-- Add alt text to all images -->
![Descriptive alt text](image.png)

<!-- Use proper heading hierarchy -->
# Main Title
## Section
### Subsection

<!-- Add table captions -->
| Header 1 | Header 2 |
|----------|----------|
| Data     | Data     |

_Table 1: Description of table contents_
```

### Step 2: Convert with Accessibility Options

```bash
pandoc input.md -o output.pdf \
  --pdf-engine=lualatex \
  -V classoption=tagged \
  --metadata lang=ja \
  --metadata title="Accessible Document" \
  -V fontsize=12pt
```

### Step 3: Verify and Fix

```bash
# Run automated checks
./accessibility-check.sh output.pdf

# Manual verification
# 1. Test with screen reader
# 2. Check reading order
# 3. Verify alt text
# 4. Test links
```

### Step 4: Document Compliance

```markdown
## Accessibility Statement

This document has been created to meet:
- PDF/UA (ISO 14289-1)
- WCAG 2.1 Level AA

Verification performed:
- [x] Tagged PDF structure
- [x] Language declared
- [x] Alt text for images
- [x] Logical reading order
- [x] Color contrast ≥ 4.5:1
- [x] Minimum font size 12pt
```

---

## Accessible Conversion Checklist

### Before Conversion
- [ ] All images have alt text in source
- [ ] Heading hierarchy is correct (H1 → H2 → H3)
- [ ] Links have descriptive text
- [ ] Tables have headers
- [ ] Language is identified

### Conversion Settings
- [ ] Tagged PDF option enabled
- [ ] Language metadata set
- [ ] Title metadata set
- [ ] Font size ≥ 12pt
- [ ] Fonts embedded

### After Conversion
- [ ] Run automated accessibility check
- [ ] Verify reading order
- [ ] Test with screen reader (sample)
- [ ] Check color contrast
- [ ] Validate links work
- [ ] Document compliance level

---

## Quick Reference Commands

### Accessible PDF Generation

```bash
# Basic accessible PDF
pandoc input.md -o output.pdf \
  --pdf-engine=xelatex \
  -V classoption=tagged \
  --metadata lang=ja \
  --metadata title="Document Title" \
  -V fontsize=12pt

# With full options
pandoc input.md -o output.pdf \
  --pdf-engine=lualatex \
  -V documentclass=article \
  -V classoption=tagged \
  --metadata lang=ja \
  --metadata title="Document Title" \
  --metadata author="Author" \
  --metadata subject="Subject" \
  -V fontsize=12pt \
  -V geometry="margin=25mm" \
  --toc \
  --number-sections
```

### Accessible HTML Generation

```bash
pandoc input.md -o output.html \
  --standalone \
  --metadata lang=ja \
  --metadata title="Document Title" \
  --toc
```

### Verification

```bash
# Check PDF properties
pdfinfo output.pdf

# Extract structure
pdftotext -layout output.pdf -

# List fonts
pdffonts output.pdf
```
