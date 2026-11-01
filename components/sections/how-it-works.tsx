"use client"

import { AppWindow, ArrowUpRight, Check, Database, FileUser, GitPullRequest, Play, Server } from "lucide-react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { Fragment, useEffect, useRef, useState } from "react"

import { SocialIcon } from "@/components/layout/social-icon"
import { Section, SectionHeading } from "@/components/section"
import { QrMark } from "@/components/widgets/qr-mark"
import { howItWorks, type HowItWorksStepId } from "@/data/site"
import { trackShortName, tracks } from "@/data/tracks"
import { trackColorStyle, trackIcons } from "@/lib/track-icons"
import { aiTools } from "@/lib/ai-tools"
import { useTick } from "@/lib/use-tick"
import { cn } from "@/lib/utils"

type TileKey = HowItWorksStepId | "cta"

/* Resting flex-grow per tile — the uneven values give the bento its rhythm. */
const baseGrow: Record<TileKey, number> = {
  apply: 1,
  call: 1.35,
  plan: 1.15,
  build: 1.7,
  ship: 1,
  certify: 1.15,
  resume: 2.2,
  cta: 1,
}

/* Mobile/tablet grid spans (desktop uses flex rows instead). */
const span: Record<TileKey, string> = {
  apply: "sm:col-span-1",
  call: "sm:col-span-1",
  plan: "sm:col-span-2",
  build: "sm:col-span-2",
  ship: "sm:col-span-1",
  certify: "sm:col-span-1",
  resume: "sm:col-span-2",
  cta: "sm:col-span-2",
}

const steps = Object.fromEntries(howItWorks.steps.map((s, i) => [s.id, { ...s, index: i }])) as Record<
  HowItWorksStepId,
  (typeof howItWorks.steps)[number] & { index: number }
>

/* Overshooting ease so a tile swells past its target, then settles. */
const springy = "ease-[cubic-bezier(0.34,1.56,0.64,1)]"

export function HowItWorks() {
  const reduce = useReducedMotion()
  const gridRef = useRef<HTMLDivElement>(null)
  const inView = useInView(gridRef, { margin: "-120px" })
  const [hovered, setHovered] = useState<TileKey | null>(null)
  const [idle, setIdle] = useState(0)

  // When nobody is hovering, walk a highlight through the steps to show the flow.
  useEffect(() => {
    if (reduce || !inView || hovered) return
    const id = setInterval(() => setIdle((n) => (n + 1) % howItWorks.steps.length), 2200)
    return () => clearInterval(id)
  }, [reduce, inView, hovered])

  const lit: TileKey | null = hovered ?? (inView && !reduce ? howItWorks.steps[idle].id : null)
  const grow = (key: TileKey, boost = 0.7) => baseGrow[key] + (hovered === key ? boost : 0)
  const columnActive = hovered === "ship" || hovered === "certify"

  const tile = (id: HowItWorksStepId, visual: StepTileProps["visual"], props?: Partial<StepTileProps>) => (
    <StepTile
      step={steps[id]}
      grow={grow(id)}
      lit={lit === id}
      onEnter={() => setHovered(id)}
      visual={visual}
      className={span[id]}
      {...props}
    />
  )

  return (
    <Section id="how-it-works" aria-labelledby="how-it-works-title" className="border-t">
      <SectionHeading
        id="how-it-works-title"
        eyebrow={howItWorks.eyebrow}
        title={howItWorks.title}
        description={howItWorks.description}
      />

      <div
        ref={gridRef}
        onMouseLeave={() => setHovered(null)}
        className="grid gap-3 sm:grid-cols-2 lg:flex lg:flex-col lg:gap-4"
      >
        <div className="contents lg:flex lg:h-72 lg:gap-4">
          {tile("apply", (on) => <ApplyVisual on={on} />)}
          {tile("call", (on) => <CallVisual on={on} />)}
          {tile("plan", (on) => <PlanVisual on={on} />)}
        </div>

        <div className="contents lg:flex lg:h-120 lg:gap-4">
          {tile("build", (on) => <BuildVisual on={on} />, { size: "lg" })}
          <div
            className={cn("contents lg:flex lg:min-w-0 lg:basis-0 lg:flex-col lg:gap-4 lg:transition-[flex-grow] lg:duration-500 motion-reduce:transition-none", springy)}
            style={{ flexGrow: columnActive ? 1.5 : 1 }}
          >
            {tile("ship", (on) => <ShipVisual on={on} />, { grow: grow("ship", 0.3) })}
            {tile("certify", (on) => <CertifyVisual on={on} />, { grow: grow("certify", 0.3) })}
          </div>
        </div>

        <div className="contents lg:flex lg:h-56 lg:gap-4">
          {tile("resume", (on) => <ResumeVisual on={on} />, { layout: "row" })}
          <CtaTile grow={grow("cta")} onEnter={() => setHovered("cta")} className={span.cta} />
        </div>
      </div>
    </Section>
  )
}

