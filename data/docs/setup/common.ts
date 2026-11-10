import type { WalkPart, WalkStep } from "@/data/docs/types"

/*
 * Setup parts every code track shares: the workspace folder, VS Code, Git,
 * GitHub, Node.js, PostgreSQL and AI tools. Each track's setup is these
 * plus its own tools and project (data/docs/setup/*.ts).
 *
 * Numbers like (1) in the text match the red markers in the pictures
 * (components/docs/screens/*). Windows commands must work in Windows
 * PowerShell 5.1: one command per line, no "&&", no touch/export.
 */

/** The VS Code extensions a track installs, and the screen showing the first one. */
export type VsExtensions = {
  why: string
  first: { name: string; by: string }
  rest: string
  screen: string
}

export function extensionsStep({ why, first, rest, screen }: VsExtensions): WalkStep {
  return {
    title: "Install your extensions",
    why,
    actions: [
      { text: "Click the Extensions icon in the left-hand bar — it looks like four small squares (1)." },
      { os: ["mac"], text: "(Shortcut: Cmd + Shift + X.)" },
      { os: ["windows", "linux"], text: "(Shortcut: Ctrl + Shift + X.)" },
      { text: `Type ${first.name} in the search box (2) and click the blue Install button (3) on ${first.name} by ${first.by}.` },
      { text: `Do the same for ${rest}.` },
    ],
    screen,
  }
}

export const workspacePart: WalkPart = {
  id: "workspace",
  title: "Make your workspace folder",
  time: "2 min",
  intro:
    "Before installing anything, make one folder to hold everything you build in this program. Keeping it all in one place means you'll always know where your work is.",
  steps: [
    {
      title: "Open your home folder",
      os: ["mac", "windows"],
      why: "Your home folder is the folder named after you. It's the easiest place to find things again.",
      actions: [
        { os: ["mac"], text: "Click the Finder icon (the blue-and-white face) in the Dock at the bottom of your screen." },
        {
          os: ["mac"],
          text: "In the left sidebar, click your name (1) — that's your home folder. (Don't see it? In the menu bar at the very top, click Go → Home.)",
        },
        { os: ["windows"], text: "Press the Windows key and E together. File Explorer opens." },
        {
          os: ["windows"],
          text: "Click inside the address bar at the top (1), type %USERPROFILE% and press Enter. You're now in C:\\Users\\YourName — your home folder.",
        },
      ],
      screen: "folder-home",
      check: [{ text: "You can see folders like Desktop, Documents and Downloads." }],
    },
    {
      title: "Create a new folder",
      os: ["mac", "windows"],
      actions: [
        { os: ["mac"], text: "Right-click (or hold Control and click) an empty white area of the window (1)." },
        { os: ["mac"], text: "Choose New Folder (2)." },
        { os: ["windows"], text: "Right-click an empty white area of the window." },
        { os: ["windows"], text: "Point to New (1), then click Folder (2)." },
      ],
      screen: "folder-new",
    },
    {
      title: "Name it devvy",
      os: ["mac", "windows"],
      why: "Use exactly devvy — all lowercase, no spaces. Spaces in folder names break many terminal commands later.",
      actions: [{ text: "The new folder's name is already selected. Type devvy (1) and press Enter." }],
      screen: "folder-named",
      check: [{ text: "A folder called devvy sits in your home folder." }],
    },
    {
      title: "Create the devvy folder",
      os: ["linux"],
      why: "Use exactly devvy — all lowercase, no spaces. Spaces in folder names break many terminal commands later.",
      actions: [
        { text: "Press Ctrl + Alt + T to open a terminal." },
        { text: "Type this and press Enter. It makes a folder called devvy in your home folder:", code: "mkdir ~/devvy" },
      ],
      screen: "folder-linux",
    },
  ],
}

