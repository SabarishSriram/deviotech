"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

import { FadeIn } from "@/components/fade-in"
import { Section, SectionHeading } from "@/components/section"
import { TrackPreview } from "@/components/sections/track-previews"
import { SkillIcons } from "@/components/widgets/skill-icons"
import { Tilt } from "@/components/widgets/tilt"
import { tracksSection } from "@/data/site"
import { tracks, type TrackCategory } from "@/data/tracks"
import { trackColorStyle, trackIcons } from "@/lib/track-icons"
import { cn } from "@/lib/utils"

type Filter = (typeof tracksSection.filters)[number]

export function Tracks() {
  const [filter, setFilter] = useState<Filter>("All")

  const filtered = useMemo(
    () => (filter === "All" ? tracks : tracks.filter((track) => track.category === (filter as TrackCategory))),
    [filter]
  )

  return (
    <Section id="tracks" aria-labelledby="tracks-title" className="border-t">
      <SectionHeading
        id="tracks-title"
        eyebrow={tracksSection.eyebrow}
        title={tracksSection.title}
        description={tracksSection.description}
      />

      <div role="group" aria-label="Filter tracks by category" className="mb-10 flex flex-wrap justify-center gap-2">
        {tracksSection.filters.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            aria-pressed={filter === category}
            className={cn(
              "rounded-full border px-4 py-1.5 label-mono transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              filter === category
                ? "border-brand/50 bg-brand/10 text-brand-text"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {filtered.map((track, index) => {
          const Icon = trackIcons[track.slug]

          return (
            <FadeIn as="li" key={track.slug} delay={index * 0.06}>
              <Tilt className="h-full">
                <Link
                  href={`/tracks/${track.slug}`}
                  style={trackColorStyle(track.slug)}
                  className="widget track-color group flex h-full flex-col p-6 transition-[border-color,box-shadow] duration-300 hover:border-(--tc)/50 hover:shadow-[0_24px_48px_-28px_var(--tc)] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:p-7"
                >
                  {/* oversized brand watermark */}
                  <Icon
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-8 -bottom-8 size-44 text-(--tc) opacity-[0.07] transition-all duration-700 ease-out group-hover:-rotate-12 group-hover:scale-110 group-hover:opacity-[0.16]"
                  />
                  <div
                    aria-hidden="true"
                    className="widget-dots pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-60 mask-[radial-gradient(circle_at_20%_0%,#000,transparent_60%)]"
                  />

                  <div className="relative flex items-start justify-between">
                    <div className="flex size-14 items-center justify-center rounded-2xl border border-(--tc)/25 bg-(--tc)/10 text-(--tc) transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:-rotate-6 group-hover:border-(--tc)/60 group-hover:bg-(--tc)/20 group-hover:shadow-[0_10px_28px_-8px_var(--tc)]">
                      <Icon className="size-7" aria-hidden="true" />
                    </div>
                    <span className="label-mono text-muted-foreground">{track.category}</span>
                  </div>

                  <h3 className="relative mt-6 text-lg font-semibold tracking-tight uppercase">{track.name}</h3>
                  <p className="relative mt-2 text-sm text-muted-foreground">{track.oneLiner}</p>

                  <div className="relative mt-5">
                    <TrackPreview slug={track.slug} />
                  </div>

                  <SkillIcons skills={track.skills} label={`${track.name} skills`} className="relative mt-4 mb-6" />

                  <div className="relative mt-auto flex items-center justify-end border-t pt-4">
                    <span className="flex items-center gap-1 label-mono text-brand-text">
                      View curriculum
                      <ArrowRight
                        className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              </Tilt>
            </FadeIn>
          )
        })}
      </ul>
    </Section>
  )
}
