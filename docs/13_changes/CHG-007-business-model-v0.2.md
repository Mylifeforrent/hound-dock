# CHG-007 — Business model v0.2 acceptance restructure

Status: Draft
Complexity: Complex
Refs: TBD-BIZ-003, TBD-BIZ-004, TBD-BIZ-005, TBD-BIZ-006, TBD-BIZ-007, TBD-BIZ-008, TBD-BIZ-009, TBD-BIZ-010, TBD-BIZ-011, TBD-BIZ-012, TBD-BIZ-013, TBD-BIZ-014, TBD-BIZ-015, TBD-INFRA-001, TBD-INFRA-002, TBD-INFRA-003, TBD-INFRA-004, TBD-INFRA-005, TBD-INFRA-007, TBD-INFRA-009, TBD-INFRA-010, TBD-INFRA-011; CONFLICT-001, CONFLICT-002
Owner: Tech Lead (Docs Agent handoff; the Docs Agent is dormant)

## Plan

- **Inputs:** the resolved P1 decisions in `docs/00_setup/open_items.md` (TBD-BIZ-001 and TBD-BIZ-002) and `docs/13_changes/CHG-001-stage-2-prd.md`; PRD v0.1 (`Status: Draft`); the throwaway prototype and `docs/03_design/design_system.md`; v0.1 of `docs/01_product/business_model.md`; the CHG-006 independent review at `docs/12_reviews/CHG-006-review.md`; and the v0.2 business-architect acceptance contract supplied by the product owner on 2026-10-18.
- **Approach:** revise `business_model.md` in place to the v0.2 acceptance contract while preserving the v0.1 evidence that exists in the CHG-006 record and the CHG-006 review.
  - Keep the confirmed layer exactly where it is confirmed: eight business rules sourced only from SRC-001, five confirmed MVP capabilities, self-hosted deployment, and local accounts.
  - Condense the objectives from five to three. OBJ-004 is absorbed into OBJ-003; OBJ-005 becomes the deployment constraint in BR-001 and BR-007. Neither retired ID is reused.
  - Add the acceptance artifacts the v0.2 contract requires: 31 out-of-scope capabilities, 18 required-topic adjudications, six `flowchart LR` flows with `[HUMAN]`/`[SYSTEM]` labels and step time limits, one ER diagram with a unique-key/classification/PII table, a roles-by-entity-operation matrix with no blank cells, six `stateDiagram-v2` models with guard conditions and failure destinations, decision expressions and violation consequences in every BR, and NFR measurement points and time windows.
  - Keep every unconfirmed value as a registered `TBD-BIZ`; never promote a Draft-PRD or prototype statement into a BR.
  - Append the two missing conflict closing conditions and gates to `open_items.md` without choosing a side.
- **Affected paths:** `docs/01_product/business_model.md` (v0.2 revision); `docs/00_setup/open_items.md` (the TBD-BIZ-015 entry, the registry summary count, and four additive lines for CONFLICT-001 and CONFLICT-002); `docs/01_product/README.md` (asset index); `docs/13_changes/README.md` (change index); `docs/13_changes/CHG-007-business-model-v0.2.md`.
- **Risks:**
  - Claiming Mermaid rendering without a renderer. Mitigation: the self-check records "Unverified — static syntax only"; no render is claimed.
  - Promoting a proposal into a BR. Mitigation: every BR card cites SRC-001 only and contains no `TBD` tag.
  - Implying permissions that no BR grants. Mitigation: the matrix defaults to `denied`; every non-denied cell has a BR or a named derivation in §6.2.1.
  - Presenting a TBD target as a commitment. Mitigation: NFR-004, NFR-005, and NFR-009 use a `TBD-BIZ` target plus a separate suggested baseline labelled "not a commitment".
  - Resolving CONFLICT-001 or CONFLICT-002 by force. Mitigation: the appended fields state a closing condition and gate only; no side is chosen.
  - Repeating the CHG-006 review defects. Mitigation: the v0.2 document adds the FLOW-002 D2 row, forward NFR-004/005 traceability, canonical TBD gates, an honest self-check count, CAP-036 for skill invocation and tool-call visibility, and conflict closing conditions.
- **Verification plan:** table-pipe consistency; `entity.operation` matrix cell count and vocabulary; objective, MVP, out-of-scope, topic, NFR, BR, and entity counts; ID resolution against `open_items.md`; state reachability and dead-state checks; Mermaid fence, label, and node checks; banned-term scan; BR `TBD`-tag scan; `git diff --check`; independent Verifier review.

