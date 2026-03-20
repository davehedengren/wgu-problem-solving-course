// ============================================================
// App — Main controller
// Handles navigation, module rendering, progress tracking
// ============================================================

// State
const state = {
  currentView: 'dashboard',
  currentModule: null,
  returnModule: null,
  progress: loadProgress()
};

// Progress persistence
function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem('wgu-progress')) || {
      completedModules: [],
      objectivesChecked: {},
      currentModule: 1
    };
  } catch {
    return { completedModules: [], objectivesChecked: {}, currentModule: 1 };
  }
}

function saveProgress() {
  localStorage.setItem('wgu-progress', JSON.stringify(state.progress));
}

// ==================== NAVIGATION ====================

function showView(viewId) {
  document.querySelectorAll('main').forEach(m => m.classList.add('hidden'));
  document.getElementById(viewId).classList.remove('hidden');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  state.currentView = viewId;
  window.scrollTo(0, 0);
}

function showDashboard() {
  showView('dashboard-view');
  document.getElementById('nav-dashboard').classList.add('active');
  renderModulesGrid();
}

function showProjectHub() {
  showView('project-hub-view');
  document.getElementById('nav-project').classList.add('active');
  ProjectHub.render();
}

function showProgress() {
  showView('progress-view');
  document.getElementById('nav-progress').classList.add('active');
  renderProgressView();
}

function openModule(moduleId) {
  const module = MODULES.find(m => m.id === moduleId);
  if (!module) return;
  if (isLocked(moduleId)) return;

  state.currentModule = moduleId;
  showView('module-view');
  renderModuleView(module);
}

function returnToModule() {
  if (state.currentModule) {
    openModule(state.currentModule);
  } else {
    showDashboard();
  }
}

function isLocked(moduleId) {
  // Module 1 always unlocked. Others require previous to be started.
  if (moduleId <= 1) return false;
  // Unlock next module once current is opened (not necessarily completed)
  return moduleId > state.progress.currentModule + 1;
}

// ==================== DASHBOARD ====================

function renderModulesGrid() {
  const grid = document.getElementById('modules-grid');
  grid.innerHTML = '';

  MODULES.forEach(module => {
    const locked = isLocked(module.id);
    const completed = state.progress.completedModules.includes(module.id);

    const card = document.createElement('div');
    card.className = `module-card${locked ? ' locked' : ''}${completed ? ' completed' : ''}`;
    card.onclick = () => !locked && openModule(module.id);

    // Scaffolding dots
    let dots = '';
    for (let i = 0; i < 5; i++) {
      dots += `<div class="scaffolding-dot${i < module.scaffolding ? ' filled' : ''}"></div>`;
    }

    // Status badge
    let badge;
    if (completed) {
      badge = '<span class="module-status-badge badge-completed">Completed</span>';
    } else if (locked) {
      badge = '<span class="module-status-badge badge-locked">Locked</span>';
    } else {
      badge = '<span class="module-status-badge badge-available">Available</span>';
    }

    card.innerHTML = `
      <div class="module-number">${module.week} &middot; Module ${module.id}</div>
      <div class="module-title">${module.title}</div>
      <div class="module-desc">${module.desc}</div>
      <div class="module-meta">
        <div class="module-scaffolding">
          <span>Guidance:</span>
          <div class="scaffolding-dots">${dots}</div>
        </div>
        ${badge}
      </div>
    `;

    grid.appendChild(card);
  });
}

// ==================== MODULE VIEW ====================

