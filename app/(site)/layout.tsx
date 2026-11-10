import { SiteHeader } from "@/components/layout/site-header"

/**
 * Public site chrome. The admin dashboard lives outside this group, so it
 * gets neither. The footer is not here — it only renders on the home page,
 * directly from app/(site)/page.tsx, not on every page.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
    </>
  )
}
