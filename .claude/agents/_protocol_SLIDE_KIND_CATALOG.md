# SLIDE_KIND_CATALOG — 汎用 Slide / Component カタログ

> Design Harness Initiative Story 3 成果物。
> 全プロジェクトで再利用可能な Slide kind 12 種 + Visual primitives 4 種を定義。
> 各プロジェクトは本カタログを参照し、自プロジェクトの `components/slides/types.ts` / `primitives.tsx` に
> コピー or 部分採用してカスタマイズする。

---

## 0. このドキュメントの位置づけ

### 0.1 目的

スライド形式の学習・プレゼン UI を構築する全プロジェクトに、共通の **Slide kind カタログ** と
**Visual primitives 設計例** を提供する。これにより以下を達成する:

- **Layer 1 制約の標準化**: 「数字スライドは stat or highlight 必須」のような構造制約を
  Slide 型レベルで強制可能にする (Vitest 検証 = Story 4)
- **再利用性**: 新規プロジェクト立ち上げ時にゼロから kind 設計せずに済む
- **一貫性**: プロジェクト間で命名・props・スマホ対応原則が揃う

### 0.2 4 層構造での位置

```
Layer 1 (制約)        ← 本ドキュメント (汎用 kind catalog)
  ├ DESIGN_HARNESS.md ← プロジェクト固有 (ブランド色 / Voice & Tone)
  └ SLIDE_KIND_CATALOG.md (本書) ← 全プロジェクト共通

Layer 2 (コンテキスト) ← _common/DESIGN_HARNESS_METHODOLOGY.md
Layer 3 (検証)         ← .claude/skills/design-harness-{vitest,playwright}.md
Layer 4 (フィードバック) ← log-failure / log-success skill
```

### 0.3 採用方針

- **必須採用**: 12 kind の `kind` 文字列 (`title` / `chat` / `stat` 等) は固定
- **カスタマイズ可**: 各 kind の追加プロパティ、accent カラー追加、装飾オプション
- **追加可**: プロジェクト固有 kind は `kind: "myProjectKind"` として discriminated union に追加

### 0.4 整合性ルール (DESIGN_HARNESS.md 参照)

本カタログを使うプロジェクトは以下のメタルールを守ること:

- **5-7 枚制約**: 1 章 / 1 レッスンのスライド数は 5-7 枚を基本とする
- **kind 多様性 ≥ 4**: 1 章内で 4 種類以上の kind を混在させる (chat/points 連発を防ぐ)
- **Layer 1 強制**:
  - スライドに数字 (N倍 / N% / N→M) を含む → `stat` or `highlight` 必須
  - 30 秒結論を含む → `bigConclusion` or `highlight` 必須
  - A vs B 対比 → `vs` 必須
  - 時系列圧縮 → `timeline` 必須

---

## 1. Slide kind の使い分けフロー

スライド 1 枚を設計するとき、以下の順で kind を判定する。

```
Q1. このスライドは「章の冒頭タイトル」か?
    └ Yes → title

Q2. キャラクター同士の会話形式が最適か?
    └ Yes → chat

Q3. 数字 (N倍 / N% / N→M / 桁) を視覚的に見せるか?
    └ Yes → stat (3 数字以下 grid)
            ※ 単一の中規模結論なら highlight でも可

Q4. 30 秒で覚えてほしい 1-2 文の結論か?
    └ Yes → bigConclusion (専用)
            ※ 中規模の結論 / 注意喚起なら highlight

Q5. A vs B の左右対比か?
    └ Yes → vs

Q6. 時系列を圧縮して見せるか? (例: 産業革命 100 年 → AI 革命 3 年)
    └ Yes → timeline

Q7. ✕ 悪い例 vs ◯ 良い例 のコード/プロンプト比較か?
    └ Yes → compare

Q8. 3-5 個の独立した要点を箇条書きしたいか?
    └ Yes → points

Q9. コードスニペット単独表示か?
    └ Yes → code

Q10. ハンズオン演習への導線か?
    └ Yes → exercise-cta

Q11. レッスン末尾のまとめか?
    └ Yes → summary

Q12. 上記のいずれでもない / 中規模の強調メッセージか?
    └ Yes → highlight
```

**判定原則**: Layer 1 強制ルール (数字 → stat / 結論 → bigConclusion / 対比 → vs / 時系列 → timeline)
は他より優先される。Q3-Q6 を最初に検討すること。

