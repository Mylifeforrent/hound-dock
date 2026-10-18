# High-fidelity pages — hound-dock internal agent workspace

Status: Draft  
Version: 0.1  
As-of: 2026-10-18  
Owner: Docs Agent (design artifact; authored for the high-fidelity page construction task)  
Scope: static desktop pages and state views for PG-001 to PG-012, using `design_tokens.json` and C-01 to C-17 only. No build, framework, dependency, CDN, external font, image, or network request.  
Refs: `highfi_page_map.md`, `design_tokens.json`, `component_spec.json`, `interaction_design.md` v0.1, `CHG-015-highfi-page-map.md`, `CHG-016-design-tokens.md`, `CHG-017-component-spec.md`; `TBD-INFRA-001`, `TBD-BIZ-004`, `TBD-BIZ-012`, `TBD-BIZ-013`, `TBD-BIZ-005`, `TBD-BIZ-007`, `TBD-BIZ-008`; M-01, M-05, M-06, M-08.

This is a design artifact. It is not production code and it is not the `frontend/` application. `TBD-INFRA-001` remains Open, so no stack, design tool, board ID, or handoff format is selected here.

## 1. How to open

Open any `*.html` file directly in a desktop browser. The artifact is `file://`-safe: all references are relative, there is no build step, and there is no server. The authenticated shell is desktop-only, with a floor of 960px. The adopted widths are 1440, 1280, 1080, and 960.

State views are acceptance-only. They are selected with `?state=`; no state control, review chrome, prototype stamp, or fixture switcher appears in the product interface.

`tokens.css` is generated. Do not edit it by hand:

```sh
python3 docs/03_design/highfi/tools/generate_tokens.py
```

The generator projects every `value` in `design_tokens.json` into one CSS custom property and records the source SHA-256. The shared stylesheet and the shared script reference those properties only; they contain no raw colour or font-size value.

## 2. Route table

The product route is the construction route from `interaction_design.md` §3.2. The static file is the artifact's file name. A file is one page frame; every state of that page is the same file plus one `state` parameter.

| PG | Page | Product route | Static file | Active sidebar section |
|---|---|---|---|---|
| PG-001 | Sign in | `/sign-in` | `pg-001-sign-in.html` | none — no rail |
| PG-002 | Chat | `/chat`, `/chat/:conversationRef` | `pg-002-chat.html` | Chat |
| PG-003 | Skills registry | `/skills` | `pg-003-skills.html` | Skills |
| PG-004 | Skill record | `/skills/:skillName` | `pg-004-skill-record.html` | Skills |
| PG-005 | MCP servers registry | `/mcp` | `pg-005-mcp.html` | MCP servers |
| PG-006 | MCP server record | `/mcp/:serverName` | `pg-006-mcp-record.html` | MCP servers |
| PG-007 | Tasks registry | `/tasks` | `pg-007-tasks.html` | Tasks |
| PG-008 | Task run | `/tasks/:taskName/run` | `pg-008-task-run.html` | Tasks |
| PG-009 | Run outcome | `/runs/:runReference` | `pg-009-run-outcome.html` | Tasks |
| PG-010 | Skill editor (proposed, not effective) | `/skills/new`, `/skills/:skillName/edit` | `pg-010-skill-editor.html` | Skills |
| PG-011 | MCP server editor (proposed, not effective) | `/mcp/new`, `/mcp/:serverName/edit` | `pg-011-mcp-editor.html` | MCP servers |
| PG-012 | Task definition editor (proposed, not effective) | `/tasks/new`, `/tasks/:taskName/edit` | `pg-012-task-editor.html` | Tasks |

PG-010 to PG-012 have no entry in primary navigation. They are reachable only by direct URL and resolve to the shared No Permission panel. The active sidebar section is inherited from the readable parent because the rail stays visible; no authoring destination is added.

## 3. Query contract

