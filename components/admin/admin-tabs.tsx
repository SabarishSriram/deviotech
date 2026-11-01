"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const tabs = [
  { href: "/admin", label: "Applications", match: (path: string) => path === "/admin" || path.startsWith("/admin/applications") },
  { href: "/admin/tracks", label: "Tracks", match: (path: string) => path.startsWith("/admin/tracks") },
]

export function AdminTabs() {
  const pathname = usePathname()
  return (
    <nav aria-label="Admin" className="flex items-center gap-1">
      {tabs.map((tab) => {
        const active = tab.match(pathname)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-1.5 font-medium transition-colors",
              active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