/* ------------------------------------------------------------------ */
/* Tiles                                                               */
/* ------------------------------------------------------------------ */

type StepTileProps = {
  step: (typeof steps)[HowItWorksStepId]
  grow: number
  lit: boolean
  onEnter: () => void
  visual: (on: boolean) => React.ReactNode
  size?: "md" | "lg"
  layout?: "column" | "row"
  className?: string
}

function StepTile({ step, grow, lit, onEnter, visual, size = "md", layout = "column", className }: StepTileProps) {
  const reduce = useReducedMotion()
  const number = String(step.index + 1).padStart(2, "0")
  const titleId = `step-${step.id}-title`

  return (
    <motion.article
      data-fade=""
      aria-labelledby={titleId}
      onMouseEnter={onEnter}
      style={{ flexGrow: grow }}
      initial={{ opacity: 0, y: reduce ? 0 : 18, scale: reduce ? 1 : 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 140, damping: 20, delay: reduce ? 0 : step.index * 0.05 }}
      className={cn(
        "widget group/tile flex min-w-0 flex-col p-5 sm:p-6 lg:min-h-0 lg:basis-0",
        "transition-[flex-grow,border-color,box-shadow] duration-500 motion-reduce:transition-none",
        springy,
        lit && "border-brand/40 shadow-[0_24px_48px_-28px_color-mix(in_oklch,var(--brand)_45%,transparent)]",
        layout === "row" && "lg:flex-row lg:items-center lg:gap-10",
        className
      )}
    >
      <div aria-hidden="true" className="widget-dots pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/tile:opacity-60" />

      <div className={cn("relative flex min-h-0 flex-col", layout === "row" ? "lg:w-80 lg:shrink-0" : "flex-1")}>
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <span
              className={cn(
                "size-1.5 rounded-full bg-brand transition-transform duration-300",
                lit ? "scale-100" : "scale-0"
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                "font-mono text-xs font-medium transition-colors duration-300",
                lit ? "text-brand-text" : "text-muted-foreground"
              )}
            >
              {number}
            </span>
          </span>
          <span className="label-mono text-muted-foreground">{step.when}</span>
        </div>

        {layout === "column" && (
          <div aria-hidden="true" className="-mx-2 flex items-center px-2 py-5 lg:min-h-0 lg:flex-1 lg:overflow-hidden lg:py-4">
            {visual(lit)}
          </div>
        )}

        <div className={cn(layout === "row" && "mt-5 lg:mt-auto")}>
          <h3
            id={titleId}
            className={cn(
              "font-semibold tracking-tight uppercase",
              size === "lg" ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
            )}
          >
            <span className="sr-only">Step {step.index + 1}: </span>
            {step.title}
          </h3>
          <p className={cn("mt-1.5 text-sm text-pretty text-muted-foreground", size === "lg" && "max-w-md sm:text-base")}>
            {step.description}
          </p>
        </div>
      </div>

      {layout === "row" && (
        <div aria-hidden="true" className="relative mt-5 flex min-w-0 flex-1 items-center lg:mt-0">
          {visual(lit)}
        </div>
      )}
    </motion.article>
  )
}

