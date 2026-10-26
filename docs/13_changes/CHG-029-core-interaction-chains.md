# CHG-029 — Core interaction chains document (end-to-end flow supplement)

Status: Draft
Complexity: Simple
Refs: `TBD-INFRA-008/009/012/013/014` (referenced); `TBD-BIZ-007/008` (Resolved, referenced); FLOW-001/002/003; API-001–API-015; MOD-01–MOD-08; ADR-001/002 (referenced, unchanged)
Owner: Tech Lead (authored under explicit user direction, 2026-10-20)
Reviewer: pending — user-directed documentation under `RULE-021`; the independent review gate is advisory for it

## Plan

- **Why this change:** the owner noted that the business-modeling documents exist but no document walks the core interaction chains end to end. The material existed on two separate levels — UX steps in `interaction_design.md` §4 and principle-level sequences in `02_api_workflow_and_review.md` §7/§8 — but nothing joined them into one chain view per flow.
- **Approach:** author `docs/02_architecture/09_core_interaction_chains.md` as a by-reference supplement: for each of FLOW-001/002/003, a chain table joining the prototype-rendered trigger, the frontend nine-state rendering, the exact `API` boundary crossing (with `Idempotency-Key` marking), the backend module chain in execution order, and the wire outcome → next UI state; plus a cross-chain invariants section and a traceability table. The prototype is cited as an interaction reference only, never as authority.
- **Affected paths:** `docs/02_architecture/09_core_interaction_chains.md` (new); `docs/02_architecture/README.md` (asset list and document map); this record; the `docs/13_changes/README.md` asset list.
- **Risks and mitigations:**
  1. **The chain tables could drift from the contract or the UX steps.** Mitigation: every cell cites an authority; the §1 authority clause states the cited authority wins (RULE-014); the verification pass checks every cited identifier against its authority document.
  2. **The prototype could be misread as a behavioral authority.** Mitigation: the header and the traceability column label it an interaction reference only (AGENTS §7); synthetic run references are quoted as fixture names, not behavior authority.
  3. **Resolved decision parameters could be duplicated into a second authority.** Mitigation: parameters (PBKDF2 210k iterations, session cookie parameters, rate limits, executor semantics) are cited with their registry entries and CHG-024/025/026 as the source.

## Task Brief

- **Scope:** one new supplement document plus folder README registration. No new identifier (`PG`/`API`/`MOD`/`ERR`/`ENT`/`STATE`/`FLOW`/`BR`/`NFR`); no code, DDL, migration, or command; no registry change.
- **Inputs:** `interaction_design.md` §4–§6; `api_interface_spec.md` §5.1/§7 (API-001/005/006/013 response and idempotency semantics)/§8/§9; `02_api_workflow_and_review.md` §7/§8/§9; `architecture.md` §6/§7.3/§8.4; `06/07/08` supplements; `open_items.md`; prototype README; CHG-024/025/026.
- **Outputs:** the affected paths above.
- **Acceptance criteria:**
  1. Three chain tables cover FLOW-001/002/003 with trigger, frontend state, call, backend chain, and outcome columns.
  2. Every cited identifier resolves to its authority; zero new identifiers.
  3. The prototype is labeled interaction-reference-only wherever it is cited.
  4. Links resolve; whitespace clean; no Frozen asset touched (none exists).

## Verification

Executed on 2026-10-20 (Asia/Shanghai) from the repository root.

| # | Check | Command or method | Exit | Observed result |
|---|---|---|---|---|
| 1 | Registry ID existence | every `TBD-*`/`CONFLICT-*` in the new file looked up in `open_items.md` | 0 | all exist |
| 2 | Domain ID existence | `API-*` against the contract; `PG-*` against the page map; `MOD-*`/`ERR-*`/`ADR-*` against the architecture set; `FLOW-*` against the interaction design; `BR-*`/`NFR-*` against the PRD | 0 | all exist; zero new identifiers |
| 3 | Boundary calls match the contract catalog | method+path extraction vs contract §5.1 | 0 | identical set |
| 4 | Relative links | link walk over changed `.md` files | 0 | 0 missing |
| 5 | Whitespace / frozen / commands | `git diff --check`; frozen scan; command-pattern scan | 0/1/0 | clean; no Frozen asset; no command invocation |

## Dependency audit

None. No dependency is added, upgraded, imported, installed, or locked.

## Decision and conflict log

- 2026-10-20: The gap was recorded as a missing **consolidated view**, not missing content: UX steps (IXD §4) and principle sequences (02 §7/§8) already existed; the new document joins them per flow with the boundary crossing made explicit. It does not replace or amend either authority.
- 2026-10-20: Chain semantics are cited, not restated as new rules: `API-005` `201` + replay-same-position; `API-006` `202` pending / `200` + `assistant_position`, replay never a second model call; `API-013` `201` + replay-same-run_reference; `50302` reuse-the-key; all from the contract §7/§9.
- 2026-10-20: The prototype's synthetic fixtures (`weekly-digest`, `ticket-triage`, `health-check`; `RUN-7K2M/3P9Q/5C1R/9T6B`) are cited as fixture names for review convenience only.
- 2026-10-20: `CONFLICT-002` remains Open and untouched; the file is numbered by folder position, not by a stage claim.
