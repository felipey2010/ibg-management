import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ClearFiltersLink({
  href,
  visible,
  className,
}: Readonly<{ href: string; visible: boolean; className?: string }>) {
  if (!visible) return null;

  return (
    <Link href={href} className={cn(buttonVariants({ variant: "outline" }), className)}>
      Limpar
    </Link>
  );
}
