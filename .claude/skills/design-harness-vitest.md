---
name: design-harness-vitest
description: DESIGN_HARNESS.md を読んで Vitest デザイン検証ファイル (slide-rules.test.ts) を生成するスキル。Layer 3 段階 1 の物理ブロックを実装する
model: sonnet
effort: medium
---

# Design Harness Vitest Generator Skill

## Purpose

プロジェクトの `DESIGN_HARNESS.md` (§10.1 検証ルール一覧) を読み、10+ の構造ルールを Vitest テスト
ファイル (`tests/unit/design-harness/slide-rules.test.ts`) として生成する。
これにより Design Harness 4 層構造の **Layer 3 (検証 / Verification) 段階 1** を物理ブロック化し、
「数字スライドが points で書かれてインパクト消失」「結論が highlight で長文化」等の典型 NG を
コミット前に CI で検出する。

生成されたテストは `npm run test --run -- design-harness` で実行可能で、
`tsc --noEmit` (strict) を通る前提で書かれる。

## トリガー条件

- ユーザーが `/design-harness-vitest` を実行した時
- 新規プロジェクトで Design Harness Layer 3 段階 1 を立ち上げる時
- `DESIGN_HARNESS.md` (§10.1) が更新されてルール変更があった時 (再生成)
- 既存 Vitest 検証が古く、SLIDE_KIND_CATALOG の新規 kind を網羅していないと判明した時

## 入力

| 項目 | 既定値 | 備考 |
|---|---|---|
| プロジェクトルート | CWD | install.sh 同梱の場合は CWD |
| DESIGN_HARNESS.md パス | `<root>/DESIGN_HARNESS.md` | 無ければ `_templates/DESIGN_HARNESS.md` を雛形として案内 |
| 対象 lessons / courses パス | `<root>/lib/courses/` | プロジェクト SSoT 構造に依存 (`lib/lessons/` 等もあり) |
| Slide 型定義パス | `<root>/components/slides/types.ts` | 無ければ `_common/SLIDE_KIND_CATALOG.md` の型サンプルを参考に作成案内 |
| 既存テストファイルがある場合 | --- | マージ方針 (上書き / マージ / 別ファイル) を確認 |
| 採用 Slide kind | DESIGN_HARNESS.md §4.1 から抽出 | 12 種から採用された kind のみを `extractSlideText` switch で網羅 |
| 必須ロール一覧 (任意) | DESIGN_HARNESS.md §7 / §10.1.10 | プロジェクトに roles 概念がある場合のみ Rule 10 を生成 |
| 禁止文字列 | 既定 `\b(Luna|NOVA|ARIS|Utata|hinominant)\b` | DESIGN_HARNESS.md §6.6 で上書き可 |
| スライド枚数制約 | 既定 5-7 | DESIGN_HARNESS.md §5.1 / §10.1.5 で上書き可 |

## 生成ルール (10 ルール + メタ自己テスト)

各ルールは独立した `describe` ブロックで、`it` 内の assertion メッセージで
「どのレッスン / コースの」「どのルールが」「なぜ」FAIL したかを明示する。
slides 未実装のレッスンは `it.skip` で明示的にスキップする (Rule 8 だけは body にも適用)。

### Rule 1: kind 多様性 (使用 kind 種類 ≥4)

`DESIGN_HARNESS.md §10.1.1`。1 レッスン (or 1 章) で使用される `slide.kind` の
ユニーク数が 4 以上であることを検証。chat / points 連発を防ぐ。

### Rule 2: 数字スライド検出 → stat or highlight 必須

`DESIGN_HARNESS.md §10.1.2 / §6.1`。lesson.body + 全スライドのテキスト連結に
`/[0-9]+\s*(倍|%|→|年)/` がマッチした時、slides 内に `stat` or `highlight` kind が
1 枚以上含まれることを検証。points 箇条書きでの数字インパクト消失を防ぐ。

### Rule 3: 結論スライド検出 → bigConclusion / highlight / summary 必須

`DESIGN_HARNESS.md §10.1.3 / §6.2`。テキストに `/結論|まとめ/` (プロジェクトで
カスタマイズ可) がマッチした時、`bigConclusion` / `highlight` / `summary` のいずれかが
含まれることを検証。通常テキストでの結論埋没を防ぐ。

### Rule 4: NG points + 単独数字

`DESIGN_HARNESS.md §10.1.4 / §6.1 NG`。`points` kind の各 item.title / item.desc が
「単独数字スライド」(例: `2倍` / `50%` / `17→50%`) になっていないことを検証。
ヘルパ `isNumberOnlyPoint(text)` を内蔵し、説明ラベル付き (例: `都市人口比率: 17→50%`) は OK。

