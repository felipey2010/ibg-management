import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { proxy } from "@/proxy";

vi.mock("next-auth/jwt", () => ({ getToken: vi.fn() }));

describe("proteção otimista do dashboard", () => {
  beforeEach(() => vi.mocked(getToken).mockReset());

  it("redireciona visitantes sem sessão para o login", async () => {
    vi.mocked(getToken).mockResolvedValueOnce(null);
    const response = await proxy(new NextRequest("http://localhost?tab=hoje"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost/login?redirectTo=%2F%3Ftab%3Dhoje",
    );
  });

  it("permite continuar com uma sessão ativa", async () => {
    vi.mocked(getToken).mockResolvedValueOnce({
      status: "ACTIVE",
      userId: "user-1",
      permissions: [],
    });
    const response = await proxy(new NextRequest("http://localhost/"));

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("trata falhas na leitura da sessão como acesso não autenticado", async () => {
    vi.mocked(getToken).mockRejectedValueOnce(new Error("invalid token"));
    const response = await proxy(new NextRequest("http://localhost/"));

    expect(response.status).toBe(307);
  });
});
