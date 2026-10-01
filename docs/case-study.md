# Case Study: Longitudinal AI Evaluation

## Problem

Comparing AI models once is easy. Comparing them meaningfully over time is harder because providers expose different APIs, models change, stochastic output varies, and evaluators can introduce their own drift.

## Constraints

- multiple providers with incompatible request/response formats
- repeated runs must be comparable
- failed providers must not invalidate successful observations
- historical results must remain immutable
- evaluator logic should not contaminate generation logic
- production credentials and commercial data must remain private

## Design Choices

### Provider abstraction
A normalized request/response contract keeps orchestration independent from provider APIs.

### Immutable observations
Each run is stored as a historical event rather than overwriting prior results.

### Evaluator separation
Generation and scoring are separate stages so results can be re-evaluated later.

### Repeatable sampling
Within-day and longitudinal repeats are represented as configuration rather than embedded scheduling logic.

## Failure Handling

Provider failures are captured as failed observations with error context. Successful provider outputs remain valid and analyzable.

## Observability

A production implementation should track:

- provider latency
- error rate by provider/model
- token usage
- evaluator agreement
- missing scheduled runs
- model/version changes

## Production Hardening

Next production-level steps would include durable queues, rate-limit-aware retries, secrets management, structured telemetry, model-version provenance, and controlled evaluator versioning.

## Engineering Takeaway

The central design problem is not making six API calls. It is preserving enough provenance that differences observed months later can be explained instead of guessed at.
