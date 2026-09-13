import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PaginationControls } from "./pagination-controls";

describe("PaginationControls", () => {
  afterEach(cleanup);

  it("does not render for a single page", () => {
    render(<PaginationControls currentPage={1} totalPages={1} getPageHref={(page) => `?page=${page}`} />);
    expect(screen.queryByRole("navigation", { name: "Paginação" })).not.toBeInTheDocument();
  });

  it("builds previous and next links while preserving the caller's URL rules", () => {
    render(
      <PaginationControls
        currentPage={2}
        totalPages={4}
        getPageHref={(page) => `/membros?page=${page}&status=ACTIVE`}
      />,
    );
    expect(screen.getByRole("link", { name: /Anterior/ })).toHaveAttribute(
      "href",
      "/membros?page=1&status=ACTIVE",
    );
    expect(screen.getByRole("link", { name: /Próxima/ })).toHaveAttribute(
      "href",
      "/membros?page=3&status=ACTIVE",
    );
  });
});
