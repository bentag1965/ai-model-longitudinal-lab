# Provider Normalization

AI providers expose different request and response structures. A longitudinal system needs a stable internal representation.

## Normalized Request

```ts
interface GenerationRequest {
  seedId: string;
  prompt: string;
  model: string;
  temperature?: number;
  maxOutputTokens?: number;
}
```

## Normalized Response

```ts
interface GenerationResult {
  provider: string;
  model: string;
  outputText: string;
  startedAt: string;
  completedAt: string;
  latencyMs: number;
  inputTokens?: number;
  outputTokens?: number;
  providerRequestId?: string;
  rawMetadata?: Record<string, unknown>;
}
```

## Why Normalize

Without normalization, downstream analysis becomes coupled to every provider's API shape.

Normalization allows the rest of the system to reason about:

- one output field
- one timing model
- one token accounting structure
- one error contract
- one provider identity field

Provider-native metadata can still be retained for forensic or diagnostic use.
