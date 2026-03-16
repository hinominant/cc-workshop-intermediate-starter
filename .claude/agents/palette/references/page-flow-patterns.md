# Page & Flow UX Patterns Reference

Comprehensive page-level and flow-level UX patterns for Palette.

## Page States

### Empty States

**When to Use:** Any view that can contain zero items (lists, tables, dashboards, search results).

**Decision Matrix:**

| Scenario | Illustration | Message | CTA | Example |
|----------|-------------|---------|-----|---------|
| First-use (no data yet) | Welcome graphic | Explain value | Primary action | "Create your first project" |
| Search no results | Search icon | Acknowledge query | Suggest alternatives | "No results for 'xyz'. Try different keywords." |
| Filter no results | Filter icon | Explain cause | Clear filters | "No items match your filters." |
| Data deleted/archived | Folder icon | Explain state | Navigate or undo | "All items archived. View archive?" |
| Permission denied | Lock icon | Explain access | Request access | "You don't have access. Request from admin." |

**First-Use Empty State:**

```tsx
// Use when: User sees a section for the first time with no data
function FirstUseEmptyState({
  title,
  description,
  actionLabel,
  onAction,
  illustration: Illustration,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Illustration && (
        <div className="mb-6 text-gray-300" aria-hidden>
          <Illustration className="h-24 w-24" />
        </div>
      )}
      <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      <button
        onClick={onAction}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus-visible:ring-2"
      >
        {actionLabel}
      </button>
    </div>
  );
}

// Usage
<FirstUseEmptyState
  title="No projects yet"
  description="Projects help you organize tasks and collaborate with your team."
  actionLabel="Create your first project"
  onAction={() => setShowCreateDialog(true)}
  illustration={FolderPlusIcon}
/>
```

**Search No Results:**

```tsx
// Use when: Search query returns zero matches
function SearchNoResults({
  query,
  suggestions,
  onClearSearch,
}: SearchNoResultsProps) {
  return (
    <div className="text-center py-12 px-4">
      <SearchIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" aria-hidden />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No results for &ldquo;{query}&rdquo;
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Try different keywords or check for typos.
      </p>
      {suggestions && suggestions.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Suggestions:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => onSearch(s)}
                className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={onClearSearch}
        className="text-sm text-blue-600 hover:underline"
      >
        Clear search
      </button>
    </div>
  );
}
```

**Filter No Results:**

```tsx
// Use when: Active filters exclude all items
function FilterNoResults({
  activeFilterCount,
  onClearFilters,
}: FilterNoResultsProps) {
  return (
    <div className="text-center py-12 px-4">
      <FilterIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" aria-hidden />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No items match your filters
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        {activeFilterCount} active filter{activeFilterCount > 1 ? "s" : ""} applied.
        Try adjusting or clearing filters.
      </p>
      <button
        onClick={onClearFilters}
        className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
      >
        Clear all filters
      </button>
    </div>
  );
}
```

**Empty State Anti-Patterns:**

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| Blank screen | User thinks page is broken | Add illustration + message + CTA |
| "No data" with no action | User doesn't know what to do | Always provide a next step |
| Technical message ("null", "[]") | Confuses non-technical users | Use friendly, plain language |
| Same empty state for all scenarios | Misses context-specific guidance | Customize per scenario |

---

### Error Pages

**Error Page Decision Matrix:**

| Error | User Message | Recovery Action |
|-------|-------------|-----------------|
| 404 Not Found | "We couldn't find that page" | Search, go home, go back |
| 403 Forbidden | "You don't have access" | Request access, contact admin |
| 500 Server Error | "Something went wrong on our end" | Retry, go home, contact support |
| Network Error | "You appear to be offline" | Retry when connected |
| Timeout | "This is taking longer than expected" | Retry, check status |

**404 Page:**

```tsx
// Use when: Page or resource not found
function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <p className="text-6xl font-bold text-gray-200 mb-4" aria-hidden>
        404
      </p>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">
        Page not found
      </h1>
      <p className="text-sm text-gray-500 max-w-md mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => history.back()}
          className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
        >
          Go back
        </button>
        <Link
          href="/"
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to homepage
        </Link>
      </div>
    </div>
  );
}
```

