"use client"

import { useState } from "react"

import { Steps } from "@/components/docs/steps"
import type { Step } from "@/data/docs/types"
import { cn } from "@/lib/utils"

const systems = [
  { id: "mac", label: "macOS" },
  { id: "windows", label: "Windows" },
  { id: "linux", label: "Linux" },
] as const

/** Install steps with a macOS / Windows / Linux switcher. */
export function OsTabs({ install }: { install: { mac: Step[]; windows: Step[]; linux: Step[] } }) {
  const [os, setOs] = useState<(typeof systems)[number]["id"]>("windows")

  return (
    <div>
      <div role="tablist" aria-label="Operating system" className="mb-4 inline-flex rounded-lg border bg-muted/40 p-0.5">
        {systems.map((system) => (
          <button
            key={system.id}
            type="button"
            role="tab"
            aria-selected={os === system.id}
            onClick={() => setOs(system.id)}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              os === system.id ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {system.label}
          </button>
        ))}
      </div>
      <Steps steps={install[os]} />
    </div>
  )
}
