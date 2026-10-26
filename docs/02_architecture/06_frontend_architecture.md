# Frontend architecture — technical supplement

Status: Draft
Version: 0.1
As-of: 2026-10-20
Owner: Frontend Agent (dormant); authored under user direction (CHG-028)
Stack authority: `TBD-INFRA-001` Resolved (React 19 + TypeScript 5 + Vite 7, CHG-019); exact pins and commands remain `TBD-INFRA-005/007`
Visual authority (not this file): [../03_design/design_tokens.json](../03_design/design_tokens.json) · [../03_design/component_spec.json](../03_design/component_spec.json) · [../03_design/highfi/](../03_design/highfi/)
Change record: [../13_changes/CHG-028-architecture-supplements.md](../13_changes/CHG-028-architecture-supplements.md)
Companion documents: [architecture.md](architecture.md) · [07_backend_technical_design.md](07_backend_technical_design.md) · [08_frontend_backend_boundary.md](08_frontend_backend_boundary.md)

## 1. Purpose and authority

This file is the single technical entry point for the production frontend. It translates the resolved stack decision and the existing design artifacts into an implementable client architecture. It introduces no identifier: every `PG`, `API`, `MOD`, `ERR`, `STATE`, and `BR` reference below is defined elsewhere and cited as-is.

It is not visual authority. Visual values come from `design_tokens.json` and `component_spec.json` (C-01–C-17); page and state composition comes from `highfi/` and `highfi_page_map.md`; interaction rules come from `interaction_design.md`. This file owns only the technical shape of the client.

## 2. Resolved stack (by reference)

- React 19 + TypeScript 5 + Vite 7, client-only SPA, no SSR and no server runtime (`TBD-INFRA-001` Resolved; CHG-019).
- Routing: React Router in declarative mode; test direction: Vitest + React Testing Library + MSW (`TBD-INFRA-001` resolution source).
- Exact versions, the Node toolchain, lockfile policy, and every command remain `TBD-INFRA-005/007`; hosting/CI is `TBD-INFRA-006`.
- No UI kit and no Tailwind: C-01–C-17 are built from source against the token contract (CHG-019 downgrade note).
- No component, hook, or helper is copied from `docs/03_design/prototype/`; the prototype is an interaction reference only (AGENTS §7).

## 3. Application shape

A single static deployable (one `index.html` + hashed assets) served without a Node runtime. The build output is static; hosting/CDN choice is `TBD-INFRA-006` and is not designed here.

### 3.1 Route model

Routes mirror the page map one-to-one; business keys are route parameters, never query strings the server would have to accept (the contract has no list filtering, API §10).

| Route pattern | Page | Effective states |
|---|---|---|
| `/sign-in` | PG-001 | anonymous entry; any authenticated visit redirects here when no session |
| `/chat`, `/chat/:conversationRef` | PG-002 | effective |
| `/skills`, `/skills/:skillName` | PG-003, PG-004 | effective, read-only |
| `/mcp`, `/mcp/:serverName` | PG-005, PG-006 | effective, read-only |
| `/tasks`, `/tasks/:taskName/run` | PG-007, PG-008 | effective; run entry on PG-008 |
| `/runs/:runReference` | PG-009 | effective |
| `/skills/new`, `/skills/:skillName/edit` | PG-010 | shared No Permission panel only |
| `/mcp/new`, `/mcp/:serverName/edit` | PG-011 | shared No Permission panel only |
| `/tasks/new`, `/tasks/:taskName/edit` | PG-012 | shared No Permission panel only |

Route guards do not decide authorization: they only keep the last server answer. An unauthenticated visit renders PG-001; PG-010–012 render the shared No Permission panel unconditionally (the §1 divergence is unresolved; no editor is rendered). A route never renders a denied capability as a disabled control — absence is the denial.

### 3.2 State architecture

- **Server state** (conversations, messages, registries, runs, steps) is fetched per route through the typed API client and held in a per-page cache; no cross-page global store is required by any effective flow. A library, if ever introduced, is a dependency-audited change.
- **Client-only state**: the composer's unsent text (`Editing`), the states review control, and transient `Submitting` locks. Unsent text is not persisted; leaving with unsent text opens the single discard confirmation dialog (FLOW-002; §5.3 of the interaction design).
- **Session knowledge**: the client knows only "a session exists" (last sign-in or last successful authenticated response). It never sees or stores a token; the cookie is `HttpOnly` and invisible to JS.

## 4. API client boundary

One typed client module wraps every server call. It is the only code allowed to construct a request; components never call `fetch` directly.

- **Surface**: exactly `API-001`–`API-015` (api_interface_spec.md §5). No other path exists; a denied matrix column has no endpoint, and the client must not fabricate one.
- **Session transport**: cookies only. The client sets no `Authorization`, `X-Account-Id`, or `X-Role` header and ignores them if present.
- **Idempotency**: `API-002`, `API-005`, `API-006`, `API-013` carry a client-generated `Idempotency-Key` (UUID) per logical submission, retained until the outcome is confirmed; after `50302` the same key is reused or the state is re-read — never a blind retry.
- **Reply pending**: `API-006` returning `202` means the turn is pending; the client keeps the `Assistant is responding` state and re-reads per the interaction design's polling rule. No streaming transport is used or expected.
- **Error decoding**: the envelope `{"error":{"code","class","message","fields"?,"outcome"?}}` is decoded into one of ERR-01…ERR-07 or CONTROL and mapped to the nine states per architecture §8.4. `40102` ends the client session and routes to PG-001; `40301` and `40401` render No Result / No Permission without distinction attempts; `fields` (ERR-01 only) feeds inline field errors, never echoing the submitted value.
- **Non-goals**: no retry logic beyond the idempotency rule, no client-side authorization, no owner/credential/tool-name display anywhere, no assumed response fields outside the contract.

## 5. Rendering and accessibility obligations

- Tokens only: `primitive → semantic → component`; no raw hex, `rgb()/rgba()`, or literal `font-size` in component code; `tokens.css` is generated and never hand-edited.
- Layout floor 960px; light theme only; no mobile rules, no theme switch.
- Accessibility: skip link, focusable main, 2px visible focus ring, focus moved to the page heading on route change, polite live regions for async state changes, `prefers-reduced-motion` support; WCAG 2.2 AA targets (`NFR-011`) are audit-verified design targets (CHG-026).
- Prototype-only affordances (the States review control, hash-route inspection) are not product features and are not implemented in `frontend/`.

## 6. Testing direction

Vitest + React Testing Library with MSW for contract-shaped mocks. Tests target: the API client's envelope decoding and nine-state mapping, route guards' server-answer-only behavior, composer state machine, and token-based rendering. No coverage threshold exists until measured (`TBD-INFRA-007`); no command is verified yet.

## 7. Non-goals

No mobile or sub-960 layout; no dark theme; no search/filter/pager/load-more; no create/edit/publish/delete/test/allowlist/invoke/export/share controls; no account menu, avatar, or owner display; no credential values, tool names, step parameters, or audit surface; no "coming soon" disabled controls.
