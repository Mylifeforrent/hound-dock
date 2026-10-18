# CHG-017 — Component specification C-01 to C-17

Status: Draft
Complexity: Complex
Refs: TBD-INFRA-001, TBD-BIZ-004, TBD-BIZ-012
Owner: Tech Lead (Docs Agent dormant; same handoff pattern as CHG-015 and CHG-016)

## Plan

- **Why this change:** the component list and its page, state, and reuse decisions exist in `highfi_page_map.md` §3 to §8, and the values exist in `design_tokens.json`, but no single artifact states what each of the 17 components is, which states it must render, which tokens it consumes, and which interaction rule governs each of its actions. Without that artifact the high-fidelity pass would re-open component anatomy or read the throwaway prototype as authority.
- **Approach:** author one JSON file with 17 entries, C-01 to C-17 only. Copy each name verbatim from §8. Carry `purpose`, `pages`, `variants`, `states`, `tokens`, `behavior`, and `source` per entry. Use `component.*` tokens where the token layer defines the component, and compose C-04, C-15, and C-17 from semantic tokens because `_meta.componentCoverage` records no component entry for them. Carry the seven component states for every entry and write `N/A: <reason>` wherever a state cannot occur. Cite `interaction_design.md` §4 or §5 for every behaviour item and write `无（只读）` for purely read-only components. Record M-01, M-06, and `TBD-INFRA-001` as open rather than resolving them.
- **Affected paths:** `docs/03_design/component_spec.json` (new); `docs/13_changes/CHG-017-component-spec.md` (new). No existing file is modified.
- **Risks:**
  1. A token reference can point at a path that does not resolve. Mitigation: every entry in `tokens[]` was resolved against `design_tokens.json` through the component, semantic, and layout branches; 0 unresolved.
  2. A component can drift outside the §8 list. Mitigation: the id set is exactly C-01 to C-17, Card appears only as C-06, Table only as C-11, and the only overlay is the C-14 discard confirmation.
  3. A denied capability can be described as a disabled control. Mitigation: the spec states that an unavailable capability is absent rather than greyed, keeps the authoring routes at No Permission, and renders no authoring form.
  4. The spec can be read as resolving M-01 or M-06. Mitigation: `openReferences` records both as unresolved, the dialog keeps one working label, and no side is chosen.
  5. A framework, component library, design tool, or artifact identifier can be implied. Mitigation: none is named, and `TBD-INFRA-001` is recorded as Open.
- **Verification plan:** execute a JSON parse, component and name set check, page-set check against §8 and §3, seven-state coverage check, recursive token resolution, literal scan for hex and dimension values, forbidden-term scan, variant-scope check, citation check, write-set isolation, and a Frozen-asset scan. Documentation-only change: no dependency install, build, server, or browser run is needed.

## Task Brief

- **Scope:** specify the components already named in `highfi_page_map.md` §8 for pages PG-001 to PG-012, and record this change. No edit to `highfi_page_map.md`, `design_tokens.json`, `interaction_design.md`, `design_system.md`, `prd.md`, `open_items.md`, the prototype, `docs/03_design/README.md`, or `docs/13_changes/README.md`.
- **Inputs (authority high to low):** `highfi_page_map.md` §8 (the only component list), §3 to §5 (pages, states, reuse); `design_tokens.json` (the only value source); `interaction_design.md` §4 to §7 (flow steps, interaction rules, nine states, desktop layout); `design_system.md` §3 and §5 (token roles, component notes); `prd.md` (AC traceability only; v0.2 Draft, not Gate 1-accepted).
- **Outputs:** `docs/03_design/component_spec.json` (Status: Draft) and this record.
- **Acceptance criteria:**
  1. The JSON parses; the component id set is exactly C-01 to C-17; every name matches §8 verbatim.
  2. Every component has a §8 source row, and every PG reference exists in §3.
  3. Every token reference resolves; the file contains no hex, `rgba()`, or raw dimension literal.
  4. Every component carries `default`, `hover`, `focus`, `disabled`, `in-flight`, `error`, and `readonly`, with a reason on every `N/A`.
  5. Error, disabled, and loading are defined or explicitly N/A for C-08, C-09, and C-10.
  6. No status role beyond C-07's five, no component outside the §8 list, no authoring form, no denied capability rendered as a disabled control, and no framework, component library, design tool, or artifact identifier.
  7. C-04, C-15, and C-17 compose semantic tokens and state that basis; C-17 also cites the shared C-08 focus pair.
  8. M-01, M-06, `TBD-INFRA-001`, and the unassigned `Initiated` badge are recorded as open, not resolved.
- **Ownership and handoff:** `docs/03_design/**` is Docs Agent-owned and `docs/13_changes/**` is Tech Lead-owned. The Docs Agent is dormant, so the Tech Lead authors both paths under this record, following the CHG-015 and CHG-016 pattern. Docs Agent acceptance is pending, not granted. `docs/12_reviews/**` is untouched; no Verifier review exists for this change.

## Verification

