# DESIGN_HARNESS_METHODOLOGY — Design Harness の考え方

> 配置: `_common/DESIGN_HARNESS_METHODOLOGY.md`
> 起案: 2026-05-10 / 起案元: Initiative ARIS-1300 (Design Harness 共通基盤化)
> 抽象化元: AI-CC-Workshop Initiative ARIS-1183 / `docs/design/ARIS-1100-design-harness-spec.md`
> 対象読者: 新規プロジェクトのアーキテクト / デザイナー / 設計責任者

---

## 0. 何のためのドキュメントか

### 0.1 役割
- 新規プロジェクトのアーキテクトが Design Harness を導入する**前に最初に読む**ドキュメント
- AI-CC-Workshop の Initiative ARIS-1183 (実装完了) を抽象化したメソドロジー
- 「なぜ Design Harness か」「4 層構造の意味」「導入手順」「失敗パターン辞書連携」をまとめる

### 0.2 立ち位置
- 本ドキュメントは **方法論 (Why / 4 層モデル)** を扱う
- 実装テンプレートは `_templates/DESIGN_HARNESS.md` (機械可読 SSoT)
- Slide kind / Visual primitives は `_common/SLIDE_KIND_CATALOG.md`
- 検証ジェネレータは `.claude/skills/design-harness-vitest.md` / `.claude/skills/design-harness-playwright.md`

### 0.3 読み終えると分かること
1. なぜハーネスが必要か (AI 単体の限界)
2. 4 層 (制約 / コンテキスト / 検証 / フィードバック) それぞれの責務
3. 新規プロジェクトに導入する最短経路
4. 既存プロジェクトにオプトインで導入する手順
5. 失敗パターン辞書と Design Harness の連動方法

---

## 1. なぜ Design Harness か

### 1.1 問題意識
- **AI 単体は速いが「面の精度」が課題**: 1 画面 / 1 コンポーネント単位ではエージェントは高速かつ高品質で生成できる
- しかし**「面」(プロダクト全体)** で見ると、トーン・密度・kind 多様性・視覚インパクトが揃わない
- 「点」(単独画面) の生成 ≠ 「面」(プロダクト全体) の整合
- レビューが人間の感性頼みになり、属人化・再現性なしに陥る

### 1.2 ハーネスの役割
- ハーネス = 馬具・装具
- エージェントの「力」を方向付けるための制約と検証の仕組み
- 単発のスタイルガイドではなく、**機械可読 SSoT + 検証 + フィードバック**のループ
- AI が外した箇所を見ながら**ハーネスを育てる**前提で設計する (完璧待ちにしない)

### 1.3 業界トレンド (要旨)
- OpenAI: Harness Engineering を提唱、評価・検証パイプラインの整備に投資
- Anthropic: Harness Design for long-running development、長時間自律実行の安全装置
- Multi-agent harness パターン: planner / generator / evaluator を分離し、生成と評価を別エージェントで担う

> 上記はトレンド要約。Keiji 共有記事の原文転載は禁止 (要約のみ)。

### 1.4 デザインに固有の難しさ
- コードと違いコンパイラが構造ミスを検出してくれない
- レビューが感性依存になりがち
- 「kind 多様性」「数字インパクト」「対比表現」など**意図が外にあるルール**が多い
- → 機械可読 SSoT に落とし、ルール検証 + スクリーンショット検証で物理ブロックする

---

## 2. 4 層構造

Design Harness は次の 4 層で構成する。各層は独立した責務を持ち、上位層が下位層を補完する。

```
┌──────────────────────────────────────────┐
│ Layer 4: Feedback (失敗/成功の循環)      │
├──────────────────────────────────────────┤
│ Layer 3: Verification (検証 / 物理ブロック) │
├──────────────────────────────────────────┤
│ Layer 2: Context (コンテキスト / 意図)    │
├──────────────────────────────────────────┤
│ Layer 1: Constraint (制約 / SSoT)         │
└──────────────────────────────────────────┘
```

### 2.1 Layer 1: 制約 (Constraint)

