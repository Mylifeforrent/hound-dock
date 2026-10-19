# AGENTS.md

Status: Draft
Owner: Tech Lead
As-of: 2026-10-20
Authority: Sole tool-agnostic engineering-rules authority for `hound-dock`; applies to every human and AI agent. Enforceable numbered rules live in [docs/00_setup/project_rules.md](docs/00_setup/project_rules.md); open decisions and conflicts live only in [docs/00_setup/open_items.md](docs/00_setup/open_items.md). Every referenced asset is `Draft`; none is `Frozen`.

## 1. Authority, precedence, and conflict resolution

Precedence, highest first:

1. Confirmed user decisions and resolved registry entries — recorded in `docs/00_setup/open_items.md`; business detail in [docs/01_product/business_model.md](docs/01_product/business_model.md) (v0.3) and [docs/01_product/prd.md](docs/01_product/prd.md) (v0.2).
2. `docs/00_setup/environment_baseline.md` — recorded 2026-10-20 (`TBD-INFRA-004` Resolved; `CHG-022`); it records read-only observations and authorizes no command.
3. Existing repository content — current docs, design artifacts, and change records.
4. This file and the current task contract.

- A lower-precedence instruction MUST NOT override a higher-precedence one.
- On any conflict, STOP. Do not choose a side, overwrite either side, or normalize silently. Request that the Tech Lead register `CONFLICT-nnn` in `open_items.md` with both locations, then obtain a user decision and apply it through a `CHG` record. See RULE-010 and RULE-014.
- A `Resolved` TBD records a decision; it does not by itself create a page, endpoint, permission, acceptance criterion, or implementation authority (PRD §10.1). Never infer a surface from a resolved status.
- No assumption may become a settled decision. Log an assumption as a TBD; never encode it in code, schema, copy, or a test.
- **Known divergence — do not resolve here:** Admin skill/task publication and audit read are effective in `docs/02_architecture/05_enterprise_internal_baseline.md` and `business_model.md` Appendix B, but denied or absent in `docs/03_design/interaction_design.md` §2.2, `prd.md` §10.2, and `api_interface_spec.md` §15 CF-01. No side is chosen. Do not add an Admin authoring/audit UI, endpoint, permission, or acceptance criterion until the conflict is registered and decided.

## 2. Project goal, scope, and current state

`hound-dock` is a self-hosted internal agent workspace for one team. A signed-in member chats with an internal AI, reads governed skill and MCP registries, and manually runs a recorded task definition. MVP: chat + registries + manual task runs, self-hosted with local accounts, no external model egress. Sources: [PRD §2](docs/01_product/prd.md) and [business model Appendix B](docs/01_product/business_model.md); [README](README.md) is navigation only.

- **Current state:** Stage 2–6 artifacts (PRD, architecture, design, data model, API contract) exist as `Draft`; the Gate 1 scope boundary is accepted (`TBD-BIZ-012` Resolved, option (b); `CHG-021`); the Stage 1 baseline is recorded (`TBD-INFRA-004` Resolved; `CHG-022`); Stage 7 Development Setup has not started. Implementation is not authorized.
- **Scope authority:** [PRD §3 and §8](docs/01_product/prd.md) (capabilities and exclusions) and [business model §3 and Appendix B](docs/01_product/business_model.md). Do not add, remove, or promote a capability, role, page, state, field, endpoint, or metric absent from those documents.
- **Explicitly out of scope:** search/citations, file context, a streaming commitment, cost/usage, scheduling/webhooks, automatic retry, approvals/HITL, MCP registration/invocation/runtime, account administration/SSO, mobile, dark theme. See PRD §8 and [architecture §9](docs/02_architecture/architecture.md).
- **Open items:** the only source is `open_items.md`. Never define, redefine, resolve, or delete an ID elsewhere.

## 3. Repository map

