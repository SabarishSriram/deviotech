import type { GuideSection } from "@/data/docs/types"
import type { TrackSlug } from "@/data/tracks"

/*
 * Track handbook, part 1: coding standards, environment & secrets, testing
 * and deployment. Tracks that share a stack share content via `stackOf`.
 */

export type Stack = "express" | "next" | "expo" | "pyml" | "python" | "java" | "design"

export const stackOf: Record<TrackSlug, Stack> = {
  "full-stack": "express",
  backend: "express",
  frontend: "next",
  "app-development": "expo",
  "ai-ml": "pyml",
  "data-science": "pyml",
  python: "python",
  java: "java",
  "ui-ux": "design",
}

const commits: GuideSection = {
  title: "Commits and branches",
  paragraphs: ["Every commit message starts with a type, so anyone can scan the history and see what changed."],
  bullets: [
    "feat: a new feature — “feat: add booking endpoint”",
    "fix: a bug fix — “fix: stop double booking the last seat”",
    "docs: README or comments only — “docs: add setup steps”",
    "refactor: code change with no behaviour change — “refactor: move pricing into a service”",
    "test: adding or fixing tests — “test: cover expired links”",
    "Branches use the same words: feat/checkout, fix/login-error, docs/readme.",
  ],
}

const prettier: GuideSection = {
  title: "Formatting (Prettier)",
  paragraphs: ["A formatter fixes spacing and quotes for you, so reviews focus on logic, not style. Install it once per project:"],
  steps: [
    { text: "Install Prettier as a development tool:", code: "npm install -D prettier" },
    { text: "Create this file in the project root:", file: ".prettierrc", code: '{\n  "semi": false,\n  "singleQuote": false,\n  "printWidth": 100\n}' },
    { text: "Format everything before you commit:", code: "npx prettier --write ." },
    { text: "In VS Code, turn on Settings → “Format On Save” and pick Prettier as the default formatter, so this happens automatically." },
  ],
}

const ruff: GuideSection = {
  title: "Formatting and linting (Ruff)",
  paragraphs: ["Ruff formats your code and catches common mistakes in one fast tool."],
  steps: [
    { text: "Install it inside your virtual environment:", code: "pip install ruff" },
    { text: "Format all files:", code: "ruff format ." },
    { text: "Find problems (unused imports, undefined names…):", code: "ruff check ." },
    { text: "In VS Code, install the “Ruff” extension and enable Format On Save." },
  ],
}

/* ------------------------------------------------------------------ */
/* Coding standards                                                    */
/* ------------------------------------------------------------------ */