export function vscodePart(extensions: VsExtensions): WalkPart {
  return {
    id: "vscode",
    title: "Install VS Code",
    time: "10 min",
    intro:
      "VS Code is the code editor you'll use for everything: writing code, running commands in its built-in terminal, and saving your work to GitHub.",
    steps: [
      {
        title: "Download VS Code",
        actions: [
          { text: "Open your web browser and go to code.visualstudio.com/download" },
          { os: ["mac"], text: "Click the big Mac button (1). A file called VSCode-darwin-universal.zip downloads." },
          { os: ["windows"], text: "Click the big Windows button (1). A file whose name starts with VSCodeUserSetup downloads." },
          { os: ["linux"], text: "Click the .deb button (1) — that's the one for Ubuntu and Debian." },
        ],
        screen: "vscode-download",
      },

      // macOS
      {
        title: "Move VS Code into Applications",
        os: ["mac"],
        why: "Mac apps belong in the Applications folder. Running one straight from Downloads causes problems with updates later.",
        actions: [
          { text: "Open Finder and click Downloads in the sidebar." },
          { text: "If you see VSCode-darwin-universal.zip, double-click it to unzip. You'll get Visual Studio Code with a blue icon." },
          { text: "Drag Visual Studio Code (1) onto Applications (2) in the sidebar and let go." },
        ],
        screen: "vscode-mac-drag",
      },
      {
        title: "Open VS Code for the first time",
        os: ["mac"],
        actions: [
          { text: "Click Applications in the Finder sidebar and double-click Visual Studio Code." },
          { text: "macOS asks whether you're sure you want to open an app downloaded from the internet. Click Open (1)." },
        ],
        screen: "vscode-mac-gatekeeper",
        note: "You only see this question the very first time.",
      },

      // Windows
      {
        title: "Start the installer and accept the licence",
        os: ["windows"],
        actions: [
          { text: "Open your Downloads folder and double-click the VSCodeUserSetup file." },
          { text: "Choose I accept the agreement (1), then click Next (2)." },
        ],
        screen: "vscode-win-license",
        note: "If Windows asks “Do you want to allow this app to make changes to your device?”, click Yes.",
      },
      {
        title: "Keep the default location",
        os: ["windows"],
        actions: [
          { text: "On Select Destination Location, don't change anything. Click Next (1)." },
          { text: "On Select Start Menu Folder, don't change anything either. Click Next." },
        ],
        screen: "vscode-win-location",
      },
      {
        title: "Tick the extra options",
        os: ["windows"],
        why: "“Add to PATH” lets you start VS Code from a terminal. The two “Open with Code” options add a handy right-click shortcut to folders.",
        actions: [
          { text: "On Select Additional Tasks, tick every box under Other (1). “Add to PATH” is ticked already — leave it ticked." },
          { text: "Click Next (2), then click Install on the Ready to Install screen." },
        ],
        screen: "vscode-win-tasks",
      },
      {
        title: "Finish and launch",
        os: ["windows"],
        actions: [{ text: "When it's done, leave Launch Visual Studio Code ticked (1) and click Finish (2)." }],
        screen: "vscode-win-finish",
      },

      // Linux
      {
        title: "Install the .deb file",
        os: ["linux"],
        actions: [
          {
            text: "Open a terminal with Ctrl + Alt + T and run these two commands, one at a time:",
            code: "cd ~/Downloads\nsudo apt install ./code_*.deb",
          },
          { text: "Type your computer password when asked and press Enter. Nothing appears while you type a password — that's normal." },
          { text: "When it's done, open Visual Studio Code from your app menu." },
        ],
        screen: "vscode-linux-install",
      },

      {
        title: "Open your devvy folder",
        why: "VS Code works on one folder at a time. Opening devvy means everything you do — including the terminal — happens inside it.",
        actions: [
          { text: "VS Code opens on the Welcome page. If a Chat panel appears on the right, you can close it with its X." },
          { text: "Under Start, click Open Folder… (1)." },
        ],
        screen: "vscode-welcome",
      },
      {
        title: "Choose devvy",
        actions: [
          {
            os: ["mac"],
            text: "In the window that appears, click your name in the sidebar (1), click devvy once to select it (2), then click Open (3).",
          },
          {
            os: ["windows"],
            text: "In the window that appears, go to your home folder (C: › Users › YourName), click devvy once to select it (1), then click Select Folder (2).",
          },
          { os: ["linux"], text: "In the window that appears, click devvy once to select it (1), then click Open (2)." },
        ],
        screen: "vscode-pick-devvy",
      },
      {
        title: "Trust the folder",
        why: "VS Code asks this to protect you from code downloaded from strangers. This is your own empty folder, so it's safe.",
        actions: [{ text: "Click Yes, I trust the authors (1)." }],
        screen: "vscode-trust",
        check: [{ text: "The Explorer on the left now shows DEVVY at the top." }],
      },
      extensionsStep(extensions),
      {
        title: "Open the terminal",
        why: "The terminal is a place to type commands instead of clicking. From here on, almost every step is a command you copy from these docs and paste into it.",
        actions: [
          { os: ["mac"], text: "In the menu bar at the very top of your screen, click Terminal (1), then New Terminal (2)." },
          { os: ["windows", "linux"], text: "In VS Code's menu bar, click Terminal (1), then New Terminal (2)." },
          { text: "A panel opens at the bottom of VS Code. That's your terminal." },
        ],
        screen: "vscode-new-terminal",
      },
      {
        title: "Try your first commands",
        why: "The terminal always works inside one folder. Because you opened devvy, that's where this terminal starts.",
        actions: [
          { text: "Click inside the terminal panel so the cursor blinks there." },
          {
            text: "Every command box in these docs has a copy button in its corner. Copy this command, paste it into the terminal, and press Enter. It prints the folder you're in:",
            code: "pwd",
          },
          { os: ["mac"], text: "Paste with Cmd + V." },
          { os: ["windows"], text: "Paste with Ctrl + V (or right-click)." },
          { os: ["linux"], text: "Paste with Ctrl + Shift + V." },
          { text: "Now list what's inside the folder. It's empty, so nothing is listed yet:", code: "ls" },
        ],
        screen: "vscode-first-commands",
        check: [{ text: "pwd printed a path ending in devvy (1)." }],
        note: "Two habits for the rest of setup: paste commands exactly as shown, and wait until the prompt comes back before typing the next one.",
      },
    ],
  }
}

