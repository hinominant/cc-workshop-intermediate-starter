# Complexity Metrics Reference

Zenがリファクタリング対象を優先順位付けするための複雑度メトリクス。閾値、計算方法、削減テクニックを記載。

---

## 1. Cyclomatic Complexity (循環的複雑度)

**定義:** 関数内の独立した実行パスの数。分岐 (`if`, `else if`, `case`, `&&`, `||`, `?:`, `catch`) ごとに +1。

**計算:** `CC = 1 + (分岐の数)`

```typescript
// CC = 1 (分岐なし)
function add(a: number, b: number) { return a + b; }

// CC = 4 (if + else if + && で3分岐)
function getDiscount(customer: Customer) {
  if (customer.isVIP && customer.years > 5) {  // +2 (if + &&)
    return 0.2;
  } else if (customer.years > 2) {              // +1 (else if)
    return 0.1;
  }
  return 0;
}
```

**閾値:**

| CC | 判定 | アクション |
|----|------|-----------|
| 1-5 | OK | 対応不要 |
| 6-10 | 注意 | 改善を検討 |
| 11-20 | 警告 | リファクタリング推奨 |
| 21+ | 危険 | リファクタリング必須 |

**削減テクニック:**
- Extract Function でブランチを分離
- Guard Clauses で早期リターン
- Replace Conditional with Polymorphism
- Strategy パターンで分岐をオブジェクトに置換
- Lookup table (Map/Object) で switch を排除

---

## 2. Cognitive Complexity (認知的複雑度)

**定義:** 人間がコードを理解するのに必要な精神的負荷。Cyclomatic Complexityとの違いは、ネストの深さにペナルティを与えること。

**計算ルール:**
- 分岐・ループごとに +1 (基本加算)
- ネストレベルごとに追加 +1 (ネスト加算)
- `else if` はネストせず +1 (フラット加算)
- `break`/`continue` to label に +1

```typescript
// Cognitive = 1 (if: +1)
function isValid(x: number) {
  if (x > 0) return true;  // +1
  return false;
}

// Cognitive = 7
function processOrder(order: Order) {
  if (order.items.length > 0) {            // +1 (nesting 0)
    for (const item of order.items) {      // +2 (nesting 1)
      if (item.quantity > 0) {             // +3 (nesting 2)
        process(item);
      }
    }
  } else {                                 // +1 (else, no nesting penalty)
    throw new Error("empty");
  }
}
```

**閾値:** 関数あたり15以下を目標。20超は必ずリファクタ。

**Cyclomatic vs Cognitive の使い分け:**
- Cyclomatic: テストケース数の見積もりに使う
- Cognitive: コードレビューの読みやすさ判定に使う

---

## 3. Nesting Depth (ネスト深度)

**閾値:** 最大3-4レベル。5レベル以上は必ずリファクタ。

**削減テクニック:**

```typescript
// BAD: ネスト4レベル
function process(data: Data[]) {
  if (data) {
    for (const item of data) {
      if (item.isActive) {
        if (item.hasPermission) {
          doWork(item);
        }
      }
    }
  }
}

// GOOD: Guard Clauses + Extract Function
function process(data: Data[]) {
  if (!data) return;
  for (const item of data) {
    processItem(item);
  }
}

function processItem(item: Data) {
  if (!item.isActive) return;
  if (!item.hasPermission) return;
  doWork(item);
}
```

---

## 4. File Length (ファイル長)

| 行数 | 判定 | アクション |
|------|------|-----------|
| ~200 | OK | 理想的 |
| 201-300 | 注意 | 次の変更時に分割検討 |
| 301-500 | 警告 | 分割計画を立てる |
| 501+ | 危険 | 即座に分割 |

**分割戦略:**
1. 責務で分割 (Single Responsibility)
2. 公開API vs 内部ヘルパーで分割
3. データ型定義を別ファイルに抽出
4. テストヘルパーを `__tests__/helpers/` に移動
5. 定数・設定値を `constants.ts` / `config.ts` に分離

---

## 5. Function Length (関数長)

| 行数 | 判定 | アクション |
|------|------|-----------|
| ~20 | OK | 理想的 |
| 21-30 | 注意 | 改善の余地あり |
| 31-40 | 警告 | Extract Function を検討 |
| 41+ | 危険 | 必ず分割 |

**抽出トリガー:**
- コメントでブロックが区切られている → 各ブロックを関数に
- 変数の生存範囲が関数全体ではなくブロック内 → ブロックを関数に
- try-catch の中身が長い → try 内のロジックを関数に
- コールバック/Promise チェーンが深い → 各ステップを関数に

---

## 6. Parameter Count (パラメータ数)

| 個数 | 判定 | アクション |
|------|------|-----------|
| 0-2 | OK | 理想的 |
| 3 | 注意 | 関連性があるなら許容 |
| 4-5 | 警告 | Parameter Object を検討 |
| 6+ | 危険 | 必ず Parameter Object 化 |

**対処パターン:**
```typescript
// BAD: 6 parameters
function createUser(name: string, email: string, age: number,
                    role: string, team: string, startDate: Date) {}

// GOOD: Parameter Object
interface CreateUserInput {
  name: string;
  email: string;
  age: number;
  role: string;
  team: string;
  startDate: Date;
}
function createUser(input: CreateUserInput) {}
```

---

## 7. Import Count (インポート数)

| 個数 | 判定 | アクション |
|------|------|-----------|
| ~7 | OK | 適切なモジュール境界 |
| 8-10 | 注意 | 依存関係を確認 |
| 11-15 | 警告 | モジュール境界の再設計を検討 |
| 16+ | 危険 | God Module。分割必須 |

**シグナル:**
- 異なるドメインからのimportが混在 → 責務が分離されていない
- 同一ディレクトリからのimportが5つ以上 → モジュール内でファサードを検討
- `../../../` のような深い相対パスが多い → モジュール構造の見直し

---

## 計測ツール

| ツール | 言語 | メトリクス |
|--------|------|-----------|
| `eslint-plugin-complexity` | JS/TS | Cyclomatic Complexity |
| `ts-complexity` | TypeScript | Cyclomatic, Cognitive |
| `complexity-report` | JS | Halstead, Cyclomatic, Maintainability Index |
| `radon` | Python | Cyclomatic, Maintainability |
| `gocyclo` | Go | Cyclomatic Complexity |
| `rubocop` | Ruby | Method Length, Cyclomatic, Perceived Complexity |

**ESLint設定例:**
```json
{
  "rules": {
    "complexity": ["warn", 10],
    "max-depth": ["warn", 3],
    "max-lines-per-function": ["warn", { "max": 40 }],
    "max-params": ["warn", 4],
    "max-lines": ["warn", { "max": 300 }]
  }
}
```
