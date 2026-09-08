import "server-only";
import { getApiSession } from "./api-session";

export async function getSession() {
  try {
    const session = await getApiSession();
    if (!session) return null;

    const { user, expires, accessTokenExpires } = session;
    return { user, expires, accessTokenExpires };
  } catch {
    return null;
  }
}
