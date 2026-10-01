# ADR-001: Separate provider adapters from experiment orchestration

**Status:** Accepted

## Context

AI providers expose different request formats, response shapes, token accounting, error contracts, and model identifiers. Embedding provider-specific logic in the experiment runner would tightly couple orchestration to external APIs and make longitudinal comparison harder to reason about.

## Decision

Use a provider interface that converts a normalized generation request into a normalized generation result. Provider-specific request construction and response parsing remain inside adapters.

## Consequences

### Positive

- experiment orchestration stays provider-neutral
- providers can be added or replaced independently
- downstream storage and evaluation receive a stable shape
- tests can use mock providers without external API access

### Tradeoffs

- normalization may hide provider-specific features
- adapter maintenance is required as APIs evolve
- raw provider metadata must be retained separately when needed

## Alternatives considered

### Provider-specific runners
Rejected because orchestration logic would be duplicated.

### Single universal request object containing every provider feature
Rejected because it would grow into a lowest-common-denominator abstraction with many provider-specific escape hatches.