**配置**: `_templates/DESIGN_HARNESS.md` (汎用テンプレ) → 各プロジェクトの `DESIGN_HARNESS.md` (SSoT)

**機械可読の SSoT**。エージェントが新規 UI を作る前に必ず参照する。

| 含めるもの | 例 |
|---|---|
| Voice & Tone | 受講者向け / 業務向け / マーケ向け |
| Color Tokens | `--primary`, `--accent`, ロール別カラー等 |
| Typography Tokens | 数字専用 / 結論専用 / タイトル / 本文 |
| Slide Kind Catalog | title / chat / compare / points / highlight / stat / vs / timeline / bigConclusion 等 |
| Visual primitives | BigNumber / ComparisonGrid / TimelinePill / AccentBox 等 |
| 設計原則 | 1 画面 1 メッセージ / 5-7 枚制約 / kind 多様性 ≥4 |
| NG パターン / 禁止文字列 | 数字を `points` で出さない / 禁止文字列の正規表現 |
| アクセシビリティ要件 | WCAG 2.1 AA / コントラスト比 / `prefers-reduced-motion` |
| 学習者・利用者ペルソナ | 主軸 3 名 + サブ 3 名等 |
| 検証ルール一覧 | Vitest / Playwright / Agent / Human の 4 段階 |

**特徴**:
- Markdown だが**機械可読**を意識する (見出し番号、表、明示的な kind 名)
- プロジェクト固有箇所 (Voice / Color / Persona) はテンプレでは `<TBD>` プレースホルダ
- 汎用部分 (Slide kind / NG パターン / 検証ルール) はテンプレに具体記述

### 2.2 Layer 2: コンテキスト (Context)

**配置**: 本ドキュメント (`_common/DESIGN_HARNESS_METHODOLOGY.md`) + プロジェクト固有の context ファイル

「**なぜ**そのルールがあるのか」「どんなペルソナのどんな感情に刺さるのか」をエージェント可読な形でまとめる。

| 含めるもの | 役割 |
|---|---|
| プロダクトのオブジェクティブ | プロダクト全体の OGSM (Why) |
| 学習設計原則 / 業務設計原則 | 例: Make It Stick / 5 分制約 / 早期成功体験 |
| ペルソナ詳細 | 主軸 / サブ、共通制約 (デバイス・通勤時間等) |
| 既存「良いサンプル」の参照 path | エージェントがレファレンスとして読む |
| 競合差別化軸 | 競合が強い時に勝てる切り口 |
| 学術出典 / エビデンスマスター | 「数字の根拠」を辿れる状態 |

**特徴**:
- Layer 1 (制約) は WHAT、Layer 2 (コンテキスト) は WHY
- エージェントが「なぜこのルールがあるか」を理解しないと、グレーゾーンで判断ミスする
- 新メンバー (人間 / エージェント) の onboarding 教材としても機能する

### 2.3 Layer 3: 検証 (Verification) ← 最も手薄、最重投資

**配置**:
- `.claude/skills/design-harness-vitest.md` — Vitest ジェネレータ
- `.claude/skills/design-harness-playwright.md` — Playwright snapshot ジェネレータ
- 各プロジェクトの `tests/unit/design-harness/` / `e2e/design-harness/`

**4 段階**で「外しを物理ブロック」する。下に行くほど高コスト・高精度。

#### 段階 1: ルール検証 (Vitest 等) — 自動 / 即時
- DESIGN_HARNESS.md から検証ルールを Vitest テストに展開
- 例: kind 多様性 ≥4、数字スライドは `stat` kind 必須、禁止文字列不出現、5-7 枚制約
- CI で必ず走る、PR ブロック

#### 段階 2: スクリーンショット検証 (Playwright snapshot) — 自動 / 数十秒
- 各 UI スナップショット (PC + スマホ)
- ベースラインとの視覚密度比較 (文字数 / 画面面積)
- 数字スライドのフォントサイズ ≥48px 等の物理閾値
- 横スクロール発生 / コントラスト比違反の検出

