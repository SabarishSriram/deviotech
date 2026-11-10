import { designScreens } from "@/components/docs/screens/design"
import { envScreensFor } from "@/components/docs/screens/environment"
import { fullStackScreens } from "@/components/docs/screens/fullstack"
import { PROJ, projectScreens } from "@/components/docs/screens/projects"
import { toolScreens } from "@/components/docs/screens/tools"
import { workflowScreens, workflowScreensFor } from "@/components/docs/screens/workflow"
import { envDone, envWalks, designEnvironment, designEnvironmentDone } from "@/data/docs/environment"
import { fullStackSetup, fullStackSetupDone } from "@/data/docs/fullstack-setup"
import { fullStackEnvironment, fullStackEnvironmentDone, fullStackWorkflow, fullStackWorkflowDone } from "@/data/docs/fullstack-workflow"
import { aiPart, githubPart, gitPart, nodePart, postgresPart, vscodePart, workspacePart } from "@/data/docs/setup/common"
import { designSetup, designSetupDone } from "@/data/docs/setup/design"
import {
  appNextTime,
  appProject,
  backendNextTime,
  backendProject,
  dsNextTime,
  dsProject,
  frontendNextTime,
  frontendProject,
  javaNextTime,
  javaProject,
  mlNextTime,
  mlProject,
  pyNextTime,
  pyProject,
} from "@/data/docs/setup/projects"
import {
  apiExtensions,
  dockerPart,
  expoPart,
  javaExtensions,
  jdkPart,
  mongoPart,
  nextExtensions,
  powerBiPart,
  pythonExtensions,
  pythonPart,
  webExtensions,
} from "@/data/docs/setup/tools"
import { codeWorkflow, designWorkflow, designWorkflowDone, workflowCtx, workflowDone } from "@/data/docs/workflow"
import type { OS, WalkPart } from "@/data/docs/types"
import type { TrackSlug } from "@/data/tracks"

/*
 * Every track's Getting started pages — Setup, How we work, Environment &
 * secrets — as walkthroughs: the parts (data/docs/…) and the pictures they
 * use (components/docs/screens/…).
 */

type Screens = Record<string, (os: OS) => React.ReactNode>

export type Walk = {
  title: string
  intro: string
  parts: WalkPart[]
  screens: Screens
  done: string[]
  doneTitle: string
  doneIntro: string
  next: string
  /** Show the OS picker (off when nothing on the page depends on the OS). */
  pickOs?: boolean
  /** Shown in boxes above the walkthrough. */
  facts?: [string, string][]
}

const setupScreens: Screens = { ...fullStackScreens, ...toolScreens, ...projectScreens }

const setupFacts = (time: string): [string, string][] => [
  ["Time", `${time}, with breaks. You can stop after any part and come back.`],
  ["You need", "A laptop (Windows 10/11, macOS 12+ or Ubuntu), an internet connection, and an email address."],
  ["Stuck?", "Re-read the step and compare with the picture. Still stuck after 30 minutes? Send your mentor a screenshot."],
]

const codeSetup = (parts: WalkPart[], intro: string, done: string[], time = "About 2 hours"): Walk => ({
  title: "Setup",
  intro,
  parts,
  screens: setupScreens,
  done: ["A devvy folder for all your work", "VS Code with your track's extensions", "Git, configured with your name and email", "A GitHub account and the GitHub CLI, logged in", ...done],
  doneTitle: "You're set up",
  doneIntro: "If you can tick every line, your computer is ready for the program.",
  next: "Next up: How we work, in the sidebar. You'll use your new project to learn the branch → commit → pull request loop.",
  facts: setupFacts(time),
})

const base = [workspacePart]
const gits = [gitPart, githubPart]

