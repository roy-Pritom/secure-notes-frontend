import Link from "next/link";
import { ShieldAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { homeFor } from "@/lib/auth/constants";
import { requireUser } from "@/lib/auth/session";

export const metadata = { title: "Access denied" };

export default async function ForbiddenPage() {
  const user = await requireUser();

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="rounded-2xl bg-destructive/10 p-4 text-destructive">
        <ShieldAlertIcon className="size-10" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-destructive">403 · Forbidden</p>
        <h1 className="text-3xl font-semibold tracking-tight">You don&apos;t have access to this area</h1>
        <p className="max-w-md text-muted-foreground">
          This section is restricted to administrators. If you think this is a mistake, ask an admin to update your role.
        </p>
      </div>
      <Button asChild size="lg">
        <Link href={homeFor(user.roles)}>Back to my workspace</Link>
      </Button>
    </main>
  );
}
