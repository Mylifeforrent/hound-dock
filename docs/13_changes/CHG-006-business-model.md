# CHG-006 — Stage 5 business model

Status: Draft
Complexity: Complex
Refs: TBD-BIZ-001, TBD-BIZ-002, TBD-BIZ-003, TBD-BIZ-004, TBD-BIZ-005, TBD-BIZ-006, TBD-BIZ-007, TBD-BIZ-008, TBD-BIZ-009, TBD-BIZ-010, TBD-BIZ-011, TBD-BIZ-012, TBD-BIZ-013, TBD-BIZ-014, TBD-INFRA-003, TBD-INFRA-004, TBD-INFRA-005, TBD-INFRA-007, TBD-INFRA-009, TBD-INFRA-010, TBD-INFRA-011; CONFLICT-001, CONFLICT-002
Owner: Tech Lead (Docs Agent handoff; the Docs Agent is dormant)

## Plan

- **Inputs:** the product owner's confirmed decisions of 2026-10-18 recorded in `docs/00_setup/open_items.md` (TBD-BIZ-001, TBD-BIZ-002) and `docs/13_changes/CHG-001-stage-2-prd.md`; PRD v0.1 (`Status: Draft`); the throwaway prototype and design system under `docs/03_design/`; the Stage 5 business-architect task contract supplied by the product owner on 2026-10-18.
- **Approach:** build the business specification in two physically separate layers.
  - **Confirmed core:** only rules that resolve to the product owner's confirmed decisions (P1/SRC-001). This layer contains objectives, MVP capabilities, flows, entities, roles, state, business rules, and NFRs that can be stated without inventing policy.
  - **Unconfirmed layer:** every PRD or prototype proposal is recorded as `CAND` or `TBD-BIZ`; no Draft-PRD or prototype statement is promoted to a `BR`. The confirmed core is deliberately smaller than the PRD because the PRD has not been accepted (TBD-BIZ-012).
- **Why the document will look smaller than the PRD:** the PRD is a `Draft` P4 input. Under the Stage 5 contract, only P1, P3, and P4 entries marked `Frozen`/`Approved` may source a `BR`. Applying that rule is the point of the document, not a defect: it shows the product owner exactly which decisions are still outstanding before Gate 1.
- **Affected paths:** `docs/01_product/business_model.md` (new); `docs/00_setup/open_items.md` (append-only TBD/CONFLICT entries); `docs/01_product/README.md` (asset index); `docs/13_changes/README.md` (change index); `docs/13_changes/CHG-006-business-model.md`; `docs/12_reviews/CHG-006-review.md` and `docs/12_reviews/README.md` (independent review).
- **Risks:**
  - Promoting Draft-PRD policy (roles, audit, execution model, metrics, NFR thresholds) into business rules. Mitigation: `CAND`/`TBD` only; source-eligibility check in §10 and the self-check.
  - Hiding the missing inputs behind vague wording. Mitigation: registered TBDs with owners and closing conditions; no numeric target is invented.
  - Duplicating the open-item registry. Mitigation: new entries are appended only to `open_items.md`; §12 of the business model is explicitly a business-impact view and the registry is authoritative.
  - Cross-ownership write. Mitigation: this record states the handoff; the Tech Lead authors the registry and docs paths while the Docs Agent is dormant, following the CHG-001/CHG-005 precedent.
  - Confusing "Stage 5" with the repository stage map. Mitigation: `CONFLICT-002` records the discrepancy instead of choosing a side; status remains `Draft`.
- **Verification plan:** status lines; relative links; document-ID uniqueness and resolution against `open_items.md`; TBD/CONFLICT counts; banned-wording scan; table-pipe balance; Mermaid fence balance and node/edge reference sanity; no code, manifest, secret, or PII; no out-of-scope technical content; independent Verifier review.
- **No code:** this change creates no business code, scaffold, dependency, manifest, lockfile, command, API field, table, or page layout.

## Task Brief

