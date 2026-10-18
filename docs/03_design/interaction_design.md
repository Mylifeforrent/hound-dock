# Interaction design — hound-dock internal agent workspace

Status: Draft
Version: 0.1
As-of: 2026-10-18
Originating stage: Stage 4 — Design; business-model input from Stage 5
Owner: Docs Agent (design ownership; authored for the interaction-design task)
Input authority: `docs/01_product/business_model.md` v0.2 (`Draft`) — the sole business authority for this document
Design reference: `docs/03_design/design_system.md` (`Draft`) — visual language, layout tokens, components, and desktop breakpoints
Scope: information architecture, core task flows, interaction rules, page state coverage, and the 1440px desktop layout for the confirmed MVP and the three proposed authoring flows
Out of scope: APIs, data models, backend behavior, production code, mobile/narrow layouts, and any capability, role, state, or field not stated in the business model
Refs: CAP-001 to CAP-005 (in MVP); CAP-006 to CAP-036 as named exclusions only; BR-001 to BR-008; FLOW-001 to FLOW-006; ROLE-001 to ROLE-004; ENT-003, ENT-004, ENT-006, ENT-007, ENT-008, ENT-010, ENT-011, ENT-012, ENT-013, ENT-014, ENT-016; STATE-001 to STATE-006; NFR-001 to NFR-003; NFR-011; TBD-BIZ-003 to TBD-BIZ-011; TBD-BIZ-013; CAND-008; CAND-009; CAND-021; CONFLICT-001; PG-001 to PG-012

## 1. Scope, authority, and status discipline

### 1.1 What this document is

This document turns the business model into a page architecture, six task flows, interaction rules, nine page states per page, and a desktop layout at a 1440px baseline. It is a design specification, not an implementation contract. It does not define an API, a data model, storage, transport, or backend behavior. The business model remains the authority for every capability, role, permission, state, field, and business rule named here.

`PG-001` to `PG-012` are the only identifiers this document assigns. Every `CAP`, `FLOW`, `BR`, `ROLE`, `ENT`, `STATE`, `NFR`, `CAND`, `CONFLICT`, and `TBD-BIZ` reference resolves to the business model or to `docs/00_setup/open_items.md`. No `TBD` is defined or redefined here. No candidate is promoted here.

### 1.2 Status vocabulary used in this document

| Status | Meaning | Interaction consequence |
|---|---|---|
| **Confirmed** | Stated or entailed by the confirmed MVP in the business model: CAP-001 to CAP-005, FLOW-001 to FLOW-003, BR-001 to BR-008, and the ROLE-001 cells of BM §6.2 | Rendered and operable within the confirmed permissions |
| **Confirmed read-only** | A read of a confirmed registry or record, using fields stated in the business model | Rendered without any mutating control |
| **Proposed — not effective** | Stated in FLOW-004 to FLOW-006, ROLE-002 to ROLE-004, or STATE-003 to STATE-006, but denied by the effective permission matrix | Not reachable from primary navigation; a direct entry resolves to No Permission; no draft, test, or version is created |
| **Design rule** | A UI convention needed to operate the page safely, such as skeleton loading, unsaved-input confirmation, or duplicate-click suppression | Applies to the interface only; it adds no business capability, role, state, or field |
| **N/A** | The state cannot occur on that page | Explained on the page rather than silently omitted |

A design rule MUST NOT grant a permission, create a record, or make a proposed state effective. Where a page would need a business decision that does not exist, this document uses the Empty, No Permission, or No Result state rather than inventing behavior.

A page status may carry a qualifier, such as “confirmed read-only elaboration” (PG-004, PG-006) or “confirmed read-only + run entry” (PG-007). A qualifier describes the page’s read or navigation role; it does not add a mutating action or change the permission conclusion.

### 1.3 Surfaces deliberately excluded

A chat-first workspace invites several familiar controls. Each one below is outside the confirmed MVP, so it is not designed, not hinted at, and not represented by a disabled control that implies it exists.

| Familiar surface | Excluded by | Consequence in this design |
|---|---|---|
| Search toggle and citations | CAP-008 | No search control, no citation area, no “search is off” state |
| File attachment and `@` references | CAP-011 | No attach control, no file context, no file picker |
| Skill picker, tool calls, tool receipts in chat | CAP-036 | Chat is plain text turns; no `/` menu, no run receipt, no tool status |
| Pin, rename, delete, history search | CAP-018 | Conversation list has no row actions and no search |
| Run history and audit history, filters, export | CAP-009 | No Runs page, no Audit page, no export; a run is reached only from the submission that created it |
| Usage dashboard and cost | CAP-017, CAP-016 | No KPI cards, activity chart, token count, or cost meter |
| Account administration, invitations, roles | CAP-021 | No account menu, no invite, no role management, no password reset |
| Separate admin console | CAP-026 | No Manage drawer or admin area; the Skills, MCP servers, and Tasks destinations are the only management surfaces |
| Model configuration and model choice | CAP-010 | No model chip, no model selector, no connection test |
| Projects | CAP-019 | No project grouping |
| Task templates | CAP-020 | No template picker |
| Notifications | CAP-024 | No notification centre or toast that implies a channel |
| Import and export | CAP-025 | No import/export control |
| Collaboration and sharing | CAP-032 | No share control; conversations are single-owner |
| SSO | CAP-007 | Local sign-in only; no SSO button |
| Approvals, write tools, code execution, branching | CAP-014, CAP-013, CAP-012 | No approval step, no write-tool toggle, no code editor, no branch or loop control |
| Mobile, offline, i18n | CAP-022, CAP-027, CAP-028 | Desktop-only, online-only, single interface language |

### 1.4 Critical status finding before any page is drawn

The confirmed MVP is not operable as a complete product. `TBD-BIZ-004` is open. ROLE-001 is the only confirmed role, and it is denied every create, publish, register, and allowlist action. ROLE-002, ROLE-003, and ROLE-004 are proposed and every cell in their permission-matrix rows is `denied`. CAP-002, CAP-003, and CAP-004 therefore have no confirmed human authority to populate their registries.

This document does not solve that gap by inventing an administrator. It makes the consequence visible and testable:

- PG-003, PG-005, and PG-007 can be legitimately **Empty** in a valid workspace, because no confirmed role can record an entry.
- PG-010, PG-011, and PG-012 are the proposed authoring surfaces for FLOW-004, FLOW-005, and FLOW-006. They are not linked from primary navigation. Their only effective state is **No Permission**.
- The read-only registry pages remain useful only for entries that exist. They MUST NOT present a “New” button that cannot succeed.

This is a business-model blocker, not a design preference. It is registered against `TBD-BIZ-004` and is repeated in §8.

## 2. Roles, permissions, and what the interface may show

### 2.1 Effective roles

| Role | Status | Effective interaction reach |
|---|---|---|
| **ROLE-001** Member | Confirmed | Sign in; create and continue own conversations; read the three registries; initiate a manual run of a recorded task; read the outcome of a run they initiated |
| **ROLE-002** Admin | Proposed, no effective grant | Every chat, skill, MCP, task, run, audit, and account operation is `denied`; direct entry to PG-010, PG-011, or PG-012 resolves to No Permission |
| **ROLE-003** Author | Proposed, no effective grant | As above; the proposed authoring grants in BM §6.3 are not effective |
| **ROLE-004** Auditor | Proposed, blocked by `CONFLICT-001` | As above; audit read is `denied` |

There is no role selector, impersonation control, or “view as” surface. No confirmed role assignment flow exists, so the interface does not offer one. Because ROLE-002, ROLE-003, and ROLE-004 are denied every page-level read, a session bound to one of those roles has no operable page. That is the `TBD-BIZ-004` blocker, not a navigation defect.

### 2.2 Effective page and action permission matrix

`allowed`, `denied`, `own-only`, and `read-only` are used exactly as defined by the business model. A blank cell is deliberately not used.

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

Sign-in is a person-level action under BR-001, not a role-checked matrix cell. A person with a local account may reach PG-001; the role’s entity permissions apply after the session is bound. The matrix columns above describe page and entity actions after sign-in.

### 2.3 Interaction consequences of the matrix

1. **No account identity in the chrome.** ROLE-001 `Account.read` is `denied`. The shell therefore shows a neutral signed-in indicator, not an account name, avatar initials, or account menu. Whether a session may render the account’s own display name is not stated by the business model; the conservative design omits it.
2. **No owner attribution on registry cards.** ENT-006 and ENT-011 carry owner attribution and are marked PII, but ROLE-001 `Account.read` is `denied`. Skill and task cards therefore do not show an owner name. The ambiguity is registered in §8.2 rather than resolved by showing a name.
3. **No write affordance on read-only pages.** A primary “New skill”, “Add server”, or “New task” button is not rendered on PG-003, PG-005, or PG-007. Presenting one would imply an authority that no role has.
4. **Denied actions do not leak existence.** A direct route to an unrecorded record uses No Result. A direct route to another account’s conversation or run uses the same generic “not available” panel as No Result, with no name, title, owner, or state. No Permission MUST NOT become an existence oracle.
5. **Visibility is convenience, not authority.** If an action is visible because a page was rendered before a permission changed, the system’s denial still wins. The page shows No Permission and makes no partial change. This is an interaction rule; it does not specify where the check executes.
6. **Read-only is not “disabled editing”.** Read-only pages do not show greyed-out edit controls. They show the record as text, with no editing affordance at all. A disabled control would imply that a future click could work, which the matrix does not support.

### 2.4 Permission ambiguities that are not resolved here

Three display questions cannot be answered from the matrix and are not decided by this document:

- Whether `Skill.read` or `TaskDefinition.read` includes the owner’s display name when `Account.read` is `denied`.
- Whether a run step’s target reference, or a skill’s declared tool dependency, requires an `McpTool.read` permission, which is not a matrix column.
- Whether the account’s own display name may appear in a session-bound shell when `Account.read` is `denied`.

The interim design omits all three. They are recorded in §8.2 as gaps to be registered.

## 3. Information architecture

### 3.1 Navigation model

The workspace is a single authenticated shell with four primary destinations. Chat is the home. The registries are read-only control surfaces. There is no administration area, no operations area, and no settings area.

```text
Unauthenticated
  PG-001 Sign in
      │ success
      ▼
Authenticated shell
  Sidebar (272px)                     Main pane
  ├─ Brand                            PG-002 Chat ──────────────┐
  ├─ New chat                         PG-003 Skills ── PG-004 Skill record
  ├─ Chat        ──────────────────── PG-002 Chat               │
  ├─ Skills      ──────────────────── PG-003 Skills ── PG-004   │
  ├─ MCP servers ──────────────────── PG-005 MCP ───── PG-006   │
  ├─ Tasks       ──────────────────── PG-007 Tasks ── PG-008 Task run
  ├─ Conversation list (own only)                             │
  └─ Signed-in indicator                                      │
                                                              ▼
                                                    PG-009 Run outcome

Proposed, not linked from navigation, denied for every role:
  PG-010 Skill editor      (FLOW-004)
  PG-011 MCP server editor (FLOW-005)
  PG-012 Task editor       (FLOW-006)
```

Navigation rules:

- The sidebar has exactly four destination links: Chat, Skills, MCP servers, Tasks. A “Manage” drawer, Runs, Usage, Audit, and Settings are not present.
- The conversation list sits under the Chat link. It lists only the signed-in account’s conversations. It has no search field and no row actions.
- The account area is a neutral “Signed in” label. There is no dropdown and no sign-out control; session termination is not stated in the business model and is recorded as a gap in §8.2.
- Breadcrumbs use `Workspace / <section>` and `Workspace / <section> / <record label>`. The record label is the business name or reference, not an owner name.
- Browser Back returns to the previous page. Every effective page is a route; effective detail records are not hidden inside a modal or drawer. The only overlay designed here is the proposed publish confirmation in PG-010 and PG-012.
- PG-010, PG-011, and PG-012 are not linked. Direct entry is possible only by URL and resolves to No Permission.

### 3.2 Page table

The table uses the required columns: purpose, information hierarchy, navigation, and mapped CAP/FLOW/role. “Status” is added so a reviewer can see at a glance which surfaces are effective.

