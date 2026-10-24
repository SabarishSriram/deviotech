import { Faq } from "@/components/sections/faq"
import { Features } from "@/components/sections/features"
import { FinalCta } from "@/components/sections/final-cta"
import { Hero } from "@/components/sections/hero"
import { HowItWorks } from "@/components/sections/how-it-works"
import { Pricing } from "@/components/sections/pricing"
import { Tracks } from "@/components/sections/tracks"

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Tracks />
      <Features />
      <Pricing />
      <Faq />
      <FinalCta />
    </>
  )
}
