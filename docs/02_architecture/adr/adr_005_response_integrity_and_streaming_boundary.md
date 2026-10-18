# ADR-005 — Response integrity and a transport-neutral streaming boundary

Status: Draft
Decision status: Proposed architecture baseline
Date: 2026-10-18
Owner: Lead architecture agent for the Docs Agent
Refs: BR-002; FLOW-002; CAP-001; NFR-001; PRD FR-001; TBD-BIZ-011; TBD-INFRA-001; TBD-INFRA-002; TBD-INFRA-009
Supersedes: none

## Context

`BR-002` requires an active session and a non-empty message; an assistant message is appended only when a model response is returned; on failure no assistant message is appended and no partial or fabricated answer is presented as complete. The interaction design shows a pending assistant turn with "Assistant is responding", not streamed text, and says no invented text is rendered.

The PRD proposes streamed responses over SSE (`FR-001`) and a first-token target (`NFR-001`). The PRD is Draft and not accepted; `TBD-BIZ-011` covers the supporting-capability boundary, and the transport is a stack question (`TBD-INFRA-001/002`).

## Decision

1. A user message that passes validation is retained even when the model call fails. It is not rolled back to hide the failure.
2. Exactly one assistant message is appended when the model returns a successful response. A failure appends no assistant message.
3. A partial answer is never stored or presented as complete. The response boundary has an explicit success/failure result.
4. The response boundary is transport-neutral. The architecture does not require SSE, WebSocket, long polling, or a specific HTTP shape. A future streaming transport can be added without changing the success/failure contract.
5. Streaming is not an effective acceptance criterion. `NFR-001` is a proposed measurement point; it is not a committed threshold.
6. The model boundary is a port with an explicit egress gate. Until the data-boundary and gateway TBDs close, the gate is a named blocker, not an implicit allow.

## Consequences

### Positive

- Response integrity is testable independently of the transport.
- A future streaming UI can be added without reopening the persistence contract.
- Failure behavior is explicit and does not depend on how the client is connected.

### Cost and limits

- The MVP may show a pending assistant turn rather than incremental text; that matches the interaction design but may feel slower.
- `NFR-001`'s first-token target cannot be verified without a streaming transport and a confirmed measurement environment.
- A disconnected client does not cancel the accepted request; the result must remain readable. This is an assumption, not a confirmed cancel policy.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Persist a partial assistant message | Contradicts `BR-002` and makes a fabricated completion possible |
| Require SSE as the MVP transport | PRD-only; not an effective requirement, and the stack is undecided |
| Roll back the user message on failure | Hides the attempt and contradicts the interaction design's "message kept" rule |
| Treat the model response as a single opaque blob without a success/failure result | Cannot implement `BR-002` reliably |

## What this ADR does not decide

- Transport, framing, streaming protocol, or connection management.
- Model provider, gateway, or data residency (`TBD-INFRA-009`).
- Timeout values or retry policy.
- Whether search, citations, or tool calls ever appear in a response (`CAP-008`, `CAP-036` excluded).

## Revisit trigger

`TBD-BIZ-011` includes streaming in the MVP; `TBD-INFRA-001/002` select a stack/transport; `TBD-INFRA-009` closes the model gateway and data boundary.
