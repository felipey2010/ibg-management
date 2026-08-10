import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { proxy } from "@/proxy";

describe("proteção otimista do dashboard", () => {
  it("redireciona visitantes sem cookie para o login", () => {
    const response = proxy(new NextRequest("http://localhost/dashboard?tab=hoje"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost/login?redirectTo=%2Fdashboard%3Ftab%3Dhoje",
    );
  });

  it("permite continuar quando há cookie de sessão", () => {
    const response = proxy(
      new NextRequest("http://localhost/dashboard", { headers: { cookie: "ibg_session=token" } }),
    );

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });
});
