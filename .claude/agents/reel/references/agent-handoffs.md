# Agent Handoff Formats

Collaboration formats and handoff templates between Reel and other agents.

---

## Collaboration Pattern Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                      Reel Collaboration                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Pattern A: CLI Demo                                             │
│   ┌───────┐         ┌──────┐         ┌───────┐                  │
│   │ Anvil │ ──────► │ Reel │ ──────► │ Quill │                  │
│   └───────┘         └──────┘         └───────┘                  │
│   (CLI ready)    (Record demo)   (README GIF embed)              │
│                                                                  │
│  Pattern B: Prototype Demo                                       │
│   ┌───────┐         ┌──────┐         ┌────────┐                 │
│   │ Forge │ ──────► │ Reel │ ──────► │ Growth │                 │
│   └───────┘         └──────┘         └────────┘                 │
│   (Proto CLI)    (Showcase rec)   (Marketing use)                │
│                                                                  │
│  Pattern C: Web+Terminal Hybrid                                  │
│   ┌──────────┐      ┌──────┐         ┌──────────┐              │
│   │ Director │ ◄──► │ Reel │ ──────► │ Showcase │              │
│   └──────────┘      └──────┘         └──────────┘              │
│   (Browser rec)  (Terminal rec)   (Component docs)               │
│                                                                  │
│  Pattern D: Documentation Demo                                   │
│   ┌───────┐         ┌──────┐         ┌───────┐                  │
│   │ Scribe│ ──────► │ Reel │ ──────► │ Quill │                  │
│   └───────┘         └──────┘         └───────┘                  │
│   (Docs spec)    (Record demos)   (Embed GIFs)                   │
│                                                                  │
│  Pattern E: CI Demo Updates                                      │
│   ┌──────┐          ┌──────┐         ┌──────┐                   │
│   │ Gear │ ──────► │ Reel │ ──────► │ Gear │                   │
│   └──────┘          └──────┘         └──────┘                   │
│   (CI trigger)   (Regenerate)     (CI integrate)                 │
│                                                                  │
│  Pattern F: Production CLI Showcase                              │
│   ┌─────────┐       ┌──────┐         ┌────────┐                │
│   │ Builder │ ────► │ Reel │ ──────► │ Growth │                │
│   └─────────┘       └──────┘         └────────┘                │
│   (Prod CLI)     (Record demo)    (Marketing)                    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Pattern A: CLI Demo (Anvil -> Reel -> Quill)

After Anvil completes a CLI tool, Reel records a terminal demo. Quill then embeds
the resulting GIF/video into documentation.

### ANVIL_TO_REEL_HANDOFF

```markdown
## ANVIL_TO_REEL_HANDOFF

### CLI Summary
- **Feature**: [CLI tool / command name]
- **Status**: [Ready for demo / Beta / Stable release]
- **Binary / Entry Point**: [Path to executable or entry command]
- **Installation**: [How to install or build before recording]

### Recording Requirements
- **Recording Focus**: [Which commands and workflows to demonstrate]
- **Tool Preference**: VHS | terminalizer | asciinema
- **Output Format**: GIF | MP4 | WebM
- **Terminal Size**: [Columns x Rows, e.g., 120x35]
- **Shell Theme**: [Dark / Light / Match project branding]

### Demo Scenario
1. [Step 1: Command to run and expected output]
2. [Step 2: Command to run and expected output]
3. [Step 3: Command to run and expected output]

### Key Moments
- [Highlight 1: Feature that should be emphasized]
- [Highlight 2: Output formatting or color usage]
- [Highlight 3: Error handling or help output]

### Test Data / Environment
- **Working Directory**: [Directory to record in]
- **Fixtures**: [Sample files, configs, or data needed]
- **Environment Variables**: [Any required env vars]

### Technical Notes
- **Known Issues**: [Issues that may affect recording]
- **Workarounds**: [Steps to avoid known issues]
- **Dependencies**: [External tools or services needed]

### Anvil Insights
> Points discovered during CLI development worth showcasing

- [Insight 1]
- [Insight 2]
```

