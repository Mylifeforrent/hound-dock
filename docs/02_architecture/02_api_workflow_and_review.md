# API Workflow and Review — Interface Principles, Error Classes, and State Mapping

Status: Draft
Version: 0.1
As-of: 2026-10-18
Owner: Lead architecture agent for the Docs Agent
Document: `docs/02_architecture/02_api_workflow_and_review.md`
Change record: CHG-010 (Stage 3 backend architecture)
Business authority: `docs/01_product/business_model.md` v0.2 (`Draft`)
Interaction input only: `docs/03_design/interaction_design.md` v0.1 (`Draft`)
Contract owner: `docs/05_api/` — endpoints, paths, methods, status codes, request and response schemas, versioning, and the error payload shape.

| Field | Value | Tag |
|---|---|---|
| Scope | Interface principles, error classes, workflow sequencing, and the backend-outcome-to-interaction-state mapping for the confirmed MVP | `[SRC: CHG-010#Task Brief]` |
| Effective rules | CAP-001 to CAP-005; FLOW-001 to FLOW-003; STATE-001 and STATE-002; BR-001 to BR-008; ROLE-001 and the 18-column matrix | `[SRC: CHG-010#Plan]` |
| Proposed and reserved | FLOW-004 to FLOW-006; STATE-003 to STATE-006; ROLE-002 to ROLE-004; skill, MCP, and task authoring and registration paths | `[SRC: BM §4, §6, §7]` |
| Contract status | `docs/05_api/` is `Draft` and owns the contract; this document is an input to it, not a contract | `[SRC: docs/05_api/README.md#Boundaries]` |
| PRD acceptance | Not claimed; `TBD-BIZ-012` is Open | `[TBD-BIZ-012]` |

## 1. Purpose, scope, authority, and non-goals

### 1.1 Purpose

This document states how the interface boundary of the confirmed MVP behaves: which interactions are commands and which are queries, where each permission is enforced, what the server confirms and what it defers, how failures are classified and disclosed, how the chat and run workflows sequence without a transport, and how backend outcomes map to the nine interaction states. It is an architecture document. It is neither an API contract nor a UI specification.

### 1.2 In scope

- Interface principles and the command/query split (§2).
- The 18 matrix columns and their enforcement points (§3).
- Four interaction classes and what each confirms or defers (§4).
- The command and query surface at principle level, mapped to the domain catalog (§5).
- Seven error classes, their disclosure rules, recovery classes, and UI-state mapping (§6).
- Run and chat workflow sequencing without transport (§7, §8).
- The nine-state mapping for PG-001 to PG-009 (§9).
- Duplicate submission, stale status, session end, and non-disclosure guarantees and gaps (§10).
- The explicit deferral list for `docs/05_api/` (§11).
- Traceability, open items, gaps, and self-check (§12 to §14).

### 1.3 Non-goals

- No endpoint, path, request method, status code, request or response schema, interface-description document, event payload schema, or pagination parameter is defined here. `docs/05_api/` owns every one of them. `[SRC: docs/05_api/README.md#Purpose]`
- No stack, transport, framework, gateway, or store is selected. `TBD-INFRA-002`, `TBD-INFRA-003`, and `TBD-INFRA-009` are Open. `[TBD-INFRA-002]` `[TBD-INFRA-003]` `[TBD-INFRA-009]`
- No business rule, role, permission, entity, or state is added, and no `TBD` is answered or `CONFLICT` resolved. `[SRC: CHG-010#Plan]`
- No UI layout, component, or copy decision is made. Those belong to `docs/03_design/`. `[SRC: IXD §1.1]`
- No latency, retry, timeout, or deduplication-window value is introduced. `NFR-001` to `NFR-003` are referenced as proposed targets only. `[SRC: BM §9]` `[TBD-BIZ-008]`

### 1.4 Authority and the effective/proposed separation

| Class | Items | Treatment here | Tag |
|---|---|---|---|
| Effective rule | CAP-001 to CAP-005; FLOW-001 to FLOW-003; STATE-001, STATE-002; BR-001 to BR-008; ROLE-001 cells of the matrix | Drives every principle, surface, and mapping in this document | `[SRC: CHG-010#Plan]` |
| Proposed — reserved, not implemented | FLOW-004 to FLOW-006; STATE-003 to STATE-006; ROLE-002 to ROLE-004; skill publication, MCP registration and allowlisting, task authoring, `McpTool.invoke`, `Artifact.read`, `Audit.read` | Named only to state that it has no effective interface surface. No command, query, or error path is designed for it | `[TBD-BIZ-004]` `[TBD-BIZ-009]` |
| Deployment condition | BR-007 | Not an interface rule; carried by the deployment and operations architecture | `[SRC: BM §8 BR-007]` |

### 1.5 Document-local identifiers

This document assigns exactly four architecture-local identifier families, declared here and nowhere else: `IF-01` to `IF-04` (interaction classes), `ERR-01` to `ERR-07` (error classes), `MAP-01` to `MAP-09` (per-page state-mapping blocks), and `BGAP-01` to `BGAP-07` (unregistered gaps). They are architecture-local labels, not registry entries. They MUST NOT be cited as business rules, and they create no `TBD`, `CONFLICT`, `CAP`, `BR`, `ENT`, `STATE`, or `NFR`.

### 1.6 Architecture assumptions, labelled

Each item below is an **architecture assumption**, not a rule. It is recorded so a reviewer can reject it without disturbing the business model.

| Assumption | Basis | Effect if rejected | Tag |
|---|---|---|---|
| The run's step set is snapshotted from the recorded task version when the run is created | Entailed by "one recorded task version" plus the fixed step ordinals of ENT-012 and ENT-013; ENT-012 and ENT-013 are proposed entities used structurally | Run steps could change mid-run, and STATE-002's predecessor chain would be unsound | `[DERIVED: BR-005; BM §5.1 ENT-012, ENT-013]` |
| A completed assistant reply is persisted independently of the client connection | Not stated by BR-002; needed so "message retained on failure" and "read the persisted outcome on return" stay coherent | Session end during a reply could lose the reply; see BGAP-06 | `[DERIVED: BR-002; IXD §4.2]` |
| The seven error classes are complete for the PG-001 to PG-009 surfaces; an unclassified condition is ERR-07 | Derived from the effective flows and the interaction design's exception branches | `docs/05_api/` would need an additional class, which is its decision | `[DERIVED: §6; IXD §4.7]` |
| "Unconfirmed" is a disposition of ERR-06, not a success, a failure, or an eighth class | FLOW-003 F2 and IXD §5.4 require a state that is neither success nor failure | A separate outcome class would be needed in the contract | `[SRC: IXD §5.4]` |

## 2. Interface boundary principles

These principles constrain every surface in §5 and every error in §6. They are derived from the effective rules; they add no business rule.

### 2.1 Command and query are separated by effect

A **command** is an interaction that may change persisted state. It confirms acceptance and returns a reference to the affected aggregate, or a classified rejection. A **query** never changes state and returns a projection. The separation is about effect, not about wire shape: this document makes no claim about transport, batching, or whether a later contract expresses two surfaces as one call. `[DERIVED: BR-001, BR-002, BR-005 describe state-changing acts; BR-003, BR-004, BR-005 make a record the object of a read]`

A **reference** means the business reference defined by the entity's unique business key — the conversation reference for ENT-003, the run reference for ENT-014 — not a storage identifier. `[SRC: BM §5.1]`

