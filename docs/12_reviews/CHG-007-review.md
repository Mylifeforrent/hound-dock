# CHG-007 Review — Business model v0.2 acceptance restructure

Status: Reviewed
Reviewer: Independent Verifier subagent

## Reviewed state

- Repository: `/Users/macbookair/Documents/deepseek-harness/hound-dock`, branch `main`, `HEAD` `724a299`.
- Date: 2026-10-18, 17:16 +0800 (09:16Z).
- Deliverable: `docs/01_product/business_model.md`, 1,226 lines, SHA-256 `260d43c0f0caa59d567d4a7782d6fe1bdff37cd77913f33bccddb9497127c1d3`.
- Registry: `docs/00_setup/open_items.md`, 327 lines, SHA-256 `268b18ed2c6f0a2463d89240667b08d96762df611d8052f003938639af79668c`.
- Change record: `docs/13_changes/CHG-007-business-model-v0.2.md`, 98 lines, SHA-256 `89333248717c6723cc7bce45fdcc38f7983a2c3b524fa30a871160fa488e2efa`.
- The deliverable changed during this review from 1,218 lines / SHA-256 `40f7c8bc12f3eefac7f1995b3d8cab12e428067af3a9ddc63f1984a6d5c1a407` to the 1,226-line snapshot above. The findings below were re-checked against the 1,226-line snapshot; where the concurrent edit corrected a claim, that is noted. The review is therefore based on the stated hash, not on an earlier or later working-tree state.

Reviewed files: `AGENTS.md`; `docs/00_setup/project_rules.md`; `docs/00_setup/open_items.md`; `docs/00_setup/README.md`; `docs/01_product/prd.md`; `docs/01_product/business_model.md`; `docs/01_product/README.md`; `docs/13_changes/CHG-001-stage-2-prd.md`; `docs/13_changes/CHG-006-business-model.md`; `docs/13_changes/CHG-007-business-model-v0.2.md`; `docs/13_changes/README.md`; `docs/12_reviews/CHG-006-review.md`; `docs/12_reviews/README.md`; `docs/03_design/design_system.md`; `docs/03_design/prototype/README.md`; `README.md`.

## Verdict

**FAIL** — 4 P1 and 9 P2 findings; no P0. The document is substantially stronger than v0.1 and is correctly still `Draft`, but it does not yet meet the v0.2 acceptance contract: state-model coverage is not one diagram per entity, the effective matrix grants one permission that no BR supports, the self-check verdict is still overstated, and the CHG-007 record makes a false v0.1-retention claim. No finding was fixed in this review; this record is report-only.

