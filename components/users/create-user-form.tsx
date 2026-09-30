"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { client } from "@/lib/api/client"
import { ApiError, errorMessage } from "@/lib/api/errors"
import { emptyToUndefined } from "@/lib/utils"
import { createUserSchema, type CreateUserValues } from "@/lib/validations"
import { useApiAction } from "@/hooks/use-api-action"
import { Button } from "@/components/ui/button"
import { FieldGroup, FieldSeparator } from "@/components/ui/field"
import {
  CheckboxGroupField,
  InputField,
  PasswordField,
  TagsField,
  TextareaField,
} from "@/components/form/fields"
import { FormAlert } from "@/components/form/form-alert"
import { SubmitButton } from "@/components/form/submit-button"
import { ROLE_OPTIONS } from "./options"

export function CreateUserForm() {
  const router = useRouter()
  const { run } = useApiAction()
  const [errors, setErrors] = useState<string[] | null>(null)
  const form = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      avatarUrl: "",
      bio: "",
      interests: [],
      roles: ["user"],
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    setErrors(null)
    const { ok, result } = await run(() => client.users.create(emptyToUndefined(values)), {
      success: "User created",
      refresh: false,
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          form.setError("email", { message: "This email is already registered" })
        } else {
          setErrors(error instanceof ApiError ? error.messages : [errorMessage(error)])
        }
      },
    })
    if (ok) router.push(`/admin/users/${result.id}`)
  })

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <FormAlert messages={errors} />
      <FieldGroup>
        <div className="grid gap-5 sm:grid-cols-2">
          <InputField control={form.control} name="firstName" label="First name" />
          <InputField control={form.control} name="lastName" label="Last name" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <InputField control={form.control} name="email" label="Email" inputProps={{ type: "email", autoComplete: "off" }} />
          <PasswordField
            control={form.control}
            name="password"
            label="Temporary password"
            autoComplete="new-password"
            description="12+ chars, upper, lower, digit, symbol."
          />
        </div>
        <CheckboxGroupField
          control={form.control}
          name="roles"
          label="Roles"
          options={ROLE_OPTIONS}
          description="Admins should also keep the user role."
        />
        <FieldSeparator>Optional</FieldSeparator>
        <InputField control={form.control} name="avatarUrl" label="Avatar URL" inputProps={{ type: "url", placeholder: "https://…" }} />
        <TextareaField control={form.control} name="bio" label="Bio" rows={3} maxLength={500} />
        <TagsField control={form.control} name="interests" label="Interests" max={20} />
      </FieldGroup>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <SubmitButton pending={form.formState.isSubmitting}>Create user</SubmitButton>
      </div>
    </form>
  )
}