- **Scope:** Stage 5 business-model specification for hound-dock: confirmed objectives, MVP boundary, flows, entities, roles and permissions, states, business rules, NFRs, traceability, challenges, TBD/CONFLICT registers, glossary, and candidate pool. It does not accept the PRD, resolve commercial or permission policy, or design data, API, UI, or architecture.
- **Inputs:** P1 confirmed decisions (SRC-001); P2 Stage 5 task contract (SRC-006, substituted because no repository acceptance file exists); P3 missing; P4 PRD v0.1 Draft (SRC-002, candidates only); P5 prototype and design system (SRC-003/SRC-004, candidates/challenges only).
- **Outputs:** `docs/01_product/business_model.md` v0.1; appended TBDs `TBD-BIZ-008`…`TBD-BIZ-014`; conflicts `CONFLICT-001`, `CONFLICT-002`; folder/index updates; independent review record.
- **Acceptance criteria:**
  1. Every `BR` resolves to SRC-001; no Draft-PRD or prototype statement is a `BR`.
  2. Every objective has a baseline, target, time window, and measurement method or a registered TBD.
  3. Every in-MVP capability has a boundary, rationale, and re-entry trigger; every out-of-MVP capability has a specific re-entry trigger.
  4. Every flow node has an actor and a permission conclusion; every failure has an explicit path and compensation.
  5. Every state transition has actor, preconditions, failure handling, and a linked BR; proposed state models are marked non-effective.
  6. Every `BR` has a source location, a positive example, and a negative example; no banned vague wording.
  7. Every NFR has a threshold, environment, method, and verification stage, or `N/A` with a rationale.
  8. The traceability matrix has no orphan or dangling reference; every in-MVP capability and every objective has at least one BR.
  9. The effective permission matrix defaults to `Deny`; every `Conditional` cites a BR.
  10. Every challenge has a disposition; every TBD/CONFLICT has an owner, closing condition, and blocked scope.
  11. No out-of-scope content: no table/column, API field, page layout, architecture, or commercial policy decision.
  12. No open decision is recorded as settled; the document is `Draft` while CONFLICT-001/002 are open.
- **Ownership:** Tech Lead authors `docs/00_setup/**` and `docs/13_changes/**`; the Docs Agent is dormant, so the Tech Lead also authors `docs/01_product/**` under this recorded handoff (same pattern as CHG-001 and CHG-005). The Verifier owns `docs/12_reviews/**` and must not edit the deliverable. The product owner owns every decision listed in §11 and §12; this change grants no permission and sets no commercial policy.

## Verification

<!-- VERIFICATION-PENDING -->

## Dependency audit

None — no dependency, manifest, lockfile, package, or external font is introduced.

## Decision and conflict log

- 2026-10-18: Product owner requested a Stage 5 business model based on PRD v0.1 and the prototype, using the supplied business-architect role, input, output, and self-check contract.
- 2026-10-18: PRD v0.1 remains `Draft`; this change does not accept it. Gate 1 acceptance is registered as `TBD-BIZ-012`.
- 2026-10-18: Confirmed MVP boundary is taken only from TBD-BIZ-001/002 and the CHG-001 decision log: four capabilities (chat, skill registry, MCP registry, task definitions) plus manual runs, self-hosted deployment, and local accounts.
- 2026-10-18: Draft-PRD proposals were placed in Appendix A as `CAND` and cross-referenced to the TBD that must close before promotion; none was made a `BR`.
- 2026-10-18: New TBDs 008–014 and CONFLICT-001/002 were appended to `docs/00_setup/open_items.md`; the business model's §12 mirrors them for review and does not redefine them.
- 2026-10-18: `CONFLICT-001` records the Auditor-role contradiction inside PRD §6/§13; `CONFLICT-002` records the "Stage 5" discrepancy between the repository stage map (`docs/04_data/`) and the Stage 5 task contract (`docs/01_product/business_model.md`). Neither side was chosen.
- 2026-10-18: No compliance conclusion was issued; P3 is missing and `TBD-BIZ-014` records the gap.
- 2026-10-18: The prototype and design system were used only for `CAND` and challenge evidence; the prototype's `Admin-only publishing`, `Blocked in v1`, and budget-meter claims are not authoritative.
- 2026-10-18: The root `README.md` was not edited. Its "Current stage: Stage 2" and "MVP scope: Chat with search" lines are stale relative to this business model; updating them would require choosing a side in CONFLICT-002 and pre-empting TBD-BIZ-011. The drift is recorded in CHL-005 and §3's scope-boundary note.
