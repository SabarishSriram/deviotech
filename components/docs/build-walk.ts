import { trackArchitecture } from "@/data/docs/guides"
import type { BuildTask, BuildWeek, ProjectDocs, ProjectScreen, WalkAction, WalkPart, WalkStep } from "@/data/docs/types"
import type { Track, TrackSlug } from "@/data/tracks"

/*
 * Turns a project's week plan (data/docs/build/…) into a walkthrough.
 * Every task follows the same loop: branch → build it with AI → understand
 * it → check it → debug it → pull request. The loop itself is explained once
 * on the Build with AI page (data/docs/build-with-ai.ts).
 */

/** What the student already has from Setup, so the AI builds on it instead of starting over. */
const startingPoint: Partial<Record<TrackSlug, string>> = {
  "full-stack":
    "A repo called my-fullstack-app with two folders: client/ (React + TypeScript, made with Vite) and server/ (Express + TypeScript run with tsx, Prisma 6 and PostgreSQL). server/src/app.ts creates the Express app with cors and express.json() and has GET /health; server/src/index.ts starts it. server/.env has DATABASE_URL, JWT_SECRET, PORT=4000 and CLIENT_URL=http://localhost:5173. client/.env has VITE_API_URL=http://localhost:4000. Already installed in server: express, cors, dotenv, zod, bcrypt, jsonwebtoken, prisma.",
  backend:
    "A repo called my-api: Express + TypeScript (run with tsx), Prisma 6 with PostgreSQL, and Redis running in Docker (container name redis). src/app.ts creates the Express app with express.json() and GET /health; src/index.ts starts it. .env has DATABASE_URL, REDIS_URL, PORT=4000 and JWT_SECRET. Already installed: express, dotenv, zod, ioredis, jsonwebtoken, prisma. bcrypt is not installed yet.",
  frontend:
    "A repo called my-frontend-app: Next.js 16 with the App Router, TypeScript, Tailwind CSS and shadcn/ui (button, card and input already added). app/page.tsx shows a heading and a shadcn Button. @tanstack/react-query and zustand are installed but not set up. .env.local has NEXT_PUBLIC_APP_NAME and TMDB_API_KEY, and .env.example lists them. In Next.js 16, middleware is called proxy.ts.",
  "app-development":
    "A repo called my-mobile-app: an Expo app (SDK 58) with Expo Router and TypeScript, made with create-expo-app. Screens live in src/app (index.tsx, explore.tsx, _layout.tsx) and components in src/components. It runs in Expo Go on my phone over Wi-Fi with npx expo start. .env has EXPO_PUBLIC_API_URL=http://<my laptop's Wi-Fi address>:4000. I use npx expo install to add native libraries, and npx eas-cli@latest for builds.",
  "ai-ml":
    "A repo called my-ml-project with a Python virtual environment in .venv (always switched on), and numpy, pandas, scikit-learn, matplotlib, jupyterlab and python-dotenv installed and listed in requirements.txt. Folders: data/ (raw files go in data/raw/, which Git ignores), notebooks/ and app/. config.py at the top reads .env with DATA_DIR and LLM_API_KEY. I explore in Jupyter notebooks and put reusable code in app/.",
  "data-science":
    "A repo called my-analysis with a Python virtual environment in .venv (always switched on), and pandas, matplotlib, plotly, jupyterlab, streamlit and python-dotenv installed and listed in requirements.txt. Folders: data/ (raw files go in data/raw/, which Git ignores), notebooks/ and dashboard/. config.py at the top reads .env with DATA_DIR. sqlite3 comes with Python. I explore in Jupyter notebooks, put reusable code in app/, SQL in sql/, and the Streamlit dashboard in dashboard/.",
  python:
    "A repo called my-python-tool with a Python virtual environment in .venv (always switched on), and requests, fastapi[standard], pydantic, pytest and python-dotenv installed and listed in requirements.txt. app/ is a package: app/main.py is an argparse program run with python -m app.main, and app/config.py reads .env (DATABASE_PATH, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID). tests/ holds pytest tests, run with python -m pytest.",
  java:
    "A repo called my-java-api: Spring Boot (latest, from start.spring.io) with Maven, Java 21, and the dependencies Spring Web, Spring Data JPA, PostgreSQL Driver and Validation. The package is com.example.my_java_api, with MyJavaApiApplication.java and a HealthController (GET /health). application.properties imports .env (spring.config.import=optional:file:.env[.properties]) for DATABASE_URL, DATABASE_USER and DATABASE_PASSWORD, pointing at a local PostgreSQL database called devvy_java. I run it with ./mvnw spring-boot:run and test with ./mvnw test.",
  "ui-ux":
    "A Figma design file named after my project with three pages (Research, Wireframes, UI) and a FigJam board for research notes, both shared with my mentor as can view. A public GitHub repo, my-case-study, whose README has the headings of my case study (Problem, Users, Research, Flows, Design, Testing, Outcome), which I fill in each week.",
}

