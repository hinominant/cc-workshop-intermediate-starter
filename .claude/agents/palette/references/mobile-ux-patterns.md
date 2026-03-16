# Mobile UX Patterns Reference

Comprehensive mobile-specific UX patterns for Palette.

## Touch Interaction Fundamentals

### Touch Target Sizing

**Minimum Size Requirements:**

| Standard | Minimum Size | Recommended |
|----------|--------------|-------------|
| WCAG 2.2 (AAA) | 44 x 44 px | 48 x 48 px |
| Material Design | 48 x 48 dp | 48 x 48 dp |
| Apple HIG | 44 x 44 pt | 44 x 44 pt |

**Implementation Pattern:**

```tsx
// Pattern: Ensuring touch target size
<button
  className={cn(
    "min-h-[44px] min-w-[44px]",  // Minimum touch target
    "p-3",                         // Padding for visual spacing
    "flex items-center justify-center"
  )}
  aria-label="Delete item"
>
  <TrashIcon className="h-5 w-5" /> {/* Icon can be smaller */}
</button>
```

**Common Violations:**

| Element | Typical Size | Fix |
|---------|--------------|-----|
| Icon-only buttons | 24 x 24 px | Add padding or wrapper |
| Text links | Line height | Add vertical padding |
| Close buttons | 16 x 16 px | Increase to 44 x 44 px |
| Checkbox/Radio | 16 x 16 px | Add clickable label area |

### Touch Feedback Patterns

**Visual Feedback States:**

```tsx
// Pattern: Touch feedback with ripple effect
<button
  className={cn(
    "relative overflow-hidden",
    "active:scale-95 transition-transform duration-100",
    // Ripple container
    "after:content-[''] after:absolute after:inset-0",
    "after:bg-current after:opacity-0",
    "active:after:opacity-10 after:transition-opacity"
  )}
>
  {children}
</button>
```

**Touch State Timing:**

| State | Delay | Duration | Use Case |
|-------|-------|----------|----------|
| Touch start highlight | 0ms | - | Immediate feedback |
| Tap animation | 0ms | 100-150ms | Button press |
| Long press | 500ms | - | Context menu trigger |
| Touch cancel | 0ms | 100ms | Scroll/gesture detected |

---

## Gesture Affordances

### Swipe Actions

**Pattern: Swipe to reveal actions**

```tsx
// Use cases: Delete, archive, mark as read
<SwipeableRow
  leftActions={[
    { icon: <ArchiveIcon />, color: "green", onSwipe: handleArchive }
  ]}
  rightActions={[
    { icon: <TrashIcon />, color: "red", onSwipe: handleDelete }
  ]}
  threshold={0.3}  // 30% of width triggers action
>
  <ListItem />
</SwipeableRow>
```

**Swipe UX Guidelines:**

| Guideline | Requirement |
|-----------|-------------|
| Visual hint | Show peek of action on partial swipe |
| Threshold indicator | Color change or haptic at activation point |
| Undo option | Provide undo for destructive swipes |
| Consistency | Same direction = same action type |

### Pinch & Zoom

**Pattern: Image zoom with boundaries**

```tsx
// Pattern: Constrained pinch-zoom
<PinchZoom
  minScale={1}
  maxScale={4}
  onDoubleTap={() => toggleZoom()}
  boundaryResistance={0.3}
>
  <Image src={src} alt={alt} />
</PinchZoom>
```

### Long Press

**Pattern: Context menu on long press**

```tsx
// Pattern: Long press with visual feedback
const [pressing, setPressing] = useState(false);

<div
  onTouchStart={() => setPressing(true)}
  onTouchEnd={() => setPressing(false)}
  onContextMenu={(e) => {
    e.preventDefault();
    showContextMenu();
  }}
  className={cn(
    "transition-all duration-150",
    pressing && "scale-95 opacity-80"
  )}
>
  {content}
</div>
```

**Long Press Guidelines:**

| Aspect | Recommendation |
|--------|----------------|
| Duration | 500ms (iOS) / 400ms (Android) |
| Feedback | Scale down + opacity change at ~200ms |
| Haptic | Vibrate at activation |
| Cancel | Slide away cancels long press |

---

## Virtual Keyboard Handling

### Input Type Optimization

**Keyboard Type Mapping:**

