# Storybook Patterns & Templates

Comprehensive CSF 3.0 templates, Storybook 8.5+ features, and best practices.

---

## CSF 3.0 Templates

### Basic Component Story

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { ComponentName } from './ComponentName';

const meta = {
  title: 'Category/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Component description here',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Visual variant of the component',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
  },
  args: {
    // Default args shared across all stories
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

// === Base Stories ===

export const Default: Story = {
  args: {
    variant: 'primary',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <ComponentName variant="primary">Primary</ComponentName>
      <ComponentName variant="secondary">Secondary</ComponentName>
    </div>
  ),
};

// === State Stories ===

export const Disabled: Story = {
  args: { disabled: true },
};

export const Loading: Story = {
  args: { isLoading: true },
};

export const Error: Story = {
  args: { hasError: true, errorMessage: 'Something went wrong' },
};

// === Interaction Stories ===

export const WithInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const element = canvas.getByRole('button');
    await expect(element).toBeInTheDocument();
    await userEvent.click(element);
    await expect(element).toHaveFocus();
  },
};

// === Accessibility Stories ===

export const AccessibilityTest: Story = {
  args: { 'aria-label': 'Accessible component' },
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'label', enabled: true },
        ],
      },
    },
  },
};
```

### Form Component Story

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { Input } from './Input';

const meta = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'number'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Enter text...' },
};

export const WithLabel: Story = {
  args: { label: 'Email', placeholder: 'you@example.com', type: 'email' },
};

export const WithValidation: Story = {
  args: { label: 'Required field', required: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    await userEvent.click(input);
    await userEvent.tab();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
  },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Cannot edit' },
};

export const WithError: Story = {
  args: { label: 'Email', value: 'invalid-email', error: 'Please enter a valid email address' },
};
```

---

## Storybook 8.5+ Features

### Vitest Browser Mode Integration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/experimental-addon-test/vitest-plugin';

export default defineConfig({
  plugins: [storybookTest()],
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      name: 'chromium',
    },
    setupFiles: ['.storybook/vitest.setup.ts'],
  },
});

// .storybook/vitest.setup.ts
import { beforeAll } from 'vitest';
import { setProjectAnnotations } from '@storybook/react';
import * as projectAnnotations from './preview';

beforeAll(() => {
  setProjectAnnotations(projectAnnotations);
});
```

### React Server Components (RSC) Stories

```typescript
// ServerComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ServerComponent } from './ServerComponent';

const meta = {
  title: 'RSC/ServerComponent',
  component: ServerComponent,
  parameters: {
    // Mark as server component for proper rendering
    nextjs: { appDirectory: true },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ServerComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { id: '1' },
};

// Mock async data fetching
export const WithMockedData: Story = {
  args: { id: '1' },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/data/1', () => {
          return HttpResponse.json({ title: 'Mocked Data' });
        }),
      ],
    },
  },
};
```

### @storybook/test (Unified Testing)

```typescript
import { fn, expect, within, userEvent, waitFor } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { Form } from './Form';

const meta = {
  component: Form,
  args: {
    // Type-safe mock functions
    onSubmit: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SubmitFlow: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText('Name'), 'John Doe');
    await userEvent.type(canvas.getByLabelText('Email'), 'john@example.com');
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(args.onSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
      });
    });
  },
};
```

### Portable Stories (Test Reuse)

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Click me' },
};

// Button.test.tsx - Reuse stories in unit tests
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import * as stories from './Button.stories';

const { Primary } = composeStories(stories);

test('renders primary button', () => {
  render(<Primary />);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});

test('interaction test from story', async () => {
  const { container } = render(<Primary />);
  await Primary.play?.({ canvasElement: container });
});
```

### beforeEach / afterEach Lifecycle

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent } from '@storybook/test';
import { Modal } from './Modal';