### 2.2 The server is the authority; the client is a convenience

Every matrix conclusion is enforced at the server boundary, including cells the interface never renders. Visibility in the client is convenience, not authority: if an action is visible because a page rendered before a permission changed, the server's denial still wins. `[SRC: BM §6 default rule]` `[SRC: IXD §2.3 item 5]` NFR-007 states the proposed target as 100% server-side enforcement of the 18 columns and zero client-only checks. `[SRC: BM §9 NFR-007]`

No caller-supplied identity, owner reference, role, or permission flag is trusted. The actor is the account bound to the session by SYS-001. `[DERIVED: BR-001 binds the account as the actor]` An interface that accepted an owner identifier would create a bypass, so no such interface exists in this design.

### 2.3 No existence oracle

An interface must not disclose whether a resource the caller may not read exists. For own-only resources, **unknown** and **non-owned** produce the same external result, ERR-04, with no title, owner, state, count, or partial content. `[SRC: IXD §3.4, §5.5]` For an unrecorded registry reference the result is also ERR-04, because BR-003, BR-004, and BR-005 make the registry the record of what exists. `[SRC: BM §8 BR-003, BR-004, BR-005]`

### 2.4 Read-only and own-only mean different things

| Mode | Meaning | Enforcement | Projection rule | Matrix columns | Tag |
|---|---|---|---|---|---|
| `read-only` | Any authenticated session whose role holds the grant may read the collection or record; there is no ownership filter | Query filter for the grant only | Excludes owner attribution, because `Account.read` is `denied` and owner attribution is PII | `Skill.read`, `McpServer.read`, `TaskDefinition.read` | `[SRC: BM §6.2]` |
| `own-only` | The read is filtered to the session's account, and the filter is part of the query rather than a post-fetch check | Query filter scoped by the session-bound actor | No owner field is needed or shown; the reader is the owner | `Conversation.read`, `Message.read`, `Run.read`, `RunStep.read` | `[SRC: BM §6.2]` |

`read-only` is not public: it still requires an authenticated session and the grant. `own-only` is not "allow, then hide": a non-owned reference must not be retrieved and then filtered in the client. `[DERIVED: §3.2]`

### 2.5 Default deny, and proposed roles are denied

Every action is denied unless the effective matrix or a confirmed system condition grants it. `[SRC: BM §6]` ROLE-002, ROLE-003, and ROLE-004 are denied in every column, so a session bound to one has no operable surface: the interface returns ERR-03, not an empty list and not a partial page. `[SRC: BM §6.2]` `[SRC: IXD §2.1]` An empty registry is a valid state and is not an error, because no confirmed role may record an entry. `[SRC: IXD §1.4]`

### 2.6 Contract versioning is deferred

No version identifier, compatibility rule, deprecation policy, or negotiation mechanism is defined here. `docs/05_api/` owns versioning. `[SRC: docs/05_api/README.md#Purpose]` The only architectural constraint recorded is that a contract change must not silently change the meaning of an error class in §6 or of a state mapping in §9. `[DERIVED: §6, §9]`

## 3. Actors and permission boundary

### 3.1 Three enforcement points

| Enforcement point | Used for | Rule | Tag |
|---|---|---|---|
| **Application service** (command guard) | Commands, and actions with no implemented surface | The guard runs before any state change and returns a classified error on failure; where a capability is denied outright, no command exists, so the denial is structural | `[DERIVED: §2.2, §5]` |
| **Query filter** | Reads | The grant check and any owner scope are part of the query, so an out-of-scope row is never returned to the application layer for filtering | `[DERIVED: §2.4]` |
| **System check** | Preconditions performed by SYS-001, SYS-002, or SYS-004 | A precondition on a request, not a permission held by a person; it can only reject, never widen a role grant | `[SRC: BM §6.4]` |

### 3.2 The 18 matrix columns and their enforcement

ROLE-001 values are reproduced from the effective matrix. ROLE-002, ROLE-003, and ROLE-004 are `denied` in every column. `[SRC: BM §6.2]`

| # | Matrix column | ROLE-001 | Enforcement point | Enforcement note | Tag |
|---|---|---|---|---|---|
| 1 | `Account.read` | denied | Query filter, no projection | No member-visible account projection exists; the denial is structural and is asserted at the application service | `[SRC: BM §6.2.1]` |
| 2 | `Account.manage` | denied | Application service | No account command is implemented; CAP-021 is excluded | `[TBD-BIZ-004]` |
| 3 | `Conversation.chat` | own-only | Application service | Owner scope is taken from the session; a conversation not owned by the actor is rejected as ERR-04 | `[SRC: BM §8 BR-002]` |
| 4 | `Conversation.read` | own-only | Query filter | Actor-scoped; non-owned returns ERR-04 | `[SRC: BM §6.2.1]` |
| 5 | `Message.read` | own-only | Query filter | Scoped through the conversation's owner | `[SRC: BM §6.2.1]` |
| 6 | `Skill.read` | read-only | Query filter | Grant only, no owner scope, no owner attribution in the projection | `[SRC: BM §8 BR-003]` |
| 7 | `Skill.publish` | denied | Application service | No publish command exists; FLOW-004 is reserved | `[TBD-BIZ-004]` |
| 8 | `McpServer.read` | read-only | Query filter | Grant only; recorded health is readable, credential values are never projected | `[SRC: BM §8 BR-004]` |
| 9 | `McpServer.register` | denied | Application service | No registration command exists; FLOW-005 is reserved | `[TBD-BIZ-004]` |
| 10 | `McpTool.allowlist` | denied | Application service | No allowlist command exists | `[TBD-BIZ-004]` |
| 11 | `McpTool.invoke` | denied | System check, no command | SYS-005 invocation is also denied; no invocation path exists | `[TBD-BIZ-007]` |
| 12 | `TaskDefinition.read` | read-only | Query filter | Grant only; no owner attribution | `[SRC: BM §8 BR-005]` |
| 13 | `TaskDefinition.publish` | denied | Application service | No publication command exists; FLOW-006 is reserved | `[TBD-BIZ-004]` |
| 14 | `Run.initiate` | allowed | Application service plus SYS-004 system check | The check requires an active session, a recorded task, valid inputs, and manual initiation only | `[SRC: BM §8 BR-005, BR-006]` |
| 15 | `Run.read` | own-only | Query filter | Actor-scoped; non-owned returns ERR-04 | `[SRC: BM §6.2.1]` |
| 16 | `RunStep.read` | own-only | Query filter | Scoped through the run's initiator; covers the failed and skipped statuses BR-008 requires | `[SRC: BM §8 BR-008]` |
| 17 | `Artifact.read` | denied | Query filter, no projection | No artifact projection exists; artifact data classification is Open | `[TBD-BIZ-003]` |
| 18 | `Audit.read` | denied | Query filter, no projection | No audit projection exists; the audit obligation is Open | `[TBD-BIZ-009]` |

### 3.3 System checks are preconditions, not grants

