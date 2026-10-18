# AGENTS.md

Status: Draft
Owner: Tech Lead
Authority: This file is the single tool-agnostic engineering-rules authority for `hound-dock`. It applies to every human or AI agent. Enforceable numbered rules live in [docs/00_setup/project_rules.md](docs/00_setup/project_rules.md); open decisions live in [docs/00_setup/open_items.md](docs/00_setup/open_items.md). Details are referenced by path only and MUST NOT be copied here as long-form rules.

## 1. Precedence and conflict handling

1. Confirmed user decisions (P1) — goal, MVP scope, and deployment recorded in [docs/01_product/prd.md](docs/01_product/prd.md); unresolved decisions remain in `open_items.md`.
2. `docs/00_setup/environment_baseline.md` (P2) — **missing; Stage 1 not started** (TBD-INFRA-004).
3. Existing repository content (P3) — governance documents and the Stage 2 PRD.
4. This file and the current task contract (P4).

- A lower-precedence instruction MUST NOT override a higher-precedence one.
- When instructions or files conflict, the agent MUST stop, record `[CONFLICT-nnn]` in `open_items.md`, cite both locations, and MUST NOT overwrite either side. See RULE-010 and RULE-014.
- No assumption may be recorded as a settled decision. A temporary assumption MUST be logged as a TBD and MUST NOT become an irreversible implementation basis.

## 2. Current state and scope

- Stage 2 — Product Definition: PRD v0.1 (Draft) at [docs/01_product/prd.md](docs/01_product/prd.md).
- Stage 0 governance documents remain `Draft` pending user sign-off. Stage 1 — Environment Baseline not started.
- `frontend/` and `backend/` contain boundary documentation only: no business code, scaffold, dependency manifest, lockfile, or tool configuration.
- Frontend stack, backend stack, data store, dependency tooling, Git remote/CI, and verified commands are unconfirmed TBDs. See `open_items.md`.
- Implementation is not authorized until the PRD is accepted and the stack is confirmed. This stage MUST NOT create business code, scaffolding, manifests, or tool configuration.

## 3. Ownership boundaries

| Path | Owner | MAY | MUST NOT |
|---|---|---|---|
| `frontend/**` | Frontend Agent | Frontend application assets after activation | Backend logic, secrets, PII, governance docs, manifests before TBD-INFRA-001 |
| `backend/**` | Backend Agent | Backend application assets after activation | Frontend assets, secrets, PII, governance docs, manifests before TBD-INFRA-002 |
| `docs/01_product/**` … `docs/11_quality/**` | Docs Agent | Product, architecture, design, data, API, development, testing, security, deployment, operations, quality docs | Source code, root governance, change records, review records |
| `docs/12_reviews/**` | Verifier | Independent review and verification records | Any source or docs edit outside `docs/12_reviews/**` |
| `README.md`, `AGENTS.md`, `.gitignore`, `docs/00_setup/**`, `docs/13_changes/**` | Tech Lead | Governance, numbered rules, open-item registry, change records | Business code or assets owned by another role |

- Path ownership is mutually exclusive. A cross-boundary change MUST be recorded as an explicit handoff with both owners' acceptance in the change record (RULE-019).
- Stage 0 bootstrap exception: the Tech Lead creates `frontend/README.md` and `backend/README.md` as boundary documents; ownership transfers when those roles activate.
- Stage 2 handoff: the Docs Agent is dormant; the Tech Lead authored `docs/01_product/prd.md` under `CHG-001`. Ownership returns to the Docs Agent when that role activates.

## 4. Agent Team roster

| Role | Inputs | Output paths | Acceptance criteria | Exclusive ownership |
|---|---|---|---|---|
| **Tech Lead** (active) | Confirmed P1; P2 baseline; `open_items.md`; change-record evidence | `README.md`, `AGENTS.md`, `.gitignore`, `docs/00_setup/**`, `docs/13_changes/**` | All Stage close-out checks pass; registry current; no contradiction across README, AGENTS, rules; no fabricated decisions | Root governance, `00_setup`, `13_changes` |
| **Frontend Agent** (dormant) | Approved Task Brief; `docs/03_design/**`; `docs/05_api/**`; `docs/08_security/**` constraints; commands from `docs/06_development/**` | `frontend/**` | Build, typecheck, lint, and test commands exit 0; no secrets/PII; dependency audit for every dependency; evidence handed to Tech Lead | `frontend/**` |
| **Backend Agent** (dormant) | Approved Task Brief; `docs/05_api/**`; `docs/04_data/**`; `docs/08_security/**` constraints; commands from `docs/06_development/**` | `backend/**` | Test suite exits 0; migrations reviewed; no secrets/PII; dependency audit for every dependency; evidence handed to Tech Lead | `backend/**` |
| **Docs Agent** (dormant) | Approved decisions; change records; executed verification evidence | `docs/01_product/**` … `docs/11_quality/**` | Every doc has a valid `Status:` line; links resolve; TBDs only referenced, never redefined; no rules copied out of context | `docs/01_product` … `docs/11_quality` |
| **Verifier** (dormant) | Change record, full diff, recorded commands | `docs/12_reviews/CHG-nnn-review.md` | Independent re-run of verification; pass/fail per acceptance criterion; no source modification | `docs/12_reviews/**` |

