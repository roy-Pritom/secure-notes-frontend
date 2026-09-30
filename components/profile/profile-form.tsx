"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { client } from "@/lib/api/client"
import { ApiError, errorMessage } from "@/lib/api/errors"
import type { User } from "@/lib/api/types"
import { pickChanged } from "@/lib/utils"
import { profileSchema, type ProfileValues } from "@/lib/validations"
import { useApiAction } from "@/hooks/use-api-action"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputField, TagsField, TextareaField } from "@/components/form/fields"
import { FormAlert } from "@/components/form/form-alert"
import { SubmitButton } from "@/components/form/submit-button"

export function toProfileValues(user: User): ProfileValues {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl ?? "",
    bio: user.bio ?? "",
    interests: user.interests,
  }
}

export function ProfileForm({ user }: { user: User }) {
  const { run } = useApiAction()
  const [errors, setErrors] = useState<string[] | null>(null)
  const form = useForm<ProfileValues>({ resolver: zodResolver(profileSchema), defaultValues: toProfileValues(user) })

  const onSubmit = form.handleSubmit(async (values) => {
    setErrors(null)
    const changes = pickChanged(toProfileValues(user), values)
    if (!Object.keys(changes).length) return
    const { ok, result } = await run(() => client.profile.update(changes), {
      success: "Profile updated",
      onError: (error) => setErrors(error instanceof ApiError ? error.messages : [errorMessage(error)]),
    })
    if (ok) form.reset(toProfileValues(result))
  })

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <FormAlert messages={errors} />
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" value={user.email} disabled readOnly />
          <FieldDescription>Email addresses can&apos;t be changed.</FieldDescription>
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <InputField control={form.control} name="firstName" label="First name" />
          <InputField control={form.control} name="lastName" label="Last name" />
        </div>
        <InputField
          control={form.control}
          name="avatarUrl"
          label="Avatar URL"
          inputProps={{ type: "url", placeholder: "https://…" }}
        />
        <TextareaField control={form.control} name="bio" label="Bio" rows={3} maxLength={500} />
        <TagsField control={form.control} name="interests" label="Interests" max={20} />
      </FieldGroup>
      <div className="flex justify-end">
        <SubmitButton pending={form.formState.isSubmitting} disabled={!form.formState.isDirty}>
          Save profile
        </SubmitButton>
      </div>
    </form>
  )
}
