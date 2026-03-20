// ============================================================
// Problem Articulation Wizard
// The core pedagogical innovation: a guided conversation that
// helps students discover and articulate real problems.
//
// Scaffolding decreases across modules:
// Module 1: Heavy guidance, suggestions, examples, structured steps
// Module 3: Moderate guidance, fewer suggestions
// Module 8: Light check-in, student drives the conversation
// ============================================================

const ProblemWizard = (() => {
  let currentStep = 0;
  let currentModule = 1;
  let studentProfile = {};
  let problemDraft = {};
  let conversationHistory = [];

  // Problem examples by field — so students see relevant inspiration
  const FIELD_EXAMPLES = {
    "School of Business": [
      {
        problem: "Small business owners spend 5+ hours/week manually reconciling invoices that could be auto-matched",
        who: "Freelancers and small business owners",
        impact: "Saves 260+ hours/year per business"
      },
      {
        problem: "New marketing hires take 3 months to learn which campaigns work because performance data is scattered across 6 tools",
        who: "Marketing team managers",
        impact: "Faster onboarding, better campaign decisions"
      },
      {
        problem: "Supply chain managers can't predict stockouts because demand signals are in spreadsheets, not dashboards",
        who: "Inventory and supply chain teams",
        impact: "Reduces stockouts by catching signals early"
      }
    ],
    "Leavitt School of Health": [
      {
        problem: "Patients forget post-discharge care instructions within 48 hours, leading to 20% readmission rates",
        who: "Recently discharged patients",
        impact: "Reduces readmissions and improves patient outcomes"
      },
      {
        problem: "Mental health counselors spend 40 minutes per session writing notes that could be structured automatically",
        who: "Licensed counselors and therapists",
        impact: "More time for patient care, less for paperwork"
      },
      {
        problem: "Public health workers can't quickly identify disease clusters because case reports are filed in PDFs, not searchable databases",
        who: "County health departments",
        impact: "Faster outbreak detection and response"
      }
    ],
    "School of Technology": [
      {
        problem: "Junior developers waste 2 hours/day searching documentation that could be surfaced contextually in their IDE",
        who: "Entry-level software developers",
        impact: "Faster onboarding, more productive coding"
      },
      {
        problem: "IT help desks answer the same 50 questions repeatedly — an AI FAQ could resolve 60% of tickets instantly",
        who: "Corporate IT departments",
        impact: "Faster resolution, reduced ticket volume"
      },
      {
        problem: "Cybersecurity teams get 500+ alerts/day but only 3% are real threats — they need intelligent prioritization",
        who: "Security operations centers",
        impact: "Focus on real threats, reduce alert fatigue"
      }
    ],
    "School of Education": [
      {
        problem: "Teachers spend 6 hours/week creating differentiated worksheets for students at different reading levels",
        who: "K-8 classroom teachers",
        impact: "More time teaching, less time creating materials"
      },
      {
        problem: "Parents of special needs students can't easily track IEP goals across providers and school systems",
        who: "Parents navigating special education",
        impact: "Better coordination, better outcomes for students"
      },
      {
        problem: "Student teachers get observed twice a semester but need weekly feedback to improve — there's no scalable way to provide it",
        who: "Student teachers and their mentors",
        impact: "Faster skill development during practicums"
      }
    ]
  };

  // Conversation flows differ by scaffolding level
  function getConversationFlow(scaffoldingLevel) {
    if (scaffoldingLevel >= 4) return getHighScaffoldingFlow();
    if (scaffoldingLevel >= 2) return getMediumScaffoldingFlow();
    return getLowScaffoldingFlow();
  }

  // HIGH scaffolding: Weeks 1-2, maximum guidance
  function getHighScaffoldingFlow() {
    return [
      {
        id: "welcome",
        message: () => `Welcome to the Problem Discovery Workshop! I'm going to help you find a real problem worth solving.

Before we start — this isn't about coming up with a "good" answer. It's about noticing things you might normally overlook. There are no wrong answers here.

<strong>First, tell me about yourself:</strong> What's your program at WGU, and what kind of work do you do (or want to do)?`,
        suggestions: () => {
          const colleges = Object.keys(WGU_PROGRAMS);
          return colleges.map(c => c.replace("School of ", "").replace("Leavitt ", ""));
        },
        handler: (response) => {
          studentProfile.background = response;
          studentProfile.college = detectCollege(response);
          return "daily-friction";
        }
      },
      {
        id: "daily-friction",
        message: () => {
          const examples = getFieldExamples();
          const exampleText = examples.length > 0
            ? `\n\nHere are examples of problems people in your area have identified:\n${examples.map(e => `• <em>"${e.problem}"</em>`).join('\n')}`
            : '';

          return `Great — knowing your background helps me suggest relevant problems.${exampleText}

Now, think about your <strong>last week</strong>. What frustrated you? What felt inefficient, confusing, or like a waste of time? This could be at work, school, home, or anywhere.

<strong>Describe a specific moment of friction.</strong> Be as concrete as you can — "Tuesday morning I spent 30 minutes trying to..." is better than "things are inefficient."`;
        },
        suggestions: () => [
          "Something at work was slow...",
          "I couldn't find information I needed...",
          "A process had too many steps...",
          "Communication broke down when..."
        ],
        handler: (response) => {
          problemDraft.rawFriction = response;
          return "dig-deeper";
        }
      },
      {
        id: "dig-deeper",
        message: () => `Good start! Let's dig deeper into that.

<h4>Follow-up questions:</h4>
<ul>
<li><strong>Who else</strong> experiences this problem? Just you, or many people?</li>
<li><strong>How often</strong> does it happen? Daily? Weekly? Only in certain situations?</li>
<li><strong>What's the cost</strong> when it happens? Wasted time? Money? Frustration? Missed opportunities?</li>
</ul>

Answer as many as you can. The more specific, the better.`,
        suggestions: () => [
          "It affects my whole team...",
          "This happens every single day...",
          "People lose hours to this...",
          "It causes mistakes that..."
        ],
        handler: (response) => {
          problemDraft.deeperContext = response;
          return "current-solutions";
        }
      },
      {
        id: "current-solutions",
        message: () => `Interesting. Now let's look at what already exists.

<strong>How do people currently deal with this problem?</strong>
<ul>
<li>Do they use a workaround? (Spreadsheets, sticky notes, asking someone...)</li>
<li>Is there an existing tool that partially solves it?</li>
<li>Do people just... live with it?</li>
</ul>

Understanding current solutions tells you what your solution needs to beat.`,
        suggestions: () => [
          "People use spreadsheets...",
          "There's a tool but it's bad at...",
          "Everyone just works around it...",
          "Nobody's tried to fix it"
        ],
        handler: (response) => {
          problemDraft.currentSolutions = response;
          return "envision-solution";
        }
      },
      {
        id: "envision-solution",
        message: () => `Now the fun part. <strong>Imagine the solution exists.</strong>

If someone built the perfect tool/website/app to solve this problem:
<ul>
<li>What would a user <strong>do first</strong> when they open it?</li>
<li>What's the <strong>one thing</strong> it must do well?</li>
<li>How would someone's day be <strong>different</strong> after using it?</li>
</ul>

Don't worry about technical feasibility — just describe the experience.`,
        suggestions: () => [
          "They'd open it and see...",
          "The main thing it does is...",
          "After using it, they'd save...",
          "It would replace the need to..."
        ],
        handler: (response) => {
          problemDraft.solutionVision = response;
          return "synthesize";
        }
      },
      {
        id: "synthesize",
        message: () => {
          return `Excellent work! Let me help you pull this together.

Based on what you've told me, here's a draft problem statement:

<strong>"${synthesizeProblemStatement()}"</strong>

<h4>Rate it using the Impact / Frequency / Solvability framework:</h4>
<ul>
<li><strong>Impact</strong> (1-5): How much does this hurt when it happens?</li>
<li><strong>Frequency</strong> (1-5): How often does it occur?</li>
<li><strong>Solvability</strong> (1-5): Could you build something to help in 8 weeks?</li>
</ul>

Does this capture your problem? Feel free to edit it or tell me what's off.`;
        },
        suggestions: () => [
          "That's close, but...",
          "The impact is a 4 because...",
          "I'd rate it: 4, 5, 3",
          "Let me rewrite it as..."
        ],
        handler: (response) => {
          problemDraft.refinement = response;
          return "complete";
        }
      },
      {
        id: "complete",
        message: () => `Great work! You've gone from a vague frustration to a concrete problem statement. That's the hardest part of building anything.

<h4>Your Problem Discovery Summary:</h4>
<ul>
<li><strong>Raw friction:</strong> ${problemDraft.rawFriction || '(not captured)'}</li>
<li><strong>Who's affected:</strong> ${problemDraft.deeperContext || '(not captured)'}</li>
<li><strong>Current solutions:</strong> ${problemDraft.currentSolutions || '(not captured)'}</li>
<li><strong>Vision:</strong> ${problemDraft.solutionVision || '(not captured)'}</li>
</ul>

<strong>Save this in your Problem Journal.</strong> Over the next few days, notice when this problem shows up again. Add details every time you see it.

In Module 3, we'll sharpen this into a full project brief.`,
        suggestions: () => [],
        handler: () => null
      }
    ];
  }

  // MEDIUM scaffolding: Weeks 3-6
  function getMediumScaffoldingFlow() {
    return [
      {
        id: "welcome",
        message: () => `Welcome back to the Problem Workshop. You've done this before, so I'll give you more room to drive.

<strong>Where are you with your problem?</strong> Briefly describe it and what's changed since you last worked on it.`,
        suggestions: () => [
          "I'm refining my original idea...",
          "I want to pivot to a new problem...",
          "I got user feedback that..."
        ],
        handler: (response) => {
          problemDraft.update = response;
          return "challenge";
        }
      },
      {
        id: "challenge",
        message: () => `Good. Let me push you on a few things:

<ul>
<li><strong>Specificity:</strong> Can you name a real person (or type of person) who has this problem?</li>
<li><strong>Evidence:</strong> What evidence do you have that this is a real problem, not just your assumption?</li>
<li><strong>Scope:</strong> Is your solution trying to do too much? What's the ONE thing it must nail?</li>
</ul>`,
        suggestions: () => [
          "I talked to someone who...",
          "The evidence is...",
          "The one thing is..."
        ],
        handler: (response) => {
          problemDraft.challenge = response;
          return "mvp-focus";
        }
      },
      {
        id: "mvp-focus",
        message: () => `Now think about your MVP. In the next few weeks, you need a working version.

<strong>What are the 3 features your MVP absolutely must have?</strong> Everything else is a "nice to have." Be ruthless — cut anything that isn't essential to solving the core problem.`,
        suggestions: () => [],
        handler: (response) => {
          problemDraft.mvpFeatures = response;
          return "complete-medium";
        }
      },
      {
        id: "complete-medium",
        message: () => `Solid. You have a clearer picture now.

<strong>Your action items:</strong>
<ul>
<li>Validate your problem with 2+ people this week</li>
<li>Build the first MVP feature</li>
<li>Write down what "success" looks like for your solution</li>
</ul>

Keep going — you're building something real.`,
        suggestions: () => [],
        handler: () => null
      }
    ];
  }

  // LOW scaffolding: Weeks 7-12
  function getLowScaffoldingFlow() {
    return [
      {
        id: "welcome",
        message: () => `Problem check-in. You're deep in your project now.

<strong>What's the biggest challenge you're facing with your solution right now?</strong>`,
        suggestions: () => [],
        handler: (response) => {
          problemDraft.challenge = response;
          return "reflection";
        }
      },
      {
        id: "reflection",
        message: () => `Think about that challenge for a moment.

<ul>
<li>Is this a <strong>problem problem</strong> (wrong problem to solve) or an <strong>execution problem</strong> (right problem, hard to build)?</li>
<li>What would you tell a friend who was stuck on the same thing?</li>
</ul>

Sometimes articulating it is enough to see the path forward.`,
        suggestions: () => [],
        handler: (response) => {
          problemDraft.reflection = response;
          return "complete-low";
        }
      },
      {
        id: "complete-low",
        message: () => `You've got this. At this point in the course, you have all the skills — it's about persistence and iteration.

<strong>One thing to do today:</strong> Take the smallest possible step toward resolving that challenge. Ship something, talk to a user, or cut a feature.`,
        suggestions: () => [],
        handler: () => null
      }
    ];
  }

  // Detect which college the student is from based on their response
  function detectCollege(text) {
    const lower = text.toLowerCase();
    if (/nurs|health|psych|public health|patient|clinical|medical|hospital/.test(lower))
      return "Leavitt School of Health";
    if (/tech|comput|software|cyber|data|cloud|network|IT|code|program/.test(lower))
      return "School of Technology";
    if (/teach|education|school|classroom|student teach|K-?[0-9]|special ed/.test(lower))
      return "School of Education";
    if (/business|market|account|financ|HR|human resource|supply chain|MBA|manage/.test(lower))
      return "School of Business";
    // Default — look for program names
    for (const [college, programs] of Object.entries(WGU_PROGRAMS)) {
      for (const prog of programs) {
        if (lower.includes(prog.toLowerCase())) return college;
      }
    }
    return "School of Business"; // default
  }

  function getFieldExamples() {
    const college = studentProfile.college || "School of Business";
    return FIELD_EXAMPLES[college] || [];
  }

  function synthesizeProblemStatement() {
    // Build a problem statement from the draft fragments
    const friction = problemDraft.rawFriction || "";
    const context = problemDraft.deeperContext || "";

    // Simple synthesis — in a real product this would use an LLM
    if (friction.length > 100) {
      return friction.substring(0, 150) + "...";
    }
    if (friction && context) {
      return `${friction.trim()} This affects ${context.substring(0, 80).trim()}...`;
    }
    return friction || "Your problem statement will appear here as you provide more details.";
  }

  // Public API
  function init(moduleId) {
    currentModule = moduleId;
    const module = MODULES.find(m => m.id === moduleId);
    currentStep = 0;
    studentProfile = {};
    problemDraft = {};
    conversationHistory = [];

    const scaffolding = module ? module.scaffolding : 5;
    updateScaffoldingUI(scaffolding);

    const flow = getConversationFlow(scaffolding);
    if (flow.length > 0) {
      showStep(flow[0]);
    }
  }

  function updateScaffoldingUI(level) {
    const fill = document.getElementById('scaffolding-fill');
    const text = document.getElementById('scaffolding-text');
    if (fill) fill.style.width = (level / 5 * 100) + '%';
    const labels = { 5: 'Full Guide', 4: 'Guided', 3: 'Moderate', 2: 'Light', 1: 'Independent' };
    if (text) text.textContent = labels[level] || '';
  }

  function showStep(step) {
    const chatEl = document.getElementById('wizard-chat');
    const suggestionsEl = document.getElementById('wizard-suggestions');

    // Add system message
    const msg = document.createElement('div');
    msg.className = 'chat-message system';
    msg.innerHTML = step.message();
    chatEl.appendChild(msg);
    chatEl.scrollTop = chatEl.scrollHeight;

    // Show suggestions
    suggestionsEl.innerHTML = '';
    const suggestions = step.suggestions();
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

    conversationHistory.push({ stepId: step.id, step: step });
  }

  function handleUserMessage(text) {
    if (!text.trim()) return;

    const chatEl = document.getElementById('wizard-chat');

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.textContent = text;
    chatEl.appendChild(userMsg);
    chatEl.scrollTop = chatEl.scrollHeight;

    // Clear input
    document.getElementById('wizard-input').value = '';
    document.getElementById('wizard-suggestions').innerHTML = '';

    // Process through current step handler
    const lastEntry = conversationHistory[conversationHistory.length - 1];
    if (lastEntry && lastEntry.step && lastEntry.step.handler) {
      const nextStepId = lastEntry.step.handler(text);
      if (nextStepId) {
        const module = MODULES.find(m => m.id === currentModule);
        const scaffolding = module ? module.scaffolding : 5;
        const flow = getConversationFlow(scaffolding);
        const nextStep = flow.find(s => s.id === nextStepId);
        if (nextStep) {
          // Small delay to feel conversational
          setTimeout(() => showStep(nextStep), 600);
        }
      }
    }
  }

  return { init, handleUserMessage };
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
