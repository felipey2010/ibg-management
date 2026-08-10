import { NextResponse } from "next/server";

import { parseAuthResponse, requestAuthApi } from "@/features/auth/services/auth-server.service";
import { sessionCookieName, sessionCookieOptions } from "@/lib/auth/auth-cookie";

interface ForwardOptions {
  endpoint: string;
  setSession?: boolean;
  clearSession?: boolean;
  includeSession?: boolean;
}

function getSafeMessage(status: number): string {
  if (status === 400) return "Os dados enviados não são válidos.";
  if (status === 401) return "Não foi possível autenticar com as informações fornecidas.";
  if (status === 403) return "Esta conta não está autorizada a acessar a plataforma.";
  if (status === 409) return "Não foi possível concluir a solicitação com os dados informados.";
  if (status === 429) return "Muitas tentativas foram realizadas. Aguarde e tente novamente.";
  return "Não foi possível concluir a solicitação. Tente novamente.";
}

export async function forwardAuthRequest(request: Request, options: ForwardOptions): Promise<NextResponse> {
  try {
    const origin = request.headers.get("origin");
    if (request.method !== "GET" && origin && origin !== new URL(request.url).origin) {
      return NextResponse.json({ message: "Origem da solicitação não permitida." }, { status: 403 });
    }

    const body = request.method === "GET" ? undefined : await request.text();
    const cookieHeader = request.headers.get("cookie") ?? "";
    const token = options.includeSession
      ? cookieHeader.match(new RegExp(`(?:^|;\\s*)${sessionCookieName}=([^;]+)`))?.[1]
      : undefined;
    const upstream = await requestAuthApi(
      options.endpoint,
      { method: request.method, body: body || undefined },
      token ? decodeURIComponent(token) : undefined,
    );
    const data = await parseAuthResponse(upstream);
    const response = NextResponse.json(
      upstream.ok
        ? {
            message: data.message,
            user: data.user,
            status: data.status,
            valid: data.valid,
            reason: data.reason,
          }
        : { message: getSafeMessage(upstream.status), valid: data.valid, reason: data.reason },
      { status: upstream.status },
    );

    if (options.setSession && upstream.ok) {
      const sessionToken = data.accessToken ?? data.token;

      if (!sessionToken) {
        return NextResponse.json({ message: "A API não retornou uma sessão válida." }, { status: 502 });
      }

      response.cookies.set(sessionCookieName, sessionToken, sessionCookieOptions);
    }

    if (options.clearSession) {
      response.cookies.set(sessionCookieName, "", { ...sessionCookieOptions, maxAge: 0 });
    }

    return response;
  } catch {
    return NextResponse.json(
      { message: "Não foi possível conectar ao serviço de autenticação." },
      { status: 503 },
    );
  }
}
