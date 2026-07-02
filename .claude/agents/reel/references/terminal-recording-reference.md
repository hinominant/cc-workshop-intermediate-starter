# reel — ターミナル録画 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## VHS .tape GENERATION GUIDELINES

VHS uses a declarative DSL (.tape files) to script terminal recordings.
See `references/vhs-tape-patterns.md` for the full command and settings reference.

### Basic .tape Structure

```tape
# Recording: Feature Name
# Description: What this demo shows

# --- Settings ---
Output recordings/output/feature-demo.gif
Set FontSize 14
Set Width 80
Set Height 24
Set Theme "Catppuccin Mocha"
Set TypingSpeed 50ms
Set Padding 20

# --- Prerequisites ---
Require mycommand

# --- Opening: Set context ---
Type "# Welcome to the demo"
Enter
Sleep 1s

# --- Action: Demonstrate feature ---
Type "mycommand --flag value"
Enter
Sleep 2s

# --- Result: Show outcome ---
Type "echo 'Done!'"
Enter
Sleep 1.5s
```

### Command Quick Reference

| Command | Syntax | Purpose |
|---------|--------|---------|
| Type | `Type "text"` | Type text into terminal |
| Enter | `Enter` | Press Enter key |
| Sleep | `Sleep Ns` | Pause for N seconds |
| Ctrl | `Ctrl+C` | Send control character |
| Hide | `Hide` | Stop recording output |
| Show | `Show` | Resume recording output |
| Wait | `Wait+Screen "text"` | Wait for text to appear |
| Require | `Require cmd` | Assert command exists |
| Env | `Env KEY VALUE` | Set environment variable |
| Source | `Source "file.tape"` | Include another tape |
| Screenshot | `Screenshot file.png` | Capture screenshot |

### Settings Quick Reference

| Setting | Default | Example |
|---------|---------|---------|
| Output | output.gif | `Set Output demo.gif` |
| Shell | bash | `Set Shell zsh` |
| FontSize | 22 | `Set FontSize 14` |
| Width | 80 | `Set Width 100` |
| Height | 24 | `Set Height 30` |
| Theme | — | `Set Theme "Catppuccin Mocha"` |
| TypingSpeed | 50ms | `Set TypingSpeed 75ms` |
| Padding | 0 | `Set Padding 20` |
| Framerate | 50 | `Set Framerate 30` |
| PlaybackSpeed | 1 | `Set PlaybackSpeed 1.5` |

### Timing Guidelines

| Action | Recommended Sleep | Rationale |
|--------|-------------------|-----------|
| After command execution | 1.5-2.5s | Allow output to render |
| After showing result | 2-3s | Let viewer read output |
| Between sections | 1-1.5s | Transition pause |
| Opening context | 1-2s | Set the scene |
| Final result | 2-3s | Ending pause |
| After typing (before Enter) | 0.5s | Emphasize command |

### Theme Recommendations

| Use Case | Theme | Rationale |
|----------|-------|-----------|
| README (dark mode) | Catppuccin Mocha | Modern, popular, good contrast |
| README (light mode) | Catppuccin Latte | Light theme counterpart |
| Documentation | Dracula | High contrast, widely recognized |
| Marketing | Tokyo Night | Stylish, distinctive |
| Minimal | GitHub Dark | Clean, familiar |
| Accessibility | One Half Light | High contrast, readable |

See `references/tape-templates.md` for complete reusable templates.

---

## terminalizer WORKFLOW

terminalizer is preferred when recording interactive sessions that are difficult to script declaratively.

### When to Use terminalizer

- Interactive prompts (inquirer, enquirer, prompts)
- Complex TUI applications (vim, htop, lazygit)
- Real-time output that needs live capture
- Sessions where timing depends on actual execution

### Workflow

```bash
# 1. Record an interactive session
terminalizer record session-name

# 2. Edit the generated YAML config
#    - Adjust delays, remove mistakes, trim start/end
terminalizer edit session-name

# 3. Render to GIF
terminalizer render session-name -o output.gif

# 4. (Optional) Share online
terminalizer share session-name
```

### YAML Post-Editing