const SETUP: Record<TrackSlug, Walk> = {
  "full-stack": {
    ...codeSetup(fullStackSetup, "", []),
    intro:
      "Start from a computer with nothing installed and finish with a React + Express + PostgreSQL project running on your machine and saved on GitHub. Every click is shown — don't skip a step, and don't move on until the step's check passes.",
    done: fullStackSetupDone,
  },
  backend: codeSetup(
    [...base, vscodePart(apiExtensions), ...gits, nodePart("Your API runs on it."), postgresPart, dockerPart, mongoPart, backendProject, backendNextTime, aiPart],
    "Start from a computer with nothing installed and finish with an Express + TypeScript API, connected to PostgreSQL, with Redis in Docker — running on your machine and saved on GitHub. Every click is shown; don't move on until each step's check passes.",
    ["Node.js and npm", "PostgreSQL, running", "Docker Desktop, with Redis in a container", "my-api answering on localhost:4000/health", "Your first commit, pushed to GitHub"]
  ),
  frontend: codeSetup(
    [...base, vscodePart(nextExtensions), ...gits, nodePart("Next.js — the framework your website is built with — runs on it."), frontendProject, frontendNextTime, aiPart],
    "Start from a computer with nothing installed and finish with a Next.js website — TypeScript, Tailwind CSS and shadcn/ui — running on your machine and saved on GitHub. Every click is shown; don't move on until each step's check passes.",
    ["Node.js and npm", "my-frontend-app running on localhost:3000, with your own heading and a shadcn/ui button", "Your project on GitHub"],
    "About 1½ hours"
  ),
  "app-development": codeSetup(
    [...base, vscodePart(webExtensions), ...gits, nodePart("Expo — the tool that builds and runs your app — runs on it."), expoPart, appProject, appNextTime, aiPart],
    "Start from a computer with nothing installed and finish with a React Native app running on your own phone through Expo Go, and saved on GitHub. Every click is shown; don't move on until each step's check passes.",
    ["Node.js and npm", "Expo Go on your phone, and an Expo account", "my-mobile-app running on your phone", "EAS CLI, logged in", "Your project on GitHub"],
    "About 1½ hours"
  ),
  "ai-ml": codeSetup(
    [...base, vscodePart(pythonExtensions(true)), ...gits, pythonPart, mlProject, mlNextTime, aiPart],
    "Start from a computer with nothing installed and finish with a Python project — its own environment, the core machine-learning libraries and a first notebook — saved on GitHub. Every click is shown; don't move on until each step's check passes.",
    ["Python 3, with pip", "my-ml-project with a .venv and requirements.txt", "JupyterLab running your first notebook", "Your first commit, pushed to GitHub"]
  ),
  "data-science": codeSetup(
    [...base, vscodePart(pythonExtensions(true)), ...gits, pythonPart, dsProject, powerBiPart, dsNextTime, aiPart],
    "Start from a computer with nothing installed and finish with a Python project — its own environment, the data-analysis libraries and a first notebook — saved on GitHub. Every click is shown; don't move on until each step's check passes.",
    ["Python 3, with pip", "my-analysis with a .venv and requirements.txt", "JupyterLab running your first notebook", "Your first commit, pushed to GitHub"]
  ),
  python: codeSetup(
    [...base, vscodePart(pythonExtensions(false)), ...gits, pythonPart, pyProject, pyNextTime, aiPart],
    "Start from a computer with nothing installed and finish with a Python project — a command-line program and a passing test — saved on GitHub. Every click is shown; don't move on until each step's check passes.",
    ["Python 3, with pip", "my-python-tool with a .venv and requirements.txt", "A program that runs and a test that passes", "Your first commit, pushed to GitHub"],
    "About 1½ hours"
  ),
  java: codeSetup(
    [...base, vscodePart(javaExtensions), ...gits, jdkPart, postgresPart, javaProject, javaNextTime, aiPart],
    "Start from a computer with nothing installed and finish with a Spring Boot API connected to PostgreSQL, running on your machine and saved on GitHub. Every click is shown; don't move on until each step's check passes.",
    ["Java 21 (Temurin)", "PostgreSQL, running, with a devvy_java database", "my-java-api answering on localhost:8080/health", "Your project on GitHub"]
  ),
  "ui-ux": {
    title: "Setup",
    intro: "Get Figma ready for your project and set up the GitHub case study that becomes your portfolio piece. No coding and no terminal — everything happens in the browser.",
    parts: designSetup,
    screens: { ...designScreens, ...fullStackScreens },
    done: designSetupDone,
    doneTitle: "You're set up",
    doneIntro: "If you can tick every line, you're ready for the program.",
    next: "Next up: How we work, in the sidebar — how feedback and weekly reviews work for designers.",
    facts: [
      ["Time", "About 30 minutes."],
      ["You need", "A laptop with Chrome or Firefox, and an email address."],
      ["Stuck?", "Re-read the step and compare with the picture. Still stuck after 30 minutes? Send your mentor a screenshot."],
    ],
  },
}

