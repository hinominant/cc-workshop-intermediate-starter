# quill — ドキュメント・型パターン集 (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## TYPESCRIPT TYPE PATTERNS

Use these patterns to replace `any` types with proper type definitions.

### Replacing `any` Type

**Pattern 1: Unknown First**
```typescript
// BAD
function parse(data: any): any { ... }

// GOOD: Start with unknown, narrow down
function parse(data: unknown): ParsedData {
  if (isValidData(data)) {
    return data as ParsedData;
  }
  throw new Error('Invalid data');
}
```

**Pattern 2: Generic Constraints**
```typescript
// BAD
function getProperty(obj: any, key: string): any { ... }

// GOOD: Use generics with constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

**Pattern 3: API Response Types**
```typescript
// BAD
const response: any = await fetch('/api/users');

// GOOD: Define response interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const response: ApiResponse<User[]> = await fetch('/api/users');
```

### Utility Types Usage

| Utility | Use Case | Example |
|---------|----------|---------|
| `Partial<T>` | Optional updates | `updateUser(id, changes: Partial<User>)` |
| `Required<T>` | Ensure all fields | `createUser(data: Required<UserInput>)` |
| `Pick<T, K>` | Select fields | `Pick<User, 'id' \| 'name'>` |
| `Omit<T, K>` | Exclude fields | `Omit<User, 'password'>` |
| `Record<K, V>` | Dictionary type | `Record<string, User>` |
| `Readonly<T>` | Immutable data | `Readonly<Config>` |

### Type Guards

```typescript
// Type guard function
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj
  );
}

// Usage
if (isUser(data)) {
  console.log(data.name); // TypeScript knows it's User
}
```

### Union & Intersection Types

```typescript
// Union: Either type
type Result<T> = Success<T> | Failure;

// Intersection: Combined type
type AdminUser = User & { permissions: string[] };

// Discriminated Union (recommended)
type ApiResult<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };
```

---

## DOCUMENTATION QUALITY CHECKLIST

Use this checklist to evaluate documentation quality.

### Completeness Check

**README.md:**
- [ ] Project title and description
- [ ] Installation instructions
- [ ] Usage examples (basic & advanced)
- [ ] Configuration options
- [ ] Environment variables (.env.example documented)
- [ ] Contributing guidelines link
- [ ] License information

**API Documentation:**
- [ ] All public endpoints documented
- [ ] Request/response examples included
- [ ] Error codes explained
- [ ] Authentication requirements clear
- [ ] Rate limits documented

**Code Documentation:**
- [ ] All public functions have JSDoc/TSDoc
- [ ] Complex algorithms explained
- [ ] Magic numbers defined as constants with comments
- [ ] Deprecated items marked with migration path

### Accuracy Check

- [ ] Code examples are runnable
- [ ] Version numbers are current
- [ ] Links are not broken
- [ ] API responses match actual behavior
- [ ] Configuration options are valid

### Readability Check

- [ ] Consistent formatting (headers, lists, code blocks)
- [ ] Technical jargon explained or linked
- [ ] Logical section ordering
- [ ] Appropriate use of diagrams/visuals
- [ ] Scannable with clear headings

### Maintainability Check

- [ ] Single source of truth (no duplicate info)
- [ ] Modular structure (easy to update sections)
- [ ] Version-agnostic where possible
- [ ] Clear ownership (who updates what)
- [ ] Last updated date visible

---

## DOCUMENTATION COVERAGE REPORT

Audit documentation coverage systematically, similar to test coverage.

### Coverage Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Public API JSDoc | 100% | Functions/classes without JSDoc |
| Type Coverage | 95%+ | `any` types remaining |
| README Sections | 100% | Essential sections present |
| Link Health | 100% | No broken links |
| Example Coverage | 80%+ | Public APIs with @example |

### Audit Command Examples

```bash
# Count functions without JSDoc (TypeScript)
grep -r "export function\|export const.*=" src/ | grep -v "/\*\*" | wc -l

# Find any types
grep -rn ": any\|: any\[\]\|as any" src/ --include="*.ts" --include="*.tsx"

# Check broken links in markdown
npx markdown-link-check README.md

# TypeScript strict mode violations
npx tsc --noEmit --strict 2>&1 | grep "error TS"
```

### Coverage Report Format

```markdown
### Documentation Coverage Report: [Project/Module]

**Report Date**: YYYY-MM-DD
**Scope**: [files/directories covered]

| Category | Total | Documented | Coverage |
|----------|-------|------------|----------|
| Public Functions | X | Y | Z% |
| Public Classes | X | Y | Z% |
| Interfaces | X | Y | Z% |
| Type Aliases | X | Y | Z% |

**Type Safety**:
| Metric | Count | Target |
|--------|-------|--------|
| `any` types | X | 0 |
| `unknown` (safe) | Y | - |
| Missing return types | Z | 0 |

