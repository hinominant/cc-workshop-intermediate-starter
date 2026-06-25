---
name: design-harness-playwright
description: DESIGN_HARNESS.md を読んで Playwright スクリーンショット検証ファイルを生成するスキル
model: sonnet
effort: medium
---

# Design Harness Playwright Snapshot Skill

## Purpose

プロジェクトの `DESIGN_HARNESS.md` §10.2 を読み、Layer 3 段階 2 (スクリーンショット検証) を満たす Playwright E2E ファイルを `e2e/design-harness/slide-snapshots.spec.ts` (or 同等) として生成する。

兄弟 skill: `design-harness-vitest` (Layer 3 段階 1)。

## トリガー条件

- ユーザーが `/design-harness-playwright` を実行
- 新規プロジェクトで Design Harness Layer 3 段階 2 を立ち上げる時
- DESIGN_HARNESS.md / Slide kind が更新された時
- Story 6 (Z-1 強化版) のような視覚改修後にベースライン更新が必要な時

## 入力

| 項目 | 必須 | 既定値 |
|---|---|---|
| プロジェクトルート (CWD) | yes | - |
| DESIGN_HARNESS.md パス | no | `<root>/DESIGN_HARNESS.md` |
| 対象レッスン URL リスト | yes | DESIGN_HARNESS.md §11 から抽出 |
| 既存 baseline snapshot の有無 | no | auto detect |
| 本番 / dev サーバ URL | yes | DESIGN_HARNESS.md §0 から抽出 |
| viewport 設定 | no | playwright.config.ts から chromium / mobile-safari project を読む |

## 生成ルール (DH-S1〜DH-S5)

### DH-S1: 各スライドのスクリーンショット取得 + diff 検出
- viewport: PC (1280x720) + iPhone 14 (390x844)
- スナップショット保存: `e2e/design-harness/slide-snapshots.spec.ts-snapshots/<viewport>/<lesson-id>-<slide-index>.png`
- `expect(page).toHaveScreenshot()` / `maxDiffPixelRatio: 0.05`
- `animations: "disabled"` / `caret: "hide"` で flaky 防止
- 初回実行時は baseline 自動生成 (失敗扱いだが想定通り)
- 2 回目以降は diff 検出

### DH-S2: 数字スライド (stat kind) のフォントサイズ ≥ 48px
- DOM 内 BigNumber primitive 専用の class 組合せで限定検出
  - **推奨 selector**: `.font-display.font-black.tabular-nums.break-keep`
  - 理由: `tabular-nums` と `break-keep` は BigNumber 専用、TimelinePill / AccentBox / ComparisonGrid は持たない
  - **NG selector**: `.font-display.font-black` だけ → TimelinePill (text-3xl=30px) / AccentBox 等を誤検出して false positive (Phase A Story 4 で発見した教訓)
- 代替: BigNumber に `data-stat-number="true"` を付与 (実装簡素化方針)
- `getComputedStyle().fontSize` を parseFloat
- 48px 以上を assert
- chromium project 限定 (mobile では別の閾値、後述 DH-S3 で代替)

### DH-S3: スマホ 390px 横スクロール無し
- viewport 390x844 (iPhone 14)
- `document.documentElement.scrollWidth ≤ 390` を assert
- 全スライド遷移後も同条件 (ループで全 slide index を訪問)
- mobile-safari project 限定

### DH-S4: 既存 baseline との視覚密度比較
- DOM 内 `<p>`, `<li>`, `<span>` 等のテキスト総文字数を取得
- 画面面積 (viewport.width × viewport.height) で割って密度算出
- ベースライン (DESIGN_HARNESS.md §10.2 で指定された "best サンプルレッスン") から ±50% 以内
- ベースラインが未指定なら基準値 (100 chars / 1000 px²) で fallback + warning
- chromium project 限定