| Actor | Check or action | Effect on the boundary | Tag |
|---|---|---|---|
| SYS-001 | Verify the local credential, create a session, bind the actor | Establishes the actor for every later check; grants no matrix cell by itself | `[SRC: BM §8 BR-001]` |
| SYS-002 | Verify the active session and non-empty message, call the model, append the assistant turn only on success | A system action inside BR-002; it cannot widen ROLE-001's own-only scope and cannot create a turn for a message it did not accept | `[SRC: BM §8 BR-002]` |
| SYS-004 | Verify inputs and session, create the run with the initiator, execute steps, finalize | Cannot create a run without a signed-in initiator and never from a schedule, webhook, or event | `[SRC: BM §8 BR-005, BR-006, BR-008]` |
| SYS-003 | Validate a registry entry: allowed; store a registry entry: denied | Validation exists, but no confirmed human submission authority, so no write path is exposed | `[SRC: BM §6.4]` |
| SYS-005 | Test a connection, invoke a tool, read a secret: all denied | No MCP runtime and no invocation surface exist in the MVP | `[SRC: BM §6.4]` |

A system check is performed even when the caller is the owner of the object. It is a precondition, never a substitute for the matrix. `[DERIVED: BR-005 requires both an attribution and valid inputs]`

### 3.4 Consequences carried into the interface

- No account identity is projected: the signed-in state is neutral, and no account name, avatar, or menu is derived from `Account.read`. `[SRC: IXD §2.3 item 1]`
- Registry projections omit owner attribution, because `Account.read` is `denied` while ENT-006 and ENT-011 carry owner attribution marked as PII. The ambiguity is BGAP-04. `[SRC: IXD §2.4, §8.2]`
- Read-only surfaces expose no write affordance at all; a disabled control would imply an authority no role holds. `[SRC: IXD §2.3 item 6]`
- A proposed role's session receives ERR-03 for every read and every write, including the registries. `[SRC: IXD §5.5]`

## 4. Interaction classes

| Class | Shape | Confirms | Defers | Examples | Tag |
|---|---|---|---|---|---|
| **IF-01** | Synchronous command returning a created or updated reference | That the command was accepted and the referenced aggregate exists in its initial or updated state | Every downstream effect, and the transport | Sign-in, create conversation, append user message, start manual run | `[DERIVED: §5]` |
| **IF-02** | Model-dependent reply completion | Nothing at acceptance; on completion, that exactly one assistant turn exists | When and how completion is delivered, and the provider | Request assistant reply | `[SRC: BM §8 BR-002]` |
| **IF-03** | Asynchronous run execution and status reads | Per read, the persisted run and step states at read time | When execution runs, what a step executes, and where state is persisted | Run progress and terminal outcome | `[SRC: BM §7.1, §7.2]` |
| **IF-04** | Read queries for registries and records | The projection as persisted at read time | Filtering, sorting, search, and paging, none of which is confirmed | Skills, MCP servers, tasks, own conversations, own run, own run steps | `[SRC: BM §8 BR-003, BR-004, BR-005]` |

### 4.1 What IF-01 confirms, and what it must not

IF-01 has three dispositions, and they are not interchangeable: **created** (a reference is returned), **rejected** (a classified error is returned), and **unconfirmed** (no definitive result is available). `[SRC: IXD §5.4]` The third is neither success nor failure, is reported as an ERR-06 disposition, and MUST NOT be retried blindly. It is BGAP-02 for the run case.

IF-01 confirms only that the work was accepted. "Run created" is not "run succeeded", and "message accepted" is not "answer received". `[SRC: IXD §5.7]`

### 4.2 What IF-02 defers

Reply completion may occur after the accepting interaction ends. The durable fact is the completed assistant turn, not the act of asking. The deferred dependencies are the model provider and its data boundary (`TBD-INFRA-009`, `TBD-BIZ-003`), the response threshold (`TBD-BIZ-008`), and the delivery mechanism, which is not selected. `[TBD-INFRA-009]` `[TBD-BIZ-003]`

NFR-008 (proposed) constrains conversation content sent to an external provider to zero bytes until the listed TBDs close. Until then, the IF-02 boundary cannot be exercised against an external model configuration, and this document does not resolve that tension. `[SRC: BM §9 NFR-008]`

### 4.3 What IF-03 defers

A run may execute after the creating command returns. Progress is observed through IF-04 reads, not assumed. The deferred dependencies are the step execution model (`TBD-BIZ-007`), the runtime (`TBD-INFRA-002`), the store (`TBD-INFRA-003`), and the visible-status threshold (`TBD-BIZ-008`). No scheduling, approval, branch, loop, or retry policy is introduced. `[TBD-BIZ-007]` `[SRC: BM §8 BR-006]`

### 4.4 What IF-04 defers

No registry search, filter, sort, or paging behaviour is confirmed. NFR-002 (proposed) names a large-item registry read, but no paging behaviour follows from it; the gap is BGAP-07. Whether list and get are one read or two is a contract decision for `docs/05_api/`, not an architectural one. `[SRC: BM §9 NFR-002]` `[TBD-BIZ-011]`

### 4.5 No transport commitment

No transport, delivery mechanism, framing, or connection model is selected. `TBD-INFRA-002` is Open, and the classes above are defined by effect and certainty, not by wire behaviour. `[TBD-INFRA-002]` Nothing in §5 to §10 depends on a transport choice.

## 5. Command and query surface at principle level

Each surface is stated as caller, permission, preconditions, success outcome, failure classes, state effect, and disclosure rule. No syntax, naming, or shape is decided. The domain catalog is the effective flow set only. `[SRC: BM §4 FLOW-001 to FLOW-003]`

