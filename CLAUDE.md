# Event Orchestration Service (EOS) - 中級ワークショップ

## 概要

外部 Webhook を受信し、ルールベースで振り分け・処理・Slack 通知を行うオーケストレーションサービス。

**初級との違い:** 初級ワークショップでは「チームに任せる」体験（静的サイト構築）を学んだ。中級では **セキュリティを意識したバックエンド開発** と **エージェントチームの設計・運用** を学ぶ。

**所要時間:** 120-180分

---

## 技術スタック

- Runtime: Node.js + TypeScript (strict mode)
- HTTP: Hono
- テスト: Vitest
- ルール定義: YAML

---

## エージェントチーム（4体）

| Agent | 役割 | 主な担当 Step |
|-------|------|-------------|
| Sherpa | タスク分解・実装計画 | Step 2-8（計画） |
| Artisan | TypeScript バックエンド実装 | Step 3-6（実装） |
| Radar | テスト作成・品質保証 | Step 3-7（検証） |
| Sentinel | セキュリティ監査 | Step 7（監査） |

### Chain（実行順序）
```
Sherpa → Artisan → Radar → Sentinel
```

各エージェントの詳細は `.claude/agents/` を参照。
チーム運用の全体ルールは `.claude/agents/_framework.md` を参照。

---

## セキュリティルール（DCP: Double Confirmation Protocol）

**重要:** AI 支援開発では、セキュリティが最も重要な非機能要件。
詳細は `docs/security-guide.md` を参照。

### 絶対禁止（Tier 1 — 違反は L4 即時停止）

| ❌ 禁止事項 | 理由 | ✅ 安全な代替手段 |
|------------|------|-----------------|
| チャットに秘密情報を貼り付ける | 対話ログがクラウドに送信される | `.env` ファイルに直接手入力 |
| `.env` に AI で書き込む | 秘密情報が AI の記録に残る | `.env.example` をコピーし手動設定 |
| コードに秘密情報をハードコード | Git 履歴に永続的に残る | `process.env.KEY_NAME` で読み込む |

### 確認必要（Tier 2）
- `git add` / `git commit`（意図しないファイルの混入防止）
- `npm install`（悪意あるパッケージの防止）
- 大量のファイル編集

### 通常操作（Tier 3）
- ファイル読み取り・検索
- `git status` / `git diff` / `git log`
- `npm test` / `npm run typecheck`

### 技術的な強制
`.claude/settings.json` で allow / ask / deny が設定されている。Tier 1 に該当する操作は deny で技術的にブロックされる。

---

## 秘密情報の取り扱い

```
キーの「名前」（WEBHOOK_SECRET 等）  → チャットに書いて OK
キーの「値」（実際の文字列）          → 絶対にチャットに書かない
```

### パターン
1. `.env.example`（テンプレート、値は空欄）を用意
2. `cp .env.example .env` でコピー
3. `.env` を**手動で**編集し、秘密情報を入力
4. コード内では `process.env.WEBHOOK_SECRET` で読み込む

---

## プロジェクト構成

```
src/
├── index.ts              # Hono サーバーエントリポイント     (Step 3)
├── types/
│   └── event.ts          # 型定義                           (提供済み)
├── adapters/
│   ├── webhook-provider.ts  # Webhook パース               (Step 3)
│   └── slack-notifier.ts    # Slack 通知                   (Step 3)
├── orchestrator/
│   └── router.ts         # ルーティングロジック              (Step 4)
├── security/
│   ├── signature.ts      # HMAC-SHA256 署名検証            (Step 3)
│   └── audit-log.ts      # 監査ログ + PII マスキング       (Step 7)
├── reliability/
│   ├── idempotency.ts    # 冪等性保証                      (Step 5)
│   ├── retry.ts          # 指数バックオフリトライ           (Step 5)
│   └── dlq.ts            # Dead Letter Queue               (Step 5)
├── observability/
│   ├── logger.ts         # 構造化 JSON ログ                (Step 6)
│   └── metrics.ts        # メトリクス                      (Step 6)
└── __tests__/
    ├── signature.test.ts    # 署名検証テスト               (Step 3)
    ├── router.test.ts       # ルーティングテスト           (Step 4)
    └── idempotency.test.ts  # 冪等性テスト                 (Step 5)

docs/
├── architecture.md       # アーキテクチャ設計書
├── security-guide.md     # セキュリティガイド（DCP 詳細）
└── github-basics.md      # Git/GitHub 入門ガイド

rules/
└── default.yml           # イベントルーティングルール

templates/
└── requirements.md       # 要求定義書テンプレート
```

---

## 非機能要件

### セキュリティ
- HMAC-SHA256 + `timingSafeEqual` による署名検証
- タイムスタンプ検証（リプレイ攻撃防止、デフォルト300秒）
- PII マスキング（メール・電話番号・名前をログに出さない）
- 監査ログ（セキュリティ操作の追跡）
- 入力検証（外部データを信頼しない）

### 信頼性
- `event_id` ベースの冪等性保証（重複処理防止）
- 指数バックオフリトライ（最大3回、baseDelay 1000ms, maxDelay 30000ms）
- Dead Letter Queue（失敗イベントの隔離・後処理）

