# PRD — hound-dock Internal Agent Workspace

Status: Draft
Version: 0.2
As-of: 2026-10-18
Originating stage: Stage 2 — Product Definition
Owner: Docs Agent (PRD scope)
Decision owner: Product Owner (user)
Change record: `docs/13_changes/CHG-014-prd-v0.2.md`
Supersedes: v0.1 (`Draft`)
Refs: OBJ-001 to OBJ-003; CAP-001 to CAP-005; CAP-009; CAP-006 to CAP-036 as exclusions; BR-001 to BR-008; FLOW-001 to FLOW-006; PG-001 to PG-012; API-001 to API-015; NFR-001 to NFR-012; TBD-BIZ-003, TBD-BIZ-004, TBD-BIZ-005, TBD-BIZ-006, TBD-BIZ-007, TBD-BIZ-008, TBD-BIZ-009, TBD-BIZ-011, TBD-BIZ-012, TBD-BIZ-013, TBD-BIZ-014, TBD-BIZ-015; TBD-INFRA-004; CONFLICT-001, CONFLICT-002

Business authority: `docs/01_product/business_model.md` v0.3 (`Draft`) — the sole business authority for this PRD.
Interaction authority: `docs/03_design/interaction_design.md` v0.1 (`Draft`) — page architecture, nine-state matrix, and the §2.2 page/action permission matrix.
Interface authority: `docs/05_api/api_interface_spec.md` v0.1 (`Draft`) — endpoints, error classes and codes, projections, and the §15 conflict register.
Architecture references: `docs/02_architecture/architecture.md` v0.1 (`Draft`) and `docs/02_architecture/02_api_workflow_and_review.md` v0.1 (`Draft`) — IF-01 to IF-04 boundary, seven error classes, and state mapping.
Coverage reference: `docs/03_design/prototype/README.md` — the ✓/N/A page-state coverage table and its N/A reasons.

**Status note.** This is a `Draft` revision. The Gate 1 scope boundary is accepted (`TBD-BIZ-012` Resolved, option (b); `CHG-021`); roles, metrics, NFRs, and the execution model remain candidates. `TBD-BIZ-006` covers metrics, `TBD-BIZ-007` execution, and `TBD-BIZ-008` NFR thresholds; roles remain governed by the unresolved permission matrix and `CONFLICT-002`. Implementation is not authorized. See §19.

**Identifier note.** `AC-001` to `AC-057` are document-local acceptance-criteria identifiers. This note is their first use and declaration; their definitions are in §7. They are not registry entries and create no `TBD`, `CONFLICT`, `CAP`, `BR`, `ENT`, `STATE`, or `NFR`. `OBJ`, `CAP`, `BR`, `FLOW`, `PG`, `API`, and `NFR` identifiers are references to the source documents; this PRD defines none of them.

## 1. Document control and reading guide

### 1.1 Purpose

This PRD states the product requirements for the confirmed hound-dock MVP. It integrates four upstream views without redefining them: the business objectives, capabilities, and rules in `business_model.md`; the page states and permissions in `interaction_design.md`; the endpoint and error contract in `api_interface_spec.md`; and the interface boundary in the architecture documents.

It is a requirements document. It is not an architecture, API schema, data schema, UI specification, implementation plan, or stack decision.

### 1.2 What changed in v0.2

| Change | v0.2 position |
|---|---|
| Objectives | Replaced by `OBJ-001` to `OBJ-003`; no new goal or metric is introduced. `OBJ-004` and `OBJ-005` are retired and not reused. |
| MVP capabilities | `CAP-001` to `CAP-005`, plus `CAP-009` recorded separately as in scope but blocked. The exclusion register is `CAP-006` to `CAP-008` and `CAP-010` to `CAP-036` (30 capabilities). |
| Flows | `FLOW-001` to `FLOW-003` are the confirmed spine across `PG-001` to `PG-009`. `FLOW-004` to `FLOW-006` are recorded as Proposed only, with no implementation acceptance criteria. |
| Page states | The nine names from `interaction_design.md` §6.1 are used for every page-state reference. The per-page ✓/N/A table matches `prototype/README.md`. |
| Permissions | The `interaction_design.md` §2.2 matrix is quoted cell by cell, with default deny. The Admin divergence is marked `[CONFLICT]`. |
| Interfaces | Every one of `API-001` to `API-015` is cited by at least one acceptance criterion, and an AC↔API↔PG coverage table is added. |
| Removed material | `US-02` (search with citations), `US-07` (audit usage), `US-09` (model-provider configuration), and the old §13 permission matrix are not carried over. |
| Acceptance | The old §19 acceptance conditions are withdrawn. Gate 1 scope boundary accepted (`TBD-BIZ-012` Resolved, `CHG-021`); the document remains `Draft` and authorizes no implementation. |

### 1.3 Reading guide and required-theme map

| Required theme | Section |
|---|---|
| Objectives and context | §2 |
| Capability list | §3 |
| Flows and key interactions | §4 |
| States, exceptions, and permissions | §5 |
| Data and interface linkage | §6 |
| Acceptance criteria | §7 |
| Out of scope | §8 |
| NFRs and acceptance status | §9 and §19 |

Reading order: §2 for the objectives and context; §3 for the MVP boundary; §4 and §5 for flows, pages, states, and permissions; §6 and §7 for the interface coverage and acceptance criteria; §8 for exclusions; §9 and §19 for quality targets and status.

### 1.4 What this PRD does not do

- It does not add a page, role, page state, error code, capability, or business rule.
- It does not resolve a `TBD` or a `CONFLICT`.
- It does not define endpoints, request or response schemas, storage, tables, migrations, interface elements, visual measurements, or an implementation stack.
- It does not select a stack, store, gateway, hosting model, or CI.
- It does not promote a Proposed flow or a candidate surface to a requirement.
- It does not authorize implementation, deployment, or data handling.

### 1.5 Status vocabulary

| Term | Meaning in this PRD |
|---|---|
| `Draft` | The document is not reviewed, not frozen, and not accepted. |
| `Resolved` / `Open` | The status recorded for a referenced `TBD` or `CONFLICT` in `docs/00_setup/open_items.md`. The PRD cites the status as-is. |
| `Proposed` | A flow or surface that is not effective. It has no implementation acceptance criterion in this PRD. |
| `Blocked` | A capability whose MVP scope is settled but whose page or interface surface is not covered. It is a capability status, not a page state. |
| `[CONFLICT]` | A recorded divergence between authoritative sources. Both sides are cited; neither is chosen. |
| `[TBD-xxx]` | A reference to an open decision. It is never used as a settled value. |

The only page-state names used in this PRD are `Default`, `Loading`, `Empty`, `No Result`, `Error`, `No Permission`, `Editing`, `Submitting`, and `Success-Failure`. `Blocked` is not a page state. Entity lifecycle names from `business_model.md` §7 are not page states and are not used as page-state tags.

## 2. Objectives and context

### 2.1 Context

hound-dock is a self-hosted internal workspace for one team. A signed-in member chats with an assistant, reads the governed skill and MCP registries, and initiates a manual run of a recorded task definition. The MVP is the strict internal baseline: one workspace, local accounts, no vendor-hosted control plane, no external model egress, and no public or multi-tenant surface. `[SRC: business_model.md#Appendix B.1; BR-007]`

The product scope is set by `CAP-001` to `CAP-005` and by `CAP-009` as a separately recorded audit capability. The audit capability is in scope under Appendix B.4 but has no page and no endpoint; §3.2 records that block. `[SRC: business_model.md#Appendix B.4, B.6]`

The product does not replace the team's external model or MCP services. It governs the workspace surfaces named by the confirmed capabilities and records their boundaries. `[SRC: business_model.md#§1, §3, Appendix B]`

### 2.2 Objectives

Exactly three objectives are effective. This PRD adds none. Each objective keeps the target and measurement status of the business model; the target value is `TBD-BIZ-006`. `[SRC: business_model.md#§2; TBD-BIZ-006]`

| OBJ | Outcome | Metric | Baseline | Target | Measurement and guardrail |
|---|---|---|---|---|---|
| **OBJ-001** | A signed-in member can get an AI answer in a workspace conversation. | Weekly share of signed-in members with at least one assistant response. | Not measured; no workspace is deployed. | `TBD-BIZ-006`; suggested ≥ 60% of members by week 4 (not a commitment). | Conversation records; distinct accounts with at least one assistant message divided by accounts with a session; weekly. Guardrail: 0 secret values in responses or logs; 0 external data-boundary breaches (`TBD-BIZ-003`). |
| **OBJ-002** | Team know-how and governed tools are recorded once and reused from the workspace. | Recorded skills and recorded MCP servers, plus weekly selections or invocations per recorded entry. | 0 recorded entries; no registry exists. | `TBD-BIZ-006`; suggested ≥ 5 recorded skills and ≥ 2 recorded servers by week 4, with ≥ 1 selection or invocation per recorded entry per week (not a commitment). | Registry records joined to selection or invocation records; weekly. Guardrail: 0 skills offered outside the registry; 0 credential values exposed; 0 non-allowlisted tool calls (`TBD-BIZ-004`, `TBD-BIZ-007`). |
| **OBJ-003** | Recurring work is defined once and run manually with an observable outcome. | Manual runs per week and task success rate excluding input errors. | 0 runs; no task definitions exist. | `TBD-BIZ-006`; suggested ≥ 20 runs per week and ≥ 90% success rate by week 4 (not a commitment). | Run records; count terminal runs; success means every step succeeded; weekly. Guardrail: 0 runs without an initiating account (BR-006); 0 scheduled or externally triggered runs. |

### 2.3 Measurement limits

- `OBJ-001` cannot be measured below a deployed workspace.
- The reuse half of `OBJ-002` depends on skill or tool invocation, which is `CAP-036` and outside the confirmed MVP. Until that boundary changes, only the count of recorded entries is measurable. `[SRC: business_model.md#§2]`
- `OBJ-003` cannot be measured below a first recorded task definition. `TBD-BIZ-005` supplies the first integrations and tasks, so it is a measurement dependency. `[TBD-BIZ-005]`
- No target, baseline, time window, or measurement frequency is confirmed. All targets are `TBD-BIZ-006`; the suggested values are not commitments. `[TBD-BIZ-006]`

### 2.4 No new objectives or metrics

