import { Check, ChevronDown, Clock, FileText, Frame, Hand, Link2, MessageCircle, MousePointer2, Pencil, Plus, Shapes, Square, Type, Users } from "lucide-react"
import { SiFigma, SiGithub } from "react-icons/si"

import { Board, Browser, EmailCompose, Mark, MONO_FONT } from "@/components/docs/screens/kit"
import { MENTOR_EMAIL } from "@/components/docs/screens/welcome"
import { USER } from "@/components/docs/screens/fullstack"
import { GoodBad } from "@/components/docs/screens/workflow"
import type { OS } from "@/data/docs/types"
import { cn } from "@/lib/utils"

/*
 * Screens for the UI/UX track's Setup, How we work and Environment pages
 * (data/docs/setup/design.ts, data/docs/workflow.ts, data/docs/environment.ts).
 */

type Screen = (os: OS) => React.ReactNode

const FILE = "Habit tracker — Design"
const PAGES = ["Research", "Wireframes", "UI"]
const figIcon = <SiFigma className="size-3.5" />

/* ------------------------------------------------------------------ */
/* Figma building blocks                                               */
/* ------------------------------------------------------------------ */

function FigmaHome({ os, menu }: { os: OS; menu?: "design" | "figjam" }) {
  return (
    <Browser os={os} url="figma.com/files/recents" tab="Recents – Figma" tabIcon={figIcon}>
      <div className="flex min-h-[340px] bg-white text-[#1e1e1e]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        <div className="w-48 shrink-0 space-y-1 border-r border-[#e6e6e6] p-3 text-[12px]">
          <p className="mb-2 flex items-center gap-2 font-semibold">
            <span className="flex size-6 items-center justify-center rounded-full bg-[#1f6feb] text-[10px] text-white">A</span> Asha Rao
          </p>
          {["Recents", "Community", "Drafts", "All projects", "Trash"].map((s, i) => (
            <p key={s} className={cn("rounded px-2 py-1", i === 0 && "bg-[#f0f0f0] font-semibold")}>
              {s}
            </p>
          ))}
        </div>
        <div className="relative flex-1 p-5">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-semibold">Recents</p>
            <Mark n={1} className="inline-block">
              <span className="flex items-center gap-1 rounded-md bg-[#0d99ff] px-3 py-1.5 text-[12px] font-semibold text-white">
                <Plus className="size-3.5" /> Create
              </span>
            </Mark>
          </div>
          {menu && (
            <div className="absolute top-14 right-5 z-10 w-52 rounded-lg border border-[#e6e6e6] bg-white p-1 text-[12.5px] shadow-xl">
              {[
                { label: "Design", sub: "Design and prototype", me: menu === "design" },
                { label: "FigJam board", sub: "Whiteboard and diagram", me: menu === "figjam" },
                { label: "Slides", sub: "Build presentations", me: false },
              ].map((i) =>
                i.me ? (
                  <Mark key={i.label} n={2} badge="l">
                    <div className="rounded bg-[#e5f4ff] px-3 py-2">
                      <p className="font-semibold">{i.label}</p>
                      <p className="text-[11px] text-[#666]">{i.sub}</p>
                    </div>
                  </Mark>
                ) : (
                  <div key={i.label} className="px-3 py-2">
                    <p className="font-semibold">{i.label}</p>
                    <p className="text-[11px] text-[#666]">{i.sub}</p>
                  </div>
                )
              )}
            </div>
          )}
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-lg border border-[#e6e6e6]">
                <div className="h-20 rounded-t-lg bg-[#f5f5f5]" />
                <p className="px-3 py-2 text-[11.5px] text-[#999]">Untitled</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Browser>
  )
}

/** The Figma editor (UI3, light). */
function FigmaEditor({
  os,
  page = "Research",
  pagesMark,
  plusMark,
  shareMark,
  canvas,
  right,
  title = FILE,
  titleMenu,
  hideRight,
}: {
  hideRight?: boolean
  os: OS
  page?: string
  pagesMark?: number
  plusMark?: number
  shareMark?: number
  canvas?: React.ReactNode
  right?: React.ReactNode
  title?: string
  titleMenu?: React.ReactNode
}) {
  const pages = (
    <div className="space-y-0.5">
      {PAGES.map((p) => (
        <p key={p} className={cn("rounded px-2 py-[3px]", p === page && "bg-[#e5f4ff] font-semibold")}>
          {p}
        </p>
      ))}
    </div>
  )
  return (
    <Browser os={os} url={`figma.com/design/k3Xh9/${title.split(" — ")[0].toLowerCase().replace(/ /g, "-")}`} tab={`${title} – Figma`} tabIcon={figIcon}>
      <div className="flex h-[380px] bg-[#f5f5f5] text-[11.5px] text-[#1e1e1e]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        <div className="relative w-52 shrink-0 border-r border-[#e6e6e6] bg-white p-3">
          <p className="flex items-center gap-1.5 font-semibold">
            <SiFigma className="size-3.5" /> {title} <ChevronDown className="size-3" />
          </p>
          {titleMenu}
          <p className="mt-0.5 text-[10.5px] text-[#999]">Drafts</p>
          <p className="mt-4 mb-1 flex items-center justify-between px-2 font-semibold">
            Pages
            {plusMark !== undefined ? (
              <Mark n={plusMark} badge="r" round>
                <Plus className="size-3.5" />
              </Mark>
            ) : (
              <Plus className="size-3.5" />
            )}
          </p>
          {pagesMark !== undefined ? (
            <Mark n={pagesMark} badge="r" className="mr-6">
              {pages}
            </Mark>
          ) : (
            pages
          )}
          <p className="mt-4 border-t border-[#e6e6e6] px-2 pt-3 font-semibold">Layers</p>
        </div>
        <div className="relative flex-1 overflow-hidden">
          {canvas}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-lg">
            {[MousePointer2, Frame, Square, Pencil, Type, MessageCircle, Hand].map((Icon, i) => (
              <Icon key={i} className={cn("size-4", i === 0 ? "text-[#0d99ff]" : "text-[#444]")} />
            ))}
          </div>
        </div>
        <div className={cn("w-52 shrink-0 border-l border-[#e6e6e6] bg-white p-3", hideRight && "hidden")}>
          <div className="flex items-center justify-between">
            <span className="flex size-6 items-center justify-center rounded-full bg-[#1f6feb] text-[10px] font-bold text-white">A</span>
            {shareMark !== undefined ? (
              <Mark n={shareMark}>
                <span className="block rounded-md bg-[#0d99ff] px-3 py-1 font-semibold text-white">Share</span>
              </Mark>
            ) : (
              <span className="rounded-md bg-[#0d99ff] px-3 py-1 font-semibold text-white">Share</span>
            )}
          </div>
          <div className="mt-4">{right ?? <p className="font-semibold">Design</p>}</div>
        </div>
      </div>
    </Browser>
  )
}

function PhoneFrame({ label, children, className }: { label: string; children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("absolute", className)}>
      <p className="mb-1 text-[10px] text-[#999]">{label}</p>
      <div className="h-[220px] w-[120px] rounded-md bg-white p-2 shadow">{children}</div>
    </div>
  )
}

function ShareDialog({ os, access = "can view" }: { os: OS; access?: string }) {
  return (
    <FigmaEditor
      os={os}
      shareMark={1}
      canvas={
        <div className="absolute inset-0 flex items-start justify-center bg-black/20 pt-6">
          <div className="w-[300px] rounded-xl bg-white p-4 shadow-2xl">
            <p className="text-[13px] font-semibold">Share this file</p>
            <div className="mt-3 flex gap-2">
              <Mark n={2} className="flex-1">
                <span className="block rounded-md border border-[#0d99ff] px-2 py-1.5">mentor@devvy.example</span>
              </Mark>
              <Mark n={3}>
                <span className="flex items-center gap-1 rounded-md border border-[#e6e6e6] px-2 py-1.5">
                  {access} <ChevronDown className="size-3" />
                </span>
              </Mark>
            </div>
            <div className="mt-3 flex justify-end">
              <Mark n={4}>
                <span className="block rounded-md bg-[#0d99ff] px-4 py-1.5 font-semibold text-white">Invite</span>
              </Mark>
            </div>
            <p className="mt-4 flex items-center gap-2 border-t border-[#eee] pt-3 text-[11px] text-[#666]">
              <Users className="size-3.5" /> Asha Rao (you) — owner
            </p>
          </div>
        </div>
      }
    />
  )
}

/* ------------------------------------------------------------------ */
/* Setup                                                               */
/* ------------------------------------------------------------------ */

const uxSignup: Screen = (os) => (
  <Browser os={os} url="figma.com/signup" tab="Sign up – Figma" tabIcon={figIcon}>
    <div className="flex justify-center bg-white px-10 py-8 text-[#1e1e1e]">
      <div className="w-[320px]">
        <SiFigma className="mx-auto size-8" />
        <p className="mt-3 text-center text-[20px] font-bold">Create your account</p>
        <p className="mt-4 rounded-md border border-[#e6e6e6] py-2 text-center text-[12.5px]">Continue with Google</p>
        <p className="my-3 text-center text-[11px] text-[#999]">or</p>
        <Mark n={1}>
          <div className="space-y-2 p-1 text-[12px]">
            <p className="rounded-md border border-[#e6e6e6] px-3 py-2">asha@example.com</p>
            <p className="rounded-md border border-[#e6e6e6] px-3 py-2">••••••••••••</p>
          </div>
        </Mark>
        <Mark n={2} className="mt-3">
          <span className="block rounded-md bg-[#0d99ff] py-2 text-center text-[13px] font-semibold text-white">Create account</span>
        </Mark>
      </div>
    </div>
  </Browser>
)

const uxEducation: Screen = (os) => (
  <Browser os={os} url="figma.com/education" tab="Figma for Education" tabIcon={figIcon}>
    <div className="bg-[#f3ffe3] px-10 py-10 text-[#1e1e1e]">
      <p className="text-[12px] font-semibold tracking-wide uppercase">Figma for Education</p>
      <p className="mt-2 w-[420px] text-[30px] leading-tight font-bold">Free for students and educators</p>
      <p className="mt-3 w-[420px] text-[13px] text-[#444]">Get verified to use Figma&apos;s Professional features for free.</p>
      <Mark n={1} className="mt-5 inline-block">
        <span className="block rounded-full bg-[#1e1e1e] px-5 py-2 text-[13px] font-semibold text-white">Get verified</span>
      </Mark>
    </div>
  </Browser>
)

const uxDownload: Screen = (os) =>
  os === "linux" ? null : (
    <Browser os={os} url="figma.com/downloads" tab="Downloads – Figma" tabIcon={figIcon}>
      <div className="bg-white px-10 py-8 text-[#1e1e1e]">
        <p className="text-[24px] font-bold">Downloads</p>
        <div className="mt-5 flex items-center justify-between rounded-lg border border-[#e6e6e6] p-4">
          <div className="flex items-center gap-3">
            <SiFigma className="size-8" />
            <div>
              <p className="text-[14px] font-semibold">Desktop app</p>
              <p className="text-[12px] text-[#666]">{os === "mac" ? "macOS 11 and later" : "Windows 10 and later"}</p>
            </div>
          </div>
          <Mark n={1}>
            <span className="block rounded-md bg-[#0d99ff] px-4 py-2 text-[12.5px] font-semibold text-white">Download for {os === "mac" ? "macOS" : "Windows"}</span>
          </Mark>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-lg border border-[#e6e6e6] p-4 opacity-70">
          <p className="text-[14px] font-semibold">Font installer</p>
          <span className="rounded-md border border-[#e6e6e6] px-4 py-2 text-[12.5px]">Download</span>
        </div>
      </div>
    </Browser>
  )

const uxNewFile: Screen = (os) => <FigmaHome os={os} menu="design" />
const uxFigjam: Screen = (os) => <FigmaHome os={os} menu="figjam" />

const uxPages: Screen = (os) => (
  <FigmaEditor
    os={os}
    plusMark={1}
    pagesMark={2}
    canvas={
      <div className="absolute top-8 left-10">
        <p className="mb-1 text-[10px] text-[#999]">Research</p>
        <div className="flex h-[180px] w-[300px] flex-col justify-end rounded-md bg-[#1e1e1e] p-4 text-white shadow">
          <p className="text-[18px] font-bold">Habit tracker — Research</p>
          <p className="text-[11px] opacity-70">Interviews, insights and screenshots</p>
        </div>
      </div>
    }
  />
)

const uxShare: Screen = (os) => <ShareDialog os={os} />

function GitHubPage({ os, url, children }: { os: OS; url: string; children: React.ReactNode }) {
  return (
    <Browser os={os} url={url} tab="GitHub" tabIcon={<SiGithub className="size-3.5" />}>
      <div className="min-h-[320px] bg-white px-8 py-6 text-[#1f2328]">{children}</div>
    </Browser>
  )
}

const uxRepoNew: Screen = (os) => (
  <GitHubPage os={os} url="github.com/new">
    <p className="text-[20px] font-semibold">Create a new repository</p>
    <div className="mt-4 flex items-end gap-2 text-[12.5px]">
      <div>
        <p className="mb-1 font-semibold">Owner</p>
        <p className="rounded-md border border-[#d1d9e0] px-3 py-1.5">{USER}</p>
      </div>
      <span className="pb-1.5 text-[18px]">/</span>
      <div className="flex-1">
        <p className="mb-1 font-semibold">Repository name *</p>
        <Mark n={1}>
          <p className="rounded-md border-2 border-[#0969da] px-3 py-1.5">my-case-study</p>
        </Mark>
      </div>
    </div>
    <div className="mt-4 space-y-2 text-[12.5px]">
      <Mark n={2} className="inline-block pr-2">
        <p>
          ◉ <b>Public</b> <span className="text-[#59636e]">Anyone on the internet can see this repository.</span>
        </p>
      </Mark>
      <p className="text-[#59636e]">○ Private</p>
    </div>
    <div className="mt-4 flex items-center justify-between rounded-md border border-[#d1d9e0] px-3 py-2 text-[12.5px]">
      <span>
        <b>Add README</b> <span className="text-[#59636e]">— a long description for your project.</span>
      </span>
      <Mark n={3}>
        <span className="flex h-5 w-9 items-center justify-end rounded-full bg-[#1f883d] p-0.5">
          <span className="size-4 rounded-full bg-white" />
        </span>
      </Mark>
    </div>
    <div className="mt-5 flex justify-end">
      <Mark n={4}>
        <span className="block rounded-md bg-[#1f883d] px-4 py-1.5 text-[12.5px] font-semibold text-white">Create repository</span>
      </Mark>
    </div>
  </GitHubPage>
)

const uxReadmeEdit: Screen = (os) => (
  <GitHubPage os={os} url={`github.com/${USER}/my-case-study/edit/main/README.md`}>
    <p className="flex items-center gap-2 text-[14px]">
      <span className="text-[#0969da]">my-case-study</span> / <b>README.md</b> <span className="text-[#59636e]">in main</span>
    </p>
    <div className="mt-3 overflow-hidden rounded-md border border-[#d1d9e0]">
      <div className="flex items-center justify-between border-b border-[#d1d9e0] bg-[#f6f8fa] px-3 py-1.5 text-[12px]">
        <span className="flex gap-3">
          <b>Edit</b> <span className="text-[#59636e]">Preview</span>
        </span>
        <Mark n={1} badge="l" round>
          <Pencil className="size-3.5 text-[#59636e]" />
        </Mark>
      </div>
      <div className="p-3 text-[12px] leading-relaxed" style={{ fontFamily: MONO_FONT }}>
        {["# Habit tracker", "", "One sentence on what you designed and for whom.", "", "## Problem", "", "## Users", "", "## Research", "", "## Flows"].map((l, i) => (
          <p key={i} className={l.startsWith("#") ? "text-[#0550ae]" : ""}>
            {l || " "}
          </p>
        ))}
      </div>
    </div>
    <div className="mt-3 flex justify-end">
      <Mark n={2}>
        <span className="block rounded-md bg-[#1f883d] px-4 py-1.5 text-[12.5px] font-semibold text-white">Commit changes…</span>
      </Mark>
    </div>
  </GitHubPage>
)

/* ------------------------------------------------------------------ */
/* How we work                                                         */
/* ------------------------------------------------------------------ */

const uxComment: Screen = (os) => (
  <FigmaEditor
    os={os}
    hideRight
    page="Wireframes"
    canvas={
      <>
        <PhoneFrame label="Home — today" className="top-6 left-8">
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-[#e6e6e6]" />
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-7 rounded bg-[#f0f0f0]" />
            ))}
          </div>
        </PhoneFrame>
        <div className="absolute top-24 left-[118px]">
          <Mark n={1} round>
            <span className="flex size-7 items-center justify-center rounded-full rounded-bl-none bg-[#8250df] text-[11px] font-bold text-white">M</span>
          </Mark>
        </div>
        <div className="absolute top-14 left-[180px] w-[230px] rounded-xl bg-white p-3 shadow-xl">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 font-semibold">
              <span className="flex size-5 items-center justify-center rounded-full bg-[#8250df] text-[9px] text-white">M</span> devvy-mentor
            </p>
            <Mark n={3} badge="r" round>
              <span className="flex size-6 items-center justify-center rounded-full border border-[#e6e6e6]">
                <Check className="size-3.5" />
              </span>
            </Mark>
          </div>
          <p className="mt-1.5">The streak is the main thing users care about — can it be bigger and above the list?</p>
          <Mark n={2} className="mt-3">
            <p className="rounded-md border border-[#0d99ff] px-2 py-1.5 text-[#666]">Reply… Moved it up and made it 2× bigger</p>
          </Mark>
        </div>
      </>
    }
  />
)

const uxVersion: Screen = (os) => (
  <FigmaEditor
    os={os}
    page="UI"
    titleMenu={
      <div className="absolute top-8 left-3 z-10 w-48 rounded-lg border border-[#e6e6e6] bg-white p-1 shadow-xl">
        {["Rename", "Duplicate", "Move to project…"].map((i) => (
          <p key={i} className="px-2 py-1">
            {i}
          </p>
        ))}
        <Mark n={1} badge="r">
          <p className="rounded bg-[#e5f4ff] px-2 py-1 font-semibold">Save to version history</p>
        </Mark>
        <p className="px-2 py-1">Show version history</p>
      </div>
    }
    canvas={
      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
        <div className="w-[280px] rounded-xl bg-white p-4 shadow-2xl">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold">
            <Clock className="size-4" /> Save to version history
          </p>
          <Mark n={2} className="mt-3">
            <p className="rounded-md border border-[#0d99ff] px-2 py-1.5">Week 2 review</p>
          </Mark>
          <p className="mt-2 rounded-md border border-[#e6e6e6] px-2 py-1.5 text-[#999]">Describe what changed (optional)</p>
          <div className="mt-3 flex justify-end">
            <Mark n={3}>
              <span className="block rounded-md bg-[#0d99ff] px-4 py-1.5 font-semibold text-white">Save</span>
            </Mark>
          </div>
        </div>
      </div>
    }
  />
)

const uxLink: Screen = (os) => (
  <FigmaEditor
    os={os}
    hideRight
    page="UI"
    canvas={
      <>
        <PhoneFrame label="Home — today" className="top-6 left-8 outline-2 outline-[#0d99ff]" />
        <div className="absolute top-16 left-[170px] w-52 rounded-lg border border-[#e6e6e6] bg-white p-1 shadow-xl">
          {["Copy", "Paste here", "Copy/Paste as  ›"].map((i) => (
            <p key={i} className={cn("px-2 py-1", i.startsWith("Copy/") && "bg-[#f0f0f0]")}>
              {i}
            </p>
          ))}
          <p className="px-2 py-1">Bring to front</p>
          <p className="px-2 py-1">Add auto layout</p>
        </div>
        <div className="absolute top-[100px] left-[378px] w-48 rounded-lg border border-[#e6e6e6] bg-white p-1 shadow-xl">
          <p className="px-2 py-1">Copy as text</p>
          <p className="px-2 py-1">Copy as CSS</p>
          <Mark n={1} badge="r">
            <p className="flex items-center gap-1.5 rounded bg-[#e5f4ff] px-2 py-1 font-semibold">
              <Link2 className="size-3.5" /> Copy link to selection
            </p>
          </Mark>
        </div>
      </>
    }
  />
)

const uxCommit: Screen = (os) => (
  <GitHubPage os={os} url={`github.com/${USER}/my-case-study/edit/main/README.md`}>
    <div className="mx-auto w-[420px] rounded-xl border border-[#d1d9e0] p-4 shadow-xl">
      <p className="text-[14px] font-semibold">Commit changes</p>
      <p className="mt-3 mb-1 text-[12px] font-semibold">Commit message</p>
      <Mark n={1}>
        <p className="rounded-md border-2 border-[#0969da] px-3 py-1.5 text-[12.5px]">Add week 2 research</p>
      </Mark>
      <p className="mt-3 mb-1 text-[12px] font-semibold">Extended description</p>
      <p className="h-12 rounded-md border border-[#d1d9e0]" />
      <p className="mt-3 text-[12px]">◉ Commit directly to the main branch</p>
      <div className="mt-4 flex justify-end gap-2">
        <span className="rounded-md border border-[#d1d9e0] px-3 py-1.5 text-[12px]">Cancel</span>
        <Mark n={2}>
          <span className="block rounded-md bg-[#1f883d] px-3 py-1.5 text-[12px] font-semibold text-white">Commit changes</span>
        </Mark>
      </div>
    </div>
  </GitHubPage>
)

const uxMessage: Screen = () => (
  <EmailCompose to={MENTOR_EMAIL} subject="[UI/UX] Week 2 ready for review">
    <p>Hi! Week 2 is ready for review 🎨</p>
    <p className="flex items-center gap-1.5 text-[#0b57d0]">
      <Frame className="size-3.5" /> figma.com/design/k3Xh9/habit-tracker?node-id=42-118
    </p>
    <p className="flex items-center gap-1.5 text-[#0b57d0]">
      <FileText className="size-3.5" /> github.com/{USER}/my-case-study
    </p>
    <p>I&apos;d especially like feedback on the onboarding flow — I&apos;m not sure 3 screens is too many.</p>
  </EmailCompose>
)

const uxNaming: Screen = () => (
  <GoodBad
    rows={[
      { title: "Frames", good: ["Home — empty state", "Onboarding / 2 — goals"], bad: ["Frame 12", "Copy of Frame 12"] },
      { title: "Files", good: ["One file, named versions", "Pages per stage"], bad: ["Design final FINAL v3", "A new file every week"] },
    ]}
  />
)

const uxAi: Screen = () => (
  <GoodBad
    headers={["Do", "Don't"]}
    rows={[
      { title: "Research", good: ["Draft interview questions", "Group your notes into themes"], bad: ["Invent “user quotes”", "Paste recordings or names"] },
      { title: "Design", good: ["First drafts to react to", "Say what AI helped with"], bad: ["Ship AI layouts unchanged", "Skip testing with people"] },
    ]}
  />
)

/* ------------------------------------------------------------------ */
/* Environment (research data)                                         */
/* ------------------------------------------------------------------ */

const uxConsent: Screen = () => (
  <Board className="mx-auto w-[560px]">
    <Mark n={1} badge="tr">
      <div className="rounded-lg border border-[#d0d7de] bg-[#f6f8fa] p-4 text-[13px] leading-relaxed">
        <p className="text-[11px] font-semibold tracking-wide text-[#59636e] uppercase">Consent script — read before you start</p>
        <p className="mt-2">
          “Thanks for talking to me. I&apos;m designing a habit-tracking app as a student project. I&apos;d like to ask about how you build habits — there are no right
          or wrong answers.
        </p>
        <p className="mt-2">
          With your permission I&apos;ll record this, only so I can take notes. The recording stays private and I&apos;ll delete it when the project ends. If I
          quote you, I won&apos;t use your name. You can stop at any time. Is that okay?”
        </p>
      </div>
    </Mark>
  </Board>
)

const uxAnon: Screen = () => (
  <GoodBad
    headers={["Publish", "Never publish"]}
    rows={[
      { title: "Who", good: ["P1, 21, student", "P2, works full-time"], bad: ["Priya Sharma", "priya@college.edu"] },
      { title: "What", good: ["“I forget after day 3” — P1", "Themes and insights"], bad: ["Raw recordings", "Photos of participants"] },
    ]}
  />
)

const uxProtoShare: Screen = (os) => (
  <Browser os={os} url="figma.com/proto/k3Xh9/habit-tracker" tab="Habit tracker – Prototype" tabIcon={figIcon}>
    <div className="relative flex h-[340px] items-center justify-center bg-[#1e1e1e]">
      <div className="h-[260px] w-[130px] rounded-xl bg-white" />
      <div className="absolute top-6 right-6 w-[290px] rounded-xl bg-white p-4 text-[12px] text-[#1e1e1e] shadow-2xl">
        <p className="text-[13px] font-semibold">Share prototype</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Shapes className="size-3.5" /> Anyone with the link
          </span>
          <Mark n={1}>
            <span className="flex items-center gap-1 rounded-md border border-[#e6e6e6] px-2 py-1">
              can view <ChevronDown className="size-3" />
            </span>
          </Mark>
        </div>
        <div className="mt-4 flex justify-end">
          <Mark n={2}>
            <span className="flex items-center gap-1.5 rounded-md bg-[#0d99ff] px-3 py-1.5 font-semibold text-white">
              <Link2 className="size-3.5" /> Copy link
            </span>
          </Mark>
        </div>
      </div>
    </div>
  </Browser>
)

/* ------------------------------------------------------------------ */

export const designScreens: Record<string, Screen> = {
  "ux-signup": uxSignup,
  "ux-education": uxEducation,
  "ux-download": uxDownload,
  "ux-new-file": uxNewFile,
  "ux-pages": uxPages,
  "ux-figjam": uxFigjam,
  "ux-share": uxShare,
  "ux-repo-new": uxRepoNew,
  "ux-readme-edit": uxReadmeEdit,
  "ux-comment": uxComment,
  "ux-version": uxVersion,
  "ux-link": uxLink,
  "ux-commit": uxCommit,
  "ux-message": uxMessage,
  "ux-naming": uxNaming,
  "ux-ai": uxAi,
  "ux-consent": uxConsent,
  "ux-anon": uxAnon,
  "ux-proto-share": uxProtoShare,
}

