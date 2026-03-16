# UX Writing & Microcopy Patterns Reference

Comprehensive UX writing patterns for Palette. Good microcopy is the difference between a user feeling lost and feeling guided.

## CTA Labels & Button Text

### Principles

1. **Use verbs that describe the action** ("Save changes" not "Submit")
2. **Be specific to the context** ("Add to cart" not "OK")
3. **Match the user's expectation** ("Create project" not "Process")
4. **Show state changes** ("Saving..." not "Loading...")

### Before/After Comparison

| Context | Bad | Good | Why |
|---------|-----|------|-----|
| Save form | Submit | Save changes | Describes what happens |
| Create item | OK | Create project | Specific to context |
| Delete item | Delete | Delete project | Names the object |
| Confirm action | Yes | Remove member | Verb-based, unambiguous |
| Cancel subscription | Yes, cancel | Cancel subscription | Full action, no confusion |
| Send message | Send | Send message | Clear on what is sent |
| Upload file | Choose | Upload file | Describes the outcome |
| Generic link | Click here | View documentation | Describes destination |

### Button State Labels

| State | Pattern | Example |
|-------|---------|---------|
| Default | Action verb + object | "Save changes" |
| Loading | Present participle + "..." | "Saving..." |
| Success | Past tense + check | "Saved!" |
| Error | "Failed to" + action | "Failed to save" |
| Disabled (reason) | Tooltip explains why | "Complete required fields to save" |

```tsx
// Pattern: Button with contextual label states
function ActionButton({
  status,
  defaultLabel,
  loadingLabel,
  successLabel,
}: ActionButtonProps) {
  const labels = {
    idle: defaultLabel,         // "Save changes"
    loading: loadingLabel,      // "Saving..."
    success: successLabel,      // "Saved!"
    error: `Failed. Try again`, // Generic fallback
  };

  return (
    <button
      disabled={status === "loading"}
      aria-busy={status === "loading"}
      className={cn(
        "px-4 py-2 rounded text-sm font-medium transition-colors",
        status === "success" && "bg-green-500 text-white",
        status === "error" && "bg-red-500 text-white",
        status === "idle" && "bg-blue-600 text-white hover:bg-blue-700"
      )}
    >
      {status === "loading" && <Spinner className="inline mr-2 h-4 w-4" aria-hidden />}
      {status === "success" && <CheckIcon className="inline mr-2 h-4 w-4" aria-hidden />}
      {labels[status]}
    </button>
  );
}
```

### Destructive Action Labels

Always name the object being destroyed. Never use "Yes" / "No".

| Bad | Good | Reason |
|-----|------|--------|
| Delete | Delete project | Names what's deleted |
| Remove | Remove "John" from team | Specific target |
| Yes / No | Cancel subscription / Keep subscription | Verb-based, unambiguous |
| OK / Cancel | Discard changes / Continue editing | Describes both outcomes |

---

## Error Messages

### Structure: What + Why + How

Every error message should answer three questions:

1. **What happened?** (Brief, factual)
2. **Why?** (Cause, if known)
3. **How to fix it?** (Actionable next step)

### Before/After Comparison

| Context | Bad | Good |
|---------|-----|------|
| 404 page | "Error 404" | "We couldn't find that page. It may have been moved or deleted." |
| Login failure | "Invalid credentials" | "Incorrect email or password. Check your credentials and try again." |
| Network error | "Network error" | "Can't connect to the server. Check your internet connection and try again." |
| File too large | "Error" | "This file is too large (max 10 MB). Try compressing it or choosing a smaller file." |
| Permission denied | "Forbidden" | "You don't have permission to edit this project. Contact the project owner for access." |
| Rate limited | "Too many requests" | "You've made too many requests. Please wait a moment and try again." |
| Form validation | "Invalid input" | "Email must include @ and a domain (e.g., name@example.com)." |
| Timeout | "Request timeout" | "This is taking longer than expected. Try again or check back later." |

### Field-Level Error Messages

