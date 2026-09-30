import type { Metadata } from "next";
import Link from "next/link";
import { UserPlusIcon } from "lucide-react";
import { countAdmins } from "@/lib/api/admin";
import { backend } from "@/lib/api/server";
import { listParams } from "@/lib/search-params";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { UsersTable } from "@/components/users/users-table";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage({ searchParams }: PageProps<"/admin/users">) {
  const query = listParams(await searchParams);
  const [users, adminCount] = await Promise.all([backend.users.list(query), countAdmins()]);

  return (
    <>
      <PageHeader
        title="Users"
        description="Create, edit, suspend and remove accounts."
        actions={
          <Button asChild>
            <Link href="/admin/users/new">
              <UserPlusIcon />
              New user
            </Link>
          </Button>
        }
      />
      <UsersTable users={users} adminCount={adminCount} />
    </>
  );
}
