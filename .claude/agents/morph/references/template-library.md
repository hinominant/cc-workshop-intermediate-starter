# Template Library

> Ready-to-use templates for LaTeX, CSS, and Word document conversion

This library provides production-quality templates for common document types.

---

## Template Overview

| Template | Format | Purpose | Language Support |
|----------|--------|---------|------------------|
| corporate-ja | LaTeX | Business documents | Japanese |
| technical-ja | LaTeX | Technical documents | Japanese |
| report-ja | LaTeX | Reports | Japanese |
| minimal | LaTeX | Clean, simple | Universal |
| corporate.css | CSS | PDF via HTML | Universal |
| technical.css | CSS | Code-focused | Universal |
| print.css | CSS | Print optimization | Universal |

---

## LaTeX Templates

### Corporate Japanese Template (corporate-ja.tex)

```latex
% corporate-ja.tex - Corporate document template for Japanese
% Usage: pandoc input.md -o output.pdf --template=corporate-ja.tex --pdf-engine=lualatex

\documentclass[a4paper,11pt]{ltjsarticle}

%% ========================================
%% Package imports
%% ========================================
\usepackage{luatexja-fontspec}
\usepackage{graphicx}
\usepackage{fancyhdr}
\usepackage{geometry}
\usepackage{setspace}
\usepackage{xcolor}
\usepackage{titlesec}
\usepackage{tocloft}
\usepackage{hyperref}
\usepackage{booktabs}
\usepackage{longtable}
\usepackage{listings}
\usepackage{float}

%% ========================================
%% Page geometry
%% ========================================
\geometry{
  top=30mm,
  bottom=25mm,
  left=25mm,
  right=25mm,
  headheight=15mm,
  headsep=10mm
}

%% ========================================
%% Font configuration
%% ========================================
\setmainjfont[BoldFont={Hiragino Kaku Gothic Pro W6}]{Hiragino Mincho Pro W3}
\setsansjfont{Hiragino Kaku Gothic Pro W3}
\setmonojfont{Osaka-Mono}

%% ========================================
%% Colors
%% ========================================
\definecolor{corporateblue}{RGB}{0,51,102}
\definecolor{corporategray}{RGB}{102,102,102}
\definecolor{lightgray}{RGB}{245,245,245}

%% ========================================
%% Header and Footer
%% ========================================
\pagestyle{fancy}
\fancyhf{}
$if(logo)$
\fancyhead[L]{\includegraphics[height=10mm]{$logo$}}
$else$
\fancyhead[L]{\small\textcolor{corporategray}{$if(company)$$company$$endif$}}
$endif$
\fancyhead[R]{\small\textcolor{corporategray}{$if(title)$$title$$endif$}}
\fancyfoot[C]{\thepage}
\fancyfoot[R]{\small\textcolor{corporategray}{$if(confidential)$CONFIDENTIAL$endif$}}
\renewcommand{\headrulewidth}{0.5pt}
\renewcommand{\footrulewidth}{0pt}

%% ========================================
%% Line spacing
%% ========================================
\setstretch{1.7}

%% ========================================
%% Heading styles
%% ========================================
\titleformat{\section}
  {\normalfont\Large\sffamily\bfseries\color{corporateblue}}
  {\thesection}{1em}{}
\titleformat{\subsection}
  {\normalfont\large\sffamily\bfseries\color{corporateblue}}
  {\thesubsection}{1em}{}
\titleformat{\subsubsection}
  {\normalfont\normalsize\sffamily\bfseries}
  {\thesubsubsection}{1em}{}

\titlespacing*{\section}{0pt}{2em}{1em}
\titlespacing*{\subsection}{0pt}{1.5em}{0.8em}
\titlespacing*{\subsubsection}{0pt}{1em}{0.5em}

%% ========================================
%% Code listing style
%% ========================================
\lstset{
  basicstyle=\ttfamily\small,
  backgroundcolor=\color{lightgray},
  frame=single,
  framerule=0pt,
  breaklines=true,
  breakatwhitespace=true,
  numbers=left,
  numberstyle=\tiny\color{corporategray},
  tabsize=2,
  showstringspaces=false
}

%% ========================================
%% Hyperref configuration
%% ========================================
\hypersetup{
  pdftitle={$if(title)$$title$$endif$},
  pdfauthor={$if(author)$$author$$endif$},
  pdfsubject={$if(subject)$$subject$$endif$},
  pdfkeywords={$if(keywords)$$keywords$$endif$},
  pdflang={ja},
  bookmarksnumbered=true,
  bookmarksopen=true,
  colorlinks=true,
  linkcolor=corporateblue,
  citecolor=corporateblue,
  urlcolor=corporateblue
}

%% ========================================
%% Table of contents styling
%% ========================================
\renewcommand{\cftsecfont}{\sffamily}
\renewcommand{\cftsubsecfont}{\sffamily}
\renewcommand{\cftsecpagefont}{\sffamily}
\renewcommand{\cftsubsecpagefont}{\sffamily}

%% ========================================
%% Document metadata
%% ========================================
$if(title)$
\title{
  \vspace{-2cm}
  $if(logo)$
  \includegraphics[width=4cm]{$logo$}\\[1.5cm]
  $endif$
  {\Huge\sffamily\textcolor{corporateblue}{$title$}}\\[0.5cm]
  $if(subtitle)$
  {\Large\textcolor{corporategray}{$subtitle$}}\\[0.5cm]
  $endif$
  $if(version)$
  {\normalsize Version $version$}
  $endif$
}
$endif$

$if(author)$
\author{$author$}
$endif$

$if(date)$
\date{$date$}
$else$
\date{\today}
$endif$

%% ========================================
%% Document body
%% ========================================
\begin{document}

%% Title page
$if(title)$
\maketitle
\thispagestyle{empty}
$if(confidential)$
\begin{center}
\textcolor{red}{\large CONFIDENTIAL}
\end{center}
$endif$
\clearpage
$endif$

%% Table of contents
$if(toc)$
\tableofcontents
\clearpage
$endif$

%% Main content
$body$

\end{document}
```

