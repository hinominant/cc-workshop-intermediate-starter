# Advanced Features Guide

> PDF/A archival, digital signatures, watermarks, merging, and bookmarks

This guide covers advanced document features for professional and archival use.

---

## PDF/A (Long-Term Archival)

### PDF/A Variants

| Standard | Based On | Key Features |
|----------|----------|--------------|
| **PDF/A-1a** | PDF 1.4 | Full compliance, tagged, Unicode |
| **PDF/A-1b** | PDF 1.4 | Basic compliance, visual reproduction |
| **PDF/A-2a** | PDF 1.7 | Tagged, Unicode, JPEG2000, transparency |
| **PDF/A-2b** | PDF 1.7 | Visual reproduction, transparency |
| **PDF/A-2u** | PDF 1.7 | Unicode, visual reproduction |
| **PDF/A-3a** | PDF 1.7 | Attachments allowed, full compliance |
| **PDF/A-3b** | PDF 1.7 | Attachments allowed, basic compliance |

### Choosing the Right Variant

| Use Case | Recommended |
|----------|-------------|
| Text-heavy documents | PDF/A-1b or PDF/A-2b |
| Accessibility required | PDF/A-1a or PDF/A-2a |
| Complex graphics | PDF/A-2b |
| With attachments | PDF/A-3b |
| Japanese documents | PDF/A-2b (transparency support) |

### Creating PDF/A with Ghostscript

**PDF/A-1b:**
```bash
gs -dPDFA=1 -dBATCH -dNOPAUSE -dNOOUTERSAVE \
   -sColorConversionStrategy=UseDeviceIndependentColor \
   -sDEVICE=pdfwrite \
   -dPDFACompatibilityPolicy=1 \
   -sOutputFile=output-pdfa.pdf \
   input.pdf
```

**PDF/A-2b:**
```bash
gs -dPDFA=2 -dBATCH -dNOPAUSE -dNOOUTERSAVE \
   -sColorConversionStrategy=UseDeviceIndependentColor \
   -sDEVICE=pdfwrite \
   -dPDFACompatibilityPolicy=1 \
   -sOutputFile=output-pdfa2.pdf \
   input.pdf
```

**PDF/A-3b with embedding:**
```bash
gs -dPDFA=3 -dBATCH -dNOPAUSE -dNOOUTERSAVE \
   -sColorConversionStrategy=UseDeviceIndependentColor \
   -sDEVICE=pdfwrite \
   -dPDFACompatibilityPolicy=1 \
   -sOutputFile=output-pdfa3.pdf \
   input.pdf
```

### Creating PDF/A with Pandoc

```bash
# Create PDF first, then convert to PDF/A
pandoc input.md -o temp.pdf --pdf-engine=xelatex

# Convert to PDF/A-2b
gs -dPDFA=2 -dBATCH -dNOPAUSE \
   -sColorConversionStrategy=UseDeviceIndependentColor \
   -sDEVICE=pdfwrite \
   -sOutputFile=output-pdfa.pdf \
   temp.pdf

rm temp.pdf
```

### PDF/A Validation

**Using VeraPDF (command-line):**
```bash
# Install VeraPDF
# https://verapdf.org/

# Validate PDF/A compliance
verapdf --flavour 2b output.pdf

# Generate HTML report
verapdf --flavour 2b --format html output.pdf > report.html
```

**Using Ghostscript:**
```bash
# Check PDF/A compliance (returns exit code)
gs -dPDFA -dBATCH -dNOPAUSE -dNODISPLAY \
   -sProcessColorModel=DeviceCMYK \
   -sDEVICE=pdfwrite \
   -dPDFACompatibilityPolicy=1 \
   input.pdf
```

---

## Digital Signatures

### Signature Overview

**Signature Types:**
| Type | Purpose | Legal Weight |
|------|---------|--------------|
| **Electronic Signature** | Identity verification | Varies by jurisdiction |
| **Digital Signature** | Cryptographic verification | Strong legal standing |
| **Qualified Digital Signature** | Certified authority | Equivalent to handwritten |

### Creating Digital Signatures

#### Using pdfsig (Poppler)

**Check existing signatures:**
```bash
pdfsig input.pdf
```

**Sign with certificate (requires certificate setup):**
```bash
# Note: pdfsig is primarily for verification
# For signing, use dedicated tools below
```

#### Using JSignPdf (Java-based)

**Installation:**
```bash
# Download from jsignpdf.sourceforge.net
# Requires Java runtime
```