```text
hound-dock/
├── AGENTS.md                  # this file; sole instruction authority
├── README.md                  # navigation only; may lag and is not state authority
├── .gitignore
├── frontend/                  # boundary README only; no code, manifest, lockfile, or commands
├── backend/                   # boundary README only; no code, manifest, lockfile, or commands
└── docs/
    ├── 00_setup/              # rules, stage map, open-items registry; environment_baseline.md recorded
    ├── 01_product/            # PRD, business model
    ├── 02_architecture/       # architecture, ADRs, enterprise-internal baseline
    ├── 03_design/             # visual authority: design_tokens.json, component_spec.json, highfi/; prototype/ is interaction reference only
    ├── 04_data/               # logical data model
    ├── 05_api/                # API interface contract
    ├── 06_development/        # verified commands; empty until Stage 7 (TBD-INFRA-005/007)
    ├── 07_testing/            # test strategy; empty until commands exist
    ├── 08_security/           # security/privacy policy; currently a boundary README only
    ├── 09_deployment/         # deployment; empty (TBD-INFRA-006)
    ├── 10_operations/         # operations; empty
    ├── 11_quality/            # quality gates; empty
    ├── 12_reviews/            # independent review records
    └── 13_changes/            # CHG records: Plan, Task Brief, Verification, evidence
```

No new top-level entry may be created (RULE-002). Business assets belong under their owning area.

## 4. Technology and architecture boundaries

**The stack is selected at major-version level only.** Frontend: React 19 + TypeScript 5 + Vite 7 (SPA, no SSR). Backend: Python 3.12 + FastAPI + uv. The resolution is recorded in `docs/00_setup/open_items.md` (`TBD-INFRA-001`/`TBD-INFRA-002`); the comparison and the full component list are in `CHG-019`. Exact project pins, the frontend Node/pnpm pair, dependency tooling, and every command remain unverified (`TBD-INFRA-005/007`); the Stage 1 baseline records the observed host and tool versions. Do not infer a project pin, scaffold, migration, or command from the documents.

| Area | Status | Gate |
|---|---|---|
| Frontend | Selected — React 19 + TypeScript 5 + Vite 7 (SPA; no SSR) | `TBD-INFRA-001` Resolved; exact versions and commands `TBD-INFRA-005/007`; Stage 1 baseline `CHG-022` |
| Backend | Selected — Python 3.12 + FastAPI + uv | `TBD-INFRA-002` Resolved; exact versions and commands `TBD-INFRA-005/007`; Stage 1 baseline `CHG-022` |
| Data store | PostgreSQL selected | `TBD-INFRA-003` Resolved; physical schema/migrations not authored |
| Model access | Internal OpenAI-compatible gateway; no external egress | `TBD-INFRA-009` Resolved |
| Dependency tooling | Partly recorded — uv (backend); pnpm/lockfile policy still open | `TBD-INFRA-005` Open |
| Environment baseline | Recorded — Stage 1 (2026-10-20) | `TBD-INFRA-004` Resolved; commands `TBD-INFRA-007` Open |
| CI / hosting | TBD | `TBD-INFRA-006` Open |
| Verified commands | TBD | `TBD-INFRA-007` Open |

- Architecture authority: [architecture.md](docs/02_architecture/architecture.md) as amended by [05_enterprise_internal_baseline.md](docs/02_architecture/05_enterprise_internal_baseline.md). The recommended shape is a modular monolith with explicit ports (MOD-01–MOD-08); module names are architecture-local, not packages, services, or deployment units.
- Every command and query is authorized server-side by the permission matrix. Default is deny; `own-only` is enforced inside the query; `read-only` is a projection rule. No module bypasses policy. See ADR-001 and architecture §6.
- Run and run-step terminal states are immutable; a failed step is visible; remaining steps are `Skipped`; there is no automatic retry; a new run is the compensation. See ADR-002 and architecture §7.3.
- MCP is metadata-only: no runtime, connection test, allowlisting, tool invocation, or credential resolution. No HITL/approval/interrupt/checkpoint/resume. No scheduler, webhook, or event-triggered run. See ADR-003/ADR-004 and architecture §9.
- Any stack must preserve: server-side policy, durable persistence across restart, a model port with an egress gate, a run-executor port, background execution or an equivalent that creates no scheduled run, testable matrix and state machines, and self-hosted packaging without a vendor control plane (architecture §12).