| PG | Page and route | Purpose | Information hierarchy (top to bottom) | Navigation and entry | Mapped CAP / FLOW / role | Status |
|---|---|---|---|---|---|---|
| **PG-001** | Sign in `/sign-in` | Establish a local-account session for a person with a workspace-local credential | 1 Workspace/product identity; 2 “Sign in” heading; 3 sign-in name; 4 credential; 5 primary Sign in; 6 generic status/error region; 7 static account-help note (no link) | Entry route for every unauthenticated visit; success enters PG-002; an authenticated visit redirects to PG-002 | CAP-005; FLOW-001; BR-001; ROLE-001 | Confirmed |
| **PG-002** | Chat `/chat` and `/chat/:conversationRef` | Start or continue the signed-in person’s own conversation and receive an assistant message on a successful model response | 1 Sidebar with New chat and own conversation list; 2 topbar breadcrumb `Workspace / Chat`; 3 chat header: conversation reference and “Private to you”; 4 scrolling thread; 5 pinned composer with Send; 6 polite status region | Primary destination “Chat”; New chat creates a new conversation; selecting a conversation opens it; empty chat shows the Empty state | CAP-001; FLOW-002; BR-002; ROLE-001 own-only | Confirmed |
| **PG-003** | Skills registry `/skills` | Make recorded skills visible and reject unrecorded skill references | 1 `Registry / Skills` eyebrow; 2 title “Skills” and recorded count; 3 description; 4 read-only notice; 5 card grid of recorded skills (name, description, recorded marker); no owner, no lifecycle badge, no create action | Sidebar “Skills”; card opens PG-004; Back returns from PG-004 | CAP-002; BR-003; FLOW-004 N5 read side; ROLE-001 read-only | Confirmed read-only |
| **PG-004** | Skill record `/skills/:skillName` | Read one recorded skill without implying authoring, publication, or invocation | 1 Breadcrumb and Back to Skills; 2 name and recorded marker; 3 description; 4 instructions; 5 input definition; 6 version label where present, marked proposed metadata; no owner, no dependency list, no lifecycle status, no edit/test/publish action | Reached from PG-003 only if the skill is recorded; an unrecorded name resolves to No Result | CAP-002; BR-003; FLOW-004 N5 read side; ROLE-001 read-only | Confirmed read-only elaboration |
| **PG-005** | MCP registry `/mcp` | Make recorded MCP servers and their recorded health visible | 1 `Registry / MCP` eyebrow; 2 title “MCP servers” and recorded count; 3 description; 4 read-only and credential-reference notice; 5 card grid (server name, recorded health, credential-reference indicator); no tool names, no tool count, no add, test, allowlist, or invoke action | Sidebar “MCP servers”; card opens PG-006 | CAP-003; BR-004; FLOW-005 registration context (no member-read step); ROLE-001 read-only | Confirmed read-only |
| **PG-006** | MCP server record `/mcp/:serverName` | Read one recorded server’s recorded health and tool-reference count without exposing credentials or invoking tools | 1 Breadcrumb and Back to MCP servers; 2 server name and recorded health; 3 connection facts: connection type, endpoint reference, credential-reference presence, timeout; 4 recorded tool-reference count only; individual tool names and allowlist flags are withheld until the McpTool read question is resolved (§8.2); 5 “No tool references recorded” where applicable | Reached from PG-005 only if the server is recorded; an unrecorded name resolves to No Result | CAP-003; BR-004; FLOW-005 registration context (no member-read step); ROLE-001 read-only | Confirmed read-only elaboration |
| **PG-007** | Tasks registry `/tasks` | Make recorded task definitions visible and provide the confirmed entry point to a manual run | 1 `Registry / Tasks` eyebrow; 2 title “Tasks” and recorded count; 3 description; 4 “Manual runs only” note; 5 read-only notice; 6 task cards (name, description, version label, step count, Run action) | Sidebar “Tasks”; Run opens PG-008; an unrecorded task cannot be selected | CAP-004; BR-005; FLOW-003 N1; FLOW-006 N5; ROLE-001 read-only plus `Run.initiate` allowed | Confirmed read-only + run entry |
| **PG-008** | Task run `/tasks/:taskName/run` | Collect declared inputs and submit one manual run of a recorded task version | 1 Breadcrumb and Back to Tasks; 2 task name, version label, description; 3 “Manual run” note; 4 declared inputs; 5 Start run; 6 inline error/status region; 7 read-only composition summary in the side panel | Reached from PG-007 Run; success opens PG-009; an unrecorded task resolves to No Result and returns to PG-007 | CAP-004; BR-005, BR-006; FLOW-003 N1 to N3; ROLE-001 allowed | Confirmed |
| **PG-009** | Run outcome `/runs/:runReference` | Show the terminal or in-progress outcome of a run initiated by the signed-in person, including a failed step | 1 Breadcrumb and run reference with state badge; 2 “Initiated by you” and task name/version; 3 outcome summary; 4 step list with ordinal, target kind, status, duration, result or error; a skill target shows the skill name, while an MCP tool target withholds the tool name until the McpTool read question is resolved (§8.2); 5 Start a new run; 6 Back to Tasks; no artifacts, cost, audit metadata, or download | Reached immediately after a successful submission; no run index exists; an unknown or non-owned reference resolves to the same generic unavailable state | CAP-004; BR-008; FLOW-003 N4 to N7; ROLE-001 own-only | Confirmed |
| **PG-010** | Skill editor `/skills/new` and `/skills/:skillName/edit` | Proposed authoring, test, and publication of a skill version; not effective | Effective: No Permission panel only. Conditional target: title and draft state; name, description, instructions, input definition, declared tool dependencies; validation summary; Save draft, Test, Publish; Cancel | Not linked; direct entry resolves to No Permission; conditional entry would be from PG-003 | CAP-002 authoring side (excluded from the confirmed CAP); BR-003; FLOW-004; ROLE-002/ROLE-003 proposed, all `denied` | Proposed — not effective |
| **PG-011** | MCP server editor `/mcp/new` and `/mcp/:serverName/edit` | Proposed registration, connection test, and tool allowlisting of an MCP server; not effective | Effective: No Permission panel only. Conditional target: title; name, connection type, endpoint reference, auth reference, timeout; Test connection; connection result; recorded tool list with allowlist toggles (conditional on a future McpTool read grant); Save; Cancel | Not linked; direct entry resolves to No Permission; conditional entry would be from PG-005 | CAP-003 registration side (excluded from the confirmed CAP); BR-004; FLOW-005; ROLE-002 proposed, all `denied` | Proposed — not effective |
| **PG-012** | Task definition editor `/tasks/new` and `/tasks/:taskName/edit` | Proposed authoring, test-run, and publication of a task version; not effective | Effective: No Permission panel only. Conditional target: title and draft state; name, description, input definition, ordered steps, step parameters; validation summary; Save draft, Test run, Publish; Cancel | Not linked; direct entry resolves to No Permission; conditional entry would be from PG-007 | CAP-004 authoring side (excluded from the confirmed CAP); BR-005; FLOW-006; ROLE-002/ROLE-003 proposed, all `denied` | Proposed — not effective |

**Read-only elaboration note.** The confirmed minimum for a registry surface is the recorded entry and, for MCP, its recorded health. PG-004, PG-006, PG-007, PG-008, and PG-009 additionally show fields that come from proposed entities or proposed flow steps: skill and task descriptions and instructions, input definitions, version labels, step counts, step references and targets, and MCP connection facts (connection type, endpoint reference, credential-reference presence, timeout). Those fields are rendered read-only and are treated as proposed metadata. They do not make a proposed lifecycle state effective, they do not create a field, and they disappear if the underlying record does not carry them.

### 3.3 Flow-to-page coverage

| Flow | Status | Pages | Coverage statement |
|---|---|---|---|
| FLOW-001 Local sign-in and session | Confirmed | PG-001 → PG-002 | Every confirmed step N1, D1, N2, N3 and every exception F1, F2, C1 has a page destination or an explicit product-boundary termination |
| FLOW-002 Chat message and assistant response | Confirmed | PG-002 | Every confirmed step N1 to N5 and every exception F1, F2, C1, C2 stays on or returns to PG-002, except inactive-session recovery through PG-001 |
| FLOW-003 Manual task run | Confirmed | PG-007 → PG-008 → PG-009 | The run is selected, submitted, and observed across three pages; every exception has a recovery destination |
| FLOW-004 Skill registration and publication | Proposed — not effective | PG-003, PG-004, PG-010 | The read side is confirmed by BR-003; the authoring side is designed conditionally and denied for every role |
| FLOW-005 MCP server registration and allowlisting | Proposed — not effective | PG-005, PG-006, PG-011 | The read side is confirmed by BR-004; registration, test, and allowlist are designed conditionally and denied |
| FLOW-006 Task definition and publication | Proposed — not effective | PG-007, PG-012, then PG-008 | The run side is confirmed by BR-005 and FLOW-003; authoring is designed conditionally and denied |

No page exists without a mapped CAP and flow. No flow exists without at least one page.

### 3.4 Route, deep-link, and back rules

- Route keys are the business unique keys: conversation reference (ENT-003), skill name (ENT-006), server name (ENT-008), task name (ENT-011), and run reference (ENT-014). A route carries no owner account identifier.
- An unrecorded skill or MCP server reference resolves to No Result, not to an empty record and not to a create form. This follows BR-003 and BR-004. The skill read maps to FLOW-004 N5; the server read is the CAP-003 read side, and FLOW-005 has no member-read step.
- An unrecorded task reference resolves to No Result and offers only Back to Tasks. No run form is rendered. This follows BR-005 and FLOW-003 N1.
- A run reference that does not resolve, or that belongs to another account, resolves to the same generic “not available” panel. The page does not disclose whether the run exists. This follows the `own-only` cells of BM §6.2 and BR-008; FLOW-003 N6/N7 is the read path.
- A conversation reference that does not resolve, or that belongs to another account, resolves to the same generic unavailable panel inside PG-002. The conversation list remains usable. This follows BR-002 and FLOW-002 N1.
- No route accepts a search or filter query. No search or filter is confirmed, so there is no query-string state and no “No Result from a query” state. No Result is reserved for an unresolvable business reference.
- The URL is never the authority for permission. A route that is pasted into the address bar still resolves to No Permission or No Result according to the session and the record.

### 3.5 Page count and status summary

| Status | Pages | Count |
|---|---|---|
| Confirmed, interactive pages | PG-001, PG-002, PG-008, PG-009 | 4 |
| Confirmed read-only registry pages | PG-003, PG-004, PG-005, PG-006, PG-007 (PG-007 adds the Run entry to PG-008) | 5 |
| Proposed and denied | PG-010, PG-011, PG-012 | 3 |
| **Total** | **PG-001 to PG-012** | **12** |

## 4. Core task flows

Each flow is written as **user action → system response → page change**. The business-model step identifiers are preserved so a reviewer can trace every row to FLOW-001 to FLOW-006. Every primary step and every exception carries a `BR-nnn` and `FLOW-nnn` tag.

### 4.1 FLOW-001 — Local sign-in and session

**Status:** Confirmed — BR-001. **Pages:** PG-001 → PG-002. **Preconditions:** a local account exists and the person is not signed in.

**Primary flow**

| BM step | User action | System response | Page change | Tag |
|---|---|---|---|---|
| N1 | At PG-001, the person enters a sign-in name and a credential and activates Sign in | The system accepts the submission for local verification, shows a submitting state, and reveals nothing about whether the account exists | PG-001 changes from Default to Submitting; the credential field is masked | BR-001; FLOW-001 N1 |
| D1 | — | The system verifies the local credential and returns valid or invalid | PG-001 remains in Submitting; no other page is shown while the result is unknown | BR-001; FLOW-001 D1 |
| N2 | — | On a valid credential, the system creates a session and binds the account as the actor | PG-001 → PG-002 on success; the sign-in page is not retained in the Back history as a usable page | BR-001; FLOW-001 N2 |
| N3 | The person enters the workspace | The workspace shell renders with the person’s own conversation list and the Chat destination active | PG-002 Default; focus moves to the main region heading, not to the composer | BR-001; FLOW-001 N3 |

**Exceptions and recovery**

| BM step | Trigger | System response | Recovery path | Destination page | Tag |
|---|---|---|---|---|---|
| F1 | Invalid credential | Returns a generic denial. No session is created. The message does not reveal whether the account exists | C1: retry. The sign-in name is retained, the credential is cleared, and focus returns to the credential field | PG-001 | BR-001; FLOW-001 F1, C1 |
| F2 | Session creation fails | Returns an error and creates no session. The page remains usable | C1: retry the sign-in | PG-001 | BR-001; FLOW-001 F2, C1 |
| C1 | The person cannot complete sign-in | The page states that account help is available from an account administrator. There is no in-product account-help page because account administration is CAP-021 and is excluded | The in-product recovery is retry at PG-001. The account-help branch terminates at the product boundary; it is an explicit out-of-scope termination, not a dangling branch | PG-001 for retry; **no page** for account help (to be registered, §8.2) | BR-001; FLOW-001 C1; `TBD-BIZ-004`, `TBD-BIZ-013` |

**Flow notes**

- If an authenticated person opens PG-001, the page resolves immediately to PG-002. No second session is implied.
- The page has no SSO control, no “forgot credential” link, no role selection, and no invitation flow. CAP-007 and CAP-021 are excluded.
- The generic denial is a deliberate no-leak rule. The UI MUST NOT use “account not found”, “wrong password”, or a field-specific existence hint.
- Disabled-account behaviour is not designed as a distinct page state. The account lifecycle is STATE-006, which is proposed, and BR-001 does not define a message. If the system denies the credential, PG-001 shows the same generic denial.

### 4.2 FLOW-002 — Chat message and assistant response

**Status:** Confirmed — BR-002. **Pages:** PG-002, with PG-001 only for inactive-session recovery. **Preconditions:** an active local-account session and at least one conversation, or the ability to create one.

**Primary flow**

| BM step | User action | System response | Page change | Tag |
|---|---|---|---|---|
| N1 | At PG-002, the person opens an existing own conversation or activates New chat | The system checks the active session and loads only the person’s own conversation. A new conversation starts with no messages | PG-002 Loading → Default. An inactive session goes to F1 | BR-002; FLOW-002 N1 |
| N2 | The person types a non-empty message and activates Send or presses Enter | The system accepts the message for processing. The message appears as a pending user turn and the composer locks. No assistant message is shown yet | PG-002 Submitting. The pending turn is visibly “Sending”, not “Sent” | BR-002; FLOW-002 N2 |
| D1 | — | The system checks the session and the message validity | PG-002 remains in Submitting | BR-002; FLOW-002 D1 |
| N3 | — | The system sends the prompt to the configured model | PG-002 shows one pending assistant turn with a live “Assistant is responding” status. No invented text is rendered | BR-002; FLOW-002 N3 |
| D2 | — | The system checks whether a response was received | PG-002 remains in the pending assistant state | BR-002; FLOW-002 D2 |
| N4 | — | On success, the system appends exactly one assistant message. The pending user turn becomes sent | PG-002 Default with one new assistant message; the composer unlocks and focus returns to it | BR-002; FLOW-002 N4 |
| N5 | The person reads the answer | No further system action is required | PG-002 remains Default; the thread is not re-ordered or auto-scrolled away from the answer | BR-002; FLOW-002 N5 |

