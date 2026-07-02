# morph — フォーマット変換 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## SUPPORTED CONVERSIONS

### Conversion Matrix

| Source → | PDF | Word | Excel | HTML | Markdown |
|----------|-----|------|-------|------|----------|
| **Markdown** | ✅ pandoc | ✅ pandoc | ❌ | ✅ pandoc | - |
| **Word (.docx)** | ✅ LibreOffice | - | ❌ | ✅ pandoc | ✅ pandoc |
| **Excel (.xlsx)** | ✅ LibreOffice | ❌ | - | ❌ | ❌ |
| **HTML** | ✅ wkhtmltopdf | ✅ pandoc | ❌ | - | ✅ pandoc |
| **draw.io** | ✅ drawio-cli | ❌ | ❌ | ❌ | ❌ |
| **Mermaid** | ✅ mermaid-cli | ❌ | ❌ | ✅ embedded | ❌ |

### Quality Expectations

| Conversion | Quality | Notes |
|------------|---------|-------|
| Markdown → PDF | ★★★★★ | Excellent with pandoc + LaTeX |
| Markdown → Word | ★★★★☆ | Good, some styling limitations |
| Markdown → HTML | ★★★★★ | Native support |
| Word → PDF | ★★★★★ | Excellent with LibreOffice |
| Word → Markdown | ★★★☆☆ | Complex formatting may be lost |
| HTML → PDF | ★★★★☆ | Good, depends on CSS complexity |
| HTML → Markdown | ★★★☆☆ | Best for simple HTML |

See `references/conversion-matrix.md` for detailed tool selection guide.

---

## CLI TOOL REFERENCE

### Pandoc (Universal Converter)

**Installation:**
```bash
# macOS
brew install pandoc

# Ubuntu/Debian
sudo apt install pandoc

# With LaTeX for PDF
brew install basictex  # or mactex for full
```

**Common Conversions:**
```bash
# Markdown to PDF
pandoc input.md -o output.pdf --pdf-engine=xelatex

# Markdown to Word
pandoc input.md -o output.docx

# Markdown to HTML (standalone)
pandoc input.md -o output.html -s --metadata title="Document Title"

# Word to Markdown
pandoc input.docx -o output.md

# With table of contents
pandoc input.md -o output.pdf --toc --toc-depth=3

# With custom template
pandoc input.md -o output.pdf --template=template.tex
```

See `references/pandoc-recipes.md` for advanced recipes.

### LibreOffice CLI

**Installation:**
```bash
# macOS
brew install --cask libreoffice

# Ubuntu/Debian
sudo apt install libreoffice
```

**Common Conversions:**
```bash
# Word to PDF
soffice --headless --convert-to pdf input.docx

# Excel to PDF
soffice --headless --convert-to pdf input.xlsx

# Batch conversion
soffice --headless --convert-to pdf *.docx --outdir ./output

# HTML to PDF
soffice --headless --convert-to pdf:writer_pdf_Export input.html
```

### wkhtmltopdf (HTML to PDF)

**Installation:**
```bash
# macOS
brew install wkhtmltopdf

# Ubuntu/Debian
sudo apt install wkhtmltopdf
```

**Common Conversions:**
```bash
# Basic HTML to PDF
wkhtmltopdf input.html output.pdf

# With options
wkhtmltopdf --page-size A4 --margin-top 20mm input.html output.pdf

# From URL
wkhtmltopdf https://example.com output.pdf

# With header/footer
wkhtmltopdf --header-html header.html --footer-html footer.html input.html output.pdf
```

### Mermaid CLI

**Installation:**
```bash
npm install -g @mermaid-js/mermaid-cli
```

**Common Conversions:**
```bash
# Mermaid to PNG
mmdc -i diagram.mmd -o diagram.png

# Mermaid to PDF
mmdc -i diagram.mmd -o diagram.pdf

# Mermaid to SVG
mmdc -i diagram.mmd -o diagram.svg

# With custom theme
mmdc -i diagram.mmd -o diagram.png -t dark
```

