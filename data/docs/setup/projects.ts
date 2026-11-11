import type { OS, WalkAction, WalkPart, WalkStep } from "@/data/docs/types"

/*
 * The "create your project" and "starting work next time" parts for every
 * code track except Full-Stack (which lives in data/docs/fullstack-setup.ts).
 * Screen ids are `${key}-…` and live in components/docs/screens/projects.tsx.
 */

const MAC: OS[] = ["mac"]
const WIN: OS[] = ["windows"]
const NIX: OS[] = ["mac", "linux"]
const WL: OS[] = ["windows", "linux"]

/* ------------------------------------------------------------------ */
/* Steps every project shares                                          */
/* ------------------------------------------------------------------ */

function repoCreateStep(key: string, repo: string): WalkStep {
  return {
    title: "Create the repository",
    why: "A repository (repo) is a project folder that Git tracks, with a copy on GitHub.",
    actions: [
      { text: "In VS Code's terminal — still in devvy — run:", code: `gh repo create ${repo} --public --clone` },
      { text: `This creates an empty repository on your GitHub account and downloads it here as a new folder called ${repo}.` },
    ],
    screen: `${key}-repo-create`,
    check: [{ text: `It says Created repository yourname/${repo} on GitHub (1). A warning that you “cloned an empty repository” is expected.` }],
  }
}

function openProjectStep(key: string, repo: string): WalkStep {
  return {
    title: "Open the project folder",
    why: "From now on, VS Code and its terminal should work inside your project folder, not devvy.",
    actions: [
      { os: MAC, text: "In the menu bar at the top of the screen, click File → Open Folder…" },
      { os: WL, text: "In VS Code's menu bar, click File → Open Folder…" },
      { text: `Go into devvy, click ${repo} once to select it (1), and open it (2).` },
      { text: "If VS Code asks whether you trust the authors, click Yes, I trust the authors." },
    ],
    screen: `${key}-pick-project`,
  }
}

function projectTerminalStep(key: string, repo: string): WalkStep {
  return {
    title: "Open a terminal in the project",
    actions: [{ text: "Click Terminal → New Terminal. Then check where you are:", code: "pwd" }],
    screen: `${key}-project-terminal`,
    check: [{ text: `The Explorer shows ${repo.toUpperCase()}, and pwd ends in ${repo} (1).` }],
  }
}

function newFileActions(path: string, code: string, where = "the empty space below the files in the Explorer"): WalkAction[] {
  return [
    { text: `Right-click ${where} and choose New File…` },
    { text: `Type ${path} and press Enter. The new, empty file opens.` },
    { os: MAC, text: "Paste this in and save with Cmd + S:", file: path, code },
    { os: WL, text: "Paste this in and save with Ctrl + S:", file: path, code },
  ]
}

function commitStep(key: string, opts: { message: string; mustNotSee: string; terminalHint?: string }): WalkStep {
  return {
    title: "Save your first snapshot (commit)",
    why: "A commit is a saved snapshot of your project with a message describing it. How we work explains this properly — for now, follow along.",
    actions: [
      ...(opts.terminalHint ? [{ text: opts.terminalHint }] : []),
      { text: "Tell Git to include every file:", code: "git add ." },
      { text: "Check what Git is about to save:", code: "git status" },
      { text: `Your files are listed in green (1). Make sure ${opts.mustNotSee} is NOT in the list — if it is, check your .gitignore.` },
      { text: "Save the snapshot with a message:", code: `git commit -m "${opts.message}"` },
    ],
    screen: `${key}-git-status`,
    note: "On Windows you may see warnings like “LF will be replaced by CRLF”. They're harmless.",
  }
}

function pushStep(key: string): WalkStep {
  return {
    title: "Upload it to GitHub (push)",
    why: "Push sends your commits to GitHub. -u origin main tells Git where to send them; after this once, plain git push is enough.",
    actions: [{ text: "Run:", code: "git push -u origin main" }],
    screen: `${key}-git-push`,
    check: [{ text: "It ends with branch 'main' set up to track 'origin/main' (1)." }],
  }
}

function seeOnGitHubStep(key: string, what: string): WalkStep {
  return {
    title: "See it on GitHub",
    actions: [
      { text: "Open your repository in the browser:", code: "gh repo view --web" },
      { text: `You'll see ${what} (1) and your commit message (2).` },
    ],
    screen: `${key}-github-repo`,
  }
}

/** Done once per repo, in Setup, so the invite is accepted before the first pull request. */
export function collaboratorStep(screen: string): WalkStep {
  return {
    title: "Add your mentor to the repository",
    why: "Your mentor reviews every pull request you open. GitHub only lets you ask them for a review once they're a collaborator on the repo — and they need to accept your invite first, so you send it now.",
    actions: [
      { text: "Your mentor's GitHub username is in the welcome email we sent you." },
      { text: "On your repository page, click Settings at the top, then Collaborators in the left menu (1)." },
      { text: "Click Add people, type your mentor's GitHub username (2), and click Add … to this repository (3)." },
    ],
    screen,
    check: [{ text: "Your mentor is listed under Collaborators as Pending invite. It changes once they accept — you don't need to wait." }],
    note: "GitHub may ask for your password first. That's normal for Settings pages.",
  }
}