**Exceptions and recovery**

| BM step | Trigger | System response | Recovery path | Destination page | Tag |
|---|---|---|---|---|---|
| F1 | Empty message | Rejects the message. No user turn and no assistant turn are created. An inline error appears at the composer | C1: type a non-empty message and resend | PG-002 | BR-002; FLOW-002 F1, C1 |
| F1 | Inactive session | Rejects the message and creates no turn. The page states that the session has ended | Re-authenticate at PG-001, then return to PG-002 and reopen the conversation. The unsent composer text is not preserved across re-authentication because it exists only in the current page session | PG-001 → PG-002 | BR-002; FLOW-002 F1 |
| F2 | Model timeout, provider error, or failure to append the assistant message | Removes the pending assistant turn, keeps the person’s message if it was accepted, and shows an error. No assistant message is appended and no partial answer is presented as complete | C2: “Try again” prefills the composer with the same text. Sending is a new message attempt; the original message remains | PG-002 | BR-002; FLOW-002 F2, C2 |
| C1 | Correctable rejection | The person edits the message | Resend at PG-002 | PG-002 | BR-002; FLOW-002 C1 |
| C2 | Model or append failure | The person retries | A new attempt at PG-002. No automatic retry is performed | PG-002 | BR-002; FLOW-002 C2 |

**Flow notes**

- The only stated validity condition is `message.text.length > 0`. The UI rejects zero-length input and does not add a stricter whitespace rule that the business model does not state.
- The composer is locked while one message is pending, so a second send cannot interleave and produce a second assistant message for the first prompt. This is a design rule supporting BR-002; it does not add a queue or a scheduling capability.
- Leaving PG-002 while a response is pending does not cancel it. On return, the conversation shows the reported outcome. No cancel control is specified because cancellation is not stated in the business model.
- The chat header shows the conversation reference, not a generated title, model name, token count, or owner name. Those are not stated fields or are denied by BM §6.2.
- Copying an answer is not a product capability in this design; no copy, edit, pin, rename, or delete control is rendered.

### 4.3 FLOW-003 — Manual task run

**Status:** Confirmed for initiation and outcome — BR-005, BR-006, BR-008. **Pages:** PG-007 → PG-008 → PG-009, with PG-001 only for inactive-session recovery. **Preconditions:** an active session and a recorded task definition. Step execution remains dependent on `TBD-BIZ-007`, but initiation, attribution, and terminal outcome are confirmed.

**Primary flow**

| BM step | User action | System response | Page change | Tag |
|---|---|---|---|---|
| N1 | At PG-007, the person activates Run on a recorded task | The system loads the recorded task definition and its declared input form in read-only form | PG-007 → PG-008 Loading → Default | BR-005; FLOW-003 N1 |
| N2 | The person fills the declared inputs and activates Start run | The system accepts the submission for validation, locks the inputs, and shows a starting state | PG-008 changes to Submitting | BR-005; FLOW-003 N2 |
| D1 | — | The system validates the inputs and the active session | PG-008 remains in Submitting | BR-005; FLOW-003 D1 |
| N3 | — | The system creates one run, binds the initiating account, records the task version, and places the run in `Initiated` | PG-008 → PG-009 on success. The run reference is visible immediately | BR-005, BR-006; FLOW-003 N3 |
| N4 | — | The system executes the next step and reports the step state | PG-009 shows `Running` and the current step status; the page updates in place | BR-005; FLOW-003 N4 |
| D2 | — | The system decides whether to continue, succeed, or fail | PG-009 remains in the reported non-terminal or terminal state | BR-008; FLOW-003 D2 |
| N5 | — | When the last step succeeds, the system finalizes the run as `Succeeded` | PG-009 changes to the Success outcome; the status is announced in a polite live region | BR-008; FLOW-003 N5 |
| N6 | The person reads the outcome and step results | No further system action is required | PG-009 remains Default; Start a new run and Back to Tasks remain available | BR-008; FLOW-003 N6 |

**Exceptions and recovery**

| BM step | Trigger | System response | Recovery path | Destination page | Tag |
|---|---|---|---|---|---|
| F1 | No recorded task, or an unrecorded task reference | Rejects the run and creates no run. No input form is rendered | C1: return to PG-007 and select a recorded task | PG-008 → PG-007 | BR-005; FLOW-003 F1, C1 |
| F1 | Invalid declared inputs | Rejects the run and creates no run. Field errors appear adjacent to the inputs | C1: correct the inputs and start a new submission | PG-008 | BR-005; FLOW-003 F1, C1 |
| F1 | Inactive session | Rejects the run and creates no run | Re-authenticate at PG-001, then return to PG-007 and reselect the task. Entered inputs are not preserved because they exist only in the current page session | PG-001 → PG-007 | BR-005; FLOW-003 F1 |
| F2 | Run creation failure, or a run rejected before any step | Two outcomes are distinguished. If no run is created, the page shows an error and keeps the entered inputs. If a run is created and the runner rejects it before any step, the run is finalized as `Failed` and no step results are recorded | No-run case: retry the submission at PG-008. Created-then-rejected case: N7 reads the `Failed` run at PG-009 with no step results; C2 starts a new run after the cause is corrected | PG-008 for no run; PG-009 → PG-008 for a created-then-rejected run | BR-005, BR-008; FLOW-003 F2, N7, C2 |
| F2 | Step failure or timeout | Finalizes the run as `Failed`, records the failed step, marks remaining steps `Skipped`, and makes the failed step visible | N7: the person reads the failed outcome. C2: Start a new run returns to PG-008 for the same task; it creates a new run, not a retry of the failed one | PG-009 → PG-008 | BR-008; FLOW-003 F2, N7, C2 |
| F2 | Terminal outcome cannot be reported | Does not present a terminal state as fact. The page keeps the last reported state and shows an error with a refresh action | Refresh PG-009. If the system later reports `Failed`, the page shows Failure; it does not invent `Succeeded` | PG-009 | BR-008; FLOW-003 F2 |

**Flow notes**

- “Run created” and “run succeeded” are separate outcomes. PG-008 ends at a created run; PG-009 owns the run’s success or failure. The interface MUST NOT show a success message on submission.
- There is no automatic retry, no schedule, no approval, no branching, and no artifact download. CAP-006, CAP-014, CAP-012, and the `Artifact.read` denial are respected.
- A failed run is never mutated into a successful one. Start a new run is the only recovery that creates new work.
- A run created in `Initiated` can be finalized as `Failed` by the runner before any step (STATE-001). PG-009 shows `Failed` with no step results and a generic rejection notice; this is distinct from a submission that creates no run and stays on PG-008.
- The run outcome page is reached from the submission that created it. No Runs index exists because CAP-009 is excluded; a later visit requires the run reference. This is a scope consequence, not a navigation omission.

### 4.4 FLOW-004 — Skill registration and publication (proposed, not effective)

**Status:** Proposed — not effective. BR-003 confirms that the registry lists recorded skills, but no role has an effective grant to create or publish one. `TBD-BIZ-004` is open; CAND-008 (isolated draft test) is not effective.

**Effective gate**

| Entry | Effective result | Destination | Tag |
|---|---|---|---|
| Any attempt to open PG-010, by URL or by a future link | No Permission panel. No draft is created, no test runs, no version is published | PG-003 | BR-003; FLOW-004; `TBD-BIZ-004` |
| Any attempt to publish from PG-003 or PG-004 | The action is not rendered. No disabled publish button is shown | PG-003 or PG-004 | BR-003; FLOW-004 N4 |

**Conditional target flow (not reachable until `TBD-BIZ-004` closes)**

| BM step | User action | System response | Page change | Tag |
|---|---|---|---|---|
| N1 | A proposed ROLE-002 opens the skill form | The system checks authority. With a future grant, it opens a draft; without one, F2 applies | PG-003 → PG-010 Default | BR-003; FLOW-004 N1; `TBD-BIZ-004` |
| N2 | The person enters name, description, instructions, input definition, and declared tool dependencies | The system records a draft and keeps it while the person works | PG-010 Editing | BR-003; FLOW-004 N2 |
| D1 | — | The system validates required content | PG-010 remains Editing on success; F1 on failure | BR-003; FLOW-004 D1 |
| N3 | The person tests the skill with a sample input in an isolated draft conversation | The system returns a test result. CAND-008 is not effective, so this step is conditional on a future confirmation | PG-010 Editing with the test result | BR-003; FLOW-004 N3; CAND-008; `TBD-BIZ-007` |
| D2 | — | The system checks publication authority and validation | PG-010 Submitting | BR-003; FLOW-004 D2; `TBD-BIZ-004` |
| N4 | — | The system publishes an immutable version | PG-010 → PG-003 or PG-004 Default with the new version | BR-003; FLOW-004 N4 |
| N5 | A member sees the skill in the registry | The recorded skill appears in the list | PG-003 or PG-004 | BR-003; FLOW-004 N5 |

**Exceptions and recovery**

| BM step | Trigger | System response | Recovery path | Destination page | Tag |
|---|---|---|---|---|---|
| F1 | Validation failure or test failure | Keeps the draft and shows errors. Nothing is published | C1: correct and resubmit | PG-010 | BR-003; FLOW-004 F1, C1 |
| F2 | Missing authority | Denies publication and keeps the draft | C2: request publication authority. No in-product authority-request page exists; the branch terminates at the product boundary | PG-010 for the retained draft; **no page** for authority request (to be registered, §8.2) | BR-003; FLOW-004 F2, C2; `TBD-BIZ-004` |
| F2 | Publication failure | Denies publication and keeps the draft. No partial version is shown | Correct and resubmit, or retry publication | PG-010 | BR-003; FLOW-004 F2 |
| N5 | Registry unavailable | Shows the registry Error state. The published version is not represented as absent | C1: retry the registry read | PG-003 | BR-003; FLOW-004 N5 |

**Flow notes**

- The effective UI never presents a skill draft, a test result, or a publish confirmation. PG-010 is a documented target, not an available product surface.
- A future correction creates a new version; an immutable version is not overwritten. This is stated by the business model’s version invariant and is repeated in the confirm/undo rules.
- Declared tool dependencies are not rendered on the confirmed PG-004 because the `McpTool` read question is unresolved (§8.2).

### 4.5 FLOW-005 — MCP server registration and allowlisting (proposed, not effective)

**Status:** Proposed — not effective. BR-004 confirms the registry and deny-on-unrecorded behavior, but registration, testing, and allowlisting have no effective grant. `TBD-BIZ-004` and `TBD-BIZ-007` are open.

**Effective gate**

| Entry | Effective result | Destination | Tag |
|---|---|---|---|
| Any attempt to open PG-011 | No Permission panel. No server draft is created and no connection test runs | PG-005 | BR-004; FLOW-005; `TBD-BIZ-004` |
| Any attempt to add, test, or allowlist from PG-005 or PG-006 | The action is not rendered | PG-005 or PG-006 | BR-004; FLOW-005 N1, N4 |

**Conditional target flow (not reachable until `TBD-BIZ-004` closes)**

| BM step | User action | System response | Page change | Tag |
|---|---|---|---|---|
| N1 | A proposed ROLE-002 opens the MCP server form | The system checks authority. With a future grant, it opens a server draft; without one, F2 applies | PG-005 → PG-011 Default | BR-004; FLOW-005 N1 |
| N2 | The person enters name, connection type, endpoint reference, auth reference, and timeout | The system records a server draft. No credential value is accepted for display | PG-011 Editing | BR-004; FLOW-005 N2 |
| D1 | The person tests the connection | The system reports success, failure, or needs authentication | PG-011 Editing with the connection result | BR-004; FLOW-005 D1 |
| N3 | — | On success, the system discovers tools | PG-011 shows the conditional tool list; displaying individual tools requires a future McpTool read grant | BR-004; FLOW-005 N3 |
| N4 | The person allowlists individual tools | The system records the allowed tool set | PG-011 Editing with the allowlist saved | BR-004; FLOW-005 N4 |
| D2 | A tool call is checked against the allowlist | The system allows or denies the call. **No tool-call UI is designed**, because CAP-036 and CAP-014 are excluded | No page change; there is no interactive call surface | BR-004; FLOW-005 D2 |
| N5 | An allowed call would invoke a tool | Not designed. Invocation is excluded from the confirmed MVP | No page | BR-004; FLOW-005 N5; `TBD-BIZ-007` |

The registry read side is not a FLOW-005 step: BR-004 and CAP-003 confirm that a recorded server and its recorded health are visible. PG-005 and PG-006 are that read side; FLOW-005 supplies only the proposed registration, test, and allowlist context.

**Exceptions and recovery**

| BM step | Trigger | System response | Recovery path | Destination page | Tag |
|---|---|---|---|---|---|
| F1 | Connection failure | Records error health and exposes no tools. The draft is kept | C1: correct the connection and retest | PG-011 | BR-004; FLOW-005 F1, C1 |
| F2 | Missing authority, or a call to a non-allowlisted tool | Denies the action and shows an error. No tool is invoked | C2: request an allowlist or authority change. No in-product request page exists; the branch terminates at the product boundary | PG-011 for the retained draft; **no page** for the request (to be registered, §8.2) | BR-004; FLOW-005 F2, C2; `TBD-BIZ-004`, `TBD-BIZ-007` |
| D1 | Test reports missing authentication | Records `Needs authentication` health and exposes no tools | Correct the auth reference and retest | PG-011 | BR-004; FLOW-005 D1 |

**Flow notes**

- Credential values are never displayed. The page shows only that an auth reference exists. ENT-010 and CAND-021 both support this; no secret value is a field in this design.
- The run-context rail and tool receipt from the prototype are not designed. The call-time denial in FLOW-005 D2 is a business behavior with no confirmed interactive surface in this MVP.
- The registry read side uses the health vocabulary of STATE-004, which is proposed. The page shows “recorded health”; it does not offer a health transition control.

