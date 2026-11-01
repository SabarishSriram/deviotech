import type { Tool, ToolId } from "@/data/docs/types"

/**
 * Every tool a student might install. Each one explains what it is, why the
 * program needs it, how to install it per OS, and how to check it worked.
 * Versions move fast — always take the current LTS / stable release.
 */
export const tools: Record<ToolId, Tool> = {
  vscode: {
    id: "vscode",
    name: "Visual Studio Code",
    what: "A free code editor — where you'll write, run and debug your code.",
    why: "It has a built-in terminal, Git integration and extensions for every language in the program, so you can do almost everything from one window.",
    install: {
      all: [
        { text: "Download the installer for your OS from code.visualstudio.com and run it." },
        { text: "Windows: on the installer's options screen, tick “Add to PATH” and “Open with Code”." },
        { text: "Open VS Code, press Ctrl/Cmd + Shift + P, type “shell command” and choose “Install 'code' command in PATH” (Mac only)." },
        { text: "Open the Extensions panel (Ctrl/Cmd + Shift + X) and install “ESLint”, “Prettier” and “GitLens”." },
      ],
    },
    verify: { code: "code --version", expect: "A version number like 1.9x.x" },
    tip: "Open the built-in terminal with Ctrl + ` (the key above Tab). Most commands in these docs are run there.",
  },

  git: {
    id: "git",
    name: "Git",
    icon: "Git",
    what: "Version control: it records every change you make so you can go back, branch off and collaborate.",
    why: "Every piece of work in the program is submitted as a Git commit and reviewed as a pull request — exactly how real teams work.",
    install: {
      mac: [{ text: "Open Terminal and run the command below. Click “Install” in the pop-up.", code: "xcode-select --install" }],
      windows: [
        { text: "Download “Git for Windows” from git-scm.com and run the installer." },
        { text: "Keep the default options. This also installs “Git Bash”, a terminal that understands the commands in these docs." },
      ],
      linux: [{ text: "Install it with your package manager:", code: "sudo apt update && sudo apt install git" }],
    },
    verify: { code: "git --version", expect: "git version 2.x" },
    tip: "Then tell Git who you are (use the email from your GitHub account):\ngit config --global user.name \"Your Name\"\ngit config --global user.email \"you@example.com\"",
  },

  github: {
    id: "github",
    name: "GitHub account + GitHub CLI",
    icon: "Git",
    what: "GitHub hosts your code online. The GitHub CLI (gh) lets you log in and open pull requests from the terminal.",
    why: "Your repository lives on GitHub, your mentor reviews your pull requests there, and it becomes part of your portfolio.",
    install: {
      mac: [
        { text: "Create a free account at github.com (use the same username you gave in your application)." },
        { text: "Install Homebrew from brew.sh if you don't have it, then install the GitHub CLI:", code: "brew install gh" },
        { text: "Log in. Choose GitHub.com → HTTPS → “Login with a web browser”.", code: "gh auth login" },
      ],
      windows: [
        { text: "Create a free account at github.com (use the same username you gave in your application)." },
        { text: "Install the GitHub CLI:", code: "winget install --id GitHub.cli" },
        { text: "Close and reopen your terminal, then log in. Choose GitHub.com → HTTPS → “Login with a web browser”.", code: "gh auth login" },
      ],
      linux: [
        { text: "Create a free account at github.com (use the same username you gave in your application)." },
        { text: "Install the GitHub CLI by following cli.github.com for your distro (Ubuntu: “sudo apt install gh”)." },
        { text: "Log in. Choose GitHub.com → HTTPS → “Login with a web browser”.", code: "gh auth login" },
      ],
    },
    verify: { code: "gh auth status", expect: "“Logged in to github.com account <you>”" },
    tip: "Students can get GitHub Copilot and other tools free through the GitHub Student Developer Pack (education.github.com/pack).",
  },

  node: {
    id: "node",
    name: "Node.js (LTS)",
    icon: "Node.js",
    what: "Lets you run JavaScript outside the browser. It comes with npm, which installs code libraries.",
    why: "React, Next.js, Express, Expo and their tooling all run on Node.js. npm is how you'll add every library to your project.",
    install: {
      mac: [{ text: "Download the “LTS” installer from nodejs.org and run it. (Or with Homebrew:)", code: "brew install node" }],
      windows: [{ text: "Download the “LTS” Windows installer (.msi) from nodejs.org and run it with the default options. Restart your terminal afterwards." }],
      linux: [
        { text: "Install nvm (Node Version Manager) using the command on github.com/nvm-sh/nvm, restart your terminal, then:" },
        { text: "Install the latest LTS version:", code: "nvm install --lts" },
      ],
    },
    verify: { code: "node -v && npm -v", expect: "Two version numbers, e.g. v22.x.x and 10.x.x" },
    tip: "Always pick the LTS (“long-term support”) version — it's the stable one that libraries are tested against.",
  },

  postgres: {
    id: "postgres",
    name: "PostgreSQL",
    icon: "PostgreSQL",
    what: "A relational database: it stores your app's data in tables that link to each other.",
    why: "Your project's users, records and relationships live here. It's the most widely used open-source database in production.",
    install: {
      mac: [
        { text: "Download Postgres.app from postgresapp.com, move it to Applications and open it." },
        { text: "Click “Initialize” to start a server. Follow the app's instructions to add its command-line tools to your PATH." },
      ],
      windows: [
        { text: "Download the installer from postgresql.org/download/windows (by EDB) and run it." },
        { text: "Set a password for the “postgres” user when asked and write it down — you'll need it in your connection string. Keep port 5432." },
      ],
      linux: [{ text: "Install and start PostgreSQL:", code: "sudo apt install postgresql && sudo systemctl start postgresql" }],
    },
    verify: { code: "psql --version", expect: "psql (PostgreSQL) 16.x or newer" },
    tip: "Your app connects with a URL like postgresql://postgres:YOUR_PASSWORD@localhost:5432/myapp. It goes in a .env file — never commit it.",
  },

  mongodb: {
    id: "mongodb",
    name: "MongoDB Atlas (free cloud database)",
    icon: "MongoDB",
    what: "A document database hosted in the cloud — nothing to install on your computer.",
    why: "Some backend projects store flexible, JSON-like documents. Atlas gives you a free cluster you can use from day one through deployment.",
    install: {
      all: [
        { text: "Sign up at mongodb.com/atlas and create a free (M0) cluster. Pick the region closest to you." },
        { text: "Under Database Access, create a database user with a password." },
        { text: "Under Network Access, add your current IP address (or 0.0.0.0/0 while learning)." },
        { text: "Click Connect → Drivers and copy the connection string. It looks like mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/myapp" },
      ],
    },
    tip: "Only set this up if your project uses MongoDB — your mentor will confirm in your 1:1. The connection string goes in .env.",
    optional: true,
  },

  docker: {
    id: "docker",
    name: "Docker Desktop",
    icon: "Docker",
    what: "Runs software in isolated “containers”, so it works the same on every computer.",
    why: "You'll run Redis (a fast cache) in a container during development, and package your API with Docker for deployment in week 4.",
    install: {
      mac: [{ text: "Download Docker Desktop from docker.com (choose Apple Silicon or Intel), install and open it." }],
      windows: [
        { text: "Download Docker Desktop from docker.com and run the installer. Keep “Use WSL 2” ticked." },
        { text: "Restart your computer when asked, then open Docker Desktop." },
      ],
      linux: [{ text: "Follow docs.docker.com/engine/install for your distro, then add yourself to the docker group so you don't need sudo." }],
    },
    verify: { code: "docker run --rm hello-world", expect: "“Hello from Docker!”" },
    tip: "Start Redis whenever you need it:\ndocker run -d --name redis -p 6379:6379 redis",
  },

  python: {
    id: "python",
    name: "Python 3",
    icon: "Python",
    what: "The programming language for your track. pip, its package installer, comes with it.",
    why: "All your code, notebooks and APIs are written in Python, and pip installs libraries like pandas, scikit-learn and FastAPI.",
    install: {
      mac: [{ text: "Download the latest Python 3 installer from python.org/downloads and run it. (Or with Homebrew:)", code: "brew install python" }],
      windows: [
        { text: "Download the latest Python 3 installer from python.org/downloads." },
        { text: "On the first screen, tick “Add python.exe to PATH” before clicking Install. This matters — without it, the terminal can't find Python." },
      ],
      linux: [{ text: "Python 3 is usually preinstalled. Add pip and venv support:", code: "sudo apt install python3 python3-pip python3-venv" }],
    },
    verify: { code: "python3 --version", expect: "Python 3.12 or newer (on Windows, use “python --version”)" },
    tip: "Every project gets its own virtual environment (a private folder of libraries). The setup steps below show how.",
  },

  jupyter: {
    id: "jupyter",
    name: "JupyterLab",
    icon: "Jupyter",
    what: "Notebooks that mix code, charts and notes in one document, running one cell at a time.",
    why: "Exploring data is trial and error. Notebooks let you run a step, look at the result, and keep a readable record of your analysis.",
    install: {
      all: [
        { text: "Inside your project's virtual environment (see the setup steps), install it with pip:", code: "pip install jupyterlab" },
        { text: "Start it from your project folder. It opens in your browser:", code: "jupyter lab" },
      ],
    },
    tip: "Prefer VS Code? Install the “Jupyter” extension and open any .ipynb file — same notebooks, inside your editor.",
  },

  java: {
    id: "java",
    name: "Java 21 (JDK)",
    icon: "Core Java",
    what: "The Java Development Kit: the compiler and runtime you need to build and run Java programs.",
    why: "Everything in your track — plain Java in weeks 1–2 and Spring Boot in week 3 — needs a JDK. 21 is the current long-term-support version.",
    install: {
      mac: [{ text: "Download “Temurin 21 (LTS)” from adoptium.net and run the .pkg installer. (Or with Homebrew:)", code: "brew install --cask temurin@21" }],
      windows: [
        { text: "Download “Temurin 21 (LTS)” .msi from adoptium.net and run it." },
        { text: "On the custom setup screen, enable “Set JAVA_HOME variable” and “Add to PATH”." },
      ],
      linux: [{ text: "Install OpenJDK 21:", code: "sudo apt install openjdk-21-jdk" }],
    },
    verify: { code: "java -version", expect: "openjdk version \"21…\"" },
  },

  intellij: {
    id: "intellij",
    name: "IntelliJ IDEA Community",
    what: "A free editor built specifically for Java, with smart autocomplete, refactoring and a debugger.",
    why: "It understands Maven and Spring Boot out of the box, which makes Java projects far easier to navigate than a general editor.",
    install: {
      all: [
        { text: "Download “IntelliJ IDEA Community Edition” (free) from jetbrains.com/idea and install it." },
        { text: "Students can also get the paid Ultimate edition free at jetbrains.com/community/education — optional." },
      ],
    },
    tip: "When you open a Maven project, IntelliJ downloads its libraries automatically. Wait for the progress bar at the bottom to finish.",
  },

  expo: {
    id: "expo",
    name: "Expo Go + Expo account",
    icon: "Expo",
    what: "Expo Go is a phone app that runs your React Native app instantly by scanning a QR code. An Expo account lets you build installable apps.",
    why: "You can test on your real phone from day one without installing Android Studio, and build your release APK with Expo in week 4.",
    install: {
      all: [
        { text: "Install “Expo Go” on your Android phone from the Play Store (or on iPhone from the App Store)." },
        { text: "Create a free account at expo.dev." },
        { text: "Make sure your phone and laptop are on the same Wi-Fi network — Expo Go connects over it." },
      ],
    },
    tip: "No phone handy? Install Android Studio and create an emulator — optional, and much heavier.",
  },

  figma: {
    id: "figma",
    name: "Figma",
    icon: "Figma",
    what: "The design tool you'll use for research boards, wireframes, UI design and clickable prototypes.",
    why: "It's the industry standard for product design, works in the browser, and lets your mentor comment directly on your frames.",
    install: {
      all: [
        { text: "Sign up free at figma.com. Students can apply for the free Education plan at figma.com/education." },
        { text: "Optional: install the desktop app from figma.com/downloads for better performance and local fonts." },
        { text: "Open a new FigJam board too — you'll use it for research notes and user flows." },
      ],
    },
  },

  powerbi: {
    id: "powerbi",
    name: "Power BI Desktop",
    icon: "Power BI",
    what: "Microsoft's free tool for building interactive dashboards.",
    why: "One option for your week 4 dashboard. It's widely used in analyst jobs, so it looks good on a resume.",
    install: {
      all: [
        { text: "Windows only: install “Power BI Desktop” free from the Microsoft Store." },
        { text: "On Mac or Linux, skip this — you'll build your dashboard with Streamlit instead, which works everywhere." },
      ],
    },
    optional: true,
  },

  ai: {
    id: "ai",
    name: "AI tools",
    what: "Claude (chat and code help), Cursor (an AI-powered editor) and GitHub Copilot (autocomplete inside your editor).",
    why: "You'll use AI the way real teams do — to plan, scaffold and debug faster. You must still understand and explain everything you submit.",
    install: {
      all: [
        { text: "Claude: sign up at claude.ai (free plan available)." },
        { text: "Cursor: download from cursor.com — it imports your VS Code settings. Free plan available." },
        { text: "GitHub Copilot: free for verified students via the GitHub Student Developer Pack, then install the “GitHub Copilot” extension in VS Code." },
      ],
    },
    tip: "Never paste passwords, API keys or .env files into an AI tool.",
  },
}
