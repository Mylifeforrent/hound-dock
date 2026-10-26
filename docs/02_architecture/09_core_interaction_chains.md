# Core interaction chains — end-to-end integration supplement

Status: Draft
Version: 0.1
As-of: 2026-10-20
Owner: Tech Lead scope (authored under user direction, CHG-029)
UX step authority: [../03_design/interaction_design.md](../03_design/interaction_design.md) §4 (FLOW-001–003, N/D/C steps)
Contract authority: [../05_api/api_interface_spec.md](../05_api/api_interface_spec.md) §5/§7–§9
Principle-sequence authority: [02_api_workflow_and_review.md](02_api_workflow_and_review.md) §7/§8; state authority: [architecture.md](architecture.md) §7.3/§8.4
Prototype status: [../03_design/prototype/](../03_design/prototype/) is an **interaction reference only** — it shows the feel and page behavior cited below; it is not visual authority, not a design system, and not production code (AGENTS §7)
Change record: [../13_changes/CHG-029-core-interaction-chains.md](../13_changes/CHG-029-core-interaction-chains.md)
Companion documents: [06_frontend_architecture.md](06_frontend_architecture.md) · [07_backend_technical_design.md](07_backend_technical_design.md) · [08_frontend_backend_boundary.md](08_frontend_backend_boundary.md)

## 1. Purpose and authority

This file walks the three confirmed core flows end to end — what the person does in the prototype, which page state the frontend renders, which `API` call crosses the boundary, what the backend does module by module, and which outcome returns. It introduces no identifier: every `PG`, `API`, `IF`, `SYS`, `MOD`, `ERR`, `STATE`, `BR`, and `FLOW` reference is defined in the authorities above and cited as-is. On any apparent difference, the cited authority wins (RULE-014).

Read one row left to right as one link of the chain. The chain notation:

| Column | Meaning |
|---|---|
| Trigger | The person's action, described as the prototype renders it (synthetic data, no backend) |
| Frontend | Page and nine-state rendering per architecture §8.4 |
| Call | The boundary crossing (method + path; `Idempotency-Key` where required) |
| Backend chain | Modules, checks, and stores in execution order (MOD-01–MOD-08 per architecture §6; decisions per CHG-024/025/026) |
| Outcome → UI | Wire result and the state the frontend renders next |

## 2. Chain 1 — FLOW-001: sign-in and session (PG-001 → PG-002)

| # | Trigger | Frontend | Call | Backend chain | Outcome → UI |
|---|---|---|---|---|---|
| 1 | Visit any authenticated route while signed out | Route guard keeps the last server answer; PG-001 renders `Default` | — | — | Sign-in page; no data disclosed |
| 2 | Enter any non-empty sign-in name and credential | PG-001 `Editing` (client-only; nothing persisted) | — | — | Fields filled |
| 3 | Activate **Sign in** | PG-001 `Submitting`; duplicate activation suppressed (IXD §5.4) | `POST /api/auth/sign-in` (anonymous; no `Idempotency-Key`) | Rate limit (20/IP/15 min; 5/IP+name/15 min — `TBD-BIZ-008` confirmed set) → body validation (`40001/40002`, never `422`) → `MOD-01`: PBKDF2-HMAC-SHA256 verify against the `account_credential` support store (`hmac.compare_digest`; 210,000 iters recorded, per-row parameters; rehash-on-sign-in after a successful verify) | **Rejected credential → `40101`, one generic message, no existence oracle** → PG-001 `Error` (IXD F1); no session created |
| 4 | — (continuation of 3 on success) | — | — response | Create in-process session: 256-bit opaque token, single process; cookie `hound_dock_session`, `HttpOnly`, `SameSite=Lax`, `Secure` in production; idle 30 min, absolute 8 h; restart invalidates every session (`TBD-INFRA-013`) | `200` `{"session_state":"active"}` + `Set-Cookie` (value never in body or log) → frontend records "a session exists" (no token in JS) → route to PG-002, focus moved to the page heading (IXD N2–N3) |
| 5 | Session-store failure at sign-in | PG-001 `Submitting` | same call | `MOD-01` cannot create the session | `50301` → PG-001 `Error` (IXD F2); no session |
| 6 | Any later request with an absent, ended, or invalid session (including after a server restart) | Current page → session recovery | any authenticated call | `MOD-01` finds no active session | `40102` → No Permission/sign-in rendering → PG-001 (IXD C1); the page never discloses why |

## 3. Chain 2 — FLOW-002: chat message and assistant response (PG-002)

