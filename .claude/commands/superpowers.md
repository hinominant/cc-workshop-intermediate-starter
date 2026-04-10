# Superpowers Mode — 7フェーズ自律開発フロー

Spec-Driven + TDD + ハーネス駆動の品質優先開発モード。
要求定義 → 設計 → テスト → 実装 → 堅牢性 → レビュー → 品質検証の順序を仕組みで強制する。

## タスク

$ARGUMENTS

## 事前準備

1. `.context/test-config.json` を読み込む（テスト実行コマンド・閾値の確認）
2. `.context/current_ticket.json` からチケットID・ラベルを取得
3. `.context/phase-state.json` を確認し、途中再開なら該当Phaseから再開
4. `node scripts/phase-transition.js init TICKET-ID RISK_LEVEL` でPhase初期化
5. リスクレベルを判定:
   - **Strict**: ラベルに `security`, `revenue`, `data-pipeline` を含む → 全7 Phase
   - **Standard**: ラベルに `feature`, `epic` を含む → 5 Phase（hardening省略可）
   - **Light**: ラベルに `bug`, `bugfix`, `fix`, `refactor` を含む → 3 Phase（design/hardening/reviewスキップ）

---

## Phase 1: Spec（要求定義書）

### 1-1: Specの作成 or 確認
`docs/specs/` にチケットIDに対応するSpecが存在するか確認する。
存在しない場合、以下の構造で作成:

```markdown
# TICKET-ID: タイトル

## Purpose
なぜこの変更が必要か。1-3行。

## Acceptance Criteria
- [ ] AC-1: ...
- [ ] AC-2: ...
- [ ] AC-3: ...
（最低3個のチェックボックス）

## Out of Scope
この変更で対応しないこと。
```

### 1-2: Phase遷移
`node scripts/phase-transition.js advance` で次のPhaseへ。

---

## Phase 2: Design（NOVA設計レビュー）

> **Light**: このPhaseはスキップされる（phase-transition.jsが自動判定）

### 2-1: 設計文書の作成
`docs/designs/{TICKET-ID}-design.md` を作成:

```markdown
## Architecture
設計のアーキテクチャ概要。どのモジュールを変更するか。

## Impact Analysis
変更の影響範囲。依存関係、破壊的変更の有無。

## Dependencies
外部依存、他チケットとの依存関係。
```

### 2-2: Phase遷移
checkpoint `design_reviewed = true` を設定し、`advance`。

---

## Phase 3: Red Tests（受入テスト作成）

### 重要: コンテキスト分離
**このPhaseでは src/ 配下の実装コードを読まない。**
tdd-gate.js がsrc/へのRead/Edit/Writeをブロックする。

### 3-1: テストファイル作成
各ACに対して最低2テスト:
1. **Happy path**: `def test_ac1_xxx(self):`
2. **Error path**: `def test_ac1_error_xxx(self):`

### 3-2: Red確認
テスト実行 → **全テストがFAIL（Red）** を確認。

### 3-3: Phase遷移
checkpoint `red_tests_confirmed = true`, `test_count_at_red = N` を設定し、`advance`。

---

## Phase 4: Implementation（実装 → Green化）

### 4-1: 実装方針の検討
Phase Summary 1-3を読み込み、最低2つのアプローチを検討。
**自律実行モード**: 最もシンプルなアプローチを自動選択。

### 4-2: TDD実装サイクル
1ステップ50行以内。Red → Green → Refactor。

### 4-3: 全Green確認
テスト全PASS。checkpoint `all_tests_green = true` 設定、`advance`。

---

## Phase 5: Hardening（堅牢性テスト追加）

> **Light/Standard**: このPhaseはスキップ可能

### 5-1: 堅牢性テスト追加
実装を見た上で追加:
- エッジケース（null, 空, 境界値）
- エラーパス（ネットワーク障害, タイムアウト）
- 並行性（同時アクセス, 競合状態）

### 5-2: カバレッジ確認
カバレッジ閾値: strict=80%, standard=60%

### 5-3: Phase遷移
checkpoint `hardening_done = true` 設定、`advance`。

---

## Phase 6: Review（品質検証）

> **Light**: このPhaseはスキップされる

### 6-1: Judge コードレビュー
Judgeエージェントによる5観点レビュー。

### 6-2: Auditor 品質監査
Auditorエージェントによるプロセス準拠確認。

### 6-3: レビュー結果記録
`.context/review-result.json` に記録:
```json
{
  "reviews": [
    { "reviewer": "judge", "verdict": "PASS" },
    { "reviewer": "auditor", "verdict": "PASS" }
  ],
  "overall": "PASS"
}
```

### 6-4: Phase遷移
checkpoint `quality_review_done = true` 設定、`advance`。

---

## Phase 7: Done（Quality Gate）

### 7-1: 最終検証
テストスイート全体実行 + Lint/型チェック。

### 7-2: /quality-gate 実行
コミット → プッシュ。

### 7-3: Phase状態リセット
`node scripts/phase-transition.js reset`

---

## ルール

- 推測で「動くはず」と言わない。実際にコマンドを実行して確認する
- エラーが出たら無視せず、その場で対処する
- 「後で直す」は禁止。今直す
- Phase 3ではsrc/配下の実装コードを読まない（コンテキスト分離）
- 各Phaseの完了をユーザーに報告する
- Flakyテスト（3回中2回以上PASS）はWARN扱い
- Phase Summary は必ず書き出す（コンテキスト圧縮対策）
- `node scripts/phase-transition.js status` でいつでも現在地確認可能
