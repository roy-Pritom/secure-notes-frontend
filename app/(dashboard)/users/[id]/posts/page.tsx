import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { loadUserPosts } from "@/lib/api/user-posts";
import { Button } from "@/components/ui/button";
import { AuthorHeader } from "@/components/posts/author-header";
import { PostFormDialog } from "@/components/posts/post-form-dialog";
import { PostsTable } from "@/components/posts/posts-table";

export const metadata: Metadata = { title: "Posts" };

// Any signed-in user can read anyone's posts; GET /users/:id/posts has no role guard.
export default async function UserPostsPage({ params, searchParams }: PageProps<"/users/[id]/posts">) {
  const { id } = await params;
  const viewer = await requireUser();
  const { posts, searchTerm, canSeeDrafts } = await loadUserPosts(id, await searchParams, {
    viewer,
    pathname: `/users/${id}/posts`,
  });
  const isAuthor = viewer.id === posts.author.id;

  return (
    <>
      {viewer.roles.includes("admin") && (
        <Button variant="ghost" size="sm" asChild className="-ml-2 self-start">
          <Link href="/admin/posts">
            <ArrowLeftIcon />
            All authors
          </Link>
        </Button>
      )}
      <AuthorHeader
        author={posts.author}
        total={canSeeDrafts ? posts.meta.total : undefined}
        filtered={Boolean(searchTerm)}
        actions={isAuthor && <PostFormDialog />}
      />
      <PostsTable
        posts={posts}
        searchTerm={searchTerm}
        emptyMessage={isAuthor ? "You haven't written anything yet." : "This author hasn't published anything yet."}
      />
    </>
  );
}
