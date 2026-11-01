import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Widget } from "@/components/widgets/widget"
import { formatPrice, pricing, program, site } from "@/data/site"
import { everyTrackIncludes, getTrack, trackShortName, tracks } from "@/data/tracks"
import { aiTools } from "@/lib/ai-tools"
import { TechIcon } from "@/lib/tech-icons"
import { trackColorStyle, trackIcons } from "@/lib/track-icons"
import { cn } from "@/lib/utils"

export function generateStaticParams() {
  return tracks.map((track) => ({ slug: track.slug }))
}

export async function generateMetadata({ params }: PageProps<"/tracks/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const track = getTrack(slug)
  if (!track) return {}

  return {
    title: `${track.name} Internship — ${site.name}`,
    description: track.oneLiner,
    alternates: { canonical: `/tracks/${track.slug}` },
  }
}

/** Compact section label used between the bento rows on this page. */
function BlockHeading({ id, eyebrow, title, aside }: { id: string; eyebrow: string; title: string; aside?: string }) {
  return (
    <div className="flex items-end justify-between gap-6 pt-10 pb-1">
      <div>
        <p className="flex items-center gap-2 label-mono text-muted-foreground">
          <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 id={id} className="mt-2 text-xl font-semibold tracking-tight uppercase sm:text-2xl">
          {title}
        </h2>
      </div>
      {aside && <p className="hidden max-w-xs text-right text-sm text-muted-foreground md:block">{aside}</p>}
    </div>
  )
}

