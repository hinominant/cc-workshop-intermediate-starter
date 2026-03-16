# Japanese Typography Guide

> 日本語ドキュメント変換のための組版ガイド

This guide covers Japanese-specific typography rules for high-quality document conversion.

---

## Kinsoku (禁則処理)

### Line-Start Prohibited Characters (行頭禁則)

Characters that must not appear at the start of a line:

```
、。，．・：；？！ー）］｝〕〉》」』】
〙〗〟'"»‐–—…‥
```

**Common categories:**
- Punctuation marks: `、。，．`
- Closing brackets: `）」』】〉》〕
- Prolonged sound: `ー`
- Interpunct: `・`
- Question/exclamation: `？！`

### Line-End Prohibited Characters (行末禁則)

Characters that must not appear at the end of a line:

```
（［｛〔〈《「『【〘〖〝'"«
```

**Common categories:**
- Opening brackets: `（「『【〈《〔`

### Non-Separable Characters (分離禁則)

Character combinations that should not be split across lines:

| Type | Example | Description |
|------|---------|-------------|
| Number + Unit | `100円`, `3kg` | Keep together |
| Proper nouns | `東京都` | Avoid mid-word breaks |
| Dates | `2025年1月15日` | Keep date elements together |
| Times | `14:30` | Keep time together |

---

## Line Spacing (行間設定)

### Recommended Line Heights

| Context | Line Height | Ratio |
|---------|-------------|-------|
| Body text (本文) | 1.7-1.8em | 170-180% |
| Headings (見出し) | 1.3em | 130% |
| Tables (表) | 1.3em | 130% |
| Code blocks | 1.4em | 140% |
| Captions (キャプション) | 1.5em | 150% |
| Footnotes (脚注) | 1.4em | 140% |

### Spacing Around Elements

| Element | Before | After |
|---------|--------|-------|
| H1 | 2.0em | 1.0em |
| H2 | 1.5em | 0.8em |
| H3 | 1.2em | 0.6em |
| Paragraph | 0 | 1.0em |
| List | 0.5em | 0.5em |
| Table | 1.0em | 1.0em |
| Code block | 1.0em | 1.0em |

---

## Font Selection (フォント選定)

### Recommended Font Families

**Body Text (本文) - 明朝体:**
| OS | Font Family | Notes |
|----|-------------|-------|
| macOS | Hiragino Mincho Pro | Pre-installed |
| Windows | Yu Mincho | Pre-installed (Win 8.1+) |
| Cross-platform | Noto Serif CJK JP | Free, Google |
| Commercial | Morisawa Ryumin | Professional |

**Headings (見出し) - ゴシック体:**
| OS | Font Family | Notes |
|----|-------------|-------|
| macOS | Hiragino Kaku Gothic | Pre-installed |
| Windows | Yu Gothic | Pre-installed |
| Cross-platform | Noto Sans CJK JP | Free, Google |
| Commercial | Morisawa Shin Go | Professional |

**Code (コード) - 等幅:**
| OS | Font Family | Notes |
|----|-------------|-------|
| macOS | Osaka-Mono | Pre-installed |
| Windows | MS Gothic | Pre-installed |
| Cross-platform | Source Han Code JP | Free, Adobe |
| Cross-platform | Noto Sans Mono CJK JP | Free, Google |

### Font Size Guidelines

| Element | Size | Notes |
|---------|------|-------|
| Body text | 10.5-11pt | Standard for Japanese |
| H1 | 18-24pt | 1.7-2.3× body |
| H2 | 14-16pt | 1.3-1.5× body |
| H3 | 12-13pt | 1.1-1.2× body |
| Footnotes | 8-9pt | 0.8× body |
| Captions | 9-10pt | 0.9× body |

---

## Pandoc Configuration for Japanese

### Basic Japanese PDF

```bash
pandoc input.md -o output.pdf \
  --pdf-engine=lualatex \
  -V documentclass=ltjsarticle \
  -V CJKmainfont="Hiragino Mincho Pro" \
  -V CJKsansfont="Hiragino Kaku Gothic Pro" \
  -V CJKmonofont="Osaka-Mono"
```

### LuaLaTeX with luatexja

```bash
pandoc input.md -o output.pdf \
  --pdf-engine=lualatex \
  -V documentclass=ltjsarticle \
  -V luatexjapresets=hiragino-pron \
  --template=japanese.tex
```

### XeLaTeX Configuration

```bash
pandoc input.md -o output.pdf \
  --pdf-engine=xelatex \
  -V documentclass=bxjsarticle \
  -V mainfont="Hiragino Mincho Pro" \
  -V sansfont="Hiragino Kaku Gothic Pro" \
  -V monofont="Osaka-Mono" \
  -V CJKmainfont="Hiragino Mincho Pro"