| Surface | Class | Caller and permission | Preconditions | Success outcome | Failure classes | State effect | Disclosure rule | Tag |
|---|---|---|---|---|---|---|---|---|
| Sign-in | IF-01 | A person presenting a local credential; the BR-001 path, not a matrix cell | A local account exists; no external identity path is enabled | A session exists, is bound to the local account, and a session reference is returned | ERR-01, ERR-02, ERR-06 | Creates a session; creates no account and no conversation | One generic denial for any credential failure; no account-existence signal | `[SRC: BM §8 BR-001; FLOW-001]` |
| Create conversation | IF-01 | ROLE-001; `Conversation.chat` = own-only | Active session | A conversation owned by the actor exists with no messages; a reference is returned | ERR-02, ERR-06, ERR-07 | One conversation created; no lifecycle | Reference visible only to the owner; no count of other accounts' conversations | `[SRC: BM §8 BR-002]` |
| Append user message | IF-01 | ROLE-001; `Conversation.chat` = own-only | Active session; conversation owned by the actor; text non-empty | The message is accepted at a position and retained; acceptance is confirmed independently of any reply | ERR-01, ERR-02, ERR-04 (non-owned), ERR-05 (conversation not accepting), ERR-06 | One user message appended; no assistant turn | Message is retained; no model, provider, or reply status is disclosed | `[SRC: BM §8 BR-002; FLOW-002 N2]` |
| Request assistant reply | IF-02 | SYS-002 acting for ROLE-001; a system action under BR-002, scoped by the accepted message | An accepted user message; a configured model; the data boundary permits egress | Exactly one assistant turn appended and readable by the owner | ERR-06 (model, append, or boundary), ERR-07 | One assistant turn on success; zero on failure | No partial answer as complete; no provider name, raw error, or stack trace | `[SRC: BM §8 BR-002; FLOW-002 N3, N4, F2]` |
| Start manual run | IF-01 and IF-03 | ROLE-001; `Run.initiate` = allowed | Active session; task recorded; declared inputs valid; manual initiation only | One run in `Initiated` with one initiator and one recorded task version; a reference is returned | ERR-01, ERR-02, ERR-03, ERR-04 (unrecorded task), ERR-05, ERR-06 | Run created before any step executes | No outcome claim; the reference is visible only to the initiator | `[SRC: BM §8 BR-005, BR-006; FLOW-003 N2, N3]` |
| List own conversations | IF-04 | ROLE-001; `Conversation.read` = own-only | Active session | The actor's conversations, possibly zero | ERR-02, ERR-06, ERR-07 | None | No other account's conversation, count, or title | `[SRC: BM §6.2]` |
| Get own conversation | IF-04 | ROLE-001; `Conversation.read` and `Message.read` = own-only | Active session | The conversation's messages in append order | ERR-02, ERR-04, ERR-06 | None | Unknown and non-owned are the same result | `[SRC: BM §6.2; IXD §3.4]` |
| Get own run | IF-04 | ROLE-001; `Run.read` = own-only | Active session | The persisted run state, non-terminal or terminal | ERR-02, ERR-04, ERR-06 | None | Unknown and non-owned are the same result; no terminal state that was not persisted | `[SRC: BM §8 BR-008]` |
| List own run steps | IF-04 | ROLE-001; `RunStep.read` = own-only | Active session; run owned by the actor | Step rows with status, including `Failed` and `Skipped` | ERR-02, ERR-04, ERR-06 | None | The failed step is visible to the initiator; no other account's steps | `[SRC: BM §8 BR-008; FLOW-003 N7]` |
| List skills | IF-04 | ROLE-001; `Skill.read` = read-only | Active session | Recorded skills, possibly zero | ERR-02, ERR-03, ERR-06 | None | No owner, no lifecycle state, and no unrecorded entry | `[SRC: BM §8 BR-003]` |
| Get skill record | IF-04 | ROLE-001; `Skill.read` = read-only | Active session | The recorded skill's content | ERR-02, ERR-03, ERR-04, ERR-06 | None | No owner; no MCP tool names; an unrecorded name is No Result | `[SRC: BM §8 BR-003]` |
| List MCP servers | IF-04 | ROLE-001; `McpServer.read` = read-only | Active session | Recorded servers with recorded health | ERR-02, ERR-03, ERR-06 | None | No credential value, no tool names, and no resolved secret reference | `[SRC: BM §8 BR-004]` |
| Get MCP server record | IF-04 | ROLE-001; `McpServer.read` = read-only | Active session | Connection facts and a recorded tool-reference count | ERR-02, ERR-03, ERR-04, ERR-06 | None | No credential value; individual tool names withheld, per BGAP-05 | `[SRC: BM §8 BR-004; IXD §8.2]` |
| List task definitions | IF-04 | ROLE-001; `TaskDefinition.read` = read-only | Active session | Recorded tasks, possibly zero | ERR-02, ERR-03, ERR-06 | None | No owner; no schedule or trigger field | `[SRC: BM §8 BR-005]` |
| Get task definition and declared inputs | IF-04 | ROLE-001; `TaskDefinition.read` = read-only | Active session | The recorded task's declared input requirements and ordered step composition | ERR-02, ERR-03, ERR-04, ERR-06 | None | An unrecorded task is No Result; no owner | `[SRC: BM §8 BR-005; FLOW-003 N1]` |

Two categories have no effective counterpart and therefore no row above: every write to a registry, and every invocation or allowlist action. `[SRC: BM §6.2, §6.4]`

Message acceptance and the reply request are kept separable at the principle level even if a contract, or the domain architecture, models them as one command: acceptance must be confirmable independently of completion, and whether they are one contract operation is deferred to `docs/05_api/`. `[DERIVED: IF-01 and IF-02]`

## 6. Error model

### 6.1 Seven classes

| Class | Meaning | Disclosure rule | Recovery class | UI state mapping | Tag |
|---|---|---|---|---|---|
| **ERR-01** validation / input rejected | Input is missing, malformed, or fails a declared requirement, before any state change | May name the field and the unmet requirement; never echoes a credential; never discloses server internals | Correct and resend | Error, field-level, on PG-001, PG-002, and PG-008 | `[SRC: IXD §5.1]` |
| **ERR-02** unauthenticated / inactive session | The credential was rejected at sign-in, or the session is absent, ended, or invalid | One generic denial with no account-existence signal and no distinction between an unknown account and a wrong credential; on an authenticated page, a session-ended notice only | Retry at sign-in, or re-authenticate | Error on PG-001; No Permission disposition on an authenticated page, which routes to PG-001 | `[SRC: BM §8 BR-001, BR-002]` |
| **ERR-03** forbidden / no permission | No effective grant exists for an action whose resource class the caller can legitimately identify | May state that access is denied; must not name a role, owner, title, or count, and must not become an existence oracle | None, or operator escalation | No Permission | `[SRC: BM §6 default rule; IXD §5.5]` |
| **ERR-04** not found / non-disclosing unavailable | The referenced object does not exist, is not recorded, or is not readable by the caller | Identical for unknown and non-owned; no title, owner, state, count, or partial content; no raw identifier echo | Correct the reference, or return to a readable page | No Result | `[SRC: IXD §5.5, §5.7]` |
| **ERR-05** conflict / duplicate / state conflict | The request conflicts with persisted state, or repeats an operation already accepted: a conversation no longer accepting a message, a run already terminal, a duplicate submission | May state the conflict class and the current state where the caller may read it; must not produce a second aggregate and must not report a success that did not occur | Re-read the state, then decide; no automatic repeat | Error or Success-Failure, depending on whether the caller may read the resulting state | `[SRC: IXD §5.4]` |
| **ERR-06** dependency unavailable | A required dependency is unavailable, or its state cannot be determined: the model, the store, MCP metadata, or the outcome of an accepted command | May state that the operation could not be completed or confirmed; no provider, store, host, or stack detail; must never be converted into success or into a guessed terminal state. An unconfirmed outcome is this class with an explicit unconfirmed disposition | Retry when the dependency recovers, initiated by the person or the operator | Error; for run status, Error with the last reported state marked unavailable; for an unconfirmed start, Error with a do-not-retry instruction | `[SRC: IXD §5.2, §5.4]` |
| **ERR-07** internal / unexpected | A condition not classified above | A generic failure only; no internals; no partial record presented as complete | Operator escalation | Error | `[DERIVED: §1.6]` |

### 6.2 Error rules

1. **ERR-03 versus ERR-04.** An own-only read of another account's object MUST surface as ERR-04. ERR-03 is used only where the resource class is legitimately known and the grant is absent — a registry read by a role without the grant, or a proposed authoring surface. This distinction is what prevents a permission message from becoming an existence oracle. `[SRC: IXD §2.3 item 4]`
2. **ERR-05 is not a hiding place.** A conflict must not be reported when the true outcome is unknown; an unknown outcome is ERR-06 with the unconfirmed disposition. `[DERIVED: §1.6 assumption]`
3. **ERR-01 versus ERR-02 at sign-in.** A missing required input is ERR-01 and may name the field. A rejected credential is ERR-02 and never may. Both leave the caller on PG-001. `[SRC: IXD §5.1]`
4. **Nothing leaks.** No error discloses a secret value, a credential, whether an account exists, a provider or store internal, a stack trace, another account's data, or a record count the caller may not read. `[SRC: IXD §5.1 cross-form rule 5; §5.7]`
5. **No class implies an automatic retry.** Recovery is always initiated by a person or an operator. No retry count, interval, timeout, or backoff is defined here; `TBD-BIZ-008` owns timing. `[TBD-BIZ-008]`
6. **Recovery classes are qualitative.** "Correct and resend", "re-authenticate", "retry when the dependency recovers", "operator escalation", and "none" name a human decision, not a delivery mechanism.

