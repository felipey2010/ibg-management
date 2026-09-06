"use client";

import { CircleHelp, ChevronsUpDown, LogOut, Settings, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { logout } from "@/features/auth/services/auth-client.service";
import { getInitials } from "@/lib/utils";

interface SidebarUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function SidebarUserMenu({ user }: Readonly<{ user: SidebarUser }>) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const displayName = user.name?.trim() || "Usuário";

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="sr-only">Menu do usuário</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                  />
                }
              >
                <Avatar className="size-8 rounded-md">
                  {user.image ? <AvatarImage src={user.image} alt="" /> : null}
                  <AvatarFallback className="rounded-md font-semibold">
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm font-semibold">{displayName}</span>
                  <span className="text-muted-foreground block truncate text-xs">{user.email}</span>
                </span>
                <ChevronsUpDown aria-hidden="true" className="ml-auto" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={8}
                className="min-w-56"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <span className="text-popover-foreground block truncate font-medium">{displayName}</span>
                    <span className="block truncate">{user.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href="/perfil" />}>
                    <UserRound aria-hidden="true" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/configuracoes" />}>
                    <Settings aria-hidden="true" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/suporte" />}>
                    <CircleHelp aria-hidden="true" />
                    Suporte
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" disabled={isLoggingOut} onClick={handleLogout}>
                    <LogOut aria-hidden="true" />
                    {isLoggingOut ? "Saindo..." : "Sair"}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
