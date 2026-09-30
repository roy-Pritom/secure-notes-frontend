"use client"

import { EyeIcon } from "lucide-react"
import type { AuthoredPost, UserPosts } from "@/lib/api/types"
import { formatDate, formatDateTime } from "@/lib/format"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { columnHelper, DataTable, DataTableReset, DataTableSearch, DataTableSortHeader } from "@/components/data-table"
import { StatusBadge, TagList } from "@/components/shared/badges"

const helper = columnHelper<AuthoredPost>()

const columns = helper.columns([
  helper.accessor("title", {
    header: "Title",
    enableHiding: false,
    cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
  }),
  helper.accessor("excerpt", {
    header: "Excerpt",
    cell: ({ getValue }) => <p className="line-clamp-1 max-w-md text-muted-foreground">{getValue()}</p>,
  }),
  helper.accessor("tags", { header: "Tags", cell: ({ getValue }) => <TagList tags={getValue()} /> }),
  helper.accessor("status", { header: "Status", cell: ({ getValue }) => <StatusBadge status={getValue()} /> }),
  helper.accessor("createdAt", {
    header: () => <DataTableSortHeader title="Created" />,
    cell: ({ getValue }) => <span className="whitespace-nowrap text-muted-foreground">{formatDate(getValue())}</span>,
  }),
  helper.display({
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <PostSheet post={row.original} />
      </div>
    ),
  }),
])

function PostSheet({ post }: { post: AuthoredPost }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="View post">
          <EyeIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="text-xl">{post.title}</SheetTitle>
          <SheetDescription>
            {post.publishedAt ? `Published ${formatDateTime(post.publishedAt)}` : "Draft — not published"}
          </SheetDescription>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <StatusBadge status={post.status} />
            <TagList tags={post.tags} max={10} />
          </div>
        </SheetHeader>
        <div className="px-4 pb-6 leading-relaxed whitespace-pre-wrap break-words">{post.body}</div>
      </SheetContent>
    </Sheet>
  )
}

export function PostsTable({ posts }: { posts: UserPosts }) {
  return (
    <DataTable
      columns={columns}
      data={posts.items}
      meta={posts.meta}
      getRowId={(post) => post.id}
      emptyMessage="No posts yet."
      toolbar={
        <>
          <DataTableSearch placeholder="Search posts…" />
          <DataTableReset keys={["search", "sortOrder"]} />
        </>
      }
    />
  )
}
