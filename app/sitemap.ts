import type { MetadataRoute } from "next"

import { legalPages, site } from "@/data/site"
import { tracks } from "@/data/tracks"

/** Bump when the public pages' content changes, so search engines recrawl them. */
const updated = new Date("2026-11-11")

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, lastModified: updated, changeFrequency: "weekly", priority: 1 },
    ...tracks.map((track) => ({ url: `${site.url}/tracks/${track.slug}`, lastModified: updated, changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: `${site.url}/apply`, lastModified: updated, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/verify`, lastModified: updated, changeFrequency: "yearly", priority: 0.5 },
    ...Object.keys(legalPages).map((slug) => ({ url: `${site.url}/legal/${slug}`, lastModified: updated, changeFrequency: "yearly" as const, priority: 0.3 })),
  ]
}
