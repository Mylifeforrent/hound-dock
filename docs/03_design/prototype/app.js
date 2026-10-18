/* =========================================================================
   hound-dock interaction prototype
   Static, hash-routed, synthetic data only. No build, dependency, network,
   backend, or persistence. Design artifact for docs/03_design/prototype/.
   Input authority: business_model.md v0.2 > interaction_design.md v0.1.
   ========================================================================= */
(() => {
  'use strict';

  const APP = document.getElementById('app');
  const REVIEW = document.getElementById('review-root');
  const LIVE = document.getElementById('live-region');

  const GENERIC_SIGNIN_ERROR = 'Sign-in failed. Check your sign-in name and credential.';
  const SESSION_ENDED = 'Your session ended. Sign in again to continue.';
  const CHAT_MODEL_ERROR = 'The assistant could not respond. Your message was kept. Try again.';
  const EMPTY_MESSAGE_ERROR = 'Enter a message before sending.';
  const RUN_NO_CREATE = 'The run could not be started. No run was created.';
  const RUN_UNCONFIRMED = 'Run start unconfirmed. Do not start another run; contact the team operating the workspace.';
  const RUN_REJECTED = 'The run was rejected before any step. No step results were recorded.';
  const DEMO_CHAT_TEXT = 'Draft a short note to the team about the maintenance window.';
  const DEMO_REPLY = 'Here is a short working draft you can adapt:\n\n1. Confirm the maintenance window and the systems affected.\n2. Name the expected impact and the rollback point.\n3. Close with the next update time.\n\nTell me if you want it shorter or more formal.';

  /* -----------------------------------------------------------------------
     Synthetic fixtures
     ----------------------------------------------------------------------- */

  const SKILL_FIXTURES = [
    {
      name: 'summarise-thread',
      description: 'Turns a supplied discussion into decisions, open questions, and next steps.',
      instructions: 'Read the supplied discussion and keep the summary neutral. Return three short groups: decisions, open questions, and next steps. Do not add a recommendation that is not present in the discussion.',
      inputs: [
        { name: 'text', required: true, hint: 'The discussion to summarise.' }
      ],
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
      description: 'Extracts action items, owners, and due points from a supplied transcript.',
      instructions: 'Read the transcript and list every explicit action item. Keep the owner wording exactly as recorded. If no owner or due point is stated, write “Not stated” rather than guessing.',
      inputs: [
        { name: 'transcript', required: true, hint: 'The transcript to read.' }
      ],
      version: 'v2'
    }
  ];

  const MCP_FIXTURES = [
    {
      name: 'search-gateway',
      health: 'Connected',
      tone: 'ok',
      credential: true,
      connectionType: 'HTTP',
      endpoint: 'https://search.example/mcp',
      timeout: '30 s',
      toolRefCount: 4
    },
    {
      name: 'docs-index',
      health: 'Needs authentication',
      tone: 'warn',
      credential: false,
      connectionType: 'HTTP',
      endpoint: 'https://docs.example/mcp',
      timeout: '30 s',
      toolRefCount: 0
    },
    {
      name: 'ticket-bridge',
      health: 'Error',
      tone: 'error',
      credential: true,
      connectionType: 'HTTP',
      endpoint: 'https://tickets.example/mcp',
      timeout: '20 s',
      toolRefCount: 2
    }
  ];

  const TASK_FIXTURES = [
    {
      name: 'weekly-digest',
      description: 'Collects the week’s recorded notes and produces a digest.',
      version: 'v2',
      inputs: [
        { name: 'week', required: true, hint: 'The week to summarise, for example 2026-W42.' },
        { name: 'focus', required: false, hint: 'An optional focus area.' }
      ],
      steps: [
        { kind: 'skill', skill: 'summarise-thread' },
        { kind: 'mcp' },
        { kind: 'skill', skill: 'draft-brief' }
      ],
      outcome: 'succeeded'
    },
    {
      name: 'ticket-triage',
      description: 'Classifies incoming tickets and extracts the next action for each one.',
      version: 'v1',
      inputs: [
        { name: 'queue', required: true, hint: 'The queue to triage.' },
        { name: 'limit', required: true, hint: 'How many tickets to include.' }
      ],
      steps: [
        { kind: 'skill', skill: 'extract-actions' },
        { kind: 'mcp' },
        { kind: 'skill', skill: 'draft-brief' }
      ],
      outcome: 'failed'
    },
    {
      name: 'health-check',
      description: 'Checks the recorded search gateway and reports its current reachability.',
      version: 'v4',
      inputs: [],
      steps: [
        { kind: 'mcp' }
      ],
      outcome: 'rejected'
    }
  ];

  const RUN_FIXTURES = {
    'RUN-7K2M': {
      ref: 'RUN-7K2M',
      task: 'weekly-digest',
      taskName: 'weekly-digest',
      version: 'v2',
      state: 'Succeeded',
      initiatedBy: 'you',
      rejectedBeforeStep: false,
      steps: [
        { ordinal: 1, kind: 'skill', target: 'summarise-thread', status: 'Succeeded', duration: '1.2 s', result: 'Returned a result.' },
        { ordinal: 2, kind: 'mcp', target: null, status: 'Succeeded', duration: '0.8 s', result: 'The tool returned a result.' },
        { ordinal: 3, kind: 'skill', target: 'draft-brief', status: 'Succeeded', duration: '1.1 s', result: 'Returned a result.' }
      ]
    },
    'RUN-3P9Q': {
      ref: 'RUN-3P9Q',
      task: 'ticket-triage',
      taskName: 'ticket-triage',
      version: 'v1',
      state: 'Failed',
      initiatedBy: 'you',
      rejectedBeforeStep: false,
      steps: [
        { ordinal: 1, kind: 'skill', target: 'extract-actions', status: 'Succeeded', duration: '1.0 s', result: 'Returned a result.' },
        { ordinal: 2, kind: 'mcp', target: null, status: 'Failed', duration: '0.9 s', result: 'The target returned an error.' },
        { ordinal: 3, kind: 'skill', target: 'draft-brief', status: 'Skipped', duration: '—', result: 'Skipped after the previous step failed.' }
      ]
    },
    'RUN-5C1R': {
      ref: 'RUN-5C1R',
      task: 'health-check',
      taskName: 'health-check',
      version: 'v4',
      state: 'Failed',
      initiatedBy: 'you',
      rejectedBeforeStep: true,
      steps: []
    },
    'RUN-9T6B': {
      ref: 'RUN-9T6B',
      task: 'weekly-digest',
      taskName: 'weekly-digest',
      version: 'v2',
      state: 'Running',
      initiatedBy: 'you',
      rejectedBeforeStep: false,
      steps: [
        { ordinal: 1, kind: 'skill', target: 'summarise-thread', status: 'Succeeded', duration: '1.2 s', result: 'Returned a result.' },
        { ordinal: 2, kind: 'mcp', target: null, status: 'Running', duration: '—', result: '—' },
        { ordinal: 3, kind: 'skill', target: 'draft-brief', status: 'Pending', duration: '—', result: '—' }
      ]
    }
  };

  const CONVERSATION_FIXTURES = [
    {
      ref: 'CNV-4F7H',
      messages: [
        { role: 'user', text: 'Draft a short note to the team about the maintenance window.' },
        { role: 'assistant', text: 'Here is a short working draft you can adapt:\n\nWe are scheduling a maintenance window for the workspace. The window is confirmed, and the team will receive an update before work begins. Please plan around the window and raise any blocking dependency in the thread.\n\nI can make this more specific if you share the window and the affected systems.' }
      ]
    },
    {
      ref: 'CNV-9Q2L',
      messages: [
        { role: 'user', text: 'Summarise the onboarding checklist into three steps.' },
        { role: 'assistant', text: '1. Confirm the local account and sign-in details.\n2. Read the workspace boundary and the recorded registries.\n3. Start with one manual run and review the outcome together.' }
      ]
    },
    {
      ref: 'CNV-2M8X',
      messages: []
    }
  ];

  /* -----------------------------------------------------------------------
     State
     ----------------------------------------------------------------------- */

  const state = {
    authed: false,
    sessionEpoch: 0,
    route: null,
    currentPath: '',
    allowHash: false,

    signInName: '',
    signInError: null,
    signInNotice: null,
    signInFieldErrors: {},
    signInSubmitting: false,

    conversations: [],
    activeConversation: null,
    chatDraft: '',
    chatDraftRef: null,
    chatError: null,
    scrollThread: null,

    skills: [],
    servers: [],
    tasks: [],
    runs: {},
    registryErrors: { skills: false, mcp: false, tasks: false },

    runDrafts: {},
    runErrors: {},
    runSubmitting: false,
    runUnconfirmed: false,
    runSimMode: 'auto',

    runStatusError: false,
    override: null,
    reviewOpen: false,
    discard: null,
    focus: null
  };

  /* -----------------------------------------------------------------------
     Small helpers
     ----------------------------------------------------------------------- */

  const escapeHtml = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));

  const icon = (name, extraClass = '') => `<svg class="icon ${extraClass}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;
  const $ = (selector, root = document) => root.querySelector(selector);

  function findSkill(name) {
    return state.skills.find((skill) => skill.name === name) || null;
  }

  function findServer(name) {
    return state.servers.find((server) => server.name === name) || null;
  }

  function findTask(name) {
    return state.tasks.find((task) => task.name === name) || null;
  }

  function findConversation(ref) {
    return state.conversations.find((conversation) => conversation.ref === ref) || null;
  }

  function activeConversation() {
    return findConversation(state.activeConversation);
  }

  function isShowingConversation(ref) {
    if (!state.route || state.route.id !== 'PG-002') return false;
    if (state.route.conversationRef) return state.route.conversationRef === ref;
    return state.activeConversation === ref;
  }

  function findRun(ref) {
    return state.runs[ref] || null;
  }

  function randomRef(prefix, length) {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let body = '';
    for (let index = 0; index < length; index += 1) {
      body += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return `${prefix}-${body}`;
  }

  function createConversation() {
    let ref = randomRef('CNV', 4);
    while (findConversation(ref)) ref = randomRef('CNV', 4);
    const conversation = { ref, messages: [], pending: null, error: null, lastFailedText: '' };
    state.conversations.unshift(conversation);
    state.activeConversation = ref;
    return conversation;
  }

  function announce(message) {
    if (!LIVE) return;
    LIVE.textContent = '';
    window.setTimeout(() => {
      LIVE.textContent = message;
    }, 30);
  }

  function toneForHealth(tone) {
    if (tone === 'ok') return 'badge--ok';
    if (tone === 'warn') return 'badge--warn';
    if (tone === 'error') return 'badge--error';
    return 'badge--neutral';
  }

  function toneForRun(runState) {
    if (runState === 'Succeeded') return 'ok';
    if (runState === 'Failed') return 'error';
    if (runState === 'Running') return 'info';
    return 'neutral';
  }

  function statusBadge(label, tone) {
    return `<span class="badge badge--${tone}">${escapeHtml(label)}</span>`;
  }

  function recordBack(label, href) {
    return `<div class="back-row"><a class="back-link" href="#${href}" data-link>${icon('arrow-left', 'icon--sm')}<span>${escapeHtml(label)}</span></a></div>`;
  }

  function hiddenHeading(label) {
    return `<h1 class="sr-only" id="page-heading" tabindex="-1">${escapeHtml(label)}</h1>`;
  }

  function page(inner) {
    return `<div class="page"><div class="page-inner">${inner}</div></div>`;
  }

  function statePanel({ title, body, actions = '', level = 2, eyebrow = '', denied = false, inline = true, center = false }) {
    const headingId = level === 1 ? 'page-heading' : 'state-heading';
    const headingTag = level === 1 ? 'h1' : 'h2';
    return `
      <div class="state-wrap${inline ? ' state-wrap--inline' : ''}${center ? ' state-wrap--center' : ''}">
        <section class="state-panel${denied ? ' state-panel--denied' : ''}" aria-labelledby="${headingId}">
          ${eyebrow ? `<div class="state-eyebrow">${escapeHtml(eyebrow)}</div>` : ''}
          <${headingTag} class="state-title" id="${headingId}" tabindex="-1">${escapeHtml(title)}</${headingTag}>
          <p class="state-body">${escapeHtml(body)}</p>
          ${actions ? `<div class="state-actions">${actions}</div>` : ''}
        </section>
      </div>`;
  }

  function noPermissionPanel({ backHref = '', backLabel = '', backToSignIn = false } = {}) {
    let action = '';
    if (backToSignIn) {
      action = `<button type="button" class="btn btn--secondary" data-action="back-to-signin">Return to sign in</button>`;
    } else if (backHref) {
      action = `<a class="btn btn--secondary" href="#${backHref}" data-link>${escapeHtml(backLabel)}</a>`;
    }
    return statePanel({
      title: 'You do not have access to this item.',
      body: 'This page is not available to you.',
      actions: action,
      level: 1,
      denied: true,
      inline: false,
      center: true
    });
  }

  function skeletonCards(number) {
    return `<div class="card-grid" aria-hidden="true">${Array.from({ length: number }, () => `
      <div class="sk-card">
        <div class="skeleton sk-line"></div>
        <div class="skeleton sk-line"></div>
        <div class="skeleton sk-line"></div>
        <div class="skeleton sk-line"></div>
      </div>`).join('')}</div>`;
  }

  function skeletonRecord() {
    return `
      <div class="split" aria-hidden="true">
        <div class="split-main">
          <div class="panel"><div class="skeleton sk-line--lg" style="width:35%;margin-bottom:14px"></div><div class="skeleton sk-line" style="margin-bottom:8px"></div><div class="skeleton sk-line" style="width:88%;margin-bottom:8px"></div><div class="skeleton sk-line" style="width:62%"></div></div>
          <div class="panel"><div class="skeleton sk-line--lg" style="width:28%;margin-bottom:14px"></div><div class="skeleton sk-line" style="margin-bottom:8px"></div><div class="skeleton sk-line" style="width:74%"></div></div>
        </div>
        <div class="facts"><div class="skeleton sk-line" style="width:52%;margin-bottom:16px"></div><div class="skeleton sk-line" style="margin-bottom:10px"></div><div class="skeleton sk-line" style="width:68%"></div></div>
      </div>`;
  }

  function reviewTrigger(floating = false) {
    return `<button type="button" class="review-trigger${floating ? ' review-trigger--floating' : ''}" data-action="review-toggle" aria-expanded="${state.reviewOpen ? 'true' : 'false'}" aria-controls="review-panel">${icon('layers')}<span>States</span></button>`;
  }

  /* -----------------------------------------------------------------------
     Fixture reset
     ----------------------------------------------------------------------- */

  function seed() {
    state.skills = SKILL_FIXTURES.map((skill) => ({
      ...skill,
      inputs: skill.inputs.map((input) => ({ ...input }))
    }));
    state.servers = MCP_FIXTURES.map((server) => ({ ...server }));
    state.tasks = TASK_FIXTURES.map((task) => ({
      ...task,
      inputs: task.inputs.map((input) => ({ ...input })),
      steps: task.steps.map((step) => ({ ...step }))
    }));
    state.runs = {};
    Object.entries(RUN_FIXTURES).forEach(([ref, run]) => {
      state.runs[ref] = { ...run, steps: run.steps.map((step) => ({ ...step })) };
    });
    state.conversations = CONVERSATION_FIXTURES.map((conversation) => ({
      ref: conversation.ref,
      messages: conversation.messages.map((message) => ({ ...message })),
      pending: null,
      error: null,
      lastFailedText: ''
    }));
    state.activeConversation = state.conversations[0] ? state.conversations[0].ref : null;
  }

  /* -----------------------------------------------------------------------
     Routing
     ----------------------------------------------------------------------- */

  function normalizePath(value) {
    let path = String(value || '').replace(/^#/, '');
    if (!path) return '/';
    if (!path.startsWith('/')) path = `/${path}`;
    return path;
  }

  function currentHashPath() {
    return normalizePath(window.location.hash);
  }

  function parseRoute(rawPath) {
    const path = (rawPath || '/').replace(/\/+$/, '') || '/';
    let parts;
    try {
      parts = path.split('/').filter(Boolean).map((part) => decodeURIComponent(part));
    } catch (error) {
      return { id: 'unknown', path };
    }

    if (path === '/') return { id: 'root', path: '/' };
    if (parts[0] === 'sign-in') return { id: 'PG-001', path: '/sign-in' };

    if (parts[0] === 'chat') {
      return {
        id: 'PG-002',
        path: parts[1] ? `/chat/${encodeURIComponent(parts[1])}` : '/chat',
        conversationRef: parts[1] || null
      };
    }

    if (parts[0] === 'skills') {
      if (parts[1] === 'new') return { id: 'PG-010', path: '/skills/new' };
      if (parts[1] && parts[2] === 'edit') {
        return { id: 'PG-010', path: `/skills/${encodeURIComponent(parts[1])}/edit`, name: parts[1] };
      }
      if (parts[1]) return { id: 'PG-004', path: `/skills/${encodeURIComponent(parts[1])}`, name: parts[1] };
      return { id: 'PG-003', path: '/skills' };
    }

    if (parts[0] === 'mcp') {
      if (parts[1] === 'new') return { id: 'PG-011', path: '/mcp/new' };
      if (parts[1] && parts[2] === 'edit') {
        return { id: 'PG-011', path: `/mcp/${encodeURIComponent(parts[1])}/edit`, name: parts[1] };
      }
      if (parts[1]) return { id: 'PG-006', path: `/mcp/${encodeURIComponent(parts[1])}`, name: parts[1] };
      return { id: 'PG-005', path: '/mcp' };
    }

    if (parts[0] === 'tasks') {
      if (parts[1] === 'new') return { id: 'PG-012', path: '/tasks/new' };
      if (parts[1] && parts[2] === 'edit') {
        return { id: 'PG-012', path: `/tasks/${encodeURIComponent(parts[1])}/edit`, name: parts[1] };
      }
      if (parts[1] && parts[2] === 'run') {
        return { id: 'PG-008', path: `/tasks/${encodeURIComponent(parts[1])}/run`, name: parts[1] };
      }
      if (parts[1]) return { id: 'redirect-tasks', path: '/tasks' };
      return { id: 'PG-007', path: '/tasks' };
    }

    if (parts[0] === 'runs' && parts[1]) {
      return { id: 'PG-009', path: `/runs/${encodeURIComponent(parts[1])}`, ref: parts[1] };
    }
    if (parts[0] === 'runs') return { id: 'redirect-tasks', path: '/tasks' };

    return { id: 'unknown', path };
  }

  function applyRoute(rawPath, { focusHeading = true } = {}) {
    let path = rawPath || currentHashPath();
    let route = parseRoute(path);

    if (!state.authed && route.id !== 'PG-001') {
      path = '/sign-in';
      route = parseRoute(path);
    } else if (state.authed && route.id === 'PG-001') {
      path = '/chat';
      route = parseRoute(path);
    } else if (route.id === 'root' || route.id === 'unknown' || route.id === 'redirect-tasks') {
      path = state.authed ? '/chat' : '/sign-in';
      route = parseRoute(path);
    }

    if (currentHashPath() !== route.path) {
      window.history.replaceState(null, '', `#${route.path}`);
    }

    const changed = !state.route || state.route.id !== route.id || state.route.path !== route.path;
    state.route = route;
    state.currentPath = route.path;

    if (changed) {
      state.override = null;
      state.signInError = null;
      state.signInFieldErrors = {};
      state.runErrors = {};
      state.runSubmitting = false;
      state.runUnconfirmed = false;
      state.runStatusError = false;
      state.chatError = null;
      state.scrollThread = 'top';
    }

    if (route.id === 'PG-002' && route.conversationRef && findConversation(route.conversationRef)) {
      state.activeConversation = route.conversationRef;
    }

    render({ focusHeading });
    const content = $('.content');
    if (content) content.scrollTop = 0;
  }

  function navigate(path, { force = false } = {}) {
    const target = normalizePath(path);
    if (target === state.currentPath) {
      state.override = null;
      render({ focusHeading: false });
      return;
    }
    if (!force) {
      const unsaved = getUnsaved();
      if (unsaved) {
        openDiscard({ target, type: unsaved.type, taskName: unsaved.taskName });
        return;
      }
    }
    state.allowHash = true;
    window.location.hash = target;
  }

  function getUnsaved() {
    if (!state.route) return null;
    if (state.route.id === 'PG-002') {
      const conversation = activeConversation();
      if (state.chatDraft.length > 0 && conversation && !conversation.pending) {
        return { type: 'chat' };
      }
    }
    if (state.route.id === 'PG-008') {
      const task = findTask(state.route.name);
      if (task && !state.runSubmitting && !state.runUnconfirmed && state.override !== 'submitting') {
        const draft = state.runDrafts[task.name] || {};
        const hasValue = task.inputs.some((input) => String(draft[input.name] || '').length > 0);
        if (hasValue) return { type: 'run', taskName: task.name };
      }
    }
    return null;
  }

  function clearDraftFor(type, taskName) {
    if (type === 'chat') {
      state.chatDraft = '';
      state.chatDraftRef = null;
    }
    if (type === 'run' && taskName) {
      delete state.runDrafts[taskName];
    }
  }

  function openDiscard({ target = '', type = 'chat', taskName = '', onDiscard = null }) {
    state.discard = {
      target,
      type,
      taskName,
      onDiscard,
      previousFocus: document.activeElement
    };
    APP.inert = true;
    REVIEW.inert = true;
    renderDiscardDialog();
  }

  function closeDiscard({ restoreFocus = true } = {}) {
    const previousFocus = state.discard ? state.discard.previousFocus : null;
    state.discard = null;
    APP.inert = false;
    REVIEW.inert = false;
    const root = document.getElementById('dialog-root');
    if (root) root.innerHTML = '';
    if (restoreFocus) {
      if (previousFocus && document.body.contains(previousFocus)) {
        previousFocus.focus();
      } else {
        const fallback = $('#composer-input') || $('[data-run-input]') || $('#main');
        if (fallback) fallback.focus();
      }
    }
  }

  function renderDiscardDialog() {
    let root = document.getElementById('dialog-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'dialog-root';
      document.body.appendChild(root);
    }
    if (!state.discard) {
      root.innerHTML = '';
      return;
    }
    const bodyCopy = state.discard.type === 'run'
      ? 'Your run inputs have not been submitted.'
      : 'Your message has not been sent.';
    root.innerHTML = `
      <div class="scrim">
        <div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="discard-title" aria-describedby="discard-body">
          <h2 class="dialog-title" id="discard-title">Discard unsent text?</h2>
          <p class="dialog-body" id="discard-body">${bodyCopy} This cannot be undone.</p>
          <div class="dialog-actions">
            <button type="button" class="btn btn--primary" data-action="discard-stay" id="discard-stay">Stay</button>
            <button type="button" class="btn btn--secondary" data-action="discard-confirm">Discard</button>
          </div>
        </div>
      </div>`;
    const stay = document.getElementById('discard-stay');
    if (stay) stay.focus();
  }

  function confirmDiscard() {
    if (!state.discard) return;
    const discard = state.discard;
    clearDraftFor(discard.type, discard.taskName);
    const target = discard.target;
    const onDiscard = discard.onDiscard;
    closeDiscard({ restoreFocus: false });
    if (typeof onDiscard === 'function') {
      onDiscard();
    } else if (target) {
      state.allowHash = true;
      window.location.hash = target;
    }
  }

  function onHashChange() {
    const target = currentHashPath();
    if (state.discard) {
      window.history.replaceState(null, '', `#${state.currentPath}`);
      return;
    }
    if (state.allowHash) {
      state.allowHash = false;
      applyRoute(target);
      return;
    }
    if (target !== state.currentPath) {
      const unsaved = getUnsaved();
      if (unsaved) {
        window.history.replaceState(null, '', `#${state.currentPath}`);
        openDiscard({ target, type: unsaved.type, taskName: unsaved.taskName });
        return;
      }
    }
    applyRoute(target);
  }

  function abortPendingWork() {
    state.sessionEpoch += 1;
    state.conversations.forEach((conversation) => {
      conversation.pending = null;
      conversation.messages = conversation.messages.filter((message) => (
        !(message.role === 'assistant' && message.pending) &&
        !(message.role === 'user' && message.status === 'sending')
      ));
    });
    state.chatError = null;
    state.runSubmitting = false;
    state.runUnconfirmed = false;
  }

  function returnToSignIn() {
    state.authed = false;
    state.signInSubmitting = false;
    state.override = null;
    state.reviewOpen = false;
    state.chatDraft = '';
    state.chatDraftRef = null;
    state.runDrafts = {};
    abortPendingWork();
    if (state.discard) closeDiscard({ restoreFocus: false });
    state.route = null;
    window.history.replaceState(null, '', '#/sign-in');
    applyRoute('/sign-in', { focusHeading: true });
  }

  function simulateSessionEnd() {
    state.authed = false;
    state.signInSubmitting = false;
    state.signInError = null;
    state.signInNotice = SESSION_ENDED;
    state.override = null;
    state.reviewOpen = false;
    state.chatDraft = '';
    state.chatDraftRef = null;
    state.runDrafts = {};
    abortPendingWork();
    if (state.discard) closeDiscard({ restoreFocus: false });
    state.route = null;
    window.history.replaceState(null, '', '#/sign-in');
    applyRoute('/sign-in', { focusHeading: true });
  }

  /* -----------------------------------------------------------------------
     Rendering: shell
     ----------------------------------------------------------------------- */

  function sectionFor(route) {
    if (!route) return '';
    if (route.id === 'PG-002') return 'chat';
    if (route.id === 'PG-003' || route.id === 'PG-004' || route.id === 'PG-010') return 'skills';
    if (route.id === 'PG-005' || route.id === 'PG-006' || route.id === 'PG-011') return 'mcp';
    if (route.id === 'PG-007' || route.id === 'PG-008' || route.id === 'PG-009' || route.id === 'PG-012') return 'tasks';
    return '';
  }

  function navLink(section, href, label, iconName) {
    const active = sectionFor(state.route) === section;
    return `<a class="nav-link" href="#${href}" data-link${active ? ' aria-current="page"' : ''}>${icon(iconName)}<span>${label}</span></a>`;
  }

  function renderSidebar() {
    const chatOverride = state.route.id === 'PG-002' ? state.override : null;
    let conversations;
    if (chatOverride === 'empty') {
      conversations = `<p class="sidebar-empty">No conversations yet.</p>`;
    } else if (chatOverride === 'loading') {
      conversations = `<div class="conv-list" aria-hidden="true">
        <div class="skeleton sk-line" style="height:27px;margin:3px 10px"></div>
        <div class="skeleton sk-line" style="height:27px;margin:3px 10px"></div>
        <div class="skeleton sk-line" style="height:27px;margin:3px 10px"></div>
      </div>`;
    } else if (state.conversations.length) {
      conversations = `<ul class="conv-list">${state.conversations.map((conversation) => {
        const isActive = isShowingConversation(conversation.ref);
        return `<li><a class="conv-link" href="#/chat/${encodeURIComponent(conversation.ref)}" data-link${isActive ? ' aria-current="page"' : ''}><span>${escapeHtml(conversation.ref)}</span><span class="conv-mark" aria-hidden="true"></span></a></li>`;
      }).join('')}</ul>`;
    } else {
      conversations = `<p class="sidebar-empty">No conversations yet.</p>`;
    }

    return `
      <aside class="sidebar" aria-label="Workspace navigation">
        <div class="sidebar-inner">
          <div class="sidebar-brand">
            <span class="sidebar-word">hound-dock</span>
            <span class="sidebar-sub">Internal agent workspace</span>
          </div>
          <button type="button" class="new-chat" data-action="new-chat">${icon('plus', 'icon--sm')}<span>New chat</span></button>
          <div class="sidebar-scroll">
            <div class="nav-label">Workspace</div>
            <nav class="nav" aria-label="Primary">
              ${navLink('chat', '/chat', 'Chat', 'chat')}
              ${navLink('skills', '/skills', 'Skills', 'skills')}
              ${navLink('mcp', '/mcp', 'MCP servers', 'mcp')}
              ${navLink('tasks', '/tasks', 'Tasks', 'tasks')}
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

  function breadcrumb(route) {
    const items = ['Workspace'];
    if (route.id === 'PG-002') items.push('Chat');
    else if (route.id === 'PG-003') items.push('Skills');
    else if (route.id === 'PG-004') items.push('Skills', route.name);
    else if (route.id === 'PG-005') items.push('MCP servers');
    else if (route.id === 'PG-006') items.push('MCP servers', route.name);
    else if (route.id === 'PG-007') items.push('Tasks');
    else if (route.id === 'PG-008') items.push('Tasks', route.name);
    else if (route.id === 'PG-009') items.push('Tasks', route.ref);
    else if (route.id === 'PG-010') items.push('Skills');
    else if (route.id === 'PG-011') items.push('MCP servers');
    else if (route.id === 'PG-012') items.push('Tasks');
    const rendered = items.map((item, index) => {
      const isCurrent = index === items.length - 1;
      return `${index > 0 ? '<span class="sep" aria-hidden="true">/</span>' : ''}<span class="${isCurrent ? 'current' : ''}"${isCurrent ? ' aria-current="page"' : ''}>${escapeHtml(item)}</span>`;
    }).join('');
    return `<nav class="breadcrumb" aria-label="Breadcrumb">${rendered}</nav>`;
  }

  function renderShell(route, inner, isChat) {
    return `
      <div class="app-shell">
        ${renderSidebar()}
        <main id="main" class="main" tabindex="-1">
          <header class="topbar">
            ${breadcrumb(route)}
            ${reviewTrigger()}
          </header>
          <div class="content${isChat ? ' content--chat' : ''}">${inner}</div>
        </main>
      </div>`;
  }

  /* -----------------------------------------------------------------------
     Rendering: sign in (PG-001)
     ----------------------------------------------------------------------- */

  function renderSignInPage() {
    const override = state.override;
    const submitting = state.signInSubmitting || override === 'submitting';
    const forcedEditing = override === 'editing';
    const nameValue = forcedEditing ? 'demo-member' : state.signInName;
    const fieldErrors = state.signInFieldErrors || {};
    const error = override === 'error' ? GENERIC_SIGNIN_ERROR : state.signInError;
    const missingFields = Object.keys(fieldErrors);
    const summary = missingFields.length > 1
      ? `<div class="error-summary" role="alert" tabindex="-1">
          <h2>There is a problem</h2>
          <ul>${missingFields.map((field) => `<li><button type="button" data-action="focus-field" data-field="${field === 'name' ? 'signin-name' : 'signin-credential'}">${escapeHtml(fieldErrors[field])}</button></li>`).join('')}</ul>
        </div>`
      : '';

    return `
      <main id="main" class="signin-page" tabindex="-1">
        ${reviewTrigger(true)}
        <div class="signin-shell">
          <div class="signin-brand">
            <span class="brand-word">hound-dock</span>
            <span class="brand-sub">Internal agent workspace</span>
          </div>
          <div class="signin-card">
            <h1 class="signin-title" id="page-heading" tabindex="-1">Sign in</h1>
            <p class="signin-lede">Use your workspace-local account to continue.</p>

            ${state.signInNotice ? `<div class="banner banner--info" role="status">${icon('info')}<div>${escapeHtml(state.signInNotice)}</div></div>` : ''}
            ${error ? `<div class="banner banner--error" role="alert">${icon('alert')}<div>${escapeHtml(error)}</div></div>` : ''}

            <form id="signin-form" class="signin-form" novalidate>
              ${summary}
              <div class="field">
                <label class="field-label" for="signin-name">Sign-in name</label>
                <input class="input" id="signin-name" name="signin-name" type="text" autocomplete="username" value="${escapeHtml(nameValue)}"${submitting ? ' readonly' : ''} aria-invalid="${fieldErrors.name ? 'true' : 'false'}" aria-describedby="signin-name-hint${fieldErrors.name ? ' signin-name-error' : ''}">
                <p class="field-hint" id="signin-name-hint">The name recorded for your local workspace account.</p>
                ${fieldErrors.name ? `<p class="field-error" id="signin-name-error">${icon('alert', 'icon--xs')}<span>${escapeHtml(fieldErrors.name)}</span></p>` : ''}
              </div>
              <div class="field">
                <label class="field-label" for="signin-credential">Credential</label>
                <input class="input" id="signin-credential" name="credential" type="password" autocomplete="current-password" value=""${submitting ? ' readonly' : ''} aria-invalid="${fieldErrors.credential ? 'true' : 'false'}" aria-describedby="signin-credential-hint${fieldErrors.credential ? ' signin-credential-error' : ''}">
                <p class="field-hint" id="signin-credential-hint">Your credential is never shown after sign-in.</p>
                ${fieldErrors.credential ? `<p class="field-error" id="signin-credential-error">${icon('alert', 'icon--xs')}<span>${escapeHtml(fieldErrors.credential)}</span></p>` : ''}
              </div>
              <button type="submit" class="btn btn--primary btn--block"${submitting ? ' disabled' : ''}>${submitting ? 'Signing in…' : 'Sign in'}</button>
              ${submitting ? `<p class="form-status" role="status">Signing in. Please wait.</p>` : ''}
            </form>

            <p class="signin-help">Account help is available from your account administrator.</p>
          </div>
        </div>
      </main>`;
  }

  /* -----------------------------------------------------------------------
     Rendering: chat (PG-002)
     ----------------------------------------------------------------------- */

  function renderChatMessages(conversation) {
    const messages = conversation.messages.filter((message) => message.role === 'user' || !message.pending);
    const pendingAssistant = conversation.messages.find((message) => message.role === 'assistant' && message.pending);
    const items = messages.map((message) => {
      if (message.role === 'user') {
        return `<li class="msg msg--user"><p class="msg-bubble">${escapeHtml(message.text)}</p>${message.status === 'sending' ? '<span class="msg-state">Sending</span>' : ''}</li>`;
      }
      return `<li class="msg msg--assistant"><span class="msg-label">Assistant</span><div class="msg-bubble">${escapeHtml(message.text)}</div></li>`;
    });
    if (pendingAssistant) {
      items.push(`<li class="msg msg--assistant"><span class="msg-label">Assistant</span><div class="pending-assistant"><span class="pending-dots" aria-hidden="true"><span></span><span></span><span></span></span><span>Assistant is responding</span></div></li>`);
    }
    return items.join('');
  }

  function chatComposer({ conversation, disabled, hidden, value, error, allowTryAgain = false }) {
    if (hidden) return '';
    const hasError = Boolean(error);
    const errorBanner = hasError
      ? `<div class="banner banner--error composer-error" role="alert" id="composer-error">${icon('alert')}<div><div>${escapeHtml(error)}</div>${(conversation && conversation.lastFailedText) || allowTryAgain ? `<div class="banner-actions"><button type="button" class="btn btn--secondary btn--sm" data-action="try-again">Try again</button></div>` : ''}</div></div>`
      : '';
    const isLocked = disabled || Boolean(conversation && conversation.pending);
    return `
      <div class="composer-wrap">
        ${errorBanner}
        <div class="composer${isLocked ? ' is-disabled' : ''}">
          <textarea id="composer-input" aria-label="Message" placeholder="${isLocked ? 'Assistant is responding…' : 'Write a message…'}"${isLocked ? ' disabled' : ''}>${escapeHtml(value || '')}</textarea>
          <div class="composer-row">
            <span class="composer-hint">Enter to send · Shift+Enter for a new line</span>
            <button type="button" class="btn btn--primary" data-action="send-message"${isLocked ? ' disabled' : ''}>${icon('send', 'icon--sm')}<span>Send</span></button>
          </div>
        </div>
      </div>`;
  }

  function renderChat(route) {
    const override = state.override;
    const routeConversation = route.conversationRef ? findConversation(route.conversationRef) : null;
    const conversation = routeConversation || (route.conversationRef ? null : activeConversation());

    if (routeConversation) state.activeConversation = routeConversation.ref;

    if (override === 'no-permission' || override === 'no-result') {
      return `<div class="chat-page"><div class="chat-column">
        <header class="chat-header"><h1 id="page-heading" tabindex="-1">Chat</h1></header>
        <div class="thread">${statePanel({ title: 'Conversation unavailable', body: 'This conversation is not available. Your conversation list is still usable.', actions: `<button type="button" class="btn btn--primary" data-action="new-chat">New chat</button>`, level: 2 })}</div>
      </div></div>`;
    }

    if (override === 'empty') {
      return `<div class="chat-page"><div class="chat-column">
        <header class="chat-header"><h1 id="page-heading" tabindex="-1">Chat</h1></header>
        <div class="empty-chat"><div class="empty-chat-inner">
          <h2>No conversations yet</h2>
          <p>Start a conversation to work through something with the assistant.</p>
          <button type="button" class="btn btn--primary" data-action="new-chat">New chat</button>
        </div></div>
      </div></div>`;
    }

    if (override === 'loading') {
      return `<div class="chat-page"><div class="chat-column">
        <header class="chat-header"><h1 id="page-heading" tabindex="-1">Chat</h1><div class="chat-meta">${icon('lock', 'icon--xs')}<span>Private to you</span></div></header>
        <div class="thread loading-region" aria-busy="true"><span class="sr-only">Loading conversation</span>
          <div class="sk-chat-row"><div class="skeleton sk-bubble sk-bubble--user"></div><div class="skeleton sk-bubble"></div></div>
          <div class="sk-chat-row"><div class="skeleton sk-bubble sk-bubble--user"></div><div class="skeleton sk-bubble"></div></div>
        </div>
        ${chatComposer({ conversation: null, disabled: true, value: '', error: null })}
      </div></div>`;
    }

    if (override === 'error') {
      return `<div class="chat-page"><div class="chat-column">
        <header class="chat-header"><h1 id="page-heading" tabindex="-1">Chat</h1></header>
        <div class="thread chat-error-state">${statePanel({ title: 'This page could not load.', body: 'The conversation was not retrieved. Retry to load it again.', actions: `<button type="button" class="btn btn--secondary" data-action="retry-chat">Retry</button>`, level: 2 })}</div>
        ${chatComposer({ conversation: null, disabled: true, value: '', error: null })}
      </div></div>`;
    }

    if (route.conversationRef && !routeConversation) {
      return `<div class="chat-page"><div class="chat-column">
        <header class="chat-header"><h1 id="page-heading" tabindex="-1">Chat</h1></header>
        <div class="thread">${statePanel({ title: 'Conversation unavailable', body: 'This conversation is not available. Your conversation list is still usable.', actions: `<button type="button" class="btn btn--primary" data-action="new-chat">New chat</button>`, level: 2 })}</div>
      </div></div>`;
    }

    if (!conversation && !['success', 'failure', 'submitting', 'editing'].includes(override)) {
      return `<div class="chat-page"><div class="chat-column">
        <header class="chat-header"><h1 id="page-heading" tabindex="-1">Chat</h1></header>
        <div class="empty-chat"><div class="empty-chat-inner">
          <h2>No conversations yet</h2>
          <p>Start a conversation to work through something with the assistant.</p>
          <button type="button" class="btn btn--primary" data-action="new-chat">New chat</button>
        </div></div>
      </div></div>`;
    }

    const demoRef = conversation ? conversation.ref : 'CNV-7R3D';
    let threadContent = '';
    let composerError = conversation ? conversation.error : null;
    let composerValue = state.chatDraftRef === (conversation ? conversation.ref : null) ? state.chatDraft : '';
    let locked = false;

    if (override === 'submitting') {
      threadContent = `<ol class="thread-list">
        <li class="msg msg--user"><p class="msg-bubble">${escapeHtml(DEMO_CHAT_TEXT)}</p><span class="msg-state">Sending</span></li>
        <li class="msg msg--assistant"><span class="msg-label">Assistant</span><div class="pending-assistant"><span class="pending-dots" aria-hidden="true"><span></span><span></span><span></span></span><span>Assistant is responding</span></div></li>
      </ol>`;
      locked = true;
      composerError = null;
      composerValue = '';
    } else if (override === 'success') {
      threadContent = `<ol class="thread-list">
        <li class="msg msg--user"><p class="msg-bubble">${escapeHtml(DEMO_CHAT_TEXT)}</p></li>
        <li class="msg msg--assistant"><span class="msg-label">Assistant</span><div class="msg-bubble">${escapeHtml(DEMO_REPLY)}</div></li>
      </ol>`;
      composerError = null;
      composerValue = '';
    } else if (override === 'failure') {
      threadContent = `<ol class="thread-list">
        <li class="msg msg--user"><p class="msg-bubble">${escapeHtml(DEMO_CHAT_TEXT)}</p></li>
      </ol>`;
      composerError = CHAT_MODEL_ERROR;
      composerValue = '';
    } else if (conversation && conversation.messages.length > 0) {
      threadContent = `<ol class="thread-list">${renderChatMessages(conversation)}</ol>`;
      locked = Boolean(conversation.pending);
    } else if (conversation) {
      threadContent = `<div class="empty-chat"><div class="empty-chat-inner">
        <h2>What would you like to work through?</h2>
        <p>This conversation is private to you.</p>
      </div></div>`;
    }

    if (state.chatError && !composerError) composerError = state.chatError;
    if (state.chatError === EMPTY_MESSAGE_ERROR) locked = false;

    return `<div class="chat-page"><div class="chat-column">
      <header class="chat-header">
        <h1 id="page-heading" tabindex="-1">${escapeHtml(demoRef)}</h1>
        <div class="chat-meta">${icon('lock', 'icon--xs')}<span>Private to you</span></div>
      </header>
      <div class="thread" role="region" aria-label="Conversation messages">${threadContent}</div>
      ${chatComposer({ conversation, disabled: locked, value: composerValue, error: composerError, allowTryAgain: override === 'failure' })}
    </div></div>`;
  }

  /* -----------------------------------------------------------------------
     Rendering: registries (PG-003, PG-005, PG-007)
     ----------------------------------------------------------------------- */

  function registryHeader({ eyebrow, title, count, description, notices }) {
    return `<header class="page-head">
      <div class="eyebrow">${escapeHtml(eyebrow)}</div>
      <div class="page-title-row"><h1 class="page-title" id="page-heading" tabindex="-1">${escapeHtml(title)}</h1><span class="count">${count}</span></div>
      <p class="page-desc">${escapeHtml(description)}</p>
      ${notices || ''}
    </header>`;
  }

  function retryButton(registry) {
    return `<button type="button" class="btn btn--secondary" data-action="retry-registry" data-registry="${registry}">Retry</button>`;
  }

  function renderSkillsPage() {
    const override = state.override;
    if (override === 'no-permission') return page(noPermissionPanel({ backToSignIn: true }));
    const loading = override === 'loading';
    const empty = override === 'empty';
    const error = override === 'error';
    const count = loading ? '—' : `${state.skills.length} recorded`;
    const header = registryHeader({
      eyebrow: 'Registry / Skills',
      title: 'Skills',
      count,
      description: 'Recorded skills available in this workspace.',
      notices: `<div class="notice">${icon('lock', 'icon--sm')}<div><strong>Read-only.</strong> Only recorded skills appear here.</div></div>`
    });

    let body = '';
    if (loading) {
      body = `<div class="loading-region" aria-busy="true"><span class="sr-only">Loading skills</span>${skeletonCards(3)}</div>`;
    } else if (error) {
      body = statePanel({ title: 'This page could not load.', body: 'The skill registry was not retrieved. This is not an empty registry.', actions: retryButton('skills') });
    } else if (empty) {
      body = statePanel({ title: 'No skills recorded.', body: 'Only recorded skills appear here.' });
    } else {
      body = `<div class="card-grid">${state.skills.map((skill) => `
        <a class="registry-card" href="#/skills/${encodeURIComponent(skill.name)}" data-link aria-label="Open skill ${escapeHtml(skill.name)}">
          <h2 class="card-title">${escapeHtml(skill.name)}</h2>
          <p class="card-desc">${escapeHtml(skill.description)}</p>
          <div class="card-meta">${statusBadge('Recorded', 'neutral')}</div>
        </a>`).join('')}</div>`;
    }

    return page(`${header}${body}`);
  }

  function renderMcpPage() {
    const override = state.override;
    if (override === 'no-permission') return page(noPermissionPanel({ backToSignIn: true }));
    const loading = override === 'loading';
    const empty = override === 'empty';
    const error = override === 'error';
    const count = loading ? '—' : `${state.servers.length} recorded`;
    const header = registryHeader({
      eyebrow: 'Registry / MCP',
      title: 'MCP servers',
      count,
      description: 'Recorded MCP servers and their recorded health.',
      notices: `<div class="notice">${icon('lock', 'icon--sm')}<div><strong>Read-only.</strong> Credential values are never shown.</div></div>`
    });

    let body = '';
    if (loading) {
      body = `<div class="loading-region" aria-busy="true"><span class="sr-only">Loading MCP servers</span>${skeletonCards(3)}</div>`;
    } else if (error) {
      body = statePanel({ title: 'This page could not load.', body: 'The MCP registry was not retrieved. This is not an empty registry.', actions: retryButton('mcp') });
    } else if (empty) {
      body = statePanel({ title: 'No MCP servers recorded.', body: 'Only recorded servers appear here.' });
    } else {
      body = `<div class="card-grid">${state.servers.map((server) => `
        <a class="registry-card" href="#/mcp/${encodeURIComponent(server.name)}" data-link aria-label="Open MCP server ${escapeHtml(server.name)}">
          <h2 class="card-title">${escapeHtml(server.name)}</h2>
          <div class="card-facts">
            <div class="card-fact"><span class="fact-label">Recorded health</span>${statusBadge(server.health, server.tone)}</div>
            <div class="card-fact"><span class="fact-label">Credential</span><span>${server.credential ? 'Credential reference recorded' : 'No credential reference recorded'}</span></div>
          </div>
        </a>`).join('')}</div>`;
    }

    return page(`${header}${body}`);
  }

  function renderTasksPage() {
    const override = state.override;
    if (override === 'no-permission') return page(noPermissionPanel({ backToSignIn: true }));
    const loading = override === 'loading';
    const empty = override === 'empty';
    const error = override === 'error';
    const count = loading ? '—' : `${state.tasks.length} recorded`;
    const header = registryHeader({
      eyebrow: 'Registry / Tasks',
      title: 'Tasks',
      count,
      description: 'Recorded task definitions available for manual runs.',
      notices: `<div class="notice-row">
        <div class="notice">${icon('play', 'icon--sm')}<div><strong>Manual runs only.</strong> A run starts only when you activate Run.</div></div>
        <div class="notice">${icon('lock', 'icon--sm')}<div><strong>Read-only definitions.</strong> Task definitions are not editable here.</div></div>
      </div>`
    });

    let body = '';
    if (loading) {
      body = `<div class="loading-region" aria-busy="true"><span class="sr-only">Loading tasks</span>${skeletonCards(3)}</div>`;
    } else if (error) {
      body = statePanel({ title: 'This page could not load.', body: 'The task registry was not retrieved. This is not an empty registry.', actions: retryButton('tasks') });
    } else if (empty) {
      body = statePanel({ title: 'No tasks recorded.', body: 'Only recorded tasks can be run manually.' });
    } else {
      body = `<div class="card-grid">${state.tasks.map((task) => `
        <article class="registry-card">
          <h2 class="card-title">${escapeHtml(task.name)}</h2>
          <p class="card-desc">${escapeHtml(task.description)}</p>
          <div class="card-meta"><span class="chip">${escapeHtml(task.version)}</span><span class="muted" style="font-size:var(--text-xs)">${task.steps.length} steps</span></div>
          <div class="card-actions"><button type="button" class="btn btn--primary" data-action="run-task" data-task="${escapeHtml(task.name)}" aria-label="Run ${escapeHtml(task.name)}">Run</button></div>
        </article>`).join('')}</div>`;
    }

    return page(`${header}${body}`);
  }

  /* -----------------------------------------------------------------------
     Rendering: skill record (PG-004)
     ----------------------------------------------------------------------- */

  function renderSkillRecord(route) {
    const override = state.override;
    if (override === 'no-permission') return page(noPermissionPanel({ backToSignIn: true }));
    if (override === 'loading') {
      return page(`${hiddenHeading('Skill record')}${recordBack('Back to Skills', '/skills')}<div class="loading-region" aria-busy="true"><span class="sr-only">Loading skill record</span>${skeletonRecord()}</div>`);
    }

    const skill = findSkill(route.name);
    if (override === 'no-result' || !skill) {
      return page(`${recordBack('Back to Skills', '/skills')}${statePanel({
        title: 'This skill is not in the registry.',
        body: 'No record was found for this reference.',
        level: 1
      })}`);
    }

    if (override === 'error') {
      return page(`${recordBack('Back to Skills', '/skills')}${statePanel({
        title: 'This page could not load.',
        body: 'The skill record was not retrieved. Retry, or return to Skills.',
        actions: `<button type="button" class="btn btn--secondary" data-action="retry-skill">Retry</button>`,
        level: 1
      })}`);
    }

    const inputDefinition = skill.inputs.length
      ? `<dl class="def-list">${skill.inputs.map((input) => `
          <div class="def-row">
            <dt class="def-term"><span>${escapeHtml(input.name)}</span><span class="req-label">${input.required ? 'Required' : 'Optional'}</span></dt>
            <dd class="def-desc">${escapeHtml(input.hint)}</dd>
          </div>`).join('')}</dl>`
      : `<p class="prose">No inputs declared.</p>`;

    return page(`
      ${recordBack('Back to Skills', '/skills')}
      <header class="page-head">
        <div class="eyebrow">Skill record</div>
        <div class="page-title-row">
          <h1 class="page-title" id="page-heading" tabindex="-1">${escapeHtml(skill.name)}</h1>
          ${statusBadge('Recorded', 'neutral')}
        </div>
      </header>
      <div class="split">
        <div class="split-main">
          <section class="panel">
            <h2 class="panel-title">Description</h2>
            <p class="prose">${escapeHtml(skill.description)}</p>
          </section>
          <section class="panel">
            <h2 class="panel-title">Instructions</h2>
            <p class="prose">${escapeHtml(skill.instructions)}</p>
          </section>
          <section class="panel">
            <h2 class="panel-title">Input definition</h2>
            ${inputDefinition}
          </section>
        </div>
        <aside class="split-side">
          <div class="facts">
            <div class="facts-title">Record facts</div>
            <div class="fact-row">
              <span class="fact-label">Recorded</span>
              <span class="fact-value">Yes</span>
            </div>
            <div class="fact-row">
              <span class="fact-label">Version</span>
              <span class="fact-value">${skill.version ? `<span class="chip">${escapeHtml(skill.version)}</span>` : '<span class="muted">Not provided</span>'}</span>
              ${skill.version ? '<p class="fact-note">Proposed metadata.</p>' : ''}
            </div>
            <p class="fact-note">Tool dependencies are not shown.</p>
          </div>
        </aside>
      </div>`);
  }

  /* -----------------------------------------------------------------------
     Rendering: MCP server record (PG-006)
     ----------------------------------------------------------------------- */

  function renderMcpRecord(route) {
    const override = state.override;
    if (override === 'no-permission') return page(noPermissionPanel({ backToSignIn: true }));
    if (override === 'loading') {
      return page(`${hiddenHeading('MCP server record')}${recordBack('Back to MCP servers', '/mcp')}<div class="loading-region" aria-busy="true"><span class="sr-only">Loading MCP server record</span>${skeletonRecord()}</div>`);
    }

    const server = findServer(route.name);
    if (override === 'no-result' || !server) {
      return page(`${recordBack('Back to MCP servers', '/mcp')}${statePanel({
        title: 'This server is not in the registry.',
        body: 'No record was found for this reference.',
        level: 1
      })}`);
    }

    if (override === 'error') {
      return page(`${recordBack('Back to MCP servers', '/mcp')}${statePanel({
        title: 'This page could not load.',
        body: 'The server record was not retrieved. Retry, or return to MCP servers.',
        actions: `<button type="button" class="btn btn--secondary" data-action="retry-mcp-record">Retry</button>`,
        level: 1
      })}`);
    }

    const toolCount = server.toolRefCount === 0
      ? 'No tool references recorded'
      : `${server.toolRefCount} tool references recorded`;

    return page(`
      ${recordBack('Back to MCP servers', '/mcp')}
      <header class="page-head">
        <div class="eyebrow">MCP server record</div>
        <div class="page-title-row">
          <h1 class="page-title" id="page-heading" tabindex="-1">${escapeHtml(server.name)}</h1>
          ${statusBadge(server.health, server.tone)}
        </div>
      </header>
      <div class="split">
        <div class="split-main">
          <section class="panel">
            <h2 class="panel-title">Connection</h2>
            <dl class="def-list">
              <div class="def-row"><dt class="def-term">Connection type</dt><dd class="def-desc">${escapeHtml(server.connectionType)}</dd></div>
              <div class="def-row"><dt class="def-term">Endpoint reference</dt><dd class="def-desc"><span class="code-block">${escapeHtml(server.endpoint)}</span></dd></div>
              <div class="def-row"><dt class="def-term">Credential reference</dt><dd class="def-desc">${server.credential ? 'Recorded' : 'Not recorded'}</dd></div>
              <div class="def-row"><dt class="def-term">Timeout</dt><dd class="def-desc">${escapeHtml(server.timeout)}</dd></div>
            </dl>
          </section>
          <section class="panel">
            <h2 class="panel-title">Tool references</h2>
            <p class="prose">${escapeHtml(toolCount)}</p>
            <p class="fact-note">Individual tool names and allowlist flags are not shown.</p>
          </section>
        </div>
        <aside class="split-side">
          <div class="facts">
            <div class="facts-title">Record facts</div>
            <div class="fact-row">
              <span class="fact-label">Recorded</span>
              <span class="fact-value">Yes</span>
            </div>
            <div class="fact-row">
              <span class="fact-label">Recorded health</span>
              <span class="fact-value">${statusBadge(server.health, server.tone)}</span>
            </div>
            <div class="fact-row">
              <span class="fact-label">Credential reference</span>
              <span class="fact-value">${server.credential ? 'Recorded' : 'Not recorded'}</span>
            </div>
            <p class="fact-note">Credential values are never displayed.</p>
          </div>
        </aside>
      </div>`);
  }

  /* -----------------------------------------------------------------------
     Rendering: task run (PG-008)
     ----------------------------------------------------------------------- */

  function runDraftFor(task) {
    if (!state.runDrafts[task.name]) state.runDrafts[task.name] = {};
    return state.runDrafts[task.name];
  }

  function demoRunValues(task) {
    const values = {};
    task.inputs.forEach((input, index) => {
      if (!input.required) {
        values[input.name] = '';
        return;
      }
      values[input.name] = input.name === 'week' ? '2026-W42'
        : input.name === 'queue' ? 'support'
          : input.name === 'limit' ? '20'
            : index === 0 ? 'Sample input' : 'Sample';
    });
    return values;
  }

  function inputId(task, input) {
    return `run-${task.name}-${input.name}`.replace(/[^a-zA-Z0-9_-]/g, '-');
  }

  function renderTaskRun(route) {
    const override = state.override;
    if (override === 'no-permission') return page(noPermissionPanel({ backToSignIn: true }));
    if (override === 'loading') {
      return page(`${hiddenHeading('Task run')}${recordBack('Back to Tasks', '/tasks')}<div class="loading-region" aria-busy="true"><span class="sr-only">Loading task definition</span>${skeletonRecord()}</div>`);
    }

    const task = findTask(route.name);
    if (override === 'no-result' || !task) {
      return page(`${recordBack('Back to Tasks', '/tasks')}${statePanel({
        title: 'This task is not in the registry.',
        body: 'No run form is available for this reference.',
        level: 1
      })}`);
    }

    if (override === 'error') {
      return page(`${recordBack('Back to Tasks', '/tasks')}${statePanel({
        title: 'This page could not load.',
        body: 'The task definition was not retrieved. Retry, or return to Tasks.',
        actions: `<button type="button" class="btn btn--secondary" data-action="retry-task-run">Retry</button>`,
        level: 1
      })}`);
    }

    const forcedSubmitting = override === 'submitting';
    const forcedFailure = override === 'run-failure';
    const submitting = state.runSubmitting || forcedSubmitting;
    const values = runDraftFor(task);
    const fieldErrors = (state.runErrors[task.name] && state.runErrors[task.name].fields) || {};
    const errorCount = Object.keys(fieldErrors).length;
    const summary = errorCount > 1
      ? `<div class="error-summary" role="alert" tabindex="-1">
          <h2>There is a problem</h2>
          <ul>${task.inputs.filter((input) => fieldErrors[input.name]).map((input) => `<li><button type="button" data-action="focus-field" data-field="${inputId(task, input)}">${escapeHtml(fieldErrors[input.name])}</button></li>`).join('')}</ul>
        </div>`
      : '';

    const fields = task.inputs.length
      ? task.inputs.map((input) => {
        const id = inputId(task, input);
        const error = fieldErrors[input.name];
        return `<div class="field">
          <label class="field-label" for="${id}">${escapeHtml(input.name)} <span class="field-optional">${input.required ? 'Required' : 'Optional'}</span></label>
          <input class="input" id="${id}" data-run-input name="${escapeHtml(input.name)}" type="text" value="${escapeHtml(values[input.name] || '')}"${submitting ? ' readonly' : ''} aria-invalid="${error ? 'true' : 'false'}" aria-describedby="${id}-hint${error ? ` ${id}-error` : ''}">
          <p class="field-hint" id="${id}-hint">${escapeHtml(input.hint)}</p>
          ${error ? `<p class="field-error" id="${id}-error">${icon('alert', 'icon--xs')}<span>${escapeHtml(error)}</span></p>` : ''}
        </div>`;
      }).join('')
      : `<p class="prose">No inputs required.</p>`;

    let banner = '';
    if (forcedFailure || (state.runErrors[task.name] && state.runErrors[task.name].type === 'no-run')) {
      banner = `<div class="banner banner--error" role="alert" id="run-error" tabindex="-1">${icon('alert')}<div>${RUN_NO_CREATE}</div></div>`;
    } else if (state.runUnconfirmed) {
      banner = `<div class="banner banner--warn" role="alert" id="run-error" tabindex="-1">${icon('alert')}<div>${RUN_UNCONFIRMED}</div></div>`;
    }

    const startButton = `<button type="submit" class="btn btn--primary" id="start-run"${submitting || state.runUnconfirmed ? ' disabled' : ''}>${submitting ? 'Starting run…' : 'Start run'}</button>`;

    return page(`
      ${recordBack('Back to Tasks', '/tasks')}
      <header class="page-head">
        <div class="eyebrow">Manual run</div>
        <div class="page-title-row">
          <h1 class="page-title" id="page-heading" tabindex="-1">${escapeHtml(task.name)}</h1>
          <span class="chip">${escapeHtml(task.version)}</span>
        </div>
        <p class="page-desc">${escapeHtml(task.description)}</p>
        <p class="page-meta">${icon('play', 'icon--xs')}<span>Manual run — this run is started by you.</span></p>
      </header>
      <div class="split">
        <div class="split-main">
          <section class="panel">
            <h2 class="panel-title">Run inputs</h2>
            <form id="run-form" data-task="${escapeHtml(task.name)}" novalidate>
              ${banner}
              ${summary}
              ${fields}
              <div class="form-actions">
                ${startButton}
                ${state.runUnconfirmed ? `<a class="btn btn--secondary" href="#/tasks" data-link>Back to Tasks</a>` : ''}
              </div>
              ${submitting ? `<p class="form-status" role="status">Starting run. Please wait.</p>` : ''}
            </form>
          </section>
        </div>
        <aside class="split-side">
          <div class="facts">
            <div class="facts-title">Run composition</div>
            <div class="fact-row">
              <span class="fact-label">Version</span>
              <span class="fact-value"><span class="chip">${escapeHtml(task.version)}</span></span>
            </div>
            <div class="fact-row">
              <span class="fact-label">Steps</span>
              <span class="fact-value">${task.steps.length}</span>
            </div>
            <div class="fact-row">
              <span class="fact-label">Initiation</span>
              <span class="fact-value">Manual run only</span>
            </div>
            <p class="fact-note">The task definition is read-only on this page.</p>
          </div>
        </aside>
      </div>`);
  }

  /* -----------------------------------------------------------------------
     Rendering: run outcome (PG-009)
     ----------------------------------------------------------------------- */

  function stepTone(status) {
    if (status === 'Succeeded') return 'ok';
    if (status === 'Failed') return 'error';
    if (status === 'Running') return 'info';
    return 'neutral';
  }

  function renderRunSteps(run) {
    if (run.steps.length === 0) {
      return `<div class="panel"><h2 class="panel-title">No step results</h2><p class="prose">${RUN_REJECTED}</p></div>`;
    }
    const hasMcp = run.steps.some((step) => step.kind === 'mcp');
    return `<div class="table-panel">
      <table class="steps-table">
        <caption class="sr-only">Run steps</caption>
        <thead><tr><th scope="col">Step</th><th scope="col">Target</th><th scope="col">Status</th><th scope="col">Duration</th><th scope="col">Result</th></tr></thead>
        <tbody>${run.steps.map((step) => `
          <tr>
            <td class="step-ordinal">${step.ordinal}</td>
            <td class="step-target"><span class="step-kind">${step.kind === 'skill' ? 'Skill' : 'MCP tool'}</span>${step.kind === 'skill' && step.target ? `<span class="step-name">${escapeHtml(step.target)}</span>` : ''}</td>
            <td class="step-status">${statusBadge(step.status, stepTone(step.status))}</td>
            <td class="step-duration">${escapeHtml(step.duration || '—')}</td>
            <td class="step-result">${escapeHtml(step.result || '—')}</td>
          </tr>`).join('')}</tbody>
      </table>
      ${hasMcp ? '<div class="table-note">MCP tool names are not shown.</div>' : ''}
    </div>`;
  }

  function outcomeSummary(run) {
    if (run.state === 'Succeeded') {
      return { tone: 'ok', title: 'Succeeded', body: 'Every step succeeded.' };
    }
    if (run.state === 'Failed') {
      if (run.rejectedBeforeStep || run.steps.length === 0) {
        return { tone: 'error', title: 'Failed', body: RUN_REJECTED };
      }
      const failed = run.steps.find((step) => step.status === 'Failed');
      return { tone: 'error', title: 'Failed', body: `Run failed at step ${failed ? failed.ordinal : '—'}. Remaining steps were skipped.` };
    }
    if (run.state === 'Running') {
      return { tone: 'info', title: 'Running', body: 'The run is still running. The current step status is shown.' };
    }
    return { tone: 'neutral', title: 'Initiated', body: 'The run was created and is waiting for its first step.' };
  }

  function renderRunOutcome(route) {
    const override = state.override;
    if (override === 'no-permission') return page(noPermissionPanel({ backToSignIn: true }));
    if (override === 'loading') {
      return page(`${hiddenHeading('Run outcome')}${recordBack('Back to Tasks', '/tasks')}<div class="loading-region" aria-busy="true"><span class="sr-only">Loading run outcome</span>${skeletonRecord()}</div>`);
    }

    const run = findRun(route.ref);
    if (override === 'no-result' || !run) {
      return page(`${recordBack('Back to Tasks', '/tasks')}${statePanel({
        title: 'This run is not available.',
        body: 'The run reference did not resolve.',
        level: 1
      })}`);
    }

    if (override === 'error') {
      return page(`${recordBack('Back to Tasks', '/tasks')}${statePanel({
        title: 'This page could not load.',
        body: 'The run record was not retrieved. Retry, or return to Tasks.',
        actions: `<button type="button" class="btn btn--secondary" data-action="retry-run">Retry</button>`,
        level: 1
      })}`);
    }

    const summary = outcomeSummary(run);
    const statusBanner = state.runStatusError
      ? `<div class="banner banner--warn" role="status">${icon('alert')}<div><strong>Status unavailable.</strong> The last reported state is shown. <span><button type="button" class="btn btn--secondary btn--sm" data-action="retry-run-status">Retry</button></span></div></div>`
      : '';

    return page(`
      ${recordBack('Back to Tasks', '/tasks')}
      <header class="page-head">
        <div class="eyebrow">Run outcome</div>
        <div class="page-title-row">
          <h1 class="page-title page-title--mono" id="page-heading" tabindex="-1">${escapeHtml(run.ref)}</h1>
          ${statusBadge(run.state, toneForRun(run.state))}
        </div>
        <div class="page-meta">
          <span>${icon('info', 'icon--xs')} Initiated by you</span>
          <span>${escapeHtml(run.taskName)} · ${escapeHtml(run.version)}</span>
        </div>
      </header>
      ${statusBanner}
      <div class="split">
        <div class="split-main">
          <div class="outcome outcome--${summary.tone}">
            <div>
              <div class="outcome-title">${escapeHtml(summary.title)}</div>
              <div class="outcome-body">${escapeHtml(summary.body)}</div>
            </div>
          </div>
          ${renderRunSteps(run)}
          <div class="run-actions">
            <button type="button" class="btn btn--primary" data-action="start-new-run" data-task="${escapeHtml(run.task)}">Start a new run</button>
            <a class="btn btn--secondary" href="#/tasks" data-link>Back to Tasks</a>
          </div>
        </div>
        <aside class="split-side">
          <div class="facts">
            <div class="facts-title">Run summary</div>
            <div class="fact-row">
              <span class="fact-label">Task</span>
              <span class="fact-value">${escapeHtml(run.taskName)}</span>
            </div>
            <div class="fact-row">
              <span class="fact-label">Version</span>
              <span class="fact-value"><span class="chip">${escapeHtml(run.version)}</span></span>
            </div>
            <div class="fact-row">
              <span class="fact-label">Initiated by</span>
              <span class="fact-value">You</span>
            </div>
            <p class="fact-note">The run outcome is read-only.</p>
          </div>
        </aside>
      </div>`);
  }

  /* -----------------------------------------------------------------------
     Rendering: denied pages (PG-010, PG-011, PG-012)
     ----------------------------------------------------------------------- */

  function renderDeniedPage(route) {
    const config = {
      'PG-010': { href: '/skills', label: 'Back to Skills' },
      'PG-011': { href: '/mcp', label: 'Back to MCP servers' },
      'PG-012': { href: '/tasks', label: 'Back to Tasks' }
    }[route.id];
    return page(noPermissionPanel({ backHref: config.href, backLabel: config.label }));
  }

  /* -----------------------------------------------------------------------
     Rendering: dispatch
     ----------------------------------------------------------------------- */

  function renderPage(route) {
    if (route.id === 'PG-003') return renderSkillsPage();
    if (route.id === 'PG-004') return renderSkillRecord(route);
    if (route.id === 'PG-005') return renderMcpPage();
    if (route.id === 'PG-006') return renderMcpRecord(route);
    if (route.id === 'PG-007') return renderTasksPage();
    if (route.id === 'PG-008') return renderTaskRun(route);
    if (route.id === 'PG-009') return renderRunOutcome(route);
    if (route.id === 'PG-010' || route.id === 'PG-011' || route.id === 'PG-012') return renderDeniedPage(route);
    return '';
  }

  function applyFocus({ focusHeading = false } = {}) {
    if (state.focus) {
      const requested = $(state.focus.selector);
      if (requested) {
        requested.focus();
        if (state.focus.cursor === 'end' && typeof requested.setSelectionRange === 'function') {
          const length = requested.value.length;
          requested.setSelectionRange(length, length);
        }
        if (state.focus.select && typeof requested.select === 'function') requested.select();
      }
      state.focus = null;
      return;
    }
    if (focusHeading) {
      const heading = $('#state-heading') || $('#page-heading') || $('#main');
      if (heading) heading.focus();
    }
  }

  function render({ focusHeading = false } = {}) {
    if (!state.route) return;
    const contentBefore = $('.content');
    const scrollBefore = contentBefore ? contentBefore.scrollTop : 0;
    const route = state.route;

    if (route.id === 'PG-001') {
      APP.innerHTML = renderSignInPage();
    } else {
      APP.innerHTML = renderShell(route, route.id === 'PG-002' ? renderChat(route) : renderPage(route), route.id === 'PG-002');
    }

    const contentAfter = $('.content');
    if (contentAfter) contentAfter.scrollTop = scrollBefore;

    if (route.id === 'PG-002') {
      const thread = $('.thread');
      if (thread) {
        thread.scrollTop = state.scrollThread === 'bottom' ? thread.scrollHeight : 0;
      }
      state.scrollThread = null;
    }

    renderReview();
    applyFocus({ focusHeading });
  }

  /* -----------------------------------------------------------------------
     Rendering: review panel and coverage matrix
     ----------------------------------------------------------------------- */

  const NA = (reason) => ({ status: 'na', reason });
  const SPEC = (note, actions = []) => ({ status: 'specified', note, actions });

  const COVERAGE = {
    'PG-001': {
      title: 'Sign in',
      rows: [
        { state: 'Default', ...SPEC('Two fields, one primary Sign in, and a static account-help note.', [{ label: 'Reset', action: 'clear' }]) },
        { state: 'Loading', ...NA('The page is a static form; it retrieves no record. Submission has its own Submitting state.') },
        { state: 'Empty', ...NA('There is no collection. Empty fields are the Default state.') },
        { state: 'No Result', ...NA('The page has no record reference and no search.') },
        { state: 'Error', ...SPEC('A generic denial or session failure stays on this page. The credential is cleared.', [{ label: 'Show error', action: 'signin-error' }]) },
        { state: 'No Permission', ...NA('Sign-in is the pre-session entry. A failed credential is Error, not a page permission.') },
        { state: 'Editing', ...SPEC('The person is filling the two fields. The credential is never retained after a failure.', [{ label: 'Show editing', action: 'signin-editing' }]) },
        { state: 'Submitting', ...SPEC('Sign in is disabled and both fields are read-only. A second activation is ignored.', [{ label: 'Show submitting', action: 'force:submitting' }]) },
        { state: 'Success-Failure', ...SPEC('Success enters Chat. Failure stays on this page with a generic error.', [{ label: 'Sign in', action: 'signin-success' }]) }
      ]
    },
    'PG-002': {
      title: 'Chat',
      rows: [
        { state: 'Default', ...SPEC('The sidebar lists only your conversations; the open conversation shows ordered messages and the pinned composer.', [{ label: 'Reset', action: 'clear' }]) },
        { state: 'Loading', ...SPEC('Conversation list and thread skeletons; the composer is disabled until the context loads.', [{ label: 'Show loading', action: 'force:loading' }]) },
        { state: 'Empty', ...SPEC('No conversations yet, or a new conversation with no messages. No suggested prompts or task shortcuts.', [{ label: 'Show empty', action: 'force:empty' }]) },
        { state: 'No Result', ...SPEC('A conversation reference that does not resolve shows the shared Conversation unavailable panel.', [{ label: 'Show no result', action: 'force:no-result' }]) },
        { state: 'Error', ...SPEC('A list or message load failure shows Error with Retry; the composer stays disabled.', [{ label: 'Show error', action: 'force:error' }]) },
        { state: 'No Permission', ...SPEC('An unauthenticated visit redirects to Sign in. A non-owned conversation uses the same generic panel as No Result.', [{ label: 'Show panel', action: 'force:no-permission' }]) },
        { state: 'Editing', ...SPEC('The composer contains unsent text. Leaving asks “Discard unsent text?”.', [{ label: 'Show editing', action: 'chat-editing' }]) },
        { state: 'Submitting', ...SPEC('The user turn is Sending, one assistant turn is pending, and the composer is locked. No assistant text is fabricated.', [{ label: 'Show submitting', action: 'force:submitting' }]) },
        { state: 'Success-Failure', ...SPEC('Success appends exactly one assistant message. Failure removes the pending turn, keeps the user message, and offers Try again.', [{ label: 'Show success', action: 'force:success' }, { label: 'Show failure', action: 'force:failure' }]) }
      ]
    },
    'PG-003': {
      title: 'Skills registry',
      rows: [
        { state: 'Default', ...SPEC('Recorded skill cards with name, description, and a Recorded marker. No create action.', [{ label: 'Reset', action: 'clear' }]) },
        { state: 'Loading', ...SPEC('Header and count placeholder remain; cards become skeletons; the count shows —.', [{ label: 'Show loading', action: 'force:loading' }]) },
        { state: 'Empty', ...SPEC('Zero recorded skills is a valid terminal state. No create action is shown.', [{ label: 'Show empty', action: 'force:empty' }]) },
        { state: 'No Result', ...NA('The list has no query or filter. An unrecorded skill reference resolves on PG-004.') },
        { state: 'Error', ...SPEC('A load failure shows Error with Retry. It never falls back to Empty or a zero count.', [{ label: 'Show error', action: 'force:error' }]) },
        { state: 'No Permission', ...SPEC('A role without Skill.read sees No Permission, not an empty list. Recovery is return to sign in.', [{ label: 'Show denied', action: 'force:no-permission' }]) },
        { state: 'Editing', ...NA('There is no inline editing. The proposed edit route is PG-010 and is denied.') },
        { state: 'Submitting', ...NA('The page performs no mutating operation.') },
        { state: 'Success-Failure', ...NA('Read success is Default; read failure is Error. There is no page-level terminal operation.') }
      ]
    },
    'PG-004': {
      title: 'Skill record',
      rows: [
        { state: 'Default', ...SPEC('Name, Recorded marker, description, instructions, input definition, and a version label where present.', [{ label: 'Reset', action: 'clear' }]) },
        { state: 'Loading', ...SPEC('A record skeleton preserves the breadcrumb and Back to Skills.', [{ label: 'Show loading', action: 'force:loading' }]) },
        { state: 'Empty', ...NA('A record either resolves or does not. A missing field is shown as Not provided, not as a page Empty state.') },
        { state: 'No Result', ...SPEC('An unrecorded skill name shows “This skill is not in the registry.” Back to Skills is the only recovery.', [{ label: 'Show no result', action: 'force:no-result' }]) },
        { state: 'Error', ...SPEC('A record load failure shows Error with Retry and Back to Skills. It never renders an empty record.', [{ label: 'Show error', action: 'force:error' }]) },
        { state: 'No Permission', ...SPEC('A role without Skill.read sees No Permission with return to sign in. There is no own-only rule for skills.', [{ label: 'Show denied', action: 'force:no-permission' }]) },
        { state: 'Editing', ...NA('The record is read-only. No inline edit is rendered.') },
        { state: 'Submitting', ...NA('No mutating action exists on this page.') },
        { state: 'Success-Failure', ...NA('Read success is Default; read failure is Error.') }
      ]
    },
    'PG-005': {
      title: 'MCP registry',
      rows: [
        { state: 'Default', ...SPEC('Recorded server cards with recorded health and a credential-reference indicator. No tool names, add, test, or allowlist control.', [{ label: 'Reset', action: 'clear' }]) },
        { state: 'Loading', ...SPEC('Header and count placeholder remain; cards become skeletons; the count shows —.', [{ label: 'Show loading', action: 'force:loading' }]) },
        { state: 'Empty', ...SPEC('Zero recorded servers is valid. No add action is shown because no role may register one.', [{ label: 'Show empty', action: 'force:empty' }]) },
        { state: 'No Result', ...NA('The list has no query or filter. An unrecorded server reference resolves on PG-006.') },
        { state: 'Error', ...SPEC('A load failure shows Error with Retry; it does not render Empty.', [{ label: 'Show error', action: 'force:error' }]) },
        { state: 'No Permission', ...SPEC('A role without McpServer.read sees No Permission, not an empty list. No credential value is exposed.', [{ label: 'Show denied', action: 'force:no-permission' }]) },
        { state: 'Editing', ...NA('No inline editing. The proposed add, test, and allowlist route is PG-011 and is denied.') },
        { state: 'Submitting', ...NA('No mutating action exists on this page.') },
        { state: 'Success-Failure', ...NA('Read success is Default; read failure is Error.') }
      ]
    },
    'PG-006': {
      title: 'MCP server record',
      rows: [
        { state: 'Default', ...SPEC('Server name, recorded health, connection facts, credential-reference presence, timeout, and a tool-reference count.', [{ label: 'Reset', action: 'clear' }]) },
        { state: 'Loading', ...SPEC('A record skeleton with the breadcrumb and Back to MCP servers.', [{ label: 'Show loading', action: 'force:loading' }]) },
        { state: 'Empty', ...NA('A record either resolves or does not. A zero tool-reference count is shown as No tool references recorded, a field-level absence.') },
        { state: 'No Result', ...SPEC('An unrecorded server name shows “This server is not in the registry.” Back to MCP servers is the only recovery.', [{ label: 'Show no result', action: 'force:no-result' }]) },
        { state: 'Error', ...SPEC('A record load failure shows Error with Retry and Back. It never renders a blank server.', [{ label: 'Show error', action: 'force:error' }]) },
        { state: 'No Permission', ...SPEC('A role without McpServer.read sees No Permission with return to sign in. No call control exists.', [{ label: 'Show denied', action: 'force:no-permission' }]) },
        { state: 'Editing', ...NA('The record is read-only. The proposed edit route is PG-011 and is denied.') },
        { state: 'Submitting', ...NA('No mutating action exists on this page.') },
        { state: 'Success-Failure', ...NA('Read success is Default; read failure is Error.') }
      ]
    },
    'PG-007': {
      title: 'Tasks registry',
      rows: [
        { state: 'Default', ...SPEC('Recorded task cards with name, description, version label, step count, and Run as the only action.', [{ label: 'Reset', action: 'clear' }]) },
        { state: 'Loading', ...SPEC('Header and count placeholder remain; cards become skeletons; Run is unavailable until each task is loaded.', [{ label: 'Show loading', action: 'force:loading' }]) },
        { state: 'Empty', ...SPEC('Zero recorded tasks is valid. No New task action is shown and there is no Run action.', [{ label: 'Show empty', action: 'force:empty' }]) },
        { state: 'No Result', ...NA('The list has no query or filter. An unrecorded task reference resolves on PG-008.') },
        { state: 'Error', ...SPEC('A load failure shows Error with Retry; it never falls back to Empty.', [{ label: 'Show error', action: 'force:error' }]) },
        { state: 'No Permission', ...SPEC('A proposed role is denied both read and run and sees No Permission. Run is rendered only when the task is recorded and initiation is allowed.', [{ label: 'Show denied', action: 'force:no-permission' }]) },
        { state: 'Editing', ...NA('There is no inline editing. The proposed authoring route is PG-012 and is denied.') },
        { state: 'Submitting', ...NA('Run navigates to PG-008; submission happens there. The list itself submits nothing.') },
        { state: 'Success-Failure', ...NA('Read success is Default; read failure is Error.') }
      ]
    },
    'PG-008': {
      title: 'Task run',
      rows: [
        { state: 'Default', ...SPEC('Task name, version, description, manual-run note, declared inputs, Start run, and a read-only composition summary.', [{ label: 'Reset', action: 'clear' }]) },
        { state: 'Loading', ...SPEC('The task record loads before the form. Header and a form skeleton remain; Start run is unavailable.', [{ label: 'Show loading', action: 'force:loading' }]) },
        { state: 'Empty', ...NA('A task with no declared inputs still renders a complete run form; no tasks is Empty on PG-007. An unrecorded task is No Result.') },
        { state: 'No Result', ...SPEC('An unrecorded task reference shows “This task is not in the registry.” No run form and no Start run.', [{ label: 'Show no result', action: 'force:no-result' }]) },
        { state: 'Error', ...SPEC('A task load failure shows Error with Retry. A run-creation failure stays here with “No run was created” and preserved inputs. An unconfirmed result says “Run start unconfirmed” and does not invite a blind retry.', [{ label: 'Show load error', action: 'force:error' }, { label: 'No run created', action: 'run-no-create' }, { label: 'Unconfirmed', action: 'run-unconfirmed' }]) },
        { state: 'No Permission', ...SPEC('A role without Run.initiate sees No Permission with return to sign in. An inactive session goes to Sign in.', [{ label: 'Show denied', action: 'force:no-permission' }]) },
        { state: 'Editing', ...SPEC('The person is filling the declared inputs. Leaving with a non-empty form asks “Discard unsent text?”.', [{ label: 'Show editing', action: 'run-editing' }]) },
        { state: 'Submitting', ...SPEC('Start run is disabled, inputs are locked, and the label becomes Starting run…. A second activation is ignored.', [{ label: 'Show submitting', action: 'run-submitting' }]) },
        { state: 'Success-Failure', ...SPEC('Success creates a run and opens PG-009; it does not claim the run succeeded. Failure to create a run stays here.', [{ label: 'Create run', action: 'run-create' }, { label: 'Rejected run', action: 'run-rejected' }]) }
      ]
    },
    'PG-009': {
      title: 'Run outcome',
      rows: [
        { state: 'Default', ...SPEC('Run reference, state, “Initiated by you”, task name and version, outcome summary, and one row per step.', [{ label: 'Reset', action: 'clear' }]) },
        { state: 'Loading', ...SPEC('A run skeleton preserves the breadcrumb and run reference. No step status is shown as final before the run loads.', [{ label: 'Show loading', action: 'force:loading' }]) },
        { state: 'Empty', ...NA('The run has at least one step by invariant. A rejected run shows “No step results”, which is a field-level absence.') },
        { state: 'No Result', ...SPEC('An unresolved reference shows “This run is not available.” No task, owner, state, or step is disclosed.', [{ label: 'Show no result', action: 'force:no-result' }]) },
        { state: 'Error', ...SPEC('A load or status-update failure keeps the last reported state, marks it Status unavailable, and offers Retry.', [{ label: 'Show status error', action: 'run-status-error' }]) },
        { state: 'No Permission', ...SPEC('An own-only run from another account uses the same “This run is not available.” panel. A role without Run.read sees No Permission.', [{ label: 'Show denied', action: 'force:no-permission' }]) },
        { state: 'Editing', ...NA('The run is read-only. No step can be edited, reordered, retried, or cancelled.') },
        { state: 'Submitting', ...NA('The page submits nothing. Start a new run navigates to PG-008, where submission is owned.') },
        { state: 'Success-Failure', ...SPEC('Succeeded, Failed after a step, and Failed before any step are terminal. Initiated and Running are non-terminal and are never presented as success or failure.', [{ label: 'Succeeded', action: 'run-outcome-success' }, { label: 'Failed at step', action: 'run-outcome-failure' }, { label: 'Failed before step', action: 'run-outcome-rejected' }, { label: 'Running', action: 'run-outcome-running' }]) }
      ]
    },
    'PG-010': {
      title: 'Skill editor — denied',
      rows: [
        { state: 'Default', ...SPEC('The effective Default is the No Permission panel. No form, draft, test, or write control is rendered.') },
        { state: 'Loading', ...NA('Effective N/A: no authorized operation can start, so there is no loading state today.') },
        { state: 'Empty', ...NA('Effective N/A: no draft is created.') },
        { state: 'No Result', ...NA('Effective N/A: no draft exists to resolve.') },
        { state: 'Error', ...NA('Effective N/A: no validation or authoring operation can run.') },
        { state: 'No Permission', ...SPEC('This is the only reachable state. The panel offers one readable route back to Skills.') },
        { state: 'Editing', ...NA('Effective N/A: no draft or form is created.') },
        { state: 'Submitting', ...NA('Effective N/A: no authoring operation is available.') },
        { state: 'Success-Failure', ...NA('Effective N/A: no version can be created today.') }
      ]
    },
    'PG-011': {
      title: 'MCP server editor — denied',
      rows: [
        { state: 'Default', ...SPEC('The effective Default is the No Permission panel. No server draft, test, or allowlist control is rendered.') },
        { state: 'Loading', ...NA('Effective N/A: no authorized operation can start.') },
        { state: 'Empty', ...NA('Effective N/A: no draft is created.') },
        { state: 'No Result', ...NA('Effective N/A: no draft exists to resolve.') },
        { state: 'Error', ...NA('Effective N/A: no validation or connection test can run.') },
        { state: 'No Permission', ...SPEC('This is the only reachable state. The panel offers one readable route back to MCP servers.') },
        { state: 'Editing', ...NA('Effective N/A: no draft or form is created.') },
        { state: 'Submitting', ...NA('Effective N/A: no connection test or save is available.') },
        { state: 'Success-Failure', ...NA('Effective N/A: no authoring operation can complete today.') }
      ]
    },
    'PG-012': {
      title: 'Task definition editor — denied',
      rows: [
        { state: 'Default', ...SPEC('The effective Default is the No Permission panel. No task draft, test run, or write control is rendered.') },
        { state: 'Loading', ...NA('Effective N/A: no authorized operation can start.') },
        { state: 'Empty', ...NA('Effective N/A: no task draft is created.') },
        { state: 'No Result', ...NA('Effective N/A: no draft exists to resolve.') },
        { state: 'Error', ...NA('Effective N/A: no validation or authoring operation can run.') },
        { state: 'No Permission', ...SPEC('This is the only reachable state. The panel offers one readable route back to Tasks.') },
        { state: 'Editing', ...NA('Effective N/A: no draft or form is created.') },
        { state: 'Submitting', ...NA('Effective N/A: no authoring operation is available.') },
        { state: 'Success-Failure', ...NA('Effective N/A: no version can be created today.') }
      ]
    }
  };

  function renderReview() {
    if (!state.reviewOpen || !state.route || !COVERAGE[state.route.id]) {
      REVIEW.innerHTML = '';
      return;
    }
    const coverage = COVERAGE[state.route.id];
    const selected = state.override ? `<div class="review-forced">${icon('alert', 'icon--xs')}<span>Forced state: ${escapeHtml(state.override)}</span></div>` : '';
    const rows = coverage.rows.map((row) => {
      const actions = row.status === 'specified' && row.actions && row.actions.length
        ? `<div class="review-actions">${row.actions.map((action) => `<button type="button" class="btn btn--secondary" data-action="review-state" data-state-action="${escapeHtml(action.action)}">${escapeHtml(action.label)}</button>`).join('')}</div>`
        : '';
      return `<div class="review-row">
        <div class="review-state">${escapeHtml(row.state)}</div>
        <div class="review-verdict${row.status === 'na' ? ' review-verdict--na' : ''}">${row.status === 'na' ? 'N/A' : 'Specified'}</div>
        <p class="review-note">${escapeHtml(row.status === 'na' ? row.reason : row.note)}</p>
        ${actions}
      </div>`;
    }).join('');

    REVIEW.innerHTML = `
      <section class="review-panel" id="review-panel" role="region" aria-labelledby="review-heading">
        <div class="review-head">
          <div>
            <div class="review-kicker">Prototype review</div>
            <div class="review-title" id="review-heading" tabindex="-1">State coverage · ${escapeHtml(state.route.id)} ${escapeHtml(coverage.title)}</div>
          </div>
          <button type="button" class="review-close" data-action="review-close" aria-label="Close prototype state coverage">${icon('close', 'icon--sm')}</button>
        </div>
        <p class="review-sub">Review control — not part of the product. Synthetic data; state resets on refresh.</p>
        ${selected}
        ${rows}
        <div class="review-footer">
          <button type="button" class="btn btn--secondary" data-action="review-session-end">Simulate session ended</button>
          ${state.override ? `<button type="button" class="btn btn--secondary" data-action="review-state" data-state-action="clear">Clear forced state</button>` : ''}
        </div>
      </section>`;
  }

  /* -----------------------------------------------------------------------
     Review actions and forced states
     ----------------------------------------------------------------------- */

  function resetForcedState() {
    state.override = null;
    state.signInError = null;
    state.signInNotice = null;
    state.signInFieldErrors = {};
    state.signInSubmitting = false;
    state.runErrors = {};
    state.runUnconfirmed = false;
    state.runSubmitting = false;
    state.runStatusError = false;
    state.runSimMode = 'auto';
    state.chatError = null;
    state.chatDraft = '';
    state.chatDraftRef = null;
    if (state.route && state.route.id === 'PG-008') {
      delete state.runDrafts[state.route.name];
    }
    render({ focusHeading: true });
  }

  function setOverride(key) {
    state.override = key;
    state.signInError = null;
    state.signInSubmitting = false;
    state.runSubmitting = false;
    state.runUnconfirmed = false;
    state.chatError = null;
    if (key === 'editing' && state.route.id === 'PG-002') {
      state.chatDraft = DEMO_CHAT_TEXT;
      state.chatDraftRef = state.activeConversation;
    }
    if (key === 'editing' && state.route.id === 'PG-008') {
      const task = findTask(state.route.name);
      if (task) state.runDrafts[task.name] = demoRunValues(task);
    }
    if (key === 'editing' && state.route.id === 'PG-001') {
      state.focus = { selector: '#signin-credential' };
    }
    if (key === 'submitting' && state.route.id === 'PG-008') {
      const task = findTask(state.route.name);
      if (task) state.runDrafts[task.name] = demoRunValues(task);
    }
    render({ focusHeading: true });
  }

  function forceSignInError() {
    state.override = null;
    state.signInError = GENERIC_SIGNIN_ERROR;
    state.signInNotice = null;
    state.signInSubmitting = false;
    state.signInFieldErrors = {};
    render();
    const credential = $('#signin-credential');
    if (credential) credential.focus();
  }

  function showSignInEditing() {
    state.override = 'editing';
    state.signInError = null;
    state.signInFieldErrors = {};
    state.signInNotice = null;
    render({ focusHeading: false });
    const credential = $('#signin-credential');
    if (credential) credential.focus();
  }

  function demoSignIn() {
    state.override = null;
    state.signInError = null;
    state.signInNotice = null;
    state.signInFieldErrors = {};
    state.signInSubmitting = true;
    state.signInName = 'demo-member';
    render({ focusHeading: false });
    window.setTimeout(() => {
      state.signInSubmitting = false;
      state.authed = true;
      state.sessionEpoch += 1;
      state.route = null;
      window.history.replaceState(null, '', '#/chat');
      applyRoute('/chat', { focusHeading: true });
      announce('Signed in.');
    }, 700);
  }

  function fillChatEditing() {
    state.override = null;
    state.chatError = null;
    state.chatDraft = DEMO_CHAT_TEXT;
    state.chatDraftRef = state.activeConversation;
    render({ focusHeading: false });
    const composer = $('#composer-input');
    if (composer) {
      composer.focus();
      const length = composer.value.length;
      composer.setSelectionRange(length, length);
    }
  }

  function reviewRunCreate() {
    const task = findTask(state.route.name);
    if (!task) return;
    state.override = null;
    state.runDrafts[task.name] = demoRunValues(task);
    startRun(task);
  }

  function runStatusError() {
    state.runStatusError = true;
    state.override = null;
    render({ focusHeading: false });
  }

  function handleReviewAction(action) {
    if (!state.route) return;
    if (action === 'clear') {
      resetForcedState();
      return;
    }
    if (action === 'signin-error') {
      forceSignInError();
      return;
    }
    if (action === 'signin-editing') {
      showSignInEditing();
      return;
    }
    if (action === 'signin-success') {
      demoSignIn();
      return;
    }
    if (action === 'chat-editing') {
      fillChatEditing();
      return;
    }
    if (action === 'run-editing') {
      const task = findTask(state.route.name);
      if (!task) return;
      state.runDrafts[task.name] = demoRunValues(task);
      state.override = null;
      state.runErrors = {};
      render({ focusHeading: false });
      const firstInput = $('[data-run-input]');
      if (firstInput) firstInput.focus();
      return;
    }
    if (action === 'run-submitting') {
      setOverride('submitting');
      return;
    }
    if (action === 'run-no-create') {
      const task = findTask(state.route.name);
      if (!task) return;
      state.override = null;
      state.runDrafts[task.name] = demoRunValues(task);
      state.runSimMode = 'norecord';
      startRun(task);
      return;
    }
    if (action === 'run-unconfirmed') {
      const task = findTask(state.route.name);
      if (!task) return;
      state.override = null;
      state.runDrafts[task.name] = demoRunValues(task);
      state.runSimMode = 'unconfirmed';
      startRun(task);
      return;
    }
    if (action === 'run-create') {
      reviewRunCreate();
      return;
    }
    if (action === 'run-rejected') {
      navigate('/runs/RUN-5C1R', { force: true });
      return;
    }
    if (action === 'run-status-error') {
      runStatusError();
      return;
    }
    if (action === 'run-outcome-success') {
      navigate('/runs/RUN-7K2M', { force: true });
      return;
    }
    if (action === 'run-outcome-failure') {
      navigate('/runs/RUN-3P9Q', { force: true });
      return;
    }
    if (action === 'run-outcome-rejected') {
      navigate('/runs/RUN-5C1R', { force: true });
      return;
    }
    if (action === 'run-outcome-running') {
      navigate('/runs/RUN-9T6B', { force: true });
      return;
    }
    if (action.startsWith('force:')) {
      setOverride(action.slice('force:'.length));
    }
  }

  /* -----------------------------------------------------------------------
     Chat actions
     ----------------------------------------------------------------------- */

  function newChat() {
    const create = () => {
      const conversation = createConversation();
      state.activeConversation = conversation.ref;
      state.chatDraft = '';
      state.chatDraftRef = null;
      state.chatError = null;
      state.override = null;
      navigate(`/chat/${conversation.ref}`, { force: true });
    };
    const unsaved = getUnsaved();
    if (unsaved) {
      openDiscard({ type: unsaved.type, taskName: unsaved.taskName, onDiscard: create });
      return;
    }
    create();
  }

  function sendChat() {
    const conversation = activeConversation();
    if (!conversation) {
      newChat();
      return;
    }
    if (conversation.pending) return;
    const input = $('#composer-input');
    const text = input ? input.value : state.chatDraft;
    state.chatDraft = text;
    state.chatDraftRef = conversation.ref;

    if (text.length === 0) {
      state.chatError = EMPTY_MESSAGE_ERROR;
      state.override = null;
      render({ focusHeading: false });
      const composer = $('#composer-input');
      if (composer) composer.focus();
      return;
    }

    const epoch = state.sessionEpoch;
    state.chatError = null;
    state.chatDraft = '';
    state.chatDraftRef = null;
    conversation.error = null;
    conversation.lastFailedText = '';
    conversation.messages.push({ role: 'user', text, status: 'sending' });
    conversation.pending = { text };
    state.scrollThread = 'bottom';
    state.override = null;
    render({ focusHeading: false });
    const thread = $('.thread');
    if (thread) thread.scrollTop = thread.scrollHeight;
    announce('Message sent. The assistant is responding.');

    const ref = conversation.ref;
    window.setTimeout(() => {
      if (state.sessionEpoch !== epoch) return;
      const current = findConversation(ref);
      if (!current || !current.pending) return;
      current.messages.push({ role: 'assistant', pending: true });
      if (isShowingConversation(ref)) {
        state.scrollThread = 'bottom';
        render({ focusHeading: false });
        const currentThread = $('.thread');
        if (currentThread) currentThread.scrollTop = currentThread.scrollHeight;
      }
    }, 520);

    window.setTimeout(() => {
      if (state.sessionEpoch !== epoch) return;
      const current = findConversation(ref);
      if (!current || !current.pending) return;
      current.pending = null;
      current.messages = current.messages.filter((message) => !message.pending);
      current.messages = current.messages.map((message) => (
        message.role === 'user' && message.status === 'sending' ? { ...message, status: 'sent' } : message
      ));
      current.messages.push({ role: 'assistant', text: DEMO_REPLY });
      if (isShowingConversation(ref)) {
        state.scrollThread = 'bottom';
        render({ focusHeading: false });
        const composer = $('#composer-input');
        if (composer) composer.focus();
        const currentThread = $('.thread');
        if (currentThread) currentThread.scrollTop = currentThread.scrollHeight;
      }
      announce('Assistant responded.');
    }, 1720);
  }

  function tryAgain() {
    const conversation = activeConversation();
    const retryText = (conversation && conversation.lastFailedText) || (state.override === 'failure' ? DEMO_CHAT_TEXT : '');
    if (!retryText) return;
    state.chatDraft = retryText;
    state.chatDraftRef = conversation ? conversation.ref : state.activeConversation;
    if (conversation) conversation.error = null;
    state.chatError = null;
    state.override = null;
    render({ focusHeading: false });
    const composer = $('#composer-input');
    if (composer) {
      composer.focus();
      const length = composer.value.length;
      composer.setSelectionRange(length, length);
    }
  }

  function retryChat() {
    state.override = 'loading';
    render({ focusHeading: false });
    window.setTimeout(() => {
      state.override = null;
      render({ focusHeading: false });
    }, 500);
  }

  /* -----------------------------------------------------------------------
     Run actions
     ----------------------------------------------------------------------- */

  function validateRunInputs(task, values) {
    const fields = {};
    task.inputs.forEach((input) => {
      if (input.required && String(values[input.name] || '').length === 0) {
        fields[input.name] = `Enter ${input.name}.`;
      }
    });
    return fields;
  }

  function startRun(task) {
    if (state.runSubmitting || state.runUnconfirmed) return;
    const values = state.runDrafts[task.name] || {};
    const fields = validateRunInputs(task, values);
    if (Object.keys(fields).length > 0) {
      state.runErrors[task.name] = { fields };
      state.override = null;
      render({ focusHeading: false });
      const first = task.inputs.find((input) => fields[input.name]);
      if (first) {
        const field = document.getElementById(inputId(task, first));
        if (field) field.focus();
      }
      return;
    }

    state.runSubmitting = true;
    state.runErrors = {};
    state.runUnconfirmed = false;
    state.override = null;
    render({ focusHeading: false });

    const epoch = state.sessionEpoch;
    const mode = state.runSimMode;
    state.runSimMode = 'auto';

    window.setTimeout(() => {
      if (state.sessionEpoch !== epoch) return;
      state.runSubmitting = false;
      if (mode === 'norecord') {
        state.runErrors[task.name] = { type: 'no-run' };
        render({ focusHeading: false });
        const banner = $('#run-error');
        if (banner) banner.focus();
        return;
      }
      if (mode === 'unconfirmed') {
        state.runUnconfirmed = true;
        render({ focusHeading: false });
        const banner = $('#run-error');
        if (banner) banner.focus();
        return;
      }
      delete state.runDrafts[task.name];
      const run = createRun(task);
      navigate(`/runs/${run.ref}`, { force: true });
      announce(`Run created. ${run.ref}.`);
    }, 800);
  }

  function createRun(task) {
    let ref = randomRef('RUN', 4);
    while (findRun(ref)) ref = randomRef('RUN', 4);
    const run = {
      ref,
      task: task.name,
      taskName: task.name,
      version: task.version,
      state: 'Initiated',
      initiatedBy: 'you',
      rejectedBeforeStep: false,
      scripted: true,
      outcome: task.outcome,
      steps: task.steps.map((step, index) => ({
        ordinal: index + 1,
        kind: step.kind,
        target: step.kind === 'skill' ? step.skill : null,
        status: 'Pending',
        duration: '—',
        result: '—'
      }))
    };
    state.runs[ref] = run;
    scheduleRun(run);
    return run;
  }

  function scheduleRun(run) {
    const isCurrent = () => state.route && state.route.id === 'PG-009' && state.route.ref === run.ref;
    const refresh = () => {
      if (isCurrent()) render({ focusHeading: false });
    };

    if (run.outcome === 'rejected') {
      window.setTimeout(() => {
        run.state = 'Failed';
        run.rejectedBeforeStep = true;
        run.steps = [];
        refresh();
        announce('Run status: Failed.');
      }, 700);
      return;
    }

    window.setTimeout(() => {
      run.state = 'Running';
      if (run.steps[0]) run.steps[0].status = 'Running';
      refresh();
      announce('Run status: Running.');
    }, 620);

    window.setTimeout(() => {
      if (run.steps[0]) {
        run.steps[0].status = 'Succeeded';
        run.steps[0].duration = '1.1 s';
        run.steps[0].result = 'Returned a result.';
      }
      if (run.steps[1]) run.steps[1].status = 'Running';
      refresh();
    }, 1320);

    if (run.outcome === 'failed') {
      window.setTimeout(() => {
        if (run.steps[1]) {
          run.steps[1].status = 'Failed';
          run.steps[1].duration = '0.9 s';
          run.steps[1].result = 'The target returned an error.';
        }
        run.steps.slice(2).forEach((step) => {
          step.status = 'Skipped';
          step.duration = '—';
          step.result = 'Skipped after the previous step failed.';
        });
        run.state = 'Failed';
        refresh();
        announce('Run failed at step 2.');
      }, 2100);
      return;
    }

    window.setTimeout(() => {
      if (run.steps[1]) {
        run.steps[1].status = 'Succeeded';
        run.steps[1].duration = '0.8 s';
        run.steps[1].result = 'The tool returned a result.';
      }
      if (run.steps[2]) run.steps[2].status = 'Running';
      refresh();
    }, 2020);

    window.setTimeout(() => {
      if (run.steps[2]) {
        run.steps[2].status = 'Succeeded';
        run.steps[2].duration = '1.0 s';
        run.steps[2].result = 'Returned a result.';
      }
      run.state = 'Succeeded';
      refresh();
      announce('Run status: Succeeded.');
    }, 2780);
  }

  function startNewRun(taskName) {
    navigate(`/tasks/${encodeURIComponent(taskName)}/run`, { force: true });
  }

  function retryRegistry(registry) {
    state.override = 'loading';
    render({ focusHeading: false });
    window.setTimeout(() => {
      state.override = null;
      render({ focusHeading: false });
    }, 500);
  }

  function retryRecord(selector, label) {
    state.override = 'loading';
    render({ focusHeading: false });
    window.setTimeout(() => {
      state.override = null;
      render({ focusHeading: false });
    }, 500);
  }

  /* -----------------------------------------------------------------------
     Form handlers
     ----------------------------------------------------------------------- */

  function handleSignInSubmit(event) {
    event.preventDefault();
    if (state.signInSubmitting || state.override === 'submitting') return;
    const nameField = $('#signin-name');
    const credentialField = $('#signin-credential');
    const name = nameField ? nameField.value : state.signInName;
    const credential = credentialField ? credentialField.value : '';
    state.signInName = name;
    const errors = {};
    if (name.length === 0) errors.name = 'Enter your sign-in name.';
    if (credential.length === 0) errors.credential = 'Enter your credential.';
    state.signInFieldErrors = errors;

    if (Object.keys(errors).length > 0) {
      state.signInError = null;
      state.override = null;
      render({ focusHeading: false });
      const firstField = errors.name ? $('#signin-name') : $('#signin-credential');
      if (firstField) firstField.focus();
      return;
    }

    state.signInError = null;
    state.signInNotice = null;
    state.signInSubmitting = true;
    state.override = null;
    render({ focusHeading: false });

    window.setTimeout(() => {
      state.signInSubmitting = false;
      state.authed = true;
      state.sessionEpoch += 1;
      state.route = null;
      window.history.replaceState(null, '', '#/chat');
      applyRoute('/chat', { focusHeading: true });
      announce('Signed in.');
    }, 800);
  }

  function handleRunSubmit(event) {
    event.preventDefault();
    if (state.runSubmitting || state.runUnconfirmed || state.override === 'submitting') return;
    const form = event.target;
    const task = findTask(form.getAttribute('data-task'));
    if (!task) return;
    const values = {};
    const data = new FormData(form);
    task.inputs.forEach((input) => {
      values[input.name] = String(data.get(input.name) || '');
    });
    state.runDrafts[task.name] = values;
    startRun(task);
  }

  /* -----------------------------------------------------------------------
     Event handling
     ----------------------------------------------------------------------- */

  function handleLinkClick(event) {
    const link = event.target.closest('a[data-link]');
    if (!link) return;
    event.preventDefault();
    const href = link.getAttribute('href') || '';
    if (href.startsWith('#')) navigate(href.slice(1));
  }

  function handleAction(event) {
    const trigger = event.target.closest('[data-action]');
    if (!trigger) return;
    const action = trigger.getAttribute('data-action');

    if (action === 'new-chat') {
      event.preventDefault();
      newChat();
      return;
    }
    if (action === 'send-message') {
      event.preventDefault();
      sendChat();
      return;
    }
    if (action === 'try-again') {
      event.preventDefault();
      tryAgain();
      return;
    }
    if (action === 'retry-chat') {
      event.preventDefault();
      retryChat();
      return;
    }
    if (action === 'run-task') {
      event.preventDefault();
      const task = trigger.getAttribute('data-task');
      if (task) navigate(`/tasks/${encodeURIComponent(task)}/run`, { force: true });
      return;
    }
    if (action === 'start-new-run') {
      event.preventDefault();
      const task = trigger.getAttribute('data-task');
      if (task) startNewRun(task);
      return;
    }
    if (action === 'retry-registry') {
      event.preventDefault();
      retryRegistry(trigger.getAttribute('data-registry'));
      return;
    }
    if (action === 'retry-skill') {
      event.preventDefault();
      retryRecord();
      return;
    }
    if (action === 'retry-mcp-record') {
      event.preventDefault();
      retryRecord();
      return;
    }
    if (action === 'retry-task-run') {
      event.preventDefault();
      retryRecord();
      return;
    }
    if (action === 'retry-run') {
      event.preventDefault();
      retryRecord();
      return;
    }
    if (action === 'retry-run-status') {
      event.preventDefault();
      state.runStatusError = false;
      render({ focusHeading: false });
      return;
    }
    if (action === 'back-to-signin') {
      event.preventDefault();
      returnToSignIn();
      return;
    }
    if (action === 'focus-field') {
      event.preventDefault();
      const field = document.getElementById(trigger.getAttribute('data-field'));
      if (field) field.focus();
      return;
    }
    if (action === 'review-toggle') {
      event.preventDefault();
      toggleReview();
      return;
    }
    if (action === 'review-close') {
      event.preventDefault();
      closeReview();
      return;
    }
    if (action === 'review-state') {
      event.preventDefault();
      handleReviewAction(trigger.getAttribute('data-state-action'));
      return;
    }
    if (action === 'review-session-end') {
      event.preventDefault();
      simulateSessionEnd();
      return;
    }
    if (action === 'discard-stay') {
      event.preventDefault();
      closeDiscard({ restoreFocus: true });
      return;
    }
    if (action === 'discard-confirm') {
      event.preventDefault();
      confirmDiscard();
    }
  }

  function toggleReview() {
    if (state.reviewOpen) {
      closeReview();
    } else {
      state.reviewOpen = true;
      renderReview();
      const triggers = document.querySelectorAll('[data-action="review-toggle"]');
      triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'true'));
      const heading = document.getElementById('review-heading');
      if (heading) heading.focus();
    }
  }

  function closeReview() {
    state.reviewOpen = false;
    const active = document.activeElement;
    const wasInside = active && active.closest && active.closest('#review-panel');
    REVIEW.innerHTML = '';
    const triggers = document.querySelectorAll('[data-action="review-toggle"]');
    triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
    if (wasInside) {
      const trigger = document.querySelector('[data-action="review-toggle"]');
      if (trigger) trigger.focus();
    }
  }

  function handleInput(event) {
    const target = event.target;
    if (target.id === 'signin-name') {
      state.signInName = target.value;
      if (target.value.length > 0) {
        state.signInFieldErrors = { ...state.signInFieldErrors };
        delete state.signInFieldErrors.name;
        target.setAttribute('aria-invalid', 'false');
        target.setAttribute('aria-describedby', 'signin-name-hint');
        const inline = document.getElementById('signin-name-error');
        if (inline) inline.remove();
      }
    }
    if (target.id === 'signin-credential' && target.value.length > 0) {
      state.signInFieldErrors = { ...state.signInFieldErrors };
      delete state.signInFieldErrors.credential;
      target.setAttribute('aria-invalid', 'false');
      target.setAttribute('aria-describedby', 'signin-credential-hint');
      const inline = document.getElementById('signin-credential-error');
      if (inline) inline.remove();
    }
    if (target.id === 'composer-input') {
      state.chatDraft = target.value;
      state.chatDraftRef = state.activeConversation;
      target.style.height = 'auto';
      target.style.height = `${Math.min(target.scrollHeight, 180)}px`;
      if (state.chatError === EMPTY_MESSAGE_ERROR && target.value.length > 0) {
        state.chatError = null;
        const error = document.getElementById('composer-error');
        if (error) error.remove();
      }
    }
    if (target.matches && target.matches('[data-run-input]')) {
      const form = target.closest('form');
      const taskName = form ? form.getAttribute('data-task') : '';
      const task = findTask(taskName);
      if (task) {
        if (!state.runDrafts[taskName]) state.runDrafts[taskName] = {};
        state.runDrafts[taskName][target.name] = target.value;
        target.setAttribute('aria-invalid', 'false');
        target.setAttribute('aria-describedby', `${target.id}-hint`);
        const error = document.getElementById(`${target.id}-error`);
        if (error) error.remove();
        if (state.runErrors[taskName] && state.runErrors[taskName].fields) {
          delete state.runErrors[taskName].fields[target.name];
        }
      }
    }
  }

  function handleFocusOut(event) {
    const target = event.target;
    if (!target.matches || !target.matches('[data-run-input]')) return;
    const form = target.closest('form');
    const task = form ? findTask(form.getAttribute('data-task')) : null;
    if (!task) return;
    const declaration = task.inputs.find((input) => input.name === target.name);
    if (!declaration || !declaration.required) return;

    const hasValue = target.value.length > 0;
    const errorId = `${target.id}-error`;
    const existing = document.getElementById(errorId);

    if (hasValue) {
      if (existing) existing.remove();
      target.setAttribute('aria-invalid', 'false');
      target.setAttribute('aria-describedby', `${target.id}-hint`);
      if (state.runErrors[task.name] && state.runErrors[task.name].fields) {
        delete state.runErrors[task.name].fields[target.name];
      }
      return;
    }

    if (!state.runErrors[task.name]) state.runErrors[task.name] = {};
    if (!state.runErrors[task.name].fields) state.runErrors[task.name].fields = {};
    state.runErrors[task.name].fields[target.name] = `Enter ${declaration.name}.`;
    target.setAttribute('aria-invalid', 'true');
    target.setAttribute('aria-describedby', `${target.id}-hint ${errorId}`);
    if (!existing) {
      const errorNode = document.createElement('p');
      errorNode.className = 'field-error';
      errorNode.id = errorId;
      errorNode.innerHTML = `${icon('alert', 'icon--xs')}<span>Enter ${escapeHtml(declaration.name)}.</span>`;
      const hint = document.getElementById(`${target.id}-hint`);
      const anchor = hint || target;
      anchor.insertAdjacentElement('afterend', errorNode);
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      if (state.discard) {
        event.preventDefault();
        closeDiscard({ restoreFocus: true });
        return;
      }
      if (state.reviewOpen) {
        event.preventDefault();
        closeReview();
        return;
      }
    }

    if (state.discard && event.key === 'Tab') {
      const dialog = document.querySelector('.dialog');
      if (!dialog) return;
      const focusables = Array.from(dialog.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'))
        .filter((element) => !element.disabled && element.tabIndex !== -1);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
      return;
    }

    if (event.isComposing) return;

    if (event.target && event.target.id === 'composer-input' && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendChat();
      return;
    }

    if (event.target && event.target.matches && event.target.matches('[data-run-input]') && event.key === 'Enter') {
      event.preventDefault();
    }
  }

  function handleSkipLink(event) {
    const link = event.target.closest('#skip-link');
    if (!link) return;
    event.preventDefault();
    const main = document.getElementById('main');
    if (main) main.focus();
  }

  function handleFormSubmit(event) {
    if (event.target.id === 'signin-form') {
      handleSignInSubmit(event);
      return;
    }
    if (event.target.id === 'run-form') {
      handleRunSubmit(event);
    }
  }

  /* -----------------------------------------------------------------------
     Boot
     ----------------------------------------------------------------------- */

  function boot() {
    seed();

    document.addEventListener('click', handleLinkClick);
    document.addEventListener('click', handleAction);
    document.addEventListener('click', handleSkipLink);
    document.addEventListener('input', handleInput);
    document.addEventListener('focusout', handleFocusOut);
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('submit', handleFormSubmit);
    window.addEventListener('hashchange', onHashChange);

    const initialPath = currentHashPath();

    if (initialPath === '/' || initialPath === '') {
      window.history.replaceState(null, '', '#/sign-in');
      applyRoute('/sign-in', { focusHeading: true });
    } else {
      applyRoute(initialPath, { focusHeading: true });
    }
  }

  window.__prototype = {
    go(path) {
      navigate(path, { force: true });
    },
    signIn() {
      state.authed = true;
      state.signInSubmitting = false;
      state.route = null;
      window.history.replaceState(null, '', '#/chat');
      applyRoute('/chat', { focusHeading: true });
    },
    force(key) {
      if (key === null) resetForcedState();
      else setOverride(key);
    },
    snapshot() {
      return {
        authed: state.authed,
        route: state.route,
        override: state.override,
        reviewOpen: state.reviewOpen
      };
    }
  };

  boot();
})();
