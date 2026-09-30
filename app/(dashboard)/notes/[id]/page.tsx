import Link from "next/link";
import { ArchiveIcon, ArrowLeftIcon, CalendarIcon, EyeIcon, PinIcon } from "lucide-react";
import { fetchOr404 } from "@/lib/api/fetch-or-404";
import { backend } from "@/lib/api/server";
import type { User } from "@/lib/api/types";
import { requireUser } from "@/lib/auth/session";
import { formatDateTime } from "@/lib/format";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NoteActions } from "@/components/notes/note-actions";
import { ColorDot, TagList } from "@/components/shared/badges";
import { UserCell } from "@/components/shared/user-avatar";

export default async function NotePage({ params }: PageProps<"/notes/[id]">) {
  const { id } = await params;
  const [user, note] = await Promise.all([requireUser(), fetchOr404(id, backend.notes.get)]);
  const isOwner = note.owner === user.id;
  const owner: User | null = isOwner ? null : await backend.users.get(note.owner).catch(() => null);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href={isOwner ? "/notes" : "/admin/notes"}>
          <ArrowLeftIcon />
          Back
        </Link>
      </Button>

      {!isOwner && (
        <Alert>
          <EyeIcon />
          <AlertTitle>Read-only</AlertTitle>
          <AlertDescription>
            Admins can view everyone&apos;s notes, but only the owner can edit or delete them.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <ColorDot color={note.color} className="size-3" />
              <h1 className="text-2xl font-semibold tracking-tight break-words">{note.title}</h1>
            </div>
            <NoteActions note={note} canEdit={isOwner} redirectOnDelete="/notes" />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {note.isPinned && (
              <Badge variant="outline"><PinIcon className="fill-current text-amber-500" />Pinned</Badge>
            )}
            {note.isArchived && (
              <Badge variant="outline"><ArchiveIcon />Archived</Badge>
            )}
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="size-3.5" />
              Created {formatDateTime(note.createdAt)} · Updated {formatDateTime(note.updatedAt)}
            </span>
          </div>
          <TagList tags={note.tags} max={10} />
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted/40 p-5 leading-relaxed whitespace-pre-wrap break-words">{note.content}</div>
        </CardContent>
      </Card>

      {owner && (
        <Card>
          <CardContent className="flex items-center justify-between gap-4">
            <UserCell name={owner.fullName} email={owner.email} src={owner.avatarUrl} />
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/users/${owner.id}`}>View owner</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