function CtaTile({ grow, onEnter, className }: { grow: number; onEnter: () => void; className?: string }) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      data-fade=""
      onMouseEnter={onEnter}
      style={{ flexGrow: grow }}
      initial={{ opacity: 0, y: reduce ? 0 : 18, scale: reduce ? 1 : 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 140, damping: 20, delay: reduce ? 0 : 0.35 }}
      className={cn(
        "min-w-0 lg:basis-0 lg:transition-[flex-grow] lg:duration-500 motion-reduce:transition-none",
        springy,
        className
      )}
    >
      <Link
        href={howItWorks.cta.href}
        className="group/cta relative flex h-full min-h-40 flex-col justify-between overflow-hidden rounded-[1.75rem] bg-primary p-5 text-primary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:p-6"
      >
        <div aria-hidden="true" className="bg-matrix pointer-events-none absolute inset-0 opacity-15 mask-[radial-gradient(circle_at_100%_0%,#000,transparent_70%)]" />
        <span className="relative flex items-center justify-between">
          <span className="label-mono opacity-80">Ready?</span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-6 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 group-hover/cta:rotate-45"
          />
        </span>
        <span className="relative">
          <span className="block font-heading text-xl font-semibold tracking-tight uppercase sm:text-2xl">
            {howItWorks.cta.label}
          </span>
          <span className="mt-1 block label-mono opacity-80">{howItWorks.cta.note}</span>
        </span>
      </Link>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Mini visuals — illustrative, decorative (aria-hidden by the tile)   */
/* ------------------------------------------------------------------ */

function ApplyVisual({ on }: { on: boolean }) {
  const t = useTick(on, 520)
  const picked = on ? (t * 5) % tracks.length : 0
  const name = trackShortName(tracks[picked])

  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="grid w-fit shrink-0 grid-cols-3 gap-2 p-1">
        {tracks.map((track, i) => {
          const Icon = trackIcons[track.slug]
          return (
            <span
              key={track.slug}
              style={trackColorStyle(track.slug)}
              className={cn(
                "track-color flex size-7 items-center justify-center rounded-lg border text-(--tc) transition-all duration-300",
                springy,
                i === picked && on
                  ? "scale-110 border-(--tc)/70 bg-(--tc)/20 shadow-[0_4px_12px_-4px_var(--tc)]"
                  : "bg-background/60 opacity-60"
              )}
            >
              <Icon className="size-3.5" />
            </span>
          )
        })}
      </div>
      <div className="min-w-0 text-right">
        <p className="label-mono text-muted-foreground">9 tracks</p>
        <p key={name} className="mt-1 truncate font-mono text-sm font-medium uppercase motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1">
          {name}
        </p>
      </div>
    </div>
  )
}

const waveBars = [0.5, 0.8, 0.35, 1, 0.6, 0.9, 0.4, 0.7, 0.55]

function CallVisual({ on }: { on: boolean }) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-background/60 label-mono text-[10px] text-muted-foreground">
          You
        </span>
        <span className="flex h-8 flex-1 items-center justify-center gap-1">
          {waveBars.map((h, i) => (
            <span
              key={i}
              className={cn(
                "w-1 rounded-full transition-colors duration-300",
                on ? "bg-brand motion-safe:animate-wave" : "bg-muted-foreground/30"
              )}
              style={{ height: `${h * 100}%`, animationDelay: `${i * 90}ms` }}
            />
          ))}
        </span>
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full border label-mono text-[10px] transition-all duration-300",
            on ? "border-brand/60 bg-brand/10 text-brand-text shadow-[0_0_0_4px_color-mix(in_oklch,var(--brand)_12%,transparent)]" : "bg-background/60 text-muted-foreground"
          )}
        >
          Mentor
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 label-mono">
        <span className="text-muted-foreground">1:1 · free</span>
        <span className={cn("transition-colors duration-300", on ? "text-brand-text" : "text-muted-foreground")}>
          then decide →
        </span>
      </div>
    </div>
  )
}