export const gitPart: WalkPart = {
  id: "git",
  title: "Install Git",
  time: "5–30 min",
  intro:
    "Git saves snapshots of your project so you can always go back, and it's how you'll send work to your mentor. You'll learn how to use it in How we work — for now, just install it.",
  steps: [
    // macOS
    {
      title: "Ask your Mac for Git",
      os: ["mac"],
      actions: [
        { text: "In VS Code's terminal, run:", code: "git --version" },
        {
          text: "Macs don't include Git until you install Apple's “command line developer tools”, so a box pops up offering to install them. Click Install (1), then Agree.",
        },
        { text: "If you see a version number like git version 2.39.5 instead, Git is already installed — skip ahead to Tell Git who you are." },
      ],
      screen: "git-mac-prompt",
    },
    {
      title: "Wait for the install to finish",
      os: ["mac"],
      actions: [
        { text: "It downloads about 1 GB, so this can take 10–30 minutes. Leave it running." },
        { text: "When it says The software was installed, click Done (1)." },
      ],
      screen: "git-mac-installing",
    },

    // Windows
    {
      title: "Download Git for Windows",
      os: ["windows"],
      actions: [
        { text: "In your browser, go to git-scm.com/downloads/win" },
        { text: "Click Click here to download (1). A file whose name starts with Git- and ends in 64-bit.exe downloads." },
      ],
      screen: "git-win-download",
    },
    {
      title: "Start the installer",
      os: ["windows"],
      actions: [
        { text: "Open the file from your Downloads folder and click Yes if Windows asks for permission." },
        {
          text: "Click Next (1) on the first screens — Information, Select Destination Location, Select Components and Select Start Menu Folder — without changing anything.",
        },
      ],
      screen: "git-win-start",
    },
    {
      title: "Choose VS Code as Git's editor",
      os: ["windows"],
      why: "Sometimes Git needs you to type a message. Without this, it opens an old editor called Vim that's notoriously hard to exit.",
      actions: [
        { text: "On Choosing the default editor used by Git, open the dropdown and choose Use Visual Studio Code as Git's default editor (1)." },
        { text: "Click Next (2)." },
      ],
      screen: "git-win-editor",
    },
    {
      title: "Name the first branch main",
      os: ["windows"],
      why: "GitHub calls a project's main line of work main. This keeps your computer and GitHub using the same name.",
      actions: [
        { text: "On Adjusting the name of the initial branch in new repositories, choose Override the default branch name (1)." },
        { text: "Make sure the box below says main (2), then click Next (3)." },
      ],
      screen: "git-win-branch",
    },
    {
      title: "Keep the recommended options and install",
      os: ["windows"],
      actions: [
        { text: "On Adjusting your PATH environment, leave the (Recommended) option selected (1) and click Next." },
        { text: "On every remaining screen, don't change anything — just click Next, then Install." },
        { text: "At the end, untick View Release Notes and click Finish." },
      ],
      screen: "git-win-path",
    },
    {
      title: "Restart VS Code",
      os: ["windows"],
      why: "A terminal only finds newly installed programs when it starts. If you skip this, the next step says git isn't recognised.",
      actions: [
        { text: "In VS Code, click File (1) → Exit (2) to close it completely." },
        { text: "Open VS Code again from the Start menu. It reopens your devvy folder." },
        { text: "Open a terminal again: Terminal → New Terminal." },
      ],
      screen: "vscode-exit",
    },

    // Linux
    {
      title: "Install Git",
      os: ["linux"],
      actions: [
        { text: "In VS Code's terminal, run these one at a time (type your password when asked):", code: "sudo apt update\nsudo apt install -y git" },
      ],
      screen: "git-linux",
    },

    {
      title: "Check Git works",
      actions: [{ text: "Run:", code: "git --version" }],
      screen: "git-version",
      check: [{ text: "It prints a version (1), like git version 2.47.1 — any 2.x number is fine." }],
    },
    {
      title: "Tell Git who you are",
      why: "Every snapshot you save is labelled with your name and email, so your mentor knows who did what.",
      actions: [
        {
          text: "Run these one at a time. Replace Asha Rao with your name, and the email with the one you'll use to sign up to GitHub in the next part:",
          code: 'git config --global user.name "Asha Rao"\ngit config --global user.email "asha@example.com"\ngit config --global init.defaultBranch main',
        },
        { text: "Nothing prints after these — in the terminal, no news is good news. Check what you set:", code: "git config --global --list" },
      ],
      screen: "git-config",
      check: [{ text: "You see your name, email and init.defaultbranch=main (1)." }],
    },
  ],
}

