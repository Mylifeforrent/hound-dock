# Frontend–backend boundary — integration contract

Status: Draft
Version: 0.1
As-of: 2026-10-20
Owner: Tech Lead scope (consolidates existing authorities by reference; authored under user direction, CHG-028)
Contract authority: [../05_api/api_interface_spec.md](../05_api/api_interface_spec.md) (Draft)
Ownership authority: root [AGENTS.md](../../AGENTS.md) §5 and §10
Change record: [../13_changes/CHG-028-architecture-supplements.md](../13_changes/CHG-028-architecture-supplements.md)
Companion documents: [06_frontend_architecture.md](06_frontend_architecture.md) · [07_backend_technical_design.md](07_backend_technical_design.md) · [architecture.md](architecture.md)

## 1. Purpose

One document that states what crosses the frontend/backend boundary and what never does. It consolidates by reference; it defines nothing new. Where this file and a cited authority appear to differ, the cited authority wins and the difference is registered, not resolved here (RULE-014).

## 2. The boundary is the HTTP contract

The only thing that crosses between `frontend/**` and `backend/**` is the JSON-over-HTTP surface of [api_interface_spec.md](../05_api/api_interface_spec.md): 15 operations, `API-001`–`API-015`, base path `/api`, no version segment, `GET` for queries and `POST` for commands, no `PUT`/`PATCH`/`DELETE`/`HEAD`. There is no shared code, shared type definition file, shared database, message bus, or file handoff between the two sides; nothing else couples them.

| API | Method and path | Page(s) |
|---|---|---|
| `API-001` | `POST /api/auth/sign-in` | PG-001 |
| `API-002` | `POST /api/conversations` | PG-002 |
| `API-003` | `GET /api/conversations` | PG-002 |
| `API-004` | `GET /api/conversations/{conversation_ref}` | PG-002 |
| `API-005` | `POST /api/conversations/{conversation_ref}/messages` | PG-002 |
| `API-006` | `POST /api/conversations/{conversation_ref}/messages/{position}/reply` | PG-002 |
| `API-007` | `GET /api/skills` | PG-003 |
| `API-008` | `GET /api/skills/{skill_name}` | PG-004 |
| `API-009` | `GET /api/mcp-servers` | PG-005 |
| `API-010` | `GET /api/mcp-servers/{server_name}` | PG-006 |
| `API-011` | `GET /api/tasks` | PG-007 |
| `API-012` | `GET /api/tasks/{task_name}` | PG-007–PG-008 |
| `API-013` | `POST /api/runs` | PG-008 |
| `API-014` | `GET /api/runs/{run_reference}` | PG-009 |
| `API-015` | `GET /api/runs/{run_reference}/steps` | PG-009 |

A denied matrix column has no endpoint on either side; the frontend renders the absence, and the backend serves nothing. Both sides derive their surface from the same catalog (§5 of the contract); neither invents an operation.

## 3. Who owns what

| Concern | Frontend (`frontend/**`) | Backend (`backend/**`) |
|---|---|---|
| Rendering the PG-001–PG-009 surface, No Permission panel for PG-010–012 | Owns | — |
| Authorization decisions, own-only scope, non-disclosure | Never; server denial is authoritative | Owns, server-side only |
| Session creation and termination semantics | Consumes the cookie; no token storage | Owns the cookie and store (`TBD-INFRA-013`) |
| Error presentation | Maps the envelope to the nine states | Owns the envelope and the codes |
| Identity/role/owner data | Never displays or infers | Never returns beyond the contract |
| Input validation UX | Convenience only (e.g. empty composer) | Authoritative (`40001/40002`) |
| Persistence | None | Owns all durable state |

Cross-boundary changes require an explicit handoff recorded in the change record (RULE-019); user-supplied work is exempt (RULE-021).

## 4. Session across the boundary

- Exactly one anonymous endpoint: `API-001`. Everything else requires the server-set `HttpOnly` cookie; the session token never appears in a body, URL, log, or JS-readable store on either side.
- `Authorization`, `X-Account-Id`, `X-Role`, and similar headers are ignored by the backend and are never sent by the frontend.
- An absent, ended, or invalid session is `40102`; the frontend responds by routing to PG-001. A rejected credential is `40101` with one generic message on both sides.
- A page reload invalidates the client's session knowledge only; the server session (in-process, restart-invalidating) is unaffected until the server restarts, after which every session is `40102`.

## 5. Error handling across the boundary

The single envelope `{"error":{"code","class","message","fields"?,"state"?,"outcome"?}}` is the entire error surface; the code table and HTTP mapping are owned by [api_interface_spec.md §8](../05_api/api_interface_spec.md) and summarized in AGENTS §5. Boundary rules that follow from it:

- The frontend decodes `code`/`class` only; it never parses or displays `message` beyond the contract's fixed strings, and never inspects anything outside the envelope.
- `40001/40002` may carry `fields` (names, never values) for inline validation display; no other class carries fields.
- `40301` (no grant) and `40401` (unknown, unrecorded, or non-owned) are presented without distinguishing attempts; the backend guarantees they are indistinguishable.
- `42901` is transport control, not a business class; the frontend treats it as a retryable-after-delay Error state.
- `50302` means "outcome unconfirmed": the frontend keeps the pending representation and reuses the same `Idempotency-Key` on the user's explicit retry; neither side retries blindly.
- Framework-level failures (5xx without the envelope, network loss) render the generic Error state; the frontend never invents a code.

## 6. Data that never crosses

Per api_interface_spec.md §12 and AGENTS §6, no response carries: account/owner/initiator/actor fields; credential, token, or secret values or references; tool names or step parameters; timestamps other than `duration_ms`; audit fields; message content outside the conversation the actor owns. Lists are `{items, count}` only — no paging, sorting, filtering, or query parameters in v0.1; `count` is the actor's visible count.

## 7. State mapping across the boundary

The nine UI states consume exactly the backend outcomes in architecture §8.4 (full mapping in [02_api_workflow_and_review.md §9](02_api_workflow_and_review.md)): a failed load never becomes Empty; `Initiated`/`Running` are never terminal; `Submitting` never fabricates success; No Result and No Permission are distinct client renderings of server answers, not client guesses.

## 8. Change discipline

- A contract change is a `CHG` that edits [api_interface_spec.md](../05_api/api_interface_spec.md) first; both sides then implement to the amended contract. The frontend and backend never negotiate a private deviation.
- The stack is settled at major-version level (`TBD-INFRA-001/002` Resolved); exact pins, tooling, and verified commands remain `TBD-INFRA-005/007` and are recorded in [../06_development/README.md](../06_development/README.md) as they are verified.
- Known unresolved divergence: Admin skill/task authoring and audit read are effective in the enterprise-internal baseline but absent from the contract and UI surface (AGENTS §1). Until registered and decided, neither side adds that surface.