## 5. Frontend, backend, and API contract

| Area | Owns after activation | MUST | MUST NOT |
|---|---|---|---|
| Frontend Agent | `frontend/**` | Render the effective PG-001–PG-009 surface and PG-010–PG-012 only as the shared No Permission panel, following the nine-state matrix in `docs/03_design/highfi/`; call only API-001–API-015; use business references in routes; treat server denial as authoritative; use tokens/components per §7 | Implement authorization or business rules; trust client-supplied identity/role/owner; render a denied capability as disabled; display owner/account/credential/tool-name/PII; copy `prototype/` into `frontend/`; scaffold before activation and the Stage 7 baseline (`TBD-INFRA-001` is Resolved, not an implementation authorization; `TBD-INFRA-005/007`) |
| Backend Agent | `backend/**` | Enforce the matrix server-side, own-only scope, non-disclosure, idempotency, the error envelope, and §6 data constraints; persist per the logical model; return only contract fields | Bypass policy; return tokens, credentials, secrets, account/owner/initiator fields, tool names, step parameters, or audit fields; add endpoints, paging, sorting, filtering, or a version segment; create schema/migrations without a separate CHG |

Contract authority: [api_interface_spec.md](docs/05_api/api_interface_spec.md) (Draft; not implementation authority).

- **Surface:** 15 operations, `API-001`–`API-015`, base path `/api`, no version segment. `GET` for queries, `POST` for commands; no `PUT`, `PATCH`, `DELETE`, or `HEAD`. No endpoint exists for a denied matrix column; absence is the denial.
- **Auth:** only `POST /api/auth/sign-in` is anonymous. The session is a server-set `HttpOnly` cookie, never in a body, URL, or log. `Authorization`, `X-Account-Id`, `X-Role`, and similar headers are ignored and grant nothing. A rejected credential is `40101` with one generic message; an absent or ended session is `40102`. `Account.read` is denied; no owner or initiator is exposed.
- **Authorization:** default deny; `40301` for a known resource class with no grant; an unknown or non-owned reference is the same `40401` (no existence oracle); own-only scope is in the query, never a post-fetch filter. Client checks are convenience only.
- **Errors:** seven classes `ERR-01`–`ERR-07`, plus transport `CONTROL`; envelope `{"error":{"code","class","message","fields"?,"state"?,"outcome"?}}`. No `detail`, `errors`, `provider`, `stack`, `data`, `request_body`, `account_id`, or `owner`. `fields` only for `ERR-01`; `outcome:"unconfirmed"` only for `50302`. Validation is `400`, never a framework `422`.

| Code | HTTP | Class | Use |
|---|---|---|---|
| `40001` | 400 | `ERR-01` | Missing required input |
| `40002` | 400 | `ERR-01` | Invalid or malformed input |
| `40101` | 401 | `ERR-02` | Rejected credential, generic |
| `40102` | 401 | `ERR-02` | Session absent, ended, or invalid |
| `40301` | 403 | `ERR-03` | No grant for a known resource class |
| `40401` | 404 | `ERR-04` | Unknown, unrecorded, or non-owned; identical |
| `40901` | 409 | `ERR-05` | Duplicate submission / key reuse |
| `40902` | 409 | `ERR-05` | Persisted-state conflict |
| `42901` | 429 | `CONTROL` | Rate limited; not an eighth business class |
| `50001` | 500 | `ERR-07` | Unexpected internal failure |
| `50301` | 503 | `ERR-06` | Dependency unavailable |
| `50302` | 503 | `ERR-06` | Outcome unconfirmed; do not retry blindly |