### 4.6 FLOW-006 — Task definition and publication (proposed, not effective)

**Status:** Proposed — not effective. BR-005 confirms the run object, but task authoring and publication have no effective grant. `TBD-BIZ-004` is open; CAND-009 (test run before publish) is not effective.

**Effective gate**

| Entry | Effective result | Destination | Tag |
|---|---|---|---|
| Any attempt to open PG-012 | No Permission panel. No task draft is created and no test run starts | PG-007 | BR-005; FLOW-006; `TBD-BIZ-004` |
| Any attempt to create or publish a task from PG-007 | The action is not rendered | PG-007 | BR-005; FLOW-006 N1, N4 |

**Conditional target flow (not reachable until `TBD-BIZ-004` closes)**

| BM step | User action | System response | Page change | Tag |
|---|---|---|---|---|
| N1 | A proposed ROLE-002 opens the task form | The system checks authority. With a future grant, it opens a task draft; without one, F2 applies | PG-007 → PG-012 Default | BR-005; FLOW-006 N1 |
| N2 | The person enters name, description, input definition, ordered steps, and step parameters | The system records a draft. Steps remain a linear ordered list; no branch or loop control exists | PG-012 Editing | BR-005; FLOW-006 N2 |
| D1 | — | The system validates the input definition and step references. A task with no steps, or with an unregistered target, is invalid | PG-012 remains Editing on success; F1 on failure | BR-005; FLOW-006 D1 |
| N3 | The person test-runs the draft with sample inputs | The system returns a test result. CAND-009 is not effective, so this step is conditional | PG-012 Editing with the test result | BR-005; FLOW-006 N3; CAND-009; `TBD-BIZ-007` |
| D2 | — | The system checks publication authority and validation | PG-012 Submitting | BR-005; FLOW-006 D2 |
| N4 | — | The system publishes a task version | PG-012 → PG-007 Default with the new task | BR-005; FLOW-006 N4 |
| N5 | A member sees the task available for a manual run | The recorded task appears in PG-007 and can open PG-008 | PG-007 or PG-008 | BR-005; FLOW-006 N5 |

**Exceptions and recovery**

| BM step | Trigger | System response | Recovery path | Destination page | Tag |
|---|---|---|---|---|---|
| F1 | Validation failure, test failure, zero steps, or an unregistered step target | Keeps the draft and shows errors. Nothing is published | C1: correct and resubmit | PG-012 | BR-005; FLOW-006 F1, C1 |
| F2 | Missing authority | Denies publication and keeps the draft | C2: request publication authority. No in-product request page exists; the branch terminates at the product boundary | PG-012 for the retained draft; **no page** for the request (to be registered, §8.2) | BR-005; FLOW-006 F2, C2; `TBD-BIZ-004` |
| F2 | Publication failure | Denies publication and keeps the draft. No partial version is shown | Correct and resubmit, or retry publication | PG-012 | BR-005; FLOW-006 F2 |
| N5 | Registry unavailable | Shows the task registry Error state. The published task is not represented as absent | C1: retry the registry read | PG-007 | BR-005; FLOW-006 N5 |

**Flow notes**

- The editor has no branching, loop, schedule, approval, or template control. CAP-006, CAP-012, CAP-014, and CAP-020 are excluded.
- A task step references exactly one recorded Skill Version or MCP Tool (ENT-013). The conditional editor enforces that reference in its validation, but the effective UI never renders the editor.
- A published version is not overwritten; a correction creates a new version. This is repeated in §5.3.

### 4.7 Exception-to-primary mapping and branch closure

Every exception below maps back to a confirmed or proposed primary flow. “Product boundary” means the branch leaves the product because the business model provides no in-product destination; it is not an unclosed branch.

| Primary flow | Exception | Trigger | Recovery | Destination | Closure |
|---|---|---|---|---|---|
| FLOW-001 | F1 | Invalid credential | C1 retry | PG-001 | Closed |
| FLOW-001 | F2 | Session creation failure | C1 retry | PG-001 | Closed |
| FLOW-001 | C1 account help | Credential cannot be used | Static instruction; no in-product help | None — product boundary | Closed at boundary; gap in §8.2 |
| FLOW-002 | F1 empty message | Zero-length message | C1 correct and resend | PG-002 | Closed |
| FLOW-002 | F1 inactive session | No active session | Re-authenticate, reopen conversation | PG-001 → PG-002 | Closed |
| FLOW-002 | F2 model or append failure | No response, timeout, or append failure | C2 new attempt | PG-002 | Closed |
| FLOW-002 | C1 | Correctable rejection | Edit and resend | PG-002 | Closed |
| FLOW-002 | C2 | Model or append failure | New attempt | PG-002 | Closed |
| FLOW-003 | F1 unrecorded task | Task not recorded | C1 select a recorded task | PG-008 → PG-007 | Closed |
| FLOW-003 | F1 invalid inputs | Declared input validation fails | C1 correct and resubmit | PG-008 | Closed |
| FLOW-003 | F1 inactive session | No active session | Re-authenticate, reselect task | PG-001 → PG-007 | Closed |
| FLOW-003 | F2 creation failure | No run created, or a run created then rejected before any step | Retry at PG-008 for no run; read the Failed run at PG-009 for a created-then-rejected run, then C2 starts a new run after correction | PG-008 or PG-009 → PG-008 | Closed |
| FLOW-003 | F2 step failure | Step failed or timed out | N7 read failure; C2 start a new run | PG-009 → PG-008 | Closed |
| FLOW-003 | F2 unreported terminal outcome | No terminal report | Refresh; never invent a terminal state | PG-009 | Closed |
| FLOW-004 | F1 | Validation or test failure | C1 correct and resubmit | PG-010 | Closed (conditional) |
| FLOW-004 | F2 | Missing authority or publication failure | C2 authority request; see C2 | PG-010 | Closed (conditional) |
| FLOW-004 | C1 | Validation or test error | Correct and resubmit | PG-010 | Closed (conditional) |
| FLOW-004 | C2 | Missing authority | Request publication authority | None — product boundary | Closed at boundary; gap in §8.2 |
| FLOW-004 | N5 registry unavailable | Registry read fails | Retry | PG-003 | Closed |
| FLOW-005 | F1 | Connection failure or needs authentication | C1 correct and retest | PG-011 | Closed (conditional) |
| FLOW-005 | F2 | Missing authority or non-allowlisted call | C2 request change; see C2 | PG-011 | Closed (conditional) |
| FLOW-005 | C1 | Connection failure | Correct the connection and retest | PG-011 | Closed (conditional) |
| FLOW-005 | C2 | Non-allowlisted call or missing authority | Request an allowlist or authority change | None — product boundary | Closed at boundary; gap in §8.2 |
| FLOW-006 | F1 | Validation, test, zero steps, or unregistered target | C1 correct and resubmit | PG-012 | Closed (conditional) |
| FLOW-006 | F2 | Missing authority or publication failure | C2 authority request; see C2 | PG-012 | Closed (conditional) |
| FLOW-006 | C1 | Validation or test error | Correct and resubmit | PG-012 | Closed (conditional) |
| FLOW-006 | C2 | Missing authority | Request publication authority | None — product boundary | Closed at boundary; gap in §8.2 |
| FLOW-006 | N5 registry unavailable | Registry read fails | Retry | PG-007 | Closed |

**No dangling branches:** every exception either reaches a page, returns to the page that owns the primary flow, or terminates explicitly at the product boundary because no in-product destination is confirmed. The product-boundary terminations are listed as gaps in §8.2 and are not represented by a fabricated page.

## 5. Interaction rules

These rules apply across pages. A rule marked **Design rule** is a UI convention, not a business rule; it cannot grant a permission or create a record.

### 5.1 Form validation

| Form and page | Fields (business source) | Required and format rule | Timing and placement | Failure behavior | Status | Tag |
|---|---|---|---|---|---|---|
| Sign-in — PG-001 | Sign-in name; credential (BR-001 Inputs) | Both fields are required. No length, character, or credential-format rule is stated in the business model, so none is invented | Validate on submit. A missing field shows an adjacent error and moves focus to the first invalid field. Do not validate credential content as the person types | No session and no account-existence signal. Keep the sign-in name, clear the credential, and show one generic denial for any credential failure | Confirmed | BR-001; FLOW-001 |
| Chat composer — PG-002 | Message text (BR-002) | A zero-length message is rejected. The business-model condition is `message.text.length > 0`; the UI does not add a whitespace-only rule that the model does not state | Validate on submit. The error appears at the composer and the text is preserved. Clear the error as soon as the text becomes non-empty | No user turn and no assistant turn. Focus returns to the composer | Confirmed | BR-002; FLOW-002 |
| Task run — PG-008 | Declared inputs of the recorded task (BR-005; FLOW-003 N2) | Requiredness and format come from the task’s declared input definition. This document does not invent an input-type vocabulary or a format that the definition does not state | Validate on blur and on submit. Field errors are adjacent; a summary appears above Start run when more than one input fails. Focus moves to the first invalid input | No run is created. Keep every entered value so the person can correct it. The page stays on PG-008 | Confirmed | BR-005; FLOW-003 N2 |
| Skill editor — PG-010 | Name; description; instructions; input definition; declared tool dependencies (FLOW-004 N2) | Required content is the set stated by FLOW-004 N2. No additional length, naming, or dependency-count rule is invented | Conditional only. Validate on submit; keep the draft; focus the first invalid field | Conditional only. Keep the draft and publish nothing | Proposed — not effective | BR-003; FLOW-004 N2 |
| MCP server editor — PG-011 | Name; connection type; endpoint reference; auth reference; timeout (FLOW-005 N2) | The six stated fields are required. No transport value, timeout unit, or numeric range is invented; the conditional control records the value without a client-invented bound | Conditional only. Validate on submit; keep the draft | Conditional only. Keep the draft; run no connection test until required fields are present | Proposed — not effective | BR-004; FLOW-005 N2 |
| Task editor — PG-012 | Name; description; input definition; ordered steps; step parameters (FLOW-006 N2) | At least one step is required by the STATE-005 publish guard `step_count >= 1`. Each step references exactly one recorded Skill Version or MCP Tool (ENT-013). Ordinals are contiguous. No branch, loop, or template field is added | Conditional only. Validate on submit and when a step target changes; keep the draft | Conditional only. Keep the draft; publish nothing | Proposed — not effective | BR-005; FLOW-006 N2 |

Cross-form rules:

1. **No invented format.** If the business model does not state a maximum length, a pattern, a unit, or a numeric range, the interface does not impose one. A future constraint must be registered as a business or design decision, not guessed.
2. **Validation is a convenience, not an authority.** A client-side pass does not guarantee a run, a version, or a session. A denial or validation failure reported by the system overrides the client state and is shown without a partial change.
3. **Preserve the person’s input.** A failed submission keeps the entered values except the credential, which is cleared on sign-in failure. The interface never silently resets a form.
4. **Error placement.** One error sits next to its field. Multiple errors add a summary above the primary action, with each summary item moving focus to its field. Errors use text, not colour alone.
5. **No error leak.** Validation and permission messages never contain a credential, a secret reference value, an account-existence signal, a provider stack trace, or another account’s data.

### 5.2 Operation feedback and loading

| Surface | Pending state | Success state | Failure state | Tag |
|---|---|---|---|---|
| Sign-in — PG-001 | Sign in is disabled and its label becomes “Signing in…”. Both fields are read-only. The status region announces the wait. No full-page overlay | PG-002 Default. The sign-in page is left behind | PG-001 with a generic error. The credential is cleared; the sign-in name is kept | BR-001; FLOW-001 |
| Chat send — PG-002 | The user turn shows “Sending”; one pending assistant turn shows “Assistant is responding”; the composer is disabled. No assistant text is invented | Exactly one assistant message is appended. The composer unlocks and the new answer is announced | The pending assistant turn is removed. The user message remains if accepted. An error with “Try again” appears | BR-002; FLOW-002; NFR-001 proposed |
| Run submission — PG-008 | Start run is disabled and its label becomes “Starting run…”. Inputs are locked. No run outcome is shown on this page | PG-009 opens with the run reference and the reported state | PG-008 stays with an inline error. If the failure is an input error, the fields are marked; if no run is created, the values are kept. If a run is created and rejected before any step, PG-009 opens as `Failed` with no step results | BR-005, BR-006; FLOW-003 |
| Run status — PG-009 | The page shows `Initiated` or `Running` with the current step states. It does not show a terminal outcome early | `Succeeded` with every step succeeded | `Failed` after a step failure with the failed step visible and remaining steps `Skipped`, or `Failed` before any step with no step results and a generic rejection notice. If no terminal report arrives, show Error, not an invented result | BR-008; FLOW-003; NFR-003 proposed |
| Registry or record read — PG-003 to PG-007 | A layout-matched skeleton: the page header and count placeholder remain; cards or rows are placeholders. The count shows “—” rather than 0 | The Default state with the recorded data and the correct count | An error panel with Retry. The page MUST NOT fall back to an Empty state that implies zero records | BR-003, BR-004, BR-005; NFR-002 proposed |
| Proposed publish — PG-010, PG-012 | Conditional only. Publish is disabled and labelled with the operation | Conditional only. PG-003/PG-004 or PG-007 shows the immutable version | Conditional only. The draft is kept and the error is shown | BR-003, BR-005; FLOW-004, FLOW-006 |
| Proposed connection test or allowlist save — PG-011 | Conditional only. Test connection and Save are disabled and labelled with the operation | Conditional only. PG-005/PG-006 shows the recorded health; the tool list remains subject to a future McpTool read grant | Conditional only. The draft is kept, error health is recorded, and no tools are exposed | BR-004; FLOW-005 D1, N4 |

