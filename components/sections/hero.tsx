import { ArrowRight, ArrowUpRight, BadgeCheck, GitPullRequest } from "lucide-react"
import Link from "next/link"

import { Counter } from "@/components/widgets/counter"
import { QrMark } from "@/components/widgets/qr-mark"
import { Terminal } from "@/components/widgets/terminal"
import { Widget } from "@/components/widgets/widget"
import { Button } from "@/components/ui/button"
import { hero } from "@/data/site"

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Panning dot-matrix field + top glow */}
      <div
        aria-hidden="true"
        className="bg-matrix animate-grid-pan absolute inset-0 -z-10 mask-[radial-gradient(ellipse_80%_55%_at_50%_0%,#000_30%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute top-10 left-1/2 -z-10 h-72 w-[min(48rem,92vw)] -translate-x-1/2 rounded-full bg-brand/15 blur-[90px]"
      />

      <div className="mx-auto max-w-6xl px-4 pt-14 pb-20 sm:px-6 sm:pt-20 sm:pb-24">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
          {/* ---- Primary headline widget ---- */}
          <Widget delay={0} interactive={false} className="flex flex-col justify-between p-7 sm:p-10 lg:w-[57%]">
            <div className="widget-dots animate-grid-pan pointer-events-none absolute inset-0 opacity-50 mask-[radial-gradient(circle_at_80%_-10%,#000,transparent_60%)]" />
            <div className="relative">
              <h1
                id="hero-title"
                className="text-5xl font-semibold tracking-tight text-balance uppercase sm:text-6xl lg:text-7xl"
              >
                {hero.headline.lead}{" "}
                <span className="text-brand-text">
                  {hero.headline.accent}
                  <span className="text-brand">.</span>
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">{hero.subtext}</p>
            </div>

            <div className="relative mt-9">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="group h-12 rounded-full px-6 text-base">
                  <Link href={hero.primaryCta.href}>
                    {hero.primaryCta.label}
                    <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-6 text-base">
                  <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
                </Button>
              </div>
              <p className="mt-6 label-mono text-muted-foreground">{hero.trust.join("  ·  ")}</p>
            </div>
          </Widget>

          {/* ---- Right column of stacked widgets ---- */}
          <div className="flex flex-col gap-4 lg:w-[43%]">
            {/* PR review terminal */}
            <Widget delay={0.08} className="flex flex-1 flex-col p-6">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 label-mono text-muted-foreground">
                  <GitPullRequest className="size-3.5" aria-hidden="true" />
                  review.log
                </span>
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="size-2.5 rounded-full bg-brand" />
                </span>
              </div>
              <Terminal className="mt-4 flex-1" />
            </Widget>

            {/* Stat trio */}
            <Widget delay={0.16} className="grid grid-cols-4 divide-x divide-border p-0">
              {hero.stats.map((s) => (
                <div key={s.label} className="flex flex-col gap-1 px-2 py-5 text-center sm:px-4">
                  <Counter
                    value={s.value}
                    suffix={s.suffix}
                    className="font-mono text-xl font-semibold tracking-tight sm:text-2xl"
                  />
                  <span className="text-[11px] leading-tight text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </Widget>

            {/* Certificate chip */}
            <Widget delay={0.24} className="group flex items-center gap-4 p-4 pr-5">
              <span className="relative size-11 shrink-0 overflow-hidden text-foreground">
                <QrMark />
                {/* scan line sweeps the code on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-transparent via-brand/40 to-transparent opacity-0 transition-opacity group-hover:animate-scanline group-hover:opacity-100 motion-reduce:hidden"
                />
              </span>
              <div className="min-w-0">
                <p className="label-mono text-muted-foreground">Certificate</p>
                <p className="mt-0.5 truncate font-mono text-sm font-medium">DEVIO-2026-0001</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-brand-text">
                  <BadgeCheck className="size-3.5 shrink-0" aria-hidden="true" />
                  Verified · Full-Stack
                </p>
              </div>
              <Link
                href="/verify"
                className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 label-mono text-muted-foreground transition-colors hover:border-brand/50 hover:text-brand-text focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                Verify
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            </Widget>
          </div>
        </div>
      </div>
    </section>
  )
}
