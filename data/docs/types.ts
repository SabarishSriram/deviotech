import type { TrackSlug } from "@/data/tracks"

export type OS = "mac" | "windows" | "linux"

/** One instruction, optionally with a command or file contents to copy. */
export type Step = {
  text: string
  code?: string
  /** File the code belongs in, shown above the block (e.g. "server/src/index.ts"). */
  file?: string
  /** Logo shown instead of the step number (a name from lib/tech-icons, e.g. "Kaggle"). */
  icon?: string
  /** When the instruction differs by operating system: one row per OS, each with its logo. */
  variants?: { os: OS; text: string; code?: string }[]
}

export type ToolId =
  | "vscode"
  | "git"
  | "github"
  | "node"
  | "postgres"
  | "mongodb"
  | "docker"
  | "python"
  | "jupyter"
  | "java"
  | "intellij"
  | "expo"
  | "figma"
  | "powerbi"
  | "ai"

/** A tool the student installs, with why it's needed and how to check it worked. */
export type Tool = {
  id: ToolId
  name: string
  /** Logo name(s) from lib/tech-icons — several for tool bundles like the AI tools. */
  icons?: string[]
  what: string
  why: string
  /** Per-OS steps, or `all` when every OS is the same. */
  install: { mac: Step[]; windows: Step[]; linux: Step[] } | { all: Step[] }
  verify?: { code: string; expect: string }
  tip?: string
  optional?: boolean
}

/** Track-level setup: which tools to install, then how to create the project. */
export type SetupGuide = {
  intro: string
  tools: ToolId[]
  start: { title: string; steps: Step[] }[]
}

/** The stack every project in a track shares. */
export type TrackArchitecture = {
  summary: string
  parts: { name: string; role: string }[]
  /** Heading for the project's interface section, e.g. "API endpoints" or "Screens". */
  interfaceTitle: string
  /** Heading for the project's data section, e.g. "Data model" or "Dataset". */
  dataTitle: string
}

/** Everything a student needs to build one project. */
export type ProjectDocs = {
  slug: string
  pitch: string
  users: { who: string; need: string }[]
  mustHave: string[]
  niceToHave: string[]
  outOfScope: string[]
  flows: { name: string; steps: string[] }[]
  overview: string
  data: { name: string; fields: string[] }[]
  interface: { label: string; detail: string }[]
  weeks: [string[], string[], string[], string[]]
  doneWhen: string[]
}

/** One endpoint in a project's API contract. */
export type Endpoint = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  path: string
  /** Who may call it, e.g. "Public", "Logged-in user", "Admin". */
  auth: string
  summary: string
  /** Example JSON body (omit for GET/DELETE). */
  request?: string
  /** Example JSON response with its status code. */
  response: string
  errors?: string[]
}

/** The agreement between frontend and backend: every endpoint, exactly. */
export type ApiContract = {
  baseUrl: string
  auth: string
  errorShape: string
  endpoints: Endpoint[]
}

export type TrackDocs = { track: TrackSlug; projects: [ProjectDocs, ProjectDocs, ProjectDocs] }

/** A section of a prose guide (welcome, workflow, standards, …). */
export type GuideSection = {
  title: string
  /** Shows OS logos next to the title for OS-specific sections. */
  os?: OS[]
  paragraphs?: string[]
  bullets?: string[]
  steps?: Step[]
  /** Tick-box items (rubric, submission checklist). */
  checklist?: string[]
  /** A code block or file with no step around it. */
  code?: { file?: string; code: string }
  links?: { label: string; url: string; note: string }[]
}

/* ------------------------------------------------------------------ */
/* Illustrative screen mockups                                         */
/* ------------------------------------------------------------------ */