export function standardsGuide(track: TrackSlug): GuideSection[] {
  switch (stackOf[track]) {
    case "express":
      return [
        {
          title: "Folder structure",
          paragraphs: ["Keep the same layout as everyone else so your mentor can find things instantly. Routes only handle HTTP; services hold the rules; lib holds shared helpers."],
          code: {
            code:
              track === "full-stack"
                ? "my-app/\n├── client/                 React app (Vite)\n│   └── src/\n│       ├── components/     Reusable UI pieces\n│       ├── pages/          One file per page\n│       ├── lib/api.ts      All fetch calls to the API live here\n│       └── main.tsx\n└── server/                 Express API\n    ├── prisma/schema.prisma\n    └── src/\n        ├── routes/         One file per resource (applications.ts)\n        ├── services/       Business rules\n        ├── middleware/     auth.ts, errors.ts\n        └── index.ts        Starts the server"
                : "my-api/\n├── prisma/schema.prisma\n├── src/\n│   ├── routes/          One file per resource (links.ts)\n│   ├── services/        Business rules, no Express code\n│   ├── middleware/      auth.ts, rate-limit.ts, errors.ts\n│   ├── lib/             db.ts (Prisma client), redis.ts\n│   └── index.ts         Starts the server\n└── tests/               One test file per route file",
          },
        },
        {
          title: "Naming",
          bullets: [
            "Variables and functions: camelCase — createBooking, totalInPaise.",
            "Types, interfaces and React components: PascalCase — Booking, ApplicationCard.",
            "Files: kebab-case on the server (rate-limit.ts), PascalCase for React components (ApplicationCard.tsx).",
            "Booleans read like questions: isPaid, hasSeatsLeft.",
            "No abbreviations nobody else will understand: application, not appl.",
          ],
        },
        prettier,
        {
          title: "Handling errors",
          paragraphs: ["Validate every request with zod, and send every error through one middleware so the API always answers in the same shape."],
          steps: [
            {
              text: "Validate input at the top of a route. If it's invalid, zod throws and the error middleware answers 400:",
              file: "server/src/routes/applications.ts",
              code: 'import { z } from "zod"\n\nconst createSchema = z.object({\n  company: z.string().min(1),\n  role: z.string().min(1),\n})\n\nrouter.post("/", async (req, res) => {\n  const data = createSchema.parse(req.body)\n  const application = await createApplication(req.user.id, data)\n  res.status(201).json(application)\n})',
            },
            {
              text: "One error handler, registered last in index.ts, turns any thrown error into a clean JSON response:",
              file: "server/src/middleware/errors.ts",
              code: 'import type { ErrorRequestHandler } from "express"\nimport { ZodError } from "zod"\n\nexport const errorHandler: ErrorRequestHandler = (err, req, res, next) => {\n  if (err instanceof ZodError) {\n    return res.status(400).json({ error: "Invalid input", details: err.issues })\n  }\n  console.error(err)\n  res.status(500).json({ error: "Something went wrong" })\n}',
            },
          ],
        },
        commits,
      ]

    case "next":
      return [
        {
          title: "Folder structure",
          code: {
            code: "my-app/\n├── app/                   Routes (each folder = a URL)\n│   ├── layout.tsx         Shared layout\n│   ├── page.tsx           Home page\n│   └── movie/[id]/page.tsx\n├── components/\n│   ├── ui/                shadcn/ui components (generated)\n│   └── movie-card.tsx     Your components\n├── lib/                   Helpers: api.ts, format.ts, store.ts\n└── public/                Images and icons",
          },
        },
        {
          title: "Naming and components",
          bullets: [
            "Components: PascalCase names (MovieCard), kebab-case files (movie-card.tsx).",
            "One component per file. If a file passes ~200 lines, split it.",
            "Add \"use client\" only to components that need state, effects or event handlers. Everything else stays a server component.",
            "Keep fetch calls in lib/api.ts, never scattered across components.",
          ],
        },
        {
          title: "Style guide — so you don't stall on design",
          bullets: [
            "Use shadcn/ui components and Tailwind's default spacing scale (p-4, gap-6…). Don't invent pixel values.",
            "One accent colour, neutrals for everything else.",
            "Text sizes: text-sm for UI, text-base for reading, one larger size for page titles.",
            "Every screen needs a loading state, an empty state and an error state.",
            "Check contrast and that everything works with the keyboard (Tab, Enter, Esc).",
          ],
        },
        { ...prettier, steps: [...prettier.steps!, { text: "Sort Tailwind classes automatically:", code: "npm install -D prettier-plugin-tailwindcss" }] },
        {
          title: "Handling errors",
          paragraphs: ["Add an error.tsx next to a page to catch its errors, and always show React Query's error state instead of a blank screen."],
          steps: [
            {
              text: "A route-level error screen:",
              file: "app/error.tsx",
              code: '"use client"\n\nexport default function Error({ reset }: { reset: () => void }) {\n  return (\n    <div className="p-8 text-center">\n      <p>Something went wrong loading this page.</p>\n      <button onClick={reset} className="mt-4 underline">Try again</button>\n    </div>\n  )\n}',
            },
          ],
        },
        commits,
      ]

    case "expo":
      return [
        {
          title: "Folder structure",
          code: {
            code: "my-app/\n├── app/                  Screens (each file = a screen, Expo Router)\n│   ├── (tabs)/           Tab screens: index.tsx, habits.tsx, settings.tsx\n│   └── _layout.tsx       Navigation layout\n├── components/           Reusable pieces: HabitRow.tsx\n├── lib/\n│   ├── storage.ts        All AsyncStorage reads/writes\n│   └── streaks.ts        Pure logic (easy to test)\n└── constants/            Colours, spacing",
          },
        },
        {
          title: "Naming and components",
          bullets: [
            "Components and screens: PascalCase (HabitRow.tsx).",
            "Keep logic (streaks, totals) in lib/ as plain functions — not inside screens.",
            "All storage access goes through lib/storage.ts so the format lives in one place.",
          ],
        },
        {
          title: "Style guide — so you don't stall on design",
          bullets: [
            "Use an 8-point spacing scale: 8, 16, 24, 32.",
            "Tap targets at least 44×44 points.",
            "One accent colour; define it once in constants/colors.ts.",
            "Every list needs an empty state (“No habits yet — add your first one”).",
          ],
        },
        prettier,
        {
          title: "Handling errors",
          steps: [
            {
              text: "Wrap storage and network calls in try/catch and tell the user what happened:",
              file: "lib/storage.ts",
              code: 'import AsyncStorage from "@react-native-async-storage/async-storage"\n\nexport async function loadHabits() {\n  try {\n    const json = await AsyncStorage.getItem("habits")\n    return json ? JSON.parse(json) : []\n  } catch (error) {\n    console.warn("Could not load habits", error)\n    return []\n  }\n}',
            },
          ],
        },
        commits,
      ]

    case "pyml":
      return [
        {
          title: "Folder structure",
          code: {
            code: "my-project/\n├── data/\n│   ├── raw/              Original files — never edit these\n│   └── processed/        Cleaned output from your notebooks\n├── notebooks/\n│   ├── 01-cleaning.ipynb  Numbered so the order is obvious\n│   └── 02-analysis.ipynb\n├── app/                  FastAPI / Streamlit code\n├── models/               Saved models (small ones only)\n├── requirements.txt\n└── README.md",
          },
        },
        {
          title: "Notebook rules",
          bullets: [
            "Before every commit: Kernel → Restart & Run All. If it doesn't run top to bottom, it's not done.",
            "Start each notebook with a markdown cell: what question it answers.",
            "End each section with a markdown cell: what you found, in one or two sentences.",
            "Move code you reuse into a .py file in app/ and import it.",
            "Names: snake_case for variables and functions (clean_team_names).",
          ],
        },
        ruff,
        commits,
      ]

    case "python":
      return [
        {
          title: "Folder structure",
          code: {
            code: "my-tool/\n├── app/\n│   ├── __init__.py\n│   ├── models.py         Your classes (Expense, Category)\n│   ├── core.py           Business logic\n│   ├── db.py             SQLite access\n│   ├── main.py           The CLI (argparse)\n│   └── api.py            FastAPI app\n├── tests/\n│   └── test_core.py\n└── requirements.txt",
          },
        },
        {
          title: "Naming and style",
          bullets: [
            "snake_case for variables, functions and files; PascalCase for classes.",
            "Add type hints: def add_expense(amount: float, category: str) -> Expense:",
            "Keep functions short and doing one thing.",
            "Use logging, not print, for anything that isn't output for the user.",
          ],
        },
        ruff,
        {
          title: "Handling errors",
          steps: [
            {
              text: "Raise your own exception for rule violations, and catch it in the CLI to show a friendly message:",
              file: "app/core.py",
              code: 'class InvalidExpense(Exception):\n    pass\n\ndef add_expense(amount: float, category: str):\n    if amount <= 0:\n        raise InvalidExpense("Amount must be positive")\n    ...',
            },
          ],
        },
        commits,
      ]

    case "java":
      return [
        {
          title: "Folder structure",
          code: {
            code: "src/main/java/com/devio/app/\n├── controller/      REST endpoints (BookController)\n├── service/         Business rules (LoanService)\n├── repository/      Spring Data JPA interfaces\n├── model/           @Entity classes\n├── dto/             Request/response objects\n└── exception/       Custom exceptions + global handler\nsrc/test/java/...    Tests mirror the same packages",
          },
        },
        {
          title: "Naming and style",
          bullets: [
            "Classes PascalCase (LoanService), methods and variables camelCase (calculateFine).",
            "Constants UPPER_SNAKE_CASE (MAX_LOANS).",
            "Never return @Entity objects from controllers — map them to DTOs.",
            "Format with IntelliJ: Code → Reformat Code (Ctrl+Alt+L / Cmd+Option+L) before committing.",
          ],
        },
        {
          title: "Handling errors",
          steps: [
            {
              text: "One class turns exceptions into consistent JSON responses for every controller:",
              file: "exception/GlobalExceptionHandler.java",
              code: '@RestControllerAdvice\npublic class GlobalExceptionHandler {\n\n    @ExceptionHandler(NotFoundException.class)\n    @ResponseStatus(HttpStatus.NOT_FOUND)\n    public Map<String, String> notFound(NotFoundException e) {\n        return Map.of("error", e.getMessage());\n    }\n}',
            },
          ],
        },
        commits,
      ]

    case "design":
      return [
        {
          title: "Figma file structure",
          bullets: [
            "Pages: Cover, Research, Flows, Wireframes, Design system, UI, Prototype.",
            "Frames named “01 Login / Default”, “01 Login / Error” — number, screen, state.",
            "Every repeated element is a component with variants (Button / Primary / Hover).",
            "Use Auto Layout for anything that should resize.",
            "Colours and text sizes are saved as styles/variables — no one-off hex values.",
          ],
        },
        {
          title: "Writing in your designs",
          bullets: [
            "Use realistic content, not lorem ipsum.",
            "Buttons say what they do: “Book slot”, not “Submit”.",
            "Error messages say what happened and how to fix it.",
          ],
        },
      ]
  }
}

