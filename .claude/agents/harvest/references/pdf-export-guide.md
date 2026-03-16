# PDF Export Guide

Markdown報告書を美しいPDFに変換するガイド。

---

## 推奨ツール

| ツール | 特徴 | インストール |
|--------|------|-------------|
| **md-to-pdf** | Node.js製、CSSカスタマイズ可 | `npm i -g md-to-pdf` |
| **Pandoc** | 多形式対応、LaTeX経由 | `brew install pandoc` |
| **Marp** | スライド形式、プレゼン向け | `npm i -g @marp-team/marp-cli` |
| **WeasyPrint** | Python製、CSS完全対応 | `pip install weasyprint` |

---

## Method 1: md-to-pdf（推奨）

最も簡単でカスタマイズ性が高い方法。

### インストール

```bash
npm install -g md-to-pdf
```

### 基本使用

```bash
md-to-pdf client-report-2026-01-31.md
```

### カスタムスタイル付き変換

```bash
md-to-pdf client-report-2026-01-31.md --stylesheet harvest-style.css
```

### harvest-style.css

```css
/* harvest-style.css - クライアント報告書用スタイル */

@page {
  size: A4;
  margin: 20mm 15mm;
}

body {
  font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif;
  font-size: 10pt;
  line-height: 1.6;
  color: #1e293b;
}

h1 {
  font-size: 24pt;
  color: #1e40af;
  border-bottom: 3px solid #3b82f6;
  padding-bottom: 10px;
  margin-top: 0;
}

h2 {
  font-size: 14pt;
  color: #1e40af;
  border-left: 4px solid #3b82f6;
  padding-left: 12px;
  margin-top: 24px;
}

h3 {
  font-size: 12pt;
  color: #334155;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 9pt;
}

th {
  background: #f1f5f9;
  color: #334155;
  font-weight: 600;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  text-align: left;
}

td {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
}

tr:nth-child(even) {
  background: #f8fafc;
}

/* メトリクスカード */
td[align="center"] h3 {
  font-size: 28pt;
  color: #2563eb;
  margin: 0;
}

td[align="center"] sub {
  font-size: 9pt;
  color: #64748b;
}

/* コードブロック（Mermaid用） */
pre {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
}

code {
  font-family: "SF Mono", "Monaco", "Menlo", monospace;
  font-size: 9pt;
}

/* ステータスバッジ */
td:last-child {
  text-align: center;
}

/* 罫線ボックス */
pre:has(code:not([class])) {
  font-family: "SF Mono", monospace;
  white-space: pre;
  background: white;
  border: none;
}

/* ページブレーク */
h2 {
  page-break-after: avoid;
}

table {
  page-break-inside: avoid;
}

/* フッター */
@page {
  @bottom-center {
    content: counter(page) " / " counter(pages);
    font-size: 9pt;
    color: #64748b;
  }
}
```

### md-to-pdf 設定ファイル

`.md-to-pdf.js` をプロジェクトルートに配置:

```javascript
module.exports = {
  stylesheet: ['./harvest-style.css'],
  body_class: ['harvest-report'],
  pdf_options: {
    format: 'A4',
    margin: {
      top: '20mm',
      bottom: '20mm',
      left: '15mm',
      right: '15mm'
    },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div style="font-size: 9pt; color: #64748b; width: 100%; text-align: center; padding: 10px;">
        <span class="pageNumber"></span> / <span class="totalPages"></span>
      </div>
    `
  },
  launch_options: {
    args: ['--no-sandbox']
  }
};
```

---

## Method 2: Pandoc + LaTeX

高品質な組版が必要な場合。

### インストール

```bash
# macOS
brew install pandoc
brew install --cask mactex

# Ubuntu
sudo apt install pandoc texlive-full
```

### 基本変換

```bash
pandoc client-report-2026-01-31.md -o report.pdf \
  --pdf-engine=lualatex \
  -V documentclass=ltjarticle \
  -V geometry:margin=2cm
```

### 日本語対応テンプレート

```bash
pandoc client-report-2026-01-31.md -o report.pdf \
  --pdf-engine=lualatex \
  --template=harvest-template.tex \
  -V mainfont="Hiragino Kaku Gothic ProN" \
  -V geometry:a4paper \
  -V geometry:margin=20mm
```

---

## Method 3: Marp（スライド形式）

プレゼンテーション形式のPDFを生成。

### インストール

```bash
npm install -g @marp-team/marp-cli
```

### Marp形式に変換

レポートの先頭に追加:

```markdown
---
marp: true
theme: default
paginate: true
header: '作業報告書 | 2026年1月'
footer: 'Agent Skills Project'
style: |
  section {
    font-family: "Hiragino Kaku Gothic ProN", sans-serif;
  }
  h1 {
    color: #1e40af;
  }
