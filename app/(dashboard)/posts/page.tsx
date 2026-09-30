import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import { loadUserPosts } from "@/lib/api/user-posts";
import { requireUser } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { PostFormDialog } from "@/components/posts/post-form-dialog";
import { PostsTable } from "@/components/posts/posts-table";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "My posts" };

export default async function PostsPage({ searchParams }: PageProps<"/posts">) {
  const user = await requireUser();
  const { posts, searchTerm } = await loadUserPosts(user.id, await searchParams, {
    pathname: "/posts",
  });

  return (
    <>
      <PageHeader
        title="My posts"
        description="Public write-ups visible to any signed-in user."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href={`/users/${user.id}/posts`}>
                <ExternalLinkIcon />
                Public page
              </Link>
            </Button>
            <PostFormDialog />
          </>
        }
      />
      <PostsTable posts={posts} searchTerm={searchTerm} emptyMessage="No posts yet — write your first one." />
    </>
  );
}