const meta = {
  component: Modal,
  beforeEach: async () => {
    localStorage.clear();
  },
  afterEach: async () => {
    // Cleanup
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OpenModal: Story = {
  beforeEach: async () => {
    localStorage.setItem('modalSeen', 'false');
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
  },
};
```

### Tags for Organization & Filtering

```typescript
const meta = {
  component: Button,
  tags: [
    'autodocs',      // Auto-generate docs
    'component',     // Category tag
    'visual-test',   // Include in visual regression
    '!dev',          // Exclude from dev sidebar
    '!test',         // Exclude from test runs
  ],
} satisfies Meta<typeof Button>;

// Filter in test runner:
// test-storybook --tags="component"
// test-storybook --tags="visual-test"
```

### Theme Testing (Dark Mode)

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  component: Button,
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
  },
  decorators: [
    (Story, context) => (
      <div data-theme={context.globals.theme || 'light'}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightMode: Story = {
  args: { children: 'Light Button' },
  parameters: { backgrounds: { default: 'light' } },
};

export const DarkMode: Story = {
  args: { children: 'Dark Button' },
  parameters: { backgrounds: { default: 'dark' } },
  globals: { theme: 'dark' },
};

export const ThemeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <div data-theme="light" style={{ padding: '1rem', background: '#fff' }}>
        <Button>Light</Button>
      </div>
      <div data-theme="dark" style={{ padding: '1rem', background: '#1a1a1a' }}>
        <Button>Dark</Button>
      </div>
    </div>
  ),
};
```

---

## MDX 3 Documentation

### Component Documentation

```mdx
{/* Button.mdx */}
import { Meta, Stories, Primary, Controls, Story } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

# Button

A button component used as the trigger for user actions.

## Usage

\`\`\`tsx
import { Button } from '@/components/Button';

<Button variant="primary">Click me</Button>
\`\`\`

## Interactive Demo

<Primary />

<Controls />

## All Variants

<Stories />

## Design Guidelines

### When to use
- Form submission
- Dialog actions
- Primary navigation

### When NOT to use
- Text links (use `<a>` instead)
- Icon-only actions (use IconButton)

## Accessibility
- `aria-label`: Required for icon-only buttons
- Keyboard: Activate with Enter/Space
- Focus: Clear focus ring is displayed
```

### MDX with Custom Blocks

```mdx
{/* ComponentDoc.mdx */}
import { Meta, Canvas, Source } from '@storybook/blocks';
import * as Stories from './Component.stories';

<Meta of={Stories} />

# Component Name

## Interactive Demo

<Canvas of={Stories.Default} />

## Code Example

<Source of={Stories.Default} />

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'primary' \| 'secondary'` | `'primary'` | Visual variant |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| disabled | `boolean` | `false` | Disabled state |
```

---

## Figma Integration

### Figma → Storybook Sync

```typescript
// .storybook/preview.ts
import { withDesign } from 'storybook-addon-designs';

export default {
  decorators: [withDesign],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/xxx',
    },
  },
};

// Button.stories.tsx
export const Primary: Story = {
  args: { variant: 'primary' },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/xxx?node-id=123:456',
    },
  },
};
```

### Design Tokens from Figma

```typescript
// tokens.ts - Generated from Figma Variables
export const tokens = {
  colors: {
    primary: { 50: '#eff6ff', 500: '#3b82f6', 900: '#1e3a8a' },
  },
  spacing: { 1: '4px', 2: '8px', 4: '16px' },
  radius: { sm: '4px', md: '8px', lg: '12px' },
};

// .storybook/preview.ts
import { tokens } from '../src/tokens';

export default {
  parameters: {
    backgrounds: {
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: tokens.colors.neutral[900] },
      ],
    },
  },
};
```

---

## Audit Report Format

```markdown
## Showcase Audit Report: [Project Name]

### Coverage Summary

| Category | Total Components | With Stories | Coverage |
|----------|------------------|--------------|----------|
| Atoms | X | Y | Z% |
| Molecules | X | Y | Z% |
| Organisms | X | Y | Z% |
| Templates | X | Y | Z% |
| **Total** | **X** | **Y** | **Z%** |

