# Canvas Diagram Library Workflow

生成した図をプロジェクト固有のライブラリとして保存・再利用するワークフロー。

---

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    GENERATE                                  │
│  コード/仕様から図を生成                                      │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                    SAVE                                      │
│  .agents/diagrams/{project}/ に保存                          │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                    REUSE                                     │
│  保存済み図を参照・更新・再生成                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Trigger Commands

```
/Canvas save diagram                    # 生成した図を保存
/Canvas save diagram as [name]          # 名前を指定して保存
/Canvas list diagrams                   # 保存済み図一覧
/Canvas show [diagram-name]             # 保存済み図を表示
/Canvas update [diagram-name]           # 図を更新
/Canvas regenerate [diagram-name]       # ソースから再生成
```

---

## Directory Structure

```
.agents/diagrams/
├── README.md                           # 使い方ガイド
└── {project-name}/                     # プロジェクト別フォルダ
    ├── _index.md                       # 図の一覧・メタデータ
    ├── architecture-overview.md        # システム概要図
    ├── auth-sequence.md                # 認証シーケンス
    ├── db-er.md                        # ER図
    └── user-journey.md                 # ユーザージャーニー
```

---

## Diagram File Format

```markdown
---
name: Architecture Overview
type: flowchart
format: mermaid
created: 2026-01-31
updated: 2026-01-31
source: [src/**, package.json]
tags: [architecture, overview, system]
related: [db-er, auth-sequence]
---

# Architecture Overview

## Purpose

システム全体のコンポーネント構成と依存関係を可視化

## Diagram

\`\`\`mermaid
flowchart TD
    subgraph Frontend
        A[React App]
    end
    subgraph Backend
        B[API Server]
        C[Auth Service]
    end
    subgraph Data
        D[(PostgreSQL)]
        E[(Redis)]
    end
    A --> B
    A --> C
    B --> D
    B --> E
    C --> D
\`\`\`

## Legend

| 記号 | 意味 |
|------|------|
| 四角 | アプリケーション |
| 円柱 | データストア |
| 矢印 | 依存関係 |

## Source Analysis

| ソース | 抽出内容 |
|--------|---------|
| package.json | 依存パッケージ構成 |
| src/api/** | API エンドポイント構造 |
| docker-compose.yml | サービス構成 |

## Change History

| 日付 | 変更内容 |
|------|---------|
| 2026-01-31 | 初版作成 |
```

---

## Index File Format (_index.md)

```markdown
# Diagram Index: {project-name}

## Overview

| 図 | タイプ | 最終更新 | タグ |
|----|--------|---------|------|
| [architecture-overview](./architecture-overview.md) | Flowchart | 2026-01-31 | architecture, overview |
| [auth-sequence](./auth-sequence.md) | Sequence | 2026-01-31 | auth, api |
| [db-er](./db-er.md) | ER | 2026-01-31 | database, schema |

## Tag Cloud

- `architecture`: architecture-overview
- `auth`: auth-sequence
- `database`: db-er
- `api`: auth-sequence

## Relationships

\`\`\`mermaid
graph LR
    A[architecture-overview] --> B[auth-sequence]
    A --> C[db-er]
    B --> C
\`\`\`
```

---

## Save Workflow

### 1. Save Trigger

図生成完了後、自動的に保存を提案:

```yaml
questions:
  - question: "生成した図をライブラリに保存しますか？"
    header: "Save"
    options:
      - label: "Yes, save to library (Recommended)"
        description: ".agents/diagrams/{project}/ に保存"
      - label: "Save with custom name"
        description: "名前を指定して保存"
      - label: "No, don't save"
        description: "今回は保存しない"
    multiSelect: false
```

### 2. Metadata Extraction

保存時に自動抽出するメタデータ:

| フィールド | 抽出元 |
|-----------|-------|
| `name` | 図のタイトル |
| `type` | 図タイプ（flowchart, sequence等） |
| `format` | 出力形式（mermaid, drawio, ascii） |
| `source` | 参照したファイル |
| `tags` | 図の内容から推測 |

### 3. Naming Convention

