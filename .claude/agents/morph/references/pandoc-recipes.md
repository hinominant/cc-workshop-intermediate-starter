# Pandoc Recipes

Morphエージェントのためのpandoc詳細レシピ集。

---

## 基本変換レシピ

### Markdown → PDF (基本)

```bash
pandoc input.md -o output.pdf
```

### Markdown → PDF (日本語対応)

```bash
pandoc input.md -o output.pdf \
  --pdf-engine=xelatex \
  -V CJKmainfont="Hiragino Mincho ProN" \
  -V CJKsansfont="Hiragino Kaku Gothic ProN" \
  -V CJKmonofont="Osaka-Mono"
```

### Markdown → PDF (目次付き)

```bash
pandoc input.md -o output.pdf \
  --pdf-engine=xelatex \
  --toc \
  --toc-depth=3 \
  -V toc-title="目次"
```

### Markdown → Word

```bash
pandoc input.md -o output.docx
```

### Markdown → HTML (スタンドアロン)

```bash
pandoc input.md -o output.html \
  -s \
  --metadata title="Document Title"
```

---

## 高度なPDFレシピ

### プロフェッショナル文書

```bash
pandoc input.md -o output.pdf \
  --pdf-engine=xelatex \
  --toc \
  --toc-depth=3 \
  --number-sections \
  -V documentclass=report \
  -V papersize=a4 \
  -V geometry:margin=25mm \
  -V fontsize=11pt \
  -V CJKmainfont="Hiragino Mincho ProN" \
  -V linkcolor=blue \
  --highlight-style=tango
```

### 技術文書 (コードハイライト)

```bash
pandoc input.md -o output.pdf \
  --pdf-engine=xelatex \
  --highlight-style=zenburn \
  --listings \
  -V fontsize=10pt \
  -V monofont="JetBrains Mono" \
  -V geometry:margin=20mm
```

### 印刷最適化

```bash
pandoc input.md -o output.pdf \
  --pdf-engine=xelatex \
  -V papersize=a4 \
  -V geometry:top=30mm \
  -V geometry:bottom=30mm \
  -V geometry:left=35mm \
  -V geometry:right=25mm \
  -V fontsize=12pt \
  -V linestretch=1.5
```

### ヘッダー/フッター付き

```bash
pandoc input.md -o output.pdf \
  --pdf-engine=xelatex \
  -V header-includes='\usepackage{fancyhdr}' \
  -V header-includes='\pagestyle{fancy}' \
  -V header-includes='\fancyhead[L]{Company Name}' \
  -V header-includes='\fancyhead[R]{\thepage}' \
  -V header-includes='\fancyfoot[C]{Confidential}'
```

---

## メタデータ活用

### YAMLメタデータファイル

```yaml
# metadata.yaml
---
title: "Document Title"
subtitle: "Subtitle"
author:
  - name: "Author One"
    affiliation: "Company A"
  - name: "Author Two"
    affiliation: "Company B"
date: "2025-01-15"
lang: ja
abstract: |
  This is the abstract of the document.
  It can span multiple lines.
keywords:
  - keyword1
  - keyword2
toc: true
toc-depth: 3
numbersections: true
papersize: a4
documentclass: report
fontsize: 11pt
geometry: margin=25mm
mainfont: "Hiragino Mincho ProN"
sansfont: "Hiragino Kaku Gothic ProN"
monofont: "JetBrains Mono"
CJKmainfont: "Hiragino Mincho ProN"
linkcolor: blue
urlcolor: blue
toccolor: black
---
```

### メタデータファイル使用

```bash
pandoc input.md -o output.pdf \
  --pdf-engine=xelatex \
  --metadata-file=metadata.yaml
```

### インラインメタデータ (Markdown内)

```markdown
---
title: "Document Title"
author: "Author Name"
date: "2025-01-15"
---

# Introduction

Document content starts here...
```

---

## テンプレート

### LaTeXテンプレート作成

```bash
# デフォルトテンプレートを出力
pandoc -D latex > template.tex
```

### カスタムテンプレート適用

```bash
pandoc input.md -o output.pdf \
  --pdf-engine=xelatex \
  --template=custom-template.tex
```

### シンプルな企業テンプレート

```latex
% corporate-template.tex
\documentclass[$if(fontsize)$$fontsize$,$endif$$if(papersize)$$papersize$paper,$endif$]{article}

\usepackage{fontspec}
\usepackage{xeCJK}
\usepackage{fancyhdr}
\usepackage{graphicx}
\usepackage{hyperref}

\setCJKmainfont{$CJKmainfont$}
\setmainfont{$mainfont$}

\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\includegraphics[height=1cm]{logo.png}}
\fancyhead[R]{$title$}
\fancyfoot[C]{\thepage}

$if(geometry)$
\usepackage[$for(geometry)$$geometry$$sep$,$endfor$]{geometry}
$endif$

\begin{document}

\begin{titlepage}
\centering
\vspace*{5cm}
{\Huge\bfseries $title$ \par}
\vspace{1cm}
{\Large $subtitle$ \par}
\vspace{2cm}
{\large $author$ \par}
\vspace{1cm}
{\large $date$ \par}
\end{titlepage}

$if(toc)$
\tableofcontents
\newpage
$endif$

$body$

\end{document}
```

---

## HTML変換レシピ

### スタンドアロンHTML

```bash
pandoc input.md -o output.html \
  -s \
  --metadata title="Title" \
  --css=style.css
```

### CSSインライン埋め込み

