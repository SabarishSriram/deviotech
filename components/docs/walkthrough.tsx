import { AlertTriangle, CheckCircle2, Clock, Lightbulb } from "lucide-react"

import { CodeBlock } from "@/components/docs/code-block"
import { OsPicker, OsScope } from "@/components/docs/os-scope"
import { OverallProgress, PartProgress, ProgressProvider, StepCheck } from "@/components/docs/progress"
import { Screenshot } from "@/components/docs/screens/screenshot"
import type { OS, ScreenRef, WalkPart, WalkStep } from "@/data/docs/types"
import { stepAnchor, stepRefs } from "@/lib/progress"

const ALL: OS[] = ["windows", "mac", "linux"]

/** Hides an element unless the reader's OS is in the list (CSS in globals.css). */
function only(os?: OS[]) {
  return os && os.length < 3 ? { "data-only": os.join(" ") } : {}
}

/** Turns "(1)" in step text into the same red numbered badge used in the pictures. */
function withMarkers(text: string) {
  return text.split(/(\(\d\))/g).map((part, i) => {
    const n = part.match(/^\((\d)\)$/)?.[1]
    if (!n) return part
    return (
      <span
        key={i}
        aria-label={`marker ${n}`}
        className="mx-0.5 inline-flex size-[18px] translate-y-[-1px] items-center justify-center rounded-full bg-[#ff2a33] align-middle font-mono text-[10px] font-bold text-white"
      >
        {n}
      </span>
    )
  })
}

function screenFor(ref: ScreenRef, os: OS) {
  return typeof ref === "string" ? ref : ref[os]
}

function StepScreens({ step, screens }: { step: WalkStep; screens: Record<string, (os: OS) => React.ReactNode> }) {
  if (!step.screen) return null
  const ref = step.screen
  // A screen that takes no OS argument looks the same everywhere: draw it once.
  const shared = typeof ref === "string" ? screens[ref] : undefined
  if (shared && shared.length === 0) {
    return <Screenshot caption={step.caption}>{shared("windows")}</Screenshot>
  }
  return (
    <>
      {(step.os ?? ALL).map((os) => {
        const id = screenFor(ref, os)
        const node = id ? screens[id]?.(os) : null
        if (!node) return null
        return (
          <div key={os} data-only={os}>
            <Screenshot caption={step.caption}>{node}</Screenshot>
          </div>
        )
      })}
    </>
  )
}

