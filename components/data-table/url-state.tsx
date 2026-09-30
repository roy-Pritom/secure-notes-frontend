"use client"

import { createContext, useCallback, useContext, useTransition, type ReactNode } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type ParamValue = string | number | boolean | null | undefined

interface UrlState {
  params: URLSearchParams
  isPending: boolean
  setParams: (updates: Record<string, ParamValue>, options?: { resetPage?: boolean }) => void
}

const UrlStateContext = createContext<UrlState | null>(null)

export function UrlStateProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const setParams = useCallback<UrlState["setParams"]>(
    (updates, { resetPage = true } = {}) => {
      const next = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === "") next.delete(key)
        else next.set(key, String(value))
      }
      if (resetPage && !("page" in updates)) next.delete("page")
      const query = next.toString()
      startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }))
    },
    [pathname, router, searchParams]
  )

  return (
    <UrlStateContext.Provider value={{ params: new URLSearchParams(searchParams.toString()), isPending, setParams }}>
      {children}
    </UrlStateContext.Provider>
  )
}

export function useUrlState(): UrlState {
  const context = useContext(UrlStateContext)
  if (!context) throw new Error("useUrlState must be used inside <UrlStateProvider>")
  return context
}