---

## 2. 12 種類の Slide kind 詳細

### 2.1 title — 章タイトル

- **用途**: 章 / レッスンの冒頭でテーマを宣言する
- **使うべきタイミング**: 各章の 1 枚目、新トピックへの切り替え
- **使うべきでないタイミング**: 中継ぎ、結論、要点リスト (それぞれ専用 kind を使う)
- **関連 Visual primitive**: `SlideTitle` (大型タイポ + サブタイトル)

```typescript
type TitleSlide = {
  kind: "title";
  title: string;
  sub?: string;
  /** タイトルスライドの装飾 */
  decoration?: "hero" | "none";
};
```

**レンダリング例**: 画面中央にメインタイトル (text-7xl 程度)、その下にサブタイトル (text-2xl 程度)。
背景に hero イラストを入れる場合は `decoration: "hero"` を指定する。

---

### 2.2 chat — キャラ会話

- **用途**: ナビゲーターキャラと学習者キャラの対話形式で概念を導入する
- **使うべきタイミング**: 概念の最初の説明、問いかけ、共感誘導
- **使うべきでないタイミング**: 数字提示、結論宣言 (chat のバブルだと埋もれる)
- **関連 Visual primitive**: `Bubble` / `Chat`

```typescript
type ChatSpeaker = "navigator" | "student";

interface ChatMessage {
  from: ChatSpeaker;
  /** 本文。string (シリアライズ可) を基本とする */
  content: string;
  /** 強調フレーズ (本文中の一致文字列を accent 色でハイライト) */
  highlights?: string[];
}

type ChatSlide = {
  kind: "chat";
  /** 上部の小見出し (任意) */
  heading?: string;
  messages: ReadonlyArray<ChatMessage>;
};
```

**レンダリング例**: LINE 風の左右バブル。`from: "navigator"` は左、`from: "student"` は右。
`highlights` で指定した文字列を `<span class="slide-emph">` でラップしてアクセント色化。

---

### 2.3 compare — 表形式比較 (悪い例 vs 良い例)

- **用途**: コード / プロンプト / 文章の Bad-Good 対比
- **使うべきタイミング**: スキル習得系で「正しいやり方」を示すとき
- **使うべきでないタイミング**: 数値対比 (`vs` を使う)、概念対比 (`points` で並列)
- **関連 Visual primitive**: `CodeBlock`

```typescript
interface CompareSide {
  /** 例のタイトル ("✕ 悪い例" / "◯ 良い例" 等) */
  label: string;
  /** コード / プロンプト本文 */
  code: string;
  /** 補足コメント */
  note: string;
}

type CompareSlide = {
  kind: "compare";
  heading: string;
  bad: CompareSide;
  good: CompareSide;
};
```

**レンダリング例**: 左カラム (赤系背景) に bad、右カラム (緑系背景) に good。
それぞれに label / CodeBlock / note を縦積み。スマホは縦 2 段で表示。

---

### 2.4 points — 箇条書き要点

- **用途**: 3-5 個の並列要素を番号付きで列挙
- **使うべきタイミング**: 「3 つのコツ」「5 つの落とし穴」等の構造化要約
- **使うべきでないタイミング**: 1-2 個の要点 (`highlight` で強調)、6 個以上 (情報過多 → 分割)
- **関連 Visual primitive**: `PointList`

```typescript
interface PointItem {
  title: string;
  desc?: string;
}

type PointsSlide = {
  kind: "points";
  heading: string;
  items: ReadonlyArray<PointItem>;
  /** 最後にナビゲーターからの一言 (任意) */
  navigatorOutro?: string;
};
```

**レンダリング例**: 番号バッジ (1, 2, 3...) + title + desc を縦並び。
末尾に `navigatorOutro` があればチャットバブル形式で追加。

---

### 2.5 highlight — 強調ボックス (中規模結論 / 注意喚起)

- **用途**: 1 文の中規模結論 / 注意喚起 / 重要な定義
- **使うべきタイミング**: 「ここだけは覚えて」レベル、bigConclusion ほど大きくしたくない結論
- **使うべきでないタイミング**: 30 秒結論 (`bigConclusion`)、数字 (`stat`)、対比 (`vs`)
- **関連 Visual primitive**: `HighlightBox`

