# Agent Anti-Patterns Reference

エージェント設計・レビュー時に検出すべきアンチパターン。
各パターンの検出シグナルと具体的な改善手順を定義する。

---

## 1. Swiss Army Agent（万能ナイフ型）

**定義:** 責務が多すぎて、何のエージェントか一言で説明できない。

### 検出シグナル
- CAPABILITIES_SUMMARYが6項目以上
- Philosophyに「and」「also」が3回以上出現
- descriptionが80文字を超える
- Processステップが8つ以上
- 「AもBもCもこのエージェントが担当」という説明になる

### 実例
```yaml
# NG: 何でもやるエージェント
description: コードレビュー、テスト生成、リファクタリング、ドキュメント生成、パフォーマンス分析を行う
```

### 改善手順
1. CAPABILITIES_SUMMARYの各項目を独立したミッションとして評価
2. 関連性の低い項目をグループ分け（2-3グループに分離）
3. 各グループが既存エージェントの責務と一致するか確認
4. 一致しないグループのみ新エージェント候補とする

---

## 2. Ghost Agent（幽霊型）

**定義:** 定義はあるが、誰からも呼ばれない。ルーティングの導線が存在しない。

### 検出シグナル
- COLLABORATION_PATTERNSのInputが空または曖昧
- INTERACTION_TRIGGERSが定義されていない
- 他のどのエージェントのSKILL.mdにもこのエージェント名が出てこない
- 1ヶ月以上の運用で`.agents/PROJECT.md`のActivity Logに記録がない

### 実例
```markdown
COLLABORATION_PATTERNS:
- Input: [Various agents may request analysis]  # 誰？いつ？
- Output: [Reports]  # 誰に？
```

### 改善手順
1. エコシステム内の全SKILL.mdでこのエージェント名をgrep
2. 参照ゼロなら: 具体的なInput元を1つ以上定義し、そのInput元のSKILL.mdにも参照を追加
3. それでも自然な接続点がないなら: エージェントではなくスキル（skills/）に格下げ
4. 30日間の猶予後、Activity Log記録ゼロなら deprecation 開始

---

## 3. Clone Agent（クローン型）

**定義:** 既存エージェントと80%以上の機能が重複。名前だけ違う。

### 検出シグナル
- Philosophyが既存エージェントの言い換えに見える
- 責務マトリクスで重複率30%超
- 「Xエージェントとの違いは？」に明確に答えられない
- BoundariesのAlways/Neverリストが既存エージェントとほぼ同じ

### 実例
```markdown
# Agent A: "コードの品質を分析し改善点を提案する"
# Agent B: "コード品質を評価し改善を推奨する"
# → 同じことを言っている
```

### 改善手順
1. 責務マトリクスで重複箇所を特定
2. 重複しない責務だけを抽出
3. その責務が独立エージェントに値するか評価（Need Validation Protocol）
4. 値しない場合: 既存エージェントのreferences/に専門知識として統合

---

## 4. Placeholder Agent（プレースホルダ型）

**定義:** テンプレートを埋めただけで、具体的な行動指示がない。

### 検出シグナル
- Processステップが抽象動詞のみ（「分析する」「評価する」「最適化する」）
- 「When X, do Y」形式の具体的指示がゼロ
- BoundariesのAlways/Ask/Neverが各3項目未満
- Philosophyが2行以下
- 行数が200行未満

### 実例
```markdown
## Process
1. コードを分析する
2. 問題を特定する
3. 改善を提案する
# → 何のコード？何の問題？どんな改善？全て不明
```

### 改善手順
1. Processの各ステップに「具体的なInput」「具体的なAction」「具体的なOutput」を追加
2. 最低3つの実際のタスクシナリオを想定し、各Processステップで何が起きるかをシミュレーション
3. シミュレーション結果をProcess/Boundariesに反映
4. 品質基準6項目を全て再チェック

---

## 5. Island Agent（孤島型）

**定義:** エコシステム内の他エージェントとの接続がない。単独で完結する設計。

### 検出シグナル
- COLLABORATION_PATTERNSにNexus以外のエージェント名がない
- Processに他エージェントへのハンドオフポイントがない
- Outputが「レポート」「分析結果」で終わり、次のアクションに繋がらない
- Boundariesに「他エージェントとの連携」に関する項目がない

### 実例
```markdown
COLLABORATION_PATTERNS:
- Input: [Nexus routes task]
- Output: [Analysis report]
# → Nexus経由で入って、レポートを出して終わり。誰がレポートを使う？
```

### 改善手順
1. このエージェントのOutputを消費するエージェントを特定（最低1つ）
2. 逆に、このエージェントのInputを生成するエージェントを特定（Nexus以外で最低1つ）
3. 双方のSKILL.mdにクロスリファレンスを追加
4. Processの最終ステップに明示的なハンドオフを記述

---

## 6. Scope Creep Agent（領域侵食型）

**定義:** 運用開始後に責務が徐々に拡大し、隣接エージェントの領域を侵食する。

### 検出シグナル
- Activity Logで当初想定外のタスクタイプが増加
- Boundariesの「Never」項目に該当するタスクを実行した記録がある
- 他エージェントの利用頻度が低下（仕事を奪われている）
- SKILL.mdの更新でAlways項目が増え続けている
- Processステップが初版から3つ以上増加

### 実例
```
# 初版: "テストの網羅性を分析する"
# 3ヶ月後: "テスト生成、テスト実行、カバレッジレポート、CI設定、テスト戦略立案"
# → Radar, Gear, Sherpaの領域を侵食
```

### 改善手順
1. 初版SKILL.mdとの差分を確認（git diff）
2. 追加された責務を隣接エージェントの責務と照合
3. 重複する責務を元のエージェントに戻す
4. Boundariesの「Never」を強化して再侵食を防止
5. 必要なら新エージェントとして正式に分離（Need Validation Protocol経由）

---

## アンチパターン検出チェックリスト

レビュー時に全項目を確認する。1つでも該当したら設計を差し戻す。

| # | チェック | 該当パターン |
|---|---------|------------|
| 1 | CAPABILITIES_SUMMARYが6項目以上か？ | Swiss Army |
| 2 | COLLABORATION_PATTERNSのInputが具体的か？ | Ghost |
| 3 | 責務マトリクスで重複率30%未満か？ | Clone |
| 4 | Processに「When X, do Y」形式の具体指示があるか？ | Placeholder |
| 5 | Nexus以外のエージェントとの接続があるか？ | Island |
| 6 | Boundariesの「Never」が4項目以上あるか？ | Scope Creep |

---

## 更新履歴

- 2026-04-06: 初版作成。SKILL.mdのAnti-Patterns表を実践レベルに展開
