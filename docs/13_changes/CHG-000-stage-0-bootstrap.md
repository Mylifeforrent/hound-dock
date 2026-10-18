# CHG-000 — Stage 0 repository governance bootstrap

Status: Draft
Complexity: Complex
Refs: TBD-BIZ-001, TBD-BIZ-002, TBD-BIZ-003, TBD-INFRA-001, TBD-INFRA-002, TBD-INFRA-003, TBD-INFRA-004, TBD-INFRA-005, TBD-INFRA-006, TBD-INFRA-007, TBD-INFRA-008; CONFLICT: none
Owner: Tech Lead

## Plan

- Audit precedence sources: P1 missing, P2 missing, P3 empty, P4 current task contract.
- Create the root governance files, the 14-directory docs layout, the numbered rule set, and the single open-item registry.
- Record every unconfirmed business or engineering decision as a TBD; record no technology recommendation as a decision.
- Create no business code, scaffold, dependency manifest, lockfile, tool configuration, `.env.example`, or start command.
- Verify directory layering, Markdown links, status lines, ID references, and absence of prohibited files; then commit once on `main`.
- Acceptance: all six Stage close-out checks pass and the evidence is recorded below.
- Risks: missing P2 baseline (TBD-INFRA-004); unconfirmed stack (TBD-INFRA-001/002/003); unconfirmed product intent (TBD-BIZ-001/002/003). None is silently resolved.

## Task Brief

- **Scope:** Repository initialization only — root README, AGENTS.md, `.gitignore`, `frontend/README.md`, `backend/README.md`, `docs/00_setup` through `docs/13_changes`.
- **Inputs:** P1 (missing), P2 (missing), P3 (empty repository), P4 (task contract), user plan approval of 2026-10-18.
- **Outputs:** The files listed in `git show --stat` for this change; local Git history with one bootstrap commit.
- **Acceptance criteria:** Directory layering matches the contract; every docs folder has a README with all five required fields; AGENTS.md is the sole rules authority and is at most 300 lines; every rule has an ID, an explicit action verb, verification, and exception mechanism; README, AGENTS, and rules do not contradict; no prohibited artifact exists; no P3 content was overwritten.
- **Ownership:** Tech Lead owns the root governance files, `docs/00_setup/**`, and `docs/13_changes/**`. `frontend/README.md` and `backend/README.md` are created under the Stage 0 bootstrap exception in RULE-019; no other role writes during this change.

## Verification

Executed 2026-10-18 (Asia/Shanghai) in the repository root. All checks are read-only; the bootstrap commit is created only after they pass.

| # | Check | Command (abridged) | Result |
|---|---|---|---|
| 1 | Inventory | `find . -path ./.git -prune -o -type f -print \| wc -l` | 22 files; 14 docs directories, each with `README.md` |
| 2 | AGENTS length | `wc -l < AGENTS.md` | 106 lines (limit 300) |
| 3 | Status lines | `find docs -name '*.md' -exec grep -EL '^Status: (Draft\|Reviewed\|Frozen)$' {} +` | No output — every doc has a valid status |
| 4 | Relative links | Markdown link check across all 21 Markdown files | 45 links checked, 0 broken |
| 5 | Rule completeness | `grep -c '^## RULE-'` plus per-rule field scan | 20 rules; every rule has Rule, Scope, Verification, and Exception approval |
| 6 | ID registry | Loop over bracketed `TBD`/`CONFLICT` references | No missing IDs; 11 TBD rows (3 BIZ, 8 INFRA; 1 resolved), 0 CONFLICT |
| 7 | Prohibited artifacts | `git ls-files` scans for manifests, code, `.env*`, and tool instruction files | No matches |
| 8 | Root layout | `ls -A` filtered against allowed entries | Only `frontend/`, `backend/`, `docs/`, `README.md`, `AGENTS.md`, `.gitignore`, `.git` |
| 9 | Secret ignore | `git check-ignore -v .env` | `.gitignore:2:.env` matches; exit 0 |
| 10 | Naming | RULE-001 docs directory, docs file, and branch checks | No violations |
| 11 | Wording | `grep -rniE` scan for the weak terms prohibited by the task contract | No matches |

Reviewer: Tech Lead self-review. Independent second pass is exempt for `CHG-000` under RULE-005; the user's Stage 0 sign-off is pending, after which this record may be promoted to `Reviewed`.

## Dependency audit

None — no dependency, manifest, or lockfile was introduced.

## Decision and conflict log

- 2026-10-18: User approved the Stage 0 plan, including `git init` plus one initial commit.
- 2026-10-18: User confirmed the 15-stage docs taxonomy and stage map; TBD-INFRA-008 marked Resolved.
- 2026-10-18: User confirmed that P1 remains unconfirmed and that gaps are recorded as TBDs rather than guessed.
- No `CONFLICT-nnn` was found: the repository contained no prior content.
