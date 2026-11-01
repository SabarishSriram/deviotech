import { CodeBlock } from "@/components/docs/code-block"
import type { Step } from "@/data/docs/types"

/** Numbered instructions, each optionally with a command to copy. */
export function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="space-y-4">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full border bg-card font-mono text-[11px] text-muted-foreground">
            {i + 1}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-pretty whitespace-pre-line">{step.text}</p>
            {step.code && <CodeBlock code={step.code} file={step.file} />}
          </div>
        </li>
      ))}
    </ol>
  )
}
