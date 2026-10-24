import type { Metadata } from "next"

import { ApplyForm } from "@/components/apply/apply-form"
import { SectionHeading } from "@/components/section"
import { applyPage, formatPrice, pricing } from "@/data/site"

export const metadata: Metadata = {
  title: applyPage.title,
  description: applyPage.description,
  alternates: { canonical: "/apply" },
}

export default function ApplyPage() {
  return (
    <div className="relative isolate px-4 py-16 sm:px-6 sm:py-24">
      <div
        aria-hidden="true"
        className="bg-dots absolute inset-x-0 top-0 -z-10 h-96 mask-[linear-gradient(to_bottom,#000,transparent)]"
      />
      <SectionHeading
        as="h1"
        eyebrow={applyPage.eyebrow}
        title={applyPage.title}
        description={applyPage.description}
        className="mb-10 sm:mb-12"
      />

      <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
        <ApplyForm />
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-muted-foreground">
        {formatPrice(pricing.price)} one-time · {pricing.refundNote}
      </p>
    </div>
  )
}
