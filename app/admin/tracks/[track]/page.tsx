import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { connection } from "next/server"
import { Suspense } from "react"

import { AdminShell } from "@/components/admin/admin-shell"
import { DocBody } from "@/components/docs/doc-views"
import { DocsLayout, type DocNavItem } from "@/components/docs/docs-layout"
import { DOC_PAGES, isDocId, isTrackProject, pagesFor } from "@/data/docs"
import { getTrack } from "@/data/tracks"
import { requireAdmin } from "@/lib/admin-session"
import { trackColorStyle, trackIcons } from "@/lib/track-icons"

export const metadata: Metadata = {
  title: "Track docs",
  robots: { index: false, follow: false },
}

export default function AdminTrackPage({ params, searchParams }: PageProps<"/admin/tracks/[track]">) {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-muted-foreground">Loading…</p>}>
      <TrackDocs params={params} searchParams={searchParams} />
    </Suspense>
  )
}

async function TrackDocs({ params, searchParams }: Pick<PageProps<"/admin/tracks/[track]">, "params" | "searchParams">) {
  await connection()
  await requireAdmin()

  const track = getTrack((await params).track)
  if (!track) notFound()

  const query = await searchParams
  const project = typeof query.project === "string" && isTrackProject(track.slug, query.project) ? query.project : null
  const requested = isDocId(query.doc) ? query.doc : "setup"
  // Project docs need a project; fall back to setup when none is picked.
  const doc = !project && DOC_PAGES.find((p) => p.id === requested)?.locked ? "setup" : requested

  const base = `/admin/tracks/${track.slug}`
  const shared = DOC_PAGES.filter((p) => !p.locked)
  const nav: DocNavItem[] = [
    ...shared.map((p) => ({
      href: `${base}?doc=${p.id}`,
      title: p.title,
      group: p.group,
      active: !project && doc === p.id,
      locked: false,
    })),
    ...track.projects.flatMap((proj) =>
      pagesFor(proj.slug)
        .filter((p) => p.locked)
        .map((p) => ({
        href: `${base}?project=${proj.slug}&doc=${p.id}`,
        title: p.title,
        group: proj.name,
        active: project === proj.slug && doc === p.id,
        locked: false,
      }))
    ),
  ]
  const Icon = trackIcons[track.slug]

  return (
    <AdminShell>
      <DocsLayout
        nav={nav}
        header={
          <div className="mb-6 space-y-4">
            <Link href="/admin/tracks" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4" aria-hidden="true" />
              All tracks
            </Link>
            <div style={trackColorStyle(track.slug)} className="track-color flex items-center gap-2.5 rounded-xl border bg-card p-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-(--tc)/10 text-(--tc)">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="font-medium">{track.name}</span>
            </div>
          </div>
        }
      >
        <DocBody doc={doc} track={track} projectSlug={project} />
      </DocsLayout>
    </AdminShell>
  )
}
