# QA: {TICKET-ID} {タイトル}

## Meta
- spec: docs/specs/{ticket}_spec.md
- created: YYYY-MM-DD
- status: team-composition

## Team Composition

### Selection Process
- composed_by: magi
- session_id: {テスト項目列挙セッションのID}
- rationale: |
    {なぜこのチームか。チケットの性質から必要な専門性を導出}

### Assigned
| Role | Agent | Why |
|------|-------|-----|
| 視点A: {観点名} | {agent} | {選定理由} |
| 視点B: {観点名} | {agent} | {選定理由} |
| 視点C: {観点名} | {agent} | {選定理由} |

### Rejected Candidates
| Agent | Reason |
|-------|--------|
| {agent} | {なぜ外したか} |

## Catalog Coverage

### Applied Catalogs
- [ ] {catalog名}（キーワード: {マッチしたキーワード}）

### Uncovered Items
| Catalog | Item ID | Item Name | Exclusion Reason |
|---------|---------|-----------|-----------------|
| {catalog} | {ID} | {項目名} | {除外理由 — 空欄禁止} |

## Test Items

### TI-001: {具体的なテスト項目名（入力値・期待出力を含む）}
- test_file: tests/{path}::{test_function}
- category: 正常系 | 異常系 | 境界値 | セキュリティ | パフォーマンス | UX | E2E | 統合 | プロパティベース | カオス | スナップショット
- derived_from: AC-{N}
- catalog_ref: {AUTH-001 等。カタログ由来の場合}

| Round | Perspective | Agent | Result | Evidence | Comment |
|-------|-----------|-------|--------|----------|---------|
| R1 | {視点A名} | {agent} | - | - | - |
| R1 | {視点B名} | {agent} | - | - | - |
| R1 | {視点C名} | {agent} | - | - | - |
| R2 | {視点A名} | {agent} | - | - | - |
| R2 | {視点B名} | {agent} | - | - | - |
| R2 | {視点C名} | {agent} | - | - | - |
| R3 | {視点A名} | {agent} | - | - | - |
| R3 | {視点B名} | {agent} | - | - | - |
| R3 | {視点C名} | {agent} | - | - | - |

## Coverage Matrix

| AC | Test Items | Categories Covered |
|----|-----------|-------------------|
| AC-1 | TI-001, TI-003 | 正常系, 異常系, 境界値 |

## Round Depth Requirements

### Round 1: 機能検証
- [ ] ユニットテスト全件実行
- [ ] 統合テスト実行（E2E項目がある場合）
- test_types_run: [unit, integration]

### Round 2: エッジケース + セキュリティ
- [ ] プロパティベーステスト実行
- [ ] セキュリティ固有テスト（sentinel必須参加）
- [ ] テスト順序ランダム化実行（pytest-randomly）
- test_types_run: [unit, integration, property, security]
- sentinel_participated: false

### Round 3: カオス + 非機能 + ミューテーション
- [ ] カオステスト（該当する場合）
- [ ] ミューテーションテスト（mutmut/Stryker）
- [ ] 全既存テストリグレッション
- test_types_run: [unit, integration, property, security, mutation, regression]
- mutation_score: -
- auditor_participated: false
- regression_all_pass: false
- regression_total_tests: {N}（今回）vs {N}（前回commit時）

## Round Summary

### Round 1
- date: -
- test_report_hash: -
- total: -
- pass: -
- fail: -
- fixes_applied: []

### Round 2
- date: -
- test_report_hash: -
- total: -
- pass: -
- fail: -
- r1_regressions: []
- fixes_applied: []

### Round 3
- date: -
- test_report_hash: -
- total: -
- all_pass: false
- final_verdict: -
- remaining_fails: []