export const githubPart: WalkPart = {
  id: "github",
  title: "Set up GitHub",
  time: "10 min",
  intro:
    "GitHub is the website that stores your code online — your mentor reviews your work there, and it becomes your portfolio. The GitHub CLI (gh) is a small tool that lets your terminal talk to your GitHub account.",
  steps: [
    {
      title: "Create a GitHub account",
      actions: [
        { text: "Go to github.com/signup" },
        {
          text: "Enter the same email you gave Git, choose a password, and pick a username (1). Use the GitHub username you put in your Devvy application.",
        },
        { text: "Click Continue (2), solve the short puzzle, then type in the code GitHub emails you." },
      ],
      screen: "github-signup",
      note: "Already have a GitHub account? Just sign in at github.com and carry on.",
    },
    {
      title: "Download the GitHub CLI",
      os: ["mac", "windows"],
      actions: [
        { text: "Go to cli.github.com" },
        { os: ["mac"], text: "Click Download for Mac (1). A file ending in .pkg downloads." },
        { os: ["windows"], text: "Click Download for Windows (1). A file ending in .msi downloads." },
      ],
      screen: "gh-download",
    },
    {
      title: "Install it",
      os: ["mac"],
      actions: [
        { text: "Open the .pkg file from your Downloads folder." },
        { text: "Click Continue (1) on each screen, then Install, and type your Mac password when asked. Click Close at the end." },
      ],
      screen: "gh-mac-installer",
    },
    {
      title: "Install it",
      os: ["windows"],
      actions: [
        { text: "Open the .msi file from your Downloads folder." },
        { text: "Click Next (1), Next, then Install (click Yes if Windows asks), then Finish." },
        {
          text: "Close VS Code completely (File → Exit) and open it again, so its terminal can find the new gh command. Then open a terminal: Terminal → New Terminal.",
        },
      ],
      screen: "gh-win-installer",
    },
    {
      title: "Install it",
      os: ["linux"],
      actions: [{ text: "In VS Code's terminal, run:", code: "sudo apt install -y gh" }],
      screen: "gh-linux",
    },
    {
      title: "Log in from the terminal",
      actions: [
        { text: "Run:", code: "gh auth login" },
        { text: "It asks four questions. Use the arrow keys to move and Enter to choose:" },
        {
          text: "Where do you use GitHub? → GitHub.com\nWhat is your preferred protocol for Git operations? → HTTPS\nAuthenticate Git with your GitHub credentials? → Y (Yes)\nHow would you like to authenticate GitHub CLI? → Login with a web browser",
        },
        { text: "It then shows a one-time code (1), like ABCD-1234. Copy it, then press Enter. Your browser opens." },
      ],
      screen: "gh-auth-login",
    },
    {
      title: "Enter the code in your browser",
      actions: [
        { text: "On the Device Activation page, paste the code (1) and click Continue (2)." },
        { text: "If GitHub asks you to sign in first, do that, then you'll land back here." },
      ],
      screen: "gh-device",
    },
    {
      title: "Authorize the GitHub CLI",
      actions: [{ text: "Click Authorize github (1)." }, { text: "When you see Congratulations, you're all set!, go back to VS Code." }],
      screen: "gh-authorize",
    },
    {
      title: "Check you're logged in",
      actions: [{ text: "Run:", code: "gh auth status" }],
      screen: "gh-status",
      check: [{ text: "It says Logged in to github.com account followed by your username (1)." }],
    },
  ],
}

