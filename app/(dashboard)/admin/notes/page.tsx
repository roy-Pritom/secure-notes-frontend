import type { Metadata } from "next";
import { EyeIcon } from "lucide-react";
import { resolveUsers } from "@/lib/api/admin";
import { backend } from "@/lib/api/server";
import { noteParams } from "@/lib/search-params";
import { NotesTable } from "@/components/notes/notes-table";
import { NotesViewTabs } from "@/components/notes/notes-view-tabs";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "All notes" };

export default async function AllNotesPage({ searchParams }: PageProps<"/admin/notes">) {
  const notes = await backend.notes.listAll(noteParams(await searchParams));
  const owners = await resolveUsers(notes.items.map((note) => note.owner));

  return (
    <>
      <PageHeader
        title="All notes"
        description={
          <span className="inline-flex items-center gap-1.5">
            <EyeIcon className="size-3.5" />
            Read-only view of every user&apos;s notes. Only owners can edit.
          </span>
        }
      />
      <NotesViewTabs />
      <NotesTable notes={notes} owners={owners} emptyMessage="No notes match these filters." />
    </>
  );
}