`OBJ-004` and `OBJ-005` from v0.1 are retired. `OBJ-004` is absorbed into `OBJ-003`; `OBJ-005` is carried by `BR-001`, `BR-007`, and `CAP-005`. Neither retired identifier is reused. This PRD introduces no additional objective, metric, or go-live threshold. `[SRC: business_model.md#§2, §10.4]`

## 3. Capability list

### 3.1 MVP capabilities

The confirmed MVP is `CAP-001` to `CAP-005` plus `CAP-009`. The five capabilities in this table are tied to at least one business rule; `CAP-009` is recorded separately in §3.2 because its scope is settled but its surface is not covered. `[SRC: business_model.md#§3.1, Appendix B.6]`

| CAP | Capability | Boundary | BR | API | PG | AC |
|---|---|---|---|---|---|---|
| **CAP-001** | Chat | A signed-in member starts or continues a conversation and receives one assistant message on a successful model response. Skill invocation, tool calls, search, citations, file context, model choice, and chat-history actions are outside this capability. | BR-002; BR-001 for access | API-002 to API-006 | PG-002 | AC-009 to AC-021 |
| **CAP-002** | Skill registry | Recorded skills are visible; an unrecorded skill is neither listed nor resolvable. Creating, editing, publishing, deprecating, and invoking a skill are outside the confirmed read-only surface. Admin authoring is `[CONFLICT]`; see §10.2. | BR-003 | API-007, API-008 | PG-003, PG-004 | AC-022 to AC-027 |
| **CAP-003** | MCP registry | Recorded MCP servers and their recorded health are visible; a tool call to an unrecorded server is denied. Registration, allowlisting, connection tests, and tool invocation are outside the confirmed scope. | BR-004 | API-009, API-010 | PG-005, PG-006 | AC-028 to AC-035 |
| **CAP-004** | Task definitions and manual runs | A recorded task definition can be run manually by a signed-in member. The run has one initiator and one recorded task version. A failed step produces a failed, visible run. Scheduling, approval, branching, retries, and task authoring are outside the confirmed scope. Step execution semantics remain `TBD-BIZ-007`. | BR-005; BR-006; BR-008 | API-011 to API-015 | PG-007, PG-008, PG-009 | AC-036 to AC-057 |
| **CAP-005** | Self-hosted deployment with local accounts | The workspace runs on team-controlled infrastructure and authenticates only local accounts. No vendor-hosted multi-tenant control plane is required. SSO, invitations, account recovery, and account administration are outside the confirmed scope. | BR-001; BR-007 | API-001 | PG-001 | AC-001 to AC-008 |

### 3.2 CAP-009 audit — in scope, blocked, surface not covered

`CAP-009` is in the MVP under Appendix B.4. Its recorded scope is an append-only audit capability with these events: sign-in success and failure; skill created, published, deprecated, discarded; task created, published, retired, discarded; run initiated, succeeded, failed; audit read. The actor is the signed-in account for a human action and a system actor for a terminal run transition. Audit is read-only for Admin, with no export, and retention is 365 days. `[SRC: business_model.md#Appendix B.4]`

**Status: Blocked — scope settled, surface not covered.** `CAP-009` has no page in `interaction_design.md` and no endpoint in `API-001` to `API-015`. The interaction design states that no audit page exists (§1.3), and the API contract records the audit surface as an unsourced operation (API §15 CF-12). This PRD therefore records no `PG`, no `API`, and no `AC` for `CAP-009`. It does not create an audit page, an audit endpoint, or a placeholder. The scope block is also marked `[CONFLICT]` in §10.3. `[SRC: interaction_design.md#§1.3; api_interface_spec.md#§15 CF-12]`

`CAP-009` is not one of the `CAP-006` to `CAP-036` exclusions. With `CAP-001` to `CAP-005`, it makes the six-capability MVP recorded in Appendix B.6; it differs from the other five only in that its page and endpoint are absent.

### 3.3 Capability-to-rule mapping

| BR | Capability | Basis |
|---|---|---|
| BR-001 | CAP-005 | Local-account authentication only. |
| BR-002 | CAP-001 | Signed-in chat with response integrity. |
| BR-003 | CAP-002 | The skill registry is the record of offered skills. |
| BR-004 | CAP-003 | The MCP registry is the record of usable servers. |
| BR-005 | CAP-004 | A recorded task definition and an attributed manual run. |
| BR-006 | CAP-004 | Manual initiation only. |
| BR-007 | CAP-005 | Self-hosted operation without a vendor control plane. |
| BR-008 | CAP-004 | A failed step produces a failed, visible run. |

No MVP capability is without a BR, and no BR is without a capability. `[SRC: business_model.md#§8, §10.2]`

### 3.4 Exclusions

`CAP-006` to `CAP-036` are the exclusion range, with `CAP-009` carved out as in scope under Appendix B.4. The exclusion register therefore covers `CAP-006` to `CAP-008` and `CAP-010` to `CAP-036`, for 30 excluded capabilities. The authoritative boundary, rationale, displaced MVP item, and re-entry trigger for each are in `business_model.md` §3.2; this PRD does not restate them. The 30 identifiers are listed in §8.1. `[SRC: business_model.md#§3.2, §3.3, Appendix B.6]`

## 4. Flows and key interactions

### 4.1 Confirmed flow spine

`FLOW-001`, `FLOW-002`, and `FLOW-003` are the only confirmed flows. Their page spine is `PG-001` to `PG-009`. `[SRC: business_model.md#§4; interaction_design.md#§3.3, §4.1 to §4.3]`

| FLOW | Status | Pages | BR | API | AC |
|---|---|---|---|---|---|
| **FLOW-001** Local sign-in and session | Confirmed | PG-001 → PG-002 | BR-001 | API-001 | AC-001 to AC-008 |
| **FLOW-002** Chat message and assistant response | Confirmed | PG-002 | BR-002 | API-002 to API-006 | AC-009 to AC-021 |
| **FLOW-003** Manual task run | Confirmed for initiation and outcome | PG-007 → PG-008 → PG-009 | BR-005, BR-006, BR-008 | API-011 to API-015 | AC-036 to AC-057 |

`FLOW-003` is confirmed for run creation, attribution, and terminal outcome. The step execution model, including what a step executes, remains `TBD-BIZ-007`; this PRD writes no step-type, branching, or retry requirement. `[SRC: business_model.md#§4 FLOW-003; TBD-BIZ-007]`

### 4.2 Key interactions

| Interaction | Page and state path | API | BR | AC |
|---|---|---|---|---|
| Local sign-in | PG-001 Submitting → PG-001 Success-Failure or PG-001 Error | API-001 | BR-001 | AC-001 to AC-007 |
| Chat send and reply | PG-002 Submitting → PG-002 Success-Failure or PG-002 Error | API-005, API-006 | BR-002 | AC-013 to AC-018 |
| Registry read | PG-003, PG-004, PG-005, PG-006, PG-007 Default; PG-004 and PG-006 No Result | API-007 to API-012 | BR-003, BR-004, BR-005 | AC-022 to AC-039 |
| Run submission | PG-008 Submitting → PG-008 Success-Failure or PG-008 Error | API-013 | BR-005, BR-006 | AC-040 to AC-049 |
| Run outcome | PG-009 Default → PG-009 Success-Failure or PG-009 Error | API-014, API-015 | BR-008 | AC-050 to AC-057 |

The page spine is not a navigation requirement beyond the routes already stated by the interaction design. No new page or route is added. `[SRC: interaction_design.md#§3.1, §3.2, §3.4]`

### 4.3 Proposed flows — no implementation ACs

`FLOW-004`, `FLOW-005`, and `FLOW-006` are Proposed and not effective. They are recorded for traceability only. `[SRC: business_model.md#§4; interaction_design.md#§4.4 to §4.6]`

| FLOW | Status | Pages | Effective surface today | Why not effective |
|---|---|---|---|---|
| **FLOW-004** Skill registration and publication | Proposed — not effective | PG-003, PG-004 read side; PG-010 No Permission only | Recorded skills are readable under BR-003. No create, edit, test, or publish action is effective. | Admin publication is `[CONFLICT]` between Appendix B.3 and the interaction design/API; no side is chosen. `[TBD-BIZ-004]` |
| **FLOW-005** MCP server registration and allowlisting | Proposed — not effective | PG-005, PG-006 read side; PG-011 No Permission only | Recorded servers and recorded health are readable under BR-004. No registration, test, allowlist, or invocation action is effective. | Registration and allowlisting are outside the confirmed MVP and denied for every role. `[TBD-BIZ-004]` |
| **FLOW-006** Task definition and publication | Proposed — not effective | PG-007, PG-008 run side; PG-012 No Permission only | A recorded task can be read and run under BR-005. No task create, test-run, or publish action is effective. | Task authoring is `[CONFLICT]`; execution is `TBD-BIZ-007`. `[CONFLICT]` |

**No implementation acceptance criteria.** No AC in §7 references `FLOW-004`, `FLOW-005`, `FLOW-006`, `PG-010`, `PG-011`, or `PG-012`. No AC requires skill authoring, MCP registration or allowlisting, or task authoring. The proposed flows do not add a requirement, a page, or a write path. `[SRC: interaction_design.md#§4.4 to §4.6; §3.5]`

### 4.4 Flow boundaries

- No scheduler, cron, webhook, event trigger, approval step, branch, loop, or automatic retry is part of any confirmed flow. `[SRC: business_model.md#§4, §8 BR-006; CAP-006, CAP-012, CAP-014]`
- A failed run is not retried in place. Recovery is a new user action and a new run. `[SRC: business_model.md#§4 FLOW-003; BR-008]`
- A run is reached from the submission that created it. No run index or audit page exists. `[SRC: interaction_design.md#§3.1, §4.3]`
- No search, citation, file-context, or model-selection step is part of a confirmed flow. `[SRC: CAP-008, CAP-010, CAP-011]`

## 5. States, exceptions, and permissions

### 5.1 The nine page states

The page states are exactly those defined by `interaction_design.md` §6.1. No additional page state is introduced. `[SRC: interaction_design.md#§6.1]`

