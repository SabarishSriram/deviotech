"use client"

import { Check, RotateCcw } from "lucide-react"
import { createContext, useCallback, useContext, useMemo, useRef, useState, useSyncExternalStore, useTransition } from "react"

import { setStepDone } from "@/app/(site)/portal/docs/actions"
import { useOs } from "@/components/docs/os-scope"
import { stepAnchor, stepsFor, type StepRef } from "@/lib/progress"
import { cn } from "@/lib/utils"

/*
 * "Done" ticks for Getting started steps. Signed-in students save to their
 * account (table doc_progress) so mentors can see progress in admin; if that
 * isn't available, ticks are kept in this browser instead.
 */

type Mode = "account" | "local"
type Ctx = { done: Set<string>; toggle: (key: string) => void; refs: StepRef[] }

const ProgressContext = createContext<Ctx | null>(null)

const storageKey = (scope: string) => `devvy-progress:${scope}`
const listeners = new Set<() => void>()

function readLocal(scope: string): string {
  try {
    return localStorage.getItem(storageKey(scope)) ?? "[]"
  } catch {
    return "[]"
  }
}

export function ProgressProvider({
  scope,
  mode,
  initial,
  refs,
  children,
}: {
  scope: string
  mode: Mode
  initial: string[]
  refs: StepRef[]
  children: React.ReactNode
}) {
  const os = useOs()
  const [accountDone, setAccountDone] = useState(() => new Set(initial))
  const accountRef = useRef(accountDone)
  const [, startTransition] = useTransition()

  // Browser-only mode: localStorage, read through a store so the server render matches.
  const localRaw = useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      window.addEventListener("storage", cb)
      return () => {
        listeners.delete(cb)
        window.removeEventListener("storage", cb)
      }
    },
    () => readLocal(scope),
    () => "[]"
  )
  const localDone = useMemo(() => new Set<string>(JSON.parse(localRaw) as string[]), [localRaw])

  const done = mode === "account" ? accountDone : localDone

  const toggle = useCallback(
    (key: string) => {
      if (mode === "local") {
        // Read the latest saved state, not this render's copy, so quick clicks don't overwrite each other.
        const set = new Set<string>(JSON.parse(readLocal(scope)) as string[])
        if (set.has(key)) set.delete(key)
        else set.add(key)
        try {
          localStorage.setItem(storageKey(scope), JSON.stringify([...set]))
        } catch {}
        listeners.forEach((l) => l())
        return
      }
      const next = !accountRef.current.has(key)
      const apply = (on: boolean) =>
        setAccountDone((prev) => {
          const set = new Set(prev)
          if (on) set.add(key)
          else set.delete(key)
          accountRef.current = set
          return set
        })
      apply(next)
      startTransition(async () => {
        const res = await setStepDone(key, next, os)
        if (!res.ok) apply(!next) // Put it back if saving failed.
      })
    },
    [mode, os, scope]
  )

  return <ProgressContext.Provider value={{ done, toggle, refs }}>{children}</ProgressContext.Provider>
}

function useProgress() {
  return useContext(ProgressContext)
}

/** The "Mark as done" button at the bottom of a step. */
export function StepCheck({ stepKey }: { stepKey: string }) {
  const ctx = useProgress()
  if (!ctx) return null
  const isDone = ctx.done.has(stepKey)
  return (
    <button
      type="button"
      onClick={() => ctx.toggle(stepKey)}
      data-step-done={isDone ? "" : undefined}
      aria-pressed={isDone}
      className={cn(
        "mt-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
        isDone
          ? "border-emerald-600/40 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
          : "text-muted-foreground hover:border-foreground/30 hover:text-foreground"
      )}
    >
      {isDone ? <Check className="size-3.5" aria-hidden="true" /> : <span className="size-3.5 rounded-full border border-current" aria-hidden="true" />}
      {isDone ? "Done" : "Mark as done"}
    </button>
  )
}

function count(ctx: Ctx, os: Parameters<typeof stepsFor>[1], partId?: string) {
  const steps = stepsFor(ctx.refs, os).filter((r) => !partId || r.partId === partId)
  return { total: steps.length, done: steps.filter((r) => ctx.done.has(r.key)).length, next: steps.find((r) => !ctx.done.has(r.key)) }
}

function Bar({ value }: { value: number }) {
  return (
    <span className="block h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <span className="block h-full rounded-full bg-emerald-600 transition-[width] dark:bg-emerald-500" style={{ width: `${Math.round(value * 100)}%` }} />
    </span>
  )
}

/** "3 of 9 done" in a part's header. */
export function PartProgress({ partId }: { partId: string }) {
  const ctx = useProgress()
  const os = useOs()
  if (!ctx) return null
  const { total, done } = count(ctx, os, partId)
  if (!total) return null
  return (
    <span className="flex w-36 flex-col gap-1">
      <span className={cn("text-[11px]", done === total ? "font-medium text-emerald-700 dark:text-emerald-400" : "text-muted-foreground")}>
        {done === total ? "✓ Part done" : `${done} of ${total} steps done`}
      </span>
      <Bar value={done / total} />
    </span>
  )
}

/** Overall progress with a link back to the first step that isn't done. */
export function OverallProgress() {
  const ctx = useProgress()
  const os = useOs()
  if (!ctx) return null
  const { total, done, next } = count(ctx, os)
  return (
    <section className="mt-6 rounded-2xl border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-medium">
          {done === total ? "All done 🎉" : done ? `${done} of ${total} steps done` : `${total} steps — tick each one as you finish it`}
        </p>
        {next && done > 0 && (
          <a href={`#${stepAnchor(next.key)}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-text hover:underline">
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Continue where you left off
          </a>
        )}
      </div>
      <div className="mt-3">
        <Bar value={total ? done / total : 0} />
      </div>
    </section>
  )
}
