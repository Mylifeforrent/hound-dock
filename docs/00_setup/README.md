# docs/00_setup

Status: Draft
Originating stage: Stage 0 — Repository Initialization; Stage 1 — Environment Baseline
Authoritative assets:
- `docs/00_setup/README.md` — this folder contract and the stage map.
- `docs/00_setup/project_rules.md` — numbered engineering rules.
- `docs/00_setup/open_items.md` — the single registry for TBD and CONFLICT entries.
- `docs/00_setup/environment_baseline.md` — Stage 1 baseline, recorded 2026-10-20 by `CHG-022`; it records read-only host/tool observations and does not authorize installs or commands. `TBD-INFRA-004` is Resolved.
Allowed status: Draft / Reviewed / Frozen. `Frozen` requires explicit user approval recorded in the Frozen assets section below. `open_items.md` is a living registry and MUST remain `Draft`.
Update entry point: Tech Lead through a change record in `docs/13_changes/`; decisions are entered only in `open_items.md`.

## Purpose

Owns repository governance: directory contract, numbered engineering rules, the open-decision registry, and the verified environment baseline. It does not own product, architecture, design, data, API, or code content.

**User-supplied work is pre-approved** under `RULE-021`; the stage and gate descriptions below are advisory for it. The agent may suggest, not block.

## Stage map

| Stage | Name | Docs home |
|---|---|---|
| 0 | Repository Initialization | `docs/00_setup/` |
| 1 | Environment Baseline | `docs/00_setup/` |
| 2 | Product Definition | `docs/01_product/` |
| 3 | Architecture | `docs/02_architecture/` |
| 4 | Design | `docs/03_design/` |
| 5 | Data Design | `docs/04_data/` |
| 6 | API Design | `docs/05_api/` |
| 7 | Development Setup | `docs/06_development/` |
| 8 | Testing | `docs/07_testing/` |
| 9 | Security | `docs/08_security/` |
| 10 | Deployment | `docs/09_deployment/` |
| 11 | Operations | `docs/10_operations/` |
| 12 | Quality | `docs/11_quality/` |
| 13 | Review | `docs/12_reviews/` |
| 14 | Change Management | `docs/13_changes/` |

The taxonomy and stage map were confirmed by the user during Stage 0 planning (see TBD-INFRA-008 in `open_items.md`).

## Frozen assets

None.

## Update entry point

Tech Lead only. A change to this folder requires a `CHG` record. A new open decision requires an appended entry in `open_items.md`; it MUST NOT be recorded in any other file.
