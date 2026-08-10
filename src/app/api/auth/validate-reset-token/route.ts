import { authEndpoints } from "@/features/auth/services/auth-endpoints";
import { forwardAuthRequest } from "@/features/auth/services/auth-route-handler";

export async function POST(request: Request) {
  return forwardAuthRequest(request, { endpoint: authEndpoints.validateResetToken });
}
