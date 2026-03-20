// ============================================================
// Platform Integration Guide
//
// Step-by-step content for getting started on Lovable, Replit,
// or other hosted platforms. Connected to the wizard output
// so students go from "I have a problem" to "I'm building."
// ============================================================

const PLATFORM_GUIDES = {
  lovable: {
    name: 'Lovable',
    tagline: 'Build web apps by describing what you want in plain English.',
    steps: [
      {
        title: 'Create your Lovable account',
        content: `Go to <strong>lovable.dev</strong> and sign up with your WGU email. Lovable gives you a visual builder powered by AI — you describe what you want, and it builds it.`,
        tip: 'Your WGU email may give you access through the course subscription. Check with your instructor.'
      },
      {
        title: 'Start a new project',
        content: `Click <strong>"New Project"</strong> and give it a name that matches your problem. For example, if you're building a study group finder, name it "StudyConnect" or similar.`,
        tip: 'A clear project name helps when you share it later.'
      },
      {
        title: 'Describe your solution to the AI',
        content: `This is where your problem statement becomes a product. Paste your problem statement and MVP features into the AI prompt. Be specific about what the user should be able to DO, not just what the page should look like.`,
        example: `"Build a web app where nursing students can post what course they're studying, their available times, and find other students studying the same course. The main page shows a list of open study sessions that can be filtered by course number. Any user can create a new session with a course name, date/time, location, and max group size."`,
        tip: 'Include your target user and their core action. "A [WHO] can [DO WHAT]" is the best starting prompt.'
      },
      {
        title: 'Iterate — don\'t expect perfection',
        content: `The first version won't be perfect. That's the point. Look at what Lovable built and tell it what to change: "Move the search bar to the top," "Add a filter for course number," "Make the date picker easier to use." Each conversation turn refines the product.`,
        tip: 'Treat AI like a junior developer. Be specific: "Change X to Y" is better than "Make it better."'
      },
      {
        title: 'Deploy and share your URL',
        content: `Lovable automatically deploys your project to a live URL (something like <strong>your-project.lovable.app</strong>). Copy this URL — this is your live, deployed solution that anyone can visit. Paste it in your My Project hub.`,
        tip: 'This is the magic moment. You built something real that lives on the internet. Share it.'
      }
    ]
  },
  replit: {
    name: 'Replit',
    tagline: 'Code, create, and deploy — all from your browser.',
    steps: [
      {
        title: 'Create your Replit account',
        content: `Go to <strong>replit.com</strong> and sign up with your WGU email. Replit gives you a full coding environment in the browser with AI assistance built in.`,
        tip: 'Replit has a free tier that works for course projects. Check if WGU provides a team subscription.'
      },
      {
        title: 'Create a new Repl',
        content: `Click <strong>"+ Create Repl"</strong>. For most projects, choose the <strong>"HTML, CSS, JS"</strong> template (simplest) or <strong>"Node.js"</strong> if your project needs a backend. Name it after your project.`,
        tip: 'If you\'re not sure which template, start with HTML/CSS/JS. You can always add complexity later.'
      },
      {
        title: 'Use the AI Assistant to build',
        content: `Replit has an AI sidebar. Describe your problem and what you want to build. You can say things like: "Create a web page where [target user] can [core action]." The AI will generate code and you can iterate from there.`,
        example: `"Create a web app for substitute teachers. When they arrive at a school, they enter the teacher name they're covering for and see today's lesson plan, classroom rules, seating chart, and student notes. Teachers can pre-load this information for their substitutes."`,
        tip: 'Start with ONE feature. Get it working, then add more.'
      },
      {
        title: 'Run and test locally',
        content: `Click the <strong>"Run"</strong> button to see your app in the preview panel. Test it yourself — click every button, fill every form, try to break it. Then tell the AI what to fix.`,
        tip: 'The preview panel shows exactly what your users will see. If something feels confusing to you, it will be confusing to them.'
      },
      {
        title: 'Deploy to a live URL',
        content: `Click <strong>"Deploy"</strong> in the top menu to get a permanent URL. Replit will give you something like <strong>your-project.repl.co</strong>. This is your live, deployed solution. Paste it in your My Project hub.`,
        tip: 'Once deployed, anyone with the link can use your solution. This is the real thing — not a homework assignment, a real product.'
      }
    ]
  },
  other: {
    name: 'Other Platforms',
    tagline: 'Use whatever tool helps you build the best solution.',
    steps: [
      {
        title: 'Choose your platform',
        content: `If you're not using Lovable or Replit, make sure your platform can: (1) let you build a web-based solution, (2) deploy it to a public URL, and (3) iterate quickly with AI assistance. Options include Vercel, Netlify + Claude/ChatGPT, Glitch, or others.`,
        tip: 'The platform matters less than the problem you\'re solving. Pick what feels most comfortable.'
      },
      {
        title: 'Set up your project',
        content: `Create a new project and set up the basic structure. If you're using an AI coding assistant (Claude, ChatGPT, Cursor, etc.), describe your problem statement and ask it to generate a starting point.`,
        tip: 'Always start by describing the PROBLEM, not the technology. "I need to solve X" is better than "Build me a React app."'
      },
      {
        title: 'Build your MVP',
        content: `Focus on the ONE core feature that addresses your problem. Build it, test it, and get it working before adding anything else.`,
        tip: 'Ship something small that works. You can always add more.'
      },
      {
        title: 'Deploy to a public URL',
        content: `Deploy your solution so anyone can access it via a URL. Most platforms have free hosting. Paste your live URL in the My Project hub.`,
        tip: 'If you can send someone a link and they can use your solution — you\'ve deployed.'
      }
    ]
  }
};

