import { FadeIn } from "@/components/fade-in"
import { Section, SectionHeading } from "@/components/section"
import { Badge } from "@/components/ui/badge"
import { tracks } from "@/data/site"
import { trackIcons } from "@/lib/track-icons"

export function Tracks() {
  return (
    <Section id="tracks" aria-labelledby="tracks-title" className="border-t">
      <SectionHeading id="tracks-title" eyebrow={tracks.eyebrow} title={tracks.title} description={tracks.description} />

      <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
        {tracks.items.map((track, index) => {
          const Icon = trackIcons[track.id]
          return (
            <FadeIn as="li" key={track.id} delay={index * 0.08}>
              <article className="group flex h-full flex-col rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/5 sm:p-8">
                <div className="flex size-11 items-center justify-center rounded-xl border bg-muted/50 text-brand-text transition-colors group-hover:border-brand/40 group-hover:bg-brand/10">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{track.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{track.description}</p>

                <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${track.name} tech stack`}>
                  {track.stack.map((tech) => (
                    <li key={tech}>
                      <Badge variant="secondary" className="rounded-md font-mono text-[11px] font-normal">
                        {tech}
                      </Badge>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <div className="border-t pt-5">
                    <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
                      What you&apos;ll build
                    </p>
                    <p className="mt-2 text-sm">{track.build}</p>
                  </div>
                </div>
              </article>
            </FadeIn>
          )
        })}
      </ul>
    </Section>
  )
}
