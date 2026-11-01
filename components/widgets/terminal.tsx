"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

type Tone = "cmd" | "ok" | "muted" | "accent"
type Line = { prefix?: string; text: string; tone?: Tone }

const toneClass: Record<Tone, string> = {
  cmd: "text-foreground",
  ok: "text-brand-text",
  muted: "text-muted-foreground",
  accent: "text-brand-text",
}

const lines: Line[] = [
  { prefix: "$", text: "git push origin feat/checkout", tone: "cmd" },
  { prefix: "→", text: "opened pull request #42", tone: "muted" },
  { prefix: "◆", text: "mentor left 2 review comments", tone: "accent" },
  { prefix: "✓", text: "use parameterized queries · ln 42", tone: "ok" },
  { prefix: "✓", text: "extract AuthService · ln 88", tone: "ok" },
  { prefix: "$", text: "git commit --amend && push", tone: "cmd" },
  { prefix: "→", text: "ci: 24 tests passed", tone: "muted" },
  { prefix: "◆", text: "mentor approved the changes", tone: "accent" },
  { prefix: "✓", text: "merged to main · deployed", tone: "ok" },
]

const total = lines.reduce((n, l) => n + l.text.length, 0)
/** Character offset where each line begins in the overall typing sequence. */
const starts = lines.map((_, i) => lines.slice(0, i).reduce((n, l) => n + l.text.length, 0))

/** A looping, self-typing PR-review terminal. Shows full text under reduced-motion. */
export function Terminal({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: "-40px" })
  const [typed, setTyped] = useState(reduce ? total : 0)

  useEffect(() => {
    if (reduce || !inView) return
    let count = typed
    const id = setInterval(() => {
      count += 1
      if (count > total) {
        setTimeout(() => setTyped(0), 2200)
        clearInterval(id)
        return
      }
      setTyped(count)
    }, 38)
    return () => clearInterval(id)
    // re-arm whenever we re-enter view or reset to 0
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, typed === 0])

  // Resolve how much of each line is visible given the global typed count.
  const visible = lines.map((l, i) => {
    const show = Math.max(0, Math.min(l.text.length, typed - starts[i]))
    return { ...l, shown: l.text.slice(0, show), active: show > 0 && show < l.text.length }
  })

  const done = typed >= total

  return (
    <div ref={ref} className={cn("flex flex-col font-mono text-[12.5px] leading-relaxed sm:text-[13px]", className)}>
      {visible.map((l, i) => {
        // Not yet reached: render the full line invisibly so the block keeps
        // a constant height and never pushes neighbouring widgets around.
        const pending = l.shown.length === 0 && !l.active
        return (
          <div key={i} className={cn("flex gap-2", pending && "invisible")}>
            {l.prefix && <span className="w-3 shrink-0 text-muted-foreground">{l.prefix}</span>}
            <span className={toneClass[l.tone ?? "muted"]}>
              {pending ? l.text : l.shown}
              {l.active && <span className="ml-0.5 inline-block w-1.5 animate-blink text-brand">▍</span>}
            </span>
          </div>
        )
      })}

      {/* PR status bar — pinned to the bottom so the log fills its widget */}
      <div aria-hidden="true" className="min-h-4 flex-1" />
      <div className="flex items-center gap-3 border-t pt-3.5">
        <span className={cn("w-20 shrink-0 label-mono", done ? "text-brand-text" : "text-muted-foreground")}>
          {done ? "merged" : "in review"}
        </span>
        <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
          <span
            className="block h-full rounded-full bg-brand transition-[width] duration-200 ease-linear"
            style={{ width: `${(typed / total) * 100}%` }}
          />
        </span>
        <span className="shrink-0 text-xs">
          <span className="text-foreground">+128</span> <span className="text-muted-foreground">−34</span>
        </span>
      </div>
    </div>
  )
}
