# CHG-018 — Complete the root AGENTS.md operating contract

Status: Draft
Complexity: Complex
Refs: TBD-BIZ-012, TBD-BIZ-014, TBD-INFRA-001, TBD-INFRA-002, TBD-INFRA-003, TBD-INFRA-004, TBD-INFRA-005, TBD-INFRA-006, TBD-INFRA-007, TBD-INFRA-009; CONFLICT: none created (known divergence carried, not resolved)
Owner: Tech Lead

## Plan

- **Why:** the root `AGENTS.md` was written at Stage 2 and still described PRD v0.1, a five-document repository, and a Stage 2-only state. Architecture, design, data, and API artifacts now exist as Draft, and a fresh session cannot start from the old file without misreading the current state.
- **Approach:** replace the file in place with a stable, high-frequency operating contract. Keep business detail by path; add no business rule that is absent from the source documents. Add project goal, repository map, stack/open-item status, frontend/backend/API constraints, data and security red lines, visual authority, testing/command status, checkable prohibitions, and RULE-010/RULE-014 conflict handling.
- **Affected paths:** `AGENTS.md` (modified); this record (new). No other file is modified.
- **Risks:**
  1. The PRD, architecture, design, data, and API documents are all Draft and disagree on the Admin authoring/audit surface. Mitigation: record the divergence in `AGENTS.md` §1 without choosing a side; do not implement either surface.
  2. The repository has many open TBDs. Mitigation: reference `open_items.md` only and mark every unverified command TBD; invent no value.
  3. The predecessor file was under 300 lines and the new contract must remain scannable. Mitigation: compact tables and path-first references; verify the line count.
  4. `README.md` still says PRD v0.1. Mitigation: `AGENTS.md` names the PRD v0.2 and states that README is navigation, not state authority. README is not modified in this change.
- **Verification plan:** line count, Markdown links, fenced-block balance, TBD/CONFLICT registry resolution, status line, prohibited tool-file scan, root-layout scan, `git diff --check`, and write-set inspection. No build, test, install, browser, or deployment command is run because no stack or environment baseline exists.

## Task Brief

- **Scope:** upgrade the existing root `AGENTS.md` from a Stage 2-era Draft to a complete, tool-agnostic operating contract. Do not create `CLAUDE.md` or any other tool-specific instruction file (RULE-016).
- **Inputs (all Draft; none Frozen):** `docs/01_product/prd.md`; `docs/02_architecture/architecture.md` and `docs/02_architecture/05_enterprise_internal_baseline.md`; `docs/05_api/api_interface_spec.md`; `docs/04_data/data_model_spec.md`; `docs/08_security/README.md`; `docs/03_design/design_tokens.json`, `component_spec.json`, `highfi_page_map.md`, and `highfi/`; `docs/00_setup/project_rules.md` and `open_items.md`; `docs/03_design/prototype/` as interaction reference only.
- **Outputs:** `AGENTS.md` (complete rewrite, ≤300 lines) and this change record.
- **Acceptance criteria:**
  1. The file states the project goal, repository map, current state, and the boundary that no implementation is authorized.
  2. Stack and architecture status cite `open_items.md`; no stack, version, command, or environment is invented.
  3. Frontend/backend responsibilities and the API contract include the 15-operation surface, session/auth rules, default deny, own-only non-disclosure, idempotency, and the full error-code table.
  4. Data constraints and sensitive-data red lines cover classification, retention, audit, logs, projections, AI-tool use, and external egress.
  5. `design_tokens.json`, `component_spec.json`, and `highfi/` are the visual authority; `prototype/` is interaction reference only.
  6. Testing requirements cite RULE-006/RULE-011; every project install/run/build/test/deploy command is marked TBD.
  7. Prohibitions are checkable and include frozen assets, unaudited dependencies, secrets, and skipped verification.
  8. Conflict handling cites RULE-010/RULE-014 and does not resolve a conflict.
  9. The file is at most 300 lines and contains no tool-specific instruction file.
- **Ownership:** `AGENTS.md` and `docs/13_changes/**` are Tech Lead-owned. No Docs, Frontend, Backend, or Verifier path is written. The independent Verifier review required by RULE-005 is not performed and is not claimed.

## Verification

Executed on 2026-10-19 (Asia/Shanghai) in the repository root. Documentation-only change; no install, build, server, browser, database, or deployment was run.

| # | Check | Command (abridged) | Result |
|---|---|---|---|
| 1 | Line limit | `wc -l AGENTS.md` | 216 lines; limit 300 |
| 2 | Status line | `grep -n '^Status:' AGENTS.md` | `1:Status: Draft` |
| 3 | Markdown links | Python link walk over `AGENTS.md` | 42 links; 0 missing targets |
| 4 | Fenced blocks | Python count of triple backticks | 2 fences; balanced |
| 5 | TBD/CONFLICT registry | Python extraction of every `TBD-*`/`CONFLICT-*` reference and lookup in `open_items.md` | 12 IDs; 0 missing |
| 6 | Prohibited tool files | `git ls-files \| grep -E '(^\|/)(CLAUDE\\.md\|\\.cursorrules\|\\.cursor/\|copilot-instructions\\.md\|\\.clinerules\|\\.windsurfrules)'` | No output; 0 matches |
| 7 | Root layout | `ls -A` filtered against the RULE-002 allowlist | Only `frontend/`, `backend/`, `docs/`, `README.md`, `AGENTS.md`, `.gitignore`, `.git` |
| 8 | Whitespace / patch sanity | `git diff --check` | Exit 0; no whitespace error |
| 9 | Write set | `git status --short` | `M AGENTS.md`; this record new |
| 10 | Frozen assets | `grep -rl '^Status: Frozen' docs` | No output; no Frozen asset was touched |
| 11 | No new business rule | Manual comparison against PRD, business model, architecture, data model, and API contract | No capability, role, page, state, field, endpoint, metric, or permission was added; the known Admin/audit divergence is recorded, not resolved |

Author verification: **PASS**. No independent Verifier review exists for this change; the Verifier role is dormant. The record remains `Draft`.

## Dependency audit

None. No package, manifest, lockfile, CDN asset, font, image, network request, or tool dependency was added. No install or build command was executed.

## Decision and conflict log

- 2026-10-19: The root `AGENTS.md` is rewritten in place. It remains `Status: Draft`; no approval, freeze, or Gate 1 acceptance is claimed.
- 2026-10-19: All business detail is referenced by path. The contract does not add a capability, role, page, state, field, endpoint, error code, metric, or acceptance criterion.
- 2026-10-19: The known Admin authoring/audit divergence between `05_enterprise_internal_baseline.md`/business model Appendix B and `interaction_design.md`/PRD/API is recorded in `AGENTS.md` §1 and is not resolved. No new `CONFLICT` ID is created; the Tech Lead must register one if a formal registry entry is required (RULE-014).
- 2026-10-19: Every project install/run/build/test/lint/typecheck/deploy command is marked TBD; no command or environment claim is made. The Stage 1 baseline remains missing (`TBD-INFRA-004`).
- 2026-10-19: `README.md` is not modified. Its Stage 2/PRD v0.1 text is stale; `AGENTS.md` states that README is navigation, not state authority. Updating README is a separate change.
- 2026-10-19: `docs/13_changes/README.md` is not modified. Its authoritative-asset list already stops at `CHG-014`; this record follows the CHG-015 to CHG-017 precedent and does not partially refresh that index.
- 2026-10-19: No tool-specific instruction file is created. `AGENTS.md` remains the sole authority (RULE-016).
