import type { Metadata } from "next"
import Link from "next/link"

import { LoginCard } from "@/components/auth/login-card"
import { LoginForm } from "@/components/auth/login-form"
import { studentLogin } from "@/app/(site)/portal/actions"

export const metadata: Metadata = {
  title: "Student login",
  robots: { index: false, follow: false },
}

export default function StudentLoginPage() {
  return (
    <LoginCard
      eyebrow="student portal"
      title="Student login"
      description="Use the email you applied with and the password we sent you."
    >
      <LoginForm
        action={studentLogin}
        submitLabel="Log in"
        fields={[
          { name: "email", label: "Email", type: "email", autoComplete: "email" },
          { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
        ]}
      />
      <p className="mt-5 text-center text-sm text-muted-foreground">
        Haven&apos;t applied yet?{" "}
        <Link href="/apply" className="text-brand-text underline-offset-4 hover:underline">
          Apply free
        </Link>
      </p>
    </LoginCard>
  )
}
