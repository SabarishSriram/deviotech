import { ArrowRight, Check, Lock, LogOut } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { Suspense } from "react"

import { studentLogout } from "@/app/(site)/portal/actions"
import { PasswordForm } from "@/components/portal/password-form"
import { Button } from "@/components/ui/button"
import { Widget } from "@/components/widgets/widget"
import { pagesFor } from "@/data/docs"
import { site } from "@/data/site"
import { getTrack } from "@/data/tracks"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { createClient } from "@/lib/supabase/server"
import { hasPaid, type ApplicationRow, type ApplicationStatus } from "@/lib/supabase/types"
import { trackColorStyle, trackIcons } from "@/lib/track-icons"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Student portal",
  robots: { index: false, follow: false },
}

const journey = ["Applied", "1:1 session", "Paid", "Building", "Certified"]

/** How many journey steps are complete for each status. */
const progress: Record<ApplicationStatus, number> = {
  new: 1,
  contacted: 1,
  session_booked: 1,
  paid: 3,
  active: 3,
  completed: 5,
  rejected: 1,
}

const nextStep: Record<ApplicationStatus, string> = {
  new: "We'll message you on WhatsApp to schedule your free 1:1 session.",
  contacted: "Check WhatsApp — we've reached out to schedule your free 1:1 session.",
  session_booked: "Your 1:1 is booked. After it, decide if you want to continue.",
  paid: "You're in. Your project brief and kickoff details are on the way.",
  active: "You're building. Ship your weekly deliverable and open a PR for review.",
  completed: "You've earned your certificate. Congratulations!",
  rejected: `This application wasn't accepted. Email ${site.contactEmail} if you have questions.`,
}

export default function PortalPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-8 sm:px-6 sm:py-10">
      <Suspense fallback={<p className="label-mono text-muted-foreground">Loading your portal…</p>}>
        <Portal />
      </Suspense>
    </div>
  )
}

async function Portal() {
  // Always per-request: this reads the visitor's session, never a cached shell.
  await connection()
  if (!isSupabaseConfigured()) {
    return (
      <Widget interactive={false} className="p-8 text-sm text-muted-foreground">
        The student portal isn&apos;t available yet. Please check back soon.
      </Widget>
    )
  }

  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getClaims()
  if (!auth?.claims) redirect("/portal/login")

  // RLS guarantees this only ever returns the signed-in student's own rows.
  const { data } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", auth.claims.sub)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  const application = data as ApplicationRow | null
  const email = typeof auth.claims.email === "string" ? auth.claims.email : ""

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4 pb-2">
        <div>
          <p className="flex items-center gap-2 label-mono text-muted-foreground">
            <span className="signal-dot" aria-hidden="true" />
            student portal
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight uppercase">
            {application ? `Hi, ${application.full_name.split(" ")[0]}` : "Welcome"}
          </h1>
        </div>
        <form action={studentLogout}>
          <Button type="submit" variant="outline" size="sm" className="rounded-full">
            <LogOut aria-hidden="true" />
            Log out
          </Button>
        </form>
      </header>

      {application ? <Journey application={application} /> : (
        <Widget interactive={false} className="p-8 text-sm text-muted-foreground">
          We couldn&apos;t find an application linked to {email || "this account"}. Email {site.contactEmail} and we&apos;ll sort it out.
        </Widget>
      )}

      <Widget interactive={false} className="p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="label-mono text-muted-foreground">Account</h2>
          <p className="font-mono text-xs text-muted-foreground">{email}</p>
        </div>
        <div className="mt-4 max-w-xl">
          <PasswordForm />
        </div>
      </Widget>
    </>
  )
}

