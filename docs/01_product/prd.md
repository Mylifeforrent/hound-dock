# PRD — hound-dock Internal Agent Workspace

Status: Draft
Version: 0.1
Originating stage: Stage 2 — Product Definition
Owner: Tech Lead (Docs Agent is dormant; handoff recorded in CHG-001)
Last updated: 2026-10-18
Refs: TBD-BIZ-003, TBD-BIZ-004, TBD-BIZ-005, TBD-BIZ-006, TBD-BIZ-007, TBD-INFRA-001, TBD-INFRA-002, TBD-INFRA-003, TBD-INFRA-004, TBD-INFRA-005, TBD-INFRA-006, TBD-INFRA-007, TBD-INFRA-009, TBD-INFRA-010, TBD-INFRA-011

## 1. Summary

hound-dock is a self-hosted internal workspace where team members chat with an AI agent, discover and invoke registered **skills**, connect governed **MCP servers**, and define and run reusable **tasks** composed of those skills and tools. Chat is the entry point; the registries are the control plane; every run is auditable.

## 2. Problem

Team members use ad-hoc prompts and individually configured tools. Reusable know-how is not captured, MCP connections are not governed, and recurring work is invisible. The reference products are either closed SaaS (豆包工作, WorkBuddy) or open-source platforms whose registries and task execution are configuration-heavy (Dify, Open WebUI, LibreChat). None gives a small internal team a chat-first workspace with governed skill, MCP, and task registries out of the box.

## 3. Reference analysis (three screens)

| Reference | Observed pattern | What we adopt | What we do not copy |
|---|---|---|---|
| **豆包工作** | Left rail with new tasks, scheduled tasks, skills/connectors/partners, cloud drive, remote computer; projects; enterprise knowledge; approval toggle | Work-oriented navigation; task and skill prominence; context connectors | Local computer control, cloud drive, partner ecosystem, scheduled tasks in v1 |
| **DeepSeek** | Clean chat, history, deep-think, smart search | Low-friction chat surface; explicit search mode; conversation history | Deep-think UI branding; general consumer scope |
| **WorkBuddy** | Office/code modes; skill category chips; `/` skill invocation; `@` file reference | Skill discovery, `/` invocation, `@` references, category browsing | Video/image generation, finance verticals, IDE/CLI integration |

## 4. Competitive gap

| Product | Category | Gap for this product |
|---|---|---|
| **Dify** | Open-source agent/workflow platform | Strong workflows and MCP, but configuration-heavy and not a chat-first team workspace |
| **Open WebUI** | Open-source chat platform | Good chat, tools, native MCP, and skills, but arbitrary Python tools are a server-security risk and there is no task scheduler/definition |
| **LibreChat** | Open-source chat/agents | Strong MCP registration, OAuth, ACL, and per-user connections; no first-class task definitions or run scheduler |
| **n8n** | Workflow automation | Strong triggers and integrations, but not a chat-first skill workspace |
| **Obot / ToolHive** | MCP gateway/registry | Excellent MCP governance, but not an end-user work product |
| **豆包工作 / WorkBuddy** | Closed SaaS work agents | Polished and skill-centric, but not self-hosted, extensible, or governed by this team |

**Opportunity:** build the thin integration and governance layer — chat-first UX + skill registry + MCP registry + task definitions + audit — rather than a new agent runtime.

