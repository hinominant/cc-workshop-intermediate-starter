# Form Interaction Patterns Reference

Comprehensive form UX patterns for Palette.

## Validation Strategy Matrix

### When to Use Each Strategy

| Strategy | Use When | User Experience |
|----------|----------|-----------------|
| **Real-time** | Format-specific (email, URL, phone) | Immediate feedback, may interrupt typing |
| **On-blur** | Most text fields | Validates after user finishes field |
| **On-submit** | Cross-field validation, complex rules | All errors shown at once |
| **Debounced** | Async validation (username availability) | Delayed feedback, shows "checking..." |

### Real-time Validation Pattern

```tsx
// Use for: Email, phone, URL, password strength
const [email, setEmail] = useState('');
const [error, setError] = useState<string | null>(null);
const [touched, setTouched] = useState(false);

const validate = (value: string) => {
  if (!value) return 'Email is required';
  if (!isValidEmail(value)) return 'Please enter a valid email';
  return null;
};

<div className="space-y-1">
  <label htmlFor="email" className="block text-sm font-medium">
    Email
  </label>
  <input
    id="email"
    type="email"
    value={email}
    onChange={(e) => {
      setEmail(e.target.value);
      if (touched) setError(validate(e.target.value));
    }}
    onBlur={() => {
      setTouched(true);
      setError(validate(email));
    }}
    aria-invalid={!!error}
    aria-describedby={error ? 'email-error' : undefined}
    className={cn(
      "w-full px-3 py-2 border rounded",
      error && "border-red-500 focus:ring-red-500"
    )}
  />
  {error && (
    <p id="email-error" role="alert" className="text-sm text-red-600">
      {error}
    </p>
  )}
</div>
```

### On-blur Validation Pattern

```tsx
// Use for: Name, address, general text
const [touched, setTouched] = useState(false);

<input
  onBlur={(e) => {
    setTouched(true);
    validateField(e.target.name, e.target.value);
  }}
  aria-invalid={touched && !!errors[name]}
/>
{touched && errors[name] && (
  <p role="alert" className="text-sm text-red-600">
    {errors[name]}
  </p>
)}
```

### Debounced Async Validation

```tsx
// Use for: Username availability, email uniqueness
const [username, setUsername] = useState('');
const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

const checkAvailability = useDebouncedCallback(async (value: string) => {
  if (value.length < 3) return;
  setStatus('checking');
  const isAvailable = await api.checkUsername(value);
  setStatus(isAvailable ? 'available' : 'taken');
}, 500);

<div className="relative">
  <input
    value={username}
    onChange={(e) => {
      setUsername(e.target.value);
      checkAvailability(e.target.value);
    }}
    className="pr-10"
  />
  <div className="absolute right-3 top-1/2 -translate-y-1/2">
    {status === 'checking' && <Spinner className="h-4 w-4" />}
    {status === 'available' && <CheckIcon className="h-4 w-4 text-green-500" />}
    {status === 'taken' && <XIcon className="h-4 w-4 text-red-500" />}
  </div>
</div>
```

---

## Error Display Patterns

### Inline Error Messages

**Best Practice Format:**

```tsx
// Pattern: Inline error with icon
<div className="space-y-1">
  <input
    aria-invalid={!!error}
    aria-describedby="field-error"
    className={cn(
      "border-2 transition-colors",
      error ? "border-red-500" : "border-gray-300"
    )}
  />
  {error && (
    <div id="field-error" role="alert" className="flex items-center gap-1 text-sm text-red-600">
      <AlertCircleIcon className="h-4 w-4 flex-shrink-0" />
      <span>{error}</span>
    </div>
  )}
</div>
```

### Error Message Content Guidelines

| Bad | Good | Why |
|-----|------|-----|
| "Invalid input" | "Email must include @" | Specific, actionable |
| "Error" | "This field is required" | Explains the problem |
| "Check your password" | "Password must be at least 8 characters" | Concrete requirement |
| "Invalid date" | "Please enter a date in MM/DD/YYYY format" | Shows expected format |

### Error Summary Pattern

```tsx
// Use for: Submit-time validation with multiple errors
<div
  role="alert"
  aria-labelledby="error-summary-title"
  className="p-4 border border-red-500 rounded bg-red-50"
>
  <h2 id="error-summary-title" className="font-medium text-red-800">
    Please correct the following errors:
  </h2>
  <ul className="mt-2 list-disc list-inside text-red-700">
    {errors.map((error, i) => (
      <li key={i}>
        <a href={`#${error.fieldId}`} className="underline">
          {error.message}
        </a>
      </li>
    ))}
  </ul>
</div>
```

### Error Recovery Pattern

```tsx
// Pattern: Error with recovery action
<div className="p-4 border border-red-500 rounded bg-red-50">
  <p className="text-red-800">
    Unable to submit form. Please check your connection.
  </p>
  <div className="mt-3 flex gap-2">
    <button
      onClick={handleRetry}
      className="px-3 py-1 bg-red-600 text-white rounded"
    >
      Retry
    </button>
    <button
      onClick={handleSaveOffline}
      className="px-3 py-1 border border-red-600 text-red-600 rounded"
    >
      Save offline
    </button>
  </div>
