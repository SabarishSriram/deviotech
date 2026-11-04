import { CodeBlock } from "@/components/docs/code-block"
import type { OS, Step } from "@/data/docs/types"
import { TechIcon } from "@/lib/tech-icons"

export const osLabel: Record<OS, { name: string; logo: string }> = {
  mac: { name: "macOS", logo: "macOS" },
  windows: { name: "Windows", logo: "Windows" },
  linux: { name: "Linux", logo: "Linux" },
}

/** The macOS / Windows / Linux mark in a small tile. */
export function OsBadge({ os }: { os: OS }) {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-md border bg-background">
      <TechIcon name={osLabel[os].logo} className="size-3.5" />
    </span>
  )
}

/** Numbered instructions. A product logo replaces the number when the step is about that product. */
export function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="space-y-6">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full border bg-card font-mono text-[11px] text-muted-foreground">
            {step.icon ? <TechIcon name={step.icon} className="size-3.5" /> : i + 1}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-pretty whitespace-pre-line">{step.text}</p>
            {step.code && <CodeBlock code={step.code} file={step.file} />}
            {step.variants && (
              <div className="mt-3 divide-y overflow-hidden rounded-xl border bg-card">
                {step.variants.map((variant) => (
                  <div key={variant.os} className="flex gap-3 px-4 py-3.5">
                    <OsBadge os={variant.os} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-muted-foreground">{osLabel[variant.os].name}</p>
                      <p className="mt-0.5 text-pretty">{variant.text}</p>
                      {variant.code && <CodeBlock code={variant.code} />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