```typescript
type HighlightColor = "teal" | "pink" | "amber" | "lime";

type HighlightSlide = {
  kind: "highlight";
  heading: string;
  color: HighlightColor;
  body: string;
};
```

**レンダリング例**: 薄色 (teal-50 等) の背景ボックスに body を中型タイポ (text-2xl) で表示。
heading は上部に小見出し。

---

### 2.6 stat — 巨大数字

- **用途**: 数字 (N倍 / N% / N→M / 桁) を視覚インパクトで伝える
- **使うべきタイミング**: 規模感の提示、ビフォーアフター数値、Layer 1 強制 (数字スライド)
- **使うべきでないタイミング**: 数字が 1 つもない、概念のみ (highlight や points を使う)
- **関連 Visual primitive**: `BigNumber`

```typescript
type StatAccent = "teal" | "pink" | "amber" | "violet" | "navy";

type StatSlide = {
  kind: "stat";
  title?: string;
  stats: ReadonlyArray<{
    /** 巨大表示する文字列。例: "2倍" / "17→50%" / "数十倍" */
    number: string;
    /** 単位 / 主題 (数字下の中サイズ)。例: "実質賃金" */
    unit?: string;
    /** 出典 / 年代等の補足 (小サイズ) */
    caption?: string;
    /** アクセント絵文字 / アイコン名 */
    icon?: string;
    /** 色アクセント */
    accent?: StatAccent;
  }>;
  /** 全体のまとめコメント */
  bottomNote?: string;
};
```

**レンダリング例**: 1-3 列 grid に `BigNumber` を並べ、各カードに number / unit / caption。
スライド下部に `bottomNote` (text-xl) でまとめコメント。
6 文字以上 number を含む場合は 2 列に落とす (BigNumber 側でフォントも段階縮小)。

---

### 2.7 vs — 左右対比

- **用途**: A vs B の二項対立を中央セパレータで対比表示
- **使うべきタイミング**: 「過去 vs 現在」「自社 vs 競合」「方法 A vs 方法 B」
- **使うべきでないタイミング**: 3 項以上の対比 (`stat` 3 列 or `timeline`)、コード対比 (`compare`)
- **関連 Visual primitive**: `ComparisonGrid`

```typescript
interface VsSide {
  /** ラベル (上部・小サイズ) */
  label: string;
  /** 主値 (中央・巨大表示) */
  value: string;
  /** 補足 (下部・小サイズ) */
  sub?: string;
  /** アイコン (絵文字 / アイコン名) */
  icon?: string;
  /** 色アクセント */
  accent?: StatAccent;
}

type VsSlide = {
  kind: "vs";
  title?: string;
  left: VsSide;
  right: VsSide;
  /** 中央セパレータ。例: "VS" / "→" */
  separator?: string;
  bottomNote?: string;
};
```

**レンダリング例**: `1fr | auto | 1fr` の grid。中央に "VS" 文字、左右にカード。
スマホは縦積み 2 段、セパレータは中央に短縮表示。

---

### 2.8 timeline — 時系列圧縮

- **用途**: 時系列イベントを圧縮表示し「時間軸が縮まっている」を伝える
- **使うべきタイミング**: 「産業革命 100 年 → IT 革命 30 年 → AI 革命 3 年」型の圧縮提示
- **使うべきでないタイミング**: 順序のないリスト (`points`)、2 項目だけ (`vs`)
- **関連 Visual primitive**: `TimelinePill`

```typescript
type TimelineSlide = {
  kind: "timeline";
  title?: string;
  nodes: ReadonlyArray<{
    /** ノード名。例: "産業革命" */
    label: string;
    /** 期間表記。例: "100 年" */
    duration: string;
    /** 補足。例: "1750-1850" */
    note?: string;
    accent?: StatAccent;
  }>;
  bottomNote?: string;
};
```

**レンダリング例**: 横並び pill 群を矢印 (→) で連結。各 pill に label / duration / note。
スマホは縦並び (矢印は ↓ ではなく → 維持で改行)。

---

### 2.9 bigConclusion — 30 秒結論専用

- **用途**: 章の最後に「30 秒で覚えてほしい結論」を巨大表示
- **使うべきタイミング**: 章末の単一結論 (1-2 文)、Layer 1 強制 (結論スライド)
- **使うべきでないタイミング**: 中規模結論 (`highlight`)、複数要点 (`points`)
- **関連 Visual primitive**: `AccentBox`