function Step({ step, screens, stepKey }: { step: WalkStep; screens: Record<string, (os: OS) => React.ReactNode>; stepKey?: string }) {
  return (
    <li {...only(step.os)} id={stepKey ? stepAnchor(stepKey) : undefined} className="walk-step relative scroll-mt-24 pl-11">
      <span
        aria-hidden="true"
        className="walk-step-num absolute top-0 left-0 flex size-8 items-center justify-center rounded-full border bg-card font-mono text-xs font-semibold"
      />
      <h4 className="pt-1 font-sans text-[15px] font-semibold">{step.title}</h4>
      {step.why && <p className="mt-1.5 text-pretty text-muted-foreground">{withMarkers(step.why)}</p>}

      <ul className="mt-2.5 space-y-2">
        {step.actions.map((action, i) => (
          <li key={i} {...only(action.os)} className="flex gap-2.5">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-foreground/50" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-pretty">{withMarkers(action.text)}</p>
              {action.code && <CodeBlock code={action.code} file={action.file} />}
            </div>
          </li>
        ))}
      </ul>

      <StepScreens step={step} screens={screens} />

      {step.check && (
        <div className="mt-4 space-y-2 rounded-lg border border-emerald-600/25 bg-emerald-600/5 px-4 py-3">
          {step.check.map((check, i) => (
            <div key={i} {...only(check.os)} className="flex gap-2.5">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-pretty">
                  <span className="font-medium">Check: </span>
                  {withMarkers(check.text)}
                </p>
                {check.code && <CodeBlock code={check.code} />}
                {check.expect && <p className="mt-1.5 text-xs text-muted-foreground">You should see: {check.expect}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {step.note && (
        <p className="mt-3 flex gap-2.5 rounded-lg border border-brand/25 bg-brand/5 px-4 py-3 text-pretty">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-brand-text" aria-hidden="true" />
          <span>{withMarkers(step.note)}</span>
        </p>
      )}
      {step.warn && (
        <p className="mt-3 flex gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-pretty">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          <span>{withMarkers(step.warn)}</span>
        </p>
      )}
      {stepKey && <StepCheck stepKey={stepKey} />}
    </li>
  )
}

/**
 * A start-from-nothing guide: pick your OS once, then follow numbered
 * steps, each with a picture of exactly what you'll see.
 */
export function Walkthrough({
  parts,
  screens,
  done,
  doneTitle = "You're set up",
  doneIntro = "If you can tick every line, your computer is ready for the program.",
  next,
  pickOs = true,
  progress,
}: {
  /** Turn on "Mark as done" ticks. scope is "<track>/<doc>"; account mode saves to the student's account. */
  progress?: { scope: string; mode: "account" | "local"; initial: string[] }
  parts: WalkPart[]
  screens: Record<string, (os: OS) => React.ReactNode>
  done?: string[]
  doneTitle?: string
  doneIntro?: string
  next?: string
  /** Show the "Which computer are you using?" picker (off for pages that are the same on every OS). */
  pickOs?: boolean
}) {
  const refs = progress ? stepRefs(parts, progress.scope) : []
  // refs are in step order, so step j of part i is at offsets[i] + j.
  const offsets = parts.map((_, i) => parts.slice(0, i).reduce((n, p) => n + p.steps.length, 0))
  const content = (
    <>
      {pickOs && (
        <section className="mt-8 rounded-2xl border bg-card p-5 sm:p-6">
          <p className="font-sans text-base font-semibold">Which computer are you using?</p>
          <p className="mt-1 text-pretty text-muted-foreground">
            Pick yours and the guide shows only your steps and screenshots. You can switch any time.
          </p>
          <div className="mt-4">
            <OsPicker />
          </div>
        </section>
      )}

      {progress && <OverallProgress />}

      <section className="mt-8">
        <h2 className="mb-3 font-sans text-lg font-semibold tracking-tight">What you&apos;ll do</h2>
        <ol className="divide-y overflow-hidden rounded-xl border">
          {parts.map((part, i) => (
            <li key={part.id}>
              <a href={`#part-${part.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[11px]">{i + 1}</span>
                <span className="flex-1 font-medium">{part.title}</span>
                {part.time && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" aria-hidden="true" />
                    {part.time}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-muted-foreground">
          Red numbered circles in the pictures match the numbers in the steps. Your names, versions and colours may look slightly different —
          that&apos;s fine.
        </p>
      </section>

      {parts.map((part, i) => (
        <section key={part.id} id={`part-${part.id}`} className="walk-part mt-12 scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b pb-3">
            <div>
              <p className="font-mono text-xs text-muted-foreground">
                Part {i + 1} of {parts.length}
                {part.time && <> · about {part.time}</>}
              </p>
              <h2 className="mt-1 font-sans text-xl font-semibold tracking-tight">{part.title}</h2>
            </div>
            <span className="flex items-end gap-4">
              {progress && <PartProgress partId={part.id} />}
              {pickOs && <OsPicker compact />}
            </span>
          </div>
          <p className="mt-4 text-pretty text-muted-foreground">{part.intro}</p>
          <ol className="mt-6 space-y-10">
            {part.steps.map((step, j) => (
              <Step key={j} step={step} screens={screens} stepKey={refs[offsets[i] + j]?.key} />
            ))}
          </ol>
        </section>
      ))}

      {done && (
        <section className="mt-14 rounded-2xl border border-emerald-600/25 bg-emerald-600/5 p-6">
          <h2 className="font-sans text-xl font-semibold tracking-tight">{doneTitle}</h2>
          <p className="mt-1 text-muted-foreground">{doneIntro}</p>
          <ul className="mt-4 space-y-2">
            {done.map((item) => (
              <li key={item} className="flex gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span className="text-pretty">{item}</span>
              </li>
            ))}
          </ul>
          {next && <p className="mt-5 border-t border-emerald-600/20 pt-4 font-medium">{next}</p>}
        </section>
      )}
    </>
  )
  return (
    <OsScope>
      {progress ? (
        <ProgressProvider scope={progress.scope} mode={progress.mode} initial={progress.initial} refs={refs}>
          {content}
        </ProgressProvider>
      ) : (
        content
      )}
    </OsScope>
  )
}
