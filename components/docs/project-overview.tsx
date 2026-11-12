import { ArrowRight, Ban, CheckCircle2, Database, Flag, Layers, ListChecks, Route, Sparkles, Target, Users, type LucideIcon } from "lucide-react"
import Link from "next/link"

import { Mermaid } from "@/components/docs/mermaid"
import { Mockup } from "@/components/docs/mockup"
import { trackArchitecture } from "@/data/docs/guides"
import { trackStretchGoals } from "@/data/docs/handbook-help"
import { mocks } from "@/data/docs/mocks"
import { projectScreens } from "@/data/docs/project-screens"
import { ScreenGallery } from "@/components/docs/screen-gallery"
import type { ProjectDocs } from "@/data/docs/types"
import type { Track } from "@/data/tracks"
import { dataDiagram, systemDiagram } from "@/lib/docs-diagrams"
import { TechIcon } from "@/lib/tech-icons"
import { trackColorStyle } from "@/lib/track-icons"

/*
 * "Start here" — the first page of a student's project. One story from top
 * to bottom: the problem, what you'll build, how people use it, how it works
 * inside, the data, the four weeks, the finish line, and a self-check.
 * Everything is generated from the project's data (data/docs/projects/…).
 */

function Chapter({ n, icon: Icon, title, intro, children }: { n: number; icon: LucideIcon; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section className="mt-14 scroll-mt-24" id={`part-${n}`}>
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-(--tc)/30 bg-(--tc)/10 text-(--tc)">
          <Icon className="size-4.5" aria-hidden="true" />
        </span>
        <div>
          <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">Part {n}</p>
          <h2 className="font-sans text-xl font-semibold tracking-tight">{title}</h2>
        </div>
      </div>
      {intro && <p className="mt-3 text-pretty text-muted-foreground">{intro}</p>}
      <div className="mt-5">{children}</div>
    </section>
  )
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border bg-card p-4 sm:p-5 ${className}`}>{children}</div>
}

/** Self-check questions, built from the project's own data, each with a hint to reveal. */
function quiz(project: ProjectDocs, name: string) {
  const flow = project.flows[0]
  const links = project.data.flatMap((d) => d.fields.filter((f) => f.includes("→")).map((f) => `${d.name}.${f}`))
  return [
    { q: `In one sentence: what problem does ${name} solve, and for whom?`, hint: `${project.pitch.split(". ")[0]}. For: ${project.users.map((u) => u.who).join(", ")}.` },
    flow && { q: `Walk through “${flow.name}”. What does the user do, and what does the app do back, at each step?`, hint: flow.steps.join(" → ") },
    links.length > 0 && { q: "Which tables point to which, and why does each link exist?", hint: links.join(" · ") },
    { q: "What's the hardest thing in this project to get right?", hint: project.overview },
    { q: "How will you know the project is finished?", hint: project.doneWhen.join(" ") },
  ].filter(Boolean) as { q: string; hint: string }[]
}

export function ProjectOverview({ track, project, name, hrefFor }: { track: Track; project: ProjectDocs; name: string; hrefFor: (doc: string) => string }) {
  const arch = trackArchitecture[track.slug]
  const mock = mocks[project.slug]
  const screens = projectScreens[project.slug] ?? []
  const data = dataDiagram(track.slug, project)
  const interfaceLabel = arch.interfaceTitle.toLowerCase()
  const stats: [string, string][] = [
    [String(track.weeks.length), "weeks"],
    [String(project.mustHave.length), "features"],
    [String(project.data.length), arch.dataTitle === "Data model" ? "tables" : "data parts"],
    // Tracks whose interface is screens count the drawn screens, not the interface list.
    screens.length && interfaceLabel === "screens" ? [String(screens.length), "screens"] : [String(project.interface.length), interfaceLabel],
  ]

  return (
    <div style={trackColorStyle(track.slug)} className="track-color">
      {/* ---- Hero ---- */}
      <header className="relative overflow-hidden rounded-3xl border bg-card p-6 sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-(--tc)/15 blur-3xl" />
        <p className="relative text-xs font-medium text-(--tc)">Start here · {track.name}</p>
        <h1 className="relative mt-2 font-sans text-3xl font-semibold tracking-tight sm:text-4xl">{name}</h1>
        <p className="relative mt-3 max-w-2xl text-base text-pretty text-muted-foreground">{project.pitch}</p>
        <dl className="relative mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label} className="rounded-xl border bg-background/60 px-3 py-2.5">
              <dt className="sr-only">{label}</dt>
              <dd>
                <span className="font-sans text-2xl font-semibold tabular-nums">{value}</span>{" "}
                <span className="text-xs text-muted-foreground">{label}</span>
              </dd>
            </div>
          ))}
        </dl>
        <ul className="relative mt-5 flex flex-wrap gap-1.5" aria-label="Tech stack">
          {track.skills.map((skill) => (
            <li key={skill} className="flex items-center gap-1.5 rounded-full border bg-background/60 px-2.5 py-1 text-xs">
              <TechIcon name={skill} className="size-3.5" />
              {skill}
            </li>
          ))}
        </ul>
        <p className="relative mt-6 text-sm text-pretty">
          Read this page top to bottom before you write any code — about 20 minutes. Then start{" "}
          <Link href={hrefFor("week-1")} className="font-medium text-(--tc) underline-offset-4 hover:underline">
            Week 1
          </Link>
          .
        </p>
      </header>

      {/* ---- 1. The problem ---- */}
      <Chapter n={1} icon={Users} title="The problem" intro="Who you're building for, and what they need. Every decision you make should help one of these people.">
        <div className="grid gap-3 sm:grid-cols-2">
          {project.users.map((user) => (
            <Card key={user.who}>
              <p className="flex items-center gap-2 font-medium">
                <span className="flex size-7 items-center justify-center rounded-full bg-(--tc)/10 text-xs font-semibold text-(--tc)">{user.who[0]}</span>
                {user.who}
              </p>
              <p className="mt-2 text-pretty text-muted-foreground">“{user.need}”</p>
            </Card>
          ))}
        </div>
      </Chapter>

      {/* ---- 2. What you'll build ---- */}
      <Chapter
        n={2}
        icon={Layers}
        title="What you'll build"
        intro={
          screens.length
            ? `Every screen of your app — ${screens.length} in all — and every feature it must have. Click a screen to see what's on it. Yours can look different; the features can't.`
            : "The main screen, and every feature it must have. Yours can look different — the features can't."
        }
      >
        {screens.length > 0 && (
          <div className="mb-5">
            <ScreenGallery screens={screens} />
          </div>
        )}
        {!screens.length && mock && (
          <figure className="mb-5">
            <div className="rounded-2xl border bg-muted/30 p-4 sm:p-6">
              <Mockup mock={mock} />
            </div>
            <figcaption className="mt-2 text-xs text-muted-foreground">A preview of the finished project.</figcaption>
          </figure>
        )}
        <ol className="grid gap-2 sm:grid-cols-2">
          {project.mustHave.map((feature, i) => (
            <li key={feature} className="flex gap-3 rounded-xl border bg-card p-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-(--tc)/10 font-mono text-[11px] font-semibold text-(--tc)">{i + 1}</span>
              <span className="text-pretty">{feature}</span>
            </li>
          ))}
        </ol>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Card>
            <p className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="size-4 text-(--tc)" aria-hidden="true" /> If you finish early
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {[...new Set([...project.niceToHave, ...trackStretchGoals[track.slug]])].map((item) => (
                <li key={item}>+ {item}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <p className="flex items-center gap-2 text-sm font-medium">
              <Ban className="size-4 text-muted-foreground" aria-hidden="true" /> Not part of this project
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {project.outOfScope.map((item) => (
                <li key={item}>× {item}</li>
              ))}
            </ul>
          </Card>
        </div>
      </Chapter>

      {/* ---- 3. How people use it ---- */}
      <Chapter n={3} icon={Route} title="How people use it" intro="The main paths through your project. Before you finish, you'll test each one end to end, exactly like this.">
        <div className="space-y-4">
          {project.flows.map((flow) => (
            <Card key={flow.name}>
              <p className="font-medium">{flow.name}</p>
              <ol className="mt-4 grid gap-2 sm:grid-flow-col sm:auto-cols-fr">
                {flow.steps.map((step, i) => {
                  const last = i === flow.steps.length - 1
                  return (
                    <li key={step} className="relative flex sm:flex-col">
                      <div
                        className={`flex flex-1 flex-col gap-2 rounded-xl border p-3 text-sm ${last ? "border-(--tc)/50 bg-(--tc)/10" : "bg-background/60"}`}
                      >
                        <span
                          className={`flex size-6 items-center justify-center rounded-full font-mono text-[11px] font-semibold ${last ? "bg-(--tc) text-white" : "border text-muted-foreground"}`}
                        >
                          {last ? "✓" : i + 1}
                        </span>
                        <span className="text-pretty">{step}</span>
                      </div>
                      {!last && (
                        <ArrowRight
                          className="absolute top-1/2 -right-2.5 z-10 hidden size-4 -translate-y-1/2 rounded-full bg-card text-muted-foreground sm:block"
                          aria-hidden="true"
                        />
                      )}
                    </li>
                  )
                })}
              </ol>
            </Card>
          ))}
        </div>
      </Chapter>

      {/* ---- 4. How it works inside ---- */}
      <Chapter n={4} icon={Layers} title="How it works inside" intro={arch.summary}>
        <Card>
          <Mermaid chart={systemDiagram(track.slug, project)} caption="How the pieces connect. The highlighted box is where most of your logic lives." />
        </Card>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {arch.parts.map((part) => (
            <Card key={part.name}>
              <p className="font-medium">{part.name}</p>
              <p className="mt-1 text-sm text-pretty text-muted-foreground">{part.role}</p>
            </Card>
          ))}
        </div>
        <div className="mt-3 flex gap-3 rounded-2xl border border-(--tc)/30 bg-(--tc)/5 p-4">
          <Target className="mt-0.5 size-4 shrink-0 text-(--tc)" aria-hidden="true" />
          <p className="text-pretty">
            <span className="font-medium">The key idea: </span>
            {project.overview}
          </p>
        </div>
      </Chapter>

      {/* ---- 5. The data ---- */}
      <Chapter n={5} icon={Database} title="The data" intro={`Your ${arch.dataTitle.toLowerCase()}: what your app stores, and how the pieces link.`}>
        {data && (
          <Card className="mb-3">
            <Mermaid chart={data} caption="Each box is a table; lines show how they link." />
          </Card>
        )}
        <div className={data ? "hidden" : "grid gap-3 sm:grid-cols-2"}>
          {project.data.map((entity) => (
            <div key={entity.name} className="overflow-hidden rounded-2xl border bg-card">
              <p className="border-b bg-(--tc)/5 px-4 py-2 font-mono text-sm font-semibold">{entity.name}</p>
              <ul className="divide-y">
                {entity.fields.map((field) => (
                  <li key={field} className={`px-4 py-1.5 font-mono text-xs ${field.includes("→") ? "text-(--tc)" : ""}`}>
                    {field}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Chapter>

      {/* ---- 6. Your four weeks ---- */}
      <Chapter n={6} icon={Flag} title="Your four weeks" intro="Each week has its own page with every task, step by step. One task is one pull request.">
        <ol className="relative grid gap-3 sm:grid-cols-2">
          {track.weeks.map((week, i) => (
            <li key={week.title}>
              <Link href={hrefFor(`week-${i + 1}`)} className="group block h-full rounded-2xl border bg-card p-4 transition-colors hover:border-(--tc)/50">
                <p className="font-mono text-[11px] tracking-wider text-(--tc) uppercase">Week {i + 1}</p>
                <p className="mt-1 font-medium">{week.title}</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {week.points.slice(0, 3).map((point) => (
                    <li key={point}>· {point}</li>
                  ))}
                </ul>
                <p className="mt-3 flex items-center gap-1.5 border-t pt-3 text-xs">
                  <CheckCircle2 className="size-3.5 text-(--tc)" aria-hidden="true" />
                  {week.deliverable}
                  <ArrowRight className="ml-auto size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </p>
              </Link>
            </li>
          ))}
        </ol>
      </Chapter>

      {/* ---- 7. Done when ---- */}
      <Chapter n={7} icon={Target} title="The finish line" intro="Your final review checks exactly these. Keep them in mind from day one.">
        <ul className="space-y-2 rounded-2xl border bg-card p-4 sm:p-5">
          {project.doneWhen.map((item) => (
            <li key={item} className="flex gap-3">
              <Target className="mt-0.5 size-4 shrink-0 text-(--tc)" aria-hidden="true" />
              <span className="text-pretty">{item}</span>
            </li>
          ))}
        </ul>
      </Chapter>

      {/* ---- 8. Check you've got it ---- */}
      <Chapter n={8} icon={ListChecks} title="Check you've got it" intro="Answer each one out loud, or in a note, before you start. Then open the hint to compare.">
        <div className="space-y-2">
          {quiz(project, name).map(({ q, hint }, i) => (
            <details key={q} className="group rounded-xl border bg-card px-4 py-3 open:border-(--tc)/40">
              <summary className="flex cursor-pointer list-none gap-3 font-medium marker:hidden">
                <span className="font-mono text-xs text-(--tc)">Q{i + 1}</span>
                <span className="flex-1 text-pretty">{q}</span>
                <span className="text-xs font-normal text-muted-foreground group-open:hidden">Show hint</span>
              </summary>
              <p className="mt-2 border-t pt-2 pl-8 text-sm text-pretty text-muted-foreground">{hint}</p>
            </details>
          ))}
        </div>
      </Chapter>

      {/* ---- Start ---- */}
      <Link
        href={hrefFor("week-1")}
        className="group mt-14 flex items-center justify-between gap-4 rounded-3xl border border-(--tc)/40 bg-(--tc)/10 p-6 transition-colors hover:bg-(--tc)/15"
      >
        <span>
          <span className="block font-mono text-[11px] tracking-wider text-(--tc) uppercase">You&apos;re ready</span>
          <span className="mt-1 block font-sans text-xl font-semibold">Start Week 1: {track.weeks[0].title}</span>
        </span>
        <ArrowRight className="size-5 shrink-0 text-(--tc) transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </Link>
    </div>
  )
}