### REEL_TO_QUILL_HANDOFF (from Pattern A)

```markdown
## REEL_TO_QUILL_HANDOFF

### Recording Summary
- **Feature**: [CLI tool / command name]
- **Recording Path**: `recordings/[filename].[ext]`
- **Format**: [GIF / MP4 / WebM]
- **Duration**: [XX seconds]
- **Terminal Size**: [Columns x Rows]
- **Tool Used**: [VHS / terminalizer / asciinema]
- **Recording Date**: YYYY-MM-DD

### Content Overview
What the recording demonstrates:

1. **Opening** (0:00-0:XX): [Initial command / setup]
2. **Main Demo** (0:XX-0:XX): [Core feature demonstration]
3. **Result** (0:XX-0:XX): [Final output / summary]

### Embed Suggestions
- **Target Document**: [README.md / docs/guide.md / etc.]
- **Insert Location**: [Section heading or after specific content]
- **Embed Format**:
  ```markdown
  ![CLI Demo](./recordings/[filename].gif)
  ```

### File Size & Optimization
- **File Size**: [XX KB / MB]
- **Optimized**: [Yes/No - if GIF was optimized with gifsicle etc.]
- **Fallback**: [Static screenshot path if needed]

### Alt Text
- **Accessibility**: [Descriptive alt text for the recording]

### Notes
- [Any caveats about the recording]
- [Suggestions for documentation context]
```

---

## Pattern B: Prototype Demo (Forge -> Reel -> Growth)

After Forge builds a prototype with CLI interaction, Reel records a showcase demo.
Growth uses the recording for marketing purposes.

### FORGE_TO_REEL_HANDOFF

```markdown
## FORGE_TO_REEL_HANDOFF

### Prototype Summary
- **Feature**: [Prototype feature name]
- **Status**: [Functional MVP / Proof of Concept / Interactive Mock]
- **Entry Command**: [How to launch the prototype CLI]
- **Files**:
  - Entry point: `[path/to/main]`
  - Config: `[path/to/config]` (if any)

### Recording Requirements
- **Target Audience**: [Investors / Internal team / Early adopters]
- **Recording Focus**: [Which workflow to showcase]
- **Tool Preference**: VHS | terminalizer | asciinema
- **Output Format**: GIF | MP4 | WebM
- **Terminal Size**: [Columns x Rows]

### Demo Flow
1. [Step 1: Command - What happens - Why it matters]
2. [Step 2: Command - What happens - Why it matters]
3. [Step 3: Command - What happens - Why it matters]

### Key Selling Points
Moments that should be visually emphasized:

| Timestamp (approx) | Action | Why It Matters |
|---------------------|--------|----------------|
| ~0:05 | [Action] | [Value proposition] |
| ~0:15 | [Action] | [Value proposition] |
| ~0:25 | [Action] | [Value proposition] |

### Test Data / Environment
- **Fixtures**: [Sample data or mock files needed]
- **Environment**: [Required setup, env vars, services]
- **Cleanup**: [How to reset state between takes]

### Technical Notes
- **Known Issues**: [Prototype limitations affecting recording]
- **Workarounds**: [How to avoid issues during demo]
- **Timing**: [Suggested typing speed and pause durations]

### Forge Insights
> Observations from prototyping that enhance the demo

- [Insight 1]
- [Insight 2]
```

### REEL_TO_GROWTH_HANDOFF (from Pattern B)

