# Refactoring Catalog

Zenが使用するリファクタリングパターンのカタログ。各パターンにトリガー条件、Before/Afterコード例、リスクレベルを記載。

---

## Decision Tree: どのリファクタリングが必要か

```
コードの問題は何か?
├── 関数が長すぎる / コメントでブロック説明
│   └── Extract Function
├── 変数が1回しか使われない / 意味を追加していない
│   └── Inline Variable
├── 式が複雑で何をしているか分からない
│   └── Extract Variable
├── 関数名が実際の動作と合っていない
│   └── Change Function Declaration / Rename Function
├── パラメータが4つ以上ある
│   └── Introduce Parameter Object
├── 同じデータグループが複数の関数に渡されている
│   └── Introduce Parameter Object
├── 条件分岐が深くネストしている
│   ├── 早期リターンで解決可能 → Replace Nested Conditional with Guard Clauses
│   ├── 条件式自体が複雑 → Decompose Conditional
│   ├── 同条件の分岐が散在 → Consolidate Conditional Expression
│   └── 型による分岐 → Replace Conditional with Polymorphism
├── 関連する関数群がバラバラに存在
│   └── Combine Functions into Class
├── 1つの関数が2フェーズの処理をしている
│   └── Split Phase
├── グローバル変数 / 広スコープ変数への直接アクセス
│   └── Encapsulate Variable
├── 使われていないコードがある
│   └── Remove Dead Code
└── 関数が単純すぎて呼び出し元を読みにくくしている
    └── Inline Function
```

---

## 1. Extract Function

**トリガー:** コードブロックにコメントが付いている、関数が40行超、ブロックの目的を一言で説明できる

**リスク:** Low

```typescript
// Before
function printOwing(invoice: Invoice) {
  let outstanding = 0;

  // calculate outstanding
  for (const o of invoice.orders) {
    outstanding += o.amount;
  }

  // print details
  console.log(`name: ${invoice.customer}`);
  console.log(`amount: ${outstanding}`);
}

// After
function printOwing(invoice: Invoice) {
  const outstanding = calculateOutstanding(invoice);
  printDetails(invoice, outstanding);
}

function calculateOutstanding(invoice: Invoice): number {
  return invoice.orders.reduce((sum, o) => sum + o.amount, 0);
}

function printDetails(invoice: Invoice, outstanding: number) {
  console.log(`name: ${invoice.customer}`);
  console.log(`amount: ${outstanding}`);
}
```

---

## 2. Inline Function

**トリガー:** 関数本体が名前と同程度に明確、間接参照が読みにくさを増している

**リスク:** Low

```typescript
// Before
function getRating(driver: Driver): number {
  return moreThanFiveLateDeliveries(driver) ? 2 : 1;
}
function moreThanFiveLateDeliveries(driver: Driver): boolean {
  return driver.numberOfLateDeliveries > 5;
}

// After
function getRating(driver: Driver): number {
  return driver.numberOfLateDeliveries > 5 ? 2 : 1;
}
```

---

## 3. Extract Variable

**トリガー:** 式が長く、部分式に意味のある名前を付けられる

**リスク:** Low

```typescript
// Before
return order.quantity * order.itemPrice -
  Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 +
  Math.min(order.quantity * order.itemPrice * 0.1, 100);

// After
const basePrice = order.quantity * order.itemPrice;
const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
const shipping = Math.min(basePrice * 0.1, 100);
return basePrice - quantityDiscount + shipping;
```

---

## 4. Inline Variable

**トリガー:** 変数が1回しか使われず、右辺の式で十分意味が伝わる

**リスク:** Low

```typescript
// Before
const basePrice = order.basePrice;
return basePrice > 1000;

// After
return order.basePrice > 1000;
```

---

## 5. Change Function Declaration (Rename Function)

**トリガー:** 関数名が実際の動作を反映していない、パラメータの追加/削除が必要

**リスク:** Medium (パブリックAPIの場合はHigh)

```typescript
// Before
function circum(radius: number): number {
  return 2 * Math.PI * radius;
}

// After
function circumference(radius: number): number {
  return 2 * Math.PI * radius;
}
```

---

## 6. Encapsulate Variable

**トリガー:** 広スコープの変数に複数箇所からアクセスしている、変更時の影響範囲が不明確

**リスク:** Medium

