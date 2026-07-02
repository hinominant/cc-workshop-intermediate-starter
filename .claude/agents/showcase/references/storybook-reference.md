# showcase — Storybook リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## OPERATING MODES

### Mode 1: CREATE (Story / Fixture Creation)

**Trigger Keywords**: "story作成", "ストーリー追加", "Storybook化", "fixture作成", "Cosmos化"

**Process**:
1. Detect project tool (Storybook / Cosmos / Histoire / Ladle)
2. Analyze component props, variants, and states
3. Generate story/fixture file in matching format
4. Create stories for all variants (default, hover, focus, disabled, etc.)
5. Add interaction tests (play functions or fixture controls)
6. Configure a11y testing parameters
7. Generate autodocs or MDX documentation

**Output**: `ComponentName.stories.tsx` or `ComponentName.fixture.tsx` + documentation

### Mode 2: MAINTAIN (Story Maintenance)

**Trigger Keywords**: "ストーリー更新", "Storybook修正", "CSF3移行", "fixture更新"

**Process**:
1. Analyze existing story/fixture structure
2. Identify issues (broken stories, missing states, outdated format)
3. Migrate CSF 2 → CSF 3 if needed
4. Add missing variants and states
5. Update interaction tests
6. Verify visual regression baselines

**Output**: Updated story/fixture files + migration report

### Mode 3: AUDIT (Coverage Audit)

**Trigger Keywords**: "Storybook監査", "カバレッジ確認", "story audit"

**Process**:
1. Scan components directory for all components
2. Compare against existing stories/fixtures
3. Calculate coverage by category (Atoms/Molecules/Organisms)
4. Score story quality (variants, a11y, interactions, docs)
5. Generate prioritized improvement list

**Output**: Showcase health report + action items

See `references/storybook-patterns.md` for CSF 3.0 templates, Storybook 8.5+ features, and audit report format.

---

## TOOL SUPPORT MATRIX

| Tool | Framework | Format | When to Use | Reference |
|------|-----------|--------|-------------|-----------|
| **Storybook** | React/Vue/Svelte | CSF 3.0 | Design systems, docs, visual regression | `references/storybook-patterns.md` |
| **React Cosmos** | React | Fixtures | Fast iteration, isolated dev, zero-config | `references/react-cosmos-guide.md` |
| **Histoire** | Vue/Svelte | `.story.vue` | Native Vue/Svelte projects | `references/framework-alternatives.md` |
| **Ladle** | React | CSF-like | Large codebases needing fast startup | `references/framework-alternatives.md` |

### Tool Detection

```
1. Check for .storybook/ directory → Storybook
2. Check for cosmos.config.json → React Cosmos
3. Check for histoire.config.ts → Histoire
4. Check for .ladle/ directory → Ladle
5. Check package.json dependencies → Infer from installed packages
6. None found → Ask user via ON_TOOL_SELECTION trigger
```

---

## REACT COSMOS 6 (Key Patterns)

React Cosmos is a lightweight, fixture-based component explorer for React.

### Quick Reference

| Pattern | API | Use Case |
|---------|-----|----------|
| Multi-variant fixture | `export default { name1: <C />, name2: <C /> }` | Multiple variants in one file |
| Controlled input | `useFixtureInput('label', defaultValue)` | Text/number/boolean controls |
| Select control | `useFixtureSelect('name', { options, defaultValue })` | Dropdown selection |
| Managed state | `useValue('name', { defaultValue })` | Bidirectional state control |
| Global decorator | `src/cosmos.decorator.tsx` | Theme/provider wrapping |
| Scoped decorator | `dir/cosmos.decorator.tsx` | Per-directory providers |
| Lazy fixture | `lazy(() => import('./Heavy'))` | Code-splitting heavy components |

### Cosmos ↔ Storybook Coexistence

```
src/components/Button/
├── Button.tsx              # Component
├── Button.fixture.tsx      # Cosmos fixture (dev iteration)
├── Button.stories.tsx      # Storybook story (docs & visual tests)
└── Button.test.tsx         # Unit tests
```

See `references/react-cosmos-guide.md` for full Cosmos 6 guide including server fixtures, decorators, MSW integration, visual snapshots, and migration patterns.

---

## VISUAL REGRESSION TESTING

| Tool | Cost | Best For |
|------|------|----------|
| **Chromatic** | Paid (free tier) | Design systems, Storybook-native |
| **Playwright** | Free | Budget-conscious, CI-integrated |
| **Lost Pixel** | Free (OSS) | Open source projects |
| **Loki** | Free | Local testing |

### Tags for Visual Testing

```typescript
const meta = {
  component: Button,
  tags: ['autodocs', 'visual-test'],
} satisfies Meta<typeof Button>;

// Exclude animated stories (flaky)
export const Animated: Story = {
  tags: ['!visual-test'],
};
```

See `references/visual-regression.md` for Chromatic setup, Playwright visual tests, test runner config, and CI workflows.

---

