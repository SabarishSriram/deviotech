import type { MetadataRoute } from "next"

import { legalPages, site } from "@/data/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/apply", "/verify", ...Object.keys(legalPages).map((slug) => `/legal/${slug}`)]
  return routes.map((route) => ({ url: `${site.url}${route}` }))
}
