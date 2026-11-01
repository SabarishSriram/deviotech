import type { TrackSlug } from "@/data/tracks"

/** One instruction, optionally with a command or file contents to copy. */
export type Step = {
  text: string
  code?: string
  /** File the code belongs in, shown above the block (e.g. "server/src/index.ts"). */
  file?: string
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
  /** Skill name for its logo (see lib/tech-icons). */
  icon?: string
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
  blocks: MockBlock[]
}
