"use client"

import { AlertTriangle, Brain, Check, Fingerprint, SearchCheck, Zap, type LucideIcon } from "lucide-react"
import { useInView, useReducedMotion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

import { FadeIn } from "@/components/fade-in"
import { Section, SectionHeading } from "@/components/section"
import { buildWithAi, type BuildWithAiId } from "@/data/site"
import { aiTools } from "@/lib/ai-tools"
import { useTick } from "@/lib/use-tick"
import { cn } from "@/lib/utils"

const icons: Record<BuildWithAiId, LucideIcon> = {
  plan: Brain,
  build: Zap,
  review: SearchCheck,
  own: Fingerprint,
}

/** How long each stage plays before auto-advancing. */
const STAGE_MS = 6000

const pop = "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 motion-safe:duration-300"

export function BuildWithAi() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: "-120px" })
  const [active, setActive] = useState(0)
  // Once someone picks a stage themselves, stop auto-advancing.
  const [pinned, setPinned] = useState(false)
  const autoplay = inView && !pinned && !reduce

  useEffect(() => {
    if (!autoplay) return
    const id = setInterval(() => setActive((n) => (n + 1) % buildWithAi.items.length), STAGE_MS)
    return () => clearInterval(id)
  }, [autoplay, active])

  const select = (index: number) => {
    setActive(index)
    setPinned(true)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const delta = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 0
    if (!delta) return
    event.preventDefault()
    const next = (active + delta + buildWithAi.items.length) % buildWithAi.items.length
    select(next)
    document.getElementById(`ai-tab-${buildWithAi.items[next].id}`)?.focus()
  }

  const item = buildWithAi.items[active]

  return (
    <Section id="build-with-ai" aria-labelledby="build-with-ai-title" className="border-t">
      <SectionHeading
        id="build-with-ai-title"
        eyebrow={buildWithAi.eyebrow}
        title={buildWithAi.title}
        description={buildWithAi.description}
      />

      <FadeIn>
        <div ref={ref} className="grid gap-4 lg:grid-cols-[5fr_7fr] lg:gap-6">
          {/* ---- Stage picker ---- */}
          <div role="tablist" aria-label="AI workflow stages" aria-orientation="vertical" onKeyDown={onKeyDown} className="flex flex-col gap-2">
            {buildWithAi.items.map((stage, index) => {
              const Icon = icons[stage.id]
              const selected = index === active
              return (
                <button
                  key={stage.id}
                  id={`ai-tab-${stage.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="ai-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(index)}
                  className={cn(
                    "group relative flex gap-4 overflow-hidden rounded-3xl border p-5 text-left transition-all duration-300 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                    selected ? "border-brand/40 bg-card shadow-[0_20px_40px_-28px_var(--brand)]" : "border-transparent hover:bg-card/60"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-2xl border transition-colors duration-300",
                      selected ? "border-brand/50 bg-brand/10 text-brand-text" : "bg-muted/40 text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                      <span className="font-heading font-semibold tracking-tight uppercase">{stage.title}</span>
                    </span>
                    <span
                      className={cn(
                        "mt-1 block text-sm text-muted-foreground transition-opacity duration-300",
                        !selected && "lg:opacity-70"
                      )}
                    >
                      {stage.description}
                    </span>
                  </span>

                  {/* autoplay progress */}
                  {selected && autoplay && (
                    <span
                      key={active}
                      aria-hidden="true"
                      className="absolute inset-x-5 bottom-0 h-0.5 origin-left rounded-full bg-brand"
                      style={{ animation: `bar-write ${STAGE_MS}ms linear both` }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* ---- Live console ---- */}
          <div
            id="ai-panel"
            role="tabpanel"
            aria-labelledby={`ai-tab-${item.id}`}
            className="widget flex min-h-[26rem] flex-col"
          >
            <div aria-hidden="true" className="widget-dots pointer-events-none absolute inset-0 opacity-40 mask-[radial-gradient(circle_at_100%_0%,#000,transparent_55%)]" />

            <div className="relative flex items-center justify-between gap-3 border-b px-5 py-3.5">
              <span className="flex items-center gap-2 label-mono text-muted-foreground">
                <span className="size-2 rounded-full bg-brand" aria-hidden="true" />
                ai-session · {item.id}
              </span>
              <span className="flex items-center gap-1.5">
                {aiTools.map(({ name, icon: Tool, colorClass }) => (
                  <span
                    key={name}
                    className="flex items-center gap-1.5 rounded-full border bg-background/60 px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
                  >
                    <Tool className={cn("size-3.5", colorClass)} aria-hidden="true" />
                    <span className="hidden sm:inline">{name}</span>
                  </span>
                ))}
              </span>
            </div>

            <div key={item.id} className="relative flex-1 p-5 font-mono text-xs leading-relaxed sm:p-6 sm:text-[13px]">
              {item.id === "plan" && <PlanScene final={!!reduce} />}
              {item.id === "build" && <BuildScene final={!!reduce} />}
              {item.id === "review" && <ReviewScene final={!!reduce} />}
              {item.id === "own" && <OwnScene final={!!reduce} />}
            </div>
          </div>
        </div>
      </FadeIn>
    </Section>
  )
}

/* ------------------------------------------------------------------ */
/* Scenes — each plays forward on mount; `final` jumps to the end      */
/* ------------------------------------------------------------------ */

function useStep(final: boolean, ms: number, max: number) {
  const t = useTick(!final, ms)
  return final ? max : Math.min(t, max)
}

function Prompt({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex gap-2 text-foreground">
      <span className="text-brand-text">›</span>
      {children}
    </p>
  )
}

function Who({ label, tone = "muted" }: { label: string; tone?: "muted" | "brand" }) {
  return (
    <span
      className={cn(
        "mr-2 inline-flex rounded-md border px-1.5 py-px label-mono text-[10px]",
        tone === "brand" ? "border-brand/40 text-brand-text" : "text-muted-foreground"
      )}
    >
      {label}
    </span>
  )
}

const planTasks = ["users table + auth endpoints", "orders table + checkout flow", "admin dashboard", "email receipts"]

function PlanScene({ final }: { final: boolean }) {
  const step = useStep(final, 650, planTasks.length + 2)

  return (
    <div className="space-y-4">
      <Prompt>break docs/PRD.md into tasks and a schema</Prompt>
      <div>
        <Who label="AI" />
        <ul className="mt-3 space-y-2">
          {planTasks.slice(0, step).map((task) => {
            const cut = task === "admin dashboard" && step > planTasks.length
            return (
              <li key={task} className={cn("flex items-center gap-2.5", pop, cut && "text-muted-foreground line-through")}>
                <span className="size-3.5 shrink-0 rounded border" />
                {task}
              </li>
            )
          })}
        </ul>
      </div>
      {step > planTasks.length && (
        <p className={cn("rounded-xl border border-brand/30 bg-brand/5 px-3 py-2.5 font-sans text-sm", pop)}>
          <Who label="You" tone="brand" />
          Cut the admin dashboard — it&apos;s out of scope for v1.
        </p>
      )}
      {step > planTasks.length + 1 && (
        <p className={cn("flex items-center gap-2 text-brand-text", pop)}>
          <Check className="size-3.5" /> plan.md committed · 3 tasks
        </p>
      )}
    </div>
  )
}

const buildLines = [
  "export async function createOrder(input) {",
  "  const order = await db.order.create({ data: input })",
  "  await sendReceipt(order.userId)",
  "  return order",
  "}",
]

function BuildScene({ final }: { final: boolean }) {
  // Each step accepts one more AI suggestion; the next line shows as ghost text.
  const step = useStep(final, 900, buildLines.length)

  return (
    <div className="space-y-4">
      <p className="label-mono text-muted-foreground">src/orders.ts</p>
      <div className="space-y-0.5">
        {buildLines.map((line, i) => {
          const accepted = i < step
          const ghost = i === step
          if (!accepted && !ghost) return null
          return (
            <p key={i} className="flex items-center gap-3 whitespace-pre">
              <span className="w-4 shrink-0 text-right text-muted-foreground/50">{i + 1}</span>
              <span className={cn("truncate", ghost ? "text-muted-foreground/60 italic" : "text-foreground")}>{line}</span>
              {ghost && (
                <span className="shrink-0 rounded border px-1.5 py-px label-mono text-[9px] text-muted-foreground">tab ⇥</span>
              )}
            </p>
          )
        })}
      </div>
      {step >= buildLines.length && (
        <p className={cn("flex items-center gap-2 text-brand-text", pop)}>
          <Check className="size-3.5" /> 5 lines accepted · you read every one
        </p>
      )}
    </div>
  )
}

function ReviewScene({ final }: { final: boolean }) {
  const step = useStep(final, 900, 3)

  return (
    <div className="space-y-4">
      <p className="label-mono text-muted-foreground">src/users.ts · AI-written</p>
      <p className={cn("rounded-lg px-2 py-1 whitespace-pre-wrap", step >= 1 ? "bg-brand/10 text-muted-foreground line-through" : "text-foreground")}>
        {"db.query(`SELECT * FROM users WHERE id = ${id}`)"}
      </p>
      {step >= 1 && (
        <p className={cn("flex items-start gap-2 rounded-xl border border-brand/30 bg-brand/5 px-3 py-2.5 font-sans text-sm", pop)}>
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-brand-text" />
          <span>
            <Who label="You" tone="brand" />
            SQL injection. Never ship a query you haven&apos;t read.
          </span>
        </p>
      )}
      {step >= 2 && (
        <p className={cn("rounded-lg bg-foreground/[0.05] px-2 py-1 whitespace-pre-wrap text-foreground", pop)}>
          {'db.query("SELECT * FROM users WHERE id = $1", [id])'}
        </p>
      )}
      {step >= 3 && (
        <p className={cn("flex items-center gap-2 text-brand-text", pop)}>
          <Check className="size-3.5" /> 12 tests passed · ready for review
        </p>
      )}
    </div>
  )
}

const answer = "Orders, users and payments are relational. I need joins and transactions."

function OwnScene({ final }: { final: boolean }) {
  const typed = useStep(final, 28, answer.length + 30)

  return (
    <div className="space-y-4 font-sans text-sm">
      <p className="max-w-[85%] rounded-2xl rounded-tl-sm border bg-background/60 px-4 py-3">
        <Who label="Mentor" />
        Why Postgres instead of MongoDB here?
      </p>
      <p className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm border border-brand/30 bg-brand/5 px-4 py-3">
        <Who label="You" tone="brand" />
        {answer.slice(0, typed)}
        {typed < answer.length && <span className="ml-0.5 inline-block w-1.5 animate-blink text-brand">▍</span>}
      </p>
      {typed >= answer.length + 10 && (
        <p className={cn("flex items-center gap-2 font-mono text-xs text-brand-text sm:text-[13px]", pop)}>
          <Check className="size-3.5" /> approved · you own this decision
        </p>
      )}
    </div>
  )
}
