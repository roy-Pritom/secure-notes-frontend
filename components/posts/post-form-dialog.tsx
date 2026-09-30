"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { PlusIcon } from "lucide-react"
import { client } from "@/lib/api/client"
import { ApiError, errorMessage } from "@/lib/api/errors"
import { emptyToUndefined } from "@/lib/utils"
import { postSchema, type PostValues } from "@/lib/validations"
import { useApiAction } from "@/hooks/use-api-action"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FieldGroup } from "@/components/ui/field"
import { InputField, SelectField, TagsField, TextareaField } from "@/components/form/fields"
import { FormAlert } from "@/components/form/form-alert"
import { SubmitButton } from "@/components/form/submit-button"

const STATUS_OPTIONS = [
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
]

const EMPTY: PostValues = { title: "", body: "", excerpt: "", tags: [], status: "published" }

export function PostFormDialog() {
  const [open, setOpen] = useState(false)
  const { run } = useApiAction()
  const [errors, setErrors] = useState<string[] | null>(null)
  const form = useForm<PostValues>({ resolver: zodResolver(postSchema), defaultValues: EMPTY })

  const onSubmit = form.handleSubmit(async (values) => {
    setErrors(null)
    const { ok } = await run(() => client.posts.create(emptyToUndefined(values)), {
      success: values.status === "draft" ? "Draft saved" : "Post published",
      onError: (error) => setErrors(error instanceof ApiError ? error.messages : [errorMessage(error)]),
    })
    if (ok) {
      form.reset(EMPTY)
      setOpen(false)
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          New post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>New post</DialogTitle>
          <DialogDescription>Posts can&apos;t be edited later, and the status you pick is final.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <FormAlert messages={errors} />
          <FieldGroup>
            <InputField control={form.control} name="title" label="Title" inputProps={{ maxLength: 160 }} />
            <TextareaField control={form.control} name="body" label="Body" rows={8} maxLength={10000} />
            <TextareaField
              control={form.control}
              name="excerpt"
              label="Excerpt"
              rows={2}
              maxLength={300}
              description="Optional — derived from the body when left empty."
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <TagsField control={form.control} name="tags" label="Tags" max={10} />
              <SelectField control={form.control} name="status" label="Status" options={STATUS_OPTIONS} />
            </div>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <SubmitButton pending={form.formState.isSubmitting}>Create post</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
