import { BadgeCheck, CalendarCheck, Download, Inbox, MessageCircle, Search, Sparkles, Wallet } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { connection } from "next/server"
import { Suspense } from "react"

import { AdminShell } from "@/components/admin/admin-shell"
import { StatusSelect } from "@/components/admin/status-select"
import { initials } from "@/components/admin/status-tone"
import { Button } from "@/components/ui/button"
import { getTrack, trackShortName, tracks } from "@/data/tracks"
import { requireAdmin } from "@/lib/admin-session"
import { createAdminClient } from "@/lib/supabase/admin"
import { isSupabaseAdminConfigured } from "@/lib/supabase/env"
import { APPLICATION_STATUSES, isApplicationStatus, statusLabels, type ApplicationRow } from "@/lib/supabase/types"
import { trackColorStyle, trackIcons } from "@/lib/track-icons"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
}

const dateFormat = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
})

export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-muted-foreground">Loading…</p>}>
      <Dashboard searchParams={searchParams} />
    </Suspense>
  )
}

async function Dashboard({ searchParams }: Pick<PageProps<"/admin">, "searchParams">) {
  // Always per-request: the session check compares against the current time.
  await connection()
  await requireAdmin()

  if (!isSupabaseAdminConfigured()) {
    return (
      <AdminShell>
        <p className="rounded-xl border bg-card p-6 text-muted-foreground">
          The database isn&apos;t connected. Set SUPABASE_SECRET_KEY and the Supabase URL (see .env.example).
        </p>
      </AdminShell>
    )
  }

  const params = await searchParams
  const q = typeof params.q === "string" ? params.q.trim().toLowerCase() : ""
  const status = isApplicationStatus(params.status) ? params.status : ""
  const track = typeof params.track === "string" && getTrack(params.track) ? params.track : ""

  const { data, error } = await createAdminClient()
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false })
  const all = (data ?? []) as ApplicationRow[]

  const rows = all.filter(
    (a) =>
      (!status || a.status === status) &&
      (!track || a.track === track) &&
      (!q || [a.full_name, a.email, a.phone, a.college, a.github].some((v) => v.toLowerCase().includes(q)))
  )

  const count = (s: ApplicationRow["status"]) => all.filter((a) => a.status === s).length
  const stats = [
    { label: "Total", value: all.length, icon: Inbox, href: "/admin", tone: "bg-muted text-foreground" },
    { label: "New", value: count("new"), icon: Sparkles, href: "/admin?status=new", tone: "bg-brand/10 text-brand-text" },
    { label: "Contacted", value: count("contacted"), icon: MessageCircle, href: "/admin?status=contacted", tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
    { label: "1:1 booked", value: count("session_booked"), icon: CalendarCheck, href: "/admin?status=session_booked", tone: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
    { label: "Paid", value: count("paid"), icon: Wallet, href: "/admin?status=paid", tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    { label: "Certified", value: count("completed"), icon: BadgeCheck, href: "/admin?status=completed", tone: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  ]

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
          <p className="mt-1 text-muted-foreground">Everyone who applied, newest first.</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href="/admin/export">
            <Download aria-hidden="true" />
            Export CSV
          </a>
        </Button>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-destructive">
          Couldn&apos;t load applications: {error.message}
        </p>
      )}

      {/* Stats — each one filters the table */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map(({ label, value, icon: Icon, href, tone }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-xl border bg-card p-4 shadow-xs transition-colors hover:border-foreground/20"
          >
            <span className={cn("flex size-8 items-center justify-center rounded-lg", tone)}>
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <form role="search" className="flex flex-wrap items-center gap-2 border-b p-3">
          <label className="relative min-w-52 flex-1">
            <span className="sr-only">Search</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search name, email, phone, college…"
              className="h-9 w-full rounded-lg border bg-background pr-3 pl-9 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>
          <select name="status" defaultValue={status} aria-label="Status" className="h-9 rounded-lg border bg-background px-2">
            <option value="">All statuses</option>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
          <select name="track" defaultValue={track} aria-label="Track" className="h-9 rounded-lg border bg-background px-2">
            <option value="">All tracks</option>
            {tracks.map((t) => (
              <option key={t.slug} value={t.slug}>
                {trackShortName(t)}
              </option>
            ))}
          </select>
          <Button type="submit" size="sm" className="h-9">
            Filter
          </Button>
          {(q || status || track) && (
            <Link href="/admin" className="px-2 text-muted-foreground hover:text-foreground">
              Clear
            </Link>
          )}
          <span className="ml-auto text-xs text-muted-foreground">
            {rows.length} of {all.length}
          </span>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[56rem] border-collapse text-left">
            <thead className="bg-muted/40 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-2.5 font-medium">Applicant</th>
                <th className="px-4 py-2.5 font-medium">Track</th>
                <th className="px-4 py-2.5 font-medium">Phone</th>
                <th className="px-4 py-2.5 font-medium">College</th>
                <th className="px-4 py-2.5 font-medium">Level</th>
                <th className="px-4 py-2.5 font-medium">Applied</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                    <Inbox className="mx-auto mb-2 size-6" aria-hidden="true" />
                    No applications found.
                  </td>
                </tr>
              )}
              {rows.map((a) => {
                const t = getTrack(a.track)
                const Icon = t ? trackIcons[t.slug] : null
                return (
                  <tr key={a.id} className="border-t transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link href={`/admin/applications/${a.id}`} className="group flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                          {initials(a.full_name)}
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-1.5 font-medium group-hover:underline">
                            {a.full_name}
                            {a.user_id && (
                              <span title="Portal login created" className="size-1.5 rounded-full bg-emerald-500" />
                            )}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">{a.email}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {t && Icon ? (
                        <span style={trackColorStyle(t.slug)} className="track-color flex items-center gap-2">
                          <span className="flex size-6 items-center justify-center rounded-md bg-(--tc)/10 text-(--tc)">
                            <Icon className="size-3.5" aria-hidden="true" />
                          </span>
                          <span>
                            {trackShortName(t)}
                            {a.project && (
                              <span className="block text-xs text-muted-foreground">
                                {t.projects.find((p) => p.slug === a.project)?.name}
                              </span>
                            )}
                          </span>
                        </span>
                      ) : (
                        a.track
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap tabular-nums">{a.phone}</td>
                    <td className="px-4 py-3">
                      {a.college}
                      <span className="block text-xs text-muted-foreground">
                        {a.year === "graduate" ? "Graduate" : `Year ${a.year}`}
                      </span>
                    </td>
                    <td className="px-4 py-3 capitalize">{a.skill_level}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground tabular-nums">
                      {dateFormat.format(new Date(a.created_at))}
                    </td>
                    <td className="px-4 py-3">
                      <StatusSelect id={a.id} status={a.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
