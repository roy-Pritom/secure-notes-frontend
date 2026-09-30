"use client"

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"
import type { PaginationMeta } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUrlState } from "./url-state"

const PAGE_SIZES = [10, 20, 50, 100]

export function DataTablePagination({ meta }: { meta: PaginationMeta }) {
  const { setParams } = useUrlState()
  const totalPages = Math.max(meta.totalPages, 1)
  const goTo = (page: number) => setParams({ page: page > 1 ? page : null }, { resetPage: false })
  const from = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1
  const to = Math.min(meta.page * meta.limit, meta.total)

  return (
    <div className="flex flex-col-reverse items-center justify-between gap-3 text-sm sm:flex-row">
      <p className="text-muted-foreground">
        {meta.total === 0 ? "No rows" : `Showing ${from}–${to} of ${meta.total}`}
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Rows per page</span>
          <Select value={String(meta.limit)} onValueChange={(value) => setParams({ limit: value })}>
            <SelectTrigger size="sm" className="w-18">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="font-medium tabular-nums">
          Page {Math.min(meta.page, totalPages)} of {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon-sm" onClick={() => goTo(1)} disabled={!meta.hasPreviousPage} aria-label="First page">
            <ChevronsLeftIcon />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={() => goTo(meta.page - 1)} disabled={!meta.hasPreviousPage} aria-label="Previous page">
            <ChevronLeftIcon />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={() => goTo(meta.page + 1)} disabled={!meta.hasNextPage} aria-label="Next page">
            <ChevronRightIcon />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={() => goTo(totalPages)} disabled={!meta.hasNextPage} aria-label="Last page">
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
