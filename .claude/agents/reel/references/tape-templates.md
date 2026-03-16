# VHS Tape Templates Reference

Reusable .tape templates for common terminal recording scenarios.
Each template is copy-paste-ready with inline comments explaining each section.

---

## 1. Quickstart Template

A concise "install and run" demo. Ideal for README hero images and getting-started guides.
Target duration: under 15 seconds.

```tape
# Quickstart Demo
# Shows: package installation → first command execution
# Duration: ~12 seconds

Output quickstart.gif

# --- Terminal settings ---
Set FontSize 16
Set Width 80
Set Height 20
Set Theme "Catppuccin Mocha"
Set Padding 20
Set TypingSpeed 60ms

# --- Recording ---

# Install the package
Type "npm install -g mycli"
Enter
Sleep 3

# Run the first command
Type "mycli hello --name world"
Enter
Sleep 2

# Let the viewer read the output
Sleep 3
```

### Customization Notes

| Placeholder | Replace with |
|---|---|
| `mycli` | Your CLI tool name |
| `npm install -g mycli` | Your install command (brew, pip, cargo, etc.) |
| `mycli hello --name world` | Your flagship command |
| `quickstart.gif` | Desired output filename (.gif, .mp4, .webm) |

---

## 2. Feature Demo Template

Showcase a specific CLI feature with flags and options.
Shows help text first, then demonstrates the feature with realistic data.

```tape
# Feature Demo
# Shows: help output → feature execution with flags → result
# Duration: ~20 seconds

Output feature-demo.gif

# --- Terminal settings ---
Set FontSize 14
Set Width 100
Set Height 28
Set Theme "Catppuccin Mocha"
Set Padding 16
Set TypingSpeed 50ms

# --- Recording ---

# Show the help text for context
Type "mycli convert --help"
Enter
Sleep 3

# Demonstrate the feature with realistic flags
Type "mycli convert input.csv --format json --pretty --output result.json"
Enter
Sleep 3

# Verify the output
Type "cat result.json | head -20"
Enter
Sleep 3

# Show success summary
Type "mycli convert --stats"
Enter
Sleep 3
```

### Customization Notes

| Placeholder | Replace with |
|---|---|
| `mycli convert` | Your subcommand |
| `--format json --pretty` | Your feature flags |
| `input.csv`, `result.json` | Realistic filenames for your domain |
| `--stats` | Optional verification command |

---

## 3. Before-After Template

Two-phase recording showing improvement (performance, output quality, workflow).
Uses Hide/Show to silently set up state, then reveals the visible session.

```tape
# Before-After Comparison
# Shows: "before" state → transition → "after" state
# Duration: ~25 seconds

Output before-after.gif

# --- Terminal settings ---
Set FontSize 14
Set Width 100
Set Height 28
Set Theme "Catppuccin Mocha"
Set Padding 16
Set TypingSpeed 50ms

# --- Silent setup: prepare the "before" environment ---
Hide

# Create sample files or set up initial state
Type "mkdir -p /tmp/demo && cd /tmp/demo"
Enter
Sleep 1
Type "echo 'legacy config' > config.old.yml"
Enter
Sleep 0.5

Show

# --- BEFORE phase ---
Type "# Before: legacy config format (slow, verbose)"
Enter
Sleep 1

Type "cat config.old.yml"
Enter
Sleep 2

Type "time mycli build --config config.old.yml"
Enter
Sleep 4

# --- Transition ---
Type ""
Enter
Type "# After: new optimized config"
Enter
Sleep 1

# --- Silent setup: prepare the "after" environment ---
Hide

Type "echo 'optimized: true' > config.new.yml"
Enter
Sleep 0.5

Show

# --- AFTER phase ---
Type "cat config.new.yml"
Enter
Sleep 2

Type "time mycli build --config config.new.yml"
Enter
Sleep 4

# Let the viewer compare results
Sleep 3
```

### Customization Notes

| Placeholder | Replace with |
|---|---|
| `config.old.yml` / `config.new.yml` | Your before/after artifacts |
| `mycli build --config` | Your build or processing command |
| `time` prefix | Use if showing performance improvement |
| `Hide` / `Show` blocks | Add more setup steps as needed |

---

## 4. Interactive Session Template

Demonstrate interactive prompts, menus, or wizards.
Shows a user navigating choices, entering values, and completing a flow.

