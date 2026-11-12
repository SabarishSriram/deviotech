import { finalReviewTask, planTask, recordDemo } from "@/data/docs/build/shared"
import type { BuildTask, BuildWeek, ProjectBuild, ProjectScreen } from "@/data/docs/types"

/*
 * UI/UX: three design projects, week by week, in Figma and FigJam, with the
 * case study on GitHub. No code and no Git branches — each task ends with a
 * named Figma version and a few lines in the case study.
 *
 * AI helps draft, cluster and critique. It never replaces talking to real
 * people, and participants' details never go into it.
 */

const privacy = "Anonymise everything first: participants are P1, P2, P3 — never names, numbers or photos (see Research data & sharing)."
const weekly = "Every task this week ends with a named Figma version and a few lines in your case study."

/* ------------------------------------------------------------------ */
/* Shared tasks                                                        */
/* ------------------------------------------------------------------ */

function interviewTask(topic: string, extra = ""): BuildTask {
  return {
    id: "interviews",
    title: "Interview real users and affinity map",
    why: "Research is the evidence every later decision stands on. Five honest conversations beat any number of assumptions — including AI's.",
    screens: ["affinity"],
    prompt: `Help me prepare a 20-minute interview about ${topic}. Draft 8 open questions that ask about past behaviour (“Tell me about the last time…”), not opinions or the future, and point out any leading question I add. After my interviews, I'll paste my anonymised notes: help me group them into themes for an affinity map — but tell me which themes are weak (said by only one person).${extra}`,
    steps: [
      { text: "Read the consent script in Research data & sharing. Recruit 3–5 people who match your users — not your closest friends." },
      { text: "Interview each one, taking notes in FigJam: one sticky note per observation or quote." },
      { text: privacy },
      { text: "Group the stickies into themes on the FigJam board, and name each theme as a sentence (“Users don't trust…”), not a word." },
    ],
    understand: ["Which theme came up the most, and how many people said it?", "What surprised you — something you'd have got wrong without asking?", "Read one question you asked: why is it open, not leading?"],
    check: [{ text: "Your FigJam board has every interview's stickies, grouped into 4–6 named themes, with P-numbers on the quotes." }],
    debug: ["Everyone said “it's fine”: ask about the last time they actually did it, step by step. Problems show up in stories, not opinions."],
  }
}

const personaJourneyTask: BuildTask = {
  id: "persona",
  title: "Persona and journey map",
  why: "A persona keeps your real users in the room while you design. A journey map shows exactly where their experience goes wrong.",
  screens: ["persona"],
  prompt: "Here are my research themes (anonymised). Help me check my persona: is every goal and frustration backed by at least two participants? Then help me lay out a journey map for the main task — stages, what they do, think and feel at each, and the low points. Don't invent anything that isn't in my themes.",
  steps: [{ text: "In FigJam, make one persona card (goals, frustrations, a real quote, how they use tech) and a journey map below it, with the low points marked." }],
  understand: ["Which research finding does each frustration on your persona come from?", "Where is the lowest point of the journey, and why there?"],
  check: [{ text: "Every frustration on the persona points to a theme on your affinity map." }],
}

function flowsTask(flows: string): BuildTask {
  return {
    id: "flows",
    title: "Information architecture and user flows",
    why: "Before any screen: decide what goes where, and every step — and wrong turn — a user takes through the main tasks.",
    screens: ["flow"],
    prompt: `Help me check my user flows for ${flows}: list any missing step, decision point, error path (wrong input, no internet, going back) or dead end. Don't draw them for me — critique mine.`,
    steps: [{ text: "On the Wireframes page in Figma (or in FigJam), draw a sitemap, then each flow as boxes and arrows — including error and back paths." }],
    understand: ["What happens in your flow when the user makes a mistake?", "Which step did you remove compared with today's way of doing it, and why?"],
    check: [{ text: "Each flow has a start, an end, every decision and at least one error path." }],
  }
}

