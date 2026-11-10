import type { VsExtensions } from "@/data/docs/setup/common"
import type { WalkPart } from "@/data/docs/types"

/*
 * Track-specific tools: Python, Docker, Java, Expo, MongoDB Atlas and
 * Power BI. Screen ids live in components/docs/screens/tools.tsx.
 */

/* ------------------------------------------------------------------ */
/* VS Code extensions per stack                                        */
/* ------------------------------------------------------------------ */

export const webExtensions: VsExtensions = {
  why: "Extensions add features to VS Code. ESLint underlines mistakes as you type, and Prettier tidies your code every time you save.",
  first: { name: "ESLint", by: "Microsoft" },
  rest: "Prettier - Code formatter (by Prettier)",
  screen: "vscode-extensions",
}

export const nextExtensions: VsExtensions = {
  ...webExtensions,
  why: "Extensions add features to VS Code. ESLint underlines mistakes as you type, Prettier tidies your code every time you save, and Tailwind CSS IntelliSense suggests class names as you type them.",
  rest: "Prettier - Code formatter (by Prettier) and Tailwind CSS IntelliSense (by Tailwind Labs)",
}

export const apiExtensions: VsExtensions = {
  ...webExtensions,
  why: "Extensions add features to VS Code. ESLint underlines mistakes as you type, Prettier tidies your code every time you save, and Prisma colours your database file so it's readable.",
  rest: "Prettier - Code formatter (by Prettier) and Prisma (by Prisma)",
}

export const pythonExtensions = (jupyter: boolean): VsExtensions => ({
  why: jupyter
    ? "Extensions add features to VS Code. Python runs and checks your code, Jupyter opens notebooks inside VS Code, and Ruff points out mistakes and tidies your code."
    : "Extensions add features to VS Code. Python runs and checks your code, and Ruff points out mistakes and tidies your code.",
  first: { name: "Python", by: "Microsoft" },
  rest: jupyter ? "Jupyter (by Microsoft) and Ruff (by Astral Software)" : "Ruff (by Astral Software)",
  screen: "vscode-extensions-python",
})

export const javaExtensions: VsExtensions = {
  why: "Extensions add features to VS Code. The Java pack understands Java and Maven, runs and debugs your code; the Spring Boot pack adds help for Spring.",
  first: { name: "Extension Pack for Java", by: "Microsoft" },
  rest: "Spring Boot Extension Pack (by VMware)",
  screen: "vscode-extensions-java",
}

/* ------------------------------------------------------------------ */
/* Python                                                              */
/* ------------------------------------------------------------------ */

