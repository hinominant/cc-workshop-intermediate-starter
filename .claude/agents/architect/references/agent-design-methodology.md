# Agent Design Methodology Reference

Architectが新規エージェント設計時に参照する詳細メソドロジー。
SKILL.mdのProcess節を補完する実践ガイド。

---

## 1. Need Validation Protocol

新エージェント提案に対して、以下3問を順番に検証する。1つでもNoなら設計に進まない。

### Q1: 既存エージェントで不十分か？

| チェック | 方法 |
|---------|------|
| 既存エージェントのSKILL.md全件を読んだか | `agents/*/SKILL.md` のPhilosophy + Boundaries確認 |
| CAPABILITIES_SUMMARY タグで類似検索したか | 提案機能のキーワードで全SKILLをgrep |
| 既存エージェントの拡張で対応できないか | references/ 追加 or Boundaries拡張で解決しないか検討 |

**PASS**: 「このタスクは既存エージェントXの責務外であり、XのBoundaries拡張では対応不可」と具体的に説明できる
**FAIL**: 「新しいエージェントがあると便利」「専門性が高いから分けたい」（具体的な不足の証拠がない）

### Q2: 重複率は20%未満か？

責務マトリクスを作成し、最も近い既存エージェントとの重複率を算出する。

- 20%未満: 設計に進む
- 20-30%: Ask first（Nexus/人間に判断を仰ぐ）
- 30%超: 設計中止、既存エージェントの拡張を提案

### Q3: スコープは3ヶ月安定するか？

| 安定シグナル | 不安定シグナル |
|------------|-------------|
| 責務が明確な名詞で表現できる | 「〜も〜も」と接続詞が多い |
| 他エージェントとの境界が自然 | 境界が人工的（「ここまではX、ここからはY」と説明が必要） |
| 過去3ヶ月のタスクログで需要が安定 | 特定プロジェクトの一時的ニーズ |

---

## 2. Overlap Detection: 責務マトリクス技法

### 手順

1. 提案エージェントの責務を10項目以内でリストアップ
2. CAPABILITIES_SUMMARYタグが類似する既存エージェントを3つ以上選出
3. マトリクスを作成

```markdown
| 責務 | 提案Agent | Scout | Sentinel | Lens | 重複? |
|------|----------|-------|----------|------|-------|
| 脆弱性の静的解析 | Y | N | Y | N | Sentinel |
| 依存パッケージ監査 | Y | N | Y | N | Sentinel |
| ランタイムエラー調査 | Y | Y | N | N | Scout |
| パフォーマンスボトルネック | Y | N | N | N | なし |
```

4. 重複率 = 重複ありの行数 / 全行数
5. 重複率30%超の場合、どの既存エージェントを拡張すべきかを提案に含める

---

## 3. SKILL.md品質基準（6基準）

### 基準1: 完全性（Completeness）

全テンプレートセクションが存在し、内容が記述されている。

**PASS**: Philosophy, Cognitive Constraints, Process, Boundaries, INTERACTION_TRIGGERS, AUTORUN, Nexus Hub Mode, Activity Logging が全て存在し、各2行以上の実質的内容
**FAIL**: セクションが欠落、または「TBD」「TODO」が残存

### 基準2: 具体性（Specificity）

Philosophy、Processに具体的な行動指示がある。

**PASS**: 「脆弱性を検出した場合、CVE番号とCVSSスコアを含むレポートを出力する」
**FAIL**: 「セキュリティの問題を分析し、適切な対策を提案する」

### 基準3: 境界明確性（Boundary Clarity）

Always/Ask/Neverリストが十分な粒度で記述されている。

**PASS**: Always 5項目以上、Ask 3項目以上、Never 4項目以上。各項目が具体的行動を指定
**FAIL**: Always 3項目未満、または「良いコードを書く」のような抽象的記述

### 基準4: 協調性（Collaboration）

COLLABORATION_PATTERNSにInput/Outputが明示されている。

**PASS**: `Input: [Nexus/Scout identifies performance issue]` `Output: [Builder for implementation, Nexus for review]`
**FAIL**: COLLABORATION_PATTERNSが空、または「他のエージェントと連携」のみ

### 基準5: 独自性（Distinctness）

Philosophyだけ読んで、どのエージェントか特定できる。

**PASS**: 「Sentinelは番人。コードが本番に到達する前に脆弱性を見つけて止める。速度より安全を優先する」
**FAIL**: 「コードの品質を高めるために分析を行い、改善点を提案する」（Judge/Zen/Honeと区別不能）

### 基準6: 行数（Line Count）

**PASS**: 250-400行
**FAIL**: 200行未満（Nexusがルーティング判断に使う情報が不足）、500行超（コンテキスト浪費）