**500 Error Page:**

```tsx
// Use when: Server-side error occurred
function ServerErrorPage({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <AlertCircleIcon className="h-16 w-16 text-red-300 mb-4" aria-hidden />
      <h1 className="text-xl font-semibold text-gray-900 mb-2">
        Something went wrong
      </h1>
      <p className="text-sm text-gray-500 max-w-md mb-6">
        We're having trouble loading this page. Please try again or come back later.
      </p>
      <div className="flex gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try again
          </button>
        )}
        <Link
          href="/"
          className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
        >
          Go to homepage
        </Link>
      </div>
    </div>
  );
}
```

**Inline Error Boundary:**

```tsx
// Use when: A section of the page fails but the rest still works
function SectionErrorFallback({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded" role="alert">
      <div className="flex items-center gap-3">
        <AlertCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0" aria-hidden />
        <p className="text-sm text-red-700">
          Failed to load this section.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="text-sm text-red-600 hover:text-red-800 underline"
      >
        Retry
      </button>
    </div>
  );
}
```

---

### Loading States

**Full Page Skeleton:**

```tsx
// Use when: Loading an entire page with known layout structure
function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-6" aria-busy="true" aria-label="Loading page">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
      {/* Content skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded" />
        ))}
      </div>
      {/* List skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-10 w-10 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Content Placeholder (Skeleton for Cards):**

```tsx
// Use when: Loading a grid of cards
function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      aria-busy="true"
      aria-label="Loading content"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse border rounded-lg p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
          <div className="flex gap-2 mt-4">
            <div className="h-6 bg-gray-200 rounded w-16" />
            <div className="h-6 bg-gray-200 rounded w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Skeleton Design Rule:** Match the skeleton shape to the actual content layout. Users should recognize the UI before it loads.

---

### Offline States

```tsx
// Use when: User loses network connectivity
function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      role="alert"
      className="fixed top-0 inset-x-0 z-50 bg-yellow-500 text-yellow-900 text-sm text-center py-2 px-4"
    >
      <WifiOffIcon className="inline h-4 w-4 mr-2" aria-hidden />
      You're offline. Some features may be unavailable.
    </div>
  );
}
```

**Reconnection Pattern:**

```tsx
// Use when: Showing reconnection state after offline period
function ReconnectionNotice({ isReconnecting }: { isReconnecting: boolean }) {
  if (!isReconnecting) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-0 inset-x-0 z-50 bg-green-500 text-white text-sm text-center py-2 px-4"
    >
      <RefreshIcon className="inline h-4 w-4 mr-2 animate-spin" aria-hidden />
      Reconnecting... Syncing your changes.
    </div>
  );
}
```

---

## Navigation & Wayfinding

### Breadcrumbs