## Task Brief

- **Scope:** business-model revision for hound-dock. It defines objectives, the MVP boundary, exclusions, flows, entities, roles and permissions, states, business rules, NFRs, traceability, challenges, and the candidate pool. It does not accept the PRD, resolve a permission grant, set a commercial policy, design storage, define an API, or specify a page layout.
- **Inputs:** P1 confirmed decisions (SRC-001); P2 v0.2 acceptance contract (SRC-006, substituted because no repository acceptance file exists); P3 missing (TBD-BIZ-014); P4 PRD v0.1 Draft (SRC-002, candidates only); P5 prototype and design system (SRC-003/SRC-004, candidates and challenge evidence only).
- **Outputs:** `docs/01_product/business_model.md` v0.2; the TBD-BIZ-015 registry entry, the summary count, and four additive conflict lines in `docs/00_setup/open_items.md`; updated `docs/01_product/README.md` and `docs/13_changes/README.md`; this record.
- **Acceptance criteria:**
  1. Exactly three objectives, each with a metric, baseline, target, time window, and measurement method, or a registered TBD.
  2. Exactly five MVP capabilities, each with acceptance criteria and the BRs it covers.
  3. At least ten out-of-scope capabilities and at least twice the MVP count; each names the MVP item it displaces. All 18 required topics are adjudicated.
  4. Every core flow uses `flowchart LR`, ASCII node IDs, `[HUMAN]`/`[SYSTEM]` labels, drawn exception branches, and a step table with input, processing, output, exception, and time limit.
  5. The ER diagram carries cardinality; every entity has a unique business key, a data classification, and a PII yes/no.
  6. The permission matrix has roles as rows and `entity.operation` as columns; every cell is `allowed`, `denied`, `own-only`, or `read-only`; no cell is blank.
  7. Every state-bearing entity has a `stateDiagram-v2` and a transition table with a guard condition and a failure destination; no dead or unreachable state.
  8. Every BR has a trigger condition, a field/operator/threshold decision expression, and a violation consequence; no BR adds a new rule.
  9. Performance, capacity, security/compliance, and data-retention NFRs exist; every NFR has a target or a TBD plus a suggested baseline, a measurement point, a time window, and a method.
  10. Every conclusion carries `[SRC: ...]`, `[DERIVED: ...]`, or `[TBD-BIZ-nn]`; BRs use only the first two.
  11. IDs are unique, sequential within each family, and resolve; the retired OBJ IDs remain traceable and are not reused.
  12. The document remains `Draft` while CONFLICT-001, CONFLICT-002, and TBD-BIZ-012 are open; no unconfirmed item is presented as settled.
- **Ownership:** the Docs Agent is dormant, so the Tech Lead authors `docs/01_product/**` under this recorded handoff, following the CHG-001, CHG-005, and CHG-006 precedent. The Tech Lead owns `docs/00_setup/**` and `docs/13_changes/**`; the `open_items.md` additions are within that ownership. The Verifier owns `docs/12_reviews/**` and must not edit the deliverable. The product owner owns every decision in §11 and §12 of the business model; this change grants no permission, sets no target, and issues no compliance conclusion.

## Verification

