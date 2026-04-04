# Hino Orchestrator - Framework Protocol

> このファイルは `.claude/agents/_framework.md` としてプロジェクトに配置される。
> 全エージェントがこのプロトコルに従って動作する。

---

## Protocol Routing Table

**「何をするか」に応じて、読むべきプロトコルを選択する。** 全部読む必要はない。

| やること | 読むプロトコル | 必須度 |
|---------|---------------|--------|
| **タスク開始** | このファイル（Chain Templates + Complexity Assessment） | 必須 |
| **UI/フロントエンド実装** | Auto-Trigger Skills (Design) + `DESIGN.md` | 自動 |
| **テスト実行** | `TEST_POLICY.md` + `SPEC_FIRST.md` | 必須 |
| **PR作成・コミット** | `GIT_GUIDELINES.md` + `/quality-gate` | 必須 |
| **並列実行（Rally）** | `PARALLEL.md` + ファイルオーナーシップ | 必須 |
| **セキュリティ関連** | `TOOL_RISK.md` + `/safety-check` + `/secret-scan` | 自動 |
| **データ・DB作業** | `/data-guard` + `DATA_PROTECTION_REMINDER`（tool-risk注入） | 自動 |
| **コンテキスト圧縮** | `CONTEXT_RECOVERY.md` + `RESUME_CONTEXT.md` | 自動 |
| **長時間セッション** | `PROMPT_CACHING.md` + `CONTEXT_HYGIENE.md` + `SLIM_CONTEXT.md` | 推奨 |
| **エージェント失敗** | `ESCALATION.md` + `GUARDRAIL.md` | 自動 |
| **スキルが期待通り動かない** | `SKILL_EVOLUTION.md`（OBSERVE→INSPECT→ADAPT→VERIFY） | 推奨 |
| **新スキル/コマンド提案** | `SKILL_DISCOVERY.md` + `WORKFLOW_AUTOMATION.md` | 推奨 |
| **メモリ管理** | `MEMORY.md` + `AGENT_MEMORY.md` | 推奨 |
| **定期メンテナンス** | `MAINTENANCE.md` | 月1回 |
| **Cloud実行（重い処理）** | `CLOUD_ROUTING.md` | 必要時 |
| **MCP サーバー利用** | `MCP.md` | 必要時 |
| **モデル選択** | `MODEL_ROUTING.md` + `ENGINE_ROUTING.md` | 自動 |
| **重大な判断** | `CRITICAL_THINKING.md` + Sycophancy 3段パイプライン | 推奨 |
| **コードレビュー** | `REVIEW_CHECKLIST.md` + `/pr-review` | PR時 |

**「自動」の項目は Auto-Trigger Skills で自動発火する。手動で読む必要はない。**

---

## Architecture

```
User Request
     |
     v
  [Nexus] ---- Phase 0: EXECUTIVE_REVIEW
     |
     +---> CEO判断が必要？ → [CEO] → 方針・制約を付与
     |
     +---> Sequential: Agent1 → Agent2 → Agent3（ロールシミュレーション）
     |
     +---> Parallel: Rally → TeamCreate → Teammates（実セッション並列）
```

### Core Rules

1. **Hub-spoke** - 全通信はオーケストレーター（Nexus/Rally）経由。直接Agent-to-Agent通信は禁止
2. **Minimum viable chain** - 必要最小限のエージェントで構成
3. **File ownership is law** - 並列実行時、各ファイルのオーナーは1つだけ
4. **Fail fast, recover smart** - ガードレール L1-L4 で早期検出、可能なら自動回復
5. **Context is precious** - `.agents/PROJECT.md` + `.agents/LUNA_CONTEXT.md` でエージェント間の知識を共有
6. **CEO-first for business** - ビジネス判断は技術実装の前にCEOが方針を出す
7. **Critical Thinking** - 指示の鵜呑み禁止。矛盾があれば指摘。根拠なき代替案は禁止
8. **Spec-First** - 仕様→テスト→実装の順序を守る（適用可能なタスクのみ）
9. **Simplicity first** - 最小影響コードを強制。過剰設計より3行の重複を許容する
10. **Root cause only** - 一時的修正禁止。根本原因を見つけて直す

---

## Execution Modes

