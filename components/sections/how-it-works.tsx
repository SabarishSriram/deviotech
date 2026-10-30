"use client"

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion"
import { useRef } from "react"

import { Section, SectionHeading } from "@/components/section"
import { Widget } from "@/components/widgets/widget"
import { howItWorks } from "@/data/site"

export function HowItWorks() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"],
  })
  const spring = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  const progress = reduce ? 1 : spring

  return (
    <Section id="how-it-works" aria-labelledby="how-it-works-title" className="border-t">
      <SectionHeading
        id="how-it-works-title"
        eyebrow={howItWorks.eyebrow}
        title={howItWorks.title}
        description={howItWorks.description}
      />

      <div ref={ref} className="relative">
        {/* track + scroll-filled progress — vertical on mobile, horizontal on lg */}
        <div
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[27px] w-px bg-border lg:top-[31px] lg:right-[12.5%] lg:bottom-auto lg:left-[12.5%] lg:h-px lg:w-auto"
        />
        <motion.div
          aria-hidden="true"
          style={{ scaleY: progress }}
          className="absolute top-2 bottom-2 left-[27px] w-px origin-top bg-brand lg:hidden"
        />
        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="absolute top-[31px] right-[12.5%] left-[12.5%] hidden h-px origin-left bg-brand lg:block"
        />

        <ol className="relative grid gap-4 lg:grid-cols-4 lg:gap-5">
          {howItWorks.steps.map((step, index) => (
            <Widget
              as="li"
              key={step.title}
              delay={index * 0.08}
              className="flex items-start gap-5 p-6 lg:flex-col lg:items-center lg:text-center"
            >
              <span className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-2xl border bg-background font-mono text-sm font-medium text-brand-text shadow-sm">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="space-y-2 pt-1.5 lg:pt-3">
                <h3 className="font-semibold tracking-tight">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </Widget>
          ))}
        </ol>
      </div>
    </Section>
  )
}
