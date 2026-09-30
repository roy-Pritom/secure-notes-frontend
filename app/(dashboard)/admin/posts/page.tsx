import type { Metadata } from "next";
import { backend } from "@/lib/api/server";
import { listParams } from "@/lib/search-params";
import { AuthorsTable } from "@/components/posts/authors-table";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Posts" };

// The API has no global feed (no GET /posts) — posts are only readable per author,
// so this page picks an author and hands off to /users/[id]/posts.
export default async function AdminPostsPage({ searchParams }: PageProps<"/admin/posts">) {
  const users = await backend.users.list(listParams(await searchParams));

  return (
    <>
      <PageHeader
        title="Posts"
        description="Pick an author to read everything they've written, drafts included."
      />
      <AuthorsTable users={users} />
    </>
  );
}