| State | Meaning used here |
|---|---|
| **Default** | The steady state with recorded data or with the primary form ready. |
| **Loading** | The page or its record is being retrieved; the layout is reserved and no count is shown as 0. |
| **Empty** | The page is valid but contains no records or no messages. This is not an error. |
| **No Result** | A business reference in the route does not resolve, or the requested record is not available. |
| **Error** | Retrieval, submission, or status reporting failed; the page offers a recovery or a route back. |
| **No Permission** | The role, ownership, or authority denies the page or the action; no data is disclosed. |
| **Editing** | The person has unsent input, or a conditional draft exists. |
| **Submitting** | An operation is in flight; the primary control is disabled and duplicate activation is ignored. |
| **Success-Failure** | The terminal outcome of the page's operation, including run success and run failure. |

`Blocked` is not a page state. It is used only for the `CAP-009` capability status in §3.2. Run and run-step values such as `Succeeded`, `Failed`, and `Skipped` are business data displayed inside the `Success-Failure` page state; they are not page-state names and are never used as page-state tags.

### 5.2 Per-page state coverage

The table matches `prototype/README.md` row for row. A `✓` means the state is specified by `interaction_design.md` §6; `N/A` means the state cannot occur on that page and is explained in §5.3. `[SRC: prototype/README.md#State coverage; interaction_design.md#§6.2 to §6.14]`

| Page | Default | Loading | Empty | No Result | Error | No Permission | Editing | Submitting | Success-Failure |
|---|---|---|---|---|---|---|---|---|---|
| **PG-001** Sign in | ✓ | N/A | N/A | N/A | ✓ | N/A | ✓ | ✓ | ✓ |
| **PG-002** Chat | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **PG-003** Skills registry | ✓ | ✓ | ✓ | N/A | ✓ | ✓ | N/A | N/A | N/A |
| **PG-004** Skill record | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | N/A | N/A | N/A |
| **PG-005** MCP registry | ✓ | ✓ | ✓ | N/A | ✓ | ✓ | N/A | N/A | N/A |
| **PG-006** MCP server record | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | N/A | N/A | N/A |
| **PG-007** Tasks registry | ✓ | ✓ | ✓ | N/A | ✓ | ✓ | N/A | N/A | N/A |
| **PG-008** Task run | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **PG-009** Run outcome | ✓ | ✓ | N/A | ✓ | ✓ | ✓ | N/A | N/A | ✓ |
| **PG-010** Skill editor (proposed) | ✓ (No Permission only) | N/A | N/A | N/A | N/A | ✓ | N/A | N/A | N/A |
| **PG-011** MCP server editor (proposed) | ✓ (No Permission only) | N/A | N/A | N/A | N/A | ✓ | N/A | N/A | N/A |
| **PG-012** Task definition editor (proposed) | ✓ (No Permission only) | N/A | N/A | N/A | N/A | ✓ | N/A | N/A | N/A |

The three proposed editors have no effective operation; their only reachable effective state is `No Permission`. They have no implementation AC in this PRD. `[SRC: interaction_design.md#§6.11 to §6.13; §3.5]`

### 5.3 N/A reasons

Every N/A cell above has a reason. The reasons match the prototype coverage table. `[SRC: prototype/README.md#State coverage]`

| Page | N/A states | Reason |
|---|---|---|
| PG-001 | Loading, Empty, No Result, No Permission | The page is a static form. It retrieves no record, has no collection, has no record reference or search, and is the pre-session entry. A failed credential is Error, not a page permission. |
| PG-003, PG-005 | No Result, Editing, Submitting, Success-Failure | The list has no query or filter; an unrecorded reference resolves on the record page. There is no inline editing or mutating operation, and read success is Default while read failure is Error. |
| PG-004, PG-006 | Empty, Editing, Submitting, Success-Failure | A record either resolves or does not; a missing field is a field-level absence, not a page Empty state. The record is read-only and has no mutating action. |
| PG-007 | No Result, Editing, Submitting, Success-Failure | The list has no query or filter; an unrecorded task resolves on PG-008. There is no inline editing. Run navigates to PG-008, where submission is owned, and read success and failure are Default and Error. |
| PG-008 | Empty | A task with no declared inputs still renders a complete run form. No tasks is Empty on PG-007; an unrecorded task is No Result. |
| PG-009 | Empty, Editing, Submitting | A run has at least one step by invariant; a rejected run shows "No step results" as a field-level absence. The run is read-only, and Start a new run navigates to PG-008. |
| PG-010 to PG-012 | Loading, Empty, No Result, Error, Editing, Submitting, Success-Failure | Effective N/A: no authorized operation can start, no draft is created, no draft exists to resolve, and no validation or authoring operation can run. The only reachable effective state is No Permission. |

No N/A state is used in an acceptance criterion for that page. §7 applies this rule.

### 5.4 Exceptions and destinations

Every confirmed exception maps to a page state that is ✓ on that page, or to the product boundary where no page exists. No new page is introduced for an exception. `[SRC: interaction_design.md#§4.1 to §4.3, §4.7]`

| Flow | Exception | Page state or destination | Source |
|---|---|---|---|
| FLOW-001 | Invalid credential | PG-001 · Error | BR-001; FLOW-001 F1 |
| FLOW-001 | Session-store failure | PG-001 · Error | BR-001; FLOW-001 F2 |
| FLOW-001 | Account help unavailable | Product boundary; no page (CAP-021 excluded) | FLOW-001 C1; TBD-BIZ-004, TBD-BIZ-013 |
| FLOW-002 | Zero-length message | PG-002 · Error | BR-002; FLOW-002 F1 |
| FLOW-002 | Inactive session | PG-001 · Error, then PG-002 | BR-001, BR-002; FLOW-002 F1 |
| FLOW-002 | Model, timeout, or append failure | PG-002 · Error | BR-002; FLOW-002 F2 |
| FLOW-003 | Unrecorded task | PG-008 · No Result | BR-005; FLOW-003 F1 |
| FLOW-003 | Invalid declared inputs | PG-008 · Error | BR-005; FLOW-003 F1 |
| FLOW-003 | Inactive session | PG-001 · Error, then PG-007 | BR-001, BR-005; FLOW-003 F1 |
| FLOW-003 | No run created | PG-008 · Error | BR-005; FLOW-003 F2 |
| FLOW-003 | Run created and rejected before any step | PG-009 · Success-Failure | BR-008; FLOW-003 F2 |
| FLOW-003 | Step failure or timeout | PG-009 · Success-Failure | BR-008; FLOW-003 F2, N7 |
| FLOW-003 | Terminal outcome not reported | PG-009 · Error | BR-008; FLOW-003 F2 |
| FLOW-004 to FLOW-006 | Proposed flows | PG-010 to PG-012 · No Permission only; no implementation AC | interaction_design.md §4.4 to §4.6 |

`PG-008 · No Result` and `PG-009 · Success-Failure` are valid states on those pages. `PG-001 · Error` covers both a rejected credential and a session-ended route. No exception uses `PG-003 · No Result`, `PG-005 · No Result`, or `PG-007 · No Result`, because those states are N/A on those pages.

### 5.5 Roles and permissions

#### Roles

The only roles are `ROLE-001` to `ROLE-004`. No new role is introduced. `[SRC: business_model.md#§6.1]`

| Role | Status in the effective matrix | Effective reach |
|---|---|---|
| **ROLE-001** Member | Confirmed | Sign in; create and continue own conversations; read the three registries; initiate a manual run of a recorded task; read the outcome of a run they initiated. |
| **ROLE-002** Admin | Proposed in the §2.2 matrix; effective for some grants in Appendix B.3 | The §2.2 matrix denies every Admin cell. Appendix B.3 grants skill/task publication, all-run read, and audit read. The divergence is `[CONFLICT]`; see §10.2. |
| **ROLE-003** Author | Proposed; denied in every §2.2 cell | No effective grant. |
| **ROLE-004** Auditor | Proposed; denied in every §2.2 cell | No effective grant. `CONFLICT-001` is Resolved toward Admin audit read; see §10.4. |

There is no role selector, impersonation control, or role-assignment flow in the MVP. The interface does not render an account name, owner name, avatar, or account menu because `Account.read` is denied in the §2.2 matrix. `[SRC: interaction_design.md#§2.3, §2.4]`

#### Permission matrix

The following matrix is quoted cell by cell from `interaction_design.md` §2.2. The four values are `allowed`, `denied`, `own-only`, and `read-only`. No cell is blank. `[SRC: interaction_design.md#§2.2]`

| Page or action | ROLE-001 Member | ROLE-002 Admin (proposed) | ROLE-003 Author (proposed) | ROLE-004 Auditor (proposed) | Source |
|---|---|---|---|---|---|
| PG-001 Local sign-in | allowed (local account) | allowed (local account) | allowed (local account) | allowed (local account) | BR-001; FLOW-001 |
| PG-002 Conversation list and own conversation | own-only | denied | denied | denied | BR-002; BM §6.2 |
| PG-002 Send a message | own-only | denied | denied | denied | BR-002; FLOW-002 |
| PG-003, PG-004 Skill read | read-only | denied | denied | denied | BR-003 |
| PG-003 Skill create, edit, publish, deprecate | denied | denied | denied | denied | BR-003; `TBD-BIZ-004` |
| PG-005, PG-006 MCP server read | read-only | denied | denied | denied | BR-004 |
| PG-005 MCP server register, test, allowlist, retire | denied | denied | denied | denied | BR-004; `TBD-BIZ-004` |
| PG-006 MCP tool invoke | denied | denied | denied | denied | BR-004; BM §6.2 |
| PG-007, PG-008 Task definition read | read-only | denied | denied | denied | BR-005 |
| PG-008 Initiate a manual run | allowed | denied | denied | denied | BR-005; BR-006 |
| PG-009 Own run outcome and own run steps | own-only | denied | denied | denied | BR-008; BM §6.2 |
| PG-009 Another account’s run outcome | denied | denied | denied | denied | BM §6.2; own-only rule |
| PG-010 Skill authoring and publication | denied | denied | denied | denied | BR-003; `TBD-BIZ-004` |
| PG-011 MCP registration and allowlisting | denied | denied | denied | denied | BR-004; `TBD-BIZ-004` |
| PG-012 Task authoring and publication | denied | denied | denied | denied | BR-005; `TBD-BIZ-004` |
| Run artifact read or download | denied | denied | denied | denied | BM §6.2; `TBD-BIZ-003` |
| Audit read or export | denied | denied | denied | denied | BM §6.2; `TBD-BIZ-009` |
| Account read or manage | denied | denied | denied | denied | BM §6.2; `TBD-BIZ-004` |