function Journey({ application }: { application: ApplicationRow }) {
  const track = getTrack(application.track)
  const done = progress[application.status]
  const Icon = track ? trackIcons[track.slug] : null

  return (
    <div style={track ? trackColorStyle(track.slug) : undefined} className="track-color space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        {/* ---- Track + next step ---- */}
        <Widget interactive={false} className="flex flex-col gap-6 p-6 sm:p-8 lg:col-span-2">
          {Icon && (
            <Icon aria-hidden="true" className="pointer-events-none absolute -right-10 -bottom-10 size-56 text-(--tc) opacity-[0.08]" />
          )}
          <div className="relative flex items-center gap-3">
            {Icon && (
              <span className="flex size-12 items-center justify-center rounded-2xl border border-(--tc)/30 bg-(--tc)/10 text-(--tc)">
                <Icon className="size-6" aria-hidden="true" />
              </span>
            )}
            <div>
              <p className="label-mono text-muted-foreground">Your track</p>
              <p className="text-lg font-semibold tracking-tight uppercase">{track?.name ?? application.track}</p>
            </div>
          </div>
          <div className="relative rounded-2xl border border-brand/30 bg-brand/5 p-4">
            <p className="label-mono text-brand-text">Next step</p>
            <p className="mt-1.5 text-pretty">{nextStep[application.status]}</p>
          </div>
          {track && (
            <Link href={`/tracks/${track.slug}`} className="relative inline-flex w-fit items-center gap-1.5 label-mono text-brand-text">
              View full curriculum <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          )}
        </Widget>

        {/* ---- Progress ---- */}
        <Widget interactive={false} className="p-6">
          <h2 className="label-mono text-muted-foreground">Your progress</h2>
          <ol className="relative mt-5 space-y-4">
            <span aria-hidden="true" className="absolute top-2 bottom-2 left-[11px] w-px bg-border" />
            {journey.map((step, i) => {
              const complete = i < done
              const current = i === done
              return (
                <li key={step} className="relative flex items-center gap-3.5">
                  <span
                    className={cn(
                      "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-[10px]",
                      complete && "border-brand bg-brand text-white",
                      current && "border-brand text-brand-text",
                      !complete && !current && "bg-card text-muted-foreground"
                    )}
                  >
                    {complete ? <Check className="size-3" aria-hidden="true" /> : i + 1}
                  </span>
                  <span className={cn("text-sm", !complete && !current && "text-muted-foreground")}>{step}</span>
                  {current && <span className="ml-auto label-mono text-brand-text">Now</span>}
                </li>
              )
            })}
          </ol>
        </Widget>
      </div>

      {track && <DocsCard application={application} />}

      {track && (
        <div className="grid gap-4 lg:grid-cols-3">
          {/* ---- Projects ---- */}
          <Widget interactive={false} className="p-6 lg:col-span-2">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="label-mono text-muted-foreground">{application.project ? "Your project" : "Your project options"}</h2>
              <p className="text-xs text-muted-foreground">{application.project ? "Assigned by your mentor" : "Pick one with your mentor"}</p>
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {track.projects.map((project, i) => (
                <li
                  key={project.name}
                  className={cn(
                    "rounded-2xl border bg-background/50 p-4",
                    application.project === project.slug && "border-(--tc)/60 bg-(--tc)/10",
                    application.project && application.project !== project.slug && "opacity-50"
                  )}
                >
                  <p className="label-mono text-muted-foreground">Option {String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-2 text-sm font-semibold">{project.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{project.description}</p>
                </li>
              ))}
            </ul>
          </Widget>

          {/* ---- Weeks ---- */}
          <Widget interactive={false} className="p-6">
            <h2 className="label-mono text-muted-foreground">Your four weeks</h2>
            <ol className="mt-4 space-y-3">
              {track.weeks.map((week, i) => (
                <li key={week.title} className="flex gap-3">
                  <span className="font-mono text-xs text-(--tc)">W{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{week.title}</p>
                    <p className="text-xs text-muted-foreground">{week.deliverable}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Widget>
        </div>
      )}
    </div>
  )
}

function DocsCard({ application }: { application: ApplicationRow }) {
  const unlocked = hasPaid(application.status) && Boolean(application.project)
  return (
    <Widget interactive={false} className="p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="label-mono text-muted-foreground">Your docs</h2>
        <p className="text-xs text-muted-foreground">
          {unlocked ? "Everything is unlocked" : "Project docs unlock after payment and project assignment"}
        </p>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {pagesFor(unlocked ? application.project : null).map((page) => {
          const locked = page.locked && !unlocked
          return (
            <li key={page.id}>
              <Link
                href={`/portal/docs/${page.id}`}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-xl border bg-background/50 px-3.5 py-3 text-sm transition-colors hover:border-(--tc)/50",
                  locked && "text-muted-foreground"
                )}
              >
                {page.title}
                {locked ? <Lock className="size-3.5" aria-label="Locked" /> : <ArrowRight className="size-3.5 text-(--tc)" aria-hidden="true" />}
              </Link>
            </li>
          )
        })}
      </ul>
    </Widget>
  )
}
