# Epic Workflow Protocol

複数Featureを束ねるEpicのライフサイクルを定義する。

---

## Phase遷移図

```
planning → design → decomposed → in-progress → integration → done
```

## Phase定義

| # | Phase | 説明 | 事前条件 | ゲート |
|---|-------|------|---------|--------|
| 1 | planning | OGSM作成 + CEO判断 | なし | ogsm-gate.js + epic-gate.js |
| 2 | design | NOVA設計・アーキテクチャ分析 | ogsm_valid, ceo_approved | design-gate.js |
| 3 | decomposed | Sherpa分解 → Feature群生成 | nova_design_exists | epic-manager.js decompose |
| 4 | in-progress | Feature実行中（/superpowers） | features_created | epic-progress-sync.js |
| 5 | integration | 全Feature完了 → 統合テスト | all_features_done | 手動検証 |
| 6 | done | Epic完了 | integration_verified | quality-gate-enforcer.js |

## 状態管理

`.context/epic-state.json` で管理。`scripts/epic-manager.js` で操作。

```bash
node scripts/epic-manager.js init EPIC-ID strict    # 初期化
node scripts/epic-manager.js status                  # 状態表示
node scripts/epic-manager.js decompose --features F1,F2  # Feature分解
node scripts/epic-manager.js track                   # 子Feature進捗
node scripts/epic-manager.js advance                 # 次Phaseへ
node scripts/epic-manager.js reset                   # リセット
```

## Feature との連携

```
Epic (epic-state.json)
  ├── Feature 1 (phase-state.json) → /superpowers で7フェーズ実行
  ├── Feature 2 (phase-state.json) → /superpowers で7フェーズ実行
  └── Feature 3 (phase-state.json) → /superpowers で7フェーズ実行

epic-progress-sync.js が各Featureの進捗を親Epicに自動反映
```

## /epic との連携

`/epic EPIC-ID` で起動すると:
1. `epic-manager.js init` でEpic初期化
2. CEO判断 → NOVA設計 → Sherpa分解
3. 各Featureに `/superpowers` を実行
4. 全Feature完了 → 統合テスト → done
