import type { Metadata } from "next"

import { adminLogin } from "@/app/admin/actions"
import { LoginForm } from "@/components/auth/login-form"
import { LogoMark } from "@/components/logo"

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  return (
    <main id="main" className="flex min-h-screen items-center justify-center px-4 font-sans [&_h1]:font-sans">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-7 shadow-sm">
        <LogoMark className="size-9" />
        <h1 className="mt-5 text-lg font-semibold">Devio Tech admin</h1>
        <p className="mt-1 mb-5 text-sm text-muted-foreground">Sign in to view applications.</p>
        <LoginForm
          action={adminLogin}
          submitLabel="Sign in"
          fields={[
            { name: "username", label: "Username", type: "text", autoComplete: "username" },
            { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
          ]}
        />
      </div>
    </main>
  )
}