## 7. Run workflow

### 7.1 Sequence, without transport

1. The caller submits a start with a task reference and declared inputs, within an active ROLE-001 session. `[SRC: BM §4 FLOW-003 N2]`
2. The application service checks: active session (ERR-02), manual initiation only (BR-006), task recorded (BR-005), inputs valid (ERR-01), and an initiator bound from the session. `[SRC: BM §8 BR-005, BR-006]`
3. On acceptance, exactly one run is created with one initiating account and one recorded task version, in `Initiated`, before any step executes. `[SRC: BM §8 BR-005; §7.1 STATE-001]`
4. The creating interaction returns the run reference and the `Initiated` state. It does not wait for a terminal outcome. `[DERIVED: IF-01 plus IF-03]`
5. Execution may proceed asynchronously. The run moves `Initiated` to `Running` when the first step starts; each step moves `Pending` to `Running` and then to `Succeeded` or `Failed`, or from `Pending` to `Skipped`. `[SRC: BM §7.1 STATE-001; §7.2 STATE-002]`
6. The run becomes terminal `Succeeded` only when every step succeeded, and terminal `Failed` when a step failed or timed out, or when the runner rejected the run before any step. `[SRC: BM §8 BR-008; §7.1]`
7. On failure, the failed step is recorded and visible to the initiator; remaining steps are `Skipped`; no later step runs. `[SRC: BM §8 BR-008; FLOW-003 F2]`
8. There is no automatic retry: no step is retried inside a run, and no new run is created automatically. `[SRC: BM §4 FLOW-003 failure and compensation]`
9. Recovery is a new run: a new reference, a new aggregate, one initiator, and one recorded task version taken at creation. The failed run is never mutated to hide a failure. `[SRC: BM §4 FLOW-003 C2; §8 BR-008]`
10. A terminal state is immutable; there is no transition out of `Succeeded` or `Failed`. `[SRC: BM §7.1]`

### 7.2 Run and step states across the interface

| Phase | Run state | Step states | Interface class | Confirmed by |
|---|---|---|---|---|
| Accepted | `Initiated` | all `Pending` | IF-01 returns the reference | `[SRC: BM §8 BR-005; §7.1]` |
| Executing | `Running` | at least one `Running`; earlier steps terminal | IF-03 plus IF-04 reads | `[SRC: BM §7.1, §7.2]` |
| Success | `Succeeded` | every step `Succeeded` | IF-04 read | `[SRC: BM §8 BR-008]` |
| Step failure | `Failed` | one `Failed`, remaining `Skipped` | IF-04 read | `[SRC: BM §8 BR-008; STATE-002]` |
| Rejected before any step | `Failed` | none recorded | IF-01 outcome, then IF-04 read | `[SRC: BM §7.1 STATE-001 Initiated to Failed]` |

Non-terminal states MUST NOT be presented as success or failure. A `Failed` run with no step results is a terminal, distinct outcome from a submission that created no run. `[SRC: IXD §4.3, §6.10]`

### 7.3 Unconfirmed run start

If the caller receives no definitive result, the run may or may not exist. The server MUST NOT fabricate a reference and MUST NOT claim failure. The caller MUST NOT retry blindly, because a second accepted start creates a second run and no rule makes a repeated request harmless. There is no run index to reconcile against, because CAP-009 is excluded. This is BGAP-02. `[SRC: IXD §5.4, §8.2]` `[DERIVED: BR-005 and BR-006 do not define reconciliation]`

### 7.4 Process restart and orphaned runs

No effective rule defines what happens to a non-terminal run when the executing process restarts or the executor is lost. NFR-012 (proposed) covers only completed runs remaining readable after a restart. `[SRC: BM §9 NFR-012]` This architecture does not invent resumption, a reaper, or an automatic transition to `Failed`. A run left non-terminal is a visible gap, not a success, and a later read must still report only the persisted state. This is BGAP-03.

### 7.5 Deferred execution semantics

Step execution is not effective until `TBD-BIZ-007` closes. No step type, prompt-only or tool-bearing step, linear or branching order, approval, loop, sandbox, or retry policy is defined here. Persistence and restart behaviour depend on `TBD-INFRA-003`. `[TBD-BIZ-007]` `[TBD-INFRA-003]`

## 8. Chat workflow

### 8.1 Sequence

1. A ROLE-001 session opens or creates its own conversation. `[SRC: BM §4 FLOW-002 N1]`
2. Append of a non-empty user message: an active session and an owned conversation are required; the message is retained immediately and is immutable after append. `[SRC: BM §8 BR-002]`
3. The reply request is a separate step. SYS-002 sends the context to the configured model only where the data boundary permits it. `[TBD-BIZ-003]` `[TBD-INFRA-009]`
4. On a successful response, exactly one assistant turn is appended. `[SRC: BM §8 BR-002]`
5. On a model failure, timeout, or append failure, no assistant turn is appended and an ERR-06 disposition is returned; the user message remains. `[SRC: BM §4 FLOW-002 F2]`
6. The client reads the conversation to determine the persisted outcome rather than inferring it. `[DERIVED: §2.1 query separation]`
7. A partial or invented answer is never presented as complete. `[SRC: BM §8 BR-002]`

### 8.2 Server guarantees

- **Retention.** An accepted user message remains after a model failure. `[SRC: BM §4 FLOW-002 failure and compensation]`
- **Exactness.** One successful model response produces exactly one assistant turn; a failure produces none. `[SRC: BM §8 BR-002]`
- **Per-message invariant.** The server appends at most one assistant turn for one accepted user message. The mechanism that identifies "one accepted message" — whether a request marker, a message identity, or something else — is not defined here, and no deduplication window, key, or replay marker is defined or implied. `[DERIVED: BR-002 exactness plus §10]`
- **Ordering.** The assistant turn follows the accepted message it answers; no invented reordering is permitted. `[DERIVED: BM §5.1 ENT-004]`
- **No fabrication.** No assistant turn exists without a successful response, and no turn is written partially and later completed in place. `[SRC: BM §8 BR-002]`

### 8.3 Duplicate send

Client-side suppression — one in-flight message per conversation, composer locked until terminal — is a design rule, not a server guarantee. `[SRC: IXD §5.4]` The server's obligation is the per-message invariant above. A repeated client request that is accepted as a new user message may legitimately produce a new assistant turn; distinguishing an accidental repeat from an intentional new message is undecided and is not inferred here. `[DERIVED: §10]`

### 8.4 Streaming boundary, not a streaming commitment

Streaming is **not** an effective requirement. NFR-001 is proposed, and its measurement point assumes an incremental delivery mechanism; that mechanism is not selected here. `[SRC: BM §9 NFR-001]` `[TBD-BIZ-008]`

The transport-neutral boundary is this: the durable unit is the *completed* assistant turn. Progress may be observed while a reply is pending, but a partial turn is never durable, never readable as an answer, and never presented as complete. A later incremental delivery mechanism can be added behind the same boundary without changing BR-002, because BR-002 constrains the appended turn rather than the delivery. No transport is committed to. `[DERIVED: BR-002]`

