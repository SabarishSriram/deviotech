import "server-only"

import { walkthroughFor } from "@/components/docs/track-walkthroughs"
import type { OS } from "@/data/docs/types"
import { getTrack } from "@/data/tracks"
import { PROGRESS_DOCS, stepRefs, stepsFor, type ProgressDoc } from "@/lib/progress"

export type ProgressRow = { user_id?: string; step_key: string; os: string | null; done_at: string }

export type ProgressSummary = {
  os: OS
  lastAt: string | null
  docs: Record<ProgressDoc, { done: number; total: number }>
}

/** How far a student is through Getting started, counted for the OS they picked. */
export function summarizeProgress(trackSlug: string, rows: ProgressRow[]): ProgressSummary | null {
  const track = getTrack(trackSlug)
  if (!track) return null
  const latest = [...rows].sort((a, b) => b.done_at.localeCompare(a.done_at))[0]
  const os = (latest?.os ?? "windows") as OS
  const done = new Set(rows.map((r) => r.step_key))
  const docs = Object.fromEntries(
    PROGRESS_DOCS.map((doc) => {
      const refs = stepsFor(stepRefs(walkthroughFor(track.slug, doc).parts, `${track.slug}/${doc}`), os)
      return [doc, { done: refs.filter((r) => done.has(r.key)).length, total: refs.length }]
    })
  ) as ProgressSummary["docs"]
  return { os, lastAt: latest?.done_at ?? null, docs }
}
