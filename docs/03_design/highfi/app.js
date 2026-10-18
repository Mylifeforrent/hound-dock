/* ==========================================================================
   hound-dock high-fidelity — shared state renderer and behaviours
   Scope: PG-001 to PG-012, states driven only by ?state= for acceptance.
   Data: synthetic fixtures. No network, framework, build, storage, or PII.
   Behaviour authority: interaction_design.md v0.1 §4 to §7.
   Visual values: none. Every colour, type size, radius, and shadow comes
   from tokens.css through a class in components.css.
   ========================================================================== */
(() => {
  'use strict';

  const APP = document.getElementById('app');
  const LIVE = document.getElementById('live-region');

  const PAGE = document.body.dataset.page;
  const PARAMS = new URLSearchParams(window.location.search);

  /* -----------------------------------------------------------------------
     Copy
     ----------------------------------------------------------------------- */

  const COPY = {
    signInError: 'Sign-in failed. Check your sign-in name and credential.',
    signInEmptyName: 'Enter your sign-in name.',
    signInEmptyCredential: 'Enter your credential.',
    emptyMessage: 'Enter a message before sending.',
    chatError: 'The assistant could not respond. Your message was kept. Try again.',
    runNoCreate: 'The run could not be started. No run was created.',
    runUnconfirmed: 'Run start unconfirmed. Do not start another run; contact the team operating the workspace.',
    runRejected: 'The run was rejected before any step. No step results were recorded.',
    demoChat: 'Draft a short note to the team about the maintenance window.',
    demoReply: 'Here is a short working draft you can adapt:\n\n1. Confirm the maintenance window and the systems affected.\n2. Name the expected impact and the rollback point.\n3. Close with the next update time.\n\nTell me if you want it shorter or more formal.',
    discardTitle: 'Discard unsent text?',
    discardChat: 'Your message has not been sent. This cannot be undone.',
    discardRun: 'Your run inputs have not been submitted. This cannot be undone.'
  };

  /* -----------------------------------------------------------------------
     Synthetic fixtures — no real integration, person, secret, or owner field
     ----------------------------------------------------------------------- */

  const SKILLS = [
    {
      name: 'summarise-thread',
      description: 'Turns a supplied discussion into decisions, open questions, and next steps.',
      instructions: 'Read the supplied discussion and keep the summary neutral. Return three short groups: decisions, open questions, and next steps. Do not add a recommendation that is not present in the discussion.',
      inputs: [{ name: 'text', required: true, hint: 'The discussion to summarise.' }],
      version: null
    },
    {
      name: 'draft-brief',
      description: 'Turns structured notes into a one-page brief for a working session.',
      instructions: 'Use only the supplied notes. Produce one page with a context paragraph, three key points, and a proposed next step. Mark any gap in the notes as an open question instead of filling it in.',
      inputs: [
        { name: 'notes', required: true, hint: 'The notes to turn into a brief.' },
        { name: 'audience', required: false, hint: 'Who the brief is for.' }
      ],
      version: 'v3'
    },
    {
      name: 'extract-actions',
      description: 'Extracts action items, responsible wording, and due points from a supplied transcript.',
      instructions: 'Read the transcript and list every explicit action item. Keep the responsible wording exactly as recorded. If no responsible person or due point is stated, write “Not stated” rather than guessing.',
      inputs: [{ name: 'transcript', required: true, hint: 'The transcript to read.' }],
      version: 'v2'
    }
  ];

  const SERVERS = [
    {
      name: 'gateway-primary',
      health: 'Connected',
      tone: 'ok',
      credential: true,
      connectionType: 'HTTP',
      endpoint: 'gateway.example/mcp',
      timeout: '30 s',
      toolRefCount: 4
    },
    {
      name: 'docs-index',
      health: 'Needs authentication',
      tone: 'warn',
      credential: false,
      connectionType: 'HTTP',
      endpoint: 'docs.example/mcp',
      timeout: '30 s',
      toolRefCount: 0
    },
    {
      name: 'ticket-bridge',
      health: 'Error',
      tone: 'error',
      credential: true,
      connectionType: 'HTTP',
      endpoint: 'tickets.example/mcp',
      timeout: '20 s',
      toolRefCount: 2
    }
  ];

  const TASKS = [
    {
      name: 'weekly-digest',
      description: 'Summarises the recorded week into a short digest for a working session.',
      version: 'v2',
      steps: 3,
      inputs: [{ name: 'week', required: true, hint: 'The week to summarise, for example 2026-W42.' }],
      outcome: 'pg-009-run-outcome.html?state=default&run=RUN-7K2M'
    },
    {
      name: 'ticket-triage',
      description: 'Classifies a supplied ticket and proposes a next response.',
      version: 'v1',
      steps: 3,
      inputs: [
        { name: 'ticket', required: true, hint: 'The ticket text to triage.' },
        { name: 'queue', required: false, hint: 'The queue the ticket belongs to.' }
      ],
      outcome: 'pg-009-run-outcome.html?state=success-failure&outcome=failed-step&run=RUN-3P9Q'
    },
    {
      name: 'health-check',
      description: 'Checks a recorded service boundary and records the result.',
      version: 'v1',
      steps: 1,
      inputs: [],
      outcome: 'pg-009-run-outcome.html?state=success-failure&outcome=failed-before-step&run=RUN-5C1R'
    }
  ];

  const RUNS = {
    'RUN-7K2M': {
      ref: 'RUN-7K2M',
      task: 'weekly-digest',
      version: 'v2',
      state: 'Succeeded',
      tone: 'ok',
      steps: [
        { ordinal: 1, kind: 'Skill', name: 'summarise-thread', status: 'Succeeded', duration: '8.2 s', result: 'Digest drafted from the recorded week.' },
        { ordinal: 2, kind: 'Skill', name: 'draft-brief', status: 'Succeeded', duration: '6.4 s', result: 'One-page brief prepared.' },
        { ordinal: 3, kind: 'MCP tool', name: '', status: 'Succeeded', duration: '2.1 s', result: 'Result recorded.' }
      ]
    },
    'RUN-3P9Q': {
      ref: 'RUN-3P9Q',
      task: 'ticket-triage',
      version: 'v1',
      state: 'Failed',
      tone: 'error',
      steps: [
        { ordinal: 1, kind: 'Skill', name: 'extract-actions', status: 'Succeeded', duration: '5.0 s', result: 'Ticket text read.' },
        { ordinal: 2, kind: 'MCP tool', name: '', status: 'Failed', duration: '3.8 s', result: 'The recorded tool returned an error.' },
        { ordinal: 3, kind: 'Skill', name: 'draft-brief', status: 'Skipped', duration: '—', result: 'Not run because step 2 failed.' }
      ]
    },
    'RUN-5C1R': {
      ref: 'RUN-5C1R',
      task: 'health-check',
      version: 'v1',
      state: 'Failed',
      tone: 'error',
      steps: []
    },
    'RUN-9T6B': {
      ref: 'RUN-9T6B',
      task: 'weekly-digest',
      version: 'v2',
      state: 'Running',
      tone: 'info',
      steps: [
        { ordinal: 1, kind: 'Skill', name: 'summarise-thread', status: 'Succeeded', duration: '8.2 s', result: 'Digest drafted from the recorded week.' },
        { ordinal: 2, kind: 'Skill', name: 'draft-brief', status: 'Running', duration: '—', result: 'In progress.' },
        { ordinal: 3, kind: 'MCP tool', name: '', status: 'Pending', duration: '—', result: 'Not started.' }
      ]
    }
  };

  const CONVERSATIONS = [
    {
      ref: 'CNV-4F7H',
      messages: [
        { role: 'user', text: COPY.demoChat },
        { role: 'assistant', text: COPY.demoReply }
      ]
    },
    {
      ref: 'CNV-7R3D',
      messages: [
        { role: 'user', text: 'Turn the onboarding checklist into three steps.' },
        { role: 'assistant', text: '1. Confirm the local account and sign-in details.\n2. Read the workspace boundary and the recorded registries.\n3. Start with one manual run and review the outcome together.' }
      ]
    },
    { ref: 'CNV-2M8X', messages: [] }
  ];

  const NEW_CONVERSATION = { ref: 'CNV-8N4K', messages: [] };

  const HREF = {
    signin: 'pg-001-sign-in.html',
    chat: 'pg-002-chat.html',
    skills: 'pg-003-skills.html',
    skill: (name) => `pg-004-skill-record.html?skill=${encodeURIComponent(name)}`,
    mcp: 'pg-005-mcp.html',
    server: (name) => `pg-006-mcp-record.html?server=${encodeURIComponent(name)}`,
    tasks: 'pg-007-tasks.html',
    runForm: (name) => `pg-008-task-run.html?task=${encodeURIComponent(name)}`,
    run: (ref) => `pg-009-run-outcome.html?run=${encodeURIComponent(ref)}`,
    newChat: 'pg-002-chat.html?state=empty&variant=new'
  };

  const PAGES = {
    'PG-001': { section: null, states: ['default', 'error', 'editing', 'submitting', 'success-failure'] },
    'PG-002': { section: 'chat', states: ['default', 'loading', 'empty', 'no-result', 'error', 'editing', 'submitting', 'success-failure', 'no-permission'] },
    'PG-003': { section: 'skills', states: ['default', 'loading', 'empty', 'error', 'no-permission'] },
    'PG-004': { section: 'skills', states: ['default', 'loading', 'no-result', 'error', 'no-permission'] },
    'PG-005': { section: 'mcp', states: ['default', 'loading', 'empty', 'error', 'no-permission'] },
    'PG-006': { section: 'mcp', states: ['default', 'loading', 'no-result', 'error', 'no-permission'] },
    'PG-007': { section: 'tasks', states: ['default', 'loading', 'empty', 'error', 'no-permission'] },
    'PG-008': { section: 'tasks', states: ['default', 'loading', 'no-result', 'error', 'editing', 'submitting', 'success-failure', 'no-permission'] },
    'PG-009': { section: 'tasks', states: ['default', 'loading', 'no-result', 'error', 'success-failure', 'no-permission'] },
    'PG-010': { section: 'skills', states: ['default', 'no-permission'] },
    'PG-011': { section: 'mcp', states: ['default', 'no-permission'] },
    'PG-012': { section: 'tasks', states: ['default', 'no-permission'] }
  };

  const DEST = {
    signin: { href: HREF.signin, label: 'Back to sign in', phrase: 'sign in' },
    skills: { href: HREF.skills, label: 'Back to Skills', phrase: 'Skills' },
    mcp: { href: HREF.mcp, label: 'Back to MCP servers', phrase: 'MCP servers' },
    tasks: { href: HREF.tasks, label: 'Back to Tasks', phrase: 'Tasks' }
  };

  if (!PAGE || !PAGES[PAGE]) {
    throw new Error(`Unknown page marker: ${PAGE}`);
  }

  /* -----------------------------------------------------------------------
     State resolution
     ----------------------------------------------------------------------- */

  const requestedState = PARAMS.get('state');
  let state = PAGES[PAGE].states.includes(requestedState) ? requestedState : 'default';

  const errorMode = PARAMS.get('error') || 'load';
  const outcome = PARAMS.get('outcome');
  const variant = PARAMS.get('variant');
  const forcedDialog = PARAMS.get('dialog') === 'discard';

  function findSkill(name) {
    return SKILLS.find((item) => item.name === name) || null;
  }
  function findServer(name) {
    return SERVERS.find((item) => item.name === name) || null;
  }
  function findTask(name) {
    return TASKS.find((item) => item.name === name) || null;
  }
  function findConversation(ref) {
    return CONVERSATIONS.find((item) => item.ref === ref) || null;
  }

  const skillParam = PARAMS.get('skill');
  const serverParam = PARAMS.get('server');
  const taskParam = PARAMS.get('task');
  const runParam = PARAMS.get('run');
  const conversationParam = PARAMS.get('conversation');

  let skill = skillParam ? findSkill(skillParam) : SKILLS[0];
  let server = serverParam ? findServer(serverParam) : SERVERS[0];
  let task = taskParam ? findTask(taskParam) : TASKS[0];
  let conversation = conversationParam ? findConversation(conversationParam) : CONVERSATIONS[0];

  const OUTCOME_RUN = {
    succeeded: 'RUN-7K2M',
    'failed-step': 'RUN-3P9Q',
    'failed-before-step': 'RUN-5C1R'
  };

  let runRef = runParam || 'RUN-7K2M';
  if (state === 'success-failure') {
    if (outcome && OUTCOME_RUN[outcome]) runRef = OUTCOME_RUN[outcome];
    else if (!runParam) runRef = 'RUN-7K2M';
  }
  let run = RUNS[runRef] || null;

  // A record reference that does not resolve is No Result, never a fabricated
  // record and never Empty. Loading and Error keep their own state.
  if (PAGE === 'PG-002' && ['default', 'editing', 'submitting', 'success-failure'].includes(state)) {
    if (state === 'success-failure' && outcome === 'failure') {
      conversation = conversationParam ? findConversation(conversationParam) : CONVERSATIONS[0];
    }
    if (!conversation) state = 'no-result';
  }
  if (PAGE === 'PG-004' && ['default'].includes(state) && !skill) state = 'no-result';
  if (PAGE === 'PG-006' && ['default'].includes(state) && !server) state = 'no-result';
  if (PAGE === 'PG-008' && !task) {
    if (['default', 'editing', 'submitting', 'success-failure'].includes(state)) state = 'no-result';
    if (state === 'error' && errorMode !== 'load') state = 'no-result';
  }
  if (PAGE === 'PG-009' && ['default', 'error'].includes(state) && !run) state = 'no-result';

  /* -----------------------------------------------------------------------
     Mutable UI model
     ----------------------------------------------------------------------- */

  const ui = {
    retry: false,
    recovered: false,
    focus: null,
    focusHeading: true,
    scrollBottom: false,
    dialog: null,
    signIn: {
      values: { name: '', credential: '' },
      errors: {},
      error: null,
      submitting: false
    },
    chat: {
      ref: conversation ? conversation.ref : '',
      messages: conversation ? conversation.messages.map((message) => ({ ...message })) : [],
      pending: false,
      draft: '',
      error: null,
      errorKind: null,
      lastFailedText: ''
    },
    run: {
      values: {},
      errors: {},
      submitting: false,
      unconfirmed: false,
      createError: false
    }
  };

  function demoRunValues(targetTask) {
    const values = {};
    targetTask.inputs.forEach((input, index) => {
      if (!input.required) {
        values[input.name] = '';
        return;
      }
      if (input.name === 'week') values[input.name] = '2026-W42';
      else if (input.name === 'ticket') values[input.name] = 'Sample ticket text';
      else if (input.name === 'queue') values[input.name] = 'support';
      else values[input.name] = index === 0 ? 'Sample input' : 'Sample';
    });
    return values;
  }

  if (PAGE === 'PG-001') {
    if (state === 'error' || state === 'success-failure') {
      ui.signIn.values.name = 'workspace-member';
      ui.signIn.error = COPY.signInError;
      ui.focus = { selector: '#signin-credential' };
    } else if (state === 'editing' || state === 'submitting') {
      ui.signIn.values.name = 'workspace-member';
      ui.signIn.values.credential = 'workspace-credential';
    }
    ui.signIn.submitting = state === 'submitting';
  }

  if (PAGE === 'PG-002') {
    if (state === 'empty' && variant === 'new') {
      conversation = NEW_CONVERSATION;
      ui.chat.ref = NEW_CONVERSATION.ref;
      ui.chat.messages = [];
    }
    if (state === 'editing') ui.chat.draft = COPY.demoChat;
    if (state === 'submitting') {
      ui.chat.messages = [{ role: 'user', text: COPY.demoChat, status: 'sending' }];
      ui.chat.pending = true;
      ui.chat.draft = '';
    }
    if (state === 'success-failure') {
      if (outcome === 'failure') {
        ui.chat.messages = [{ role: 'user', text: COPY.demoChat }];
        ui.chat.error = COPY.chatError;
        ui.chat.errorKind = 'model';
        ui.chat.lastFailedText = COPY.demoChat;
      } else {
        ui.chat.messages = [
          { role: 'user', text: COPY.demoChat },
          { role: 'assistant', text: COPY.demoReply }
        ];
      }
    }
    if (['default', 'editing', 'submitting', 'success-failure'].includes(state)) ui.scrollBottom = true;
  }

  if (PAGE === 'PG-008' && task) {
    if (state === 'editing') ui.run.values = demoRunValues(task);
    if (state === 'submitting') {
      ui.run.values = demoRunValues(task);
      ui.run.submitting = true;
      ui.focusHeading = true;
    }
    if (state === 'success-failure') {
      ui.run.values = demoRunValues(task);
      ui.run.createError = true;
      ui.focus = { selector: '#run-error' };
    }
    if (state === 'error' && errorMode === 'create') {
      ui.run.values = demoRunValues(task);
      ui.run.createError = true;
      ui.focus = { selector: '#run-error' };
    }
    if (state === 'error' && errorMode === 'unconfirmed') {
      ui.run.values = demoRunValues(task);
      ui.run.unconfirmed = true;
      ui.focus = { selector: '#run-error' };
    }
  }

  /* -----------------------------------------------------------------------
     Helpers
     ----------------------------------------------------------------------- */

  const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ESCAPES[char]);
  }

  function currentView() {
    if (ui.retry) return 'loading';
    if (ui.recovered) return 'default';
    return state;
  }

  function statusPill(label, tone) {
    const allowed = ['ok', 'warn', 'error', 'info', 'neutral'];
    const safe = allowed.includes(tone) ? tone : 'neutral';
    return `<span class="status-pill status-pill--${safe}">${esc(label)}</span>`;
  }

  function notice(strong, rest) {
    return `<div class="notice"><strong>${esc(strong)}</strong> ${esc(rest)}</div>`;
  }

  function noticeStack(items) {
    return `<div class="notice-stack">${items.join('')}</div>`;
  }

  function buttonLink(href, label, variant = 'primary', attrs = '') {
    return `<a class="btn btn--${variant}" href="${esc(href)}"${attrs}>${esc(label)}</a>`;
  }

  function retryButton() {
    return '<button type="button" class="btn btn--primary" data-action="retry">Retry</button>';
  }

  function backLink(href, label) {
    return `<a class="back-link" href="${esc(href)}"><span aria-hidden="true">←</span> ${esc(label)}</a>`;
  }

  function hiddenHeading(label) {
    return `<h1 class="sr-only" id="page-heading" tabindex="-1">${esc(label)}</h1>`;
  }

  function statePanel({ title, body, actions = '', level = 2, wrapClass = '' }) {
    const id = level === 1 ? 'page-heading' : 'state-heading';
    const tag = level === 1 ? 'h1' : 'h2';
    return `<div class="state-wrap${wrapClass ? ` ${wrapClass}` : ''}">
      <section class="state-panel" aria-labelledby="${id}">
        <${tag} class="state-title" id="${id}" tabindex="-1">${esc(title)}</${tag}>
        <p class="state-body">${esc(body)}</p>
        ${actions ? `<div class="state-actions">${actions}</div>` : ''}
      </section>
    </div>`;
  }

  function pageHeader({ eyebrow, title, count, desc, meta, pill, extra, titleClass = '' }) {
    const countHtml = count === undefined || count === null ? '' : `<span class="count">${esc(count)}</span>`;
    const pillHtml = pill ? statusPill(pill.label, pill.tone) : '';
    return `<header class="page-head">
      <div class="eyebrow">${esc(eyebrow)}</div>
      <div class="page-title-row">
        <h1 class="page-title${titleClass ? ` ${titleClass}` : ''}" id="page-heading" tabindex="-1">${esc(title)}</h1>
        ${countHtml}${pillHtml}${extra || ''}
      </div>
      ${desc ? `<p class="page-desc">${esc(desc)}</p>` : ''}
      ${meta ? `<div class="page-meta">${meta}</div>` : ''}
    </header>`;
  }

  function topbar(crumbs) {
    const items = crumbs.map((crumb, index) => {
      const current = index === crumbs.length - 1;
      const body = current
        ? `<span class="current" aria-current="page">${esc(crumb)}</span>`
        : `<span>${esc(crumb)}</span>`;
      const sep = index === 0 ? '' : '<span class="sep" aria-hidden="true">/</span>';
      return `${sep}${body}`;
    }).join('');
    return `<header class="topbar"><nav class="breadcrumb" aria-label="Breadcrumb">${items}</nav></header>`;
  }

  function sidebar({ activeRef = '', conversationMode = 'list', includeNew = false } = {}) {
    const section = PAGES[PAGE].section;
    const navItem = (key, href, label) => {
      const active = section === key;
      return `<a class="nav-link" href="${href}"${active ? ' aria-current="page"' : ''}>${label}</a>`;
    };

    let conversations = '';
    if (conversationMode === 'skeleton') {
      conversations = `<div class="conv-list" aria-hidden="true">
        <div class="skeleton sk-line"></div>
        <div class="skeleton sk-line"></div>
        <div class="skeleton sk-line"></div>
      </div>`;
    } else if (conversationMode === 'empty') {
      conversations = '<p class="sidebar-empty">No conversations yet.</p>';
    } else {
      const list = CONVERSATIONS.slice();
      if (includeNew) list.unshift(NEW_CONVERSATION);
      conversations = `<ul class="conv-list">${list.map((item) => {
        const active = item.ref === activeRef;
        return `<li><a class="conv-link" href="pg-002-chat.html?conversation=${encodeURIComponent(item.ref)}"${active ? ' aria-current="page"' : ''}>${esc(item.ref)}</a></li>`;
      }).join('')}</ul>`;
    }

    return `<aside class="sidebar" aria-label="Workspace navigation">
      <div class="sidebar-inner">
        <div class="sidebar-brand">
          <span class="sidebar-word">hound-dock</span>
          <span class="sidebar-sub">Internal agent workspace</span>
        </div>
        <a class="btn btn--secondary btn--block new-chat" href="${HREF.newChat}">New chat</a>
        <div class="sidebar-scroll">
          <div class="nav-label">Workspace</div>
          <nav class="nav" aria-label="Primary">
            ${navItem('chat', HREF.chat, 'Chat')}
            ${navItem('skills', HREF.skills, 'Skills')}
            ${navItem('mcp', HREF.mcp, 'MCP servers')}
            ${navItem('tasks', HREF.tasks, 'Tasks')}
          </nav>
          <div class="conv-section">
            <div class="conv-label">Conversations</div>
            ${conversations}
          </div>
        </div>
        <div class="sidebar-footer">
          <span class="signed-dot" aria-hidden="true"></span>
          <div>
            <div class="signed-label">Signed in</div>
            <div class="signed-sub">Local account</div>
          </div>
        </div>
      </div>
    </aside>`;
  }

  function discardDialog() {
    const body = PAGE === 'PG-008' ? COPY.discardRun : COPY.discardChat;
    return `<dialog class="dialog" id="discard-dialog" role="alertdialog" aria-labelledby="discard-title" aria-describedby="discard-body">
      <h2 class="dialog-title" id="discard-title">${COPY.discardTitle}</h2>
      <p class="dialog-body" id="discard-body">${esc(body)}</p>
      <div class="dialog-actions">
        <button type="button" class="btn btn--primary" data-action="dialog-stay">Stay</button>
        <button type="button" class="btn btn--secondary" data-action="dialog-discard">Discard</button>
      </div>
    </dialog>`;
  }

  function shell(content, { crumbs, chat = false, activeRef = '', conversationMode = 'list', includeNew = false } = {}) {
    const dialog = PAGE === 'PG-002' || PAGE === 'PG-008' ? discardDialog() : '';
    return `<div class="app-shell">
      ${sidebar({ activeRef, conversationMode, includeNew })}
      <main id="main" class="main${chat ? ' main--chat' : ''}" tabindex="-1">
        ${topbar(crumbs)}
        <div class="content${chat ? ' content--chat' : ''}">${content}</div>
      </main>
    </div>${dialog}`;
  }

  function noPermissionPanel(destination) {
    const target = DEST[destination] || DEST.signin;
    return statePanel({
      level: 1,
      wrapClass: 'state-wrap--center',
      title: 'You do not have access to this item.',
      body: `Return to ${target.phrase} to continue.`,
      actions: buttonLink(target.href, target.label, 'secondary')
    });
  }

  function skeletonCards(count) {
    return Array.from({ length: count }, () => `<div class="sk-card" aria-hidden="true">
      <div class="skeleton sk-line sk-line--lg"></div>
      <div class="skeleton sk-line"></div>
      <div class="skeleton sk-line sk-line--md"></div>
      <div class="skeleton sk-line sk-line--sm"></div>
    </div>`).join('');
  }

  function skeletonPageHead() {
    return `<div class="page-head page-head--skeleton" aria-hidden="true">
      <div class="skeleton sk-line sk-line--eyebrow"></div>
      <div class="skeleton sk-line sk-line--title"></div>
      <div class="skeleton sk-line sk-line--md"></div>
    </div>`;
  }

  function skeletonRecord(includeHead = true) {
    return `${includeHead ? skeletonPageHead() : ''}<div class="split">
      <div class="split-main">
        <div class="sk-panel" aria-hidden="true">
          <div class="skeleton sk-line sk-line--md"></div>
          <div class="skeleton sk-line"></div>
          <div class="skeleton sk-line"></div>
          <div class="skeleton sk-line sk-line--lg"></div>
        </div>
        <div class="sk-panel" aria-hidden="true">
          <div class="skeleton sk-line sk-line--sm"></div>
          <div class="skeleton sk-line"></div>
          <div class="skeleton sk-line sk-line--md"></div>
        </div>
        <div class="sk-panel" aria-hidden="true">
          <div class="skeleton sk-line sk-line--sm"></div>
          <div class="skeleton sk-line"></div>
          <div class="skeleton sk-line sk-line--md"></div>
        </div>
      </div>
      <aside class="split-side">
        <div class="sk-panel" aria-hidden="true">
          <div class="skeleton sk-line sk-line--sm"></div>
          <div class="skeleton sk-line"></div>
          <div class="skeleton sk-line sk-line--md"></div>
        </div>
      </aside>
    </div>`;
  }

  function skeletonChat() {
    return `<div class="sk-chat-row" aria-hidden="true">
      <div class="skeleton sk-bubble sk-bubble--user"></div>
      <div class="skeleton sk-bubble"></div>
    </div>
    <div class="sk-chat-row" aria-hidden="true">
      <div class="skeleton sk-bubble sk-bubble--user"></div>
      <div class="skeleton sk-bubble"></div>
    </div>`;
  }

  /* -----------------------------------------------------------------------
     PG-001 — sign in
     ----------------------------------------------------------------------- */

  function renderSignIn() {
    const { values, errors, error, submitting } = ui.signIn;
    const errorCount = Object.keys(errors).length;
    const summary = errorCount > 1
      ? `<div class="error-summary" role="alert">
          <h2>There is a problem</h2>
          <ul>${Object.entries(errors).map(([field, message]) => {
            const id = field === 'name' ? 'signin-name' : 'signin-credential';
            return `<li><button type="button" data-action="focus-field" data-field="${id}">${esc(message)}</button></li>`;
          }).join('')}</ul>
        </div>`
      : '';

    const field = (name, id, type, autocomplete, label, hint) => {
      const invalid = Boolean(errors[name]);
      const errorId = `${id}-error`;
      const described = `${id}-hint${invalid ? ` ${errorId}` : ''}`;
      return `<div class="field">
        <label class="field-label" for="${id}">${label}</label>
        <input class="input" id="${id}" name="${name}" type="${type}" autocomplete="${autocomplete}" value="${esc(values[name])}"${submitting ? ' readonly' : ''} aria-invalid="${invalid ? 'true' : 'false'}" aria-describedby="${described}">
        <p class="field-hint" id="${id}-hint">${hint}</p>
        ${invalid ? `<p class="field-error" id="${errorId}">${esc(errors[name])}</p>` : ''}
      </div>`;
    };

    return `<main id="main" class="signin-page" tabindex="-1">
      <div class="signin-shell">
        <div class="signin-brand">
          <span class="brand-word">hound-dock</span>
          <span class="brand-sub">Internal agent workspace</span>
        </div>
        <div class="signin-card">
          <h1 class="signin-title" id="page-heading" tabindex="-1">Sign in</h1>
          <p class="signin-lede">Use your workspace-local account to continue.</p>
          ${error ? `<div class="banner banner--error" role="alert">${esc(error)}</div>` : ''}
          <form data-signin-form novalidate>
            ${summary}
            ${field('name', 'signin-name', 'text', 'username', 'Sign-in name', 'The name recorded for your local workspace account.')}
            ${field('credential', 'signin-credential', 'password', 'current-password', 'Credential', 'Your credential is never shown after sign-in.')}
            <button type="submit" class="btn btn--primary btn--block"${submitting ? ' disabled' : ''}>${submitting ? 'Signing in…' : 'Sign in'}</button>
            ${submitting ? '<p class="form-status" role="status">Signing in. Please wait.</p>' : ''}
          </form>
          <p class="signin-help">Account help is available from your account administrator.</p>
        </div>
      </div>
    </main>`;
  }

  /* -----------------------------------------------------------------------
     PG-002 — chat
     ----------------------------------------------------------------------- */

  function chatHead(ref, loading = false) {
    if (loading) {
      return `<header class="chat-head">
        <div class="skeleton sk-line sk-line--md" aria-hidden="true"></div>
        <span class="chat-privacy">Private to you</span>
      </header>`;
    }
    return `<header class="chat-head">
      <h1 class="chat-title" id="page-heading" tabindex="-1">${esc(ref)}</h1>
      <span class="chat-privacy">Private to you</span>
    </header>`;
  }

  function chatComposer({ locked = false, disabled = false, value = '', error = null, errorKind = null, lastFailed = '' } = {}) {
    const isDisabled = locked || disabled;
    const errorBanner = error
      ? `<div class="banner banner--error composer-error" role="alert" id="composer-error">
          <div>${esc(error)}</div>
          ${errorKind === 'model' && lastFailed ? `<div class="banner-actions"><button type="button" class="btn btn--secondary" data-action="try-again">Try again</button></div>` : ''}
        </div>`
      : '';
    const placeholder = locked ? 'Assistant is responding…' : disabled ? 'Wait for the conversation to load…' : 'Write a message…';
    const hint = locked ? 'Wait for the assistant to finish.' : disabled ? 'Composer unavailable while the conversation loads.' : 'Enter to send · Shift+Enter for a new line';
    return `<div class="composer-wrap">
      ${errorBanner}
      <form class="composer" data-chat-form data-locked="${isDisabled ? 'true' : 'false'}">
        <label class="sr-only" for="composer-input">Message</label>
        <textarea id="composer-input" name="message" placeholder="${esc(placeholder)}"${isDisabled ? ' disabled' : ''} aria-describedby="composer-hint">${esc(value)}</textarea>
        <div class="composer-row">
          <span class="composer-hint" id="composer-hint">${hint}</span>
          <button type="submit" class="btn btn--primary"${isDisabled ? ' disabled' : ''}>${locked ? 'Sending…' : 'Send'}</button>
        </div>
      </form>
    </div>`;
  }

  function renderChatMessages() {
    const items = ui.chat.messages.map((message) => {
      if (message.role === 'user') {
        return `<li class="msg msg--user">
          <p class="bubble">${esc(message.text)}</p>
          ${message.status === 'sending' ? '<span class="msg-state">Sending</span>' : ''}
        </li>`;
      }
      return `<li class="msg msg--assistant">
        <span class="msg-label">Assistant</span>
        <div class="bubble">${esc(message.text)}</div>
      </li>`;
    });
    if (ui.chat.pending) {
      items.push(`<li class="msg msg--assistant">
        <span class="msg-label">Assistant</span>
        <div class="pending-assistant">
          <span class="pending-dots" aria-hidden="true"><span></span><span></span><span></span></span>
          <span>Assistant is responding</span>
        </div>
      </li>`);
    }
    return items.join('');
  }

  function chatColumn({ head = '', body = '', composer = '' }) {
    return `<div class="chat-page"><div class="chat-column">
      ${head}
      ${body}
      ${composer}
    </div></div>`;
  }

  function chatThread() {
    if (!ui.chat.messages.length && !ui.chat.pending) {
      return `<div class="thread">
        <div class="chat-empty"><div class="chat-empty-inner">
          <h2 class="chat-empty-title">What would you like to work through?</h2>
          <p class="chat-empty-body">This conversation is private to you.</p>
        </div></div>
      </div>`;
    }
    return `<div class="thread" role="region" aria-label="Conversation messages">
      <ol class="thread-list">${renderChatMessages()}</ol>
    </div>`;
  }

  function chatStateThread(panel) {
    return `<div class="thread">${panel}</div>`;
  }

  function chatComposerForState() {
    return chatComposer({
      locked: ui.chat.pending,
      value: ui.chat.draft,
      error: ui.chat.error,
      errorKind: ui.chat.errorKind,
      lastFailed: ui.chat.lastFailedText
    });
  }

  function renderChat(view) {
    const crumbs = ['Workspace', 'Chat'];

    if (view === 'no-permission') {
      return shell(noPermissionPanel('signin'), { crumbs, activeRef: ui.chat.ref, conversationMode: 'list' });
    }

    if (view === 'loading') {
      return shell(chatColumn({
        head: `${hiddenHeading('Chat')}${chatHead('', true)}`,
        body: `<div class="thread" aria-busy="true"><span class="sr-only">Loading conversation</span>${skeletonChat()}</div>`,
        composer: chatComposer({ disabled: true })
      }), { crumbs, chat: true, conversationMode: 'skeleton' });
    }

    if (view === 'empty' && variant === 'new') {
      return shell(chatColumn({
        head: chatHead(ui.chat.ref),
        body: chatThread(),
        composer: chatComposerForState()
      }), { crumbs, chat: true, activeRef: ui.chat.ref, includeNew: true });
    }

    if (view === 'empty') {
      return shell(chatColumn({
        head: '<h1 class="chat-title" id="page-heading" tabindex="-1">Chat</h1>',
        body: chatStateThread(statePanel({
          title: 'No conversations yet.',
          body: 'Start a conversation to work through something with the assistant.',
          actions: buttonLink(HREF.newChat, 'New chat', 'primary')
        }))
      }), { crumbs, chat: true, conversationMode: 'empty' });
    }

    if (view === 'no-result') {
      return shell(chatColumn({
        head: '<h1 class="chat-title" id="page-heading" tabindex="-1">Chat</h1>',
        body: chatStateThread(statePanel({
          title: 'Conversation unavailable',
          body: 'This conversation is not available. Your conversation list is still usable.',
          actions: buttonLink(HREF.newChat, 'New chat', 'primary')
        }))
      }), { crumbs, chat: true });
    }

    if (view === 'error') {
      return shell(chatColumn({
        head: '<h1 class="chat-title" id="page-heading" tabindex="-1">Chat</h1>',
        body: chatStateThread(statePanel({
          title: 'This page could not load.',
          body: 'The conversation was not retrieved. Retry to load it again.',
          actions: retryButton()
        })),
        composer: chatComposer({ disabled: true })
      }), { crumbs, chat: true });
    }

    return shell(chatColumn({
      head: chatHead(ui.chat.ref || 'Chat'),
      body: chatThread(),
      composer: chatComposerForState()
    }), { crumbs, chat: true, activeRef: ui.chat.ref });
  }

  /* -----------------------------------------------------------------------
     PG-003, PG-005, PG-007 — read-only registries
     ----------------------------------------------------------------------- */

  const REGISTRY = {
    'PG-003': {
      eyebrow: 'Registry / Skills',
      title: 'Skills',
      description: 'Recorded skills available in this workspace.',
      notices: [notice('Read-only.', 'Only recorded skills appear here.')],
      emptyTitle: 'No skills recorded.',
      emptyBody: 'Only recorded skills appear here.',
      errorBody: 'The skill registry was not retrieved. This is not an empty registry.',
      loading: 'Loading skills',
      items: SKILLS,
      card: (skill) => `<a class="registry-card" href="${esc(HREF.skill(skill.name))}" aria-label="Open skill ${esc(skill.name)}">
        <h2 class="card-title">${esc(skill.name)}</h2>
        <p class="card-desc">${esc(skill.description)}</p>
        <div class="card-meta">${statusPill('Recorded', 'neutral')}</div>
      </a>`
    },
    'PG-005': {
      eyebrow: 'Registry / MCP',
      title: 'MCP servers',
      description: 'Recorded MCP servers and their recorded health.',
      notices: [notice('Read-only.', 'Credential values are never shown.')],
      emptyTitle: 'No MCP servers recorded.',
      emptyBody: 'Only recorded servers appear here.',
      errorBody: 'The MCP registry was not retrieved. This is not an empty registry.',
      loading: 'Loading MCP servers',
      items: SERVERS,
      card: (server) => `<a class="registry-card" href="${esc(HREF.server(server.name))}" aria-label="Open MCP server ${esc(server.name)}">
        <h2 class="card-title">${esc(server.name)}</h2>
        <div class="card-facts">
          <div class="card-fact"><span class="fact-label">Recorded health</span>${statusPill(server.health, server.tone)}</div>
          <div class="card-fact"><span class="fact-label">Credential</span><span class="card-fact-value">${server.credential ? 'Credential reference recorded' : 'No credential reference recorded'}</span></div>
        </div>
      </a>`
    },
    'PG-007': {
      eyebrow: 'Registry / Tasks',
      title: 'Tasks',
      description: 'Recorded task definitions available for manual runs.',
      notices: [
        notice('Manual runs only.', 'A run starts only when you activate Run.'),
        notice('Read-only definitions.', 'Task definitions are not editable here.')
      ],
      emptyTitle: 'No tasks recorded.',
      emptyBody: 'Only recorded tasks can be run manually.',
      errorBody: 'The task registry was not retrieved. This is not an empty registry.',
      loading: 'Loading tasks',
      items: TASKS,
      card: (task) => `<article class="registry-card">
        <h2 class="card-title">${esc(task.name)}</h2>
        <p class="card-desc">${esc(task.description)}</p>
        <div class="card-meta">
          <span class="card-version">${esc(task.version)}</span>
          <span class="card-steps">${task.steps} ${task.steps === 1 ? 'step' : 'steps'}</span>
        </div>
        <div class="card-actions">
          <a class="btn btn--primary" href="${esc(HREF.runForm(task.name))}" aria-label="Run ${esc(task.name)}">Run</a>
        </div>
      </article>`
    }
  };

  function renderRegistry(view) {
    const config = REGISTRY[PAGE];
    const parent = PAGE === 'PG-003' ? 'Skills' : PAGE === 'PG-005' ? 'MCP servers' : 'Tasks';
    const crumbs = ['Workspace', parent];

    if (view === 'no-permission') {
      return shell(noPermissionPanel('signin'), { crumbs });
    }

    const loading = view === 'loading';
    const error = view === 'error';
    const empty = view === 'empty';
    const count = loading || error ? '—' : empty ? '0 recorded' : `${config.items.length} recorded`;

    const header = pageHeader({
      eyebrow: config.eyebrow,
      title: config.title,
      count,
      desc: config.description,
      meta: ''
    });

    let body = '';
    if (loading) {
      body = `<span class="sr-only">${esc(config.loading)}</span>
        <div class="registry-grid" aria-busy="true">${skeletonCards(3)}</div>`;
    } else if (error) {
      body = statePanel({
        title: 'This page could not load.',
        body: config.errorBody,
        actions: retryButton()
      });
    } else if (empty) {
      body = statePanel({ title: config.emptyTitle, body: config.emptyBody });
    } else {
      body = `<div class="registry-grid">${config.items.map(config.card).join('')}</div>`;
    }

    return shell(`${header}${noticeStack(config.notices)}${body}`, { crumbs });
  }

  /* -----------------------------------------------------------------------
     PG-004 — skill record
     ----------------------------------------------------------------------- */

  function recordFacts(rows, note) {
    return `<section class="facts">
      <h2 class="facts-title">Record facts</h2>
      <dl class="fact-list">
        ${rows.map(([label, value]) => `<div class="fact-row">
          <dt class="fact-label">${esc(label)}</dt>
          <dd class="fact-value">${value}</dd>
        </div>`).join('')}
      </dl>
      ${note ? `<p class="fact-note">${esc(note)}</p>` : ''}
    </section>`;
  }

  function renderSkillRecord(view) {
    const back = backLink(HREF.skills, 'Back to Skills');
    const name = skill ? skill.name : (skillParam || 'Skill record');
    const crumbs = ['Workspace', 'Skills', name];

    if (view === 'no-permission') {
      return shell(noPermissionPanel('signin'), { crumbs: ['Workspace', 'Skills'] });
    }
    if (view === 'loading') {
      return shell(`${back}${hiddenHeading('Skill record')}<span class="sr-only">Loading skill record</span>${skeletonRecord()}`, { crumbs });
    }
    if (view === 'no-result' || !skill) {
      return shell(`${back}${statePanel({
        title: 'This skill is not in the registry.',
        body: 'No record was found for this reference.',
        level: 1
      })}`, { crumbs });
    }
    if (view === 'error') {
      return shell(`${back}${statePanel({
        title: 'This page could not load.',
        body: 'The skill record was not retrieved. Retry, or return to Skills.',
        actions: retryButton(),
        level: 1
      })}`, { crumbs });
    }

    const inputs = skill.inputs.length
      ? `<dl class="def-list">${skill.inputs.map((input) => `<div class="def-row">
          <dt class="def-term"><span>${esc(input.name)}</span><span class="req-tag">${input.required ? 'Required' : 'Optional'}</span></dt>
          <dd class="def-desc">${esc(input.hint)}</dd>
        </div>`).join('')}</dl>`
      : '<p class="prose">No inputs declared.</p>';

    const content = `${back}
      <header class="page-head">
        <div class="eyebrow">Skill record</div>
        <div class="page-title-row">
          <h1 class="page-title" id="page-heading" tabindex="-1">${esc(skill.name)}</h1>
          ${statusPill('Recorded', 'neutral')}
        </div>
      </header>
      ${notice('Read-only.', 'Skill definitions are shown as recorded.')}
      <div class="split">
        <div class="split-main">
          <section class="panel">
            <h2 class="panel-title">Description</h2>
            <p class="prose">${esc(skill.description)}</p>
          </section>
          <section class="panel">
            <h2 class="panel-title">Instructions</h2>
            <p class="prose">${esc(skill.instructions)}</p>
          </section>
          <section class="panel">
            <h2 class="panel-title">Input definition</h2>
            ${inputs}
          </section>
        </div>
        <aside class="split-side">
          ${recordFacts([
            ['Name', esc(skill.name)],
            ['Recorded', 'Yes'],
            ['Version', skill.version ? `${esc(skill.version)} <span class="muted">Proposed metadata</span>` : '<span class="muted">Not provided</span>']
          ], 'Version labels are proposed metadata. Tool dependencies are not shown.')}
        </aside>
      </div>`;

    return shell(content, { crumbs });
  }

  /* -----------------------------------------------------------------------
     PG-006 — MCP server record
     ----------------------------------------------------------------------- */

  function renderMcpRecord(view) {
    const back = backLink(HREF.mcp, 'Back to MCP servers');
    const name = server ? server.name : (serverParam || 'Server record');
    const crumbs = ['Workspace', 'MCP servers', name];

    if (view === 'no-permission') {
      return shell(noPermissionPanel('signin'), { crumbs: ['Workspace', 'MCP servers'] });
    }
    if (view === 'loading') {
      return shell(`${back}${hiddenHeading('MCP server record')}<span class="sr-only">Loading MCP server record</span>${skeletonRecord()}`, { crumbs });
    }
    if (view === 'no-result' || !server) {
      return shell(`${back}${statePanel({
        title: 'This server is not in the registry.',
        body: 'No record was found for this reference.',
        level: 1
      })}`, { crumbs });
    }
    if (view === 'error') {
      return shell(`${back}${statePanel({
        title: 'This page could not load.',
        body: 'The server record was not retrieved. Retry, or return to MCP servers.',
        actions: retryButton(),
        level: 1
      })}`, { crumbs });
    }

    const toolCount = server.toolRefCount === 0
      ? 'No tool references recorded'
      : `${server.toolRefCount} tool references recorded`;

    const content = `${back}
      <header class="page-head">
        <div class="eyebrow">MCP server record</div>
        <div class="page-title-row">
          <h1 class="page-title" id="page-heading" tabindex="-1">${esc(server.name)}</h1>
          ${statusPill(server.health, server.tone)}
        </div>
      </header>
      ${notice('Read-only.', 'Credential values and individual tool names are not shown.')}
      <div class="split">
        <div class="split-main">
          <section class="panel">
            <h2 class="panel-title">Connection</h2>
            <dl class="def-list">
              <div class="def-row"><dt class="def-term">Connection type</dt><dd class="def-desc">${esc(server.connectionType)}</dd></div>
              <div class="def-row"><dt class="def-term">Endpoint reference</dt><dd class="def-desc"><span class="code-block">${esc(server.endpoint)}</span></dd></div>
              <div class="def-row"><dt class="def-term">Credential reference</dt><dd class="def-desc">${server.credential ? 'Recorded' : 'Not recorded'}</dd></div>
              <div class="def-row"><dt class="def-term">Timeout</dt><dd class="def-desc">${esc(server.timeout)}</dd></div>
            </dl>
          </section>
          <section class="panel">
            <h2 class="panel-title">Tool references</h2>
            <p class="prose">${esc(toolCount)}</p>
            <p class="fact-note">Individual tool names and access flags are not shown.</p>
          </section>
        </div>
        <aside class="split-side">
          ${recordFacts([
            ['Name', esc(server.name)],
            ['Recorded', 'Yes'],
            ['Recorded health', statusPill(server.health, server.tone)],
            ['Credential reference', server.credential ? 'Recorded' : 'Not recorded'],
            ['Tool references', esc(toolCount)]
          ], 'Credential values are never displayed.')}
        </aside>
      </div>`;

    return shell(content, { crumbs });
  }

  /* -----------------------------------------------------------------------
     PG-008 — task run
     ----------------------------------------------------------------------- */

  function runInputId(targetTask, input) {
    return `run-${targetTask.name}-${input.name}`.replace(/[^a-zA-Z0-9_-]/g, '-');
  }

  function renderRunField(targetTask, input) {
    const id = runInputId(targetTask, input);
    const error = ui.run.errors[input.name];
    const described = `${id}-hint${error ? ` ${id}-error` : ''}`;
    return `<div class="field">
      <label class="field-label" for="${id}">${esc(input.name)} <span class="field-optional">${input.required ? 'Required' : 'Optional'}</span></label>
      <input class="input" id="${id}" data-run-input name="${esc(input.name)}" type="text" value="${esc(ui.run.values[input.name] || '')}"${ui.run.submitting || ui.run.unconfirmed ? ' readonly' : ''} aria-invalid="${error ? 'true' : 'false'}" aria-describedby="${described}">
      <p class="field-hint" id="${id}-hint">${esc(input.hint)}</p>
      ${error ? `<p class="field-error" id="${id}-error">${esc(error)}</p>` : ''}
    </div>`;
  }

  function renderTaskRun(view) {
    const back = backLink(HREF.tasks, 'Back to Tasks');
    const taskName = task ? task.name : (taskParam || 'Task run');
    const crumbs = ['Workspace', 'Tasks', taskName];

    if (view === 'no-permission') {
      return shell(noPermissionPanel('signin'), { crumbs: ['Workspace', 'Tasks'] });
    }
    if (view === 'loading') {
      return shell(`${back}${hiddenHeading('Task run')}<span class="sr-only">Loading task definition</span>${skeletonRecord()}`, { crumbs });
    }
    if (view === 'no-result' || !task) {
      return shell(`${back}${statePanel({
        title: 'This task is not in the registry.',
        body: 'No run form is available for this reference.',
        level: 1
      })}`, { crumbs });
    }
    if (view === 'error' && errorMode === 'load') {
      return shell(`${back}${statePanel({
        title: 'This page could not load.',
        body: 'The task definition was not retrieved. Retry, or return to Tasks.',
        actions: retryButton(),
        level: 1
      })}`, { crumbs });
    }

    const formState = view === 'error' && errorMode === 'unconfirmed' ? 'unconfirmed'
      : (view === 'error' && errorMode === 'create') || view === 'success-failure' ? 'create'
        : 'form';
    const submitting = view === 'submitting' || ui.run.submitting;
    const unconfirmed = formState === 'unconfirmed' || ui.run.unconfirmed;
    const createError = formState === 'create' || ui.run.createError;

    const errors = Object.values(ui.run.errors);
    const summary = errors.length > 1
      ? `<div class="error-summary" role="alert">
          <h2>There is a problem</h2>
          <ul>${task.inputs.filter((input) => ui.run.errors[input.name]).map((input) => `<li><button type="button" data-action="focus-field" data-field="${runInputId(task, input)}">${esc(ui.run.errors[input.name])}</button></li>`).join('')}</ul>
        </div>`
      : '';

    const banner = createError
      ? `<div class="banner banner--error form-banner" role="alert" id="run-error" tabindex="-1">${esc(COPY.runNoCreate)}</div>`
      : unconfirmed
        ? `<div class="banner banner--warn form-banner" role="alert" id="run-error" tabindex="-1">
            <div><strong>Run start unconfirmed.</strong> Do not start another run; contact the team operating the workspace.</div>
          </div>`
        : '';

    const fields = task.inputs.length
      ? task.inputs.map((input) => renderRunField(task, input)).join('')
      : '<p class="prose">No inputs required.</p>';

    const startButton = `<button type="submit" class="btn btn--primary" id="start-run"${submitting || unconfirmed ? ' disabled' : ''}>${submitting ? 'Starting run…' : 'Start run'}</button>`;

    const content = `${back}
      <header class="page-head">
        <div class="eyebrow">Manual run</div>
        <div class="page-title-row">
          <h1 class="page-title" id="page-heading" tabindex="-1">${esc(task.name)}</h1>
          <span class="card-version">${esc(task.version)}</span>
        </div>
        <p class="page-desc">${esc(task.description)}</p>
        <div class="page-meta"><span>Manual run — this run is started by you.</span></div>
      </header>
      ${notice('Read-only.', 'The task definition cannot be changed here.')}
      <div class="split">
        <div class="split-main">
          <section class="panel run-form-panel">
            <h2 class="panel-title">Run inputs</h2>
            <form data-run-form data-task="${esc(task.name)}" novalidate>
              ${banner}
              ${summary}
              ${fields}
              <div class="form-actions">
                ${unconfirmed ? buttonLink(HREF.tasks, 'Back to Tasks', 'secondary') : startButton}
              </div>
              ${submitting ? '<p class="form-status" role="status">Starting run. Please wait.</p>' : ''}
            </form>
          </section>
        </div>
        <aside class="split-side">
          <section class="facts">
            <h2 class="facts-title">Run composition</h2>
            <dl class="fact-list">
              <div class="fact-row"><dt class="fact-label">Task</dt><dd class="fact-value">${esc(task.name)}</dd></div>
              <div class="fact-row"><dt class="fact-label">Version</dt><dd class="fact-value">${esc(task.version)}</dd></div>
              <div class="fact-row"><dt class="fact-label">Steps</dt><dd class="fact-value">${task.steps}</dd></div>
              <div class="fact-row"><dt class="fact-label">Initiation</dt><dd class="fact-value">Manual run only</dd></div>
            </dl>
            <p class="fact-note">The task definition is read-only on this page.</p>
          </section>
        </aside>
      </div>`;

    return shell(content, { crumbs });
  }

  /* -----------------------------------------------------------------------
     PG-009 — run outcome
     ----------------------------------------------------------------------- */

  function stepTone(status) {
    if (status === 'Succeeded') return 'ok';
    if (status === 'Failed') return 'error';
    if (status === 'Running') return 'info';
    return 'neutral';
  }

  function outcomeSummary(targetRun) {
    if (targetRun.state === 'Succeeded') {
      return { tone: 'ok', title: 'Succeeded', body: 'Every step succeeded.' };
    }
    if (targetRun.state === 'Failed') {
      if (targetRun.steps.length === 0) {
        return { tone: 'error', title: 'Failed', body: COPY.runRejected };
      }
      const failed = targetRun.steps.find((step) => step.status === 'Failed');
      return { tone: 'error', title: 'Failed', body: `Run failed at step ${failed ? failed.ordinal : '—'}. Remaining steps were skipped.` };
    }
    if (targetRun.state === 'Running') {
      return { tone: 'info', title: 'Running', body: 'The run is still running. The current step status is shown.' };
    }
    return { tone: 'neutral', title: 'Initiated', body: 'The run was created and is waiting for its first step.' };
  }

  function renderSteps(targetRun) {
    if (targetRun.steps.length === 0) {
      return `<div class="no-steps">
        <h2 class="no-steps-title">No step results</h2>
        <p class="no-steps-body">${esc(COPY.runRejected)}</p>
      </div>`;
    }
    const hasMcp = targetRun.steps.some((step) => step.kind === 'MCP tool');
    return `<div class="table-panel">
      <table class="steps-table">
        <caption class="sr-only">Run steps for ${esc(targetRun.ref)}</caption>
        <thead><tr>
          <th scope="col">Step</th>
          <th scope="col">Target</th>
          <th scope="col">Status</th>
          <th scope="col">Duration</th>
          <th scope="col">Result</th>
        </tr></thead>
        <tbody>${targetRun.steps.map((step) => `<tr>
          <td class="step-ordinal">${step.ordinal}</td>
          <td class="step-target">
            <span class="step-kind">${esc(step.kind)}</span>
            ${step.name ? `<span class="step-name">${esc(step.name)}</span>` : ''}
          </td>
          <td class="step-status">${statusPill(step.status, stepTone(step.status))}</td>
          <td class="step-duration" data-label="Duration">${esc(step.duration || '—')}</td>
          <td class="step-result" data-label="Result">${esc(step.result || '—')}</td>
        </tr>`).join('')}</tbody>
      </table>
      ${hasMcp ? '<div class="table-note">MCP tool names are not shown.</div>' : ''}
    </div>`;
  }

  function renderRunOutcome(view) {
    const back = backLink(HREF.tasks, 'Back to Tasks');
    const targetRef = run ? run.ref : runRef;
    const crumbs = ['Workspace', 'Tasks', targetRef];

    if (view === 'no-permission') {
      return shell(noPermissionPanel('signin'), { crumbs: ['Workspace', 'Tasks'] });
    }
    if (view === 'loading') {
      return shell(`${back}
        <header class="page-head">
          <div class="eyebrow">Run outcome</div>
          <div class="page-title-row"><h1 class="page-title page-title--reference" id="page-heading" tabindex="-1">${esc(targetRef)}</h1></div>
        </header>
        <span class="sr-only">Loading run outcome</span>${skeletonRecord(false)}`, { crumbs });
    }
    if (view === 'no-result' || !run) {
      return shell(`${back}${statePanel({
        title: 'This run is not available.',
        body: 'The run reference did not resolve.',
        level: 1
      })}`, { crumbs });
    }

    const summary = outcomeSummary(run);
    const statusBanner = view === 'error'
      ? `<div class="banner banner--warn outcome-banner" role="status">
          <div><strong>Status unavailable.</strong> The last reported state is shown.</div>
          <div class="banner-actions">${retryButton()}</div>
        </div>`
      : '';

    const content = `${back}
      <header class="page-head">
        <div class="eyebrow">Run outcome</div>
        <div class="page-title-row">
          <h1 class="page-title page-title--reference" id="page-heading" tabindex="-1">${esc(run.ref)}</h1>
          ${statusPill(run.state, run.tone)}
        </div>
        <div class="page-meta">
          <span>Initiated by you</span>
          <span>${esc(run.task)} · ${esc(run.version)}</span>
        </div>
      </header>
      ${statusBanner}
      <div class="split">
        <div class="split-main">
          <div class="outcome outcome--${summary.tone}">
            <div>
              <div class="outcome-title">${esc(summary.title)}</div>
              <div class="outcome-body">${esc(summary.body)}</div>
            </div>
          </div>
          ${renderSteps(run)}
          <div class="run-actions">
            ${buttonLink(HREF.runForm(run.task), 'Start a new run', 'primary')}
            ${buttonLink(HREF.tasks, 'Back to Tasks', 'secondary')}
          </div>
        </div>
        <aside class="split-side">
          <section class="facts">
            <h2 class="facts-title">Run summary</h2>
            <dl class="fact-list">
              <div class="fact-row"><dt class="fact-label">Run reference</dt><dd class="fact-value">${esc(run.ref)}</dd></div>
              <div class="fact-row"><dt class="fact-label">Task</dt><dd class="fact-value">${esc(run.task)}</dd></div>
              <div class="fact-row"><dt class="fact-label">Version</dt><dd class="fact-value">${esc(run.version)}</dd></div>
              <div class="fact-row"><dt class="fact-label">Reported state</dt><dd class="fact-value">${statusPill(run.state, run.tone)}</dd></div>
            </dl>
            <p class="fact-note">The run outcome is read-only.</p>
          </section>
        </aside>
      </div>`;

    return shell(content, { crumbs });
  }

  /* -----------------------------------------------------------------------
     PG-010 to PG-012 — proposed routes, shared No Permission panel
     ----------------------------------------------------------------------- */

  function renderDenied() {
    const parent = PAGE === 'PG-010' ? 'skills' : PAGE === 'PG-011' ? 'mcp' : 'tasks';
    const crumb = parent === 'skills' ? 'Skills' : parent === 'mcp' ? 'MCP servers' : 'Tasks';
    return shell(noPermissionPanel(parent), { crumbs: ['Workspace', crumb] });
  }

  /* -----------------------------------------------------------------------
     Render dispatch and focus
     ----------------------------------------------------------------------- */

  function renderCurrentPage() {
    const view = currentView();
    if (PAGE === 'PG-001') return renderSignIn(view);
    if (PAGE === 'PG-002') return renderChat(view);
    if (PAGE === 'PG-003' || PAGE === 'PG-005' || PAGE === 'PG-007') return renderRegistry(view);
    if (PAGE === 'PG-004') return renderSkillRecord(view);
    if (PAGE === 'PG-006') return renderMcpRecord(view);
    if (PAGE === 'PG-008') return renderTaskRun(view);
    if (PAGE === 'PG-009') return renderRunOutcome(view);
    return renderDenied(view);
  }

  function focusElement(selector, cursor) {
    const element = document.querySelector(selector);
    if (!element) return;
    element.focus();
    if (cursor === 'end' && typeof element.setSelectionRange === 'function') {
      const end = element.value.length;
      element.setSelectionRange(end, end);
    }
  }

  function focusHeading() {
    const heading = document.getElementById('page-heading');
    if (heading) heading.focus({ preventScroll: true });
  }

  function renderApp() {
    const threadBefore = document.querySelector('.thread');
    const scrollBefore = threadBefore ? threadBefore.scrollTop : 0;
    document.body.dataset.state = state;
    document.body.dataset.view = currentView();
    APP.innerHTML = renderCurrentPage();

    const threadAfter = document.querySelector('.thread');
    if (threadAfter) {
      threadAfter.scrollTop = ui.scrollBottom ? threadAfter.scrollHeight : scrollBefore;
    }
    ui.scrollBottom = false;

    if (ui.dialog) {
      const dialog = document.getElementById('discard-dialog');
      if (dialog && !dialog.open) {
        if (typeof dialog.showModal === 'function') dialog.showModal();
        else dialog.setAttribute('open', '');
      }
    }

    if (ui.focus) {
      const target = ui.focus;
      ui.focus = null;
      focusElement(target.selector, target.cursor);
    } else if (ui.focusHeading) {
      focusHeading();
    }
    ui.focusHeading = false;
  }

  function announce(message) {
    if (!LIVE) return;
    LIVE.textContent = '';
    window.setTimeout(() => { LIVE.textContent = message; }, 20);
  }

  /* -----------------------------------------------------------------------
     Dialog
     ----------------------------------------------------------------------- */

  function openDiscard(target, type, trigger) {
    const dialog = document.getElementById('discard-dialog');
    if (!dialog) return;
    ui.dialog = { target: target || '', type, trigger: trigger || null };
    if (!dialog.open) {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    }
    const stay = dialog.querySelector('[data-action="dialog-stay"]');
    if (stay) stay.focus();
  }

  function closeDiscard({ discard = false } = {}) {
    const dialog = document.getElementById('discard-dialog');
    const current = ui.dialog;
    ui.dialog = null;
    if (dialog && dialog.open) dialog.close();
    else if (dialog) dialog.removeAttribute('open');

    if (discard) {
      if (current && current.target) {
        window.location.href = current.target;
        return;
      }
      if (current && current.type === 'run') {
        ui.run.values = {};
        ui.run.errors = {};
        ui.run.createError = false;
        ui.run.unconfirmed = false;
      } else {
        ui.chat.draft = '';
      }
      ui.focusHeading = true;
      renderApp();
      return;
    }

    if (current && current.trigger && document.contains(current.trigger)) {
      current.trigger.focus();
    } else {
      focusHeading();
    }
  }

  /* -----------------------------------------------------------------------
     Sign-in behaviour
     ----------------------------------------------------------------------- */

  function handleSignIn(form) {
    if (ui.signIn.submitting) return;
    const nameInput = form.elements['name'];
    const credentialInput = form.elements['credential'];
    const name = nameInput ? nameInput.value : '';
    const credential = credentialInput ? credentialInput.value : '';
    const errors = {};
    if (name.length === 0) errors.name = COPY.signInEmptyName;
    if (credential.length === 0) errors.credential = COPY.signInEmptyCredential;

    ui.signIn.values = { name, credential };

    if (Object.keys(errors).length > 0) {
      ui.signIn.errors = errors;
      ui.signIn.error = null;
      ui.focus = { selector: errors.name ? '#signin-name' : '#signin-credential' };
      renderApp();
      announce('The sign-in form has an error.');
      return;
    }

    ui.signIn.errors = {};
    ui.signIn.error = null;
    ui.signIn.submitting = true;
    ui.focusHeading = true;
    renderApp();
    announce('Signing in.');

    window.setTimeout(() => {
      // Replace the pre-session entry so PG-001 is not a usable Back entry.
      window.location.replace(HREF.chat);
    }, 700);
  }

  /* -----------------------------------------------------------------------
     Chat behaviour
     ----------------------------------------------------------------------- */

  function handleChatSend(form) {
    if (ui.chat.pending) return;
    const textarea = form.querySelector('textarea');
    const text = textarea ? textarea.value : '';
    if (text.length === 0) {
      ui.chat.error = COPY.emptyMessage;
      ui.chat.errorKind = 'empty';
      ui.focus = { selector: '#composer-input' };
      renderApp();
      announce(COPY.emptyMessage);
      return;
    }

    ui.chat.error = null;
    ui.chat.errorKind = null;
    ui.chat.lastFailedText = text;
    ui.chat.messages.push({ role: 'user', text, status: 'sending' });
    ui.chat.pending = true;
    ui.chat.draft = '';
    ui.scrollBottom = true;
    renderApp();
    announce('Message sent. Assistant is responding.');

    window.setTimeout(() => {
      const pendingMessage = ui.chat.messages.find((message) => message.status === 'sending');
      if (pendingMessage) delete pendingMessage.status;
      ui.chat.messages.push({ role: 'assistant', text: COPY.demoReply });
      ui.chat.pending = false;
      ui.scrollBottom = true;
      ui.focus = { selector: '#composer-input', cursor: 'end' };
      renderApp();
      announce('Assistant response received.');
    }, 900);
  }

  function tryAgain() {
    if (!ui.chat.lastFailedText) return;
    ui.chat.error = null;
    ui.chat.errorKind = null;
    ui.chat.draft = ui.chat.lastFailedText;
    ui.focus = { selector: '#composer-input', cursor: 'end' };
    renderApp();
  }

  function hasUnsentDraft() {
    if (PAGE === 'PG-002') return !ui.chat.pending && ui.chat.draft.length > 0;
    if (PAGE === 'PG-008') {
      if (ui.run.submitting || ui.run.unconfirmed) return false;
      const form = document.querySelector('[data-run-form]');
      if (!form) return false;
      return Array.from(form.querySelectorAll('[data-run-input]')).some((input) => input.value.length > 0);
    }
    return false;
  }

  /* -----------------------------------------------------------------------
     Run behaviour
     ----------------------------------------------------------------------- */

  function handleRunSubmit(form) {
    if (!task || ui.run.submitting || ui.run.unconfirmed) return;
    const values = {};
    task.inputs.forEach((input) => {
      const field = form.elements[input.name];
      values[input.name] = field ? field.value : '';
    });
    const errors = {};
    task.inputs.filter((input) => input.required).forEach((input) => {
      if (values[input.name].length === 0) errors[input.name] = `Enter a value for ${input.name}.`;
    });

    ui.run.values = values;

    if (Object.keys(errors).length > 0) {
      ui.run.errors = errors;
      const first = task.inputs.find((input) => errors[input.name]);
      ui.focus = { selector: `#${runInputId(task, first)}` };
      renderApp();
      announce('The run form has an error. No run was created.');
      return;
    }

    ui.run.errors = {};
    ui.run.submitting = true;
    ui.focusHeading = true;
    renderApp();
    announce('Starting run.');

    window.setTimeout(() => {
      window.location.href = task.outcome;
    }, 800);
  }

  function handleRetry() {
    if (ui.retry) return;
    ui.retry = true;
    ui.recovered = false;
    ui.focusHeading = true;
    renderApp();
    announce('Loading.');

    window.setTimeout(() => {
      ui.retry = false;
      ui.recovered = true;
      ui.focusHeading = true;
      renderApp();
      announce('Loaded.');
    }, 700);
  }

  /* -----------------------------------------------------------------------
     Event wiring
     ----------------------------------------------------------------------- */

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (form.matches('[data-signin-form]')) {
      event.preventDefault();
      handleSignIn(form);
    } else if (form.matches('[data-chat-form]')) {
      event.preventDefault();
      handleChatSend(form);
    } else if (form.matches('[data-run-form]')) {
      event.preventDefault();
      handleRunSubmit(form);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.target.id !== 'composer-input') return;
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
    event.preventDefault();
    const form = event.target.closest('[data-chat-form]');
    if (form) {
      if (typeof form.requestSubmit === 'function') form.requestSubmit();
      else form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  });

  document.addEventListener('input', (event) => {
    const target = event.target;
    if (target.id === 'composer-input') {
      ui.chat.draft = target.value;
      if (ui.chat.error && ui.chat.errorKind === 'empty' && target.value.length > 0) {
        ui.chat.error = null;
        ui.chat.errorKind = null;
        const banner = document.getElementById('composer-error');
        if (banner) banner.remove();
      }
      return;
    }
    if (target.matches('[data-run-input]')) {
      ui.run.values[target.name] = target.value;
      if (ui.run.errors[target.name] && target.value.length > 0) {
        delete ui.run.errors[target.name];
        target.setAttribute('aria-invalid', 'false');
        const error = document.getElementById(`${target.id}-error`);
        if (error) error.remove();
      }
    }
  });

  document.addEventListener('focusout', (event) => {
    const target = event.target;
    if (!target.matches('[data-run-input]') || !task) return;
    const input = task.inputs.find((item) => item.name === target.name);
    if (!input || !input.required) return;
    if (target.value.length > 0) return;
    const message = `Enter a value for ${input.name}.`;
    ui.run.errors[input.name] = message;
    target.setAttribute('aria-invalid', 'true');
    const errorId = `${target.id}-error`;
    if (!document.getElementById(errorId)) {
      const paragraph = document.createElement('p');
      paragraph.className = 'field-error';
      paragraph.id = errorId;
      paragraph.textContent = message;
      target.closest('.field').appendChild(paragraph);
      const described = target.getAttribute('aria-describedby') || '';
      if (!described.includes(errorId)) target.setAttribute('aria-describedby', `${described} ${errorId}`.trim());
    }
  });

  document.addEventListener('click', (event) => {
    const actionTarget = event.target.closest('[data-action]');
    if (actionTarget) {
      const action = actionTarget.getAttribute('data-action');
      if (action === 'retry') {
        event.preventDefault();
        handleRetry();
        return;
      }
      if (action === 'focus-field') {
        event.preventDefault();
        focusElement(`#${actionTarget.getAttribute('data-field')}`);
        return;
      }
      if (action === 'try-again') {
        event.preventDefault();
        tryAgain();
        return;
      }
      if (action === 'dialog-stay') {
        event.preventDefault();
        closeDiscard({ discard: false });
        return;
      }
      if (action === 'dialog-discard') {
        event.preventDefault();
        closeDiscard({ discard: true });
        return;
      }
    }

    const link = event.target.closest('a[href]');
    if (!link) return;
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || link.target === '_blank' || link.hasAttribute('download')) return;
    if (hasUnsentDraft()) {
      event.preventDefault();
      openDiscard(link.href, PAGE === 'PG-008' ? 'run' : 'chat', link);
    }
  });

  document.addEventListener('cancel', (event) => {
    if (event.target.id !== 'discard-dialog') return;
    event.preventDefault();
    closeDiscard({ discard: false });
  }, true);

  /* -----------------------------------------------------------------------
     Boot
     ----------------------------------------------------------------------- */

  document.body.dataset.pg = PAGE;
  document.body.dataset.state = state;
  renderApp();

  if (PAGE === 'PG-001' && (state === 'error' || state === 'success-failure')) {
    focusElement('#signin-credential');
  }

  if (PAGE === 'PG-008' && (state === 'success-failure' || (state === 'error' && (errorMode === 'create' || errorMode === 'unconfirmed')))) {
    const banner = document.getElementById('run-error');
    if (banner) banner.focus();
  }

  if (forcedDialog && (PAGE === 'PG-002' || PAGE === 'PG-008')) {
    openDiscard('', PAGE === 'PG-008' ? 'run' : 'chat', null);
  }

  window.HF = Object.freeze({
    page: PAGE,
    state,
    view: currentView(),
    supported: Object.freeze(PAGES[PAGE].states.slice())
  });
})();
