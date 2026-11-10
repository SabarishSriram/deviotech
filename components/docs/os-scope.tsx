"use client"

import { useSyncExternalStore } from "react"

import type { OS } from "@/data/docs/types"
import { TechIcon } from "@/lib/tech-icons"
import { cn } from "@/lib/utils"

/*
 * Remembers which computer the student uses and tags the page with
 * data-os, so CSS can hide every step and picture meant for another OS
 * (see [data-only] in app/globals.css). Server render assumes Windows;
 * the browser switches to the saved choice or a guess from the user agent.
 */

const KEY = "devvy-os"
const listeners = new Set<() => void>()

const systems: { id: OS; label: string; logo: string }[] = [
  { id: "windows", label: "Windows", logo: "Windows" },
  { id: "mac", label: "macOS", logo: "macOS" },
  { id: "linux", label: "Linux", logo: "Linux" },
]

function detect(): OS {
  const ua = navigator.userAgent
  if (/Mac/i.test(ua)) return "mac"
  if (/Linux|X11/i.test(ua) && !/Android/i.test(ua)) return "linux"
  return "windows"
}

function getSnapshot(): OS {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === "mac" || saved === "windows" || saved === "linux") return saved
  } catch {}
  return detect()
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  window.addEventListener("storage", callback)
  return () => {
    listeners.delete(callback)
    window.removeEventListener("storage", callback)
  }
}

function choose(os: OS) {
  try {
    localStorage.setItem(KEY, os)
  } catch {}
  listeners.forEach((l) => l())
}

function useOs() {
  return useSyncExternalStore(subscribe, getSnapshot, () => "windows" as OS)
}

export function OsScope({ children }: { children: React.ReactNode }) {
  const os = useOs()
  return <div data-os={os}>{children}</div>
}

/** "Which computer are you using?" — big at the top, compact in each part. */
export function OsPicker({ compact = false }: { compact?: boolean }) {
  const os = useOs()
  return (
    <div
      role="radiogroup"
      aria-label="Your operating system"
      className={cn("inline-flex gap-0.5 rounded-xl border bg-muted/40 p-1", compact && "rounded-lg")}
    >
      {systems.map((system) => (
        <button
          key={system.id}
          type="button"
          role="radio"
          aria-checked={os === system.id}
          onClick={() => choose(system.id)}
          className={cn(
            "flex items-center gap-2 rounded-lg font-medium transition-colors",
            compact ? "px-2.5 py-1 text-[11px]" : "px-4 py-2 text-sm",
            os === system.id ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <TechIcon name={system.logo} className={compact ? "size-3" : "size-4"} />
          {system.label}
        </button>
      ))}
    </div>
  )
}
