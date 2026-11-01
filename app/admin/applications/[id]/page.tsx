import { ArrowLeft, ExternalLink } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { connection } from "next/server"
import { Suspense } from "react"

import { AdminShell } from "@/components/admin/admin-shell"
import { CreateLogin } from "@/components/admin/create-login"
import { ProjectSelect } from "@/components/admin/project-select"
import { StatusSelect } from "@/components/admin/status-select"
import { initials, statusTone } from "@/components/admin/status-tone"
import { getTrack } from "@/data/tracks"
import { requireAdmin } from "@/lib/admin-session"
import { createAdminClient } from "@/lib/supabase/admin"
import { hasPaid, statusLabels, type ApplicationRow } from "@/lib/supabase/types"
import { trackColorStyle, trackIcons } from "@/lib/track-icons"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Application",
  robots: { index: false, follow: false },
}

const dateFormat = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })

/** wa.me link; bare 10-digit Indian numbers get the 91 country code. */
function whatsappLink(phone: string) {
  const digits = phone.replace(/\D/g, "")
  return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}`
}

export default function ApplicationPage({ params }: PageProps<"/admin/applications/[id]">) {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-muted-foreground">Loading…</p>}>
      <ApplicationDetail params={params} />
    </Suspense>
  )
}

async function ApplicationDetail({ params }: Pick<PageProps<"/admin/applications/[id]">, "params">) {
  await connection()
  await requireAdmin()

  const { id } = await params
  const { data } = await createAdminClient().from("applications").select("*").eq("id", id).maybeSingle()
  if (!data) notFound()
  const a = data as ApplicationRow
  const track = getTrack(a.track)
  const TrackIcon = track ? trackIcons[track.slug] : null

  const fields: { label: string; value: React.ReactNode }[] = [
    { label: "Email", value: <a href={`mailto:${a.email}`} className="hover:underline">{a.email}</a> },
    {
      label: "Phone",
      value: (
        <a href={whatsappLink(a.phone)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
          {a.phone} <span className="text-muted-foreground">(WhatsApp)</span>
        </a>
      ),
    },
    { label: "College", value: a.college },
    { label: "Year", value: a.year === "graduate" ? "Graduate" : `Year ${a.year}` },
    { label: "Track", value: track?.name ?? a.track },
    { label: "Skill level", value: <span className="capitalize">{a.skill_level}</span> },
    {
      label: "GitHub",
      value: (
        <a href={`https://github.com/${a.github}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
          {a.github} <ExternalLink className="size-3" aria-hidden="true" />
        </a>
      ),
    },
    {
      label: "LinkedIn",
      value: a.linkedin ? (
        <a href={a.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 break-all hover:underline">
          {a.linkedin} <ExternalLink className="size-3 shrink-0" aria-hidden="true" />
        </a>
      ) : (
        "—"
      ),
    },
    { label: "Applied", value: dateFormat.format(new Date(a.created_at)) },
    { label: "Application ID", value: <span className="font-mono text-xs">{a.id}</span> },
  ]

  return (
    <AdminShell>
      <Link href="/admin" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" />
        All applications
      </Link>

      <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-5 shadow-xs">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-base font-semibold">
          {initials(a.full_name)}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold tracking-tight">{a.full_name}</h1>
          <p className="truncate text-muted-foreground">{a.email}</p>
        </div>
        {track && TrackIcon && (
          <span style={trackColorStyle(track.slug)} className="track-color flex items-center gap-2 rounded-full border border-(--tc)/30 bg-(--tc)/10 px-3 py-1.5">
            <TrackIcon className="size-4 text-(--tc)" aria-hidden="true" />
            {track.name}
          </span>
        )}
        <span className={cn("rounded-full border px-3 py-1.5 text-xs font-medium", statusTone[a.status])}>{statusLabels[a.status]}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-4">
          <dl className="grid overflow-hidden rounded-xl border bg-card shadow-xs sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.label} className="border-b px-4 py-3 sm:odd:border-r">
                <dt className="text-xs text-muted-foreground">{field.label}</dt>
                <dd className="mt-0.5">{field.value}</dd>
              </div>
            ))}
          </dl>

          <section className="rounded-xl border bg-card px-4 py-4 shadow-xs">
            <h2 className="text-xs text-muted-foreground">Why they want to join</h2>
            <p className="mt-1 whitespace-pre-line">{a.motivation}</p>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="space-y-2 rounded-xl border bg-card px-4 py-4 shadow-xs">
            <h2 className="text-xs text-muted-foreground">Status</h2>
            <StatusSelect id={a.id} status={a.status} className="w-full" />
          </section>
          {track && (
            <section className="space-y-2 rounded-xl border bg-card px-4 py-4 shadow-xs">
              <h2 className="text-xs text-muted-foreground">Project</h2>
              <ProjectSelect id={a.id} project={a.project} options={track.projects} />
              <p className="text-xs text-muted-foreground">
                {hasPaid(a.status) && a.project
                  ? "Project docs are unlocked in their portal."
                  : "Docs unlock when status is Paid and a project is chosen."}
              </p>
            </section>
          )}
          <section className="space-y-2 rounded-xl border bg-card px-4 py-4 shadow-xs">
            <h2 className="text-xs text-muted-foreground">Student portal login</h2>
            <p className="text-muted-foreground">{a.user_id ? "Login created." : "No login yet."}</p>
            <CreateLogin applicationId={a.id} hasLogin={Boolean(a.user_id)} />
          </section>
        </aside>
      </div>
    </AdminShell>
  )
}
