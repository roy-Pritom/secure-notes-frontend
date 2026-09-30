"use client"

import { useEffect, useState } from "react"
import { SearchIcon, XIcon } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"
import { useUrlState } from "./url-state"

interface DataTableSearchProps {
  paramKey?: string
  placeholder?: string
  maxLength?: number
  className?: string
}

export function DataTableSearch({
  paramKey = "search",
  placeholder = "Search…",
  maxLength = 100,
  className,
}: DataTableSearchProps) {
  const { params, setParams } = useUrlState()
  const current = params.get(paramKey) ?? ""
  const [value, setValue] = useState(current)
  const [synced, setSynced] = useState(current)

  if (current !== synced) {
    setSynced(current)
    setValue(current)
  }

  useEffect(() => {
    if (value.trim() === current) return
    const timer = setTimeout(() => setParams({ [paramKey]: value.trim() }), 400)
    return () => clearTimeout(timer)
  }, [value, current, paramKey, setParams])

  return (
    <InputGroup className={cn("w-full sm:w-72", className)}>
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(event) => setValue(event.target.value)}
      />
      {value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Clear search" onClick={() => setValue("")}>
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}