### Technical Japanese Template (technical-ja.tex)

```latex
% technical-ja.tex - Technical document template for Japanese
% Usage: pandoc input.md -o output.pdf --template=technical-ja.tex --pdf-engine=lualatex

\documentclass[a4paper,10pt]{ltjsarticle}

%% ========================================
%% Package imports
%% ========================================
\usepackage{luatexja-fontspec}
\usepackage{geometry}
\usepackage{setspace}
\usepackage{xcolor}
\usepackage{titlesec}
\usepackage{hyperref}
\usepackage{booktabs}
\usepackage{longtable}
\usepackage{listings}
\usepackage{fancyvrb}
\usepackage{tcolorbox}
\usepackage{amsmath}
\usepackage{float}

%% ========================================
%% Page geometry (compact for technical docs)
%% ========================================
\geometry{
  top=20mm,
  bottom=20mm,
  left=20mm,
  right=20mm
}

%% ========================================
%% Font configuration
%% ========================================
\setmainjfont{Hiragino Kaku Gothic Pro W3}
\setsansjfont{Hiragino Kaku Gothic Pro W6}
\setmonojfont{Source Han Code JP}

%% ========================================
%% Colors
%% ========================================
\definecolor{codebg}{RGB}{40,44,52}
\definecolor{codetext}{RGB}{171,178,191}
\definecolor{keyword}{RGB}{198,120,221}
\definecolor{string}{RGB}{152,195,121}
\definecolor{comment}{RGB}{92,99,112}
\definecolor{number}{RGB}{209,154,102}
\definecolor{sectioncolor}{RGB}{60,60,60}

%% ========================================
%% Line spacing
%% ========================================
\setstretch{1.4}

%% ========================================
%% Heading styles (compact)
%% ========================================
\titleformat{\section}
  {\normalfont\large\sffamily\bfseries\color{sectioncolor}}
  {\thesection}{1em}{}[\titlerule]
\titleformat{\subsection}
  {\normalfont\normalsize\sffamily\bfseries}
  {\thesubsection}{1em}{}
\titleformat{\subsubsection}
  {\normalfont\small\sffamily\bfseries}
  {\thesubsubsection}{1em}{}

\titlespacing*{\section}{0pt}{1.5em}{0.8em}
\titlespacing*{\subsection}{0pt}{1em}{0.5em}
\titlespacing*{\subsubsection}{0pt}{0.8em}{0.3em}

%% ========================================
%% Code listing style (dark theme)
%% ========================================
\lstset{
  basicstyle=\ttfamily\small\color{codetext},
  backgroundcolor=\color{codebg},
  frame=single,
  framerule=0pt,
  breaklines=true,
  breakatwhitespace=true,
  numbers=left,
  numberstyle=\tiny\color{comment},
  tabsize=2,
  showstringspaces=false,
  keywordstyle=\color{keyword},
  stringstyle=\color{string},
  commentstyle=\color{comment}\itshape,
  numbersep=8pt,
  xleftmargin=12pt,
  framexleftmargin=12pt
}

%% ========================================
%% Code block environment
%% ========================================
\tcbuselibrary{listings,skins}

\newtcblisting{codeblock}[1][]{
  colback=codebg,
  colframe=codebg,
  listing only,
  listing options={
    basicstyle=\ttfamily\small\color{codetext},
    breaklines=true,
    numbers=left,
    numberstyle=\tiny\color{comment}
  },
  #1
}

%% ========================================
%% Hyperref configuration
%% ========================================
\hypersetup{
  pdftitle={$if(title)$$title$$endif$},
  pdfauthor={$if(author)$$author$$endif$},
  pdflang={ja},
  bookmarksnumbered=true,
  colorlinks=true,
  linkcolor=blue,
  citecolor=blue,
  urlcolor=blue
}

%% ========================================
%% Document metadata
%% ========================================
$if(title)$
\title{{\Large\sffamily $title$}$if(version)$\\{\small Version $version$}$endif$}
$endif$
$if(author)$\author{$author$}$endif$
$if(date)$\date{$date$}$else$\date{\today}$endif$

%% ========================================
%% Document body
%% ========================================
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

### Report Japanese Template (report-ja.tex)

```latex
% report-ja.tex - Report template for Japanese
% Usage: pandoc input.md -o output.pdf --template=report-ja.tex --pdf-engine=lualatex