export default async function TrackPage({ params }: PageProps<"/tracks/[slug]">) {
  const { slug } = await params
  const track = getTrack(slug)
  if (!track) notFound()

  const Icon = trackIcons[track.slug]
  const applyHref = `/apply?track=${track.slug}`
  const otherTracks = tracks.filter((t) => t.slug !== track.slug)

  return (
    <div className="relative isolate">
      <div
        aria-hidden="true"
        className="bg-dots absolute inset-x-0 top-0 -z-10 h-80 mask-[linear-gradient(to_bottom,#000,transparent)]"
      />

      <div style={trackColorStyle(track.slug)} className="track-color mx-auto max-w-6xl space-y-4 px-4 py-8 sm:px-6 sm:py-10">
        <Link
          href="/#tracks"
          className="inline-flex items-center gap-1.5 label-mono text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          All tracks
        </Link>

        {/* ---- Overview + skills ---- */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Widget interactive={false} className="flex flex-col p-6 sm:p-8 lg:col-span-2">
            <Icon
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -bottom-12 size-72 text-(--tc) opacity-[0.08]"
            />
            <div className="relative flex items-center justify-between gap-4">
              <span className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-2xl border border-(--tc)/30 bg-(--tc)/10 text-(--tc) shadow-[0_10px_28px_-10px_var(--tc)]">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <span className="label-mono text-muted-foreground">{track.category}</span>
              </span>
              <span className="label-mono text-muted-foreground">{program.durationLabel} · Online</span>
            </div>

            <h1 className="relative mt-6 text-3xl font-semibold tracking-tight text-balance uppercase sm:text-5xl">
              {track.name}
            </h1>
            <p className="relative mt-3 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">{track.oneLiner}</p>

            <div className="relative mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 lg:mt-auto lg:pt-8">
              <Button asChild size="lg" className="group h-11 rounded-full px-6">
                <Link href={applyHref}>
                  Apply free
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                Pay {formatPrice(pricing.price)} only after your free 1:1 session.
              </p>
            </div>
          </Widget>

          <Widget interactive={false} className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="label-mono text-muted-foreground">Skills you&apos;ll use</h2>
              <span className="font-mono text-xs text-muted-foreground">{track.skills.length}</span>
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {track.skills.map((skill) => (
                <li
                  key={skill}
                  className="flex min-w-0 items-center gap-2 rounded-xl border bg-background/60 px-2.5 py-2 text-xs leading-tight"
                >
                  <span className="flex size-4 shrink-0 items-center justify-center">
                    <TechIcon name={skill} className="size-4" />
                  </span>
                  <span className="min-w-0">{skill}</span>
                </li>
              ))}
            </ul>
          </Widget>
        </div>

        {/* ---- Curriculum ---- */}
        <section aria-labelledby="weeks-title" className="space-y-4">
          <BlockHeading
            id="weeks-title"
            eyebrow="curriculum"
            title="Week by week"
            aside="Every week ends with something your mentor reviews."
          />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {track.weeks.map((week, index) => (
              <Widget as="li" key={week.title} delay={index * 0.06} interactive={false} className="flex flex-col p-5">
                <div className="flex items-center justify-between">
                  <span className="label-mono text-brand-text">Week {index + 1}</span>
                  <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}/04</span>
                </div>
                <h3 className="mt-2 font-semibold tracking-tight uppercase">{week.title}</h3>
                <ul className="mt-3 mb-5 space-y-1.5 text-sm text-muted-foreground">
                  {week.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/50" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto rounded-xl border border-dashed bg-background/40 px-3 py-2.5">
                  <p className="label-mono text-[10px] text-muted-foreground">Deliverable</p>
                  <p className="mt-1 flex items-start gap-1.5 text-sm font-medium">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-brand-text" aria-hidden="true" />
                    {week.deliverable}
                  </p>
                </div>
              </Widget>
            ))}
          </ol>
        </section>

        {/* ---- Projects ---- */}
        <section aria-labelledby="projects-title" className="space-y-4">
          <BlockHeading
            id="projects-title"
            eyebrow="your project"
            title="Pick 1 of 3 projects"
            aside="You'll get these three proposals. Choose the one you want to ship."
          />
          <ul className="grid gap-4 md:grid-cols-3">
            {track.projects.map((project, index) => (
              <Widget as="li" key={project.name} delay={index * 0.06} className="group p-5 transition-colors hover:border-(--tc)/50">
                <div className="flex items-center justify-between">
                  <span className="label-mono text-muted-foreground">Option {String(index + 1).padStart(2, "0")}</span>
                  <span
                    aria-hidden="true"
                    className="size-4 rounded-full border-2 transition-colors group-hover:border-(--tc) group-hover:bg-(--tc)/20"
                  />
                </div>
                <h3 className="mt-4 font-semibold tracking-tight">{project.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{project.description}</p>
              </Widget>
            ))}
          </ul>
        </section>

        {/* ---- AI + included ---- */}
        <div className="grid gap-4 pt-6 md:grid-cols-2">
          <Widget interactive={false} className="p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="label-mono text-muted-foreground">Build with AI</h2>
              <span className="flex items-center gap-1.5">
                {aiTools.map(({ name, icon: Tool, colorClass }) => (
                  <span key={name} title={name} className="flex size-7 items-center justify-center rounded-lg border bg-background/60">
                    <Tool className={cn("size-3.5", colorClass)} aria-hidden="true" />
                  </span>
                ))}
              </span>
            </div>
            <p className="mt-4 text-pretty">{track.buildWithAi}</p>
          </Widget>

          <Widget interactive={false} className="p-6">
            <h2 className="label-mono text-muted-foreground">Every track includes</h2>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {everyTrackIncludes.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand-text">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Widget>
        </div>

        {/* ---- CTA ---- */}
        <Widget interactive={false} className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div aria-hidden="true" className="bg-matrix pointer-events-none absolute inset-0 opacity-30 mask-[radial-gradient(circle_at_100%_50%,#000,transparent_60%)]" />
          <div className="relative">
            <h2 className="text-xl font-semibold tracking-tight uppercase sm:text-2xl">Ready to build in {trackShortName(track)}?</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{pricing.payAfter}</p>
          </div>
          <Button asChild size="lg" className="group relative h-11 shrink-0 rounded-full px-6">
            <Link href={applyHref}>
              Apply free
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </Button>
        </Widget>

        {/* ---- Other tracks ---- */}
        <nav aria-label="Other tracks" className="pt-6">
          <p className="label-mono text-muted-foreground">Other tracks</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {otherTracks.map((other) => {
              const OtherIcon = trackIcons[other.slug]
              return (
                <li key={other.slug}>
                  <Link
                    href={`/tracks/${other.slug}`}
                    style={trackColorStyle(other.slug)}
                    className="track-color flex items-center gap-2 rounded-full border bg-card px-3.5 py-2 text-sm transition-colors hover:border-(--tc)/60"
                  >
                    <OtherIcon className="size-3.5 text-(--tc)" aria-hidden="true" />
                    {trackShortName(other)}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}