**README Completeness**:
- [x] Project description
- [x] Installation
- [ ] Usage examples ← Missing
- [x] Configuration
- [ ] Contributing ← Missing

**Critical Gaps** (Priority fixes):
1. `src/api/client.ts` - 5 public functions without JSDoc
2. `src/types/index.ts` - 3 `any` types to replace
3. `README.md` - Missing usage examples section

**Recommendations**:
- Add @example to top 5 most-used functions
- Replace `any` in API response types with interfaces
- Add CONTRIBUTING.md with PR guidelines
```

### Automated Coverage Tools

```json
// package.json scripts
{
  "scripts": {
    "docs:coverage": "typedoc --emit none --json coverage.json && node scripts/doc-coverage.js",
    "docs:links": "markdown-link-check README.md docs/**/*.md",
    "types:audit": "grep -rn ': any' src/ --include='*.ts' | wc -l"
  }
}
```

---

## TYPE COVERAGE METRICS

Track progress on eliminating `any` types and improving type safety.

### Type Coverage Score

```
Type Coverage = (Typed Symbols / Total Symbols) × 100

Target: 95%+ for production code
```

### Using type-coverage Tool

```bash
# Install
npm install -D type-coverage

# Run audit
npx type-coverage --detail --strict

# Add to CI
npx type-coverage --at-least 95
```

### Any Type Audit Report

```markdown
### Type Audit: [Module Name]

**Current Coverage**: X.X%
**Target**: 95%

| File | `any` Count | Severity | Notes |
|------|-------------|----------|-------|
| api/client.ts | 5 | High | API response types |
| utils/helpers.ts | 2 | Medium | Legacy code |
| types/legacy.ts | 8 | Low | Deprecated, to be removed |

**Total `any` types**: 15
**Estimated effort**: 2-3 hours

**Priority Replacements**:
1. `api/client.ts:42` - `response: any` → `ApiResponse<User>`
2. `api/client.ts:56` - `data: any` → `RequestPayload`
3. `utils/helpers.ts:12` - `config: any` → `AppConfig`

**Blocked Items**:
- `types/legacy.ts` - Depends on deprecated API, defer until migration
```

### Type Improvement Patterns

```typescript
// Before: any everywhere
async function fetchData(url: string): Promise<any> {
  const response: any = await fetch(url);
  return response.json();
}

// After: Proper typing
interface FetchResult<T> {
  data: T;
  status: number;
  headers: Headers;
}

async function fetchData<T>(url: string): Promise<FetchResult<T>> {
  const response = await fetch(url);
  return {
    data: await response.json() as T,
    status: response.status,
    headers: response.headers,
  };
}
```

---

## README SCAFFOLDING

Templates for different project types to ensure consistent documentation.

### Library/Package README

```markdown
# Package Name

Brief description of what this package does.

## Installation

\`\`\`bash
npm install package-name
# or
yarn add package-name
\`\`\`

## Quick Start

\`\`\`typescript
import { mainFunction } from 'package-name';

const result = mainFunction({ option: 'value' });
\`\`\`

## API Reference

### `mainFunction(options)`

Description of the main function.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `option` | `string` | - | Required option |
| `timeout` | `number` | `5000` | Optional timeout in ms |

**Returns**: `ResultType` - Description of return value

**Example**:
\`\`\`typescript
const result = mainFunction({ option: 'value', timeout: 10000 });
\`\`\`

## Configuration

| Environment Variable | Description | Default |
|---------------------|-------------|---------|
| `PACKAGE_API_KEY` | API key for service | - |
| `PACKAGE_TIMEOUT` | Request timeout | `5000` |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup.

## License

MIT
```

### Application README

```markdown
# Application Name

Brief description of the application.

## Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- Redis >= 6

## Getting Started

### 1. Clone and Install

\`\`\`bash
git clone https://github.com/org/repo.git
cd repo
npm install
\`\`\`

### 2. Environment Setup

\`\`\`bash
cp .env.example .env
# Edit .env with your values
\`\`\`

### 3. Database Setup

\`\`\`bash
npm run db:migrate
npm run db:seed  # Optional: seed test data
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
# Open http://localhost:3000
\`\`\`

## Project Structure

\`\`\`
src/
├── api/          # API routes
├── components/   # React components
├── lib/          # Shared utilities
├── pages/        # Page components
└── types/        # TypeScript types
\`\`\`

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run tests |
| `npm run lint` | Run linter |

## Deployment

See [docs/deployment.md](./docs/deployment.md) for deployment instructions.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT
```

### CLI Tool README

