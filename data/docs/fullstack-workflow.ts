import type { WalkPart } from "@/data/docs/types"
import { codeWorkflow, workflowCtx, workflowDone } from "@/data/docs/workflow"

/*
 * Full-Stack "How we work" and "Environment & secrets", written as hands-on
 * walkthroughs that continue the my-fullstack-app project from Setup.
 *
 * Numbers like (1) match the red markers in the pictures (screen ids live in
 * components/docs/screens/workflow.tsx). Windows commands must work in
 * Windows PowerShell 5.1: one command per line, no "&&".
 */

/* ================================================================== */
/* How we work                                                        */
/* ================================================================== */

export const fullStackWorkflow: WalkPart[] = codeWorkflow(workflowCtx["full-stack"])

export const fullStackWorkflowDone = workflowDone

/* ================================================================== */
/* Environment & secrets                                              */
/* ================================================================== */

export const fullStackEnvironment: WalkPart[] = [
  {
    id: "what",
    title: "What's a secret?",
    time: "3 min",
    intro:
      "Some settings are private: your database password, the key that signs login tokens, API keys for paid services. These are secrets. This page shows where they go, and the one rule you must never break.",
    steps: [
      {
        title: "Secrets live in .env, which never leaves your computer",
        actions: [
          { text: "You already made one: server/.env holds your database address and password (1)." },
          { text: "Your .gitignore tells Git to skip it (2), so it never reaches GitHub." },
          {
            text: "Instead, you commit a .env.example (3): the same names with the secret values left empty. Anyone who clones the repo copies it to .env and fills in their own values.",
          },
        ],
        screen: "env-diagram",
      },
      {
        title: "The one rule: never commit a secret",
        why: "Git keeps every commit forever. If a secret is committed once, deleting the file later doesn't remove it — it's still in the history (1), and anyone can read it.",
        actions: [
          { text: "Before every commit, run git status and check no .env file is listed." },
          { text: "If a secret ever reaches GitHub, treat it as stolen: change it, then tell your mentor. Part 4 shows how." },
        ],
        screen: "env-history",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "check",
    title: "Check your project is safe",
    time: "3 min",
    intro: "Two quick checks that your .env from Setup really is private.",
    steps: [
      {
        title: "Ask Git whether .env is ignored",
        actions: [{ text: "Open my-fullstack-app in VS Code and open a terminal. Run:", code: "git check-ignore -v server/.env" }],
        screen: "env-check-ignore",
        check: [
          {
            text: "It prints server/.gitignore:2:.env server/.env (1). In the Explorer, .env is greyed out (2) — VS Code's way of showing an ignored file.",
          },
        ],
        warn: "If it prints nothing, .env is NOT ignored. Open server/.gitignore and make sure it has a line that says exactly .env, then run the check again.",
      },
      {
        title: "Check GitHub doesn't have it",
        actions: [{ text: "Open your repo in the browser:", code: "gh repo view --web" }, { text: "Click the server folder." }],
        screen: "env-github-server",
        check: [{ text: "You see .gitignore, package.json, prisma, src and so on (1), but no .env." }],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "example",
    title: "Set up your environment properly",
    time: "20 min",
    intro:
      "You'll add .env.example files, a JWT_SECRET for week 2's logins, and give the React client the address of your API. It's a real task, so you'll do it with the loop from How we work.",
    steps: [
      {
        title: "Start a branch",
        actions: [
          {
            text: "Get the latest main and create a branch, one command at a time:",
            code: "git checkout main\ngit pull\ngit checkout -b feat/env-setup",
          },
        ],
        screen: "env-branch",
        check: [{ text: "The bottom-left corner shows feat/env-setup (1)." }],
      },
      {
        title: "Create server/.env.example",
        why: "This tells anyone setting up the project which settings they need, without giving away yours. The # lines are comments explaining each one.",
        actions: [
          { text: "Right-click the server folder → New File…, type .env.example and press Enter." },
          {
            text: "Paste this and save. Leave the secret values empty:",
            file: "server/.env.example",
            code: "# PostgreSQL connection: postgresql://USER:PASSWORD@HOST:PORT/DATABASE\nDATABASE_URL=\n# Long random string used to sign login tokens\nJWT_SECRET=\n# Port the API listens on\nPORT=4000\n# Where the React app runs (allowed by CORS)\nCLIENT_URL=http://localhost:5173",
          },
        ],
        screen: "env-example-file",
        check: [{ text: ".env.example shows in green with a U (1) — Git will save it. .env just above it stays grey." }],
      },
      {
        title: "Generate a JWT secret",
        why: "In week 2, your API signs login tokens with JWT_SECRET. It must be long and random, so nobody can guess it.",
        actions: [
          {
            text: "In the terminal, run this. It prints 64 random characters:",
            code: "node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
          },
          { text: "Select the line it printed (1) and copy it." },
        ],
        screen: "env-jwt",
      },
      {
        title: "Add it to your real .env",
        actions: [
          {
            text: "Open server › .env and add a JWT_SECRET line with what you copied, inside quotes (1). Save.",
            file: "server/.env",
            code: 'JWT_SECRET="paste-the-64-characters-here"',
          },
        ],
        screen: "env-dotenv",
        note: "Every time you add a setting to .env, add its name (without the value) to .env.example too. That keeps the two in step.",
      },
      {
        title: "Restart the server",
        why: "The server reads .env only when it starts. After changing .env, always restart it.",
        actions: [
          { text: "Click the terminal that's running the server (use the list on the right of the terminal panel)." },
          { text: "Press Ctrl + C to stop it (1). Then start it again:", code: "npm run dev" },
          { text: "No server terminal running? Open a new one and run cd server first." },
        ],
        screen: "env-restart",
        check: [{ text: "It prints API running on http://localhost:4000 (2)." }],
      },
      {
        title: "Give the client the API's address",
        why: "The React app needs to know where your API is. Vite only passes settings that start with VITE_ to the browser.",
        actions: [
          {
            text: "Right-click the client folder → New File…, type .env and press Enter. Paste this and save:",
            file: "client/.env",
            code: "VITE_API_URL=http://localhost:4000",
          },
          { text: "Right-click client again → New File…, type .env.example, paste the same line, and save." },
        ],
        screen: "env-client-env",
        warn: "Anything in client/.env ends up in the website's code, where anyone can read it. Only put addresses here — never passwords or secret keys.",
      },
      {
        title: "Make Git ignore client/.env",
        why: "Vite's .gitignore doesn't include .env, so you add it. The address isn't secret, but keeping every .env out of Git is the habit that protects you when it is.",
        actions: [
          { text: "Open client › .gitignore, add .env as a new line at the very bottom (1), and save.", file: "client/.gitignore", code: ".env" },
        ],
        screen: "env-client-gitignore",
      },
      {
        title: "Use it in React",
        why: "A real check that the client can reach the API: the page will ask /health and show the answer.",
        actions: [
          {
            text: "Open client › src › App.tsx, delete everything in it, paste this, and save:",
            file: "client/src/App.tsx",
            code: 'import { useEffect, useState } from "react"\n\nconst API_URL = import.meta.env.VITE_API_URL\n\nexport default function App() {\n  const [status, setStatus] = useState("checking…")\n\n  useEffect(() => {\n    fetch(`${API_URL}/health`)\n      .then((res) => res.json())\n      .then((data) => setStatus(data.ok ? "connected ✅" : "not ok"))\n      .catch(() => setStatus("can\'t reach the API ❌"))\n  }, [])\n\n  return (\n    <main style={{ fontFamily: "sans-serif", padding: 40 }}>\n      <h1>My Full-Stack App</h1>\n      <p>API: {status}</p>\n    </main>\n  )\n}',
          },
          { text: "import.meta.env.VITE_API_URL (1) is how Vite code reads a setting from client/.env." },
        ],
        screen: "env-app",
      },
      {
        title: "Restart the client and check",
        actions: [
          {
            text: "Like the server, Vite reads .env only when it starts. Click the terminal running the client, press Ctrl + C, then:",
            code: "npm run dev",
          },
          { text: "Open http://localhost:5173 in your browser." },
        ],
        screen: "env-browser",
        check: [{ text: "The page says API: connected ✅ (1). Your React app is talking to your API. 🎉" }],
        warn: "“can't reach the API ❌” means the server isn't running, or you didn't restart the client after creating client/.env.",
      },
      {
        title: "Check before you commit",
        actions: [
          {
            text: "Use the third terminal (or click + for a new one). It should be in my-fullstack-app — not server or client. Then:",
            code: "git add .\ngit status",
          },
        ],
        screen: "env-git-status",
        check: [
          { text: "Both .env.example files are listed (1) (2), along with client/.gitignore and client/src/App.tsx." },
          { text: "No .env file is listed anywhere. If one is, run git reset to un-add everything, and fix that folder's .gitignore first." },
        ],
      },
      {
        title: "Commit, push and open a pull request",
        actions: [
          {
            text: "One command at a time:",
            code: 'git commit -m "Add env examples and show API status"\ngit push -u origin feat/env-setup\ngh pr create --fill',
          },
          { text: "Write the description, ask your mentor for a review, and merge when approved — exactly like How we work. Then pull main." },
        ],
        screen: "env-pr",
        check: [{ text: "gh prints your pull request link (1)." }],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "leaks",
    title: "If a secret leaks",
    time: "2 min",
    intro: "Mistakes happen. What matters is what you do next — quickly, and without hiding it.",
    steps: [
      {
        title: "GitHub blocks your push",
        why: "GitHub scans pushes for things that look like real keys and stops them before they go public.",
        actions: [
          { text: "If git push fails with GH013 … Push cannot contain secrets (1), nothing was uploaded. Good." },
          { text: "Don't open the link that allows the secret. Email your mentor a screenshot — they'll help you take it out of the commit." },
        ],
        screen: "env-push-blocked",
      },
      {
        title: "A secret reached GitHub",
        actions: [
          {
            text: "Change it at the source, right away: make a new JWT_SECRET, change the database password, or delete and recreate the API key in that service's dashboard.",
          },
          { text: "Put the new value in your .env and restart the server." },
          { text: "Tell your mentor what happened. Deleting the file or the repo isn't enough — copies may already exist." },
        ],
        screen: "env-leak",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "deploy",
    title: "When you deploy",
    time: "1 min",
    intro: "A preview of week 4, so the idea is familiar when you get there.",
    steps: [
      {
        title: "Your host has its own .env",
        actions: [
          { text: "Hosting services don't have your .env file. Instead, their dashboard has an Environment Variables page." },
          { text: "You add the same names from .env.example (1), with the live values (2). The Deployment page walks you through it." },
        ],
        screen: "env-hosting",
      },
    ],
  },
]

export const fullStackEnvironmentDone = [
  "Secrets live in .env, and every .env is in .gitignore",
  "server/.env.example and client/.env.example list every setting, with secret values empty",
  "JWT_SECRET is long and random, and only in your .env",
  "You restart the server or client after changing .env",
  "git status shows no .env before every commit",
  "Your React app shows API: connected ✅",
]