| Parameter | Value | Applies to | Meaning |
|---|---|---|---|
| `state` | `default`, `loading`, `empty`, `no-result`, `error`, `no-permission`, `editing`, `submitting`, `success-failure` | all pages | Acceptance state. A value the page map marks N/A is not accepted and falls back to `default`. |
| `variant` | `new` | PG-002 `empty` | New conversation with no messages. Without it, Empty is "No conversations yet". |
| `outcome` | `failure` | PG-002 `success-failure` | Send failure with "Try again"; without it, Success appends one assistant message. |
| `outcome` | `succeeded`, `failed-step`, `failed-before-step` | PG-009 `success-failure` | The three run outcomes. |
| `error` | `load`, `create`, `unconfirmed` | PG-008 `error` | Load failure, explicit run-creation failure, or lost run-start result. `load` is the default. |
| `run` | `RUN-7K2M`, `RUN-9T6B`, `RUN-3P9Q`, `RUN-5C1R`, or an unknown reference | PG-009 | Default (succeeded), running, failed after step, failed before step, or No Result. |
| `task` | `weekly-digest`, `ticket-triage`, `health-check`, or an unknown name | PG-008 | Record under test. `health-check` has no declared inputs. |
| `skill` | `summarise-thread`, `draft-brief`, `extract-actions`, or an unknown name | PG-004 | Record under test. `draft-brief` carries the proposed-metadata version label. |
| `server` | `gateway-primary`, `docs-index`, `ticket-bridge`, or an unknown name | PG-006 | Record under test. |
| `conversation` | `CNV-4F7H`, `CNV-7R3D`, `CNV-2M8X`, or an unknown reference | PG-002 | Conversation under test. An unknown reference renders the generic No Result panel. |
| `dialog` | `discard` | PG-002, PG-008 | Opens the discard dialog on load for acceptance of C-14. |

Examples:

- `pg-003-skills.html?state=empty`
- `pg-002-chat.html?state=empty&variant=new`
- `pg-002-chat.html?state=success-failure&outcome=failure`
- `pg-008-task-run.html?state=error&error=create`
- `pg-009-run-outcome.html?state=success-failure&outcome=failed-before-step&run=RUN-5C1R`
- `pg-010-skill-editor.html?state=no-permission`

## 4. The 32 boards

The page map defines 32 boards: 31 page-state boards plus one shared No Permission panel. The table below is the construction trace. Reuse states are also exposed for acceptance and are listed in §5; they do not add a board.

| # | Board | File | Query | Board source |
|---|---|---|---|---|
| 1 | PG-001 · Default | `pg-001-sign-in.html` | `?state=default` or no query | own page frame |
| 2 | PG-001 · Error | `pg-001-sign-in.html` | `?state=error` | own page frame |
| 3 | PG-001 · Editing | `pg-001-sign-in.html` | `?state=editing` | own page frame |
| 4 | PG-001 · Submitting | `pg-001-sign-in.html` | `?state=submitting` | own page frame |
| 5 | PG-001 · Success-Failure | `pg-001-sign-in.html` | `?state=success-failure` | generic denial board; success is the transition to PG-002 |
| 6 | PG-002 · Default | `pg-002-chat.html` | `?state=default` or no query | own page frame |
| 7 | PG-002 · Loading | `pg-002-chat.html` | `?state=loading` | own page frame |
| 8 | PG-002 · Empty | `pg-002-chat.html` | `?state=empty`; `?state=empty&variant=new` | own page frame, two copy variants |
| 9 | PG-002 · No Result | `pg-002-chat.html` | `?state=no-result` | own page frame |
| 10 | PG-002 · Error | `pg-002-chat.html` | `?state=error` | own page frame |
| 11 | PG-002 · Editing | `pg-002-chat.html` | `?state=editing` | own page frame |
| 12 | PG-002 · Submitting | `pg-002-chat.html` | `?state=submitting` | own page frame |
| 13 | PG-002 · Success-Failure | `pg-002-chat.html` | `?state=success-failure`; `…&outcome=failure` | own page frame, two outcomes |
| 14 | PG-003 · Empty | `pg-003-skills.html` | `?state=empty` | copy variant of the PG-007 registry frame |
| 15 | PG-005 · Empty | `pg-005-mcp.html` | `?state=empty` | copy variant of the PG-007 registry frame |
| 16 | PG-007 · Default | `pg-007-tasks.html` | `?state=default` or no query | own page frame |
| 17 | PG-007 · Loading | `pg-007-tasks.html` | `?state=loading` | own page frame |
| 18 | PG-007 · Empty | `pg-007-tasks.html` | `?state=empty` | own page frame |
| 19 | PG-007 · Error | `pg-007-tasks.html` | `?state=error` | own page frame |
| 20 | PG-008 · Default | `pg-008-task-run.html` | `?state=default` or no query | own page frame |
| 21 | PG-008 · Loading | `pg-008-task-run.html` | `?state=loading` | own page frame |
| 22 | PG-008 · No Result | `pg-008-task-run.html` | `?state=no-result` | own page frame |
| 23 | PG-008 · Error | `pg-008-task-run.html` | `?state=error&error=load`; `…&error=create`; `…&error=unconfirmed` | own page frame, three renders |
| 24 | PG-008 · Editing | `pg-008-task-run.html` | `?state=editing` | own page frame |
| 25 | PG-008 · Submitting | `pg-008-task-run.html` | `?state=submitting` | own page frame |
| 26 | PG-008 · Success-Failure | `pg-008-task-run.html` | `?state=success-failure` | creation-failure board; a created run is the transition to PG-009 |
| 27 | PG-009 · Default | `pg-009-run-outcome.html` | `?state=default` or `?run=RUN-7K2M` | own page frame |
| 28 | PG-009 · Loading | `pg-009-run-outcome.html` | `?state=loading` | own page frame |
| 29 | PG-009 · No Result | `pg-009-run-outcome.html` | `?state=no-result` or an unknown `run` | own page frame |
| 30 | PG-009 · Error | `pg-009-run-outcome.html` | `?state=error` | own page frame |
| 31 | PG-009 · Success-Failure | `pg-009-run-outcome.html` | `?state=success-failure&outcome=succeeded`; `…outcome=failed-step`; `…outcome=failed-before-step` | own page frame, three outcomes |
| 32 | PG-010, PG-011, PG-012 · No Permission | `pg-010-skill-editor.html`, `pg-011-mcp-editor.html`, `pg-012-task-editor.html` | `?state=no-permission`; `?state=default` resolves to the same panel | one shared 560px panel |

