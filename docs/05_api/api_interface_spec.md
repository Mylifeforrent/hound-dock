# API Interface Specification — hound-dock

Status: Draft
Version: 0.1
As-of: 2026-10-18
Owner: Docs Agent (API contract scope for `docs/05_api/**`); change record filed under the recorded Tech Lead handoff for `docs/13_changes/**`
Change record: `docs/13_changes/CHG-013-api-interface-contract.md`
Contract owner: `docs/05_api/` — this document owns endpoints, paths, methods, status codes, request/response schemas, versioning notation, and the error payload shape. `docs/02_architecture/02_api_workflow_and_review.md` remains the authority for interface principles and error classes.
Framework status: framework-neutral. FastAPI is **not confirmed** (`TBD-INFRA-002` is Open). Pydantic appears only in the conditional, non-normative §13.
PRD acceptance: not claimed (`TBD-BIZ-012` is Open). This contract is `Draft`, not `Reviewed`, not `Frozen`, and authorizes no implementation.

## 1. Purpose, scope, and non-goals

### 1.1 Purpose

This document is the API contract for the confirmed interaction surface derived from inputs 1 and 2. It turns the principle-level surfaces of `docs/02_architecture/02_api_workflow_and_review.md` §5 and the must-call actions of `docs/03_design/interaction_design.md` §2.2 into resource paths, methods, schemas, error codes, auth markings, idempotency rules, list conventions, and rate-limit markings.

It is a contract, not an architecture document, a data-model document, a UI specification, or an implementation. It does not select a framework, transport runtime, store, gateway, auth library, or deployment model.

### 1.2 In scope

- The 15 effective API operations derived only from inputs 1–2 (§5).
- Per-endpoint method, path, purpose, source, auth, matrix cell, request schema, response schema, errors, idempotency, and rate-limit marking.
- The seven architecture error classes `ERR-01` to `ERR-07`, expressed as globally unique contract codes in segmented numeric ranges (§8).
- Session carriage, default-deny authorization, own-only query scoping, and non-disclosure (§4).
- Idempotency keys and duplicate-submission semantics (§9).
- Pagination, sorting, and filtering disposition (§10).
- Proposed rate limits for sign-in and sensitive writes (§11).
- Classification-aware field projection and redaction (§12).
- Traceability, self-check, and the closing conflicts-and-gaps register (§15).

### 1.3 Non-goals

- No implementation, scaffold, dependency manifest, lockfile, tool configuration, migration, or application code.
- No framework, language, store, gateway, hosting, or transport-runtime selection. `TBD-INFRA-002` and `TBD-INFRA-003` remain referenced, not decided here (the baseline records PostgreSQL as selected for the store; this contract does not bind to it).
- No new business capability, role, verb, role hierarchy, per-object grant, state, entity, or persisted field. Contract-only projection fields (`items`, `count`, `session_state`, `reply_status`, `assistant_position`) are derived and persist nothing. No new `TBD` or `CONFLICT` is created.
- No answer to a `TBD` or resolution of a `CONFLICT`. Every unconfirmed value is labelled.
- No UI layout or copy decision. Page states and interaction copy remain in `docs/03_design/`.
- No authoring, audit, all-runs, MCP registration/invocation, artifact, account, search, streaming, or paging capability. Each is either a denied matrix cell or an unsourced operation; see §5.3 and §15.

### 1.4 Status and authorization

This contract is `Draft`. It does not authorize backend implementation, a stack decision, a database schema, a deployment, or a model call. It is `Draft` until the independent Verifier review and the Tech Lead acceptance recorded against `CHG-013`. `TBD-INFRA-002` remains Open, so the HTTP binding below is a contract notation, not a framework commitment.

## 2. Input provenance and precedence

### 2.1 Authoritative inputs, highest first

| Order | Input | Version and status | Sections used | Role in this contract | Tag |
|---|---|---|---|---|---|
| 1 | `docs/02_architecture/02_api_workflow_and_review.md` | v0.1, `Draft` | §2, §3, §4, §5, §6, §7, §8, §9, §10, §11 | Interface boundary, command/query split, enforcement points, effective surfaces, seven error classes, workflow sequencing, duplicate/disclosure rules, contract deferrals | `[SRC: 02 §2–§11]` |
| 2 | `docs/03_design/interaction_design.md` §2 | v0.1, `Draft` | §2.2, plus §3.4, §4.1–§4.3, §5, §6 | Exhaustive page/action → matrix table; must-call operations; validation, feedback, duplicate, permission, copy, and state constraints | `[SRC: IXD §2.2]` |
| 3 | `docs/02_architecture/architecture.md` and `docs/02_architecture/05_enterprise_internal_baseline.md` | v0.1, `Draft` | ARCH §6, §8; baseline §2–§5 | Module boundaries, sync/async classes, command/query behavior, and the audit-boundary context. The baseline is read as a conflict source, not as an API source (§15, CF-01) | `[SRC: ARCH §8; BASE §3–§5]` |
| 4 | `docs/04_data/data_model_spec.md` | v0.2, `Draft` | §4, §5.5, §7, §8, Appendix A | Logical field names, types, keys, state vocabularies, classification, and page-field disposition. Baseline-only fields are trimmed from projections (§15, CF-02) | `[SRC: DATA §4, §7]` |
| 5 | `docs/01_product/business_model.md` §6.2 | v0.3 with Appendix B, `Draft` | §6.2, §6.2.1; Appendix B.3 | The permission matrix is the single policy source (ADR-001). This contract uses the §6.2 ROLE-001 cells and records the Appendix B.3 Admin extension as a conflict, not as an API source (§15, CF-01) | `[SRC: BM §6.2; ADR-001]` |
| — | `docs/00_setup/open_items.md` | `Draft` | Registry entries referenced by ID | `TBD`/`CONFLICT` resolution state and role/scope context. No entry is redefined | `[SRC: OI]` |

### 2.2 Classification of statements

| Tag | Meaning |
|---|---|
| `[SRC: ...]` | Stated or entailed by an input above; the section is named. |
| `[CONTRACT]` | A contract decision owned by `docs/05_api/` (path shape, status code, envelope, idempotency header, fixed order, redaction). It creates no business rule and answers no `TBD`. |
| `[DERIVED: ...]` | A conclusion entailed by two or more sourced statements; no new business rule. |
| `[TBD-...]` / `[CONFLICT-...]` | A reference to the registry. Never a value, never a resolution. |
| `[PROPOSED: TBD-BIZ-008]` | A proposed numeric value or timing that is not confirmed. |

### 2.3 Authority notes and known divergence

Inputs 1 and 2 predate the enterprise-internal baseline. `docs/05_api/README.md` says the API contract owns endpoints, schemas, versioning, error model, and auth expectations; input 1 says `docs/05_api/` owns every one of them. Where input 1 and input 2 describe only the pre-baseline effective surface, this contract follows them rather than the later baseline. The baseline divergence is not hidden; it is the first conflict in §15 (CF-01). This contract does not adjudicate it.

## 3. Contract conventions

### 3.1 Base path, versioning, and methods

| Item | Contract value | Basis |
|---|---|---|
| Base path | `/api` | `[CONTRACT]`; a stable path prefix, not a deployment or framework claim |
| Version segment | None | `[SRC: 02 §2.6]`; versioning is deferred. No compatibility promise is made by this `Draft` |
| Methods | `GET` for queries; `POST` for commands | `[SRC: 02 §2.1; IXD §2.2]`; effect-based, not wire-based |
| Other methods | No `PUT`, `PATCH`, `DELETE`, or `HEAD` operation is defined | `[DERIVED: 02 §2.1, §5; no update/delete is confirmed]` |
| Trailing slash | Not significant to the contract; a transport redirect is not a business outcome | `[CONTRACT]` |
| Path parameters | Snake case, exact-match, case-sensitive, URL-encoded once | `[CONTRACT]`; business keys, not storage identifiers |
| Query parameters | None are defined in this version | `[SRC: 02 §4.4, §11; IXD §3.4]`; see §10 |

No version segment is invented because `docs/05_api/README.md` leaves versioning to this folder and input 1 §2.6 records it as deferred. A future versioning policy is a contract change, not a silent addition.

### 3.2 Media types, headers, and body rules

| Header | Direction | Required | Applies to | Contract rule |
|---|---|---|---|---|
| `Content-Type: application/json` | Request | Yes when a body is present | All `POST` | UTF-8 JSON only. A different media type is `40002` (`ERR-01`). No form, multipart, or file body exists |
| `Accept: application/json` | Request | No | All | The response is always JSON; content negotiation beyond JSON is not defined |
| `Cookie` | Request | Yes | All authenticated endpoints | Carries the server-set opaque session cookie. The actor is bound by the session (`SYS-001`); the cookie is never accepted as an identity claim by itself |
| `Set-Cookie` | Response | On successful sign-in | `API-001` | Sets the opaque session cookie. The cookie value is never returned in a body, URL, or log. Name and flags are security design, not fixed here |
| `Idempotency-Key` | Request | On `API-002`, `API-005`, `API-006`, `API-013` | Commands with a persisted effect | Opaque 1–128 printable ASCII characters; a UUID is recommended. Scope and replay semantics are in §9 |
| `Location` | Response | On `201` | `API-002`, `API-005`, `API-013` | The path of the created resource; for `API-005`, the conversation containing the accepted message |
| `Retry-After` | Response | On `429` | Rate-limited requests | Whole seconds, `>= 0`. On `503`, proposed only; no timing is confirmed (`TBD-BIZ-008`) |
| `Cache-Control` | Response | Proposed | Responses carrying `Sensitive` content | `no-store` is proposed; the final cache policy is a security decision (`TBD-INFRA-004`) |

No `Authorization` header is defined. A caller-supplied `Authorization`, `X-Account-Id`, `X-Role`, `X-Owner-Id`, or similar header is ignored and never grants access; no such interface exists in this design `[SRC: 02 §2.2]`.

Request bodies use only the fields declared by the endpoint request schema (§6.8 and §7). An unknown request field is rejected with `40002` `[CONTRACT]`. Response consumers MUST ignore unknown response fields; the server does not remove a field silently within a `Draft` contract `[CONTRACT]`.

### 3.3 Identifiers, references, and nullability

- A **business reference** is the entity's business key, not a storage identifier: `conversation_ref`, `skill_name`, `server_name`, `task_name`, `run_reference`, and the composite `(conversation_ref, position)` for a message `[SRC: BM §5.1; 02 §2.1]`.
- No storage identifier (`account_id`, `message_id`, `skill_id`, `skill_version_id`, `mcp_server_id`, `task_definition_id`, `task_version_id`, `run_id`, `run_step_id`) is exposed in a request or response `[CONTRACT; SRC: 02 §2.2]`.
- No account, owner, or initiator reference is exposed. `Account.read` is `denied`; owner attribution is PII and is omitted from every projection `[SRC: 02 §2.4, §3.4; BM §6.2; DATA §7.2]`.
- A response field that is not applicable is present with `null`; it is not omitted. This keeps the response shape stable. Error-envelope optional members are the exception: they are omitted when not applicable `[CONTRACT]`.
- A required request field MUST NOT be `null`. A `null` is treated as missing (`40001`) or invalid (`40002`) `[CONTRACT]`.
- Business keys used in paths are assumed path-safe. No naming, length, character, or case rule is confirmed by the sources; a key containing `/` or an equivalent delimiter has no defined escaping. This is a gap, not a silent normalization rule (§15, G-10).

### 3.4 Time, ordering, and freshness

- This contract returns no timestamp in v0.1. The only temporal value returned is `duration_ms`, an elapsed integer. Timestamps exist in the data model but are not required by any effective page; omitting them is a minimization choice `[CONTRACT; SRC: DATA §7.2]`.
- No freshness token, ETag, `updated_at`, or version token is returned. A read reports the persisted state at read time; a stale-read failure is `ERR-06`, not a guessed state `[SRC: 02 §10]`.
- Fixed list orders are defined in §10.2. No client-controlled sort exists.

### 3.5 HTTP status usage

| Status | Meaning in this contract | Codes used |
|---|---|---|
| `200 OK` | A query succeeded; a sign-in succeeded; an idempotent reply replay found a completed assistant turn | `—` |
| `201 Created` | A command created exactly one aggregate or accepted one message; a reference/position is returned | `—` |
| `202 Accepted` | A reply request was accepted and is pending; no assistant turn is confirmed yet | `—` |
| `400 Bad Request` | Input or framing rejected before any state change | `40001`, `40002` |
| `401 Unauthorized` | Credential rejected or session absent/inactive | `40101`, `40102` |
| `403 Forbidden` | No effective grant for a known resource class | `40301` |
| `404 Not Found` | A business reference does not resolve, is unrecorded, or is not owned; non-disclosing | `40401` |
| `409 Conflict` | Duplicate submission or persisted-state conflict | `40901`, `40902` |
| `429 Too Many Requests` | Transport control; no business outcome | `42901` |
| `500 Internal Server Error` | Unexpected condition | `50001` |
| `503 Service Unavailable` | Dependency unavailable or outcome unconfirmed | `50301`, `50302` |

No `204`, `3xx`, or `422` appears in this contract. In particular, a framework's default validation status (`422` in some frameworks) is **not** adopted; validation is `400` with the §8.3 envelope. This keeps the contract framework-neutral `[CONTRACT; TBD-INFRA-002]`. A transport may return `404` or `405` for a method/path that is not in this contract; neither is a business outcome and neither changes state.

## 4. Authentication, session, and authorization

### 4.1 Session carriage

- Sign-in is the only anonymous operation. It verifies a local credential and creates a session bound to one account (`SYS-001`, `BR-001`) `[SRC: 02 §3.3, §5]`.
- The session reference is conveyed as a server-set, `HttpOnly` session cookie. It is **not** returned in the response body, URL, or log. This satisfies the prohibition on returning tokens and preserves the session-bound actor rule `[CONTRACT; SRC: 02 §2.2, §5]`.
- Cookie name, flags, lifetime, refresh, revocation, CSRF protection, and sign-out are security design. They are not fixed here. `docs/08_security/` and `TBD-INFRA-004` remain the owners `[SRC: 02 §11; OI]`.
- An absent, ended, or invalid session yields `40102` for every authenticated endpoint. No partial page and no partial write is implied `[SRC: 02 §6.1; IXD §5.5]`.
- A rejected sign-in credential yields `40101` with one generic message. The contract does not distinguish an unknown account from a wrong credential `[SRC: 02 §6.1, §6.2; IXD §5.7]`.

### 4.2 Default deny

Every action is denied unless the effective matrix or a confirmed system condition grants it `[SRC: BM §6; 02 §2.5]`. Consequences:

