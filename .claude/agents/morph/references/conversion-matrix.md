# Conversion Matrix

Morphエージェントのための詳細な変換対応表とツール選択ガイド。

---

## 完全変換マトリクス

### Markdown からの変換

| Target | Tool | Quality | Notes |
|--------|------|---------|-------|
| **PDF** | pandoc + xelatex | ★★★★★ | 最高品質、日本語完全対応 |
| **PDF** | pandoc + wkhtmltopdf | ★★★★☆ | 軽量、CSSスタイリング可 |
| **Word (.docx)** | pandoc | ★★★★☆ | スタイル一部制限あり |
| **HTML** | pandoc | ★★★★★ | ネイティブ変換 |
| **HTML (styled)** | pandoc + template | ★★★★★ | カスタムCSS適用可 |
| **EPUB** | pandoc | ★★★★☆ | 電子書籍向け |

### Word (.docx) からの変換

| Target | Tool | Quality | Notes |
|--------|------|---------|-------|
| **PDF** | LibreOffice | ★★★★★ | レイアウト完全保持 |
| **PDF** | pandoc | ★★★☆☆ | シンプルな文書のみ |
| **Markdown** | pandoc | ★★★☆☆ | 複雑な書式は失われる |
| **HTML** | pandoc | ★★★★☆ | 基本構造保持 |
| **ODT** | LibreOffice | ★★★★★ | Office互換 |

### Excel (.xlsx) からの変換

| Target | Tool | Quality | Notes |
|--------|------|---------|-------|
| **PDF** | LibreOffice | ★★★★★ | シート単位で変換 |
| **CSV** | LibreOffice | ★★★★★ | データエクスポート |
| **HTML** | LibreOffice | ★★★★☆ | テーブル構造保持 |

### HTML からの変換

| Target | Tool | Quality | Notes |
|--------|------|---------|-------|
| **PDF** | wkhtmltopdf | ★★★★☆ | CSS対応良好 |
| **PDF** | Chrome/Puppeteer | ★★★★★ | モダンCSS完全対応 |
| **PDF** | pandoc | ★★★☆☆ | シンプルなHTMLのみ |
| **Word (.docx)** | pandoc | ★★★★☆ | 構造保持 |
| **Markdown** | pandoc | ★★★☆☆ | シンプルなHTMLのみ |

### draw.io からの変換

| Target | Tool | Quality | Notes |
|--------|------|---------|-------|
| **PDF** | draw.io CLI | ★★★★★ | ベクター形式 |
| **PNG** | draw.io CLI | ★★★★★ | ラスター形式 |
| **SVG** | draw.io CLI | ★★★★★ | Web埋め込み用 |
| **JPEG** | draw.io CLI | ★★★★☆ | 写真向け |

### Mermaid からの変換

| Target | Tool | Quality | Notes |
|--------|------|---------|-------|
| **PNG** | mermaid-cli | ★★★★★ | 高解像度対応 |
| **PDF** | mermaid-cli | ★★★★★ | ベクター形式 |
| **SVG** | mermaid-cli | ★★★★★ | スケーラブル |

---

## ツール選択ガイド

### シナリオ別推奨ツール

| シナリオ | 推奨ツール | 理由 |
|----------|-----------|------|
| Markdown → PDF (日本語) | pandoc + xelatex | フォント埋め込み、美しい組版 |
| Markdown → PDF (高速) | pandoc + wkhtmltopdf | 処理が速い |
| Word → PDF | LibreOffice | レイアウト完全保持 |
| HTML → PDF (モダンCSS) | Chrome/Puppeteer | 最新CSS対応 |
| HTML → PDF (シンプル) | wkhtmltopdf | 軽量で高速 |
| 図表 → PDF | 各専用CLI | 品質最高 |
| バッチ変換 | pandoc | スクリプト化容易 |

### 品質 vs 速度トレードオフ

```
品質優先:
  Markdown → PDF: pandoc + xelatex (遅いが最高品質)
  Word → PDF: LibreOffice (レイアウト完璧)
  HTML → PDF: Chrome/Puppeteer (モダンCSS対応)

速度優先:
  Markdown → PDF: pandoc + wkhtmltopdf (高速)
  Word → PDF: unoconv (自動化向き)
  HTML → PDF: wkhtmltopdf (軽量)
```

---

## 変換時の制限事項

### Markdown → Word 制限

| 機能 | 変換可否 | 備考 |
|------|----------|------|
| 見出し (H1-H6) | ✅ | スタイルマッピング |
| 段落 | ✅ | 完全対応 |
| 太字/斜体 | ✅ | 完全対応 |
| リスト (箇条書き/番号) | ✅ | 完全対応 |
| テーブル | ⚠️ | 複雑な結合は崩れる |
| コードブロック | ⚠️ | シンタックスハイライトなし |
| 画像 | ✅ | パス解決に注意 |
| リンク | ✅ | ハイパーリンクとして保持 |
| 数式 (LaTeX) | ⚠️ | 画像として埋め込み |
| 脚注 | ✅ | Word脚注に変換 |
| 目次 | ✅ | pandoc --toc |

