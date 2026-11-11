import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { site } from "@/data/site"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

/** What people search for, then the brand. Kept under ~60 characters so Google shows it in full. */
const title = `Virtual Internships with Real Projects & Certificate | ${site.name}`
/** Under ~160 characters so Google shows it in full. */
const description =
  "Apply free for a 4-week virtual internship. Build a real project in web, AI/ML, data, Python, Java or UI/UX, with mentor code reviews and a verifiable certificate."
const socialTitle = `${site.name} — Don't just learn. Build.`

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.name}` },
  description,
  applicationName: site.name,
  keywords: [
    "virtual internship",
    "online internship for students",
    "internship with certificate",
    "project-based internship",
    "full stack internship",
    "web development internship",
    "AI ML internship",
    "data science internship",
    "python internship",
    "java internship",
    "UI UX internship",
    "internship for college students India",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "education",
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    title: socialTitle,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description,
  },
  // Set these in the hosting environment after adding the site to Google Search Console / Bing Webmaster Tools.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <noscript>
          <style>{"[data-fade]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <a
            href="#main"
            className="sr-only z-100 rounded-md bg-background px-3 py-2 text-sm focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:ring-3 focus:ring-ring/50"
          >
            Skip to content
          </a>
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
