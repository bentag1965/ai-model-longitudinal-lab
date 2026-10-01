# Failure Modes and Recovery

## Philosophy

Failures should be classified because recovery depends on cause.

| Failure | Retry? | Typical response |
|---|---|---|
| validation error | No | reject and record |
| authentication failure | Usually no | alert/configuration review |
| rate limit | Yes | bounded backoff |
| transient network error | Yes | retry with jitter |
| provider 5xx | Yes | bounded retry |
| permanent provider rejection | No | terminal failure |
| database unavailable | Yes/Fail closed | preserve work where possible |
| duplicate event | No new work | return existing state |

## Recovery Principles

- never retry forever
- preserve enough evidence to explain terminal failure
- do not let one provider failure erase successful provider results
- prefer idempotent replay over manual data surgery
- surface dead-letter work for operator review
