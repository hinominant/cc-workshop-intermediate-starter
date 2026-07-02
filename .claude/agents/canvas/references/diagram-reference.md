# canvas — 図表生成 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## OUTPUT FORMAT

Standard output structure for all diagram types:

```markdown
## Canvas Diagram

### [Diagram Title]

**Purpose:** [The question this diagram answers]
**Target:** [Scope/target files]
**Format:** Mermaid / ASCII Art / draw.io
**Abstraction:** Overview / Detailed / Code-level

### Diagram Code

[Mermaid/ASCII/XML code block]

### Diagram Explanation

[Key points, how to read]

### Sources

[Referenced files/documents]
```

For draw.io: Save as `.drawio` file, open with diagrams.net or VS Code extension.

---

## DRAW.IO & LAYOUT

See `references/drawio-specs.md` for complete draw.io specifications:
- XML structure, vertex/edge syntax
- Shape styles and color palette
- Edge styles (UML, ER arrows)
- Layout algorithms by diagram type
- Coordinate calculation rules

---

## DIAGRAM TEMPLATES

Available templates for common diagram types:

| Type | Formats | Use Case |
|------|---------|----------|
| Flowchart | Mermaid, draw.io | Process flows, conditionals |
| Sequence | Mermaid, draw.io | API calls, component communication |
| State | Mermaid, draw.io | State management, lifecycles |
| Class | Mermaid, draw.io | Data models, type structures |
| ER | Mermaid, draw.io | Database relationships |
| Mind Map | Mermaid, draw.io | Concept organization |
| Gantt | Mermaid, draw.io | Task planning, schedules |
| Journey | Mermaid, draw.io | User experience flows |

See `references/diagram-templates.md` for Mermaid and draw.io code.
See `references/ascii-templates.md` for ASCII art templates.

---

## DIAGRAM LIBRARY

生成した図をプロジェクト固有のライブラリとして保存・再利用。

### Commands

```
/Canvas save diagram                    # 生成した図を保存
/Canvas save diagram as [name]          # 名前を指定して保存
/Canvas list diagrams                   # 保存済み図一覧
/Canvas show [diagram-name]             # 保存済み図を表示
/Canvas update [diagram-name]           # 図を更新
/Canvas regenerate [diagram-name]       # ソースから再生成
```

### Storage

保存先: `.agents/diagrams/{project}/`

```
.agents/diagrams/
└── {project-name}/
    ├── _index.md                       # 図の一覧
    ├── architecture-overview.md        # システム概要図
    ├── auth-sequence.md                # 認証シーケンス
    └── db-er.md                        # ER図
```

### Auto-Suggestion

- 図生成後に保存を提案
- コード変更時に関連図の更新を提案
- 図が見つからない場合は新規作成を提案

**詳細**: `references/diagram-library.md`

---

## ECHO INTEGRATION

Integration with Echo agent. Journey Map, Emotion Score visualization, Internal Persona visualization.

### Visualization Types (User Persona)

| Type | Description | Trigger |
|------|-------------|---------|
| Journey Map | User journey with Emotion Score | `/Canvas visualize journey` |
| Friction Heatmap | Visualize friction points with colors | `/Canvas friction heatmap` |
| Cross-Persona | Multi-persona comparison matrix | `/Canvas visualize cross-persona` |
| Emotion Trend | Emotion score trend graph | `/Canvas emotion trend` |

### Visualization Types (Internal Persona)

| Type | Description | Trigger |
|------|-------------|---------|
| Profile Card | Internal persona profile visualization | `/Canvas visualize internal-persona` |
| Team Structure | Organization chart / collaboration matrix | `/Canvas visualize team-structure` |
| Workflow Diagram | Daily workflow and task visualization | `/Canvas visualize workflow` |
| DX Journey | Developer experience journey map | `/Canvas visualize dx-journey` |

### Color Scale (Emotion Score)

| Score | Color | Meaning |
|-------|-------|---------|
| +3, +2 | Green | Positive |
| +1, 0 | Yellow | Neutral |
| -1 | Orange | Warning |
| -2, -3 | Red | Critical |

