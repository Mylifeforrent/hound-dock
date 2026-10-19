# CHG-019 — Frontend and backend stack decision

Status: Draft
Complexity: Complex
Refs: TBD-INFRA-001, TBD-INFRA-002 (resolved by this change); TBD-INFRA-003 (Resolved, referenced); TBD-INFRA-004, TBD-INFRA-005, TBD-INFRA-006, TBD-INFRA-007, TBD-BIZ-007, TBD-BIZ-008, TBD-BIZ-012, TBD-BIZ-014 (Open, referenced); CONFLICT-001 (Resolved elsewhere, referenced); CONFLICT-002 (Open, no effect)
Owner: Tech Lead

## Plan

- **Why this change:** the product owner approved the Tech Lead comparison on 2026-10-19 and selected one frontend and one backend candidate. Without a recorded resolution, the registry would still say `TBD-INFRA-001`/`TBD-INFRA-002` are Open while the conversation, `AGENTS.md`, the architecture, the API contract, and both boundary READMEs would drift. The decision must live in `open_items.md` (RULE-014) and be propagated so no document contradicts it.
- **Approach:** resolve both entries in place with a `Resolution source`, keep every version/tooling/command gate open, and update only the documents that assert stack status. Record the comparison basis in this change record. Do not scaffold, install, add a manifest or lockfile, author DDL or migrations, add an endpoint/page/field/permission/error code, or write a command.
- **Affected paths:**
  - `docs/00_setup/open_items.md` (modified): `TBD-INFRA-001` and `TBD-INFRA-002` moved to `Resolved`; summary counts corrected to 6 Open / 5 Resolved; registry-rules wording adjusted; `TBD-INFRA-005` and `TBD-INFRA-007` gate text reconciled with the resolved stack.
  - `AGENTS.md` (modified): §4 stack status and table; §5 frontend scaffolding prohibition; §7 design-tool sentence; §8 test framework and install gate; §10 frontend/backend write rules.
  - `docs/02_architecture/architecture.md` (modified): §2.2, §3.2, §3.3, §4.3, §5.2, §12, §14 R-08/R-09, §15 status rows, §16.1 criterion 3, §16.2, §17. The candidate table is retained as the decision input.
  - `docs/05_api/api_interface_spec.md` (modified): header framework status, §1.4, and §13 header; a dated status note covers the authoring-time wording in §14.2 and §15 `CF-14`. The contract body is unchanged and remains framework-neutral.
  - `frontend/README.md`, `backend/README.md` (modified): current state and open decisions.
  - `README.md` (modified): the environment bullet only; the rest of the navigation file remains stale and is not refreshed here.
  - `docs/13_changes/CHG-019-frontend-backend-stack.md` (new).
- **Decision basis:** the owner approved this comparison. Scores are 0–5; weighted total = requirement fit ×3 + familiarity ×2 + operating cost ×2 (maximum 35). Criteria are the registered ones in `open_items.md` §`TBD-INFRA-001`/`002`.

| Layer | Candidate (registered wording) | Fit | Familiarity | Cost | Weighted /35 | Key veto or downgrade |
|---|---|---|---|---|---|---|
| Frontend | React + TypeScript + Vite | 5 | 5 | 4 | **33** | No structural veto; three runtime packages and the test stack need RULE-007 audits; C-01–C-17 must be built without a UI kit or Tailwind |
| Frontend | Next.js | 3 | 4 | 2 | 21 | Veto in its default form: RSC, Route Handlers, and Middleware need a Node server runtime, which conflicts with the no-server-control-plane boundary; `output: 'export'` avoids it but removes the reason to choose it |
| Frontend | Vue 3 + Vite | 4 | 3 | 4 | 26 | No veto; pure static SPA is viable, but the nine-state and accessibility evidence must all be built; familiarity is an assumption |
| Frontend | SvelteKit | 3 | 3 | 3 | 21 | Downgrade: default SSR and server `load`; `adapter-static` plus disabled server load is required; thinner test ecosystem |
| Backend | Python 3.12 + FastAPI + uv | 5 | 4 | 4 | **31** | No veto; requires a `422`→`400` handler, unknown-query rejection, and disabling the default documentation endpoints |
| Backend | Node 22 + TypeScript (Fastify or NestJS) | 4 | 4 | 3 | 26 | Partial veto: the candidate is still two choices (Fastify vs NestJS); NestJS is heavy for 15 endpoints; a second runtime |
| Backend | Java 21 + Spring Boot | 4 | 2 | 2 | 20 | Cost veto: JVM, build tool, and framework configuration are heavy for one team and 15 endpoints; no familiarity evidence |
| Backend | Go 1.23 | 4 | 2 | 4 | 24 | No veto; a single binary is cheapest to host, but DTO, validation, policy layering, and migration boilerplate are highest |

  **Familiarity is an assumption.** The repository contains no team-skill evidence. The score reflects ecosystem breadth and proximity to the documented TypeScript/JSON toolchain, not measured team experience. The owner accepted the recommendation with that caveat; a future change that contradicts it must record the new evidence.
