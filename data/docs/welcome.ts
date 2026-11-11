import { mentorEmailText } from "@/data/site"
import type { WalkPart } from "@/data/docs/types"

/*
 * The Welcome page, as a short walkthrough. It's the same for every track.
 * Numbers like (1) match the red markers in the pictures
 * (components/docs/screens/welcome.tsx).
 */

export const welcomeWalk: WalkPart[] = [
  {
    id: "program",
    title: "How the program works",
    time: "2 min",
    intro:
      "You'll build one real project over four weeks, the way a junior engineer (or designer) works on a team: you get a spec, plan it, build it in small pieces, get every piece reviewed, and ship it.",
    steps: [
      {
        title: "One project, four weeks",
        actions: [
          { text: "Each week has a milestone (1): a list of tasks with a deliverable at the end." },
          { text: "Your mentor reviews each deliverable (2) and tells you what to improve." },
          { text: "After week 4, your finished project gets a final review (3). Pass it and you get your certificate (4)." },
        ],
        screen: "welcome-timeline",
      },
      {
        title: "No experience with the tools? That's fine",
        actions: [
          { text: "Words like Git, terminal and repository are explained the first time you meet them." },
          { text: "Every step in these docs says what to do, why, shows a picture of the screen, and how to check it worked. Follow them in order and don't skip ahead." },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "docs",
    title: "Find your way around",
    time: "2 min",
    intro: "Everything you need is in the sidebar on the left of these docs.",
    steps: [
      {
        title: "The sidebar",
        actions: [
          { text: "Getting started (1) — read these first, in order. They get your computer ready and teach the way you'll work." },
          { text: "Building (2) — keep these open while you build: coding standards, testing, deployment and troubleshooting." },
          { text: "Reviews (3) — exactly what your mentor checks. Read it before every review and there are no surprises." },
          { text: "Your project (4) — the spec, designs and week-by-week milestones. These unlock once your project is assigned." },
        ],
        screen: "welcome-sidebar",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "first-day",
    title: "Your first day",
    time: "3–4 hours",
    intro: "Do these three pages in order. Each one builds on the one before.",
    steps: [
      {
        title: "Setup — about 2 hours",
        actions: [
          { text: "You install every tool your track uses, from scratch, and create your project. It ends with your first commit on GitHub." },
          { text: "Take breaks — you can stop after any part and come back." },
        ],
        screen: "welcome-day-setup",
      },
      {
        title: "How we work — about 1 hour",
        actions: [
          { text: "You open your first pull request and get it reviewed: the loop you'll repeat for every task in the program." },
          { text: "Then every Git command explained, and how to fix the usual mistakes." },
        ],
        screen: "welcome-day-workflow",
      },
      {
        title: "Environment & secrets — about 25 minutes",
        actions: [{ text: "Where passwords and keys go so they never end up public, and the one rule you must never break." }],
        screen: "welcome-day-environment",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "week",
    title: "Your weekly rhythm",
    time: "1 min",
    intro: "Once your project is assigned, every week looks like this.",
    steps: [
      {
        title: "A normal week",
        actions: [
          { text: "Start of the week: read that week's milestone and split it into small tasks (1)." },
          { text: "During the week: one branch and one small pull request per task (2). Small PRs get reviewed faster." },
          { text: "End of the week: the week's deliverable is merged and ready for review (3)." },
        ],
        screen: "welcome-week",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "stuck",
    title: "When you're stuck",
    time: "2 min",
    intro: "Everyone gets stuck. Here's how to get unstuck quickly.",
    steps: [
      {
        title: "Check Troubleshooting first",
        actions: [{ text: "Most errors you'll hit are already on the Troubleshooting page, with the fix. Search it for a word from your error message." }],
      },
      {
        title: "Stuck for 30 minutes? Email your mentor",
        why: "Struggling a bit is how you learn. Struggling for hours isn't. After 30 minutes, ask your mentor.",
        actions: [
          { text: `Email ${mentorEmailText}. Start the subject with your track in brackets, like [Full-Stack], so your mentor knows straight away which project it is.` },
          { text: "In the email, say what you're trying to do (1)." },
          { text: "Say what you tried (2)." },
          { text: "Paste the exact error and attach a screenshot (3). (Setup shows you how to take one.)" },
        ],
        screen: "welcome-help",
        note: "An email like this gets you a useful answer on the first reply, instead of three rounds of questions.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "certificate",
    title: "Your certificate",
    time: "1 min",
    intro: "What you're working towards.",
    steps: [
      {
        title: "Pass the final review",
        actions: [
          { text: "When your final project passes review, you receive a certificate with your name, track and project." },
          { text: "It has a unique ID (1) that anyone — like an employer — can check on our Verify page." },
          { text: "Not passed yet? You get specific feedback and another attempt." },
        ],
        screen: "welcome-certificate",
      },
    ],
  },
]