```yaml
# session-name.yml
config:
  cols: 80
  rows: 24
  repeat: 0
  quality: 100
  frameDelay: auto
  maxIdleTime: 2000
  frameBox:
    type: solid
    title: "Demo Title"
    style:
      background: "#282a36"
records:
  - delay: 100
    content: "$ mycommand --help\r\n"
  # Remove or adjust individual keystrokes
```

### terminalizer vs VHS Decision

| Factor | Use VHS | Use terminalizer |
|--------|---------|------------------|
| Scripted demo | ✅ | |
| Interactive session | | ✅ |
| Reproducibility needed | ✅ | |
| Complex TUI recording | | ✅ |
| CI/CD automation | ✅ | |
| Post-editing needed | | ✅ |

---

## asciinema WORKFLOW

asciinema produces lightweight .cast files ideal for web embedding with an interactive player.

### When to Use asciinema

- Web-based documentation with interactive playback
- Long recordings where GIF size would be prohibitive
- Sessions where viewers benefit from copy-paste text
- SVG output for scalable, searchable terminal screenshots

### Workflow

```bash
# 1. Record a session
asciinema rec recording.cast

# 2. Play back for review
asciinema play recording.cast

# 3. Upload to asciinema.org (optional)
asciinema upload recording.cast

# 4. Convert to SVG (via svg-term-cli)
npx svg-term-cli --in recording.cast --out recording.svg --window

# 5. Convert to GIF (via agg)
agg recording.cast recording.gif
```

### Web Embedding

```html
<!-- asciinema player embed -->
<script src="https://asciinema.org/a/RECORDING_ID.js" id="asciicast-RECORDING_ID" async></script>

<!-- Self-hosted player -->
<asciinema-player src="recording.cast" cols="80" rows="24" autoplay="true" loop="true"></asciinema-player>
```

### asciinema vs VHS Decision

| Factor | Use VHS | Use asciinema |
|--------|---------|---------------|
| GIF output | ✅ | Via agg |
| Web player | | ✅ |
| Copy-paste from output | | ✅ |
| SVG output | | ✅ |
| Declarative scripting | ✅ | |
| File size critical | | ✅ (.cast is tiny) |

---

## OUTPUT OPTIMIZATION

See `references/output-optimization.md` for detailed optimization techniques.

### Quick Size Guidelines

| Use Case | Target Size | Recommended Format | Dimensions |
|----------|-------------|-------------------|------------|
| README embed | <5MB | GIF | 80x24 |
| Documentation | <2MB | GIF (optimized) | 80x24 |
| Marketing/social | <8MB | GIF or MP4 | 100x30 |
| Web docs (interactive) | <500KB | .cast (asciinema) | 80x24 |
| Presentation | <15MB | MP4 | 120x35 |

### Quick Optimization Commands

```bash
# GIF: Optimize with gifsicle
gifsicle -O3 --lossy=80 --colors 128 input.gif -o output.gif

# MP4: Convert GIF to MP4 (much smaller)
ffmpeg -i input.gif -movflags +faststart -pix_fmt yuv420p output.mp4

# WebM: Convert to WebM
ffmpeg -i input.gif -c:v libvpx-vp9 -crf 30 -b:v 0 output.webm

# SVG: From asciinema cast
npx svg-term-cli --in recording.cast --out output.svg --window
```

---

## QUALITY CHECKLISTS

### Pre-Recording Checklist

- [ ] Scenario designed with Opening/Action/Result structure
- [ ] All required commands available (Require directives set)
- [ ] Environment variables configured (Env directives set)
- [ ] Terminal dimensions appropriate for content (Width/Height)
- [ ] Theme selected and consistent with project style
- [ ] TypingSpeed set for readability (not too fast, not too slow)
- [ ] Sleep timings allow viewer comprehension
- [ ] No real credentials or PII in .tape file
- [ ] Output filename follows naming convention

### Post-Recording Checklist

- [ ] Recording plays without errors or glitches
- [ ] All commands execute successfully in the recording
- [ ] Text is legible at the output resolution
- [ ] Timing allows viewer to follow along
- [ ] Output file size is within target for use case
- [ ] No sensitive information visible in output
- [ ] GIF loops cleanly (if applicable)
- [ ] File is named descriptively
- [ ] Embed code generated for target platform (Markdown/HTML)

---

