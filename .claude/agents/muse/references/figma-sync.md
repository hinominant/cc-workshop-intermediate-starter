# Figma Token Sync

Figma Variables sync, Style Dictionary / Token Studio configuration, and diff reports.

---

## Token Sync Workflow

```
Figma Variables → tokens.json → CSS/Tailwind → Component styles
     ↑                                              |
     └──────────── Design review ←──────────────────┘
```

---

## Figma Variables Structure

```json
{
  "colors": {
    "primitive": {
      "blue-500": { "value": "#3b82f6", "type": "color" },
      "gray-100": { "value": "#f3f4f6", "type": "color" }
    },
    "semantic": {
      "bg-primary": { "value": "{colors.primitive.gray-100}", "type": "color" },
      "text-primary": { "value": "{colors.primitive.gray-900}", "type": "color" }
    }
  },
  "spacing": {
    "4": { "value": "16px", "type": "dimension" },
    "6": { "value": "24px", "type": "dimension" }
  }
}
```

---

## Style Dictionary Configuration

```js
// style-dictionary.config.js
module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables',
        options: { outputReferences: true }
      }]
    },
    tailwind: {
      transformGroup: 'js',
      buildPath: 'src/styles/',
      files: [{
        destination: 'tailwind-tokens.js',
        format: 'javascript/module'
      }]
    }
  }
};
```

### Style Dictionary v4 (DTCG support)

```js
// style-dictionary.config.mjs
import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({
  source: ['tokens/**/*.tokens.json'],
  preprocessors: ['tokens-studio'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables',
      }]
    }
  }
});

await sd.buildAllPlatforms();
```

---

## Token Studio for Figma (formerly Figma Tokens)

### Plugin Setup

1. Install "Tokens Studio for Figma" plugin
2. Connect to Git repository (GitHub/GitLab)
3. Configure token sets (primitives, semantic, component)
4. Enable automatic sync

### Token Studio JSON Format

```json
{
  "global": {
    "color": {
      "primary": {
        "value": "#3b82f6",
        "type": "color"
      }
    },
    "spacing": {
      "4": {
        "value": "16",
        "type": "spacing"
      }
    }
  },
  "light": {
    "bg": {
      "primary": {
        "value": "{global.color.neutral.50}",
        "type": "color"
      }
    }
  },
  "dark": {
    "bg": {
      "primary": {
        "value": "{global.color.neutral.900}",
        "type": "color"
      }
    }
  }
}
```

### Git Sync Configuration

```json
// .tokens-studio.json
{
  "provider": "github",
  "repository": "org/design-tokens",
  "branch": "main",
  "filePath": "tokens/",
  "commitMessage": "style(tokens): sync from Figma"
}
```

---

## CI/CD Automation

### GitHub Actions Token Sync

```yaml
# .github/workflows/sync-tokens.yml
name: Sync Figma Tokens
on:
  workflow_dispatch:
  schedule:
    - cron: '0 9 * * 1'  # Weekly Monday 9am

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Export Figma Variables
        uses: figma/export-variables-action@v1
        with:
          file-id: ${{ secrets.FIGMA_FILE_ID }}
          token: ${{ secrets.FIGMA_TOKEN }}
          output: tokens/figma-export.json
      - name: Transform tokens
        run: npx style-dictionary build
      - name: Create PR
        uses: peter-evans/create-pull-request@v5
        with:
          title: 'style(tokens): sync from Figma'
          body: 'Automated token sync from Figma Variables'
```

### Manual Token Sync

```bash
# 1. Export from Figma Tokens plugin / Token Studio
# File → Export → tokens.json

# 2. Transform to CSS
npx style-dictionary build

# 3. Verify changes
git diff src/styles/tokens.css

# 4. Run visual regression
npm run test:visual
```

---

## Token Diff Report

When tokens change, generate a diff report:

```markdown
### Token Sync Report

**Source**: Figma file `Design System v2.1`
**Sync Date**: YYYY-MM-DD

| Token | Previous | New | Impact |
|-------|----------|-----|--------|
| --color-primary | #3b82f6 | #2563eb | 12 components |
| --space-4 | 16px | 1rem | Unit change only |
| --radius-lg | NEW | 12px | New token added |

**Breaking Changes**: 0
**New Tokens**: 1
**Modified Tokens**: 2

**Action Required**:
- [ ] Review color-primary change for contrast
- [ ] Update Storybook documentation
```