function nextTimePart(key: string, repo: string, start: WalkAction[], extra: WalkStep[] = []): WalkPart {
  return {
    id: "next-time",
    title: "Starting work next time",
    time: "1 min",
    intro: "Do this every time you sit down to work on your project.",
    steps: [
      {
        title: "Open your project",
        actions: [
          { os: MAC, text: `Open VS Code. In the menu bar at the top, click File → Open Recent (1) → ${repo} (2).` },
          { os: WL, text: `Open VS Code. Click File → Open Recent (1) → ${repo} (2).` },
        ],
        screen: `${key}-open-recent`,
      },
      ...extra,
      {
        title: "Start it",
        actions: [...start, { text: "To stop it, click into its terminal and press Ctrl + C." }],
      },
    ],
  }
}

/* ------------------------------------------------------------------ */
/* Backend — Express + TypeScript + Prisma + Redis                     */
/* ------------------------------------------------------------------ */

const TSCONFIG =
  '{\n  "compilerOptions": {\n    "target": "ES2022",\n    "module": "NodeNext",\n    "moduleResolution": "NodeNext",\n    "rootDir": "src",\n    "outDir": "dist",\n    "strict": true,\n    "esModuleInterop": true,\n    "skipLibCheck": true\n  },\n  "include": ["src"]\n}'

const API_APP =
  'import express from "express"\n\nexport const app = express()\n\napp.use(express.json())\n\n// A tiny route to check the server is alive\napp.get("/health", (req, res) => {\n  res.json({ ok: true })\n})'

const API_INDEX =
  'import "dotenv/config"\nimport { app } from "./app.js"\n\nconst port = Number(process.env.PORT) || 4000\n\napp.listen(port, () => {\n  console.log("API running on http://localhost:" + port)\n})'

export const backendProject: WalkPart = {
  id: "project",
  title: "Create your project",
  time: "30 min",
  intro:
    "Now you'll build the skeleton of your API: an Express server written in TypeScript, connected to PostgreSQL through Prisma, with Redis running in Docker — and save the first version to GitHub.",
  steps: [
    repoCreateStep("be", "my-api"),
    openProjectStep("be", "my-api"),
    projectTerminalStep("be", "my-api"),
    {
      title: "Install the libraries",
      why: "express runs the web server, dotenv reads your .env settings file, zod checks incoming data, ioredis talks to Redis, and jsonwebtoken handles logins. typescript and tsx let you write the server in TypeScript.",
      actions: [
        { text: "Create package.json, the file that lists your project's libraries:", code: "npm init -y" },
        { text: "Install the libraries the API uses:", code: "npm install express dotenv zod ioredis jsonwebtoken" },
        { text: "Install the development tools:", code: "npm install -D typescript tsx @types/node @types/express @types/jsonwebtoken" },
        {
          text: "Install Prisma, which talks to the database for you. The @6 picks version 6, so what you see matches these docs exactly:",
          code: "npm install @prisma/client@6\nnpm install -D prisma@6",
        },
      ],
      screen: "be-install",
      check: [{ text: "Each install ends with added … packages (1). A few “warn” lines are normal; “ERR!” lines are not." }],
    },
    {
      title: "Add the scripts",
      why: "Scripts are shortcuts. npm run dev starts your API and restarts it every time you save. build and start are for deploying in week 4. type=module lets you use modern import statements.",
      actions: [
        {
          text: "This is one command — copy all of it:",
          code: 'npm pkg set "type=module" "scripts.dev=tsx watch src/index.ts" "scripts.build=tsc" "scripts.start=node dist/index.js"',
        },
        { text: "Open package.json in the Explorer to see the result (1)." },
      ],
      screen: "be-package-json",
    },
    {
      title: "Create the TypeScript settings file",
      actions: newFileActions("tsconfig.json", TSCONFIG),
      screen: "be-tsconfig",
      note: "A white dot on a file's tab means it has unsaved changes. Get in the habit of saving after every paste.",
    },
    {
      title: "Write the Express app",
      why: "This file describes your API. Right now it has one route, /health, which simply answers “I'm alive” — a quick way to check everything works.",
      actions: [
        { text: "Right-click the empty space in the Explorer → New File…, type src/app.ts and press Enter. VS Code creates the src folder for you." },
        { text: "Paste this in and save:", file: "src/app.ts", code: API_APP },
      ],
      screen: "be-editor-app",
    },
    {
      title: "Write the file that starts the server",
      why: "app.ts describes the API; index.ts switches it on. Keeping them apart makes testing easier later.",
      actions: [
        { text: "Right-click the src folder → New File…, type index.ts and press Enter." },
        { text: "Paste this in and save:", file: "src/index.ts", code: API_INDEX },
      ],
      screen: "be-editor-index",
      note: "Yes, it imports ./app.js even though the file is app.ts — that's how modern Node.js imports work, and tsx understands it.",
    },
    {
      title: "Set up Prisma",
      why: "Prisma is how your code talks to the database. schema.prisma describes your database; you'll add your tables in week 1.",
      actions: [
        { text: "In the terminal, run:", code: "npx prisma init" },
        { text: "It creates a prisma folder containing schema.prisma, plus a .env file, a .gitignore and prisma.config.ts (Prisma's own settings — leave that one as it is)." },
        {
          text: "Open prisma › schema.prisma, delete everything in it, paste this, and save:",
          file: "prisma/schema.prisma",
          code: 'generator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}',
        },
      ],
      screen: "be-editor-schema",
      note: 'If your mentor said your project uses MongoDB, change "postgresql" to "mongodb" and use your Atlas connection string in the next step.',
    },
    {
      title: "Fill in your .env file",
      why: ".env holds settings that are only for your computer, like your database password. It never goes to GitHub — Environment & secrets explains why.",
      actions: [
        { os: MAC, text: "First, find your Mac username:", code: "whoami" },
        {
          os: MAC,
          text: "Open .env, delete everything in it, and paste this — replacing asha with the username whoami printed. Save.",
          file: ".env",
          code: 'DATABASE_URL="postgresql://asha@localhost:5432/devvy_api"\nREDIS_URL="redis://localhost:6379"\nPORT=4000',
        },
        {
          os: WL,
          text: "Open .env, delete everything in it, and paste this — replacing devvy123 with the PostgreSQL password you chose. Save.",
          file: ".env",
          code: 'DATABASE_URL="postgresql://postgres:devvy123@localhost:5432/devvy_api"\nREDIS_URL="redis://localhost:6379"\nPORT=4000',
        },
        { text: "devvy_api is the name of the database Prisma creates for this project in the next step." },
      ],
      screen: "be-editor-env",
    },
    {
      title: "Connect to the database",
      actions: [
        { os: MAC, text: "Make sure Postgres.app is open and says Running." },
        { text: "Run:", code: "npx prisma migrate dev --name init" },
      ],
      screen: "be-prisma-migrate",
      check: [{ text: "It says the database devvy_api was created (1) — or “already in sync” if you run it again. Either means you're connected." }],
      warn: "Error P1001 (can't reach the database) means PostgreSQL isn't running. Error P1000 (authentication failed) means the username or password in .env is wrong.",
    },
    {
      title: "Start Redis in Docker",
      why: "Redis is a very fast store you'll use for caching in week 3. Docker downloads and runs it for you — no install.",
      actions: [
        { text: "Make sure Docker Desktop is open and says Engine running." },
        {
          text: "Run this. -d keeps it running in the background, and -p 6379:6379 lets your API reach it:",
          code: "docker run -d --name redis -p 6379:6379 redis",
        },
        { text: "Check it's running:", code: "docker ps" },
      ],
      screen: "be-redis",
      check: [{ text: "docker ps lists a container named redis with status Up (1)." }],
    },
    {
      title: "Start the server",
      actions: [{ text: "Run:", code: "npm run dev" }],
      screen: "be-api-running",
      check: [{ text: "It prints API running on http://localhost:4000 (1). Leave this terminal running." }],
    },
    {
      title: "Check it in your browser",
      actions: [{ text: "Open a new browser tab and go to http://localhost:4000/health" }],
      screen: "be-health",
      check: [{ text: 'You see {"ok":true} (1). Your API works! 🎉' }],
    },
    {
      title: "Keep secrets and junk out of Git",
      why: "This file lists what Git must never save: node_modules (huge, and anyone can re-download it), .env (it has your database password) and dist (build output).",
      actions: [
        {
          text: "prisma init may have created a .gitignore already. If you see one in the Explorer, open it; if not, right-click the empty space in the Explorer → New File… and type .gitignore.",
        },
        { text: "Make sure it contains exactly these lines, and save:", file: ".gitignore", code: "node_modules\n.env\ndist" },
      ],
      screen: "be-gitignore",
    },
    commitStep("be", {
      message: "Initial project setup",
      mustNotSee: ".env",
      terminalHint: "Click + in the terminal panel for a second terminal (the first one is running your server).",
    }),
    pushStep("be"),
    seeOnGitHubStep("be", "your prisma and src folders and your files"),
    collaboratorStep("be-collaborators"),
  ],
}