\documentclass[a4paper,11pt]{ltjsreport}

%% ========================================
%% Package imports
%% ========================================
\usepackage{luatexja-fontspec}
\usepackage{graphicx}
\usepackage{fancyhdr}
\usepackage{geometry}
\usepackage{setspace}
\usepackage{xcolor}
\usepackage{titlesec}
\usepackage{tocloft}
\usepackage{hyperref}
\usepackage{booktabs}
\usepackage{longtable}
\usepackage{listings}
\usepackage{float}
\usepackage{appendix}

%% ========================================
%% Page geometry
%% ========================================
\geometry{
  top=30mm,
  bottom=30mm,
  left=30mm,
  right=25mm
}

%% ========================================
%% Font configuration
%% ========================================
\setmainjfont{Hiragino Mincho Pro W3}
\setsansjfont{Hiragino Kaku Gothic Pro W3}
\setmonojfont{Osaka-Mono}

%% ========================================
%% Line spacing
%% ========================================
\setstretch{1.7}

%% ========================================
%% Header and Footer
%% ========================================
\pagestyle{fancy}
\fancyhf{}
\fancyhead[LE,RO]{\thepage}
\fancyhead[RE]{\leftmark}
\fancyhead[LO]{\rightmark}
\renewcommand{\headrulewidth}{0.4pt}

%% Chapter style
\fancypagestyle{plain}{
  \fancyhf{}
  \fancyfoot[C]{\thepage}
  \renewcommand{\headrulewidth}{0pt}
}

%% ========================================
%% Chapter and Section styles
%% ========================================
\titleformat{\chapter}[display]
  {\normalfont\huge\sffamily\bfseries}
  {\chaptertitlename\ \thechapter}{20pt}{\Huge}
