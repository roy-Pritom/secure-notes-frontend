"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronsUpDownIcon, LogOutIcon, UserRoundIcon } from "lucide-react"
import { authApi } from "@/lib/api/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { RoleBadges } from "@/components/shared/badges"
import { useSession } from "@/components/shared/session-provider"
import { UserAvatar } from "@/components/shared/user-avatar"

export function NavUser() {
  const user = useSession()
  const { isMobile } = useSidebar()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const signOut = async () => {
    await authApi.logout().catch(() => undefined)
    window.location.replace("/login")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
              <UserAvatar name={user.fullName} src={user.avatarUrl} className="rounded-lg" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.fullName}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="space-y-2 font-normal">
              <div className="flex items-center gap-2">
                <UserAvatar name={user.fullName} src={user.avatarUrl} className="rounded-lg" />
                <div className="grid text-sm leading-tight">
                  <span className="truncate font-medium">{user.fullName}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
              <RoleBadges roles={user.roles} />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <UserRoundIcon />
                  Profile
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => setConfirmOpen(true)}>
              <LogOutIcon />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Sign out everywhere?"
          description="Signing out revokes every session for your account, on all devices."
          confirmLabel="Sign out"
          destructive
          onConfirm={signOut}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
