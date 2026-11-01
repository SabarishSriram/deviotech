"use client"

import { Loader2 } from "lucide-react"
import { useActionState } from "react"

import { changePassword } from "@/app/(site)/portal/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, undefined)

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="password">New password</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirm</Label>
          <Input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" variant="outline" disabled={pending} className="rounded-full">
          {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
          Change password
        </Button>
        {state && "ok" in state && <p className="text-sm text-brand-text">Password updated.</p>}
        {state && "error" in state && <p className="text-sm text-destructive">{state.error}</p>}
      </div>
    </form>
  )
}
