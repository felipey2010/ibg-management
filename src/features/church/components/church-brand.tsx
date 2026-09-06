"use client";

import { Brand } from "@/components/layout/brand";
import { useChurchSettings } from "./church-settings-provider";

export function ChurchBrand() {
  const { settings } = useChurchSettings();
  return <Brand name={settings.name} />;
}