```markdown
## REEL_TO_GROWTH_HANDOFF

### Recording Summary
- **Feature**: [Feature name]
- **Recording Path**: `recordings/[filename].[ext]`
- **Format**: [GIF / MP4 / WebM]
- **Duration**: [XX seconds]
- **Terminal Size**: [Columns x Rows]
- **Tool Used**: [VHS / terminalizer / asciinema]
- **Recording Date**: YYYY-MM-DD

### Marketing Usage
- **Primary Use**: [Landing page / Social media / Blog post / Email]
- **Target Platforms**: [Web / Twitter / LinkedIn / Product Hunt]
- **Aspect Ratio**: [Standard terminal / Cropped / Custom]

### Key Messages
Messages conveyed by the recording:

1. [Message 1: e.g., "One command to get started"]
2. [Message 2: e.g., "Beautiful output formatting"]
3. [Message 3: e.g., "Fast and reliable"]

### Highlights for Marketing

| Timestamp | Highlight | Marketing Angle |
|-----------|-----------|-----------------|
| 0:05 | [Action] | [Selling point] |
| 0:15 | [Action] | [Selling point] |
| 0:25 | [Action] | [Selling point] |

### Suggested Derivatives
Derivative content possible from this recording:

- [ ] Short loop GIF (5-10 seconds) for social media
- [ ] Full-length GIF for landing page
- [ ] Static screenshot of key moment
- [ ] Annotated version with callouts

### Technical Specifications
- **Format**: [GIF / MP4 / WebM]
- **Resolution**: [Pixel dimensions]
- **Frame Rate**: [fps]
- **File Size**: [XX KB / MB]
- **Color Scheme**: [Dark / Light / Custom]

### Notes
- [Notes for marketing usage]
- [Any test/dummy data visible in recording]
- [Branding considerations]
```

---

## Pattern C: Web+Terminal Hybrid (Director + Reel -> Showcase)

Director records browser interactions while Reel records terminal interactions.
The combined output goes to Showcase for component documentation.

### DIRECTOR_REEL_COLLAB

```markdown
## DIRECTOR_REEL_COLLAB

### Feature Overview
- **Feature**: [Feature requiring both browser and terminal recording]
- **Coordination**: [Sequential / Side-by-side / Picture-in-picture]

### Director Scope (Browser)
- **URL**: [Page to record]
- **Interactions**: [Browser actions to capture]
- **Output Path**: `demos/output/[feature]_browser.[ext]`

### Reel Scope (Terminal)
- **Commands**: [Terminal commands to capture]
- **Recording Focus**: [What terminal activity to show]
- **Tool Preference**: VHS | terminalizer | asciinema
- **Output Format**: GIF | MP4 | WebM
- **Output Path**: `recordings/[feature]_terminal.[ext]`

### Synchronization Plan
How browser and terminal recordings align:

| Time | Director (Browser) | Reel (Terminal) |
|------|-------------------|-----------------|
| 0:00 | [Browser action] | [Terminal action] |
| 0:10 | [Browser action] | [Terminal action] |
| 0:20 | [Browser action] | [Terminal action] |

### Combined Output
- **Composition**: [Side-by-side / Sequential / Overlay]
- **Final Format**: [GIF / MP4 / WebM]
- **Final Path**: `demos/output/[feature]_combined.[ext]`

### Notes
- [Timing coordination details]
- [Which recording should be primary focus]
- [Resolution and sizing considerations for composition]
```

### REEL_TO_SHOWCASE_HANDOFF

```markdown
## REEL_TO_SHOWCASE_HANDOFF

### Recording Summary
- **Feature**: [Feature name]
- **Recording Path**: `recordings/[filename].[ext]`
- **Format**: [GIF / MP4 / WebM]
- **Duration**: [XX seconds]
- **Tool Used**: [VHS / terminalizer / asciinema]
- **Recording Date**: YYYY-MM-DD

### Component Context
- **Related Component**: `[ComponentPath]`
- **Component Type**: [CLI wrapper / Terminal UI / Output display]
- **Props/Config**: [Relevant configuration shown in recording]

### Terminal Interaction Breakdown

| Timestamp | Command / Input | Output / State Change |
|-----------|----------------|----------------------|
| 0:03 | [Command] | [Output summary] |
| 0:08 | [Command] | [Output summary] |
| 0:15 | [Command] | [Output summary] |

### Story Requirements
Stories that should reference or embed this recording:

- **Default Usage**: Show standard command execution
- **Error State**: Show error output and recovery
- **Advanced Usage**: Show flags, options, or piping
- **Interactive Mode**: Show interactive prompts (if applicable)

### Embed Instructions
```markdown
<!-- For Storybook MDX -->
<video src="./recordings/[filename].webm" controls width="640" />