function wireframesTask(screens: string): BuildTask {
  return {
    id: "wireframes",
    title: "Low-fidelity wireframes and a feedback round",
    why: "Grey boxes are quick to change. Get the structure right — and tested on two people — before any colour.",
    screens: ["wireframe"],
    prompt: `I'll describe my wireframes for ${screens} (or paste a screenshot). Critique them against my user flows and research themes: missing information, confusing order, too many choices on one screen, unclear next step. Give each point a reason.`,
    steps: [
      { text: "On the Wireframes page, draw every screen in greyscale with real text (not lorem ipsum). Name each frame like 01 Home / Default." },
      { text: "Show them to 2 people from your users: give them a task and watch where they hesitate. Write what you'll change." },
    ],
    understand: ["What did the feedback round change?", "Why real text instead of lorem ipsum?"],
    check: [{ text: "Every screen in your flows has a wireframe, and your notes list what the feedback round changed." }],
  }
}

const designSystemTask: BuildTask = {
  id: "design-system",
  title: "A mini design system",
  why: "A small set of colours, text styles and components, used everywhere, is what makes screens look like one product — and what developers build from.",
  screens: ["design-system"],
  prompt: "Help me check my mini design system: are my colour pairs readable (contrast at least 4.5:1 for text)? Is my type scale consistent? Which components am I missing for my screens (buttons with all states, inputs with error state, cards, navigation)? Explain why for each.",
  steps: [{ text: "On the UI page, make a Design system section: colour styles (with names like primary/500), 4–6 text styles, an 8-point spacing scale, and components with variants (Button / Primary / Disabled, Input / Error…) using Auto Layout." }],
  understand: ["Why name colours by role (primary, danger) instead of by colour (blue, red)?", "What's a variant, and which component has the most?"],
  check: [{ text: "Every text and colour on your components comes from a style — none are typed in by hand. Every text colour pair passes 4.5:1 (check with a Figma contrast plugin)." }],
}

function hifiTask(states: string): BuildTask {
  return {
    id: "hifi",
    title: "High-fidelity screens",
    why: "Now your wireframes become the real thing — built only from your design system, with every state a real user will hit.",
    screens: ["hifi"],
    prompt: `I'll paste screenshots of my high-fidelity screens. Critique them: consistency with my design system, visual hierarchy (what do you see first?), tap target size (at least 44 points), and whether ${states} are covered. Give a reason for each point.`,
    steps: [{ text: "On the UI page, design every screen from your wireframes using only your components and styles. Add the states listed in this task." }],
    understand: ["What's the first thing your eye goes to on the main screen — and is that the most important thing?", "Which research finding shaped this screen the most?"],
    check: [{ text: `Every wireframe has a high-fidelity version, plus ${states}.` }],
  }
}

const prototypeTask: BuildTask = {
  id: "prototype",
  title: "A clickable prototype",
  why: "A prototype lets people use your design before anyone writes code — which is exactly what your usability test needs.",
  screens: ["prototype"],
  prompt: "Here's my main flow as a list of screens. Help me check my prototype plan: does every button that matters lead somewhere, do the error paths work, and can the user go back? Suggest which transitions (instant, dissolve, slide) suit each step, and why.",
  steps: [{ text: "In Prototype mode, connect every screen of your main flows, set the starting frame, and share the prototype link as can view (Research data & sharing shows how)." }],
  understand: ["Which path would a user most likely get lost on?", "Why does the prototype need the error paths too?"],
  check: [{ text: "Open the prototype link in a private window and complete every main flow from start to end, including one mistake." }],
}

function usabilityTask(task: string): BuildTask {
  return {
    id: "usability",
    title: "Usability test and iterate",
    why: "Watching real people use your prototype is the moment of truth. Then you fix what tripped them up — once — and show the before and after.",
    prompt: `Help me write a usability test script for my prototype: a short intro (we're testing the design, not you), the task “${task}”, what to watch for, and 3 questions for after. After the tests I'll paste my anonymised notes: help me rank the problems by how many people hit them and how badly.`,
    steps: [
      { text: "Test with 3–5 people from your users. Ask them to think aloud; don't help. Note where they hesitate, mistakes, and time taken." },
      { text: privacy },
      { text: "Fix the top 2–3 problems, and save a named version before and after." },
    ],
    understand: ["What was the biggest problem, and how many people hit it?", "What did you change, and how do you know it's better?"],
    check: [{ text: "Your case study has a table: problem, how many people hit it, what you changed." }],
  }
}

