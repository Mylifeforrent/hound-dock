/* =========================================================================
   hound-dock clickable prototype
   Mock data only. No backend, network calls, persistence, dependencies,
   or production logic. Design artifact under docs/03_design/prototype/.
   ========================================================================= */
(() => {
  'use strict';

  /* ---------------- mock data ---------------- */

  const SKILLS = [
    {
      id: 'skill-release',
      name: 'Release Notes Writer',
      category: 'Engineering',
      status: 'Published',
      version: 'v3',
      owner: 'Alex Chen',
      updated: '2d ago',
      description: 'Turns merged PRs and Jira issues into a weekly release brief with blockers called out.',
      instructions: 'You are the release notes editor for the Platform team.\n\n1. Pull merged PRs for the requested week.\n2. Group changes by theme: shipped, fixed, risk.\n3. Search Jira for blocked issues in the same project.\n4. Write a brief under 180 words with citations.\n5. Never invent a ticket or a release date.',
      inputs: [
        { name: 'week', type: 'date', required: true, help: 'Week starting date' },
        { name: 'project', type: 'select', required: true, help: 'Platform or Growth' }
      ],
      deps: ['confluence.search', 'jira.search'],
      versions: ['v3 · 2d ago · Published', 'v2 · 1w ago · Superseded', 'v1 · 3w ago · Superseded']
    },
    {
      id: 'skill-triage',
      name: 'Ticket Triage',
      category: 'Ops',
      status: 'Published',
      version: 'v2',
      owner: 'Priya Nair',
      updated: '5d ago',
      description: 'Classifies incoming tickets, proposes an owner, and flags anything that needs a human decision.',
      instructions: 'You are the triage assistant for the Platform on-call.\n\n1. Read the new ticket and any linked context.\n2. Classify severity and area.\n3. Propose an owner from the on-call roster.\n4. Flag security or data-loss tickets for human review.\n5. Output a short triage note, never a write action.',
      inputs: [
        { name: 'queue', type: 'select', required: true, help: 'Platform or Incidents' },
        { name: 'limit', type: 'number', required: false, help: 'Max tickets, default 10' }
      ],
      deps: ['jira.search', 'confluence.search'],
      versions: ['v2 · 5d ago · Published', 'v1 · 2w ago · Superseded']
    },
    {
      id: 'skill-onboarding',
      name: 'Onboarding Buddy',
      category: 'Docs',
      status: 'Published',
      version: 'v1',
      owner: 'Sam Ito',
      updated: '1w ago',
      description: 'Answers new-joiner questions from the onboarding space and cites the exact page.',
      instructions: 'You are the onboarding guide for the Platform team.\n\n1. Search the ONBOARDING space first.\n2. Answer in the new joiner\'s language.\n3. Cite the page title and section.\n4. If the answer is not in the space, say so and suggest a human owner.',
      inputs: [
        { name: 'question', type: 'text', required: true, help: 'New joiner question' }
      ],
      deps: ['confluence.search'],
      versions: ['v1 · 1w ago · Published']
    },
    {
      id: 'skill-minutes',
      name: 'Meeting Minutes → Actions',
      category: 'Ops',
      status: 'Draft',
      version: 'v1',
      owner: 'Alex Chen',
      updated: '3d ago',
      description: 'Extracts decisions and action items from a meeting transcript, with owners and due dates.',
      instructions: 'You are the meeting scribe.\n\n1. Read the transcript.\n2. Extract decisions, action items, owners, and dates.\n3. Separate confirmed actions from suggestions.\n4. Output a compact action table. Do not create tickets in v1.',
      inputs: [
        { name: 'transcript', type: 'file', required: true, help: 'Transcript or notes' }
      ],
      deps: ['confluence.search', 'jira.search'],
      versions: ['v1 · 3d ago · Draft']
    },
    {
      id: 'skill-metrics',
      name: 'Weekly Metrics Digest',
      category: 'Analytics',
      status: 'Draft',
      version: 'v1',
      owner: 'Priya Nair',
      updated: '6d ago',
      description: 'Summarizes the weekly product metrics and calls out anomalies against the previous four weeks.',
      instructions: 'You are the metrics analyst.\n\n1. Query the read-only metrics view.\n2. Compare the week to the prior four weeks.\n3. Highlight anomalies over 2 standard deviations.\n4. Do not speculate about causes without a source.',
      inputs: [
        { name: 'week', type: 'date', required: true, help: 'Week starting date' }
      ],
      deps: ['postgres.read'],
      versions: ['v1 · 6d ago · Draft']
    },
    {
      id: 'skill-postmortem',
      name: 'Incident Postmortem Helper',
      category: 'Engineering',
      status: 'Deprecated',
      version: 'v2',
      owner: 'Sam Ito',
      updated: '3w ago',
      description: 'Drafts a blameless postmortem skeleton from the incident timeline and linked tickets.',
      instructions: 'You are the postmortem editor.\n\n1. Read the incident timeline.\n2. Build a blameless skeleton: impact, detection, response, contributing factors, actions.\n3. Leave unknowns explicitly marked.\n4. Do not assign blame to individuals.',
      inputs: [
        { name: 'incident', type: 'text', required: true, help: 'Incident ID' }
      ],
      deps: ['confluence.search', 'jira.search'],
      versions: ['v2 · 3w ago · Deprecated', 'v1 · 6w ago · Superseded']
    }
  ];

  const MCPS = [
    {
      id: 'mcp-confluence',
      refPrefix: 'confluence',
      name: 'Confluence MCP',
      transport: 'HTTP',
      url: 'https://mcp.internal/confluence',
      auth: 'OAuth',
      timeout: '30s',
      status: 'Connected',
      lastCheck: '2m ago',
      tools: [
        { name: 'search', desc: 'Search pages and spaces', enabled: true, write: false },
        { name: 'get_page', desc: 'Read a page by ID', enabled: true, write: false },
        { name: 'list_spaces', desc: 'List visible spaces', enabled: true, write: false },
        { name: 'create_page', desc: 'Create a page', enabled: false, write: true },
        { name: 'update_page', desc: 'Update a page', enabled: false, write: true }
      ]
    },
    {
      id: 'mcp-jira',
      refPrefix: 'jira',
      name: 'Jira MCP',
      transport: 'HTTP',
      url: 'https://mcp.internal/jira',
      auth: 'API key',
      timeout: '30s',
      status: 'Connected',
      lastCheck: '4m ago',
      tools: [
        { name: 'search', desc: 'Search issues with JQL', enabled: true, write: false },
        { name: 'get_issue', desc: 'Read an issue by key', enabled: true, write: false },
        { name: 'list_projects', desc: 'List visible projects', enabled: true, write: false },
        { name: 'create_issue', desc: 'Create an issue', enabled: false, write: true },
        { name: 'transition_issue', desc: 'Change issue status', enabled: false, write: true },
        { name: 'add_comment', desc: 'Comment on an issue', enabled: false, write: true }
      ]
    },
    {
      id: 'mcp-git',
      refPrefix: 'git',
      name: 'Git MCP',
      transport: 'SSE',
      url: 'https://mcp.internal/git',
      auth: 'OAuth',
      timeout: '45s',
      status: 'Needs auth',
      lastCheck: '1h ago',
      tools: [
        { name: 'list_repos', desc: 'List accessible repositories', enabled: true, write: false },
        { name: 'get_file', desc: 'Read a file at a ref', enabled: true, write: false },
        { name: 'list_prs', desc: 'List pull requests', enabled: true, write: false },
        { name: 'create_pr', desc: 'Open a pull request', enabled: false, write: true },
        { name: 'comment', desc: 'Comment on a pull request', enabled: false, write: true }
      ]
    },
    {
      id: 'mcp-pg',
      refPrefix: 'postgres',
      name: 'Postgres (read-only)',
      transport: 'HTTP',
      url: 'https://mcp.internal/pg-ro',
      auth: 'API key',
      timeout: '20s',
      status: 'Error',
      lastCheck: '12m ago',
      tools: [
        { name: 'query', desc: 'Run a read-only query', enabled: true, write: false },
        { name: 'schema', desc: 'Read the schema', enabled: true, write: false }
      ]
    }
  ];

  const TASKS = [
    {
      id: 'task-release',
      name: 'Weekly Release Brief',
      status: 'Published',
      version: 'v3',
      owner: 'Alex Chen',
      updated: '2h ago',
      lastRun: '2h ago',
      description: 'Compile the weekly Platform release brief and list every blocked issue.',
      inputs: [
        { name: 'week', type: 'date', required: true, help: 'Week starting date' },
        { name: 'project', type: 'select', required: true, help: 'Platform or Growth' }
      ],
      steps: [
        { kind: 'skill', ref: 'skill-release', label: 'Release Notes Writer', detail: 'week = {{week}}, project = {{project}}' },
        { kind: 'mcp', ref: 'jira.search', label: 'jira.search', detail: 'project = {{project}} AND status = Blocked' },
        { kind: 'skill', ref: 'skill-release', label: 'Release Notes Writer', detail: 'mode = format-brief' }
      ]
    },
    {
      id: 'task-triage',
      name: 'Triage New Tickets',
      status: 'Published',
      version: 'v1',
      owner: 'Priya Nair',
      updated: '5d ago',
      lastRun: '5h ago',
      description: 'Read the new ticket queue, classify each ticket, and propose an owner.',
      inputs: [
        { name: 'queue', type: 'select', required: true, help: 'Platform or Incidents' },
        { name: 'limit', type: 'number', required: false, help: 'Max tickets, default 10' }
      ],
      steps: [
        { kind: 'mcp', ref: 'jira.search', label: 'jira.search', detail: 'queue = {{queue}}, limit = {{limit}}' },
        { kind: 'skill', ref: 'skill-triage', label: 'Ticket Triage', detail: 'mode = classify-and-route' }
      ]
    },
    {
      id: 'task-minutes',
      name: 'Meeting Notes → Actions',
      status: 'Draft',
      version: 'v2',
      owner: 'Alex Chen',
      updated: '3d ago',
      lastRun: 'never',
      description: 'Turn a meeting transcript into decisions, action items, and owners.',
      inputs: [
        { name: 'transcript', type: 'file', required: true, help: 'Transcript or notes' }
      ],
      steps: [
        { kind: 'mcp', ref: 'confluence.search', label: 'confluence.search', detail: 'query = transcript context' },
        { kind: 'skill', ref: 'skill-minutes', label: 'Meeting Minutes → Actions', detail: 'mode = extract-actions' }
      ]
    },
    {
      id: 'task-onboarding',
      name: 'Onboarding Checklist Refresh',
      status: 'Draft',
      version: 'v1',
      owner: 'Sam Ito',
      updated: '1w ago',
      lastRun: 'never',
      description: 'Find stale onboarding pages and draft a refresh checklist for the docs owner.',
      inputs: [
        { name: 'space', type: 'text', required: true, help: 'Confluence space key' }
      ],
      steps: [
        { kind: 'mcp', ref: 'confluence.search', label: 'confluence.search', detail: 'space = {{space}}, updated < 90d' },
        { kind: 'skill', ref: 'skill-onboarding', label: 'Onboarding Buddy', detail: 'mode = stale-page-audit' }
      ]
    }
  ];

  const RUNS = [
    {
      id: 'RUN-1042',
      taskId: 'task-release',
      task: 'Weekly Release Brief',
      user: 'Alex Chen',
      status: 'Succeeded',
      duration: '2m 14s',
      started: '2h ago',
      ended: '2h ago',
      taskVersion: 'v3',
      tokens: '18.4k',
      cost: '$0.42',
      artifacts: ['release-brief.md'],
      steps: [
        { name: 'Release Notes Writer', kind: 'skill', status: 'Succeeded', duration: '18s', detail: '12 pages read' },
        { name: 'jira.search', kind: 'mcp', status: 'Succeeded', duration: '4s', detail: '4 blockers found' },
        { name: 'Release Notes Writer · format', kind: 'skill', status: 'Succeeded', duration: '42s', detail: 'Brief drafted' }
      ]
    },
    {
      id: 'RUN-1041',
      taskId: 'task-triage',
      task: 'Triage New Tickets',
      user: 'Priya Nair',
      status: 'Running',
      duration: '0m 38s',
      started: 'just now',
      ended: '—',
      taskVersion: 'v1',
      tokens: '6.1k',
      cost: '$0.14',
      artifacts: [],
      steps: [
        { name: 'jira.search', kind: 'mcp', status: 'Succeeded', duration: '3s', detail: '10 tickets read' },
        { name: 'Ticket Triage', kind: 'skill', status: 'Running', duration: '35s', detail: 'Classifying…' }
      ]
    },
    {
      id: 'RUN-1040',
      taskId: 'task-release',
      task: 'Weekly Release Brief',
      user: 'Sam Ito',
      status: 'Failed',
      duration: '1m 02s',
      started: '5h ago',
      ended: '5h ago',
      taskVersion: 'v3',
      tokens: '9.8k',
      cost: '$0.22',
      artifacts: [],
      steps: [
        { name: 'Release Notes Writer', kind: 'skill', status: 'Succeeded', duration: '16s', detail: '11 pages read' },
        { name: 'jira.search', kind: 'mcp', status: 'Failed', duration: '30s', detail: 'MCP timeout after 30s' },
        { name: 'Release Notes Writer · format', kind: 'skill', status: 'Pending', duration: '—', detail: 'Skipped' }
      ]
    },
    {
      id: 'RUN-1039',
      taskId: 'task-onboarding',
      task: 'Onboarding Checklist Refresh',
      user: 'Alex Chen',
      status: 'Succeeded',
      duration: '54s',
      started: '1d ago',
      ended: '1d ago',
      taskVersion: 'v1',
      tokens: '5.2k',
      cost: '$0.11',
      artifacts: ['onboarding-refresh.md'],
      steps: [
        { name: 'confluence.search', kind: 'mcp', status: 'Succeeded', duration: '2s', detail: '24 pages scanned' },
        { name: 'Onboarding Buddy', kind: 'skill', status: 'Succeeded', duration: '31s', detail: 'Checklist drafted' }
      ]
    },
    {
      id: 'RUN-1038',
      taskId: 'task-triage',
      task: 'Triage New Tickets',
      user: 'Priya Nair',
      status: 'Succeeded',
      duration: '41s',
      started: '1d ago',
      ended: '1d ago',
      taskVersion: 'v1',
      tokens: '3.7k',
      cost: '$0.09',
      artifacts: ['triage-notes.md'],
      steps: [
        { name: 'jira.search', kind: 'mcp', status: 'Succeeded', duration: '2s', detail: '8 tickets read' },
        { name: 'Ticket Triage', kind: 'skill', status: 'Succeeded', duration: '27s', detail: '8 notes drafted' }
      ]
    }
  ];

  const FILES = [
    'release-notes-w42.md',
    'onboarding-checklist.pdf',
    'platform-architecture.md',
    'jira-blockers.csv'
  ];

  const INITIAL_MESSAGES = [
    {
      role: 'user',
      text: "Summarize this week's release notes and list any Jira blockers for the Platform team."
    },
    {
      role: 'assistant',
      skill: { id: 'skill-release', name: 'Release Notes Writer', version: 'v3' },
      tools: [
        { name: 'confluence.search', input: 'space = PLATFORM, updated ≥ 7d', output: '12 pages', duration: '1.2s' },
        { name: 'jira.search', input: 'project = PLAT AND status = Blocked', output: '4 issues', duration: '0.8s' }
      ],
      body: `<p>Here is the W42 brief for <strong>Platform</strong>. I read 12 Confluence pages and 4 blocked Jira issues.</p>
        <ul>
          <li><strong>Shipped:</strong> token rotation for the internal gateway; retry policy for the ingest worker; new audit fields on run records.</li>
          <li><strong>Blocked:</strong> PLAT-412 (SSO callback), PLAT-418 (MCP timeout), PLAT-421 (quota), PLAT-427 (docs).</li>
          <li><strong>Risk:</strong> the MCP timeout is the only item that could slip the release.</li>
        </ul>
        <p>Suggested next step: assign PLAT-418 to the platform on-call and re-run the brief on Friday.</p>`,
      sources: [
        { kind: 'Confluence', label: 'Release notes — W42' },
        { kind: 'Jira', label: 'PLAT blockers' }
      ]
    }
  ];

  const CHATS = [
    {
      id: 'chat-release',
      title: 'Release notes & blockers',
      group: 'Today',
      updated: '2h ago',
      pinned: true,
      messages: INITIAL_MESSAGES.map((message) => ({ ...message }))
    },
    {
      id: 'chat-onboarding',
      title: 'Onboarding checklist',
      group: 'Today',
      updated: '4h ago',
      messages: [
        { role: 'user', text: 'Where is the onboarding checklist for a new platform engineer?' },
        {
          role: 'assistant',
          skill: { id: 'skill-onboarding', name: 'Onboarding Buddy', version: 'v1' },
          tools: [{ name: 'confluence.search', input: 'space = ONBOARDING, q = checklist', output: '3 pages', duration: '0.9s' }],
          body: `<p>The checklist lives in <strong>ONBOARDING → New engineer → Week 1</strong>. The current version covers access, local setup, and the first on-call shadow shift.</p>
            <ul><li><strong>Day 1:</strong> accounts, laptop, and team intro.</li><li><strong>Week 1:</strong> local environment, first ticket, and runbook walkthrough.</li><li><strong>Week 2:</strong> on-call shadow and first small change.</li></ul>`,
          sources: [{ kind: 'Confluence', label: 'Platform onboarding checklist' }]
        }
      ]
    },
    {
      id: 'chat-metrics',
      title: 'Weekly metrics digest',
      group: 'Yesterday',
      updated: '1d ago',
      messages: [
        { role: 'user', text: "Summarize last week's activation and retention metrics." },
        {
          role: 'assistant',
          skill: { id: 'skill-metrics', name: 'Weekly Metrics Digest', version: 'v1' },
          tools: [{ name: 'postgres.read', input: 'view = metrics_weekly, weeks = 5', output: '5 rows', duration: '0.6s' }],
          body: `<p>Activation was <strong>61%</strong>, up 4 points week over week. Retention at day 7 held at <strong>48%</strong>; the drop is concentrated in the self-serve cohort.</p>
            <ul><li><strong>Activation:</strong> 61% (+4 pts).</li><li><strong>Day-7 retention:</strong> 48% (flat).</li><li><strong>Anomaly:</strong> self-serve accounts that skip setup fall to 22% retention.</li></ul>
            <p>This is a mock digest; the skill is still a draft.</p>`,
          sources: [{ kind: 'Metrics', label: 'metrics_weekly (read-only)' }]
        }
      ]
    },
    { id: 'chat-q3', title: 'Q3 planning notes', group: 'Yesterday', updated: '1d ago', messages: [] },
    {
      id: 'chat-token',
      title: 'Token rotation runbook',
      group: 'Previous 7 days',
      updated: '3d ago',
      pinned: true,
      messages: [
        { role: 'user', text: 'Search the runbook for the token rotation steps.' },
        {
          role: 'assistant',
          tools: [
            { name: 'confluence.search', input: 'space = RUNBOOKS, q = token rotation', output: '2 pages', duration: '0.8s' },
            { name: 'web.search', input: 'token rotation best practice', output: '4 results', duration: '1.0s' }
          ],
          body: `<p>The runbook describes a four-step rotation:</p>
            <ol><li>Create the new credential and store it as a secret reference.</li><li>Deploy it to the gateway and verify a test call.</li><li>Revoke the old credential after the verification window.</li><li>Record the rotation in the audit log.</li></ol>
            <p>Always rotate before the expiry window; never paste the value into chat.</p>`,
          sources: [{ kind: 'Confluence', label: 'Token rotation runbook' }, { kind: 'Web', label: 'Rotation best practice' }]
        }
      ]
    },
    { id: 'chat-incident', title: 'Incident postmortem', group: 'Previous 7 days', updated: '5d ago', messages: [] }
  ];

  const AUDIT = [
    { time: '2h ago', days: 0, actor: 'Alex Chen', action: 'skill.publish', target: 'Release Notes Writer v3', category: 'Registry', outcome: 'Succeeded' },
    { time: '4h ago', days: 0, actor: 'Priya Nair', action: 'mcp.tool.toggle', target: 'jira.create_issue → off', category: 'Tools', outcome: 'Succeeded' },
    { time: '5h ago', days: 0, actor: 'Sam Ito', action: 'task.run', target: 'Weekly Release Brief', category: 'Runs', outcome: 'Failed' },
    { time: '1d ago', days: 1, actor: 'Alex Chen', action: 'run.complete', target: 'RUN-1042', category: 'Runs', outcome: 'Succeeded' },
    { time: '2d ago', days: 2, actor: 'Alex Chen', action: 'mcp.register', target: 'Confluence MCP', category: 'Tools', outcome: 'Succeeded' },
    { time: '3d ago', days: 3, actor: 'Priya Nair', action: 'user.invite', target: 'Sam Ito', category: 'Access', outcome: 'Succeeded' },
    { time: '5d ago', days: 5, actor: 'System', action: 'secret.rotate', target: 'llm/internal-key', category: 'Access', outcome: 'Succeeded' },
    { time: '6d ago', days: 6, actor: 'Sam Ito', action: 'skill.deprecate', target: 'Incident Postmortem Helper v2', category: 'Registry', outcome: 'Succeeded' }
  ];

  const state = {
    view: 'chat',
    theme: 'light',
    skills: SKILLS,
    mcps: MCPS,
    tasks: TASKS,
    runs: RUNS,
    chats: CHATS,
    activeChatId: 'chat-release',
    messages: CHATS[0].messages,
    activeSkill: null,
    search: false,
    files: [],
    typing: false,
    skillFilter: 'All',
    skillQuery: '',
    chatQuery: '',
    runFilter: 'All',
    auditFilter: 'All',
    auditQuery: '',
    auditPeriod: 'all',
    nextRun: 1043
  };

  /* ---------------- helpers ---------------- */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const esc = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const icon = (name, cls = '') => `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

  const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;
  const nowLabel = () => 'now';

  const statusClass = (status) => {
    const map = {
      Published: 'ok',
      Connected: 'ok',
      Succeeded: 'ok',
      Draft: 'warn',
      'Needs auth': 'warn',
      Running: 'info',
      Deprecated: 'neutral',
      Error: 'error',
      Failed: 'error'
    };
    return map[status] || 'neutral';
  };

  const statusBadge = (status) => `<span class="status ${statusClass(status)}"><span class="dot" aria-hidden="true"></span>${esc(status)}</span>`;

  const initials = (name) => String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || '?';

  const viewNames = {
    chat: 'Chat',
    tasks: 'Tasks',
    skills: 'Skills',
    mcp: 'MCP',
    runs: 'Runs',
    usage: 'Usage',
    audit: 'Audit',
    admin: 'Settings'
  };

  let toastTimer = null;
  let lastFocused = null;

  function setChatStatus(message) {
    const status = $('#chat-status');
    if (status) status.textContent = message;
  }

  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }

  function syncScrollLock() {
    const drawerOpen = !$('#drawer').hidden;
    const modalOpen = !$('#modal').hidden;
    const locked = drawerOpen || modalOpen;
    document.body.classList.toggle('is-locked', locked);
    const shell = $('.app-shell');
    if (shell) shell.inert = locked;
  }

  function setScrim() {
    const drawerOpen = !$('#drawer').hidden;
    const modalOpen = !$('#modal').hidden;
    $('#scrim').hidden = !(drawerOpen || modalOpen);
  }

  function rememberFocus() {
    lastFocused = document.activeElement;
  }

  function restoreFocus() {
    if (!$('#modal').hidden || !$('#drawer').hidden) return;
    const target = lastFocused;
    lastFocused = null;
    if (target && document.contains(target)) target.focus();
  }

  function focusables(container) {
    return [...container.querySelectorAll('button, a[href], input, select, textarea, [tabindex]')]
      .filter((element) => {
        if (element.disabled) return false;
        if (element instanceof SVGElement) return false;
        if (element.tabIndex < 0) return false;
        return element.offsetParent !== null;
      });
  }

  function closeSidebar() {
    document.body.classList.remove('nav-open');
    const toggle = $('[data-toggle-nav]');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  function copyText(text) {
    if (!text) return Promise.resolve(false);
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopy(text));
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(area);
      return ok;
    } catch (error) {
      return false;
    }
  }

  function stripHtml(html) {
    return String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  /* ---------------- render: chat ---------------- */

  function activeChat() {
    return state.chats.find((chat) => chat.id === state.activeChatId);
  }

  function lastAssistant() {
    for (let index = state.messages.length - 1; index >= 0; index -= 1) {
      if (state.messages[index].role === 'assistant') return state.messages[index];
    }
    return null;
  }

  function chatSkill() {
    const message = lastAssistant();
    if (message && message.skill) return message.skill;
    if (state.activeSkill) {
      const skill = state.skills.find((item) => item.id === state.activeSkill);
      if (skill) return { id: skill.id, name: skill.name, version: skill.version };
    }
    return null;
  }

  function toolRow(tool) {
    return `<div class="tool-call">
      <span class="dot ok" aria-hidden="true"></span>
      <div class="tool-body"><code>${esc(tool.name)}</code><small>${esc(tool.input)} → ${esc(tool.output)}</small></div>
      <span class="dur">${esc(tool.duration)}</span>
    </div>`;
  }

  function renderMessage(message, index) {
    if (message.role === 'user') {
      return `<div class="msg msg-user"><p class="msg-role">You</p><div class="msg-text">${esc(message.text)}</div></div>`;
    }
    const hasTools = message.tools && message.tools.length;
    const receipt = hasTools
      ? `<div class="receipt">
          <div class="receipt-head">${icon('spark')} ${esc(message.skill ? message.skill.name : 'Workspace tools')}
            ${message.skill ? `<span class="status ok"><span class="dot"></span>${esc(message.skill.version)}</span>` : ''}
          </div>
          ${message.tools.map(toolRow).join('')}
        </div>`
      : '';
    const sources = message.sources && message.sources.length
      ? `<div class="sources">${message.sources.map((source, sourceIndex) => `<span class="source"><b>${sourceIndex + 1}</b>${esc(source.kind)} · ${esc(source.label)}</span>`).join('')}</div>`
      : '';
    return `<div class="msg msg-assistant">
      <div class="msg-avatar" aria-hidden="true">H</div>
      <div class="msg-main">
        <div class="msg-meta"><strong>hound-dock</strong><span>${esc(message.skill ? message.skill.name : 'Workspace assistant')}</span></div>
        <div class="msg-body">${receipt}${message.body}</div>
        ${sources}
        <div class="msg-actions">
          <button type="button" class="msg-action" data-copy-message="${index}" aria-label="Copy answer" title="Copy answer">${icon('copy')}</button>
          <button type="button" class="msg-action" data-retry-message="${index}" aria-label="Retry this answer" title="Retry">${icon('refresh')}</button>
        </div>
      </div>
    </div>`;
  }

  function emptyState() {
    const publishedTasks = state.tasks.filter((task) => task.status === 'Published');
    const prompts = [
      {
        icon: 'file',
        title: "Summarize this week's release",
        desc: 'Pull merged PRs and blockers into a short brief.',
        prompt: "Summarize this week's release notes and list Jira blockers for Platform."
      },
      {
        icon: 'search',
        title: 'Search the workspace',
        desc: 'Find a runbook, onboarding page, or decision.',
        prompt: 'Search Confluence for the onboarding checklist and cite the source.'
      },
      {
        icon: 'tasks',
        title: 'Triage new tickets',
        desc: 'Classify the queue and propose owners.',
        prompt: 'Triage the new Jira tickets and propose owners.'
      }
    ];
    return `<div class="chat-empty">
      <p class="eyebrow"><span class="eyebrow-mark" aria-hidden="true"></span>New conversation</p>
      <h2 class="chat-empty-title">What should we work on?</h2>
      <p class="chat-empty-sub">Ask a question, search the workspace, or start from a published task. Every tool call stays visible and auditable.</p>
      <div class="prompt-grid">
        ${prompts.map((item) => `<button type="button" class="prompt-card" data-prompt="${esc(item.prompt)}">
          <span class="prompt-icon">${icon(item.icon)}</span>
          <span class="prompt-copy"><span class="prompt-title">${esc(item.title)}</span><span class="prompt-desc">${esc(item.desc)}</span></span>
        </button>`).join('')}
      </div>
      ${publishedTasks.length ? `<div class="empty-tasks">
        <span class="empty-tasks-label">Published tasks</span>
        ${publishedTasks.map((task) => `<button type="button" class="task-shortcut" data-open-task="${task.id}">${icon('play')} ${esc(task.name)}</button>`).join('')}
        <button type="button" class="task-shortcut" data-view="tasks">All tasks ${icon('arrow')}</button>
      </div>` : ''}
    </div>`;
  }

  function renderChat(scrollMode = 'preserve') {
    const thread = $('#chat-thread');
    if (!thread) return;
    const chat = activeChat();
    const title = $('#chat-title');
    if (title) title.textContent = chat ? chat.title : 'New conversation';

    const sub = $('#chat-sub');
    if (sub) {
      if (!chat) {
        sub.textContent = 'No conversation selected';
      } else if (!state.messages.length) {
        sub.textContent = `${plural(state.messages.length, 'message')} · ready for your first prompt`;
      } else {
        const skill = chatSkill();
        sub.textContent = [
          skill ? `${skill.name} ${skill.version}` : null,
          plural(state.messages.length, 'message'),
          `updated ${chat.updated}`
        ].filter(Boolean).join(' · ');
      }
    }

    const typing = state.typing
      ? `<div class="msg msg-assistant"><div class="msg-avatar" aria-hidden="true">H</div><div class="msg-main"><div class="msg-meta"><strong>hound-dock</strong><span>Working…</span></div><div class="typing" aria-label="Assistant is typing"><i></i><i></i><i></i></div></div></div>`
      : '';
    const content = state.messages.length
      ? state.messages.map(renderMessage).join('') + typing
      : emptyState();
    thread.innerHTML = content;
    if (scrollMode === 'bottom') thread.scrollTop = thread.scrollHeight;
    if (scrollMode === 'top') thread.scrollTop = 0;
    renderComposerContext();
    renderRail();
  }

  function renderComposerContext() {
    const context = $('#composer-context');
    if (!context) return;
    const chips = [];
    if (state.activeSkill) {
      const skill = state.skills.find((item) => item.id === state.activeSkill);
      if (skill) {
        chips.push(`<span class="context-chip">${icon('spark')} ${esc(skill.name)}
          <button type="button" class="chip-x" data-remove-context="skill" aria-label="Remove active skill">${icon('close')}</button></span>`);
      }
    }
    if (state.search) {
      chips.push(`<span class="context-chip">${icon('search')} Search on
        <button type="button" class="chip-x" data-remove-context="search" aria-label="Turn off search">${icon('close')}</button></span>`);
    }
    state.files.forEach((file, index) => {
      chips.push(`<span class="context-chip">${icon('file')} ${esc(file)}
        <button type="button" class="chip-x" data-remove-context="file" data-file-index="${index}" aria-label="Remove ${esc(file)}">${icon('close')}</button></span>`);
    });
    context.innerHTML = chips.join('');
  }

  function renderRail() {
    const rail = $('#rail-content');
    if (!rail) return;
    const skill = chatSkill();
    const last = lastAssistant();
    const tools = state.activeSkill
      ? (state.skills.find((item) => item.id === state.activeSkill)?.deps || []).map((dep) => ({ name: dep, duration: 'ready' }))
      : (last?.tools || []).map((tool) => ({ name: tool.name, duration: tool.duration }));
    const tokens = state.messages.length ? `${(state.messages.length * 9.2).toFixed(1)}k` : '—';
    const cost = state.messages.length ? `$${(state.messages.length * 0.21).toFixed(2)}` : '—';

    const skillCard = skill
      ? `<section class="rail-card">
          <p class="eyebrow">Active skill</p>
          <h3>${esc(skill.name)}</h3>
          <p class="small">${esc(state.skills.find((item) => item.id === skill.id)?.description || 'Selected in the composer.')}</p>
          <button class="link-btn" type="button" data-open-skill="${skill.id}">View manifest ${icon('arrow')}</button>
        </section>`
      : `<section class="rail-card">
          <p class="eyebrow">Active skill</p>
          <p class="small">No skill selected. Use <span class="mono">/</span> in the composer to pick a published skill for the next message.</p>
        </section>`;

    const toolsCard = `<section class="rail-card">
      <div class="rail-card-head"><p class="eyebrow">Tools in this run</p><span class="rail-count">${tools.length}</span></div>
      <ul class="tool-list">
        ${tools.length
          ? tools.map((tool) => `<li><span class="dot ok" aria-hidden="true"></span><code>${esc(tool.name)}</code><span class="mono">${esc(tool.duration)}</span></li>`).join('')
          : `<li><span class="dot idle" aria-hidden="true"></span><span class="small muted">No tools called yet</span></li>`}
      </ul>
    </section>`;

    const sessionCard = `<section class="rail-card">
      <div class="rail-card-head"><p class="eyebrow">Session</p><span class="rail-count">mock</span></div>
      <div class="session-grid">
        <div class="session-stat"><span>Messages</span><strong>${state.messages.length}</strong></div>
        <div class="session-stat"><span>Tools</span><strong>${tools.length}</strong></div>
        <div class="session-stat"><span>Tokens</span><strong>${tokens}</strong></div>
        <div class="session-stat"><span>Est. cost</span><strong>${cost}</strong></div>
      </div>
    </section>`;

    rail.innerHTML = `${skillCard}${toolsCard}${sessionCard}
      <section class="rail-card rail-note">
        ${icon('shield')}
        <div>
          <p class="eyebrow">Guardrail</p>
          <p class="small">Read-only tools only. Write-capable tools are disabled in v1.</p>
        </div>
      </section>`;
  }

  function renderHistory() {
    const container = $('#chat-history');
    if (!container) return;
    const query = state.chatQuery.trim().toLowerCase();
    const searchable = (chat) => [chat.title, ...chat.messages.flatMap((message) => [message.text || '', stripHtml(message.body)])]
      .join(' ')
      .toLowerCase();
    const visible = state.chats.filter((chat) => !query || searchable(chat).includes(query));
    const pinned = visible.filter((chat) => chat.pinned);
    const groups = ['Today', 'Yesterday', 'Previous 7 days'];
    const count = $('#history-count');
    if (count) count.textContent = query ? `${visible.length}/${state.chats.length}` : String(state.chats.length);
    const row = (chat) => `<div class="history-row ${chat.id === state.activeChatId ? 'is-active' : ''}">
      <button type="button" class="history-item ${chat.id === state.activeChatId ? 'is-active' : ''}" data-chat-id="${chat.id}" ${chat.id === state.activeChatId ? 'aria-current="true"' : ''}>
        <span class="history-title">${chat.pinned ? `<span class="history-pin">${icon('pin')}</span>` : ''}<span class="history-title-text">${esc(chat.title)}</span></span>
        <span class="history-meta">${esc(chat.updated)}</span>
      </button>
      <button type="button" class="history-more" data-chat-actions="${chat.id}" aria-label="Actions for ${esc(chat.title)}">${icon('more')}</button>
    </div>`;
    const section = (label, chats) => chats.length ? `<div class="history-group">
        <p class="history-label">${label}</p>
        ${chats.map(row).join('')}
      </div>` : '';
    const sections = [
      section('Pinned', pinned),
      ...groups.map((group) => section(group, visible.filter((chat) => !chat.pinned && chat.group === group)))
    ].join('');
    container.innerHTML = sections || `<p class="history-empty">No chats match.</p>`;
  }

  function selectChat(id) {
    const chat = state.chats.find((item) => item.id === id);
    if (!chat) return;
    state.activeChatId = id;
    state.messages = chat.messages;
    state.activeSkill = null;
    state.search = false;
    state.files = [];
    state.typing = false;
    navigate('chat');
    renderChat('top');
    renderHistory();
    setChatStatus(`Conversation opened: ${chat.title}`);
    const input = $('#chat-input');
    if (input) {
      input.value = '';
      resizeInput();
      input.focus();
    }
  }

  /* ---------------- render: skills ---------------- */

  function renderSkillFilters() {
    const container = $('#skill-filters');
    if (!container) return;
    const categories = ['All', ...new Set(state.skills.map((skill) => skill.category))];
    container.innerHTML = categories.map((category) => {
      const count = category === 'All' ? state.skills.length : state.skills.filter((skill) => skill.category === category).length;
      return `<button type="button" class="filter-chip ${state.skillFilter === category ? 'is-active' : ''}" data-skill-filter="${esc(category)}" aria-pressed="${state.skillFilter === category}">${esc(category)} <span class="chip-count">${count}</span></button>`;
    }).join('');
  }

  function visibleSkills() {
    const query = state.skillQuery.trim().toLowerCase();
    return state.skills.filter((skill) => {
      const inCategory = state.skillFilter === 'All' || skill.category === state.skillFilter;
      const haystack = [skill.name, skill.description, skill.owner, ...(skill.deps || [])].join(' ').toLowerCase();
      return inCategory && (!query || haystack.includes(query));
    });
  }

  function renderSkills() {
    const grid = $('#skill-grid');
    if (!grid) return;
    const skills = visibleSkills();
    const published = state.skills.filter((skill) => skill.status === 'Published').length;
    const drafts = state.skills.filter((skill) => skill.status === 'Draft').length;
    const setText = (id, value) => { const node = $(`#${id}`); if (node) node.textContent = value; };
    setText('skill-count', String(state.skills.length));
    setText('skill-summary', `${published} published · ${drafts} drafts · ${state.skills.length - published - drafts} deprecated`);
    if (!skills.length) {
      grid.innerHTML = `<div class="empty-state">No skills match this filter. Try “All” or a shorter search.</div>`;
      return;
    }
    grid.innerHTML = skills.map((skill, index) => `
      <article class="skill-card" data-open-skill="${skill.id}" data-status="${esc(skill.status)}" tabindex="0" role="button" aria-label="Open ${esc(skill.name)}, ${esc(skill.status)}" style="--i:${index}">
        <div class="card-top">
          <div><span class="card-kicker">${esc(skill.category)}</span><h3 class="card-title">${esc(skill.name)}</h3></div>
          ${statusBadge(skill.status)}
        </div>
        <p class="card-desc">${esc(skill.description)}</p>
        <div class="dep-chips">${(skill.deps || []).length ? skill.deps.map((dep) => `<span class="dep">${esc(dep)}</span>`).join('') : '<span class="dep dep-empty">No MCP dependencies</span>'}</div>
        <div class="card-foot"><span><b>${esc(skill.version)}</b></span><span>${esc(skill.owner)}</span><span class="spacer"></span><span>Updated ${esc(skill.updated)}</span><span class="card-chevron">${icon('chevron')}</span></div>
      </article>
    `).join('');
  }

  /* ---------------- render: MCP ---------------- */

  function renderMCP() {
    const grid = $('#mcp-grid');
    if (!grid) return;
    const connected = state.mcps.filter((mcp) => mcp.status === 'Connected').length;
    const allowed = state.mcps.reduce((total, mcp) => total + mcp.tools.filter((tool) => tool.enabled).length, 0);
    const setText = (id, value) => { const node = $(`#${id}`); if (node) node.textContent = value; };
    setText('mcp-count', String(state.mcps.length));
    setText('mcp-summary', `${connected} connected · ${allowed} tools allowed`);
    grid.innerHTML = state.mcps.map((mcp, index) => {
      const enabled = mcp.tools.filter((tool) => tool.enabled).length;
      const pct = mcp.tools.length ? Math.round((enabled / mcp.tools.length) * 100) : 0;
      return `<article class="mcp-card" data-open-mcp="${mcp.id}" tabindex="0" role="button" aria-label="Open ${esc(mcp.name)}, ${esc(mcp.status)}" style="--i:${index}">
        <div class="card-top">
          <div><span class="card-kicker">${esc(mcp.transport)} · ${esc(mcp.auth)}</span><h3 class="card-title">${esc(mcp.name)}</h3></div>
          ${statusBadge(mcp.status)}
        </div>
        <p class="mcp-endpoint">${esc(mcp.url)}</p>
        <div class="mcp-health">
          <span class="mcp-health-label">${enabled} / ${mcp.tools.length} tools allowed</span>
          <span class="meter" aria-hidden="true"><i style="--w:${pct}%"></i></span>
        </div>
        <div class="card-foot"><span>Last check ${esc(mcp.lastCheck)}</span><span class="spacer"></span><span>Timeout ${esc(mcp.timeout || '30s')}</span><span class="card-chevron">${icon('chevron')}</span></div>
      </article>`;
    }).join('');
  }

  /* ---------------- render: tasks ---------------- */

  function renderTasks() {
    const grid = $('#task-grid');
    if (!grid) return;
    const published = state.tasks.filter((task) => task.status === 'Published').length;
    const setText = (id, value) => { const node = $(`#${id}`); if (node) node.textContent = value; };
    setText('task-count', String(state.tasks.length));
    setText('task-summary', `${published} published · ${state.tasks.length - published} drafts`);
    setText('daily-task-count', String(published));
    grid.innerHTML = state.tasks.map((task, index) => `
      <article class="task-card" data-open-task="${task.id}" style="--i:${index}">
        <div class="card-top">
          <div><span class="card-kicker">${esc(task.status)} · ${esc(task.version)}</span><h3 class="card-title">${esc(task.name)}</h3></div>
          ${statusBadge(task.status)}
        </div>
        <p class="card-desc">${esc(task.description)}</p>
        <div class="steps-preview">
          ${task.steps.map((step, stepIndex) => `<span class="step-pill"><i>${stepIndex + 1}</i>${step.kind === 'skill' ? 'Skill' : 'MCP'} · ${esc(step.label)}</span>${stepIndex < task.steps.length - 1 ? '<span class="step-arrow" aria-hidden="true">→</span>' : ''}`).join('')}
        </div>
        <div class="task-foot">
          <span>${esc(task.owner)}</span>
          <span class="spacer"></span>
          <span>Last run ${esc(task.lastRun)}</span>
          <button type="button" class="card-link" data-open-task="${task.id}" aria-label="Open ${esc(task.name)}">Open</button>
          <button type="button" class="task-run" data-run-task="${task.id}">${icon('play')} ${task.status === 'Published' ? 'Run' : 'Test run'}</button>
        </div>
      </article>
    `).join('');
  }

  /* ---------------- render: runs ---------------- */

  function renderRunFilters() {
    const container = $('#run-filters');
    if (!container) return;
    const statuses = ['All', 'Succeeded', 'Running', 'Failed'];
    container.innerHTML = statuses.map((status) => {
      const count = status === 'All' ? state.runs.length : state.runs.filter((run) => run.status === status).length;
      return `<button type="button" class="filter-chip ${state.runFilter === status ? 'is-active' : ''}" data-run-filter="${status}" aria-pressed="${state.runFilter === status}">${status} <span class="chip-count">${count}</span></button>`;
    }).join('');
  }

  function visibleRuns() {
    return state.runs.filter((run) => state.runFilter === 'All' || run.status === state.runFilter);
  }

  function renderRuns() {
    const ledger = $('#runs-table');
    if (!ledger) return;
    const runs = visibleRuns();
    const setText = (id, value) => { const node = $(`#${id}`); if (node) node.textContent = value; };
    setText('runs-count', String(state.runs.length));
    setText('run-count', `${runs.length} shown · ${state.runs.length} total`);
    if (!runs.length) {
      ledger.innerHTML = `<div class="ledger-empty">No runs match this filter.</div>`;
      return;
    }
    ledger.innerHTML = `
      <div class="ledger-head" aria-hidden="true"><span>Run</span><span>Task</span><span>User</span><span>Status</span><span>Duration</span><span>Started</span><span></span></div>
      ${runs.map((run, index) => `
        <button type="button" class="ledger-row" data-open-run="${run.id}" aria-label="Open ${run.id}, ${esc(run.task)}, ${esc(run.status)}" style="--i:${index}">
          <span class="run-id">${run.id}</span>
          <span class="run-task">${esc(run.task)}<small>${run.steps.length} steps · ${esc(run.tokens)} tokens</small></span>
          <span class="run-user">${esc(run.user)}</span>
          ${statusBadge(run.status)}
          <span class="run-dur">${esc(run.duration)}</span>
          <span class="run-dur">${esc(run.started)}</span>
          <span class="row-chevron" aria-hidden="true">${icon('chevron')}</span>
        </button>
      `).join('')}
    `;
  }

  /* ---------------- render: audit ---------------- */

  function renderAudit() {
    const body = $('#audit-body');
    if (!body) return;
    const categories = ['All', 'Registry', 'Tools', 'Runs', 'Access'];
    const query = state.auditQuery.trim().toLowerCase();
    const filters = $('#audit-filters');
    if (filters) {
      filters.innerHTML = categories.map((category) => {
        const count = category === 'All' ? AUDIT.length : AUDIT.filter((event) => event.category === category).length;
        return `<button type="button" class="filter-chip ${state.auditFilter === category ? 'is-active' : ''}" data-audit-filter="${category}" aria-pressed="${state.auditFilter === category}">${category} <span class="chip-count">${count}</span></button>`;
      }).join('');
    }
    const events = AUDIT.filter((event) => {
      const inCategory = state.auditFilter === 'All' || event.category === state.auditFilter;
      const inPeriod = state.auditPeriod === 'all'
        || (state.auditPeriod === 'today' && event.days === 0)
        || (state.auditPeriod === '7d' && event.days <= 7);
      const haystack = [event.time, event.actor, event.action, event.target, event.outcome, event.category].join(' ').toLowerCase();
      return inCategory && inPeriod && (!query || haystack.includes(query));
    });
    const topCount = $('#audit-count-top');
    if (topCount) topCount.textContent = String(events.length);
    body.innerHTML = events.length
      ? events.map((event) => `<tr>
          <td class="audit-time">${esc(event.time)}</td>
          <td><span class="audit-actor"><span class="avatar" aria-hidden="true">${esc(initials(event.actor))}</span>${esc(event.actor)}</span></td>
          <td><code>${esc(event.action)}</code></td>
          <td>${esc(event.target)}</td>
          <td>${statusBadge(event.outcome)}</td>
        </tr>`).join('')
      : `<tr><td colspan="5" class="muted" style="text-align:center;padding:28px">No events match this filter.</td></tr>`;
  }

  /* ---------------- render: usage ---------------- */

  function renderUsage() {
    const pinned = state.chats.filter((chat) => chat.pinned).length;
    const succeeded = state.runs.filter((run) => run.status === 'Succeeded').length;
    const failed = state.runs.filter((run) => run.status === 'Failed').length;
    const published = state.skills.filter((skill) => skill.status === 'Published').length;
    const connected = state.mcps.filter((mcp) => mcp.status === 'Connected').length;
    const set = (id, value) => { const node = $(`#${id}`); if (node) node.textContent = value; };
    set('usage-conversations', String(state.chats.length));
    set('usage-conversations-sub', `${pinned} pinned · ${state.chats.length - pinned} active`);
    set('usage-runs', String(state.runs.length));
    set('usage-runs-sub', `${succeeded} succeeded · ${failed} failed`);
    set('usage-skills', String(published));
    set('usage-skills-sub', `of ${state.skills.length} total`);
    set('usage-mcp', String(connected));
    set('usage-mcp-sub', `connected of ${state.mcps.length}`);
  }

  /* ---------------- render all / navigation ---------------- */

  function renderAll() {
    renderChat();
    renderHistory();
    renderSkillFilters();
    renderSkills();
    renderMCP();
    renderTasks();
    renderRunFilters();
    renderRuns();
    renderAudit();
    renderUsage();
  }

  function navigate(view) {
    if (!viewNames[view]) return;
    state.view = view;
    $$('[data-view-panel]').forEach((panel) => {
      const active = panel.dataset.viewPanel === view;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
    const crumb = view === 'chat' ? 'Chat' : view === 'tasks' ? 'Tasks' : `Manage / ${viewNames[view]}`;
    const crumbNode = $('#crumb-current');
    if (crumbNode) crumbNode.textContent = crumb;
    $$('.nav-link').forEach((link) => {
      const active = link.dataset.view === view;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    closeSidebar();
    closeDrawer(true);
    closeModal(true);
    closeMenus();
    const main = $('#main');
    if (main) main.scrollTop = 0;
    try { history.replaceState(null, '', `#${view}`); } catch (error) { /* file:// can reject replaceState */ }
    if (view === 'chat') renderChat('preserve');
    if (view === 'tasks') renderTasks();
    if (view === 'skills') { renderSkillFilters(); renderSkills(); }
    if (view === 'mcp') renderMCP();
    if (view === 'runs') { renderRunFilters(); renderRuns(); }
    if (view === 'audit') renderAudit();
    if (view === 'usage') renderUsage();
  }

  /* ---------------- overlay: drawer ---------------- */

  const drawer = $('#drawer');
  const modal = $('#modal');
  const DRAWER_FALLBACK = '<h2 class="visually-hidden" id="drawer-title">Detail panel</h2>';
  const MODAL_FALLBACK = '<h2 class="visually-hidden" id="modal-title">Dialog</h2>';

  function drawerHeader(kicker, title, subtitle, badges = '') {
    return `<div class="drawer-header">
      <div class="drawer-header-top">
        <div>
          <p class="eyebrow">${kicker}</p>
          <h2 class="drawer-title" id="drawer-title">${esc(title)}</h2>
          <p class="drawer-sub">${subtitle}</p>
        </div>
        <button type="button" class="icon-btn drawer-close" data-close-drawer aria-label="Close panel">${icon('close')}</button>
      </div>
      ${badges ? `<div class="drawer-badges">${badges}</div>` : ''}
    </div>`;
  }

  function drawerShell(header, body, footer = '') {
    return `${header}<div class="drawer-body">${body}</div>${footer ? `<div class="drawer-footer">${footer}</div>` : ''}`;
  }

  function openDrawer(html) {
    if (drawer.hidden) rememberFocus();
    drawer.innerHTML = html;
    drawer.hidden = false;
    $('#scrim').hidden = false;
    requestAnimationFrame(() => drawer.classList.add('is-open'));
    syncScrollLock();
    setTimeout(() => drawer.querySelector('[data-close-drawer]')?.focus(), 30);
  }

  function closeDrawer(immediate = false) {
    if (drawer.hidden) return;
    drawer.classList.remove('is-open');
    if (immediate) {
      drawer.hidden = true;
      drawer.innerHTML = DRAWER_FALLBACK;
      setScrim();
      syncScrollLock();
      restoreFocus();
    } else {
      setTimeout(() => {
        if (!drawer.classList.contains('is-open')) {
          drawer.hidden = true;
          drawer.innerHTML = DRAWER_FALLBACK;
          setScrim();
          syncScrollLock();
          restoreFocus();
        }
      }, 260);
    }
  }

  function openSkill(id) {
    const skill = state.skills.find((item) => item.id === id);
    if (!skill) return;
    const badge = `${statusBadge(skill.status)}<span class="status neutral">${esc(skill.version)}</span><span class="status neutral">Updated ${esc(skill.updated)}</span>`;
    const body = `
      <p class="drawer-desc">${esc(skill.description)}</p>
      <section class="drawer-section">
        <h3>Instructions</h3>
        <pre class="manifest">${esc(skill.instructions)}</pre>
      </section>
      <section class="drawer-section">
        <h3>Inputs</h3>
        <table class="data-table">
          <thead><tr><th scope="col">Field</th><th scope="col">Type</th><th scope="col">Required</th><th scope="col">Help</th></tr></thead>
          <tbody>${(skill.inputs || []).map((input) => `<tr><td><code>${esc(input.name)}</code></td><td>${esc(input.type)}</td><td>${input.required ? 'Yes' : 'No'}</td><td>${esc(input.help || '—')}</td></tr>`).join('') || '<tr><td colspan="4">No inputs defined.</td></tr>'}</tbody>
        </table>
      </section>
      <section class="drawer-section">
        <h3>Dependencies</h3>
        <div class="dep-chips">${(skill.deps || []).map((dep) => `<span class="dep">${esc(dep)}</span>`).join('') || '<span class="small muted">None</span>'}</div>
      </section>
      <section class="drawer-section">
        <h3>Versions</h3>
        <ul class="tool-list">${(skill.versions || []).map((version) => `<li><span class="dot ok" aria-hidden="true"></span><code>${esc(version)}</code></li>`).join('')}</ul>
      </section>
      <section class="drawer-section">
        <h3>Test this skill</h3>
        <div class="test-box">
          <label class="visually-hidden" for="skill-test-input">Sample input</label>
          <textarea id="skill-test-input" placeholder="Sample input, e.g. week=2026-10-12, project=Platform"></textarea>
          <button type="button" class="btn btn-secondary btn-sm" data-test-skill="${skill.id}">${icon('play')} Run test</button>
          <div id="skill-test-output"></div>
        </div>
      </section>`;
    const footer = `<button type="button" class="btn btn-primary" data-toast="Publishing a new version is a mock in this prototype.">Publish new version</button>
      <button type="button" class="btn btn-secondary" data-toast="Duplicating a skill is a mock in this prototype.">Duplicate</button>`;
    openDrawer(drawerShell(drawerHeader('Skill', skill.name, `${esc(skill.category)} · ${esc(skill.owner)}`, badge), body, footer));
  }

  function openMCP(id) {
    const mcp = state.mcps.find((item) => item.id === id);
    if (!mcp) return;
    const allowed = mcp.tools.filter((tool) => tool.enabled).length;
    const badge = `${statusBadge(mcp.status)}<span class="status neutral" id="mcp-tools-badge">${allowed} / ${mcp.tools.length} tools allowed</span>`;
    const body = `
      <dl class="kv">
        <div><dt>Endpoint</dt><dd><code>${esc(mcp.url)}</code></dd></div>
        <div><dt>Transport</dt><dd>${esc(mcp.transport)}</dd></div>
        <div><dt>Authentication</dt><dd>${esc(mcp.auth)} · encrypted reference</dd></div>
        <div><dt>Timeout</dt><dd>${esc(mcp.timeout || '30s')}</dd></div>
        <div><dt>Health</dt><dd>${esc(mcp.status)} · ${esc(mcp.lastCheck)}</dd></div>
      </dl>
      <section class="drawer-section">
        <h3>Tool allowlist</h3>
        ${mcp.tools.length ? mcp.tools.map((tool) => `
          <div class="tool-toggle">
            <div class="tool-toggle-main"><code>${esc(mcp.refPrefix)}.${esc(tool.name)}</code><small>${esc(tool.desc)} · ${tool.write ? 'write' : 'read-only'}</small></div>
            ${tool.write
              ? `<span class="status error"><span class="dot" aria-hidden="true"></span>Blocked in v1</span>`
              : `<button type="button" class="toggle ${tool.enabled ? 'is-on' : ''}" role="switch" aria-checked="${tool.enabled}" data-toggle-tool="${mcp.id}:${tool.name}" aria-label="${tool.enabled ? 'Disable' : 'Enable'} ${esc(tool.name)}"></button>`}
          </div>
        `).join('') : `<p class="small muted">No tools discovered yet. Test the connection first.</p>`}
      </section>`;
    const footer = `<button type="button" class="btn btn-primary" data-test-mcp="${mcp.id}">${icon('refresh')} Test connection</button>
      ${mcp.status === 'Needs auth' ? `<button type="button" class="btn btn-secondary" data-auth-mcp="${mcp.id}">Authenticate</button>` : ''}
      <button type="button" class="btn btn-secondary" data-toast="Saving the server is a mock in this prototype.">Save changes</button>`;
    openDrawer(drawerShell(drawerHeader('MCP server', mcp.name, `${esc(mcp.transport)} · ${esc(mcp.auth)} · last check ${esc(mcp.lastCheck)}`, badge), body, footer));
  }

  function openTask(id) {
    const task = state.tasks.find((item) => item.id === id);
    if (!task) return;
    const badge = `${statusBadge(task.status)}<span class="status neutral">${esc(task.version)}</span><span class="status neutral">${task.steps.length} steps</span>`;
    const body = `
      <p class="drawer-desc">${esc(task.description)}</p>
      <section class="drawer-section">
        <h3>Inputs</h3>
        <table class="data-table">
          <thead><tr><th scope="col">Field</th><th scope="col">Type</th><th scope="col">Required</th><th scope="col">Help</th></tr></thead>
          <tbody>${task.inputs.map((input) => `<tr><td><code>${esc(input.name)}</code></td><td>${esc(input.type)}</td><td>${input.required ? 'Yes' : 'No'}</td><td>${esc(input.help || '—')}</td></tr>`).join('')}</tbody>
        </table>
      </section>
      <section class="drawer-section">
        <h3>Steps</h3>
        <div class="step-list">
          ${task.steps.map((step, index) => `
            <div class="step-card">
              <span class="step-index">${index + 1}</span>
              <div><strong>${step.kind === 'skill' ? 'Skill' : 'MCP tool'} · ${esc(step.label)}</strong><small>${esc(step.detail)}</small></div>
              <span class="status neutral">${step.kind}</span>
            </div>
          `).join('')}
        </div>
      </section>
      <p class="form-note">Manual runs only. Scheduling, approvals, and branching are out of scope for v1.</p>`;
    const footer = `<button type="button" class="btn btn-primary" data-run-task="${task.id}">${icon('play')} ${task.status === 'Published' ? 'Run task' : 'Test run'}</button>
      <button type="button" class="btn btn-secondary" data-toast="Publishing a task version is a mock in this prototype.">Publish</button>
      <button type="button" class="btn btn-secondary" data-toast="Editing steps is a mock in this prototype.">Edit steps</button>`;
    openDrawer(drawerShell(drawerHeader('Task', task.name, `${esc(task.version)} · ${esc(task.owner)} · last run ${esc(task.lastRun)}`, badge), body, footer));
  }

  function openRun(id) {
    const run = state.runs.find((item) => item.id === id);
    if (!run) return;
    const marker = (status) => status === 'Succeeded' ? '✓' : status === 'Running' ? '…' : status === 'Failed' ? '!' : '·';
    const badge = `${statusBadge(run.status)}<span class="status neutral">${esc(run.duration)}</span>`;
    const body = `
      <dl class="kv">
        <div><dt>Run ID</dt><dd><code>${esc(run.id)}</code></dd></div>
        <div><dt>Task</dt><dd>${esc(run.task)}</dd></div>
        <div><dt>Task version</dt><dd>${esc(run.taskVersion || '—')}</dd></div>
        <div><dt>Started by</dt><dd>${esc(run.user)}</dd></div>
        <div><dt>Start / end</dt><dd>${esc(run.started)} → ${esc(run.ended || '—')}</dd></div>
        <div><dt>Tokens / cost</dt><dd>${esc(run.tokens)} · ${esc(run.cost)}</dd></div>
      </dl>
      <section class="drawer-section">
        <h3>Timeline</h3>
        <ol class="timeline">
          ${run.steps.map((step) => `
            <li class="timeline-step ${statusClass(step.status)}">
              <span class="timeline-marker" aria-hidden="true">${marker(step.status)}</span>
              <div class="timeline-body">
                <strong>${esc(step.name)} <span class="status ${statusClass(step.status)}">${esc(step.status)}</span></strong>
                <small>${esc(step.kind)} · ${esc(step.duration)} · ${esc(step.detail)}</small>
              </div>
            </li>
          `).join('')}
        </ol>
      </section>
      <section class="drawer-section">
        <h3>Artifacts</h3>
        ${run.artifacts.length
          ? `<div class="artifact-list">${run.artifacts.map((artifact) => `<button type="button" class="artifact" data-toast="Downloading ${esc(artifact)} is a mock.">${icon('file')} ${esc(artifact)}</button>`).join('')}</div>`
          : `<p class="small muted">No artifacts. ${run.status === 'Failed' ? 'The run stopped before writing an artifact.' : 'The run is still in progress.'}</p>`}
      </section>`;
    const footer = `<button type="button" class="btn btn-primary" data-rerun="${run.taskId}">${icon('refresh')} Re-run task</button>
      <button type="button" class="btn btn-secondary" data-close-drawer>Close</button>`;
    openDrawer(drawerShell(drawerHeader('Run', run.task, `${esc(run.id)} · ${esc(run.user)} · ${esc(run.started)}`, badge), body, footer));
  }

  function openContext() {
    const body = `<div class="rail-content">${$('#rail-content')?.innerHTML || ''}</div>`;
    openDrawer(drawerShell(
      drawerHeader('Conversation', 'Run context', 'The skill, tools, and session details behind the current reply.'),
      body,
      `<button type="button" class="btn btn-secondary" data-close-drawer>Close</button>`
    ));
  }

  function openManage() {
    const publishedSkills = state.skills.filter((skill) => skill.status === 'Published').length;
    const connectedMcp = state.mcps.filter((mcp) => mcp.status === 'Connected').length;
    const publishedTasks = state.tasks.filter((task) => task.status === 'Published').length;
    const sections = [
      {
        label: 'Registries',
        rows: [
          { view: 'skills', icon: 'skills', title: 'Skills', desc: 'Versioned instructions', meta: `${publishedSkills} published · ${state.skills.length} total` },
          { view: 'mcp', icon: 'mcp', title: 'MCP servers', desc: 'Governed tool connections', meta: `${connectedMcp} connected · ${state.mcps.length} total` },
          { view: 'tasks', icon: 'tasks', title: 'Tasks', desc: 'Reusable work definitions', meta: `${publishedTasks} published · ${state.tasks.length} total` }
        ]
      },
      {
        label: 'Operations',
        rows: [
          { view: 'runs', icon: 'runs', title: 'Runs', desc: 'Execution history and artifacts', meta: `${state.runs.length} recorded` },
          { view: 'usage', icon: 'usage', title: 'Usage', desc: 'Adoption, tokens, and spend', meta: 'Last 30 days' },
          { view: 'audit', icon: 'audit', title: 'Audit', desc: 'Registry, tool, run, and access events', meta: 'Append-only' }
        ]
      },
      {
        label: 'Configuration',
        rows: [
          { view: 'admin', icon: 'settings', title: 'Settings', desc: 'Accounts, model gateway, and policy', meta: 'MVP settings' }
        ]
      }
    ];
    const rowHtml = (row) => `<button type="button" class="manage-row" data-view="${row.view}">
      <span class="manage-icon">${icon(row.icon)}</span>
      <span><strong>${row.title}</strong><small>${row.desc} · ${row.meta}</small></span>
      <span class="manage-arrow" aria-hidden="true">${icon('chevron')}</span>
    </button>`;
    const body = `
      <p class="manage-intro">The daily flow stays in chat and Tasks. Open Manage only when you need to configure or inspect the workspace.</p>
      <div class="manage-list">
        ${sections.map((section) => `<div class="manage-section">
          <p class="manage-section-label">${section.label}</p>
          <div class="manage-rows">${section.rows.map(rowHtml).join('')}</div>
        </div>`).join('')}
      </div>
      <p class="manage-foot">All registry changes are audited. Write-capable tools are disabled in v1.</p>`;
    openDrawer(drawerShell(drawerHeader('Workspace', 'Manage', 'Registries, operations, and settings — occasional configuration.'), body));
  }

  /* ---------------- overlay: modal ---------------- */

  function closeModal(immediate = false) {
    if (modal.hidden) return;
    modal.hidden = true;
    modal.innerHTML = MODAL_FALLBACK;
    setScrim();
    syncScrollLock();
    restoreFocus();
  }

  function modalHeader(kicker, title, subtitle) {
    return `<div class="modal-header">
      <div><p class="eyebrow">${kicker}</p><h2 class="modal-title" id="modal-title">${esc(title)}</h2><p class="modal-sub">${subtitle}</p></div>
      <button type="button" class="icon-btn" data-close-modal aria-label="Close dialog">${icon('close')}</button>
    </div>`;
  }

  function showModal(html) {
    if (modal.hidden) rememberFocus();
    modal.innerHTML = html;
    modal.hidden = false;
    $('#scrim').hidden = false;
    syncScrollLock();
    setTimeout(() => {
      const primary = modal.querySelector('input, textarea, select') || modal.querySelector('button');
      if (primary) primary.focus();
    }, 30);
  }

  function openChatActions(id) {
    const chat = state.chats.find((item) => item.id === id);
    if (!chat) return;
    showModal(`${modalHeader('Chat', 'Chat actions', 'Rename, pin, or delete this conversation.')}
      <form class="modal-form" data-form="rename-chat" data-rename-chat="${chat.id}">
        <div class="modal-body">
          <div class="field">
            <label for="chat-rename">Title</label>
            <input id="chat-rename" name="title" required value="${esc(chat.title)}">
          </div>
          <div class="danger-zone">
            <button type="button" class="btn btn-secondary btn-sm" data-pin-chat="${chat.id}">${icon('pin')} ${chat.pinned ? 'Unpin' : 'Pin'} chat</button>
            <button type="button" class="btn btn-danger btn-sm" data-delete-chat="${chat.id}">${icon('trash')} Delete chat</button>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-close-modal>Cancel</button>
          <button type="submit" class="btn btn-primary">Save title</button>
        </div>
      </form>`);
  }

  function confirmDeleteChat(id) {
    const chat = state.chats.find((item) => item.id === id);
    if (!chat) return;
    showModal(`${modalHeader('Chat', 'Delete this chat?', 'This is a mock; the conversation disappears from history.')}
      <div class="modal-body">
        <p class="confirm-copy">“${esc(chat.title)}” will be removed from the prototype.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-close-modal>Cancel</button>
        <button type="button" class="btn btn-danger" data-confirm-delete-chat="${chat.id}">${icon('trash')} Delete chat</button>
      </div>`);
  }

  const toolOptions = () => state.mcps.flatMap((mcp) => mcp.tools
    .filter((tool) => tool.enabled && !tool.write)
    .map((tool) => ({ mcp, tool, ref: `${mcp.refPrefix}.${tool.name}` })));

  function openModal(type) {
    if (type === 'skill') {
      const availableTools = toolOptions();
      modal.innerHTML = `${modalHeader('Registry / New skill', 'Draft a skill', 'Prompt-only in v1; no code execution.')}
        <form class="modal-form" data-form="skill">
          <div class="modal-body">
            <div class="field">
              <label for="skill-name">Name</label>
              <input id="skill-name" name="name" required placeholder="e.g. Release Notes Writer">
            </div>
            <div class="field">
              <label for="skill-desc">Description</label>
              <input id="skill-desc" name="description" required placeholder="What does it do, in one sentence?">
            </div>
            <div class="field-row">
              <div class="field">
                <label for="skill-category">Category</label>
                <select id="skill-category" name="category"><option>Engineering</option><option>Ops</option><option>Docs</option><option>Analytics</option></select>
              </div>
              <div class="field">
                <label for="skill-version">Initial version</label>
                <input id="skill-version" name="version" value="v1" readonly>
              </div>
            </div>
            <div class="field">
              <label for="skill-instructions">Instructions</label>
              <textarea id="skill-instructions" name="instructions" placeholder="Write the operating instructions, constraints, and output format…"></textarea>
            </div>
            <div class="field">
              <label for="skill-schema">Input schema (optional JSON)</label>
              <textarea id="skill-schema" name="schema" placeholder='{"type":"object","properties":{}}'></textarea>
            </div>
            <div class="field">
              <label>Allowed MCP tools</label>
              ${availableTools.length
                ? `<div class="check-grid">${availableTools.map(({ mcp, tool, ref }) => `<label><input type="checkbox" name="deps" value="${esc(ref)}"> <span>${esc(ref)}</span> <small>${esc(tool.desc)} · ${esc(mcp.name)}</small></label>`).join('')}</div>`
                : '<p class="small muted">No allowlisted read-only tools are available. Allowlist one in MCP first.</p>'}
            </div>
            <p class="form-note">Skills are prompt-only in v1. Code execution and write-capable tools are out of scope (TBD-BIZ-007).</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-close-modal>Cancel</button>
            <button type="submit" class="btn btn-secondary" name="intent" value="draft">Save draft</button>
            <button type="submit" class="btn btn-primary" name="intent" value="publish">Publish</button>
          </div>
        </form>`;
    } else if (type === 'mcp') {
      modal.innerHTML = `${modalHeader('Registry / Add MCP', 'Connect a server', 'HTTP or SSE. Credentials are referenced, never pasted.')}
        <form class="modal-form" data-form="mcp">
          <div class="modal-body">
            <div class="field">
              <label for="mcp-name">Display name</label>
              <input id="mcp-name" name="name" required placeholder="e.g. Confluence MCP">
            </div>
            <div class="field">
              <label for="mcp-url">Endpoint URL</label>
              <input id="mcp-url" name="url" required placeholder="https://mcp.internal/your-server">
            </div>
            <div class="field-row">
              <div class="field">
                <label for="mcp-transport">Transport</label>
                <select id="mcp-transport" name="transport"><option>HTTP</option><option>SSE</option></select>
              </div>
              <div class="field">
                <label for="mcp-auth">Authentication</label>
                <select id="mcp-auth" name="auth"><option>OAuth</option><option>API key</option></select>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <label for="mcp-secret">Secret reference</label>
                <input id="mcp-secret" name="secret" placeholder="secret://mcp/your-server">
                <span class="hint">Never paste a secret value into this form.</span>
              </div>
              <div class="field">
                <label for="mcp-timeout">Timeout (seconds)</label>
                <input id="mcp-timeout" name="timeout" type="number" min="5" max="300" value="30">
              </div>
            </div>
            <p class="form-note">Only tools you explicitly allowlist become callable. Write tools stay off in v1.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-close-modal>Cancel</button>
            <button type="button" class="btn btn-secondary" data-toast="Connection test completed (mock). Tools would appear after authentication.">Test connection</button>
            <button type="submit" class="btn btn-primary">Save server</button>
          </div>
        </form>`;
    } else if (type === 'task') {
      const stepOptions = [
        ...state.skills.filter((skill) => skill.status === 'Published').map((skill) => `<option value="skill:${skill.id}">Skill · ${esc(skill.name)}</option>`),
        ...state.mcps.flatMap((mcp) => mcp.tools.filter((tool) => tool.enabled && !tool.write).map((tool) => `<option value="mcp:${esc(tool.name)}">MCP · ${esc(tool.name)} (${esc(mcp.name)})</option>`))
      ].join('');
      modal.innerHTML = `${modalHeader('Registry / New task', 'Compose a task', 'Linear steps only in v1. No branching or scheduling.')}
        <form class="modal-form" data-form="task">
          <div class="modal-body">
            <div class="field">
              <label for="task-name">Name</label>
              <input id="task-name" name="name" required placeholder="e.g. Weekly Release Brief">
            </div>
            <div class="field">
              <label for="task-desc">Description</label>
              <input id="task-desc" name="description" required placeholder="What should this task produce?">
            </div>
            <div class="field">
              <label for="task-inputs">Inputs (one per line, name:type)</label>
              <textarea id="task-inputs" name="inputs" placeholder="week:date&#10;project:select"></textarea>
            </div>
            <div class="field">
              <label for="task-step">First step</label>
              <select id="task-step" name="step">${stepOptions}</select>
            </div>
            <p class="form-note">Manual runs only. You can add more steps after saving in a future version (mock).</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-close-modal>Cancel</button>
            <button type="submit" class="btn btn-primary">Save draft</button>
          </div>
        </form>`;
    }
    if (modal.hidden) rememberFocus();
    modal.hidden = false;
    $('#scrim').hidden = false;
    syncScrollLock();
    setTimeout(() => {
      const primary = modal.querySelector('input, textarea, select') || modal.querySelector('button');
      if (primary) primary.focus();
    }, 30);
  }

  /* ---------------- chat actions ---------------- */

  function currentSkill() {
    return state.skills.find((skill) => skill.id === state.activeSkill);
  }

  function mockReply(text) {
    const skill = currentSkill();
    const search = state.search || /search/i.test(text);
    const tools = [];
    if (search) tools.push({ name: 'web.search', input: `q = "${text.slice(0, 42)}"`, output: '5 results', duration: '1.1s' });
    if (skill) {
      skill.deps.forEach((dep) => tools.push({ name: dep, input: `query = "${text.slice(0, 32)}"`, output: 'workspace context', duration: '0.9s' }));
    }
    if (!tools.length) tools.push({ name: 'workspace.answer', input: 'planner = auto', output: 'draft response', duration: '0.6s' });

    if (search) {
      return {
        role: 'assistant',
        skill: skill ? { id: skill.id, name: skill.name, version: skill.version } : null,
        tools,
        body: `<p>I searched for “${esc(text)}”. In the mock, the assistant would ground the answer in the results below and cite each one.</p>
          <ul><li><strong>Source 1:</strong> the internal release checklist (Confluence).</li><li><strong>Source 2:</strong> the on-call runbook (Confluence).</li><li><strong>Source 3:</strong> an external reference (web).</li></ul>
          <p>This answer is synthetic; no external request was made.</p>`,
        sources: [{ kind: 'Confluence', label: 'Release checklist' }, { kind: 'Web', label: 'Public reference' }]
      };
    }
    if (skill) {
      return {
        role: 'assistant',
        skill: { id: skill.id, name: skill.name, version: skill.version },
        tools,
        body: `<p>Using <strong>${esc(skill.name)}</strong>, I produced a mock result for:</p>
          <blockquote>${esc(text)}</blockquote>
          <ul><li>The skill would call its declared dependencies and keep the output within the manifest schema.</li><li>Read-only tools are enabled; write actions stay disabled in v1.</li><li>The full tool trace is shown above.</li></ul>
          <p>Replace this mock with a real model call only after the stack decision and the MCP proof.</p>`
      };
    }
    return {
      role: 'assistant',
      tools,
      body: `<p>Here is a mock answer to:</p>
        <blockquote>${esc(text)}</blockquote>
        <p>The prototype does not call a model. In the real product this response would be grounded in the enabled skills and MCP tools, and the run would appear in the ledger.</p>
        <ul><li>Try selecting a skill with <code>/</code>, attaching a file with <code>@</code>, or turning on Search.</li><li>Then open Skills or MCP to inspect the registries.</li></ul>`
    };
  }

  function sendMessage() {
    const input = $('#chat-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text || state.typing) return;
    const chat = activeChat();
    const firstUserMessage = !state.messages.some((message) => message.role === 'user');
    state.messages.push({ role: 'user', text });
    if (chat) {
      chat.updated = nowLabel();
      if (firstUserMessage && chat.title === 'New conversation') {
        chat.title = text.length > 48 ? `${text.slice(0, 48)}…` : text;
      }
      renderHistory();
    }
    const chatId = state.activeChatId;
    const reply = mockReply(text);
    input.value = '';
    resizeInput();
    state.typing = true;
    setChatStatus('Message sent. The assistant is responding.');
    renderChat('bottom');
    setTimeout(() => {
      const targetChat = state.chats.find((item) => item.id === chatId);
      if (targetChat) {
        targetChat.messages.push(reply);
        targetChat.updated = nowLabel();
      }
      if (state.activeChatId === chatId) {
        state.typing = false;
        if (targetChat) state.messages = targetChat.messages;
        renderChat('bottom');
        setChatStatus('The assistant replied.');
      }
      renderHistory();
      renderUsage();
    }, 720);
  }

  function newChat() {
    state.chatQuery = '';
    const search = $('#chat-search');
    if (search) search.value = '';
    const existing = state.chats.find((chat) => chat.title === 'New conversation' && chat.messages.length === 0);
    if (existing) {
      selectChat(existing.id);
      return;
    }
    const chat = {
      id: `chat-${Date.now()}`,
      title: 'New conversation',
      group: 'Today',
      updated: 'now',
      messages: []
    };
    state.chats.unshift(chat);
    selectChat(chat.id);
    setChatStatus('New conversation started.');
    showToast('New mock conversation.');
  }

  function resizeInput() {
    const input = $('#chat-input');
    if (!input) return;
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 168)}px`;
  }

  function insertAtCursor(text) {
    const input = $('#chat-input');
    if (!input) return;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    input.value = `${input.value.slice(0, start)}${text}${input.value.slice(end)}`;
    input.focus();
    input.selectionStart = input.selectionEnd = start + text.length;
    resizeInput();
  }

  function toggleSearch(force) {
    state.search = typeof force === 'boolean' ? force : !state.search;
    const button = $('#search-toggle');
    if (button) {
      button.classList.toggle('is-on', state.search);
      button.setAttribute('aria-pressed', String(state.search));
    }
    renderComposerContext();
  }

  function closeMenus() {
    const slash = $('#slash-menu');
    const mention = $('#mention-menu');
    if (slash) slash.hidden = true;
    if (mention) mention.hidden = true;
  }

  function openMenu(type) {
    closeMenus();
    if (type === 'slash') {
      const items = state.skills.filter((skill) => skill.status === 'Published');
      const container = $('#slash-items');
      if (container) container.innerHTML = items.map((skill) => `<button type="button" class="popover-item" role="menuitem" data-skill-pick="${skill.id}">${esc(skill.name)}<small>${esc(skill.category)} · ${esc(skill.version)}</small></button>`).join('');
      const menu = $('#slash-menu');
      if (menu) menu.hidden = false;
      $('#chat-input')?.focus();
    } else {
      const container = $('#mention-items');
      if (container) container.innerHTML = FILES.map((file) => `<button type="button" class="popover-item" role="menuitem" data-file-pick="${esc(file)}">${esc(file)}<small>Workspace file · mock</small></button>`).join('');
      const menu = $('#mention-menu');
      if (menu) menu.hidden = false;
      $('#chat-input')?.focus();
    }
  }

  /* ---------------- task runs ---------------- */

  function runTask(taskId) {
    const task = state.tasks.find((item) => item.id === taskId);
    if (!task) return;
    closeDrawer(true);
    const run = {
      id: `RUN-${state.nextRun++}`,
      taskId: task.id,
      task: task.name,
      user: 'Alex Chen',
      status: 'Running',
      duration: '0m 04s',
      started: 'just now',
      ended: '—',
      taskVersion: task.version,
      tokens: '—',
      cost: '—',
      artifacts: [],
      steps: task.steps.map((step, index) => ({
        name: step.label,
        kind: step.kind,
        status: index === 0 ? 'Succeeded' : index === 1 ? 'Running' : 'Pending',
        duration: index === 0 ? '8s' : index === 1 ? 'running' : '—',
        detail: index === 0 ? 'Step completed' : index === 1 ? 'Executing…' : 'Waiting'
      }))
    };
    state.runs.unshift(run);
    state.runFilter = 'All';
    renderRunFilters();
    renderRuns();
    renderTasks();
    navigate('runs');
    showToast('Run started (mock).');
    setTimeout(() => {
      run.status = 'Succeeded';
      run.duration = '1m 08s';
      run.ended = 'just now';
      run.tokens = '11.2k';
      run.cost = '$0.27';
      run.artifacts = ['task-output.md'];
      run.steps = run.steps.map((step) => ({ ...step, status: 'Succeeded', duration: '21s', detail: 'Step completed' }));
      renderRuns();
      renderRunFilters();
      if (state.view === 'runs') openRun(run.id);
      showToast('Run completed (mock).');
    }, 1700);
  }

  /* ---------------- forms ---------------- */

  function handleFormSubmit(event) {
    const form = event.target.closest('form[data-form]');
    if (!form) return;
    event.preventDefault();
    const data = new FormData(form);
    const type = form.dataset.form;

    if (type === 'skill') {
      const name = String(data.get('name') || '').trim();
      const description = String(data.get('description') || '').trim();
      if (!name || !description) { showToast('Name and description are required.'); return; }
      const intent = event.submitter ? event.submitter.value : 'draft';
      const status = intent === 'publish' ? 'Published' : 'Draft';
      let inputs = [];
      const schemaText = String(data.get('schema') || '').trim();
      if (schemaText) {
        try {
          const schema = JSON.parse(schemaText);
          const requiredFields = Array.isArray(schema.required) ? schema.required : [];
          inputs = Object.entries(schema.properties || {}).map(([field, definition]) => {
            const spec = definition && typeof definition === 'object' ? definition : {};
            return {
              name: field,
              type: spec.type || 'text',
              required: requiredFields.includes(field),
              help: spec.description || '—'
            };
          });
        } catch (error) {
          showToast('Input schema is not valid JSON; the draft was saved without it.');
        }
      }
      const skill = {
        id: `skill-${Date.now()}`,
        name,
        description,
        category: String(data.get('category') || 'Engineering'),
        status,
        version: 'v1',
        owner: 'Alex Chen',
        updated: 'just now',
        instructions: String(data.get('instructions') || 'No instructions yet.').trim(),
        inputs,
        deps: data.getAll('deps').map(String),
        versions: [`v1 · just now · ${status}`]
      };
      state.skills.unshift(skill);
      closeModal();
      renderSkillFilters();
      renderSkills();
      renderUsage();
      openSkill(skill.id);
      showToast(`${status === 'Published' ? 'Published' : 'Draft saved'}: ${name} (mock).`);
      return;
    }

    if (type === 'mcp') {
      const name = String(data.get('name') || '').trim();
      const url = String(data.get('url') || '').trim();
      if (!name || !url) { showToast('Name and endpoint URL are required.'); return; }
      const prefix = name.toLowerCase().split(/\s+/)[0].replace(/[^a-z0-9]/g, '') || 'server';
      const mcp = {
        id: `mcp-${Date.now()}`,
        refPrefix: prefix,
        name,
        transport: String(data.get('transport') || 'HTTP'),
        url,
        auth: String(data.get('auth') || 'OAuth'),
        timeout: `${String(data.get('timeout') || '30').trim()}s`,
        status: 'Needs auth',
        lastCheck: 'never',
        tools: []
      };
      state.mcps.unshift(mcp);
      closeModal();
      renderMCP();
      renderUsage();
      openMCP(mcp.id);
      showToast(`Server saved: ${name} (mock). Authenticate to discover tools.`);
      return;
    }

    if (type === 'task') {
      const name = String(data.get('name') || '').trim();
      const description = String(data.get('description') || '').trim();
      if (!name || !description) { showToast('Name and description are required.'); return; }
      const [kind, ref] = String(data.get('step') || 'skill:skill-release').split(':');
      const label = kind === 'skill'
        ? (state.skills.find((skill) => skill.id === ref)?.name || ref)
        : ref;
      const inputLines = String(data.get('inputs') || '').split('\n').map((line) => line.trim()).filter(Boolean);
      const task = {
        id: `task-${Date.now()}`,
        name,
        description,
        status: 'Draft',
        version: 'v1',
        owner: 'Alex Chen',
        updated: 'just now',
        lastRun: 'never',
        inputs: inputLines.map((line) => {
          const [inputName, inputType = 'text'] = line.split(':');
          return { name: inputName.trim(), type: inputType.trim(), required: true, help: '—' };
        }),
        steps: [{ kind, ref, label, detail: 'configured in the mock' }]
      };
      state.tasks.unshift(task);
      closeModal();
      renderTasks();
      renderUsage();
      openTask(task.id);
      showToast(`Task saved as draft: ${name} (mock).`);
      return;
    }

    if (type === 'rename-chat') {
      const chatId = form.dataset.renameChat;
      const title = String(data.get('title') || '').trim();
      if (!title) { showToast('A title is required.'); return; }
      const chat = state.chats.find((item) => item.id === chatId);
      if (chat) {
        chat.title = title;
        chat.updated = nowLabel();
      }
      closeModal();
      renderHistory();
      if (state.activeChatId === chatId) renderChat('preserve');
      showToast('Chat renamed (mock).');
    }
  }

  /* ---------------- MCP actions ---------------- */

  function testMCP(id) {
    const mcp = state.mcps.find((item) => item.id === id);
    if (!mcp) return;
    showToast(`Testing ${mcp.name}…`);
    setTimeout(() => {
      if (mcp.id === 'mcp-pg') {
        mcp.status = 'Error';
        mcp.lastCheck = 'just now';
        showToast('Connection failed: timeout (mock).');
      } else {
        mcp.status = 'Connected';
        mcp.lastCheck = 'just now';
        showToast(`Connection OK — ${mcp.tools.length} tools discovered (mock).`);
      }
      renderMCP();
      renderUsage();
      if (!$('#drawer').hidden) openMCP(mcp.id);
    }, 850);
  }

  function authMCP(id) {
    const mcp = state.mcps.find((item) => item.id === id);
    if (!mcp) return;
    mcp.status = 'Connected';
    mcp.lastCheck = 'just now';
    renderMCP();
    renderUsage();
    openMCP(mcp.id);
    showToast(`Authenticated ${mcp.name} (mock).`);
  }

  /* ---------------- theme ---------------- */

  function applyTheme(theme) {
    state.theme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = state.theme;
    const button = $('#theme-toggle');
    if (!button) return;
    const dark = state.theme === 'dark';
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    button.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
  }

  function toggleTheme() {
    applyTheme(state.theme === 'light' ? 'dark' : 'light');
  }

  /* ---------------- events ---------------- */

  document.addEventListener('click', (event) => {
    const target = event.target;
    const hit = (selector) => target.closest(selector);

    if (hit('#theme-toggle')) { toggleTheme(); return; }

    if (hit('[data-toggle-nav]')) {
      const open = document.body.classList.toggle('nav-open');
      hit('[data-toggle-nav]')?.setAttribute('aria-expanded', String(open));
      return;
    }

    if (document.body.classList.contains('nav-open') && !hit('#sidebar') && !hit('[data-toggle-nav]')) {
      closeSidebar();
    }

    const viewButton = hit('[data-view]');
    if (viewButton) { event.preventDefault(); navigate(viewButton.dataset.view); return; }

    if (hit('[data-open-manage]')) { openManage(); return; }
    if (hit('[data-open-context]')) { openContext(); return; }
    if (hit('[data-open-chat-actions]')) { openChatActions(state.activeChatId); return; }
    if (hit('[data-chat-actions]')) { openChatActions(hit('[data-chat-actions]').dataset.chatActions); return; }
    if (hit('[data-chat-id]')) { selectChat(hit('[data-chat-id]').dataset.chatId); return; }
    if (hit('[data-action="new-chat"]')) { newChat(); return; }
    if (hit('[data-prompt]')) {
      const input = $('#chat-input');
      if (input) {
        input.value = hit('[data-prompt]').dataset.prompt;
        resizeInput();
        input.focus();
      }
      return;
    }
    if (hit('[data-menu]')) { openMenu(hit('[data-menu]').dataset.menu); return; }
    if (hit('[data-skill-pick]')) {
      const skill = state.skills.find((item) => item.id === hit('[data-skill-pick]').dataset.skillPick);
      if (skill) {
        state.activeSkill = skill.id;
        insertAtCursor(`/${skill.name} `);
        renderComposerContext();
        renderRail();
      }
      closeMenus();
      return;
    }
    if (hit('[data-file-pick]')) {
      const file = hit('[data-file-pick]').dataset.filePick;
      state.files.push(file);
      insertAtCursor(`@${file} `);
      renderComposerContext();
      closeMenus();
      return;
    }
    if (hit('[data-remove-context]')) {
      const contextButton = hit('[data-remove-context]');
      const kind = contextButton.dataset.removeContext;
      if (kind === 'skill') { state.activeSkill = null; renderRail(); }
      if (kind === 'search') toggleSearch(false);
      if (kind === 'file') state.files.splice(Number(contextButton.dataset.fileIndex), 1);
      renderComposerContext();
      return;
    }
    if (hit('#search-toggle')) { toggleSearch(); return; }
    if (hit('#send-btn')) { sendMessage(); return; }

    if (hit('[data-skill-filter]')) {
      state.skillFilter = hit('[data-skill-filter]').dataset.skillFilter;
      renderSkillFilters();
      renderSkills();
      return;
    }
    if (hit('[data-run-filter]')) {
      state.runFilter = hit('[data-run-filter]').dataset.runFilter;
      renderRunFilters();
      renderRuns();
      return;
    }
    if (hit('[data-open-skill]')) { openSkill(hit('[data-open-skill]').dataset.openSkill); return; }
    if (hit('[data-open-mcp]')) { openMCP(hit('[data-open-mcp]').dataset.openMcp); return; }
    if (hit('[data-run-task]')) { runTask(hit('[data-run-task]').dataset.runTask); return; }
    if (hit('[data-open-task]')) { openTask(hit('[data-open-task]').dataset.openTask); return; }
    if (hit('[data-open-run]')) { openRun(hit('[data-open-run]').dataset.openRun); return; }
    if (hit('[data-open-modal]')) { openModal(hit('[data-open-modal]').dataset.openModal); return; }
    if (hit('[data-close-modal]')) { closeModal(); return; }
    if (hit('[data-close-drawer]')) { closeDrawer(); return; }

    if (hit('[data-copy-message]')) {
      const index = Number(hit('[data-copy-message]').dataset.copyMessage);
      const message = state.messages[index];
      const text = message ? stripHtml(message.body || message.text) : '';
      copyText(text).then((ok) => showToast(ok ? 'Answer copied.' : 'Copy is unavailable in this browser.'));
      return;
    }
    if (hit('[data-retry-message]')) {
      const index = Number(hit('[data-retry-message]').dataset.retryMessage);
      for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
        if (state.messages[cursor].role === 'user') {
          const input = $('#chat-input');
          if (input) {
            input.value = state.messages[cursor].text;
            resizeInput();
            input.focus();
            showToast('Prompt restored. Press Enter to send again.');
          }
          break;
        }
      }
      return;
    }

    if (hit('[data-toggle-tool]')) {
      const button = hit('[data-toggle-tool]');
      const [mcpId, toolName] = button.dataset.toggleTool.split(':');
      const mcp = state.mcps.find((item) => item.id === mcpId);
      const tool = mcp?.tools.find((item) => item.name === toolName);
      if (tool && tool.write) {
        showToast('Write-capable tools are disabled in v1 (mock).');
        return;
      }
      if (tool) {
        tool.enabled = !tool.enabled;
        button.classList.toggle('is-on', tool.enabled);
        button.setAttribute('aria-checked', String(tool.enabled));
        button.setAttribute('aria-label', `${tool.enabled ? 'Disable' : 'Enable'} ${toolName}`);
        const enabledCount = mcp.tools.filter((item) => item.enabled).length;
        const badge = $('#mcp-tools-badge');
        if (badge) badge.textContent = `${enabledCount} / ${mcp.tools.length} tools allowed`;
        showToast(`${toolName} ${tool.enabled ? 'allowed' : 'blocked'} (mock).`);
        renderMCP();
        const selector = `[data-toggle-tool="${mcpId}:${toolName}"]`;
        setTimeout(() => drawer.querySelector(selector)?.focus(), 20);
      }
      return;
    }
    if (hit('[data-test-mcp]')) { testMCP(hit('[data-test-mcp]').dataset.testMcp); return; }
    if (hit('[data-auth-mcp]')) { authMCP(hit('[data-auth-mcp]').dataset.authMcp); return; }
    if (hit('[data-test-skill]')) {
      const output = $('#skill-test-output');
      if (output) output.innerHTML = `<div class="test-output"><strong>Test passed (mock).</strong><br>Input validated against the schema. The skill returned a draft response without calling a model.</div>`;
      showToast('Skill test passed (mock).');
      return;
    }
    if (hit('[data-rerun]')) { runTask(hit('[data-rerun]').dataset.rerun); return; }
    if (hit('[data-pin-chat]')) {
      const chat = state.chats.find((item) => item.id === hit('[data-pin-chat]').dataset.pinChat);
      if (chat) {
        chat.pinned = !chat.pinned;
        closeModal();
        renderHistory();
        renderUsage();
        showToast(chat.pinned ? 'Chat pinned (mock).' : 'Chat unpinned (mock).');
      }
      return;
    }
    if (hit('[data-delete-chat]')) { confirmDeleteChat(hit('[data-delete-chat]').dataset.deleteChat); return; }
    if (hit('[data-confirm-delete-chat]')) {
      const id = hit('[data-confirm-delete-chat]').dataset.confirmDeleteChat;
      const index = state.chats.findIndex((chat) => chat.id === id);
      if (index >= 0) state.chats.splice(index, 1);
      if (state.activeChatId === id) {
        if (state.chats.length) selectChat(state.chats[0].id);
        else newChat();
      } else {
        closeModal();
        renderHistory();
      }
      renderUsage();
      showToast('Chat deleted (mock).');
      return;
    }
    if (hit('[data-audit-filter]')) {
      state.auditFilter = hit('[data-audit-filter]').dataset.auditFilter;
      renderAudit();
      return;
    }
    if (hit('[data-toast]')) { showToast(hit('[data-toast]').dataset.toast); return; }

    if (hit('#scrim')) { closeDrawer(); closeModal(); return; }
    if (!hit('#composer')) closeMenus();
  });

  document.addEventListener('submit', handleFormSubmit);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      const overlay = !$('#modal').hidden ? $('#modal') : (!$('#drawer').hidden ? $('#drawer') : null);
      if (overlay) {
        const items = focusables(overlay);
        if (items.length) {
          const first = items[0];
          const last = items[items.length - 1];
          if (!overlay.contains(document.activeElement)) {
            event.preventDefault();
            first.focus();
            return;
          }
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
            return;
          }
          if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
            return;
          }
        }
      }
    }

    if (event.key === 'Escape') {
      if (!$('#modal').hidden) { closeModal(); return; }
      if (!$('#drawer').hidden) { closeDrawer(); return; }
      closeMenus();
      closeSidebar();
      return;
    }

    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[role="button"][data-open-skill], [role="button"][data-open-mcp], [role="button"][data-open-task]')) {
      event.preventDefault();
      event.target.click();
      return;
    }

    if (event.target.id === 'chat-input') {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
        return;
      }
      if (event.key === '/' && !event.target.value) {
        event.preventDefault();
        openMenu('slash');
        return;
      }
      if (event.key === '@' && !event.target.value) {
        event.preventDefault();
        openMenu('mention');
        return;
      }
    }

    const typingTarget = event.target.matches('input, textarea, select, [contenteditable="true"]');
    const overlayOpen = !$('#modal').hidden || !$('#drawer').hidden;
    if (!typingTarget && !overlayOpen && !event.metaKey && !event.ctrlKey && !event.altKey && (event.key === 'n' || event.key === 'N')) {
      event.preventDefault();
      newChat();
    }
  });

  document.addEventListener('input', (event) => {
    if (event.target.id === 'skill-search') {
      state.skillQuery = event.target.value;
      renderSkills();
    }
    if (event.target.id === 'chat-search') {
      state.chatQuery = event.target.value;
      renderHistory();
    }
    if (event.target.id === 'audit-search') {
      state.auditQuery = event.target.value;
      renderAudit();
    }
    if (event.target.id === 'audit-period') {
      state.auditPeriod = event.target.value;
      renderAudit();
    }
    if (event.target.id === 'chat-input') {
      resizeInput();
    }
  });

  /* ---------------- init ---------------- */

  applyTheme('light');
  renderAll();
  renderChat('top');
  renderComposerContext();
  const initialView = location.hash.replace('#', '');
  navigate(viewNames[initialView] ? initialView : 'chat');
  window.addEventListener('hashchange', () => {
    const nextView = location.hash.replace('#', '');
    if (viewNames[nextView] && nextView !== state.view) navigate(nextView);
  });
})();
