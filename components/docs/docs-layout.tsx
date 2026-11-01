import { Lock } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

export type DocNavItem = { href: string; title: string; group: string; active: boolean; locked: boolean }

/** Docs page with a sticky sidebar grouped by section. */
export function DocsLayout({
  nav,
  header,
  children,
}: {
  nav: DocNavItem[]
  header?: React.ReactNode
  children: React.ReactNode
}) {
  const groups = [...new Set(nav.map((item) => item.group))]

  return (
    <div className="grid gap-8 font-sans text-sm lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        {header}
        <nav aria-label="Docs" className="space-y-5">
          {groups.map((group) => (
            <div key={group}>
              <p className="mb-1.5 px-2 text-xs font-medium text-muted-foreground">{group}</p>
              <ul className="space-y-0.5">
                {nav
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={item.active ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between gap-2 rounded-md px-2 py-1.5 transition-colors",
                          item.active ? "bg-brand/10 font-medium text-brand-text" : "text-foreground/80 hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {item.title}
                        {item.locked && <Lock className="size-3 text-muted-foreground" aria-label="Locked" />}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <article className="min-w-0 max-w-3xl leading-relaxed [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans">{children}</article>
    </div>
  )
}
