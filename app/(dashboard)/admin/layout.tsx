import { requireAdmin } from "@/lib/auth/session";

export default async function AdminLayout({ children }: LayoutProps<"/">) {
  await requireAdmin();
  return children;
}
