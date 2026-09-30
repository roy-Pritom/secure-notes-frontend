"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Trash2Icon } from "lucide-react"
import { client } from "@/lib/api/client"
import type { User } from "@/lib/api/types"
import { useApiAction } from "@/hooks/use-api-action"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { useSession } from "@/components/shared/session-provider"

// The API guards neither case, so the UI must.
export function deleteBlockReason(user: User, currentUserId: string, adminCount: number): string | null {
  if (user.id === currentUserId) return "You can't delete your own account."
  if (user.roles.includes("admin") && adminCount <= 1) return "This is the last remaining admin."
  return null
}

interface DeleteUserDialogProps {
  user: User
  redirectTo?: string
  trigger?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DeleteUserDialog({ user, redirectTo, trigger, open, onOpenChange }: DeleteUserDialogProps) {
  const router = useRouter()
  const { run } = useApiAction()

  const remove = () =>
    run(() => client.users.remove(user.id), { success: `${user.fullName} deleted`, refresh: !redirectTo }).then(
      ({ ok }) => ok && redirectTo && router.replace(redirectTo)
    )

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      trigger={trigger}
      title={`Delete ${user.fullName}?`}
      description={
        <>
          <p>This removes the account and cascades to everything it owns:</p>
          <ul className="list-disc pl-5">
            <li>all of their notes</li>
            <li>all of their posts</li>
            <li>every active session</li>
          </ul>
          <p>The email address becomes free to register again.</p>
        </>
      }
      confirmLabel="Delete user"
      destructive
      onConfirm={remove}
    />
  )
}

export function DeleteUserButton({ user, adminCount, redirectTo }: { user: User; adminCount: number; redirectTo?: string }) {
  const session = useSession()
  const blocked = deleteBlockReason(user, session.id, adminCount)
  const button = (
    <Button variant="destructive" disabled={!!blocked}>
      <Trash2Icon />
      Delete user
    </Button>
  )

  if (blocked) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0} className="inline-flex">{button}</span>
        </TooltipTrigger>
        <TooltipContent>{blocked}</TooltipContent>
      </Tooltip>
    )
  }
  return <DeleteUserDialog user={user} redirectTo={redirectTo} trigger={button} />
}