- **Risks:**
  1. A resolved stack could be read as implementation authorization. Mitigation: every updated file states that scaffolding, schema, migrations, and commands remain blocked by `TBD-INFRA-004/005/007` and Gate 1 (`TBD-BIZ-012`); `frontend/` and `backend/` still contain only `README.md`.
  2. The comparison's familiarity score is not evidence. Mitigation: labelled an assumption in this record and in the registry's resolution source; no client or team-skill claim is made.
  3. The architecture and API contract contain authoring-time statements that the stack was open. Mitigation: dated status notes and by-reference wording; the API contract body and its framework neutrality are left intact, and `CF-14` is not rewritten.
  4. Cross-ownership writes. Mitigation: the handoff is recorded in the Task Brief; Docs, Frontend, and Backend owners are dormant and their acceptance is pending, not granted.
  5. Partial version pins. Mitigation: major versions only; `TBD-INFRA-004` locks exact versions and the Stage 1 baseline.
  6. Three server-side stores are not modelled: a credential verifier, a session store, and an idempotency-key store. Mitigation: carried as open implementation gaps in the Decision log; no new TBD is created and no storage is designed here.
- **Verification plan:** registry parse and counts, resolution-source completeness, stale-claim scan, relative-link walk, TBD/CONFLICT reference lookup, API-ID set check, project-command scan, manifest/lockfile scan, frozen-asset scan, root-layout scan, `git diff --check`, and write-set inspection. Documentation-only change: no install, build, server, browser, database, or deployment command is run.

## Task Brief

- **Scope:** record the owner's selection of registered candidate (a) for `TBD-INFRA-001` and `TBD-INFRA-002`, and propagate the status to the decision-bearing documents. Do not start implementation, scaffolding, dependency installation, physical design, migrations, deployment, or any command.
- **Inputs (highest first):** the owner's approval of the Tech Lead comparison on 2026-10-19; `docs/00_setup/open_items.md`; `AGENTS.md`; `docs/02_architecture/architecture.md` §12; `docs/05_api/api_interface_spec.md` §13/§15; `docs/04_data/data_model_spec.md`; `docs/03_design/design_system.md`, `design_tokens.json`, `component_spec.json`, and `highfi_page_map.md`. All are `Draft`; none is `Frozen`.
- **Outputs:** the eight paths listed under Affected paths.
- **Acceptance criteria:**
  1. `TBD-INFRA-001` and `TBD-INFRA-002` remain in place with `Status: Resolved` and a non-empty `Resolution source`; no entry is deleted or renumbered.
  2. The registry summary reports `TBD-INFRA` 6 Open / 5 Resolved.
  3. Every updated document states the major-version selection and that exact versions, tooling, and commands remain `TBD-INFRA-004/005/007`.
  4. No install, run, build, test, lint, typecheck, or deploy command is stated or implied.
  5. No manifest, lockfile, scaffold, DDL, migration, endpoint, page, field, permission, or error code is added.
  6. `AGENTS.md` still forbids scaffolding before authorization and states that a resolved stack is not implementation authority.
  7. The API contract remains framework-neutral; §13 remains non-normative; its 15-operation surface and error model are unchanged.
  8. Relative links resolve; every `TBD`/`CONFLICT` reference exists in the registry; no Frozen asset is touched; the root layout is unchanged.
- **Ownership and handoff:** `docs/00_setup/**`, `AGENTS.md`, `README.md`, and `docs/13_changes/**` are Tech Lead-owned and authored here. `docs/02_architecture/**` and `docs/05_api/**` are Docs Agent-owned; `frontend/**` and `backend/**` are Frontend/Backend Agent-owned. Those owners are dormant, so the Tech Lead authors the status-only edits under this record, following the CHG-015/016/018 handoff pattern. Their acceptance is pending, not granted. `docs/12_reviews/**` is untouched; no Verifier review exists for this change.

## Verification

Executed on 2026-10-19 (Asia/Shanghai) in the repository root. Documentation-only: no install, build, server, browser, database, migration, or deployment was run. Inline Python read the files and printed the counts below.