function renderPlatformGuide(platformKey) {
  const guide = PLATFORM_GUIDES[platformKey];
  if (!guide) return '';

  const project = ProjectHub.get();

  let html = `
    <div class="lesson-header">
      <h1>${guide.name} Setup Guide</h1>
      <p class="guide-tagline">${guide.tagline}</p>
    </div>
    <div class="lesson-body">
  `;

  // If they have a problem statement, show it as context
  if (project.problemStatement) {
    html += `
      <div class="guide-context">
        <div class="guide-context-label">Your Problem Statement</div>
        <p>${escapeHtmlGuide(project.problemStatement)}</p>
      </div>
    `;
  }

  guide.steps.forEach((step, i) => {
    html += `
      <div class="guide-step">
        <div class="guide-step-num">${i + 1}</div>
        <div class="guide-step-content">
          <h3>${step.title}</h3>
          <p>${step.content}</p>
          ${step.example ? `
            <div class="guide-example">
              <div class="guide-example-label">Example prompt</div>
              <p>${step.example}</p>
            </div>
          ` : ''}
          ${step.tip ? `<div class="guide-tip"><strong>Tip:</strong> ${step.tip}</div>` : ''}
        </div>
      </div>
    `;
  });

  // After the steps, prompt them to save their URL
  html += `
    <div class="guide-deploy-cta">
      <h3>Got your URL?</h3>
      <p>Once your project is deployed, save it here:</p>
      <div class="guide-url-input">
        <input type="url" id="guide-deploy-url" placeholder="https://your-project.${platformKey === 'lovable' ? 'lovable.app' : platformKey === 'replit' ? 'repl.co' : 'example.com'}" class="hub-input" value="${escapeHtmlGuide(project.deployUrl)}">
        <button class="hub-btn hub-btn-primary" onclick="saveUrlFromGuide()">Save & Celebrate</button>
      </div>
    </div>
  </div>`;

  return html;
}

function saveUrlFromGuide() {
  const input = document.getElementById('guide-deploy-url');
  if (!input?.value.trim()) return;
  ProjectHub.setDeployUrl(input.value.trim());

  // Show celebration
  const cta = document.querySelector('.guide-deploy-cta');
  if (cta) {
    cta.innerHTML = `
      <div class="deploy-celebration-full">
        <div class="celebration-icon">&#x1F680;</div>
        <h2>You did it.</h2>
        <p>Your solution is live on the internet. Anyone with this link can use what you built:</p>
        <a href="${escapeHtmlGuide(input.value.trim())}" target="_blank" class="celebration-link">${escapeHtmlGuide(input.value.trim())}</a>
        <p class="celebration-sub">This isn't a homework assignment. This is a real solution to a real problem that you identified, designed, and built.</p>
        <button class="hub-btn hub-btn-primary" onclick="showProjectHub()">Back to My Project</button>
      </div>
    `;
  }
}

function openPlatformGuide(platformKey) {
  const container = document.getElementById('lesson-content');
  if (!container) return;
  showView('lesson-view');
  container.innerHTML = renderPlatformGuide(platformKey);
}

function escapeHtmlGuide(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