## Checklist

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | §2 OBJ: at most 3, each with metric, baseline, target, time window | PASS | 3 rows, `business_model.md:75-77`. Metric and baseline are explicit; target and time window are `TBD-BIZ-006` with suggested values labelled "not a commitment", so none is confirmed. |
| 2 | §4 FLOW-001…: `flowchart LR`, ASCII node IDs, `[HUMAN]`/`[SYSTEM]` labels, exception branches, step table with input/processing/output/exception/time limit | PASS | 6 flows at `:172-378`; 6 `flowchart LR` diagrams at `:187` (FLOW-001), `:223` (FLOW-002), `:260` (FLOW-003), `:298` (FLOW-004), `:333` (FLOW-005), `:368` (FLOW-006); every step table has all five required columns (`:174`, `:202`, `:237`, `:277`, `:312`, `:347`). F1/F2 exception nodes are present in every diagram. |
| 3 | §5 ENT-001…: `erDiagram` with cardinality + entity table with unique key, data classification, PII yes/no | PASS | ER at `:388-411`; 18 entities and 21 labelled relationships; entity table at `:415-436`, 18 rows. Every row has a unique key and a yes/no PII cell; data classification is consistently `TBD-BIZ-003` with a candidate label, which is the correct no-invention treatment while TBD-BIZ-003 is open. |
| 4 | §6 matrix: roles as rows, entity.operation as columns, only allowed/denied/own-only/read-only, never blank | PASS | `:467-472`: 4 role rows × 18 `entity.operation` columns; 72 cells, 0 blank, all values in the allowed vocabulary. |
| 5 | §7 STATE-001…: one `stateDiagram-v2` per entity + transition table with guard and failure destination; no dead or unreachable states | **FAIL** | Six `stateDiagram-v2` blocks at `:569`, `:599`, `:630`, `:662`, `:702`, `:733` for 18 entities. §7.0 maps 10 entities to `None` (`:538-557`), and the remaining 8 state-bearing entities share 6 models: ENT-006/ENT-007 share STATE-003 (`:545-546`), ENT-011/ENT-012 share STATE-005 (`:550-551`). The transition tables have guard and failure-destination columns and the static reachability check passes (0 dead, 0 unreachable), but the contract's per-entity requirement is not met. |
| 6 | §8 BR-001…: trigger condition, field/operator/threshold decision expression, violation consequence | PASS | 8 cards at `:769-961`; each has `Trigger condition`, `Decision expression — field/operator/threshold`, and `Consequence of violation`. BR-001 to BR-008 are unique and sequential. |
| 7 | §9 NFR-001…: performance, capacity, security/compliance, data retention; each with target, measurement point, time window | PASS | 12 rows at `:965-978`; performance NFR-001–003, capacity NFR-004, security/compliance NFR-006–008, retention NFR-009. Every row has a non-empty target, measurement point, and time window; NFR-004/005/009 use a TBD target plus a suggested baseline. Caveat: NFR-009's "Time window" is the sampling window, not the retention period (P2-6). |
| 8 | §3 MVP CAP: at most 5, each with acceptance criteria and covered BRs | PASS | CAP-001–CAP-005 at `:91-95`, exactly 5; every row has a non-empty acceptance-criteria cell and a `Covers BR` cell. |
| 9 | §3 out of scope: ≥2× MVP and ≥10 items, each naming what it displaces; 18 required topics adjudicated | PASS | 31 out-of-scope CAPs at `:101-133`; 31 ≥ 10 and 31 ≥ 2 × 5; every row has a `Displaces` cell naming a CAP-001–005 item. All 18 required topics at `:139-158`, each with a CAP and a displaced MVP item. |
| 10 | Every conclusion tagged; no untagged assertion | **FAIL** | The pre-completion self-check table at `:1190-1204` is a table of Pass/Unverified/Fail conclusions with no `Tag` column and no tagged caption; its own row 1 (`:1192`) claims every table has one. The concurrent edit removed the false v0.1-git claim from the deliverable (`:15` now states no v0.1 commit exists), but the self-check defect remains. |
| 11 | IDs unique, sequential, referenced, no dangling references | PASS | 18 ID families; 182 distinct ID tokens observed; no gaps in OBJ 1–3, CAP 1–36, FLOW 1–6, ENT 1–18, STATE 1–6, BR 1–8, NFR 1–12, ROLE 1–4, SYS 1–6, EXT 1–3, CAND 1–23, CHL 1–16. Every `TBD-BIZ`, `TBD-INFRA`, and `CONFLICT` reference resolves in `open_items.md`; every `CHG` reference resolves to an existing record. |
| 12 | No business rule added; BR evidence is SRC-001 only; no TBD/CONFLICT tag inside a BR card | PASS | 8/8 BR cards cite `open_items.md#TBD-BIZ-001`/`#TBD-BIZ-002` (SRC-001) and use only `[SRC:]` and `[DERIVED:]`; a scan of §8 finds no `[TBD-…]` or `[CONFLICT-…]` tag inside a BR card. A textual comparison with v0.1 is impossible because no v0.1 copy exists (see P1-1); no ninth rule is present. |
| 13 | Forbidden terms absent or quantified | PASS | Case-insensitive scan for `etc.`, `related`, `similar`, `several`, `appropriate`, `as much as possible`, `high-performance`, `high-availability`, `friendly`, `flexible`: the only hit is the banned-wording paragraph at `:1154`. |
| 14 | No TBD used as a settled fact | PASS | Targets, classifications, gates, and grants are labelled `TBD-BIZ-003/004/006/008/012` etc. and carry "not a commitment" wording where a suggested value is shown (`:75-77`, `:973`, `:981`). |
| 15 | Source eligibility: every BR cites SRC-001 only; no Draft-PRD, prototype, design-system, or SRC-006 source in a BR | PASS | §8 preamble `:767`; every BR `Source` row points to the resolved TBD-BIZ-001/002 decisions; no `[SRC: prd.md]`, `[SRC: prototype/]`, `[SRC: design_system.md]`, or `[SRC: SRC-006]` appears in a BR card. |
| 16 | Document remains `Draft` while CONFLICT-001, CONFLICT-002, and TBD-BIZ-012 are open | PASS | `business_model.md:3` `Status: Draft`; `open_items.md` CONFLICT-001, CONFLICT-002, and TBD-BIZ-012 are all `Open`. The document explicitly does not claim `Reviewed`. |
| 17 | Matrix implies no grant that no BR or labelled derivation supports | **FAIL** | `Account.read = own-only` at `:469`; §6.2.1 cites "BR-001 binds the session to the account" at `:480`, but BR-001 (`:769-791`) only authorises creation of a session after local authentication and never grants a read of account data. ROLE-001's own accessible-resource list at `:458` names conversations, messages, run initiation, own run outcome, and registry listings — not account data. The label is a derivation, but the derivation does not entail the grant. |
| 18 | `open_items.md` has lost no ID; CHG-007 addition is additive | PASS | `git show HEAD:docs/00_setup/open_items.md` IDs vs working tree: 0 removed; 9 added (`TBD-BIZ-008`–`014`, `CONFLICT-001`, `CONFLICT-002`). CHG-007's four added lines are the two `Closing condition` + two `Gate` rows for CONFLICT-001/002 (`open_items.md:315-316`, `:326-327`); the remaining diff is the uncommitted CHG-006 registry work. |
| 19 | Self-check verdict matches reality | **FAIL** | `:1205` and `:1216` claim "Pass 11 / Unverified 1 / Fail 0". Row 1 is false because the self-check table is itself untagged; row 5 (`:1196`) checks only dead states and does not assess the per-entity coverage that fails under check 5; row 12 (`:1203`) still says SRC-002/003/004/006 appear "only in CAND, CHL, out-of-scope CAP rationale, proposed NFRs, and proposed entity or state notes", although SRC-006 appears in §1.1, §1.2, §2, §4, and §8, and SRC-002 appears in §6.1 and §6.3. The claimed count is therefore overstated. |
| 20 | CHG-007 record has Plan, Task Brief, Verification, Dependency audit, Decision log, and honest reviewer status | PASS | `CHG-007-business-model-v0.2.md:8` Plan, `:27` Task Brief, `:47` Verification, `:81` Dependency audit, `:85` Decision and conflict log; `:61` Reviewer is `Pending — independent Verifier required`, which is honest at the reviewed state. |
| 21 | Change-record verification evidence is reproducible and accurate | **FAIL** | Rows 2–5 (`:52-55`) describe the checks ("Python 3 structural check (heredoc)") rather than recording the commands, so RULE-011's command evidence cannot be re-run exactly. Row 5's "174 IDs" is not reproducible: 182 distinct ID tokens are present. The disposition table at `:78` says the CHG-006 verification placeholder was "Fixed by this `## Verification` section", but `CHG-006-business-model.md:47` still contains only `<!-- VERIFICATION-PENDING -->`. |
| 22 | Mermaid renders | UNVERIFIED — static check only | 13 Mermaid blocks (6 `flowchart LR`, 1 `erDiagram`, 6 `stateDiagram-v2`), 28 total fences including the closing plain block; fences are balanced, flow node IDs are ASCII, every flow label begins `[HUMAN]`/`[SYSTEM]`, and edge endpoints resolve to labelled nodes. `mmdc` and `mermaid` are not installed; `node` exists but no Mermaid package is present. No dependency was added, so no render was executed. |