</div>
```

---

## Multi-Step Form Patterns

### Step Progress Indicator

```tsx
// Pattern: Visual progress with step labels
<nav aria-label="Form progress" className="mb-8">
  <ol className="flex items-center">
    {steps.map((step, index) => (
      <li
        key={step.id}
        className={cn(
          "flex items-center",
          index < steps.length - 1 && "flex-1"
        )}
      >
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium",
              index < currentStep && "bg-green-500 text-white",
              index === currentStep && "bg-blue-500 text-white",
              index > currentStep && "bg-gray-200 text-gray-500"
            )}
            aria-current={index === currentStep ? "step" : undefined}
          >
            {index < currentStep ? <CheckIcon /> : index + 1}
          </span>
          <span className="text-sm hidden sm:inline">{step.label}</span>
        </div>
        {index < steps.length - 1 && (
          <div
            className={cn(
              "flex-1 h-0.5 mx-4",
              index < currentStep ? "bg-green-500" : "bg-gray-200"
            )}
          />
        )}
      </li>
    ))}
  </ol>
</nav>
```

### Step Navigation

```tsx
// Pattern: Multi-step with validation before advance
const handleNext = async () => {
  const isValid = await validateCurrentStep();
  if (isValid) {
    saveStepData(currentStep, formData);
    setCurrentStep(prev => prev + 1);
  } else {
    // Focus first error field
    const firstError = document.querySelector('[aria-invalid="true"]');
    firstError?.focus();
  }
};

<div className="flex justify-between mt-8">
  <button
    onClick={() => setCurrentStep(prev => prev - 1)}
    disabled={currentStep === 0}
    className="flex items-center gap-1"
  >
    <ArrowLeftIcon className="h-4 w-4" />
    Back
  </button>

  {currentStep < steps.length - 1 ? (
    <button onClick={handleNext} className="btn-primary">
      Next
      <ArrowRightIcon className="h-4 w-4" />
    </button>
  ) : (
    <button onClick={handleSubmit} className="btn-primary">
      Submit
    </button>
  )}
</div>
```

### Step Data Persistence

```tsx
// Pattern: Auto-save on step change
const [formData, setFormData] = useLocalStorage('form-draft', initialData);

// Save on every step change
useEffect(() => {
  saveToLocalStorage('form-draft', formData);
}, [currentStep]);

// Restore on mount
useEffect(() => {
  const draft = getFromLocalStorage('form-draft');
  if (draft) {
    setFormData(draft);
    // Optionally show "Resume your progress?" dialog
  }
}, []);
```

---

## Field Affordance Patterns

### Autocomplete

```tsx
// Pattern: Combobox with suggestions
<Combobox value={value} onChange={setValue}>
  <div className="relative">
    <Combobox.Input
      onChange={(e) => setQuery(e.target.value)}
      displayValue={(item) => item?.name}
      className="w-full"
    />
    <Combobox.Button className="absolute right-2 top-1/2 -translate-y-1/2">
      <ChevronDownIcon />
    </Combobox.Button>
    <Combobox.Options className="absolute mt-1 w-full bg-white shadow-lg rounded border">
      {filteredOptions.map(option => (
        <Combobox.Option
          key={option.id}
          value={option}
          className={({ active }) => cn(
            "px-4 py-2 cursor-pointer",
            active && "bg-blue-50"
          )}
        >
          {option.name}
        </Combobox.Option>
      ))}
    </Combobox.Options>
  </div>
</Combobox>
```

### Input Masking

```tsx
// Pattern: Phone number mask
import { useIMask } from 'react-imask';

const { ref, value } = useIMask({
  mask: '000-0000-0000',
  lazy: false,  // Show mask immediately
  placeholderChar: '_'
});

<input
  ref={ref}
  type="tel"
  inputMode="tel"
  placeholder="000-0000-0000"
/>
```

**Common Mask Patterns:**

| Field | Mask | Example |
|-------|------|---------|
| Phone (JP) | 000-0000-0000 | 090-1234-5678 |
| Phone (US) | (000) 000-0000 | (555) 123-4567 |
| Credit card | 0000 0000 0000 0000 | 4242 4242 4242 4242 |
| Date | 00/00/0000 | 01/31/2024 |
| Postal (JP) | 000-0000 | 100-0001 |
| CVV | 000 or 0000 | 123 |

### Character Counter

```tsx
// Pattern: Character limit with visual feedback
const maxLength = 280;
const remaining = maxLength - value.length;

<div className="space-y-1">
  <textarea
    value={value}
    onChange={(e) => setValue(e.target.value)}
    maxLength={maxLength}
    aria-describedby="char-count"
  />
  <div
    id="char-count"
    className={cn(
      "text-sm text-right",
      remaining < 20 && "text-orange-500",
      remaining < 0 && "text-red-500"
    )}
    aria-live="polite"
  >
    {remaining} characters remaining
  </div>
