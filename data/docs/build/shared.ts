import type { BuildTask, WalkAction } from "@/data/docs/types"

/*
 * Task builders every track's week plans reuse: the Week 1 plan, the README
 * and demo, the final review, and REST Client request files for APIs.
 * Full-Stack (full-stack.ts) predates these and keeps its own copies.
 */

/**
 * Week 1's plan, in the student's own words. AI interviews them instead of
 * writing it. `parts` are the plan's sections after "Build order".
 */
export function planTask(opts: { parts: string[]; questions: string[]; design?: boolean }): BuildTask {
  const sections = ["Build order — every Must have feature from my brief as a checklist, in the order I'll build them, and why that order.", ...opts.parts, "One decision — one choice I made (a library, a rule, a trade-off), and why.", "Questions — anything I'm unsure about, for my mentor."]
  return {
    id: "plan",
    title: "Write your plan, in your own words",
    why: "Reading Start here tells you what to build. Writing the plan yourself proves you understood it — and gives your mentor something to sign off before you start.",
    branch: opts.design ? undefined : "docs/plan",
    prompt: `Don't write this for me. Interview me, one question at a time, to help me write ${opts.design ? "my project plan" : "docs/plan.md"}. Cover:\n${sections.map((s, i) => `${i + 1}. ${s}`).join("\n")}\nAfter each answer, tell me if it's unclear or wrong and why. At the end, turn my answers into the plan, keeping my words.`,
    steps: [
      opts.design
        ? { text: "Add a Plan section to your case study README on GitHub (click the pencil icon), and paste the finished plan there." }
        : { text: "In the Explorer, right-click the empty space → New File… → type docs/plan.md and press Enter." },
    ],
    understand: ["Which feature will you build first, and why that one?", "Pick one screen from Start here: what does it need from the rest of your project?", ...opts.questions],
    check: [{ text: `Read the plan back: every part is filled in, in your own words.${opts.design ? "" : " Preview it in VS Code with Ctrl + Shift + V (Cmd + Shift + V on a Mac)."}` }],
    debug: ["The AI starts writing the whole plan for you: remind it to ask one question at a time and wait for your answers."],
    commit: "Add project plan",
  }
}

/** Recording a 2–3 minute demo, per OS. */
export const recordDemo = (what: string): WalkAction[] => [
  { os: ["mac"], text: `Record a 2–3 minute demo: press Cmd + Shift + 5, choose Record Selected Portion, and ${what} while you talk.` },
  { os: ["windows"], text: `Record a 2–3 minute demo: open the Snipping Tool, switch to Record (the video icon), select the window, and ${what} while you talk.` },
  { os: ["linux"], text: `Record a 2–3 minute demo: press Print Screen, switch to the screen recorder (the video icon), select the window, and ${what} while you talk.` },
  { text: "Upload it to YouTube as Unlisted (or Google Drive, shared as Anyone with the link) and put the link in the README." },
]

export function readmeTask(opts: { name: string; sections: string; demo: string; check: string }): BuildTask {
  return {
    id: "readme",
    title: "README and demo video",
    why: "The README is the first thing a recruiter or your mentor sees. It should say what the project does, show it, and let anyone run it.",
    branch: "docs/readme",
    prompt: `Write the README for ${opts.name} using my brief and docs/plan.md. Sections: what it does (2–3 sentences), ${opts.sections}. Keep it short and plain, and leave placeholders for screenshots and the demo link.`,
    steps: [{ text: "Add 2–4 screenshots: drag them into the README on GitHub, or save them in docs/ and link them." }, ...recordDemo(opts.demo)],
    understand: ["If a stranger cloned your repo today, which step would they get stuck on?", "Why do you list environment variable names but never their values?"],
    check: [{ text: "Clone your repo into a new folder and follow your own README from the top. It works without you guessing anything." }, { text: opts.check }],
    debug: ["Screenshots don't show on GitHub: the image path is relative to the README — docs/home.png, not /docs/home.png."],
    commit: "Write README with demo",
  }
}

export function finalReviewTask(doneWhen: string[], where = "your project"): BuildTask {
  return {
    id: "final-review",
    title: "Get ready for your final review",
    why: `In the final review your mentor uses ${where}, reads your work and asks you to explain it. Practise that first.`,
    prompt: `Act as a strict senior reviewer. Here is what “done” means for my project:\n${doneWhen.map((d) => `- ${d}`).join("\n")}\nAsk me 10 questions, one at a time, that a reviewer would ask about my work, my decisions and a problem I solved. Wait for my answer each time, then tell me what a stronger answer would include.`,
    steps: [
      { text: "Read Reviews → Review rubric and Reviews → Submission checklist, and tick every line." },
      { text: "Tick off every feature in the checklist in your plan, so it matches what you built." },
      { text: "Email your mentor: the links (live project, repo, demo video) and one line on what you're proudest of." },
    ],
    understand: [
      "Explain the hardest problem you hit: what you saw, how you found the cause, and how you fixed it.",
      "Which part did AI produce that you had to change, and why?",
      "If you had one more week, what would you build or fix first?",
    ],
    check: doneWhen.map((d) => ({ text: d })),
  }
}

/** A REST Client request file (the VS Code extension), the same on every OS. */
export function requestsFile(path: string, base: string, body: string): WalkAction[] {
  return [
    { text: "Install the REST Client extension if you haven't (Extensions → search REST Client, by Huachao Mao). It sends API requests from a file, the same way on every computer." },
    { text: `Create ${path} and paste this. Each ### block is one request — click Send Request above it to run it:`, file: path, code: `@api = ${base}\n\n${body}` },
  ]
}

/** Signup + login requests, with the token saved as {{login.response.body.token}}. */
export const authRequests = (signupExtra = "") => `### Sign up
POST {{api}}/api/auth/signup
Content-Type: application/json

{ "name": "Asha", "email": "asha@example.com", "password": "secret123"${signupExtra} }

### Log in
# @name login
POST {{api}}/api/auth/login
Content-Type: application/json

{ "email": "asha@example.com", "password": "secret123" }

### Wrong password
POST {{api}}/api/auth/login
Content-Type: application/json

{ "email": "asha@example.com", "password": "nope" }`

export const authUnderstand = [
  "Why do you store a bcrypt hash instead of the password? What would an attacker get if they stole your database?",
  "What's inside your JWT? Why must a password never go in it?",
  "What does your auth middleware do when the token is missing, invalid or expired?",
]

export const authDebug = [
  "Every request says 401: the header must be exactly Authorization: Bearer <token> — one space, no quotes.",
  "“secretOrPrivateKey must have a value”: JWT_SECRET isn't in .env, or the server wasn't restarted after you added it.",
]

/** "Tick every week" lines that close every week. */
export const mergedLine = "Every task merged through a reviewed pull request"