PG-004 and PG-006 have no board of their own. They are constructed entirely from the reuse map in §5.

## 5. PG × state matrix

Every cell is the `state` value appended to the row's file from §2. `← PG-nnn` names the reuse source from `highfi_page_map.md` §5. `N/A` cells carry the reason from `highfi_page_map.md` §4; they are not exposed by the page.

| PG | Default | Loading | Empty | No Result | Error | No Permission | Editing | Submitting | Success-Failure |
|---|---|---|---|---|---|---|---|---|---|
| PG-001 | `default` | N/A · static form | N/A · no collection | N/A · no reference | `error` | N/A · pre-session | `editing` | `submitting` | `success-failure`; success → PG-002 |
| PG-002 | `default` | `loading` | `empty`; `empty&variant=new` | `no-result` | `error` | `no-permission` | `editing` | `submitting` | `success-failure`; `…&outcome=failure` |
| PG-003 | `default` ← PG-007 | `loading` ← PG-007 | `empty` | N/A · no query or filter | `error` ← PG-007 | `no-permission` | N/A · no inline edit | N/A · no mutation | N/A · read-only |
| PG-004 | `default` ← PG-008 | `loading` ← PG-008 | N/A · record resolves or not | `no-result` ← PG-008 | `error` ← PG-008 | `no-permission` | N/A · read-only | N/A · no mutation | N/A · read-only |
| PG-005 | `default` ← PG-007 | `loading` ← PG-007 | `empty` | N/A · no query or filter | `error` ← PG-007 | `no-permission` | N/A · no inline edit | N/A · no mutation | N/A · read-only |
| PG-006 | `default` ← PG-008 | `loading` ← PG-008 | N/A · record resolves or not | `no-result` ← PG-008 | `error` ← PG-008 | `no-permission` | N/A · read-only | N/A · no mutation | N/A · read-only |
| PG-007 | `default` | `loading` | `empty` | N/A · no query or filter | `error` | `no-permission` | N/A · no inline edit | N/A · Run opens PG-008 | N/A · read-only |
| PG-008 | `default` | `loading` | N/A · no inputs is a field-level absence | `no-result` | `error&error=load`; `error&error=create`; `error&error=unconfirmed` | `no-permission` | `editing` | `submitting` | `success-failure`; success → PG-009 |
| PG-009 | `default`; `run=RUN-9T6B` is Running | `loading` | N/A · run invariant; rejected run shows "No step results" | `no-result` | `error` | `no-permission` | N/A · run is read-only | N/A · page submits nothing | `success-failure&outcome=succeeded`; `…failed-step`; `…failed-before-step` |
| PG-010 | `default` = shared panel | N/A · no authorized operation | N/A · no draft created | N/A · no draft exists | N/A · no validation/test/publish | `no-permission` | N/A · no form | N/A · no authoring | N/A · no version |
| PG-011 | `default` = shared panel | N/A · no authorized operation | N/A · no draft created | N/A · no draft exists | N/A · no connection test | `no-permission` | N/A · no form | N/A · no authoring | N/A · no version |
| PG-012 | `default` = shared panel | N/A · no authorized operation | N/A · no draft created | N/A · no draft exists | N/A · no validation/test/publish | `no-permission` | N/A · no form | N/A · no authoring | N/A · no version |