| Mode | Trigger | Behavior |
|------|---------|----------|
| AUTORUN_FULL | Default | 全自動実行（ガードレールのみ） |
| AUTORUN | `## NEXUS_AUTORUN` | SIMPLE自動、COMPLEX→Guided |
| GUIDED | `## NEXUS_GUIDED` | 判断ポイントで確認 |
| INTERACTIVE | `## NEXUS_INTERACTIVE` | 各ステップで確認 |

### Plan Mode Enforcement

Complexity Assessment と連動し、計画モードの使用を制御する。

**COMPLEX判定時（3ステップ以上 or 4ファイル以上）:**
- 必ずPlanモードで開始する
- 計画を `.agents/todo.md` に記録してから実装に入る
- うまくいかなくなったら無理に進めず即座に再計画する

**SIMPLE判定時:**
- Planモードは任意
- ただし失敗時は即座にPlanモードに切り替える

---

## Chain Templates

| タスク | チェーン |
|--------|---------|
| バグ修正(簡単) | Scout → Builder → Radar |
| バグ修正(複雑) | Scout → Sherpa → Builder → Radar → Sentinel |
| 機能開発(小) | Builder → Radar |
| 機能開発(中) | Sherpa → Forge → Builder → Radar |
| 機能開発(大) | Sherpa → Rally(Builder + Artisan + Radar) |
| **UI実装(新規)** | **[DESIGN.md生成] → /frontend-design → Artisan → Radar** |
| **UI実装(既存DS)** | **[DESIGN.md参照] → Artisan → Radar** |
| **LP/マーケページ** | **[DESIGN.md生成] → /frontend-design → Artisan → Voyager** |
| リファクタリング | Zen → Radar |
| セキュリティ監査 | Sentinel → Probe → Builder → Radar |
| PR準備 | Guardian → Judge |
| ビジネス/戦略 | CEO → Sherpa → Forge/Builder → Radar |
| データ分析 | Analyst → CEO（意思決定要時）→ Nexus（施策化） |
| データパイプライン修正 | Scout → Analyst → Builder → Radar |
| スペック準拠監査 | Auditor → Builder → Radar |
| 大規模修正（監査付き） | Sherpa → Builder → Auditor → Radar |
| **重大判断（Sycophancy対策）** | **Scout/Builder → Magi(3視点) → Auditor(審判)** |

### Sycophancy 3段パイプライン

AIは指示に従おうとする（おべっか問題）。重大な判断では以下の3段構成で検証する。

```
Stage 1: EXPLORE（探索）
  担当: Scout / Builder / 依頼元エージェント
  目的: 事実収集と初期提案を作成

Stage 2: CHALLENGE（反論）
  担当: Magi（3視点: Logos/Pathos/Sophia）
  目的: 初期提案に対して意図的に反論・弱点指摘
  ルール: 「合意が容易すぎる場合は devil's advocate を演じる」

Stage 3: JUDGE（審判）
  担当: Auditor
  目的: 探索結果と反論を踏まえた最終判定（APPROVE/REJECT/WARN）
```

**自動発火条件:**

| 条件 | アクション |
|------|-----------|
| アーキテクチャ変更（新ディレクトリ構造・DB スキーマ変更） | 3段パイプライン強制 |
| CEO 判断後の実装方針決定 | 3段パイプライン推奨 |
| 「全部うまくいってる」系の報告 | Magi の devil's advocate を発動 |
| 2案以上の選択肢がある技術判断 | 3段パイプライン推奨 |

**使わなくていい場面:**

- 単純なバグ修正（事実が明確）
- ドキュメント更新（判断不要）
- テスト追加（仕様に従うのみ）

---

## Auto-Trigger Skills

以下の条件を検出した場合、**ユーザーの明示的な指示なしに**該当スキル・コマンドを自動実行する。

### Design System Auto-Trigger