/* ------------------------------------------------------------------ */

const workflowFor = (track: Exclude<TrackSlug, "full-stack" | "ui-ux">): Walk => {
  const ctx = workflowCtx[track]
  const p = PROJ[track]
  return {
    title: "How we work",
    intro: `You'll open your first pull request on ${ctx.repo} and get it reviewed and merged — the loop you'll repeat for every task in the program. Have your project from Setup ready.`,
    parts: codeWorkflow(ctx),
    screens: workflowScreensFor({
      repo: ctx.repo,
      root: p.root,
      readme: ctx.readme.split("\n"),
      readmeExists: ctx.readmeExists,
      fixLines: ctx.needs.split("\n").length + 1,
    }),
    done: workflowDone,
    doneTitle: "The loop, in six lines",
    doneIntro: "You've done it once for real. Every task from now on follows the same six steps.",
    next: "Next up: 3. Environment & secrets, in the sidebar. You'll use this loop for it.",
  }
}

const envFor = (track: Exclude<TrackSlug, "full-stack" | "ui-ux">): Walk => ({
  title: "Environment & secrets",
  intro: "Where passwords and keys live, how to keep them off GitHub, and how your project reads its settings — with a real task to finish it off.",
  parts: envWalks[track],
  screens: envScreensFor(track),
  done: envDone[track],
  doneTitle: "Your project is set up properly",
  doneIntro: "Tick every line before you start week 1.",
  next: "You're ready. When your project is assigned, start with its PRD and Milestones in the sidebar.",
})

export function walkthroughFor(track: TrackSlug, doc: "setup" | "workflow" | "environment"): Walk {
  if (doc === "setup") return SETUP[track]
  if (track === "full-stack") {
    return doc === "workflow"
      ? {
          title: "How we work",
          intro:
            "You'll open your first pull request on my-fullstack-app and get it reviewed and merged — the loop you'll repeat for every task in the program. Have your project from Setup ready.",
          parts: fullStackWorkflow,
          screens: workflowScreens,
          done: fullStackWorkflowDone,
          doneTitle: "The loop, in six lines",
          doneIntro: "You've done it once for real. Every task from now on follows the same six steps.",
          next: "Next up: 3. Environment & secrets, in the sidebar. You'll use this loop for it.",
        }
      : {
          title: "Environment & secrets",
          intro:
            "Where passwords and keys live, how to keep them off GitHub, and how your client and server get their settings. You'll finish with your React app talking to your API.",
          parts: fullStackEnvironment,
          screens: workflowScreens,
          done: fullStackEnvironmentDone,
          doneTitle: "Your project is set up properly",
          doneIntro: "Tick every line before you start week 1.",
          next: "You're ready. When your project is assigned, start with its PRD and Milestones in the sidebar.",
        }
  }
  if (track === "ui-ux") {
    return doc === "workflow"
      ? {
          title: "How we work",
          intro: "How your mentor gives feedback, what to hand in every week, and the habits that make reviews quick.",
          parts: designWorkflow,
          screens: designScreens,
          done: designWorkflowDone,
          doneTitle: "Every week, in five lines",
          doneIntro: "Do these and your reviews will be quick and useful.",
          next: "Next up: 3. Environment & secrets, in the sidebar — keeping research data private.",
          pickOs: false,
        }
      : {
          title: "Research data & sharing",
          intro: "You won't handle passwords or API keys, but you will handle what real people tell you. Here's how to keep it private, and how to share your work safely.",
          parts: designEnvironment,
          screens: designScreens,
          done: designEnvironmentDone,
          doneTitle: "You're handling data properly",
          doneIntro: "Tick every line before your first interview.",
          next: "You're ready. When your project is assigned, start with its PRD and Milestones in the sidebar.",
          pickOs: false,
        }
  }
  return doc === "workflow" ? workflowFor(track) : envFor(track)
}
