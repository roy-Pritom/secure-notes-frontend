import type { Metadata } from "next";
import { PlusIcon } from "lucide-react";
import { backend } from "@/lib/api/server";
import { noteParams } from "@/lib/search-params";
import { Button } from "@/components/ui/button";
import { NoteFormDialog } from "@/components/notes/note-form-dialog";
import { NotesTable } from "@/components/notes/notes-table";
import { NotesViewTabs } from "@/components/notes/notes-view-tabs";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "My notes" };

export default async function NotesPage({ searchParams }: PageProps<"/notes">) {
  const query = noteParams(await searchParams);
  const notes = await backend.notes.list(query);

  return (
    <>
      <PageHeader
        title="My notes"
        description="Pinned notes always lead. Archived notes live in their own tab."
        actions={
          <NoteFormDialog
            trigger={
              <Button>
                <PlusIcon />
                New note
              </Button>
            }
          />
        }
      />
      <NotesViewTabs />
      <NotesTable
        notes={notes}
        emptyMessage={query.archived ? "Nothing archived yet." : "No notes yet — create your first one."}
      />
    </>
  );
}