Feedback rules:

- **No fabricated success.** A chat answer is not rendered until the system reports a successful response. A run is not shown as `Succeeded` until every step is reported succeeded. A published version is not shown until the publication is reported.
- **No fabricated emptiness.** A failed load is an Error, not an Empty state. The count is never shown as zero while the data is unknown.
- **No full-page blocking overlay for a normal submit.** The page header and context stay visible; only the submitting control and its form are locked.
- **Polite announcements.** Sign-in result, chat completion, run state change, and save result are announced through a polite live region. The chat thread itself is not a live region.
- **Stale status is visible.** If a run status refresh fails, the page keeps the last reported state and marks it “Status unavailable” with a Retry. It does not guess.
- **Leaving a pending operation does not cancel it.** On return, the page reflects the reported outcome. No cancel control is designed because cancellation is not stated in the business model.

### 5.3 Confirmation and undo

| Action | Confirmation | Undo | Irreversible effect | Source |
|---|---|---|---|---|
| Sign in | None | Not applicable | Creates a session; no record is changed | BR-001; FLOW-001 |
| Send a chat message | None. The composer is the confirmation | None. No edit, delete, pin, rename, or undo. CAP-018 is excluded | A user message and, on success, one assistant message are appended | BR-002; FLOW-002; ENT-004 immutability proposed |
| Start a run | None beyond the explicit Start run action. The input form is the review step | None. A failed run cannot be edited or retried in place | One run with one initiator and one task version is created | BR-005, BR-006; FLOW-003 |
| Publish a skill version (proposed) | A confirmation summarising that the version becomes immutable and that a later correction creates a new version | None. No rollback or overwrite is shown | A new immutable version would be created; not effective today | BR-003; FLOW-004 N4 |
| Publish a task version (proposed) | A confirmation summarising that the version becomes immutable and that a later correction creates a new version | None | A new immutable task version would be created; not effective today | BR-005; FLOW-006 N4 |
| Test a connection (proposed) | None | Not applicable; the test can be repeated | Records health and may discover tools; no publication | BR-004; FLOW-005 D1 |
| Change an allowlist (proposed) | Explicit Save in the conditional editor. No destructive removal semantics are confirmed | No undo is shown | The allowed tool set would change; not effective today | BR-004; FLOW-005 N4; `TBD-BIZ-004` |
| Discard unsent composer or run input | A confirmation “Discard unsent text?” with Stay and Discard when the person leaves a non-empty form | No undo | The unsent text is lost; it exists only in the current page session | Design rule |
| Sign out | No control is rendered | Not applicable | Session termination is not stated in the business model | Gap in §8.2 |
| Delete any record | Not rendered. No delete capability is stated in the business model | Not applicable | None | No in-MVP delete action; CAP-018 and CAP-021 cover only excluded history and account surfaces |

Rules:

- **Confirm only irreversible or hard-to-reverse actions.** Chat send and run start are explicit actions, not dialogs. The proposed skill and task publish actions are the only actions that need a confirmation because each would create an immutable version.
- **No “undo” that reverses a business outcome.** A failed run is not undone; a new run is started. A published version is not overwritten; a new version is created.
- **No destructive affordance is shown “for later”.** A greyed-out Delete or Publish button is not used. Denied capabilities are absent, not teased.

### 5.4 Duplicate-submit prevention

| Operation | Guard | After success | After failure or lost result | Tag |
|---|---|---|---|---|
| Sign in | Disable Sign in on activation; ignore a second activation from click or Enter | PG-002 is the only destination | Stay on PG-001 with a generic error; no session is assumed | BR-001; FLOW-001 |
| Send a chat message | Disable the composer while one message is pending; one in-flight message per conversation | Exactly one assistant message is appended; composer unlocks | Pending assistant turn is removed; the person can send a new attempt. No automatic resend | BR-002; FLOW-002 |
| Start a run | Disable Start run on activation; ignore a second activation; one run per activation | PG-009 shows the run reference | Stay on PG-008 with an error. If no run reference is returned, the page explicitly says the run start is unconfirmed and MUST NOT be retried blindly | BR-005, BR-006; FLOW-003 |
| Publish a skill or task version (proposed) | Disable Publish during the operation; one version per activation | The registry shows the new version | Keep the draft. If the result is unconfirmed, do not publish again without checking the registry | BR-003, BR-005; FLOW-004, FLOW-006 |
| Test a connection (proposed) | Disable Test connection during the test | Show the recorded result | Keep the draft; allow a new test | BR-004; FLOW-005 |

Duplicate-submit rules:

- **One action, one operation.** The control is disabled from the moment of activation until a terminal result is shown. The label changes to a verb in progress, not a spinner alone.
- **No automatic replay.** A reload, Back, or network recovery never re-submits a chat message, run, or publication automatically.
- **Unconfirmed run start is not a success.** If the system does not return a run reference, PG-008 shows an explicit “Run start unconfirmed” error. The person is told not to start another run and to contact the team operating the workspace. This is the interim behavior for the unregistered reconciliation gap in §8.2.
- **No queue.** A second chat message is not queued behind the first; the composer is locked. A second run is not queued from PG-008.

### 5.5 Permission behavior

| Situation | Interface behavior | Source |
|---|---|---|
| No active session | Any authenticated route resolves to PG-001. The requested route is not rendered | BR-001; FLOW-001 |
| ROLE-001 opens an own conversation | Render it as `own-only`. No owner name is needed | BR-002; FLOW-002; BM §6.2 |
| ROLE-001 opens another account’s conversation reference | Show the same generic “Conversation unavailable” panel used for a non-existent reference. Do not show a title, owner, message, or count | BR-002; FLOW-002; BM §6.2 own-only |
| ROLE-001 opens an own run | Render the run and its steps as `own-only` | BR-008; FLOW-003 N6/N7; BM §6.2 |
| ROLE-001 opens another account’s run reference | Show the same generic “This run is not available.” panel used for a non-existent reference. Do not show task, owner, state, or step | BR-008; FLOW-003 N6/N7; BM §6.2 own-only |
| ROLE-001 reads a registry | Render as `read-only`. No edit, publish, register, test, allowlist, invoke, or delete control | BR-003; FLOW-004 N5; BR-004; FLOW-005; BR-005; FLOW-003 N1; BM §6.2 |
| A denied action is visible from stale UI | The system’s denial wins. Show No Permission and make no partial change. Do not fall back to a cached success | FLOW-004, FLOW-005, FLOW-006; BM §6.2 default deny |
| A proposed authoring route is opened | Show No Permission. Do not render the form, not even in a disabled state | BR-003, BR-004, BR-005; FLOW-004, FLOW-005, FLOW-006; `TBD-BIZ-004` |
| A proposed role is bound to a session | Registry reads and every write are denied. The page shows No Permission rather than an empty list | BR-003, BR-004, BR-005; BM §6.2 |
| Account or owner identity is requested | Do not render an account name, owner name, avatar initials, or account menu. `Account.read` is denied | BR-003, BR-005; BM §6.2; §8.2 |
| A session ends during an action | Stop the action, make no partial change, and route to PG-001 with a session-ended notice. Unsent text is not preserved | BR-001, BR-002; FLOW-001, FLOW-002 |

Permission rules:

1. **Default deny.** An action with no confirmed grant is not rendered. Absence is the default, not a disabled button.
2. **Read-only means no edit affordance.** The page renders text and, where applicable, a record count. It does not render a disabled editor.
3. **Own-only means no sharing surface.** There is no share, invite, mention, or collaborative presence. A direct reference to another account’s object is indistinguishable from a missing object.
4. **No permission is not a dead end when a readable page exists.** Every No Permission page offers one route back to a page the person can read: PG-001 for an unauthenticated person, PG-002 for chat, PG-003 for skills, PG-005 for MCP, and PG-007 for tasks. A back link is rendered only when its destination is readable. A role with no confirmed read grant — every proposed role — has no readable destination; its panel offers only a neutral return to sign-in, and the workspace is not operable for that role under the current matrix.
5. **Visibility is convenience, not authority.** The UI never assumes that a visible action will succeed. The denial path is designed for every action that exists.

### 5.6 Keyboard, focus, and announcements

- The desktop shell follows the design-system accessibility rules: a skip link to the main region, a focusable main region, a visible 2px focus ring, and no focus trap outside an open dialog.
- Tab order follows the visual order: sidebar, topbar, page header, page content, primary action. A page change moves focus to the page heading; it does not move focus to the composer or to the primary action.
- **Chat:** Enter sends; Shift+Enter inserts a line break. The composer is a text area, so this matches the design system. Send is also a button for pointer and assistive use.
- **Forms:** Enter in a single-line field does not start a run or publish a version. The explicit Start run, Save, or Publish action is required. This prevents an accidental run from a field-level Enter.
- **Errors:** the first invalid field receives focus; the error summary is reachable before the fields; the error text is associated with its field.
- **Dialogs:** the proposed publish confirmation traps Tab, closes on Escape, and returns focus to the trigger. The effective pages do not open a dialog.
- **Live regions:** sign-in result, chat completion, run state change, and save result are announced politely. The chat thread is not a live region.
- **Reduced motion:** the design-system reduced-motion rule applies; no functional information depends on animation.
- **No mobile interaction.** Touch targets, bottom sheets, and the 44px mobile rules in the design system are not designed here. The desktop control baseline is 36px.

### 5.7 Copy and error-message rules

| Situation | Required behavior | Forbidden | Tag |
|---|---|---|---|
| Sign-in failure | One generic message such as “Sign-in failed. Check your sign-in name and credential.” | “Account not found”, “wrong password”, any hint that an account exists, any credential echo | BR-001; FLOW-001 F1 |
| Session ended | “Your session ended. Sign in again to continue.” | Silent redirect, retained sensitive input, a fake “sent” state | BR-001, BR-002; FLOW-001, FLOW-002 |
| Chat model failure | “The assistant could not respond. Your message was kept. Try again.” | A partial answer presented as complete, a provider name, a raw error code, a stack trace | BR-002; FLOW-002 F2 |
| Run creation failure | “The run could not be started. No run was created.” Keep the inputs | “Run started”, a fabricated run reference, a retry that silently creates a second run | BR-005; FLOW-003 F2 |
| Run failure | “Run failed at step N. Remaining steps were skipped.” Show the failed step and its error | A success message, a hidden failure, an automatic retry that mutates the run | BR-008; FLOW-003 F2, N7 |
| Run rejected before any step | “The run was rejected before any step. No step results were recorded.” | A failed-step message, invented step results, a success message | BR-008; FLOW-003 F2, N7; STATE-001 |
| Unconfirmed run start | “Run start unconfirmed. Do not start another run; contact the team operating the workspace.” | A success message, a fabricated run reference, a blind retry | BR-005, BR-006; FLOW-003 F2; §8.2 |
| Permission denial | “You do not have access to this item.” Offer one route back | “You are not an Admin”, an owner name, a count, a title, or any existence hint | BM §6.2; FLOW-004, FLOW-005, FLOW-006; §5.5 |
| Empty registry | “No skills recorded. Only recorded skills appear here.” / the equivalent for MCP servers and tasks | A “Create one” action that cannot succeed, a fake sample record, an error styling | BR-003, BR-004, BR-005; §1.4 |
| No Result | “This skill is not in the registry.” / “This server is not in the registry.” / “This task is not in the registry.” / “This run is not available.” | A create form, a partial record, an owner name, a raw identifier echo | BR-003, BR-004, BR-005; BM §6.2 |
| Load error | “This page could not load.” with Retry | An Empty state, a zero count, a cached record presented as current | BR-003, BR-004, BR-005; design rule |
| Proposed authoring | No Permission only. No explanatory promise that authoring will be enabled | A form, a disabled Publish button, a “coming soon” control | BR-003, BR-004, BR-005; FLOW-004, FLOW-005, FLOW-006; `TBD-BIZ-004` |

Copy rules:

- UI copy uses **recorded**, **run**, **step**, **conversation**, **skill**, **MCP server**, and **task** as the business model defines them.
- UI copy does not use **published**, **draft**, **deprecated**, or **superseded** as an effective skill or task state. Those are STATE-003 and STATE-005 states and are proposed. The read-only pages use “Recorded”.
- UI copy does not use **scheduled**, **automatic retry**, **approval**, **search**, **citation**, **token**, **cost**, or **audit** as if the feature existed. Those surfaces are excluded.
- No `TBD-BIZ` identifier, `CAP` identifier, or internal decision language appears in end-user copy. References belong in this document, not in the product.
- No secret value, credential, or account-existence signal appears in any message.
- A success message is shown only for the outcome that actually occurred. “Run created” is not “run succeeded”; “message accepted” is not “answer received”.

## 6. Page state matrix

### 6.1 State definitions

| State | Definition used here |
|---|---|
| **Default** | The steady state with representative recorded data or with the primary form ready |
| **Loading** | The page or its record is being retrieved. The layout is reserved with a skeleton; no count is shown as zero |
| **Empty** | The page is valid but contains no records or no messages. This is not an error |
| **No Result** | A specific business reference in the route does not resolve, or a requested record is not available. This is distinct from Empty |
| **Error** | Retrieval, submission, or status reporting failed. The page offers a safe recovery or a route back |
| **No Permission** | The role, ownership, or authority denies the page or the action. No data is disclosed |
| **Editing** | The person has unsent or unsubmitted input, or a conditional draft exists |
| **Submitting** | An operation is in flight; the primary control is disabled and duplicate activation is ignored |
| **Success-Failure** | The terminal outcome of the page’s operation, including run success and run failure |

No page omits a state silently. Where a state cannot occur, the cell says **N/A** and gives the reason.