| # | Trigger | Frontend | Call | Backend chain | Outcome → UI |
|---|---|---|---|---|---|
| 1 | Open Chat | PG-002 `Loading` → `Default` (with own conversation list) | `GET /api/conversations` (`API-003`) | Session → actor → `MOD-05` `Conversation.read = own-only` in the query → `MOD-02` projection | `{items, count}` (actor's visible count) → sidebar list; no data at all → `Empty` |
| 2 | **New chat** | Sidebar action; `Submitting` on the control | `POST /api/conversations` (`API-002`; **`Idempotency-Key` k0**) | `MOD-05` own-only → rate limit (30/h) → `MOD-02` creates one empty conversation owned by the actor | `201`; same key+body replays the same conversation, no second aggregate → open the conversation; `50302` → keep pending, reuse k0 or re-read (never blind retry) |
| 3 | Select a conversation | PG-002 `Loading` → `Default` | `GET /api/conversations/{conversation_ref}` (`API-004`) | `MOD-05` own-only in the query; unknown and non-owned are the same `40401` | Messages in append order → thread; unknown/non-owned → `No Result`, nothing disclosed |
| 4 | Activate **Send** with empty text | Rejected at the composer; no turn created; no call | — | — | `Editing` continues (IXD §4.2 N2 path); server-side `40001/40002` remains authoritative if ever reached |
| 5 | Type a non-empty message, **Send** (or Enter) | User turn renders `Sending`; composer locks; leaving with unsent text opens the single discard dialog (IXD §5.3) | `POST /api/conversations/{conversation_ref}/messages` (`API-005`; **`Idempotency-Key` k1**) | `MOD-05` `Conversation.chat = own-only` in the query → rate limit (30/min) → `MOD-02` appends exactly one user message | `201` `{position}`; same key replays the same `position`, never a second message; different fingerprint → `40901`; `50302` → reuse k1 or re-read `API-004` |
| 6 | — (after 5 succeeds) | Assistant turn renders `Assistant is responding`; composer stays locked; polite live region announces it | `POST /api/conversations/{conversation_ref}/messages/{position}/reply` (`API-006`; **`Idempotency-Key` k2**) | `MOD-02` records the pending assistant turn → calls the **model port** (internal OpenAI-compatible gateway only; synthetic adapter in development — `TBD-INFRA-009`, `TBD-BIZ-007`) | `202` while pending; a replay with the same key while pending returns `202` again — no second model call |
| 7 | Model response arrives | — | — | `MOD-02` appends **exactly one** assistant message on success (streaming is not a requirement; `NFR-001` is measured submit → completed turn retrievable) | `200` `{assistant_position}` → frontend re-reads `API-004` → the one assistant message renders, composer unlocks (`Success-Failure` → `Default`); `50301` (gateway unavailable) → `Error`, composer unlocks; a retry is a **new message**, not a resend (IXD §4.2 F2/C2) |
| 8 | Session ends mid-flow | Current page → recovery | any call | `MOD-01` no active session | `40102` → PG-001 (IXD C1); unsent text is not preserved |

## 4. Chain 3 — FLOW-003: manual task run (PG-007 → PG-008 → PG-009)

| # | Trigger | Frontend | Call | Backend chain | Outcome → UI |
|---|---|---|---|---|---|
| 1 | Open Tasks | PG-007 `Loading` → `Default` (recorded count, task cards, Run action) | `GET /api/tasks` (`API-011`) | `MOD-05` `TaskDefinition.read = read-only` → `MOD-03` read-only projection | `{items, count}`; no owner, no edit affordance |
| 2 | Activate **Run** on a recorded task | Route to PG-008 | `GET /api/tasks/{task_name}` (`API-012`) | `MOD-03` read-only; unknown → `40401` | Declared inputs + composition summary render; unknown/non-owned → `No Result`, only Back to Tasks (BR-005) |
| 3 | Complete declared inputs | PG-008 `Editing` (client-only) | — | — | Inputs filled |
| 4 | Activate **Start run** | PG-008 `Submitting` — the page locks; it never claims the run succeeded (IXD §4.3) | `POST /api/runs` (`API-013`; **`Idempotency-Key` k3**) | `MOD-05` `Run.initiate = allowed` → `SYS-004` preconditions (active session, recorded task, valid inputs) → rate limit (10/h) → `MOD-04` creates the run at `Initiated` on the recorded task version | `201` `{run_reference, state:"Initiated"}`; same key replays the same `run_reference`, never a second run → route to PG-009; `40001/40002` → inline input errors; `40901`; `50302` → reuse k3 (there is no run index to reconcile against) |
| 5 | Watch the outcome | PG-009 polls while non-terminal | `GET /api/runs/{run_reference}` (`API-014`) + `GET /api/runs/{run_reference}/steps` (`API-015`); reads ≤ 120/min | `MOD-04` **`RunExecutorPort`** drives the state machine (single process): step `Pending → Running → Succeeded/Failed`; **each step invokes exactly one skill — prompt + one internal-gateway model call** (`TBD-BIZ-007` (a); no MCP/tool execution, no code execution) | `Initiated` → `Running` → `Succeeded` or `Failed` (terminal, immutable, ADR-002); step rows show ordinal, target kind, status, `duration_ms`, result/error; a failed step leaves remaining steps `Skipped` (BR-008) |
| 6 | Terminal outcomes (synthetic prototype fixtures) | PG-009 `Success-Failure` | — | — | `weekly-digest` → `Succeeded` (3 steps); `ticket-triage` → `Failed` at step 2, step 3 `Skipped`; `health-check` → rejected before any step, no step rows |
| 7 | Start a new run / Back to Tasks | PG-009 actions | `API-013` again (new key) / `API-011` | New run is the only compensation for a failed run — no automatic retry (ADR-002) | New run form / Tasks list |
| 8 | Unknown or another account's run reference | Direct URL to PG-009 | `API-014`/`API-015` | `MOD-05` own-only in the query; unknown and non-owned are the same `40401` | The same generic "not available" panel; the page does not disclose whether the run exists (BR-008) |

## 5. Chain 4 — read-only registries (PG-003–PG-006; PG-007 read side is chain 3 step 1)

| # | Trigger | Frontend | Call | Backend chain | Outcome → UI |
|---|---|---|---|---|---|
| 1 | Open **Skills** | PG-003 `Loading` → `Default` (recorded count, skill cards) | `GET /api/skills` (`API-007`) | `MOD-05` `Skill.read = read-only` → `MOD-03` read-only projection | `{items, count}`; no owner, no dependency list, no create/edit/publish affordance — absence is the denial (CF-01) |
| 2 | Select a skill | Route to PG-004 | `GET /api/skills/{skill_name}` (`API-008`) | `MOD-03` read-only; unknown → `40401` | Record renders (name, description, instructions per the contract's read authorization); unknown → `No Result`, nothing disclosed |
| 3 | Open **MCP servers** | PG-005 `Loading` → `Default` (recorded health on cards) | `GET /api/mcp-servers` (`API-009`) | `MOD-05` `McpServer.read = read-only` → `MOD-03` projection | `{items, count}` with recorded health; no credential value, no tool names |
| 4 | Select a server | Route to PG-006 | `GET /api/mcp-servers/{server_name}` (`API-010`) | `MOD-03` read-only; unknown → `40401` | Record renders; no register/test/allowlist/invoke affordance exists (ADR-003/ADR-004) |

Registry reads have no `Idempotency-Key` (queries, not commands), carry the standard read rate limit, and render only `Default`, `Loading`, `Empty` (lists), `No Result` (unknown reference), `Error`, and `No Permission` per the page map.

## 6. Cross-chain invariants

Every chain above passes through the same gate sequence, in this order: session resolution (`MOD-01`) → policy decision (`MOD-05`, default deny, own-only inside the query) → rate limit (`TBD-BIZ-008` confirmed set, `42901` is transport control) → validation (`40001/40002`, never a framework `422`) → domain effect → contract envelope response. Failure at any gate returns the single error envelope; the frontend maps it to the nine states per architecture §8.4 — a failed load never becomes `Empty`, `Initiated`/`Running` are never terminal, `Submitting` never fabricates success, and `No Result` and `No Permission` are distinct renderings of indistinguishable server answers.

## 7. Traceability

| Chain | UX steps | Contract | Principle sequence | States | Prototype reference |
|---|---|---|---|---|---|
| Chain 1 | IXD §4.1 (N1–N3, F1–F2, C1) | `API-001` | 02 §3.3, §8.5 | PG-001 `Default/Editing/Submitting/Error` | README "FLOW-001", States control on PG-001 |
| Chain 2 | IXD §4.2 (N1–N5, F1–F2, C1–C2) | `API-002/003/004/005/006`; §9 idempotency | 02 §8.1–8.4 | PG-002 all nine states | README "FLOW-002", discard dialog |
| Chain 3 | IXD §4.3 (N1–N7, F1–F2, C1–C2) | `API-011/012/013/014/015`; §9 idempotency | 02 §7.1–7.5 | PG-007–PG-009 states | README "FLOW-003", `#/runs/RUN-7K2M`, `RUN-3P9Q`, `RUN-5C1R`, `RUN-9T6B` |
| Chain 4 | IXD §2.2 read rows; §6.4–§6.6 | `API-007/008/009/010` | 02 §2.4, §9.2 | PG-003–PG-006 states | README registry sections; PG-003/PG-005 cards with recorded health |