#### 段階 3: エージェントレビュー (Reviewer Agent) — 半自動 / 数分
- 視覚インパクト・刺さり度を 1-10 で採点
- Critical Reviewer 流の問いを内蔵 (「30 秒結論として強いか」「数字が埋もれていないか」)
- N≥5 で初判定 (Small-N Trap 回避)
- **本層は最初は導入せず、Layer 1-2 / 段階 1-2 を運用してから必要性を判断**

#### 段階 4: 人間レビュー — 手動 / 最終判断
- 機械が潰し終えた残課題のみを人間がレビュー
- 「これで刺さるか」のプロダクト判断・違和感探知
- 人間レビューを最終判断**だけ**にするのが Design Harness の目的

**最重投資の理由**: 制約 (Layer 1) は書けば終わるが、検証 (Layer 3) は書き続ける必要がある。CI 統合 / ベースライン更新 / false positive 抑制が運用負荷の中心。

### 2.4 Layer 4: フィードバック (Feedback)

**配置**: 本ドキュメント + 各プロジェクトの `docs/failure_pattern_dictionary.md`

検証で落ちたパターン・採用された良パターンを蓄積し、Layer 1 (制約) に昇格させるループ。

| プロセス | スキル | 出力先 |
|---|---|---|
| 失敗を記録 | `log-failure` | `docs/failure_pattern_dictionary.md` のデザインカテゴリ |
| 成功を記録 | `log-success` | `docs/success_pattern_dictionary.md` |
| 頻出指摘の昇格 | `update-design` (各プロジェクト任意) | `DESIGN_HARNESS.md` の NG パターン節 |
| ルール強化 | Vitest テスト追加 | `tests/unit/design-harness/` |

**設計原則**:
- 失敗は隠さず記録する (再発防止のため)
- 頻出指摘は手動運用ではなく**ルール化**して物理ブロックに昇格
- DESIGN_HARNESS.md は「育てる」前提で運用する (初版完成度より循環頻度)

---

## 3. 導入手順 (新規プロジェクト)

### 3.1 install.sh で同梱されるもの (Story 7 完了後)

```
新規プロジェクト/
├── DESIGN_HARNESS.md             # _templates から複製、プロジェクト固有部を埋める
├── _common/
│   └── DESIGN_HARNESS_METHODOLOGY.md  # 本ドキュメント (read-only 参照)
└── .claude/
    └── skills/
        ├── design-harness-vitest.md
        ├── design-harness-playwright.md
        └── design-md.md           # Harness 対応版
```

導入コマンド (例):
```bash
./install.sh --with-design-harness
```

### 3.2 最初の 1 週間でやること

| Day | アクション | 成果物 |
|---|---|---|
| 1 | DESIGN_HARNESS.md のプロジェクト固有箇所を埋める | Voice / Color / Persona の `<TBD>` を解消 |
| 2 | Slide kind を選ぶ (汎用 8-12 種から必要分) | DESIGN_HARNESS.md §4 確定 |
| 3 | 最低限の Vitest 検証 1-2 本 (kind 多様性 / 禁止文字列) | `tests/unit/design-harness/slide-rules.test.ts` |
| 4 | Playwright snapshot 1-2 枚 (代表 UI のベースライン) | `e2e/design-harness/*.spec.ts` |
| 5 | 1 つのパイロット UI で運用してみる | 検証が機能することを実証 |
| 6 | 失敗パターン 1-2 件を辞書登録 | `docs/failure_pattern_dictionary.md` |
| 7 | レトロ → DESIGN_HARNESS.md 微調整 | v1.1 (運用知見反映) |

**禁止**: 完璧な DESIGN_HARNESS.md を待ってから Day 5 に進む。**運用しながら埋める**のが原則。

### 3.3 段階的厳格化

| フェーズ | 検証レベル | 目安期間 |
|---|---|---|
| 導入直後 | 全ルール warning (落ちても通す) | 最初の 2 週間 |
| 安定期 | 重要ルール (NG パターン / 禁止文字列) は error 昇格 | 2 週目以降 |
| 成熟期 | 全ルール error、新規ルールのみ warning | 1 ヶ月目以降 |

