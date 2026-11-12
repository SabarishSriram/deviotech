import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { SiteHeader } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"
import { tracks } from "@/data/tracks"

export const metadata = { title: "Page not found" }

/** Any URL that doesn't exist: keep the site's header and offer a way back. */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-4 py-24 text-center sm:px-6">
        <p className="label-mono text-brand-text">404</p>
        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight uppercase sm:text-5xl">Page not found</h1>
        <p className="mt-4 text-pretty text-muted-foreground">That link doesn&apos;t go anywhere — it may be old or mistyped. Here&apos;s where you can go instead.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-full">
            <Link href="/">
              Go to the home page <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/apply">Apply free</Link>
          </Button>
        </div>
        <nav aria-label="Tracks" className="mt-12 w-full">
          <p className="label-mono text-muted-foreground">Or pick a track</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {tracks.map((track) => (
              <li key={track.slug}>
                <Link href={`/tracks/${track.slug}`} className="block rounded-full border px-3 py-1.5 text-sm transition-colors hover:border-brand/50 hover:text-brand-text">
                  {track.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </>
  )
}
