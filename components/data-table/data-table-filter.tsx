"use client"

import type { LucideIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUrlState } from "./url-state"

export interface FilterOption {
  label: string
  value: string
  icon?: LucideIcon
}

interface DataTableFilterProps {
  paramKey: string
  label: string
  options: FilterOption[]
}

const ALL = "__all"

export function DataTableFilter({ paramKey, label, options }: DataTableFilterProps) {
  const { params, setParams } = useUrlState()
  const value = params.get(paramKey) ?? ALL

  return (
    <Select value={value} onValueChange={(next) => setParams({ [paramKey]: next === ALL ? null : next })}>
      <SelectTrigger className="w-auto min-w-36 border-dashed data-[active=true]:border-solid" data-active={value !== ALL}>
        <span className="text-muted-foreground">{label}:</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>All</SelectItem>
        <SelectSeparator />
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.icon && <option.icon />}
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
