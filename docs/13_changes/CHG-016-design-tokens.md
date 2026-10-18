# CHG-016 — Design token set

Status: Draft
Complexity: Complex
Refs: TBD-INFRA-001, TBD-BIZ-004
Owner: Tech Lead (Docs Agent dormant; same handoff pattern as CHG-015)

## Plan

- **Why this change:** the candidate visual values exist as prose in `design_system.md` and as CSS custom properties in the throwaway prototype, but there is no single machine-readable token contract for the high-fidelity pass. Without one, each page would re-open values that are already recorded, or would treat the Porcelain Blue reference as a settled design system.
- **Approach:** derive one JSON file with the required three layers (`primitive` -> `semantic` -> `component`). Copy colour values only from the light column of `design_system.md` §3.1 and the matching `:root` primitives. Carry typography, spacing, radius, shadow, and the 1440/1280/1080/960 measures from the recorded candidates. Restrict the component layer to C-01 to C-17. Mark every `frontend` field `[TBD-FE]` because `TBD-INFRA-001` is Open. Exclude the dark column, sub-960 layouts, reserved controls, motion, and ad-hoc prototype literals.
- **Affected paths:** `docs/03_design/design_tokens.json` (new); `docs/13_changes/CHG-016-design-tokens.md` (new). No existing file is modified.
- **Risks:**
  1. The reference palette is detailed enough to look settled. Mitigation: `_meta.valueBasis` and `_meta.theme` state that every colour is a candidate, not a brand value; no value is described as final.
  2. A role can map to more than one recorded value across `design_system.md` and `prototype/styles.css` (for example, some type roles use a design-system size while the prototype uses a literal). Mitigation: every token cites the exact document section or CSS selector it came from, and no new `CONFLICT` is registered or adjudicated.
  3. The component layer could grow into a speculative UI kit. Mitigation: component keys are limited to C-01 to C-17, no toolbar, search, dark-theme, or mobile component is introduced, and C-04, C-15, and C-17 compose semantic tokens without a separate entry.
  4. A frontend mapping could be implied. Mitigation: all 306 `frontend` fields are `[TBD-FE]`; no library or framework is named.
- **Verification plan:** executed JSON parse, required-field walk, alias resolution, key-set checks, hex allowlist, component-key subset check, forbidden-term and sub-960 scans, write-set isolation, and a Frozen-asset scan. Documentation-only change: no dependency install, build, server, or browser run is needed.

## Task Brief

- **Scope:** author the minimal token set for the effective desktop pages PG-001 to PG-012 and components C-01 to C-17, and record this change. No edit to `design_system.md`, `highfi_page_map.md`, `interaction_design.md`, `open_items.md`, the prototype, `docs/03_design/README.md`, or `docs/13_changes/README.md`.
- **Inputs (authority high to low):** `docs/00_setup/open_items.md` (registry status as-is); `docs/03_design/highfi_page_map.md` §8 C-01 to C-17, §3 to §4 state coverage, §7 four breakpoints; `docs/03_design/design_system.md` §3 light column and three-layer rules, §6 contrast; `docs/03_design/interaction_design.md` §6 nine states, §7 desktop layout.
- **Outputs:** `docs/03_design/design_tokens.json` (Status: Draft via `_meta.status`) and this record.
- **Acceptance criteria:**
  1. `color`, `typography`, `spacing`, and `radius` are present; the JSON parses; it contains no comments and no empty containers.
  2. Every value is traceable to a document section or a `--var` / selector, or its `frontend` field is `[TBD-FE]`; no hex outside the light column is introduced.
  3. Component names are limited to C-01 to C-17; status roles are exactly `ok`, `warn`, `error`, `info`, and `neutral`; no `success` or `danger` role is created.
  4. The three layers are present and component tokens reference semantic or component tokens for colour, spacing, radius, and elevation.
  5. Colours are the light column only; no dark theme is defined.
  6. Layout is limited to 1440, 1280, 1080, and 960.
  7. `_meta.status` is `Draft`, `_meta` states the value basis, and it cites `TBD-INFRA-001` and `TBD-BIZ-004`.
- **Ownership and handoff:** `docs/03_design/**` is Docs Agent-owned and `docs/13_changes/**` is Tech Lead-owned. The Docs Agent is dormant, so the Tech Lead authors both paths under this record, following the CHG-015 pattern. Docs Agent acceptance is pending, not granted. `docs/12_reviews/**` is untouched; no Verifier review exists for this change.

## Verification

Executed 2026-10-18 (Asia/Shanghai) on the working tree. Documentation-only: no dependency install, build, server, browser, or design tool was run. Inline Python read the JSON and printed the counts below.