The Source column is quoted as-is; it may cite a `TBD` whose registry status is now `Resolved`. The status and the surface divergence are in §10.

#### Default deny

Every action not granted by the matrix is `denied`. A visible control is not a grant. If a page rendered before a permission changed, the server's denial wins and the page makes no partial change. `[SRC: business_model.md#§6 default rule; interaction_design.md#§5.5; api_interface_spec.md#§4.2]`

No permission in this table is inferred from a Proposed flow. The matrix remains the source for every permission conclusion. `[SRC: business_model.md#§6.2; interaction_design.md#§2.2]`

#### Admin cells are `[CONFLICT]`

Appendix B.3 and B.4 make Admin effective for skill/task publication, all-run read, and audit read; Appendix B.5 makes the skill and task version lifecycles effective. The §2.2 matrix quoted above still denies every Admin cell and renders PG-010 to PG-012 as `No Permission` only. The API contract exposes no authoring or audit endpoint and records the divergence as §15 CF-01. The cells above are quoted unchanged; this PRD takes no side. The full conflict statement is in §10.2. `[SRC: business_model.md#Appendix B.3 to B.5; interaction_design.md#§2.1, §2.2; api_interface_spec.md#§15 CF-01]`

## 6. Data and interface linkage

### 6.1 Effective interface surface

There are exactly 15 effective endpoints, `API-001` to `API-015`. Each is tied to a business reference or entity, at least one acceptance criterion, and at least one page state. No endpoint exists for `CAP-009`, `FLOW-004`, `FLOW-005`, or `FLOW-006`. The AC-level tag mapping is in §7; this table is the endpoint-level roll-up. `[SRC: api_interface_spec.md#§5.1, §5.3]`

| API | Method and path | Entity and business reference | Data class | AC | PG · state | BR |
|---|---|---|---|---|---|---|
| **API-001** | `POST /api/auth/sign-in` | Account (ENT-001) is verified; a session is created, not a new account. Business key: local sign-in name. | Sensitive sign-in name and credential; credential is write-only and never returned. | AC-001 to AC-007 | PG-001 · Success-Failure; PG-001 · Error; PG-001 · Submitting; PG-001 · Default | BR-001 |
| **API-002** | `POST /api/conversations` | Conversation (ENT-003); `conversation_ref`. | Sensitive reference. | AC-009 | PG-002 · Empty | BR-002 |
| **API-003** | `GET /api/conversations` | Conversation (ENT-003); own conversations only. | Sensitive reference per item; Internal count. | AC-010, AC-020, AC-021 | PG-002 · Default; PG-002 · Loading; PG-002 · Error | BR-002 |
| **API-004** | `GET /api/conversations/{conversation_ref}` | Conversation (ENT-003) and Message (ENT-004); `position`. | Sensitive reference and message text. | AC-011, AC-012 | PG-002 · No Result; PG-002 · Default | BR-002 |
| **API-005** | `POST /api/conversations/{conversation_ref}/messages` | Message (ENT-004); `(conversation_ref, position)`. | Sensitive message text; request-only. | AC-013, AC-014, AC-019 | PG-002 · Submitting; PG-002 · Error; PG-002 · Editing | BR-002 |
| **API-006** | `POST /api/conversations/{conversation_ref}/messages/{position}/reply` | Message (ENT-004); one assistant turn for one accepted member message. | Sensitive message text; no assistant text in the response. | AC-015 to AC-018 | PG-002 · Success-Failure; PG-002 · Error | BR-002 |
| **API-007** | `GET /api/skills` | Skill (ENT-006) and Skill Version (ENT-007); `skill_name`. | Sensitive name, description, version label. | AC-022, AC-023, AC-026, AC-027 | PG-003 · Empty; PG-003 · Default; PG-003 · Loading; PG-003 · Error | BR-003 |
| **API-008** | `GET /api/skills/{skill_name}` | Skill (ENT-006) and Skill Version (ENT-007); `skill_name`. | Sensitive name, description, instructions, input definition, version label. | AC-024, AC-025 | PG-004 · No Result; PG-004 · Default | BR-003 |
| **API-009** | `GET /api/mcp-servers` | MCP Server (ENT-008); `server_name`. | Sensitive server name; Internal recorded health. | AC-028, AC-029, AC-031, AC-032, AC-035 | PG-005 · Default; PG-005 · Empty; PG-005 · Error | BR-004 |
| **API-010** | `GET /api/mcp-servers/{server_name}` | MCP Server (ENT-008); `server_name`. | Sensitive server name and endpoint reference; Internal recorded health. | AC-030, AC-033, AC-034 | PG-006 · No Result; PG-006 · Default | BR-004 |
| **API-011** | `GET /api/tasks` | Task Definition (ENT-011) and Task Version (ENT-012); `task_name`. | Sensitive name, description, version label; Internal step count. | AC-036, AC-037, AC-038, AC-045 | PG-007 · Default; PG-007 · Empty; PG-007 · Loading | BR-005 |
| **API-012** | `GET /api/tasks/{task_name}` | Task Definition (ENT-011), Task Version (ENT-012), Task Step (ENT-013); `task_name` and `ordinal`. | Sensitive name, description, input definition, target label. | AC-039, AC-044 | PG-008 · Default; PG-008 · Loading | BR-005 |
| **API-013** | `POST /api/runs` | Run (ENT-014), Run Step (ENT-015), Task Version (ENT-012); `run_reference`. | Sensitive run reference, task name, version label, inputs. | AC-040 to AC-043, AC-046 to AC-049 | PG-008 · Submitting; PG-008 · Success-Failure; PG-008 · Error; PG-008 · No Result; PG-008 · Editing; PG-008 · Default | BR-005, BR-006 |
| **API-014** | `GET /api/runs/{run_reference}` | Run (ENT-014); `run_reference`. | Sensitive run reference, task name, version label; Internal state. | AC-050, AC-053, AC-054, AC-055 | PG-009 · Default; PG-009 · Success-Failure; PG-009 · Error; PG-009 · No Result | BR-008 |
| **API-015** | `GET /api/runs/{run_reference}/steps` | Run Step (ENT-015); `(run_reference, ordinal)`. | Sensitive target label, duration, result and error summaries; Internal state. | AC-051, AC-052, AC-056, AC-057 | PG-009 · Success-Failure; PG-009 · Default | BR-008 |

No endpoint returns an owner, initiator, account identifier, credential, token, secret reference, tool name, step parameter, or audit field. The data-boundary baseline is Internal and Sensitive, with no Highly Sensitive data; retention is 90/180/365 for conversations and messages, runs and run steps, and audit events. `[SRC: business_model.md#Appendix B.2; api_interface_spec.md#§12.2, §12.3]`

### 6.2 Orphan check

| Check | Result |
|---|---|
| `API-001` to `API-015` each cited by at least one AC | Pass; §6.1 lists 15 of 15. |
| Any API outside `API-001` to `API-015` | None. No additional API identifier is defined. |
| Any endpoint for `CAP-009` audit | None; `CAP-009` is blocked, not an endpoint gap. |
| Any endpoint for `FLOW-004`, `FLOW-005`, or `FLOW-006` | None; the flows are Proposed and have no implementation AC. |
| Any endpoint for search, citations, model configuration, cost, scheduling, or account management | None; each is excluded in §8. |

No endpoint is orphaned. No acceptance criterion depends on an endpoint that the API contract does not define. `[SRC: api_interface_spec.md#§5.1, §5.2, §5.3]`

### 6.3 Data boundary

This PRD adds no data field, classification, retention period, or deletion rule. It cites the enterprise-internal baseline: Internal and Sensitive data only; no Highly Sensitive data; conversations and messages 90 days, runs and run steps 180 days, audit events 365 days; TLS in transit and encryption at rest; no message content, sign-in name, endpoint reference, tool name, or credential in operational logs. `[SRC: business_model.md#Appendix B.2]`

The retention job, deletion trigger, encryption algorithm, key management, and masking rules remain later design under the Stage 1 baseline and the security folder. This PRD issues no compliance conclusion; `TBD-BIZ-014` remains Open. `[TBD-BIZ-014]`

## 7. Acceptance criteria

### 7.1 Conventions

`AC-001` to `AC-057` are document-local identifiers, declared in the header identifier note and defined here. Each criterion is binary: it passes only if the stated condition is observed, and it fails otherwise. Each row contains one condition. `Pass` or `Fail` is recorded by a third party against the row, not inferred from another row.

Tags:

- Every AC carries one `BR-xxx`.
- An AC that exercises an interface carries the relevant `API-xxx`.
- A UI-visible AC carries exactly one `PG-xxx · state-name` tag. The state must be `✓` on that page in §5.2 and must not be `N/A` there.
- The non-UI ACs are AC-003, AC-006, AC-008, and AC-049. They carry no `PG` tag.
- No AC is written for `CAP-009`, `PG-010`, `PG-011`, or `PG-012`.
- No AC uses `Blocked` as a state. `Blocked` is a capability status.

### 7.2 Sign-in and local accounts

| AC | Tags | Pass condition |
|---|---|---|
| **AC-001** | `[BR-001]` `[API-001]` `[PG-001 · Success-Failure]` | Pass iff a correct credential for a local account opens PG-002. |
| **AC-002** | `[BR-001]` `[API-001]` `[PG-001 · Error]` | Pass iff a rejected credential leaves the person on PG-001 in the Error state. |
| **AC-003** | `[BR-001]` `[API-001]` | Pass iff a rejected credential creates no session. |
| **AC-004** | `[BR-001]` `[API-001]` `[PG-001 · Error]` | Pass iff the same error text is returned when the sign-in name is unknown as when the sign-in name is known with a wrong credential. |
| **AC-005** | `[BR-001]` `[API-001]` `[PG-001 · Submitting]` | Pass iff the Sign in control is disabled while the sign-in request is in flight. |
| **AC-006** | `[BR-001]` `[API-001]` | Pass iff a sign-in request carrying an external identity assertion field is rejected with the contract's invalid-input response. |
| **AC-007** | `[BR-001]` `[API-001]` `[PG-001 · Default]` | Pass iff PG-001 renders no SSO control. |
| **AC-008** | `[BR-007]` | Pass iff the deployment requires no vendor-hosted multi-tenant control plane. |

### 7.3 Chat