**Command-line signing:**
```bash
java -jar JSignPdf.jar \
  -kst PKCS12 \
  -ksf certificate.p12 \
  -ksp "password" \
  -V \
  -r "Signed by: Name" \
  input.pdf
```

**Options:**
| Option | Description |
|--------|-------------|
| `-kst` | Keystore type (PKCS12, JKS) |
| `-ksf` | Keystore file (certificate) |
| `-ksp` | Keystore password |
| `-V` | Visible signature |
| `-r` | Reason for signing |
| `-l` | Location |
| `-c` | Contact info |

#### Using PortableSigner

```bash
# macOS/Linux
java -jar PortableSigner.jar \
  -n input.pdf \
  -o output-signed.pdf \
  -s certificate.p12 \
  -p "password" \
  -t
```

### Certificate Creation

**Self-signed certificate (for testing):**
```bash
# Generate private key
openssl genrsa -out private.key 2048

# Generate certificate signing request
openssl req -new -key private.key -out certificate.csr

# Generate self-signed certificate
openssl x509 -req -days 365 -in certificate.csr \
  -signkey private.key -out certificate.crt

# Create PKCS12 file for signing tools
openssl pkcs12 -export -out certificate.p12 \
  -inkey private.key -in certificate.crt
```

### Signature Verification

```bash
# Verify with pdfsig
pdfsig -v signed.pdf

# Detailed verification
pdfsig -dump signed.pdf
```

---

## Watermarks

### Watermark Types

| Type | Description | Use Case |
|------|-------------|----------|
| **Text overlay** | Semi-transparent text | CONFIDENTIAL, DRAFT |
| **Image overlay** | Logo or stamp | Company branding |
| **Background** | Full-page background | Letterhead |
| **Diagonal text** | Angled across page | Security marking |

### Creating Watermarks with pdftk

**Text watermark (requires stamp PDF):**
```bash
# First create watermark PDF, then apply
pdftk input.pdf stamp watermark.pdf output output-watermarked.pdf
```

**Background (behind content):**
```bash
pdftk input.pdf background background.pdf output output-with-bg.pdf
```

### Creating Watermark PDF

**Using LaTeX:**
```latex
\documentclass[a4paper]{article}
\usepackage{tikz}
\usepackage{geometry}
\geometry{margin=0pt}

\begin{document}
\thispagestyle{empty}
\begin{tikzpicture}[remember picture, overlay]
  \node[rotate=45, scale=5, opacity=0.3, text=gray]
    at (current page.center) {CONFIDENTIAL};
\end{tikzpicture}
\end{document}
```

Compile with:
```bash
pdflatex watermark.tex
```

**Using Ghostscript (text watermark):**
```bash
gs -dBATCH -dNOPAUSE -sDEVICE=pdfwrite \
   -sOutputFile=output-watermarked.pdf \
   -c "
   /watermark {
     gsave
     0.5 setgray
     /Helvetica-Bold findfont 60 scalefont setfont
     306 396 translate
     45 rotate
     -150 0 moveto
     (CONFIDENTIAL) show
     grestore
   } def
   " \
   -f input.pdf
```

### CSS Watermark for HTML to PDF

```css
@media print {
  body::before {
    content: "CONFIDENTIAL";
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 100px;
    color: rgba(128, 128, 128, 0.2);
    z-index: 9999;
    pointer-events: none;
  }
}
```

### Watermark Script

```bash
#!/bin/bash
# add-watermark.sh - Add watermark to PDF

INPUT="$1"
OUTPUT="$2"
TEXT="${3:-CONFIDENTIAL}"

# Create temporary watermark PDF
cat > /tmp/watermark.tex << EOF
\documentclass[a4paper]{article}
\usepackage{tikz}
\usepackage{geometry}
\geometry{margin=0pt}
\begin{document}
\thispagestyle{empty}
\begin{tikzpicture}[remember picture, overlay]
  \node[rotate=45, scale=4, opacity=0.2, text=gray]
    at (current page.center) {${TEXT}};
\end{tikzpicture}
\end{document}
EOF

# Compile watermark
pdflatex -output-directory=/tmp /tmp/watermark.tex > /dev/null 2>&1

# Apply watermark
pdftk "$INPUT" stamp /tmp/watermark.pdf output "$OUTPUT"

# Cleanup
rm -f /tmp/watermark.tex /tmp/watermark.pdf /tmp/watermark.aux /tmp/watermark.log

echo "Watermarked: $OUTPUT"
```

