import { stackOf, type Stack } from "@/data/docs/handbook-build"
import type { GuideSection } from "@/data/docs/types"
import type { TrackSlug } from "@/data/tracks"

/*
 * Track handbook, part 2: terminal basics, troubleshooting, resources,
 * review rubric, submission checklist and stretch goals.
 */

/* ------------------------------------------------------------------ */
/* Terminal basics (top of every code track's setup page)              */
/* ------------------------------------------------------------------ */

export const terminalBasics: GuideSection = {
  title: "Never used a terminal? Start here",
  paragraphs: [
    "The terminal is a window where you type commands instead of clicking. Most setup steps in these docs are commands you copy and paste into it.",
  ],
  steps: [
    { text: "Open one. Mac: press Cmd + Space, type “Terminal”, press Enter. Windows: open VS Code and press Ctrl + ` (the key above Tab) — use “Git Bash” or “PowerShell” from the dropdown." },
    { text: "Every command box in these docs has a copy button. Paste with Cmd/Ctrl + V (in Git Bash: Shift + Insert) and press Enter." },
    { text: "See which folder you're in:", code: "pwd" },
    { text: "List what's in this folder:", code: "ls" },
    { text: "Move into a folder (cd = change directory). Go back up one level with “cd ..”:", code: "cd my-project" },
    { text: "Some commands keep running (like a development server). Stop them with Ctrl + C." },
    { text: "Red text doesn't always mean failure — read the last few lines. If you're stuck, copy the whole error when you ask for help." },
  ],
}

/* ------------------------------------------------------------------ */
/* Troubleshooting                                                     */
/* ------------------------------------------------------------------ */

const commonProblems: GuideSection[] = [
  {
    title: "“command not found” right after installing something",
    paragraphs: ["Close the terminal completely and open a new one — it only learns about new programs when it starts. On Windows, restart VS Code too. Still failing? The installer probably didn't add it to your PATH; reinstall and tick the “Add to PATH” option."],
  },
  {
    title: "“Port 3000 (or 4000/8080) is already in use”",
    paragraphs: ["Another copy of your server is still running, probably in another terminal tab. Find it and press Ctrl + C, or free the port:"],
    code: { code: "npx kill-port 3000" },
  },
  {
    title: "git push is rejected",
    paragraphs: ["Someone (or you, on GitHub) changed main since you pulled. Get the latest changes first, then push again:"],
    code: { code: "git pull --rebase\ngit push" },
  },
  {
    title: "“It works on my laptop but not when deployed”",
    bullets: [
      "Environment variables: did you add every one from .env.example to your host's settings?",
      "Port: production must use the port the host gives you (process.env.PORT / $PORT).",
      "Database: did you run migrations against the production database?",
      "Logs: open your host's logs tab — the real error is almost always there.",
    ],
  },
]

