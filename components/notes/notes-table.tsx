"use client"

import { useMemo } from "react"
import { PinIcon, PinOffIcon } from "lucide-react"
import type { Note, Paginated, UserSummary } from "@/lib/api/types"
import {
  DataTable,
  DataTableFilter,
  DataTableReset,
  DataTableSearch,
} from "@/components/data-table"
import { useSession } from "@/components/shared/session-provider"
import { getNoteColumns } from "./note-columns"

const PINNED_OPTIONS = [
  { label: "Pinned", value: "true", icon: PinIcon },
  { label: "Unpinned", value: "false", icon: PinOffIcon },
]

interface NotesTableProps {
  notes: Paginated<Note>
  owners?: Record<string, UserSummary>
  emptyMessage?: string
}

export function NotesTable({ notes, owners, emptyMessage }: NotesTableProps) {
  const { id } = useSession()
  const columns = useMemo(() => getNoteColumns({ currentUserId: id, owners }), [id, owners])

  return (
    <DataTable
      columns={columns}
      data={notes.items}
      meta={notes.meta}
      getRowId={(note) => note.id}
      emptyMessage={emptyMessage}
      toolbar={
        <>
          <DataTableSearch placeholder="Search title, content or tags…" />
          <DataTableSearch paramKey="tag" placeholder="Exact tag" maxLength={30} className="sm:w-44" />
          <DataTableFilter paramKey="pinned" label="Pinned" options={PINNED_OPTIONS} />
          <DataTableReset keys={["search", "tag", "pinned", "sortOrder"]} />
        </>
      }
    />
  )
}
