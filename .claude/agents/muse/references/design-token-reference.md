# muse — デザイントークン リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## TOKEN SYSTEM QUICK REFERENCE

> Full token definitions, scales, naming, audit patterns → `references/token-system.md`
> Token lifecycle (propose, adopt, deprecate, remove) → `references/token-lifecycle.md`

### Token Layers

| Layer | Purpose | Examples |
|-------|---------|---------|
| **Primitive** | Raw values | `blue-500`, `gray-100`, `space-4` |
| **Semantic** | Context-aware aliases | `bg-primary`, `text-secondary`, `border-focus` |
| **Component** | Component-specific | `button-radius`, `card-shadow`, `input-border` |

### Naming Convention

```
--{category}-{property}-{variant}-{state}

--color-bg-primary          --color-text-secondary
--space-padding-card        --font-size-heading-lg
--radius-button             --shadow-card-hover
```

### Modern Token Formats

| Format | Tool | Key Feature |
|--------|------|-------------|
| **CSS Custom Properties** | Universal | Native browser support |
| **W3C DTCG** | Style Dictionary v4 | `$value`, `$type` standard |
| **Tailwind v4** | `@theme` in CSS | CSS-first configuration |
| **Panda CSS** | `semanticTokens` | Built-in dark mode per token |
| **Open Props** | CSS library | Pre-built token baseline |
| **Token Studio** | Figma plugin | Git sync, multi-theme |

---

## DARK MODE ESSENTIALS

> Full checklist, implementation strategies, adaptation rules → `references/dark-mode.md`

### Quick Checklist

- [ ] Semantic colors properly inverted (bg light→dark, text dark→light)
- [ ] Contrast meets WCAG AA (4.5:1 text, 3:1 large text / UI)
- [ ] No pure white on dark backgrounds, no pure black on light
- [ ] Icons use `currentColor` or have dark variants
- [ ] Shadows adjusted (lighter/replaced with borders in dark mode)
- [ ] Form inputs, focus states, disabled states all work
- [ ] Elevation via lightness in dark mode (higher = lighter bg)

### Implementation Strategies

| Strategy | Best For | Mechanism |
|----------|----------|-----------|
| CSS Custom Properties | Most projects | `[data-theme="dark"]` override |
| `prefers-color-scheme` | System-only toggle | Media query |
| Tailwind `dark:` | Tailwind projects | `darkMode: 'class'` |
| `color-scheme` property | Browser defaults | Auto form/scrollbar |

---

## DESIGN SYSTEM OVERVIEW

> Full layers, file structure, construction phases, metrics → `references/design-system-construction.md`

### Design System Health Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Token Coverage | 95%+ | Audit for hardcoded values |
| Dark Mode Support | 100% | Checklist verification |
| Component Token Usage | 100% | No magic numbers in components |
| Documentation Currency | < 1 sprint | Last update date |

### Framework Integration Summary

| Framework | Token Mechanism | Dark Mode |
|-----------|----------------|-----------|
| **CSS Custom Properties** | `:root { --token: value }` | `[data-theme="dark"]` |
| **Tailwind v3** | `theme.extend` in config | `darkMode: 'class'` |
| **Tailwind v4** | `@theme { --token }` in CSS | Built-in |
| **Panda CSS** | `semanticTokens` | `{ base, _dark }` per token |
| **CSS-in-JS** | Theme object | ThemeProvider |
| **CSS Modules** | `var(--token)` | Inherits from root |

---

## FIGMA SYNC

> Full workflow, Style Dictionary config, Token Studio, CI automation → `references/figma-sync.md`

### Sync Workflow

```
Figma Variables → tokens.json → Style Dictionary → CSS/Tailwind → Components
```

### Tool Comparison

| Tool | Format | Git Sync | Multi-theme | DTCG Support |
|------|--------|----------|-------------|--------------|
| **Token Studio** | Custom JSON | Built-in | Yes | Partial |
| **Figma Variables** | Figma API | Via CI | Yes | No |
| **Style Dictionary v4** | DTCG `.tokens.json` | N/A (build tool) | Yes | Yes |

---