- **Idempotency:** `Idempotency-Key` is required on `API-002`, `API-005`, `API-006`, and `API-013`. Same actor + key + body replays the same result; a different body is `40901`; no second aggregate. After `50302`, reuse the key or re-read; never retry blindly. The key-retention window remains proposed (`TBD-BIZ-008`); see API §9.
- **Lists:** `{items, count}` only; no paging, sorting, filtering, or query parameters in v0.1; fixed server order; `count` is the actor's visible count.
- **Reply:** `API-006` returns `202` while pending and `200` when a completed assistant turn exists; it returns no assistant text. Streaming is not a requirement.
- No Admin authoring, audit, all-runs, account, artifact, MCP registration, or search endpoint exists in the contract. Do not invent one; see §1.

## 6. Data, privacy, and security red lines

Authority: [data_model_spec.md](docs/04_data/data_model_spec.md), [08_security/README.md](docs/08_security/README.md) (currently a boundary only), [business model Appendix B](docs/01_product/business_model.md), and [API §12](docs/05_api/api_interface_spec.md).

- **Store:** PostgreSQL is selected (`TBD-INFRA-003` Resolved). The logical model defines 13 business tables plus the proposed support stores `account_credential` and `idempotency_key` (`data_model_spec.md` §2.5); session remains runtime state. **No DDL, SQL, migration, physical index, or schema may be authored** until a separate authorized physical-design change; neither the store decision nor the support-store model is a migration authorization.
- **Classification:** `Internal` or `Sensitive` only. `Highly Sensitive` is prohibited; no `Public` product data. Credentials, secret values, tokens, password hashes, and verifiers MUST NOT be stored in any business table. A local verifier may exist only in the security-owned support store (`data_model_spec.md` §2.5), and only after `TBD-INFRA-012` is resolved; it is never returned, logged, or projected.
- **Sensitive data** includes person-linked identifiers and sign-in names; conversation/message content; skill/task names, descriptions, instructions, inputs, and step parameters; MCP names and endpoints; version labels; tool names; run references; result/error summaries; timestamps/durations; audit actor/target/correlation. Structural IDs, ordinals, enums, and state values are `Internal`. See data model §7.2.
- **Retention:** conversations/messages 90 days; runs/run steps 180 days; audit 365 days; accounts while active; registry records while recorded. No `expires_at` or retention column; the retention job is later. Offboarding/deletion is `TBD-BIZ-013`; do not invent a cascade.
- **Audit:** `audit_event` is append-only, Admin-only read, no export, 365 days; reading appends an `audit_read` event. The API/UI audit surface is absent or blocked; do not invent an audit page, endpoint, or field (see §1).
- **Logs:** operational logs MUST NOT contain message content, sign-in names, endpoint references, tool names, credentials, tokens, or PII. Allowed fields: correlation id, run reference, internal actor id, outcome, error class. Logs are not audit events.
- **Projections:** no account/owner/initiator/actor field; no credential, token, or secret reference; no tool name or step parameter; no timestamp except `duration_ms`; no audit field. `Sensitive` is not "never serialized": return it only where the matrix and page authorize it (API §12).
- **AI tools:** never submit secrets, production data, or user PII to any AI tool; datasets must be synthetic or redacted. Classification is recorded in Appendix B; no Highly Sensitive data. `TBD-BIZ-014` remains Open: issue no legal or compliance conclusion.
- **External egress:** none. The model port may call only the internal OpenAI-compatible gateway; no external model, search, or MCP egress.

## 7. UI, tokens, and visual authority