1. A matrix column that is `denied` for every role has **no endpoint**. The denial is structural, not a disabled control or a runtime “not implemented” answer.
2. A role that has no grant for a resource class receives `40301`, not an empty list and not a partial page `[SRC: 02 §2.5; IXD §2.1]`.
3. An own-only resource that is not owned by the actor receives `40401`, identical to an unknown reference `[SRC: 02 §2.3, §6.2; IXD §3.4]`.
4. A client-visible control is convenience, not authority. If a stale page renders an action the server now denies, the server's denial wins `[SRC: 02 §2.2; IXD §2.3 item 5]`.
5. No caller-supplied identity, owner, role, or permission flag is trusted. The actor is the account bound to the session `[SRC: 02 §2.2]`.

### 4.3 Effective role for this contract

This contract's effective authorization is the ROLE-001 Member row of `business_model.md` §6.2. ROLE-002, ROLE-003, and ROLE-004 are `denied` in every column under §6.2 and under input 1 §3.2; a session bound to one receives `40301` on every authenticated endpoint. Sign-in remains available to a person with a local account because it is a person-level act under BR-001, not a role-checked matrix cell `[SRC: IXD §2.2 note; 02 §5]`.

This is deliberately narrower than `business_model.md` Appendix B.3, which makes ROLE-002 Admin effective for skill/task publication and audit read, and additively holds Member. The divergence is recorded in §15 (CF-01) and is not resolved here.

### 4.4 Own-only query scoping and non-disclosure

- `API-002` sets the owner from the session actor; it accepts no owner identifier. For `API-003` to `API-006`, the query is scoped by `owner_account_id = session actor`. For `API-014` and `API-015`, it is scoped by `initiator_account_id = session actor`; messages and steps are scoped through their parent `[SRC: 02 §2.4; BM §6.2]`.
- The scope is part of the query, not a post-fetch filter. An out-of-scope row is never returned to the application layer for filtering `[SRC: 02 §3.1]`.
- For a read, or a command against an existing object, if the scoped query returns no row, the response is `40401`. The server does not run a second “does it exist?” query and does not distinguish unknown from non-owned. The error body does not echo the reference, title, owner, state, count, or partial content `[SRC: 02 §2.3, §6.2; IXD §3.4, §5.5]`.
- `API-015` validates run ownership in the same scoped read; a non-owned run yields `40401`, never an empty step list `[DERIVED: 02 §2.4; IXD §3.4]`.
- A list response's `count` is the count of the actor's visible rows only. It is never a global count `[SRC: 02 §3.4; CONTRACT]`.

### 4.5 Matrix column to endpoint

| API | Matrix column(s) | ROLE-001 cell | Enforcement point | Endpoint note |
|---|---|---|---|---|
| `API-001` | None — person-level `BR-001` | `allowed` (local account; `PG-001`) | `SYS-001` system check | Anonymous; creates a session; no account is created |
| `API-002` | `Conversation.chat` | `own-only` | Application service | The owner is bound from the session |
| `API-003` | `Conversation.read` | `own-only` | Query filter | Actor-scoped list |
| `API-004` | `Conversation.read`, `Message.read` | `own-only` | Query filter | Messages are scoped through the conversation owner |
| `API-005` | `Conversation.chat` | `own-only` | Application service | Non-owned conversation is `40401` |
| `API-006` | `Conversation.chat`; `SYS-002` system action | `own-only` | Application service + system action | The reply is scoped by the accepted message |
| `API-007` | `Skill.read` | `read-only` | Query filter | Grant only; no owner scope |
| `API-008` | `Skill.read` | `read-only` | Query filter | Unrecorded name is `40401` |
| `API-009` | `McpServer.read` | `read-only` | Query filter | Grant only; no credential value |
| `API-010` | `McpServer.read` | `read-only` | Query filter | Unrecorded name is `40401`; no tool names |
| `API-011` | `TaskDefinition.read` | `read-only` | Query filter | Grant only; no owner |
| `API-012` | `TaskDefinition.read` | `read-only` | Query filter | Unrecorded name is `40401` |
| `API-013` | `Run.initiate` | `allowed` | Application service + `SYS-004` system check | Manual only; active session, recorded task, valid inputs |
| `API-014` | `Run.read` | `own-only` | Query filter | Non-owned is `40401` |
| `API-015` | `RunStep.read` | `own-only` | Query filter | Scoped through the run's initiator |
| — | `Account.read`, `Account.manage`, `Skill.publish`, `McpServer.register`, `McpTool.allowlist`, `McpTool.invoke`, `TaskDefinition.publish`, `Artifact.read`, `Audit.read` | `denied` | No endpoint | Denied by absence; see §5.3 |

The `read-only` cell is not public: it still requires an authenticated session and the grant. The `own-only` cell is not “allow then hide”: the filter is in the query `[SRC: 02 §2.4, §2.5]`.

## 5. API catalog

### 5.1 Endpoint summary

All paths are relative to the base path `/api`. `IF-01`/`IF-02`/`IF-03`/`IF-04` are the interaction classes from input 1 §4.

| API | Method and path | Purpose | Class | Auth | Matrix cell | Source |
|---|---|---|---|---|---|---|
| `API-001` | `POST /api/auth/sign-in` | Verify a local credential, create a session bound to the account | `IF-01` | Anonymous | `allowed` (local account; `PG-001`) | `[SRC: 02 §5 Sign-in; IXD §2.2 PG-001; FLOW-001 N1–N2]` |
| `API-002` | `POST /api/conversations` | Create one conversation owned by the actor, with no messages | `IF-01` | Authenticated, ROLE-001 | `Conversation.chat = own-only` | `[SRC: 02 §5 Create conversation; IXD §2.2 PG-002; IXD §4.2 N1]` |
| `API-003` | `GET /api/conversations` | List the actor's own conversations | `IF-04` | Authenticated, ROLE-001 | `Conversation.read = own-only` | `[SRC: 02 §5 List own conversations; IXD §2.2 PG-002]` |
| `API-004` | `GET /api/conversations/{conversation_ref}` | Read one own conversation and its messages in append order | `IF-04` | Authenticated, ROLE-001 | `Conversation.read`, `Message.read = own-only` | `[SRC: 02 §5 Get own conversation; IXD §2.2 PG-002; IXD §3.4]` |
| `API-005` | `POST /api/conversations/{conversation_ref}/messages` | Append one non-empty user message and return its position | `IF-01` | Authenticated, ROLE-001 | `Conversation.chat = own-only` | `[SRC: 02 §5 Append user message; IXD §2.2 PG-002 Send; FLOW-002 N2]` |
| `API-006` | `POST /api/conversations/{conversation_ref}/messages/{position}/reply` | Request one assistant reply for the accepted user message | `IF-02` | Authenticated, ROLE-001; `SYS-002` acts | `Conversation.chat = own-only`; `SYS-002` system action | `[SRC: 02 §5 Request assistant reply; IXD §4.2 N3; 02 §8]` |
| `API-007` | `GET /api/skills` | List recorded skills | `IF-04` | Authenticated, ROLE-001 | `Skill.read = read-only` | `[SRC: 02 §5 List skills; IXD §2.2 PG-003]` |
| `API-008` | `GET /api/skills/{skill_name}` | Read one recorded skill | `IF-04` | Authenticated, ROLE-001 | `Skill.read = read-only` | `[SRC: 02 §5 Get skill record; IXD §2.2 PG-004]` |
| `API-009` | `GET /api/mcp-servers` | List recorded MCP servers and recorded health | `IF-04` | Authenticated, ROLE-001 | `McpServer.read = read-only` | `[SRC: 02 §5 List MCP servers; IXD §2.2 PG-005]` |
| `API-010` | `GET /api/mcp-servers/{server_name}` | Read one recorded MCP server record | `IF-04` | Authenticated, ROLE-001 | `McpServer.read = read-only` | `[SRC: 02 §5 Get MCP server record; IXD §2.2 PG-006]` |
| `API-011` | `GET /api/tasks` | List recorded task definitions | `IF-04` | Authenticated, ROLE-001 | `TaskDefinition.read = read-only` | `[SRC: 02 §5 List task definitions; IXD §2.2 PG-007]` |
| `API-012` | `GET /api/tasks/{task_name}` | Read one recorded task, its declared inputs, and order composition | `IF-04` | Authenticated, ROLE-001 | `TaskDefinition.read = read-only` | `[SRC: 02 §5 Get task definition and declared inputs; IXD §2.2 PG-007–PG-008]` |
| `API-013` | `POST /api/runs` | Start one manual run of a recorded task with declared inputs | `IF-01` + `IF-03` | Authenticated, ROLE-001 | `Run.initiate = allowed`; `SYS-004` check | `[SRC: 02 §5 Start manual run; IXD §2.2 PG-008; FLOW-003 N2–N3]` |
| `API-014` | `GET /api/runs/{run_reference}` | Read one own run's persisted state | `IF-04` | Authenticated, ROLE-001 | `Run.read = own-only` | `[SRC: 02 §5 Get own run; IXD §2.2 PG-009]` |
| `API-015` | `GET /api/runs/{run_reference}/steps` | List one own run's steps, including failed and skipped rows | `IF-04` | Authenticated, ROLE-001 | `RunStep.read = own-only` | `[SRC: 02 §5 List own run steps; IXD §2.2 PG-009]` |

### 5.2 Must-call action to API mapping

This table covers every row of `interaction_design.md` §2.2 and the “New chat” action in FLOW-002 N1. A denied row has no endpoint by design; it is not a missing mapping.

| # | Page or action | Matrix cell | Must call | API | Note |
|---|---|---|---|---|---|
| 1 | `PG-001` Local sign-in | `allowed` (local account) | Yes | `API-001` | Person-level `BR-001`; anonymous |
| 2 | `PG-002` Conversation list | `own-only` | Yes | `API-003` | Actor-scoped; no global count |
| 3 | `PG-002` Open own conversation | `own-only` | Yes | `API-004` | Unknown and non-owned are identical |
| 4 | `PG-002` New chat (create conversation) | `own-only` | Yes | `API-002` | FLOW-002 N1; a new conversation has no messages |
| 5 | `PG-002` Send a message | `own-only` | Yes | `API-005` then `API-006` | Acceptance and reply completion are independently confirmable |
| 6 | `PG-003`, `PG-004` Skill read | `read-only` | Yes | `API-007`, `API-008` | No owner; no dependency list |
| 7 | `PG-003` Skill create, edit, publish, deprecate | `denied` | No | — | No endpoint; `TBD-BIZ-004` referenced. Baseline divergence CF-01 |
| 8 | `PG-005`, `PG-006` MCP server read | `read-only` | Yes | `API-009`, `API-010` | No credential value; no tool names |
| 9 | `PG-005` MCP register, test, allowlist, retire | `denied` | No | — | No endpoint; `TBD-BIZ-004` referenced |
| 10 | `PG-006` MCP tool invoke | `denied` | No | — | No endpoint; `TBD-BIZ-007` referenced |
| 11 | `PG-007`, `PG-008` Task definition read | `read-only` | Yes | `API-011`, `API-012` | Declared inputs and composition; no owner |
| 12 | `PG-008` Initiate a manual run | `allowed` | Yes | `API-013` | `Run.initiate`; `SYS-004` preconditions |
| 13 | `PG-009` Own run outcome | `own-only` | Yes | `API-014` | Non-owned is `40401` |
| 14 | `PG-009` Own run steps | `own-only` | Yes | `API-015` | Failed and skipped rows are visible to the initiator |
| 15 | `PG-009` Another account's run outcome | `denied` | No | — | `API-014`/`API-015` return `40401` to the non-owner; no separate API |
| 16 | `PG-010` Skill authoring and publication | `denied` | No | — | No endpoint; baseline divergence CF-01 |
| 17 | `PG-011` MCP registration and allowlisting | `denied` | No | — | No endpoint |
| 18 | `PG-012` Task authoring and publication | `denied` | No | — | No endpoint; baseline divergence CF-01 |
| 19 | Run artifact read or download | `denied` | No | — | No endpoint; `TBD-BIZ-003` referenced |
| 20 | Audit read or export | `denied` | No | — | No endpoint; baseline divergence CF-01; `TBD-BIZ-009` referenced |
| 21 | Account read or manage | `denied` | No | — | No endpoint; `Account.read` and `Account.manage` are `denied` |

### 5.3 Denied columns with no endpoint

The following columns are `denied` for every role in input 1 §3.2 and input 2 §2.2, so no command or query exists: `Account.read`, `Account.manage`, `Skill.publish`, `McpServer.register`, `McpTool.allowlist`, `McpTool.invoke`, `TaskDefinition.publish`, `Artifact.read`, `Audit.read` `[SRC: 02 §3.2; BM §6.2]`. A request to a non-existent path or a non-listed method MUST NOT change state. A disabled control is not used in the UI; absence is the denial `[SRC: IXD §5.5]`.

## 6. Shared schema components

### 6.1 Type notation

| Type | Contract meaning |
|---|---|
| `string` | UTF-8 string. No maximum length is imposed unless a constraint says so. |
| `integer` | JSON integer; no fractional part. |
| `boolean` | `true` or `false`. |
| `object` | JSON object. An opaque object is used only where the sources leave the shape open. |
| `array<T>` | JSON array of `T`. |
| `enum<...>` | One of the listed exact, case-sensitive strings. |
| `nullable` | The value may be `null`. A required nullable field is present with `null`; it is not omitted. |

No numeric range, string length, pattern, or unit is invented where the sources do not state one `[SRC: IXD §5.1 cross-form rule 1]`.

### 6.2 List envelope

Every list response uses:

| Field | Type | Required | Nullable | Constraints | Classification | Notes |
|---|---|---|---|---|---|---|
| `items` | `array<T>` | Yes | No | Ordered per §10.2; may be empty | `Internal` | The complete visible set; no paging in v0.1 |
| `count` | `integer` | Yes | No | `>= 0`; equals `items.length` | `Internal` | The actor's visible count only; never a hidden global count |

No `next_cursor`, `has_more`, `limit`, `offset`, or `total` field exists. See §10.4 for the reserved, not-enabled extension point.

### 6.3 Conversation and message components

**`ConversationSummary`**

| Field | Type | Required | Nullable | Constraints | Classification | Source |
|---|---|---|---|---|---|---|
| `conversation_ref` | `string` | Yes | No | Non-empty; unique within the owner; no owner field is exposed | `Sensitive` | `[SRC: DATA §4.3; IXD §3.4]` |

**`ConversationRecord`**

