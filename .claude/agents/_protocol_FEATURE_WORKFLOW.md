# Feature Workflow Protocol

Feature/Epic開発の全7フェーズを結線する。手順スキップを物理的に不可能にする仕組み。

---

## Phase遷移図

```
spec → design → red-tests → impl → hardening → review → done
```

各Phase間にhookゲートがあり、事前条件を満たさないと遷移できない。

## Phase定義

| # | Phase | 説明 | 事前条件 | ゲート |
|---|-------|------|---------|--------|
| 1 | spec | 要求定義書作成 | なし | spec-gate.js |
| 2 | design | NOVA設計レビュー | spec_exists, spec_sections_valid | design-gate.js |
| 3 | red-tests | 受入テスト作成（src/読まない） | design_reviewed | tdd-gate.js |
| 4 | impl | 実装（テスト全Green化） | red_tests_confirmed | tdd-gate.js |
| 5 | hardening | 堅牢性テスト追加 | all_tests_green | phase-transition.js内チェック |
| 6 | review | 品質検証（Judge + Auditor） | hardening_done | review-gate.js |
| 7 | done | 完了（commit + push） | quality_review_done | quality-gate-enforcer.js |

## リスクレベル別フロー

| レベル | 対象ラベル | Phase範囲 | スキップ |
|--------|-----------|----------|---------|
| strict | security, revenue, data-pipeline | 全7 Phase | なし |
| standard | feature, epic | 5-7 Phase | hardening省略可 |
| light | bug, fix, refactor | 3 Phase | design, hardening, review スキップ |

## 状態管理

`.context/phase-state.json` で管理。`scripts/phase-transition.js` で操作。

```bash
node scripts/phase-transition.js init TICKET-ID standard  # 初期化
node scripts/phase-transition.js status                    # 現在地確認
node scripts/phase-transition.js check                     # 遷移条件チェック
node scripts/phase-transition.js advance                   # 次Phaseへ
node scripts/phase-transition.js reset                     # リセット
```

## hookとの連携

| Hook | Phase | 役割 |
|------|-------|------|
| spec-gate.js | spec → design | Spec存在+構造チェック（Purpose/AC/OoS） |
| design-gate.js | design → red-tests | 設計文書存在チェック（strict必須/light不要） |
| tdd-gate.js (red-tests) | red-tests | src/アクセスブロック（コンテキスト分離） |
| tdd-gate.js (impl) | impl | テスト存在+ACマッピングチェック |
| review-gate.js | review → done | Judge+Auditorレビュー結果チェック |
| quality-gate-enforcer.js | done | HMACノンスcommit+pushブロック |
| skill-trigger.js | 全Phase | スキル自動提案 |
| doc-sync-gate.sh | done | ドキュメント整合性チェック |

## /superpowers との連携

`/superpowers TICKET-ID` で起動すると:
1. `phase-transition.js init` で状態初期化
2. 各Phase完了時に `phase-transition.js advance` で自動遷移
3. Phase Summary が `.context/phase-summary-N.md` に自動生成
4. セッション切断時は `phase-transition.js status` で再開位置を確認
