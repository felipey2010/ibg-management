import { ClearFiltersLink } from "@/components/shared/clear-filters-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ContributionQuery } from "../contribution.schema";

export function ContributionFilters({ query }: Readonly<{ query: ContributionQuery }>) {
  return (
    <form
      key={`${query.search}-${query.type}-${query.status}`}
      action="/contribuicoes"
      className="bg-card grid gap-3 rounded-xl border p-4 md:grid-cols-[1fr_160px_160px_auto_auto]"
    >
      <Input
        name="search"
        defaultValue={query.search}
        placeholder="Buscar campanha"
        aria-label="Buscar campanhas"
      />
      <select
        name="type"
        defaultValue={query.type}
        className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
      >
        <option value="">Todos os tipos</option>
        <option value="FINANCIAL">Financeiras</option>
        <option value="ITEM">Itens</option>
      </select>
      <select
        name="status"
        defaultValue={query.status}
        className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
      >
        <option value="">Todos os status</option>
        <option value="DRAFT">Rascunhos</option>
        <option value="ACTIVE">Ativas</option>
        <option value="CLOSED">Encerradas</option>
        <option value="ARCHIVED">Arquivadas</option>
      </select>
      <Button type="submit">Filtrar</Button>
      <ClearFiltersLink href="/contribuicoes" visible={!!(query.search || query.type || query.status)} />
    </form>
  );
}
