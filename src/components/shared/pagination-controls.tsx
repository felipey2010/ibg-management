import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  getPageHref: (page: number) => string;
  className?: string;
};

export function PaginationControls({
  currentPage,
  totalPages,
  getPageHref,
  className,
}: Readonly<PaginationControlsProps>) {
  if (totalPages <= 1) return null;

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <nav
      aria-label="Paginação"
      className={cn("flex flex-wrap items-center justify-between gap-3", className)}
    >
      <p className="text-muted-foreground text-xs" aria-live="polite">
        Página {currentPage} de {totalPages}
      </p>
      <div className="flex gap-2">
        {hasPreviousPage ? (
          <Link
            href={getPageHref(currentPage - 1)}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ChevronLeft aria-hidden /> Anterior
          </Link>
        ) : (
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft aria-hidden /> Anterior
          </Button>
        )}
        {hasNextPage ? (
          <Link
            href={getPageHref(currentPage + 1)}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Próxima <ChevronRight aria-hidden />
          </Link>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Próxima <ChevronRight aria-hidden />
          </Button>
        )}
      </div>
    </nav>
  );
}