/** usedFor: one sentence on what Node.js runs in this track. */
export function nodePart(usedFor: string): WalkPart {
  return {
    id: "node",
    title: "Install Node.js",
    time: "10 min",
    intro: `Node.js runs JavaScript on your computer, outside the browser. ${usedFor} It comes with npm, which downloads the code libraries your project uses.`,
    steps: [
      {
        title: "Download Node.js",
        os: ["mac", "windows"],
        actions: [
          { text: "Go to nodejs.org/en/download" },
          {
            text: "Make sure the version marked LTS is selected (1). LTS means “long-term support” — the stable version everything is tested against.",
          },
          { os: ["mac"], text: "Click macOS Installer (.pkg) (2)." },
          { os: ["windows"], text: "Click Windows Installer (.msi) (2)." },
        ],
        screen: "node-download",
      },
      {
        title: "Install it",
        os: ["mac"],
        actions: [
          { text: "Open the .pkg file from your Downloads folder." },
          { text: "Click Continue (1), Continue, Agree, then Install. Type your Mac password when asked, then click Close." },
        ],
        screen: "node-mac-installer",
      },
      {
        title: "Start the installer",
        os: ["windows"],
        actions: [
          { text: "Open the .msi file from your Downloads folder." },
          {
            text: "Click Next, tick I accept the terms in the License Agreement (1), click Next (2), then Next on the next two screens without changing anything.",
          },
        ],
        screen: "node-win-license",
      },
      {
        title: "Leave “Tools for Native Modules” unticked",
        os: ["windows"],
        why: "This option downloads several gigabytes of extra build tools you don't need, and it can take over an hour.",
        actions: [
          { text: "On Tools for Native Modules, leave the box unticked (1). Click Next (2)." },
          { text: "Click Install (and Yes if Windows asks), then Finish." },
        ],
        screen: "node-win-tools",
      },
      {
        title: "Install Node.js with nvm",
        os: ["linux"],
        why: "nvm installs the right Node.js version without needing your password, and makes it easy to update later.",
        actions: [
          { text: "In VS Code's terminal, run:", code: "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash" },
          {
            text: "Close the terminal (the bin icon in the terminal panel), open a new one (Terminal → New Terminal), then run:",
            code: "nvm install --lts",
          },
        ],
        screen: "node-linux",
      },
      {
        title: "Allow npm to run in PowerShell",
        os: ["windows"],
        why: "Windows blocks script files in PowerShell by default, and npm uses one. Without this, every npm command fails with “running scripts is disabled on this system”.",
        actions: [
          { text: "Close VS Code completely (File → Exit) and open it again, then open a terminal (Terminal → New Terminal)." },
          { text: "Run:", code: "Set-ExecutionPolicy -Scope CurrentUser RemoteSigned" },
          {
            text: "If it asks Do you want to change the execution policy?, type Y (1) and press Enter. If nothing is printed at all, that's fine too.",
          },
        ],
        screen: "node-win-policy",
      },
      {
        title: "Check Node.js and npm",
        actions: [
          { os: ["mac"], text: "Quit VS Code completely (Cmd + Q) and open it again, then open a terminal (Terminal → New Terminal)." },
          { text: "Run these two commands:", code: "node -v\nnpm -v" },
        ],
        screen: "node-version",
        check: [{ text: "You see two version numbers (1) — node starts with v, like v24.11.1. The exact numbers don't matter." }],
      },
    ],
  }
}