```tsx
// Pattern: Specific, actionable field errors
const fieldErrors = {
  email: {
    required: "Email is required",
    invalid: "Enter a valid email (e.g., name@example.com)",
    taken: "This email is already registered. Try signing in instead.",
  },
  password: {
    required: "Password is required",
    tooShort: "Password must be at least 8 characters",
    noNumber: "Include at least one number",
    noUppercase: "Include at least one uppercase letter",
  },
  username: {
    required: "Username is required",
    taken: "This username is taken. Try another.",
    invalid: "Only letters, numbers, and underscores allowed",
    tooShort: "Username must be at least 3 characters",
  },
};

// Usage in a form field
<div className="space-y-1">
  <label htmlFor="email" className="text-sm font-medium">Email</label>
  <input
    id="email"
    type="email"
    aria-invalid={!!error}
    aria-describedby={error ? "email-error" : "email-hint"}
    className={cn("w-full px-3 py-2 border rounded", error && "border-red-500")}
  />
  {error ? (
    <p id="email-error" role="alert" className="text-sm text-red-600">
      {fieldErrors.email[error]}
    </p>
  ) : (
    <p id="email-hint" className="text-sm text-gray-500">
      We'll use this for sign-in and notifications.
    </p>
  )}
</div>
```

### Page-Level Error Messages

```tsx
// Use when: Error affects the entire page or multiple fields
function PageError({
  title,
  description,
  actions,
}: PageErrorProps) {
  return (
    <div
      role="alert"
      className="p-4 bg-red-50 border border-red-200 rounded-lg"
    >
      <div className="flex items-start gap-3">
        <AlertCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden />
        <div>
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <p className="text-sm text-red-700 mt-1">{description}</p>
          {actions && (
            <div className="flex gap-3 mt-3">
              {actions.map((action) => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="text-sm text-red-700 font-medium hover:underline"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Usage
<PageError
  title="Failed to save changes"
  description="Some fields have errors. Fix them below and try again."
  actions={[{ label: "Jump to first error", onClick: scrollToFirstError }]}
/>
```

### Error Message Anti-Patterns

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| "Something went wrong" | No information, no recovery | Explain what failed and how to fix |
| "Error: 500" | Technical jargon | Translate to plain language |
| "Invalid input" | Non-specific | Name the field and what's wrong |
| Blaming the user | "You entered wrong email" | "Please enter a valid email address" |
| No recovery path | Dead end | Always include a next step |

---

## Empty States

### First-Use Empty State

```tsx
// Use when: User sees a section for the first time with no data
function WelcomeEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 p-4 bg-blue-50 rounded-full">
        <RocketIcon className="h-8 w-8 text-blue-500" aria-hidden />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h2>
      <p className="text-sm text-gray-500 max-w-sm mb-6">
        {description}
      </p>
      <button
        onClick={onAction}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
      >
        {actionLabel}
      </button>
    </div>
  );
}

// Usage
<WelcomeEmptyState
  title="Welcome to Projects"
  description="Projects help you organize tasks and collaborate with your team. Create your first one to get started."
  actionLabel="Create your first project"
  onAction={() => setShowCreateDialog(true)}
/>
```

### Empty State Copy Patterns

| Scenario | Title | Description | CTA |
|----------|-------|-------------|-----|
| First project | "No projects yet" | "Create a project to start organizing your work." | "Create project" |
| No team members | "You're flying solo" | "Invite teammates to collaborate in real-time." | "Invite people" |
| Empty inbox | "All caught up" | "No new notifications. Check back later." | (none needed) |
| No search results | "No results found" | "Try different keywords or adjust your filters." | "Clear search" |
| Empty trash | "Trash is empty" | "Deleted items will appear here for 30 days." | (none needed) |

### Search/Filter No Results

```tsx
// Use when: Search or filters return zero results
function NoResults({
  type,
  query,
  onClear,
}: {
  type: "search" | "filter";
  query?: string;
  onClear: () => void;
}) {
  return (
    <div className="text-center py-12">
      <SearchIcon className="h-10 w-10 text-gray-300 mx-auto mb-4" aria-hidden />
      <h3 className="text-base font-medium text-gray-900 mb-1">
        {type === "search"
          ? `No results for "${query}"`
          : "No items match your filters"}
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        {type === "search"
          ? "Try different keywords or check for typos."
          : "Adjust or clear your filters to see more items."}
      </p>
      <button
        onClick={onClear}
        className="text-sm text-blue-600 hover:underline"
      >
        {type === "search" ? "Clear search" : "Clear all filters"}
      </button>
    </div>
  );
}
```

