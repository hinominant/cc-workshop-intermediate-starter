# Feature Flag Patterns

## Flag Types

| Type | Lifecycle | Example |
|------|-----------|---------|
| Release | Short (days-weeks) | New checkout flow |
| Experiment | Medium (weeks) | A/B test variant |
| Ops | Permanent | Kill switch, rate limit |
| Permission | Permanent | Premium features |

## LaunchDarkly Integration

```typescript
import { init } from 'launchdarkly-js-client-sdk';

const client = init('client-key', { key: userId });

const showNewCheckout = client.variation('new-checkout', false);
```

## Custom Feature Flag

```typescript
interface FeatureFlag {
  key: string;
  enabled: boolean;
  variants?: Record<string, unknown>;
  targeting?: { percentage: number; segments?: string[] };
}
```

## Cleanup Checklist
- [ ] Remove flag evaluation code
- [ ] Remove losing variant code
- [ ] Archive flag in management system
- [ ] Update documentation