```tape
# Interactive Session Demo
# Shows: wizard launch → user selections → completion
# Duration: ~30 seconds

Output interactive.gif

# --- Terminal settings ---
Set FontSize 14
Set Width 100
Set Height 30
Set Theme "Catppuccin Mocha"
Set Padding 16
Set TypingSpeed 70ms

# --- Recording ---

# Launch the interactive wizard
Type "mycli init"
Enter
Sleep 2

# Respond to "Project name?" prompt
Type "my-awesome-project"
Sleep 1
Enter
Sleep 2

# Respond to "Select framework:" menu (arrow keys to navigate)
# Use Down to move through menu items
Down
Sleep 0.5
Down
Sleep 0.5
Enter
Sleep 2

# Respond to "Use TypeScript?" (y/n prompt)
Type "y"
Enter
Sleep 2

# Respond to "Select package manager:" menu
Down
Sleep 0.5
Enter
Sleep 2

# Respond to "Confirm?" final prompt
Type "y"
Enter
Sleep 3

# Show the generated output
Type "ls -la my-awesome-project/"
Enter
Sleep 2

# Show success message
Type "cat my-awesome-project/package.json | head -10"
Enter
Sleep 3
```

### Customization Notes

| Placeholder | Replace with |
|---|---|
| `mycli init` | Your interactive command |
| `Down` / `Up` | Arrow key navigation for menus |
| `Tab` | Tab completion where applicable |
| Prompt responses | Match your CLI's actual prompts |
| `TypingSpeed 70ms` | Slower typing feels more natural for interactive |

### Key VHS Commands for Interactivity

```tape
# Navigation
Up                  # Arrow up
Down                # Arrow down
Left                # Arrow left
Right               # Arrow right
Tab                 # Tab key
Enter               # Enter/Return key
Space               # Space bar (toggle checkboxes)
Backspace           # Delete character

# Special keys
Escape              # Escape key
Ctrl+C              # Interrupt
Ctrl+D              # EOF / Exit
```

---

## 5. Error Handling Template

Show how a CLI gracefully handles errors: invalid input, missing files, network failures.
Demonstrates error messages and recovery paths.

```tape
# Error Handling Demo
# Shows: invalid input → missing file → recovery → success
# Duration: ~30 seconds

Output error-handling.gif

# --- Terminal settings ---
Set FontSize 14
Set Width 100
Set Height 28
Set Theme "Catppuccin Mocha"
Set Padding 16
Set TypingSpeed 50ms

# --- Recording ---

# Scenario 1: Invalid input
Type "# Scenario 1: Invalid input"
Enter
Sleep 1

Type "mycli process --format xml --input data.csv"
Enter
Sleep 2
# Expected output: Error: unsupported format "xml". Supported: json, yaml, toml

# Scenario 2: Missing file
Type ""
Enter
Type "# Scenario 2: Missing file"
Enter
Sleep 1

Type "mycli process --format json --input missing.csv"
Enter
Sleep 2
# Expected output: Error: file "missing.csv" not found. Check the path and try again.

# Scenario 3: Show helpful suggestions
Type ""
Enter
Type "# Scenario 3: Did-you-mean suggestion"
Enter
Sleep 1

Type "mycli proccess data.csv"
Enter
Sleep 2
# Expected output: Error: unknown command "proccess". Did you mean "process"?

# Scenario 4: Successful recovery
Type ""
Enter
Type "# Scenario 4: Correct usage"
Enter
Sleep 1

Type "mycli process --format json --input data.csv"
Enter
Sleep 3
# Expected output: Success! Processed 150 records → output.json

Sleep 3
```

### Customization Notes

| Placeholder | Replace with |
|---|---|
| `mycli process` | Your command that can demonstrate error paths |
| Error scenarios | Match your CLI's actual error messages |
| `--format xml` | An intentionally unsupported flag value |
| `proccess` | A realistic typo of your command |

### Tips for Error Demos

- Show the error message clearly, then pause so the viewer can read it
- Progress from simple errors to more complex ones
- Always end with a successful run to show recovery
- Use `Sleep` generously between scenarios for readability

---

## 6. Multi-Step Workflow Template

Complex workflow with multiple commands building on each other.
Shows a realistic terminal session where each step depends on the previous.

