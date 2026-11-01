import { Bell, Search } from "lucide-react"
import { Fragment } from "react"

import type { TrackSlug } from "@/data/tracks"
import { TechIcon } from "@/lib/tech-icons"
import { cn } from "@/lib/utils"

/*
 * Tiny, decorative visualisations of what each track produces — drawn from the
 * track's own projects and stack. Rendered inside a `.track-color` card, so
 * `--tc` is that track's brand colour. Most come alive on card hover.
 */

function Frame({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div aria-hidden="true" className="relative h-32 overflow-hidden rounded-2xl border bg-background/70">
      <div className="flex items-center justify-between border-b px-3 py-1.5">
        <span className="font-mono text-[10px] text-muted-foreground">{title}</span>
        <span className="flex gap-1">
          <span className="size-1.5 rounded-full bg-muted-foreground/30" />
          <span className="size-1.5 rounded-full bg-muted-foreground/30" />
          <span className="size-1.5 rounded-full bg-(--tc)" />
        </span>
      </div>
      <div className={cn("h-[calc(100%-1.6rem)] p-3 font-mono text-[10px] text-muted-foreground", className)}>{children}</div>
    </div>
  )
}

function Node({ name, label }: { name: string; label: string }) {
  return (
    <span className="flex shrink-0 flex-col items-center gap-1 rounded-xl border bg-card px-2.5 py-1.5 transition-colors duration-300 group-hover:border-(--tc)/40">
      <TechIcon name={name} className="size-4" />
      <span className="text-[9px] tracking-wider uppercase">{label}</span>
    </span>
  )
}

