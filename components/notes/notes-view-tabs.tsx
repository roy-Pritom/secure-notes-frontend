"use client"

import { ArchiveIcon, NotebookPenIcon } from "lucide-react"
import { DataTableTabs } from "@/components/data-table"

const VIEWS = [
  { label: "Active", value: "active", icon: NotebookPenIcon },
  { label: "Archived", value: "archived", icon: ArchiveIcon },
]

export function NotesViewTabs() {
  return <DataTableTabs paramKey="view" options={VIEWS} />
}
