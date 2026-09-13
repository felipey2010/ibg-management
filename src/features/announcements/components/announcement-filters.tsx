import { Button } from "@/components/ui/button";
import { ClearFiltersLink } from "@/components/shared/clear-filters-link";
import { Input } from "@/components/ui/input";
import type { AnnouncementQuery } from "../announcement.schema";
export function AnnouncementFilters({ query }: Readonly<{ query: AnnouncementQuery }>) {
  return (
    <form
      key={`${query.search}-${query.status}-${query.audience}`}
      action="/avisos"
      className="bg-card grid gap-3 rounded-xl border p-4 md:grid-cols-[1fr_170px_210px_auto_auto]"
    >
      <Input
        name="search"
        defaultValue={query.search}
        placeholder="Buscar por título ou conteúdo"
        aria-label="Buscar avisos"
      />
      <select
        name="status"
        defaultValue={query.status}
        className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
        aria-label="Filtrar status"
      >
        <option value="">Todos os status</option>
        <option value="DRAFT">Rascunhos</option>
        <option value="PUBLISHED">Publicados</option>
      </select>
      <select
        name="audience"
        defaultValue={query.audience}
        className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
        aria-label="Filtrar público"
      >
        <option value="">Todos os públicos</option>
        <option value="ALL_MEMBERS">Todos os membros</option>
        <option value="VISITORS">Visitantes</option>
        <option value="CHURCH_LEADERS">Liderança</option>
        <option value="MINISTRY">Ministério</option>
        <option value="ALL_USERS">Todos os usuários</option>
      </select>
      <Button type="submit">Filtrar</Button>
      <ClearFiltersLink href="/avisos" visible={!!(query.search || query.status || query.audience)} />
    </form>
  );
}