\titleformat{\section}
  {\normalfont\Large\sffamily\bfseries}
  {\thesection}{1em}{}
\titleformat{\subsection}
  {\normalfont\large\sffamily\bfseries}
  {\thesubsection}{1em}{}

%% ========================================
%% Hyperref configuration
%% ========================================
\hypersetup{
  pdftitle={$if(title)$$title$$endif$},
  pdfauthor={$if(author)$$author$$endif$},
  pdflang={ja},
  bookmarksnumbered=true,
  bookmarksopen=true,
  colorlinks=true,
  linkcolor=black,
  citecolor=black,
  urlcolor=blue
}

%% ========================================
%% Document metadata
%% ========================================
$if(title)$\title{\Huge $title$ $if(subtitle)$\\[0.5cm]\Large $subtitle$$endif$}$endif$
$if(author)$\author{$author$}$endif$
$if(date)$\date{$date$}$else$\date{\today}$endif$

%% ========================================
%% Document body
%% ========================================
\begin{document}

%% Title page
$if(title)$
\maketitle
\thispagestyle{empty}
\clearpage
$endif$

%% Abstract
$if(abstract)$
\begin{abstract}
$abstract$
\end{abstract}
\clearpage
$endif$

%% Table of contents
$if(toc)$
\tableofcontents
\clearpage
$endif$

%% List of figures/tables
$if(lof)$\listoffigures\clearpage$endif$
$if(lot)$\listoftables\clearpage$endif$

%% Main content
$body$

%% Appendix
$if(appendix)$
\begin{appendices}
$appendix$
\end{appendices}
$endif$

\end{document}
```

### Minimal Template (minimal.tex)

```latex
% minimal.tex - Clean, minimal template
% Usage: pandoc input.md -o output.pdf --template=minimal.tex --pdf-engine=xelatex

\documentclass[a4paper,11pt]{article}

\usepackage{fontspec}
\usepackage{geometry}
\usepackage{setspace}
\usepackage{hyperref}
\usepackage{booktabs}
\usepackage{longtable}
\usepackage{listings}
\usepackage{xcolor}
\usepackage{graphicx}

%% Page geometry
\geometry{margin=25mm}

%% Font (use system fonts)
$if(mainfont)$
\setmainfont{$mainfont$}
$endif$
$if(monofont)$
\setmonofont{$monofont$}
$endif$

%% Line spacing
\setstretch{1.5}

%% Code style
\lstset{
  basicstyle=\ttfamily\small,
  backgroundcolor=\color{gray!10},
  frame=single,
  framerule=0pt,
  breaklines=true
}

%% Hyperref
\hypersetup{
  pdftitle={$if(title)$$title$$endif$},
  pdfauthor={$if(author)$$author$$endif$},
  colorlinks=true,
  linkcolor=blue,
  urlcolor=blue
}

%% Metadata
$if(title)$\title{$title$}$endif$
$if(author)$\author{$author$}$endif$
$if(date)$\date{$date$}$else$\date{\today}$endif$

\begin{document}

$if(title)$\maketitle$endif$
$if(toc)$\tableofcontents\clearpage$endif$

$body$

\end{document}
```

---

## CSS Templates

### Corporate CSS (corporate.css)

```css
/* corporate.css - Corporate PDF styling via HTML conversion */
/* Usage: pandoc input.md -o output.html -s --css=corporate.css */

@charset "UTF-8";

/* ========================================
   Page setup for PDF
   ======================================== */
@page {
  size: A4;
  margin: 25mm;
  @top-left {
    content: "Company Name";
    font-size: 9pt;
    color: #666;
  }
  @top-right {
    content: string(title);
    font-size: 9pt;
    color: #666;
  }
  @bottom-center {
    content: counter(page);
    font-size: 9pt;
  }
}

@page :first {
  @top-left { content: none; }
  @top-right { content: none; }
}

/* ========================================
   Root variables
   ======================================== */
