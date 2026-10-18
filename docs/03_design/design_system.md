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

The token source of truth is the `:root` and `[data-theme]` blocks in `docs/03_design/prototype/styles.css`. This document explains and owes evidence to that source; if the two diverge, the CSS is the working artifact and this document MUST be corrected in the same change.

## 2. Direction

**Quiet console** — editorial precision with workspace-first density.

The interface should feel like a calm internal instrument: warm paper surfaces, deep evergreen navigation, a single mint accent for action, and amber/red reserved for attention. The chat is the daily home; the registries and operations screens are scannable control surfaces, not marketing pages.

### Principles

1. **Chat is the home.** The shell recedes; the conversation, composer, and run context own the viewport.
2. **Scan before read.** Status, owner, recency, and the primary action are visible on the card or row without opening a detail panel.
3. **One accent, earned attention.** Evergreen is action and confirmation; amber is a warning or an unresolved decision; red is failure or a blocked capability.
4. **Type carries hierarchy.** Fewer boxes, fewer rules, more deliberate size, weight, and spacing. Serif is reserved for brand, page titles, card titles, and empty states.
5. **Tokens, not one-offs.** Components reference semantic or component tokens; raw values live only in the primitive layer.
6. **Accessible by default.** Contrast, focus, keyboard operation, dialog semantics, reduced motion, and touch targets are part of the component definition.
7. **Prototype honesty.** Every surface says `Mock` or `Prototype`; no screen implies a live model, MCP connection, or real identity.

## 3. Token architecture

The CSS is layered so that themes and components do not depend on raw values:

| Layer | Purpose | Example | Location |
|---|---|---|---|
| **1. Primitives** | Raw ramps and scales. Never used by components directly. | `--paper-2`, `--teal-2`, `--space-4`, `--text-base` | `:root` |
| **2. Semantic roles** | Theme-aware meaning. Components use these. | `--canvas`, `--surface`, `--text-primary`, `--border`, `--accent` | `:root, [data-theme="light"]` and `[data-theme="dark"]` |
| **3. Component tokens** | Stable knobs for a component family. | `--control-h`, `--card-pad`, `--panel-radius`, `--drawer-bg` | semantic blocks |

Rules:

- A component rule MUST use a semantic or component token for color, spacing, radius, elevation, and motion.
- A new raw hex or `rgba()` value in a component rule is a defect unless it is a documented primitive or component token.
- Dark mode overrides **semantic roles only**. The one deliberate component-level branch is the theme-toggle icon swap (`.theme-icon-light` / `.theme-icon-dark`), because the icon communicates the action rather than a colour role.
- Token names describe role, not appearance (`--text-muted`, not `--gray-500`).
- Theme tokens are declared under `[data-theme="light"]` and `[data-theme="dark"]`; the default is light.

### 3.1 Semantic colour tokens

| Role | Light | Dark | Use |
|---|---|---|---|
| `--canvas` | `#f4f1e8` | `#0d1411` | App background |
| `--surface` | `#fbf9f3` | `#111a16` | Panels, cards, chat |
| `--surface-raised` | `#fffdf8` | `#16211c` | Composer, popovers, raised cards |
| `--surface-soft` | `#f7f4ec` | `#131d18` | Receipts, code blocks, table heads |
| `--surface-hover` | `#f1ede2` | `#1c2923` | Hover fill |
| `--text-primary` | `#17150f` | `#f0ece1` | Primary text |
| `--text-secondary` | `#565143` | `#c5beab` | Secondary text |
| `--text-muted` | `#6f6857` | `#9b9482` | Metadata and labels |
| `--text-faint` | `#8b8371` | `#7e7869` | Decorative icons and dividers only; not essential text |
| `--border` | `#ded6c4` | `#26342d` | Card outlines and dividers |
| `--border-strong` | `#c9bfa9` | `#33443b` | Emphasised container border |
| `--control-border` | `#8e8674` | `#607468` | Resting boundary for controls (≥3:1) |
| `--control-border-hover` | `#6f6857` | `#7a8f82` | Hover boundary for controls |
| `--accent` | `#0d6557` | `#4fd7b8` | Primary action and active state |
| `--accent-hover` | `#0a4f43` | `#6ce3c8` | Primary action hover |
| `--accent-contrast` | `#ffffff` | `#06211b` | Text on accent |
| `--accent-soft` | `#e4f2ee` | `#12352c` | Selected/soft accent fill |
| `--accent-text` | `#0a4f43` | `#8fe9d2` | Accent-coloured text |
| `--sidebar-bg` | `#0b1411` | `#0b1411` | Navigation rail |
| `--sidebar-text` | `#e6ebe3` | `#e6ebe3` | Navigation primary text |
| `--sidebar-muted` | `#93a297` | `#8fa196` | Navigation secondary text |
| `--focus` | `#0d6557` | `#4fd7b8` | Focus ring |
| `--scrim` | `rgba(18,16,11,.42)` | `rgba(0,0,0,.62)` | Drawer/modal scrim |

