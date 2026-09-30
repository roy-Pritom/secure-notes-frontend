"use client"

import { useEffect, useState } from "react"
import { WifiOffIcon } from "lucide-react"

const INTERVAL = 30_000

export function HealthBanner() {
  const [down, setDown] = useState(false)

  useEffect(() => {
    let active = true
    const check = () =>
      fetch("/api/health", { cache: "no-store" })
        .then((response) => active && setDown(!response.ok))
        .catch(() => active && setDown(true))
    check()
    const timer = setInterval(check, INTERVAL)
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [])

  if (!down) return null
  return (
    <div className="flex items-center justify-center gap-2 bg-destructive px-4 py-2 text-sm text-white">
      <WifiOffIcon className="size-4" />
      The API is unreachable. Changes may fail until it is back.
    </div>
  )
}
