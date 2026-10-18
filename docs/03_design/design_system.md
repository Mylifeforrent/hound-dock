# Design system — hound-dock prototype

Status: Draft
Originating stage: Stage 4 — Design
Owner: Tech Lead (Docs Agent handoff; recorded in CHG-005)
Last updated: 2026-10-18
Refs: TBD-BIZ-003, TBD-BIZ-004, TBD-BIZ-007, TBD-INFRA-001, TBD-INFRA-009
Scope: visual language, layout, design tokens, and component rules for the throwaway prototype under `docs/03_design/prototype/`.

## 1. Purpose and status

This document is the design reference for the clickable prototype. It defines the visual direction and the token architecture so that later design and implementation work can reuse named roles instead of one-off values.

It is **not** a production implementation contract and does **not** select a frontend stack. TBD-INFRA-001 remains open, and the prototype MUST NOT be promoted to `frontend/` unchanged. The prototype remains a throwaway design artifact with synthetic data only.

The token source of truth is the `:root` token block in `docs/03_design/prototype/styles.css`. This document explains and owes evidence to that source; if the two diverge, the CSS is the working artifact and this document MUST be corrected in the same change. The dark mapping described below remains reference-only; the current prototype implements the light theme with a near-white rail and a blue action accent.

**Status note (2026-10-18, CHG-008; palette CHG-009).** The interaction design v0.1 governs the prototype's information architecture and page states. This document remains the presentation-layer reference for its light semantic tokens, local type stacks, spacing, components, and accessibility evidence. The selected palette is **Porcelain Blue**: a light, near-white rail, cool porcelain surfaces, ink text, and a single blue action accent. The current prototype is light-only and implements PG-001 to PG-009 plus direct-URL-only No Permission panels for PG-010 to PG-012. Where §4 to §8 still describe the old prototype inventory — registry toolbars, Manage, Runs, Audit, Usage, Settings, the run-context rail, the dark-theme toggle, and the old eight-view mapping — those descriptions are **reference-only** and are not part of the effective prototype.

## 2. Direction

**Quiet console** — editorial precision with workspace-first density.

The interface should feel like a calm internal instrument: cool porcelain surfaces, a near-white rail separated by a hairline, a single blue accent for action, and amber/red reserved for attention. The chat is the daily home; the registries and run surfaces are scannable control surfaces, not marketing pages.

### Principles

1. **Chat is the home.** The shell recedes; the conversation and composer own the viewport.
2. **Scan before read.** Recorded state, recorded health, and the primary action are visible on the card without opening a detail panel.
3. **One accent, earned attention.** Blue is action and confirmation; amber is a warning or an unresolved decision; red is failure or a blocked capability.
4. **Type carries hierarchy.** Fewer boxes, fewer rules, more deliberate size, weight, and spacing. Serif is reserved for brand, page titles, card titles, and empty states.
5. **Tokens, not one-offs.** Components reference semantic or component tokens; raw values live only in the primitive layer.
6. **Accessible by default.** Contrast, focus, keyboard operation, dialog semantics, reduced motion, and touch targets are part of the component definition.
7. **Prototype honesty.** Synthetic fixtures only; no screen implies a live model, MCP connection, or real identity.

## 3. Token architecture

The CSS is layered so that themes and components do not depend on raw values:

| Layer | Purpose | Example | Location |
|---|---|---|---|
| **1. Primitives** | Raw ramps and scales. Never used by components directly. | `--paper-2`, `--accent-2`, `--space-4`, `--text-base` | `:root` |
| **2. Semantic roles** | Theme-aware meaning. Components use these. | `--canvas`, `--surface`, `--text-primary`, `--border`, `--accent` | `:root` (light; dark reference only) |
| **3. Component tokens** | Stable knobs for a component family. | `--control-h`, `--card-pad`, `--panel-radius`, `--card-radius` | semantic blocks |

Rules:

- A component rule MUST use a semantic or component token for color, spacing, radius, elevation, and motion.
- A new raw hex or `rgba()` value in a component rule is a defect unless it is a documented primitive or component token.
- The current prototype is light-only. The dark mapping and the old theme-toggle branch are reference-only; no theme toggle is rendered.
- Token names describe role, not appearance (`--text-muted`, not `--gray-500`).
- The current prototype declares one light theme in `:root`; the dark column below is reference-only.