```
{category}-{subject}.md

Examples:
- architecture-overview.md
- auth-login-sequence.md
- db-user-er.md
- checkout-flow.md
- api-endpoints-map.md
```

---

## Reuse Workflow

### 1. List Diagrams

```
/Canvas list diagrams
```

出力:
```
## Saved Diagrams

| # | Name | Type | Updated | Tags |
|---|------|------|---------|------|
| 1 | architecture-overview | Flowchart | 2026-01-31 | architecture |
| 2 | auth-sequence | Sequence | 2026-01-31 | auth, api |
| 3 | db-er | ER | 2026-01-31 | database |

Use `/Canvas show [name]` to view a diagram.
```

### 2. Show Diagram

```
/Canvas show auth-sequence
```

### 3. Update Diagram

```
/Canvas update auth-sequence
```

ワークフロー:
1. 既存の図とソースを読み込み
2. ソースの変更を検出
3. 差分を適用して図を更新
4. Change History に記録

### 4. Regenerate from Source

```
/Canvas regenerate auth-sequence
```

ソースファイルから図を完全に再生成（変更が大きい場合）。

---

## Auto-Suggestion

### On Code Change

コード変更時に関連図の更新を提案:

```yaml
questions:
  - question: "関連する図が見つかりました。更新しますか？"
    header: "Update"
    options:
      - label: "Yes, update diagram (Recommended)"
        description: "変更を反映して図を更新"
      - label: "Show diff first"
        description: "変更内容を確認してから判断"
      - label: "No, keep current"
        description: "今回は更新しない"
    multiSelect: false
```

### On Diagram Not Found

図が見つからない場合:

```yaml
questions:
  - question: "関連する保存済み図が見つかりません。新規作成しますか？"
    header: "Create"
    options:
      - label: "Yes, create and save"
        description: "図を生成してライブラリに保存"
      - label: "Create without saving"
        description: "図を生成するが保存しない"
    multiSelect: false
```

---

## Integration with Other Agents

### Atlas → Canvas

Atlas が分析した依存関係を図として保存:

```markdown
## Atlas → Canvas Diagram Save

**Analysis**: Dependency map from Atlas
**Suggested Name**: dependency-graph.md
**Type**: Class Diagram
**Tags**: dependencies, architecture

→ `/Canvas save diagram as dependency-graph`
```

### Scout → Canvas

Scout が調査したバグ発生フローを保存:

```markdown
## Scout → Canvas Diagram Save

**Investigation**: Bug occurrence flow
**Suggested Name**: bug-{issue-id}-flow.md
**Type**: Sequence Diagram
**Tags**: bug, investigation, {issue-id}
```

### Echo → Canvas

Echo の Journey Map を保存:

```markdown
## Echo → Canvas Diagram Save

**Walkthrough**: User journey with emotion scores
**Suggested Name**: {flow-name}-journey.md
**Type**: Journey
**Tags**: ux, journey, {persona-name}
```

---

## Question Templates

### ON_DIAGRAM_SAVE

```yaml
questions:
  - question: "生成した図をライブラリに保存しますか？"
    header: "Save"
    options:
      - label: "Yes, save to library (Recommended)"
        description: ".agents/diagrams/{project}/ に保存"
      - label: "Save with custom name"
        description: "名前を指定して保存"
      - label: "No, don't save"
        description: "今回は保存しない"
    multiSelect: false
```

### ON_DIAGRAM_UPDATE

```yaml
questions:
  - question: "保存済み図を更新しますか？"
    header: "Update"
    options:
      - label: "Update existing (Recommended)"
        description: "既存の図を更新"
      - label: "Save as new version"
        description: "新しいバージョンとして保存"
      - label: "Cancel"
        description: "更新をキャンセル"
    multiSelect: false
```

### ON_DIAGRAM_CONFLICT

```yaml
questions:
  - question: "同名の図が存在します。どうしますか？"
    header: "Conflict"
    options:
      - label: "Overwrite (Recommended)"
        description: "既存の図を上書き"
      - label: "Rename"
        description: "別の名前で保存"
      - label: "Cancel"
        description: "保存をキャンセル"
    multiSelect: false
```