**ルール過多で開発停止** が最大のリスク。warning のうちに false positive を潰し切る。

---

## 4. 導入手順 (既存プロジェクト)

### 4.1 オプトイン式
- 既存プロジェクトには影響を与えない (`--with-design-harness` フラグでオプトイン)
- DESIGN_HARNESS.md を入れた段階で、既存実装と新規実装を区別する

### 4.2 Legacy mode
- 既存 UI は `legacy mode` (検証緩和、warning のみ)
- 新規 UI に strict 適用 (error 昇格)
- 段階的に既存を新ルール準拠に書き換える (急がない)

### 4.3 推奨ステップ

1. DESIGN_HARNESS.md だけ先に追加 (`<TBD>` プレースホルダ多めで OK)
2. 最初は Vitest / Playwright 検証なし
3. 新規 UI 1 つを Harness ルール準拠で実装、運用感を掴む
4. Vitest 検証 1-2 本だけ追加 (warning レベル)
5. 既存 UI は触らない、新規だけ厳格化
6. 既存 UI は機会があれば書き換える (大規模な遡及適用はしない)

---

## 5. 失敗パターン辞書連携

### 5.1 自動収集

```
新スライド / UI 実装
    ↓
Vitest 検証 落ちる
    ↓
log-failure skill 起動
    ↓
docs/failure_pattern_dictionary.md (デザインカテゴリ) に追記
    ↓
3 回以上頻出 → DESIGN_HARNESS.md の NG パターン節に昇格
    ↓
新ルールの Vitest テスト追加
```

### 5.2 失敗パターン例 (デザインカテゴリ)

| パターン | 検出方法 | 昇格ルール |
|---|---|---|
| 数字を箇条書きで出してインパクト消失 | Vitest: `points` 内に `\d+(倍\|%\|→)` | `stat` kind 必須化 |
| 結論を通常テキストで出して刺さらない | Vitest: 「結論」キーワード時の kind チェック | `bigConclusion` kind 必須化 |
| kind 多様性低くて単調 | Vitest: kind 種類 / total < 0.5 | warning → error 昇格 |
| 対比 (vs) を出さず一方的説明で終わった | Reviewer Agent | `vs` kind 推奨節追加 |
| スライド 8 枚以上で疲れる | Vitest: count > 7 | error |
| 禁止文字列の混入 (プロダクト固有) | Vitest: regex match | error 維持 |

### 5.3 AI 時代に育つドキュメント

- DESIGN_HARNESS.md は**初版が完成形ではない**
- エージェントが外した箇所が**新ルールの種**
- 半年単位で見直し、運用しながら育てる
- 失敗パターン辞書 → DESIGN_HARNESS.md 昇格は最低月 1 回

---

## 6. AI-CC-Workshop 実例

本メソドロジーの抽象化元は AI-CC-Workshop (`/Users/Keiji/dev/AI-CC-Workshop/`) の Initiative ARIS-1183。

### 6.1 実装サマリ

| 要素 | パス | 備考 |
|---|---|---|
| Initiative Spec | `docs/design/ARIS-1100-design-harness-spec.md` | 4 層構造の元ソース |
| DESIGN.md (Layer 1) | `DESIGN.md` | 13 セクション、機械可読 SSoT |
| Slide kind 拡張 | `components/slides/types.ts` | 既存 8 種 + 新 4 種 (`stat` / `vs` / `timeline` / `bigConclusion`) |
| Visual primitives | `components/slides/primitives.tsx` | BigNumber / ComparisonGrid / TimelinePill / AccentBox |
| Vitest 検証 (Layer 3) | `tests/unit/design-harness/slide-rules.test.ts` | 10 ルール (kind 多様性、数字スライド検出、NG パターン等) |
| Playwright snapshot (Layer 3) | `e2e/design-harness/slide-snapshots.spec.ts` | 全 20 レッスン × ~7 スライド |
| 失敗パターン辞書 (Layer 4) | `docs/failure_pattern_dictionary.md` | デザインカテゴリ ≥5 件 |

