/**
 * Track catalogue — curriculum content for the landing grid and the
 * per-track /tracks/[slug] pages. Edit text here, not in components.
 */

export const TRACK_SLUGS = [
  "full-stack",
  "backend",
  "frontend",
  "app-development",
  "ai-ml",
  "data-science",
  "python",
  "java",
  "ui-ux",
] as const

export type TrackSlug = (typeof TRACK_SLUGS)[number]

export type TrackCategory = "Development" | "Programming" | "AI & Data" | "Design"

export const trackCategories: TrackCategory[] = ["Development", "Programming", "AI & Data", "Design"]

/** One week of a track: concrete tasks plus the artefact it ends with. */
export type TrackWeek = { title: string; points: string[]; deliverable: string }

export type TrackProject = { slug: string; name: string; description: string }

export type Track = {
  slug: TrackSlug
  name: string
  category: TrackCategory
  oneLiner: string
  skills: string[]
  weeks: [TrackWeek, TrackWeek, TrackWeek, TrackWeek]
  /** The three projects proposed to every student in this track — they pick one. */
  projects: [TrackProject, TrackProject, TrackProject]
  buildWithAi: string
}

export const tracks: Track[] = [
  {
    slug: "full-stack",
    name: "Full-Stack Development",
    category: "Development",
    oneLiner: "Build and ship a complete web app, frontend to cloud.",
    skills: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Prisma", "REST APIs", "JWT Auth", "Vercel", "Render"],
    weeks: [
      {
        title: "Spec & system design",
        points: [
          "Turn the PRD into user stories and a task board",
          "Draw the architecture: React client, Express API, PostgreSQL",
          "Design the database schema and relations",
          "Write API contracts — routes, payloads and error codes",
        ],
        deliverable: "Design doc your mentor signs off",
      },
      {
        title: "Backend API",
        points: [
          "Set up an Express + TypeScript project with linting",
          "Build CRUD endpoints with request validation",
          "Add sign-up and login with hashed passwords and JWT",
          "Connect PostgreSQL through Prisma, with migrations and seed data",
        ],
        deliverable: "Tested API, merged through reviewed PRs",
      },
      {
        title: "Frontend & integration",
        points: [
          "Build pages and reusable components in React",
          "Handle forms plus loading, empty and error states",
          "Wire up auth and protected routes end to end",
          "Write tests for the core user flows",
        ],
        deliverable: "Full app working end to end",
      },
      {
        title: "Ship",
        points: [
          "Deploy the React frontend on Vercel",
          "Deploy the Express API and PostgreSQL on Render",
          "Set up environment variables and production config",
          "Write the README and record a demo video",
          "Final review, then resume & profile review",
        ],
        deliverable: "Live URL, demo video and certificate",
      },
    ],
    projects: [
      { slug: "job-tracker", name: "Job application tracker", description: "Track applications through each stage, with reminders and a dashboard of your pipeline." },
      { slug: "event-booking", name: "Event booking platform", description: "Browse events, book seats with live availability, and manage bookings as an organiser." },
      { slug: "task-manager", name: "Team task manager", description: "Boards, assignees and due dates, with role-based access for team admins." },
    ],
    buildWithAi: "Use AI to scaffold APIs and components, then write tests and review every PR yourself.",
  },
  {
    slug: "backend",
    name: "Backend Development",
    category: "Development",
    oneLiner: "Design and build production-style APIs and services.",
    skills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Prisma", "Redis", "JWT Auth", "REST API Design", "Docker", "Swagger", "Rate Limiting"],
    weeks: [
      {
        title: "API design",
        points: [
          "Model your resources and write the OpenAPI contract",
          "Design the data model in MongoDB or PostgreSQL (with Prisma)",
          "Plan the Express layers: routes, services, data access",
        ],
        deliverable: "API contract and schema signed off",
      },
      {
        title: "Core API",
        points: [
          "Express routes with validation and consistent errors",
          "JWT auth with role-based access",
          "Pagination, filtering and sorting",
          "Integration tests against a test database",
        ],
        deliverable: "Core endpoints merged with tests",
      },
      {
        title: "Production features",
        points: [
          "Cache hot reads with Redis",
          "Rate-limit public endpoints",
          "Structured logging and a health check",
          "Load-test one endpoint and fix the bottleneck",
        ],
        deliverable: "Before/after performance numbers",
      },
      {
        title: "Ship",
        points: [
          "Dockerise the API and database",
          "Deploy with environment-based config",
          "Publish Swagger docs and a README",
          "Final review, then resume & profile review",
        ],
        deliverable: "Live API, docs and certificate",
      },
    ],
    projects: [
      { slug: "url-shortener", name: "URL shortener with analytics", description: "Short links with custom aliases, click tracking and per-link analytics." },
      { slug: "ecommerce-backend", name: "E-commerce backend", description: "Products, carts, orders and inventory, with a checkout flow and admin APIs." },
      { slug: "booking-api", name: "Booking system API", description: "Time-slot booking with conflict checks, cancellations and email confirmations." },
    ],
    buildWithAi: "Generate boilerplate and tests with AI, then load-test and harden what it produces.",
  },
  {
    slug: "frontend",
    name: "Frontend Development",
    category: "Development",
    oneLiner: "Build fast, accessible interfaces with React and Next.js.",
    skills: ["React", "Next.js", "HTML", "CSS", "JavaScript", "TypeScript", "Tailwind CSS", "shadcn/ui", "React Query / Zustand", "Accessibility", "Vercel"],
    weeks: [
      {
        title: "UI plan",
        points: [
          "Semantic HTML, modern CSS layout and JavaScript refresher",
          "Break the designs into a component tree",
          "Set up Next.js with TypeScript, Tailwind CSS and shadcn/ui",
          "Plan routes, data needs and where state lives",
        ],
        deliverable: "Component plan signed off",
      },
      {
        title: "Component library",
        points: [
          "Build reusable, typed React components on shadcn/ui",
          "Responsive layouts with Flexbox, Grid and Tailwind",
          "Pages and routing with the Next.js App Router",
          "Keyboard and screen-reader accessibility",
        ],
        deliverable: "Component set merged through PRs",
      },
      {
        title: "Data & state",
        points: [
          "Fetch data on the server with Next.js, cache on the client with React Query",
          "Shared state with Zustand where it's needed",
          "Loading, empty and error states",
          "Forms with validation",
        ],
        deliverable: "App fully wired to a real API",
      },
      {
        title: "Ship",
        points: [
          "Lighthouse audit for performance and accessibility",
          "Deploy on Vercel",
          "Write the README and record a demo",
          "Final review, then resume & profile review",
        ],
        deliverable: "Live URL, Lighthouse report and certificate",
      },
    ],
    projects: [
      { slug: "finance-dashboard", name: "Personal finance dashboard", description: "Charts, budgets and filters over a year of transactions." },
      { slug: "movie-discovery", name: "Movie discovery app", description: "Search, filter and save movies from a public movie API, with infinite scroll." },
      { slug: "admin-panel", name: "Admin panel", description: "Data tables, forms and role-based views for managing users and orders." },
    ],
    buildWithAi: "Turn designs into components with AI, then refactor for clean, accessible code.",
  },
  {
    slug: "app-development",
    name: "App Development",
    category: "Development",
    oneLiner: "Build a real mobile app with React Native.",
    skills: ["React Native", "Expo", "Android", "Navigation", "Local Storage", "REST APIs", "Push Notifications"],
    weeks: [
      {
        title: "App plan",
        points: [
          "Map screens and user flows",
          "Set up a React Native project with Expo",
          "Plan navigation, data model and local storage",
        ],
        deliverable: "Screen map and architecture signed off",
      },
      {
        title: "Core screens",
        points: [
          "Build the main screens with React Native and React Navigation",
          "Reusable UI components and theming",
          "Persist data on the device",
        ],
        deliverable: "Core flows running on a phone",
      },
      {
        title: "Features",
        points: [
          "Connect to a REST API with login",
          "Push notifications with Expo Notifications",
          "Offline and error handling",
          "App-wide state management",
        ],
        deliverable: "Feature-complete app on a test device",
      },
      {
        title: "Ship",
        points: [
          "Polish: app icon, splash screen, empty states",
          "Build a release APK with Expo (EAS Build)",
          "Write the README and screen-record a demo",
          "Final review, then resume & profile review",
        ],
        deliverable: "Installable APK, demo and certificate",
      },
    ],
    projects: [
      { slug: "habit-tracker", name: "Habit tracker", description: "Daily check-ins, streaks and reminder notifications, stored on the device." },
      { slug: "expense-manager", name: "Expense manager", description: "Log spending by category, see monthly charts and set budget alerts." },
      { slug: "food-ordering", name: "Food ordering app", description: "Browse a menu, build a cart, place orders and track their status." },
    ],
    buildWithAi: "Prototype screens quickly with AI and debug device-specific issues with it.",
  },
  {
    slug: "ai-ml",
    name: "AI & Machine Learning",
    category: "AI & Data",
    oneLiner: "Build, evaluate and deploy real ML and LLM-powered apps.",
    skills: ["Python", "PyTorch", "scikit-learn", "NumPy", "Pandas", "Jupyter", "Model Evaluation", "LLM APIs", "RAG", "FastAPI", "Streamlit"],
    weeks: [
      {
        title: "Problem & data",
        points: [
          "Define the problem and a success metric",
          "Explore and clean the dataset with Pandas and NumPy in Jupyter",
          "Plan the pipeline: features, model, evaluation",
        ],
        deliverable: "EDA notebook and pipeline plan",
      },
      {
        title: "Classical ML",
        points: [
          "Train baseline models with scikit-learn",
          "Cross-validate with the right metrics",
          "Tune hyperparameters and compare results",
        ],
        deliverable: "Model comparison report",
      },
      {
        title: "AI features",
        points: [
          "Add a PyTorch model or an LLM / RAG feature",
          "Design prompts and evaluate LLM output",
          "Serve the model from a FastAPI endpoint",
        ],
        deliverable: "Working model or AI feature behind an API",
      },
      {
        title: "Ship",
        points: [
          "Build a Streamlit or web front end",
          "Deploy it",
          "README with metrics and known limits, plus a demo",
          "Final review, then resume & profile review",
        ],
        deliverable: "Live AI app, demo and certificate",
      },
    ],
    projects: [
      { slug: "resume-screener", name: "Resume screener", description: "Score resumes against a job description and explain each match." },
      { slug: "document-qa", name: "Document Q&A bot (RAG)", description: "Upload PDFs and ask questions, with answers that cite their sources." },
      { slug: "fake-news-classifier", name: "Fake news classifier", description: "Classify headlines and articles, and report precision and recall." },
    ],
    buildWithAi: "Build with LLM APIs directly — prompt design, RAG and evaluating AI output.",
  },
  {
    slug: "data-science",
    name: "Data Science",
    category: "AI & Data",
    oneLiner: "Turn raw data into insights and dashboards.",
    skills: ["Python", "Pandas", "Jupyter", "SQL", "Plotly", "Matplotlib", "Streamlit", "Power BI", "Data Cleaning", "EDA", "Statistics", "Data Storytelling"],
    weeks: [
      {
        title: "Questions & data",
        points: [
          "Turn a business problem into 3–5 questions",
          "Load and profile the dataset",
          "Write the analysis plan",
        ],
        deliverable: "Analysis plan signed off",
      },
      {
        title: "Clean & query",
        points: [
          "Fix missing values, duplicates and outliers",
          "Answer questions with SQL",
          "Prepare features in Pandas",
        ],
        deliverable: "Clean dataset and SQL queries",
      },
      {
        title: "Analyze",
        points: [
          "Exploratory analysis with charts in Jupyter",
          "Test one hypothesis statistically",
          "Build visuals with Matplotlib / Plotly",
        ],
        deliverable: "Analysis notebook with findings",
      },
      {
        title: "Ship",
        points: [
          "Interactive dashboard in Streamlit or Power BI",
          "One-page insights report",
          "Record a demo walkthrough",
          "Final review, then resume & profile review",
        ],
        deliverable: "Dashboard, report and certificate",
      },
    ],
    projects: [
      { slug: "ipl-analysis", name: "IPL performance analysis", description: "Player and team trends across seasons, with a match-winner breakdown." },
      { slug: "sales-dashboard", name: "Sales insights dashboard", description: "Revenue by region, product and month, with the drivers behind each trend." },
      { slug: "real-estate-analysis", name: "Real-estate price analysis", description: "What drives prices across localities, with a simple price estimator." },
    ],
    buildWithAi: "Use AI to speed up cleaning and charting, then verify every number yourself.",
  },
  {
    slug: "python",
    name: "Python Programming",
    category: "Programming",
    oneLiner: "Go from Python basics to building real tools and APIs.",
    skills: ["Python", "FastAPI", "SQLite", "Pytest", "Pydantic", "Git", "OOP", "File Handling", "Requests", "Automation"],
    weeks: [
      {
        title: "Foundations",
        points: [
          "Data types, functions and modules",
          "Classes and OOP for your project's core models",
          "Virtual environment and Git repo setup",
          "Project brief and task breakdown",
        ],
        deliverable: "Project skeleton with core classes",
      },
      {
        title: "Real-world Python",
        points: [
          "Read and write CSV and JSON files",
          "Handle errors and log properly",
          "Call external APIs with requests",
          "Automate a repetitive task with a script",
        ],
        deliverable: "Working command-line tool",
      },
      {
        title: "Data & APIs",
        points: [
          "Store data in SQLite",
          "Expose it through a small FastAPI service",
          "Validate input with Pydantic",
        ],
        deliverable: "CLI and API sharing one database",
      },
      {
        title: "Ship",
        points: [
          "Write tests with pytest",
          "Package it with a README and setup steps",
          "Record a demo",
          "Final review, then resume & profile review",
        ],
        deliverable: "Tested, documented repo and certificate",
      },
    ],
    projects: [
      { slug: "expense-cli", name: "Expense tracker CLI + API", description: "Log expenses from the terminal and query them through a FastAPI service." },
      { slug: "web-scraper", name: "Web scraper with alerts", description: "Watch prices or listings on a site and get alerted when something changes." },
      { slug: "automation-toolkit", name: "Automation toolkit", description: "Scripts that rename, organise and report on files, run on a schedule." },
    ],
    buildWithAi: "Use AI as a pair programmer to learn faster — and explain every line in review.",
  },
  {
    slug: "java",
    name: "Java Programming",
    category: "Programming",
    oneLiner: "Master Java and build a Spring Boot backend.",
    skills: ["Core Java", "Spring Boot", "MySQL / PostgreSQL", "JPA / Hibernate", "Maven", "JUnit", "OOP", "Collections", "Exceptions", "JDBC", "REST APIs"],
    weeks: [
      {
        title: "Foundations",
        points: [
          "OOP: classes, interfaces and inheritance",
          "Collections and generics",
          "Exceptions and clean error handling",
          "Project brief and domain model",
        ],
        deliverable: "Domain model in plain Java, signed off",
      },
      {
        title: "Data layer",
        points: [
          "Design the MySQL / PostgreSQL schema",
          "Query it with JDBC",
          "Set up the Maven project structure",
        ],
        deliverable: "Data layer with working queries",
      },
      {
        title: "Spring Boot",
        points: [
          "REST controllers, services and repositories",
          "Move from raw JDBC to Spring Data JPA",
          "Validation and global exception handling",
        ],
        deliverable: "REST API merged through reviewed PRs",
      },
      {
        title: "Ship",
        points: [
          "Unit and integration tests with JUnit",
          "Deploy the API",
          "Write the README and API docs, record a demo",
          "Final review, then resume & profile review",
        ],
        deliverable: "Live API, tests and certificate",
      },
    ],
    projects: [
      { slug: "library-api", name: "Library management API", description: "Books, members and loans, with due dates and fine calculation." },
      { slug: "banking-api", name: "Banking system API", description: "Accounts, deposits, transfers and statements, with safe transactions." },
      { slug: "inventory-system", name: "Inventory system", description: "Products, suppliers and stock levels, with low-stock alerts." },
    ],
    buildWithAi: "Use AI to understand Spring concepts and generate tests, then refactor by hand.",
  },
  {
    slug: "ui-ux",
    name: "UI/UX Design",
    category: "Design",
    oneLiner: "Design real products and build a portfolio case study.",
    skills: ["Figma", "User Research", "Personas", "User Flows", "Wireframing", "Design Systems", "Prototyping", "Usability Testing", "Dev Handoff"],
    weeks: [
      {
        title: "Research",
        points: [
          "Define the problem and target users",
          "Interview 3–5 real users",
          "Build personas and a journey map",
        ],
        deliverable: "Research summary signed off",
      },
      {
        title: "Structure",
        points: [
          "Information architecture and user flows",
          "Low-fidelity wireframes for key screens",
          "A quick feedback round on the wireframes",
        ],
        deliverable: "Wireframes for the core flow",
      },
      {
        title: "Visual design",
        points: [
          "Build a mini design system in Figma",
          "High-fidelity screens",
          "A clickable prototype",
        ],
        deliverable: "Interactive Figma prototype",
      },
      {
        title: "Ship",
        points: [
          "Run a usability test and iterate",
          "Prepare the developer handoff",
          "Write a portfolio case study",
          "Final review, then portfolio & resume review",
        ],
        deliverable: "Case study, prototype and certificate",
      },
    ],
    projects: [
      { slug: "app-redesign", name: "Redesign of a popular app", description: "Find real usability problems in an app you use and redesign the flows." },
      { slug: "campus-app", name: "Campus utility app", description: "Design an app that solves one everyday problem for students on your campus." },
      { slug: "fintech-onboarding", name: "Fintech onboarding flow", description: "Design a sign-up and KYC flow that feels fast, clear and trustworthy." },
    ],
    buildWithAi: "Use AI for research synthesis and quick concepts, then design and justify the final work.",
  },
]

export const everyTrackIncludes = [
  "Git & GitHub workflow",
  "README & documentation",
  "PR/design reviews",
  "Resume & profile review",
  "Verified certificate",
] as const

/** Short label for tight spaces, e.g. "Full-Stack Development" → "Full-Stack". */
export function trackShortName(track: Track) {
  return track.name.replace(/ (Development|Programming|Design)$/, "").replace("Machine Learning", "ML")
}

export function getTrack(slug: string): Track | undefined {
  return tracks.find((track) => track.slug === slug)
}

export function isTrackSlug(value: string): value is TrackSlug {
  return TRACK_SLUGS.includes(value as TrackSlug)
}
