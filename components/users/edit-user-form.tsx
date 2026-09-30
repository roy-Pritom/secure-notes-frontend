"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { authApi } from "@/lib/api/auth"
import { client } from "@/lib/api/client"
import { ApiError, errorMessage } from "@/lib/api/errors"
import type { AdminUpdateUserBody, User } from "@/lib/api/types"
import { pickChanged } from "@/lib/utils"
import { adminUserSchema, type AdminUserValues } from "@/lib/validations"
import { useApiAction } from "@/hooks/use-api-action"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  CheckboxGroupField,
  InputField,
  SelectField,
  TagsField,
  TextareaField,
} from "@/components/form/fields"
import { FormAlert } from "@/components/form/form-alert"
import { SubmitButton } from "@/components/form/submit-button"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { useSession } from "@/components/shared/session-provider"
import { ROLE_OPTIONS, STATUS_OPTIONS } from "./options"

function toValues(user: User): AdminUserValues {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl ?? "",
    bio: user.bio ?? "",
    interests: user.interests,
    roles: user.roles,
    status: user.status,
  }
}

export function EditUserForm({ user, adminCount }: { user: User; adminCount: number }) {
  const session = useSession()
  const { run } = useApiAction()
  const [errors, setErrors] = useState<string[] | null>(null)
  const [pending, setPending] = useState<AdminUpdateUserBody | null>(null)
  const form = useForm<AdminUserValues>({ resolver: zodResolver(adminUserSchema), defaultValues: toValues(user) })
  const isSelf = user.id === session.id

  const save = async (changes: AdminUpdateUserBody) => {
    setErrors(null)
    const { ok, result } = await run(() => client.users.update(user.id, changes), {
      success: "User updated",
      onError: (error) => setErrors(error instanceof ApiError ? error.messages : [errorMessage(error)]),
    })
    if (!ok) return
    form.reset(toValues(result))
    if (isSelf && ("roles" in changes || "status" in changes)) {
      await authApi.logout().catch(() => undefined)
      window.location.replace("/login?reason=forbidden")
    }
  }

  const onSubmit = form.handleSubmit(async (values) => {
    const changes = pickChanged(toValues(user), values)
    if (!Object.keys(changes).length) return

    const wasActiveAdmin = user.roles.includes("admin") && user.status === "active"
    const staysActiveAdmin = values.roles.includes("admin") && values.status === "active"
    if (wasActiveAdmin && !staysActiveAdmin && adminCount <= 1) {
      form.setError("roles", { message: "This is the last admin — promote someone else first." })
      return
    }

    if ("roles" in changes || "status" in changes) setPending(changes)
    else await save(changes)
  })

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <FormAlert messages={errors} />
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" value={user.email} disabled readOnly />
          <FieldDescription>Email and password can&apos;t be changed by an admin.</FieldDescription>
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <InputField control={form.control} name="firstName" label="First name" />
          <InputField control={form.control} name="lastName" label="Last name" />
        </div>
        <InputField control={form.control} name="avatarUrl" label="Avatar URL" inputProps={{ type: "url" }} />
        <TextareaField control={form.control} name="bio" label="Bio" rows={3} maxLength={500} />
        <TagsField control={form.control} name="interests" label="Interests" max={20} />
        <FieldSeparator>Access</FieldSeparator>
        <CheckboxGroupField control={form.control} name="roles" label="Roles" options={ROLE_OPTIONS} />
        <SelectField
          control={form.control}
          name="status"
          label="Status"
          options={STATUS_OPTIONS}
          description="Suspended users cannot sign in."
        />
      </FieldGroup>
      <div className="flex justify-end">
        <SubmitButton pending={form.formState.isSubmitting} disabled={!form.formState.isDirty}>
          Save changes
        </SubmitButton>
      </div>

      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
        title="Change access?"
        description={
          <>
            <p>Changing roles or status revokes every session {isSelf ? "you have" : `${user.fullName} has`}.</p>
            <p>
              {isSelf
                ? "You will be signed out right after saving."
                : "Their current access token stays valid for up to 15 minutes, then they are signed out."}
            </p>
          </>
        }
        confirmLabel="Save and revoke sessions"
        onConfirm={() => pending && save(pending)}
      />
    </form>
  )
}
