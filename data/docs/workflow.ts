import { mentorEmailText } from "@/data/site"
import type { WalkPart } from "@/data/docs/types"

/*
 * "How we work" for every code track: the student practises the whole
 * branch → commit → pull request → review → merge loop once on their own
 * project by writing its README. Screens: components/docs/screens/workflow.tsx
 * (workflowScreensFor). Windows commands must work in PowerShell 5.1.
 */

export type WorkflowCtx = {
  repo: string
  /** The project already has a README (create-next-app, create-expo-app). */
  readmeExists: boolean
  readme: string
  /** The "## You need" section added after the review. */
  needs: string
}

export function codeWorkflow(c: WorkflowCtx): WalkPart[] {
  return [
    {
      id: "words",
      title: "The words you need",
      time: "5 min",
      intro:
        "You already made a commit and pushed it during Setup. Here's what those words actually mean, plus the two new ones you'll use every day: branch and pull request.",
      steps: [
        {
          title: "Git, commits and GitHub",
          actions: [
            {
              text: "Git is a program on your computer that saves snapshots of your project. Each snapshot is called a commit, and it has a short message saying what changed.",
            },
            { text: "Your project folder, tracked by Git, is called a repository (repo)." },
            {
              text: "GitHub is a website that keeps a copy of your repo online. git push sends your commits up to GitHub (1); git pull brings changes down from GitHub to your computer (2).",
            },
          ],
          screen: "wf-map",
          note: "Your mentor reads your code on GitHub, and your GitHub profile becomes part of your portfolio. Employers do look at it.",
        },
        {
          title: "Branches and pull requests",
          why: "This is how every real engineering team works. Nothing you try can break the working version, and every change is reviewed before it goes in.",
          actions: [
            { text: "main (1) is the working version of your project. You never work on it directly." },
            { text: "For each task you make a branch (2) — your own copy where you can change things safely." },
            {
              text: "When the task is done, you open a pull request (PR) (3): a request to bring your branch's changes into main. Your mentor reviews it there and leaves comments.",
            },
            { text: "Once it's approved, you merge it (4) and main now includes your work." },
          ],
          screen: "wf-branch-diagram",
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    {
      id: "first-pr",
      title: "Your first pull request",
      time: "30 min",
      intro: `You'll practise the whole loop once, for real, by ${c.readmeExists ? "rewriting the README of" : "adding a README to"} ${c.repo} — the page GitHub shows on your repo's front page. Every task in the program follows exactly these steps.`,
      steps: [
        {
          title: "Open your project and get the latest main",
          why: "Always start from the newest version of main, so you're not building on old code.",
          actions: [
            { os: ["mac"], text: `Open VS Code. In the menu bar at the top, click File → Open Recent → ${c.repo}.` },
            { os: ["windows", "linux"], text: `Open VS Code and click File → Open Recent → ${c.repo}.` },
            { text: "Open a terminal with Terminal → New Terminal. Switch to main:", code: "git checkout main" },
            { text: "Download anything new from GitHub:", code: "git pull" },
          ],
          screen: "wf-pull",
          check: [{ text: "It says Already up to date (1). That's expected — nobody else has changed your repo." }],
        },
        {
          title: "Create a branch",
          why: "Branch names say what kind of work it is: feat/ for a feature, fix/ for a bug, docs/ for documentation. This one is documentation.",
          actions: [{ text: "Create a branch called docs/readme and switch to it:", code: "git checkout -b docs/readme" }],
          screen: "wf-new-branch",
          check: [{ text: "It says Switched to a new branch 'docs/readme' (1), and the bottom-left corner of VS Code now shows docs/readme (2)." }],
          note: "The bottom-left corner always shows which branch you're on. Glance at it before you start working.",
        },
        {
          title: "Make your change",
          actions: c.readmeExists
            ? [
                { text: "Your project already has a README.md that its creator wrote. Open it from the Explorer." },
                { text: "Select everything in it (Cmd/Ctrl + A), delete it, paste this, and save:", file: "README.md", code: c.readme },
              ]
            : [
                { text: "In the Explorer, right-click the empty space below the files and choose New File…" },
                { text: "Type README.md and press Enter. It must be at the top level of your project — not inside any folder." },
                { text: "Paste this in and save:", file: "README.md", code: c.readme },
              ],
          screen: "wf-readme",
          check: [
            {
              text: c.readmeExists
                ? "README.md turns orange with an M next to it (1). M means modified: Git sees a change it hasn't saved yet."
                : "README.md appears in green with a U next to it (1). U means untracked: Git sees a new file it hasn't saved yet.",
            },
          ],
        },
        {
          title: "See what changed",
          actions: [{ text: "Ask Git what's different from the last commit:", code: "git status" }],
          screen: "wf-status",
          check: [
            {
              text: `README.md is listed under ${c.readmeExists ? "Changes not staged for commit" : "Untracked files"} (1). Only the files you meant to change should be here.`,
            },
          ],
          note: "Run git status whenever you're unsure what's going on. It never changes anything, it only tells you.",
        },
        {
          title: "Commit it",
          why: "A good commit message starts with a verb and says what changed: “Add README with how to run the project” beats “update” or “stuff”.",
          actions: [
            { text: "Choose what goes into the commit:", code: "git add README.md" },
            { text: "Save the snapshot with a message:", code: 'git commit -m "Add README with how to run the project"' },
          ],
          screen: "wf-commit",
          check: [{ text: "It says 1 file changed (1)." }],
        },
        {
          title: "Push the branch to GitHub",
          why: "Your commit only exists on your computer until you push it. -u origin docs/readme sends the branch to GitHub and links the two, so next time plain git push is enough.",
          actions: [{ text: "Run:", code: "git push -u origin docs/readme" }],
          screen: "wf-push",
          check: [{ text: "It ends with * [new branch] docs/readme -> docs/readme (1)." }],
        },
        {
          title: "Open a pull request",
          actions: [
            { text: "Create the pull request. --fill uses your commit message as its title:", code: "gh pr create --fill" },
            { text: "Then open it in your browser:", code: "gh pr view --web" },
          ],
          screen: "wf-pr-create",
          check: [{ text: "It prints a link ending in /pull/1 (1). That's your pull request." }],
        },
        {
          title: "Write a proper description",
          why: "Your mentor reads the description first. A good one says what you did, why, and exactly how to check it works.",
          actions: [
            { text: "On the pull request page, click the ··· button (1) on the first comment box, then Edit (2)." },
            {
              text: "Delete what's there, paste this, and click Update comment:",
              code: "## What\nAdds a README explaining how to run the project.\n\n## Why\nAnyone opening the repo should be able to start it.\n\n## How to test\n1. Follow the README steps from a fresh terminal.\n2. The project starts without errors.\n\n## AI usage\nNone.",
            },
          ],
          screen: "wf-pr-edit",
          note: "Use these four headings in every PR. For anything visual, add a screenshot: drag the image file straight into the description box.",
        },
        {
          title: "Ask for a review",
          actions: [
            { text: "Go back to your pull request (the Pull requests tab at the top of the repo)." },
            { text: "On the right, click the gear next to Reviewers (1) and choose your mentor (2). Click anywhere outside the list to save." },
          ],
          screen: "wf-reviewers",
          note: "Your mentor isn't in the list? They haven't accepted the invite you sent in Setup yet. Carry on with the next step, and come back to add them when they appear. Never sent the invite? Do Setup → Add your mentor to the repository now.",
        },
        {
          title: "Email your mentor the link",
          why: "GitHub notifies your mentor too, but an email makes sure your review never gets lost — and tells them what to look at.",
          actions: [
            { text: "Copy the pull request's address from your browser's address bar." },
            { text: `Email ${mentorEmailText} (1).` },
            { text: "Subject: your track in brackets, then PR ready for review and the PR's title (2)." },
            { text: "In the email, paste the link (3) and add one line on anything you'd like them to look at closely." },
          ],
          screen: "wf-email",
        },
        {
          title: "Read the review",
          why: "Comments aren't a bad sign — every engineer's code gets them. Fixing them is how you learn fastest.",
          actions: [
            { text: "Your mentor's comments appear on the Conversation tab (1), and GitHub emails you about them." },
            { text: "If something isn't clear, reply right there to ask. When you've fixed it, you'll click Resolve conversation (2)." },
          ],
          screen: "wf-review-comment",
        },
        {
          title: "Push a fix",
          why: "You don't open a new pull request. Push more commits to the same branch and the PR updates by itself.",
          actions: [
            {
              text: "In README.md, add this section above “## Run it locally” and save:",
              file: "README.md",
              code: c.needs,
            },
            { text: "Commit and push — one command at a time:", code: 'git add README.md\ngit commit -m "Add requirements to README"\ngit push' },
          ],
          screen: "wf-fix-push",
          check: [{ text: "The push ends with docs/readme -> docs/readme (1). Refresh the PR page: your new commit shows up in the conversation." }],
        },
        {
          title: "Merge it",
          actions: [
            { text: "When your mentor approves, the pull request shows Changes approved (1)." },
            { text: "Click Merge pull request (2), then Confirm merge." },
            { text: "Click Delete branch when it appears. The branch's work is safely in main now." },
          ],
          screen: "wf-merge",
          warn: "Don't merge before you're approved, even if the button is green.",
        },
        {
          title: "Bring main up to date on your computer",
          why: "The merge happened on GitHub. Your computer doesn't know yet, so you pull it down and tidy up the old branch.",
          actions: [
            { text: "Switch back to main:", code: "git checkout main" },
            { text: "Download the merged work:", code: "git pull" },
            { text: "Delete the finished branch:", code: "git branch -d docs/readme" },
          ],
          screen: "wf-update-main",
          check: [
            { text: "git pull lists README.md (1), and the branch is deleted (2). The status bar shows main again. You've done the whole loop. 🎉" },
          ],
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    {
      id: "every-task",
      title: "Every task, the same loop",
      time: "3 min",
      intro: "Keep this part open while you work. It's the whole of the last part on one screen.",
      steps: [
        {
          title: "The loop",
          actions: [
            { text: "Start from the latest main:", code: "git checkout main\ngit pull" },
            { text: "Create a branch for the task:", code: "git checkout -b feat/your-task" },
            { text: "Work in small steps. Commit each one:", code: 'git add .\ngit commit -m "Say what changed"' },
            { text: "Push the branch (the first time):", code: "git push -u origin feat/your-task" },
            { text: "Open a pull request, write the description, request a review, and email your mentor the link:", code: "gh pr create --fill" },
            { text: "Fix comments with more commits and git push. Merge when approved, then pull main." },
          ],
          screen: "wf-loop",
          note: "Small pull requests get reviewed faster. One feature or one fix per PR — if it touches lots of unrelated files, split it.",
        },
        {
          title: "Naming branches and commits",
          actions: [
            { text: "Branches: feat/… for features, fix/… for bugs, docs/… for documentation. Use lowercase and dashes, e.g. feat/login-page." },
            { text: "Commits: start with a verb and say what changed, e.g. “Add pagination to /orders”." },
          ],
          screen: "wf-naming",
        },
        {
          title: "Using AI tools the right way",
          why: "AI is a normal part of engineering now. The rule is simple: you're responsible for every line you submit.",
          actions: [
            { text: "Do use AI to plan, explain errors, scaffold boilerplate and suggest tests." },
            { text: "Read every line it gives you. If you can't explain it in a review, don't submit it." },
            { text: "Test what it writes. AI code often looks right and fails on edge cases." },
            { text: "Say what AI helped with under AI usage in your pull request." },
          ],
          screen: "wf-ai",
          warn: "Never paste passwords, API keys or your .env file into an AI tool.",
        },
      ],
    },
    ...gitReference,
  ]
}

/* ------------------------------------------------------------------ */
/* Git commands explained, and fixing mistakes                         */
/* ------------------------------------------------------------------ */

const gitReference: WalkPart[] = [
  {
    id: "git-commands",
    title: "Git commands, explained",
    time: "10 min",
    intro:
      "Every Git command you've used so far, and a few more, in one place: what each one does and when to use it. Four of them only look and never change anything — git status, git diff, git log and git branch — so try those now in your project's terminal. Read the rest for now; you'll run them during real tasks.",
    steps: [
      {
        title: "git status — what's changed?",
        why: "Shows which branch you're on, which files you've changed since your last commit (red), and which are ready to be committed (green). It never changes anything, so run it whenever you're unsure.",
        actions: [{ text: "Run:", code: "git status" }],
        screen: "gc-status",
        check: [{ text: "It names your branch (1) and lists changed files (2) — or says nothing to commit, working tree clean." }],
      },
      {
        title: "git diff — what exactly did I change?",
        why: "Shows the exact lines you changed in each file: lines starting with - in red were removed, lines starting with + in green were added.",
        actions: [
          { text: "Run:", code: "git diff" },
          { text: "If it fills the screen, scroll with ↑ and ↓, and press q to get back to the prompt." },
        ],
        screen: "gc-diff",
      },
      {
        title: "git add — choose what to save",
        why: "Picks which changes go into your next commit (Git calls this staging). It doesn't save anything yet — it's like putting things in a box before you seal it.",
        actions: [
          { text: "Add one file:", code: "git add README.md" },
          { text: "Or add every change in the project:", code: "git add ." },
        ],
        screen: "gc-add",
        check: [{ text: "git status now lists the file in green, under Changes to be committed (1)." }],
      },
      {
        title: "git commit — save a snapshot",
        why: "Saves everything you added as one snapshot, with a message saying what changed. Your work is now safe on your computer, and you can always come back to it.",
        actions: [{ text: "Run, with your own message:", code: 'git commit -m "Add setup steps to README"' }],
        screen: "gc-commit",
        note: "A good message starts with a verb and says what changed: “Fix login error message”, not “changes”.",
      },
      {
        title: "git log — see your history",
        why: "Lists your commits, newest first. --oneline shows each one on a single line: a short id and the message.",
        actions: [
          { text: "Run:", code: "git log --oneline" },
          { text: "If the list is long and you see a colon at the bottom, press q to get back to the prompt." },
        ],
        screen: "gc-log",
      },
      {
        title: "git push — upload to GitHub",
        why: "Sends your commits from your computer to GitHub, so your mentor can see them and they're backed up.",
        actions: [
          { text: "The first time you push a new branch, tell Git where to send it:", code: "git push -u origin feat/your-task" },
          { text: "After that, on the same branch, this is enough:", code: "git push" },
        ],
        screen: "gc-push",
      },
      {
        title: "git pull — download from GitHub",
        why: "Brings commits from GitHub into the branch you're on — for example, main after your pull request is merged.",
        actions: [{ text: "Run:", code: "git pull" }],
        screen: "gc-pull",
      },
      {
        title: "Branches: git checkout and git branch",
        why: "A branch is your own copy of the project for one task. These three commands are all you need.",
        actions: [
          { text: "Create a new branch and switch to it:", code: "git checkout -b feat/your-task" },
          { text: "Switch to a branch that already exists:", code: "git checkout main" },
          { text: "List your branches — the one marked with * is the one you're on (1):", code: "git branch" },
        ],
        screen: "gc-branch",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "oops",
    title: "Oops! Fixing common mistakes",
    time: "10 min",
    intro:
      "Everyone gets these wrong at some point. Find your situation, read what the command does, then run it. If you're not sure which one you need, run git status and email your mentor a screenshot before you try anything.",
    steps: [
      {
        title: "Throw away changes to a file",
        why: "git restore puts a file back exactly how it was at your last commit. Use it when you've made a mess of a file and want to start again.",
        actions: [
          { text: "One file:", code: "git restore README.md" },
          { text: "Every changed file in the project:", code: "git restore ." },
        ],
        screen: "oops-restore",
        warn: "The changes you throw away are gone for good — there's no undo. If in doubt, commit them on a branch instead.",
      },
      {
        title: "Take a file out of the next commit",
        why: "You ran git add on a file you didn't mean to. git restore --staged takes it back out of the commit, but keeps your changes in the file.",
        actions: [{ text: "Run, with the file's name:", code: "git restore --staged README.md" }],
        screen: "oops-unstage",
        check: [{ text: "git status now lists the file in red again, not green (1)." }],
      },
      {
        title: "Fix the last commit's message, or add a forgotten file",
        why: "git commit --amend replaces your last commit with a corrected one. Only do this before you push.",
        actions: [
          { text: "Fix the message:", code: 'git commit --amend -m "Add setup steps to README"' },
          { text: "Forgot a file? Add it, then amend without changing the message:", code: "git add README.md\ngit commit --amend --no-edit" },
        ],
        screen: "oops-amend",
      },
      {
        title: "Undo the last commit, but keep the work",
        why: "git reset --soft HEAD~1 takes back your last commit. HEAD~1 means “one commit before now”, and --soft means your changes stay in your files, ready to commit again. Only do this before you push.",
        actions: [{ text: "Run:", code: "git reset --soft HEAD~1" }],
        screen: "oops-reset",
        check: [{ text: "git status shows your changes in green again — nothing was lost (1)." }],
      },
      {
        title: "I committed on main by mistake",
        why: "Your commits should be on a branch, not main. These three commands move them there. It only works if you haven't pushed main yet.",
        actions: [
          { text: "Make a branch that keeps your commits. git branch creates it without switching:", code: "git branch feat/your-task" },
          { text: "Put main back the way it is on GitHub. --hard resets your files too, so make sure everything is committed first:", code: "git reset --hard origin/main" },
          { text: "Switch to your branch — your commits are all there:", code: "git checkout feat/your-task" },
        ],
        screen: "oops-main",
        warn: "Run git status first. If it lists any changed files, commit them before the reset, or they'll be lost.",
      },
      {
        title: "Git won't let me switch branches",
        why: "If you have unsaved changes that clash with the other branch, Git refuses to switch rather than lose them. git stash puts your changes on a shelf; git stash pop puts them back.",
        actions: [
          { text: "Put your changes on the shelf:", code: "git stash" },
          { text: "Now switch:", code: "git checkout main" },
          { text: "When you're back on your branch, take them off the shelf:", code: "git checkout feat/your-task\ngit stash pop" },
        ],
        screen: "oops-stash",
        note: "Simpler option: commit your work on the branch first. Then you can switch freely.",
      },
      {
        title: "I pushed something wrong",
        why: "Once commits are on GitHub, don't try to rewrite them (never use git push --force). Just fix it with a new commit.",
        actions: [
          { text: "Make the fix, then commit and push as normal. Your pull request updates by itself." },
          { text: "If what you pushed was a password or key, follow Environment & secrets → If a secret leaks, straight away." },
        ],
      },
      {
        title: "I'm stuck in a strange screen",
        why: "Some Git commands open a viewer or an editor inside the terminal. They look scary but are easy to leave.",
        actions: [
          { text: "A colon (:) or (END) at the bottom: that's a viewer (1). Press q." },
          { os: ["mac", "linux"], text: "Lines starting with ~ and a message at the top: that's an editor called Vim. Press Esc, type :wq and press Enter — it saves and closes." },
          { os: ["linux"], text: "^X Exit and ^O Write Out along the bottom: that's an editor called nano (Ubuntu's usual one). Press Ctrl + O and Enter to save, then Ctrl + X to close." },
          { os: ["windows"], text: "A COMMIT_EDITMSG tab opens in VS Code and the terminal says it's waiting: that's Git asking for a message. Type it on the first line, save, and close the tab." },
          { text: "Nothing works? Press Ctrl + C." },
        ],
        screen: "oops-pager",
      },
    ],
  },
]

export const workflowDone = [
  "Start from the latest main",
  "Create a branch named after the task",
  "Commit with a clear message",
  "Push the branch and open a pull request with What / Why / How to test / AI usage",
  "Request a review, email your mentor the link, and push fixes to the same branch",
  "Merge when approved, then pull main",
]

/* ------------------------------------------------------------------ */
/* Per track                                                           */
/* ------------------------------------------------------------------ */

const run = (title: string, intro: string, steps: string[]) =>
  `# ${title}\n\n${intro}\n\n## Run it locally\n\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`
const needs = (items: string[]) => `## You need\n\n${items.map((i) => `- ${i}`).join("\n")}`

const pyRun = (last: string) => [
  "Create the environment: `python -m venv .venv`, then activate it",
  "Install the libraries: `pip install -r requirements.txt`",
  last,
]

export const workflowCtx = {
  "full-stack": {
    repo: "my-fullstack-app",
    readmeExists: false,
    readme: run("My Full-Stack App", "A React client and an Express API, built during the Devvy Tech program.", [
      "Start the API: open a terminal, run `cd server`, then `npm run dev`",
      "Start the client: open another terminal, run `cd client`, then `npm run dev`",
      "Open http://localhost:5173",
    ]),
    needs: needs(["Node.js 24 or newer", "PostgreSQL, running", "A server/.env file (see server/.env.example)"]),
  },
  backend: {
    repo: "my-api",
    readmeExists: false,
    readme: run("My API", "An Express + TypeScript API, built during the Devvy Tech program.", [
      "Open Docker Desktop, then start Redis: `docker start redis`",
      "Start the API: `npm run dev`",
      "Open http://localhost:4000/health",
    ]),
    needs: needs(["Node.js 24 or newer", "PostgreSQL and Docker, running", "A .env file (see .env.example)"]),
  },
  frontend: {
    repo: "my-frontend-app",
    readmeExists: true,
    readme: run("My Frontend App", "A Next.js website, built during the Devvy Tech program.", [
      "Install the libraries: `npm install`",
      "Start it: `npm run dev`",
      "Open http://localhost:3000",
    ]),
    needs: needs(["Node.js 24 or newer", "npm (it comes with Node.js)", "A .env.local file (see .env.example)"]),
  },
  "app-development": {
    repo: "my-mobile-app",
    readmeExists: true,
    readme: run("My Mobile App", "A React Native app built with Expo during the Devvy Tech program.", [
      "Install the libraries: `npm install`",
      "Start it: `npx expo start`",
      "Scan the QR code with Expo Go on your phone",
    ]),
    needs: needs(["Node.js 24 or newer", "The Expo Go app on your phone", "Your phone and laptop on the same Wi-Fi"]),
  },
  "ai-ml": {
    repo: "my-ml-project",
    readmeExists: false,
    readme: run("My ML Project", "A machine-learning project, built during the Devvy Tech program.", pyRun("Start the notebooks: `jupyter lab`")),
    needs: needs(["Python 3.10 or newer", "About 1 GB of free space for the libraries", "A .env file (see .env.example)"]),
  },
  "data-science": {
    repo: "my-analysis",
    readmeExists: false,
    readme: run("My Analysis", "A data analysis project, built during the Devvy Tech program.", pyRun("Start the notebooks: `jupyter lab`")),
    needs: needs(["Python 3.10 or newer", "The dataset in the data folder", "A .env file (see .env.example)"]),
  },
  python: {
    repo: "my-python-tool",
    readmeExists: false,
    readme: run("My Python Tool", "A command-line tool, built during the Devvy Tech program.", pyRun("Run it: `python -m app.main YourName`")),
    needs: needs(["Python 3.10 or newer", "pip (it comes with Python)", "To run the tests: `python -m pytest`"]),
  },
  java: {
    repo: "my-java-api",
    readmeExists: false,
    readme: run("My Java API", "A Spring Boot REST API, built during the Devvy Tech program.", [
      "Create a .env file (see .env.example)",
      "Start it: `./mvnw spring-boot:run`",
      "Open http://localhost:8080/health",
    ]),
    needs: needs(["Java 21 (Temurin)", "PostgreSQL, running, with a devvy_java database", "Nothing else — Maven downloads itself"]),
  },
} satisfies Record<string, WorkflowCtx>

/* ------------------------------------------------------------------ */
/* UI/UX — feedback happens in Figma                                   */
/* ------------------------------------------------------------------ */

export const designWorkflow: WalkPart[] = [
  {
    id: "feedback",
    title: "How feedback works",
    time: "5 min",
    intro:
      "Developers get feedback through pull requests. You get it right on your designs: your mentor leaves comments on your frames, you reply, fix, and resolve them. Same loop, different tool.",
    steps: [
      {
        title: "Read a comment",
        actions: [
          { text: "Comments show as small speech-bubble pins on your frames (1). Click one to open it." },
          { text: "Press C (or click the speech bubble in the toolbar) to see every comment in the right sidebar." },
        ],
        screen: "ux-comment",
      },
      {
        title: "Reply, fix, resolve",
        why: "Replying shows your mentor you've seen the comment. Resolving it keeps your file tidy and tells them it's done.",
        actions: [
          { text: "Reply in the comment (2) — say what you changed, or ask a question if it isn't clear." },
          { text: "Make the change in your design." },
          { text: "Click the ✓ Resolve button (3) on the comment." },
        ],
        screen: "ux-comment",
        note: "Disagree with a comment? Say why in a reply. Explaining your decisions is part of being a designer.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "weekly",
    title: "Every week's review",
    time: "5 min",
    intro: "At the end of each week you hand in that week's work. Do these four things, in order.",
    steps: [
      {
        title: "Save a named version",
        why: "Figma saves automatically, but a named version is a checkpoint you and your mentor can always go back to — instead of making copies of your file.",
        actions: [
          { text: "Click the file name at the top → Save to version history (1). Shortcut: Cmd/Ctrl + Alt + S." },
          { text: "Give it a title like Week 2 review (2) and click Save (3)." },
        ],
        screen: "ux-version",
      },
      {
        title: "Copy a link to the exact frames",
        actions: [
          { text: "Select the frame or section you want reviewed." },
          { text: "Right-click it → Copy/Paste as → Copy link to selection (1). The link opens straight on that frame." },
        ],
        screen: "ux-link",
      },
      {
        title: "Update your case study",
        why: "Writing a little every week is much easier than writing the whole case study at the end — and it's what your mentor reviews alongside your designs.",
        actions: [
          { text: "Open your my-case-study repository on GitHub and click the pencil icon on the README." },
          { text: "Fill in this week's section: what you did, what you learned, and the decisions you made. Add images by dragging them into the editor." },
          { text: "Click Commit changes…, write a short message like Add week 2 research (1), and click Commit changes (2)." },
        ],
        screen: "ux-commit",
      },
      {
        title: "Email it to your mentor",
        actions: [
          { text: `Email ${mentorEmailText}. Start the subject with [UI/UX] and the week, like [UI/UX] Week 2 ready for review.` },
          { text: "Paste the frame link and the case study link, with one line on what you'd like feedback on." },
          { text: "Then keep working — reply to comments as they come in." },
        ],
        screen: "ux-message",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "habits",
    title: "Good habits",
    time: "2 min",
    intro: "Small habits that make reviews faster and your case study better.",
    steps: [
      {
        title: "Naming and organising",
        actions: [
          { text: "Name every frame (e.g. Home — empty state), never Frame 12." },
          { text: "One file, one source of truth. Use pages and version history — not copies like Design final FINAL v3." },
        ],
        screen: "ux-naming",
      },
      {
        title: "Using AI the right way",
        why: "You're responsible for every decision in your design. AI can help you think, but your mentor will ask you to explain your choices.",
        actions: [
          { text: "Do use AI to draft interview questions, group notes into themes, and tighten your writing." },
          { text: "Don't present AI-generated research as real user research. Your insights must come from real people." },
          { text: "Say what AI helped with in your case study." },
        ],
        screen: "ux-ai",
        warn: "Never paste interview recordings, names or personal details into an AI tool.",
      },
    ],
  },
]

export const designWorkflowDone = [
  "Read and reply to every comment, then resolve it",
  "Save a named version at the end of each week",
  "Share a link to the exact frames you want reviewed",
  "Update your case study README every week",
  "Name frames clearly and keep one file — no copies",
]