/** Circular progress ring with a value in the middle. */
function Ring({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-1">
      <span className="relative size-12">
        <svg viewBox="0 0 36 36" className="size-full -rotate-90">
          <circle cx="18" cy="18" r="15.9155" fill="none" strokeWidth="3" className="stroke-muted" />
          <circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${value} 100`}
            className="stroke-(--tc)"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-medium text-foreground">{value}</span>
      </span>
      <span className="text-[9px] tracking-wider uppercase">{label}</span>
    </div>
  )
}

function FullStack() {
  return (
    <Frame title="system design" className="flex flex-col justify-center gap-2.5">
      <div className="flex items-center gap-1.5">
        {[
          ["React", "Client"],
          ["Express", "API"],
          ["PostgreSQL", "DB"],
        ].map(([name, label], i) => (
          <Fragment key={name}>
            <Node name={name} label={label} />
            {i < 2 && <span className="dash-line h-px flex-1 group-hover:animate-dash-flow" />}
          </Fragment>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1">
          <TechIcon name="Vercel" className="size-2.5" /> vercel
        </span>
        <span className="flex items-center gap-1">
          render <TechIcon name="Render" className="size-2.5" />
        </span>
      </div>
    </Frame>
  )
}

const endpoints = [
  { method: "GET", path: "/links/:id", ms: 12, fill: "w-1/4", note: "cache hit" },
  { method: "POST", path: "/links", ms: 38, fill: "w-3/5" },
  { method: "GET", path: "/stats", ms: 21, fill: "w-2/5" },
]

function Backend() {
  return (
    <Frame title="api monitor" className="flex flex-col justify-between">
      <div className="space-y-1.5">
        {endpoints.map((e) => (
          <div key={e.method + e.path} className="flex items-center gap-2">
            <span
              className={cn(
                "w-9 shrink-0 rounded border px-1 text-center text-[8px] font-medium",
                e.method === "GET" ? "border-(--tc)/40 bg-(--tc)/10 text-(--tc)" : "text-foreground"
              )}
            >
              {e.method}
            </span>
            <span className="w-16 shrink-0 truncate">{e.path}</span>
            <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
              <span
                className={cn(
                  "block h-full origin-left scale-x-50 rounded-full bg-foreground/50 transition-transform duration-500 group-hover:scale-x-100",
                  e.fill
                )}
              />
            </span>
            <span className="w-8 shrink-0 text-right text-foreground">{e.ms}ms</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-dashed pt-1.5">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-(--tc)" /> all 200 OK
        </span>
        <span>rate limit 100/min</span>
      </div>
    </Frame>
  )
}

function Frontend() {
  return (
    <Frame title="movie app · preview" className="flex items-center gap-3">
      <div className="min-w-0 flex-1 space-y-1.5">
        <span className="flex h-3.5 items-center gap-1 rounded-full border px-1.5">
          <Search className="size-2" />
          <span className="h-0.5 w-10 rounded-full bg-muted-foreground/30" />
        </span>
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 8 }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-6 rounded-sm transition-transform duration-300 group-hover:-translate-y-0.5",
                i === 2 ? "bg-(--tc)/50" : "bg-muted-foreground/15"
              )}
              style={{ transitionDelay: `${i * 40}ms` }}
            />
          ))}
        </div>
      </div>
      <Ring value={98} label="perf" />
    </Frame>
  )
}

const habits = ["Read 20 min", "Workout", "Code 1 hr"]
const week = ["M", "T", "W", "T", "F", "S", "S"]

function AppDev() {
  return (
    <Frame title="habit tracker" className="flex items-center gap-3 py-2">
      {/* phone */}
      <div className="flex h-[5.5rem] w-20 shrink-0 flex-col gap-1 rounded-[0.9rem] border-2 bg-card p-1.5">
        <span className="mx-auto h-1 w-6 rounded-full bg-muted-foreground/30" />
        <span className="text-[8px] text-foreground">Today</span>
        {habits.map((habit, i) => (
          <span key={habit} className="flex items-center justify-between gap-1 text-[7px]">
            <span className="truncate">{habit}</span>
            <span className={cn("size-2 shrink-0 rounded-full border", i < 2 && "border-(--tc) bg-(--tc)")} />
          </span>
        ))}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        {/* push notification */}
        <div className="flex items-center gap-1.5 rounded-xl border bg-card p-1.5 transition-transform duration-500 group-hover:-translate-y-0.5">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-(--tc) text-white">
            <Bell className="size-2.5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[9px] text-foreground">Time to check in</span>
            <span className="block truncate text-[8px]">Keep your streak alive</span>
          </span>
        </div>
        {/* weekly streak */}
        <div className="flex justify-between">
          {week.map((day, i) => (
            <span key={i} className="flex flex-col items-center gap-0.5 text-[7px]">
              <span className={cn("size-2 rounded-full", i < 5 ? "bg-(--tc)" : "bg-muted-foreground/25")} />
              {day}
            </span>
          ))}
        </div>
      </div>
    </Frame>
  )
}

/* A 3-4-2 network; node centres in a 100×64 box. */
const layers = [
  [14, 32, 50],
  [8, 24, 40, 56],
  [22, 42],
].map((ys, li) => ys.map((y) => ({ x: 10 + li * 40, y })))

function AiMl() {
  return (
    <Frame title="resume screener model" className="flex items-center gap-3">
      <svg viewBox="0 0 100 64" className="h-full min-w-0 flex-1">
        {layers.slice(0, -1).map((layer, li) =>
          layer.flatMap((a) =>
            layers[li + 1].map((b) => (
              <line
                key={`${a.x}${a.y}${b.x}${b.y}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                strokeWidth="0.6"
                className="stroke-muted-foreground/25 transition-colors duration-500 group-hover:stroke-(--tc)/45"
              />
            ))
          )
        )}
        {layers.flatMap((layer, li) =>
          layer.map((n, ni) => (
            <circle
              key={`${n.x}${n.y}`}
              cx={n.x}
              cy={n.y}
              r="3.2"
              className={cn(
                "stroke-[0.8]",
                li === 2 && ni === 0 ? "fill-(--tc) stroke-(--tc)" : "fill-card stroke-muted-foreground/50"
              )}
            />
          ))
        )}
      </svg>
      <Ring value={89} label="match" />
    </Frame>
  )
}

const bars = [0.55, 0.8, 0.45, 0.95, 0.65, 0.75]

function DataScience() {
  return (
    <Frame title="ipl dashboard" className="flex items-end gap-4">
      <div className="flex h-full flex-1 items-end gap-1.5">
        {bars.map((h, i) => (
          <span
            key={i}
            className={cn(
              "flex-1 origin-bottom scale-y-75 rounded-t-sm transition-transform duration-500 group-hover:scale-y-100",
              i === 3 ? "bg-(--tc)" : "bg-muted-foreground/30"
            )}
            style={{ height: `${h * 100}%`, transitionDelay: `${i * 50}ms` }}
          />
        ))}
      </div>
      <div className="shrink-0 space-y-2 self-center">
        <div>
          <p className="text-sm font-medium text-foreground">168</p>
          <p className="text-[9px] tracking-wider uppercase">avg score</p>
        </div>
        <div>
          <p className="text-sm font-medium text-(--tc)">62%</p>
          <p className="text-[9px] tracking-wider uppercase">win rate</p>
        </div>
      </div>
    </Frame>
  )
}

