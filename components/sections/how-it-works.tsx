import { FadeIn } from "@/components/fade-in"
import { Section, SectionHeading } from "@/components/section"
import { howItWorks } from "@/data/site"

export function HowItWorks() {
  return (
    <Section id="how-it-works" aria-labelledby="how-it-works-title" className="border-t">
      <SectionHeading
        id="how-it-works-title"
        eyebrow={howItWorks.eyebrow}
        title={howItWorks.title}
        description={howItWorks.description}
      />

      {/* Vertical timeline on mobile, horizontal from lg up */}
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[19px] w-px bg-linear-to-b from-brand/50 via-border to-border lg:top-5 lg:right-[12.5%] lg:bottom-auto lg:left-[12.5%] lg:h-px lg:w-auto lg:bg-linear-to-r"
        />
        <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-8">
          {howItWorks.steps.map((step, index) => (
            <FadeIn
              as="li"
              key={step.title}
              delay={index * 0.08}
              className="flex gap-5 lg:flex-col lg:items-center lg:text-center"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-background font-mono text-sm font-medium text-brand-text shadow-sm">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="space-y-2 pt-1.5 lg:pt-4">
                <h3 className="font-semibold tracking-tight">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </FadeIn>
          ))}
        </ol>
      </div>
    </Section>
  )
}
