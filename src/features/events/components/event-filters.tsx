import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { EventQuery } from "../event.schema";
export function EventFilters({ query }: Readonly<{ query: EventQuery }>) {
  return (
    <form
      action="/eventos"
      className="bg-card grid gap-3 rounded-xl border p-4 md:grid-cols-[1fr_170px_170px_auto]"
    >
      <Input
        name="search"
        defaultValue={query.search}
        placeholder="Buscar por título, local ou descrição"
        aria-label="Buscar eventos"
      />
      <select
        name="status"
        defaultValue={query.status}
        className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
      >
        <option value="">Todos os status</option>
        <option value="DRAFT">Rascunhos</option>
        <option value="PUBLISHED">Publicados</option>
        <option value="CANCELED">Cancelados</option>
        <option value="COMPLETED">Concluídos</option>
      </select>
      <select
        name="period"
        defaultValue={query.period}
        className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
      >
        <option value="">Todas as datas</option>
        <option value="upcoming">Próximos</option>
        <option value="past">Realizados</option>
      </select>
      <Button type="submit">Filtrar</Button>
    </form>
  );
}
