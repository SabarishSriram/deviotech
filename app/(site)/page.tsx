import type { Metadata } from "next"

import { SiteFooter } from "@/components/layout/site-footer"
import { BuildWithAi } from "@/components/sections/build-with-ai"
import { Faq } from "@/components/sections/faq"
import { Features } from "@/components/sections/features"
import { FinalCta } from "@/components/sections/final-cta"
import { Hero } from "@/components/sections/hero"
import { HowItWorks } from "@/components/sections/how-it-works"
import { Tracks } from "@/components/sections/tracks"
import { Marquee } from "@/components/widgets/marquee"
import { hero } from "@/data/site"
import { faqPage, JsonLd, organization, website } from "@/lib/structured-data"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee items={hero.marquee} className="border-y border-border py-4" />
      <HowItWorks />
      <BuildWithAi />
      <Tracks />
      <Features />
      <Faq />
      <FinalCta />
      <JsonLd data={[organization, website, faqPage]} />
      <SiteFooter />
    </>
  )
}
