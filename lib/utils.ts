export { cn } from "cn"

export function pickChanged<T extends object>(original: Partial<T>, next: T): Partial<T> {
  const changed: Partial<T> = {}
  for (const key of Object.keys(next) as (keyof T)[]) {
    if (JSON.stringify(original[key] ?? null) !== JSON.stringify(next[key] ?? null)) {
      changed[key] = next[key]
    }
  }
  return changed
}

export function emptyToUndefined<T extends Record<string, unknown>>(values: T): T {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== "" && value !== undefined)
  ) as T
}
