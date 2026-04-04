---
name: aris-feedback
description: ARIS成功/失敗記録手順スキル
model: haiku
effort: low
---

# ARIS Feedback Skill

## Purpose
ARIS（Adaptive Reasoning & Intelligence System）への成功/失敗パターンフィードバック。

## Success Pattern Recording

### トリガー条件
- フェーズ/マイルストーンの完了
- 想定より効率的な手法の発見
- 困難な技術課題の解決
- ユーザーからの明確な肯定フィードバック

### 記録フォーマット
```yaml
type: success
date: YYYY-MM-DD
pattern_name: [パターン名]
context: [状況の説明]
approach: [採用したアプローチ]
outcome: [結果]
reusability: [HIGH/MEDIUM/LOW]
tags: [関連タグ]
```

## Failure Pattern Recording

### トリガー条件
- ツール実行のエラー（設計ミス・判断ミス起因）
- フェーズ順序のスキップ
- 間違ったアプローチによる時間浪費
- ユーザーからの修正指示
- データ欠損・不整合の発見

### 記録フォーマット
```yaml
type: failure
date: YYYY-MM-DD
pattern_name: [パターン名]
context: [状況の説明]
wrong_approach: [誤ったアプローチ]
correct_approach: [正しいアプローチ]
root_cause: [根本原因]
prevention: [再発防止策]
tags: [関連タグ]
```

## 記録先
- Success: `docs/success_pattern_dictionary.md` 候補
- Failure: `docs/failure_pattern_dictionary.md` 候補
- 判断基準: `docs/judgment_criteria_dictionary.md` 候補

## Auto-Sync to Pattern Dictionary

フィードバック記録後、自動的にARISパターン辞書への反映を試みる。

### Sync手順

1. **重複チェック** — 対象辞書の同カテゴリ既存パターンを全件確認
   - 同カテゴリ（SP-TECH, OPS, ARC, etc.）のパターンを全て読む
   - 同じ事象・同じ根本原因のパターンが既にあるか判定
2. **判定**
   - 重複あり → 既存パターンを**更新**（発生日・回数・追加知見を追記）
   - 重複なし → 新規パターンとして**追加**
   - 判断困難 → `[SYNC-PENDING]` タグ付きで一時保存、週次メンテナンスで解決
3. **ID採番** — 新規追加時は既存IDの最大値+1で自動採番
   - Success: `SP-{CATEGORY}-{NNN}` (例: SP-TECH-021)
   - Failure: `{CATEGORY}-{NNN}` (例: OPS-027)
4. **フォーマット準拠** — 辞書の既存フォーマットに厳密に従う
5. **報告** — `ARIS に記録しました: {パターン名}` を出力

### 週次メンテナンス

毎週の定期メンテナンス（`_common/MAINTENANCE.md` 準拠）で以下を実行:
- `[SYNC-PENDING]` パターンの解決
- 重複パターンの統合（同根本原因のマージ）
- 低価値パターンのアーカイブ（再現性なし・汎用性なし）

## Dry-Run Mode

`--dry-run` 指定時は辞書への書き込みを行わず、以下のみ出力する:
- 記録タイプ（success / failure）
- パターン名
- 記録先辞書
- 重複チェック結果（既存パターンとの一致有無）

```
[DRY-RUN] aris-feedback: type=failure, pattern="OPS-025: xxx", target=failure_pattern_dictionary.md, duplicates=0
```