- Dormant roles MUST NOT write until the relevant TBDs are resolved and recorded.
- Every role has a defined output path and acceptance criteria; no role may write outside its exclusive ownership.

## 5. Secrets and AI data red lines

- `.env` is **never committed**. `.env.example` MAY exist and contains key names and comments only — no values.
- No secrets, production data, or user PII may be sent to any AI tool. Datasets MUST be synthetic or redacted, and data classification MUST be confirmed under TBD-BIZ-003 before sharing.
- Frozen assets are never modified silently.
- AI-generated code MUST NOT be committed without executed verification.
- A third-party dependency MUST NOT be introduced without an audit and recorded rationale.
- Enforcement: RULE-008, RULE-009, RULE-010, RULE-011, RULE-012.

## 6. Workflow gates

A task is **Complex** when any of the following is true:

- it touches two or more ownership areas;
- it changes more than 5 files;
- it adds or upgrades a dependency;
- it changes a frozen asset;
- it changes root layout, this file, or `project_rules.md`.

Complex tasks MUST start with a **Plan** (approach, affected paths, risks, verification plan) and then proceed from a **Task Brief** (scope, inputs, outputs, acceptance criteria, ownership). Both are committed in `docs/13_changes/CHG-nnn-<slug>.md` before implementation. Simple tasks MUST have a change record at completion.

Order: Plan → Task Brief → implement → execute verification → record evidence → independent review → merge. See RULE-005, RULE-018, RULE-020.

## 7. Change, conflict, and frozen assets

- Change records are the only traceability unit; one `CHG-nnn` per change, sequential, never reused. Format: [docs/13_changes/README.md](docs/13_changes/README.md).
- A frozen asset is any file with `Status: Frozen`. Unfreezing requires explicit user approval recorded in the owning folder README and the change record. Silent modification is prohibited (RULE-010).
- TBD and CONFLICT entries are created only in `open_items.md`; they are append-only and are never deleted. See RULE-014.
- Documentation statuses: `Draft`, `Reviewed`, `Frozen`. See RULE-013.

## 8. Environment and dependency management

- Dependencies and virtual environments are managed by the chosen language's standard tooling (for Python, `uv`; TBD if no language is chosen).
- No project dependency may be installed globally. Lockfiles are committed once a manifest exists; virtual environments, caches, and build outputs are never committed.
- No install, run, build, or test command may be stated until the Stage 1 baseline is verified and the command is recorded in `docs/06_development/`. See RULE-015 and RULE-017.
- Stage 1 baseline is missing: no toolchain claim in this repository is verified yet.

## 9. Prohibitions

- MUST NOT create tool-specific instruction files (`CLAUDE.md`, `.cursorrules`, `.cursor/**`, `.github/copilot-instructions.md`, or equivalents). `AGENTS.md` is the sole authority (RULE-016).
- MUST NOT create business code, frontend/backend scaffolding, dependency manifests, lockfiles, placeholder configuration files, or `.env.example` values at this stage.
- MUST NOT invent start/build/test commands or claim an environment is verified.
- MUST NOT create business files at the repository root or new top-level entries without a rule amendment (RULE-002).
- MUST NOT modify global or user-level configuration, or write outside the project.
- MUST NOT overwrite P3 content or resolve a conflict by force.

## 10. References

| Topic | Path |
|---|---|
| Numbered rules | [docs/00_setup/project_rules.md](docs/00_setup/project_rules.md) |
| Open decisions / conflicts | [docs/00_setup/open_items.md](docs/00_setup/open_items.md) |
| Setup stage contract | [docs/00_setup/README.md](docs/00_setup/README.md) |
| Change record contract | [docs/13_changes/README.md](docs/13_changes/README.md) |
| Repository navigation | [README.md](README.md) |
| Environment baseline (missing) | `docs/00_setup/environment_baseline.md` |
