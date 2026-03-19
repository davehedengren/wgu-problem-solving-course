# WGU Problem-Solving with AI — Course Design Plan

## Vision

A General Education course that teaches students they can solve real problems using AI. Students graduate knowing they have the power to build solutions to problems in their personal and professional lives — not as software engineers, but as empowered problem-solvers.

**Best case outcome:** Students leave thinking "I can do anything. I can solve that."
**Worst case to avoid:** Paint-by-numbers busywork that isn't useful.

---

## Course Structure

### Module 1: AI Foundations (Toolkit Course)
The base training — understanding what AI is, what it isn't, and how to use it.

**Learning Objectives:**
1. **Explain how LLMs work** — Students can explain that large language models predict the next most probable token. They know what a token is. (Analogy level: "TV works by sending radio waves through the air" — not deep engineering, but correct mental model.)
2. **Know what AI is and isn't** — Students understand it's not a person in a machine. They can articulate what it can and can't do, which helps them use it better.
3. **Use AI for personalized learning** — Given an unfamiliar concept, students can use AI to learn it well enough to explain it to someone else without the AI. No excuse to not know anything anymore.
4. **Know the tool landscape** — Students can name and distinguish between types of AI tools (chat interfaces, coding editors, hosted app builders, computer-use agents) and know when to use which.

### Module 2: Practical AI Skills
Everyday knowledge-worker skills augmented by AI.

**Learning Objectives:**
5. **Project planning** — Create a calendar/timeline for a multi-person project using AI.
6. **Meeting management** — Use AI to create meeting agendas and summarize action items from meeting transcripts.
7. **Filtering signal from noise** — Given AI-generated action items or summaries, identify and prioritize the truly important items vs. off-the-cuff mentions.
8. **Resource planning** — Work backwards from a deadline: "If I need to accomplish this by this date, what resources do I need the day before, the week before?"

### Modules 3–11: Applied Problem-Solving (Progressive Scaffolding)
Each module is an application course (communications, quantitative literacy, etc.) where students solve problems within that domain using AI. Scaffolding decreases over time.

**Learning Objectives:**
9. **Problem articulation** — Students can clearly define a problem worth solving. (Hardest part — needs chatbot/prompt support to help students who struggle with this.)
10. **Iterative solution building** — Students iterate with AI on a hosted platform (Lovable, Replit, etc.) until they have a working solution.
11. **Domain application** — Apply problem-solving skills within specific competency areas (communications, quantitative literacy, etc. — competencies TBD from WGU business partners).

**Scaffolding progression:**
- Early modules: Heavy guidance, structured prompts, example problems
- Middle modules: Less scaffolding, students choose from suggested problem categories
- Late modules: Students identify their own problems and build independently

### Module 12: Capstone — Independent Problem-Solving
Students independently identify a real problem in their personal or professional life, articulate it clearly, and build a persistent, deployed solution using AI tools.

**Learning Objectives:**
12. **Independent problem identification** — Without scaffolding, identify a real, repeatable problem worth solving.
13. **End-to-end solution delivery** — Build and deploy a working solution (website/app) that is persistent, durable, and accessible to others.
14. **Reflection and communication** — Explain what problem they solved, why it matters, and how they built it.

---

## Platform & Tooling Decisions

| Decision | Current Thinking | Notes |
|----------|-----------------|-------|
| **Coding platform** | Lovable, Replit, or similar | Whichever gives WGU best volume discount. All similar enough. Should be hosted so students see their work live on a real URL (not localhost). |
| **Problem articulation** | Custom chatbot/prompt system | Needs to help students who are bad at articulating problems. Key design challenge. |
| **Competencies** | TBD — Emily getting list from WGU | Business-defined competencies that map to what employers want. These become the problem domains for modules 3-11. |
| **AI Ethics** | Existing WGU course covers this | Don't duplicate — focus on problem-solving. |

---

## Open Questions & Next Steps

- [ ] **Get competency list from WGU** — Emily is getting the competencies for the communications course. These define the problem domains.
- [ ] **Design the problem-articulation chatbot** — This is the highest-risk piece. How do we help students come up with good problems without making it paint-by-numbers?
- [ ] **Choose platform** — Evaluate Lovable, Replit, etc. for WGU volume pricing. Course is ~1 year out so platforms will improve.
- [ ] **Define scaffolding gradient** — Exactly how much help at each stage? What does "heavy scaffolding" look like vs. "none"?
- [ ] **Create prompt templates** — Dave will create prompts that Emily can run through WGU's internal Claude instance against the real competency data.
- [ ] **Map competencies to modules** — Once we have the competency list, map them to the progressive modules.
- [ ] **Assessment design** — How do we evaluate student work? Is the deployed solution the assessment? Rubric needed.

---

## Key Quotes from Design Conversations

> "In the best case, it shows people that they can solve problems and makes them more valuable to future employers and makes them recognize that they can do anything themselves."

> "There's not an excuse to not know anything anymore. You should be able to have anything personalized taught to you."

> "Knowing that you can [build solutions] and though you're not a software engineer is an incredibly powerful skill."

> "Week 1, you build your first solution with a lot of scaffolding and week 12, you build something totally independently for a problem that you articulated."