### 6.2 PG-001 — Sign in

| State | Decision | Detail and tag |
|---|---|---|
| Default | Specified | Two fields, one primary Sign in, a static account-help note, and no SSO, recovery, or role control. The page is usable before any session exists |
| Loading | N/A | The page is a static form; it retrieves no record. Submission has its own state |
| Empty | N/A | There is no collection. Empty fields are the Default, not an Empty page state |
| No Result | N/A | The page has no record reference and no search |
| Error | Specified | Invalid credential and session-creation failure both stay on PG-001 with a generic error. The credential is cleared and focus returns to it |
| No Permission | N/A | Sign-in is the pre-session entry. Any local account may attempt it; a failed credential is an Error, not a page permission |
| Editing | Specified | The person is filling the two fields. The sign-in name is retained; the credential is never retained after a failure. No draft persistence is stated |
| Submitting | Specified | Sign in is disabled, both fields are read-only, and the status region announces the wait. A second click or Enter is ignored |
| Success-Failure | Specified | Success goes to PG-002. Failure stays on PG-001. No partial session and no account-existence signal. `[BR-001; FLOW-001]` |

### 6.3 PG-002 — Chat

| State | Decision | Detail and tag |
|---|---|---|
| Default | Specified | The sidebar shows New chat and the person’s own conversation list. The open conversation shows ordered messages, a conversation reference, “Private to you”, and the pinned composer. No title, model chip, run rail, skill picker, file control, search toggle, or message actions |
| Loading | Specified | The conversation list and the selected conversation show layout-matched skeletons. The composer is disabled until the conversation context is loaded. A load failure is Error, not an empty thread |
| Empty | Specified | Two cases: no conversations yet (“No conversations yet”) or a new conversation with no messages (serif prompt and composer). No suggested prompts and no task shortcuts, because neither is confirmed |
| No Result | Specified | A conversation reference that does not resolve, or that belongs to another account, shows the same generic “Conversation unavailable” panel inside the thread region. The conversation list remains usable; New chat is the recovery. No title or owner is disclosed |
| Error | Specified | A list or message load failure shows an error panel with Retry; the composer stays disabled until the context loads. A send failure is handled in Success-Failure, not by replacing the thread with an error page |
| No Permission | Specified | An unauthenticated visit goes to PG-001. A non-owned conversation uses the same generic panel as No Result. ROLE-001 is `own-only`; proposed roles are `denied` and never see a conversation |
| Editing | Specified | The composer contains unsent text. The text is kept for the current conversation during the session; no persistence across reload is confirmed. Leaving with unsent text asks “Discard unsent text?”. A reload loses it |
| Submitting | Specified | The user turn shows “Sending”, one assistant turn is pending, and the composer is locked. No assistant text is fabricated. A second send is impossible until the operation is terminal |
| Success-Failure | Specified | Success appends exactly one assistant message and unlocks the composer. Failure removes the pending assistant turn, keeps the accepted user message, and shows “Try again”. A partial answer is never left as complete. `[BR-002; FLOW-002]` |

### 6.4 PG-003 — Skills registry

| State | Decision | Detail and tag |
|---|---|---|
| Default | Specified | The page shows the title, recorded count, description, a read-only notice, and a card grid of recorded skills. Each card shows name, description, and a neutral “Recorded” marker. No owner, lifecycle badge, dependency list, search, filter, or New action |
| Loading | Specified | Header and count placeholders remain; cards become skeletons. The count shows “—”, not 0. No Empty state is shown before the load completes |
| Empty | Specified | Zero recorded skills is a valid state: “No skills recorded. Only recorded skills appear here.” No create action is shown because no role may create one. This is a terminal Empty state in the confirmed MVP, not an error |
| No Result | N/A | The list has no query or filter. An unrecorded skill reference does not render the list; it resolves on PG-004 |
| Error | Specified | A list load failure shows an error panel with Retry. It never falls back to Empty or zero |
| No Permission | Specified | `Skill.read` is `read-only` for ROLE-001, so the page is allowed. A session whose role has no `Skill.read` grant sees No Permission with the standard recovery in §5.5. A proposed role is `denied` in the matrix and sees No Permission, not an empty list |
| Editing | N/A | There is no inline editing. The proposed edit entry would open PG-010, which is No Permission. No disabled edit control is shown |
| Submitting | N/A | The page performs no mutating operation. The proposed publish action is not rendered |
| Success-Failure | N/A | Read success is the Default state and read failure is Error. There is no page-level terminal operation. `[BR-003; FLOW-004 N5 read side]` |

### 6.5 PG-004 — Skill record

| State | Decision | Detail and tag |
|---|---|---|
| Default | Specified | The page shows the skill name, “Recorded”, description, instructions, input definition, and a version label where one is present. The version is marked as proposed metadata. Owner, dependency list, lifecycle status, and edit/test/publish actions are absent |
| Loading | Specified | A record skeleton preserves the breadcrumb and Back to Skills. No field is shown partially as if final |
| Empty | N/A | A record page either resolves or does not. A field with no value is shown as “Not provided”, which is a field-level absence, not a page Empty state |
| No Result | Specified | An unrecorded skill name shows “This skill is not in the registry.” No record, no create action, and no partial data. Back to Skills is the only recovery. `[BR-003]` |
| Error | Specified | A record load failure shows an error panel with Retry and Back to Skills. It never renders an empty record |
| No Permission | Specified | `Skill.read` is allowed `read-only` for ROLE-001. A role without the grant sees No Permission with the standard recovery in §5.5. There is no `own-only` rule for skills |
| Editing | N/A | The record is read-only. No inline edit is rendered. The proposed edit route is PG-010 and is denied |
| Submitting | N/A | No mutating action exists on this page |
| Success-Failure | N/A | Read success is Default; read failure is Error. `[BR-003; FLOW-004 N5 read side]` |

### 6.6 PG-005 — MCP registry

| State | Decision | Detail and tag |
|---|---|---|
| Default | Specified | The page shows the title, recorded count, description, a read-only and credential-reference notice, and a card grid. Each card shows the server name, recorded health, and a credential-reference indicator. No tool name, tool count, add, test, allowlist, invoke, owner, or secret value |
| Loading | Specified | Header and count placeholders remain; cards become skeletons; the count shows “—” |
| Empty | Specified | Zero recorded servers is valid: “No MCP servers recorded. Only recorded servers appear here.” No add action is shown because no role may register one |
| No Result | N/A | The list has no query or filter. An unrecorded server reference resolves on PG-006 |
| Error | Specified | A load failure shows an error panel with Retry; it does not render Empty |
| No Permission | Specified | `McpServer.read` is `read-only` for ROLE-001. A role without the grant sees No Permission with the standard recovery in §5.5. The read page never exposes a credential value |
| Editing | N/A | No inline editing. The proposed add/test/allowlist route is PG-011 and is denied |
| Submitting | N/A | No mutating action exists on this page |
| Success-Failure | N/A | Read success is Default; read failure is Error. `[BR-004; CAP-003; FLOW-005 registration context]` |

### 6.7 PG-006 — MCP server record

| State | Decision | Detail and tag |
|---|---|---|
| Default | Specified | The page shows the server name, recorded health, connection type, endpoint reference, credential-reference presence, timeout, and a recorded tool-reference count. Individual tool names and allowlist flags are withheld until the McpTool read question is resolved. No secret value, test action, allowlist toggle, or invoke action |
| Loading | Specified | A record skeleton with the breadcrumb and Back to MCP servers |
| Empty | N/A | A record page either resolves or does not. A zero tool-reference count is shown as “No tool references recorded”, a field-level absence, not a page Empty state |
| No Result | Specified | An unrecorded server name shows “This server is not in the registry.” No record and no create action. Back to MCP servers is the only recovery. `[BR-004]` |
| Error | Specified | A record load failure shows an error panel with Retry and Back. It never renders a blank server |
| No Permission | Specified | `McpServer.read` is allowed `read-only` for ROLE-001. A role without the grant sees No Permission with the standard recovery in §5.5. `McpTool.invoke` is denied, so no call control exists |
| Editing | N/A | The record is read-only. The proposed edit route is PG-011 and is denied |
| Submitting | N/A | No mutating action exists on this page |
| Success-Failure | N/A | Read success is Default; read failure is Error. `[BR-004; CAP-003; FLOW-005 registration context]` |

### 6.8 PG-007 — Tasks registry

| State | Decision | Detail and tag |
|---|---|---|
| Default | Specified | The page shows the title, recorded count, description, “Manual runs only” note, read-only notice, and task cards. Each card shows name, description, version label, and step count, with Run as the only action. No owner, New task, schedule, template, or bulk action |
| Loading | Specified | Header and count placeholders remain; cards become skeletons; Run is unavailable until the card’s task is loaded |
| Empty | Specified | Zero recorded tasks is valid: “No tasks recorded.” No New task action is shown because no role may create one. There is no Run action on an empty page |
| No Result | N/A | The list has no query or filter. An unrecorded task reference resolves on PG-008 |
| Error | Specified | A load failure shows an error panel with Retry; it never falls back to Empty |
| No Permission | Specified | `TaskDefinition.read` is `read-only` and `Run.initiate` is `allowed` for ROLE-001. A proposed role is `denied` for both and sees No Permission. The Run action is rendered only when the task is recorded and the role may initiate |
| Editing | N/A | There is no inline editing. The proposed task authoring route is PG-012 and is denied |
| Submitting | N/A | Run navigates to PG-008; submission happens there. The list itself submits nothing |
| Success-Failure | N/A | Read success is Default; read failure is Error. `[BR-005; FLOW-003 N1; FLOW-006 N5]` |

### 6.9 PG-008 — Task run

| State | Decision | Detail and tag |
|---|---|---|
| Default | Specified | The page shows the task name, version label, description, “Manual run” note, declared inputs, Start run, and a read-only composition summary. No owner, schedule, approval, retry, model, or file control |
| Loading | Specified | The task record loads before the form is rendered. Header and a form skeleton remain; Start run is unavailable until the record and its declared inputs are known |
| Empty | N/A | A task with no declared inputs still renders a complete run form; “No inputs required” is a field-level absence, not a page Empty state. A workspace with no tasks is Empty on PG-007; an unrecorded task is No Result |
| No Result | Specified | An unrecorded task reference shows “This task is not in the registry.” No run form, no Start run, and no partial composition. Back to Tasks is the only recovery. `[BR-005]` |
| Error | Specified | A task load failure shows an error panel with Retry and Back to Tasks. An explicit run-creation failure stays on PG-008 with “No run was created” and preserved inputs. If the result is lost and no run reference is returned, the page says “Run start unconfirmed” and presents neither a success nor a failure |
| No Permission | Specified | `Run.initiate` is `allowed` for ROLE-001 and `denied` for every proposed role. A role without the grant sees No Permission with the standard recovery in §5.5. An inactive session goes to PG-001. A task that is no longer recorded is rejected as No Result, not run |
| Editing | Specified | The person is filling the declared inputs. The values are kept until submission or until the person leaves; leaving with a non-empty form asks “Discard unsent input?”. Nothing is preserved across a reload |
| Submitting | Specified | Start run is disabled, inputs are locked, and the label becomes “Starting run…”. A second click or Enter is ignored. The page does not show a run outcome while the submission is unresolved |
| Success-Failure | Specified | Success means a run was created, not that it succeeded: PG-009 opens with the run reference. A run created and rejected before any step is still a submission success and appears on PG-009 as `Failed`. Failure to create a run stays on PG-008. `[BR-005, BR-006, BR-008; FLOW-003 N1 to N3, F1, F2]` |

### 6.10 PG-009 — Run outcome

| State | Decision | Detail and tag |
|---|---|---|
| Default | Specified | The page shows the run reference, state, “Initiated by you”, task name and version, an outcome summary, and one row per step with ordinal, target kind, status, duration, and result or error. A skill target shows the skill name; an MCP tool target withholds the tool name until the McpTool read question is resolved. A run rejected before any step shows “No step results” and a generic rejection notice. Actions are Start a new run and Back to Tasks. No artifacts, cost, token, audit, download, or owner name |
| Loading | Specified | A run skeleton preserves the breadcrumb and run reference. No step status is shown as final until the run record is loaded |
| Empty | N/A | The run object has at least one run step by the business-model invariant. A run rejected before any step may have no step results; the step area then shows “No step results”, which is a field-level absence, not a page Empty state. A zero-step run is invalid and is shown as Error |
| No Result | Specified | A run reference that does not resolve shows “This run is not available.” No task, owner, state, or step is disclosed. Back to Tasks is the only recovery. There is no run index to return to because CAP-009 is excluded |
| Error | Specified | A load or status-update failure keeps the last reported state, marks it “Status unavailable”, and offers Retry. A terminal state is shown only when the system reports it; the page never guesses `Succeeded` or `Failed` |
| No Permission | Specified | `Run.read` and `RunStep.read` are `own-only` for ROLE-001. A run initiated by another account uses the same “This run is not available.” panel as No Result, with no task, owner, state, or step. An unauthenticated visit goes to PG-001. Proposed roles are `denied`; if they reach the route, they see No Permission with the standard recovery in §5.5 |
| Editing | N/A | The run is read-only. No step can be edited, reordered, retried, or cancelled |
| Submitting | N/A | The page submits nothing. Start a new run navigates to PG-008, where submission is owned |
| Success-Failure | Specified | `Succeeded`: every step succeeded, terminal, success summary. `Failed` after a step failure: at least one step failed, the failed step is visible, remaining steps are `Skipped`. `Failed` before any step: the runner rejected the run, so the run is terminal `Failed` with no step results and a generic rejection notice visible. `Initiated` and `Running` are non-terminal and MUST NOT be presented as success or failure. `[BR-008; FLOW-003 N4 to N7, F2, C2; STATE-001, STATE-002]` |

