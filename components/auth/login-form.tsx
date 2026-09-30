"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { InfoIcon } from "lucide-react"
import { authApi } from "@/lib/api/auth"
import { ApiError, errorMessage } from "@/lib/api/errors"
import { afterLogin } from "@/lib/auth/constants"
import { loginSchema, type LoginValues } from "@/lib/validations"
import { useCooldown } from "@/hooks/use-cooldown"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FieldGroup } from "@/components/ui/field"
import { InputField, PasswordField } from "@/components/form/fields"
import { FormAlert } from "@/components/form/form-alert"
import { SubmitButton } from "@/components/form/submit-button"

const NOTICES: Record<string, string> = {
  expired: "Your session has ended. Please sign in again.",
  forbidden: "Your access changed. Please sign in again.",
  passwordChanged: "Password updated. Sign in with your new password.",
}

export function LoginForm() {
  const searchParams = useSearchParams()
  const cooldown = useCooldown()
  const [errors, setErrors] = useState<string[] | null>(null)
  const notice =
    NOTICES[searchParams.get("passwordChanged") ? "passwordChanged" : (searchParams.get("reason") ?? "")]

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    setErrors(null)
    try {
      const { user } = await authApi.login(values)
      window.location.replace(afterLogin(searchParams.get("next"), user.roles))
    } catch (error) {
      if (error instanceof ApiError && error.isRateLimited) cooldown.start()
      if (error instanceof ApiError && error.isForbidden) {
        setErrors([error.messages[0].includes("locked")
          ? "Too many failed attempts. Your account is locked for 15 minutes."
          : "This account is suspended. Contact an administrator."])
      } else {
        setErrors([errorMessage(error)])
      }
    }
  })

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your account to continue.</p>
      </div>

      {notice && (
        <Alert>
          <InfoIcon />
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      )}
      <FormAlert messages={errors} />

      <FieldGroup>
        <InputField
          control={form.control}
          name="email"
          label="Email"
          inputProps={{ type: "email", autoComplete: "email", placeholder: "you@example.com" }}
        />
        <PasswordField control={form.control} name="password" label="Password" />
      </FieldGroup>

      <SubmitButton className="w-full" size="lg" pending={form.formState.isSubmitting} disabled={cooldown.active}>
        {cooldown.active ? `Try again in ${cooldown.remaining}s` : "Sign in"}
      </SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
          Create one
        </Link>
      </p>
    </form>
  )
}
