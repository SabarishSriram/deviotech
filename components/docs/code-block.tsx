"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"

/** A command or snippet with a copy button. */
export function CodeBlock({ code, file }: { code: string; file?: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <div className="group relative mt-2 overflow-hidden rounded-lg border bg-muted/50">
      {file && <p className="border-b bg-muted/60 px-3 py-1.5 font-mono text-[11px] text-muted-foreground">{file}</p>}
      <pre className="overflow-x-auto p-3 pr-12 font-mono text-[13px] leading-relaxed">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(code)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        }}
        aria-label={copied ? "Copied" : "Copy command"}
        className={"absolute right-2 flex " + (file ? "top-9" : "top-2") + " size-7 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:text-foreground"}
      >
        {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
      </button>
    </div>
  )
}