- **Visual authority:** [design_tokens.json](docs/03_design/design_tokens.json) (values), [component_spec.json](docs/03_design/component_spec.json) (C-01–C-17), and [docs/03_design/highfi/](docs/03_design/highfi/) (PG-001–PG-012 state pages). [highfi_page_map.md](docs/03_design/highfi_page_map.md) maps pages, states, breakpoints, and reuse. All are `Draft`.
- **Interaction reference only:** [docs/03_design/prototype/](docs/03_design/prototype/) is a throwaway clickable prototype with synthetic data. It is not visual authority, not a design system, and not production code. Do not copy its CSS, values, or DOM into `frontend/`; do not promote it unchanged.
- **Tokens:** use `primitive → semantic → component`; component names are only C-01–C-17. No raw hex, `rgb()`/`rgba()`, or literal `font-size` in highfi CSS/JS; values come from tokens. `docs/03_design/highfi/tokens.css` is generated — never hand-edit it; regenerate it with the documented design-artifact tool if token values change.
- **Pages and states:** exactly PG-001–PG-012 and the nine states `Default`, `Loading`, `Empty`, `No Result`, `Error`, `No Permission`, `Editing`, `Submitting`, `Success-Failure`. `Blocked` is not a page state. Every N/A state keeps its documented reason.
- **Current rendered surface:** PG-001–PG-009 are effective; PG-010–PG-012 render the shared No Permission panel only. The Admin authoring divergence in §1 is unresolved; do not add an authoring form, disabled Publish, or audit page.
- **Prohibited UI:** mobile or any layout below 960px; dark theme or theme switch; search/filter/pager/load-more; create/edit/publish/delete/test/allowlist/invoke/export/share controls; account menu, avatar, or owner display; credential values; tool names; "coming soon" disabled controls. A denied capability is absent, not disabled.
- **Accessibility:** skip link, focusable main, 2px visible focus ring, focus moved to the page heading, polite live regions, and `prefers-reduced-motion` support. WCAG 2.2 AA is a proposed target (`NFR-011`, `TBD-BIZ-008`), not an accepted certification.
- **Open design decisions:** unresolved copy, variant, and readiness decisions are recorded in `highfi_page_map.md` §6.4 and §10.2; do not invent copy, a second string, or a new variant. `TBD-INFRA-001` is Resolved for the framework and build tool only; no design tool, component library, or handoff format is selected.

## 8. Verification, testing, and commands

- **Before any commit:** executed verification is mandatory (RULE-011). The `CHG` MUST contain `## Verification` with each command, exit code, and observed result; "looks correct" is not evidence. The reviewer MUST re-run the commands.
- **Tests:** every behavior change MUST add or update automated tests; tests MUST fail before and pass after (RULE-006). Documentation-only changes are exempt. No coverage threshold may be invented; it is a TBD until measured. The recorded stack names pytest (backend) and Vitest (frontend); no test command is verified (`TBD-INFRA-007`).
- **Documentation checks:** verify `Status:` lines, relative links, TBD/CONFLICT references against `open_items.md`, the frozen-asset scan, and the write set. Record them in the `CHG`.
- **Design-artifact checks:** if highfi files change, re-run the documented token projection and record that `tokens.css` is generated, not hand-edited. This is not a project build or test command.
- **Commands:** none of the project install/run/build/test/lint/typecheck/deploy commands is verified. Do not state, imply, or run one as project verification.

| Command class | Status | Gate |
|---|---|---|
| Install / dependency add | TBD | `TBD-INFRA-005` |
| Dev run | TBD | `TBD-INFRA-007` |
| Build | TBD | `TBD-INFRA-007` |
| Test | TBD | `TBD-INFRA-007` |
| Lint / typecheck | TBD | `TBD-INFRA-007` |
| Deploy | TBD | `TBD-INFRA-006/007` |

No `package.json`, `pyproject.toml`, lockfile, `Makefile`, `Dockerfile`, CI workflow, or `.env.example` exists. Placeholder manifests and configuration are prohibited (RULE-017). The Stage 1 baseline records the observed host and tool versions; no project pin, command, browser, database, gateway, or deployment is verified.