| AC | Tags | Pass condition |
|---|---|---|
| **AC-009** | `[BR-002]` `[API-002]` `[PG-002 · Empty]` | Pass iff a newly created conversation contains no messages. |
| **AC-010** | `[BR-002]` `[API-003]` `[PG-002 · Default]` | Pass iff PG-002 lists only conversations owned by the signed-in account. |
| **AC-011** | `[BR-002]` `[API-004]` `[PG-002 · No Result]` | Pass iff an unknown conversation reference returns the same panel as a conversation owned by another account. |
| **AC-012** | `[BR-002]` `[API-004]` `[PG-002 · Default]` | Pass iff the messages of an opened own conversation appear in append order. |
| **AC-013** | `[BR-002]` `[API-005]` `[PG-002 · Submitting]` | Pass iff the composer is disabled while a sent message is pending. |
| **AC-014** | `[BR-002]` `[API-005]` `[PG-002 · Error]` | Pass iff a zero-length message is rejected without creating a user turn. |
| **AC-015** | `[BR-002]` `[API-006]` `[PG-002 · Success-Failure]` | Pass iff exactly one assistant message is appended for one accepted user message. |
| **AC-016** | `[BR-002]` `[API-006]` `[PG-002 · Error]` | Pass iff a model failure appends no assistant message. |
| **AC-017** | `[BR-002]` `[API-006]` `[PG-002 · Error]` | Pass iff an accepted user message remains visible after a model failure. |
| **AC-018** | `[BR-002]` `[API-006]` `[PG-002 · Error]` | Pass iff the model-failure error text contains no provider name. |
| **AC-019** | `[BR-002]` `[API-005]` `[PG-002 · Editing]` | Pass iff leaving PG-002 with unsent text opens the discard confirmation. |
| **AC-020** | `[BR-002]` `[API-003]` `[PG-002 · Loading]` | Pass iff the composer is disabled until the conversation context has loaded. |
| **AC-021** | `[BR-002]` `[API-003]` `[PG-002 · Error]` | Pass iff a failed conversation-list read renders Error rather than Empty. |

### 7.4 Skill registry

| AC | Tags | Pass condition |
|---|---|---|
| **AC-022** | `[BR-003]` `[API-007]` `[PG-003 · Empty]` | Pass iff zero recorded skills renders the Skills registry Empty state. |
| **AC-023** | `[BR-003]` `[API-007]` `[PG-003 · Default]` | Pass iff every skill rendered on PG-003 is recorded. |
| **AC-024** | `[BR-003]` `[API-008]` `[PG-004 · No Result]` | Pass iff an unrecorded skill name renders the No Result state. |
| **AC-025** | `[BR-003]` `[API-008]` `[PG-004 · Default]` | Pass iff PG-004 renders no edit control. |
| **AC-026** | `[BR-003]` `[API-007]` `[PG-003 · Loading]` | Pass iff the recorded count is not rendered as 0 before the skills load completes. |
| **AC-027** | `[BR-003]` `[API-007]` `[PG-003 · Error]` | Pass iff a failed skills read renders Error rather than Empty. |

### 7.5 MCP registry

| AC | Tags | Pass condition |
|---|---|---|
| **AC-028** | `[BR-004]` `[API-009]` `[PG-005 · Default]` | Pass iff every recorded MCP server appears on PG-005. |
| **AC-029** | `[BR-004]` `[API-009]` `[PG-005 · Default]` | Pass iff each server on PG-005 displays its recorded health. |
| **AC-030** | `[BR-004]` `[API-010]` `[PG-006 · No Result]` | Pass iff an unrecorded server name renders No Result. |
| **AC-031** | `[BR-004]` `[API-009]` `[PG-005 · Empty]` | Pass iff zero recorded servers renders the MCP registry Empty state. |
| **AC-032** | `[BR-004]` `[API-009]` `[PG-005 · Default]` | Pass iff PG-005 renders no credential value. |
| **AC-033** | `[BR-004]` `[API-010]` `[PG-006 · Default]` | Pass iff PG-006 renders no credential value. |
| **AC-034** | `[BR-004]` `[API-010]` `[PG-006 · Default]` | Pass iff PG-006 renders no tool invocation control. |
| **AC-035** | `[BR-004]` `[API-009]` `[PG-005 · Error]` | Pass iff a failed MCP read renders Error rather than Empty. |

### 7.6 Tasks and runs

| AC | Tags | Pass condition |
|---|---|---|
| **AC-036** | `[BR-005]` `[API-011]` `[PG-007 · Default]` | Pass iff every task rendered on PG-007 is recorded. |
| **AC-037** | `[BR-005]` `[API-011]` `[PG-007 · Empty]` | Pass iff zero recorded tasks renders the Tasks registry Empty state. |
| **AC-038** | `[BR-005]` `[API-011]` `[PG-007 · Empty]` | Pass iff PG-007 Empty renders no Run control. |
| **AC-039** | `[BR-005]` `[API-012]` `[PG-008 · Default]` | Pass iff the declared inputs of the recorded task version are rendered on PG-008. |
| **AC-040** | `[BR-005]` `[API-013]` `[PG-008 · Submitting]` | Pass iff Start run is disabled while a run submission is in flight. |
| **AC-041** | `[BR-005]` `[API-013]` `[PG-008 · Success-Failure]` | Pass iff a valid run submission opens PG-009 with a run reference. |
| **AC-042** | `[BR-005]` `[API-013]` `[PG-008 · Error]` | Pass iff invalid declared inputs create no run. |
| **AC-043** | `[BR-005]` `[API-013]` `[PG-008 · No Result]` | Pass iff an unrecorded task reference on PG-008 renders no run form. |
| **AC-044** | `[BR-005]` `[API-012]` `[PG-008 · Loading]` | Pass iff Start run is unavailable until the task record is loaded. |
| **AC-045** | `[BR-005]` `[API-011]` `[PG-007 · Loading]` | Pass iff Run is unavailable until the task card is loaded. |
| **AC-046** | `[BR-005]` `[API-013]` `[PG-008 · Editing]` | Pass iff leaving PG-008 with non-empty inputs opens the discard confirmation. |
| **AC-047** | `[BR-005]` `[API-013]` `[PG-008 · Error]` | Pass iff an unconfirmed run start is displayed with the unconfirmed disposition. |
| **AC-048** | `[BR-006]` `[API-013]` `[PG-008 · Default]` | Pass iff PG-008 renders no schedule control. |
| **AC-049** | `[BR-006]` `[API-013]` | Pass iff API-013 rejects a request field that names a trigger. |
| **AC-050** | `[BR-008]` `[API-014]` `[PG-009 · Default]` | Pass iff a non-terminal run on PG-009 is displayed without a terminal label. |
| **AC-051** | `[BR-008]` `[API-015]` `[PG-009 · Success-Failure]` | Pass iff a failed step is visible on PG-009. |
| **AC-052** | `[BR-008]` `[API-015]` `[PG-009 · Success-Failure]` | Pass iff every ordinal after the failed ordinal is `Skipped`. |
| **AC-053** | `[BR-008]` `[API-014]` `[PG-009 · Success-Failure]` | Pass iff a run with at least one failed step is displayed as `Failed`. |
| **AC-054** | `[BR-008]` `[API-014]` `[PG-009 · Error]` | Pass iff PG-009 retains the last reported state when a run read fails. |
| **AC-055** | `[BR-008]` `[API-014]` `[PG-009 · No Result]` | Pass iff a non-owned run reference returns the same panel as an unknown run reference. |
| **AC-056** | `[BR-008]` `[API-015]` `[PG-009 · Default]` | Pass iff a run rejected before any step displays "No step results". |
| **AC-057** | `[BR-008]` `[API-015]` `[PG-009 · Success-Failure]` | Pass iff a run with every step succeeded is displayed as `Succeeded`. |

### 7.7 Coverage summary

| Check | Result |
|---|---|
| AC count | 57 (AC-001 to AC-057). |
| UI-visible ACs | 53; each names one PG and one state that is ✓ on that page. |
| Non-UI ACs | 4: AC-003, AC-006, AC-008, AC-049. |
| BRs with at least one AC | 8 of 8. |
| APIs with at least one AC | 15 of 15. |
| ACs for `CAP-009` | 0; blocked in §3.2, no page or endpoint. |
| ACs for `PG-010` to `PG-012` | 0; proposed flows only. |
| ACs using an N/A state | 0. |

The BR and API coverage counts are repeated in §11.1 and §11.3.

## 8. Out of scope

### 8.1 Excluded capability register

The following 30 capabilities are excluded. `CAP-009` is not in this table; it is in the MVP but blocked. The authoritative boundary, rationale, displaced MVP item, and re-entry trigger for each row are in `business_model.md` §3.2. `[SRC: business_model.md#§3.2, §3.3, Appendix B.6]`

| CAP | Topic | Exclusion |
|---|---|---|
| CAP-006 | Automation | Scheduled, cron, webhook, and event-triggered runs. |
| CAP-007 | SSO | SSO/OIDC login and external identity providers. |
| CAP-008 | Search | Search with citations and search-provider configuration. |
| CAP-010 | Model configuration | Model-provider configuration, model selection, and connection test. |
| CAP-011 | File context | File attachment and `@` references. |
| CAP-012 | Workflow builder | Visual workflow builder, branching, and loops. |
| CAP-013 | Code execution | Code-execution skills and sandboxed scripting. |
| CAP-014 | Approvals | Approval workflows and write-capable tool calls. |
| CAP-015 | Delegated publication | Non-admin drafts and delegated publication. |
| CAP-016 | Cost tracking | Per-run token and cost tracking, budget meter, and alert. |
| CAP-017 | Usage dashboard | Usage KPI cards, activity chart, and most-run tasks. |
| CAP-018 | Chat history actions | Pin, rename, delete, and history search. |
| CAP-019 | Projects | Grouping conversations and tasks into projects. |
| CAP-020 | Task templates | Predefined task templates. |
| CAP-021 | Account administration | Invite, disable, reset, and role management. |
| CAP-022 | Mobile and local control | Local-computer control, cloud-drive sync, and mobile apps. |
| CAP-023 | Multi-tenant SaaS | Multi-tenant SaaS, public marketplace, billing, payments, and partner ecosystem. |
| CAP-024 | Notifications | Email, chat, or push notifications for runs and registry events. |
| CAP-025 | Import/export | Bulk import or export of registry entries and run data. |
| CAP-026 | Admin console | A separate administrative console for accounts, roles, and policy. |
| CAP-027 | Offline mode | Offline reading or queuing of messages and runs. |
| CAP-028 | Internationalization (i18n) | Multiple interface languages and locale formatting. |
| CAP-029 | Generic integrations | Integrations other than the governed MCP registry. |
| CAP-030 | Additional AI | Autonomous agents, model-authored skills, and generative media. |
| CAP-031 | Fine-grained permissions | Per-object and per-field permissions beyond the confirmed base role. |
| CAP-032 | Collaboration | Shared conversations, comments, mentions, and presence. |
| CAP-033 | OpenAPI | A published OpenAPI contract or public API. |
| CAP-034 | Backup | Automated backup, restore, and disaster recovery. |
| CAP-035 | Content moderation | Moderation of user or model content. |
| CAP-036 | Skill invocation and tool-call visibility | Invoking a published skill from chat and showing skill or tool receipts in the conversation. |