### 観測性
- 全ログは JSON 構造化形式（timestamp, level, message, context）
- メトリクス: success/failure count, total duration, average latency
- 失敗率がN%超でアラート

---

## ワークショップ手順

### Step 0: 環境セットアップ
1. リポジトリをクローン
2. `npm install` で依存パッケージをインストール
3. `cp .env.example .env` → `.env` に秘密情報を**手動で**入力
4. `npm run dev` でサーバー起動確認（`curl localhost:3000/health`）
5. **必読ドキュメント:**
   - `docs/security-guide.md` — セキュリティルールの理解
   - `docs/github-basics.md` — Git 操作の基礎
   - `docs/architecture.md` — システム構成の全体像

### Step 1: 要求定義書の記入
- `templates/requirements.md` を読み、EOS の目的・スコープを理解
- 参加者が独自のユースケースを1つ以上追加
- 非機能要件（セキュリティ・信頼性・観測性）を確認

### Step 2: エージェント & セキュリティルール理解
- `.claude/agents/_framework.md` を読み、チーム構成とルールを理解
- 各エージェント定義（`sherpa.md`, `artisan.md`, `radar.md`, `sentinel.md`）を確認
- `.claude/settings.json` の allow / ask / deny を確認
- **DCP の3段階**（Tier 1-3）を理解する

### Step 3: セキュリティ基盤実装
Sherpa で計画 → Artisan で実装 → Radar でテスト

実装対象:
- `src/security/signature.ts` — HMAC-SHA256 署名検証 + タイムスタンプ検証
- `src/adapters/webhook-provider.ts` — Webhook リクエストのパース
- `src/adapters/slack-notifier.ts` — Slack 通知
- `src/index.ts` — POST /webhook エンドポイント
- `src/__tests__/signature.test.ts` — 署名検証のテスト

### Step 4: ルーティング & ビジネスロジック
- `src/orchestrator/router.ts` — `rules/default.yml` に基づくイベント振り分け
- `src/__tests__/router.test.ts` — ルーティングのテスト
- 最低2つのルート（notification + alert）を実装

### Step 5: 信頼性パターン
- `src/reliability/idempotency.ts` — event_id ベースの重複検出
- `src/reliability/retry.ts` — 指数バックオフリトライ
- `src/reliability/dlq.ts` — Dead Letter Queue
- `src/__tests__/idempotency.test.ts` — 冪等性のテスト

### Step 6: 観測性
- `src/observability/logger.ts` — 構造化 JSON ログ
- `src/observability/metrics.ts` — success/failure メトリクス

### Step 7: セキュリティ監査 + 全テスト
- **Sentinel** によるセキュリティ監査を実行
- `npm run audit`（全テスト + 型チェック）を実行
- 監査レポートで HIGH/MEDIUM があれば修正

### Step 8: 最終確認 & デモ
- `npm run dev` でサーバー起動
- `curl` で Webhook リクエストを送信し、エンドツーエンドの動作を確認
- Slack 通知が届くことを確認（SLACK_WEBHOOK_URL 設定済みの場合）
- 監査ログ・メトリクスを確認

---

## カスタマイズ

このファイルを編集して、プロジェクトの方針を変更できます:
- エージェントの振る舞いを調整
- 非機能要件の閾値を変更
- 新しいルールや Provider の方針を追加
- セキュリティルールの強化

<!-- 参加者がここに独自の方針を追加 -->

---

## ルール

- Hub-spoke: 全通信はオーケストレーター経由
- テストなしのコードは未完成。SKIP = FAIL
- Secrets をコード・チャット・ログに含めない（L4 即時停止）
- DCP に従い、操作のリスクを常に意識する
- 日本語で出力

## Agent Team Framework

This project uses [Agent Orchestrator](https://github.com/luna-matching/agent-orchestrator).
Agent definitions are in `.claude/agents/`. Framework protocol is in `.claude/agents/_framework.md`.

### Key Rules
- Hub-spoke pattern: all communication through orchestrator (Nexus/Rally)
- CEO handles business decisions before technical execution
- File ownership is law in parallel execution
- Guardrails L1-L4 for safe autonomous execution
- All outputs in Japanese
- Conventional Commits, no agent names in commits/PRs

### Business Context
- `.agents/LUNA_CONTEXT.md` - Business context for CEO decisions
- `.agents/PROJECT.md` - Shared knowledge across agents

## Agent Team Framework

This project uses [Hino Orchestrator](https://github.com/hinominant/hino-orchestrator).
Agent definitions are in `.claude/agents/`. Framework protocol is in `.claude/agents/_framework.md`.

### Key Rules
- Hub-spoke pattern: all communication through orchestrator (Nexus/Rally)
- CEO handles business decisions before technical execution
- File ownership is law in parallel execution
- Guardrails L1-L4 for safe autonomous execution
- All outputs in Japanese
- Conventional Commits, no agent names in commits/PRs

### Business Context
- `.agents/LUNA_CONTEXT.md` - Business context for CEO decisions
- `.agents/PROJECT.md` - Shared knowledge across agents
