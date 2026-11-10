import type { OS, WalkPart, WalkStep } from "@/data/docs/types"

/*
 * "Environment & secrets" for every code track except Full-Stack (which
 * lives in data/docs/fullstack-workflow.ts), plus UI/UX's version about
 * research data. Screens: components/docs/screens/environment.tsx
 * (envScreensFor). Windows commands must work in PowerShell 5.1.
 */

const NIX: OS[] = ["mac", "linux"]
const WIN: OS[] = ["windows"]
const MAC: OS[] = ["mac"]

export type EnvCtx = {
  repo: string
  /** The file that holds secrets: .env, or .env.local for Next.js. */
  envFile: string
  /** The project already has an env file from Setup. */
  hasEnv: boolean
  /** Stack-specific steps between "start a branch" and "check before you commit". */
  task: WalkStep[]
  /** Files git status should list in the final check. */
  expect: string
  commit: string
  deploy: WalkStep
  /** Expo's .gitignore doesn't cover .env, so the check part fixes it. */
  fixIgnore?: boolean
}

/* ------------------------------------------------------------------ */
/* Parts every stack shares                                            */
/* ------------------------------------------------------------------ */

function whatPart(c: EnvCtx): WalkPart {
  return {
    id: "what",
    title: "What's a secret?",
    time: "3 min",
    intro:
      "Some settings are private: database passwords, the key that signs login tokens, API keys for paid services. These are secrets. This page shows where they go, and the one rule you must never break.",
    steps: [
      {
        title: `Secrets live in ${c.envFile}, which never leaves your computer`,
        actions: [
          { text: `Secrets go in a file called ${c.envFile} (1) in your project folder.${c.hasEnv ? " You already made one in Setup." : " You'll make yours in part 3."}` },
          { text: "Your .gitignore tells Git to skip it (2), so it never reaches GitHub." },
          { text: "Instead, you commit a .env.example (3): the same names with the secret values left empty. Anyone who clones the repo copies it and fills in their own values." },
        ],
        screen: "env-diagram",
      },
      {
        title: "The one rule: never commit a secret",
        why: "Git keeps every commit forever. If a secret is committed once, deleting the file later doesn't remove it — it's still in the history (1), and anyone can read it.",
        actions: [
          { text: `Before every commit, run git status and check ${c.envFile} isn't listed.` },
          { text: "If a secret ever reaches GitHub, treat it as stolen: change it, then tell your mentor. Part 4 shows how." },
        ],
        screen: "env-history",
      },
    ],
  }
}