| # | Check | Command or method | Result |
|---|---|---|---|
| 1 | JSON parse | `python3 -m json.tool docs/03_design/design_tokens.json` | Exit 0; no comments; no trailing tokens |
| 2 | Token inventory | Inline Python token walk | 306 tokens: 70 primitive, 82 semantic, 154 component |
| 3 | Required fields | Inline Python check for `value`, `source`, `frontend` | 306 of 306 carry all three; 0 empty `source` or `value` |
| 4 | Frontend mapping | Inline Python equality check | 306 of 306 are `[TBD-FE]`; no library or framework named |
| 5 | Alias resolution | Inline Python recursive resolver | 0 unresolved aliases; 0 cycles |
| 6 | Colour groups | Inline key-set check | Exactly `text`, `background`, `border`, `status` |
| 7 | Status roles | Inline key-set check | Exactly `ok`, `warn`, `error`, `info`, `neutral`; no `success` or `danger` |
| 8 | Type groups | Inline key-set check | Exactly `family`, `size`, `weight`, `lineHeight` |
| 9 | Scale coverage | Inline token walk | 11 semantic spacing steps, 6 radius roles, 3 shadow roles |
| 10 | Layout breakpoints | Inline key-set check | Exactly `1440`, `1280`, `1080`, `960` |
| 11 | Sub-960 scan | Inline quoted-width scan | 0 occurrences of `375px`, `390px`, `768px`, `860px`, `780px`, or `44px`; quoted `560px` is the documented state/editor panel width, not a viewport |
| 12 | Hex allowlist | Inline regex over all strings | 26 distinct hex values, all from the `design_system.md` §3.1 light column; 0 dark-column hex values |
| 13 | Component scope | Inline key check | 14 component groups, all within C-01 to C-17: C-01, C-02, C-03, C-05, C-06, C-07, C-08, C-09, C-10, C-11, C-12, C-13, C-14, C-16 |
| 14 | Source traceability | Inline check that each `source` names a document or CSS selector | 306 of 306 traceable |
| 15 | Write-set isolation | `git status --porcelain`; `git diff --stat` | Only `design_tokens.json` and this record are new from this change. `docs/03_design/highfi_page_map.md` and `CHG-015-highfi-page-map.md` were already untracked before this change and were not touched. `git diff --stat` is empty. |
| 16 | Frozen assets | `grep -rl '^Status: Frozen' docs` | No output; no Frozen asset was touched |
| 17 | No dark theme | Inline key and value scan | No `dark` colour key or dark-column hex; `_meta.theme` records light-only as an exclusion |
| 18 | Contrast claim | Manual source review | Only the recorded `design_system.md` §6 pairs are cited; no new contrast measurement is claimed; the neutral pair is marked unrecorded |

Author verification: **PASS**. Independent Verifier review is not performed; the Verifier role is dormant and `docs/12_reviews/` contains no CHG-016 review. This record remains `Draft`.

## Dependency audit

None. No package, manifest, lockfile, CDN asset, external font, image request, network call, design-tool plugin, or code dependency was added. No install, build, or browser command was executed, and none is claimed.

## Decision and conflict log

- 2026-10-18: The token file is `Draft`. Every colour is a candidate from `design_system.md` §3.1; Porcelain Blue is not renamed, branded, or Frozen.
- 2026-10-18: The primitive layer carries only recorded raw values. The semantic layer carries the named roles. The component layer carries stable knobs for C-01 to C-17; C-04, C-15, and C-17 compose semantic tokens directly.
- 2026-10-18: The status set is fixed to C-07's five roles. No `success`, `danger`, or additional semantic colour is added.
- 2026-10-18: Layout is limited to the four adopted desktop widths. The 1360px content cap is not tokenised because it binds only above 1440; shadow-md is not tokenised because only the skip link uses it; `text-3xl` 28px and `control-h-lg` 42px are not tokenised because they are reserved.
- 2026-10-18: `TBD-INFRA-001` is Open, so every `frontend` field is `[TBD-FE]`. No component library, framework, or handoff format is selected.
- 2026-10-18: `TBD-BIZ-004` is recorded as Resolved in `open_items.md` and is referenced as-is for the read-only and terminal-Empty component behaviour. It is not re-decided or rewritten, and it does not add a create or edit control.
- 2026-10-18: No `TBD` or `CONFLICT` entry is created, deleted, or edited. No existing document is modified. `docs/03_design/README.md` and `docs/13_changes/README.md` are deliberately left unchanged, so their authoritative-asset lists do not yet name this file or this record.
- 2026-10-18: Path handoff. `docs/03_design/**` is Docs Agent-owned and `docs/13_changes/**` is Tech Lead-owned. The Docs Agent is dormant, so the Tech Lead authored both paths under this record. Docs Agent acceptance is pending and is not recorded as granted. No Verifier review exists.
