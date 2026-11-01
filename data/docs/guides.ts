import type { GuideSection, SetupGuide, TrackArchitecture } from "@/data/docs/types"
import type { TrackSlug } from "@/data/tracks"

/* ------------------------------------------------------------------ */
/* Shared by every track                                               */
/* ------------------------------------------------------------------ */

export const welcomeGuide: GuideSection[] = [
  {
    title: "How the program works",
    paragraphs: [
      "You'll build one real project over four weeks, the way a junior engineer (or designer) works on a team: you get a spec, plan it, build it in small pieces, get every piece reviewed, and ship it.",
      "Each week ends with a deliverable your mentor reviews. You'll find this week's tasks under Milestones once your project is assigned.",
    ],
  },
  {
    title: "Your docs, in order",
    bullets: [
      "Setup — install your tools and create the project skeleton. Do this first.",
      "How we work — Git, pull requests, reviews and how to use AI tools.",
      "PRD — what you're building, for whom, and what “done” means.",
      "User flows — the paths a user takes through your product.",
      "Architecture — how the pieces fit together, the data model and the interface.",
      "Milestones — your week-by-week task list.",
    ],
  },
  {
    title: "Your weekly rhythm",
    bullets: [
      "Start of the week: read that week's milestone and break it into small tasks.",
      "During the week: open small pull requests often — one feature or fix each. Small PRs get reviewed faster.",
      "When stuck for more than 30 minutes: message your mentor with what you tried, what you expected and what happened.",
      "End of the week: make sure the week's deliverable is merged (or shared) and ready for review.",
    ],
  },
  {
    title: "Getting your certificate",
    paragraphs: [
      "Your final project goes through a final review. When it passes, you receive a certificate with a unique ID anyone can verify on our website. If it isn't there yet, you'll get specific feedback and another attempt.",
    ],
  },
]

