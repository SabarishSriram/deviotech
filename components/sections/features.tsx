import {
  BadgeCheck,
  BookOpen,
  FileText,
  FileUser,
  GitPullRequest,
  Network,
  type LucideIcon,
} from "lucide-react"

import { Section, SectionHeading } from "@/components/section"
import { Widget } from "@/components/widgets/widget"
import { features, type FeatureId } from "@/data/site"

const featureIcons: Record<FeatureId, LucideIcon> = {
  prd: FileText,
  architecture: Network,
  docs: BookOpen,
  reviews: GitPullRequest,
  certificate: BadgeCheck,
  resume: FileUser,
}

const span: Record<FeatureId, string> = {
  prd: "lg:col-span-4",
  reviews: "lg:col-span-2",
  architecture: "lg:col-span-3",
  docs: "lg:col-span-3",
  certificate: "lg:col-span-3",
  resume: "lg:col-span-3",
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

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {features.items.map((feature, index) => {
          const Icon = featureIcons[feature.id]
          return (
            <Widget as="li" key={feature.id} delay={(index % 3) * 0.06} className={`${span[feature.id]} group`}>
              <div className="p-6 sm:p-8">
                <Icon
                  className="size-5 text-muted-foreground transition-all duration-300 group-hover:scale-110 group-hover:text-brand-text"
                  aria-hidden="true"
                />
                <h3 className="mt-5 font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </Widget>
          )
        })}
      </ul>
    </Section>
  )
}
