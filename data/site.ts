/**
 * Single source of truth for all site copy, pricing and links.
 * Edit text here — components only read from this file.
 */

export const site = {
  name: "Devio Tech",
  url: "https://deviotech.in",
  tagline: "Real projects. Real reviews. A certificate that means something.",
  description:
    "A project-based virtual internship where you build real-world projects, use AI tools the way real teams do, get mentor reviews, and earn a verifiable certificate.",
  contactEmail: "hello@deviotech.in",
  copyright: "© 2026 Devio Tech",
} as const

export const program = {
  name: "Devio Tech Project Internship Program",
  durationWeeks: 4,
  durationLabel: "4 weeks",
} as const

export const pricing = {
  currency: "₹",
  price: 499,
  payAfter: "Apply free. You only pay after your 1:1 session — if you want to continue.",
} as const

/** Formats an amount like 1499 → "₹1,499". */
export function formatPrice(amount: number) {
  return `${pricing.currency}${amount.toLocaleString("en-IN")}`
}

export const nav = {
  cta: { label: "Apply free", href: "/apply" },
} as const

export const hero = {
  headline: { lead: "Don't just learn.", accent: "Build." },
  subtext:
    "Work on real-world projects with a senior developer mentor. Ship production-grade code with AI tools the way real teams do, get reviewed, and earn a verified certificate.",
  primaryCta: { label: "Apply free", href: "/apply" },
  secondaryCta: { label: "See how it works", href: "/#how-it-works" },
  trust: ["Real projects", "Code reviews", "Resume review", "Verified certificate"],
  stats: [
    { value: 250, suffix: "+", label: "Students enrolled" },
    { value: 9, suffix: "", label: "Specialised tracks" },
    { value: 40, suffix: "+", label: "Projects to build" },
    { value: 4, suffix: "", label: "Weeks, fully online" },
  ],
  marquee: [
    "REAL PROJECTS",
    "PR CODE REVIEWS",
    "SENIOR MENTORS",
    "FREE 1:1 SESSION",
    "VERIFIED CERTIFICATE",
    "SHIP LIKE A TEAM",
    "9 TRACKS · BUILD WITH AI",
  ],
} as const

export const howItWorks = {
  eyebrow: "how it works",
  title: "Seven steps. Four weeks. One shipped project.",
  description: "No lectures or busywork. You work exactly the way an engineering team ships.",
  steps: [
    {
      id: "apply",
      when: "Free",
      title: "Apply",
      description: "Fill a short form and pick a track. Your login credentials arrive by email.",
    },
    {
      id: "call",
      when: "Free",
      title: "Meet your mentor",
      description: `A 1:1 session to walk you through the program. Like it? Pay ${formatPrice(pricing.price)} and your four weeks begin.`,
    },
    {
      id: "plan",
      when: "Week 1",
      title: "Plan",
      description: "Get your product spec, then map the architecture, pipeline or user flow. Your mentor signs off before you code.",
    },
    {
      id: "build",
      when: "Weeks 2–3",
      title: "Build",
      description: "Work in small pull requests with AI tools like Claude and Cursor. A senior mentor reviews every one.",
    },
    {
      id: "ship",
      when: "Week 4",
      title: "Ship",
      description: "Put it live — app, model, dashboard or prototype — and record a short demo.",
    },
    {
      id: "certify",
      when: "Week 4",
      title: "Get certified",
      description:
        "Pass the final review and earn a certificate anyone can check online. Not there yet? You get feedback and a second attempt.",
    },
    {
      id: "resume",
      when: "After",
      title: "Stand out",
      description: "Your mentor reviews how you present the project, so recruiters actually notice it.",
    },
  ],
  cta: { label: "Start at step 01", note: "Free to apply", href: "/apply" },
} as const

export type HowItWorksStepId = (typeof howItWorks.steps)[number]["id"]

export const buildWithAi = {
  eyebrow: "build with ai",
  title: "Learn to build the way teams build in 2026.",
  description:
    "AI writes code fast. Engineers who can plan, review and ship it are the ones who get hired. Every track teaches you to use AI as a tool — not a crutch.",
  items: [
    {
      id: "plan",
      title: "Plan with AI",
      description: "Break down a PRD, draft architecture and schemas with AI, then refine them yourself.",
    },
    {
      id: "build",
      title: "Build faster",
      description: "Use Claude, Cursor and Copilot to scaffold and iterate.",
    },
    {
      id: "review",
      title: "Review everything",
      description: "Test, debug and explain every line AI gives you.",
    },
    {
      id: "own",
      title: "Own the output",
      description: "In reviews you defend your decisions, not the AI's.",
    },
  ],
} as const

export type BuildWithAiId = (typeof buildWithAi.items)[number]["id"]

export const tracksSection = {
  eyebrow: "tracks",
  title: "Choose what you want to build",
  description: "9 specialised tracks across development, programming, AI & data and design.",
  filters: ["All", "Development", "Programming", "AI & Data", "Design"] as const,
} as const

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
    { id: "resume", title: "Resume & profile review", description: "Your mentor reviews your resume, GitHub and LinkedIn before you apply." },
  ],
} as const

export type FeatureId = (typeof features.items)[number]["id"]

export const finalCta = {
  eyebrow: "Free to apply",
  title: "Ship your first real project",
  description: "Apply in five minutes. Meet your mentor 1:1, and only pay if you want to continue.",
  cta: { label: "Apply free", href: "/apply" },
  tracksLabel: "Or start with a track",
} as const

export const footer = {
  links: [
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Terms", href: "/legal/terms" },
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
  title: "Start your application",
  description: "Tell us a little about yourself. It takes about five minutes, and it's free.",
  submitLabel: "Submit application",
  next: {
    title: "What happens next",
    steps: [
      { title: "Submit this form", description: "Takes about five minutes." },
      { title: "Get your login", description: "Credentials land in your inbox." },
      { title: "Free 1:1 session", description: "Meet a mentor and see how it works." },
      { title: `Pay ${formatPrice(pricing.price)} if you continue`, description: "Your four weeks start then." },
    ],
  },
  submittingLabel: "Submitting…",
  successToast: "Application received! Check your email.",
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
  trackPlaceholder: "Select a track",
  // Rendered as: "I agree to the program terms"
  terms: {
    prefix: "I agree to the",
    termsLink: { label: "program terms", href: "/legal/terms" },
  },
} as const

export const successPage = {
  title: "Application received",
  description: "Check your email for your login credentials.",
  nextStepsTitle: "What happens next",
  nextSteps: [
    { title: "Login credentials", description: "Your login details land in your inbox shortly." },
    { title: "Free 1:1 session", description: "Meet a mentor one-on-one. They'll walk you through your track and how the program works." },
    {
      title: "Decide, then pay",
      description: `Want to continue? Pay ${formatPrice(pricing.price)} and you get your project brief, Discord access and kickoff date.`,
    },
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
        body: `${program.name} is a paid, project-based virtual internship focused on real project experience. It is not a job-placement program — there's no stipend and no job guarantee.`,
      },
      {
        heading: "Your commitment",
        body: `Plan for about 6–8 hours per week over ${program.durationLabel}. The work you submit must be your own.`,
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
} as const

export type LegalSlug = keyof typeof legalPages