### Rule 5: スライド枚数制約 (5-7)

`DESIGN_HARNESS.md §10.1.5 / §5.1.2`。`slides.length` が 5 以上 7 以下を検証。
プロジェクトで上限が異なる場合は DESIGN_HARNESS.md §5.1 に明記された値を使う。

### Rule 6: 連続同 kind 禁止 (4 連続)

`DESIGN_HARNESS.md §10.1.6 / §6.4 NG`。同じ `kind` が 4 連続しないことを検証。
最長連続区間とその kind を assertion メッセージに含める。

### Rule 7: kind 多様性割合 ≥ 0.5

`DESIGN_HARNESS.md §10.1.7`。`unique kind / total slides ≥ 0.5` を検証。
Rule 1 と独立に「総数に対して半数以上が異なる kind」を要求する追加ガード。

### Rule 8: 禁止文字列不出現 (常時 / slides 有無問わず)

`DESIGN_HARNESS.md §10.1.8 / §6.6 / CLAUDE.md ルール 2`。デフォルトパターンは
`\b(Luna|NOVA|ARIS|Utata|hinominant)\b`。lesson.body + slides テキスト連結に
マッチが無いことを検証。**唯一 slides 未実装レッスンにも適用される rule**。

### Rule 9: 時間制約 (durationMinutes ≤ 5)

`DESIGN_HARNESS.md §10.1.9`。コース or レッスンの `durationMinutes` フィールドが
DESIGN_HARNESS.md §5.1 で指定された上限 (既定 5 分) 以下であることを検証。
例外コース (例: 演習込みで 7 分許容) があれば `ALLOW_OVER_5` のような Set で除外。

### Rule 10: ロール対応 (roles 配列にプロジェクト指定の必須ロール全部)

`DESIGN_HARNESS.md §10.1.10`。プロジェクトに「ロール別パス」概念がある場合のみ生成。
`course.roles` が DESIGN_HARNESS.md §10.1.10 で指定された必須ロール全件を含むこと、
かつサイズが余分なロール無しで一致することを検証。
ロール概念が無いプロジェクトでは Rule 10 を省略 (skill 出力時にコメントで明示)。

### メタ: ヘルパ自己テスト

`isNumberOnlyPoint` / `extractSlideText` の振る舞いを Vitest 内で自己テスト
(回帰防止)。`ALL_LESSONS.length` の下限チェック (例: 想定 N レッスン以上) も
ここに含める。

## 生成手順

### Step 1: DESIGN_HARNESS.md 解析

- §4.1 (採用 kind 一覧) を抽出 → `extractSlideText` switch の case 列を決定
- §5.1 / §10.1.5 (スライド枚数制約) → Rule 5 の上下限
- §6.6 / §10.1.8 (禁止文字列パターン) → Rule 8 の正規表現
- §10.1.9 (時間制約) → Rule 9 の上限値 + 例外コース
- §10.1.10 (必須ロール) → Rule 10 の `ALL_ROLES`
- DESIGN_HARNESS.md 不存在 → `_templates/DESIGN_HARNESS.md` のコピーを user に促し中断

### Step 2: 既存コード構造の調査

- `lib/courses/index.ts` (or 同等: `lib/lessons/`, `content/courses/` 等) で `COURSES` のような
  集約 export を確認
- `components/slides/types.ts` で Slide discriminated union を読み、採用 kind を確定
- 既存テストが `tests/unit/design-harness/` にあれば parse して、既存 describe ブロックを
  上書き / マージ / 別ファイル化のいずれにするかを user 確認

### Step 3: Vitest ファイル生成

- ヘッダ (Linear チケット ID / 仕様ファイル参照 / 目的 / 対象 / 実装ノート) コメント
- import 文 (`vitest`, COURSES アクセス path, Slide 型 path)
- 定数定義 (`PHASE1_COURSE_IDS` 等のコース ID 一覧、`ALL_ROLES`)
- ヘルパ (`collectLessons`, `extractSlideText` 全 kind 網羅 + exhaustiveness check,
  `extractAllText`, `isNumberOnlyPoint`)
- 正規表現定数 (`NUMBER_REGEX`, `CONCLUSION_REGEX`, `BANNED_WORDS_REGEX`)
- describe ブロック × 10 ルール (上記)
- メタ自己テスト describe ブロック

### Step 4: 自己テスト

- `npx tsc --noEmit` を実行して strict mode で型エラー無しを確認
- `npm run test --run -- design-harness` で実行可能かを確認 (PASS/FAIL は別問題、
  実行不能だけは絶対回避)