```typescript
type BigConclusionSlide = {
  kind: "bigConclusion";
  /** 巨大表示する 1-2 文 */
  conclusion: string;
  /** 出典 */
  source?: string;
  /** 次レッスンへの予告 */
  next?: string;
};
```

**レンダリング例**: 画面中央に `AccentBox` (グラデ背景 + シャドウ) で conclusion を大型タイポ表示
(text-2xl md:text-3xl lg:text-4xl)。下部に source (小) と next (中) を縦積み。

---

### 2.10 exercise-cta — 演習導線 (学習系のみ)

- **用途**: ハンズオン演習へ遷移する CTA ボタン
- **使うべきタイミング**: 学習系プロジェクトで概念説明後の実践導線
- **使うべきでないタイミング**: 一般プレゼン / マーケ系 (演習を持たない)
- **関連 Visual primitive**: `CTAButton`

```typescript
type ExerciseCtaSlide = {
  kind: "exercise-cta";
  heading: string;
  description: string;
  /** コース内の演習インデックス (0 始まり) */
  exerciseIndex: number;
  /** ボタン文言 (デフォルト「演習を始める」) */
  ctaLabel?: string;
};
```

**レンダリング例**: heading + description を中央寄せで縦積み、その下に大きな pink 系 CTA ボタン。
クリックで `onExerciseStart(exerciseIndex)` ハンドラ呼び出し。

---

### 2.11 summary — まとめ (任意)

- **用途**: レッスン / 章末の簡潔なまとめリスト
- **使うべきタイミング**: 受講後に持ち帰ってほしい 3-5 項目を残す
- **使うべきでないタイミング**: 単一結論 (`bigConclusion`)、中規模強調 (`highlight`)
- **関連 Visual primitive**: `SlideTitle` + `<ul>` + `CTAButton`

```typescript
type SummarySlide = {
  kind: "summary";
  heading: string;
  items: ReadonlyArray<string>;
  /** 「次のレッスンへ」ボタンを表示するか */
  showNextButton?: boolean;
};
```

**レンダリング例**: heading + シンプル `<ul>` リスト + (任意) navy 系「次のレッスンへ →」ボタン。
items は 3-5 個推奨、6 個以上は情報過多。

---

### 2.12 code — コードスニペット

- **用途**: コード単独表示 (比較なし)
- **使うべきタイミング**: 1 つのサンプルコードを丁寧に解説する
- **使うべきでないタイミング**: Bad/Good 比較 (`compare`)、結論 (`bigConclusion`)
- **関連 Visual primitive**: `CodeBlock`

```typescript
type CodeSlide = {
  kind: "code";
  heading?: string;
  code: string;
  /** 上部の uppercase ラベル (言語名 / ファイル名等) */
  lang?: string;
};
```

**レンダリング例**: 上部に小見出し (heading) と言語ラベル (lang)。
黒背景 + 等幅フォントの `<pre>` でコードを表示。

---

## 3. 4 種類の Visual primitives 詳細

各 primitive は単独テスト可能 (props 明確 / 副作用なし) を原則とする。
Tailwind v4 の token (--teal-* / --pink-* / --navy-* 等) を使用し、ハードコードカラーは禁止。

### 3.1 BigNumber — 巨大数字 + 単位 + サブ + アクセント

- **用途**: 数字を視覚インパクトで提示する基本 atom
- **関連 Slide kind**: `stat`
- **スマホ対応注意点**: 文字数で段階縮小 (≤3 文字: `text-7xl md:text-8xl lg:text-9xl` /
  4-5 文字: `text-5xl md:text-7xl lg:text-8xl` / ≥6 文字: `text-4xl md:text-6xl lg:text-7xl`)

```typescript
interface BigNumberProps {
  /** 巨大表示する文字列 ("2倍" / "17→50%") */
  number: string;
  /** 単位 / 主題 ("実質賃金") */
  unit?: string;
  /** 補足 ("1770→1870 英国") */
  caption?: string;
  /** 絵文字 / アイコン */
  icon?: string;
  /** 色アクセント (デフォルト teal) */
  accent?: StatAccent;
  /** グラデーション背景を有効化 */
  gradient?: boolean;
}
```

**実装サンプル (簡略版)**:

