# Backend technical design — implementation supplement

Status: Draft
Version: 0.1
As-of: 2026-10-20
Owner: Backend Agent (dormant); authored under user direction (CHG-028)
Stack authority: `TBD-INFRA-002` Resolved (Python 3.12 + FastAPI + uv, CHG-019); `TBD-INFRA-005` backend portion settled (uv + committed `uv.lock`, CHG-024); verified commands in [../06_development/README.md](../06_development/README.md)
Design authority: [architecture.md](architecture.md) as amended by [05_enterprise_internal_baseline.md](05_enterprise_internal_baseline.md)
Decision inputs: `TBD-INFRA-012/013/014` and `TBD-BIZ-007/008` (all Resolved, CHG-024/025/026); data authority [../04_data/data_model_spec.md](../04_data/data_model_spec.md); contract authority [../05_api/api_interface_spec.md](../05_api/api_interface_spec.md)
Change record: [../13_changes/CHG-028-architecture-supplements.md](../13_changes/CHG-028-architecture-supplements.md)
Companion documents: [06_frontend_architecture.md](06_frontend_architecture.md) · [08_frontend_backend_boundary.md](08_frontend_backend_boundary.md)

## 1. Purpose and authority

This file translates the resolved decisions into an implementable component design for the backend. It contains no code, no DDL, no migration, and no request/response schema; where a value below is a resolved decision parameter, the registry entry is the authority and this file cites it. Physical schema and migrations remain a separate authorized change (`TBD-INFRA-003` Resolved; DDL gated).

## 2. Runtime shape

- Single-process modular monolith on uvicorn; module names follow architecture §6 (`MOD-01`–`MOD-08`) and are architecture-local, not packages. A future split happens only through ports.
- Layering per request: transport (routers) → application service → domain → ports. `MOD-05 Policy and Access` is called by every service before any state change or matrix-dependent read; no path bypasses it (architecture §6 dependency rules).
- Environment-driven configuration (12-factor): `HOUND_DOCK_`-prefixed variables; `.env.example` carries key names and comments only; no secret value is ever committed (RULE-008). The FastAPI documentation endpoints (`/docs`, `/redoc`, `/openapi.json`) are disabled by default — they are not part of the 15-operation contract — and may be enabled for development only.

## 3. Identity and session chain (API-001)

Resolved parameters — `TBD-INFRA-012` (PBKDF2-HMAC-SHA256) and `TBD-INFRA-013` (in-process session) — drive this chain:

1. `POST /api/auth/sign-in` (anonymous) reads the sign-in name and credential; validation failures are `40001/40002`, never a framework `422`.
2. The verifier lives only in the security-owned support store `account_credential` (data_model_spec.md §2.5): per-row algorithm and iteration parameters, 16-byte random salt, 32-byte derived key. Verification is `hashlib.pbkdf2_hmac("sha256", …)` with `hmac.compare_digest`; recorded initial deployment parameters are 210,000 iterations (≈281 ms on the Stage 1 host; CHG-024). Rehash-on-sign-in: a row whose parameters are below the current deployment parameters is re-hashed after a successful verify.
3. A rejected credential returns `40101` with the one generic message, regardless of whether the account exists; rate limiting (`TBD-BIZ-008` confirmed set) is applied before the verify.
4. On success the server creates an in-process session: 256-bit opaque token, single process, restart invalidates every session (`40102`). Cookie `hound_dock_session`; `HttpOnly`; `SameSite=Lax`; `Secure` effective in production; idle timeout 30 minutes; absolute timeout 8 hours. The token never appears in a body, URL, or log.
5. The session binds the account as the actor. Every subsequent request resolves the actor from the cookie only; `Authorization`/`X-Account-Id`/`X-Role`-style headers are ignored and grant nothing.

## 4. Policy enforcement (MOD-05)

- Default deny; the matrix is the single authority (ADR-001). A denied column has no endpoint — absence is the denial.
- `own-only` is enforced inside the query (an actor-scoped predicate), never as a post-fetch filter; `read-only` is a projection rule.
- An unknown or non-owned reference produces the identical `40401` — no existence oracle.
- The client is never trusted for identity, role, or ownership.