### Step 5: フィードバック

- 既存テスト破壊が無いか `git diff tests/unit/design-harness/` を提示
- 生成テストが FAIL した項目を一覧化し、user に「DESIGN_HARNESS.md 違反 = 修正対象」か
  「ルール緩和 = DESIGN_HARNESS.md 更新対象」かを判定してもらう

## 出力フォーマット (生成 Vitest ファイルの基本骨格)

下記は SLIDE_KIND_CATALOG の 12 kind を全採用したプロジェクト向けサンプル。
プロジェクトで採用していない kind は switch から除外する (exhaustiveness check で type error にする)。

```typescript
/**
 * <PROJECT_NAME> Design Harness Layer 3 段階 1: Vitest 構造検証
 *
 * Linear: <TICKET_ID>
 * 仕様: DESIGN_HARNESS.md §10.1
 *
 * 目的:
 *   - スライドベース UI の構造制約 (kind 多様性 / 数字スライド / 結論スライド 等) を
 *     物理ブロックで保証する
 *   - 既存実装済レッスンは全ルールで PASS、slides 未実装レッスンは明示的 skip
 *   - body のみのレッスンも Rule 8 (禁止文字列) は常時 PASS が期待
 *
 * 対象: <Z 6 + A 14 等、コース ID 一覧>
 *
 * 実装ノート:
 *   - kind 列挙は `components/slides/types.ts` の Slide discriminated union と
 *     完全一致 (新規 kind 追加時はここも更新)
 *   - body / slide テキスト抽出は `extractAllText()` に集約
 */
import { describe, it, expect } from "vitest";
import { COURSES } from "@/lib/courses";
import { getCourseLessons, type Lesson } from "@/lib/courses/content";
import type { Slide } from "@/components/slides/types";

/* ----- 対象コース ID 一覧 ----- */
const PHASE1_COURSE_IDS = [
  // <DESIGN_HARNESS.md / Linear から抽出>
] as const;

/* ----- 必須ロール (Rule 10 用) ----- */
const ALL_ROLES = [
  // <DESIGN_HARNESS.md §10.1.10 から抽出>
] as const;

/* ----- ヘルパ ----- */
interface LessonWithCourse {
  courseId: string;
  lesson: Lesson;
  slides: readonly Slide[];
  hasSlides: boolean;
}

function collectLessons(): readonly LessonWithCourse[] {
  const out: LessonWithCourse[] = [];
  for (const courseId of PHASE1_COURSE_IDS) {
    for (const lesson of getCourseLessons(courseId)) {
      const slides = (lesson.slides ?? []) as readonly Slide[];
      out.push({ courseId, lesson, slides, hasSlides: slides.length > 0 });
    }
  }
  return out;
}
const ALL_LESSONS = collectLessons();

function extractSlideText(slide: Slide): string {
  switch (slide.kind) {
    case "title":
      return [slide.title, slide.sub ?? ""].join("\n");
    case "chat":
      return [slide.heading ?? "", ...slide.messages.map((m) => m.content)].join("\n");
    case "compare":
      return [
        slide.heading,
        slide.bad.label, slide.bad.code, slide.bad.note,
        slide.good.label, slide.good.code, slide.good.note,
      ].join("\n");
    case "points":
      return [
        slide.heading,
        ...slide.items.flatMap((i) => [i.title, i.desc ?? ""]),
      ].join("\n");
    case "highlight":
      return [slide.heading, slide.body].join("\n");
    case "stat":
      return [
        slide.title ?? "",
        slide.bottomNote ?? "",
        ...slide.stats.flatMap((s) => [s.number, s.unit ?? "", s.caption ?? ""]),
      ].join("\n");
    case "vs":
      return [
        slide.title ?? "", slide.bottomNote ?? "", slide.separator ?? "",
        slide.left.label, slide.left.value, slide.left.sub ?? "",
        slide.right.label, slide.right.value, slide.right.sub ?? "",
      ].join("\n");
    case "timeline":
      return [
        slide.title ?? "", slide.bottomNote ?? "",
        ...slide.nodes.flatMap((n) => [n.label, n.duration, n.note ?? ""]),
      ].join("\n");
    case "bigConclusion":
      return [slide.conclusion, slide.source ?? "", slide.next ?? ""].join("\n");
    case "exercise-cta":
      return [slide.heading, slide.description, slide.ctaLabel ?? ""].join("\n");
    case "summary":
      return [slide.heading, ...slide.items].join("\n");
    case "code":
      return [slide.heading ?? "", slide.code, slide.lang ?? ""].join("\n");
    default: {
      // exhaustiveness check: 新規 kind 追加時はここで型エラーにする
      const _exhaustive: never = slide;
      return String(_exhaustive);
    }
  }
}

function extractAllText(lesson: Lesson, slides: readonly Slide[]): string {
  return [lesson.body ?? "", slides.map(extractSlideText).join("\n")].join("\n");
}

const NUMBER_REGEX = /[0-9]+\s*(倍|%|→|年)/;
const CONCLUSION_REGEX = /結論|まとめ/;
const BANNED_WORDS_REGEX = /\b(Luna|NOVA|ARIS|Utata|hinominant)\b/;

function isNumberOnlyPoint(text: string): boolean {
  const trimmed = text.trim();
  if (!/[0-9]+\s*(倍|%)/.test(trimmed)) return false;
  const numTokenRegex =
    /[0-9]+(?:[\.,][0-9]+)?(?:\s*[→～~−-]\s*[0-9]+(?:[\.,][0-9]+)?)?\s*(倍|%)/;
  const numericMatch = trimmed.match(numTokenRegex);
  if (!numericMatch) return false;
  const stripped = trimmed.replace(numericMatch[0], "").trim();
  return stripped.length <= 3;
}

/* ----- Rule 1-10 (各 describe ブロック) -----
 * Rule 1: kind 多様性 ≥4
 * Rule 2: 数字スライド → stat/highlight 必須
 * Rule 3: 結論スライド → bigConclusion/highlight/summary 必須
 * Rule 4: NG points + 単独数字
 * Rule 5: スライド枚数 5-7
 * Rule 6: 連続同 kind 4 連続禁止
 * Rule 7: 多様性割合 ≥0.5
 * Rule 8: 禁止文字列 (slides 有無問わず常時)
 * Rule 9: durationMinutes ≤5
 * Rule 10: roles に ALL_ROLES 全部
 *
 * + メタ self-test (isNumberOnlyPoint / extractSlideText / ALL_LESSONS.length)
 */
```