const handoffTask: BuildTask = {
  id: "handoff",
  title: "Developer handoff",
  why: "A design isn't finished until a developer can build it without guessing. Handoff notes answer their questions before they ask.",
  screens: ["hifi"],
  prompt: "Help me check my handoff for gaps a developer would hit: spacing and sizes, every component state, empty, loading and error states, what happens on smaller screens, and behaviour that isn't visible (what happens after tapping Save?).",
  steps: [{ text: "On the UI page, add a Handoff section: annotations on each main screen, component states, and notes on behaviour. Mark finished frames as Ready for development." }],
  understand: ["What's one thing a developer couldn't know from your screens alone?", "Why document the empty and error states?"],
  check: [{ text: "Show one screen to someone who codes: they can say how it behaves without asking you." }],
}

const caseStudyTask: BuildTask = {
  id: "case-study",
  title: "Write the case study",
  why: "The case study is your portfolio piece: the problem, your research, your decisions and the outcome. Recruiters read it to see how you think.",
  screens: ["case-study"],
  prompt: "Help me edit my case study for clarity — don't rewrite it in your words. For each section (Problem, Users, Research, Flows, Design, Testing, Outcome), tell me if a reader would understand why I made my decisions, and where an image would explain better than text.",
  steps: [
    { text: "Finish every section in your my-case-study README on GitHub: before and after images, the research that drove each decision, and your test results. Link the prototype (view only)." },
    ...recordDemo("click through the prototype's main flow, explaining one decision your research drove"),
  ],
  understand: ["Which decision in your case study is best backed by evidence?", "What would you do next with another month?"],
  check: [{ text: "A friend who's never seen the project reads the case study in five minutes and can tell you the problem, what you found and what you changed." }],
}

function shipWeek(test: string, doneWhen: string[]): BuildWeek {
  return {
    intro: `Ship it: test with real people, fix what they struggled with, hand it off, and tell the story in your case study. ${weekly}`,
    tasks: [usabilityTask(test), handoffTask, caseStudyTask, finalReviewTask(doneWhen, "your prototype and case study")],
    done: ["Tested with 3–5 people, and iterated once", "Handoff notes on the UI page", "The case study is public, with the prototype and demo linked", "Your mentor has the links for the final review"],
  }
}

const structureWeek = (flows: string, screens: string, intro: string): BuildWeek => ({
  intro: `${intro} ${weekly}`,
  tasks: [personaJourneyTask, flowsTask(flows), wireframesTask(screens)],
  done: ["A persona and journey map grounded in research", "User flows with error paths", "Wireframes for every screen, after a feedback round"],
})

const visualWeek = (states: string): BuildWeek => ({
  intro: `Make it real: a mini design system, high-fidelity screens built from it, and a clickable prototype. ${weekly}`,
  tasks: [designSystemTask, hifiTask(states), prototypeTask],
  done: ["A mini design system with styles and components", "High-fidelity screens with every state", "A clickable prototype of the main flows"],
})

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

const redesignDone = ["Each change links to a research or testing finding.", "The prototype works end to end for the chosen flows.", "Test results show what improved (time, errors or confidence).", "The case study is public."]

const appRedesign: ProjectBuild = [
  {
    intro: `You've read Start here. Pick the app and flows, plan in your own words, then audit today's design and talk to its real users. ${weekly}`,
    tasks: [
      planTask({ design: true, parts: ["The app and flows — which app, which 1–2 flows, and why those (agree them with your mentor first).", "Problem statement — one sentence: who struggles, with what, and why it matters."], questions: ["Why these flows and not others?", "How will you know your redesign is better?"] }),
      {
        id: "audit",
        title: "Audit the current flow",
        why: "Before you ask anyone, look closely yourself: screenshot every step and find where it breaks good design rules.",
        screens: ["audit"],
        prompt: "I'll describe each screen of the current flow (or paste screenshots with personal details blurred). Help me review it against Nielsen's 10 usability heuristics: for each problem, name the heuristic, explain it in one line, and rate how serious it is (minor, major, critical). Don't suggest fixes yet.",
        steps: [{ text: "On the Research page, paste screenshots of every step of your flows in order, and add a numbered note on each problem you find." }],
        understand: ["Which problem is the most serious, and which heuristic does it break?", "Which problems do you need real users to confirm?"],
        check: [{ text: "Every step of your flows is on the Research page with annotated problems and a severity for each." }],
      },
      interviewTask("how people use this app's flows today"),
    ],
    done: ["A plan in your case study", "An annotated audit of today's flows", "Interviews with 3–5 users, affinity mapped"],
  },
  structureWeek("your 1–2 redesigned flows", "every step of your redesigned flows", "Turn research into structure: persona, journey, flows — and wireframes tested on two people."),
  visualWeek("empty, loading and error states for the main screens"),
  shipWeek("complete your main flow in the prototype", redesignDone),
]

