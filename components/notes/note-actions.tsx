"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArchiveIcon,
  ArchiveRestoreIcon,
  EyeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PinIcon,
  PinOffIcon,
  Trash2Icon,
} from "lucide-react"
import { client } from "@/lib/api/client"
import type { Note } from "@/lib/api/types"
import { useApiAction } from "@/hooks/use-api-action"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { NoteFormDialog } from "./note-form-dialog"

interface NoteActionsProps {
  note: Note
  canEdit: boolean
  redirectOnDelete?: string
}

export function NoteActions({ note, canEdit, redirectOnDelete }: NoteActionsProps) {
  const router = useRouter()
  const { run } = useApiAction()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const toggle = (field: "isPinned" | "isArchived", label: string) =>
    run(() => client.notes.update(note.id, { [field]: !note[field] }), { success: label })

  const remove = () =>
    run(() => client.notes.remove(note.id), { success: "Note deleted", refresh: !redirectOnDelete }).then(
      ({ ok }) => ok && redirectOnDelete && router.replace(redirectOnDelete)
    )

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Note actions">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuGroup>
            {!redirectOnDelete && (
              <DropdownMenuItem asChild>
                <Link href={`/notes/${note.id}`}>
                  <EyeIcon />
                  Open
                </Link>
              </DropdownMenuItem>
            )}
            {canEdit && (
              <>
                <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                  <PencilIcon />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => toggle("isPinned", note.isPinned ? "Unpinned" : "Pinned")}>
                  {note.isPinned ? <PinOffIcon /> : <PinIcon />}
                  {note.isPinned ? "Unpin" : "Pin"}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => toggle("isArchived", note.isArchived ? "Restored" : "Archived")}>
                  {note.isArchived ? <ArchiveRestoreIcon /> : <ArchiveIcon />}
                  {note.isArchived ? "Unarchive" : "Archive"}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuGroup>
          {canEdit && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
                <Trash2Icon />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {canEdit && (
        <>
          <NoteFormDialog note={note} open={editOpen} onOpenChange={setEditOpen} />
          <ConfirmDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            title="Delete this note?"
            description={<>&ldquo;{note.title}&rdquo; will be removed. There is no undo.</>}
            confirmLabel="Delete"
            destructive
            onConfirm={remove}
          />
        </>
      )}
    </>
  )
}
