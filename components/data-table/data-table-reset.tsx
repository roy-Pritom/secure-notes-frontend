"use client"

import { XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUrlState } from "./url-state"

export function DataTableReset({ keys }: { keys: string[] }) {
  const { params, setParams } = useUrlState()
  if (!keys.some((key) => params.has(key))) return null

  return (
    <Button variant="ghost" onClick={() => setParams(Object.fromEntries(keys.map((key) => [key, null])))}>
      Reset
      <XIcon />
    </Button>
  )
}