| # | Check | Command or method | Result |
|---|---|---|---|
| 1 | Registry parse | Inline Python entry/status walk over `docs/00_setup/open_items.md` | 28 entries, 28 unique; `TBD-INFRA` 6 Open / 5 Resolved; `TBD-INFRA-001` and `TBD-INFRA-002` are `Resolved` |
| 2 | Resolution sources | Inline check that every `Resolved` entry has a non-empty `Resolution source` | 5 of 5 resolved `TBD-INFRA` entries carry a source; no empty source |
| 3 | Stale-claim scan | `grep` for "stack is not selected", "No stack", "No toolchain is confirmed", "No test framework is selected", "FastAPI is **not confirmed**", and "`TBD-INFRA-002` remains Open" across the changed documents | No unqualified hit; the only "No stack" line is the §3.3 non-goal qualified by "originating in this document"; the only "not selected" lines are historical or component-library-specific |
| 4 | Relative links | Python link walk over the changed files | 99 links checked; 0 missing after this record was created (`CHG-019` was the only missing target before creation) |
| 5 | TBD/CONFLICT references | Python extraction of every ID in the changed files and lookup in the registry | 0 unknown references; the registry defines 28 IDs |
| 6 | API surface | Inline extraction of `API-\d{3}` from `docs/05_api/api_interface_spec.md` | Exactly `API-001`–`API-015`, 15 IDs; no endpoint added or removed |
| 7 | Project-command scan | Regex over the changed files for `uv sync`, `uv run`, `pnpm install`, `pnpm dev`, `npm install`, `npm run`, `vite build`, `uvicorn <app>`, and `alembic upgrade` | 0 command invocations; `pytest` and `Vitest` appear only as framework names; the only matching line is this table's own list of scanned patterns |
| 8 | Manifests and lockfiles | `git ls-files` filtered for `package.json`, `pyproject.toml`, lockfiles, `Makefile`, `Dockerfile`, compose, `.env` | No output; none exists |
| 9 | Code boundary | `find frontend backend -type f ! -name README.md` | No output; both directories still contain only `README.md` |
| 10 | Frozen assets | `grep -rl '^Status: Frozen' docs` | No output; no Frozen asset exists or was touched |
| 11 | Root layout | `ls -A` against the RULE-002 allowlist | `.git`, `.gitignore`, `AGENTS.md`, `README.md`, `backend/`, `docs/`, `frontend/` only |
| 12 | Whitespace and patch sanity | `git diff --check` | Exit 0; no whitespace error |
| 13 | Write set | `git status --short` and `git diff --stat` | Seven modified files plus this new record; no other path changed |

Author verification: **PASS**. No independent Verifier review exists for this change; the Verifier role is dormant and `docs/12_reviews/` contains no CHG-019 review. The record remains `Draft`.

## Dependency audit

None. No dependency is added, upgraded, imported, installed, or locked. The decision names intended third-party components (React, TypeScript, Vite, FastAPI, Pydantic, SQLAlchemy, psycopg, Alembic, Uvicorn, pytest, Vitest), but naming them is not an installation or a RULE-007 audit; each remains subject to a `## Dependency audit` in the change that first adds it.

## Decision and conflict log

- 2026-10-19: The product owner approved the Tech Lead comparison and selected candidate (a) for both entries: frontend React 19 + TypeScript 5 + Vite 7 (client-only SPA, no SSR), and backend Python 3.12 + FastAPI + uv. The selection is recorded in `docs/00_setup/open_items.md`; this record carries the scoring basis.
- 2026-10-19: The decision is **major-version only**. Exact versions, the frontend Node/pnpm toolchain, lockfiles, dependency audits, the environment baseline, hosting/CI, and every command remain Open under `TBD-INFRA-004/005/006/007`. No tool version is verified.
- 2026-10-19: Scaffolding is **not** authorized. `frontend/` and `backend/` still contain only `README.md`; no manifest, lockfile, tool configuration, code, DDL, or migration exists. Gate 1 remains unaccepted (`TBD-BIZ-012`) and Stage 7 has not started.
- 2026-10-19: The API contract remains framework-neutral. §13 stays conditional and non-normative; `TBD-INFRA-002`'s status change does not bind the contract to FastAPI or any framework version. `CF-14` and §14.2 retain their authoring-time wording, covered by the header status note.
- 2026-10-19: `CONFLICT-002` (what "Stage 5" denotes) is untouched and has no effect on this decision. This record names deliverable paths rather than a stage number so the change does not depend on that conflict's resolution.
- 2026-10-19: The known Admin authoring/audit divergence (`CONFLICT-001` resolved toward Admin audit read; API §15 `CF-01`/`CF-12` still expose no surface) is not touched. No Admin route, audit route, audit write, or authoring UI is introduced.
- 2026-10-19: Three implementation gaps are carried, with no new `TBD` created: (1) no credential-verifier storage is modelled, so API-001 cannot be implemented end to end before a security/data-model decision; (2) no session table exists, so the opaque session cookie implies an in-process store and a single worker until a session decision is recorded; (3) no idempotency-key store exists, while API §9 requires persisted key plus fingerprint for API-002/005/006/013. The Tech Lead must register these if the owner wants formal tracking (RULE-014).
- 2026-10-19: `docs/06_development/` is not modified. It remains reserved for verified commands (`TBD-INFRA-004/007`) and no command is recorded. `docs/13_changes/README.md` is not refreshed, following the CHG-018 precedent that its asset list stops at CHG-014.
- 2026-10-19: A pre-existing stale line in `docs/02_architecture/architecture.md` §15 said the store was not selected; it now states that PostgreSQL is recorded and the physical design is not authored. This is a status correction, not a new store decision.
- 2026-10-19: Follow-up `CHG-020` registers the three carried gaps as `TBD-INFRA-012`, `TBD-INFRA-013`, and `TBD-INFRA-014`, and models the two support stores in `data_model_spec.md` §2.5. The gap list above is superseded only as to registration; none of the three is resolved.