function checkPart(c: EnvCtx): WalkPart {
  const steps: WalkStep[] = c.fixIgnore
    ? [
        {
          title: `Ask Git whether ${c.envFile} is ignored`,
          why: "git check-ignore tells you whether .gitignore covers a file — even one you haven't made yet.",
          actions: [{ text: `Open ${c.repo} in VS Code and open a terminal. Run:`, code: `git check-ignore -v ${c.envFile}` }],
          screen: "env-check-empty",
          check: [{ text: "It prints nothing (1). That means .env is NOT ignored yet — Expo's .gitignore only covers files like .env.local." }],
        },
        {
          title: "Fix it",
          actions: [
            { text: "Open .gitignore, add .env on a new line at the very bottom (1), and save.", file: ".gitignore", code: ".env" },
            { text: "Run the check again:", code: `git check-ignore -v ${c.envFile}` },
          ],
          screen: "env-check-fixed",
          check: [{ text: "This time it prints a line ending in .env (2). Fixed." }],
        },
      ]
    : [
        {
          title: `Ask Git whether ${c.envFile} is ignored`,
          why: "git check-ignore tells you whether .gitignore covers a file — even one you haven't made yet.",
          actions: [{ text: `Open ${c.repo} in VS Code and open a terminal. Run:`, code: `git check-ignore -v ${c.envFile}` }],
          screen: "env-check-ignore",
          check: [{ text: `It prints the .gitignore line that covers it, ending in ${c.envFile} (1).${c.hasEnv ? ` In the Explorer, ${c.envFile} is greyed out (2) — VS Code's way of showing an ignored file.` : ""}` }],
          warn: `If it prints nothing, ${c.envFile} is NOT ignored. Open .gitignore, add ${c.envFile} on its own line, save, and run the check again.`,
        },
      ]
  if (c.hasEnv) {
    steps.push({
      title: "Check GitHub doesn't have it",
      actions: [
        { text: "Open your repo in the browser:", code: "gh repo view --web" },
        { text: `Look at the list of files.` },
      ],
      screen: "env-github",
      check: [{ text: `You see your project's files (1), but no ${c.envFile}.` }],
    })
  }
  return {
    id: "check",
    title: "Check your project is safe",
    time: "3 min",
    intro: c.hasEnv ? `Two quick checks that your ${c.envFile} from Setup really is private.` : `Before you make ${c.envFile}, check Git will ignore it.`,
    steps,
  }
}

function taskPart(c: EnvCtx, intro: string): WalkPart {
  return {
    id: "example",
    title: "Set up your environment properly",
    time: "15 min",
    intro,
    steps: [
      {
        title: "Start a branch",
        actions: [{ text: "Get the latest main and create a branch, one command at a time:", code: "git checkout main\ngit pull\ngit checkout -b feat/env-setup" }],
        screen: "env-branch",
        check: [{ text: "The bottom-left corner shows feat/env-setup (1)." }],
      },
      ...c.task,
      {
        title: "Check before you commit",
        actions: [{ text: "In a terminal that isn't running anything, run:", code: "git add .\ngit status" }],
        screen: "env-git-status",
        check: [
          { text: `${c.expect} (1).` },
          { text: `${c.envFile} is NOT listed anywhere. If it is, run git reset to un-add everything, and fix .gitignore first.` },
        ],
      },
      {
        title: "Commit, push and open a pull request",
        actions: [
          { text: "One command at a time:", code: `git commit -m "${c.commit}"\ngit push -u origin feat/env-setup\ngh pr create --fill` },
          { text: "Write the description, ask your mentor for a review, and merge when approved — exactly like How we work. Then pull main." },
        ],
        screen: "env-pr",
        check: [{ text: "gh prints your pull request link (1)." }],
      },
    ],
  }
}

const leaksPart: WalkPart = {
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
        { text: "Don't open the link that allows the secret. Send your mentor a screenshot — they'll help you take it out of the commit." },
      ],
      screen: "env-push-blocked",
    },
    {
      title: "A secret reached GitHub",
      actions: [
        { text: "Change it at the source, right away: make a new key in that service's dashboard and delete the old one, or change the password." },
        { text: "Put the new value in your env file and restart your app." },
        { text: "Tell your mentor what happened. Deleting the file or the repo isn't enough — copies may already exist." },
      ],
      screen: "env-leak",
    },
  ],
}

function deployPart(step: WalkStep): WalkPart {
  return { id: "deploy", title: "When you deploy", time: "1 min", intro: "A preview of week 4, so the idea is familiar when you get there.", steps: [step] }
}

function envWalk(c: EnvCtx, taskIntro: string): WalkPart[] {
  return [whatPart(c), checkPart(c), taskPart(c, taskIntro), leaksPart, deployPart(c.deploy)]
}

const hostingStep: WalkStep = {
  title: "Your host has its own settings",
  actions: [
    { text: "Hosting services don't have your env file. Instead, their dashboard has an Environment Variables page." },
    { text: "You add the same names from .env.example (1), with the live values (2). The Deployment page walks you through it." },
  ],
  screen: "env-hosting",
}

/* ------------------------------------------------------------------ */
/* Backend — Express                                                   */
/* ------------------------------------------------------------------ */