```tsx
// Use when: Pages deeper than 2 levels in hierarchy
function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1 text-sm text-gray-500">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRightIcon className="h-3 w-3 text-gray-400" aria-hidden />
            )}
            {index === items.length - 1 ? (
              <span aria-current="page" className="text-gray-900 font-medium">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-gray-700 hover:underline"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

**Breadcrumb with Overflow (Mobile):**

```tsx
// Use when: Breadcrumb trail is too long for mobile screens
function CollapsibleBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const showCollapsed = items.length > 3;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1 text-sm text-gray-500">
        {/* Always show first item */}
        <BreadcrumbItem item={items[0]} />

        {showCollapsed && (
          <>
            <ChevronRightIcon className="h-3 w-3 text-gray-400" aria-hidden />
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger className="px-1 hover:text-gray-700">
                  ...
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {items.slice(1, -2).map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </>
        )}

        {/* Always show last 2 items */}
        {items.slice(showCollapsed ? -2 : 1).map((item, i) => (
          <Fragment key={item.href}>
            <ChevronRightIcon className="h-3 w-3 text-gray-400" aria-hidden />
            <BreadcrumbItem
              item={item}
              isCurrent={i === (showCollapsed ? 1 : items.length - 2)}
            />
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
```

---

### Dead-End Prevention

Every page should have at least one clear next action. Check for these patterns:

| Page Type | Required Next Actions |
|-----------|----------------------|
| Detail page | Edit, Delete, Back to list |
| Success page | View item, Create another, Go to dashboard |
| Error page | Retry, Go back, Go home |
| Empty state | Create first item, Import data |
| Settings | Save, Cancel, Back |
| End of wizard | View result, Share, Go to dashboard |

```tsx
// Pattern: Page footer with contextual actions
function PageActions({
  primaryAction,
  secondaryActions,
}: PageActionsProps) {
  return (
    <div className="flex items-center justify-between border-t pt-4 mt-8">
      <div className="flex gap-2">
        {secondaryActions?.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
          >
            {action.label}
          </button>
        ))}
      </div>
      {primaryAction && (
        <button
          onClick={primaryAction.onClick}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {primaryAction.label}
        </button>
      )}
    </div>
  );
}
```

---

### Multi-Step Progress Indicator

```tsx
// Use when: Multi-step wizard or process with 3+ steps
function StepIndicator({
  steps,
  currentStep,
}: {
  steps: { label: string }[];
  currentStep: number;
}) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, index) => (
          <li key={step.label} className="flex items-center">
            <div
              className={cn(
                "flex items-center gap-2",
                index <= currentStep ? "text-blue-600" : "text-gray-400"
              )}
              aria-current={index === currentStep ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                  index < currentStep && "bg-blue-600 text-white",
                  index === currentStep && "border-2 border-blue-600 text-blue-600",
                  index > currentStep && "border-2 border-gray-300 text-gray-400"
                )}
              >
                {index < currentStep ? (
                  <CheckIcon className="h-4 w-4" aria-hidden />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={cn(
                  "text-sm hidden sm:inline",
                  index <= currentStep ? "text-gray-900" : "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4",
                  index < currentStep ? "bg-blue-600" : "bg-gray-200"
                )}
                aria-hidden
              />
            )}
          </li>
        ))}
      </ol>
      {/* Screen reader announcement */}
      <p className="sr-only">
        Step {currentStep + 1} of {steps.length}: {steps[currentStep].label}
      </p>
    </nav>
  );
}
```

---

## Search, Filter & Data Display

### Search Patterns

**Instant Search with Debounce:**

```tsx
// Use when: Searching a dataset client-side or with fast API
function SearchInput({
  onSearch,
  placeholder = "Search...",
}: SearchInputProps) {
  const [query, setQuery] = useState("");

  const debouncedSearch = useDebouncedCallback((value: string) => {
    onSearch(value);
  }, 300);

  return (
    <div className="relative">
      <SearchIcon
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
        aria-hidden
      />
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          debouncedSearch(e.target.value);
        }}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border rounded"
        role="searchbox"
        aria-label={placeholder}
      />
      {query && (
        <button
          onClick={() => {
            setQuery("");
            onSearch("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          aria-label="Clear search"
        >
          <XIcon className="h-4 w-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}
```

**Search with Suggestions:**

```tsx
// Use when: Predictive search helps users find results faster
function SearchWithSuggestions({ suggestions, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = suggestions.filter((s) =>
    s.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative" role="combobox" aria-expanded={isOpen}>
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(e.target.value.length > 0);
        }}
        onFocus={() => query && setIsOpen(true)}
        aria-controls="search-suggestions"
        aria-autocomplete="list"
        className="w-full px-4 py-2 border rounded"
      />
      {isOpen && filtered.length > 0 && (
        <ul
          id="search-suggestions"
          role="listbox"
          className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto"
        >
          {filtered.map((item) => (
            <li
              key={item.id}
              role="option"
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                onSelect(item);
                setIsOpen(false);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

### Filter Patterns

**Visible Filters with Active Indicators:**

```tsx
// Use when: Users need to narrow down a list with multiple criteria
function FilterBar({
  filters,
  activeFilters,
  onToggle,
  onClearAll,
}: FilterBarProps) {
  const activeCount = Object.values(activeFilters).flat().length;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {filters.map((filter) => (
        <DropdownMenu key={filter.id}>
          <DropdownMenuTrigger
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 text-sm border rounded-full",
              activeFilters[filter.id]?.length
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-white border-gray-200 text-gray-700"
            )}
          >
            {filter.label}
            {activeFilters[filter.id]?.length > 0 && (
              <span className="ml-1 bg-blue-100 text-blue-700 rounded-full px-1.5 text-xs">
                {activeFilters[filter.id].length}
              </span>
            )}
            <ChevronDownIcon className="h-3 w-3" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {filter.options.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={activeFilters[filter.id]?.includes(option.value)}
                onCheckedChange={() => onToggle(filter.id, option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}

      {activeCount > 0 && (
        <button
          onClick={onClearAll}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear all ({activeCount})
        </button>
      )}
    </div>
  );
}
```

**Active Filter Tags:**

```tsx
// Use when: Showing removable tags for each active filter
function ActiveFilterTags({
  tags,
  onRemove,
  onClearAll,
}: ActiveFilterTagsProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4" role="list" aria-label="Active filters">
      {tags.map((tag) => (
        <span
          key={tag.id}
          role="listitem"
          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm"
        >
          {tag.label}
          <button
            onClick={() => onRemove(tag.id)}
            aria-label={`Remove filter: ${tag.label}`}
            className="hover:text-red-500"
          >
            <XIcon className="h-3 w-3" />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm text-gray-500 hover:text-gray-700 underline"
      >
        Clear all
      </button>
    </div>
  );
}
```

---

### Data Tables

```tsx
// Use when: Displaying structured data with sorting and pagination
function DataTable<T>({
  columns,
  data,
  sortColumn,
  sortDirection,
  onSort,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto border rounded">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            {columns.map((col) => (
              <th
                key={col.id}
                scope="col"
                className="px-4 py-3 text-left font-medium text-gray-700"
              >
                {col.sortable ? (
                  <button
                    onClick={() => onSort(col.id)}
                    className="flex items-center gap-1 hover:text-gray-900"
                    aria-sort={
                      sortColumn === col.id
                        ? sortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    {col.label}
                    <SortIcon
                      active={sortColumn === col.id}
                      direction={sortDirection}
                      className="h-4 w-4"
                    />
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="border-b last:border-b-0 hover:bg-gray-50"
            >
              {columns.map((col) => (
                <td key={col.id} className="px-4 py-3">
                  {col.render ? col.render(row) : row[col.id]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**Table with Row Actions:**

```tsx
// Pattern: Row-level actions via dropdown menu
<td className="px-4 py-3 text-right">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        aria-label={`Actions for ${row.name}`}
        className="p-1 hover:bg-gray-100 rounded"
      >
        <MoreHorizontalIcon className="h-4 w-4" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => onEdit(row.id)}>
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onDuplicate(row.id)}>
        Duplicate
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => onDelete(row.id)}
        className="text-red-600"
      >
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</td>
```

---

### Pagination

```tsx
// Use when: Splitting large datasets across pages
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = generatePageNumbers(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between mt-4">
      <p className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        {pages.map((page, i) =>
          page === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                "h-8 w-8 rounded text-sm",
                page === currentPage
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              )}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
```

**Infinite Scroll vs Pagination Decision:**

| Factor | Pagination | Infinite Scroll |
|--------|-----------|-----------------|
| Content type | Structured data, tables | Social feeds, galleries |
| User intent | Find specific item | Browse / discover |
| SEO needs | Yes (URL per page) | No |
| Bookmarking | Easy (page number) | Hard (scroll position) |
| Performance | Predictable | Requires virtualization |
| Footer access | Always reachable | Blocked by loading |

---

### Result Feedback

```tsx
// Use when: Showing count and position within results
function ResultSummary({
  total,
  from,
  to,
  query,
}: ResultSummaryProps) {
  return (
    <p className="text-sm text-gray-500" role="status" aria-live="polite">
      {query ? (
        <>
          Showing {from}&ndash;{to} of {total} results for &ldquo;{query}&rdquo;
        </>
      ) : (
        <>
          Showing {from}&ndash;{to} of {total} items
        </>
      )}
    </p>
  );
}
```

**Accessibility:** Use `role="status"` and `aria-live="polite"` so screen readers announce updated result counts after search or filter changes.

---

## Onboarding & First-Use

### Progressive Disclosure

```tsx
// Use when: Revealing features in stages to reduce overwhelm
function ProgressiveFeatureReveal({
  userLevel,
}: {
  userLevel: "new" | "intermediate" | "advanced";
}) {
  return (
    <div className="space-y-4">
      {/* Always visible */}
      <FeatureCard title="Create a project" description="Start organizing your work" />

      {/* Visible after first project */}
      {userLevel !== "new" && (
        <FeatureCard title="Invite teammates" description="Collaborate in real-time" />
      )}

      {/* Visible for advanced users */}
      {userLevel === "advanced" && (
        <FeatureCard title="API access" description="Automate with our REST API" />
      )}
    </div>
  );
}
```

**Progressive Disclosure Anti-Patterns:**

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| Hiding everything | User cannot discover features | Show basic options always |
| Revealing too soon | Overwhelms new users | Gate by usage milestones |
| No "show all" escape hatch | Power users feel restricted | Provide "Advanced" toggle |

---

### Setup Wizard

```tsx
// Use when: Initial configuration requires multiple decisions
function SetupWizard({ onComplete }: { onComplete: (data: SetupData) => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<SetupData>>({});

  const steps = [
    { id: "profile", label: "Profile", component: ProfileStep },
    { id: "workspace", label: "Workspace", component: WorkspaceStep },
    { id: "preferences", label: "Preferences", component: PreferencesStep },
  ];

  const CurrentStepComponent = steps[step].component;

  const handleNext = (stepData: Partial<SetupData>) => {
    const updatedData = { ...data, ...stepData };
    setData(updatedData);

    if (step === steps.length - 1) {
      onComplete(updatedData as SetupData);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-12">
      <StepIndicator steps={steps} currentStep={step} />

      <div className="mt-8">
        <CurrentStepComponent
          data={data}
          onNext={handleNext}
          onBack={() => setStep((prev) => prev - 1)}
          isFirst={step === 0}
          isLast={step === steps.length - 1}
        />
      </div>

      {/* Skip option for non-critical setup */}
      {step < steps.length - 1 && (
        <button
          onClick={() => setStep((prev) => prev + 1)}
          className="mt-4 text-sm text-gray-400 hover:text-gray-600 underline"
        >
          Skip for now
        </button>
      )}
    </div>
  );
}
```

---

### Feature Discovery

**Tooltip Coach Mark:**

```tsx
// Use when: Introducing a new feature to existing users
function CoachMark({
  title,
  description,
  onDismiss,
  step,
  totalSteps,
}: CoachMarkProps) {
  return (
    <div
      role="dialog"
      aria-label={title}
      className={cn(
        "absolute z-50 bg-blue-600 text-white rounded-lg shadow-xl p-4 max-w-xs",
        "after:content-[''] after:absolute after:border-8 after:border-transparent",
        "after:border-t-blue-600 after:-bottom-4 after:left-6"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{title}</h3>
        <button
          onClick={onDismiss}
          aria-label="Dismiss tip"
          className="text-blue-200 hover:text-white"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>
      <p className="text-sm text-blue-100 mb-3">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-blue-200">
          {step} of {totalSteps}
        </span>
        <button
          onClick={onDismiss}
          className="text-sm font-medium hover:underline"
        >
          {step === totalSteps ? "Done" : "Next"}
        </button>
      </div>
    </div>
  );
}
```

**Contextual Hint (Inline):**

```tsx
// Use when: Providing inline guidance near a feature
function ContextualHint({
  id,
  children,
  onDismiss,
}: {
  id: string;
  children: React.ReactNode;
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded text-sm">
      <LightbulbIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" aria-hidden />
      <div className="flex-1 text-blue-800">{children}</div>
      <button
        onClick={() => onDismiss(id)}
        aria-label="Dismiss hint"
        className="text-blue-400 hover:text-blue-600"
      >
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
```

---

## Dashboard & Overview Layouts

### Metric Card

```tsx
// Use when: Showing KPIs or summary metrics on dashboards
function MetricCard({
  label,
  value,
  change,
  changeDirection,
  icon: Icon,
}: MetricCardProps) {
  return (
    <div className="p-6 bg-white border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        {Icon && (
          <div className="h-8 w-8 rounded bg-gray-50 flex items-center justify-center">
            <Icon className="h-4 w-4 text-gray-400" aria-hidden />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {change !== undefined && (
        <p
          className={cn(
            "text-sm mt-1 flex items-center gap-1",
            changeDirection === "up" && "text-green-600",
            changeDirection === "down" && "text-red-600",
            changeDirection === "neutral" && "text-gray-500"
          )}
        >
          {changeDirection === "up" && <ArrowUpIcon className="h-3 w-3" aria-hidden />}
          {changeDirection === "down" && <ArrowDownIcon className="h-3 w-3" aria-hidden />}
          {change}
        </p>
      )}
    </div>
  );
}
```

### Status Indicators

```tsx
// Use when: Showing item or system status at a glance
function StatusBadge({
  status,
}: {
  status: "active" | "warning" | "error" | "inactive";
}) {
  const config = {
    active: { label: "Active", className: "bg-green-50 text-green-700 border-green-200" },
    warning: { label: "Warning", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    error: { label: "Error", className: "bg-red-50 text-red-700 border-red-200" },
    inactive: { label: "Inactive", className: "bg-gray-50 text-gray-500 border-gray-200" },
  };

  const { label, className } = config[status];

  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border rounded-full", className)}>
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "active" && "bg-green-500",
          status === "warning" && "bg-yellow-500",
          status === "error" && "bg-red-500",
          status === "inactive" && "bg-gray-400"
        )}
        aria-hidden
      />
      {label}
    </span>
  );
}
```

### Quick Actions

```tsx
// Use when: Providing shortcuts to frequently used operations
function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={action.onClick}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-lg border",
            "hover:bg-gray-50 hover:border-gray-300 transition-colors",
            "focus-visible:ring-2 focus-visible:ring-blue-500"
          )}
        >
          <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
            <action.icon className="h-5 w-5 text-blue-600" aria-hidden />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}
```

---

## Accessibility Notes for Page Patterns

| Pattern | Accessibility Requirement |
|---------|--------------------------|
| Empty states | Informative text (not just images) for screen readers |
| Error pages | Focus the main heading on page load |
| Loading states | `aria-busy="true"` on loading container, `aria-label` for context |
| Breadcrumbs | Wrap in `<nav aria-label="Breadcrumb">`, current page uses `aria-current="page"` |
| Pagination | `aria-label="Pagination"`, `aria-current="page"` on active page |
| Sortable tables | `aria-sort` attribute on sorted column header |
| Search results | `aria-live="polite"` on result count for updates |
| Step indicators | `aria-current="step"` on current step, screen reader text for X of Y |
| Status badges | Do not rely on color alone; include text label |
| Coach marks | Use `role="dialog"` with `aria-label` |

---

## Anti-Pattern Summary

| Anti-Pattern | Category | Impact | Fix |
|-------------|----------|--------|-----|
| Blank page when empty | Empty State | User thinks page is broken | Add illustration + CTA |
| "Error" with no detail | Error Page | User cannot recover | Show cause + next step |
| Full-page spinner for 3+ seconds | Loading | User loses patience | Use skeleton matching layout |
| No offline indication | Offline | User confused by failures | Show banner + cached data |
| No breadcrumbs at depth > 2 | Navigation | User lost in hierarchy | Add breadcrumb trail |
| Dead-end pages | Navigation | User abandons flow | Always provide next action |
| Search with no "clear" button | Search | User manually erases query | Add clear (X) button |
| Filters with no count/indicator | Filter | User forgets active filters | Show active filter badges |
| Unsortable data tables | Data Display | User cannot find items | Add sort to key columns |
| All features shown to new users | Onboarding | Cognitive overload | Stage feature reveal |
