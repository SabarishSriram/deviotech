import { Check, ShieldCheck } from "lucide-react"
import Link from "next/link"

import { FadeIn } from "@/components/fade-in"
import { Section, SectionHeading } from "@/components/section"
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

      <FadeIn className="relative mx-auto max-w-md">
        <div aria-hidden="true" className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-brand/15 blur-2xl" />
        <div className="rounded-2xl border border-brand/40 bg-card p-6 shadow-xl shadow-brand/5 ring-1 ring-brand/10 sm:p-8">
          <Badge className="rounded-full bg-brand/10 px-3 font-mono text-xs text-brand-text">{pricing.badge}</Badge>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-5xl font-semibold tracking-tight sm:text-6xl">{formatPrice(pricing.price)}</span>
            <span className="text-lg text-muted-foreground line-through">
              <span className="sr-only">Regular price </span>
              {formatPrice(pricing.originalPrice)}
            </span>
          </div>
          <p className="mt-2 font-mono text-sm text-muted-foreground">{pricing.terms}</p>

          <ul className="mt-8 space-y-3 border-t pt-8">
            {pricing.included.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand-text">
                  <Check className="size-3.5" aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <Button asChild size="lg" className="mt-8 h-12 w-full rounded-full text-base">
            <Link href={pricingSection.cta.href}>{pricingSection.cta.label}</Link>
          </Button>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
          {pricing.refundNote}
        </p>
      </FadeIn>
    </Section>
  )
}
