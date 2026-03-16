# Accessibility Patterns Reference

Comprehensive a11y patterns for Palette (WCAG 2.1 Level AA).

## WCAG 2.1 Quick Reference

### Level AA Checklist

#### Perceivable

| Criterion | Requirement | Check |
|-----------|-------------|-------|
| 1.1.1 Non-text Content | All images have alt text | `<img alt="...">` |
| 1.3.1 Info and Relationships | Structure conveyed through markup | Use semantic HTML |
| 1.3.2 Meaningful Sequence | Reading order makes sense | DOM order = visual order |
| 1.3.4 Orientation | Works in portrait & landscape | No orientation lock |
| 1.4.1 Use of Color | Color not sole indicator | Add text/icons |
| 1.4.3 Contrast (Minimum) | 4.5:1 text, 3:1 large text | Check with tools |
| 1.4.4 Resize Text | Works at 200% zoom | Use relative units |
| 1.4.10 Reflow | No horizontal scroll at 320px | Responsive design |
| 1.4.11 Non-text Contrast | 3:1 for UI components | Buttons, inputs, icons |
| 1.4.12 Text Spacing | Readable with increased spacing | Don't clip text |
| 1.4.13 Content on Hover | Dismissible, hoverable, persistent | Tooltip patterns |

#### Operable

| Criterion | Requirement | Check |
|-----------|-------------|-------|
| 2.1.1 Keyboard | All functionality via keyboard | Tab through everything |
| 2.1.2 No Keyboard Trap | Can navigate away | Modals, dropdowns |
| 2.4.1 Bypass Blocks | Skip navigation link | Skip to main content |
| 2.4.2 Page Titled | Descriptive page titles | `<title>` tag |
| 2.4.3 Focus Order | Logical focus sequence | Tab order test |
| 2.4.4 Link Purpose | Links describe destination | Avoid "click here" |
| 2.4.6 Headings and Labels | Descriptive headings | H1-H6 hierarchy |
| 2.4.7 Focus Visible | Clear focus indicator | 2px+ outline |
| 2.5.3 Label in Name | Accessible name matches visible | Button text = aria-label |

#### Understandable

| Criterion | Requirement | Check |
|-----------|-------------|-------|
| 3.1.1 Language of Page | Page language declared | `<html lang="en">` |
| 3.2.1 On Focus | No unexpected changes | Focus doesn't submit |
| 3.2.2 On Input | No unexpected changes | Selecting doesn't submit |
| 3.3.1 Error Identification | Errors described in text | Not just color |
| 3.3.2 Labels or Instructions | Input guidance provided | Placeholder is not label |
| 3.3.3 Error Suggestion | Suggest corrections | Show expected format |
| 3.3.4 Error Prevention | Confirm destructive actions | Delete dialogs |

#### Robust

| Criterion | Requirement | Check |
|-----------|-------------|-------|
| 4.1.1 Parsing | Valid HTML | No duplicate IDs |
| 4.1.2 Name, Role, Value | Custom controls accessible | ARIA attributes |
| 4.1.3 Status Messages | Dynamic updates announced | aria-live regions |

---

## Keyboard Navigation Patterns

### Focus Management

**Focus Order Principles:**

```
1. DOM order matches visual order
2. Focus moves top-to-bottom, left-to-right
3. Skip hidden elements (display:none, visibility:hidden)
4. Trap focus within modals
```

**Focus Ring Implementation:**

```css
/* Pattern: Visible focus ring */
:focus-visible {
  outline: 2px solid var(--focus-color, #2563eb);
  outline-offset: 2px;
}

/* Remove for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}

/* High contrast mode support */
@media (forced-colors: active) {
  :focus-visible {
    outline: 3px solid CanvasText;
  }
}
```

**Focus Trap for Modals:**

```tsx
// Pattern: Modal focus trap
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store current focus
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Focus first focusable element in modal
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (focusableElements?.[0] as HTMLElement)?.focus();
    } else {
      // Restore focus
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key !== 'Tab') return;

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusableElements?.length) return;

    const first = focusableElements[0] as HTMLElement;
    const last = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}
```

### Keyboard Shortcuts

**Common Patterns:**

| Key | Action | Context |
|-----|--------|---------|
| Enter | Activate button | Buttons, links |
| Space | Toggle checkbox, activate button | Checkboxes, buttons |
| Escape | Close modal/dropdown | Overlays |
| Arrow keys | Navigate options | Select, menu, tabs |
| Home/End | First/last option | Lists, sliders |
| Tab | Next focusable | Global |
| Shift+Tab | Previous focusable | Global |

**Roving Tabindex Pattern:**