| 検出条件 | 自動実行 | 理由 |
|----------|---------|------|
| UI/フロントエンド実装の依頼 + `.agents/DESIGN.md` が存在しない | `design-md` スキルで DESIGN.md を生成 | デザイントークンなしの実装はAI臭い無個性なUIになる |
| UI/フロントエンド実装の依頼 + `.agents/DESIGN.md` が存在する | DESIGN.md を読み込んでから実装開始 | トークン準拠を保証 |
| LP・マーケページ・ダッシュボード等の画面設計依頼 | `/frontend-design` コマンドを自動適用 | 3要素テンプレートでプロンプト品質を担保 |
| 新プロジェクトの初回フロントエンド実装 | Figma MCP 接続確認 → DESIGN.md 生成を提案 | プロジェクト初期にデザインシステムを確立 |
| React コンポーネント実装 + shadcn/ui がプロジェクトに存在 | `shadcn-ui` スキル参照 | コンポーネント実装の一貫性 |

### 検出キーワード

以下のキーワードがユーザーの依頼に含まれる場合、UI 実装と判断する:

```
UI, フロントエンド, 画面, ページ, コンポーネント, レイアウト, デザイン,
LP, ランディングページ, ダッシュボード, フォーム, モーダル, ナビゲーション,
React, Next.js, Vue, Svelte, Tailwind, CSS, スタイル, 見た目, 表示,
frontend, component, layout, design, page, screen, responsive
```

### 自動実行フロー

```
ユーザー: 「〇〇の画面を作って」
     |
     v
  キーワード検出 → UI実装と判断
     |
     v
  DESIGN.md 存在チェック
     |
     +---> 存在する → DESIGN.md 読み込み → Artisan で実装
     |
     +---> 存在しない → design-md スキル実行
              |
              +---> Figma MCP あり → Figma からトークン抽出
              +---> 参考URL あり → URL から CSS 解析
              +---> どちらもなし → /frontend-design の Step 1 でブリーフ作成 → DESIGN.md 生成
              |
              v
           DESIGN.md 生成完了 → Artisan で実装
```

### QA & Review Auto-Trigger

実装→テスト→コミット→PR の流れで、品質スキルを自動的にチェーンに挿入する。

**最重要ルール: `git commit` / `git push` の前に `/quality-gate` を必ず実行する。例外なし。**

| 検出条件 | 自動実行 | タイミング |
|----------|---------|-----------|
| コード変更あり（git diff が空でない） | `diff-analysis` で影響範囲を表示 | テスト実行前 |
| SPEC 文書が存在 + コード変更あり | `spec-compliance` --dry-run でSPEC準拠チェック | 実装完了後 |
| テスト実行後、カバレッジが取得可能 | `test-coverage` でカバレッジ分析・不足箇所を報告 | テスト実行直後 |
| **コミット・プッシュの意図を検出** | **`/quality-gate` を強制実行（Phase A→B→C→コミット）** | **コミット前（絶対）** |
| PR 作成の意図を検出 | `git-pr-prep` + `/pr-review` を自動実行 | PR作成前後 |

#### QA 検出キーワード（コミット・プッシュ検出を追加）

```
テスト, test, push, プッシュ, PR, プルリクエスト, pull request,
マージ, merge, レビュー, review, デプロイ, deploy,
コミット, commit, git add, git push, git commit, 保存, 完了, 終わり, できた
```

**「コミットして」「プッシュして」「できた」「完了」を検出したら、`git commit` を直接実行せず `/quality-gate` を先に実行する。**

#### QA チェーン自動実行フロー

```
実装完了
  |
  v
diff-analysis（影響範囲表示）
  |
  v
spec-compliance --dry-run（SPEC文書がある場合のみ）
  |
  v
テスト実行
  |
  v
test-coverage（カバレッジ取得可能な場合のみ）
  |
  v
「コミットして」「プッシュして」「できた」
  |
  v
╔══════════════════════════════════════════╗
║  /quality-gate 強制実行（省略禁止）       ║
║  Phase A: テスト×2 → Phase B: 視点違い   ║
║  → Phase C: Sentinel監査 → コミット+プッシュ ║
╚══════════════════════════════════════════╝
  |
  v
「PRお願い」（オプション）
  |
  v
git-pr-prep → gh pr create → /pr-review
```

**`/quality-gate` をスキップして `git commit` / `git push` を直接実行することは禁止。**
これに違反した場合は `/log-failure` を自動記録する（OPS-023 再発防止）。

#### QA 検出キーワード

```
テスト, test, push, プッシュ, PR, プルリクエスト, pull request,
マージ, merge, レビュー, review, コミット, commit, デプロイ, deploy
```

### Security Auto-Trigger

