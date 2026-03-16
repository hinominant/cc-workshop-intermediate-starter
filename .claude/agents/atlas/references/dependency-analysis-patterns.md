# Dependency Analysis Patterns

## Metrics

| Metric | Definition | Threshold |
|--------|-----------|-----------|
| Afferent Coupling (Ca) | Incoming dependencies | < 20 |
| Efferent Coupling (Ce) | Outgoing dependencies | < 10 |
| Instability | Ce / (Ca + Ce) | 0-1 spectrum |
| Abstractness | Abstract types / Total types | 0-1 spectrum |

## Circular Dependency Detection

```bash
# Using madge (JavaScript/TypeScript)
npx madge --circular src/

# Visual dependency graph
npx madge --image graph.svg src/
```

## Resolution Patterns
1. **Dependency Inversion** - Introduce interface
2. **Event-based** - Replace direct call with event
3. **Mediator** - Introduce coordinator module
