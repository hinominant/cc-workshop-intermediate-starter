# Epic Mode — Epic→Feature分解→実行ワークフロー

複数Featureを束ねるEpicのライフサイクルを管理する。
CEO判断→NOVA設計→Sherpa分解→Feature実行の全フローを1コマンドで起動。

## タスク

$ARGUMENTS

## フロー

### Step 1: Epic初期化
```bash
node scripts/epic-manager.js init EPIC-ID [strict|standard]
```
- OGSM が `.context/ogsm.md` に存在することを確認（ogsm-gate.js が強制）
- checkpoint `ogsm_valid = true` を設定

### Step 2: CEO判断
CEOエージェントに Go/No-Go 判断を委譲する。
- Epic の目的、スコープ、リスクを提示
- CEO が Go を出したら `ceo_approved = true` を設定
- No-Go なら Epic を中止

### Step 3: NOVA設計（strictの場合）
Analystエージェントを NOVA モードで起動。
- Epic全体のアーキテクチャ分析
- 影響範囲・依存関係の洗い出し
- `docs/designs/EPIC-ID-design.md` を生成
- checkpoint `nova_design_exists = true` を設定

### Step 4: Feature分解
SherpaエージェントでEpicをFeatureに分解。
```bash
node scripts/epic-manager.js decompose --features FEAT-001,FEAT-002,FEAT-003
```
- 各FeatureにSpecを作成（docs/specs/FEAT-XXX.md）
- 各Featureに phase-transition.js init を実行

### Step 5: Feature実行
各Featureに対して `/superpowers FEAT-XXX` を実行。
- 7フェーズフローで品質を担保
- epic-progress-sync.js が親Epic進捗を自動更新

### Step 6: 統合
全Feature完了後:
- 統合テスト実行
- checkpoint `integration_verified = true`
- `node scripts/epic-manager.js advance` で done へ

## 進捗確認

```bash
node scripts/epic-manager.js status   # Epic全体の状態
node scripts/epic-manager.js track    # 子Feature進捗一覧
```

## ルール

- CEO判断なしにFeature実行に入らない
- Feature間の依存はSherpa分解時に明示する
- 全Feature完了まで Epic を done にしない