```tsx
function bigNumberFontClass(number: string): string {
  // Array.from で surrogate pair / 絵文字を 1 文字でカウント
  const len = Array.from(number).length;
  if (len <= 3) return "text-7xl md:text-8xl lg:text-9xl";
  if (len <= 5) return "text-5xl md:text-7xl lg:text-8xl";
  return "text-4xl md:text-6xl lg:text-7xl";
}

export function BigNumber({
  number,
  unit,
  caption,
  icon,
  accent = "teal",
  gradient = false,
}: BigNumberProps) {
  const containerClass = gradient
    ? `flex flex-col items-center rounded-3xl bg-gradient-to-br ${ACCENT_GRADIENT[accent]} px-6 py-8 ring-1 ${ACCENT_RING[accent]} shadow-2xl`
    : "flex flex-col items-center px-4 py-6";
  return (
    <div className={containerClass}>
      {icon ? <div className="text-3xl md:text-5xl mb-2" aria-hidden>{icon}</div> : null}
      <div
        className={`font-display font-black leading-none tracking-tight tabular-nums break-keep text-center ${bigNumberFontClass(number)} ${ACCENT_TEXT[accent]}`}
      >
        {number}
      </div>
      {unit ? <div className="mt-3 text-xl md:text-2xl font-bold text-center">{unit}</div> : null}
      {caption ? <div className="mt-1 text-sm md:text-base text-ink-mute text-center">{caption}</div> : null}
    </div>
  );
}
```

---

### 3.2 ComparisonGrid — 左右対比 (icon / 数字 / ラベル / セパレータ)

- **用途**: A vs B の対比表示 (中央セパレータ付き)
- **関連 Slide kind**: `vs`
- **スマホ対応注意点**: `grid-cols-1 md:grid-cols-[1fr_auto_1fr]` で md 未満は縦積み。
  セパレータ文字は `md:text-5xl` で md 以上で大型表示。

```typescript
interface ComparisonGridProps {
  left: VsSide;
  right: VsSide;
  /** 中央テキスト (デフォルト "VS") */
  separator?: string;
}
```

**実装サンプル (簡略版)**:

```tsx
export function ComparisonGrid({
  left,
  right,
  separator = "VS",
}: ComparisonGridProps) {
  const leftAccent = left.accent ?? "navy";
  const rightAccent = right.accent ?? "teal";
  return (
    <div className="w-full max-w-[1500px] grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-8 items-stretch">
      <ComparisonSide side={left} accent={leftAccent} />
      <div className="flex items-center justify-center">
        <div
          className="text-3xl md:text-5xl font-black tracking-widest text-ink-mute select-none"
          aria-hidden
        >
          {separator}
        </div>
      </div>
      <ComparisonSide side={right} accent={rightAccent} />
    </div>
  );
}

function ComparisonSide({ side, accent }: { side: VsSide; accent: StatAccent }) {
  return (
    <div
      className={`flex flex-col items-center rounded-3xl bg-gradient-to-br ${ACCENT_GRADIENT[accent]} ring-1 ${ACCENT_RING[accent]} px-6 py-8 md:px-10 md:py-12 shadow-xl`}
    >
      {side.icon ? <div className="text-3xl md:text-5xl mb-2" aria-hidden>{side.icon}</div> : null}
      <div className="text-base md:text-lg font-bold text-ink-mute uppercase tracking-wider">
        {side.label}
      </div>
      <div
        className={`mt-2 font-display font-black leading-none text-5xl md:text-7xl lg:text-8xl ${ACCENT_TEXT[accent]}`}
      >
        {side.value}
      </div>
      {side.sub ? <div className="mt-3 text-sm md:text-base">{side.sub}</div> : null}
    </div>
  );
}
```

---

### 3.3 TimelinePill — 時系列ノード

- **用途**: 時系列イベントを横並び pill + 矢印で表示
- **関連 Slide kind**: `timeline`
- **スマホ対応注意点**: `flex-col md:flex-row` で md 未満は縦積み。
  接続矢印 → は `text-2xl md:text-3xl` で md 以上で拡大。

```typescript
interface TimelinePillProps {
  nodes: ReadonlyArray<{
    label: string;
    duration: string;
    note?: string;
    accent?: StatAccent;
  }>;
}
```

**実装サンプル (簡略版)**:

