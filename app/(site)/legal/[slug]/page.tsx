import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { legalPages, type LegalSlug } from "@/data/site"

function getPage(slug: string) {
  return Object.hasOwn(legalPages, slug) ? legalPages[slug as LegalSlug] : null
}

export function generateStaticParams() {
  return Object.keys(legalPages).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const page = getPage(slug)
  return page ? { title: page.title, alternates: { canonical: `/legal/${slug}` } } : {}
}

export default async function LegalPage({ params }: PageProps<"/legal/[slug]">) {
  const page = getPage((await params).slug)
  if (!page) notFound()

  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="font-mono text-xs tracking-wide text-brand-text">{"// legal"}</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{page.title}</h1>
      <div className="mt-12 space-y-10">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-semibold tracking-tight">{section.heading}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>
    </article>
  )
}