:root {
  --primary-color: #003366;
  --secondary-color: #666666;
  --text-color: #333333;
  --background-color: #ffffff;
  --code-background: #f5f5f5;
  --border-color: #dddddd;
  --link-color: #0066cc;
}

/* ========================================
   Base typography
   ======================================== */
html {
  font-size: 11pt;
}

body {
  font-family: "Noto Serif CJK JP", "Hiragino Mincho Pro", serif;
  color: var(--text-color);
  line-height: 1.7;
  text-align: justify;
  text-justify: inter-ideograph;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* ========================================
   Headings
   ======================================== */
h1, h2, h3, h4, h5, h6 {
  font-family: "Noto Sans CJK JP", "Hiragino Kaku Gothic Pro", sans-serif;
  color: var(--primary-color);
  line-height: 1.3;
  page-break-after: avoid;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

h1 {
  font-size: 2em;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.3em;
  string-set: title content();
}

h2 {
  font-size: 1.5em;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.2em;
}

h3 { font-size: 1.25em; }
h4 { font-size: 1.1em; }
h5 { font-size: 1em; }
h6 { font-size: 0.9em; color: var(--secondary-color); }

/* ========================================
   Paragraphs and text
   ======================================== */
p {
  margin: 0 0 1em 0;
  text-indent: 1em;
}

p + p {
  text-indent: 1em;
}

strong { font-weight: bold; }
em { font-style: italic; }

/* ========================================
   Links
   ======================================== */
a {
  color: var(--link-color);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

@media print {
  a[href^="http"]:after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: var(--secondary-color);
  }
}

/* ========================================
   Lists
   ======================================== */
ul, ol {
  margin: 1em 0;
  padding-left: 2em;
}

li {
  margin-bottom: 0.5em;
}

li > p {
  text-indent: 0;
}

/* ========================================
   Tables
   ======================================== */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
  font-size: 0.95em;
  page-break-inside: avoid;
}

thead {
  background-color: var(--primary-color);
  color: white;
}

th, td {
  padding: 0.75em 1em;
  text-align: left;
  border: 1px solid var(--border-color);
}

th {
  font-weight: bold;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

/* ========================================
   Code blocks
   ======================================== */
code {
  font-family: "Source Han Code JP", "Osaka-Mono", monospace;
  font-size: 0.9em;
  background-color: var(--code-background);
  padding: 0.2em 0.4em;
  border-radius: 3px;
}

pre {
  background-color: var(--code-background);
  padding: 1em;
  overflow-x: auto;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  margin: 1.5em 0;
}

pre code {
  background: none;
  padding: 0;
  font-size: 0.85em;
  line-height: 1.5;
}

/* ========================================
   Blockquotes
   ======================================== */
blockquote {
  margin: 1.5em 0;
  padding: 0.5em 1em;
  border-left: 4px solid var(--primary-color);
  background-color: #f9f9f9;
  color: var(--secondary-color);
}

blockquote p {
  text-indent: 0;
  margin: 0;
}

/* ========================================
   Images
   ======================================== */
img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1.5em auto;
}

figure {
  margin: 1.5em 0;
  text-align: center;
}

figcaption {
  font-size: 0.9em;
  color: var(--secondary-color);
  margin-top: 0.5em;
}

/* ========================================
   Horizontal rules
   ======================================== */
hr {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 2em 0;
}

/* ========================================
   Print-specific
   ======================================== */
@media print {
  body {
    font-size: 10.5pt;
  }

  h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid;
  }

  table, figure, pre {
    page-break-inside: avoid;
  }

  .no-print {
    display: none;
  }
}
```

### Technical CSS (technical.css)

```css
/* technical.css - Technical document styling with dark code blocks */
/* Usage: pandoc input.md -o output.html -s --css=technical.css */

@charset "UTF-8";

/* ========================================
   Page setup
   ======================================== */
@page {
  size: A4;
  margin: 20mm;
}

/* ========================================
   Root variables
   ======================================== */
:root {
  --text-color: #24292e;
  --background: #ffffff;
  --code-bg: #282c34;
  --code-text: #abb2bf;
  --border-color: #e1e4e8;
  --link-color: #0366d6;
  --heading-color: #24292e;
}

