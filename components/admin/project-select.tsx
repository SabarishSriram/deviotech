"use client"

import { updateApplicationProject } from "@/app/admin/actions"
import type { TrackProject } from "@/data/tracks"

/** Assigns one of the track's three projects; saves as soon as it changes. */
export function ProjectSelect({ id, project, options }: { id: string; project: string | null; options: TrackProject[] }) {
  return (
    <form action={updateApplicationProject}>
      <input type="hidden" name="id" value={id} />
      <select
        name="project"
        defaultValue={project ?? ""}
        aria-label="Project"
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="h-9 w-full rounded-lg border bg-background px-2 text-sm"
      >
        <option value="">Not chosen yet</option>
        {options.map((option) => (
          <option key={option.slug} value={option.slug}>
            {option.name}
          </option>
        ))}
      </select>
    </form>
  )
}