### 8.5 Session inactivity

An active session is required when a message is accepted. `[SRC: BM §8 BR-002]` What happens to an in-flight reply when the session ends is not stated by BR-002; the architecture assumption in §1.6 is that completion is persisted independently of the connection. If that assumption is rejected, the outcome is BGAP-06. A lost client connection is not evidence of success or of failure, and the caller must re-read the persisted conversation. `[DERIVED: §1.6]`

### 8.6 Conversation ownership

Conversations are single-owner. A reference to another account's conversation returns ERR-04, indistinguishable from an unknown reference. Sharing, mentions, and presence are excluded. `[SRC: BM §6.2]` `[CAP-032]`

## 9. Frontend nine-state mapping

Backend outcomes determine Default, Loading, Empty, No Result, Error, No Permission, Submitting, and Success-Failure. **Editing** has no backend outcome: it is client-owned unsent input, listed here only so no state is silently omitted. `[SRC: IXD §6.1]` This is a state mapping, not UI design; layout and copy remain in `docs/03_design/`. `[SRC: IXD §6]`

### 9.1 Interactive pages PG-001, PG-002, PG-008, PG-009

| Map | Page | Backend outcome | Interaction state | Note | Tag |
|---|---|---|---|---|---|
| MAP-01 | PG-001 | No command issued | Default | The form is ready with no session | `[SRC: IXD §6.2]` |
| MAP-01 | PG-001 | Sign-in accepted, verification pending | Submitting | No second activation is honoured | `[SRC: IXD §6.2]` |
| MAP-01 | PG-001 | Session established | Success-Failure | Success; the page is left behind | `[SRC: BM §8 BR-001]` |
| MAP-01 | PG-001 | ERR-02 denial, including an unknown account or a wrong credential; a future disabled-account path must use the same generic disposition, but no disable path exists today | Error | One generic disposition; no existence signal | `[SRC: IXD §5.7]` |
| MAP-01 | PG-001 | ERR-01 missing input | Error | Field-level, with the field named | `[SRC: IXD §5.1]` |
| MAP-01 | PG-001 | ERR-06 session store unavailable | Error | No session is created | `[SRC: BM §4 FLOW-001 F2]` |
| MAP-01 | PG-001 | Loading, Empty, No Result, No Permission, Editing | N/A | A static pre-session form retrieves no record and has no record reference; a failed credential is Error, not No Permission; editing is the Default form | `[SRC: IXD §6.2]` |
| MAP-02 | PG-002 | ERR-03 grant absent, as for a proposed role | No Permission | The workspace is not operable for that role | `[SRC: IXD §2.1]` |
| MAP-02 | PG-002 | Conversation or message read pending | Loading | Composer remains unavailable until the context loads | `[SRC: IXD §6.3]` |
| MAP-02 | PG-002 | Own conversation with messages | Default | Ordered thread | `[SRC: IXD §6.3]` |
| MAP-02 | PG-002 | No conversations, or a new conversation | Empty | Not an error | `[SRC: IXD §6.3]` |
| MAP-02 | PG-002 | Unknown or non-owned conversation reference | No Result | Identical panel; no title or owner | `[SRC: IXD §5.5]` |
| MAP-02 | PG-002 | ERR-02 inactive session | No Permission | The page routes to PG-001 | `[SRC: IXD §6.3]` |
| MAP-02 | PG-002 | ERR-06 list or message read failure | Error | Never an empty thread | `[SRC: IXD §5.2]` |
| MAP-02 | PG-002 | Message accepted, reply pending | Submitting | One pending assistant turn; no invented text | `[SRC: IXD §6.3]` |
| MAP-02 | PG-002 | Reply completed, one assistant turn | Success-Failure | Success; the composer unlocks | `[SRC: BM §8 BR-002]` |
| MAP-02 | PG-002 | ERR-06 model or append failure | Error | The user message is kept; no assistant turn | `[SRC: IXD §5.7]` |
| MAP-02 | PG-002 | ERR-05 conversation not accepting | Error | No second aggregate | `[DERIVED: §6.2]` |
| MAP-02 | PG-002 | Unsent composer text | Editing | Client-owned; no server outcome | `[SRC: IXD §6.1]` |
| MAP-08 | PG-008 | Task and declared inputs read pending | Loading | Start run unavailable until the record is known | `[SRC: IXD §6.9]` |
| MAP-08 | PG-008 | Recorded task with declared inputs | Default | Form ready | `[SRC: IXD §6.9]` |
| MAP-08 | PG-008 | ERR-04 unrecorded task reference | No Result | No run form is rendered | `[SRC: BM §8 BR-005]` |
| MAP-08 | PG-008 | ERR-03 grant absent | No Permission | No partial page | `[SRC: BM §6.2]` |
| MAP-08 | PG-008 | Start accepted, creation pending | Submitting | Inputs locked; no outcome shown | `[SRC: IXD §6.9]` |
| MAP-08 | PG-008 | Run created, reference returned | Success-Failure | Success means *created*, not *succeeded*; the page moves to PG-009 | `[SRC: IXD §4.3]` |
| MAP-08 | PG-008 | ERR-01 invalid declared inputs | Error | Entered values preserved | `[SRC: IXD §5.1]` |
| MAP-08 | PG-008 | ERR-05 duplicate or conflicting submission | Error | If a duplicate is detected as a conflict, no second run is created; if it is accepted as a new start, a second run may exist (BGAP-01) | `[DERIVED: §10]` |
| MAP-08 | PG-008 | ERR-06 with an unconfirmed outcome | Error | Neither success nor failure; do not retry blindly | `[SRC: IXD §5.4]` |
| MAP-08 | PG-008 | Empty, Editing | N/A for Empty; Editing is client-owned | A task with no declared inputs still renders a complete form; unsent input is a client state | `[SRC: IXD §6.9]` |
| MAP-09 | PG-009 | Run read pending | Loading | No step status shown as final | `[SRC: IXD §6.10]` |
| MAP-09 | PG-009 | `Initiated` or `Running` | Default | Non-terminal; must not be shown as an outcome | `[SRC: BM §7.1]` |
| MAP-09 | PG-009 | `Succeeded` or `Failed` | Success-Failure | Terminal; a failed step is visible and the rest are `Skipped` | `[SRC: BM §8 BR-008]` |
| MAP-09 | PG-009 | Unknown or non-owned run reference | No Result | No task, owner, state, or step disclosed | `[SRC: IXD §5.5]` |
| MAP-09 | PG-009 | ERR-03 grant absent, or ERR-02 | No Permission | The page is not operable | `[SRC: BM §6.2]` |
| MAP-09 | PG-009 | ERR-06 status read failure | Error | Keep the last reported state, mark it unavailable, never guess | `[SRC: IXD §5.2]` |
| MAP-09 | PG-009 | Empty, Editing, Submitting | N/A | A run normally has at least one step; a run rejected before any step is the recorded "no step results" case (§7.2), not a page Empty state; the page is read-only and submits nothing | `[SRC: IXD §6.10]` |

### 9.2 Read-only pages PG-003 to PG-007