### 3.1 Semantic colour tokens

| Role | Light | Dark (reference only) | Use |
|---|---|---|---|
| `--canvas` | `#f8f9fb` | `#0d1411` | App background |
| `--surface` | `#ffffff` | `#111a16` | Panels, cards, chat |
| `--surface-raised` | `#ffffff` | `#16211c` | Composer, popovers, raised cards |
| `--surface-soft` | `#f5f7fa` | `#131d18` | Table heads, soft fills |
| `--surface-hover` | `#eef2f7` | `#1c2923` | Hover fill |
| `--text-primary` | `#111827` | `#f0ece1` | Primary text |
| `--text-secondary` | `#4b5563` | `#c5beab` | Secondary text |
| `--text-muted` | `#667085` | `#9b9482` | Metadata and labels |
| `--text-faint` | `#98a2b3` | `#7e7869` | Decorative marks only; not functional text |
| `--border` | `#e5e8ee` | `#26342d` | Card outlines and dividers |
| `--border-strong` | `#d5dae3` | `#33443b` | Emphasised container border |
| `--control-border` | `#7f8a9c` | `#607468` | Resting boundary for controls (≥3:1) |
| `--control-border-hover` | `#6b7688` | `#7a8f82` | Hover boundary for controls |
| `--accent` | `#2563eb` | `#4fd7b8` | Primary action and active state |
| `--accent-hover` | `#1d4ed8` | `#6ce3c8` | Primary action hover |
| `--accent-contrast` | `#ffffff` | `#06211b` | Text on accent |
| `--accent-soft` | `#eaf0ff` | `#12352c` | Selected/soft accent fill |
| `--accent-text` | `#1d4ed8` | `#8fe9d2` | Accent-coloured text |
| `--sidebar-bg` | `#f7f8fa` | `#0b1411` | Navigation rail |
| `--sidebar-text` | `#111827` | `#e6ebe3` | Navigation primary text |
| `--sidebar-muted` | `#5f6b7e` | `#8fa196` | Navigation secondary text |
| `--focus` | `#2563eb` | `#4fd7b8` | Focus ring |
| `--scrim` | `rgba(17,24,39,.42)` | `rgba(0,0,0,.62)` | Dialog scrim |

Status roles are separate text/background/border triples, so a badge never relies on colour alone:

| Status | Light text / background | Dark text / background (reference only) | Meaning |
|---|---|---|---|
| `ok` | `#1f5a43` / `#e0efe6` | `#8fe9d2` / `#12352c` | Connected, succeeded |
| `warn` | `#7a4a12` / `#f7ead3` | `#f0c48a` / `#33240f` | Needs authentication, attention |
| `error` | `#8f2a24` / `#f6ded9` | `#f0a79d` / `#351813` | Failed, error |
| `info` | `#234a74` / `#e3ebf6` | `#a9c6e8` / `#152539` | Running |
| `neutral` | `#4b5563` / `#eef1f5` | `#c5beab` / `#1d2822` | Pending, skipped, recorded |

Every status also carries a short text label and a dot; colour is supplementary.

### 3.2 Typography

Local OS stacks only. No external font, no CDN, no network request.

```css
--font-ui: "Avenir Next", "Segoe UI Variable", "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;
--font-display: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif;
--font-mono: "SF Mono", "JetBrains Mono", "IBM Plex Mono", Menlo, Consolas, monospace;
```

| Role | Token | Size | Weight | Typical use |
|---|---|---|---|---|
| Micro | `--text-2xs` | 11px | 600 | Table headers, sidebar group labels, footers |
| Meta | `--text-xs` | 11.5px | 400–600 | Eyebrows, chips, field labels |
| Small | `--text-sm` | 12px | 400–600 | Buttons, table cells, form hints |
| Body-small | `--text-md` | 12.5px | 400 | Card descriptions, supporting copy |
| Body | `--text-base` | 13.5px | 400 | Chat messages, prose, form hints |
| Lead | `--text-lg` | 15px | 400 | Empty-state support copy |
| Panel title | `--text-xl` | 18px | 500 | Panel heads and facts titles |
| Card title | `--text-card` | 20px | 500 | Registry card titles |
| Section | `--text-2xl` | 22px | 500 | Large panel titles |
| Compact title | `--text-3xl` | 28px | 500 | Reserved compact display title |
| Page title | `--text-4xl` | 34px | 500 | Desktop page and run-reference title |

