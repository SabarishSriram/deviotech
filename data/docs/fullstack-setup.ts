import { collaboratorStep } from "@/data/docs/setup/projects"
import { aiPart, githubPart, gitPart, nodePart, postgresPart, terminalPart, vscodePart, workspacePart } from "@/data/docs/setup/common"
import type { WalkPart } from "@/data/docs/types"

/*
 * Full-Stack setup, from an empty computer to a running React + Express +
 * PostgreSQL project on GitHub. Shared parts live in data/docs/setup/common.ts.
 */

const projectPart: WalkPart = {
  id: "project",
  title: "Create your project",
  time: "25 min",
  intro:
    "Now the fun part. You'll create your project — a React website (the client) and an Express API (the server) — run both, connect the database, and save the first version to GitHub.",
  steps: [
    {
      title: "Create the repository",
      why: "A repository (repo) is a project folder that Git tracks, with a copy on GitHub.",
      actions: [
        { text: "In VS Code's terminal — still in devvy — run:", code: "gh repo create my-fullstack-app --public --clone" },
        { text: "This creates an empty repository on your GitHub account and downloads it here as a new folder called my-fullstack-app." },
      ],
      screen: "repo-create",
      check: [
        { text: "It says Created repository yourname/my-fullstack-app on GitHub (1). A warning that you “cloned an empty repository” is expected." },
      ],
    },
    {
      title: "Open the project folder",
      why: "From now on, VS Code and its terminal should work inside your project folder, not devvy.",
      actions: [
        { os: ["mac"], text: "In the menu bar at the top of the screen, click File → Open Folder…" },
        { os: ["windows", "linux"], text: "In VS Code's menu bar, click File → Open Folder…" },
        { text: "Go into devvy, click my-fullstack-app once to select it (1), and open it (2)." },
        { text: "If VS Code asks whether you trust the authors, click Yes, I trust the authors." },
      ],
      screen: "vscode-pick-project",
    },
    {
      title: "Open a terminal in the project",
      actions: [{ text: "Click Terminal → New Terminal. Then check where you are:", code: "pwd" }],
      screen: "project-terminal",
      check: [{ text: "The Explorer shows MY-FULLSTACK-APP, and pwd ends in my-fullstack-app (1)." }],
    },
    {
      title: "Create the React client",
      why: "Vite is a tool that creates a ready-to-run React project for you, so you don't start from a blank page.",
      actions: [
        {
          text: "Run this. It creates a client folder with a React + TypeScript project inside:",
          code: "npx create-vite@latest client --template react-ts",
        },
        { text: "If it says Need to install the following packages … Ok to proceed? (y), type y (1) and press Enter." },
        {
          text: "If it asks any other question (like “Install with npm and start now?”), choose No — you'll do those steps yourself next, so you see what each one does.",
        },
      ],
      screen: "vite-create",
      check: [{ text: "A client folder appears in the Explorer (2), and the terminal says Done." }],
    },
    {
      title: "Install and start the client",
      actions: [
        { text: "Move into the client folder:", code: "cd client" },
        { text: "Download the libraries it needs. This takes a minute and creates a big node_modules folder:", code: "npm install" },
        { text: "Start it:", code: "npm run dev" },
        { os: ["mac"], text: "It prints Local: http://localhost:5173/ (1). Hold Cmd and click that link." },
        { os: ["windows", "linux"], text: "It prints Local: http://localhost:5173/ (1). Hold Ctrl and click that link." },
      ],
      screen: "vite-running",
    },
    {
      title: "See your React app",
      actions: [
        { text: "Your browser shows the Vite + React page. Click the count button (1) — the number goes up. That's React running! 🎉" },
        { text: "Leave that terminal running. If you close it, the website stops." },
      ],
      screen: "vite-browser",
    },
    {
      title: "Open a second terminal",
      why: "The first terminal is busy running your client. Each running program needs its own terminal.",
      actions: [
        { text: "Click the + icon (1) at the top-right of the terminal panel. A new terminal opens in my-fullstack-app." },
        { text: "You can switch between terminals with the list on the right of the panel (2)." },
      ],
      screen: "terminal-plus",
    },
    {
      title: "Create the server and install its libraries",
      why: "express runs the web server, cors lets your React app call it, dotenv reads your .env settings file, zod checks incoming data, and bcrypt and jsonwebtoken handle logins (you'll use those in week 2). typescript and tsx let you write the server in TypeScript.",
      actions: [
        { text: "In the new terminal, create a server folder and move into it — one command at a time:", code: "mkdir server\ncd server" },
        { text: "Create package.json, the file that lists your server's libraries:", code: "npm init -y" },
        { text: "Install the libraries the server uses:", code: "npm install express cors dotenv zod bcrypt jsonwebtoken" },
        {
          text: "Install the development tools:",
          code: "npm install -D typescript tsx @types/node @types/express @types/cors @types/bcrypt @types/jsonwebtoken",
        },
        {
          text: "Install Prisma, which talks to the database for you. The @6 picks version 6, so what you see matches these docs exactly:",
          code: "npm install @prisma/client@6\nnpm install -D prisma@6",
        },
      ],
      screen: "server-install",
      check: [{ text: "Each install ends with added … packages (1). A few “warn” lines are normal; “ERR!” lines are not." }],
    },
    {
      title: "Add the server's scripts",
      why: "Scripts are shortcuts. npm run dev will start your server and restart it every time you save. build and start are for deploying in week 4. type=module lets you use modern import statements.",
      actions: [
        {
          text: "This is one command — copy all of it:",
          code: 'npm pkg set "type=module" "scripts.dev=tsx watch src/index.ts" "scripts.build=tsc" "scripts.start=node dist/index.js"',
        },
        { text: "Open server › package.json in the Explorer to see the result (1)." },
      ],
      screen: "package-json",
    },
    {
      title: "Create the TypeScript settings file",
      actions: [
        { text: "In the Explorer, right-click the server folder (1) and choose New File… (2)." },
        { text: "Type tsconfig.json and press Enter. The new, empty file opens." },
        {
          os: ["mac"],
          text: "Paste this in and save with Cmd + S:",
          file: "server/tsconfig.json",
          code: '{\n  "compilerOptions": {\n    "target": "ES2022",\n    "module": "NodeNext",\n    "moduleResolution": "NodeNext",\n    "rootDir": "src",\n    "outDir": "dist",\n    "strict": true,\n    "esModuleInterop": true,\n    "skipLibCheck": true\n  },\n  "include": ["src"]\n}',
        },
        {
          os: ["windows", "linux"],
          text: "Paste this in and save with Ctrl + S:",
          file: "server/tsconfig.json",
          code: '{\n  "compilerOptions": {\n    "target": "ES2022",\n    "module": "NodeNext",\n    "moduleResolution": "NodeNext",\n    "rootDir": "src",\n    "outDir": "dist",\n    "strict": true,\n    "esModuleInterop": true,\n    "skipLibCheck": true\n  },\n  "include": ["src"]\n}',
        },
      ],
      screen: "new-file",
      note: "A white dot on a file's tab means it has unsaved changes. Get in the habit of saving after every paste.",
    },
    {
      title: "Write the Express app",
      why: "This file describes your API. Right now it has one route, /health, which simply answers “I'm alive” — a quick way to check everything works.",
      actions: [
        { text: "Right-click server → New File… again, type src/app.ts and press Enter. VS Code creates the src folder for you." },
        {
          text: "Paste this in and save:",
          file: "server/src/app.ts",
          code: 'import express from "express"\nimport cors from "cors"\n\nexport const app = express()\n\napp.use(cors({ origin: process.env.CLIENT_URL }))\napp.use(express.json())\n\n// A tiny route to check the server is alive\napp.get("/health", (req, res) => {\n  res.json({ ok: true })\n})',
        },
      ],
      screen: "editor-app",
    },
    {
      title: "Write the file that starts the server",
      why: "app.ts describes the API; index.ts switches it on. Keeping them apart makes testing easier later.",
      actions: [
        { text: "Right-click the src folder → New File…, type index.ts and press Enter." },
        {
          text: "Paste this in and save:",
          file: "server/src/index.ts",
          code: 'import "dotenv/config"\nimport { app } from "./app.js"\n\nconst port = Number(process.env.PORT) || 4000\n\napp.listen(port, () => {\n  console.log("API running on http://localhost:" + port)\n})',
        },
      ],
      screen: "editor-index",
      note: "Yes, it imports ./app.js even though the file is app.ts — that's how modern Node.js imports work, and tsx understands it.",
    },
    {
      title: "Set up Prisma",
      why: "Prisma is how your code talks to PostgreSQL. schema.prisma describes your database; you'll add your tables to it in week 1.",
      actions: [
        { text: "In the terminal (still in server), run:", code: "npx prisma init" },
        { text: "It creates a prisma folder containing schema.prisma, plus server/.env, server/.gitignore and prisma.config.ts (Prisma's own settings — leave that one as it is)." },
        {
          text: "Open prisma › schema.prisma, delete everything in it, paste this, and save:",
          file: "server/prisma/schema.prisma",
          code: 'generator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}',
        },
      ],
      screen: "editor-schema",
    },
    {
      title: "Fill in your .env file",
      why: ".env holds settings that are only for your computer, like your database password. It never goes to GitHub — Environment & secrets explains why.",
      actions: [
        { os: ["mac"], text: "First, find your Mac username:", code: "whoami" },
        {
          os: ["mac"],
          text: "Open server › .env, delete everything in it, and paste this — replacing asha with the username whoami printed. Save.",
          file: "server/.env",
          code: 'DATABASE_URL="postgresql://asha@localhost:5432/devvy_fullstack"\nPORT=4000\nCLIENT_URL="http://localhost:5173"',
        },
        {
          os: ["windows", "linux"],
          text: "Open server › .env, delete everything in it, and paste this — replacing devvy123 with the PostgreSQL password you chose. Save.",
          file: "server/.env",
          code: 'DATABASE_URL="postgresql://postgres:devvy123@localhost:5432/devvy_fullstack"\nPORT=4000\nCLIENT_URL="http://localhost:5173"',
        },
        { text: "devvy_fullstack is the name of the database Prisma will create for this project in the next step." },
      ],
      screen: "editor-env",
    },
    {
      title: "Connect to the database",
      actions: [
        { os: ["mac"], text: "Make sure Postgres.app is open and says Running." },
        { text: "Run:", code: "npx prisma migrate dev --name init" },
      ],
      screen: "prisma-migrate",
      check: [
        { text: "It says the database devvy_fullstack was created (1) — or “already in sync” if you run it again. Either means you're connected." },
      ],
      warn: "Error P1001 (can't reach the database) means PostgreSQL isn't running. Error P1000 (authentication failed) means the username or password in .env is wrong.",
    },
    {
      title: "Start the server",
      actions: [{ text: "Run:", code: "npm run dev" }],
      screen: "api-running",
      check: [{ text: "It prints API running on http://localhost:4000 (1). Leave this terminal running too." }],
    },
    {
      title: "Check it in your browser",
      actions: [{ text: "Open a new browser tab and go to http://localhost:4000/health" }],
      screen: "health-browser",
      check: [{ text: 'You see {"ok":true} (1). Your API works! 🎉' }],
    },
    {
      title: "Keep secrets and junk out of Git",
      why: "This file lists what Git must never save: node_modules (huge, and anyone can re-download it), .env (it has your database password) and dist (build output).",
      actions: [
        { text: "prisma init made a .gitignore inside server. Open server › .gitignore. (Not there? Right-click the server folder → New File… and type .gitignore, with the dot at the start.)" },
        {
          text: "Delete what's in it, paste this, and save:",
          file: "server/.gitignore",
          code: "node_modules\n.env\ndist",
        },
      ],
      screen: "editor-gitignore",
    },
    {
      title: "Save your first snapshot (commit)",
      why: "A commit is a saved snapshot of your project with a message describing it. How we work explains this properly — for now, follow along.",
      actions: [
        {
          text: "Click + in the terminal panel for a third terminal (the other two are running your client and server). It opens in my-fullstack-app.",
        },
        { text: "Tell Git to include every file:", code: "git add ." },
        { text: "Check what Git is about to save:", code: "git status" },
        {
          text: "You should see client/ and server/ files listed in green (1). Make sure server/.env is NOT in the list — if it is, check your .gitignore.",
        },
        { text: "Save the snapshot with a message:", code: 'git commit -m "Initial project setup"' },
      ],
      screen: "git-status",
      note: "On Windows you may see warnings like “LF will be replaced by CRLF”. They're harmless.",
    },
    {
      title: "Upload it to GitHub (push)",
      why: "Push sends your commits to GitHub. -u origin main tells Git where to send them; after this once, plain git push is enough.",
      actions: [{ text: "Run:", code: "git push -u origin main" }],
      screen: "git-push",
      check: [{ text: "It ends with branch 'main' set up to track 'origin/main' (1)." }],
    },
    {
      title: "See it on GitHub",
      actions: [
        { text: "Open your repository in the browser:", code: "gh repo view --web" },
        { text: "You'll see your client and server folders (1) and your message Initial project setup (2)." },
      ],
      screen: "github-repo",
    },
    collaboratorStep("collaborators"),
  ],
}