<!-- Or GIF embed -->
![Terminal Demo](./recordings/[filename].gif)
```

### Notes
- [How the terminal recording relates to the component]
- [Suggested story organization]
```

---

## Pattern D: Documentation Demo (Scribe -> Reel -> Quill)

Scribe identifies documentation sections that need demo recordings.
Reel creates the recordings, then Quill embeds them.

### SCRIBE_TO_REEL_HANDOFF

```markdown
## SCRIBE_TO_REEL_HANDOFF

### Documentation Context
- **Document**: [Document path or title]
- **Section**: [Section that needs a demo]
- **Documentation Type**: [Tutorial / Reference / How-to / Quickstart]
- **Target Audience**: [Beginners / Intermediate / Advanced developers]

### Recording Requirements
- **Recording Focus**: [Exactly what the demo should show]
- **Tool Preference**: VHS | terminalizer | asciinema
- **Output Format**: GIF | MP4 | WebM
- **Terminal Size**: [Columns x Rows, e.g., 80x24 for narrow docs]
- **Max Duration**: [Seconds - keep short for docs]

### Demo Scenarios
Each scenario corresponds to a documentation section:

#### Scenario 1: [Section Title]
1. [Command to run]
2. [Expected output to show]
3. [Key point to emphasize]

#### Scenario 2: [Section Title]
1. [Command to run]
2. [Expected output to show]
3. [Key point to emphasize]

### Style Guidelines
- **Typing Speed**: [Slow for tutorials / Normal for reference]
- **Pauses**: [Where to pause for readability]
- **Comments**: [Whether to show inline comments / explanations]
- **Prompt Style**: [$ / > / custom prompt]

### Output Naming Convention
- `recordings/docs/[section]-demo.[ext]`

### Notes
- [Documentation conventions to follow]
- [Existing demo style to match]
```

### REEL_TO_QUILL_HANDOFF (from Pattern D)

```markdown
## REEL_TO_QUILL_HANDOFF

### Recording Summary
- **Feature**: [Documentation topic]
- **Recordings**:
  - `recordings/docs/[scenario1]-demo.[ext]` ([XX seconds])
  - `recordings/docs/[scenario2]-demo.[ext]` ([XX seconds])
- **Tool Used**: [VHS / terminalizer / asciinema]
- **Recording Date**: YYYY-MM-DD

### Documentation Mapping
Which recording maps to which documentation section:

| Recording File | Target Document | Target Section | Duration |
|---------------|-----------------|----------------|----------|
| `[file1]` | `[doc path]` | [Section heading] | [Xs] |
| `[file2]` | `[doc path]` | [Section heading] | [Xs] |

### Embed Suggestions
For each recording:

#### [Recording 1]
- **Insert After**: [Preceding paragraph or heading]
- **Embed Format**: `![Demo](./recordings/docs/[file].gif)`
- **Caption**: [Suggested caption text]
- **Alt Text**: [Accessibility description]

#### [Recording 2]
- **Insert After**: [Preceding paragraph or heading]
- **Embed Format**: `![Demo](./recordings/docs/[file].gif)`
- **Caption**: [Suggested caption text]
- **Alt Text**: [Accessibility description]

### File Sizes
| Recording | Original Size | Optimized Size |
|-----------|--------------|----------------|
| `[file1]` | [XX MB] | [XX KB] |
| `[file2]` | [XX MB] | [XX KB] |

### Notes
- [Optimization details (gifsicle, ffmpeg settings used)]
- [Any recordings that may need re-recording]
```

---

## Pattern E: CI Demo Updates (Gear -> Reel -> Gear)

Gear triggers demo regeneration (e.g., after CLI changes in CI).
Reel regenerates recordings, then hands back to Gear for CI integration.

