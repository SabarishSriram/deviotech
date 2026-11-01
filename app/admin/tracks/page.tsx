import { ArrowRight, FileText } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { connection } from "next/server"
import { Suspense } from "react"

import { AdminShell } from "@/components/admin/admin-shell"
import { setupGuides } from "@/data/docs"
import { tracks } from "@/data/tracks"
import { requireAdmin } from "@/lib/admin-session"
import { trackColorStyle, trackIcons } from "@/lib/track-icons"

export const metadata: Metadata = {
  title: "Tracks",
  robots: { index: false, follow: false },
}

export default function AdminTracksPage() {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-muted-foreground">Loading…</p>}>
      <TracksOverview />
    </Suspense>
  )
}

async function TracksOverview() {
  await connection()
  await requireAdmin()

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tracks</h1>
        <p className="mt-1 text-muted-foreground">
          Setup guides and project docs exactly as students see them. Setup is open to every student; project docs unlock after payment and project assignment.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tracks.map((track) => {
          const Icon = trackIcons[track.slug]
          return (
            <div key={track.slug} style={trackColorStyle(track.slug)} className="track-color flex flex-col rounded-xl border bg-card shadow-xs">
              <Link href={`/admin/tracks/${track.slug}`} className="group flex items-center gap-3 border-b p-4">
                <span className="flex size-10 items-center justify-center rounded-lg bg-(--tc)/10 text-(--tc)">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold group-hover:underline">{track.name}</span>
                  <span className="block text-xs text-muted-foreground">{setupGuides[track.slug].tools.length} tools to install</span>
                </span>
                <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
              </Link>
              <ul className="flex-1 space-y-0.5 p-2">
                <li>
                  <Link href={`/admin/tracks/${track.slug}?doc=setup`} className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted">
                    <FileText className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    Setup guide
                  </Link>
                </li>
                {track.projects.map((project) => (
                  <li key={project.slug}>
                    <Link
                      href={`/admin/tracks/${track.slug}?project=${project.slug}&doc=prd`}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted"
                    >
                      <span className="size-1.5 rounded-full bg-(--tc)" aria-hidden="true" />
                      {project.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </AdminShell>
  )
}