const planNodes = [
  { label: "UI", icon: AppWindow },
  { label: "API", icon: Server },
  { label: "DB", icon: Database },
]

function PlanVisual({ on }: { on: boolean }) {
  const t = useTick(on, 380)
  const litCount = on ? Math.min(t + 1, planNodes.length + 1) : 0

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        {planNodes.map(({ label, icon: Icon }, i) => (
          <Fragment key={label}>
            <span
              className={cn(
                "flex shrink-0 flex-col items-center gap-1 rounded-xl border px-2.5 py-2 transition-all duration-300",
                litCount > i
                  ? "border-brand/50 bg-brand/5 text-brand-text shadow-[0_0_0_3px_color-mix(in_oklch,var(--brand)_10%,transparent)]"
                  : "bg-background/60 text-muted-foreground"
              )}
            >
              <Icon className="size-4" />
              <span className="label-mono text-[10px]">{label}</span>
            </span>
            {i < planNodes.length - 1 && <span className={cn("dash-line h-px flex-1", on && "animate-dash-flow")} />}
          </Fragment>
        ))}
      </div>
      <p
        className={cn(
          "mt-3 flex items-center gap-1.5 label-mono transition-colors duration-300",
          litCount > planNodes.length ? "text-brand-text" : "text-muted-foreground"
        )}
      >
        <Check className="size-3" />
        mentor sign-off
      </p>
    </div>
  )
}

const diff = [
  { sign: "+", code: "export async function checkout(cart) {" },
  { sign: "+", code: "  const total = sum(cart.items)" },
  { sign: "−", code: "  console.log(cart)" },
  { sign: "+", code: "  const res = await pay(total)" },
]

function BuildVisual({ on }: { on: boolean }) {
  const t = useTick(on, 750)
  // 0: diff only · 1: mentor comment · 2: fix pushed · 3: approved
  const phase = on ? Math.min(t, 3) : 3
  const pop = "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 motion-safe:duration-300"

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl border bg-background/70 font-mono text-[11px] leading-relaxed sm:text-xs lg:h-full">
      <div className="flex items-center justify-between gap-3 border-b px-3.5 py-2.5">
        <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
          <GitPullRequest className="size-3.5 shrink-0" />
          <span className="truncate">#12 feat/checkout</span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5" title="Built with Claude, Cursor and Copilot">
          {aiTools.map(({ name, icon: Tool, colorClass }) => (
            <span key={name} className="flex size-6 items-center justify-center rounded-md border bg-card">
              <Tool className={cn("size-3.5", colorClass)} />
            </span>
          ))}
        </span>
      </div>

      <div className="space-y-0.5 p-3.5">
        {diff.map((line, i) => (
          <p
            key={i}
            className={cn(
              "flex gap-3 truncate rounded px-1.5",
              line.sign === "+" ? "bg-foreground/[0.04]" : "text-muted-foreground line-through decoration-muted-foreground/40"
            )}
          >
            <span className="w-2 shrink-0 text-muted-foreground">{line.sign}</span>
            {line.code}
          </p>
        ))}

        {phase >= 1 && (
          <div key={`c-${on}`} className={cn("my-2 ml-5 rounded-xl border border-brand/30 bg-brand/5 px-3 py-2 font-sans", pop)}>
            <span className="label-mono text-brand-text">mentor</span>
            <p className="mt-0.5 text-xs text-foreground">What happens if the payment fails?</p>
          </div>
        )}

        {phase >= 2 && (
          <p key={`f-${on}`} className={cn("flex gap-3 truncate rounded bg-foreground/[0.04] px-1.5", pop)}>
            <span className="w-2 shrink-0 text-muted-foreground">+</span>
            {"  if (!res.ok) throw new PaymentError()"}
          </p>
        )}
      </div>

      <div className="mt-auto flex items-center gap-2 border-t px-3.5 py-2.5">
        {phase >= 3 ? (
          <span key={`a-${on}`} className={cn("flex items-center gap-1.5 text-brand-text", pop)}>
            <Check className="size-3.5" />
            approved · merged to main
          </span>
        ) : (
          <span className="flex items-center gap-2 text-muted-foreground">
            <span className="size-1.5 rounded-full bg-brand motion-safe:animate-blink" />
            review in progress
          </span>
        )}
      </div>
    </div>
  )
}

