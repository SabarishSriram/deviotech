import { ExternalLink, LogOut } from "lucide-react"
import Link from "next/link"

import { adminLogout } from "@/app/admin/actions"
import { AdminTabs } from "@/components/admin/admin-tabs"
import { LogoMark } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { site } from "@/data/site"

/** Top bar + container for signed-in admin pages. */
export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen font-sans text-sm [&_h1]:font-sans [&_h2]:font-sans">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2 font-semibold tracking-tight">
              <LogoMark />
              {site.name}
            </Link>
            <span className="rounded-full border bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              Admin
            </span>
            <span className="mx-1 hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
            <AdminTabs />
          </div>
          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" size="sm" className="hidden text-muted-foreground sm:inline-flex">
              <Link href="/" target="_blank">
                View site
                <ExternalLink aria-hidden="true" />
              </Link>
            </Button>
            <ThemeToggle />
            <form action={adminLogout}>
              <Button type="submit" variant="outline" size="sm">
                <LogOut aria-hidden="true" />
                Log out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">{children}</main>
    </div>
  )
}