## Findings

### P0

None.

### P1-1 — CHG-007 still claims v0.1 is retained in git history, but no v0.1 copy exists

`CHG-007-business-model-v0.2.md:87` states: "The v0.1 file is retained in git history and is not deleted." The Plan at `:11` likewise promises a revision "without deleting v0.1 evidence". Both claims are false: `docs/01_product/business_model.md` is untracked (`git status` shows `??`), `git log --all -- docs/01_product/business_model.md` returns nothing, `git ls-files --error-unmatch` fails, and no unreachable blob contains the v0.1 heading. The 990-line v0.1 snapshot hashed by the CHG-006 review is therefore not recoverable from the repository. The concurrent edit corrected the deliverable's own metadata (`business_model.md:15` now says "v0.1 was an uncommitted working-tree draft, so no v0.1 commit exists to retain"; `:22` says the content is summarized in CHG-006), which makes the conflict with the change record explicit.

**Suggested correction (not applied):** change the CHG-007 Plan and Decision log to the truth — v0.1 was an uncommitted working-tree draft that was replaced, and its content survives only as the CHG-006 record and the CHG-006 review — or preserve a v0.1 copy under an allowed path before claiming retention. Do not claim git history that does not exist.

### P1-2 — The state model has six diagrams for eighteen entities, so the "one `stateDiagram-v2` per entity" criterion is not met

