import { Check, KeyRound, Video, Wallet, type LucideIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { FadeIn } from "@/components/fade-in"
import { Button } from "@/components/ui/button"
import { successPage } from "@/data/site"

export const metadata: Metadata = {
  title: "Application received",
  robots: { index: false },
}

const stepIcons: LucideIcon[] = [KeyRound, Video, Wallet]

export default function ApplySuccessPage() {
  return (
    <div className="relative isolate px-4 py-20 sm:px-6 sm:py-28">
      <div
        aria-hidden="true"
        className="absolute top-16 left-1/2 -z-10 h-56 w-[min(32rem,90vw)] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl"
      />
      <FadeIn className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-brand/40 bg-brand/10 text-brand-text">
          <Check className="size-8" strokeWidth={2.5} aria-hidden="true" />
        </div>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">{successPage.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{successPage.description}</p>
      </FadeIn>

      <FadeIn delay={0.1} className="mx-auto mt-12 max-w-lg rounded-2xl border bg-card p-6 sm:p-8">
        <h2 className="font-mono text-xs tracking-wide text-muted-foreground uppercase">{successPage.nextStepsTitle}</h2>
        <ol className="mt-6 space-y-6">
          {successPage.nextSteps.map((step, index) => {
            const Icon = stepIcons[index] ?? Check
            return (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/50">
                  <Icon className="size-4 text-brand-text" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </FadeIn>

      <div className="mt-10 text-center">
        <Button asChild variant="outline" size="lg" className="h-11 rounded-full px-6">
          <Link href={successPage.cta.href}>{successPage.cta.label}</Link>
        </Button>
      </div>
    </div>
  )
}