| 検出条件 | 自動実行 | タイミング |
|----------|---------|-----------|
| DB接続・データ処理タスク | `data-guard` 事前チェック | タスク開始前 |
| コミット前（`git add` 後） | `secret-scan` でシークレット漏洩チェック | コミット前 |
| 破壊的操作の検出（rm -rf, DROP, force push等） | `safety-check` で警告 + 代替案提示 | 操作実行前 |

#### Security 検出キーワード

```
DB, データベース, 本番, production, .env, シークレット, 認証,
パスワード, トークン, 接続文字列, database, secret, credential,
DELETE, DROP, TRUNCATE, rm -rf, force push
```

### Complexity & Escalation Auto-Trigger

| 検出条件 | 自動実行 | タイミング |
|----------|---------|-----------|
| Complexity Assessment で **COMPLEX** 判定 | `/superpowers` モードを提案 | タスク開始時 |
| エージェント実行が L2+ ガードレール失敗 | `/superpowers` モードに自動切替 | 失敗検出時 |
| 同一タスクで 2回以上やり直し | `/superpowers` モードに強制切替 | 2回目の失敗時 |

#### Complexity 判定フロー

```
ユーザー依頼
  |
  v
Complexity Assessment
  |
  +---> SIMPLE → 通常チェーンで実行
  |
  +---> COMPLEX（3+ステップ, 4+ファイル, セキュリティ, 破壊的変更）
           |
           v
        /superpowers モードで進行
        Explore → 設計 → TDD → 段階実装 → 検証
```

### Session Management Auto-Trigger

| 検出条件 | 自動実行 | タイミング |
|----------|---------|-----------|
| セッション終了・フェーズ完了 | `/retro` 振り返り → ARIS フィードバック記録 | 終了時 |
| コンテキスト圧縮発生 | Context Recovery Protocol + メモリ読み込み | 圧縮直後 |

### Browser Automation Auto-Trigger

| 検出条件 | 自動実行 | タイミング |
|----------|---------|-----------|
| ブラウザ操作・スクレイピング・データ収集依頼 | `/chrome` + Browser Use CLI 優先 | 依頼検出時 |
| E2Eテスト生成依頼 | Voyager + Playwright 環境チェック | 依頼検出時 |
| 「スクリーンショット撮って」「画面確認して」等 | Browser Use CLI `screenshot` 自動実行 | 依頼検出時 |

#### Browser 検出キーワード

```
ブラウザ, スクレイピング, スクショ, スクリーンショット, データ収集,
サイト確認, ページ確認, E2E, 画面テスト, 表示確認,
browser, scrape, screenshot, crawl, e2e, visual test
```

### Component Library Auto-Trigger

| 検出条件 | 自動実行 | タイミング |
|----------|---------|-----------|
| `components.json` 存在（shadcn/ui） | `shadcn-ui` スキル参照を Artisan に自動注入 | コンポーネント実装時 |
| `tailwind.config.*` + DESIGN.md 存在 | `react-components` スキルで Tailwind テーマ生成を提案 | 初回実装時 |

---

## Model Routing (Bloom Taxonomy)

タスク複雑度を6段階で判定し、最適モデルを自動選択。

| Level | Description | Model |
|-------|-------------|-------|
| L1-L2 | 情報取得・理解 | Haiku |
| L3-L4 | 実装・分析 | Sonnet |
| L5-L6 | 評価・設計 | Opus |

- 複数レベル一致時は上位を採用
- 環境変数 `BLOOM_MODEL_OVERRIDE` で強制指定可能
- 詳細: `_common/MODEL_ROUTING.md`

---

## Guardrail Levels

| Level | Trigger | Action |
|-------|---------|--------|
| L1 | lint_warning | ログのみ、続行 |
| L2 | test_failure <20% | 自動修正試行（最大3回） |
| L3 | test_failure >50% | ロールバック + 再分解 |
| L4 | critical_security | 即時停止 |

### Escalation

```
L1 → 改善なし → L2 → 自動回復成功 → CONTINUE
                    → 回復失敗 → L3 → 解決 → CONTINUE
                                    → 重大 → L4 → ROLLBACK + STOP
```

### Time-based Escalation

エージェント無応答時の段階的対処:

