import "server-only";
import { redirect } from "next/navigation";
import { param, postParams, type SearchParams } from "@/lib/search-params";
import { fetchOr404 } from "./fetch-or-404";
import { backend } from "./server";
import type { UserPosts } from "./types";

interface LoadOptions {
  // Where to send a reader who paged past the end.
  pathname: string;
  limit?: number;
}

export interface LoadedUserPosts {
  posts: UserPosts;
  searchTerm?: string;
}

export async function loadUserPosts(
  id: string,
  searchParams: SearchParams,
  { pathname, limit }: LoadOptions,
): Promise<LoadedUserPosts> {
  const query = postParams(searchParams, limit);
  const posts = await fetchOr404(id, (authorId) => backend.users.posts(authorId, query));
  const { page, total, totalPages } = posts.meta;

  // A page past the end is a 200 with no items; land on the last real page instead.
  if (total > 0 && page > totalPages) {
    const next = new URLSearchParams();
    for (const key of Object.keys(searchParams)) {
      const value = param(searchParams, key);
      if (value && key !== "page") next.set(key, value);
    }
    if (totalPages > 1) next.set("page", String(totalPages));
    const qs = next.toString();
    redirect(qs ? `${pathname}?${qs}` : pathname);
  }

  // Drafts need no filtering here: the API only returns them to their author and
  // admins, and leaves them out of meta.total for everyone else.
  return { posts, searchTerm: query.searchTerm };
}