function renderModuleView(module) {
  const container = document.getElementById('module-content');

  // Track that this module has been opened
  if (module.id > state.progress.currentModule) {
    state.progress.currentModule = module.id;
    saveProgress();
  }

  // Scaffolding description
  const scaffoldLabels = {
    5: 'Full Guidance — We walk through every step together',
    4: 'Guided — Structure with room for your ideas',
    3: 'Moderate — Key prompts, you fill in the details',
    2: 'Light — Brief check-ins, you drive',
    1: 'Independent — You own this'
  };

  // Render objectives
  const objectivesHtml = module.objectives.map((obj, i) => {
    const key = `${module.id}-${i}`;
    const checked = state.progress.objectivesChecked[key];
    return `
      <div class="objective-item">
        <div class="objective-check${checked ? ' checked' : ''}"
             onclick="toggleObjective(${module.id}, ${i}, this)">${checked ? '&#10003;' : ''}</div>
        <span class="objective-text">${obj}</span>
      </div>
    `;
  }).join('');

  // Render activities
  const activityIcons = { learn: '&#x1F4D6;', practice: '&#x1F527;', build: '&#x1F528;', reflect: '&#x1F4AD;' };
  const activitiesHtml = module.activities.map((act, i) => `
    <div class="activity-card" onclick="openActivity(${module.id}, ${i})">
      <div class="activity-icon ${act.type}">${activityIcons[act.type] || ''}</div>
      <div class="activity-info">
        <div class="activity-title">${act.title}</div>
        <div class="activity-desc">${act.desc}</div>
      </div>
      <div class="activity-arrow">&#x203A;</div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="module-header">
      <div class="module-number">${module.week} &middot; Module ${module.id}</div>
      <h1>${module.title}</h1>
      <p class="module-subtitle">${scaffoldLabels[module.scaffolding]}</p>
    </div>

    <div class="learning-objectives">
      <h3>Learning Objectives</h3>
      ${objectivesHtml}
    </div>

    <h3 style="margin-bottom: 1rem; color: #8b8fa3; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em;">Activities</h3>
    <div class="activities-list">
      ${activitiesHtml}
    </div>
  `;
}

function toggleObjective(moduleId, objIndex, el) {
  const key = `${moduleId}-${objIndex}`;
  const isChecked = !state.progress.objectivesChecked[key];
  state.progress.objectivesChecked[key] = isChecked;

  el.classList.toggle('checked', isChecked);
  el.innerHTML = isChecked ? '&#10003;' : '';
  saveProgress();

  // Check if all objectives for this module are done
  const module = MODULES.find(m => m.id === moduleId);
  if (module) {
    const allDone = module.objectives.every((_, i) =>
      state.progress.objectivesChecked[`${moduleId}-${i}`]
    );
    if (allDone && !state.progress.completedModules.includes(moduleId)) {
      state.progress.completedModules.push(moduleId);
      saveProgress();
    }
  }
}

// ==================== ACTIVITIES ====================

function openActivity(moduleId, activityIndex) {
  const module = MODULES.find(m => m.id === moduleId);
  if (!module) return;
  const activity = module.activities[activityIndex];
  if (!activity) return;

  state.returnModule = moduleId;
  state.currentModule = moduleId;

  if (activity.contentKey === 'problem-wizard') {
    showView('problem-wizard');
    document.getElementById('wizard-chat').innerHTML = '';
    ProblemWizard.init(moduleId);
    return;
  }

  // Token Explorer
  if (activity.contentKey === 'token-explorer') {
    showView('lesson-view');
    TokenExplorer.init();
    return;
  }

  // Platform guide
  if (activity.contentKey === 'choosing-platform') {
    const project = ProjectHub.get();
    showView('lesson-view');
    openPlatformGuide(project.platform || 'lovable');
    return;
  }

  // Check for lesson content
  const lesson = LESSON_CONTENT[activity.contentKey];
  if (lesson) {
    showView('lesson-view');
    renderLesson(lesson);
    return;
  }

  // Generic activity placeholder
  showView('lesson-view');
  renderGenericActivity(activity, module);
}

function getFieldExamples() {
  try {
    const profile = JSON.parse(localStorage.getItem('wgu-wizard-profile') || '{}');
    if (profile.college && FIELD_EXAMPLES[profile.college]) {
      return FIELD_EXAMPLES[profile.college];
    }
  } catch {}
  return DEFAULT_FIELD_EXAMPLES;
}

function renderLesson(lesson) {
  const container = document.getElementById('lesson-content');
  const fieldEx = getFieldExamples();
  let html = `<div class="lesson-header"><h1>${lesson.title}</h1></div><div class="lesson-body">`;

  lesson.sections.forEach(section => {
    switch (section.type) {
      case 'text':
        html += section.html;
        break;
      case 'concept': {
        const content = section.dynamic && section.buildHtml ? section.buildHtml(fieldEx) : section.html;
        html += `<div class="concept-card"><h3>${section.title}</h3>${content}</div>`;
        break;
      }
      case 'analogy':
        html += `<div class="analogy-box"><div class="analogy-label">${section.label || 'Analogy'}</div>${section.html}</div>`;
        break;
      case 'tryit':
        html += `
          <div class="try-it-box">
            <h3>${section.title}</h3>
            <p>${section.prompt}</p>
            <textarea placeholder="${section.placeholder || 'Type your response...'}"></textarea>
            <button onclick="this.parentElement.querySelector('textarea').style.borderColor='#22c55e'; this.textContent='Saved!'">Save Response</button>
          </div>
        `;
        break;
      case 'rate-problem':
        html += renderRateProblem(section, fieldEx);
        break;
      case 'quiz':
        html += renderQuiz(section.questions);
        break;
    }
  });

  html += '</div>';
  container.innerHTML = html;
}

function renderQuiz(questions) {
  let html = '<div class="quiz-section"><h2>Check Your Understanding</h2>';

  questions.forEach((q, qi) => {
    html += `<div class="quiz-question"><p>${qi + 1}. ${q.q}</p>`;
    q.options.forEach((opt, oi) => {
      html += `<div class="quiz-option" onclick="checkAnswer(this, ${qi}, ${oi}, ${q.correct}, '${q.feedback.correct.replace(/'/g, "\\'")}', '${q.feedback.incorrect.replace(/'/g, "\\'")}')">${opt}</div>`;
    });
    html += `<div class="quiz-feedback" id="quiz-feedback-${qi}"></div></div>`;
  });

  html += '</div>';
  return html;
}

function renderRateProblem(section, fieldEx) {
  const dimHtml = section.dimensions.map(d => {
    if (d.inputType === 'number') {
      return `
        <div class="rate-dimension">
          <div class="rate-dimension-header">
            <label>${d.label}</label>
          </div>
          <p class="rate-desc">${d.desc}</p>
          <div class="rate-number-row">
            <input type="number" min="1" value="1" class="rate-number-input" id="rate-${d.id}"
              oninput="updateProblemScore()" placeholder="e.g. 50">
            <span class="rate-number-label">people</span>
          </div>
        </div>
      `;
    }
    return `
      <div class="rate-dimension">
        <div class="rate-dimension-header">
          <label>${d.label}</label>
          <span class="rate-value" id="rate-val-${d.id}">3</span>
        </div>
        <p class="rate-desc">${d.desc}</p>
        <div class="rate-slider-row">
          <span class="rate-anchor">${d.anchors[0]}</span>
          <input type="range" min="1" max="5" value="3" class="rate-slider" id="rate-${d.id}"
            oninput="document.getElementById('rate-val-${d.id}').textContent=this.value; updateProblemScore()">
          <span class="rate-anchor">${d.anchors[4]}</span>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="rate-problem-box">
      <h3>${section.title}</h3>
      <p>${section.dynamicPrompt && section.buildPrompt ? section.buildPrompt(fieldEx) : section.prompt}</p>
      <textarea id="rate-problem-desc" placeholder="Describe the problem here — be specific about who it affects and what happens..."></textarea>
      <div class="rate-dimensions">
        ${dimHtml}
      </div>
      <div class="rate-score-row">
        <div class="rate-score-label">Problem Score:</div>
        <div class="rate-score-value" id="rate-score">27</div>
        <div class="rate-score-hint" id="rate-score-hint">Might be too small — look for a bigger or more frequent problem</div>
      </div>
      <button class="rate-get-feedback-btn" onclick="getProblemFeedback()">Get AI Feedback on My Evaluation</button>
      <div class="rate-feedback" id="rate-feedback"></div>
    </div>
  `;
}

function updateProblemScore() {
  const people = Math.max(1, parseInt(document.getElementById('rate-people')?.value || 1));
  const frequency = parseInt(document.getElementById('rate-frequency')?.value || 3);
  const severity = parseInt(document.getElementById('rate-severity')?.value || 3);
  const solvability = parseInt(document.getElementById('rate-solvability')?.value || 3);

  // Normalize people to a 1-5 scale for scoring: 1=1, 2-5=2, 6-20=3, 21-100=4, 100+=5
  let peopleScore;
  if (people <= 1) peopleScore = 1;
  else if (people <= 5) peopleScore = 2;
  else if (people <= 20) peopleScore = 3;
  else if (people <= 100) peopleScore = 4;
  else peopleScore = 5;

  const score = peopleScore * frequency * severity * solvability;
  const maxScore = 5 * 5 * 5 * 5; // 625

  const scoreEl = document.getElementById('rate-score');
  const hintEl = document.getElementById('rate-score-hint');
  if (scoreEl) scoreEl.textContent = score;

  if (hintEl) {
    if (score >= 200) hintEl.textContent = 'Strong candidate for a project!';
    else if (score >= 75) hintEl.textContent = 'Decent candidate — keep refining';
    else if (score < 75 && solvability <= 2) hintEl.textContent = 'Might be hard to build — can you narrow the scope?';
    else hintEl.textContent = 'Might be too small — look for a bigger or more frequent problem';
  }
}

async function getProblemFeedback() {
  const desc = document.getElementById('rate-problem-desc')?.value?.trim();
  if (!desc) {
    alert('Please describe the problem first.');
    return;
  }

  const people = document.getElementById('rate-people')?.value || 1;
  const frequency = document.getElementById('rate-frequency')?.value || 3;
  const severity = document.getElementById('rate-severity')?.value || 3;
  const solvability = document.getElementById('rate-solvability')?.value || 3;
  const freqLabels = { 1: "Yearly", 2: "Monthly", 3: "Weekly", 4: "Daily", 5: "Multiple times/day" };
  const sevLabels = { 1: "Minor annoyance", 2: "Frustrating", 3: "Wastes real time", 4: "Causes real harm", 5: "Critical blocker" };
  const solLabels = { 1: "Very unlikely", 2: "Challenging", 3: "Doable with help", 4: "Quite doable", 5: "Straightforward" };

  const feedbackEl = document.getElementById('rate-feedback');
  feedbackEl.innerHTML = '<div class="rate-feedback-loading">Getting AI feedback...</div>';

  const prompt = `A student in a problem-solving course described a problem and self-evaluated it. Give them brief, constructive feedback (3-4 paragraphs max).

The student is learning to identify actionable problems — ones that are specific, measurable, and point toward a buildable solution. A strong problem statement follows this formula: [WHO] experiences [WHAT PROBLEM] [HOW OFTEN], which causes [WHAT IMPACT]. Currently they [CURRENT WORKAROUND], which [WHY THAT'S INADEQUATE].

Problem description: "${desc}"

Student's self-ratings:
- People Impacted: ${people} people
- Frequency: ${frequency}/5 (${freqLabels[frequency]})
- Severity: ${severity}/5 (${sevLabels[severity]})
- Solvability: ${solvability}/5 (${solLabels[solvability]})

First, evaluate whether the problem description is specific enough — does it name WHO, WHAT, HOW OFTEN, and WHAT IMPACT? If any piece is vague, point that out.

Then for each dimension, tell them whether you agree with their rating or if they're over- or under-estimating, and why. Be specific — don't just say "I agree," explain your reasoning.

Finally, give one concrete suggestion for how they could sharpen the problem statement to make it more actionable. Be encouraging but intellectually honest.`;

  try {
    const res = await fetch('/api/wizard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        studentProfile: JSON.parse(localStorage.getItem('wgu-wizard-profile') || '{}'),
        scaffoldingLevel: 5,
        moduleId: 1
      })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    feedbackEl.innerHTML = '<div class="rate-feedback-content">' +
      data.response
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>') +
      '</div>';
  } catch (err) {
    feedbackEl.innerHTML = '<div class="rate-feedback-error">Could not get AI feedback. Make sure the server is running.</div>';
    console.error('Feedback error:', err);
  }
}

function checkAnswer(el, questionIndex, optionIndex, correctIndex, correctFeedback, incorrectFeedback) {
  // Don't re-answer
  if (el.closest('.quiz-question').querySelector('.correct, .incorrect')) return;

  const isCorrect = optionIndex === correctIndex;
  el.classList.add(isCorrect ? 'correct' : 'incorrect');

  // Show the correct one too if wrong
  if (!isCorrect) {
    const options = el.parentElement.querySelectorAll('.quiz-option');
    options[correctIndex].classList.add('correct');
  }

  const feedback = document.getElementById(`quiz-feedback-${questionIndex}`);
  feedback.textContent = isCorrect ? correctFeedback : incorrectFeedback;
  feedback.className = `quiz-feedback show ${isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`;
}

function renderGenericActivity(activity, module) {
  const container = document.getElementById('lesson-content');
  const typeLabels = { learn: 'Learning', practice: 'Practice', build: 'Build', reflect: 'Reflection' };

  container.innerHTML = `
    <div class="lesson-header">
      <h1>${activity.title}</h1>
      <p style="color: #8b8fa3;">${typeLabels[activity.type]} Activity &middot; ${module.title}</p>
    </div>
    <div class="lesson-body">
      <p>${activity.desc}</p>

      <div class="concept-card">
        <h3>Activity Preview</h3>
        <p>This activity is part of the prototype. In the full course, this would contain
        the complete ${typeLabels[activity.type].toLowerCase()} experience with interactive content,
        AI-assisted guidance, and personalized feedback.</p>
        <p>The scaffolding for this module is set to <strong>${module.scaffolding}/5</strong>,
        meaning ${module.scaffolding >= 4 ? 'you\'ll get detailed step-by-step guidance' :
          module.scaffolding >= 2 ? 'you\'ll get moderate guidance with room to explore' :
          'you\'re working independently with minimal prompts'}.</p>
      </div>

      <div class="try-it-box">
        <h3>Your Response</h3>
        <p>Use this space to work through the activity. Your response is saved locally.</p>
        <textarea placeholder="Start working on: ${activity.desc}"></textarea>
        <button onclick="this.parentElement.querySelector('textarea').style.borderColor='#22c55e'; this.textContent='Saved!'">Save Response</button>
      </div>
    </div>
  `;
}

// ==================== PROGRESS VIEW ====================

function renderProgressView() {
  const container = document.getElementById('progress-overview');
  container.innerHTML = '';

  MODULES.forEach(module => {
    const completed = state.progress.completedModules.includes(module.id);
    const current = module.id === state.progress.currentModule;
    const future = module.id > state.progress.currentModule;

    // Calculate objective progress
    const objCount = module.objectives.length;
    const objDone = module.objectives.filter((_, i) =>
      state.progress.objectivesChecked[`${module.id}-${i}`]
    ).length;
    const pct = objCount > 0 ? Math.round((objDone / objCount) * 100) : 0;

    const statusClass = completed ? 'done' : (current ? 'current' : 'future');

    const card = document.createElement('div');
    card.className = 'progress-card';
    card.innerHTML = `
      <div class="progress-module-num ${statusClass}">${module.id}</div>
      <div class="progress-info">
        <div class="progress-title">${module.title}</div>
        <div style="font-size: 0.8rem; color: #6b7280;">${module.week} &middot; ${objDone}/${objCount} objectives</div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill ${completed ? 'done' : (pct > 0 ? 'partial' : 'none')}"
               style="width: ${completed ? 100 : pct}%"></div>
        </div>
      </div>
      <div class="progress-pct">${completed ? 100 : pct}%</div>
    `;

    container.appendChild(card);
  });
}

// ==================== INIT ====================

document.addEventListener('DOMContentLoaded', () => {
  renderModulesGrid();
});