The acceptance contract requires one `stateDiagram-v2` per entity plus a transition table. §7 contains six diagrams (`business_model.md:569`, `:599`, `:630`, `:662`, `:702`, `:733`) and maps 10 of 18 entities to `None` (`:538-557`). Even among the 8 entities that are mapped to a model, ENT-006/ENT-007 share STATE-003 and ENT-011/ENT-012 share STATE-005, so only six diagrams cover eight state-bearing entities. The document reinterprets the contract as "state-bearing entity" (`:534`) and argues that a diagram for an immutable, append-only, or derived entity would invent states. That argument is technically sound, but it is a deviation from the product owner's wording, and no product-owner approval of the reinterpretation is recorded.

**Suggested correction (not applied):** record an explicit product-owner decision that entities without lifecycle state are exempt and that version-level models cover both the definition and version entities, or add per-entity diagrams where a lifecycle actually exists. Do not invent states merely to reach a count; if the exemption is accepted, change the self-check to assess the accepted interpretation.

### P1-3 — The effective matrix grants `Account.read = own-only` without a BR or a derivation that supports it

`business_model.md:469` grants ROLE-001 `Account.read = own-only`. §6.2.1 (`:480`) traces the six own-only cells to BR-001, BR-002, and BR-008, saying "BR-001 binds the session to the account". BR-001 (`:769-791`) authorises session creation after local authentication; it does not grant a read of account data. ROLE-001's accessible-resource list (`:458`) does not include account data, and the matrix's own default is `denied` unless a confirmed grant exists (`:450`). This is exactly the kind of implied grant the acceptance contract forbids. The related `RunStep.read = own-only` cell is broader than BR-008's failed-step visibility, but that is a weaker version of the same issue and is recorded as P2-9.

**Suggested correction (not applied):** set `Account.read` to `denied`, or add an explicit confirmed BR/derivation that grants reading one's own account and update ROLE-001's accessible-resource list to match. Do not rely on "binds the session to the account" as a read grant.

### P1-4 — The self-check verdict "Pass 11 / Unverified 1 / Fail 0" is still overstated

The self-check table (`business_model.md:1190-1204`) is itself a table of conclusions with no `Tag` column and no tagged caption, so its row 1 claim (`:1192`) that "every table carries a `Tag` column or a tagged caption" is false. Row 5 (`:1196`) checks only dead/unreachable states and omits the per-entity coverage that fails under checklist item 5. Row 12 (`:1203`) still overstates source confinement: SRC-006 appears in §1.1 (`:36`), §1.2 (`:58`), §2 (`:71`), §4 (`:168`), and §8 (`:767`), and SRC-002 appears in §6.1 (`:458`) and §6.3 (`:493-501`), not only in the listed categories. The verdict at `:1205` and the closing block at `:1216` nevertheless claim no failures. A self-check that is not tagged, omits a contract criterion, and contains a false evidence claim cannot be recorded as Pass 11 / Fail 0.