Status roles are separate text/background/border triples, so a badge never relies on colour alone:

| Status | Light text / background | Dark text / background | Meaning |
|---|---|---|---|
| `ok` | `#0a4f43` / `#e4f2ee` | `#8fe9d2` / `#12352c` | Published, connected, succeeded |
| `warn` | `#7a4310` / `#f8ead3` | `#f0c48a` / `#33240f` | Draft, needs auth, attention |
| `error` | `#8f241a` / `#f5ddd7` | `#f0a79d` / `#351813` | Failed, error, blocked in v1 |
| `info` | `#1f4675` / `#e2eaf5` | `#a9c6e8` / `#152539` | Running |
| `neutral` | `#565143` / `#edeadf` | `#c5beab` / `#1d2822` | Deprecated, proposed, mock |

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
| Meta | `--text-xs` | 11.5px | 400–600 | Eyebrows, chips, field labels, timestamps |
| Small | `--text-sm` | 12px | 400–600 | Buttons, table cells, drawer subtitles |
| Body-small | `--text-md` | 12.5px | 400 | Card descriptions, settings copy |
| Body | `--text-base` | 13.5px | 400 | Chat messages, prose, form hints |
| Lead | `--text-lg` | 15px | 400 | Empty-state support copy |
| Rail/panel title | `--text-xl` | 18px | 500 | Rail cards and panel heads |
| Card title | `--text-card` | 20px | 500 | Registry card titles |
| Section | `--text-2xl` | 22px | 500 | Large panel titles |
| Page title | `--text-3xl` | 28px | 500 | Mobile page title |
| Page title | `--text-4xl` | 34px | 500 | Desktop page title |

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
| Elevation | `--shadow-xs` … `--shadow-lg` | Flat cards use xs; popovers/drawers use lg |
| Motion | `--dur-fast` 120ms, `--dur-base` 180ms, `--dur-slow` 260ms | Hover, state, overlay |
| Easing | `--ease-out` `cubic-bezier(.2,.7,.2,1)` | All functional transitions |
| Focus | 2px solid `--focus`, 2px offset | Every interactive control |

No hard offset shadows. Cards use a 1px border plus a low-contrast shadow; overlays use a larger, softer shadow. Hover lift is at most 2px and never changes layout bounds.

### 3.4 Layout tokens

| Token | Value | Use |
|---|---|---|
| `--sidebar-w` | 272px | Desktop navigation |
| `--topbar-h` | 56px | Global topbar |
| `--rail-w` | 300px | Run-context rail |
| `--content-max` | 1360px | Page content cap |
| `--gutter` | 36px | Desktop page inset |
| `--control-h` | 36px | Default control height |
| `--control-h-sm` | 31px | Compact control |
| `--control-h-lg` | 42px | Large control (reserved) |
| `--card-pad` | 16px | Panel interior; registry cards use 15/15/13/18px (18px left for the status stripe; MCP/task cards use 15px left) |
| `--card-radius` | 10px | Registry cards |
| `--panel-radius` | 14px | Chat panel and page panels |

## 4. Layout

### Shell

- Two-column CSS grid: fixed sidebar (272px) + fluid main.
- The app is exactly `100dvh`; the main pane owns scrolling, not the page.
- Topbar is 56px and stays at the top of the main pane.
- Chat uses the full remaining viewport. Registry pages scroll inside the main pane and cap at 1360px.

### Chat

- Three regions: header (conversation title and actions), scrolling thread, pinned composer dock.
- Right rail (300px): active skill, tools in this run, session summary, guardrail.
- At ≤1080px the rail is hidden and the header exposes a `Run context` button that opens a drawer with the same content.
- Empty state: a short serif question, three prompt cards, and shortcuts to published tasks.
- On opening a conversation the thread starts at the top; sending a message anchors to the bottom. This avoids landing mid-tool-call on small screens.
- At ≤780px the composer remains pinned; touch targets become 44px; the modal becomes a bottom sheet.

### Registry pages