Line-height tokens: `--leading-tight` 1.15, `--leading-snug` 1.35, `--leading-normal` 1.55, `--leading-relaxed` 1.68.

Rules:

- The serif is a display face: brand wordmark, page titles, card titles, chat title, empty-state headline. It is not used for body copy, controls, tables, or metadata.
- Uppercase and letterspacing are reserved for eyebrows, table headers, and micro-labels. They are not used for buttons or long labels.
- Functional text is never smaller than 11px.
- Body copy measure stays below 72ch; chat prose is capped at 72ch.

### 3.3 Spacing, radius, elevation, motion

| Family | Tokens | Use |
|---|---|---|
| Spacing | 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80 (`--space-1`…`--space-11`) | 4px base; 8px rhythm for component internals |
| Radius | `3` / `6` / `8` / `10` / `14` / `999` | Tags, controls, inputs, cards, panels/modals, pills |
| Elevation | `--shadow-xs` … `--shadow-lg` | Flat cards use xs; popovers and overlays use lg |
| Motion | `--dur-fast` 120ms, `--dur-base` 180ms, `--dur-slow` 260ms | Hover, state, overlay |
| Easing | `--ease-out` `cubic-bezier(.2,.7,.2,1)` | All functional transitions |
| Focus | 2px solid `--focus`, 2px offset | Every interactive control |

No hard offset shadows. Cards use a 1px border plus a low-contrast shadow; overlays use a larger, softer shadow. Hover lift is at most 2px and never changes layout bounds.

### 3.4 Layout tokens

| Token | Value | Use |
|---|---|---|
| `--sidebar-w` | 272px | Desktop navigation |
| `--topbar-h` | 56px | Global topbar |
| `--rail-w` | 300px | Record, run, and outcome side panel |
| `--content-max` | 1360px | Page content cap |
| `--gutter` | 36px | Desktop page inset |
| `--control-h` | 36px | Default control height |
| `--control-h-sm` | 31px | Compact control |
| `--control-h-lg` | 42px | Large control (reserved) |
| `--card-pad` | 16px | Panel and registry-card interior |
| `--card-radius` | 10px | Registry cards |
| `--panel-radius` | 14px | Chat panel and page panels |

## 4. Layout

### Shell

- Two-column CSS grid: a 272px near-white rail plus a fluid main pane.
- The app is exactly `100dvh`; the main pane owns scrolling, not the page.
- The topbar is 56px and stays at the top of the main pane.
- Chat uses the full remaining viewport. Registry pages scroll inside the main pane and cap at 1360px.
- The rail and main pane are separated by a hairline border, not a dark block.

### Chat

- Three regions: header (conversation reference and “Private to you”), scrolling thread, and pinned composer dock.
- Thread and composer are 760px maximum, centred in the main pane. There is no right rail.
- At ≤1280px the chat column caps at 720px; at ≤960px it fills the 648px content width.
- Empty state: a short serif question and the composer. No prompt cards or task shortcuts.
- On opening a conversation the thread starts at the top; sending anchors to the bottom.

### Registry and record pages

- Page header: eyebrow, title + recorded count, description, read-only notice.
- No toolbar, search field, or filter chip; no search or filter capability is confirmed.
- Cards: three columns at 1440px, two at ≤1280px and ≤960px; minimum 320px at the baseline.
- Record and run pages: 764px reading/form column + 300px facts panel at 1440px; 280px at ≤1280px; stacked at ≤1080px.
- The run-step table is the only table. No run index, audit table, or usage table exists.

### Breakpoints

| Width | Behaviour |
|---|---|
| **1440px** | 272px rail; 36px gutters; 1096px content; 3-column registry grid; 764 + 300 record/run split; 760px chat column |
| **≤1280px** | 28px gutters; 2-column registry grid; 280px side panel; 720px chat column |
| **≤1080px** | Record/run side panel stacks below the main column; registry keeps 2 columns |
| **≤960px** | 20px gutters; 2-column registry grid; run-step table stacks duration/result under each step; chat fills the content width; no horizontal page scroll |
| **<960px** | Not adopted. Mobile and narrow layouts are out of scope. |

