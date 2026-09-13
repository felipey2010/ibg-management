import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
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

  it("supports client-side pagination callbacks", async () => {
    const onPageChange = vi.fn();
    render(<PaginationControls currentPage={2} totalPages={3} onPageChange={onPageChange} />);

    await userEvent.click(screen.getByRole("button", { name: /Próxima/ }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