### Saved Persona Integration

Integrates with Echo's saved personas (`.agents/personas/`) and auto-saves Journeys.

- **User Personas**: `.agents/personas/{service}/{persona}.md`
- **Internal Personas**: `.agents/personas/{service}/internal/{persona}.md`

**Details**: `references/echo-integration.md`

---

## REVERSE ENGINEERING

コードから図を自動生成するパターン集。

### Patterns

| # | Pattern | Target | Output | Command |
|---|---------|--------|--------|---------|
| 1 | Component Tree | React/Vue | Mind Map | `/Canvas components` |
| 2 | API Route Map | Next.js/Express | Flowchart | `/Canvas api routes` |
| 3 | State Machine | Redux/Zustand | State Diagram | `/Canvas state` |
| 4 | Database Schema | Prisma/SQL | ER Diagram | `/Canvas schema` |
| 5 | Test Structure | Jest/Vitest | Mind Map | `/Canvas tests` |
| 6 | Dependency Graph | package.json | Class Diagram | `/Canvas deps` |
| 7 | Auth Flow | Auth handlers | Sequence | `/Canvas auth flow` |
| 8 | Data Flow | API handlers | Sequence | `/Canvas data flow` |

### Auto-Detection

```
/Canvas analyze                        # 自動検出して提案
```

**詳細**: `references/reverse-engineering.md`

---

## ACCESSIBILITY

アクセシブルな図の作成。

### Features

- **CVD-Safe Palette**: 色覚多様性対応の8色パレット
- **Alt Text**: スクリーンリーダー向け代替テキスト自動生成
- **ASCII Fallback**: プレーンテキスト環境向け自動変換
- **Shape Differentiation**: 色だけでなく形状でも区別

### CVD-Safe Colors

| 用途 | Hex | Name |
|------|-----|------|
| Process | #4477AA | Blue |
| Success | #228833 | Teal |
| Warning | #CCBB44 | Yellow |
| Error | #EE6677 | Coral |

### Accessibility Checklist

- [ ] CVD-safe colors used
- [ ] Shapes differentiate meaning
- [ ] Alt text included
- [ ] ASCII fallback available

**詳細**: `references/accessibility.md`

---

## DIFF VISUALIZATION

Before/After 比較、変更の可視化。

### Commands

```
/Canvas diff [file1] [file2]           # 2ファイル比較
/Canvas diff --before [commit]         # コミット前後比較
/Canvas diff schema                    # スキーマ変更を可視化
/Canvas diff architecture              # アーキテクチャ変更を可視化
```

### Diff Styles

| 変更タイプ | 色 | スタイル |
|-----------|-----|---------|
| Added | Green | 太線 |
| Removed | Red | 破線 |
| Modified | Yellow | 二重線 |
| Unchanged | Gray | 通常 |

### Formats

- **Side-by-Side**: 左右並列比較
- **Overlay**: 追加/削除をハイライト
- **Timeline**: 時系列変化

**詳細**: `references/diff-visualization.md`

---

## C4 MODEL

C4 Model によるアーキテクチャ図。

### Levels

| Level | Name | Scope | Audience |
|-------|------|-------|----------|
| 1 | Context | システム境界 | ビジネス |
| 2 | Container | アプリ/DB構成 | アーキテクト |
| 3 | Component | 内部構造 | 開発者 |
| 4 | Code | クラス/関数 | 実装者 |

### Commands

```
/Canvas c4 context                     # Level 1
/Canvas c4 container                   # Level 2
/Canvas c4 component [container]       # Level 3
/Canvas c4 code [component]            # Level 4
/Canvas c4 zoom [element]              # ズームイン
/Canvas c4 zoom out                    # ズームアウト
```

### C4 Color Palette

| Element | Color |
|---------|-------|
| Person | #08427B |
| System | #1168BD |
| Container | #438DD5 |
| Component | #85BBF0 |
| External | #999999 |

**詳細**: `references/c4-model.md`

---

