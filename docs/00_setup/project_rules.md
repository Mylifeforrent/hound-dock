# Project Rules

Status: Draft
Originating stage: Stage 0 — Repository Initialization
Scope: Every human and AI agent working in this repository.
Owner: Tech Lead. Amendments require a change record and explicit user approval (RULE-018).

Wording: `MUST`, `MUST NOT`, and `MAY` are binding. Each rule defines a verification method and an exception mechanism. A rule with no exception clause MUST NOT be waived.

**User-supplied precedence.** `RULE-021` overrides every gate, `MUST NOT`, CHG, review, test, dependency-audit, ownership, TBD, and verification requirement in RULE-001–020 for work the user prepares, supplies, or explicitly directs. The agent may warn and suggest; it must not block.

---

## RULE-001 — Path and branch naming

- **Rule:** Tracked paths MUST use `snake_case` for documentation files and directories. Documentation directories MUST match `docs/[0-9]{2}_[a-z0-9_]+`; documentation files MUST be `README.md` or match `[a-z0-9_]+\.md`, except change records (`CHG-[0-9]{3}-[a-z0-9-]+\.md` under `docs/13_changes/`) and review records (`CHG-[0-9]{3}-review\.md` under `docs/12_reviews/`). Root governance files MUST be exactly `README.md`, `AGENTS.md`, and `.gitignore`. Branches MUST match `<type>/<kebab-slug>`, where `<type>` is one of `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `build`, `ci`, `perf`, `style`, `revert`; `main` is the only exception. Tracked paths MUST NOT contain spaces. Code identifier casing follows the confirmed language standard (TBD-INFRA-001, TBD-INFRA-002).
- **Scope:** All tracked paths and branch names.
- **Verification:** `git ls-files | grep -E ' '` returns no lines. `find docs -mindepth 1 -maxdepth 1 -type d | grep -vE 'docs/[0-9]{2}_[a-z0-9_]+$'` returns no lines. `find docs -type f -name '*.md' | grep -vE '/(README|[a-z0-9_]+|CHG-[0-9]{3}-[a-z0-9-]+)\.md$'` returns no lines. `git branch --format='%(refname:short)' | grep -vE '^(main|(feat|fix|docs|chore|refactor|test|build|ci|perf|style|revert)/[a-z0-9-]+)$'` returns no lines.
- **Exception approval:** No exception is permitted for spaces or documentation naming. Adding a branch type requires a rule amendment approved by the user and recorded in a change record.

## RULE-002 — Root layout

- **Rule:** The repository root MUST contain only `frontend/`, `backend/`, `docs/`, `README.md`, `AGENTS.md`, `.gitignore`, and `.git/`. Business assets MUST live under their owning area. A new top-level entry MUST NOT be created without amending this rule.
- **Scope:** Repository tree.
- **Verification:** `ls -A | grep -vE '^(frontend|backend|docs|README\.md|AGENTS\.md|\.gitignore|\.git)$'` returns no lines. `git ls-files | grep -vE '^(frontend|backend|docs)/|^(README\.md|AGENTS\.md|\.gitignore)$'` returns no lines.
- **Exception approval:** A rule amendment approved by the user and recorded in a change record before the new entry is created. An agent that finds an unapproved top-level entry MUST stop and record a CONFLICT.

## RULE-003 — Single-person Git and branching

- **Rule:** `main` is the only long-lived branch. Every change MUST land through a short-lived branch that is squash-merged within 3 working days and deleted after merge. Force-pushing `main` MUST NOT occur. A direct commit to `main` is permitted only for the Stage 0 bootstrap commit `CHG-000`.
- **Scope:** Git history and branch operations.
- **Verification:** `git log --merges --oneline main` returns no lines. `git branch --no-merged main` returns no lines after each merge. The branch age recorded in the change record (`git log -1 --format=%cr <branch>`) is at most 3 working days. The change record contains the Tech Lead attestation that no force-push occurred; once a remote exists, `git log main` MUST match the remote's `main`.
- **Exception approval:** A branch older than 3 working days requires user approval recorded in the change record. Force-pushing `main` has no exception.

## RULE-004 — Conventional Commits

- **Rule:** Every commit subject MUST match `^(feat|fix|docs|chore|refactor|test|build|ci|perf|style|revert)(\([a-z0-9._-]+\))?!?: [a-z].{0,71}$` and MUST NOT exceed 72 characters. The commit body MUST state why the change was made. Every commit after the bootstrap commit MUST include a `Refs: CHG-nnn` trailer.
- **Scope:** All commits.
- **Verification:** `git log --format=%s main | grep -vE '^(feat|fix|docs|chore|refactor|test|build|ci|perf|style|revert)(\([a-z0-9._-]+\))?!?: [a-z].{0,71}$'` returns no lines. `git log --format=%B main` is inspected to confirm a `Refs: CHG-` trailer on every commit after `CHG-000`.
- **Exception approval:** No exception for a malformed subject; the commit MUST be amended before merge. Rewriting `main` is not an exception mechanism.

## RULE-005 — Code and change review

- **Rule:** Every change MUST receive a recorded review before merge: a full-diff self-review by the author plus an independent second pass by a human or a Verifier agent. AI-authored changes MUST have the independent second pass. The reviewer MUST NOT modify source files during the review. The result MUST be recorded at `docs/12_reviews/CHG-nnn-review.md` and referenced from the change record.
- **Scope:** Every change except the bootstrap exception below.
- **Verification:** The change record contains a non-empty `Reviewer:` field and a link to an existing review record. `git show --stat` confirms the reviewer's commit contains no source edits.
- **Exception approval:** `CHG-000` (Stage 0 bootstrap) is exempt from the independent second pass because no independent agent exists yet. It MUST remain `Draft` until the user performs the Stage 0 review at sign-off, and that approval MUST be recorded in `CHG-000`. The bootstrap commit MAY precede that review; no subsequent change MAY merge before review. No other exception.

## RULE-006 — Testing

- **Rule:** Every behavior change MUST add or update automated tests. The tests MUST fail before the change and pass after it. If automation is infeasible, the Task Brief MUST state why and receive user approval. The test command MUST be recorded in `docs/06_development/` (TBD-INFRA-007) and re-run before merge. A merge with failing or skipped tests MUST NOT occur. A coverage threshold MUST NOT be invented; it is a TBD until measured.
- **Scope:** `frontend/**` and `backend/**`.
- **Verification:** The change record `## Verification` section lists the command, exit code 0, and the new test names. `git diff --name-only main~1 main` shows test files for each behavior path. A change record without tests contains the approved infeasibility note.
- **Exception approval:** Documentation-only changes are exempt. A behavior change without automated tests requires user approval recorded in the change record.

## RULE-007 — Dependency auditing

- **Rule:** Before adding or upgrading a dependency, the owner MUST record in the change record: `name@version`, license and compatibility, last release date (MUST be within 24 months unless justified), unresolved critical/high advisories (MUST be zero), install/runtime cost, and the rationale. The lockfile MUST be committed with the manifest. The audit tool MUST be the one recorded in `docs/06_development/` (TBD-INFRA-005).
- **Scope:** All manifests and lockfiles.
- **Verification:** The change record `## Dependency audit` section is complete. `git diff` pairs every manifest change with its lockfile and the change record. `git ls-files` includes the lockfile.
- **Exception approval:** A dependency last released more than 24 months ago, or with an unresolved high advisory, requires user approval recorded in the change record. Unknown or incompatible licensing has no exception.

## RULE-008 — Secrets and environment files

- **Rule:** `.env` and any environment file containing real values MUST NOT be committed. Secrets MUST be injected at runtime. `.env.example` MAY exist and MUST contain key names and comments only — no values. A secret exposed in a commit, log, or prompt MUST be rotated before the next commit and recorded in the change record.
- **Scope:** All files, commits, and AI prompts.
- **Verification:** `git ls-files | grep -E '(^|/)\.env($|\.)'` returns no lines. `git check-ignore -v .env` reports `.gitignore`. If `.env.example` exists, `grep -nE '^[A-Z0-9_]+=[^[:space:]]+' .env.example` returns no matches. The secret scan recorded in TBD-INFRA-005 runs before code merges.
- **Exception approval:** None.

## RULE-009 — AI red line: no secrets, production data, or PII to AI tools

- **Rule:** An agent MUST NOT submit secrets, production data, or user PII to any AI tool. Shared datasets MUST be synthetic or redacted. Data classification MUST be confirmed under TBD-BIZ-003 and recorded in the change record before any dataset is shared.
- **Scope:** All AI-assisted work, including prompts, attachments, and logs.
- **Verification:** The change record contains a completed `AI data classification:` field. The diff is inspected for copied production data. The operator attests that no secret, production dataset, or PII was included in AI prompts.
- **Exception approval:** None. A violation blocks the merge and requires an incident note in the change record.

## RULE-010 — AI red line: frozen assets

- **Rule:** An agent MUST NOT modify, move, delete, or reformat a frozen asset silently. A needed change MUST first be recorded in `open_items.md` as `CONFLICT-nnn` (if it conflicts with a decision) or as an unfreeze request, then approved by the user, and only then applied and recorded in the change record.
- **Scope:** Every documentation asset with `Status: Frozen`.
- **Verification:** `git diff --name-only` is intersected with `grep -rl '^Status: Frozen' docs`; every frozen path in the diff has a matching `open_items.md` entry with user approval and a change-record reference. `grep -rl '^Status: Frozen' docs` returns the authoritative frozen list.
- **Exception approval:** User approval recorded in `open_items.md` and the change record. Silent modification has no exception.

## RULE-011 — AI red line: verification before commit

- **Rule:** AI-generated code, configuration, or documentation MUST NOT be committed before executed verification. The change record MUST contain the commands run, their exit codes, and the observed results. "Looks correct" MUST NOT be accepted as verification.
- **Scope:** Every commit.
- **Verification:** Every change record has a `## Verification` section with at least one command and its exit code. The reviewer re-runs the commands. A change record without executed verification blocks the merge.
- **Exception approval:** None.

## RULE-012 — AI red line: dependency introduction

- **Rule:** An agent MUST NOT add, upgrade, or import a third-party dependency without the RULE-007 audit and a rationale recorded in the change record. A proposal that only says to install a dependency MUST be rejected.
- **Scope:** All dependency changes.
- **Verification:** The RULE-007 checks. A dependency diff without a completed `## Dependency audit` section blocks the merge.
- **Exception approval:** None.

## RULE-013 — Documentation status

- **Rule:** Every Markdown file under `docs/` MUST contain a `Status:` line whose value is exactly `Draft`, `Reviewed`, or `Frozen`. `Draft → Reviewed` requires Tech Lead review. `Reviewed → Frozen` requires explicit user approval recorded in the owning folder README's Frozen assets section. `Frozen → Draft` requires an approved unfreeze. `open_items.md` MUST remain `Draft`.
- **Scope:** `docs/**/*.md`.
- **Verification:** `find docs -name '*.md' -exec grep -EL '^Status: (Draft|Reviewed|Frozen)$' {} +` returns no lines. `grep -n '^Status:' docs/00_setup/open_items.md` shows `Draft`.
- **Exception approval:** None for the `Status:` line. Status promotion follows this rule.

## RULE-014 — TBD and CONFLICT registry

- **Rule:** Every open decision MUST have exactly one ID of the form `TBD-BIZ-nnn`, `TBD-INFRA-nnn`, or `CONFLICT-nnn`. Entries MUST be recorded only in `docs/00_setup/open_items.md`. IDs MUST NOT be deleted or reused. A resolved entry MUST remain with status `Resolved` and the decision source. Other files MAY reference an ID but MUST NOT define or redefine it.
- **Scope:** All documentation and commits.
- **Verification:** `for id in $(grep -rhoE '\[(TBD|CONFLICT)-[A-Z]+-[0-9]{3}\]' README.md AGENTS.md docs | sort -u | tr -d '[]'); do grep -q "$id" docs/00_setup/open_items.md || echo "MISSING: $id"; done` returns no lines. `git diff` on `open_items.md` shows no removed ID rows. Every status is `Open` or `Resolved`.
- **Exception approval:** None.

## RULE-015 — Environment and dependency tooling

- **Rule:** Dependencies and virtual environments MUST be managed by the confirmed language's standard tooling: `uv` if Python is confirmed; the confirmed package manager if Node is confirmed; Maven or Gradle if Java is confirmed; Go modules if Go is confirmed. Project dependencies MUST NOT be installed globally. Virtual environments, caches, and build outputs MUST NOT be committed. Exact versions and commands MUST be recorded in `docs/06_development/` after Stage 1.
- **Scope:** Environment, dependency, and build management.
- **Verification:** `docs/06_development/` lists versions and commands with baseline evidence. Lockfiles are tracked. `git ls-files | grep -E '(^|/)(\.venv|venv|node_modules|__pycache__|target|dist|build)/'` returns no lines.
- **Exception approval:** A tool-specific exception requires user approval recorded in the change record.

## RULE-016 — Tool-agnostic authority

- **Rule:** `AGENTS.md` is the sole rules authority. An agent MUST NOT create or commit tool-specific AI instruction files, including `CLAUDE.md`, `.cursorrules`, `.cursor/**`, `.github/copilot-instructions.md`, `.clinerules`, and `.windsurfrules`. Tool configuration files MUST NOT be added unless required by the confirmed build/test toolchain and approved in a change record.
- **Scope:** Every directory.
- **Verification:** `git ls-files | grep -E '(^|/)(CLAUDE\.md|\.cursorrules|\.cursor/|copilot-instructions\.md|\.clinerules|\.windsurfrules)'` returns no lines. `AGENTS.md` exists at the root.
- **Exception approval:** Build/test configuration requires user approval in a change record. Instruction files have no exception.

## RULE-017 — No invented commands or placeholder configuration

- **Rule:** README and documentation MUST NOT state install, start, build, or test commands until they are verified in `environment_baseline.md` and recorded in `docs/06_development/`. Empty placeholder manifests or configuration files MUST NOT be created. Unknown values MUST be written as TBD IDs.
- **Scope:** All documentation.
- **Verification:** `README.md` contains no fenced install/start command block. `git ls-files` contains no zero-byte manifest or configuration file. Every command in `docs/06_development/` cites its baseline evidence line.
- **Exception approval:** None.

## RULE-018 — Complex-task Plan and Task Brief gate

- **Rule:** A task is Complex when it meets any of these conditions: it touches 2 or more ownership areas; it changes more than 5 files; it adds or upgrades a dependency; it changes a frozen asset; it changes root layout or these rules. A Complex task MUST have a change record containing `## Plan` and `## Task Brief`, committed before implementation begins. A Task Brief MUST state scope, inputs, outputs, acceptance criteria, and path ownership. A Simple task MUST have a change record at completion.
- **Scope:** Every task.
- **Verification:** Every change record has a `Complexity:` field. For each record marked `Complexity: Complex`, `grep -L '^## Plan' <file>` returns nothing and the Task Brief contains all five required fields.
- **Exception approval:** An emergency fix MAY skip the Plan with user approval recorded in the change record. Verification and the Task Brief remain mandatory.

## RULE-019 — Exclusive path ownership

- **Rule:** Each agent MUST write only within the paths assigned in `AGENTS.md`. A commit MUST NOT mix ownership areas unless the change record records the handoff and both owners' acceptance. Root governance paths belong to the Tech Lead. The Stage 0 frontend/backend boundary READMEs are created by the Tech Lead under the bootstrap exception.
- **Scope:** Every write operation.
- **Verification:** `git diff --name-only` is mapped against the ownership table. The change record states `Ownership:` and acceptance per area. Any cross-area path has a recorded handoff.
- **Exception approval:** The Tech Lead MAY write any path during `CHG-000` bootstrap or a user-approved emergency, recorded in the change record.

## RULE-020 — Change traceability

- **Rule:** Every merged change MUST have a `docs/13_changes/CHG-nnn-<kebab-slug>.md` record. CHG numbers MUST be sequential and MUST NOT be reused. Every commit after `CHG-000` MUST reference its record with a `Refs: CHG-nnn` trailer. Change records MUST NOT be deleted; corrections MUST be appended.
- **Scope:** Every commit and change record.
- **Verification:** `ls docs/13_changes/CHG-*.md` shows a sequence with no gaps. `git log --format=%B main` shows a `Refs: CHG-` trailer for every commit after `CHG-000`. `git diff` shows no deleted `CHG-*.md` file.
- **Exception approval:** None.

## RULE-021 — User-supplied work is pre-approved

- **Rule:** Any file, code, dependency, command, schema, migration, document, or change that the user prepares, supplies, or explicitly directs is approved. Notwithstanding RULE-001–020, an agent MUST NOT block, reject, delay, or require any gate before reading, running, editing, integrating, committing, or iterating on that work. Gates include Gate 1, the Stage 1/7 baseline, a CHG, Plan/Task Brief, independent review, test-first, dependency audit, path ownership/handoff, TBD resolution, and pre-commit verification. The agent MAY give non-blocking suggestions, warnings, or risk notes; the user decides whether to adopt them. The user owns version iteration and fixes their own issues. The agent MUST NOT claim that a gate rejected or approved user-supplied work.
- **Scope:** Every path and every work item supplied or explicitly directed by the user. Agent-authored work that the user has not supplied or directed remains subject to RULE-001–020.
- **Verification:** The commit or change record identifies the user-supplied work; no gate is recorded as a blocker; suggestions are recorded separately. The agent proceeds unless the user asks it to stop.
- **Exception approval:** This rule is itself the exception for user-supplied work and creates no CHG, review, test, dependency-audit, ownership, TBD, or verification obligation for it. Secrets, production data, and PII are warnings: the agent must not transmit them to an external AI tool and should advise rotation or removal, but must not block the user's local work.