const campusDone = ["The problem is backed by what students actually said.", "The core flow is fully clickable.", "Screens use the design system's components consistently.", "The case study is public."]

const campusApp: ProjectBuild = [
  {
    intro: `You've read Start here. Plan in your own words, then find the right problem — from what students actually say. ${weekly}`,
    tasks: [
      planTask({ design: true, parts: ["Discovery — how you'll find the problem: survey questions, who you'll ask, and how many.", "Choosing — how you'll decide which problem to solve once you have answers."], questions: ["Why not just pick a problem you have yourself?", "What would make a problem worth solving?"] }),
      {
        id: "survey",
        title: "Survey students",
        why: "A short survey to 15–20 students shows which everyday problems are common — so you interview about the right one.",
        screens: ["affinity"],
        prompt: "Help me write a short Google Form for students: 5–6 questions that find their most annoying everyday campus problems and how often they hit them, without suggesting answers. Then, once I paste the anonymised answers, help me count which problems come up most.",
        steps: [{ text: "Send it to 15–20 students (class groups work). Paste the anonymised answers into FigJam, one sticky per problem, and group them." }],
        understand: ["Which problem came up the most?", "Which survey question gave you the most useful answers, and why?"],
        check: [{ text: "Your FigJam board has every answer grouped, with a count on each group." }],
      },
      { ...interviewTask("the most common problem from my survey", " Then help me turn the strongest theme into a problem statement and 3 “How might we…” questions."), title: "Interview 5 students and define the problem" },
    ],
    done: ["A plan in your case study", "Survey results grouped and counted", "Interviews, an affinity map and a problem statement with HMW questions"],
  },
  structureWeek("onboarding and your core task", "onboarding, home and every step of the core task", "Persona, competitor scan in your journey, flows — and wireframes tested on two students."),
  visualWeek("empty, loading and error states for the key screens"),
  shipWeek("complete the core task from the home screen", campusDone),
]

const fintechDone = ["Every screen has error and recovery states.", "Each data request explains why it's needed.", "Test participants complete the flow without help.", "The case study is public."]

const fintech: ProjectBuild = [
  {
    intro: `You've read Start here. Plan in your own words, tear down three real onboarding flows, then learn what makes people trust — or abandon — a money app. ${weekly}`,
    tasks: [
      planTask({ design: true, parts: ["Trust — what makes a sign-up feel safe, and what makes people quit halfway.", "Scope — every step from phone number to “account ready”, including the error paths."], questions: ["Why does microcopy matter so much in KYC?", "Where do you expect people to drop off, and why?"] }),
      {
        id: "teardown",
        title: "Competitor teardown",
        why: "Three real onboarding flows show you what works, what annoys, and where people drop off.",
        screens: ["audit"],
        prompt: "I'll describe the onboarding screens of three fintech apps (screenshots with my details blurred). For each, help me note: number of steps, what data is asked and whether it's explained, how errors are handled, and the riskiest drop-off point. Then compare them in a table.",
        steps: [{ text: "Sign up to 3 fintech apps and screenshot every onboarding screen (follow Reference → Sample data — blur your details). Paste them on the Research page, one row per app." }],
        understand: ["Which app explains why it needs your data best?", "Where would you have quit, and why?"],
        check: [{ text: "Your Research page has all three flows, annotated, and a comparison table." }],
      },
      interviewTask("signing up for money apps — what made them trust or quit one"),
    ],
    done: ["A plan in your case study", "A teardown of three real onboarding flows", "Interviews, affinity mapped, with drop-off risks"],
  },
  structureWeek("the whole onboarding, including wrong OTP, rejected ID and resume-later paths", "every onboarding step, with the microcopy drafted", "Persona, a journey map with drop-off points, the full flow with error paths — and wireframes with draft microcopy."),
  visualWeek("wrong-OTP, resend, validation-error, verification-pending, failed and approved states"),
  shipWeek("open an account from the first screen, without help", fintechDone),
]

export const uiUxBuilds: Record<string, ProjectBuild> = {
  "app-redesign": appRedesign,
  "campus-app": campusApp,
  "fintech-onboarding": fintech,
}

/* ------------------------------------------------------------------ */
/* Screens — what you'll make, week by week                            */
/* ------------------------------------------------------------------ */

