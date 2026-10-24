import { FadeIn } from "@/components/fade-in"
import { cn } from "@/lib/utils"

export function Section({ className, children, ...props }: React.ComponentProps<"section">) {
  return (
    <section className={cn("py-20 sm:py-28", className)} {...props}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  )
}

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  align?: "left" | "center"
  /** Heading level — use "h1" when the heading is the page title. */
  as?: "h1" | "h2"
  id?: string
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  as: Heading = "h2",
  id,
  className,
}: SectionHeadingProps) {
  return (
    <FadeIn
      className={cn(
        "mb-12 max-w-2xl space-y-4 sm:mb-16",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && <p className="font-mono text-xs tracking-wide text-brand-text">{`// ${eyebrow}`}</p>}
      <Heading id={id} className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
        {title}
      </Heading>
      {description && <p className="text-base text-pretty text-muted-foreground sm:text-lg">{description}</p>}
    </FadeIn>
  )
}
