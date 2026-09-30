"use client"

import { useState, type ReactNode } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { CheckIcon } from "lucide-react"
import { client } from "@/lib/api/client"
import { ApiError, errorMessage } from "@/lib/api/errors"
import type { Note } from "@/lib/api/types"
import { cn, pickChanged } from "@/lib/utils"
import { NOTE_COLORS, noteSchema, type NoteValues } from "@/lib/validations"
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { NOTE_COLOR_CLASS } from "@/components/shared/badges"
import { InputField, SwitchField, TagsField, TextareaField } from "@/components/form/fields"
import { FormAlert } from "@/components/form/form-alert"
import { SubmitButton } from "@/components/form/submit-button"

const EMPTY: NoteValues = { title: "", content: "", tags: [], isPinned: false, isArchived: false, color: "default" }

function toValues(note?: Note): NoteValues {
  if (!note) return EMPTY
  const { title, content, tags, isPinned, isArchived, color } = note
  return { title, content, tags, isPinned, isArchived, color }
}

interface NoteFormDialogProps {
  note?: Note
  trigger?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function NoteFormDialog({ note, trigger, open, onOpenChange }: NoteFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = open ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{note ? "Edit note" : "New note"}</DialogTitle>
          <DialogDescription>
            {note ? "Only the fields you change are saved." : "Capture a thought. Title and content are required."}
          </DialogDescription>
        </DialogHeader>
        {isOpen && <NoteForm note={note} onDone={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  )
}

function NoteForm({ note, onDone }: { note?: Note; onDone: () => void }) {
  const { run } = useApiAction()
  const [errors, setErrors] = useState<string[] | null>(null)
  const form = useForm<NoteValues>({ resolver: zodResolver(noteSchema), defaultValues: toValues(note) })

  const onSubmit = form.handleSubmit(async (values) => {
    setErrors(null)
    const changes = note ? pickChanged(toValues(note), values) : values
    if (note && !Object.keys(changes).length) return onDone()

    const { ok } = await run(
      () => (note ? client.notes.update(note.id, changes) : client.notes.create(values)),
      {
        success: note ? "Note updated" : "Note created",
        onError: (error) => setErrors(error instanceof ApiError ? error.messages : [errorMessage(error)]),
      }
    )
    if (ok) onDone()
  })

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <FormAlert messages={errors} />
      <FieldGroup>
        <InputField control={form.control} name="title" label="Title" inputProps={{ maxLength: 160, placeholder: "Opening repertoire" }} />
        <TextareaField control={form.control} name="content" label="Content" rows={8} maxLength={20000} placeholder="Write something…" />
        <div className="grid gap-5 sm:grid-cols-2">
          <TagsField control={form.control} name="tags" label="Tags" max={10} placeholder="Add a tag" />
          <Controller
            control={form.control}
            name="color"
            render={({ field }) => (
              <Field>
                <FieldLabel>Colour</FieldLabel>
                <div className="flex h-8 items-center gap-2">
                  {NOTE_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={color}
                      aria-pressed={field.value === color}
                      onClick={() => field.onChange(color)}
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full text-white ring-offset-2 ring-offset-background transition hover:scale-110",
                        NOTE_COLOR_CLASS[color],
                        field.value === color && "ring-2 ring-ring"
                      )}
                    >
                      {field.value === color && <CheckIcon className="size-3.5" />}
                    </button>
                  ))}
                </div>
              </Field>
            )}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <SwitchField control={form.control} name="isPinned" label="Pinned" description="Pinned notes lead the list." />
          <SwitchField control={form.control} name="isArchived" label="Archived" description="Hidden from the main list." />
        </div>
      </FieldGroup>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <SubmitButton pending={form.formState.isSubmitting}>{note ? "Save changes" : "Create note"}</SubmitButton>
      </DialogFooter>
    </form>
  )
}