At 960px the rail is 272px and the main pane is 688px; the 20px gutters leave 648px of content. The two-column registry grid resolves above the 280px minimum.

## 5. Components

### Sidebar

- Near-white porcelain rail with a hairline border and an almost invisible blue tint; no dark block.
- Brand, primary New chat, the four workspace destinations, the conversation list, and a neutral signed-in indicator.
- Active destination and active conversation: soft blue fill (`--sidebar-active`), ink text, and a 2px blue left rule. The light rail uses ink for active text, not white.
- New chat is a white outlined button; hover uses the soft blue fill.
- The conversation list scrollbar is thin and visually quiet.

### Topbar

- Workspace breadcrumb plus a dashed `States` review control. The review control is prototype-only.
- No Manage, account menu/avatar, theme toggle, Mock pill, or sign-out control.
- Breadcrumb is mono, 11.5px, uppercase, with the current location in blue accent.

### Buttons and chips

- Default 36px; compact 31px. Radius 6px.
- Primary: blue fill, white text; hover deepens. Secondary: surface + control border. Ghost: transparent.
- Resting control boundaries use `--control-border`; hover uses `--control-border-hover`.
- Chips and status pills are 23px tall, 11.5px semibold. Status is colour + label + dot; never colour alone.
- Focus ring is a 2px blue outline and is not removed by hover.

### Registry cards

- 1px border, 10px radius, 16px padding, subtle shadow, 2px hover lift.
- Skill cards: name, description, and a neutral `Recorded` marker.
- MCP cards: name, recorded health, and a credential-reference indicator. No tool names, tool count, add, test, allowlist, or invoke control.
- Task cards: name, description, version label, step count, and Run as the only action.
- No owner, lifecycle stripe, dependency list, allowlist meter, last run, Open, or Test control.

### Tables

- Run-step table only: surface panel, 10px radius, 1px border.
- Header: 11px uppercase mono, muted, soft background. Rows: 12.5px, last row borderless.
- Scoped column headers and a caption; at ≤960px duration and result move onto a second line while status stays visible.
- No run index, audit table, or usage table.

### Chat

- User message: ink bubble, paper text, asymmetric radius; max 76% of the column.
- Assistant message: `Assistant` label and up to 72ch prose. No run receipt, citations, copy, edit, or retry actions on the message.
- Typing indicator uses three dots and a polite live region.
- Empty state uses a serif question and the composer. No prompt cards or task shortcuts.

### Composer

- Raised surface, 14px radius, focus ring on the composer.
- Plain text only: Enter sends, Shift+Enter inserts a line; Send is a 36px button.
- No context chips, slash menu, `@` file control, search toggle, or model chip.
- The composer is pinned; the thread scrolls beneath it.

### Forms and state panels

- Form labels 11.5px; inputs 36px; 2px focus outline; hints and errors adjacent.
- Multiple errors add a summary above the primary action; the first invalid field receives focus.
- State panels are 560px wide, with a serif headline, one explanatory paragraph, and at most one primary recovery action.
- N/A state reasons are stated in the prototype-only States review control.

### Overlays

- The only effective overlay is the 460px discard confirmation: `Discard unsent text?` with Stay and Discard.
- It uses `role="alertdialog"`, a scrim, a Tab trap, Escape as Stay, and focus restoration; the app shell is inert while it is open.
- No authoring drawer, publish modal, delete confirmation, or write-tool form is rendered.

### Review control

- A dashed `States` button in the topbar opens a prototype-only coverage panel.
- It lists the nine states for the current page, states each N/A reason, and can render a specified state for review.
- It is not a product surface and does not link PG-010 to PG-012.

### Not part of the effective prototype

- The run-context rail, usage dashboard, theme toggle, Manage drawer, Runs, Audit, Settings, authoring forms, and write-tool allowlist are not rendered.
- The dark mapping in §3 is reference-only; the current prototype is light-only.

## 6. Accessibility evidence

Calculated WCAG contrast for core token pairs (normal-text threshold 4.5:1; non-text threshold 3:1):

