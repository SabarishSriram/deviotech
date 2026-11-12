import { aiMlBuilds } from "@/data/docs/build/ai-ml"
import { appBuilds } from "@/data/docs/build/app-development"
import { backendBuilds } from "@/data/docs/build/backend"
import { dataScienceBuilds } from "@/data/docs/build/data-science"
import { frontendBuilds } from "@/data/docs/build/frontend"
import { fullStackBuilds } from "@/data/docs/build/full-stack"
import { javaBuilds } from "@/data/docs/build/java"
import { pythonBuilds } from "@/data/docs/build/python"
import { uiUxBuilds } from "@/data/docs/build/ui-ux"
import type { ProjectBuild } from "@/data/docs/types"
import type { TrackSlug } from "@/data/tracks"

/*
 * Week-by-week build plans, per track and project. A project without a plan
 * here falls back to its short milestone list (ProjectDocs.weeks).
 */
const builds: Partial<Record<TrackSlug, Record<string, ProjectBuild>>> = {
  "full-stack": fullStackBuilds,
  backend: backendBuilds,
  frontend: frontendBuilds,
  "app-development": appBuilds,
  "ai-ml": aiMlBuilds,
  "data-science": dataScienceBuilds,
  python: pythonBuilds,
  java: javaBuilds,
  "ui-ux": uiUxBuilds,
}

export function getProjectBuild(track: TrackSlug, projectSlug: string): ProjectBuild | undefined {
  return builds[track]?.[projectSlug]
}