### 6.2 動作実証
- 全 20 レッスン (Z 6 本 + A 14 本) × 7 スライドで動作確認
- パイロット (Z-1) 強化版で Reviewer 採点 5/10 → 8/10 を達成
- 19 本展開時の 1 本あたり実装時間 1.7h → 1.0h に短縮

### 6.3 学んだ失敗パターン (本メソドロジーの源泉)
- 数字インパクト消失 (箇条書きで「2 倍」を出してしまう)
- 結論刺さらない (通常テキストで結論を出してしまう)
- kind 単調 (1 レッスンで `points` 4 連続)
- 対比未表現 (産業革命 vs AI を文章だけで主張)
- スライド過多 (8 枚以上で疲れる)
- 禁止文字列混入 (プロダクト固有の名前空間漏れ)

### 6.4 注意 (汎用化の境界)
- AI-CC-Workshop 固有のもの (Z/A レッスン特有のキーワード、6 ロール定義 `solo_dev`/`engineer`/`pm`/`exec`/`business`/`designer`、学術出典 METR / 経産省 DSS Level 1 等) は汎用化対象外
- 抽出するのは **4 層構造 / Slide kind の汎用部分 / 検証ジェネレータの雛形 / 失敗パターン辞書連携の仕組み** のみ

---

## 7. AI 時代の主要トレンド (要旨)

Design Harness は単独の発明ではなく、業界の Harness Engineering 流れに位置づけられる。

| 提唱者 | キーワード | Design Harness との関係 |
|---|---|---|
| OpenAI | Harness Engineering | 評価パイプライン整備、Layer 3 (検証) の重要性を裏付け |
| Anthropic | Harness Design for long-running development | 長時間自律実行の安全装置、Layer 4 (フィードバック) と整合 |
| Multi-agent 系 | planner / generator / evaluator 分離 | Layer 3 の段階 3 (Reviewer Agent) に対応 |

**示唆**:
- 単発のスタイルガイドでは AI を御せない
- **検証 + フィードバック**のループが本体
- 検証層は最も手薄かつ最も投資効果が高い

> 各社の発信は急速に変化する。半年ごとに本節を見直し、参照リンク・キーワードを更新する。

---

## 8. アンチパターン

設計時にやりがちな失敗。事前に把握しておく。

### 8.1 完璧な DESIGN.md を待ってから始める (NG)
- DESIGN_HARNESS.md は育てる前提
- `<TBD>` のままで運用に入って、運用しながら埋めるのが正
- 完成待ちは無限に待つ

### 8.2 検証を最後の人間レビューだけにする (NG)
- 人間レビューは最終判断**だけ**にすべき
- 機械検証で潰せるものを人間に回すのは時間の無駄
- Layer 3 段階 1-2 (Vitest / Playwright) を最優先で整備

### 8.3 ルール過多で開発停止 (NG)
- 最初から strict にすると新規 UI が書けなくなる
- 段階的厳格化 (warning → error) を必ず守る
- 月次でルールの false positive 率を見直す

### 8.4 AI 単体に任せて「面」が崩れる (NG)
- ハーネスなしでエージェントを走らせると点では良いが面で崩れる
- DESIGN_HARNESS.md を読まないエージェントには UI を書かせない (`design-md` skill 経由を強制)

### 8.5 失敗パターン辞書を更新しない (NG)
- 失敗を記録しないと再発する
- レトロ時に必ず log-failure / log-success を回す
- 月 1 回の昇格判定を組み込む

### 8.6 Slide kind を増やしすぎる (NG)
- 新 kind 追加が止まらないと管理不能
- 「新 kind 追加時の Spec フロー」を明記、4 種以上は責任者承認必須
- 既存 kind の組合せで表現できないか先に検討

---

## 9. 次のステップ

新規プロジェクトのアーキテクトが本ドキュメントを読み終えたら、次の順で資産を確認する。