const stackProblems: Record<Stack, GuideSection[]> = {
  express: [
    {
      title: "CORS error in the browser console",
      paragraphs: ["The browser blocks your React app from calling an API on a different address unless the API allows it. Install cors and allow your frontend's URL:"],
      code: { file: "server/src/app.ts", code: 'import cors from "cors"\napp.use(cors({ origin: process.env.CLIENT_URL }))' },
    },
    {
      title: "Prisma: “Can't reach database server”",
      bullets: [
        "Is PostgreSQL running? (Postgres.app open / service started.)",
        "Is DATABASE_URL in .env correct — user, password, port 5432, database name?",
        "Does the database exist? Create it with: createdb myapp",
      ],
    },
    {
      title: "“The table … does not exist”",
      paragraphs: ["You changed schema.prisma but didn't apply it. Run:"],
      code: { code: "npx prisma migrate dev --name describe-your-change" },
    },
    {
      title: "Every request returns 401 after logging in",
      paragraphs: ["Check the frontend sends the header exactly as Authorization: Bearer <token>, and that JWT_SECRET is the same value that signed the token (restarting with a new secret logs everyone out)."],
    },
  ],
  next: [
    {
      title: "An environment variable is undefined in the browser",
      paragraphs: ["Only variables starting with NEXT_PUBLIC_ reach the browser. Better: keep secrets server-only and fetch in a server component. Restart npm run dev after editing .env.local."],
    },
    {
      title: "“useState only works in Client Components”",
      paragraphs: ["Add \"use client\" as the first line of the file that uses hooks or onClick. Keep that component small and import it into your server page."],
    },
    {
      title: "Images from another website don't load",
      paragraphs: ["next/image only loads remote images from allowed hosts. Add the host to next.config.ts:"],
      code: { file: "next.config.ts", code: 'images: {\n  remotePatterns: [{ protocol: "https", hostname: "image.tmdb.org" }],\n}' },
    },
    {
      title: "Hydration mismatch warning",
      paragraphs: ["The server and browser rendered different HTML — usually from Date.now(), Math.random() or reading localStorage during render. Move those into useEffect."],
    },
  ],
  expo: [
    {
      title: "Expo Go can't connect to my computer",
      paragraphs: ["Your phone and laptop must be on the same Wi-Fi. College Wi-Fi often blocks this — use a tunnel instead:"],
      code: { code: "npx expo start --tunnel" },
    },
    {
      title: "API calls work on the web but fail on my phone",
      paragraphs: ["On the phone, localhost is the phone itself. Use your computer's Wi-Fi IP in EXPO_PUBLIC_API_URL (see Environment & secrets)."],
    },
    {
      title: "Notifications don't appear",
      bullets: [
        "Did you ask for permission (Notifications.requestPermissionsAsync) and did the user allow it?",
        "Scheduled local notifications work in Expo Go. Remote push notifications need a development build — check the Expo Notifications docs for your SDK version.",
      ],
    },
  ],
  pyml: [
    {
      title: "ModuleNotFoundError in Jupyter even though I installed it",
      paragraphs: ["The notebook is using a different Python than your virtual environment. Install the kernel helper inside your activated .venv, then pick “.venv” as the kernel (top right of the notebook):"],
      code: { code: "pip install ipykernel" },
    },
    {
      title: "Windows: “running scripts is disabled” when activating .venv",
      paragraphs: ["PowerShell blocks scripts by default. Allow them for your user once, then activate again:"],
      code: { code: "Set-ExecutionPolicy -Scope CurrentUser RemoteSigned" },
    },
    {
      title: "GitHub rejects my push: file too large",
      paragraphs: ["Data or model files over 100 MB can't go to GitHub. Add the folder to .gitignore, remove the file from Git (it stays on your disk), and commit:"],
      code: { code: "git rm --cached data/raw/big-file.csv\ngit commit -m \"chore: stop tracking large data file\"" },
    },
    {
      title: "Streamlit Cloud deploy fails",
      paragraphs: ["Almost always a missing library. Open the app's logs, find the ModuleNotFoundError, add that package to requirements.txt and push again."],
    },
  ],
  python: [
    {
      title: "Windows: “running scripts is disabled” when activating .venv",
      paragraphs: ["PowerShell blocks scripts by default. Allow them for your user once:"],
      code: { code: "Set-ExecutionPolicy -Scope CurrentUser RemoteSigned" },
    },
    {
      title: "“No module named app”",
      paragraphs: ["Run commands from the project root (the folder that contains app/), and use python -m app.main rather than python app/main.py."],
    },
    {
      title: "Scraper gets 403 Forbidden",
      paragraphs: ["The site is blocking automated requests. Check its robots.txt and terms — if scraping isn't allowed, pick another site. If it is, send a normal User-Agent header and slow down between requests."],
    },
    {
      title: "sqlite3: “database is locked”",
      paragraphs: ["Another process (often a DB viewer app) has the file open. Close it, and always use with sqlite3.connect(...) as conn: so connections close automatically."],
    },
  ],
  java: [
    {
      title: "“JAVA_HOME is not set” or the wrong Java version runs",
      paragraphs: ["Reinstall Temurin 21 with “Set JAVA_HOME” ticked (Windows), then open a new terminal and check java -version. In IntelliJ: File → Project Structure → SDK → 21."],
    },
    {
      title: "“Failed to configure a DataSource”",
      paragraphs: ["Spring can't find your database settings. Check application.properties and that DB_PASSWORD is set in your run configuration."],
    },
    {
      title: "./mvnw: Permission denied (Mac/Linux)",
      code: { code: "chmod +x mvnw" },
    },
    {
      title: "Port 8080 is already in use",
      paragraphs: ["Stop the other running app, or change the port in application.properties: server.port=8081"],
    },
  ],
  design: [
    {
      title: "My Figma file is slow",
      paragraphs: ["Split work across pages, delete hidden unused frames, and avoid huge uncompressed images — compress screenshots before pasting."],
    },
    {
      title: "Fonts look different for my mentor",
      paragraphs: ["Use Google Fonts (available in Figma for everyone) instead of fonts installed only on your computer."],
    },
    {
      title: "The prototype doesn't start where I expect",
      paragraphs: ["Set a flow starting point: select the first frame → Prototype panel → Flow starting point. Share that flow's link."],
    },
  ],
}

