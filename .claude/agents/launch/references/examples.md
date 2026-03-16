# Launch Examples

## Example 1: Standard Minor Release

### Input
```
User: 次のリリースを準備してください。OAuth認証とレポートエクスポート機能が完成しました。
```

### Launch Response

```markdown
## リリース計画: v1.2.0

### バージョン決定
- 変更タイプ: 新機能追加（後方互換）
- 推奨バージョン: **1.2.0** (MINOR)

### CHANGELOG エントリ

## [1.2.0] - 2024-01-15

### Added
- OAuth2認証によるGoogle/GitHubログイン対応 (#100)
- レポートのPDF/CSVエクスポート機能 (#101)

### Fixed
- 高負荷時のログインタイムアウト問題 (#102)

### リリースノート（ユーザー向け）

# リリース v1.2.0

**リリース日:** 2024年1月15日

## 主な新機能

### OAuth2認証
GoogleまたはGitHubアカウントでログインできるようになりました。
- より速いログイン体験
- パスワード管理不要
- 2FA対応でセキュリティ強化

### レポートエクスポート
レポートを複数形式でダウンロードできます：
- PDF: 共有・印刷用
- CSV: スプレッドシートでの分析用

## バグ修正
- ピーク時のログインタイムアウト問題を修正

### ロールバック計画

1. **第一選択: Feature Flag無効化** (< 1分)
   - OAuth機能をフラグで無効化
   - エクスポート機能は独立しており影響なし

2. **第二選択: コンテナロールバック** (2-5分)
   - `kubectl rollout undo deployment/app -n production`

3. **DBマイグレーションなし** - データ変更なくロールバック容易

### リリースチェックリスト
- [ ] 全テスト合格
- [ ] ステージング検証完了
- [ ] CHANGELOGコミット
- [ ] リリースタグ作成
- [ ] デプロイ実行
- [ ] スモークテスト
```

---

## Example 2: Hotfix Release

### Input
```
User: 本番で認証エラーが発生しています。緊急修正が必要です。
```

### Launch Response

```markdown
## ホットフィックス計画: v1.2.1

### 状況評価
- 現行バージョン: v1.2.0
- 問題: 認証エラー（クリティカル）
- 推奨: 緊急ホットフィックスリリース

### バージョン
- **v1.2.1** (PATCH)

### ホットフィックス手順

1. **ブランチ作成**
   ```bash
   git checkout -b hotfix/v1.2.1 v1.2.0
   ```

2. **修正適用**
   - 最小限の差分に限定
   - 関連する変更のみ

3. **迅速レビュー**
   - 2名の承認者（緊急時）
   - セキュリティ影響確認

4. **デプロイ**
   - ステージングスキップ可（クリティカルのため）
   - ただし本番前にスモークテスト必須

5. **タグ & マージ**
   ```bash
   git tag -a v1.2.1 -m "Hotfix: auth error fix"
   git push origin v1.2.1

   # mainにチェリーピック
   git checkout main
   git cherry-pick <commit-hash>
   ```

### CHANGELOG

## [1.2.1] - 2024-01-16

### Fixed
- Critical: 認証トークン検証エラーを修正 (#130)

### ロールバック
- 問題が継続する場合: v1.2.0にロールバック
- 認証完全無効化は避ける（ユーザー影響大）

### タイムライン
- T+0: 修正コミット
- T+30min: レビュー完了
- T+1h: 本番デプロイ
- T+2h: 安定確認
```

---

## Example 3: Feature Flag Rollout

### Input
```
User: 新しい決済機能を段階的にリリースしたいです。
```

### Launch Response

```markdown
## Feature Flag ロールアウト計画: payment-v2

### フラグ設計

```json
{
  "name": "payment-v2",
  "description": "新決済フロー",
  "owner": "@payment-team",
  "created": "2024-01-15",
  "expires": "2024-03-15",
  "cleanup_ticket": "JIRA-789"
}
```

### ロールアウトステージ

| ステージ | 対象 | 割合 | 期間 | 成功基準 |
|---------|------|------|------|---------|
| 1. 内部テスト | internal | 0% | 2日 | エラー率 < 1% |
| 2. ベータユーザー | beta | 5% | 3日 | エラー率 < 2%, 決済成功率 > 99% |
| 3. 段階展開 | all | 25% | 3日 | 同上 |
| 4. 拡大展開 | all | 50% | 2日 | 同上 |
| 5. 完全展開 | all | 100% | - | 安定 |

### 監視指標

- 決済成功率 (target: > 99.5%)
- エラー率 (target: < 1%)
- レスポンス時間 p95 (target: < 500ms)
- カスタマーサポート問い合わせ数

### 緊急ロールバック

```bash
# フラグ無効化 (< 1分)
curl -X POST https://api.flags.io/flags/payment-v2/disable
```

### 完全展開後のフラグ削除
- 2週間の安定期間後
- コードからフラグ分岐を削除
- クリーンアップPR: JIRA-789
```

---

## Example 4: CHANGELOG Generation

### Input
```
User: v1.1.0からv1.2.0までの変更をCHANGELOGにまとめてください。
```

### Launch Response

```markdown
## CHANGELOG 生成

### コミット分析
```bash
git log v1.1.0..HEAD --oneline --no-merges
```

### 分類結果

**feat (Added):**
- feat(auth): add OAuth2 provider (#100)
- feat(export): add PDF/CSV export (#101)

**fix (Fixed):**
- fix(auth): resolve timeout issue (#102)
- fix(ui): correct button alignment (#103)

**security (Security):**
- security(deps): update vulnerable package (#104)

**その他（記載省略）:**
- chore(deps): update dependencies
- docs(readme): update installation guide
- test(auth): add integration tests

### 生成されたCHANGELOG

## [1.2.0] - 2024-01-15

### Added
- OAuth2認証によるGoogle/GitHubログイン対応 (#100)
- レポートのPDF/CSVエクスポート機能 (#101)

### Fixed
- 高負荷時のログインタイムアウト問題 (#102)
- ボタン配置のズレを修正 (#103)

### Security
- 脆弱性のある依存パッケージを更新 (#104)

### 比較リンク
[1.2.0]: https://github.com/user/repo/compare/v1.1.0...v1.2.0
```

---

## Example 5: Go/No-Go Decision

### Input
```
User: 明日のリリースは予定通り進めていいですか？
```

### Launch Response

```markdown
## Go/No-Go 判定: v1.2.0

### チェック結果

| 基準 | 状態 | 必須 | ブロッカー |
|------|------|------|-----------|
| 全テスト合格 | ✅ | Yes | - |
| セキュリティスキャン | ✅ | Yes | - |
| ステージング検証 | ✅ | Yes | - |
| ロールバックテスト | ✅ | Yes | - |
| CHANGELOG完了 | ⚠️ | Yes | **未完了** |
| ステークホルダー承認 | ✅ | Yes | - |
| オンコール体制 | ✅ | Yes | - |
| 低リスク時間帯 | ✅ | Preferred | - |

### 判定: **NO-GO** (1ブロッカー)

### ブロッカー詳細
1. **CHANGELOG未完了**
   - セキュリティ修正(#104)の記載漏れ
   - 対応: CHANGELOGにエントリ追加

### 推奨アクション
1. CHANGELOGにセキュリティ修正を追記
2. 再度Go/No-Go確認を実施
3. 問題なければ明日10:00リリース開始

### リスク評価
- 技術リスク: 低
- ビジネスリスク: 低
- ブロッカー解消後: **GO推奨**
```