| # | Command | Exit code | Observed result |
|---|---|---|---|
| 1 | `wc -l docs/01_product/business_model.md docs/00_setup/open_items.md` | 0 | 1230 lines in the business model; 338 lines in the registry |
| 2 | Python 3 structural check (see `### Reproducible checks`) | 0 | 52 tables, 0 inconsistent; 4 matrix rows × 18 operation columns, 0 blank cells, all values in the allowed set; 3 OBJ; 5 MVP; 31 out-of-scope; 18 required topics; 12 NFR; 8 BR |
| 3 | Python 3 state check (see `### Reproducible checks`; the review's separate reachability check also passed) | 0 | 6 state models; 0 unreachable states; 0 dead states; each terminal state exits to `[*]` |
| 4 | Python 3 Mermaid check (see `### Reproducible checks`) | 0 | 13 Mermaid blocks: 6 `flowchart LR`, 1 `erDiagram`, 6 `stateDiagram-v2`; 26 fences; no unprefixed flow label |
| 5 | Python 3 ID check (see `### Reproducible checks`) | 0 | 175 business IDs plus 4 `CHG` IDs = 179 distinct tokens in the deliverable; every `TBD-BIZ`, `TBD-INFRA`, and `CONFLICT` ID resolves in `open_items.md`. The Verifier's 182 count included tokens in its review record, not only the deliverable. |
| 6 | `python3 -c "import pathlib; t=pathlib.Path('docs/01_product/business_model.md').read_text().splitlines(); print([(i,l) for i,l in enumerate(t,1) if 'Banned wording' not in l and any(w in l.lower() for w in ['etc.','related','similar','several','appropriate','as much as possible','high-performance','high-availability','friendly','flexible'])])"` | 0 | Empty list: no match outside the §12.3 banned-list line |
| 7 | `python3 -c "import re,pathlib; t=pathlib.Path('docs/01_product/business_model.md').read_text(); s=t.split('## 8. Business rules',1)[1].split('## 9.',1)[0]; print(re.findall(r'\\[TBD-[A-Z]+-[0-9]{3}\\]',s))"` | 0 | Empty list: no `TBD` tag in any BR card; 8/8 BR cards carry a `Source` row citing SRC-001 |
| 8 | `git diff --check` | 0 | No whitespace error |
| 9 | Manual inspection of `git diff -- docs/00_setup/open_items.md` | 0 | The CHG-007 addition is the TBD-BIZ-015 entry, the summary count change, and four lines for CONFLICT-001 and CONFLICT-002. No existing line or ID was removed. The remaining diff in that file is the uncommitted CHG-006 registry work. |

### Reproducible checks

The following script was run with `python3` against the working tree and exited 0. It covers the structural, matrix, count, Mermaid, ID, BR-tag, and banned-term checks.

```python
import re, pathlib

bm = pathlib.Path('docs/01_product/business_model.md').read_text()
oi = pathlib.Path('docs/00_setup/open_items.md').read_text()
lines = bm.splitlines()

blocks, cur = [], []
for i, l in enumerate(lines, 1):
    if l.strip().startswith('|'):
        cur.append((i, l))
    else:
        if cur:
            blocks.append(cur)
            cur = []
if cur:
    blocks.append(cur)
assert not [b[0][0] for b in blocks if len({l.count('|') for _, l in b}) > 1]

matrix = [b for b in blocks if b[0][1].startswith('| Role | Account.read')][0]
rows = [l for _, l in matrix if l.startswith('| **ROLE-')]
assert len(rows) == 4
for l in rows:
    cells = [c.strip() for c in l.strip().strip('|').split('|')][1:]
    assert len(cells) == 18 and '' not in cells
    assert set(cells) <= {'allowed', 'denied', 'own-only', 'read-only'}

assert len(re.findall(r'^\| \*\*OBJ-\d{3}\*\*', bm, re.M)) == 3
assert len(re.findall(r'^\| \*\*CAP-00[1-5]\*\*', bm, re.M)) == 5
assert len(re.findall(r'^\| \*\*CAP-0(?:0[6-9]|[12]\d|3[0-6])\*\*', bm, re.M)) == 31
assert len(re.findall(r'^\| \d+ \| .* \| Out of MVP.*? \| CAP-\d{3} \| CAP-\d{3} \|', bm, re.M)) == 18
assert len(re.findall(r'^\| \*\*NFR-\d{3}\*\*', bm, re.M)) == 12
assert len(re.findall(r'^### BR-\d{3}', bm, re.M)) == 8

fence = chr(96) * 3
mb = re.findall(fence + r'mermaid\n(.*?)' + fence, bm, re.S)
assert len(mb) == 13
assert sum(b.strip().startswith('flowchart LR') for b in mb) == 6
assert sum(b.strip().startswith('erDiagram') for b in mb) == 1
assert sum(b.strip().startswith('stateDiagram-v2') for b in mb) == 6

ids = set()
for f in ['SRC', 'OBJ', 'CAP', 'FLOW', 'ENT', 'ROLE', 'SYS', 'EXT', 'STATE', 'BR', 'NFR', 'CHL', 'CAND']:
    ids |= set(re.findall(rf'\b{f}-\d{{3}}\b', bm))
ids |= set(re.findall(r'\bTBD-(?:BIZ|INFRA)-\d{3}\b', bm))
ids |= set(re.findall(r'\bCONFLICT-\d{3}\b', bm))
chg = set(re.findall(r'\bCHG-\d{3}\b', bm))
missing = [i for i in ids if (i.startswith('TBD') or i.startswith('CONFLICT')) and i not in oi]
assert not missing, missing

br = bm.split('## 8. Business rules', 1)[1].split('## 9.', 1)[0]
assert not re.findall(r'\[TBD-[A-Z]+-\d{3}\]', br)

banned = ['etc.', 'related', 'similar', 'several', 'appropriate', 'as much as possible',
          'high-performance', 'high-availability', 'friendly', 'flexible']
assert not [l for l in lines if 'Banned wording' not in l and any(w in l.lower() for w in banned)]

print(f'tables={len(blocks)} inconsistent=0 matrix=4x18 objs=3 mvp=5 oos=31 '
      f'topics=18 nfr=12 br=8 mermaid=13 business_ids={len(ids)} chg_ids={len(chg)}')
```

### CHG-007 review disposition

| Finding | Disposition after the review |
|---|---|
| P1-1 — false v0.1 git-history claim | Fixed in this record: the Plan and the decision log now say v0.1 was an uncommitted working-tree draft; the deliverable metadata was already corrected. |
| P1-2 — six diagrams for eighteen entities | Recorded as TBD-BIZ-015; self-check row 5 is Partial; no product-owner decision is claimed. This remains a contract deviation until TBD-BIZ-015 closes. |
| P1-3 — `Account.read` own-only | Fixed: the cell is now `denied`; §6.2.1 removes the grant and lists `Account.read` under TBD-BIZ-004. |
| P1-4 — self-check overstated | Fixed: a tagged caption was added; row 5 is Partial; row 12 is corrected; the verdict is Pass 10 / Partial 1 / Unverified 1 / Fail 0. |
| P2-1 — `NeedsAuth` vs `Needs authentication` | Fixed: the diagram declares `state "Needs authentication" as NeedsAuth`. |
| P2-2 — ER cardinality | Fixed: the reading note states that the entity table is authoritative for the exactly-one constraint and that the diagram cannot express exclusive-or. |
| P2-3 — CHG-006 verification placeholder | Open — CHG-006 still contains the placeholder; this record does not complete it. |
| P2-4 — command evidence and ID count | Fixed: `### Reproducible checks` contains the script; the count is 175 business IDs plus 4 `CHG` IDs = 179, and the Verifier's 182 included review-record tokens. |
| P2-5 — review index | Open — the Verifier owns `docs/12_reviews/README.md`; the index remains unchanged. |
| P2-6 — NFR-009 time window and §9 inventory | Fixed: NFR-009 states the retention period and the measurement sample; §9 lists the nine numeric and three TBD targets. |
| P2-7 — guard tags | Fixed: the two guard-bearing transition rows are tagged `[DERIVED: BR-005]` and `[DERIVED: BR-001]`. |
| P2-8 — BR-002/BR-005 atomicity | Open — the combined cards are retained to avoid adding rules; product-owner acceptance is not recorded. |
| P2-9 — `RunStep.read` broader than BR-008 | Addressed: §6.2.1 limits the grant to the initiator's own run and ties it to FLOW-003 N6/N7. |

**Reviewer:** Independent Verifier subagent; review at `docs/12_reviews/CHG-007-review.md` (FAIL — 4 P1, 9 P2, no P0). Corrections were applied after the reviewed snapshot; a re-review is required before merge.

**Verification limits:** the 13 Mermaid diagrams were static-checked, not rendered. No Mermaid CLI is installed, and adding a dependency is prohibited by RULE-007 and RULE-012. The independent Verifier should render them with an available tool. The Stage 5 acceptance contract (SRC-006) is the product owner's message, not a repository file; CONFLICT-002 records the path discrepancy.

**CHG-006 finding disposition:**

| Finding | Disposition in v0.2 |
|---|---|
| P1 — conflicts lack a closing condition and gate | Fixed in `open_items.md` and mirrored in §12.2; no side chosen |
| P1 — skill invocation and tool-call visibility had no CAP | Fixed by CAP-036 (out of scope) and the CAP-001/CAP-002 boundaries |
| P1 — self-check claimed a pass while rows failed | Partly fixed: the self-check now carries a tagged caption, reports Pass 10 / Partial 1 / Unverified 1 / Fail 0, and records the per-entity state-coverage gap under TBD-BIZ-015. The verdict is no longer Fail 0. |
| P2 — FLOW-002 D2 absent from the table | Fixed: D2 is a table row and a diagram node |
| P2 — forward traceability omitted NFR-004 and NFR-005 | Fixed: both appear in §10.1 |
| P2 — BR-008 derivation cited SRC-006 | Fixed: the derivation cites SRC-001 only |
| P2 — TBD gates diverged from the registry | Fixed: §12.1 uses the canonical `Must confirm by` strings |
| P2 — BR-002 and BR-005 combine obligations | Open — the combined cards are retained to avoid adding rules; product-owner acceptance of the combined form is not recorded. This P2 is not counted as fixed. |
| P2 — two Allow rows lacked a BR grant | Addressed by §6.2.1: each non-denied cell cites a BR or a labelled derivation; the default remains `denied` |
| P2 — CHG-006 verification placeholder | Open — `CHG-006-business-model.md` still contains `<!-- VERIFICATION-PENDING -->`; this record does not complete it. A separate CHG-006 correction or explicit deferral is required. |
| P2 — review index not updated for CHG-006 | Not changed: the Verifier owns `docs/12_reviews/**`; the index update remains a separate action |

## Dependency audit

None — no dependency, manifest, lockfile, package, font, or tool is introduced. The document is Markdown; the Mermaid blocks are text.

## Decision and conflict log

- 2026-10-18: Product owner requested the v0.2 revision against the supplied acceptance contract. The v0.1 file was an uncommitted working-tree draft; the v0.2 revision replaces it, and the CHG-006 review records the v0.1 snapshot.
- 2026-10-18: Objectives reduced from five to three. OBJ-004 is absorbed into OBJ-003; OBJ-005 becomes the deployment constraint in BR-001 and BR-007. The retired IDs are recorded in §10.4 and are not reused.
- 2026-10-18: The MVP remains exactly CAP-001 to CAP-005. The out-of-scope register grows to 31 CAPs; CAP-036 records skill invocation and tool-call visibility, which the CHG-006 review found under-modelled. Every required topic in the v0.2 contract is adjudicated in §3.3.
- 2026-10-18: The eight BRs are unchanged in substance. Each card now names a trigger condition, a field/operator/threshold decision expression, a violation consequence, and an explicit `Source` row. No ninth rule was added.
- 2026-10-18: The effective permission matrix keeps the default `denied`. ROLE-001 receives five `own-only` cells, three `read-only` cells, and one `allowed` cell, each traced to a BR or a labelled derivation. `Account.read` is `denied` because no BR grants it. ROLE-002, ROLE-003, and ROLE-004 remain `denied` in every cell because no grant is confirmed; their proposed grants stay in §6.3.
- 2026-10-18: NFR-004 capacity, NFR-005 availability, and NFR-009 retention use a `TBD-BIZ` target plus a suggested baseline explicitly labelled "not a commitment". The other nine NFRs carry a proposed numeric target. All twelve have a measurement point, a time window, and a method.
- 2026-10-18: The two CONFLICT entries gained a `Closing condition` and a `Gate` in `open_items.md`. No side was chosen, no ID was removed, and the entries remain `Open`.
- 2026-10-18: One new TBD was created after the independent review: TBD-BIZ-015 records the state-model coverage interpretation. TBD-BIZ-003 through TBD-BIZ-015 are the business open items; the canonical `Must confirm by` strings are mirrored in §12.1.
- 2026-10-18: The PRD is not accepted. TBD-BIZ-012 remains `Open`, and the document remains `Draft`. The root `README.md` was not edited; its "Chat with search" line remains a recorded drift (CHL-005).
- 2026-10-18: The prototype and design system were used only as candidate and challenge evidence. The prototype's "Admin-only publishing", "Blocked in v1", and budget-meter claims were not promoted to rules.
- 2026-10-18: No compliance conclusion was issued. P3 is missing, TBD-BIZ-014 records the gap, and NFR-008 states the zero-byte boundary condition rather than a legal conclusion.
- 2026-10-18: Mermaid rendering was not executed. The self-check and the verification limits record this explicitly; no render is claimed.
- 2026-10-18: The independent CHG-007 review returned FAIL (4 P1, 9 P2). P1-1, P1-3, and P1-4 were corrected; P1-2 is recorded as TBD-BIZ-015 and remains a contract deviation; P2-3, P2-5, and P2-8 remain open. A re-review is required before merge.
