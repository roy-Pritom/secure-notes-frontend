"use client"

import { useMemo } from "react"
import type { Paginated, User } from "@/lib/api/types"
import { DataTable, DataTableReset, DataTableSearch } from "@/components/data-table"
import { getUserColumns } from "./user-columns"

export function UsersTable({ users, adminCount }: { users: Paginated<User>; adminCount: number }) {
  const columns = useMemo(() => getUserColumns(adminCount), [adminCount])

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
          <DataTableReset keys={["search", "sortOrder"]} />
        </>
      }
    />
  )
}
