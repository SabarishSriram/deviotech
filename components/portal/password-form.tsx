"use client"

import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useActionState, useState } from "react"

import { changePassword } from "@/app/(site)/portal/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/** A password field with its own show/hide toggle. */
function PasswordField({ id, label }: { id: string; label: string }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          minLength={8}
          required
          className="h-11 pr-11"
        />
        <button
          type="button"
          onClick={() => setVisible((shown) => !shown)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {visible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
        </button>
      </div>
    </div>
  )
}

export function PasswordForm({ submitLabel = "Change password" }: { submitLabel?: string }) {
  const [state, formAction, pending] = useActionState(changePassword, undefined)

  return (
    <form action={formAction} className="space-y-4">
      <PasswordField id="password" label="New password" />
      <PasswordField id="confirm" label="Confirm password" />

      {state && "ok" in state && <p className="text-sm text-brand-text">Password updated.</p>}
      {state && "error" in state && (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={pending} className="h-11 rounded-full px-6">
          {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
