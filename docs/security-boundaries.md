# Security and Trust Boundaries

This reference architecture identifies places where production systems should enforce controls.

## Sensitive Assets

- API credentials and tokens
- experiment or workflow integrity
- audit history
- operational data
- external-service actions

## Boundaries

- inbound API or webhook boundary
- application-to-database boundary
- application-to-provider boundary
- human approval boundary where used
- edge-to-cloud boundary where used

## Defensive Controls

- authenticate inbound requests
- validate payload shape before processing
- use stable idempotency keys
- scope credentials to minimum required permissions
- keep secrets outside source control
- record meaningful state transitions
- use durable correlation IDs
- separate operator approval from automated execution when risk warrants it

## Scope

This document describes defensive architecture considerations. It does not claim the reference implementations are production-hardened.
