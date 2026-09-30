"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { authApi } from "@/lib/api/auth"
import { ApiError, errorMessage } from "@/lib/api/errors"
import { emptyToUndefined } from "@/lib/utils"
import { registerSchema, type RegisterValues } from "@/lib/validations"
import { useCooldown } from "@/hooks/use-cooldown"
import { FieldGroup } from "@/components/ui/field"
import { InputField, PasswordField, TagsField } from "@/components/form/fields"
import { FormAlert } from "@/components/form/form-alert"
import { SubmitButton } from "@/components/form/submit-button"

export function RegisterForm() {
  const cooldown = useCooldown()
  const [errors, setErrors] = useState<string[] | null>(null)

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", firstName: "", lastName: "", avatarUrl: "", bio: "", interests: [] },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    setErrors(null)
    try {
      await authApi.register(emptyToUndefined(values))
      window.location.replace("/notes")
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        form.setError("email", { message: "This email is already registered" })
        return
      }
      if (error instanceof ApiError && error.isRateLimited) cooldown.start()
      setErrors(error instanceof ApiError ? error.messages : [errorMessage(error)])
    }
  })

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">Start writing secure notes in seconds.</p>
      </div>

      <FormAlert messages={errors} />

      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField control={form.control} name="firstName" label="First name" inputProps={{ autoComplete: "given-name" }} />
          <InputField control={form.control} name="lastName" label="Last name" inputProps={{ autoComplete: "family-name" }} />
        </div>
        <InputField
          control={form.control}
          name="email"
          label="Email"
          inputProps={{ type: "email", autoComplete: "email", placeholder: "you@example.com" }}
        />
        <PasswordField
          control={form.control}
          name="password"
          label="Password"
          autoComplete="new-password"
          description="12+ characters with upper, lower, digit and symbol."
        />
        <TagsField
          control={form.control}
          name="interests"
          label="Interests"
          max={20}
          placeholder="e.g. chess, reading"
          description="Optional. Press Enter to add."
        />
      </FieldGroup>

      <SubmitButton className="w-full" size="lg" pending={form.formState.isSubmitting} disabled={cooldown.active}>
        {cooldown.active ? `Try again in ${cooldown.remaining}s` : "Create account"}
      </SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