const figma = (title: string, page: string, blocks: ProjectScreen["mock"]["blocks"]): ProjectScreen["mock"] => ({ frame: "browser", title, url: `figma.com/design/…/${page.toLowerCase()}`, nav: ["Research", "Wireframes", "UI"], active: page === "Research" ? 0 : page === "Wireframes" ? 1 : 2, blocks })

function designScreens(opts: { name: string; themes: string[][]; persona: { who: string; goal: string; pain: string }; flow: string[]; wire: string[]; hifi: { title: string; value: string; caption: string; button: string }; audit: string[] }): ProjectScreen[] {
  return [
    {
      id: "audit",
      name: "Research page",
      purpose: "Week 1: the starting evidence — today's screens annotated, or what people told you.",
      shows: ["Screens or answers, in order", "Numbered problems with severity"],
      week: 1,
      mock: figma(opts.name, "Research", [{ kind: "list", title: "Problems found", items: opts.audit.map((a, i) => ({ title: `${i + 1}. ${a.split(" — ")[0]}`, right: a.split(" — ")[1] })) }]),
    },
    {
      id: "affinity",
      name: "Affinity map",
      purpose: "Week 1: every observation on a sticky, grouped into themes — your evidence for everything after.",
      shows: ["One sticky per observation, tagged P1–P5", "4–6 themes named as sentences"],
      week: 1,
      mock: { frame: "browser", title: "FigJam — research", url: "figma.com/board/…", blocks: [{ kind: "kanban", columns: opts.themes.map(([title, ...cards]) => ({ title, cards })) }] },
    },
    {
      id: "persona",
      name: "Persona and journey",
      purpose: "Week 2: who you're designing for, and where their experience goes wrong.",
      shows: ["Goals and frustrations backed by research", "A real (anonymised) quote", "A journey map with its low point"],
      week: 2,
      mock: { frame: "browser", title: "FigJam — research", url: "figma.com/board/…", blocks: [{ kind: "stat", label: opts.persona.who, value: opts.persona.goal, caption: opts.persona.pain }, { kind: "bars", title: "Journey: how it feels at each stage", values: [7, 5, 2, 4, 6], labels: ["Start", "Search", "Low point", "Recover", "Done"] }] },
    },
    {
      id: "flow",
      name: "User flow",
      purpose: "Week 2: every step and wrong turn through the main task.",
      shows: ["Each step in order", "Decision points and error paths"],
      week: 2,
      mock: figma(opts.name, "Wireframes", [{ kind: "list", title: "Main flow", items: opts.flow.map((f) => ({ title: f })) }]),
    },
    {
      id: "wireframe",
      name: "Wireframes",
      purpose: "Week 2: grey boxes with real text — the structure, tested on two people before any colour.",
      shows: ["Every screen of the flows", "Real text, no colour"],
      week: 2,
      mock: { frame: "phone", title: opts.wire[0], blocks: [{ kind: "form", title: "", fields: opts.wire.slice(1), button: "Continue" }] },
    },
    {
      id: "design-system",
      name: "Design system",
      purpose: "Week 3: the colours, type and components every screen is built from.",
      shows: ["Colour and text styles", "Components with their variants"],
      week: 3,
      mock: figma(opts.name, "UI", [{ kind: "kpis", items: [{ label: "primary/500", value: "■" }, { label: "danger/500", value: "■" }, { label: "Heading / L", value: "Aa" }, { label: "Body / M", value: "Aa" }] }, { kind: "cards", items: [{ title: "Button", meta: "Primary · Secondary · Disabled", badge: "3" }, { title: "Input", meta: "Default · Focus · Error", badge: "3" }] }]),
    },
    {
      id: "hifi",
      name: "High-fidelity screen",
      purpose: "Week 3: the real design, built only from your system, with every state.",
      shows: ["Your components and styles only", "Empty, loading and error states"],
      week: 3,
      mock: { frame: "phone", title: opts.hifi.title, blocks: [{ kind: "stat", label: opts.hifi.title, value: opts.hifi.value, caption: opts.hifi.caption }, { kind: "form", title: "", fields: [], button: opts.hifi.button }] },
    },
    {
      id: "prototype",
      name: "Clickable prototype",
      purpose: "Week 3: your design, usable before any code — the thing you test in week 4.",
      shows: ["Every main flow connected", "Error paths and Back work", "A view-only share link"],
      week: 3,
      mock: { frame: "browser", title: "Prototype", url: "figma.com/proto/…", blocks: [{ kind: "list", title: "Flows", items: [{ title: "Main flow", right: "▶ Play" }, { title: "Error path", right: "▶ Play" }] }] },
    },
    {
      id: "case-study",
      name: "Case study",
      purpose: "Week 4: the story of your project on GitHub — your portfolio piece.",
      shows: ["Problem, research, decisions and outcome", "Before and after images", "Test results and the prototype link"],
      week: 4,
      mock: { frame: "browser", title: "my-case-study", url: "github.com/you/my-case-study", blocks: [{ kind: "list", title: "README", items: ["Problem", "Users", "Research", "Flows", "Design", "Testing", "Outcome"].map((t) => ({ title: t, done: true })) }] },
    },
  ]
}