```typescript
// Before
let defaultOwner = { firstName: "Martin", lastName: "Fowler" };

// 複数箇所で直接参照・変更
spaceship.owner = defaultOwner;
defaultOwner = { firstName: "Rebecca", lastName: "Parsons" };

// After
let _defaultOwner = { firstName: "Martin", lastName: "Fowler" };
export function getDefaultOwner() { return structuredClone(_defaultOwner); }
export function setDefaultOwner(owner: Owner) { _defaultOwner = owner; }

spaceship.owner = getDefaultOwner();
setDefaultOwner({ firstName: "Rebecca", lastName: "Parsons" });
```

---

## 7. Rename Variable

**トリガー:** 変数名が `data`, `info`, `result`, `temp`, `obj` など汎用的すぎる

**リスク:** Low (ローカル) / Medium (エクスポート)

```typescript
// Before
const a = height * width;

// After
const area = height * width;
```

---

## 8. Introduce Parameter Object

**トリガー:** 関連するパラメータが3つ以上セットで渡されている、同じパラメータグループが複数関数に出現

**リスク:** Medium

```typescript
// Before
function amountInvoiced(startDate: Date, endDate: Date): number { /* ... */ }
function amountReceived(startDate: Date, endDate: Date): number { /* ... */ }
function amountOverdue(startDate: Date, endDate: Date): number { /* ... */ }

// After
interface DateRange {
  start: Date;
  end: Date;
}
function amountInvoiced(range: DateRange): number { /* ... */ }
function amountReceived(range: DateRange): number { /* ... */ }
function amountOverdue(range: DateRange): number { /* ... */ }
```

---

## 9. Combine Functions into Class

**トリガー:** 複数の関数が同じデータを受け取って操作している、関連関数がモジュール内に散在

**リスク:** Medium

```typescript
// Before
function baseRate(month: number, year: number): number { /* ... */ }
function taxThreshold(year: number): number { /* ... */ }
function calculateCharge(customer: Customer, month: number, year: number): number {
  return baseRate(month, year) * customer.usage - taxThreshold(year);
}

// After
class BillingCalculator {
  constructor(private month: number, private year: number) {}

  baseRate(): number { /* ... */ }
  taxThreshold(): number { /* ... */ }
  calculateCharge(customer: Customer): number {
    return this.baseRate() * customer.usage - this.taxThreshold();
  }
}
```

---

## 10. Split Phase

**トリガー:** 1つの関数が明確に2つの異なるフェーズ（解析→計算、取得→変換など）を持つ

**リスク:** Medium

```typescript
// Before
function priceOrder(product: Product, quantity: number, shippingMethod: ShippingMethod) {
  const basePrice = product.basePrice * quantity;
  const discount = Math.max(quantity - 500, 0) * product.basePrice * 0.05;
  const shippingPerCase = (basePrice > 1000) ? shippingMethod.discountedFee : shippingMethod.feePerCase;
  const shippingCost = quantity * shippingPerCase;
  return basePrice - discount + shippingCost;
}

// After
interface PricingData {
  basePrice: number;
  quantity: number;
  discount: number;
}

function priceOrder(product: Product, quantity: number, shippingMethod: ShippingMethod) {
  const pricingData = calculatePricingData(product, quantity);
  return applyShipping(pricingData, shippingMethod);
}

function calculatePricingData(product: Product, quantity: number): PricingData {
  const basePrice = product.basePrice * quantity;
  const discount = Math.max(quantity - 500, 0) * product.basePrice * 0.05;
  return { basePrice, quantity, discount };
}

function applyShipping(pricing: PricingData, shippingMethod: ShippingMethod): number {
  const shippingPerCase = (pricing.basePrice > 1000)
    ? shippingMethod.discountedFee
    : shippingMethod.feePerCase;
  return pricing.basePrice - pricing.discount + pricing.quantity * shippingPerCase;
}
```

---

## 11. Replace Conditional with Polymorphism

**トリガー:** switch文やif-elseチェーンがtype/kindフィールドで分岐し、同じ分岐が複数箇所に存在

**リスク:** High

