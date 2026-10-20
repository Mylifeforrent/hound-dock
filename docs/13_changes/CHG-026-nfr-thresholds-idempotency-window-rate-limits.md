# CHG-026 — NFR thresholds, idempotency window, and rate limits confirmed

Status: Draft
Complexity: Simple
Refs: `TBD-BIZ-008` (resolved by this change); `TBD-INFRA-014` (Resolved; its retention-window reference closes); `TBD-BIZ-003` (Resolved, retention numbers); `NFR-001`–`NFR-012` (targets per resolution); `CHG-024` (Stage 1 host as measurement environment)
Owner: Tech Lead (recorded on explicit user direction, 2026-10-20)
Reviewer: pending — user-directed decision under `RULE-021`; the independent review gate is advisory for it

## Plan

- **Why this change:** `TBD-BIZ-008` was the last second-tier blocker: every NFR threshold, the idempotency retention window referenced by `TBD-INFRA-014`, and the rate-limit set in `backend/app/config.py` were proposals awaiting confirmation. The product owner adopted the proposals with one correction.
- **Approach:** record the resolution in `docs/00_setup/open_items.md` (confirmed performance thresholds, measurement environment, 24-hour idempotency window, confirmed rate-limit set, best-effort treatment of capacity/availability, audit-verified accessibility targets); restate `NFR-001` as a non-streaming metric in the PRD and sync the PRD's live status locations; update the stale proposed-value comments in `backend/app/config.py` and the accessibility line in `AGENTS.md`; register this record.
- **Affected paths:** `docs/00_setup/open_items.md`; `docs/01_product/prd.md` (status note, `NFR-001` row, §9 preamble and closing, §10 row); `backend/app/config.py` (comments only); `AGENTS.md` (§7 accessibility bullet); this record; the `docs/13_changes/README.md` asset list.
- **Risks and mitigations:**
  1. **The original `NFR-001` metric ("first streamed token") is unmeasurable — streaming is not a requirement and `API-006` returns no assistant text.** Mitigation: the resolution restates the metric as submit-to-completed-turn p95 ≤ 3,000 ms; the restatement lives in the registry and the PRD row.
  2. **No threshold has been measured yet.** Mitigation: both the registry and PRD state that no benchmark or load result is verified; confirmation sets targets, not results.
  3. **`business_model.md` step-table time limits remain labeled `TBD-BIZ-008` with suggested values.** Mitigation: left as-is deliberately — they are marked "not a commitment" suggestions in a Stage 5 deliverable; the confirmed values live in the registry and PRD §9. Recorded here so the asymmetry is visible, not silent.

## Task Brief

- **Scope:** resolve `TBD-BIZ-008`; no endpoint, entity, field, permission, page, or state is added; no code behavior changes; no measurement is executed.
- **Inputs:** product-owner decisions of 2026-10-20 (this session): adopt proposals with the streaming-metric correction; 24-hour idempotency window; adopt the proposed rate-limit set.
- **Outputs:** the affected paths above.
- **Acceptance criteria:**
  1. `TBD-BIZ-008` is `Resolved` with the date, decision detail, and `CHG-026`; the registry summary reports `TBD-BIZ` 6 Open / 9 Resolved.
  2. `NFR-001` is restated non-streaming wherever the live PRD text cites it; historical self-check rows are not rewritten.
  3. `backend/app/config.py` and `AGENTS.md` carry no stale "proposed pending TBD-BIZ-008" claim.
  4. No registry ID is defined or redefined outside `open_items.md`; no Frozen asset is touched (none exists); no behavior change in `backend/`.

## Verification

Executed on 2026-10-20 (Asia/Shanghai) from the repository root.

| # | Check | Command | Exit | Observed result |
|---|---|---|---|---|
| 1 | Registry parse and counts | registry-entry scan | 0 | 31 entries, 31 unique; `TBD-BIZ` 6/9; `TBD-INFRA` 5/9; `CONFLICT` 1/1; `TBD-BIZ-008` `Resolved` |
| 2 | Relative links in changed Markdown | link walk over `git status` `.md` files | 0 | 0 missing |
| 3 | Whitespace | `git diff --check` | 0 | clean |
| 4 | Backend tests unaffected | `uv --directory backend run pytest` | 0 | 4 passed |
| 5 | Stale-claim scan | `grep -rn 'TBD-BIZ-008'` over `backend/app`, `AGENTS.md`, PRD live sections | 0 | no "Open"/"proposed pending" claims remain in live locations |

## Dependency audit

None. No dependency is added, upgraded, or removed.

## Decision and conflict log

- 2026-10-20: `TBD-BIZ-008` resolved by adopting the proposals with one correction. Confirmed performance thresholds (p95, Stage 1 baseline host): `NFR-001` restated as message-submit → completed assistant turn retrievable via `API-006` ≤ 3,000 ms (replacing the unmeasurable "first streamed token"); `NFR-002` ≤ 500 ms at 500 items; `NFR-003` ≤ 2,000 ms.
- 2026-10-20: Idempotency-key retention window confirmed at 24 hours, closing the window reference in `TBD-INFRA-014`; purge remains a later retention-job change.
- 2026-10-20: The rate-limit set in `backend/app/config.py` is confirmed (sign-in 20/IP/15 min, 5/name/15 min; conversation create 30/h; message append 30/min; reply 30/min; run start 10/h; reads 120/min).
- 2026-10-20: Capacity (`NFR-004`) and availability (`NFR-005`) keep their suggested baselines (50 accounts / 20 concurrent sessions / 10 concurrent runs; 99.0% monthly) as best-effort targets with no hard MVP threshold; accessibility (`NFR-011`) keeps its conformance targets as audit-verified design targets, no certification. Both treatments are part of this resolution and amendable by a later `CHG`.
- 2026-10-20: No threshold has been measured; no benchmark or load result is verified. `CONFLICT-002` remains Open and is untouched.