export function troubleshootingGuide(track: TrackSlug): GuideSection[] {
  const stack = stackOf[track]
  return stack === "design" ? stackProblems.design : [...stackProblems[stack], ...commonProblems]
}

/* ------------------------------------------------------------------ */
/* Resources — short on purpose                                        */
/* ------------------------------------------------------------------ */

const gitLinks = [
  { label: "Pro Git (free book)", url: "https://git-scm.com/book/en/v2", note: "Chapters 1–3 cover everything you need." },
  { label: "Conventional Commits", url: "https://www.conventionalcommits.org", note: "The feat:/fix: commit format we use." },
  { label: "The Missing Semester", url: "https://missing.csail.mit.edu", note: "Terminal and tooling basics from MIT." },
]

const trackLinks: Record<TrackSlug, { label: string; url: string; note: string }[]> = {
  "full-stack": [
    { label: "React — Learn", url: "https://react.dev/learn", note: "The official tutorial. Do “Thinking in React” first." },
    { label: "Express guide", url: "https://expressjs.com/en/guide/routing.html", note: "Routing and middleware." },
    { label: "Prisma docs", url: "https://www.prisma.io/docs", note: "Schema, migrations and queries." },
    { label: "Render docs", url: "https://render.com/docs", note: "Deploying the API and database." },
    { label: "Vercel docs", url: "https://vercel.com/docs", note: "Deploying the React app." },
  ],
  backend: [
    { label: "Express guide", url: "https://expressjs.com/en/guide/routing.html", note: "Routing and middleware." },
    { label: "Prisma docs", url: "https://www.prisma.io/docs", note: "Works with both PostgreSQL and MongoDB." },
    { label: "Zod", url: "https://zod.dev", note: "Request validation." },
    { label: "Redis docs", url: "https://redis.io/docs/latest/", note: "Caching basics." },
    { label: "Docker — Get started", url: "https://docs.docker.com/get-started/", note: "Images and containers in an afternoon." },
    { label: "OpenAPI specification", url: "https://swagger.io/specification/", note: "How to write your API contract." },
  ],
  frontend: [
    { label: "Next.js docs", url: "https://nextjs.org/docs", note: "Start with the App Router getting-started pages." },
    { label: "React — Learn", url: "https://react.dev/learn", note: "Components, state and effects." },
    { label: "Tailwind CSS", url: "https://tailwindcss.com/docs", note: "Look up any class." },
    { label: "shadcn/ui", url: "https://ui.shadcn.com/docs", note: "Every component with copy-paste examples." },
    { label: "TanStack Query", url: "https://tanstack.com/query/latest/docs/framework/react/overview", note: "Data fetching and caching." },
    { label: "web.dev — Accessibility", url: "https://web.dev/learn/accessibility", note: "Make it usable for everyone." },
  ],
  "app-development": [
    { label: "Expo docs", url: "https://docs.expo.dev", note: "Start with the tutorial." },
    { label: "React Native docs", url: "https://reactnative.dev/docs/getting-started", note: "Core components." },
    { label: "Expo Router", url: "https://docs.expo.dev/router/introduction/", note: "Screens and navigation." },
    { label: "Expo Notifications", url: "https://docs.expo.dev/versions/latest/sdk/notifications/", note: "Reminders and alerts." },
    { label: "EAS Build", url: "https://docs.expo.dev/build/introduction/", note: "Building your APK." },
  ],
  "ai-ml": [
    { label: "scikit-learn user guide", url: "https://scikit-learn.org/stable/user_guide.html", note: "Models, pipelines, evaluation." },
    { label: "pandas user guide", url: "https://pandas.pydata.org/docs/user_guide/index.html", note: "Loading and cleaning data." },
    { label: "Kaggle Learn", url: "https://www.kaggle.com/learn", note: "Short, free, hands-on courses." },
    { label: "FastAPI tutorial", url: "https://fastapi.tiangolo.com/tutorial/", note: "Serving your model." },
    { label: "Streamlit docs", url: "https://docs.streamlit.io", note: "Building the demo app." },
    { label: "PyTorch tutorials", url: "https://pytorch.org/tutorials/", note: "If you choose the deep-learning route." },
  ],
  "data-science": [
    { label: "pandas user guide", url: "https://pandas.pydata.org/docs/user_guide/index.html", note: "Your main tool." },
    { label: "SQLBolt", url: "https://sqlbolt.com", note: "Interactive SQL lessons — do all of them." },
    { label: "Kaggle Learn", url: "https://www.kaggle.com/learn", note: "Pandas, visualisation and SQL courses." },
    { label: "Plotly Python", url: "https://plotly.com/python/", note: "Interactive charts." },
    { label: "Streamlit docs", url: "https://docs.streamlit.io", note: "Building the dashboard." },
    { label: "Power BI learning", url: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi", note: "If you use Power BI." },
  ],
  python: [
    { label: "The Python Tutorial", url: "https://docs.python.org/3/tutorial/", note: "The official tutorial." },
    { label: "argparse tutorial", url: "https://docs.python.org/3/howto/argparse.html", note: "Building your CLI." },
    { label: "FastAPI tutorial", url: "https://fastapi.tiangolo.com/tutorial/", note: "Your API in week 3." },
    { label: "pytest docs", url: "https://docs.pytest.org", note: "Writing tests." },
    { label: "Requests", url: "https://requests.readthedocs.io", note: "Calling websites and APIs." },
  ],
  java: [
    { label: "dev.java — Learn", url: "https://dev.java/learn/", note: "Official Java tutorials." },
    { label: "Spring guides", url: "https://spring.io/guides", note: "Start with “Building a RESTful Web Service”." },
    { label: "Spring Data JPA", url: "https://docs.spring.io/spring-data/jpa/reference/", note: "Repositories and queries." },
    { label: "JUnit 5 user guide", url: "https://junit.org/junit5/docs/current/user-guide/", note: "Writing tests." },
    { label: "Baeldung", url: "https://www.baeldung.com", note: "Clear articles for almost every Spring question." },
  ],
  "ui-ux": [
    { label: "Figma help center", url: "https://help.figma.com", note: "Auto Layout, components and prototyping." },
    { label: "Laws of UX", url: "https://lawsofux.com", note: "Principles behind good interfaces." },
    { label: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/", note: "Research methods and usability heuristics." },
    { label: "Material Design 3", url: "https://m3.material.io", note: "Android design guidelines." },
    { label: "Apple Human Interface Guidelines", url: "https://developer.apple.com/design/human-interface-guidelines", note: "iOS design guidelines." },
  ],
}

export function resourcesGuide(track: TrackSlug): GuideSection[] {
  return [
    { title: "Read these, in this order", paragraphs: ["Official docs first. Avoid tutorial-hopping: when you're stuck, search the official docs, then ask your mentor."], links: trackLinks[track] },
    ...(track === "ui-ux" ? [] : [{ title: "Git and the terminal", links: gitLinks }]),
  ]
}

/* ------------------------------------------------------------------ */
/* Review rubric & Definition of Done                                  */
/* ------------------------------------------------------------------ */

export function rubricGuide(track: TrackSlug): GuideSection[] {
  if (stackOf[track] === "design") {
    return [
      {
        title: "Definition of Done — a design task is done when",
        checklist: [
          "Every decision can be traced to research or testing.",
          "Screens use your design system's components and styles — no one-off values.",
          "All states exist: default, empty, loading, error.",
          "Text contrast passes (4.5:1 for body text) and tap targets are at least 44px.",
          "Frames and layers are named, and the prototype flow works from its starting point.",
          "Your case study is updated with what you did and why.",
        ],
      },
      {
        title: "What your mentor checks in every review",
        bullets: ["Problem clarity", "Research quality and synthesis", "Flow logic", "Visual consistency", "Accessibility", "Prototype completeness", "Storytelling in the case study"],
      },
      { title: "How reviews work", paragraphs: ["Share the Figma link with what changed and what feedback you want. Resolve every comment — either change the design or reply with your reasoning."] },
    ]
  }

  const extra: Record<string, string[]> = {
    pyml: [
      "Notebooks run top to bottom (Restart & Run All).",
      "Numbers reconcile with the raw data.",
      "Charts have titles, labelled axes and units.",
      track === "ai-ml" ? "No data leakage; metrics come from a held-out test set." : "Every finding is stated in plain English.",
    ],
    next: ["No console errors or warnings in the browser.", "Loading, empty and error states exist.", "Works on a phone-width screen and with the keyboard."],
    expo: ["Works after closing and reopening the app.", "Empty and error states exist.", "Tested on a real phone."],
    express: ["Inputs are validated; errors use the standard JSON shape.", "Protected routes check who's calling.", "Endpoints match the API contract."],
    python: ["Bad input gives a friendly message, not a stack trace.", "Tests use temporary files."],
    java: ["DTOs, not entities, are returned.", "Errors go through the global handler.", "Money uses BigDecimal (where relevant)."],
  }

  return [
    {
      title: "Definition of Done — a task is done when",
      checklist: [
        "It does what the milestone says, and you've tested it yourself by following your own “How to test” steps.",
        "No errors or warnings in the terminal or browser console.",
        "Code follows the Coding standards and is formatted.",
        "Required tests are written and pass.",
        "The README is updated if setup or usage changed.",
        "No secrets, passwords or .env files are committed.",
        "The pull request is under ~300 changed lines and does one thing.",
        "You can explain every line — including anything AI wrote.",
      ],
    },
    { title: `Extra checks for ${track === "ai-ml" ? "AI & ML" : "your track"}`, checklist: extra[stackOf[track]] },
    {
      title: "How reviews work",
      bullets: [
        "Approved — merge it and move on.",
        "Changes requested — fix every comment on the same branch and push. Reply to each comment so your mentor knows it's handled.",
        "Disagree with a comment? Reply with your reasoning — that's a normal part of code review.",
        "Your mentor reviews against this exact list, so check it yourself before asking for a review.",
      ],
    },
  ]
}

/* ------------------------------------------------------------------ */
/* Final submission checklist                                          */
/* ------------------------------------------------------------------ */

const trackSubmission: Record<TrackSlug, string[]> = {
  "full-stack": ["Live frontend URL (Vercel) and live API URL (Render) both work.", "Architecture diagram in the README."],
  backend: ["Live API URL and Swagger docs at /docs.", "Before/after performance numbers in the README."],
  frontend: ["Live URL on Vercel.", "Lighthouse screenshot (Accessibility 90+) in the README."],
  "app-development": ["APK download link (and QR code) in the README.", "Screen recording of the app on a real phone."],
  "ai-ml": ["Live Streamlit app.", "Metrics table on the held-out test set.", "A short “limitations” section."],
  "data-science": ["Dashboard link or screenshots.", "One-page insights report (PDF or markdown).", "Notebooks run top to bottom."],
  python: ["Usage examples for every command in the README.", "pytest passes."],
  java: ["Live API URL and API documentation.", "./mvnw test passes."],
  "ui-ux": ["Figma file link (view access).", "Working prototype link.", "Public case study link.", "Usability test findings and what you changed."],
}

export function submissionGuide(track: TrackSlug): GuideSection[] {
  const design = stackOf[track] === "design"
  return [
    {
      title: "Before you ask for your final review",
      paragraphs: ["Tick off everything below. A complete submission gets reviewed fastest; a missing item means it comes back to you."],
      checklist: design
        ? [
            "Everything from every milestone is in the Figma file.",
            "Your case study tells the story: problem, research, flows, design, testing, outcome.",
            ...trackSubmission[track],
          ]
        : [
            "All pull requests are merged into main.",
            "README has: what the project does, screenshots or a GIF, the live link, tech stack, setup steps and environment variables.",
            ".env.example is committed and no real secrets are anywhere in the repo history.",
            "A short demo video walking through the main flows (under 5 minutes).",
            "The design doc/architecture from week 1 is in the repo (docs/ folder or README).",
            "All tests pass.",
            "A note on how you used AI tools.",
            ...trackSubmission[track],
          ],
    },
    { title: "Then", paragraphs: ["Send your mentor the repo link (or case study link) and say “ready for final review”. You'll get either a pass — and your certificate — or specific feedback and another attempt."] },
  ]
}

/* ------------------------------------------------------------------ */
/* Stretch goals — added to every project's PRD                        */
/* ------------------------------------------------------------------ */

export const trackStretchGoals: Record<TrackSlug, string[]> = {
  "full-stack": ["CI with GitHub Actions: run tests on every pull request.", "Dark mode.", "Rate limiting on login."],
  backend: ["CI with GitHub Actions.", "Structured request logging with request IDs.", "API versioning (/api/v1)."],
  frontend: ["Playwright end-to-end test for the main flow.", "Dark mode.", "Animations with reduced-motion support."],
  "app-development": ["Dark mode that follows the phone setting.", "Haptic feedback on key actions.", "Home-screen widget research write-up."],
  "ai-ml": ["Compare against an LLM baseline and report the cost per prediction.", "Model card describing intended use and risks.", "CI that re-runs evaluation."],
  "data-science": ["Automated data refresh script.", "Simple forecast with a clearly stated error range.", "Share the dashboard publicly."],
  python: ["Package it on TestPyPI.", "Coloured output with rich.", "Run it on a schedule with GitHub Actions."],
  java: ["Pagination and sorting on every list endpoint.", "OpenAPI docs with springdoc.", "CI with GitHub Actions running ./mvnw test."],
  "ui-ux": ["Dark mode variant of key screens.", "Accessibility audit with fixes.", "Micro-interaction prototypes (Smart Animate)."],
}
