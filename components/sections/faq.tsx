import { ChevronDown } from "lucide-react"

import { Section, SectionHeading } from "@/components/section"
import { faq } from "@/data/site"

/** Common questions. Plain <details> so answers are in the HTML for search engines and work without JavaScript. */
export function Faq() {
  return (
    <Section id="faq" aria-labelledby="faq-title" className="border-t">
      <SectionHeading id="faq-title" eyebrow={faq.eyebrow} title={faq.title} />
      <div className="mx-auto max-w-3xl divide-y overflow-hidden rounded-2xl border bg-card">
        {faq.items.map((item) => (
          <details key={item.q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium transition-colors hover:bg-muted/40 sm:px-6 [&::-webkit-details-marker]:hidden">
              <h3 className="text-pretty">{item.q}</h3>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p className="px-5 pb-5 text-pretty text-muted-foreground sm:px-6">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}
