export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-294 animate-pulse" aria-label="Carregando painel" role="status">
      <div className="bg-muted mb-6 h-20 w-72 rounded-lg" />
      <div className="bg-card mb-6 grid overflow-hidden rounded-xl border sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="border-border h-24 p-5 sm:border-l first:sm:border-l-0">
            <div className="bg-muted h-3 w-24 rounded" />
            <div className="bg-muted mt-4 h-6 w-16 rounded" />
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="bg-card h-72 rounded-xl border p-5">
            <div className="bg-muted h-4 w-36 rounded" />
            <div className="mt-8 flex flex-col gap-4">
              <div className="bg-muted h-10 rounded" />
              <div className="bg-muted h-10 rounded" />
              <div className="bg-muted h-10 rounded" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Carregando…</span>
    </div>
  );
}
