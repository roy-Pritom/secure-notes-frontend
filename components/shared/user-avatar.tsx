import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { initials } from "@/lib/format"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  name: string
  src?: string | null
  className?: string
}

export function UserAvatar({ name, src, className }: UserAvatarProps) {
  return (
    <Avatar className={cn("size-8", className)}>
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  )
}

export function UserCell({ name, email, src }: { name: string; email: string; src?: string | null }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <UserAvatar name={name} src={src} />
      <div className="min-w-0">
        <div className="truncate font-medium">{name}</div>
        <div className="truncate text-xs text-muted-foreground">{email}</div>
      </div>
    </div>
  )
}