1. `_templates/DESIGN_HARNESS.md` — 機械可読 SSoT のテンプレート
2. `_common/SLIDE_KIND_CATALOG.md` — Slide kind / Visual primitives 汎用カタログ
3. `_common/COMPONENT_SPEC.md` — コンポーネント仕様の標準テンプレート
4. `.claude/skills/design-md.md` — DESIGN.md / DESIGN_HARNESS.md 生成スキル
5. `.claude/skills/design-harness-vitest.md` — Vitest 検証ジェネレータ
6. `.claude/skills/design-harness-playwright.md` — Playwright snapshot ジェネレータ
7. `install.sh --with-design-harness` で導入

導入後は §3.2 の「最初の 1 週間でやること」に沿って運用を開始する。

---

## 10. リファレンス

### 10.1 hino-orchestrator 内資産
- `_templates/DESIGN_HARNESS.md` — DESIGN_HARNESS テンプレート (Layer 1)
- `_templates/DESIGN_LUNA.md` — Luna ブランド向け DESIGN テンプレ (互換維持)
- `_common/SLIDE_KIND_CATALOG.md` — Slide kind / Visual primitives 汎用カタログ
- `_common/COMPONENT_SPEC.md` — コンポーネント仕様標準
- `_common/CRITICAL_THINKING.md` — 批判的思考プロトコル
- `.claude/skills/design-md.md` — DESIGN.md 生成 skill
- `.claude/skills/aidesigner-frontend.md` — デザイン Agent

### 10.2 AI-CC-Workshop 実例
- `/Users/Keiji/dev/AI-CC-Workshop/docs/design/ARIS-1100-design-harness-spec.md` — Initiative Spec
- `/Users/Keiji/dev/AI-CC-Workshop/DESIGN.md` — DESIGN_HARNESS.md 実装例
- `/Users/Keiji/dev/AI-CC-Workshop/components/slides/types.ts` — Slide kind 型定義
- `/Users/Keiji/dev/AI-CC-Workshop/tests/unit/design-harness/` — Vitest 検証実装
- `/Users/Keiji/dev/AI-CC-Workshop/e2e/design-harness/` — Playwright snapshot 実装

### 10.3 業界トレンド (要旨のみ、原文転載なし)
- OpenAI: Harness Engineering
- Anthropic: Harness Design for long-running development
- Multi-agent harness: planner / generator / evaluator 分離

> Keiji 共有記事の引用は要約に留め、原文転載は禁止。

### 10.4 関連プロトコル
- `_common/SPEC_FIRST.md` — Spec → Test → Implement フロー
- `_common/TEST_POLICY.md` — テストポリシー (SKIP=FAIL)
- `_common/CRITICAL_THINKING.md` — 批判的思考
- `_common/SKILL_EVOLUTION.md` — スキル自動改善ループ
- `skills/aris-feedback.md` — log-failure / log-success skill

---

## 付録: 用語集

| 用語 | 定義 |
|---|---|
| Design Harness | デザイン分野におけるハーネス。制約 / コンテキスト / 検証 / フィードバックの 4 層 |
| SSoT (Single Source of Truth) | 唯一の真実の出典。本仕組みでは DESIGN_HARNESS.md |
| Slide kind | スライドの種類 (title / chat / stat / bigConclusion 等) |
| Visual primitives | スライド内で使う再利用可能な視覚要素 (BigNumber 等) |
| Reviewer Agent | 視覚インパクトを採点する評価エージェント (Layer 3 段階 3) |
| Failure pattern dictionary | 失敗パターンを蓄積する辞書、log-failure skill が更新 |
| Legacy mode | 既存プロジェクトに後付けで導入する際の検証緩和モード |
| 段階的厳格化 | warning → error と段階的にルールを強化する運用 |

---

## 更新履歴

| 日付 | 版 | 変更 | 起案 |
|---|---|---|---|
| 2026-05-10 | v1 | 初版起案 (Initiative ARIS-1300 Story 1) | ARIS |

今後の主要更新は本セクションに追記。半年単位 (2026-11) で全面見直し予定。