### DH-S5: 動画埋込プレースホルダ確認 (将来 Phase 用)
- `test.skip()` + TODO 期限明記
- 動画タグ (`<video>`) 出現時に DH-S5 を有効化する仕組みのみ予約

## 生成手順

### Step 1: DESIGN_HARNESS.md 解析
- §10.2 検証ルール / プロジェクト固有 viewport / ベースラインサンプル指定を抽出
- §11 ファイル配置から対象レッスン URL リスト抽出 (or プロジェクト固有 SSoT を読む)
- §6 NG パターンに「スマホ崩れ」が含まれることを確認 (DH-S3 必須化判断)

### Step 2: 既存 Playwright 構造調査
- `playwright.config.ts` で project (chromium / mobile-safari / webkit) 確認
- `e2e/` ディレクトリの既存スタイル (smoke.spec.ts 等) 踏襲
- `webServer` 設定があれば dev サーバ自動起動、なければ本番 URL 直接

### Step 3: Playwright ファイル生成
- describe ブロック × 5 (DH-S1 〜 DH-S5)
- `testInfo.project.name` で chromium / mobile-safari の分岐
- 初回 baseline 自動生成 → 2 回目 diff
- スライド遷移は keyboard (`page.keyboard.press('ArrowRight')`) or click

### Step 4: gitignore 更新
`.gitignore` に追加 (重複なら skip):
```
# Design Harness snapshots (initial baseline, not committed per DESIGN_HARNESS spec)
/e2e/design-harness/snapshots/
/e2e/design-harness/*-snapshots/
```

### Step 5: 動作確認
- 初回実行 (baseline なし): expected 失敗 → baseline 自動生成
- 2 回目: PASS
- mobile-safari project がない場合: `npx playwright install webkit` を提案

## 出力フォーマット

生成 Playwright ファイル骨格 (プロジェクト固有値は `<TBD>` プレースホルダ):