### 6.11 PG-010 — Skill editor (proposed, not effective)

| State | Decision | Detail and tag |
|---|---|---|
| Default | Specified — No Permission only | The effective Default is the No Permission panel. No form, draft, test, or Publish control is rendered. The conditional target form is documented below but is not reachable |
| Loading | N/A effective | No authorized operation can start, so there is no loading state today. Conditional target: load an existing draft with a form skeleton |
| Empty | N/A effective | No draft is created. Conditional target: a new draft starts with empty fields; an empty form is not a page Empty state |
| No Result | N/A effective | Conditional target: editing a draft that no longer exists shows “Draft not found”, with Back to Skills |
| Error | N/A effective | Conditional target: a validation or publication failure keeps the draft and shows the error. Nothing is published |
| No Permission | Specified | This is the only reachable state. `Skill.publish` and every authoring action are `denied` for ROLE-001 and every proposed role. The panel offers the standard No Permission recovery in §5.5. `[BR-003; FLOW-004; TBD-BIZ-004]` |
| Editing | N/A effective | Conditional target: name, description, instructions, input definition, and declared tool dependencies; unsaved-change confirmation on leave |
| Submitting | N/A effective | Conditional target: Save draft, Test, and Publish are disabled with an in-progress label; duplicate activation is ignored |
| Success-Failure | N/A effective | Conditional target: success creates an immutable version and returns to PG-003/PG-004; failure keeps the draft. Not effective today. `[BR-003; FLOW-004 N1 to N4, F1, F2, C1, C2]` |

### 6.12 PG-011 — MCP server editor (proposed, not effective)

| State | Decision | Detail and tag |
|---|---|---|
| Default | Specified — No Permission only | The effective Default is the No Permission panel. No server draft, test, or allowlist control is rendered |
| Loading | N/A effective | Conditional target: a connection test shows an in-progress row and disables Test connection |
| Empty | N/A effective | Conditional target: a new server starts with empty fields; a successful test with no discovered tools shows “No tools discovered”, a field-level absence |
| No Result | N/A effective | Conditional target: editing a server that no longer exists shows “Server not found”, with Back to MCP servers |
| Error | N/A effective | Conditional target: a failed connection records error health, exposes no tools, keeps the draft, and offers Retest |
| No Permission | Specified | This is the only reachable state. Registration, test, and allowlisting are `denied` for every role. The panel offers the standard No Permission recovery in §5.5. `[BR-004; FLOW-005; TBD-BIZ-004]` |
| Editing | N/A effective | Conditional target: name, connection type, endpoint reference, auth reference, timeout, tool allowlist; no credential value is displayed |
| Submitting | N/A effective | Conditional target: Test connection and Save are disabled while in flight; duplicate activation is ignored |
| Success-Failure | N/A effective | Conditional target: a successful test records health and tools; a failed test records error health and no tools; allowlist changes require an explicit Save. Not effective today. `[BR-004; FLOW-005 N1 to N4, F1, F2, C1, C2]` |

### 6.13 PG-012 — Task definition editor (proposed, not effective)

| State | Decision | Detail and tag |
|---|---|---|
| Default | Specified — No Permission only | The effective Default is the No Permission panel. No task draft, test run, or Publish control is rendered |
| Loading | N/A effective | Conditional target: load an existing draft with a form skeleton |
| Empty | N/A effective | Conditional target: a new task starts with no steps; “Add at least one step” is a validation state, not a page Empty state |
| No Result | N/A effective | Conditional target: editing a draft that no longer exists shows “Draft not found”, with Back to Tasks |
| Error | N/A effective | Conditional target: validation, test, or publication failure keeps the draft and shows the error. Nothing is published |
| No Permission | Specified | This is the only reachable state. Task authoring and publication are `denied` for every role. The panel offers the standard No Permission recovery in §5.5. `[BR-005; FLOW-006; TBD-BIZ-004]` |
| Editing | N/A effective | Conditional target: name, description, input definition, ordered steps, step parameters; unsaved-change confirmation on leave. No branch, loop, schedule, or template control |
| Submitting | N/A effective | Conditional target: Save draft, Test run, and Publish are disabled with an in-progress label; duplicate activation is ignored |
| Success-Failure | N/A effective | Conditional target: success creates an immutable task version and returns to PG-007; failure keeps the draft. Not effective today. `[BR-005; FLOW-006 N1 to N4, F1, F2, C1, C2]` |

### 6.14 State coverage check

| Check | Result |
|---|---|
| Pages assessed | 12 of 12 |
| States assessed per page | 9 of 9 |
| Total state cells | 108 |
| N/A cells | Explained in place; none is a silent omission |
| Pages with no permitted entry | PG-010, PG-011, PG-012; their only effective state is No Permission |
| Pages with a terminal Empty state in the confirmed MVP | PG-003, PG-005, PG-007, because no confirmed role may record an entry |
| Pages with a terminal run outcome | PG-009: `Succeeded` or `Failed` |

## 7. Desktop layout at the 1440px baseline

### 7.1 Baseline grid

The 1440px desktop baseline is the reference for every page. It uses the design-system layout tokens rather than new values.

| Region | 1440px measurement | Token or source |
|---|---|---|
| Viewport | 1440 × variable height | Baseline |
| App shell | `100dvh`; the main pane owns scrolling, not the document | Design system §4 |
| Sidebar | 272px fixed, deep evergreen, 1px boundary | `--sidebar-w` |
| Main pane | 1168px at baseline | 1440 − 272 |
| Topbar | 56px, sticky at the top of the main pane | `--topbar-h` |
| Page gutter | 36px left and right | `--gutter` |
| Page content width | 1096px at baseline; capped at 1360px on wider screens | 1168 − 72; `--content-max` |
| Content radius | 14px for page panels; 10px for cards and tables | `--panel-radius`, `--card-radius` |
| Control height | 36px default; 31px compact | `--control-h`, `--control-h-sm` |
| Card grid | `repeat(auto-fill, minmax(320px, 1fr))`, 16px gap; 3 columns at 1096px | Design system §4 and §5 |
| Record, run, outcome split | `minmax(0, 1fr) 300px`, 32px gap; 764 + 32 + 300 = 1096 | `--rail-w` |
| Chat thread and composer | 760px maximum, centred in the main pane; prose capped at 72ch | Design system §3.2 and §5 |

The 1360px `--content-max` does not bind at 1440px because the main pane is 1168px. It binds only on a wider viewport, where the content remains centred in the main pane.

### 7.2 Page patterns at 1440px

| Pattern | Pages | Structure |
|---|---|---|
| **Standalone sign-in** | PG-001 | No sidebar. A 420px form panel centred in the viewport, with the workspace identity above the heading. The panel uses `--surface` and `--panel-radius`; the page background is `--canvas`. A single primary action and a static help note sit below the fields |
| **Chat workspace** | PG-002 | 272px sidebar; 1168px main pane; 56px topbar; chat header; 760px thread and composer column centred in the main pane. No right rail. The reclaimed rail width becomes breathing room and keeps the prose below 72ch |
| **Registry list** | PG-003, PG-005, PG-007 | Page header: eyebrow, title + count, description. A read-only notice below the header. A 3-column card grid at 1096px, each card at least 320px. No toolbar, because no search or filter is confirmed |
| **Record** | PG-004, PG-006 | Breadcrumb and Back. A 764px reading column plus a 300px record-facts panel. The reading column holds description, instructions, input definition, or server facts. The facts panel holds the recorded marker, version label, health, and the withheld-permission note where applicable |
| **Run form** | PG-008 | Breadcrumb and Back. A 764px form column plus a 300px composition panel. The form holds the declared inputs and Start run; the side panel holds the version label, step count, and the “Manual run only” note, while the task name and description stay in the page header |
| **Run outcome** | PG-009 | Breadcrumb and run reference in the page header; a 764px outcome and step column plus a 300px summary panel. The step rows use a table with an ordinal, target kind, status, duration, and result/error; the side panel holds the task version and “Initiated by you”, while the state badge stays in the header |
| **Proposed editor** | PG-010, PG-011, PG-012 | Effective: a 560px No Permission panel centred in the page content. Conditional target: the same 764px + 300px split as the run form, with the form on the left and validation/help on the right. Not reachable today |
| **State panel** | Empty, No Result, Error, No Permission | A 560px panel centred in the page content, with a serif headline, one explanatory paragraph, and at most one primary recovery action. The page header and Back remain visible where the page has them |
| **Publish confirmation** | PG-010, PG-012 (proposed) | 640px dialog, maximum 88dvh, sticky header and footer, scrolling body. Effective pages do not open it |

### 7.3 Desktop breakpoints

Only the desktop-relevant rows of `docs/03_design/design_system.md` §4 are adopted. The narrower rows are deliberately not designed.

| Width | Design-system reference | Behaviour in this design |
|---|---|---|
| **1440px** | Baseline | 272px sidebar; 36px gutters; 1096px content; 3-column registry grid; 764 + 300 record split; 760px chat column |
| **≤1280px** | §4 `≤1280`: rail 280px, gutters 28px, chat inset 12px | Gutters become 28px; the record/run side panel becomes 280px; the registry grid becomes 2 columns; the chat column caps at 720px. The main pane remains 272px + fluid |
| **≤1080px** | §4 `≤1080`: rail hidden; settings one column; stats two columns | The 280px side panel stacks below the main column on PG-004, PG-006, PG-008, PG-009, and the conditional editors. The registry keeps 2 columns. The chat has no rail to hide; its 720px cap remains |
| **≤960px** | §4 `≤960`: page gutters 20px; grids 280px minimum; ledger hides “Started” | Gutters become 20px; the card minimum becomes 280px; the registry keeps 2 columns; the run-step table moves duration and result onto a second line under each step rather than hiding status. The sidebar remains 272px; the main pane is 688px and the content is 648px at 960px. The capped chat column shrinks to the content width. No horizontal page scroll |
| **<960px** | Not adopted | Out of scope. The `≤860`, `≤780`, and `≤560` rules are narrow/mobile rules and are not designed here. This document makes no claim about a phone, tablet portrait, bottom sheet, or 44px touch layout |

At 1440px no page requires horizontal scrolling. At ≤960px the step table wraps rather than scrolling sideways. The registry grid never drops below two columns inside the desktop range; it does not become a one-column mobile list.

At 960px the main pane is 688px (960 − 272), and the 20px gutters leave 648px of content width. The two-column card grid therefore resolves to two 316px columns above the 280px minimum.

### 7.4 Design-system mapping and deliberate deviations

| Element | Design-system reference | Use here |
|---|---|---|
| Shell and navigation | Sidebar, topbar, breadcrumb, active state | 272px sidebar, 56px topbar, `Workspace / <section>` breadcrumb |
| Colour and status | Semantic roles and status triples | `ok` for Succeeded, `error` for Failed, `info` for Running, `warn` for Needs authentication, `neutral` for Recorded. Status always carries a text label and a dot |
| Typography | Display serif for brand, page titles, card titles, empty states; sans for body and controls | Page title 34px at desktop; card title 20px; body 13.5px; metadata 11px; chat prose below 72ch |
| Buttons and chips | 36px default, 31px compact, 2px focus ring | Sign in, Start run, Try again, Retry, Back. No mock or disabled “coming soon” button |
| Cards | 1px border, 10px radius, 2px hover lift | Registry cards. The skill status stripe is not used because STATE-003 is proposed |
| Tables | Surface panel, 11px uppercase header, 12.5px rows | Run-step table on PG-009 only. No audit or usage table exists |
| Forms | 11.5px labels, 36px controls, adjacent hints and errors | Sign-in, run inputs, conditional editors |
| Dialogs | 640px, focus trap, Escape, focus return | Proposed publish confirmation only |
| Motion | 120/180/260ms, `--ease-out`, reduced motion | Hover, overlay, and status transitions; no information depends on motion |

Deliberate deviations from the prototype and design-system composition, each with its reason:

| Deviation | Reason | Source |
|---|---|---|
| No run-context rail in chat | Its contents — active skill, tools in this run, token/cost summary, citations — are CAP-036, CAP-016, and CAP-008 and are not confirmed | CAP-008, CAP-016, CAP-036 |
| No Manage drawer or admin area | CAP-026 and CAP-021 are excluded; the Skills, MCP servers, and Tasks destinations are the only management surfaces | CAP-021, CAP-026 |
| No theme toggle | The design system records the dark theme as a prototype demonstration, not a confirmed product requirement | `design_system.md` §5, §8 |
| No registry search or filter toolbar | No registry search or filter capability is confirmed; CAP-008 is chat search and is excluded. See §8.2 | CAP-008; §8.2 |
| No skill lifecycle stripe or Published/Draft labels | STATE-003 is proposed; the effective page shows “Recorded” only | STATE-003; `TBD-BIZ-004` |
| No owner names, avatars, or account menu | `Account.read` is `denied` for ROLE-001; the display question is unresolved | BM §6.2; §8.2 |
| No individual MCP tool names or allowlist flags on effective pages | `McpTool` has no read column in the permission matrix; PG-006 shows only a tool-reference count | BM §6.2; §8.2 |
| No mock pill or prototype stamp | This is a production interaction design, not the throwaway prototype | Prototype README |
| No mobile or narrow layout below 960px | The task excludes mobile design; this document stops at the desktop breakpoint | Task scope; design system §4 |

### 7.5 Accessibility at the 1440px baseline

The design system’s measured contrast pairs are the reference; this document does not restate them as new measurements. At the desktop baseline:

