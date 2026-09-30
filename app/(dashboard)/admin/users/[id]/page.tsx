import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { countAdmins } from "@/lib/api/admin";
import { fetchOr404 } from "@/lib/api/fetch-or-404";
import { backend } from "@/lib/api/server";
import { formatDate, formatDateTime } from "@/lib/format";
import { listParams } from "@/lib/search-params";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PostsTable } from "@/components/posts/posts-table";
import { RoleBadges, StatusBadge } from "@/components/shared/badges";
import { UserAvatar } from "@/components/shared/user-avatar";
import { DeleteUserButton } from "@/components/users/delete-user-button";
import { EditUserForm } from "@/components/users/edit-user-form";

export default async function UserDetailPage({ params, searchParams }: PageProps<"/admin/users/[id]">) {
  const { id } = await params;
  const user = await fetchOr404(id, backend.users.get);
  const [adminCount, posts] = await Promise.all([
    countAdmins(),
    backend.users.posts(id, listParams(await searchParams, 5)),
  ]);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/admin/users">
          <ArrowLeftIcon />
          All users
        </Link>
      </Button>

      <Card>
        <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <UserAvatar name={user.fullName} src={user.avatarUrl} className="size-16 text-lg" />
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{user.fullName}</h1>
              <RoleBadges roles={user.roles} />
              <StatusBadge status={user.status} />
            </div>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">
              Joined {formatDate(user.createdAt)} · Last login {formatDateTime(user.lastLoginAt)}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Only the fields you change are sent.</CardDescription>
          </CardHeader>
          <CardContent>
            <EditUserForm user={user} adminCount={adminCount} />
          </CardContent>
        </Card>

        <Card className="h-fit border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Danger zone</CardTitle>
            <CardDescription>
              Deleting removes the account along with all of its notes, posts and sessions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeleteUserButton user={user} adminCount={adminCount} redirectTo="/admin/users" />
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Posts</h2>
          <p className="text-sm text-muted-foreground">Everything {user.firstName} has written.</p>
        </div>
        <PostsTable posts={posts} />
      </section>
    </div>
  );
}
