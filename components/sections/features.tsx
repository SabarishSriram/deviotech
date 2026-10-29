import {
  BadgeCheck,
  BookOpen,
  FileText,
  GitPullRequest,
  MessagesSquare,
  Network,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"

import { Section, SectionHeading } from "@/components/section"
import { Widget } from "@/components/widgets/widget"
import { features, type FeatureId } from "@/data/site"

const featureIcons: Record<FeatureId, LucideIcon> = {
  prd: FileText,
  architecture: Network,
  docs: BookOpen,
  reviews: GitPullRequest,
  community: MessagesSquare,
  certificate: BadgeCheck,
}

const span: Record<FeatureId, string> = {
  prd: "lg:col-span-4",
  reviews: "lg:col-span-2",
  architecture: "lg:col-span-2",
  docs: "lg:col-span-2",
  community: "lg:col-span-2",
  certificate: "lg:col-span-6",
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
          const isCertificate = feature.id === "certificate"

          return (
            <Widget as="li" key={feature.id} delay={(index % 3) * 0.06} className={`${span[feature.id]} group`}>
              {isCertificate ? (
                <div className="flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                  <div className="max-w-md">
                    <Icon
                      className="size-5 text-brand-text transition-transform duration-300 group-hover:scale-110"
                      aria-hidden="true"
                    />
                    <h3 className="mt-4 font-semibold tracking-tight">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  </div>

                  {/* mini certificate card */}
                  <div className="relative w-full shrink-0 overflow-hidden rounded-2xl border bg-background/60 p-5 sm:w-72">
                    <div aria-hidden="true" className="widget-dots absolute inset-0 opacity-50" />
                    <div className="relative flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-xl border bg-muted/50 text-brand-text">
                        <ShieldCheck className="size-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="font-mono text-sm font-medium">DEVIO-2026-0001</p>
                        <p className="label-mono text-brand-text">Verified ✓</p>
                      </div>
                    </div>
                    <Link
                      href="/verify"
                      className="relative mt-4 inline-block label-mono text-muted-foreground hover:text-foreground"
                    >
                      Verify a certificate →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-6 sm:p-8">
                  <Icon
                    className="size-5 text-muted-foreground transition-all duration-300 group-hover:scale-110 group-hover:text-brand-text"
                    aria-hidden="true"
                  />
                  <h3 className="mt-5 font-semibold tracking-tight">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              )}
            </Widget>
          )
        })}
      </ul>
    </Section>
  )
}
