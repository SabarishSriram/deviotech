import type { WalkPart } from "@/data/docs/types"

/*
 * UI/UX setup: Figma, FigJam and a GitHub case study — no terminal needed.
 * Screen ids live in components/docs/screens/design.tsx.
 */

export const designSetup: WalkPart[] = [
  {
    id: "figma",
    title: "Set up Figma",
    time: "10 min",
    intro:
      "Figma is where you'll do everything: research boards, user flows, wireframes, UI design and clickable prototypes. It runs in your browser, and your mentor can comment right on your designs.",
    steps: [
      {
        title: "Create a Figma account",
        actions: [
          { text: "Go to figma.com/signup" },
          { text: "Sign up with your email (1) or Google, and click Create account (2)." },
          { text: "If it asks what you'll use Figma for, choose Design and pick the free Starter plan." },
        ],
        screen: "ux-signup",
      },
      {
        title: "Get the free Education plan",
        why: "Students get Figma's paid features free. It's optional, but it removes limits on files and pages.",
        actions: [
          { text: "Go to figma.com/education and click Get verified (1)." },
          { text: "Fill in your school and graduation year. Verification can take a few days — carry on meanwhile." },
        ],
        screen: "ux-education",
      },
      {
        title: "Install the desktop app",
        os: ["mac", "windows"],
        why: "The desktop app is faster than the browser and can use fonts installed on your computer. Optional, but recommended.",
        actions: [
          { text: "Go to figma.com/downloads and click Download for your computer (1)." },
          { text: "Mac: open the download and drag Figma into Applications. Windows: open the download — it installs itself." },
          { text: "Open Figma and log in." },
        ],
        screen: "ux-download",
      },
      {
        title: "Use Figma in your browser",
        os: ["linux"],
        actions: [{ text: "There's no official Linux app — Figma works fully in Chrome or Firefox at figma.com. Bookmark it." }],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "files",
    title: "Create your project files",
    time: "10 min",
    intro: "One design file holds your whole project, organised into pages. A FigJam board holds your research notes.",
    steps: [
      {
        title: "Create a design file",
        actions: [
          { text: "On the Figma home screen, click + Create (1) → Design (2)." },
          { text: "Click the file name at the top (Untitled) and rename it to your project's name, e.g. Habit tracker — Design." },
        ],
        screen: "ux-new-file",
      },
      {
        title: "Add your pages",
        why: "Pages keep each stage of your work separate, so you — and your mentor — always know where to look.",
        actions: [
          { text: "In the left sidebar, next to Pages, click + (1)." },
          { text: "Add these pages, one at a time: Cover, Research, Flows, Wireframes, Design system, UI, Prototype (2)." },
          { text: "Double-click a page's name to rename it." },
        ],
        screen: "ux-pages",
      },
      {
        title: "Create a FigJam board",
        why: "FigJam is Figma's whiteboard. You'll use it for interview notes, affinity mapping and your journey map.",
        actions: [
          { text: "Back on the home screen, click + Create → FigJam board." },
          { text: "Rename it to your project's name followed by Research, e.g. Habit tracker — Research." },
        ],
        screen: "ux-figjam",
      },
      {
        title: "Share both with your mentor",
        why: "“Can comment” lets your mentor leave feedback right on your frames without being able to change your work.",
        actions: [
          { text: "In the design file, click Share (1) in the top-right corner." },
          { text: "Type your mentor's email (2) — they share it in your 1:1 — set access to can comment (3), and click Invite (4)." },
          { text: "Do the same in your FigJam board." },
        ],
        screen: "ux-share",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "github",
    title: "Set up your case study on GitHub",
    time: "10 min",
    intro:
      "Your case study is the write-up that turns your project into a portfolio piece: the problem, your research, your decisions and the outcome. You'll keep it on GitHub, all from the website — no terminal needed.",
    steps: [
      {
        title: "Create a GitHub account",
        actions: [
          { text: "Go to github.com/signup" },
          { text: "Enter your email, choose a password, and pick a username (1). Use the GitHub username you put in your Devvy application." },
          { text: "Click Continue (2), solve the short puzzle, then type in the code GitHub emails you." },
        ],
        screen: "github-signup",
        note: "Already have a GitHub account? Just sign in at github.com and carry on.",
      },
      {
        title: "Create your case study repository",
        why: "A repository is a project folder on GitHub. Its README file is the page people see first — that's your case study.",
        actions: [
          { text: "Go to github.com/new" },
          { text: "Repository name: my-case-study (1). Keep it Public (2)." },
          { text: "Turn on Add README (3), then click Create repository (4)." },
        ],
        screen: "ux-repo-new",
      },
      {
        title: "Write your case study outline",
        actions: [
          { text: "On your new repository, click the pencil icon on the README (1)." },
          {
            text: "Delete what's there and paste this:",
            code: "# Project name\n\nOne sentence on what you designed and for whom.\n\n## Problem\n\n## Users\n\n## Research\n\n## Flows\n\n## Design\n\n## Testing\n\n## Outcome",
          },
          { text: "Click Commit changes… (2), then Commit changes again in the box that opens." },
        ],
        screen: "ux-readme-edit",
        check: [{ text: "Your repository's front page now shows the headings. You'll fill one in each week." }],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "ai",
    title: "Optional: AI tools",
    time: "2 min",
    intro: "AI can speed up research and writing. It can't replace talking to real users.",
    steps: [
      {
        title: "How to use AI as a designer",
        actions: [
          { text: "Good uses: drafting interview questions, grouping notes into themes, rewriting case study paragraphs more clearly." },
          {
            text: "Figma has AI features built in (like renaming layers and first-draft layouts). Use them as a starting point, then design properly.",
          },
          { text: "Claude (claude.ai) and ChatGPT both have free plans." },
        ],
        warn: "Never paste interview recordings, names or personal details into an AI tool.",
      },
    ],
  },
]

export const designSetupDone = [
  "A Figma account (Education plan if you're verified)",
  "A design file with pages: Cover, Research, Flows, Wireframes, Design system, UI, Prototype",
  "A FigJam board for research",
  "Both shared with your mentor as can comment",
  "A GitHub account and a my-case-study repository with your outline",
]