---

## Confirmation Dialogs

### Principles

1. **Title = action being confirmed** ("Delete this project?")
2. **Body = consequence** ("This will permanently remove all tasks and files.")
3. **Buttons = verb-based** (never "Yes" / "No")
4. **Destructive button = right side, red** (matches scanning direction)

### Destructive Action

```tsx
// Use when: Permanent deletion or irreversible action
<AlertDialog>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete "My Project"?</AlertDialogTitle>
      <AlertDialogDescription>
        This will permanently delete the project, including all tasks,
        files, and comments. This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Keep project</AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDelete}
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        Delete project
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Non-Destructive Confirmation

```tsx
// Use when: Confirming an important but reversible action
<AlertDialog>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Publish this post?</AlertDialogTitle>
      <AlertDialogDescription>
        This will make your post visible to everyone.
        You can unpublish it later from settings.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Not yet</AlertDialogCancel>
      <AlertDialogAction onClick={handlePublish}>
        Publish post
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Unsaved Changes

```tsx
// Use when: User navigates away with unsaved form data
<AlertDialog>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
      <AlertDialogDescription>
        You have unsaved changes that will be lost.
        Would you like to save before leaving?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Continue editing</AlertDialogCancel>
      <button
        onClick={handleDiscard}
        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
      >
        Discard changes
      </button>
      <AlertDialogAction onClick={handleSave}>
        Save changes
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Confirmation Dialog Copy Patterns

| Action | Title | Body | Cancel | Confirm |
|--------|-------|------|--------|---------|
| Delete item | "Delete this item?" | "This cannot be undone." | "Keep item" | "Delete item" |
| Remove member | "Remove Alex?" | "They will lose access immediately." | "Cancel" | "Remove Alex" |
| Cancel subscription | "Cancel subscription?" | "You'll lose access at the end of your billing period." | "Keep subscription" | "Cancel subscription" |
| Leave page | "Leave this page?" | "Changes you made may not be saved." | "Stay on page" | "Leave page" |
| Reset settings | "Reset to defaults?" | "All custom settings will be cleared." | "Keep settings" | "Reset settings" |

---

## Success & Notification Messages

### Action Confirmation

| Action | Message | Duration |
|--------|---------|----------|
| Save | "Changes saved" | 3s auto-dismiss |
| Create | "Project created successfully" | 3s auto-dismiss |
| Delete | "Item deleted. Undo?" | 5s with undo action |
| Send | "Message sent" | 3s auto-dismiss |
| Copy | "Copied to clipboard" | 2s auto-dismiss |
| Upload | "File uploaded successfully" | 3s auto-dismiss |

```tsx
// Pattern: Toast with optional undo
function SuccessToast({
  message,
  undoAction,
  duration = 3000,
}: SuccessToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-lg shadow-lg"
    >
      <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" aria-hidden />
      <span className="text-sm">{message}</span>
      {undoAction && (
        <button
          onClick={undoAction}
          className="text-sm font-medium text-blue-300 hover:text-blue-200 ml-auto"
        >
          Undo
        </button>
      )}
    </div>
  );
}
```

### Progress Updates

```tsx
// Use when: Multi-step or long-running operations
function ProgressToast({
  current,
  total,
  label,
}: ProgressToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="px-4 py-3 bg-gray-900 text-white rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm">{label}</span>
        <span className="text-xs text-gray-400">
          {current} of {total}
        </span>
      </div>
      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${(current / total) * 100}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
        />
      </div>
    </div>
  );
}

