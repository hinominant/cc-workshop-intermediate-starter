# Type Improvement Strategies

## any → Proper Type Migration Path

### Step 1: Audit

```bash
# Find all any types
grep -rn ': any\|: any\[\]\|as any\|<any>' src/ --include='*.ts' --include='*.tsx'

# Count by file
grep -rnl ': any' src/ --include='*.ts' | while read f; do
  echo "$(grep -c ': any' "$f") $f"
done | sort -rn
```

### Step 2: Categorize

| Category | Example | Strategy |
|----------|---------|----------|
| API Response | `fetch().then(r => r.json() as any)` | Define response interface |
| Function param | `function process(data: any)` | Use generics or specific type |
| Library type | `thirdPartyLib.method() as any` | Check @types package or use `unknown` |
| Legacy code | `const x: any = legacyFunction()` | Wrap with typed adapter |
| Quick hack | `(window as any).customProp` | Extend global types |

### Step 3: Replace Patterns

#### Pattern: API Response
```typescript
// Before
const data: any = await response.json();

// After
interface UserResponse {
  id: string;
  name: string;
  email: string;
}
const data: UserResponse = await response.json();
```

#### Pattern: Generic Function
```typescript
// Before
function first(arr: any[]): any {
  return arr[0];
}

// After
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
```

#### Pattern: Event Handler
```typescript
// Before
function handleChange(e: any) {
  setValue(e.target.value);
}

// After
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setValue(e.target.value);
}
```

#### Pattern: Dynamic Object
```typescript
// Before
const config: any = {};

// After
interface AppConfig {
  apiUrl: string;
  timeout: number;
  debug?: boolean;
}
const config: AppConfig = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};
```

#### Pattern: Third-Party Library
```typescript
// Before
const result: any = externalLib.process(data);

// After (Option A: Install types)
// npm install -D @types/external-lib

// After (Option B: Declare module)
declare module 'external-lib' {
  export function process(data: InputType): OutputType;
}

// After (Option C: Wrap with adapter)
function processData(data: InputType): OutputType {
  return externalLib.process(data) as OutputType;
}
```

## Type Guard Patterns

### Basic Type Guard
```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}
```

### Object Type Guard
```typescript
interface User {
  id: string;
  name: string;
}

function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    typeof (obj as User).id === 'string' &&
    typeof (obj as User).name === 'string'
  );
}
```

### Discriminated Union Guard
```typescript
type Result<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function isSuccess<T>(result: Result<T>): result is { status: 'success'; data: T } {
  return result.status === 'success';
}
```

## Utility Type Cheat Sheet

| Utility | Purpose | Example |
|---------|---------|---------|
| `Partial<T>` | All props optional | `Partial<User>` for updates |
| `Required<T>` | All props required | `Required<Config>` for validation |
| `Pick<T, K>` | Select specific props | `Pick<User, 'id' \| 'name'>` |
| `Omit<T, K>` | Exclude specific props | `Omit<User, 'password'>` |
| `Record<K, V>` | Key-value map | `Record<string, User>` |
| `Readonly<T>` | Immutable | `Readonly<Config>` |
| `NonNullable<T>` | Remove null/undefined | `NonNullable<string \| null>` |
| `ReturnType<F>` | Function return type | `ReturnType<typeof fetch>` |
| `Parameters<F>` | Function param types | `Parameters<typeof handler>` |
| `Awaited<T>` | Unwrap Promise | `Awaited<Promise<User>>` → `User` |
