# MCP Integration Protocol

エージェントフレームワークにおけるMCPサーバー連携の共通プロトコル。

---

## Supported MCP Servers

| MCP Server | Purpose | Agent Affinity | Scope |
|------------|---------|---------------|-------|
| **Context7** | ライブラリ最新ドキュメント注入 | Builder, Artisan, Forge, Anvil | Global (user) |
| **Sentry** | エラー監視・スタックトレース分析 | Scout, Triage, Sentinel | Global (user) |
| **Memory** | ナレッジグラフベースの永続メモリ | Nexus, 全コーディネーター | Global (user) |
| **PostgreSQL** | 自然言語→SQL変換、データ分析 | Analyst, Schema, Tuner | Project-specific |
| **Playwright** | ブラウザ操作・E2Eテスト・スクリーンショット | Navigator, Voyager, Director, Probe | Global (user) |
| **Figma** | デザイントークン抽出・コンポーネントマッピング・DESIGN.md生成 | Artisan, Vision, Muse, Palette, Director | Global (user) |

---

## Setup

### Global MCPs（全プロジェクト共通）

```bash
# Context7 - ライブラリドキュメント
claude mcp add --scope user context7 -- npx -y @upstash/context7-mcp@latest

# Sentry - エラー監視
claude mcp add --scope user --transport http sentry https://mcp.sentry.dev/mcp

# Memory - 永続メモリ
claude mcp add --scope user memory -- npx -y @modelcontextprotocol/server-memory --memory-path ~/.claude/memory

# Playwright - ブラウザ操作・E2Eテスト
claude mcp add --scope user playwright -- npx -y @playwright/mcp@latest

# Figma - デザイントークン・コンポーネント（リモートMCP）
claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp
```

### Project-specific MCPs

```bash
# PostgreSQL（READ ONLY推奨）
claude mcp add postgres -- npx -y @modelcontextprotocol/server-postgres "postgresql://readonly_user:password@host:5432/dbname"
```

---

## Usage Rules

### Context7

- 実装エージェント（Builder, Artisan, Forge, Anvil）が外部ライブラリのAPIを使う際に `use context7` で最新ドキュメントを取得
- ドキュメントが古い可能性があるフレームワーク（React, Next.js, etc.）の使用時に積極的に活用

### Sentry

- Scout: バグ調査時にSentryのエラー情報を取得して根本原因分析に活用
- Triage: インシデント対応時にSentryのエラースパイク・スタックトレースを確認
- Sentinel: セキュリティ関連のエラーパターンを検出

### Memory

- コーディネーター層（Nexus等）がセッション間の知識を永続化
- 既存の `_common/MEMORY.md` プロトコルを補完（ファイルベースのメモリと共存）
- エンティティ・リレーション・観察の3層構造でナレッジグラフを構築

### PostgreSQL

- **READ ONLYアクセスのみ**（Luna DBルール遵守）
- Analyst: Redash経由に加え、直接SQLクエリでデータ分析
- Schema: 既存スキーマの調査・ER図生成
- Tuner: EXPLAIN ANALYZEによるクエリ最適化
- 接続文字列はプロジェクトの `.env` から取得し、コードに埋め込まない

### Playwright

- Navigator: ブラウザ操作自動化（データ収集、フォーム操作、スクリーンショット）でMCP経由のブラウザ制御を活用
- Voyager: E2Eテスト実行時にPlaywright MCPでブラウザインスタンスを直接操作
- Director: デモ動画撮影時のブラウザ録画制御
- Probe: DAST実行時のブラウザベース脆弱性スキャン

### Figma

- **Artisan**: 実装前にFigmaからデザイントークン（色・スペーシング・タイポグラフィ）を `get_variable_defs` で抽出し、DESIGN.md と照合
- **Vision**: UIレビュー時にFigmaデザインと実装の差異を検出
- **Muse**: デザイントークン生成時にFigma Variables と同期
- **Palette**: UX改善提案時にFigmaの既存デザインシステムを参照
- **Director**: デモ動画撮影前にFigmaデザインで期待UIを確認
- **主要ツール**:
  - `get_variable_defs` — デザイントークン（色・スペーシング・タイポグラフィ）の抽出
  - `get_code_connect_suggestions` — Figmaコンポーネントとコードのマッピング検出
  - `get_file` / `get_node` — Figmaファイル・ノードの構造取得
- **DESIGN.md 連携**: Figmaから抽出したトークンを DESIGN.md フォーマットに変換し、全フロントエンドエージェントが参照
- **認証**: Figma OAuth（リモートMCP使用時は自動）。Personal Access Token は `.env` で管理

---

## Browser Use CLI 2.0（推奨ブラウザ自動化ツール）

Browser Use CLI 2.0 は CDP（Chrome DevTools Protocol）直接接続によるブラウザ自動化ツール。
Playwright MCP と比較して**トークン効率4倍・速度2倍**。既存Chromeへの接続・ログイン状態引継ぎに対応。

### Playwright MCP との使い分け