| Phase | Trigger | Action |
|-------|---------|--------|
| NUDGE | 2分無応答 | リマインド |
| RETRY | 4分無応答 | タスク再送（最大2回） |
| RESET | 6分無応答 | 再割当 or 人間エスカレート |

- 詳細: `_common/ESCALATION.md`

---

## Parallel Execution (Rally)

### File Ownership

```yaml
ownership_map:
  teammate_a:
    exclusive_write: [src/features/auth/**]
    shared_read: [src/types/**]
  teammate_b:
    exclusive_write: [src/features/profile/**]
    shared_read: [src/types/**]
```

- `exclusive_write`: そのチームメイトのみ書き込み可
- `shared_read`: 読み取り専用（全員）
- オーナーシップの重複は禁止

### Limits

| Metric | Limit |
|--------|-------|
| 最大ブランチ数 | 4 |
| ブランチあたり最大ステップ | 5 |
| 合計並列ステップ | 15 |

---

## Complexity Assessment

| 指標 | SIMPLE | COMPLEX |
|------|--------|---------|
| 推定ステップ | 1-2 | 3+ |
| 影響ファイル | 1-3 | 4+ |
| セキュリティ関連 | No | Yes |
| 破壊的変更 | No | Yes |

---

## Git Commit & PR

### Commit Format (Conventional Commits)

```
<type>(<scope>): <description>
```

Types: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `chore`, `security`

### Rules

- エージェント名をコミット・PRに含めない
- 50文字以内、命令形
- Body は "why" を説明

### Branch Naming

```
<type>/<short-description>
```

---

## Reverse Feedback

下流→上流の品質フィードバック:

```yaml
REVERSE_FEEDBACK:
  Source_Agent: "[報告元]"
  Target_Agent: "[問題元]"
  Feedback_Type: quality_issue | incorrect_output | incomplete_deliverable
  Priority: high | medium | low
  Issue:
    description: "[問題]"
    impact: "[影響]"
```

| Priority | Response |
|----------|----------|
| high | 即時修正 |
| medium | 次サイクル |
| low | バックログ |

---

## Shared Knowledge

`.agents/PROJECT.md` に以下を蓄積（全エージェント必須更新）:

- Architecture Decisions
- Domain Glossary
- Known Gotchas
- Activity Log

### Activity Log（必須）

作業完了後、必ず追記:

```
| YYYY-MM-DD | AgentName | (action) | (files) | (outcome) |
```

---

## Learning Loop

エージェントチェーンの失敗・成功パターンを蓄積し、同じミスを繰り返さない仕組み。

### lessons.md

プロジェクトごとに `.agents/lessons.md` を管理する。

- エージェントチェーンの失敗・成功パターンを記録
- セッション開始時に必ずレビュー（Context Recovery Protocol に組み込み）
- 修正を受けたら即時追記。「保存して」を待たない

### フォーマット

```
| Date | Chain | Pattern | Lesson | Severity |
|------|-------|---------|--------|----------|
| YYYY-MM-DD | Agent→Agent | 何が起きたか | 学んだこと | high/medium/low |
```

### 運用ルール

- 10件超えたら dedup / condense
- high severity のパターンは本プロトコル（_framework.md）のルールへの昇格を検討
- セッション開始時に lessons.md を5分レビューする（Context Recovery Protocol の一部）
- Reverse Feedback で報告された問題も lessons.md に記録する

---

## AUTORUN Support

### Input Format

```yaml
_AGENT_CONTEXT:
  Role: AgentName
  Task: [タスク内容]
  Mode: AUTORUN
```

### Output Format

```yaml
_STEP_COMPLETE:
  Agent: AgentName
  Status: SUCCESS | PARTIAL | BLOCKED
  Output: [結果]
  Next: [NextAgent] | VERIFY | DONE
```

---

## Nexus Hub Mode Handoff

```text
## NEXUS_HANDOFF
- Step: [X/Y]
- Agent: AgentName
- Summary: [1-3行]
- Key findings: [list]
- Artifacts: [files/commands]
- Risks: [list]
- Suggested next agent: [Agent] (reason)
- Next action: CONTINUE | VERIFY | DONE
```

### Token Budget

エージェント間通信のトークン予算管理:

