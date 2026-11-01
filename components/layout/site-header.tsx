import { BadgeCheck, UserRound } from "lucide-react"
import Link from "next/link"

import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { nav } from "@/data/site"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" className="h-9 rounded-full px-3 label-mono text-muted-foreground">
            <Link href={nav.verify.href}>
              <BadgeCheck aria-hidden="true" />
              <span className="hidden sm:inline">{nav.verify.label}</span>
              <span className="sr-only sm:hidden">{nav.verify.label}</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="h-9 rounded-full px-3 label-mono text-muted-foreground">
            <Link href={nav.portal.href}>
              <UserRound aria-hidden="true" />
              <span className="hidden sm:inline">{nav.portal.label}</span>
              <span className="sr-only sm:hidden">{nav.portal.label}</span>
            </Link>
          </Button>
          <ThemeToggle />
          <Button asChild className="h-9 rounded-full px-4 label-mono">
            <Link href={nav.cta.href}>{nav.cta.label}</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