export type MockBlock =
  | { kind: "kpis"; items: { label: string; value: string }[] }
  | { kind: "bars"; title: string; values: number[]; labels?: string[] }
  | { kind: "table"; columns: string[]; rows: string[][] }
  | { kind: "kanban"; columns: { title: string; cards: string[] }[] }
  | { kind: "cards"; items: { title: string; meta: string; badge?: string }[] }
  | { kind: "list"; title?: string; items: { title: string; meta?: string; right?: string; done?: boolean }[] }
  | { kind: "form"; title: string; fields: string[]; button: string }
  | { kind: "posters"; title: string; items: string[] }
  | { kind: "search"; placeholder: string; chips?: string[] }
  | { kind: "stat"; label: string; value: string; caption?: string }
  | { kind: "chat"; messages: { from: "user" | "bot"; text: string }[] }
  | { kind: "terminal"; lines: { text: string; tone?: "cmd" | "ok" | "muted" | "warn" }[] }

/** A mock of the project's main screen, in a browser, phone or terminal frame. */
export type Mock = {
  frame: "browser" | "phone" | "terminal"
  title: string
  url?: string
  /** Sidebar (browser) or bottom tabs (phone). */
  nav?: string[]
  /** Which nav item is highlighted (default: the first). */
  active?: number
  blocks: MockBlock[]
}

/* ------------------------------------------------------------------ */
/* Walkthroughs — linear, start-from-nothing guides (e.g. setup)        */
/* ------------------------------------------------------------------ */

/** A screen picture, the same for every OS or one per OS (ids from components/docs/screens). */
export type ScreenRef = string | Partial<Record<OS, string>>

/** One thing to do inside a step. */
export type WalkAction = {
  text: string
  code?: string
  /** File the code belongs in, shown above the block. */
  file?: string
  /** Wrap long lines — for prose to copy, like AI prompts. */
  wrap?: boolean
  /** Only show this action on these operating systems. */
  os?: OS[]
}

/** One numbered step: what to do, why, a picture of it, and how to check it worked. */
export type WalkStep = {
  title: string
  /** Only show this step on these operating systems. */
  os?: OS[]
  why?: string
  actions: WalkAction[]
  screen?: ScreenRef
  caption?: string
  check?: { text: string; code?: string; expect?: string; os?: OS[] }[]
  /** A friendly tip. */
  note?: string
  /** Something that commonly goes wrong. */
  warn?: string
}

/** A chapter of a walkthrough, e.g. "Install VS Code". */
export type WalkPart = {
  id: string
  title: string
  intro: string
  /** Rough time, e.g. "5 min". */
  time?: string
  steps: WalkStep[]
}

/* ------------------------------------------------------------------ */
/* Build plans — the exact project, week by week, built with AI        */
/* ------------------------------------------------------------------ */

/**
 * One task = one branch = one pull request. The student builds it with an
 * AI tool, then proves they understand it before it's merged.
 */
export type BuildTask = {
  /** Short id, unique within the week (used for progress ticks). */
  id: string
  title: string
  /** Why this task matters, in one or two sentences. */
  why: string
  /** Branch name, e.g. "feat/auth". Omit for UI/UX tasks (no Git). */
  branch?: string
  /** What to paste into the AI tool after the project brief. */
  prompt: string
  /** Things to do yourself before or after prompting (create a file, run a command). */
  steps?: WalkAction[]
  /** Questions the student must be able to answer before opening the PR. */
  understand: string[]
  /** How to prove it works. */
  check: { text: string; code?: string; expect?: string }[]
  /** The usual ways it breaks, and where to look. */
  debug?: string[]
  /** Commit message for the PR. */
  commit?: string
  /** Ids of the project screens this task builds (data/docs/project-screens.ts). */
  screens?: string[]
}

export type BuildWeek = {
  /** One or two sentences: what this week is for. */
  intro: string
  tasks: BuildTask[]
  /** "Done when" lines for the week, checked in the weekly review. */
  done: string[]
}

export type ProjectBuild = [BuildWeek, BuildWeek, BuildWeek, BuildWeek]

/** One screen of a project, shown in Start here, Week 1 and the task that builds it. */
export type ProjectScreen = {
  /** Unique within the project, e.g. "board". */
  id: string
  name: string
  /** What the user does here, in one sentence. */
  purpose: string
  /** The things on the screen the student must build. */
  shows: string[]
  /** API endpoints this screen calls. */
  calls?: string[]
  /** The week this screen gets built. */
  week: 1 | 2 | 3 | 4
  mock: Mock
}
