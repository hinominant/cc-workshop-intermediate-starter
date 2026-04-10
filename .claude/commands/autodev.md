# Autodev Mode — 完全自動開発

チケットIDまたは自然言語の指示を受けて、最適なワークフローを自動選択し、
全フェーズを自律的に完走する。チケットがなければ自動作成する。

## タスク

$ARGUMENTS

## Step 0: チケット解決（最初に必ず実行）

### チケットIDが指定された場合
1. Linear APIまたは既知の情報からチケット詳細を取得
2. `.context/current_ticket.json` に設定

### チケットIDがない場合（自然言語の指示のみ）
1. ユーザーの指示からタイトル・ラベルを推定:
   - 「バグ」「エラー」「壊れてる」「直して」→ ラベル: `bug`
   - 「新機能」「作って」「追加して」「実装して」→ ラベル: `feature`
   - 「大規模」「リファクタ」「刷新」「全面」→ ラベル: `epic`
   - 「セキュリティ」「脆弱性」「漏洩」→ ラベル: `security`
2. /create-ticket スキルでLinearにチケットを自動作成
3. 作成されたチケットIDを `.context/current_ticket.json` に設定
4. チケット作成に失敗した場合、ローカルIDを仮採番（LOCAL-001等）して続行

### current_ticket.json フォーマット
```json
{
  "ticket": "ARIS-500",
  "title": "ユーザーの指示から生成されたタイトル",
  "identifier": "ARIS-500",
  "labels": ["feature"]
}
```

## 自動判定フロー

1. `.context/current_ticket.json` からラベルを読み込む（Step 0で設定済み）
2. ラベルに基づいてワークフローを自動選択:

| ラベル | ワークフロー | フロー |
|--------|-------------|--------|
| `epic` | `/epic` | CEO判断→NOVA設計→Sherpa分解→Feature群/superpowers |
| `feature` | `/superpowers` | 7フェーズ（Spec→Design→Red Tests→Impl→Hardening→Review→Done） |
| `bug`, `fix` | `/superpowers` (light) | 3フェーズ（Spec→Impl→Done） |
| `security` | `/superpowers` (strict) | 7フェーズ（全ゲート有効） |
| `refactor` | `/superpowers` (light) | 3フェーズ |

3. `.context/autonomous-mode` を自動作成（24時間自律実行モード）
4. 選択されたワークフローを起動

## 実行手順

### Step 1: 環境準備
```bash
touch .context/autonomous-mode
```

### Step 2: Phase初期化
```bash
node scripts/phase-transition.js init $TICKET_ID $RISK_LEVEL
```
- Epic の場合: `node scripts/epic-manager.js init $TICKET_ID $RISK_LEVEL`

### Step 3: ワークフロー実行
- Epic → `/epic $TICKET_ID` の全ステップを自動実行
- Feature → `/superpowers $TICKET_ID` の7フェーズを自動実行
- Bugfix → `/superpowers $TICKET_ID` の3フェーズ（lightスキップ）を自動実行

### Step 4: Phase自動遷移
- `phase-auto-advance.js` hookがcheckpoint充足を検知して自動advance
- 各Phase完了時にphase-summaryを自動生成
- 全Phase完走で `/quality-gate` → commit → push

### Step 5: 完了通知
- `.context/deferred-reviews.jsonl` に事後レビュー記録
- `phase-transition.js status` で最終状態を確認

## autonomous-mode での動作

- ask_user → 全てapprove + ログ記録
- block → そのまま維持（安全性担保）
- Phase遷移 → checkpoint充足で自動advance
- スキル起動 → skill-trigger.jsのdirective=trueで自動指示

## ルール

- autonomous-mode を有効にしてから起動する
- エラーで3回連続失敗 → Telegram通知して待機（ESCALATION.md準拠）
- 完了後に必ず deferred-reviews を確認する
