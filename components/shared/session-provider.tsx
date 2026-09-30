"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { SessionUser } from "@/lib/api/types"

const SessionContext = createContext<SessionUser | null>(null)

export function SessionProvider({ user, children }: { user: SessionUser; children: ReactNode }) {
  return <SessionContext.Provider value={user}>{children}</SessionContext.Provider>
}

export function useSession(): SessionUser {
  const user = useContext(SessionContext)
  if (!user) throw new Error("useSession must be used inside <SessionProvider>")
  return user
}

export function useIsAdmin(): boolean {
  return useSession().roles.includes("admin")
}