## エラーハンドリング

- `DESIGN_HARNESS.md` 不存在 → `_templates/DESIGN_HARNESS.md` のコピー方法を案内し中断
  (skill が DESIGN_HARNESS.md を勝手に作らない)
- `components/slides/types.ts` 不存在 → `_common/SLIDE_KIND_CATALOG.md` §6 のコピー先候補を案内
- 既存 `tests/unit/design-harness/slide-rules.test.ts` 存在 → diff を提示し
  「上書き / マージ / 別ファイル」を user 確認
- 既存実装の Slide kind 一覧が SLIDE_KIND_CATALOG と乖離 (例: catalog にない kind がある) →
  exhaustiveness check で type error にする方針を維持し、user に
  「カタログに追加 (PR) or プロジェクト固有 kind として末尾追加」を選択させる
- `npx tsc --noEmit` が落ちた → 落ちた行とエラーメッセージを user に提示し、
  生成ファイルを `tests/unit/design-harness/slide-rules.test.ts.draft` に退避

## Dry-Run Mode

`--dry-run` 指定時はファイル書き込みを行わず、以下のみ出力:

- 入力 (DESIGN_HARNESS.md 解析結果サマリ: 採用 kind / 枚数制約 / 必須ロール 等)
- 生成予定の Rule 数 (10 + メタ self-test) と各 describe ブロックタイトル
- 生成予定 Vitest ファイルの最初の 30 行プレビュー

```
[DRY-RUN] design-harness-vitest:
  source=<root>/DESIGN_HARNESS.md
  adopted_kinds=12 (title/chat/compare/points/highlight/stat/vs/timeline/bigConclusion/exercise-cta/summary/code)
  slide_count_range=5-7
  banned_pattern=\b(Luna|NOVA|ARIS|Utata|hinominant)\b
  duration_max=5min
  required_roles=6 (solo_dev/engineer/pm/exec/business/designer)
  rules=10 + meta self-test
  output=tests/unit/design-harness/slide-rules.test.ts (draft)
```

## 配置先

- 入力: `<project>/DESIGN_HARNESS.md` (Layer 1 制約)
- 入力: `<project>/lib/courses/` or `<project>/lib/lessons/` (or 同等)
- 入力: `<project>/components/slides/types.ts`
- 出力: `<project>/tests/unit/design-harness/slide-rules.test.ts`
- 参考: `_common/SLIDE_KIND_CATALOG.md` (汎用 kind 定義 + Visual primitives)
- 参考: `_templates/DESIGN_HARNESS.md` (Layer 1 テンプレ)
- 参考: `_common/DESIGN_HARNESS_METHODOLOGY.md` (Layer 2 メソドロジー)