```

---

## LaTeX Template for Japanese

### Minimal Japanese Template (japanese-minimal.tex)

```latex
\documentclass[a4paper,11pt]{ltjsarticle}

% LuaTeX-ja for Japanese support
\usepackage{luatexja-fontspec}

% Font configuration
\setmainjfont{Hiragino Mincho Pro}
\setsansjfont{Hiragino Kaku Gothic Pro}
\setmonojfont{Osaka-Mono}

% Line spacing
\usepackage{setspace}
\setstretch{1.7}

% Paragraph settings
\setlength{\parindent}{1em}
\setlength{\parskip}{0pt}

% Kinsoku settings (automatic with luatexja)
% Additional customization if needed:
% \ltjsetparameter{jacharrange={-2}}

$if(title)$
\title{$title$}
$endif$
$if(author)$
\author{$author$}
$endif$
$if(date)$
\date{$date$}
$endif$

\begin{document}

$if(title)$
\maketitle
$endif$

$if(toc)$
\tableofcontents
\clearpage
$endif$

$body$

\end{document}
```

### Corporate Japanese Template

```latex
\documentclass[a4paper,11pt]{ltjsarticle}

\usepackage{luatexja-fontspec}
\usepackage{graphicx}
\usepackage{fancyhdr}
\usepackage{geometry}
\usepackage{setspace}
\usepackage{xcolor}

% Page geometry
\geometry{
  top=30mm,
  bottom=25mm,
  left=25mm,
  right=25mm
}

% Japanese fonts
\setmainjfont{Hiragino Mincho Pro}
\setsansjfont{Hiragino Kaku Gothic Pro}

% Header/Footer
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small $company$}
\fancyhead[R]{\small $title$}
\fancyfoot[C]{\thepage}
\renewcommand{\headrulewidth}{0.4pt}
\renewcommand{\footrulewidth}{0pt}

% Line spacing
\setstretch{1.7}

% Heading styles
\usepackage{titlesec}
\titleformat{\section}
  {\normalfont\Large\sffamily\bfseries}
  {\thesection}{1em}{}
\titleformat{\subsection}
  {\normalfont\large\sffamily\bfseries}
  {\thesubsection}{1em}{}

% Title page
\title{
  $if(logo)$
  \includegraphics[width=3cm]{$logo$}\\[1cm]
  $endif$
  {\Huge\sffamily $title$}\\[0.5cm]
  $if(subtitle)$
  {\Large $subtitle$}
  $endif$
}
\author{$author$}
\date{$date$}

\begin{document}

\maketitle
\thispagestyle{empty}
\clearpage

$if(toc)$
\tableofcontents
\clearpage
$endif$

$body$

\end{document}
```

---

## Yakumono (約物) Processing

### Half-Width vs Full-Width

**Conversion Rules:**

| Context | Preferred | Example |
|---------|-----------|---------|
| Japanese text | Full-width | `（）「」。、` |
| Mixed with numbers | Half-width | `(100)` |
| Code/technical | Half-width | `function()` |

### Pandoc Filters for Yakumono

```lua
-- yakumono-filter.lua
-- Convert full-width parentheses around numbers to half-width

function Str(elem)
  -- （123） → (123)
  local text = elem.text
  text = text:gsub("（(%d+)）", "(%1)")
  text = text:gsub("（(%d+%.%d+)）", "(%1)")
  return pandoc.Str(text)
end
```

Usage:
```bash
pandoc input.md -o output.pdf --lua-filter=yakumono-filter.lua
```

---

## Tategaki (縦書き) Support

### LaTeX Vertical Writing

```latex
\documentclass[tate,a5paper]{ltjtarticle}
\usepackage{luatexja-fontspec}

% Vertical-specific fonts
\setmainjfont{Hiragino Mincho Pro}

\begin{document}

縦書きの本文テキストです。

\end{document}
```

### CSS for Vertical HTML

```css
/* Vertical writing mode */
.vertical {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  line-height: 1.8;
}

/* Horizontal-in-vertical for numbers */
.tcy {
  text-combine-upright: all;
}

/* Ruby annotation styling */
ruby {
  ruby-position: over;
}
rt {
  font-size: 0.5em;
}
```

### HTML Vertical Example

```html
<div class="vertical">
  <h1>縦書きタイトル</h1>
  <p>
    これは縦書きの本文です。
    西暦<span class="tcy">2025</span>年のドキュメントです。
  </p>