```tsx
export function TimelinePill({ nodes }: TimelinePillProps) {
  return (
    <div className="w-full max-w-[1500px] flex flex-col md:flex-row items-stretch md:items-center justify-center gap-4 md:gap-2">
      {nodes.map((node, i) => {
        const accent = node.accent ?? "teal";
        return (
          <div
            key={i}
            className="flex flex-col md:flex-row items-stretch md:items-center flex-1"
          >
            <div
              className={`flex flex-col items-center rounded-2xl bg-gradient-to-br ${ACCENT_GRADIENT[accent]} ring-1 ${ACCENT_RING[accent]} px-4 py-5 md:px-6 md:py-7 shadow-lg flex-1`}
            >
              <div className="text-sm md:text-base font-bold text-ink-mute uppercase tracking-wider">
                {node.label}
              </div>
              <div
                className={`mt-1 font-display font-black leading-none text-3xl md:text-5xl lg:text-6xl ${ACCENT_TEXT[accent]}`}
              >
                {node.duration}
              </div>
              {node.note ? (
                <div className="mt-2 text-xs md:text-sm text-ink-mute text-center">{node.note}</div>
              ) : null}
            </div>
            {i < nodes.length - 1 ? (
              <div
                className="flex items-center justify-center text-2xl md:text-3xl text-ink-faint font-black px-2 py-2"
                aria-hidden
              >
                →
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
```

---

### 3.4 AccentBox — 結論強調カード (グラデ + シャドウ + 大型タイポ)

- **用途**: 30 秒結論 / 重要メッセージ用の最大強調カード
- **関連 Slide kind**: `bigConclusion`
- **スマホ対応注意点**: size 別に段階縮小 (lg: `text-2xl md:text-3xl lg:text-4xl` /
  md: `text-xl md:text-2xl`)。padding は md 以上で拡大 (`px-8 py-10 md:px-12 md:py-14`)。

```typescript
interface AccentBoxProps {
  children: React.ReactNode;
  /** 色アクセント (デフォルト teal) */
  accent?: StatAccent;
  /** 大きさ (デフォルト "lg") */
  size?: "md" | "lg";
}
```

**実装サンプル (簡略版)**:

```tsx
export function AccentBox({
  children,
  accent = "teal",
  size = "lg",
}: AccentBoxProps) {
  const sizeClass =
    size === "lg"
      ? "text-2xl md:text-3xl lg:text-4xl"
      : "text-xl md:text-2xl";
  return (
    <div
      className={`w-full max-w-[1200px] rounded-3xl bg-gradient-to-br ${ACCENT_GRADIENT[accent]} ring-1 ${ACCENT_RING[accent]} px-8 py-10 md:px-12 md:py-14 shadow-2xl`}
    >
      <div
        className={`font-display font-black leading-snug ${sizeClass} ${ACCENT_TEXT[accent]} whitespace-pre-line`}
      >
        {children}
      </div>
    </div>
  );
}
```

---

### 3.5 共通 token テーブル (参考)

各 primitive で共有する accent map の例:

```typescript
const ACCENT_TEXT: Record<StatAccent, string> = {
  teal: "text-teal-700",
  pink: "text-pink-600",
  amber: "text-amber-500",
  violet: "text-violet-600",
  navy: "text-navy-800",
};

const ACCENT_GRADIENT: Record<StatAccent, string> = {
  teal: "from-teal-50 to-sky-50",
  pink: "from-pink-100 to-sky-50",
  amber: "from-amber-100 to-sky-50",
  violet: "from-violet-100 to-sky-50",
  navy: "from-navy-50 to-sky-50",
};

const ACCENT_RING: Record<StatAccent, string> = {
  teal: "ring-teal-500/30",
  pink: "ring-pink-500/30",
  amber: "ring-amber-500/30",
  violet: "ring-violet-500/30",
  navy: "ring-navy-200/50",
};
```

---

## 4. スマホレスポンシブ原則

### 4.1 段階縮小ルール

スマホ (390px) → タブレット (md, 768px) → デスクトップ (lg, 1024px) で 3 段階縮小する。

