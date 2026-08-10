"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Brand } from "@/components/layout/brand";
import { SidebarNavigation } from "@/components/layout/sidebar-navigation";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Abrir menu principal"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="border-border text-muted-foreground flex size-9 items-center justify-center rounded-md border lg:hidden"
      >
        <Menu aria-hidden="true" className="size-5" />
      </button>
      {isOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu principal"
            className="absolute inset-0 bg-black/55"
            onClick={() => setIsOpen(false)}
          />
          <aside className="border-sidebar-border bg-sidebar relative flex h-full w-[min(20rem,88vw)] flex-col border-r shadow-2xl">
            <div className="border-sidebar-border flex h-16 items-center justify-between border-b px-4">
              <Brand />
              <button
                type="button"
                aria-label="Fechar menu principal"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:bg-sidebar-accent flex size-9 items-center justify-center rounded-md"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-4 py-6">
              <SidebarNavigation onNavigate={() => setIsOpen(false)} />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
