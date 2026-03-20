// ============================================================
// Course Data — 12 modules from scaffolded → independent
// ============================================================

const WGU_PROGRAMS = {
  "School of Business": [
    "Accounting","Human Resource Management","Information Technology Management",
    "Business Management","Marketing","Communications","Finance",
    "Healthcare Administration","Supply Chain and Operations Management",
    "User Experience Design","Business Administration (MBA)",
    "Management and Leadership","Marketing Analytics"
  ],
  "Leavitt School of Health": [
    "Nursing","Health Information Management","Health and Human Services",
    "Health Science","Psychology","Public Health",
    "Healthcare Administration","Nursing Informatics"
  ],
  "School of Technology": [
    "Cloud and Network Engineering","Computer Science",
    "Cybersecurity and Information Assurance","Data Analytics",
    "Information Technology","Software Engineering",
    "AI and Machine Learning","Human-Computer Interaction"
  ],
  "School of Education": [
    "Elementary Education","Special Education",
    "Mathematics Education","Science Education",
    "Educational Studies"
  ]
};

// Scaffolding level: 5 = maximum hand-holding, 1 = fully independent
const MODULES = [
  {
    id: 1,
    title: "What Problems Are Worth Solving?",
    desc: "Learn to see the world through a problem-solver's lens. Identify friction, waste, and unmet needs in your daily life and field of study.",
    scaffolding: 5,
    week: "Week 1",
    objectives: [
      "Distinguish between complaints and actionable problems",
      "Identify 3+ real problems in your personal or professional life",
      "Evaluate problem significance using the People / Frequency / Severity / Solvability framework"
    ],
    activities: [
      {
        type: "learn",
        title: "Problems vs. Complaints",
        desc: "Understanding what makes a problem worth solving",
        contentKey: "problems-vs-complaints"
      },
      {
        type: "practice",
        title: "Problem Discovery Workshop",
        desc: "Guided conversation to uncover real problems in your life",
        contentKey: "problem-wizard"
      },
      {
        type: "reflect",
        title: "Problem Journal",
        desc: "Start your ongoing problem journal with 3 entries",
        contentKey: "problem-journal-1"
      }
    ]
  },
  {
    id: 2,
    title: "How AI Actually Works",
    desc: "Demystify AI: what large language models are, how they predict text, and why they're powerful but imperfect tools.",
    scaffolding: 5,
    week: "Week 2",
    objectives: [
      "Explain how LLMs predict the next token in a sequence",
      "Describe what training data is and why it matters",
      "Identify 3 things AI is good at and 3 things it struggles with"
    ],
    activities: [
      {
        type: "learn",
        title: "The Prediction Machine",
        desc: "How LLMs work — no jargon, just intuition",
        contentKey: "prediction-machine"
      },
      {
        type: "practice",
        title: "Token Explorer",
        desc: "See how AI breaks text into tokens and predicts next words",
        contentKey: "token-explorer"
      },
      {
        type: "reflect",
        title: "AI Strengths & Limits",
        desc: "Map what AI can and can't do for your field",
        contentKey: "ai-strengths-limits"
      }
    ]
  },
  {
    id: 3,
    title: "Scoping Your Project",
    desc: "Turn a vague idea into a concrete, buildable project. Define users, core features, and success criteria.",
    scaffolding: 4,
    week: "Week 3",
    objectives: [
      "Write a clear problem statement for your project",
      "Identify your target user and their core need",
      "Define a minimum viable product (MVP) with 3-5 features"
    ],
    activities: [
      {
        type: "learn",
        title: "From Idea to Scope",
        desc: "How to narrow a big idea into a buildable first version",
        contentKey: "idea-to-scope"
      },
      {
        type: "practice",
        title: "Problem Refinement Workshop",
        desc: "Sharpen your problem statement with guided feedback",
        contentKey: "problem-wizard"
      },
      {
        type: "build",
        title: "Project Brief",
        desc: "Write your 1-page project brief: problem, user, MVP features",
        contentKey: "project-brief"
      }
    ]
  },
  {
    id: 4,
    title: "AI as a Thinking Partner",
    desc: "Learn to use AI for brainstorming, research, and planning — not just answers, but better questions.",
    scaffolding: 4,
    week: "Week 4",
    objectives: [
      "Use AI to research and validate a problem space",
      "Generate project timelines with AI assistance",
      "Write effective prompts that get useful, specific responses"
    ],
    activities: [
      {
        type: "learn",
        title: "Prompting for Problem-Solving",
        desc: "How to have productive conversations with AI",
        contentKey: "prompting-for-problem-solving"
      },
      {
        type: "practice",
        title: "Research Sprint",
        desc: "Use AI to validate your project idea in 30 minutes",
        contentKey: "research-sprint"
      },
      {
        type: "build",
        title: "Project Timeline",
        desc: "Create a week-by-week plan for your solution",
        contentKey: "project-timeline"
      }
    ]
  },
  {
    id: 5,
    title: "Building Your First Prototype",
    desc: "Get your hands dirty. Use a hosted platform to build a working first version of your solution.",
    scaffolding: 3,
    week: "Week 5",
    objectives: [
      "Set up a project on a hosted platform (Lovable, Replit, etc.)",
      "Build a working prototype with at least one core feature",
      "Deploy your prototype so others can see it"
    ],
    activities: [
      {
        type: "learn",
        title: "Choosing Your Platform",
        desc: "Compare hosted platforms and pick the right one for your project",
        contentKey: "choosing-platform"
      },
      {
        type: "build",
        title: "Prototype Sprint",
        desc: "Build your first working version — guided step by step",
        contentKey: "prototype-sprint"
      },
      {
        type: "reflect",
        title: "Prototype Review",
        desc: "Document what works, what doesn't, and what's next",
        contentKey: "prototype-review"
      }
    ]
  },
  {
    id: 6,
    title: "Getting & Using Feedback",
    desc: "Show your prototype to real users. Learn to gather, analyze, and act on feedback systematically.",
    scaffolding: 3,
    week: "Week 6",
    objectives: [
      "Conduct 3+ user feedback sessions",
      "Categorize feedback into: keep, change, add, remove",
      "Create an improvement plan based on user feedback"
    ],
    activities: [
      {
        type: "learn",
        title: "The Feedback Loop",
        desc: "How to get honest, useful feedback (not just compliments)",
        contentKey: "feedback-loop"
      },
      {
        type: "practice",
        title: "User Testing Script",
        desc: "AI helps you create a user testing plan",
        contentKey: "user-testing-script"
      },
      {
        type: "build",
        title: "Feedback Synthesis",
        desc: "Use AI to summarize and prioritize user feedback",
        contentKey: "feedback-synthesis"
      }
    ]
  },
  {
    id: 7,
    title: "AI for Productivity",
    desc: "Master practical AI skills: meeting summaries, action items, email drafting, and document analysis.",
    scaffolding: 2,
    week: "Week 7",
    objectives: [
      "Use AI to summarize meetings and extract action items",
      "Generate professional communications with AI assistance",
      "Build a personal AI productivity workflow"
    ],
    activities: [
      {
        type: "learn",
        title: "AI in Your Workday",
        desc: "Practical AI applications for any profession",
        contentKey: "ai-workday"
      },
      {
        type: "practice",
        title: "Productivity Lab",
        desc: "Practice AI-assisted summarization, drafting, and analysis",
        contentKey: "productivity-lab"
      },
      {
        type: "build",
        title: "Workflow Automation",
        desc: "Design an AI-powered workflow for your field",
        contentKey: "workflow-automation"
      }
    ]
  },
  {
    id: 8,
    title: "Iterating Your Solution",
    desc: "Take your prototype to the next level. Add features, fix issues, and polish based on feedback.",
    scaffolding: 2,
    week: "Week 8",
    objectives: [
      "Implement at least 3 improvements based on user feedback",
      "Add a new feature that addresses a real user need",
      "Test your solution with at least 2 new users"
    ],
    activities: [
      {
        type: "build",
        title: "Iteration Sprint",
        desc: "Implement your top-priority improvements",
        contentKey: "iteration-sprint"
      },
      {
        type: "practice",
        title: "Problem Pivot Check",
        desc: "Revisit your problem statement — has it evolved?",
        contentKey: "problem-wizard"
      },
      {
        type: "reflect",
        title: "Progress Check",
        desc: "Document your solution's evolution",
        contentKey: "progress-check"
      }
    ]
  },
  {
    id: 9,
    title: "AI Ethics & Responsibility",
    desc: "Explore bias, privacy, and the societal impact of AI. Build solutions that are fair and responsible.",
    scaffolding: 2,
    week: "Week 9",
    objectives: [
      "Identify potential biases in AI systems",
      "Evaluate privacy implications of your solution",
      "Write an ethics statement for your project"
    ],
    activities: [
      {
        type: "learn",
        title: "When AI Gets It Wrong",
        desc: "Real cases of AI bias and how to prevent it",
        contentKey: "ai-ethics"
      },
      {
        type: "practice",
        title: "Ethics Audit",
        desc: "Evaluate your own project for ethical concerns",
        contentKey: "ethics-audit"
      },
      {
        type: "reflect",
        title: "Responsibility Statement",
        desc: "Write your project's ethics and privacy commitment",
        contentKey: "responsibility-statement"
      }
    ]
  },
  {
    id: 10,
    title: "Polish & Deploy",
    desc: "Finalize your solution. Focus on user experience, reliability, and making it real.",
    scaffolding: 1,
    week: "Week 10",
    objectives: [
      "Complete all core features of your solution",
      "Ensure your solution is deployed and accessible",
      "Write user-facing documentation or instructions"
    ],
    activities: [
      {
        type: "build",
        title: "Final Build Sprint",
        desc: "Complete, polish, and deploy your solution",
        contentKey: "final-build"
      },
      {
        type: "practice",
        title: "Quality Check",
        desc: "Test every feature and fix remaining issues",
        contentKey: "quality-check"
      },
      {
        type: "build",
        title: "User Guide",
        desc: "Create instructions so anyone can use your solution",
        contentKey: "user-guide"
      }
    ]
  },
  {
    id: 11,
    title: "Telling Your Story",
    desc: "Craft a compelling narrative about the problem you found and the solution you built.",
    scaffolding: 1,
    week: "Week 11",
    objectives: [
      "Create a 3-minute project presentation",
      "Articulate the problem-solution journey clearly",
      "Demonstrate your solution's impact with evidence"
    ],
    activities: [
      {
        type: "learn",
        title: "Story Structure",
        desc: "How to present problem-solving work compellingly",
        contentKey: "story-structure"
      },
      {
        type: "build",
        title: "Project Presentation",
        desc: "Build your final presentation with AI assistance",
        contentKey: "project-presentation"
      },
      {
        type: "practice",
        title: "Rehearsal",
        desc: "Practice and refine your presentation",
        contentKey: "rehearsal"
      }
    ]
  },
  {
    id: 12,
    title: "Launch & Reflect",
    desc: "Share your solution with the world. Reflect on what you learned and where you'll go next.",
    scaffolding: 1,
    week: "Week 12",
    objectives: [
      "Publish and share your completed solution",
      "Gather final feedback and document results",
      "Reflect on your growth as a problem-solver"
    ],
    activities: [
      {
        type: "build",
        title: "Launch Day",
        desc: "Share your solution publicly and gather responses",
        contentKey: "launch-day"
      },
      {
        type: "reflect",
        title: "Learning Reflection",
        desc: "Document your journey from Week 1 to now",
        contentKey: "learning-reflection"
      },
      {
        type: "reflect",
        title: "What's Next?",
        desc: "Identify your next problem to solve",
        contentKey: "whats-next"
      }
    ]
  }
];

