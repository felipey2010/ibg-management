import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";

import { AppProviders } from "@/providers/app-providers";

import { siteConfig } from "@/config/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

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
      <body className={`${inter.variable} ${fraunces.variable} min-h-dvh antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
