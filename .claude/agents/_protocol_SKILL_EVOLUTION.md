# Skill Evolution Protocol

スキルは「書いて終わり」ではない。環境が変われば使えなくなる。
実行結果フィードバックに基づき、既存スキルを自動的に改善するループ。

> **Source**: Vasilije (@tricalt) "Self improving skills for agents" — cognee 開発者

---

## 4ステップ改善ループ

```
OBSERVE → INSPECT → ADAPT → VERIFY
  ↑                              |
  └──────────────────────────────┘
```

| ステップ | 目的 | 入力 | 出力 |
|---------|------|------|------|
| **OBSERVE** | 実行結果を記録する | スキル実行ログ | 成功/失敗/部分的の分類 |
| **INSPECT** | 失敗パターンを分析する | 失敗ログ + スキル定義 | 失敗原因の特定 |
| **ADAPT** | スキル定義を改善する | 失敗原因 + 現スキル | 改善案（diff） |
| **VERIFY** | 改善を検証する | 改善後スキル | テスト結果 |

---

## OBSERVE: 実行結果の記録

### 記録先

`.agents/skill-log.jsonl` にスキル実行結果を追記:

```jsonl
{"date":"2026-03-24","skill":"diff-analysis","result":"success","context":"PR前のテスト範囲決定","duration_s":5}
{"date":"2026-03-24","skill":"spec-compliance","result":"partial","context":"SPEC文書が古く誤検出","note":"SPECの日付チェック追加が必要"}
{"date":"2026-03-24","skill":"design-md","result":"fail","context":"Figma MCP未接続でフォールバック失敗","note":"URL解析フォールバックが不十分"}
```

### 記録タイミング

- スキルの Auto-Trigger 発火後
- ユーザーによる手動スキル呼び出し後
- /quality-gate の各 Phase 完了後

### 記録するもの

| フィールド | 内容 |
|-----------|------|
| date | 実行日（ISO 8601） |
| skill | スキル名 |
| result | `success` / `partial` / `fail` |
| context | 何をしようとしていたか（1行） |
| note | 失敗時: 原因と改善の手がかり |

---

## INSPECT: 失敗パターンの分析

### 分析トリガー

| 条件 | アクション |
|------|-----------|
| 同一スキルで `fail` が 2回連続 | **即座に ADAPT へ** |
| 同一スキルで `partial` が 3回蓄積 | **INSPECT → ADAPT** |
| 月次メンテナンス（MAINTENANCE.md） | **全スキルの skill-log を棚卸し** |

### 分析手順

1. `.agents/skill-log.jsonl` から該当スキルの失敗ログを抽出
2. 失敗原因を分類:
   - **環境変化**: ツール/API/フレームワークのバージョン変更
   - **スコープ不足**: スキルがカバーしていないケース
   - **前提崩壊**: スキルが依存する前提条件が変わった
   - **誤検出**: false positive（不要な警告・ブロック）
3. `.agents/lessons.md` に失敗パターンを記録

---

## ADAPT: スキル定義の改善

### 改善の種類

| 種類 | 例 | 変更範囲 |
|------|-----|---------|
| **手順追加** | フォールバックステップの追加 | Steps セクション |
| **条件分岐追加** | 「○○の場合はスキップ」 | Steps or Dry-Run |
| **検出パターン更新** | 新しい検出ルールの追加 | Detection Patterns |
| **前提条件明記** | 「このスキルは○○が必要」 | Purpose or 冒頭 |
| **廃止** | 完全に不要になった | ファイル削除 |

### 改善手順

1. 失敗原因に基づいてスキルファイルを修正
2. 修正内容を `.agents/lessons.md` に記録
3. VERIFY に進む

### 改善の制約

- **1回の改善は1つの問題に対応**（複数問題を同時修正しない）
- **スキルの目的を変えない**（目的が変わるなら新スキル作成）
- **dry-run モードを壊さない**

---

## VERIFY: 改善の検証

1. 改善したスキルを `--dry-run` で実行
2. 過去の失敗ケースが修正されているか確認
3. 既存の成功ケースが壊れていないか確認（回帰チェック）
4. テストがある場合は `npm test` で回帰テスト

**検証パス → スキル更新を確定、skill-log に `adapted` を記録**
**検証失敗 → 改善を revert、別のアプローチで ADAPT に戻る**

---

## 月次メンテナンス

`_common/MAINTENANCE.md` の定期メンテナンスに以下を追加:

### スキル健全性チェック（月1回）

1. `.agents/skill-log.jsonl` を全件読む
2. スキルごとの成功率を算出
3. 成功率 < 80% のスキルを INSPECT 対象にする
4. 3ヶ月間使われていないスキルのアーカイブを検討
5. skill-log が 200行超えたら古いエントリを prune

### 健全性レポート

```markdown
## Skill Health Report (YYYY-MM)

| Skill | Executions | Success | Partial | Fail | Rate | Action |
|-------|-----------|---------|---------|------|------|--------|
| diff-analysis | 15 | 14 | 1 | 0 | 93% | OK |
| spec-compliance | 8 | 5 | 2 | 1 | 63% | INSPECT |
| design-md | 3 | 1 | 1 | 1 | 33% | ADAPT |
```

---

## ARIS 連携

- スキル改善が成功した場合 → `/log-success`（再現条件にスキル名と改善内容を記録）
- 同じスキルが3回以上 ADAPT を繰り返す場合 → `/log-failure`（根本的な設計見直しが必要）
- 改善パターンは ARIS success_pattern_dictionary に蓄積される