## 9. Prohibitions (each is checkable)

| # | MUST NOT | Check |
|---|---|---|
| 1 | Create tool-specific instruction files: `CLAUDE.md`, `.cursorrules`, `.cursor/**`, `.github/copilot-instructions.md`, `.clinerules`, `.windsurfrules`, or equivalents. | `git ls-files` returns none; root `AGENTS.md` exists (RULE-016). |
| 2 | Modify, move, delete, or reformat a `Status: Frozen` asset without RULE-010 approval. | Diff intersected with `grep -rl '^Status: Frozen' docs` is empty or has an `open_items.md` approval plus a `CHG` reference and owning-folder README entry. Currently no Frozen asset exists. |
| 3 | Add, upgrade, or import a third-party dependency without a RULE-007 audit and recorded rationale. | Every manifest/lockfile diff is paired with a complete `## Dependency audit` in the `CHG`; no unaudited import appears. |
| 4 | Commit `.env`, real credentials, tokens, production data, or PII; put values in `.env.example`. | `git ls-files` shows no `.env`; `.env.example`, if ever created, has no `KEY=value` line; no credential-like value appears in the diff. |
| 5 | Send secrets, production data, or user PII to any AI tool. | No such content in prompts, attachments, logs, or change records; dataset is synthetic or redacted. |
| 6 | Commit AI-generated code or docs without executed verification. | `## Verification` contains a command and exit code 0; the reviewer re-runs it. |
| 7 | Invent or imply install/run/build/test/deploy commands, tool versions, CI, or deployment readiness. | No command or claim outside verified `docs/06_development/` evidence; unknown values are TBD IDs. |
| 8 | Create business code, scaffolding, dependency manifests, lockfiles, placeholder configuration, or tool configuration before authorization. | `frontend/` and `backend/` contain only `README.md`; no manifest, lockfile, or tool config exists. |
| 9 | Create a new top-level entry or root business file. | Root listing is exactly `frontend/`, `backend/`, `docs/`, `README.md`, `AGENTS.md`, `.gitignore`, `.git/` (RULE-002). |
| 10 | Write outside owned paths, or mix ownership areas without a recorded handoff. | Diff maps to the §10 ownership table; a cross-area path has both owners' acceptance in the `CHG` (RULE-019). |
| 11 | Create, redefine, resolve, or delete a TBD/CONFLICT outside `open_items.md`; resolve a conflict by force. | IDs are defined only in the registry and merely referenced elsewhere; no registry row is removed; no side is chosen without user approval (RULE-014). |
| 12 | Invent a page, role, state, error code, endpoint, entity, field, permission, or business rule absent from the referenced docs. | Each new identifier/behavior traces to a cited section; no new `PG`, `ROLE`, `STATE`, `API`, `ENT`, or error code is introduced. |
| 13 | Add an Admin authoring/audit surface, audit page/endpoint, MCP runtime, HITL, scheduler, or automatic retry while the §1 divergence or the relevant open items remain unresolved. | No such route, endpoint, or component exists; any proposal cites the conflict and waits. |
| 14 | Copy `prototype/` into `frontend/`, hand-edit `tokens.css`, or introduce raw visual values. | No prototype file is copied; generated file is unchanged by hand; highfi CSS/JS contains no hex, `rgb()`, or literal `font-size`. |
| 15 | Design below 960px, or add a dark theme or theme switch. | No sub-960 viewport rules or tokens; light-only token contract. |
| 16 | Use production data or PII in fixtures, examples, tests, or migrations. | Fixtures use synthetic or reserved values; no real name, credential, token, endpoint, or PII. |
| 17 | Modify global or user-level configuration, or write outside the project. | Write set is confined to the workspace; no home-directory or global-tool edit. |

## 10. Ownership, change workflow, and references