Usage:
```bash
./add-watermark.sh input.pdf output.pdf "DRAFT"
```

---

## PDF Merging and Splitting

### Merging PDFs

**Using pdftk:**
```bash
# Simple merge
pdftk file1.pdf file2.pdf file3.pdf cat output merged.pdf

# Merge with specific pages
pdftk A=file1.pdf B=file2.pdf cat A1-5 B2-10 output merged.pdf

# Merge all PDFs in directory
pdftk *.pdf cat output merged.pdf
```

**Using pdfunite (Poppler):**
```bash
pdfunite file1.pdf file2.pdf file3.pdf merged.pdf
```

**Using Ghostscript:**
```bash
gs -dBATCH -dNOPAUSE -sDEVICE=pdfwrite \
   -sOutputFile=merged.pdf \
   file1.pdf file2.pdf file3.pdf
```

### Splitting PDFs

**Using pdftk:**
```bash
# Split into individual pages
pdftk input.pdf burst output page_%02d.pdf

# Extract specific pages
pdftk input.pdf cat 1-5 output first5.pdf
pdftk input.pdf cat 6-end output rest.pdf

# Extract even/odd pages
pdftk input.pdf cat even output even_pages.pdf
pdftk input.pdf cat odd output odd_pages.pdf
```

**Using pdfseparate (Poppler):**
```bash
# Split into individual pages
pdfseparate input.pdf page_%d.pdf

# Split range
pdfseparate -f 5 -l 10 input.pdf page_%d.pdf
```

### Batch Merge Script

```bash
#!/bin/bash
# merge-pdfs.sh - Merge all PDFs in directory

DIR="${1:-.}"
OUTPUT="${2:-merged.pdf}"

echo "Merging PDFs from: $DIR"

# Create file list (sorted)
FILES=$(find "$DIR" -maxdepth 1 -name "*.pdf" | sort)

if [ -z "$FILES" ]; then
    echo "No PDF files found"
    exit 1
fi

# Merge
pdftk $FILES cat output "$OUTPUT"

echo "Created: $OUTPUT"
echo "Merged $(echo "$FILES" | wc -l) files"
```

---

## Bookmarks and Table of Contents

### Adding Bookmarks with pdftk

**Create bookmark info file:**
```
BookmarkBegin
BookmarkTitle: Chapter 1 - Introduction
BookmarkLevel: 1
BookmarkPageNumber: 1
BookmarkBegin
BookmarkTitle: 1.1 Background
BookmarkLevel: 2
BookmarkPageNumber: 2
BookmarkBegin
BookmarkTitle: Chapter 2 - Methods
BookmarkLevel: 1
BookmarkPageNumber: 10
```

**Apply bookmarks:**
```bash
pdftk input.pdf update_info bookmarks.txt output output-with-bookmarks.pdf
```

**Export existing bookmarks:**
```bash
pdftk input.pdf dump_data output | grep -A3 "Bookmark"
```

### Pandoc Automatic TOC

```bash
# Generate PDF with TOC and bookmarks
pandoc input.md -o output.pdf \
  --pdf-engine=xelatex \
  --toc \
  --toc-depth=3 \
  --number-sections

# HTML with TOC
pandoc input.md -o output.html \
  --standalone \
  --toc \
  --toc-depth=3
```

### LaTeX Bookmark Customization

```latex
\usepackage{hyperref}
\usepackage{bookmark}

\hypersetup{
  bookmarks=true,
  bookmarksnumbered=true,
  bookmarksopen=true,
  bookmarksopenlevel=2,
  pdftitle={Document Title},
  pdfauthor={Author}
}

% Custom bookmark
\bookmark[page=1,level=0]{Front Matter}
\bookmark[page=3,level=0]{Main Content}
```

### Bookmark Generation Script

```bash
#!/bin/bash
# generate-bookmarks.sh - Generate bookmarks from Markdown headings

INPUT="$1"
OUTPUT="bookmarks.txt"

echo "Generating bookmarks from: $INPUT"

PAGE=1
while IFS= read -r line; do
    if [[ "$line" =~ ^#[[:space:]] ]]; then
        TITLE="${line#\# }"
        echo "BookmarkBegin"
        echo "BookmarkTitle: $TITLE"
        echo "BookmarkLevel: 1"
        echo "BookmarkPageNumber: $PAGE"
    elif [[ "$line" =~ ^##[[:space:]] ]]; then
        TITLE="${line#\#\# }"
        echo "BookmarkBegin"
        echo "BookmarkTitle: $TITLE"
        echo "BookmarkLevel: 2"
        echo "BookmarkPageNumber: $PAGE"
    elif [[ "$line" =~ ^###[[:space:]] ]]; then
        TITLE="${line#\#\#\# }"
        echo "BookmarkBegin"
        echo "BookmarkTitle: $TITLE"
        echo "BookmarkLevel: 3"
        echo "BookmarkPageNumber: $PAGE"
    fi
done < "$INPUT" > "$OUTPUT"

echo "Generated: $OUTPUT"
```