export const backendNextTime = nextTimePart(
  "be",
  "my-api",
  [
    { text: "Open Docker Desktop and wait for Engine running. Then, in a terminal, start Redis again:", code: "docker start redis" },
    { text: "Start the API:", code: "npm run dev" },
  ],
  []
)

/* ------------------------------------------------------------------ */
/* Frontend — Next.js                                                  */
/* ------------------------------------------------------------------ */

const PAGE_1 =
  'export default function Home() {\n  return (\n    <main className="flex min-h-screen flex-col items-center justify-center gap-4">\n      <h1 className="text-4xl font-bold">My Frontend App</h1>\n      <p className="text-zinc-500">Built with Next.js and Tailwind CSS.</p>\n    </main>\n  )\n}'

const PAGE_2 =
  'import { Button } from "@/components/ui/button"\n\nexport default function Home() {\n  return (\n    <main className="flex min-h-screen flex-col items-center justify-center gap-4">\n      <h1 className="text-4xl font-bold">My Frontend App</h1>\n      <p className="text-zinc-500">Built with Next.js and Tailwind CSS.</p>\n      <Button>Get started</Button>\n    </main>\n  )\n}'

export const frontendProject: WalkPart = {
  id: "project",
  title: "Create your project",
  time: "20 min",
  intro:
    "You'll create a Next.js website with TypeScript and Tailwind CSS, add the shadcn/ui component library, change the page yourself, and put it on GitHub.",
  steps: [
    {
      title: "Create the Next.js app",
      why: "create-next-app builds a complete, ready-to-run Next.js project in one command, so you don't start from a blank page.",
      actions: [
        { text: "In VS Code's terminal — still in devvy — run:", code: "npx create-next-app@latest my-frontend-app" },
        { text: "If it says Ok to proceed? (y), type y and press Enter." },
        {
          text: "When it asks whether to use the recommended Next.js defaults, press Enter to choose Yes (1). If it asks one question at a time instead, press Enter for each one to keep the default answer.",
        },
        { text: "It downloads everything, which takes a minute or two." },
      ],
      screen: "fe-create",
      check: [{ text: "It ends with Success! Created my-frontend-app (2)." }],
    },
    openProjectStep("fe", "my-frontend-app"),
    {
      title: "Start it",
      actions: [
        { text: "Click Terminal → New Terminal, then run:", code: "npm run dev" },
        { os: MAC, text: "It prints Local: http://localhost:3000 (1). Hold Cmd and click that link." },
        { os: WL, text: "It prints Local: http://localhost:3000 (1). Hold Ctrl and click that link." },
      ],
      screen: "fe-dev",
    },
    {
      title: "See your website",
      actions: [
        { text: "Your browser shows the Next.js starter page (1). It's running on your own computer." },
        { text: "Leave that terminal running. If you close it, the website stops." },
      ],
      screen: "fe-browser-start",
    },
    {
      title: "Make it yours",
      why: "Next.js reloads the page as soon as you save — the fastest way to learn is to change something and watch.",
      actions: [
        { text: "In the Explorer, open app › page.tsx." },
        { os: MAC, text: "Select everything (Cmd + A), delete it, paste this, and save with Cmd + S:", file: "app/page.tsx", code: PAGE_1 },
        { os: WL, text: "Select everything (Ctrl + A), delete it, paste this, and save with Ctrl + S:", file: "app/page.tsx", code: PAGE_1 },
        { text: "Look at your browser — it already shows My Frontend App (1). You didn't even refresh." },
      ],
      screen: "fe-browser-yours",
    },
    {
      title: "Add shadcn/ui",
      why: "shadcn/ui gives you ready-made, accessible components — buttons, cards, inputs — copied into your project so you can change them.",
      actions: [
        {
          text: "Click + in the terminal panel for a second terminal (the first one is running your website). Then run:",
          code: "npx shadcn@latest init",
        },
        { text: "If it asks any questions, press Enter to keep the default answer." },
        { text: "Now add your first three components:", code: "npx shadcn@latest add button card input" },
      ],
      screen: "fe-shadcn",
      check: [{ text: "It lists the files it created, like components/ui/button.tsx (1)." }],
    },
    {
      title: "Use a component",
      actions: [
        { text: "Replace app/page.tsx with this and save:", file: "app/page.tsx", code: PAGE_2 },
        { text: "Your browser now shows a Get started button (1)." },
      ],
      screen: "fe-browser-button",
    },
    {
      title: "Install the data libraries",
      why: "React Query fetches data from APIs and keeps it up to date; Zustand stores data that several parts of your app share. You'll use both from week 2.",
      actions: [{ text: "In the second terminal, run:", code: "npm install @tanstack/react-query zustand" }],
      screen: "fe-install",
      check: [{ text: "It ends with added … packages (1)." }],
    },
    {
      title: "Save a snapshot (commit)",
      why: "create-next-app already made a first commit for you. This one saves your changes. How we work explains commits properly — for now, follow along.",
      actions: [
        { text: "Include every change:", code: "git add ." },
        { text: "Check what Git is about to save:", code: "git status" },
        { text: "You should see app/page.tsx, the new components folder and package.json (1)." },
        { text: "Save the snapshot:", code: 'git commit -m "Add shadcn/ui and data libraries"' },
      ],
      screen: "fe-git-status",
    },
    {
      title: "Put it on GitHub",
      why: "--source=. means “this folder”, and --push uploads your commits straight away.",
      actions: [{ text: "Run:", code: "gh repo create my-frontend-app --public --source=. --push" }],
      screen: "fe-gh-create",
      check: [{ text: "It says Created repository and Pushed commits (1)." }],
    },
    seeOnGitHubStep("fe", "your app and components folders"),
    collaboratorStep("fe-collaborators"),
  ],
}