```tape
# Multi-Step Workflow Demo
# Shows: init → configure → execute → verify → deploy
# Duration: ~40 seconds

Output workflow.gif

# --- Terminal settings ---
Set FontSize 14
Set Width 110
Set Height 30
Set Theme "Catppuccin Mocha"
Set Padding 16
Set TypingSpeed 50ms

# --- Silent setup: prepare a clean workspace ---
Hide

Type "cd /tmp && rm -rf workflow-demo && mkdir workflow-demo && cd workflow-demo"
Enter
Sleep 1

Show

# --- Step 1: Initialize the project ---
Type "# Step 1: Initialize project"
Enter
Sleep 1

Type "mycli init --template starter"
Enter
Sleep 3

# --- Step 2: Configure ---
Type ""
Enter
Type "# Step 2: Add configuration"
Enter
Sleep 1

Type "mycli config set api-key $API_KEY"
Enter
Sleep 1

Type "mycli config set region us-east-1"
Enter
Sleep 2

# --- Step 3: Add resources ---
Type ""
Enter
Type "# Step 3: Add resources"
Enter
Sleep 1

Type "mycli add database --engine postgres --name maindb"
Enter
Sleep 2

Type "mycli add cache --engine redis --name sessions"
Enter
Sleep 2

# --- Step 4: Validate ---
Type ""
Enter
Type "# Step 4: Validate configuration"
Enter
Sleep 1

Type "mycli validate"
Enter
Sleep 3

# --- Step 5: Deploy ---
Type ""
Enter
Type "# Step 5: Deploy"
Enter
Sleep 1

Type "mycli deploy --env staging"
Enter
Sleep 5

# --- Step 6: Verify ---
Type ""
Enter
Type "# Step 6: Verify deployment"
Enter
Sleep 1

Type "mycli status --env staging"
Enter
Sleep 3

# Final pause for the viewer
Sleep 3
```

### Customization Notes

| Placeholder | Replace with |
|---|---|
| `mycli init`, `config`, `add`, etc. | Your CLI's subcommands |
| `--template starter` | Your project templates |
| Resource names (`maindb`, `sessions`) | Realistic resource identifiers |
| `--env staging` | Your deployment targets |

---

## Common Settings Reference

### Theme Options

Popular themes that work well in recordings:

```tape
Set Theme "Catppuccin Mocha"     # Dark, warm, high contrast
Set Theme "Dracula"              # Dark, purple-accented
Set Theme "Monokai"              # Dark, classic developer theme
Set Theme "One Dark"             # Dark, Atom-inspired
Set Theme "Tokyo Night"          # Dark, blue-toned
Set Theme "Catppuccin Latte"     # Light, warm tones
Set Theme "GitHub Light"         # Light, clean
```

### Output Formats

```tape
Output demo.gif                  # Animated GIF (most compatible)
Output demo.mp4                  # MP4 video (smaller file size)
Output demo.webm                 # WebM video (web-optimized)
Output frames/                   # PNG frame sequence
```

### Window Chrome

```tape
Set WindowBar Colorful           # macOS-style colored dots
Set WindowBar Rings              # Ring-style buttons
Set WindowBar Blocks             # Block-style buttons
Set WindowBarSize 40             # Height of the title bar
```

### Cursor Styles

```tape
Set CursorBlink true             # Blinking cursor
Set CursorBlink false            # Static cursor
```

### Timing Presets

```tape
# Fast demo (experienced user feel)
Set TypingSpeed 30ms

# Normal demo (natural reading pace)
Set TypingSpeed 50ms

# Slow demo (tutorial, step-by-step)
Set TypingSpeed 80ms

# Pause durations
Sleep 0.5                        # Brief pause between keystrokes
Sleep 1                          # Short pause (transition)
Sleep 2                          # Medium pause (read short output)
Sleep 3                          # Long pause (read longer output)
Sleep 5                          # Extended pause (complex output)
```

### Size Presets

```tape
# Compact (badges, quick demos)
Set Width 80
Set Height 20
Set FontSize 16

# Standard (feature demos, tutorials)
Set Width 100
Set Height 28
Set FontSize 14

# Wide (log output, multi-column layouts)
Set Width 120
Set Height 32
Set FontSize 13

# Presentation (slides, talks)
Set Width 100
Set Height 24
Set FontSize 20
```
