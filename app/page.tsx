import { Faq } from "@/components/sections/faq"
import { Features } from "@/components/sections/features"
import { FinalCta } from "@/components/sections/final-cta"
import { Hero } from "@/components/sections/hero"
import { HowItWorks } from "@/components/sections/how-it-works"
import { Pricing } from "@/components/sections/pricing"
import { Tracks } from "@/components/sections/tracks"
import { Marquee } from "@/components/widgets/marquee"
import { hero } from "@/data/site"

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee items={hero.marquee} className="border-y border-border py-4" />
      <HowItWorks />
      <Tracks />
      <Features />
      <Pricing />
      <Faq />
      <FinalCta />
    </>
  )
}