Reuse is visible in the artifact for acceptance. Those queries are part of the nine-state audit, not additional product states.

## 6. Behaviour inherited from the prototype and interaction design

- **Routes and references.** Conversation, skill, server, task, and run references are route parameters. No owner appears in a route or in a page.
- **Focus.** A page change moves focus to the page heading. The heading is programmatically focusable and has no visible ring; interactive controls use a 2px focus ring with a 2px offset. The skip link is the first focusable element in document order.
- **Sign in.** The form validates both fields. Two field errors add a summary above the primary action and focus the first invalid field. Submitting changes the label to "Signing in…", makes both fields read-only, announces a polite status, ignores a second activation, and enters PG-002 on success. Error keeps the sign-in name, clears the credential, shows one generic denial, and focuses the credential field.
- **Chat.** Empty text creates an inline error and no turn. A valid send adds one user turn marked "Sending" and exactly one pending assistant turn marked "Assistant is responding"; the composer and Send are locked and no assistant text is invented. Completion appends exactly one assistant message, unlocks the composer, and returns focus to it. A failure removes the pending turn, keeps the user turn, and offers "Try again" that prefills the same text.
- **Run form.** Declared inputs are data-driven. Invalid required inputs create field errors and no run. Submission locks the fields, changes Start run to "Starting run…", and shows no outcome. A created run opens PG-009; creation failure stays on PG-008 and preserves inputs. An unconfirmed start claims neither success nor failure.
- **Discard.** Leaving PG-002 with unsent text, or PG-008 with non-empty inputs, opens the only overlay in the product. It is an `alertdialog` with Stay and Discard, a Tab trap, Escape acting as Stay, and focus returning to the trigger. The working copy is "Discard unsent text?" for both pages; M-06 remains undecided.
- **No Result.** An unknown or non-owned reference renders the same generic panel. It does not disclose a title, owner, state, or step and never becomes Empty.
- **Error.** A failed read is Error with Retry and, on records, Back. It does not become Empty or a zero count. On PG-009 it keeps the last reported state, marks it "Status unavailable", and offers Retry.
- **Read-only.** There is no edit, create, publish, delete, test, allowlist, invoke, or export control. A denied capability is absent; it is not rendered disabled.
- **Live regions.** A polite region announces sign-in progress, sign-in result, chat completion, and run progress. The chat thread is not a live region.
- **Reduced motion.** The only transition is the registry-card hover lift. All animation and transition are disabled under `prefers-reduced-motion: reduce`.

## 7. Layout at the adopted widths

| Measure | 1440 | 1280 | 1080 | 960 |
|---|---|---|---|---|
| Sidebar | 272 | 272 | 272 | 272 |
| Topbar | 56 | 56 | 56 | 56 |
| Page gutter | 36 | 28 | 28 | 20 |
| Registry grid | 3 columns | 2 columns | 2 columns | 2 columns |
| Card minimum | 320 | 320 | 320 | 280 |
| Record, run, outcome split | 764 + 32 + 300 | 644 + 28 + 280 | stacked | stacked |
| Chat column | 760 | 720 | 720 | 648 |
| Sign-in panel | 420 | 420 | 420 | 420 |
| State panel | 560 | 560 | 560 | 560 |
| Control height | 36 | 36 | 36 | 36 |

At 960 the run-step table becomes a stacked per-step grid. Status stays visible; Duration and Result move to a second and third line with visible labels. The table never scrolls sideways. Below 960 is out of scope and is not designed.

## 8. Coverage, exclusions, and what is handed to Prompt E

