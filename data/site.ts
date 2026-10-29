/**
 * Single source of truth for all site copy, pricing and links.
 * Edit text here — components only read from this file.
 */

export const site = {
  name: "Devio Tech",
  url: "https://deviotech.in",
  tagline: "Real projects. Real reviews. A certificate that means something.",
  description:
    "A developer mentorship program where you build real-world projects under a senior mentor, get PR-based code reviews, and earn a verifiable certificate.",
  contactEmail: "hello@deviotech.in",
  copyright: "© 2026 Devio Tech",
} as const

export const pricing = {
  currency: "₹",
  price: 699,
  originalPrice: 1499,
  badge: "Launch price",
  terms: "One-time · 4–6 weeks",
  refundNote: "7-day refund guarantee if you haven't submitted any work.",
  included: [
    "A real-world PRD for your project",
    "Architecture guidelines & tech-stack docs",
    "PR-based code reviews from your mentor",
    "Community access on Discord",
    "Final project review",
    "Verified certificate with a unique ID",
  ],
} as const

/** Formats an amount like 1499 → "₹1,499". */
export function formatPrice(amount: number) {
  return `${pricing.currency}${amount.toLocaleString("en-IN")}`
}

export const nav = {
  links: [
    { label: "How it works", href: "/#how-it-works" },
    { label: "Tracks", href: "/#tracks" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
    { label: "Verify", href: "/verify" },
  ],
  cta: { label: "Apply now", href: "/apply" },
} as const

export const hero = {
  badge: "Batch 01 — Applications open",
  headline: { lead: "Don't just learn.", accent: "Build." },
  subtext:
    "Work on real-world projects with a senior developer mentor. Ship production-grade code, get reviewed like a real team, and earn a verified certificate.",
  primaryCta: { label: `Apply now — ${formatPrice(pricing.price)}`, href: "/apply" },
  secondaryCta: { label: "See how it works", href: "/#how-it-works" },
  trust: ["Real projects", "Code reviews", "Verified certificate"],
  stats: [
    { value: 8, suffix: "", label: "Specialised tracks" },
    { value: 5, suffix: "", label: "Projects per track" },
    { value: 40, suffix: "+", label: "Real projects to build" },
  ],
  seats: { filled: 68, label: "Batch 01 seats filled" },
  marquee: [
    "REAL PROJECTS",
    "PR CODE REVIEWS",
    "SENIOR MENTORS",
    "VERIFIED CERTIFICATE",
    "SHIP LIKE A TEAM",
    "FULL-STACK · BACKEND · FRONTEND",
  ],
} as const

export const howItWorks = {
  eyebrow: "how it works",
  title: "From application to certificate in four steps",
  description: "A structured path that mirrors how real engineering teams ship.",
  steps: [
    {
      title: "Apply & choose your track",
      description: "Pick Full-Stack, Backend or Frontend based on what you want to get better at.",
    },
    {
      title: "Get your PRD, architecture & docs",
      description: "Receive a real product spec, architecture guidelines and the tech-stack docs to build from.",
    },
    {
      title: "Build, commit & get PR reviews",
      description: "Push your work in small PRs. Your mentor reviews each one like a senior on a real team.",
    },
    {
      title: "Final review → earn your certificate",
      description: "Pass the final project review and receive a certificate anyone can verify online.",
    },
  ],
} as const

export const tracks = {
  eyebrow: "tracks",
  title: "Choose what you want to build",
  description: "8 specialised tracks, ~5 real projects each. Here are three to get a feel for it.",
  note: "+5 more tracks · ~5 projects per track",
  items: [
    {
      id: "full-stack",
      name: "Full-Stack",
      description: "Own a feature end to end — from the database schema to the UI your users click.",
      stack: ["Next.js", "Node.js", "PostgreSQL", "Docker"],
      build: "A full-stack web app with auth, a relational database and a containerised deploy.",
    },
    {
      id: "backend",
      name: "Backend",
      description: "Design APIs that are secure, well-structured and easy for other developers to use.",
      stack: ["Node.js", "Python", "PostgreSQL", "REST APIs"],
      build: "A production-style REST API with authentication, validation and a documented schema.",
    },
    {
      id: "frontend",
      name: "Frontend",
      description: "Build interfaces that are fast, accessible and organised to scale with a team.",
      stack: ["React", "Next.js", "TypeScript", "Tailwind"],
      build: "A responsive, component-driven web app built on a typed, reusable UI layer.",
    },
  ],
} as const

export type TrackId = (typeof tracks.items)[number]["id"]

export const features = {
  eyebrow: "what you get",
  title: "Everything a real project comes with",
  description: "No toy tutorials. You work from the same artefacts a professional team would.",
  items: [
    { id: "prd", title: "Real-world PRD", description: "A product requirements doc that defines scope, users and acceptance criteria." },
    { id: "architecture", title: "Architecture guidelines", description: "How the system fits together, so you make decisions with context." },
    { id: "docs", title: "Tech-stack documentation", description: "Curated docs and conventions for every tool in your track." },
    { id: "reviews", title: "PR-based code reviews", description: "Line-by-line feedback on every pull request you open." },
    { id: "community", title: "Community access", description: "A Discord server with your batch and mentors to unblock you fast." },
    { id: "certificate", title: "Verifiable certificate", description: "Each certificate carries a unique ID that anyone can check online." },
  ],
} as const

export type FeatureId = (typeof features.items)[number]["id"]

export const pricingSection = {
  eyebrow: "pricing",
  title: "One price. Everything included.",
  description: "No subscriptions, no upsells.",
  cta: { label: "Apply now", href: "/apply" },
} as const

export const faq = {
  eyebrow: "faq",
  title: "Questions, answered",
  items: [
    {
      question: "Is this a job or paid internship?",
      answer: "No. It's a mentorship program focused on real project experience. We don't promise placements.",
    },
    {
      question: "Who is this for?",
      answer: "College students and beginners who know the basics and want real project experience.",
    },
    {
      question: "How is the certificate earned?",
      answer: "Only after your final project passes review. Every certificate has a unique ID and can be verified online.",
    },
    { question: "How much time do I need?", answer: "About 6–8 hours per week." },
    { question: "What if I get stuck?", answer: "Ask in the community, and get feedback on every PR." },
    { question: "Refund policy?", answer: "Full refund within 7 days if no work has been submitted." },
  ],
} as const

export const finalCta = {
  title: "Ready to build something real?",
  description: "Batch 01 applications are open. It takes about five minutes to apply.",
  cta: { label: "Apply now", href: "/apply" },
} as const

export const footer = {
  links: [
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Terms", href: "/legal/terms" },
    { label: "Refund policy", href: "/legal/refund-policy" },
    { label: "Contact", href: `mailto:${site.contactEmail}` },
    { label: "Verify a certificate", href: "/verify" },
  ],
  socials: [
    { platform: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/deviotech" },
    { platform: "instagram", label: "Instagram", href: "https://www.instagram.com/deviotech" },
    { platform: "github", label: "GitHub", href: "https://github.com/deviotech" },
  ],
} as const

export type SocialPlatform = (typeof footer.socials)[number]["platform"]

/* ------------------------------------------------------------------ */
/* Apply flow                                                          */
/* ------------------------------------------------------------------ */

export const applyPage = {
  eyebrow: "apply",
  title: "Apply to Batch 01",
  description: "Tell us a little about yourself. It takes about five minutes.",
  submitLabel: `Continue to payment — ${formatPrice(pricing.price)}`,
  submittingLabel: "Submitting…",
  successToast: "Application received! Redirecting…",
  errorToast: "Something went wrong. Please try again.",
  yearOptions: [
    { value: "1", label: "1st year" },
    { value: "2", label: "2nd year" },
    { value: "3", label: "3rd year" },
    { value: "4", label: "4th year" },
    { value: "graduate", label: "Graduate" },
  ],
  skillOptions: [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ],
  // Rendered as: "I agree to the program terms and refund policy"
  terms: {
    prefix: "I agree to the",
    termsLink: { label: "program terms", href: "/legal/terms" },
    joiner: "and",
    refundLink: { label: "refund policy", href: "/legal/refund-policy" },
  },
} as const

export const successPage = {
  title: "You're in!",
  description: "Check your email for next steps.",
  nextStepsTitle: "What happens next",
  nextSteps: [
    { title: "Welcome email", description: "Your onboarding details, PRD and track docs land in your inbox." },
    { title: "Discord invite", description: "Join your batch and mentors in the community server." },
    { title: "Kickoff date", description: "We'll confirm your batch start date and kickoff call over email and WhatsApp." },
  ],
  cta: { label: "Back to home", href: "/" },
} as const

export const verifyPage = {
  eyebrow: "verify",
  title: "Verify a certificate",
  description: "Enter the certificate ID printed on a Devio Tech certificate to confirm it's genuine.",
  placeholder: "e.g. DEVIO-2026-0001",
  button: "Verify",
  notFoundTitle: "Certificate not found",
  notFoundDescription: "Double-check the ID for typos. IDs look like DEVIO-2026-0001.",
} as const

/* ------------------------------------------------------------------ */
/* Legal pages — plain-language summaries. Review before going live.   */
/* ------------------------------------------------------------------ */

export const legalPages = {
  privacy: {
    title: "Privacy policy",
    sections: [
      {
        heading: "What we collect",
        body: "When you apply, we collect your name, email, phone number, college, year of study, GitHub username, optional LinkedIn URL, chosen track, skill level and your answer to why you want to join.",
      },
      {
        heading: "How we use it",
        body: "We use this information to review your application, run the program, contact you about your batch and issue your certificate. We don't sell your data.",
      },
      {
        heading: "Payments",
        body: "Payments are processed by our payment partner. We never see or store your full card or UPI details.",
      },
      {
        heading: "Certificates",
        body: "If you earn a certificate, your name, track and issue date are shown publicly when someone verifies your certificate ID.",
      },
      {
        heading: "Your choices",
        body: `Email ${site.contactEmail} to access, correct or delete your data.`,
      },
    ],
  },
  terms: {
    title: "Program terms",
    sections: [
      {
        heading: "What the program is",
        body: "Devio Tech is a mentorship program focused on real project experience. It is not a job, internship or placement program, and we don't promise employment.",
      },
      {
        heading: "Your commitment",
        body: "Plan for about 6–8 hours per week over 4–6 weeks. The work you submit must be your own.",
      },
      {
        heading: "Certificates",
        body: "A certificate is issued only after your final project passes review. Certificates can be revoked if work is found to be plagiarised.",
      },
      {
        heading: "Community conduct",
        body: "Be respectful in the community and in code reviews. We may remove anyone who harasses other members.",
      },
    ],
  },
  "refund-policy": {
    title: "Refund policy",
    sections: [
      {
        heading: "7-day guarantee",
        body: "You can request a full refund within 7 days of payment, as long as you haven't submitted any work.",
      },
      {
        heading: "How to request a refund",
        body: `Email ${site.contactEmail} from the address you applied with. Refunds go back to your original payment method.`,
      },
      {
        heading: "After you submit work",
        body: "Once you've opened your first pull request for review, the program fee is no longer refundable.",
      },
    ],
  },
} as const

export type LegalSlug = keyof typeof legalPages