| Field | Type | Required | Nullable | Constraints | Classification | Source |
|---|---|---|---|---|---|---|
| `conversation_ref` | `string` | Yes | No | As above | `Sensitive` | `[SRC: DATA §4.3]` |
| `messages` | `array<MessageRecord>` | Yes | No | Ordered by `position` ascending; may be empty for a new conversation | `Internal` (container); elements carry their own classification | `[SRC: IXD §4.2 N1; DATA §4.4]` |

**`MessageRecord`**

| Field | Type | Required | Nullable | Constraints | Classification | Source |
|---|---|---|---|---|---|---|
| `position` | `integer` | Yes | No | `>= 1`; unique within the conversation; the business-key component | `Internal` | `[SRC: BM §5.1 ENT-004; DATA §4.4]` |
| `author_kind` | `enum<member, assistant>` | Yes | No | `member` is the person; `assistant` is the model reply | `Internal` | `[SRC: DATA §4.4]` |
| `content_text` | `string` | Yes | No | Non-empty; no maximum is confirmed | `Sensitive` | `[SRC: DATA §4.4]` |

No `message_id`, `created_at`, `author_account_id`, citation, tool receipt, pending flag, token text, or edit/delete field is returned `[SRC: DATA §4.4; 02 §8]`. A pending reply is not a durable message and is never returned as one `[SRC: 02 §8.4]`.

### 6.4 Skill components

**`SkillSummary`**

| Field | Type | Required | Nullable | Constraints | Classification | Source |
|---|---|---|---|---|---|---|
| `skill_name` | `string` | Yes | No | Non-empty business key; exact match | `Sensitive` | `[SRC: DATA §4.5; BM §5.1 ENT-006]` |
| `description` | `string` | Yes | Yes | No length rule is confirmed; `null` means not provided | `Sensitive` | `[SRC: DATA §4.5; IXD §6.4]` |
| `version_label` | `string` | Yes | Yes | Present only where the record carries one; marked proposed metadata in the UI | `Sensitive` | `[SRC: DATA §4.6; IXD §3.2 PG-004]` |

**`SkillRecord`**

| Field | Type | Required | Nullable | Constraints | Classification | Source |
|---|---|---|---|---|---|---|
| `skill_name` | `string` | Yes | No | As above | `Sensitive` | `[SRC: DATA §4.5]` |
| `description` | `string` | Yes | Yes | As above | `Sensitive` | `[SRC: DATA §4.5]` |
| `version_label` | `string` | Yes | Yes | As above | `Sensitive` | `[SRC: DATA §4.6]` |
| `instructions` | `string` | Yes | No | Non-empty recorded instruction text; no length rule is confirmed | `Sensitive` | `[SRC: DATA §4.6; IXD §6.5]` |
| `input_definition` | `object` | Yes | Yes | Opaque document; `null` means the record declares none. The shape is not defined by this contract | `Sensitive` | `[SRC: DATA §4.6; TBD-BIZ-007]` |

No `skill_id`, `skill_version_id`, `owner_account_id`, `registry_state`, `version_state`, `declared_tool_dependencies`, lifecycle badge, or dependency list is returned `[SRC: 02 §5; IXD §2.3 item 2, §3.2 PG-004; DATA §4.5–§4.6]`. The dependency list is withheld because the `McpTool.read` question is unresolved and PG-004 does not render it `[SRC: IXD §2.4; 02 §13.2 BGAP-05]`.

### 6.5 MCP server components

**`McpServerSummary`**

| Field | Type | Required | Nullable | Constraints | Classification | Source |
|---|---|---|---|---|---|---|
| `server_name` | `string` | Yes | No | Non-empty business key; exact match | `Sensitive` | `[SRC: DATA §4.7; BM §5.1 ENT-008]` |
| `recorded_health` | `enum<registered, connected, needs_authentication, error, retired>` | Yes | No | The recorded value; no health transition control exists | `Internal` | `[SRC: DATA §4.7, §5.5]` |

**`McpServerRecord`**

| Field | Type | Required | Nullable | Constraints | Classification | Source |
|---|---|---|---|---|---|---|
| `server_name` | `string` | Yes | No | As above | `Sensitive` | `[SRC: DATA §4.7]` |
| `recorded_health` | `enum<registered, connected, needs_authentication, error, retired>` | Yes | No | As above | `Internal` | `[SRC: DATA §4.7]` |
| `endpoint_reference` | `string` | Yes | No | The recorded internal endpoint reference. It MUST be credential-free: no userinfo, query-string token, or secret. If the stored value cannot be projected safely, the read fails with `50301` rather than returning a secret | `Sensitive` | `[SRC: DATA §4.7; IXD §3.2 PG-006]` |

No `mcp_server_id`, credential value, credential reference, secret reference, connection type, timeout, tool count, tool name, allowlist flag, or test/invoke action is returned `[SRC: 02 §5; IXD §3.2 PG-005–PG-006; DATA §4.7]`. The connection type, timeout, credential-reference indicator, and tool-reference count shown by the interaction design are not persisted fields in the data model; they are gaps (§15, CF-04), not contract fields.

### 6.6 Task components

**`TaskSummary`**

| Field | Type | Required | Nullable | Constraints | Classification | Source |
|---|---|---|---|---|---|---|
| `task_name` | `string` | Yes | No | Non-empty business key; exact match | `Sensitive` | `[SRC: DATA §4.8; BM §5.1 ENT-011]` |
| `description` | `string` | Yes | Yes | No length rule is confirmed | `Sensitive` | `[SRC: DATA §4.8]` |
| `version_label` | `string` | Yes | Yes | The recorded version label; `null` only if the record carries none | `Sensitive` | `[SRC: DATA §4.9; IXD §3.2 PG-007]` |
| `step_count` | `integer` | Yes | No | `>= 1` for a recorded task version; derived from the ordered steps | `Internal` | `[SRC: DATA §4.9–§4.10; IXD §3.2 PG-007]` |

**`TaskRecord`**

| Field | Type | Required | Nullable | Constraints | Classification | Source |
|---|---|---|---|---|---|---|
| `task_name` | `string` | Yes | No | As above | `Sensitive` | `[SRC: DATA §4.8]` |
| `description` | `string` | Yes | Yes | As above | `Sensitive` | `[SRC: DATA §4.8]` |
| `version_label` | `string` | Yes | Yes | As above | `Sensitive` | `[SRC: DATA §4.9]` |
| `input_definition` | `object` | Yes | Yes | Opaque document; `null` means no declared inputs. The shape is not defined by this contract | `Sensitive` | `[SRC: DATA §4.9; TBD-BIZ-007]` |
| `steps` | `array<TaskStepSummary>` | Yes | No | Ordered by `ordinal` ascending; contiguous from 1; `steps.length = step_count` | `Internal` (container); elements carry their own classification | `[SRC: DATA §4.10; IXD §3.2 PG-008]` |

**`TaskStepSummary`**

| Field | Type | Required | Nullable | Constraints | Classification | Source |
|---|---|---|---|---|---|---|
| `ordinal` | `integer` | Yes | No | `>= 1`; contiguous from 1 | `Internal` | `[SRC: DATA §4.10]` |
| `target_kind` | `enum<skill_version, mcp_tool>` | Yes | No | Exactly one target kind | `Internal` | `[SRC: DATA §4.10]` |
| `target_label` | `string` | Yes | Yes | For `skill_version`, the recorded skill name only when the caller also holds `Skill.read`; otherwise `null`. For `mcp_tool`, always `null` because the tool name is withheld and the server name is not substituted as a tool label | `Sensitive` when non-null | `[SRC: 02 §5; IXD §2.4, §3.2 PG-009; DATA §4.10]` |

No `task_definition_id`, `task_version_id`, `owner_account_id`, `registry_state`, `version_state`, `target_skill_version_id`, `target_mcp_server_id`, `target_tool_name`, or `step_parameters` is returned `[SRC: DATA §4.10; IXD §2.4]`. The ordered composition is visible; the parameters and tool names are not.

### 6.7 Run and run-step components

**`RunRecord`**

| Field | Type | Required | Nullable | Constraints | Classification | Source |
|---|---|---|---|---|---|---|
| `run_reference` | `string` | Yes | No | Non-empty business key; unique | `Sensitive` | `[SRC: DATA §4.11; BM §5.1 ENT-014]` |
| `run_state` | `enum<Initiated, Running, Succeeded, Failed>` | Yes | No | `Initiated`/`Running` are non-terminal; `Succeeded`/`Failed` are terminal and immutable | `Internal` | `[SRC: DATA §4.11, §5.5; BM §7.1]` |
| `task_name` | `string` | Yes | No | The recorded task used by the run | `Sensitive` | `[SRC: DATA §4.11; IXD §3.2 PG-009]` |
| `task_version_label` | `string` | Yes | No | The one recorded task version bound at creation | `Sensitive` | `[SRC: DATA §4.11; BM §8 BR-005]` |

No `run_id`, `initiator_account_id`, `task_version_id`, `trigger_type`, `created_at`, `terminal_at`, cost, token, artifact, retry, cancel, schedule, or owner display is returned `[SRC: DATA §4.11; IXD §3.2 PG-009]`. “Initiated by you” is derived from the own-only scope, not from an owner field.

**`RunStepRecord`**

| Field | Type | Required | Nullable | Constraints | Classification | Source |
|---|---|---|---|---|---|---|
| `ordinal` | `integer` | Yes | No | `>= 1`; contiguous from 1 | `Internal` | `[SRC: DATA §4.12]` |
| `run_step_state` | `enum<Pending, Running, Succeeded, Failed, Skipped>` | Yes | No | Terminal states are immutable; `Skipped` is never executed | `Internal` | `[SRC: DATA §4.12, §5.5; BM §7.2]` |
| `target_kind` | `enum<skill_version, mcp_tool>` | Yes | No | Exactly one target kind | `Internal` | `[SRC: DATA §4.12]` |
| `target_label` | `string` | Yes | Yes | For `skill_version`, the recorded skill name only when the caller also holds `Skill.read`; otherwise `null`. For `mcp_tool`, always `null` because the tool name is withheld and the server name is not substituted as a tool label | `Sensitive` when non-null | `[SRC: IXD §3.2 PG-009; DATA §4.12]` |
| `duration_ms` | `integer` | Yes | Yes | `>= 0` when present; `null` when not measured | `Sensitive` | `[SRC: DATA §4.12]` |
| `result_summary` | `string` | Yes | Yes | Recorded result text; `null` when none | `Sensitive` | `[SRC: DATA §4.12]` |
| `error_summary` | `string` | Yes | Yes | Recorded error text; `null` when none. Never a provider stack trace or raw internal error | `Sensitive` | `[SRC: DATA §4.12; 02 §6.1 ERR-06]` |
| `failed_predecessor_ordinal` | `integer` | Yes | Yes | `>= 1`; non-null only when `run_step_state = Skipped` | `Internal` | `[SRC: DATA §4.12]` |

No `run_id`, `target_skill_version_id`, `target_mcp_server_id`, `target_tool_name`, `started_at`, `ended_at`, `updated_at`, retry, attempt, approval, checkpoint, or tool output blob is returned `[SRC: DATA §4.12]`.

### 6.8 Request components

**`SignInCreate`**

| Field | Type | Required | Nullable | Constraints | Classification | Notes |
|---|---|---|---|---|---|---|
| `sign_in_name` | `string` | Yes | No | Non-empty. No length, character, or format rule is confirmed; none is invented | `Sensitive` | The value is retained by the client after a failure; it is never logged |
| `credential` | `string` | Yes | No | Non-empty. No format rule is confirmed; none is invented | `Sensitive` / secret | Write-only: never echoed, logged, or returned. The client clears it after a failure |

**`MessageCreate`**

| Field | Type | Required | Nullable | Constraints | Classification | Notes |
|---|---|---|---|---|---|---|
| `text` | `string` | Yes | No | `length > 0`; no maximum is confirmed | `Sensitive` | The accepted message is immutable after append |

**`RunCreate`**

| Field | Type | Required | Nullable | Constraints | Classification | Notes |
|---|---|---|---|---|---|---|
| `task_name` | `string` | Yes | No | Non-empty; must resolve to a recorded task | `Sensitive` | The client does not select a task version; the server resolves the recorded version used by the run. The selection rule is not defined by the sources (G-20) |
| `inputs` | `object` | No | No | Defaults to `{}`. Validated against the recorded `input_definition`; the vocabulary and format are `TBD-BIZ-007` | `Sensitive` | If a declared input is required and absent, `40001`/`40002`; no run is created |

**`ConversationCreate`** and **`ReplyCreate`** have no body fields. A request body, if present, MUST be `{}`; any field is `40002` `[CONTRACT]`.

## 7. Endpoints

Each endpoint states its method and path, purpose and source, auth and matrix cell, idempotency and rate-limit marking, request, response, errors, projection/redaction, and a synthetic example. The examples use reserved example values (`.invalid` host, `example-*` names) and no real credential, token, or PII.

### API-001 — Sign in

- **Method and path:** `POST /api/auth/sign-in`
- **Purpose:** Verify a local credential, create a session bound to one local account, and return a success disposition. No account is created. No conversation is created.
- **Source:** `[SRC: 02 §5 Sign-in; IXD §2.2 PG-001; FLOW-001 N1–N2]`
- **Class:** `IF-01`
- **Auth:** Anonymous. The matrix cell is not a role cell; `PG-001` is `allowed (local account)` for every person with a local account `[SRC: IXD §2.2 note]`.
- **Enforcement:** `SYS-001` verifies the credential and binds the actor. A failed credential creates no session `[SRC: 02 §3.3]`.
- **Idempotency:** Not required. Sign-in creates a runtime session, not a persisted business aggregate. The client suppresses duplicate activation (`IXD §5.4`); the server does not promise that a second sign-in reuses the first session. Session termination and reuse are gaps (§15, G-05).
- **Rate limit:** 20 requests / 15 minutes / source IP; 5 requests / 15 minutes / (source IP + sign-in name as supplied). Both are `[PROPOSED: TBD-BIZ-008]`; see §11.
- **Request:** `Content-Type: application/json`; body `SignInCreate`.
- **Response `200`:** Body `SignInRead`:

| Field | Type | Required | Nullable | Constraints | Classification |
|---|---|---|---|---|---|
| `session_state` | `enum<active>` | Yes | No | A session is established and bound to the local account | `Internal` |

  Header `Set-Cookie` sets the opaque session cookie; its value is redacted and never appears in the body. No session identifier, token, account identifier, sign-in name, role, avatar, or menu data is returned `[SRC: 02 §3.4; IXD §2.3 item 1]`.
