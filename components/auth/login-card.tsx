import { Widget } from "@/components/widgets/widget"

/** Centered card shared by the admin and student login pages. */
export function LoginCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="relative isolate flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">
      <div
        aria-hidden="true"
        className="bg-dots absolute inset-x-0 top-0 -z-10 h-80 mask-[linear-gradient(to_bottom,#000,transparent)]"
      />
      <Widget interactive={false} className="w-full max-w-sm p-6 sm:p-8">
        <div aria-hidden="true" className="widget-dots pointer-events-none absolute inset-0 opacity-40 mask-[radial-gradient(circle_at_100%_0%,#000,transparent_55%)]" />
        <div className="relative">
          <p className="flex items-center gap-2 label-mono text-muted-foreground">
            <span className="signal-dot" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight uppercase">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
          <div className="mt-6">{children}</div>
        </div>
      </Widget>
    </div>
  )
}
