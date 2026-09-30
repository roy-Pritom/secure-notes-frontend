"use client"

import type { ReactNode } from "react"
import { useTable, type RowData } from "@tanstack/react-table"
import { InboxIcon } from "lucide-react"
import type { PaginationMeta } from "@/lib/api/types"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableViewOptions } from "./data-table-view-options"
import { dataTableFeatures, type DataTableColumn } from "./features"
import { UrlStateProvider, useUrlState } from "./url-state"

interface DataTableProps<TData extends RowData> {
  columns: DataTableColumn<TData>[]
  data: TData[]
  meta?: PaginationMeta
  toolbar?: ReactNode
  emptyMessage?: string
  getRowId?: (row: TData) => string
}

export function DataTable<TData extends RowData>(props: DataTableProps<TData>) {
  return (
    <UrlStateProvider>
      <DataTableInner {...props} />
    </UrlStateProvider>
  )
}

function DataTableInner<TData extends RowData>({
  columns,
  data,
  meta,
  toolbar,
  emptyMessage = "No results.",
  getRowId,
}: DataTableProps<TData>) {
  const { isPending } = useUrlState()
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    getRowId: getRowId ? (row) => getRowId(row) : undefined,
  })

  const rows = table.getRowModel().rows

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {toolbar}
        <DataTableViewOptions table={table} />
      </div>

      <div className="relative overflow-hidden rounded-xl border bg-card">
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-0.5 origin-left bg-primary transition-opacity",
            isPending ? "animate-pulse opacity-100" : "opacity-0"
          )}
        />
        <Table className={cn("transition-opacity", isPending && "opacity-60")}>
          <TableHeader className="bg-muted/40">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="hover:bg-transparent">
                {group.headers.map((header) => (
                  <TableHead key={header.id} className="h-10 px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3 py-2.5">
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={table.getVisibleLeafColumns().length} className="h-40">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <InboxIcon className="size-8 opacity-50" />
                    <span className="text-sm">{emptyMessage}</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {meta && <DataTablePagination meta={meta} />}
    </div>
  )
}