- **Errors:** `40001` (missing `sign_in_name` or `credential`), `40002` (malformed body or wrong type), `40101` (credential rejected; one generic denial), `42901`, `50301` (session store unavailable), `50001`.
- **Projection/redaction:** The request is write-only for `credential`. The response carries no `Sensitive` field. Error messages never reveal whether the account exists and never echo the credential `[SRC: 02 §6.2 rule 3; IXD §5.7]`.
- **Example request:**
  ```json
  {
    "sign_in_name": "example.member",
    "credential": "<redacted>"
  }
  ```
- **Example response:**
  ```http
  HTTP/1.1 200 OK
  Content-Type: application/json
  Set-Cookie: <session-cookie-value-redacted>; HttpOnly; Secure; SameSite=Lax; Path=/
  Cache-Control: no-store

  {
    "session_state": "active"
  }
  ```

  The cookie name and flags in this example are illustrative only; §4.1 and `docs/08_security/` own them. `Cache-Control: no-store` is proposed (§12.5).

### API-002 — Create conversation

- **Method and path:** `POST /api/conversations`
- **Purpose:** Create one conversation owned by the session actor, with no messages, and return its reference.
- **Source:** `[SRC: 02 §5 Create conversation; IXD §2.2 PG-002; IXD §4.2 N1]`
- **Class:** `IF-01`
- **Auth:** Authenticated; effective role ROLE-001. Matrix: `Conversation.chat = own-only` `[SRC: 02 §3.2; BM §6.2]`.
- **Enforcement:** Application service. The owner is the session actor; no owner identifier is accepted `[SRC: 02 §2.2]`.
- **Idempotency:** `Idempotency-Key` required. A replay returns the same `conversation_ref` and does not create a second conversation. A key reused with a different request fingerprint is `40901`. See §9.
- **Rate limit:** 30 requests / hour / account `[PROPOSED: TBD-BIZ-008]`.
- **Request:** No body fields (`ConversationCreate` is empty). `Idempotency-Key` header required.
- **Response `201`:** Header `Location: /api/conversations/{conversation_ref}`; body:

| Field | Type | Required | Nullable | Constraints | Classification |
|---|---|---|---|---|---|
| `conversation_ref` | `string` | Yes | No | Non-empty; unique within the owner | `Sensitive` |

- **Errors:** `40001` (missing `Idempotency-Key`), `40002` (body has a field or wrong media type), `40102`, `40301`, `40901` (key reused with a different request), `42901`, `50301` (store unavailable), `50302` (creation unconfirmed; do not retry blindly; reuse the key), `50001`.
- **Projection/redaction:** The response exposes only the reference. It does not expose the owner, a title, a message count, or another account's existence `[SRC: 02 §5; IXD §3.4]`.
- **Example response:**
  ```http
  HTTP/1.1 201 Created
  Location: /api/conversations/conv-0001
  Content-Type: application/json

  {
    "conversation_ref": "conv-0001"
  }
  ```

### API-003 — List own conversations

- **Method and path:** `GET /api/conversations`
- **Purpose:** List the actor's own conversations, possibly zero.
- **Source:** `[SRC: 02 §5 List own conversations; IXD §2.2 PG-002]`
- **Class:** `IF-04`
- **Auth:** Authenticated; effective role ROLE-001. Matrix: `Conversation.read = own-only`.
- **Enforcement:** Query filter scoped by `owner_account_id = session actor`. No post-fetch filtering.
- **Idempotency:** Not applicable (safe read).
- **Rate limit:** 120 requests / minute / account `[PROPOSED: TBD-BIZ-008]`.
- **Request:** No path, query, or body parameters. No `limit`, `cursor`, `sort`, `q`, or owner filter is defined (§10).
- **Response `200`:** `ListEnvelope<ConversationSummary>`.
- **Errors:** `40102`, `40301`, `42901`, `50301`, `50001`.
- **Projection/redaction:** Only the actor's conversations. No other account's reference, count, or title. No owner field. An empty list is `200` with `items: []` and `count: 0`, not an error `[SRC: 02 §5; IXD §6.3]`.
- **Example response:**
  ```json
  {
    "items": [
      { "conversation_ref": "conv-0001" },
      { "conversation_ref": "conv-0002" }
    ],
    "count": 2
  }
  ```

### API-004 — Get own conversation

- **Method and path:** `GET /api/conversations/{conversation_ref}`
- **Purpose:** Read one own conversation and its messages in append order.
- **Source:** `[SRC: 02 §5 Get own conversation; IXD §2.2 PG-002; IXD §3.4]`
- **Class:** `IF-04`
- **Auth:** Authenticated; effective role ROLE-001. Matrix: `Conversation.read` and `Message.read = own-only`.
- **Enforcement:** Query filter scoped by the session actor; messages are scoped through the conversation owner.
- **Idempotency:** Not applicable (safe read).
- **Rate limit:** 120 requests / minute / account `[PROPOSED: TBD-BIZ-008]`.
- **Path parameter:** `conversation_ref` — `string`, required, non-empty, exact match.
- **Request:** No query or body parameters.
- **Response `200`:** `ConversationRecord`.
- **Errors:** `40102`, `40301`, `40401` (unknown or non-owned; identical), `42901`, `50301`, `50001`.
- **Projection/redaction:** Unknown and non-owned produce the same `40401` body with no title, owner, state, count, or partial content. The response has no owner field and no message identifier. A pending assistant turn is not returned `[SRC: 02 §2.3, §8.4; IXD §3.4, §5.5]`.
- **Example response:**
  ```json
  {
    "conversation_ref": "conv-0001",
    "messages": [
      {
        "position": 1,
        "author_kind": "member",
        "content_text": "Example message text."
      },
      {
        "position": 2,
        "author_kind": "assistant",
        "content_text": "Example assistant reply."
      }
    ]
  }
  ```

### API-005 — Append user message

- **Method and path:** `POST /api/conversations/{conversation_ref}/messages`
- **Purpose:** Append one non-empty user message to an owned conversation and return its position. Acceptance is confirmed independently of any reply.
- **Source:** `[SRC: 02 §5 Append user message; IXD §2.2 PG-002 Send; FLOW-002 N2]`
- **Class:** `IF-01`
- **Auth:** Authenticated; effective role ROLE-001. Matrix: `Conversation.chat = own-only`.
- **Enforcement:** Application service. The conversation must be owned by the actor; a non-owned or unknown reference is `40401`.
- **Idempotency:** `Idempotency-Key` required. A replay returns the same `position` and does not append a second message. See §9.
- **Rate limit:** 30 requests / minute / account `[PROPOSED: TBD-BIZ-008]`.
- **Path parameter:** `conversation_ref` — as above.
- **Request:** Body `MessageCreate`; `Idempotency-Key` header required.
- **Response `201`:** Header `Location: /api/conversations/{conversation_ref}`; body:

| Field | Type | Required | Nullable | Constraints | Classification |
|---|---|---|---|---|---|
| `position` | `integer` | Yes | No | `>= 1`; the accepted message's position | `Internal` |
| `author_kind` | `enum<member>` | Yes | No | Always `member` for this operation | `Internal` |

  The response does not echo `text`; the client already holds it, and the durable confirmation is the position `[CONTRACT]`.
- **Errors:** `40001` (missing `text` or `Idempotency-Key`), `40002` (empty `text`, wrong type, unknown field, malformed body), `40102`, `40301`, `40401` (unknown or non-owned conversation), `40901` (key reused with a different request), `40902` (the conversation is not accepting a message, if the persisted state says so), `42901`, `50301`, `50302` (acceptance unconfirmed), `50001`.
- **Projection/redaction:** The message is retained on acceptance. No model, provider, or reply status is disclosed. No partial assistant turn is created or returned `[SRC: 02 §5; FLOW-002 N2, F2]`.
- **Example request:**
  ```http
  POST /api/conversations/conv-0001/messages
  Content-Type: application/json
  Idempotency-Key: 6f1c2a9e-8d7b-4c3a-9f2e-1a2b3c4d5e6f

  {
    "text": "Example message text."
  }
  ```
- **Example response:**
  ```http
  HTTP/1.1 201 Created
  Location: /api/conversations/conv-0001
  Content-Type: application/json

  {
    "position": 1,
    "author_kind": "member"
  }
  ```

### API-006 — Request assistant reply

- **Method and path:** `POST /api/conversations/{conversation_ref}/messages/{position}/reply`
- **Purpose:** Request one assistant reply for the accepted user message at `position`. Acceptance is asynchronous with respect to the model; the durable outcome is the assistant message, which the client reads through `API-004`.
- **Source:** `[SRC: 02 §5 Request assistant reply; IXD §4.2 N3; 02 §8]`
- **Class:** `IF-02`
- **Auth:** Authenticated; effective role ROLE-001. Matrix: `Conversation.chat = own-only`; the action is a `SYS-002` system action under BR-002, scoped by the accepted message. `SYS-002` cannot widen the owner's scope `[SRC: 02 §3.3, §5]`.
- **Enforcement:** Application service + system action. The conversation must be owned by the actor; a non-owned or unknown conversation is `40401`.
- **Idempotency:** `Idempotency-Key` required. The per-message invariant is stronger: at most one assistant turn exists for one accepted user message. A replay while pending returns `202` with `reply_status: "pending"`; a replay after completion returns `200` with `reply_status: "completed"` and the same `assistant_position`; it never starts a second model call for the same message. See §9 and `[SRC: 02 §8.2]`.
- **Rate limit:** 30 requests / minute / account `[PROPOSED: TBD-BIZ-008]`.
- **Path parameters:** `conversation_ref` — as above; `position` — `integer >= 1`, the accepted member message's position.
- **Request:** No body fields (`ReplyCreate` is empty); `Idempotency-Key` header required.
- **Response `202` (pending):**

| Field | Type | Required | Nullable | Constraints | Classification |
|---|---|---|---|---|---|
| `reply_status` | `enum<pending>` | Yes | No | The request was accepted; no assistant turn is confirmed | `Internal` |

- **Response `200` (already completed):**

| Field | Type | Required | Nullable | Constraints | Classification |
|---|---|---|---|---|---|
| `reply_status` | `enum<completed>` | Yes | No | Exactly one assistant turn exists for this message | `Internal` |
| `assistant_position` | `integer` | Yes | No | `>= 1`; the assistant message's position | `Internal` |

  Neither response returns the assistant text; the client reads `API-004` to obtain the persisted turn. This keeps the durable unit the completed assistant turn and does not commit to streaming `[SRC: 02 §8.4]`.
- **Errors:** `40001` (missing `Idempotency-Key`), `40002` (body has a field), `40102`, `40301`, `40401` (unknown or non-owned conversation, or unknown position), `40901` (key reused with a different request), `40902` (the position is an assistant message or is otherwise not an unanswered member message; or the conversation is not accepting), `42901`, `50301` (model, store, or append dependency unavailable), `50302` (acceptance unconfirmed), `50001`.
- **Projection/redaction:** No partial answer, provider name, raw provider error, stack trace, or prompt content is returned. On a model failure, no assistant turn is appended; the accepted user message remains `[SRC: 02 §5, §8.1; IXD §5.7]`. If the session ends during the reply, the outcome is read from the persisted conversation; the contract does not fabricate success or failure `[SRC: 02 §8.5; §15 CF-08]`.
- **Example response (pending):**
  ```http
  HTTP/1.1 202 Accepted
  Content-Type: application/json

  {
    "reply_status": "pending"
  }
  ```
- **Example response (replay after completion):**
  ```json
  {
    "reply_status": "completed",
    "assistant_position": 2
  }
  ```

### API-007 — List skills

- **Method and path:** `GET /api/skills`
- **Purpose:** List recorded skills, possibly zero.
- **Source:** `[SRC: 02 §5 List skills; IXD §2.2 PG-003]`
- **Class:** `IF-04`
- **Auth:** Authenticated; effective role ROLE-001. Matrix: `Skill.read = read-only`.
- **Enforcement:** Query filter for the grant only; no owner scope. Draft or unpublished identities are not listable `[SRC: 02 §2.4; DATA §5.5]`.
- **Idempotency:** Not applicable (safe read).
- **Rate limit:** 120 requests / minute / account `[PROPOSED: TBD-BIZ-008]`.
- **Request:** No path, query, or body parameters. No search, filter, sort, or paging parameter is defined (§10).
- **Response `200`:** `ListEnvelope<SkillSummary>`.
- **Errors:** `40102`, `40301` (no `Skill.read` grant, e.g. a proposed role), `42901`, `50301`, `50001`.
- **Projection/redaction:** No owner, lifecycle badge, dependency list, MCP tool name, or unrecorded entry. A zero-record registry is `200` with an empty list, not `404` `[SRC: 02 §5; IXD §6.4]`.
- **Example response:**
  ```json
  {
    "items": [
      {
        "skill_name": "example-skill",
        "description": "Example skill description.",
        "version_label": "1.0.0"
      }
    ],
    "count": 1
  }
  ```

### API-008 — Get skill record

- **Method and path:** `GET /api/skills/{skill_name}`
- **Purpose:** Read one recorded skill's content.
- **Source:** `[SRC: 02 §5 Get skill record; IXD §2.2 PG-004]`
- **Class:** `IF-04`
- **Auth:** Authenticated; effective role ROLE-001. Matrix: `Skill.read = read-only`.
- **Enforcement:** Query filter for the grant only. An unrecorded name is `40401`.
- **Idempotency:** Not applicable (safe read).
- **Rate limit:** 120 requests / minute / account `[PROPOSED: TBD-BIZ-008]`.
- **Path parameter:** `skill_name` — `string`, required, non-empty, exact match.
- **Request:** No query or body parameters.
- **Response `200`:** `SkillRecord`.
- **Errors:** `40102`, `40301`, `40401` (unrecorded name), `42901`, `50301`, `50001`.
- **Projection/redaction:** No owner, no lifecycle status, no dependency list, no MCP tool name, and no unrecorded entry. A field with no value is `null`/“not provided”, not a partial record `[SRC: 02 §5; IXD §6.5; DATA §4.6]`.
- **Example response:**
  ```json
  {
    "skill_name": "example-skill",
    "description": "Example skill description.",
    "version_label": "1.0.0",
    "instructions": "Example recorded instructions.",
    "input_definition": {
      "example": "opaque-declared-input-definition"
    }
  }
  ```

### API-009 — List MCP servers