// Lesson content for interactive modules
const LESSON_CONTENT = {
  "problems-vs-complaints": {
    title: "Problems vs. Complaints",
    sections: [
      {
        type: "text",
        html: `
          <h2>Everyone complains. Problem-solvers do something about it.</h2>
          <p>We all encounter frustrations daily: slow software, confusing forms, inefficient processes,
          information that's hard to find. Most people complain and move on. Problem-solvers pause and ask:
          <strong>"Could this be different?"</strong></p>
          <p>This course is about developing that instinct — and then acting on it.</p>
        `
      },
      {
        type: "concept",
        title: "Complaint vs. Problem",
        html: `
          <p><strong>Complaint:</strong> "This scheduling system is terrible."</p>
          <p><strong>Problem:</strong> "Nurses spend 20 minutes per shift navigating a scheduling system
          that could be simplified — that's 120+ hours per year per nurse wasted on scheduling instead of patient care."</p>
          <p>The difference? A problem is <em>specific</em>, <em>measurable</em>, and points toward a <em>solution</em>.</p>
        `
      },
      {
        type: "analogy",
        label: "Think of it this way",
        html: `<p>A complaint is like saying "it's cold in here." A problem statement is like saying
        "the thermostat is set to 60°F and the window is broken — if we fix the window and adjust the thermostat,
        the room will be comfortable." One vents. The other <em>leads somewhere</em>.</p>`
      },
      {
        type: "concept",
        title: "The Problem Statement Formula",
        html: `
          <p>A strong problem statement follows this pattern:</p>
          <blockquote><strong>[WHO]</strong> experiences <strong>[WHAT PROBLEM]</strong> <strong>[HOW OFTEN]</strong>,
          which causes <strong>[WHAT IMPACT]</strong>. Currently they <strong>[CURRENT WORKAROUND]</strong>,
          which <strong>[WHY THAT'S INADEQUATE]</strong>.</blockquote>
          <p><em>Example:</em> <strong>Freelance designers</strong> spend <strong>3+ hours per week</strong> manually
          creating invoices and chasing payments, which causes <strong>lost billable time and cash flow stress</strong>.
          Currently they <strong>use spreadsheet templates</strong>, which <strong>don't track who's paid or send reminders</strong>.</p>
          <p>Notice how every piece is specific and measurable. That's what makes it actionable.</p>
        `
      },
      {
        type: "text",
        html: `
          <h2>Is This Problem Worth Solving?</h2>
          <p>You have 8 weeks to build a solution. Not every problem is worth that investment.
          Before you commit, evaluate your problem on four dimensions:</p>
          <ul>
            <li><strong>People Impacted:</strong> How many people experience this problem? A problem that affects
            just you might still be worth solving — but one that affects hundreds is more compelling.</li>
            <li><strong>Frequency:</strong> How often does this problem occur? Daily problems compound; yearly ones might not justify a solution.</li>
            <li><strong>Severity:</strong> How painful is each occurrence? A minor annoyance is different from a workflow-blocking frustration.</li>
            <li><strong>Solvability:</strong> Could you realistically build something to help? Some problems are hard because
            they need hardware, legal changes, or human behavior shifts. The best project candidates are ones where
            software can genuinely make a difference.</li>
          </ul>
          <p>There's no magic formula — a problem affecting 5 people severely every day can be better than one
          affecting 1,000 people mildly once a year. The point is to <em>think critically</em> about whether
          your problem is worth your time.</p>
        `
      },
      {
        type: "rate-problem",
        title: "Try it: Rate a Problem",
        prompt: "Think of a frustration you experienced this week. First, describe it using the problem statement formula above (who, what, how often, what impact, current workaround, why it's inadequate). Then evaluate it on the dimensions below.",
        dimensions: [
          { id: "people", label: "People Impacted", desc: "How many people experience this problem?", inputType: "number" },
          { id: "frequency", label: "Frequency", desc: "How often does this problem occur?", anchors: ["Yearly", "Monthly", "Weekly", "Daily", "Multiple times/day"] },
          { id: "severity", label: "Severity", desc: "How painful is each occurrence?", anchors: ["Minor annoyance", "Frustrating", "Wastes real time", "Causes real harm", "Critical blocker"] },
          { id: "solvability", label: "Solvability", desc: "Could you build something to help in 8 weeks?", anchors: ["Very unlikely", "Challenging", "Doable with help", "Quite doable", "Straightforward"] }
        ]
      },
      {
        type: "quiz",
        questions: [
          {
            q: "Which of these is a well-formed problem statement?",
            options: [
              "Our HR software is annoying and nobody likes it",
              "New employees take an average of 3 weeks to complete onboarding paperwork that could be automated to take 2 days",
              "Technology should be easier to use",
              "I hate filling out forms"
            ],
            correct: 1,
            feedback: {
              correct: "That's a strong problem statement — it's specific (who: new employees), measurable (3 weeks → 2 days), and points toward a solution (automation).",
              incorrect: "Look for the option that names WHO is affected, HOW MUCH it costs them, and WHAT a solution could achieve. Complaints lack these specifics."
            }
          },
          {
            q: "A problem affects 500 people, but it only happens once a year and is mild. Is this a good course project?",
            options: [
              "Yes — 500 people is a lot",
              "Probably not — low frequency and low severity mean the total pain is small, even across many people",
              "Yes — you should always pick the problem with the most people",
              "No — 500 people is too many to build for"
            ],
            correct: 1,
            feedback: {
              correct: "Right. Scale matters, but frequency and severity multiply the impact. 500 people × once a year × mild pain = not much total suffering. Compare that to 10 people × daily × severe pain = much more total impact and a stronger project candidate.",
              incorrect: "Think about the TOTAL pain across all dimensions. People alone doesn't tell you enough — you need to consider how often it happens and how much it hurts each time."
            }
          },
          {
            q: "A classmate says: 'I want to build an app that cures loneliness.' What's the best feedback?",
            options: [
              "Great idea! Loneliness is a huge problem.",
              "That's too vague — WHO is lonely, WHEN, and what specific part of loneliness could software actually address?",
              "You can't solve loneliness with technology.",
              "You should pick an easier problem."
            ],
            correct: 1,
            feedback: {
              correct: "Exactly. The instinct is good — loneliness IS a real problem. But it's not actionable until you get specific. 'New remote workers who eat lunch alone every day' is something you could build for. 'Loneliness' is not.",
              incorrect: "The idea isn't bad — it's just not specific enough yet. A good problem-solver doesn't dismiss big problems; they narrow them until they're actionable."
            }
          }
        ]
      }
    ]
  },
  "prediction-machine": {
    title: "The Prediction Machine",
    sections: [
      {
        type: "text",
        html: `
          <h2>AI is a sophisticated text prediction engine</h2>
          <p>At its core, a large language model (LLM) like ChatGPT or Claude does one thing:
          given some text, it predicts what comes next. That's it. Everything else — writing essays,
          answering questions, writing code — emerges from this one capability applied at massive scale.</p>
        `
      },
      {
        type: "analogy",
        label: "Think of it this way",
        html: `<p>Imagine your phone's autocomplete, but trained on a significant portion of the internet
        and millions of books. Your phone might predict "I'm on my ___" → "way." An LLM can predict
        entire paragraphs because it's learned patterns from billions of examples.</p>`
      },
      {
        type: "concept",
        title: "Tokens: How AI Reads",
        html: `
          <p>AI doesn't read words the way you do. It breaks text into <strong>tokens</strong> —
          chunks that might be words, parts of words, or even single characters.</p>
          <p>"Understanding" → ["Under", "standing"]</p>
          <p>"ChatGPT" → ["Chat", "G", "PT"]</p>
          <p>A typical LLM processes thousands of tokens at once. This is its "context window" —
          how much it can "see" at any given time.</p>
        `
      },
      {
        type: "concept",
        title: "Training: How AI Learns",
        html: `
          <p>LLMs learn by reading massive amounts of text and learning patterns:</p>
          <ul>
            <li>What words tend to follow other words</li>
            <li>How sentences are structured in different contexts</li>
            <li>Facts, relationships, and reasoning patterns embedded in text</li>
          </ul>
          <p>This training takes months and costs millions of dollars. But once trained,
          the model can generate new text that follows the patterns it learned.</p>
        `
      },
      {
        type: "text",
        html: `
          <h2>What AI is good at — and what it's not</h2>
          <ul>
            <li><strong>Good at:</strong> Generating text, summarizing, translating, brainstorming, explaining concepts, writing code patterns</li>
            <li><strong>Not good at:</strong> Precise math, real-time information, knowing when it's wrong, understanding physical world dynamics</li>
            <li><strong>Key insight:</strong> AI doesn't "know" things — it predicts plausible text. Sometimes plausible text happens to be true. Sometimes it isn't.</li>
          </ul>
        `
      },
      {
        type: "tryit",
        title: "Try it: Spot the Prediction",
        prompt: "Complete this sentence three different ways: 'A nurse working the night shift needs...' Which completions would AI likely generate? Which require real-world knowledge?",
        placeholder: "Write 3 completions and note which ones AI could predict vs. which require lived experience..."
      },
      {
        type: "quiz",
        questions: [
          {
            q: "Why do LLMs sometimes generate false information confidently?",
            options: [
              "They're trying to deceive users",
              "They predict plausible-sounding text, and plausible doesn't always mean true",
              "They haven't been trained on enough data",
              "They only work on certain topics"
            ],
            correct: 1,
            feedback: {
              correct: "Exactly. LLMs optimize for plausibility, not truth. Plausible text often IS true, but not always — which is why human judgment is essential.",
              incorrect: "Remember: LLMs predict plausible text. Plausible ≠ true. They don't have a truth-checker built in."
            }
          }
        ]
      }
    ]
  }
};
