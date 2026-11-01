"use client"

import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react"
import { useActionState, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type LoginState = { error: string } | undefined

type Field = {
  name: string
  label: string
  type: "text" | "email" | "password"
  autoComplete: string
}

/** Credentials form driven by a server action; shows the action's error inline. */
export function LoginForm({
  action,
  fields,
  submitLabel,
}: {
  action: (state: LoginState, formData: FormData) => Promise<LoginState>
  fields: Field[]
  submitLabel: string
}) {
  const [state, formAction, pending] = useActionState(action, undefined)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form action={formAction} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <div className="relative">
            <Input
              id={field.name}
              name={field.name}
              type={field.type === "password" && showPassword ? "text" : field.type}
              autoComplete={field.autoComplete}
              autoCapitalize="none"
              spellCheck={false}
              required
              className={field.type === "password" ? "h-11 pr-11" : "h-11"}
            />
            {field.type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword((shown) => !shown)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
              </button>
            )}
          </div>
        </div>
      ))}

      {state?.error && (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="group h-11 w-full rounded-full">
        {pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
        {submitLabel}
        {!pending && <ArrowRight className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />}
      </Button>
    </form>
  )
}