**Suggested correction (not applied):** add a `Tag` column or per-row tags to the self-check table, correct rows 1, 5, and 12, and re-score the verdict honestly. Do not claim Fail 0 while row 1 is demonstrably false.

### P2-1 — STATE-004 diagram uses `NeedsAuth`, while the state table and transition table use `Needs authentication`

The state table at `business_model.md:657` and the transition table at `:680-686` name the state `Needs authentication`; the Mermaid block at `:665-671` uses the bare ID `NeedsAuth`. The diagram's rendered label would be `NeedsAuth`, not the business state name, so the diagram and the table describe different state names.

**Suggested correction (not applied):** use Mermaid's alias syntax (`state "Needs authentication" as NeedsAuth`) or rename the state consistently in the diagram and both tables.

### P2-2 — ER cardinality contradicts the entity table for Run Step and Task Step targets

ENT-015 (`business_model.md:433`) says "1 Run Step references 1 Skill Version or 1 MCP Tool", but the ER uses `}o--o|` for both targets (`:407-408`), which allows zero or one. ENT-013 (`:431`) says a Task Step "references exactly 1 Skill Version or 1 MCP Tool", but the ER uses `SKILL_VERSION ||--o{ TASK_STEP` and `MCP_TOOL ||--o{ TASK_STEP` (`:396`, `:398`), which does not express the exclusive-or or the required-one constraint clearly. The diagram is syntactically valid, but its cardinalities do not match the entity table.

**Suggested correction (not applied):** reconcile the ER notation with the table, or add a note that the two "is target of" edges are alternatives and exactly one is required per step.

### P2-3 — CHG-007's disposition table falsely says the CHG-006 verification placeholder was fixed

`CHG-007-business-model-v0.2.md:78` marks "P2 — CHG-006 verification placeholder" as "Fixed by this `## Verification` section". `CHG-006-business-model.md:47` still contains only `<!-- VERIFICATION-PENDING -->`; the CHG-007 verification section does not complete the CHG-006 record. The CHG-006 record remains non-compliant with RULE-011.

**Suggested correction (not applied):** change the disposition to "Open — CHG-006 still lacks executed verification" and either fill CHG-006's section from this review or record an explicit deferral with an owner and date.

### P2-4 — CHG-007's verification rows are descriptions, not re-runnable commands, and one count is wrong

Rows 2–5 (`CHG-007-business-model-v0.2.md:52-55`) describe checks as "Python 3 structural check (heredoc)" without recording the script or command, so RULE-011's "commands run" evidence is not independently reproducible. Row 5 claims "174 IDs"; a token scan of the deliverable finds 182 distinct ID tokens. The discrepancy is not explained.

**Suggested correction (not applied):** record the exact commands or attach the scripts, and correct or explain the ID count.

### P2-5 — The review index is stale for CHG-006 and CHG-007

`docs/12_reviews/README.md:6-10` lists only CHG-001 through CHG-005. It does not list `CHG-006-review.md` (untracked) or this CHG-007 review. The CHG-006 review already recorded this as a P2; CHG-007 did not close it, correctly noting that the Verifier owns `docs/12_reviews/**` but not updating the index in this report-only review.

**Suggested correction (not applied):** the review-folder owner appends CHG-006 and CHG-007 to the index after this review is accepted.

### P2-6 — NFR-009's "Time window" is the sampling window, not the retention period; §9's numeric-target inventory is incomplete

NFR-009 (`business_model.md:977`) has target `TBD-BIZ-003` with suggested retention periods of 90/180/365 days, but its "Time window" cell is "Daily job; 30-day sample" — a measurement cadence, not the retention window the contract asks for. Separately, §9's introduction (`:965`) lists only NFR-001/002/003/010/011 as carrying numeric targets, while §1 metadata (`:24`) and the table show 9 numeric-target NFRs (001–003, 006–008, 010–012). The metadata is right; the introduction is incomplete.

