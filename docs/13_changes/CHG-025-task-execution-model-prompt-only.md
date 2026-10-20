# CHG-025 — Task execution model resolved to prompt-only linear skill steps

Status: Draft
Complexity: Simple
Refs: `TBD-BIZ-007` (resolved by this change); `TBD-INFRA-009` (Resolved, model port); `TBD-BIZ-005` (Open, first tasks unaffected in scope); ADR-002, ADR-003, ADR-004 (unchanged, now fully consistent)
Owner: Tech Lead (recorded on explicit user direction, 2026-10-20)
Reviewer: pending — user-directed decision under `RULE-021`; the independent review gate is advisory for it

## Plan

- **Why this change:** `TBD-BIZ-007` left the v1 execution model open; the backend run executor cannot pass from synthetic stub to real semantics without it. The product owner adopted option (a) after a side-by-side comparison.
- **Approach:** record the resolution in `docs/00_setup/open_items.md`; annotate the PRD status note and its §10 open-decisions row so the superseded option-(b) proposal is visible without rewriting historical self-check rows; align the one stale comment in `backend/app/config.py`; register this record.
- **Affected paths:** `docs/00_setup/open_items.md`; `docs/01_product/prd.md` (two live-document locations); `backend/app/config.py` (comment only); this record; the `docs/13_changes/README.md` asset list.
- **Risks and mitigations:**
  1. **The PRD proposed option (b); choosing (a) amends a proposal, not a conflict.** Mitigation: the resolution is recorded as superseding the proposal, with the registry entry as the sole authority; historical PRD self-check rows are not rewritten.
  2. **`backend/app/` is concurrently modified by another session.** Mitigation: only the single stale `TBD-BIZ-007` comment line in `config.py` is touched; no behavior is changed.
  3. **Product expectation:** ticket-creation-style tasks produce generated draft text only in v1. Mitigation: stated explicitly in the resolution source; reopening the entry is the path to real integrations post-MVP.

## Task Brief

- **Scope:** resolve `TBD-BIZ-007` to candidate (a); no endpoint, entity, field, permission, page, or state is added; no code behavior changes.
- **Inputs:** the product-owner decision of 2026-10-20 (this session); `docs/01_product/prd.md` §4/§10/§19; ADR-002/003/004; `backend/app/config.py`.
- **Outputs:** the affected paths above.
- **Acceptance criteria:**
  1. `TBD-BIZ-007` is `Resolved` with the date, decision, and `CHG-025`; the registry summary reports `TBD-BIZ` 7 Open / 8 Resolved.
  2. The PRD status note and §10 row reference the resolution without deleting the superseded proposal's history.
  3. `backend/app/config.py` carries no stale "execution model is Open" claim.
  4. No registry ID is defined or redefined outside `open_items.md`; no Frozen asset is touched (none exists).

## Verification

Executed on 2026-10-20 (Asia/Shanghai) from the repository root.

| # | Check | Command | Exit | Observed result |
|---|---|---|---|---|
| 1 | Registry parse and counts | registry-entry scan | 0 | 31 entries, 31 unique; `TBD-BIZ` 7/8; `TBD-INFRA` 5/9; `CONFLICT` 1/1; `TBD-BIZ-007` `Resolved` |
| 2 | Relative links in changed Markdown | link walk over `git status` `.md` files | 0 | 0 missing |
| 3 | Whitespace | `git diff --check` | 0 | clean |
| 4 | Backend tests unaffected | `uv --directory backend run pytest` | 0 | 4 passed |

## Dependency audit

None. No dependency is added, upgraded, or removed.

## Decision and conflict log

- 2026-10-20: `TBD-BIZ-007` resolved to candidate (a): v1 skills are prompt-only; a task run executes linear steps, each invoking one skill (prompt + one internal-gateway model call) through the model port; no MCP/tool invocation, no code execution, no branching or loops, no retry. ADR-003/ADR-004 (MCP metadata-only) and ADR-002 (immutable terminal states, new-run-as-compensation) are unchanged and now fully consistent with the confirmed execution semantics.
- 2026-10-20: The PRD v0.2 option-(b) proposal ("prompt skills plus MCP tool steps") is superseded, not deleted; the §10 row and status note record the supersession.
- 2026-10-20: Real external-system writes (e.g. ticket creation) are post-MVP and require reopening this entry; v1 runs produce generated draft text for such steps.
- 2026-10-20: `CONFLICT-002` remains Open and is untouched.