/* ========================================
   Base typography
   ======================================== */
html {
  font-size: 10pt;
}

body {
  font-family: "Noto Sans CJK JP", "Hiragino Kaku Gothic Pro", -apple-system, sans-serif;
  color: var(--text-color);
  line-height: 1.5;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

/* ========================================
   Headings
   ======================================== */
h1, h2, h3, h4, h5, h6 {
  color: var(--heading-color);
  font-weight: 600;
  line-height: 1.25;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

h1 {
  font-size: 2em;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.3em;
}

h2 {
  font-size: 1.5em;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.3em;
}

h3 { font-size: 1.25em; }
h4 { font-size: 1em; }

/* ========================================
   Code blocks (Dark theme)
   ======================================== */
code {
  font-family: "Source Han Code JP", "SFMono-Regular", Consolas, monospace;
  font-size: 0.9em;
  background-color: rgba(27, 31, 35, 0.05);
  padding: 0.2em 0.4em;
  border-radius: 3px;
}

pre {
  background-color: var(--code-bg);
  color: var(--code-text);
  padding: 16px;
  overflow-x: auto;
  border-radius: 6px;
  margin: 1em 0;
}

pre code {
  background: none;
  padding: 0;
  font-size: 0.85em;
  line-height: 1.45;
  color: var(--code-text);
}

/* Syntax highlighting */
.token.comment { color: #5c6370; font-style: italic; }
.token.keyword { color: #c678dd; }
.token.string { color: #98c379; }
.token.number { color: #d19a66; }
.token.function { color: #61afef; }
.token.class-name { color: #e5c07b; }

/* Line numbers */
pre.line-numbers {
  padding-left: 3.8em;
  counter-reset: line;
}

pre.line-numbers code {
  counter-increment: line;
}

pre.line-numbers code::before {
  content: counter(line);
  display: inline-block;
  width: 2em;
  margin-left: -3.8em;
  margin-right: 1em;
  text-align: right;
  color: #5c6370;
}

/* ========================================
   Tables
   ======================================== */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
  font-size: 0.9em;
}

th, td {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  text-align: left;
}

th {
  background-color: #f6f8fa;
  font-weight: 600;
}

/* ========================================
   Alerts/Notes
   ======================================== */
.note, .warning, .tip {
  padding: 1em;
  margin: 1em 0;
  border-radius: 4px;
  border-left: 4px solid;
}

.note {
  background-color: #f0f7ff;
  border-color: #0366d6;
}

.warning {
  background-color: #fff5f5;
  border-color: #d73a49;
}

.tip {
  background-color: #f0fff4;
  border-color: #28a745;
}

/* ========================================
   Print optimization
   ======================================== */
@media print {
  body {
    max-width: none;
    padding: 0;
  }

  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  a[href]:after {
    content: none;
  }
}
```

### Print CSS (print.css)

```css
/* print.css - Print-optimized stylesheet */
/* Usage: pandoc input.md -o output.html -s --css=print.css */

@charset "UTF-8";

/* ========================================
   Page setup
   ======================================== */
@page {
  size: A4;
  margin: 20mm 25mm;
  @bottom-center {
    content: counter(page) " / " counter(pages);
    font-size: 9pt;
  }
}

@page :first {
  @bottom-center { content: none; }
}

/* ========================================
   Base styles
   ======================================== */
* {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

body {
  font-family: "Noto Serif CJK JP", serif;
  font-size: 10.5pt;
  line-height: 1.7;
  color: #000;
  background: #fff;
  widows: 3;
  orphans: 3;
}

/* ========================================
   Page breaks
   ======================================== */
h1, h2, h3, h4, h5, h6 {
  page-break-after: avoid;
  break-after: avoid;
}

table, figure, pre, blockquote {
  page-break-inside: avoid;
  break-inside: avoid;
}

/* ========================================
   Remove screen-only elements
   ======================================== */
.no-print,
nav,
.navigation,
.sidebar {
  display: none !important;
}

/* ========================================
   Links
   ======================================== */
a {
  color: #000;
  text-decoration: none;
}

/* Don't print URLs for internal links */
a[href^="#"]:after {
  content: none;
}

/* Print URLs for external links */
a[href^="http"]:after {
  content: " [" attr(href) "]";
  font-size: 0.8em;
  color: #666;
}

/* ========================================
   Grayscale code blocks
   ======================================== */
pre, code {
  font-family: "Source Han Code JP", monospace;
  font-size: 9pt;
}

pre {
  background: #f5f5f5;
  border: 1px solid #ddd;
  padding: 1em;
}

code {
  background: #eee;
  padding: 0.1em 0.3em;
}

/* ========================================
   Tables
   ======================================== */
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9pt;
}

th, td {
  border: 1px solid #000;
  padding: 6px 8px;
}

th {
  background: #eee;
  font-weight: bold;
}
```

---

## Word Reference Documents

### Creating Word Templates

Word templates use reference documents that define styles.

**Creating a reference document:**

1. Create a new Word document
2. Apply styles to sample content:
   - Heading 1, 2, 3
   - Normal text
   - Code
   - Table styles
3. Save as `reference.docx`

**Using with Pandoc:**
```bash
pandoc input.md -o output.docx --reference-doc=reference.docx
```

### Corporate Reference Structure

```
reference-corporate.docx should contain:

# Heading 1
(Font: Gothic, 18pt, Bold, Color: Corporate Blue)

## Heading 2
(Font: Gothic, 14pt, Bold)

### Heading 3
(Font: Gothic, 12pt, Bold)

Normal paragraph text.
(Font: Mincho, 10.5pt, Line spacing 1.7)

`Code inline`
(Font: Monospace, 9pt, Gray background)

```
Code block
```
(Font: Monospace, 9pt, Gray background, Border)

| Table Header |
(Font: Gothic, Bold, Dark background)

| Table Cell |
(Font: Mincho, 10pt)
```

### Technical Reference Structure

```
reference-technical.docx should contain:

# Heading 1
(Font: Sans-serif, 16pt, Bold, Bottom border)

## Heading 2
(Font: Sans-serif, 13pt, Bold)

### Heading 3
(Font: Sans-serif, 11pt, Bold)

Normal paragraph text.
(Font: Sans-serif, 10pt, Line spacing 1.4)

Code sections with monospace font.
Compact table styles.
```

---

## Template Variables

### Common Pandoc Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `$title$` | Document title | Technical Specification |
| `$subtitle$` | Subtitle | v1.0 |
| `$author$` | Author name | John Doe |
| `$date$` | Date | 2025-01-15 |
| `$version$` | Version number | 1.0.0 |
| `$company$` | Company name | ACME Inc. |
| `$logo$` | Logo file path | logo.png |
| `$confidential$` | Confidentiality mark | true |
| `$lang$` | Language code | ja |
| `$toc$` | Include TOC | true |
| `$toc-depth$` | TOC depth | 3 |

### YAML Front Matter Example

```yaml
---
title: "Document Title"
subtitle: "Subtitle Here"
author: "Author Name"
date: 2025-01-15
version: "1.0.0"
company: "Company Name"
logo: "logo.png"
confidential: true
lang: ja
toc: true
toc-depth: 3
abstract: |
  This is the document abstract.
  It can span multiple lines.
---
```

### Using Variables in Command Line

```bash
pandoc input.md -o output.pdf \
  --template=corporate-ja.tex \
  --pdf-engine=lualatex \
  -V title="Document Title" \
  -V author="Author Name" \
  -V date="2025-01-15" \
  -V company="Company Name" \
  -V confidential=true \
  -V toc=true
```

---

## Template Selection Guide

| Document Type | Recommended Template |
|---------------|---------------------|
| Business proposal | corporate-ja.tex |
| API documentation | technical-ja.tex |
| Project report | report-ja.tex |
| README/simple docs | minimal.tex |
| Web export | corporate.css |
| Code documentation | technical.css |
| Physical printing | print.css |
