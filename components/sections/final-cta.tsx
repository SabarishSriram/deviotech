import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Section } from "@/components/section"
import { Widget } from "@/components/widgets/widget"
import { Button } from "@/components/ui/button"
import { finalCta } from "@/data/site"

export function FinalCta() {
  return (
    <Section aria-labelledby="final-cta-title" className="pb-20 sm:pb-28">
      <Widget interactive={false} className="px-6 py-16 text-center sm:py-24">
        <div
          aria-hidden="true"
          className="bg-matrix animate-grid-pan absolute inset-0 opacity-70 mask-[radial-gradient(ellipse_at_center,#000_15%,transparent_72%)]"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-28 left-1/2 h-56 w-[min(40rem,90%)] -translate-x-1/2 rounded-full bg-brand/25 blur-[90px]"
        />

        {/* orbiting ring + dot */}
        <div
          aria-hidden="true"
          className="animate-spin-slow absolute top-1/2 left-1/2 size-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border/70"
        >
          <span className="absolute -top-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-brand" />
        </div>

        <div className="relative">
          <h2 id="final-cta-title" className="text-3xl font-semibold tracking-tight text-balance uppercase sm:text-5xl">
            {finalCta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">{finalCta.description}</p>
          <Button asChild size="lg" className="group relative mt-8 h-12 overflow-hidden rounded-full px-6 text-base">
            <Link href={finalCta.cta.href}>
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1/3 -translate-x-[120%] bg-white/25 blur-md group-hover:[animation:sheen_0.9s_ease] motion-reduce:hidden"
              />
              {finalCta.cta.label}
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </Widget>
    </Section>
  )
}
