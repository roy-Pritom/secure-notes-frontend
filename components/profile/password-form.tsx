"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { client } from "@/lib/api/client"
import { authApi } from "@/lib/api/auth"
import { ApiError, errorMessage } from "@/lib/api/errors"
import { changePasswordSchema, type ChangePasswordValues } from "@/lib/validations"
import { FieldGroup } from "@/components/ui/field"
import { PasswordField } from "@/components/form/fields"
import { FormAlert } from "@/components/form/form-alert"
import { SubmitButton } from "@/components/form/submit-button"

export function PasswordForm() {
  const [errors, setErrors] = useState<string[] | null>(null)
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  })

  const onSubmit = form.handleSubmit(async ({ currentPassword, newPassword }) => {
    setErrors(null)
    try {
      await client.profile.changePassword({ currentPassword, newPassword })
    } catch (error) {
      if (error instanceof ApiError && error.isUnauthorized) {
        form.setError("currentPassword", { message: "Current password is incorrect" })
      } else {
        setErrors(error instanceof ApiError ? error.messages : [errorMessage(error)])
      }
      return
    }
    // Every session, including this one, is now revoked.
    await authApi.logout().catch(() => undefined)
    window.location.replace("/login?passwordChanged=1")
  })

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <FormAlert messages={errors} />
      <FieldGroup>
        <PasswordField control={form.control} name="currentPassword" label="Current password" />
        <PasswordField
          control={form.control}
          name="newPassword"
          label="New password"
          autoComplete="new-password"
          description="12+ characters with upper, lower, digit and symbol."
        />
        <PasswordField control={form.control} name="confirmPassword" label="Confirm new password" autoComplete="new-password" />
      </FieldGroup>
      <div className="flex justify-end">
        <SubmitButton pending={form.formState.isSubmitting} variant="destructive">
          Change password & sign out
        </SubmitButton>
      </div>
    </form>
  )
}