// Usage
<ProgressToast current={3} total={5} label="Uploading files..." />
```

---

## Form Help & Hints

### Placeholder Text

Placeholders are **examples**, not labels. Never use placeholder as the only label.

| Field | Bad Placeholder | Good Placeholder |
|-------|----------------|-----------------|
| Email | "Email" | "name@example.com" |
| Phone | "Phone number" | "+1 (555) 000-0000" |
| URL | "URL" | "https://example.com" |
| Search | "Search" | "Search by name or keyword..." |
| Date | "Date" | "MM/DD/YYYY" |

### Helper Text

Place below the field. Use for format hints, constraints, or context.

```tsx
// Pattern: Field with helper text
<div className="space-y-1">
  <label htmlFor="username" className="text-sm font-medium">
    Username
  </label>
  <input
    id="username"
    type="text"
    placeholder="cooluser42"
    aria-describedby="username-hint"
    className="w-full px-3 py-2 border rounded"
  />
  <p id="username-hint" className="text-xs text-gray-500">
    3-20 characters. Letters, numbers, and underscores only.
  </p>
</div>
```

### Character Count

```tsx
// Use when: Field has a maximum length
function CharacterCount({
  current,
  max,
}: {
  current: number;
  max: number;
}) {
  const remaining = max - current;
  const isNearLimit = remaining <= Math.ceil(max * 0.1);
  const isOverLimit = remaining < 0;

  return (
    <p
      className={cn(
        "text-xs text-right",
        isOverLimit && "text-red-600 font-medium",
        isNearLimit && !isOverLimit && "text-yellow-600",
        !isNearLimit && "text-gray-400"
      )}
      aria-live="polite"
    >
      {remaining >= 0
        ? `${remaining} characters remaining`
        : `${Math.abs(remaining)} characters over limit`}
    </p>
  );
}
```

### Password Requirements

```tsx
// Use when: Password field with validation rules
function PasswordRequirements({
  password,
}: {
  password: string;
}) {
  const rules = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /\d/.test(password) },
    { label: "One special character", met: /[!@#$%^&*]/.test(password) },
  ];

  return (
    <ul className="space-y-1 mt-2" aria-label="Password requirements">
      {rules.map((rule) => (
        <li
          key={rule.label}
          className={cn(
            "flex items-center gap-2 text-xs",
            rule.met ? "text-green-600" : "text-gray-500"
          )}
        >
          {rule.met ? (
            <CheckIcon className="h-3 w-3" aria-hidden />
          ) : (
            <CircleIcon className="h-3 w-3" aria-hidden />
          )}
          {rule.label}
        </li>
      ))}
    </ul>
  );
}
```

---

## Tone & Voice Guidelines

### Core Principles

| Principle | Meaning | Example |
|-----------|---------|---------|
| **Clear > Clever** | Clarity beats wit | "File deleted" not "Poof! Gone!" |
| **Helpful > Formal** | Guide, don't lecture | "Try a different keyword" not "Query returned no results" |
| **Specific > Vague** | Name the thing | "3 tasks completed" not "Operation successful" |
| **Calm > Alarming** | Don't panic the user | "Couldn't save. Try again." not "CRITICAL ERROR!" |
| **Brief > Verbose** | Respect reading time | "Saved" not "Your changes have been successfully saved to the database" |

### Do / Don't Comparison

| Do | Don't |
|----|-------|
| "Couldn't connect to server" | "Error: ECONNREFUSED" |
| "Email must include @" | "Invalid format" |
| "Project created" | "Your project has been successfully created!" |
| "3 items selected" | "Selection count: 3" |
| "Save changes?" | "Are you sure you want to save?" |
| "Try again" | "Retry operation" |
| "No projects yet" | "0 projects found" |
| "Check your internet connection" | "Network error occurred" |

### Tone Spectrum

Adjust tone based on context severity:

| Context | Tone | Example |
|---------|------|---------|
| Success | Warm, brief | "Changes saved" |
| Information | Neutral, clear | "Your trial ends in 3 days" |
| Warning | Direct, helpful | "This will remove all team members" |
| Error | Calm, supportive | "Something went wrong. Try again in a moment." |
| Destructive | Serious, precise | "Permanently delete project and all data?" |

### Consistency Checklist

Use this checklist to ensure copy consistency:

- [ ] Same term used for the same concept throughout (e.g., always "project" not sometimes "workspace")
- [ ] Button labels use the same pattern (verb + object)
- [ ] Error messages follow what/why/how structure
- [ ] Success messages are brief and consistent in tone
- [ ] Dates use the same format throughout
- [ ] Numbers use the same formatting (commas, decimal places)
- [ ] Abbreviations are either always or never used (not mixed)
- [ ] Capitalization follows the same rule (sentence case recommended)

---

## Microcopy Patterns

### Tooltips

- Maximum 1-2 sentences
- Describe what happens, not what it is
- Don't repeat the label

| Element | Bad Tooltip | Good Tooltip |
|---------|------------|-------------|
| Settings icon | "Settings" | "Manage account and preferences" |
| Share button | "Share" | "Share with teammates or get a link" |
| Lock icon | "Locked" | "Only project admins can edit" |
| Info icon | "Info" | "Used for billing and receipts" |

```tsx
// Pattern: Accessible tooltip
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <button aria-label="Account settings">
        <SettingsIcon className="h-5 w-5" />
      </button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Manage account and preferences</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Breadcrumb Labels