const bullets = (items: string[]) => items.map((i) => `- ${i}`).join("\n")

/** The text a student pastes at the start of every AI chat about their project. */
export function projectBrief(track: Track, project: ProjectDocs, name: string) {
  const arch = trackArchitecture[track.slug]
  const sections = [
    `I'm a student building "${name}" in the Devvy Tech ${track.name} course. I'm learning, so I need to understand everything you write — explain it as you go.`,
    `## The project\n${project.pitch}`,
    `## Tech stack\n${track.skills.join(", ")}`,
    startingPoint[track.slug] ? `## What I already have\n${startingPoint[track.slug]}` : "",
    `## Must have\n${bullets(project.mustHave)}`,
    `## ${arch.dataTitle}\n${bullets(project.data.map((d) => `${d.name}: ${d.fields.join(", ")}`))}`,
    `## ${arch.interfaceTitle}\n${bullets(project.interface.map((i) => `${i.label} — ${i.detail}`))}`,
    `## Out of scope\n${bullets(project.outOfScope)}`,
    track.slug === "ui-ux"
      ? `## How to help me
- I'll give you one small task at a time. Only do that task.
- Don't design for me. Ask me questions, give me options with their trade-offs, and critique what I show you.
- Never invent research findings, quotes or users. Everything must come from real people I talk to.
- I'll never paste participants' names or personal details. Don't ask for them.
- When you suggest something, tell me which design principle or research finding it's based on.`
      : `## How to help me
- I'll give you one small task at a time. Only do that task — don't add features I didn't ask for.
- Before writing code, tell me which files you'll create or change, and why.
- Write simple, readable code a beginner can follow. Explain anything that isn't obvious.
- Never hard-code passwords or keys. Use environment variables.
- When I paste an error, explain what caused it before you suggest a fix.`,
  ]
  return sections.filter(Boolean).join("\n\n")
}

const isDesign = (track: Track) => track.slug === "ui-ux"

/** Screen ids in walkthrough steps: "screen:<id>" for one, "screens:<id>,<id>" for a task's set. */
export const screenKey = (ids: string[]) => (ids.length === 1 ? `screen:${ids[0]}` : `screens:${ids.join(",")}`)

function taskSteps(track: Track, task: BuildTask, screens: ProjectScreen[]): WalkStep[] {
  const steps: WalkStep[] = []
  const building = (task.screens ?? []).map((id) => screens.find((s) => s.id === id)).filter((s): s is ProjectScreen => Boolean(s))

  if (task.branch) {
    steps.push({
      title: "Start a branch",
      actions: [{ text: "Get the latest main, then make a branch for this task — one command at a time:", code: `git checkout main\ngit pull\ngit checkout -b ${task.branch}` }],
      check: [{ text: `The bottom-left corner of VS Code shows ${task.branch}.` }],
    })
  }

  if (building.length) {
    steps.push({
      title: building.length === 1 ? "Look at the screen you're building" : "Look at the screens you're building",
      why: "Know exactly what it should look like and do before you ask AI for anything.",
      actions: building.flatMap((s): WalkAction[] => [
        { text: `${s.name} — ${s.purpose}` },
        { text: `It must show: ${s.shows.join("; ")}.${s.calls ? ` It talks to ${s.calls.join(", ")}.` : ""}` },
      ]),
      screen: screenKey(building.map((s) => s.id)),
      caption: "Yours can look different. It must do the same things.",
    })
  }

  steps.push({
    title: "Build it with AI",
    why: "Ask for a plan first and the code one file at a time. A small answer is one you can actually read — and debug later.",
    actions: [
      { text: "In the chat where you pasted your project brief (start a new one with the brief if it's gone), send:", code: task.prompt, wrap: true },
      { text: "Read its plan before any code: which files, and why. If it wants to add something your project doesn't need, tell it no." },
      {
        text: isDesign(track)
          ? "Use what it gives you as a starting point. You make the design decisions — AI only drafts."
          : "Add the code to your files yourself, one file at a time, reading every line as you go. Don't paste a file you haven't read.",
      },
    ],
  })

  if (task.steps?.length) {
    steps.push({ title: "Do these yourself", actions: task.steps })
  }

  steps.push({
    title: "Understand it",
    why: isDesign(track)
      ? "Your mentor will ask you these in your weekly review. Every decision needs a reason you can say out loud."
      : "Your mentor will ask you these in the review. If you can't answer them, the pull request doesn't get merged.",
    actions: task.understand.map((q): WalkAction => ({ text: q })),
    note: "Stuck on one? Ask your AI to explain that exact line or decision in simple words, then check the answer against the official docs. AI is sometimes confidently wrong.",
  })

  steps.push({
    title: "Check it works",
    actions: [{ text: "Do every check below yourself. Don't move on until they all pass." }],
    check: task.check,
  })

  steps.push({
    title: isDesign(track) ? "If you're stuck" : "If it doesn't work",
    actions: [
      ...(task.debug ?? []).map((d): WalkAction => ({ text: d })),
      {
        text: isDesign(track)
          ? "Still stuck? Write down what you tried and what you're unsure about, take a screenshot, and email your mentor — or bring it to your weekly review."
          : "Anything else: read the error from the top, find the file and line it points to, and check what the values really are there (log them). Then ask AI with the error, the code and what you already tried — and ask why it broke, not just for a fix.",
      },
    ],
  })

  if (task.branch) {
    steps.push({
      title: "Commit and open a pull request",
      actions: [
        { text: "In a terminal that isn't running anything, one command at a time:", code: `git add .\ngit status\ngit commit -m "${task.commit ?? task.title}"\ngit push -u origin ${task.branch}\ngh pr create --fill` },
        { text: "Check git status before you commit: no .env file in the list." },
        { text: "Write the description with What / Why / How to test / AI usage. Under AI usage, say what AI wrote and what you changed or fixed yourself." },
        { text: "Request your mentor's review, email them the link, and merge when approved — the loop from How we work." },
      ],
    })
  } else if (isDesign(track) && task.id !== "plan") {
    steps.push({
      title: "Save it and write it up",
      actions: [
        { text: `Save a named version in Figma: click the file name → Save to version history, and call it ${task.title}.` },
        { text: "Add a few lines to this week's section of your case study README: what you did, what you decided, and why." },
      ],
    })
  }

  return steps
}

