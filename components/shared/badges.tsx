import { ShieldCheckIcon, UserIcon } from "lucide-react"
import type { NoteColor, PostStatus, UserRole, UserStatus } from "@/lib/api/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function RoleBadges({ roles }: { roles: UserRole[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {roles.map((role) =>
        role === "admin" ? (
          <Badge key={role} className="bg-violet-500/15 text-violet-700 dark:text-violet-300">
            <ShieldCheckIcon />
            Admin
          </Badge>
        ) : (
          <Badge key={role} variant="secondary">
            <UserIcon />
            User
          </Badge>
        )
      )}
    </div>
  )
}

export function StatusBadge({ status }: { status: UserStatus | PostStatus }) {
  const positive = status === "active" || status === "published"
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        positive ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"
      )}
    >
      <span className={cn("size-1.5 rounded-full", positive ? "bg-emerald-500" : "bg-amber-500")} />
      {status}
    </Badge>
  )
}

export function TagList({ tags, max = 3 }: { tags: string[]; max?: number }) {
  if (!tags.length) return <span className="text-muted-foreground">—</span>
  const rest = tags.length - max
  return (
    <div className="flex flex-wrap gap-1">
      {tags.slice(0, max).map((tag) => (
        <Badge key={tag} variant="outline" className="font-normal">
          #{tag}
        </Badge>
      ))}
      {rest > 0 && <Badge variant="secondary">+{rest}</Badge>}
    </div>
  )
}

export const NOTE_COLOR_CLASS: Record<NoteColor, string> = {
  default: "bg-muted-foreground/40",
  red: "bg-red-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-400",
  green: "bg-emerald-500",
  blue: "bg-blue-500",
  purple: "bg-violet-500",
}

export function ColorDot({ color, className }: { color: NoteColor; className?: string }) {
  return <span className={cn("inline-block size-2.5 shrink-0 rounded-full", NOTE_COLOR_CLASS[color], className)} />
}
