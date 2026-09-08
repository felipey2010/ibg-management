import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { SidebarNavigation } from "./sidebar-navigation";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("@/components/ui/sidebar", () => {
  const Container = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  return {
    SidebarGroup: Container,
    SidebarGroupContent: Container,
    SidebarGroupLabel: Container,
    SidebarMenu: Container,
    SidebarMenuBadge: Container,
    SidebarMenuButton: Container,
    SidebarMenuItem: Container,
    useSidebar: () => ({ isMobile: false, setOpenMobile: vi.fn() }),
  };
});

describe("settings navigation permissions", () => {
  afterEach(cleanup);
  it("hides the menu without permission", () => {
    render(<SidebarNavigation permissions={[]} />);
    expect(screen.queryByText("Configurações da igreja")).not.toBeInTheDocument();
  });
  it.each([["church.settings.update"], ["*"]])("shows the menu for %s", (permission) => {
    render(<SidebarNavigation permissions={[permission]} />);
    expect(screen.getByText("Configurações da igreja")).toBeInTheDocument();
  });

  it("shows user and access management only to system administrators", () => {
    const { rerender } = render(<SidebarNavigation permissions={["church.settings.update"]} />);
    expect(screen.queryByText("Usuários")).not.toBeInTheDocument();
    expect(screen.queryByText("Perfis e permissões")).not.toBeInTheDocument();

    rerender(<SidebarNavigation permissions={["*"]} />);
    expect(screen.getByText("Usuários")).toBeInTheDocument();
    expect(screen.getByText("Perfis e permissões")).toBeInTheDocument();
  });
});
