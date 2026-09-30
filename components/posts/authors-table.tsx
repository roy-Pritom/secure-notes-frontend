"use client"

import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import type { Paginated, User } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import { columnHelper, DataTable, DataTableReset, DataTableSearch } from "@/components/data-table"
import { StatusBadge } from "@/components/shared/badges"
import { UserCell } from "@/components/shared/user-avatar"

const helper = columnHelper<User>()

const columns = helper.columns([
  helper.accessor("fullName", {
    header: "Author",
    enableHiding: false,
    cell: ({ row }) => (
      <Link href={`/users/${row.original.id}/posts`} className="hover:opacity-80">
        <UserCell name={row.original.fullName} email={row.original.email} src={row.original.avatarUrl} />
      </Link>
    ),
  }),
  helper.accessor("status", { header: "Status", cell: ({ getValue }) => <StatusBadge status={getValue()} /> }),
  helper.display({
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/users/${row.original.id}/posts`}>
            View posts
            <ArrowRightIcon />
          </Link>
        </Button>
      </div>
    ),
  }),
])

export function AuthorsTable({ users }: { users: Paginated<User> }) {
  return (
    <DataTable
      columns={columns}
      data={users.items}
      meta={users.meta}
      getRowId={(user) => user.id}
      emptyMessage="No users match your search."
      toolbar={
        <>
          <DataTableSearch placeholder="Search name, email or bio…" />
          <DataTableReset keys={["search"]} />
        </>
      }
    />
  )
}
