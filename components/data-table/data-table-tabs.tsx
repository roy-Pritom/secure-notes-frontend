"use client"

import type { LucideIcon } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UrlStateProvider, useUrlState } from "./url-state"

interface TabOption {
  label: string
  value: string
  icon?: LucideIcon
}

interface DataTableTabsProps {
  paramKey: string
  options: TabOption[]
}

export function DataTableTabs(props: DataTableTabsProps) {
  return (
    <UrlStateProvider>
      <TabsInner {...props} />
    </UrlStateProvider>
  )
}

function TabsInner({ paramKey, options }: DataTableTabsProps) {
  const { params, setParams } = useUrlState()
  const defaultValue = options[0]?.value
  const value = params.get(paramKey) ?? defaultValue

  return (
    <Tabs value={value} onValueChange={(next) => setParams({ [paramKey]: next === defaultValue ? null : next })}>
      <TabsList>
        {options.map((option) => (
          <TabsTrigger key={option.value} value={option.value}>
            {option.icon && <option.icon />}
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