- All text and control contrast follows the design-system pairs; status is never colour-only.
- Focus is a visible 2px ring with 2px offset and is never removed by hover.
- The skip link targets the main region; the main region is focusable; the topbar and sidebar do not trap focus.
- Keyboard completion is required for sign-in, chat send, run submission, and run outcome read. NFR-011 is proposed; this design targets its keyboard and contrast intent without claiming a verified pass.
- Live regions announce sign-in results, chat completion, run status changes, and save results. The thread is not a live region.
- `prefers-reduced-motion` disables functional animation. No status depends on an animation.
- Functional text is never below 11px. The chat prose measure stays below 72ch. Body copy uses the sans face; the serif is reserved for page, card, and empty-state headings.
- Desktop controls use the 36px baseline. The mobile 44px target is not part of this design.

## 8. Open items and unregistered gaps

### 8.1 Existing `TBD-BIZ` references that constrain this design

These are references to `docs/00_setup/open_items.md`; no entry is redefined here.

| TBD | Registered question | Effect on this design | Handling in this document |
|---|---|---|---|
| **TBD-BIZ-003** | Data classification, PII boundary, retention, and deletion | Owner attribution, artifacts, and credential display cannot be settled | No owner names, no artifacts, no credential values, no retention control. Reference only |
| **TBD-BIZ-004** | Who may create, publish, register, allowlist, and administer the workspace | The registries cannot be populated; PG-010, PG-011, and PG-012 have no effective grant | Read-only registries; proposed editors denied; blocker in §8.3 |
| **TBD-BIZ-005** | First MCP integrations and first three tasks | No sample task, server, or input set can be invented for the design | Empty states stand; PG-008 inputs are data-driven by the recorded task |
| **TBD-BIZ-007** | Prompt-only or code-capable execution; linear or branching steps | The run-step target and the test surfaces are conditional | No code, branch, loop, approval, or tool-invocation UI; run outcome stays at step status and error |
| **TBD-BIZ-008** | NFR thresholds and measurement environment | No client timeout, loading duration, or run-refresh interval is confirmed | No invented timer; pending states persist until the system reports. NFR-001 to NFR-003 are referenced as proposed |
| **TBD-BIZ-009** | Audit obligation and evidence scope | No audit page, audit metadata, or export can be designed | No audit surface; PG-009 omits audit metadata |
| **TBD-BIZ-010** | Cost visibility and budget ceiling | No token or cost display can be designed | No cost, token, or budget UI |
| **TBD-BIZ-011** | MVP boundary for supporting capabilities | Search, run history, chat history actions, account management, and configuration are excluded | The exclusions in §1.3; no route or control for them |
| **TBD-BIZ-013** | Registry ownership and offboarding | An owner’s departure has no confirmed effect on recorded entries | The design shows no ownership transfer, deletion, or offboarding control, and omits owner attribution. Reference only |

`TBD-BIZ-004` is the immediate blocker for populating and operating the registries. `TBD-BIZ-003` and `TBD-BIZ-008` also constrain data handling and measurable performance; they remove or defer surfaces but do not create a false success path.

### 8.2 Gaps with no matching ID — to be registered by the Tech Lead

Each row below is a gap that no existing `TBD-BIZ` or business rule covers. No new identifier is assigned. The interim behaviour is what this design does until the Tech Lead registers and resolves the gap.

| To be registered | Why no rule covers it | Interim interaction | Affected pages |
|---|---|---|---|
| **Session termination and sign-out** | BR-001 creates a session but no business rule or `TBD-BIZ` states how a session ends, whether sign-out exists, whether an idle session expires, or what happens to unsent input | No sign-out control is rendered. Session end during an action routes to PG-001 and makes no partial change. This is a product gap, not a design choice | PG-002 and the global shell |
| **In-product account-help destination** | FLOW-001 C1 says to ask an account administrator, but account administration is CAP-021 and is excluded; no destination page exists | PG-001 shows a static help note and offers only retry. The help branch terminates at the product boundary | PG-001 |
| **Authority-request destination** | FLOW-004, FLOW-005, and FLOW-006 C2 say to request authority or an allowlist change, but no in-product request surface is confirmed | The proposed editor would retain the draft and stop. No request page or message channel is invented | PG-010, PG-011, PG-012 |
| **Duplicate-run reconciliation and unconfirmed run start** | BR-005 and BR-006 require one initiator and one run, but no rule states how to reconcile a submission whose result was lost, or whether a repeated submission may create a second run | PG-008 disables Start run and, if no run reference returns, shows “Run start unconfirmed” with instructions not to retry blindly. No automatic reconciliation is designed | PG-008 |
| **Owner and account display permission interpretation** | `Skill.read` and `TaskDefinition.read` are `read-only`, while `Account.read` is `denied`, and the owner attribution is PII. The matrix does not say whether the owner’s display name travels with the record | No owner name, avatar, or account menu is rendered. Registry records show the recorded content without owner attribution | PG-002, PG-003, PG-004, PG-007, PG-008, global shell |
| **MCP tool read and allowlist display interpretation** | The permission matrix has `McpServer.read`, `McpTool.allowlist`, and `McpTool.invoke`, but no `McpTool.read`. A run step or skill dependency can reference an MCP tool | Effective pages either omit individual tool references or show only a tool-reference count and the target kind. Individual tool names and allowlist flags are withheld. A run step for a skill shows the skill name; a tool step withholds the tool name | PG-004, PG-005, PG-006, PG-009, PG-011 (conditional) |
| **Registry browsing, search, filter, and paging at the proposed 500-item scale** | No registry search, filter, or browse capability is confirmed, and NFR-002 proposes a 500-item read with no paging or incremental-load behaviour | The pages are scan-only, single-scroll regions with a complete count. No query field, filter chip, pager, or “Load more” control is invented | PG-003, PG-005, PG-007 |

These gaps are visible in the design as honest limits: no fake sign-out, no fake help page, no fake authority request, no blind retry, no invented owner or tool name, and no invented pager.

### 8.3 Blockers and scope consequences

| Item | Consequence | Is it a design defect? |
|---|---|---|
| Registry authority (`TBD-BIZ-004`) | No confirmed role can record a skill, server, or task; PG-003, PG-005, and PG-007 can remain Empty indefinitely under the current grants; PG-010 to PG-012 are denied | No. It is a business-model blocker. The design refuses to fabricate an administrator |
| No run index (CAP-009 excluded) | PG-009 is reachable only from the submission that created the run. A later visit requires the run reference. There is no Runs list, filter, or history | No. It is a confirmed scope consequence. The page offers Back to Tasks, not a fabricated index |
| No artifact read (`Artifact.read` is `denied`) | PG-009 cannot show or download run artifacts, even though ENT-016 exists | No. The permission matrix wins. If artifacts are expected, the permission decision must be registered |
| No account identity (`Account.read` is `denied`) | The shell has no account name, avatar, or menu; registry cards have no owner | No. The conservative reading avoids leaking account data |
| No registry search or filter (no confirmed capability; `TBD-BIZ-011` covers the chat search boundary only) | The registry pages are scan-only; a 500-item list has no query state | No. No capability is confirmed; the gap is registered in §8.2 |
| Proposed flows are not testable | PG-010, PG-011, and PG-012 cannot be exercised end to end; their conditional states are specified but unverified against a live grant | No. Testing them would require the authority decision first |
| No mobile design | The document stops at 960px and makes no claim below it | No. It is the task boundary |

## 9. Traceability and self-check

### 9.1 Page-to-source traceability

| PG | CAP | FLOW | BR | Role and permission | Status |
|---|---|---|---|---|---|
| PG-001 | CAP-005 | FLOW-001 | BR-001 | ROLE-001; local sign-in allowed | Confirmed |
| PG-002 | CAP-001 | FLOW-002 | BR-002 | ROLE-001; own-only | Confirmed |
| PG-003 | CAP-002 | FLOW-004 N5 read side | BR-003 | ROLE-001; read-only | Confirmed read-only |
| PG-004 | CAP-002 | FLOW-004 N5 read side | BR-003 | ROLE-001; read-only | Confirmed read-only |
| PG-005 | CAP-003 | FLOW-005 registration context (no member-read step) | BR-004 | ROLE-001; read-only | Confirmed read-only |
| PG-006 | CAP-003 | FLOW-005 registration context (no member-read step) | BR-004 | ROLE-001; read-only | Confirmed read-only |
| PG-007 | CAP-004 | FLOW-003 N1; FLOW-006 N5 | BR-005 | ROLE-001; read-only + run entry | Confirmed read-only + run entry |
| PG-008 | CAP-004 | FLOW-003 N1 to N3 | BR-005, BR-006, BR-008 | ROLE-001; `Run.initiate` allowed | Confirmed |
| PG-009 | CAP-004 | FLOW-003 N4 to N7 | BR-008 | ROLE-001; own-only | Confirmed |
| PG-010 | CAP-002 authoring side | FLOW-004 | BR-003 | ROLE-002/ROLE-003 proposed; all denied | Proposed — not effective |
| PG-011 | CAP-003 registration side | FLOW-005 | BR-004 | ROLE-002 proposed; all denied | Proposed — not effective |
| PG-012 | CAP-004 authoring side | FLOW-006 | BR-005 | ROLE-002/ROLE-003 proposed; all denied | Proposed — not effective |

### 9.2 ID resolution check

| ID family | IDs used | Resolution |
|---|---|---|
| **PG** | PG-001 to PG-012 | Newly assigned by this document; the only new IDs |
| **CAP** | CAP-001 to CAP-005; CAP-006 to CAP-036 only as named exclusions | All resolve to the business model §3.1 and §3.2 |
| **BR** | BR-001 to BR-008; BR-007 is a deployment condition with no page-level interaction | All resolve to business model §8 |
| **FLOW** | FLOW-001 to FLOW-006 | All resolve to business model §4 |
| **ROLE** | ROLE-001 to ROLE-004 | All resolve to business model §6.1 |
| **ENT** | ENT-003, ENT-004, ENT-006, ENT-007, ENT-008, ENT-010, ENT-011, ENT-012, ENT-013, ENT-014, ENT-016 | All resolve to business model §5.1 |
| **STATE** | STATE-001 to STATE-006 | All resolve to business model §7 |
| **NFR** | NFR-001, NFR-002, NFR-003, NFR-011 | All resolve to business model §9 |
| **TBD-BIZ** | TBD-BIZ-003, TBD-BIZ-004, TBD-BIZ-005, TBD-BIZ-006, TBD-BIZ-007, TBD-BIZ-008, TBD-BIZ-009, TBD-BIZ-010, TBD-BIZ-011, TBD-BIZ-013 | All are `Open` entries in `docs/00_setup/open_items.md`; none is redefined |
| **CAND** | CAND-008, CAND-009, CAND-021 | All resolve to business model Appendix A and remain candidates |
| **CONFLICT** | CONFLICT-001 | Resolves to `docs/00_setup/open_items.md`; ROLE-004 is blocked |
| **Design-system layout tokens** | `--sidebar-w`, `--topbar-h`, `--rail-w`, `--content-max`, `--gutter`, `--control-h`, `--control-h-sm`, `--card-radius`, `--panel-radius` | Resolve to `docs/03_design/design_system.md` §3.4 |
| **Design-system colour tokens** | `--canvas`, `--surface` | Resolve to `docs/03_design/design_system.md` §3.1 |

No `TBD`, `CONFLICT`, or `CAND` identifier is created, and no business capability, role, state, or field is created by this document. The gaps in §8.2 are deliberately left without identifiers for the Tech Lead to register.

### 9.3 Self-check

| Criterion | Verdict | Evidence | Residual limit |
|---|---|---|---|
| **Each page assessed against all 9 states** | Pass | §6.2 to §6.13: 12 pages × 9 states = 108 cells; every N/A is explained; §6.14 records the count | The three proposed editors have only one effective state; their other eight states are conditional and untestable until `TBD-BIZ-004` closes |
| **Every exception flow maps to a primary flow; no dangling branches** | Pass | §4.1 to §4.6 give each exception a recovery and destination; §4.7 maps 28 branches back to a primary flow; product-boundary terminations are explicit and registered in §8.2 | Four product-boundary branches — account help plus three authority requests — terminate outside the product because no in-product destination is confirmed; they are not represented by invented pages |
| **All IDs resolve; no newly invented business capabilities** | Pass | §9.2 resolves every ID family; PG-001 to PG-012 are the only new IDs; §1.3 lists every excluded surface; §2.2 applies the exact matrix values | Owner and McpTool display questions remain unresolved and are withheld rather than guessed |
| **Layout and interactions are complete at the 1440px baseline** | Pass | §7.1 fixes the 1440px grid; §7.2 covers all page patterns and state panels; §7.3 adopts the desktop-relevant breakpoints at 1280, 1080, and 960; §7.4 records every deviation; §7.5 records the accessibility baseline | The specification is not a rendered visual QA; no browser capture or user test was performed |

### 9.4 Residual limits

- The business model is `Draft`; `TBD-BIZ-004` blocks the confirmed MVP from being operable end to end. This document is a design specification, not evidence that the product works.
- PG-010, PG-011, and PG-012 are proposed and denied. Their conditional layouts and states are documented for a future grant but cannot be exercised today.
- The design system is `Draft`. Its tokens and measured contrast pairs are referenced, not re-measured here. A production visual QA pass remains necessary.
- No API, data model, persistence, transport, or backend behavior is specified. Route keys, page states, and interaction rules are UI descriptions only.
- No mobile or narrow layout is designed. The document stops at 960px and makes no claim about the `≤860`, `≤780`, or `≤560` rows in the design system.
- No user testing, analytics, or usability measurement was performed. The objectives and NFR thresholds remain proposed under `TBD-BIZ-006` and `TBD-BIZ-008`.
- The owner/account display question and the MCP tool read question are deliberately unresolved. The design omits the disputed data rather than inventing a permission.

