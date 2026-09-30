import type { Metadata } from "next";
import { CalendarIcon, ClockIcon, KeyRoundIcon } from "lucide-react";
import { backend } from "@/lib/api/server";
import { formatDate, formatDateTime } from "@/lib/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PasswordForm } from "@/components/profile/password-form";
import { ProfileForm } from "@/components/profile/profile-form";
import { RoleBadges, StatusBadge, TagList } from "@/components/shared/badges";
import { PageHeader } from "@/components/shared/page-header";
import { UserAvatar } from "@/components/shared/user-avatar";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await backend.profile.get();

  return (
    <>
      <PageHeader title="Profile" description="Manage your personal details and password." />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit">
          <CardContent className="flex flex-col items-center gap-4 text-center">
            <UserAvatar name={user.fullName} src={user.avatarUrl} className="size-20 text-lg" />
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">{user.fullName}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <RoleBadges roles={user.roles} />
              <StatusBadge status={user.status} />
            </div>
            {user.bio && <p className="text-sm text-muted-foreground">{user.bio}</p>}
            <TagList tags={user.interests} max={8} />
            <Separator />
            <dl className="w-full space-y-2 text-left text-sm">
              <Meta icon={CalendarIcon} label="Joined" value={formatDate(user.createdAt)} />
              <Meta icon={ClockIcon} label="Last login" value={formatDateTime(user.lastLoginAt)} />
              <Meta icon={KeyRoundIcon} label="Password changed" value={formatDate(user.passwordChangedAt)} />
            </dl>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal details</CardTitle>
              <CardDescription>Only fields you change are sent.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Change password</CardTitle>
              <CardDescription>This signs you out of every device, including this one.</CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function Meta({ icon: Icon, label, value }: { icon: typeof CalendarIcon; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
