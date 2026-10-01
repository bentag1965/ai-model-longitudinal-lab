# Observability and Service Signals

## Operational Goal

The lab should make failed or incomplete experiments obvious without silently corrupting longitudinal comparisons.

## Key Signals

| Signal | Why it matters |
|---|---|
| scheduled runs due vs completed | detects missing experiment execution |
| provider success rate | isolates provider/model reliability |
| provider latency | identifies degradation and timeout risk |
| token usage | tracks cost and output-shape changes |
| evaluator success rate | separates generation failures from scoring failures |
| evaluator agreement | detects scoring instability |
| run age | identifies stuck work |
| model identifier/version | preserves provenance |

## Suggested Service Objectives

These are example operational targets, not universal requirements.

- 99% of scheduled experiment runs begin within 10 minutes of intended time
- 99% of successful provider responses are persisted before downstream evaluation
- zero silent overwrites of historical observations
- 100% of failed runs retain a failure reason and provider/model context

## Alert Conditions

Useful alerts include:

- scheduled run overdue by more than 15 minutes
- provider error rate above 10% over a rolling window
- no successful runs from one provider while others remain healthy
- evaluator failures above baseline
- database persistence errors
- sudden model identifier change
