import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { connection } from "next/server"
import { Suspense } from "react"

import { DocBody, LockedDoc } from "@/components/docs/doc-views"
import { DocsLayout } from "@/components/docs/docs-layout"
import { DOC_PAGES, isDocId, pagesFor } from "@/data/docs"
import { getTrack } from "@/data/tracks"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { createClient } from "@/lib/supabase/server"
import { hasPaid, type ApplicationRow } from "@/lib/supabase/types"
import { trackColorStyle, trackIcons } from "@/lib/track-icons"

export const metadata: Metadata = {
  title: "Docs",
  robots: { index: false, follow: false },
}

export default function PortalDocPage({ params }: PageProps<"/portal/docs/[doc]">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading docs…</p>}>
        <PortalDoc params={params} />
      </Suspense>
    </div>
  )
}

async function PortalDoc({ params }: Pick<PageProps<"/portal/docs/[doc]">, "params">) {
  // Always per-request: depends on the signed-in student.
  await connection()
  if (!isSupabaseConfigured()) redirect("/portal")

  const { doc } = await params
  if (!isDocId(doc)) notFound()

  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getClaims()
  if (!auth?.claims) redirect("/portal/login")

  // RLS: only the signed-in student's own application is readable.
  const { data } = await supabase
    .from("applications")
    .select("track, status, project")
    .eq("user_id", auth.claims.sub)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  const application = data as Pick<ApplicationRow, "track" | "status" | "project"> | null
  const track = application ? getTrack(application.track) : undefined
  if (!application || !track) redirect("/portal")

  const paid = hasPaid(application.status)
  const projectName = track.projects.find((p) => p.slug === application.project)?.name
  const unlocked = paid && Boolean(projectName)
  const page = DOC_PAGES.find((p) => p.id === doc)!
  const Icon = trackIcons[track.slug]

  const nav = pagesFor(unlocked ? application.project : null).map((p) => ({
    href: `/portal/docs/${p.id}`,
    title: p.title,
    group: p.group === "Your project" && projectName ? projectName : p.group,
    active: p.id === doc,
    locked: p.locked && !unlocked,
  }))

  return (
    <DocsLayout
      nav={nav}
      header={
        <div className="mb-6 space-y-4">
          <Link href="/portal" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Portal
          </Link>
          <div style={trackColorStyle(track.slug)} className="track-color flex items-center gap-2.5 rounded-xl border bg-card p-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-(--tc)/10 text-(--tc)">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium">{track.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{projectName ?? "Project not assigned yet"}</span>
            </span>
          </div>
        </div>
      }
    >
      {page.locked && !paid ? (
        <LockedDoc reason="unpaid" />
      ) : (
        <DocBody doc={doc} track={track} projectSlug={paid ? application.project : null} />
      )}
    </DocsLayout>
  )
}
