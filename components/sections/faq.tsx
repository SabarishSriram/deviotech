import { FadeIn } from "@/components/fade-in"
import { Section, SectionHeading } from "@/components/section"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { faq } from "@/data/site"

export function Faq() {
  return (
    <Section id="faq" aria-labelledby="faq-title" className="border-t">
      <SectionHeading id="faq-title" eyebrow={faq.eyebrow} title={faq.title} />

      <FadeIn className="mx-auto max-w-2xl">
        <Accordion type="single" collapsible className="rounded-2xl border bg-card px-2 sm:px-4">
          {faq.items.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`}>
              <AccordionTrigger className="py-5 text-base hover:no-underline">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </FadeIn>
    </Section>
  )
}