- One or two words maximum
- Match the page title
- Use nouns, not verbs

| Bad | Good |
|-----|------|
| "Go to Dashboard" | "Dashboard" |
| "Your Projects List" | "Projects" |
| "Viewing Settings Page" | "Settings" |

### Tab Labels

- 1-2 words per tab
- Use nouns or short noun phrases
- Parallel structure across all tabs

| Bad | Good |
|-----|------|
| Overview / Your Team Members / Settings Page | Overview / Members / Settings |
| General / Advanced Configuration / About | General / Advanced / About |

### Badge & Status Text

| Status | Label | Color Hint |
|--------|-------|------------|
| Active / Online | "Active" | Green |
| Pending / Processing | "Pending" | Yellow |
| Failed / Error | "Failed" | Red |
| Archived / Inactive | "Archived" | Gray |
| New / Unread | "New" | Blue |
| Draft | "Draft" | Gray |
| Overdue | "Overdue" | Red |
| Completed / Done | "Completed" | Green |

### Timestamps

| Context | Format | Example |
|---------|--------|---------|
| Just now (< 1 min) | Relative | "Just now" |
| Within an hour | Relative | "5 minutes ago" |
| Today | Relative | "2 hours ago" |
| Yesterday | Named | "Yesterday at 3:45 PM" |
| This week | Named day | "Monday at 10:30 AM" |
| This year | Short date | "Jan 15 at 2:00 PM" |
| Older | Full date | "Jan 15, 2024" |
| Precise (audit logs) | Full datetime | "Jan 15, 2024 at 2:00:35 PM" |

```tsx
// Pattern: Relative timestamp with full date tooltip
function RelativeTime({ date }: { date: Date }) {
  const relative = getRelativeTimeString(date);
  const full = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <time dateTime={date.toISOString()} title={full} className="text-sm text-gray-500">
      {relative}
    </time>
  );
}
```

---

## Quick Reference Card

### Copy Formulas

| Pattern | Formula | Example |
|---------|---------|---------|
| CTA button | [Verb] + [Object] | "Create project" |
| Loading | [Verb-ing]... | "Saving..." |
| Success | [Object] + [past verb] | "Changes saved" |
| Error title | "Couldn't [verb] [object]" | "Couldn't save changes" |
| Error body | [Reason]. [Recovery step]. | "Server error. Try again in a moment." |
| Empty state title | "No [objects] yet" | "No projects yet" |
| Confirm title | "[Verb] [object]?" | "Delete this project?" |
| Confirm cancel | "[Verb opposite] / Cancel" | "Keep project" |
| Tooltip | [What it does / why it matters] | "Manage account and preferences" |

### Writing Checklist

Before shipping microcopy, verify:

- [ ] No placeholder text left ("Lorem ipsum", "TODO", "TBD")
- [ ] No technical jargon or error codes exposed to users
- [ ] All CTAs use verb + object pattern
- [ ] All error messages include recovery guidance
- [ ] Destructive dialogs use verb-based buttons (not Yes/No)
- [ ] Empty states include a helpful message and next action
- [ ] Tone is consistent across similar contexts
- [ ] No gender-specific language (use "they" for singular)
- [ ] Numbers and dates formatted consistently
- [ ] All text is translatable (no concatenated strings)