export const frontendNextTime = nextTimePart("fe", "my-frontend-app", [
  { text: "Open a terminal (Terminal → New Terminal) and run:", code: "npm run dev" },
  { text: "Open http://localhost:3000 in your browser." },
])

/* ------------------------------------------------------------------ */
/* App development — Expo                                              */
/* ------------------------------------------------------------------ */

export const appProject: WalkPart = {
  id: "project",
  title: "Create your project",
  time: "20 min",
  intro: "You'll create a React Native app with Expo, open it on your own phone, change it and watch the phone update, and put it on GitHub.",
  steps: [
    {
      title: "Create the Expo app",
      why: "create-expo-app builds a complete, ready-to-run React Native app, with navigation already set up.",
      actions: [
        { text: "In VS Code's terminal — still in devvy — run:", code: "npx create-expo-app@latest my-mobile-app" },
        { text: "If it says Ok to proceed? (y), type y and press Enter. It downloads everything, which takes a minute or two." },
      ],
      screen: "app-create",
      check: [{ text: "It says Your project is ready! (1)." }],
    },
    openProjectStep("app", "my-mobile-app"),
    {
      title: "Start the development server",
      actions: [{ text: "Click Terminal → New Terminal, then run:", code: "npx expo start" }],
      screen: "app-start",
      check: [{ text: "A big QR code appears in the terminal, with Scan the QR code above under it (1). Leave this terminal running." }],
    },
    {
      title: "Open it on your phone",
      actions: [
        { text: "Android: open Expo Go and tap Scan QR code (1), then point the camera at the QR code in VS Code." },
        { text: "iPhone: open the normal Camera app, point it at the QR code, and tap the Open in Expo Go banner (2)." },
        { text: "The first load takes up to a minute while your laptop builds the app." },
      ],
      screen: "app-scan",
      warn: "Stuck on loading, or “Could not connect”? Check the phone and laptop are on the same Wi-Fi. Still stuck? Use your phone's hotspot for the laptop, then stop the server with Ctrl + C and run npx expo start again.",
    },
    {
      title: "See your app",
      actions: [{ text: "Your phone shows the starter app with Welcome to Expo in the middle (1). It's running from your laptop." }],
      screen: "app-phone-welcome",
    },
    {
      title: "Change it and watch it update",
      why: "Expo reloads the app on your phone as soon as you save. That's how you'll work all program.",
      actions: [
        { text: "In the Explorer, open src › app › index.tsx." },
        { text: "Find the line that says Welcome to&nbsp;Expo (1). (&nbsp; is a space that never breaks onto a new line.) Replace the whole line with Hello, Devvy! and save the file." },
        { text: "Look at your phone — it changes within a second or two (2)." },
        { text: "If your file looks different, change any text you can see on the phone's first screen instead." },
      ],
      screen: "app-edit",
    },
    {
      title: "Log in to the build tool",
      why: "EAS turns your project into an installable app (an APK) in week 4. You log in now so it's ready.",
      actions: [
        { text: "Click + in the terminal panel for a second terminal (the first one is running Expo). Run:", code: "npx eas-cli@latest login" },
        { text: "If it says Ok to proceed? (y), type y and press Enter." },
        { text: "Type your Expo email or username, press Enter, then your password (nothing appears while you type it) and Enter." },
      ],
      screen: "app-eas",
      check: [{ text: "It says Logged in as followed by your username (1)." }],
      note: "npx runs a tool without installing it on your whole computer, so there's no permission error. Whenever a guide says eas, type npx eas-cli@latest instead.",
    },
    {
      title: "Save your change (commit)",
      why: "A commit is a saved snapshot of your project with a message. Expo already saved the starter app as a first commit, so this one saves your change. How we work explains this properly — for now, follow along.",
      actions: [
        { text: "Include every change and save the snapshot:", code: 'git add .\ngit commit -m "Say hello on the home screen"' },
        { text: "If it says not a git repository, run git init first, then the two commands again." },
      ],
      screen: "app-git-commit",
      check: [{ text: "It says 1 file changed (1)." }],
    },
    {
      title: "Put it on GitHub",
      why: "--source=. means “this folder”, and --push uploads your commits straight away.",
      actions: [{ text: "Run:", code: "gh repo create my-mobile-app --public --source=. --push" }],
      screen: "app-gh-create",
      check: [{ text: "It says Created repository and Pushed commits (1)." }],
    },
    seeOnGitHubStep("app", "your src, assets and scripts folders"),
    collaboratorStep("app-collaborators"),
  ],
}