### GEAR_TO_REEL_HANDOFF

```markdown
## GEAR_TO_REEL_HANDOFF

### CI Context
- **Trigger**: [What triggered regeneration: version bump / feature merge / scheduled]
- **Pipeline**: [CI pipeline name or path]
- **Commit/PR**: [Reference to triggering commit or PR]

### Recording Requirements
- **Recordings to Regenerate**:
  - `recordings/[file1].[ext]` - [Reason for regeneration]
  - `recordings/[file2].[ext]` - [Reason for regeneration]
- **Tool Preference**: VHS | terminalizer | asciinema
- **Output Format**: GIF | MP4 | WebM
- **Headless**: [Yes / No - whether recording runs in headless CI]

### VHS Tape Files (if using VHS)
- `tapes/[tape1].tape` - [Description]
- `tapes/[tape2].tape` - [Description]

### Environment Setup
- **Docker Image**: [Image to use for consistent environment]
- **Dependencies**: [Tools that must be installed]
- **Build Step**: [Command to build CLI before recording]
- **Env Vars**: [CI-specific environment variables]

### Validation Criteria
How to verify recordings are correct:

- [ ] Recording file exists and is non-empty
- [ ] Duration is within expected range ([X-Y seconds])
- [ ] File size is within acceptable limits ([X-Y KB])
- [ ] No error output visible in recording
- [ ] Version string in output matches current version

### Notes
- [CI-specific constraints (timeout, resources)]
- [Caching strategy for recordings]
```

### REEL_TO_GEAR_HANDOFF

```markdown
## REEL_TO_GEAR_HANDOFF

### Recording Results
- **Status**: [All succeeded / Partial failure / All failed]
- **Date**: YYYY-MM-DD
- **Triggered By**: [Commit SHA / PR number]

### Updated Recordings

| Recording | Status | Duration | Size | Tool |
|-----------|--------|----------|------|------|
| `recordings/[file1].[ext]` | [OK / Failed] | [Xs] | [KB] | [VHS/terminalizer/asciinema] |
| `recordings/[file2].[ext]` | [OK / Failed] | [Xs] | [KB] | [VHS/terminalizer/asciinema] |

### CI Integration
- **Artifact Paths**: [Where recordings are stored as CI artifacts]
- **Cache Keys**: [Cache keys for recording artifacts]
- **Commit Strategy**: [Auto-commit / PR / Manual review]

### VHS Tape Updates (if applicable)
- `tapes/[tape1].tape` - [Updated / No change]
- `tapes/[tape2].tape` - [Updated / No change]

### Failures (if any)
| Recording | Error | Root Cause | Suggested Fix |
|-----------|-------|------------|---------------|
| `[file]` | [Error message] | [Why it failed] | [How to fix] |

### Notes
- [Performance observations]
- [Suggested CI configuration changes]
```

---

## Pattern F: Production CLI Showcase (Builder -> Reel -> Growth)

After Builder ships a production CLI release, Reel records polished demos.
Growth uses the recordings for marketing and announcements.

### BUILDER_TO_REEL_HANDOFF

```markdown
## BUILDER_TO_REEL_HANDOFF

### Release Summary
- **CLI Tool**: [Tool name and version]
- **Release Type**: [Major / Minor / Patch]
- **Status**: [Released / Release candidate]
- **Installation**: [How to install the released version]
- **Changelog**: [Link or summary of changes]

### Recording Requirements
- **Recording Focus**: [New features / Full overview / Migration guide]
- **Tool Preference**: VHS | terminalizer | asciinema
- **Output Format**: GIF | MP4 | WebM
- **Terminal Size**: [Columns x Rows]
- **Quality**: [Production polish - clean prompts, branded theme]

### Demo Scenarios

#### Scenario 1: [New Feature / Headline Change]
1. [Command showing new feature]
2. [Expected output]
3. [Why users should care]

#### Scenario 2: [Improved Workflow]
1. [Command showing improvement]
2. [Before vs. after comparison if applicable]
3. [Performance or UX improvement to highlight]

### Branding Requirements
- **Shell Theme**: [Specific theme or color scheme]
- **Prompt Format**: [Custom prompt to use]
- **Font**: [Specific font if applicable]
- **Watermark**: [Branding overlay if needed]

### Test Data
- **Sample Project**: [Project or data to demo against]
- **Expected Outputs**: [What the successful output looks like]
- **Cleanup**: [How to reset between recording attempts]

### Builder Insights
> Points from the release process worth highlighting

- [Insight 1: Performance improvements]
- [Insight 2: Breaking changes to address]
```

