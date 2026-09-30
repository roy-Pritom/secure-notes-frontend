"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { errorMessage } from "@/lib/api/errors"

interface ActionOptions {
  success?: string
  refresh?: boolean
  onError?: (error: unknown) => void
}

export function useApiAction() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const run = useCallback(
    async <T,>(action: () => Promise<T>, { success, refresh = true, onError }: ActionOptions = {}) => {
      setPending(true)
      try {
        const result = await action()
        if (success) toast.success(success)
        if (refresh) router.refresh()
        return { ok: true as const, result }
      } catch (error) {
        if (onError) onError(error)
        else toast.error(errorMessage(error))
        return { ok: false as const, error }
      } finally {
        setPending(false)
      }
    },
    [router]
  )

  return { run, pending }
}
