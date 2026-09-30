import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { HealthBanner } from "@/components/shared/health-banner";
import { SessionProvider } from "@/components/shared/session-provider";
import { requireUser } from "@/lib/auth/session";

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const user = await requireUser();

  return (
    <SessionProvider user={user}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <HealthBanner />
          <AppHeader />
          <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