export const postgresPart: WalkPart = {
  id: "postgres",
  title: "Install PostgreSQL",
  time: "10 min",
  intro:
    "PostgreSQL is the database that will store your app's data — users, records, everything. It runs quietly in the background on your computer.",
  steps: [
    // macOS
    {
      title: "Download Postgres.app",
      os: ["mac"],
      why: "Postgres.app is the simplest way to run PostgreSQL on a Mac: one app, no configuration.",
      actions: [{ text: "Go to postgresapp.com/downloads.html" }, { text: "Click the first Download link (1) — the newest version." }],
      screen: "pg-mac-download",
    },
    {
      title: "Move it into Applications and open it",
      os: ["mac"],
      actions: [
        { text: "Open the downloaded .dmg file. A window appears." },
        { text: "Drag the Postgres elephant (1) onto Applications (2)." },
        { text: "Open Postgres from your Applications folder. Click Open if macOS asks whether you're sure." },
      ],
      screen: "pg-mac-drag",
    },
    {
      title: "Start the database server",
      os: ["mac"],
      actions: [{ text: "Click Initialize (1). After a moment it says Running and shows a few database icons." }],
      screen: "pg-mac-initialize",
      note: "On a Mac, your database username is your Mac username and there's no password — you'll use that in a later step. Keep Postgres.app running while you work.",
    },

    // Windows
    {
      title: "Download the installer",
      os: ["windows"],
      actions: [
        { text: "Go to postgresql.org/download/windows and click Download the installer." },
        { text: "On the EDB page, click the Windows x86-64 download (1) for the newest version." },
      ],
      screen: "pg-win-download",
    },
    {
      title: "Start the installer",
      os: ["windows"],
      actions: [
        { text: "Open the file from Downloads and click Yes if Windows asks." },
        {
          text: "Click Next on Installation Directory. On Select Components, keep every box ticked (1) and click Next (2). Click Next on Data Directory.",
        },
      ],
      screen: "pg-win-components",
    },
    {
      title: "Choose a database password",
      os: ["windows"],
      why: "This is the password for the database's main user, called postgres. Your project needs it to connect.",
      actions: [
        { text: "Type a password in both boxes (1). Use something simple that you don't use anywhere else — for example devvy123." },
        { text: "Write it down now. Then click Next (2)." },
      ],
      screen: "pg-win-password",
      warn: "If you forget this password you'll have to uninstall and reinstall PostgreSQL — write it down!",
    },
    {
      title: "Finish the install",
      os: ["windows"],
      actions: [
        { text: "Keep port 5432 and the default locale — just click Next, then Next again to install." },
        { text: "On the last screen, untick Launch Stack Builder at exit (1) — you don't need it. Click Finish (2)." },
      ],
      screen: "pg-win-finish",
    },

    // Linux
    {
      title: "Install PostgreSQL",
      os: ["linux"],
      actions: [
        {
          text: "In VS Code's terminal, run these one at a time:",
          code: "sudo apt install -y postgresql\nsudo -u postgres psql -c \"ALTER USER postgres PASSWORD 'devvy123';\"",
        },
        { text: "The second command gives the database's main user (postgres) the password devvy123. Your project uses it to connect." },
      ],
      screen: "pg-linux",
    },
  ],
}

export const aiPart: WalkPart = {
  id: "ai",
  title: "Optional: AI tools",
  time: "5 min",
  intro:
    "You'll use AI the way real teams do — to explain errors, plan and review. None of these are required to run your project, so set them up whenever you like.",
  steps: [
    {
      title: "Add GitHub Copilot to VS Code",
      why: "Copilot suggests code as you type. Students get it free through the GitHub Student Developer Pack (education.github.com/pack).",
      actions: [
        { text: "Open Extensions (the four-squares icon), search GitHub Copilot and click Install (1)." },
        { text: "Sign in with your GitHub account when VS Code asks." },
      ],
      screen: "copilot-extension",
    },
    {
      title: "Claude and Cursor",
      actions: [
        {
          text: "Claude — sign up at claude.ai (free plan available). Paste an error message and ask what it means, or ask it to review a piece of your code.",
        },
        {
          text: "Cursor — an AI code editor from cursor.com that can import your VS Code settings. Free plan available. Optional: VS Code with Copilot is enough.",
        },
      ],
      note: "Never paste passwords, API keys or your .env file into an AI tool.",
    },
  ],
}