### REEL_TO_GROWTH_HANDOFF (from Pattern F)

```markdown
## REEL_TO_GROWTH_HANDOFF

### Recording Summary
- **CLI Tool**: [Tool name and version]
- **Recording Path**: `recordings/release/[tool]-v[X.Y.Z].[ext]`
- **Format**: [GIF / MP4 / WebM]
- **Duration**: [XX seconds]
- **Tool Used**: [VHS / terminalizer / asciinema]
- **Recording Date**: YYYY-MM-DD

### Release Marketing Context
- **Release Type**: [Major / Minor / Patch]
- **Key Message**: [One-line summary of what is new]
- **Target Audience**: [Existing users / New users / Both]

### Highlights for Announcement

| Timestamp | Feature Shown | Marketing Copy Suggestion |
|-----------|--------------|--------------------------|
| 0:05 | [Feature] | [Suggested tagline] |
| 0:15 | [Feature] | [Suggested tagline] |
| 0:25 | [Feature] | [Suggested tagline] |

### Suggested Derivatives
- [ ] Hero GIF for release blog post
- [ ] Short loop for Twitter/X announcement
- [ ] Product Hunt gallery asset
- [ ] Changelog embed
- [ ] README badge or header image

### Technical Specifications
- **Format**: [GIF / MP4 / WebM]
- **Resolution**: [Pixel dimensions]
- **Frame Rate**: [fps]
- **File Size**: [XX KB / MB]
- **Optimized**: [Yes / No]

### Files Provided
- Full recording: `recordings/release/[tool]-v[X.Y.Z].[ext]`
- Short clip: `recordings/release/[tool]-v[X.Y.Z]-short.[ext]` (if created)
- Screenshot: `recordings/release/[tool]-v[X.Y.Z]-hero.png` (if created)

### Notes
- [Version number visible in recording]
- [Any dummy data or test output to be aware of]
- [Licensing or attribution requirements for shown content]
```

---

## Handoff Best Practices

### 1. Specify Tool and Format Early

Always indicate the preferred recording tool (VHS, terminalizer, asciinema) and output
format (GIF, MP4, WebM) in the handoff. Each tool has different strengths:

- **VHS**: Best for reproducible, scripted recordings (tape files in version control)
- **terminalizer**: Good for interactive recordings with editing capabilities
- **asciinema**: Best for text-based recordings with copy-paste support

### 2. Include Terminal Dimensions

Always specify terminal size (columns x rows). This affects readability and
embedding layout. Common sizes:
- Documentation: 80x24 (narrow, fits in docs)
- Showcase: 120x35 (wider, more detail)
- Social media: 80x20 (compact, focused)

### 3. Keep Recordings Short

Terminal recordings should be concise:
- Documentation demos: 10-30 seconds
- Feature showcases: 15-45 seconds
- Full walkthroughs: 30-90 seconds max

### 4. Provide Exact Commands

Include the exact commands and expected outputs. Reel should not need to guess
what to type or what the output looks like.

### 5. Note Environment Requirements

Specify any setup needed before recording: installed tools, environment variables,
sample data, specific shell configuration, or cleanup steps between takes.

### 6. Consider File Size

GIFs can be large. Note acceptable file size limits and whether optimization
(gifsicle, ffmpeg) should be applied. For docs, prefer smaller files.