| Input Purpose | `type` | `inputMode` | `autocomplete` |
|---------------|--------|-------------|----------------|
| Email address | email | email | email |
| Phone number | tel | tel | tel |
| URL | url | url | url |
| Search | search | search | - |
| Number (general) | text | numeric | - |
| Currency | text | decimal | - |
| Credit card | text | numeric | cc-number |
| One-time code | text | numeric | one-time-code |

**Implementation Pattern:**

```tsx
// Pattern: Optimized mobile input
<input
  type="tel"
  inputMode="tel"
  autoComplete="tel"
  pattern="[0-9\-\+\s]+"
  placeholder="090-1234-5678"
/>
```

### Keyboard Avoidance

**Problem**: Virtual keyboard covers input fields

**Solutions:**

```tsx
// Pattern 1: Viewport meta for zoom prevention
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=1"
/>

// Pattern 2: Scroll into view on focus
<input
  onFocus={(e) => {
    setTimeout(() => {
      e.target.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 300); // Wait for keyboard animation
  }}
/>

// Pattern 3: Fixed submit button above keyboard
<div className="fixed bottom-0 inset-x-0 pb-safe">
  <button className="w-full p-4 bg-primary text-white">
    Submit
  </button>
</div>
```

### Form Field Focus Management

**Pattern: Smart focus progression**

```tsx
// Pattern: Auto-advance on complete
<input
  type="text"
  maxLength={4}
  inputMode="numeric"
  onInput={(e) => {
    if (e.target.value.length === 4) {
      nextInputRef.current?.focus();
    }
  }}
/>
```

---

## One-Handed Use Patterns

### Thumb Zone Optimization

```
┌─────────────────────────────┐
│                             │
│      HARD TO REACH          │
│         (top)               │
│                             │
├─────────────────────────────┤
│                             │
│        STRETCH              │
│    (upper corners)          │
│                             │
├─────────────────────────────┤
│                             │
│        NATURAL              │
│     (bottom half)           │
│    ← primary actions        │
│                             │
└─────────────────────────────┘
```

**Placement Guidelines:**

| Action Type | Recommended Position |
|-------------|---------------------|
| Primary CTA | Bottom center/right |
| Frequent actions | Bottom bar |
| Navigation | Bottom tab bar |
| Secondary actions | Top (behind menu) |
| Destructive actions | Confirm dialog (center) |

### Bottom Sheet Navigation

**Pattern: Bottom sheet for options**

```tsx
// Pattern: Bottom sheet with drag-to-dismiss
<BottomSheet
  snapPoints={[0.5, 1]}  // 50% and full height
  initialSnap={0}
  enableDynamicSizing
>
  <BottomSheetHandle />
  <BottomSheetContent>
    {/* Actions positioned for thumb access */}
  </BottomSheetContent>
</BottomSheet>
```

**Bottom Sheet Guidelines:**

| Aspect | Recommendation |
|--------|----------------|
| Handle visibility | Always show drag indicator |
| Snap points | Max 3 positions |
| Dismiss gesture | Swipe down or tap backdrop |
| Content scrolling | Sheet must be at full height to scroll |

### Floating Action Button (FAB)

**Pattern: FAB with safe positioning**

```tsx
// Pattern: FAB with safe area respect
<button
  className={cn(
    "fixed bottom-6 right-6",
    "mb-safe",  // Safe area for home indicator
    "h-14 w-14 rounded-full",
    "shadow-lg",
    "flex items-center justify-center"
  )}
>
  <PlusIcon />
</button>
```

---

## Pull-to-Refresh Pattern

**Implementation:**

```tsx
// Pattern: Pull-to-refresh with visual feedback
<PullToRefresh
  onRefresh={async () => {
    await fetchData();
  }}
  threshold={60}           // Pixels to pull before triggering
  maxPull={120}            // Maximum pull distance
  refreshingContent={<Spinner />}
  pullingContent={({ progress }) => (
    <RefreshIndicator progress={progress} />
  )}
>
  <ScrollableContent />
</PullToRefresh>
```

**UX Guidelines:**

| Aspect | Recommendation |
|--------|----------------|
| Threshold | 60-80px before triggering |
| Max pull | 1.5-2x threshold |
| Visual feedback | Spinner rotation matches pull progress |
| Haptic | Light haptic at threshold |
| Release behavior | Snap back if below threshold |

---

## Infinite Scroll Pattern

**Implementation:**