| Pair | Light | Dark (reference only) |
|---|---|---|
| Primary text / surface | 17.74:1 | 15.04:1 |
| Secondary text / surface | 7.56:1 | 9.57:1 |
| Muted text / surface | 4.97:1 | 5.88:1 |
| Accent text / surface | 6.70:1 | 12.47:1 |
| Accent contrast / accent | 5.17:1 | 9.46:1 |
| Status ok text / bg | 6.79:1 | 9.39:1 |
| Status warn text / bg | 6.27:1 | 9.26:1 |
| Status error text / bg | 6.48:1 | 8.30:1 |
| Status info text / bg | 7.59:1 | 8.80:1 |
| Sidebar text / sidebar | 16.69:1 | 15.46:1 |
| Sidebar muted / sidebar | 5.08:1 | 6.87:1 |
| User bubble text / bubble | 17.74:1 | 10.04:1 |
| Control border / surface | 3.49:1 | 3.55:1 |

`--text-faint` is restricted to decorative marks such as the breadcrumb separator; it is not used for functional text and is not assessed as a text pair.

Control boundaries use `--control-border` (`#7f8a9c` light). It measures 3.31–3.49:1 across the canvas, surface, and raised surfaces (canvas 3.31, surface 3.49, raised 3.49), so buttons, inputs, chips, and the composer boundary stay identifiable without relying on text alone. The softer `--border` is reserved for card outlines and dividers, which are not the sole indicator of a control. On focus, the 2px blue ring is the primary indicator and the border becomes transparent/stronger depending on the component.

Keyboard and assistive behaviour:

- Skip link to `#main`; the main element is focusable with `tabindex="-1"`.
- Every control has a visible focus ring; focus is never obscured by the pinned composer or a sticky footer.
- Dialogs trap Tab, close on Escape, and restore focus. The background app shell is inert.
- Registry cards are native links; the run-step table has a caption and scoped headers.
- Enter sends in the composer; Shift+Enter inserts a line; Escape closes the discard dialog or the States panel. No slash or mention menu exists.
- A polite live region announces sign-in, chat completion, and run state changes; the thread itself is not a live region.
- Colour is never the only signal: status carries a dot and text; failures carry a text label.
- `prefers-reduced-motion` disables animations and smooth scrolling.
- Desktop controls use the 36px baseline; mobile is out of scope.

## 7. Prototype mapping and boundaries

| Asset | Role |
|---|---|
| `docs/03_design/prototype/index.html` | Semantic shell, PG-001 to PG-012, inline SVG sprite, discard dialog |
| `docs/03_design/prototype/styles.css` | Token layers, light theme, layout, components, responsive rules |
| `docs/03_design/prototype/app.js` | Synthetic state, renderers, interaction handlers, state review controls |
| `docs/03_design/prototype/preview-*.png` | Reference captures |

Boundaries:

- Mock data only; no backend, model call, MCP connection, authentication, or persistence.
- No framework, package manager, dependency manifest, lockfile, CDN, or external font.
- Icons are inline SVG from a single 24px, 1.6px-stroke sprite.
- Theme choice and registry state reset on refresh.
- The prototype is not production code and MUST NOT be copied into `frontend/` unchanged.

## 8. Decisions and open references

- **Chat scroll:** open at the top; anchor to the bottom only when a message is sent. This avoids starting mid-receipt on small screens while keeping the newest reply visible after sending.
- **Write tools:** read-only tools are toggleable in the allowlist; write-capable tools are shown as `Blocked in v1`. This mirrors the PRD guardrail (TBD-BIZ-007) and does not imply an approval flow exists.
- **Audit date filter:** the prototype adds All time / Today / Last 7 days to the category and text filters so the screen reflects the PRD filter requirement (US-07).
- **Run detail:** includes actor, task version, start/end, tokens/cost, step timeline, and artifacts (US-06).
- **Skill dependencies:** the skill form offers only allowlisted read-only tools and uses full references to avoid duplicate `search` names across servers.
- **Role model:** the prototype signs in as an Admin (Alex Chen) and shows proposed policy rows as locked; it does not settle publication policy (TBD-BIZ-004).
- **Stack:** tokens are plain CSS custom properties and framework-agnostic; no frontend stack is selected (TBD-INFRA-001).
- **Data boundary:** all records are synthetic; no production data or PII is used (TBD-BIZ-003).
- **Model:** `gpt-4.1 · internal` is mock text only; the provider is not selected (TBD-INFRA-009).