## 関連 skill

- `design-md` — DESIGN.md / DESIGN_HARNESS.md 生成 (本 skill の入力を作る)
- `design-harness-playwright` (Story 5) — Layer 3 段階 2 (snapshot 検証)
- `aris-feedback` — log-failure / log-success で Layer 4 連携

---

## 付録: AI-CC-Workshop Initiative ARIS-1183 実装との対応マップ

本 skill は AI-CC-Workshop で実装された `tests/unit/design-harness/slide-rules.test.ts`
(525 行 / Rule 1-10 + メタ self-test) を汎用ジェネレータ化したもの。

### 対応ファイル

| AI-CC-Workshop 実装 | 本 skill の役割 |
|---|---|
| `/Users/Keiji/dev/AI-CC-Workshop/tests/unit/design-harness/slide-rules.test.ts` | 本 skill が生成する Vitest ファイル (汎用化版) の origin |
| `/Users/Keiji/dev/AI-CC-Workshop/DESIGN.md` §10.1 | 本 skill の入力 (DESIGN_HARNESS.md §10.1) の origin |
| `/Users/Keiji/dev/AI-CC-Workshop/components/slides/types.ts` | 本 skill が参照する Slide 型の origin (汎用版は `_common/SLIDE_KIND_CATALOG.md` §2) |
| `/Users/Keiji/dev/AI-CC-Workshop/lib/courses/content/` | 本 skill が走査する lesson 構造の origin |

### 対応ルール

| Workshop 実装 Rule | 本 skill 抽象化ルール | 汎用化ポイント |
|---|---|---|
| Rule 1: kind 多様性 ≥4 (DESIGN.md §10.1.1) | Rule 1: 同左 | 完全汎用 (kind 文字列に依存しない) |
| Rule 2: 数字スライド → stat/highlight (§10.1.2) | Rule 2: 同左 | 正規表現 `/[0-9]+\s*(倍|%|→|年)/` は DESIGN_HARNESS.md でカスタマイズ可 |
| Rule 3: 結論スライド → bigConclusion/highlight/summary (§10.1.3) | Rule 3: 同左 | キーワード `30 秒で言える結論` は AI-CC-Workshop 固有のため除外、汎用版は `結論|まとめ` |
| Rule 4: points + 単独数字 NG (§10.1.4) | Rule 4: 同左 | `isNumberOnlyPoint` ヘルパは完全汎用 (日本語ラベル長 ≤3 字判定) |
| Rule 5: スライド枚数 5-7 (§10.1.5) | Rule 5: 同左 | 上下限は DESIGN_HARNESS.md §5.1 で上書き可 |
| Rule 6: 連続同 kind <4 (§10.1.6) | Rule 6: 同左 | 完全汎用 |
| Rule 7: 多様性割合 ≥0.5 (§10.1.7) | Rule 7: 同左 | 完全汎用 |
| Rule 8: 禁止文字列 (§10.1.8) | Rule 8: 同左 | デフォルトパターン `\b(Luna|NOVA|ARIS|Utata|hinominant)\b` を常時組込 (CLAUDE.md ルール 2) |
| Rule 9: durationMinutes ≤5 (§10.1.9) | Rule 9: 同左 | 上限値 + 例外コース ID は DESIGN_HARNESS.md §10.1.9 で上書き可 |
| Rule 10: 6 ロール対応 (§10.1.10) | Rule 10: roles 必須セット | AI-CC-Workshop の 6 ロール (`solo_dev/engineer/pm/exec/business/designer`) は固定せず、DESIGN_HARNESS.md §10.1.10 で定義された ALL_ROLES を使う。ロール概念無いプロジェクトでは Rule 10 を省略 |
| メタ self-test (`isNumberOnlyPoint` / `extractSlideText` / `ALL_LESSONS.length`) | 同左 | 完全汎用 (回帰防止のため必須生成) |

### 排除した AI-CC-Workshop 固有要素

本 skill は以下を **生成テストに混入させない**:

- `Z_COURSE_IDS` / `A_COURSE_IDS` 等の AI-CC-Workshop 固有コース命名
- Z-6 例外 (`category-z-6-your-one-year-later` のみ 7 分許容) 等の固有例外
- 6 ロール固定値 (プロジェクトで再定義可)
- 「30 秒で言える結論」等のキーワード (汎用版は `結論|まとめ`)
- 学術出典脚注 `[^N]` 形式の検証 (プロジェクト固有のためオプション扱い)

これらが必要なプロジェクトは `DESIGN_HARNESS.md` §10.1 に明示し、本 skill 生成後に
手動で追加 describe ブロックを足す。