```markdown
# CLI Tool Name

Brief description of the CLI tool.

## Installation

\`\`\`bash
npm install -g cli-tool-name
# or
npx cli-tool-name
\`\`\`

## Usage

\`\`\`bash
cli-tool <command> [options]
\`\`\`

## Commands

### `init`

Initialize a new project.

\`\`\`bash
cli-tool init [project-name]

Options:
  --template <name>  Use a specific template
  --force            Overwrite existing files
\`\`\`

### `build`

Build the project.

\`\`\`bash
cli-tool build [options]

Options:
  --watch    Watch for changes
  --minify   Minify output
\`\`\`

## Configuration

Create `cli-tool.config.js` in your project root:

\`\`\`javascript
module.exports = {
  input: './src',
  output: './dist',
  plugins: [],
};
\`\`\`

## Examples

### Basic Usage

\`\`\`bash
cli-tool init my-project
cd my-project
cli-tool build
\`\`\`

### With Options

\`\`\`bash
cli-tool build --watch --minify
\`\`\`

## License

MIT
```

---

## JSDOC/TSDOC STYLE GUIDE

### Essential Tags

**@param - Document parameters**
```typescript
/**
 * @param name - User's display name (max 50 chars)
 * @param options - Configuration options
 * @param options.timeout - Request timeout in ms (default: 5000)
 */
function createUser(name: string, options?: CreateOptions): User
```

**@returns - Document return value**
```typescript
/**
 * @returns The created user object, or null if creation failed
 */
function createUser(name: string): User | null
```

**@throws - Document exceptions**
```typescript
/**
 * @throws {ValidationError} When name is empty or too long
 * @throws {NetworkError} When API is unreachable
 */
function createUser(name: string): User
```

**@example - Show usage**
```typescript
/**
 * @example
 * // Basic usage
 * const user = createUser('John');
 *
 * @example
 * // With options
 * const user = createUser('John', { timeout: 10000 });
 */
```

**@deprecated - Mark obsolete code**
```typescript
/**
 * @deprecated Use `createUserV2` instead. Will be removed in v3.0.
 */
function createUser(name: string): User
```

**@see - Reference related items**
```typescript
/**
 * @see {@link createUserV2} for the new API
 * @see https://docs.example.com/users for full documentation
 */
```

### Good vs Bad Examples

**BAD: Noise comment**
```typescript
/**
 * Creates a user
 * @param name - the name
 * @returns user
 */
function createUser(name: string): User
```

**GOOD: Meaningful documentation**
```typescript
/**
 * Creates a new user account and sends verification email.
 *
 * @param name - Display name (1-50 characters, no special chars)
 * @returns Newly created user with pending verification status
 * @throws {ValidationError} If name doesn't meet requirements
 *
 * @example
 * const user = await createUser('John Doe');
 * console.log(user.status); // 'pending_verification'
 */
function createUser(name: string): Promise<User>
```

### Interface Documentation

```typescript
/**
 * Represents a user in the system.
 *
 * @remarks
 * Users are created via {@link createUser} and must verify
 * their email before accessing protected resources.
 */
interface User {
  /** Unique identifier (UUID v4) */
  id: string;

  /** Display name (1-50 characters) */
  name: string;

  /**
   * Account status
   * - `pending`: Email not verified
   * - `active`: Full access
   * - `suspended`: Account disabled by admin
   */
  status: 'pending' | 'active' | 'suspended';

  /** ISO 8601 timestamp of account creation */
  createdAt: string;
}
```

---

## API DOCUMENTATION GENERATION

### TypeDoc (TypeScript)

**Installation:**
```bash
npm install typedoc --save-dev
```

**Configuration (typedoc.json):**
```json
{
  "entryPoints": ["src/index.ts"],
  "out": "docs",
  "exclude": ["**/*.test.ts", "**/node_modules/**"],
  "excludePrivate": true,
  "excludeProtected": true,
  "includeVersion": true,
  "readme": "README.md"
}
```

**Generate:**
```bash
npx typedoc
```

### swagger-jsdoc (REST API)

**Installation:**
```bash
npm install swagger-jsdoc swagger-ui-express --save
```

**Configuration:**
```javascript
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation'
    },
    servers: [
      { url: 'http://localhost:3000' }
    ]
  },
  apis: ['./src/routes/*.ts']
};

const specs = swaggerJsdoc(options);
```

**Route Documentation:**
```typescript
/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get('/users/:id', getUser);
```

### GraphQL Schema Documentation

```graphql
"""
A user in the system.
Users must verify their email before accessing protected resources.
"""
type User {
  "Unique identifier (UUID v4)"
  id: ID!

  "Display name (1-50 characters)"
  name: String!

  "User's email address (unique)"
  email: String!

  "Account creation timestamp"
  createdAt: DateTime!
}

"""
Input for creating a new user.
"""
input CreateUserInput {
  "Display name (required, 1-50 chars)"
  name: String!

  "Email address (required, must be unique)"
  email: String!
}
```

---

