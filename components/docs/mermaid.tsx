"use client"

import { useTheme } from "next-themes"
import { useEffect, useId, useState } from "react"

const palettes = {
  light: {
    background: "transparent",
    primaryColor: "#ffffff",
    primaryTextColor: "#18181b",
    primaryBorderColor: "#d4d4d8",
    secondaryColor: "#f4f4f5",
    tertiaryColor: "#fafafa",
    lineColor: "#a1a1aa",
    textColor: "#3f3f46",
    edgeLabelBackground: "#ffffff",
    attributeBackgroundColorOdd: "#ffffff",
    attributeBackgroundColorEven: "#fafafa",
  },
  dark: {
    background: "transparent",
    primaryColor: "#1f1f22",
    primaryTextColor: "#fafafa",
    primaryBorderColor: "#3f3f46",
    secondaryColor: "#27272a",
    tertiaryColor: "#18181b",
    lineColor: "#71717a",
    textColor: "#d4d4d8",
    edgeLabelBackground: "#18181b",
    attributeBackgroundColorOdd: "#1f1f22",
    attributeBackgroundColorEven: "#27272a",
  },
}

/**
 * Renders a Mermaid diagram on the client. Mermaid is loaded on demand so it
 * only ships on docs pages, and re-renders to match the light/dark theme.
 */
export function Mermaid({ chart, caption }: { chart: string; caption?: string }) {
  const { resolvedTheme } = useTheme()
  const id = useId().replace(/[^a-zA-Z0-9]/g, "")
  const [svg, setSvg] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    const dark = resolvedTheme !== "light"

    import("mermaid")
      .then(async ({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui",
          themeVariables: { ...palettes[dark ? "dark" : "light"], fontSize: "14px" },
          flowchart: { curve: "basis", padding: 12 },
        })
        const { svg } = await mermaid.render(`mermaid-${id}-${dark ? "d" : "l"}`, chart)
        if (!cancelled) setSvg(svg)
      })
      .catch((error) => {
        console.error("[docs] diagram failed to render", error)
        if (!cancelled) setFailed(true)
      })

    return () => {
      cancelled = true
    }
  }, [chart, resolvedTheme, id])

  return (
    <figure className="my-6 overflow-hidden rounded-xl border bg-card">
      <div className="flex min-h-40 items-center justify-center overflow-x-auto p-4 [&_svg]:h-auto [&_svg]:max-w-full">
        {svg ? (
          <div className="w-full [&>svg]:mx-auto" dangerouslySetInnerHTML={{ __html: svg }} />
        ) : failed ? (
          <pre className="w-full overflow-x-auto text-xs text-muted-foreground">{chart}</pre>
        ) : (
          <div className="h-32 w-full animate-pulse rounded-lg bg-muted/50" aria-label="Loading diagram" />
        )}
      </div>
      {caption && <figcaption className="border-t px-4 py-2 text-xs text-muted-foreground">{caption}</figcaption>}
    </figure>
  )
}
