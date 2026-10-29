import { FadeIn } from "@/components/fade-in"
import { Section, SectionHeading } from "@/components/section"
import { Tilt } from "@/components/widgets/tilt"
import { Badge } from "@/components/ui/badge"
import { tracks } from "@/data/site"
import { TechIcon } from "@/lib/tech-icons"
import { trackIcons } from "@/lib/track-icons"

export function Tracks() {
  return (
    <Section id="tracks" aria-labelledby="tracks-title" className="border-t">
      <SectionHeading id="tracks-title" eyebrow={tracks.eyebrow} title={tracks.title} description={tracks.description} />

      <ul className="grid gap-4 md:grid-cols-3 md:gap-5">
        {tracks.items.map((track, index) => {
          const Icon = trackIcons[track.id]
          return (
            <FadeIn as="li" key={track.id} delay={index * 0.08}>
              <Tilt className="h-full">
                <article className="widget group flex h-full flex-col p-6 transition-colors hover:border-brand/50 sm:p-8">
                  <div
                    aria-hidden="true"
                    className="widget-dots pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-60 mask-[radial-gradient(circle_at_70%_0%,#000,transparent_65%)]"
                  />
                  <div className="relative flex size-12 items-center justify-center rounded-2xl border bg-muted/50 text-brand-text transition-colors group-hover:border-brand/50 group-hover:bg-brand/10">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="relative mt-6 text-xl font-semibold tracking-tight uppercase">{track.name}</h3>
                  <p className="relative mt-2 text-sm text-muted-foreground">{track.description}</p>

                  <ul className="relative mt-6 flex flex-wrap gap-2" aria-label={`${track.name} tech stack`}>
                    {track.stack.map((tech) => (
                      <li key={tech}>
                        <Badge
                          variant="secondary"
                          className="gap-1.5 rounded-full font-mono text-[11px] font-normal"
                        >
                          <TechIcon name={tech} className="size-3.5" />
                          {tech}
                        </Badge>
                      </li>
                    ))}
                  </ul>

                  <div className="relative mt-auto pt-6">
                    <div className="border-t pt-5">
                      <p className="label-mono text-muted-foreground">What you&apos;ll build</p>
                      <p className="mt-2 text-sm">{track.build}</p>
                    </div>
                  </div>
                </article>
              </Tilt>
            </FadeIn>
          )
        })}
      </ul>

      <FadeIn delay={0.1} className="mt-6 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-border bg-background/60 px-4 py-2 label-mono text-muted-foreground">
          <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
          {tracks.note}
        </span>
      </FadeIn>
    </Section>
  )
}
