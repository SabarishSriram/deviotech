import type { MetadataRoute } from "next"

import { legalPages, site } from "@/data/site"
import { tracks } from "@/data/tracks"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/apply",
    "/verify",
    ...tracks.map((track) => `/tracks/${track.slug}`),
    ...Object.keys(legalPages).map((slug) => `/legal/${slug}`),
  ]
  return routes.map((route) => ({ url: `${site.url}${route}` }))
}
