import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { FadeIn } from "@/components/fade-in"
import { Button } from "@/components/ui/button"
import { finalCta } from "@/data/site"

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="px-4 pb-20 sm:px-6 sm:pb-28">
      <FadeIn className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-2xl border bg-card px-6 py-16 text-center sm:py-20">
        <div aria-hidden="true" className="bg-dots absolute inset-0 -z-10 mask-[radial-gradient(ellipse_at_center,#000_20%,transparent_75%)]" />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 left-1/2 -z-10 h-48 w-[min(36rem,90%)] -translate-x-1/2 rounded-full bg-brand/25 blur-3xl"
        />
        <h2 id="final-cta-title" className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          {finalCta.title}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">{finalCta.description}</p>
        <Button asChild size="lg" className="group mt-8 h-12 rounded-full px-6 text-base">
          <Link href={finalCta.cta.href}>
            {finalCta.cta.label}
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </FadeIn>
    </section>
  )
}
