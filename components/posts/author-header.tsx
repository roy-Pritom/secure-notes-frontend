import type { ReactNode } from "react"
import type { PostAuthor } from "@/lib/api/types"
import { Card, CardContent } from "@/components/ui/card"
import { UserAvatar } from "@/components/shared/user-avatar"

interface AuthorHeaderProps {
  author: PostAuthor
  total?: number
  filtered?: boolean
  actions?: ReactNode
}

export function AuthorHeader({ author, total, filtered, actions }: AuthorHeaderProps) {
  const noun = total === 1 ? "post" : "posts"

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <UserAvatar name={author.fullName} src={author.avatarUrl} className="size-14 text-lg" />
        <div className="min-w-0 flex-1 space-y-1">
          <h1 className="truncate text-2xl font-semibold tracking-tight">{author.fullName}</h1>
          <p className="truncate text-sm text-muted-foreground">{author.email}</p>
          {total !== undefined && (
            <p className="text-sm text-muted-foreground">
              {/* With a search active, meta.total counts matches, not everything written. */}
              {filtered ? `${total} matching ${noun}` : `${total} ${noun}`}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </CardContent>
    </Card>
  )
}