**Research sources:** [豆包工作 upgrade](https://www.chinaz.com/2026/0822/1772599.shtml), [豆包工作 enterprise angle](https://www.stdaily.com/web/gdxw/2026-08/25/content_569505.html), [WorkBuddy overview](https://www.codebuddy.cn/docs/workbuddy/Overview), [WorkBuddy automation](https://www.w3cschool.cn/workbuddydocs/workbuddydocs-automation-guide.html), [Dify tools](https://docs.dify.ai/en/cloud/use-dify/workspace/tools), [Dify human input](https://docs.dify.ai/zh/self-host/use-dify/nodes/human-input), [Dify event-driven workflows](https://github.com/langgenius/dify/discussions/28192), [Open WebUI tools](https://docs.openwebui.com/features/extensibility/plugin/tools/), [Open WebUI MCP](https://docs.openwebui.com/features/extensibility/mcp/), [LibreChat MCP](https://www.librechat.ai/docs/features/mcp), [n8n MCP workflow](https://n8n.io/workflows/17218-run-a-personal-assistant-for-calendar-gmail-and-utilities-with-openai-and-mcp/).

## 5. Goals and non-goals

### Goals

- **G1 — Chat:** a team member can ask a question, receive a streamed answer, and see which skills and tools were used.
- **G2 — Search:** the agent can search a configured source and cite results.
- **G3 — Skills:** authorized users can register, version, test, publish, and invoke skills.
- **G4 — MCP:** authorized users can register MCP servers, test connectivity, discover tools, allowlist tools, and store credentials safely.
- **G5 — Tasks:** authorized users can define reusable tasks from skills and MCP tools and run them manually.
- **G6 — Governance:** every registry change, tool call, and task run is attributable and auditable; approvals will follow the same rule when introduced.
- **G7 — Self-hosted:** the MVP runs inside the team's network with local accounts; SSO follows before wider rollout.

### Non-goals for v1

- Scheduled tasks, cron, webhooks, and event-based triggers.
- Approval workflows; write-capable tools are disabled by default in v1.
- Visual workflow builder, branching, loops, and a general workflow engine.
- Arbitrary code-execution skills and sandboxed scripting (see TBD-BIZ-007).
- Local-computer control, cloud-drive sync, and mobile apps.
- Multi-tenant SaaS, public marketplace, billing, and partner ecosystem.
- Video/image generation and finance-specific verticals.
- SSO/OIDC in the MVP (deferred; local accounts confirmed by the user).
- Pixel-for-pixel cloning of any reference product.

## 6. Users and roles

| Role | Description | v1 permissions |
|---|---|---|
| **Admin** | Installs and operates the product; configures models, users, and registry policy | Full access; only role that can publish skills, register MCP servers, and manage users |
| **Author** | Creates skills and task drafts | Draft-only in v1; cannot publish (delegation is TBD-BIZ-004) |
| **Member** | Uses chat, runs tasks, views own runs | Chat, invoke published skills, run published tasks, view own runs |
| **Auditor** | Reviews usage and audit records | Read-only access to runs and audit; in v1 this is an Admin capability |

Team size, role assignment, and publication policy are tracked as TBD-BIZ-004.

## 7. Core concepts

- **Skill** — a versioned instruction bundle with metadata, input/output schema, declared MCP tool dependencies, examples, and an owner. The v1 proposal is prompt-only, with no code execution (TBD-BIZ-007).
- **MCP server** — a registered Model Context Protocol endpoint with transport, authentication reference, discovered tools, an allowlist, and health status.
- **Task definition** — a versioned specification with input schema and ordered steps; a step invokes a skill or an allowlisted MCP tool.
- **Run** — one execution of a task or chat tool chain, with step statuses, tool calls, artifacts, errors, token/cost data, and the acting user.
- **Registry** — the governed collection of skills, MCP servers, and task definitions. Registry changes are versioned and audited.
- **Project** — optional grouping of chats and tasks; not required for the MVP.

## 8. MVP scope

### In scope

- Local accounts, roles, and admin user management.
- Streaming chat with skill invocation, tool-call visibility, search, and citations.
- Skill registry: create, edit, validate, version, publish, deprecate, invoke, test.
- MCP registry: add/edit server, test connection, discover tools, allowlist tools, store credentials, show health.
- Task registry: create/edit/version task definitions, validate inputs, run manually, view run status and artifacts.
- Run and audit history for registry changes, tool calls, and task runs.
- Model provider configuration with a connection test.
- Self-hosted deployment on a single internal VM.

### Out of scope

Everything listed in §5 non-goals. The MVP does not schedule tasks, does not execute arbitrary code, does not approve write actions, and does not integrate an external identity provider for product login.

## 9. User stories and acceptance criteria

### US-01 — Chat with a skill

As a Member, I ask a question and select a published skill, so that the answer follows the team's approved procedure.

- The response streams incrementally.
- The selected skill and every tool call are visible in the conversation.
- Tool errors are shown without exposing credentials.
- The conversation is persisted and attributed to the signed-in user.

### US-02 — Search with citations

As a Member, I enable search for a question, so that the answer is grounded in current sources.

- Search is invoked only when the toggle is on.
- Results include citations with titles and URLs.
- A search failure degrades to an answer without search, clearly labeled.
- No secret, production data, or PII is sent to a search provider (subject to TBD-BIZ-003).

### US-03 — Register and publish a skill

As an Admin, I create a skill with instructions and schemas, test it, and publish it.

- Required metadata is validated: name, description, owner, instructions, input schema.
- Drafts are visible only to their author and Admins.
- Publishing creates an immutable version and records the change in the audit log.
- Published skills appear in the `/` menu and the skill list.

### US-04 — Register an MCP server

As an Admin, I register an MCP server, test it, and allowlist its tools.

- The server form supports HTTP and SSE transports.
- A connection test reports success, failure, and discovered tools.
- Credentials are stored as references and are never returned by the API.
- Only allowlisted tools are callable; removing a tool revokes access immediately.
- Health status is visible in the registry.

### US-05 — Define a task

As an Admin, I define a task with inputs and ordered steps.

- The task input schema is validated before saving.
- A step can be a published skill or an allowlisted MCP tool.
- Step parameters can reference task inputs.
- Saving creates version 1; later edits create a new version.
- The task can be test-run before publishing.

### US-06 — Run a task manually

As a Member, I run a published task with my inputs and see the result.

- The run shows queued, running, succeeded, or failed status.
- Each step shows pending, running, succeeded, failed, or skipped.
- Outputs and artifacts are downloadable by the runner and Admins.
- A failed step stops the run unless a retry policy applies (v1: no branching).
- The run is recorded in the audit log.

### US-07 — Audit usage

As an Admin, I inspect who did what.

- Every registry change, tool call, and task run has an entry.
- Entries include actor, timestamp, action, target, and outcome.
- Credentials and secret values are redacted.
- Entries can be filtered by actor, action, and date.

### US-08 — Local authentication

As a team member, I sign in with a local account.

- Passwords are hashed with a memory-hard algorithm; plaintext is never stored.
- Sessions use HttpOnly, Secure, SameSite cookies.
- Login is rate-limited.
- Role checks are enforced server-side.
- Admins can create, disable, and reset users.

### US-09 — Configure the model provider

As an Admin, I configure the LLM endpoint and verify it.

- The form accepts a base URL, model name, and secret reference.
- A test call reports success or failure.
- Secrets are never displayed after saving.
- Model changes are audited.

## 10. Functional requirements

Priority: **M** = Must for MVP, **S** = Should, **C** = Could, **W** = Won't in v1.

### Chat and search

| ID | Requirement | Priority |
|---|---|---|
| FR-001 | Stream assistant responses over SSE | M |
| FR-002 | Render Markdown, code blocks, tables, and citations | M |
| FR-003 | Show skill and tool calls with status and result summaries | M |
| FR-004 | Provide a per-conversation search toggle with citations | M |
| FR-005 | Persist conversations and message history per user | M |
| FR-006 | Attach files to a conversation and include their text as context | S |
| FR-007 | Let the user choose among enabled models | S |
| FR-008 | Search the user's own conversation history | S |
| FR-009 | Group conversations into projects | C |
| FR-010 | Configure the search provider and test it | M |
| FR-011 | Search internal documents or knowledge bases | S |

### Skill registry

| ID | Requirement | Priority |
|---|---|---|
| FR-012 | Create and edit skill drafts with required metadata | M |
| FR-013 | Validate skill input/output schemas | M |
| FR-014 | Version, publish, and deprecate skills | M |
| FR-015 | Invoke a published skill through the `/` menu or tool selection | M |
| FR-016 | Enforce per-skill access by role | M |
| FR-017 | Test a skill in an isolated draft conversation | M |
| FR-018 | Browse skills by category and search by name/description | S |
| FR-019 | Import and export a skill manifest | C |

### MCP registry

| ID | Requirement | Priority |
|---|---|---|
| FR-020 | Register, edit, and delete MCP servers | M |
| FR-021 | Test connectivity and report discovered tools | M |
| FR-022 | Allowlist individual tools per server | M |
| FR-023 | Store MCP credentials as encrypted references | M |
| FR-024 | Enforce per-tool access by role | M |
| FR-025 | Display connection and health status | M |
| FR-026 | Support HTTP and SSE transports | M |
| FR-027 | Support OAuth for MCP servers | S |
| FR-028 | Import server definitions from an MCP registry | C |

### Task registry and runs

| ID | Requirement | Priority |
|---|---|---|
| FR-029 | Create and edit task definitions with input schema | M |
| FR-030 | Define ordered steps that invoke skills or MCP tools | M |
| FR-031 | Map task inputs into step parameters | M |
| FR-032 | Version tasks and publish a version | M |
| FR-033 | Run a published task manually | M |
| FR-034 | Show run and step status in real time | M |
| FR-035 | Persist outputs and downloadable artifacts | M |
| FR-036 | Provide task templates | S |
| FR-037 | Schedule tasks | W |
| FR-038 | Require approval before write-capable tool calls | W |
| FR-039 | Trigger tasks from webhooks | W |

### Audit, admin, and operations

| ID | Requirement | Priority |
|---|---|---|
| FR-040 | Record an append-only audit event for registry changes, tool calls, and runs | M |
| FR-041 | Filter and export audit records | M |
| FR-042 | Track token usage and estimated cost per run | S |
| FR-043 | Local account login, logout, and session management | M |
| FR-044 | Admin user and role management | M |
| FR-045 | Configure and test the model provider | M |
| FR-046 | Encrypt secrets at rest and redact them in logs/API responses | M |
| FR-047 | Provide system settings and a health page | S |
| FR-048 | SSO/OIDC login | W |
| FR-049 | Backup and restore documentation | S |
| FR-050 | Keyboard navigation and accessible contrast | S |

## 11. UX flows

### Chat workspace

- Left rail: Chats, Tasks, Skills, MCP, Runs, Admin.
- Main panel: conversation, tool-call cards, citations, run links.
- Composer: `/` opens published skills; `@` references files; search toggle; model selector.
- Empty state: suggested tasks drawn from published tasks and skills.

### Skill registry

- List with status, owner, category, and last updated.
- Detail with instructions, schemas, dependencies, versions, and test panel.
- Publish action is Admin-only and creates an immutable version.

### MCP registry

- List with health badges and tool counts.
- Add/edit form: name, transport, URL, auth reference, timeouts.
- Test connection action; tool list with per-tool allowlist toggles.

### Task builder

- Form-based v1: name, description, input fields, ordered steps, step parameters.
- Test run with sample inputs before publishing.
- Published tasks appear in the Tasks list and the chat composer.

### Run detail

- Timeline of steps with status, duration, tool calls, and errors.
- Artifacts and final output.
- Audit metadata: actor, task version, start/end time.

## 12. Non-functional requirements

### Security

- Passwords MUST be hashed with Argon2id or bcrypt; plaintext MUST NOT be stored or logged.
- Sessions MUST use HttpOnly, Secure, SameSite cookies; state-changing requests MUST be CSRF-protected.
- Login MUST be rate-limited; role checks MUST be enforced server-side.
- Secrets MUST be encrypted at rest and MUST NOT appear in API responses or logs.
- MCP servers MUST be admin-registered and tool-allowlisted; only HTTP/SSE transports are allowed in v1.
- Write-capable tools MUST be disabled by default in v1; enabling them requires a future approval feature.
- The product MUST NOT execute arbitrary user code in v1.

### Privacy and data

- Data classification MUST be confirmed under TBD-BIZ-003 before connecting internal data sources.
- No production data or PII may be sent to an external model or search provider without an approved data boundary (TBD-INFRA-009, TBD-INFRA-011).
- Audit records MUST redact secrets and minimize personal data.
- Retention periods are a Should requirement, deferred to P1 (see TBD-BIZ-003).

### Reliability

- MCP connection failures MUST degrade gracefully and be visible.
- Task steps MUST have configurable timeouts; v1 retries only transient connection errors.
- Run records MUST survive a process restart.
- The audit log MUST be append-only.

### Performance (proposed; confirm during Stage 3)

- p95 first streamed token ≤ 3 seconds on the internal network for a normal prompt.
- Registry list responses ≤ 500 ms for 500 items.
- Run status updates visible within 2 seconds.

### Observability

- Structured logs with request/run IDs.
- Per-run trace of steps and tool calls.
- Health endpoint and basic metrics for uptime, error rate, and run duration.

### Deployment

- Self-hosted on a single internal VM; packaging and runtime are TBD-INFRA-005.
- A persistent store for registry and run state, a background execution mechanism, and artifact storage; technology choices remain TBD-INFRA-003 and TBD-INFRA-005.
- No inbound internet exposure beyond the team network; outbound access only to approved model/search/MCP endpoints.
- Backup and restore procedure documented in Stage 7.

### Accessibility and browser support

- Keyboard navigation for primary flows; visible focus states; contrast meeting WCAG AA for core UI.
- Latest two versions of Chrome and Edge.

## 13. Permissions matrix

| Capability | Admin | Author | Member | Auditor |
|---|---|---|---|---|
| Chat and search | ✓ | ✓ | ✓ | — |
| Run published tasks | ✓ | ✓ | ✓ | — |
| View own runs | ✓ | ✓ | ✓ | — |
| View all runs and audit | ✓ | — | — | ✓ |
| Create skill/task drafts | ✓ | ✓ | — | — |
| Publish skills/tasks | ✓ | — | — | — |
| Register MCP servers | ✓ | — | — | — |
| Manage users and roles | ✓ | — | — | — |
| Configure models/search | ✓ | — | — | — |

Delegated publication and author roles are subject to TBD-BIZ-004.

## 14. Success metrics (proposed)

| Metric | Proposed target | Source |
|---|---|---|
| Weekly active team members | ≥ 60% of the team by week 4 after launch | Auth/session logs |
| Tasks run per week | ≥ 20 | Run records |
| Published skills | ≥ 5 | Skill registry |
| Connected MCP servers | ≥ 2 | MCP registry |
| Task success rate | ≥ 90% excluding user-input errors | Run records |
| Audit coverage | 100% of registry changes, tool calls, and runs | Audit log |
| Secret exposure incidents | 0 | Audit/incident log |

These targets are proposals; confirm or replace under TBD-BIZ-006.

## 15. Delivery phases

| Phase | Contents | Exit criterion |
|---|---|---|
| **P0 — vertical slice** | Local auth, chat streaming, model config, skill registry, MCP registry, manual task run, run/audit history, search | A Member can log in, chat with search and a published skill, run a task using one skill and one MCP tool, and an Admin can audit the run |
| **P1 — team-ready** | File context, skill categories, task templates, internal knowledge search, model selection, cost tracking, retention settings | The team uses the product for a real recurring workflow without manual intervention |
| **P2 — platform** | Scheduler, approvals, webhooks, code skills with sandbox, SSO/OIDC, registry import/export, evaluation | Product supports governed automation beyond manual runs |

Phase timing is not committed in this PRD; Stage 3 will produce the implementation plan.

## 16. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Model tool-calling is unreliable | Failed skills/tasks | Use models with native tool calling; validate schemas; show tool errors; keep v1 steps simple |
| MCP server instability | Broken runs | Health checks; timeouts; clear errors; allowlist per tool |
| Secret leakage | Security incident | Encrypted references; redaction; no secret display; audit |
| Over-broad tool permissions | Unintended writes | Read-only default; admin allowlist; writes disabled in v1 |
| Scope creep into a workflow engine | Delayed MVP | Enforce §5 non-goals; defer scheduler/approvals |
| Local auth weaknesses | Account compromise | Argon2id/bcrypt, rate limiting, secure cookies, SSO in P2 |
| Data boundary violation | Compliance breach | TBD-BIZ-003 and TBD-INFRA-009/011 before connecting data |
| Low adoption | Wasted build | Start with two real MCP integrations and three real tasks (TBD-BIZ-005) |

## 17. Stack decision inputs (no decision)

The stack is **not selected** in this PRD. The user will decide after reviewing it.

**Requirements that constrain the stack:**

- Streaming chat (SSE or WebSocket) and a browser UI (framework TBD).
- MCP client support for HTTP/SSE; OAuth support is a Should.
- Background task execution with persistent run state.
- Persistent storage, encrypted secret storage, and a self-hosted deployment package.
- Local authentication for the MVP, with an OIDC path later.
- OpenAPI or typed contracts for the UI, and automated tests.

**Decision criteria:** requirement fit, team familiarity, operating cost.

**Current provisional candidate:** Python/FastAPI + React. It is **not settled**. A full three-point comparison will be recorded in `docs/02_architecture/` after PRD review; the decision is tracked as TBD-INFRA-001, TBD-INFRA-002, and TBD-INFRA-005.

## 18. Open decisions

The single source of truth is `docs/00_setup/open_items.md`. This table is a navigation aid only and MUST NOT redefine an entry's owner, deadline, options, or status (RULE-014).

| ID | Decision |
|---|---|
| TBD-BIZ-003 | Data sensitivity and PII boundaries |
| TBD-BIZ-004 | Team size, roles, and skill/MCP publication policy |
| TBD-BIZ-005 | First MCP integrations and first three tasks |
| TBD-BIZ-006 | MVP success metrics and go-live threshold |
| TBD-BIZ-007 | Skill and task execution model in v1 (prompt-only vs code skills, linear vs branching) |
| TBD-INFRA-001 | Frontend stack |
| TBD-INFRA-002 | Backend stack |
| TBD-INFRA-003 | Data store and persistence |
| TBD-INFRA-004 | Missing Stage 1 environment baseline |
| TBD-INFRA-005 | Dependency and virtual-environment tooling |
| TBD-INFRA-006 | Git hosting, remote, and CI |
| TBD-INFRA-007 | Verified run, build, and test commands |
| TBD-INFRA-009 | LLM provider/model gateway and data residency |
| TBD-INFRA-010 | SSO/IdP for post-MVP |
| TBD-INFRA-011 | Search provider and data boundary |

## 19. PRD acceptance

This PRD is accepted when the user confirms:

1. The problem, goals, and non-goals in §2–§5.
2. The MVP scope in §8 and the user stories in §9.
3. The security stance in §12, especially write-capable tools disabled by default and no arbitrary code.
4. The open decisions that block architecture: TBD-BIZ-003/004/005/006/007 and TBD-INFRA-009/011.
5. That a separate Stage 3 stack decision will follow, using the criteria in §17.

After acceptance, the next artifacts are the architecture and stack decision in `docs/02_architecture/`, then the implementation plan.