- Page header: eyebrow, title + count, description + summary, primary action.
- Toolbar: search and filter chips (wrap on desktop, horizontal scroll on mobile).
- Cards: 320–340px minimum, auto-fill; one column at ≤780px.
- Tables: runs render as rows on desktop and card-like rows on mobile; audit keeps table semantics inside a horizontal scroll panel.

### Breakpoints

| Width | Behaviour |
|---|---|
| ≤1280 | Rail 280px, gutters 28px, chat inset 12px |
| ≤1080 | Rail hidden; context drawer; settings one column; stats two columns |
| ≤960 | Page gutters 20px; grids 280px minimum; ledger hides “Started” |
| ≤860 | Sidebar becomes off-canvas; menu and new-chat buttons appear |
| ≤780 | Page header stacks; filters scroll; prompt cards stack; modal becomes a sheet; touch targets 44px |
| ≤560 | Mock pill retained; theme toggle hidden; KPI grid stays 2×2 with stacked labels; quiet model chip hidden |

## 5. Components

### Sidebar

- Deep evergreen background with a subtle mint radial glow.
- Brand, workspace switcher, primary New chat, Tasks shortcut, chat search, grouped history, prototype stamp, user card.
- Active history row: 2px mint left rule and a very soft gradient; hover is a neutral white wash.
- History actions (`⋯`) are always available on touch; hover/focus on pointer devices.
- History scrollbar is visually hidden while remaining scrollable.

### Topbar

- Workspace breadcrumb (`Workspace / Chat` or `Workspace / Manage / Skills`), topbar-only Manage, theme toggle, `Mock` pill, account avatar.
- Breadcrumb is mono, 11.5px, uppercase, with the current location in accent.
- On mobile: menu, breadcrumb, new chat, Manage (icon only), Mock pill, avatar.

### Buttons and chips

- Default 36px; compact 31px. Radius 6px.
- Primary: evergreen fill, white text; hover deepens. Secondary: surface + control border. Ghost: transparent. Danger: soft red background with red text. Resting control boundaries use `--control-border`; hover uses `--control-border-hover`.
- Chips are pill-shaped, 30px tall, 11.5px semibold. Filter chips use `aria-pressed`; active is inverse ink.
- Status pills are colour + label + dot; never colour alone.
- Focus ring is always visible and not removed by hover.

### Cards

- Registry cards: 1px border, 10px radius, 15px top/right, 13px bottom, 18px left (15px left on MCP/task cards), subtle shadow, 2px hover lift.
- Skill cards add a 3px status stripe (green published, amber draft, neutral deprecated).
- Card title is serif 20px; description 12.5px; metadata 11px mono; dependencies are mono chips.
- MCP cards show transport/auth, endpoint, allowlist meter, last check, timeout.
- Task cards show status/version, a linear step path, owner, last run, Open and Run/Test run.
- An empty dependency set is stated explicitly (“No MCP dependencies”), not left blank.

### Tables

- Surface panel with 10px radius and 1px border.
- Header: 11px uppercase mono, muted, soft background.
- Rows: 12.5px, hover fill, last row borderless.
- Run rows are buttons with a full-row accessible name.
- Audit rows carry actor initials, action code, target, outcome, and time; the toolbar adds actor/action/target search and an All time / Today / Last 7 days period filter.

### Chat

- User message: ink bubble, paper text, asymmetric radius; max 76% desktop / 88% mobile.
- Assistant message: 28px mint `H` mark, name/context line, up to 72ch prose, run receipt, citations, and copy/retry actions revealed on hover or focus.
- Run receipt: skill name, version badge, one row per tool with status dot, code name, input → output summary, duration.
- Citations: numbered pills with source kind and label.
- Typing indicator uses three dots and a status live region.
- Empty state uses a serif question, three prompt cards, and published-task shortcuts.

### Composer

- Raised surface, 14px radius, focus ring on the composer.
- Context chips for active skill, search, and attached files; each has an accessible remove button.
- `/` opens published skills; `@` opens workspace files; Search is an `aria-pressed` toggle; the model chip is a mock.
- Send is 36px desktop / 44px mobile. Enter sends; Shift+Enter adds a line; `/` and `@` open menus only when the input is empty.
- Composer is pinned; the thread scrolls beneath it.

### Run context rail

- Active skill card with manifest link.
- Tools-in-this-run list (read-only, duration/ready).
- Session summary: messages, tools, tokens, estimated cost.
- Guardrail card: read-only tools only; write-capable tools disabled in v1.
- Drawer equivalent on narrow screens.

### Drawers and modals