```bash
pandoc input.md -o output.html \
  -s \
  --self-contained \
  --css=style.css
```

### シンタックスハイライト付き

```bash
pandoc input.md -o output.html \
  -s \
  --highlight-style=pygments \
  --css=style.css
```

### 利用可能なハイライトスタイル

```bash
pandoc --list-highlight-styles
# pygments, tango, espresso, zenburn, kate, monochrome, breezedark, haddock
```

### レスポンシブHTMLテンプレート

```html
<!-- template.html -->
<!DOCTYPE html>
<html lang="$lang$">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$title$</title>
  <style>
    body {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: sans-serif;
      line-height: 1.6;
    }
    pre {
      background: #f4f4f4;
      padding: 10px;
      overflow-x: auto;
    }
    code {
      font-family: monospace;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
  </style>
</head>
<body>
$if(title)$
<h1>$title$</h1>
$endif$
$if(toc)$
<nav>
$toc$
</nav>
$endif$
$body$
</body>
</html>
```

```bash
pandoc input.md -o output.html \
  --template=template.html \
  --toc
```

---

## Word変換レシピ

### 基本変換

```bash
pandoc input.md -o output.docx
```

### リファレンスドキュメント使用

```bash
# リファレンス作成
pandoc -o reference.docx --print-default-data-file reference.docx

# スタイルをカスタマイズしてから使用
pandoc input.md -o output.docx --reference-doc=reference.docx
```

### 目次付きWord

```bash
pandoc input.md -o output.docx \
  --toc \
  --toc-depth=3
```

---

## バッチ処理レシピ

### ディレクトリ内全変換

```bash
#!/bin/bash
# convert-all.sh

INPUT_DIR="${1:-.}"
OUTPUT_DIR="${2:-./output}"
FORMAT="${3:-pdf}"

mkdir -p "$OUTPUT_DIR"

for file in "$INPUT_DIR"/*.md; do
  if [ -f "$file" ]; then
    filename=$(basename "$file" .md)
    echo "Converting: $filename"

    pandoc "$file" -o "$OUTPUT_DIR/$filename.$FORMAT" \
      --pdf-engine=xelatex \
      --toc \
      -V CJKmainfont="Hiragino Mincho ProN"
  fi
done

echo "Done. Output in: $OUTPUT_DIR"
```

### Makefile

```makefile
SOURCES := $(wildcard *.md)
PDFS := $(SOURCES:.md=.pdf)
DOCX := $(SOURCES:.md=.docx)
HTML := $(SOURCES:.md=.html)

PANDOC_OPTS := --pdf-engine=xelatex --toc -V CJKmainfont="Hiragino Mincho ProN"

.PHONY: all pdf docx html clean

all: pdf

pdf: $(PDFS)

docx: $(DOCX)

html: $(HTML)

%.pdf: %.md
	pandoc $< -o $@ $(PANDOC_OPTS)

%.docx: %.md
	pandoc $< -o $@ --toc

%.html: %.md
	pandoc $< -o $@ -s --toc

clean:
	rm -f $(PDFS) $(DOCX) $(HTML)
```

---

## 特殊機能

### 数式 (LaTeX)

```markdown
インライン数式: $E = mc^2$

ブロック数式:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

```bash
pandoc input.md -o output.pdf --pdf-engine=xelatex
```

### 脚注

```markdown
これは脚注付きの文章です[^1]。

[^1]: これが脚注の内容です。
```

### 引用

```markdown
> これは引用文です。
> 複数行も可能です。
>
> — 著者名
```

### 定義リスト

```markdown
用語1
:   定義1の説明

用語2
:   定義2の説明
```

### タスクリスト

```markdown
- [x] 完了タスク
- [ ] 未完了タスク
- [ ] 別の未完了タスク
```

---

## フィルター

### Luaフィルター

```lua
-- uppercase-headers.lua
function Header(el)
  return pandoc.walk_inline(el, {
    Str = function(s)
      return pandoc.Str(string.upper(s.text))
    end
  })
end
```

```bash
pandoc input.md -o output.pdf --lua-filter=uppercase-headers.lua
```

### 組み込みフィルター

```bash
# 引用スタイル適用
pandoc input.md -o output.pdf --citeproc --bibliography=refs.bib
```

---

## トラブルシューティング

### よくある問題

| 問題 | 解決策 |
|------|--------|
| 日本語が表示されない | `-V CJKmainfont` を指定 |
| 画像が見つからない | 絶対パスを使用、または `--resource-path` |
| 目次が生成されない | `--toc` オプション追加 |
| フォントエラー | システムにフォントをインストール |
| メモリ不足 | 画像を事前に圧縮 |

### デバッグ

```bash
# 中間形式を確認
pandoc input.md -t latex -o debug.tex

# バージョン確認
pandoc --version

# 対応フォーマット確認
pandoc --list-input-formats
pandoc --list-output-formats
```

### 画像パス解決

```bash
# リソースパス指定
pandoc input.md -o output.pdf --resource-path=.:images:assets
```

---

## パフォーマンス最適化

### 大きなドキュメント

```bash
# メモリ制限緩和
pandoc input.md -o output.pdf \
  --pdf-engine=xelatex \
  +RTS -M2G -RTS
```

### 並列処理

```bash
# GNU Parallel使用
find . -name "*.md" | parallel pandoc {} -o {.}.pdf
```

### キャッシュ活用

```bash
# LaTeXキャッシュ利用
export TEXMFVAR=/tmp/texmf-var
pandoc input.md -o output.pdf --pdf-engine=xelatex
```