### draw.io CLI

**Installation:**
```bash
# macOS (with desktop app)
brew install --cask drawio

# Export via command line
/Applications/draw.io.app/Contents/MacOS/draw.io --export --format pdf input.drawio
```

**Common Conversions:**
```bash
# draw.io to PDF
/Applications/draw.io.app/Contents/MacOS/draw.io --export --format pdf input.drawio

# draw.io to PNG
/Applications/draw.io.app/Contents/MacOS/draw.io --export --format png input.drawio

# draw.io to SVG
/Applications/draw.io.app/Contents/MacOS/draw.io --export --format svg input.drawio
```

---

## CONVERSION PROCESS

### 1. ANALYZE - Understand the Source

**Input Analysis:**
- Identify source format and structure
- Detect features that may not convert (tables, images, code blocks)
- Check for external dependencies (images, fonts, stylesheets)
- Estimate conversion complexity

**Feature Inventory:**
```markdown
## Source Analysis: [filename]

**Format:** Markdown / Word / HTML / Other
**Size:** X pages / Y KB
**Structure:**
- Headings: [levels used]
- Tables: [count, complexity]
- Images: [count, formats]
- Code blocks: [count, languages]
- Cross-references: [internal links]

**Potential Issues:**
- [Feature that may not convert]
- [Missing dependencies]
```

### 2. CONFIGURE - Select Tools and Options

**Tool Selection:**
- Choose best tool for source → target conversion
- Configure output options (page size, margins, fonts)
- Select template if applicable
- Set up metadata (title, author, date)

**Configuration Template:**
```yaml
conversion:
  source: input.md
  target: output.pdf
  tool: pandoc
  options:
    pdf-engine: xelatex
    toc: true
    toc-depth: 3
    template: corporate
    metadata:
      title: "Document Title"
      author: "Author Name"
      date: "2025-01-15"
```

### 3. CONVERT - Execute Transformation

**Conversion Steps:**
1. Validate source file
2. Prepare dependencies (images, fonts)
3. Execute conversion command
4. Check for errors/warnings
5. Generate output

**Error Handling:**
```markdown
## Conversion Log

**Status:** SUCCESS / PARTIAL / FAILED

**Warnings:**
- [Warning about feature loss]
- [Font substitution]

**Errors:**
- [Critical error if any]

**Output:** [path/to/output.pdf]
```

### 4. VERIFY - Quality Check

**Quality Checklist:**
- [ ] All headings preserved
- [ ] Tables render correctly
- [ ] Images display properly
- [ ] Code blocks formatted
- [ ] Links functional (internal/external)
- [ ] Page breaks appropriate
- [ ] Fonts render correctly
- [ ] Metadata present

### 5. DELIVER - Provide Output

**Delivery Format:**
```markdown
## Conversion Complete

**Source:** [source file path]
**Output:** [output file path]
**Format:** PDF / Word / HTML

**Quality Score:** X/10

**Notes:**
- [Any important observations]
- [Recommendations for future]

**Command Used:**
\`\`\`bash
[actual command]
\`\`\`
```

---

## QUALITY METRICS

### Quality Score Definition

| Metric | Weight | Criteria |
|--------|--------|----------|
| **Structure Fidelity** | 30% | Headings, lists, tables preserved correctly |
| **Visual Fidelity** | 25% | Fonts, colors, layout match specification |
| **Content Integrity** | 30% | No missing text, images, or links |
| **Metadata Preservation** | 15% | Title, author, date maintained |

### Quality Grades

| Score | Grade | Meaning | Action |
|-------|-------|---------|--------|
| 90-100 | A | Production ready | Deliver immediately |
| 80-89 | B | Minor issues | Review before delivery |
| 70-79 | C | Notable issues | Fix before delivery |
| 60-69 | D | Significant issues | Reconvert with fixes |
| <60 | F | Unacceptable | Investigate root cause |

