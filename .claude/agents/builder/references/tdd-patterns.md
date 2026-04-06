# TDD Patterns

> テスト駆動開発のパターン集。Builderが「Test First」ステップで使う実践ガイド。

---

## Red-Green-Refactor サイクル

```
RED    → 失敗するテストを書く（期待する振る舞いを定義）
GREEN  → テストを通す最小限のコードを書く（正しさだけに集中）
REFACTOR → テストが通ったまま構造を改善する（振る舞いは変えない）
```

### 具体例: ユーザー登録フロー

```typescript
// RED: 失敗するテストを書く
describe('UserRegistrationService', () => {
  it('should create a user with hashed password', async () => {
    const service = new UserRegistrationService(mockUserRepo, mockHasher);
    const result = await service.register({
      email: 'test@example.com',
      password: 'SecurePass123!',
    });

    expect(result.isOk()).toBe(true);
    expect(mockUserRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'test@example.com' })
    );
    expect(mockHasher.hash).toHaveBeenCalledWith('SecurePass123!');
  });

  it('should reject duplicate email with DUPLICATE_EMAIL error', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(existingUser);
    const result = await service.register({
      email: 'existing@example.com',
      password: 'SecurePass123!',
    });

    expect(result.isErr()).toBe(true);
    expect(result.error.code).toBe('DUPLICATE_EMAIL');
  });

  it('should reject weak password with WEAK_PASSWORD error', async () => {
    const result = await service.register({
      email: 'test@example.com',
      password: '123',
    });

    expect(result.isErr()).toBe(true);
    expect(result.error.code).toBe('WEAK_PASSWORD');
  });
});
```

---

## Test-First vs Test-After 判断基準

| 状況 | 判断 | 理由 |
|------|------|------|
| 新規ビジネスロジック | Test-First | 要件をテストで明文化できる |
| バグ修正 | Test-First | 再現テストを先に書いて修正を証明する |
| 既存コードのリファクタ | Test-After (既存テストで保護) | 既にテストがあるなら追加不要 |
| UI コンポーネント | Test-After | レイアウトは書いてから検証が効率的 |
| 外部API統合 | Test-First (モック) | 契約をテストで定義してから実装 |
| プロトタイプ探索 | Test-After | Forgeの領域。Builderに来た時点でTest-First |

---

## AAA パターン (Arrange-Act-Assert)

```typescript
// ✅ 明確な AAA 構造
it('should calculate total with tax', () => {
  // Arrange
  const cart = new Cart();
  cart.addItem({ name: 'Widget', price: 1000 });
  const calculator = new PriceCalculator(TAX_RATE_10);

  // Act
  const total = calculator.calculateTotal(cart);

  // Assert
  expect(total).toBe(1100);
});

// ❌ AAA が混在
it('should calculate total with tax', () => {
  const cart = new Cart();
  cart.addItem({ name: 'Widget', price: 1000 });
  expect(cart.items).toHaveLength(1); // Assert が Act の前に混入
  const total = new PriceCalculator(TAX_RATE_10).calculateTotal(cart);
  expect(total).toBe(1100);
  cart.addItem({ name: 'Gadget', price: 500 }); // 新しい Arrange が後ろに
  expect(new PriceCalculator(TAX_RATE_10).calculateTotal(cart)).toBe(1650);
});
```

**1テスト = 1 Arrange-Act-Assert。** 複数のシナリオは別テストに分ける。

---

## TDD アンチパターン

### 1. 実装詳細のテスト

```typescript
// ❌ 内部メソッド呼び出し回数をテスト → リファクタで壊れる
it('should call validateEmail once', () => {
  service.register({ email: 'a@b.com', password: 'Pass123!' });
  expect(service['validateEmail']).toHaveBeenCalledTimes(1);
});

// ✅ 振る舞い（出力）をテスト → リファクタ耐性あり
it('should reject invalid email format', () => {
  const result = service.register({ email: 'not-an-email', password: 'Pass123!' });
  expect(result.isErr()).toBe(true);
  expect(result.error.code).toBe('INVALID_EMAIL');
});
```

### 2. テスト間の結合

```typescript
// ❌ テスト順序に依存
let sharedUser: User;
it('should create user', () => { sharedUser = service.create(...); });
it('should update user', () => { service.update(sharedUser.id, ...); }); // 上が落ちるとこれも落ちる

// ✅ 各テストが独立
it('should update user name', () => {
  const user = createTestUser(); // 各テストで独自にセットアップ
  const result = service.update(user.id, { name: 'New Name' });
  expect(result.isOk()).toBe(true);
});
```

### 3. 過度なモック

```typescript
// ❌ 全依存をモック → テストが実装のコピーになる
it('should process order', () => {
  mockValidator.validate.mockReturnValue(true);
  mockPricer.calculate.mockReturnValue(1000);
  mockTax.apply.mockReturnValue(1100);
  mockRepo.save.mockResolvedValue({ id: '1' });
  // このテストは何も証明していない
});

// ✅ 境界だけモック、コアロジックは実物
it('should process order with correct total', () => {
  const repo = new InMemoryOrderRepository(); // Fake（モックではない）
  const service = new OrderService(repo, realPricer, realTaxCalculator);
  const result = await service.process(orderInput);
  expect(result.total).toBe(1100);
});
```

---

## テスト粒度の判断基準

| テスト種別 | スコープ | 実行速度 | 使うとき |
|-----------|---------|---------|---------|
| Unit | 関数/クラス単体 | < 10ms | ビジネスロジック、計算、変換 |
| Integration | 複数モジュール結合 | < 500ms | DB操作、API呼び出し、ミドルウェア |
| E2E | ユーザーフロー全体 | < 10s | クリティカルパス（登録、決済、ログイン） |

**Builder の責務:** Unit + Integration まで。E2E は Radar/Voyager に委譲。

---

## モック戦略

### モックするもの

- 外部サービス（API、メール送信、決済）
- 現在時刻 (`Date.now()`, `new Date()`)
- ランダム値 (`Math.random()`, UUID生成)
- ファイルシステム（本番パスへのアクセス）

### モックしないもの

- 自分のドメインロジック（Fake/Stubで代替）
- 純粋関数（入力→出力が決定的）
- 値オブジェクト、DTO

### Fake vs Mock vs Stub

```typescript
// Fake: 動作する簡易実装（テスト用インメモリDB等）
class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();
  async save(user: User): Promise<void> { this.users.set(user.id, user); }
  async findById(id: string): Promise<User | undefined> { return this.users.get(id); }
}

// Mock: 呼び出しを記録・検証する（vi.fn() / jest.fn()）
const mockEmailService = { send: vi.fn().mockResolvedValue(undefined) };

// Stub: 固定値を返す（振る舞いの検証なし）
const stubConfig = { getMaxRetries: () => 3 };
```

---

## テスト命名規則

```typescript
// ✅ 要件が読める命名
it('should reject expired tokens with 401')
it('should return empty array when no results match')
it('should retry failed requests up to 3 times')

// ❌ 意味のない命名
it('works correctly')
it('test case 1')
it('should call the function')
```

**テスト名 = 仕様書の1行。** テスト名だけ読めば振る舞いが分かること。
