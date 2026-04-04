# Workflow Automation Protocol

繰り返すワークフローのスラッシュコマンド化と複合ワークフロー管理。

---

## スラッシュコマンド化の基準

**同じ手順を2回以上実行したら、スラッシュコマンド化を提案する。**

### 検出パターン

| パターン | アクション |
|---------|----------|
| 同一の3ステップ以上の手順を2回実行 | コマンド化を提案 |
| ユーザーが毎セッション同じ指示を出す | コマンド化を提案 |
| 5ステップ以上の手動プロンプト | 即座にコマンド化を提案 |

### 提案フォーマット

```
この手順をスラッシュコマンド `/[name]` として保存しますか？
実行内容:
1. [ステップ1]
2. [ステップ2]
3. [ステップ3]
```

---

## コマンド定義

スラッシュコマンドは `.claude/commands/` に保存する:

```
.claude/commands/
├── deploy.md          # /deploy
├── weekly-report.md   # /weekly-report
└── db-migrate.md      # /db-migrate
```

### コマンドファイル形式

```markdown
# /[command-name]

[実行する手順の詳細記述]

## Steps
1. [ステップ1]
2. [ステップ2]
3. [ステップ3]

## Parameters
- $1: [パラメータ説明]（オプション）
```

---

## 複合ワークフロー

複数のエージェントチェーンを1つのコマンドで実行する:

### 例: `/release`

```yaml
Chain:
  1. Radar (全テスト実行)
  2. Sentinel (セキュリティスキャン)
  3. Launch (バージョニング + CHANGELOG)
  4. Guardian (PR作成)

Mode: AUTORUN_FULL
Guardrail: L2 (テスト失敗時は停止)
```

### 例: `/weekly-report`

```yaml
Chain:
  1. Harvest (PR情報収集)
  2. Analyst (メトリクス集計)

Mode: AUTORUN_FULL
Guardrail: L1 (ログのみ)
```

---

## Integration with Agent Framework

- コマンドはエージェントチェーンテンプレート（_framework.md）と組み合わせて使う
- コマンド内でのエージェント呼び出しは Nexus 経由（hub-spoke ルール遵守）
- 新しいコマンドの作成はガードレール対象外（非破壊的操作）

---

## 既存チェーンテンプレートとの関係

Chain Templates（_framework.md）= エージェント構成の定義
Slash Commands = ユーザーが呼び出すインターフェース

```
ユーザー → /release → Nexus → Chain Template (Release) → Agent Chain
```

チェーンテンプレートを直接拡張するのではなく、コマンドがテンプレートを参照する形で運用する。
