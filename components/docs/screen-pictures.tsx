import { Mockup } from "@/components/docs/mockup"
import type { ProjectScreen, WalkPart } from "@/data/docs/types"
import type { TrackSlug } from "@/data/tracks"
import { trackColorStyle } from "@/lib/track-icons"

/**
 * The pictures for a week walkthrough's screen steps. Steps refer to them as
 * "screen:<id>" or "screens:<id>,<id>" (see screenKey in build-walk.ts).
 * Each renderer takes no OS argument, so it's drawn once for every OS.
 */
export function screenPictures(track: TrackSlug, screens: ProjectScreen[], parts: WalkPart[]) {
  const keys = new Set(parts.flatMap((part) => part.steps.map((step) => step.screen)).filter((s): s is string => typeof s === "string" && /^screens?:/.test(s)))
  const pictures: Record<string, () => React.ReactNode> = {}
  for (const key of keys) {
    const ids = key.replace(/^screens?:/, "").split(",")
    const shown = ids.map((id) => screens.find((s) => s.id === id)).filter((s): s is ProjectScreen => Boolean(s))
    pictures[key] = () => (
      <div style={trackColorStyle(track)} className="track-color space-y-5">
        {shown.map((s) => (
          <div key={s.id}>
            {shown.length > 1 && <p className="mb-2 text-[13px] font-semibold text-[#3a3f47] dark:text-zinc-200">{s.name}</p>}
            <Mockup mock={s.mock} />
          </div>
        ))}
      </div>
    )
  }
  return pictures
}
