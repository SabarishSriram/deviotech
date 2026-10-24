import {
  BadgeCheck,
  BookOpen,
  FileText,
  GitPullRequest,
  MessagesSquare,
  Network,
  type LucideIcon,
} from "lucide-react"

import { FadeIn } from "@/components/fade-in"
import { Section, SectionHeading } from "@/components/section"
import { features, type FeatureId } from "@/data/site"

const featureIcons: Record<FeatureId, LucideIcon> = {
  prd: FileText,
  architecture: Network,
  docs: BookOpen,
  reviews: GitPullRequest,
  community: MessagesSquare,
  certificate: BadgeCheck,
}

export function Features() {
  return (
    <Section id="features" aria-labelledby="features-title" className="border-t">
      <SectionHeading
        id="features-title"
        eyebrow={features.eyebrow}
        title={features.title}
        description={features.description}
      />

      <ul className="grid overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-3">
        {features.items.map((feature, index) => {
          const Icon = featureIcons[feature.id]
          return (
            <FadeIn
              as="li"
              key={feature.id}
              delay={(index % 3) * 0.06}
              className="group -mt-px -ml-px border-t border-l bg-card p-6 transition-colors hover:bg-muted/40 sm:p-8"
            >
              <Icon
                className="size-5 text-muted-foreground transition-colors group-hover:text-brand-text"
                aria-hidden="true"
              />
              <h3 className="mt-5 font-semibold tracking-tight">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </FadeIn>
          )
        })}
      </ul>
    </Section>
  )
}
