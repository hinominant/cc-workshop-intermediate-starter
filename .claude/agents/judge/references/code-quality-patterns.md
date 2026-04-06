# Code Quality Patterns

Reference catalog for Judge to detect quality issues during code review. Each pattern includes detection signals and concrete examples.

---

## SOLID Principle Violations

### Single Responsibility Principle (SRP)

**Detection signals:**
- Class/module has more than one reason to change
- File imports from 3+ unrelated domains (DB + HTTP + email in one file)
- Function name contains "and" or "or" (e.g., `validateAndSave`)

```typescript
// VIOLATION: UserService handles auth, profile, and email
class UserService {
  async login(email: string, password: string) { /* auth logic */ }
  async updateProfile(id: string, data: Profile) { /* DB update */ }
  async sendWelcomeEmail(user: User) { /* SMTP logic */ }
}

// BETTER: Separate concerns
class AuthService { login() {} }
class ProfileService { updateProfile() {} }
class EmailService { sendWelcomeEmail() {} }
```

### Open/Closed Principle (OCP)

**Detection signals:**
- switch/case or if/else chain that grows with each new variant
- Adding a feature requires modifying existing tested code

```typescript
// VIOLATION: Adding a new payment type requires editing this function
function processPayment(type: string, amount: number) {
  if (type === 'credit') { /* ... */ }
  else if (type === 'debit') { /* ... */ }
  else if (type === 'crypto') { /* ... */ }  // added every time
}

// BETTER: Strategy pattern
const processors: Record<string, PaymentProcessor> = { credit, debit, crypto };
function processPayment(type: string, amount: number) {
  return processors[type].process(amount);
}
```

### Dependency Inversion Principle (DIP)

**Detection signals:**
- High-level module imports from a concrete implementation (e.g., `import { PgPool } from 'pg'` in a service)
- No interface/type between caller and dependency
- Cannot test the module without a real database/API

```typescript
// VIOLATION: Service depends on concrete Postgres implementation
import { Pool } from 'pg';
class OrderService {
  private pool = new Pool();
  async getOrder(id: string) { return this.pool.query('...'); }
}

// BETTER: Depend on abstraction
class OrderService {
  constructor(private db: DatabasePort) {}
  async getOrder(id: string) { return this.db.findById('orders', id); }
}
```

---

## Common Code Smells

### Feature Envy

A function accesses data from another object more than its own.

```typescript
// SMELL: calculateShipping reaches into order internals
function calculateShipping(order: Order) {
  const weight = order.items.reduce((s, i) => s + i.weight * i.quantity, 0);
  const zone = order.address.country === 'JP' ? 'domestic' : 'international';
  const discount = order.customer.tier === 'premium' ? 0.9 : 1.0;
  return weight * RATE[zone] * discount;
}
// This logic belongs on Order or a ShippingCalculator that receives pre-computed values.
```

### Shotgun Surgery

One change requires touching many files/classes.

**Detection:** A single-concept change in the PR modifies 8+ files across unrelated directories. This signals that the concept is not encapsulated.

### Primitive Obsession

Using primitives where a value object would add safety.

```typescript
// SMELL: strings everywhere
function createUser(email: string, phone: string, role: string) { ... }
// Callers can easily swap email and phone arguments.

// BETTER: Value objects
function createUser(email: Email, phone: Phone, role: UserRole) { ... }
```

### Long Parameter List

**Threshold:** > 4 parameters is a code smell.

```typescript
// SMELL
function createEvent(title: string, date: Date, location: string,
  organizer: string, maxAttendees: number, isPublic: boolean, tags: string[]) { ... }

// BETTER
function createEvent(params: CreateEventParams) { ... }
```

### God Object / God Function

**Detection:**
- Class with > 500 lines or > 15 methods
- Function with > 50 lines
- File with > 10 imports from different domains

### Dead Code Signals

Watch for these during review:

| Signal | Example |
|--------|---------|
| Unreachable branch | `if (false) { ... }` or condition that can never be true |
| Commented-out code | Blocks of `// old implementation` left in |
| Unused exports | Function exported but no import found in codebase |
| Unused parameters | Parameter declared but never read in function body |
| Unreachable catch | Try block that cannot throw the caught exception type |
| Feature flag check for removed flag | `if (flags.oldFeature)` where flag was removed |

---

## Complexity Thresholds

### Cyclomatic Complexity

Number of independent paths through a function.

| Score | Assessment | Action |
|-------|-----------|--------|
| 1-5 | Low complexity | No action |
| 6-10 | Moderate | Acceptable with good test coverage |
| 11-20 | High | Flag as S3. Recommend decomposition |
| 21+ | Very high | Flag as S2. Must decompose before merge |