const spending = [
  { label: "food", amount: "₹1,840", share: 45, className: "stroke-(--tc)", dot: "bg-(--tc)" },
  { label: "travel", amount: "₹980", share: 30, className: "stroke-muted-foreground/60", dot: "bg-muted-foreground/60" },
  { label: "other", amount: "₹620", share: 25, className: "stroke-muted-foreground/25", dot: "bg-muted-foreground/25" },
]

/** Where each donut segment starts, as a percentage of the ring. */
const spendingOffsets = spending.map((_, i) => spending.slice(0, i).reduce((sum, s) => sum + s.share, 0))

function Python() {
  return (
    <Frame title="expense tracker" className="flex items-center gap-4">
      <svg viewBox="0 0 36 36" className="size-[4.5rem] shrink-0 -rotate-90 transition-transform duration-700 group-hover:rotate-0">
        {spending.map((s, i) => (
          <circle
            key={s.label}
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            strokeWidth="5"
            pathLength={100}
            strokeDasharray={`${s.share - 1.5} ${100 - s.share + 1.5}`}
            strokeDashoffset={-spendingOffsets[i]}
            className={s.className}
          />
        ))}
      </svg>
      <div className="min-w-0 flex-1 space-y-1">
        {spending.map((s) => (
          <p key={s.label} className="flex items-center gap-1.5">
            <span className={cn("size-1.5 shrink-0 rounded-full", s.dot)} />
            <span className="flex-1">{s.label}</span>
            <span className="text-foreground">{s.amount}</span>
          </p>
        ))}
        <p className="border-t border-dashed pt-1 text-right">this month</p>
      </div>
    </Frame>
  )
}

const javaLayers = ["Controller", "Service", "Repository"]

function Java() {
  return (
    <Frame title="layered architecture" className="flex items-center gap-2">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {javaLayers.map((layer, i) => (
          <span
            key={layer}
            className="flex h-5 items-center justify-between rounded-md border bg-card px-2 transition-colors duration-300 group-hover:border-(--tc)/50"
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            <span className="text-foreground">{layer}</span>
            <span className="text-[8px]">{["REST", "logic", "JPA"][i]}</span>
          </span>
        ))}
      </div>
      <span className="dash-line h-px w-4 shrink-0 group-hover:animate-dash-flow" />
      <Node name="MySQL / PostgreSQL" label="MySQL" />
    </Frame>
  )
}

function UiUx() {
  return (
    <Frame title="campus-app.fig" className="flex items-center gap-3 py-2">
      <div className="flex h-[5.5rem] w-20 shrink-0 flex-col gap-1 rounded-lg border bg-card p-1.5">
        <span className="h-2 w-full rounded-sm bg-muted-foreground/20" />
        <span className="h-6 w-full rounded-sm bg-muted-foreground/15" />
        <span className="h-1 w-3/4 rounded-full bg-muted-foreground/20" />
        <span className="h-1 w-1/2 rounded-full bg-muted-foreground/20" />
        <span className="relative mt-auto h-3 w-full rounded-sm border border-(--tc) bg-(--tc)/20">
          {/* selection handles */}
          {["-top-0.5 -left-0.5", "-top-0.5 -right-0.5", "-bottom-0.5 -left-0.5", "-bottom-0.5 -right-0.5"].map((pos) => (
            <span key={pos} className={cn("absolute size-1 border border-(--tc) bg-card", pos)} />
          ))}
        </span>
      </div>
      {/* user flow */}
      <div className="flex min-w-0 flex-1 items-center gap-1">
        {["Login", "Home", "Book"].map((screen, i) => (
          <Fragment key={screen}>
            <span
              className={cn(
                "flex h-10 flex-1 items-end justify-center rounded-md border pb-1 text-[8px] transition-colors duration-300",
                i === 1 ? "border-(--tc)/50 bg-(--tc)/10 text-(--tc)" : "bg-card"
              )}
            >
              {screen}
            </span>
            {i < 2 && <span className="dash-line h-px w-2 shrink-0 group-hover:animate-dash-flow" />}
          </Fragment>
        ))}
      </div>
    </Frame>
  )
}

const previews: Record<TrackSlug, () => React.ReactNode> = {
  "full-stack": FullStack,
  backend: Backend,
  frontend: Frontend,
  "app-development": AppDev,
  "ai-ml": AiMl,
  "data-science": DataScience,
  python: Python,
  java: Java,
  "ui-ux": UiUx,
}

export function TrackPreview({ slug }: { slug: TrackSlug }) {
  const Preview = previews[slug]
  return <Preview />
}
