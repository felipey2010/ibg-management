import { getChurchSettings } from "../services/church-settings.service";
import { ChurchSettingsProvider } from "./church-settings-provider";

export async function ChurchSettingsBoundary({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ChurchSettingsProvider initialResult={await getChurchSettings()}>{children}</ChurchSettingsProvider>
  );
}
