import { beforeEach, describe, expect, it, vi } from "vitest";

import { forwardAuthRequest } from "@/features/auth/services/auth-route-handler";
import { requestAuthApi } from "@/features/auth/services/auth-server.service";

vi.mock("@/features/auth/services/auth-server.service", () => ({ requestAuthApi: vi.fn() }));

describe("handler da API de autenticação", () => {
  beforeEach(() => vi.mocked(requestAuthApi).mockReset());

  it("preserva o envelope success, message e data", async () => {
    vi.mocked(requestAuthApi).mockResolvedValueOnce({
      ok: true,
      status: 200,
      response: { success: true, message: "Código enviado.", data: { valid: true } },
    });

    const response = await forwardAuthRequest(
      new Request("http://localhost/api/auth/verify-email", {
        method: "POST",
        headers: { origin: "http://localhost" },
        body: JSON.stringify({ code: "123456" }),
      }),
      { endpoint: "/auth/verify-email" },
    );

    expect(await response.json()).toEqual({
      success: true,
      message: "Código enviado.",
      data: { valid: true },
    });
  });

  it("converte exceções inesperadas em resposta segura", async () => {
    vi.mocked(requestAuthApi).mockRejectedValueOnce(new Error("database details"));

    const response = await forwardAuthRequest(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        headers: { origin: "http://localhost" },
        body: "{}",
      }),
      { endpoint: "/auth/register" },
    );

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      success: false,
      message: "Não foi possível conectar ao serviço de autenticação.",
      data: null,
    });
  });
});
