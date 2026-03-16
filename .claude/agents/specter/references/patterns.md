# Detection Patterns

Specterが使用する検出パターンライブラリ。各パターンは正規表現とコンテキスト分析の組み合わせで使用する。

---

## Memory Leak Patterns

### Event Listener Leaks

**Pattern ML-001: addEventListener without cleanup**
```regex
addEventListener\s*\([^)]+\)(?![\s\S]{0,300}removeEventListener)
```

**Bad Example:**
```typescript
// Component mounts, adds listener, never removes
function Modal() {
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    // Missing: return () => window.removeEventListener(...)
  }, []);
}
```

**Good Example:**
```typescript
function Modal() {
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
}
```

**Context Check:**
- Is this inside a React useEffect?
- Is there a corresponding removeEventListener in return?
- Is the handler a stable reference (useCallback)?

---

**Pattern ML-002: Anonymous function in addEventListener**
```regex
addEventListener\s*\(\s*['"][^'"]+['"]\s*,\s*(?:function\s*\(|(?:\([^)]*\)|[^,]+)\s*=>)
```

**Risk:** Anonymous functions prevent proper cleanup because reference changes.

**Bad Example:**
```typescript
element.addEventListener('click', () => console.log('clicked'));
// Cannot remove: no reference to the function
```

**Good Example:**
```typescript
const handleClick = useCallback(() => console.log('clicked'), []);
element.addEventListener('click', handleClick);
// Later: element.removeEventListener('click', handleClick);
```

---

### Timer Leaks

**Pattern ML-003: setInterval without clearInterval**
```regex
setInterval\s*\([^)]+\)(?![\s\S]{0,400}clearInterval)
```

**Bad Example:**
```typescript
function Counter() {
  useEffect(() => {
    setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    // Missing: clearInterval on unmount
  }, []);
}
```

**Good Example:**
```typescript
function Counter() {
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
}
```

---

**Pattern ML-004: setTimeout in component without cleanup**
```regex
setTimeout\s*\([^)]+\)(?![\s\S]{0,200}clearTimeout)
```

**Context:** Less critical than setInterval, but can cause state updates on unmounted components.

---

### Subscription Leaks

**Pattern ML-005: subscribe without unsubscribe**
```regex
\.subscribe\s*\([^)]+\)(?![\s\S]{0,300}\.unsubscribe)
```

**Bad Example:**
```typescript
function DataFetcher() {
  useEffect(() => {
    dataStream.subscribe(data => setData(data));
    // Missing: unsubscribe on unmount
  }, []);
}
```

**Good Example:**
```typescript
function DataFetcher() {
  useEffect(() => {
    const subscription = dataStream.subscribe(data => setData(data));
    return () => subscription.unsubscribe();
  }, []);
}
```

---

### Closure Leaks

**Pattern ML-006: Large object in closure scope**
```regex
useEffect\s*\(\s*\(\)\s*=>\s*\{[^}]*\b(largeData|bigArray|heavyObject)\b
```

**Manual Check Required:** Verify if large objects are captured and held.

---

## Race Condition Patterns

### Shared State Mutation

**Pattern RC-001: State mutation in async callback**
```regex
(await|\.then)\s*\([^)]*\)[\s\S]{0,100}(this\.|setState|set[A-Z])
```

**Risk:** State may have changed between async operation start and completion.

**Bad Example:**
```typescript
async function loadData() {
  const data = await fetchData();
  // Race: what if component unmounted or state changed?
  setData(data);
}
```

**Good Example:**
```typescript
async function loadData() {
  const abortController = new AbortController();
  try {
    const data = await fetchData({ signal: abortController.signal });
    if (!abortController.signal.aborted) {
      setData(data);
    }
  } catch (e) {
    if (e.name !== 'AbortError') throw e;
  }
  return () => abortController.abort();
}
```

---

**Pattern RC-002: Read-modify-write without atomicity**
```regex
(count|value|total)\s*=\s*\1\s*[+\-*/]
```

**Bad Example:**
```typescript
// Multiple async operations may read same value
async function incrementCounter() {
  const current = await getValue();
  await setValue(current + 1);  // Race: another operation may have changed value
}
```

**Good Example:**
```typescript
async function incrementCounter() {
  await updateValue(current => current + 1);  // Atomic update
}
```

---

### Async Initialization Race

**Pattern RC-003: Optional chaining after await suggests race**
```regex
await\s+[^;]+;\s*[^;]*\?\.\w+
```

**Context:** May indicate uncertainty about whether data exists after async operation.

---

**Pattern RC-004: Multiple awaits modifying same state**
```regex
await[\s\S]{0,50}await[\s\S]{0,100}(set[A-Z]\w*|this\.\w+\s*=)
```

**Risk:** Multiple async operations competing to update same state.

---

### useEffect Race Conditions

**Pattern RC-005: useEffect with async function and no cleanup**
```regex
useEffect\s*\(\s*\(\)\s*=>\s*\{\s*(async|fetch|axios)[\s\S]*?\}\s*,\s*\[[^\]]*\]\s*\)(?![\s\S]{0,50}return)
```

**Bad Example:**
```typescript
useEffect(() => {
  async function fetchData() {
    const data = await api.get('/data');
    setData(data);  // Race: component may be unmounted
  }
  fetchData();
}, []);
```

