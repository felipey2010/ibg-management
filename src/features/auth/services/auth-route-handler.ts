import { NextResponse } from "next/server";

import { requestAuthApi } from "@/features/auth/services/auth-server.service";
import type { AuthApiResponse } from "@/features/auth/types/auth.types";

interface ForwardOptions {
  endpoint: string;
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
    const result = await requestAuthApi<AuthApiResponse>(options.endpoint, {
      method: request.method,
      body: body || undefined,
    });
    const data = result.response.data;

    return NextResponse.json(
      result.ok
        ? {
            success: true,
            message: result.response.message,
            data,
          }
        : {
            success: false,
            message: getSafeMessage(result.status),
            data: data ? { valid: data.valid, reason: data.reason } : null,
          },
      { status: result.status },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Não foi possível conectar ao serviço de autenticação.", data: null },
      { status: 503 },
    );
  }
}
