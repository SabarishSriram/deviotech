import { Search } from "lucide-react"

import type { Mock, MockBlock } from "@/data/docs/types"
import { cn } from "@/lib/utils"

/*
 * Illustrative wireframe of a project's main screen, built from a small spec.
 * Rendered inside a `.track-color` element so accents use the track's colour.
 */

function Block({ block, compact }: { block: MockBlock; compact: boolean }) {
  switch (block.kind) {
    case "kpis":
      return (
        <div className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4")}>
          {block.items.map((item) => (
            <div key={item.label} className="rounded-lg border bg-card px-3 py-2">
              <p className="text-[10px] text-muted-foreground">{item.label}</p>
              <p className="text-sm font-semibold tabular-nums">{item.value}</p>
            </div>
          ))}
        </div>
      )
    case "bars": {
      const max = Math.max(...block.values)
      return (
        <div className="rounded-lg border bg-card p-3">
          <p className="mb-2 text-[11px] font-medium">{block.title}</p>
          <div className="flex h-24 items-end gap-1.5">
            {block.values.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={cn("w-full rounded-t-sm", i === block.values.indexOf(max) ? "bg-(--tc)" : "bg-(--tc)/30")}
                  style={{ height: `${(v / max) * 80}px` }}
                />
                {block.labels && <span className="text-[9px] text-muted-foreground">{block.labels[i]}</span>}
              </div>
            ))}
          </div>
        </div>
      )
    }
    case "table":
      return (
        <div className="overflow-hidden rounded-lg border bg-card">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                {block.columns.map((c) => (
                  <th key={c} className="px-2.5 py-1.5 font-medium">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-t">
                  {row.map((cell, j) => (
                    <td key={j} className="px-2.5 py-1.5 whitespace-nowrap">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case "kanban":
      return (
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${block.columns.length}, minmax(0, 1fr))` }}>
          {block.columns.map((col) => (
            <div key={col.title} className="rounded-lg bg-muted/50 p-2">
              <p className="mb-1.5 flex items-center justify-between text-[10px] font-medium text-muted-foreground">
                {col.title}
                <span>{col.cards.length}</span>
              </p>
              <div className="space-y-1.5">
                {col.cards.map((card) => (
                  <div key={card} className="rounded-md border bg-card px-2 py-1.5 text-[11px] leading-tight">
                    {card}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    case "cards":
      return (
        <div className={cn("grid gap-2", compact ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3")}>
          {block.items.map((item) => (
            <div key={item.title} className="rounded-lg border bg-card p-2.5">
              {!compact && <div className="mb-2 h-12 rounded-md bg-(--tc)/15" />}
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] leading-tight font-medium">{item.title}</p>
                {item.badge && (
                  <span className="shrink-0 rounded-full bg-(--tc)/15 px-1.5 py-0.5 text-[9px] text-(--tc)">{item.badge}</span>
                )}
              </div>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{item.meta}</p>
            </div>
          ))}
        </div>
      )
    case "list":
      return (
        <div>
          {block.title && <p className="mb-1.5 text-[11px] font-medium">{block.title}</p>}
          <div className="divide-y overflow-hidden rounded-lg border bg-card">
            {block.items.map((item) => (
              <div key={item.title} className="flex items-center gap-2.5 px-2.5 py-2">
                {item.done !== undefined && (
                  <span
                    className={cn("size-3.5 shrink-0 rounded-full border-2", item.done ? "border-(--tc) bg-(--tc)" : "border-muted-foreground/40")}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-medium">{item.title}</p>
                  {item.meta && <p className="truncate text-[10px] text-muted-foreground">{item.meta}</p>}
                </div>
                {item.right && <span className="shrink-0 text-[11px] font-medium tabular-nums">{item.right}</span>}
              </div>
            ))}
          </div>
        </div>
      )
    case "form":
      return (
        <div className="rounded-lg border bg-card p-3">
          <p className="mb-2 text-[11px] font-medium">{block.title}</p>
          <div className="space-y-2">
            {block.fields.map((field) => (
              <div key={field}>
                <p className="mb-0.5 text-[10px] text-muted-foreground">{field}</p>
                <div className="h-6 rounded-md border bg-background" />
              </div>
            ))}
            <div className="flex h-7 items-center justify-center rounded-md bg-(--tc) text-[11px] font-medium text-white">{block.button}</div>
          </div>
        </div>
      )
    case "posters":
      return (
        <div>
          <p className="mb-1.5 text-[11px] font-medium">{block.title}</p>
          <div className={cn("grid gap-2", compact ? "grid-cols-3" : "grid-cols-3 sm:grid-cols-6")}>
            {block.items.map((item, i) => (
              <div key={item}>
                <div className={cn("aspect-[2/3] rounded-md", i % 3 === 0 ? "bg-(--tc)/40" : i % 3 === 1 ? "bg-(--tc)/20" : "bg-muted")} />
                <p className="mt-1 truncate text-[10px]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )
    case "search":
      return (
        <div className="space-y-2">
          <div className="flex h-8 items-center gap-2 rounded-lg border bg-card px-2.5 text-[11px] text-muted-foreground">
            <Search className="size-3.5" aria-hidden="true" />
            {block.placeholder}
          </div>
          {block.chips && (
            <div className="flex flex-wrap gap-1.5">
              {block.chips.map((chip, i) => (
                <span
                  key={chip}
                  className={cn("rounded-full border px-2 py-0.5 text-[10px]", i === 0 ? "border-(--tc)/50 bg-(--tc)/10 text-(--tc)" : "text-muted-foreground")}
                >
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>
      )
    case "stat":
      return (
        <div className="rounded-lg border bg-card p-3">
          <p className="text-[10px] text-muted-foreground">{block.label}</p>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">{block.value}</p>
          {block.caption && <p className="mt-0.5 text-[10px] text-(--tc)">{block.caption}</p>}
        </div>
      )
    case "chat":
      return (
        <div className="space-y-2">
          {block.messages.map((m) => (
            <div
              key={m.text}
              className={cn(
                "max-w-[85%] rounded-xl px-3 py-2 text-[11px] leading-snug",
                m.from === "user" ? "ml-auto bg-(--tc) text-white" : "border bg-card"
              )}
            >
              {m.text}
            </div>
          ))}
        </div>
      )
    case "terminal":
      return (
        <div className="space-y-0.5 font-mono text-[11px] leading-relaxed">
          {block.lines.map((line, i) => (
            <p
              key={i}
              className={cn(
                "whitespace-pre-wrap",
                line.tone === "cmd" && "text-zinc-100",
                line.tone === "ok" && "text-emerald-400",
                line.tone === "warn" && "text-amber-400",
                (!line.tone || line.tone === "muted") && "text-zinc-400"
              )}
            >
              {line.tone === "cmd" ? <span className="text-emerald-400">$ </span> : null}
              {line.text}
            </p>
          ))}
        </div>
      )
  }
}

export function Mockup({ mock }: { mock: Mock }) {
  if (mock.frame === "terminal") {
    return (
      <div aria-hidden="true" className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-lg">
        <div className="flex items-center gap-1.5 border-b border-zinc-800 px-3 py-2">
          <span className="size-2.5 rounded-full bg-zinc-700" />
          <span className="size-2.5 rounded-full bg-zinc-700" />
          <span className="size-2.5 rounded-full bg-zinc-700" />
          <span className="ml-2 font-mono text-[10px] text-zinc-500">{mock.title}</span>
        </div>
        <div className="space-y-3 p-4">
          {mock.blocks.map((block, i) => (
            <Block key={i} block={block} compact={false} />
          ))}
        </div>
      </div>
    )
  }

  if (mock.frame === "phone") {
    return (
      <div aria-hidden="true" className="mx-auto w-64 rounded-[2.25rem] border-[6px] border-zinc-800 bg-background shadow-xl dark:border-zinc-700">
        <div className="flex items-center justify-between px-5 pt-2.5 pb-1 text-[9px] font-medium">
          <span>9:41</span>
          <span className="h-4 w-16 rounded-full bg-zinc-800 dark:bg-zinc-700" />
          <span>100%</span>
        </div>
        <div className="space-y-2.5 px-3 pt-2 pb-3">
          <p className="text-base font-semibold">{mock.title}</p>
          {mock.blocks.map((block, i) => (
            <Block key={i} block={block} compact />
          ))}
        </div>
        {mock.nav && (
          <div className="flex justify-around border-t px-2 pt-2 pb-4 text-[9px]">
            {mock.nav.map((tab, i) => (
              <span key={tab} className={cn("flex flex-col items-center gap-0.5", i === 0 ? "text-(--tc)" : "text-muted-foreground")}>
                <span className={cn("size-3.5 rounded", i === 0 ? "bg-(--tc)" : "bg-muted-foreground/30")} />
                {tab}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div aria-hidden="true" className="overflow-hidden rounded-xl border bg-background shadow-lg">
      <div className="flex items-center gap-1.5 border-b bg-muted/40 px-3 py-2">
        <span className="size-2.5 rounded-full bg-muted-foreground/30" />
        <span className="size-2.5 rounded-full bg-muted-foreground/30" />
        <span className="size-2.5 rounded-full bg-muted-foreground/30" />
        <span className="ml-3 flex-1 truncate rounded-md border bg-background px-2 py-0.5 text-center font-mono text-[10px] text-muted-foreground">
          {mock.url ?? "localhost:3000"}
        </span>
      </div>
      <div className="flex">
        {mock.nav && (
          <div className="hidden w-32 shrink-0 space-y-1 border-r bg-muted/20 p-2.5 sm:block">
            <p className="mb-2 truncate text-[11px] font-semibold">{mock.title}</p>
            {mock.nav.map((item, i) => (
              <p
                key={item}
                className={cn("rounded-md px-2 py-1 text-[10px]", i === 0 ? "bg-(--tc)/15 font-medium text-(--tc)" : "text-muted-foreground")}
              >
                {item}
              </p>
            ))}
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-3 p-3 sm:p-4">
          {!mock.nav && <p className="text-sm font-semibold">{mock.title}</p>}
          {mock.blocks.map((block, i) => (
            <Block key={i} block={block} compact={false} />
          ))}
        </div>
      </div>
    </div>
  )
}
