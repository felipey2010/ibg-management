import { describe, expect, it } from "vitest";

import { formatCurrency } from "@/lib/utils/format-currency";
import { formatLongDate } from "@/lib/utils/format-date";

describe("formatadores pt-BR", () => {
  it("formata valores em reais", () => {
    expect(formatCurrency(1250)).toBe("R$ 1.250,00");
  });

  it("formata datas longas em português", () => {
    expect(formatLongDate(new Date(2026, 7, 8))).toBe("Sábado, 8 de agosto de 2026");
  });
});