### Word → Markdown 制限

| 機能 | 変換可否 | 備考 |
|------|----------|------|
| 見出しスタイル | ✅ | # 形式に変換 |
| テキスト装飾 | ⚠️ | 色・フォントは失われる |
| テーブル | ⚠️ | 複雑な構造は崩れる |
| 画像 | ✅ | 別ファイルとして抽出 |
| コメント | ❌ | 失われる |
| 変更履歴 | ❌ | 失われる |
| ヘッダー/フッター | ❌ | 失われる |
| ページ区切り | ⚠️ | 水平線に変換可 |

### HTML → PDF 制限 (wkhtmltopdf)

| 機能 | 対応状況 | 備考 |
|------|----------|------|
| CSS Flexbox | ⚠️ | 一部制限あり |
| CSS Grid | ❌ | 非対応 |
| JavaScript | ⚠️ | --javascript-delay必要 |
| Web Fonts | ✅ | 読み込み待機必要 |
| SVG | ✅ | 完全対応 |
| iframe | ⚠️ | 同一ドメインのみ |
| CSS変数 | ❌ | 非対応 |

---

## 日本語対応

### PDF生成時のフォント設定

**pandoc + xelatex:**
```yaml
# metadata.yaml
mainfont: "Hiragino Mincho ProN"
sansfont: "Hiragino Kaku Gothic ProN"
monofont: "Osaka-Mono"
CJKmainfont: "Hiragino Mincho ProN"
```

**wkhtmltopdf:**
```bash
wkhtmltopdf --encoding UTF-8 input.html output.pdf
```

### 推奨フォント

| 用途 | macOS | Windows | Linux |
|------|-------|---------|-------|
| 本文 (明朝) | Hiragino Mincho ProN | MS Mincho | Noto Serif CJK JP |
| 見出し (ゴシック) | Hiragino Kaku Gothic ProN | MS Gothic | Noto Sans CJK JP |
| コード | Osaka-Mono | MS Gothic | Noto Sans Mono CJK JP |

---

## エラーハンドリング

### よくあるエラーと解決策

| エラー | 原因 | 解決策 |
|--------|------|--------|
| `xelatex not found` | LaTeX未インストール | `brew install basictex` |
| `Font not found` | フォント未インストール | システムフォント確認 |
| `Image not found` | 相対パスの問題 | 絶対パスに変更 |
| `Memory limit` | 大きな画像 | 画像を事前に圧縮 |
| `Encoding error` | 文字コード問題 | UTF-8に統一 |

### エラー確認コマンド

```bash
# pandocのバージョンと対応フォーマット確認
pandoc --version
pandoc --list-input-formats
pandoc --list-output-formats

# LaTeX確認
which xelatex
xelatex --version

# LibreOffice確認
soffice --version

# wkhtmltopdf確認
wkhtmltopdf --version
```

---

## ベストプラクティス

### 1. 事前検証

```bash
# 変換前にソースを検証
pandoc --from=markdown --to=markdown input.md > /dev/null
```

### 2. 段階的変換

複雑な変換は段階的に:
```bash
# Word → HTML → クリーンアップ → Markdown
pandoc input.docx -o temp.html
# HTMLをクリーンアップ
pandoc temp.html -o output.md
```

### 3. テンプレート活用

```bash
# 一貫したスタイルのためにテンプレート使用
pandoc input.md -o output.pdf --template=corporate.tex
```

### 4. メタデータ分離

```yaml
# metadata.yaml
title: "Document Title"
author: "Author Name"
date: "2025-01-15"
lang: "ja"
```

```bash
pandoc input.md -o output.pdf --metadata-file=metadata.yaml
```

---

## 変換コマンドクイックリファレンス

### 頻出変換コマンド

```bash
# Markdown → PDF (日本語対応)
pandoc input.md -o output.pdf \
  --pdf-engine=xelatex \
  -V CJKmainfont="Hiragino Mincho ProN" \
  --toc

# Markdown → Word
pandoc input.md -o output.docx

# Markdown → HTML (スタンドアロン)
pandoc input.md -o output.html -s

# Word → PDF
soffice --headless --convert-to pdf input.docx

# HTML → PDF
wkhtmltopdf --encoding UTF-8 input.html output.pdf

# Mermaid → PNG
mmdc -i diagram.mmd -o diagram.png -w 1200

# draw.io → PDF
/Applications/draw.io.app/Contents/MacOS/draw.io \
  --export --format pdf input.drawio
```
