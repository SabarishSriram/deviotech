"use client"

import { CalendarDays, CheckCircle2, Plug } from "lucide-react"
import { useState } from "react"

import { Mockup } from "@/components/docs/mockup"
import type { ProjectScreen } from "@/data/docs/types"
import { cn } from "@/lib/utils"

/** Every screen of a project: pick one to see its wireframe, what's on it and what it calls. */
export function ScreenGallery({ screens }: { screens: ProjectScreen[] }) {
  const [active, setActive] = useState(0)
  const screen = screens[active]

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div role="tablist" aria-label="Screens" className="flex gap-1 overflow-x-auto border-b bg-muted/30 p-1.5">
        {screens.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm whitespace-nowrap transition-colors",
              i === active ? "bg-background font-medium shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className={cn("font-mono text-[11px]", i === active ? "text-(--tc)" : "")}>{i + 1}</span>
            {s.name}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[3fr_2fr]">
        <div className="rounded-xl border bg-muted/30 p-3 sm:p-4">
          <Mockup mock={screen.mock} />
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-sans text-base font-semibold">{screen.name}</p>
            <p className="mt-1 text-pretty text-muted-foreground">{screen.purpose}</p>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">On this screen</p>
            <ul className="space-y-1.5">
              {screen.shows.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-(--tc)" aria-hidden="true" />
                  <span className="text-pretty">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {screen.calls && (
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Plug className="size-3.5" aria-hidden="true" /> Talks to
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {screen.calls.map((call) => (
                  <li key={call} className="rounded-md border bg-background px-2 py-0.5 font-mono text-[11px]">
                    {call}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" aria-hidden="true" /> You build it in Week {screen.week}.
          </p>
        </div>
      </div>
    </div>
  )
}
