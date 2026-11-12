"use client"

import { RotateCcw } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { site } from "@/data/site"

/** Something broke while rendering a public page: say so plainly and offer a retry. */
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="label-mono text-brand-text">Something went wrong</p>
      <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight uppercase">That didn&apos;t load</h1>
      <p className="mt-4 text-pretty text-muted-foreground">
        It&apos;s on our side, not yours. Try again — and if it keeps happening, email{" "}
        <a href={`mailto:${site.contactEmail}`} className="text-brand-text underline-offset-4 hover:underline">
          {site.contactEmail}
        </a>
        {error.digest ? ` with the code ${error.digest}` : ""}.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset} className="rounded-full">
          <RotateCcw aria-hidden="true" /> Try again
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/">Go to the home page</Link>
        </Button>
      </div>
    </div>
  )
}