| Map | Page | Default | Loading | Empty | No Result | Error | No Permission | Editing | Submitting | Success-Failure | Tag |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MAP-03 | PG-003 | Recorded skills present | Query pending | Zero recorded skills | N/A — no reference | ERR-06, never Empty | ERR-03 grant absent | N/A — read-only | N/A | N/A — read success is Default | `[SRC: IXD §6.4]` |
| MAP-04 | PG-004 | Recorded skill content | Record pending | N/A — a record resolves or does not | ERR-04 unrecorded | ERR-06 | ERR-03 grant absent | N/A — read-only | N/A | N/A | `[SRC: IXD §6.5]` |
| MAP-05 | PG-005 | Recorded servers with health | Query pending | Zero recorded servers | N/A — no reference | ERR-06 | ERR-03 grant absent | N/A — read-only | N/A | N/A | `[SRC: IXD §6.6]` |
| MAP-06 | PG-006 | Server facts and tool-reference count | Record pending | N/A — a record resolves or does not | ERR-04 unrecorded | ERR-06 | ERR-03 grant absent | N/A — read-only | N/A | N/A | `[SRC: IXD §6.7]` |
| MAP-07 | PG-007 | Recorded tasks with Run entry | Query pending | Zero recorded tasks | N/A — no reference | ERR-06 | ERR-03 grant absent | N/A — no inline editing | N/A — Run navigates to PG-008 | N/A | `[SRC: IXD §6.8]` |

### 9.3 Proposed pages

PG-010, PG-011, and PG-012 are proposed and denied for every role; their only effective state is No Permission, and no backend surface in §5 corresponds to them. `[SRC: IXD §6.11 to §6.13]` This document therefore assigns them no MAP block.

## 10. Duplicate submission, stale status, session end, and non-disclosure

| Concern | What the server must guarantee | What remains a gap | Tag |
|---|---|---|---|
| Duplicate chat send | At most one assistant turn per accepted user message; no automatic second model call; no reuse of a prior result as if it were new | The mechanism that identifies one accepted message is undecided, and no deduplication window is defined. A repeated accepted message may append a second user turn | `[DERIVED: §8.2]` |
| Duplicate run start | One run per accepted start command; no replay of an accepted command on the server's own initiative; a terminal run is never re-executed | Whether two distinct accepted commands from one intent are one submission or two is undecided. A blind retry can create a second run; BGAP-01 and BGAP-02 | `[DERIVED: BR-005, BR-006]` |
| No silent replay | The server does not re-execute a previously accepted command by itself, and does not return a stored prior success as a new result | No replay-marker mechanism is specified here; `docs/05_api/` may define one | `[DERIVED: §2.1]` |
| Stale status | A run read returns only the persisted state, and a terminal state is returned only if it was persisted; a read either returns state or fails with ERR-06 | How the client marks a state as not current is a design concern; no freshness field or version token is defined here | `[SRC: IXD §5.2]` `[SRC: BM §7.1]` |
| Session end | A command either completes its state change or changes nothing; an ended session yields ERR-02 and no partial write | Whether an in-flight reply survives session end depends on the assumption in §1.6; BGAP-06. Rollback semantics for accepted work are not stated by any rule | `[SRC: IXD §5.5]` |
| Non-disclosure | No existence oracle, no account identity, no owner attribution on read-only projections, no secret value, no provider or store internals, no count of objects the caller may not read | The owner-display and MCP tool-read interpretations are unresolved; BGAP-04 and BGAP-05 | `[SRC: IXD §8.2]` |

## 11. Explicit deferral list for `docs/05_api/`

Every item below is deliberately undecided here. `docs/05_api/` owns each one. `[SRC: docs/05_api/README.md#Purpose]`

| Deferred item | Why it is not decided here | Tag |
|---|---|---|
| Endpoints and paths | Contract syntax is not an architecture concern; `docs/05_api/` owns it | `[SRC: CHG-010#Plan]` |
| Methods and status codes | Selecting them would bind a transport that `TBD-INFRA-002` leaves open | `[TBD-INFRA-002]` |
| Request and response schemas | Field-level shape is a contract decision; this document states classes and rules only | `[SRC: CHG-010#Plan]` |
| Authentication header or cookie mechanics | Session carriage is a contract and security decision; this document states only that the actor is session-bound | `[SRC: docs/08_security/README.md]` |
| Pagination, filtering, sorting, and search parameters | No such capability is confirmed; BGAP-07 records the paging gap | `[TBD-BIZ-011]` |
| Contract versioning and compatibility | Deferred as a whole; see §2.6 | `[SRC: docs/05_api/README.md#Boundaries]` |
| Rate-limit headers and quota signalling | No rate or quota policy is confirmed; cost and budget are open separately under `TBD-BIZ-010` | `[TBD-BIZ-010]` |
| Error payload shape | This document owns the classes, not their representation | `[DERIVED: §6]` |
| Which surfaces are one call or several | Whether append-message and request-reply are one contract operation is a contract decision, provided acceptance is still confirmable independently | `[DERIVED: §5]` |
| Transport and delivery mechanism | Open; no commitment in §4 to §10 depends on it | `[TBD-INFRA-002]` |

## 12. Traceability matrix

### 12.1 Rules, flows, capabilities, and NFRs

| Source | Where this document addresses it | Tag |
|---|---|---|
| BR-001 | §3.3 SYS-001; §5 sign-in; §6 ERR-02; §9 MAP-01 | `[SRC: BM §8 BR-001]` |
| BR-002 | §2.4; §5 append and reply; §8; §10; §9 MAP-02 | `[SRC: BM §8 BR-002]` |
| BR-003 | §3.2 `Skill.read`; §5 skill reads; §6 ERR-04; §9 MAP-03, MAP-04 | `[SRC: BM §8 BR-003]` |
| BR-004 | §3.2 MCP columns; §3.3 SYS-005; §5 MCP reads; §9 MAP-05, MAP-06 | `[SRC: BM §8 BR-004]` |
| BR-005 | §3.2 `Run.initiate`; §5 start run; §7.1; §9 MAP-07, MAP-08 | `[SRC: BM §8 BR-005]` |
| BR-006 | §3.3 SYS-004; §5 start run; §7.1 step 2; §10 | `[SRC: BM §8 BR-006]` |
| BR-007 | No interface surface; a deployment condition carried by the operations architecture | `[SRC: BM §8 BR-007]` |
| BR-008 | §7.1 to §7.2; §9 MAP-09; §10 | `[SRC: BM §8 BR-008]` |
| FLOW-001 | §5 sign-in; §6 ERR-02; §9 MAP-01 | `[SRC: BM §4 FLOW-001]` |
| FLOW-002 | §8; §9 MAP-02; §10 | `[SRC: BM §4 FLOW-002]` |
| FLOW-003 | §7; §9 MAP-08, MAP-09; §10 | `[SRC: BM §4 FLOW-003]` |
| CAP-001 | §4 IF-02; §8 | `[SRC: BM §3.1 CAP-001]` |
| CAP-002 | §3.2 read-only skill reads; §5 skill surfaces | `[SRC: BM §3.1 CAP-002]` |
| CAP-003 | §3.2 MCP read; §5 MCP surfaces; §11 (no invocation) | `[SRC: BM §3.1 CAP-003]` |
| CAP-004 | §4 IF-03; §7; §9 MAP-08, MAP-09 | `[SRC: BM §3.1 CAP-004]` |
| CAP-005 | §3.3 SYS-001; §5 sign-in; §10 session end | `[SRC: BM §3.1 CAP-005]` |
| NFR-001 (proposed) | §4.2; §8.4 | `[SRC: BM §9 NFR-001]` |
| NFR-002 (proposed) | §4.4; §9.2 | `[SRC: BM §9 NFR-002]` |
| NFR-003 (proposed) | §7.2; §9 MAP-09 | `[SRC: BM §9 NFR-003]` |
| NFR-007 (proposed) | §2.2; §3.1 to §3.2 | `[SRC: BM §9 NFR-007]` |
| NFR-008 (proposed) | §4.2; §8.1 step 3 | `[SRC: BM §9 NFR-008]` |
| NFR-012 (proposed) | §7.4, as a durability limit rather than a guarantee | `[SRC: BM §9 NFR-012]` |

