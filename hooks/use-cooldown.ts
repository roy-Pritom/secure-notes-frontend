"use client"

import { useEffect, useState } from "react"

export function useCooldown() {
  const [until, setUntil] = useState(0)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (until <= now) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [until, now])

  const remaining = Math.max(0, Math.ceil((until - now) / 1000))

  return {
    remaining,
    active: remaining > 0,
    start: (seconds = 60) => {
      setNow(Date.now())
      setUntil(Date.now() + seconds * 1000)
    },
  }
}
