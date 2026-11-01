import { CheckCircle2, ExternalLink, Lightbulb, Lock, Sparkles, Target, XCircle } from "lucide-react"

import { CodeBlock } from "@/components/docs/code-block"
import { Mermaid } from "@/components/docs/mermaid"
import { Mockup } from "@/components/docs/mockup"
import { OsTabs } from "@/components/docs/os-tabs"
import { Steps } from "@/components/docs/steps"
import {
  contracts,
  getProjectDocs,
  sampleData,
  setupGuides,
  tools,
  trackArchitecture,
  welcomeGuide,
  workflowGuide,
  type DocId,
} from "@/data/docs"
import { deploymentGuide, environmentGuide, standardsGuide, testingGuide } from "@/data/docs/handbook-build"
import {
  resourcesGuide,
  rubricGuide,
  submissionGuide,
  terminalBasics,
  trackStretchGoals,
  troubleshootingGuide,
} from "@/data/docs/handbook-help"
import { mocks } from "@/data/docs/mocks"
import type { GuideSection, ProjectDocs } from "@/data/docs/types"
import type { Track } from "@/data/tracks"
import { dataDiagram, flowDiagram, systemDiagram } from "@/lib/docs-diagrams"
import { TechIcon } from "@/lib/tech-icons"
import { trackColorStyle } from "@/lib/track-icons"

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 mb-4 border-b pb-2 font-sans text-lg font-semibold tracking-tight first:mt-0">{children}</h2>
}

function Callout({ icon: Icon = Lightbulb, children }: { icon?: typeof Lightbulb; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border border-brand/25 bg-brand/5 px-4 py-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-brand-text" aria-hidden="true" />
      <div className="min-w-0 text-pretty whitespace-pre-line">{children}</div>
    </div>
  )
}