No row above is promoted by this PRD. No acceptance criterion in §7 references one of these capabilities.

### 8.2 Explicit exclusions

- **Mobile.** No mobile application and no mobile layout. The interaction design stops at the desktop baseline and makes no claim below it. `[CAP-022; interaction_design.md#§7.3]`
- **Search and citations.** No search control, citation field, search provider, or search parameter. The old `US-02` is removed. `[CAP-008; interaction_design.md#§1.3]`
- **Audit page and export.** `CAP-009` is in the MVP but blocked. No audit page, audit endpoint, audit field, or export is added. The old `US-07` is removed. `[CAP-009; api_interface_spec.md#§15 CF-12; business_model.md#Appendix B.4]`
- **Model configuration.** No model endpoint, model selector, secret reference, or connection test. The old `US-09` is removed. `[CAP-010]`
- **Cost.** No token, cost, budget, quota, usage KPI, or activity chart. `[CAP-016, CAP-017]`
- **Scheduling.** No schedule, cron, webhook, or event trigger. Every run is manually initiated. `[CAP-006; BR-006]`
- **Automatic retry.** No automatic retry is in scope. A failed attempt is not retried in place; recovery is a new user action and a new run. `[BR-008; FLOW-003]`
- **Writes beyond Admin.** No Author or Member write path, no MCP registration or allowlisting, no account administration, no import/export, and no artifact write. The only write path named by the baseline is Admin skill/task publication; it is `[CONFLICT]` and has no AC. No other write path is in scope. `[CAP-015, CAP-021, CAP-025, CAP-026; §10.2]`
- **Streaming.** Streaming is not a requirement. `NFR-001` is cited as-is for its measurement point, but this PRD does not require a streaming transport, a streamed answer, or a first-token mechanism. `[NFR-001; TBD-BIZ-008]`
- **Projects, templates, notifications, import/export, SSO, backup, collaboration, and additional AI.** Each is excluded by the table in §8.1. `[CAP-019, CAP-020, CAP-024, CAP-025, CAP-007, CAP-034, CAP-032, CAP-030]`

### 8.3 Not promoted from v0.1

The v0.1 search citation requirement, audit page, model configuration surface, streaming requirement, delivery phases, and stack section are not requirements in v0.2. §12 records the disposition of each v0.1 section. No excluded surface is represented by a disabled control, a placeholder page, or an acceptance criterion.

## 9. Non-functional requirements

### 9.1 NFR register

The NFR identifiers and targets are cited as-is from `business_model.md` §9. No target is confirmed. Numeric targets are proposals under `TBD-BIZ-008`; `NFR-004`, `NFR-005`, and `NFR-009` use a registered `TBD` target plus a suggested baseline that is not a commitment. `[SRC: business_model.md#§9; TBD-BIZ-008]`

| NFR | Area | Metric | Target and status |
|---|---|---|---|
| **NFR-001** | Performance | Time from message submit to first streamed assistant token, p95. | ≤ 3,000 ms (proposed); not accepted; `[TBD-BIZ-008]`. |
| **NFR-002** | Performance | Registry list read response, p95. | ≤ 500 ms for 500 items (proposed); not accepted; `[TBD-BIZ-008]`. |
| **NFR-003** | Performance | Delay from a run-step state change to its visible update, p95. | ≤ 2,000 ms (proposed); not accepted; `[TBD-BIZ-008]`. |
| **NFR-004** | Capacity | Concurrent accounts, conversations, and runs supported without error. | `[TBD-BIZ-004]` and `[TBD-BIZ-008]`; suggested baseline 50 accounts, 20 concurrent sessions, 10 concurrent runs (not a commitment); not accepted. |
| **NFR-005** | Availability | Monthly service availability. | `[TBD-BIZ-008]`; suggested 99.0% per 30-day month (not a commitment); not accepted. |
| **NFR-006** | Security | Secret values in product responses or logs; secret-reference resolution. | 0 secret values; 100% of references resolved server-side (proposed); not accepted; `[TBD-BIZ-003]`, `[TBD-BIZ-008]`. |
| **NFR-007** | Security | Permission rows enforced server-side. | 100% of the 18 matrix columns; 0 client-only checks (proposed); not accepted; `[TBD-BIZ-004]`, `[TBD-BIZ-008]`. |
| **NFR-008** | Security and compliance | Conversation or run content sent to an external provider before the boundary is confirmed. | 0 bytes before `TBD-BIZ-003`, `TBD-BIZ-014`, `TBD-INFRA-009`, and `TBD-INFRA-011` close (proposed); not accepted; measurement under `[TBD-BIZ-008]`. |
| **NFR-009** | Data retention | Retention period for conversations, messages, runs, artifacts, and audit events. | `[TBD-BIZ-003]`; suggested baseline conversations 90 days, runs 180 days, audit 365 days (not a commitment); not accepted; measurement under `[TBD-BIZ-008]`. Appendix B.2 records 90/180/365 for the persisted records; the retention job is deferred. |
| **NFR-010** | Observability | Runs with a run reference and initiating account in structured logs; failed runs with an error code. | 100% and 100% (proposed); not accepted; `[TBD-BIZ-009]`, `[TBD-INFRA-004]`, `[TBD-BIZ-008]`. |
| **NFR-011** | Accessibility | WCAG 2.2 AA conformance for core flows; critical automated violations; keyboard-only completion; text and control contrast. | 0 critical violations; 100% of FLOW-001 to FLOW-003 keyboard-completable; ≥ 4.5:1 text and ≥ 3:1 controls (proposed); not accepted; `[TBD-BIZ-008]`. |
| **NFR-012** | Durability | Completed runs readable after a process restart. | 100% of completed runs (proposed); not accepted; `[TBD-INFRA-003]`, `[TBD-INFRA-005]`, `[TBD-BIZ-008]`. |

### 9.2 Acceptance status

No NFR is accepted. `TBD-BIZ-008` is Open, so every numeric threshold remains proposed. `TBD-INFRA-004` is Resolved and the Stage 1 baseline records the local environment, but no measurement command, benchmark, or load result is verified. `NFR-004`, `NFR-005`, and `NFR-009` keep a `TBD` target plus a suggested baseline; the suggested value is not an acceptance threshold. `[TBD-BIZ-008; TBD-INFRA-004]`

`NFR-009` cites the retention periods recorded in Appendix B.2 for the persisted records. It does not create a retention rule, a deletion job, or a compliance conclusion. `TBD-BIZ-014` remains Open. `[TBD-BIZ-014]`

This PRD does not restate the measurement methods, time windows, or verification stages in `business_model.md` §9; those remain the authority for testing. `NFR-008` quotes its trigger list as-is; the status of each referenced item is in §10.1. `[SRC: business_model.md#§9]`

## 10. Open decisions and conflicts

### 10.1 Registry items referenced

The canonical entries are in `docs/00_setup/open_items.md`. This table references them; it does not redefine an owner, option, deadline, or status. `[SRC: open_items.md]`

| ID | Registry status as-is | Effect on this PRD |
|---|---|---|
| **TBD-BIZ-003** | Resolved — Internal/Sensitive classification, no Highly Sensitive data, 90/180/365 retention. | Cited in §6.3 and §9; no new data rule. |
| **TBD-BIZ-004** | Resolved — admin-only skill and task publication; MCP registration/allowlisting and account administration remain out; role assignments are provisioned out of band. | Publisher authority is referenced as-is; the Resolved status does not settle the design or API surface, which is `[CONFLICT]`; see §10.2. |
| **TBD-BIZ-005** | Open — first MCP integrations and first three tasks. | No specific integration or task is required by an AC; the acceptance demo content remains undefined. |
| **TBD-BIZ-006** | Open — metrics, baselines, targets, time windows, and go-live threshold. | Every `OBJ` target remains `TBD-BIZ-006`; the suggested values are not commitments. |
| **TBD-BIZ-007** | Open — execution model and retry policy. | `FLOW-003` is confirmed only for initiation and outcome; no step type, branching, or retry requirement is written. |
| **TBD-BIZ-008** | Open — NFR thresholds and measurement environment. | Every numeric NFR target remains proposed; no threshold is confirmed. |
| **TBD-BIZ-009** | Resolved — audit in the MVP, append-only, Admin read-only, no export, 365 days. | `CAP-009` is in scope; the surface is blocked; no page or endpoint is added. See §10.3. |
| **TBD-BIZ-011** | Resolved — strict MVP plus skill/task authoring and audit; search, file context, cost, chat-history actions, MCP registration/allowlisting, and account administration remain out. | Scope boundary cited; the authoring and audit surfaces remain `[CONFLICT]` or blocked, not effective. |
| **TBD-BIZ-012** | Resolved — Gate 1 scope boundary accepted (option (b), `CHG-021`). | The scope is accepted; roles, metrics, NFRs, and the execution model remain candidates; see §19. |
| **TBD-BIZ-013** | Open — registry ownership and offboarding. | No account disable, deletion, transfer, or offboarding requirement is written. |
| **TBD-BIZ-014** | Open — legal, platform, or contractual constraints. | No compliance conclusion is issued; no result is claimed. |
| **TBD-BIZ-015** | Open — state-model coverage interpretation. | No new state model or state diagram is added. |
| **TBD-INFRA-003** | Resolved — persistence store decision recorded. | `NFR-012` references it; this PRD selects no store. |
| **TBD-INFRA-004** | Resolved — Stage 1 environment baseline recorded 2026-10-20 (`CHG-022`). | The local host/tool versions are recorded; no command, benchmark, or load result is verified. |
| **TBD-INFRA-005** | Open — dependency and environment tooling. | `NFR-012` references it; this PRD selects no tooling. |
| **TBD-INFRA-009** | Resolved — internal model gateway with no external egress. | `NFR-008` references it; this PRD selects no provider. |
| **TBD-INFRA-011** | Open — search provider and data boundary. | `NFR-008` references it; search remains out of scope. |