## 5. Error model and transport

- One exception type carries a wire code; framework exception handlers map it to the contract envelope `{"error":{"code","class","message","fields"?,"outcome"?}}` (api_interface_spec.md §8).
- `fields` only for ERR-01 (`40001/40002`), naming the field and requirement, never the submitted value; `outcome:"unconfirmed"` only for `50302`.
- FastAPI's default validation responses are rewritten: any `422` becomes `400` (`40002`). No `detail`, `errors`, `provider`, `stack`, `data`, `request_body`, `account_id`, or `owner` member is ever emitted.
- `50301` covers an unavailable dependency (model gateway, database); `50302` covers an accepted command whose outcome could not be confirmed — the caller reuses the idempotency key or re-reads.

## 6. Idempotency (API-002, API-005, API-006, API-013)

Per `TBD-INFRA-014` (Resolved, CHG-024): a durable support store `idempotency_key` keyed on `(actor, key)` with a SHA-256 request fingerprint and a minimal replay payload, durable across restart, correct for the single worker. Same actor + key + body replays the recorded result; a different body is `40901`; no second aggregate is ever created. The retention window is 24 hours (`TBD-BIZ-008`, CHG-026); purge belongs to the later retention job.

## 7. Persistence

- SQLAlchemy 2 + psycopg 3 against PostgreSQL (`TBD-INFRA-003` Resolved); migrations via Alembic behind a separate physical-design change — none is authored here.
- Thirteen business tables plus the two support stores (`account_credential`, `idempotency_key`); session remains runtime state with no table (data_model_spec.md §2.4/§2.5).
- Completed runs and steps are durable and readable after restart (`NFR-012` direction); terminal states are immutable (ADR-002).
- No credential, token, or secret value is ever stored in a business table; no `expires_at`/retention column exists (the retention job is later; offboarding is `TBD-BIZ-013`).

## 8. Run execution (MOD-04)

Per `TBD-BIZ-007` (Resolved, option (a), CHG-025): the `RunExecutorPort` drives linear steps; each step invokes exactly one skill — a prompt assembled from the recorded skill plus declared inputs — through the model port (internal OpenAI-compatible gateway only, `TBD-INFRA-009`; no external egress, no MCP/tool invocation, no code execution).

- Step lifecycle `Pending → Running → Succeeded | Failed`; remaining steps become `Skipped` with the failed predecessor recorded (BR-008). Run and step terminal states are immutable; there is no automatic retry — a new run is the only compensation (ADR-002).
- A step that would require an external-system write is out of scope in v1; tasks of that kind are not recorded, and any future capability reopens `TBD-BIZ-007`.
- A clearly-labelled synthetic adapter stands in for the model gateway and executor in development; the port contract does not change when the real adapter lands.

## 9. Observability and limits

- Structured JSON logs through a redaction filter: operational logs contain only correlation id, run reference, internal actor id, route template, outcome, error class/code, and duration — never message content, sign-in names, endpoint references, tool names, credentials, tokens, or PII (AGENTS §6). Logs are not audit events; `MOD-08` remains a reservation.
- Rate limits per the confirmed `TBD-BIZ-008` set (sign-in 20/IP/15 min and 5/name/15 min; conversation create 30/h; message append 30/min; reply 30/min; run start 10/h; reads 120/min) are enforced server-side before handlers and return `42901` (`CONTROL`).
- Performance measurement points follow the confirmed thresholds (`NFR-001` restated non-streaming ≤ 3,000 ms; `NFR-002` ≤ 500 ms/500 items; `NFR-003` ≤ 2,000 ms) on the Stage 1 baseline host; no benchmark has been run yet.

## 10. Projections and non-goals

Responses return only contract fields: no account/owner/initiator/actor field, no credential/token/secret reference, no tool name or step parameter, no timestamp except `duration_ms`, no audit field (api_interface_spec.md §12).

Non-goals (unchanged from architecture §9): no MCP runtime, connection test, allowlisting, tool invocation, or credential resolution; no HITL/approval/interrupt/checkpoint/resume; no scheduler, webhook, or event-triggered run; no audit surface beyond the reserved boundary; no automatic retry.
