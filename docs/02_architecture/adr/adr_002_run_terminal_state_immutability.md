# ADR-002 — Run and run-step terminal states are immutable

Status: Draft
Decision status: Proposed architecture baseline
Date: 2026-10-18
Owner: Lead architecture agent for the Docs Agent
Refs: BR-005; BR-006; BR-008; STATE-001; STATE-002; FLOW-003; NFR-003; NFR-012; TBD-BIZ-007; CAP-006; CAP-014
Supersedes: none

## Context

`BR-005` requires one initiator and one recorded task version per run. `BR-006` permits only manual creation. `BR-008` requires a failed step to produce a failed, visible run; remaining steps are skipped; a failed run must not be reported as succeeded. `STATE-001` and `STATE-002` define the only effective lifecycle models: `Initiated → Running → Succeeded|Failed` and `Pending → Running → Succeeded|Failed`, with `Pending → Skipped`.

`TBD-BIZ-007` is open, so the step execution model, retry policy, branching, and code execution are not confirmed. The architecture still needs a stable run/outcome contract that a future executor can implement without rewriting the record.

## Decision

1. A run is created only by a manual, authenticated command and always carries one initiating account and one recorded task version.
2. `Initiated`, `Running`, `Succeeded`, and `Failed` are the only run states. `Succeeded` and `Failed` are terminal.
3. A run step is `Pending`, `Running`, `Succeeded`, `Failed`, or `Skipped`. The last three are terminal for that step.
4. A terminal run is never mutated into another terminal state. A failed run is not edited, retried in place, or hidden.
5. On a step failure, the failed step is recorded, remaining steps become `Skipped`, and the run becomes `Failed`.
6. There is no automatic retry, scheduler, webhook, event trigger, or resumable execution in the MVP. Compensation is a new run.
7. If a run is rejected before its first step, it is finalized as `Failed` with no step results. The distinction between "no run created" and "run created and then rejected" is preserved.
8. A future executor is a port. This ADR does not define its technology, concurrency model, queue, timeout, or retry policy.

## Consequences

### Positive

- The terminal outcome is auditable and testable against `BR-008`.
- A UI can render a stable outcome without guessing.
- A future executor can be added behind the port without redefining the record.

### Cost and limits

- An orphaned `Running` run after a process restart has no confirmed recovery rule. This ADR does not invent one; it records the gap.
- A duplicate submission has no confirmed deduplication rule. The command boundary reserves an idempotency extension point, but no dedup window is defined.
- Because `TBD-BIZ-007` is open, the step semantics remain a placeholder: the run and step records exist, but the executor's behavior is not an MVP commitment.
- The architecture cannot claim the `CAP-004` failure demonstration is end-to-end until an execution model and a recorded task are available.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Mutable run with retry in place | Contradicts `BR-008` and the terminal-state model |
| Automatic retry of transient failures | `CAND-010` proposes it, but it is not effective and `TBD-BIZ-007` is open |
| Resume from a checkpoint | No effective resumable workflow; HITL/checkpoint semantics are not introduced |
| A queue/scheduler that creates runs | Violates `BR-006` manual-only initiation |
| Delete or overwrite a failed run | Hides the failure and breaks the visible-outcome rule |

## What this ADR does not decide

- What a step executes, how it executes, or whether it can branch (`TBD-BIZ-007`).
- Timeout values or retry counts.
- The run/step persistence schema, table, or store.
- How an orphaned `Running` run is recovered.
- Whether a future approval step exists (`CAP-014` is excluded).

## Revisit trigger

`TBD-BIZ-007` resolves; `CAP-006` or `CAP-014` becomes effective; a recovery or idempotency decision is registered.
