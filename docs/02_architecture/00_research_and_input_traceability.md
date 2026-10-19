# Research and input traceability — hound-dock backend architecture

Status: Draft
Version: 0.1
As-of: 2026-10-18
Owner: Lead architecture agent for the Docs Agent
Input authority: `docs/01_product/business_model.md` v0.2 (`Draft`)
Scope: trace every architecture claim to an input, separate effective from proposed material, record the official MCP research, and list the gaps that this task must not register as new TBD IDs.
Refs: CAP-001–CAP-005; FLOW-001–FLOW-006; ENT-001–ENT-018; STATE-001–STATE-006; BR-001–BR-008; NFR-001–NFR-012; ROLE-001–ROLE-004; TBD-BIZ-003–TBD-BIZ-015; TBD-INFRA-001–TBD-INFRA-011; CONFLICT-001, CONFLICT-002

## 1. Purpose and method

This record answers three questions for the architecture set:

1. Which input actually supports each architecture claim, and which claims are only candidates, assumptions, or gaps?
2. What does the official MCP material say, and what of it does this product adopt or reject?
3. Which gaps must be handed to the Tech Lead without inventing a new registry ID?

The method is a source-by-source read, not a synthesis by similarity. A statement is **effective** only when it comes from `CAP-001`–`005`, `FLOW-001`–`003`, `STATE-001`/`002`, `BR-001`–`008`, `ROLE-001`, or the effective permission-matrix cells. A PRD statement, a prototype statement, or an interaction-design convention is **candidate** material. A TBD is never used as a settled fact.

The architecture documents use four labels:

| Label | Meaning | Consequence |
|---|---|---|
| **Effective** | Sourced by the confirmed MVP, the three effective flows, the two effective state models, the eight active business rules, or the ROLE-001 matrix | May drive a boundary, a command, a state, or a test obligation |
| **Proposed — reserved** | `FLOW-004`–`006`, `STATE-003`–`006`, the publication/registration/intake paths, and `ROLE-002`–`004` | May appear only as a reserved extension point or a non-goal; must not be implemented or promised |
| **Architecture assumption** | A working assumption needed to keep the design coherent, with no confirmed source | Must name the TBD it depends on and must not become an acceptance criterion |
| **Gap** | A question that no effective rule answers and no TBD covers | Handed to the Tech Lead as a candidate; no new ID is created in this task |

## 2. Source register

