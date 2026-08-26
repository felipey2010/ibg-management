import { siteConfig } from "@/config/site";
import { AppProviders } from "@/providers/app-providers";
import type { Metadata } from "next";
import { fraunces, ibmPlexMono, ibmPlexSans, inter, poppins } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: `Plataforma administrativa da ${siteConfig.name}.`,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${inter.className} ${fraunces.variable} ${fraunces.className} ${ibmPlexSans.className} ${ibmPlexSans.variable} ${poppins.variable} ${fraunces.variable} ${ibmPlexMono.variable} bg-background min-h-dvh antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