function ShipVisual({ on }: { on: boolean }) {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-2">
        <span className="relative flex size-2 shrink-0">
          {on && (
            <span className="absolute inline-flex size-full rounded-full bg-brand opacity-70 [animation:pulse-ring_1.6s_ease-out_infinite] motion-reduce:hidden" />
          )}
          <span className="relative inline-flex size-2 rounded-full bg-brand" />
        </span>
        <span className="label-mono text-brand-text">Live</span>
        <span className="truncate font-mono text-xs text-muted-foreground">your-project.app</span>
      </div>
      <div className="flex items-center gap-2.5">
        <Play className="size-3 shrink-0 fill-current text-muted-foreground" />
        <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
          <span
            className="block h-full rounded-full bg-foreground/70 transition-[width] ease-linear motion-reduce:transition-none"
            style={{ width: on ? "100%" : "30%", transitionDuration: on ? "3s" : "300ms" }}
          />
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">demo.mp4</span>
      </div>
    </div>
  )
}

function CertifyVisual({ on }: { on: boolean }) {
  return (
    <div className="flex w-full items-center gap-3 rounded-2xl border bg-background/60 p-3">
      <span className="size-9 shrink-0 text-foreground">
        <QrMark />
      </span>
      <div className="min-w-0">
        <p className="truncate font-mono text-xs font-medium sm:text-sm">DEVIO-2026-0001</p>
        <p className="truncate font-mono text-[11px] text-muted-foreground">deviotech.in/verify</p>
      </div>
      <span
        className={cn(
          "ml-auto shrink-0 rounded-md border-2 border-brand-text px-1.5 py-0.5 label-mono font-semibold text-brand-text transition-all duration-500 motion-reduce:transition-none",
          springy,
          on ? "-rotate-12 scale-110 opacity-100" : "scale-90 opacity-40"
        )}
      >
        Passed
      </span>
    </div>
  )
}

const profiles = [
  { name: "Resume", icon: <FileUser className="size-4" /> },
  { name: "GitHub", icon: <SocialIcon platform="github" className="size-4" /> },
  { name: "LinkedIn", icon: <SocialIcon platform="linkedin" className="size-4" /> },
]

function ResumeVisual({ on }: { on: boolean }) {
  const t = useTick(on, 320)
  const done = on ? Math.min(t + 1, profiles.length) : 0

  return (
    <div className="flex w-full flex-wrap gap-2.5">
      {profiles.map(({ name, icon }, i) => (
        <span
          key={name}
          className={cn(
            "flex flex-1 items-center gap-2.5 rounded-2xl border px-4 py-3 transition-colors duration-300",
            done > i ? "border-brand/40 bg-brand/5" : "bg-background/60"
          )}
        >
          <span className={cn("transition-colors duration-300", done > i ? "text-brand-text" : "text-muted-foreground")}>
            {icon}
          </span>
          <span className="font-mono text-sm">{name}</span>
          <span
            className={cn(
              "ml-auto flex size-5 items-center justify-center rounded-full border transition-all duration-300",
              springy,
              done > i ? "scale-110 border-brand bg-brand text-white" : "text-transparent"
            )}
          >
            <Check className="size-3" strokeWidth={3} />
          </span>
        </span>
      ))}
    </div>
  )
}