- **Method and path:** `GET /api/mcp-servers`
- **Purpose:** List recorded MCP servers and their recorded health, possibly zero.
- **Source:** `[SRC: 02 §5 List MCP servers; IXD §2.2 PG-005]`
- **Class:** `IF-04`
- **Auth:** Authenticated; effective role ROLE-001. Matrix: `McpServer.read = read-only`.
- **Enforcement:** Query filter for the grant only. No credential value or secret reference is projected.
- **Idempotency:** Not applicable (safe read).
- **Rate limit:** 120 requests / minute / account `[PROPOSED: TBD-BIZ-008]`.
- **Request:** No path, query, or body parameters.
- **Response `200`:** `ListEnvelope<McpServerSummary>`.
- **Errors:** `40102`, `40301`, `42901`, `50301`, `50001`.
- **Projection/redaction:** No credential value, secret reference, tool name, tool count, connection type, timeout, or owner. No write affordance exists `[SRC: 02 §5; IXD §6.6; DATA §4.7]`.
- **Example response:**
  ```json
  {
    "items": [
      {
        "server_name": "example-server",
        "recorded_health": "connected"
      }
    ],
    "count": 1
  }
  ```

### API-010 — Get MCP server record

- **Method and path:** `GET /api/mcp-servers/{server_name}`
- **Purpose:** Read one recorded MCP server's recorded health and endpoint reference.
- **Source:** `[SRC: 02 §5 Get MCP server record; IXD §2.2 PG-006]`
- **Class:** `IF-04`
- **Auth:** Authenticated; effective role ROLE-001. Matrix: `McpServer.read = read-only`.
- **Enforcement:** Query filter for the grant only. An unrecorded name is `40401`.
- **Idempotency:** Not applicable (safe read).
- **Rate limit:** 120 requests / minute / account `[PROPOSED: TBD-BIZ-008]`.
- **Path parameter:** `server_name` — `string`, required, non-empty, exact match.
- **Request:** No query or body parameters.
- **Response `200`:** `McpServerRecord`.
- **Errors:** `40102`, `40301`, `40401` (unrecorded name), `42901`, `50301`, `50001`.
- **Projection/redaction:** No credential value, resolved secret reference, tool name, tool count, connection type, timeout, or owner. `endpoint_reference` is `Sensitive` internal topology and is returned only because PG-006 renders it; it must be withheld if the security policy later says so `[SRC: 02 §5; IXD §6.7; DATA §7.2; TBD-BIZ-014]`.
- **Example response:**
  ```json
  {
    "server_name": "example-server",
    "recorded_health": "connected",
    "endpoint_reference": "https://mcp.example.invalid/redacted"
  }
  ```

### API-011 — List task definitions

- **Method and path:** `GET /api/tasks`
- **Purpose:** List recorded task definitions, possibly zero.
- **Source:** `[SRC: 02 §5 List task definitions; IXD §2.2 PG-007]`
- **Class:** `IF-04`
- **Auth:** Authenticated; effective role ROLE-001. Matrix: `TaskDefinition.read = read-only`.
- **Enforcement:** Query filter for the grant only; no owner scope; drafts are not listable.
- **Idempotency:** Not applicable (safe read).
- **Rate limit:** 120 requests / minute / account `[PROPOSED: TBD-BIZ-008]`.
- **Request:** No path, query, or body parameters.
- **Response `200`:** `ListEnvelope<TaskSummary>`.
- **Errors:** `40102`, `40301`, `42901`, `50301`, `50001`.
- **Projection/redaction:** No owner, schedule, trigger, template, approval, or lifecycle state. A zero-record registry is `200` with an empty list `[SRC: 02 §5; IXD §6.8]`.
- **Example response:**
  ```json
  {
    "items": [
      {
        "task_name": "example-task",
        "description": "Example task description.",
        "version_label": "1.0.0",
        "step_count": 2
      }
    ],
    "count": 1
  }
  ```

### API-012 — Get task definition and declared inputs

- **Method and path:** `GET /api/tasks/{task_name}`
- **Purpose:** Read one recorded task's declared input requirements and ordered step composition, for the run form.
- **Source:** `[SRC: 02 §5 Get task definition and declared inputs; IXD §2.2 PG-007–PG-008]`
- **Class:** `IF-04`
- **Auth:** Authenticated; effective role ROLE-001. Matrix: `TaskDefinition.read = read-only`.
- **Enforcement:** Query filter for the grant only. An unrecorded name is `40401`.
- **Idempotency:** Not applicable (safe read).
- **Rate limit:** 120 requests / minute / account `[PROPOSED: TBD-BIZ-008]`.
- **Path parameter:** `task_name` — `string`, required, non-empty, exact match.
- **Request:** No query or body parameters.
- **Response `200`:** `TaskRecord`.
- **Errors:** `40102`, `40301`, `40401` (unrecorded name), `42901`, `50301`, `50001`.
- **Projection/redaction:** No owner, schedule, approval, branch/loop control, step parameter, MCP tool name, or lifecycle state. A skill target's name is shown; an MCP tool target's name is withheld and `target_label` is `null` `[SRC: IXD §3.2 PG-008–PG-009; 02 §13.2 BGAP-05]`.
- **Example response:**
  ```json
  {
    "task_name": "example-task",
    "description": "Example task description.",
    "version_label": "1.0.0",
    "input_definition": {
      "example": "opaque-declared-input-definition"
    },
    "steps": [
      {
        "ordinal": 1,
        "target_kind": "skill_version",
        "target_label": "example-skill"
      },
      {
        "ordinal": 2,
        "target_kind": "mcp_tool",
        "target_label": null
      }
    ]
  }
  ```

### API-013 — Start manual run

- **Method and path:** `POST /api/runs`
- **Purpose:** Create one manual run of a recorded task with declared inputs, bind the initiating account, record the one task version, return the run reference and `Initiated` state. The call does not wait for a terminal outcome.
- **Source:** `[SRC: 02 §5 Start manual run; IXD §2.2 PG-008; FLOW-003 N2–N3]`
- **Class:** `IF-01` + `IF-03`
- **Auth:** Authenticated; effective role ROLE-001. Matrix: `Run.initiate = allowed`; `SYS-004` checks an active session, a recorded task, valid inputs, and manual initiation only `[SRC: 02 §3.2, §3.3]`.
- **Enforcement:** Application service + `SYS-004` system check. The initiator is the session actor; no initiator is accepted from the caller. A scheduled, webhook, or event trigger is not accepted `[SRC: BM §8 BR-005, BR-006]`.
- **Idempotency:** `Idempotency-Key` required. A replay returns the same `run_reference` and `Initiated`; it does not create a second run. A key reused with a different request is `40901`. If the result is lost and the key is not reused, a blind retry can create a second run; this is `BGAP-01`/`BGAP-02` and is not resolved by this contract `[SRC: 02 §7.3, §10]`.
- **Rate limit:** 10 requests / hour / account `[PROPOSED: TBD-BIZ-008]`.
- **Request:** Body `RunCreate`; `Idempotency-Key` header required.
- **Response `201`:** Header `Location: /api/runs/{run_reference}`; body:

| Field | Type | Required | Nullable | Constraints | Classification |
|---|---|---|---|---|---|
| `run_reference` | `string` | Yes | No | Non-empty; unique | `Sensitive` |
| `run_state` | `enum<Initiated>` | Yes | No | The run is created before any step executes | `Internal` |
| `task_name` | `string` | Yes | No | The recorded task used | `Sensitive` |
| `task_version_label` | `string` | Yes | No | The one recorded version bound at creation | `Sensitive` |

  The response confirms **created**, not **succeeded** `[SRC: IXD §4.3; 02 §4.1]`.
- **Errors:** `40001` (missing `task_name` or `Idempotency-Key`), `40002` (invalid inputs, unknown field, malformed body), `40102`, `40301`, `40401` (unrecorded task), `40901` (key reused with a different request, or an accepted duplicate is detected; no run is created), `42901`, `50301` (store or runner unavailable), `50302` (creation unconfirmed; do not retry blindly), `50001`.
- **Projection/redaction:** No outcome claim; no owner display; no artifact, cost, token, or audit metadata. The run reference is visible only to the initiator. `[SRC: 02 §5, §7.1; IXD §6.9]`
- **Example request:**
  ```http
  POST /api/runs
  Content-Type: application/json
  Idempotency-Key: 2b7d4c1a-5e6f-4a8b-9c0d-1e2f3a4b5c6d

  {
    "task_name": "example-task",
    "inputs": {
      "example_input": "example value"
    }
  }
  ```
- **Example response:**
  ```http
  HTTP/1.1 201 Created
  Location: /api/runs/run-0001
  Content-Type: application/json

  {
    "run_reference": "run-0001",
    "run_state": "Initiated",
    "task_name": "example-task",
    "task_version_label": "1.0.0"
  }
  ```

### API-014 — Get own run

- **Method and path:** `GET /api/runs/{run_reference}`
- **Purpose:** Read one own run's persisted state, terminal or non-terminal.
- **Source:** `[SRC: 02 §5 Get own run; IXD §2.2 PG-009]`
- **Class:** `IF-04`
- **Auth:** Authenticated; effective role ROLE-001. Matrix: `Run.read = own-only`.
- **Enforcement:** Query filter scoped by `initiator_account_id = session actor`. A non-owned or unknown reference is `40401`.
- **Idempotency:** Not applicable (safe read).
- **Rate limit:** 120 requests / minute / account `[PROPOSED: TBD-BIZ-008]`.
- **Path parameter:** `run_reference` — `string`, required, non-empty, exact match.
- **Request:** No query or body parameters.
- **Response `200`:** `RunRecord`.
- **Errors:** `40102`, `40301`, `40401` (unknown or non-owned; identical), `42901`, `50301`, `50001`.
- **Projection/redaction:** The response reports only persisted state. A terminal state is returned only if it was persisted; a read failure is `50301`, never a guessed terminal state. No initiator, task ID, artifact, cost, token, audit, or owner display `[SRC: 02 §10; IXD §6.10]`. `Initiated` and `Running` are non-terminal and must not be presented as success or failure `[SRC: BM §7.1]`. No polling interval or push mechanism is defined; a re-read reports the persisted state.
- **Example response:**
  ```json
  {
    "run_reference": "run-0001",
    "run_state": "Running",
    "task_name": "example-task",
    "task_version_label": "1.0.0"
  }
  ```

### API-015 — List own run steps

- **Method and path:** `GET /api/runs/{run_reference}/steps`
- **Purpose:** List the run steps of one own run, including `Failed` and `Skipped` rows.
- **Source:** `[SRC: 02 §5 List own run steps; IXD §2.2 PG-009]`
- **Class:** `IF-04`
- **Auth:** Authenticated; effective role ROLE-001. Matrix: `RunStep.read = own-only`.
- **Enforcement:** Query filter scoped through the run's initiator. A non-owned or unknown run is `40401`, not an empty list.
- **Idempotency:** Not applicable (safe read).
- **Rate limit:** 120 requests / minute / account `[PROPOSED: TBD-BIZ-008]`.
- **Path parameter:** `run_reference` — as above.
- **Request:** No query or body parameters.
- **Response `200`:** `ListEnvelope<RunStepRecord>`, ordered by `ordinal` ascending.
- **Errors:** `40102`, `40301`, `40401` (unknown or non-owned run; identical), `42901`, `50301`, `50001`.
- **Projection/redaction:** The failed step is visible to the initiator; remaining steps are `Skipped`; no later step runs. No other account's steps, no artifact, no tool output blob, and no target tool name `[SRC: BM §8 BR-008; IXD §6.10; 02 §13.2 BGAP-05]`. A run rejected before any step legitimately returns an empty `items` list; see §15 CF-09. No polling interval or push mechanism is defined.
- **Example response:**
  ```json
  {
    "items": [
      {
        "ordinal": 1,
        "run_step_state": "Failed",
        "target_kind": "skill_version",
        "target_label": "example-skill",
        "duration_ms": 1200,
        "result_summary": null,
        "error_summary": "Example step failure summary.",
        "failed_predecessor_ordinal": null
      },
      {
        "ordinal": 2,
        "run_step_state": "Skipped",
        "target_kind": "mcp_tool",
        "target_label": null,
        "duration_ms": null,
        "result_summary": null,
        "error_summary": null,
        "failed_predecessor_ordinal": 1
      }
    ],
    "count": 2
  }
  ```

## 8. Error model

### 8.1 Seven classes

The seven classes are architecture-local identifiers from input 1 §6.1. This contract assigns them unique wire codes and keeps their semantics and disclosure rules.

| Class | Wire family | Codes | Semantics | Trigger | Disclosure rule | Recovery | UI state |
|---|---|---|---|---|---|---|---|
| `ERR-01` | `400` | `40001`, `40002` | Input is missing, malformed, or fails a declared requirement, before any state change | Missing field/header/path parameter; empty message; invalid declared input; malformed JSON | May name the field and the unmet requirement; never echoes a credential; never discloses server internals | Correct and resend | Error, field-level |
| `ERR-02` | `401` | `40101`, `40102` | The credential was rejected at sign-in, or the session is absent, ended, or invalid | Bad credential; missing/expired session | One generic denial at sign-in with no account-existence signal; on an authenticated endpoint, a session-ended notice only | Retry at sign-in or re-authenticate | Error on `PG-001`; No Permission on an authenticated page |
| `ERR-03` | `403` | `40301` | No effective grant exists for an action whose resource class the caller can legitimately identify | Proposed role; missing grant | May state that access is denied; no role, owner, title, count, or existence hint | None, or operator escalation | No Permission |
| `ERR-04` | `404` | `40401` | The referenced object does not exist, is not recorded, or is not readable by the caller | Unknown or non-owned conversation/run; unrecorded skill/server/task | Identical for unknown and non-owned; no title, owner, state, count, or partial content; no raw identifier echo | Correct the reference, or return to a readable page | No Result |
| `ERR-05` | `409` | `40901`, `40902` | The request conflicts with persisted state, or repeats an operation already accepted | Duplicate key; not accepting; already answered; (future) terminal run | May state the conflict class and the current state where the caller may read it; no second aggregate; no false success | Re-read the state, then decide; no automatic repeat | Error or Success-Failure, depending on readability |
| `ERR-06` | `503` | `50301`, `50302` | A required dependency is unavailable, or the outcome of an accepted command cannot be determined | Model, store, or MCP metadata unavailable; lost result; unconfirmed creation | May state that the operation could not be completed or confirmed; no provider, store, host, or stack detail; never success or a guessed terminal state; `50302` carries `outcome: "unconfirmed"` | Retry when the dependency recovers, by a person; an unconfirmed start must not be retried blindly | Error; last state marked unavailable for a run status; do-not-retry for an unconfirmed start |
| `ERR-07` | `500` | `50001` | A condition not classified above | Unexpected internal failure | Generic failure only; no internals; no partial record as complete | Operator escalation | Error |

