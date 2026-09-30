"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { RefreshCwIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function HealthRefreshButton() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <Button variant="outline" onClick={() => startTransition(() => router.refresh())} disabled={pending}>
      <RefreshCwIcon className={cn(pending && "animate-spin")} />
      Re-check
    </Button>
  )
}
