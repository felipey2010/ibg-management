import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";

type Props = {
  name: string;
  src?: string | null;
  className?: string;
  fallbackClassName?: string;
  alt?: string;
};

function AvatarPhoto({ name, src, className, fallbackClassName, alt }: Props) {
  return (
    <div className={cn("bg-card h-full w-full rounded-full", className)}>
      <Avatar className="h-full w-full">
        <AvatarImage src={src || ""} alt={alt ?? "Avatar do usuário"} />
        <AvatarFallback className={cn("text-xs", fallbackClassName)}>{getInitials(name)}</AvatarFallback>
      </Avatar>
    </div>
  );
}

export default AvatarPhoto;
