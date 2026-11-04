"use client"

import { useState } from "react"

import { Steps } from "@/components/docs/steps"
import { TechIcon } from "@/lib/tech-icons"
import type { Step } from "@/data/docs/types"
import { cn } from "@/lib/utils"

const systems = [
  { id: "mac", label: "macOS", logo: "macOS" },
  { id: "windows", label: "Windows", logo: "Windows" },
  { id: "linux", label: "Linux", logo: "Linux" },
] as const

/** Install steps with a macOS / Windows / Linux switcher. */
export function OsTabs({ install }: { install: { mac: Step[]; windows: Step[]; linux: Step[] } }) {
  const [os, setOs] = useState<(typeof systems)[number]["id"]>("windows")

  return (
    <div>
      <div role="tablist" aria-label="Operating system" className="mb-5 inline-flex gap-0.5 rounded-xl border bg-muted/40 p-1">
        {systems.map((system) => (
          <button
            key={system.id}
            type="button"
            role="tab"
            aria-selected={os === system.id}
            onClick={() => setOs(system.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors",
              os === system.id ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <TechIcon name={system.logo} className="size-3.5" />
            {system.label}
          </button>
        ))}
      </div>
      <Steps steps={install[os]} />
    </div>
  )
}