```tsx
// Pattern: Infinite scroll with loading states
<InfiniteScroll
  hasMore={hasNextPage}
  loadMore={fetchNextPage}
  threshold={200}  // Pixels from bottom to trigger
  loader={<LoadingSkeletons count={3} />}
  endMessage={
    <p className="text-center text-muted py-4">
      You've seen it all!
    </p>
  }
>
  {items.map(item => <ItemCard key={item.id} {...item} />)}
</InfiniteScroll>
```

**UX Guidelines:**

| Aspect | Recommendation |
|--------|----------------|
| Trigger distance | 200-300px before end |
| Loading indicator | Skeleton matching content |
| Error state | Retry button (not auto-retry) |
| Empty state | Clear message with action |
| End of list | Visible "end" indicator |
| Back navigation | Preserve scroll position |

---

## Mobile Navigation Patterns

### Tab Bar

**Pattern: Bottom tab navigation**

```tsx
// Pattern: Bottom tab bar with safe area
<nav className="fixed bottom-0 inset-x-0 bg-white border-t pb-safe">
  <ul className="flex justify-around">
    {tabs.map(tab => (
      <li key={tab.id}>
        <Link
          href={tab.href}
          className={cn(
            "flex flex-col items-center py-2 px-4",
            "min-h-[44px]",  // Touch target
            isActive && "text-primary"
          )}
        >
          <tab.icon className="h-6 w-6" />
          <span className="text-xs mt-1">{tab.label}</span>
        </Link>
      </li>
    ))}
  </ul>
</nav>
```

**Tab Bar Guidelines:**

| Aspect | Recommendation |
|--------|----------------|
| Max items | 5 tabs maximum |
| Labels | Always show (not icon-only) |
| Active state | Color + filled icon |
| Badge | Position top-right of icon |

### Drawer Navigation

**Pattern: Side drawer with gesture**

```tsx
// Pattern: Drawer with edge swipe
<Drawer
  open={isOpen}
  onOpenChange={setIsOpen}
  modal={true}
  direction="left"
>
  <DrawerTrigger asChild>
    <button className="p-2">
      <MenuIcon />
    </button>
  </DrawerTrigger>
  <DrawerContent className="w-[280px]">
    {/* Navigation items */}
  </DrawerContent>
</Drawer>
```

---

## Performance Considerations

### Scroll Performance

```tsx
// Pattern: Virtualized list for long content
<VirtualizedList
  items={items}
  itemHeight={72}
  overscan={5}  // Render 5 extra items above/below viewport
  renderItem={(item, index) => (
    <ListItem key={item.id} {...item} />
  )}
/>
```

### Touch Event Optimization

```tsx
// Pattern: Passive event listeners for scroll
useEffect(() => {
  const handleTouchMove = (e) => {
    // Handle touch move
  };

  document.addEventListener('touchmove', handleTouchMove, { passive: true });

  return () => {
    document.removeEventListener('touchmove', handleTouchMove);
  };
}, []);
```

### Image Loading

```tsx
// Pattern: Progressive image loading
<picture>
  <source
    srcSet="/image.webp"
    type="image/webp"
  />
  <img
    src="/image.jpg"
    loading="lazy"
    decoding="async"
    alt={alt}
    className="bg-gray-200"  // Placeholder color
  />
</picture>
```

---

## Mobile-Specific Accessibility

### VoiceOver/TalkBack Considerations

| Pattern | Implementation |
|---------|---------------|
| Swipe actions | Add hidden button alternatives |
| Custom gestures | Provide accessible alternatives |
| Drag-and-drop | Enable with a11y mode |
| Long press | Ensure discoverable alternative |

### Motor Impairment Support

```tsx
// Pattern: Adjustable touch target
<div className="p-2 -m-2">  {/* Invisible touch extension */}
  <button className="h-8 w-8">
    <CloseIcon />
  </button>
</div>
```

---

## Mobile UX Checklist

### Touch Targets
- [ ] All interactive elements ≥ 44x44px
- [ ] Adequate spacing between targets (8px minimum)
- [ ] Touch feedback on all interactive elements

### Gestures
- [ ] Swipe actions have visible affordances
- [ ] Long press has alternative activation method
- [ ] Pinch/zoom respects content boundaries

### Keyboard
- [ ] Correct input types for all fields
- [ ] Keyboard doesn't cover active input
- [ ] Submit button visible when keyboard open

### Navigation
- [ ] Primary actions in thumb zone
- [ ] Back navigation always available
- [ ] Scroll position preserved on return

### Performance
- [ ] Scroll feels smooth (60fps)
- [ ] Touch response < 100ms
- [ ] Images lazy-loaded appropriately
