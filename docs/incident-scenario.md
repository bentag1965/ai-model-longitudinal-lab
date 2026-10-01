# Incident Scenario: One Provider Starts Timing Out

## Symptoms

- one provider latency rises sharply
- timeout failures increase
- other providers continue succeeding

## Response

1. confirm the issue is isolated to one provider/model
2. preserve failed run records rather than deleting or rerunning blindly
3. reduce concurrency for the affected provider
4. increase bounded backoff if rate limiting or transient instability is suspected
5. allow unaffected providers to continue
6. verify persistence remains healthy
7. resume normal scheduling only after error rate returns to baseline

## Important Principle

Do not invalidate a multi-provider experiment just because one provider is temporarily unavailable. Preserve partial observations and provenance.