A `Resolved` status records the decision in the registry; it does not make a page, endpoint, or acceptance criterion effective in this PRD. The Admin and audit surfaces remain `[CONFLICT]` or blocked as stated in §10.2 and §10.3.

`TBD-BIZ-001` and `TBD-BIZ-002` are Resolved and are the basis of the confirmed product scope; they are not open decisions. `[SRC: open_items.md#TBD-BIZ-001, TBD-BIZ-002]`

### 10.2 Admin publication and audit read `[CONFLICT]`

**Side A — Appendix B.** `business_model.md` Appendix B.3 makes `ROLE-002` Admin effective for `Skill.publish`, `TaskDefinition.publish`, `Run.read` (all runs), and `Audit.read`, additive to the Member grants. Appendix B.4 makes `CAP-009` an effective audit capability. Appendix B.5 makes the skill and task version lifecycles effective. Appendix B.6 lists six MVP capabilities. The registry records `TBD-BIZ-004` and `TBD-BIZ-009` as Resolved. `[SRC: business_model.md#Appendix B.3 to B.6; open_items.md#TBD-BIZ-004, TBD-BIZ-009]`

**Side B — interaction design and API.** `interaction_design.md` §2.1 states that Admin is Proposed with no effective grant, and §2.2 denies every Admin cell; PG-010, PG-011, and PG-012 are `No Permission` only. The API contract gates the 15 endpoints on the §2.2 matrix, exposes no skill/task authoring or audit endpoint, and records the divergence as §15 CF-01. The effective skill and task version lifecycles in Appendix B.5 are likewise not rendered by the design, which shows recorded content only; this is part of the same divergence. `[SRC: interaction_design.md#§2.1, §2.2; api_interface_spec.md#§15 CF-01]`

**Status: Recorded, not resolved.** This PRD quotes the §2.2 matrix unchanged, writes no AC for Admin publication or audit read, and assigns no page or endpoint to either. It does not choose Side A or Side B, does not reopen `CONFLICT-001`, and creates no new `CONFLICT` identifier. The conflict is for the Tech Lead to register if a new registry entry is required. `[SRC: api_interface_spec.md#§15 CF-01]`

### 10.3 CAP-009 audit surface `[CONFLICT]`

`CAP-009` is in the MVP under Appendix B.4 and B.6. No page exists in `interaction_design.md` for audit; §1.3 states that there is no audit page. No endpoint exists in `API-001` to `API-015`; the API contract records the audit surface as an unsourced operation in §15 CF-12. `[SRC: business_model.md#Appendix B.4, B.6; interaction_design.md#§1.3; api_interface_spec.md#§15 CF-12]`

**Status: Blocked — scope settled, surface not covered.** This PRD writes no acceptance criterion, no page, and no endpoint for `CAP-009`. It does not treat the absence as an implementation task. The capability remains in the MVP by its scope decision but cannot be accepted until a page and an interface exist. This is a `[CONFLICT]`, recorded without a new identifier. `[SRC: api_interface_spec.md#§15 CF-12]`

### 10.4 Existing conflicts, cited only

| Conflict | Status | Handling in this PRD |
|---|---|---|
| **CONFLICT-001** — whether an Auditor role exists separately from Admin | Resolved — Admin-capability side selected; Admin has read-only audit access; ROLE-004 remains proposed and denied. | Cited as-is in §5.5 and §10.1. Not reopened. The separate Admin surface divergence is recorded in §10.2. `[SRC: open_items.md#CONFLICT-001]` |
| **CONFLICT-002** — what "Stage 5" denotes and where its deliverable lives | Open. | Cited only; it affects document metadata and routing, not the product content of this PRD. Not reopened. `[SRC: open_items.md#CONFLICT-002]` |

Neither conflict is adjudicated here. No side is chosen. `[SRC: business_model.md#§12.2]`

### 10.5 Registration boundary

This PRD creates no `TBD` and no `CONFLICT` identifier. The `[CONFLICT]` markers in §10.2 and §10.3 are divergence statements that cite existing document-local labels (`CF-01`, `CF-12`) and existing registry entries; they are not registry entries. New conflicts are registered in `docs/00_setup/open_items.md` by the Tech Lead. This PRD does not edit `open_items.md` and does not adjudicate a conflict. `[SRC: project_rules.md#RULE-014]`

## 11. Traceability and self-check

### 11.1 BR-to-AC coverage

| BR | ACs | Count |
|---|---|---|
| BR-001 | AC-001 to AC-007 | 7 |
| BR-002 | AC-009 to AC-021 | 13 |
| BR-003 | AC-022 to AC-027 | 6 |
| BR-004 | AC-028 to AC-035 | 8 |
| BR-005 | AC-036 to AC-047 | 12 |
| BR-006 | AC-048, AC-049 | 2 |
| BR-007 | AC-008 | 1 |
| BR-008 | AC-050 to AC-057 | 8 |

No BR is without an AC. No AC carries more than one BR. `[SRC: business_model.md#§8]`

### 11.2 Page-to-flow-to-AC coverage

| Page | Status | CAP and FLOW | AC |
|---|---|---|---|
| PG-001 | Confirmed | CAP-005; FLOW-001 | AC-001 to AC-008 |
| PG-002 | Confirmed | CAP-001; FLOW-002 | AC-009 to AC-021 |
| PG-003 | Confirmed read-only | CAP-002; FLOW-004 read side | AC-022, AC-023, AC-026, AC-027 |
| PG-004 | Confirmed read-only | CAP-002; FLOW-004 read side | AC-024, AC-025 |
| PG-005 | Confirmed read-only | CAP-003; FLOW-005 read context | AC-028, AC-029, AC-031, AC-032, AC-035 |
| PG-006 | Confirmed read-only | CAP-003; FLOW-005 read context | AC-030, AC-033, AC-034 |
| PG-007 | Confirmed read-only plus run entry | CAP-004; FLOW-003 | AC-036, AC-037, AC-038, AC-045 |
| PG-008 | Confirmed | CAP-004; FLOW-003 | AC-039 to AC-044, AC-046 to AC-049 |
| PG-009 | Confirmed | CAP-004; FLOW-003 | AC-050 to AC-057 |
| PG-010 | Proposed; No Permission only | FLOW-004 | None |
| PG-011 | Proposed; No Permission only | FLOW-005 | None |
| PG-012 | Proposed; No Permission only | FLOW-006 | None |

`PG-010` to `PG-012` have no AC because the flows are Proposed and no implementation is authorized. This is not an omission. `PG-003` to `PG-007` are confirmed read surfaces under BR-003, BR-004, and BR-005; their appearance in a FLOW-004, FLOW-005, or FLOW-006 read context does not make those flows effective. No AC implements a Proposed flow. `[SRC: interaction_design.md#§3.5, §4.4 to §4.6]`

### 11.3 Self-check

| # | Check | Verdict | Evidence |
|---|---|---|---|
| 1 | Every AC is binary and contains one condition. | Pass | §7.2 to §7.6: 57 rows, each with one "Pass iff" condition; no compound row. |
| 2 | Every BR-001 to BR-008 has at least one AC. | Pass | §11.1: 8 of 8; counts 7, 13, 6, 8, 12, 2, 1, 8. |
| 3 | Every API-001 to API-015 is cited at least once. | Pass | §6.1: 15 of 15 rows; §7: every API appears in at least one AC tag. |
| 4 | Every UI-visible AC names a PG and a state that exists and is not N/A on that page. | Pass | §7: 53 UI ACs; §5.2 and §5.3 are the check table. The four non-UI ACs are AC-003, AC-006, AC-008, and AC-049. |
| 5 | No new page, role, state, error code, or responsibility. | Pass | `PG-001` to `PG-012` and `ROLE-001` to `ROLE-004` are the only page and role IDs; the nine state names are §5.1; no error code is defined; `Blocked` is a capability status, not a state; no new role responsibility is assigned. |
| 6 | Every divergence carries `[CONFLICT]`. | Pass | §10.2 Admin publication and audit read; §10.3 CAP-009 audit surface. No divergence is presented as settled. |
| 7 | Every open decision carries `[TBD-xxx]`. | Pass | §2 targets `TBD-BIZ-006`; §4 execution `TBD-BIZ-007`; §9 thresholds `TBD-BIZ-008`; §10 `TBD-BIZ-005`, `-006`, `-007`, `-008`, `-012`, `-013`, `-014`, `-015`; `TBD-INFRA-005`, `-007`, `-011`. |
| 8 | CAP-009 is blocked and no page, API, or AC is invented. | Pass | §3.2, §10.3; zero AC for CAP-009; no additional page or endpoint is defined. |
| 9 | FLOW-004 to FLOW-006 are Proposed only, with no implementation AC. | Pass | §4.3; §7.7 records zero AC for PG-010 to PG-012. |
| 10 | US-02, US-07, US-09, and the old §13 matrix are not carried over. | Pass | §12 records each removal; §7 contains no search, audit-page, or model-configuration AC; §5.5 contains the §2.2 matrix, not the old §13 columns. |
| 11 | Search citations, an audit page, and model configuration are not promoted. | Pass | §8.2; no AC, page, or endpoint for CAP-008, CAP-009 read surface, or CAP-010. |
| 12 | NFRs are cited as-is; no threshold is invented. | Pass | §9.1 preserves NFR-001 to NFR-012 and their proposed or TBD status; §9.2 states no NFR is accepted. |
| 13 | No new TBD or CONFLICT ID is created. | Pass | §10.5; the PRD references existing IDs only. |

### 11.4 Residual limits

