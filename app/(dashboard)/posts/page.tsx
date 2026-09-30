import type { Metadata } from "next";
import { backend } from "@/lib/api/server";
import { requireUser } from "@/lib/auth/session";
import { listParams } from "@/lib/search-params";
import { PostFormDialog } from "@/components/posts/post-form-dialog";
import { PostsTable } from "@/components/posts/posts-table";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "My posts" };

export default async function PostsPage({ searchParams }: PageProps<"/posts">) {
  const user = await requireUser();
  const posts = await backend.users.posts(user.id, listParams(await searchParams));

  return (
    <>
      <PageHeader
        title="My posts"
        description="Public write-ups visible to any signed-in user."
        actions={<PostFormDialog />}
      />
      <PostsTable posts={posts} />
    </>
  );
}
