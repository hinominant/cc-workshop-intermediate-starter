# TypeScript Patterns

> Builderが書く型安全なコードのパターン集。`any` ゼロ、`@ts-ignore` ゼロが前提。

---

## Strict Mode パターン

Builder は以下の strict オプションを前提とする:

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### noUncheckedIndexedAccess の影響

```typescript
const items: string[] = ['a', 'b', 'c'];

// ❌ undefined の可能性を無視
const first: string = items[0]; // Type 'string | undefined' is not assignable to 'string'

// ✅ 明示的にチェック
const first = items[0];
if (first !== undefined) {
  console.log(first.toUpperCase()); // first は string に絞り込まれる
}

// ✅ non-null assertion は避け、at() + 早期リターンを使う
const first = items.at(0);
if (!first) return defaultValue;
```

### exactOptionalPropertyTypes の影響

```typescript
interface Config {
  timeout?: number; // undefined は許可だが、明示的に undefined を渡すのは別
}

// ❌ exactOptionalPropertyTypes: true では NG
const config: Config = { timeout: undefined };

// ✅ プロパティ自体を省略する
const config: Config = {};
```

---

## 型の絞り込み（Type Narrowing）

### typeof ガード

```typescript
function format(value: string | number): string {
  if (typeof value === 'string') {
    return value.trim();
  }
  return value.toFixed(2);
}
```

### in 演算子ガード

```typescript
interface Dog { bark(): void; }
interface Cat { meow(): void; }

function speak(animal: Dog | Cat): void {
  if ('bark' in animal) {
    animal.bark(); // Dog に絞り込み
  } else {
    animal.meow(); // Cat に絞り込み
  }
}
```

### カスタム型ガード

```typescript
// ✅ 型述語（type predicate）で型を絞り込む
function isNonNull<T>(value: T | null | undefined): value is T {
  return value != null;
}

const results: (User | null)[] = await fetchUsers(ids);
const users: User[] = results.filter(isNonNull);
```

### Assertion Function

```typescript
function assertDefined<T>(value: T | undefined, message: string): asserts value is T {
  if (value === undefined) {
    throw new Error(message);
  }
}

const user = await repo.findById(id);
assertDefined(user, `User not found: ${id}`);
// ここ以降 user は User 型
user.name; // OK
```

---

## Discriminated Unions（判別可能ユニオン）

状態マシンやイベント処理に最適。

```typescript
// ✅ type フィールドで判別
type AsyncState<T> =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; data: T }
  | { type: 'error'; error: Error };

function render(state: AsyncState<User[]>) {
  switch (state.type) {
    case 'idle':
      return <Placeholder />;
    case 'loading':
      return <Spinner />;
    case 'success':
      return <UserList users={state.data} />;
    case 'error':
      return <ErrorBanner message={state.error.message} />;
  }
  // switch が exhaustive（全ケース網羅）ならここに到達しない
}
```

### Exhaustiveness チェック

```typescript
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}

// 新しい state.type を追加したとき、switch に case を忘れるとコンパイルエラーになる
switch (state.type) {
  case 'idle': return ...;
  case 'loading': return ...;
  // 'success' と 'error' を忘れると ↓ でコンパイルエラー
  default: assertNever(state);
}
```

---

## Generic パターン

### 再利用可能ユーティリティ

```typescript
// ページネーション結果の汎用型
interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
}

// 型推論が効く関数
function paginate<T>(items: T[], page: number, pageSize: number): Paginated<T> {
  const start = (page - 1) * pageSize;
  const sliced = items.slice(start, start + pageSize);
  return {
    items: sliced,
    total: items.length,
    page,
    pageSize,
    hasNext: start + pageSize < items.length,
  };
}
```

### 制約付き Generic

```typescript
// T は id を持つオブジェクトに制約
function groupById<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map(item => [item.id, item]));
}
```

---

## Zod スキーマバリデーション

外部入力（API リクエスト、環境変数、JSON ファイル）の境界で使用。

```typescript
import { z } from 'zod';

// スキーマ定義 = バリデーション + 型生成を1箇所で
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['admin', 'member', 'viewer']),
  metadata: z.record(z.string()).optional(),
});

// スキーマから型を導出（手書きの interface 不要）
type CreateUserInput = z.infer<typeof CreateUserSchema>;

// API ハンドラでの使用
function handleCreateUser(rawBody: unknown): Result<User, ValidationError> {
  const parsed = CreateUserSchema.safeParse(rawBody);
  if (!parsed.success) {
    return err(new ValidationError(parsed.error.flatten()));
  }
  // parsed.data は CreateUserInput 型として型安全
  return createUser(parsed.data);
}
```

### 環境変数のバリデーション

```typescript
const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  REDIS_URL: z.string().url().optional(),
});

// アプリ起動時に一度だけ実行。失敗したら即終了
export const env = EnvSchema.parse(process.env);
```

---

## Result 型 vs 例外

### Result 型パターン

```typescript
// ✅ 明示的なエラーハンドリングを強制
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

// 使用例
function divide(a: number, b: number): Result<number, 'DIVISION_BY_ZERO'> {
  if (b === 0) return err('DIVISION_BY_ZERO');
  return ok(a / b);
}

const result = divide(10, 0);
if (!result.ok) {
  // result.error は 'DIVISION_BY_ZERO' 型
  handleError(result.error);
  return;
}
// result.value は number 型
console.log(result.value);
```

### 判断基準

| 状況 | 手法 | 理由 |
|------|------|------|
| ビジネスルール違反 | Result 型 | 呼び出し側がハンドリングを強制される |
| プログラムバグ | throw Error | 回復不能。上位でキャッチ |
| 外部サービス障害 | Result 型 + リトライ | 回復可能な障害は明示的に扱う |
| JSON パースエラー | Result 型 | 入力依存で十分起こりうる |

---

## よくある ✅/❌ パターン

```typescript
// ❌ any
function process(data: any) { ... }

// ✅ unknown + 型ガード
function process(data: unknown) {
  if (!isValidInput(data)) throw new ValidationError('Invalid input');
  // data は ValidInput 型
}

// ❌ as による型アサーション
const user = response.data as User;

// ✅ Zod でバリデーション
const user = UserSchema.parse(response.data);

// ❌ string で状態管理
function setStatus(status: string) { ... }

// ✅ リテラル型ユニオン
type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered';
function setStatus(status: OrderStatus) { ... }

// ❌ optional chaining の乱用（根本原因を隠す）
const name = user?.profile?.settings?.displayName ?? 'Unknown';

// ✅ 境界で型を確定させる
const profile = validateProfile(user.profile); // ここで undefined を排除
const name = profile.settings.displayName;
```
