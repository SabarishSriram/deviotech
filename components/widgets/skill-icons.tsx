"use client"

import { useEffect, useRef, useState } from "react"

import { TechIcon } from "@/lib/tech-icons"
import { cn } from "@/lib/utils"

const GAP = 6 // gap-1.5
const ROWS = 3

/** How many items fit in ROWS rows of `width`, laid out like flex-wrap. */
function countFitting(widths: number[], width: number) {
  let row = 1
  let x = 0
  for (let i = 0; i < widths.length; i++) {
    const next = x === 0 ? widths[i] : x + GAP + widths[i]
    if (next <= width) {
      x = next
      continue
    }
    row += 1
    if (row > ROWS) return i
    x = widths[i]
  }
  return widths.length
}

function Chip({ skill }: { skill: string }) {
  return (
    <li className="flex items-center gap-1.5 rounded-full border bg-background/60 px-2.5 py-1 font-mono text-[11px] whitespace-nowrap text-muted-foreground">
      <TechIcon name={skill} className="size-3 shrink-0" />
      {skill}
    </li>
  )
}

const moreChip = "flex items-center rounded-full border border-dashed px-2.5 py-1 font-mono text-[11px] whitespace-nowrap text-muted-foreground"

/**
 * Named skill chips that fill up to three rows of the available width.
 * Whatever doesn't fit collapses into a final "+N more" chip.
 */
export function SkillIcons({ skills, label, className }: { skills: string[]; label: string; className?: string }) {
  const listRef = useRef<HTMLUListElement>(null)
  const measureRef = useRef<HTMLUListElement>(null)
  const [count, setCount] = useState(skills.length)

  useEffect(() => {
    const list = listRef.current
    const measure = measureRef.current
    if (!list || !measure) return

    const observer = new ResizeObserver(() => {
      const items = Array.from(measure.children) as HTMLElement[]
      const plusWidth = items.pop()?.offsetWidth ?? 0
      const widths = items.map((el) => el.offsetWidth)
      const width = list.clientWidth

      if (countFitting(widths, width) === widths.length) {
        setCount(widths.length)
        return
      }
      // Drop chips until the "+N more" chip also fits on the last row.
      let n = countFitting(widths, width)
      while (n > 0 && countFitting([...widths.slice(0, n), plusWidth], width) < n + 1) n -= 1
      setCount(n)
    })
    observer.observe(list)
    return () => observer.disconnect()
  }, [skills])

  const rest = skills.slice(count)

  return (
    <div className={cn("relative", className)}>
      <ul ref={listRef} aria-label={label} className="flex flex-wrap gap-1.5">
        {skills.slice(0, count).map((skill) => (
          <Chip key={skill} skill={skill} />
        ))}
        {rest.length > 0 && (
          <li title={rest.join(", ")} className={moreChip}>
            +{rest.length} more
            <span className="sr-only">: {rest.join(", ")}</span>
          </li>
        )}
      </ul>

      {/* Invisible copy of every chip, used only to measure widths */}
      <ul ref={measureRef} aria-hidden="true" className="pointer-events-none invisible absolute inset-x-0 top-0 flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <Chip key={skill} skill={skill} />
        ))}
        <li className={moreChip}>+99 more</li>
      </ul>
    </div>
  )
}