### 8.2 Error codes

Every code is globally unique within this contract. The numeric range is segmented: `4xxxx` business/control, `5xxxx` system. The first three digits mirror the HTTP status; the last two distinguish conditions within that status. The ranges are `400xx` input, `401xx` authentication, `403xx` permission, `404xx` non-disclosure, `409xx` conflict, `429xx` transport control; `500xx` internal and `503xx` dependency. No two codes share a meaning.

| Code | HTTP | Class | Name | Semantics | Trigger condition | Disclosure |
|---|---|---|---|---|---|---|
| `40001` | `400` | `ERR-01` | `MISSING_REQUIRED_INPUT` | A required parameter is absent; no state change | Missing `sign_in_name`, `credential`, `text`, `task_name`, a required path parameter, or the required `Idempotency-Key` header | May name the parameter; no credential echo |
| `40002` | `400` | `ERR-01` | `INVALID_INPUT` | A supplied value is malformed, the wrong type, fails a declared requirement, or the body is not valid JSON; no state change | Empty `text`; unknown request field; invalid `inputs` against the recorded definition; malformed JSON; wrong media type | May name the field and requirement; no internals |
| `40101` | `401` | `ERR-02` | `INVALID_CREDENTIAL` | The sign-in credential was rejected, or the account does not exist; the two are indistinguishable; no session is created | `API-001` only | One generic denial; never “account not found”, “wrong password”, or a credential echo |
| `40102` | `401` | `ERR-02` | `SESSION_INACTIVE` | No active session; the session is absent, ended, or invalid; no state change | Any authenticated endpoint | Session-ended notice only; no distinction between absent and expired |
| `40301` | `403` | `ERR-03` | `FORBIDDEN` | No effective grant for the caller's role; the resource class is known; no state change | A proposed role, or any role without the matrix grant | Generic denial; no role, owner, title, count, or existence hint |
| `40401` | `404` | `ERR-04` | `NOT_FOUND` | The business reference does not resolve, is unrecorded, or is not owned by the actor; all are identical | Unknown/non-owned conversation, run, or message position; unrecorded skill, MCP server, or task | Identical body for all cases; no title, owner, state, count, partial content, or reference echo |
| `40901` | `409` | `ERR-05` | `DUPLICATE_SUBMISSION` | The idempotency key was reused with a different request fingerprint, or an accepted duplicate is detected; no second aggregate | `API-002`, `API-005`, `API-006`, `API-013` | May state the conflict class; a same-fingerprint replay returns the original response; a different fingerprint never receives a stored success as a new result; no second aggregate |
| `40902` | `409` | `ERR-05` | `STATE_CONFLICT` | The request conflicts with persisted state; no second aggregate and no false success | The position is not an unanswered member message; the conversation is not accepting; a future run-mutating command targets a terminal run | May state the current state where the caller may read it; no owner or hidden state |
| `42901` | `429` | `CONTROL` | `RATE_LIMITED` | Transport control; no business outcome and no state change | A proposed rate limit is exceeded | `Retry-After`; no limit counter, account existence, or business detail |
| `50001` | `500` | `ERR-07` | `INTERNAL_ERROR` | An unexpected internal condition; no state change is claimed unless the command is known to have completed | Any unclassified failure | Generic failure only; no stack, provider, store, secret, or PII |
| `50301` | `503` | `ERR-06` | `DEPENDENCY_UNAVAILABLE` | A required dependency is unavailable or its state cannot be determined | Model, store, MCP metadata, or session store failure | No provider, store, host, or stack detail; no fabricated answer or terminal state |
| `50302` | `503` | `ERR-06` | `OUTCOME_UNCONFIRMED` | A command may have been accepted, but the outcome is unknown; `outcome: "unconfirmed"` | A lost result or an unconfirmable store/runner response for `API-002`, `API-005`, `API-006`, or `API-013` | Explicit unconfirmed disposition; no fabricated reference; do not retry blindly |

`42901` is a **transport control**, not an eighth business error class. The seven-class taxonomy remains `ERR-01` to `ERR-07`; rate limiting is outside it because it is not a business outcome. No code is reused across classes.

### 8.3 Error envelope

```json
{
  "error": {
    "code": "40002",
    "class": "ERR-01",
    "message": "The field 'text' must not be empty.",
    "fields": [
      { "field": "text", "reason": "must not be empty" }
    ]
  }
}
```

| Member | Type | Required | Nullable | Constraints | Classification | Notes |
|---|---|---|---|---|---|---|
| `error` | `object` | Yes | No | The only top-level member | `Internal` | — |
| `error.code` | `string` | Yes | No | One of §8.2 | `Internal` | Stable contract code; never a provider or framework code |
| `error.class` | `string` | Yes | No | `ERR-01`…`ERR-07`, or `CONTROL` for `42901` | `Internal` | The architecture class; `CONTROL` is not an eighth business class |
| `error.message` | `string` | Yes | No | Human-readable; no secret, account signal, owner, title, count, or identifier echo | `Internal` | Safe copy; not a stack trace or raw provider message |
| `error.fields` | `array<object>` | No | No | Only for `ERR-01`; each item has `field` (`string`) and `reason` (`string`) | `Internal` | Names the field, not its value |
| `error.state` | `string` | No | No | Only for `ERR-05`, and only if the caller may read the state | `Internal` | A state vocabulary value; never an owner or hidden count |
| `error.outcome` | `enum<unconfirmed>` | Conditional | No | Required when `error.code` is `50302`; omitted otherwise | `Internal` | Makes the unconfirmed disposition explicit |

No `detail`, `errors`, `data`, `provider`, `stack`, `request_body`, `account_id`, or `owner` member exists. The envelope is the same for every error; optional members are omitted when not applicable. `[CONTRACT]`

### 8.4 Disclosure rules

1. `ERR-03` versus `ERR-04`: an own-only read of another account's object is `40401`; `40301` is used only where the resource class is legitimately known and the grant is absent `[SRC: 02 §6.2 rule 1]`.
2. `ERR-05` is not a hiding place. A conflict must not be reported when the outcome is unknown; an unknown outcome is `50302` `[SRC: 02 §6.2 rule 2]`.
3. `ERR-01` versus `ERR-02` at sign-in: a missing input is `40001` and may name the field; a rejected credential is `40101` and never may `[SRC: 02 §6.2 rule 3]`.
4. Nothing leaks: no secret, credential, account existence, provider or store internal, stack trace, another account's data, or a record count the caller may not read `[SRC: 02 §6.2 rule 4]`.
5. No class implies an automatic retry. Recovery is initiated by a person or an operator; no retry count, interval, timeout, or backoff is defined here `[SRC: 02 §6.2 rule 5; TBD-BIZ-008]`.
6. Error messages use the contract's stable codes. A raw provider code is never returned; a provider message is never passed through `[SRC: IXD §5.7]`.
7. A `40401` body is identical for unknown and non-owned; the server does not echo the reference, even in a debugging field `[SRC: 02 §2.3]`.

### 8.5 Status and code mapping by endpoint

| API | Success | Business errors | System errors | Control |
|---|---|---|---|---|
| `API-001` | `200` | `40001`, `40002`, `40101` | `50301`, `50001` | `42901` |
| `API-002` | `201` | `40001`, `40002`, `40102`, `40301`, `40901` | `50301`, `50302`, `50001` | `42901` |
| `API-003` | `200` | `40102`, `40301` | `50301`, `50001` | `42901` |
| `API-004` | `200` | `40102`, `40301`, `40401` | `50301`, `50001` | `42901` |
| `API-005` | `201` | `40001`, `40002`, `40102`, `40301`, `40401`, `40901`, `40902` | `50301`, `50302`, `50001` | `42901` |
| `API-006` | `202` / `200` | `40001`, `40002`, `40102`, `40301`, `40401`, `40901`, `40902` | `50301`, `50302`, `50001` | `42901` |
| `API-007` | `200` | `40102`, `40301` | `50301`, `50001` | `42901` |
| `API-008` | `200` | `40102`, `40301`, `40401` | `50301`, `50001` | `42901` |
| `API-009` | `200` | `40102`, `40301` | `50301`, `50001` | `42901` |
| `API-010` | `200` | `40102`, `40301`, `40401` | `50301`, `50001` | `42901` |
| `API-011` | `200` | `40102`, `40301` | `50301`, `50001` | `42901` |
| `API-012` | `200` | `40102`, `40301`, `40401` | `50301`, `50001` | `42901` |
| `API-013` | `201` | `40001`, `40002`, `40102`, `40301`, `40401`, `40901` | `50301`, `50302`, `50001` | `42901` |
| `API-014` | `200` | `40102`, `40301`, `40401` | `50301`, `50001` | `42901` |
| `API-015` | `200` | `40102`, `40301`, `40401` | `50301`, `50001` | `42901` |

## 9. Idempotency and duplicate submission

### 9.1 Header, scope, and fingerprint

- Mutating commands with a persisted effect require `Idempotency-Key`: `API-002`, `API-005`, `API-006`, `API-013` `[CONTRACT]`.
- A key is an opaque string of 1–128 printable ASCII characters. It is not a credential and must not contain account, content, or secret data.
- The server stores the key with a **request fingerprint**: the authenticated actor, method, path, and a canonical representation of the request body. Semantically equal JSON objects that differ only in member order are the same body; the canonicalization is not otherwise exposed. The scope is `(actor, Idempotency-Key)`; a key reused by a different actor is a different scope and cannot replay another actor's result `[CONTRACT]`.
- The key-retention window is **24 hours, proposed**, pending `TBD-BIZ-008`. At minimum, the key MUST be retained until the accepted operation reaches a terminal outcome or the client receives a definitive response. The window is not a confirmed value `[PROPOSED: TBD-BIZ-008]`.
- A missing required key is `40001` with `fields[].field = "Idempotency-Key"`. A key reused with a different fingerprint is `40901`; no state change occurs `[CONTRACT]`.

### 9.2 Replay semantics

| Situation | Server behavior | Result |
|---|---|---|
| Same actor, same key, same fingerprint, original completed | Return the original response (or the same reference/position) without a second aggregate | `200`/`201`/`202` as originally returned |
| Same actor, same key, same fingerprint, original still pending | Return the pending disposition; do not start a second operation | `202` for `API-006`; `50302` if the outcome cannot be confirmed |
| Same actor, same key, different fingerprint | Reject; no state change | `40901` |
| Same actor, no key, required endpoint | Reject before any state change | `40001` |
| Same actor, no key, read endpoint | Not applicable; reads are safe and need no key | — |

A replay is not a new operation: it never appends a second message, creates a second conversation, starts a second model call, or creates a second run `[SRC: 02 §10; CONTRACT]`. The server does not re-execute a previously accepted command on its own initiative and does not return a stored prior success as a new result `[SRC: 02 §10]`.

### 9.3 Per-endpoint applicability

| API | Key required | Duplicate semantics | What remains a gap |
|---|---|---|---|
| `API-001` | No | The client suppresses duplicate activation; the server does not promise session reuse. A second sign-in may create a second session | Session reuse, sign-out, and session termination are unsourced (§15, G-05) |
| `API-002` | Yes | Replay returns the same `conversation_ref`; no second conversation. If the result is lost, reuse the key; `50302` if unconfirmed | No rule states whether two distinct keys from one intent are one submission |
| `API-005` | Yes | Replay returns the same `position`; no second message | Without a key, a repeated accepted message may append a second user row; the duplicate-chat-send gap in `02 §10` remains |
| `API-006` | Yes | Replay while pending returns `202`; after completion returns `200` with the same `assistant_position`; never a second model call for the same message | A retry after a failed attempt is a **new message**, not a retry of the old one (`IXD §4.2 F2, C2; §5.4`); the contract has no same-message retry |
| `API-013` | Yes | Replay returns the same `run_reference` and `Initiated`; no second run | A lost result without a reused key can create a second run (`BGAP-01`, `BGAP-02`); no run index exists to reconcile (the run-history capability is excluded in inputs 1–2; the baseline reassigns `CAP-009` to audit — see CF-01) |

### 9.4 Unconfirmed outcome

If the client receives no definitive result for `API-002`, `API-005`, `API-006`, or `API-013`, the server MUST NOT fabricate a reference or claim failure. It returns `50302` with `outcome: "unconfirmed"` when it can respond, or the client observes a transport failure. The client MUST NOT retry blindly; it should re-read the conversation to see a persisted message, or reuse the same idempotency key for a conversation, message, reply, or run command. There is no run index to reconcile against because the run-history capability is excluded in input 1; the baseline reassigns `CAP-009` to audit, so this is a further conflict (CF-01) `[SRC: 02 §7.3; IXD §5.4]`. This contract does not resolve `BGAP-01` or `BGAP-02`; it only provides the key mechanism `[CONTRACT]`.

### 9.5 What this contract does not decide

- It does not confirm the 24-hour window; `TBD-BIZ-008` owns timing.
- It does not make a repeated request harmless without a key.
- It does not define a reconciliation query or a run index.
- It does not change the per-message invariant or the at-most-one-assistant-turn rule `[SRC: 02 §8.2]`.

## 10. Pagination, sorting, and filtering

### 10.1 Pagination is not enabled

No list endpoint defines `limit`, `offset`, `cursor`, `page`, `page_size`, `after`, `before`, `has_more`, or `next_cursor`. Each list returns the complete visible set and a `count`. This is deliberate:

- No paging behavior is confirmed by input 1; `BGAP-07` records the gap, and input 2 §3.4 says no route accepts a search or filter query.
- NFR-002 is proposed, not a confirmed paging requirement `[TBD-BIZ-008]`.
- A complete set at the proposed registry scale is the current contract; a paging mechanism is a future contract change, not an implicit parameter.

### 10.2 Fixed order

No client-controlled sort parameter exists. The server returns a deterministic order:

| List | Order | Basis |
|---|---|---|
| `API-003` conversations | Creation time descending; tie-break `conversation_ref` ascending | `[CONTRACT]`; no user sort is confirmed |
| `API-004` messages | `position` ascending | `[SRC: 02 §8.2; DATA §4.4]` |
| `API-007` skills | `skill_name` ascending, case-sensitive Unicode order | `[CONTRACT]`; deterministic projection order |
| `API-009` MCP servers | `server_name` ascending, case-sensitive Unicode order | `[CONTRACT]` |
| `API-011` tasks | `task_name` ascending, case-sensitive Unicode order | `[CONTRACT]` |
| `API-012` task steps | `ordinal` ascending, contiguous from 1 | `[SRC: DATA §4.10]` |
| `API-015` run steps | `ordinal` ascending, contiguous from 1 | `[SRC: DATA §4.12]` |

