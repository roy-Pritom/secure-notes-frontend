"use client"

import Link from "next/link"
import type { InterestGroup, Paginated } from "@/lib/api/types"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { columnHelper, DataTable, DataTableReset, DataTableSearch } from "@/components/data-table"
import { UserAvatar } from "@/components/shared/user-avatar"

const helper = columnHelper<InterestGroup>()
const MAX_AVATARS = 6

const columns = helper.columns([
  helper.accessor("interest", {
    header: "Interest",
    enableHiding: false,
    cell: ({ getValue }) => <Badge variant="secondary" className="text-sm">#{getValue()}</Badge>,
  }),
  helper.accessor("userCount", {
    header: "Users",
    cell: ({ getValue }) => <span className="font-medium tabular-nums">{getValue()}</span>,
  }),
  helper.accessor("users", {
    header: "Members",
    cell: ({ getValue }) => {
      const users = getValue()
      return (
        <div className="flex items-center -space-x-2">
          {users.slice(0, MAX_AVATARS).map((user) => (
            <Tooltip key={user.id}>
              <TooltipTrigger asChild>
                <Link href={`/admin/users/${user.id}`} className="rounded-full ring-2 ring-background transition hover:z-10 hover:scale-110">
                  <UserAvatar name={user.fullName} src={user.avatarUrl} />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                {user.fullName} · {user.email}
              </TooltipContent>
            </Tooltip>
          ))}
          {users.length > MAX_AVATARS && (
            <span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium ring-2 ring-background">
              +{users.length - MAX_AVATARS}
            </span>
          )}
        </div>
      )
    },
  }),
])

export function InterestsTable({ groups }: { groups: Paginated<InterestGroup> }) {
  return (
    <DataTable
      columns={columns}
      data={groups.items}
      meta={groups.meta}
      getRowId={(group) => group.interest}
      emptyMessage="No interests found."
      toolbar={
        <>
          <DataTableSearch paramKey="interest" placeholder="Exact interest, e.g. chess" maxLength={40} />
          <DataTableReset keys={["interest"]} />
        </>
      }
    />
  )
}