export const appNextTime = nextTimePart("app", "my-mobile-app", [
  { text: "Open a terminal (Terminal → New Terminal) and run:", code: "npx expo start" },
  { text: "Open Expo Go on your phone. Your app is under Recently opened — tap it, or scan the QR code again." },
])

/* ------------------------------------------------------------------ */
/* Python tracks — AI & ML, Data Science, Python                       */
/* ------------------------------------------------------------------ */

type PyProject = {
  key: string
  repo: string
  intro: string
  packages: string
  packagesWhy: string
  /** Folders to create (OS-independent names). */
  folders: string[]
  foldersWhy: string
  /** Extra steps after the folders are made (notebooks, first program…). */
  extra: WalkStep[]
  done: string
}

function pythonProject(p: PyProject): WalkPart {
  const mk = p.folders.join(" ")
  const mkWin = p.folders.join(", ")
  return {
    id: "project",
    title: "Create your project",
    time: "25 min",
    intro: p.intro,
    steps: [
      repoCreateStep(p.key, p.repo),
      openProjectStep(p.key, p.repo),
      projectTerminalStep(p.key, p.repo),
      {
        title: "Create a virtual environment",
        why: "A virtual environment (venv) is a private folder of libraries just for this project, so different projects never clash.",
        actions: [
          { os: NIX, text: "Run:", code: "python3 -m venv .venv" },
          { os: WIN, text: "Run:", code: "python -m venv .venv" },
          { text: "A .venv folder appears in the Explorer. VS Code asks whether to select the new environment for this folder — click Yes (1)." },
        ],
        screen: `${p.key}-venv`,
        note: "Missed the pop-up? Press F1, type Python: Select Interpreter, and choose the one with .venv in it.",
      },
      {
        title: "Switch it on",
        why: "“Activating” the environment means the python and pip you type use this project's private folder.",
        actions: [
          { os: NIX, text: "Run:", code: "source .venv/bin/activate" },
          { os: WIN, text: "Run:", code: ".venv\\Scripts\\Activate.ps1" },
        ],
        screen: `${p.key}-activate`,
        check: [{ text: "Your prompt now starts with (.venv) (1). From now on, new terminals in VS Code switch it on for you." }],
        warn: "If your prompt doesn't start with (.venv), run the command above. Installing libraries without it puts them in the wrong place.",
      },
      {
        title: "Install the libraries",
        why: p.packagesWhy,
        actions: [
          { text: "With (.venv) showing, run:", code: `pip install ${p.packages}` },
          { text: "It downloads quite a lot — give it a few minutes." },
        ],
        screen: `${p.key}-pip`,
        check: [{ text: "It ends with Successfully installed followed by a list of names (1)." }],
      },
      {
        title: "Record your libraries",
        why: "requirements.txt lists every library and its exact version, so anyone (including you, on another laptop) can install the same set with pip install -r requirements.txt.",
        actions: [
          { os: NIX, text: "Run:", code: "pip freeze > requirements.txt" },
          { os: WIN, text: "Run:", code: "pip freeze | Out-File -Encoding utf8 requirements.txt" },
          { text: "Open requirements.txt in the Explorer — one line per library (1)." },
        ],
        screen: `${p.key}-requirements`,
      },
      {
        title: "Keep the environment and secrets out of Git",
        why: ".venv is big and anyone can rebuild it from requirements.txt. .env will hold secrets. __pycache__ and .ipynb_checkpoints are files Python and Jupyter make for themselves.",
        actions: newFileActions(".gitignore", ".venv/\n.env\n__pycache__/\n.ipynb_checkpoints/"),
        screen: `${p.key}-gitignore`,
        check: [{ text: "The .venv folder turns grey in the Explorer (1) — Git is ignoring it." }],
      },
      {
        title: "Create your folders",
        why: p.foldersWhy,
        actions: [
          { os: NIX, text: "Run:", code: `mkdir ${mk}` },
          { os: WIN, text: "Run:", code: `mkdir ${mkWin}` },
        ],
        screen: `${p.key}-folders`,
        check: [{ text: `${p.folders.join(", ")} appear in the Explorer (1).` }],
      },
      ...p.extra,
      commitStep(p.key, { message: "Initial project setup", mustNotSee: ".venv" }),
      pushStep(p.key),
      seeOnGitHubStep(p.key, p.done),
      collaboratorStep(`${p.key}-collaborators`),
    ],
  }
}

