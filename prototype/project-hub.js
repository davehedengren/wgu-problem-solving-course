// ============================================================
// My Project Hub — Persistent project state across the course
//
// Stores: problem statement, platform choice, deploy URL,
// iteration log, and wizard conversation history.
// ============================================================

const ProjectHub = (() => {
  const STORAGE_KEY = 'wgu-my-project';

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultProject();
    } catch { return defaultProject(); }
  }

  function defaultProject() {
    return {
      problemStatement: '',
      evalScores: { people: 1, frequency: 0, severity: 0, solvability: 0 },
      targetUser: '',
      mvpFeatures: [],
      platform: '',       // 'lovable' | 'replit' | 'other'
      platformUrl: '',    // their project editor URL
      deployUrl: '',      // live deployed URL
      deployedAt: null,   // timestamp of first deploy
      iterations: [],     // [{date, note, type:'feedback'|'feature'|'fix'}]
      wizardHistory: {},  // keyed by moduleId: [{role, content}]
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  function save(project) {
    project.updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  }

  function get() { return load(); }

  function update(changes) {
    const project = load();
    Object.assign(project, changes);
    save(project);
    return project;
  }

  // ==================== WIZARD HISTORY ====================

  function saveWizardHistory(moduleId, messages) {
    const project = load();
    project.wizardHistory[moduleId] = messages;

    // Auto-extract problem statement from the latest wizard conversation
    // (the LLM often helps students formulate one)
    save(project);
  }

  function getWizardHistory(moduleId) {
    const project = load();
    return project.wizardHistory[moduleId] || null;
  }

  function getAllWizardHistory() {
    const project = load();
    return project.wizardHistory;
  }

  // ==================== ITERATIONS ====================

  function addIteration(note, type) {
    const project = load();
    project.iterations.push({
      date: new Date().toISOString(),
      note,
      type: type || 'feature'
    });
    save(project);
    return project;
  }

  // ==================== DEPLOY TRACKING ====================

  function setDeployUrl(url) {
    const project = load();
    project.deployUrl = url;
    if (!project.deployedAt) {
      project.deployedAt = Date.now();
    }
    save(project);
    return project;
  }

  // ==================== RENDER ====================

  function render() {
    const project = load();
    const container = document.getElementById('project-hub-content');
    if (!container) return;

    const hasProject = project.problemStatement || project.deployUrl || project.platform;
    const iterationCount = project.iterations.length;
    const wizardModules = Object.keys(project.wizardHistory);

    container.innerHTML = `
      <div class="project-hub">

        <!-- Problem Statement Card -->
        <div class="hub-card">
          <div class="hub-card-header">
            <h3>Problem Statement</h3>
            ${project.problemStatement ? '<span class="hub-badge hub-badge-done">Defined</span>' : '<span class="hub-badge hub-badge-todo">Needs work</span>'}
          </div>
          <div class="hub-card-body">
            ${project.problemStatement
              ? `<p class="hub-statement">${escapeHtml(project.problemStatement)}</p>`
              : `<p class="hub-empty">Use the Problem Discovery Workshop in Module 1 to develop your problem statement.</p>`
            }
            <textarea id="hub-problem-input" class="hub-textarea" placeholder="[WHO] experiences [WHAT PROBLEM] [HOW OFTEN], which causes [WHAT IMPACT]. Currently they [CURRENT WORKAROUND], which [WHY THAT'S INADEQUATE].">${escapeHtml(project.problemStatement)}</textarea>
            <div class="hub-actions">
              <button class="hub-btn hub-btn-primary" onclick="ProjectHub.saveProblemStatement()">Save</button>
              <button class="hub-btn" onclick="openActivity(1, 1)">Open Problem Wizard</button>
            </div>
          </div>
        </div>

        <!-- Problem Evaluation Card -->
        <div class="hub-card hub-card-compact">
          <div class="hub-card-header"><h3>Problem Evaluation</h3></div>
          <div class="hub-card-body">
            <div class="ifs-sliders">
              <div class="ifs-row">
                <label>People</label>
                <input type="number" min="1" value="${project.evalScores.people}" style="width:70px; background:#0d1117; border:1px solid #2a2d3a; color:#e1e4e8; border-radius:4px; padding:2px 6px;" oninput="ProjectHub.updateEval('people', this.value)">
              </div>
              <div class="ifs-row">
                <label>Frequency</label>
                <input type="range" min="0" max="5" value="${project.evalScores.frequency}" oninput="ProjectHub.updateEval('frequency', this.value)">
                <span class="ifs-value" id="eval-frequency-val">${project.evalScores.frequency}</span>
              </div>
              <div class="ifs-row">
                <label>Severity</label>
                <input type="range" min="0" max="5" value="${project.evalScores.severity}" oninput="ProjectHub.updateEval('severity', this.value)">
                <span class="ifs-value" id="eval-severity-val">${project.evalScores.severity}</span>
              </div>
              <div class="ifs-row">
                <label>Solvability</label>
                <input type="range" min="0" max="5" value="${project.evalScores.solvability}" oninput="ProjectHub.updateEval('solvability', this.value)">
                <span class="ifs-value" id="eval-solvability-val">${project.evalScores.solvability}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Target User Card -->
        <div class="hub-card hub-card-compact">
          <div class="hub-card-header"><h3>Target User</h3></div>
          <div class="hub-card-body">
            <textarea id="hub-user-input" class="hub-textarea hub-textarea-sm" placeholder="Who specifically will use your solution? Describe their role, typical day, and the moment they encounter the problem.">${escapeHtml(project.targetUser)}</textarea>
            <button class="hub-btn hub-btn-primary" onclick="ProjectHub.saveTargetUser()">Save</button>
          </div>
        </div>

        <!-- Platform & Deploy Card -->
        <div class="hub-card">
          <div class="hub-card-header">
            <h3>Build & Deploy</h3>
            ${project.deployUrl ? '<span class="hub-badge hub-badge-live">LIVE</span>' : '<span class="hub-badge hub-badge-todo">Not deployed</span>'}
          </div>
          <div class="hub-card-body">
            <div class="hub-platform-select">
              <label>Platform:</label>
              <div class="hub-platform-options">
                <button class="platform-btn ${project.platform === 'lovable' ? 'active' : ''}" onclick="ProjectHub.setPlatform('lovable')">Lovable</button>
                <button class="platform-btn ${project.platform === 'replit' ? 'active' : ''}" onclick="ProjectHub.setPlatform('replit')">Replit</button>
                <button class="platform-btn ${project.platform === 'other' ? 'active' : ''}" onclick="ProjectHub.setPlatform('other')">Other</button>
              </div>
            </div>
            ${project.platform ? `
              <div class="hub-url-row">
                <label>Editor URL:</label>
                <input type="url" id="hub-platform-url" value="${escapeHtml(project.platformUrl)}" placeholder="https://${project.platform === 'lovable' ? 'lovable.dev/projects/...' : project.platform === 'replit' ? 'replit.com/@you/...' : 'your-platform.com/...'}" class="hub-input">
              </div>
              <div class="hub-url-row">
                <label>Live URL:</label>
                <input type="url" id="hub-deploy-url" value="${escapeHtml(project.deployUrl)}" placeholder="https://your-project.lovable.app (the URL others can visit)" class="hub-input">
              </div>
              <button class="hub-btn hub-btn-primary" onclick="ProjectHub.saveUrls()">Save URLs</button>

              ${project.platform && !project.deployUrl ? `
                <div class="hub-guide-link">
                  <button class="hub-btn" onclick="openPlatformGuide('${project.platform}')">View ${project.platform === 'lovable' ? 'Lovable' : project.platform === 'replit' ? 'Replit' : 'Platform'} Setup Guide</button>
                </div>
              ` : ''}
            ` : `<p class="hub-empty">Choose a platform to get started building.</p>`}

            ${project.deployUrl && project.deployedAt ? `
              <div class="hub-deploy-celebration">
                <div class="deploy-icon">&#x1F680;</div>
                <div>
                  <strong>Your solution is live!</strong><br>
                  <a href="${escapeHtml(project.deployUrl)}" target="_blank" class="deploy-link">${escapeHtml(project.deployUrl)}</a><br>
                  <span class="deploy-date">First deployed ${new Date(project.deployedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Iteration Log Card -->
        <div class="hub-card">
          <div class="hub-card-header">
            <h3>Iteration Log</h3>
            <span class="hub-count">${iterationCount} entries</span>
          </div>
          <div class="hub-card-body">
            <div class="hub-iteration-add">
              <select id="hub-iteration-type">
                <option value="feature">New Feature</option>
                <option value="fix">Bug Fix</option>
                <option value="feedback">User Feedback</option>
                <option value="pivot">Problem Pivot</option>
              </select>
              <input type="text" id="hub-iteration-note" placeholder="What did you change and why?" class="hub-input">
              <button class="hub-btn hub-btn-primary" onclick="ProjectHub.addIterationEntry()">Add</button>
            </div>
            ${project.iterations.length > 0 ? `
              <div class="hub-iteration-list">
                ${project.iterations.slice().reverse().map(it => `
                  <div class="iteration-entry">
                    <span class="iteration-type iteration-type-${it.type}">${it.type}</span>
                    <span class="iteration-note">${escapeHtml(it.note)}</span>
                    <span class="iteration-date">${new Date(it.date).toLocaleDateString()}</span>
                  </div>
                `).join('')}
              </div>
            ` : `<p class="hub-empty">Your iteration log will grow as you build and improve your solution.</p>`}
          </div>
        </div>

        <!-- Wizard Sessions Card -->
        ${wizardModules.length > 0 ? `
          <div class="hub-card">
            <div class="hub-card-header">
              <h3>Wizard Conversations</h3>
              <span class="hub-count">${wizardModules.length} sessions</span>
            </div>
            <div class="hub-card-body">
              <div class="hub-wizard-sessions">
                ${wizardModules.map(modId => {
                  const mod = typeof MODULES !== 'undefined' ? MODULES.find(m => m.id === parseInt(modId)) : null;
                  const msgs = project.wizardHistory[modId];
                  const turnCount = msgs.filter(m => m.role === 'user').length;
                  return `
                    <div class="wizard-session-row" onclick="openWizardForModule(${modId})">
                      <span class="wizard-session-module">Module ${modId}</span>
                      <span class="wizard-session-title">${mod ? mod.title : ''}</span>
                      <span class="wizard-session-turns">${turnCount} turns</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        ` : ''}

      </div>
    `;
  }

  // ==================== ACTIONS ====================

  function saveProblemStatement() {
    const input = document.getElementById('hub-problem-input');
    if (input) update({ problemStatement: input.value.trim() });
    render();
  }

  function saveTargetUser() {
    const input = document.getElementById('hub-user-input');
    if (input) update({ targetUser: input.value.trim() });
    render();
  }

  function updateEval(dimension, value) {
    const project = load();
    if (!project.evalScores) project.evalScores = { people: 1, frequency: 0, severity: 0, solvability: 0 };
    project.evalScores[dimension] = parseInt(value);
    save(project);
    const valEl = document.getElementById(`eval-${dimension}-val`);
    if (valEl) valEl.textContent = value;
  }

  function setPlatform(platform) {
    update({ platform });
    render();
  }

  function saveUrls() {
    const platformUrl = document.getElementById('hub-platform-url')?.value.trim() || '';
    const deployUrl = document.getElementById('hub-deploy-url')?.value.trim() || '';
    const changes = { platformUrl };
    if (deployUrl) {
      const project = load();
      changes.deployUrl = deployUrl;
      if (!project.deployedAt) changes.deployedAt = Date.now();
    }
    update(changes);
    render();
  }

  function addIterationEntry() {
    const typeEl = document.getElementById('hub-iteration-type');
    const noteEl = document.getElementById('hub-iteration-note');
    if (!noteEl?.value.trim()) return;
    addIteration(noteEl.value.trim(), typeEl?.value || 'feature');
    render();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  return {
    get, update, save: () => save(load()), render,
    saveProblemStatement, saveTargetUser, updateEval,
    setPlatform, saveUrls, addIterationEntry,
    saveWizardHistory, getWizardHistory, getAllWizardHistory,
    setDeployUrl, addIteration
  };
})();

// Helper for opening wizard from the hub
function openWizardForModule(moduleId) {
  if (typeof openActivity === 'function') {
    // Find the wizard activity index in that module
    const mod = MODULES.find(m => m.id === parseInt(moduleId));
    if (mod) {
      const idx = mod.activities.findIndex(a => a.contentKey === 'problem-wizard');
      if (idx >= 0) {
        openActivity(mod.id, idx);
        return;
      }
    }
  }
}