export const uiUxScreens: Record<string, ProjectScreen[]> = {
  "app-redesign": designScreens({
    name: "App redesign",
    audit: ["Too many taps to reorder — major", "Search hides filters — minor", "No way to undo a removed item — critical"],
    themes: [["People reorder the same things", "P1: “I order the same 5 items every week”", "P4: “I rebuild my cart every time”"], ["Search is hard to trust", "P2: “I never know if it found everything”"], ["Mistakes are hard to undo", "P3: “I removed it by accident and gave up”", "P5: “Where did my item go?”"]],
    persona: { who: "Priya, 21 — weekly grocery orderer", goal: "Reorder in under a minute", pain: "“I rebuild my cart from scratch every week.”" },
    flow: ["Open app", "Tap Reorder last basket", "Review items (remove / undo)", "Checkout", "Error: item out of stock → suggest a swap"],
    wire: ["Reorder", "Last week's basket (12 items)", "Remove an item", "Delivery slot"],
    hifi: { title: "Your usual basket", value: "12 items · ₹1,284", caption: "2 items out of stock — swaps suggested", button: "Reorder in one tap" },
  }),
  "campus-app": designScreens({
    name: "Campus app",
    audit: ["“Finding a free classroom to study” — 11 of 18", "“Knowing if the canteen queue is long” — 7 of 18", "“Sharing notes before exams” — 6 of 18"],
    themes: [["Free rooms are a guessing game", "P1: “I walk around three blocks to find a room”", "P3: “By the time I find one, I've lost 20 minutes”"], ["Timetables live in WhatsApp", "P2: “The room changed and nobody told us”"], ["Quiet matters more than size", "P4: “Any small room is fine if it's quiet”"]],
    persona: { who: "Arjun, 19 — second-year student", goal: "Find a quiet room in under 2 minutes", pain: "“I walk around three blocks every free period.”" },
    flow: ["Open app", "See free rooms now, nearest first", "Filter: quiet, plugs", "Check in to a room", "Error: room just taken → next nearest"],
    wire: ["Free rooms now", "Nearest: B-204 (free till 2 pm)", "Filters: quiet, plugs", "Check in"],
    hifi: { title: "Free rooms now", value: "B-204", caption: "Free until 2 pm · 2 min walk · quiet", button: "Check in" },
  }),
  "fintech-onboarding": designScreens({
    name: "Fintech onboarding",
    audit: ["App A: 11 steps, no progress bar — major", "App B: asks for PAN with no reason given — critical", "App C: wrong OTP clears the whole form — critical"],
    themes: [["People quit when they don't know why", "P1: “Why do they need my PAN already?”", "P5: “I didn't know how many steps were left”"], ["Errors feel like rejection", "P2: “It said failed and nothing else”"], ["Proof of safety builds trust", "P3: “The RBI line made me feel better”"]],
    persona: { who: "Sana, 23 — first salary, first money app", goal: "Open an account in one sitting", pain: "“I quit when it asked for my PAN with no reason.”" },
    flow: ["Phone number", "OTP (wrong OTP → retry, resend)", "Personal details", "PAN — with why we need it", "Selfie check", "Pending → approved / failed (retry)"],
    wire: ["Step 3 of 5 — Your PAN", "PAN (e.g. ABCDE1234F)", "Why we need this: required by RBI to verify you"],
    hifi: { title: "Step 3 of 5", value: "Your PAN", caption: "We need it because RBI requires us to verify every account.", button: "Verify PAN" },
  }),
}