Executed 2026-10-18 (Asia/Shanghai) on the working tree. Documentation-only: no dependency install, build, server, browser, or design tool was run. Checks were run with `python3 -m json.tool` and a temporary inline Python validator at `/tmp/validate_spec.py`; the validator is evidence, not a committed asset.

| # | Check | Command or method | Result |
|---|---|---|---|
| 1 | JSON parse | `python3 -m json.tool docs/03_design/component_spec.json` | Exit 0; no comments; no trailing tokens |
| 2 | Component set | Inline id and name equality check against §8 | 17 entries, C-01 to C-17 in order; 17 of 17 names match |
| 3 | Page sets | Inline comparison with the §8 `Appears on` column | 17 of 17 page sets match; every reference is inside PG-001 to PG-012 |
| 4 | §3 resolution | Line check against `highfi_page_map.md` §3 | Every cited page line contains its PG; §3 lines 109 to 120 |
| 5 | §8 provenance | Line check against `highfi_page_map.md` §8 | 17 of 17 `section8` lines 460 to 476 contain their component id |
| 6 | State coverage | Key-order and `N/A` check | 119 cells, 7 per component in the required order; every `N/A` begins with `N/A: ` and states a reason |
| 7 | Required control states | Field presence check | C-08 and C-10 define disabled, in-flight, and error; C-09 defines error and in-flight and records disabled as N/A with the read-only lock as the reason |
| 8 | Token resolution | Recursive resolver over every entry in `tokens[]` | 207 references, 0 unresolved, 0 empty |
| 9 | Literal scan | Regex over the whole file for hex, `rgba()`, and a number with a `px` unit | 0 occurrences of each |
| 10 | Forbidden-term scan | Regex for the excluded component, status, theme, narrow-layout, touch-target, and framework terms | 0 occurrences |
| 11 | Variant scope | Key comparison with `component.C-07-status-pill.variants` and `component.C-08-button.variants` | C-07 exactly `ok`, `warn`, `error`, `info`, `neutral`; C-08 exactly `primary`, `secondary`, `ghost` |
| 12 | Behaviour citation | Check that each list item names a §4 or §5 rule | 9 components list behaviour items, all cited; 8 read-only components return `无（只读）` |
| 13 | Semantic composition | Presence of `tokenBasis` on C-04, C-15, C-17 | 3 of 3 present; C-17 also cites the shared C-08 focus pair |
| 14 | Write-set isolation | `git status --porcelain`; `git diff --stat` | Only `component_spec.json` and this record are new from this change. `highfi_page_map.md`, `design_tokens.json`, `CHG-015`, and `CHG-016` were already untracked before this change and were not touched. `git diff --stat` is empty |
| 15 | Frozen assets | `grep -rl '^Status: Frozen' docs` | No output; no Frozen asset was touched |

Author verification: **PASS**. Independent Verifier review is not performed; the Verifier role is dormant and `docs/12_reviews/` contains no CHG-017 review. This record remains `Draft`.

## Dependency audit

None. No package, manifest, lockfile, CDN asset, external font, image request, network call, design-tool plugin, or code dependency was added. No install, build, or browser command was executed, and none is claimed.

## Decision and conflict log

- 2026-10-18: The component specification is `Draft`. PRD v0.2 is not Gate 1-accepted and no component is approved for build.
- 2026-10-18: `variants[]` takes the `component.<id>.variants` keys where the token layer defines them (C-07, C-08, C-09). Where it does not, it carries the content variants named in the §8 row and `variantBasis` says so. No variant is invented and no action-destructive role is added.
- 2026-10-18: C-04, C-15, and C-17 are composed from semantic tokens because `design_tokens.json` `_meta.componentCoverage` records no component entry for them. C-17 also cites the shared C-08 focus width, offset, and colour, the same cross-reference pattern the token file uses for C-09, C-10, and C-14.
- 2026-10-18: C-07 keeps the five `ok`, `warn`, `error`, `info`, and `neutral` roles and the §8 mapping. The §8 mapping assigns no variant to `Initiated`; the specification adds no sixth role and records the gap in `openReferences` and `residualLimits`.
- 2026-10-18: M-01 and M-06 are recorded as unresolved. No authoring route renders a form or a disabled authoring control, and C-14 keeps one working dialog label while stating that the chat wording and the run-input wording must become one string.
- 2026-10-18: No framework, component library, design tool, handoff format, or artifact identifier is named. `TBD-INFRA-001` is recorded as Open.
- 2026-10-18: No `TBD` or `CONFLICT` entry is created, deleted, or edited. No existing document is modified. `docs/03_design/README.md` and `docs/13_changes/README.md` are deliberately left unchanged, so their authoritative-asset lists do not yet name this file or this record.
- 2026-10-18: Path handoff. `docs/03_design/**` is Docs Agent-owned and `docs/13_changes/**` is Tech Lead-owned. The Docs Agent is dormant, so the Tech Lead authored both paths under this record. Docs Agent acceptance is pending and is not recorded as granted. No Verifier review exists.
