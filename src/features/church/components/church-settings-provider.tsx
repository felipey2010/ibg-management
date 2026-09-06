"use client";

import { createContext, useContext, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { reloadChurchSettings } from "../actions";
import type { ChurchSettings, ChurchSettingsResult } from "../church-settings.types";

const ChurchSettingsContext = createContext<{
  settings: ChurchSettings;
  canEdit: boolean;
  setSettings: (settings: ChurchSettings) => void;
} | null>(null);

export function ChurchSettingsProvider({
  initialResult,
  children,
}: Readonly<{
  initialResult: ChurchSettingsResult;
  children: React.ReactNode;
}>) {
  const [result, setResult] = useState(initialResult);
  const [pending, startTransition] = useTransition();

  if (!result.ok)
    return (
      <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-4 p-6">
        <h1 className="font-serif text-2xl font-semibold">Configurações da igreja</h1>
        <p role="alert">{result.message}</p>
        {result.status === 401 ? (
          <a href="/login?error=session" className="underline">
            Entrar novamente
          </a>
        ) : (
          <Button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                try {
                  setResult(await reloadChurchSettings());
                } catch {
                  /* Keep the current error and allow another attempt. */
                }
              })
            }
          >
            {pending ? "Carregando…" : "Tentar novamente"}
          </Button>
        )}
      </main>
    );

  return (
    <ChurchSettingsContext.Provider
      value={{
        settings: result.settings,
        canEdit: result.canEdit,
        setSettings: (settings) => setResult({ ...result, settings }),
      }}
    >
      {children}
    </ChurchSettingsContext.Provider>
  );
}

export function useChurchSettings() {
  const context = useContext(ChurchSettingsContext);
  if (!context) throw new Error("useChurchSettings requires ChurchSettingsProvider");
  return context;
}
