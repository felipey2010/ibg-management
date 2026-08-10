import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ title, description, icon, children, className }: Readonly<AuthCardProps>) {
  return (
    <div className={cn("w-full max-w-md", className)}>
      <header className="mb-7 text-center">
        {icon ? (
          <span className="bg-primary/10 text-primary mx-auto mb-4 flex size-11 items-center justify-center rounded-full">
            {icon}
          </span>
        ) : null}
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm leading-6">{description}</p>
      </header>
      {children}
    </div>
  );
}
