# Test Policy

- **SKIP = FAIL** — SKIP は「未完了」。SKIP があるまま「全テスト通過」と報告しない
- 実装完了後は必ずテスト実行。未実行のまま「完了」禁止
- 報告: `PASSED: N / FAILED: N / SKIPPED: N（理由）`

## テスト更新責務（ARIS-559 教訓）

**機能追加・構造変更時、対応するテストを必ず同時に更新する。**

過去事例: HANDOFF-001 / AUTO-001 / 自然言語ルーティング / Keijiエージェント等の
機能追加で `_templates/settings.json` / `install.sh` / `_templates/CLAUDE_PROJECT.md` /
`agents/nexus/SKILL.md` の構造を変更した際、テスト側を更新しなかったため、
構造チェック系テストが累積23件壊れた状態で長期放置された。

### 防止ルール

1. **構造変更とテスト更新は同一コミット**: PR分割不可
2. **テストは SSoT を参照**: ハードコードしたリスト（EXPECTED_AGENTS等）を持たず、
   ディレクトリスキャン or 設定ファイルから自動検出する
3. **CIで必ず実行**: `.github/workflows/drift-check.yml` の `npm test` がPRで失敗したら
   マージ不可
4. **テスト失敗の放置禁止**: 1件でも failing test があれば「全テスト通過」と報告しない