This order is a contract default for determinism, not a confirmed user-facing sort capability. A future `sort` parameter is a contract change `[CONTRACT]`.

### 10.3 Filtering and search

- **Security filters are mandatory and are not query parameters.** Own-only scope is applied inside the query (§4.4). Registry projections filter to recorded/published entries server-side; drafts are not listable `[SRC: DATA §5.5]`.
- **No user filter or search exists.** No `q`, `status`, `owner`, `created_after`, `kind`, or `target` parameter is defined. No route accepts a search or filter query `[SRC: IXD §3.4; 02 §4.4]`.
- A request with an unknown query parameter is rejected with `40002` `[CONTRACT]`.

### 10.4 Reserved, not enabled, extension point

If `TBD-BIZ-011` or a successor decision confirms paging, the reserved shape is an opaque `cursor` query parameter and a `next_cursor` response field, with `has_more`. **It is not part of this contract.** No endpoint accepts or returns it today; adding it is a contract change and a new `CHG`, not a hidden behavior `[CONTRACT]`.

## 11. Rate limiting

### 11.1 Principles

- Rate limits apply at the transport edge. They do not replace the matrix, own-only scoping, validation, or idempotency `[CONTRACT]`.
- Limits are keyed by source IP, account, or both. A keyed counter must not become an account-existence oracle at sign-in: the same threshold and the same `42901` response apply whether the sign-in name exists or not `[SRC: 02 §6.2 rule 4]`.
- A `42901` response changes no state, returns `Retry-After`, and discloses no counter, account, or business detail.
- Every numeric value below is **proposed, pending TBD-BIZ-008**. None is a confirmed NFR or a commitment `[PROPOSED: TBD-BIZ-008]`.

### 11.2 Proposed limits

| Scope | Limit | Window | Applies to | Response | Tag |
|---|---|---|---|---|---|
| Sign-in by source IP | 20 requests | 15 minutes | `API-001` | `42901` + `Retry-After` | `[PROPOSED: TBD-BIZ-008]` |
| Sign-in by (source IP + sign-in name as supplied) | 5 requests | 15 minutes | `API-001` | `42901` + `Retry-After`; identical for known/unknown names | `[PROPOSED: TBD-BIZ-008]` |
| Create conversation by account | 30 requests | 1 hour | `API-002` | `42901` + `Retry-After` | `[PROPOSED: TBD-BIZ-008]` |
| Append message by account | 30 requests | 1 minute | `API-005` | `42901` + `Retry-After` | `[PROPOSED: TBD-BIZ-008]` |
| Request reply by account | 30 requests | 1 minute | `API-006` | `42901` + `Retry-After` | `[PROPOSED: TBD-BIZ-008]` |
| Start run by account | 10 requests | 1 hour | `API-013` | `42901` + `Retry-After` | `[PROPOSED: TBD-BIZ-008]` |
| Authenticated reads by account | 120 requests | 1 minute | `API-003`, `API-004`, `API-007`–`API-012`, `API-014`, `API-015` | `42901` + `Retry-After` | `[PROPOSED: TBD-BIZ-008]` |

### 11.3 Rate-limit response

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
Content-Type: application/json

