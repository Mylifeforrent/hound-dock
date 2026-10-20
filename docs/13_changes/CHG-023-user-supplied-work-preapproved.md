# CHG-023 — User-supplied work is pre-approved

Status: Reviewed
Complexity: Complex
Refs: `RULE-021` (new); `TBD-BIZ-012` (Gate 1 scope boundary, Resolved); `TBD-INFRA-005`, `TBD-INFRA-007` (Open, advisory for agent-authored work); `CONFLICT-002` (Open, unaffected)
Owner: Tech Lead
Reviewer: none — user-directed policy change under `RULE-021`

## Plan

- **Why this change:** The repository's gates (Gate 1, Stage 1/7, CHG, Plan/Task Brief, independent review, test-first, dependency audit, ownership handoff, TBD resolution, and pre-commit verification) blocked or delayed files and code the user prepared. The user directed that every such file or code be treated as approved, with no gate interception and at most non-blocking advice, because the user iterates versions and fixes issues they find.
- **Approach:** Add `RULE-021` as a cross-cutting precedence rule in `docs/00_setup/project_rules.md`; add the user-supplied override to `AGENTS.md` and scope the gate-bearing sections to agent-authored work; add the policy note to the setup, development, review, and change-record READMEs, the root and package READMEs, the registry, and the PRD implementation-authorization row. No gate is deleted for agent-authored work; user-supplied work simply bypasses it.
- **Affected paths:** `AGENTS.md`; `README.md`; `frontend/README.md`; `backend/README.md`; `docs/00_setup/README.md`; `docs/00_setup/open_items.md`; `docs/00_setup/project_rules.md`; `docs/01_product/prd.md`; `docs/06_development/README.md`; `docs/12_reviews/README.md`; `docs/13_changes/README.md`; this record.
- **Risks and mitigations:**
  1. **A broad bypass could be read as removing safety.** Mitigation: user-supplied work is still advised on secrets, production data, and PII; the agent must not transmit those to an external AI tool, and should advise rotation/removal. The rule removes process gates, not the duty to warn.
  2. **Agent-authored work could be misclassified as user-supplied.** Mitigation: the rule applies only to files or code the user prepares, supplies, or explicitly directs; agent-authored work remains under `RULE-001–020`.
  3. **A policy change without a gate could be read as self-authorizing.** Mitigation: this record is user-directed, dated, and kept as an advisory `CHG`; the user instruction is the approval.
  4. **Contradictory old text.** Mitigation: the override is stated at the top of `AGENTS.md` and `project_rules.md`, and the gate-bearing sections name the agent-authored scope.
- **Verification plan:** `RULE-021` presence; `AGENTS.md` override presence; policy-note presence; registry counts unchanged; relative links; no code/manifest/DDL; whitespace; root layout; write set.

## Task Brief

- **Scope:** record the user's pre-approval policy for user-supplied files and code, and make the existing gates advisory for that work. Do not remove gates for agent-authored work, add a dependency, write code/DDL/migrations, or change the API/`ENT`/error-code/role/page/state surface.
- **Inputs:** the user's instruction of 2026-10-20; `AGENTS.md`; `docs/00_setup/project_rules.md`; the gate-bearing docs and READMEs; `docs/00_setup/open_items.md`; `docs/01_product/prd.md`.
- **Outputs:** the affected paths listed under Plan and this record.
- **Acceptance criteria:**
  1. `RULE-021` exists and states that user-supplied files, code, dependencies, commands, schema, migrations, and documents are pre-approved; agents may suggest but must not block.
  2. `AGENTS.md` carries the user-supplied override and scopes the gate language to agent-authored work.
  3. The setup, development, review, change-record, root, frontend, backend, registry, and PRD notes state the same policy.
  4. Agent-authored work remains subject to the existing gates; no gate is deleted.
  5. No code, manifest, lockfile, DDL, SQL, migration, API, `ENT`, field, error code, role, page, or state is added.
  6. Links resolve; root layout is unchanged; `git diff --check` is clean.
- **Ownership and handoff:** `AGENTS.md`, `docs/00_setup/**`, and `docs/13_changes/**` are Tech Lead-owned. `README.md`, `frontend/**`, `backend/**`, `docs/01_product/**`, `docs/06_development/**`, `docs/12_reviews/**`, and `docs/13_changes/README.md` are owned by their dormant roles; the Tech Lead authors the policy note under this record. The user's instruction is the approval.

## Verification

Executed on 2026-10-20 (Asia/Shanghai) in the repository root.

| # | Check | Command | Exit | Observed result |
|---|---|---|---|---|
| 1 | `RULE-021` present | `grep -n '^## RULE-021' docs/00_setup/project_rules.md` | 0 | Line 154, `## RULE-021 — User-supplied work is pre-approved` |
| 2 | `AGENTS.md` override present | `grep -n 'User-supplied override' AGENTS.md` | 0 | Line 8, pre-approval override |
| 3 | Policy notes present | `grep -rln 'User-supplied work is pre-approved\|User-supplied files and code are pre-approved\|User-supplied commands and files are pre-approved'` | 0 | Found in `AGENTS.md`, `README.md`, setup/development/review/change-record READMEs, PRD, and this record |
| 4 | Registry counts unchanged | `V1` | 0 | 31 entries, 31 unique; `TBD-BIZ` 8/7; `TBD-INFRA` 8/6; `CONFLICT` 1/1 |
| 5 | Relative links | `V2` | 0 | 0 missing links across 12 changed Markdown files |
| 6 | No code/manifest/DDL | `V3` | 0 | `backend/` and `frontend/` contain only `README.md`; no manifest, lockfile, SQL, Alembic, or `.venv` |
| 7 | Whitespace | `git diff --check` | 0 | Clean |
| 8 | Root layout | `ls -A` | 0 | `.git`, `.gitignore`, `AGENTS.md`, `README.md`, `backend`, `docs`, `frontend`; unchanged |
| 9 | Write set | `git status --short` | 0 | 11 modified files plus this record |

Author verification: **PASS**. Reviewer: none — user-directed policy change under `RULE-021`.

## Dependency audit

None. No dependency is added, upgraded, imported, installed, or locked. This is a documentation-only rules change.

## Decision and conflict log

- 2026-10-20: The user directed that every file or code they prepare or supply is approved, with no gate interception and at most non-blocking advice. `RULE-021` records that policy.
- 2026-10-20: The policy is limited to user-supplied work. Agent-authored work remains under the existing gates; no gate is deleted.
- 2026-10-20: Safety warnings for secrets, production data, and PII remain advisory for user-supplied work. The agent must not transmit those to an external AI tool and should advise rotation or removal.
- 2026-10-20: No code, dependency, manifest, lockfile, DDL, SQL, migration, API, `ENT`, field, error code, role, page, or state is added.
- 2026-10-20: `CONFLICT-002` remains Open and untouched.