const backendCtx: EnvCtx = {
  repo: "my-api",
  envFile: ".env",
  hasEnv: true,
  expect: ".env.example is listed",
  commit: "Add .env.example",
  deploy: hostingStep,
  task: [
    {
      title: "Create .env.example",
      why: "This tells anyone setting up the project which settings they need, without giving away yours. The # lines are comments explaining each one.",
      actions: [
        { text: "Right-click the empty space in the Explorer → New File…, type .env.example and press Enter." },
        {
          text: "Paste this and save. Leave the secret values empty:",
          file: ".env.example",
          code: "# PostgreSQL connection: postgresql://USER:PASSWORD@HOST:PORT/DATABASE\nDATABASE_URL=\n# Redis running in Docker\nREDIS_URL=redis://localhost:6379\n# Long random string used to sign login tokens\nJWT_SECRET=\n# Port the API listens on\nPORT=4000",
        },
      ],
      screen: "env-example-file",
      check: [{ text: ".env.example shows in green with a U (1) — Git will save it. .env just above it stays grey." }],
    },
    {
      title: "Generate a JWT secret",
      why: "In week 2, your API signs login tokens with JWT_SECRET. It must be long and random, so nobody can guess it.",
      actions: [
        { text: "In the terminal, run this. It prints 64 random characters:", code: "node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"" },
        { text: "Select the line it printed (1) and copy it." },
      ],
      screen: "env-jwt",
    },
    {
      title: "Add it to your real .env",
      actions: [{ text: "Open .env and add a JWT_SECRET line with what you copied, inside quotes (1). Save.", file: ".env", code: 'JWT_SECRET="paste-the-64-characters-here"' }],
      screen: "env-dotenv",
      note: "Every time you add a setting to .env, add its name (without the value) to .env.example too. That keeps the two in step.",
    },
    {
      title: "Restart the server",
      why: "The server reads .env only when it starts. After changing .env, always restart it.",
      actions: [
        { text: "Click the terminal that's running the server. Press Ctrl + C to stop it (1). Then start it again:", code: "npm run dev" },
        { text: "No server running? Open a new terminal and run the same command." },
      ],
      screen: "env-restart",
      check: [{ text: "It prints API running on http://localhost:4000 (2)." }],
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Frontend — Next.js                                                  */
/* ------------------------------------------------------------------ */

const PAGE_ENV =
  'import { Button } from "@/components/ui/button"\n\nexport default function Home() {\n  return (\n    <main className="flex min-h-screen flex-col items-center justify-center gap-4">\n      <h1 className="text-4xl font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</h1>\n      <p className="text-zinc-500">Built with Next.js and Tailwind CSS.</p>\n      <Button>Get started</Button>\n    </main>\n  )\n}'

const frontendCtx: EnvCtx = {
  repo: "my-frontend-app",
  envFile: ".env.local",
  hasEnv: false,
  expect: ".env.example and app/page.tsx are listed",
  commit: "Add env example and app name setting",
  deploy: { ...hostingStep, screen: "env-hosting" },
  task: [
    {
      title: "Two kinds of settings",
      why: "Next.js keeps settings server-only unless their name starts with NEXT_PUBLIC_. Those are copied into the website itself, where anyone can read them.",
      actions: [
        { text: "NEXT_PUBLIC_ settings (1): safe things the browser needs, like your app's name or a public API address." },
        { text: "Everything else (2): secrets like API keys. Only code that runs on the server — like your page components — can read them." },
      ],
      screen: "env-next-kinds",
    },
    {
      title: "Create .env.example",
      actions: [
        { text: "Right-click the empty space in the Explorer → New File…, type .env.example and press Enter." },
        {
          text: "Paste this and save:",
          file: ".env.example",
          code: "# Shown in the browser — never put secrets in NEXT_PUBLIC_ settings\nNEXT_PUBLIC_APP_NAME=My Frontend App\n# Server-only, e.g. the movie project's API key from themoviedb.org\nTMDB_API_KEY=",
        },
      ],
      screen: "env-example-file",
      check: [{ text: ".env.example shows in green with a U (1)." }],
    },
    {
      title: "Make your .env.local",
      actions: [
        { text: "Copy the example to make your real settings file:", code: "cp .env.example .env.local" },
        { text: "Open .env.local and change the app name to anything you like (1). Save." },
      ],
      screen: "env-dotenv",
      check: [{ text: ".env.local appears greyed out in the Explorer — Git is ignoring it." }],
    },
    {
      title: "Use it in your page",
      actions: [
        { text: "Open app › page.tsx. Replace the h1 line so it shows the setting (1), and save:", file: "app/page.tsx", code: PAGE_ENV },
      ],
      screen: "env-next-page",
    },
    {
      title: "Check it in the browser",
      actions: [
        { text: "Make sure npm run dev is running, and open http://localhost:3000." },
        { text: "Next.js reloads settings when .env.local changes. If you don't see your name, stop npm run dev with Ctrl + C and start it again." },
      ],
      screen: "env-next-browser",
      check: [{ text: "The heading shows the name from .env.local (1)." }],
    },
  ],
}

/* ------------------------------------------------------------------ */
/* App development — Expo                                              */
/* ------------------------------------------------------------------ */

const appCtx: EnvCtx = {
  repo: "my-mobile-app",
  envFile: ".env",
  hasEnv: false,
  fixIgnore: true,
  expect: ".env.example, .gitignore and the screen you edited are listed",
  commit: "Add env example and API address setting",
  deploy: {
    title: "Everything in your app is public",
    actions: [
      { text: "EXPO_PUBLIC_ settings are built into your app. Anyone who installs it can dig them out." },
      { text: "So a phone app never holds real secrets. Secret keys live on a server, and the app talks to that server." },
      { text: "For your week 4 build, you add the same names in your project's Environment variables page on expo.dev (1), with the live values (2)." },
    ],
    screen: "env-hosting",
  },
  task: [
    {
      title: "Find your computer's Wi-Fi address",
      why: "On your phone, “localhost” means the phone itself. To reach an API on your laptop, the app needs your laptop's address on the Wi-Fi.",
      actions: [
        { os: MAC, text: "Run:", code: "ipconfig getifaddr en0" },
        { os: WIN, text: "Run this and find the IPv4 Address line under Wireless LAN adapter Wi-Fi:", code: "ipconfig" },
        { os: ["linux"], text: "Run this — the first address is the one you want:", code: "hostname -I" },
      ],
      screen: "env-ip",
      check: [{ text: "You see an address like 192.168.1.10 (1). Yours will be different — note it down." }],
    },
    {
      title: "Create .env.example and .env",
      actions: [
        { text: "Right-click the empty space in the Explorer → New File…, type .env.example and press Enter. Paste this and save:", file: ".env.example", code: "# Your computer's Wi-Fi address — not localhost\nEXPO_PUBLIC_API_URL=http://192.168.1.10:4000" },
        { text: "Copy it to make your real file:", code: "cp .env.example .env" },
        { text: "Open .env and replace 192.168.1.10 with your own address (1). Save." },
      ],
      screen: "env-dotenv",
    },
    {
      title: "Use it in your app",
      actions: [
        { text: "Open app › (tabs) › index.tsx. Just below the line with Hello, Devvy!, add this line (1) and save:", code: "<ThemedText>API: {process.env.EXPO_PUBLIC_API_URL}</ThemedText>" },
      ],
      screen: "env-expo-code",
      note: "In Expo, only settings that start with EXPO_PUBLIC_ reach your app's code.",
    },
    {
      title: "Restart Expo and check your phone",
      why: "Expo reads .env when it starts, so restart it after changing settings.",
      actions: [
        { text: "Click the terminal running Expo, press Ctrl + C, then start it again:", code: "npx expo start" },
        { text: "Open the app on your phone again." },
      ],
      screen: "env-expo-phone",
      check: [{ text: "Your phone shows API: followed by your address (1)." }],
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Python tracks                                                       */
/* ------------------------------------------------------------------ */

function pythonCtx(opts: { repo: string; configPath: string; example: string; check: string; checkOut: string; deploy: WalkStep; extra?: WalkStep[] }): EnvCtx {
  const configCode =
    opts.configPath === "config.py"
      ? 'import os\n\nfrom dotenv import load_dotenv\n\nload_dotenv()\n\nDATA_DIR = os.getenv("DATA_DIR", "data")\nLLM_API_KEY = os.getenv("LLM_API_KEY")'
      : 'import os\n\nfrom dotenv import load_dotenv\n\nload_dotenv()\n\nDATABASE_PATH = os.getenv("DATABASE_PATH", "data.db")\nTELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")\nTELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")'
  return {
    repo: opts.repo,
    envFile: ".env",
    hasEnv: false,
    expect: `.env.example, ${opts.configPath} and requirements.txt are listed`,
    commit: "Add env example and config",
    deploy: opts.deploy,
    task: [
      {
        title: "Install python-dotenv",
        why: "python-dotenv reads your .env file, so your code can use the settings in it.",
        actions: [
          { text: "Check the prompt starts with (.venv), then run:", code: "pip install python-dotenv" },
          { os: NIX, text: "Update requirements.txt so it includes the new library:", code: "pip freeze > requirements.txt" },
          { os: WIN, text: "Update requirements.txt so it includes the new library:", code: "pip freeze | Out-File -Encoding utf8 requirements.txt" },
        ],
        screen: "env-py-install",
        check: [{ text: "It says Successfully installed python-dotenv (1)." }],
      },
      {
        title: "Create .env.example and .env",
        actions: [
          { text: "Right-click the empty space in the Explorer → New File…, type .env.example and press Enter. Paste this and save:", file: ".env.example", code: opts.example },
          { text: "Copy it to make your real file:", code: "cp .env.example .env" },
        ],
        screen: "env-example-file",
        check: [{ text: ".env.example shows in green with a U (1), and .env appears greyed out — Git is ignoring it." }],
      },
      {
        title: "Read the settings in one place",
        why: "Keeping every setting in one config file means the rest of your code just imports it — and there's one place to look.",
        actions: [
          { text: `Right-click ${opts.configPath === "config.py" ? "the empty space in the Explorer" : "the app folder"} → New File…, type ${opts.configPath === "config.py" ? "config.py" : "config.py"} and press Enter. Paste this and save:`, file: opts.configPath, code: configCode },
        ],
        screen: "env-py-config",
      },
      {
        title: "Check it works",
        actions: [{ text: "Run:", code: opts.check }],
        screen: "env-py-check",
        check: [{ text: `It prints ${opts.checkOut} (1) — the value from your .env.` }],
      },
      ...(opts.extra ?? []),
    ],
  }
}

const streamlitDeploy: WalkStep = {
  title: "Streamlit has its own secrets",
  actions: [
    { text: "When you put your app on Streamlit Community Cloud in week 4, it can't see your .env." },
    { text: "Instead, open your app's Settings → Secrets and add the same names (1) with the live values (2). Your code reads them with st.secrets." },
  ],
  screen: "env-hosting",
}

const mlCtx = pythonCtx({
  repo: "my-ml-project",
  configPath: "config.py",
  example: "# Folder with your datasets\nDATA_DIR=data\n# Only for projects that call an LLM, like the document Q&A bot\nLLM_API_KEY=",
  check: 'python -c "import config; print(config.DATA_DIR)"',
  checkOut: "data",
  deploy: streamlitDeploy,
  extra: [
    {
      title: "Big datasets stay out of Git too",
      actions: [
        { text: "GitHub rejects files over 100 MB, and big files make your repo slow for everyone." },
        { text: "Put large raw files in data/raw/, add data/raw/ on a new line in .gitignore, and link to where the data came from in your README." },
      ],
    },
  ],
})

const dsCtx = pythonCtx({
  repo: "my-analysis",
  configPath: "config.py",
  example: "# Folder with your datasets\nDATA_DIR=data\n# Only if you use an LLM for summaries\nLLM_API_KEY=",
  check: 'python -c "import config; print(config.DATA_DIR)"',
  checkOut: "data",
  deploy: streamlitDeploy,
  extra: mlCtx.task.slice(-1),
})

const pyCtx = pythonCtx({
  repo: "my-python-tool",
  configPath: "app/config.py",
  example: "# Where the tool keeps its data\nDATABASE_PATH=data.db\n# Only for web scraper alerts\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=",
  check: 'python -c "from app.config import DATABASE_PATH; print(DATABASE_PATH)"',
  checkOut: "data.db",
  deploy: hostingStep,
  extra: [
    {
      title: "Only for the web scraper: Telegram alerts",
      actions: [
        { text: "In Telegram, message @BotFather, send /newbot and follow the questions. It gives you a token — put it in .env as TELEGRAM_BOT_TOKEN." },
        { text: "Send your new bot any message, then open https://api.telegram.org/bot<TOKEN>/getUpdates (with your token) in the browser. Your chat id is the number after \"chat\":{\"id\":" },
      ],
      warn: "Your bot token is a secret: anyone with it controls your bot. It only ever goes in .env.",
    },
  ],
})

/* ------------------------------------------------------------------ */
/* Java — Spring Boot                                                  */
/* ------------------------------------------------------------------ */

const javaCtx: EnvCtx = {
  repo: "my-java-api",
  envFile: ".env",
  hasEnv: true,
  expect: ".env.example is listed",
  commit: "Add .env.example",
  deploy: hostingStep,
  task: [
    {
      title: "How Spring Boot reads .env",
      actions: [
        { text: "Open src › main › resources › application.properties." },
        { text: "spring.config.import (1) tells Spring Boot to read .env. Each ${…} (2) is filled in from it — so the password never appears in a file you commit." },
      ],
      screen: "env-java-properties",
      warn: "If the app won't start with “Could not resolve placeholder 'DATABASE_PASSWORD'”, that name is missing from .env, or .env isn't in the project folder.",
    },
    {
      title: "Create .env.example",
      why: "This tells anyone setting up the project which settings they need, without giving away yours.",
      actions: [
        { text: "Right-click the empty space in the Explorer → New File…, type .env.example and press Enter." },
        {
          text: "Paste this and save. Leave the password empty:",
          file: ".env.example",
          code: "# JDBC address of your PostgreSQL database\nDATABASE_URL=jdbc:postgresql://localhost:5432/devvy_java\n# Your PostgreSQL username and password\nDATABASE_USER=postgres\nDATABASE_PASSWORD=",
        },
      ],
      screen: "env-example-file",
      check: [{ text: ".env.example shows in green with a U (1) — Git will save it. .env just above it stays grey." }],
      note: "Every time you add a setting to .env, add its name (without the value) to .env.example too.",
    },
  ],
}

/* ------------------------------------------------------------------ */

export const envWalks = {
  backend: envWalk(backendCtx, "You'll add a .env.example and a JWT_SECRET for week 2's logins. It's a real task, so you'll do it with the loop from How we work."),
  frontend: envWalk(frontendCtx, "You'll add a .env.example, make your .env.local, and show a setting on your page. It's a real task, so you'll do it with the loop from How we work."),
  "app-development": envWalk(appCtx, "You'll give your app the address of an API on your laptop, the safe way. It's a real task, so you'll do it with the loop from How we work."),
  "ai-ml": envWalk(mlCtx, "You'll add .env files and a config.py that reads them. It's a real task, so you'll do it with the loop from How we work."),
  "data-science": envWalk(dsCtx, "You'll add .env files and a config.py that reads them. It's a real task, so you'll do it with the loop from How we work."),
  python: envWalk(pyCtx, "You'll add .env files and an app/config.py that reads them. It's a real task, so you'll do it with the loop from How we work."),
  java: envWalk(javaCtx, "You'll see how Spring Boot reads your .env, and add a .env.example. It's a real task, so you'll do it with the loop from How we work."),
}

export const envDone: Record<keyof typeof envWalks, string[]> = {
  backend: ["Secrets live in .env, and .env is in .gitignore", ".env.example lists every setting, with secret values empty", "JWT_SECRET is long and random, and only in your .env", "You restart the server after changing .env", "git status shows no .env before every commit"],
  frontend: [".env.local holds your settings and Git ignores it", ".env.example lists every setting", "Only safe values use NEXT_PUBLIC_", "Secrets are read only in server code", "git status shows no .env.local before every commit"],
  "app-development": [".env is in .gitignore", ".env.example lists every setting", "Your app reads EXPO_PUBLIC_API_URL", "No real secrets ever go in the app", "git status shows no .env before every commit"],
  "ai-ml": [".env is in .gitignore", ".env.example lists every setting", "config.py reads your settings with python-dotenv", "Big datasets stay out of Git", "git status shows no .env before every commit"],
  "data-science": [".env is in .gitignore", ".env.example lists every setting", "config.py reads your settings with python-dotenv", "Big datasets stay out of Git", "git status shows no .env before every commit"],
  python: [".env is in .gitignore", ".env.example lists every setting", "app/config.py reads your settings with python-dotenv", "Tokens like your Telegram bot's only live in .env", "git status shows no .env before every commit"],
  java: [".env holds your database login and Git ignores it", "application.properties uses ${…} instead of real values", ".env.example lists every setting", "git status shows no .env before every commit"],
}

export const envCtxs = { backend: backendCtx, frontend: frontendCtx, "app-development": appCtx, "ai-ml": mlCtx, "data-science": dsCtx, python: pyCtx, java: javaCtx }

/* ------------------------------------------------------------------ */
/* UI/UX — research data and sharing                                   */
/* ------------------------------------------------------------------ */

export const designEnvironment: WalkPart[] = [
  {
    id: "research",
    title: "Research data is private",
    time: "3 min",
    intro:
      "Designers don't usually handle passwords and API keys — but you do handle something just as sensitive: what real people tell you in interviews. This page is about keeping that safe.",
    steps: [
      {
        title: "Ask for consent first",
        why: "People should know what you'll do with what they tell you, before they tell you.",
        actions: [
          { text: "Before every interview, read a short consent script (1) and wait for a yes." },
          { text: "If they say no to recording, take notes instead." },
        ],
        screen: "ux-consent",
      },
      {
        title: "Anonymise everything you publish",
        actions: [
          { text: "In your notes, FigJam and case study, call people P1, P2, P3 — or use first names only with permission." },
          { text: "Never publish full names, phone numbers, emails, workplaces or photos of people." },
        ],
        screen: "ux-anon",
      },
      {
        title: "Keep raw recordings private",
        actions: [
          { text: "Keep recordings and full transcripts in a private folder (like your own Google Drive) — never in Figma, FigJam or GitHub." },
          { text: "Publish only your synthesis: themes, quotes without names, and insights. Delete recordings when the project ends." },
        ],
      },
    ],
  },
  {
    id: "sharing",
    title: "Share with the right access",
    time: "3 min",
    intro: "Figma's share settings decide who can see — and who can change — your work.",
    steps: [
      {
        title: "Your mentor: can comment",
        actions: [
          { text: "Click Share in your design file. Your mentor should have can comment (1) — they can leave feedback but can't change your designs." },
          { text: "Never give anyone can edit unless you're working on the file together." },
        ],
        screen: "ux-share",
      },
      {
        title: "Your portfolio: view-only prototype link",
        actions: [
          { text: "In Prototype mode, click Share prototype. Set Anyone with the link to can view (1), then Copy link (2)." },
          { text: "This link shows only the prototype, not your working file — safe to put in your case study and CV." },
        ],
        screen: "ux-proto-share",
      },
    ],
  },
]

export const designEnvironmentDone = [
  "Consent before every interview",
  "Participants are P1, P2, P3 — no names or contact details anywhere public",
  "Recordings stay in a private folder, never in Figma or GitHub",
  "Your mentor has can comment, not can edit",
  "Your portfolio links to a view-only prototype",
]
