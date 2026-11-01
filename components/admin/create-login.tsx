"use client"

import { Check, Copy, KeyRound, Loader2, Mail, TriangleAlert } from "lucide-react"
import { useActionState, useState } from "react"

import { createStudentLogin } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"

/** Creates or resets a student's portal login, emails it, and shows it once. */
export function CreateLogin({ applicationId, hasLogin }: { applicationId: string; hasLogin: boolean }) {
  const [state, formAction, pending] = useActionState(createStudentLogin, undefined)
  const [copied, setCopied] = useState(false)

  if (state && "password" in state) {
    const message = `Your Devio Tech student portal login:\nEmail: ${state.email}\nPassword: ${state.password}\nLog in at https://deviotech.in/portal/login`
    return (
      <div className="space-y-3">
        {state.emailed ? (
          <p className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-emerald-700 dark:text-emerald-400">
            <Mail className="size-4 shrink-0" aria-hidden="true" />
            Emailed to {state.email}
          </p>
        ) : (
          <p className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-amber-700 dark:text-amber-400">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {state.emailError ? `Email failed: ${state.emailError}` : "Email isn't set up — send these yourself."}
          </p>
        )}
        <div className="rounded-lg border bg-muted/40 p-3">
          <p className="text-xs text-muted-foreground">Email</p>
          <p className="font-mono text-xs">{state.email}</p>
          <p className="mt-2 text-xs text-muted-foreground">Password</p>
          <p className="font-mono">{state.password}</p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="w-full"
          onClick={async () => {
            await navigator.clipboard.writeText(message)
            setCopied(true)
          }}
        >
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {copied ? "Copied" : "Copy as message"}
        </Button>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="id" value={applicationId} />
      <Button type="submit" size="sm" variant={hasLogin ? "outline" : "default"} disabled={pending} className="w-full">
        {pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <KeyRound aria-hidden="true" />}
        {hasLogin ? "Reset & email new password" : "Create login & email it"}
      </Button>
      {state && "error" in state && <p className="text-xs text-destructive">{state.error}</p>}
    </form>
  )
}