/** One week of the project as a walkthrough: "Before you start", then one part per task. */
export function weekWalk(track: Track, project: ProjectDocs, name: string, week: BuildWeek, index: number, screens: ProjectScreen[] = []) {
  const plan = track.weeks[index]
  const start: WalkPart = {
    id: "start",
    title: "Before you start",
    time: "5 min",
    intro: "Two things before the first task: know where the week ends up, and set up your AI chat.",
    steps: [
      {
        title: "Read this week's plan",
        actions: [
          {
            text:
              week.tasks.length === 1
                ? `This week has one task.${isDesign(track) ? "" : " It's one branch and one pull request."}`
                : `This week has ${week.tasks.length} tasks. ${isDesign(track) ? "Do them in order." : "Each one is one branch and one pull request — do them in order, and get each one merged before starting the next."}`,
          },
          { text: `By the end of the week: ${plan.deliverable}.` },
          ...(index === 0 ? [{ text: "Read Start here first, in the sidebar. It shows the whole project — screens, diagrams and data — before you plan any of it." }] : []),
          { text: "New to building with AI? Read Building → Build with AI first. It explains the loop every task below follows." },
        ],
      },
      {
        title: "Give your AI the project brief",
        why: "AI only knows what you tell it. This brief says what you're building, with which tools, and how to help you learn. Paste it at the start of every new chat about your project.",
        actions: [
          { text: "Open your AI tool — Claude (claude.ai), Cursor's chat, or Copilot Chat in VS Code — and start a new chat." },
          { text: "Copy this whole brief, paste it in and send it:", code: projectBrief(track, project, name), wrap: true },
        ],
        note: "Never paste your .env file, passwords or keys into an AI tool.",
      },
    ],
  }

  // Week 1: see every screen before planning anything.
  const screenPart: WalkPart | null =
    index === 0 && screens.length
      ? {
          id: "screens",
          title: "The screens you'll build",
          time: "10 min",
          intro: `Your project has ${screens.length} screens. Look at each one: what it's for, what's on it, and what it talks to. You'll plan around these. Each one says which week you build it in.`,
          steps: screens.map((s, i) => ({
            title: `Screen ${i + 1}: ${s.name}`,
            why: s.purpose,
            actions: [
              ...s.shows.map((item): WalkAction => ({ text: item })),
              ...(s.calls ? [{ text: `Talks to: ${s.calls.join(", ")}` }] : []),
            ],
            note: `You build this in Week ${s.week}.`,
            screen: screenKey([s.id]),
          })),
        }
      : null

  const parts: WalkPart[] = [
    start,
    ...(screenPart ? [screenPart] : []),
    ...week.tasks.map((task, i) => ({
      id: task.id,
      title: `Task ${i + 1}: ${task.title}`,
      intro: task.why,
      steps: taskSteps(track, task, screens),
    })),
  ]

  return { parts, done: [...week.done, `Deliverable: ${plan.deliverable}`] }
}