---
```

### PDF生成

```bash
marp client-report-2026-01-31.md --pdf
```

---

## Method 4: WeasyPrint（Python）

CSS完全対応のPDF生成。

### インストール

```bash
pip install weasyprint markdown
```

### Python スクリプト

```python
#!/usr/bin/env python3
"""harvest_pdf.py - Markdown to PDF converter"""

import markdown
from weasyprint import HTML, CSS
import sys

def convert_to_pdf(md_file, pdf_file):
    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()

    html_content = markdown.markdown(
        md_content,
        extensions=['tables', 'fenced_code', 'toc']
    )

    full_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            @page {{ size: A4; margin: 20mm; }}
            body {{ font-family: "Hiragino Kaku Gothic ProN", sans-serif; }}
            h1 {{ color: #1e40af; border-bottom: 3px solid #3b82f6; }}
            h2 {{ color: #1e40af; border-left: 4px solid #3b82f6; padding-left: 12px; }}
            table {{ width: 100%; border-collapse: collapse; }}
            th, td {{ border: 1px solid #e2e8f0; padding: 8px; }}
            th {{ background: #f1f5f9; }}
        </style>
    </head>
    <body>{html_content}</body>
    </html>
    """

    HTML(string=full_html).write_pdf(pdf_file)
    print(f"Generated: {pdf_file}")

if __name__ == "__main__":
    convert_to_pdf(sys.argv[1], sys.argv[2])
```

### 使用方法

```bash
python harvest_pdf.py client-report-2026-01-31.md report.pdf
```

---

## Mermaid グラフのPDF出力

MermaidグラフをPDFに含める方法:

### Option A: mermaid-cli で事前変換

```bash
# インストール
npm install -g @mermaid-js/mermaid-cli

# SVGに変換
mmdc -i diagram.mmd -o diagram.svg

# Markdownに埋め込み
![Timeline](diagram.svg)
```

### Option B: md-to-pdf + Puppeteer

md-to-pdfはPuppeteerを使用するため、Mermaidをそのままレンダリング可能:

```javascript
// .md-to-pdf.js
module.exports = {
  // Mermaidを有効化
  script: `
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <script>mermaid.initialize({startOnLoad:true});</script>
  `
};
```

### Option C: ASCII グラフを使用

PDF変換の互換性を確保するため、ASCIIアートを使用:

```
日別工数
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

01/21  ████████████████████████████████████████  42.0h
01/24  ███████                                    7.0h
01/27  ███                                        3.0h
       ├────────┼────────┼────────┼────────┼────────┤
       0       10       20       30       40      50h
```

---

## 自動化スクリプト

### harvest-pdf.sh

```bash
#!/bin/bash
# harvest-pdf.sh - Harvest報告書をPDF変換

set -e

INPUT_FILE="${1:-client-report.md}"
OUTPUT_FILE="${INPUT_FILE%.md}.pdf"
STYLE_FILE="$(dirname "$0")/harvest-style.css"

echo "Converting: $INPUT_FILE -> $OUTPUT_FILE"

# Mermaidグラフを事前レンダリング（オプション）
if command -v mmdc &> /dev/null; then
    echo "Pre-rendering Mermaid diagrams..."
    # Mermaidブロックを抽出してSVGに変換
fi

# md-to-pdfで変換
if command -v md-to-pdf &> /dev/null; then
    md-to-pdf "$INPUT_FILE" --stylesheet "$STYLE_FILE"
elif command -v pandoc &> /dev/null; then
    pandoc "$INPUT_FILE" -o "$OUTPUT_FILE" \
        --pdf-engine=lualatex \
        -V documentclass=ltjarticle \
        -V geometry:margin=20mm
else
    echo "Error: md-to-pdf or pandoc required"
    exit 1
fi

echo "Done: $OUTPUT_FILE"
```

### 使用方法

```bash
chmod +x harvest-pdf.sh
./harvest-pdf.sh client-report-2026-01-31.md
```

---

## トラブルシューティング

| 問題 | 解決策 |
|------|--------|
| 日本語が文字化け | フォント指定を確認、システムフォントを使用 |
| Mermaidが表示されない | mermaid-cliで事前変換、またはASCII代替 |
| 表がページをまたぐ | `page-break-inside: avoid;` をCSSに追加 |
| 余白が狭い | `@page { margin: 20mm; }` を調整 |
| 色が出ない | `printBackground: true` を設定 |
