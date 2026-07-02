# navigator — ブラウザ自動化 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## BROWSER AUTOMATION TOOLS

### Browser Use CLI 2.0（PRIMARY — 推奨）

CDP直接接続でトークン効率4倍・速度2倍。既存Chromeへの接続・ログイン状態引継ぎに対応。

| Operation | Command | Description |
|-----------|---------|-------------|
| Navigate | `browser-use open <url>` | Navigate to URL |
| State | `browser-use state` | Get clickable elements with indices |
| Click | `browser-use click <index>` | Click element by index |
| Type | `browser-use type "<text>"` | Type text into focused element |
| Screenshot | `browser-use screenshot <path>` | Capture screenshot |
| Evaluate | `browser-use eval "<js>"` | Execute JavaScript |
| Connect | `browser-use --connect open <url>` | Connect to existing Chrome |
| Profile | `browser-use --profile "Default" open <url>` | Use Chrome profile (login state) |
| Close | `browser-use close` | Close browser |

**利点:**
- DOMベース操作でスクリーンショット不要（トークン大幅節約）
- `--connect` で既存ログインセッションを即座に活用
- デーモン常駐で長時間セッションも安定
- 1コマンド = 10-15トークンの出力（Playwright MCPの数分の1）

### Playwright MCP Server（FALLBACK）

Browser Use CLI が利用不可の場合に使用。

| Operation | MCP Tool | Description |
|-----------|----------|-------------|
| Navigate | `playwright_navigate` | Navigate to URL |
| Click | `playwright_click` | Click element |
| Fill | `playwright_fill` | Fill input field |
| Screenshot | `playwright_screenshot` | Capture screenshot |
| Evaluate | `playwright_evaluate` | Execute JavaScript |
| Wait | `playwright_wait` | Wait for element/condition |

### ツール選択フロー

```
browser-use doctor → OK? → Browser Use CLI で実行
                   → NG? → Playwright MCP にフォールバック
                         → Playwright MCP も不可? → Playwright スクリプト生成
```

### CDP (Chrome DevTools Protocol)

| Feature | CDP Method | Use Case |
|---------|------------|----------|
| Console Monitoring | `Runtime.consoleAPICalled` | Capture all console messages |
| Network Interception | `Network.requestWillBeSent` | Monitor/modify requests |
| Performance Metrics | `Performance.getMetrics` | Collect FCP, LCP, TTI |
| Coverage | `Profiler.startPreciseCoverage` | Code coverage analysis |

See `references/playwright-cdp.md` for connection patterns, fallback implementation, and code examples.

---

## VIDEO RECORDING (動画撮影)

### When to Record Video

| Situation | Record? | Rationale |
|-----------|---------|-----------|
| Bug reproduction | ✅ Yes | Evidence for developers |
| Complex multi-step flows | ✅ Yes | Document entire operation sequence |
| Form submission verification | ✅ Yes | Capture before/after states |
| Performance investigation | ✅ Yes | Visual timing analysis |
| Simple data extraction | ❌ No | Screenshots sufficient |
| Repeated operations | ❌ No | Record once, reference later |

### Playwright Video Recording

```typescript
// Context-level recording (recommended for task flows)
const context = await browser.newContext({
  recordVideo: {
    dir: '.navigator/videos/',
    size: { width: 1280, height: 720 },
  },
});
const page = await context.newPage();

// Perform operations
await page.goto('https://example.com');
await page.fill('[data-testid="search"]', 'keyword');
await page.click('[data-testid="submit"]');

// Get video path after closing
await page.close();
const videoPath = await page.video()?.path();
console.log(`Video saved: ${videoPath}`);

// IMPORTANT: Close context to finalize video
await context.close();
```

### CDP Screen Recording (Advanced)

```typescript
// CDP-based recording for fine-grained control
const client = await page.context().newCDPSession(page);

// Start screencast
await client.send('Page.startScreencast', {
  format: 'jpeg',
  quality: 80,
  everyNthFrame: 2, // Capture every 2nd frame
});

// Collect frames
const frames: Buffer[] = [];
client.on('Page.screencastFrame', async (event) => {
  frames.push(Buffer.from(event.data, 'base64'));
  await client.send('Page.screencastFrameAck', { sessionId: event.sessionId });
});

// Perform operations...

// Stop and process
await client.send('Page.stopScreencast');
// Convert frames to video using ffmpeg or similar
```

### Video Configuration Options

```typescript
// playwright.config.ts or context options
const videoOptions = {
  // Size options
  size: { width: 1280, height: 720 },  // 720p (recommended)
  // size: { width: 1920, height: 1080 }, // 1080p (larger files)

  // Directory
  dir: '.navigator/videos/',
};

// Per-task recording control
async function recordTask(task: () => Promise<void>, name: string) {
  const context = await browser.newContext({
    recordVideo: { dir: '.navigator/videos/' },
  });
  const page = await context.newPage();

  try {
    await task();
  } finally {
    await page.close();
    const video = page.video();
    if (video) {
      const originalPath = await video.path();
      // Rename with meaningful name
      const newPath = `.navigator/videos/${name}_${Date.now()}.webm`;
      await fs.rename(originalPath, newPath);
    }
    await context.close();
  }
}
```

### Best Practices for Video Recording

| Practice | Description |
|----------|-------------|
| **Start recording before navigation** | Capture complete flow including initial load |
| **Use 720p resolution** | Balance between clarity and file size |
| **Close page/context to finalize** | Video file is incomplete until closed |
| **Rename files meaningfully** | `task_checkout_20250127.webm` not `random-uuid.webm` |
| **Record only when necessary** | Videos consume storage; be selective |
| **Include in task report** | Reference video path in final report |
| **Clean up old videos** | Implement retention policy (e.g., 7 days) |

### Video File Management

```
.navigator/
├── videos/
│   ├── task_[name]_[timestamp].webm    # Completed task videos
│   ├── error_[name]_[timestamp].webm   # Error reproduction videos
│   └── evidence_[name]_[timestamp].webm # Evidence videos
```

### Integration with Task Report

```markdown
## Task Report: Checkout Flow Verification

### Evidence
- **Screenshots**: `.navigator/screenshots/checkout_*.png`
- **Video**: `.navigator/videos/task_checkout_20250127_143022.webm`
- **HAR**: `.navigator/har/checkout_20250127.har`

### Video Timestamps
- 0:00 - Page load
- 0:15 - Form filling
- 0:45 - Submit and confirmation
```

---

## DATA EXTRACTION & FORM OPERATIONS

### Extraction Patterns

| Pattern | Use Case |
|---------|----------|
| Text extraction | Single/multiple elements via locator |
| Structured data | `page.evaluate()` with DOM traversal |
| Table data | Headers + row iteration |
| Pagination | Loop with next button detection |

### Form Operations

| Operation | Key Points |
|-----------|------------|
| Analysis | Detect field types, required attrs, options |
| Filling | Handle input/select/checkbox/radio/file |
| Submission | Screenshot before/after, capture response |

### Authentication

| Method | Storage |
|--------|---------|
| Session save | `context.storageState()` |
| Session load | `browser.newContext({ storageState })` |
| Credentials | Environment variables only |

### Error Handling

| Error Type | Action |
|------------|--------|
| ElementNotFound | Update selector, retry |
| Timeout | Increase wait, check visibility |
| NetworkError | Retry with exponential backoff |
| RateLimited | Wait and retry |
| CAPTCHABlocked | Escalate to user |

See `references/data-extraction.md` for full code patterns and validation examples.

---