```typescript
import { test, expect } from "@playwright/test";

/**
 * Design Harness Layer 3 段階 2: スクリーンショット検証
 * Spec: <project>/DESIGN_HARNESS.md §10.2
 * Baseline lesson: <TBD>
 */

const BASE_URL = process.env.E2E_BASE_URL ?? "<TBD: production URL>";

const LESSONS: ReadonlyArray<{ id: string; courseId: string; lessonId: string; slideCount: number }> = [
  // <TBD>: DESIGN_HARNESS.md §11 から自動抽出
  // 例: { id: "z-1", courseId: "category-z-1-industrial-revolution", lessonId: "01-steam-engine-100-years", slideCount: 7 },
];

const BASELINE_LESSON = LESSONS[0]; // DESIGN_HARNESS.md §10.2 で指定
const DENSITY_TOLERANCE = 0.5;       // ±50%
const MIN_STAT_FONT_PX = 48;
const MOBILE_VIEWPORT_WIDTH = 390;

// =============== DH-S1: snapshot diff ===============

test.describe("DH-S1: 各スライドの snapshot 取得 + diff", () => {
  for (const lesson of LESSONS) {
    test(`${lesson.id} all slides snapshot`, async ({ page }, testInfo) => {
      const viewport = testInfo.project.name;
      await page.goto(`${BASE_URL}/learn/${lesson.courseId}/${lesson.lessonId}`);
      await page.waitForLoadState("networkidle");

      for (let i = 0; i < lesson.slideCount; i++) {
        await expect(page).toHaveScreenshot(`${viewport}-${lesson.id}-slide-${i + 1}.png`, {
          maxDiffPixelRatio: 0.05,
          animations: "disabled",
          caret: "hide",
          fullPage: false,
        });
        if (i < lesson.slideCount - 1) {
          await page.keyboard.press("ArrowRight");
          await page.waitForTimeout(200); // transition wait
        }
      }
    });
  }
});

// =============== DH-S2: stat kind ≥48px (chromium) ===============

test.describe("DH-S2: stat kind フォント ≥48px", () => {
  for (const lesson of LESSONS) {
    test(`${lesson.id} stat kind font check`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "chromium");
      await page.goto(`${BASE_URL}/learn/${lesson.courseId}/${lesson.lessonId}`);
      await page.waitForLoadState("networkidle");

      // 全スライドを巡回して [data-kind="stat"] を探す
      for (let i = 0; i < lesson.slideCount; i++) {
        const statNumbers = await page.locator('[data-kind="stat"] .big-number-value, [data-kind="stat"] [class*="text-9xl"], [data-kind="stat"] [class*="text-7xl"]').all();
        for (const el of statNumbers) {
          const fontSize = await el.evaluate((node) => {
            return parseFloat(window.getComputedStyle(node).fontSize);
          });
          expect(fontSize, `slide ${i + 1} stat number font`).toBeGreaterThanOrEqual(MIN_STAT_FONT_PX);
        }
        if (i < lesson.slideCount - 1) await page.keyboard.press("ArrowRight");
      }
    });
  }
});

// =============== DH-S3: スマホ 390px 横スクロール無し ===============

test.describe("DH-S3: スマホ 390px 横スクロール無し", () => {
  for (const lesson of LESSONS) {
    test(`${lesson.id} mobile no horizontal scroll`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "mobile-safari");
      await page.goto(`${BASE_URL}/learn/${lesson.courseId}/${lesson.lessonId}`);
      await page.waitForLoadState("networkidle");

      for (let i = 0; i < lesson.slideCount; i++) {
        const overflow = await page.evaluate(() => ({
          docScrollWidth: document.documentElement.scrollWidth,
          docClientWidth: document.documentElement.clientWidth,
          windowWidth: window.innerWidth,
        }));
        expect(overflow.docScrollWidth, `slide ${i + 1} should not overflow ${MOBILE_VIEWPORT_WIDTH}px`).toBeLessThanOrEqual(MOBILE_VIEWPORT_WIDTH);
        if (i < lesson.slideCount - 1) {
          await page.keyboard.press("ArrowRight");
          await page.waitForTimeout(200);
        }
      }
    });
  }
});

// =============== DH-S4: 視覚密度 ±50% ===============

test.describe("DH-S4: 視覚密度 baseline ±50% 以内", () => {
  let baselineDensity = 100; // fallback (chars / 1000 px²)

  test.beforeAll(async ({ browser }) => {
    if (!BASELINE_LESSON) return;
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/learn/${BASELINE_LESSON.courseId}/${BASELINE_LESSON.lessonId}`);
    await page.waitForLoadState("networkidle");
    baselineDensity = await page.evaluate(() => {
      const text = document.body.innerText.length;
      const area = window.innerWidth * window.innerHeight;
      return (text * 1000) / area;
    });
    await context.close();
  });

  for (const lesson of LESSONS) {
    test(`${lesson.id} density vs baseline`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "chromium");
      await page.goto(`${BASE_URL}/learn/${lesson.courseId}/${lesson.lessonId}`);
      await page.waitForLoadState("networkidle");
      const density = await page.evaluate(() => {
        const text = document.body.innerText.length;
        const area = window.innerWidth * window.innerHeight;
        return (text * 1000) / area;
      });
      const lower = baselineDensity * (1 - DENSITY_TOLERANCE);
      const upper = baselineDensity * (1 + DENSITY_TOLERANCE);
      expect(density, `${lesson.id} density should be within ±${DENSITY_TOLERANCE * 100}% of baseline ${baselineDensity.toFixed(1)}`).toBeGreaterThan(lower);
      expect(density).toBeLessThan(upper);
    });
  }
});

// =============== DH-S5: 動画埋込プレースホルダ (将来 Phase 用) ===============

