import type { Metadata } from "next"
import { Suspense } from "react"

import { ApplyForm } from "@/components/apply/apply-form"
import { Widget } from "@/components/widgets/widget"
import { applyPage, hero } from "@/data/site"
import { isTrackSlug } from "@/data/tracks"

export const metadata: Metadata = {
  title: applyPage.title,
  description: applyPage.description,
  alternates: { canonical: "/apply" },
}

/** Reads ?track= so track pages can deep-link into the form preselected, e.g. /apply?track=frontend */
async function ApplyFormWithQuery({ searchParams }: Pick<PageProps<"/apply">, "searchParams">) {
  const { track } = await searchParams
  const initialTrack = typeof track === "string" && isTrackSlug(track) ? track : undefined
  return <ApplyForm key={initialTrack ?? "none"} initialTrack={initialTrack} />
}

const enrolled = hero.stats[0]

export default function ApplyPage({ searchParams }: PageProps<"/apply">) {
  return (
    <div className="relative isolate">
      <div
        aria-hidden="true"
        className="bg-dots absolute inset-x-0 top-0 -z-10 h-80 mask-[linear-gradient(to_bottom,#000,transparent)]"
      />

      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="space-y-4">
          <header className="pb-2">
            <p className="flex items-center gap-2 label-mono text-muted-foreground">
              <span className="signal-dot" aria-hidden="true" />
              {applyPage.eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight uppercase sm:text-4xl">{applyPage.title}</h1>
            <p className="mt-2 text-muted-foreground">{applyPage.description}</p>
          </header>

          <Widget interactive={false} className="p-5 sm:p-8">
            <Suspense fallback={<ApplyForm />}>
              <ApplyFormWithQuery searchParams={searchParams} />
            </Suspense>
          </Widget>
        </div>

        {/* ---- Side panel: what to expect ---- */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:pt-[7.5rem]">
          <Widget delay={0.08} interactive={false} className="p-6">
            <div aria-hidden="true" className="widget-dots pointer-events-none absolute inset-0 opacity-40 mask-[radial-gradient(circle_at_100%_0%,#000,transparent_60%)]" />
            <p className="relative label-mono text-brand-text">Free to apply</p>
            <p className="relative mt-2 font-heading text-4xl font-semibold tracking-tight">₹0</p>
            <p className="relative mt-1 text-sm text-muted-foreground">Nothing to pay until you&apos;ve met your mentor.</p>
          </Widget>

          <Widget delay={0.14} interactive={false} className="p-6">
            <h2 className="label-mono text-muted-foreground">{applyPage.next.title}</h2>
            <ol className="relative mt-5 space-y-5">
              <span aria-hidden="true" className="absolute top-2 bottom-2 left-[11px] w-px bg-border" />
              {applyPage.next.steps.map((step, index) => (
                <li key={step.title} className="relative flex gap-3.5">
                  <span
                    className={
                      index === 0
                        ? "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand font-mono text-[10px] font-medium text-white"
                        : "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border bg-card font-mono text-[10px] text-muted-foreground"
                    }
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Widget>

          <Widget delay={0.2} interactive={false} className="flex items-center gap-3 p-5">
            <span className="font-mono text-2xl font-semibold tracking-tight">
              {enrolled.value}
              {enrolled.suffix}
            </span>
            <span className="text-sm text-muted-foreground">{enrolled.label.toLowerCase()} so far</span>
          </Widget>
        </aside>
      </div>
    </div>
  )
}