**Good Example:**
```typescript
useEffect(() => {
  let cancelled = false;
  async function fetchData() {
    const data = await api.get('/data');
    if (!cancelled) setData(data);
  }
  fetchData();
  return () => { cancelled = true; };
}, []);
```

---

## Resource Leak Patterns

### Database Connection Leaks

**Pattern RL-001: Connection acquired without release**
```regex
(getConnection|createConnection|connect)\s*\([^)]*\)(?![\s\S]{0,500}(release|close|end|destroy))
```

**Bad Example:**
```typescript
async function queryData() {
  const conn = await pool.getConnection();
  const result = await conn.query('SELECT * FROM users');
  return result;  // Connection never released!
}
```

**Good Example:**
```typescript
async function queryData() {
  const conn = await pool.getConnection();
  try {
    const result = await conn.query('SELECT * FROM users');
    return result;
  } finally {
    conn.release();
  }
}
```

---

### File Handle Leaks

**Pattern RL-002: File opened without close**
```regex
(openSync|createReadStream|createWriteStream|fs\.open)\s*\([^)]*\)(?![\s\S]{0,400}(close|end|destroy))
```

**Bad Example:**
```typescript
const stream = fs.createReadStream('file.txt');
stream.on('data', chunk => process(chunk));
// Stream never closed
```

**Good Example:**
```typescript
const stream = fs.createReadStream('file.txt');
stream.on('data', chunk => process(chunk));
stream.on('end', () => stream.destroy());
stream.on('error', () => stream.destroy());
```

---

### WebSocket Leaks

**Pattern RL-003: WebSocket created without close handler**
```regex
new\s+WebSocket\s*\([^)]+\)(?![\s\S]{0,300}\.close\()
```

**Bad Example:**
```typescript
function useWebSocket(url) {
  const ws = new WebSocket(url);
  ws.onmessage = (msg) => handleMessage(msg);
  // No cleanup when component unmounts
}
```

**Good Example:**
```typescript
function useWebSocket(url) {
  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onmessage = (msg) => handleMessage(msg);
    return () => ws.close();
  }, [url]);
}
```

---

## Async Anti-Patterns

### Missing await

**Pattern AA-001: Async function call without await**
```regex
(?<!await\s)(?<!return\s)(fetch|axios\.|api\.)(?!\s*\.\s*then)
```

**Bad Example:**
```typescript
function saveData(data) {
  api.post('/save', data);  // Fire and forget - errors lost
  console.log('saved');
}
```

**Good Example:**
```typescript
async function saveData(data) {
  await api.post('/save', data);
  console.log('saved');
}
```

---

### Unhandled Promise Rejection

**Pattern AA-002: Promise without catch**
```regex
\.then\s*\([^)]+\)(?!\s*\.\s*(catch|finally))(?!\s*;?\s*\.\s*catch)
```

**Bad Example:**
```typescript
fetchData()
  .then(data => processData(data));
  // Errors silently swallowed
```

**Good Example:**
```typescript
fetchData()
  .then(data => processData(data))
  .catch(error => console.error('Failed:', error));
```

---

**Pattern AA-003: Async function without try-catch**
```regex
async\s+(function\s+\w+|\w+\s*=\s*async)\s*\([^)]*\)\s*\{(?![\s\S]{0,100}try\s*\{)
```

**Manual Check:** Not all async functions need try-catch if errors are caught at call site.

---

### Cleanup Missing

**Pattern AA-004: useEffect with async but no return**
```regex
useEffect\s*\(\s*\(\)\s*=>\s*\{[\s\S]*?(async|await|fetch|setTimeout|setInterval)[\s\S]*?\}\s*,\s*\[[^\]]*\]\s*\)(?![\s\S]{0,20}return)
```

---

## Deadlock Patterns

### Circular Promise Dependencies

**Pattern DL-001: Await inside Promise executor**
```regex
new\s+Promise\s*\(\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{[\s\S]*?await
```

**Risk:** Mixing async/await with Promise constructor can cause confusion and potential deadlocks.

---

**Pattern DL-002: Nested async locks**
```regex
(acquire|lock)\s*\([^)]*\)[\s\S]{0,200}(acquire|lock)\s*\(
```

**Risk:** Acquiring multiple locks in different orders can cause deadlock.

---

## Pattern Application Guidelines

### Scan Priority

1. **High Priority Patterns:**
   - ML-001, ML-003 (Timer/Listener leaks)
   - RC-001, RC-005 (Race conditions with state)
   - RL-001 (Connection leaks)
   - AA-002 (Unhandled rejections)

2. **Medium Priority Patterns:**
   - ML-005 (Subscription leaks)
   - RC-002 (Read-modify-write)
   - AA-001 (Missing await)

3. **Context-Dependent Patterns:**
   - ML-002 (Anonymous handlers)
   - AA-003 (Try-catch)
   - DL-001, DL-002 (Deadlocks)

### False Positive Reduction

| Pattern | False Positive Risk | Mitigation |
|---------|---------------------|------------|
| ML-001 | Medium | Check for cleanup in same file |
| RC-001 | High | Verify async context |
| RL-001 | Medium | Check for try-finally |
| AA-002 | Low | Direct pattern match |

### Confidence Levels

| Confidence | Criteria |
|------------|----------|
| **HIGH** | Pattern matches and context confirms |
| **MEDIUM** | Pattern matches, context unclear |
| **LOW** | Pattern matches, likely false positive |
