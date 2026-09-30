"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react"
import type { User } from "@/lib/api/types"
import { formatDate, formatDateTime } from "@/lib/format"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { columnHelper, DataTableSortHeader, type DataTableColumn } from "@/components/data-table"
import { RoleBadges, StatusBadge, TagList } from "@/components/shared/badges"
import { useSession } from "@/components/shared/session-provider"
import { UserCell } from "@/components/shared/user-avatar"
import { DeleteUserDialog, deleteBlockReason } from "./delete-user-button"

const helper = columnHelper<User>()

function UserActions({ user, adminCount }: { user: User; adminCount: number }) {
  const session = useSession()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const blocked = deleteBlockReason(user, session.id, adminCount)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="User actions">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href={`/admin/users/${user.id}`}>
              <PencilIcon />
              View & edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" disabled={!!blocked} onSelect={() => setDeleteOpen(true)}>
            <Trash2Icon />
            {blocked ? "Can't delete" : "Delete"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {!blocked && (
        <DeleteUserDialog user={user} open={deleteOpen} onOpenChange={setDeleteOpen} />
      )}
    </>
  )
}

export function getUserColumns(adminCount: number): DataTableColumn<User>[] {
  return helper.columns([
    helper.accessor("fullName", {
      header: "User",
      enableHiding: false,
      cell: ({ row }) => (
        <Link href={`/admin/users/${row.original.id}`} className="hover:opacity-80">
          <UserCell name={row.original.fullName} email={row.original.email} src={row.original.avatarUrl} />
        </Link>
      ),
    }),
    helper.accessor("roles", { header: "Roles", cell: ({ getValue }) => <RoleBadges roles={getValue()} /> }),
    helper.accessor("status", { header: "Status", cell: ({ getValue }) => <StatusBadge status={getValue()} /> }),
    helper.accessor("interests", { header: "Interests", cell: ({ getValue }) => <TagList tags={getValue()} max={2} /> }),
    helper.accessor("lastLoginAt", {
      header: "Last login",
      cell: ({ getValue }) => <span className="whitespace-nowrap text-muted-foreground">{formatDateTime(getValue())}</span>,
    }),
    helper.accessor("createdAt", {
      header: () => <DataTableSortHeader title="Joined" />,
      cell: ({ getValue }) => <span className="whitespace-nowrap text-muted-foreground">{formatDate(getValue())}</span>,
    }),
    helper.display({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <UserActions user={row.original} adminCount={adminCount} />
        </div>
      ),
    }),
  ])
}
