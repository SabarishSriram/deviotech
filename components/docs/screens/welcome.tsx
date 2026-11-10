import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  GitPullRequest,
  KeyRound,
  Laptop,
  Lock,
  MessageSquare,
  Paperclip,
  Rocket,
  SquareTerminal,
} from "lucide-react"
import { SiGithub } from "react-icons/si"

import { Board, Browser, Mark, MONO_FONT } from "@/components/docs/screens/kit"
import type { OS } from "@/data/docs/types"
import { cn } from "@/lib/utils"

/*
 * Pictures for the Welcome page (data/docs/welcome.ts). Most are simple
 * diagrams that look the same on every OS, so they take no arguments and
 * are drawn once.
 */

type Screen = (os: OS) => React.ReactNode

const RED = "#ff2a33"

/* ------------------------------------------------------------------ */

const timeline: Screen = () => {
  const weeks = ["Plan & foundations", "Core features", "More features & tests", "Polish & ship"]
  return (
    <Board>
      <div className="grid grid-cols-[repeat(4,1fr)_auto_auto] items-start gap-3">
        {weeks.map((label, i) => {
          const week = (
            <div className="rounded-lg border border-[#d0d7de] bg-[#f6f8fa] p-3">
              <p className="text-[11px] font-semibold tracking-wide text-[#59636e] uppercase">Week {i + 1}</p>
              <p className="mt-1 text-[13px] leading-snug font-semibold">{label}</p>
              {i === 0 ? (
                <Mark n={2} badge="br" className="mt-3">
                  <p className="flex items-center gap-1.5 rounded bg-white px-1.5 py-1 text-[11px] text-[#1a7f37]">
                    <CheckCircle2 className="size-3.5" /> Mentor review
                  </p>
                </Mark>
              ) : (
                <p className="mt-3 flex items-center gap-1.5 px-1.5 py-1 text-[11px] text-[#1a7f37]">
                  <CheckCircle2 className="size-3.5" /> Mentor review
                </p>
              )}
            </div>
          )
          return i === 0 ? (
            <Mark key={i} n={1} badge="tl">
              {week}
            </Mark>
          ) : (
            <div key={i}>{week}</div>
          )
        })}
        <Mark n={3} badge="tr">
          <div className="flex h-[104px] w-24 flex-col items-center justify-center gap-1.5 rounded-lg border border-[#d0d7de] bg-[#fff8f0] p-2 text-center">
            <Rocket className="size-5 text-[#bc4c00]" />
            <p className="text-[12px] leading-tight font-semibold">Final review</p>
          </div>
        </Mark>
        <Mark n={4} badge="tr">
          <div
            className="flex h-[104px] w-24 flex-col items-center justify-center gap-1.5 rounded-lg p-2 text-center text-white"
            style={{ background: RED }}
          >
            <Award className="size-5" />
            <p className="text-[12px] leading-tight font-semibold">Certificate</p>
          </div>
        </Mark>
      </div>
    </Board>
  )
}

/* ------------------------------------------------------------------ */

const groups: { title: string; mark: number; items: string[]; locked?: boolean; active?: string }[] = [
  { title: "Getting started", mark: 1, items: ["Welcome", "1. Setup", "2. How we work", "3. Environment & secrets"], active: "Welcome" },
  { title: "Building", mark: 2, items: ["Coding standards", "Testing", "Deployment", "Troubleshooting", "Resources"] },
  { title: "Reviews", mark: 3, items: ["Review rubric", "Submission checklist"] },
  { title: "Your project", mark: 4, items: ["PRD", "User flows", "Architecture", "Milestones"], locked: true },
]

