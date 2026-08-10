import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { getSession } from "@/features/auth/services/auth-server.service";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();

  if (!session || session.user.status !== "ACTIVE") {
    redirect("/login?error=session");
  }

  return (
    <div className="bg-background min-h-dvh">
      <AppSidebar />
      <AppHeader />
      <main className="px-4 py-8 sm:px-6 lg:ml-64 lg:px-8 lg:py-9">{children}</main>
    </div>
  );
}