```typescript
// Before
function calculatePay(employee: Employee): number {
  switch (employee.type) {
    case "engineer":
      return employee.monthlySalary;
    case "salesperson":
      return employee.monthlySalary + employee.commission;
    case "manager":
      return employee.monthlySalary + employee.bonus;
    default:
      throw new Error(`Unknown type: ${employee.type}`);
  }
}

// After
interface Employee {
  calculatePay(): number;
}

class Engineer implements Employee {
  constructor(private monthlySalary: number) {}
  calculatePay() { return this.monthlySalary; }
}

class Salesperson implements Employee {
  constructor(private monthlySalary: number, private commission: number) {}
  calculatePay() { return this.monthlySalary + this.commission; }
}

class Manager implements Employee {
  constructor(private monthlySalary: number, private bonus: number) {}
  calculatePay() { return this.monthlySalary + this.bonus; }
}
```

---

## 12. Decompose Conditional

**トリガー:** 条件式が複雑で、何を判定しているかコードを読むだけでは分からない

**リスク:** Low

```typescript
// Before
if (date.isBefore(plan.summerStart) || date.isAfter(plan.summerEnd)) {
  charge = quantity * plan.winterRate + plan.winterServiceCharge;
} else {
  charge = quantity * plan.summerRate;
}

// After
if (isSummer(date, plan)) {
  charge = summerCharge(quantity, plan);
} else {
  charge = winterCharge(quantity, plan);
}

function isSummer(date: Date, plan: Plan) {
  return !date.isBefore(plan.summerStart) && !date.isAfter(plan.summerEnd);
}
function summerCharge(quantity: number, plan: Plan) {
  return quantity * plan.summerRate;
}
function winterCharge(quantity: number, plan: Plan) {
  return quantity * plan.winterRate + plan.winterServiceCharge;
}
```

---

## 13. Consolidate Conditional Expression

**トリガー:** 複数の条件が同じ結果を返す、条件を1つの意味ある名前でまとめられる

**リスク:** Low

```typescript
// Before
function disabilityAmount(employee: Employee): number {
  if (employee.seniority < 2) return 0;
  if (employee.monthsDisabled > 12) return 0;
  if (employee.isPartTime) return 0;
  // calculate disability amount...
  return baseAmount;
}

// After
function disabilityAmount(employee: Employee): number {
  if (isNotEligibleForDisability(employee)) return 0;
  // calculate disability amount...
  return baseAmount;
}

function isNotEligibleForDisability(employee: Employee): boolean {
  return employee.seniority < 2
    || employee.monthsDisabled > 12
    || employee.isPartTime;
}
```

---

## 14. Replace Nested Conditional with Guard Clauses

**トリガー:** ネストが3レベル以上、早期リターンで平坦化できる

**リスク:** Low

```typescript
// Before
function getPayAmount(employee: Employee): number {
  let result: number;
  if (employee.isSeparated) {
    result = separatedAmount();
  } else {
    if (employee.isRetired) {
      result = retiredAmount();
    } else {
      result = normalPayAmount();
    }
  }
  return result;
}

// After
function getPayAmount(employee: Employee): number {
  if (employee.isSeparated) return separatedAmount();
  if (employee.isRetired) return retiredAmount();
  return normalPayAmount();
}
```

---

## 15. Remove Dead Code

**トリガー:** 到達不能なブロック、未使用のエクスポート、コメントアウトされたコード

**リスク:** Low

```typescript
// Before
function calculateTotal(items: Item[]): number {
  // const oldTotal = items.reduce((sum, i) => sum + i.price, 0);
  // if (USE_NEW_PRICING) {
  const total = items.reduce((sum, i) => sum + i.adjustedPrice, 0);
  // }
  return total;
}

export function deprecatedHelper() { /* 2024-01に廃止 */ }

// After
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, i) => sum + i.adjustedPrice, 0);
}
// deprecatedHelper は削除。バージョン管理に履歴あり。
```

---

## リスクレベルまとめ

| リスク | パターン | 注意点 |
|--------|----------|--------|
| **Low** | Extract/Inline Variable, Decompose/Consolidate Conditional, Guard Clauses, Remove Dead Code, Rename Variable | ローカル変更のみ。テスト不要な場合もあるが必ず実行 |
| **Medium** | Extract/Inline Function, Change Function Declaration, Encapsulate Variable, Parameter Object, Combine into Class, Split Phase | 呼び出し元への影響あり。全テスト実行必須 |
| **High** | Replace Conditional with Polymorphism | 構造的変更。段階的に適用し、各ステップでテスト |
