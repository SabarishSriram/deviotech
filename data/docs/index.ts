import { appDevelopmentDocs } from "@/data/docs/projects/app-development"
import { aiMlDocs } from "@/data/docs/projects/ai-ml"
import { backendDocs } from "@/data/docs/projects/backend"
import { dataScienceDocs } from "@/data/docs/projects/data-science"
import { frontendDocs } from "@/data/docs/projects/frontend"
import { fullStackDocs } from "@/data/docs/projects/full-stack"
import { javaDocs } from "@/data/docs/projects/java"
import { pythonDocs } from "@/data/docs/projects/python"
import { uiUxDocs } from "@/data/docs/projects/ui-ux"
import { contracts } from "@/data/docs/contracts"
import type { ProjectDocs, TrackDocs } from "@/data/docs/types"
import { getTrack, type TrackSlug } from "@/data/tracks"

export { setupGuides, trackArchitecture, welcomeGuide, workflowGuide } from "@/data/docs/guides"
export { tools } from "@/data/docs/tools"
export { contracts } from "@/data/docs/contracts"
export { sampleData } from "@/data/docs/project-data"

const allDocs: Record<TrackSlug, TrackDocs> = {
  "full-stack": fullStackDocs,
  backend: backendDocs,
  frontend: frontendDocs,
  "app-development": appDevelopmentDocs,
  "ai-ml": aiMlDocs,
  "data-science": dataScienceDocs,
  python: pythonDocs,
  java: javaDocs,
  "ui-ux": uiUxDocs,
}

export function getProjectDocs(track: TrackSlug, projectSlug: string): ProjectDocs | undefined {
  return allDocs[track].projects.find((p) => p.slug === projectSlug)
}

/** True when `projectSlug` is one of the three projects proposed for `track`. */
export function isTrackProject(track: string, projectSlug: string) {
  return Boolean(getTrack(track)?.projects.some((p) => p.slug === projectSlug))
}

/* The docs a student can open. Everything outside "Your project" is open to
   any logged-in student; project docs unlock once they've paid and a project
   is assigned. */
export const DOC_PAGES = [
  { id: "welcome", title: "Welcome", group: "Getting started", locked: false },
  { id: "workflow", title: "How we work", group: "Getting started", locked: false },
  { id: "setup", title: "Setup", group: "Getting started", locked: false },
  { id: "environment", title: "Environment & secrets", group: "Getting started", locked: false },
  { id: "standards", title: "Coding standards", group: "Building", locked: false },
  { id: "testing", title: "Testing", group: "Building", locked: false },
  { id: "deployment", title: "Deployment", group: "Building", locked: false },
  { id: "troubleshooting", title: "Troubleshooting", group: "Building", locked: false },
  { id: "resources", title: "Resources", group: "Building", locked: false },
  { id: "rubric", title: "Review rubric", group: "Reviews", locked: false },
  { id: "submission", title: "Submission checklist", group: "Reviews", locked: false },
  { id: "prd", title: "PRD", group: "Your project", locked: true },
  { id: "flows", title: "User flows", group: "Your project", locked: true },
  { id: "architecture", title: "Architecture", group: "Your project", locked: true },
  { id: "api", title: "API contract", group: "Your project", locked: true },
  { id: "data", title: "Sample data", group: "Your project", locked: true },
  { id: "milestones", title: "Milestones", group: "Your project", locked: true },
] as const

export type DocId = (typeof DOC_PAGES)[number]["id"]

export function isDocId(value: unknown): value is DocId {
  return DOC_PAGES.some((page) => page.id === value)
}

/** Doc pages that apply to a project — "API contract" only exists for projects with an API. */
export function pagesFor(projectSlug: string | null) {
  return DOC_PAGES.filter((page) => page.id !== "api" || (projectSlug !== null && projectSlug in contracts))
}
