import type { WalkPart } from "@/data/docs/types"

/*
 * Building → Build with AI. The one page that explains how students use AI
 * in this course: build with it, then understand every line well enough to
 * debug it. Every task in the week-by-week plans follows this loop.
 */

export const buildWithAiWalk: WalkPart[] = [
  {
    id: "why",
    title: "Build with AI. Understand every line.",
    time: "2 min",
    intro: "Every engineering team builds with AI now, and so will you. Here's the catch, and how this course handles it.",
    steps: [
      {
        title: "AI writes fast. It's also often almost right.",
        actions: [
          { text: "AI can write a working first version in seconds. That's why every team uses it." },
          { text: "But AI code is often almost right: it misses an edge case, uses an old version of a library, or skips a security check. It says all of it with total confidence." },
          { text: "When it breaks — and it will — the only person who can fix it is someone who understands it. AI can help, but only if you can tell it what's actually wrong." },
        ],
      },
      {
        title: "So in this course, you do both",
        actions: [
          { text: "You build with AI: Claude, Cursor or Copilot write your first drafts." },
          { text: "You understand what it wrote: well enough to explain every line, change it, and debug it when it fails." },
          { text: "Your mentor checks both. In every review they'll ask why a line is there. If you can't explain it, it doesn't get merged — even if it works." },
        ],
        note: "This is the skill companies hire for now: not typing code, but knowing whether the code is right.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "loop",
    title: "The loop, for every task",
    time: "5 min",
    intro: "Every task in your week-by-week plan follows these six steps. The plan gives you the prompt and the questions; this is why each step is there.",
    steps: [
      {
        title: "1. Know what you want before you ask",
        why: "AI builds exactly what you ask for. A fuzzy request gets fuzzy code.",
        actions: [
          { text: "Read the task and say, in two or three lines, what should happen when it's done — which page, which request, which result." },
          { text: "If you can't, re-read Start here and your plan first. You're not ready to prompt yet." },
        ],
      },
      {
        title: "2. Give AI the brief, then one small task",
        why: "AI only knows what you tell it. The project brief (at the top of every week) tells it what you're building, with which tools, and that you're learning.",
        actions: [
          { text: "Start each new chat by pasting the project brief." },
          { text: "Then send one task — not the whole week. Ask for a plan first: which files it will create or change, and why." },
          { text: "If the plan adds things your project doesn't need, say no. Smaller is easier to understand." },
        ],
      },
      {
        title: "3. Read every line as you add it",
        why: "Pasting a file you haven't read is how bugs you can't fix get into your project.",
        actions: [
          { text: "Add the code yourself, one file at a time. Read each line as you do." },
          { text: "Any line you can't explain, ask about it:", code: "Explain line 14 of this file in simple words. What would break if I deleted it?", wrap: true },
          { text: "Check anything important against the official docs — AI sometimes uses old or made-up options." },
        ],
      },
      {
        title: "4. Run it and check it",
        actions: [
          { text: "Do every check in the task yourself: the request, the page, the test. “It looks right” isn't a check." },
          { text: "Try the unhappy paths too: empty forms, wrong passwords, someone else's data." },
        ],
      },
      {
        title: "5. Break it on purpose",
        why: "The fastest way to understand a line is to see what happens without it.",
        actions: [
          { text: "Pick an important line — an auth check, a validation rule, a where clause — and change or delete it." },
          { text: "Run the check again and read the error or the wrong result. Then put the line back." },
          { text: "Now you know what that line does. And when you see that error again, you'll know where to look." },
        ],
      },
      {
        title: "6. Explain it in your pull request",
        actions: [
          { text: "Under AI usage in your PR description, say what AI wrote and what you changed or fixed yourself." },
          { text: "Be honest. Using AI is expected; hiding it isn't. Your mentor reviews your understanding, not your typing." },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "prompts",
    title: "Prompts that work",
    time: "3 min",
    intro: "Five prompts you'll use all the time. Copy them and fill in the gaps.",
    steps: [
      {
        title: "Plan before code",
        actions: [{ text: "Use this before any task:", code: "Before writing any code: which files will you create or change for this task, and what goes in each? Keep it as small as possible.", wrap: true }],
      },
      {
        title: "Explain it",
        actions: [{ text: "Paste the code after it:", code: "Explain this code line by line like I'm new to it. Then tell me the one line that matters most, and why.", wrap: true }],
      },
      {
        title: "Review it",
        actions: [{ text: "Use it on your own code before you open a PR:", code: "Review this code for bugs, missing error handling and security problems. Don't rewrite it — list each problem, why it matters, and where it is.", wrap: true }],
      },
      {
        title: "Test it",
        actions: [{ text: "Ask for the cases, then write or check the tests yourself:", code: "What are the edge cases for this function? List them, then write one test for each.", wrap: true }],
      },
      {
        title: "Teach me",
        actions: [{ text: "When something new comes up (JWT, transactions, hooks…):", code: "Teach me what a database transaction is in five sentences, with one example from my project. Then ask me a question to check I understood.", wrap: true }],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "debug",
    title: "Debugging: find the cause before you ask",
    time: "5 min",
    intro: "Pasting an error into AI and copying whatever comes back is how a small bug turns into three. Do these first — most bugs are found by step 3.",
    steps: [
      {
        title: "Read the error from the top",
        actions: [
          { text: "The first line says what went wrong. Read it slowly — it usually tells you exactly what's missing or wrong." },
          { text: "Then find the first line that mentions one of your files, with a line number. That's where to look." },
        ],
      },
      {
        title: "Make it happen again",
        actions: [{ text: "Find the shortest set of steps that causes the bug every time. A bug you can repeat is a bug you can fix." }],
      },
      {
        title: "Look at the real values",
        why: "Most bugs are a value that isn't what you think it is.",
        actions: [
          { text: "Print the values just before the line that fails — console.log in JavaScript, print in Python — and run it again." },
          { text: "For anything that talks to an API: open the browser's DevTools (F12) → Network tab, click the request, and read its status code and response." },
        ],
      },
      {
        title: "Change one thing at a time",
        actions: [{ text: "Change one thing, run it again, see what changed. Changing five things at once means you'll never know which one fixed it — or which one broke something else." }],
      },
      {
        title: "Then ask AI — the right way",
        actions: [
          {
            text: "Give it everything, and ask for the cause before the fix:",
            code: "I'm getting this error:\n<paste the full error>\n\nHere's the code:\n<paste the function or file>\n\nI expected: <what should happen>\nWhat happens instead: <what you see>\nI already tried: <what you checked>\n\nExplain what's causing it before suggesting a fix.",
            wrap: true,
          },
          { text: "Read the explanation. If it doesn't match what you saw when you printed the values, say so — don't just try its fix." },
        ],
      },
      {
        title: "Write it down",
        actions: [{ text: "Fixed it? Add a line to your PR description: the bug, the cause, the fix. Your mentor will ask about your hardest bug in the final review." }],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "rules",
    title: "The rules",
    time: "1 min",
    intro: "Short, and not negotiable.",
    steps: [
      {
        title: "Five rules",
        actions: [
          { text: "Never paste passwords, API keys or your .env file into an AI tool." },
          { text: "Never submit code you can't explain." },
          { text: "Always say what AI helped with in your PR." },
          { text: "Don't add a library your project doesn't need without asking your mentor first." },
          { text: "When AI and the official docs disagree, the docs win." },
        ],
      },
    ],
  },
]

export const buildWithAiDone = [
  "Know what you want before you ask",
  "Give AI the brief, then one small task — plan first",
  "Read every line as you add it",
  "Run every check, including the unhappy paths",
  "Break it on purpose, then put it back",
  "Say what AI did in your pull request",
]
