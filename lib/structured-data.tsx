import { faq, footer, pricing, program, site } from "@/data/site"
import type { Track } from "@/data/tracks"

/*
 * schema.org data for search engines (JSON-LD). It describes the
 * organisation, the site, the FAQ and each track as a course, so Google
 * can show richer results. Nothing here is visible on the page.
 */

type Json = Record<string, unknown>

/** Renders one JSON-LD block. `<` is escaped so the JSON can't close the script tag. */
export function JsonLd({ data }: { data: Json | Json[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
}

const orgId = `${site.url}/#organization`

export const organization: Json = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": orgId,
  name: site.name,
  url: site.url,
  logo: `${site.url}/icon.svg`,
  email: site.contactEmail,
  description: site.description,
  sameAs: footer.socials.map((s) => s.href),
}

export const website: Json = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  name: site.name,
  url: site.url,
  publisher: { "@id": orgId },
  inLanguage: "en-IN",
}

export const faqPage: Json = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
}

export function trackCourse(track: Track): Json[] {
  const url = `${site.url}/tracks/${track.slug}`
  return [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "@id": `${url}#course`,
      name: `${track.name} Internship`,
      description: `${track.oneLiner} A ${program.durationWeeks}-week project-based virtual internship with mentor code reviews and a verifiable certificate.`,
      url,
      provider: { "@type": "Organization", "@id": orgId, name: site.name, sameAs: site.url },
      teaches: track.skills,
      inLanguage: "en",
      educationalCredentialAwarded: "Verifiable certificate of completion",
      offers: {
        "@type": "Offer",
        category: "Paid",
        price: pricing.price,
        priceCurrency: "INR",
        url: `${site.url}/apply`,
        availability: "https://schema.org/InStock",
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "Online",
        courseWorkload: `P${program.durationWeeks}W`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Tracks", item: `${site.url}/#tracks` },
        { "@type": "ListItem", position: 3, name: track.name, item: url },
      ],
    },
  ]
}
