import type { OS, WalkPart } from "@/data/docs/types"

/*
 * Getting started progress: every walkthrough step gets a stable key, so a
 * student's ticks (table doc_progress) survive small content edits and the
 * admin portal can count them.
 */

export type StepRef = { key: string; partId: string; os?: OS[] }

export const PROGRESS_DOCS = ["setup", "workflow", "environment"] as const
export type ProgressDoc = (typeof PROGRESS_DOCS)[number]

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)

/** One key per step: "<scope>/<part>/<step title>[@os]". Scope is "<track>/<doc>". */
export function stepRefs(parts: WalkPart[], scope: string): StepRef[] {
  const seen = new Set<string>()
  const refs: StepRef[] = []
  for (const part of parts) {
    for (const step of part.steps) {
      let key = `${scope}/${part.id}/${slug(step.title)}${step.os && step.os.length < 3 ? `@${step.os.join("-")}` : ""}`
      for (let n = 2; seen.has(key); n++) key = `${key.replace(/~\d+$/, "")}~${n}`
      seen.add(key)
      refs.push({ key, partId: part.id, os: step.os })
    }
  }
  return refs
}

/** Steps that apply on this OS. */
export function stepsFor(refs: StepRef[], os: OS) {
  return refs.filter((r) => !r.os || r.os.includes(os))
}

export function isStepKey(key: string) {
  return key.length <= 200 && /^[a-z0-9-]+\/(setup|workflow|environment|week-[1-4])\/[a-z0-9-]+\/[a-z0-9-]+(@[a-z-]+)?(~\d+)?$/.test(key)
}

/** The id a step's element gets, so "Continue where you left off" can jump to it. */
export function stepAnchor(key: string) {
  return key.replace(/[^a-z0-9-]/g, "_")
}
