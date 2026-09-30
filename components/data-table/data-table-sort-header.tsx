"use client"

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUrlState } from "./url-state"

export function DataTableSortHeader({ title }: { title: string }) {
  const { params, setParams } = useUrlState()
  const order = params.get("sortOrder") === "asc" ? "asc" : "desc"

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2 h-7 text-xs uppercase tracking-wide text-muted-foreground"
      onClick={() => setParams({ sortOrder: order === "desc" ? "asc" : null })}
    >
      {title}
      {order === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />}
    </Button>
  )
}