---

## Page Manipulation

### Page Rotation

```bash
# Rotate all pages 90 degrees clockwise
pdftk input.pdf rotate 1-endright output rotated.pdf

# Rotate specific pages
pdftk input.pdf rotate 1-5right 6-10left output rotated.pdf

# Rotation options: north, south, east, west, left, right, down
```

### Page Reordering

```bash
# Reverse page order
pdftk input.pdf cat end-1 output reversed.pdf

# Custom order
pdftk input.pdf cat 3 1 2 5 4 output reordered.pdf

# Interleave from two files
pdftk A=odd.pdf B=even.pdf shuffle A B output interleaved.pdf
```

### Page Resizing

**Using Ghostscript:**
```bash
# Scale to A4
gs -dBATCH -dNOPAUSE -sDEVICE=pdfwrite \
   -dFIXEDMEDIA -dPDFFitPage \
   -sPAPERSIZE=a4 \
   -sOutputFile=a4-output.pdf \
   input.pdf
```

---

## Encryption and Security

### Password Protection

**Using pdftk:**
```bash
# Set owner and user password
pdftk input.pdf output protected.pdf \
  owner_pw "owner_password" \
  user_pw "user_password"

# Set permissions
pdftk input.pdf output protected.pdf \
  owner_pw "owner_password" \
  allow printing
```

**Permission options:**
| Permission | Description |
|------------|-------------|
| `Printing` | Allow printing |
| `DegradedPrinting` | Low-quality printing only |
| `ModifyContents` | Allow content modification |
| `Assembly` | Allow page assembly |
| `CopyContents` | Allow text/image copy |
| `ScreenReaders` | Allow screen reader access |
| `ModifyAnnotations` | Allow annotation changes |
| `FillIn` | Allow form filling |
| `AllFeatures` | All permissions |

**Remove password:**
```bash
pdftk protected.pdf input_pw "password" output unprotected.pdf
```

### Encryption with qpdf

```bash
# 256-bit AES encryption
qpdf --encrypt "user_pw" "owner_pw" 256 -- input.pdf encrypted.pdf

# With restrictions
qpdf --encrypt "user_pw" "owner_pw" 256 \
  --print=none --modify=none \
  -- input.pdf encrypted.pdf
```

---

## Metadata Management

### View Metadata

```bash
# Using pdfinfo
pdfinfo input.pdf

# Using pdftk
pdftk input.pdf dump_data

# Using exiftool
exiftool input.pdf
```

### Update Metadata

**Using pdftk:**
```bash
# Create metadata file
cat > metadata.txt << EOF
InfoBegin
InfoKey: Title
InfoValue: Document Title
InfoBegin
InfoKey: Author
InfoValue: Author Name
InfoBegin
InfoKey: Subject
InfoValue: Document Subject
InfoBegin
InfoKey: Keywords
InfoValue: keyword1, keyword2
InfoBegin
InfoKey: Creator
InfoValue: Morph Agent
EOF

# Apply metadata
pdftk input.pdf update_info metadata.txt output output-with-metadata.pdf
```

**Using exiftool:**
```bash
exiftool -Title="Document Title" \
         -Author="Author Name" \
         -Subject="Subject" \
         -Keywords="keyword1, keyword2" \
         input.pdf
```

---

## Compression and Optimization

### Reduce File Size

**Using Ghostscript:**
```bash
# Screen quality (lowest size)
gs -dBATCH -dNOPAUSE -sDEVICE=pdfwrite \
   -dCompatibilityLevel=1.4 \
   -dPDFSETTINGS=/screen \
   -sOutputFile=compressed.pdf \
   input.pdf

# E-book quality
gs -dBATCH -dNOPAUSE -sDEVICE=pdfwrite \
   -dPDFSETTINGS=/ebook \
   -sOutputFile=compressed.pdf \
   input.pdf

# Print quality
gs -dBATCH -dNOPAUSE -sDEVICE=pdfwrite \
   -dPDFSETTINGS=/printer \
   -sOutputFile=compressed.pdf \
   input.pdf

# Prepress quality (highest)
gs -dBATCH -dNOPAUSE -sDEVICE=pdfwrite \
   -dPDFSETTINGS=/prepress \
   -sOutputFile=compressed.pdf \
   input.pdf
```

