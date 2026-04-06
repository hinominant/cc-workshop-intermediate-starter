# Ecosystem Health Checklist

エコシステム全体の健全性を定期的に検証するプロトコル。
月次で実施し、劣化を早期検出する。

---

## 月次ヘルスチェックプロトコル

### 実施タイミング
- 毎月第1週
- 大規模エージェント追加/削除後（臨時）

### 実施手順
1. 全エージェントのSKILL.mdを `scripts/check-drift.sh` で検証
2. 以下のメトリクスを収集・記録
3. 異常値があれば改善アクションを起票
4. 結果を `.agents/PROJECT.md` のActivity Logに記録

---

## メトリクス定義

### 1. エージェント数

| 指標 | 健全 | 警告 | 危険 |
|------|------|------|------|
| 総エージェント数 | 安定（前月比 +/-2以内） | 前月比 +5以上（急増） | 前月比 -5以上（急減） |
| 新規追加数/月 | 0-3 | 4-6 | 7以上 |
| 非推奨化数/月 | 0-2 | 3-5 | 6以上 |

急増は品質低下のシグナル。急減はエコシステム崩壊のシグナル。

### 2. SKILL.md品質スコア

`agent-design-methodology.md` の6基準で各エージェントを採点する。

| 基準 | 配点 |
|------|------|
| 完全性（Completeness） | 20点 |
| 具体性（Specificity） | 20点 |
| 境界明確性（Boundary Clarity） | 20点 |
| 協調性（Collaboration） | 15点 |
| 独自性（Distinctness） | 15点 |
| 行数（Line Count） | 10点 |

| 指標 | 健全 | 警告 | 危険 |
|------|------|------|------|
| 全エージェント平均 | 80点以上 | 60-79点 | 60点未満 |
| 最低スコアエージェント | 60点以上 | 40-59点 | 40点未満 |

### 3. 重複指数（Overlap Index）

全エージェントペアの責務マトリクス重複率の最大値。

| 指標 | 健全 | 警告 | 危険 |
|------|------|------|------|
| 最大重複率 | 20%未満 | 20-30% | 30%超 |
| 重複率20%超のペア数 | 0 | 1-2 | 3以上 |

### 4. 利用頻度

`.agents/PROJECT.md` Activity Logから集計。

| 指標 | 健全 | 警告 | 危険 |
|------|------|------|------|
| 月間利用ゼロのエージェント数 | 全体の10%未満 | 10-25% | 25%超 |
| 上位5エージェントへの集中率 | 50%未満 | 50-70% | 70%超（他が使われていない） |

---

## ドリフト検出

SKILL.mdに書かれた仕様と、実際の運用での振る舞いの乖離を検出する。

### 検出方法

| チェック項目 | 方法 |
|------------|------|
| テンプレート構造の準拠 | `scripts/check-drift.sh [agent]` を全エージェントに実行 |
| Boundariesの「Never」違反 | Activity Logで各エージェントの実行タスクをNeverリストと照合 |
| permissionMode違反 | read-onlyエージェントがファイル変更した記録がないか |
| cognitiveMode重複 | 同一cognitiveModeを使うエージェントが3つ以上になっていないか |
| COLLABORATION_PATTERNS乖離 | 定義されたInput元以外からタスクを受けていないか |

### ドリフト重大度

| レベル | 定義 | 対応 |
|--------|------|------|
| 低 | 行数が範囲外（200-500行の外） | 次回メンテナンスで調整 |
| 中 | Boundariesの「Never」に1件の違反 | 原因調査 → SKILL.mdまたは運用の修正 |
| 高 | permissionMode違反、またはcognitiveMode重複3つ以上 | 即時対応 |
| 致命的 | COLLABORATION_PATTERNSが実態と完全に乖離 | SKILL.md全面書き直し |

---

## 非推奨化（Deprecation）基準とプロセス

### 非推奨化トリガー（いずれか1つで検討開始）

1. 3ヶ月連続でActivity Log記録ゼロ
2. 別エージェントが責務を完全に吸収した
3. エコシステム方針変更で不要になった

### 非推奨化プロセス

| ステップ | 期間 | 内容 |
|---------|------|------|
| 1. 非推奨マーク | Day 0 | frontmatterに `deprecated: true` を追加 |
| 2. 依存確認 | Day 0-7 | 他エージェントのCOLLABORATION_PATTERNSから参照を確認 |
| 3. 移行案内 | Day 7 | 参照元エージェントのSKILL.mdを更新（代替エージェント指定） |
| 4. 猶予期間 | Day 7-37 | 30日間は呼び出し可能だが、警告をログに記録 |
| 5. 削除 | Day 37 | ディレクトリごと削除、install.shから除去 |

---

## エージェント進化トラッキング

### バージョン履歴

各SKILL.mdの末尾「更新履歴」セクションで追跡する。記録すべき変更:

- Philosophy/Mission の変更（重大: エージェントのアイデンティティ変更）
- Boundaries の変更（重大: 責務範囲の変更）
- CAPABILITIES_SUMMARY の追加/削除（中: 能力の変化）
- Process の変更（軽微: 手順の改善）
- references/ の追加/変更（軽微: 知識の拡充）

### 能力変化の監視

月次チェックで以下を確認:
- 前月から Boundaries が変更されたエージェントをリストアップ
- Always項目が3つ以上増えたエージェント → Scope Creepの兆候
- Never項目が減ったエージェント → 制約緩和の妥当性を確認

---

## クロスリファレンス整合性

エコシステム内の参照が正しいことを検証する。

### チェック項目

| チェック | 方法 | 自動化 |
|---------|------|--------|
| COLLABORATION_PATTERNSのエージェント名が実在するか | 全SKILL.mdのInput/Output内エージェント名を `agents/` ディレクトリと照合 | `check-drift.sh` |
| ハンドオフ先が相互参照されているか | Agent AがOutput先にBを書いているなら、BのInputにAがあるか | 手動 |
| references/内のファイルパスが正しいか | SKILL.md内で参照されるreferences/ファイルの存在確認 | `check-drift.sh` |
| _common/プロトコル参照が正しいか | 「`_common/XXX.md`参照」の記述先ファイルの存在確認 | `check-drift.sh` |

### 壊れた参照の影響

- ハンドオフ先が存在しない → タスクが宙に浮く（Ghost Agentの逆パターン）
- 相互参照がない → 片方向の依存（呼ばれる側が知らない）
- ファイルパスが壊れている → エージェントが必要な知識にアクセスできない

---

## レポートテンプレート

```markdown
## Ecosystem Health Report - YYYY-MM

### Summary
- Agent count: XX (前月比 +/-N)
- Average quality score: XX/100
- Max overlap: XX% (Agent A <-> Agent B)
- Zero-usage agents: XX (リスト)

### Drift Detection
- Template violations: X agents
- Boundary violations: X incidents
- Permission violations: X incidents

### Actions Required
1. [具体的なアクション]
2. [具体的なアクション]

### Next Check: YYYY-MM-DD
```

---

## 更新履歴

- 2026-04-06: 初版作成。SKILL.mdのEcosystem Health Checksを運用プロトコルに展開
