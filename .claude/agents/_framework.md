# Agent Orchestration Framework — EOS Workshop Edition

## Architecture

Hub-spoke pattern。全通信はオーケストレーター（人間 or Nexus）を経由する。エージェント同士の直接通信は禁止。

```
User Request → Orchestrator
  └─ Sequential: Sherpa → Artisan → Radar → Sentinel
```

---

## Core Rules

1. **Hub-spoke**: 全通信はオーケストレーター経由。直接 Agent-to-Agent 通信禁止
2. **Simplicity first**: 3行の重複コード > 早すぎる抽象化。必要最小限の複雑さ
3. **Secrets never in code**: 秘密情報は環境変数のみ。コード・チャット・ログに含めない（L4 即時停止）
4. **DCP enforced**: 操作は Tier 1-3 で分類し、settings.json で技術的に強制する
5. **File ownership is law**: 並列実行時、1ファイルのオーナーは1エージェントのみ
6. **Fail fast, recover smart**: ガードレール L1-L4 で段階的に対応
7. **Test is mandatory**: テストのない実装は未完成。SKIP = FAIL
8. **日本語出力**: 全ての出力は日本語

---

## Chain Definitions

### 機能実装（標準）
```
Sherpa → Artisan → Radar → Sentinel
```

### セキュリティ重要機能
```
Sherpa → Artisan → Sentinel → Artisan(修正) → Radar
```

### セキュリティ監査のみ
```
Sentinel → (修正が必要なら) Artisan → Radar
```

### バグ修正
```
Artisan → Radar
```

---

## Execution Mode

### AUTORUN（デフォルト）
エージェントは自律的にタスクを実行し、完了時に Handoff を送信する。
判断に迷う場合はオーケストレーター（人間）に確認を求める。

---

## Guardrails

| Level | トリガー | アクション | 解除 |
|-------|---------|-----------|------|
| L1 | lint warning | ログのみ、続行 | 自動 |
| L2 | テスト失敗 <20% | 自動修正（最大3回） | 修正成功で解除 |
| L3 | テスト失敗 >50% | ロールバック + 再計画 | 手動修正後 |
| L4 | セキュリティ違反 | **即時停止** | **解除不可** |

### L4 トリガー一覧
- 秘密情報のハードコード検出
- `.env` / `.secrets/` / `credentials/` への書き込み
- 秘密情報をチャットに貼り付ける行為
- `curl` / `wget` による未承認の外部通信
- 依存パッケージ追加時の `npm audit` 未実行

---

## Double Confirmation Protocol (DCP)

操作を3段階に分類し、安全性を確保する。詳細は `docs/security-guide.md` を参照。

### Tier 1: 絶対禁止（L4 発動）
- 秘密情報をチャット・コード・ログに含める
- `.env` ファイルへの直接書き込み
- ソースコードへの秘密情報ハードコード

### Tier 2: 確認必要（ask）
- `git add` / `git commit`
- `npm install`（新しい依存パッケージ）
- ファイル作成・大量編集

### Tier 3: 通常操作（allow）
- ファイル読み取り・検索
- `git status` / `git diff` / `git log`
- テスト実行（`npm test`、`npm run typecheck`）

---

## Handoff Format

エージェント間の引き継ぎは以下のフォーマットを使用する:

```markdown
## HANDOFF

- Agent: [送信元エージェント名]
- Status: SUCCESS | PARTIAL | BLOCKED
- Summary: [1-3行の作業サマリー]
- Files changed:
  - [ファイルパス]: [変更内容]
- Test results: [pass/fail/skip の数]
- Remaining TODOs:
  - [残タスク]
- Risks:
  - [リスクや懸念事項]
- Next: [次のエージェント名] | DONE
```

---

## Test Policy

- **SKIP = FAIL**: テストの SKIP は「通った」ではなく「未完了」
- SKIP の理由を把握し、解消可能なら解消する
- テスト失敗の原因を調べずにリトライしない
- カバレッジ目標: コア機能 80%、adapter 60%

---

## Git Commit Format

```
<type>: <日本語の説明>
```

type: `feat`, `fix`, `test`, `docs`, `refactor`, `chore`

例:
- `feat: HMAC-SHA256 署名検証を実装`
- `test: 署名検証のユニットテストを追加`
- `fix: タイムスタンプ検証の境界値バグを修正`