</div>
```

---

## Inline Help Patterns

### Tooltip Help

```tsx
// Pattern: Help icon with tooltip
<label className="flex items-center gap-1">
  <span>API Key</span>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="What is an API key?"
          className="text-gray-400 hover:text-gray-600"
        >
          <HelpCircleIcon className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs">
          Your API key can be found in Settings → Integrations
        </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</label>
```

### Inline Help Text

```tsx
// Pattern: Persistent help text
<div className="space-y-1">
  <label htmlFor="password">Password</label>
  <input
    id="password"
    type="password"
    aria-describedby="password-help password-error"
  />
  <p id="password-help" className="text-sm text-gray-500">
    Must be at least 8 characters with one number and one special character
  </p>
  {error && (
    <p id="password-error" role="alert" className="text-sm text-red-600">
      {error}
    </p>
  )}
</div>
```

### Contextual Guidance

```tsx
// Pattern: Show guidance on focus
const [focused, setFocused] = useState(false);

<div className="space-y-1">
  <input
    onFocus={() => setFocused(true)}
    onBlur={() => setFocused(false)}
  />
  <AnimatePresence>
    {focused && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="text-sm text-gray-500"
      >
        <ul className="list-disc list-inside">
          <li>Use your full legal name</li>
          <li>As it appears on your ID</li>
        </ul>
      </motion.div>
    )}
  </AnimatePresence>
</div>
```

---

## Smart Default Patterns

### Geo-based Defaults

```tsx
// Pattern: Pre-fill based on location
useEffect(() => {
  const userLocale = navigator.language;
  const country = getCountryFromLocale(userLocale);

  setFormData(prev => ({
    ...prev,
    country: country,
    phonePrefix: getPhonePrefix(country),
    currency: getCurrency(country),
    dateFormat: getDateFormat(country)
  }));
}, []);
```

### Context-aware Defaults

```tsx
// Pattern: Infer from user data
const user = useUser();

// Pre-fill shipping from billing if same
const [sameAsBilling, setSameAsBilling] = useState(true);

useEffect(() => {
  if (sameAsBilling && user.billingAddress) {
    setShippingAddress(user.billingAddress);
  }
}, [sameAsBilling, user.billingAddress]);

<label className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={sameAsBilling}
    onChange={(e) => setSameAsBilling(e.target.checked)}
  />
  <span>Same as billing address</span>
</label>
```

---

## Form Submission Patterns

### Submit Button States

```tsx
// Pattern: Comprehensive submit button
<button
  type="submit"
  disabled={isSubmitting || !isValid}
  aria-busy={isSubmitting}
  className={cn(
    "w-full py-3 px-4 rounded font-medium transition-all",
    "bg-blue-600 text-white",
    "disabled:bg-gray-300 disabled:cursor-not-allowed",
    isSubmitting && "cursor-wait"
  )}
>
  {isSubmitting ? (
    <span className="flex items-center justify-center gap-2">
      <Spinner className="h-4 w-4" />
      Submitting...
    </span>
  ) : (
    'Submit'
  )}
</button>
```

### Success State

```tsx
// Pattern: Success confirmation with next steps
<div className="text-center py-8">
  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
    <CheckIcon className="h-6 w-6 text-green-600" />
  </div>
  <h2 className="text-xl font-semibold mb-2">Form Submitted!</h2>
  <p className="text-gray-600 mb-6">
    We'll get back to you within 24 hours.
  </p>
  <div className="flex justify-center gap-4">
    <button onClick={handleReset} className="btn-secondary">
      Submit Another
    </button>
    <Link href="/dashboard" className="btn-primary">
      Go to Dashboard
    </Link>
  </div>
</div>
```

### Unsaved Changes Warning

```tsx
// Pattern: Warn before navigation with unsaved changes
const [isDirty, setIsDirty] = useState(false);

useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [isDirty]);

// With router navigation blocking
const router = useRouter();

useEffect(() => {
  const handleRouteChange = (url: string) => {
    if (isDirty && !confirm('You have unsaved changes. Leave anyway?')) {
      router.events.emit('routeChangeError');
      throw 'Navigation cancelled';
    }
  };

  router.events.on('routeChangeStart', handleRouteChange);
  return () => router.events.off('routeChangeStart', handleRouteChange);
}, [isDirty, router]);
```

---

## Form Accessibility Checklist

### Labels & Structure
- [ ] All inputs have associated labels (visible or `aria-label`)
- [ ] Labels use `htmlFor` matching input `id`
- [ ] Required fields indicated (`required` attribute + visual indicator)
- [ ] Field groups wrapped in `<fieldset>` with `<legend>`

### Error Handling
- [ ] Errors announced via `role="alert"` or `aria-live`
- [ ] Invalid fields have `aria-invalid="true"`
- [ ] Errors linked to fields via `aria-describedby`
- [ ] Error summary at top of form for submit-time errors

### Keyboard Navigation
- [ ] All fields reachable via Tab
- [ ] Logical tab order
- [ ] Focus visible on all interactive elements
- [ ] Enter submits form (when appropriate)

### Help & Instructions
- [ ] Help text linked via `aria-describedby`
- [ ] Instructions provided before fields that need them
- [ ] Format examples shown for ambiguous fields