export const pythonPart: WalkPart = {
  id: "python",
  title: "Install Python",
  time: "10 min",
  intro:
    "Python is the language you'll write everything in. It comes with pip, which downloads the libraries your project uses — like pandas, scikit-learn and FastAPI.",
  steps: [
    {
      title: "Download Python",
      os: ["mac"],
      actions: [{ text: "Go to python.org/downloads" }, { text: "Click the yellow Download Python 3 button (1). A file ending in .pkg downloads." }],
      screen: "py-mac-download",
    },
    {
      title: "Install it",
      os: ["mac"],
      actions: [
        { text: "Open the .pkg file from your Downloads folder." },
        { text: "Click Continue (1) on each screen, Agree to the licence, then Install. Type your Mac password when asked." },
        { text: "When it finishes, a Finder window opens — you can close it. Click Close in the installer." },
      ],
      screen: "py-mac-installer",
    },
    {
      title: "Download Python",
      os: ["windows"],
      actions: [
        { text: "Go to python.org/downloads/windows" },
        { text: "Under the newest Python 3 release, click Download Windows installer (64-bit) (1)." },
      ],
      screen: "py-win-download",
    },
    {
      title: "Tick “Add python.exe to PATH” and install",
      os: ["windows"],
      why: "This is the one box people miss. Without it, the terminal can't find Python and every command fails.",
      actions: [
        { text: "Open the file from your Downloads folder." },
        { text: "At the bottom of the first screen, tick Add python.exe to PATH (1)." },
        { text: "Click Install Now (2), and Yes if Windows asks. When it says Setup was successful, click Close." },
      ],
      screen: "py-win-installer",
    },
    {
      title: "Allow scripts in PowerShell",
      os: ["windows"],
      why: "Your project's Python environment is switched on by a small script. Windows blocks scripts in PowerShell by default, so you allow your own.",
      actions: [
        { text: "Close VS Code completely (File → Exit) and open it again, then open a terminal (Terminal → New Terminal)." },
        { text: "Run:", code: "Set-ExecutionPolicy -Scope CurrentUser RemoteSigned" },
        { text: "If it asks Do you want to change the execution policy?, type Y (1) and press Enter. If nothing is printed, that's fine too." },
      ],
      screen: "py-win-policy",
    },
    {
      title: "Install Python",
      os: ["linux"],
      why: "Ubuntu comes with Python, but not the parts that create project environments.",
      actions: [{ text: "In VS Code's terminal, run:", code: "sudo apt install -y python3 python3-pip python3-venv" }],
      screen: "py-linux",
    },
    {
      title: "Check Python works",
      actions: [
        { os: ["mac"], text: "Quit VS Code completely (Cmd + Q) and open it again, then open a terminal (Terminal → New Terminal)." },
        { os: ["mac", "linux"], text: "Run:", code: "python3 --version" },
        { os: ["windows"], text: "Run:", code: "python --version" },
      ],
      screen: "py-version",
      check: [{ text: "It prints Python 3 followed by a version (1). Anything from 3.12 up is fine." }],
      warn: "On Windows, if typing python opens the Microsoft Store instead, “Add python.exe to PATH” wasn't ticked. Run the installer again, choose Modify → Next, tick “Add Python to environment variables”, and click Install.",
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Docker                                                              */
/* ------------------------------------------------------------------ */

export const dockerPart: WalkPart = {
  id: "docker",
  title: "Install Docker",
  time: "15 min",
  intro:
    "Docker runs software in sealed boxes called containers, so it works the same on every computer. You'll use it to run Redis (a super-fast cache) without installing it, and in week 4 to package your API.",
  steps: [
    {
      title: "Download Docker Desktop",
      os: ["mac", "windows"],
      actions: [
        { text: "Go to docker.com/products/docker-desktop" },
        { os: ["mac"], text: "Click Download Docker Desktop and choose Download for Mac – Apple Silicon (1). (Older Intel Mac? Choose Intel Chip.)" },
        { os: ["windows"], text: "Click Download Docker Desktop and choose Download for Windows – AMD64 (1)." },
      ],
      screen: "docker-download",
    },
    {
      title: "Move it into Applications",
      os: ["mac"],
      actions: [
        { text: "Open Docker.dmg from your Downloads folder." },
        { text: "Drag the Docker whale (1) onto Applications (2)." },
        { text: "Open Docker from Applications. Click Open if macOS asks whether you're sure." },
      ],
      screen: "docker-mac-drag",
    },
    {
      title: "Install it",
      os: ["windows"],
      why: "WSL 2 is a small Linux system built into Windows. Docker runs its containers inside it.",
      actions: [
        { text: "Open the installer from your Downloads folder and click Yes if Windows asks." },
        { text: "Keep Use WSL 2 instead of Hyper-V (recommended) ticked (1) and click OK (2)." },
        { text: "When it finishes, click Close and restart (or restart your computer yourself)." },
      ],
      screen: "docker-win-config",
      warn: "If Docker says WSL needs updating after the restart, open PowerShell from the Start menu, run wsl --update, then open Docker Desktop again.",
    },
    {
      title: "Finish the first start",
      os: ["mac", "windows"],
      actions: [
        { text: "Docker Desktop opens. Click Accept on the subscription agreement — it's free for personal and learning use." },
        { text: "If it asks you to sign in or answer a survey, click Skip." },
        { text: "Wait until the bottom-left corner says Engine running (1)." },
      ],
      screen: "docker-running",
      note: "Docker Desktop must be open whenever you use Docker. Leave it running in the background while you work.",
    },
    {
      title: "Install Docker",
      os: ["linux"],
      actions: [
        {
          text: "In VS Code's terminal, run these one at a time. The first downloads Docker's official install script, the second runs it:",
          code: "curl -fsSL https://get.docker.com -o get-docker.sh\nsudo sh get-docker.sh",
        },
        { text: "Let your user run Docker without sudo:", code: "sudo usermod -aG docker $USER" },
        { text: "Log out of your computer and back in, so the change takes effect." },
      ],
      screen: "docker-linux",
    },
    {
      title: "Check Docker works",
      actions: [
        { text: "In VS Code's terminal, run:", code: "docker run --rm hello-world" },
        { text: "It downloads a tiny test container and runs it. That takes a few seconds the first time." },
      ],
      screen: "docker-hello",
      check: [{ text: "It prints Hello from Docker! (1)." }],
      warn: "“Cannot connect to the Docker daemon” means Docker Desktop isn't open. Open it, wait for Engine running, and try again.",
    },
  ],
}

/* ------------------------------------------------------------------ */
/* MongoDB Atlas (optional)                                            */
/* ------------------------------------------------------------------ */

export const mongoPart: WalkPart = {
  id: "mongodb",
  title: "Only if your project uses MongoDB",
  time: "10 min",
  intro:
    "Most backend projects use PostgreSQL. Your mentor tells you in your 1:1 if yours uses MongoDB instead — skip this part unless they do. MongoDB Atlas is a free database in the cloud, so there's nothing to install.",
  steps: [
    {
      title: "Create a free cluster",
      actions: [
        { text: "Sign up at mongodb.com/cloud/atlas/register (signing up with Google is fine)." },
        { text: "When it offers a cluster, choose Free (1), pick the region closest to you, and click Create Deployment (2)." },
      ],
      screen: "mongo-cluster",
    },
    {
      title: "Create a database user",
      why: "Your app logs in to the database with this username and password.",
      actions: [
        {
          text: "It asks you to create a database user. Keep the username, click Autogenerate Secure Password, and copy the password (1) somewhere safe.",
        },
        { text: "Click Create Database User (2)." },
      ],
      screen: "mongo-user",
    },
    {
      title: "Copy your connection string",
      actions: [
        { text: "Click Choose a connection method → Drivers." },
        { text: "Copy the connection string (1). It looks like mongodb+srv://USER:<db_password>@cluster0.abcde.mongodb.net/" },
        { text: "Replace <db_password> with the password you copied. You'll paste the result into your .env file later." },
      ],
      screen: "mongo-connect",
      warn: "This string contains your password. It only ever goes in .env — never in your code, never in a commit.",
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Java                                                                */
/* ------------------------------------------------------------------ */

export const jdkPart: WalkPart = {
  id: "jdk",
  title: "Install Java",
  time: "10 min",
  intro:
    "The JDK (Java Development Kit) turns your Java code into a running program. You'll install Temurin 21 — a free, standard build of Java 21, the long-term-support version.",
  steps: [
    {
      title: "Download Temurin 21",
      os: ["mac", "windows"],
      actions: [
        { text: "Go to adoptium.net/temurin/releases/?version=21" },
        { os: ["mac"], text: "Make sure it shows macOS and your chip (aarch64 for Apple Silicon, x64 for Intel), then click the .pkg button (1)." },
        { os: ["windows"], text: "Make sure it shows Windows and x64, then click the .msi button (1)." },
      ],
      screen: "jdk-download",
    },
    {
      title: "Install it",
      os: ["mac"],
      actions: [
        { text: "Open the .pkg file from your Downloads folder." },
        { text: "Click Continue (1), Continue, Install, and type your Mac password when asked. Click Close at the end." },
      ],
      screen: "jdk-mac-installer",
    },
    {
      title: "Turn on JAVA_HOME and install",
      os: ["windows"],
      why: "JAVA_HOME tells other tools, like Maven, where Java lives. It's off by default, and Spring Boot's build tool needs it.",
      actions: [
        { text: "Open the .msi file from your Downloads folder and click Next, accept the licence, and click Next." },
        { text: "On Custom Setup, click the red ✕ next to Set JAVA_HOME variable (1) and choose Will be installed on local hard drive." },
        { text: "Make sure Add to PATH is also set to install. Click Next (2), then Install (and Yes if Windows asks), then Finish." },
      ],
      screen: "jdk-win-setup",
    },
    {
      title: "Install Java",
      os: ["linux"],
      actions: [{ text: "In VS Code's terminal, run:", code: "sudo apt install -y openjdk-21-jdk" }],
      screen: "jdk-linux",
    },
    {
      title: "Check Java works",
      actions: [
        { os: ["mac"], text: "Quit VS Code completely (Cmd + Q) and open it again, then open a terminal (Terminal → New Terminal)." },
        { os: ["windows"], text: "Close VS Code completely (File → Exit) and open it again, then open a terminal (Terminal → New Terminal)." },
        { text: "Run:", code: "java -version" },
      ],
      screen: "jdk-version",
      check: [{ text: 'The first line says openjdk version "21 (1). Any 21.x number is fine.' }],
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Expo                                                                */
/* ------------------------------------------------------------------ */

export const expoPart: WalkPart = {
  id: "expo",
  title: "Get Expo Go on your phone",
  time: "5 min",
  intro:
    "Expo Go is a phone app that runs the app you're building, straight from your laptop, every time you save. No cables and no Android Studio. You'll also make a free Expo account for building the installable app in week 4.",
  steps: [
    {
      title: "Install Expo Go",
      actions: [
        { text: "Android: open the Play Store, search Expo Go and tap Install (1)." },
        { text: "iPhone: open the App Store, search Expo Go and tap Get (2)." },
      ],
      screen: "expo-store",
    },
    {
      title: "Create an Expo account",
      actions: [
        { text: "On your laptop, go to expo.dev/signup" },
        { text: "Enter your email, a username and a password (1), then click Sign up (2). Confirm your email from the message Expo sends." },
      ],
      screen: "expo-signup",
    },
    {
      title: "Use the same Wi-Fi",
      why: "Expo Go loads your app from your laptop over Wi-Fi, so both must be on the same network.",
      actions: [
        { text: "Connect your phone and your laptop to the same Wi-Fi network." },
        { text: "College or office Wi-Fi sometimes blocks this. If the app won't load later, use your phone's hotspot for the laptop instead." },
      ],
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Power BI (optional, Windows)                                        */
/* ------------------------------------------------------------------ */

export const powerBiPart: WalkPart = {
  id: "powerbi",
  title: "Optional: Power BI Desktop",
  time: "5 min",
  intro:
    "Power BI is one way to build your week 4 dashboard, and it's common in analyst jobs. It only runs on Windows — on a Mac or Linux you'll build your dashboard with Streamlit instead, which you've already installed.",
  steps: [
    {
      title: "Install it from the Microsoft Store",
      os: ["windows"],
      actions: [
        { text: "Open the Microsoft Store from the Start menu, search Power BI Desktop, and click Get (1)." },
        { text: "Open it once from the Start menu. If it asks you to sign in, you can close that box." },
      ],
      screen: "powerbi-store",
    },
    {
      title: "Nothing to install",
      os: ["mac", "linux"],
      actions: [{ text: "Power BI doesn't run on your computer. You'll make your dashboard with Streamlit — you'll see how in week 4." }],
    },
  ],
}