{
  "error": {
    "code": "42901",
    "class": "CONTROL",
    "message": "Too many requests. Try again later."
  }
}
```

The response has no `fields`, `state`, or `outcome`. It does not reveal whether the sign-in name exists, whether an account is disabled, or how many attempts remain. A retry is a new user action after the window; no automatic retry is defined `[SRC: 02 §6.2 rule 5]`.

## 12. Data minimization, redaction, and examples

### 12.1 Classification versus projection

`Sensitive` is a handling class, not a synonym for “never serialized.” A `Sensitive` field may be returned only when the matrix grants the read and the effective page renders it. `Internal` fields are structural. The contract never serializes a credential, token, password hash, secret value, account/owner/initiator identifier, or another account's data. This is the rule behind the self-check in §14.2 `[SRC: DATA §7.1–§7.2; 02 §2.4, §3.4]`.

### 12.2 Sensitive fields returned, by endpoint

| API | Sensitive fields returned | Authorization basis |
|---|---|---|
| `API-001` | None. The request's `sign_in_name` and `credential` are write-only; the cookie is a header, not a body field | Anonymous; `SYS-001` |
| `API-002` | `conversation_ref` | `Conversation.chat = own-only` |
| `API-003` | `conversation_ref` per item | `Conversation.read = own-only` |
| `API-004` | `conversation_ref`, `content_text` per message | `Conversation.read`, `Message.read = own-only` |
| `API-005` | The path's `conversation_ref`; the request's `text` is not echoed | `Conversation.chat = own-only` |
| `API-006` | The path's `conversation_ref`; no assistant text is returned | `Conversation.chat = own-only`; `SYS-002` |
| `API-007` | `skill_name`, `description`, `version_label` | `Skill.read = read-only` |
| `API-008` | `skill_name`, `description`, `version_label`, `instructions`, `input_definition` | `Skill.read = read-only` |
| `API-009` | `server_name` | `McpServer.read = read-only` |
| `API-010` | `server_name`, `endpoint_reference` | `McpServer.read = read-only` |
| `API-011` | `task_name`, `description`, `version_label` | `TaskDefinition.read = read-only` |
| `API-012` | `task_name`, `description`, `version_label`, `input_definition`, `target_label` (skill name only, and only with `Skill.read`) | `TaskDefinition.read = read-only`; `target_label` additionally requires `Skill.read` |
| `API-013` | Request `task_name`, `inputs`; response `run_reference`, `task_name`, `task_version_label` | `Run.initiate = allowed` |
| `API-014` | `run_reference`, `task_name`, `task_version_label` | `Run.read = own-only` |
| `API-015` | `run_reference` (path), `target_label` (skill name only, and only with `Skill.read`), `duration_ms`, `result_summary`, `error_summary` | `RunStep.read = own-only`; `target_label` additionally requires `Skill.read` |

No `Sensitive` field is returned for a `denied` cell. No endpoint returns an owner, initiator, actor, or account field.

### 12.3 Never-returned fields

| Field or category | Classification or status | Why it is never returned |
|---|---|---|
| `credential`, password, password hash, salt, verifier | Secret; not a business field | Write-only authentication input; never stored in a business record, returned, or logged |
| Session token or cookie value | Secret | Conveyed only as an `HttpOnly` cookie; no body, URL, or log value |
| `account_id`, `sign_in_name` | `Sensitive` | `Account.read = denied`; no account projection exists |
| `owner_account_id`, `initiator_account_id`, `actor_account_id`, `assigned_by_account_id` | `Sensitive` | Ownership/attribution is PII and is not needed by the reader; omitting it prevents a cross-account leak |
| `registry_state`, `version_state` | `Internal` | Used server-side to filter recorded/published projections; returning it would imply a lifecycle state the effective pages do not show |
| `declared_tool_dependencies` | `Sensitive` | PG-004 does not render a dependency list; the `McpTool.read` question is unresolved (`BGAP-05`) |
| `target_tool_name` | `Sensitive` | No `McpTool.read` column; tool names are withheld (`BGAP-05`) |
| `step_parameters` | `Sensitive` | No effective page renders step parameters; the format is `TBD-BIZ-007` |
| `audit_event.*` | `Sensitive` / `Internal` | `Audit.read = denied` in inputs 1–2; no audit projection exists |
| `artifact`, `citation`, `secret_reference`, `model_configuration`, `mcp_tool` table | Not persisted or denied | No effective capability; `Artifact.read = denied` |
| `created_at`, `updated_at`, `published_at`, `started_at`, `ended_at`, `terminal_at`, `occurred_at` | `Sensitive` | Not required by the effective pages; omitted to minimize behavioural metadata. `duration_ms` is the only temporal value returned |
| `correlation_id` | `Sensitive` in the audit model | Not returned in the error envelope; operational correlation stays in logs (§15, G-15) |

### 12.4 Example and log redaction rules

- Examples use synthetic names (`example-*`), a reserved `.invalid` host, and `<redacted>` for secrets. No real account, credential, token, endpoint, or PII appears `[SRC: RULE-009]`.
- A request's `credential` and a session cookie value are never logged. A message's `content_text`, a skill's `instructions`, a task's `input_definition`, submitted run `inputs`, and a run's result/error summaries are never logged by the API layer `[SRC: DATA §7.3]`.
- Operational logs may carry an internal correlation id, run reference, internal actor id, outcome, and error class; they are not audit events and do not satisfy `CAP-009` `[SRC: DATA §7.3; BASE §3.4]`.
- No error message contains a credential, an account-existence signal, another account's data, a provider or store internal, a stack trace, or an unredacted identifier `[SRC: 02 §6.2 rule 4; IXD §5.7]`.

### 12.5 Response caching

Responses carrying `Sensitive` content SHOULD be sent with `Cache-Control: no-store`. This is **proposed**, not confirmed; the final cache and transport-security policy belongs to `docs/08_security/` and `TBD-INFRA-004` `[CONTRACT; PROPOSED]`.

## 13. Conditional appendix — Pydantic layering (non-normative)

> **Conditional.** FastAPI is not confirmed (`TBD-INFRA-002` is Open). This appendix is naming and layering guidance only. It is not an implementation, a stack selection, a dependency approval, or a requirement on any backend. If the backend is not Python/FastAPI, the semantic contract in §3–§12 still applies; only the model notation changes.

### 13.1 Layer contract

| Layer | Purpose | May contain | MUST NOT contain |
|---|---|---|---|
| `Base` | Fields shared by request and response models | Business-key fields, structural fields, `Sensitive` content fields that both sides use | Credentials, tokens, owner/initiator/account fields, storage identifiers |
| `Create` | Request-only command body | Write-only fields (`credential`, `text`, `inputs`), required business keys | Server-generated references (`conversation_ref`, `run_reference`, `position`, `ordinal`), state fields, owner fields |
| `Read` | Response-only projection | Public-to-the-grant fields, `Sensitive` fields authorized by §12.2, derived counts | Credentials, tokens, owner/initiator/account fields, storage identifiers, withheld tool names, step parameters, audit fields |
| `Update` | Not defined | — | This contract has no update endpoint; do not invent a `Patch`/`Update` model |

### 13.2 Naming guidance

| Domain object | Base | Create | Read |
|---|---|---|---|
| Sign-in | — | `SignInCreate` | `SignInRead` |
| Conversation | `ConversationBase` | `ConversationCreate` | `ConversationRead` |
| Message | `MessageBase` | `MessageCreate` | `MessageRead` |
| Skill | `SkillBase` | — (no create endpoint) | `SkillRead` |
| MCP server | `McpServerBase` | — (no create endpoint) | `McpServerRead` |
| Task definition | `TaskDefinitionBase` | — (no create endpoint) | `TaskDefinitionRead` |
| Task step | `TaskStepBase` | — | `TaskStepRead` |
| Run | `RunBase` | `RunCreate` | `RunRead` |
| Run step | `RunStepBase` | — | `RunStepRead` |
| List envelope | — | — | `ListRead[T]` |
| Error | — | — | `ErrorRead` |

Names are singular, PascalCase, and suffixed by layer. A request model is never named `…Read`; a response model is never named `…Create`. `SignInCreate`/`SignInRead` are the exception to the entity naming because sign-in is an action, not a persisted entity; the suffix still states request/response.

### 13.3 Conditional configuration guidance

- Request models: reject unknown fields (`extra="forbid"`) to match §3.2. Response models: ignore unknown fields for forward compatibility.
- Read models: `from_attributes=True` is appropriate **only if** an ORM/domain object is the source. It is not a decision that an ORM will be used.
- Do not add aliases, computed fields, validators, or serializers that encode a business rule absent from §7. Validation is a convenience; the server-side matrix and state checks remain authoritative `[SRC: IXD §5.1 cross-form rule 2]`.
- If FastAPI is selected later, its default `422` validation response is **not** this contract's behavior. A validation-error handler must emit `400` with the §8.3 envelope. That handler is implementation work, not part of this appendix.
- Pydantic itself is a third-party dependency; introducing it requires the RULE-007 audit and a recorded rationale. This appendix does not approve it `[SRC: RULE-012]`.

## 14. Traceability and self-check

### 14.1 Source traceability

| Source | Used in this contract |
|---|---|
| `02_api_workflow_and_review.md` §2 | §4.2–§4.4; command/query split, server authority, no existence oracle, read-only vs own-only, default deny, versioning deferral |
| `02_api_workflow_and_review.md` §3 | §4.5; three enforcement points; 18 matrix columns; system checks |
| `02_api_workflow_and_review.md` §5 | §5.1; 15 principle-level surfaces, mapped one-to-one to 15 endpoints; append and reply are kept separate |
| `02_api_workflow_and_review.md` §6 | §8; the seven classes and their disclosure/recovery rules |
| `02_api_workflow_and_review.md` §7–§8 | `API-005`, `API-006`, `API-013`–`API-015`; run and chat sequencing |
| `02_api_workflow_and_review.md` §10–§11 | §9, §10; duplicate/stale/session/non-disclosure, and the deferral list |
| `interaction_design.md` §2.2 | §5.2; exhaustive must-call matrix |
| `interaction_design.md` §3.4, §4.1–§4.3 | §3.3, §5.1, §10.3; business-key routes, no filter query, sign-in/chat/run flows |
| `interaction_design.md` §5 | §7; validation, feedback, duplicate, permission, copy rules |
| `interaction_design.md` §6 | §7; page states and terminal/non-terminal behavior |
| `architecture.md` §8 | §3.5, §7; sync/async classes, progress/read separation, no fabricated success |
| `05_enterprise_internal_baseline.md` §3–§5 | §15 `CF-01`, `CF-02`, `CF-12`; module/audit context, read as a conflict source |
| `data_model_spec.md` §4, §5.5, §7, §8 | §6, §12; fields, types, state vocabularies, classification, audit boundary |
| `business_model.md` §6.2, §6.2.1 | §4.3, §4.5; matrix cells and tag basis |
| `open_items.md` | §1, §15; `TBD`/`CONFLICT` references only |

### 14.2 Self-check

| Criterion | Verdict | Evidence | Residual limit |
|---|---|---|---|
| Every “must call an API” action in input 2 maps to an `API-xxx` | **Pass** | §5.2 covers all 18 rows of `IXD §2.2` (split into 21 action rows) plus New chat; 11 effective action rows map to 15 endpoints; 10 denied rows have no separate endpoint (row 15 uses the same `API-014`/`API-015` non-disclosure path) | The baseline adds effective operations that inputs 1–2 do not source (`CF-01`); they are gaps, not mappings |
| Every endpoint's auth matches its matrix cell; own-only filters inside the query and never leaks existence | **Pass** | §4.5 maps every endpoint; §4.4 scopes conversations/runs/steps in the query; §8.4 requires identical `40401` for unknown/non-owned; `API-004`/`API-014`/`API-015` state the non-disclosure rule | `CF-08` leaves cookie/session mechanics unconfirmed; `CF-01` leaves the baseline's Admin cells out |
| Error codes are unique and non-conflicting; no `Sensitive` field outside the authorized projection | **Pass** | §8.2 has 12 unique codes in segmented ranges; §12.2 lists every returned `Sensitive` field by endpoint; §12.3 lists never-returned fields; no credential/token/hash/owner field appears | `Sensitive` is a handling class, not a blanket ban; content is returned only to the matrix-authorized reader (§12.1). `CF-04` leaves some page fields unprojected |
| No `TBD` is treated as settled; every unconfirmed value is labelled | **Pass** | `TBD-INFRA-002`, `TBD-BIZ-008`, `TBD-BIZ-007`, `TBD-BIZ-012`, `TBD-BIZ-014`, `TBD-BIZ-005`, `TBD-BIZ-013`, `TBD-BIZ-011` are referenced, not answered; §11 marks every rate value `[PROPOSED: TBD-BIZ-008]`; §9 marks the 24-hour window proposed | `TBD-BIZ-004`/`-009` and `CONFLICT-001` are recorded as resolved in the registry/baseline, but this contract does not adopt the resulting authoring/audit surface (`CF-01`) |

## 15. Conflicts and gaps

This closing register records every conflict and unsourced operation found while deriving the contract. No conflict is resolved and no `TBD` is answered. `CF-*` and `G-*` labels are document-local; they are **not** registry entries and create no `TBD` or `CONFLICT` ID.

### 15.1 Conflicts

| ID | Conflict | Side A (higher in this task) | Side B (lower) | Effect on this contract | Status |
|---|---|---|---|---|---|
| `CF-01` | Enterprise baseline makes Admin authoring, audit, and all-runs effective; inputs 1–2 do not | Input 1 §2.5, §3.2 and input 2 §2.2: ROLE-002/003/004 are `denied` in every cell; no authoring or audit surface | `business_model.md` v0.3 Appendix B.3/B.4/B.6; `05_enterprise_internal_baseline.md` §2–§4; `open_items.md` (`TBD-BIZ-004`, `TBD-BIZ-009` resolved, `CONFLICT-001` resolved): Admin effective for `Skill.publish`, `TaskDefinition.publish`, `Run.read` (all), `Audit.read`; `CAP-009` effective; skill/task authoring effective | This contract exposes none of the baseline-only operations. It gates the 15 endpoints on the input 1 matrix. If the baseline is authoritative for the API, at least these operations are unsourced here: skill draft/create/publish/deprecate/discard; task draft/create/publish/retire/discard; audit list/read; Admin all-runs list/read. A higher-authority update to inputs 1–2 and a new `CHG` are required | Recorded, not resolved |
| `CF-02` | Data model v0.2 applies the baseline; this contract trims baseline-only fields | Input 1 §3.2 and input 2 §2.2: no authoring/audit/lifecycle projection | `data_model_spec.md` §1.3, §4.5–§4.14: `version_state`, `registry_state`, `role_assignment`, `audit_event` effective; Admin authoring effective | The data model is used for field names, types, and classification only. `version_state`/`registry_state` are used server-side to filter recorded/published reads and are never returned. `role_assignment` and `audit_event` fields are not projected. This is a contract-level trim, not a data-model correction | Recorded, not resolved |
| `CF-03` | Interaction design v0.1 is stale against the baseline | Input 2 `PG-010`/`PG-012` show No Permission only; `PG-009` has no audit metadata; no audit-read page exists | `CHG-012` Decision log: `PG-010`/`PG-012` No Permission states are superseded; an audit-read page/interaction contract is a required design addition | This contract follows the design's effective surface (no authoring/audit). A design update is required before UI/API implementation of the baseline. The audit read surface has no page and no endpoint | Recorded, not resolved |
| `CF-04` | MCP record page fields exceed the persisted model | Input 2 `PG-006` renders connection type, endpoint reference, credential-reference presence, timeout, and a tool-reference count | `data_model_spec.md` §4.7 models only `server_name`, `endpoint_reference`, `recorded_health`; connection type, timeout, credential reference, and tool count are "not modelled" | `API-010` returns `server_name`, `recorded_health`, and `endpoint_reference` only. The other rendered fields are gaps; adding them requires a data-model change | Recorded, not resolved |
| `CF-05` | Skill dependency list is stored but not rendered; MCP tool names are withheld | Input 2 `PG-004` renders no dependency list and `PG-009` withholds an MCP tool name | `data_model_spec.md` §4.6 stores `declared_tool_dependencies`; §4.10 stores `target_tool_name` | `API-008` omits `declared_tool_dependencies`; `API-012`/`API-015` return `target_label: null` for MCP targets. The data exists but is not projected | Recorded, not resolved |
| `CF-06` | Paging/sorting/filtering are requested by the task contract but unconfirmed by the sources | Task instruction: pagination, sorting, filtering mandatory wherever applicable | Input 1 §4.4, §11 and `BGAP-07`: no paging/filter/sort is confirmed; input 2 §3.4: no route accepts search/filter | §10 defines no paging/sort/filter parameters; lists return the complete visible set in a fixed order. A reserved cursor extension is named but not enabled. `BGAP-07` remains a gap | Recorded, not resolved |
| `CF-07` | Idempotency is required by the task contract but no dedup key/window is confirmed | Task instruction: idempotency key and duplicate semantics | Input 1 §8.2, §10: no deduplication key or window; `BGAP-01`/`BGAP-02` record duplicate/unconfirmed runs | §9 defines a contract-level `Idempotency-Key` and replay semantics. The 24-hour window is proposed pending `TBD-BIZ-008`. A no-key retry can still create a second run; no reconciliation query exists | Recorded, not resolved |
| `CF-08` | Session carriage and termination are undecided | Task instruction: auth per endpoint; no tokens in responses | Input 1 §11 defers auth header/cookie mechanics; input 2 §8.2 and `02 §13.2 BGAP-06` record session termination/sign-out as a gap | §4.1 uses a server-set `HttpOnly` cookie and no body token. Cookie name/flags/lifetime/CSRF/sign-out remain security design. No session endpoint exists; authenticated requests rely on `40102` | Recorded, not resolved |
| `CF-09` | Zero-step run for a rejected-before-any-step run conflicts with the data-model minimum-one-step invariant | Input 1 §7.2 and input 2 `PG-009` require a `Failed` run with no step results | `data_model_spec.md` §3 ER note 4: `RUN \|\|--\|{ RUN_STEP` (at least one), with the zero-step case recorded as a tension | `API-015` permits an empty `items` array for a run rejected before any step. The data-model invariant is not changed; the contract follows the workflow outcome | Recorded, not resolved |
| `CF-10` | Business-key path safety is unconfirmed | This contract uses `skill_name`, `server_name`, `task_name`, `conversation_ref`, `run_reference` in paths | Input 5/`BM` defines the keys but no length, character, case, or slash rule; input 2 has no naming rule | §3.3 assumes path-safe keys and defines no escaping for `/` or equivalent. A naming rule or a query-based lookup is required before implementation | Recorded, not resolved |
| `CF-11` | The matrix has no `McpTool.read` column, but pages and task steps reference MCP tools | Input 1 §3.2 and input 2 §2.2 have `McpServer.read`, `McpTool.allowlist`, `McpTool.invoke`, but no `McpTool.read` | `data_model_spec.md` §4.10 stores `target_tool_name`; input 2 `PG-006`/`PG-009` need a tool reference | `API-010` withholds tool names; `API-012`/`API-015` return `target_label: null` for MCP targets. This is `BGAP-05`/`AGAP-07`; no new grant is invented | Recorded, not resolved |
| `CF-12` | Audit is effective in the baseline but has no page or API in inputs 1–2 | Input 1 §3.2: `Audit.read = denied`; input 2 §2.2: audit read/export denied | Appendix B.4 and `05_enterprise...` §3.2: `CAP-009` effective, Admin audit read, no export; `data_model_spec.md` §8.2: audit read surface is a required design addition | No audit endpoint or field is in this contract. An Admin audit read would require a design page, a matrix update in inputs 1–2, and a new `CHG` | Recorded, not resolved |
| `CF-13` | All rate-limit values are unconfirmed | Task instruction: mark proposed values pending `TBD-BIZ-008` | `TBD-BIZ-008` is Open; no numeric limit or measurement environment is confirmed | §11 proposes values and labels every one `[PROPOSED: TBD-BIZ-008]`. None is a commitment | Recorded, not resolved |
| `CF-14` | FastAPI is unconfirmed; the HTTP binding is contract notation | Task instruction: framework-neutral body; Pydantic only conditional | `TBD-INFRA-002` is Open; `docs/05_api/README.md` owns the contract, not the stack | §3–§12 use HTTP methods/status as contract notation. §13 is conditional and non-normative. If the stack is not HTTP/Python, the semantic contract survives but the wire binding and appendix change | Recorded, not resolved |

### 15.2 Unsourced operations and gaps

Each row is an operation that a reader might expect but that inputs 1–2 do **not** source. None has an endpoint in this contract. Each is a gap for the Tech Lead, not a `TBD` created here.

| ID | Operation or gap | Why it is unsourced | Current disposition | Related reference |
|---|---|---|---|---|
| `G-01` | Admin skill draft create/edit, publish, deprecate, discard | Inputs 1–2 deny `Skill.publish`; baseline makes it effective | No endpoint; read-only skill APIs only | `CF-01`, `CF-03`; `TBD-BIZ-004` |
| `G-02` | Admin task draft create/edit, publish, retire, discard | Inputs 1–2 deny `TaskDefinition.publish`; baseline makes it effective | No endpoint; read-only task APIs only | `CF-01`, `CF-03`; `TBD-BIZ-004` |
| `G-03` | Admin audit event list/read | Inputs 1–2 deny `Audit.read`; baseline makes it effective | No endpoint; no audit projection | `CF-01`, `CF-12`; `TBD-BIZ-009` |
| `G-04` | Admin read of all runs | Inputs 1–2 have `Run.read = own-only`; baseline gives Admin `Run.read` (all) | No endpoint; own-only only | `CF-01` |
| `G-05` | Sign-out, session termination, idle expiry, session introspection | `BR-001` creates a session but no rule defines its end; input 2 has no sign-out control | No endpoint; `40102` is the only session signal | `CF-08`; `BGAP-06`, `AGAP-01` |
| `G-06` | MCP registration, connection test, allowlist, retirement | Inputs 1–2 deny these; baseline leaves MCP out | No endpoint; MCP read-only | `TBD-BIZ-004`, `TBD-BIZ-007` |
| `G-07` | MCP tool read, allowlist display, tool invocation | No `McpTool.read` column; invocation denied | Tool names withheld; only `target_kind` and `target_label: null` for MCP targets | `CF-11`; `BGAP-05`, `AGAP-07` |
| `G-08` | Run artifact read/download | `Artifact.read = denied` | No endpoint | `TBD-BIZ-003` |
| `G-09` | Account read/manage, invitations, roles, password reset | `Account.read` and `Account.manage = denied`; CAP-021 excluded | No endpoint | `TBD-BIZ-004` |
| `G-10` | Business-key character/case/length rule for paths | No naming rule is confirmed | Path parameters assume path-safe keys; `/` has no defined escaping | `CF-10` |
| `G-11` | Pagination, user sorting, filtering, search | No capability confirmed; `BGAP-07` | No parameters; complete list; fixed order | `CF-06`; `TBD-BIZ-011` |
| `G-12` | Streaming, incremental delivery, or a push/polling interval for assistant completion or run status | Streaming is not effective; NFR-001 is proposed; no timing is confirmed | `API-006` returns `202`; the client reads the completed turn; run status is read, not pushed | `TBD-BIZ-008` |
| `G-13` | Conversation title, rename, pin, delete, history search | CAP-018 excluded; data model has no title | No endpoint; list label is the reference | `TBD-BIZ-011` |
| `G-14` | Run cancellation, in-place retry, schedule, approval, branching | No effective capability; `TBD-BIZ-007` | No endpoint; recovery is a new run | `TBD-BIZ-007` |
| `G-15` | Error correlation id in the response body | The architecture uses correlation ids in logs; no contract field is sourced | Not returned; logs remain the operator's correlation surface | `CF-12` |
| `G-16` | Run input retention and echo of submitted `inputs` | No rule states retention; data model records it as a command payload | Request-only; not returned | `TBD-BIZ-007` |
| `G-17` | MCP connection type, timeout, credential-reference presence, tool count | Not persisted in the data model; PG-006 renders them | Not returned | `CF-04` |
| `G-18` | Zero-step run representation in the persistence model | The data model records a tension with `BR-008`/`STATE-001` | `API-015` returns an empty list; no model change | `CF-09` |
| `G-19` | Conversation "not accepting a message" state | Input 1 §5/§6 lists this `ERR-05` trigger, but `data_model_spec.md` models no conversation state or lifecycle | `API-005`/`API-006` return `40902` only if a persisted state says so; the trigger has no modelled source | `ERR-05`; `02 §6.1`; `DATA §2.3` |
| `G-20` | Task-version selection at run start | `BR-005` requires one recorded task version, but no source states whether the client selects it or the server resolves the current recorded version | `RunCreate` sends only `task_name` and `inputs`; the server resolves the version. `API-013` returns the version actually used, but the PG-008 form may show a different version than the run used | `BR-005`; `02 §7.1` |

### 15.3 What this contract does not authorize

- Starting implementation, scaffolding, dependency installation, migrations, or deployment.
- Selecting FastAPI, Pydantic, a language, a store, a gateway, a hosting model, or a CI system.
- Creating, publishing, registering, or allowlisting a registry entry.
- Adding an Admin authoring path, an audit read path, an all-runs path, or an account path.
- Resolving `CF-01`–`CF-14`, `G-01`–`G-20`, `TBD-BIZ-*`, `TBD-INFRA-*`, or `CONFLICT-*`.
- Treating this `Draft` as a frozen contract or as PRD acceptance (`TBD-BIZ-012`).
- Returning a credential, token, password hash, secret value, owner/initiator/account field, or another account's data.

**End of contract.** This document remains `Draft` pending the independent Verifier review and the Tech Lead acceptance recorded in `CHG-013`. The conflicts in §15 are carried forward, not resolved.
