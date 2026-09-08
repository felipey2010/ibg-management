import { SessionRenewal } from "@/features/auth/components/session-renewal";

export default async function RenewSessionPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ redirectTo?: string }>;
}>) {
  const { redirectTo } = await searchParams;

  return <SessionRenewal redirectTo={typeof redirectTo === "string" ? redirectTo : undefined} />;
}
