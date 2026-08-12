import "server-only";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/auth-options";

export async function getSession() {
  try {
    return await getServerSession(authOptions);
  } catch {
    return null;
  }
}