| 項目 | Browser Use CLI 2.0（推奨） | Playwright MCP |
|------|---------------------------|----------------|
| **使う場面** | タスク遂行・データ収集・フォーム操作・DAST | E2Eテスト作成・Visual Regression |
| **接続方式** | CDP直接（1ホップ） | Playwright → Node.js → CDP（2ホップ） |
| **トークン効率** | ~27kトークン/タスク | ~114kトークン/タスク |
| **既存Chrome接続** | `--connect` / `--cdp-url` で可能 | 不可（Playwright管理のブラウザのみ） |
| **ログイン状態** | `--profile` でCookie引継ぎ | 毎回新規セッション |
| **長時間安定性** | デーモン常駐で安定 | 15-20操作後に劣化報告あり |

**原則: タスク遂行には Browser Use CLI、テストコード生成には Playwright。**

### セットアップ

```bash
# インストール
curl -fsSL https://browser-use.com/cli/install.sh | bash

# 検証
browser-use doctor

# セットアップウィザード（オプション）
browser-use setup
```

要件: Python 3.11+

### 基本コマンド

```bash
# ページを開く
browser-use open https://example.com

# ページ状態を取得（クリック可能要素のインデックス付き一覧）
browser-use state

# 要素をクリック（インデックス指定）
browser-use click 5

# テキスト入力
browser-use type "search query"

# スクリーンショット
browser-use screenshot ./capture.png

# JavaScript 実行
browser-use eval "document.title"

# 既存の Chrome に接続（ログイン状態を維持）
browser-use --connect open https://example.com

# ユーザープロファイル付きで起動
browser-use --profile "Default" open https://example.com

# ブラウザウィンドウ表示（有頭モード）
browser-use --headed open https://example.com

# ブラウザ終了
browser-use close
```

### Agent Affinity

| Agent | Browser Use CLI | Playwright MCP | 理由 |
|-------|----------------|----------------|------|
| **Navigator** | PRIMARY | FALLBACK | タスク遂行。トークン効率・既存Chrome接続が重要 |
| **Voyager** | OPTIONAL | PRIMARY | テストコード生成。Playwright API依存 |
| **Director** | OPTIONAL | PRIMARY | 動画撮影。Playwright video recording依存 |
| **Probe** | PRIMARY | FALLBACK | DAST。CDP直接でネットワーク傍受・JS実行が高速 |

### MCP モードでの利用

Browser Use CLI は MCP サーバーとしても動作可能:

```bash
# ローカル MCP サーバー起動
claude mcp add browser-use -- uvx "browser-use[cli]" --mcp

# Cloud MCP（API キー必要）
claude mcp add --transport http browser-use https://api.browser-use.com/mcp
```

---

## Security Rules

1. PostgreSQL MCPは必ず **READ ONLYユーザー** で接続する
2. 接続文字列をコミットしない（`.env` またはシークレット管理）
3. Sentry MCPはOAuth認証（トークン不要）
4. Memory MCPのデータは `~/.claude/memory/` にローカル保存（外部送信なし）
5. Playwright MCPはローカルブラウザのみ操作（外部サービスへの不正アクセス禁止）
6. **外部プラグイン/MCP導入時は必ずセキュリティレビューを実施**（Sentinelによる静的分析）
   - ネットワーク通信・データ送信の有無を確認
   - eval()/動的コード実行の有無を確認
   - 依存関係のサプライチェーンリスクを確認
   - セキュリティチェック通過まで有効化しない

---

## Graceful Degradation（MCP未接続時のフォールバック）

MCPサーバーが未接続・障害時でもエージェントは動作を継続する。以下のフォールバック戦略に従う。

| MCP Server | Degradation Strategy | Fallback Action |
|------------|---------------------|-----------------|
| **Context7** | CONTINUE | 公式ドキュメントURLを直接参照。WebFetch で最新情報を取得 |
| **Sentry** | CONTINUE | `git log` + アプリケーションログから手動でエラー情報を収集 |
| **Memory** | CONTINUE | ファイルベースメモリ（`_common/MEMORY.md` プロトコル）のみで運用 |
| **PostgreSQL** | CONTINUE_LIMITED | Redash API 経由でデータ取得（`scripts/redash/query.sh`）。直接SQL不可 |
| **Playwright** | DEGRADE | ブラウザ操作タスクをスキップし、手動確認を依頼。E2Eテストは CLI ベースに切替 |

### 検出と通知

エージェントはMCPツール呼び出し失敗時に以下を実行する:

1. **即座にフォールバック** — 上記戦略に従い代替手段で処理を継続
2. **警告出力** — `[MCP-DEGRADED] {server}: {fallback action}` をログに記録
3. **タスク完了を妨げない** — MCP未接続はブロッカーではなく制約として扱う

### エージェント frontmatter での宣言

MCP依存が強いエージェントは frontmatter に `requiredMCP` を宣言できる:

```yaml
requiredMCP:
  - context7    # OPTIONAL: なくても動作可
  - playwright  # RECOMMENDED: ないと機能制限
  - postgres    # REQUIRED: ないとタスク実行不可
```

レベル:
- `OPTIONAL` — フォールバックで完全代替可能
- `RECOMMENDED` — 機能制限あり、警告を出して継続
- `REQUIRED` — 該当MCP未接続時はタスクをブロックし、セットアップを案内

---

## MCP Status Check

セッション内で `/mcp` コマンドを実行してMCPサーバーの接続状態を確認する。
