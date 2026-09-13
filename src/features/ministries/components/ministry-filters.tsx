import { Button } from "@/components/ui/button";
import { ClearFiltersLink } from "@/components/shared/clear-filters-link";
import { Input } from "@/components/ui/input";
import type { MinistryQuery } from "../ministry.schema";
export function MinistryFilters({ query }: Readonly<{ query: MinistryQuery }>) {
  return (
    <form
      key={`${query.search}-${query.status}`}
      className="bg-card grid gap-3 rounded-xl border p-4 sm:grid-cols-[1fr_180px_auto_auto]"
      action="/ministerios"
    >
      <Input
        name="search"
        defaultValue={query.search}
        placeholder="Buscar por nome ou descrição"
        aria-label="Buscar ministérios"
      />
      <select
        name="status"
        defaultValue={query.status}
        className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
        aria-label="Filtrar por status"
      >
        <option value="">Todos os status</option>
        <option value="ACTIVE">Ativos</option>
        <option value="INACTIVE">Inativos</option>
      </select>
      <Button type="submit">Filtrar</Button>
      <ClearFiltersLink href="/ministerios" visible={!!(query.search || query.status)} />
    </form>
  );
}
