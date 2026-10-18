# CHG-001 — Stage 2 product requirements

Status: Reviewed
Complexity: Complex
Refs: TBD-BIZ-003, TBD-BIZ-004, TBD-BIZ-005, TBD-BIZ-006, TBD-BIZ-007, TBD-INFRA-001, TBD-INFRA-002, TBD-INFRA-003, TBD-INFRA-004, TBD-INFRA-005, TBD-INFRA-006, TBD-INFRA-007, TBD-INFRA-009, TBD-INFRA-010, TBD-INFRA-011; CONFLICT: none
Owner: Tech Lead (Docs Agent handoff)

## Plan

- **Inputs:** the three reference screens (豆包工作, DeepSeek, WorkBuddy), the user's confirmed MVP and deployment choices, and the competitive research recorded in the PRD.
- **Approach:** turn the four confirmed capabilities into a scoped PRD; defer the stack decision as the user requested; keep every unresolved choice in `open_items.md`.
- **Outputs:** `docs/01_product/prd.md`; registry updates; root README, AGENTS, and folder README updates; this change record and an independent review record.
- **Affected paths:** `docs/01_product/**`, `docs/00_setup/open_items.md`, `README.md`, `AGENTS.md`, `docs/13_changes/**`, `docs/12_reviews/**`.
- **Risks:** scope creep into a workflow engine; treating proposed metrics as commitments; accidentally selecting a stack. Mitigation: explicit non-goals, "proposed" labels, and TBD references.
- **Verification plan:** structure, link, status, ID, wording, and prohibited-artifact checks; independent Verifier review before squash merge.
- **No code:** this change creates no business code, scaffolding, manifest, lockfile, tool configuration, or command.

## Task Brief

- **Scope:** Stage 2 product definition only — PRD v0.1, registry reconciliation, and governance updates.
- **Inputs:** user request of 2026-10-18; three reference screenshots; user selections — MVP "chat + registries + manual tasks", deployment "self-hosted + local accounts", stack "decide after the PRD"; research sources listed below.
- **Outputs:** the PRD and the governance files listed in the Plan.
- **Acceptance criteria:** PRD covers the four capabilities and the confirmed MVP/deployment choices; every unresolved decision has a TBD in `open_items.md`; README, AGENTS, and rules remain consistent; links resolve; no prohibited artifact is created; independent review passes.
- **Ownership:** Tech Lead owns `README.md`, `AGENTS.md`, `docs/00_setup/**`, and `docs/13_changes/**`. The Docs Agent is dormant, so the Tech Lead authors `docs/01_product/prd.md` under the Stage 2 handoff recorded in AGENTS.md; ownership returns to the Docs Agent on activation. The Verifier owns `docs/12_reviews/**`.

## Verification

Executed 2026-10-18 (Asia/Shanghai) on branch `docs/stage-2-prd`.

| # | Check | Command (abridged) | Result |
|---|---|---|---|
| 1 | Status lines | `find . -name '*.md' -exec grep -EL '^Status: (Draft\|Reviewed\|Frozen)$' {} +` | No output — 24/24 Markdown files have a valid status (23/23 at review time; the review record adds one) |
| 2 | Relative links | Markdown link check across all Markdown files | 47 links checked, 0 broken |
| 3 | TBD registry | Extract every `TBD-*` token and look it up in `open_items.md` | 18 distinct IDs referenced, 0 missing |
| 4 | Registry totals | Count statuses and headings | 15 open, 3 resolved; BIZ 5/2 and INFRA 10/1 match the Summary table |
| 5 | Requirement IDs | Extract `FR-*` IDs from the PRD | FR-001 through FR-050, no gaps or duplicates |
| 6 | Rule integrity | `grep -c '^## RULE-'` plus field scan | 20 rules, all four required fields present |
| 7 | AGENTS length | `wc -l < AGENTS.md` | 108 lines (limit 300) |
| 8 | Prohibited artifacts | `git ls-files` scan for code, manifests, `.env*`, tool configs | No matches |
| 9 | Root layout | `ls -A` against allowed entries | Only `frontend/`, `backend/`, `docs/`, `README.md`, `AGENTS.md`, `.gitignore`, `.git` |
| 10 | Governance wording | `grep -rniE` for weak terms in README, AGENTS, and rules | No matches |
| 11 | Docs tree | Directory and README counts | 14 docs directories, 14 READMEs |

Reviewer: Verifier — **PASS**; independent review record at `docs/12_reviews/CHG-001-review.md`. Two P1 and two P2 findings were closed before merge: PRD §18 now references the registry without duplicating owner/deadline, the review record was added, deployment wording is technology-agnostic, and the Docs Agent handoff approval is recorded below.

## Dependency audit

None — no dependency, manifest, or lockfile was introduced.

## Decision and conflict log

- 2026-10-18: User provided three reference screens (豆包工作, DeepSeek, WorkBuddy) and requested research plus a similar internal product with chat, skill registry, MCP registry, and task definitions.
- 2026-10-18: User selected the MVP scope "chat + registries + manual tasks" and deployment "self-hosted + local accounts for MVP".
- 2026-10-18: User deferred the stack decision until after the PRD.
- 2026-10-18: TBD-BIZ-001 and TBD-BIZ-002 marked Resolved; TBD-BIZ-004/005/006/007 and TBD-INFRA-009/010/011 registered.
- 2026-10-18: User requested the PRD and selected the Stage 2 scope and deployment decisions; this is recorded as user approval for the Tech Lead to author `docs/01_product/prd.md` while the Docs Agent is dormant (RULE-019 handoff).
- Research sources cited in the PRD: [豆包工作 upgrade](https://www.chinaz.com/2026/0822/1772599.shtml), [豆包工作 enterprise angle](https://www.stdaily.com/web/gdxw/2026-08/25/content_569505.html), [WorkBuddy overview](https://www.codebuddy.cn/docs/workbuddy/Overview), [WorkBuddy automation](https://www.w3cschool.cn/workbuddydocs/workbuddydocs-automation-guide.html), [Dify tools](https://docs.dify.ai/en/cloud/use-dify/workspace/tools), [Dify human input](https://docs.dify.ai/zh/self-host/use-dify/nodes/human-input), [Dify event-driven workflows](https://github.com/langgenius/dify/discussions/28192), [Open WebUI tools](https://docs.openwebui.com/features/extensibility/plugin/tools/), [Open WebUI MCP](https://docs.openwebui.com/features/extensibility/mcp/), [LibreChat MCP](https://www.librechat.ai/docs/features/mcp), [n8n MCP workflow](https://n8n.io/workflows/17218-run-a-personal-assistant-for-calendar-gmail-and-utilities-with-openai-and-mcp/).
- No `CONFLICT-nnn` was found.