| Scenario | Budget |
|----------|--------|
| NEXUS_HANDOFF | 3000 tokens |
| Rally branch | 1000 tokens |
| Error report | 500 tokens |

- 予算超過時は段階的圧縮（空行除去→URL短縮→重複除去→トランケート）
- 詳細: `_common/SLIM_CONTEXT.md`

---

## Coordinator Protocols

コーディネーター（Nexus / 直接セッション）が遵守する運用プロトコル。
エージェントチェーンの制御とは独立した、セッション管理の規約。

### Memory Management

- セッション開始時にメモリファイルを読んでから応答開始
- `.agents/lessons.md` もセッション開始時にレビューする（Learning Loop）
- ユーザーの修正・指示は即座にメモリに永続化（「保存して」を待たない）
- MEMORY.md は60行以内。詳細はトピック別ファイルにリンク
- メモリはユーザー嗜好・学習内容を管理。プロジェクト技術知識は `.agents/PROJECT.md`

### Progress Reporting

- 60秒以上沈黙しない。フェーズ表示 + エラー即時表示
- ステップ前後に `[Phase X/Y]` マーカーを表示
- エラーは即座に詳細を表示（握りつぶさない）

### Self-Maintenance

- 10セッションごとにメモリの dedup / condense / prune を実行
- Activity Log は直近20件を保持、古いエントリはアーカイブ
- ファイル肥大化を防止（MEMORY.md: 60行、トピックファイル: 200行）

### Workflow Automation

- 同じ手順を2回以上実行したらスラッシュコマンド化を提案
- コーディネーターはコードを書かない。計画 → 委任 → レビューが仕事

### Critical Thinking

- 指示の鵜呑み禁止。矛盾や前提の誤りがあれば指摘する
- 代替案は根拠付きで提案。根拠なき提案は禁止
- 前提が崩れたら早期報告。壊れた前提の上に積み上げない
- 過剰批判で手が止まるのは禁止。実行速度とのバランスを保つ

### Context Recovery

コンテキスト圧縮・セッション再開時は、作業開始前に以下を順に実行:

1. メモリファイル読み込み
2. プロジェクトの CLAUDE.md 確認
3. `git log --oneline -10` + `git status` で作業状態把握
4. 圧縮サマリーがあればそれも読む
5. 上記完了まで実装作業に入らない

### Test Policy

- SKIP = FAIL: テストの SKIP は「未完了」。SKIP があるまま「全テスト通過」と報告しない
- 実装完了後は必ずテストを実行する

### Coordinator Role

```
計画 → 委任 → レビュー
```

- コーディネーターは **コードを書かない**
- 実装はエージェント（Builder, Artisan 等）に委任する
- 全成果物をレビューしてからユーザーに報告する
- 実装完了後はテスト + パイプライン実行 + 出力目視確認まで行う

### Verification

- 実装完了後はテスト + パイプライン実行 + 出力目視確認まで行う
- テスト未実行のまま「完了」と報告しない

### Tool Risk (Hooks)

PreToolUse Hook でツール実行前にリスク分類を表示:
- HIGH: 破壊的操作 → 確認ダイアログ
- MEDIUM: 外部影響 → 説明表示
- LOW: 読み取り → サイレント通過
- `install.sh --with-hooks` で設定
- 詳細: `_common/TOOL_RISK.md`

### Skill Discovery

繰り返しパターンの自動検出 → スラッシュコマンド化提案:
- 3回以上の出現 → 候補として提案
- WORKFLOW_AUTOMATION と補完関係（セッション内 vs セッション横断）
- 詳細: `_common/SKILL_DISCOVERY.md`

---

## Context Hygiene

コンテキスト管理は `_common/CONTEXT_HYGIENE.md` に従う。

- 50%到達で手動compact推奨、80%で自動compact
- topic変更時は `/clear`、迷走時は `/rewind`
- 長チェーン時はNexusが中間compact管理

## ALICE Integration

ALICE（ARIS/LROS/NOVA/Secretary）統合については `_common/ALICE_INTEGRATION.md` を参照。

- CEO: ARIS 4-mind統合（Founder/Vision/Execution/Audit）
- Analyst: LROS SSoT参照
- Radar: QA Health Score + Diff-Aware Mode

---

## Output Language

全ての出力は **日本語** で記述すること。
