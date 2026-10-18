/* =========================================================
   hound-dock clickable prototype
   Mock data only. No backend, network calls, persistence,
   dependencies, or production logic.
   ========================================================= */
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
      name: 'Confluence MCP',
      transport: 'HTTP',
      url: 'https://mcp.internal/confluence',
      auth: 'OAuth',
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
      name: 'Jira MCP',
      transport: 'HTTP',
      url: 'https://mcp.internal/jira',
      auth: 'API key',
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
      name: 'Git MCP',
      transport: 'SSE',
      url: 'https://mcp.internal/git',
      auth: 'OAuth',
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
      name: 'Postgres (read-only)',
      transport: 'HTTP',
      url: 'https://mcp.internal/pg-ro',
      auth: 'API key',
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
    { time: '2h ago', actor: 'Alex Chen', action: 'skill.publish', target: 'Release Notes Writer v3', category: 'Registry', outcome: 'Succeeded' },
    { time: '4h ago', actor: 'Priya Nair', action: 'mcp.tool.toggle', target: 'jira.create → off', category: 'Tools', outcome: 'Succeeded' },
    { time: '5h ago', actor: 'Sam Ito', action: 'task.run', target: 'Weekly Release Brief', category: 'Runs', outcome: 'Failed' },
    { time: '1d ago', actor: 'Alex Chen', action: 'run.complete', target: 'RUN-1042', category: 'Runs', outcome: 'Succeeded' },
    { time: '2d ago', actor: 'Alex Chen', action: 'mcp.register', target: 'Confluence MCP', category: 'Tools', outcome: 'Succeeded' },
    { time: '3d ago', actor: 'Priya Nair', action: 'user.invite', target: 'Sam Ito', category: 'Access', outcome: 'Succeeded' },
    { time: '5d ago', actor: 'System', action: 'secret.rotate', target: 'llm/internal-key', category: 'Access', outcome: 'Succeeded' },
    { time: '6d ago', actor: 'Sam Ito', action: 'skill.deprecate', target: 'Incident Postmortem Helper v2', category: 'Registry', outcome: 'Succeeded' }
  ];

  const state = {
    view: 'chat',
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

  const statusBadge = (status) => `<span class="status ${statusClass(status)}"><span class="dot"></span>${esc(status)}</span>`;

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
  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }

  function syncScrollLock() {
    const drawerOpen = !$('#drawer').hidden;
    const modalOpen = !$('#modal').hidden;
    document.body.style.overflow = drawerOpen || modalOpen ? 'hidden' : '';
  }

  function setScrim() {
    $('#scrim').hidden = $('#drawer').hidden && $('#modal').hidden;
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
    return [...container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
      .filter((element) => !element.disabled && element.offsetParent !== null);
  }

  /* ---------------- render: chat ---------------- */

  function toolRow(tool) {
    return `<div class="tool-call">
      <span class="dot ok"></span>
      <div class="tool-body"><code>${esc(tool.name)}</code><small>${esc(tool.input)} → ${esc(tool.output)}</small></div>
      <span class="dur">${esc(tool.duration)}</span>
    </div>`;
  }

  function renderMessage(message) {
    if (message.role === 'user') {
      return `<div class="msg msg-user"><p class="msg-role">You</p><div>${esc(message.text)}</div></div>`;
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
      ? `<div class="sources">${message.sources.map((source, index) => `<span class="source"><b>${index + 1}</b>${esc(source.kind)} · ${esc(source.label)}</span>`).join('')}</div>`
      : '';
    return `<div class="msg msg-assistant">
      <p class="msg-role">hound-dock</p>
      <div class="msg-body">${receipt}${message.body}${sources}</div>
    </div>`;
  }

  function renderChat() {
    const thread = $('#chat-thread');
    if (!thread) return;
    const activeChat = state.chats.find((chat) => chat.id === state.activeChatId);
    const title = $('#chat-title');
    if (title) title.textContent = activeChat ? activeChat.title : 'New conversation';
    const typing = state.typing
      ? `<div class="msg msg-assistant"><p class="msg-role">hound-dock</p><div class="typing"><i></i><i></i><i></i></div></div>`
      : '';
    thread.innerHTML = state.messages.map(renderMessage).join('') + typing;
    $('#chat-suggestions').hidden = state.messages.length > 0;
    thread.scrollTop = thread.scrollHeight;
    renderComposerContext();
  }

  function renderComposerContext() {
    const context = $('#composer-context');
    if (!context) return;
    const chips = [];
    if (state.activeSkill) {
      const skill = state.skills.find((item) => item.id === state.activeSkill);
      if (skill) {
        chips.push(`<span class="chip is-on">${icon('spark')} ${esc(skill.name)}
          <button type="button" class="chip-x" data-remove-context="skill" aria-label="Remove active skill">×</button></span>`);
      }
    }
    if (state.search) {
      chips.push(`<span class="chip is-on">${icon('search')} Search on
        <button type="button" class="chip-x" data-remove-context="search" aria-label="Turn off search">×</button></span>`);
    }
    state.files.forEach((file, index) => {
      chips.push(`<span class="chip">${icon('file')} ${esc(file)}
        <button type="button" class="chip-x" data-remove-context="file" data-file-index="${index}" aria-label="Remove file">×</button></span>`);
    });
    context.innerHTML = chips.join('');
  }

  function renderHistory() {
    const container = $('#chat-history');
    if (!container) return;
    const query = state.chatQuery.trim().toLowerCase();
    const searchable = (chat) => [chat.title, ...chat.messages.flatMap((message) => [message.text || '', message.body || ''])]
      .join(' ')
      .replace(/<[^>]*>/g, ' ')
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
      <button type="button" class="history-more" data-chat-actions="${chat.id}" aria-label="Actions for ${esc(chat.title)}">⋯</button>
    </div>`;
    const section = (label, chats) => chats.length ? `<div class="history-group">
        <p class="history-label">${label}</p>
        ${chats.map(row).join('')}
      </div>` : '';
    const sections = [
      section('Pinned', pinned),
      ...groups.map((group) => section(group, visible.filter((chat) => !chat.pinned && chat.group === group)))
    ].join('');
    container.innerHTML = sections || `<p class="small muted" style="padding:8px">No chats match.</p>`;
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
    renderChat();
    renderHistory();
    const input = $('#chat-input');
    if (input) {
      input.value = '';
      input.focus();
    }
  }

  /* ---------------- render: skills ---------------- */

  function renderSkillFilters() {
    const categories = ['All', ...new Set(state.skills.map((skill) => skill.category))];
    $('#skill-filters').innerHTML = categories.map((category) => `
      <button type="button" class="filter-chip ${state.skillFilter === category ? 'is-active' : ''}" data-skill-filter="${esc(category)}">${esc(category)}</button>
    `).join('');
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
    if (!skills.length) {
      grid.innerHTML = `<div class="empty-state">No skills match this filter. Try “All” or a shorter search.</div>`;
      return;
    }
    grid.innerHTML = skills.map((skill, index) => `
      <article class="skill-card" data-open-skill="${skill.id}" data-status="${esc(skill.status)}" tabindex="0" role="button" aria-label="Open ${esc(skill.name)}" style="--i:${index}">
        <div class="skill-card-top">
          <div><span class="skill-cat">${esc(skill.category)}</span><h3 class="skill-name">${esc(skill.name)}</h3></div>
          ${statusBadge(skill.status)}
        </div>
        <p class="skill-desc">${esc(skill.description)}</p>
        <div class="dep-chips">${(skill.deps || []).map((dep) => `<span class="dep">${esc(dep)}</span>`).join('')}</div>
        <div class="skill-meta"><span><b>${esc(skill.version)}</b></span><span>${esc(skill.owner)}</span><span>Updated ${esc(skill.updated)}</span></div>
      </article>
    `).join('');
  }

  /* ---------------- render: MCP ---------------- */

  function renderMCP() {
    const grid = $('#mcp-grid');
    if (!grid) return;
    grid.innerHTML = state.mcps.map((mcp, index) => {
      const allowed = mcp.tools.filter((tool) => tool.enabled).length;
      return `<article class="mcp-card" data-open-mcp="${mcp.id}" tabindex="0" role="button" aria-label="Open ${esc(mcp.name)}" style="--i:${index}">
        <div class="mcp-card-top">
          <div><span class="skill-cat">${esc(mcp.transport)} · ${esc(mcp.auth)}</span><h3>${esc(mcp.name)}</h3></div>
          ${statusBadge(mcp.status)}
        </div>
        <p class="mcp-endpoint">${esc(mcp.url)}</p>
        <div class="mcp-meta"><span><b>${allowed}</b> / ${mcp.tools.length} tools allowed</span><span>Last check ${esc(mcp.lastCheck)}</span></div>
      </article>`;
    }).join('');
  }

  /* ---------------- render: tasks ---------------- */

  function renderTasks() {
    const grid = $('#task-grid');
    if (!grid) return;
    grid.innerHTML = state.tasks.map((task, index) => `
      <article class="task-card" data-open-task="${task.id}" tabindex="0" role="button" aria-label="Open ${esc(task.name)}" style="--i:${index}">
        <div class="mcp-card-top">
          <div><span class="skill-cat">${esc(task.status)} · ${esc(task.version)}</span><h3>${esc(task.name)}</h3></div>
          ${statusBadge(task.status)}
        </div>
        <p>${esc(task.description)}</p>
        <div class="steps-preview">${task.steps.map((step, stepIndex) => `<span class="step-pill"><i>${stepIndex + 1}</i>${step.kind === 'skill' ? 'Skill' : 'MCP'} · ${esc(step.label)}</span>`).join('')}</div>
        <div class="task-foot"><span>${esc(task.owner)}</span><span>Last run ${esc(task.lastRun)}</span></div>
      </article>
    `).join('');
    const dailyCount = $('#daily-task-count');
    if (dailyCount) dailyCount.textContent = String(state.tasks.filter((task) => task.status === 'Published').length);
  }

  /* ---------------- render: runs ---------------- */

  function renderRunFilters() {
    const statuses = ['All', 'Succeeded', 'Running', 'Failed'];
    $('#run-filters').innerHTML = statuses.map((status) => `
      <button type="button" class="filter-chip ${state.runFilter === status ? 'is-active' : ''}" data-run-filter="${status}">${status}</button>
    `).join('');
  }

  function visibleRuns() {
    return state.runs.filter((run) => state.runFilter === 'All' || run.status === state.runFilter);
  }

  function renderRuns() {
    const ledger = $('#runs-table');
    if (!ledger) return;
    const runs = visibleRuns();
    $('#run-count').textContent = `${runs.length} shown · ${state.runs.length} total`;
    if (!runs.length) {
      ledger.innerHTML = `<div class="ledger-empty">No runs match this filter.</div>`;
      return;
    }
    ledger.innerHTML = `
      <div class="ledger-head"><span>Run</span><span>Task</span><span>User</span><span>Status</span><span>Duration</span><span>Started</span></div>
      ${runs.map((run, index) => `
        <div class="ledger-row" data-open-run="${run.id}" tabindex="0" role="button" aria-label="Open ${run.id}" style="--i:${index}">
          <span class="run-id">${run.id}</span>
          <span class="run-task">${esc(run.task)}<small>${run.steps.length} steps · ${esc(run.tokens)} tokens</small></span>
          <span class="run-user">${esc(run.user)}</span>
          ${statusBadge(run.status)}
          <span class="run-dur">${esc(run.duration)}</span>
          <span class="run-dur">${esc(run.started)}</span>
        </div>
      `).join('')}
    `;
  }


  /* ---------------- render: audit ---------------- */

  function renderAudit() {
    const body = $('#audit-body');
    if (!body) return;
    const categories = ['All', 'Registry', 'Tools', 'Runs', 'Access'];
    const filters = $('#audit-filters');
    if (filters) {
      filters.innerHTML = categories.map((category) => `
        <button type="button" class="filter-chip ${state.auditFilter === category ? 'is-active' : ''}" data-audit-filter="${category}">${category}</button>
      `).join('');
    }
    const events = AUDIT.filter((event) => state.auditFilter === 'All' || event.category === state.auditFilter);
    const count = $('#audit-count');
    if (count) count.textContent = `${events.length} events · append-only`;
    body.innerHTML = events.length
      ? events.map((event) => `<tr>
          <td class="mono">${esc(event.time)}</td>
          <td>${esc(event.actor)}</td>
          <td><code>${esc(event.action)}</code></td>
          <td>${esc(event.target)}</td>
          <td>${statusBadge(event.outcome)}</td>
        </tr>`).join('')
      : `<tr><td colspan="5" class="muted" style="text-align:center;padding:24px">No events match this filter.</td></tr>`;
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
    const crumb = view === 'chat' ? 'Chat' : view === 'tasks' ? 'Tasks' : `Manage · ${viewNames[view]}`;
    $('#crumb-current').textContent = crumb;
    $$('.daily-link').forEach((link) => link.classList.toggle('is-active', link.dataset.view === view));
    const back = $('#back-to-chat');
    if (back) back.hidden = view === 'chat';
    document.body.classList.remove('nav-open');
    closeDrawer(true);
    closeModal(true);
    closeMenus();
    window.scrollTo({ top: 0, behavior: 'auto' });
    try { history.replaceState(null, '', `#${view}`); } catch (error) { /* file:// can reject replaceState */ }
    if (view === 'chat') renderHistory();
    if (view === 'tasks') renderTasks();
    if (view === 'skills') { renderSkillFilters(); renderSkills(); }
    if (view === 'runs') renderRuns();
    if (view === 'audit') renderAudit();
    if (view === 'usage') renderUsage();
  }

  /* ---------------- drawer ---------------- */

  const drawer = $('#drawer');

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
      drawer.innerHTML = '';
      restoreFocus();
    } else {
      setTimeout(() => {
        if (!drawer.classList.contains('is-open')) {
          drawer.hidden = true;
          drawer.innerHTML = '';
          setScrim();
          syncScrollLock();
          restoreFocus();
        }
      }, 250);
    }
    setScrim();
    syncScrollLock();
  }

  function drawerHead(kicker, title, subtitle, badge = '') {
    return `<div class="drawer-head">
      <div>
        <p class="kicker">${kicker}</p>
        <h2 class="drawer-title">${esc(title)}</h2>
        <p class="small muted">${subtitle}</p>
      </div>
      <button type="button" class="icon-btn drawer-close" data-close-drawer aria-label="Close panel">${icon('close')}</button>
    </div>
    ${badge ? `<div class="chip-row">${badge}</div>` : ''}`;
  }

  function openSkill(id) {
    const skill = state.skills.find((item) => item.id === id);
    if (!skill) return;
    openDrawer(`
      ${drawerHead('Skill', skill.name, `${esc(skill.category)} · ${esc(skill.version)} · ${esc(skill.owner)}`, `${statusBadge(skill.status)}<span class="chip">Updated ${esc(skill.updated)}</span>`)}
      <p class="drawer-desc">${esc(skill.description)}</p>
      <section class="drawer-section">
        <h3>Instructions</h3>
        <pre class="manifest">${esc(skill.instructions)}</pre>
      </section>
      <section class="drawer-section">
        <h3>Inputs</h3>
        <table class="mini-table">
          <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Help</th></tr></thead>
          <tbody>${(skill.inputs || []).map((input) => `<tr><td><code>${esc(input.name)}</code></td><td>${esc(input.type)}</td><td>${input.required ? 'Yes' : 'No'}</td><td>${esc(input.help || '—')}</td></tr>`).join('') || '<tr><td colspan="4">No inputs defined.</td></tr>'}</tbody>
        </table>
      </section>
      <section class="drawer-section">
        <h3>Dependencies</h3>
        <div class="dep-chips">${(skill.deps || []).map((dep) => `<span class="dep">${esc(dep)}</span>`).join('') || '<span class="muted small">None</span>'}</div>
      </section>
      <section class="drawer-section">
        <h3>Versions</h3>
        <ul class="tool-list">${(skill.versions || []).map((version) => `<li><span class="dot ok"></span><code>${esc(version)}</code></li>`).join('')}</ul>
      </section>
      <section class="drawer-section">
        <h3>Test this skill</h3>
        <div class="test-box">
          <textarea id="skill-test-input" placeholder="Sample input, e.g. week=2026-10-12, project=Platform"></textarea>
          <button type="button" class="btn" data-test-skill="${skill.id}">${icon('play')} Run test</button>
          <div id="skill-test-output"></div>
        </div>
      </section>
      <div class="drawer-actions">
        <button type="button" class="btn btn-primary" data-toast="Publishing a new version is a mock in this prototype.">Publish new version</button>
        <button type="button" class="btn" data-toast="Duplicating a skill is a mock in this prototype.">Duplicate</button>
      </div>
    `);
  }

  function openMCP(id) {
    const mcp = state.mcps.find((item) => item.id === id);
    if (!mcp) return;
    const allowed = mcp.tools.filter((tool) => tool.enabled).length;
    openDrawer(`
      ${drawerHead('MCP server', mcp.name, `${esc(mcp.transport)} · ${esc(mcp.auth)} · last check ${esc(mcp.lastCheck)}`, `${statusBadge(mcp.status)}<span class="chip">${allowed} / ${mcp.tools.length} tools allowed</span>`)}
      <dl class="kv">
        <div><dt>Endpoint</dt><dd><code>${esc(mcp.url)}</code></dd></div>
        <div><dt>Transport</dt><dd>${esc(mcp.transport)}</dd></div>
        <div><dt>Authentication</dt><dd>${esc(mcp.auth)} · stored as an encrypted reference</dd></div>
        <div><dt>Health</dt><dd>${esc(mcp.status)} · ${esc(mcp.lastCheck)}</dd></div>
      </dl>
      <section class="drawer-section">
        <h3>Tool allowlist</h3>
        ${mcp.tools.length ? mcp.tools.map((tool) => `
          <div class="tool-toggle">
            <div><code>${esc(tool.name)}</code><small>${esc(tool.desc)}${tool.write ? ' · write' : ' · read-only'}</small></div>
            <button type="button" class="toggle ${tool.enabled ? 'is-on' : ''}" data-toggle-tool="${mcp.id}:${tool.name}" aria-pressed="${tool.enabled}" aria-label="${tool.enabled ? 'Disable' : 'Enable'} ${esc(tool.name)}"></button>
          </div>
        `).join('') : `<p class="small muted">No tools discovered yet. Test the connection first.</p>`}
      </section>
      <div class="drawer-actions">
        <button type="button" class="btn btn-primary" data-test-mcp="${mcp.id}">${icon('refresh')} Test connection</button>
        ${mcp.status === 'Needs auth' ? `<button type="button" class="btn" data-auth-mcp="${mcp.id}">Authenticate</button>` : ''}
        <button type="button" class="btn" data-toast="Saving the server is a mock in this prototype.">Save changes</button>
      </div>
      <p class="small muted" style="margin-top:14px">Write-capable tools are disabled in v1. Enabling one requires a future approval flow.</p>
    `);
  }

  function openTask(id) {
    const task = state.tasks.find((item) => item.id === id);
    if (!task) return;
    openDrawer(`
      ${drawerHead('Task', task.name, `${esc(task.version)} · ${esc(task.owner)} · last run ${esc(task.lastRun)}`, `${statusBadge(task.status)}<span class="chip">${task.steps.length} steps</span>`)}
      <p class="drawer-desc">${esc(task.description)}</p>
      <section class="drawer-section">
        <h3>Inputs</h3>
        <table class="mini-table">
          <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Help</th></tr></thead>
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
      <div class="drawer-actions">
        <button type="button" class="btn btn-primary" data-run-task="${task.id}">${icon('play')} Test run</button>
        <button type="button" class="btn" data-toast="Publishing a task version is a mock in this prototype.">Publish</button>
        <button type="button" class="btn" data-toast="Editing steps is a mock in this prototype.">Edit steps</button>
      </div>
      <p class="small muted" style="margin-top:14px">Manual runs only. Scheduling, approvals, and branching are out of scope for v1.</p>
    `);
  }

  function openRun(id) {
    const run = state.runs.find((item) => item.id === id);
    if (!run) return;
    const marker = (status) => status === 'Succeeded' ? '✓' : status === 'Running' ? '…' : status === 'Failed' ? '!' : '·';
    openDrawer(`
      ${drawerHead('Run', run.task, `${esc(run.id)} · ${esc(run.user)} · ${esc(run.started)}`, `${statusBadge(run.status)}<span class="chip">${esc(run.duration)}</span>`)}
      <dl class="kv">
        <div><dt>Run ID</dt><dd><code>${esc(run.id)}</code></dd></div>
        <div><dt>Task</dt><dd>${esc(run.task)}</dd></div>
        <div><dt>Started by</dt><dd>${esc(run.user)}</dd></div>
        <div><dt>Tokens / cost</dt><dd>${esc(run.tokens)} · ${esc(run.cost)}</dd></div>
      </dl>
      <section class="drawer-section">
        <h3>Timeline</h3>
        <ol class="timeline">
          ${run.steps.map((step) => `
            <li class="timeline-step ${statusClass(step.status)}">
              <span class="timeline-marker">${marker(step.status)}</span>
              <div class="timeline-body">
                <strong>${esc(step.name)}</strong>
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
      </section>
      <div class="drawer-actions">
        <button type="button" class="btn btn-primary" data-rerun="${run.taskId}">${icon('refresh')} Re-run task</button>
        <button type="button" class="btn" data-close-drawer>Close</button>
      </div>
    `);
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
          { view: 'usage', icon: 'spark', title: 'Usage', desc: 'Adoption, tokens, and spend', meta: 'Last 30 days' },
          { view: 'audit', icon: 'shield', title: 'Audit', desc: 'Registry, tool, run, and access events', meta: 'Append-only' }
        ]
      },
      {
        label: 'Configuration',
        rows: [
          { view: 'admin', icon: 'admin', title: 'Settings', desc: 'Accounts, model gateway, and policy', meta: 'MVP settings' }
        ]
      }
    ];
    const rowHtml = (row) => `<button type="button" class="manage-row" data-view="${row.view}">
      <span class="manage-icon">${icon(row.icon)}</span>
      <span><strong>${row.title}</strong><small>${row.desc} · ${row.meta}</small></span>
      <span class="manage-chevron-row">→</span>
    </button>`;
    openDrawer(`
      ${drawerHead('Workspace', 'Manage.', 'Registries, operations, and settings — occasional configuration.', '')}
      <p class="drawer-desc">The daily flow stays in chat and Tasks. Open Manage only when you need to configure or inspect the workspace.</p>
      <div class="manage-list">
        ${sections.map((section) => `<div class="manage-section">
          <p class="manage-section-label">${section.label}</p>
          ${section.rows.map(rowHtml).join('')}
        </div>`).join('')}
      </div>
      <p class="small muted" style="margin-top:16px">All registry changes are audited. Write-capable tools are disabled in v1.</p>
    `);
  }

  /* ---------------- modal ---------------- */

  const modal = $('#modal');

  function closeModal(immediate = false) {
    if (modal.hidden) return;
    modal.hidden = true;
    modal.innerHTML = '';
    setScrim();
    syncScrollLock();
    restoreFocus();
  }

  function modalShell(kicker, title, subtitle, body) {
    return `<div class="modal-head">
      <div><p class="kicker">${kicker}</p><h2 class="modal-title" id="modal-title">${title}</h2><p class="modal-sub">${subtitle}</p></div>
      <button type="button" class="icon-btn" data-close-modal aria-label="Close dialog">${icon('close')}</button>
    </div>${body}`;
  }

  function showModal(html) {
    if (modal.hidden) rememberFocus();
    modal.innerHTML = html;
    modal.hidden = false;
    $('#scrim').hidden = false;
    syncScrollLock();
    setTimeout(() => modal.querySelector('input, textarea, select, button')?.focus(), 30);
  }

  function openChatActions(id) {
    const chat = state.chats.find((item) => item.id === id);
    if (!chat) return;
    showModal(modalShell('Chat', 'Chat actions.', 'Rename, pin, or delete this conversation.', `
      <form data-form="rename-chat" data-chat-id="${chat.id}">
        <div class="field"><label for="chat-rename">Title</label><input id="chat-rename" name="title" required value="${esc(chat.title)}"></div>
        <div class="form-actions">
          <button type="button" class="btn" data-close-modal>Cancel</button>
          <button type="submit" class="btn btn-primary">Save title</button>
        </div>
      </form>
      <div class="drawer-actions" style="margin-top:16px;border-top:1px solid var(--line);padding-top:14px">
        <button type="button" class="btn" data-pin-chat="${chat.id}">${chat.pinned ? 'Unpin' : 'Pin'} chat</button>
        <button type="button" class="btn btn-danger" data-delete-chat="${chat.id}">Delete chat</button>
      </div>
    `));
  }

  function confirmDeleteChat(id) {
    const chat = state.chats.find((item) => item.id === id);
    if (!chat) return;
    showModal(modalShell('Chat', 'Delete this chat?', 'This is a mock; the conversation disappears from history.', `
      <p class="drawer-desc">“${esc(chat.title)}” will be removed from the prototype.</p>
      <div class="form-actions">
        <button type="button" class="btn" data-close-modal>Cancel</button>
        <button type="button" class="btn btn-danger" data-confirm-delete-chat="${chat.id}">Delete chat</button>
      </div>
    `));
  }

  const toolOptions = () => state.mcps.flatMap((mcp) => mcp.tools.map((tool) => ({ mcp, tool })));

  function openModal(type) {
    if (type === 'skill') {
      modal.innerHTML = modalShell('Registry / New skill', 'Draft a skill.', 'Prompt-only in v1; no code execution.', `
        <form data-form="skill">
          <div class="field"><label for="skill-name">Name</label><input id="skill-name" name="name" required placeholder="e.g. Release Notes Writer"></div>
          <div class="field"><label for="skill-desc">Description</label><input id="skill-desc" name="description" required placeholder="What does it do, in one sentence?"></div>
          <div class="field-row">
            <div class="field"><label for="skill-category">Category</label><select id="skill-category" name="category"><option>Engineering</option><option>Ops</option><option>Docs</option><option>Analytics</option></select></div>
            <div class="field"><label for="skill-version">Initial version</label><input id="skill-version" name="version" value="v1" readonly></div>
          </div>
          <div class="field"><label for="skill-instructions">Instructions</label><textarea id="skill-instructions" name="instructions" placeholder="Write the operating instructions, constraints, and output format…"></textarea></div>
          <div class="field"><label for="skill-schema">Input schema (optional JSON)</label><textarea id="skill-schema" name="schema" placeholder='{"type":"object","properties":{}}'></textarea></div>
          <div class="field"><label>Allowed MCP tools</label>
            <div class="check-grid">${toolOptions().map(({ mcp, tool }) => `<label><input type="checkbox" name="deps" value="${esc(tool.name)}"> <span>${esc(tool.name)}</span> <small>${esc(mcp.name)}</small></label>`).join('')}</div>
          </div>
          <p class="form-note">Skills are prompt-only in v1. Code execution and write-capable tools are out of scope (TBD-BIZ-007).</p>
          <div class="form-actions">
            <button type="button" class="btn" data-close-modal>Cancel</button>
            <button type="submit" class="btn" name="intent" value="draft">Save draft</button>
            <button type="submit" class="btn btn-primary" name="intent" value="publish">Publish</button>
          </div>
        </form>
      `);
    } else if (type === 'mcp') {
      modal.innerHTML = modalShell('Registry / Add MCP', 'Connect a server.', 'HTTP or SSE. Credentials are referenced, never pasted.', `
        <form data-form="mcp">
          <div class="field"><label for="mcp-name">Display name</label><input id="mcp-name" name="name" required placeholder="e.g. Confluence MCP"></div>
          <div class="field"><label for="mcp-url">Endpoint URL</label><input id="mcp-url" name="url" required placeholder="https://mcp.internal/your-server"></div>
          <div class="field-row">
            <div class="field"><label for="mcp-transport">Transport</label><select id="mcp-transport" name="transport"><option>HTTP</option><option>SSE</option></select></div>
            <div class="field"><label for="mcp-auth">Authentication</label><select id="mcp-auth" name="auth"><option>OAuth</option><option>API key</option></select></div>
          </div>
          <div class="field"><label for="mcp-secret">Secret reference</label><input id="mcp-secret" name="secret" placeholder="secret://mcp/your-server"><small class="muted">Never paste a secret value into this form.</small></div>
          <p class="form-note">Only tools you explicitly allowlist become callable. Write tools stay off in v1.</p>
          <div class="form-actions">
            <button type="button" class="btn" data-close-modal>Cancel</button>
            <button type="button" class="btn" data-toast="Connection test completed (mock). Tools would appear after authentication.">Test connection</button>
            <button type="submit" class="btn btn-primary">Save server</button>
          </div>
        </form>
      `);
    } else if (type === 'task') {
      const stepOptions = [
        ...state.skills.filter((skill) => skill.status === 'Published').map((skill) => `<option value="skill:${skill.id}">Skill · ${esc(skill.name)}</option>`),
        ...state.mcps.flatMap((mcp) => mcp.tools.filter((tool) => tool.enabled && !tool.write).map((tool) => `<option value="mcp:${esc(tool.name)}">MCP · ${esc(tool.name)} (${esc(mcp.name)})</option>`))
      ].join('');
      modal.innerHTML = modalShell('Registry / New task', 'Compose a task.', 'Linear steps only in v1. No branching or scheduling.', `
        <form data-form="task">
          <div class="field"><label for="task-name">Name</label><input id="task-name" name="name" required placeholder="e.g. Weekly Release Brief"></div>
          <div class="field"><label for="task-desc">Description</label><input id="task-desc" name="description" required placeholder="What should this task produce?"></div>
          <div class="field"><label for="task-inputs">Inputs (one per line, name:type)</label><textarea id="task-inputs" name="inputs" placeholder="week:date&#10;project:select"></textarea></div>
          <div class="field"><label for="task-step">First step</label><select id="task-step" name="step">${stepOptions}</select></div>
          <p class="form-note">Manual runs only. You can add more steps after saving in a future version (mock).</p>
          <div class="form-actions">
            <button type="button" class="btn" data-close-modal>Cancel</button>
            <button type="submit" class="btn btn-primary">Save draft</button>
          </div>
        </form>
      `);
    }
    if (modal.hidden) rememberFocus();
    modal.hidden = false;
    $('#scrim').hidden = false;
    syncScrollLock();
    setTimeout(() => {
      const focusable = modal.querySelector('input, textarea, select, button');
      if (focusable) focusable.focus();
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
          <p style="padding:9px 11px;border-left:2px solid var(--accent);background:var(--teal-bg);font-size:12px">${esc(text)}</p>
          <ul><li>The skill would call its declared dependencies and keep the output within the manifest schema.</li><li>Read-only tools are enabled; write actions stay disabled in v1.</li><li>The full tool trace is shown above.</li></ul>
          <p>Replace this mock with a real model call only after the stack decision and the MCP proof.</p>`
      };
    }
    return {
      role: 'assistant',
      tools,
      body: `<p>Here is a mock answer to:</p>
        <p style="padding:9px 11px;border-left:2px solid var(--accent);background:var(--teal-bg);font-size:12px">${esc(text)}</p>
        <p>The prototype does not call a model. In the real product this response would be grounded in the enabled skills and MCP tools, and the run would appear in the ledger.</p>
        <ul><li>Try selecting a skill with <code>/</code>, attaching a file with <code>@</code>, or turning on Search.</li><li>Then open Skills or MCP to inspect the registries.</li></ul>`
    };
  }

  function sendMessage() {
    const input = $('#chat-input');
    const text = input.value.trim();
    if (!text || state.typing) return;
    const activeChat = state.chats.find((chat) => chat.id === state.activeChatId);
    const firstUserMessage = !state.messages.some((message) => message.role === 'user');
    state.messages.push({ role: 'user', text });
    if (activeChat) {
      activeChat.updated = 'now';
      if (firstUserMessage && activeChat.title === 'New conversation') {
        activeChat.title = text.length > 48 ? `${text.slice(0, 48)}…` : text;
      }
      renderHistory();
    }
    const chatId = state.activeChatId;
    const reply = mockReply(text);
    input.value = '';
    state.typing = true;
    renderChat();
    setTimeout(() => {
      const targetChat = state.chats.find((chat) => chat.id === chatId);
      if (targetChat) {
        targetChat.messages.push(reply);
        targetChat.updated = 'now';
      }
      if (state.activeChatId === chatId) {
        state.typing = false;
        if (targetChat) state.messages = targetChat.messages;
        renderChat();
      }
      renderHistory();
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
    showToast('New mock conversation.');
  }

  function insertAtCursor(text) {
    const input = $('#chat-input');
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    input.value = `${input.value.slice(0, start)}${text}${input.value.slice(end)}`;
    input.focus();
    input.selectionStart = input.selectionEnd = start + text.length;
  }

  function toggleSearch(force) {
    state.search = typeof force === 'boolean' ? force : !state.search;
    const button = $('#search-toggle');
    button.classList.toggle('is-on', state.search);
    button.setAttribute('aria-pressed', String(state.search));
    renderComposerContext();
  }

  function closeMenus() {
    $('#slash-menu').hidden = true;
    $('#mention-menu').hidden = true;
  }

  function openMenu(type) {
    closeMenus();
    if (type === 'slash') {
      const items = state.skills.filter((skill) => skill.status === 'Published');
      $('#slash-items').innerHTML = items.map((skill) => `<button type="button" class="popover-item" data-skill-pick="${skill.id}">${esc(skill.name)}<small>${esc(skill.category)} · ${esc(skill.version)}</small></button>`).join('');
      $('#slash-menu').hidden = false;
      $('#chat-input').focus();
    } else {
      $('#mention-items').innerHTML = FILES.map((file) => `<button type="button" class="popover-item" data-file-pick="${esc(file)}">${esc(file)}<small>Workspace file · mock</small></button>`).join('');
      $('#mention-menu').hidden = false;
      $('#chat-input').focus();
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
    navigate('runs');
    showToast('Run started (mock).');
    setTimeout(() => {
      run.status = 'Succeeded';
      run.duration = '1m 08s';
      run.tokens = '11.2k';
      run.cost = '$0.27';
      run.artifacts = ['task-output.md'];
      run.steps = run.steps.map((step) => ({ ...step, status: 'Succeeded', duration: '21s', detail: 'Step completed' }));
      renderRuns();
      openRun(run.id);
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
      openSkill(skill.id);
      showToast(`${status === 'Published' ? 'Published' : 'Draft saved'}: ${name} (mock).`);
      return;
    }

    if (type === 'mcp') {
      const name = String(data.get('name') || '').trim();
      const url = String(data.get('url') || '').trim();
      if (!name || !url) { showToast('Name and endpoint URL are required.'); return; }
      const mcp = {
        id: `mcp-${Date.now()}`,
        name,
        transport: String(data.get('transport') || 'HTTP'),
        url,
        auth: String(data.get('auth') || 'OAuth'),
        status: 'Needs auth',
        lastCheck: 'never',
        tools: []
      };
      state.mcps.unshift(mcp);
      closeModal();
      renderMCP();
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
        steps: [{ kind, ref: kind === 'skill' ? ref : ref, label, detail: 'configured in the mock' }]
      };
      state.tasks.unshift(task);
      closeModal();
      renderTasks();
      openTask(task.id);
      showToast(`Task saved as draft: ${name} (mock).`);
      return;
    }

    if (type === 'rename-chat') {
      const chatId = form.dataset.chatId;
      const title = String(data.get('title') || '').trim();
      if (!title) { showToast('A title is required.'); return; }
      const chat = state.chats.find((item) => item.id === chatId);
      if (chat) {
        chat.title = title;
        chat.updated = 'now';
      }
      closeModal();
      renderHistory();
      if (state.activeChatId === chatId) renderChat();
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
      if (!$('#drawer').hidden) openMCP(mcp.id);
    }, 850);
  }

  function authMCP(id) {
    const mcp = state.mcps.find((item) => item.id === id);
    if (!mcp) return;
    mcp.status = 'Connected';
    mcp.lastCheck = 'just now';
    renderMCP();
    openMCP(mcp.id);
    showToast(`Authenticated ${mcp.name} (mock).`);
  }

  /* ---------------- events ---------------- */

  document.addEventListener('click', (event) => {
    const target = event.target;
    const hit = (selector) => target.closest(selector);

    const viewButton = hit('[data-view]');
    if (viewButton) { event.preventDefault(); navigate(viewButton.dataset.view); return; }

    if (hit('[data-toggle-nav]')) { document.body.classList.toggle('nav-open'); return; }
    if (hit('[data-open-manage]')) { openManage(); return; }
    if (hit('[data-chat-actions]')) { openChatActions(hit('[data-chat-actions]').dataset.chatActions); return; }
    if (hit('[data-chat-id]')) { selectChat(hit('[data-chat-id]').dataset.chatId); return; }
    if (hit('[data-action="new-chat"]')) { newChat(); return; }
    if (hit('[data-prompt]')) {
      const prompt = hit('[data-prompt]').dataset.prompt;
      $('#chat-input').value = prompt;
      $('#chat-input').focus();
      return;
    }
    if (hit('[data-menu]')) { openMenu(hit('[data-menu]').dataset.menu); return; }
    if (hit('[data-skill-pick]')) {
      const skill = state.skills.find((item) => item.id === hit('[data-skill-pick]').dataset.skillPick);
      if (skill) {
        state.activeSkill = skill.id;
        insertAtCursor(`/${skill.name} `);
        renderComposerContext();
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
      const kind = hit('[data-remove-context]').dataset.removeContext;
      if (kind === 'skill') state.activeSkill = null;
      if (kind === 'search') toggleSearch(false);
      if (kind === 'file') state.files.splice(Number(hit('[data-remove-context]').dataset.fileIndex), 1);
      renderComposerContext();
      return;
    }
    if (hit('#search-toggle')) { toggleSearch(); return; }
    if (hit('#send-btn')) { sendMessage(); return; }

    if (hit('[data-skill-filter]')) {
      state.skillFilter = hit('[data-skill-filter]').dataset.skillFilter;
      renderSkillFilters(); renderSkills(); return;
    }
    if (hit('[data-run-filter]')) {
      state.runFilter = hit('[data-run-filter]').dataset.runFilter;
      renderRunFilters(); renderRuns(); return;
    }
    if (hit('[data-open-skill]')) { openSkill(hit('[data-open-skill]').dataset.openSkill); return; }
    if (hit('[data-open-mcp]')) { openMCP(hit('[data-open-mcp]').dataset.openMcp); return; }
    if (hit('[data-open-task]')) { openTask(hit('[data-open-task]').dataset.openTask); return; }
    if (hit('[data-open-run]')) { openRun(hit('[data-open-run]').dataset.openRun); return; }
    if (hit('[data-open-modal]')) { openModal(hit('[data-open-modal]').dataset.openModal); return; }
    if (hit('[data-close-modal]')) { closeModal(); return; }
    if (hit('[data-close-drawer]')) { closeDrawer(); return; }
    if (hit('[data-toggle-tool]')) {
      const button = hit('[data-toggle-tool]');
      const [mcpId, toolName] = button.dataset.toggleTool.split(':');
      const mcp = state.mcps.find((item) => item.id === mcpId);
      const tool = mcp?.tools.find((item) => item.name === toolName);
      if (tool) {
        tool.enabled = !tool.enabled;
        button.classList.toggle('is-on', tool.enabled);
        button.setAttribute('aria-pressed', String(tool.enabled));
        showToast(`${toolName} ${tool.enabled ? 'allowed' : 'blocked'} (mock).`);
        renderMCP();
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
    if (hit('[data-run-task]')) { runTask(hit('[data-run-task]').dataset.runTask); return; }
    if (hit('[data-rerun]')) { runTask(hit('[data-rerun]').dataset.rerun); return; }
    if (hit('[data-pin-chat]')) {
      const chat = state.chats.find((item) => item.id === hit('[data-pin-chat]').dataset.pinChat);
      if (chat) {
        chat.pinned = !chat.pinned;
        closeModal();
        renderHistory();
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
      document.body.classList.remove('nav-open');
      return;
    }

    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[role="button"][data-open-skill], [role="button"][data-open-mcp], [role="button"][data-open-task], [role="button"][data-open-run]')) {
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
      }
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
  });

  /* ---------------- init ---------------- */

  renderAll();
  renderComposerContext();
  const initialView = location.hash.replace('#', '');
  navigate(viewNames[initialView] ? initialView : 'chat');
  window.addEventListener('hashchange', () => {
    const nextView = location.hash.replace('#', '');
    if (viewNames[nextView] && nextView !== state.view) navigate(nextView);
  });
})();
