import { Check, ShieldCheck } from "lucide-react"
import Link from "next/link"

import { FadeIn } from "@/components/fade-in"
import { Section, SectionHeading } from "@/components/section"
import { Widget } from "@/components/widgets/widget"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice, pricing, pricingSection } from "@/data/site"

export function Pricing() {
  return (
    <Section id="pricing" aria-labelledby="pricing-title" className="border-t">
      <SectionHeading
        id="pricing-title"
        eyebrow={pricingSection.eyebrow}
        title={pricingSection.title}
        description={pricingSection.description}
      />

      <div className="relative mx-auto max-w-md">
        <div aria-hidden="true" className="absolute -inset-6 -z-10 rounded-[3rem] bg-brand/15 blur-2xl" />

        <Widget className="border-brand/40 ring-1 ring-brand/10" interactive={false}>
          <div className="widget-dots pointer-events-none absolute inset-0 opacity-40 mask-[radial-gradient(circle_at_50%_-10%,#000,transparent_60%)]" />

          <div className="relative p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <Badge className="rounded-full bg-brand/10 px-3 label-mono text-brand-text">{pricing.badge}</Badge>
              <span className="label-mono text-muted-foreground">One-time</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-mono text-5xl font-semibold tracking-tight sm:text-6xl">
                {formatPrice(pricing.price)}
              </span>
              <span className="text-lg text-muted-foreground line-through">
                <span className="sr-only">Regular price </span>
                {formatPrice(pricing.originalPrice)}
              </span>
            </div>
            <p className="mt-2 font-mono text-sm text-muted-foreground">{pricing.terms}</p>

            <ul className="mt-8 space-y-3 border-t border-dashed pt-8">
              {pricing.included.map((item, i) => (
                <FadeIn as="li" key={item} delay={i * 0.05} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand-text">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  {item}
                </FadeIn>
              ))}
            </ul>

            <Button asChild size="lg" className="group relative mt-8 h-12 w-full overflow-hidden rounded-full text-base">
              <Link href={pricingSection.cta.href}>
                {/* sheen sweep on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1/3 -translate-x-[120%] bg-white/25 blur-md group-hover:[animation:sheen_0.9s_ease] motion-reduce:hidden"
                />
                {pricingSection.cta.label}
              </Link>
            </Button>
          </div>
        </Widget>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
          {pricing.refundNote}
        </p>
      </div>
    </Section>
  )
}