function Bullets({ items, icon: Icon }: { items: string[]; icon?: typeof CheckCircle2 }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          {Icon ? (
            <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          ) : (
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/60" aria-hidden="true" />
          )}
          <span className="text-pretty">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function DocTitle({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <header className="mb-8">
      <p className="text-xs font-medium text-brand-text">{eyebrow}</p>
      <h1 className="mt-1 font-sans text-3xl font-semibold tracking-tight">{title}</h1>
      {intro && <p className="mt-3 text-base text-pretty text-muted-foreground">{intro}</p>}
    </header>
  )
}

function Guide({ sections }: { sections: GuideSection[] }) {
  return sections.map((section) => (
    <section key={section.title}>
      <H2>{section.title}</H2>
      <div className="space-y-4">
        {section.paragraphs?.map((p) => (
          <p key={p} className="text-pretty">
            {p}
          </p>
        ))}
        {section.bullets && <Bullets items={section.bullets} />}
        {section.checklist && <Checklist items={section.checklist} />}
        {section.code && <CodeBlock code={section.code.code} file={section.code.file} />}
        {section.steps && <Steps steps={section.steps} />}
        {section.links && (
          <ul className="divide-y overflow-hidden rounded-xl border bg-card">
            {section.links.map((link) => (
              <li key={link.url} className="px-4 py-3">
                <a href={link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-medium text-brand-text hover:underline">
                  {link.label}
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
                <p className="mt-0.5 text-muted-foreground">{link.note}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  ))
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 rounded-xl border bg-card p-4">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-0.5 size-4 shrink-0 rounded border-2 border-muted-foreground/40" aria-hidden="true" />
          <span className="text-pretty">{item}</span>
        </li>
      ))}
    </ul>
  )
}

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

function SetupDoc({ track }: { track: Track }) {
  const guide = setupGuides[track.slug]
  return (
    <>
      <DocTitle eyebrow="Getting started" title={`Setup — ${track.name}`} intro={guide.intro} />
      <Callout>
        Work through the tools in order. Each one tells you why you need it, how to install it on your OS, and a command to check it worked. Stuck for more than 30 minutes? Message your mentor with a screenshot of the error.
      </Callout>

      {track.slug !== "ui-ux" && <Guide sections={[terminalBasics]} />}

      <H2>1. Install your tools</H2>
      <div className="space-y-6">
        {guide.tools.map((id, index) => {
          const tool = tools[id]
          return (
            <section key={id} id={`tool-${id}`} className="scroll-mt-24 rounded-xl border bg-card p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background font-mono text-xs text-muted-foreground">
                  {tool.icon ? <TechIcon name={tool.icon} className="size-4.5" /> : index + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="flex flex-wrap items-center gap-2 font-sans text-base font-semibold">
                    {tool.name}
                    {tool.optional && (
                      <span className="rounded-full border px-2 py-0.5 text-[11px] font-normal text-muted-foreground">If needed</span>
                    )}
                  </h3>
                  <p className="mt-0.5 text-muted-foreground">{tool.what}</p>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="mb-1 text-xs font-medium text-muted-foreground">Why you need it</p>
                  <p className="text-pretty">{tool.why}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Install</p>
                  {"all" in tool.install ? <Steps steps={tool.install.all} /> : <OsTabs install={tool.install} />}
                </div>
                {tool.verify && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Check it worked</p>
                    <CodeBlock code={tool.verify.code} />
                    <p className="mt-1.5 text-xs text-muted-foreground">You should see: {tool.verify.expect}</p>
                  </div>
                )}
                {tool.tip && <Callout>{tool.tip}</Callout>}
              </div>
            </section>
          )
        })}
      </div>

      {guide.start.map((block, i) => (
        <section key={block.title}>
          <H2>
            {i + 2}. {block.title}
          </H2>
          <Steps steps={block.steps} />
        </section>
      ))}
    </>
  )
}

function PrdDoc({ track, project, name }: { track: Track; project: ProjectDocs; name: string }) {
  return (
    <>
      <DocTitle eyebrow={`${track.name} · PRD`} title={name} intro={project.pitch} />
      {mocks[project.slug] && (
        <figure style={trackColorStyle(track.slug)} className="track-color mb-2">
          <div className="rounded-2xl border bg-muted/30 p-4 sm:p-6">
            <Mockup mock={mocks[project.slug]} />
          </div>
          <figcaption className="mt-2 text-xs text-muted-foreground">
            Illustrative preview of the finished project. Your own design can look different.
          </figcaption>
        </figure>
      )}
      <H2>Who it&apos;s for</H2>
      <div className="grid gap-3 sm:grid-cols-2">
        {project.users.map((user) => (
          <div key={user.who} className="rounded-xl border bg-card p-4">
            <p className="font-medium">{user.who}</p>
            <p className="mt-1 text-muted-foreground">{user.need}</p>
          </div>
        ))}
      </div>
      <H2>Must have</H2>
      <Bullets items={project.mustHave} icon={CheckCircle2} />
      <H2>Stretch goals</H2>
      <p className="mb-3 text-muted-foreground">Optional extras once the must-haves are done and reviewed. They make your project stand out.</p>
      <Bullets items={[...project.niceToHave, ...trackStretchGoals[track.slug]]} icon={Sparkles} />
      <H2>Out of scope</H2>
      <Bullets items={project.outOfScope} icon={XCircle} />
      <H2>Done when</H2>
      <Bullets items={project.doneWhen} icon={Target} />
    </>
  )
}

function FlowsDoc({ track, project, name }: { track: Track; project: ProjectDocs; name: string }) {
  return (
    <>
      <DocTitle eyebrow={`${track.name} · User flows`} title={name} intro="The main paths a user takes through your product. Build and test each one end to end." />
      {project.flows.map((flow) => (
        <section key={flow.name}>
          <H2>{flow.name}</H2>
          <Mermaid chart={flowDiagram(flow.steps)} caption={`${flow.name} — step by step`} />
          <ol className="relative space-y-3 border-l pl-6">
            {flow.steps.map((step, i) => (
              <li key={step} className="relative">
                <span className="absolute top-0.5 -left-[2.0625rem] flex size-5 items-center justify-center rounded-full border bg-background font-mono text-[10px] text-muted-foreground">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </>
  )
}

function ArchitectureDoc({ track, project, name }: { track: Track; project: ProjectDocs; name: string }) {
  const arch = trackArchitecture[track.slug]
  return (
    <>
      <DocTitle eyebrow={`${track.name} · Architecture`} title={name} intro={arch.summary} />
      <H2>System design</H2>
      <Mermaid chart={systemDiagram(track.slug, project)} caption="How the pieces connect. The highlighted box is where most of your logic lives." />
      <H2>The pieces</H2>
      <div className="grid gap-3 sm:grid-cols-2">
        {arch.parts.map((part) => (
          <div key={part.name} className="rounded-xl border bg-card p-4">
            <p className="font-medium">{part.name}</p>
            <p className="mt-1 text-muted-foreground">{part.role}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Callout>{project.overview}</Callout>
      </div>

      <H2>{arch.dataTitle}</H2>
      {dataDiagram(track.slug, project) && (
        <Mermaid chart={dataDiagram(track.slug, project)!} caption="Entity-relationship diagram: tables, their fields and how they link." />
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {project.data.map((entity) => (
          <div key={entity.name} className="overflow-hidden rounded-xl border bg-card">
            <p className="border-b bg-muted/40 px-4 py-2 font-mono text-sm font-medium">{entity.name}</p>
            <ul className="divide-y">
              {entity.fields.map((field) => (
                <li key={field} className="px-4 py-1.5 font-mono text-xs">
                  {field}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <H2>{arch.interfaceTitle}</H2>
      <div className="overflow-hidden rounded-xl border bg-card">
        {project.interface.map((item) => (
          <div key={item.label} className="grid gap-1 border-b px-4 py-3 last:border-b-0 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-4">
            <code className="font-mono text-[13px] font-medium break-words">{item.label}</code>
            <p className="text-muted-foreground">{item.detail}</p>
          </div>
        ))}
      </div>
    </>
  )
}

function MilestonesDoc({ track, project, name }: { track: Track; project: ProjectDocs; name: string }) {
  return (
    <>
      <DocTitle eyebrow={`${track.name} · Milestones`} title={name} intro="Your week-by-week plan. Each week ends with the deliverable your mentor reviews." />
      {project.weeks.map((tasks, i) => {
        const week = track.weeks[i]
        return (
          <section key={i}>
            <H2>
              Week {i + 1} — {week.title}
            </H2>
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li key={task} className="flex gap-2.5">
                  <span className="mt-0.5 size-4 shrink-0 rounded border" aria-hidden="true" />
                  <span className="text-pretty">{task}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-start gap-2 rounded-lg border border-dashed px-3 py-2 text-sm">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-text" aria-hidden="true" />
              <span>
                <span className="text-muted-foreground">Deliverable: </span>
                {week.deliverable}
              </span>
            </p>
          </section>
        )
      })}
    </>
  )
}

const methodTone: Record<string, string> = {
  GET: "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  POST: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  PUT: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  PATCH: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  DELETE: "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400",
}

function ApiDoc({ track, slug, name }: { track: Track; slug: string; name: string }) {
  const contract = contracts[slug]
  if (!contract) return <LockedDoc reason="no-project" />
  return (
    <>
      <DocTitle
        eyebrow={`${track.name} · API contract`}
        title={name}
        intro="The exact agreement between the API and whoever calls it. Build the API to match this, and the frontend (or your tests) can be written at the same time."
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">Base URL</p>
          <p className="mt-1 font-mono text-xs break-all">{contract.baseUrl}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 sm:col-span-2">
          <p className="text-xs text-muted-foreground">Authentication</p>
          <p className="mt-1">{contract.auth}</p>
        </div>
      </div>
      <div className="mt-3 rounded-xl border bg-card p-4">
        <p className="text-xs text-muted-foreground">Every error looks like</p>
        <p className="mt-1 font-mono text-xs">{contract.errorShape}</p>
      </div>

      <H2>Endpoints</H2>
      <div className="space-y-4">
        {contract.endpoints.map((endpoint) => (
          <section key={endpoint.method + endpoint.path} className="overflow-hidden rounded-xl border bg-card">
            <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3">
              <span className={`rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold ${methodTone[endpoint.method]}`}>
                {endpoint.method}
              </span>
              <code className="font-mono text-[13px] font-medium break-all">{endpoint.path}</code>
              <span className="ml-auto rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">{endpoint.auth}</span>
            </div>
            <div className="space-y-3 px-4 py-3">
              <p>{endpoint.summary}</p>
              {endpoint.request && (
                <div>
                  <p className="text-xs text-muted-foreground">Request body</p>
                  <CodeBlock code={endpoint.request} />
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground">Response</p>
                <CodeBlock code={endpoint.response} />
              </div>
              {endpoint.errors && (
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Errors</p>
                  <ul className="space-y-1">
                    {endpoint.errors.map((error) => (
                      <li key={error} className="font-mono text-xs">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}

function SampleDataDoc({ track, slug, name }: { track: Track; slug: string; name: string }) {
  return (
    <>
      <DocTitle
        eyebrow={`${track.name} · Sample data`}
        title={name}
        intro="Get realistic data in from day one, so you're never building against an empty screen."
      />
      <Steps steps={sampleData[slug] ?? []} />
    </>
  )
}

/** Track-level handbook pages, open to every student. */
const handbookPages = {
  environment: { group: "Getting started", title: "Environment & secrets", intro: () => "Where passwords and API keys live, how to set them up locally, and the one rule you must never break.", sections: environmentGuide },
  standards: { group: "Building", title: "Coding standards", intro: (t: Track) => (t.slug === "ui-ux" ? "How to keep your Figma files organised so anyone can pick them up." : "How to structure, name, format and commit your code so reviews stay fast and focused."), sections: standardsGuide },
  testing: { group: "Building", title: "Testing", intro: (t: Track) => (t.slug === "ui-ux" ? "How to test your designs with real people." : "What must be tested, the tools to use, and the minimum bar for every pull request."), sections: testingGuide },
  deployment: { group: "Building", title: "Deployment", intro: (t: Track) => (t.slug === "ui-ux" ? "How to publish your prototype and case study." : "Step by step from your laptop to a live link, on free tiers."), sections: deploymentGuide },
  troubleshooting: { group: "Building", title: "Troubleshooting", intro: () => "Common errors and how to fix them. Check here before asking — most problems are on this page.", sections: troubleshootingGuide },
  resources: { group: "Building", title: "Resources", intro: () => "A short, curated list. Official docs first, and one good resource per topic.", sections: resourcesGuide },
  rubric: { group: "Reviews", title: "Review rubric", intro: () => "Exactly what your mentor checks in every review. Check it yourself first and there are no surprises.", sections: rubricGuide },
  submission: { group: "Reviews", title: "Submission checklist", intro: () => "What a complete final submission includes. Tick everything off before asking for your final review.", sections: submissionGuide },
} satisfies Record<string, { group: string; title: string; intro: (track: Track) => string; sections: (track: Track["slug"]) => GuideSection[] }>

export function LockedDoc({ reason }: { reason: "unpaid" | "no-project" }) {
  return (
    <div className="flex flex-col items-center rounded-xl border bg-card px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full border bg-muted/50">
        <Lock className="size-5 text-muted-foreground" aria-hidden="true" />
      </span>
      <h1 className="mt-5 font-sans text-xl font-semibold">
        {reason === "unpaid" ? "Unlocks when you join" : "Your project isn't assigned yet"}
      </h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        {reason === "unpaid"
          ? "Your PRD, user flows, architecture and milestones open once your payment is confirmed after your 1:1 session."
          : "Your mentor assigns your project after your 1:1. These docs appear here as soon as they do."}
      </p>
    </div>
  )
}

/** Renders one doc page for a track (and project, for project docs). */
export function DocBody({ doc, track, projectSlug }: { doc: DocId; track: Track; projectSlug: string | null }) {
  if (doc === "welcome") {
    return (
      <>
        <DocTitle eyebrow="Getting started" title="Welcome to Devio Tech" intro="Everything you need to go from setup to a shipped project." />
        <Guide sections={welcomeGuide} />
      </>
    )
  }
  if (doc === "workflow") {
    return (
      <>
        <DocTitle eyebrow="Getting started" title="How we work" intro="The Git and pull-request loop you'll repeat all program, plus the rules for using AI tools." />
        <Guide sections={workflowGuide} />
      </>
    )
  }
  if (doc === "setup") return <SetupDoc track={track} />

  const handbook = handbookPages[doc as keyof typeof handbookPages]
  if (handbook) {
    return (
      <>
        <DocTitle eyebrow={handbook.group} title={handbook.title} intro={handbook.intro(track)} />
        <Guide sections={handbook.sections(track.slug)} />
      </>
    )
  }

  const project = projectSlug ? getProjectDocs(track.slug, projectSlug) : undefined
  const name = track.projects.find((p) => p.slug === projectSlug)?.name
  if (!project || !name) return <LockedDoc reason="no-project" />

  if (doc === "prd") return <PrdDoc track={track} project={project} name={name} />
  if (doc === "flows") return <FlowsDoc track={track} project={project} name={name} />
  if (doc === "architecture") return <ArchitectureDoc track={track} project={project} name={name} />
  if (doc === "api") return <ApiDoc track={track} slug={project.slug} name={name} />
  if (doc === "data") return <SampleDataDoc track={track} slug={project.slug} name={name} />
  return <MilestonesDoc track={track} project={project} name={name} />
}