**Quick count:** Start at 1, add 1 for each `if`, `else if`, `case`, `for`, `while`, `&&`, `||`, `catch`, `?:`.

### Cognitive Complexity

How hard is the code to understand for a human reader.

| Factor | Impact |
|--------|--------|
| Nesting depth > 3 | Each additional level significantly increases cognitive load |
| Break/continue in nested loops | Hard to trace flow |
| Recursion with multiple base cases | Mental stack overflow |
| Callback inside callback inside callback | "Callback hell" -- refactor to async/await |

### Nesting Depth

| Depth | Assessment |
|-------|-----------|
| 0-2 | Normal |
| 3 | Review for early return refactoring |
| 4+ | Flag as S3. Almost always refactorable with guard clauses or extraction |

```typescript
// SMELL: Nesting depth 4
function process(data: Data[]) {
  if (data) {                          // depth 1
    for (const item of data) {         // depth 2
      if (item.isValid) {              // depth 3
        if (item.type === 'special') { // depth 4
          // actual logic buried here
        }
      }
    }
  }
}

// BETTER: Guard clauses + early returns
function process(data: Data[]) {
  if (!data) return;
  for (const item of data) {
    if (!item.isValid) continue;
    if (item.type !== 'special') continue;
    // actual logic at depth 1
  }
}
```

---

## Naming Convention Patterns

### Variables and Functions

```typescript
// BAD                           // GOOD
const d = new Date();            const createdAt = new Date();
const list = getItems();         const activeUsers = getActiveUsers();
const flag = check(user);        const isEligible = checkEligibility(user);
const temp = calculate(order);   const totalAmount = calculateTotal(order);
const data = fetch(url);         const apiResponse = fetchUserProfile(url);
function handle(e) {}            function handlePaymentError(error: PaymentError) {}
function do(x) {}                function processRefund(refundRequest: RefundRequest) {}
```

### Booleans

```typescript
// BAD                     // GOOD
const active = true;       const isActive = true;
const permission = false;  const hasPermission = false;
const loading = true;      const isLoading = true;
const items = false;       const hasItems = false;
```

### Constants

```typescript
// BAD                       // GOOD
const val = 3600;            const SESSION_TIMEOUT_SECONDS = 3600;
const max = 100;             const MAX_RETRY_ATTEMPTS = 100;
if (status === 2) { ... }   if (status === ORDER_STATUS.SHIPPED) { ... }
```

---

## Dependency Direction Violations

Dependencies must flow inward (infrastructure -> application -> domain). Never outward.

```
CORRECT direction:
  Controller -> Service -> Repository -> Entity
  Route handler -> Use case -> Domain model

VIOLATION:
  Entity imports from Repository (domain depends on infrastructure)
  Domain model imports from HTTP framework (business logic depends on delivery mechanism)
  Shared utility imports from a specific feature module (shared depends on feature)
```

**Detection during review:**
- Domain/model files importing from `express`, `fastify`, `pg`, `redis`
- Shared/common files importing from feature-specific modules
- Inner layer catching infrastructure-specific exceptions (e.g., `PgError` in domain)

---

## Anti-Pattern Catalog

### Boolean Trap

```typescript
// ANTI-PATTERN: What does `true` mean here?
createUser("alice@example.com", true, false);

// BETTER: Named options
createUser("alice@example.com", { isAdmin: true, sendWelcomeEmail: false });
```

### Stringly Typed

```typescript
// ANTI-PATTERN: String where enum/union should be
function setStatus(status: string) { ... }
setStatus("actve"); // typo compiles fine

// BETTER: Union type
type Status = 'active' | 'inactive' | 'suspended';
function setStatus(status: Status) { ... }
```

### Error Swallowing

```typescript
// ANTI-PATTERN: Silent failure
try { await riskyOperation(); } catch (e) { /* ignored */ }

// BETTER: At minimum, log
try {
  await riskyOperation();
} catch (error) {
  logger.error('riskyOperation failed', { error, context });
  throw new ApplicationError('Operation failed', { cause: error });
}
```

### Premature Optimization

```typescript
// ANTI-PATTERN: Hand-rolled cache before measuring
const userCache = new Map();
function getUser(id: string) {
  if (userCache.has(id)) return userCache.get(id);
  const user = db.findUser(id);
  userCache.set(id, user);
  return user;
}
// No TTL, no eviction, no invalidation, no measurement proving it's needed.
```

### Temporal Coupling

```typescript
// ANTI-PATTERN: Methods must be called in specific order
const processor = new DataProcessor();
processor.loadConfig();     // must be first
processor.validateInput();  // must be second
processor.run();            // fails silently if previous steps skipped

// BETTER: Constructor enforces config, run() validates internally
const processor = new DataProcessor(config);
processor.run(input); // validates input internally
```
