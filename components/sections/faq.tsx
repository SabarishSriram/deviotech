import { Section, SectionHeading } from "@/components/section"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Widget } from "@/components/widgets/widget"
import { faq } from "@/data/site"

export function Faq() {
  return (
    <Section id="faq" aria-labelledby="faq-title" className="border-t">
      <SectionHeading id="faq-title" eyebrow={faq.eyebrow} title={faq.title} />

      <div className="mx-auto max-w-2xl">
        <Widget interactive={false} className="px-2 sm:px-5">
          <Accordion type="single" collapsible>
            {faq.items.map((item, index) => (
              <AccordionItem key={item.question} value={`item-${index}`}>
                <AccordionTrigger className="py-5 text-base hover:no-underline">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Widget>
      </div>
    </Section>
  )
}
