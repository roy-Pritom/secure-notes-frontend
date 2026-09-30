import type { Metadata } from "next";
import { backend } from "@/lib/api/server";
import { listParams, param } from "@/lib/search-params";
import { InterestsTable } from "@/components/admin/interests-table";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Interests" };

export default async function InterestsPage({ searchParams }: PageProps<"/admin/interests">) {
  const params = await searchParams;
  const { page, limit, sortOrder } = listParams(params);
  const groups = await backend.users.interests({
    page,
    limit,
    sortOrder,
    interest: param(params, "interest")?.toLowerCase(),
  });

  return (
    <>
      <PageHeader title="Interests" description="Users grouped by what they're into." />
      <InterestsTable groups={groups} />
    </>
  );
}