### Automated Quality Checks

Run verification scripts after conversion:
```bash
# PDF quality check
./scripts/pdf-quality-check.sh output.pdf

# Check key metrics
pdfinfo output.pdf          # Metadata
pdffonts output.pdf         # Font embedding
pdfimages -list output.pdf  # Image list
```

See `references/quality-assurance.md` for detailed quality metrics and verification scripts.

---

## JAPANESE TYPOGRAPHY

### Kinsoku (禁則処理)

| Type | Characters | Rule |
|------|------------|------|
| Line-start prohibited | `、。）」』】〕？！` | Cannot start a line |
| Line-end prohibited | `（「『【〔` | Cannot end a line |
| Non-separable | Numbers + units, dates | Keep together |

### Line Height Standards

| Context | Line Height | Ratio |
|---------|-------------|-------|
| Body text (本文) | 1.7-1.8em | 170-180% |
| Headings (見出し) | 1.3em | 130% |
| Tables (表) | 1.3em | 130% |
| Code blocks | 1.4em | 140% |

### Japanese Font Selection

| Purpose | macOS | Windows | Cross-platform |
|---------|-------|---------|----------------|
| Body (本文) | Hiragino Mincho | Yu Mincho | Noto Serif CJK JP |
| Headings (見出し) | Hiragino Kaku Gothic | Yu Gothic | Noto Sans CJK JP |
| Code (コード) | Osaka-Mono | MS Gothic | Source Han Code JP |

### Japanese PDF Generation

```bash
# LuaLaTeX (recommended for Japanese)
pandoc input.md -o output.pdf \
  --pdf-engine=lualatex \
  -V documentclass=ltjsarticle \
  -V CJKmainfont="Hiragino Mincho Pro"

# XeLaTeX alternative
pandoc input.md -o output.pdf \
  --pdf-engine=xelatex \
  -V CJKmainfont="Noto Serif CJK JP"
```

See `references/japanese-typography.md` for complete typography guide.

---

## ACCESSIBILITY COMPLIANCE

### PDF/UA (ISO 14289) Checklist

- [ ] Tagged PDF structure enabled
- [ ] Logical reading order verified
- [ ] Alt text for all images
- [ ] Language specification set
- [ ] Contrast ratio ≥ 4.5:1
- [ ] Minimum font size 12pt
- [ ] Unicode text (not images of text)
- [ ] Title and metadata present

### WCAG 2.1 Level AA Requirements

| Criterion | Requirement | Check |
|-----------|-------------|-------|
| 1.1.1 | Alt text for images | All `![alt](img)` have descriptions |
| 1.3.1 | Structure | Proper heading hierarchy (H1→H2→H3) |
| 1.4.3 | Contrast | 4.5:1 minimum for text |
| 2.4.2 | Page titled | Document has title metadata |
| 3.1.1 | Language | `lang` attribute specified |

### Accessible PDF Command

```bash
pandoc input.md -o output.pdf \
  --pdf-engine=xelatex \
  -V classoption=tagged \
  --metadata lang=ja \
  --metadata title="Document Title" \
  -V fontsize=12pt
```

### Verification Tools

| Tool | Platform | Purpose |
|------|----------|---------|
| PAC 3 | Windows | PDF/UA validation |
| axe DevTools | Browser | HTML accessibility |
| pdfinfo | CLI | Metadata check |

See `references/accessibility-guide.md` for complete accessibility implementation guide.

---

## PROFESSIONAL OUTPUT

### PDF/A for Long-Term Archival

| Variant | Use Case | Features |
|---------|----------|----------|
| PDF/A-1b | Basic archival | Visual reproduction |
| PDF/A-2b | Modern archival | Transparency support |
| PDF/A-3b | With attachments | Embedded files allowed |

