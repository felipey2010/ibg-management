export function LegalPage({
  title,
  description,
  updatedDate,
  children,
}: {
  title: string;
  description: string;
  updatedDate: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="border-b pb-7">
        <span className="text-primary text-[10px] font-bold tracking-[.16em]">DOCUMENTO LEGAL</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-3 text-sm leading-6">{description}</p>
        <small className="text-muted-foreground mt-3 block text-xs">{updatedDate}</small>
      </div>
      <article className="bg-card text-muted-foreground [&_h2]:text-foreground mt-6 rounded-lg border px-6 py-3 text-sm leading-7 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_p]:mb-3 [&_section]:border-b [&_section]:py-5 [&_section:last-child]:border-0">
        {children}
      </article>
    </div>
  );
}