| 用途 | sm (default) | md (≥768) | lg (≥1024) |
|------|--------------|-----------|------------|
| 巨大数字 (≤3 文字) | text-7xl | md:text-8xl | lg:text-9xl |
| 巨大数字 (4-5 文字) | text-5xl | md:text-7xl | lg:text-8xl |
| 巨大数字 (≥6 文字) | text-4xl | md:text-6xl | lg:text-7xl |
| 結論 (AccentBox lg) | text-2xl | md:text-3xl | lg:text-4xl |
| vs/timeline 主値 | text-5xl | md:text-7xl | lg:text-8xl |
| カード見出し | text-base | md:text-lg | — |

### 4.2 grid / flex 切替ルール

- 2 列以上の grid は `grid-cols-1 md:grid-cols-N` で md 未満は縦 1 列に落とす
- 横並び (vs / timeline) は `flex-col md:flex-row` で md 未満は縦積み
- セパレータ ("VS" / "→") は `md:` プレフィクスで md 以上で大型表示

### 4.3 文字数オーバーフロー対策

- 巨大数字: `Array.from(number).length` で文字数判定 (surrogate pair / 絵文字対応)
- カード幅圧迫対策: stat スライドで 6 文字以上 number があれば 3 列 → 2 列に落とす
- `min-w-0 overflow-hidden break-keep` で grid 内オーバーフロー防止

---

## 5. アクセシビリティ要件 (WCAG 2.1 AA)

### 5.1 コントラスト

| 用途 | 比率 |
|------|------|
| 通常テキスト (< 18px) | 4.5:1 以上 |
| 大型テキスト (18px bold / 24px regular 以上) | 3:1 以上 |
| UI 境界 / アイコン | 3:1 以上 |

各 accent の text 色は `--<color>-700` 以上のダーク値を使い、白背景で 4.5:1 を確保する。

### 5.2 ARIA / 装飾

- 装飾アイコン (絵文字含む) は `aria-hidden="true"`
- セパレータ ("VS" / "→") は `aria-hidden="true"` + `select-none`
- 巨大数字 (BigNumber) は `unit` / `caption` がスクリーンリーダーで読まれることを前提に number 自体は装飾扱い OK

### 5.3 キーボード

- `exercise-cta` の CTAButton は `<button type="button">` を使い、Enter / Space で起動可能にする
- focus 時は `focus-visible:outline-2 focus-visible:outline-offset-2` の標準パターンを適用

### 5.4 motion / アニメーション

- 段階縮小は CSS のみ (transition なし) を基本
- `prefers-reduced-motion: reduce` 時はトランジション無効化

---

## 6. 実装サンプルへのリンク (参考)

本カタログの実装リファレンスは以下のプロジェクトで動作確認済 (Design Harness Initiative の元実装):

| 概念 | 参照ファイル |
|------|------------|
| Slide kind discriminated union | `components/slides/types.ts` |
| Visual primitives (BigNumber 等) | `components/slides/primitives.tsx` |
| SlideRenderer (kind → component dispatch) | `components/slides/SlideRenderer.tsx` |
| Vitest 構造検証例 (Layer 1 強制) | `tests/unit/design-harness/slide-rules.test.ts` |
| Playwright snapshot 検証例 | `e2e/design-harness/slide-snapshots.spec.ts` |

各プロジェクトで採用する際は、上記ファイルをコピーした上で:

1. `kind` 文字列 (`title` / `chat` / 等) は変更しない
2. accent カラーはプロジェクトのブランドトークンに置き換える
3. 不要な kind は discriminated union から除外して良い (代わりに strict-mode tsc で網羅チェック)
4. プロジェクト固有 kind は末尾に追加し、SlideRenderer の switch 文に case を追加する

---

## 付録: チェックリスト

新規プロジェクトで本カタログを採用する際:

- [ ] 12 kind から自プロジェクトに必要な kind を選定 (最低 4 種)
- [ ] `components/slides/types.ts` に discriminated union を定義
- [ ] `components/slides/primitives.tsx` に必要な primitive を実装
- [ ] `SlideRenderer.tsx` の switch 文を kind 網羅で実装 (strict mode)
- [ ] DESIGN_HARNESS.md (Layer 1) で「数字 → stat 必須」等のルールを明記
- [ ] Vitest で kind 多様性 ≥ 4 / 5-7 枚制約を検証 (Story 4)
- [ ] Playwright で 390px / 768px / 1280px snapshot を取得 (Story 5)
- [ ] アクセシビリティ (コントラスト / ARIA / キーボード) を audit