| SRC-A | Input | Version / status | Use in this task | Limit |
|---|---|---|---|---|
| SRC-A01 | `docs/01_product/business_model.md` | v0.2, `Draft`, 1230 lines | Sole business authority; effective items are rules | Draft; `CONFLICT-001/002` open; `TBD-BIZ-012` was open at the time of this trace |
| SRC-A02 | `docs/03_design/interaction_design.md` | v0.1, `Draft`, 1018 lines | Page states, exception feedback, route keys, display rules, unregistered gaps | Design input only; does not define backend behavior |
| SRC-A03 | `docs/01_product/prd.md` | v0.1, `Draft`, 453 lines | Candidate capabilities and quality concerns | Not accepted; every statement is CAND |
| SRC-A04 | `docs/00_setup/open_items.md` | `Draft`, 338 lines | Canonical TBD/CONFLICT register | Reference only; never redefined here |
| SRC-A05 | `docs/02_architecture/README.md` | `Draft` | Folder boundary: no stack, no API schema, no code | — |
| SRC-A06 | `docs/00_setup/project_rules.md`; `AGENTS.md` | `Draft` | RULE-001, RULE-005, RULE-007, RULE-011, RULE-013, RULE-014, RULE-018, RULE-019, RULE-020; path ownership | — |
| SRC-A07 | `docs/13_changes/CHG-010-backend-architecture.md` | `Draft` | Approved scope, constraints, write set | — |
| SRC-A08 | [MCP architecture, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/architecture) | Official specification | Host/client/server, stateless core, capability negotiation | Research input only; no implementation obligation |
| SRC-A09 | [MCP server overview, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/server) | Official specification | Prompts, resources, tools and their control model | — |
| SRC-A10 | [MCP tools, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) | Official specification | Tool discovery/invocation, untrusted annotations, human-in-the-loop guidance, error split | — |
| SRC-A11 | [MCP authorization, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization) | Official specification | OAuth 2.1 resource-server model, protected-resource metadata, resource indicators, token audience | — |
| SRC-A12 | [MCP authorization security considerations, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations) | Official specification | Token audience binding, token theft, PKCE, mix-up, confused deputy, no token passthrough | — |
| SRC-A13 | [The MCP Registry](https://modelcontextprotocol.io/registry/about) | Official registry documentation, preview | Public metadata registry; private servers excluded; not self-hosted; not directly consumed by hosts | — |
| SRC-A14 | [The 2026-07-28 specification release](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/blog/content/posts/2026-07-28-spec-ga/index.md) | Official maintainer post | Stateless core, cacheable lists, authorization hardening, Tasks extension, deprecations | — |
| SRC-A15 | MCP tasks extension, cited in SRC-A14 | Official extension description | Distinguishes MCP Tasks from this product's business task definitions | Not adopted |

**Source-file note.** The rendered `modelcontextprotocol.io` pages and the official repository source were both checked. The rendered host was not directly fetchable from this environment on 2026-10-18; the equivalent official source files in the `modelcontextprotocol/modelcontextprotocol` repository were fetched and are cited by their rendered paths above ([architecture source](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/architecture/index.mdx), [tools source](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx), [authorization source](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/index.mdx), [registry source](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/registry/about.mdx)). This is a retrieval limitation, not a substitute for the rendered specification.

## 3. Input trace — effective material

| # | Effective input | Architecture consequence | Where handled |
|---|---|---|---|
| E-01 | `CAP-001`–`CAP-005` only; `CAP-006`–`036` excluded | Five capability modules only; no module, command, or data owner for search, files, skill invocation, tool calls, audit, usage, model configuration, account administration, projects, templates, notifications, import/export, backup, multi-tenancy | `01` §4; `architecture.md` §2 |
| E-02 | `BR-001` local-account authentication; generic denial; session binds the account | Identity and session boundary; no external IdP adapter; no account-existence signal; session termination is a gap, not a design choice | `01` §4; `03` §3 |
| E-03 | `BR-002` active session and non-empty message; one assistant message only on success; no partial answer | Chat command boundary; user message retained; model call through a port; explicit failure path; streaming not required | `01` §7–§9; `02` §8 |
| E-04 | `BR-003`/`BR-004` the registry is the record; unrecorded references rejected; unrecorded server calls denied | Read-only registry projection; existence resolved against the record; no fallback object; call-time policy hook without an executor | `01` §4, §7; `02` §5 |
| E-05 | `BR-005`/`BR-006`/`BR-008` recorded task version, one initiator, manual-only, terminal outcome, visible failed step, remaining skipped, no automatic retry | Run aggregate; task-version snapshot; manual command only; terminal immutability; step outcome records; no scheduler, webhook, or event trigger | `01` §6, §8; `02` §7 |
| E-06 | `BR-007` self-hosted, team-controlled infrastructure, no vendor control plane | Single workspace; deployable on team infrastructure; external model/MCP are dependencies, not a control plane | `architecture.md` §7; `03` §2 |
| E-07 | `ROLE-001` effective cells: own-only chat/read, run initiate, own-only run/step read, registry read-only | Policy module; default deny; own-only scoping at query time; read-only projections without owner display; no administrator path | `01` §4–§5; `02` §3; `03` §4 |
| E-08 | `ENT-001`–`018` business keys and invariants; seven existence-confirmed entities | Domain model with effective core, structurally required records, and reserved entities; no table/column design | `01` §5 |
| E-09 | `STATE-001`/`STATE-002`; `STATE-003`–`006` proposed | Only two state machines implemented; reserved lifecycles documented but not built | `01` §6 |
| E-10 | `FLOW-001`–`003` effective; `FLOW-004`–`006` proposed | Three end-to-end workflows; authoring/registration workflows reserved and not implemented | `02` §7–§8; `01` §9 |
| E-11 | `NFR-001`–`012` measurement points; 9 proposed numeric targets; 3 TBD targets | Instrumentation points and measurement plan only; no threshold, capacity, availability, retention, or SLO commitment | `03` §13; `architecture.md` §11 |
| E-12 | `CAP-003`/`BR-004` **recorded health** | MCP registry reads a stored health snapshot, not a live probe | `01` §5; `03` §6 |
| E-13 | Interaction design nine states and non-disclosure rules | Backend results must distinguish empty / no-result / error / no-permission / submitting / success-failure; own-only and not-found are externally indistinguishable | `02` §6, §9 |
| E-14 | Business keys for conversation, skill, server, task, and run | External references use business keys; routes do not carry owner identifiers; whether identifiers are unguessable is a security decision, not settled here | `01` §5; `02` §5 |

## 4. Input trace — proposed material

| # | Proposed input | Required treatment | Where handled |
|---|---|---|---|
| P-01 | `FLOW-004` skill registration and publication | Reserved extension point only; no command, state transition, endpoint, or persistence requirement | `01` §6; `architecture.md` §9 |
| P-02 | `FLOW-005` MCP registration, connection test, allowlisting, invocation | Reserved; no MCP runtime, no connection test, no allowlist enforcement path | `01` §4; `03` §6; `architecture.md` §8 |
| P-03 | `FLOW-006` task definition and publication | Reserved; run consumes a recorded task version that must be prepared out of band | `01` §5; `02` §7 |
| P-04 | `STATE-003`–`006` | Reference only; no lifecycle implementation; MCP health is a field, not a state machine | `01` §6 |
| P-05 | `ROLE-002`–`004`, `ENT-002` role assignment | Matrix rows retained as `denied`; no role administration; ROLE-001 treated as the implicit base role for a local account | `02` §3; `03` §4 |
| P-06 | `ENT-002/005/007/009/010/012/013/015/016/017/018` | Structurally required minimum only where an effective rule needs it; otherwise reserved | `01` §5 |
| P-07 | `CAND-001`–`023` | Not architecture inputs; mentioned only as candidates or deferred decisions | `00` §7; `architecture.md` §12 |
| P-08 | PRD goals, FRs, user stories | Candidate; no architecture commitment | `architecture.md` §2, §12 |

**Structural nuance.** `ENT-015` Run Step is marked proposed in the business model while `STATE-002` Run Step is effective. The architecture resolves this only as far as the effective rules require: a run-step record with an ordinal, a target reference, a status, and a result/error must exist because `BR-008` requires a visible failed step and skipped remaining steps. This is not a promotion of `STATE-003`–`006` and not a new business rule.

## 5. Architecture assumptions

| # | Assumption | Why it is needed | Dependency | Guardrail |
|---|---|---|---|---|
| A-01 | Run execution may occur after the run-creation request returns | `FLOW-003` N4 and `NFR-003` describe visible step status; no execution model is confirmed | `TBD-BIZ-007`; `TBD-INFRA-002/003` | Executor is a port; no queue, worker, or scheduler is selected |
| A-02 | One model endpoint is configured at deployment time; model configuration is not a product surface | `CAP-001` assumes a configured model; `CAP-010` is excluded | `TBD-INFRA-009` | Model configuration is not an entity with CRUD; the model boundary is a port with an egress gate |
| A-03 | Single workspace; no tenant concept or tenant isolation model | `CAP-023` excluded; `BR-007` self-hosted | Future commercial decision | No tenant identifier, no tenant isolation model, no cross-workspace query |
| A-04 | The conversation list is own-only and has no confirmed search, filter, or paging | `CAP-008` and `CAP-018` excluded | `TBD-BIZ-011` | No pagination or search contract; bounded read only |
| A-05 | Registry entries are prepared out of band; there is no confirmed in-product authority to create them | `TBD-BIZ-004` open; ROLE-001 has no create/publish | `TBD-BIZ-004` | No hidden admin or seed command; empty registries are valid |
| A-06 | Operational logs are not audit events | `TBD-BIZ-009` open; audit is excluded from the confirmed MVP | `TBD-BIZ-009` | No audit store, viewer, export, or retention; log fields minimized |
| A-07 | A disconnected client does not cancel an already created run or an accepted chat request | Interaction design says leaving a pending chat does not cancel it; run cancellation is not stated | Unregistered gap | No cancel command; run outcome remains readable |

## 6. Conflicts and unresolved boundaries

| # | Item | Current state | Architecture handling |
|---|---|---|---|
| C-01 | `CONFLICT-001` Auditor role | Open; ROLE-004 blocked | Keep the row `denied`; no audit read; no resolution |
| C-02 | `CONFLICT-002` Stage 5 meaning | Open; metadata-only | Cite `business_model.md`; do not decide stage numbering |
| C-03 | `README.md` "Chat with search" vs the business model's exclusion of search | `TBD-BIZ-011`; `CHL-005`; README is not P1 | Treat search as excluded; README is not a requirement source |
| C-04 | PRD §8 MVP is broader than the five confirmed CAPs | `TBD-BIZ-012` was open at authoring time; PRD is Draft | Business model wins; no search, audit, model configuration, or account administration |
| C-05 | Architecture is written before Gate 1 | `TBD-BIZ-012` was open at authoring time | All documents `Draft`; no accepted baseline claim; no irreversible stack choice |
| C-06 | RULE-001 file naming vs the hyphenated names in the stage request | RULE-001 has no documentation-naming exception | Use `snake_case` names; record the mapping in `CHG-010` and the folder README |

## 7. Gaps and open questions

The table separates an existing TBD from an unregistered gap. No new `TBD-*` or `CONFLICT-*` ID is created in this task. The last column names the document that consumes the gap.

| # | Gap | Why no effective rule covers it | Architecture consequence | Owner / next step | Consumed by |
|---|---|---|---|---|---|
| G-01 | Session termination, sign-out, idle expiry, re-authentication | `BR-001` creates a session but does not end it | Session boundary is explicit; no TTL, cookie, or sign-out control invented | Tech Lead to register if needed; `TBD-BIZ-004` may affect it | `03` §3 |
| G-02 | Duplicate run submission and lost run-start result | `BR-005` requires one run per initiation but does not define retry/dedup | A run-start command boundary and an idempotency extension point; no dedup window | Tech Lead; possibly `TBD-BIZ-007` | `02` §7, §10 |
| G-03 | Orphaned `Running` run after process restart | `NFR-012` covers completed runs only; no recovery rule | No automatic fail, resume, or retry; the gap is visible in operations | Tech Lead; `TBD-INFRA-003/004` | `01` §9; `03` §8 |
| G-04 | Registry population authority | `TBD-BIZ-004` open; ROLE-001 cannot create | Empty registries are valid; no hidden intake path; MVP not operable end-to-end | Product Owner (`TBD-BIZ-004`) | `01` §4; `02` §3 |
| G-05 | Owner/account display on registry records | `Account.read` is `denied`; `Skill.read`/`TaskDefinition.read` are read-only | No owner name, avatar, or account menu in read models | Tech Lead; permission interpretation | `02` §5; `03` §4 |
| G-06 | `McpTool` read and allowlist display | Matrix has `McpServer.read`, `McpTool.allowlist`, `McpTool.invoke`, but no `McpTool.read` | No tool-name listing or allowlist display; a tool-reference count is the maximum | Tech Lead; `TBD-BIZ-004` | `02` §5; `03` §6 |
| G-07 | Registry browsing, search, filter, paging at the proposed 500-item scale | No search/filter capability confirmed; `NFR-002` proposes 500 items | No paging/search contract; bounded list read; measurement point only | Product Owner (`TBD-BIZ-011`); Tech Lead for API | `02` §5; `03` §13 |
| G-08 | Audit events versus operational logs | `TBD-BIZ-009` open; `NFR-010` asks for structured logs | Log schema is operational; audit event is reserved | Product Owner (`TBD-BIZ-009`) | `03` §10 |
| G-09 | Secret reference storage and resolution | `ENT-010` proposed; `TBD-BIZ-003` open | Only a reference boundary; no credential value in any record or log | Product Owner (`TBD-BIZ-003`); `TBD-INFRA-009` | `03` §5–§6 |
| G-10 | Chat streaming transport | PRD `FR-001` proposes SSE; `CAP-001` and the interaction design do not require streamed text | Response boundary is transport-neutral; streaming is a candidate, not a contract | Product Owner (`TBD-BIZ-011`); `TBD-INFRA-001/002` | `02` §8 |
| G-11 | MCP server metadata fields available for the read side | `CAP-003` confirms recorded health; the other fields in `FLOW-005` are proposed | Minimal read record: name, recorded health, credential-reference presence; other fields only if the record carries them | Tech Lead; `TBD-BIZ-004` | `01` §5; `02` §5 |
| G-12 | Data classification, PII, retention, deletion | `TBD-BIZ-003`; `TBD-BIZ-014` | Boundaries and data flows only; no retention, encryption, PII, or compliance conclusion | Product Owner | `03` §5 |
| G-13 | Capacity and availability targets | `NFR-004`/`NFR-005` are TBD targets with suggested baselines | Measurement points only; no sizing or SLO | Product Owner (`TBD-BIZ-008`) | `03` §7 |
| G-14 | Backup and disaster recovery | `CAP-034` excluded; no RTO/RPO | Durability boundary only; no backup implementation or recovery objective | Product Owner / Tech Lead | `03` §8 |
| G-15 | MCP registration, OAuth, and tool invocation | `TBD-BIZ-007`; `FLOW-005` proposed | No MCP client, OAuth flow, or tool call; official spec informs the future boundary only | Product Owner (`TBD-BIZ-004/007`) | `architecture.md` §8 |

## 8. Official research

Each entry states the question, the official source, the conclusion, the project impact, and the adopt/reject reasoning. Research was limited to the points that affect the confirmed `ENT-008` MCP server registry and the explicit MCP/HITL decision. No general MCP tutorial, vendor blog, or third-party summary is used as authority.

### R-01 — What are the MCP host, client, and server, and what does a server expose?

- **Question:** Does the confirmed "MCP registry" require an MCP runtime, or only governance metadata?
- **Official sources:** [MCP architecture, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/architecture); [MCP server overview](https://modelcontextprotocol.io/specification/2026-07-28/server); [source: architecture](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/architecture/index.mdx).
- **Conclusion:** MCP follows a client–host–server architecture. A host creates multiple clients; each client talks to exactly one server; a server exposes three primitives: prompts (user-controlled), resources (application-controlled), and tools (model-controlled). The 2026-07-28 revision makes the protocol core stateless: each request carries its own protocol version and capabilities, and there is no `initialize`/session handshake. Capability discovery is optional via `server/discover`. Servers can be local processes or remote services.
- **Project impact:** `ENT-008` is an **internal governance record** about a server, not an MCP host, client, or server implementation. The confirmed `CAP-003` read side needs server identity and recorded health, not a protocol connection. No `prompts/list`, `resources/list`, `tools/list`, or `server/discover` call is in the MVP.
- **Adopt:** the vocabulary (host, client, server, prompts, resources, tools) and the separation between a registry record and a runtime connection.
- **Reject:** any MCP runtime, discovery call, transport, session, or capability negotiation in the MVP. The registry is not an MCP server and does not expose MCP primitives.
- **Revisit trigger:** `FLOW-005` or MCP tool invocation becomes effective through `TBD-BIZ-004` and `TBD-BIZ-007`.

### R-02 — What does MCP authorization require, and does it apply now?

- **Question:** If the workspace ever connects to an MCP server, what authorization boundary must the architecture reserve?
- **Official sources:** [MCP authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization); [authorization security considerations](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations); [source: authorization](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/index.mdx).
- **Conclusion:** Authorization is optional for MCP implementations. When an HTTP transport is used, the specification defines an OAuth 2.1 resource-server model: protected-resource metadata (RFC 9728), authorization-server discovery, resource indicators (RFC 8707), PKCE, issuer validation (RFC 9207), and token-audience binding. Tokens must be issued for the specific MCP server; token passthrough is forbidden; authorization is per request. The spec also warns about token theft, mix-up attacks, open redirection, and confused-deputy behavior.
- **Project impact:** The MVP has no MCP client and no connection test, so no OAuth flow, client registration, token store, or token validation is implemented. The architecture reserves a **credential reference** boundary for `ENT-008`/`ENT-010` and forbids credential values in records, logs, or responses. Any future MCP registration must add an authorization design before a connection is attempted.
- **Adopt:** the security boundary — no token passthrough, audience binding, no credential display, no credential value in a registry record.
- **Reject:** implementing OAuth, dynamic client registration, or a token store now. `FLOW-005` is proposed and `TBD-BIZ-004/007` are open.
- **Revisit trigger:** MCP registration or invocation becomes effective.

### R-03 — Is the official MCP Registry the right model for the internal registry?

- **Question:** Should the internal skill/MCP/task registry adopt the official MCP Registry API or `server.json` schema?
- **Official source:** [The MCP Registry](https://modelcontextprotocol.io/registry/about); [source](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/registry/about.mdx).
- **Conclusion:** The official MCP Registry is a public, centralized metadata repository for publicly accessible MCP servers. It uses namespace authentication (reverse-DNS names verified through GitHub or DNS), stores standardized `server.json` metadata, and is consumed mainly by downstream aggregators. It explicitly does **not** support private servers, is not designed for self-hosting, and is not intended to be consumed directly by host applications. Private servers should use a private registry.
- **Project impact:** hound-dock is a self-hosted internal workspace. Its `ENT-008` record is a private governance record with a workspace-unique server name; it is not a public namespace and must not depend on the official registry's API, `server.json`, or namespace verification. The official registry is not an integration for the MVP.
- **Adopt:** the separation between public discovery metadata and private governance; the idea that a registry record is metadata, not the server itself.
- **Reject:** the official registry API, `server.json` schema, public namespace rules, and any outbound registry fetch.
- **Revisit trigger:** the product owner asks for public MCP discovery or an import from the official registry (`CAP-025`/`CAP-028` are excluded, so this is not an MVP path).

### R-04 — Does MCP require a human in the loop for tool calls?

- **Question:** Does the official specification create an effective approval/HITL requirement now?
- **Official source:** [MCP tools, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/server/tools); [source](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx).
- **Conclusion:** MCP tools are model-controlled. The specification says there **SHOULD** always be a human in the loop with the ability to deny tool invocations; applications **SHOULD** show which tools are exposed, indicate invocation, and present confirmation prompts for operations. This is guidance (`SHOULD`), not a `MUST`. The same page requires servers to validate inputs, implement access controls, rate-limit invocations, and sanitize outputs; clients should confirm sensitive operations and validate results. Tool execution errors are distinct from protocol errors.
- **Project impact:** The MVP does not invoke tools: `McpTool.invoke` is `denied`, `CAP-036` is excluded, and `FLOW-005` is proposed. Therefore no tool-call confirmation, approval, interrupt, checkpoint, or resume flow is implemented. The MCP guidance is a **future re-entry trigger**, not an effective requirement.
- **Adopt:** the principle that a future tool invocation must have a human confirmation/denial boundary and a visible invocation record.
- **Reject:** implementing HITL now, and treating a `SHOULD` as a confirmed business rule. The current product has no effective human interruption/approval/resume flow.
- **Revisit trigger:** `FLOW-005` becomes effective, `McpTool.invoke` gains a grant, or `CAP-014` approval workflow enters the MVP.

### R-05 — What changed in the 2026-07-28 specification that could affect a future MCP boundary?

- **Question:** Are there protocol changes that would make a naive future MCP integration wrong?
- **Official sources:** [release post](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/blog/content/posts/2026-07-28-spec-ga/index.md); [architecture](https://modelcontextprotocol.io/specification/2026-07-28/architecture).
- **Conclusion:** The core is stateless; `initialize`/`initialized` and the session header are retired. Method and tool names can travel in `Mcp-Method` and `Mcp-Name` headers for routing. List responses carry cache hints and deterministic order. Server-to-client requests (sampling, elicitation, roots) move to Multi Round-Trip Requests. Authorization is hardened (issuer validation, client metadata documents, no token passthrough). Tasks, MCP Apps, and Enterprise Managed Authorization are extensions; Tasks is not the core protocol. Roots, Sampling, and Logging are deprecated; legacy HTTP+SSE is deprecated with an offramp.
- **Project impact:** If a future MCP client is built, it must target the current stateless core and the authorization boundary, not an older stateful/session design. The workspace's business task definitions (`ENT-011`/`ENT-012`) are **not** the MCP Tasks extension; the names collide but the concepts do not. The architecture must not reuse MCP Tasks semantics for the product's manual runs.
- **Adopt:** version-aware future integration; a clear naming separation between business tasks and the MCP Tasks extension.
- **Reject:** adopting the MCP Tasks extension, header routing, cache hints, or MRTR in the MVP.
- **Revisit trigger:** a future MCP runtime or approval flow is authorized.

### R-06 — HITL framework research (deliberate non-research)

No official HITL framework research is performed in this task, and no official link is cited for R-06 because no research question is authorized. The task's research rule limits official research to pending decisions; adding a framework link here would imply a comparison that is out of scope. The condition for researching interrupt/checkpoint/resume was "B considers it necessary and registers a TBD first". B does not: the confirmed MVP has no human interruption, approval, or resume flow; `FLOW-004`–`006` are proposed and denied; `CAP-014` approvals are excluded. The MCP tool guidance in R-04 is recorded as a future trigger only. If an approval or resumable-workflow requirement becomes effective, the Tech Lead should register a TBD and then research the official LangGraph human-in-the-loop material, including interrupt, checkpoint, resume, and idempotency semantics.

## 9. Research conclusions for the architecture

1. **MCP is a vocabulary and a future boundary, not an MVP dependency.** The confirmed registry is internal metadata plus recorded health. No MCP runtime, transport, discovery, or tool invocation is designed.
2. **The official MCP Registry is not the internal registry.** hound-dock is private and self-hosted; the official registry explicitly excludes private servers and self-hosting. No official registry API or schema is adopted.
3. **MCP authorization is a future obligation, not a current implementation.** The architecture reserves a credential-reference boundary and forbids credential values; it does not implement OAuth or token storage.
4. **MCP's human-in-the-loop guidance does not create an effective HITL requirement.** Tool invocation is excluded, so no approval or resume flow is implemented; the guidance becomes a re-entry trigger.
5. **The 2026-07-28 stateless core is the relevant future target.** A future integration must not assume sessions or the retired initialize handshake. The product's business tasks are distinct from the MCP Tasks extension.
6. **No research supports a stack choice.** The MCP material is protocol documentation; it does not select a language, framework, store, gateway, or hosting model.

## 10. Traceability to the architecture set

| Architecture document | Effective inputs | Proposed inputs | Assumptions / gaps | Research |
|---|---|---|---|---|
| `architecture.md` | All effective rows E-01–E-14 | P-01–P-08 as reserved | A-01–A-07; G-01–G-15 | R-01–R-06 summary |
| `01_domain_and_service_architecture.md` | E-01, E-03–E-10, E-12, E-14 | P-01–P-06 | A-01, A-03, A-05; G-02–G-04, G-11 | R-01, R-03 |
| `02_api_workflow_and_review.md` | E-02–E-07, E-10, E-13, E-14 | P-01–P-03, P-05, P-08 | A-01, A-04, A-07; G-02, G-05–G-07, G-10 | R-01, R-04 |
| `03_security_reliability_and_operations.md` | E-02, E-06, E-07, E-11, E-12 | P-02, P-05 | A-02, A-03, A-06; G-01, G-03, G-08–G-15 | R-02, R-03, R-04 |
| `04_architecture_review.md` | All rows as a checklist | All proposed rows as a promotion check | All assumptions/gaps as verifiable claims | Research conclusions as a consistency check |

## 11. Limitations

- The business model is `Draft`; Gate 1 acceptance is recorded in `CHG-021`, but this trace is not evidence of it.
- The interaction design is `Draft`; it is used for state and exception mapping, not as a backend specification.
- The PRD is `Draft`; every PRD-only statement remains candidate material.
- The MCP rendered site could not be fetched directly on 2026-10-18; the official repository source files were used. The rendered links are retained for verification.
- No MCP runtime, no external model call, no data set, and no production data were used.
- No new `TBD-*` or `CONFLICT-*` ID was created. G-01–G-15 are candidate gaps for the Tech Lead, not registry entries.