### Story Quality Scores

| Component | Variants | A11y | Interactions | Docs | Grade |
|-----------|----------|------|--------------|------|-------|
| Button | 5/5 | Pass | 3 tests | Yes | A |
| Input | 3/5 | Warn | 1 test | Yes | B |
| Modal | 2/4 | Fail | 0 tests | No | D |

### Quality Criteria

| Grade | Criteria |
|-------|----------|
| A | All variants, a11y pass, 3+ interactions, docs complete |
| B | Most variants, a11y pass/warn, 1+ interactions, docs present |
| C | Some variants, a11y warn, no interactions, partial docs |
| D | Minimal variants, a11y fail, no interactions, no docs |
| F | Story exists but broken or outdated |

### Priority Actions

1. **[Critical]** `Modal` - Add a11y testing (keyboard trap, focus management)
2. **[High]** `Input` - Add interaction tests for validation flow
3. **[Medium]** `Card` - Add hover/focus state stories
4. **[Low]** `Badge` - Add size variant stories
```

---

## Forge Enhancement Workflow

### Forge Preview → Showcase Full Coverage

```
Forge (Preview Story)              Showcase (Full Story)
├─ Default state only              ├─ All variants
├─ Prototypes/ hierarchy           ├─ Components/ hierarchy
├─ tags: ['prototype']             ├─ tags: ['autodocs', 'component']
├─ No interactions                 ├─ Play functions
├─ No a11y config                  ├─ A11y rules configured
└─ TODO comments                   └─ MDX documentation
```

### Enhancement Checklist

```markdown
## Showcase Enhancement Checklist

### Story Location
- [ ] Move from `Prototypes/` to appropriate category
- [ ] Update title path in meta

### Variant Coverage
- [ ] Add size variants (sm, md, lg)
- [ ] Add color/theme variants
- [ ] Add state variants (default, hover, focus, active, disabled)
- [ ] Add content variants (empty, minimal, maximal)

### Interaction Tests
- [ ] Add play function for primary interaction
- [ ] Add keyboard navigation test
- [ ] Add form validation test (if applicable)
- [ ] Use proper waitFor patterns (no arbitrary delays)

### Accessibility
- [ ] Configure a11y addon rules
- [ ] Add aria-label test story
- [ ] Verify color contrast
- [ ] Test keyboard focus visibility

### Documentation
- [ ] Create MDX documentation
- [ ] Add usage examples
- [ ] Document props with argTypes
- [ ] Add design guidelines section

### Visual Testing
- [ ] Add `visual-test` tag
- [ ] Exclude animated stories from visual tests
- [ ] Create baseline snapshots

### Tags Update
- [ ] Remove `prototype` tag
- [ ] Add `autodocs` tag
- [ ] Add `component` / `visual-test` tags
```

### Enhancement Template

```typescript
// BEFORE (Forge generated)
const meta = {
  component: ComponentName,
  title: 'Prototypes/ComponentName',
  tags: ['prototype'],
} satisfies Meta<typeof ComponentName>;

export const Preview: Story = {
  args: { /* default only */ },
};

// AFTER (Showcase enhanced)
const meta = {
  component: ComponentName,
  title: 'Components/ComponentName',
  tags: ['autodocs', 'visual-test'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Full component description' } },
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof ComponentName>;

export const Default: Story = { args: { variant: 'primary', size: 'md' } };
export const AllVariants: Story = { /* ... */ };
export const AllSizes: Story = { /* ... */ };
export const Disabled: Story = { /* ... */ };
export const Loading: Story = { /* ... */ };
export const WithInteraction: Story = {
  play: async ({ canvasElement }) => { /* ... */ },
};
export const AccessibilityTest: Story = {
  parameters: { a11y: { config: { rules: [/* ... */] } } },
};
```