const sidebar: Screen = (os) => (
  <Browser
    os={os}
    url="deviotech.in/portal/docs/welcome"
    tab="Welcome · Devvy Tech docs"
    tabIcon={<SquareTerminal className="size-3.5" style={{ color: RED }} />}
  >
    <div className="flex min-h-[420px]">
      <div className="w-60 shrink-0 space-y-4 border-r border-[#e5e7eb] p-4 pr-10">
        {groups.map((g) => (
          <Mark key={g.title} n={g.mark} badge="r" className="-mx-1 px-1 py-1">
            <div>
              <p className="mb-1 px-2 text-[11px] text-[#6b7280]">{g.title}</p>
              {g.items.map((item) => (
                <p
                  key={item}
                  className={cn(
                    "flex items-center justify-between rounded-md px-2 py-[3px] text-[12.5px]",
                    item === g.active ? "bg-[#ff2a33]/10 font-medium text-[#d1111b]" : "text-[#374151]",
                    g.locked && "text-[#9ca3af]"
                  )}
                >
                  {item}
                  {g.locked && <Lock className="size-3" />}
                </p>
              ))}
            </div>
          </Mark>
        ))}
      </div>
      <div className="flex-1 p-8">
        <p className="text-[11px] font-medium" style={{ color: RED }}>
          Getting started
        </p>
        <p className="mt-1 text-[24px] font-semibold tracking-tight">Welcome to Devvy Tech</p>
        <div className="mt-4 space-y-2">
          {[90, 100, 75, 95, 60].map((w, i) => (
            <div key={i} className="h-2.5 rounded bg-[#eef0f3]" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  </Browser>
)

/* ------------------------------------------------------------------ */

function Flow({ items }: { items: { icon: React.ElementType; label: string; sub: string }[] }) {
  return (
    <Board className="flex items-center gap-2">
      {items.map(({ icon: Icon, label, sub }, i) => (
        <div key={label} className="flex flex-1 items-center gap-2">
          <div className="flex-1 rounded-lg border border-[#d0d7de] bg-[#f6f8fa] p-3">
            <Icon className="size-5 text-[#59636e]" />
            <p className="mt-2 text-[13px] leading-tight font-semibold">{label}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-[#59636e]">{sub}</p>
          </div>
          {i < items.length - 1 && <ArrowRight className="size-4 shrink-0 text-[#8c959f]" />}
        </div>
      ))}
    </Board>
  )
}

const daySetup: Screen = () => (
  <Flow
    items={[
      { icon: Laptop, label: "Install your tools", sub: "Editor, Git, GitHub and your track's tools" },
      { icon: SquareTerminal, label: "Create your project", sub: "An empty project that runs" },
      { icon: SiGithub, label: "First commit", sub: "Saved on GitHub" },
    ]}
  />
)

const dayWorkflow: Screen = () => (
  <Flow
    items={[
      { icon: GitPullRequest, label: "Branch", sub: "Your own copy for one task" },
      { icon: GitPullRequest, label: "Pull request", sub: "Ask for your change to go in" },
      { icon: CheckCircle2, label: "Review & merge", sub: "Your mentor checks it first" },
    ]}
  />
)

const dayEnvironment: Screen = () => (
  <Flow
    items={[
      { icon: KeyRound, label: "Secrets in .env", sub: "Passwords and keys" },
      { icon: Lock, label: "Ignored by Git", sub: "Never uploaded" },
      { icon: BookOpen, label: ".env.example", sub: "The names, shared safely" },
    ]}
  />
)

/* ------------------------------------------------------------------ */

const week: Screen = () => {
  const days = [
    { day: "Start", mark: 1, title: "Read the milestone", body: ["Split it into small tasks", "Ask questions early"] },
    { day: "During", mark: 2, title: "Small pull requests", body: ["One branch per task", "Review, fix, merge, repeat"] },
    { day: "End", mark: 3, title: "Deliverable ready", body: ["Merged into main", "Shared for review"] },
  ]
  return (
    <Board>
      <p className="mb-4 flex items-center gap-2 text-[13px] font-semibold">
        <CalendarDays className="size-4 text-[#59636e]" /> Every week
      </p>
      <div className="grid grid-cols-3 gap-4">
        {days.map((d) => (
          <Mark key={d.day} n={d.mark} badge="tr">
            <div className="h-full rounded-lg border border-[#d0d7de] p-3">
              <p className="text-[11px] font-semibold tracking-wide text-[#59636e] uppercase">{d.day} of the week</p>
              <p className="mt-1 text-[13.5px] font-semibold">{d.title}</p>
              <ul className="mt-2 space-y-1 text-[12px] text-[#424a53]">
                {d.body.map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>
            </div>
          </Mark>
        ))}
      </div>
    </Board>
  )
}

/* ------------------------------------------------------------------ */

const help: Screen = () => (
  <Board className="mx-auto w-[560px]">
    <p className="mb-3 flex items-center gap-2 text-[12px] text-[#59636e]">
      <MessageSquare className="size-4" /> Message to your mentor
    </p>
    <div className="space-y-3 rounded-2xl rounded-tl-sm bg-[#f0f4f8] p-4 text-[13px] leading-relaxed">
      <Mark n={1} badge="r">
        <p className="px-1">
          Hi! I&apos;m trying to start my API with <code style={{ fontFamily: MONO_FONT }}>npm run dev</code> in the server folder.
        </p>
      </Mark>
      <Mark n={2} badge="r">
        <p className="px-1">I checked PostgreSQL is running and re-read the .env step. Same error after restarting VS Code.</p>
      </Mark>
      <Mark n={3} badge="r">
        <div className="space-y-2 px-1">
          <p className="rounded bg-white px-2 py-1.5 text-[11.5px] text-[#cf222e]" style={{ fontFamily: MONO_FONT }}>
            <AlertCircle className="mr-1 inline size-3" />
            Error: P1000: Authentication failed against database server
          </p>
          <p className="flex items-center gap-1.5 text-[12px] text-[#0969da]">
            <Paperclip className="size-3.5" /> screenshot.png
          </p>
        </div>
      </Mark>
    </div>
  </Board>
)

/* ------------------------------------------------------------------ */

const certificate: Screen = () => (
  <div
    className="mx-auto w-[600px] rounded-xl border-2 border-[#1f2328] border-l-[6px] bg-white p-7 text-center text-[#1f2328]"
    style={{ borderLeftColor: RED }}
  >
    <div className="flex items-center justify-between text-left">
      <p className="flex items-center gap-2 text-[16px] font-semibold">
        <span className="flex size-7 items-center justify-center rounded-md text-white" style={{ background: RED }}>
          <SquareTerminal className="size-4" />
        </span>
        Devvy Tech
      </p>
      <p className="text-[9px] tracking-[0.25em] text-[#59636e]">PROJECT INTERNSHIP PROGRAM</p>
    </div>
    <p className="mt-6 text-[9px] tracking-[0.3em] text-[#59636e]">CERTIFICATE OF COMPLETION</p>
    <p className="mt-1 text-[26px] font-bold tracking-tight">Built it. Shipped it.</p>
    <p className="mt-3 text-[12px] text-[#59636e]">This certifies that</p>
    <p className="mt-1 text-[28px] font-bold">Asha Rao</p>
    <p className="mt-2 text-[12px] text-[#424a53]">has completed the 4-week project internship in</p>
    <p className="text-[15px] font-semibold" style={{ color: RED, fontFamily: MONO_FONT }}>
      Full-Stack Development
    </p>
    <div className="mt-6 flex items-end justify-between border-t border-[#d0d7de] pt-4 text-left">
      <div>
        <p className="text-[9px] tracking-[0.25em] text-[#59636e]">ISSUED ON</p>
        <p className="text-[13px] font-semibold" style={{ fontFamily: MONO_FONT }}>
          12 Dec 2026
        </p>
      </div>
      <Mark n={1} badge="tl">
        <div className="px-1 text-right">
          <p className="text-[9px] tracking-[0.25em] text-[#59636e]">CERTIFICATE ID</p>
          <p className="text-[13px] font-semibold" style={{ fontFamily: MONO_FONT }}>
            DEVVY-2026-0142
          </p>
        </div>
      </Mark>
    </div>
  </div>
)

/* ------------------------------------------------------------------ */

export const welcomeScreens: Record<string, Screen> = {
  "welcome-timeline": timeline,
  "welcome-sidebar": sidebar,
  "welcome-day-setup": daySetup,
  "welcome-day-workflow": dayWorkflow,
  "welcome-day-environment": dayEnvironment,
  "welcome-week": week,
  "welcome-help": help,
  "welcome-certificate": certificate,
}
