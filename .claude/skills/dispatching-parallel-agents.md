# Skill: Dispatching Parallel Agents — 並列subagent実行

**Trigger**: 独立タスクが複数ある時、qa-rounds 3視点検証時

## Purpose

独立したタスクを並列にsubagentへdispatchし、全体時間を短縮する。
rally（並列オーケストレーター）との連携スキル。

## When to Use

- 複数ファイルの独立した変更（テスト追加、ドキュメント更新等）
- qa-rounds の3視点検証（analyst/sentinel/echo が同時に見る）
- 複数モジュールの独立した実装

## When NOT to Use

- タスク間に依存関係がある（A完了後にB）
- 同一ファイルの変更（コンフリクト必至）
- デバッグ（原因特定は逐次）

## The Process

### Step 1: タスクの独立性判定

```
タスクA: tests/test_login.py 作成
タスクB: tests/test_logout.py 作成
タスクC: docs/auth.md 更新
→ 全て独立 → 並列可能

タスクD: src/auth.py 実装
タスクE: tests/test_auth.py 実装
→ Eの前にDが必要 → 逐次
```

### Step 2: Rally経由で並列dispatch

```
/rally 以下の3タスクを並列実行:
  1. Codexでtests/test_login.py 生成
  2. Codexでtests/test_logout.py 生成
  3. Claudeでdocs/auth.md 更新
```

### Step 3: 結果の統合

各subagentの成果物を確認し、統合commitする。

## qa-rounds 並列化パターン

Round 1 で3エージェントが各項目を検証:

```
# 逐次（遅い）
analyst → Comment記入 → sentinel → Comment記入 → echo → Comment記入
合計: 3x時間

# 並列（速い）
analyst ─┐
sentinel ├→ 同時実行 → 3並列でComment記入
echo    ─┘
合計: 1x時間
```

実装:
```
/rally qa-rounds Round 1 並列検証:
  - analyst: データ精度視点でTI-001〜TI-010をComment記入
  - sentinel: セキュリティ視点でTI-001〜TI-010をComment記入
  - echo: UX視点でTI-001〜TI-010をComment記入
```

## ファイルオーナーシップ

並列実行時はファイル競合を防ぐため、各agentに担当範囲を明示:

```
agent A: src/api/*.py （APIレイヤー）
agent B: src/db/*.py （DBレイヤー）
agent C: tests/*.py （テスト）

→ ファイル範囲が重ならないことを保証
```

## Anti-patterns

**Bad**: 依存タスクを並列化
```
A: 実装
B: Aのテスト
→ 並列 → B先行 → テスト失敗 → 混乱
```

**Good**: 独立タスクだけ並列化
```
独立タスクA,B,C → 並列
依存タスクD → A完了後に逐次
```

## hook連携

qa-workflow-driver.js で独立タスクを自動検出し、
可能なものを自動的にrally経由dispatch:

```
qa-rounds Phase 6 進入時:
  → 自動でrallyに3視点並列検証を指示
  → 各agentが並列で作業
  → 全完了後に統合
```

## 参考
- github.com/obra/superpowers/skills/dispatching-parallel-agents
- Luna rally agent: agents/rally/SKILL.md