**Quality comparison:**
| Setting | DPI | Use Case |
|---------|-----|----------|
| `/screen` | 72 | Web viewing |
| `/ebook` | 150 | E-readers |
| `/printer` | 300 | Desktop printing |
| `/prepress` | 300+ | Commercial printing |

### Linearization (Fast Web View)

```bash
qpdf --linearize input.pdf linearized.pdf
```

---

## Comprehensive Conversion Script

```bash
#!/bin/bash
# advanced-convert.sh - Full-featured PDF conversion

set -e

INPUT="$1"
OUTPUT="${2:-output.pdf}"
shift 2

# Default options
PDFA=""
SIGN=""
WATERMARK=""
ENCRYPT=""

# Parse options
while [[ $# -gt 0 ]]; do
    case $1 in
        --pdfa)
            PDFA="$2"
            shift 2
            ;;
        --sign)
            SIGN="$2"
            shift 2
            ;;
        --watermark)
            WATERMARK="$2"
            shift 2
            ;;
        --encrypt)
            ENCRYPT="$2"
            shift 2
            ;;
        *)
            shift
            ;;
    esac
done

TEMP_DIR=$(mktemp -d)
CURRENT="$INPUT"

echo "=== Advanced PDF Conversion ==="
echo "Input: $INPUT"
echo "Output: $OUTPUT"

# Step 1: Convert to PDF if needed
EXT="${INPUT##*.}"
if [ "$EXT" = "md" ]; then
    echo "Converting Markdown to PDF..."
    pandoc "$INPUT" -o "$TEMP_DIR/step1.pdf" --pdf-engine=xelatex --toc
    CURRENT="$TEMP_DIR/step1.pdf"
fi

# Step 2: Add watermark
if [ -n "$WATERMARK" ]; then
    echo "Adding watermark: $WATERMARK"
    # Create watermark PDF
    cat > "$TEMP_DIR/watermark.tex" << EOF
\documentclass[a4paper]{article}
\usepackage{tikz}
\usepackage{geometry}
\geometry{margin=0pt}
\begin{document}
\thispagestyle{empty}
\begin{tikzpicture}[remember picture, overlay]
  \node[rotate=45, scale=4, opacity=0.2, text=gray]
    at (current page.center) {${WATERMARK}};
\end{tikzpicture}
\end{document}
EOF
    pdflatex -output-directory="$TEMP_DIR" "$TEMP_DIR/watermark.tex" > /dev/null 2>&1
    pdftk "$CURRENT" stamp "$TEMP_DIR/watermark.pdf" output "$TEMP_DIR/step2.pdf"
    CURRENT="$TEMP_DIR/step2.pdf"
fi

# Step 3: Convert to PDF/A
if [ -n "$PDFA" ]; then
    echo "Converting to PDF/A-${PDFA}..."
    gs -dPDFA="$PDFA" -dBATCH -dNOPAUSE -dNOOUTERSAVE \
       -sColorConversionStrategy=UseDeviceIndependentColor \
       -sDEVICE=pdfwrite \
       -dPDFACompatibilityPolicy=1 \
       -sOutputFile="$TEMP_DIR/step3.pdf" \
       "$CURRENT" > /dev/null 2>&1
    CURRENT="$TEMP_DIR/step3.pdf"
fi

# Step 4: Encrypt
if [ -n "$ENCRYPT" ]; then
    echo "Encrypting with password..."
    pdftk "$CURRENT" output "$TEMP_DIR/step4.pdf" owner_pw "$ENCRYPT"
    CURRENT="$TEMP_DIR/step4.pdf"
fi

# Final output
cp "$CURRENT" "$OUTPUT"

# Cleanup
rm -rf "$TEMP_DIR"

echo "=== Complete ==="
echo "Output: $OUTPUT"

# Verify
pdfinfo "$OUTPUT" | head -10
```

Usage:
```bash
./advanced-convert.sh input.md output.pdf --pdfa 2 --watermark "DRAFT"
./advanced-convert.sh input.pdf output.pdf --encrypt "password"
```
