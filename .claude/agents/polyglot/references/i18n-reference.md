# polyglot — 国際化 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## I18N Quick Reference

### Library Setup

| Library | Framework | Best For |
|---------|-----------|----------|
| i18next + react-i18next | React | Large React apps, rich ecosystem |
| next-intl / i18next | Next.js | App Router, Server Components |
| react-intl (FormatJS) | React | ICU-heavy projects |
| vue-i18n | Vue 3 | Vue projects (Composition API) |

> **Detail**: See `references/library-setup.md` for full installation and configuration guides.

### Intl API Patterns

| API | Purpose | Example |
|-----|---------|---------|
| `Intl.DateTimeFormat` | Locale-aware dates | `2024年1月15日` |
| `Intl.NumberFormat` | Numbers, currency, percent | `￥1,234,568` |
| `Intl.RelativeTimeFormat` | Relative time | `3日前` |
| `Intl.ListFormat` | List formatting | `A、B、C` |
| `Intl.PluralRules` | Plural categories | `one` / `other` |
| `Intl.DisplayNames` | Language/region names | `英語`, `日本` |

> **Detail**: See `references/intl-api-patterns.md` for full code examples and performance tips.

### ICU Message Format

| Pattern | Syntax | Use Case |
|---------|--------|----------|
| Plural | `{count, plural, one {# item} other {# items}}` | Countable items |
| Select | `{gender, select, male {He} female {She} other {They}}` | Gender/type variants |
| SelectOrdinal | `{n, selectordinal, one {#st} two {#nd} ...}` | Ordinal numbers |
| Nested | `{count, plural, =0 {Empty} other {{name} and # others}}` | Complex messages |

> **Detail**: See `references/icu-message-format.md` for full patterns and key naming conventions.

### RTL Support

| Approach | When to Use |
|----------|-------------|
| CSS logical properties | Always (replace physical left/right with start/end) |
| Dynamic `dir` attribute | When supporting RTL languages (ar, he, fa, ur) |
| Icon flipping | Directional icons (arrows, chevrons) in RTL |
| Bidi isolation | Mixed LTR/RTL content (phone numbers, emails in RTL) |

> **Detail**: See `references/rtl-support.md` for CSS mappings, components, and testing checklist.

---

## Code Standards

### Good Patterns

```typescript
// Interpolation and Plurals
// en.json: "items_count": "{count, plural, =0 {No items} one {# item} other {# items}}"
<p>{t('cart.items_count', { count: items.length })}</p>

// Date Formatting with Intl
<span>{new Intl.DateTimeFormat(i18n.language).format(date)}</span>

// Currency with locale
<span>{new Intl.NumberFormat(i18n.language, {
  style: 'currency',
  currency: userCurrency,
}).format(price)}</span>
```

### Anti-Patterns

```typescript
// BAD: Hardcoded string
<p>Welcome back!</p>

// BAD: String Concatenation (Breaks word order in other langs)
<p>{"You have " + count + " messages"}</p>

// BAD: Hardcoded date format
<span>{date.toLocaleDateString('en-US')}</span>

// BAD: Hardcoded currency symbol
<span>${price.toFixed(2)}</span>
```

---