| Path | Owner | Write rule |
|---|---|---|
| `frontend/**` | Frontend Agent (dormant) | Only after activation; `TBD-INFRA-001` is Resolved, but the Stage 7 baseline and commands (`TBD-INFRA-005/007`) are still required. |
| `backend/**` | Backend Agent (dormant) | Only after activation; `TBD-INFRA-002` is Resolved, but the Stage 7 baseline, dependency audit, and commands (`TBD-INFRA-005/007`) are still required. |
| `docs/01_product/**` … `docs/11_quality/**` | Docs Agent (dormant) | Docs and design only; no production code, root governance, `CHG`, or review. |
| `docs/12_reviews/**` | Verifier (dormant) | Review records only; no source or doc edits. |
| `README.md`, `AGENTS.md`, `.gitignore`, `docs/00_setup/**`, `docs/13_changes/**` | Tech Lead | Governance, rules, registry, and `CHG` records. |

- Ownership is exclusive. A cross-boundary change requires an explicit handoff and both owners' acceptance in the `CHG` (RULE-019). Dormant roles MUST NOT write.
- A change is **Complex** when it touches two or more ownership areas, changes more than five files, adds or upgrades a dependency, changes a frozen asset, or changes root layout, this file, or `project_rules.md`. Complex changes need `## Plan` and `## Task Brief` in a `CHG` before implementation; every change needs a `CHG` and `## Verification` (RULE-018/RULE-020).
- Order: Plan → Task Brief → implement → execute verification → record evidence → independent review (RULE-005) → merge. `CHG` numbers are sequential and never reused; commits after `CHG-000` carry `Refs: CHG-nnn`.
- A frozen asset is any file with `Status: Frozen`; unfreezing requires explicit user approval in `open_items.md`, the owning-folder README, and the `CHG` (RULE-010). `open_items.md` is append-only; resolved entries stay with status `Resolved` and their source.
- `docs/00_setup/environment_baseline.md` records the 2026-10-20 Stage 1 observations. Do not extend it with an unexecuted version, command, or environment claim (RULE-017).

| Topic | Path |
|---|---|
| Numbered rules | [docs/00_setup/project_rules.md](docs/00_setup/project_rules.md) |
| Open decisions and conflicts | [docs/00_setup/open_items.md](docs/00_setup/open_items.md) |
| Stage map and setup contract | [docs/00_setup/README.md](docs/00_setup/README.md) |
| PRD | [docs/01_product/prd.md](docs/01_product/prd.md) |
| Business authority | [docs/01_product/business_model.md](docs/01_product/business_model.md) |
| Architecture | [docs/02_architecture/architecture.md](docs/02_architecture/architecture.md) · [baseline](docs/02_architecture/05_enterprise_internal_baseline.md) |
| Data model | [docs/04_data/data_model_spec.md](docs/04_data/data_model_spec.md) |
| API contract | [docs/05_api/api_interface_spec.md](docs/05_api/api_interface_spec.md) |
| Design tokens | [docs/03_design/design_tokens.json](docs/03_design/design_tokens.json) |
| Component specification | [docs/03_design/component_spec.json](docs/03_design/component_spec.json) |
| High-fidelity map and pages | [docs/03_design/highfi_page_map.md](docs/03_design/highfi_page_map.md) · [docs/03_design/highfi/](docs/03_design/highfi/) |
| Prototype (interaction only) | [docs/03_design/prototype/](docs/03_design/prototype/) |
| Security | [docs/08_security/README.md](docs/08_security/README.md) |
| Development commands (empty) | [docs/06_development/README.md](docs/06_development/README.md) |
| Testing (empty) | [docs/07_testing/README.md](docs/07_testing/README.md) |
| Deployment (empty) | [docs/09_deployment/README.md](docs/09_deployment/README.md) |
| Change records | [docs/13_changes/README.md](docs/13_changes/README.md) |
| Reviews | [docs/12_reviews/README.md](docs/12_reviews/README.md) |
