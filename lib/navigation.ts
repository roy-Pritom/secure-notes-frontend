import {
  FileTextIcon,
  HeartPulseIcon,
  LayoutDashboardIcon,
  NewspaperIcon,
  NotebookPenIcon,
  SparklesIcon,
  UserRoundIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/lib/api/types";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  label: string;
  roles: UserRole[];
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Workspace",
    roles: ["user", "admin"],
    items: [
      { title: "My notes", href: "/notes", icon: NotebookPenIcon },
      { title: "My posts", href: "/posts", icon: NewspaperIcon },
      { title: "Profile", href: "/profile", icon: UserRoundIcon },
    ],
  },
  {
    label: "Administration",
    roles: ["admin"],
    items: [
      { title: "Overview", href: "/admin", icon: LayoutDashboardIcon },
      { title: "Users", href: "/admin/users", icon: UsersIcon },
      { title: "All notes", href: "/admin/notes", icon: FileTextIcon },
      { title: "Interests", href: "/admin/interests", icon: SparklesIcon },
      { title: "System health", href: "/admin/health", icon: HeartPulseIcon },
    ],
  },
];

export function navFor(roles: UserRole[]): NavSection[] {
  return NAV_SECTIONS.filter((section) => section.roles.some((role) => roles.includes(role)));
}