- Drawer: right side, 540px, full height, sticky header and footer, scrolling body, scrim, `role="dialog"`, `aria-modal`, focus trap, Escape to close, focus restored to the trigger.
- Modal: 640px, max 88dvh, sticky header/footer, scrolling body; bottom sheet at ≤780px.
- The app shell is `inert` while an overlay is open.
- Form labels are 11.5px, inputs 36px, focus 2px outline, hints and errors adjacent.
- Skill form offers only allowlisted read-only MCP tools, labelled with their full reference (for example `confluence.search`).
- MCP form includes transport, auth, secret reference (never a value), timeout, and a test action.
- Task form includes name, description, input lines, and the first linear step.
- Write-capable MCP tools are displayed as `Blocked in v1`, not as toggles.

### Usage dashboard

- Four KPI cards: conversations, runs, published skills, MCP servers; each with a trend/subline and a decorative sparkline.
- Runs-per-day chart: y-axis, dashed gridlines, labelled bars, peak emphasis, hover/focus values, and a chart summary in the accessible name. The chart is not colour-only.
- Efficiency panel: tokens, estimated spend, average run, failed runs, monthly budget meter; the meter anchors to the bottom of the panel.
- Most-run tasks table with success meters.

### Theme toggle

- Light is the default reference theme.
- Dark remaps semantic roles only; the sidebar stays deep evergreen; accent becomes a brighter mint for dark surfaces.
- The toggle is a client-only demonstration and resets on refresh. It is **not** a confirmed product requirement.

## 6. Accessibility evidence

Calculated WCAG contrast for core token pairs (normal-text threshold 4.5:1; non-text threshold 3:1):

| Pair | Light | Dark |
|---|---|---|
| Primary text / surface | 17.34:1 | 15.04:1 |
| Secondary text / surface | 7.52:1 | 9.57:1 |
| Muted text / surface | 5.26:1 | 5.88:1 |
| Accent text / surface | 9.02:1 | 12.47:1 |
| Accent contrast / accent | 6.96:1 | 9.46:1 |
| Status ok text / bg | 8.24:1 | 9.39:1 |
| Status warn text / bg | 6.71:1 | 9.26:1 |
| Status error text / bg | 6.66:1 | 8.30:1 |
| Status info text / bg | 7.90:1 | 8.80:1 |
| Sidebar text / sidebar | 15.46:1 | 15.46:1 |
| Sidebar muted / sidebar | 7.00:1 | 6.87:1 |
| User bubble text / bubble | 17.34:1 | 10.04:1 |
| Control border / surface | 3.43:1 | 3.55:1 |

`--text-faint` is 3.57:1 (light) / 4.04:1 (dark) and is restricted to decorative icons, dividers, and non-essential marks. Chart axis labels use `--text-muted`, not faint.

Control boundaries use `--control-border` (`#8e8674` light, `#607468` dark). It measures 3.20–3.73:1 across the canvas, surface, and raised surfaces (light 3.20/3.43/3.55; dark 3.73/3.55/3.31), so buttons, inputs, chips, toggles, and the composer boundary stay identifiable without relying on text alone. The softer `--border` is reserved for card outlines and dividers, which are not the sole indicator of a control. On focus, the 2px accent ring is the primary indicator and the border becomes transparent/stronger depending on the component.

Keyboard and assistive behaviour:

- Skip link to `#main`; the main element is focusable with `tabindex="-1"`.
- Every control has a visible focus ring; focus is never obscured by the pinned composer or a sticky footer.
- Dialogs trap Tab, close on Escape, and restore focus. The background app shell is inert.
- Cards with `role="button"` respond to Enter and Space; ledger rows are native buttons.
- `/`, `@`, `n` (new chat), Enter, Shift+Enter, and Escape are supported; shortcuts do not fire while typing in a field.
- A polite live region announces send/reply state; the thread itself is not a live region.
- Chart bars are focusable with data labels; the chart has an accessible summary; tables have captions and scoped headers.
- Colour is never the only signal: status carries a dot and text; filters carry count text; failures carry an error label.
- `prefers-reduced-motion` disables animations and smooth scrolling.
- Mobile controls are at least 44px in the pointer-coarse / ≤780px rules.

## 7. Prototype mapping and boundaries

| Asset | Role |
|---|---|
| `docs/03_design/prototype/index.html` | Semantic shell, eight views, SVG sprite, dialogs |
| `docs/03_design/prototype/styles.css` | Token layers, themes, layout, components, responsive rules |
| `docs/03_design/prototype/app.js` | Mock state, renderers, interaction handlers, chart labels |
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
