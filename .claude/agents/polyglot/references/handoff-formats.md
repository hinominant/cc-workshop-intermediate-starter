# Handoff Formats

Input and output handoff templates for Polyglot's inter-agent collaboration.

---

## Input Handoffs (Receiving)

### BUILDER_TO_POLYGLOT_HANDOFF

New feature with strings that need i18n extraction.

```yaml
BUILDER_TO_POLYGLOT_HANDOFF:
  Context:
    feature: "[Feature name]"
    files_changed:
      - "[File path 1]"
      - "[File path 2]"
  Strings_Found:
    - file: "[File path]"
      line: [line number]
      text: "[Hardcoded string]"
      context: "[Where it appears in UI]"
  I18n_Library: "[i18next | react-intl | vue-i18n | auto-detect]"
  Target_Languages: ["en", "ja"]
  Namespace: "[Suggested namespace]"
```

### ARTISAN_TO_POLYGLOT_HANDOFF

UI components with hardcoded text.

```yaml
ARTISAN_TO_POLYGLOT_HANDOFF:
  Context:
    component: "[Component name]"
    framework: "[React | Vue | Svelte]"
  Strings_To_Extract:
    - text: "[Hardcoded text]"
      element: "[HTML element / component prop]"
      context: "[UI context description]"
  Formatting_Issues:
    - type: "[date | currency | number]"
      current: "[Current implementation]"
      locale_sensitive: true
```

---

## Output Handoffs (Sending)

### POLYGLOT_TO_RADAR_HANDOFF

Request i18n test coverage.

```yaml
POLYGLOT_TO_RADAR_HANDOFF:
  Context:
    action: "i18n extraction completed"
    files_changed:
      - "[File path 1]"
      - "[File path 2]"
  Test_Requirements:
    key_coverage:
      - namespace: "[Namespace]"
        keys_added: [count]
        sample_keys: ["key.one", "key.two"]
    placeholder_validation:
      - key: "[Key with interpolation]"
        variables: ["name", "count"]
    locale_formatting:
      - type: "[date | currency | number]"
        locales_to_test: ["en", "ja"]
  Priority: "[High | Medium | Low]"
```

### POLYGLOT_TO_MUSE_HANDOFF

RTL layout token adjustments needed.

```yaml
POLYGLOT_TO_MUSE_HANDOFF:
  Context:
    action: "RTL support added"
    rtl_languages: ["ar", "he"]
  Token_Adjustments:
    - component: "[Component name]"
      issue: "[Layout issue description]"
      current_tokens: "[Current token values]"
      suggested_fix: "[Use logical properties / adjust spacing]"
  CSS_Changes:
    - file: "[CSS/SCSS file path]"
      changes: "[Physical → Logical property conversions]"
```

### POLYGLOT_TO_CANVAS_HANDOFF

Request i18n visualization.

```yaml
POLYGLOT_TO_CANVAS_HANDOFF:
  Diagram_Type: "[workflow | fallback_tree | file_structure]"
  Purpose: "[documentation | onboarding | debugging]"
  Data:
    languages_supported: ["en", "ja", "zh"]
    namespaces: ["common", "auth", "errors"]
    fallback_chain: "zh-TW → zh → en"
```

### POLYGLOT_TO_QUILL_HANDOFF

Request translation contributor documentation.

```yaml
POLYGLOT_TO_QUILL_HANDOFF:
  Context:
    action: "i18n structure established"
    i18n_library: "[Library name]"
  Documentation_Needed:
    - type: "translation_guide"
      audience: "translators"
      content: "[How to add/edit translations]"
    - type: "key_conventions"
      audience: "developers"
      content: "[Key naming rules, namespace guide]"
  File_Structure:
    locales_dir: "[Path to locales directory]"
    supported_languages: ["en", "ja"]
    namespaces: ["common", "auth", "errors"]
```