function jupyterSteps(key: string, notebook: string, cell: string, expect: string): WalkStep[] {
  return [
    {
      title: "Start JupyterLab",
      why: "Notebooks let you run code one small step at a time and see the result straight away — perfect for exploring data.",
      actions: [
        { text: "With (.venv) showing, run:", code: "jupyter lab" },
        { text: "Your browser opens JupyterLab. Leave the terminal running — it is JupyterLab." },
        { text: "In the file list on the left, double-click the notebooks folder (1)." },
        { text: "Under Notebook, click Python 3 (ipykernel) (2). A new notebook opens inside notebooks." },
      ],
      screen: `${key}-jupyter-launcher`,
    },
    {
      title: "Run your first cell",
      actions: [
        { text: `Right-click the Untitled.ipynb tab, choose Rename Notebook…, and call it ${notebook}.` },
        { text: "Click in the first cell, paste this, and press Shift + Enter to run it:", code: cell },
      ],
      screen: `${key}-jupyter-cell`,
      check: [{ text: `It prints ${expect} (1). Your setup works! 🎉` }],
    },
    {
      title: "Stop JupyterLab",
      actions: [
        { text: "Save the notebook (Cmd/Ctrl + S), then close the browser tab." },
        { text: "Click into the terminal running JupyterLab and press Ctrl + C twice. The prompt comes back." },
      ],
    },
  ]
}

export const mlProject = pythonProject({
  key: "ml",
  repo: "my-ml-project",
  intro: "You'll create a Python project with its own environment, the core machine-learning libraries and a first notebook, and save it to GitHub.",
  packages: "numpy pandas scikit-learn matplotlib jupyterlab",
  packagesWhy:
    "numpy and pandas handle data, scikit-learn trains models, matplotlib draws charts, and jupyterlab runs notebooks. You'll add FastAPI and Streamlit in week 3.",
  folders: ["data", "notebooks", "app"],
  foldersWhy: "data holds your datasets, notebooks your exploration, and app the code that serves your model in week 3.",
  extra: jupyterSteps(
    "ml",
    "01-exploration",
    "import pandas as pd\nimport sklearn\nprint(pd.__version__, sklearn.__version__)",
    "two version numbers"
  ),
  done: "your notebooks folder, .gitignore and requirements.txt",
})

export const dsProject = pythonProject({
  key: "ds",
  repo: "my-analysis",
  intro: "You'll create a Python project with its own environment, the data-analysis libraries and a first notebook, and save it to GitHub.",
  packages: "pandas matplotlib plotly jupyterlab streamlit",
  packagesWhy:
    "pandas cleans and analyses data, matplotlib and plotly draw charts, jupyterlab runs notebooks, and streamlit turns your analysis into a dashboard in week 4.",
  folders: ["data", "notebooks", "dashboard"],
  foldersWhy: "data holds your datasets, notebooks your cleaning and analysis, and dashboard your week 4 app.",
  extra: [
    ...jupyterSteps(
      "ds",
      "01-cleaning",
      "import pandas as pd\nimport sqlite3\nprint(pd.__version__, sqlite3.sqlite_version)",
      "two version numbers — pandas, then SQLite"
    ),
  ],
  done: "your notebooks folder, .gitignore and requirements.txt",
})

const PY_MAIN =
  'import argparse\n\n\ndef greet(name: str) -> str:\n    return f"Hello, {name}!"\n\n\ndef main():\n    parser = argparse.ArgumentParser(description="My tool")\n    parser.add_argument("name", help="Who to greet")\n    args = parser.parse_args()\n    print(greet(args.name))\n\n\nif __name__ == "__main__":\n    main()'

const PY_TEST = 'from app.main import greet\n\n\ndef test_greet():\n    assert greet("Asha") == "Hello, Asha!"'

