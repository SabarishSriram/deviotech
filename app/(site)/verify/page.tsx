import type { Metadata } from "next"
import { Suspense } from "react"

import { SectionHeading } from "@/components/section"
import { VerifyForm } from "@/components/verify/verify-form"
import { verifyPage } from "@/data/site"

export const metadata: Metadata = {
  title: verifyPage.title,
  description: verifyPage.description,
  alternates: { canonical: "/verify" },
}

/** Reads ?id= so verification links like /verify?id=DEVIO-2026-0001 are shareable. */
async function VerifyFormWithQuery({ searchParams }: Pick<PageProps<"/verify">, "searchParams">) {
  const { id } = await searchParams
  const initialId = typeof id === "string" ? id : ""
  // key resets local state when navigating to a different ?id=
  return <VerifyForm key={initialId} initialId={initialId} />
}

export default function VerifyPage({ searchParams }: PageProps<"/verify">) {
  return (
    <div className="relative isolate px-4 py-16 sm:px-6 sm:py-24">
      <div
        aria-hidden="true"
        className="bg-grid absolute inset-x-0 top-0 -z-10 h-96 mask-[linear-gradient(to_bottom,#000,transparent)]"
      />
      <SectionHeading
        as="h1"
        eyebrow={verifyPage.eyebrow}
        title={verifyPage.title}
        description={verifyPage.description}
        className="mb-10 sm:mb-12"
      />
      <div className="mx-auto max-w-xl">
        <Suspense fallback={<VerifyForm />}>
          <VerifyFormWithQuery searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}
