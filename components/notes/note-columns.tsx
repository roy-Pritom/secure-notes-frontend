"use client"

import Link from "next/link"
import { PinIcon } from "lucide-react"
import type { Note, UserSummary } from "@/lib/api/types"
import { formatDate } from "@/lib/format"
import { columnHelper, DataTableSortHeader, type DataTableColumn } from "@/components/data-table"
import { ColorDot, TagList } from "@/components/shared/badges"
import { UserCell } from "@/components/shared/user-avatar"
import { NoteActions } from "./note-actions"

const helper = columnHelper<Note>()

interface NoteColumnOptions {
  currentUserId: string
  owners?: Record<string, UserSummary>
}

export function getNoteColumns({ currentUserId, owners }: NoteColumnOptions): DataTableColumn<Note>[] {
  return helper.columns([
    helper.accessor("title", {
      header: "Title",
      enableHiding: false,
      cell: ({ row }) => (
        <Link href={`/notes/${row.original.id}`} className="group flex max-w-xs items-center gap-2.5">
          <ColorDot color={row.original.color} />
          <span className="truncate font-medium group-hover:underline">{row.original.title}</span>
          {row.original.isPinned && <PinIcon className="size-3.5 shrink-0 fill-current text-amber-500" />}
        </Link>
      ),
    }),
    helper.accessor("content", {
      header: "Content",
      cell: ({ getValue }) => (
        <p className="line-clamp-1 max-w-sm text-muted-foreground">{getValue()}</p>
      ),
    }),
    ...(owners
      ? [
          helper.accessor("owner", {
            header: "Owner",
            cell: ({ getValue }) => {
              const owner = owners[getValue()]
              return owner ? (
                <Link href={`/admin/users/${owner.id}`} className="hover:opacity-80">
                  <UserCell name={owner.fullName} email={owner.email} src={owner.avatarUrl} />
                </Link>
              ) : (
                <span className="font-mono text-xs text-muted-foreground">{getValue()}</span>
              )
            },
          }),
        ]
      : []),
    helper.accessor("tags", {
      header: "Tags",
      cell: ({ getValue }) => <TagList tags={getValue()} />,
    }),
    helper.accessor("updatedAt", {
      header: "Updated",
      cell: ({ getValue }) => <span className="whitespace-nowrap text-muted-foreground">{formatDate(getValue())}</span>,
    }),
    helper.accessor("createdAt", {
      header: () => <DataTableSortHeader title="Created" />,
      cell: ({ getValue }) => <span className="whitespace-nowrap text-muted-foreground">{formatDate(getValue())}</span>,
    }),
    helper.display({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <NoteActions note={row.original} canEdit={row.original.owner === currentUserId} />
        </div>
      ),
    }),
  ])
}