export const pyProject = pythonProject({
  key: "py",
  repo: "my-python-tool",
  intro: "You'll create a Python project with its own environment, write a small command-line program and a test for it, and save it to GitHub.",
  packages: 'requests "fastapi[standard]" pydantic pytest',
  packagesWhy: "requests fetches web pages and APIs, fastapi and pydantic build your web API in week 3, and pytest runs your tests.",
  folders: ["app", "tests"],
  foldersWhy: "app holds your program's code and tests holds the code that checks it.",
  extra: [
    {
      title: "Make app a package",
      why: "An empty file called __init__.py tells Python “app is a package you can import from”.",
      actions: [
        { text: "Right-click the app folder → New File…, type __init__.py and press Enter. Leave it empty." },
        { text: "Right-click app again → New File…, type main.py and press Enter. Paste this and save:", file: "app/main.py", code: PY_MAIN },
      ],
      screen: "py-main",
    },
    {
      title: "Run your program",
      actions: [
        { text: "Run it from the project folder:", code: "python -m app.main Asha" },
        { text: "Try the help that argparse gives you for free:", code: "python -m app.main --help" },
      ],
      screen: "py-run",
      check: [{ text: "The first command prints Hello, Asha! (1)." }],
    },
    {
      title: "Write and run a test",
      why: "A test is code that checks your code. Your mentor expects tests for everything you build.",
      actions: [
        {
          text: "Right-click the tests folder → New File…, type test_main.py and press Enter. Paste this and save:",
          file: "tests/test_main.py",
          code: PY_TEST,
        },
        { text: "Run your tests:", code: "python -m pytest" },
      ],
      screen: "py-test",
      check: [{ text: "It ends with 1 passed in green (1)." }],
    },
  ],
  done: "your app and tests folders",
})

function pythonNextTime(key: string, repo: string, start: WalkAction[]): WalkPart {
  return nextTimePart(key, repo, [
    { text: "Open a terminal (Terminal → New Terminal). Check the prompt starts with (.venv). If it doesn't:" },
    { os: NIX, text: "Run:", code: "source .venv/bin/activate" },
    { os: WIN, text: "Run:", code: ".venv\\Scripts\\Activate.ps1" },
    ...start,
  ])
}

export const mlNextTime = pythonNextTime("ml", "my-ml-project", [{ text: "Then start JupyterLab:", code: "jupyter lab" }])
export const dsNextTime = pythonNextTime("ds", "my-analysis", [{ text: "Then start JupyterLab:", code: "jupyter lab" }])
export const pyNextTime = pythonNextTime("py", "my-python-tool", [{ text: "Then run your program or your tests:", code: "python -m pytest" }])

/* ------------------------------------------------------------------ */
/* Java — Spring Boot                                                  */
/* ------------------------------------------------------------------ */

const PROPS =
  "spring.application.name=my-java-api\nspring.config.import=optional:file:.env[.properties]\nspring.datasource.url=${DATABASE_URL}\nspring.datasource.username=${DATABASE_USER}\nspring.datasource.password=${DATABASE_PASSWORD}\nspring.jpa.hibernate.ddl-auto=update"

const HEALTH =
  'package com.example.my_java_api;\n\nimport java.util.Map;\n\nimport org.springframework.web.bind.annotation.GetMapping;\nimport org.springframework.web.bind.annotation.RestController;\n\n@RestController\npublic class HealthController {\n\n    @GetMapping("/health")\n    public Map<String, Boolean> health() {\n        return Map.of("ok", true);\n    }\n}'

