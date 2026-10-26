# CHG-028 — Architecture supplements: frontend architecture, backend technical design, boundary doc

Status: Draft
Complexity: Complex
Refs: `TBD-INFRA-001/002/003/005/007/009/012/013/014` (Resolved or Open, referenced as-is); `TBD-BIZ-004/007/008/013` (referenced); `TBD-BIZ-006/010/014` (Open, referenced in non-goals); `CONFLICT-002` (Open, untouched)
Owner: Tech Lead (authored under explicit user direction, 2026-10-20)
Reviewer: pending — user-directed documentation under `RULE-021`; the independent review gate is advisory for it

## Plan

- **Why this change:** the owner asked whether the overall architecture, frontend design + stack, backend design + stack, and a frontend/backend boundary document are ready, and directed that missing pieces be prepared. The survey found the integrated architecture (Stage 3), the UX/visual design set (Stage 4), and both stack resolutions (CHG-019) already in place. Three consolidation documents were missing: a frontend technical architecture, a backend technical design reflecting the newly resolved `TBD-INFRA-012/013/014` and `TBD-BIZ-007/008` decisions, and a single frontend/backend boundary document.
- **Approach:** author the three supplements in `docs/02_architecture/` as by-reference consolidations — every `PG`, `API`, `MOD`, `ERR`, `BR`, `NFR`, `TBD`, and ADR identifier is cited from its existing authority; no new identifier of any kind is created; no code, DDL, migration, command, or schema is added; resolved decision parameters are cited with their registry entries as the authority.
- **Affected paths:** `docs/02_architecture/06_frontend_architecture.md` (new); `docs/02_architecture/07_backend_technical_design.md` (new); `docs/02_architecture/08_frontend_backend_boundary.md` (new); `docs/02_architecture/README.md` (asset list and document map); this record; the `docs/13_changes/README.md` asset list.
- **Risks and mitigations:**
  1. **Consolidation could drift from its authorities.** Mitigation: each supplement's header names its authority chain, and §1 of each states that the cited authority wins on any apparent difference (RULE-014 discipline).
  2. **The boundary doc could look like a second contract.** Mitigation: it restates the endpoint catalog verbatim from the contract's §5 catalog and marks the contract as the sole authority; it adds only cross-boundary rules already present in AGENTS §5, the contract §8/§12, and architecture §8.4.
  3. **The backend supplement could be read as implementation authorization.** Mitigation: it states explicitly that physical schema, migrations, and any code remain gated; `backend/` contains no application code after CHG-027.
- **Verification plan:** identifier existence check (every cited `TBD`/`CONFLICT` against the registry; `API` against the contract; `PG` against the page map; `MOD`/`ERR`/`ADR` against the architecture set; `NFR`/`BR` against the PRD/business model); relative-link walk; frozen-asset scan; whitespace; write-set inspection.

## Task Brief

- **Scope:** author the three supplements and update the folder README. Do not create an identifier, endpoint, page, field, permission, error code, entity, or state; do not author code, DDL, migration, or a project command; do not resolve or redefine any registry entry.
- **Inputs:** `docs/02_architecture/architecture.md` (+ `02_api_workflow_and_review.md`, `05_enterprise_internal_baseline.md`, ADR-001..005); `docs/05_api/api_interface_spec.md` §5/§8/§12; `docs/03_design/highfi_page_map.md`, `interaction_design.md`, `design_tokens.json`, `component_spec.json`; `docs/04_data/data_model_spec.md`; `docs/01_product/prd.md`, `business_model.md`; root `AGENTS.md` §5–§7; `docs/00_setup/open_items.md`; `docs/06_development/README.md`; CHG-019/024/025/026/027.
- **Outputs:** the affected paths above.
- **Acceptance criteria:**
  1. Every cited identifier resolves to its authority; zero new identifiers are introduced.
  2. The three supplements carry `Status: Draft`, an authority chain, and the CHG-028 reference.
  3. The folder README's asset list and document map include the three files.
  4. No Frozen asset is touched (none exists); root layout unchanged; whitespace clean.
- **Ownership:** `docs/02_architecture/**` is Docs Agent-owned (dormant); the Tech Lead authors under the user's explicit direction, exempt from the handoff gate by `RULE-021`.

## Verification

Executed on 2026-10-20 (Asia/Shanghai) from the repository root.

| # | Check | Command or method | Exit | Observed result |
|---|---|---|---|---|
| 1 | Registry ID existence | every `TBD-*`/`CONFLICT-*` cited in the three supplements looked up in `open_items.md` | 0 | all cited IDs exist; none defined or redefined outside the registry |
| 2 | `API`/`PG`/`MOD`/`ERR`/`ADR`/`NFR`/`BR` existence | extraction against the contract catalog, page map, architecture §6/§8, ADR list, PRD §9/business model | 0 | all cited IDs exist in their authority; no new `API`/`PG`/`MOD`/`ENT`/`STATE`/error code |
| 3 | Endpoint catalog fidelity | the boundary doc's §2 table diffed against contract §5.1 | 0 | method/path pairs identical; 15 rows |
| 4 | Relative links | link walk over changed `.md` files | 0 | 0 missing |
| 5 | Frozen assets | `grep -rl '^Status: Frozen' docs` | 1 | none exists or touched |
| 6 | Whitespace | `git diff --check` | 0 | clean |
| 7 | No code/DDL/command | `find frontend backend -name '*.py' -o -name '*.ts'` and command-pattern scan over the new files | 0 | no application file; no install/run/build command stated |

## Dependency audit

None. No dependency is added, upgraded, imported, installed, or locked. Component names (React, Vite, Vitest, React Router, MSW, SQLAlchemy, psycopg, Alembic, uvicorn, FastAPI) are cited from `CHG-019`/`CHG-024` decisions, not installations.

## Decision and conflict log

- 2026-10-20: Survey result recorded — the four asked-for items were already largely prepared: (1) overall architecture: `architecture.md` + five supporting documents + ADR-001..005 (Stage 3, CHG-010); (2) frontend design + stack: `docs/03_design/` set (interaction design, design system, tokens, component spec, highfi pages) plus `TBD-INFRA-001` Resolved (CHG-019); (3) backend design + stack: `architecture.md` (titled "hound-dock backend architecture") plus `TBD-INFRA-002` Resolved and the backend toolchain portion of `TBD-INFRA-005` (CHG-024); (4) boundary material: AGENTS §5, contract §8/§12, and `02_api_workflow_and_review.md` §9 — but no single boundary document, no frontend technical architecture, and no backend technical design reflecting the CHG-024/025/026 resolutions.
- 2026-10-20: The three gaps were closed with by-reference supplements (06/07/08). The supplements introduce no identifier and treat the cited authorities as supreme (RULE-014).
- 2026-10-20: `CONFLICT-002` (Stage 5 numbering) is untouched; the new files are numbered by folder position, not by stage claim.
- 2026-10-20: No registry entry is created, resolved, or redefined by this change; `TBD-INFRA-005/006/007` remain Open and are cited as such.
