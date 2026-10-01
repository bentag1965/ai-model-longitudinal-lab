# Methodology

## Purpose

Longitudinal model testing is useful only when experiment conditions are recorded carefully enough to distinguish actual model behavior from changes in the test itself.

## Controls

For each run, preserve:

- exact prompt text
- provider
- model identifier
- system instructions, if any
- temperature or equivalent sampling controls
- token/output limits
- run timestamp
- repeat index
- software/configuration version where practical

## Within-Day Repeats

Short-interval repeats can reveal natural response variance even when the nominal model and prompt are unchanged.

An example pattern:

| Repeat | Offset |
|---|---:|
| R0 | 0 minutes |
| R1 | 5 minutes |
| R2 | 15 minutes |
| R3 | 30 minutes |

## Longitudinal Repeats

Selected seeds can also be rerun after longer intervals.

The system should store scheduled offsets as data rather than hard-coding them into execution logic.

## Evaluation

Where automated evaluators are used:

1. Keep evaluator identity and version stable when measuring longitudinal changes.
2. Record evaluator prompt/rubric versions.
3. Store raw evaluator output alongside parsed scores.
4. Avoid treating a single evaluator score as ground truth.
5. Separate descriptive measurements from interpretive conclusions.

## Interpretation

Observed differences can come from multiple sources:

- stochastic generation
- provider routing
- model updates
- safety-policy changes
- system prompt changes
- infrastructure changes
- evaluator variance
- experiment configuration changes

The design therefore emphasizes provenance rather than pretending every difference represents model drift.
