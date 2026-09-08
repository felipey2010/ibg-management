import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChurchSettingsBoundary } from "@/features/church/components/church-settings-boundary";
import { getApiSession } from "@/lib/auth/api-session";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ProtectedLoading from "./loading";
import { SessionMonitor } from "@/features/auth/components/session-monitor";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getApiSession();

  if (!session || session.user.status !== "ACTIVE") {
    redirect("/login?error=session");
  }

  return (
    <>
      <SessionMonitor permissions={session.user.permissions} userId={session.user.id} />
      <Suspense fallback={<ProtectedLoading />}>
        <ChurchSettingsBoundary key={session.user.id}>
          <SidebarProvider>
            <AppSidebar user={session.user} />
            <SidebarInset>
              <AppHeader />
              <div className="px-4 py-8 sm:px-6 lg:px-8 lg:py-9">{children}</div>
            </SidebarInset>
          </SidebarProvider>
        </ChurchSettingsBoundary>
      </Suspense>
    </>
  );
}
