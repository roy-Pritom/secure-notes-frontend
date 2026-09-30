"use client"

import { useState, type KeyboardEvent } from "react"
import { XIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TagInputProps {
  id?: string
  value: string[]
  onChange: (value: string[]) => void
  onBlur?: () => void
  placeholder?: string
  max?: number
  invalid?: boolean
  disabled?: boolean
}

export function TagInput({
  id,
  value,
  onChange,
  onBlur,
  placeholder = "Type and press Enter",
  max,
  invalid,
  disabled,
}: TagInputProps) {
  const [draft, setDraft] = useState("")
  const full = max !== undefined && value.length >= max

  const commit = () => {
    const tag = draft.trim().toLowerCase()
    if (tag && !value.includes(tag) && !full) onChange([...value, tag])
    setDraft("")
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      commit()
    } else if (event.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div
      aria-invalid={invalid}
      className={cn(
        "flex min-h-8 w-full flex-wrap items-center gap-1.5 rounded-lg border border-input bg-transparent px-2 py-1 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      {value.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1 pr-1">
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            className="rounded-full opacity-60 hover:opacity-100"
            onClick={() => onChange(value.filter((t) => t !== tag))}
          >
            <XIcon className="size-3" />
          </button>
        </Badge>
      ))}
      <input
        id={id}
        value={draft}
        disabled={disabled || full}
        placeholder={full ? `Limit of ${max} reached` : placeholder}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => {
          commit()
          onBlur?.()
        }}
        className="min-w-28 flex-1 bg-transparent py-0.5 outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}