export const javaProject: WalkPart = {
  id: "project",
  title: "Create your project",
  time: "30 min",
  intro:
    "You'll generate a Spring Boot project, connect it to PostgreSQL with the password kept safely in a .env file, add your first endpoint, run it, and put it on GitHub.",
  steps: [
    {
      title: "Generate the project",
      why: "Spring Initializr builds a ready-to-run Spring Boot project with exactly the libraries you pick.",
      actions: [
        { text: "Go to start.spring.io" },
        { text: "Choose Maven (1) and Java. Leave Spring Boot on the version it picks." },
        { text: "Under Project Metadata, change Artifact to my-java-api (2). Choose Java 21 (3)." },
        { text: "Click Add Dependencies… and add Spring Web, Spring Data JPA, PostgreSQL Driver and Validation (4)." },
        { text: "Click Generate (5). A file called my-java-api.zip downloads." },
      ],
      screen: "java-initializr",
    },
    {
      title: "Unzip it into devvy",
      actions: [
        { os: MAC, text: "Open Downloads in Finder and double-click my-java-api.zip. A my-java-api folder appears." },
        { os: MAC, text: "Drag the my-java-api folder (1) onto devvy (2)." },
        { os: WIN, text: "Open Downloads, right-click my-java-api.zip and choose Extract All…" },
        { os: WIN, text: "Change the folder to C:\\Users\\YourName\\devvy (1) and click Extract (2)." },
        { os: ["linux"], text: "In VS Code's terminal (still in devvy), run:", code: "unzip ~/Downloads/my-java-api.zip -d ~/devvy" },
      ],
      screen: "java-unzip",
      check: [{ text: "devvy now contains a my-java-api folder, and inside it pom.xml and a src folder." }],
    },
    openProjectStep("java", "my-java-api"),
    {
      title: "Let Java load the project",
      actions: [
        {
          text: "The Java extension reads pom.xml and downloads what the project needs. Wait until the bottom bar shows Java: Ready (1) — the first time takes a few minutes.",
        },
        { text: "If it asks to open the project in Standard mode or import Maven projects, click Yes." },
      ],
      screen: "java-ready",
    },
    {
      title: "Create the database",
      why: "Spring Boot connects to a database but doesn't create it, so you make an empty one called devvy_java first.",
      actions: [
        { text: "Click Terminal → New Terminal." },
        {
          os: MAC,
          text: "Make sure Postgres.app is running, then run:",
          code: "/Applications/Postgres.app/Contents/Versions/latest/bin/createdb devvy_java",
        },
        {
          os: WIN,
          text: "Run this. If you installed a PostgreSQL version other than 18, change 18 in the path to your version:",
          code: '& "C:\\Program Files\\PostgreSQL\\18\\bin\\createdb.exe" -U postgres devvy_java',
        },
        { os: WIN, text: "Type the PostgreSQL password you chose (nothing appears while you type) and press Enter." },
        { os: ["linux"], text: "Run:", code: "sudo -u postgres createdb devvy_java" },
      ],
      screen: "java-createdb",
      check: [
        { os: ["mac", "windows"], text: "Nothing is printed (1). In the terminal, no news is good news." },
        { os: ["linux"], text: "Nothing is printed (1) — or only could not change directory to … Permission denied. Ignore that message: the postgres user just can't see your folder, and the database was still created." },
      ],
    },
    {
      title: "Put your database login in .env",
      why: ".env holds settings that are only for your computer, like your database password. It never goes to GitHub — Environment & secrets explains why. Spring Boot can read it directly.",
      actions: [
        { text: "Right-click the empty space in the Explorer → New File…, type .env and press Enter." },
        {
          os: MAC,
          text: "Paste this, replacing asha with your Mac username (run whoami if you're not sure), and save:",
          file: ".env",
          code: "DATABASE_URL=jdbc:postgresql://localhost:5432/devvy_java\nDATABASE_USER=asha\nDATABASE_PASSWORD=",
        },
        {
          os: WL,
          text: "Paste this, replacing devvy123 with your PostgreSQL password, and save:",
          file: ".env",
          code: "DATABASE_URL=jdbc:postgresql://localhost:5432/devvy_java\nDATABASE_USER=postgres\nDATABASE_PASSWORD=devvy123",
        },
        { text: "No quotes around the values — Spring reads this file as-is." },
      ],
      screen: "java-env",
    },
    {
      title: "Point Spring Boot at .env",
      why: "${DATABASE_URL} means “take this value from .env”. Your password never appears in a file that's committed.",
      actions: [
        {
          text: "Open src › main › resources › application.properties, delete everything in it, paste this, and save:",
          file: "src/main/resources/application.properties",
          code: PROPS,
        },
      ],
      screen: "java-properties",
    },
    {
      title: "Keep .env out of Git",
      why: "Spring Initializr made a .gitignore for you, but it doesn't know about .env.",
      actions: [{ text: "Open .gitignore, add .env on a new line at the very bottom (1), and save.", file: ".gitignore", code: ".env" }],
      screen: "java-gitignore",
    },
    {
      title: "Add your first endpoint",
      why: "An endpoint is a URL your API answers. /health simply answers “I'm alive” — a quick way to check everything works.",
      actions: [
        { text: "In the Explorer, open src › main › java › com › example › my_java_api. You'll see MyJavaApiApplication.java." },
        { text: "Right-click the my_java_api folder → New File…, type HealthController.java and press Enter." },
        {
          text: "VS Code may fill in a few lines for you. Delete them, paste this, and save:",
          file: "src/main/java/com/example/my_java_api/HealthController.java",
          code: HEALTH,
        },
      ],
      screen: "java-controller",
    },
    {
      title: "Run it",
      actions: [
        { os: NIX, text: "In the terminal, run:", code: "./mvnw spring-boot:run" },
        { os: WIN, text: "In the terminal, run:", code: ".\\mvnw spring-boot:run" },
        { text: "The first run downloads Maven and your libraries — a few minutes. Later runs take seconds." },
      ],
      screen: "java-run",
      check: [{ text: "It ends with Started MyJavaApiApplication (1). Leave it running." }],
      warn: "“permission denied: ./mvnw” on Mac or Linux? Run chmod +x mvnw once, then try again. “Could not resolve placeholder” means a name in .env doesn't match application.properties.",
    },
    {
      title: "Check it in your browser",
      actions: [{ text: "Open a new browser tab and go to http://localhost:8080/health" }],
      screen: "java-health",
      check: [{ text: 'You see {"ok":true} (1). Your API works! 🎉' }],
    },
    {
      title: "Save your first snapshot (commit)",
      why: "A commit is a saved snapshot of your project with a message. How we work explains this properly — for now, follow along.",
      actions: [
        { text: "Click + in the terminal panel for a second terminal (the first one is running your API)." },
        { text: "Turn the folder into a Git repository and include every file:", code: "git init\ngit add ." },
        { text: "Check what Git is about to save:", code: "git status" },
        { text: "Your files are listed in green (1). Make sure .env is NOT in the list — if it is, check your .gitignore." },
        { text: "Save the snapshot:", code: 'git commit -m "Initial Spring Boot project"' },
      ],
      screen: "java-git-status",
    },
    {
      title: "Put it on GitHub",
      why: "--source=. means “this folder”, and --push uploads your commits straight away.",
      actions: [{ text: "Run:", code: "gh repo create my-java-api --public --source=. --push" }],
      screen: "java-gh-create",
      check: [{ text: "It says Created repository and Pushed commits (1)." }],
    },
    seeOnGitHubStep("java", "your src folder, pom.xml and mvnw"),
    collaboratorStep("java-collaborators"),
  ],
}

export const javaNextTime = nextTimePart("java", "my-java-api", [
  { os: MAC, text: "Make sure Postgres.app is running." },
  { os: NIX, text: "Open a terminal (Terminal → New Terminal) and run:", code: "./mvnw spring-boot:run" },
  { os: WIN, text: "Open a terminal (Terminal → New Terminal) and run:", code: ".\\mvnw spring-boot:run" },
])