| Item | State in this artifact | Reason / next owner |
|---|---|---|
| PG-001 to PG-009 page frames | Constructed | Effective PG set; state values in §5 |
| PG-003 and PG-005 Empty | Constructed as HF copy variants | Maps §4.4 and §4.6 |
| PG-004 and PG-006 | Constructed by reuse only | Maps §5; no page draft |
| PG-010 to PG-012 | One shared 560px No Permission panel | M-01; no authoring side is chosen |
| Admin authoring, publication, allowlisting | Not rendered | `TBD-BIZ-004` / M-01 unresolved; denied under ID §2.2; no form or disabled control |
| Owner attribution, offboarding | Not rendered | `TBD-BIZ-013` / M-05 |
| Flow-context label and flow mapping | Not rendered | M-08; pages rest on CAP-002/BR-003 and CAP-003/BR-004 |
| Discard copy | "Discard unsent text?" working label | M-06 remains `[TBD-UX]`; one string is used |
| Admin all-run read and "Initiated by you" divergence | Member own-only is rendered | M-01; Admin reading is not designed |
| Individual MCP tool names, counts, allowlist state | Withheld; a reference count only | CAP-003; ID §2.4 |
| Credential values | Never rendered; presence only | ID §2.4; AC-032/AC-033 |
| Search, filter, pagination, "load more" | Not rendered | Not in the effective IA |
| Create, edit, publish, delete, test, allowlist, invoke, export, share | Not rendered | Denied or out of scope; absence is the rule |
| Mobile, 375, tablet portrait, bottom sheet, 44px touch target | Not designed | Map §7.3 |
| Dark theme, theme switch | Not designed | Light-only token contract |
| Sign-in success as a standalone screen | Not rendered; success is the transition to PG-002 | ID §6.2 |
| Run success as a PG-008 screen | Not rendered; a created run opens PG-009 | ID §6.9 |
| Real integrations, server, endpoint, secret, timer, or run duration | Synthetic fixture values only | `TBD-BIZ-005`, `TBD-BIZ-007`, `TBD-BIZ-008` |
| Design tool, board IDs, handoff format | Not selected | `TBD-INFRA-001` still Open; phase gate remains closed |
| Frozen asset | None created or modified | No `Status: Frozen` file is touched |

The `README.md` files and change records outside `docs/03_design/highfi/` are deliberately untouched. No `frontend/` file was written; `TBD-INFRA-001` and the CHG gate remain prerequisites for that path.

## 9. Verification performed

Executed on 2026-10-18 (Asia/Shanghai) against the working tree:

| Check | Method | Result |
|---|---|---|
| Token projection | `python3 tools/generate_tokens.py` | 384 tokens projected from `design_tokens.json`; generated file unchanged on re-run |
| Script syntax | `node --check app.js` | Exit 0 |
| HTML parse | Python `HTMLParser` over all 12 pages | Balanced stacks; no parse error |
| All state × width renders | Headless Chrome 155 via CDP; 59 accepted state queries × 4 widths = 236 loads | 0 failures: correct `data-pg`/`data-state`, exactly one `h1`, no JS exception, no external request, no document or main-pane horizontal scroll |
| Interaction suite | Headless Chrome/CDP | 32 checks pass: sign-in validation/lock/transition; chat empty, pending, completion, failure, Try again; discard dialog open, Escape/Stay, focus return; run validation, lock, creation transition; rejected-before-step outcome; generic No Result; 960 table wrapping; chat/registry/split/sign-in/state-panel measures |
| Raw visual values | Regex over `components.css`, `app.js`, and the 12 pages | 0 hex, 0 `rgb()`/`rgba()`, 0 literal `font-size` |
| External dependencies | Network events plus file scan | No HTTP(S) request; no `<img>`, webfont, CDN, fetch, XHR, or manifest |
| Forbidden affordances | Page-text scan | No New task, Add server, Publish, Delete, Allowlist, Search, Filter, Sign out, Model, API key, Owner, Theme, or Edit |
| Sub-960 design | Scan and CSS review | No 375/390/768/860/780 layout; `min-width: 960px` is the desktop floor |

Screenshots were rendered at 1440, 1280, 1080, and 960 during verification. They are evidence, not part of the artifact.

## 10. File inventory

| File | Role |
|---|---|
| `README.md` | This construction map, route table, board trace, matrix, exclusions, verification |
| `tokens.css` | Generated projection of every `design_tokens.json` value; never hand-edited |
| `components.css` | Shared C-01 to C-17 styles, shell, responsive rules, focus, reduced motion |
| `app.js` | Shared state renderer, synthetic fixtures, focus, dialog, form and chat behaviour |
| `tools/generate_tokens.py` | The only writer of `tokens.css` |
| `pg-001-sign-in.html` | PG-001 page shell |
| `pg-002-chat.html` | PG-002 page shell |
| `pg-003-skills.html` | PG-003 page shell |
| `pg-004-skill-record.html` | PG-004 page shell |
| `pg-005-mcp.html` | PG-005 page shell |
| `pg-006-mcp-record.html` | PG-006 page shell |
| `pg-007-tasks.html` | PG-007 page shell |
| `pg-008-task-run.html` | PG-008 page shell |
| `pg-009-run-outcome.html` | PG-009 page shell |
| `pg-010-skill-editor.html` | PG-010 shell; shared No Permission panel |
| `pg-011-mcp-editor.html` | PG-011 shell; shared No Permission panel |
| `pg-012-task-editor.html` | PG-012 shell; shared No Permission panel |