</div>
```

---

## Ruby (ふりがな) Support

### Pandoc with Ruby Extension

```bash
# Enable ruby extension
pandoc input.md -o output.pdf --from=markdown+east_asian_line_breaks
```

### Ruby Markup Formats

**HTML Ruby:**
```html
<ruby>漢字<rt>かんじ</rt></ruby>
```

**Aozora Bunko Format:**
```
漢字《かんじ》
```

**Custom Pandoc Filter:**
```lua
-- ruby-filter.lua
function Str(elem)
  -- 漢字《かんじ》 → <ruby>漢字<rt>かんじ</rt></ruby>
  local text = elem.text
  local result = text:gsub("([一-龯]+)《([ぁ-ん]+)》",
    function(kanji, reading)
      return "<ruby>" .. kanji .. "<rt>" .. reading .. "</rt></ruby>"
    end)
  return pandoc.RawInline("html", result)
end
```

---

## Common Japanese Document Sizes

### Page Sizes

| Name | Size (mm) | Usage |
|------|-----------|-------|
| A4 | 210 × 297 | Business standard |
| B5 | 182 × 257 | Books, magazines |
| A5 | 148 × 210 | Small books |
| B4 | 257 × 364 | Large documents |

### Margin Standards

| Type | Top | Bottom | Left | Right |
|------|-----|--------|------|-------|
| Report | 25mm | 25mm | 25mm | 25mm |
| Book | 20mm | 25mm | 20mm | 15mm |
| Thesis | 30mm | 25mm | 30mm | 25mm |

---

## Tool-Specific Settings

### LibreOffice Japanese

```bash
# Convert with Japanese locale
soffice --headless \
  --convert-to pdf:writer_pdf_Export \
  --infilter="writer_pdf_import" \
  -env:UserInstallation="file:///tmp/libreoffice" \
  input.docx
```

### wkhtmltopdf Japanese

```bash
wkhtmltopdf \
  --encoding UTF-8 \
  --page-size A4 \
  --margin-top 25mm \
  --margin-bottom 25mm \
  --margin-left 25mm \
  --margin-right 25mm \
  input.html output.pdf
```

---

## CSS Print Stylesheet for Japanese

```css
@charset "UTF-8";

/* Japanese print stylesheet */
@page {
  size: A4;
  margin: 25mm;
}

body {
  font-family: "Hiragino Mincho Pro", "Yu Mincho", serif;
  font-size: 10.5pt;
  line-height: 1.7;
  text-align: justify;
  text-justify: inter-ideograph;
}

h1, h2, h3, h4, h5, h6 {
  font-family: "Hiragino Kaku Gothic Pro", "Yu Gothic", sans-serif;
  page-break-after: avoid;
  line-height: 1.3;
}

h1 { font-size: 18pt; margin-top: 0; }
h2 { font-size: 14pt; margin-top: 1.5em; }
h3 { font-size: 12pt; margin-top: 1.2em; }

p {
  margin: 0;
  text-indent: 1em;
}

p + p {
  margin-top: 0;
}

/* Prevent orphaned headings */
h2, h3, h4 {
  page-break-after: avoid;
}

/* Keep tables together */
table {
  page-break-inside: avoid;
}

/* Code blocks */
pre, code {
  font-family: "Source Han Code JP", "Osaka-Mono", monospace;
  font-size: 9pt;
}

/* Print-specific */
@media print {
  a[href]:after {
    content: none;
  }
}
```

---

## Troubleshooting

### Font Issues

**Problem:** Tofu (□) characters appear
**Solution:**
```bash
# Check available Japanese fonts
fc-list :lang=ja | head -20

# Explicitly specify font in pandoc
pandoc input.md -o output.pdf \
  -V mainfont="Noto Serif CJK JP" \
  --pdf-engine=xelatex
```

**Problem:** Wrong font weights
**Solution:**
```latex
% Specify font weights explicitly
\setmainjfont[
  BoldFont={Hiragino Mincho Pro W6}
]{Hiragino Mincho Pro W3}
```

### Line Breaking Issues

**Problem:** Bad line breaks in Japanese text
**Solution:**
```bash
# Enable line break extension
pandoc input.md -o output.pdf \
  --from=markdown+east_asian_line_breaks
```

### Encoding Issues

**Problem:** Garbled characters
**Solution:**
```bash
# Ensure UTF-8 encoding
file input.md  # Check encoding
iconv -f SHIFT_JIS -t UTF-8 input.md > input_utf8.md
```

---

## Quality Checklist for Japanese Documents

- [ ] No tofu (□) characters
- [ ] Kinsoku rules applied correctly
- [ ] Line height appropriate (1.7-1.8)
- [ ] Font selection correct (Mincho/Gothic)
- [ ] Ruby displayed properly (if used)
- [ ] Numbers/units not split
- [ ] Proper punctuation (full/half width)
- [ ] No orphan/widow lines
- [ ] Page breaks logical
- [ ] Encoding is UTF-8
