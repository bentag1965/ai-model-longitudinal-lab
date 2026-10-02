# AI Provenance, Versioning, Structured Output, and Cost Controls

This reference project treats AI generation as an auditable experiment rather than an opaque API call.

## Provenance

Each successful observation can carry enough metadata to answer:

- which seed produced the run
- which provider and model generated the output
- which prompt version was used
- which response schema version was expected
- which source references were supplied
- which generation settings were active
- whether two nominally similar requests were actually identical
- whether stored output has changed

The implementation generates:

- a deterministic SHA-256 request fingerprint
- a SHA-256 output hash
- explicit prompt and schema versions
- source-reference metadata

These values make later comparisons safer because a change in experiment conditions can be separated from a change in model behavior.

## Request Fingerprints

The request fingerprint is derived from the normalized experiment conditions, including prompt text, model, temperature, output-token limit, prompt version, schema version, response format, and source references.

Stable key ordering is used before hashing so semantically identical request metadata produces the same fingerprint.

Changing material experiment conditions produces a different fingerprint.

## Structured Output Validation

JSON mode is not treated as proof that a response satisfies the application contract.

The included validator checks:

- valid JSON syntax
- top-level object shape
- required properties
- primitive property types
- optional rejection of unexpected properties

A malformed or incompatible response can therefore be rejected before it is allowed to drive downstream side effects.

## Versioning

Prompt and schema versions are stored separately from model identity.

This matters because longitudinal comparisons can be invalidated by a prompt rewrite or output-contract change even when the nominal model identifier is unchanged.

Recommended versioned artifacts include:

- prompt templates
- system instructions
- JSON schemas
- evaluator rubrics
- normalization logic
- model pricing catalogs

## Cost Accounting

The reference code can estimate run cost from input and output token counts using an explicitly versioned pricing record.

Cost metadata should always include an effective date because provider prices can change independently of model behavior.

The lab should preserve both raw token usage and derived cost so historical cost calculations can be reproduced or recalculated later.

## Persistence

The reference schema includes fields for:

- prompt version
- schema version
- request fingerprint
- source references
- output hash
- estimated cost
- input and output token counts
- provider request ID
- provider metadata

## Operational Principle

AI output should not be the only artifact retained.

A defensible run record preserves the conditions that produced the output, enough metadata to detect experiment changes, and enough usage information to understand latency and cost.

## Failure Boundary

Structured-output validation belongs before downstream side effects.

A robust pattern is:

`source inputs -> versioned prompt -> model call -> parse -> validate -> persist provenance -> approve/continue -> side effect`

This keeps probabilistic generation inside deterministic operational controls.