export const workflowGuide: GuideSection[] = [
  {
    title: "The loop you'll repeat all program",
    steps: [
      { text: "Get the latest code before starting anything new:", code: "git checkout main && git pull" },
      { text: "Create a branch named after the task:", code: "git checkout -b feat/login-page" },
      { text: "Make a small change, then save it as a commit with a clear message:", code: "git add .\ngit commit -m \"Add login form with validation\"" },
      { text: "Push your branch to GitHub:", code: "git push -u origin feat/login-page" },
      { text: "Open a pull request (PR) for review:", code: "gh pr create --fill" },
      { text: "Read your mentor's comments, push fixes to the same branch, and merge once it's approved." },
    ],
  },
  {
    title: "Writing a good pull request",
    bullets: [
      "What: one sentence on what this PR does.",
      "Why: which task or milestone it's for.",
      "How to test: the exact steps to see it working.",
      "Screenshots or a short screen recording for anything visual.",
      "AI usage: which parts AI helped with — and confirm you've read and understood them.",
    ],
  },
  {
    title: "Branch and commit names",
    bullets: [
      "Branches: feat/… for features, fix/… for bugs, docs/… for documentation. Example: feat/booking-api.",
      "Commits: start with a verb, describe what changed. “Add pagination to /orders” beats “update”.",
      "Never commit .env files, passwords or API keys. Your .gitignore should list .env from the first commit.",
    ],
  },
  {
    title: "Using AI tools the right way",
    bullets: [
      "Use AI to plan, scaffold, explain errors and suggest tests — that's how modern teams work.",
      "Read every line it gives you. If you can't explain it in a review, don't submit it.",
      "Test what it writes. AI code often looks right and fails on edge cases.",
      "Never paste secrets, passwords or your .env file into an AI tool.",
    ],
  },
  {
    title: "Design track? Same idea, different tools",
    paragraphs: [
      "Designers share Figma links instead of pull requests. Post your file link with the same structure — what, why, what feedback you want — and resolve your mentor's comments directly in Figma. Keep your case study in a GitHub repository README or a Notion page.",
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Setup per track                                                     */
/* ------------------------------------------------------------------ */

const repoSteps = (name: string) => ({
  title: "Create your repository",
  steps: [
    { text: "Create an empty repository on GitHub and clone it. Replace the name with your project's:", code: `gh repo create ${name} --public --clone\ncd ${name}` },
    { text: "Open the folder in VS Code:", code: "code ." },
  ],
})

const pythonEnv = (packages: string) => ({
  title: "Create a virtual environment",
  steps: [
    { text: "A virtual environment keeps this project's libraries separate from everything else on your computer. Create one:", code: "python3 -m venv .venv" },
    { text: "Activate it — do this every time you open a new terminal. Mac/Linux:", code: "source .venv/bin/activate" },
    { text: "Windows (PowerShell):", code: ".venv\\Scripts\\activate" },
    { text: "Your prompt now starts with (.venv). Install the libraries for your track:", code: `pip install ${packages}` },
    { text: "Record them so anyone can reinstall the same versions:", code: "pip freeze > requirements.txt" },
    { text: "Create a .gitignore so the environment and secrets never get committed:", code: "printf \".venv/\\n.env\\n__pycache__/\\n.ipynb_checkpoints/\\n\" > .gitignore" },
  ],
})

const firstCommit = {
  title: "Make your first commit",
  steps: [
    { text: "Save the skeleton and push it to GitHub:", code: "git add .\ngit commit -m \"Initial project setup\"\ngit push" },
    { text: "Open your repository on github.com and check the files are there. You're ready for week 1." },
  ],
}

export const setupGuides: Record<TrackSlug, SetupGuide> = {
  "full-stack": {
    intro: "You'll build a React frontend and an Express + TypeScript API backed by PostgreSQL. Install the tools in order, then create both halves of your project in one repository.",
    tools: ["vscode", "git", "github", "node", "postgres", "ai"],
    start: [
      repoSteps("my-fullstack-app"),
      {
        title: "Create the React client",
        steps: [
          { text: "Scaffold a React + TypeScript app with Vite in a client folder:", code: "npm create vite@latest client -- --template react-ts" },
          { text: "Install its dependencies and start it. Open the URL it prints (usually localhost:5173):", code: "cd client\nnpm install\nnpm run dev" },
        ],
      },
      {
        title: "Create the Express API",
        steps: [
          { text: "Open a second terminal (the first one is busy running the React app). From the repository root, create the server folder. npm init -y creates package.json, the file that lists your project's libraries:", code: "mkdir server && cd server\nnpm init -y" },
          { text: "Install the libraries the API needs — Express (the web server), cors (lets the React app call it), dotenv (reads .env), zod (validates input), bcrypt (hashes passwords) and jsonwebtoken (login tokens):", code: "npm install express cors dotenv zod bcrypt jsonwebtoken" },
          { text: "Install development-only tools: TypeScript, tsx (runs TypeScript directly) and type definitions so your editor understands the libraries:", code: "npm install -D typescript tsx @types/node @types/express @types/cors @types/bcrypt @types/jsonwebtoken\nnpx tsc --init" },
          { text: "Add Prisma, which talks to PostgreSQL for you. prisma init creates prisma/schema.prisma and a .env file:", code: "npm install @prisma/client\nnpm install -D prisma\nnpx prisma init" },
          { text: "Create your database, then open server/.env and set DATABASE_URL (replace YOUR_PASSWORD with the one you chose when installing PostgreSQL):", code: "createdb myapp" },
          { text: "Your .env line should look like this:", file: "server/.env", code: "DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/myapp\nCLIENT_URL=http://localhost:5173" },
          { text: "Create the Express app. Make the src folder first, then this file:", file: "server/src/app.ts", code: "import express from \"express\"\nimport cors from \"cors\"\n\nexport const app = express()\n\napp.use(cors({ origin: process.env.CLIENT_URL }))\napp.use(express.json())\n\n// A tiny route to check the server is alive\napp.get(\"/health\", (req, res) => {\n  res.json({ ok: true })\n})" },
          { text: "Create the file that starts the server:", file: "server/src/index.ts", code: "import \"dotenv/config\"\nimport { app } from \"./app\"\n\nconst port = Number(process.env.PORT) || 4000\napp.listen(port, () => {\n  console.log(\"API running on http://localhost:\" + port)\n})" },
          { text: "Add a dev script (tsx watch restarts the server every time you save) and start it:", code: "npm pkg set scripts.dev=\"tsx watch src/index.ts\"\nnpm run dev" },
          { text: "Open http://localhost:4000/health in your browser. If you see {\"ok\":true}, your API works. 🎉" },
        ],
      },
      firstCommit,
    ],
  },
  backend: {
    intro: "You'll build an Express + TypeScript API with Prisma, a database (PostgreSQL or MongoDB — confirmed in your 1:1) and Redis for caching.",
    tools: ["vscode", "git", "github", "node", "postgres", "mongodb", "docker", "ai"],
    start: [
      repoSteps("my-api"),
      {
        title: "Create the API project",
        steps: [
          { text: "Create package.json (the list of your project's libraries) and install Express (web server), dotenv (reads .env), zod (validates input), ioredis (talks to Redis) and jsonwebtoken (auth tokens):", code: "npm init -y\nnpm install express dotenv zod ioredis jsonwebtoken" },
          { text: "Install development tools — TypeScript, tsx (runs TypeScript directly) and type definitions — and create a TypeScript config:", code: "npm install -D typescript tsx @types/node @types/express @types/jsonwebtoken\nnpx tsc --init" },
          { text: "Add Prisma. It supports both PostgreSQL and MongoDB:", code: "npm install @prisma/client\nnpm install -D prisma\nnpx prisma init" },
          { text: "In prisma/schema.prisma, set provider to \"postgresql\" or \"mongodb\", then put your connection string in .env as DATABASE_URL." },
          { text: "Start Redis in Docker (leave it running in the background):", code: "docker run -d --name redis -p 6379:6379 redis" },
          { text: "Create the Express app:", file: "src/app.ts", code: "import express from \"express\"\n\nexport const app = express()\napp.use(express.json())\n\napp.get(\"/health\", (req, res) => {\n  res.json({ ok: true })\n})" },
          { text: "Create the file that starts it:", file: "src/index.ts", code: "import \"dotenv/config\"\nimport { app } from \"./app\"\n\nconst port = Number(process.env.PORT) || 4000\napp.listen(port, () => {\n  console.log(\"API running on http://localhost:\" + port)\n})" },
          { text: "Add a dev script (restarts on every save) and run your server:", code: "npm pkg set scripts.dev=\"tsx watch src/index.ts\"\nnpm run dev" },
          { text: "Open http://localhost:4000/health — you should see {\"ok\":true}." },
        ],
      },
      firstCommit,
    ],
  },
  frontend: {
    intro: "You'll build a Next.js app with TypeScript, Tailwind CSS and shadcn/ui components. One command creates most of it.",
    tools: ["vscode", "git", "github", "node", "ai"],
    start: [
      {
        title: "Create the Next.js app",
        steps: [
          { text: "Create the app. Accept the recommended defaults (TypeScript, ESLint, Tailwind CSS, App Router):", code: "npx create-next-app@latest my-app\ncd my-app" },
          { text: "Start the development server and open localhost:3000:", code: "npm run dev" },
        ],
      },
      {
        title: "Add shadcn/ui and data libraries",
        steps: [
          { text: "Set up shadcn/ui — ready-made, accessible components you own and can edit:", code: "npx shadcn@latest init" },
          { text: "Add your first components:", code: "npx shadcn@latest add button card input" },
          { text: "Install React Query (data fetching) and Zustand (shared state):", code: "npm install @tanstack/react-query zustand" },
        ],
      },
      {
        title: "Put it on GitHub",
        steps: [
          { text: "create-next-app already made a Git repository. Create the GitHub repo from it and push:", code: "gh repo create my-app --public --source=. --push" },
        ],
      },
    ],
  },
  "app-development": {
    intro: "You'll build a React Native app with Expo and run it on your own phone through Expo Go.",
    tools: ["vscode", "git", "github", "node", "expo", "ai"],
    start: [
      {
        title: "Create the Expo app",
        steps: [
          { text: "Create a new project:", code: "npx create-expo-app@latest my-app\ncd my-app" },
          { text: "Start the development server:", code: "npx expo start" },
          { text: "Scan the QR code with Expo Go (Android) or your Camera app (iPhone). The app opens on your phone and reloads every time you save." },
        ],
      },
      {
        title: "Prepare for builds (week 4)",
        steps: [
          { text: "Install the Expo build tool and log in with your Expo account:", code: "npm install -g eas-cli\neas login" },
          { text: "You'll configure an APK build in week 4 — nothing else needed now." },
        ],
      },
      {
        title: "Put it on GitHub",
        steps: [{ text: "Create the GitHub repo from your project and push:", code: "gh repo create my-app --public --source=. --push" }],
      },
    ],
  },
  "ai-ml": {
    intro: "You'll explore data in Jupyter, train models with scikit-learn (and optionally PyTorch or an LLM), then serve them with FastAPI and Streamlit.",
    tools: ["vscode", "git", "github", "python", "jupyter", "ai"],
    start: [
      repoSteps("my-ml-project"),
      pythonEnv("numpy pandas scikit-learn matplotlib jupyterlab"),
      {
        title: "Organise your project",
        steps: [
          { text: "Create folders for data, notebooks and your app code:", code: "mkdir data notebooks app" },
          { text: "Start Jupyter. It opens in your browser — make a new notebook in the notebooks folder called 01-exploration.ipynb:", code: "jupyter lab" },
          { text: "Type this in the first cell and press Shift + Enter to run it. If it prints version numbers, your setup works:", code: "import pandas as pd\nimport sklearn\nprint(pd.__version__, sklearn.__version__)" },
          { text: "In week 3 you'll add FastAPI and Streamlit:", code: "pip install \"fastapi[standard]\" streamlit" },
        ],
      },
      firstCommit,
    ],
  },
  "data-science": {
    intro: "You'll clean and analyse a dataset in Jupyter with pandas and SQL, then turn your findings into a dashboard.",
    tools: ["vscode", "git", "github", "python", "jupyter", "powerbi", "ai"],
    start: [
      repoSteps("my-analysis"),
      pythonEnv("pandas matplotlib plotly jupyterlab streamlit"),
      {
        title: "Organise your project",
        steps: [
          { text: "Create folders for raw data, notebooks and your dashboard:", code: "mkdir data notebooks dashboard" },
          { text: "Put your dataset in data/. If it's larger than 50 MB, add data/ to .gitignore and link to the source in your README instead." },
          { text: "SQL needs no extra install — Python's built-in sqlite3 module lets you query your data with SQL from a notebook." },
          { text: "Start Jupyter. It opens in your browser — make a new notebook in the notebooks folder called 01-cleaning.ipynb:", code: "jupyter lab" },
          { text: "Type this in the first cell and press Shift + Enter. If it prints a version number, you're ready:", code: "import pandas as pd\nprint(pd.__version__)" },
        ],
      },
      firstCommit,
    ],
  },
  python: {
    intro: "You'll build a real command-line tool and a small FastAPI service in Python, with tests.",
    tools: ["vscode", "git", "github", "python", "ai"],
    start: [
      repoSteps("my-python-tool"),
      pythonEnv("requests \"fastapi[standard]\" pydantic pytest"),
      {
        title: "Organise your project",
        steps: [
          { text: "Create a package folder (app) and a tests folder. The empty __init__.py tells Python “app is a package you can import from”:", code: "mkdir app tests\ntouch app/__init__.py app/main.py tests/test_main.py" },
          { text: "Put a minimal command-line program in main.py:", file: "app/main.py", code: "import argparse\n\ndef main():\n    parser = argparse.ArgumentParser(description=\"My tool\")\n    parser.add_argument(\"name\", help=\"Who to greet\")\n    args = parser.parse_args()\n    print(f\"Hello, {args.name}!\")\n\nif __name__ == \"__main__\":\n    main()" },
          { text: "Run it from the project root. You should see “Hello, Asha!”:", code: "python -m app.main Asha" },
          { text: "Try the built-in help that argparse gives you for free:", code: "python -m app.main --help" },
        ],
      },
      firstCommit,
    ],
  },
  java: {
    intro: "You'll write plain Java first, then build a Spring Boot REST API on PostgreSQL. Spring Initializr generates the project for you.",
    tools: ["git", "github", "java", "intellij", "postgres", "ai"],
    start: [
      {
        title: "Generate the Spring Boot project",
        steps: [
          { text: "Go to start.spring.io and choose: Maven, Java, Java 21, the latest stable Spring Boot." },
          { text: "Add dependencies: Spring Web, Spring Data JPA, PostgreSQL Driver, Validation." },
          { text: "Click Generate, unzip the download, and open the folder in IntelliJ (File → Open)." },
        ],
      },
      {
        title: "Connect the database and run",
        steps: [
          { text: "Create a database for your project:", code: "createdb java_app" },
          { text: "In src/main/resources/application.properties, add your connection details:", code: "spring.datasource.url=jdbc:postgresql://localhost:5432/java_app\nspring.datasource.username=postgres\nspring.datasource.password=YOUR_PASSWORD\nspring.jpa.hibernate.ddl-auto=update" },
          { text: "Run the app (or press the green ▶ next to the main class in IntelliJ):", code: "./mvnw spring-boot:run" },
        ],
      },
      {
        title: "Put it on GitHub",
        steps: [
          { text: "From the project folder:", code: "git init\ngit add .\ngit commit -m \"Initial Spring Boot project\"\ngh repo create my-java-api --public --source=. --push" },
        ],
      },
    ],
  },
  "ui-ux": {
    intro: "You'll research, design and prototype a real product in Figma and write it up as a portfolio case study.",
    tools: ["figma", "github", "ai"],
    start: [
      {
        title: "Set up your Figma file",
        steps: [
          { text: "Create a new design file named after your project." },
          { text: "Add these pages (left sidebar → +): Cover, Research, Flows, Wireframes, Design system, UI, Prototype." },
          { text: "Create a FigJam board for interview notes, affinity mapping and your journey map." },
          { text: "Share both with your mentor with “can comment” access." },
        ],
      },
      {
        title: "Set up your case study",
        steps: [
          { text: "Create a GitHub repository for your case study — its README becomes the write-up:", code: "gh repo create my-case-study --public --clone" },
          { text: "Add a README.md with headings: Problem, Users, Research, Flows, Design, Testing, Outcome. You'll fill it in each week." },
        ],
      },
    ],
  },
}

/* ------------------------------------------------------------------ */
/* The stack every project in a track shares                           */
/* ------------------------------------------------------------------ */

export const trackArchitecture: Record<TrackSlug, TrackArchitecture> = {
  "full-stack": {
    summary: "A React single-page app talks to an Express REST API over HTTPS. The API owns all business rules and is the only thing that touches the database.",
    parts: [
      { name: "Client — React + TypeScript (Vite)", role: "Pages, forms and state. Deployed on Vercel." },
      { name: "API — Node.js + Express", role: "REST endpoints, validation and auth. Deployed on Render." },
      { name: "Database — PostgreSQL via Prisma", role: "Stores all data; Prisma maps tables to TypeScript types. Hosted on Render." },
      { name: "Auth — JWT", role: "Passwords hashed with bcrypt; a signed token proves who's calling each request." },
    ],
    interfaceTitle: "API endpoints",
    dataTitle: "Data model",
  },
  backend: {
    summary: "An Express API structured in layers: routes receive requests, services hold business logic, and Prisma talks to the database. Redis caches hot reads.",
    parts: [
      { name: "Routes — Express", role: "Parse and validate requests (zod), return consistent JSON errors." },
      { name: "Services", role: "Business rules, kept independent of HTTP so they're easy to test." },
      { name: "Data — Prisma + PostgreSQL or MongoDB", role: "Schema, migrations and queries." },
      { name: "Cache — Redis", role: "Speeds up frequent reads and backs the rate limiter." },
      { name: "Docs — Swagger / OpenAPI", role: "The contract you write in week 1, published at /docs." },
    ],
    interfaceTitle: "API endpoints",
    dataTitle: "Data model",
  },
  frontend: {
    summary: "A Next.js App Router app. Pages fetch data on the server where possible; interactive parts are client components using React Query for caching and Zustand for shared UI state.",
    parts: [
      { name: "Pages — Next.js App Router", role: "Routes, layouts and server-side data loading." },
      { name: "Components — shadcn/ui + Tailwind CSS", role: "Accessible building blocks you customise." },
      { name: "Data — React Query", role: "Fetching, caching and loading/error states for client components." },
      { name: "State — Zustand", role: "Small shared state such as filters or a cart." },
    ],
    interfaceTitle: "Screens",
    dataTitle: "Data shapes",
  },
  "app-development": {
    summary: "A React Native app built with Expo. Screens are connected with React Navigation, data is stored on the device and synced with a REST API where needed.",
    parts: [
      { name: "Screens — React Native", role: "UI built from native components." },
      { name: "Navigation — React Navigation (Expo Router)", role: "Tabs and stacks between screens." },
      { name: "Storage — AsyncStorage", role: "Saves data on the phone so the app works offline." },
      { name: "Notifications — Expo Notifications", role: "Local and push notifications." },
    ],
    interfaceTitle: "Screens",
    dataTitle: "Data stored on the device",
  },
  "ai-ml": {
    summary: "A pipeline from raw data to a deployed model: explore in notebooks, train and evaluate, then serve predictions through a FastAPI endpoint with a Streamlit front end.",
    parts: [
      { name: "Notebooks — Jupyter", role: "Exploration, cleaning and experiments." },
      { name: "Model — scikit-learn (+ PyTorch or an LLM)", role: "Training, evaluation and the saved model file." },
      { name: "API — FastAPI", role: "Loads the model and serves predictions." },
      { name: "App — Streamlit", role: "A simple UI anyone can try." },
    ],
    interfaceTitle: "Model inputs & outputs",
    dataTitle: "Dataset",
  },
  "data-science": {
    summary: "A reproducible analysis: raw data is cleaned in notebooks, questions are answered with SQL and pandas, and findings are presented in a dashboard and short report.",
    parts: [
      { name: "Cleaning — pandas in Jupyter", role: "Fix types, missing values and duplicates." },
      { name: "Querying — SQL (sqlite3)", role: "Answer each business question with a query." },
      { name: "Analysis — pandas + Plotly / Matplotlib", role: "Charts and statistical checks." },
      { name: "Dashboard — Streamlit or Power BI", role: "Interactive view of the key findings." },
    ],
    interfaceTitle: "Dashboard views",
    dataTitle: "Dataset",
  },
  python: {
    summary: "A Python package with a command-line interface and a small FastAPI service that share the same core logic and SQLite database.",
    parts: [
      { name: "Core — Python modules", role: "Your models (classes) and business logic." },
      { name: "CLI — argparse", role: "Commands you run from the terminal." },
      { name: "Storage — SQLite", role: "A file-based database, built into Python." },
      { name: "API — FastAPI + Pydantic", role: "HTTP access to the same data, with validated input." },
      { name: "Tests — pytest", role: "Checks for the core logic." },
    ],
    interfaceTitle: "Commands & endpoints",
    dataTitle: "Data model",
  },
  java: {
    summary: "A Spring Boot REST API in layers: controllers handle HTTP, services hold business rules, repositories (Spring Data JPA) talk to PostgreSQL.",
    parts: [
      { name: "Controllers", role: "REST endpoints and request validation." },
      { name: "Services", role: "Business rules and transactions." },
      { name: "Repositories — Spring Data JPA", role: "Database access without writing SQL by hand." },
      { name: "Database — PostgreSQL", role: "Tables generated from your entity classes." },
    ],
    interfaceTitle: "API endpoints",
    dataTitle: "Entities",
  },
  "ui-ux": {
    summary: "Not code — a design system. Research feeds personas and flows, flows become wireframes, wireframes become high-fidelity screens built from a small component library, and the prototype is tested with real users.",
    parts: [
      { name: "Research — FigJam", role: "Interview notes, affinity map, personas, journey map." },
      { name: "Structure — user flows & wireframes", role: "What screens exist and how users move between them." },
      { name: "Design system — Figma components", role: "Colours, type, spacing and reusable components." },
      { name: "Prototype — Figma", role: "Clickable flows used for usability testing." },
    ],
    interfaceTitle: "Screens to design",
    dataTitle: "Content on each screen",
  },
}
