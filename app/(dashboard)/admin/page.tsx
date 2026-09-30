import type { Metadata } from "next";
import Link from "next/link";
import { ArchiveIcon, ArrowRightIcon, FileTextIcon, ShieldCheckIcon, SparklesIcon, UsersIcon } from "lucide-react";
import { countAdmins } from "@/lib/api/admin";
import { backend } from "@/lib/api/server";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleBadges } from "@/components/shared/badges";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { UserCell } from "@/components/shared/user-avatar";

export const metadata: Metadata = { title: "Admin overview" };

export default async function AdminOverviewPage() {
  const [users, adminCount, notes, archived, interests] = await Promise.all([
    backend.users.list({ limit: 6 }),
    countAdmins(),
    backend.notes.listAll({ limit: 1 }),
    backend.notes.listAll({ limit: 1, archived: true }),
    backend.users.interests({ limit: 100 }),
  ]);

  const topInterests = [...interests.items].sort((a, b) => b.userCount - a.userCount).slice(0, 6);
  const maxCount = topInterests[0]?.userCount ?? 1;

  return (
    <>
      <PageHeader title="Overview" description="A snapshot of accounts and content across the platform." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Users" value={users.meta.total} hint={`${adminCount} admin${adminCount === 1 ? "" : "s"}`} icon={UsersIcon} />
        <StatCard label="Active notes" value={notes.meta.total} hint="Across every user" icon={FileTextIcon} />
        <StatCard label="Archived notes" value={archived.meta.total} icon={ArchiveIcon} />
        <StatCard label="Interests" value={interests.meta.total} hint="Distinct interest groups" icon={SparklesIcon} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Newest users</CardTitle>
            <CardDescription>Most recently registered accounts.</CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/users">View all<ArrowRightIcon /></Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-1">
            {users.items.map((user) => (
              <Link
                key={user.id}
                href={`/admin/users/${user.id}`}
                className="flex items-center justify-between gap-4 rounded-lg p-2 transition hover:bg-muted"
              >
                <UserCell name={user.fullName} email={user.email} src={user.avatarUrl} />
                <div className="flex shrink-0 items-center gap-3">
                  <RoleBadges roles={user.roles} />
                  <span className="hidden text-xs text-muted-foreground sm:inline">{formatDate(user.createdAt)}</span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top interests</CardTitle>
            <CardDescription>Interests shared by the most users.</CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/interests">View all<ArrowRightIcon /></Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-4">
            {topInterests.length === 0 && <p className="text-sm text-muted-foreground">No interests yet.</p>}
            {topInterests.map((group) => (
              <div key={group.interest} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">#{group.interest}</span>
                  <span className="text-muted-foreground tabular-nums">{group.userCount}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(group.userCount / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex items-center gap-3 text-sm text-muted-foreground">
          <ShieldCheckIcon className="size-4 shrink-0 text-primary" />
          Role and status changes revoke the target&apos;s sessions; they are signed out within 15 minutes.
        </CardContent>
      </Card>
    </>
  );
}
