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

function renderLesson(lesson) {
  const container = document.getElementById('lesson-content');
  let html = `<div class="lesson-header"><h1>${lesson.title}</h1></div><div class="lesson-body">`;

  lesson.sections.forEach(section => {
    switch (section.type) {
      case 'text':
        html += section.html;
        break;
      case 'concept':
        html += `<div class="concept-card"><h3>${section.title}</h3>${section.html}</div>`;
        break;
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