**Suggested correction (not applied):** make NFR-009's time-window cell state the retention period (or explicitly separate "retention period" from "measurement window"), and align §9's introduction with the 9/3 split.

### P2-7 — State transition guards are tagged as direct SRC evidence although they are derivations

For example, `Initiated → Running` (`business_model.md:581`) carries the guard `run.step_count >= 1 AND target.registered == true` and is tagged `[SRC: open_items.md#TBD-BIZ-001]`. The cited decision does not contain that guard; BR-005 states `task_definition.registry_state == "recorded" AND inputs.valid == true AND initiator.account_id != null`. The guard is a derivation, not a direct quote. Similar SRC tags appear on other transition rows.

**Suggested correction (not applied):** retag guard-bearing rows as `[DERIVED: BR-005 …]` or cite the BR that actually entails the guard; keep `[SRC:]` for the decision text that is directly quoted.

### P2-8 — BR-002 and BR-005 still combine two independently decidable obligations

BR-002 (`business_model.md:793-815`) combines access control ("only when signed in … may start or continue") with response integrity ("append an assistant message only when a model response is returned"). BR-005 (`:865-887`) combines run eligibility ("only when a task definition is recorded") with attribution/version binding ("one initiating account and one recorded task version"). The CHG-006 review raised this as a P2; CHG-007's disposition at `CHG-007-business-model-v0.2.md:76` declines to split them because splitting would add rules. That is a defensible trade-off but leaves the prior P2 open; it should not be counted as fixed.

**Suggested correction (not applied):** keep the combined cards if the product owner accepts them, but record that acceptance explicitly; otherwise narrow each statement to one obligation and move the second to a separate rule or a labelled derivation.

### P2-9 — `RunStep.read = own-only` is broader than BR-008's failed-step visibility

BR-008 (`business_model.md:937-959`) requires the failed step and the terminal outcome to be visible to the initiator. The matrix grants `RunStep.read = own-only` (`:469`), which covers every step of the owner's run, not only the failed step. FLOW-003's N6/N7 outcome views (`:246-251`) support reading the outcome, so the broader grant is plausible, but the stated BR does not by itself establish it.

**Suggested correction (not applied):** either narrow the cell to the failed step or add the outcome-view derivation (FLOW-003/BR-008) to §6.2.1 so the grant is explicit.

## Attestation

I performed a read-only review. I read the files listed above and ran Python 3 and standard shell checks: `git status`, `git log`, `git ls-files`, `git fsck` for unreachable blobs, `git diff`, `wc`, `grep`, `sed`, `shasum`, and Python scripts for table-pipe consistency, matrix cell count/vocabulary, Mermaid fence and label checks, ID family/gap/resolution checks, BR tag checks, NFR field checks, entity/ER mapping, state reachability and dead-state checks, forbidden-word scans, and registry ID comparison. I did not install anything, did not start or modify a server, and did not execute product code; no product code exists at this stage.

I did not render the 13 Mermaid diagrams. `mmdc` and `mermaid` are not installed, and no Mermaid package is present; adding one is prohibited by RULE-007 and RULE-012. The Mermaid result in this review is a static syntax and reference check only, not a rendering claim. I did not verify the external Stage 5 acceptance contract (SRC-006) from the repository because it has no repository path; CONFLICT-002 records that gap. I did not verify the v0.1 content: it is untracked, overwritten, and absent from git history, which is the basis of P1-1. I did not test a browser, runtime behavior, or any product acceptance criterion requiring a deployed workspace.

The deliverable changed during the review. All findings were re-checked against the stated 1,226-line / `260d43c0…` snapshot; if the file changes again, this review must be re-based or repeated. I wrote only `docs/12_reviews/CHG-007-review.md`. I did not modify `docs/01_product/business_model.md`, `docs/00_setup/open_items.md`, any README, or any source/config file, and I made no commit.
