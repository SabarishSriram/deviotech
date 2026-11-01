import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Section } from "@/components/section"
import { Widget } from "@/components/widgets/widget"
import { Button } from "@/components/ui/button"
import { finalCta } from "@/data/site"
import { trackShortName, tracks } from "@/data/tracks"
import { trackColorStyle, trackIcons } from "@/lib/track-icons"

export function FinalCta() {
  return (
    <Section aria-labelledby="final-cta-title" className="border-t">
      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        {/* ---- Call to action ---- */}
        <Widget interactive={false} className="flex flex-col justify-between gap-10 p-7 sm:p-10">
          <div
            aria-hidden="true"
            className="bg-matrix animate-grid-pan pointer-events-none absolute inset-0 opacity-40 mask-[radial-gradient(circle_at_0%_100%,#000,transparent_60%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-80 rounded-full bg-brand/20 blur-[80px]"
          />

          <div className="relative">
            <p className="flex items-center gap-2.5 label-mono text-brand-text">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-brand opacity-70 [animation:pulse-ring_1.8s_ease-out_infinite] motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-brand" />
              </span>
              {finalCta.eyebrow}
            </p>
            <h2
              id="final-cta-title"
              className="mt-5 text-4xl font-semibold tracking-tight text-balance uppercase sm:text-5xl"
            >
              {finalCta.title}
              <span className="text-brand">.</span>
            </h2>
            <p className="mt-4 max-w-md text-pretty text-muted-foreground sm:text-lg">{finalCta.description}</p>
          </div>

          <Button asChild size="lg" className="group relative h-12 w-fit rounded-full px-6 text-base">
            <Link href={finalCta.cta.href}>
              {finalCta.cta.label}
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </Button>
        </Widget>

        {/* ---- Jump straight into a track ---- */}
        <Widget delay={0.08} interactive={false} className="p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <h3 className="label-mono text-muted-foreground">{finalCta.tracksLabel}</h3>
            <span className="font-mono text-xs text-muted-foreground">{tracks.length} tracks</span>
          </div>
          <ul className="mt-5 grid grid-cols-3 gap-2">
            {tracks.map((track) => {
              const Icon = trackIcons[track.slug]
              return (
                <li key={track.slug}>
                  <Link
                    href={`/tracks/${track.slug}`}
                    style={trackColorStyle(track.slug)}
                    className="track-color group flex flex-col items-center gap-2 rounded-2xl border bg-background/40 px-2 py-4 text-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:border-(--tc)/50 hover:bg-(--tc)/10 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <span className="flex size-9 items-center justify-center rounded-xl border border-(--tc)/25 bg-(--tc)/10 text-(--tc) transition-transform duration-300 group-hover:scale-110">
                      <Icon className="size-4.5" aria-hidden="true" />
                    </span>
                    <span className="text-[11px] leading-tight font-medium">{trackShortName(track)}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </Widget>
      </div>
    </Section>
  )
}
