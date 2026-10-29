import { cn } from "@/lib/utils"

/**
 * Seamless infinite marquee. Children are duplicated so the -50% translate
 * loops without a seam. Pauses on hover.
 */
export function Marquee({
  items,
  className,
  separator = "✦",
}: {
  items: readonly string[]
  className?: string
  separator?: string
}) {
  const row = (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden="true">
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex items-center gap-10 label-mono text-muted-foreground">
          {item}
          <span className="text-brand-text">{separator}</span>
        </li>
      ))}
    </ul>
  )

  return (
    <div
      className={cn(
        "group relative flex overflow-hidden mask-[linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]",
        className
      )}
    >
      <div className="flex min-w-max animate-marquee group-hover:[animation-play-state:paused]">
        {row}
        {row}
      </div>
    </div>
  )
}
