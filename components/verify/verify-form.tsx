"use client"

import { BadgeCheck, CircleX, Search } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Certificate } from "@/data/certificates"
import { verifyPage } from "@/data/site"
import { getTrack } from "@/data/tracks"
import { findCertificate, normalizeCertificateId } from "@/lib/certificates"

type Result = { status: "idle" } | { status: "found"; certificate: Certificate } | { status: "not-found"; id: string }

function lookup(id: string): Result {
  if (!id.trim()) return { status: "idle" }
  const certificate = findCertificate(id)
  return certificate ? { status: "found", certificate } : { status: "not-found", id: normalizeCertificateId(id) }
}

const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" })

export function VerifyForm({ initialId = "" }: { initialId?: string }) {
  const [value, setValue] = useState(initialId)
  const [result, setResult] = useState<Result>(() => lookup(initialId))

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(lookup(value))
    // Keep the URL shareable, e.g. /verify?id=DEVIO-2026-0001
    const url = new URL(window.location.href)
    if (value.trim()) url.searchParams.set("id", normalizeCertificateId(value))
    else url.searchParams.delete("id")
    window.history.replaceState(null, "", url)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="rounded-2xl border bg-card p-5 sm:p-6" role="search">
        <Label htmlFor="certificate-id" className="mb-3">
          Certificate ID
        </Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="certificate-id"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={verifyPage.placeholder}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            className="h-11 font-mono uppercase placeholder:normal-case"
          />
          <Button type="submit" size="lg" className="h-11 rounded-full px-6" disabled={!value.trim()}>
            <Search aria-hidden="true" />
            {verifyPage.button}
          </Button>
        </div>
      </form>

      <div aria-live="polite">
        {result.status === "found" && <CertificateCard certificate={result.certificate} />}
        {result.status === "not-found" && (
          <div className="flex gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 sm:p-6">
            <CircleX className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
            <div>
              <p className="font-medium">{verifyPage.notFoundTitle}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                No certificate matches <span className="font-mono text-foreground">{result.id}</span>.{" "}
                {verifyPage.notFoundDescription}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CertificateCard({ certificate }: { certificate: Certificate }) {
  const trackName = getTrack(certificate.track)?.name ?? certificate.track
  const verified = certificate.status === "verified"

  const rows = [
    { label: "Student", value: certificate.studentName },
    { label: "Track", value: trackName },
    { label: "Project", value: certificate.project },
    { label: "Issue date", value: dateFormatter.format(new Date(certificate.issueDate)) },
  ]

  return (
    <article className="relative overflow-hidden rounded-2xl border border-brand/40 bg-card p-5 shadow-lg shadow-brand/5 sm:p-6">
      <div aria-hidden="true" className="absolute -top-16 -right-16 size-40 rounded-full bg-brand/15 blur-2xl" />
      <div className="relative flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-muted-foreground">Certificate ID</p>
          <p className="mt-1 font-mono text-lg font-medium">{certificate.id}</p>
        </div>
        <Badge
          className={
            verified
              ? "gap-1.5 rounded-full bg-emerald-500/10 px-3 text-emerald-700 dark:text-emerald-400"
              : "gap-1.5 rounded-full bg-destructive/10 px-3 text-destructive"
          }
        >
          {verified ? <BadgeCheck aria-hidden="true" /> : <CircleX aria-hidden="true" />}
          {verified ? "Verified" : "Revoked"}
        </Badge>
      </div>
      <dl className="relative mt-6 grid gap-4 border-t pt-6 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-xs text-muted-foreground">{row.label}</dt>
            <dd className="mt-1 font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  )
}