**Convert to PDF/A:**
```bash
gs -dPDFA=2 -dBATCH -dNOPAUSE \
   -sColorConversionStrategy=UseDeviceIndependentColor \
   -sDEVICE=pdfwrite \
   -sOutputFile=output-pdfa.pdf \
   input.pdf
```

### Digital Signatures

```bash
# Sign with certificate
java -jar JSignPdf.jar \
  -kst PKCS12 \
  -ksf certificate.p12 \
  -ksp "password" \
  -V \
  input.pdf
```

### Watermarks

```bash
# Add watermark stamp
pdftk input.pdf stamp watermark.pdf output output-watermarked.pdf

# Add background
pdftk input.pdf background background.pdf output output-with-bg.pdf
```

### PDF Operations

| Operation | Command |
|-----------|---------|
| Merge | `pdftk file1.pdf file2.pdf cat output merged.pdf` |
| Split | `pdftk input.pdf burst output page_%02d.pdf` |
| Rotate | `pdftk input.pdf rotate 1-endright output rotated.pdf` |
| Encrypt | `pdftk input.pdf output protected.pdf owner_pw "password"` |
| Compress | `gs -dPDFSETTINGS=/ebook -sOutputFile=small.pdf input.pdf` |

### Print Production Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| Color mode | CMYK | Commercial printing |
| Resolution | 300 DPI | Print quality |
| Bleed | 3mm | Trimming allowance |
| Marks | Crop, registration | Print alignment |

See `references/advanced-features.md` for complete professional features guide.

---

## TEMPLATES

### PDF Templates

**Corporate Template:**
- Company logo in header
- Page numbers in footer
- Consistent fonts (serif for body, sans-serif for headings)
- A4 or Letter page size
- Appropriate margins (25mm all sides)

**Technical Template:**
- Syntax highlighting for code
- Monospace fonts for code blocks
- Line numbers option
- Dark mode option
- Compact layout

**Print Template:**
- High-resolution images
- CMYK color mode
- Bleed margins
- Crop marks option

### Word Templates

**Standard Template:**
- Normal.dotx base
- Heading styles 1-6
- Table of contents style
- Code block style (monospace)

**Collaborative Template:**
- Track changes enabled
- Comment formatting
- Review mode settings

### HTML Templates

**Standalone Template:**
- Self-contained (embedded CSS)
- Responsive design
- Print stylesheet included
- Syntax highlighting (Prism/Highlight.js)

**Web-ready Template:**
- External CSS links
- Navigation structure
- SEO metadata
- Mobile-friendly

---

## BATCH CONVERSION

### Directory Processing

```bash
# Convert all Markdown to PDF in directory
for f in docs/*.md; do
  pandoc "$f" -o "${f%.md}.pdf" --pdf-engine=xelatex --toc
done

# With parallel processing
find docs -name "*.md" | parallel pandoc {} -o {.}.pdf
```

### Makefile Approach

```makefile
SOURCES := $(wildcard docs/*.md)
PDFS := $(SOURCES:.md=.pdf)

all: $(PDFS)

%.pdf: %.md
	pandoc $< -o $@ --pdf-engine=xelatex --toc --template=template.tex

clean:
	rm -f $(PDFS)
```

### Conversion Script Template

```bash
#!/bin/bash
# convert-docs.sh - Batch document conversion

SOURCE_DIR="${1:-.}"
OUTPUT_DIR="${2:-./output}"
FORMAT="${3:-pdf}"

mkdir -p "$OUTPUT_DIR"

for file in "$SOURCE_DIR"/*.md; do
  filename=$(basename "$file" .md)
  echo "Converting: $file"
  pandoc "$file" -o "$OUTPUT_DIR/$filename.$FORMAT" \
    --pdf-engine=xelatex \
    --toc \
    --template=template.tex \
    --metadata-file=metadata.yaml
done

echo "Conversion complete. Output in: $OUTPUT_DIR"
```

---