test.describe("DH-S5: 動画埋込確認 (将来 Phase)", () => {
  test.skip("Phase 4 以降の動画コンテンツ実装後に有効化 (TODO 期限: 各プロジェクト Phase 4 着手時)", async () => {
    // 将来: <video> タグ出現を assert
  });
});
```

## エラーハンドリング

| 状況 | 対応 |
|---|---|
| baseline snapshot 不存在 | 自動生成 + warning (初回扱い) |
| DOM 構造が想定と違う ([data-kind="stat"] 不在) | DESIGN_HARNESS.md 更新提案 + class fallback で間接検出 |
| 動画タグ未実装 | DH-S5 を test.skip + TODO 期限明記 |
| webkit ブラウザ未インストール | `npx playwright install webkit` を提案 |
| webServer 設定なし | 本番 URL 直接 (E2E_BASE_URL env 経由) |
| LESSONS 配列空 | DESIGN_HARNESS.md §11 から自動抽出を促す |

## Dry-Run Mode

`--dry-run` 指定時はファイル書き込みを行わず、以下のみ出力:
- 入力サマリ (DESIGN_HARNESS.md パス / 対象レッスン数 / viewport project)
- 生成予定ファイルパス
- 5 describe ブロックの概要

```
[DRY-RUN] design-harness-playwright: lessons=20, viewports=[chromium, mobile-safari], baseline=z-1
  -> e2e/design-harness/slide-snapshots.spec.ts (約 350 行 / 5 describe / 100 test)
  -> .gitignore +3 行
```

## 関連ファイル

- 入力: `<project>/DESIGN_HARNESS.md` (§10.2 / §11)
- 入力: `<project>/playwright.config.ts` (project 設定)
- 入力: `<project>/lib/courses/` (or 同等の SSoT)
- 出力: `<project>/e2e/design-harness/slide-snapshots.spec.ts`
- 出力: `<project>/.gitignore` 更新
- 参考: `_common/SLIDE_KIND_CATALOG.md` (kind 詳細)
- 参考: `_common/DESIGN_HARNESS_METHODOLOGY.md` (Layer 3 段階 2 の意義)
- 兄弟: `.claude/skills/design-harness-vitest.md` (Layer 3 段階 1)

## 配置先

- スキル本体: `.claude/skills/design-harness-playwright.md` (本ファイル / orchestrator)
- 生成 spec: 各プロジェクトの `e2e/design-harness/slide-snapshots.spec.ts`
- baseline snapshot: 各プロジェクトの `e2e/design-harness/slide-snapshots.spec.ts-snapshots/` (gitignore)

---

## Appendix: AI-CC-Workshop 実装との対応

| 本 skill 生成テスト | AI-CC-Workshop 実装 (`e2e/design-harness/slide-snapshots.spec.ts`) | 抽象化された箇所 |
|---|---|---|
| DH-S1 snapshot diff | 同名 describe / 同パラメータ | LESSONS 配列を `<TBD>` 化 |
| DH-S2 stat ≥48px | 同名 describe / chromium 限定 | `[data-kind="stat"]` セレクタを汎用化 |
| DH-S3 mobile 390px | 同名 describe / mobile-safari 限定 | viewport 値を定数化 |
| DH-S4 density ±50% | 同名 describe / baseline lesson | baseline lesson を DESIGN_HARNESS.md §10.2 から抽出 |
| DH-S5 動画 (skip) | 同名 describe / Phase 4 TODO | TODO 期限を各プロジェクト固有に |

### baseline 指定方法

各プロジェクトの DESIGN_HARNESS.md §10.2 に以下を追記:
```markdown
### 10.2 段階 2: スクリーンショット検証 (Playwright)
- baseline lesson: <course-id>/<lesson-id> (例: basic-intro/01-what-is-claude-code)
- 視覚密度 tolerance: ±50%
```

### 抽象化で除外したもの

- AI-CC-Workshop 固有のレッスン id (`category-z-1-industrial-revolution` 等)
- 本番 URL (`https://main.d2fqg17cnut5e7.amplifyapp.com`) — env 経由
- Story 番号 (ARIS-1188 等)
- 6 ロール固有名 (汎用化のため)