- This PRD is `Draft`; the Gate 1 scope boundary is accepted (`TBD-BIZ-012` Resolved, `CHG-021`). No implementation authorization is claimed.
- The Admin publication and audit-read surface is `[CONFLICT]`; no side is chosen.
- `CAP-009` is blocked; audit cannot be accepted until a page and an interface exist.
- `TBD-BIZ-007` leaves step execution semantics open; the run lifecycle is stated, but the executor is not.
- `TBD-BIZ-006` leaves every OBJ target proposed; `TBD-BIZ-008` leaves every NFR threshold proposed.
- No API or UI was executed. The acceptance criteria are definitions, not executed results.
- No independent Verifier review is recorded for this revision.
- `TBD-BIZ-014` remains Open; no legal or compliance conclusion is issued.

## 12. Changes from v0.1

v0.2 replaces v0.1 in place. The following v0.1 sections are not carried forward as requirements. `[SRC: prd.md v0.1]`

| v0.1 location | Disposition in v0.2 |
|---|---|
| §1 Summary claim that "every run is auditable" | Removed. Audit is in scope through `CAP-009`, but its surface is blocked; no audit page or endpoint is claimed. |
| §3 Reference analysis and §4 competitive gap | Removed from requirements. They are not a product commitment and no longer appear in this PRD. |
| §5 Goals G1 to G7 | Replaced by `OBJ-001` to `OBJ-003`. |
| §5 Non-goals | Replaced by §8 and the 30-capability exclusion register. |
| §6 Users and roles | Replaced by §5.5; the four existing roles are cited, not redefined. |
| §7 Core concepts | Replaced by the data linkage in §6; no field, interface element, or schema is defined. |
| §8 MVP scope | Replaced by §3: `CAP-001` to `CAP-005` plus the separate blocked `CAP-009`. |
| §9 US-01 to US-09 | Removed. The user stories are replaced by the 57 acceptance criteria in §7. |
| §9 US-02 Search with citations | Removed; `CAP-008` is out of scope; no search or citation AC remains. |
| §9 US-07 Audit usage | Removed; `CAP-009` is in scope but blocked; no audit page, filter, or export AC remains. |
| §9 US-09 Configure the model provider | Removed; `CAP-010` is out of scope; no model configuration AC remains. |
| §10 FR-001 to FR-050 | Removed. No functional-requirement ID is carried into v0.2. |
| §11 UX flows | Replaced by `FLOW-001` to `FLOW-003` and the `PG-001` to `PG-009` spine; `FLOW-004` to `FLOW-006` are Proposed only. |
| §12 Non-functional requirements | Replaced by `NFR-001` to `NFR-012` cited as-is; no threshold is confirmed. |
| §13 Permissions matrix | Removed. Replaced by the `interaction_design.md` §2.2 matrix quoted in §5.5. The old Admin/Author/Member/Auditor columns are not retained. |
| §14 Success metrics | Removed as a separate table. The objectives and their `TBD-BIZ-006` targets are in §2. No new metric is added. |
| §15 Delivery phases | Removed. This PRD makes no phase, date, or exit-criteria commitment. |
| §16 Risks and mitigations | Not carried as a requirement. §13 records the current limits and conflicts. |
| §17 Stack decision inputs | Removed. This PRD selects no implementation stack, dependency, interface element, or deployment tool. |
| §18 Open decisions | Replaced by §10, which references the canonical registry without redefining an entry. |
| §19 PRD acceptance | Withdrawn. Replaced by the acceptance status in §19; the Gate 1 scope boundary is accepted (`TBD-BIZ-012` Resolved, `CHG-021`). |

No text from `US-02`, `US-07`, `US-09`, or the old §13 matrix is retained as a requirement.

## 13. Risks and limits

This table records the limits of the current draft. It creates no risk ID and no mitigation that is not already sourced. `[SRC: business_model.md#§11, §12; api_interface_spec.md#§15]`

| Risk or limit | Impact | Treatment in this PRD |
|---|---|---|
| Admin publication and audit-read divergence | The Admin grants are not effective in the design/API surface; no Admin AC can be written. | Recorded as `[CONFLICT]` in §10.2; no side chosen; no AC. |
| `CAP-009` audit has no page or endpoint | The audit scope cannot be accepted or demonstrated. | Blocked in §3.2 and §10.3; no page, API, or AC invented. |
| `TBD-BIZ-007` execution model is open | Step execution, branching, and retry semantics are undefined. | `FLOW-003` is limited to initiation and outcome; no step-type or retry requirement. |
| `TBD-BIZ-006` metrics are open | The three objectives have no confirmed target or time window. | Every target cites `TBD-BIZ-006`; suggested values are not commitments. |
| `TBD-BIZ-008` thresholds remain open; the `TBD-INFRA-004` environment is recorded | No NFR can be accepted or measured. | §9 cites the targets as proposed; no measurement claim is made. |
| `TBD-BIZ-014` legal/policy reference is missing | No compliance conclusion can be issued. | No compliance requirement or conclusion; cited as Open. |
| `TBD-BIZ-005` has no first integration or task | The acceptance demo has no concrete content. | No specific integration or task is required by an AC; cited as Open. |
| No API or UI was executed | The ACs are definitions, not observed results. | §11.3 records a documentation self-check only; no pass is claimed. |
| No independent review | The document is not merge-ready as a reviewed artifact. | §15 records that the review was not performed; the document remains `Draft`. |

## 14. References

| Reference | Version and status | Sections used |
|---|---|---|
| `docs/01_product/business_model.md` | v0.3, `Draft` | §2, §3, §4, §5, §6, §7, §8, §9, §10.2, §10.4, Appendix B.1 to B.6, B.8, B.9 |
| `docs/03_design/interaction_design.md` | v0.1, `Draft` | §1.3, §2.1, §2.2, §2.3, §3.1 to §3.5, §4.1 to §4.7, §5, §6.1 to §6.14, §7.3, §8.2, §8.3 |
| `docs/05_api/api_interface_spec.md` | v0.1, `Draft` | §4, §5.1 to §5.3, §8, §12, §15 CF-01, CF-12 |
| `docs/02_architecture/architecture.md` | v0.1, `Draft` | §8 |
| `docs/02_architecture/02_api_workflow_and_review.md` | v0.1, `Draft` | §5, §6, §9 |
| `docs/03_design/prototype/README.md` | `Draft` | State coverage and N/A reasons |
| `docs/00_setup/open_items.md` | `Draft` | TBD and CONFLICT status references |
| `docs/13_changes/CHG-014-prd-v0.2.md` | `Draft` | Change record for this revision |

No source outside this table is used as a requirement. Where a source is `Draft`, this PRD inherits the draft status and does not claim a settled decision. `[SRC: business_model.md#§1.1; interaction_design.md#§1.1; api_interface_spec.md#§1]`

## 15. Review and verification status

This revision is documentation-only. The CHG-014 verification record contains the executed checks: status lines, required-section presence, AC count and uniqueness, BR and API coverage, PG/state validity against §5.2, N/A-state exclusion, no new page/role/state/error code, TBD/CONFLICT reference resolution, banned-wording scan, and the write set.

No API, UI, model, MCP server, store, or browser was executed. No acceptance result is recorded. The independent Verifier review required by RULE-005 has not been performed for this revision. `[SRC: project_rules.md#RULE-005]`

The document remains `Draft`; the Gate 1 scope boundary is accepted (`TBD-BIZ-012` Resolved, `CHG-021`). See §19.

## 16. Document history

| Version | Date | Change | Record |
|---|---|---|---|
| 0.1 | 2026-10-18 | Initial Stage 2 PRD. | CHG-001 |
| 0.2 | 2026-10-18 | Revised in place: OBJ-001 to OBJ-003, CAP-001 to CAP-005 plus blocked CAP-009, FLOW-001 to FLOW-003 spine, nine-state coverage, §2.2 permission matrix, AC↔API↔PG coverage, and the withdrawal of US-02, US-07, US-09, and old §13. | CHG-014 |

## 17. Terms used

The glossary is `business_model.md` §12.3; this PRD does not redefine a term. In this PRD, **recorded** means present in the governed registry, **manual run** means a run initiated by a signed-in person, and **blocked** means a capability whose scope is settled but whose page or interface surface is not covered. `[SRC: business_model.md#§12.3]`

## 18. Approval record

The decision owner is the Product Owner. The Gate 1 scope boundary was accepted on 2026-10-19 (option (b)); the change record is `CHG-021`. The product owner/Tech Lead confirmed the change set and signed off `CHG-021` on 2026-10-20. The independent review of this PRD v0.2 revision (`CHG-014`) has not been performed; the Gate 1 acceptance change is reviewed separately at `CHG-021`. `[TBD-BIZ-012]`

| Role | Decision | Date | Record |
|---|---|---|---|
| Product Owner | Accepted the Gate 1 scope boundary (option (b)) | 2026-10-19 | `TBD-BIZ-012`; `CHG-021` |
| Tech Lead | Approved `CHG-021` and the Gate 1 scope boundary (option (b)); signed off for commit | 2026-10-20 | `CHG-021` |
| Independent Verifier | Review not performed for PRD v0.2 (`CHG-014`); the `CHG-021` Gate 1 acceptance review is separate | — | — |

## 19. Acceptance status

**This PRD v0.2 is `Draft`. The Gate 1 scope boundary is accepted (`TBD-BIZ-012` Resolved, option (b); `CHG-021`). Implementation is not authorized.**

The v0.1 §19 acceptance conditions are withdrawn. This revision does not add a new acceptance test. The Gate 1 decision accepts the MVP scope boundary only; roles, metrics, NFRs, and the execution model remain candidates. `TBD-BIZ-006` covers metrics, `TBD-BIZ-007` execution, and `TBD-BIZ-008` NFR thresholds; roles remain governed by the unresolved permission matrix and `CONFLICT-002`.

| Field | Status |
|---|---|
| Document status | `Draft` |
| Version | 0.2 |
| Gate 1 | Scope boundary accepted (option (b)) |
| `TBD-BIZ-012` | Resolved |
| Independent review | Not performed for PRD v0.2 (`CHG-014`); the `CHG-021` Gate 1 acceptance review is separate |
| Implementation authorization | None for agent-authored implementation — Stage 7 commands and a separate implementation change remain required. User-supplied files and code are pre-approved under `RULE-021`. |

Gate 1 acceptance is recorded in `docs/00_setup/open_items.md` and `CHG-021`. It does not authorize implementation, deployment, or data handling; the Stage 1 baseline is recorded (`TBD-INFRA-004` Resolved; `CHG-022`), but verified commands (`TBD-INFRA-007`) and an implementation `CHG` remain required. `[TBD-BIZ-012]`
