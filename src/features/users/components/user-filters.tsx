"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitEvent, useTransition } from "react";
import { userStatusLabels } from "../user.constants";
import type { UserQuery } from "../user.schema";

export function UserFilters({ query }: Readonly<{ query: UserQuery }>) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const items = [
    { value: "", label: "Todos os status" },
    ...Object.entries(userStatusLabels).map(([value, label]) => ({ value, label })),
  ];

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    const search = String(form.get("search") ?? "").trim();
    const status = String(form.get("status") ?? "");
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    startTransition(() => router.push(`/configuracoes/usuarios?${params}`));
  };

  return (
    <form
      key={`${query.search}-${query.status}`}
      className="bg-card flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center"
      onSubmit={handleSubmit}
    >
      <div className="relative min-w-0 flex-1">
        <Search aria-hidden className="text-muted-foreground absolute top-2.5 left-3 size-4" />
        <Input
          name="search"
          aria-label="Buscar usuários por nome ou e-mail"
          placeholder="Buscar por nome ou e-mail"
          defaultValue={query.search}
          maxLength={100}
          className="h-10 pl-9"
        />
      </div>
      <Select name="status" defaultValue={query.status} items={items}>
        <SelectTrigger aria-label="Filtrar por status" className="w-full sm:w-52">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? "Buscando…" : "Filtrar"}
      </Button>
      {query.search || query.status ? (
        <Button
          variant="ghost"
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => router.push("/configuracoes/usuarios"))}
        >
          Limpar
        </Button>
      ) : null}
    </form>
  );
}
