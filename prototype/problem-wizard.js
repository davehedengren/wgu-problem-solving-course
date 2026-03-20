// ============================================================
// Problem Articulation Wizard — LLM-Powered
//
// Sends conversation history to Claude via /api/wizard.
// The system prompt (server-side) adapts based on scaffolding
// level so students get more guidance early and less later.
// ============================================================

const ProblemWizard = (() => {
  let currentModule = 1;
  let scaffoldingLevel = 5;
  let studentProfile = {};
  let messages = [];  // Anthropic-format messages: [{role, content}]
  let isLoading = false;

  // WGU programs for the profile selector
  const COLLEGES = {
    "School of Business": [
      "Accounting", "Human Resource Management", "IT Management",
      "Business Management", "Marketing", "Communications", "Finance",
      "Healthcare Administration", "Supply Chain & Operations", "User Experience Design"
    ],
    "Leavitt School of Health": [
      "Nursing", "Health Information Management", "Health & Human Services",
      "Health Science", "Psychology", "Public Health"
    ],
    "School of Technology": [
      "Cloud & Network Engineering", "Computer Science", "Cybersecurity",
      "Data Analytics", "Information Technology", "Software Engineering"
    ],
    "School of Education": [
      "Elementary Education", "Special Education", "Mathematics Education",
      "Science Education", "Educational Studies"
    ]
  };

  // ==================== INITIALIZATION ====================

  function init(moduleId) {
    currentModule = moduleId;
    const module = window.MODULES ? MODULES.find(m => m.id === moduleId) : null;
    scaffoldingLevel = module ? module.scaffolding : 5;
    studentProfile = loadProfile();
    messages = [];

    updateScaffoldingUI(scaffoldingLevel);
    clearChat();

    // If we don't know the student yet, show profile picker first
    if (!studentProfile.college) {
      showProfilePicker();
      return;
    }

    // Check for saved conversation history for this module
    const savedHistory = ProjectHub.getWizardHistory(moduleId);
    if (savedHistory && savedHistory.length > 0) {
      resumeConversation(savedHistory);
    } else {
      startConversation();
    }
  }

  function resumeConversation(savedMessages) {
    messages = savedMessages;

    // Replay the conversation into the chat UI
    for (const msg of messages) {
      if (msg.role === 'user') {
        addUserMessage(msg.content);
      } else if (msg.role === 'assistant') {
        addSystemMessage(msg.content);
      }
    }

    // Show a "resumed" notice and update suggestions
    const chatEl = document.getElementById('wizard-chat');
    const notice = document.createElement('div');
    notice.className = 'chat-notice';
    notice.textContent = 'Conversation resumed from your last session.';
    chatEl.appendChild(notice);
    chatEl.scrollTop = chatEl.scrollHeight;

    updateSuggestions();
  }

  // ==================== PROFILE ====================

  function loadProfile() {
    try {
      return JSON.parse(localStorage.getItem('wgu-wizard-profile')) || {};
    } catch { return {}; }
  }

  function saveProfile() {
    localStorage.setItem('wgu-wizard-profile', JSON.stringify(studentProfile));
  }

  function showProfilePicker() {
    const chatEl = document.getElementById('wizard-chat');

    const msg = document.createElement('div');
    msg.className = 'chat-message system';
    msg.innerHTML = `Before we start — tell me a bit about yourself so I can help you find problems relevant to your field.

<strong>What college and program are you in?</strong>`;
    chatEl.appendChild(msg);

    // Build college/program selector
    const selector = document.createElement('div');
    selector.className = 'profile-selector';
    selector.innerHTML = buildProfileSelector();
    chatEl.appendChild(selector);
    chatEl.scrollTop = chatEl.scrollHeight;

    // Clear suggestion chips for now
    document.getElementById('wizard-suggestions').innerHTML = '';
  }

  function buildProfileSelector() {
    let html = '<div class="profile-colleges">';
    for (const [college, programs] of Object.entries(COLLEGES)) {
      const shortName = college.replace('School of ', '').replace('Leavitt ', '');
      html += `<button class="college-btn suggestion-chip" onclick="ProblemWizard.selectCollege('${college}')">${shortName}</button>`;
    }
    html += '</div><div id="program-list" class="profile-programs"></div>';
    return html;
  }

  function selectCollege(college) {
    studentProfile.college = college;

    // Highlight selected college
    document.querySelectorAll('.college-btn').forEach(btn => {
      btn.style.opacity = btn.textContent === college.replace('School of ', '').replace('Leavitt ', '') ? '1' : '0.4';
    });

    // Show programs
    const programs = COLLEGES[college] || [];
    const listEl = document.getElementById('program-list');
    listEl.innerHTML = programs.map(p =>
      `<button class="suggestion-chip" onclick="ProblemWizard.selectProgram('${p}')">${p}</button>`
    ).join('');
  }

  function selectProgram(program) {
    studentProfile.major = program;
    saveProfile();

    // Show as user message
    addUserMessage(`I'm in ${studentProfile.college} — studying ${program}.`);

    // Remove the selector
    const selector = document.querySelector('.profile-selector');
    if (selector) selector.remove();

    // Start the real conversation
    startConversation();
  }

  // ==================== CONVERSATION ====================

  function startConversation() {
    // Build intro with context from prior modules and project state
    const project = ProjectHub.get();
    let introMessage = studentProfile.major
      ? `Hi! I'm a WGU student in the ${studentProfile.college}, studying ${studentProfile.major}.`
      : `Hi! I'm a WGU student.`;

    // If returning in a later module, provide context about their project
    if (currentModule > 1 && project.problemStatement) {
      introMessage += `\n\nI've been working on a problem: "${project.problemStatement}"`;
      if (project.deployUrl) {
        introMessage += `\nI've deployed a solution at ${project.deployUrl}.`;
      }
      if (project.iterations.length > 0) {
        const recent = project.iterations.slice(-3).map(it => it.note).join('; ');
        introMessage += `\nRecent iteration notes: ${recent}`;
      }
      introMessage += `\n\nI'm in Module ${currentModule} now and want to keep refining.`;
    } else {
      introMessage += ` I'm ready to work on finding a problem to solve.`;
    }

    messages = [{ role: 'user', content: introMessage }];
    sendToAPI();
  }

  async function sendToAPI() {
    if (isLoading) return;
    isLoading = true;
    showTypingIndicator();

    try {
      const res = await fetch('/api/wizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          studentProfile,
          scaffoldingLevel,
          moduleId: currentModule
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      removeTypingIndicator();

      // Add assistant response to conversation history
      messages.push({ role: 'assistant', content: data.response });

      // Save to ProjectHub for cross-module persistence
      ProjectHub.saveWizardHistory(currentModule, messages);

      // Display it
      addSystemMessage(data.response);

      // Generate contextual suggestions based on scaffolding level
      updateSuggestions();

    } catch (err) {
      removeTypingIndicator();
      addSystemMessage(`Something went wrong connecting to the AI. Error: ${err.message}\n\nPlease try again.`);
      console.error('Wizard API error:', err);
    } finally {
      isLoading = false;
    }
  }

  function handleUserMessage(text) {
    if (!text.trim() || isLoading) return;

    // Display user message
    addUserMessage(text);

    // Clear input
    document.getElementById('wizard-input').value = '';
    document.getElementById('wizard-suggestions').innerHTML = '';

    // Add to conversation history and send
    messages.push({ role: 'user', content: text });
    sendToAPI();
  }

  // ==================== SUGGESTIONS ====================
  // Light contextual suggestions that decrease with scaffolding

  function updateSuggestions() {
    const suggestionsEl = document.getElementById('wizard-suggestions');
    suggestionsEl.innerHTML = '';

    // No suggestions at low scaffolding — student drives
    if (scaffoldingLevel <= 2) return;

    // Contextual suggestions based on conversation length
    const turnCount = messages.filter(m => m.role === 'user').length;
    let suggestions = [];

    if (turnCount <= 1) {
      // Early conversation — help them get started
      suggestions = scaffoldingLevel >= 4
        ? [
          "Something at work frustrated me this week...",
          "I noticed an inefficiency in...",
          "People in my field always complain about...",
          "I spent way too long trying to..."
        ]
        : [
          "Here's what I'm working on...",
          "My problem has evolved since last time..."
        ];
    } else if (turnCount <= 3) {
      suggestions = scaffoldingLevel >= 4
        ? [
          "It happens almost every day...",
          "My coworkers deal with this too...",
          "Currently people just use spreadsheets...",
          "The biggest cost is wasted time..."
        ]
        : [];
    }
    // After 3 turns, no more suggestions — they should be driving

    suggestions.forEach(s => {
      const chip = document.createElement('button');
      chip.className = 'suggestion-chip';
      chip.textContent = s;
      chip.onclick = () => {
        document.getElementById('wizard-input').value = s;
        document.getElementById('wizard-input').focus();
      };
      suggestionsEl.appendChild(chip);
    });
  }

  // ==================== UI HELPERS ====================

  function clearChat() {
    document.getElementById('wizard-chat').innerHTML = '';
    document.getElementById('wizard-suggestions').innerHTML = '';
  }

  function addSystemMessage(text) {
    const chatEl = document.getElementById('wizard-chat');
    const msg = document.createElement('div');
    msg.className = 'chat-message system';
    // Convert **bold** to <strong> and newlines to <br>
    msg.innerHTML = formatMessage(text);
    chatEl.appendChild(msg);
    chatEl.scrollTop = chatEl.scrollHeight;
  }

  function addUserMessage(text) {
    const chatEl = document.getElementById('wizard-chat');
    const msg = document.createElement('div');
    msg.className = 'chat-message user';
    msg.textContent = text;
    chatEl.appendChild(msg);
    chatEl.scrollTop = chatEl.scrollHeight;
  }

  function formatMessage(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  }

  function showTypingIndicator() {
    const chatEl = document.getElementById('wizard-chat');
    const indicator = document.createElement('div');
    indicator.className = 'chat-message system typing-indicator';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    chatEl.appendChild(indicator);
    chatEl.scrollTop = chatEl.scrollHeight;
  }

  function removeTypingIndicator() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
  }

  function updateScaffoldingUI(level) {
    const fill = document.getElementById('scaffolding-fill');
    const text = document.getElementById('scaffolding-text');
    if (fill) fill.style.width = (level / 5 * 100) + '%';
    const labels = { 5: 'Full Guide', 4: 'Guided', 3: 'Moderate', 2: 'Light', 1: 'Independent' };
    if (text) text.textContent = labels[level] || '';
  }

  // Public API
  return { init, handleUserMessage, selectCollege, selectProgram };
})();

// Global function for the send button
function sendWizardMessage() {
  const input = document.getElementById('wizard-input');
  ProblemWizard.handleUserMessage(input.value);
}

// Allow Enter to send (Shift+Enter for newline)
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('wizard-input');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendWizardMessage();
      }
    });
  }
});
