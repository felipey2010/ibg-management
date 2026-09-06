import { ChurchBrand } from "@/features/church/components/church-brand";
import { SidebarNavigation } from "@/components/layout/sidebar-navigation";
import { SidebarUserMenu } from "@/components/layout/sidebar-user-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

interface SidebarUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function AppSidebar({ user }: Readonly<{ user: SidebarUser }>) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-border h-16 justify-center border-b px-3">
        <ChurchBrand />
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarNavigation />
      </SidebarContent>
      <SidebarSeparator className="mx-0" />
      <SidebarFooter>
        <SidebarUserMenu user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