```tsx
// Use for: Tab groups, menus, radio groups
function TabList({ tabs, activeTab, onTabChange }) {
  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    let newIndex = index;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        newIndex = (index + 1) % tabs.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        newIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    onTabChange(tabs[newIndex].id);
    document.getElementById(`tab-${tabs[newIndex].id}`)?.focus();
  };

  return (
    <div role="tablist">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          id={`tab-${tab.id}`}
          role="tab"
          aria-selected={tab.id === activeTab}
          tabIndex={tab.id === activeTab ? 0 : -1}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

---

## Screen Reader Patterns

### ARIA Live Regions

**Announcements:**

```tsx
// Pattern: Live region for status updates
function StatusAnnouncer() {
  const [message, setMessage] = useState('');

  // Call announce() to notify screen readers
  const announce = (text: string, priority: 'polite' | 'assertive' = 'polite') => {
    setMessage(text);
    setTimeout(() => setMessage(''), 1000); // Clear after announcement
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

// Usage in component
announce('Item added to cart');  // polite
announce('Error: Payment failed', 'assertive');  // assertive
```

**Live Region Politeness:**

| Level | Use When | Example |
|-------|----------|---------|
| `off` | No announcement | Hidden content |
| `polite` | Non-urgent updates | Cart item added |
| `assertive` | Urgent updates | Errors, time warnings |

### Accessible Names

**Naming Techniques:**

```tsx
// Pattern 1: Visible label
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Pattern 2: aria-label (hidden label)
<button aria-label="Close dialog">
  <XIcon />
</button>

// Pattern 3: aria-labelledby (reference other element)
<h2 id="dialog-title">Delete Item</h2>
<dialog aria-labelledby="dialog-title">...</dialog>

// Pattern 4: aria-describedby (additional description)
<input
  aria-label="Password"
  aria-describedby="password-requirements"
/>
<p id="password-requirements">At least 8 characters</p>
```

### Common ARIA Patterns

**Buttons vs Links:**

```tsx
// Button: performs action
<button onClick={handleSave}>Save</button>

// Link: navigates to URL
<a href="/settings">Settings</a>

// Button that looks like link
<button className="underline text-blue-600">
  Learn more
</button>

// Link that looks like button (use sparingly)
<a href="/signup" className="btn btn-primary">
  Sign Up
</a>
```

**Icon Buttons:**

```tsx
// Pattern: Icon button with accessible name
<button aria-label="Delete item">
  <TrashIcon aria-hidden="true" />
</button>

// Pattern: Icon with visible text
<button>
  <TrashIcon aria-hidden="true" />
  <span>Delete</span>
</button>

// Pattern: Icon-only with tooltip
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <button aria-label="Settings">
        <GearIcon aria-hidden="true" />
      </button>
    </TooltipTrigger>
    <TooltipContent>Settings</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

## Color and Contrast Patterns

### Contrast Ratios

**Requirements:**

| Element | Minimum Ratio | Level |
|---------|---------------|-------|
| Normal text (<18px) | 4.5:1 | AA |
| Large text (≥18px or ≥14px bold) | 3:1 | AA |
| UI components (buttons, inputs) | 3:1 | AA |
| Non-essential decoration | No requirement | - |

**Implementation:**

```css
/* Define accessible color pairs */
:root {
  /* Primary text on white: 4.5:1+ */
  --text-primary: #1a1a1a;
  --bg-primary: #ffffff;

  /* Secondary text on white: 4.5:1+ */
  --text-secondary: #525252;
  --bg-secondary: #f5f5f5;

  /* Error states: 4.5:1+ */
  --text-error: #b91c1c;
  --bg-error: #fef2f2;

  /* Focus ring: 3:1+ against adjacent colors */
  --focus-ring: #2563eb;
}
```

### Color Independence

**Don't rely on color alone:**

```tsx
// BAD: Color-only indication
<span className={isValid ? 'text-green-500' : 'text-red-500'}>
  {message}
</span>

// GOOD: Color + icon
<span className={cn(
  "flex items-center gap-1",
  isValid ? 'text-green-600' : 'text-red-600'
)}>
  {isValid ? <CheckIcon aria-hidden /> : <XIcon aria-hidden />}
  <span>{message}</span>
</span>

// GOOD: Color + text pattern
<span className="text-red-600">
  Error: {message}
</span>
```

**Form field states:**

```tsx
// Pattern: Multiple indicators for error
<div className="space-y-1">
  <input
    aria-invalid="true"
    className={cn(
      "border-2 border-red-500",        // Color
      "focus:ring-red-500"              // Focus color
    )}
  />
  <p className="flex items-center gap-1 text-sm text-red-600">
    <AlertCircleIcon className="h-4 w-4" />  {/* Icon */}
    <span>Invalid email format</span>         {/* Text */}
  </p>
</div>
```

---

## Reduced Motion Support

### Respecting User Preferences

```css
/* Pattern: Motion-safe by default */
@media (prefers-reduced-motion: no-preference) {
  .animated {
    animation: slide-in 300ms ease-out;
  }

  .transition {
    transition: transform 200ms ease;
  }
}

/* Reduced motion: Disable or reduce */
@media (prefers-reduced-motion: reduce) {
  .animated,
  .transition {
    animation: none;
    transition: none;
  }
}
```

**React Implementation:**

```tsx
// Hook: Check motion preference
function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

// Usage
function AnimatedComponent() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
    >
      Content
    </motion.div>
  );
}
```

### Essential vs Decorative Motion

| Motion Type | Example | Reduced Motion Behavior |
|-------------|---------|-------------------------|
| Essential | Loading spinner | Keep but simplify |
| Important | Page transitions | Reduce duration |
| Decorative | Hover effects | Disable entirely |
| User-triggered | Scroll animations | Disable unless opt-in |

---

## Component-Specific Patterns

### Accordion

```tsx
<div className="accordion">
  {items.map((item, index) => (
    <div key={item.id}>
      <h3>
        <button
          id={`accordion-button-${item.id}`}
          aria-expanded={openItems.includes(item.id)}
          aria-controls={`accordion-panel-${item.id}`}
          onClick={() => toggle(item.id)}
        >
          {item.title}
          <ChevronIcon aria-hidden />
        </button>
      </h3>
      <div
        id={`accordion-panel-${item.id}`}
        role="region"
        aria-labelledby={`accordion-button-${item.id}`}
        hidden={!openItems.includes(item.id)}
      >
        {item.content}
      </div>
    </div>
  ))}
</div>
```

### Dropdown Menu

```tsx
<div className="relative">
  <button
    id="menu-button"
    aria-haspopup="true"
    aria-expanded={isOpen}
    aria-controls="menu"
    onClick={() => setIsOpen(!isOpen)}
  >
    Options
    <ChevronDownIcon aria-hidden />
  </button>

  {isOpen && (
    <ul
      id="menu"
      role="menu"
      aria-labelledby="menu-button"
    >
      {options.map((option, index) => (
        <li
          key={option.id}
          role="menuitem"
          tabIndex={-1}
        >
          {option.label}
        </li>
      ))}
    </ul>
  )}
</div>
```

### Alert/Notification

```tsx
<div
  role="alert"
  aria-live="assertive"
  className={cn(
    "p-4 rounded border flex items-start gap-3",
    type === 'error' && "bg-red-50 border-red-500",
    type === 'success' && "bg-green-50 border-green-500"
  )}
>
  {type === 'error' && <AlertCircleIcon className="text-red-600" />}
  {type === 'success' && <CheckCircleIcon className="text-green-600" />}
  <div>
    <p className="font-medium">{title}</p>
    <p className="text-sm">{message}</p>
  </div>
  <button
    aria-label="Dismiss alert"
    onClick={onDismiss}
  >
    <XIcon />
  </button>
</div>
```

### Skip Link

```tsx
// Pattern: Skip to main content
<a
  href="#main-content"
  className={cn(
    "sr-only focus:not-sr-only",
    "focus:absolute focus:top-4 focus:left-4",
    "focus:z-50 focus:p-4 focus:bg-white focus:shadow-lg"
  )}
>
  Skip to main content
</a>

// ...later in the page
<main id="main-content" tabIndex={-1}>
  {/* Main content */}
</main>
```

---

## Testing Checklist

### Automated Testing

```tsx
// Pattern: axe-core integration
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('component is accessible', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing

**Keyboard Test:**
- [ ] Tab through entire page
- [ ] All interactive elements reachable
- [ ] Focus visible at all times
- [ ] Logical focus order
- [ ] Can escape modals/dropdowns
- [ ] Shortcuts work correctly

**Screen Reader Test:**
- [ ] All images have alt text
- [ ] Forms have labels
- [ ] Buttons have accessible names
- [ ] Status updates announced
- [ ] Heading hierarchy correct
- [ ] Tables have headers

**Visual Test:**
- [ ] Zoom to 200% - content reflows
- [ ] Increase text spacing - no clipping
- [ ] High contrast mode works
- [ ] Reduced motion respected

**Color Test:**
- [ ] Run contrast checker on all text
- [ ] Check UI component contrast
- [ ] Verify color is not sole indicator