---

## 4. 命名規則（5ルール）

| # | ルール | 良い例 | 悪い例 | 理由 |
|---|--------|-------|--------|------|
| 1 | 動詞禁止、役割名詞で命名 | Sentinel | Analyze | エージェントは役割であり動作ではない |
| 2 | 単一英単語 | Forge | CodeForge | シンプルさがルーティング速度を上げる |
| 3 | 既存エージェントと混同しない | Warden | Guard | Guardianと混同する |
| 4 | 会話で発音・記憶しやすい | Bolt | Xypher | 口頭で呼べないとチーム内で定着しない |
| 5 | CLIコマンド・予約語と衝突しない | Anvil | Test | `test`はシェル組み込みコマンド |

追加考慮:
- 文化的に不適切な意味を持たないか（英語圏以外も含む）
- 既存エージェント名と韻を踏まない（Zen/Pen/Tenは混同リスク）

---

## 5. Permission Mode選択ガイド

| permissionMode | 用途 | 代表エージェント | 選択基準 |
|---------------|------|---------------|---------|
| `full` | ファイル作成・変更・削除 | Builder, Zen, Artisan | 成果物としてコード/ファイルを生成する |
| `read-only` | 調査・分析・レポート | Scout, Sentinel, Lens | 情報を読み取り判断を出すが、何も変更しない |
| `plan-only` | 設計・推奨・計画 | Architect, Sherpa | 計画や設計を出力するが、実行はしない |
| `bypassPermissions` | オーケストレーション | Nexus, Rally | 他エージェントの呼び出し・制御が必要 |

**判断フローチャート:**
1. エージェントはファイルを変更するか？ → No → 2へ / Yes → `full`
2. エージェントはファイルを読むか？ → No → `plan-only` / Yes → 3へ
3. ファイル読み取りが主目的か？ → Yes → `read-only` / No → `plan-only`
4. 他エージェントを制御するか？ → Yes → `bypassPermissions`

---

## 6. Frontmatter仕様リファレンス

SKILL.mdの冒頭YAMLフロントマターの全フィールド定義。

```yaml
---
name: string          # エージェント名（小文字、ディレクトリ名と一致）
description: string   # 1行説明（日本語OK、80文字以内）
model: enum           # haiku | sonnet | opus
permissionMode: enum  # full | read-only | plan-only | bypassPermissions
maxTurns: integer     # 最大ターン数（推奨: 5-15）
memory: enum          # project | global | none
cognitiveMode: string # エージェント固有の思考モード識別子
---
```

### フィールド詳細

| フィールド | 必須 | ルーティング影響 |
|-----------|------|----------------|
| `name` | Yes | Nexusがエージェント名で呼び出す際のキー |
| `description` | Yes | Nexusのルーティング判断に使用（キーワードマッチ） |
| `model` | Yes | コスト・能力のトレードオフ。haiku=スキル実行、sonnet=一般タスク、opus=高度判断 |
| `permissionMode` | Yes | ツール使用の物理制限。間違えると実行時エラーまたはセキュリティリスク |
| `maxTurns` | Yes | 無限ループ防止。調査系は10-15、実装系は5-10 |
| `memory` | Yes | project=リポジトリスコープ、global=全リポジトリ共有、none=ステートレス |
| `cognitiveMode` | Yes | エージェントの思考スタイル識別。重複を避ける（最大2エージェント/モード） |

### model選択基準

| model | 選択基準 | コスト |
|-------|---------|-------|
| `haiku` | 定型的な手順実行、フォーマット変換、単純な検索 | 低 |
| `sonnet` | 設計判断、コード生成、レビュー、分析 | 中 |
| `opus` | 複雑な意思決定、メタ認知、創造的設計、曖昧な問題の構造化 | 高 |

### CAPABILITIES_SUMMARYコメント（フロントマター直後）

```markdown
<!--
CAPABILITIES_SUMMARY:
- capability_tag_1
- capability_tag_2

COLLABORATION_PATTERNS:
- Input: [どのエージェント/トリガーからタスクを受け取るか]
- Output: [どのエージェントに成果を渡すか]

PROJECT_AFFINITY: SaaS(H) E-commerce(M) Dashboard(L) CLI(H) Library(M) API(H)
-->
```

- CAPABILITIES_SUMMARY: Nexusのキーワードマッチに使用。具体的な動詞+名詞で記述
- COLLABORATION_PATTERNS: エコシステム内の接続を明示。孤立エージェント防止
- PROJECT_AFFINITY: プロジェクトタイプ別の適合度。H=High, M=Medium, L=Low

---

## 更新履歴

- 2026-04-06: 初版作成。SKILL.mdのAgent Design Methodologyを実践レベルに展開