const nextTimePart: WalkPart = {
  id: "next-time",
  title: "Starting work next time",
  time: "1 min",
  intro: "Do this every time you sit down to work on your project.",
  steps: [
    {
      title: "Open your project",
      actions: [
        { os: ["mac"], text: "Open VS Code. In the menu bar at the top, click File → Open Recent (1) → my-fullstack-app (2)." },
        { os: ["windows", "linux"], text: "Open VS Code. Click File → Open Recent (1) → my-fullstack-app (2)." },
      ],
      screen: "open-recent",
    },
    {
      title: "Start the client and the server",
      actions: [
        { text: "Open a terminal (Terminal → New Terminal) and start the client:", code: "cd client\nnpm run dev" },
        { text: "Click + for a second terminal and start the server:", code: "cd server\nnpm run dev" },
        { text: "To stop either one, click into its terminal and press Ctrl + C." },
      ],
      screen: "two-running",
    },
  ],
}

export const fullStackSetup: WalkPart[] = [
  workspacePart,
  vscodePart({
    why: "Extensions add features to VS Code. ESLint underlines mistakes as you type, Prettier tidies your code every time you save, and Prisma colours your database file so it's readable.",
    first: { name: "ESLint", by: "Microsoft" },
    rest: "Prettier - Code formatter (by Prettier) and Prisma (by Prisma)",
    screen: "vscode-extensions",
  }),
  terminalPart,
  gitPart,
  githubPart,
  nodePart("Both halves of your project — the React website and the Express API — run on it."),
  postgresPart,
  projectPart,
  nextTimePart,
  aiPart,
]

/** What a finished setup gives you — shown as a checklist at the end. */
export const fullStackSetupDone = [
  "A devvy folder for all your work",
  "VS Code with ESLint, Prettier and Prisma",
  "Git, configured with your name and email",
  "A GitHub account and the GitHub CLI, logged in",
  "Node.js and npm",
  "PostgreSQL, running",
  "my-fullstack-app with a React client and an Express API, both running",
  "Your first commit, pushed to GitHub",
]
