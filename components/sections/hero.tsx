import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { FadeIn } from "@/components/fade-in"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { hero } from "@/data/site"

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Grid pattern, faded out towards the edges */}
      <div
        aria-hidden="true"
        className="bg-grid absolute inset-0 -z-10 mask-[radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]"
      />
      {/* Soft indigo glow behind the headline */}
      <div
        aria-hidden="true"
        className="absolute top-24 left-1/2 -z-10 h-72 w-[min(42rem,90vw)] -translate-x-1/2 rounded-full bg-brand/25 blur-3xl dark:bg-brand/20"
      />

      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pt-20 pb-24 text-center sm:px-6 sm:pt-28 sm:pb-32">
        <FadeIn>
          <Badge
            variant="outline"
            className="h-7 gap-2 rounded-full border-brand/30 bg-background/60 px-3 font-mono text-xs backdrop-blur"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-brand" />
            </span>
            {hero.badge}
          </Badge>
        </FadeIn>

        <FadeIn delay={0.05}>
          <h1
            id="hero-title"
            className="mt-8 text-5xl font-semibold tracking-tighter text-balance sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {hero.headline.lead}{" "}
            <span className="bg-linear-to-br from-brand to-violet-500 bg-clip-text text-transparent">
              {hero.headline.accent}
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-muted-foreground sm:text-xl">{hero.subtext}</p>
        </FadeIn>

        <FadeIn delay={0.15} className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Button asChild size="lg" className="group h-12 rounded-full px-6 text-base">
            <Link href={hero.primaryCta.href}>
              {hero.primaryCta.label}
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-6 text-base">
            <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
          </Button>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-8 font-mono text-xs text-muted-foreground">{hero.trust.join(" · ")}</p>
        </FadeIn>
      </div>
    </section>
  )
}