/* ------------------------------------------------------------------ */
/* Environment & secrets                                               */
/* ------------------------------------------------------------------ */

const neverCommit: GuideSection = {
  title: "The one rule: never commit secrets",
  paragraphs: [
    "Passwords, API keys and database URLs go in a .env file that Git ignores. You commit a .env.example with the same names and empty values, so others know what to fill in.",
    "If you ever commit a real key by accident, deleting the file isn't enough — it's still in Git history. Revoke the key at the provider, create a new one, and tell your mentor.",
  ],
}

export function environmentGuide(track: TrackSlug): GuideSection[] {
  switch (stackOf[track]) {
    case "express":
      return [
        neverCommit,
        {
          title: "Your .env.example",
          steps: [
            {
              text: "Commit this file (with empty values) so anyone can set the project up:",
              file: track === "full-stack" ? "server/.env.example" : ".env.example",
              code:
                track === "full-stack"
                  ? "# PostgreSQL connection — postgresql://USER:PASSWORD@HOST:PORT/DATABASE\nDATABASE_URL=\n# Long random string used to sign login tokens\nJWT_SECRET=\n# Port the API listens on\nPORT=4000\n# Where the React app runs (allowed by CORS)\nCLIENT_URL=http://localhost:5173"
                  : "# PostgreSQL or MongoDB connection string\nDATABASE_URL=\n# Redis running in Docker locally\nREDIS_URL=redis://localhost:6379\n# Long random string used to sign tokens\nJWT_SECRET=\nPORT=4000\nRATE_LIMIT_PER_MINUTE=100",
            },
            { text: "Copy it to a real .env and fill in your values:", code: track === "full-stack" ? "cp server/.env.example server/.env" : "cp .env.example .env" },
            { text: "Generate a strong JWT_SECRET:", code: "node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"" },
            { text: "Load it at the very top of src/index.ts:", file: "src/index.ts", code: 'import "dotenv/config"' },
            ...(track === "full-stack"
              ? [{ text: "The React app has its own file. Vite only exposes variables starting with VITE_ to the browser:", file: "client/.env", code: "VITE_API_URL=http://localhost:4000" }]
              : []),
          ],
        },
        { title: "Check .gitignore", steps: [{ text: "Make sure it contains these lines:", file: ".gitignore", code: "node_modules\n.env\ndist" }] },
      ]

    case "next":
      return [
        neverCommit,
        {
          title: "Your .env.local",
          paragraphs: ["Next.js reads .env.local automatically. Variables are server-only unless their name starts with NEXT_PUBLIC_ — then they're visible in the browser to anyone."],
          steps: [
            { text: "Create the example file and commit it:", file: ".env.example", code: "# Server-only: never sent to the browser\nTMDB_API_KEY=\n# Base URL of your API or mock API\nAPI_URL=http://localhost:4000" },
            { text: "Copy it and fill in real values (create-next-app already ignores .env*.local):", code: "cp .env.example .env.local" },
            { text: "Movie project: get a free key at themoviedb.org → Settings → API, and keep it server-only by fetching in server components." },
            { text: "Restart npm run dev after changing env files — they're only read at start-up." },
          ],
        },
      ]

    case "expo":
      return [
        neverCommit,
        {
          title: "Configuring the app",
          paragraphs: ["In Expo, variables starting with EXPO_PUBLIC_ are built into the app. Treat them as public — anyone can read them from the APK. Never put real secrets in a mobile app."],
          steps: [
            { text: "Create .env.example (commit it) and .env (don't):", file: ".env.example", code: "# Your computer's address on Wi-Fi, not localhost\nEXPO_PUBLIC_API_URL=http://192.168.1.10:4000" },
            { text: "Why not localhost? On your phone, “localhost” means the phone itself. Find your computer's Wi-Fi IP — Mac: System Settings → Wi-Fi → Details; Windows: run ipconfig and look for IPv4 Address." },
            { text: "Use it in code:", file: "lib/api.ts", code: "const API_URL = process.env.EXPO_PUBLIC_API_URL" },
          ],
        },
      ]

    case "pyml":
      return [
        neverCommit,
        {
          title: "Using a .env file in Python",
          steps: [
            { text: "Install python-dotenv:", code: "pip install python-dotenv" },
            { text: "Commit an example file:", file: ".env.example", code: "# Only needed for projects that call an LLM (e.g. the document Q&A bot)\nLLM_API_KEY=" },
            { text: "Load it in your code:", file: "app/config.py", code: 'import os\nfrom dotenv import load_dotenv\n\nload_dotenv()\nLLM_API_KEY = os.getenv("LLM_API_KEY")' },
            { text: "Deploying on Streamlit Community Cloud? Put keys in the app's Settings → Secrets instead, and read them with st.secrets." },
            { text: "Large datasets don't belong in Git either: add data/raw/ to .gitignore if files are bigger than ~50 MB, and link the source in your README." },
          ],
        },
      ]

    case "python":
      return [
        neverCommit,
        {
          title: "Using a .env file",
          steps: [
            { text: "Install python-dotenv:", code: "pip install python-dotenv" },
            { text: "Commit an example file:", file: ".env.example", code: "DATABASE_PATH=data.db\n# Web scraper alerts (optional)\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=" },
            { text: "Telegram alerts: message @BotFather on Telegram, send /newbot, and it gives you the token. Send your bot any message, then open https://api.telegram.org/bot<TOKEN>/getUpdates to find your chat id." },
            { text: "Load the values:", file: "app/config.py", code: 'import os\nfrom dotenv import load_dotenv\n\nload_dotenv()\nDATABASE_PATH = os.getenv("DATABASE_PATH", "data.db")' },
          ],
        },
      ]

    case "java":
      return [
        neverCommit,
        {
          title: "Keep passwords out of application.properties",
          steps: [
            { text: "Reference environment variables instead of typing values:", file: "src/main/resources/application.properties", code: "spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/java_app}\nspring.datasource.username=${DB_USER:postgres}\nspring.datasource.password=${DB_PASSWORD}" },
            { text: "The part after : is a default. DB_PASSWORD has none, so the app won't start until you set it." },
            { text: "In IntelliJ: Run → Edit Configurations → Environment variables → add DB_PASSWORD=yourpassword." },
            { text: "Or in the terminal before running (Mac/Linux):", code: "export DB_PASSWORD=yourpassword\n./mvnw spring-boot:run" },
          ],
        },
      ]

    case "design":
      return [
        {
          title: "Research data is sensitive",
          bullets: [
            "Ask interviewees for consent before recording, and tell them how you'll use their answers.",
            "Use first names or “P1, P2” in your case study — never full names, phone numbers or photos without permission.",
            "Keep raw recordings private; publish only your synthesis.",
          ],
        },
        {
          title: "Sharing your files",
          bullets: [
            "Share the Figma file with your mentor as “can comment”.",
            "For your portfolio, share the prototype with “anyone with the link can view”.",
            "Keep one source of truth — don't duplicate files for each version; use Figma's version history.",
          ],
        },
      ]
  }
}

/* ------------------------------------------------------------------ */
/* Testing                                                             */
/* ------------------------------------------------------------------ */

export function testingGuide(track: TrackSlug): GuideSection[] {
  switch (stackOf[track]) {
    case "express":
      return [
        {
          title: "The minimum bar",
          checklist: [
            "Every API endpoint has at least one test for the happy path.",
            "Every endpoint that creates or changes data also has a test for invalid input (400) and, if protected, for no login (401).",
            "Business rules (seat limits, stock, totals) have their own tests.",
            "npm test passes before you open a pull request.",
          ],
        },
        {
          title: "Set up Vitest and Supertest",
          steps: [
            { text: "Install the test tools in your API project:", code: "npm install -D vitest supertest @types/supertest" },
            { text: "Add a test script:", code: 'npm pkg set scripts.test="vitest run"' },
            { text: "Export your Express app from a separate file (app.ts) so tests can use it without starting a real server. index.ts then just calls app.listen()." },
            {
              text: "Write your first test:",
              file: "tests/health.test.ts",
              code: 'import request from "supertest"\nimport { describe, expect, it } from "vitest"\nimport { app } from "../src/app"\n\ndescribe("GET /health", () => {\n  it("returns ok", async () => {\n    const res = await request(app).get("/health")\n    expect(res.status).toBe(200)\n    expect(res.body).toEqual({ ok: true })\n  })\n})',
            },
            { text: "Run it:", code: "npm test" },
          ],
        },
        { title: "Use a separate test database", paragraphs: ["Tests create and delete data. Point them at a second database (e.g. myapp_test) in a .env.test file so they never touch your development data."] },
      ]

    case "next":
      return [
        {
          title: "The minimum bar",
          checklist: [
            "Helper functions with logic (filtering, totals, formatting) have unit tests.",
            "At least two components with interaction are tested (e.g. search filters, add to watchlist).",
            "Lighthouse accessibility score of 90+ on your main pages.",
            "npm test passes before every pull request.",
          ],
        },
        {
          title: "Set up Vitest and Testing Library",
          steps: [
            { text: "Install:", code: "npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom" },
            { text: "Create a config:", file: "vitest.config.mts", code: 'import react from "@vitejs/plugin-react"\nimport { defineConfig } from "vitest/config"\n\nexport default defineConfig({\n  plugins: [react()],\n  test: { environment: "jsdom" },\n})' },
            { text: "Add the script:", code: 'npm pkg set scripts.test="vitest run"' },
            { text: "Test a helper:", file: "lib/format.test.ts", code: 'import { expect, it } from "vitest"\nimport { formatRupees } from "./format"\n\nit("formats rupees", () => {\n  expect(formatRupees(1499)).toBe("₹1,499")\n})' },
          ],
        },
        { title: "Run Lighthouse", steps: [{ text: "In Chrome, open your page → DevTools (F12) → Lighthouse tab → Analyze page load. Fix anything under 90 and screenshot the result for your README." }] },
      ]

    case "expo":
      return [
        {
          title: "The minimum bar",
          checklist: [
            "Pure logic in lib/ (streaks, totals, budget checks) has unit tests.",
            "You've run the manual test checklist below on a real phone.",
          ],
        },
        {
          title: "Unit tests with Jest",
          steps: [
            { text: "Install the Expo Jest preset:", code: "npx expo install jest-expo jest @types/jest -- --save-dev" },
            { text: "Add to package.json: \"jest\": { \"preset\": \"jest-expo\" } and a script:", code: 'npm pkg set scripts.test="jest"' },
            { text: "Test a pure function:", file: "lib/streaks.test.ts", code: 'import { currentStreak } from "./streaks"\n\ntest("counts consecutive days", () => {\n  expect(currentStreak(["2026-03-12", "2026-03-13", "2026-03-14"], "2026-03-14")).toBe(3)\n})' },
          ],
        },
        {
          title: "Manual test checklist (on your phone)",
          checklist: [
            "Close the app completely and reopen it — is everything still there?",
            "Turn on airplane mode — does the app still work (or explain why not)?",
            "Try empty input, very long text and huge numbers in every form.",
            "Rotate the phone and try the smallest font size setting.",
          ],
        },
      ]

    case "pyml":
      return [
        {
          title: "The minimum bar",
          checklist: [
            "Notebooks run top to bottom with Restart & Run All.",
            "Cleaning functions have pytest tests (e.g. no missing values in key columns afterwards).",
            "Results are checked against the raw data (row counts and totals reconcile).",
            track === "ai-ml"
              ? "Models are evaluated on a held-out test set that was never used for training or tuning."
              : "Each finding is backed by a query or calculation someone else can re-run.",
          ],
        },
        {
          title: "Test your cleaning code with pytest",
          steps: [
            { text: "Install:", code: "pip install pytest" },
            {
              text: "Move a cleaning step into a function and test it:",
              file: "tests/test_cleaning.py",
              code: 'import pandas as pd\nfrom app.cleaning import clean_team_names\n\ndef test_renamed_teams_are_merged():\n    df = pd.DataFrame({"team": ["Delhi Daredevils", "Delhi Capitals"]})\n    assert clean_team_names(df)["team"].nunique() == 1',
            },
            { text: "Run:", code: "pytest" },
          ],
        },
        {
          title: "Sanity checks inside notebooks",
          paragraphs: ["Add assert lines after each cleaning step. If something goes wrong, the notebook stops instead of producing wrong charts."],
          code: { code: 'assert df["match_id"].notna().all(), "match_id has gaps"\nassert len(df) == expected_rows, "rows were lost while cleaning"' },
        },
      ]

    case "python":
      return [
        {
          title: "The minimum bar",
          checklist: [
            "Every function in core.py has at least one test.",
            "Every CLI command has a test for success and one for bad input.",
            "Tests use temporary files/folders — never your real data.",
            "pytest passes before every pull request.",
          ],
        },
        {
          title: "Writing tests with pytest",
          steps: [
            { text: "Install:", code: "pip install pytest" },
            {
              text: "tmp_path gives each test a fresh temporary folder:",
              file: "tests/test_core.py",
              code: 'import pytest\nfrom app.core import InvalidExpense, add_expense\n\ndef test_rejects_negative_amount():\n    with pytest.raises(InvalidExpense):\n        add_expense(-50, "food")\n\ndef test_database_is_isolated(tmp_path):\n    db_file = tmp_path / "test.db"\n    ...',
            },
            { text: "Testing the FastAPI app:", file: "tests/test_api.py", code: 'from fastapi.testclient import TestClient\nfrom app.api import app\n\nclient = TestClient(app)\n\ndef test_list_expenses():\n    assert client.get("/expenses").status_code == 200' },
            { text: "Run:", code: "pytest" },
          ],
        },
      ]

    case "java":
      return [
        {
          title: "The minimum bar",
          checklist: [
            "Every business rule in a service has a unit test (limits, fines, balances).",
            "Every controller endpoint has at least one test.",
            "Failure paths are tested, not just success.",
            "./mvnw test passes before every pull request.",
          ],
        },
        {
          title: "Writing tests",
          paragraphs: ["Spring Boot already includes JUnit 5 and Mockito — nothing to install."],
          steps: [
            {
              text: "A plain unit test for a rule:",
              file: "src/test/java/com/devio/app/service/FineCalculatorTest.java",
              code: "class FineCalculatorTest {\n\n    @Test\n    void chargesTenRupeesPerLateDay() {\n        assertEquals(30, FineCalculator.fineFor(3));\n    }\n\n    @Test\n    void noFineWhenOnTime() {\n        assertEquals(0, FineCalculator.fineFor(0));\n    }\n}",
            },
            { text: "Run all tests:", code: "./mvnw test" },
          ],
        },
      ]

    case "design":
      return [
        {
          title: "Usability testing — the minimum bar",
          checklist: [
            "3–5 participants who match your persona.",
            "A written script with 3–4 realistic tasks (“Book a study room for tomorrow 4pm”).",
            "You note for each task: completed or not, time taken, where they hesitated.",
            "You change the design based on what you saw, and test once more.",
          ],
        },
        {
          title: "Running a session",
          steps: [
            { text: "Ask for consent and explain you're testing the design, not them." },
            { text: "Share the prototype link and ask them to think aloud." },
            { text: "Don't help. If they ask “what do I do?”, reply “what would you expect?”." },
            { text: "Afterwards, ask: what was hardest, what would you change?" },
            { text: "Summarise the top 3 issues with evidence (quotes, completion rates)." },
          ],
        },
      ]
  }
}

/* ------------------------------------------------------------------ */
/* Deployment                                                          */
/* ------------------------------------------------------------------ */

export function deploymentGuide(track: TrackSlug): GuideSection[] {
  switch (track) {
    case "full-stack":
      return [
        { title: "The plan", paragraphs: ["The API and database go on Render, the React app on Vercel. Both have free tiers and deploy automatically when you push to main."] },
        {
          title: "1. Prepare the API for production",
          steps: [
            { text: "Add build and start scripts:", code: 'npm pkg set scripts.build="tsc" scripts.start="node dist/index.js"' },
            { text: "Make the API listen on the port Render gives it:", file: "server/src/index.ts", code: "const port = Number(process.env.PORT) || 4000\napp.listen(port, () => console.log(\"API on port \" + port))" },
            { text: "Allow your live frontend through CORS:", file: "server/src/app.ts", code: 'app.use(cors({ origin: process.env.CLIENT_URL }))' },
          ],
        },
        {
          title: "2. Database and API on Render",
          steps: [
            { text: "Sign up at render.com with GitHub. New → PostgreSQL → Free. Copy the “Internal Database URL” when it's ready." },
            { text: "New → Web Service → pick your repo. Root directory: server." },
            { text: "Build command:", code: "npm install && npx prisma migrate deploy && npm run build" },
            { text: "Start command:", code: "npm start" },
            { text: "Environment: add DATABASE_URL (the internal URL), JWT_SECRET (a new random one) and CLIENT_URL (fill in after step 3)." },
            { text: "Deploy, then check it's alive — you should see {\"ok\":true}:", code: "curl https://YOUR-API.onrender.com/health" },
          ],
        },
        {
          title: "3. Frontend on Vercel",
          steps: [
            { text: "Sign up at vercel.com with GitHub. Add New → Project → import your repo." },
            { text: "Root directory: client. Framework: Vite (detected automatically)." },
            { text: "Environment variable: VITE_API_URL = https://YOUR-API.onrender.com" },
            { text: "Deploy. Copy the Vercel URL into CLIENT_URL on Render and redeploy the API." },
          ],
        },
        {
          title: "Free-tier things to know",
          bullets: [
            "Render's free web services sleep after ~15 minutes idle — the first request afterwards takes up to a minute. Mention it in your README.",
            "Render's free Postgres databases expire after a limited time (30 days at the time of writing). Check Render's pricing page and keep your seed script so you can recreate it.",
          ],
        },
      ]

    case "backend":
      return [
        { title: "The plan", paragraphs: ["Package the API with Docker, then deploy that container to Render. Use a hosted Redis and database."] },
        {
          title: "1. Write a Dockerfile",
          steps: [
            { text: "Create this in the project root:", file: "Dockerfile", code: "FROM node:22-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npx prisma generate && npm run build\nEXPOSE 4000\nCMD [\"npm\", \"start\"]" },
            { text: "Keep junk out of the image:", file: ".dockerignore", code: "node_modules\n.env\ndist" },
            { text: "Build and run it locally first:", code: "docker build -t my-api .\ndocker run -p 4000:4000 --env-file .env my-api" },
          ],
        },
        {
          title: "2. Hosted database and Redis",
          bullets: [
            "PostgreSQL: Render → New → PostgreSQL (free). MongoDB: your Atlas cluster from setup.",
            "Redis: Render Key Value or Upstash both have free tiers — copy the connection URL into REDIS_URL.",
          ],
        },
        {
          title: "3. Deploy on Render",
          steps: [
            { text: "New → Web Service → your repo. Render detects the Dockerfile." },
            { text: "Add DATABASE_URL, REDIS_URL, JWT_SECRET and RATE_LIMIT_PER_MINUTE." },
            { text: "Run migrations: Render Shell (or a pre-deploy command):", code: "npx prisma migrate deploy" },
            { text: "Check it works and that Swagger loads at /docs:", code: "curl https://YOUR-API.onrender.com/health" },
          ],
        },
      ]

    case "frontend":
      return [
        {
          title: "Deploy on Vercel",
          steps: [
            { text: "Push your code to GitHub." },
            { text: "vercel.com → Add New → Project → import the repo. Next.js is detected automatically." },
            { text: "Add your environment variables (e.g. TMDB_API_KEY) under Settings → Environment Variables." },
            { text: "Deploy. Every pull request now gets its own preview URL — paste it in the PR so your mentor can click through." },
          ],
        },
        { title: "Check the live site", checklist: ["Every page loads with no console errors (F12 → Console).", "Lighthouse on the live URL: 90+ for Accessibility.", "API keys don't appear in the browser's Network tab."] },
      ]

    case "app-development":
      return [
        {
          title: "Build an installable APK with EAS",
          steps: [
            { text: "Log in and configure builds (choose Android when asked):", code: "eas login\neas build:configure" },
            { text: "Edit eas.json so the preview profile builds an APK you can install directly:", file: "eas.json", code: '{\n  "build": {\n    "preview": {\n      "android": { "buildType": "apk" }\n    }\n  }\n}' },
            { text: "Start the build. It runs in Expo's cloud and takes 10–20 minutes:", code: "eas build -p android --profile preview" },
            { text: "When it finishes you get a link. Open it on an Android phone, download the APK and allow “install unknown apps” when asked." },
            { text: "Put the link and a QR code in your README." },
          ],
        },
      ]

    case "ai-ml":
    case "data-science":
      return [
        {
          title: "Deploy your Streamlit app (free)",
          steps: [
            { text: "Make sure requirements.txt lists every library your app imports:", code: "pip freeze > requirements.txt" },
            { text: "Push to GitHub. Go to share.streamlit.io and sign in with GitHub." },
            { text: "Create app → pick the repo, branch main, and your app file (e.g. app/streamlit_app.py)." },
            { text: "API keys go in the app's Settings → Secrets, read in code with st.secrets[\"LLM_API_KEY\"]." },
            { text: "Deploy, open the URL, and try it as a stranger would." },
          ],
        },
        ...(track === "ai-ml"
          ? [
              {
                title: "Shipping the model",
                bullets: [
                  "Save the trained pipeline with joblib.dump(model, \"models/model.joblib\") and load it in your app.",
                  "GitHub rejects files over 100 MB — keep models small, or document how to retrain.",
                  "FastAPI on Render (optional): start command uvicorn app.api:app --host 0.0.0.0 --port $PORT.",
                ],
              } satisfies GuideSection,
            ]
          : [
              {
                title: "Using Power BI instead",
                bullets: [
                  "Publishing to the web needs a work or school Microsoft account. If you don't have one, commit the .pbix file and add screenshots or a short recording to your README.",
                  "Export your one-page report as PDF into the repo.",
                ],
              } satisfies GuideSection,
            ]),
      ]

    case "python":
      return [
        {
          title: "Make it installable",
          steps: [
            { text: "Add a pyproject.toml so anyone can install your tool with one command:", file: "pyproject.toml", code: '[project]\nname = "my-tool"\nversion = "1.0.0"\ndependencies = ["requests", "fastapi[standard]"]\n\n[project.scripts]\nmy-tool = "app.main:main"' },
            { text: "Install it locally and run it by name:", code: "pip install -e .\nmy-tool --help" },
          ],
        },
        {
          title: "Run it on a schedule",
          steps: [
            { text: "Mac/Linux — open your crontab and add a line to run every morning at 9:", code: "crontab -e\n0 9 * * * cd /path/to/my-tool && .venv/bin/python -m app.main check" },
            { text: "Windows — open Task Scheduler → Create Basic Task → Daily → Start a program → your .venv\\Scripts\\python.exe with arguments -m app.main check." },
            { text: "Free alternative: a scheduled GitHub Actions workflow runs it in the cloud — ask your mentor if you want to try this as a stretch goal." },
          ],
        },
        { title: "Deploy the API (optional)", paragraphs: ["Render → New → Web Service → your repo. Build: pip install -r requirements.txt. Start: uvicorn app.api:app --host 0.0.0.0 --port $PORT."] },
      ]

    case "java":
      return [
        {
          title: "1. Package with Docker",
          steps: [
            { text: "Create this in the project root:", file: "Dockerfile", code: "FROM eclipse-temurin:21-jdk AS build\nWORKDIR /app\nCOPY . .\nRUN ./mvnw -q -DskipTests package\n\nFROM eclipse-temurin:21-jre\nCOPY --from=build /app/target/*.jar app.jar\nEXPOSE 8080\nCMD [\"java\", \"-jar\", \"/app.jar\"]" },
            { text: "Try it locally:", code: "docker build -t my-java-api .\ndocker run -p 8080:8080 -e DB_PASSWORD=yourpassword my-java-api" },
          ],
        },
        {
          title: "2. Deploy on Render",
          steps: [
            { text: "Create a free PostgreSQL database on Render." },
            { text: "Render shows a URL like postgres://user:pass@host/db. Spring needs it split up: DB_URL = jdbc:postgresql://HOST:5432/DB, plus DB_USER and DB_PASSWORD." },
            { text: "New → Web Service → your repo (Docker detected). Add DB_URL, DB_USER, DB_PASSWORD, and PORT=8080." },
            { text: "Deploy and check an endpoint:", code: "curl https://YOUR-API.onrender.com/api/books" },
          ],
        },
      ]

    case "ui-ux":
      return [
        {
          title: "Publishing your work",
          steps: [
            { text: "Prototype: in Figma, Share → anyone with the link → can view. Test the link in a private window." },
            { text: "Key screens: select frames → Export → PNG @2x, and add them to your case study." },
            { text: "Case study: your GitHub README, a public Notion page, or Behance — one public link." },
            { text: "Put all three links (Figma file, prototype, case study) at the top of your README." },
          ],
        },
      ]
  }
}
