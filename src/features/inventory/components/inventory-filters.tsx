import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClearFiltersLink } from "@/components/shared/clear-filters-link";
import type { InventoryQuery } from "../inventory.schema";

export function InventoryFilters({ query }: Readonly<{ query: InventoryQuery }>) {
  return (
    <form
      key={`${query.search}-${query.condition}-${query.active}-${query.lowStock}`}
      action="/estoque"
      className="bg-card grid gap-3 rounded-xl border p-4 lg:grid-cols-[1fr_160px_150px_150px_auto_auto]"
    >
      <Input name="search" defaultValue={query.search} placeholder="Buscar item ou descrição" />
      <select
        name="condition"
        defaultValue={query.condition}
        className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
      >
        <option value="">Conservação</option>
        <option value="NEW">Novo</option>
        <option value="GOOD">Bom</option>
        <option value="FAIR">Regular</option>
        <option value="DAMAGED">Danificado</option>
        <option value="UNUSABLE">Inutilizável</option>
      </select>
      <select
        name="active"
        defaultValue={query.active}
        className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
      >
        <option value="">Todos os itens</option>
        <option value="true">Ativos</option>
        <option value="false">Inativos</option>
      </select>
      <select
        name="lowStock"
        defaultValue={query.lowStock}
        className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
      >
        <option value="">Todo estoque</option>
        <option value="true">Estoque baixo</option>
      </select>
      <Button type="submit">Filtrar</Button>
      <ClearFiltersLink
        href="/estoque"
        visible={!!(query.search || query.condition || query.active || query.lowStock)}
      />
    </form>
  );
}