### 12.2 Matrix columns to enforcement point

| Enforcement point | Matrix columns | Authority |
|---|---|---|
| Application service | `Conversation.chat`, `Skill.publish`, `McpServer.register`, `McpTool.allowlist`, `TaskDefinition.publish`, `Run.initiate`, `Account.manage` | §3.2 |
| Query filter | `Account.read`, `Conversation.read`, `Message.read`, `Skill.read`, `McpServer.read`, `TaskDefinition.read`, `Run.read`, `RunStep.read`, `Artifact.read`, `Audit.read` | §3.2 |
| System check | `McpTool.invoke` (also denied at SYS-005); `Run.initiate` preconditions at SYS-004 | §3.2, §3.3 |

## 13. Open items and gaps

### 13.1 Referenced open items

No entry is redefined; each is a reference. `[SRC: open_items.md]`

| Item | Effect on this document | Tag |
|---|---|---|
| `TBD-BIZ-003` | Constrains MCP credential and artifact disclosure, owner attribution, and chat egress | `[TBD-BIZ-003]` |
| `TBD-BIZ-004` | Leaves the registries without a confirmed authority, so they can be legitimately empty and every write surface is denied | `[TBD-BIZ-004]` |
| `TBD-BIZ-007` | Leaves step execution, retry policy, and branching undefined; §7.5 defers them | `[TBD-BIZ-007]` |
| `TBD-BIZ-008` | Leaves all thresholds open; no latency, timeout, or retry value is used here | `[TBD-BIZ-008]` |
| `TBD-BIZ-009` | Leaves the audit obligation open, so `Audit.read` has no projection | `[TBD-BIZ-009]` |
| `TBD-BIZ-011` | Governs whether search, history, configuration, and file context enter the MVP; none is confirmed, so no query surface exists for them | `[TBD-BIZ-011]` |
| `TBD-BIZ-012` | No PRD acceptance is claimed; this document is `Draft` | `[TBD-BIZ-012]` |
| `TBD-INFRA-002` | No transport, framework, or delivery mechanism is selected | `[TBD-INFRA-002]` |
| `TBD-INFRA-003` | Persistence and restart behaviour are undecided, which bounds BGAP-03 | `[TBD-INFRA-003]` |
| `TBD-INFRA-009` | The model boundary, gateway, and residency are undecided, which bounds IF-02 | `[TBD-INFRA-009]` |
| `CONFLICT-001` | ROLE-004 is blocked; audit read remains denied | `[CONFLICT-001]` |
| `CONFLICT-002` | Stage naming is unresolved; it affects metadata only, not this document's content | `[CONFLICT-002]` |

### 13.2 Gaps without registry IDs

| Gap | Gap statement | Interim architectural position | Affected surfaces |
|---|---|---|---|
| **BGAP-01** | Duplicate manual run from a repeated or blind submission; no rule states whether a repeat is the same submission | One run per accepted command; no fabricated reference; no silent replay; the client is told not to retry blindly | PG-008, run workflow |
| **BGAP-02** | Unconfirmed run start: no rule defines reconciliation when the result of an accepted start is lost | Report an ERR-06 unconfirmed disposition, never success or failure; no reconciliation query exists | PG-008 |
| **BGAP-03** | Orphaned run after a process restart: no rule defines resumption, failure, or operator recovery for a non-terminal run | Report only persisted state; no invented terminal transition, reaper, or resumption | PG-009, run workflow |
| **BGAP-04** | Owner display: `Skill.read` and `TaskDefinition.read` are grant-only while `Account.read` is `denied`, and owner attribution is PII | Omit owner attribution from read-only projections | PG-003, PG-004, PG-007, PG-008 |
| **BGAP-05** | MCP tool read: the matrix has `McpServer.read`, `McpTool.allowlist`, and `McpTool.invoke` but no `McpTool.read` | Withhold individual tool names; expose only a tool-reference count or the target kind | PG-004, PG-005, PG-006, PG-009 |
| **BGAP-06** | Session end: no rule states sign-out, idle expiry, or the effect of session end on an in-flight reply | Reject new commands with ERR-02 and make no partial change; rely on the labelled assumption in §1.6 for in-flight completion | Global shell, PG-002 |
| **BGAP-07** | List paging at the proposed registry scale: NFR-002 names a large read and no paging or filtering behaviour is confirmed | No paging, filter, sort, or search parameter is defined; the read is stated without a paging model | PG-003, PG-005, PG-007 |

These gaps are architecture-local labels only. Registering them as `TBD` entries is the Tech Lead's decision, not this document's. `[SRC: CHG-010#Plan]`

### 13.3 Proposed and reserved

FLOW-004, FLOW-005, FLOW-006, STATE-003 to STATE-006, ROLE-002 to ROLE-004, and every authoring, registration, allowlisting, invocation, artifact, and audit surface are proposed and reserved. They have no command, query, error path, or state mapping in this document, and their absence is not an omission. `[SRC: CHG-010#Plan]`

## 14. Self-check and review disposition

| Criterion | Verdict | Evidence | Residual limit |
|---|---|---|---|
| No endpoint, path, method, status code, schema, interface-description document, or pagination parameter | Pass | §1.3, §5, §11 name only surfaces, classes, and rules; deferral is explicit | `docs/05_api/` must still author the contract |
| No stack, transport, framework, gateway, or store selected | Pass | §4.5, §11; `TBD-INFRA-002/003/009` stay Open | A later stage will select them |
| No TBD answered and no CONFLICT resolved | Pass | §13.1 references only; §1.3, §13.3 | `TBD-BIZ-004` still blocks an operable registry |
| Effective and proposed items separated | Pass | §1.4, §13.3; no §5 row or §9 MAP block exists for a proposed flow | Proposed conditional states cannot be exercised |
| Nine states mapped for the effective pages | Pass | §9.1 covers PG-001, PG-002, PG-008, PG-009; §9.2 covers PG-003 to PG-007; Editing is marked client-owned | PG-010 to PG-012 have no effective backend surface |
| Every normative claim traced | Pass | Tag columns throughout, with `BM`, `IXD`, `OI`, and `DERIVED` tags; §12 maps BR, FLOW, CAP, and NFR | No independent Verifier review has been performed |
| No numeric latency, retry, timeout, or deduplication window | Pass | NFR-001 to NFR-003 referenced as proposed; §6.2 rule 5; §8.2 | `TBD-BIZ-008` owns all thresholds |
| Architecture assumptions labelled and separable | Pass | §1.6 lists four assumptions with their rejection effects | Rejecting one changes a gap, not a rule |

**Review disposition.** This document is self-checked. The architecture review is recorded in `04_architecture_review.md`; the RULE-005 Verifier record remains pending and is outside this task's write scope. No PRD acceptance is claimed, and this document carries no `Frozen` status.
